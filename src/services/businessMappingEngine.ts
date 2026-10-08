import { BusinessTypeId, LanguageCode } from '../types';
import { BUSINESS_THEMES, BusinessToolItem } from '../config/businessDashboardConfig';

export interface BusinessMappingResult {
  businessType: BusinessTypeId;
  confidence: number;
  matchedCategoryLabel: Record<LanguageCode, string>;
  tradeMode: 'retail' | 'wholesale' | 'both' | 'service';
  recommendedTools: string[];
  allActiveTools: BusinessToolItem[];
  clarificationRequired: boolean;
  clarificationQuestion?: Record<LanguageCode, string>;
  clarificationOptions?: Array<{
    id: string;
    label: Record<LanguageCode, string>;
  }>;
  isAiFallback: boolean;
}

interface CategoryKeywordMap {
  id: BusinessTypeId;
  labels: Record<LanguageCode, string>;
  keywords: string[];
  strongKeywords: string[];
  themeColor: string;
}

/**
 * Multilingual & Broad Keyword Dictionaries
 * Covers Urdu, Sindhi, Pashto, Punjabi, English, and Roman Urdu
 */
export const CATEGORY_DICTIONARIES: CategoryKeywordMap[] = [
  {
    id: 'kiryana',
    labels: {
      ur: 'کریانہ و جنرل اسٹور',
      sd: 'ڪريانا ۽ جنرل اسٽور',
      ps: 'کریانه او عمومي دوکان',
      pa: 'کریانہ تے جنرل سٹور',
      en: 'Grocery & General Store',
      'ur-roman': 'Kiryana & General Store',
    },
    strongKeywords: [
      'kiryana', 'karyana', 'grocery', 'ration', 'general store', 'super store', 'mini mart',
      'کریانہ', 'کریانہ اسٹور', 'جنرل سٹور', 'راشن', 'سودا سلف', 'ڪريانا', 'کریانه', 'پنساری', 'pansar'
    ],
    keywords: [
      'atta', 'chawal', 'daal', 'ghee', 'oil', 'sugar', 'cheeni', 'tea', 'chai patti', 'soap', 'masala',
      'provisions', 'karyna', 'kirana', 'dokan', 'dukan', 'store', 'kiryana dukan', 'rashan', 'paan shop',
      'آٹا', 'چاول', 'دالیں', 'گھی', 'تیل', 'چینی', 'مصالحہ جات', 'هټۍ', 'دوکان', 'سوڈا', 'کنفیکشنری'
    ],
    themeColor: '#0a5e54',
  },
  {
    id: 'clothing',
    labels: {
      ur: 'کپڑے و گارمنٹس (بوٹیک)',
      sd: 'ڪپڙا ۽ گارمنٽس',
      ps: 'کالي او د جامو دوکان',
      pa: 'کپڑے تے گارمنٹس',
      en: 'Garments & Clothing (Boutique)',
      'ur-roman': 'Clothing & Garments (Boutique)',
    },
    strongKeywords: [
      'garments', 'clothing', 'clothes', 'kapray', 'boutique', 'fabric', 'unstitched',
      'کپڑے', 'گارمنٹس', 'بوٹیک', 'پوشاک', 'وسلو', 'جامې', 'رخت'
    ],
    keywords: [
      'suit', 'shalwar kameez', 'lawn', 'cotton', 'kurti', 'shirt', 'pants', 'trousers',
      'hosiery', 'readymade', 'dupatta', 'shawl', 'kapra', 'kapre', 'libas', 'tailoring cloth',
      'سوٹ', 'لان', 'کاٹن', 'قمیض', 'دوپٹہ', 'شلوار', 'ریڈی میڈ', 'ہوزری', 'کپڑے کی دکان'
    ],
    themeColor: '#7c3aed',
  },
  {
    id: 'wholesale',
    labels: {
      ur: 'ہول سیل و تھوک ڈیلر',
      sd: 'هول سيل ۽ ٿوڪ واپار',
      ps: 'عمده پلورنه او ویشونکي',
      pa: 'ہول سیل تے تھوک ڈیلر',
      en: 'Wholesale & Bulk Distributor',
      'ur-roman': 'Wholesale & Bulk Distributor',
    },
    strongKeywords: [
      'wholesale', 'wholesaler', 'thok', 'bulk', 'distributor', 'distribution', 'agency',
      'ہول سیل', 'تھوک', 'ہول سیلر', 'ڈسٹری بیوٹر', 'ايجنسي', 'عمده پلورونکی'
    ],
    keywords: [
      'b2b', 'dealer', 'supply', 'maal supply', 'carton', 'bori', 'tora', 'galla mandi',
      'کارتن', 'بوری', 'توڑا', 'غلہ منڈی', 'مال سپلائی', 'ایجنسی', 'تھوک کا کام'
    ],
    themeColor: '#d97706',
  },
  {
    id: 'restaurant',
    labels: {
      ur: 'ریسٹورنٹ و ہوٹل (کھانا پینا)',
      sd: 'ريسٽورنٽ ۽ هوٽل',
      ps: 'هوټل او د خوړو ځای',
      pa: 'ہوٹل تے ریسٹورنٹ',
      en: 'Restaurant, Hotel & Cafe',
      'ur-roman': 'Restaurant, Hotel & Cafe',
    },
    strongKeywords: [
      'hotel', 'restaurant', 'dhaba', 'cafe', 'fast food', 'biryani', 'bbq', 'food corner',
      'ہوٹل', 'ریسٹورنٹ', 'ڈھابہ', 'کیفے', 'بریانی', 'بار بی کیو', 'پخلنځی', 'طعام'
    ],
    keywords: [
      'chai', 'tea stall', 'karahi', 'tikka', 'burger', 'pizza', 'roti', 'naan', 'tandoor',
      'khana', 'pakwan', 'catering', 'dhabba', 'chaye', 'khaba', 'nashta', 'salan',
      'کڑاہی', 'تکہ', 'نان بائی', 'تندور', 'کھانا', 'ناشتہ', 'پکوان', 'ہوٹل کا کام'
    ],
    themeColor: '#ea580c',
  },
  {
    id: 'pharmacy',
    labels: {
      ur: 'میڈیکل اسٹور و فارمیسی',
      sd: 'ميڊيڪل اسٽور ۽ فارميسي',
      ps: 'د درملو دوکان او فارمیسي',
      pa: 'میڈیکل سٹور تے فارمیسی',
      en: 'Medical Store & Pharmacy',
      'ur-roman': 'Medical Store & Pharmacy',
    },
    strongKeywords: [
      'medical store', 'pharmacy', 'chemist', 'medicine', 'dawa', 'dawakhana', 'clinic',
      'میڈیکل اسٹور', 'فارمیسی', 'دواخانہ', 'ادویات', 'کیمسٹ', 'درملتون', 'درمل'
    ],
    keywords: [
      'tablets', 'syrup', 'injection', 'pharma', 'dispensary', 'doctor clinic', 'dawayian',
      'طبی', 'نسخہ', 'گولیاں', 'شربت', 'انجکشن', 'ڈسپنسری', 'دوا'
    ],
    themeColor: '#0891b2',
  },
  {
    id: 'hardware',
    labels: {
      ur: 'ہارڈویئر، سینیٹری و پینٹ',
      sd: 'هارڊويئر ۽ سينيٽري',
      ps: 'د هارډویر او ودانیزو توکو دوکان',
      pa: 'ہارڈویئر تے سینیٹری',
      en: 'Hardware, Sanitary & Tools',
      'ur-roman': 'Hardware, Sanitary & Tools',
    },
    strongKeywords: [
      'hardware', 'sanitary', 'tools', 'paint', 'building material', 'pipes',
      'ہارڈویئر', 'سینیٹری', 'اوزار', 'پینٹ', 'رنگ روغن', 'پائپ', 'تعمیراتی سامان'
    ],
    keywords: [
      'saria', 'cement', 'iron', 'steel', 'fitting', 'tap', 'drill', 'electric tools', 'wire',
      'سریا', 'سیمنٹ', 'لوہا', 'نلکے', 'فٹنگ', 'رنگ', 'ہارڈویئر کا کام'
    ],
    themeColor: '#475569',
  },
  {
    id: 'autoparts',
    labels: {
      ur: 'آٹو پارٹس و ورکشاپ',
      sd: 'آٽو پارٽس ۽ ورڪشاپ',
      ps: 'د موټر پرزو او ورکشاپ دوکان',
      pa: 'آٹو پارٹس تے موٹر ورکشاپ',
      en: 'Auto Spare Parts & Workshop',
      'ur-roman': 'Auto Spare Parts & Workshop',
    },
    strongKeywords: [
      'autoparts', 'auto parts', 'workshop', 'mechanic', 'spare parts', 'motorcycle repair',
      'آٹو پارٹس', 'ورکشاپ', 'مکینک', 'موٹر سائیکل', 'گاڑی کی مرمت', 'سپئیر پارٹس'
    ],
    keywords: [
      'oil change', 'mobil oil', 'tyre', 'puncture', 'brake', 'engine', 'bike', 'car', 'rickshaw',
      'موبل آئل', 'ٹائر', 'پنکچر', 'بریک', 'انجن', 'مستری', 'آٹو ورکشاپ'
    ],
    themeColor: '#dc2626',
  },
  {
    id: 'mobile',
    labels: {
      ur: 'موبائل شاپ و اسیسریز',
      sd: 'موبائل ۽ لوازمات',
      ps: 'د مبایل او سامانونو دوکان',
      pa: 'موبائل شاپ تے سامان',
      en: 'Mobile & Accessories',
      'ur-roman': 'Mobile & Accessories',
    },
    strongKeywords: [
      'mobile', 'mobile shop', 'accessories', 'smart phone', 'easyload', 'mobile repair',
      'موبائل', 'موبائل شاپ', 'اسیسریز', 'ایزی لوڈ', 'مبایل', 'موبائل مرمت'
    ],
    keywords: [
      'charger', 'handfree', 'cover', 'glass', 'sim', 'jazzcash', 'easypaisa', 'charging',
      'چارجر', 'ہینڈ فری', 'گلاس', 'کور', 'سم', 'موبائل کا سامان'
    ],
    themeColor: '#2563eb',
  },
  {
    id: 'electronics',
    labels: {
      ur: 'الیکٹرانکس و الیکٹرک اسٹور',
      sd: 'اليڪٽرانڪس ۽ بجليءَ جو سامان',
      ps: 'د برېښنا او الکترونیکي توکو دوکان',
      pa: 'الیکٹرانکس تے بجلی دا سامان',
      en: 'Electronics & Home Appliances',
      'ur-roman': 'Electronics & Home Appliances',
    },
    strongKeywords: [
      'electronics', 'electric', 'appliances', 'solar', 'ac', 'refrigerator', 'fridge',
      'الیکٹرانکس', 'بجلی کا سامان', 'سولر', 'فریج', 'پنکھے', 'برقی آلات'
    ],
    keywords: [
      'fan', 'cooler', 'led', 'tv', 'inverter', 'battery', 'wire', 'switch', 'washing machine',
      'کولر', 'واشنگ مشین', 'بیٹری', 'تاریں', 'سوئچ', 'الیکٹرک اسٹور'
    ],
    themeColor: '#0284c7',
  },
  {
    id: 'fruit_veg',
    labels: {
      ur: 'سبزی و فروٹ کی دکان',
      sd: 'ڀاڄي ۽ ميون جو دڪان',
      ps: 'د مېوې او سبو دوکان',
      pa: 'سبزی تے پھل دی دکان',
      en: 'Fruit & Vegetable Shop',
      'ur-roman': 'Fruit & Vegetable Shop',
    },
    strongKeywords: [
      'fruit', 'vegetable', 'sabzi', 'phal', 'sabzi mandi', 'fruit shop',
      'سبزی', 'فروٹ', 'پھل', 'سبزی منڈی', 'ترکاری', 'مېوه', 'سابه'
    ],
    keywords: [
      'aloo', 'pyaz', 'tamatar', 'apple', 'banana', 'mango', 'orange', 'fresh vegetables',
      'آلو', 'پیاز', 'ٹماٹر', 'سیب', 'کیلا', 'آم', 'تازہ پھل'
    ],
    themeColor: '#16a34a',
  },
  {
    id: 'bakery',
    labels: {
      ur: 'بیکری و مٹھائی (سویٹس)',
      sd: 'بيڪري ۽ مٺائي',
      ps: 'بیکري او د خوږو دوکان',
      pa: 'بیکری تے مٹھائی',
      en: 'Bakery & Sweets',
      'ur-roman': 'Bakery & Sweets',
    },
    strongKeywords: [
      'bakery', 'sweets', 'mithai', 'cake', 'halwai', 'nimko',
      'بیکری', 'مٹھائی', 'حلوائی', 'کیک', 'نمکو', 'شیرینی'
    ],
    keywords: [
      'bread', 'biscuit', 'pastry', 'rusk', 'samosa', 'gulab jamun', 'jalebi', 'sweet shop',
      'ڈبل روٹی', 'بسکٹ', 'پیسٹری', 'رس', 'سموسہ', 'جلیبی', 'گلاب جامن'
    ],
    themeColor: '#f59e0b',
  },
  {
    id: 'dairy',
    labels: {
      ur: 'ڈیری شاپ (دودھ دہی)',
      sd: 'ڊيري ۽ کير جو دڪان',
      ps: 'د شیدو او مستو دوکان',
      pa: 'ڈیری شاپ (دودھ دہی)',
      en: 'Dairy & Milk Shop',
      'ur-roman': 'Dairy & Milk Shop',
    },
    strongKeywords: [
      'dairy', 'milk', 'doodh', 'dahi', 'yogurt', 'milk shop',
      'ڈیری', 'دودھ', 'دہی', 'کھیر', 'شوده', 'ماستې', 'دودھ کی دکان'
    ],
    keywords: [
      'paneer', 'butter', 'makhan', 'ghee', 'lassi', 'khoya', 'fresh milk',
      'پنیر', 'مکھن', 'لسی', 'کھویا', 'ڈیری فارم'
    ],
    themeColor: '#06b6d4',
  },
  {
    id: 'meat_shop',
    labels: {
      ur: 'گوشت و چکن شاپ (قصاب)',
      sd: 'گوشت ۽ ڪڪڙ جو دڪان',
      ps: 'د غوښې او چرګانو دوکان',
      pa: 'گوشت تے مرغی دی دکان',
      en: 'Meat & Poultry Shop',
      'ur-roman': 'Meat & Poultry Shop',
    },
    strongKeywords: [
      'meat', 'chicken', 'butcher', 'gosht', 'murghi', 'qasai', 'beef', 'mutton',
      'گوشت', 'مرغی', 'قصاب', 'بیف', 'مٹن', 'غوښه', 'چرګ'
    ],
    keywords: [
      'fish', 'machli', 'broiler', 'desi murghi', 'keema', 'chops',
      'مچھلی', 'قیمہ', 'مرغی کا گوشت', 'چھوٹا گوشت', 'بڑا گوشت'
    ],
    themeColor: '#b91c1c',
  },
  {
    id: 'shoes',
    labels: {
      ur: 'جوتے و فٹ ویئر',
      sd: 'جتيون ۽ فوٽ ويئر',
      ps: 'د بوټانو دوکان',
      pa: 'جوتے تے چپل',
      en: 'Footwear & Shoes',
      'ur-roman': 'Footwear & Shoes',
    },
    strongKeywords: [
      'shoes', 'footwear', 'chappal', 'sandal', 'joote', 'boots',
      'جوتے', 'چپل', 'سلیپر', 'سینڈل', 'بوٹ', 'بوټان', 'پېزار'
    ],
    keywords: [
      'slippers', 'joggers', 'leather shoes', 'khussa', 'peshawari chappal',
      'جاگرز', 'چمڑے کے جوتے', 'کھسہ', 'پشاوری چپل'
    ],
    themeColor: '#78716c',
  },
  {
    id: 'salon',
    labels: {
      ur: 'ہیئر سیلون و بیوٹی پارلر',
      sd: 'وارن جو سيلون ۽ بيوٽي پارلر',
      ps: 'د ویښتانو سیلون او ښکلا ځای',
      pa: 'سیلون تے نائی',
      en: 'Hair Salon & Beauty Parlour',
      'ur-roman': 'Hair Salon & Beauty Parlour',
    },
    strongKeywords: [
      'salon', 'parlour', 'barber', 'hair cut', 'beauty parlour', 'hairdresser',
      'سیلون', 'بیوٹی پارلر', 'حجام', 'نائی', 'ہیئر کٹنگ'
    ],
    keywords: [
      'shave', 'facial', 'hair color', 'makeup', 'grooming', 'hair style',
      'شیو', 'فیشل', 'میک اپ', 'بالوں کی کٹنگ'
    ],
    themeColor: '#ec4899',
  },
  {
    id: 'tailor',
    labels: {
      ur: 'درزی و سلائی سنٹر',
      sd: 'درزي ۽ سڀائي مرڪز',
      ps: 'د خیاطۍ او ګنډلو دوکان',
      pa: 'درزی تے سلائی سنٹر',
      en: 'Tailor & Stitching Center',
      'ur-roman': 'Tailor & Stitching Center',
    },
    strongKeywords: [
      'tailor', 'darzi', 'stitching', 'silai', 'sewing', 'tailoring',
      'درزی', 'سلائی', 'خیاط', 'سوٹ سلائی', 'درزی کی دکان'
    ],
    keywords: [
      'suit stitching', 'fitting', 'cutting', 'collar', 'cuff', 'button',
      'کف', 'کالر', 'کٹنگ', 'سلائی سنٹر'
    ],
    themeColor: '#8b5cf6',
  },
  {
    id: 'furniture',
    labels: {
      ur: 'فرنیچر و ہوم ڈیکور',
      sd: 'فرنيچر ۽ هوم ڊيڪور',
      ps: 'د فرنیچر او کور ښکلا دوکان',
      pa: 'فرنیچر تے لکڑی دا کام',
      en: 'Furniture & Home Decor',
      'ur-roman': 'Furniture & Home Decor',
    },
    strongKeywords: [
      'furniture', 'sofa', 'bed', 'woodwork', 'carpenter',
      'فرنیچر', 'صوفہ', 'بیڈ', 'بڑھئی', 'لکڑی کا کام', 'الماری'
    ],
    keywords: [
      'dining table', 'almirah', 'wardrobe', 'cushion', 'mattress', 'chair',
      'میز', 'کرسی', 'گدے', 'ڈریسنگ'
    ],
    themeColor: '#92400e',
  },
  {
    id: 'cosmetics',
    labels: {
      ur: 'کاسمیٹکس و جیولری',
      sd: 'ڪاسميٽڪس ۽ زيور',
      ps: 'د ښکلا او سینګار توکي',
      pa: 'کاسمیٹکس تے میک اپ',
      en: 'Cosmetics & Jewelry',
      'ur-roman': 'Cosmetics & Jewelry',
    },
    strongKeywords: [
      'cosmetics', 'makeup', 'beauty products', 'perfume', 'jewelry', 'artificial jewelry',
      'کاسمیٹکس', 'میک اپ', 'عطر', 'خوشبو', 'جیولری', 'زیورات'
    ],
    keywords: [
      'lipstick', 'cream', 'lotion', 'nail polish', 'earrings', 'bangles',
      'چوڑیاں', 'کانٹے', 'کریم', 'لوشن'
    ],
    themeColor: '#f43f5e',
  },
  {
    id: 'online_business',
    labels: {
      ur: 'آن لائن و ای کامرس سیلر',
      sd: 'آن لائن ۽ واٽس ايپ سيلر',
      ps: 'انلاین سوداګري او پلورنه',
      pa: 'آن لائن تے واٹس ایپ سیلر',
      en: 'Online & E-Commerce Seller',
      'ur-roman': 'Online & E-Commerce Seller',
    },
    strongKeywords: [
      'online', 'ecommerce', 'daraz', 'whatsapp seller', 'social media seller', 'online store',
      'آن لائن', 'واٹس ایپ سیلر', 'ای کامرس', 'دراز سیلر', 'انلاین دوکان'
    ],
    keywords: [
      'delivery', 'tcs', 'leopard', 'parcel', 'dropshipping', 'online orders',
      'پارسل', 'ڈلیوری', 'آرڈرز'
    ],
    themeColor: '#059669',
  },
];

