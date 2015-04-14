import Ember from 'ember';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';
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
  debounce
} = run;

const { not }     = computed;
const { forEach } = Ember.EnumerableUtils;

const listeners = [
  { context: window,   event: 'scroll.scrollable' },
  { context: window,   event: 'resize.resizable' },
  { context: document, event: 'touchmove.scrollable' }
];

export default Ember.Mixin.create({
  viewportExited: not('viewportEntered').readOnly(),

  _setup: on('init', function() {
    this._setInitialState();
    this._setupObserverIfNotSpying();
  }),

  _setupListeners: on('didInsertElement', function() {
    if (!canUseDOM) { return; }

    this._setInitialViewport(document);

    forEach(listeners, (listener) => {
      const { context, event } = listener;
      this._bindListeners(context, event);
    });
  }),

  _teardown: on('willDestroyElement', function() {
    this._unbindListeners();
  }),

  _setInitialState() {
    setProperties(this, {
      viewportEntered     : false,
      viewportSpy         : false,
      viewportRefreshRate : 100,
      viewportTolerance   : {
        top    : 0,
        left   : 0,
        bottom : 0,
        right  : 0
      }
    });
  },

  _setupObserverIfNotSpying() {
    const viewportSpy = get(this, 'viewportSpy');

    if (!viewportSpy) {
      this.addObserver('viewportEntered', this, this._viewportDidEnter);
    }
  },

  _setViewportEntered(context=null) {
    Ember.assert('You must pass a valid context to _setViewportEntered', context);
    if (!canUseDOM) { return; }

    const tolerance          = get(this, 'viewportTolerance');
    const height             = $(context) ? $(context).height() : 0;
    const width              = $(context) ? $(context).width()  : 0;
    const boundingClientRect = this.$() ? this.$()[0].getBoundingClientRect() : null;
    const viewportEntered    = isInViewport(boundingClientRect, height, width, tolerance);

    if (boundingClientRect) {
      set(this, 'viewportEntered', viewportEntered);
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

  _setInitialViewport(context) {
    return scheduleOnce('afterRender', this, function() {
      this._setViewportEntered(context);
    });
  },

  _scrollHandler(context=null) {
    Ember.assert('You must pass a valid context to _scrollHandler', context);

    const viewportRefreshRate = get(this, 'viewportRefreshRate');
    debounce(this, function() {
      this._setViewportEntered(context);
    }, viewportRefreshRate);
  },

  _bindListeners(context, event) {
    Ember.assert('You must pass a valid context to _bindListeners', context);
    Ember.assert('You must pass a valid event to _bindListeners', event);

    const self = this;
    $(context).on(event, function() {
      self._scrollHandler(context);
    });
  },

  _unbindListeners() {
    forEach(listeners, (listener) => {
      const { context, event } = listener;
      $(context).off(event);
    });
  }
});
