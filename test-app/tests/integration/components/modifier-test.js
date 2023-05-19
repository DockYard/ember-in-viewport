import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, scrollTo } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifiers | {{in-viewport}}', function (hooks) {
  setupRenderingTest(hooks);

  test('it invokes the given `onEnter` and `onExist` callbacks passing the element and the intersectionObserverEntry', async function (assert) {
    assert.expect(4);
    this.onEnter = function (el, intersectionObserverEntry) {
      assert.dom(el).hasText('Four');
      assert.ok(
        Math.abs(intersectionObserverEntry.intersectionRatio - 1) < 0.05,
        'It receives an intersectionObserverEntry'
      );
    };
    this.onExit = function (el, intersectionObserverEntry) {
      assert.dom(el).hasText('One');
      assert.ok(
        Math.abs(intersectionObserverEntry.intersectionRatio - 0.411) < 0.05,
        'It receives an intersectionObserverEntry'
      );
    };
    await render(hbs`
      <div style="height: 210px; max-height: 210px;border: 1px solid red;overflow-y: scroll" id="wrapper">
        <div
          style="min-height: 100px; border: 1px solid blue"
          {{in-viewport
            onExit=this.onExit
            intersectionThreshold=0.5
            viewportSpy=true}}
        >One</div>
        <div style="min-height: 100px; border: 1px solid blue">Two</div>
        <div style="min-height: 100px; border: 1px solid blue">Three</div>
        <div
          style="min-height: 100px; border: 1px solid blue"
          {{in-viewport
            onEnter=this.onEnter
            intersectionThreshold=0.5
            viewportSpy=true}}
        >Four</div>
      </div>
    `);
    await scrollTo('#wrapper', 0, 60);
    await new Promise((r) => setTimeout(r, 150));
    await scrollTo('#wrapper', 0, 260);
    await new Promise((r) => setTimeout(r, 150));
  });
});
