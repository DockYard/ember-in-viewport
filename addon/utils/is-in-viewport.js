import Ember from 'ember';

const { merge } = Ember;

const defaultTolerance = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};

const isAxisInViewport = function(start, startTolerance, end, endTolerance, limit) {
  // Dimensions are fully LARGER than the viewport or fully WITHIN the viewport.
  const exceedingLimit = (end + endTolerance) - (start + startTolerance) > limit;
  return exceedingLimit 
    ? start <= startTolerance && (end - endTolerance) >= limit
    : (start + startTolerance) >= 0 && (end - endTolerance) <= limit;
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

  return isAxisInViewport(top, topTolerance, bottom, bottomTolerance, height) &&
      isAxisInViewport(left, leftTolerance, right, rightTolerance, width);
}
