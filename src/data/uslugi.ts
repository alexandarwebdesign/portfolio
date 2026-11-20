// The offer page for local businesses, in both languages (/uslugi, /en/services).
// The Bulgarian copy is the original page text; the English one is a draft.
const bg = {
  meta: {
    title: 'Уебсайт за вашия бизнес | Александър Павлов',
    description:
      'Уебсайтове за местни бизнеси в България: дизайн по мярка, мобилна версия на първо място, бързо зареждане и основно SEO. Безплатна визия преди да платите.',
  },
  hero: {
    eyebrow: 'Уебсайтове за местен бизнес',
    title: ['Преди да ви потърсят по телефона,', 'ви търсят в Google.'],
    lead: 'Правя уебсайтове за местни бизнеси, които изглеждат професионално, зареждат се бързо и се виждат добре от телефона на клиента.',
    cta: 'Поискай безплатна визия',
    reply: 'Отговарям до 24 часа.',
  },
  problem: {
    label: 'Проблем',
    title: 'Познато ли ви е?',
    items: [
      'Нямате сайт, или сайтът е от преди 8 години и не се отваря добре на телефон.',
      'Клиентите ви питат за цени и работно време, които са написани някъде, но никой не ги намира.',
      'Конкурентът ви излиза пръв в Google, а вие не излизате никъде.',
    ],
  },
  includes: {
    label: 'Какво включва',
    title: 'Какво получавате',
    items: [
      { title: 'Дизайн по мярка', text: 'Не шаблон с вашето лого.' },
      { title: 'Мобилна версия на първо място', text: 'Повечето хора ви търсят от телефона.' },
      {
        title: 'Бързо зареждане и основно SEO',
        text: 'За да ви намират по „вашата услуга + вашия град“.',
      },
      { title: 'Google Maps, телефон и форма за запитване', text: 'На видимо място.' },
      { title: 'Домейн, хостинг и защитена връзка (SSL)', text: 'Настроени от мен.' },
      { title: 'Лесна промяна на текстове и цени', text: 'Без програмист за всяка дреболия.' },
    ],
  },
  process: {
    label: 'Процес',
    title: 'Как работим',
    steps: [
      { title: 'Разговор', text: '15–20 минути: разбирам какво предлагате и кой ви търси.' },
      { title: 'Безплатна визия', text: 'Виждате как ще изглежда сайтът, преди да платите.' },
      { title: 'Изработка', text: 'До 14 работни дни след одобрение на визията.' },
      { title: 'Пускане и обучение', text: 'Показвам как да сменяте текстове и снимки.' },
    ],
  },
  prices: {
    label: 'Цени',
    title: 'Ясни цени',
    items: [
      {
        title: 'Уебсайт на един екран (лендинг)',
        text: 'Малък бизнес с една-две услуги.',
        price: 'от 490 €',
        amount: 490,
      },
      {
        title: 'Уебсайт до 5 страници',
        text: 'Повече услуги, галерия, екип или блог.',
        price: 'от 890 €',
        amount: 890,
      },
      {
        title: 'Поддръжка (по желание)',
        text: 'Хостинг, обновления, малки промени, резервно копие, проверка, че сайтът работи.',
        price: '40 € на месец',
        amount: 40,
      },
    ],
    note: 'Фирмата не е регистрирана по ДДС, затова към цените не се начислява ДДС. Цените са начални („от“) и зависят от обема на проекта. Домейнът е отделна такса.',
  },
  proof: {
    label: 'Реален проект',
    title: 'Какво съм правил',
    category: 'Онлайн магазин за бижута',
    text: 'Birsé е магазин за бижута. Преработих потребителския опит и дизайна, а екипът на PFG Bulgaria ги внедри на съществуващата платформа. Започнахме от това как пазарува българинът: доставка с Еконт, Спиди и BoxNow, наложен платеж, разглеждане от телефона.',
    link: 'Вижте проекта',
  },
  faq: {
    label: 'Въпроси',
    title: 'Често задавани въпроси',
    items: [
      {
        q: 'Колко време отнема?',
        a: 'Обикновено до 14 работни дни след одобрена визия, ако дадете текстове и снимки навреме.',
      },
      {
        q: 'Имам ли нужда от текстове и снимки?',
        a: 'Ако нямате, помагам със структурата и текста. Собствени снимки работят най-добре.',
      },
      { q: 'Кой е собственик на сайта?', a: 'Вие. Домейнът е на ваше име.' },
      {
        q: 'Ами ако не ми хареса визията?',
        a: 'Първата визия е безплатна. Ако не ви хареса, спираме и не дължите нищо.',
      },
      {
        q: 'Ще излизам ли първи в Google?',
        a: 'Не мога да обещая позиция, никой честен човек не може. Правя сайта с най-добрите шансове и ви показвам какво да правите след това.',
      },
      {
        q: 'Какво става след пускането?',
        a: 'Управлявате сайта сами или ползвате месечната поддръжка.',
      },
    ],
  },
  form: {
    aria: 'Заявка за безплатна визия',
    subject: 'Нова заявка от /uslugi (местен бизнес)',
    name: 'Име',
    namePh: 'Вашето име',
    phone: 'Телефон',
    email: 'Имейл',
    emailPh: 'you@firma.bg',
    business: 'Вид бизнес',
    businessPh: 'Напр. зъболекар',
    city: 'Град',
    cityPh: 'Напр. Пловдив',
    hasSite: 'Имате ли сайт?',
    choose: 'Изберете',
    yes: 'Да',
    no: 'Не',
    outdated: 'Да, но е остарял',
    message: 'Кратко съобщение',
    messagePh: 'Какво предлагате и какво искате да постигнете със сайта?',
    submit: 'Изпрати заявка',
    helper: 'Използвам данните ви само за да ви отговоря.',
    emailLabel: 'Изпрати имейл',
    errors: {
      'offer-name': 'Моля, въведете името си.',
      'offer-phone': 'Моля, въведете телефон за връзка.',
      'offer-email': 'Моля, въведете валиден имейл.',
      'offer-business': 'Моля, напишете какъв е бизнесът ви.',
      'offer-city': 'Моля, въведете град.',
      'offer-hassite': 'Моля, изберете отговор.',
    },
    fix: 'Моля, поправете полетата по-горе.',
    sending: 'Изпращане…',
    sent: 'Заявката е изпратена. Ще ви отговоря в най-скоро време.',
    failed: 'Нещо се обърка. Опитайте пак или ми пишете на',
  },
  contact: {
    label: 'Контакт',
    title: ['Разкажете ми', 'за бизнеса си.'],
    email: 'Предпочитате имейл?',
  },
};

