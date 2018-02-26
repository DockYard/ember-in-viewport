import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('infinity');
  this.route('infinity-scrollable');
  this.route('infinity-scrollable-raf');
  this.route('infinity-scrollable-scrollevent');
});

export default Router;
