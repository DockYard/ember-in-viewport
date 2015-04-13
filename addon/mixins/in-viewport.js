import Ember from 'ember';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';

const {
  get: get,
  set: set,
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
  viewportEntered   : false,
  viewportTimeout   : 100,
  viewportTolerance : 0,
  viewportExited    : not('viewportEntered').readOnly(),

  _setViewportEntered(context=null) {
    Ember.assert('You must pass a valid context to _setViewportEntered', context);
    if (!canUseDOM) { return; }

    const tolerance          = get(this, 'viewportTolerance');
    const height             = $(context) ? $(context).height() : 0;
    const width              = $(context) ? $(context).width()  : 0;
    const boundingClientRect = this.$() ? this.$()[0].getBoundingClientRect() : null;

    if (boundingClientRect) {
      set(this, 'viewportEntered', isInViewport(
        boundingClientRect,
        height,
        width,
        tolerance
      ));
    }
  },

  _setup: on('didInsertElement', function() {
    if (!canUseDOM) { return; }

    forEach(listeners, (listener) => {
      const { context, event } = listener;

      this._setInitialViewport(context);
      this._bindListeners(context, event);
    });
  }),

  _setInitialViewport(context) {
    return scheduleOnce('afterRender', this, function() {
      this._setViewportEntered(context);
    });
  },

  _scrollHandler(context=null) {
    Ember.assert('You must pass a valid context to _scrollHandler', context);

    const viewportTimeout = get(this, 'viewportTimeout');
    debounce(this, function() {
      this._setViewportEntered(context);
    }, viewportTimeout);
  },

  _bindListeners(context, event) {
    Ember.assert('You must pass a valid context to _bindListeners', context);
    Ember.assert('You must pass a valid event to _bindListeners', event);

    const self = this;
    $(context).on(event, function() {
      self._scrollHandler(context);
    });
  },

  _unbindListeners: on('willDestroyElement', function() {
    forEach(listeners, (listener) => {
      const { context, event } = listener;
      $(context).off(event);
    });
  })
});
