import Service from '@ember/service';
import { bind } from '@ember/runloop';

/**
 * Static administrator to ensure use one IntersectionObserver per combination of root + observerOptions
 * Use `root` (viewport) as lookup property
 * `root` will have many options with each option containing one IntersectionObserver instance and various callbacks
 * Provided callback will ensure consumer of this service is able to react to enter or exit of intersection observer
 *
 * @module Ember.Service
 * @class ObserverAdmin
 */
export default class ObserverAdmin extends Service {
  init() {
    this._super(...arguments);
    // WeakMap { root: { stringifiedOptions: { elements: [{ element, enterCallback, exitCallback }], observerOptions, IntersectionObserver }, stringifiedOptions: [].... } }
    // A root may have multiple keys with different observer options
    this._DOMRef = new WeakMap();
  }

  /**
   * adds element to observe entries of IntersectionObserver
   *
   * @method add
   * @param {Node} element
   * @param {Function} enterCallback
   * @param {Function} exitCallback
   * @param {Object} options
   */
  add(element, enterCallback, exitCallback, observerOptions) {
    let { root = window } = observerOptions;

    // first find shared root element (window or scrollable area)
    let potentialRootMatch = this._findRoot(root);
    // second if there is a matching root, find an entry with the same observerOptions
    let matchingEntryForRoot = this._determineMatchingElements(observerOptions, potentialRootMatch);

    if (matchingEntryForRoot) {
      let { elements, intersectionObserver } = matchingEntryForRoot;
      elements.push({ element, enterCallback, exitCallback });
      intersectionObserver.observe(element);
      return;
    }

    // No matching entry for root in static admin, thus create new IntersectionObserver instance
    let newIO = new IntersectionObserver(bind(this, this._setupOnIntersection(observerOptions)), observerOptions);
    newIO.observe(element);
    let observerEntry = {
      elements: [{ element, enterCallback, exitCallback }],
      observerOptions,
      intersectionObserver: newIO
    };

    if (potentialRootMatch) {
      // if share same root and need to add new entry to root match
      potentialRootMatch[JSON.stringify(observerOptions)] = observerEntry;
    } else {
      // no root exists, so add to WeakMap
      this._DOMRef.set(root, { [JSON.stringify(observerOptions)]: observerEntry });
    }
  }

  /**
   * @method unobserve
   * @param {Node} target
   * @param {Node|window} root
   */
  unobserve(target, observerOptions) {
    let { elements = [], intersectionObserver } = this._findMatchingRootEntry(observerOptions);

    intersectionObserver.unobserve(target);

    // important to do this in reverse order
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i] && elements[i].element === target) {
        elements.splice(i, 1);
        break;
      }
    }
  }

  /**
   * use function composition to curry observerOptions
   *
   * @method _setupOnIntersection
   * @param {Object} observerOptions
   */
  _setupOnIntersection(observerOptions) {
    return function(entries) {
      return this._onIntersection(observerOptions, entries);
    }
  }

  /**
   * IntersectionObserver callback when element is intersecting viewport
   *
   * @method _onIntersection
   * @param {Object} observerOptions
   * @param {Array} ioEntries
   */
  _onIntersection(observerOptions, ioEntries) {
    ioEntries.forEach((entry) => {

      let { isIntersecting, intersectionRatio } = entry;

      // first determine if entry intersecting
      if (isIntersecting) {
        // then find entry's callback in static administration
        let { elements = [] } = this._findMatchingRootEntry(observerOptions);

        elements.some((obj) => {
          if (obj.element === entry.target) {
            // call entry's enter callback
            obj.enterCallback();
            return true;
          }
        });
      } else if (intersectionRatio <= 0) { // exiting viewport
        // then find entry's callback in static administration
        let { elements = [] } = this._findMatchingRootEntry(observerOptions);

        elements.some((obj) => {
          if (obj.element === entry.target) {
            // call entry's enter callback
            obj.exitCallback();
            return true;
          }
        });
      }
    });
  }

  /**
   * @method _findRoot
   * @param {Node|window} root
   * @return {Object} of elements that share same root
   */
  _findRoot(root) {
    return this._DOMRef.get(root);
  }

  /**
   * Used for onIntersection callbacks and unobserving the IntersectionObserver
   * We don't care about observerOptions key order because we already added
   * to the static administrator or found an existing IntersectionObserver with the same
   * root && observerOptions to reuse
   *
   * @method _findMatchingRootEntry
   * @param {Object} observerOptions
   * @return {Object} entry with elements and other options
   */
  _findMatchingRootEntry(observerOptions) {
    let stringifiedOptions = JSON.stringify(observerOptions);
    let { root = window } = observerOptions;
    let matchingRoot = this._DOMRef.get(root) || {};
    return matchingRoot[stringifiedOptions];
  }

  /**
   * Determine if existing elements for a given root based on passed in observerOptions
   * regardless of sort order of keys
   *
   * @method _determineMatchingElements
   * @param {Object} observerOptions
   * @param {Object} potentialRootMatch e.g. { stringifiedOptions: { elements: [], ... }, stringifiedOptions: { elements: [], ... }}
   * @return {Object} containing array of elements and other meta
   */
  _determineMatchingElements(observerOptions, potentialRootMatch = {}) {
    let matchingKey = Object.keys(potentialRootMatch).filter((key) => {
      let { observerOptions: comparableOptions } = potentialRootMatch[key];
      return this._areOptionsSame(observerOptions, comparableOptions);
    })[0];

    return potentialRootMatch[matchingKey];
  }

  /**
   * recursive method to test primitive string, number, null, etc and complex
   * object equality.
   *
   * @method _areOptionsSame
   * @param {Object} observerOptions
   * @param {Object} comparableOptions
   * @return {Boolean}
   */
  _areOptionsSame(observerOptions, comparableOptions) {
    // simple comparison of string, number or even null/undefined
    let type1 = Object.prototype.toString.call(observerOptions);
    let type2 = Object.prototype.toString.call(comparableOptions);
    if (type1 !== type2) {
      return false;
    } else if (type1 !== '[object Object]' && type2 !== '[object Object]') {
      return observerOptions === comparableOptions;
    }

    // complex comparison for only type of [object Object]
    for (let key in observerOptions) {
      if (observerOptions.hasOwnProperty(key)) {
        // recursion to check nested
        if (this._areOptionsSame(observerOptions[key], comparableOptions[key]) === false) {
          return false;
        }
      }
    }
    return true;
  }
}
