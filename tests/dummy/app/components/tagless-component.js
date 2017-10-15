import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
} = Ember;

export default Component.extend(InViewportMixin, {
  tagName: '',
  viewportElement: '.tagless-component',
  didEnterViewport() {
    this.set('enteredViewport', true);
  }
});
