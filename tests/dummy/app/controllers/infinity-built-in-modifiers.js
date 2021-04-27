import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { action, set } from '@ember/object';

const images = ['jarjan', 'aio___', 'kushsolitary', 'kolage', 'idiot', 'gt'];

export default class InfinityBuiltInModifiers extends Controller {
  queryParams = ['direction'];
  direction = 'both';

  constructor() {
    super(...arguments);

    this.models = [
      ...Array.apply(null, Array(10)).map(() => {
        return {
          bgColor: 'E8D26F',
          url: `https://s3.amazonaws.com/uifaces/faces/twitter/${
            images[(Math.random() * images.length) | 0]
          }/128.jpg`,
        };
      }),
    ];
    set(this, 'viewportTolerance', {
      bottom: 300,
    });
  }

  @action
  setTitle(element) {
    element.textContent = '{{in-viewport}} modifier';
  }

  @action
  setTitleGreen() {
    document.querySelector('h1#green-target').style = 'color: green';
  }

  @action
  removeTitleGreen() {
    document.querySelector('h1#green-target').style = '';
  }

  @action
  didEnterViewport(/*artwork, i, element*/) {
    const arr = Array.apply(null, Array(10));
    const newModels = [
      ...arr.map(() => {
        return {
          bgColor: '0790EB',
          url: `https://s3.amazonaws.com/uifaces/faces/twitter/${
            images[(Math.random() * images.length) | 0]
          }/128.jpg`,
        };
      }),
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

  @action
  didExitViewport(/*artwork, i, element*/) {
    // console.log('exit', { artwork, i, element });
  }
}
