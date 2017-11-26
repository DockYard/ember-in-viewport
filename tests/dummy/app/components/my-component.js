import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  get,
  on,
  getProperties, setProperties
} = Ember;

export default Component.extend(InViewportMixin, {
  classNames: ['my-component'],
  classNameBindings: ['viewportEntered:active:inactive'],

  viewportOptionsOverride: on('didInsertElement', function() {
    let options = {};

    let {
      viewportEnabledOverride
    } = getProperties(this,
      'viewportEnabledOverride'
    );

    if (viewportEnabledOverride !== undefined) {
      options.viewportEnabled = viewportEnabledOverride;
    }

    setProperties(this, options);
  }),

  didEnterViewport() {
    get(this, 'infinityLoad')();
  }
});
