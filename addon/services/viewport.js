import Ember from 'ember';

const {
  A,
  computed
} = Ember;

export default Ember.Service.extend({
  _pool: computed(()=> A()),
  init() {
    this.flush();
  },
  flush() {
    window.requestAnimationFrame(()=> {
      if (this.get('isDestroying')) {
        return;
      }
      let currentPool = this.get('_pool');
      this.set('_pool', A());
      currentPool.forEach((fn)=> fn());
      this.flush();
    });
  },
  add(fn) {
    this.get('_pool').pushObject(fn);
    return fn;
  },
  remove(fn) {
    this.get('_pool').removeObject(fn);
    return fn;
  }
});
