import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | my component', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders with viewportTolerance partially set', async function(assert) {
    // viewportTolerance && viewportEnabled is usually setup in the initializer. Needs defaults
    this.viewportToleranceOverride = {
      top: 1
    };
    await render(hbs`
      {{#my-component viewportEnabled=true viewportToleranceOverride=viewportToleranceOverride}}
        template block text
      {{/my-component}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('it renders with intersectionThreshold set', async function(assert) {
    this.viewportTolerance = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
    this.intersectionThreshold = 1.0;
    await render(hbs`
      {{#my-component viewportEnabled=true viewportTolerance=viewportTolerance intersectionThreshold=intersectionThreshold}}
        template block text
      {{/my-component}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
