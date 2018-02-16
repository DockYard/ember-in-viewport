import isInViewport from 'ember-in-viewport/utils/is-in-viewport';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let fakeRectNotInViewport, fakeRectInViewport, fakeWindow, fakeNoTolerance, fakeTolerance;

module('Unit | Utility | is in viewport', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    fakeRectNotInViewport = {
      top: 450,
      left: 150,
      bottom: 550,
      right: 1130
    };

    fakeRectInViewport = {
      top: 300,
      left: 150,
      bottom: 400,
      right: 1130
    };

    fakeWindow = {
      innerHeight: 400,
      innerWidth: 1280
    };

    fakeNoTolerance = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    };

    fakeTolerance = {
      top: 200,
      bottom: 200
    };
  });

  test('returns true if dimensions are within viewport', function(assert) {
    const { innerHeight, innerWidth } = fakeWindow;
    const result = isInViewport(fakeRectInViewport, innerHeight, innerWidth, fakeNoTolerance);
    assert.ok(result);
  });

  test('returns false if dimensions not within viewport', function(assert) {
    const { innerHeight, innerWidth } = fakeWindow;
    const result = isInViewport(fakeRectNotInViewport, innerHeight, innerWidth, fakeNoTolerance);
    assert.ok(!result);
  });

  test('returns true if dimensions not within viewport but within tolerance', function(assert) {
    const { innerHeight, innerWidth } = fakeWindow;
    const result = isInViewport(fakeRectNotInViewport, innerHeight, innerWidth, fakeTolerance);
    assert.ok(result);
  });

  test('returns true if rect with subpixel height is within viewport', function(assert) {
    const innerHeight = 400;
    const innerWidth = 1280;
    const fakeRectWithSubpixelsInViewport = {
      top: 300,
      left: 150,
      bottom: 400.4,
      right: 1130
    };
    const result = isInViewport(fakeRectWithSubpixelsInViewport, innerHeight, innerWidth, fakeNoTolerance);
    assert.ok(result);
  });

  test('returns true if rect with subpixel width is within viewport', function(assert) {
    const innerHeight = 400;
    const innerWidth = 1280;
    const fakeRectWithSubpixelsInViewport = {
      top: 300,
      left: 150,
      bottom: 400,
      right: 1280.4
    };
    const result = isInViewport(fakeRectWithSubpixelsInViewport, innerHeight, innerWidth, fakeNoTolerance);
    assert.ok(result);
  });

  test('returns false if rect with subpixel height is not within viewport', function(assert) {
    const innerHeight = 400;
    const innerWidth = 1280;
    const fakeRectWithSubpixelsInViewport = {
      top: 300,
      left: 150,
      bottom: 400.8,
      right: 1130
    };
    const result = isInViewport(fakeRectWithSubpixelsInViewport, innerHeight, innerWidth, fakeNoTolerance);
    assert.notOk(result);
  });

  test('returns false if rect with subpixel width is not within viewport', function(assert) {
    const innerHeight = 400;
    const innerWidth = 1280;
    const fakeRectWithSubpixelsInViewport = {
      top: 300,
      left: 150,
      bottom: 400,
      right: 1280.7
    };
    const result = isInViewport(fakeRectWithSubpixelsInViewport, innerHeight, innerWidth, fakeNoTolerance);
    assert.notOk(result);
  });
});
