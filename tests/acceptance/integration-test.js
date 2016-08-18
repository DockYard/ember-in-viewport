import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | integration');

test('Component is active when in viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    assert.ok(find('.fooBar.active').length);
  });
});

test('Component is inactive when not in viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    assert.ok(find('.my-component.inactive').length);
  });
});

test('Component is active when scrolled into viewport', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(() => {
    find(window).scrollTop(2000);
  });

  waitFor('.my-component.active');

  andThen(() => {
    assert.ok(find('.my-component.active').length);
  });
});
