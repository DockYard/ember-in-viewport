import checkScrollDirection from 'ember-in-viewport/utils/check-scroll-direction';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let lastPosition;

module('Unit | Utility | check scroll direction', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    lastPosition = {
      top: 300,
      left: 150
    };
  });

  test('returns the right direction', function(assert) {
    const movements = [
      { direction: 'down',  position: { top: 400, left: 150 } },
      { direction: 'up',    position: { top: 200, left: 150 } },
      { direction: 'right', position: { top: 300, left: 250 } },
      { direction: 'left',  position: { top: 300, left: 100 } }
    ];

    assert.expect(movements.length);

    movements.forEach((movement) => {
      const { direction, position } = movement;
      const scrollDirection = checkScrollDirection(lastPosition, position);

      assert.equal(direction, scrollDirection);
    });
  });

  test('adjusts for sensitivity', function(assert) {
    const movements = [
      { direction: undefined, position: { top: 399, left: 150 } },
      { direction: 'down',    position: { top: 400, left: 150 } },
      { direction: 'down',    position: { top: 500, left: 250 } }
    ];

    assert.expect(movements.length);

    movements.forEach((movement) => {
      const { direction, position } = movement;
      const scrollDirection = checkScrollDirection(lastPosition, position, 100);

      assert.equal(direction, scrollDirection);
    });
  });
});
