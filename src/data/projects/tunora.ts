import type { CaseContent } from './types';
import hero from '../../assets/images/case/tunora-hero.jpg';

const live = 'https://tunora-site.pages.dev/';

// Only what the page shell and the machine-readable files need; the page itself
// reads its text from case-copy.ts.
const bg: CaseContent = {
  meta: {
    title: 'Tunora – сайт на мой продукт за Windows | Александър Павлов',
    description:
      'Собствен продукт: уиджет за музика за Windows и сайтът му. Продуктов и UI дизайн и изработка на страница, която показва продукта и казва какво става с данните.',
  },
  name: 'Tunora',
  status: 'Собствен продукт',
  lead: 'Малък уиджет за Windows, който показва и управлява музиката, която свири, и сайтът, който го представя. Проектирал и изработил съм и двете.',
  facts: [],
  hero: { image: hero, alt: 'Първият екран на сайта на Tunora' },
  live: { href: live, label: 'Вижте сайта' },
  chapters: [],
  next: { route: 'birse', name: 'Birsé' },
};

const en: CaseContent = {
  meta: {
    title: 'Tunora – Site for My Windows Product | Aleksandar Pavlov',
    description:
      'My own product: a now-playing widget for Windows and its website. Product design, UI and development of a page that shows it and says what happens to your data.',
  },
  name: 'Tunora',
  status: 'Own product',
  lead: 'A small Windows widget that shows and controls whatever music is playing, and the website that presents it. I designed and built both.',
  facts: [],
  hero: { image: hero, alt: 'The first screen of the Tunora website' },
  live: { href: live, label: 'View the site' },
  chapters: [],
  next: { route: 'birse', name: 'Birsé' },
};

export const tunora = { bg, en };
