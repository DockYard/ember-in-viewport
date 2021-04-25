import Component from '@ember/component';
import { setProperties } from '@ember/object';
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
      viewportToleranceOverride,
      viewportRAFOverride,
      scrollableAreaOverride,
      intersectionThresholdOverride,
    } = this;

    if (viewportSpyOverride !== undefined) {
      options.viewportSpy = viewportSpyOverride;
    }
    if (viewportEnabledOverride !== undefined) {
      options.viewportEnabled = viewportEnabledOverride;
    }
    if (viewportIntersectionObserverOverride !== undefined) {
      options.viewportUseIntersectionObserver = viewportIntersectionObserverOverride;
    }
    if (viewportToleranceOverride !== undefined) {
      options.viewportTolerance = viewportToleranceOverride;
    }
    if (viewportRAFOverride !== undefined) {
      options.viewportUseRAF = viewportRAFOverride;
    }
    if (scrollableAreaOverride !== undefined) {
      options.scrollableArea = scrollableAreaOverride;
    }
    if (intersectionThresholdOverride !== undefined) {
      options.intersectionThreshold = intersectionThresholdOverride;
    }

    setProperties(this, options);
  },

  didEnterViewport() {
    if (this.infinityLoad) {
      this.infinityLoad();
    }
  },
});
