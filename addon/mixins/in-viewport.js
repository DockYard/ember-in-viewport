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
  debounce,
  bind
} = run;

const { not }     = computed;
const { forEach } = Ember.EnumerableUtils;

const listeners = [
  { context: window,   event: 'scroll.scrollable' },
  { context: window,   event: 'resize.resizable' },
  { context: document, event: 'touchmove.scrollable' }
];

let rAFID    = 0;
let $cachedEl;

export default Ember.Mixin.create({
  viewportExited: not('viewportEntered').readOnly(),

  _setInitialState: on('init', function() {
    setProperties(this, {
      viewportUseRAF      : true,
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
  }),

  _setupElement: on('didInsertElement', function() {
    if (!canUseDOM) { return; }

    const viewportUseRAF = get(this, 'viewportUseRAF');

    this._setInitialViewport(window);
    this._setupObserverIfNotSpying();

    if (viewportUseRAF) {
      this._setViewportEntered(window);
    } else {
      forEach(listeners, (listener) => {
        const { context, event } = listener;
        this._bindListeners(context, event);
      });
    }
  }),

  _teardown: on('willDestroyElement', function() {
    this._unbindListeners();
  }),

  _setupObserverIfNotSpying() {
    const viewportSpy = get(this, 'viewportSpy');

    if (!viewportSpy) {
      this.addObserver('viewportEntered', this, this._viewportDidEnter);
    }
  },

  _setViewportEntered(context=null) {
    Ember.assert('You must pass a valid context to _setViewportEntered', context);
    if (!canUseDOM) { return; }

    let boundingClientRect;

    if ($cachedEl) {
      boundingClientRect = $cachedEl[0].getBoundingClientRect();
    } else {
      $cachedEl           = this.$();
      boundingClientRect = $cachedEl[0].getBoundingClientRect();
    }

    const viewportUseRAF  = get(this, 'viewportUseRAF');
    const tolerance       = get(this, 'viewportTolerance');
    const height          = $(context) ? $(context).height() : 0;
    const width           = $(context) ? $(context).width()  : 0;
    const viewportEntered = isInViewport(boundingClientRect, height, width, tolerance);

    set(this, 'viewportEntered', viewportEntered);

    if ($cachedEl && viewportUseRAF) {
      rAFID = window.requestAnimationFrame(
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
    window.cancelAnimationFrame(rAFID);

    forEach(listeners, (listener) => {
      const { context, event } = listener;
      $(context).off(event);
    });
  }
});
