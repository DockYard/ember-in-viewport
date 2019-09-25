import { action } from '@ember/object';
import { ShortcutInViewportModifier } from './in-viewport';

export default class DidEnterViewportModifier extends ShortcutInViewportModifier {
  name = 'did-enter-viewport';

  @action
  onEnter() {
    this.positionalCallback();
  }
}
