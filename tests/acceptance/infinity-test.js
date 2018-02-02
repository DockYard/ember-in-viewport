import { test } from 'qunit';
import { findAll } from 'ember-native-dom-helpers';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | infinity-scrollable', {
  beforeEach() {
    // bring testem window up to the top.
    document.getElementById('ember-testing-container').scrollTop = 0;
  }
});

test('IntersectionObserver Component fetches more data when scrolled into viewport', function(assert) {
  visit('/infinity-scrollable');

  andThen(() => {
    assert.equal(findAll('.infinity-svg').length, 10);
    assert.equal(findAll('.infinity-scrollable.inactive').length, 1, 'component is inactive before fetching more data');
    document.querySelector('.infinity-scrollable').scrollIntoView();
  });

  waitFor('.infinity-scrollable.inactive');

  andThen(() => {
    assert.equal(findAll('.infinity-svg').length, 20);
    assert.equal(findAll('.infinity-scrollable.inactive').length, 1, 'component is inactive after fetching more data');
  });
});

test('rAF Component fetches more data when scrolled into viewport', function(assert) {
  visit('/infinity-scrollable-raf');

  andThen(() => {
    assert.equal(findAll('.infinity-svg-rAF').length, 10);
    assert.equal(findAll('.infinity-scrollable-rAF.inactive').length, 1, 'component is inactive before fetching more data');
    document.querySelector('.infinity-scrollable-rAF').scrollIntoView();
  });

  waitFor('.infinity-scrollable-rAF.inactive');

  andThen(() => {
    assert.equal(findAll('.infinity-svg-rAF').length, 20);
    assert.equal(findAll('.infinity-scrollable-rAF.inactive').length, 1, 'component is inactive after fetching more data');
  });
});

test('scrollEvent Component fetches more data when scrolled into viewport', function(assert) {
  visit('/infinity-scrollable-scrollevent');

  andThen(() => {
    assert.equal(findAll('.infinity-svg-scrollEvent').length, 10);
    assert.equal(findAll('.infinity-scrollable-scrollEvent.inactive').length, 1, 'component is inactive before fetching more data');
    document.querySelector('.infinity-scrollable-scrollEvent').scrollIntoView();
  });

  waitFor(() => {
    return find('.infinity-svg-scrollEvent').length === 20;
  });

  andThen(() => {
    assert.equal(findAll('.infinity-svg-scrollEvent').length, 20);
    assert.equal(find('.infinity-scrollable-scrollEvent.active').length, 1, 'component is still active after fetching more data');
    // scroll 1px to trigger inactive state
    let elem = document.getElementsByClassName('list-scrollEvent')[0];
    elem.scrollTop = elem.scrollTop + 1;
  });
  andThen(() => {
    assert.equal(find('.infinity-scrollable-scrollEvent.inactive').length, 1, 'component is inactive after scrolling');
  });
});
