import type { ImageMetadata } from 'astro';
import birseCard from '../assets/images/birse-card.jpg';
import formaCard from '../assets/images/forma-card.jpg';
import swisCard from '../assets/images/swis-saas.jpg';
import creativeCard from '../assets/images/creative-asset.jpg';

const bg = {
  hero: {
    eyebrow: 'Дизайн и изработка на уебсайтове',
    title: ['Красивото', 'не стига.'],
    lead: 'UX психология и прецизен UI, приложени изцяло към уебсайтове. Сайтове, които впечатляват и работят – за бизнеси, които искат клиенти, а не просто визия.',
    work: 'Вижте проектите',
    facts: [
      'UX/UI дизайнер и уеб разработчик',
      'София · работя с клиенти от цял свят',
      'Приемам нови проекти',
    ],
  },
  work: {
    label: 'Избрани проекти',
    title: 'Работа, която стига до хората.',
    open: 'Вижте проекта',
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
  },
  process: {
    label: 'Процес',
    title: 'Пет етапа, без изненади.',
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
    lead: 'Три кратки въпроса и имейл – под минута. Ще ви кажа точно как бих подходил.',
    reply: 'Отговарям до 24 часа.',
    email: 'Предпочитате имейл?',
  },
};

const en: typeof bg = {
  hero: {
    eyebrow: 'Website design & development',
    title: ['Pretty isn’t', 'enough.'],
    lead: 'UX psychology meets precise UI craft – applied entirely to websites. Sites that look striking and do their job, for businesses that want clients, not just visuals.',
    work: 'See the work',
    facts: ['UX/UI designer & web developer', 'Sofia · working worldwide', 'Taking new projects'],
  },
  work: {
    label: 'Selected work',
    title: 'Work that ships.',
    open: 'View project',
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
  },
  process: {
    label: 'Process',
    title: 'Five stages, no surprises.',
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
    lead: 'Three quick questions and your email – under a minute. I’ll tell you exactly how I’d approach it.',
    reply: 'I reply within 24 hours.',
    email: 'Prefer email?',
  },
};

export const home = { bg, en };

export interface WorkItem {
  name: string;
  category: { bg: string; en: string };
  year: string;
  image: ImageMetadata;
  /** Route id of the case study; projects without one show their status. */
  route?: 'birse' | 'forma';
  status?: { bg: string; en: string };
}

export const work: WorkItem[] = [
  {
    name: 'Birsé',
    category: { bg: 'Онлайн магазин · бижута', en: 'E-commerce · Jewelry' },
    year: '2026',
    image: birseCard,
    route: 'birse',
  },
  {
    name: 'FORMA Architects',
    category: { bg: 'Архитектура · концепция', en: 'Architecture · Concept' },
    year: '2026',
    image: formaCard,
    route: 'forma',
  },
  {
    name: 'Swis SaaS',
    category: { bg: 'SaaS · платформа', en: 'SaaS · Platform' },
    year: '2026',
    image: swisCard,
    status: { bg: 'В разработка', en: 'In development' },
  },
  {
    name: 'Creative Asset',
    category: { bg: '3D · интерактивно', en: '3D · Interactive' },
    year: '2026',
    image: creativeCard,
    status: { bg: 'Предстои', en: 'Upcoming' },
  },
];
