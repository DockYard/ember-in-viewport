import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  pauseTest,
  find,
  findAll,
  visit,
  settled,
  waitFor,
  waitUntil,
} from '@ember/test-helpers';

module('Acceptance | infinity-scrollable', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // bring testem window and the browser up to the top.
    document.getElementById('ember-testing-container').scrollTop = 0;
  });

  test('IntersectionObserver Component fetches more data when scrolled into viewport', async function (assert) {
    await visit('/infinity-scrollable');

    assert.equal(findAll('.infinity-svg').length, 10);
    assert.equal(
      findAll('.infinity-scrollable.inactive').length,
      1,
      'component is inactive before fetching more data'
    );
    document.querySelector('.infinity-scrollable').scrollIntoView(false);

    await waitFor('.infinity-scrollable.inactive');
    await waitUntil(() => {
      return findAll('.infinity-svg').length === 20;
    });

    assert.equal(findAll('.infinity-svg').length, 20);
  });

  test('works with in-viewport modifier', async function (assert) {
    await visit('/infinity-built-in-modifiers');

    assert.equal(findAll('.infinity-item').length, 10, 'has items to start');

    document.querySelector('.infinity-item-9').scrollIntoView(false);

    await waitUntil(
      () => {
        return findAll('.infinity-item').length === 20;
      },
      { timeoutMessage: 'did not find all items in time' }
    );

    await settled();

    assert.equal(
      findAll('.infinity-item').length,
      20,
      'after infinity has more items'
    );
    assert.equal(
      find('h1').textContent.trim(),
      '{{in-viewport}} modifier',
      'has title'
    );

    document.querySelector('.infinity-item-19').scrollIntoView(false);

    await waitUntil(
      () => {
        return findAll('.infinity-item').length === 30;
      },
      { timeoutMessage: 'did not find all items in time' }
    );

    await settled();

    assert.equal(
      findAll('.infinity-item').length,
      30,
      'after infinity has more items'
    );
    assert.equal(
      find('h1').textContent.trim(),
      '{{in-viewport}} modifier',
      'has title'
    );
  });

  test('works with in-viewport modifier (rAF)', async function (assert) {
    let inViewportService = this.owner.lookup('service:in-viewport');

    inViewportService.set('viewportUseIntersectionObserver', false);

    await visit('/infinity-built-in-modifiers');

    assert.equal(findAll('.infinity-item').length, 10, 'has items to start');

    document.querySelector('.infinity-item-9').scrollIntoView(false);

    await waitUntil(
      () => {
        return findAll('.infinity-item').length === 20;
      },
      { timeoutMessage: 'did not find all items in time' }
    );

    await settled();

    assert.equal(
      findAll('.infinity-item').length,
      20,
      'after infinity has more items'
    );
  });

  test('ember-in-viewport works with classes', async function (assert) {
    await visit('/infinity-class');

    assert.equal(findAll('.infinity-class-item').length, 20);
    document.querySelector('#loader').scrollIntoView(false);

    await waitUntil(() => {
      return findAll('.infinity-class-item').length === 40;
    });

    assert.equal(findAll('.infinity-class-item').length, 40);
  });

  test('IntersectionObserver Component fetches more data when left to right scrolling', async function (assert) {
    await visit('/infinity-right-left');

    assert.equal(findAll('.infinity-svg').length, 10);
    assert.equal(
      findAll('.infinity-scrollable.inactive').length,
      1,
      'component is inactive before fetching more data'
    );
    document.querySelector('.infinity-scrollable').scrollIntoView(false);

    await waitFor('.infinity-scrollable.inactive');

    // assert.equal(findAll('.infinity-svg').length, 20);
  });

  test('rAF Component fetches more data when scrolled into viewport', async function (assert) {
    await visit('/infinity-scrollable-raf');

    assert.equal(findAll('.infinity-svg-rAF').length, 10);
    assert.equal(
      findAll('.infinity-scrollable-rAF.inactive').length,
      1,
      'component is inactive before fetching more data'
    );
    document.querySelector('.infinity-scrollable-rAF').scrollIntoView(false);

    await waitUntil(() => {
      return findAll('.infinity-svg-rAF').length === 20;
    });
    await waitFor('.infinity-scrollable-rAF.inactive');

    assert.equal(findAll('.infinity-svg-rAF').length, 20);
    assert.equal(
      findAll('.infinity-scrollable-rAF.inactive').length,
      1,
      'component is inactive after fetching more data'
    );
  });

  test('rAF (second) component does not fetch after first call (viewportSpy is false)', async function (assert) {
    await visit('/infinity-scrollable-raf');

    assert.equal(findAll('.infinity-svg-rAF-bottom').length, 10);
    assert.equal(
      findAll('.infinity-scrollable-rAF-bottom.inactive').length,
      1,
      'component is inactive before fetching more data'
    );
    document
      .querySelector('.infinity-scrollable-rAF-bottom')
      .scrollIntoView(false);

    await waitUntil(() => {
      return findAll('.infinity-svg-rAF-bottom').length === 20;
    });
    await waitFor('.infinity-scrollable-rAF-bottom.inactive');

    document
      .querySelector('.infinity-scrollable-rAF-bottom')
      .scrollIntoView(false);

    await waitUntil(() => {
      // one tick is enough to check
      return findAll('.infinity-svg-rAF-bottom').length === 20;
    });
    await waitFor('.infinity-scrollable-rAF-bottom.inactive');
  });

  test('scrollEvent Component fetches more data when scrolled into viewport', async function (assert) {
    await visit('/infinity-scrollable-scrollevent');

    assert.equal(findAll('.infinity-svg-scrollEvent').length, 10);
    assert.equal(
      findAll('.infinity-scrollable-scrollEvent.inactive').length,
      1,
      'component is inactive before fetching more data'
    );
    await document
      .querySelector('.infinity-scrollable-scrollEvent')
      .scrollIntoView(false);

    await waitUntil(() => {
      return findAll('.infinity-svg-scrollEvent').length === 20;
    });

    assert.equal(findAll('.infinity-svg-scrollEvent').length, 20);
    assert.ok(
      find('.infinity-scrollable-scrollEvent.active'),
      'component is still active after fetching more data'
    );
    // scroll 1px to trigger inactive state
    let elem = document.getElementsByClassName('list-scrollEvent')[0];
    elem.scrollTop = elem.scrollTop + 5;

    await waitUntil(() => {
      return find('.infinity-scrollable-scrollEvent.inactive');
    });

    assert.ok(
      find('.infinity-scrollable-scrollEvent.inactive'),
      'component is inactive after scrolling'
    );
  });

  test('works with custom elements', async function (assert) {
    await visit('/infinity-custom-element');

    assert.equal(findAll('.infinity-item').length, 10, 'has items to start');

    document.querySelector('custom-sentinel').scrollIntoView(false);

    await waitUntil(
      () => {
        return findAll('.infinity-item').length === 20;
      },
      { timeoutMessage: 'did not find all items in time' }
    );

    await settled();

    // assert.equal(findAll('.infinity-item').length, 20, 'after infinity has more items');
  });
});
