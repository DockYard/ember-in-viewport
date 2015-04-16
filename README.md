# ember-in-viewport
*Detect if an Ember View or Component is in the viewport @ 60FPS*

[![npm version](https://badge.fury.io/js/ember-in-viewport.svg)](http://badge.fury.io/js/ember-in-viewport) [![Build Status](https://travis-ci.org/dockyard/ember-in-viewport.svg)](https://travis-ci.org/dockyard/ember-in-viewport)

This `ember-cli` addon adds a simple, highly performant Ember Mixin to your app. This mixin, when added to a `View` or `Component` (collectively referred to as `Components`), will allow you to check if that `Component` has entered the browser's viewport. By default, the Mixin uses the `requestAnimationFrame` API if it detects it in your user's browser – failing which, it fallsback to using the more resource heavy Ember run loop and event listeners. 

This software will not be ready for production use until `1.0.0`. 

## Demo
- App: http://development.ember-in-viewport-demo.divshot.io/
- Source: https://github.com/poteto/ember-in-viewport-demo

## Usage
Usage is simple. First, add the mixin to your `Component`:

```js
import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

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
The mixin comes with some options. Due to the way listeners and `requestAnimationFrame` is setup, you'll have to override the options this way:

```js
export default Ember.Component.extend(InViewportMixin, {
  viewportOptionsOverride: Ember.on('didInsertElement', function() {
    Ember.setProperties(this, {
      viewportUseRAF      : true,
      viewportSpy         : false,
      viewportRefreshRate : 150,
      viewportTolerance: {
        top    : 50,
        bottom : 50,
        left   : 20,
        right  : 20
      }
    });
  })
});
```

- `viewportSpy: boolean`

  Default: `false`

  When `true`, the mixin will continually watch the `Component` and re-fire hooks whenever it enters or leaves the viewport. Because this is expensive, this behaviour is opt-in. When false, the mixin will only watch the `Component` until it enters the viewport once, and then it sets `viewportEntered` to `true` (permanently), and unbinds listeners. This reduces the load on the Ember run loop and your application. 

- `viewportRefreshRate: number`

  Default: `100`

  If `requestAnimationFrame` is not present, this value determines how often the mixin checks your component to determine whether or not it has entered or left the viewport. The lower this number, the more often it checks, and the more load is placed on your application. Generally, you'll want this value between `100` to `300`, which is about the range at which people consider things to be "real-time".

- `viewportTolerance: object`

  Default: `{ top: 0, left: 0, bottom: 0, right: 0 }`

  This option determines how accurately the `Component` needs to be within the viewport for it to be considered as entered. 

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
