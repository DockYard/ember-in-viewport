import Ember from 'ember';
import {
  module,
  test,
  skip
} from 'qunit';
import startApp from '../helpers/start-app';
import { lookupComponent } from '../helpers/utils/lookup';

let application;
const { run } = Ember;

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
    const component = lookupComponent(application, 'foo-bar');

    assert.ok(find('.fooBar.active').length);
  });
});
