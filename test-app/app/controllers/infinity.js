import Controller from '@ember/controller';
import { set, action } from '@ember/object';
import { later } from '@ember/runloop';
import { Promise } from 'rsvp';

const images = ['jarjan', 'aio___', 'kushsolitary', 'kolage', 'idiot', 'gt'];

const arr = Array.apply(null, Array(10));
const models = [
  ...arr.map(
    () =>
      `https://s3.amazonaws.com/uifaces/faces/twitter/${
        images[(Math.random() * images.length) | 0]
      }/128.jpg`
  ),
];

export default class Infinity extends Controller {
  models = models;

  viewportToleranceOverride = {
    bottom: 300,
  };

  @action
  infinityLoad() {
    const arr = Array.apply(null, Array(10));
    const newModels = [
      ...arr.map(
        () =>
          `https://s3.amazonaws.com/uifaces/faces/twitter/${
            images[(Math.random() * images.length) | 0]
          }/128.jpg`
      ),
    ];
    return new Promise((resolve) => {
      later(() => {
        const models = this.models;
        models.push(...newModels);
        set(this, 'models', Array.prototype.slice.call(models));
        resolve();
      }, 0);
    });
  }
}
