// The words of the two case study pages, in both languages. The pages and
// llms-full.txt both read from here, so they cannot drift apart.
const swatch = (hex: string) =>
  `<span class="inline-color-swatch" style="background:#${hex};" aria-hidden="true"></span>${hex}`;
const pfg = `<a href="https://pfgbulgaria.com/" target="_blank" rel="noopener noreferrer" class="case-meta-link">PFG Bulgaria <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-arrow" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>`;
const site = `<a href="https://www.birse.bg/" target="_blank" rel="noopener noreferrer">BirSé (birse.bg)</a>`;

export const birseCopy = {
  en: {
    badge: 'Redesign finished',
    devLabel: 'Development',
    meta: [
      {
        label: 'Role / Services',
        items: ['UX Strategy', 'UI/UX Redesign', 'Design System &amp; Handoff'],
      },
      { label: 'Client', items: [site, 'Fine jewelry, est. 2013', `Dev partner: ${pfg}`] },
      { label: 'Year &amp; Sector', items: ['2026 ©', 'E-Commerce · Jewelry'] },
    ],
    heroAlt: 'BirSé fine jewelry brand hero',
    storefront: {
      kicker: 'Storefront elevation',
      title: 'A live store, lifted without a rebuild',
      text: 'BirSé already ranked and sold, so the work had to feel premium without breaking the platform. The storefront keeps the existing commerce logic, then adds editorial spacing, stronger category entry points, and a warmer jewelry tone.',
      alt: 'BirSé homepage on desktop - Black Month promotional banner, trust strip and featured jewelry',
    },
    pdp: {
      kicker: 'Product detail page',
      title: 'Confidence where price hesitation happens',
      text: 'The product page puts the discounted price, the installment option, trust details, and the add-to-cart path in the same decision zone. The goal is not decoration; it is removing doubt before the shopper leaves the page.',
      alt: 'BirSé product page on desktop - gallery, discounted price, add-to-cart, installment option and trust details',
    },
    checkout: {
      kicker: 'Checkout flow',
      title: 'A checkout that keeps the next step in reach',
      text: 'Checkout runs in three steps: contact, delivery, payment. A progress bar shows where the shopper is, and the order summary stays visible beside the form, so the flow feels controlled instead of long. Cash on delivery is available.',
      alt: 'BirSé desktop checkout - three-step progress (contact, delivery, payment) with a persistent order summary',
    },
    mobile: {
      kicker: 'Mobile commerce',
      title: 'Every decision was judged on a 375px screen first',
      text: '80% of traffic is mobile, so the biggest improvements live where the thumb does the work: filter entry, product scanning, and checkout confidence.',
      label: 'Filters, category page and checkout on mobile',
      phones: [
        {
          title: 'Filters as a bottom sheet',
          text: 'The grid stays visible first; filters slide up only when needed, with live result feedback to avoid dead-end searches.',
          alt: 'BirSé mobile filter bottom sheet - price range and filter groups with a result-count button',
        },
        {
          title: 'Category scanning',
          text: 'Filter chips, product density, and pagination stay familiar so shoppers can compare jewelry without relearning the store.',
          alt: 'BirSé mobile category page - gold earrings with filter and sort buttons',
        },
        {
          title: 'Next step always in reach',
          text: 'On mobile, the order total and the continue button stay fixed at the bottom, with a short SSL and returns reassurance beneath them.',
          alt: 'BirSé mobile checkout - contact step with the order total and continue button fixed at the bottom',
        },
      ],
    },
    navigation: {
      kicker: 'Product and navigation',
      title: 'Fewer taps to trust, browse, and buy',
      text: 'The navigation drawer and product page are designed for shoppers who arrive from ads and need orientation quickly: clear hierarchy, visible categories, and buying confidence above the fold.',
      label: 'Product page and navigation on mobile',
      phones: [
        {
          title: 'Product page confidence',
          text: 'The discounted price with the old price struck through, an installment button, and a fixed add-to-cart bar answer cost questions at the decision moment.',
          alt: 'BirSé mobile product page - gallery, price, installment button and a fixed add-to-cart bar',
        },
        {
          title: 'Visible menu choices',
          text: 'The drawer surfaces categories, promotions, and blog entry points without burying the main shopping paths.',
          alt: 'BirSé mobile navigation drawer - main categories, promotions link and store phone number',
        },
        {
          title: 'Two-tap drill-down',
          text: 'Audience tabs and subcategories reduce wandering, so a shopper can reach the right jewelry type quickly.',
          alt: 'BirSé mobile navigation drill-down - gold jewelry with audience tabs and subcategories',
        },
      ],
    },
    desktop: {
      kicker: 'Desktop states',
      title: 'The wider screens carry the full system',
      text: 'The desktop views show the same product logic at a calmer scale: promotional hierarchy, category browsing, cart confidence, and UI states that feel consistent instead of assembled page by page.',
      slides: [
        'BirSé desktop homepage with the Black Month promotional banner and trust strip',
        'BirSé desktop category page - gold earrings with filters and sorting',
        'BirSé desktop cart - item, quantity, order summary and checkout button',
      ],
    },
    visual: {
      kicker: 'Visual system',
      title: 'Warm luxury, built for clarity',
      text: `DM Serif Display adds softness to headlines and product names, while DM Sans keeps the commerce UI readable. Muted gold ${swatch('C9A96E')} and a deep burgundy ${swatch('7C2529')} make premium cues visible without making the store loud.`,
      alt: 'BirSé fine jewelry brand hero',
    },
    roles: {
      kicker: 'Roles',
      title: 'Who did what',
      items: [
        ['My role', 'UX strategy, UI/UX redesign, design system and handoff.'],
        [
          'What I designed',
          'Storefront, category and product pages, cart, checkout, and the mobile menu and filters.',
        ],
        ['What PFG did', 'Development and implementation of the design on the existing platform.'],
      ],
    },
    results: {
      kicker: 'Results',
      title: 'Numbers come after launch',
      text: 'No performance numbers are published yet. Conversion and mobile results will be added here once there is enough data since launch.',
    },
  },
  bg: {
    badge: 'Редизайнът е завършен',
    devLabel: 'Разработка',
    meta: [
      {
        label: 'Роля / услуги',
        items: ['UX стратегия', 'UI/UX редизайн', 'Дизайн система и предаване'],
      },
      { label: 'Клиент', items: [site, 'Фини бижута, от 2013 г.', `Изработка: ${pfg}`] },
      { label: 'Година и сектор', items: ['2026 ©', 'Онлайн търговия · бижута'] },
    ],
    heroAlt: 'Бранд снимка на бижутата BirSé',
    storefront: {
      kicker: 'Начална страница',
      title: 'Работещ магазин, издигнат без ново изграждане',
      text: 'BirSé вече се класираше в Google и продаваше, затова работата трябваше да изглежда премиум, без да чупи платформата. Началната страница запазва търговската логика и добавя редакционни разстояния, по-силни входове към категориите и по-топъл тон, подходящ за бижута.',
      alt: 'Началната страница на BirSé на десктоп – банер „Black Month“, лента с гаранции и избрани бижута',
    },
    pdp: {
      kicker: 'Продуктова страница',
      title: 'Увереност там, където цената кара да се колебаеш',
      text: 'Продуктовата страница събира намалената цена, плащането на вноски, гаранциите и пътя към количката в една зона на решение. Целта не е украса, а да махне съмнението, преди купувачът да напусне страницата.',
      alt: 'Продуктовата страница на BirSé на десктоп – галерия, намалена цена, количка, вноски и гаранции',
    },
    checkout: {
      kicker: 'Поръчка',
      title: 'Поръчка, в която следващата стъпка е винаги под ръка',
      text: 'Поръчката минава през три стъпки: контакт, доставка, плащане. Лентата за напредък показва докъде е купувачът, а обобщението стои до формата, така че процесът се усеща контролиран, а не дълъг. Може да се плати с наложен платеж.',
      alt: 'Поръчката на BirSé на десктоп – три стъпки (контакт, доставка, плащане) и обобщение на поръчката отстрани',
    },
    mobile: {
      kicker: 'Мобилна търговия',
      title: 'Всяко решение беше преценено първо на екран от 375 px',
      text: '80 % от посещенията са от телефон, затова най-големите подобрения са там, където работи палецът: филтрите, разглеждането на продукти и увереността при поръчка.',
      label: 'Филтри, категория и поръчка на телефон',
      phones: [
        {
          title: 'Филтри в долен панел',
          text: 'Продуктите се виждат първи; филтрите излизат отдолу само при нужда и показват броя резултати на живо, за да няма търсения без изход.',
          alt: 'Филтрите на BirSé на телефон – ценови диапазон, групи филтри и бутон с броя резултати',
        },
        {
          title: 'Разглеждане на категория',
          text: 'Бутоните за филтри, плътността на продуктите и страниците остават познати, за да се сравняват бижута, без магазинът да се учи наново.',
          alt: 'Категория на BirSé на телефон – златни обеци с бутони за филтриране и подреждане',
        },
        {
          title: 'Следващата стъпка винаги е под ръка',
          text: 'На телефон сумата и бутонът „Продължи“ стоят закрепени долу, а под тях има кратко уверение за SSL и връщане.',
          alt: 'Поръчка на BirSé на телефон – стъпка за контакт със сумата и бутона за продължаване, закрепени долу',
        },
      ],
    },
    navigation: {
      kicker: 'Продукт и навигация',
      title: 'По-малко докосвания до доверие, избор и покупка',
      text: 'Менюто и продуктовата страница са направени за хора, които идват от реклама и трябва бързо да се ориентират: ясна йерархия, видими категории и увереност за покупката още в първия екран.',
      label: 'Продуктова страница и навигация на телефон',
      phones: [
        {
          title: 'Увереност на продуктовата страница',
          text: 'Намалената цена до зачеркнатата стара, бутон за вноски и закрепена лента „Добави в количката“ отговарят на въпросите за цената в момента на решение.',
          alt: 'Продуктова страница на BirSé на телефон – галерия, цена, бутон за вноски и закрепена лента за количката',
        },
        {
          title: 'Видим избор в менюто',
          text: 'Менюто показва категориите, промоциите и блога, без да заравя основните пътища за пазаруване.',
          alt: 'Менюто на BirSé на телефон – основни категории, промоции и телефон на магазина',
        },
        {
          title: 'Две докосвания до целта',
          text: 'Разделите по аудитория и подкатегориите намаляват лутането, така че купувачът стига бързо до точния вид бижу.',
          alt: 'Навигацията на BirSé на телефон – златни бижута с раздели по аудитория и подкатегории',
        },
      ],
    },
    desktop: {
      kicker: 'Десктоп',
      title: 'По-широките екрани носят цялата система',
      text: 'Десктоп изгледите показват същата продуктова логика в по-спокоен мащаб: йерархия на промоциите, разглеждане на категории, увереност в количката и състояния на интерфейса, които изглеждат последователни, а не сглобени страница по страница.',
      slides: [
        'Началната страница на BirSé на десктоп с банера „Black Month“ и лентата с гаранции',
        'Категория на BirSé на десктоп – златни обеци с филтри и подреждане',
        'Количката на BirSé на десктоп – продукт, количество, обобщение и бутон за поръчка',
      ],
    },
    visual: {
      kicker: 'Визуална система',
      title: 'Топъл лукс, направен за яснота',
      text: `DM Serif Display добавя мекота на заглавията и имената на продуктите, а DM Sans държи търговския интерфейс четим. Приглушеното злато ${swatch('C9A96E')} и дълбокото бордо ${swatch('7C2529')} показват премиум сигналите, без магазинът да крещи.`,
      alt: 'Бранд снимка на бижутата BirSé',
    },
    roles: {
      kicker: 'Роли',
      title: 'Кой какво направи',
      items: [
        [
          'Моята роля',
          'UX стратегия, UI/UX редизайн, дизайн система и предаване на разработчиците.',
        ],
        [
          'Какво проектирах',
          'Началната страница, категориите и продуктовите страници, количката, поръчката, мобилното меню и филтрите.',
        ],
        ['Какво направи PFG', 'Разработка и внедряване на дизайна на съществуващата платформа.'],
      ],
    },
    results: {
      kicker: 'Резултати',
      title: 'Числата идват след пускането',
      text: 'Все още не публикувам числа. Резултатите за конверсиите и мобилните посещения ще се появят тук, когато се събере достатъчно данни.',
    },
  },
};

