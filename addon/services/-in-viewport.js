import Service from '@ember/service';

/**
 * ensure use on requestAnimationFrame, no matter how many components
 * on the page are using this mixin
 *
 * @class rAFPoolManager
 */
export default class rAFPoolManager extends Service {
  init(...args) {
    super.init(...args);
    this.pool = [];
    this.isRunning = true;
    this.flush();
  }

  flush() {
    window.requestAnimationFrame(() => {
      // assign to a variable to avoid ensure no race conditions happen
      // b/w flushing the pool and interating through the pool
      let pool = this.pool;
      this.reset();
      pool.forEach((item) => {
        item[Object.keys(item)[0]]();
      });

      if (this.isRunning) {
        this.flush();
      }
    });
  }

  add(elementId, fn) {
    this.pool.push({ [elementId]: fn });
    return fn;
  }

  remove(elementId) {
    this.pool = this.pool.filter(obj => !obj[elementId]);
  }

  reset() {
    this.pool = [];
  }

  cancel() {
    this.isRunning = false;
  }
}
