import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  computed,
  get,
  set
} = Ember;

const directionMap = {
  left: '←',
  up: '↑',
  right: '→',
  down: '↓',
  none: '¯\\_(ツ)_/¯'
};

export default Component.extend(InViewportMixin, {
  tagName: 'li',
  classNames: ['kittenCard-container'],
  classNameBindings: ['viewportEntered:active:inactive'],
  lastDirection: null,

  isInViewport: computed('viewportEntered', {
    get() {
      return get(this, 'viewportEntered') ? 'Entered' : 'Exited';
    }
  }),

  didScroll(direction) {
    set(this, 'lastDirection', directionMap[direction]);
  }
});
