export const languages = ['bg', 'en'] as const;
export type Lang = (typeof languages)[number];

export function toLang(locale: string | undefined): Lang {
  return locale === 'en' ? 'en' : 'bg';
}

const bg = {
  skip: 'Към съдържанието',
  nav: {
    label: 'Основна навигация',
    work: 'Проекти',
    about: 'За мен',
    services: 'Услуги',
    contact: 'Контакт',
    home: 'Начало',
  },
  cta: 'Безплатна консултация',
  site: {
    letsTalk: 'Да поговорим',
    openMenu: 'Отвори менюто',
    closeMenu: 'Затвори менюто',
    menuLabel: 'Меню за навигация',
    marquee: 'Концепции на сайтове, които съм проектирал',
    selectedWork: 'Избрани проекти',
    viewCase: 'Вижте проекта',
    services: 'Уебсайт за вашия бизнес',
    faqAsk: { text: 'Не намирате отговор?', link: 'Пишете ми директно' },
    followX: 'Профил в X',
    followDribbble: 'Профил в Dribbble',
    followLinkedIn: 'Профил в LinkedIn',
    emailTo: 'Пишете ми по имейл',
  },
  form: {
    label: 'Форма за контакт',
    name: 'Име и фамилия',
    email: 'Имейл',
    namePlaceholder: 'Иван Петров',
    emailPlaceholder: 'ivan@firma.bg',
    service: 'От какво имате нужда?',
    servicePlaceholder: 'Изберете услуга (по желание)',
    message: 'Разкажете ми за проекта',
    messagePlaceholder:
      'Напр. нов сайт за зъболекарски кабинет, нужен до март. Логото е готово, текстове няма.',
    send: 'Изпрати съобщението',
    helper: 'Отговарям лично, обикновено до 24 часа. Без ангажимент.',
    sending: 'Изпращам съобщението…',
    sent: 'Изпратено',
    success: 'Съобщението е изпратено. Ще ви отговоря до 24 часа.',
    failed: 'Нещо се обърка. Опитайте пак или ми пишете директно на имейла.',
    fixOne: 'Поправете 1 поле по-горе.',
    fixMany: 'Поправете {n} полета по-горе.',
    errors: {
      name: 'Въведете името си.',
      email: 'Въведете валиден имейл.',
      message: 'Напишете малко повече – поне 10 знака, за да ви отговоря смислено.',
    },
    subject: 'Ново запитване от портфолиото',
    from: 'Форма за контакт в портфолиото',
  },
  caseStudy: {
    allWork: 'Всички проекти',
    chapters: 'Глави',
    next: 'Следващ проект',
    cta: 'Искате нещо подобно?',
  },
  footer: {
    title: 'Да работим заедно',
    location: 'София, България – работя с клиенти от цял свят',
    role: 'UX/UI дизайнер и уеб разработчик',
    social: 'Профили',
    privacy: 'Поверителност',
  },
  meta: {
    home: {
      title: 'UX/UI дизайнер и уеб разработчик в София | Александър Павлов',
      description:
        'UX/UI специалист, който превръща психологията на интерфейса в сайтове, които продават. Красиви, доказано работещи и направени да траят. София, България.',
    },
    about: {
      title: 'За мен – Александър Павлов | UX/UI дизайнер и уеб разработчик',
      description:
        'Александър Павлов – UX/UI дизайнер и уеб разработчик от България, работи с клиенти от цял свят. От първата идея до работещия сайт.',
    },
    privacy: {
      title: 'Поверителност | Александър Павлов',
      description:
        'Какви данни събира този сайт, защо и как да поискате да ги видите, поправите или изтриете.',
    },
    notFound: {
      title: '404 – Страницата не е намерена | Александър Павлов',
      description: 'Страницата не е намерена. Върнете се към портфолиото на Александър Павлов.',
    },
  },
};

const en: typeof bg = {
  skip: 'Skip to content',
  nav: {
    label: 'Main navigation',
    work: 'Work',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    home: 'Home',
  },
  cta: 'Free consultation',
  site: {
    letsTalk: 'Let’s Talk',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuLabel: 'Navigation menu',
    marquee: 'Website concepts I have designed',
    selectedWork: 'Selected work',
    viewCase: 'View case study',
    services: 'A website for your business',
    faqAsk: { text: 'Can’t find an answer?', link: 'Write to me directly' },
    followX: 'Follow on X (Twitter)',
    followDribbble: 'Follow on Dribbble',
    followLinkedIn: 'Connect on LinkedIn',
    emailTo: 'Send email to Aleksandar',
  },
  form: {
    label: 'Contact form',
    name: 'Full name',
    email: 'Email',
    namePlaceholder: 'Jane Smith',
    emailPlaceholder: 'jane@company.com',
    service: 'What do you need?',
    servicePlaceholder: 'Choose a service (optional)',
    message: 'Tell me about your project',
    messagePlaceholder:
      'E.g. A new website for my dental clinic, needed by March. The logo is ready, the text is not.',
    send: 'Send Message',
    helper: 'I reply personally, usually within 24 hours. No commitment.',
    sending: 'Sending your message…',
    sent: 'Message sent',
    success: 'Message sent. I’ll reply within 24 hours.',
    failed: 'Something went wrong. Please try again or email me directly.',
    fixOne: 'Please correct 1 field above.',
    fixMany: 'Please correct {n} fields above.',
    errors: {
      name: 'Please enter your full name.',
      email: 'Please enter a valid email address.',
      message: 'Tell me a little more - 10+ characters helps me reply usefully.',
    },
    subject: 'New Project Inquiry from Portfolio',
    from: 'Portfolio Contact Form',
  },
  caseStudy: {
    allWork: 'All work',
    chapters: 'Chapters',
    next: 'Next project',
    cta: 'Want something built like this?',
  },
  footer: {
    title: 'Let’s work together',
    location: 'Based in Sofia, Bulgaria – working worldwide',
    role: 'UX/UI Designer & Website Developer',
    social: 'Profiles',
    privacy: 'Privacy',
  },
  meta: {
    home: {
      title: 'UX/UI Designer & Web Developer in Sofia | Aleksandar Pavlov',
      description:
        'UX/UI specialist turning interface psychology into websites that convert. Beautiful, proven to work, and built to last. Based in Sofia, Bulgaria.',
    },
    about: {
      title: 'About – Aleksandar Pavlov | UX/UI Designer & Website Developer',
      description:
        'About Aleksandar Pavlov – UX/UI designer and website developer based in Bulgaria, working with clients worldwide. From first concept to live site.',
    },
    privacy: {
      title: 'Privacy | Aleksandar Pavlov',
      description:
        'What data this site collects, why, and how to ask to see, correct or delete it.',
    },
    notFound: {
      title: '404 – Page not found | Aleksandar Pavlov',
      description: 'Page not found. Return to Aleksandar Pavlov’s portfolio.',
    },
  },
};

export const ui: Record<Lang, typeof bg> = { bg, en };
