import type { CaseContent } from './types';
import hero from '../../assets/images/case/tunora-hero.jpg';

const live = 'https://tunora-site.pages.dev/';

// Only what the page shell and the machine-readable files need; the page itself
// reads its text from case-copy.ts.
const bg: CaseContent = {
  meta: {
    title: 'Tunora – сайт за собствен продукт за Windows | Александър Павлов',
    description:
      'Собствен продукт: уиджет за музика за Windows и сайтът му. Продуктов дизайн, UI дизайн и изработка на страница, която показва продукта в действие и казва ясно какво се случва с данните.',
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
    title: 'Tunora – Website for My Own Windows Product | Aleksandar Pavlov',
    description:
      'My own product: a now-playing widget for Windows and its website. Product design, UI design and development of a page that shows the product at work and says plainly what happens to your data.',
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
