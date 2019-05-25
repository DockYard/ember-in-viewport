import Controller from '@ember/controller';
import { set, get } from '@ember/object';
import { later } from '@ember/runloop';
import { Promise } from 'rsvp';

const images = ["jarjan", "aio___", "kushsolitary", "kolage", "idiot", "gt"];

const arr = Array.apply(null, Array(10));
const models = [...arr.map(() => {
  return { bgColor: 'E8D26F', url: `https://s3.amazonaws.com/uifaces/faces/twitter/${images[(Math.random() * images.length) | 0]}/128.jpg` }
})];

export default Controller.extend({
  models,

  actions: {
    infinityLoad() {
      const arr = Array.apply(null, Array(10));
      const newModels = [...arr.map(() => {
        return { bgColor: '0790EB', url: `https://s3.amazonaws.com/uifaces/faces/twitter/${images[(Math.random() * images.length) | 0]}/128.jpg` }
      })];

      return new Promise((resolve) => {
        later(() => {
          const models = get(this, 'models');
          models.push(...newModels);
          set(this, 'models', Array.prototype.slice.call(models));
          resolve();
        }, 0);
      });
    }
  }
});
