import { test } from 'qunit';
import { find } from 'ember-native-dom-helpers';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | integration', {
  beforeEach() {
    // bring testem window up to the top.
    document.getElementById('ember-testing-container').scrollTop = 0;
  }
});

test('Component is active when in viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    assert.ok(find('.my-component.top.start-enabled.active'), 'component is active');
  });
});

test('Component is inactive when not in viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    assert.ok(find('.my-component.bottom.inactive'), 'component is inactive');
  });
});

test('Component moves to active when scrolled into viewport', function(assert) {
  assert.expect(2);

  visit('/');

  andThen(() => {
    assert.ok(find('.my-component.bottom.inactive'), 'component is inactive');
    document.querySelector('.my-component.bottom').scrollIntoView();
  });

  waitFor('.my-component.bottom.active');

  andThen(() => {
    assert.ok(find('.my-component.bottom.active'), 'component is active');
  });
});

test('Component moves back to inactive when scrolled out of viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    document.querySelector('.my-component.bottom').scrollIntoView();
  });

  waitFor('.my-component.top.start-enabled.inactive');

  andThen(() => {
    assert.ok(find('.my-component.top.start-enabled.inactive'), 'component is inactive');
  });
});

test('Component can be disabled', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    assert.ok(find('.my-component.top.start-disabled.inactive'), 'component is inactive');
  });
});
