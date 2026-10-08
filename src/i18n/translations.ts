import { LanguageCode } from '../types';

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  displayOption: string;
  isRTL: boolean;
  samplePhrase: string;
}

export const LANGUAGES: Record<Exclude<LanguageCode, 'ur-roman'>, LanguageMeta> = {
  'ur': {
    code: 'ur',
    label: 'Urdu',
    nativeLabel: 'اردو',
    displayOption: 'اردو (Urdu)',
    isRTL: true,
    samplePhrase: 'منشی، آج کی سیل کتنی ہوئی؟'
  },
  'sd': {
    code: 'sd',
    label: 'Sindhi',
    nativeLabel: 'سنڌي',
    displayOption: 'سنڌي (Sindhi)',
    isRTL: true,
    samplePhrase: 'منشي، اڄ جي ڪل وڪرو ڪيتري ٿي؟'
  },
  'en': {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    displayOption: 'English',
    isRTL: false,
    samplePhrase: 'Munshi, how much did I sell today?'
  },
  'pa': {
    code: 'pa',
    label: 'Punjabi',
    nativeLabel: 'پنجابی',
    displayOption: 'پنجابی (Punjabi)',
    isRTL: true,
    samplePhrase: 'منشی، اج دی کل سیل کنی ہوئی؟'
  },
  'ps': {
    code: 'ps',
    label: 'Pashto',
    nativeLabel: 'پښتو',
    displayOption: 'پښتو (Pashto)',
    isRTL: true,
    samplePhrase: 'منشي، نن ټول پلور څومره دی؟'
  }
};

export const LANGUAGE_ORDER: Array<Exclude<LanguageCode, 'ur-roman'>> = [
  'ur',
  'sd',
  'en',
  'pa',
  'ps'
];

