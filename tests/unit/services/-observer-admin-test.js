import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';


module('Unit | Utility | -observer admin', function(hooks) {
  setupTest(hooks);

  test('can add element to static admin', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');

    let cb = () => {};

    let thing1 = document.createElement('div');
    try {
      service.add(thing1, cb, cb, {});
      assert.ok(true);
    } catch(e) {
      assert.ok(false, `An error: ${e}`);
    }
  });

  test('object compare works', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');

    // primitive
    assert.ok(service._areSameOptions(null, null));
    assert.notOk(service._areSameOptions(null, undefined));
    assert.ok(service._areSameOptions(1, 1));
    assert.ok(service._areSameOptions('abc', 'abc'));
    // object
    assert.ok(service._areSameOptions({}, {}));
    assert.notOk(service._areSameOptions({ a: 'ab' }, {}));
    assert.ok(service._areSameOptions({ a: 'ab' }, { a: 'ab' }));
    assert.notOk(service._areSameOptions({ a: 'ab' }, { a: 'abc' }));
    // nested
    assert.notOk(service._areSameOptions({ a: { b: 'cd' }}, { a: 'abc' }));
    assert.ok(service._areSameOptions({ a: { b: 'cd' }}, { a: { b: 'cd' }}));
    assert.notOk(service._areSameOptions({ a: { b: { c: 'de' }}}, { a: { b: 'cd' }}));
    assert.ok(service._areSameOptions({ a: { b: { c: 'de' }}}, { a: { b: { c: 'de' }}}));
  });
});
