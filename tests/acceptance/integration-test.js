import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: Integration', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Component is active when in viewport', function(assert) {
  assert.expect(1);
  visit('/');

  andThen(() => {
    assert.ok(find('.fooBar.active').length);
  });
});
