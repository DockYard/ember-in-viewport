import EmberObject from '@ember/object';
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';
import { module, test } from 'qunit';

module('Unit | Mixin | in viewport', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let InViewportObject = EmberObject.extend(InViewportMixin);
    let subject = InViewportObject.create();
    assert.ok(subject);
  });
});
