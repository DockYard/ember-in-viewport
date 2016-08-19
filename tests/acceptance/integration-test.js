import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | integration');

test('Component is active when in viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    assert.ok(find('.my-component.top.active').length);
  });
});

test('Component is inactive when not in viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    assert.ok(find('.my-component.bottom.inactive').length);
  });
});

test('Component moves to active when scrolled into viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    find(window).scrollTop(2000);
  });

  waitFor('.my-component.bottom.active');

  andThen(() => {
    assert.ok(find('.my-component.bottom.active').length);
  });
});

test('Component moves back to inactive when scrolled out of viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    find(window).scrollTop(2000);
  });

  waitFor('.my-component.top.inactive');

  andThen(() => {
    assert.ok(find('.my-component.top.inactive').length);
  });
});
