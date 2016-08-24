import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

const {
  run
} = Ember;

moduleForComponent('foo-bar', 'Unit | Component | foo bar', {});

test('it works normal', function(assert) {
  assert.expect(1);

  const component = this.subject();

  let count = 0;
  component._setInitialViewport = function() {
    count += 1;
  };

  // appends the component to the page
  this.render();

  assert.equal(count, 1);
});

test('it bails if noSetup = true', function(assert) {
  assert.expect(1);

  const component = this.subject();

  run(this, function() {
    component.set('noSetup', true);
  });

  let count = 0;
  component._setInitialViewport = function() {
    count += 1;
  };

  // appends the component to the page
  this.render();

  assert.equal(count, 0);
});
