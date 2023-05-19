import ENV from 'test-app/config/environment';

export const artworkProfiles = {
  dummy: {
    jumbo: { width: 300, height: 300 },
    desktop: { width: 300, height: 300 },
    tablet: { width: 200, height: 200 },
    mobile: { width: 100, height: 100 },
  },
};

export const artworkFallbacks = {
  'missing-artwork': {
    isVector: true,
    url: `${ENV.rootURL}assets/missing-artwork.svg`,
    aspectRatio: 1,
  },
};

export const viewports = [
  {
    mediaQuery: null,
    mediaQueryStrict: '(max-width:500px)',
    name: 'mobile',
  },
  {
    mediaQuery: '(min-width:750px)',
    mediaQueryStrict: '(min-width:1000px) and (max-width:1319px)',
    name: 'tablet',
  },
  {
    mediaQuery: '(min-width:1000px)',
    mediaQueryStrict: '',
    name: 'desktop',
  },
  {
    mediaQuery: '(min-width:1320px)',
    mediaQueryStrict: '',
    name: 'jumbo',
  },
];
