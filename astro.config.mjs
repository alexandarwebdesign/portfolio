// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Latin and Cyrillic files of each family; unicode-range lets the browser
// download only the scripts a page actually uses.
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const CYRILLIC = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';

export default defineConfig({
  site: 'https://aleksandarpavlov.com',
  trailingSlash: 'never',
  // Lossless whitespace handling: v7's default 'jsx' mode drops the space at a
  // line break before an inline element, which Prettier's line wrapping creates.
  compressHTML: true,
  build: {
    format: 'file',
  },
  // hreflang lives in each page's <head>; the sitemap only lists indexable URLs.
  integrations: [
    sitemap({
      filter: (page) => !/\/404$|\/styleguide$/.test(page),
    }),
  ],
  // A <meta> CSP with hashes of every inline script and style. Inline style
  // attributes (the UX note marker positions) are allowed on style-src-attr only.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self' https://api.web3forms.com",
        'form-action https://api.web3forms.com',
        "base-uri 'self'",
        "object-src 'none'",
      ],
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  i18n: {
    defaultLocale: 'bg',
    locales: ['bg', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      name: 'Forum',
      cssVariable: '--font-forum',
      provider: fontProviders.local(),
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/forum-latin.woff2'],
            weight: 400,
            style: 'normal',
            unicodeRange: [LATIN],
          },
          {
            src: ['./src/assets/fonts/forum-cyrillic.woff2'],
            weight: 400,
            style: 'normal',
            unicodeRange: [CYRILLIC],
          },
        ],
      },
    },
    {
      name: 'Manrope',
      cssVariable: '--font-manrope',
      provider: fontProviders.local(),
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/manrope-latin.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: [LATIN],
          },
          {
            src: ['./src/assets/fonts/manrope-cyrillic.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: [CYRILLIC],
          },
        ],
      },
    },
  ],
});
