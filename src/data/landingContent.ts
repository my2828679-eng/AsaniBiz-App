import { BusinessTypeId } from '../types';

export type LandingLanguage = 'ur' | 'sd' | 'ps' | 'pa' | 'en';

export interface LocalizedString {
  ur: string;
  sd: string;
  ps: string;
  pa: string;
  en: string;
}

export interface LocalizedStringList {
  ur: string[];
  sd: string[];
  ps: string[];
  pa: string[];
  en: string[];
}

export interface LandingBusinessProfile {
  id: BusinessTypeId;
  name: LocalizedString;
  category: 'retail' | 'food' | 'fashion' | 'trade' | 'services' | 'logistics';
  icon: string;
  tagline: LocalizedString;
  keyTools: LocalizedStringList;
}

export interface LandingFeatureItem {
  id: string;
  icon: string;
  badge?: LocalizedString;
  title: LocalizedString;
  desc: LocalizedString;
  category: 'core' | 'advanced';
}

export interface LandingFaqItem {
  q: LocalizedString;
  a: LocalizedString;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO SECTION CONTENT (Strict Approved Brand Architecture)
// ─────────────────────────────────────────────────────────────────────────────
export const HERO_CONTENT: Record<
  LandingLanguage,
  {
    badge: string;
    mainHero: string;
    supporting: string;
    subtext: string;
    startFreeBtn: string;
    loginBtn: string;
    appBtn: string;
    livePreviewTag: string;
    nationalBadgeTitle: string;
    nationalBadgeSubtitle: string;
    proofs: string[];
  }
> = {
  ur: {
    badge: 'پاکستان کا مستند سمارٹ بزنس مینجمنٹ پلیٹ فارم',
    mainHero: 'جس کاروبار میں آسانی ہے، اس میں برکت اور سکون وسیع ہے۔',
    supporting: 'AsaniBiz — آپ کے کاروبار کا سمارٹ ڈیجیٹل ساتھی۔',
    subtext: 'کھاتہ، ادھار، تیز کاؤنٹر بلنگ، اسٹاک، کیش و بینک، واٹس ایپ رسید اور عملی AI منشی — سب ایک ہی جگہ محفوظ اور آسان۔',
    startFreeBtn: 'مفت شروع کریں (30 دن ٹرائل)',
    loginBtn: 'لاگ ان / اکاؤنٹ کھولیں',
    appBtn: 'AsaniBiz ایپ کھولیں',
    livePreviewTag: 'لائیو سسٹم ڈیمو',
    nationalBadgeTitle: 'چاروں صوبوں کا متفقہ اعتماد',
    nationalBadgeSubtitle: 'سندھ، پنجاب، خیبر پختونخوا، بلوچستان • قومی کاروباری برانڈ',
    proofs: [
      '100% آف لائن و آن لائن ڈیٹا سنک',
      'بغیر کارڈ 30 دن کا مفت ٹرائل',
      'تھرمل پرنٹر و واٹس ایپ رسید',
      '5 سرکاری زبانوں میں مکمل کنٹرول',
    ],
  },
  sd: {
    badge: 'پاڪستان جو مستند سمارٽ ڪاروباري پليٽ فارم',
    mainHero: 'جنهن ڪاروبار ۾ آساني آهي، ان ۾ برڪت ۽ سڪون وسيع آهي.',
    supporting: 'AsaniBiz — توهان جي ڪاروبار جو سمارٽ ڊجيٽل ساٿي.',
    subtext: 'کاتو، اڌارو، تيز ترين بلنگ، اسٽاڪ، ڪيش ۽ بينڪ، واٽس ايپ رسيد ۽ عملي AI منشي — سڀ محفوظ ۽ آسان.',
    startFreeBtn: 'مفت شروع ڪريو (30 ڏينهن ٽرائل)',
    loginBtn: 'لاگ ان / اڪائونٽ کوليو',
    appBtn: 'AsaniBiz ائپ کوليو',
    livePreviewTag: 'لائيو سسٽم پريويو',
    nationalBadgeTitle: 'چئن ئي صوبن جو اعتماد',
    nationalBadgeSubtitle: 'سنڌ، پنجاب، خيبر پختونخوا، بلوچستان • قومي ڪاروباري سڃاڻپ',
    proofs: [
      '100% آف لائن ۽ آن لائن سنڪ',
      'بغير ڪارڊ 30 ڏينهن جو مفت ٽرائل',
      'ٿرمل پرنٽر ۽ واٽس ايپ رسيد',
      '5 قومي ٻولين ۾ مڪمل ڪنٽرول',
    ],
  },
  ps: {
    badge: 'د پاکستان باوري سمارټ سوداګریز پلیټ فارم',
    mainHero: 'په کوم کاروبار کې چې اساني وي، په هغه کې برکت او سکون زیات وي.',
    supporting: 'AsaniBiz — ستاسو د کاروبار هوښیار ډیجیټل ملګری.',
    subtext: 'کهاتہ، پور (ادھار)، چټک بلینګ، سټاک، نغدې او بانک، واټس اپ رسید او عملی AI منشي — ټول په یو ځای خوندي او اسانه.',
    startFreeBtn: 'وړیا پیل کړئ (۳۰ ورځې ټرایل)',
    loginBtn: 'ننوتل / حساب خلاص کړئ',
    appBtn: 'AsaniBiz ایپ خلاص کړئ',
    livePreviewTag: 'ژوندی سیسټم کتنه',
    nationalBadgeTitle: 'د څلورو واړو صوبو باور',
    nationalBadgeSubtitle: 'خیبر پښتونخوا، سند، پنجاب، بلوچستان • ملي سوداګریز هویت',
    proofs: [
      '۱۰۰٪ آف لاین او کلاوډ بیک اپ',
      'پرته له کارډ ۳۰ ورځې وړیا ازموینه',
      'ترمل پرنټر او واټس اپ رسیدونه',
      'په ۵ رسمي ژبو کې بشپړ کنټرول',
    ],
  },
  pa: {
    badge: 'پاکستان دا مستند سمارٹ کاروباری پلیٹ فارم',
    mainHero: 'جس کاروبار وچ آسانی اے، اوس وچ برکت تے سکون وسیع اے۔',
    supporting: 'AsaniBiz — تواڈے کاروبار دا سمارٹ ڈیجیٹل ساتھی۔',
    subtext: 'کھاتہ، ادھار، تیز کاؤنٹر بلنگ، اسٹاک، کیش تے بینک، واٹس ایپ رسید تے اصلی AI منشی — سب اک تھاں محفوظ تے آسان۔',
    startFreeBtn: 'مفت شروع کرو (30 دن ٹرائل)',
    loginBtn: 'لاگ ان / کھاتہ کھولو',
    appBtn: 'AsaniBiz ایپ کھولو',
    livePreviewTag: 'لائیو سسٹم پریویو',
    nationalBadgeTitle: 'چاراں صوبیاں دا بھروسہ',
    nationalBadgeSubtitle: 'پنجاب، سندھ، خیبر پختونخوا، بلوچستان • قومی کاروباری برانڈ',
    proofs: [
      '100% آف لائن تے کلاؤڈ سنک',
      'بغیر کارڈ 30 دن دا مفت ٹرائل',
      'تھرمل پرنٹر تے واٹس ایپ رسید',
      '5 سرکاری بولیاں وچ پورا کنٹرول',
    ],
  },
  en: {
    badge: 'Pakistan’s Leading Smart Business Management Platform',
    mainHero: '“AsaniBiz — Jis karobar mein aasani hai, usmein barkat aur sukoon wasee hai.”',
    supporting: 'AsaniBiz — aapke karobar ka smart digital saathi.',
    subtext: 'Customer & supplier khata, fast POS billing, inventory, cash & bank registers, WhatsApp receipts, and operational AI Munshi — unified in one reliable system.',
    startFreeBtn: 'Start Free (30-Day Trial)',
    loginBtn: 'Login / Access App',
    appBtn: 'Open AsaniBiz App',
    livePreviewTag: 'Live System Preview',
    nationalBadgeTitle: 'Trusted Across All 4 Provinces',
    nationalBadgeSubtitle: 'Sindh, Punjab, Khyber Pakhtunkhwa, Balochistan • National Identity',
    proofs: [
      '100% Offline Durability & Cloud Sync',
      '30-Day Free Trial (No Card Needed)',
      'Thermal Printer & WhatsApp Slips',
      'Full Localization in 5 Official Languages',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. EVOLUTION STAGES (Streamlined, Non-Repetitive)
// ─────────────────────────────────────────────────────────────────────────────
export const EVOLUTION_STAGES: Record<
  LandingLanguage,
  {
    sectionTag: string;
    title: string;
    subtitle: string;
    stages: {
      badge: string;
      name: string;
      desc: string;
      points: string[];
      status: string;
      statusColor: string;
    }[];
  }
> = {
  ur: {
    sectionTag: 'کاروباری سفر',
    title: 'دستی کاغذی کھاتوں سے منظم پروفیشنل ادارے تک',
    subtitle: 'AsaniBiz آپ کے کاروبار کو روایتی پریشانیوں اور حساب کی غلطیوں سے نکال کر ایک تیز، خودکار نظام فراہم کرتا ہے۔',
    stages: [
      {
        badge: 'مرحلہ 1',
        name: 'روایتی کاغذی کھاتہ',
        desc: 'پرانے رجسٹر، صفحے پھٹنے اور گم ہونے کا خطرہ، زبانی ادھار اور شام کے وقت کیش کی گڑبڑ۔',
        points: ['گم ہونے والے رجسٹر', 'زبانی اسٹاک اور نقصان', 'گاہکوں سے حساب کے تنازعات'],
        status: 'غیر محفوظ',
        statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      },
      {
        badge: 'مرحلہ 2',
        name: 'ڈیجیٹل کاؤنٹر',
        desc: 'صرف 5 سیکنڈ میں کمپیوٹر یا موبائل سے پکا بل، بارکوڈ اسکیننگ اور واٹس ایپ پر ادھار رسید۔',
        points: ['ڈیجیٹل ادھار کھاتہ', 'بارکوڈ و کم اسٹاک الرٹ', 'موبائل واٹس ایپ سلپ'],
        status: 'تیز رفتار',
        statusColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      },
      {
        badge: 'مرحلہ 3',
        name: 'پروفیشنل ادارہ',
        desc: 'سپلائرز کا خودکار لیجر، روزانہ خالص منافع کی رپورٹس، ملازمین کے اختیارات اور AI منشی۔',
        points: ['خالص منافع (P&L) رپورٹ', 'پرچی کیمرہ اسکیننگ', 'اردو وائس AI منشی'],
        status: 'مکمل خودکار',
        statusColor: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      },
    ],
  },
  sd: {
    sectionTag: 'ڪاروباري ترقي',
    title: 'ڪاغذي پنن کان مڪمل منظم اداري تائين',
    subtitle: 'AsaniBiz توهان جي دڪان کي پراڻن وهانوٿن مان ڪڍي هڪ تيز ۽ خودڪار سسٽم ڏئي ٿو.',
    stages: [
      {
        badge: 'مرحلو 1',
        name: 'روايتي ڪاغذي کاتو',
        desc: 'ڪاغذي رجسٽر گم ٿيڻ جو ڊپ، زباني اڌارو ۽ حساب ڪتاب جا تنازعا.',
        points: ['پراڻا رجسٽر', 'سامان جو نقصان', 'حساب جي ڳڻتي'],
        status: 'غير محفوظ',
        statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      },
      {
        badge: 'مرحلو 2',
        name: 'ڊجيٽل ڪائونٽر',
        desc: '5 سيڪنڊن ۾ تيز ترين بل، بارڪوڊ سان اسٽاڪ ۽ واٽس ايپ تي بقايا ميسيج.',
        points: ['ڊجيٽل اڌارو کاتو', 'بارڪوڊ ۽ اسٽاڪ الرٽ', 'ٿرمل پرنٽ رسيد'],
        status: 'تيز رفتار',
        statusColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      },
      {
        badge: 'مرحلو 3',
        name: 'پروفيشنل ادارو',
        desc: 'سپلائرز ليجر، روزاني خالص منافعي جي رپورٽ، عملي جا اختيار ۽ سنڌي وائيس AI منشي.',
        points: ['خالص منافعي رپورٽ', 'پرچي ڪيمرا اسڪيننگ', 'سنڌي AI منشي'],
        status: 'مڪمل خودڪار',
        statusColor: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      },
    ],
  },
  ps: {
    sectionTag: 'د سوداګرۍ پرمختګ',
    title: 'له لاسي کتابچو څخه تر بشپړ ډیجیټل سیسټم پورې',
    subtitle: 'AsaniBiz ستاسو کاروبار له زړو حسابي ستونزو ژغوري او چټک، باوري ډیجیټل دفتر جوړوي.',
    stages: [
      {
        badge: 'لومړی پړاو',
        name: 'لاسي کتابچې',
        desc: 'د کاغذي پاڼو ورکېدل، شفاهي پورونه او د ماښام د نغدو پیسو بې حسابه کېدل.',
        points: ['د پاڼو ورکېدل', 'بې حسابه سټاک', 'د حساب لانجې'],
        status: 'بې باوره',
        statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      },
      {
        badge: 'دویم پړاو',
        name: 'ډیجیټل کاونټر',
        desc: 'په ۵ ثانیو کې چټک بل جوړول، د بارکوډ سکین او په واټس اپ د پور رسید استول.',
        points: ['ډیجیټل کهاتہ', 'د سټاک الرټ', 'واټس اپ رسید'],
        status: 'ګړندی',
        statusColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      },
      {
        badge: 'دریم پړاو',
        name: 'مسلکي اداره',
        desc: 'د عمده پلورونکو حساب، هره ورځ خالصه ګټه، د کارکوونکو واکونه او پښتو غږیز AI منشي.',
        points: ['د خالصې ګټې راپور', 'د پرچې کیمره او AI', 'غږیز هوښیار منشي'],
        status: 'پوره منظم',
        statusColor: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      },
    ],
  },
  pa: {
    sectionTag: 'کاروباری ترقی',
    title: 'کاغذی پرچیاں توں منظم پروفیشنل ادارے تیکر',
    subtitle: 'AsaniBiz تہاڈے کاروبار نوں پرانے رپھڑاں توں کڈ کے اک پکا تے سمارٹ سسٹم دیندا اے۔',
    stages: [
      {
        badge: 'مرحلہ 1',
        name: 'روایتی کاغذی کھاتہ',
        desc: 'پرانے رجسٹر، صفحے گواچن دا ڈر، زبانی ادھار تے حساب دیاں روز دیاں غلطیاں۔',
        points: ['گواچن والے رجسٹر', 'سامان دا نقصان', 'گاہکاں نال بحث'],
        status: 'غیر محفوظ',
        statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      },
      {
        badge: 'مرحلہ 2',
        name: 'ڈیجیٹل کاؤنٹر',
        desc: 'صرف 5 سیکنڈ وچ بل، بارکوڈ نال سودا تے واٹس ایپ اتے ادھار دا پکا میسج۔',
        points: ['ڈیجیٹل گاہک کھاتہ', 'بارکوڈ تے اسٹاک الرٹ', 'تھرمل پکی پرچی'],
        status: 'تیز رفتار',
        statusColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      },
      {
        badge: 'مرحلہ 3',
        name: 'پروفیشنل ادارہ',
        desc: 'سپلائر دا مکمل حساب، روزانہ خالص منافع، ملازماں دے اختیارات تے پنجابی AI منشی۔',
        points: ['خالص منافع دی رپورٹ', 'پرچی کیمرہ اسکیننگ', 'پنجابی وائس AI منشی'],
        status: 'مکمل خودکار',
        statusColor: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      },
    ],
  },
  en: {
    sectionTag: 'Business Evolution',
    title: 'From Fragile Paper Ledgers to Scalable Professional Operations',
    subtitle: 'AsaniBiz transitions merchants from chaotic manual notebooks into auditable, automated systems.',
    stages: [
      {
        badge: 'Stage 1',
        name: 'Manual Paper Registers',
        desc: 'Misplaced notebooks, unrecorded credit, disputed calculations, and daily cash drawer errors.',
        points: ['Vulnerable paper records', 'Uncounted stock shrinkage', 'Customer khata disputes'],
        status: 'Unreliable',
        statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
      },
      {
        badge: 'Stage 2',
        name: 'Digital Counter POS',
        desc: '5-second counter invoices, barcode inventory, and instant WhatsApp statements.',
        points: ['Digital customer ledger', 'Barcode & low-stock alerts', 'Thermal receipts & slips'],
        status: 'Fast & Digital',
        statusColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      },
      {
        badge: 'Stage 3',
        name: 'Audited Enterprise',
        desc: 'Supplier credit tracking, real-time audited P&L, multi-staff permissions, and AI Munshi.',
        points: ['Net profit & margin reports', 'Smart Parchi vision scanner', 'Voice-driven AI Munshi'],
        status: 'Fully Automated',
        statusColor: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE FEATURES & ADVANCED MODULES
// ─────────────────────────────────────────────────────────────────────────────
export const CORE_FEATURES: LandingFeatureItem[] = [
  {
    id: 'khata_udhaar',
    icon: 'BookOpen',
    badge: { ur: 'بنیادی کھاتہ', sd: 'بنيادي کاتو', ps: 'اصلي کهاتہ', pa: 'پکا کھاتہ', en: 'Core Khata' },
    title: { ur: 'گاہک و سپلائر ادھار کھاتہ', sd: 'گراهڪ ۽ سپلائر اڌارو کاتو', ps: 'د پیرودونکو او عرضه کوونکو کهاتہ', pa: 'گاہک تے سپلائر ادھار کھاتہ', en: 'Customer & Supplier Ledgers' },
    desc: {
      ur: 'گاہکوں اور سپلائرز کا مکمل لین دین، بقایا رقم اور واٹس ایپ پر ایک کلک اسٹیٹمنٹ۔',
      sd: 'گراهڪن ۽ سپلائرز جو مڪمل کاتو، اڌارو، بقايا ۽ واٽس ايپ تي فوري رسيد۔',
      ps: 'د پیرودونکو او عرضه کوونکو بشپړ حساب، پاتې پیسې او په واټس اپ خبرتیا۔',
      pa: 'گاہکاں تے سپلائراں دا پکا حساب، بقایا رقم تے واٹس ایپ پرچی۔',
      en: 'Complete ledger with debit/credit balance, repayment history, and 1-tap WhatsApp reminders.',
    },
    category: 'core',
  },
  {
    id: 'fast_pos_billing',
    icon: 'Receipt',
    badge: { ur: '5 سیکنڈ کاؤنٹر', sd: '5 سيڪنڊ بلنگ', ps: '۵ ثانیې بلینګ', pa: '5 سیکنڈ بلنگ', en: '5-Sec Checkout' },
    title: { ur: 'تیز ترین کاؤنٹر و پی او ایس بلنگ', sd: 'تيز ترين ڪائونٽر ۽ پي او ايس بلنگ', ps: 'ګړندی کاونټر او POS بلینګ', pa: 'تیز کاؤنٹر تے POS بلنگ', en: 'Fast Counter & POS Invoicing' },
    desc: {
      ur: 'بارکوڈ یا نام سے صرف 5 سیکنڈ میں بل بنائیں۔ 58mm/80mm تھرمل پرنٹر اور موبائل رسید۔',
      sd: 'بارڪوڊ يا نالي سان رڳو 5 سيڪنڊن ۾ بل ۽ ٿرمل پرنٽر رسيد تيار ڪريو۔',
      ps: 'په ۵ ثانیو کې د بارکوډ په مرسته بل جوړ کړئ او په حرارتي پرنټر چاپ کړئ۔',
      pa: 'بارکوڈ یا ناں نال صرف 5 سیکنڈ وچ بل بناؤ تے تھرمل پرنٹ کڈو۔',
      en: 'Issue clean counter invoices in seconds with barcode scanner, discounts, and thermal printing.',
    },
    category: 'core',
  },
  {
    id: 'stock_inventory',
    icon: 'Boxes',
    badge: { ur: 'نقصان سے بچاؤ', sd: 'نقصان کان بچاءُ', ps: 'د ضیاع مخنیوی', pa: 'نقصان توں بچاؤ', en: 'Zero Waste' },
    title: { ur: 'اسٹاک و انوینٹری کنٹرول', sd: 'اسٽاڪ ۽ انوينٽري ڪنٽرول', ps: 'د ګودام او سټاک کنټرول', pa: 'اسٹاک تے سامان کنٹرول', en: 'Multi-Unit Inventory Control' },
    desc: {
      ur: 'کلو، درجن، پیٹی، کارٹن، میٹر اور سائز کے مطابق اسٹاک۔ مال کم ہوتے ہی بروقت الرٹ۔',
      sd: 'ڪلو، درجن، پيٽي، ڪارٽن ۽ سائيز مطابق اسٽاڪ جو مڪمل حساب ۽ الرٽ۔',
      ps: 'په کیلو، درجن، کارټن او متر سټاک وڅارئ او د کمښت خبرتیا ترلاسه کړئ۔',
      pa: 'کلو، درجن، پیٹی، کارٹن تے سائز مطابق اسٹاک، مال مکن تے الرٹ۔',
      en: 'Track items across kg, liter, cartons, rolls, or sizes. Automatic low-stock warnings.',
    },
    category: 'core',
  },
  {
    id: 'cash_bank_wallets',
    icon: 'Coins',
    badge: { ur: 'شفاف کیش', sd: 'شفاف ڪيش', ps: 'د نغدو روڼتیا', pa: 'شفاف کیش', en: 'Cash & Bank' },
    title: { ur: 'کیش دراز، بینک، ایزی پیسہ و جاز کیش', sd: 'ڪيش دراز، بينڪ ۽ موبائل والٽس', ps: 'نغدې، بانک، ایزي پیسه او جاز کیش', pa: 'کیش دراز، بینک تے موبائل والٹ', en: 'Drawer Cash, Bank & Mobile Wallets' },
    desc: {
      ur: 'دکان کے گلے کا نقد کیش، بینک کھاتہ، ایزی پیسہ اور جاز کیش کا روزانہ مشترکہ حساب۔',
      sd: 'دڪان جي دراز جو روڪ ڪيش، بينڪ، ايزي پئسا ۽ جاز ڪيش جو گڏيل روزنامچو۔',
      ps: 'د دوکان نغدې، د بانک حساب، ایزي پیسه او جاز کیش یوځای وسنجوئ۔',
      pa: 'دکان دے گلے دی روکر، بینک کھاتہ تے ایزی پیسہ روزنامچہ۔',
      en: 'Reconcile drawer cash, bank accounts, Easypaisa, and JazzCash into one audited ledger.',
    },
    category: 'core',
  },
  {
    id: 'expenses_tracking',
    icon: 'TrendingDown',
    badge: { ur: 'خرچے کنٹرول', sd: 'خرچن جو ڪنٽرول', ps: 'د لګښت کنټرول', pa: 'خرچے کنٹرول', en: 'Expense Control' },
    title: { ur: 'روزانہ دکان کے اخراجات کا ریکارڈ', sd: 'روزانو دڪان جا سمورا خرچ', ps: 'د دوکان ورځني لګښتونه', pa: 'روزانہ دکان دے خرچے', en: 'Operational Expenses Tracking' },
    desc: {
      ur: 'بجلی بل، کرایہ، چائے پانی، ملازمین کی تنخواہ اور روزانہ متفرق اخراجات کا اندراج۔',
      sd: 'بجلي بل، دڪان جو ڀاڙو، چانهه پاڻي ۽ پگهارن جو فوري رڪارڊ۔',
      ps: 'د برېښنا بل، کرایه، چای، تنخواګانې او نور ورځني مصارف په آسانه ولیکئ۔',
      pa: 'بجلی دا بل، کرایہ، چاء پانی تے ملازماں دی تنخواہ دا روزانہ حساب۔',
      en: 'Record rent, utilities, staff payroll, transport, and daily operational overheads.',
    },
    category: 'core',
  },
  {
    id: 'profit_reports',
    icon: 'BarChart3',
    badge: { ur: 'حقیقی منافع', sd: 'حقيقي منافعو', ps: 'خالصه ګټه', pa: 'خالص منافع', en: 'Net Margin' },
    title: { ur: 'خالص منافع اور مالیاتی رپورٹس', sd: 'خالص منافعو ۽ مالي رپورٽون', ps: 'د خالصې ګټې او مالياتو راپورونه', pa: 'خالص منافع تے کاروباری رپورٹاں', en: 'Real-Time Net Profit & Analytics' },
    desc: {
      ur: 'روزانہ، ہفتہ وار اور ماہانہ خالص بچت۔ معلوم کریں کہ کس پروڈکٹ میں زیادہ منافع ہے۔',
      sd: 'ڏهاڙي ۽ مهيني جو اصل منافعو۔ معلوم ڪريو ته ڪهڙي مال ۾ وڌيڪ فائدو آهي۔',
      ps: 'ورځنۍ او میاشتنۍ ګټه وګورئ؛ معلومه کړئ چې کوم توکي زیاته ګټه کوي۔',
      pa: 'روزانہ تے مہینے دا خالص منافع، معلوم کرو کیہڑے سودے چ بوہتی کمائی اے۔',
      en: 'Instant breakdown of gross revenue, purchase costs, expenses, and true takeaway profit.',
    },
    category: 'core',
  },
  {
    id: 'ai_munshi_smart',
    icon: 'Sparkles',
    badge: { ur: 'عملی AI منشی', sd: 'عملي AI منشي', ps: 'هوښیار AI منشي', pa: 'اصلی AI منشی', en: 'AI Copilot' },
    title: { ur: 'اے آئی منشی — وائس و چیٹ اسسٹنٹ', sd: 'اي آئي منشي — آواز ۽ چيٽ اسسٽنٽ', ps: 'AI منشي — غږیز او متني مرستیال', pa: 'AI منشی — بول کے بل تے کھاتہ', en: 'AI Munshi Operational Assistant' },
    desc: {
      ur: 'اردو، سندھی، پشتو، پنجابی اور انگلش میں بول کر یا لکھ کر کھاتہ معلوم کریں اور بل بنائیں۔',
      sd: 'سنڌي، اردو يا انگريزي ۾ ڳالهائي يا لکي کاتو چيڪ ڪريو ۽ بل ٺاهيو۔',
      ps: 'په پښتو، اردو یا انګلیسي کې غږ وکړئ؛ AI سمدستي کهاتہ لټوي او کار اجرا کوي۔',
      pa: 'پنجابی، اردو یا انگلش وچ بول کے کھاتہ ویکھو تے بل تیار کرواؤ۔',
      en: 'Speak or text in regional Pakistani languages. The AI drives real software actions directly.',
    },
    category: 'advanced',
  },
  {
    id: 'parchi_camera_ai',
    icon: 'Camera',
    badge: { ur: 'ٹائپنگ سے نجات', sd: 'ٽائيپنگ کان آزادي', ps: 'له ټایپینګ خلاصون', pa: 'ٹائپنگ توں چھٹی', en: 'Vision OCR' },
    title: { ur: 'سمارٹ پرچی کیمرہ + AI ریڈنگ', sd: 'سمارٽ پرچي ڪيمرا + AI ريڊنگ', ps: 'د لاسي پرچې سمارټ کیمره او AI', pa: 'پرچی کیمرہ تے AI ریڈنگ', en: 'Smart Parchi Camera + AI Reader' },
    desc: {
      ur: 'سپلائر کی ہاتھ سے لکھی پرچی کی تصویر لیں۔ AI تفصیلات پڑھے گا، آپ چیک کر کے محفوظ کریں۔',
      sd: 'سپلائر جي پرچي جي تصوير وٺو۔ AI ان کي پڙهندو، اوهان چيڪ ڪري سيو ڪريو۔',
      ps: 'د لاسي پرچې عکس واخلئ؛ AI یې پخپله لولي، تایید یې کړئ او سټاک کې یې ثبت کړئ۔',
      pa: 'ہتھ دی لکھی پرچی دی تصویر کھچو، AI پڑھ کے اسٹاک چ پا دیوے گا۔',
      en: 'Snap paper invoices. AI extracts line items side-by-side for your review before committing.',
    },
    category: 'advanced',
  },
  {
    id: 'whatsapp_workflow',
    icon: 'Share2',
    badge: { ur: '1-کلک رسید', sd: '1-ڪلڪ رسيد', ps: 'په ۱ کلیک رسید', pa: '1-کلک رسید', en: '1-Tap Share' },
    title: { ur: 'واٹس ایپ بلنگ اور پرچی شیئرنگ', sd: 'واٽس ايپ بل ۽ رسيد شيئرنگ', ps: 'د واټس اپ بلینګ او رسیدونه', pa: 'واٹس ایپ بل تے پرچی شیئر', en: 'WhatsApp Invoicing & Statements' },
    desc: {
      ur: 'گاہک کو پروفیشنل واٹس ایپ ڈیجیٹل سلپ اور کھاتہ بقایا کا باوقار میسج بھیجیں۔',
      sd: 'گراهڪ کي واٽس ايپ تي صاف سٿري ڊجيٽل رسيد ۽ اڌاري جو ياد ڏهاني پيغام موڪليو۔',
      ps: 'پیرودونکي ته په واټس اپ پاک او رسمي رسید او د پاتې پیسو یادونه واستوئ۔',
      pa: 'گاہک نوں واٹس ایپ اتے پکی ڈیجیٹل رسید تے بقایا دا میسج بھیجو۔',
      en: 'Dispatch branded receipts and khata balances to customer WhatsApp with zero extra fees.',
    },
    category: 'advanced',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. SMART AI SECTION CONTENT
// ─────────────────────────────────────────────────────────────────────────────
export const SMART_AI_SECTION: Record<
  LandingLanguage,
  {
    sectionTag: string;
    title: string;
    concept: string;
    description: string;
    actionPrinciples: { title: string; desc: string }[];
    samplePrompts: { speaker: string; text: string; actionTitle: string; actionDesc: string }[];
  }
> = {
  ur: {
    sectionTag: 'عملی مصنوعی ذہانت',
    title: 'AI سمجھے — AsaniBiz کا سافٹ ویئر کام کرے',
    concept: 'AsaniBiz AI کوئی عام چیٹ بوٹ نہیں، بلکہ آپ کے کاروبار کا اصلی ڈیجیٹل منشی ہے۔',
    description: 'آپ اردو، سندھی، پشتو، پنجابی یا انگلش میں مائیک سے بولیں یا ٹائپ کریں۔ AI آپ کی بات کا مطلب سمجھ کر سافٹ ویئر میں بل تیار کرے گا، کھاتہ کھولے گا یا منافع بتائے گا۔',
    actionPrinciples: [
      {
        title: 'صرف مشورہ نہیں، سافٹ ویئر میں عمل',
        desc: 'جب آپ کہتے ہیں "علی کا کھاتہ دکھاؤ" تو AI سیدھا علی کا کھاتہ کھول دیتا ہے، محض باتیں نہیں بناتا۔',
      },
      {
        title: 'مالک کی تصدیق کے بعد محفوظ',
        desc: 'حساس مالیاتی اینٹری جیسے ادھار یا خرچ لکھنے سے پہلے سسٹم آپ کو اسکرین پر دکھاتا ہے تاکہ کوئی غلطی نہ ہو۔',
      },
      {
        title: 'ریاضیاتی درستی کی ضمانت',
        desc: 'جمع تفریق کا حساب AI کے اندازے سے نہیں بلکہ سافٹ ویئر کے مصدقہ میتھ کیلکولیٹر سے ہوتا ہے۔',
      },
    ],
    samplePrompts: [
      {
        speaker: 'آپ بولیں گے:',
        text: 'علی کریانہ اسٹور کا کھاتہ دکھاؤ، کتنا ادھار باقی ہے؟',
        actionTitle: 'AI منشی کا فوری ایکشن:',
        actionDesc: 'سافٹ ویئر فوراً علی کا کسٹمر لیجر کھول کر کل بقایا رقم، آخری وصولی اور ہسٹری اسکرین پر لائے گا۔',
      },
      {
        speaker: 'آپ بولیں گے:',
        text: 'آج کی کل سیل کتنی ہوئی اور نقد کیش کتنا ہے؟',
        actionTitle: 'AI منشی کا فوری ایکشن:',
        actionDesc: 'آج کی تمام کاؤنٹر انوائسز کا خلاصہ، کیش دراز کا ٹوٹل اور ڈیجیٹل ادائیگیاں ایک کلک میں دکھائے گا۔',
      },
      {
        speaker: 'آپ بولیں گے:',
        text: 'دکان کے بجلی بل کی مد میں 3500 روپے خرچ درج کرو۔',
        actionTitle: 'AI منشی کا فوری ایکشن:',
        actionDesc: 'اخراجات کے رجسٹر میں فورا "بجلی بل 3500 روپے" کا واؤچر بنا کر تصدیق کے لیے پیش کرے گا۔',
      },
      {
        speaker: 'آپ بولیں گے:',
        text: 'چیک کرو گودام میں باسمتی چاول اور چینی کتنی باقی ہے؟',
        actionTitle: 'AI منشی کا فوری ایکشن:',
        actionDesc: 'اسٹاک میں موجود چاول کی بوریاں، چینی کے تھیلے اور کم اسٹاک وارننگ اسکرین پر واضح کرے گا۔',
      },
    ],
  },
  sd: {
    sectionTag: 'عملي مصنوعي ذهانت',
    title: 'AI سمجهي — AsaniBiz جو سافٽ ويئر ڪم ڪري',
    concept: 'AsaniBiz AI رڳو ڳالهين وارو چيٽ بوٽ ناهي، پر توهان جو حقيقي ڊجيٽل منشي آهي.',
    description: 'توهان سنڌي، اردو يا انگريزي ۾ مائيڪ ذريعي ڳالهايو يا لکو۔ AI مطلب سمجهي بل ٺاهيندو ۽ کاتو سنڀاليندو.',
    actionPrinciples: [
      {
        title: 'سافٽ ويئر ۾ سڌو عمل',
        desc: 'جڏهن اوهان چوندؤ "علي جو کاتو کوليو" ته AI سڌو سنئون علي جو ليجر کولي رکندو.',
      },
      {
        title: 'مالڪ جي تصديق بعد محفوظ',
        desc: 'ڪنهن به مالي داخلائن کي پڪو ڪرڻ کان اڳ سافٽ ويئر توهان جي منظوري گهرندو.',
      },
      {
        title: 'حساب ڪتاب جي 100% پڪي درستي',
        desc: 'حساب ڪتاب AI جي اندازن سان نه پر سافٽ ويئر جي حسابي انجن سان 100% پڪو ٿيندو آهي.',
      },
    ],
    samplePrompts: [
      {
        speaker: 'توهان چوندؤ:',
        text: 'علي ڪرپٽ اسٽور جو کاتو ڏيکاريو، ان جو ڪيترو اڌارو باقي آهي؟',
        actionTitle: 'AI منشي جو عمل:',
        actionDesc: 'سافٽ ويئر سڌو علي جو کاتو کولي مڪمل بقايا ۽ وڪري جي لسٽ اسڪرين تي آڻيندو.',
      },
      {
        speaker: 'توهان چوندؤ:',
        text: 'اڄ جي ڪل سيل ڪيتري ٿي ۽ نقد ڪيش ڪيترو جمع ٿيو؟',
        actionTitle: 'AI منشي جو عمل:',
        actionDesc: 'اڄوڪي ڏينهن جو سمورو ڪيش دراز ۽ ڊجيٽل وصوليون تيار ڪري ڏيکاريندو.',
      },
      {
        speaker: 'توهان چوندؤ:',
        text: 'دڪان جي بجلي بل جي مد ۾ 3500 رپيا خرچ داخل ڪريو.',
        actionTitle: 'AI منشي جو عمل:',
        actionDesc: 'خرچن جي لسٽ ۾ فوري 3500 رپين جو بل واؤچر ٺاهي تصديق لاءِ پيش ڪندو.',
      },
      {
        speaker: 'توهان چوندؤ:',
        text: 'چيڪ ڪريو گودام ۾ کنڊ ۽ چانور ڪيترا بچيا آهن؟',
        actionTitle: 'AI منشي جو عمل:',
        actionDesc: 'اسٽاڪ ۾ موجود سامان جو انگ ۽ گهٽ اسٽاڪ جي خبرداري سامهون آڻيندو.',
      },
    ],
  },
  ps: {
    sectionTag: 'عملی مصنوعي ذهانت',
    title: 'AI پوهیږي — د AsaniBiz سافټویر کار کوي',
    concept: 'د AsaniBiz هوښیار AI منشي یوازې چټ بوټ نه دی، بلکې ستاسو د کاروبار اصلي کاري کوونکی دی.',
    description: 'په پښتو، اردو یا انګلیسي کې غږ وکړئ یا ولیکئ؛ AI ستاسو موخه درک کوي او په بلینګ، کهاتہ او سټاک کې مستقیم کار کوي.',
    actionPrinciples: [
      {
        title: 'مستقیم اجرا، نه خوشې خبرې',
        desc: 'کله چې وایئ "د احمد کهاتہ وښایه"، AI سمدلاسه د احمد اصلي کهاتہ پرانیزي.',
      },
      {
        title: 'د خاوند له تایید وروسته ثبت',
        desc: 'مالي او پور ثبتول مخکې له فاینل کېدو ستاسو مخې ته د تایید لپاره راځي.',
      },
      {
        title: 'د ریاضیاتو پوره ډاډ',
        desc: 'جمع او تفریق د سافټویر د کره محاسبې انجن لخوا ترسره کیږي.',
      },
    ],
    samplePrompts: [
      {
        speaker: 'تاسو وایئ:',
        text: 'د احمد کهاتہ وښایه، څومره پور ورباندې پاتې دی؟',
        actionTitle: 'د AI منشي چټک غبرګون:',
        actionDesc: 'سافټویر د احمد پاڼه پرانیزي او ټول پاتې پور او وروستي وصول شوي پیسې ښیي.',
      },
      {
        speaker: 'تاسو وایئ:',
        text: 'نن ټوله سیل څومره وه او په دراز کې نغدې څومره دي؟',
        actionTitle: 'د AI منشي چټک غبرګون:',
        actionDesc: 'د نن ورځې د پلور مجموعه او نغدې پیسې سمدستي حسابوي او ښیي.',
      },
      {
        speaker: 'تاسو وایئ:',
        text: 'د دوکان د برېښنا بل ۳۵۰۰ روپۍ مصرف ولیکه.',
        actionTitle: 'د AI منشي چټک غبرګون:',
        actionDesc: 'د لګښتونو په کتاب کې د ۳۵۰۰ روپیو واوچر جوړوي او تایید غواړي.',
      },
      {
        speaker: 'تاسو وایئ:',
        text: 'وګوره په ګودام کې بوره او وریجې څومره پاتې دي؟',
        actionTitle: 'د AI منشي چټک غبرګون:',
        actionDesc: 'په ګودام کې د بورې او وریجو شمېر او د ختمېدو خبرتیا وړاندې کوي.',
      },
    ],
  },
  pa: {
    sectionTag: 'عملی مصنوعی ذہانت',
    title: 'AI سمجھے — AsaniBiz دا سافٹ ویئر کم کرے',
    concept: 'AsaniBiz AI گلاں کرن والا بوٹ نہیں، تہاڈے کاروبار دا پکا ڈیجیٹل منشی اے۔',
    description: 'پنجابی، اردو یا انگلش وچ مائیک نال بولو یا ٹائپ کرو۔ AI مطلب سمجھ کے کھاتہ کھولے گا، بل بنائے گا تے منافع دسے گا۔',
    actionPrinciples: [
      {
        title: 'سافٹ ویئر وچ سدھا کم',
        desc: 'جدوں تسیں کہندے او "علی دا کھاتہ وکھاؤ"، تاں AI سدھا علی دا لیجر کھول کے رکھ دیندا اے۔',
      },
      {
        title: 'مالک دی منظوری توں بعد سیو',
        desc: 'ادھار یا خرچے دی کوئی وی انٹری دکاندار دی تصدیق توں بغیر فائنل نہیں ہوندی۔',
      },
      {
        title: 'حساب دی 100% پکی تسلی',
        desc: 'حساب کتاب AI دے اندازے نال نہیں، سافٹ ویئر دے مصدقہ کیلکولیٹر نال ہوندا اے۔',
      },
    ],
    samplePrompts: [
      {
        speaker: 'تسیں بولو گے:',
        text: 'علی کریانہ اسٹور دا کھاتہ وکھاؤ، کنا ادھار باقی اے؟',
        actionTitle: 'AI منشی دا فوری ایکشن:',
        actionDesc: 'سافٹ ویئر فوراً علی دا کھاتہ کھول کے کل بقایا رقم تے ہسٹری اسکرین اتے لے آوے گا۔',
      },
      {
        speaker: 'تسیں بولو گے:',
        text: 'اج دی کل سیل کنی ہوئی تے نقد کیش کنا جمع ہویا؟',
        actionTitle: 'AI منشی دا فوری ایکشن:',
        actionDesc: 'اج دیاں ساریاں انوائساں دا ٹوٹل تے کیش دراز دی رقم صاف وکھا دیوے گا۔',
      },
      {
        speaker: 'تسیں بولو گے:',
        text: 'دکان دے بجلی بل دے 3500 روپے خرچے وچ پا دیو۔',
        actionTitle: 'AI منشی دا فوری ایکشن:',
        actionDesc: 'خرچیاں دی لسٹ وچ 3500 دا واؤچر بنا کے تصدیق واسطے پیش کرے گا۔',
      },
      {
        speaker: 'تسیں بولو گے:',
        text: 'چیک کرو گودام وچ چاول تے کھنڈ کنے بچے نیں؟',
        actionTitle: 'AI منشی دا فوری ایکشن:',
        actionDesc: 'اسٹاک وچ موجود بوریاں تے گھٹ سامان دی وارننگ فوری اسکرین تے وکھائے گا۔',
      },
    ],
  },
  en: {
    sectionTag: 'Operational AI Intelligence',
    title: '“AI samjhay — AsaniBiz ka software kaam kare.”',
    concept: 'AsaniBiz AI is an operational business copilot engineered to execute real tasks inside your business software.',
    description: 'Speak naturally in Urdu, Sindhi, Pashto, Punjabi, or English. The AI parses your commercial intent and directly executes actions in billing, khata, stock, and expenses.',
    actionPrinciples: [
      {
        title: 'Direct Software Execution',
        desc: 'Asking "Show Ali’s khata" doesn’t return a conversational paragraph — it opens Ali’s live ledger account.',
      },
      {
        title: 'Owner Confirmation For Sensitive Entries',
        desc: 'Credit entries, purchases, and expenses are drafted for review before being permanently recorded.',
      },
      {
        title: 'Software-First Mathematical Integrity',
        desc: 'All arithmetic and balances are computed by deterministic software logic, never hallucinated by AI.',
      },
    ],
    samplePrompts: [
      {
        speaker: 'You Speak / Type:',
        text: '“Ali General Store ka khata dikhao, kitna udhaar baqaya hai?”',
        actionTitle: 'AI Munshi Action:',
        actionDesc: 'Instantly filters customer ledgers and opens Ali’s account showing net balance and past transaction history.',
      },
      {
        speaker: 'You Speak / Type:',
        text: '“Aaj ki total sale kitni hui aur cash drawer mein kitna hai?”',
        actionTitle: 'AI Munshi Action:',
        actionDesc: 'Computes all daily invoices, breaks down cash versus digital wallet payments, and displays daily takeaway.',
      },
      {
        speaker: 'You Speak / Type:',
        text: '“Shop electricity bill expense 3500 rupees add karo.”',
        actionTitle: 'AI Munshi Action:',
        actionDesc: 'Drafts an expense voucher categorized under utilities and presents an instant confirmation card.',
      },
      {
        speaker: 'You Speak / Type:',
        text: '“Check karo godaam mein cheeni aur basmati chawal kitna hai?”',
        actionTitle: 'AI Munshi Action:',
        actionDesc: 'Displays exact stock count, bags remaining, and flags reorder warnings if thresholds are crossed.',
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SMART PARCHI CAMERA SECTION
// ─────────────────────────────────────────────────────────────────────────────
export const SMART_PARCHI_SECTION: Record<
  LandingLanguage,
  {
    badge: string;
    title: string;
    subtitle: string;
    trustNotice: string;
    steps: { step: string; title: string; desc: string }[];
  }
> = {
  ur: {
    badge: 'ہاتھ کی لکھی پرچیاں و بل',
    title: 'سمارٹ پرچی کیمرہ + AI — ٹائپنگ کی مشقت ختم',
    subtitle: 'سپلائر کے ہاتھ سے لکھے بلوں کو گھنٹوں کمپیوٹر میں ٹائپ کرنے کی ضرورت نہیں۔ تصویر لیں، AI پڑھے گا اور آپ کی تصدیق سے اسٹاک میں درج ہو جائے گا۔',
    trustNotice: 'اصول: AI پرچی کو سمجھنے میں مدد کرتا ہے، اور دکاندار محفوظ کرنے سے پہلے ہر آئٹم اور ریٹ کو خود دیکھ کر تبدیل کر سکتا ہے۔',
    steps: [
      { step: '1', title: 'موبائل سے تصویر لیں', desc: 'ہاتھ کی لکھی پرچی کی تصویر بنائیں یا واٹس ایپ پر آیا ہوا بل گیلری سے اپلوڈ کریں۔' },
      { step: '2', title: 'AI پرچی کو پڑھے گا', desc: 'جدید ویژن ماڈل پرچی میں موجود سودا سلف کا نام، تعداد، ریٹ اور ٹوٹل الگ الگ پہچان لے گا۔' },
      { step: '3', title: 'اسکرین پر آمنے سامنے ریویو', desc: 'اصل پرچی کی تصویر اور تیار شدہ ٹیبل ساتھ دکھایا جاتا ہے تاکہ آپ تصدیق کر سکیں۔' },
      { step: '4', title: '1-کلک میں اسٹاک میں شامل', desc: 'تصدیق کرتے ہی سارا سودا اسٹاک میں شامل ہو جاتا ہے اور سپلائر کے کھاتے میں بل درج ہو جاتا ہے۔' },
    ],
  },
  sd: {
    badge: 'هٿ سان لکيل پرچيون ۽ بل',
    title: 'سمارٽ پرچي ڪيمرا + AI — ٽائيپنگ کان آزادي',
    subtitle: 'سپلائرز جي بلن کي ڪلاڪن تائين لکڻ جي ضرورت ناهي۔ تصوير ڪڍو، AI پڙهندو ۽ اوهان جي منظوري سان اسٽاڪ ۽ کاتي ۾ شامل ٿيندو.',
    trustNotice: 'اصول: AI پرچي پڙهڻ ۾ مدد ڪري ٿو، ۽ محفوظ ڪرڻ کان اڳ دڪاندار هر سامان جو اگهه چيڪ ۽ درست ڪري سگهي ٿو.',
    steps: [
      { step: '1', title: 'موبائل مان تصوير وٺو', desc: 'هٿ جي لکيل پرچي جي تصوير ڪڍو يا واٽس ايپ تان آيل بل گيلري مان چونو.' },
      { step: '2', title: 'AI پرچي کي پڙهندو', desc: 'ماڊل سامان جو نالو، اگهه ۽ ٽوٽل رقم خودڪار طريقي سان پڙهي ڌار ڪري ٿو.' },
      { step: '3', title: 'سامهون چيڪ ڪريو', desc: 'اصل پرچي جي تصوير ۽ ڊجيٽل لسٽ کي ڀيٽي ڪنهن به غلطي کي درست ڪريو.' },
      { step: '4', title: '1-ڪلڪ سان محفوظ', desc: 'منظوري بعد دٻايو ۽ سمورو سامان اسٽاڪ ۽ سپلائر کاتي ۾ داخل ٿي ويندو.' },
    ],
  },
  ps: {
    badge: 'لاسي پرچې او د عمده بلونه',
    title: 'د پرچې سمارټ کیمره او AI — له ټایپینګ خلاصون',
    subtitle: 'د عمده پلورونکو لاسي بلونه په ساعتونو ټایپ کولو ته اړتیا نشته؛ عکس واخلئ، AI به یې ولولي او ستاسو په تایید به یې سټاک کې ثبت کړي.',
    trustNotice: 'باوري اصل: AI د پرچې لوستلو کې مرسته کوي، او د خوندي کولو دمخه د دوکان خاوند هر توکی او قیمت بیا کتلای شي.',
    steps: [
      { step: '۱', title: 'له پرچې عکس واخلئ', desc: 'په موبایل د لاسي پرچې عکس واخلئ یا په واټس اپ راغلی بل له ګالري وټاکئ.' },
      { step: '۲', title: 'AI پرچه لولي', desc: 'هوښیار ماډل د جنس نوم، مقدار او نرخ په اتومات ډول پیژني او راوباسي.' },
      { step: '۳', title: 'مخامخ کتنه او بیاکتنه', desc: 'اصلي عکس او جوړ شوی جدول یو بل ته مخامخ ښودل کیږي ترڅو تصدیق یې کړئ.' },
      { step: '۴', title: 'په ۱ کلیک ثبتول', desc: 'د تایید په کلیک کولو سره ټول توکي سټاک ته ځي او د سپلائر په حساب کې ثبتيږي.' },
    ],
  },
  pa: {
    badge: 'ہتھ دیاں لکھیاں پرچیاں',
    title: 'سمارٹ پرچی کیمرہ تے AI — ٹائپنگ توں چھٹی',
    subtitle: 'سپلائراں دے ہتھ دے لکھے بل ہن گھنٹیاں بہہ کے کمپیوٹر چ پاون دی لوڑ نہیں۔ تصویر لوو، AI پڑھے گا تے تہاڈی منظوری نال کھاتے چ درج ہووے گا۔',
    trustNotice: 'اصول: AI پرچی نوں سمجھن چ مدد کردا اے، سیو کرن توں پہلاں دکاندار ہر ریٹ تے آئٹم چیک کر سکدا اے۔',
    steps: [
      { step: '1', title: 'موبائل نال تصویر کھچو', desc: 'ہتھ دی لکھی پرچی دی تصویر بناؤ یا واٹس ایپ توں آیا بل گیلری چوں چنو۔' },
      { step: '2', title: 'AI پرچی نوں پڑھے گا', desc: 'ماڈل سودے دا ناں، مقدار، ریٹ تے ٹوٹل الگ الگ پہچان لوے گا۔' },
      { step: '3', title: 'اسکرین تے ساہمنے ریویو', desc: 'اصل پرچی دی تصویر تے ٹیبل سامنے ہوندے نیں تاں جے تسیں تسلی کر سکو۔' },
      { step: '4', title: '1-کلک چ کھاتے چ درج', desc: 'اوکے کردیاں ای سارا مال اسٹاک چ شامل تے سپلائر کھاتے چ جمع ہو جاوے گا۔' },
    ],
  },
  en: {
    badge: 'Handwritten Bills & Supplier Slips',
    title: 'Smart Parchi Camera + AI — Stop Retyping Paper Slips',
    subtitle: 'Eliminate tedious data entry. Capture supplier invoices with your mobile camera; our vision AI extracts line items for side-by-side verification before saving.',
    trustNotice: 'Trust Principle: AI assists with reading; the merchant reviews and confirms every quantity and price before committing.',
    steps: [
      { step: '1', title: 'Capture or Pick Slip', desc: 'Snap a handwritten supplier parchi or select a shared invoice from your WhatsApp gallery.' },
      { step: '2', title: 'AI Extraction', desc: 'Vision model parses line items, unit measures, quantities, unit prices, and row totals.' },
      { step: '3', title: 'Side-by-Side Verification', desc: 'Your original photo sits beside the editable table for effortless accuracy checks.' },
      { step: '4', title: '1-Click Ledger & Stock Commit', desc: 'Confirming updates inventory counts and posts purchase liabilities to supplier ledgers.' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. WHATSAPP WORKFLOWS
// ─────────────────────────────────────────────────────────────────────────────
export const WHATSAPP_WORKFLOW_SECTION: Record<
  LandingLanguage,
  {
    badge: string;
    title: string;
    subtitle: string;
    benefits: { title: string; desc: string }[];
  }
> = {
  ur: {
    badge: 'موبائل واٹس ایپ انضمام',
    title: 'واٹس ایپ بلنگ اور پرچی شیئرنگ — فوری اور باوقار',
    subtitle: 'کسی مہنگے API کے بغیر، اپنے عام فون کے واٹس ایپ سے گاہکوں کو پروفیشنل رسیدیں اور ادھار اسٹیٹمنٹ بھیجیں۔',
    benefits: [
      { title: 'ڈیجیٹل رسید موبائل پر', desc: 'بل بنتے ہی ایک بٹن سے گاہک کے واٹس ایپ پر دکان کے نام اور آئٹمز کے ساتھ صاف رسید بھیجیں۔' },
      { title: 'ادھار کھاتہ کا خودکار ریمائنڈر', desc: 'ماہانہ بقایا رقم کا باوقار میسج بھیجیں تاکہ تعلقات خوشگوار رہیں اور ادھار بروقت واپس آئے۔' },
      { title: 'سپلائر بلتی اور ادائیگی ثبوت', desc: 'مال کی ادائیگی اور کانٹا پرچی کا عکس فوری طور پر سپلائر کے واٹس ایپ پر بطور ثبوت روانہ کریں۔' },
      { title: 'کوئی اضافی ماہانہ چارجز نہیں', desc: 'یہ آپ کے فون کے اصل واٹس ایپ سے کام کرتا ہے، اس لیے کسی مہنگے کنٹریکٹ کی ضرورت نہیں۔' },
    ],
  },
  sd: {
    badge: 'واٽس ايپ سهولت',
    title: 'واٽس ايپ بلنگ ۽ رسيد شيئرنگ — فوري ۽ آسان',
    subtitle: 'بغير ڪنهن واڌو خرچ جي، پنهنجي موبائل فون ذريعي گراهڪ کي خوبصورت واٽس ايپ بل ۽ کاتي جي لسٽ موڪليو.',
    benefits: [
      { title: 'ڊجيٽل رسيد گراهڪ جي فون تي', desc: 'بل ٺهڻ شرط هڪ ڪلڪ سان دڪان جي نالي ۽ رقم سان واٽس ايپ ميسيج اماڻيو.' },
      { title: 'اڌارو کاتو ياد ڏيارڻ جو پيغام', desc: 'گراهڪ کي رهيل اڌاري رقم جو سٺو ميسيج موڪليو ته جيئن وقت تي پئسا وصول ٿين.' },
      { title: 'سپلائر بلتي جو پڪو ثبوت', desc: 'مال خريد ڪرڻ ۽ پئسا اماڻڻ جو ثبوت سڌو سنئون سپلائر جي واٽس ايپ تي اماڻيو.' },
      { title: 'ڪوبه واڌو خرچ ناهي', desc: 'اهو سڌو توهان جي موبائل واٽس ايپ سان ڪم ڪري ٿو، ڪنهن به مهانگي اڪائونٽ جي ضرورت ناهي.' },
    ],
  },
  ps: {
    badge: 'د واټس اپ یوځای والی',
    title: 'د واټس اپ بلینګ او رسیدونه — چټک او باوري',
    subtitle: 'پرته له اضافي لګښته، له خپل عادي واټس اپ څخه پیرودونکو ته رسمي رسیدونه او د پور یادونې واستوئ.',
    benefits: [
      { title: 'د پیرودونکي په موبایل رسید', desc: 'د بل په جوړېدو سره سمدستي د دوکان په نوم پاک رسید په واټس اپ واستوئ.' },
      { title: 'د پاتې پور درناوی یادونه', desc: 'د میاشتې په پای کې پیرودونکي ته د پور مهربانه خبرتیا واستوئ ترڅو نغدې ژر وصول شي.' },
      { title: 'د عرضه کوونکي بلتي او ثبوت', desc: 'د مال رسېدو او پیسو لېږلو رسیدونه مستقیماً عمده پلورونکي ته واستوئ.' },
      { title: 'هیڅ اضافي میاشتنی لګښت نشته', desc: 'دا ستاسو د موبایل له خپل عادي واټس اپ څخه کار اخلي؛ اضافي فیس نشته.' },
    ],
  },
  pa: {
    badge: 'واٹس ایپ سہولت',
    title: 'واٹس ایپ بلنگ تے پرچی شیئرنگ — فوری تے سوکھی',
    subtitle: 'کسے مہنگے خرچے توں بغیر، اپنے فون دے واٹس ایپ توں گاہک نوں پکی رسید تے کھاتہ بیلنس بھیجو۔',
    benefits: [
      { title: 'ڈیجیٹل رسید گاہک دے موبائل تے', desc: 'بل بن دے ای اک بٹن نال دکان دے ناں تے ریٹ نال صاف ستھری رسید واٹس ایپ کرو۔' },
      { title: 'ادھار کھاتے دا سوہنا ریمائنڈر', desc: 'گاہک نوں باقی رقم دا پکا میسج بھیجو تاں جے تعلق وی ٹھیک روے تے ادھار وی مڑے۔' },
      { title: 'سپلائر بلتی تے پکا ثبوت', desc: 'مال دی ادائیگی تے کانٹا پرچی دا فوٹو سدھا سپلائر دے واٹس ایپ اتے بھیجو۔' },
      { title: 'کوئی چھپیا فیس یا خرچہ نہیں', desc: 'ایہ تہاڈے اپنے موبائل دے واٹس ایپ نال چلدا اے، کسے فالتو خرچے دی لوڑ نہیں۔' },
    ],
  },
  en: {
    badge: 'Direct WhatsApp Integration',
    title: 'WhatsApp Invoicing & Ledger Statements',
    subtitle: 'Zero expensive developer APIs required. Share formatted invoices and outstanding balances directly through your regular smartphone.',
    benefits: [
      { title: 'Instant Digital Customer Receipt', desc: 'Dispatch clean digital invoices with your shop branding and line items with 1 tap.' },
      { title: 'Polite Khata Balance Reminders', desc: 'Send clear balance statements showing previous balances, repayments, and due amounts.' },
      { title: 'Supplier Bilty & Payment Proof', desc: 'Instantly share delivery slips, weighbridge receipts, and payment confirmations.' },
      { title: 'Works With Your Everyday Phone', desc: 'Harnesses standard WhatsApp web and mobile sharing intents without extra fees.' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. SUPPORTED BUSINESS PROFILES (12 Core Sectors)
// ─────────────────────────────────────────────────────────────────────────────
export const SUPPORTED_BUSINESSES: LandingBusinessProfile[] = [
  {
    id: 'kiryana',
    category: 'retail',
    icon: 'Store',
    name: { ur: 'کریانہ و جنرل سٹور', sd: 'ڪريانا ۽ جنرل اسٽور', ps: 'کریانه او عمومي دوکان', pa: 'کریانہ تے جنرل سٹور', en: 'Grocery & General Store' },
    tagline: { ur: 'دالیں، گھی، راشن، مصالحہ جات اور روزمرہ سودا', sd: 'راشن، گيهه، دالون ۽ روزانو سامان', ps: 'اوړه، غوړي، دال او ورځني سودا', pa: 'دالاں، گھیو، راشن تے روز دا سودا', en: 'Grains, oil, spices, provisions & daily FMCG goods' },
    keyTools: {
      ur: ['کلو و پیکٹ بلنگ', 'محلہ دار ادھار کھاتہ', 'کم اسٹاک الرٹس', 'بارکوڈ ریڈنگ'],
      sd: ['ڪلو ۽ پيڪٽ بلنگ', 'محلي جو اڌارو کاتو', 'اسٽاڪ الرٽس', 'بارڪوڊ ريڊنگ'],
      ps: ['په کیلو او بنډل بلینګ', 'د محلي پیرودونکو پور کهاتہ', 'د سټاک خبرتیا', 'بارکوډ سکین'],
      pa: ['کلو تے پیکٹ بلنگ', 'محلے دا ادھار کھاتہ', 'اسٹاک الرٹس', 'بارکوڈ ریڈنگ'],
      en: ['Weight & packet billing', 'Neighborhood khata', 'Low-stock warnings', 'Barcode scanning'],
    },
  },
  {
    id: 'clothing',
    category: 'fashion',
    icon: 'Shirt',
    name: { ur: 'کپڑے و ریڈی میڈ گارمنٹس', sd: 'ڪپڙن ۽ وڳن جو دڪان', ps: 'کالي، رخت او جامې', pa: 'کپڑے تے ریڈی میڈ گارمنٹس', en: 'Clothing & Garments' },
    tagline: { ur: 'ان سلے سوٹ، فینسی ملبوسات اور سائز/رنگ ورائٹی', sd: 'اڻ سبييل وڳا ۽ سائيز/رنگ ورائٽي', ps: 'ګنډل شوي او بې ګنډلو کالي او رنګونه', pa: 'ان سلے سوٹ، فینسی کپڑے تے سائز ورائٹی', en: 'Unstitched suits, readymade apparel & size/color variants' },
    keyTools: {
      ur: ['سائز و کلر ورائٹی', 'تھان و میٹر پیمائش', 'بارکوڈ ٹیگز', 'سیزنل ادھار ریکوری'],
      sd: ['سائيز ۽ رنگ ورائٽي', 'ٿان ۽ ميٽر حساب', 'بارڪوڊ ٽيگ', 'اڌارو وصولي'],
      ps: ['اندازه او رنګونه', 'د گز او متر حساب', 'بارکوډ لیبل', 'د پور وصولي'],
      pa: ['سائز تے رنگ ورائٹی', 'تھان تے میٹر پیمائش', 'بارکوڈ ٹیگ', 'سیزنل ادھار وصولی'],
      en: ['Size & color matrix', 'Roll & meter calculations', 'Barcode tags', 'Seasonal khata recovery'],
    },
  },
  {
    id: 'mobile',
    category: 'services',
    icon: 'Smartphone',
    name: { ur: 'موبائل شاپ و ریپیرنگ', sd: 'موبائل دڪان ۽ مرمت', ps: 'موبایل دوکان او ترمیم', pa: 'موبائل شاپ تے ریپیرنگ', en: 'Mobile Shop & Repairing' },
    tagline: { ur: 'اسمارٹ فونز، IMEI ٹریکنگ، ایکسیسریز اور ریپیرنگ ٹوکن', sd: 'موبائل فونز، IMEI نمبر ۽ مرمت', ps: 'سمارټ فونونه، IMEI نمبر او د ترمیم پرچۍ', pa: 'موبائل فون، IMEI ٹریکنگ تے مرمت جاب', en: 'Smartphones, IMEI tracking, accessories & repair tokens' },
    keyTools: {
      ur: ['IMEI نمبر اسکین', 'وارنٹی و ریپیرنگ ٹوکن', 'ایکسیسریز بلنگ', 'کسٹمر ریکارڈ'],
      sd: ['IMEI نمبر اسڪين', 'وارنٽي ۽ مرمت ڪارڊ', 'سامان بلنگ', 'گراهڪ رڪارڊ'],
      ps: ['IMEI سکین', 'د ترمیم ټوکن او تضمین', 'لوازم او بلینګ', 'د پیرودونکي ریکارډ'],
      pa: ['IMEI نمبر اسکین', 'وارنٹی تے مرمت پرچی', 'سامان دی بلنگ', 'کسٹمر ریکارڈ'],
      en: ['IMEI serial scan', 'Repair job tokens', 'Accessories catalog', 'CNIC & customer ledger'],
    },
  },
  {
    id: 'pharmacy',
    category: 'retail',
    icon: 'Cross',
    name: { ur: 'فارمیسی و میڈیکل سٹور', sd: 'فارميسي ۽ ميڊيڪل اسٽور', ps: 'درملتون او میډیکل سټور', pa: 'فارمیسی تے میڈیکل سٹور', en: 'Pharmacy & Medical Store' },
    tagline: { ur: 'دوائیں، بیچ نمبر، ایکسپائری تاریخ اور ڈاکٹر نسخہ بلنگ', sd: 'دوائون، بيچ نمبر ۽ ختم تاريخ', ps: 'درمل، بیچ نمبر، د پای نیټه او نسخې', pa: 'دوائیاں، بیچ نمبر، ایکسپائری تے نسخہ بلنگ', en: 'Medicines, batch serials, expiry tracking & prescriptions' },
    keyTools: {
      ur: ['بیچ و ایکسپائری الرٹس', 'پتہ/گولی بمقابلہ ڈبہ', 'ڈسٹری بیوٹر پرچی ریڈنگ', 'فارمولا سرچ'],
      sd: ['بيچ ۽ ختم تاريخ الرٽ', 'گوري بمقابله دٻو', 'ڊسٽريبيوٽر بلنگ', 'فارمولا ڳولا'],
      ps: ['د پای نیټې الرټ', 'ګولۍ او ډبې جلا کول', 'د عرضه کوونکي بل', 'د فارمول سرچ'],
      pa: ['بیچ تے ایکسپائری الرٹ', 'پتہ بمقابلہ ڈبہ', 'سپلائر بل ریڈنگ', 'فارمولا تلاش'],
      en: ['Batch & expiry alerts', 'Strip vs Box dispensing', 'Distributor invoice OCR', 'Formula search'],
    },
  },
  {
    id: 'fruit_veg',
    category: 'food',
    icon: 'Apple',
    name: { ur: 'سبزی، فروٹ و منڈی شاپ', sd: 'ڀاڄيون، ميوو ۽ منڊي دڪان', ps: 'سبزي، میوه او منډي دوکان', pa: 'سبزی، فروٹ تے منڈی شاپ', en: 'Fruit, Vegetable & Mandi' },
    tagline: { ur: 'روزانہ منڈی خریداری، وزن و پیمائش اور نقد کاؤنٹر', sd: 'منڊي خريداري، وزن ۽ روڪ وڪرو', ps: 'د منډۍ ورځنۍ سودا، وزن او نغدې پلور', pa: 'روزانہ منڈی خریداری، وزن تے نقد کاؤنٹر', en: 'Daily wholesale sourcing, weight conversions & cash desk' },
    keyTools: {
      ur: ['منڈی خریداری لاگت', 'کلو و دھڑی ریٹ', 'روزانہ ضیاع (Wastage) حساب', 'فوری نقد کاؤنٹر'],
      sd: ['منڊي خريداري لاڳت', 'ڪلو ۽ ڌڙي ريٽ', 'خراب مال حساب', 'روڪ ڪائونٽر'],
      ps: ['د منډۍ د پیرود قیمت', 'کیلو او د من حساب', 'د ضایعاتو څارنه', 'چټک نغدي کاونټر'],
      pa: ['منڈی خریداری خرچہ', 'کلو تے دھڑی ریٹ', 'نقصان دا حساب', 'تیز کاؤنٹر'],
      en: ['Mandi purchase cost', 'Kg/Dhaari calculation', 'Wastage tracking', 'Fast cash checkout'],
    },
  },
  {
    id: 'meat_shop',
    category: 'food',
    icon: 'UtensilsCrossed',
    name: { ur: 'گوشت و چکن شاپ', sd: 'ڳئون، ٻڪري ۽ ڪڪڙ گوشت', ps: 'د غوښې او چرګانو دوکان', pa: 'گوشت تے چکن شاپ', en: 'Meat & Poultry Shop' },
    tagline: { ur: 'زندہ وزن بمقابلہ صاف گوشت اور ہوٹل کھاتہ', sd: 'جيئرو وزن ۽ صاف گوشت حساب', ps: 'ژوندی وزن او پاکه غوښه، د هوټل حساب', pa: 'جیوندا وزن بمقابلہ صاف گوشت تے ہوٹل کھاتہ', en: 'Live weight vs dressed yield & restaurant supply ledgers' },
    keyTools: {
      ur: ['زندہ مرغی فارمولا', 'ہوٹل کھاتہ لیجر', 'قصاب مزدوری ریکارڈ', 'تیز نقد رسید'],
      sd: ['جيئري ڪڪڙ فارمولا', 'هوٽل کاتو', 'قصائي مزدوري', 'روڪ رسيد'],
      ps: ['د ژوندي چرګ فارموله', 'د هوټلونو پور کهاتہ', 'د کارګر مزدوري', 'نغدي رسید'],
      pa: ['جیوندی مرغی فارمولا', 'ہوٹل کھاتہ لیجر', 'قصاب دی مزدوری', 'تیز رسید'],
      en: ['Live-to-dressed yield', 'Restaurant supply khata', 'Butchery labor', 'Instant cash slips'],
    },
  },
  {
    id: 'bakery',
    category: 'food',
    icon: 'Cake',
    name: { ur: 'بیکری و سوئٹس (مٹھائی)', sd: 'بيڪري ۽ مٺائي جو دڪان', ps: 'بیکري او خواږه (مټهايي)', pa: 'بیکری تے مٹھائی شاپ', en: 'Bakery & Sweets' },
    tagline: { ur: 'کیک، بسکٹ، مٹھائی ڈبے اور تقریبات کے آرڈرز', sd: 'ڪيڪ، بسڪيٽ، مٺائي دٻا ۽ آرڊر', ps: 'کیک، بسکټ، د خوږو ډبې او آرډرونه', pa: 'کیک، بسکٹ، مٹھائی دے ڈبے تے آرڈر', en: 'Cakes, confectionery, sweet boxes & catering orders' },
    keyTools: {
      ur: ['ایڈوانس آرڈر بکنگ', 'مٹھائی ڈبہ کلو وزن', 'خام مال انوینٹری', 'ٹچ پی او ایس بلنگ'],
      sd: ['اڳواٽ آرڊر بڪنگ', 'مٺائي دٻي جو وزن', 'خام مال اسٽاڪ', 'ٽچ پي او ايس'],
      ps: ['مخکینی آرډر ثبتول', 'د مټهايي وزن ډبه', 'د پخولو خام مواد', 'ټچ سکرین بلینګ'],
      pa: ['ایڈوانس آرڈر بکنگ', 'مٹھائی ڈبہ وزن', 'خام مال انوینٹری', 'ٹچ اسکرین بلنگ'],
      en: ['Advance order bookings', 'Custom box weights', 'Raw material stock', 'Touchscreen POS'],
    },
  },
  {
    id: 'hardware',
    category: 'trade',
    icon: 'Wrench',
    name: { ur: 'ہارڈویئر و سینیٹری سٹور', sd: 'هارڊويئر ۽ سينيٽري دڪان', ps: 'هارډویر او ودانیز توکي', pa: 'ہارڈویئر تے سینیٹری سٹور', en: 'Hardware & Sanitary' },
    tagline: { ur: 'پائپ، فٹنگز، پینٹ، سیمنٹ اور ٹھیکیدار کھاتہ', sd: 'پائپ، رنگ، سيمينٽ ۽ ٺيڪيدار کاتو', ps: 'پایپ، رنګ، سیمنټ او د ټیکه دارانو حساب', pa: 'پائپ، فٹنگ، رنگ، سیمنٹ تے ٹھیکیدار کھاتہ', en: 'Pipes, fittings, paints, tools & contractor credit ledgers' },
    keyTools: {
      ur: ['ٹھیکیدار پراجیکٹ کھاتہ', 'فٹ و انچ پیمائش', 'سپلائر بلتی رسید', 'مختلف برانڈز انوینٹری'],
      sd: ['ٺيڪيدار پروجيڪٽ کاتو', 'فٽ ۽ انچ ماپ', 'سپلائر بلتي رسيد', 'برانڊ اسٽاڪ'],
      ps: ['د ټیکه دارانو حساب', 'فټ او انچ پیمانه', 'د بار وړلو بلتي', 'د برانډونو سټاک'],
      pa: ['ٹھیکیدار پراجیکٹ کھاتہ', 'فٹ تے انچ پیمائش', 'سپلائر بلتی رسید', 'برانڈز انوینٹری'],
      en: ['Contractor project khata', 'Foot/Inch units', 'Freight bilty audit', 'Multi-brand stock'],
    },
  },
  {
    id: 'autoparts',
    category: 'trade',
    icon: 'Car',
    name: { ur: 'آٹو پارٹس و ورکشاپ', sd: 'آٽو پارٽس ۽ ورڪشاپ', ps: 'د موټر پرزې او ورکشاپ', pa: 'آٹو پارٹس تے ورکشاپ', en: 'Auto Parts & Workshop' },
    tagline: { ur: 'گاڑی، بائیک پارٹس، لبریکنٹس اور مکینک اجرت', sd: 'گاڏين جا پارٽس ۽ مستري جو حساب', ps: 'د موټرو او موټرسایکل پرزې او مستري مزدوري', pa: 'گاڈی، بائیک پارٹس تے مکینک دی مزدوری', en: 'Automobile parts, lubricants, mechanic labor & vehicle jobs' },
    keyTools: {
      ur: ['گاڑی ماڈل و پارٹ نمبر', 'مکینک مزدوری + پرزہ بل', 'آئل چینج ہسٹری', 'سپلائر ادھار کھاتہ'],
      sd: ['پارٽ نمبر ۽ ماڊل', 'مستري مزدوري ۽ سامان', 'آئل تبديلي ياد ڏهاني', 'سپلائر کاتو'],
      ps: ['د موټر ماډل او د پرزې نمبر', 'مزدوري + پرزه یوځای بل', 'د تېلو بدلولو تاریخ', 'سپلائر پور'],
      pa: ['گاڈی ماڈل تے پارٹ نمبر', 'مکینک مزدوری + پرزہ بل', 'آئل چینج ہسٹری', 'سپلائر کھاتہ'],
      en: ['OEM part & model lookup', 'Labor + parts invoice', 'Oil change logs', 'Supplier khata'],
    },
  },
  {
    id: 'transport',
    category: 'logistics',
    icon: 'Truck',
    name: { ur: 'ٹرانسپورٹ و گڈز فارورڈنگ', sd: 'ٽرانسپورٽ ۽ مال پهچائڻ', ps: 'ټرانسپورټ او بار وړل', pa: 'ٹرانسپورٹ تے گڈز فارورڈنگ', en: 'Transport, Cargo & Logistics' },
    tagline: { ur: 'ٹرک، ٹریلر، بلٹی، ڈرائیور خرچ، ڈیزل اور پارٹی حساب', sd: 'ٽرڪ، ٻلٽي، ڊيزل ۽ ڀاڙو حساب', ps: 'لارۍ، بلتي، د ډرایور لګښت، ډیزل او کرایه', pa: 'ٹرک، بلٹی، ڈرائیور خرچہ، ڈیزل تے کرایہ حساب', en: 'Trucks, fleet expenses, freight bilty, fuel & driver allowances' },
    keyTools: {
      ur: ['بلٹی رسید جنریٹر', 'ڈرائیور ایڈوانس و ڈیزل', 'روٹ کرایہ کھاتہ', 'گاڑی منافع تجزیہ'],
      sd: ['ٻلٽي رسيد ٺاهڻ', 'ڊرائيور خرچ ۽ ڊيزل', 'گاڏي جو ڀاڙو کاتو', 'في ڦيرا منافعو'],
      ps: ['د بلتي رسید جوړول', 'د موټروان پیشکي او تېل', 'د لارې د کرایې حساب', 'د هرې لارۍ ګټه'],
      pa: ['بلٹی رسید جنریٹر', 'ڈرائیور پیشگی تے ڈیزل', 'کرایہ کھاتہ', 'گاڈی منافع تجزیہ'],
      en: ['Freight bilty generator', 'Driver advance & fuel logs', 'Client freight ledgers', 'Trip profitability'],
    },
  },
  {
    id: 'wholesale',
    category: 'trade',
    icon: 'Package',
    name: { ur: 'ہول سیل ڈسٹری بیوشن', sd: 'هول سيل ڊسٽري بيوشن', ps: 'عمده پلور او توزیع', pa: 'ہول سیل ڈسٹری بیوشن', en: 'Wholesale & Distribution' },
    tagline: { ur: 'بڑی مقدار، کاٹن ریٹ، سپلائرز بل اور ریٹیلر کریڈٹ', sd: 'وڏو اسٽاڪ، ڪارٽن اگهه ۽ دڪاندار کاتو', ps: 'لوی حجم، کارټن نرخ، عمده بلونه او پرچون پور', pa: 'وڈو اسٹاک، کارٹن ریٹ تے ریٹیلر دا ادھار', en: 'Bulk volume, carton rates, manufacturer bills & retailer credit' },
    keyTools: {
      ur: ['کاٹن و پیٹی قیمت بریک', 'ریٹیلر ادھار حد (Credit Limit)', 'آرڈر ڈلیوری شیٹ', 'کمپنی ڈسکاؤنٹ'],
      sd: ['ڪارٽن اگهه ۽ رعايت', 'دڪاندار اڌاري جي حد', 'آرڊر پهچائڻ لسٽ', 'ڪمپني ليجر'],
      ps: ['د کارټن عمده نرخ', 'د پیرودونکي د پور حد', 'د لېږلو لست', 'تجارتي تخفیفونه'],
      pa: ['کارٹن تے پیٹی ریٹ', 'دکاندار ادھار حد', 'آرڈر ڈلیوری لسٹ', 'کمپنی ڈسکاؤنٹ'],
      en: ['Carton volume breaks', 'Retailer credit limits', 'Delivery dispatch sheets', 'Trade discounts'],
    },
  },
  {
    id: 'restaurant',
    category: 'food',
    icon: 'UtensilsCrossed',
    name: { ur: 'ریسٹورنٹ، کیفے و ہوٹل', sd: 'ريسٽورنٽ، ڪيفي ۽ هوٽل', ps: 'رستورانت، کیفې او هوټل', pa: 'ریسٹورنٹ، کیفے تے ہوٹل', en: 'Restaurant, Cafe & Hotel' },
    tagline: { ur: 'ڈائن ان، ٹیک اوے، ڈلیوری، ٹیبل بلنگ اور کچن پرچی', sd: 'ٽيبل بلنگ، کائڻ پيئڻ ۽ ڊليوري', ps: 'په ځای خواړه، پارسل، ډلیوري او د پخلنځي بل', pa: 'ٹیبل بلنگ، پارسل، ہوم ڈلیوری تے کچن پرچی', en: 'Dine-in, takeaway, delivery, table management & kitchen KOT' },
    keyTools: {
      ur: ['ٹیبل و ہال مینجمنٹ', 'کچن آرڈر پرچی (KOT)', 'ٹیک اوے و ڈلیوری', 'کھانے کی لاگت (Food Cost)'],
      sd: ['ٽيبل ۽ هال سسٽم', 'ڪچن آرڊر سلپ (KOT)', 'پارسل ۽ ڊليوري', 'کاڌي جي تياري خرچ'],
      ps: ['د میزونو مدیریت', 'د پخلنځي ټکټ (KOT)', 'پارسل او ډلیوري', 'د خوړو لګښت تحلیل'],
      pa: ['ٹیبل مینجمنٹ', 'کچن پرچی (KOT)', 'ٹیک اوے تے ڈلیوری', 'کھانے دا خرچہ'],
      en: ['Table occupancy & tabs', 'Kitchen Order Ticket (KOT)', 'Takeaway & Delivery riders', 'Food cost margins'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. HOW IT WORKS (5 Steps)
// ─────────────────────────────────────────────────────────────────────────────
export const HOW_IT_WORKS_STEPS: Record<
  LandingLanguage,
  {
    sectionTag: string;
    title: string;
    subtitle: string;
    steps: { num: string; title: string; desc: string }[];
  }
> = {
  ur: {
    sectionTag: 'آسان طریقہ کار',
    title: 'صرف 5 منٹ میں اپنا کاروبار ڈیجیٹل بنائیں',
    subtitle: 'کسی پیچیدہ کمپیوٹر کورس کی ضرورت نہیں۔ AsaniBiz پاکستانی تاجروں کے لیے انتہائی سہل بنایا گیا ہے۔',
    steps: [
      { num: '01', title: 'کاروبار منتخب کریں', desc: 'کریانہ، موبائل، کپڑے، بیکری، منڈی یا دیگر 18+ اقسام میں سے دکان چنیں۔' },
      { num: '02', title: 'سودا اور کھاتہ درج کریں', desc: 'اپنے سودا سلف کے نام، ریٹ اور پرانے گاہکوں کا بقایا کھاتہ شامل کریں۔' },
      { num: '03', title: 'کاؤنٹر بلنگ شروع کریں', desc: 'صرف 5 سیکنڈ میں بل بنائیں، ادھار لکھیں اور واٹس ایپ پر رسید بھیجیں۔' },
      { num: '04', title: 'AI منشی سے مدد لیں', desc: 'مائیک سے بولیں: "آج کی سیل کتنی ہے؟" — AI فوراً کھاتہ کھولے گا۔' },
      { num: '05', title: 'خالص منافع چیک کریں', desc: 'شام کو دکان بڑھاتے وقت دیکھیں کہ نقد کیش کتنا ہے اور اصل کمائی کتنی ہوئی۔' },
    ],
  },
  sd: {
    sectionTag: 'آسان طريقيڪار',
    title: 'صرف 5 منٽن ۾ پنهنجو ڪاروبار ڊجيٽل بڻايو',
    subtitle: 'ڪنهن به ڪمپيوٽر ڪورس جي ضرورت ناهي، AsaniBiz دڪاندارن لاءِ نهايت سادو بڻايو ويو آهي.',
    steps: [
      { num: '01', title: 'پنهنجو ڪاروبار چونڊيو', desc: 'ڪريانا، موبائل، ڪپڙا، ميڊيڪل يا منڊي مان پنهنجي دڪان جي قسم چونڊيو.' },
      { num: '02', title: 'سامان ۽ کاتو شامل ڪريو', desc: 'سامان جا نالا، اگهه ۽ گراهڪن جا پراڻا اڌارا کاتا داخل ڪريو.' },
      { num: '03', title: 'ڪائونٽر بلنگ شروع ڪريو', desc: '5 سيڪنڊن ۾ پڪو بل ٺاهيو ۽ واٽس ايپ تي گراهڪ کي رسيد موڪليو.' },
      { num: '04', title: 'AI منشي کان پڇو', desc: 'مائيڪ سان چئو: "اڄ جي سيل ڪيتري آهي؟" — AI فوري طور ٻڌائيندو.' },
      { num: '05', title: 'خالص منافعو ڏسو', desc: 'ڏينهن جي پڄاڻي تي دڪان جي دراز جو نقد ڪيش ۽ اصل بچت چيڪ ڪريو.' },
    ],
  },
  ps: {
    sectionTag: 'اسانه لارښوونه',
    title: 'په ۵ دقیقو کې خپل کاروبار ډیجیټل کړئ',
    subtitle: 'د کمپیوټر پېچلي کورس ته اړتیا نشته؛ AsaniBiz د عامو دوکاندارانو لپاره خورا اسانه ډیزاین شوی.',
    steps: [
      { num: '۰۱', title: 'خپل کاروبار وټاکئ', desc: 'له ۱۸+ ډولونو څخه لکه کریانه، کالي، موبایل، میډیکل یا عمده دوکان وټاکئ.' },
      { num: '۰۲', title: 'توکي او کهاتہ ولیکئ', desc: 'خپل توکي، نرخونه او د پخوانیو پیرودونکو پاتې کهاتہ درج کړئ.' },
      { num: '۰۳', title: 'د کاونټر پلور پیل کړئ', desc: 'په ۵ ثانیو کې چټک بل جوړ کړئ او واټس اپ ته رسید واستوئ.' },
      { num: '۰۴', title: 'له AI منشي پوښتنه وکړئ', desc: 'غږ وکړئ: "نن سیل څومره وه؟" — AI سمدستي حساب راوباسي.' },
      { num: '۰۵', title: 'خالصه ګټه وګورئ', desc: 'د ماښام پر مهال د دراز نغدې پیسې او خپله باوري خالصه ګټه وګورئ.' },
    ],
  },
  pa: {
    sectionTag: 'سودھا طریقہ',
    title: 'صرف 5 منٹ وچ اپنا کاروبار ڈیجیٹل بناؤ',
    subtitle: 'کسے مشکل ٹریننگ دی لوڑ نہیں، AsaniBiz دکانداراں دی آسانی واسطے تیار کیتا گیا اے۔',
    steps: [
      { num: '01', title: 'کاروبار چنو', desc: 'کریانہ، موبائل، کپڑے، بیکری، منڈی یا ہور 18+ قسماں چوں دکان دی ونڈ چنو۔' },
      { num: '02', title: 'سودا تے کھاتہ درج کرو', desc: 'اپنے سودے دے ناں، ریٹ تے گاہکاں دا پرانا ادھار شامل کرو۔' },
      { num: '03', title: 'کاؤنٹر بلنگ شروع کرو', desc: 'صرف 5 سیکنڈ چ بل بناؤ تے واٹس ایپ اتے پکی رسید بھیجو۔' },
      { num: '04', title: 'AI منشی نال گل کرو', desc: 'مائیک نال بولو: "اج دی سیل کنی اے؟" — AI فوراً کھاتہ کھولے گا۔' },
      { num: '05', title: 'خالص منافع ویکھو', desc: 'شام نوں دکان ودھاندیاں ویکھو کہ گلے چ کیش کنا اے تے بچت کنی ہوئی۔' },
    ],
  },
  en: {
    sectionTag: 'Simple 5-Step Process',
    title: 'Digitize Your Business Operations in 5 Minutes',
    subtitle: 'No IT expertise required. Engineered for rapid adoption by Pakistani business owners.',
    steps: [
      { num: '01', title: 'Pick Your Business Type', desc: 'Select from 18+ specialized profiles — Grocery, Mobile, Fashion, Pharmacy, Mandi, and more.' },
      { num: '02', title: 'Add Items & Balances', desc: 'Quickly set up your item catalog, pricing, and initial customer/supplier ledger balances.' },
      { num: '03', title: 'Start Counter POS', desc: 'Issue 5-second invoices, record credit sales, and dispatch instant WhatsApp receipts.' },
      { num: '04', title: 'Command With AI Munshi', desc: 'Speak in Urdu, Sindhi, Pashto, Punjabi, or English to check khata or record expenses.' },
      { num: '05', title: 'Review Daily Net Margin', desc: 'Close your register knowing exact cash in drawer and true audited net profit.' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. TRUST & DATA SECURITY
// ─────────────────────────────────────────────────────────────────────────────
export const TRUST_SECURITY_SECTION: Record<
  LandingLanguage,
  {
    badge: string;
    title: string;
    subtitle: string;
    cards: { title: string; desc: string }[];
  }
> = {
  ur: {
    badge: 'ڈیٹا رازداری و تحفظ',
    title: 'آپ کا کاروباری ڈیٹا صرف اور صرف آپ کی ملکیت ہے',
    subtitle: 'دکان کا منافع اور گاہکوں کا کھاتہ انتہائی حساس اثاثہ ہے۔ AsaniBiz مکمل سیکیورٹی اور خود مختاری کے اصولوں پر کام کرتا ہے۔',
    cards: [
      { title: 'محفوظ انکرپٹڈ رسائی', desc: 'آپ کا تمام کاروباری ریکارڈ انکرپٹڈ سیکیورٹی میں رہتا ہے۔ کوئی غیر متعلقہ شخص آپ کا ڈیٹا نہیں دیکھ سکتا۔' },
      { title: '100% آف لائن موڈ', desc: 'انٹرنیٹ بند ہونے پر بھی بلنگ اور کھاتہ بلا تعطل چلتا ہے۔ نیٹ آتے ہی کلاؤڈ پر محفوظ ہو جاتا ہے۔' },
      { title: 'ریاضیاتی درستی کی ضمانت', desc: 'حساب کتاب AI کے اندازے پر نہیں بلکہ سافٹ ویئر کے مصدقہ میتھ کیلکولیٹر سے ہوتا ہے۔' },
      { title: 'ملازمین کاؤنٹر لاک', desc: 'سیلز مین صرف بل بنا سکے گا۔ دکان کا منافع اور سپلائر کا اصل ریٹ صرف مالک کی اسکرین پر نظر آئے گا۔' },
    ],
  },
  sd: {
    badge: 'ڊيٽا جي حفاظت',
    title: 'توهان جو ڪاروباري ڊيٽا رڳو توهان جي ملڪيت آهي',
    subtitle: 'دڪان جو منافعو ۽ اڌارو کاتو نهايت اهم آهي، AsaniBiz مڪمل حفاظت سان توهان جو ساٿ نڀائي ٿو.',
    cards: [
      { title: 'محفوظ انڪرپشن', desc: 'توهان جو رڪارڊ مڪمل طور تي محفوظ آهي، ڪوبه ٻيو ماڻهو اوهان جو حساب ڪتاب ڏسي نٿو سگهي.' },
      { title: '100% آف لائن ڪم', desc: 'نيٽ بند هئڻ جي صورت ۾ به بلنگ ۽ کاتو رواني سان هلندو رهندو، نيٽ اچڻ تي پاڻهي محفوظ ٿيندو.' },
      { title: 'حساب جي پڪي درستي', desc: 'حساب ڪتاب AI جي خيال تي نه پر مصدقہ سافٽ ويئر ميٿ سسٽم سان ٿئي ٿو.' },
      { title: 'ڪائونٽر سيلز لاڪ', desc: 'سيلز اسٽاف رڳو بل تيار ڪندو، دڪان جو خالص منافعو رڳو مالڪ جي اڳيان هوندو.' },
    ],
  },
  ps: {
    badge: 'د معلوماتو امنیت',
    title: 'ستاسو سوداګریز معلومات یوازې ستاسو ملکیت دی',
    subtitle: 'د دوکان ګټه او د پیرودونکو پورونه ستاسو راز دی؛ AsaniBiz بشپړ محرمیت او خوندیتوب تضمینوي.',
    cards: [
      { title: 'خوندي کوډ شوي معلومات', desc: 'ستاسو ټول مالي ریکارډ په بشپړ ډول انکرپټ شوی او بل هیڅوک ورته لاسرسی نلري.' },
      { title: '۱۰۰٪ بې انټرنیټه کار', desc: 'د انټرنیټ په نشتوالي کې هم بلینګ او کهاتہ نه دریږي؛ انټرنیټ راتلو سره بیک اپ کیږي.' },
      { title: 'د ریاضیاتو بشپړه درستی', desc: 'ټول حسابونه د سافټویر د قطعي محاسبوي انجن لخوا ترسره کیږي.' },
      { title: 'د کارکوونکو محدود لاسرسی', desc: 'پلورونکی کارمند یوازې بل جوړوي؛ د جنس اصلي قیمت او ګټه یوازې خاوند ته ښکاري.' },
    ],
  },
  pa: {
    badge: 'ڈیٹا دی رازداری',
    title: 'تہاڈا کاروباری ڈیٹا صرف تے صرف تہاڈی ملکیت اے',
    subtitle: 'دکان دا منافع تے ادھار کھاتہ تہاڈی سب توں وڈی امانت اے۔ AsaniBiz مکمل رازداری دی ضمانت دیندا اے۔',
    cards: [
      { title: 'محفوظ انکرپشن', desc: 'تہاڈا کاروباری ریکارڈ تہاڈے کول محفوظ رہندا اے، کوئی دوجا بندا تہاڈا منافع نہیں ویکھ سکدا۔' },
      { title: '100% آف لائن موڈ', desc: 'نیٹ بند ہون تے وی بلنگ تے کھاتہ چلدا رہندا اے، نیٹ آن تے کلاؤڈ تے سنک ہو جاندا اے۔' },
      { title: 'حساب دی پکی تسلی', desc: 'جمع تفریق AI دے اندازے تے نہیں، سافٹ ویئر دے پکے کیلکولیٹر نال ہوندی اے۔' },
      { title: 'ملازماں دا کاؤنٹر لاک', desc: 'سیلز بوائے صرف بل کڈ سکے گا، دکان دا خالص منافع صرف مالک دے فون تے نظر آوے گا۔' },
    ],
  },
  en: {
    badge: 'Security & Ownership',
    title: 'Your Commercial Data Remains Strictly Your Property',
    subtitle: 'Your customer balances, vendor margins, and net profits are completely private and confidential.',
    cards: [
      { title: 'End-to-End Encryption', desc: 'All financial logs and contact books are protected under modern encrypted architecture.' },
      { title: '100% Offline Durability', desc: 'Keep billing through network failures or load shedding. Auto-syncs to cloud once connected.' },
      { title: 'Deterministic Math Engine', desc: 'Ledgers and profits are calculated by deterministic math rules, never hallucinated by AI.' },
      { title: 'Role-Based Staff Locking', desc: 'Counter staff process checkouts without seeing wholesale supplier rates or net profit margins.' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. PRICING SECTION (Starter Plan: PKR 699 Launch / PKR 999 Regular)
// ─────────────────────────────────────────────────────────────────────────────
export const PRICING_SECTION: Record<
  LandingLanguage,
  {
    badge: string;
    title: string;
    subtitle: string;
    card: {
      planName: string;
      tagline: string;
      trialPill: string;
      regularPrice: string;
      regularPriceSub: string;
      launchOfferLabel: string;
      launchPrice: string;
      launchPriceSub: string;
      freeTrialSummary: string;
      features: string[];
      ctaText: string;
      guarantee: string;
    };
  }
> = {
  ur: {
    badge: 'شفاف و مناسب قیمت',
    title: 'پاکستانی تاجروں کے لیے آسان اور شفاف پیکج',
    subtitle: 'پہلے 30 دن بالکل مفت آزمائیں۔ بغیر کسی کریڈٹ کارڈ کے فوراً شروع کریں۔',
    card: {
      planName: 'AsaniBiz اسٹارٹر پلان',
      tagline: 'چھوٹے دکانداروں، تاجروں اور منظم اداروں کے لیے مکمل ڈیجیٹل دفتر',
      trialPill: '30 دن کا مفت ٹرائل شامل ہے',
      regularPrice: 'روپے 999',
      regularPriceSub: 'ماہانہ باقاعدہ فیس',
      launchOfferLabel: 'خصوصی لانچ آفر',
      launchPrice: 'روپے 699',
      launchPriceSub: 'پہلے 3 ماہ کے لیے فی مہینہ',
      freeTrialSummary: 'پہلے 30 دن 100% مفت، کسی کریڈٹ کارڈ کی ضرورت نہیں۔',
      features: [
        'لامحدود ڈیجیٹل کاؤنٹر بلنگ (POS) اور تھرمل پرنٹنگ',
        'لامحدود گاہک و سپلائر ادھار کھاتہ اور واٹس ایپ اسٹیٹمنٹ',
        'مکمل انوینٹری، بارکوڈ اسکیننگ اور لو اسٹاک الرٹس',
        '1-کلک موبائل واٹس ایپ رسید اور ادھار ریمائنڈرز',
        'سمارٹ پرچی کیمرہ + AI ریڈنگ (ہاتھ سے لکھے بل)',
        'اے آئی منشی وائس اسسٹنٹ (5,000 AI کمانڈز ماہانہ)',
        'روزانہ خالص منافع، سیل اور اخراجات کا حساب',
        '100% آف لائن موڈ اور کلاؤڈ ڈیٹا بیک اپ',
        'پانچوں سرکاری زبانوں (اردو، سندھی، پشتو، پنجابی، انگلش) میں مکمل سپورٹ',
        'تھرمل پرنٹر (58mm / 80mm) اور موبائل بلنگ',
      ],
      ctaText: 'ابھی مفت شروع کریں — 30 دن ٹرائل',
      guarantee: 'کوئی پوشیدہ فیس نہیں، کسی بھی وقت باآسانی منسوخ کر سکتے ہیں۔',
    },
  },
  sd: {
    badge: 'شفاف ۽ مناسب اگھه',
    title: 'ننڍي ڪاروبار لاءِ آسان ۽ شفاف پيڪيج',
    subtitle: 'پهريان 30 ڏينهن بلڪل مفت آزمائيو۔ خوش ٿيڻ بعد ڪم جاري رکو.',
    card: {
      planName: 'AsaniBiz اسٽارٽر پلان',
      tagline: 'دڪاندارن، واپارين ۽ پروفيشنل دڪانن لاءِ مڪمل حل',
      trialPill: '30 ڏينهن جو مفت ٽرائل',
      regularPrice: 'رپيا 999',
      regularPriceSub: 'ماهوار باقاعده اگھه',
      launchOfferLabel: 'خاص لانچ آفر',
      launchPrice: 'رپيا 699',
      launchPriceSub: 'پهرين 3 مهينن لاءِ في مهينو',
      freeTrialSummary: 'پهرين 30 ڏينهن 100% مفت، ڪارڊ جي ڪا ضرورت ناهي.',
      features: [
        'لامحدود بلنگ ۽ ڊجيٽل رسيدون (POS)',
        'گراهڪ ۽ سپلائر کاتو ۽ اڌارو',
        'اسٽاڪ ۽ بارڪوڊ اسڪيننگ الرٽس',
        'واٽس ايپ تي بل اماڻڻ جي سهولت',
        'سمارٽ پرچي ڪيمرا + AI ريڊنگ',
        'اي آئي منشي وائيس مدد (5,000 مهيني ڪمانڊز)',
        'خالص منافعي ۽ خرچ جي رپورٽ',
        'آف لائن ڪم ۽ محفوظ ڪلائوڊ بيڪ اپ',
        'سنڌي، اردو، پښتو، پنجابي ۽ انگريزي ٻوليون',
        'ٿرمل پرنٽر جي مڪمل سپورٽ',
      ],
      ctaText: 'هاڻي مفت شروع ڪريو — 30 ڏينهن ٽرائل',
      guarantee: 'ڪوبه لڪل خرچ ناهي، جڏهن چاهيو ختم ڪري سگهو ٿا.',
    },
  },
  ps: {
    badge: 'روښانه او مناسب نرخ',
    title: 'د دوکاندارانو لپاره ارزانه او شفاف پلان',
    subtitle: 'لومړۍ ۳۰ ورځې په بشپړ ډول وړیا وازمویئ؛ له هیڅ ډول کریډیټ کارډ پرته پیل کړئ.',
    card: {
      planName: 'د AsaniBiz سټارټر پلان',
      tagline: 'د پرچون او عمده پلورونکو لپاره بشپړ ډیجیټل دفتر',
      trialPill: '۳۰ ورځې وړیا ټرایل پکې شامل دی',
      regularPrice: '۹۹۹ روپۍ',
      regularPriceSub: 'عادي میاشتنی فیس',
      launchOfferLabel: 'د پیل ځانګړی تخفیف',
      launchPrice: '۶۹۹ روپۍ',
      launchPriceSub: 'لومړۍ ۳ میاشتې په میاشت کې',
      freeTrialSummary: 'لومړۍ ۳۰ ورځې ۱۰۰٪ وړیا؛ هیڅ کارډ ته اړتیا نشته.',
      features: [
        'نامحدود POS کاونټر بلینګ او چاپول',
        'د کهاتہ او پور بشپړ حساب او واټس اپ راپور',
        'د سټاک او بارکوډ بشپړ کنټرول او خبرتیاوې',
        'په ۱ کلیک واټس اپ رسیدونه او د پور یادونه',
        'د لاسي پرچو سمارټ کیمره او AI لوستونکی',
        'غږیز AI منشي (۵۰۰۰ میاشتني کمانډونه)',
        'ورځنۍ خالصه ګټه او د مصارفو تحلیل',
        '۱۰۰٪ بې انټرنیټه آفلاین کار او کلاوډ سنک',
        'په ۵ رسمي ژبو (پښتو، اردو، سنډي، پنجابي، انګلیسي) کې بشپړ ملاتړ',
        'د ۵۸ ملي او ۸۰ ملي تودوخې پرنټر ملاتړ',
      ],
      ctaText: 'همدا اوس وړیا پیل کړئ — ۳۰ ورځې ټرایل',
      guarantee: 'هیڅ پټ لګښت نشته؛ په هر وخت کې یې منسوخ کولای شئ.',
    },
  },
  pa: {
    badge: 'مناسب تے صاف ریٹ',
    title: 'چھوٹے کاروبار واسطے سمارٹ تے سستا پیکج',
    subtitle: 'پہلے 30 دن بالکل مفت چلاؤ۔ کسے کریڈٹ کارڈ دی لوڑ نہیں۔',
    card: {
      planName: 'AsaniBiz اسٹارٹر پلان',
      tagline: 'دکانداراں تے تاجراں واسطے پورا ڈیجیٹل سسٹم',
      trialPill: '30 دن دا مفت ٹرائل شامل اے',
      regularPrice: 'روپے 999',
      regularPriceSub: 'ماہانہ پکی فیس',
      launchOfferLabel: 'خاص لانچ آفر',
      launchPrice: 'روپے 699',
      launchPriceSub: 'پہلے 3 مہینے واسطے فی مہینہ',
      freeTrialSummary: 'پہلے 30 دن 100% مفت، کوئی فالتو کارڈ نہیں چاہیدا۔',
      features: [
        'لامحدود تیز کاؤنٹر بلنگ (POS) تے تھرمل پرنٹ',
        'گاہکاں تے سپلائراں دا پکا ادھار کھاتہ',
        'اسٹاک، بارکوڈ تے سامان مکݨ دے الرٹ',
        'واٹس ایپ بل تے پکی رسید بھیجن دی سہولت',
        'ہتھ دی لکھی پرچی کیمرہ تے AI ریڈنگ',
        'پنجابی AI منشی (5,000 مہینے دیاں کمانڈاں)',
        'روزانہ خالص منافع تے خرچے دا حساب',
        '100% آف لائن موڈ تے کلاؤڈ بیک اپ',
        'پنجاں سرکاری بولیاں (پنجابی، اردو، سندھی، پشتو، انگلش) چ پورا کنٹرول',
        'تھرمل پرنٹر (58mm / 80mm) سپورٹ',
      ],
      ctaText: 'ہݨے مفت شروع کرو — 30 دن ٹرائل',
      guarantee: 'کوئی لکی فیس نہیں، جدوں جی کرے بند کر سکدے او۔',
    },
  },
  en: {
    badge: 'Accessible & Transparent Pricing',
    title: 'Accessible Pricing Built for Pakistani Merchants',
    subtitle: 'Start with a risk-free 30-day trial. Zero credit card needed to begin.',
    card: {
      planName: 'AsaniBiz Starter Plan',
      tagline: 'Complete digital management suite for retailers, wholesalers & service shops',
      trialPill: '30-Day Free Trial Included',
      regularPrice: 'PKR 999',
      regularPriceSub: 'regular monthly subscription',
      launchOfferLabel: 'Special Launch Offer',
      launchPrice: 'PKR 699',
      launchPriceSub: 'per month for your first 3 months',
      freeTrialSummary: '100% Free for your first 30 days (no card required).',
      features: [
        'Unlimited fast counter & POS billing invoices',
        'Unlimited customer & supplier ledgers (Khata / Udhaar)',
        'Real-time inventory, barcode scanning & reorder alerts',
        '1-Click WhatsApp invoice slips & balance reminders',
        'Smart Parchi Camera + AI slip parsing',
        'Conversational AI Munshi (5,000 monthly operational commands)',
        'Real-time net margin, daily sales & expense analytics',
        '100% offline durability with automatic cloud sync',
        'Full Urdu, Sindhi, Pashto, Punjabi & English interfaces',
        '58mm & 80mm Bluetooth / USB thermal receipt support',
      ],
      ctaText: 'Start Free 30-Day Trial',
      guarantee: 'No hidden setup charges. Cancel anytime with zero penalty.',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. FAQ ITEMS
// ─────────────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS: LandingFaqItem[] = [
  {
    q: {
      ur: 'کیا AsaniBiz بغیر انٹرنیٹ (آف لائن) بھی کام کرتا ہے؟',
      sd: 'ڇا AsaniBiz بغير انٽرنيٽ (آف لائن) به ڪم ڪري ٿو؟',
      ps: 'ایا AsaniBiz له انټرنیټ پرته (آفلاین) هم کار کوي؟',
      pa: 'کی AsaniBiz بغیر نیٹ (آف لائن) وی چلدا اے؟',
      en: 'Does AsaniBiz function 100% offline without active internet?'
    },
    a: {
      ur: 'جی ہاں! آپ انٹرنیٹ کے بغیر بھی کاؤنٹر سیل، بلنگ، کھاتہ اور اسٹاک اپ ڈیٹ کر سکتے ہیں۔ جب انٹرنیٹ آئے گا تو تمام ریکارڈ خود بخود کلاؤڈ پر محفوظ ہو جائے گا۔',
      sd: 'ها بلڪل! اوهان انٽرنيٽ کان سواءِ به سيل، بلنگ، کاتو ۽ اسٽاڪ هلائي سگهو ٿا. نيٽ ملڻ تي سمورو ڊيٽا خودبخود محفوظ ٿي ويندو.',
      ps: 'هو بلکل! تاسې پرته له انټرنیټ څخه کاونټر بلینګ، کهاتہ او سټاک چلولای شئ. کله چې انټرنیټ راشي، معلومات په اتومات ډول کلاوډ ته ځي.',
      pa: 'ہاں جی! تسیں نیٹ توں بغیر وی دکان دا بل، کھاتہ تے سامان دا حساب رکھ سکدے او۔ نیٹ آن تے ڈیٹا خود بخود کلاؤڈ تے بیک اپ ہو جاندا اے۔',
      en: 'Yes! The POS counter, ledgers, and stock operate seamlessly offline. All local changes queue securely and synchronize automatically when connectivity restores.'
    }
  },
  {
    q: {
      ur: 'کیا 30 دن کے مفت ٹرائل کے لیے کریڈٹ کارڈ ضروری ہے؟',
      sd: 'ڇا 30 ڏينهن جي مفت ٽرائل لاءِ ڪريڊٽ ڪارڊ گهربل آهي؟',
      ps: 'ایا د ۳۰ ورځو وړیا ازموینې لپاره کریډیټ کارډ ته اړتیا شته؟',
      pa: 'کی 30 دن دے مفت ٹرائل لئی کریڈٹ کارڈ چاہیدا اے؟',
      en: 'Is a credit card required to activate the 30-day free trial?'
    },
    a: {
      ur: 'بالکل نہیں! آپ بغیر کسی کارڈ یا پیشگی ادائیگی کے فوری طور پر مکمل سسٹم استعمال کرنا شروع کر سکتے ہیں۔',
      sd: 'بلڪل نه! بغير ڪنهن ڪارڊ يا پيشگي ادائيگي جي اوهان فوري طور تي سموريون سهولتون آزمائي سگهو ٿا.',
      ps: 'هیڅکله نه! تاسې پرته له کوم بانکي کارډ یا دمخه پیسو څخه سمدلاسه بشپړ سیسټم پیل کولای شئ.',
      pa: 'بالکل نہیں! تسیں بغیر کسے کارڈ یا فیس دے سدھا اپنا کاروبار شروع کر سکدے او۔',
      en: 'Zero credit card required. You gain instant access to all core and advanced features for 30 full days without financial commitment.'
    }
  },
  {
    q: {
      ur: 'ہاتھ کی لکھی ہوئی پرچی کیمرے سے کیسے اسکین ہوتی ہے؟',
      sd: 'هٿ سان لکيل پرچي ڪئميرا سان ڪيئن اسڪين ٿيندي آهي؟',
      ps: 'د لاس لیکل شوې پرچۍ له کیمرې سره څنګه لوستل کیږي؟',
      pa: 'ہتھ دی لکھی پرچی کیمرے نال کداں پڑھی جاندی اے؟',
      en: 'How does the Smart Camera scan handwritten supplier slips?'
    },
    a: {
      ur: 'موبائل کیمرے سے سپلائر یا گاہک کی پرچی کی تصویر لیں۔ سسٹم خود بخود آئٹمز، تعداد اور ریٹ پڑھ کر جدول میں سجا دیتا ہے جسے آپ چیک کر کے ایک کلک میں محفوظ کر سکتے ہیں۔',
      sd: 'موبائل ڪئميرا مان پرچي جو فوٽو ڪڍو. سمارٽ AI خود بخود سامان، اگهه ۽ ڳڻپ پڙهي ٽيبل ٺاهي ڇڏيندو جنهن کي اوهان تصديق ڪري سيو ڪري سگهو ٿا.',
      ps: 'د موبایل په کیمرې د پرچۍ عکس واخلئ. سمارټ AI په اتومات ډول توکي، قیمتونه او تعداد را وباسي او له تایید وروسته یې په سټاک کې اضافه کوي.',
      pa: 'موبائل کیمرے نال پرچی دی فوٹو کھچو۔ سسٹم سامان، ریٹ تے گنتی خود پڑھ کے کھاتے چ درج کر لیندا اے۔',
      en: 'Capture a photo using your mobile camera or upload from gallery. The OCR extracts item names, quantities, and rates into a verified editable table before saving.'
    }
  },
  {
    q: {
      ur: 'کیا میرا کاروباری ڈیٹا اور کھاتے محفوظ رہیں گے؟',
      sd: 'ڇا منهنجو ڪاروباري ڊيٽا ۽ کاتو محفوظ رهندو؟',
      ps: 'ایا زما د دوکان او کهاتہ معلومات به خوندي وي؟',
      pa: 'کی میرا کھاتہ تے دکان دا ڈیٹا محفوظ رہے گا؟',
      en: 'How secure and confidential is my ledger and transaction data?'
    },
    a: {
      ur: 'آپ کا تمام ڈیٹا انکرپٹڈ اور نجی ہے۔ یہ کبھی کسی تیسرے فریق کے ساتھ شیئر نہیں کیا جاتا اور آپ کی اجازت کے بغیر کوئی نہیں دیکھ سکتا۔',
      sd: 'اوهان جو ڊيٽا مڪمل انڪرپٽ ۽ محفوظ آهي. اهو ڪنهن به ٻي ڌر کي نٿو ڏنو وڃي.',
      ps: 'ستاسو ټول مالي معلومات په پرمختللي انکریپشن سره خوندي دي او له دریم لوري سره هیڅکله نه شریکیږي.',
      pa: 'تہاڈا سارا ڈیٹا پکا محفوظ تے خفیہ رہندا اے۔ تہاڈی مرضی توں بغیر کوئی نہیں ویکھ سکدا۔',
      en: 'All merchant data is protected with enterprise-grade encryption and local sandbox storage. Your ledgers are never shared, sold, or accessible to third parties.'
    }
  },
  {
    q: {
      ur: 'کیا یہ تھرمل پرنٹر اور بارکوڈ اسکینر سپورٹ کرتا ہے؟',
      sd: 'ڇا هي ٿرمل پرنٽر ۽ بارڪوڊ اسڪينر کي سپورٽ ڪري ٿو؟',
      ps: 'ایا دا حرارتي پرنټر او بارکوډ سکینر مني؟',
      pa: 'کی ایہہ تھرمل پرنٹر تے بارکوڈ اسکینر سپورٹ کردا اے؟',
      en: 'Does AsaniBiz support thermal receipt printers and barcode hardware?'
    },
    a: {
      ur: 'جی ہاں! 58mm اور 80mm کے تمام بلوٹوتھ و یو ایس بی تھرمل پرنٹرز اور یو ایس بی/کیمرہ بارکوڈ اسکینرز فوری کنیکٹ ہوتے ہیں۔',
      sd: 'ها بلڪل! 58mm ۽ 80mm جا سمورا بلوٽوٿ/USB ٿرمل پرنٽر ۽ بارڪوڊ اسڪينر ڪم ڪن ٿا.',
      ps: 'هو! ټول ۵۸ ملي او ۸۰ ملي بلوټوت او USB حرارتي پرنټرونه او بارکوډ سکینرونه په مستقیم ډول ملاتړ کیږي.',
      pa: 'ہاں جی! 58mm تے 80mm دے سارے تھرمل پرنٹر تے بارکوڈ اسکینر فورا چل جاندے نیں۔',
      en: 'Yes! Full ESC/POS compatibility for standard 58mm & 80mm thermal receipt printers via Bluetooth or USB, along with direct camera and physical barcode scanners.'
    }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 12. NAVIGATION & SITE-WIDE STRINGS
// ─────────────────────────────────────────────────────────────────────────────
export const NAV_LABELS: Record<
  LandingLanguage,
  {
    announcement: string;
    whyAsanibiz: string;
    features: string;
    smartAi: string;
    parchiCamera: string;
    businessTypes: string;
    pricing: string;
    faq: string;
    adminPortal: string;
    privacy: string;
    terms: string;
    rightsReserved: string;
    allTools: string;
    dailyMgmt: string;
    advancedAi: string;
    activeInSystem: string;
    tryAiMunshi: string;
    realAction: string;
    ownerVerification: string;
    ownerVerificationNote: string;
    mobileCameraProofBadge: string;
    mobileCameraProofTitle: string;
    mobileCameraProofDesc: string;
    chooseThisProfile: string;
    tailoredTools: string;
    notJustBillingTitle: string;
    notJustBillingDesc: string;
    featuresBadge: string;
    featuresHeading: string;
    featuresSubheading: string;
    samplePromptsHeader: string;
    faqBadge: string;
    faqHeading: string;
    faqSubheading: string;
    finalCtaSubtext: string;
    footerPlatform: string;
    footerBusinessTypes: string;
    footerAccount: string;
  }
> = {
  ur: {
    announcement: '🇵🇰 AsaniBiz — جس کاروبار میں آسانی ہے، اس میں برکت اور سکون وسیع ہے',
    whyAsanibiz: 'کیوں AsaniBiz؟',
    features: 'خصوصیات',
    smartAi: 'سمارٹ AI منشی',
    parchiCamera: 'پرچی کیمرہ',
    businessTypes: 'کاروباری شعبے',
    pricing: 'پیکجز و قیمت',
    faq: 'سوالات و جوابات',
    adminPortal: 'ایڈمن پورٹل',
    privacy: 'پرائیویسی پالیسی',
    terms: 'شرائط و ضوابط',
    rightsReserved: 'تمام حقوق محفوظ ہیں۔ “جس کاروبار میں آسانی ہے، اس میں برکت اور سکون وسیع ہے۔”',
    allTools: 'تمام ٹولز (All)',
    dailyMgmt: 'روزمرہ بزنس مینجمنٹ',
    advancedAi: 'ایڈوانس ٹیکنالوجی و AI',
    activeInSystem: 'سافٹ ویئر میں فعال',
    tryAiMunshi: 'ابھی AI منشی آزمائیں',
    realAction: 'حقیقی کارروائی',
    ownerVerification: 'مالک کی تصدیق کا کنٹرول',
    ownerVerificationNote: 'کوئی بھی ادھار یا خرچ دکاندار کی اسکرین پر حتمی منظوری کے بغیر محفوظ نہیں ہوتا۔',
    mobileCameraProofBadge: 'موبائل کیمرہ و گیلری انٹیگریشن',
    mobileCameraProofTitle: 'ہاتھ کی لکھی پرچی سے لائیو ڈیجیٹل اسٹاک تک',
    mobileCameraProofDesc: 'سپلائر بل کی تصویر کھینچیں۔ AI تصویر میں سے آئٹمز کے نام، کوانٹٹی اور ریٹ کو الگ الگ ٹیبل میں دکھائے گا۔ آپ چیک کر کے "محفوظ کریں" دبائیں، سارا مال اسٹاک اور کھاتے میں اپ ڈیٹ ہو جائے گا۔',
    chooseThisProfile: 'اس کاروبار کے لیے شروع کریں',
    tailoredTools: 'خصوصی ٹولز:',
    notJustBillingTitle: 'صرف بلنگ ایپ نہیں — آپ کے کاروبار کا مکمل ڈیجیٹل سسٹم',
    notJustBillingDesc: 'کھاتہ + ادھار + اسٹاک + بلنگ + خریداری + اخراجات + کیش دراز + بینک اکاؤنٹس + ملازمین کنٹرول + پی اینڈ ایل رپورٹس + عملی AI منشی۔',
    featuresBadge: 'طاقتور کاروباری سہولیات',
    featuresHeading: 'دکان کے ہر شعبے کے لیے آسان اور محفوظ ٹولز',
    featuresSubheading: 'روایتی حساب کتاب کی الجھنوں کو خیرباد کہیں اور ہر چیز کو اپنے فون یا کمپیوٹر سے کنٹرول کریں۔',
    samplePromptsHeader: 'حقیقی کاروباری مثالیں — سنیں یا پڑھیں کہ AI کیسے کام کرتا ہے:',
    faqBadge: 'سوالات و جوابات',
    faqHeading: 'اکثر پوچھے جانے والے سوالات',
    faqSubheading: 'پاکستانی دکانداروں کے تمام سوالات کے واضح اور مستند جوابات',
    finalCtaSubtext: 'آج ہی اپنے کاروبار کو روایتی پریشانیوں سے آزاد کر کے ایک منظم اور کامیاب ادارہ بنائیں۔',
    footerPlatform: 'سافٹ ویئر فیچرز',
    footerBusinessTypes: 'کاروباری شعبے',
    footerAccount: 'اکاؤنٹ و رسائی',
  },
  sd: {
    announcement: '🇵🇰 AsaniBiz — جنهن ڪاروبار ۾ آساني آهي، ان ۾ برڪت ۽ سڪون وسيع آهي',
    whyAsanibiz: 'ڇو AsaniBiz؟',
    features: 'خاصيتون',
    smartAi: 'سمارٽ AI منشي',
    parchiCamera: 'پرچي ڪيمرا',
    businessTypes: 'ڪاروبار جا قسم',
    pricing: 'اگھه ۽ پيڪيج',
    faq: 'سوال ۽ جواب',
    adminPortal: 'ايڊمن پورٽل',
    privacy: 'پرائيويسي پاليسي',
    terms: 'شرطون ۽ ضابطا',
    rightsReserved: 'سمورا حق محفوظ آهن. “جنهن ڪاروبار ۾ آساني آهي، ان ۾ برڪت ۽ سڪون وسيع آهي.”',
    allTools: 'سمورا اوزار (All)',
    dailyMgmt: 'روزانو ڪاروبار',
    advancedAi: 'جديد AI ۽ ٽيڪنالوجي',
    activeInSystem: 'سسٽم ۾ موجود',
    tryAiMunshi: 'هاڻي AI منشي آزمايو',
    realAction: 'حقيقي عمل',
    ownerVerification: 'مالڪ جي تصديق جو ڪنٽرول',
    ownerVerificationNote: 'ڪوبه اڌارو يا خرچ دڪاندار جي منظوري کانسواءِ محفوظ نٿو ٿئي.',
    mobileCameraProofBadge: 'موبائل ڪيمرا ۽ گيلري',
    mobileCameraProofTitle: 'هٿ سان لکيل پرچي مان سڌو اسٽاڪ ۾',
    mobileCameraProofDesc: 'سپلائر جي بل جي تصوير ڪڍو۔ AI سامان جو نالو، اگهه ۽ تعداد پڙهي ڏيکاريندو۔ اوهان چيڪ ڪري سيو ڪريو، سڀ اسٽاڪ ۽ کاتي ۾ شامل ٿي ويندو.',
    chooseThisProfile: 'هي ڪاروبار چونڊيو',
    tailoredTools: 'خاص اوزار:',
    notJustBillingTitle: 'رڳو بلنگ ائپ ناهي — ڪاروبار جو مڪمل ڊجيٽل سسٽم',
    notJustBillingDesc: 'کاتو + اڌارو + اسٽاڪ + بلنگ + خريداري + خرچ + روڪ ڪيش + بينڪ + عملي ڪنٽرول + منافعي جون رپورٽون + عملي AI منشي.',
    featuresBadge: 'مڪمل سهولتون',
    featuresHeading: 'دڪان جي هر شعبي لاءِ آسان ۽ محفوظ اوزار',
    featuresSubheading: 'روايتي حساب ڪتاب کي ڇڏيو ۽ سڀ ڪجهه پنهنجي موبائل يا ڪمپيوٽر مان سنڀاليو.',
    samplePromptsHeader: 'حقيقي ڪاروباري مثال — AI ڪيئن عملي ڪم ڪري ٿو:',
    faqBadge: 'سوال ۽ جواب',
    faqHeading: 'اڪثر پڇيا ويندڙ سوال',
    faqSubheading: 'دڪاندارن لاءِ سڀني سوالن جا چٽا ۽ پڪا جواب',
    finalCtaSubtext: 'اڄ ئي پنهنجي ڪاروبار کي روايتي پريشانين مان ڪڍي منظم ۽ ڪامياب بڻايو.',
    footerPlatform: 'سافٽ ويئر خاصيتون',
    footerBusinessTypes: 'ڪاروبار جا قسم',
    footerAccount: 'اڪائونٽ ۽ رسائي',
  },
  ps: {
    announcement: '🇵🇰 AsaniBiz — په کوم کاروبار کې چې اسانتیا وي، په هغې کې برکت او پراخه هوساینه وي',
    whyAsanibiz: 'ولې AsaniBiz؟',
    features: 'ځانګړتیاوې',
    smartAi: 'هوښیار AI منشي',
    parchiCamera: 'د پرچې کیمره',
    businessTypes: 'د سوداګرۍ ډولونه',
    pricing: 'نرخونه او پلانونه',
    faq: 'پوښتنې او ځوابونه',
    adminPortal: 'د اډمین پورټل',
    privacy: 'د محرمیت تګلاره',
    terms: 'شرایط او مقررات',
    rightsReserved: 'ټول حقونه خوندي دي. “په کوم کاروبار کې چې اساني وي، په هغه کې برکت او سکون زیات وي.”',
    allTools: 'ټول اوزار (All)',
    dailyMgmt: 'ورځنی مدیریت',
    advancedAi: 'پرمختللې ټیکنالوژي او AI',
    activeInSystem: 'په سافټویر کې فعال',
    tryAiMunshi: 'اوس AI منشي وازمویئ',
    realAction: 'اصلي کار او عمل',
    ownerVerification: 'د خاوند د تایید کنټرول',
    ownerVerificationNote: 'هیڅ مالي داخلول د دوکاندار له قطعي تایید پرته نه ثبتیږي.',
    mobileCameraProofBadge: 'د موبایل کیمرې یوځای والی',
    mobileCameraProofTitle: 'له لاسي پرچې څخه ژوندي سټاک ته',
    mobileCameraProofDesc: 'د عرضه کوونکي د بل عکس واخلئ؛ AI ټول توکي، اندازه او قیمت په اتومات ډول پیژني او ستاسو له تایید وروسته یې سټاک کې ثبتوي.',
    chooseThisProfile: 'دا ډول وټاکئ',
    tailoredTools: 'ځانګړي اوزار:',
    notJustBillingTitle: 'یوازې د بلینګ ایپ نه — ستاسو د کاروبار بشپړ ډیجیټل سیسټم',
    notJustBillingDesc: 'کهاتہ + پور + سټاک + بلینګ + پیرود + مصارف + نغدې دراز + بانک + د کارکوونکو واک + د ګټې راپورونه + عملی AI منشي.',
    featuresBadge: 'ځواکمن سوداګریز اوزار',
    featuresHeading: 'د دوکان د هرې برخې لپاره اسانه او باوري اوزار',
    featuresSubheading: 'د حساب کتاب پخوانۍ لانجې پای ته ورسوئ او هر څه له خپل موبایل یا کمپیوټر څخه سمبال کړئ.',
    samplePromptsHeader: 'د ریښتینې سوداګرۍ بېلګې — واورئ او ولولئ چې AI څنګه عمل کوي:',
    faqBadge: 'پوښتنې او ځوابونه',
    faqHeading: 'ډېرې پوښتل کېدونکې پوښتنې',
    faqSubheading: 'د سوداګرو ټولو پوښتنو ته روښانه او باوري ځوابونه',
    finalCtaSubtext: 'نن ورځ خپل کاروبار له پخوانیو ستونزو وژغورئ او یو بریالی، منظم سیسټم جوړ کړئ.',
    footerPlatform: 'د سافټویر ځانګړتیاوې',
    footerBusinessTypes: 'د سوداګرۍ ډولونه',
    footerAccount: 'حساب او لاسرسی',
  },
  pa: {
    announcement: '🇵🇰 AsaniBiz — جس کاروبار وچ آسانی اے، اوہدے وچ برکت تے سکون وسیع اے',
    whyAsanibiz: 'کیوں AsaniBiz؟',
    features: 'خاصیتاں',
    smartAi: 'سمارٹ AI منشی',
    parchiCamera: 'پرچی کیمرہ',
    businessTypes: 'کاروباری ونڈ',
    pricing: 'پیکجز تے ریٹ',
    faq: 'سوال تے جواب',
    adminPortal: 'ایڈمن پورٹل',
    privacy: 'پرائیویسی پالیسی',
    terms: 'شرائط تے ضوابط',
    rightsReserved: 'سارے حق محفوظ نیں۔ “جس کاروبار وچ آسانی اے، اوس وچ برکت تے سکون وسیع اے۔”',
    allTools: 'سارے ٹولز (All)',
    dailyMgmt: 'روز دا کاروبار',
    advancedAi: 'نویں ٹیکنالوجی تے AI',
    activeInSystem: 'سافٹ ویئر وچ موجود',
    tryAiMunshi: 'ہݨے AI منشی آزماؤ',
    realAction: 'اصلی کارروائی',
    ownerVerification: 'مالک دی منظوری دا کنٹرول',
    ownerVerificationNote: 'کوئی وی ادھار یا خرچہ دکاندار دی تصدیق توں بغیر سیو نہیں ہوندا۔',
    mobileCameraProofBadge: 'موبائل کیمرہ تے گیلری',
    mobileCameraProofTitle: 'ہتھ دی لکھی پرچی توں پکے اسٹاک تیکر',
    mobileCameraProofDesc: 'سپلائر دے بل دی تصویر لوو، AI سامان دا ناں، ریٹ تے تعداد پڑھ کے ٹیبل چ لے آوے گا۔ تسیں چیک کر کے سیو کرو تے کھاتے چ جمع ہو جاوے گا۔',
    chooseThisProfile: 'ایہ کاروبار چنو',
    tailoredTools: 'خاص ٹولز:',
    notJustBillingTitle: 'صرف بلنگ ایپ نہیں — تہاڈے کاروبار دا پورا ڈیجیٹل سسٹم',
    notJustBillingDesc: 'کھاتہ + ادھار + اسٹاک + بلنگ + خریداری + خرچے + کیش دراز + بینک + ملازم کنٹرول + منافع رپورٹاں + اصلی AI منشی۔',
    featuresBadge: 'طاقتور کاروباری سہولتاں',
    featuresHeading: 'دکان دے ہر شعبے لئی سوکھے تے پکے ٹولز',
    featuresSubheading: 'پرانے حساباں دے رپھڑاں نوں چھڈو تے سارا کاروبار اپنے فون یا کمپیوٹر توں کنٹرول کرو۔',
    samplePromptsHeader: 'حقیقی کاروباری مثالاں — سنو تے پڑھو کہ AI کداں کم کردا اے:',
    faqBadge: 'سوال تے جواب',
    faqHeading: 'عام پوچھے جان والے سوال',
    faqSubheading: 'دکانداراں دے سارے سوالاں دے صاف تے پکے جواب',
    finalCtaSubtext: 'اج ای اپنے کاروبار نوں پرانے رپھڑاں توں کڈ کے اک پکا تے منظم ادارہ بناؤ۔',
    footerPlatform: 'سافٹ ویئر فیچرز',
    footerBusinessTypes: 'کاروباری شعبے',
    footerAccount: 'اکاؤنٹ تے رسائی',
  },
  en: {
    announcement: '🇵🇰 AsaniBiz — Where business flows with ease, prosperity and peace flourish',
    whyAsanibiz: 'Why AsaniBiz',
    features: 'Core Features',
    smartAi: 'Smart AI Munshi',
    parchiCamera: 'Parchi Scanner',
    businessTypes: 'Business Types',
    pricing: 'Pricing & Plans',
    faq: 'FAQ',
    adminPortal: 'Admin Portal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    rightsReserved: 'All rights reserved. “AsaniBiz — Jis karobar mein aasani hai, usmein barkat aur sukoon wasee hai.”',
    allTools: 'All Tools',
    dailyMgmt: 'Daily Management',
    advancedAi: 'Advanced & AI Tools',
    activeInSystem: 'Active in System',
    tryAiMunshi: 'Try AI Munshi Now',
    realAction: 'Direct System Action',
    ownerVerification: 'Owner Confirmation Guard',
    ownerVerificationNote: 'No financial or credit liability is committed without explicit merchant review and approval.',
    mobileCameraProofBadge: 'Mobile Camera & Gallery Vision',
    mobileCameraProofTitle: 'From Paper Sourcing Slip into Audited Inventory',
    mobileCameraProofDesc: 'Snap supplier receipts. The AI extracts items, counts, and unit costs into an editable table side-by-side with your photo.',
    chooseThisProfile: 'Choose This Profile',
    tailoredTools: 'Tailored Tools:',
    notJustBillingTitle: 'Not Merely a Billing App — Your Complete Business Management Platform',
    notJustBillingDesc: 'Khata + Udhaar + Stock + Billing + Sourcing + Expenses + Cash Drawer + Bank + Staff Roles + Net Margin Reports + Operational AI Munshi.',
    featuresBadge: 'Built For Practical Business',
    featuresHeading: 'Engineered for Every Dimension of Small Business',
    featuresSubheading: 'Say goodbye to lost paper slips and calculation errors with our robust, field-tested toolset.',
    samplePromptsHeader: 'Real Operational Prompts — How AI Munshi Drives Real Software Actions:',
    faqBadge: 'Got Questions?',
    faqHeading: 'Frequently Asked Questions',
    faqSubheading: 'Clear, authentic answers about our software, pricing, and operational capabilities.',
    finalCtaSubtext: 'Transform your everyday operations into an organized, profitable enterprise today.',
    footerPlatform: 'Platform Features',
    footerBusinessTypes: 'Business Sectors',
    footerAccount: 'Account & Access',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. LEGAL TERMS & PRIVACY
// ─────────────────────────────────────────────────────────────────────────────
export const LEGAL_CONTENT: Record<
  LandingLanguage,
  {
    privacyTitle: string;
    privacySections: { title: string; desc: string }[];
    termsTitle: string;
    termsSections: { title: string; desc: string }[];
    closeBtn: string;
  }
> = {
  ur: {
    privacyTitle: 'پرائیویسی پالیسی (Privacy Policy)',
    privacySections: [
      { title: '1. ڈیٹا کی مکمل رازداری', desc: 'AsaniBiz آپ کے کاروباری کھاتے، سیل، اخراجات اور منافع کے ڈیٹا کو مکمل طور پر نجی اور خفیہ رکھتا ہے۔ آپ کا ڈیٹا کسی تیسرے فریق کو فروخت یا شیئر نہیں کیا جاتا۔' },
      { title: '2. آف لائن اسٹوریج', desc: 'آپ کے ڈیوائس پر موجود لوکل ڈیٹا محفوظ رہتا ہے اور کلاؤڈ سنک ہونے پر انکرپٹڈ سیکیورٹی کے تحت رکھا جاتا ہے۔' },
      { title: '3. AI آپریشنز', desc: 'AI منشی کے ذریعے پوچھے جانے والے سوالات صرف سافٹ ویئر کی سہولت کے لیے استعمال ہوتے ہیں اور حساس مالیاتی ریکارڈ صرف آپ کے موبائل/کمپیوٹر کے کنٹرول میں رہتا ہے۔' },
    ],
    termsTitle: 'شرائط و ضوابط (Terms of Service)',
    termsSections: [
      { title: '1. سروس کا استعمال', desc: 'AsaniBiz چھوٹے اور درمیانے کاروبار کے لیے اکاؤنٹنگ، بلنگ، کھاتہ اور انوینٹری کی سہولت فراہم کرتا ہے۔' },
      { title: '2. 30 دن کا مفت ٹرائل', desc: 'ہر نیا صارف بغیر کسی پیشگی ادائیگی کے 30 دن تک سسٹم کی تمام بنیادی اور ایڈوانس سہولیات استعمال کر سکتا ہے۔' },
      { title: '3. حسابی تصدیق', desc: 'صارف اس بات کا پابند ہے کہ AI یا سافٹ ویئر کے ذریعے درج کیے جانے والے بلوں اور رقوم کو فائنل سیو کرنے سے پہلے خود بھی چیک کر لے۔' },
    ],
    closeBtn: 'بند کریں (Close)',
  },
  sd: {
    privacyTitle: 'پرائيويسي پاليسي (Privacy Policy)',
    privacySections: [
      { title: '1. ڊيٽا جي مڪمل رازداري', desc: 'AsaniBiz اوهان جي کاتي، سيل، خرچن ۽ منافعي کي مڪمل ڳجهو رکي ٿو. ڪنهن ٻئي ڌر کي اوهان جو ڊيٽا نٿو ڏنو وڃي.' },
      { title: '2. آف لائن اسٽوريج', desc: 'اوهان جو ڊيٽا فون ۾ محفوظ رهي ٿو ۽ نيٽ ملڻ تي محفوظ انڪرپشن سان ڪلائوڊ تي بيڪ اپ ٿئي ٿو.' },
      { title: '3. AI آپريشنز', desc: 'AI منشي رڳو سافٽ ويئر هلائڻ ۾ مدد ڪري ٿو ۽ حساس کاتي جو مڪمل اختيار اوهان وٽ رهي ٿو.' },
    ],
    termsTitle: 'شرطون ۽ ضابطا (Terms of Service)',
    termsSections: [
      { title: '1. سروس جو استعمال', desc: 'AsaniBiz اڪائونٽنگ، بلنگ، کاتي ۽ اسٽاڪ کي سنڀالڻ لاءِ تيار ڪيل آهي.' },
      { title: '2. 30 ڏينهن جو مفت ٽرائل', desc: 'هر نئون واهپيدار بغير ڪنهن پئسي جي 30 ڏينهن تائين سموريون سهولتون آزمائي سگهي ٿو.' },
      { title: '3. حساب جي پڪ', desc: 'دڪاندار ذميوار آهي ته ڪنهن به بل يا پرچي کي سيو ڪرڻ کان اڳ پنهنجي تسلي ڪري وٺي.' },
    ],
    closeBtn: 'بند ڪريو (Close)',
  },
  ps: {
    privacyTitle: 'د محرمیت تګلاره (Privacy Policy)',
    privacySections: [
      { title: '۱. د معلوماتو بشپړ محرمیت', desc: 'AsaniBiz ستاسو د کهاتہ، پلور، لګښتونو او ګټې معلومات پټ ساتي او له هیچا سره یې نه شریکوي.' },
      { title: '۲. آفلاین ذخیره', desc: 'معلومات ستاسو په موبایل کې خوندي وي او کله چې انټرنیټ راشي، په خوندي ډول کلاوډ ته ځي.' },
      { title: '۳. د AI عملیات', desc: 'د AI منشي عملیات یوازې د اسانۍ لپاره دي او مالي کنټرول یوازې د دوکاندار په لاس کې دی.' },
    ],
    termsTitle: 'شرایط او مقررات (Terms of Service)',
    termsSections: [
      { title: '۱. د خدماتو کارول', desc: 'AsaniBiz د کوچنیو او متوسطو دوکانونو لپاره د بلینګ او حساب کتاب آسانتیا برابروي.' },
      { title: '۲. ۳۰ ورځې وړیا ازموینه', desc: 'هر نوی کارونکی کولای شي ۳۰ ورځې ټولې ځانګړتیاوې پرته له پیسو وازمويي.' },
      { title: '۳. د حساب بیاکتنه', desc: 'کارونکی مسؤل دی چې د AI لخوا را ایستل شوي مقدارونه او بلونه مخکې له ثبتولو یو ځل بیا وګوري.' },
    ],
    closeBtn: 'بند کړئ (Close)',
  },
  pa: {
    privacyTitle: 'پرائیویسی پالیسی (Privacy Policy)',
    privacySections: [
      { title: '1. ڈیٹا دی مکمل رازداری', desc: 'AsaniBiz تہاڈے کاروباری کھاتے، سیل، خرچے تے منافع نوں خفیہ رکھدا اے۔ تہاڈا ڈیٹا کسے نوں نہیں دتا جاندا۔' },
      { title: '2. آف لائن اسٹوریج', desc: 'تہاڈے فون وچ ڈیٹا محفوظ رہندا اے تے نیٹ آن تے کلاؤڈ تے بیک اپ ہو جاندا اے۔' },
      { title: '3. AI آپریشنز', desc: 'AI منشی صرف سہولت واسطے اے، پکا کنٹرول تہاڈے اپنے ہتھ وچ رہندا اے۔' },
    ],
    termsTitle: 'شرائط تے ضوابط (Terms of Service)',
    termsSections: [
      { title: '1. سروس دا استعمال', desc: 'AsaniBiz بلنگ، کھاتہ، اسٹاک تے اخراجات سنبھالن واسطے بنایا گیا اے۔' },
      { title: '2. 30 دن دا مفت ٹرائل', desc: 'ہر نواں دکاندار 30 دن تیکر بغیر کسے فیس دے سارا سسٹم چلا سکدا اے۔' },
      { title: '3. حسابی تصدیق', desc: 'دکاندار دی ذمہ داری اے کہ بل یا پرچی سیو کرن توں پہلاں خود تسلی کر لوے۔' },
    ],
    closeBtn: 'بند کرو (Close)',
  },
  en: {
    privacyTitle: 'Privacy Policy',
    privacySections: [
      { title: '1. Strict Confidentiality', desc: 'AsaniBiz treats all ledgers, transaction records, expenses, and supplier data as strictly confidential. Your data is never sold, leased, or shared.' },
      { title: '2. Offline-First Storage', desc: 'Your local records remain durable on your device and sync through TLS-encrypted connections when internet is available.' },
      { title: '3. Operational AI Protections', desc: 'AI Munshi operational queries are strictly utilized to execute software actions and never used to expose your proprietary trade margins.' },
    ],
    termsTitle: 'Terms of Service',
    termsSections: [
      { title: '1. Permitted Use', desc: 'AsaniBiz provides bookkeeping, POS invoicing, inventory management, and business intelligence for commercial enterprises.' },
      { title: '2. 30-Day Free Trial', desc: 'New users receive 30 days of full, unrestricted access to both core and advanced capabilities without advance payment or card commitments.' },
      { title: '3. Final Calculation Verification', desc: 'Merchants retain full authority to review, adjust, and approve AI-extracted paper parchis and drafted expense vouchers before commits.' },
    ],
    closeBtn: 'Close',
  },
};

