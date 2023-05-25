import Route from '@ember/routing/route';

let rect =
  '<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>';
let circle =
  '<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>';
let line =
  '<line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5"/>';

const images = [rect, circle, line];

export default Route.extend({
  model() {
    const arr = Array.apply(null, Array(10));
    return [...arr.map(() => `${images[(Math.random() * images.length) | 0]}`)];
  },
});
