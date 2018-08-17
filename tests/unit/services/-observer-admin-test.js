import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';


module('Unit | Utility | -observer admin', function(hooks) {
  setupTest(hooks);

  test('can add element to static admin', function(assert) {
    let service = this.owner.lookup('service:-observer-admin');

    let cb = () => {};

    let thing1 = document.createElement('div');
    try {
      service.add(thing1, cb, cb, {});
      assert.ok(true);
    } catch(e) {
      assert.ok(false, `An error: ${e}`);
    }
  });
});
