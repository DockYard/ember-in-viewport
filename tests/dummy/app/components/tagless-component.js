import Component from '@ember/component';
import { setProperties, getProperties, get } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  tagName: '',
  sentinel: '.tagless-component',

  init() {
    this._super(...arguments);

    let options = {};

    let {
      viewportSpyOverride,
      viewportEnabledOverride,
      viewportIntersectionObserverOverride,
      scrollableAreaOverride,
      sentinel
    } = getProperties(this,
      'viewportSpyOverride',
      'viewportEnabledOverride',
      'viewportIntersectionObserverOverride',
      'scrollableAreaOverride',
      'sentinel'
    );

    if (viewportSpyOverride !== undefined) {
      options.viewportSpy = viewportSpyOverride;
    }
    if (viewportEnabledOverride !== undefined) {
      options.viewportEnabled = viewportEnabledOverride;
    }
    if (viewportIntersectionObserverOverride !== undefined) {
      options.viewportUseIntersectionObserver = viewportIntersectionObserverOverride;
    }
    if (scrollableAreaOverride !== undefined) {
      options.scrollableArea = scrollableAreaOverride;
    }
    if (sentinel !== undefined) {
      options.sentinel = sentinel;
    }

    setProperties(this, options);
  },

  didEnterViewport() {
    if (get(this, 'infinityLoad')) {
      get(this, 'infinityLoad')();
    }
  }
});
