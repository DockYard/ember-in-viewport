// Adapted from Paul Irish's rAF polyfill
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

import canUseDOM from 'ember-in-viewport/utils/can-use-dom';

function checkRAF(window, rAF, cAF) {
  let x;
  let vendors = [ 'ms', 'moz', 'webkit', 'o' ];

  for (x = 0; x < vendors.length && !window[rAF]; ++x) {
    window[rAF] = window[`${vendors[x]}RequestAnimationFrame`];
    window[cAF] = window[`${vendors[x]}CancelAnimationFrame`] ||
    window[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (window[rAF] && window[cAF]) {
    return true;
  } else {
    return false;
  }
}

export default function canUseRAF() {
  if (!canUseDOM) {
    return false;
  }

  return checkRAF(window, 'requestAnimationFrame', 'cancelAnimationFrame');
}
