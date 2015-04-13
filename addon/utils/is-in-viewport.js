export default function isInViewport(boundingClientRect={}, height=0, width=0, tolerance=0) {
  const { top, left, bottom, right } = boundingClientRect;

  return (
    top                  >= 0 &&
    left                 >= 0 &&
    (bottom - tolerance) <= height &&
    (right - tolerance)  <= width
  );
}
