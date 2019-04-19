import RafPool from 'raf-pool';

/**
 * ensure use on requestAnimationFrame, no matter how many components
 * on the page are using this mixin
 *
 * @class RAFAdmin
 */
export default class RAFAdmin {
  /** @private **/
  constructor() {
    this._rafPool = new RafPool();
  }

  add(...args) {
    return this._rafPool.add(...args);
  }

  flush() {
    return this._rafPool.flush();
  }

  remove(...args) {
    return this._rafPool.remove(...args);
  }

  reset(...args) {
    this._rafPool.reset(...args);
    this._rafPool = null;
  }
}
