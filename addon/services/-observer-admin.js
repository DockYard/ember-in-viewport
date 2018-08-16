import Service from '@ember/service';
import { bind } from '@ember/runloop';

// WeakMap { root || viewportDescriptor : { elements: [{ element, enterCallback, exitCallback, observerOptions }], IntersectionObserver } }
let DOMRef = new WeakMap();

/**
 * Static administrator to ensure use one IntersectionObserver per viewport
 * Use `root` (viewport) as lookup property
 * `root` will have one IntersectionObserver with many entries (elements) to watch
 * provided callback will ensure consumer of this service is able to react to enter or exit
 * of intersection observer
 *
 * @module Ember.Service
 * @class ObserverAdmin
 */
export default class ObserverAdmin extends Service {
  /**
   * adds element to observe entries of IntersectionObserver
   *
   * @method add
   * @param {Node} element
   * @param {Function} enterCallback
   * @param {Function} exitCallback
   * @param {Object} observerOptions
   * @param {String} viewportDescriptor
   */
  add(element, enterCallback, exitCallback, observerOptions, viewportDescriptor) {
    let { root = window } = observerOptions;
    // we will set the main key we store the intersectionObserver instance on either viewportDescriptor or root
    let descriptor = { viewportDescriptor } || root;
    let { elements, intersectionObserver } = this._findRoot(descriptor);

    if (elements && elements.length > 0) {
      // if same observerOptions found in another element already being observed, then we can add to existing intersection observer and return early
      elements.push({ element, enterCallback, exitCallback, observerOptions });
      intersectionObserver.observe(element);
    } else {
      let newIO = new IntersectionObserver(bind(this, this._setupOnIntersection(descriptor)), observerOptions);
      newIO.observe(element);
      DOMRef.set(descriptor, { elements: [{ element, enterCallback, exitCallback, observerOptions }], intersectionObserver: newIO });
    }
  }

  /**
   * @method unobserve
   * @param {Node} element
   * @param {Node|window} descriptor
   */
  unobserve(element, descriptor) {
    let { intersectionObserver } = this._findRoot(descriptor);
    if (intersectionObserver) {
      intersectionObserver.unobserve(element);
    }
  }

  /**
   * to unobserver multiple elements
   *
   * @method disconnect
   * @param {Node|window|String} descriptor
   */
  disconnect(descriptor) {
    let { intersectionObserver } = this._findRoot(descriptor);
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
  }

  /**
   * @method _setupOnIntersection
   * @param {window|String} descriptor
   */
  _setupOnIntersection(descriptor) {
    return function(entries) {
      return this._onAdminIntersection(descriptor, entries);
    }
  }

  /**
   * callback when the observer is triggered
   * @method _onAdminIntersection
   * @param {window|String} descriptor
   * @param {Array} ioEntries
   */
  _onAdminIntersection(descriptor, ioEntries) {
    ioEntries.forEach((entry) => {

      let { isIntersecting, intersectionRatio } = entry;

      // first determine if entry intersecting
      if (isIntersecting) {
        // then find entry's callback in static administration
        let { elements = [] } = this._findRoot(descriptor);

        elements.some(({ element, enterCallback }) => {
          if (element === entry.target) {
            // call entry's enter callback
            enterCallback();
            return true;
          }
        });
      } else if (intersectionRatio <= 0) { // exiting viewport
        // then find entry's callback in static administration
        let { elements = [] } = this._findRoot(descriptor);

        elements.some(({ element, exitCallback }) => {
          if (element === entry.target) {
            // call entry's exit callback
            exitCallback();
            return true;
          }
        });
      }
    });
  }

  /**
   * find element's root || viewportDescriptor in administrator
   * @method _findRoot
   */
  _findRoot(descriptor) {
    return DOMRef.get(descriptor) || {};
  }
}
