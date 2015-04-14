export default function isInViewport(boundingClientRect={}, height=0, width=0, tolerance={}) {
  const { top, left, bottom, right } = boundingClientRect;
  let {
    top    : topTolerance,
    left   : leftTolerance,
    bottom : bottomTolerance,
    right  : rightTolerance
  } = tolerance;

  topTolerance    = topTolerance    ? topTolerance    : 0;
  leftTolerance   = leftTolerance   ? leftTolerance   : 0;
  bottomTolerance = bottomTolerance ? bottomTolerance : 0;
  rightTolerance  = rightTolerance  ? rightTolerance  : 0;

  return (
    (top - topTolerance)       >= 0 &&
    (left - leftTolerance)     >= 0 &&
    (bottom - bottomTolerance) <= height &&
    (right - rightTolerance)   <= width
  );
}
