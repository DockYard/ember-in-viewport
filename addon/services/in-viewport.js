import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject } from '@ember/service';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
import Evented from '@ember/object/evented';

const rAFIDS = {};

/**
 * ensure use on requestAnimationFrame, no matter how many components
 * on the page are using this mixin
 *
 * @class RAFAdmin
 */
export default Service.extend(Evented, {
  _observerAdmin: inject('-observer-admin'),
  _rAFAdmin: inject('-raf-admin'),

  init() {
    this._super(...arguments);

    set(this, 'registry', new WeakMap());
  },

  /**
   * Trigger various events like didEnterViewport and didExitViewport
   *
   * @method triggerEvent
   * @param String eventName
   * @void
   */
  triggerEvent(eventName) {
    this.trigger(eventName);
  },

  /** IntersectionObserver **/

  /**
   * In order to track elements and the state that comes with them, we need to keep track
   * of them in order to get at them at a later time
   *
   * @method addToRegistry
   * @void
   */
  addToRegistry(element, observerOptions, scrollableArea) {
    get(this, 'registry').set(element, { observerOptions, scrollableArea });
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

    get(this, '_observerAdmin').add(
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

    const { observerOptions, scrollableArea } = get(this, 'registry').get(target);
    get(this, '_observerAdmin').unobserve(target, observerOptions, scrollableArea);
  },

  /** RAF **/
  addRAF(elementId, callback) {
    rAFIDS[elementId] = get(this, '_rAFAdmin').add(elementId, callback);
  },

  removeRAF(elementId) {
    get(this,'_rAFAdmin').remove(elementId);
    delete rAFIDS[elementId];
  },

  isInViewport(...args) {
    return isInViewport(...args);
  },

  /** other **/
  destroy() {
    set(this, 'registry', null);
  }
});
