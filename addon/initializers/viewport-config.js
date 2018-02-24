import { assign } from '@ember/polyfills';
import canUseDOM from 'ember-in-viewport/utils/can-use-dom';

const defaultConfig = {
  viewportEnabled: true,
  viewportSpy: false,
  viewportScrollSensitivity: 1,
  viewportRefreshRate: 100,
  viewportListeners: [
    { context: window, event: 'scroll' },
    { context: window, event: 'resize' }
  ],
  viewportTolerance: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  intersectionThreshold: 0,
  scrollableArea: null // defaults to layout view (document.documentElement)
};

if (canUseDOM) {
  defaultConfig.viewportListeners.push({
    context: document,
    event: 'touchmove'
  });
}

export function initialize() {
  const application = arguments[1] || arguments[0];
  const config = application.resolveRegistration('config:environment');
  const { viewportConfig = {} } = config;
  const mergedConfig = assign({}, defaultConfig, viewportConfig);

  application.register('config:in-viewport', mergedConfig, { instantiate: false });
}

export default {
  name: 'viewport-config',
  initialize: initialize
};
