import { action } from '@ember/object';
import { ShortcutInViewportModifier } from './in-viewport';

export default class DidExitViewportModifier extends ShortcutInViewportModifier {
  name = 'did-exit-viewport';

  @action
  onExit() {
    this.positionalCallback();
  }
}
