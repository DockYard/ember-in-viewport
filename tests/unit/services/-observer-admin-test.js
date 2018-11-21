import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin | -observer-admin', function(hooks) {
  setupTest(hooks);

  // https://github.com/DockYard/ember-in-viewport/issues/160
  test('handles root element gaining custom properties', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');
    let root = document.createElement('div');
    let observerOptions = { root, rootMargin: '0px 0px 100px 0px', threshold: 0 };

    service.add(root, () => {}, () => {}, observerOptions);
    assert.ok(true);
  });

  test('handles root element gaining custom properties with scrollableArea', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');
    let root = document.createElement('div');
    let observerOptions = { root, rootMargin: '0px 0px 100px 0px', threshold: 0 };

    service.add(root, () => {}, () => {}, observerOptions, 'main-area');
    assert.ok(true);
  });
});
