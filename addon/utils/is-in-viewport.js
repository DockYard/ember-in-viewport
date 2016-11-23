import Ember from 'ember';

const { assert, merge } = Ember;
const assign = Ember.assign || Ember.merge;

const defaultTolerance = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};
const defaultWithinLimitCalc = function(start, startTolerance, end, endTolerance, limit) {
  const exceedingLimit = (end + endTolerance) - (start + startTolerance) > limit;
  assert('Dimensions cannot exceed limit for within-limit calculation', !exceedingLimit);
  return (start + startTolerance) >= 0 && (end - endTolerance) <= limit;
};
const defaultBeyondLimitCalc = function(start, startTolerance, end, endTolerance, limit) {
  const exceedingLimit = (end + endTolerance) - (start + startTolerance) > limit;
  assert('Dimensions must exceed limit for beyond-limit calculation', exceedingLimit);
  return start <= startTolerance && (end - endTolerance) >= limit;
};

const isAxisInViewport = function(start, startTolerance, end, endTolerance, limit, withinLimitCalc = defaultWithinLimitCalc, beyondLimitCalc = defaultBeyondLimitCalc) {
  // Dimensions are fully LARGER than the viewport or fully WITHIN the viewport.
  let exceedingLimit = (end + endTolerance) - (start + startTolerance) > limit;
  return exceedingLimit ? beyondLimitCalc(start, startTolerance, end, endTolerance, limit) : withinLimitCalc(start, startTolerance, end, endTolerance, limit);
};

export default function isInViewport(boundingClientRect = {}, height = 0, width = 0, tolerance = defaultTolerance, withinLimitCalc = defaultWithinLimitCalc, beyondLimitCalc = defaultBeyondLimitCalc) {
  const { top, left, bottom, right } = boundingClientRect;
  const tolerances = assign(defaultTolerance, tolerance);
  const {
    top: topTolerance,
    left: leftTolerance,
    bottom: bottomTolerance,
    right: rightTolerance
  } = tolerances;

  return isAxisInViewport(top, topTolerance, bottom, bottomTolerance, height, withinLimitCalc, beyondLimitCalc) &&
      isAxisInViewport(left, leftTolerance, right, rightTolerance, width, withinLimitCalc, beyondLimitCalc);
}
