import Ember from 'ember';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';
import canUseRAF from 'ember-in-viewport/utils/can-use-raf';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';

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

const { not }     = computed;
const { forEach } = Ember.EnumerableUtils;

const listeners = [
  { context: window,   event: 'scroll.scrollable' },
  { context: window,   event: 'resize.resizable' },
  { context: document, event: 'touchmove.scrollable' }
];

let rAFIDS = {};

export default Ember.Mixin.create({
  viewportExited: not('viewportEntered').readOnly(),

  _setInitialState: on('init', function() {
    setProperties(this, {
      $viewportCachedEl   : undefined,
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
    });
  }),

  _setupElement: on('didInsertElement', function() {
    if (!canUseDOM) { return; }

    const viewportUseRAF = get(this, 'viewportUseRAF');

    this._setInitialViewport(window);
    this._addObserverIfNotSpying();
    this._setViewportEntered(window);

    if (!viewportUseRAF) {
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
    const viewportSpy = get(this, 'viewportSpy');

    if (!viewportSpy) {
      this.addObserver('viewportEntered', this, this._viewportDidEnter);
    }
  },

  _setViewportEntered(context = null) {
    Ember.assert('You must pass a valid context to _setViewportEntered', context);

    const $viewportCachedEl = get(this, '$viewportCachedEl');
    const viewportUseRAF    = get(this, 'viewportUseRAF');
    const elementId         = get(this, 'elementId');
    const tolerance         = get(this, 'viewportTolerance');
    const height            = $(context) ? $(context).height() : 0;
    const width             = $(context) ? $(context).width()  : 0;

    let boundingClientRect;

    if ($viewportCachedEl) {
      boundingClientRect = $viewportCachedEl[0].getBoundingClientRect();
    } else {
      boundingClientRect = set(this, '$viewportCachedEl', this.$())[0].getBoundingClientRect();
    }

    const viewportEntered = isInViewport(boundingClientRect, height, width, tolerance);

    set(this, 'viewportEntered', viewportEntered);

    if ($viewportCachedEl && viewportUseRAF) {
      rAFIDS[elementId] = window.requestAnimationFrame(
        bind(this, this._setViewportEntered, context)
      );
    }
  },

  _viewportDidEnter() {
    const viewportEntered = get(this, 'viewportEntered');
    const viewportSpy     = get(this, 'viewportSpy');

    if (!viewportSpy && viewportEntered) {
      this._unbindListeners();
      this.removeObserver('viewportEntered', this, this._viewportDidEnter);
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

    const viewportRefreshRate = get(this, 'viewportRefreshRate');

    debounce(this, function() {
      this._setViewportEntered(context);
    }, viewportRefreshRate);
  },

  _bindListeners(context = null, event = null) {
    Ember.assert('You must pass a valid context to _bindListeners', context);
    Ember.assert('You must pass a valid event to _bindListeners', event);

    const elementId = get(this, 'elementId');

    Ember.warn('No elementId was found on this Object, `viewportSpy` will' +
      'not work as expected', elementId);

    $(context).on(`${event}#${elementId}`, () => {
      this._scrollHandler(context);
    });
  },

  _unbindListeners() {
    const elementId      = get(this, 'elementId');
    const viewportUseRAF = get(this, 'viewportUseRAF');

    Ember.warn('No elementId was found on this Object, `viewportSpy` will' +
      'not work as expected', elementId);

    if (viewportUseRAF) {
      next(this, () => {
        window.cancelAnimationFrame(rAFIDS[elementId]);
        rAFIDS[elementId] = null;
      });
    }

    forEach(listeners, (listener) => {
      const { context, event } = listener;
      $(context).off(`${event}#${elementId}`);
    });
  }
});
