import { assert } from '@ember/debug';
const { floor } = Math;

export default function checkScrollDirection(lastPosition = null, newPosition = {}, sensitivity = 1) {
  if (!lastPosition) {
    return 'none';
  }

  assert('sensitivity cannot be 0', sensitivity);

  const { top, left } = newPosition;
  const { top: lastTop, left: lastLeft } = lastPosition;

  const delta = {
    top: floor((top  - lastTop)  / sensitivity) * sensitivity,
    left: floor((left - lastLeft) / sensitivity) * sensitivity
  };

  if (delta.top > 0) {
    return 'down';
  }

  if (delta.top < 0) {
    return 'up';
  }

  if (delta.left > 0) {
    return 'right';
  }

  if (delta.left < 0) {
    return 'left';
  }
}
