import Component from '@ember/component';
import { set } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  tagName: '',

  didInsertNode(element, [instance]) {
    instance.watchElement(element);
  },

  init() {
    this._super(...arguments);

    set(this, 'viewportSpy', true);
    set(this, 'viewportTolerance', {
      bottom: 300
    });
  },

  didEnterViewport() {
    this.infinityLoad();
  }
});
