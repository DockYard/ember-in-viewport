import Service from '@ember/service';
import { get, set, setProperties } from '@ember/object';
import { assign } from '@ember/polyfills';
import { getOwner } from '@ember/application';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
import canUseRAF from 'ember-in-viewport/utils/can-use-raf';
import canUseIntersectionObserver from 'ember-in-viewport/utils/can-use-intersection-observer';
import ObserverAdmin from 'ember-in-viewport/-private/observer-admin';
import RAFAdmin from 'ember-in-viewport/-private/raf-admin';

const rAFIDS = {};

/**
 * ensure use on requestAnimationFrame, no matter how many components
 * on the page are using this mixin
 *
 * @class RAFAdmin
 */
export default class InViewport extends Service {
  init() {
    this._super(...arguments);

    this.observerAdmin = new ObserverAdmin();
    this.rafAdmin = new RAFAdmin();
    set(this, 'registry', new WeakMap());

    let options = assign({
      viewportUseRAF: canUseRAF()
    }, this._buildOptions());

    // set viewportUseIntersectionObserver after merging users config to avoid errors in browsers that lack support (https://github.com/DockYard/ember-in-viewport/issues/146)
    options = assign(options, {
      viewportUseIntersectionObserver: canUseIntersectionObserver(),
    });

    setProperties(this, options);
  }

  /** Any strategy **/

  /**
   * @method watchElement
   * @param HTMLElement element
   * @param Object observerOptions
   * @param Function enterCallback
   * @param Function exitCallback
   * @void
   */
  watchElement(element, observerOptions, enterCallback, exitCallback) {
    if (!observerOptions) {
      this.buildObserverOptions();
    }
    if (get(this, 'viewportUseIntersectionObserver')) {
      // create IntersectionObserver instance or add to existing
      this.setupIntersectionObserver(
        element,
        observerOptions,
        enterCallback,
        exitCallback
      );
    }
  }

  buildObserverOptions() {
    const scrollableArea = get(this, 'scrollableArea');
    const domScrollableArea = scrollableArea ? document.querySelector(scrollableArea) : undefined;

    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // IntersectionObserver takes either a Document Element or null for `root`
    const { top = 0, left = 0, bottom = 0, right = 0 } = get(this, 'viewportTolerance');
    return {
      root: domScrollableArea,
      rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
      threshold: get(this, 'intersectionThreshold')
    };
  }

  /**
   * @method addEnterCallback
   * @void
   */
  addEnterCallback(element, enterCallback) {
    if (get(this, 'viewportUseIntersectionObserver')) {
      this.observerAdmin.addEnterCallback(element, enterCallback);
    }
  }

  /**
   * @method addExitCallback
   * @void
   */
  addExitCallback(element, exitCallback) {
    if (get(this, 'viewportUseIntersectionObserver')) {
      this.observerAdmin.addExitCallback(element, exitCallback);
    }
  }

  /** IntersectionObserver **/

  /**
   * In order to track elements and the state that comes with them, we need to keep track
   * of them in order to get at them at a later time
   *
   * @method addToRegistry
   * @void
   */
  addToRegistry(element, observerOptions) {
    get(this, 'registry').set(element, { observerOptions });
  }

  /**
   * @method setupIntersectionObserver
   * @param HTMLElement element
   * @param Object observerOptions
   * @param Function enterCallback
   * @param Function exitCallback
   * @void
   */
  setupIntersectionObserver(element, observerOptions, enterCallback, exitCallback) {
    this.addToRegistry(element, observerOptions);

    get(this, 'observerAdmin').add(
      element,
      observerOptions,
      enterCallback,
      exitCallback
    );
  }

  unobserveIntersectionObserver(target) {
    if (!target) {
      return;
    }

    const { observerOptions, scrollableArea } = get(this, 'registry').get(target);
    get(this, 'observerAdmin').unobserve(target, observerOptions, scrollableArea);
  }

  /** RAF **/
  addRAF(elementId, callback) {
    rAFIDS[elementId] = get(this, 'rafAdmin').add(elementId, callback);
  }

  removeRAF(elementId) {
    get(this,'rafAdmin').remove(elementId);
    delete rAFIDS[elementId];
  }

  isInViewport(...args) {
    return isInViewport(...args);
  }

  /** other **/
  destroy() {
    set(this, 'registry', null);
    get(this, 'observerAdmin').destroy();
    get(this, 'rafAdmin').reset();
  }

  _buildOptions(defaultOptions = {}) {
    const owner = getOwner(this);

    if (owner) {
      return assign(defaultOptions, owner.lookup('config:in-viewport'));
    }
  }

}
