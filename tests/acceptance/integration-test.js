import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { find, visit, waitFor } from '@ember/test-helpers';

module('Acceptance | Intersection Observer', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // bring testem window up to the top.
    document.getElementById('ember-testing-container').scrollTop = 0;
  });

  test('Component is active when in viewport', async function (assert) {
    assert.expect(1);

    await visit('/');

    await waitFor('.my-component.top.start-enabled.active');
    assert.ok(
      find('.my-component.top.start-enabled.active'),
      'component is active'
    );
  });

  test('Component is inactive when not in viewport', async function (assert) {
    assert.expect(1);

    await visit('/');

    assert.ok(find('.my-component.bottom.inactive'), 'component is inactive');
  });

  test('Component moves to active when scrolled into viewport', async function (assert) {
    assert.expect(2);

    await visit('/');

    assert.ok(find('.my-component.bottom.inactive'), 'component is inactive');
    document.querySelector('.my-component.bottom').scrollIntoView();

    // this test fails sometimes if not using waitFor
    await waitFor('.my-component.bottom.active', { timeout: 100 });
    assert.ok(find('.my-component.bottom.active'), 'component is active');
  });

  test('Component moves back to inactive when scrolled out of viewport', async function (assert) {
    assert.expect(1);

    await visit('/');

    document.querySelector('.my-component.bottom').scrollIntoView(false);

    // this test fails sometimes if not using waitFor
    await waitFor('.my-component.top.start-enabled.inactive', { timeout: 100 });
    assert.ok(
      find('.my-component.top.start-enabled.inactive'),
      'component is inactive'
    );
  });
});
