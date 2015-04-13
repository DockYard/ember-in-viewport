import isInViewport from '../../../utils/is-in-viewport';
import { module, test } from 'qunit';

let fakeRectNotInViewport, fakeRectInViewport, fakeWindow;

module('isInViewport', {
  beforeEach() {
    fakeRectNotInViewport = {
      top    : 450,
      left   : 150,
      bottom : 550,
      right  : 1130
    };

    fakeRectInViewport = {
      top    : 301,
      left   : 150,
      bottom : 400,
      right  : 1130
    };

    fakeWindow = {
      innerHeight : 400,
      innerWidth  : 1280
    };
  }
});

// Replace this with your real tests.
test('returns true if dimensions are within viewport', function(assert) {
  const { innerHeight, innerWidth } = fakeWindow;
  const result = isInViewport(fakeRectInViewport, innerHeight, innerWidth, 0);
  assert.ok(result);
});

test('returns false if dimensions not within viewport', function(assert) {
  const { innerHeight, innerWidth } = fakeWindow;
  const result = isInViewport(fakeRectNotInViewport, innerHeight, innerWidth, 0);
  assert.ok(!result);
});

test('returns true if dimensions not within viewport but within tolerance', function(assert) {
  const { innerHeight, innerWidth } = fakeWindow;
  const result = isInViewport(fakeRectNotInViewport, innerHeight, innerWidth, 200);
  assert.ok(result);
});
