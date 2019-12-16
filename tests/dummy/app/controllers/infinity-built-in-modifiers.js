import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { set, get } from '@ember/object';

const images = ['jarjan', 'aio___', 'kushsolitary', 'kolage', 'idiot', 'gt'];

const arr = Array.apply(null, Array(10));
const models = [
  ...arr.map(() => {
    return {
      bgColor: 'E8D26F',
      url: `https://s3.amazonaws.com/uifaces/faces/twitter/${
        images[(Math.random() * images.length) | 0]
      }/128.jpg`
    };
  })
];

export default Controller.extend({
  queryParams: ['direction'],
  direction: 'both',

  models,

  init() {
    this._super(...arguments);

    set(this, 'viewportTolerance', {
      bottom: 500
    });
  },

  actions: {
    didEnterViewport(/*artwork, i, element*/) {
      const arr = Array.apply(null, Array(10));
      const newModels = [...arr.map(() => {
        return {
          bgColor: '0790EB',
          url: `https://s3.amazonaws.com/uifaces/faces/twitter/${images[(Math.random() * images.length) | 0]}/128.jpg`
        }
      })];

      return new Promise((resolve) => {
        later(() => {
          const models = get(this, 'models');
          models.push(...newModels);
          set(this, 'models', Array.prototype.slice.call(models));
          resolve();
        }, 0);
      });
    },

    didExitViewport(/*artwork, i, element*/) {
      // console.log('exit', { artwork, i, element });
    }
  }
});
