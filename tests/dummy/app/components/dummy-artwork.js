import Component from '@glimmer/component';
import { htmlSafe } from '@ember/string';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { artworkProfiles, artworkFallbacks, viewports } from '../-config';
import { guidFor } from '@ember/object/internals';
import ENV from 'dummy/config/environment';

/**
 * This function generates a value for the `srcset` attribute
 * based on a URL and image options.
 *
 * where options:
 * - `{w}` is the width placeholder
 * - `{h}` is the height placeholder
 * - `{c}` is the crop placeholder
 * - `{f}` is the file type placeholder
 *
 * The options object specified is expected to have `width`,
 * `height`, `crop`, and `fileType` key/value pairs.
 *
 * @method buildSrcset
 * @param {String} rawURL The raw URL
 * @param {Object} options The image options
 * @return {String} The `srcset` attribute value
 * @public
 */
export function buildSrcset(url, options, pixelDensity = 1) {
  return `${url} ${options.width * pixelDensity}w`;
}

/**
 * #### Usage
 *
 * ```hbs
 *  <DummyArtwork @artwork={{this.artwork}} @artworkProfile="user-profile" />
 * ```
 *
 * @class DummyArtwork
 * @module Components
 * @extends {Ember.Component}
 * @public
 */
export default class DummyArtwork extends Component {
  @service inViewport;
  @service media;

  rootURL = ENV.rootURL;

  /**
   * Provide an `alt` attribute for the `<img>` tag. Default is an empty string.
   *
   * @property alt
   * @type String
   * @public
   */

  /**
   * @property isDownloaded
   * @type {Boolean}
   * @default false
   * @public
   */
  isDownloaded = false;

  /**
   * @property isErrored
   * @type {Boolean}
   * @default false
   * @public
   */
  isErrored = false;

  /**
   * @property fileType
   * @type String
   * @public
   */
  fileType = 'jpg';

  /**
   * @property lazyLoad
   * @type {Boolean}
   * @default true
   * @public
   */
  lazyLoad = true;

  /**
   * The value to be used for background-color CSS property
   * when addBgColor is true. This will override
   * any property included in the artwork data.
   * @property overrideBgColor
   * @type {String}
   * @public
   */
  overrideBgColor;

  /**
   * Indicates if a background color should be added to
   * display while loading
   *
   * @property addBgColor
   * @type {Boolean}
   * @public
   */
  addBgColor;

  constructor(...args) {
    super(...args);

    // for use in template
    this.boundOnError = this.onError.bind(this);
    this.boundOnLoad = this.onLoad.bind(this);
    set(this, 'guid', guidFor(this));
  }

  /**
   *
   * @property userInitials
   * @type {String}
   * @public
   */
  get userInitials() {
    return this.actualArtwork.userInitials;
  }

  /**
   *
   * @property isFallbackArtwork
   * @type {Boolean}
   * @public
   */
  get isFallbackArtwork() {
    return this.actualArtwork.isFallback;
  }

  /**
   *
   * @property isUserMonogram
   * @type {Boolean}
   * @public
   */
  get isUserMonogram() {
    return this.isFallbackArtwork && !!this.userInitials;
  }

  /**
   * @property artworkClasses
   * @type {String}
   * @public
   */
  get artworkClasses() {
    let classes = this.class || '';
    if (this.isDownloaded) {
      classes += ' dummy-artwork--downloaded ';
    }

    return classes.trim();
  }

  /**
   * @property height
   * @type {String|Number}
   * @public
   */
  get height() {
    const [viewport = 'medium'] = this.media.matches;
    if (this.profiles && this.profiles[viewport]) {
      return this.profiles[viewport].height;
    }

    return this.profiles.large && this.profiles.large.height;
  }

  /**
   * @property width
   * @type {String|Number}
   * @public
   */
  get width() {
    const [viewport = 'medium'] = this.media.matches;
    if (this.profiles && this.profiles[viewport]) {
      return this.profiles[viewport].width;
    }

    // no profile if no artwork
    return this.profiles.large && this.profiles.large.width;
  }

  /**
   * The background color inline style for the artwork.
   * This will be visible while the image is loading.
   *
   * @property bgColor
   * @type String
   * @public
   */
  get bgColor() {
    if (!this.actualArtwork || this.actualArtwork.hasAlpha) {
      return htmlSafe('');
    }
    const { overrideBgColor, addBgColor } = this;
    const bgColor = overrideBgColor || this.actualArtwork.bgColor;
    if (addBgColor && bgColor) {
      return `#${bgColor}`;
    }
  }

  get imgBgColor() {
    if (this.bgColor) {
      return htmlSafe(`background-color: ${this.bgColor};`);
    }
  }

  /**
   * @property aspectRatio The aspect ratio of the artwork from the config
   * @type Number
   * @private
   */
  get aspectRatio() {
    return this.width / this.height;
  }

  /**
   * This is the aspect ratio of the artwork itself, as opposed to the desired width/height
   * passed in by the consumer.
   *
   * @property mediaQueries The aspect ratio of the artwork from the server
   * @type number
   * @private
   */
  get mediaQueries() {
    return viewports
      .map(({ mediaQueryStrict, name }) => {
        if (!this.profiles[name]) {
          return;
        }
        return `${mediaQueryStrict} ${this.profiles[name].width}px`;
      })
      .filter(Boolean)
      .join(', ')
      .trim();
  }

