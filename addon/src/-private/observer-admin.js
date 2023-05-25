import IntersectionObserverAdmin from 'intersection-observer-admin';

/**
 * Static administrator to ensure use one IntersectionObserver per combination of root + observerOptions
 * Use `root` (viewport) as lookup property and weakly referenced
 * `root` will have many keys with each value being and object containing one IntersectionObserver instance and all the elements to observe
 * Provided callbacks will ensure consumer of this service is able to react to enter or exit of intersection observer
 * This provides important optimizations since we are not instantiating a new IntersectionObserver instance for every element and
 * instead reusing the instance.
 *
 * @class ObserverAdmin
 */
export default class ObserverAdmin {
  /** @private **/
  constructor() {
    this.instance = new IntersectionObserverAdmin();
  }

  /**
   * @method add
   * @param HTMLElement element
   * @param Object observerOptions
   * @param Function enterCallback
   * @param Function exitCallback
   * @void
   */
  add(element, observerOptions, enterCallback, exitCallback) {
    if (enterCallback) {
      this.addEnterCallback(element, enterCallback);
    }
    if (exitCallback) {
      this.addExitCallback(element, exitCallback);
    }

    return this.instance.observe(element, observerOptions);
  }

  addEnterCallback(element, enterCallback) {
    this.instance.addEnterCallback(element, enterCallback);
  }

  addExitCallback(element, exitCallback) {
    this.instance.addExitCallback(element, exitCallback);
  }

  /**
   * This method takes a target element, observerOptions and a the scrollable area.
   * The latter two act as unique identifiers to figure out which intersection observer instance
   * needs to be used to call `unobserve`
   *
   * @method unobserve
   * @param HTMLElement target
   * @param Object observerOptions
   * @param String scrollableArea
   * @void
   */
  unobserve(...args) {
    this.instance.unobserve(...args);
  }

  destroy(...args) {
    this.instance.destroy(...args);
  }
}
