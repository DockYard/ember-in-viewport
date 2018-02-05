import Component from '@ember/component';
import { setProperties, getProperties, get } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  classNames: ['my-component'],
  classNameBindings: ['viewportEntered:active:inactive'],

  init() {
    this._super(...arguments);
    let options = {};

    let {
      viewportSpyOverride,
      viewportEnabledOverride,
      viewportIntersectionObserverOverride,
      viewportRAFOverride,
      scrollableAreaOverride
    } = getProperties(this,
      'viewportSpyOverride',
      'viewportEnabledOverride',
      'viewportIntersectionObserverOverride',
      'viewportRAFOverride',
      'scrollableAreaOverride'
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
    if (viewportRAFOverride !== undefined) {
      options.viewportUseRAF = viewportRAFOverride;
    }
    if (scrollableAreaOverride !== undefined) {
      options.scrollableArea = scrollableAreaOverride;
    }

    setProperties(this, options);
  },

  didEnterViewport() {
    if (get(this, 'infinityLoad')) {
      get(this, 'infinityLoad')();
    }
  }
});
