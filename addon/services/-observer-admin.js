import Service from '@ember/service';
import IntersectionObserverAdmin from 'intersection-observer-admin';

/**
 * Static administrator to ensure use one IntersectionObserver per combination of root + observerOptions
 * Use `root` (viewport) as lookup property and weakly referenced
 * `root` will have many keys with each value being and object containing one IntersectionObserver instance and all the elements to observe
 * Provided callbacks will ensure consumer of this service is able to react to enter or exit of intersection observer
 * This provides important optimizations since we are not instantiating a new IntersectionObserver instance for every element and
 * instead reusing the instance.
 *
 * @module Service
 * @extends Ember.Service
 * @class ObserverAdmin
 */
export default class ObserverAdmin extends Service {
  /** @private **/
  init() {
    this._super(...arguments);
    this._observerAdmin = new IntersectionObserverAdmin();
  }

  add(...args) {
    return this._observerAdmin.observe(...args);
  }

  unobserve(...args) {
    return this._observerAdmin.unobserve(...args);
  }

  destroy(...args) {
    this._observerAdmin.destroy(...args);
    this._observerAdmin = null;
  }
}