export const formaCopy = {
  en: {
    badge: 'Conceptual Project',
    meta: [
      { label: 'Role / Services', items: ['UX Strategy', 'UI Design', 'Web Development'] },
      { label: 'Client', items: ['FORMA Architects', 'Luxury architect persona'] },
      { label: 'Year &amp; Sector', items: ['2026 ©', 'Architecture · Luxury'] },
    ],
    heroAlt: 'FORMA Architects project hero image',
    live: 'View live site',
    trust: {
      kicker: 'Positioning',
      title: 'Trust before the first call',
      text: 'FORMA was built around a fictional luxury architecture studio serving Miami, Dubai, and the Greek Islands. The homepage had to feel established immediately, so the first desktop pass opens with scale, restraint, and portfolio-led proof.',
      alt: 'Walkthrough video of the FORMA Architects homepage and portfolio',
    },
    hero: {
      kicker: 'Hero experience',
      title: 'A cinematic opener, not a brochure hero',
      text: 'Luxury prospects buy into atmosphere before details. The full-width hero video gives the page a quiet architectural presence, then lets the work lead instead of explaining too much too early.',
      alt: 'FORMA Architects full-width hero walkthrough',
      eyebrow: 'Full width hero',
      heading: 'Uncompromising visual presence',
    },
    portfolio: {
      kicker: 'Portfolio system',
      title: 'A magazine spread, not a uniform grid',
      text: 'The portfolio hierarchy gives hero projects room to breathe while supporting pages stay quiet. The carousel shows how the same brass rule, typography scale, and editorial spacing carry across the full desktop experience.',
      slides: [
        'FORMA Architects project detail page for Desert Monolith',
        'FORMA Architects homepage desktop view',
        'FORMA Architects editorial portfolio listing desktop view',
        'FORMA Architects secondary portfolio desktop state',
        'FORMA Architects about page desktop view',
        'FORMA Architects services page desktop view',
        'FORMA Architects contact page desktop view',
      ],
    },
    mobile: {
      kicker: 'Mobile experience',
      title: 'The luxury tone had to survive a narrow viewport',
      text: 'The mobile views keep the same quiet confidence as desktop: large imagery, simple navigation moments, and service content that qualifies without feeling sales-heavy.',
      label: 'Mobile screens section',
      phones: [
        {
          title: 'Mobile homepage',
          text: 'The first screen keeps the brand cinematic while making the portfolio entry obvious on touch.',
          alt: 'FORMA Architects mobile homepage',
        },
        {
          title: 'Touch walkthrough',
          text: 'The interaction stays simple: movement supports the work, but the UI never asks the user to decode a new pattern.',
          alt: 'Walkthrough of the FORMA Architects mobile site',
        },
        {
          title: 'Service clarity',
          text: 'The service page explains scope without over-selling, so a qualified prospect knows whether to continue.',
          alt: 'FORMA Architects mobile services page',
        },
      ],
    },
    brand: {
      kicker: 'Brand system',
      title: 'Quiet luxury, enforced by restraint',
      text: `The brass accent ${swatch('B8956A')} appears only in moments that deserve attention. The result is a site that feels expensive because it stays controlled.`,
      alt: 'FORMA Architects social preview composition with the brand logo overlay',
      label: 'Full width image',
    },
  },
  bg: {
    badge: 'Концептуален проект',
    meta: [
      { label: 'Роля / услуги', items: ['UX стратегия', 'UI дизайн', 'Уеб разработка'] },
      { label: 'Клиент', items: ['FORMA Architects', 'Персона: луксозно архитектурно студио'] },
      { label: 'Година и сектор', items: ['2026 ©', 'Архитектура · лукс'] },
    ],
    heroAlt: 'Заглавна снимка на проекта FORMA Architects',
    live: 'Вижте живия сайт',
    trust: {
      kicker: 'Позициониране',
      title: 'Доверие още преди първия разговор',
      text: 'FORMA е измислено луксозно архитектурно студио с проекти в Маями, Дубай и гръцките острови. Началната страница трябваше веднага да изглежда утвърдена, затова първият екран на десктоп започва с мащаб, сдържаност и доказателства чрез портфолиото.',
      alt: 'Видео: началната страница и портфолиото на FORMA Architects',
    },
    hero: {
      kicker: 'Първи екран',
      title: 'Кинематографично начало, а не брошура',
      text: 'Клиентите в луксозния сегмент първо купуват атмосферата, после детайлите. Видеото на цялата ширина дава на страницата тихо архитектурно присъствие и оставя работата да води, вместо да обяснява твърде много твърде рано.',
      alt: 'Видео: първият екран на FORMA Architects на цялата ширина',
      eyebrow: 'Първи екран на цялата ширина',
      heading: 'Безкомпромисно визуално присъствие',
    },
    portfolio: {
      kicker: 'Портфолио',
      title: 'Разтвор от списание, а не еднаква мрежа',
      text: 'Йерархията в портфолиото дава въздух на водещите проекти, а помощните страници остават тихи. Каруселът показва как една и съща месингова линия, типографска скала и редакционни разстояния минават през целия десктоп сайт.',
      slides: [
        'FORMA Architects – страницата на проекта Desert Monolith',
        'FORMA Architects – началната страница на десктоп',
        'FORMA Architects – редакционният списък с проекти на десктоп',
        'FORMA Architects – второ състояние на портфолиото на десктоп',
        'FORMA Architects – страницата „За нас“ на десктоп',
        'FORMA Architects – страницата с услуги на десктоп',
        'FORMA Architects – страницата за контакт на десктоп',
      ],
    },
    mobile: {
      kicker: 'Мобилно',
      title: 'Луксозният тон трябваше да оцелее на тесен екран',
      text: 'Мобилните изгледи пазят същата тиха увереност като десктопа: големи снимки, прости моменти на навигация и съдържание за услугите, което отсява клиентите, без да звучи натрапчиво.',
      label: 'Мобилни екрани',
      phones: [
        {
          title: 'Мобилна начална страница',
          text: 'Първият екран пази кинематографичния бранд и прави входа към портфолиото очевиден при докосване.',
          alt: 'Мобилната начална страница на FORMA Architects',
        },
        {
          title: 'Разходка с докосване',
          text: 'Взаимодействието остава просто: движението подкрепя работата, но интерфейсът никога не кара човек да разгадава нов модел.',
          alt: 'Видео: мобилният сайт на FORMA Architects',
        },
        {
          title: 'Ясни услуги',
          text: 'Страницата с услуги обяснява обхвата, без да надценява, така че подходящият клиент знае дали да продължи.',
          alt: 'Страницата с услуги на FORMA Architects на телефон',
        },
      ],
    },
    brand: {
      kicker: 'Бранд система',
      title: 'Тих лукс, постигнат чрез сдържаност',
      text: `Месинговият акцент ${swatch('B8956A')} се появява само в моменти, които заслужават внимание. Резултатът е сайт, който изглежда скъп, защото остава под контрол.`,
      alt: 'Композиция за социални мрежи на FORMA Architects с логото отгоре',
      label: 'Снимка на цялата ширина',
    },
  },
};
