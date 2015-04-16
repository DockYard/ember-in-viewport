# ember-in-viewport
*Detect if an Ember View or Component is in the viewport @ 60FPS*

[![npm version](https://badge.fury.io/js/ember-in-viewport.svg)](http://badge.fury.io/js/ember-in-viewport) [![Build Status](https://travis-ci.org/dockyard/ember-in-viewport.svg)](https://travis-ci.org/dockyard/ember-in-viewport)

This `ember-cli` addon adds a simple, highly performant Ember Mixin to your app. This mixin, when added to a `View` or `Component` (collectively referred to as `Components`), will allow you to check if that `Component` has entered the browser's viewport. By default, the Mixin uses the `requestAnimationFrame` API if it detects it in your user's browser – failing which, it fallsback to using the more resource heavy Ember run loop and event listeners. 

This software will not be ready for production use until `1.0.0`. 

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
The mixin comes with some options:

- `viewportSpy: boolean` (Only works when not in `rAF` mode: See [issues](#issues))

  Default: `false`

  When `true`, the mixin will continually watch the `Component` and re-fire hooks whenever it enters or leaves the viewport. Because this is expensive, this behaviour is opt-in. When false, the mixin will only watch the `Component` until it enters the viewport once, and then it sets `viewportEntered` to `true` (permanently), and unbinds listeners. This reduces the load on the Ember run loop and your application. 

- `viewportRefreshRate: number`

  Default: `100`

  If `requestAnimationFrame` is not present, this value determines how often the mixin checks your component to determine whether or not it has entered or left the viewport. The lower this number, the more often it checks, and the more load is placed on your application. Generally, you'll want this value between `100` to `300`, which is about the range at which people consider things to be "real-time".

- `viewportTolerance: object`

  Default: `{ top: 0, left: 0, bottom: 0, right: 0 }`

  This option determines how accurately the `Component` needs to be within the viewport for it to be considered as entered. 

## Issues
The main issue at the moment is with unbinding listeners and clearing the `requestAnimationFrame` recursive cycle. This is preventing work on the `viewportSpy` option, which clears all listeners after a `Component` has entered the viewport at least once. 

- [ ] `_unbindListeners()` should clear the instance of the `requestAnimationFrame` recursion (per Object), but still remain performant
  - Currently, this method does not clear the `requestAnimationFrame` recursion when it is called. `cancelAnimationFrame` requires the `id` returned by the `requestAnimationFrame` method, but storing it in the Ember.Object causes severe memory issues (as it is being updated at 60FPS, or about every 16ms)
- [x] `_unbindListeners()` should clear the instance of the event listeners per element
  - This method clears all event listeners on the `window` and `document` (in reality, this mixin has only 3 listeners regardless of the number of `Components`, because of the way Ember registers event listeners globally), which means if you have >1 `Component` to watch, after one enters the viewport, it unbinds listeners for all other `Components`, whether or not they have entered the viewport.

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
