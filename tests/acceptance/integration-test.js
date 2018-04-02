import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { find, visit, waitFor } from '@ember/test-helpers';

module('Acceptance | Intersection Observer', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // bring testem window up to the top.
    document.getElementById('ember-testing-container').scrollTop = 0;
  });

  test('Component is active when in viewport', async function(assert) {
    assert.expect(1);

    await visit('/');

    assert.ok(find('.my-component.top.start-enabled.active'), 'component is active');
  });

  test('Component is inactive when not in viewport', async function(assert) {
    assert.expect(1);

    await visit('/');

    assert.ok(find('.my-component.bottom.inactive'), 'component is inactive');
  });

  test('Component moves to active when scrolled into viewport', async function(assert) {
    assert.expect(2);

    await visit('/');

    assert.ok(find('.my-component.bottom.inactive'), 'component is inactive');
    document.querySelector('.my-component.bottom').scrollIntoView();

    await waitFor('.my-component.bottom.active');

    assert.ok(find('.my-component.bottom.active'), 'component is active');
  });

  test('Component moves back to inactive when scrolled out of viewport', async function(assert) {
    assert.expect(1);

    await visit('/');

    document.querySelector('.my-component.bottom').scrollIntoView(false);

    await waitFor('.my-component.top.start-enabled.inactive');

    assert.ok(find('.my-component.top.start-enabled.inactive'), 'component is inactive');
  });

  test('Component can be disabled', async function(assert) {
    assert.expect(1);

    await visit('/');

    assert.ok(find('.my-component.top.start-disabled.inactive'), 'component is inactive');
  });
});

