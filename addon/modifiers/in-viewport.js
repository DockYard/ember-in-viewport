import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { DEBUG } from '@glimmer/env';
import Modifier from 'ember-modifier';
import deepEqual from 'fast-deep-equal';

const WATCHED_ELEMENTS = DEBUG ? new WeakSet() : undefined;

export default class InViewportModifier extends Modifier {
  @service inViewport;

  name = 'in-viewport';

  lastOptions;

  get options() {
    // eslint-disable-next-line no-unused-vars
    const { onEnter, onExit, ...options } = this.args.named;
    return options;
  }

  get hasStaleOptions() {
    return !deepEqual(this.options, this.lastOptions);
  }

  validateArguments() {
    assert(
      `'{{in-viewport}}' does not accept positional parameters. Specify listeners via 'onEnter' / 'onExit'.`,
      this.args.positional.length === 0
    );
    assert(
      `'{{in-viewport}}' either expects 'onEnter', 'onExit' or both to be present.`,
      typeof this.args.named.onEnter === 'function' ||
        typeof this.args.named.onExit === 'function'
    );
  }

  @action
  onEnter(...args) {
    if (this.args.named.onEnter) {
      this.args.named.onEnter.call(null, this.element, ...args);
    }

    if (!this.options.viewportSpy) {
      this.inViewport.stopWatching(this.element);
    }
  }

  @action
  onExit(...args) {
    if (this.args.named.onExit) {
      this.args.named.onExit.call(null, this.element, ...args);
    }
  }

  setupWatcher() {
    assert(
      `'${this.element}' is already being watched. Make sure that '{{in-viewport}}' is only used once on this element and that you are not calling 'inViewport.watchElement(element)' in other places.`,
      !WATCHED_ELEMENTS.has(this.element)
    );
    if (DEBUG) WATCHED_ELEMENTS.add(this.element);
    this.inViewport.watchElement(
      this.element,
      this.options,
      this.onEnter,
      this.onExit
    );
    this.lastOptions = this.options;
  }

  destroyWatcher() {
    if (DEBUG) WATCHED_ELEMENTS.delete(this.element);
    this.inViewport.stopWatching(this.element);
  }

  didInstall() {
    this.setupWatcher();
  }

  didUpdateArguments() {
    if (this.hasStaleOptions) {
      this.destroyWatcher();
      this.setupWatcher();
    }
  }

  didReceiveArguments() {
    this.validateArguments();
  }

  willRemove() {
    this.destroyWatcher();
  }
}
