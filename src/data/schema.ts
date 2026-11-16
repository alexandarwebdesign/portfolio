import { site } from './site';
import { services } from './services';
import { faq } from './faq';
import { uslugi } from './uslugi';
import type { CaseContent } from './projects/types';
import type { Lang } from '../i18n/ui';

// JSON-LD nodes, linked by @id. Seo.astro adds WebSite, Person and the page's
// breadcrumb to every page; pages pass the nodes that are specific to them.

type Node = Record<string, unknown>;

const abs = (path: string) => new URL(path, site.url).href;

export const ids = {
  website: abs('/#website'),
  person: abs('/#person'),
  service: abs('/#service'),
};

export function website(lang: Lang): Node {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: abs('/'),
    name: site.name[lang],
    inLanguage: ['bg', 'en'],
    publisher: { '@id': ids.person },
  };
}

export function person(lang: Lang, image: string): Node {
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name.en,
    alternateName: site.name.bg,
    jobTitle: lang === 'bg' ? 'UX/UI дизайнер и уеб разработчик' : 'UX/UI Designer & Web Developer',
    url: abs('/'),
    email: site.email,
    image: abs(image),
    address: { '@type': 'PostalAddress', addressLocality: 'Sofia', addressCountry: 'BG' },
    knowsLanguage: ['bg', 'en'],
    knowsAbout: [
      'UX Design',
      'UI Design',
      'Web Design',
      'Web Development',
      'Conversion Rate Optimisation',
      'Interface Psychology',
      'Information Architecture',
      'Figma',
    ],
    sameAs: site.social.map((s) => s.url),
  };
}

export function breadcrumb(lang: Lang, home: string, name: string, path: string): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'bg' ? 'Начало' : 'Home',
        item: abs(home),
      },
      { '@type': 'ListItem', position: 2, name, item: abs(path) },
    ],
  };
}

function faqPage(lang: Lang, items: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function homeSchema(lang: Lang, path: string): Node[] {
  return [
    {
      '@type': 'ProfessionalService',
      '@id': ids.service,
      name: site.name[lang],
      url: abs(path),
      email: site.email,
      image: abs('/og-image.jpg'),
      founder: { '@id': ids.person },
      foundingDate: '2023',
      address: { '@type': 'PostalAddress', addressLocality: 'Sofia', addressCountry: 'BG' },
      areaServed: 'Worldwide',
      availableLanguage: ['bg', 'en'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: lang === 'bg' ? 'Услуги' : 'Services',
        itemListElement: services[lang].map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service.title, description: service.text },
        })),
      },
    },
    faqPage(lang, faq[lang]),
  ];
}

export function aboutSchema(lang: Lang, path: string): Node[] {
  return [
    {
      '@type': 'ProfilePage',
      url: abs(path),
      inLanguage: lang,
      mainEntity: { '@id': ids.person },
    },
  ];
}

const published: Record<string, string> = { birse: '2026-03-01', forma: '2026-03-01' };

export function caseSchema(
  lang: Lang,
  route: 'birse' | 'forma',
  path: string,
  content: CaseContent,
  image: string,
): Node[] {
  const nodes: Node[] = [
    {
      '@type': 'CreativeWork',
      name: content.name,
      headline: content.meta.title,
      description: content.meta.description,
      url: abs(path),
      inLanguage: lang,
      image: abs(image),
      author: { '@id': ids.person },
      creator: { '@id': ids.person },
      datePublished: published[route],
      dateCreated: '2026',
      creativeWorkStatus: content.status,
      sameAs: content.live.href,
    },
  ];
  for (const chapter of content.chapters) {
    for (const figure of chapter.figures ?? []) {
      if (figure.kind !== 'video') continue;
      nodes.push({
        '@type': 'VideoObject',
        name: figure.label,
        description: figure.label,
        inLanguage: lang,
        thumbnailUrl: abs(`${figure.src}-poster.webp`),
        contentUrl: abs(`${figure.src}.h264.mp4`),
        uploadDate: published[route],
        duration: figure.duration,
        author: { '@id': ids.person },
      });
    }
  }
  return nodes;
}

export function uslugiSchema(path: string): Node[] {
  return [
    {
      '@type': 'ProfessionalService',
      '@id': abs(`${path}#service`),
      name: uslugi.hero.eyebrow,
      description: uslugi.meta.description,
      url: abs(path),
      inLanguage: 'bg',
      provider: { '@id': ids.person },
      areaServed: { '@type': 'Country', name: 'Bulgaria' },
      email: site.email,
      makesOffer: uslugi.prices.items.map((item, i) => ({
        '@type': 'Offer',
        name: item.title,
        // The first two are starting prices; the last one is monthly.
        priceSpecification:
          i < 2
            ? { '@type': 'PriceSpecification', minPrice: item.amount, priceCurrency: 'EUR' }
            : {
                '@type': 'UnitPriceSpecification',
                price: item.amount,
                priceCurrency: 'EUR',
                unitText: 'MON',
              },
      })),
    },
    faqPage('bg', uslugi.faq.items),
  ];
}
