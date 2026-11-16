// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aleksandarpavlov.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    defaultLocale: 'bg',
    locales: ['bg', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
