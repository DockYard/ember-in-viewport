/* jshint node: true */

'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    viewportConfig: {
      viewportSpy               : false,
      viewportScrollSensitivity : 1,
      viewportRefreshRate       : 100,
      viewportListeners         : [],
      viewportTolerance: {
        top    : 0,
        left   : 0,
        bottom : 0,
        right  : 0
      },
    }
  };
};
