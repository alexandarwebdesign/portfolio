import type { Lang } from './ui';

/**
 * Every page and its URL per language. The single source for the language
 * switch, canonical and hreflang. A page missing a language has no pair.
 */
export const routes = {
  home: { bg: '/', en: '/en' },
  about: { bg: '/about', en: '/en/about' },
  forma: { bg: '/forma-architects', en: '/en/forma-architects' },
  birse: { bg: '/birse', en: '/en/birse' },
  tunora: { bg: '/tunora', en: '/en/tunora' },
  privacy: { bg: '/privacy', en: '/en/privacy' },
  notFound: { bg: '/404', en: '/en/404' },
} satisfies Record<string, Partial<Record<Lang, string>>>;

export type RouteId = keyof typeof routes;

export function pathFor(route: RouteId, lang: Lang): string | undefined {
  const paths: Partial<Record<Lang, string>> = routes[route];
  return paths[lang];
}
