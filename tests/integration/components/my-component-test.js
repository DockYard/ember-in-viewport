import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('my-component', 'Integration | Component | my component', {
  integration: true
});

test('it renders with viewportTolerance partially set', function(assert) {
  // viewportTolerance && viewportEnabled is usually setup in the initializer. Needs defaults
  this.viewportToleranceOverride = {
    top: 1
  };
  this.render(hbs`
    {{#my-component viewportEnabled=true viewportToleranceOverride=viewportToleranceOverride}}
      template block text
    {{/my-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('it renders with intersectionThreshold set', function(assert) {
  this.viewportTolerance = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  this.intersectionThreshold = 1.0;
  this.render(hbs`
    {{#my-component viewportEnabled=true viewportTolerance=viewportTolerance intersectionThreshold=intersectionThreshold}}
      template block text
    {{/my-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