/**
 * Deterministic Business Profile Mapping Engine
 * Operates purely locally at ZERO API token cost.
 */
export function mapBusinessDescription(
  rawInput: string,
  preferredLanguage: LanguageCode = 'ur'
): BusinessMappingResult {
  const clean = rawInput.trim().toLowerCase();

  // Detect Trade Mode (Retail vs Wholesale vs Both vs Service)
  let tradeMode: 'retail' | 'wholesale' | 'both' | 'service' = 'retail';
  const hasWholesaleKeyword =
    clean.includes('wholesale') ||
    clean.includes('wholesaler') ||
    clean.includes('thok') ||
    clean.includes('ہول سیل') ||
    clean.includes('تھوک') ||
    clean.includes('عمده') ||
    clean.includes('bulk');

  const hasRetailKeyword =
    clean.includes('retail') ||
    clean.includes('parchoon') ||
    clean.includes('parchun') ||
    clean.includes('پرچون') ||
    clean.includes('ریٹیل') ||
    clean.includes('دکان');

  const hasBothKeyword =
    clean.includes('dono') ||
    clean.includes('both') ||
    clean.includes('دونوں') ||
    (hasWholesaleKeyword && hasRetailKeyword);

  if (hasBothKeyword) {
    tradeMode = 'both';
  } else if (hasWholesaleKeyword) {
    tradeMode = 'wholesale';
  } else if (clean.includes('service') || clean.includes('repair') || clean.includes('مرمت') || clean.includes('مکینک')) {
    tradeMode = 'service';
  } else {
    tradeMode = 'retail';
  }

  // Calculate scores across all categories using strong and general keywords
  const scores = CATEGORY_DICTIONARIES.map((cat) => {
    let score = 0;
    const matchedWords: string[] = [];

    // Strong keywords give high confidence (0.6 each)
    for (const sk of cat.strongKeywords) {
      if (clean.includes(sk.toLowerCase())) {
        score += 0.6;
        matchedWords.push(sk);
      }
    }

    // General keywords give moderate confidence (0.2 each)
    for (const gk of cat.keywords) {
      if (clean.includes(gk.toLowerCase())) {
        score += 0.25;
        matchedWords.push(gk);
      }
    }

    return {
      category: cat,
      score: Math.min(1.0, score),
      matchedWords,
    };
  });

  // Sort descending by score
  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const runnerUp = scores[1];

  // Disambiguation check: E.g., user said "garments" but also "wholesale", or score difference is tight
  const isAmbiguous = runnerUp && runnerUp.score >= 0.4 && (top.score - runnerUp.score) < 0.2;

  let selectedId: BusinessTypeId = 'kiryana';
  let confidence = 0.5;
  let categoryLabels = CATEGORY_DICTIONARIES[0].labels;

  if (top && top.score >= 0.2) {
    selectedId = top.category.id;
    confidence = top.score;
    categoryLabels = top.category.labels;
  } else {
    // If tradeMode is explicitly wholesale without specific category, map to wholesale
    if (tradeMode === 'wholesale') {
      selectedId = 'wholesale';
      confidence = 0.7;
      const wsCat = CATEGORY_DICTIONARIES.find((c) => c.id === 'wholesale');
      if (wsCat) categoryLabels = wsCat.labels;
    } else {
      // General retail fallback
      selectedId = 'kiryana';
      confidence = 0.35;
    }
  }

  // Generate Personalized Dashboard Tools without any artificial limit (e.g. 8 tools cap removed!)
  const recommendedTools = getRecommendedToolsForProfile(selectedId, tradeMode);
  const theme = BUSINESS_THEMES[selectedId] || BUSINESS_THEMES.kiryana;
  const allActiveTools = theme.tools || [];

  // Check if clarification is helpful (e.g., when retail vs wholesale wasn't explicitly stated for goods businesses)
  let clarificationRequired = false;
  let clarificationQuestion: Record<LanguageCode, string> | undefined;
  let clarificationOptions: Array<{ id: string; label: Record<LanguageCode, string> }> | undefined;

  const goodsCategories = ['clothing', 'kiryana', 'hardware', 'mobile', 'autoparts', 'shoes'];
  if (goodsCategories.includes(selectedId) && !clean.includes('wholesale') && !clean.includes('retail') && !clean.includes('پرچون') && !clean.includes('تھوک') && !clean.includes('ہول سیل')) {
    clarificationRequired = true;
    clarificationQuestion = {
      ur: 'کیا آپ ریٹیل (پرچون) میں فروخت کرتے ہیں یا ہول سیل (تھوک)؟',
      sd: 'ڇا اوهان ريٽيل (پرچون) ۾ سامان وڪرو ڪريو ٿا يا هول سيل (ٿوڪ)؟',
      ps: 'ایا تاسو پرچون پلورئ که عمده (هول سیل)؟',
      pa: 'کی تسیں پرچون وچ سامان ویچدے او یا ہول سیل؟',
      en: 'Do you sell primarily in Retail or Wholesale?',
      'ur-roman': 'Aap retail (parchoon) karte hain ya wholesale (thok)?',
    };
    clarificationOptions = [
      {
        id: 'retail',
        label: {
          ur: 'ریٹیل (عام گاہک / پرچون)',
          sd: 'ريٽيل (عام گراهڪ / پرچون)',
          ps: 'پرچون (عام پېرودونکي)',
          pa: 'ریٹیل (عام گاہک / پرچون)',
          en: 'Retail (End Customers)',
          'ur-roman': 'Retail (Parchoon)',
        },
      },
      {
        id: 'wholesale',
        label: {
          ur: 'ہول سیل (دکانداروں کو مال سپلائی)',
          sd: 'هول سيل (دڪاندارن کي سپلائي)',
          ps: 'عمده / هول سیل (دوکاندارانو ته مال)',
          pa: 'ہول سیل (دکانداراں نوں مال)',
          en: 'Wholesale (Supplying Shopkeepers)',
          'ur-roman': 'Wholesale (Thok Dealer)',
        },
      },
      {
        id: 'both',
        label: {
          ur: 'دونوں (ریٹیل بھی اور ہول سیل بھی)',
          sd: 'ٻئي (ريٽيل ۽ هول سيل ٻئي)',
          ps: 'دواړه (پرچون او عمده)',
          pa: 'دونوں (ریٹیل تے ہول سیل)',
          en: 'Both (Retail & Wholesale)',
          'ur-roman': 'Dono (Retail & Wholesale)',
        },
      },
    ];
  }

  return {
    businessType: selectedId,
    confidence,
    matchedCategoryLabel: categoryLabels,
    tradeMode,
    recommendedTools,
    allActiveTools,
    clarificationRequired,
    clarificationQuestion,
    clarificationOptions,
    isAiFallback: false,
  };
}

