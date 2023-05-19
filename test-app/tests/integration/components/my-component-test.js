import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | my component', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with viewportTolerance partially set', async function (assert) {
    // viewportTolerance is usually setup in the initializer. Needs defaults
    this.viewportToleranceOverride = {
      top: 1,
    };
    await render(hbs`
      <MyComponent @viewportToleranceOverride={{this.viewportToleranceOverride}}>
        template block text
      </MyComponent>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('it renders with intersectionThreshold set', async function (assert) {
    this.viewportTolerance = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
    this.intersectionThreshold = 1.0;

    await render(hbs`
      <MyComponent @viewportToleranceOverride={{this.viewportToleranceOverride}} @intersectionThreshold={{this.intersectionThreshold}}>
        template block text
      </MyComponent>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
