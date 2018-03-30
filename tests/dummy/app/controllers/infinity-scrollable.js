import Controller from '@ember/controller';
import { set, get } from '@ember/object';
import { later } from '@ember/runloop';

let rect = '<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>';
let circle = '<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>';
let line = '<line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5"/>';

const images = [rect, circle, line];

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.viewportToleranceOverride = {
      top: 1
    }
  },

  actions: {
    infinityLoad() {
      const newModels = [...Array(10).fill().map(() => `${images[(Math.random() * images.length) | 0]}`)];
      return new Promise((resolve) => {
        later(() => {
          get(this, 'model').push(...newModels);
          set(this, 'model', Array.from(get(this, 'model')));
          resolve();
        }, 0);
      });
    }
  }
});
