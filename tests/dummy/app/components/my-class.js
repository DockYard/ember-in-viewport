import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  inViewport: inject(),

  tagName: '',

  didInsertElement() {
    const loader = document.getElementById('loader');
    this.inViewport.watchElement(loader);
    this.inViewport.addEnterCallback(loader, this.didEnterViewport.bind(this));
  },

  didEnterViewport() {
    this.infinityLoad();
  }
});
