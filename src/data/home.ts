import type { ImageMetadata } from 'astro';
import birseCard from '../assets/images/birse-card.jpg';
import formaCard from '../assets/images/forma-card.jpg';
import swisCard from '../assets/images/swis-saas.jpg';
import creativeCard from '../assets/images/creative-asset.jpg';

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
    // EN steps are drafts waiting for approval, so the section shows in BG only.
    steps: [
      {
        title: 'Разбиране',
        text: 'Цели, потребители и критерии за успех, после скелет на страниците и пътя на потребителя. Нищо не се проектира, преди проблемът да е ясен.',
      },
      {
        title: 'Дизайн и проучване',
        text: 'Детайлен дизайн във Figma за компютър и телефон. Корекции без ограничение до пълно одобрение.',
      },
      {
        title: 'Изработка и пускане',
        text: 'Код, точен до пиксел, точно както е проектиран. Сайтът е онлайн, с 30 дни безплатна поддръжка. Нищо не излиза без вашето одобрение.',
      },
    ] as { title: string; text: string }[] | undefined,
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
    lead: 'Разкажете ми какво изграждате. Ще ви кажа точно как бих подходил.',
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
    steps: undefined,
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
    lead: 'Tell me what you’re building. I’ll tell you exactly how I’d approach it.',
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
  route?: 'birse' | 'forma';
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
    name: 'Swis SaaS',
    category: { bg: 'SaaS · платформа', en: 'SaaS · Platform' },
    image: swisCard,
    status: { bg: 'В разработка', en: 'In development' },
  },
  {
    name: 'Creative Asset',
    category: { bg: '3D · интерактивно', en: '3D · Interactive' },
    image: creativeCard,
    status: { bg: 'Предстои', en: 'Upcoming' },
  },
];
