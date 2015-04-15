import Ember from 'ember';

const { merge } = Ember;

const defaultTolerance = {
  top    : 0,
  left   : 0,
  bottom : 0,
  right  : 0
};

export default function isInViewport(boundingClientRect={}, height=0, width=0, tolerance=defaultTolerance) {
  const { top, left, bottom, right } = boundingClientRect;
  const tolerances = merge(defaultTolerance, tolerance);
  let {
    top    : topTolerance,
    left   : leftTolerance,
    bottom : bottomTolerance,
    right  : rightTolerance
  } = tolerances;

  return (
    (top - topTolerance)       >= 0 &&
    (left - leftTolerance)     >= 0 &&
    (bottom - bottomTolerance) <= height &&
    (right - rightTolerance)   <= width
  );
}
