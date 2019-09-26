import Service from '@ember/service';
import { get, set, setProperties } from '@ember/object';
import { assign } from '@ember/polyfills';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
import canUseRAF from 'ember-in-viewport/utils/can-use-raf';
import canUseIntersectionObserver from 'ember-in-viewport/utils/can-use-intersection-observer';
import ObserverAdmin from 'ember-in-viewport/-private/observer-admin';
import RAFAdmin, { startRAF } from 'ember-in-viewport/-private/raf-admin';

const noop = () => {};

/**
 * ensure use on requestAnimationFrame, no matter how many components
 * on the page are using this mixin
 *
 * @class InViewport
 * @module Ember.Service
 */
export default class InViewport extends Service {
  init() {
    super.init(...arguments);


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

  startIntersectionObserver() {
    this.observerAdmin = new ObserverAdmin();
  }

  startRAF() {
    this.rafAdmin = new RAFAdmin();
  }

  /** Any strategy **/

  /**
   * @method watchElement
   * @param HTMLElement element
   * @param Object configOptions
   * @param Function enterCallback - support mixin approach
   * @param Function exitCallback - support mixin approach
   * @void
   */
  watchElement(element, configOptions = {}, enterCallback, exitCallback) {
      if (get(this, 'viewportUseIntersectionObserver')) {
        if (!get(this, 'observerAdmin')) {
          this.startIntersectionObserver();
        }
        const observerOptions = this.buildObserverOptions(configOptions);

        scheduleOnce('afterRender', this, () => {
          // create IntersectionObserver instance or add to existing
          this.setupIntersectionObserver(
            element,
            observerOptions,
            enterCallback,
            exitCallback
          );
        });
      } else {
        if (!get(this, 'rafAdmin')) {
          this.startRAF();
        }
        scheduleOnce('afterRender', this, () => {
          // grab the user added callbacks when we enter/leave the element
          const {
            enterCallback = noop,
            exitCallback = noop
          } = this.getCallbacks(element) || {};
          // this isn't using the same functions as the mixin case, but that is b/c it is a bit harder to unwind.
          // So just rewrote it with pure functions for now
          startRAF(
            element,
            configOptions,
            enterCallback,
            exitCallback,
            this.addRAF.bind(this, element.id),
            this.removeRAF.bind(this, element.id)
          );
        });
      }

      return {
        onEnter: this.addEnterCallback.bind(this, element),
        onExit: this.addExitCallback.bind(this, element)
      };
  }

  /**
   * @method addEnterCallback
   * @void
   */
  addEnterCallback(element, enterCallback) {
    if (get(this, 'viewportUseIntersectionObserver')) {
      this.observerAdmin.addEnterCallback(element, enterCallback);
    } else {
      this.rafAdmin.addEnterCallback(element, enterCallback);
    }
  }

  /**
   * @method addExitCallback
   * @void
   */
  addExitCallback(element, exitCallback) {
    if (get(this, 'viewportUseIntersectionObserver')) {
      this.observerAdmin.addExitCallback(element, exitCallback);
    } else {
      this.rafAdmin.addExitCallback(element, exitCallback);
    }
  }

  getCallbacks(target) {
    return get(this, 'rafAdmin').getCallbacks(target);
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

  buildObserverOptions({ intersectionThreshold = 0, scrollableArea = null, viewportTolerance = {} }) {
    const domScrollableArea =
      scrollableArea instanceof HTMLElement ? scrollableArea
      : typeof scrollableArea === 'string' ? document.querySelector(scrollableArea)
      : undefined;

    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // IntersectionObserver takes either a Document Element or null for `root`
    const { top = 0, left = 0, bottom = 0, right = 0 } = viewportTolerance;
    return {
      root: domScrollableArea,
      rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
      threshold: intersectionThreshold
    };
  }

  unobserveIntersectionObserver(target) {
    if (!target) {
      return;
    }

    const registeredTarget = get(this, 'registry').get(target);
    if (typeof registeredTarget === 'object') {
      get(this, 'observerAdmin').unobserve(
        target,
        registeredTarget.observerOptions,
        registeredTarget.scrollableArea
      );
    }
  }

  /** RAF **/

  addRAF(elementId, fn) {
    get(this, 'rafAdmin').add(elementId, fn);
  }

  removeRAF(elementId) {
    if (get(this, 'rafAdmin')) {
      get(this, 'rafAdmin').remove(elementId);
    }
  }

  isInViewport(...args) {
    return isInViewport(...args);
  }

  /** other **/
  stopWatching(target) {
    if (get(this, 'observerAdmin')) {
      this.unobserveIntersectionObserver(target);
    }
    if (get(this, 'rafAdmin')) {
      this.removeRAF(target);
    }
  }

  destroy() {
    set(this, 'registry', null);
    if (get(this, 'observerAdmin')) {
      get(this, 'observerAdmin').destroy();
    }
    if (get(this, 'rafAdmin')) {
      get(this, 'rafAdmin').reset();
    }
  }

  _buildOptions(defaultOptions = {}) {
    const owner = getOwner(this);

    if (owner) {
      return assign(defaultOptions, owner.lookup('config:in-viewport'));
    }
  }
}
