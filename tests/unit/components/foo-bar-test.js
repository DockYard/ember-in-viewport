import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';

const {
  run
} = Ember;

moduleForComponent('foo-bar', 'Unit | Component | foo bar', {});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  const component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

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
