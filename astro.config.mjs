// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';


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
      filter: (page) => !page.endsWith('/404'),
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
});
