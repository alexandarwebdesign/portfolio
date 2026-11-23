import type { CaseContent } from './types';
import hero from '../../assets/images/forma-hero.jpg';
import home from '../../assets/images/forma-home.jpg';
import cta from '../../assets/images/forma-cta.jpg';
import contact from '../../assets/images/forma-contact.jpg';
import services from '../../assets/images/forma-services.jpg';
import project from '../../assets/images/forma-project.jpg';
import about from '../../assets/images/forma-about.jpg';
import mobileHome from '../../assets/images/forma-mobile-home.jpg';
import mobileServices from '../../assets/images/forma-mobile-services.jpg';

// Marker positions are shared by both languages.
const homePoints: [number, number][] = [
  [44, 38],
  [30, 63],
  [70, 10],
];
const ctaPoints: [number, number][] = [
  [47, 24],
  [60, 78],
];
const contactPoints: [number, number][] = [
  [60, 61],
  [75, 51],
];

const live = 'https://forma-architetects.netlify.app/';

const bg: CaseContent = {
  meta: {
    title: 'FORMA Architects – концептуален сайт за луксозна архитектура | Александър Павлов',
    description:
      'Концептуален проект: сайт за измислено бутиково архитектурно студио за луксозни резиденции. UX стратегия, UI дизайн и изработка в духа на „тихия лукс“.',
  },
  name: 'FORMA Architects',
  status: 'Концептуален проект',
  lead: 'Сайт за измислено бутиково студио за луксозни резиденции. Упражнение по дизайн, не реален клиент – показва подход и занаят.',
  facts: [
    { term: 'Роля', desc: 'UX стратегия, UI дизайн, уеб разработка' },
    { term: 'Клиент', desc: 'FORMA Architects – измислена персона' },
    { term: 'Година', desc: '2026 · Архитектура, лукс' },
  ],
  hero: { image: hero, alt: 'Модерна резиденция – начален кадър на FORMA Architects' },
  live: { href: live, label: 'Вижте сайта' },
  chapters: [
    {
      id: 'context',
      label: 'Контекст',
      title: 'Измислено студио, истинско задание',
      text: [
        'FORMA е измислено бутиково студио за ултрамодерни луксозни резиденции (от 2 до над 15 млн. долара) в Маями, Дубай и на гръцките острови. Главният архитект, Андрес Морейра, говори премерено и не търпи нищо шаблонно.',
        'Студиото, персоната и заданието са сценарий за упражнение по дизайн. Проектът показва как подхождам, не реална поръчка.',
      ],
    },
    {
      id: 'problem',
      label: 'Проблем',
      title: 'Доверие преди първото обаждане',
      text: [
        'Студиа от този ранг често живеят от препоръки и Instagram, но нямат онлайн присъствие, което да внушава доверие на заможни клиенти на възраст 35–60 години.',
        'Сайтът трябваше да ги убеди, преди изобщо да вдигнат телефона: да изглежда утвърден от първия екран и да остави работата да говори.',
      ],
    },
    {
      id: 'evidence',
      label: 'Доказателства',
      title: 'Ограниченията в заданието',
      text: [
        'В концептуален проект доказателствата са заданието и аудиторията. Ограниченията определиха всяко решение:',
      ],
      list: [
        'Без чатботове, изскачащи прозорци и вграден Calendly.',
        'Без градиенти, крещящи цветове и стокови снимки.',
        'Приглушено злато B8956A, рядко: „Когато се появи, трябва да е нарочно.“',
        '„Всичко трябва да е бавно, уверено и премерено – като самата архитектура.“',
        'Твърд срок: шест седмици до изложението за недвижими имоти в Дубай.',
      ],
    },
    {
      id: 'decisions',
      label: 'Решения',
      title: 'Тих лукс, наложен чрез въздържаност',
      text: [
        'Сайтът е като влизане в шоурум на архитект: много въздух, големи снимки, сериф за заглавията и чист шрифт за текста. Нищо шумно, шаблонно или прибързано.',
        'Видео на цял екран дава на страницата спокойно архитектурно присъствие, а после оставя работата да води.',
      ],
      figures: [
        {
          kind: 'video',
          src: '/video/forma-hero',
          width: 1920,
          height: 1088,
          duration: 'PT14S',
          label: 'Видео: началната страница и портфолиото на FORMA Architects',
        },
        {
          kind: 'notes',
          id: 'forma-home',
          image: home,
          alt: 'Началната страница на FORMA Architects на desktop – резиденция с басейн и заглавие „Architecture Without Compromise“',
          points: homePoints,
          notes: [
            {
              title: 'Едно изречение, много въздух',
              problem: 'Луксозните клиенти купуват атмосфера, преди да четат детайли.',
              solution: 'Едно кратко заглавие върху голям кадър, без подзаглавия и списъци.',
              why: 'Въздържаността внушава увереност; обяснението – съмнение.',
            },
            {
              title: 'Работата води',
              problem: 'Обикновеният hero обяснява твърде много твърде рано.',
              solution: 'Единственото действие в първия екран води към проектите.',
              why: 'Доказателството убеждава повече от твърдението.',
            },
            {
              title: 'Златото само там, където си струва',
              problem: 'Акцент навсякъде престава да е акцент.',
              solution: 'Месинговият цвят е само на бутона за консултация и ключови моменти.',
              why: 'Когато се появява рядко, всяка поява изглежда заслужена.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'forma-cta',
          image: cta,
          alt: 'Тъмна секция на FORMA Architects с голямо заглавие и бутон за консултация',
          points: ctaPoints,
          notes: [
            {
              title: 'Смяна на контраста',
              problem: 'Светлите секции една след друга се превъртат, без да се четат.',
              solution: 'Тъмна секция на цял екран с едно голямо изречение.',
              why: 'Рязката смяна кара човек да спре, преди да продължи.',
            },
            {
              title: 'Едно действие в тишината',
              problem: 'Призивът за действие се губи сред съдържанието.',
              solution: 'Бутонът е сам в центъра, без нищо около него.',
              why: 'Без конкуренция за вниманието изборът е очевиден.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'forma-contact',
          image: contact,
          alt: 'Страница за контакт на FORMA Architects – форма с бюджетен диапазон и трите локации',
          points: contactPoints,
          notes: [
            {
              title: 'Бюджетът филтрира запитванията',
              problem: 'Студио за проекти от милиони няма време за неподходящи запитвания.',
              solution: 'Формата пита за бюджетен диапазон, без да изглежда като анкета.',
              why: 'Квалификацията остава в стила на бранда – без Calendly.',
            },
            {
              title: 'Трите града като доказателство',
              problem: 'Новият клиент се пита дали студиото работи там, където строи той.',
              solution: 'Маями, Дубай и гръцките острови стоят до формата.',
              why: 'Отговорът е там, където въпросът възниква.',
            },
          ],
        },
        {
          kind: 'gallery',
          items: [
            { image: project, alt: 'Страница на проект на FORMA Architects – Desert Monolith' },
            { image: services, alt: 'Страница с услуги на FORMA Architects на desktop' },
            { image: about, alt: 'Страница „За нас“ на FORMA Architects на desktop' },
          ],
        },
        {
          kind: 'video',
          narrow: true,
          src: '/video/forma-mobile',
          width: 606,
          height: 1190,
          duration: 'PT8S',
          label: 'Видео: мобилният сайт на FORMA Architects',
        },
        {
          kind: 'gallery',
          narrow: true,
          items: [
            { image: mobileHome, alt: 'Мобилната начална страница на FORMA Architects' },
            { image: mobileServices, alt: 'Мобилната страница с услуги на FORMA Architects' },
          ],
        },
      ],
    },
    {
      id: 'result',
      label: 'Статус',
      title: 'Концепция, публикувана като демо',
      text: [
        'Сайт от шест страници плюс страници за отделни проекти, публикуван като демо. Три итерации на дизайна изчистиха йерархията, типографската скала и правилото за златния акцент.',
        'Клиентът е измислен, затова няма реални числа и не показвам метрики.',
      ],
    },
  ],
  next: { route: 'tunora', name: 'Tunora' },
};

const en: CaseContent = {
  meta: {
    title: 'FORMA Architects – Luxury Architecture Concept Website | Aleksandar Pavlov',
    description:
      'Conceptual project: a website for a fictional boutique architecture studio designing luxury residences. UX strategy, UI design and development in a “quiet luxury” direction.',
  },
  name: 'FORMA Architects',
  status: 'Conceptual project',
  lead: 'A website for a fictional boutique studio designing luxury residences. A design exercise, not a real client – it shows approach and craft.',
  facts: [
    { term: 'Role', desc: 'UX strategy, UI design, web development' },
    { term: 'Client', desc: 'FORMA Architects – a fictional persona' },
    { term: 'Year', desc: '2026 · Architecture, luxury' },
  ],
  hero: { image: hero, alt: 'Modern residence – FORMA Architects project hero image' },
  live: { href: live, label: 'View the site' },
  chapters: [
    {
      id: 'context',
      label: 'Context',
      title: 'A fictional studio, a real brief',
      text: [
        'FORMA is a fictional boutique studio designing ultra-modern luxury residences ($2M–$15M+) across Miami, Dubai and the Greek Islands. Its principal, Andrés Moreira, speaks in measured language and has zero tolerance for anything templated.',
        'The studio, the persona and the brief are a scenario created for a design exercise. The project shows how I work, not a commissioned engagement.',
      ],
    },
    {
      id: 'problem',
      label: 'Problem',
      title: 'Trust before the first call',
      text: [
        'Firms of this caliber often rely on word of mouth and Instagram, but lack a digital presence that communicates trust to high-net-worth clients aged 35–60.',
        'The site had to convince them before they ever pick up the phone: feel established from the first screen and let the work speak.',
      ],
    },
    {
      id: 'evidence',
      label: 'Evidence',
      title: 'The constraints in the brief',
      text: [
        'In a conceptual project, the evidence is the brief and the audience. Its constraints shaped every decision:',
      ],
      list: [
        'No chatbots, pop-ups or embedded Calendly.',
        'No gradients, loud colors or stock photography.',
        'Muted gold B8956A, used sparingly: “When it appears, it should feel intentional.”',
        '“Everything should feel slow, confident, intentional – like the architecture itself.”',
        'A hard deadline: six weeks to the Dubai Real Estate Expo.',
      ],
    },
    {
      id: 'decisions',
      label: 'Decisions',
      title: 'Quiet luxury, enforced by restraint',
      text: [
        'The site is the digital equivalent of walking into an architecture showroom: generous whitespace, oversized photography, a serif for headings and a clean sans for reading. Nothing loud, templated or rushed.',
        'A full-width video gives the page a quiet architectural presence, then lets the work lead.',
      ],
      figures: [
        {
          kind: 'video',
          src: '/video/forma-hero',
          width: 1920,
          height: 1088,
          duration: 'PT14S',
          label: 'Video: the FORMA Architects homepage and portfolio walkthrough',
        },
        {
          kind: 'notes',
          id: 'forma-home',
          image: home,
          alt: 'FORMA Architects homepage on desktop – a residence with a pool and the headline “Architecture Without Compromise”',
          points: homePoints,
          notes: [
            {
              title: 'One sentence, plenty of air',
              problem: 'Luxury prospects buy into atmosphere before details.',
              solution: 'One short headline over a large image, no subheads or lists.',
              why: 'Restraint signals confidence; explanation signals doubt.',
            },
            {
              title: 'The work leads',
              problem: 'A typical hero explains too much too early.',
              solution: 'The only action on the first screen leads to the projects.',
              why: 'Proof persuades more than claims.',
            },
            {
              title: 'Gold only where it counts',
              problem: 'An accent used everywhere stops being an accent.',
              solution: 'The brass color appears only on the consultation button and key moments.',
              why: 'When it appears rarely, every appearance feels earned.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'forma-cta',
          image: cta,
          alt: 'FORMA Architects dark section with a large headline and a consultation button',
          points: ctaPoints,
          notes: [
            {
              title: 'A contrast shift',
              problem: 'Light sections in a row get scrolled past, not read.',
              solution: 'A full-width dark section with one large sentence.',
              why: 'The sudden shift makes people pause before moving on.',
            },
            {
              title: 'One action in the silence',
              problem: 'Calls to action get lost among content.',
              solution: 'The button stands alone in the center.',
              why: 'With nothing competing for attention, the choice is obvious.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'forma-contact',
          image: contact,
          alt: 'FORMA Architects contact page – a form with a budget range and the three locations',
          points: contactPoints,
          notes: [
            {
              title: 'The budget qualifies leads',
              problem: 'A studio building multi-million homes has no time for poor-fit inquiries.',
              solution: 'The form asks for a budget range without feeling like a survey.',
              why: 'Qualification stays on-brand – no Calendly.',
            },
            {
              title: 'Three cities as proof',
              problem: 'A new client wonders whether the studio works where they build.',
              solution: 'Miami, Dubai and the Greek Islands sit beside the form.',
              why: 'The answer is placed where the question arises.',
            },
          ],
        },
        {
          kind: 'gallery',
          items: [
            { image: project, alt: 'FORMA Architects project detail page for Desert Monolith' },
            { image: services, alt: 'FORMA Architects services page desktop view' },
            { image: about, alt: 'FORMA Architects about page desktop view' },
          ],
        },
        {
          kind: 'video',
          narrow: true,
          src: '/video/forma-mobile',
          width: 606,
          height: 1190,
          duration: 'PT8S',
          label: 'Video: the FORMA Architects mobile site walkthrough',
        },
        {
          kind: 'gallery',
          narrow: true,
          items: [
            { image: mobileHome, alt: 'FORMA Architects mobile homepage' },
            { image: mobileServices, alt: 'FORMA Architects mobile services page' },
          ],
        },
      ],
    },
    {
      id: 'result',
      label: 'Status',
      title: 'A concept, published as a demo',
      text: [
        'A six-page website plus individual project pages, published as a demo. Three design iterations refined the hierarchy, the type scale and the gold accent rule.',
        'The client is fictional, so there are no real numbers and no metrics are shown.',
      ],
    },
  ],
  next: { route: 'tunora', name: 'Tunora' },
};

export const forma = { bg, en };
