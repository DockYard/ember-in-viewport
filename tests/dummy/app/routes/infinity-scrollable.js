import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

let rect = '<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>';
let circle = '<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>';
let line = '<line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5"/>';

const images = [rect, circle, line];

export default Route.extend({
  model() {
    let models = [...Array(10).fill().map(() => `${images[(Math.random() * images.length) | 0]}`)];
    return new Promise((resolve) => {
      later(() => {
        resolve(models);
      }, 0);
    });
  }
});
