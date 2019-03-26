import Component from '@ember/component';
import { set } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  tagName: '',

  // if you do have a tagName ^^, then you can use `didInsertElement` or no-op it
  // didInsertElement() {},
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
