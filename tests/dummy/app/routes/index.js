import Ember from 'ember';

const { Route } = Ember;

let kittens = [
  { id: 0,  name: 'Amanda',  image: 'http://i.imgur.com/kJxsoIG.jpg' },
  { id: 1,  name: 'Doug',    image: 'http://i.imgur.com/gBkBJxy.jpg' },
  { id: 2,  name: 'Rob',     image: 'http://i.imgur.com/i09FJm4.jpg' },
  { id: 3,  name: 'Brian',   image: 'http://i.imgur.com/SpCbHBI.jpg' },
  { id: 4,  name: 'Lauren',  image: 'http://i.imgur.com/3rYHhEu.jpg' },
  { id: 5,  name: 'Romina',  image: 'http://i.imgur.com/kkkaBYc.jpg' },
  { id: 6,  name: 'Dan',     image: 'http://i.imgur.com/409INxL.jpg' },
  { id: 7,  name: 'Lin',     image: 'http://i.imgur.com/38vd8YE.jpg' },
  { id: 8,  name: 'Marin',   image: 'http://i.imgur.com/fM2GpMn.jpg' },
  { id: 9,  name: 'Steven',  image: 'http://i.imgur.com/g9D6et6.jpg' },
  { id: 10, name: 'Maria',   image: 'http://i.imgur.com/yP8Mm0R.jpg' },
  { id: 11, name: 'Mike',    image: 'http://i.imgur.com/WuCtxDs.jpg' },
  { id: 12, name: 'Jon',     image: 'http://i.imgur.com/O1o13Dk.jpg' },
  { id: 13, name: 'Cory',    image: 'http://i.imgur.com/yZzl70m.jpg' },
  { id: 14, name: 'Ashley',  image: 'http://i.imgur.com/GakNL3P.jpg' },
  { id: 15, name: 'Tim',     image: 'http://i.imgur.com/5Jk1quf.jpg' },
  { id: 16, name: 'Jack',    image: 'http://i.imgur.com/2Wvmx81.jpg' },
  { id: 17, name: 'Estelle', image: 'http://i.imgur.com/MbFjag4.jpg' }
];

export default Route.extend({
  model() {
    return kittens;
  },

  setupController(controller, models) {
    controller.set('kittens', models);
  },

  actions: {
    moar() {
      kittens = kittens.concat(kittens);
      this.refresh();
    }
  }
});
