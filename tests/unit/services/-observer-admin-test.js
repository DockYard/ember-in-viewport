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
    assert.ok(service._compareOptions(null, null));
    assert.notOk(service._compareOptions(null, undefined));
    assert.ok(service._compareOptions(1, 1));
    assert.ok(service._compareOptions('abc', 'abc'));
    // object
    assert.ok(service._compareOptions({}, {}));
    assert.notOk(service._compareOptions({ a: 'ab' }, {}));
    assert.ok(service._compareOptions({ a: 'ab' }, { a: 'ab' }));
    assert.notOk(service._compareOptions({ a: 'ab' }, { a: 'abc' }));
    // nested
    assert.notOk(service._compareOptions({ a: { b: 'cd' }}, { a: 'abc' }));
    assert.ok(service._compareOptions({ a: { b: 'cd' }}, { a: { b: 'cd' }}));
    assert.notOk(service._compareOptions({ a: { b: { c: 'de' }}}, { a: { b: 'cd' }}));
    assert.ok(service._compareOptions({ a: { b: { c: 'de' }}}, { a: { b: { c: 'de' }}}));
  });
});
