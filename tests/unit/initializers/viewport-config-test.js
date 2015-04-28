import Ember from 'ember';
import { initialize } from '../../../initializers/viewport-config';
import { module, test } from 'qunit';

const { keys } = Ember;

let container, application;

module('ViewportConfigInitializer', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('it has a viewportConfig object', function(assert) {
  initialize(container, application);

  const viewportConfig     = container.lookup('config:in-viewport');
  const viewportConfigKeys = keys(viewportConfig);

  assert.ok(viewportConfig);
  assert.ok(viewportConfigKeys.length);
});
