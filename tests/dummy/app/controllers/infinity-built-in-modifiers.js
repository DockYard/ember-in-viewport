import Controller from '@ember/controller';

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

  actions: {
    didEnterViewport(artwork, i, element) {
      console.log('enter', { artwork, i, element });
    },
    didExitViewport(artwork, i, element) {
      console.log('exit', { artwork, i, element });
    }
  }
});
