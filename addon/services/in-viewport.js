import Service from '@ember/service';
import { get, set } from '@ember/object';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
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
    this._rAFAdmin = new RAFAdmin();
    set(this, 'registry', new WeakMap());
  }

  /**
   * Trigger various events like didEnterViewport and didExitViewport
   *
   * @method triggerEvent
   * @param String eventName
   * @void
   */
  triggerEvent(eventName) {
    this.trigger(eventName);
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
    rAFIDS[elementId] = get(this, '_rAFAdmin').add(elementId, callback);
  }

  removeRAF(elementId) {
    get(this,'_rAFAdmin').remove(elementId);
    delete rAFIDS[elementId];
  }

  isInViewport(...args) {
    return isInViewport(...args);
  }

  /** other **/
  destroy() {
    set(this, 'registry', null);
    get(this, 'observerAdmin').destroy();
    get(this, '_rAFAdmin').reset();
  }
}
