import Ember from 'ember';
import config from '../config/environment';

const defaultConfig = {
  viewportSpy               : false,
  viewportScrollSensitivity : 1,
  viewportRefreshRate       : 100,
  viewportListeners         : [],
  viewportTolerance: {
    top    : 0,
    left   : 0,
    bottom : 0,
    right  : 0
  }
};

const { merge } = Ember;

export function initialize(_container, application) {
  const { viewportConfig = {} } = config;

  const mergedConfig = merge(defaultConfig, viewportConfig);

  application.register('config:in-viewport', mergedConfig, { instantiate: false });
}

export default {
  name: 'viewport-config',
  initialize: initialize
};
