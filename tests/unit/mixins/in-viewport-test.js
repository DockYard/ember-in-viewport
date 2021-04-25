import EmberObject from '@ember/object';
// eslint-disable-next-line ember/no-mixins
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import RafPool from 'raf-pool';

module('Unit | Mixin | in viewport', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.rAFPoolManager = new RafPool();
  });

  test('mixin works', function (assert) {
    // eslint-disable-next-line ember/no-new-mixins
    let InViewportObject = EmberObject.extend(InViewportMixin);
    let subject = InViewportObject.create();
    assert.ok(subject);
  });

  test('can add to pool manager', function (assert) {
    let cb = () => {};
    let obj = this.rAFPoolManager.add(123, cb);
    assert.equal(obj, cb);
  });

  test('can remove from pool manager', function (assert) {
    let cb = () => {};
    this.rAFPoolManager.add(123, cb);
    assert.equal(this.rAFPoolManager.pool.length, 1);
    this.rAFPoolManager.remove(123);
    assert.equal(this.rAFPoolManager.pool.length, 0);
  });

  test('can remove from pool manager', function (assert) {
    let cb = () => {};
    this.rAFPoolManager.add(123, cb);
    this.rAFPoolManager.add(124, cb);
    assert.equal(this.rAFPoolManager.pool.length, 2);
    this.rAFPoolManager.remove(123);
    assert.equal(this.rAFPoolManager.pool.length, 1);
    assert.equal(this.rAFPoolManager.pool[0]['124'], cb);
  });

  test('reset resets pool manager', function (assert) {
    let cb = () => {};
    this.rAFPoolManager.add(123, cb);
    this.rAFPoolManager.add(124, cb);
    assert.equal(this.rAFPoolManager.pool.length, 2);
    this.rAFPoolManager.reset();
    assert.equal(this.rAFPoolManager.pool.length, 0);
  });
});
