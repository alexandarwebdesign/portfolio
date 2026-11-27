import type { ImageMetadata } from 'astro';
import birseCard from '../assets/images/birse-card-street.jpg';
import formaCard from '../assets/images/case/forma-card.jpg';
import tunoraCard from '../assets/images/case/tunora-card.jpg';
import swisCard from '../assets/images/swis-saas.jpg';
import homoNovusCard from '../assets/images/case/homo-novus-card.jpg';
import settleCard from '../assets/images/case/settle-card.jpg';

const bg = {
  hero: {
    eyebrow: 'Дизайн и изработка на уебсайтове',
    title: 'Красивото не стига.',
    lead: 'UX психология и прецизен UI в уебсайтове за малки и средни бизнеси. Визуално силни, създадени да работят.',
    cta: 'Започнете проект',
  },
  statement: {
    before: 'Правя уебсайтове за ',
    mark: 'малки и средни бизнеси',
    after: ', които изглеждат премиум и са направени да носят запитвания.',
  },
  work: {
    label: 'Избрани проекти',
    title: 'Работа, която стига до хората.',
    count: 'проекта',
  },
  industries: {
    label: 'Индустрии',
    items: [
      'Архитектура',
      'Бижута и онлайн търговия',
      'SaaS платформи',
      'Креативни студиа',
      'Лични портфолиа',
      'Недвижими имоти',
      'Технически продукти',
      'Брандинг',
    ],
  },
  services: {
    label: 'Услуги',
    title: ['От стратегията', 'до работещия сайт.'],
    cta: 'Да работим заедно',
    pick: 'Избери тази услуга',
  },
  process: {
    label: 'Процес',
    title: 'Три етапа, без изненади.',
    steps: [
      {
        title: 'Разбиране',
        text: 'Цели, бизнес и критерии за успех, после скелет на страниците и пътя на потребителя. Нищо не се проектира, преди проблемът да е ясен.',
      },
      {
        title: 'Дизайн и проучване',
        text: 'Проучване на потребителите и конкурентите, после детайлен дизайн във Figma за компютър и телефон. Корекции без ограничение до пълно одобрение.',
      },
      {
        title: 'Изработка и пускане',
        text: 'Код, точен до пиксел, точно както е проектиран. Сайтът е онлайн, с 30 дни безплатна поддръжка. Нищо не излиза без вашето одобрение.',
      },
    ],
  },
  cluster: {
    title: 'Да превърнем идеята ви в работещ сайт.',
    cta: 'Да поговорим',
  },
  about: {
    label: 'За мен',
    title: 'Дизайн, който работи с хората.',
    text: 'Аз съм Александър – UX/UI дизайнер и уеб разработчик от София, работя с клиенти от цял свят. Годините в UX/UI ме научиха, че дизайнът е за това как хората се държат, не само как нещата изглеждат.',
    link: 'Цялата история',
    alt: 'Александър Павлов, UX/UI дизайнер и уеб разработчик',
  },
  faq: {
    label: 'Въпроси',
    title: 'Въпроси и отговори.',
  },
  contact: {
    label: 'Контакт',
    title: ['Имате проект', 'наум?'],
    reply: 'Отговарям до 24 часа.',
    email: 'Предпочитате имейл?',
  },
};

