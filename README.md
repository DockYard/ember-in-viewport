# ember-in-viewport
*Detect if an Ember View or Component is in the viewport*

[![Build Status](https://travis-ci.org/dockyard/ember-in-viewport.svg)](https://travis-ci.org/dockyard/ember-in-viewport)

This `ember-cli` addon adds a simple Ember Mixin to your app. This mixin, when added to a `View` or `Component` (collectively referred to as Components), will allow you to check if that Component has entered the browser's viewport.

## Usage
Usage is simple. First, add the mixin to your Component:

```js
import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';

export default Ember.Component.extend(InViewportMixin, {
  
});
```

### Basic
Then, to apply an `.active` class to your Component when it enters the viewport, you can simply bind the `active` class to the mixed in property `viewportEntered`, like so:

```js
export default Ember.Component.extend(InViewportMixin, {
  classNameBindings: [ 'viewportEntered:active' ]
});
```

### Advanced usage (options)
...

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
