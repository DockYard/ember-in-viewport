import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import RafPool from 'raf-pool';

/**
 * Tests for raf-pool dependency
 *
 * @see {@link https://www.npmjs.com/package/raf-pool}
 */

module('Unit | Raf Pool', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.rAFPoolManager = new RafPool();
  });

  test('can add to pool manager', function (assert) {
    let cb = () => {};
    let obj = this.rAFPoolManager.add(123, cb);
    assert.equal(obj, cb);
  });

  test('can remove from pool manager (single element)', function (assert) {
    let cb = () => {};
    this.rAFPoolManager.add(123, cb);
    assert.equal(this.rAFPoolManager.pool.length, 1);
    this.rAFPoolManager.remove(123);
    assert.equal(this.rAFPoolManager.pool.length, 0);
  });

  test('can remove from pool manager (multiple elements)', function (assert) {
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
