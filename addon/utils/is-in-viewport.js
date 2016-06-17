import Ember from 'ember';

const { merge } = Ember;

const defaultTolerance = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};

export default function isInViewport(boundingClientRect = {}, height = 0, width = 0, tolerance = defaultTolerance) {
  const { top, left, bottom, right } = boundingClientRect;
  const tolerances = merge(defaultTolerance, tolerance);
  const {
    top: topTolerance,
    left: leftTolerance,
    bottom: bottomTolerance,
    right: rightTolerance
  } = tolerances;

  // Don't check for dimensions where tolerance set to `null`
  return (topTolerance === null ? true : (top - topTolerance) <= height) &&
    (topTolerance === null ? true : (left + leftTolerance) >= 0) &&
    (bottomTolerance === null ? true : (bottom - bottomTolerance) <= height) &&
    (rightTolerance === null ? true : (right - rightTolerance) <= width);
}
