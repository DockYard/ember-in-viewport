import ScrollableController from './infinity-scrollable';

export default ScrollableController.extend({
  init() {
    this._super(...arguments);
    this.viewportToleranceOverride = {
      bottom: 200
    }
  },
});
