import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyComponent extends Component {
  @service inViewport;
  @tracked viewportEntered;

  // can't use preset id, because some tests use more than one instance on page
  elementRef;

  @action
  setupViewport(elementRef) {
    this.elementRef = elementRef;
    let options = {};

    let {
      viewportSpyOverride,
      viewportIntersectionObserverOverride,
      viewportToleranceOverride,
      viewportRAFOverride,
      scrollableAreaOverride,
      intersectionThresholdOverride,
    } = this.args;

    if (viewportSpyOverride !== undefined) {
      options.viewportSpy = viewportSpyOverride;
    }
    if (viewportIntersectionObserverOverride !== undefined) {
      options.viewportUseIntersectionObserver =
        viewportIntersectionObserverOverride;
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

    const { onEnter, onExit } = this.inViewport.watchElement(
      elementRef,
      options
    );
    onEnter(this.didEnterViewport.bind(this));
    onExit(this.didExitViewport.bind(this));
  }

  constructor() {
    super(...arguments);
  }

  didEnterViewport() {
    this.viewportEntered = true;

    if (this.args.infinityLoad) {
      this.args.infinityLoad();
    }
  }

  didExitViewport() {
    this.viewportEntered = false;
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.elementRef) this.inViewport.stopWatching(this.elementRef);
  }
}
