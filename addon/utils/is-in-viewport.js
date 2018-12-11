import { assign } from '@ember/polyfills';

const defaultTolerance = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};

export default function isInViewport(boundingClientRect = {}, height = 0, width = 0, tolerance = defaultTolerance) {
  const { top, left, bottom, right, height: h, width: w } = boundingClientRect;
  const tolerances = assign(assign({}, defaultTolerance), tolerance);
  const {
    top: topTolerance,
    left: leftTolerance,
    bottom: bottomTolerance,
    right: rightTolerance
  } = tolerances;

  return (
    (top + topTolerance)       >= 0 &&
    (left + leftTolerance)     >= 0 &&
    (Math.round(bottom) - bottomTolerance - h) <= Math.round(height) &&
    (Math.round(right) - rightTolerance - w)   <= Math.round(width)
  );
}
