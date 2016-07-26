import Ember from 'ember';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';
import canUseRAF from 'ember-in-viewport/utils/can-use-raf';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
import checkScrollDirection from 'ember-in-viewport/utils/check-scroll-direction';
import getOwner from 'ember-getowner-polyfill';

const {
  Mixin,
  setProperties,
  typeOf,
  assert,
  $,
  get,
  set,
  run: { scheduleOnce, debounce, bind, next },
  computed: { not }
} = Ember;

const assign = Ember.assign || Ember.merge;

const rAFIDS = {};
const lastDirection = {};
const lastPosition = {};

export default Mixin.create({
  viewportExited: not('viewportEntered').readOnly(),

  init() {
    this._super(...arguments);
    const options = assign({
      viewportUseRAF: canUseRAF(),
      viewportEntered: false,
      viewportListeners: []
    }, this._buildOptions());

    setProperties(this, options);
  },

  didInsertElement() {
    this._super(...arguments);

    if (!canUseDOM) {
      return;
    }

    this._setInitialViewport(window);
    this._addObserverIfNotSpying();
    this._bindScrollDirectionListener(window, get(this, 'viewportScrollSensitivity'));

    if (!get(this, 'viewportUseRAF')) {
      get(this, 'viewportListeners').forEach((listener) => {
        const { context, event } = listener;
        this._bindListeners(context, event);
      });
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

  _addObserverIfNotSpying() {
    if (!get(this, 'viewportSpy')) {
      this.addObserver('viewportEntered', this, this._unbindIfEntered);
    }
  },

  _setViewportEntered(context = null) {
    assert('You must pass a valid context to _setViewportEntered', context);

    const element = get(this, 'element');

    if (!element) {
      return;
    }

    const $contextEl = $(context);
    const boundingClientRect = element.getBoundingClientRect();

    this._triggerDidAccessViewport(
      isInViewport(
        boundingClientRect,
        $contextEl.innerHeight(),
        $contextEl.innerWidth(),
        get(this, 'viewportTolerance')
      )
    );

    if (boundingClientRect && get(this, 'viewportUseRAF')) {
      rAFIDS[get(this, 'elementId')] = window.requestAnimationFrame(
        bind(this, this._setViewportEntered, context)
      );
    }
  },

  _triggerDidScrollDirection($contextEl = null, sensitivity = 1) {
    assert('You must pass a valid context element to _triggerDidScrollDirection', $contextEl);
    assert('sensitivity cannot be 0', sensitivity);

    const elementId = get(this, 'elementId');
    const lastDirectionForEl = lastDirection[elementId];
    const lastPositionForEl = lastPosition[elementId];
    const newPosition = {
      top: $contextEl.scrollTop(),
      left: $contextEl.scrollLeft()
    };

    const scrollDirection = checkScrollDirection(lastPositionForEl, newPosition, sensitivity);
    const directionChanged = scrollDirection !== lastDirectionForEl;

    if (scrollDirection && directionChanged && get(this, 'viewportEntered')) {
      this.trigger('didScroll', scrollDirection);
      lastDirection[elementId] = scrollDirection;
    }

    lastPosition[elementId] = newPosition;
  },

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

  _unbindIfEntered() {
    if (!get(this, 'viewportSpy') && get(this, 'viewportEntered')) {
      this._unbindListeners();
      this.removeObserver('viewportEntered', this, this._unbindIfEntered);
      set(this, 'viewportEntered', true);
    }
  },

  _setInitialViewport(context = null) {
    assert('You must pass a valid context to _setInitialViewport', context);

    return scheduleOnce('afterRender', this, () => {
      this._setViewportEntered(context);
    });
  },

  _debouncedEventHandler(methodName, ...args) {
    assert('You must pass a methodName to _debouncedEventHandler', methodName);
    assert('methodName must be a string', typeOf(methodName) === 'string');

    debounce(this, () => this[methodName](...args), get(this, 'viewportRefreshRate'));
  },

  _bindScrollDirectionListener(context = null, sensitivity = 1) {
    assert('You must pass a valid context to _bindScrollDirectionListener', context);
    assert('sensitivity cannot be 0', sensitivity);

    const $contextEl = $(context);

    $contextEl.on(`scroll.directional#${get(this, 'elementId')}`, () => {
      this._debouncedEventHandler('_triggerDidScrollDirection', $contextEl, sensitivity);
    });
  },

  _unbindScrollDirectionListener(context = null) {
    assert('You must pass a valid context to _bindScrollDirectionListener', context);

    const elementId = get(this, 'elementId');

    $(context).off(`scroll.directional#${elementId}`);
    delete lastPosition[elementId];
    delete lastDirection[elementId];
  },

  _bindListeners(context = null, event = null) {
    assert('You must pass a valid context to _bindListeners', context);
    assert('You must pass a valid event to _bindListeners', event);

    $(context).on(`${event}.${get(this, 'elementId')}`, () => {
      this._debouncedEventHandler('_setViewportEntered', context);
    });
  },

  _unbindListeners() {
    const elementId = get(this, 'elementId');

    if (get(this, 'viewportUseRAF')) {
      next(this, () => {
        window.cancelAnimationFrame(rAFIDS[elementId]);
        delete rAFIDS[elementId];
      });
    }

    get(this, 'viewportListeners').forEach((listener) => {
      const { context, event } = listener;
      $(context).off(`${event}.${elementId}`);
    });

    this._unbindScrollDirectionListener(window);
  }
});
