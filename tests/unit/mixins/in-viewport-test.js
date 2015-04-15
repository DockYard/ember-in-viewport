import Ember from 'ember';
import InViewportMixin from '../../../mixins/in-viewport';
import { module, test } from 'qunit';

module('InViewportMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var InViewportObject = Ember.Object.extend(InViewportMixin);
  var subject = InViewportObject.create();
  assert.ok(subject);
});
