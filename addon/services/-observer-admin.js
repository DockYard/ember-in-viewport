import Service from '@ember/service';
import { bind } from '@ember/runloop';

// WeakMap { root: { stringifiedOptions: { elements: [{ element }], enterCallback, exitCallback, observerOptions, IntersectionObserver }, stringifiedOptions: [].... } }
// A root may have multiple keys with different observer options
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
      elements.push(element);
      intersectionObserver.observe(element);
      return;
    }

    let newIO = new IntersectionObserver(bind(this, this._setupOnIntersection(observerOptions)), observerOptions);
    newIO.observe(element);
    let observerEntry = {elements: [element], enterCallback, exitCallback, observerOptions, intersectionObserver: newIO };

    if (potentialRootMatch) {
      // if share same root and need to add new entry to root match
      potentialRootMatch[JSON.stringify(observerOptions)] = observerEntry;
    } else {
      // no root exists, so add to WeakMap
      DOMRef.set(root, { [JSON.stringify(observerOptions)]: observerEntry });
    }
  }

  /**
   * @method unobserve
   * @param {Node} element
   * @param {Node|window} root
   */
  unobserve(element, observerOptions) {
    let elements = this._findMatchingRootEntry(observerOptions);

    if (elements.length > 0) {
      let { intersectionObserver } = elements[0];
      intersectionObserver.unobserve(element);
    }
  }

  /**
   * to unobserver multiple elements
   *
   * @method disconnect
   * @param {Node|window} root
   */
  disconnect(root) {
    let { intersectionObserver } = this._findRoot(root);
    if (intersectionObserver) {
      intersectionObserver.disconnect();
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
        let { elements = [], enterCallback } = this._findMatchingRootEntry(observerOptions);

        elements.some((element) => {
          if (element === entry.target) {
            // call entry's enter callback
            enterCallback();
            return true;
          }
        });
      } else if (intersectionRatio <= 0) { // exiting viewport
        // then find entry's callback in static administration
        let { elements = [], exitCallback } = this._findMatchingRootEntry(observerOptions);

        elements.some((element) => {
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
   * @method _findRoot
   * @param {Node} root
   * @return {Object} of elements that share same root
   */
  _findRoot(root) {
    return DOMRef.get(root);
  }

  /**
   * Used for onIntersection callbacks and unobserving the IntersectionObserver
   * We don't care about key order in the observerOptions because we already added
   * to the static administrator or found an existing IntersectionObserver with the same
   * root && observerOptions to reuse their IntersectionObserver
   *
   * @method _findMatchingRootEntry
   * @param {Object} observerOptions
   * @return {Object} entry with elements and other options
   */
  _findMatchingRootEntry(observerOptions) {
    let stringifiedOptions = JSON.stringify(observerOptions);
    let { root = window } = observerOptions;
    let matchingRoot = DOMRef.get(root) || {};
    return matchingRoot[stringifiedOptions] || {};
  }

  /**
   * determine if existing elements for a given root based on passed in observerOptions
   * irregardless of sort order of keys
   *
   * @method _determineMatchingElements
   * @param {Object} observerOptions
   * @param {Object} potentialRootMatch e.g. { stringifiedOptions: [], stringifiedOptions: [], ...}
   * @return {Object} containing array of elements and other meta
   */
  _determineMatchingElements(observerOptions, potentialRootMatch = {}) {
    let matchingKey = Object.keys(potentialRootMatch).filter((key) => {
      let { observerOptions: comparableOptions } = potentialRootMatch[key];
      return this._compareOptions(observerOptions, comparableOptions);
    });
    return potentialRootMatch[matchingKey];
  }

  /**
   * @method _compareOptions
   * @param {Object} observerOptions
   * @param {Object} comparableOptions
   * @return {Boolean}
   */
  _compareOptions(observerOptions, comparableOptions) {
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
        if (this._compareOptions(observerOptions[key], comparableOptions[key]) === false) {
          return false;
        }
      }
    }
    return true;
  }
}
