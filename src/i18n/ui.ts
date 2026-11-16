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
    menu: 'Меню',
    close: 'Затвори',
    home: 'Начало',
  },
  cta: 'Безплатна консултация',
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
    menu: 'Menu',
    close: 'Close',
    home: 'Home',
  },
  cta: 'Free consultation',
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
