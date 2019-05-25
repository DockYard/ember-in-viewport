import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { assign } from '@ember/polyfills';
import { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import InViewportMixin from 'ember-in-viewport';
import config from '../-config';
import { and, readOnly } from '@ember/object/computed';
import ENV from 'dummy/config/environment';

const {
    artworkProfiles,
    artworkFallbacks,
    viewports
} = config;


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
 * This component will generate a `div` tag with an `<img srcset="">` tag.
 * This means that we are not handling different aspect ratios per viewport. We call this "art direction"
 * without adding `source` elements.
 * Also we use just the srcset given current browser support for RESKIN
 *
 * e.g. { large: { height, width, crop }, medium: {}, small: {} }
 *
 * TODO: add fastboot compatibility
 *
 * #### Usage
 *
 * ```hbs
 *  <DummyArtwork @artwork={{artwork}} @artworkProfile="album" />
 * ```
 * or
 * ```hbs
 *  <DummyArtwork @artwork={{artwork}} @artworkProfile={{customProfile}} />
 * ```
 *
 * @class DummyArtwork
 * @module Components
 * @extends {Ember.Component}
 * @public
 */
export default Component.extend(InViewportMixin, {
    media: service(),

    tagName: 'div',
    classNameBindings: [
        'shouldLazyLoad:dummy-artwork--lazyload',
        'isDownloaded:dummy-artwork--downloaded'
    ],
    classNames: ['dummy-artwork', 'dummy-artwork--aspect-ratio'],
    'data-test-media-artwork': true,

    rootURL: ENV.rootURL,

    /**
     * Provide an `alt` attribute for the `<img>` tag. Default is an empty string.
     *
     * @property alt
     * @type String
     * @public
     */
    alt: '',

    /**
     * @property isDownloaded
     * @type {Boolean}
     * @default false
     * @public
     */
    isDownloaded: false,

    /**
     * @property lazyLoad
     * @type {Boolean}
     * @default true
     * @public
     */
    lazyLoad: true,

    /**
     * The value to be used for background-color CSS property
     * when addBgColor is true. This will override
     * any property included in the artwork data.
     * @property overrideBgColor
     * @type {String}
     * @public
     */
    overrideBgColor: null,

    /**
     * Indicates if a background color should be added to
     * display while loading
     *
     * @property addBgColor
     * @type {Boolean}
     * @public
     */
    addBgColor: true,

    /**
     *
     * @property userInitials
     * @type {String}
     * @public
     */
    userInitials: readOnly('actualArtwork.userInitials'),

    /**
     *
     * @property isFallbackArtwork
     * @type {Boolean}
     * @public
     */
    isFallbackArtwork: readOnly('actualArtwork.isFallback'),

    /**
     *
     * @property isUserMonogram
     * @type {Boolean}
     * @public
     */
    isUserMonogram: and('isFallbackArtwork', 'userInitials'),

    /**
     * @property shouldLazyLoad
     * @type {String|Number}
     * @public
     */
    shouldLazyLoad: computed('lazyLoad', 'isFallbackArtwork', function() {
        return this.lazyLoad && !this.isFallbackArtwork;
    }),

    /**
     * @property height
     * @type {String|Number}
     * @public
     */
    height: computed('profile', 'media.matches.[]', function() {
        const [viewport] = this.media.matches;
        return this.profile && this.profile[viewport].height;
    }),

    /**
     * @property width
     * @type {String|Number}
     * @public
     */
    width: computed('profile', 'media.matches.[]', function() {
        const [viewport] = this.media.matches;
        return this.profile && this.profile[viewport].width;
    }),

    /**
     * The background color inline style for the artwork.
     * This will be visible while the image is loading.
     *
     * @property bgColor
     * @type String
     * @public
     */
    bgColor: computed('actualArtwork.{bgColor,hasAlpha}', 'addBgColor', function() {
        if (!this.actualArtwork || this.actualArtwork.hasAlpha) {
            return htmlSafe('');
        }
        const { overrideBgColor, addBgColor } = this;
        const bgColor = overrideBgColor || this.actualArtwork.bgColor;
        if (addBgColor && bgColor) {
            return `#${bgColor}`;
        }
    }),

    imgBgColor: computed('bgColor', function() {
        if (this.bgColor) {
            return htmlSafe(`background-color: ${this.bgColor};`);
        }
    }),

    /**
     * This is the aspect ratio of the artwork itself, as opposed to the desired width/height
     * passed in by the consumer.
     *
     * @property aspectRatio The aspect ratio of the artwork from the server
     * @type Number
     * @private
     */
    aspectRatio: computed('width', 'height', function() {
        const { height, width } = this;
        return width / height;
    }),

    /**
     * This is the aspect ratio of the artwork itself, as opposed to the desired width/height
     * passed in by the consumer.
     *
     * @property mediaQueries The aspect ratio of the artwork from the server
     * @type number
     * @private
     */
    mediaQueries: computed('profiles', function() {
        return viewports.map(({ mediaQueryStrict, name }) =>
            `${mediaQueryStrict} ${this.profiles[name].width}px`
        ).join(', ');
    }),

    /**
     * An artworkProfile may be a string or object. So we ensure we return an object of viewports
     * e.g. { large: { height, width, crop }, medium: {}, small: {} }
     *
     * @property profile
     * @type Object
     * @public
     */
    profile: computed('artworkProfile', function() {
        let profile;
        if (typeof this.artworkProfile === 'string') {
            profile = artworkProfiles[this.artworkProfile];
        } else if (typeof this.artworkProfile === 'object') {
            profile = this.artworkProfile;
        }

        return profile;
    }),

    /**
     * @property profiles
     * @type Object
     * @public
     */
    profiles: computed('height', 'width', 'profile', function() {
        // eslint-disable-next-line arrow-body-style
        return viewports.reduce((acc, view) => {
            const { height, width, crop } = this.profile[view.name];
            acc[view.name] = { width, height, crop };
            return acc;
        }, {});
    }),

    /**
     * @property fileType
     * @type String
     * @public
     */
    fileType: computed('actualArtwork.hasAlpha', function() {
        return this.actualArtwork && this.actualArtwork.hasAlpha ? 'png' : 'jpg';
    }),

    /**
     * we render the fallback src directly in the image with no srcset
     *
     * @property fallbackSrc
     * @type String
     * @private
     */
    fallbackSrc: computed('actualArtwork.{url,urlDark,isFallback}', function() {
        const {
            actualArtwork: { url, isFallback = false }
        } = this;
        if (isFallback) {
            return url;
        }
    }),

    /**
     * we render the single src directly in the image with srcset
     *
     * @property isCloudArtwork
     * @type Boolean
     * @private
     */
    isCloudArtwork: readOnly('artwork.isCloudArtwork'),

    /**
     * @property srcset
     * @type String
     * @private
     */
    srcset: computed('actualArtwork.url', 'fileType', 'profiles', function() {
        const { actualArtwork: { url, isFallback = false } } = this;
        // bring back to [1, 2] after DEMOWARE
        return [1, 2].map(pixelDensity =>
            viewports.map(({ name }) => {
                const settings = assign({}, { fileType: this.fileType }, this.profiles[name]);
                // Build a srcset from patterned URL
                if (isFallback) {
                    return;
                }
                return buildSrcset(url, settings, pixelDensity);
            })
        ).join(', ');
    }),

    /**
     * @property adjustedHeight
     * @type String
     * @private
     */
    adjustedHeight: computed('aspectRatio', 'height', function() {
        return this.height; // fallback cases can go here
    }),

    /**
     * @property adjustedWidth
     * @type String
     * @private
     */
    adjustedWidth: computed('aspectRatio', 'width', function() {
        return this.width; // fallback cases can go here
    }),

    /**
     * We use a private property to abstract whether we are provided
     * a valid artwork object or are using a fallback, provided via
     * the `fallbackProfile` property.
     *
     * @property actualArtwork
     * @type Object
     * @private
    */
    actualArtwork: computed('artwork', 'fallbackArtwork', function() {
        const { url } = this.artwork || {};
        const { fallbackArtwork } = this;

        if (!url && fallbackArtwork) {
            return assign(
                {},
                fallbackArtwork,
                { isFallback: true }
            );
        }

        return this.artwork;
    }),

    /**
     * If the fallback profile provided exists, we find the corresponding
     * fallback artwork object from the app config. This is used whenever
     * the main artwork object is missing or invalid.
     *
     * @property fallbackArtwork
     * @type object
     * @private
    */
    fallbackArtwork: computed('fallbackProfile', function() {
        const { fallbackProfile } = this;
        if (typeof fallbackProfile === 'object') {
            return fallbackProfile;
        }
        const fallbackArtwork = artworkFallbacks[fallbackProfile];

        if (fallbackArtwork) {
            return fallbackArtwork;
        }

        return null;
    }),

    /**
     * Inline style to properly scale the img element.
     *
     * @property imgStyle
     * @type String
     * @public
     */
    imgStyle: computed('profiles', function() {
        return Object.keys(this.profiles).map(name => {
            const source = this.profiles[name];
            let style = '';
            if (source.width > 0) {
                style = `.${this.elementId}, #${this.elementId}::before {
                    width: ${source.width}px;
                    height: ${source.height}px;
                }
                .${this.elementId}::before {
                    padding-top: ${source.height / source.width * 100}%;
                }`;
            }

            if (source.mediaQuery && style.length > 0) {
                return `@media ${source.mediaQuery} {
                  ${style}
                }`;
            }

            return style;
        }).reverse().join('\n');
    }),

    didInsertElement() {
        if (this.lazyLoad) {
            // find distance of top left corner of artwork to bottom of screen. Shave off 50px so user has to scroll slightly to trigger load
            const { bottom } = this.element.getBoundingClientRect();
            const tolerance = bottom - window.innerHeight - this.element.offsetHeight - (50 * (1 + Math.random()));
            // margin for up/down and right/left scrolling
            set(this, 'viewportTolerance', { top: 200, right: 200, bottom: Math.abs(tolerance), left: 200 });
        }

        this._super(...arguments);
    },

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
    },

    /**
     * swap src and srset with data attributes that hold the real src
     *
     * @method _swapSource
     * @private
     */
    _swapSource() {
        const { lazyLoad, element, isDownloaded, isFallbackArtwork } = this;

        if (lazyLoad && element && !isDownloaded && !isFallbackArtwork) {
            const img = element.querySelector('img');
            if (img && img.dataset) {
                // happy path, no need for sad path b/c 1x1 pixel image is in place so no need for .onerror
                const imgLoad = () => {
                    if (this.isDestroyed || this.isDestroying) {
                        return;
                    }
                    set(this, 'isDownloaded', true);
                };
                img.onload = imgLoad;
                img.srcset = img.dataset.srcset;
            }
        }
    }
});
