import config from '../config/environment';

export function initialize(_container, application) {
  const { viewportConfig = {} } = config;

  application.register('config:in-viewport', viewportConfig, { instantiate: false });
}

export default {
  name: 'viewport-config',
  initialize: initialize
};
