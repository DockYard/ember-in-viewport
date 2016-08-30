import Ember from 'ember';
import config from '../config/environment';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';

const defaultConfig = {
  viewportEnabled: true,
  viewportSpy: false,
  viewportScrollSensitivity: 1,
  viewportRefreshRate: 100,
  viewportListeners: [
    { context: window, event: 'scroll.scrollable' },
    { context: window, event: 'resize.resizable' }
  ],
  viewportTolerance: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
};

if (canUseDOM) {
  defaultConfig.viewportListeners.push({
    context: document,
    event: 'touchmove.scrollable'
  });
}

const { merge } = Ember;

export function initialize() {
  const application = arguments[1] || arguments[0];
  const { viewportConfig = {} } = config;
  const mergedConfig = merge(defaultConfig, viewportConfig);

  application.register('config:in-viewport', mergedConfig, { instantiate: false });
}

export default {
  name: 'viewport-config',
  initialize: initialize
};
