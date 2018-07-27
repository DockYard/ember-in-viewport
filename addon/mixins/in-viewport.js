import { assign } from '@ember/polyfills';
import Mixin from '@ember/object/mixin';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { inject } from '@ember/service';
import { set, get, setProperties } from '@ember/object';
import { next, bind, debounce, scheduleOnce } from '@ember/runloop';
import { not } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';
import canUseRAF from 'ember-in-viewport/utils/can-use-raf';
import findElem from 'ember-in-viewport/utils/find-elem';
import canUseIntersectionObserver from 'ember-in-viewport/utils/can-use-intersection-observer';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
import checkScrollDirection from 'ember-in-viewport/utils/check-scroll-direction';

const rAFIDS = {};
const lastDirection = {};
const lastPosition = {};

export default Mixin.create({
  /**
   * IntersectionObserverEntry
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
   *
   * @property intersectionObserver
   * @default null
   */
  intersectionObserver: null,
  /**
   * @property _debouncedEventHandler
   * @default null
   */
  _debouncedEventHandler: null,

  /**
   * @property _observerOptions
   * @default null
   */
  _observerOptions: null,

  /**
   * unbinding listeners will short circuit rAF
   *
   * @property _stopListening
   * @default false
   */
  _stopListening: false,

  _observerAdmin: inject('-observer-admin'),
  _rAFAdmin: inject('-raf-admin'),

  /**
   * @property viewportExited
   * @type Boolean
   */
  viewportExited: not('viewportEntered').readOnly(),

  init() {
    // ensure this mixin runs first, then your component can override the options
    this._super(...arguments);

    let options = assign({
      viewportUseRAF: canUseRAF(),
      viewportEntered: false,
      viewportListeners: []
    }, this._buildOptions());

    // set viewportUseIntersectionObserver after merging users config to avoid errors in browsers that lack support (https://github.com/DockYard/ember-in-viewport/issues/146)
    options = assign(options, {
      viewportUseIntersectionObserver: canUseIntersectionObserver(),
    });

    setProperties(this, options);
    set(this, '_evtListenerClosures', []);
  },

  didInsertElement() {
    this._super(...arguments);

    if (!canUseDOM) {
      return;
    }

    const viewportEnabled = get(this, 'viewportEnabled');
    if (viewportEnabled) {
      this._startListening();
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this._unbindListeners();
  },

  _buildOptions(defaultOptions = {}) {
    const owner = getOwner(this);

    if (owner) {
      return assign(defaultOptions, owner.lookup('config:in-viewport'));
    }
  },

  _startListening() {
    this._setInitialViewport();
    this._addObserverIfNotSpying();
    this._bindScrollDirectionListener(get(this, 'viewportScrollSensitivity'));

    if (!get(this, 'viewportUseIntersectionObserver') && !get(this, 'viewportUseRAF')) {
      get(this, 'viewportListeners').forEach((listener) => {
        let { context, event } = listener;
        context = get(this, 'scrollableArea') || context;
        this._bindListeners(context, event);
      });
    }
  },

  _addObserverIfNotSpying() {
    if (!get(this, 'viewportSpy')) {
      this.addObserver('viewportEntered', this, this._unbindIfEntered);
    }
  },

  _setInitialViewport() {
    if (get(this, 'viewportUseIntersectionObserver')) {
      return scheduleOnce('afterRender', this, () => {
        this._setupIntersectionObserver();
      });
    } else {
      return scheduleOnce('afterRender', this, () => {
        this._setViewportEntered();
      });
    }
  },

  /**
   * @method _setupIntersectionObserver
   */
  _setupIntersectionObserver() {
    const scrollableArea = get(this, 'scrollableArea') ? document.querySelector(get(this, 'scrollableArea')) : undefined;

    const element = get(this, 'element');
    if (!element) {
      return;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // IntersectionObserver takes either a Document Element or null for `root`
    const { top = 0, left = 0, bottom = 0, right = 0 } = this.viewportTolerance;
    this._observerOptions = {
      root: scrollableArea,
      rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
      threshold: get(this, 'intersectionThreshold')
    };

    get(this, '_observerAdmin').add(element, bind(this, this._onEnterIntersection), bind(this, this._onExitIntersection), this._observerOptions);
  },

  /**
   * used by rAF and scroll event listeners to determine if mixin is in viewport
   * Remember to set `viewportSpy` to true if you want to continuously observe your element
   *
   * @method _setViewportEntered
   */
  _setViewportEntered() {
    const scrollableArea = get(this, 'scrollableArea') ? document.querySelector(get(this, 'scrollableArea')) : undefined;

    const element = get(this, 'element');
    if (!element) {
      return;
    }

    const height = scrollableArea ? scrollableArea.offsetHeight + scrollableArea.getBoundingClientRect().top : window.innerHeight;
    const width = scrollableArea ? scrollableArea.offsetWidth : window.innerWidth;
    const boundingClientRect = element.getBoundingClientRect();

    if (boundingClientRect) {
      this._triggerDidAccessViewport(
        isInViewport(
          boundingClientRect,
          height,
          width,
          get(this, 'viewportTolerance')
        )
      );

      if (get(this, 'viewportUseRAF') && !get(this, '_stopListening')) {
        let elementId = get(this, 'elementId');
        rAFIDS[elementId] = get(this, '_rAFAdmin').add(
          elementId,
          bind(this, this._setViewportEntered)
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
    assert('You must pass a valid context element to _triggerDidScrollDirection', contextEl);
    assert('sensitivity cannot be 0', sensitivity);

    const elementId = get(this, 'elementId');
    const lastDirectionForEl = lastDirection[elementId];
    const lastPositionForEl = lastPosition[elementId];
    const newPosition = {
      top: contextEl.scrollTop,
      left: contextEl.scrollLeft
    };

    const scrollDirection = checkScrollDirection(lastPositionForEl, newPosition, sensitivity);
    const directionChanged = scrollDirection !== lastDirectionForEl;

    if (scrollDirection && directionChanged && get(this, 'viewportEntered')) {
      this.trigger('didScroll', scrollDirection);
      lastDirection[elementId] = scrollDirection;
    }

    lastPosition[elementId] = newPosition;
  },

  /**
   * @method _triggerDidAccessViewport
   * @param hasEnteredViewport
   */
  _triggerDidAccessViewport(hasEnteredViewport = false) {
    const viewportEntered = get(this, 'viewportEntered');
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

    this.trigger(triggeredEventName);
  },

  /**
   * Unbind when enter viewport only if viewportSpy is false
   *
   * @method _unbindIfEntered
   */
  _unbindIfEntered() {
    if (get(this, 'viewportEntered')) {
      this._unbindListeners();
      this.removeObserver('viewportEntered', this, this._unbindIfEntered);
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

    debounce(this, () => this[methodName](...args), get(this, 'viewportRefreshRate'));
  },

  _bindScrollDirectionListener(sensitivity = 1) {
    assert('sensitivity cannot be 0', sensitivity);

    const contextEl = get(this, 'scrollableArea') || window;
    const elem = findElem(contextEl);

    this._debouncedEventHandler = this._debouncedEvent.bind(this, '_triggerDidScrollDirection', elem, sensitivity);
    elem.addEventListener('scroll', this._debouncedEventHandler, false);
  },

  _unbindScrollDirectionListener() {
    const elementId = get(this, 'elementId');
    const context = get(this, 'scrollableArea') || window;
    const elem = findElem(context);

    if (elem) {
      elem.removeEventListener('scroll', this._debouncedEventHandler, false);
      delete lastPosition[elementId];
      delete lastDirection[elementId];
    }
  },

  /**
   * Only if not using IntersectionObserver and rAF
   *
   * @method _bindListeners
   */
  _bindListeners(context = null, event = null) {
    assert('You must pass a valid context to _bindListeners', context);
    assert('You must pass a valid event to _bindListeners', event);

    let elem = findElem(context);

    let evtListener = (() => this._debouncedEvent('_setViewportEntered'));
    this._evtListenerClosures.push({ event: event, evtListener });
    elem.addEventListener(event, evtListener);
  },

  /**
   * Remove listeners for rAF or scroll event listeners
   * Either from component destroy or viewport entered and
   * need to turn off listening
   *
   * @method _unbindListeners
   */
  _unbindListeners() {
    set(this, '_stopListening', true);

    // if IntersectionObserver
    if (get(this, 'viewportUseIntersectionObserver')) {
      get(this, '_observerAdmin').unobserve(this.element, get(this, '_observerOptions.root'));
    }

    // if rAF
    if (!get(this, 'viewportUseIntersectionObserver') && get(this, 'viewportUseRAF')) {
      const elementId = get(this, 'elementId');

      next(this, () => {
        let _rAFAdmin = get(this, '_rAFAdmin');
        _rAFAdmin.remove(elementId);
        _rAFAdmin.cancel();
        delete rAFIDS[elementId];
      });
    }

    // if scroll event listeners
    if (!get(this, 'viewportUseIntersectionObserver') && !get(this, 'viewportUseRAF')) {
      get(this, 'viewportListeners').forEach((listener) => {
        let { context, event } = listener;
        context = get(this, 'scrollableArea') || context;
        let elem = findElem(context);
        let { evtListener } = this._evtListenerClosures.find((closure) => event === closure.event) || {};

        elem.removeEventListener(event, evtListener);
      });
    }

    // 4.
    this._unbindScrollDirectionListener();
  },
});
