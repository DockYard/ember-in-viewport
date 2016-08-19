import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  on,
  getProperties, setProperties
} = Ember;

export default Component.extend(InViewportMixin, {
  classNames: ['my-component'],
  classNameBindings: ['viewportEntered:active:inactive'],

  viewportOptionsOverride: on('didInsertElement', function() {
    let options = {};

    let {
      viewportSpyOverride
    } = getProperties(this,
      'viewportSpyOverride'
    );

    if (viewportSpyOverride !== undefined) {
      options.viewportSpy = viewportSpyOverride;
    }

    setProperties(this, options);
  })
});
