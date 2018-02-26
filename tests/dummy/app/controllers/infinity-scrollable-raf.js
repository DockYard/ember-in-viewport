import ScrollableController from './infinity-scrollable';
import { set, get } from '@ember/object';

let rect = '<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>';
let circle = '<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>';
let line = '<line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5"/>';

const images = [rect, circle, line];
let otherModels = [...Array(10).fill().map(() => `${images[(Math.random() * images.length) | 0]}`)];

export default ScrollableController.extend({
  init() {
    this._super(...arguments);
    this.viewportToleranceOverride = {
      bottom: 200
    }
  },

  otherModels,

  actions: {
    infinityLoadOther() {
      const newModels = [...Array(10).fill().map(() => `${images[(Math.random() * images.length) | 0]}`)];
      get(this, 'otherModels').push(...newModels);
      set(this, 'otherModels', Array.from(get(this, 'otherModels')));
    }
  }
});