export const translations: Record<string, Record<LanguageCode, string>> = {
  // Brand & Header
  appName: {
    'ur': 'آسانی بز',
    'en': 'AsaniBiz',
    'sd': 'آساني بز',
    'ps': 'آساني بز',
    'pa': 'آسانی بز',
    'ur-roman': 'AsaniBiz'
  },
  tagline: {
    'ur': 'جس کاروبار میں آسانی ہے، اس میں برکت اور سکون وسیع ہے',
    'en': 'Where business flows with ease, prosperity and peace flourish',
    'sd': 'جنهن ڪاروبار ۾ آساني آهي، ان ۾ برڪت ۽ سڪون وسيع آهي',
    'ps': 'په کوم کاروبار کې چې اساني وي، په هغه کې برکت او سکون زیات وي',
    'pa': 'جس کاروبار وچ آسانی اے، اوس وچ برکت تے سکون وسیع اے',
    'ur-roman': 'Jis karobar mein aasani hai, usmein barkat aur sukoon wasee hai'
  },
  selectLanguageHeader: {
    'ur': 'زبان منتخب کریں',
    'en': 'Select Language',
    'sd': 'ٻولي چونڊيو',
    'ps': 'ژبه وټاکئ',
    'pa': 'بولی چنو',
    'ur-roman': 'Zaban Muntakhib Karein'
  },
  syncOk: {
    'ur': 'آن لائن سنک',
    'en': 'Sync OK',
    'sd': 'آن لائن سنڪ',
    'ps': 'آن لاین همغږی',
    'pa': 'آن لائن سنک',
    'ur-roman': 'Sync OK'
  },
  offlineText: {
    'ur': 'آف لائن',
    'en': 'Offline',
    'sd': 'آف لائن',
    'ps': 'آفلاین',
    'pa': 'آف لائن',
    'ur-roman': 'Offline'
  },
  businessOffice: {
    'ur': 'پروفیشنل بزنس آفس',
    'en': 'Professional Business Office',
    'sd': 'پروفيشنل ڪاروباري آفيس',
    'ps': 'مسلکي سوداګریز دفتر',
    'pa': 'پروفیشنل بزنس آفس',
    'ur-roman': 'Professional Business Office'
  },
  businessMenu: {
    'ur': 'کاروبار مینو',
    'en': 'Business Menu',
    'sd': 'ڪاروباري مينيو',
    'ps': 'سوداګریز مینو',
    'pa': 'کاروبار مینو',
    'ur-roman': 'Karobaar Menu'
  },
  changeStore: {
    'ur': 'دکان تبدیل کریں',
    'en': 'Change Store',
    'sd': 'دڪان تبديل ڪريو',
    'ps': 'دوکان بدله کړئ',
    'pa': 'دکان بدلو',
    'ur-roman': 'Dukaan Tabdeel Karein'
  },

  // Navigation Items
  navDashboard: {
    'ur': 'ڈیش بورڈ',
    'en': 'Dashboard',
    'sd': 'ڊيش بورڊ',
    'ps': 'ډشبورډ',
    'pa': 'ڈیش بورڈ',
    'ur-roman': 'Dashboard'
  },
  navBilling: {
    'ur': 'نیا بل بنائیں',
    'en': 'New Bill',
    'sd': 'نئون بل ٺاهيو',
    'ps': 'نوی بل جوړ کړئ',
    'pa': 'نواں بل بناؤ',
    'ur-roman': 'Naya Bill Banayein'
  },
  navSales: {
    'ur': 'فروخت',
    'en': 'Sales',
    'sd': 'وڪرو',
    'ps': 'پلور',
    'pa': 'سیل',
    'ur-roman': 'Farokht (Sales)'
  },
  navKhata: {
    'ur': 'کھاتہ لیجر',
    'en': 'Khata Ledger',
    'sd': 'کاتو ليجر',
    'ps': 'کهاته ليجر',
    'pa': 'کھاتہ لیجر',
    'ur-roman': 'Khata Ledger'
  },
  navPurchases: {
    'ur': 'خریداری انوائسز',
    'en': 'Purchases',
    'sd': 'خريداري',
    'ps': 'پېرودنه',
    'pa': 'خریداری',
    'ur-roman': 'Khareedari (Purchases)'
  },
  navExpenses: {
    'ur': 'اخراجات (روزنامچہ)',
    'en': 'Expenses',
    'sd': 'خرچ (روزنامچو)',
    'ps': 'لګښتونه (روزنامچه)',
    'pa': 'خرچے (روزنامچہ)',
    'ur-roman': 'Ikhrajat (Roznamcha)'
  },
  navProducts: {
    'ur': 'پروڈکٹس و اسٹاک',
    'en': 'Products & Stock',
    'sd': 'سامان ۽ اسٽاڪ',
    'ps': 'توکي او زېرمه',
    'pa': 'پروڈکٹس تے سٹاک',
    'ur-roman': 'Products & Stock'
  },
  navStock: {
    'ur': 'اسٹاک',
    'en': 'Stock',
    'sd': 'اسٽاڪ',
    'ps': 'زېرمه',
    'pa': 'سٹاک',
    'ur-roman': 'Stock'
  },
  navReports: {
    'ur': 'کاروباری رپورٹس',
    'en': 'Reports',
    'sd': 'ڪاروباري رپورٽون',
    'ps': 'سوداګریز راپورونه',
    'pa': 'کاروباری رپورٹاں',
    'ur-roman': 'Karobari Reports'
  },
  navProfit: {
    'ur': 'منافع',
    'en': 'Profit',
    'sd': 'نفعو',
    'ps': 'ګټه',
    'pa': 'منافع',
    'ur-roman': 'Munafa'
  },
  navAIMunshi: {
    'ur': 'AI منشی',
    'en': 'AI Munshi',
    'sd': 'اي آئي منشي',
    'ps': 'ای آی منشي',
    'pa': 'اے آئی منشی',
    'ur-roman': 'AI Munshi'
  },
  navSettings: {
    'ur': 'سیٹنگز',
    'en': 'Settings',
    'sd': 'سيٽنگون',
    'ps': 'تنظیمات',
    'pa': 'سیٹنگز',
    'ur-roman': 'Settings'
  },
  navLanding: {
    'ur': 'ویب سائٹ',
    'en': 'Website',
    'sd': 'ويب سائيٽ',
    'ps': 'وېب پاڼه',
    'pa': 'ویب سائٹ',
    'ur-roman': 'Website'
  },
  navAdmin: {
    'ur': 'ایڈمن پورٹل',
    'en': 'Admin Portal',
    'sd': 'ايڊمن پورٽل',
    'ps': 'ایډمن پورټل',
    'pa': 'ایڈمن پورٹل',
    'ur-roman': 'Admin Portal'
  },

  // Dashboard Welcome & Primary Actions
  greetingOwner: {
    'ur': 'السلام علیکم، محترم دکاندار!',
    'en': 'Assalam-o-Alaikum, Merchant!',
    'sd': 'السلام عليڪم، محترم دڪاندار!',
    'ps': 'سلامونه، دروند دوکانداره!',
    'pa': 'السلام علیکم، دکاندار جی!',
    'ur-roman': 'Assalam-o-Alaikum, Dukandaar!'
  },
  talkToAIMunshi: {
    'ur': 'AI منشی سے بات کریں',
    'en': 'Talk to AI Munshi',
    'sd': 'اي آئي منشي سان ڳالهايو',
    'ps': 'ای آی منشي سره خبرې وکړئ',
    'pa': 'اے آئی منشی نال گل کرو',
    'ur-roman': 'AI Munshi Se Baat Karein'
  },
  primaryActionsTitle: {
    'ur': 'بنیادی کاروباری کام',
    'en': 'Primary Business Actions',
    'sd': 'بنيادي ڪاروباري ڪم',
    'ps': 'بنسټیز کارونه',
    'pa': 'بنیادی کاروباری کم',
    'ur-roman': 'Bunyadi Karobari Kaam'
  },
  actionNewBill: {
    'ur': 'نیا بل بنائیں',
    'en': 'New Bill',
    'sd': 'نئون بل ٺاهيو',
    'ps': 'نوی بل جوړ کړئ',
    'pa': 'نواں بل بناؤ',
    'ur-roman': 'Naya Bill Banayein'
  },
  actionNewBillDesc: {
    'ur': 'فروخت و پرچی',
    'en': 'Sales POS',
    'sd': 'وڪرو ۽ پرچي',
    'ps': 'پلور او رسید',
    'pa': 'سیل تے پرچی',
    'ur-roman': 'Farokht Aur Parchi'
  },
  actionKhata: {
    'ur': 'کھاتہ',
    'en': 'Khata Ledger',
    'sd': 'کاتو',
    'ps': 'کهاته',
    'pa': 'کھاتہ',
    'ur-roman': 'Khata'
  },
  actionKhataDesc: {
    'ur': 'ادھار و وصولی',
    'en': 'Credit & Recovery',
    'sd': 'اڌار ۽ وصولي',
    'ps': 'پور او وصولي',
    'pa': 'ادھار تے وصولی',
    'ur-roman': 'Udhaar Aur Wasooli'
  },
  actionAddProduct: {
    'ur': 'پروڈکٹ شامل کریں',
    'en': 'Add Product',
    'sd': 'سامان شامل ڪريو',
    'ps': 'توکی ورزیات کړئ',
    'pa': 'نواں مال پاؤ',
    'ur-roman': 'Product Shamil Karein'
  },
  actionAddProductDesc: {
    'ur': 'اسٹاک و قیمت',
    'en': 'Stock & Price',
    'sd': 'اسٽاڪ ۽ اگھ',
    'ps': 'زېرمه او بیه',
    'pa': 'سٹاک تے ریٹ',
    'ur-roman': 'Stock Aur Qimat'
  },

  // Dashboard Modules & Stats
  businessModulesTitle: {
    'ur': 'کاروباری سیکشنز و خلاصہ',
    'en': 'Business Modules & Overview',
    'sd': 'ڪاروباري سيڪشن ۽ خلاصو',
    'ps': 'سوداګریزې برخې او لنډیز',
    'pa': 'کاروباری خلاصہ تے سیکشنز',
    'ur-roman': 'Karobari Sections Aur Khulasa'
  },
  salesStatTitle: {
    'ur': 'فروخت',
    'en': 'Sales',
    'sd': 'وڪرو',
    'ps': 'پلور',
    'pa': 'سیل',
    'ur-roman': 'Farokht'
  },
  billsTodayCount: {
    'ur': 'بل آج بنے',
    'en': 'bills today',
    'sd': 'بل اڄ ٺهيا',
    'ps': 'نن جوړ شوي بلونه',
    'pa': 'بل اج بنے',
    'ur-roman': 'bill aaj banay'
  },
  purchasesStatTitle: {
    'ur': 'خریداری',
    'en': 'Purchases',
    'sd': 'خريداري',
    'ps': 'پېرودنه',
    'pa': 'خریداری',
    'ur-roman': 'Khareedari'
  },
  invoicesCount: {
    'ur': 'انوائسز',
    'en': 'invoices',
    'sd': 'انوائسز',
    'ps': 'بلونه',
    'pa': 'انوائساں',
    'ur-roman': 'invoices'
  },
  expensesStatTitle: {
    'ur': 'اخراجات',
    'en': 'Expenses',
    'sd': 'خرچ',
    'ps': 'لګښتونه',
    'pa': 'خرچے',
    'ur-roman': 'Ikhrajat'
  },
  expensesDesc: {
    'ur': 'روزنامچہ و بجلی چائے',
    'en': 'Daily shop expenses',
    'sd': 'روزانو بل ۽ خرچ',
    'ps': 'ورځني لګښتونه',
    'pa': 'روز دا خرچہ تے چاء',
    'ur-roman': 'Roznamcha aur bills'
  },
  profitStatTitle: {
    'ur': 'منافع',
    'en': 'Net Margin',
    'sd': 'نفعو',
    'ps': 'ګټه',
    'pa': 'منافع',
    'ur-roman': 'Munafa'
  },
  netProfitLabel: {
    'ur': 'خالص منافع',
    'en': 'Estimated Net',
    'sd': 'خالص نفعو',
    'ps': 'خالصه ګټه',
    'pa': 'خالص منافع',
    'ur-roman': 'Khalis Munafa'
  },
  stockStatTitle: {
    'ur': 'اسٹاک',
    'en': 'Stock',
    'sd': 'اسٽاڪ',
    'ps': 'زېرمه',
    'pa': 'سٹاک',
    'ur-roman': 'Stock'
  },
  itemsWord: {
    'ur': 'آئٹمز',
    'en': 'items',
    'sd': 'شيون',
    'ps': 'توکي',
    'pa': 'چیزاں',
    'ur-roman': 'items'
  },
  lowStockText: {
    'ur': 'کم اسٹاک',
    'en': 'low stock',
    'sd': 'گهٽ اسٽاڪ',
    'ps': 'کمه زېرمه',
    'pa': 'تھوڑا سٹاک',
    'ur-roman': 'kam stock'
  },
  stockHealthyText: {
    'ur': 'اسٹاک تسلی بخش',
    'en': 'Stock healthy',
    'sd': 'اسٽاڪ پورو آهي',
    'ps': 'زېرمه پوره ده',
    'pa': 'سٹاک پورا اے',
    'ur-roman': 'Stock theek hai'
  },
  customersStatTitle: {
    'ur': 'گاہک',
    'en': 'Customers',
    'sd': 'گراهڪ',
    'ps': 'پیرودونکي',
    'pa': 'گاہک',
    'ur-roman': 'Gahak'
  },
  customerUdhaarText: {
    'ur': 'گاہک کا ادھار',
    'en': 'customer receivables',
    'sd': 'گراهڪن جو اڌار',
    'ps': 'د پیرودونکو پور',
    'pa': 'گاہکاں دا ادھار',
    'ur-roman': 'customer udhaar'
  },
  suppliersStatTitle: {
    'ur': 'سپلائر',
    'en': 'Suppliers',
    'sd': 'سپلائر',
    'ps': 'سپلائر',
    'pa': 'سپلائر',
    'ur-roman': 'Suppliers'
  },
  suppliersPayableText: {
    'ur': 'سپلائرز کو دینا ہے',
    'en': 'suppliers payable',
    'sd': 'سپلائرز کي ڏيڻو آهي',
    'ps': 'سپلائرز ته ورکونکی',
    'pa': 'سپلائراں نوں دینا اے',
    'ur-roman': 'suppliers ko dena hai'
  },
  reportsStatTitle: {
    'ur': 'رپورٹس',
    'en': 'Reports',
    'sd': 'رپورٽون',
    'ps': 'راپورونه',
    'pa': 'رپورٹاں',
    'ur-roman': 'Reports'
  },
  dailyMonthlyTitle: {
    'ur': 'روزانہ و ماہانہ خلاصہ',
    'en': 'Daily & Monthly',
    'sd': 'روزانو ۽ ماهوار خلاصو',
    'ps': 'ورځنی او میاشتنی لنډیز',
    'pa': 'روز دا تے مہینے دا خلاصہ',
    'ur-roman': 'Rozana Aur Mahana Khulasa'
  },
  fullStatementText: {
    'ur': 'مکمل کاروباری جائزہ',
    'en': 'Full statement',
    'sd': 'مڪمل ڪاروباري پڌرنامو',
    'ps': 'بشپړ راپور',
    'pa': 'پورا کاروباری حساب',
    'ur-roman': 'Mukammal karobari jaiza'
  },

  // Recent Invoices Table
  recentInvoicesTitle: {
    'ur': 'حالیہ فروخت و بل',
    'en': 'Recent Invoices',
    'sd': 'تازو وڪرو ۽ بل',
    'ps': 'وروستي پلور او بلونه',
    'pa': 'ہن دی سیل تے بل',
    'ur-roman': 'Haliya Farokht Aur Bill'
  },
  viewAllBills: {
    'ur': 'سب بل دیکھیں →',
    'en': 'View All Bills →',
    'sd': 'سڀ بل ڏسو →',
    'ps': 'ټول بلونه وګورئ →',
    'pa': 'سارے بل ویکھو →',
    'ur-roman': 'Sab Bill Dekhein →'
  },
  noInvoicesMsg: {
    'ur': 'ابھی تک کوئی بل نہیں بنا۔ پہلا بل بنانے کے لیے "نیا بل بنائیں" دبائیں۔',
    'en': 'No invoices created yet. Click "New Bill" to create your first bill.',
    'sd': 'اڃا تائين ڪو بل ناهي ٺهيو. پهريون بل ٺاهڻ لاءِ "نئون بل ٺاهيو" تي ڪلڪ ڪريو.',
    'ps': 'تراوسه کوم بل نه دی جوړ شوی. لومړی بل جوړولو لپاره "نوی بل جوړ کړئ" وټاکئ.',
    'pa': 'اجے تیکر کوئی بل نہیں بنیا۔ پہلا بل بنان لئی "نواں بل بناؤ" دباؤ۔',
    'ur-roman': 'Abhi tak koi bill nahi bana. Pehla bill bananey ke liye "Naya Bill Banayein" dabayein.'
  },
  thBillNumber: {
    'ur': 'بل نمبر',
    'en': 'Bill #',
    'sd': 'بل نمبر',
    'ps': 'د بل ګڼه',
    'pa': 'بل نمبر',
    'ur-roman': 'Bill #'
  },
  thCustomer: {
    'ur': 'گاہک',
    'en': 'Customer',
    'sd': 'گراهڪ',
    'ps': 'پیرودونکی',
    'pa': 'گاہک',
    'ur-roman': 'Customer'
  },
  thItems: {
    'ur': 'آئٹمز',
    'en': 'Items',
    'sd': 'شيون',
    'ps': 'توکي',
    'pa': 'سامان',
    'ur-roman': 'Items'
  },
  thStatus: {
    'ur': 'اسٹیٹس',
    'en': 'Status',
    'sd': 'حالت',
    'ps': 'حالت',
    'pa': 'حالت',
    'ur-roman': 'Status'
  },
  thAmount: {
    'ur': 'رقم',
    'en': 'Amount',
    'sd': 'رقم',
    'ps': 'پیسې',
    'pa': 'رقم',
    'ur-roman': 'Raqam'
  },
  statusPaid: {
    'ur': 'نقد وصول',
    'en': 'Paid',
    'sd': 'ادا ٿيل',
    'ps': 'ورکړل شوې',
    'pa': 'نقد وصول',
    'ur-roman': 'Naqad Wasool'
  },
  statusCredit: {
    'ur': 'ادھار',
    'en': 'Credit',
    'sd': 'اڌار',
    'ps': 'پور',
    'pa': 'ادھار',
    'ur-roman': 'Udhaar'
  },
  statusPartial: {
    'ur': 'جزوی وصول',
    'en': 'Partial',
    'sd': 'ڪجهه ادا',
    'ps': 'نیمګړې پیسې',
    'pa': 'ادھی وصول',
    'ur-roman': 'Juzwi Wasool'
  },

  // AI Munshi Card on Dashboard & Drawer
  munshiCardTitle: {
    'ur': 'AI منشی',
    'en': 'AI Munshi',
    'sd': 'اي آئي منشي',
    'ps': 'ای آی منشي',
    'pa': 'اے آئی منشی',
    'ur-roman': 'AI Munshi'
  },
  munshiOnlineReady: {
    'ur': 'آن لائن اور حاضر',
    'en': 'Online & Ready',
    'sd': 'آن لائن ۽ حاضر',
    'ps': 'آن لاین او چمتو',
    'pa': 'آن لائن تے تیار',
    'ur-roman': 'Online Aur Hazir'
  },
  youCanSay: {
    'ur': 'آپ بول سکتے ہیں:',
    'en': 'You can say:',
    'sd': 'توهان چئي سگهو ٿا:',
    'ps': 'تاسو ویلی شئ:',
    'pa': 'تسی بول سکدے او:',
    'ur-roman': 'Aap bol saktey hain:'
  },
  samplePhrase1: {
    'ur': '“منشی، آج کی کل سیل کتنی ہوئی؟”',
    'en': '“Munshi, what are today’s total sales?”',
    'sd': '“منشي، اڄ جي ڪل وڪرو ڪيتري ٿي؟”',
    'ps': '“منشي، نن ټول پلور څومره دی؟”',
    'pa': '“منشی، اج دی کل سیل کنی ہوئی؟”',
    'ur-roman': '“Munshi, aaj ki kul sale kitni hui?”'
  },
  samplePhrase2: {
    'ur': '“احمد کا 500 روپے ادھار لکھ دو”',
    'en': '“Record 500 rupees credit for Ahmed”',
    'sd': '“احمد جو 500 رپيا اڌار لکو”',
    'ps': '“د احمد لپاره ۵۰۰ روپۍ پور ولیکه”',
    'pa': '“احمد دا 500 روپے ادھار لکھ دیو”',
    'ur-roman': '“Ahmed ka 500 rupay udhaar likh do”'
  },
  samplePhrase3: {
    'ur': '“کس پروڈکٹ کا اسٹاک ختم ہونے والا ہے؟”',
    'en': '“Which products are running low on stock?”',
    'sd': '“ڪهڙي سامان جو اسٽاڪ ختم ٿيڻ وارو آهي؟”',
    'ps': '“د کومو توکو زېرمه ختمېدو ته نږدې ده؟”',
    'pa': '“کیہڑے مال دا سٹاک مکݨ والا اے؟”',
    'ur-roman': '“Kis product ka stock khatam honay wala hai?”'
  },
  speakToMunshiBtn: {
    'ur': 'بول کر بتائیں 🎙️',
    'en': 'Speak to Munshi 🎙️',
    'sd': 'ڳالهائي ٻڌايو 🎙️',
    'ps': 'په غږ ووایئ 🎙️',
    'pa': 'بول کے دسو 🎙️',
    'ur-roman': 'Bol Kar Batayein 🎙️'
  },
  openMunshiDrawer: {
    'ur': 'AI منشی کھولیں',
    'en': 'Open AI Munshi',
    'sd': 'اي آئي منشي کوليو',
    'ps': 'ای آی منشي پرانیزئ',
    'pa': 'اے آئی منشی کھولو',
    'ur-roman': 'AI Munshi Kholein'
  },

  // Billing POS View
  billingHeaderTitle: {
    'ur': 'نیا بل بنائیں (POS)',
    'en': 'Point of Sale (POS) Billing',
    'sd': 'نئون بل ٺاهيو (POS)',
    'ps': 'نوی بل جوړول (POS)',
    'pa': 'نواں بل بناؤ (POS)',
    'ur-roman': 'Naya Bill Banayein (POS)'
  },
  billingHeaderSubtitle: {
    'ur': 'تیز رفتار بلنگ، بارکوڈ اسکینر، تھرمل پرنٹ اور واٹس ایپ شیئرنگ',
    'en': 'Fast POS billing, barcode scanner, thermal print & WhatsApp sharing',
    'sd': 'تيز رفتار بلنگ، بارڪوڊ اسڪينر، ٿرمل پرنٽ ۽ واٽس ايپ',
    'ps': 'چټک بلینګ، بارکوډ سکینر، چاپ او واټس اپ شریکول',
    'pa': 'تیز بلنگ، بارکوڈ اسکینر، تھرمل پرنٹ تے واٹس ایپ',
    'ur-roman': 'Tez POS billing, barcode scanner, thermal print aur WhatsApp'
  },
  scanBarcodeBtn: {
    'ur': 'بار کوڈ اسکین',
    'en': 'Scan Barcode',
    'sd': 'بار ڪوڊ اسڪين',
    'ps': 'بارکوډ سکین کړئ',
    'pa': 'بار کوڈ اسکین',
    'ur-roman': 'Scan Barcode'
  },
  searchProductPlaceholder: {
    'ur': 'پروڈکٹ کا نام یا بار کوڈ تلاش کریں...',
    'en': 'Search product name or barcode...',
    'sd': 'سامان جو نالو يا بارڪوڊ ڳوليو...',
    'ps': 'د توکي نوم یا بارکوډ ولټوئ...',
    'pa': 'چیز دا ناں یا بارکوڈ لبھو...',
    'ur-roman': 'Product ka naam ya barcode search karein...'
  },
  allCategories: {
    'ur': 'تمام کیٹیگریز',
    'en': 'All',
    'sd': 'سڀ',
    'ps': 'ټول',
    'pa': 'سارے',
    'ur-roman': 'Tamam'
  },
  walkInCustomer: {
    'ur': 'عام گاہک (Walk-in)',
    'en': 'Walk-in Customer',
    'sd': 'عام گراهڪ',
    'ps': 'عام پیرودونکی',
    'pa': 'عام گاہک',
    'ur-roman': 'Walk-in Customer (Aam Gahak)'
  },
  customerLabel: {
    'ur': 'گاہک کا انتخاب',
    'en': 'Customer Selection',
    'sd': 'گراهڪ جي چونڊ',
    'ps': 'د پیرودونکي ټاکنه',
    'pa': 'گاہک دی چونڈ',
    'ur-roman': 'Customer Selection'
  },
  customerNamePlaceholder: {
    'ur': 'گاہک کا نام درج کریں',
    'en': 'Enter customer name',
    'sd': 'گراهڪ جو نالو لکو',
    'ps': 'د پیرودونکي نوم ولیکئ',
    'pa': 'گاہک دا ناں لکھو',
    'ur-roman': 'Customer ka naam likhein'
  },
  customerPhonePlaceholder: {
    'ur': 'موبائل نمبر (اختیاری)',
    'en': 'Phone number (optional)',
    'sd': 'موبائل نمبر (اختياري)',
    'ps': 'ګرځنده شمېره (اختیاري)',
    'pa': 'موبائل نمبر (جے ہے)',
    'ur-roman': 'Mobile number (ikhtiyari)'
  },
  currentCartTitle: {
    'ur': 'بل کی تفصیل (Cart)',
    'en': 'Current Bill Items',
    'sd': 'بل جو سامان (Cart)',
    'ps': 'د بل توکي',
    'pa': 'بل دا سامان (Cart)',
    'ur-roman': 'Bill Ki Tafseel (Cart)'
  },
  cartEmptyMsg: {
    'ur': 'بل خالی ہے۔ آئٹم شامل کرنے کے لیے بائیں طرف لسٹ سے پروڈکٹ منتخب کریں۔',
    'en': 'Bill is empty. Click products from the catalog to add them.',
    'sd': 'بل خالي آهي. سامان شامل ڪرڻ لاءِ کاٻي پاسي واري لسٽ مان چونڊيو.',
    'ps': 'بل تش دی. د اضافه کولو لپاره توکي وټاکئ.',
    'pa': 'بل خالی اے۔ سامان پاون لئی کھبے پاسیوں پروڈکٹ چنو۔',
    'ur-roman': 'Bill khali hai. Item shamil karne ke liye list se product select karein.'
  },
  subtotalLabel: {
    'ur': 'کل رقم (سب ٹوٹل)',
    'en': 'Subtotal',
    'sd': 'ڪل رقم (Subtotal)',
    'ps': 'ټولې پیسې',
    'pa': 'کل رقم (سب ٹوٹل)',
    'ur-roman': 'Kul Raqam (Subtotal)'
  },
  discountLabel: {
    'ur': 'رعایت / ڈسکاؤنٹ',
    'en': 'Discount',
    'sd': 'رعايت (ڊسڪائونٽ)',
    'ps': 'تخفیف / رعایت',
    'pa': 'رعایت / چھوٹ',
    'ur-roman': 'Riayat / Discount'
  },
  taxLabel: {
    'ur': 'ٹیکس',
    'en': 'Tax',
    'sd': 'ٽيڪس',
    'ps': 'مالیه',
    'pa': 'ٹیکس',
    'ur-roman': 'Tax'
  },
  totalPayableLabel: {
    'ur': 'واجب الادا رقم',
    'en': 'Total Amount',
    'sd': 'ڏيڻ جوڳي رقم',
    'ps': 'د ورکړې وړ پیسې',
    'pa': 'کل بݨدی رقم',
    'ur-roman': 'Wajib-ul-Ada Raqam'
  },
  paymentMethodLabel: {
    'ur': 'طریقہ ادائیگی',
    'en': 'Payment Method',
    'sd': 'ادائيگي جو طريقو',
    'ps': 'د اداینې تګلاره',
    'pa': 'پیسے دین دا طریقہ',
    'ur-roman': 'Tariqa-e-Adaigi'
  },
  cashOption: {
    'ur': 'نقد (کیش)',
    'en': 'Cash',
    'sd': 'نقد',
    'ps': 'نغد',
    'pa': 'نقد (کیش)',
    'ur-roman': 'Naqad (Cash)'
  },
  creditOption: {
    'ur': 'ادھار کھاتہ',
    'en': 'Credit / Udhaar',
    'sd': 'اڌار کاتو',
    'ps': 'پور کهاته',
    'pa': 'ادھار کھاتہ',
    'ur-roman': 'Udhaar Khata'
  },
  amountPaidLabel: {
    'ur': 'وصول شدہ رقم',
    'en': 'Amount Paid',
    'sd': 'وصول ٿيل رقم',
    'ps': 'ترلاسه شوې پیسې',
    'pa': 'وصول رقم',
    'ur-roman': 'Wasool Shuda Raqam'
  },
  balanceDueLabel: {
    'ur': 'بقایا ادھار',
    'en': 'Balance Due',
    'sd': 'باقي اڌار',
    'ps': 'پاتې پور',
    'pa': 'بقایا ادھار',
    'ur-roman': 'Baqaya Udhaar'
  },
  notesLabel: {
    'ur': 'نوٹس / ریمارکس',
    'en': 'Notes / Remarks',
    'sd': 'نوٽس',
    'ps': 'نوټونه',
    'pa': 'نوٹس',
    'ur-roman': 'Notes'
  },
  saveAndPrintBtn: {
    'ur': 'بل محفوظ اور پرنٹ کریں',
    'en': 'Save & Print Invoice',
    'sd': 'بل محفوظ ۽ پرنٽ ڪريو',
    'ps': 'بل خوندي او چاپ کړئ',
    'pa': 'بل پکا کرو تے پرنٹ کڈھو',
    'ur-roman': 'Bill Save Aur Print Karein'
  },
  thermalReceiptTitle: {
    'ur': 'تھرمل رسید',
    'en': 'Thermal Receipt',
    'sd': 'ٿرمل رسيد',
    'ps': 'تودوخیز رسید',
    'pa': 'پرچی رسید',
    'ur-roman': 'Thermal Receipt'
  },
  shareWhatsAppBtn: {
    'ur': 'واٹس ایپ پر رسید بھیجیں',
    'en': 'Share on WhatsApp',
    'sd': 'واٽس ايپ تي رسيد موڪليو',
    'ps': 'په واټس اپ رسید ولېږئ',
    'pa': 'واٹس ایپ تے پرچی بھیجو',
    'ur-roman': 'WhatsApp Par Receipt Bhejein'
  },
  printBtn: {
    'ur': 'پرنٹ رسید',
    'en': 'Print Receipt',
    'sd': 'رسيد پرنٽ ڪريو',
    'ps': 'رسید چاپ کړئ',
    'pa': 'پرنٹ کڈھو',
    'ur-roman': 'Print Receipt'
  },
  closeBtn: {
    'ur': 'بند کریں',
    'en': 'Close',
    'sd': 'بند ڪريو',
    'ps': 'بند کړئ',
    'pa': 'بند کرو',
    'ur-roman': 'Band Karein'
  },

  // Khata Ledger View
  khataHeaderTitle: {
    'ur': 'ڈیجیٹل کھاتہ لیجر',
    'en': 'Digital Khata Ledger',
    'sd': 'ڊجيٽل کاتو ليجر',
    'ps': 'ډیجیټل کهاته ليجر',
    'pa': 'ڈیجیٹل کھاتہ لیجر',
    'ur-roman': 'Digital Khata Ledger'
  },
  khataHeaderSubtitle: {
    'ur': 'دکان کا بہی کھاتہ، گاہک ادھار وصولی اور سپلائر ادائیگی',
    'en': 'Shop ledger, customer credit recovery and supplier payments',
    'sd': 'دڪان جو کاتو، گراهڪ اڌار وصولي ۽ سپلائر ادائيگي',
    'ps': 'د دوکان کهاته، د پور راټولول او سپلائر تادیه',
    'pa': 'دکان دا کھاتہ، گاہک ادھار وصولی تے سپلائر ادائیگی',
    'ur-roman': 'Dukaan ka bahi-khata, customer udhaar wasooli aur supplier adaigi'
  },
  addCustomerBtn: {
    'ur': 'نیا گاہک شامل کریں',
    'en': 'Add New Customer',
    'sd': 'نئون گراهڪ شامل ڪريو',
    'ps': 'نوی پیرودونکی اضافه کړئ',
    'pa': 'نواں گاہک پاؤ',
    'ur-roman': 'Naya Customer Add Karein'
  },
  addSupplierBtn: {
    'ur': 'نیا سپلائر شامل کریں',
    'en': 'Add New Supplier',
    'sd': 'نئون سپلائر شامل ڪريو',
    'ps': 'نوی سپلائر اضافه کړئ',
    'pa': 'نواں سپلائر پاؤ',
    'ur-roman': 'Naya Supplier Add Karein'
  },
  tabCustomersKhata: {
    'ur': 'گاہکوں کا کھاتہ',
    'en': 'Customers Khata',
    'sd': 'گراهڪن جو کاتو',
    'ps': 'د پیرودونکو کهاته',
    'pa': 'گاہکاں دا کھاتہ',
    'ur-roman': 'Customers Khata'
  },
  tabSuppliersKhata: {
    'ur': 'سپلائرز کا کھاتہ',
    'en': 'Suppliers Khata',
    'sd': 'سپلائرز جو کاتو',
    'ps': 'د سپلائرز کهاته',
    'pa': 'سپلائراں دا کھاتہ',
    'ur-roman': 'Suppliers Khata'
  },
  udhaarLenaHai: {
    'ur': 'ادھار لینا ہے',
    'en': 'Receivable',
    'sd': 'اڌار وٺڻو آهي',
    'ps': 'پور اخیستل',
    'pa': 'ادھار لینا اے',
    'ur-roman': 'Udhaar Lena Hai'
  },
  udhaarDenaHai: {
    'ur': 'رقم دینی ہے',
    'en': 'Payable',
    'sd': 'رقم ڏيڻي آهي',
    'ps': 'ورکړې پیسې',
    'pa': 'رقم دینی اے',
    'ur-roman': 'Dena Hai'
  },
  registeredCustomersText: {
    'ur': 'رجسٹرڈ گاہک',
    'en': 'Registered Customers',
    'sd': 'رجسٽرڊ گراهڪ',
    'ps': 'ثبت شوي پیرودونکي',
    'pa': 'رجسٹرڈ گاہک',
    'ur-roman': 'Registered Customers'
  },
  registeredSuppliersText: {
    'ur': 'رجسٹرڈ سپلائرز',
    'en': 'Registered Suppliers',
    'sd': 'رجسٽرڊ سپلائرز',
    'ps': 'ثبت شوي سپلائرز',
    'pa': 'رجسٹرڈ سپلائرز',
    'ur-roman': 'Registered Suppliers'
  },
  searchKhataPlaceholder: {
    'ur': 'نام یا موبائل نمبر تلاش کریں...',
    'en': 'Search name or phone number...',
    'sd': 'نالو يا موبائل نمبر ڳوليو...',
    'ps': 'نوم یا شمېره ولټوئ...',
    'pa': 'ناں یا موبائل نمبر لبھو...',
    'ur-roman': 'Naam ya phone number search karein...'
  },
  baqayaUdhaarLabel: {
    'ur': 'بقایا ادھار',
    'en': 'Balance Due',
    'sd': 'باقي اڌار',
    'ps': 'پاتې پور',
    'pa': 'بقایا ادھار',
    'ur-roman': 'Baqaya Udhaar'
  },
  saafClearLabel: {
    'ur': 'صاف / ادا شدہ',
    'en': 'Clear / Paid',
    'sd': 'صاف / ادا ٿيل',
    'ps': 'پاک / تادیه شوی',
    'pa': 'صاف / کلیر',
    'ur-roman': 'Saaf / Clear'
  },
  btnGiveCredit: {
    'ur': 'ادھار دیا (-)',
    'en': 'Give Credit (-)',
    'sd': 'اڌار ڏنو (-)',
    'ps': 'پور ورکړل شو (-)',
    'pa': 'ادھار دتا (-)',
    'ur-roman': 'Udhaar Diya (-)'
  },
  btnReceivePayment: {
    'ur': 'وصولی آئی (+)',
    'en': 'Receive Payment (+)',
    'sd': 'وصولي آئي (+)',
    'ps': 'پیسې ترلاسه شوې (+)',
    'pa': 'رقم وصول ہوئی (+)',
    'ur-roman': 'Wasooli Aayi (+)'
  },
  btnSendWhatsAppReminder: {
    'ur': 'واٹس ایپ یاد دہانی بھیجیں',
    'en': 'Send WhatsApp Reminder',
    'sd': 'واٽس ايپ ياد ڏياريندڙ موڪليو',
    'ps': 'په واټس اپ یادونه ولېږئ',
    'pa': 'واٹس ایپ یاد دہانی بھیجو',
    'ur-roman': 'WhatsApp Reminder Bhejein'
  },
  khataHistoryTitle: {
    'ur': 'لین دین کا حساب و کتاب',
    'en': 'Transaction History',
    'sd': 'ڏي وٺ جو حساب',
    'ps': 'د راکړې ورکړې تاریخ',
    'pa': 'لین دین دا حساب',
    'ur-roman': 'Len Den Ka Hisab'
  },
  jamaPaymentBtn: {
    'ur': '+ وصولی / جمع',
    'en': '+ Payment Received',
    'sd': '+ وصولي / جمع',
    'ps': '+ ترلاسه شوې پیسې',
    'pa': '+ وصولی / جمع',
    'ur-roman': '+ Wasooli / Jama'
  },
  udhaarCreditBtn: {
    'ur': '- ادھار دیا',
    'en': '- Credit Given',
    'sd': '- اڌار ڏنو',
    'ps': '- پور ورکړل شو',
    'pa': '- ادھار دتا',
    'ur-roman': '- Udhaar Diya'
  },
  roznamchaHistory: {
    'ur': 'روزنامچہ / کھاتہ تاریخ',
    'en': 'Statement History',
    'sd': 'کاتي جي تاريخ',
    'ps': 'د کهاتې تاریخ',
    'pa': 'کھاتے دی تاریخ',
    'ur-roman': 'Roznamcha / Khata Tareekh'
  },
  recordTxModalTitlePayment: {
    'ur': 'وصولی رقم جمع کریں',
    'en': 'Record Payment Received',
    'sd': 'وصولي رقم جمع ڪريو',
    'ps': 'ترلاسه شوې پیسې ثبت کړئ',
    'pa': 'وصولی رقم جمع کرو',
    'ur-roman': 'Wasooli Raqam Jama Karein'
  },
  recordTxModalTitleCredit: {
    'ur': 'نیا ادھار درج کریں',
    'en': 'Record New Credit',
    'sd': 'نئون اڌار داخل ڪريو',
    'ps': 'نوی پور ثبت کړئ',
    'pa': 'نواں ادھار پاؤ',
    'ur-roman': 'Naya Udhaar Likhein'
  },
  amountLabel: {
    'ur': 'رقم (روپے) *',
    'en': 'Amount (Rs.) *',
    'sd': 'رقم (رپيا) *',
    'ps': 'پیسې (روپۍ) *',
    'pa': 'رقم (روپے) *',
    'ur-roman': 'Raqam (Rs.) *'
  },
  detailsNotesLabel: {
    'ur': 'تفصیل / وجہ (اختیاری)',
    'en': 'Details / Reason (Optional)',
    'sd': 'تفصيل / سبب (اختياري)',
    'ps': 'تفصیل / لامل (اختیاري)',
    'pa': 'تفصیل / وجہ',
    'ur-roman': 'Tafseel / Wajah'
  },
  saveEntryBtn: {
    'ur': 'اندراج محفوظ کریں',
    'en': 'Save Entry',
    'sd': 'اندراج محفوظ ڪريو',
    'ps': 'ثبت خوندي کړئ',
    'pa': 'اندراج محفوظ کرو',
    'ur-roman': 'Indiraaj Save Karein'
  },
  savePartyBtn: {
    'ur': 'کھاتہ کھولیں / رجسٹر کریں',
    'en': 'Register & Save',
    'sd': 'کاتو کوليو / محفوظ ڪريو',
    'ps': 'ثبت او خوندي کړئ',
    'pa': 'کھاتہ کھولو / سیو کرو',
    'ur-roman': 'Khata Kholein / Save Karein'
  },
  selectPartyPrompt: {
    'ur': 'کھاتہ تفصیل دیکھنے کے لیے بائیں جانب سے گاہک یا سپلائر منتخب کریں۔',
    'en': 'Select a customer or supplier from the list to view their ledger.',
    'sd': 'کاتي جو تفصيل ڏسڻ لاءِ لسٽ مان چونڊيو.',
    'ps': 'د کهاتې لیدلو لپاره له لست څخه پیرودونکی یا سپلائر وټاکئ.',
    'pa': 'کھاتہ ویکھݨ لئی لسٹ چوں گاہک یا سپلائر چنو۔',
    'ur-roman': 'Khata tafseel dekhnay ke liye list se party select karein.'
  },
  openingBalanceLabel: {
    'ur': 'پرانا بقایا / اوپننگ بیلنس',
    'en': 'Opening Balance (if any)',
    'sd': 'پراڻو باقي / اوپننگ بيلنس',
    'ps': 'پخوانی پور / لومړنی بیلانس',
    'pa': 'پرانا بقایا / اوپننگ بیلنس',
    'ur-roman': 'Purana Baqaya / Opening Balance'
  },
  payableLabel: {
    'ur': 'دینا ہے',
    'en': 'Payable',
    'sd': 'ڏيڻو آهي',
    'ps': 'ورکړې',
    'pa': 'دینا اے',
    'ur-roman': 'Dena Hai'
  },
  noTransactionsYet: {
    'ur': 'ابھی تک کوئی لین دین درج نہیں ہے۔',
    'en': 'No transactions recorded yet.',
    'sd': 'اڃا تائين ڪا ڏي وٺ ناهي ٿي.',
    'ps': 'تراوسه کومه راکړه ورکړه نه ده ثبت شوې.',
    'pa': 'اجے تیکر کوئی لین دین نہیں ہویا۔',
    'ur-roman': 'Abhi tak koi transaction record nahi hui.'
  },

  // Products & Stock View
  productsHeaderTitle: {
    'ur': 'پروڈکٹس و اسٹاک',
    'en': 'Products & Stock Inventory',
    'sd': 'سامان ۽ اسٽاڪ',
    'ps': 'توکي او زېرمه',
    'pa': 'پروڈکٹس تے سٹاک',
    'ur-roman': 'Products & Stock'
  },
  productsHeaderSubtitle: {
    'ur': 'دکان کا سامان، قیمت خرید، قیمت فروخت اور بارکوڈ',
    'en': 'Shop inventory, cost price, sale price and barcodes',
    'sd': 'دڪان جو سامان، خريد اگھ، وڪرو اگھ ۽ بارڪوڊ',
    'ps': 'د دوکان توکي، د پېرلو بیه، د پلورلو بیه او بارکوډ',
    'pa': 'دکان دا مال، خرید ریٹ، سیل ریٹ تے بارکوڈ',
    'ur-roman': 'Dukaan ka saaman, kharid qimat, sale price aur barcode'
  },
  addNewProductBtn: {
    'ur': 'نیا پروڈکٹ شامل کریں',
    'en': 'Add New Product',
    'sd': 'نئون سامان شامل ڪريو',
    'ps': 'نوی توکی اضافه کړئ',
    'pa': 'نواں مال شامل کرو',
    'ur-roman': 'Naya Product Shamil Karein'
  },
  thProductNameCode: {
    'ur': 'پروڈکٹ کا نام اور کوڈ',
    'en': 'Product Name & Code',
    'sd': 'سامان جو نالو ۽ ڪوڊ',
    'ps': 'د توکي نوم او کوډ',
    'pa': 'آئٹم دا ناں تے کوڈ',
    'ur-roman': 'Product Naam Aur Code'
  },
  thCategoryTitle: {
    'ur': 'کیٹیگری',
    'en': 'Category',
    'sd': 'درجو',
    'ps': 'وېشنیزه',
    'pa': 'کیٹیگری',
    'ur-roman': 'Category'
  },
  thCostPriceTitle: {
    'ur': 'خرید قیمت (Cost)',
    'en': 'Cost Price',
    'sd': 'خريد قيمت',
    'ps': 'د پېرلو بیه',
    'pa': 'خرید مل',
    'ur-roman': 'Kharid Qimat (Cost)'
  },
  thSalePriceTitle: {
    'ur': 'فروخت قیمت (Sale)',
    'en': 'Sale Price',
    'sd': 'وڪرو قيمت',
    'ps': 'د پلورلو بیه',
    'pa': 'سیل ریٹ',
    'ur-roman': 'Farokht Qimat (Sale)'
  },
  thStockAvailable: {
    'ur': 'موجودہ اسٹاک',
    'en': 'Stock Available',
    'sd': 'موجود اسٽاڪ',
    'ps': 'موجوده زېرمه',
    'pa': 'موجودہ سٹاک',
    'ur-roman': 'Maujooda Stock'
  },
  thActions: {
    'ur': 'کارروائی',
    'en': 'Actions',
    'sd': 'عمل',
    'ps': 'کړنې',
    'pa': 'کم',
    'ur-roman': 'Actions'
  },
  adjustStockBtn: {
    'ur': 'اسٹاک ایڈجسٹ',
    'en': 'Adjust Stock',
    'sd': 'اسٽاڪ تبديل',
    'ps': 'زېرمه سمه کړئ',
    'pa': 'سٹاک بدلو',
    'ur-roman': 'Adjust Stock'
  },
  editProductTitle: {
    'ur': 'پروڈکٹ ایڈٹ کریں',
    'en': 'Edit Product',
    'sd': 'سامان تبديل ڪريو',
    'ps': 'توکی ایډیټ کړئ',
    'pa': 'مال بدل کرو',
    'ur-roman': 'Product Edit Karein'
  },
  productNameLabel: {
    'ur': 'پروڈکٹ کا نام *',
    'en': 'Product Name *',
    'sd': 'سامان جو نالو *',
    'ps': 'د توکي نوم *',
    'pa': 'آئٹم دا ناں *',
    'ur-roman': 'Product Ka Naam *'
  },
  initialStockLabel: {
    'ur': 'ابتدائی اسٹاک',
    'en': 'Initial Stock',
    'sd': 'شروعاتي اسٽاڪ',
    'ps': 'لومړنۍ زېرمه',
    'pa': 'شروع دا سٹاک',
    'ur-roman': 'Shuruaati Stock'
  },
  lowStockThresholdLabel: {
    'ur': 'کم اسٹاک الرٹ حد',
    'en': 'Low Stock Alert Limit',
    'sd': 'گهٽ اسٽاڪ جي حد',
    'ps': 'د کمې زېرمې خبرداري حد',
    'pa': 'تھوڑے سٹاک دی حد',
    'ur-roman': 'Kam Stock Alert Hadh'
  },
  unitLabel: {
    'ur': 'پیمائش اکائی (Unit)',
    'en': 'Unit',
    'sd': 'پيمائش يونٽ',
    'ps': 'د اندازه کولو واحد',
    'pa': 'پیمائش یونٹ',
    'ur-roman': 'Paimayesh Unit'
  },
  barcodeLabel: {
    'ur': 'بار کوڈ (اختیاری)',
    'en': 'Barcode (Optional)',
    'sd': 'بارڪوڊ (اختياري)',
    'ps': 'بارکوډ (اختیاري)',
    'pa': 'بارکوڈ (جے ہے)',
    'ur-roman': 'Barcode (Ikhtiyari)'
  },
  saveProductBtn: {
    'ur': 'پروڈکٹ محفوظ کریں',
    'en': 'Save Product',
    'sd': 'سامان محفوظ ڪريو',
    'ps': 'توکی خوندي کړئ',
    'pa': 'مال محفوظ کرو',
    'ur-roman': 'Product Mehfooz Karein'
  },
  quickStockAdjustTitle: {
    'ur': 'اسٹاک ایڈجسٹمنٹ',
    'en': 'Quick Stock Adjustment',
    'sd': 'تيز اسٽاڪ تبديلي',
    'ps': 'چټکه زېرمه بدلون',
    'pa': 'سٹاک تبدیلی',
    'ur-roman': 'Stock Adjustment'
  },
  adjustDeltaLabel: {
    'ur': 'کتنی تعداد بڑھائیں یا کم کریں؟ (+10 یا -5)',
    'en': 'Add or deduct quantity (+10 or -5)',
    'sd': 'ڪيتري تعداد وڌايو يا گهٽايو؟',
    'ps': 'څومره شمېر زیات یا کم کړئ؟',
    'pa': 'کنی گنتی ودھاؤ یا گھٹاؤ؟ (+10 یا -5)',
    'ur-roman': 'Kitni tadaad badhayein ya kam karein? (+10 ya -5)'
  },
  adjustReasonLabel: {
    'ur': 'وجہ / تفصیل',
    'en': 'Reason / Note',
    'sd': 'سبب / تفصيل',
    'ps': 'لامل / تفصیل',
    'pa': 'وجہ / تفصیل',
    'ur-roman': 'Wajah / Tafseel'
  },
  updateStockBtn: {
    'ur': 'اسٹاک اپ ڈیٹ کریں',
    'en': 'Update Stock',
    'sd': 'اسٽاڪ اپڊيٽ ڪريو',
    'ps': 'زېرمه تازه کړئ',
    'pa': 'سٹاک اپ ڈیٹ کرو',
    'ur-roman': 'Stock Update Karein'
  },
  currentStockLabel: {
    'ur': 'موجودہ اسٹاک',
    'en': 'Current Stock',
    'sd': 'موجود اسٽاڪ',
    'ps': 'اوسنۍ زېرمه',
    'pa': 'موجودہ سٹاک',
    'ur-roman': 'Maujooda Stock'
  },

  // Expenses View
  expensesHeaderTitle: {
    'ur': 'دکان کے اخراجات (روزنامچہ)',
    'en': 'Shop Expenses (Roznamcha)',
    'sd': 'دڪان جا خرچ (روزنامچو)',
    'ps': 'د دوکان لګښتونه (روزنامچه)',
    'pa': 'دکان دے خرچے (روزنامچہ)',
    'ur-roman': 'Dukaan Ke Ikhrajat (Roznamcha)'
  },
  expensesHeaderSubtitle: {
    'ur': 'روزانہ بل، کرایہ، چائے، ملازمین اور دکان کا خرچہ لکھیں',
    'en': 'Record daily bills, rent, tea, staff salaries and maintenance',
    'sd': 'روزانو بل، مسواڙ، چانهه ۽ ملازمن جا خرچ لکو',
    'ps': 'ورځني بلونه، کرایه، چای، تنخوا او د دوکان لګښتونه ولیکئ',
    'pa': 'روز دا خرچہ، کرایہ، چاء تے ملازماں دا حساب',
    'ur-roman': 'Rozana bills, kiraya, chai, mulazmeen aur dukaan ka kharcha likhein'
  },
  addNewExpenseBtn: {
    'ur': 'نیا خرچہ لکھیں',
    'en': 'Add New Expense',
    'sd': 'نئون خرچ لکو',
    'ps': 'نوی لګښت ثبت کړئ',
    'pa': 'نواں خرچہ لکھو',
    'ur-roman': 'Naya Kharcha Likhein'
  },
  todayExpensesLabel: {
    'ur': 'آج کا کل خرچہ',
    'en': "Today's Total Expenses",
    'sd': 'اڄ جو ڪل خرچ',
    'ps': 'د نن ټول لګښتونه',
    'pa': 'اج دا پورا خرچہ',
    'ur-roman': 'Aaj Ka Kul Kharcha'
  },
  allTimeExpensesLabel: {
    'ur': 'تمام ریکارڈ شدہ اخراجات',
    'en': 'All Recorded Expenses',
    'sd': 'سمورا رڪارڊ ٿيل خرچ',
    'ps': 'ټول ثبت شوي لګښتونه',
    'pa': 'سارے خرچے',
    'ur-roman': 'Kul Ikhrajat'
  },
  expenseCategoryLabel: {
    'ur': 'خرچ کی قسم (Category)',
    'en': 'Expense Category',
    'sd': 'خرچ جو قسم',
    'ps': 'د لګښت وېشنیزه',
    'pa': 'خرچے دی قسم',
    'ur-roman': 'Kharch Ki Qisam'
  },
  expenseNotesLabel: {
    'ur': 'تفصیل / وجہ (Notes)',
    'en': 'Details / Notes',
    'sd': 'تفصيل / سبب',
    'ps': 'تفصیل / یادښت',
    'pa': 'تفصیل / وجہ',
    'ur-roman': 'Tafseel / Wajah'
  },
  expensePaidViaLabel: {
    'ur': 'ادائیگی ذریعہ (Paid Via)',
    'en': 'Paid Via',
    'sd': 'ذريعي ادائيگي',
    'ps': 'د تادیې طریقه',
    'pa': 'پیسے دتے بذریعہ',
    'ur-roman': 'Adaigi Zariya'
  },
  saveExpenseBtn: {
    'ur': 'خرچہ درج کریں',
    'en': 'Record Expense',
    'sd': 'خرچ داخل ڪريو',
    'ps': 'لګښت ثبت کړئ',
    'pa': 'خرچہ درج کرو',
    'ur-roman': 'Kharcha Record Karein'
  },
  expenseAdviceTitle: {
    'ur': 'خرچ کنٹرول مشورہ',
    'en': 'Expense Control Advice',
    'sd': 'خرچ تي ضابطي جو مشورو',
    'ps': 'د لګښت کنټرول لارښوونه',
    'pa': 'خرچہ گھٹاؤ مشورہ',
    'ur-roman': 'Kharch Control Mashwara'
  },
  expenseAdviceBody: {
    'ur': 'چائے، کرایہ اور متفرق اخراجات روزانہ درج کریں تا کہ ماہانہ خالص منافع بالکل درست معلوم ہو۔',
    'en': 'Log daily tea, utilities and shop maintenance to track true monthly net profit.',
    'sd': 'چانهه، مسواڙ ۽ ٻيا خرچ روز لکو ته جيئن خالص نفعو صحيح معلوم ٿئي.',
    'ps': 'د چای، کرایې او نور لګښتونه هره ورځ ولیکئ ترڅو خالص ګټه سمه وښودل شي.',
    'pa': 'چاء، کرایہ تے دکان دے خرچے روز لکھو تاں جے مہینے دا خالص منافع ٹھیک نکلے۔',
    'ur-roman': 'Chai, kiraya aur mutafarriq ikhrajat daily likhein taake khalis munafa theek maloom ho.'
  },
  noExpensesRecorded: {
    'ur': 'ابھی تک کوئی خرچہ درج نہیں ہے۔ اوپر بٹن پر کلک کر کے اندراج کریں۔',
    'en': 'No expenses recorded yet. Click the button above to add one.',
    'sd': 'اڃا ڪو به خرچ داخل ناهي ٿيو. مٿي بٽڻ تي ڪلڪ ڪري لکو.',
    'ps': 'تراوسه کوم لګښت نه دی ثبت شوی. پورته بټن ووهئ.',
    'pa': 'اجے کوئی خرچہ درج نئیں ہویا۔ اپر دتے بٹن توں اندراج کرو۔',
    'ur-roman': 'Abhi tak koi kharcha nahi likha gaya. Upar button se record karein.'
  },
  dateLabel: {
    'ur': 'تاریخ',
    'en': 'Date',
    'sd': 'تاريخ',
    'ps': 'نېټه',
    'pa': 'تاریخ',
    'ur-roman': 'Tareekh'
  },

  // Purchases View
  purchasesHeaderTitle: {
    'ur': 'مال خریداری انوائسز',
    'en': 'Stock Purchases & Supplier Bills',
    'sd': 'مال خريداري انوائسز',
    'ps': 'د توکو پېرودنه او سپلائر بلونه',
    'pa': 'مال خریداری تے سپلائر بل',
    'ur-roman': 'Mal Khareedari Aur Supplier Bills'
  },
  purchasesHeaderSubtitle: {
    'ur': 'ہول سیل خریداری، سپلائر بل اور مال کی آمد کا ریکارڈ',
    'en': 'Wholesale purchases, supplier invoices and inventory restocking',
    'sd': 'هول سيل خريداري ۽ سپلائر بلن جو رڪارڊ',
    'ps': 'د عمده پلور پېرودنه او د سپلائر بلونو ریکارډ',
    'pa': 'ہول سیل خریداری تے سپلائر بل دا حساب',
    'ur-roman': 'Wholesale khareedari aur supplier bills ka record'
  },
  recordNewPurchaseBtn: {
    'ur': 'نئی خریداری درج کریں',
    'en': 'Record New Purchase',
    'sd': 'نئين خريداري داخل ڪريو',
    'ps': 'نوې پېرودنه ثبت کړئ',
    'pa': 'نویں خریداری پاؤ',
    'ur-roman': 'Nayi Khareedari Darj Karein'
  },
  totalPurchasesLabel: {
    'ur': 'کل خریداری',
    'en': 'Total Purchases',
    'sd': 'ڪل خريداري',
    'ps': 'ټوله پېرودنه',
    'pa': 'پوری خریداری',
    'ur-roman': 'Kul Khareedari'
  },
  paidPurchasesLabel: {
    'ur': 'ادا شدہ رقم',
    'en': 'Paid Amount',
    'sd': 'ادا ڪيل رقم',
    'ps': 'ورکړل شوې پیسې',
    'pa': 'دتی گئی رقم',
    'ur-roman': 'Ada Shuda Raqam'
  },
  payableToSuppliersLabel: {
    'ur': 'سپلائرز کو واجب الادا (بقایا)',
    'en': 'Payable to Suppliers',
    'sd': 'سپلائرز کي ڏيڻي رقم',
    'ps': 'سپلائر ته پاتې پیسې',
    'pa': 'سپلائراں نوں دینی رقم (بقایا)',
    'ur-roman': 'Suppliers Ko Wajib-ul-Ada'
  },
  cashAndTransferLabel: {
    'ur': 'نقد / آن لائن ادائیگی',
    'en': 'Cash & Transfer',
    'sd': 'روڪ يا آن لائن ادائيگي',
    'ps': 'نغدې او آنلاین تادیه',
    'pa': 'نقد تے آن لائن ادائگی',
    'ur-roman': 'Naqd / Online Adaigi'
  },
  pendingClearanceLabel: {
    'ur': 'ادھار / کریڈٹ مال',
    'en': 'Pending Clearance',
    'sd': 'اوڌر مال',
    'ps': 'پاتې پور',
    'pa': 'ادھار مال (باقی)',
    'ur-roman': 'Udhaar / Credit Mal'
  },
  searchSupplierPlaceholder: {
    'ur': 'سپلائر کا نام یا بل نمبر تلاش کریں...',
    'en': 'Search by supplier name or bill number...',
    'sd': 'سپلائر جو نالو يا بل نمبر ڳوليو...',
    'ps': 'د سپلائر نوم یا بل نمبر ولټوئ...',
    'pa': 'سپلائر دا ناں یا بل نمبر لبھو...',
    'ur-roman': 'Supplier ka naam ya bill number talash karein...'
  },
  purchasesLogTitle: {
    'ur': 'خریداری کا ریکارڈ',
    'en': 'Purchases Log',
    'sd': 'خريداري جو رڪارڊ',
    'ps': 'د پېرودنې ریکارډ',
    'pa': 'خریداری دا ریکارڈ',
    'ur-roman': 'Khareedari Ka Record'
  },
  noPurchasesFound: {
    'ur': 'کوئی خریداری ریکارڈ موجود نہیں ہے',
    'en': 'No purchase records found',
    'sd': 'ڪو به خريداري رڪارڊ ناهي مليو',
    'ps': 'د پېرودنې کوم ریکارډ نشته',
    'pa': 'کوئی خریداری ریکارڈ نئیں ملیا',
    'ur-roman': 'Koi khareedari record maujood nahi hai'
  },
  noPurchasesPrompt: {
    'ur': 'نیا مال خریدنے پر "نئی خریداری درج کریں" دبائیں',
    'en': 'Click "Record New Purchase" to log incoming stock',
    'sd': 'نئون مال خريدڻ تي "نئين خريداري داخل ڪريو" دٻايو',
    'ps': 'د نوي مال لپاره "نوې پېرودنه ثبت کړئ" ووهئ',
    'pa': 'نواں مال خریدن لئی "نویں خریداری پاؤ" دباؤ',
    'ur-roman': 'Naya maal khareedne par button dabayein'
  },
  thSupplier: {
    'ur': 'سپلائر',
    'en': 'Supplier',
    'sd': 'سپلائر',
    'ps': 'سپلائر',
    'pa': 'سپلائر',
    'ur-roman': 'Supplier'
  },
  thTotal: {
    'ur': 'کل رقم',
    'en': 'Total',
    'sd': 'ڪل',
    'ps': 'ټولټال',
    'pa': 'کل رقم',
    'ur-roman': 'Kul Raqam'
  },
  thPaid: {
    'ur': 'ادا شدہ',
    'en': 'Paid',
    'sd': 'ادا ٿيل',
    'ps': 'ورکړل شوي',
    'pa': 'ادا شدہ',
    'ur-roman': 'Ada Shuda'
  },
  thBalance: {
    'ur': 'بقایا ادھار',
    'en': 'Balance',
    'sd': 'بقايا اوڌر',
    'ps': 'پاتې پور',
    'pa': 'باقی ادھار',
    'ur-roman': 'Baqaya Udhaar'
  },
  clearedStatus: {
    'ur': 'بے باق',
    'en': 'Cleared',
    'sd': 'صاف',
    'ps': 'بشپړ',
    'pa': 'بے باق',
    'ur-roman': 'Be Baaq'
  },
  supplierNameLabel: {
    'ur': 'سپلائر / ڈسٹری بیوٹر کا نام *',
    'en': 'Supplier / Distributor Name *',
    'sd': 'سپلائر يا ڊسٽريبيوٽر جو نالو *',
    'ps': 'د سپلائر / وېشونکي نوم *',
    'pa': 'سپلائر یا ڈسٹری بیوٹر دا ناں *',
    'ur-roman': 'Supplier / Distributor Ka Naam *'
  },
  supplierNamePlaceholder: {
    'ur': 'مثلاً: المدینہ ہول سیل، یونیسیپ ڈسٹری بیوٹر',
    'en': 'e.g. Al-Madina Wholesale Grain',
    'sd': 'مثال: المدينه هول سيل',
    'ps': 'د بېلګې په توګه: المدینه عمده پلور',
    'pa': 'مثلاً: المدینہ ہول سیل، چوہدری ٹریڈرز',
    'ur-roman': 'e.g. Al-Madina Wholesale'
  },
  billNumberLabel: {
    'ur': 'بل / انوائس نمبر',
    'en': 'Bill / Invoice Number',
    'sd': 'بل / انوائس نمبر',
    'ps': 'د بل شمېره',
    'pa': 'بل یا انوائس نمبر',
    'ur-roman': 'Bill / Invoice Number'
  },
  productNameInputLabel: {
    'ur': 'پروڈکٹ / آئٹم کا نام *',
    'en': 'Product / Item Name *',
    'sd': 'سامان جو نالو *',
    'ps': 'د توکي نوم *',
    'pa': 'آئٹم دا ناں *',
    'ur-roman': 'Product / Item Naam *'
  },
  unitCostLabel: {
    'ur': 'خرید قیمت فی یونٹ (Rs.)',
    'en': 'Unit Purchase Cost (Rs.)',
    'sd': 'خريد قيمت في يونٽ',
    'ps': 'د یوه واحد پېرلو بیه',
    'pa': 'خرید ریٹ فی یونٹ',
    'ur-roman': 'Kharid Qimat Per Unit'
  },
  totalBillCostLabel: {
    'ur': 'کل بل کی رقم:',
    'en': 'Total Bill Cost:',
    'sd': 'ڪل بل جي رقم:',
    'ps': 'د بل ټول لګښت:',
    'pa': 'کل بل دی رقم:',
    'ur-roman': 'Kul Bill Ki Raqam:'
  },
  amountPaidNowLabel: {
    'ur': 'ابھی نقد ادا کی گئی رقم (Rs.)',
    'en': 'Amount Paid Now (Rs.)',
    'sd': 'هاڻي روڪ ادا ڪيل رقم',
    'ps': 'اوس ورکړل شوې نغدې پیسې',
    'pa': 'ہُن نقد دتی گئی رقم',
    'ur-roman': 'Abhi naqd ada ki gayi raqam'
  },
  remainingBalanceLabel: {
    'ur': 'باقی ادھار:',
    'en': 'Remaining Balance:',
    'sd': 'بقايا اوڌر:',
    'ps': 'پاتې پور:',
    'pa': 'باقی ادھار:',
    'ur-roman': 'Baqi Udhaar:'
  },
  savePurchaseBtn: {
    'ur': 'خریداری محفوظ کریں',
    'en': 'Save Purchase',
    'sd': 'خريداري محفوظ ڪريو',
    'ps': 'پېرودنه خوندي کړئ',
    'pa': 'خریداری محفوظ کرو',
    'ur-roman': 'Khareedari Mehfooz Karein'
  },

  // Reports View
  reportsHeaderTitle: {
    'ur': 'کاروباری رپورٹس و منافع تجزیہ',
    'en': 'Business Reports & Profit Analytics',
    'sd': 'ڪاروباري رپورٽون ۽ نفعي جو جائزو',
    'ps': 'سوداګریز راپورونه او د ګټې تحلیل',
    'pa': 'کاروباری رپورٹاں تے منافع دا حساب',
    'ur-roman': 'Karobari Reports Aur Munafa Tajziya'
  },
  reportsHeaderSubtitle: {
    'ur': 'روزانہ اور ماہانہ فروخت، خالص منافع اور اخراجات کا تفصیلی جائزہ',
    'en': 'Detailed overview of daily and monthly sales, net profits, and expenses',
    'sd': 'روزانو ۽ ماهوار وڪرو، خالص نفعو ۽ خرچن جو تفصيل',
    'ps': 'د ورځني او میاشتني پلور، ګټې او لګښتونو بشپړ راپور',
    'pa': 'روزانہ تے ماہانہ سیل، خالص منافع تے خرچیاں دا پورا جائزہ',
    'ur-roman': 'Rozana aur mahana sale, khalis munafa aur ikhrajat ka jaiza'
  },
  filterToday: {
    'ur': 'آج',
    'en': 'Today',
    'sd': 'اڄ',
    'ps': 'نن',
    'pa': 'اج',
    'ur-roman': 'Aaj'
  },
  filter7Days: {
    'ur': '7 دن',
    'en': '7 Days',
    'sd': '7 ڏينهن',
    'ps': '۷ ورځې',
    'pa': '7 دن',
    'ur-roman': '7 Din'
  },
  filter30Days: {
    'ur': '30 دن',
    'en': '30 Days',
    'sd': '30 ڏينهن',
    'ps': '۳۰ ورځې',
    'pa': '30 دن',
    'ur-roman': '30 Din'
  },
  filterAllTime: {
    'ur': 'تمام ریکارڈ',
    'en': 'All Time',
    'sd': 'سمورو رڪارڊ',
    'ps': 'ټول ریکارډ',
    'pa': 'سارا ریکارڈ',
    'ur-roman': 'Tamam Record'
  },
  statTotalSalesPeriod: {
    'ur': 'کل فروخت (سیل)',
    'en': 'Total Sales',
    'sd': 'ڪل وڪرو',
    'ps': 'ټول پلور',
    'pa': 'کل سیل',
    'ur-roman': 'Kul Farokht (Sale)'
  },
  statNetProfitPeriod: {
    'ur': 'خالص منافع',
    'en': 'Net Profit',
    'sd': 'خالص نفعو',
    'ps': 'خالصه ګټه',
    'pa': 'خالص منافع',
    'ur-roman': 'Khalis Munafa'
  },
  statExpensesPeriod: {
    'ur': 'کل اخراجات',
    'en': 'Total Expenses',
    'sd': 'ڪل خرچ',
    'ps': 'ټول لګښتونه',
    'pa': 'کل خرچے',
    'ur-roman': 'Kul Ikhrajat'
  },
  averageBillSizeLabel: {
    'ur': 'اوسط بل سائز',
    'en': 'Average Bill Size',
    'sd': 'سراسري بل سائيز',
    'ps': 'د بل اوسط اندازه',
    'pa': 'اوسط بل سائز',
    'ur-roman': 'Average Bill Size'
  },
  perTransactionLabel: {
    'ur': 'فی گاہک ٹرانزیکشن',
    'en': 'Per transaction',
    'sd': 'في ٽرانزيڪشن',
    'ps': 'په هر معامله کې',
    'pa': 'فی ٹرانزیکشن',
    'ur-roman': 'Per transaction'
  },
  topSellingTitle: {
    'ur': 'سب سے زیادہ بکنے والے آئٹمز',
    'en': 'Top Selling Products',
    'sd': 'سڀ کان وڌيڪ وڪرو ٿيندڙ سامان',
    'ps': 'ترټولو ډېر پلورل شوي توکي',
    'pa': 'سب توں ودھ وکن والے آئٹم',
    'ur-roman': 'Top Bikne Wali Products'
  },
  noSalesInPeriod: {
    'ur': 'اس مدت میں کوئی فروخت ریکارڈ نہیں ہوئی ہے۔',
    'en': 'No sales recorded in this period.',
    'sd': 'هن مدي ۾ ڪو به وڪرو ناهي ٿيو.',
    'ps': 'په دې موده کې کوم پلور نه دی ثبت شوی.',
    'pa': 'ایس ویلے دوران کوئی سیل نئیں ہوئی۔',
    'ur-roman': 'Is period mein koi sale record nahi hui.'
  },
  businessHealthTitle: {
    'ur': 'دکان کی صحت (کاروبار اسکور)',
    'en': 'Business Health Score',
    'sd': 'دڪان جي صحت جو اسڪور',
    'ps': 'د سوداګرۍ روغتیا نمرې',
    'pa': 'دکان دی صحت (کاروبار سکور)',
    'ur-roman': 'Dukaan Ki Sehat (Score)'
  },
  healthScoreLevel: {
    'ur': '94% پروفیشنل لیول',
    'en': '94% Professional Level',
    'sd': '94% پروفيشنل درجو',
    'ps': '۹۴٪ مسلکي کچه',
    'pa': '94% پروفیشنل لیول',
    'ur-roman': '94% Professional Level'
  },
  healthScoreDesc: {
    'ur': 'آپ کے روزانہ بل، کھاتہ اور اخراجات مسلسل ریکارڈ ہو رہے ہیں۔ برکت اور پائیدار ترقی کا سفر!',
    'en': 'Your daily bills, khata entries and expenses are well maintained. On track to great growth!',
    'sd': 'توهان جا بل، کاتو ۽ خرچ روز رڪارڊ ٿي رهيا آهن. ڪامياب ڪاروبار جو سفر!',
    'ps': 'ستاسو ورځني بلونه، کهاته او لګښتونه پرله پسې ثبتېږي. یو بریالی سفر!',
    'pa': 'تہاڈے روز دے بل، کھاتہ تے خرچے لگاتار لکھے جا رہے نیں۔ اک وڈا کاروباری قدم!',
    'ur-roman': 'Aap ke rozana bills, khata aur kharchay mutawatar record ho rahe hain.'
  },
  customerRetentionLabel: {
    'ur': 'کسٹمرز کی تعداد:',
    'en': 'Customer Retention:',
    'sd': 'ڪسٽمر تعداد:',
    'ps': 'د پېرودونکو شتون:',
    'pa': 'گاہکاں دی تعداد:',
    'ur-roman': 'Customer Retention:'
  },
  lowStockProtectionLabel: {
    'ur': 'کم اسٹاک الرٹ تحفظ:',
    'en': 'Low Stock Alert Guard:',
    'sd': 'گهٽ اسٽاڪ الرٽ حفاظت:',
    'ps': 'د کمې زېرمې خوندیتوب:',
    'pa': 'تھوڑے سٹاک الرٹ حفاظت:',
    'ur-roman': 'Low Stock Protection:'
  },
  khataAuditSafetyLabel: {
    'ur': 'کھاتہ آڈٹ سیفٹی:',
    'en': 'Khata Audit Safety:',
    'sd': 'کاتو آڊٽ حفاظت:',
    'ps': 'د کهاتې خوندیتوب:',
    'pa': 'کھاتہ آڈٹ سیفٹی:',
    'ur-roman': 'Khata Audit Safety:'
  },
  activeStatus: {
    'ur': 'فعال (Active)',
    'en': 'Active',
    'sd': 'فعال',
    'ps': 'فعال',
    'pa': 'چالو (Active)',
    'ur-roman': 'Faal (Active)'
  },
  verifiedStatus: {
    'ur': '100% محفوظ و تصدیق شدہ',
    'en': '100% Verified',
    'sd': '100% تصديق ٿيل',
    'ps': '۱۰۰٪ تایید شوی',
    'pa': '100% تصدیق شدہ',
    'ur-roman': '100% Verified'
  },
  printReportBtn: {
    'ur': 'رپورٹ پرنٹ کریں',
    'en': 'Print Report',
    'sd': 'رپورٽ پرنٽ ڪريو',
    'ps': 'راپور چاپ کړئ',
    'pa': 'رپورٹ پرنٹ کرو',
    'ur-roman': 'Report Print Karein'
  },

  // Settings View
  settingsHeaderTitle: {
    'ur': 'دکان کی پروفائل اور سیٹنگز',
    'en': 'Business Profile & Settings',
    'sd': 'دڪان جي پروفائل ۽ سيٽنگون',
    'ps': 'د دوکان پروفایل او ترتیبات',
    'pa': 'دکان دی پروفائل تے سیٹنگز',
    'ur-roman': 'Dukaan Ki Profile Aur Settings'
  },
  settingsHeaderSubtitle: {
    'ur': 'دکان کا نام، مالک، موبائل نمبر، پسندیدہ زبان اور بیک اپ',
    'en': 'Shop name, owner, phone number, language and local backup',
    'sd': 'دڪان جو نالو، مالڪ، موبائل، ٻولي ۽ بيڪ اپ',
    'ps': 'د دوکان نوم، مالک، شمېره، ژبه او بیک اپ',
    'pa': 'دکان دا ناں، مالک، موبائل، بولی تے بیک اپ',
    'ur-roman': 'Dukaan ka naam, malik, mobile number, zaban aur backup'
  },
  settingsSavedSuccess: {
    'ur': 'سیٹنگز کامیابی سے محفوظ کر لی گئی ہیں!',
    'en': 'Settings saved successfully!',
    'sd': 'سيٽنگون ڪاميابي سان محفوظ ٿي ويون!',
    'ps': 'ترتیبات په بریالیتوب سره خوندي شول!',
    'pa': 'سیٹنگز کامیابی نال محفوظ ہو گئیاں!',
    'ur-roman': 'Settings kamiyabi se save ho gayi hain!'
  },
  saveChangesBtn: {
    'ur': 'تبدیلی محفوظ کریں',
    'en': 'Save Changes',
    'sd': 'تبديليون محفوظ ڪريو',
    'ps': 'بدلونونه خوندي کړئ',
    'pa': 'تبدیلی محفوظ کرو',
    'ur-roman': 'Tabdeeli Save Karein'
  },
  businessProfileTitle: {
    'ur': 'کاروبار کی معلومات',
    'en': 'Business Profile',
    'sd': 'ڪاروبار جي معلومات',
    'ps': 'د سوداګرۍ معلومات',
    'pa': 'کاروبار دی جانکاری',
    'ur-roman': 'Karobaar Ki Maloomaat'
  },
  businessNameLabel: {
    'ur': 'دکان / کاروبار کا نام *',
    'en': 'Shop / Business Name *',
    'sd': 'دڪان / ڪاروبار جو نالو *',
    'ps': 'د دوکان / سوداګرۍ نوم *',
    'pa': 'دکان / کاروبار دا ناں *',
    'ur-roman': 'Dukaan / Karobaar Ka Naam *'
  },
  ownerNameLabel: {
    'ur': 'مالک / دکاندار کا نام *',
    'en': 'Owner / Merchant Name *',
    'sd': 'مالڪ / دڪاندار جو نالو *',
    'ps': 'د دوکاندار / مالک نوم *',
    'pa': 'مالک / دکاندار دا ناں *',
    'ur-roman': 'Malik / Dukandaar Ka Naam *'
  },
  mobileNumberLabel: {
    'ur': 'موبائل / واٹس ایپ نمبر *',
    'en': 'Mobile / WhatsApp Number *',
    'sd': 'موبائل / واٽس ايپ نمبر *',
    'ps': 'د موبایل / واټس اپ شمېره *',
    'pa': 'موبائل / واٹس ایپ نمبر *',
    'ur-roman': 'Mobile / WhatsApp Number *'
  },
  businessAddressLabel: {
    'ur': 'دکان کا پتہ (شہر / علاقہ)',
    'en': 'Shop Address (City / Area)',
    'sd': 'دڪان جو پتو (شهر / علائقو)',
    'ps': 'د دوکان پته (ښار / سیمه)',
    'pa': 'دکان دا پتہ (شہر / علاقہ)',
    'ur-roman': 'Dukaan Ka Pata (Address)'
  },
  businessCategoryLabel: {
    'ur': 'کاروبار کی قسم (Category)',
    'en': 'Business Category',
    'sd': 'ڪاروبار جو قسم (Category)',
    'ps': 'د سوداګرۍ بڼه',
    'pa': 'کاروبار دی قسم (Category)',
    'ur-roman': 'Karobaar Ki Qisam'
  },
  preferredLanguageLabel: {
    'ur': 'ترجیحی زبان (Language)',
    'en': 'Preferred Language',
    'sd': 'پسنديده ٻولي (Language)',
    'ps': 'غوره ژبه (Language)',
    'pa': 'پسندیدہ بولی (Language)',
    'ur-roman': 'Tarjeehi Zubaan (Language)'
  },
  businessSubscriptionTitle: {
    'ur': 'کاروباری سبسکرپشن',
    'en': 'Business Subscription',
    'sd': 'ڪاروباري سبسڪرپشن',
    'ps': 'سوداګریز ګډون',
    'pa': 'کاروباری سبسکرپشن',
    'ur-roman': 'Karobaari Subscription'
  },
  activeTrialBadge: {
    'ur': 'فعال ٹرائل (Active Trial)',
    'en': 'Active Trial',
    'sd': 'فعال ٽرائل',
    'ps': 'فعال ازموینه',
    'pa': 'چالو ٹرائل (Active Trial)',
    'ur-roman': 'Active Trial'
  },
  monthlySubCost: {
    'ur': 'Rs. 700 / ماہانہ',
    'en': 'Rs. 700 / Month',
    'sd': 'Rs. 700 / ماهوار',
    'ps': 'Rs. 700 / میاشتنی',
    'pa': 'Rs. 700 / مہینہ',
    'ur-roman': 'Rs. 700 / Mahana'
  },
  trialPerksText: {
    'ur': '30 دن کا مفت ٹرائل • بغیر کسی کریڈٹ کارڈ کے',
    'en': '30 Days Free Trial • No Credit Card Required',
    'sd': '30 ڏينهن جو مفت ٽرائل • ڪريڊٽ ڪارڊ کانسواءِ',
    'ps': '۳۰ ورځې وړیا ازموینه • د کریډیټ کارت پرته',
    'pa': '30 دن دا مفت ٹرائل • بنا کسے کریڈٹ کارڈ توں',
    'ur-roman': '30 Days Free Trial • No Credit Card Required'
  },
  subDetailsText: {
    'ur': 'دکان کے تمام بلز، AI منشی، وائس کھاتہ اور لامحدود واٹس ایپ رسیدیں باآسانی چلائیں۔',
    'en': 'Easily manage billing, AI Munshi, voice ledger and unlimited WhatsApp receipts.',
    'sd': 'دڪان جا سمورا بل، اي آئي منشي، کاتو ۽ واٽس ايپ رسيدون هلايو.',
    'ps': 'د دوکان ټول بلونه، ای آی منشي او بې حده واټس اپ رسیدونه پرمخ بوځئ.',
    'pa': 'دکان دے سارے بل، اے آئی منشی، آواز نال کھاتہ تے واٹس ایپ پرچیاں سوکھے طریقے نال چلاؤ۔',
    'ur-roman': 'Dukaan ke tamam bills, AI Munshi, voice khata aur WhatsApp receipts chalayein.'
  },
  paymentMethodsLabel: {
    'ur': 'ادائیگی کا ذریعہ: JazzCash / Easypaisa / 1Link بینک ٹرانسفر',
    'en': 'Payment Methods: JazzCash / Easypaisa / 1Link Bank Transfer',
    'sd': 'ادائيگي: جيز ڪيش / ايزي پئسا / 1لنڪ بينڪ ٽرانسفر',
    'ps': 'د تادیې لاره: JazzCash / Easypaisa / 1Link بانک',
    'pa': 'پیسے دین دا طریقہ: جیزکیش / ایزی پیسہ / 1لنک بینک',
    'ur-roman': 'Adaigi Zariya: JazzCash / Easypaisa / 1Link Bank Transfer'
  },
  rewardsProgramTitle: {
    'ur': 'دکان انعام پروگرام (Rewards)',
    'en': 'Shop Rewards Program',
    'sd': 'دڪان انعام پروگرام',
    'ps': 'د دوکان انعامي پروګرام',
    'pa': 'دکان انعام پروگرام (Rewards)',
    'ur-roman': 'Dukaan Inaam Program (Rewards)'
  },
  currentRankLabel: {
    'ur': 'موجودہ رینک',
    'en': 'Current Rank',
    'sd': 'موجوده درجو',
    'ps': 'اوسنۍ کچه',
    'pa': 'موجودہ رینک',
    'ur-roman': 'Current Rank'
  },
  pointsLabel: {
    'ur': 'پوائنٹس',
    'en': 'Points',
    'sd': 'پوائنٽس',
    'ps': 'نمرې',
    'pa': 'پوائنٹس',
    'ur-roman': 'Points'
  },
  rewardsDescText: {
    'ur': 'ہر بل بنانے اور وقت پر ادھار وصول کرنے پر پوائنٹس ملتے ہیں جن سے سبسکرپشن ڈسکاؤنٹ حاصل ہوتا ہے۔',
    'en': 'Earn reward points for every invoice and timely credit recovery to get discounts.',
    'sd': 'هر بل ٺاهڻ ۽ وقت تي اوڌر وٺڻ سان رعايت حاصل ڪريو.',
    'ps': 'د هر بل او پور په وخت اخیستلو سره ټکي ترلاسه کړئ.',
    'pa': 'ہر بل بنان تے ویلے سر ادھار لین تے پوائنٹس ملدے نیں جنہاں نال رعایت ملدی اے۔',
    'ur-roman': 'Har bill banane aur waqt par udhaar wasool karne par points miltay hain.'
  },
  secureBackupTitle: {
    'ur': 'دکان کا محفوظ ڈیٹا بیک اپ',
    'en': 'Secure Business Data Backup',
    'sd': 'دڪان جو محفوظ ڊيٽا بيڪ اپ',
    'ps': 'د دوکان خوندي ډیټا بیک اپ',
    'pa': 'دکان دا محفوظ ڈیٹا بیک اپ',
    'ur-roman': 'Dukaan Ka Mehfooz Data Backup'
  },
  backupDescText: {
    'ur': 'آپ کا ڈیٹا آپ کے موبائل / کمپیوٹر پر محفوظ رہتا ہے۔ کسی بھی وقت فائل ڈاؤن لوڈ کر کے محفوظ رکھیں۔',
    'en': 'Your data remains safe on your device. Download or restore backup anytime.',
    'sd': 'توهان جو ڊيٽا توهان جي ڊوائيس تي محفوظ رهي ٿو.',
    'ps': 'ستاسو ډیټا ستاسو په وسیله خوندي پاتې کېږي.',
    'pa': 'تہاڈا ڈیٹا تہاڈے کول محفوظ رہندا اے۔ کسے وی ویلے فائل ڈاؤن لوڈ کر کے رکھو۔',
    'ur-roman': 'Aap ka data aap ke device par mehfooz rehta hai.'
  },
  downloadBackupBtn: {
    'ur': 'بیک اپ ڈاؤن لوڈ',
    'en': 'Download Backup',
    'sd': 'بيڪ اپ ڊائون لوڊ',
    'ps': 'بیک اپ ښکته کړئ',
    'pa': 'بیک اپ ڈاؤن لوڈ',
    'ur-roman': 'Backup Download'
  },
  restoreBackupBtn: {
    'ur': 'بیک اپ بحال کریں',
    'en': 'Restore Backup',
    'sd': 'بيڪ اپ بحال ڪريو',
    'ps': 'بیک اپ بېرته راولئ',
    'pa': 'بیک اپ بحال کرو',
    'ur-roman': 'Restore Backup'
  },
  resetSampleDataBtn: {
    'ur': 'نیا صاف کھاتہ ری سیٹ کریں (تمام ریکارڈز صفر)',
    'en': 'Reset to Clean Business Data (Zero Balance)',
    'sd': 'صاف کاتو ري سيٽ ڪريو (سمورو رڪارڊ زيرو)',
    'ps': 'پاک کهاته بېرته پیل کړئ (ټول صفر)',
    'pa': 'صاف کھاتہ ری سیٹ کرو (سارے ریکارڈ صفر)',
    'ur-roman': 'Saaf Khata Reset Karein (Zero Records)'
  },

  // AI Munshi Drawer
  munshiDrawerHeaderTitle: {
    'ur': 'AI منشی (ڈیجیٹل اکاؤنٹنٹ)',
    'en': 'AI Munshi (Digital Accountant)',
    'sd': 'اي آئي منشي (ڊجيٽل اڪائونٽنٽ)',
    'ps': 'ای آی منشي (ډیجیټل محاسبه)',
    'pa': 'اے آئی منشی (ڈیجیٹل اکاؤنٹنٹ)',
    'ur-roman': 'AI Munshi (Digital Accountant)'
  },
  handsFreeBtnText: {
    'ur': 'ہینڈز فری بولیں',
    'en': 'Hands-Free Voice',
    'sd': 'هينڊز فري آواز',
    'ps': 'لاس آزاد غږ',
    'pa': 'ہینڈز فری بولو',
    'ur-roman': 'Hands-Free Voice'
  },
  listeningPrompt: {
    'ur': 'سن رہا ہوں... فرمائیے',
    'en': 'Listening... Speak naturally',
    'sd': 'ٻڌي رهيو آهيان... فرمايو',
    'ps': 'اورم... ووایئ',
    'pa': 'سن ریا واں... دسو',
    'ur-roman': 'Sun raha hoon... Farmaiye'
  },
  typePromptPlaceholder: {
    'ur': 'بولیں یا لکھیں (مثلاً: آج کی کل سیل کتنی ہوئی؟)...',
    'en': 'Speak or type (e.g. What are today’s total sales?)...',
    'sd': 'ڳالهايو يا لکو (مثال: اڄ جي ڪل وڪرو ڪيتري ٿي؟)...',
    'ps': 'ووایئ یا ولیکئ (مثال: نن ټول پلور څومره دی؟)...',
    'pa': 'بولو یا لکھو (جیویں: اج دی کل سیل کنی ہوئی؟)...',
    'ur-roman': 'Boliye ya likhein (maslan: Aaj ki total sale kitni hui?)...'
  },
  sendBtnText: {
    'ur': 'بھیجیں',
    'en': 'Send',
    'sd': 'موڪليو',
    'ps': 'ولېږئ',
    'pa': 'بھیجو',
    'ur-roman': 'Bhejein'
  },
  confirmationRequiredText: {
    'ur': 'تصدیق درکار ہے',
    'en': 'Confirmation Required',
    'sd': 'پڪ ڪرڻ ضروري آهي',
    'ps': 'تایید ته اړتیا ده',
    'pa': 'پکا کرنا ضروری اے',
    'ur-roman': 'Tasdeeq Darkaar Hai'
  },
  btnConfirmYes: {
    'ur': 'ہاں، درج کریں',
    'en': 'Confirm & Save',
    'sd': 'ها، درج ڪريو',
    'ps': 'هو، ثبت یې کړئ',
    'pa': 'ہاں، درج کرو',
    'ur-roman': 'Haan, Record Karein'
  },
  btnCancelNo: {
    'ur': 'کینسل',
    'en': 'Cancel',
    'sd': 'رد ڪريو',
    'ps': 'رد کړئ',
    'pa': 'رد کرو',
    'ur-roman': 'Cancel'
  },
  munshiGreetingMsg: {
    'ur': 'السلام علیکم! میں آپ کا ڈیجیٹل منشی ہوں۔ سیل، کھاتہ، بل یا اسٹاک کے بارے میں کچھ بھی پوچھیں یا بول کر بتائیں۔',
    'en': 'Assalam-o-Alaikum! I am your AI Munshi. Ask or speak about sales, khata ledger, stock, or bills.',
    'sd': 'السلام عليڪم! مان اوهان جو ڊجيٽل منشي آهيان. وڪرو، کاتي يا اسٽاڪ بابت ڪجهه به پڇو يا ڳالهايو.',
    'ps': 'سلامونه! زه ستاسو ډیجیټل منشي یم. د پلور، پور، کهاتې او زېرمې په اړه پوښتنه وکړئ.',
    'pa': 'السلام علیکم! میں تہاڈا منشی آں۔ اج دی سیل، کھاتہ، بل یا مال بارے کجھ وی پچھو یا بول کے دسو۔',
    'ur-roman': 'Assalam-o-Alaikum! Main aap ka Digital Munshi hoon. Sale, khata, bill ya stock ke baray mein kuch bhi poochiye ya boliye.'
  },
  chipTodaySales: {
    'ur': '📊 آج کی سیل؟',
    'en': '📊 Today Sales?',
    'sd': '📊 اڄ جي وڪرو؟',
    'ps': '📊 نننی پلور؟',
    'pa': '📊 اج دی سیل؟',
    'ur-roman': '📊 Aaj Ki Sale?'
  },
  chipLowStock: {
    'ur': '📦 کم اسٹاک؟',
    'en': '📦 Low Stock?',
    'sd': '📦 گهٽ اسٽاڪ؟',
    'ps': '📦 کمه زېرمه؟',
    'pa': '📦 تھوڑا سٹاک؟',
    'ur-roman': '📦 Kam Stock?'
  },
  chipCustomerDebt: {
    'ur': '📖 گاہک کھاتہ؟',
    'en': '📖 Customer Khata?',
    'sd': '📖 گراهڪ کاتو؟',
    'ps': '📖 د پېرودونکي کهاته؟',
    'pa': '📖 گاہک کھاتہ؟',
    'ur-roman': '📖 Customer Khata?'
  },
  chipNewBill: {
    'ur': '🧾 نیا بل؟',
    'en': '🧾 New Bill?',
    'sd': '🧾 نئون بل؟',
    'ps': '🧾 نوی بل؟',
    'pa': '🧾 نواں بل؟',
    'ur-roman': '🧾 Naya Bill?'
  },
  munshiSubtitle: {
    'ur': 'ڈیجیٹل کاروباری دفتر اور اکاؤنٹنٹ',
    'en': 'Digital Business Office & Accountant',
    'sd': 'ڊجيٽل ڪاروباري دفتر ۽ اڪائونٽنٽ',
    'ps': 'ډیجیټل سوداګریز دفتر او محاسبه',
    'pa': 'ڈیجیٹل کاروباری دفتر تے اکاؤنٹنٹ',
    'ur-roman': 'Digital Business Office & Accountant'
  },
  munshiThinking: {
    'ur': 'AI منشی حساب کتاب چیک کر رہا ہے...',
    'en': 'AI Munshi is calculating...',
    'sd': 'اي آئي منشي حساب ڪتاب چيڪ ڪري رهيو آهي...',
    'ps': 'ای آی منشي حساب کتاب ګوري...',
    'pa': 'اے آئی منشی حساب کتاب چیک کر ریا اے...',
    'ur-roman': 'AI Munshi hisab kitaab check kar raha hai...'
  },
  inputMunshiPlaceholder: {
    'ur': 'اردو، پنجابی، سندھی، پشتو، رومن یا انگلش میں لکھیں یا بولیں...',
    'en': 'Type or speak in Urdu, Punjabi, Sindhi, Pashto, Roman, English...',
    'sd': 'سنڌي، اردو، پنجابي يا انگريزي ۾ ڳالهايو يا لکو...',
    'ps': 'پښتو، اردو، پنجابي يا انګریزي کې ولیکئ یا وغږېږئ...',
    'pa': 'پنجابی، اردو، یا انگلش وچ بولو یا لکھو...',
    'ur-roman': 'Urdu, Roman, Punjabi ya English mein likhein ya bolein...'
  },
  entrySavedToBooks: {
    'ur': 'اندراج محفوظ کر لیا گیا (Saved to Books)',
    'en': 'Saved to Books',
    'sd': 'اندراج محفوظ ٿي ويو',
    'ps': 'ثبت شو (په حسابونو کې خوندي شو)',
    'pa': 'اندراج محفوظ کر لیا گیا (Saved to Books)',
    'ur-roman': 'Indiraaj mehfooz kar liya gaya (Saved to Books)'
  },
  entryCancelled: {
    'ur': 'کاروباری اندراج منسوخ کر دیا گیا (Cancelled)',
    'en': 'Transaction Cancelled',
    'sd': 'ڪاروباري اندراج رد ڪيو ويو',
    'ps': 'معامله رد شوه',
    'pa': 'کاروباری اندراج رد کر دتا گیا',
    'ur-roman': 'Karobaari indiraaj mansookh kar diya gaya (Cancelled)'
  },

  // Low Stock Alert
  stockAlertPrefix: {
    'ur': 'اسٹاک الرٹ: ',
    'en': 'Stock Alert: ',
    'sd': 'اسٽاڪ الرٽ: ',
    'ps': 'د زېرمې خبرداری: ',
    'pa': 'سٹاک الرٹ: ',
    'ur-roman': 'Stock Alert: '
  },
  stockAlertSuffix: {
    'ur': ' پروڈکٹس ختم ہونے والی ہیں!',
    'en': ' products running low!',
    'sd': ' سامان ختم ٿيڻ وارو آهي!',
    'ps': ' توکي ختمېدو ته نږدې دي!',
    'pa': ' چیزاں مکݨ والیاں نیں!',
    'ur-roman': ' products khatam honay wali hain!'
  },
  checkStockBtn: {
    'ur': 'اسٹاک چیک کریں →',
    'en': 'Check Stock →',
    'sd': 'اسٽاڪ چيڪ ڪريو →',
    'ps': 'زېرمه وګورئ →',
    'pa': 'سٹاک ویکھو →',
    'ur-roman': 'Stock Check Karein →'
  },
  leftLabel: {
    'ur': 'باقی:',
    'en': 'Left:',
    'sd': 'باقي:',
    'ps': 'پاتې:',
    'pa': 'باقی:',
    'ur-roman': 'Baqi:'
  },
  addStockBtn: {
    'ur': '+ مال شامل کریں',
    'en': '+ Add Stock',
    'sd': '+ سامان شامل ڪريو',
    'ps': '+ توکی ورزیات کړئ',
    'pa': '+ مال پاؤ',
    'ur-roman': '+ Mal Shamil Karein'
  },
  voiceSubtitle: {
    'ur': 'پاکستانی زبانوں میں بات چیت',
    'en': 'Regional Languages Voice Support',
    'sd': 'مقامي ٻولين ۾ آواز جي سهولت',
    'ps': 'په ټولو ژبو کې غږیز ملاتړ',
    'pa': 'پنجابی، اردو تے ساریاں بولیاں وچ آواز',
    'ur-roman': 'Pakistani zabanon mein aawaz support'
  },

  // Sidebar & Status
  trialActive: {
    'ur': 'ٹرائل فعال',
    'en': 'Active Trial',
    'sd': 'ٽرائل فعال',
    'ps': 'فعاله دوره',
    'pa': 'ٹرائل چالو',
    'ur-roman': 'Trial Fa\'aal'
  },
  planStatus: {
    'ur': 'پلان اسٹیٹس',
    'en': 'Plan Status',
    'sd': 'پلان جي حالت',
    'ps': 'د پلان حالت',
    'pa': 'پلان دی حالت',
    'ur-roman': 'Plan Status'
  },
  monthlyPlan: {
    'ur': 'ماہانہ پلان',
    'en': 'Monthly Plan',
    'sd': 'ماهوار پلان',
    'ps': 'میاشتنی پلان',
    'pa': 'ماہانہ پلان',
    'ur-roman': 'Mahana Plan'
  },
  safeLocalData: {
    'ur': 'محفوظ لوکل ڈیٹا',
    'en': 'Safe Local Data',
    'sd': 'محفوظ مقامي ڊيٽا',
    'ps': 'خوندي ځایی ډیټا',
    'pa': 'محفوظ لوکل ڈیٹا',
    'ur-roman': 'Mehfooz Local Data'
  },

  // Offline Banner
  offlineBannerMsg: {
    'ur': 'آپ آف لائن ہیں۔ دکان کا تمام ڈیٹا مقامی طور پر محفوظ ہے اور بلنگ جاری ہے۔',
    'en': 'You are offline. Local data is safely preserved and POS billing continues.',
    'sd': 'توهان آف لائن آهيو. دڪان جو سمورو ڊيٽا محفوظ آهي ۽ بلنگ جاري آهي.',
    'ps': 'تاسو آفلاین یاست. ټول مالومات خوندي دي او کار روان دی.',
    'pa': 'تسی آف لائن او۔ دکان دا سارا ڈیٹا محفوظ اے تے بلنگ چل رہی اے۔',
    'ur-roman': 'Aap offline hain. Dukaan ka tamam data local mehfooz hai aur billing jari hai.'
  },

  // Empty States (Clean Customer Data)
  emptyKhataTitle: {
    'ur': 'ابھی کوئی کھاتہ ریکارڈ نہیں ہے',
    'en': 'No Khata record yet',
    'sd': 'اڃا ڪو کاتو رڪارڊ ناهي',
    'ps': 'تراوسه کومه د کھاتې ریکارډ نشته',
    'pa': 'اجے کوئی کھاتہ ریکارڈ نہیں اے',
    'ur-roman': 'Abhi koi Khata record nahi hai'
  },
  emptyKhataSubtitle: {
    'ur': 'نیا کھاتہ بنائیں',
    'en': 'Create New Khata',
    'sd': 'نئون کاتو ٺاهيو',
    'ps': 'نوې کھاتہ جوړه کړئ',
    'pa': 'نواں کھاتہ بناؤ',
    'ur-roman': 'Naya Khata banayein'
  },
  emptyUdhaarTitle: {
    'ur': 'ابھی کوئی ادھار ریکارڈ نہیں ہے',
    'en': 'No Udhaar record yet',
    'sd': 'اڃا ڪو اوڌار رڪارڊ ناهي',
    'ps': 'تراوسه کوم د ادھار ریکارډ نشته',
    'pa': 'اجے کوئی ادھار ریکارڈ نہیں اے',
    'ur-roman': 'Abhi koi Udhaar record nahi hai'
  },
  emptyUdhaarSubtitle: {
    'ur': 'نیا ادھار شامل کریں',
    'en': 'Add New Udhaar',
    'sd': 'نئون اوڌار شامل ڪريو',
    'ps': 'نوی ادھار اضافه کړئ',
    'pa': 'نواں ادھار شامل کرو',
    'ur-roman': 'Naya Udhaar add karein'
  },
  emptySalesTitle: {
    'ur': 'ابھی کوئی سیل ریکارڈ نہیں ہے',
    'en': 'No Sale record yet',
    'sd': 'اڃا ڪو وڪرو رڪارڊ ناهي',
    'ps': 'تراوسه کومه د خرڅلاو ریکارډ نشته',
    'pa': 'اجے کوئی سیل ریکارڈ نہیں اے',
    'ur-roman': 'Abhi koi Sale record nahi hai'
  },
  emptySalesSubtitle: {
    'ur': 'نیا بل بنائیں',
    'en': 'Create New Bill',
    'sd': 'نئون بل ٺاهيو',
    'ps': 'نوی بل جوړ کړئ',
    'pa': 'نواں بل بناؤ',
    'ur-roman': 'Naya Bill banayein'
  },
  emptyExpensesTitle: {
    'ur': 'ابھی کوئی خرچہ ریکارڈ نہیں ہے',
    'en': 'No Expense record yet',
    'sd': 'اڃا ڪو خرچ رڪارڊ ناهي',
    'ps': 'تراوسه کوم لګښت ریکارډ نشته',
    'pa': 'اجے کوئی خرچہ ریکارڈ نہیں اے',
    'ur-roman': 'Abhi koi Expense record nahi hai'
  },
  emptyExpensesSubtitle: {
    'ur': 'نیا خرچہ درج کریں',
    'en': 'Record New Expense',
    'sd': 'نئون خرچ درج ڪريو',
    'ps': 'نوی لګښت ثبت کړئ',
    'pa': 'نواں خرچہ لکھو',
    'ur-roman': 'Naya Kharcha darj karein'
  },
  emptyProductsTitle: {
    'ur': 'ابھی کوئی پروڈکٹ ایڈ نہیں ہوا',
    'en': 'No Product added yet',
    'sd': 'اڃا ڪو سامان شامل ناهي ڪيو ويو',
    'ps': 'تراوسه کوم توکی نه دی اضافه شوی',
    'pa': 'اجے کوئی پروڈکٹ ایڈ نہیں ہویا',
    'ur-roman': 'Abhi koi Product add nahi hua'
  },
  emptyProductsSubtitle: {
    'ur': 'پہلا پروڈکٹ شامل کریں',
    'en': 'Add First Product',
    'sd': 'پهريون سامان شامل ڪريو',
    'ps': 'لومړی توکی اضافه کړئ',
    'pa': 'پہلا پروڈکٹ شامل کرو',
    'ur-roman': 'Pehla Product shamil karein'
  },
  emptyCustomersTitle: {
    'ur': 'ابھی کوئی کسٹمر ایڈ نہیں ہوا',
    'en': 'No Customer added yet',
    'sd': 'اڃا ڪو گراهڪ شامل ناهي ڪيو ويو',
    'ps': 'تراوسه کوم پیرودونکی نه دی اضافه شوی',
    'pa': 'اجے کوئی گاہک ایڈ نہیں ہویا',
    'ur-roman': 'Abhi koi Customer add nahi hua'
  },
  emptyCustomersSubtitle: {
    'ur': 'نیا گاہک شامل کریں',
    'en': 'Add New Customer',
    'sd': 'نئون گراهڪ شامل ڪريو',
    'ps': 'نوی پیرودونکی اضافه کړئ',
    'pa': 'نواں گاہک شامل کرو',
    'ur-roman': 'Naya Customer shamil karein'
  },
  emptySuppliersTitle: {
    'ur': 'ابھی کوئی سپلائر ایڈ نہیں ہوا',
    'en': 'No Supplier added yet',
    'sd': 'اڃا ڪو سپلائر شامل ناهي ڪيو ويو',
    'ps': 'تراوسه کوم عرضه کوونکی نه دی اضافه شوی',
    'pa': 'اجے کوئی سپلائر ایڈ نہیں ہویا',
    'ur-roman': 'Abhi koi Supplier add nahi hua'
  },
  emptySuppliersSubtitle: {
    'ur': 'نیا سپلائر شامل کریں',
    'en': 'Add New Supplier',
    'sd': 'نئون سپلائر شامل ڪريو',
    'ps': 'نوی عرضه کوونکی اضافه کړئ',
    'pa': 'نواں سپلائر شامل کرو',
    'ur-roman': 'Naya Supplier shamil karein'
  },
  emptyPurchasesTitle: {
    'ur': 'ابھی کوئی خریداری ریکارڈ نہیں ہے',
    'en': 'No Purchase record yet',
    'sd': 'اڃا ڪا خريداري رڪارڊ ناهي',
    'ps': 'تراوسه کومه رانیونه نه ده ثبت شوې',
    'pa': 'اجے کوئی خریداری ریکارڈ نہیں اے',
    'ur-roman': 'Abhi koi Purchase record nahi hai'
  },
  emptyPurchasesSubtitle: {
    'ur': 'نئی خریداری درج کریں',
    'en': 'Record New Purchase',
    'sd': 'نئين خريداري درج ڪريو',
    'ps': 'نوې رانیونه ثبت کړئ',
    'pa': 'نئی خریداری لکھو',
    'ur-roman': 'Nayi Purchase darj karein'
  },
  resetCleanDataSuccess: {
    'ur': 'تمام ڈیٹا کامیابی سے صاف ہو گیا ہے۔ تمام کھاتے، ادھار، اور مالیاتی ڈیٹا 0 ہو گئے ہیں۔',
    'en': 'All business financial data has been reset cleanly to 0.',
    'sd': 'سمورو ڊيٽا ڪاميابي سان صاف ٿي ويو. سمورا کاتا ۽ اوڌار 0 ٿي ويا.',
    'ps': 'ټول معلومات په بریالیتوب سره پاک شول او حساب 0 شو.',
    'pa': 'سارا ڈیٹا صاف ہو گیا اے تے سارے حساب 0 ہو گئے نیں۔',
    'ur-roman': 'Tamam data kamiyabi se saaf ho gaya hai. Khata aur Udhaar 0 ho gaye hain.'
  },
  cancel: {
    'ur': 'منسوخ',
    'en': 'Cancel',
    'sd': 'منسوخ',
    'ps': 'لغوه',
    'pa': 'کینسل',
    'ur-roman': 'Cancel'
  },
  save: {
    'ur': 'محفوظ کریں',
    'en': 'Save',
    'sd': 'محفوظ ڪريو',
    'ps': 'ساتل',
    'pa': 'محفوظ کرو',
    'ur-roman': 'Mehfooz karein'
  },
  done: {
    'ur': 'مکمل',
    'en': 'Done',
    'sd': 'مڪمل',
    'ps': 'بشپړ',
    'pa': 'مکمل',
    'ur-roman': 'Mukammal'
  },
  tools: {
    'ur': 'اوزار و ٹولز',
    'en': 'Specialized Tools',
    'sd': 'اوزار ۽ ٽولز',
    'ps': 'وسایل او اوزار',
    'pa': 'اوزار تے ٹولز',
    'ur-roman': 'Auzaar o Tools'
  },
  businessName: {
    'ur': 'دکان کا نام',
    'en': 'Shop / Business Name',
    'sd': 'دڪان جو نالو',
    'ps': 'د دوکان نوم',
    'pa': 'دکان دا ناں',
    'ur-roman': 'Dukan ka naam'
  },
  editBusinessInfo: {
    'ur': 'کاروبار کی معلومات تبدیل کریں',
    'en': 'Edit Business Info',
    'sd': 'ڪاروبار جي معلومات تبديل ڪريو',
    'ps': 'د سوداګرۍ معلومات سم کړئ',
    'pa': 'کاروبار دی معلومات بدلو',
    'ur-roman': 'Karobaar ki maloomat tabdeel karein'
  },
  editBusinessDetails: {
    'ur': 'تفصیلات تبدیل کریں',
    'en': 'Edit Details',
    'sd': 'تفصيل تبديل ڪريو',
    'ps': 'تفصیلات بدله کړئ',
    'pa': 'تفصیلات بدلو',
    'ur-roman': 'Tafseelat tabdeel karein'
  },
  businessTypeCategory: {
    'ur': 'کاروبار کی قسم (کیٹیگری)',
    'en': 'Business Type / Category',
    'sd': 'ڪاروبار جو قسم',
    'ps': 'د سوداګرۍ ډول',
    'pa': 'کاروبار دی ونڈ',
    'ur-roman': 'Karobaar Ki Qisam'
  },
  phoneNumber: {
    'ur': 'فون / موبائل نمبر',
    'en': 'Phone / Mobile Number',
    'sd': 'فون / موبائل نمبر',
    'ps': 'د تلیفون شمیره',
    'pa': 'فون / موبائل نمبر',
    'ur-roman': 'Phone Number'
  },
  taglineOptional: {
    'ur': 'سلوگن یا ٹیگ لائن (اختیاری)',
    'en': 'Tagline (Optional)',
    'sd': 'سلوگن يا ٽيگ لائن (اختياري)',
    'ps': 'شعار (اختیاري)',
    'pa': 'سلوگن (اختیاری)',
    'ur-roman': 'Slogan / Tagline (Ikhtiyari)'
  },
  myBusiness: {
    'ur': 'میری دکان',
    'en': 'My Business',
    'sd': 'منهنجو دڪان',
    'ps': 'زما دوکان',
    'pa': 'میرا کاروبار',
    'ur-roman': 'Meri Dukaan'
  },
  edit: {
    'ur': 'تبدیل کریں',
    'en': 'Edit',
    'sd': 'تبديل ڪريو',
    'ps': 'سمول',
    'pa': 'بدلو',
    'ur-roman': 'Tabdeel Karein'
  },
  changeLogo: {
    'ur': 'لوگو تبدیل کریں',
    'en': 'Change Logo',
    'sd': 'لوگو تبديل ڪريو',
    'ps': 'لوګو بدله کړئ',
    'pa': 'لوگو بدلو',
    'ur-roman': 'Logo Tabdeel Karein'
  },
  uploadLogo: {
    'ur': 'اپنا لوگو اپلوڈ کریں',
    'en': 'Upload Logo',
    'sd': 'پنهنجو لوگو اپلوڊ ڪريو',
    'ps': 'خپله لوګو پورته کړئ',
    'pa': 'اپنا لوگو اپلوڈ کرو',
    'ur-roman': 'Apna Logo Upload Karein'
  },
  removeLogo: {
    'ur': 'لوگو ہٹائیں',
    'en': 'Remove Logo',
    'sd': 'لوگو هٽايو',
    'ps': 'لوګو لرې کړئ',
    'pa': 'لوگو ہٹاؤ',
    'ur-roman': 'Logo Hatayein'
  },
  customerLogo: {
    'ur': 'کسٹمر لوگو',
    'en': 'Custom Logo',
    'sd': 'ڪسٽمر لوگو',
    'ps': 'ځانګړې لوګو',
    'pa': 'کسٹمر لوگو',
    'ur-roman': 'Customer Logo'
  },
  autoLogo: {
    'ur': 'خودکار برانڈ لوگو',
    'en': 'Smart Brand Logo',
    'sd': 'خودڪار برانڊ لوگو',
    'ps': 'اتوماتیک برانډ لوګو',
    'pa': 'خودکار برانڈ لوگو',
    'ur-roman': 'Khudaar Brand Logo'
  },
  // Primary 3 Actions
  parchiCameraTitle: {
    'ur': 'کیمرہ / پرچی',
    'sd': 'ڪيمرا / پرچي',
    'en': 'Camera / Parchi',
    'pa': 'کیمرہ / پرچی',
    'ps': 'کیمره / پرچۍ',
    'ur-roman': 'Camera / Parchi'
  },
  smartParchiScan: {
    'ur': 'اسمارٹ بل اسکین',
    'sd': 'سمارٽ بل اسڪين',
    'en': 'Smart Bill Scan',
    'pa': 'فوری بل اسکین',
    'ps': 'هوښیار بل سکن',
    'ur-roman': 'Smart Bill Scan'
  },
  vipPosTitle: {
    'ur': 'کاؤنٹر',
    'sd': 'ڪائونٽر',
    'en': 'Counter',
    'pa': 'کاؤنٹر',
    'ps': 'کاؤنٹر',
    'ur-roman': 'Counter'
  },
  oneTapSaleBadge: {
    'ur': 'تیز ترین سیل',
    'sd': 'تيز وڪرو',
    'en': '1-Tap Quick Sale',
    'pa': 'تیز سیل',
    'ps': 'ګړندی پلور',
    'ur-roman': 'Fast Sale'
  },
  aiMunshiTitle: {
    'ur': 'اے آئی منشی',
    'sd': 'اي آءِ منشي',
    'en': 'AI Munshi',
    'pa': 'اے آئی منشی',
    'ps': 'ای آی منشي',
    'ur-roman': 'AI Munshi'
  },
  smartAssistantBadge: {
    'ur': 'کاروباری معاون',
    'sd': 'ڪاروباري مددگار',
    'en': 'Smart Assistant',
    'pa': 'کاروبار دا منشی',
    'ps': 'هوښیار مرستیال',
    'ur-roman': 'Smart Assistant'
  },
  businessToolsTitle: {
    'ur': 'کاروباری ٹولز',
    'sd': 'ڪاروباري اوزار',
    'en': 'Business Tools',
    'pa': 'کاروباری ٹولز',
    'ps': 'سوداګریز اوزار',
    'ur-roman': 'Business Tools'
  },
  businessToolsSubtitle: {
    'ur': 'آپ کے کاروبار کے لیے مخصوص بنیادی ٹولز',
    'sd': 'توهان جي ڪاروبار لاءِ مخصوص مکيه اوزار',
    'en': 'Tailored tools for your business',
    'pa': 'تہاڈے کاروبار لئی مخصوص ٹولز',
    'ps': 'ستاسو د سوداګرۍ لپاره ځانګړي اوزار',
    'ur-roman': 'Aap ke karobar ke liye makhsoos tools'
  },
  moreToolsTitle: {
    'ur': 'مزید کاروباری ٹولز',
    'sd': 'وڌيڪ ڪاروباري اوزار',
    'en': 'More Business Tools',
    'pa': 'ہَور کاروباری ٹولز',
    'ps': 'نور سوداګریز اوزار',
    'ur-roman': 'More Tools'
  },
  showMoreTools: {
    'ur': 'مزید ٹولز دیکھیں',
    'sd': 'وڌيڪ اوزار ڏسو',
    'en': 'Show More Tools',
    'pa': 'ہَور ٹولز ویکھو',
    'ps': 'نور اوزار وګورئ',
    'ur-roman': 'Mazeed Tools Dekhein'
  },
  hideMoreTools: {
    'ur': 'کم ٹولز دکھائیں',
    'sd': 'گهٽ اوزار ڏيکاريو',
    'en': 'Show Less Tools',
    'pa': 'گھٹ ٹولز وکھاؤ',
    'ps': 'لږ اوزار وښایاست',
    'ur-roman': 'Kam Tools Dikhayein'
  }
};

export function t(key: string, lang?: LanguageCode): string {
  const targetLang = lang || 'ur';
  const entry = translations[key];
  if (!entry) {
    return key;
  }
  return entry[targetLang] || entry['ur'] || entry['en'] || key;
}
