// The privacy page. Draft text: the facts come from the code (the forms and what they send, no
// cookies and no analytics on the site); the retention sentence and the wording are for the owner
// to confirm.
import { site } from './site';

export const privacy = {
  bg: {
    label: 'Поверителност',
    title: 'Как използвам данните ви',
    updated: 'Последна промяна: 21 ноември 2026',
    sections: [
      {
        heading: 'Кой съм аз',
        text: [
          `Администратор на данните ви е Александър Павлов, UX/UI дизайнер и уеб разработчик от София, България. Пишете ми на ${site.email}.`,
        ],
      },
      {
        heading: 'Какво събирам',
        text: [
          'Само това, което сами напишете във формите на сайта: име, имейл, телефон (по желание), вид на сайта, бюджет и съобщението ви.',
        ],
      },
      {
        heading: 'За какво го използвам',
        text: [
          'Само за да ви отговоря и, ако работим заедно, да подготвя оферта. Не го използвам за реклама и не го продавам.',
        ],
      },
      {
        heading: 'Кой още го вижда',
        text: [
          'Формите се доставят чрез Web3Forms (web3forms.com), който препраща съобщението ви към моя имейл. Други получатели няма.',
        ],
      },
      {
        heading: 'Бисквитки и проследяване',
        text: ['Сайтът не поставя бисквитки и няма анализ или рекламни проследявания.'],
      },
      {
        heading: 'Колко дълго го пазя',
        text: [
          'Толкова, колкото е нужно, за да ви отговоря и за работата след това, после го изтривам.',
        ],
      },
      {
        heading: 'Вашите права',
        text: [
          `Можете да поискате да видите, поправите или изтриете данните си или да спра да ги използвам: пишете ми на ${site.email}. Можете да подадете и жалба до Комисията за защита на личните данни (cpdp.bg).`,
        ],
      },
    ],
  },
  en: {
    label: 'Privacy',
    title: 'How I use your details',
    updated: 'Last changed: 21 November 2026',
    sections: [
      {
        heading: 'Who I am',
        text: [
          `The controller of your data is Aleksandar Pavlov, a UX/UI designer and web developer based in Sofia, Bulgaria. Write to me at ${site.email}.`,
        ],
      },
      {
        heading: 'What I collect',
        text: [
          'Only what you type into the forms on this site: your name, email, phone number (optional), the kind of site, the budget and your message.',
        ],
      },
      {
        heading: 'What I use it for',
        text: [
          'Only to reply to you and, if we work together, to prepare an offer. I do not use it for advertising and I do not sell it.',
        ],
      },
      {
        heading: 'Who else sees it',
        text: [
          'The forms are delivered by Web3Forms (web3forms.com), which passes your message to my email. There are no other recipients.',
        ],
      },
      {
        heading: 'Cookies and tracking',
        text: ['This site sets no cookies and has no analytics or advertising trackers.'],
      },
      {
        heading: 'How long I keep it',
        text: [
          'As long as it is needed to reply to you and for any work that follows, then I delete it.',
        ],
      },
      {
        heading: 'Your rights',
        text: [
          `You can ask to see, correct or delete your data, or ask me to stop using it, by writing to ${site.email}. You can also complain to the Bulgarian Commission for Personal Data Protection (cpdp.bg).`,
        ],
      },
    ],
  },
} as const;
