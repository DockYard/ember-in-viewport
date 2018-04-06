import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { find, findAll, visit, waitFor, waitUntil } from '@ember/test-helpers';

module('Acceptance | infinity-scrollable', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // bring testem window and the browser up to the top.
    document.getElementById('ember-testing-container').scrollTop = 0;
  });

  test('IntersectionObserver Component fetches more data when scrolled into viewport', async function(assert) {
    await visit('/infinity-scrollable');

    assert.equal(findAll('.infinity-svg').length, 10);
    assert.equal(findAll('.infinity-scrollable.inactive').length, 1, 'component is inactive before fetching more data');
    document.querySelector('.infinity-scrollable').scrollIntoView(false);

    await waitFor('.infinity-scrollable.inactive');

    assert.equal(findAll('.infinity-svg').length, 20);
  });

  test('rAF Component fetches more data when scrolled into viewport', async function(assert) {
    await visit('/infinity-scrollable-raf');

    assert.equal(findAll('.infinity-svg-rAF').length, 10);
    assert.equal(findAll('.infinity-scrollable-rAF.inactive').length, 1, 'component is inactive before fetching more data');
    document.querySelector('.infinity-scrollable-rAF').scrollIntoView(false);

    await waitUntil(() => {
      return findAll('.infinity-svg-rAF').length === 20;
    });
    await waitFor('.infinity-scrollable-rAF.inactive');

    assert.equal(findAll('.infinity-svg-rAF').length, 20);
    assert.equal(findAll('.infinity-scrollable-rAF.inactive').length, 1, 'component is inactive after fetching more data');
  });

  test('rAF (second) component fetches more data when scrolled into viewport', async function(assert) {
    await visit('/infinity-scrollable-raf');

    assert.equal(findAll('.infinity-svg-rAF-bottom').length, 10);
    assert.equal(findAll('.infinity-scrollable-rAF-bottom.inactive').length, 1, 'component is inactive before fetching more data');
    document.querySelector('.infinity-scrollable-rAF-bottom').scrollIntoView(false);

    await waitUntil(() => {
      return findAll('.infinity-svg-rAF-bottom').length === 20;
    });
    await waitFor('.infinity-scrollable-rAF-bottom.inactive');

    assert.equal(findAll('.infinity-svg-rAF-bottom').length, 20);
    assert.equal(findAll('.infinity-scrollable-rAF-bottom.inactive').length, 1, 'component is inactive after fetching more data');
  });

  test('scrollEvent Component fetches more data when scrolled into viewport', async function(assert) {
    await visit('/infinity-scrollable-scrollevent');

    assert.equal(findAll('.infinity-svg-scrollEvent').length, 10);
    assert.equal(findAll('.infinity-scrollable-scrollEvent.inactive').length, 1, 'component is inactive before fetching more data');
    await document.querySelector('.infinity-scrollable-scrollEvent').scrollIntoView(false);

    await waitUntil(() => {
      return findAll('.infinity-svg-scrollEvent').length === 20;
    });

    assert.equal(findAll('.infinity-svg-scrollEvent').length, 20);
    assert.ok(find('.infinity-scrollable-scrollEvent.active'), 'component is still active after fetching more data');
    // scroll 1px to trigger inactive state
    let elem = document.getElementsByClassName('list-scrollEvent')[0];
    elem.scrollTop = elem.scrollTop + 5;

    await waitUntil(() => {
      return find('.infinity-scrollable-scrollEvent.inactive');
    });

    assert.ok(find('.infinity-scrollable-scrollEvent.inactive'), 'component is inactive after scrolling');
  });
});

