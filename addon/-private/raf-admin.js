import RafPool from 'raf-pool';
import isInViewport from 'ember-in-viewport/utils/is-in-viewport';

/**
 * ensure use on requestAnimationFrame, no matter how many components
 * on the page are using this mixin
 *
 * @class RAFAdmin
 */
export default class RAFAdmin {
  /** @private **/
  constructor() {
    this._rafPool = new RafPool();
    this.elementRegistry = new WeakMap();
  }

  add(...args) {
    return this._rafPool.add(...args);
  }

  flush() {
    return this._rafPool.flush();
  }

  remove(...args) {
    return this._rafPool.remove(...args);
  }

  reset(...args) {
    this._rafPool.reset(...args);
    this._rafPool.stop(...args);
  }

  /**
   * We provide our own element registry to add callbacks the user creates
   *
   * @method addEnterCallback
   * @param {HTMLElement} element
   * @param {Function} enterCallback
   */
  addEnterCallback(element, enterCallback) {
    this.elementRegistry.set(
      element,
      Object.assign({}, this.elementRegistry.get(element), { enterCallback })
    );
  }

  /**
   * We provide our own element registry to add callbacks the user creates
   *
   * @method addExitCallback
   * @param {HTMLElement} element
   * @param {Function} exitCallback
   */
  addExitCallback(element, exitCallback) {
    this.elementRegistry.set(
      element,
      Object.assign({}, this.elementRegistry.get(element), { exitCallback })
    );
  }
}

/**
 * This is a recursive function that adds itself to raf-pool to be executed on a set schedule
 *
 * @method startRAF
 * @param {HTMLElement} element
 * @param {Object} configurationOptions
 * @param {Function} enterCallback
 * @param {Function} exitCallback
 * @param {Function} addRAF
 * @param {Function} removeRAF
 */
export function startRAF(
  element,
  { scrollableArea, viewportTolerance, viewportSpy = false },
  enterCallback,
  exitCallback,
  addRAF, // bound function from service to add elementId to raf pool
  removeRAF // bound function from service to remove elementId to raf pool
) {
  const domScrollableArea =
    typeof scrollableArea === 'string' && scrollableArea
      ? document.querySelector(scrollableArea)
      : scrollableArea instanceof HTMLElement
      ? scrollableArea
      : undefined;

  const height = domScrollableArea
    ? domScrollableArea.offsetHeight +
      domScrollableArea.getBoundingClientRect().top
    : window.innerHeight;
  const width = scrollableArea
    ? domScrollableArea.offsetWidth +
      domScrollableArea.getBoundingClientRect().left
    : window.innerWidth;
  const boundingClientRect = element.getBoundingClientRect();

  if (boundingClientRect) {
    const viewportEntered = element.getAttribute('data-in-viewport-entered');

    triggerDidEnterViewport(
      element,
      isInViewport(boundingClientRect, height, width, viewportTolerance),
      viewportSpy,
      enterCallback,
      exitCallback,
      viewportEntered
    );

    if (viewportSpy || viewportEntered !== 'true') {
      // recursive
      // add to pool of requestAnimationFrame listeners and executed on set schedule
      addRAF(
        startRAF.bind(
          this,
          element,
          { scrollableArea, viewportTolerance, viewportSpy },
          enterCallback,
          exitCallback,
          addRAF,
          removeRAF
        )
      );
    } else {
      removeRAF();
    }
  }
}

function triggerDidEnterViewport(
  element,
  hasEnteredViewport,
  viewportSpy,
  enterCallback,
  exitCallback,
  viewportEntered = false
) {
  const didEnter =
    (!viewportEntered || viewportEntered === 'false') && hasEnteredViewport;
  const didLeave = viewportEntered === 'true' && !hasEnteredViewport;

  if (didEnter) {
    element.setAttribute('data-in-viewport-entered', true);
    enterCallback();
  }

  if (didLeave) {
    exitCallback();

    // reset so we can call again
    if (viewportSpy) {
      element.setAttribute('data-in-viewport-entered', false);
    }
  }
}
