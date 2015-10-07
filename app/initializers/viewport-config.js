import Ember from 'ember';
import config from '../config/environment';

// Note: this file must be es5-only in order to be compatible with apps that do
// not use an es6 transpiler
// jscs:disable
var defaultConfig = {
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

var merge = Ember.merge;

export function initialize(_container, application) {
  var viewportConfig = config.viewportConfig || {};

  var mergedConfig = merge(defaultConfig, viewportConfig);

  application.register('config:in-viewport', mergedConfig, { instantiate: false });
}

export default {
  name: 'viewport-config',
  initialize: initialize
};
// jscs:enable
