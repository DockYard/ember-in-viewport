# ember-in-viewport
*Detect if an Ember View or Component is in the viewport @ 60FPS*

[Read the blogpost](https://medium.com/delightful-ui-for-ember-apps/creating-an-ember-cli-addon-detecting-ember-js-components-entering-or-leaving-the-viewport-7d95ceb4f5ed)

[![npm version](https://badge.fury.io/js/ember-in-viewport.svg)](http://badge.fury.io/js/ember-in-viewport) [![Build Status](https://travis-ci.org/dockyard/ember-in-viewport.svg)](https://travis-ci.org/dockyard/ember-in-viewport)

This `ember-cli` addon adds a simple, highly performant Ember Mixin to your app. This Mixin, when added to a `View` or `Component` (collectively referred to as `Components`), will allow you to check if that `Component` has entered the browser's viewport. By default, the Mixin uses the `requestAnimationFrame` API if it detects it in your user's browser – failing which, it fallsback to using the Ember run loop and event listeners. 

## Demo
- App: http://development.ember-in-viewport-demo.divshot.io/
- Source: https://github.com/poteto/ember-in-viewport-demo

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

##### [BETA] `didScroll{Up,Down,Left,Right}`
The appropriate scroll hook fires when an element enters the viewport. For example, if you scrolled down in order to move the element in the viewport, the `didScrollDown` hook would fire. You can then handle it like another hook as in the above example.

```js
export default Ember.Component.extend(InViewportMixin, {
  didScrollUp() {
    console.log('up');
  },

  didScrollDown() {
    console.log('down');
  },

  didScrollLeft() {
    console.log('left');
  },

  didScrollRight() {
    console.log('right');
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
The mixin comes with some options. Due to the way listeners and `requestAnimationFrame` is setup, you'll have to override the options this way:

```js
export default Ember.Component.extend(InViewportMixin, {
  viewportOptionsOverride: Ember.on('didInsertElement', function() {
    Ember.setProperties(this, {
      viewportUseRAF            : true,
      viewportSpy               : false,
      viewportScrollSensitivity : 1,
      viewportRefreshRate       : 150,
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

- `viewportUseRAF: boolean`

  Default: Depends on browser

  As it's name suggests, if this is `true`, the Mixin will use `requestAnimationFrame` instead of the Ember run loop. Unless you want to force enabling or disabling this, you won't need to override this option.

- `viewportSpy: boolean`

  Default: `false`

  When `true`, the Mixin will continually watch the `Component` and re-fire hooks whenever it enters or leaves the viewport. Because this is expensive, this behaviour is opt-in. When false, the Mixin will only watch the `Component` until it enters the viewport once, and then it sets `viewportEntered` to `true` (permanently), and unbinds listeners. This reduces the load on the Ember run loop and your application. 

- [BETA] `viewportScrollSentivity: number`

  Default: `1`

  This value determines the degree of sensitivity (in `px`) in which a DOM element is considered to have scrolled into the viewport. For example, if you set `viewportScrollSentivity` to `10`, the `didScroll{...}` hooks would only fire if the scroll was greater than `10px`. 

- `viewportRefreshRate: number`

  Default: `100`

  If `requestAnimationFrame` is not present, this value determines how often the Mixin checks your component to determine whether or not it has entered or left the viewport. The lower this number, the more often it checks, and the more load is placed on your application. Generally, you'll want this value between `100` to `300`, which is about the range at which people consider things to be "real-time".

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

## Legal

[DockYard](http://dockyard.com), Inc &copy; 2015

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
