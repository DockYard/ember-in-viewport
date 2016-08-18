import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component
} = Ember;

export default Component.extend(InViewportMixin, {
  classNames: ['my-component'],
  classNameBindings: ['viewportEntered:active:inactive']
});
