# ember-in-viewport
*Detect if an Ember View or Component is in the viewport @ 60FPS*

**[ember-in-viewport is built and maintained by DockYard, contact us for expert Ember.js consulting](https://dockyard.com/ember-consulting)**.

[Read the blogpost](https://medium.com/delightful-ui-for-ember-apps/creating-an-ember-cli-addon-detecting-ember-js-components-entering-or-leaving-the-viewport-7d95ceb4f5ed)

![Download count all time](https://img.shields.io/npm/dt/ember-in-viewport.svg) [![npm version](https://badge.fury.io/js/ember-in-viewport.svg)](http://badge.fury.io/js/ember-in-viewport) [![Build Status](https://travis-ci.org/DockYard/ember-in-viewport.svg)](https://travis-ci.org/DockYard/ember-in-viewport) [![Ember Observer Score](http://emberobserver.com/badges/ember-in-viewport.svg)](http://emberobserver.com/addons/ember-in-viewport)

This `ember-cli` addon adds a simple, highly performant Ember Mixin to your app. This Mixin, when added to a `View` or `Component` (collectively referred to as `Components`), will allow you to check if that `Component` has entered the browser's viewport. By default, the Mixin uses the `IntersectionObserver` API if it detects it in your user's browser – failing which, it fallsback to using `requestAnimationFrame`, then if not available, the Ember run loop and event listeners.

## Demo
- App: http://development.ember-in-viewport-demo.divshot.io/
- Source: https://github.com/poteto/ember-in-viewport-demo

# Installation

```
ember install ember-in-viewport
```

## Usage
Usage is simple. First, add the Mixin to your `Component`:

```js
import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

export default Ember.Component.extend(InViewportMixin, {
  // ...
});
```

### Basic usage
#### Available hooks
##### `didEnterViewport`, `didExitViewport`
These hooks fire once whenever the `Component` enters or exits the viewport. You can handle them the same way you would handle any other native Ember hook:

```js
export default Ember.Component.extend(InViewportMixin, {
  didEnterViewport() {
    console.log('entered');
  },

  didExitViewport() {
    console.log('exited');
  }
});
```

##### `didScroll(up,down,left,right)`
The `didScroll` hook fires when an element enters the viewport. For example, if you scrolled down in order to move the element in the viewport, the `didScroll` hook would fire and also receive the direction as a string. You can then handle it like another hook as in the above example.

```js
export default Ember.Component.extend(InViewportMixin, {
  didScroll(direction) {
    console.log(direction); // 'up' || 'down' || 'left' || 'right'
  }
});
```

##### `viewportEntered`
To apply an `.active` class to your `Component` when it enters the viewport, you can simply bind the `active` class to the mixed in property `viewportEntered`, like so:

```js
export default Ember.Component.extend(InViewportMixin, {
  classNameBindings: [ 'viewportEntered:active' ]
});
```

##### `viewportExited`
This hook fires whenever the `Component` leaves the viewport.

### Advanced usage (options)
The mixin comes with some options. Due to the way listeners and `IntersectionObserver API` or `requestAnimationFrame` is setup, you'll have to override the options this way:

```js
export default Ember.Component.extend(InViewportMixin, {
  init() {
    this._super(...arguments);

    Ember.setProperties(this, {
      viewportEnabled                 : true,
      viewportUseRAF                  : true,
      viewportSpy                     : false,
      viewportUseIntersectionObserver : true,
      viewportScrollSensitivity       : 1,
      viewportRefreshRate             : 150,
      intersectionThreshold           : 1.0,
      scrollableArea                  : null,
      viewportTolerance: {
        top    : 50,
        bottom : 50,
        left   : 20,
        right  : 20
      }
    });
  }
});
```

- `viewportEnabled: boolean`

  Default: `true`

  Set to false to have no listeners registered. Useful if you have components that function with either viewport listening on or off.

- `viewportUseIntersectionObserver: boolean`

  Default: Depends on browser

  The Mixin by default will use the IntersectionObserver API. If IntersectionObserver is not supported in the target browser, ember-in-viewport will fallback to rAF.

  (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  (https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds#Browser_compatibility)

- `intersectionThreshold: decimal`

  Default: 1.0

  A single number or array of numbers between 0.0 and 1.0.  A value of 0.0 means the target will be visible when the first pixel enters the viewport.  A value of 1.0 means the entire target must be visible to fire the didEnterViewport hook.
  (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Thresholds)

- `scrollableArea`

  Default: null

  A CSS selector for the scrollable area.  e.g. `".my-list"`

- `viewportUseRAF: boolean`

  Default: Depends on browser

  As its name suggests, if this is `true` and the IntersectionObserver API is not available in the target browser, the Mixin will use `requestAnimationFrame`. Unless you want to force enabling or disabling this, you won't need to override this option.

- `viewportSpy: boolean`

  Default: `false`

  When `true`, the Mixin will continually watch the `Component` and re-fire hooks whenever it enters or leaves the viewport. Because this is expensive, this behaviour is opt-in. When false, the Mixin will only watch the `Component` until it enters the viewport once, and then it sets `viewportEntered` to `true` (permanently), and unbinds listeners. This reduces the load on the Ember run loop and your application.

- `viewportScrollSensitivity: number`

  Default: `1`

  This value determines the degree of sensitivity (in `px`) in which a DOM element is considered to have scrolled into the viewport. For example, if you set `viewportScrollSensitivity` to `10`, the `didScroll{...}` hooks would only fire if the scroll was greater than `10px`.

- `viewportRefreshRate: number`

  Default: `100`

  If `IntersectionObserver` and `requestAnimationFrame` is not present, this value determines how often the Mixin checks your component to determine whether or not it has entered or left the viewport. The lower this number, the more often it checks, and the more load is placed on your application. Generally, you'll want this value between `100` to `300`, which is about the range at which people consider things to be "real-time".

  This value also affects how often the Mixin checks scroll direction.

- `viewportTolerance: object`

  Default: `{ top: 0, left: 0, bottom: 0, right: 0 }`

  This option determines how accurately the `Component` needs to be within the viewport for it to be considered as entered.

### Global options

You can set application wide defaults for `ember-in-viewport` in your app (they are still manually overridable inside of a Component). To set new defaults, just add a config object to `config/environment.js`, like so:

```js
module.exports = function(environment) {
  var ENV = {
    // ...
    viewportConfig: {
      viewportEnabled                 : false,
      viewportUseRAF                  : true,
      viewportSpy                     : false,
      viewportUseIntersectionObserver : true,
      viewportScrollSensitivity       : 1,
      viewportRefreshRate             : 100,
      viewportListeners               : [],
      intersectionThreshold           : 1.0,
      scrollableArea                  : null,
      viewportTolerance: {
        top    : 0,
        left   : 0,
        bottom : 0,
        right  : 0
      }
    }
  };
};
```

## Installation

* `git clone` this repository
* `npm install`

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Legal

[DockYard](http://dockyard.com/ember-consulting), Inc &copy; 2015

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
