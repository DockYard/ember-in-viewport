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

    // sense check
    assert.ok(service._findMatchingRootEntry(observerOptions));

    // simulate jQuery adding a sizzle1234 type property to root HtmlElement
    root.sizzle1234 = { test: true };

    // failing test for #160
    assert.ok(service._findMatchingRootEntry(observerOptions));
  });

  test('handles root element gaining custom properties with scrollableArea', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');
    let root = document.createElement('div');
    let observerOptions = { root, rootMargin: '0px 0px 100px 0px', threshold: 0 };

    service.add(root, () => {}, () => {}, observerOptions, 'main-area');

    assert.ok(service._findMatchingRootEntry(observerOptions, 'main-area'));

    root.sizzle1234 = { test: true };

    assert.ok(service._findMatchingRootEntry(observerOptions, 'main-area'));
  });

  test('_areOptionsSame works', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');

    // primitive
    assert.ok(service._areOptionsSame('a', 'a'));
    assert.ok(service._areOptionsSame(1, 1));
    assert.notOk(service._areOptionsSame('a', 'ab'));
    assert.notOk(service._areOptionsSame(1, 2));

    // complex
    assert.ok(service._areOptionsSame({}, {}));
    assert.notOk(service._areOptionsSame({ a: 'b' }, {}));
    assert.ok(service._areOptionsSame({ a: 'b' }, { a: 'b' }));
    assert.notOk(service._areOptionsSame({ a: { b: 'c' }}, { a: 'b' }));
    assert.ok(service._areOptionsSame({ a: { b: 'c' }}, { a: { b: 'c' } }));
    assert.notOk(service._areOptionsSame({ a: { b: { c: 'd' } }}, { a: { b: 'c' } }));
    assert.ok(service._areOptionsSame({ a: { b: { c: 'd' } }}, { a: { b: { c: 'd' } } }));
  });

  test('_determineMatchingElements works', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');
    assert.ok(service._determineMatchingElements({ a: { b: 'c' }}, { key: { observerOptions: { a: { b: 'c' } }}}));
    assert.notOk(service._determineMatchingElements({ a: { b: 'd' }}, { key: { observerOptions: { a: { b: 'c' } }}}));
  });
});
