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
      viewportSpyOverride,
      viewportEnabledOverride
    } = getProperties(this,
      'viewportSpyOverride',
      'viewportEnabledOverride'
    );

    if (viewportSpyOverride !== undefined) {
      options.viewportSpy = viewportSpyOverride;
    }
    if (viewportEnabledOverride !== undefined) {
      options.viewportEnabled = viewportEnabledOverride;
    }

    setProperties(this, options);
  })
});
