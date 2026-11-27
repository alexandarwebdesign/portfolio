// The services page (/uslugi, /en/services): web design in Sofia. The facts (timeline, revisions,
// support, process) are the ones the home page states; no prices on purpose.
const bg = {
  meta: {
    title: 'Уеб дизайн и изработка на сайтове в София | Александър Павлов',
    description:
      'Изработка на уебсайтове за малки и средни бизнеси в София: UX дизайн и прецизен код, готови за 2–4 седмици, с 30 дни безплатна поддръжка.',
  },
  crumb: 'Услуги',
  hero: {
    label: 'Услуги',
    title: 'Уеб дизайн и изработка на сайтове в София',
    lead: 'Проектирам и изработвам уебсайтове за малки и средни бизнеси: проучване, дизайн във Figma за компютър и телефон, после код, точен до пиксел. Работя от София, с клиенти от цял свят.',
    cta: 'Започнете проект',
  },
  problem: {
    label: 'За кого',
    title: 'Познато ли ви е?',
    items: [
      'Нямате сайт, или сайтът е отпреди години и не се отваря добре на телефон.',
      'Клиентите ви питат за цени и работно време, които са написани някъде, но никой не ги намира.',
      'Конкурентът ви излиза пръв в Google, а вие не излизате никъде.',
    ],
  },
  includes: {
    label: 'Какво включва',
    title: 'Какво получавате',
    items: [
      { title: 'Дизайн по мярка', text: 'Не шаблон с вашето лого.' },
      {
        title: 'Компютър и телефон',
        text: 'Всяка страница е проектирана и за двата. Повечето хора ви търсят от телефона.',
      },
      {
        title: 'Бързо зареждане и основно SEO',
        text: 'За да ви намират по вашата услуга и вашия град.',
      },
      {
        title: 'Корекции без ограничение',
        text: 'По време на дизайна, до пълно одобрение. Нищо не излиза без вас.',
      },
      {
        title: 'Ясен срок',
        text: 'Лендинг страница за 1–2 седмици, сайт с повече страници за 3–4.',
      },
      { title: '30 дни поддръжка', text: 'Безплатна, след като сайтът е онлайн.' },
    ],
  },
  offer: { label: 'Услуги', title: 'Три начина да работим' },
  work: { label: 'Проекти', title: 'Вижте как работя' },
  faq: {
    label: 'Въпроси',
    title: 'Преди да започнем.',
    items: [
      { q: 'Кой е собственик на сайта?', a: 'Вие. Домейнът е на ваше име.' },
      {
        q: 'Имам ли нужда от текстове и снимки?',
        a: 'Ако нямате, помагам със структурата и текста. Собствените снимки работят най-добре.',
      },
      {
        q: 'Ще излизам ли първи в Google?',
        a: 'Не мога да обещая позиция, никой честен човек не може. Правя сайта с най-добрите шансове и ви показвам какво да правите след това.',
      },
    ],
  },
  contact: { subject: 'Ново запитване от /uslugi' },
};

const en: typeof bg = {
  meta: {
    title: 'Web Design & Development in Sofia | Aleksandar Pavlov',
    description:
      'Websites for small and medium businesses, designed and built in Sofia: UX design and precise code, live in 2–4 weeks, with 30 days of free support.',
  },
  crumb: 'Services',
  hero: {
    label: 'Services',
    title: 'Web design and development in Sofia',
    lead: 'I design and build websites for small and medium businesses: research, design in Figma for desktop and phone, then code accurate to the pixel. Based in Sofia, working with clients worldwide.',
    cta: 'Start a Project',
  },
  problem: {
    label: 'Who it’s for',
    title: 'Sound familiar?',
    items: [
      'You have no website, or it is years old and does not open well on a phone.',
      'Customers ask about prices and opening hours that are written somewhere, but nobody can find them.',
      'Your competitor comes first on Google, and you do not show up at all.',
    ],
  },
  includes: {
    label: 'What’s included',
    title: 'What you get',
    items: [
      { title: 'Custom design', text: 'Not a template with your logo.' },
      {
        title: 'Desktop and phone',
        text: 'Every page is designed for both. Most people look for you on their phone.',
      },
      {
        title: 'Fast loading and essential SEO',
        text: 'So you are found for your service and your city.',
      },
      {
        title: 'Unlimited revisions',
        text: 'During design, until it is fully approved. Nothing ships without you.',
      },
      {
        title: 'A clear timeline',
        text: 'A landing page in 1–2 weeks, a multi-page website in 3–4.',
      },
      { title: '30 days of support', text: 'Free, once the site is live.' },
    ],
  },
  offer: { label: 'Services', title: 'Three ways to work together' },
  work: { label: 'Work', title: 'See how I work' },
  faq: {
    label: 'FAQ',
    title: 'Before we start.',
    items: [
      { q: 'Who owns the website?', a: 'You do. The domain is in your name.' },
      {
        q: 'Do I need my own text and photos?',
        a: 'If you have none, I help with the structure and the text. Your own photos work best.',
      },
      {
        q: 'Will I come first on Google?',
        a: 'I can’t promise a position, and no honest person can. I build the site to give it the best chance and show you what to do next.',
      },
    ],
  },
  contact: { subject: 'New enquiry from /en/services' },
};

export const servicesPage = { bg, en };
