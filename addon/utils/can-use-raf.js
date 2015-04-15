import canUseDOM from 'ember-in-viewport/utils/can-use-dom';

function checkRAF(window, rAF, cAF) {
  let x;
  let vendors = [ 'ms', 'moz', 'webkit', 'o' ];

  for (x = 0; x < vendors.length && !window[rAF]; ++x) {
    window[rAF] = window[vendors[x] + 'RequestAnimationFrame'];
    window[cAF] = window[vendors[x] + 'CancelAnimationFrame'] ||
    window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (window[rAF] && window[cAF]) {
    return true;
  } else {
    return false;
  }
}


export default function canUseRaf() {
  if (!canUseDOM) { return false; }

  return checkRAF(window, 'requestAnimationFrame', 'cancelAnimationFrame');
}
