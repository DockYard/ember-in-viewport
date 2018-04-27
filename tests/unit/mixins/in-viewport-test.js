import EmberObject from '@ember/object';
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { rAFPoolManager } from 'ember-in-viewport/mixins/in-viewport';

class rAFMock extends rAFPoolManager {
  flush() {}
}

module('Unit | Mixin | in viewport', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.rAFPoolManager = new rAFMock();
    this.rAFPoolManager.flush = () => {};
  });

  test('mixin works', function(assert) {
    let InViewportObject = EmberObject.extend(InViewportMixin);
    let subject = InViewportObject.create();
    assert.ok(subject);
  });

  test('can add to pool manager', function(assert) {
    let obj = this.rAFPoolManager.add(123, 'wat');
    assert.equal(obj, 'wat');
  });

  test('can remove from pool manager', function(assert) {
    this.rAFPoolManager.add(123, 'wat');
    assert.equal(this.rAFPoolManager.pool.length, 1);
    this.rAFPoolManager.remove(123);
    assert.equal(this.rAFPoolManager.pool.length, 0);
  });

  test('can remove from pool manager', function(assert) {
    this.rAFPoolManager.add(123, 'wat');
    this.rAFPoolManager.add(124, 'foo');
    assert.equal(this.rAFPoolManager.pool.length, 2);
    this.rAFPoolManager.remove(123);
    assert.equal(this.rAFPoolManager.pool.length, 1);
    assert.equal(this.rAFPoolManager.pool[0]['124'], 'foo');
  });

  test('reset resets pool manager', function(assert) {
    this.rAFPoolManager.add(123, 'wat');
    this.rAFPoolManager.add(124, 'foo');
    assert.equal(this.rAFPoolManager.pool.length, 2);
    this.rAFPoolManager.reset();
    assert.equal(this.rAFPoolManager.pool.length, 0);
  });
});
