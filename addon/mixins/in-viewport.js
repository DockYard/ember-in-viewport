/* eslint-disable ember/no-new-mixins, ember/no-get, ember/no-observers, ember/no-incorrect-calls-with-inline-anonymous-functions */
import { assign } from '@ember/polyfills';
import Mixin from '@ember/object/mixin';
import { typeOf } from '@ember/utils';
import { assert, debug, deprecate } from '@ember/debug';
import { inject } from '@ember/service';
import { set, get, setProperties } from '@ember/object';
import { bind, debounce, scheduleOnce } from '@ember/runloop';
import { not } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import { startRAF } from 'ember-in-viewport/-private/raf-admin';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';
import canUseRAF from 'ember-in-viewport/utils/can-use-raf';
import findElem from 'ember-in-viewport/utils/find-elem';
import canUseIntersectionObserver from 'ember-in-viewport/utils/can-use-intersection-observer';
import checkScrollDirection from 'ember-in-viewport/utils/check-scroll-direction';

const lastDirection = {};
const lastPosition = {};

export default Mixin.create({
  /**
   * @property _debouncedEventHandler
   * @default null
   */
  _debouncedEventHandler: null,

  /**
   * unbinding listeners will short circuit rAF
   *
   * @property _stopListening
   * @default false
   */
  _stopListening: false,

  inViewport: inject(),

  /**
   * @property viewportExited
   * @type Boolean
   */
  viewportExited: not('viewportEntered').readOnly(),

  init() {
    // ensure this mixin runs first, then your component can override the options
    this._super(...arguments);

    let options = assign(
      {
        viewportUseRAF: canUseRAF(),
        viewportEntered: false,
        viewportListeners: [],
      },
      this._buildOptions()
    );

    // set viewportUseIntersectionObserver after merging users config to avoid errors in browsers that lack support (https://github.com/DockYard/ember-in-viewport/issues/146)
    options = assign(options, {
      viewportUseIntersectionObserver: canUseIntersectionObserver(),
    });

    setProperties(this, options);
    set(this, '_evtListenerClosures', []);
  },

  didInsertElement() {
    this._super(...arguments);

    deprecate(
      'This mixin is deprecated. We suggest you migrate to the inViewport service or use the {{in-viewport}} modifier',
      false,
      {
        id: 'ember-in-viewport.mixin',
        until: '4.0.0',
        url: 'https://github.com/DockYard/ember-in-viewport#readme',
      }
    );

    if (!canUseDOM) {
      return;
    }

    const viewportEnabled = get(this, 'viewportEnabled');
    if (viewportEnabled) {
      this.watchElement(get(this, 'element'));
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this._unbindListeners(get(this, 'element'));
  },

  _buildOptions(defaultOptions = {}) {
    const owner = getOwner(this);

    if (owner) {
      return assign(defaultOptions, owner.lookup('config:in-viewport'));
    }
  },

  watchElement(element) {
    this._setInitialViewport(element);
    this._addObserverIfNotSpying(element);

    const viewportDidScroll = get(this, 'viewportDidScroll');
    if (viewportDidScroll) {
      debug(
        '[viewportDidScroll] This will be false by default in the next major release'
      );
      this._bindScrollDirectionListener(get(this, 'viewportScrollSensitivity'));
    }

    if (
      !get(this, 'viewportUseIntersectionObserver') &&
      !get(this, 'viewportUseRAF')
    ) {
      get(this, 'viewportListeners').forEach((listener) => {
        let { context, event } = listener;
        context = get(this, 'scrollableArea') || context;
        this._bindListeners(context, event, element);
      });
    }
  },

  _addObserverIfNotSpying(element) {
    if (!get(this, 'viewportSpy')) {
      this.addObserver(
        'viewportEntered',
        this,
        bind(this, '_unbindIfEntered', element)
      );
    }
  },

  _setInitialViewport(element) {
    const isTearingDown = this.isDestroyed || this.isDestroying;
    if (!element || isTearingDown) {
      return;
    }

    const inViewport = get(this, 'inViewport');

    if (get(this, 'viewportUseIntersectionObserver')) {
      return scheduleOnce('afterRender', this, () => {
        const scrollableArea = get(this, 'scrollableArea');
        const viewportTolerance = get(this, 'viewportTolerance');
        const intersectionThreshold = get(this, 'intersectionThreshold');

        inViewport.watchElement(
          element,
          { intersectionThreshold, viewportTolerance, scrollableArea },
          bind(this, this._onEnterIntersection),
          bind(this, this._onExitIntersection)
        );
      });
    } else if (get(this, 'viewportUseRAF')) {
      inViewport.startRAF();

      const scrollableArea = get(this, 'scrollableArea');
      const viewportTolerance = get(this, 'viewportTolerance');
      const viewportSpy = get(this, 'viewportSpy');

      const enterCallback = () => {
        const isTearingDown = this.isDestroyed || this.isDestroying;
        const viewportEntered =
          element.getAttribute('data-in-viewport-entered') === 'true';
        if (!isTearingDown && (viewportSpy || viewportEntered)) {
          set(this, 'viewportEntered', true);
          this.trigger('didEnterViewport');
        }
      };
      const exitCallback = () => {
        const isTearingDown = this.isDestroyed || this.isDestroying;
        if (!isTearingDown && viewportSpy) {
          set(this, 'viewportEntered', false);
          this.trigger('didExitViewport');
        }
      };

      startRAF(
        element,
        { scrollableArea, viewportTolerance, viewportSpy },
        enterCallback,
        exitCallback,
        inViewport.addRAF.bind(inViewport, element.id),
        inViewport.removeRAF.bind(inViewport, element.id)
      );
    } else {
      return scheduleOnce('afterRender', this, () => {
        this._setViewportEntered(element);
      });
    }
  },

  /**
   * used by rAF and scroll event listeners to determine if mixin is in viewport
   * Remember to set `viewportSpy` to true if you want to continuously observe your element
   *
   * @method _setViewportEntered
   */
  _setViewportEntered(element) {
    const scrollableArea = get(this, 'scrollableArea')
      ? document.querySelector(get(this, 'scrollableArea'))
      : undefined;

    const height = scrollableArea
      ? scrollableArea.offsetHeight + scrollableArea.getBoundingClientRect().top
      : window.innerHeight;
    const width = scrollableArea
      ? scrollableArea.offsetWidth + scrollableArea.getBoundingClientRect().left
      : window.innerWidth;
    const boundingClientRect = element.getBoundingClientRect();

    if (boundingClientRect) {
      this._triggerDidAccessViewport(
        get(this, 'inViewport').isInViewport(
          boundingClientRect,
          height,
          width,
          get(this, 'viewportTolerance')
        ),
        get(this, 'viewportEntered')
      );

      if (get(this, 'viewportUseRAF') && !get(this, '_stopListening')) {
        get(this, 'inViewport').addRAF(
          get(this, 'elementId'),
          bind(this, this._setViewportEntered, element)
        );
      }
    }
  },

  /**
   * Callback provided to IntersectionObserver
   * trigger didEnterViewport callback
   *
   * @method _onEnterIntersection
   */
  _onEnterIntersection() {
    const isTearingDown = this.isDestroyed || this.isDestroying;

    if (!isTearingDown) {
      set(this, 'viewportEntered', true);
    }

    this.trigger('didEnterViewport');
  },

  /**
   * trigger didExitViewport callback
   *
   * @method _onExitIntersection
   */
  _onExitIntersection() {
    const isTearingDown = this.isDestroyed || this.isDestroying;

    if (!isTearingDown) {
      set(this, 'viewportEntered', false);
    }

    this.trigger('didExitViewport');
  },

  /**
   * @method _triggerDidScrollDirection
   * @param contextEl
   * @param sensitivity
   */
  _triggerDidScrollDirection(contextEl = null, sensitivity = 1) {
    assert(
      'You must pass a valid context element to _triggerDidScrollDirection',
      contextEl
    );
    assert('sensitivity cannot be 0', sensitivity);

    const elementId = get(this, 'elementId');
    const lastDirectionForEl = lastDirection[elementId];
    const lastPositionForEl = lastPosition[elementId];
    const newPosition = {
      top: contextEl.scrollTop,
      left: contextEl.scrollLeft,
    };

    const scrollDirection = checkScrollDirection(
      lastPositionForEl,
      newPosition,
      sensitivity
    );
    const directionChanged = scrollDirection !== lastDirectionForEl;

    if (scrollDirection && directionChanged && get(this, 'viewportDidScroll')) {
      this.trigger('didScroll', scrollDirection);
      lastDirection[elementId] = scrollDirection;
    }

    lastPosition[elementId] = newPosition;
  },

  /**
   * @method _triggerDidAccessViewport
   * @param hasEnteredViewport
   * @param viewportEntered
   */
  _triggerDidAccessViewport(hasEnteredViewport = false, viewportEntered) {
    const isTearingDown = this.isDestroyed || this.isDestroying;
    if (isTearingDown) {
      return;
    }

    const didEnter = !viewportEntered && hasEnteredViewport;
    const didLeave = viewportEntered && !hasEnteredViewport;
    let triggeredEventName = '';

    if (didEnter) {
      triggeredEventName = 'didEnterViewport';
    }

    if (didLeave) {
      triggeredEventName = 'didExitViewport';
    }

    if (get(this, 'viewportSpy') || !viewportEntered) {
      set(this, 'viewportEntered', hasEnteredViewport);
    }

    if (triggeredEventName) {
      this.trigger(triggeredEventName);
    }
  },

  /**
   * Unbind when enter viewport only if viewportSpy is false
   *
   * @method _unbindIfEntered
   */
  _unbindIfEntered(element) {
    if (get(this, 'viewportEntered')) {
      this._unbindListeners(element);
      this.removeObserver('viewportEntered', this, '_unbindIfEntered');
      set(this, 'viewportEntered', false);
    }
  },

  /**
   * General utility function
   *
   * @method _debouncedEvent
   */
  _debouncedEvent(methodName, ...args) {
    assert('You must pass a methodName to _debouncedEvent', methodName);
    assert('methodName must be a string', typeOf(methodName) === 'string');

    debounce(
      this,
      () => this[methodName](...args),
      get(this, 'viewportRefreshRate')
    );
  },

  _bindScrollDirectionListener(sensitivity = 1) {
    assert('sensitivity cannot be 0', sensitivity);

    const contextEl = get(this, 'scrollableArea') || window;
    const elem = findElem(contextEl);

    this._debouncedEventHandler = this._debouncedEvent.bind(
      this,
      '_triggerDidScrollDirection',
      elem,
      sensitivity
    );
    elem.addEventListener('scroll', this._debouncedEventHandler, {
      passive: true,
    });
  },

  _unbindScrollDirectionListener() {
    const elementId = get(this, 'elementId');
    const context = get(this, 'scrollableArea') || window;
    const elem = findElem(context);

    if (elem) {
      elem.removeEventListener('scroll', this._debouncedEventHandler, {
        passive: true,
      });
      delete lastPosition[elementId];
      delete lastDirection[elementId];
    }
  },

  /**
   * Only if not using IntersectionObserver and rAF
   *
   * @method _bindListeners
   */
  _bindListeners(context = null, event = null, element = null) {
    assert('You must pass a valid context to _bindListeners', context);
    assert('You must pass a valid event to _bindListeners', event);

    let elem = findElem(context);

    let evtListener = () =>
      this._debouncedEvent('_setViewportEntered', element);
    this._evtListenerClosures.push({ event: event, evtListener });
    elem.addEventListener(event, evtListener, false);
  },

  /**
   * Remove listeners for rAF or scroll event listeners
   * Either from component destroy or viewport entered and
   * need to turn off listening
   *
   * @method _unbindListeners
   */
  _unbindListeners(element) {
    set(this, '_stopListening', true);

    // if IntersectionObserver
    if (
      get(this, 'viewportUseIntersectionObserver') &&
      get(this, 'viewportEnabled')
    ) {
      get(this, 'inViewport').unobserveIntersectionObserver(element);
    }

    // if rAF
    if (
      !get(this, 'viewportUseIntersectionObserver') &&
      get(this, 'viewportUseRAF')
    ) {
      const elementId = get(this, 'elementId');

      get(this, 'inViewport').removeRAF(elementId);
    }

    // if scroll event listeners
    if (
      !get(this, 'viewportUseIntersectionObserver') &&
      !get(this, 'viewportUseRAF')
    ) {
      get(this, 'viewportListeners').forEach((listener) => {
        let { context, event } = listener;
        context = get(this, 'scrollableArea') || context;
        let elem = findElem(context);
        let { evtListener } =
          this._evtListenerClosures.find(
            (closure) => event === closure.event
          ) || {};

        elem.removeEventListener(event, evtListener, false);
      });
    }

    // 4. last but not least
    const viewportDidScroll = get(this, 'viewportDidScroll');
    if (viewportDidScroll) {
      this._unbindScrollDirectionListener();
    }
  },
});
