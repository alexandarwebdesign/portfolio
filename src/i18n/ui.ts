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
    menu: 'Меню',
  },
  cta: 'Безплатна консултация',
  brief: {
    label: 'Кратко запитване',
    step: 'Стъпка',
    of: 'от',
    next: 'Напред',
    back: 'Назад',
    send: 'Изпрати запитването',
    sending: 'Изпращане…',
    edit: 'Промени',
    required: 'Изберете един отговор.',
    type: {
      legend: 'Какъв сайт ви трябва?',
      options: ['Лендинг страница', 'Фирмен сайт', 'Онлайн магазин', 'Редизайн', 'Друго'],
    },
    timeline: {
      legend: 'Кога трябва да е готов?',
      options: ['До 2 седмици', 'До месец', '1–3 месеца', 'Нямам срок'],
    },
    budget: {
      legend: 'Какъв е бюджетът?',
      options: ['До 1 000 €', '1 000 – 2 500 €', '2 500 – 5 000 €', 'Над 5 000 €', 'Още не знам'],
    },
    details: {
      legend: 'Как да се свържа с вас?',
      email: 'Имейл',
      phone: 'Телефон (по желание)',
      emailError: 'Въведете имейл, например ime@firma.bg.',
      message: 'Нещо, което да знам (по желание)',
      hint: 'Сайт, който ви харесва, срок, идея – каквото е важно.',
    },
    summary: 'Вашето запитване',
    privacy: 'Използвам данните ви само за да ви отговоря.',
    success: 'Благодаря! Получих запитването и ще ви пиша до 24 часа.',
    error: 'Не успях да изпратя запитването. Опитайте пак или пишете на',
    subject: 'Ново запитване от сайта',
  },
  caseStudy: {
    allWork: 'Всички проекти',
    chapters: 'Глави',
    showNotes: 'Покажи UX решенията',
    note: 'Бележка',
    problem: 'Проблем',
    solution: 'Решение',
    why: 'Защо',
    next: 'Следващ проект',
    cta: 'Искате нещо подобно?',
  },
  footer: {
    next: 'Следваща стъпка',
    title: 'Да работим заедно',
    location: 'София, България – работя с клиенти от цял свят',
    role: 'UX/UI дизайнер и уеб разработчик',
    social: 'Профили',
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
    menu: 'Menu',
  },
  cta: 'Free consultation',
  brief: {
    label: 'Quick brief',
    step: 'Step',
    of: 'of',
    next: 'Next',
    back: 'Back',
    send: 'Send brief',
    sending: 'Sending…',
    edit: 'Change',
    required: 'Choose one answer.',
    type: {
      legend: 'What do you need?',
      options: ['Landing page', 'Business website', 'Online store', 'Redesign', 'Something else'],
    },
    timeline: {
      legend: 'When should it be ready?',
      options: ['Within 2 weeks', 'Within a month', '1–3 months', 'No deadline'],
    },
    budget: {
      legend: 'What is your budget?',
      options: ['Under €1,000', '€1,000 – 2,500', '€2,500 – 5,000', 'Over €5,000', 'Not sure yet'],
    },
    details: {
      legend: 'How can I reach you?',
      email: 'Email',
      phone: 'Phone (optional)',
      emailError: 'Enter an email address, like name@company.com.',
      message: 'Anything I should know (optional)',
      hint: 'A site you like, a deadline, an idea – whatever matters.',
    },
    summary: 'Your brief',
    privacy: 'I only use your details to reply to you.',
    success: 'Thank you! I got your brief and will reply within 24 hours.',
    error: 'The brief couldn’t be sent. Try again or email',
    subject: 'New brief from the website',
  },
  caseStudy: {
    allWork: 'All work',
    chapters: 'Chapters',
    showNotes: 'Show the UX decisions',
    note: 'Note',
    problem: 'Problem',
    solution: 'Solution',
    why: 'Why',
    next: 'Next project',
    cta: 'Want something built like this?',
  },
  footer: {
    next: 'Next step',
    title: 'Let’s work together',
    location: 'Based in Sofia, Bulgaria – working worldwide',
    role: 'UX/UI Designer & Website Developer',
    social: 'Profiles',
  },
  meta: {
    home: {
      title: 'UX/UI Designer & Web Developer Sofia, Bulgaria | Aleksandar Pavlov',
      description:
        'UX/UI specialist turning interface psychology into websites that convert. Beautiful, proven to work, and built to last. Based in Sofia, Bulgaria.',
    },
    about: {
      title: 'About – Aleksandar Pavlov | UX/UI Designer & Website Developer',
      description:
        'About Aleksandar Pavlov – UX/UI designer and website developer based in Bulgaria, working with clients worldwide. From first concept to live site.',
    },
    notFound: {
      title: '404 – Page not found | Aleksandar Pavlov',
      description: 'Page not found. Return to Aleksandar Pavlov’s portfolio.',
    },
  },
};

export const ui: Record<Lang, typeof bg> = { bg, en };