/**
 * Determine dynamic list of prioritized dashboard tools based on business and trade mode.
 * NO ARTIFICIAL CEILING: If a business needs 9, 10, 11+ tools, all relevant tools are prioritized.
 */
export function getRecommendedToolsForProfile(
  businessType: BusinessTypeId,
  tradeMode: 'retail' | 'wholesale' | 'both' | 'service' = 'retail'
): string[] {
  // Wholesale or dual trade mode prioritization
  if (tradeMode === 'wholesale' || businessType === 'wholesale') {
    return [
      'new_bill',       // Sales / Invoices
      'purchase',       // Purchases / Inward Stock
      'stock',          // Inventory / Warehouse
      'khata',          // Customer Udhaar Ledger
      'customers',      // Customer Directory
      'suppliers',      // Supplier Balances
      'expenses',       // Overhead & Transport Expenses
      'reports',        // Profit & Sales Analytics
      'ai_munshi',      // AI Assistant
    ];
  }

  switch (businessType) {
    case 'restaurant':
    case 'cafe':
      return [
        'new_bill',       // Order & Table Billing
        'daily_sales',    // Today's Cash & Counter
        'expenses',       // Kitchen & Overhead Expenses
        'purchase',       // Raw Meat, Vegetables & Ration
        'stock',          // Inventory
        'khata',          // Credit Ledger
        'reports',        // Sales & Profit Report
        'ai_munshi',      // AI Munshi
      ];

    case 'pharmacy':
      return [
        'new_sale',       // Medicine Bill
        'medicines',      // Medicine Catalog
        'stock',          // Inventory
        'low_stock',      // Low Stock Alert
        'purchase',       // Distributor Purchases
        'suppliers',      // Pharma Distributors
        'khata',          // Patient & Doctor Khata
        'expenses',       // Pharmacy Expenses
        'reports',        // Pharma Reports
        'ai_munshi',      // AI Munshi
      ];

    case 'autoparts':
      return [
        'new_bill',       // Sale & Work Bill
        'products',       // Spare Parts List
        'stock',          // Spare Parts Inventory
        'purchase',       // Parts Purchases
        'suppliers',      // Parts Dealers
        'khata',          // Customer Khata
        'expenses',       // Workshop Daily Expenses
        'reports',        // Performance Reports
        'ai_munshi',      // AI Munshi
      ];

    case 'mobile':
      return [
        'new_bill',       // Mobile & Accessories Sale
        'products',       // Phones & Gadgets Catalog
        'stock',          // Stock Units
        'khata',          // Customer Credit
        'purchase',       // Vendor Purchases
        'expenses',       // Shop Expenses
        'reports',        // Sales & Margins
        'ai_munshi',      // AI Munshi
      ];

    case 'clothing':
      return [
        'new_bill',       // Garments POS
        'products',       // Suits, Fabrics & Sizes
        'stock',          // Stock
        'khata',          // Regular Customer Udhaar
        'purchase',       // Cloth Wholesale Purchases
        'suppliers',      // Textile Mills / Wholesalers
        'expenses',       // Shop Expenses
        'reports',        // Sales & Profit
        'ai_munshi',      // AI Munshi
      ];

    case 'hardware':
      return [
        'new_bill',       // Building & Tool Billing
        'products',       // Hardware & Sanitary Items
        'stock',          // Weight & Unit Stock
        'khata',          // Contractor / Mistry Udhaar
        'purchase',       // Mill & Factory Purchases
        'suppliers',      // Distributors
        'expenses',       // Transport & Overheads
        'reports',        // Margin Reports
        'ai_munshi',      // AI Munshi
      ];

    case 'kiryana':
    default:
      return [
        'new_bill',       // Fast Billing / Counter
        'stock',          // Stock & Inventory
        'khata',          // Khata / Udhaar
        'customers',      // Customer List
        'products',       // Product Catalog
        'purchase',       // Daily Purchase & Ghee/Ration
        'suppliers',      // Dealers & Wholesale Suppliers
        'expenses',       // Daily Shop Expenses
        'daily_sales',    // Daily Cash Summary
        'low_stock',      // Low Stock Alert
        'reports',        // Complete Khata & Profit Report
        'ai_munshi',      // AI Munshi
      ];
  }
}

