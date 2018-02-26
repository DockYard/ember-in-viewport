import Application from '@ember/application';
import { run } from '@ember/runloop';
import ViewportConfigInitializer from 'dummy/initializers/viewport-config';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const { keys } = Object;

let container, application;

module('Unit | Initializer | viewport config', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      container = application.__container__;
      application.register('config:environment', {});
      application.deferReadiness();
    });
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
});
