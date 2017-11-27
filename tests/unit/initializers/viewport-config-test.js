import Ember from 'ember';
import ViewportConfigInitializer from 'dummy/initializers/viewport-config';
import { module, test } from 'qunit';

const { keys } = Object;

let container, application;

module('Unit | Initializer | viewport config', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('it has a viewportConfig object', function(assert) {
  ViewportConfigInitializer.initialize(application);

  const viewportConfig = container.lookup('config:in-viewport');
  const viewportConfigKeys = keys(viewportConfig);

  assert.ok(viewportConfig);
  assert.ok(viewportConfigKeys.length);
  assert.ok(viewportConfigKeys.includes('intersectionThreshold'), 'intersectionThreshold is in viewportConfig');
  assert.ok(viewportConfigKeys.includes('scrollableArea'), 'scrollableArea is in viewportConfig');
});