const en: typeof bg = {
  hero: {
    eyebrow: 'Website design & development',
    title: 'Pretty Isn’t Enough.',
    lead: 'UX psychology meets precise UI craft – websites for small and medium businesses. Visually powerful, built to perform.',
    cta: 'Start a Project',
  },
  statement: {
    before: 'I build websites for ',
    mark: 'small and medium businesses',
    after: ' that look premium and are made to bring inquiries.',
  },
  work: {
    label: 'Selected work',
    title: 'Work that ships.',
    count: 'Projects',
  },
  industries: {
    label: 'Industries',
    items: [
      'Architecture',
      'Jewelry & e-commerce',
      'SaaS platforms',
      'Creative studios',
      'Personal portfolios',
      'Real estate',
      'Technical products',
      'Branding',
    ],
  },
  services: {
    label: 'Services',
    title: ['From strategy', 'to live site.'],
    cta: 'Let’s work together',
    pick: 'Choose this service',
  },
  process: {
    label: 'Process',
    title: 'Three stages, no surprises.',
    // Draft: translated from the Bulgarian steps, waiting for approval.
    steps: [
      {
        title: 'Understanding',
        text: 'Goals, business and success criteria, then the skeleton of the pages and the user’s path. Nothing is designed before the problem is clear.',
      },
      {
        title: 'Design and research',
        text: 'Research into users and competitors, then detailed design in Figma for desktop and phone. Unlimited revisions until it is fully approved.',
      },
      {
        title: 'Build and launch',
        text: 'Code accurate to the pixel, exactly as designed. The site goes live with 30 days of free support. Nothing ships without your approval.',
      },
    ],
  },
  cluster: {
    title: 'Let’s turn your idea into a working website.',
    cta: 'Let’s talk',
  },
  about: {
    label: 'About',
    title: 'Design that works on people.',
    text: 'I’m Aleksandar – a UX/UI designer and web developer based in Sofia, Bulgaria, working with clients worldwide. Years in UX/UI taught me that design is about how people behave, not just how things look.',
    link: 'The full story',
    alt: 'Aleksandar Pavlov, UX/UI designer and web developer',
  },
  faq: {
    label: 'FAQ',
    title: 'Questions, answered.',
  },
  contact: {
    label: 'Contact',
    title: ['Have a project', 'in mind?'],
    reply: 'I reply within 24 hours.',
    email: 'Prefer email?',
  },
};

export const home = { bg, en };

export interface WorkItem {
  name: string;
  category: { bg: string; en: string };
  image: ImageMetadata;
  /** Route id of the case study; projects without one show their status. */
  route?: 'birse' | 'forma' | 'tunora';
  /** A live site of its own, for work without a case study page. */
  url?: string;
  status?: { bg: string; en: string };
  /** Corner tag on the card, e.g. self-initiated work. */
  tag?: { bg: string; en: string };
}

export const work: WorkItem[] = [
  {
    name: 'Birsé',
    category: { bg: 'Онлайн магазин · бижута', en: 'E-commerce · Jewelry' },
    image: birseCard,
    route: 'birse',
  },
  {
    name: 'FORMA Architects',
    category: { bg: 'Архитектура · луксозен сайт', en: 'Architecture · Luxury website' },
    image: formaCard,
    route: 'forma',
    tag: { bg: 'Концепция', en: 'Concept' },
  },
  {
    name: 'Tunora',
    category: { bg: 'Софтуер · уиджет за Windows', en: 'Software · Windows widget' },
    image: tunoraCard,
    route: 'tunora',
    tag: { bg: 'Собствен продукт', en: 'Own product' },
  },
  {
    name: 'Homo Novus',
    category: {
      bg: 'Изследване на WebGL · жива ДНК спирала',
      en: 'Exploring WebGL · A living DNA helix',
    },
    image: homoNovusCard,
    url: 'https://homo-novus.pages.dev/',
    tag: { bg: 'Творчески експеримент', en: 'Creative experiment' },
  },
  {
    name: 'Settle',
    category: {
      bg: 'Изследване на WebGL · от хаос към ред',
      en: 'Exploring WebGL · From noise to order',
    },
    image: settleCard,
    url: 'https://settle-cfm.pages.dev/',
    tag: { bg: 'Творчески експеримент', en: 'Creative experiment' },
  },
  {
    name: 'Swis SaaS',
    category: { bg: 'SaaS · платформа', en: 'SaaS · Platform' },
    image: swisCard,
    status: { bg: 'В разработка', en: 'In development' },
  },
];
