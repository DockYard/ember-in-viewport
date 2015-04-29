import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';
import { module, test } from 'qunit';

module('InViewportMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  const InViewportObject = Ember.Object.extend(InViewportMixin);
  const subject = InViewportObject.create();
  assert.ok(subject);
});
