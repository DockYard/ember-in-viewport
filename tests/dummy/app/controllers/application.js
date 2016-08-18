import Ember from 'ember';
import ENV from '../config/environment';

const { computed } = Ember;

export default Ember.Controller.extend({
  isTest: computed(function() {
    return ENV.environment === 'test';
  })
});
