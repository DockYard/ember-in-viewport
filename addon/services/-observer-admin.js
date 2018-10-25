import Service from '@ember/service';
import { bind } from '@ember/runloop';

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
    // WeakMap { root: { stringifiedOptions: { elements: [{ element, enterCallback, exitCallback }], observerOptions, IntersectionObserver }, stringifiedOptions: [].... } }
    // A root may have multiple keys with different observer options
    this._DOMRef = new WeakMap();
  }

  /**
   * Adds element to observe via IntersectionObserver and stores element + relevant callbacks and observer options in static
   * administrator for lookup in the future
   *
   * @method add
   * @param {Node} element
   * @param {Function} enterCallback
   * @param {Function} exitCallback
   * @param {Object} observerOptions
   * @param {String} [scrollableArea]
   * @public
   */
  add(element, enterCallback, exitCallback, observerOptions, scrollableArea) {
    if (!element || !observerOptions) {
      return;
    }
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
    let newIO = new IntersectionObserver(bind(this, this._setupOnIntersection(observerOptions, scrollableArea)), observerOptions);
    newIO.observe(element);
    let observerEntry = {
      elements: [{ element, enterCallback, exitCallback }],
      observerOptions,
      intersectionObserver: newIO
    };

    let stringifiedOptions = this._stringifyObserverOptions(observerOptions, scrollableArea);
    if (potentialRootMatch) {
      // if share same root and need to add new entry to root match
      potentialRootMatch[stringifiedOptions] = observerEntry;
    } else {
      // no root exists, so add to WeakMap
      this._DOMRef.set(root, { [stringifiedOptions]: observerEntry });
    }
  }

  /**
   * Unobserve target element and remove element from static admin
   *
   * @method unobserve
   * @param {Node|window} target
   * @param {Object} observerOptions
   * @param {String} scrollableArea
   * @public
   */
  unobserve(target, observerOptions, scrollableArea) {
    let { elements = [], intersectionObserver } = this._findMatchingRootEntry(observerOptions, scrollableArea);

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
   * @method willDestroy
   * @public
   */
  willDestroy() {
    this._super(...arguments);
    this._DOMRef = null;
  }

  /**
   * use function composition to curry observerOptions
   *
   * @method _setupOnIntersection
   * @param {Object} observerOptions
   * @param {String} scrollableArea
   */
  _setupOnIntersection(observerOptions, scrollableArea) {
    return function(entries) {
      return this._onIntersection(observerOptions, scrollableArea, entries);
    }
  }

  /**
   * IntersectionObserver callback when element is intersecting viewport
   *
   * @method _onIntersection
   * @param {Object} observerOptions
   * @param {String} scrollableArea
   * @param {Array} ioEntries
   * @private
   */
  _onIntersection(observerOptions, scrollableArea, ioEntries) {
    ioEntries.forEach((entry) => {

      let { isIntersecting, intersectionRatio } = entry;

      // first determine if entry intersecting
      if (isIntersecting) {
        // then find entry's callback in static administration
        let { elements = [] } = this._findMatchingRootEntry(observerOptions, scrollableArea);

        elements.some((obj) => {
          if (obj.element === entry.target) {
            // call entry's enter callback
            obj.enterCallback();
            return true;
          }
        });
      } else if (intersectionRatio <= 0) { // exiting viewport
        // then find entry's callback in static administration
        let { elements = [] } = this._findMatchingRootEntry(observerOptions, scrollableArea);

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
   * @private
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
   * @param {String} scrollableArea
   * @return {Object} entry with elements and other options
   */
  _findMatchingRootEntry(observerOptions, scrollableArea) {
    let { root = window } = observerOptions;
    let matchingRoot = this._findRoot(root) || {};
    let stringifiedOptions = this._stringifyObserverOptions(observerOptions, scrollableArea);
    return matchingRoot[stringifiedOptions];
  }

  /**
   * Determine if existing elements for a given root based on passed in observerOptions
   * regardless of sort order of keys
   *
   * @method _determineMatchingElements
   * @param {Object} observerOptions
   * @param {Object} potentialRootMatch e.g. { stringifiedOptions: { elements: [], ... }, stringifiedOptions: { elements: [], ... }}
   * @private
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
   * @private
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

  /**
   * Stringify observerOptions for use as a key.
   * Excludes observerOptions.root so that the resulting key is stable
   *
   * @param {Object} observerOptions
   * @param {String} scrollableArea
   * @private
   * @return {String}
   */
  _stringifyObserverOptions(observerOptions, scrollableArea) {
    let replacer = (key, value) => {
      if (key === 'root') return scrollableArea;
      return value;
    };

    return JSON.stringify(observerOptions, replacer);
  }
}