  /**
   * An artworkProfile may be a string or object.
   * There may not be different viewport defined sizes for an artwork profile.
   * As a result, we dont want to avoid duplicate * work and tell the browser that the same size
   * exists for each lg/medium/small viewport.
   *
   * { large: { height, width, crop }, medium: { height, width, crop }, small: { ... } }
   *
   * or just this
   *
   * e.g. { large: { height, width, crop } }
   *
   * @property profile
   * @type Object
   * @public
   */
  get profile() {
    let profile = {};
    if (typeof this.args.artworkProfile === 'string') {
      profile = artworkProfiles[this.args.artworkProfile];
    } else if (typeof this.args.artworkProfile === 'object') {
      profile = this.args.artworkProfile;
    }

    return profile;
  }

  /**
   * @property profiles
   * @type Object
   * @public
   */
  get profiles() {
    // eslint-disable-next-line arrow-body-style
    return viewports.reduce((acc, view) => {
      // the artwork-profile might not define a size at a specific viewport defined in app/breakpoints.js
      if (this.profile[view.name]) {
        const { height, width, crop } = this.profile[view.name];
        acc[view.name] = { width, height, crop };
      }

      return acc;
    }, {});
  }

  /**
   * we render the fallback src directly in the image with no srcset
   *
   * @property fallbackSrc
   * @type String
   * @private
   */
  get fallbackSrc() {
    const {
      actualArtwork: { url, isFallback = false },
    } = this;
    if (isFallback) {
      return url;
    }
  }

  /**
   * @property srcset
   * @type String
   * @private
   */
  get srcset() {
    const {
      actualArtwork: { url, isFallback = false },
    } = this;
    return [1, 2]
      .map((pixelDensity) =>
        viewports.map(({ name }) => {
          const settings = Object.assign(
            {},
            { fileType: this.fileType },
            this.profiles[name]
          );
          // Build a srcset from patterned URL
          if (isFallback) {
            return;
          }
          return buildSrcset(url, settings, pixelDensity);
        })
      )
      .join(', ');
  }

  /**
   * @property actualArtwork
   * @type Object
   * @private
   */
  get actualArtwork() {
    const { url } = this.args.artwork || {};
    const { fallbackArtwork, isErrored } = this;

    if ((!url && fallbackArtwork) || isErrored) {
      return Object.assign({}, fallbackArtwork, { isFallback: true });
    }

    return this.args.artwork;
  }

  /**
   * If the fallback profile provided exists, we find the corresponding
   * fallback artwork object from the app config. This is used whenever
   * the main artwork object is missing or invalid.
   *
   * @property fallbackArtwork
   * @type object
   * @private
   */
  get fallbackArtwork() {
    const { fallbackProfile } = this;
    if (typeof fallbackProfile === 'object') {
      return fallbackProfile;
    }
    const fallbackArtwork = artworkFallbacks[fallbackProfile];

    if (fallbackArtwork) {
      return fallbackArtwork;
    }

    return null;
  }

  /**
   * Inline style to properly scale the img element.
   *
   * @property imgStyle
   * @type String
   * @public
   */
  get imgStyle() {
    return Object.keys(this.profiles)
      .map((name) => {
        const source = this.profiles[name];
        let style = '';
        if (source.width > 0) {
          style = `#${this.guid}, #${this.guid}::before {
                    width: ${source.width}px;
                    height: ${source.height}px;
                }
                #${this.guid}::before {
                    padding-top: ${(source.height / source.width) * 100}%;
                }`;
        }

        if (source.mediaQuery && style.length > 0) {
          return `@media ${source.mediaQuery} {
                  ${style}
                }`;
        }

        return style;
      })
      .reverse()
      .join('\n');
  }

  @action
  setupInViewport(element) {
    if (this.lazyLoad) {
      // find distance of top left corner of artwork to bottom of screen. Shave off 50px so user has to scroll slightly to trigger load
      window.requestAnimationFrame(() => {
        const { onEnter } = this.inViewport.watchElement(element, {
          viewportTolerance: { top: 200, right: 200, bottom: 200, left: 200 },
        });

        onEnter(this.didEnterViewport.bind(this));
      });
    }
  }

  /**
   * in-viewport hook to set src and srset based on data-* attrs
   *
   * @method didEnterViewport
   * @private
   */
  didEnterViewport() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }

    this._swapSource();
    this.inViewport.stopWatching(document.getElementById(this.guid));
  }

  /**
   * @method onError
   */
  onError() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }

    set(this, 'isErrored', true);
  }

  /**
   * @method onLoad
   */
  onLoad() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    set(this, 'isDownloaded', true);
  }

  willDestroy(...args) {
    this.inViewport.stopWatching(document.getElementById(this.guid));

    super.willDestroy(...args);
  }

  /**
   * swap src and srset with data attributes that hold the real src
   *
   * @method _swapSource
   * @private
   */
  _swapSource() {
    const { lazyLoad, isDownloaded, isFallbackArtwork } = this;
    const element = document.getElementById(this.guid);

    if (lazyLoad && element && !isDownloaded && !isFallbackArtwork) {
      const img = element.querySelector('img');
      if (img && img.dataset) {
        img.onload = this.onLoad.bind(this);
        img.srcset = img.dataset.srcset;
      }
    }
  }
}
