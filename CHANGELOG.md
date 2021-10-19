
## v3.10.3 (2021-10-14)

#### :bug: Bug Fix
* [#278](https://github.com/DockYard/ember-in-viewport/pull/278) [Bug]: Pass the intersectionObserverEntry to callbacks of {{in-vieport}} modifier ([@cibernox](https://github.com/cibernox))

#### Committers: 1
- Miguel Camba ([@cibernox](https://github.com/cibernox))


## v3.10.2 (2021-05-04)

#### :bug: Bug Fix
* [#274](https://github.com/DockYard/ember-in-viewport/pull/274) [Bug]: Upgrade intersection-observer-admin ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.10.1 (2021-05-03)

#### :bug: Bug Fix
* [#273](https://github.com/DockYard/ember-in-viewport/pull/273) [Bug]: revert intersection-observer-admin bug with multiple elements sharing a single root ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.10.0 (2021-04-27)

#### :bug: Bug Fix
* [#270](https://github.com/DockYard/ember-in-viewport/pull/270) Bug: stop watching unless viewportSpy=true is passed to modifier ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.9.0 (2021-03-22)

#### :bug: Bug Fix
* [#268](https://github.com/DockYard/ember-in-viewport/pull/268) Bug: Support scrollableArea as an element ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))


## v3.8.1 (2020-12-10)

#### :rocket: Enhancement
* [#259](https://github.com/DockYard/ember-in-viewport/pull/259) Upgrade Ember CLI and blueprint to 3.22 ([@SergeAstapov](https://github.com/SergeAstapov))
* [#250](https://github.com/DockYard/ember-in-viewport/pull/250) Ensure works with custom element as a sentinel ([@snewcomer](https://github.com/snewcomer))

#### Committers: 3
- Luke Melia ([@lukemelia](https://github.com/lukemelia))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))


## v3.7.8 (2020-08-02)

#### :bug: Bug Fix
* [#248](https://github.com/DockYard/ember-in-viewport/pull/248) [BUG]: Unable to use multiple {{in-viewport}} modifiers ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.7.7 (2020-07-28)

#### :bug: Bug Fix
* [#244](https://github.com/DockYard/ember-in-viewport/pull/244) ScheduleOnce is not deduping ([@snewcomer](https://github.com/snewcomer))

#### Committers: 2
- Mehul Kar ([@mehulkar](https://github.com/mehulkar))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.7.6 (2020-07-14)

#### :bug: Bug Fix
* [#241](https://github.com/DockYard/ember-in-viewport/pull/241) Fix test failures in Ember 3.20: Run service teardown code in willDestroy() ([@bendemboski](https://github.com/bendemboski))

#### Committers: 1
- Ben Demboski ([@bendemboski](https://github.com/bendemboski))


## v3.7.5 (2020-06-15)

#### :bug: Bug Fix
* [#239](https://github.com/DockYard/ember-in-viewport/pull/239) Fixing in-viewport element modifier with rAF-based detection ([@gmurphey](https://github.com/gmurphey))

#### Committers: 1
- Garrett Murphey ([@gmurphey](https://github.com/gmurphey))


## v3.7.4 (2020-06-09)

#### :rocket: Enhancement
* [#236](https://github.com/DockYard/ember-in-viewport/pull/236) MAJOR: Node 10 ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#238](https://github.com/DockYard/ember-in-viewport/pull/238) Warning on addToRegistry after destroy ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.7.3 (2020-05-07)

#### :rocket: Enhancement
* [#235](https://github.com/DockYard/ember-in-viewport/pull/235) Resolve async issues with service#destroy and tests ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#235](https://github.com/DockYard/ember-in-viewport/pull/235) Resolve async issues with service#destroy and tests ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.7.2 (2020-03-09)

#### :rocket: Enhancement
* [#225](https://github.com/DockYard/ember-in-viewport/pull/225) Mixin and viewportDidScroll removal warning in development ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#229](https://github.com/DockYard/ember-in-viewport/pull/229) Bump IntersectionObserverAdmin to support Cordova ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.7.1 (2019-12-30)

#### :rocket: Enhancement
* [#221](https://github.com/DockYard/ember-in-viewport/pull/221) Bump to latest io-admin 0.2.10 ([@snewcomer](https://github.com/snewcomer))
* [#219](https://github.com/DockYard/ember-in-viewport/pull/219) Improve docs ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.7.0 (2019-12-21)

#### :rocket: Enhancement
* [#215](https://github.com/DockYard/ember-in-viewport/pull/215) Built in modifier test and README ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.6.2 (2019-12-18)

#### :rocket: Enhancement
* [#214](https://github.com/DockYard/ember-in-viewport/pull/214) 3.12 ([@snewcomer](https://github.com/snewcomer))
* [#208](https://github.com/DockYard/ember-in-viewport/pull/208) feat(modifiers): add `in-viewport`, `did-enter-viewport`, `did-exit-viewport` ([@buschtoens](https://github.com/buschtoens))

#### :bug: Bug Fix
* [#217](https://github.com/DockYard/ember-in-viewport/pull/217) Closes [#216](https://github.com/dockyard/ember-in-viewport/issues/216), remove unnecessary call to startIntersectionObserver ([@dbashford](https://github.com/dbashford))

#### Committers: 4
- David Bashford ([@dbashford](https://github.com/dbashford))
- Jan Buschtöns ([@buschtoens](https://github.com/buschtoens))
- Lauren Tan ([@poteto](https://github.com/poteto))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.6.1 (2019-10-13)

#### :rocket: Enhancement
* [#212](https://github.com/DockYard/ember-in-viewport/pull/212) Update deps and security vulns ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.6.0 (2019-09-25)

#### :rocket: Enhancement
* [#210](https://github.com/DockYard/ember-in-viewport/pull/210) Support scrollableArea as an element ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.9 (2019-09-15)

#### :rocket: Enhancement
* [#206](https://github.com/DockYard/ember-in-viewport/pull/206) Update raf-pool 0.1.2 ([@snewcomer](https://github.com/snewcomer))

#### Committers: 2
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))
- Vasanth ([@vasind](https://github.com/vasind))


## v3.5.8 (2019-05-24)

#### :rocket: Enhancement
* [#199](https://github.com/DockYard/ember-in-viewport/pull/199) Update IO 0.2.4 with simpler replacer func ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#199](https://github.com/DockYard/ember-in-viewport/pull/199) Update IO 0.2.4 with simpler replacer func ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.7 (2019-05-24)

#### :bug: Bug Fix
* [#198](https://github.com/DockYard/ember-in-viewport/pull/198) Fix stringify replacer function ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.6 (2019-05-23)

#### :rocket: Enhancement
* [#197](https://github.com/DockYard/ember-in-viewport/pull/197) Bump IO library to 0.2.2 ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#196](https://github.com/DockYard/ember-in-viewport/pull/196) Fix didScroll ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.5 (2019-05-14)

#### :bug: Bug Fix
* [#194](https://github.com/DockYard/ember-in-viewport/pull/194) Protect if no admin instance ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.4 (2019-05-08)

#### :rocket: Enhancement
* [#193](https://github.com/DockYard/ember-in-viewport/pull/193) Pass IO Entry in callback ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.3 (2019-05-02)

#### :bug: Bug Fix
* [#192](https://github.com/DockYard/ember-in-viewport/pull/192) Dont start rAF if has IntersectionObserver ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.2 (2019-04-27)

#### :rocket: Enhancement
* [#190](https://github.com/DockYard/ember-in-viewport/pull/190) rAF: small refactor to use new recursive function ([@snewcomer](https://github.com/snewcomer))
* [#185](https://github.com/DockYard/ember-in-viewport/pull/185) New API: watchElement for classes with no mixin ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#188](https://github.com/DockYard/ember-in-viewport/pull/188) Forgot removeRAF in recursive fn ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.5.0 (2019-04-20)

#### :rocket: Enhancement
* [#184](https://github.com/DockYard/ember-in-viewport/pull/184) Internal: Update IntersectionObserverAdmin + simplify ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.4.0 (2019-04-18)

#### :rocket: Enhancement
* [#182](https://github.com/DockYard/ember-in-viewport/pull/182) Add API to not listen to scroll direction ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.3.0 (2019-03-25)

#### :rocket: Enhancement
* [#179](https://github.com/DockYard/ember-in-viewport/pull/179) Just a small town boy living in a ember modifier world ([@snewcomer](https://github.com/snewcomer))
* [#178](https://github.com/DockYard/ember-in-viewport/pull/178)  Update 3.8 and prep for modifiers ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.2.2 (2018-12-11)

#### :rocket: Enhancement
* [#175](https://github.com/DockYard/ember-in-viewport/pull/175) Ensure rAF takes into account sentinels w and h ([@snewcomer](https://github.com/snewcomer))
* [#174](https://github.com/DockYard/ember-in-viewport/pull/174) Ensure dummy app runs in ie11 ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#175](https://github.com/DockYard/ember-in-viewport/pull/175) Ensure rAF takes into account sentinels w and h ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.2.1 (2018-12-02)

#### :rocket: Enhancement
* [#172](https://github.com/DockYard/ember-in-viewport/pull/172) Remove deprecated travis sudo:false flag ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#173](https://github.com/DockYard/ember-in-viewport/pull/173) IE11 fix ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.2.0 (2018-11-27)

#### :rocket: Enhancement
* [#170](https://github.com/DockYard/ember-in-viewport/pull/170) Use rAFPool npm pkg ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## 3.2.0 (2018-11-27)

#### :rocket: Enhancement
* [#170](https://github.com/DockYard/ember-in-viewport/pull/170) Use rAFPool npm pkg ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.1.5 (2018-10-25)

#### :bug: Bug Fix
* [#168](https://github.com/DockYard/ember-in-viewport/pull/168) Fix scope memory leak ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.1.4 (2018-10-11)

#### :rocket: Enhancement
* [#127](https://github.com/DockYard/ember-in-viewport/pull/127) right left scrolling example ([@snewcomer](https://github.com/snewcomer))
* [#163](https://github.com/DockYard/ember-in-viewport/pull/163) Update to 3.4 and resolve audit warning ([@snewcomer](https://github.com/snewcomer))

#### Committers: 3
- Ben Limmer ([@blimmer](https://github.com/blimmer))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))
- sir.dinha ([@sardyy](https://github.com/sardyy))


## v3.1.3 (2018-08-27)

#### :rocket: Enhancement
* [#162](https://github.com/DockYard/ember-in-viewport/pull/162) Handle root with gaining sizzle properties  ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#162](https://github.com/DockYard/ember-in-viewport/pull/162) Handle root with gaining sizzle properties  ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.1.2 (2018-08-23)

#### :rocket: Enhancement
* [#158](https://github.com/DockYard/ember-in-viewport/pull/158) Update deps to fix security audit ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#159](https://github.com/DockYard/ember-in-viewport/pull/159)  Do not cancel rAF as this effects other elements that are observed ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## 3.1.2 (2018-08-23)

#### :rocket: Enhancement
* [#158](https://github.com/DockYard/ember-in-viewport/pull/158) Update deps to fix security audit ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#159](https://github.com/DockYard/ember-in-viewport/pull/159)  Do not cancel rAF as this effects other elements that are observed ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.1.1 (2018-08-21)

#### :rocket: Enhancement
* [#157](https://github.com/DockYard/ember-in-viewport/pull/157) Allow `root` on static admin to have multiple keys ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.1.0 (2018-07-27)

#### :rocket: Enhancement
* [#153](https://github.com/DockYard/ember-in-viewport/pull/153)  Use one IntersectionObserver per viewport ([@snewcomer](https://github.com/snewcomer))
* [#152](https://github.com/DockYard/ember-in-viewport/pull/152) Stop rAF loop if transition from page that uses rAF to page that uses IO ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.0.4 (2018-07-13)

#### :rocket: Enhancement
* [#150](https://github.com/DockYard/ember-in-viewport/pull/150) updates + fix w/ npm audit ([@snewcomer](https://github.com/snewcomer))
* [#147](https://github.com/DockYard/ember-in-viewport/pull/147) Ensure explicitly setting viewportUseIntersectionObserver is not allowed ([@snewcomer](https://github.com/snewcomer))
* [#145](https://github.com/DockYard/ember-in-viewport/pull/145) use one rAF manager ([@snewcomer](https://github.com/snewcomer))
* [#144](https://github.com/DockYard/ember-in-viewport/pull/144) Cancel animation frame before requesting again ([@jheth](https://github.com/jheth))
* [#143](https://github.com/DockYard/ember-in-viewport/pull/143) add note about didExitViewport and intersectionThreshold ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#147](https://github.com/DockYard/ember-in-viewport/pull/147) Ensure explicitly setting viewportUseIntersectionObserver is not allowed ([@snewcomer](https://github.com/snewcomer))

#### Committers: 2
- Joe Heth ([@jheth](https://github.com/jheth))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## 3.0.4 (2018-07-13)

#### :rocket: Enhancement
* [#150](https://github.com/DockYard/ember-in-viewport/pull/150) updates + fix w/ npm audit ([@snewcomer](https://github.com/snewcomer))
* [#147](https://github.com/DockYard/ember-in-viewport/pull/147) Ensure explicitly setting viewportUseIntersectionObserver is not allowed ([@snewcomer](https://github.com/snewcomer))
* [#145](https://github.com/DockYard/ember-in-viewport/pull/145) use one rAF manager ([@snewcomer](https://github.com/snewcomer))
* [#144](https://github.com/DockYard/ember-in-viewport/pull/144) Cancel animation frame before requesting again ([@jheth](https://github.com/jheth))
* [#143](https://github.com/DockYard/ember-in-viewport/pull/143) add note about didExitViewport and intersectionThreshold ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#147](https://github.com/DockYard/ember-in-viewport/pull/147) Ensure explicitly setting viewportUseIntersectionObserver is not allowed ([@snewcomer](https://github.com/snewcomer))

#### Committers: 2
- Joe Heth ([@jheth](https://github.com/jheth))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.0.2 (2018-04-15)

#### :rocket: Enhancement
* [#140](https://github.com/DockYard/ember-in-viewport/pull/140) upgrade to 3.1 ember ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## 3.0.2 (2018-04-15)

#### :rocket: Enhancement
* [#140](https://github.com/DockYard/ember-in-viewport/pull/140) upgrade to 3.1 ember ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.0.1 (2018-04-06)

#### :rocket: Enhancement
* [#138](https://github.com/DockYard/ember-in-viewport/pull/138) Bugfix - send action on destroy + memory leaks ([@snewcomer](https://github.com/snewcomer))
* [#134](https://github.com/DockYard/ember-in-viewport/pull/134) add firefox to travis ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#138](https://github.com/DockYard/ember-in-viewport/pull/138) Bugfix - send action on destroy + memory leaks ([@snewcomer](https://github.com/snewcomer))

#### Committers: 2
- Marten ([@martndemus](https://github.com/martndemus))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## 3.0.1 (2018-04-06)

#### :rocket: Enhancement
* [#138](https://github.com/DockYard/ember-in-viewport/pull/138) Bugfix - send action on destroy + memory leaks ([@snewcomer](https://github.com/snewcomer))
* [#134](https://github.com/DockYard/ember-in-viewport/pull/134) add firefox to travis ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#138](https://github.com/DockYard/ember-in-viewport/pull/138) Bugfix - send action on destroy + memory leaks ([@snewcomer](https://github.com/snewcomer))

#### Committers: 2
- Marten ([@martndemus](https://github.com/martndemus))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.0.0 (2018-03-02)

#### :rocket: Enhancement
* [#133](https://github.com/DockYard/ember-in-viewport/pull/133) Raf test bounding ([@snewcomer](https://github.com/snewcomer))
* [#130](https://github.com/DockYard/ember-in-viewport/pull/130) Improve docs ([@snewcomer](https://github.com/snewcomer))
* [#121](https://github.com/DockYard/ember-in-viewport/pull/121) Upgrade to 3.0 and remove jquery usage ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#132](https://github.com/DockYard/ember-in-viewport/pull/132) update rafLogic for scrollable area ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## 3.0.0 (2018-03-02)

#### :rocket: Enhancement
* [#133](https://github.com/DockYard/ember-in-viewport/pull/133) Raf test bounding ([@snewcomer](https://github.com/snewcomer))
* [#130](https://github.com/DockYard/ember-in-viewport/pull/130) Improve docs ([@snewcomer](https://github.com/snewcomer))
* [#121](https://github.com/DockYard/ember-in-viewport/pull/121) Upgrade to 3.0 and remove jquery usage ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#132](https://github.com/DockYard/ember-in-viewport/pull/132) update rafLogic for scrollable area ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v2.2.1 (2018-02-23)

#### :rocket: Enhancement
* [#126](https://github.com/DockYard/ember-in-viewport/pull/126) change intersection threshold default to 0 ([@snewcomer](https://github.com/snewcomer))
* [#125](https://github.com/DockYard/ember-in-viewport/pull/125) Move viewport config to addon folder Closes [#124](https://github.com/dockyard/ember-in-viewport/issues/124) ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#125](https://github.com/DockYard/ember-in-viewport/pull/125) Move viewport config to addon folder Closes [#124](https://github.com/dockyard/ember-in-viewport/issues/124) ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## 2.2.1 (2018-02-23)

#### :rocket: Enhancement
* [#126](https://github.com/DockYard/ember-in-viewport/pull/126) change intersection threshold default to 0 ([@snewcomer](https://github.com/snewcomer))
* [#125](https://github.com/DockYard/ember-in-viewport/pull/125) Move viewport config to addon folder Closes [#124](https://github.com/dockyard/ember-in-viewport/issues/124) ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#125](https://github.com/DockYard/ember-in-viewport/pull/125) Move viewport config to addon folder Closes [#124](https://github.com/dockyard/ember-in-viewport/issues/124) ([@snewcomer](https://github.com/snewcomer))

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v2.2.0 (2018-02-08)

#### :rocket: Enhancement
* [#113](https://github.com/DockYard/ember-in-viewport/pull/113) Use IntersectionObserver if available ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#122](https://github.com/DockYard/ember-in-viewport/pull/122) Fix viewportTolerance with defaults ([@snewcomer](https://github.com/snewcomer))

#### Committers: 5
- Alexander Lang ([@langalex](https://github.com/langalex))
- Alvin Crespo ([@alvincrespo](https://github.com/alvincrespo))
- Miguel Camba ([@cibernox](https://github.com/cibernox))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))
- [@hybridmuse](https://github.com/hybridmuse)


## 2.2.0 (2018-02-08)

#### :rocket: Enhancement
* [#113](https://github.com/DockYard/ember-in-viewport/pull/113) Use IntersectionObserver if available ([@snewcomer](https://github.com/snewcomer))

#### :bug: Bug Fix
* [#122](https://github.com/DockYard/ember-in-viewport/pull/122) Fix viewportTolerance with defaults ([@snewcomer](https://github.com/snewcomer))

#### Committers: 5
- Alexander Lang ([@langalex](https://github.com/langalex))
- Alvin Crespo ([@alvincrespo](https://github.com/alvincrespo))
- Miguel Camba ([@cibernox](https://github.com/cibernox))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))
- [@hybridmuse](https://github.com/hybridmuse)
