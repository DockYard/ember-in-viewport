import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { DEBUG } from '@glimmer/env';
import Modifier from 'ember-class-based-modifier';
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
    !deepEqual(this.options, this.lastOptions);
  }

  validateArguments() {
    assert(
      `'{{in-viewport}}' does not accept positional parameters. Specify listeners via 'onEnter' / 'onExit'.`,
      this.args.positional.length === 0
    );
    assert(
      `'{{in-viewport}}' expects 'onEnter', 'onExit' or both to be present.`,
      typeof this.args.named.onEnter === 'function' ||
        this.args.named.onExit === 'function'
    );
  }

  @action
  onEnter() {
    if (this.args.named.onEnter)
      this.args.named.onEnter.call(null, this.element);
  }

  @action
  onExit() {
    if (this.args.named.onExit) this.args.named.onExit.call(null, this.element);
  }

  setupWatcher() {
    assert(
      `'${this.element}' is already being watched. Make sure that '{{${this.name}}}' is the only viewport modifier on this element and that you are not calling 'inViewport.watchElement(element)' in other places.`,

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

export class ShortcutInViewportModifier extends InViewportModifier {
  positionalCallback() {
    this.args.positional[0].call(null, this.element);
  }

  onEnter() {}

  onExit() {}

  validateArguments() {
    assert(
      `'{{${
        this.name
      }}}' only accepts a function as the listener, but you provided: '${
        this.args.positional[0]
      }'`,
      typeof this.args.positional[0] === 'function'
    );
    assert(
      `'{{${this.name}}}' only accepts a single positional argument (the listener), but you provided: '${this.args.positional}'`,
      this.args.positional.length === 1
    );
  }
}
