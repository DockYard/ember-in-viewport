# ember-in-viewport
*Detect if an Ember View or Component is in the viewport @ 60FPS*

**[ember-in-viewport is built and maintained by DockYard, contact us for expert Ember.js consulting](https://dockyard.com/ember-consulting)**.

[Read the blogpost](https://medium.com/delightful-ui-for-ember-apps/creating-an-ember-cli-addon-detecting-ember-js-components-entering-or-leaving-the-viewport-7d95ceb4f5ed)

![Download count all time](https://img.shields.io/npm/dt/ember-in-viewport.svg) [![npm version](https://badge.fury.io/js/ember-in-viewport.svg)](http://badge.fury.io/js/ember-in-viewport) [![Build Status](https://travis-ci.org/DockYard/ember-in-viewport.svg)](https://travis-ci.org/DockYard/ember-in-viewport) [![Ember Observer Score](http://emberobserver.com/badges/ember-in-viewport.svg)](http://emberobserver.com/addons/ember-in-viewport)

This Ember addon adds a simple, highly performant Service or Mixin to your app. This library will allow you to check if a `Component` or DOM element has entered the browser's viewport. By default, this uses the `IntersectionObserver` API if it detects it the DOM element is in your user's browser – failing which, it falls back to using `requestAnimationFrame`, then if not available, the Ember run loop and event listeners.

We utilize pooling techniques to reuse Intersection Observers and rAF observers in order to make your app as performant as possible and do as little works as possible.

## Demo or examples
- Lazy loading responsive images (see `dummy-artwork` for an example artwork component).  Visit `http://localhost:4200/infinity-modifier` to see it in action
- Dummy app (`ember serve`): https://github.com/DockYard/ember-in-viewport/tree/master/tests/dummy
- Use with Ember [Modifiers](#modifiers) and [@ember/render-modifiers](https://github.com/emberjs/ember-render-modifiers)
- Use with [Native Classes](#classes)
- [ember-infinity](https://github.com/ember-infinity/ember-infinity)
- [ember-light-table](https://github.com/offirgolan/ember-light-table)
- Tracking advertisement impressions
- Occlusion culling


# Table of Contents

- [Installation](#installation)
  * [Usage](#usage)
    + [Configuration](#configuration)
    + [Global options](#global-options)
    + [Modifiers](#modifiers)
    + [Classes](#classes)
    + [Available Mixin hooks](#available-hooks)
      * [`didEnterViewport`, `didExitViewport`](#didenterviewport-didexitviewport)
      * [`didScroll(up,down,left,right)`](#didscrollupdownleftright)
      * [`viewportEntered`](#viewportentered)
      * [`viewportExited`](#viewportexited)
  * [**IntersectionObserver**'s Browser Support](#intersectionobservers-browser-supportscrollableArea)
    + [Out of the box](#out-of-the-box)
  * [Running](#running)
  * [Running Tests](#running-tests)
  * [Building](#building)
  * [Legal](#legal)



# Installation

```
ember install ember-in-viewport
```

## Usage
Usage is simple. First, inject the service to your component and start "watching" DOM elements.

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyClass extends Component {
  @service inViewport

  @action
  setupInViewport() {
    const loader = document.getElementById('loader');
    const viewportTolerance = { bottom: 200 };
    const { onEnter, _onExit } = this.inViewport.watchElement(loader, { viewportTolerance });
    // pass the bound method to `onEnter` or `onExit`
    onEnter(this.didEnterViewport.bind(this));
  }

  didEnterViewport() {
    // do some other stuff
    this.infinityLoad();
  }

  willDestroy() {
    // need to manage cache yourself if you don't use the mixin
    const loader = document.getElementById('loader');
    this.inViewport.stopWatching(loader);

    super.willDestroy(...arguments);
  }
}
```

```hbs
<ul>
  <li></li>
  ...
</ul>
<div id="loader"></div>
```

You can also use [`Modifiers`](#modifiers) as well.  Using modifiers cleans up the boilerplate needed and is shown in a later example.

This addon also supports the use of a Mixin to your `Component`:

```js
import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  // ...
});
```

### Configuration
To use with the service based approach, simply pass in the options to `watchElement` as the second argument.

```js
import Component from '@ember/component';
import { inject as service }  from '@ember/service';

export default class MyClass extends Component {
  @service inViewport

  didInsertElement() {
    super.didInsertElement(...arguments);

    const { onEnter, _onExit } = this.inViewport.watchElement(
      loader,
      {
        viewportTolerance: { bottom: 200 },
        intersectionThreshold: 0.25,
        scrollableArea: '#scrollable-area'
      }
    );
  }
}
```

The mixin comes with some options as well. Due to the way listeners and `IntersectionObserver API` or `requestAnimationFrame` is setup, you'll have to override the options this way:

```js
import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { setProperties }  from '@ember/object';

export default Component.extend(InViewportMixin, {
  init() {
    this._super(...arguments);

    setProperties(this, {
      viewportEnabled                 : true,
      viewportUseRAF                  : true,
      viewportSpy                     : false,
      viewportScrollSensitivity       : 1,
      viewportRefreshRate             : 150,
      intersectionThreshold           : 0,
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

  Read-only

  This library, by default, will use the IntersectionObserver API. If IntersectionObserver is not supported in the target browser, ember-in-viewport will fallback to rAF.  We prevent users from explicitly setting this to `true` as browsers lacking support for IntersectionObserver will throw an error.

  (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  (https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds#Browser_compatibility)

- `intersectionThreshold: decimal or array`

  Default: 0

  A single number or array of numbers between 0.0 and 1.0.  A value of 0.0 means the target will be visible when the first pixel enters the viewport.  A value of 1.0 means the entire target must be visible to fire the didEnterViewport hook.
  Similarily, [0, .25, .5, .75, 1] will fire didEnterViewport every 25% of the target that is visible.
  (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Thresholds)

  Some notes:
    - If the target is offscreen, you will get a notification via `didExitViewport` that the target is initially offscreen.  Similarily, this is possible to notify if onscreen when your site loads.
    - If intersectionThreshold is set to anything greater than 0, you will not see `didExitViewport` hook fired due to our use of the `isIntersecting` property.  See last comment here: https://bugs.chromium.org/p/chromium/issues/detail?id=713819 for purpose of `isIntersecting`
    - To get around the above issue and have `didExitViewport` fire, set your `intersectionThreshold` to `[0, 1.0]`.  When set to just `1.0`, when the element is 99% visible and still has isIntersecting as true, when the element leaves the viewport, the element isn't applicable to the observer anymore, so the callback isn't called again.
    - If your intersectionThreshold is set to 0 you will get notified if the target `didEnterViewport` and `didExitViewport` at the appropriate time.

- `scrollableArea: string | HTMLElement`

  Default: null

  A CSS selector for the scrollable area.  e.g. `".my-list"`

- `viewportUseRAF: boolean`

  Default: Depends on browser

  As its name suggests, if this is `true` and the IntersectionObserver API is not available in the target browser, the Mixin will use `requestAnimationFrame`. Unless you want to force enabling or disabling this, you won't need to override this option.

- `viewportSpy: boolean`

  Default: `false`

  `viewportSpy: true` is often useful when you have "infinite lists" that need to keep loading more data.
  `viewportSpy: false` is often useful for one time loading of artwork, metrics, etc when the come into the viewport.

  If you support IE11 and detect and run logic `onExit`, then it is necessary to have this `true` to that the requestAnimationFrame watching your sentinel is not torn down.

  When `true`, the library will continually watch the `Component` and re-fire hooks whenever it enters or leaves the viewport. Because this is expensive, this behaviour is opt-in. When false, the Mixin will only watch the `Component` until it enters the viewport once, and then it sets `viewportEntered` to `true` (permanently), and unbinds listeners. This reduces the load on the Ember run loop and your application.

  NOTE: If using IntersectionObserver (default), viewportSpy wont put too much of a tax on your application.  However, for browsers (Safari < 12.1) that don't currently support IntersectionObserver, we fallback to rAF.  Depending on your use case, the default of `false` may be acceptable.

- `viewportDidScroll: boolean`

  Default: `true`

  When `true`, the Mixin enables listening to the `didScroll` hook.  This will become by default false in a future major release

- `viewportScrollSensitivity: number`

  Default: `1`

  This value determines the degree of sensitivity (in `px`) in which a DOM element is considered to have scrolled into the viewport. For example, if you set `viewportScrollSensitivity` to `10`, the `didScroll{...}` hooks would only fire if the scroll was greater than `10px`.  Only applicable if IntersectionObserver and rAF are not applied.

- `viewportRefreshRate: number`

  Default: `100`

  If `IntersectionObserver` and `requestAnimationFrame` is not present, this value determines how often the Mixin checks your component to determine whether or not it has entered or left the viewport. The lower this number, the more often it checks, and the more load is placed on your application. Generally, you'll want this value between `100` to `300`, which is about the range at which people consider things to be "real-time".

  This value also affects how often the Mixin checks scroll direction.

- `viewportTolerance: object`

  Default: `{ top: 0, left: 0, bottom: 0, right: 0 }`

  This option determines how accurately the `Component` needs to be within the viewport for it to be considered as entered.  Add bottom margin to preemptively trigger didEnterViewport.

  For IntersectionObserver, this property interpolates to [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin).
  For rAF, this property will use `bottom` tolerance and measure against the height of the container to determine when to trigger didEnterViewport.

  Also, if your sentinel (component that uses this mixin) is a zero-height element, ensure that the sentinel actually is able to enter the viewport.

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
      viewportScrollSensitivity       : 1,
      viewportRefreshRate             : 100,
      viewportListeners               : [],
      intersectionThreshold           : 0,
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

// Note if you want to disable right and left in-viewport triggers, set these values to `Infinity`.
```

### Modifiers

Using with [Modifiers](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html) is easy.

You can either use our built in modifier `{{in-viewport}}` or a more verbose, but potentially more flexible generic modifier. Let's start with the former.

1. Use `{{in-viewport}}` modifier on target element
2. Ensure you have a callbacks in context for enter and/or exit
3. `options` are optional - see [Advanced usage (options)](#advanced-usage-options)

```hbs
<ul class="list">
  <li></li>
  <li></li>
  <div {{in-viewport onEnter=(fn this.onEnter artwork) onExit=this.onExit scrollableArea=".list"}}>
    List sentinel
  </div>
</ul>
```

This modifier is useful for a variety of scenarios where you need to watch a sentinel.  With template only components, functionality like this is even more important!  If you have logic that currently uses the `did-insert` modifier to start watching an element, try this one out!

If you need more than our built in modifier...

1.  Install [@ember/render-modifiers](https://github.com/emberjs/ember-render-modifiers)
2.  Use the `did-insert` hook inside a component
3.  Wire up the component like so

Note - This is in lieu of a `did-enter-viewport` modifier, which we plan on adding in the future.  Compared to the solution below, `did-enter-viewport` won't need a container (`this`) passed to it.  But for now, to start using modifiers, this is the easy path.

```js
import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default class Infinity extends Component.extend(InViewportMixin) {
  @action
  setupInViewport(element) {
    set(this, 'viewportSpy', true);
    set(this, 'viewportTolerance', {
      bottom: 300
    });

    this.watchElement(element);
  }

  didEnterViewport() {
    // this will only work with one element being watched in the container. This is still a TODO to enable
    this.infinityLoad();
  }
}
```

```hbs
<div {{did-insert this.setupInViewport}}>
  {{yield}}
</div>
```

### Classes

Special note: The service based approach allows you to absolve yourself from using a mixin in native classes!

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyClass extends Component {
  @service inViewport

  @action
  setupInViewport() {
    const loader = document.getElementById('loader');
    const viewportTolerance = { bottom: 200 };
    const { onEnter, _onExit } = this.inViewport.watchElement(loader, { viewportTolerance });
    onEnter(this.didEnterViewport.bind(this));
  }

  didEnterViewport() {
    // do some other stuff
    this.infinityLoad();
  }

  willDestroy() {
    // need to manage cache yourself if you don't use the mixin
    const loader = document.getElementById('loader');
    this.inViewport.stopWatching(loader);

    super.willDestroy(...arguments);
  }
}
```

And with Classes + Modifiers!

```js
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MyClass extends Component {
  @service inViewport

  @action
  setupInViewport(element) {
    const viewportTolerance = { bottom: 200 };
    const { onEnter, onExit } = this.inViewport.watchElement(element, { viewportTolerance });
    onEnter(this.didEnterViewport.bind(instance));
  }

  didEnterViewport() {
    // do some other stuff
  }

  willDestroy() {
    // need to manage cache yourself if you don't use the mixin
    const loader = document.getElementById('loader');
    this.inViewport.stopWatching(loader);

    super.willDestroy(...arguments);
  }
}
```

```hbs
<div {{did-insert this.setupInViewport}}>
  {{yield}}
</div>
```

Options as the second argument to `inViewport.watchElement` include `intersectionThreshold`, `scrollableArea`, `viewportSpy` && `viewportTolerance`.

#### Available Mixin hooks
##### `didEnterViewport`, `didExitViewport`
These hooks fire once whenever the `Component` enters or exits the viewport. You can handle them the same way you would handle any other native Ember hook:

```js
import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  didEnterViewport() {
    console.log('entered');
  },

  didExitViewport() {
    console.log('exited');
  }
});
```

##### `didScroll(up,down,left,right)`
The `didScroll` hook fires when an element enters the viewport. For example, if you scrolled down in order to move the element in the viewport, the `didScroll` hook would fire and also receive the direction as a string. You can then handle it like another hook as in the above example. This is only available with the Mixin and likely not something you will need.

```js
import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  didScroll(direction) {
    console.log(direction); // 'up' || 'down' || 'left' || 'right'
  }
});
```

##### `viewportEntered`
To apply an `.active` class to your `Component` when it enters the viewport, you can simply bind the `active` class to the mixed in property `viewportEntered`, like so:

```js
import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  classNameBindings: [ 'viewportEntered:active' ]
});
```

##### `viewportExited`
This hook fires whenever the `Component` leaves the viewport.

## [**IntersectionObserver**'s Browser Support](https://platform-status.mozilla.org/)

### Out of the box

<table>
    <tr>
        <td>Chrome</td>
        <td>51 <sup>[1]</sup></td>
    </tr>
    <tr>
        <td>Firefox (Gecko)</td>
        <td>55 <sup>[2]</sup></td>
    </tr>
    <tr>
        <td>MS Edge</td>
        <td>15</td>
    </tr>
    <tr>
        <td>Internet Explorer</td>
        <td>Not supported</td>
    </tr>
    <tr>
        <td>Opera <sup>[1]</sup></td>
        <td>38</td>
    </tr>
    <tr>
        <td>Safari</td>
        <td>Safari Technology Preview</td>
    </tr>
    <tr>
        <td>Chrome for Android</td>
        <td>59</td>
    </tr>
    <tr>
        <td>Android Browser</td>
        <td>56</td>
    </tr>
    <tr>
        <td>Opera Mobile</td>
        <td>37</td>
    </tr>
</table>

* [1] [Reportedly available](https://www.chromestatus.com/features/5695342691483648), it didn't trigger the events on initial load and lacks `isIntersecting` until later versions.
* [2] This feature was implemented in Gecko 53.0 (Firefox 53.0 / Thunderbird 53.0 / SeaMonkey 2.50) behind the preference `dom.IntersectionObserver.enabled`.

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --serve`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Legal

[DockYard](http://dockyard.com/ember-consulting), Inc &copy; 2015

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

## Contributors

We're grateful to these wonderful contributors who've contributed to `ember-in-viewport`:

[//]: contributor-faces
<a href="https://github.com/poteto"><img src="https://avatars0.githubusercontent.com/u/1390709?v=4" title="poteto" width="80" height="80"></a>
<a href="https://github.com/snewcomer"><img src="https://avatars0.githubusercontent.com/u/7374640?v=4" title="snewcomer" width="80" height="80"></a>
<a href="https://github.com/kellyselden"><img src="https://avatars1.githubusercontent.com/u/602423?v=4" title="kellyselden" width="80" height="80"></a>
<a href="https://github.com/martndemus"><img src="https://avatars2.githubusercontent.com/u/903637?v=4" title="martndemus" width="80" height="80"></a>
<a href="https://github.com/cibernox"><img src="https://avatars2.githubusercontent.com/u/265339?v=4" title="cibernox" width="80" height="80"></a>
<a href="https://github.com/Alinaki"><img src="https://avatars0.githubusercontent.com/u/832780?v=4" title="Alinaki" width="80" height="80"></a>
<a href="https://github.com/bcardarella"><img src="https://avatars0.githubusercontent.com/u/18524?v=4" title="bcardarella" width="80" height="80"></a>
<a href="https://github.com/danorton-cubic-austin"><img src="https://avatars2.githubusercontent.com/u/11525236?v=4" title="danorton-cubic-austin" width="80" height="80"></a>
<a href="https://github.com/michaeldupuisjr"><img src="https://avatars3.githubusercontent.com/u/1060866?v=4" title="michaeldupuisjr" width="80" height="80"></a>
<a href="https://github.com/miguelcobain"><img src="https://avatars1.githubusercontent.com/u/631691?v=4" title="miguelcobain" width="80" height="80"></a>
<a href="https://github.com/offirgolan"><img src="https://avatars2.githubusercontent.com/u/575938?v=4" title="offirgolan" width="80" height="80"></a>
<a href="https://github.com/twokul"><img src="https://avatars2.githubusercontent.com/u/1131196?v=4" title="twokul" width="80" height="80"></a>
<a href="https://github.com/langalex"><img src="https://avatars0.githubusercontent.com/u/2173?v=4" title="langalex" width="80" height="80"></a>
<a href="https://github.com/alvincrespo"><img src="https://avatars0.githubusercontent.com/u/151311?v=4" title="alvincrespo" width="80" height="80"></a>
<a href="https://github.com/blimmer"><img src="https://avatars1.githubusercontent.com/u/630449?v=4" title="blimmer" width="80" height="80"></a>
<a href="https://github.com/duggiefresh"><img src="https://avatars2.githubusercontent.com/u/1206678?v=4" title="duggiefresh" width="80" height="80"></a>
<a href="https://github.com/elidupuis"><img src="https://avatars3.githubusercontent.com/u/196410?v=4" title="elidupuis" width="80" height="80"></a>
<a href="https://github.com/Kjaer"><img src="https://avatars0.githubusercontent.com/u/1381484?v=4" title="Kjaer" width="80" height="80"></a>
<a href="https://github.com/jmurphyau"><img src="https://avatars0.githubusercontent.com/u/445432?v=4" title="jmurphyau" width="80" height="80"></a>
<a href="https://github.com/jeffplang"><img src="https://avatars2.githubusercontent.com/u/102718?v=4" title="jeffplang" width="80" height="80"></a>
<a href="https://github.com/jheth"><img src="https://avatars0.githubusercontent.com/u/222011?v=4" title="jheth" width="80" height="80"></a>
<a href="https://github.com/jpadilla"><img src="https://avatars0.githubusercontent.com/u/83319?v=4" title="jpadilla" width="80" height="80"></a>
<a href="https://github.com/les2"><img src="https://avatars3.githubusercontent.com/u/1066080?v=4" title="les2" width="80" height="80"></a>
<a href="https://github.com/LevelbossMike"><img src="https://avatars3.githubusercontent.com/u/242299?v=4" title="LevelbossMike" width="80" height="80"></a>
<a href="https://github.com/rwjblue"><img src="https://avatars0.githubusercontent.com/u/12637?v=4" title="rwjblue" width="80" height="80"></a>
<a href="https://github.com/vasind"><img src="https://avatars0.githubusercontent.com/u/5652920?v=4" title="vasind" width="80" height="80"></a>
<a href="https://github.com/hybridmuse"><img src="https://avatars0.githubusercontent.com/u/27986936?v=4" title="hybridmuse" width="80" height="80"></a>
<a href="https://github.com/csand"><img src="https://avatars2.githubusercontent.com/u/142865?v=4" title="csand" width="80" height="80"></a>

[//]: contributor-faces
