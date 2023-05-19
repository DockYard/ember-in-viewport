import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const { keys } = Object;

module('Unit | Initializer | viewport config', function (hooks) {
  setupTest(hooks);

  test('it has a viewportConfig object', function (assert) {
    const viewportConfig = this.owner.lookup('config:in-viewport');
    const viewportConfigKeys = keys(viewportConfig);

    assert.ok(viewportConfig);
    assert.ok(viewportConfigKeys.length);
    assert.ok(
      viewportConfigKeys.includes('intersectionThreshold'),
      'intersectionThreshold is in viewportConfig'
    );
    assert.ok(
      viewportConfigKeys.includes('scrollableArea'),
      'scrollableArea is in viewportConfig'
    );
  });
});
