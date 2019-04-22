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
    this.registry = new WeakMap();
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
  }

  addEnterCallback(element, enterCallback) {
    this.registry.set(
      element,
      Object.assign({}, this.registry.get(element), { enterCallback })
    );
  }

  addExitCallback(element, exitCallback) {
    this.registry.set(
      element,
      Object.assign({}, this.registry.get(element), { exitCallback })
    );
  }

  getCallbacks(element) {
    return this.registry.get(element);
  }
}

export function startRAF(
  element,
  {
    scrollableArea,
    viewportTolerance,
    viewportSpy = false
  },
  enterCallback,
  exitCallback,
  addRAF
) {
  const domScrollableArea = scrollableArea ? document.querySelector(scrollableArea) : undefined;

  const height = domScrollableArea
    ? domScrollableArea.offsetHeight + domScrollableArea.getBoundingClientRect().top
    : window.innerHeight;
  const width = scrollableArea
    ? domScrollableArea.offsetWidth + domScrollableArea.getBoundingClientRect().left
    : window.innerWidth;
  const boundingClientRect = element.getBoundingClientRect();

  if (boundingClientRect) {
    const viewportEntered = element.getAttribute('data-in-viewport-entered');

    triggerDidEnterViewport(
      element,
      isInViewport(
        boundingClientRect,
        height,
        width,
        viewportTolerance
      ),
      viewportSpy,
      enterCallback,
      exitCallback,
      viewportEntered
    );

    if (viewportSpy || viewportEntered !== 'true') {
      // recursive
      addRAF(
        startRAF.bind(
          this,
          element,
          { scrollableArea, viewportTolerance, viewportSpy },
          enterCallback,
          exitCallback,
          addRAF
        )
      );
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
  const didEnter = (!viewportEntered || viewportEntered === 'false') && hasEnteredViewport;
  const didLeave = viewportEntered === 'true' && !hasEnteredViewport;

  if (didEnter) {
    element.setAttribute('data-in-viewport-entered', true);
    enterCallback();
  }

  if (didLeave && viewportSpy) {
    element.setAttribute('data-in-viewport-entered', false);
    exitCallback();
  }

  if (viewportSpy || !didEnter) {
    return false;
  }

  return true;
}
