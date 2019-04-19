import Service from '@ember/service';
import { inject } from '@ember/service';

/**
 * ensure use on requestAnimationFrame, no matter how many components
 * on the page are using this mixin
 *
 * @class RAFAdmin
 */
export default Service.extend({
  _observerAdmin: inject('-observer-admin'),
  _rAFAdmin: inject('-raf-admin'),

  init() {
    this._super(...arguments);

    this.registry = new WeakMap();
  },

  /**
   * In order to track elements and the state that comes with them, we need to keep track
   * of them in order to get at them at a later time
   *
   * @method addToRegistry
   * @void
   */
  addToRegistry(element, observerOptions, scrollableArea) {
    this.registry.set(element, { observerOptions, scrollableArea });
  },

  /**
   * @method setupIntersectionObserver
   * @param HTMLElement element
   * @param Object observerOptions
   * @param HTMLElement|window scrollableArea
   * @param Function enterCallback
   * @param Function exitCallback
   * @void
   */
  setupIntersectionObserver(element, observerOptions, scrollableArea, domScrollableArea, enterCallback, exitCallback) {
    this.addToRegistry(element, observerOptions, scrollableArea);

    this._observerAdmin.add(
      element,
      enterCallback,
      exitCallback,
      observerOptions,
      scrollableArea
    );
  },

  unobserveIntersectionObserver(target) {
    if (!target) {
      return;
    }

    const { observerOptions, scrollableArea } = this.registry.get(target);
    this._observerAdmin.unobserve(target, observerOptions, scrollableArea);
  },

  destroy() {
    this.registry = null;
  }
});
