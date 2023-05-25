import Controller from '@ember/controller';
import { action, set } from '@ember/object';

let rect =
  '<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>';
let circle =
  '<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>';
let line =
  '<line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5"/>';

const images = [rect, circle, line];
const arr = Array.apply(null, Array(10));
const models = [
  ...arr.map(() => `${images[(Math.random() * images.length) | 0]}`),
];

export default class InfinityClass extends Controller {
  constructor() {
    super(...arguments);
    this.viewportToleranceOverride = {
      bottom: 200,
    };
  }

  models = models;

  @action
  infinityLoad() {
    const arr = Array.apply(null, Array(10));
    const newModels = [
      ...arr.map(() => `${images[(Math.random() * images.length) | 0]}`),
    ];
    const models = this.models;
    models.push(...newModels);
    set(this, 'models', Array.prototype.slice.call(models));
  }
}
