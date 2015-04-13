import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';

export default Ember.Component.extend(InViewportMixin, {
  classNames        : [ 'fooBar' ],
  classNameBindings : [ 'viewportEntered:active' ],
});
