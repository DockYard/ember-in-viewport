import Ember from 'ember';
const { get, set } = Ember;

const images = ["jarjan", "aio___", "kushsolitary", "kolage", "idiot", "gt"];

const models = [...Array(10).fill().map(() => `https://s3.amazonaws.com/uifaces/faces/twitter/${images[(Math.random() * images.length) | 0]}/128.jpg`)];

export default Ember.Controller.extend({
  models,

  actions: {
    infinityLoad() {
      const newModels = [...Array(10).fill().map(() => `https://s3.amazonaws.com/uifaces/faces/twitter/${images[(Math.random() * images.length) | 0]}/128.jpg`)];
      get(this, 'models').push(...newModels);
      set(this, 'models', Array.from(get(this, 'models')));
    }
  }
});
