import Ember from 'ember';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';
import canUseRAF from 'ember-in-viewport/utils/can-use-raf';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
import checkScrollDirection from 'ember-in-viewport/utils/check-scroll-direction';

const {
  get: get,
  set: set,
  setProperties,
  computed,
  run,
  on,
  $,
} = Ember;

const {
  scheduleOnce,
  debounce,
  bind,
  next
} = run;

const { not }      = computed;
const { forEach }  = Ember.EnumerableUtils;
const { classify } = Ember.String;

const listeners = [
  { context: window,   event: 'scroll.scrollable' },
  { context: window,   event: 'resize.resizable' },
  { context: document, event: 'touchmove.scrollable' }
];

let rAFIDS = {};
let lastDirection = {};
let lastPosition  = {};

export default Ember.Mixin.create({
  viewportExited: not('viewportEntered').readOnly(),

  _setInitialState: on('init', function() {
    setProperties(this, {
      viewportUseRAF      : canUseRAF(),
      viewportEntered     : false,
      viewportSpy         : false,
      viewportRefreshRate : 100,
      viewportTolerance   : {
        top    : 0,
        left   : 0,
        bottom : 0,
        right  : 0
      },
      scrollSensitivity: 1
    });
  }),

  _setupElement: on('didInsertElement', function() {
    if (!canUseDOM) { return; }

    this._setInitialViewport(window);
    this._addObserverIfNotSpying();
    this._bindScrollDirectionListener(window, get(this, 'scrollSensitivity'));

    if (!get(this, 'viewportUseRAF')) {
      forEach(listeners, (listener) => {
        const { context, event } = listener;
        this._bindListeners(context, event);
      });
    }
  }),

  _teardown: on('willDestroyElement', function() {
    this._unbindListeners();
  }),

  _addObserverIfNotSpying() {
    if (!get(this, 'viewportSpy')) {
      this.addObserver('viewportEntered', this, this._unbindIfEntered);
    }
  },

  _setViewportEntered(context = null) {
    Ember.assert('You must pass a valid context to _setViewportEntered', context);

    const viewportUseRAF     = get(this, 'viewportUseRAF');
    const viewportTolerance  = get(this, 'viewportTolerance');
    const elementId          = get(this, 'elementId');
    const element            = get(this, 'element');
    const $contextEl         = $(context);
    const height             = $contextEl.height();
    const width              = $contextEl.width();

    if (!element) { return; }
    const boundingClientRect = element.getBoundingClientRect();

    this._triggerDidEnterViewport(
      isInViewport(boundingClientRect, height, width, viewportTolerance)
    );

    if (boundingClientRect && viewportUseRAF) {
      rAFIDS[elementId] = window.requestAnimationFrame(
        bind(this, this._setViewportEntered, context)
      );
    }
  },

  _triggerDidScrollDirection($contextEl = null, sensitivity = 1) {
    Ember.assert('You must pass a valid context element to _triggerDidScrollDirection', $contextEl);
    Ember.assert('sensitivity cannot be 0', sensitivity);

    const elementId          = get(this, 'elementId');
    const viewportEntered    = get(this, 'viewportEntered');
    const lastDirectionForEl = lastDirection[elementId];
    const lastPositionForEl  = lastPosition[elementId];
    const newPosition = {
      top  : $contextEl.scrollTop(),
      left : $contextEl.scrollLeft()
    };

    const scrollDirection = checkScrollDirection(lastPositionForEl, newPosition, sensitivity);
    const hasDirection    = scrollDirection !== lastDirectionForEl;

    if (hasDirection && viewportEntered) {
      this.trigger(`didScroll${classify(scrollDirection)}`);
    }

    if (viewportEntered) {
      lastDirection[elementId] = scrollDirection;
    }

    lastPosition[elementId]  = newPosition;
  },

  _triggerDidEnterViewport(hasEnteredViewport = false) {
    const viewportEntered  = get(this, 'viewportEntered');
    const didEnter         = !viewportEntered && hasEnteredViewport;
    const didLeave         = viewportEntered && !hasEnteredViewport;
    let triggeredEventName = '';

    if (didEnter) { triggeredEventName = 'didEnterViewport'; }
    if (didLeave) { triggeredEventName = 'didExitViewport'; }

    this.trigger(triggeredEventName);

    set(this, 'viewportEntered', hasEnteredViewport);
  },

  _unbindIfEntered() {
    if (!get(this, 'viewportSpy') && get(this, 'viewportEntered')) {
      this._unbindListeners();
      this.removeObserver('viewportEntered', this, this._unbindIfEntered);
      set(this, 'viewportEntered', true);
    }
  },

  _setInitialViewport(context = null) {
    Ember.assert('You must pass a valid context to _setInitialViewport', context);

    return scheduleOnce('afterRender', this, () => {
      this._setViewportEntered(context);
    });
  },

  _scrollHandler(context = null) {
    Ember.assert('You must pass a valid context to _scrollHandler', context);

    debounce(this, () => {
      this._setViewportEntered(context);
    }, get(this, 'viewportRefreshRate'));
  },

  _bindScrollDirectionListener(context = null, sensitivity = 1) {
    Ember.assert('You must pass a valid context to _bindScrollDirectionListener', context);
    Ember.assert('sensitivity cannot be 0', sensitivity);

    const $contextEl = $(context);

    $contextEl.on(`scroll.directional#${get(this, 'elementId')}`, () => {
      this._triggerDidScrollDirection($contextEl, sensitivity);
    });
  },

  _unbindScrollDirectionListener(context = null) {
    Ember.assert('You must pass a valid context to _bindScrollDirectionListener', context);

    const elementId = get(this, 'elementId');

    $(context).off(`scroll.directional#${elementId}`);
    lastPosition[elementId]  = null;
    lastDirection[elementId] = null;
  },

  _bindListeners(context = null, event = null) {
    Ember.assert('You must pass a valid context to _bindListeners', context);
    Ember.assert('You must pass a valid event to _bindListeners', event);

    $(context).on(`${event}#${get(this, 'elementId')}`, () => {
      this._scrollHandler(context);
    });
  },

  _unbindListeners() {
    const elementId = get(this, 'elementId');

    if (get(this, 'viewportUseRAF')) {
      next(this, () => {
        window.cancelAnimationFrame(rAFIDS[elementId]);
        rAFIDS[elementId] = null;
      });
    }

    forEach(listeners, (listener) => {
      const { context, event } = listener;
      $(context).off(`${event}#${elementId}`);
    });

    this._unbindScrollDirectionListener(window);
  }
});