const en: typeof bg = {
  meta: {
    title: 'A Website for Your Business | Aleksandar Pavlov',
    description:
      'Websites for local businesses in Bulgaria: custom design, mobile first, fast loading and essential SEO. A free design preview before you pay.',
  },
  hero: {
    eyebrow: 'Websites for local businesses',
    title: ['Before they call you,', 'they search for you on Google.'],
    lead: 'I build websites for local businesses that look professional, load fast and read well on a customer’s phone.',
    cta: 'Request a free preview',
    reply: 'I reply within 24 hours.',
  },
  problem: {
    label: 'Problem',
    title: 'Sound familiar?',
    items: [
      'You have no website, or it is 8 years old and does not open well on a phone.',
      'Customers ask about prices and opening hours that are written somewhere, but nobody can find them.',
      'Your competitor comes first on Google, and you do not show up at all.',
    ],
  },
  includes: {
    label: 'What’s included',
    title: 'What you get',
    items: [
      { title: 'Custom design', text: 'Not a template with your logo.' },
      { title: 'Mobile first', text: 'Most people look for you on their phone.' },
      {
        title: 'Fast loading and essential SEO',
        text: 'So you are found for “your service + your city”.',
      },
      { title: 'Google Maps, phone and an enquiry form', text: 'Where people can see them.' },
      { title: 'Domain, hosting and a secure connection (SSL)', text: 'Set up by me.' },
      { title: 'Easy changes to text and prices', text: 'No developer for every small thing.' },
    ],
  },
  process: {
    label: 'Process',
    title: 'How we work',
    steps: [
      {
        title: 'A conversation',
        text: '15–20 minutes: I learn what you offer and who looks for you.',
      },
      { title: 'Free preview', text: 'You see how the website will look before you pay.' },
      { title: 'Build', text: 'Up to 14 working days after you approve the preview.' },
      { title: 'Launch and training', text: 'I show you how to change text and photos.' },
    ],
  },
  prices: {
    label: 'Prices',
    title: 'Clear prices',
    items: [
      {
        title: 'One-page website (landing page)',
        text: 'A small business with one or two services.',
        price: 'from €490',
        amount: 490,
      },
      {
        title: 'Website of up to 5 pages',
        text: 'More services, a gallery, a team or a blog.',
        price: 'from €890',
        amount: 890,
      },
      {
        title: 'Maintenance (optional)',
        text: 'Hosting, updates, small changes, a backup, a check that the site works.',
        price: '€40 per month',
        amount: 40,
      },
    ],
    note: 'The company is not VAT registered, so no VAT is added to the prices. Prices are starting prices (“from”) and depend on the size of the project. The domain is a separate fee.',
  },
  proof: {
    label: 'A real project',
    title: 'What I have built',
    category: 'Online jewellery store',
    text: 'Birsé is a jewellery store. I reworked the user experience and the design, and the PFG Bulgaria team implemented them on the existing platform. We started from how Bulgarians shop: delivery with Econt, Speedy and BoxNow, cash on delivery, browsing from a phone.',
    link: 'View the project',
  },
  faq: {
    label: 'Questions',
    title: 'Frequently asked questions',
    items: [
      {
        q: 'How long does it take?',
        a: 'Usually up to 14 working days after the preview is approved, if you send the text and photos on time.',
      },
      {
        q: 'Do I need to have text and photos?',
        a: 'If you do not, I help with the structure and the text. Your own photos work best.',
      },
      { q: 'Who owns the website?', a: 'You do. The domain is in your name.' },
      {
        q: 'What if I do not like the preview?',
        a: 'The first preview is free. If you do not like it, we stop and you owe nothing.',
      },
      {
        q: 'Will I come first on Google?',
        a: 'I cannot promise a position, and no honest person can. I build the site with the best chances and show you what to do next.',
      },
      {
        q: 'What happens after launch?',
        a: 'You run the website yourself or use the monthly maintenance.',
      },
    ],
  },
  form: {
    aria: 'Free preview request',
    subject: 'New request from /en/services (local business)',
    name: 'Name',
    namePh: 'Your name',
    phone: 'Phone',
    email: 'Email',
    emailPh: 'you@company.com',
    business: 'Type of business',
    businessPh: 'E.g. dentist',
    city: 'City',
    cityPh: 'E.g. Plovdiv',
    hasSite: 'Do you have a website?',
    choose: 'Choose',
    yes: 'Yes',
    no: 'No',
    outdated: 'Yes, but it is outdated',
    message: 'Short message',
    messagePh: 'What do you offer and what do you want the website to achieve?',
    submit: 'Send request',
    helper: 'I use your details only to reply to you.',
    emailLabel: 'Send an email',
    errors: {
      'offer-name': 'Please enter your name.',
      'offer-phone': 'Please enter a phone number.',
      'offer-email': 'Please enter a valid email.',
      'offer-business': 'Please tell me what your business is.',
      'offer-city': 'Please enter a city.',
      'offer-hassite': 'Please choose an answer.',
    },
    fix: 'Please fix the fields above.',
    sending: 'Sending…',
    sent: 'The request is sent. I will reply as soon as I can.',
    failed: 'Something went wrong. Try again or write to me at',
  },
  contact: {
    label: 'Contact',
    title: ['Tell me about', 'your business.'],
    email: 'Prefer email?',
  },
};

export const uslugiCopy = { bg, en };
export const uslugi = bg;