/**
 * Generate Predefined Multilingual Welcome Message
 * ZERO-TOKEN: Pure local string interpolation, NO Gemini call!
 */
export function getPersonalizedWelcomeMessage(
  ownerName: string,
  businessName: string,
  lang: LanguageCode = 'ur'
): { title: string; body: string; speech: string } {
  const safeName = ownerName.trim() || 'صاحب';

  switch (lang) {
    case 'ur':
      return {
        title: `السلام علیکم، ${safeName}!`,
        body: `میں آسانی بز کا اے آئی منشی ہوں۔ میں آپ کے کاروبار "${businessName}" کا حساب کتاب، اسٹاک، کھاتہ اور روزمرہ کے کام آسان بنانے میں مدد کروں گا۔ آپ کا ڈیش بورڈ کامیابی سے تیار ہے۔`,
        speech: `السلام علیکم ${safeName}۔ میں آسانی بز کا اے آئی منشی ہوں۔ آپ کے کاروبار کا ڈیش بورڈ تیار ہے۔`,
      };
    case 'sd':
      return {
        title: `اسلام عليڪم، ${safeName}!`,
        body: `مان آساني بز جو اي آءِ منشي آهيان۔ مان اوهان جي ڪاروبار "${businessName}" جو حساب، اسٽاڪ، کاتو ۽ روزانو ڪم آسان ڪرڻ ۾ مدد ڪندس۔ اوهان جو ڊيش بورڊ تيار آهي۔`,
        speech: `اسلام عليڪم ${safeName}۔ مان آساني بز جو اي آءِ منشي آهيان۔ اوهان جو ڊيش بورڊ تيار آهي۔`,
      };
    case 'ps':
      return {
        title: `سلام، ${safeName}!`,
        body: `زه د اساني بز ای آی منشي یم. زه به ستاسو د سوداګرۍ "${businessName}" حساب، زېرمه، کهاته او ورځني کارونه اسانه کړم. ستاسو ډشبورډ په بریا چمتو شو.`,
        speech: `سلام ${safeName}۔ زه د اساني بز منشي یم. ستاسو ډشبورډ چمتو دی.`,
      };
    case 'pa':
      return {
        title: `اسلام علیکم، ${safeName}!`,
        body: `میں آسانی بز دا اے آئی منشی ہاں۔ میں تہاڈے کاروبار "${businessName}" دا حساب، سٹاک، کھاتہ تے روز دا کم سوکھا کرن چ مدد کراں گا۔ تہاڈا ڈیش بورڈ تیار اے۔`,
        speech: `اسلام علیکم ${safeName}۔ تہاڈا ڈیش بورڈ تیار اے۔`,
      };
    case 'en':
      return {
        title: `Welcome, ${safeName}!`,
        body: `I am your AsaniBiz AI Munshi. I am here to assist with billing, stock, credit ledgers, and day-to-day accounts for "${businessName}". Your personalized dashboard is ready.`,
        speech: `Welcome ${safeName}. I am your AsaniBiz AI Munshi. Your business dashboard is ready.`,
      };
    case 'ur-roman':
    default:
      return {
        title: `Assalam-o-Alaikum, ${safeName}!`,
        body: `Main AsaniBiz ka AI Munshi hoon. Main aapke karobar "${businessName}" ka hisaab, stock, khata aur rozmarra ke kaam asaan karne mein madad karunga. Aapka dashboard tayyar hai.`,
        speech: `Assalam-o-Alaikum ${safeName}. Main AsaniBiz ka AI Munshi hoon. Aapka dashboard tayyar hai.`,
      };
  }
}
