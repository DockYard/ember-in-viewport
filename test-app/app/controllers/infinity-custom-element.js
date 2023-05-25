import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';

class CustomSentinel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `<div style="width:100px;height:100px"></div>`;
  }
}

window.customElements.define('custom-sentinel', CustomSentinel);

const images = ['jarjan', 'aio___', 'kushsolitary', 'kolage', 'idiot', 'gt'];

const arr = Array.apply(null, Array(10));
const models = [
  ...arr.map(() => {
    return {
      bgColor: 'E8D26F',
      url: `https://s3.amazonaws.com/uifaces/faces/twitter/${
        images[(Math.random() * images.length) | 0]
      }/128.jpg`,
    };
  }),
];

export default class InfinityCustomElement extends Controller {
  @service inViewport;

  models = models;

  @action
  setupInViewport(element) {
    // find distance of top left corner of artwork to bottom of screen. Shave off 50px so user has to scroll slightly to trigger load
    window.requestAnimationFrame(() => {
      const { onEnter } = this.inViewport.watchElement(element, {
        viewportTolerance: { top: 200, right: 200, bottom: 200, left: 200 },
      });

      onEnter(this.infinityLoad.bind(this));
    });
  }

  @action
  infinityLoad() {
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

    const models = this.models;
    models.push(...newModels);
    set(this, 'models', Array.prototype.slice.call(models));
  }
}
