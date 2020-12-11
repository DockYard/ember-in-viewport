import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default class MyModifier extends Component.extend(InViewportMixin) {
  @action
  setupInViewport(element) {
    this.watchElement(element);
  }

  constructor() {
    super(...arguments);

    set(this, 'viewportSpy', true);
    set(this, 'viewportTolerance', {
      bottom: 300
    });
  }

  didEnterViewport() {
    this.infinityLoad();
  }
}
