import type { CaseContent } from './types';
import hero from '../../assets/images/birse-hero.jpg';
import pdp from '../../assets/images/birse-pdp.jpg';
import checkout from '../../assets/images/birse-checkout.jpg';
import filters from '../../assets/images/birse-mobile-1.jpg';
import category from '../../assets/images/birse-mobile-2.jpg';
import mobileCheckout from '../../assets/images/birse-mobile-3.jpg';
import mobilePdp from '../../assets/images/birse-mobile-4.jpg';
import drawer from '../../assets/images/birse-mobile-5.jpg';
import drillDown from '../../assets/images/birse-mobile-6.jpg';
import storefront from '../../assets/images/birse-storefront.jpg';
import desktopCategory from '../../assets/images/birse-category.jpg';
import cart from '../../assets/images/birse-cart.jpg';

// Marker positions are shared by both languages.
const pdpPoints: [number, number][] = [
  [63, 20],
  [82, 31],
  [50, 72],
];
const checkoutPoints: [number, number][] = [
  [66, 11],
  [58.5, 59],
  [60, 21],
];
const filterPoints: [number, number][] = [
  [50, 21.5],
  [88, 90],
];

const bg: CaseContent = {
  meta: {
    title: 'Birsé – UX/UI редизайн на онлайн магазин за бижута | Александър Павлов',
    description:
      'Мобилен UX/UI редизайн на BirSé, българска къща за фини бижута, онлайн от 2013 г. Начална страница, продуктови страници и поръчка, преработени около това как пазаруват 80 % от клиентите – от телефона.',
  },
  name: 'Birsé',
  status: 'Редизайнът е завършен',
  lead: 'Мобилен UX/UI редизайн на онлайн магазин за фини бижута, работещ от 2013 г. – без нова платформа и без загуба на позициите в Google.',
  facts: [
    { term: 'Роля', desc: 'UX стратегия, UI/UX редизайн, дизайн система и предаване' },
    { term: 'Клиент', desc: 'BirSé (birse.bg), фини бижута от 2013 г.' },
    { term: 'Изработка', desc: 'PFG Bulgaria' },
    { term: 'Година', desc: '2026 · Онлайн търговия, бижута' },
  ],
  hero: { image: hero, alt: 'Бижу на BirSé – начален кадър на бранда' },
  live: { href: 'https://www.birse.bg/', label: 'Вижте магазина' },
  chapters: [
    {
      id: 'context',
      label: 'Контекст',
      title: 'Работещ магазин, издигнат без нова платформа',
      text: [
        'BirSé е българска къща за фини бижута – злато, сребро и естествени камъни, онлайн от 2013 г., с магазини в София. Магазинът вече се класира в Google и продава.',
        'Заданието беше кратко: малки промени в UI, големи подобрения в UX. Не нов сайт, а стратегическо издигане на работещ магазин, без да се загубят позициите в търсачките.',
      ],
      facts: [
        { term: 'Моята роля', desc: 'UX стратегия, UI/UX редизайн, дизайн система и предаване.' },
        {
          term: 'Какво проектирах',
          desc: 'Начална страница, категории и продуктови страници, количка, поръчка, мобилно меню и филтри.',
        },
        {
          term: 'Какво направи PFG',
          desc: 'Изработка и внедряване на дизайна върху съществуващата платформа.',
        },
      ],
    },
    {
      id: 'problem',
      label: 'Проблем',
      title: 'Колебанието идва точно там, където се решава',
      text: [
        'Около 80 % от посещенията са от телефон. Платформата не можеше да се смени, а позициите в Google трябваше да оцелеят.',
        'Цената на бижутата кара хората да се колебаят на продуктовата страница. Дългата поръчка губи клиенти в последната стъпка. А хората, които идват от реклама, трябва да се ориентират за секунди.',
      ],
    },
    {
      id: 'evidence',
      label: 'Доказателства',
      title: 'Всяко решение – първо на екран 375 px',
      text: [
        'Тръгнахме от това как пазарува българинът: от телефона, с доставка с Еконт, Спиди или BoxNow и с наложен платеж. Всеки екран беше оценен първо на мобилно, после на desktop.',
        'Най-големите подобрения са там, където работи палецът: влизането във филтрите, разглеждането на продукти и увереността при поръчка.',
      ],
      figures: [
        {
          kind: 'gallery',
          narrow: true,
          items: [
            {
              image: category,
              alt: 'Мобилна категория на BirSé – златни обеци с бутони за филтър и подреждане',
            },
            {
              image: drawer,
              alt: 'Мобилно меню на BirSé – основни категории, промоции и телефон на магазина',
            },
            {
              image: drillDown,
              alt: 'Мобилно меню на BirSé, второ ниво – златни бижута с раздели по аудитория и подкатегории',
            },
          ],
        },
      ],
    },
    {
      id: 'decisions',
      label: 'Решения',
      title: 'По-малко докосвания до доверие, избор и покупка',
      text: [
        'Посоката е „топъл лукс“ – чисто, но не студено. DM Serif Display дава мекота на заглавията и имената на продуктите, DM Sans държи интерфейса четим. Приглушено злато C9A96E и тъмно бордо 7C2529 показват премиум сигналите, без магазинът да крещи.',
        'Менюто стига до всяка подкатегория с най-много две докосвания. Ето решенията на трите най-важни екрана.',
      ],
      figures: [
        {
          kind: 'notes',
          id: 'birse-pdp',
          image: pdp,
          alt: 'Продуктова страница на BirSé на desktop – галерия, намалена цена, добавяне в количката, вноски и детайли за доверие',
          points: pdpPoints,
          notes: [
            {
              title: 'Цената, която се вижда първа',
              problem: 'Цената на бижутата спира хората точно в момента на решение.',
              solution: 'Намалената цена е най-силният елемент, старата е зачеркната до нея.',
              why: 'Котвата на старата цена прави отстъпката видима без допълнително обяснение.',
            },
            {
              title: 'Вноските до бутона за покупка',
              problem: 'Въпросът „мога ли да си го позволя“ изкарва хората от страницата.',
              solution: 'Бутонът за вноски стои до „Добави в количката“, в същата зона.',
              why: 'Отговорът на възражението трябва да е там, където то възниква.',
            },
            {
              title: 'Доверие над прегъвката',
              problem:
                'Сертификат, доставка и връщане са въпроси, които иначе остават без отговор до поръчката.',
              solution: 'Три кратки знака за доверие стоят веднага под цената и бутоните.',
              why: 'Рискът се намалява преди решението, не след него.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'birse-checkout',
          image: checkout,
          alt: 'Поръчка в BirSé на desktop – три стъпки (контакт, доставка, плащане) и винаги видимо обобщение на поръчката',
          points: checkoutPoints,
          notes: [
            {
              title: 'Три стъпки с видим прогрес',
              problem: 'Дълга поръчка на една страница изглежда безкрайна.',
              solution: 'Контакт, доставка, плащане – с лента, която показва къде сте.',
              why: 'Когато краят се вижда, хората по-рядко се отказват.',
            },
            {
              title: 'Едно главно действие',
              problem: 'Няколко бутона с еднаква тежест карат човек да се чуди.',
              solution: 'Един широк бутон води към следващата стъпка.',
              why: 'По-малко избори – по-бързо решение (закон на Хик).',
            },
            {
              title: 'Поръчката винаги пред очите',
              problem: 'Без обобщение клиентът се връща в количката, за да провери какво плаща.',
              solution: 'Обобщението стои до формата, с общата сума и условията за доставка.',
              why: 'Видимото е по-добре от запомненото: няма връщане назад.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'birse-filters',
          narrow: true,
          image: filters,
          alt: 'Филтри на BirSé на мобилно – ценови диапазон и групи филтри в панел отдолу с бутон за броя резултати',
          points: filterPoints,
          notes: [
            {
              title: 'Филтрите излизат отдолу',
              problem: 'Филтри, отворени над списъка, избутват продуктите под първия екран.',
              solution:
                'Продуктите се виждат първи; филтрите се плъзгат отдолу само когато потрябват.',
              why: 'Панелът отдолу е в обсега на палеца и не крие контекста.',
            },
            {
              title: 'Броят резултати преди натискане',
              problem: 'Твърде много филтри водят до празна страница.',
              solution: 'Бутонът показва колко продукта ще видите: „Покажи 721 продукта“.',
              why: 'Без задънени улици – най-голямата печалба на мобилно.',
            },
          ],
        },
        {
          kind: 'gallery',
          narrow: true,
          items: [
            {
              image: mobilePdp,
              alt: 'Мобилна продуктова страница на BirSé – галерия, цена, вноски и фиксирана лента за добавяне в количката',
            },
            {
              image: mobileCheckout,
              alt: 'Мобилна поръчка в BirSé – стъпка контакт с фиксирана обща сума и бутон за продължаване долу',
            },
          ],
        },
        {
          kind: 'gallery',
          items: [
            {
              image: desktopCategory,
              alt: 'Категория на BirSé на desktop – златни обеци с филтри и подреждане',
            },
            {
              image: cart,
              alt: 'Количка на BirSé на desktop – продукт, количество, обобщение и бутон за поръчка',
            },
            {
              image: storefront,
              alt: 'Начална страница на BirSé на desktop – промоционален банер, лента с гаранции и избрани бижута',
            },
          ],
        },
      ],
    },
    {
      id: 'result',
      label: 'Резултат',
      title: 'Числата идват след пускането',
      text: [
        'Редизайнът е завършен и внедрен от екипа на PFG Bulgaria върху съществуващата платформа.',
        'Още не публикувам числа. Резултатите за конверсия и мобилно ще бъдат добавени тук, когато има достатъчно данни след пускането.',
      ],
    },
  ],
  next: { route: 'forma', name: 'FORMA Architects' },
};

const en: CaseContent = {
  meta: {
    title: 'Birsé – Jewelry E-commerce UX/UI Redesign | Aleksandar Pavlov',
    description:
      'A mobile-first UX/UI redesign for BirSé, a Bulgarian fine-jewelry house online since 2013. Storefront, product pages and checkout redesigned around how 80% of the audience actually shops – on a phone.',
  },
  name: 'Birsé',
  status: 'Redesign finished',
  lead: 'A mobile-first UX/UI redesign of a fine-jewelry store running since 2013 – without a new platform and without losing its Google rankings.',
  facts: [
    { term: 'Role', desc: 'UX strategy, UI/UX redesign, design system & handoff' },
    { term: 'Client', desc: 'BirSé (birse.bg), fine jewelry since 2013' },
    { term: 'Development', desc: 'PFG Bulgaria' },
    { term: 'Year', desc: '2026 · E-commerce, jewelry' },
  ],
  hero: { image: hero, alt: 'BirSé fine jewelry brand hero' },
  live: { href: 'https://www.birse.bg/', label: 'Visit the store' },
  chapters: [
    {
      id: 'context',
      label: 'Context',
      title: 'A live store, lifted without a rebuild',
      text: [
        'BirSé is a Bulgarian fine-jewelry house selling gold, silver and natural-stone pieces online since 2013, with stores in Sofia. The store already ranked and sold.',
        'The brief was pointed: small UI changes, drastic UX improvements. Not a rebuild – a strategic elevation of a live store, without breaking its SEO.',
      ],
      facts: [
        { term: 'My role', desc: 'UX strategy, UI/UX redesign, design system and handoff.' },
        {
          term: 'What I designed',
          desc: 'Storefront, category and product pages, cart, checkout, and the mobile menu and filters.',
        },
        {
          term: 'What PFG did',
          desc: 'Development and implementation of the design on the existing platform.',
        },
      ],
    },
    {
      id: 'problem',
      label: 'Problem',
      title: 'Hesitation happens where the decision is made',
      text: [
        'Around 80% of traffic is mobile. The platform could not be replaced, and its Google rankings had to survive.',
        'Jewelry prices make people hesitate on the product page. A long checkout loses shoppers at the last step. And shoppers arriving from ads need to find their way in seconds.',
      ],
    },
    {
      id: 'evidence',
      label: 'Evidence',
      title: 'Every decision judged on a 375px screen first',
      text: [
        'We started from how Bulgarians shop: on a phone, with delivery by Econt, Speedy or BoxNow, and cash on delivery. Every screen was evaluated on mobile first, desktop second.',
        'The biggest improvements live where the thumb does the work: filter entry, product scanning and checkout confidence.',
      ],
      figures: [
        {
          kind: 'gallery',
          narrow: true,
          items: [
            {
              image: category,
              alt: 'BirSé mobile category page – gold earrings with filter and sort buttons',
            },
            {
              image: drawer,
              alt: 'BirSé mobile navigation drawer – main categories, promotions link and store phone number',
            },
            {
              image: drillDown,
              alt: 'BirSé mobile navigation drill-down – gold jewelry with audience tabs and subcategories',
            },
          ],
        },
      ],
    },
    {
      id: 'decisions',
      label: 'Decisions',
      title: 'Fewer taps to trust, browse and buy',
      text: [
        'The direction is “warm luxury” – clean but not cold. DM Serif Display softens headlines and product names, while DM Sans keeps the commerce UI readable. Muted gold C9A96E and deep burgundy 7C2529 make premium cues visible without making the store loud.',
        'The menu reaches any subcategory in two taps at most. Here are the decisions on the three screens that matter most.',
      ],
      figures: [
        {
          kind: 'notes',
          id: 'birse-pdp',
          image: pdp,
          alt: 'BirSé product page on desktop – gallery, discounted price, add-to-cart, installment option and trust details',
          points: pdpPoints,
          notes: [
            {
              title: 'The price you see first',
              problem: 'Jewelry prices stop people right at the moment of decision.',
              solution:
                'The discounted price is the strongest element, with the old price struck through beside it.',
              why: 'The old price anchors the discount, so it needs no extra explanation.',
            },
            {
              title: 'Installments beside the buy button',
              problem: '“Can I afford this?” sends people off the page.',
              solution: 'The installment button sits next to “Add to cart”, in the same zone.',
              why: 'An objection is best answered where it arises.',
            },
            {
              title: 'Trust above the fold',
              problem:
                'Certificate, delivery and returns are questions that otherwise stay open until checkout.',
              solution: 'Three short trust cues sit right under the price and buttons.',
              why: 'Risk is reduced before the decision, not after it.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'birse-checkout',
          image: checkout,
          alt: 'BirSé desktop checkout – three-step progress (contact, delivery, payment) with a persistent order summary',
          points: checkoutPoints,
          notes: [
            {
              title: 'Three steps with visible progress',
              problem: 'A long single-page checkout feels endless.',
              solution: 'Contact, delivery, payment – with a bar that shows where you are.',
              why: 'When the end is in sight, people abandon less.',
            },
            {
              title: 'One primary action',
              problem: 'Several equally weighted buttons make people pause.',
              solution: 'One wide button leads to the next step.',
              why: 'Fewer choices, faster decisions (Hick’s law).',
            },
            {
              title: 'The order always in view',
              problem: 'Without a summary, shoppers go back to the cart to check what they pay.',
              solution: 'The summary stays beside the form, with the total and delivery terms.',
              why: 'Visible beats remembered: no going back.',
            },
          ],
        },
        {
          kind: 'notes',
          id: 'birse-filters',
          narrow: true,
          image: filters,
          alt: 'BirSé mobile filter bottom sheet – price range and filter groups with a result-count button',
          points: filterPoints,
          notes: [
            {
              title: 'Filters as a bottom sheet',
              problem: 'Filters opened above the list push the products below the first screen.',
              solution: 'Products show first; filters slide up only when needed.',
              why: 'A bottom sheet is in thumb reach and keeps the context.',
            },
            {
              title: 'Result count before you tap',
              problem: 'Too many filters lead to an empty page.',
              solution: 'The button shows how many products you will see: “Show 721 products”.',
              why: 'No dead ends – the single biggest mobile win.',
            },
          ],
        },
        {
          kind: 'gallery',
          narrow: true,
          items: [
            {
              image: mobilePdp,
              alt: 'BirSé mobile product page – gallery, price, installment button and a fixed add-to-cart bar',
            },
            {
              image: mobileCheckout,
              alt: 'BirSé mobile checkout – contact step with the order total and continue button fixed at the bottom',
            },
          ],
        },
        {
          kind: 'gallery',
          items: [
            {
              image: desktopCategory,
              alt: 'BirSé desktop category page – gold earrings with filters and sorting',
            },
            {
              image: cart,
              alt: 'BirSé desktop cart – item, quantity, order summary and checkout button',
            },
            {
              image: storefront,
              alt: 'BirSé homepage on desktop – promotional banner, trust strip and featured jewelry',
            },
          ],
        },
      ],
    },
    {
      id: 'result',
      label: 'Result',
      title: 'Numbers come after launch',
      text: [
        'The redesign is finished and implemented by the PFG Bulgaria team on the existing platform.',
        'No performance numbers are published yet. Conversion and mobile results will be added here once there is enough data since launch.',
      ],
    },
  ],
  next: { route: 'forma', name: 'FORMA Architects' },
};

export const birse = { bg, en };
