# ember-in-viewport
*Detect if an Ember View or Component is in the viewport*

[![Build Status](https://travis-ci.org/dockyard/ember-in-viewport.svg)](https://travis-ci.org/dockyard/ember-in-viewport)

This `ember-cli` addon adds a simple Ember Mixin to your app. This mixin, when added to a `View` or `Component` (collectively referred to as `Components`), will allow you to check if that `Component` has entered the browser's viewport.

## Usage
Usage is simple. First, add the mixin to your `Component`:

```js
import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport/mixins/in-viewport';

export default Ember.Component.extend(InViewportMixin, {
  // ...
});
```

### Basic usage
#### Available hooks
##### `viewportEntered`
This hook fires whenever the `Component` enters the viewport. To apply an `.active` class to your `Component` when it enters the viewport, you can simply bind the `active` class to the mixed in property `viewportEntered`, like so:

```js
export default Ember.Component.extend(InViewportMixin, {
  classNameBindings: [ 'viewportEntered:active' ]
});
```

##### `viewportExited`
This hook fires whenever the `Component` leaves the viewport.

### Advanced usage (options)
The mixin comes with some options:

- `viewportSpy: boolean`

  Default: `false`

  When `true`, the mixin will continually watch the `Component` and re-fire hooks whenever it enters or leaves the viewport. Because this is expensive, this behaviour is opt-in. When false, the mixin will only watch the `Component` until it enters the viewport once, and then it sets `viewportEntered` to `true` (permanently), and unbinds listeners. This reduces the load on the Ember run loop and your application. 

- `viewportRefreshRate: number`

  Default: `100`

  This value determines how often the mixin checks your component to determine whether or not it has entered or left the viewport. The lower this number, the more often it checks, and the more load is placed on your application. Generally, you'll want this value between `100` to `300`, which is about the range at which people consider things to be "real-time".

- `viewportTolerance: number`

  Default: `0`

  This value determines how accurately the `Component` needs to be within the viewport for it to be considered as entered. At `0`, this means that the `Component'`s element must be completely inside of the viewport to be considered as entered. For example, if this was set to `50`, the component would have entered the viewport if it's top or bottom was within `50px` from the window.

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
