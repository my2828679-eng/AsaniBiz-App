import { BusinessTypeId, LanguageCode } from '../types';

export interface BusinessToolItem {
  id: string;
  name: Record<LanguageCode, string>;
  category: 'core' | 'catalog' | 'parties' | 'finance' | 'special';
  icon: string;
  action: string;
  badge?: string;
  description?: Record<LanguageCode, string>;
}

export interface BusinessThemeConfig {
  id: BusinessTypeId;
  name: Record<LanguageCode, string>;
  tagline: Record<LanguageCode, string>;
  accentColor: string;
  secondaryColor: string;
  boardTheme: 'emerald' | 'cyan' | 'blue' | 'purple' | 'amber' | 'orange' | 'red' | 'slate' | 'rose' | 'dark';
  iconName: string;
  bgSymbol: string;
  tools: BusinessToolItem[];
}

export const BUSINESS_THEMES: Record<string, BusinessThemeConfig> = {
  kiryana: {
    id: 'kiryana',
    name: {
      'ur': 'کریانہ و جنرل سٹور',
      'ur-roman': 'Kiryana / General Store',
      'pa': 'کریانہ تے جنرل سٹور',
      'sd': 'ڪريانا ۽ جنرل اسٽور',
      'ps': 'کریانه او عمومي دوکان',
      'en': 'Grocery / General Store'
    },
    tagline: {
      'ur': 'محلے کا بااعتماد راشن، دالیں، گھی اور روزمرہ خریداری',
      'ur-roman': 'Mohallay ka baa-aitimad grocery aur daily ration',
      'pa': 'گھر دا سودا سلف تے راشن',
      'sd': 'راشن ۽ روزانو سامان جو بااعتماد مرڪز',
      'ps': 'د کور باوري راشن او د ورځني توکو پلورنځی',
      'en': 'Trusted local provisions, grains & grocery store'
    },
    accentColor: '#0a5e54',
    secondaryColor: '#00f2ad',
    boardTheme: 'emerald',
    iconName: 'Store',
    bgSymbol: 'shopping-basket',
    tools: [
      { id: 'new_bill', name: { 'ur': 'نیا بل بنائیں', 'ur-roman': 'New Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'کھاتہ رجسٹر', 'ur-roman': 'Khata Ledger', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'udhaar', name: { 'ur': 'ادھار وصولی', 'ur-roman': 'Udhaar / Credit', 'pa': 'ادھار', 'sd': 'اوڌار', 'ps': 'پور', 'en': 'Udhaar' }, category: 'parties', icon: 'Coins', action: 'khata_udhaar' },
      { id: 'customers', name: { 'ur': 'گاہک لسٹ', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'products', name: { 'ur': 'پروڈکٹس و اشیاء', 'ur-roman': 'Products', 'pa': 'اشیاء', 'sd': 'شيون', 'ps': 'توکي', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'categories', name: { 'ur': 'کیٹیگریز (دالیں، گھی)', 'ur-roman': 'Categories', 'pa': 'کیٹیگریز', 'sd': 'قسم', 'ps': 'ډولونه', 'en': 'Categories' }, category: 'catalog', icon: 'Layers', action: 'categories' },
      { id: 'stock', name: { 'ur': 'گودام و سٹاک', 'ur-roman': 'Stock Check', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' }, category: 'catalog', icon: 'Package', action: 'stock' },
      { id: 'purchase', name: { 'ur': 'خریداری و مال آمد', 'ur-roman': 'Purchase Entry', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز و ڈیلرز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیلز ریکارڈ', 'ur-roman': 'Sales History', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'دکان کا خرچہ', 'ur-roman': 'Shop Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'daily_sales', name: { 'ur': 'روزانہ کیش و سیل', 'ur-roman': 'Daily Sales', 'pa': 'روزانہ سیل', 'sd': 'روزانو وڪرو', 'ps': 'ورځنی پلور', 'en': 'Daily Sales' }, category: 'finance', icon: 'Clock', action: 'daily_sales' },
      { id: 'low_stock', name: { 'ur': 'ختم ہونے والا مال', 'ur-roman': 'Low Stock Alert', 'pa': 'گھٹ سٹاک', 'sd': 'گهٽ اسٽاڪ', 'ps': 'کمه زېرمه', 'en': 'Low Stock' }, category: 'catalog', icon: 'AlertTriangle', action: 'low_stock', badge: 'Alert' },
      { id: 'profit_estimate', name: { 'ur': 'منافع کا تخمینہ', 'ur-roman': 'Profit Estimate', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit Estimate' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'مکمل رپورٹ و کھاتہ', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'barcode_scanner', name: { 'ur': 'بار کوڈ اسکینر', 'ur-roman': 'Barcode Scanner', 'pa': 'بار کوڈ', 'sd': 'بار ڪوڊ', 'ps': 'بارکوډ', 'en': 'Barcode Scan' }, category: 'special', icon: 'QrCode', action: 'scan_barcode' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  pharmacy: {
    id: 'pharmacy',
    name: {
      'ur': 'میڈیکل اسٹور و فارمیسی',
      'ur-roman': 'Medical Store / Pharmacy',
      'pa': 'میڈیکل سٹور تے دوائیاں',
      'sd': 'ميڊيڪل اسٽور ۽ فارميسي',
      'ps': 'د درملو دوکان او فارمیسي',
      'en': 'Medical Store / Pharmacy'
    },
    tagline: {
      'ur': 'حفظانِ صحت کے اصولوں پر ادویات، بیچ نمبر اور ایکسپائری مانیٹرنگ',
      'ur-roman': 'Certified Medicines, Batch Tracking & Expiry Alerts',
      'pa': 'اصلی دوائیاں تے حفظان صحت دا سامان',
      'sd': 'اصلي دوائون ۽ تاريخ ميعاد جي چڪاس',
      'ps': 'باوري درمل، بېچ ګڼه او د پای نېټې څارنه',
      'en': 'Quality medicines, batch tracking & prescription dispensary'
    },
    accentColor: '#0891b2',
    secondaryColor: '#67e8f9',
    boardTheme: 'cyan',
    iconName: 'Cross',
    bgSymbol: 'pill-capsule',
    tools: [
      { id: 'new_sale', name: { 'ur': 'نیا میڈیسن بل', 'ur-roman': 'New Medicine Sale', 'pa': 'دوائی بل', 'sd': 'دوائن جو بل', 'ps': 'د درملو بل', 'en': 'New Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'ڈاکٹر و گاہک کھاتہ', 'ur-roman': 'Medical Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'udhaar', name: { 'ur': 'ادھار دوائیاں', 'ur-roman': 'Medicine Udhaar', 'pa': 'ادھار', 'sd': 'اوڌار', 'ps': 'پور', 'en': 'Udhaar' }, category: 'parties', icon: 'Coins', action: 'khata_udhaar' },
      { id: 'customers', name: { 'ur': 'مریض و گاہک', 'ur-roman': 'Patients & Clients', 'pa': 'مریض', 'sd': 'مريض', 'ps': 'ناروغان', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'medicines', name: { 'ur': 'تمام ادویات فہرست', 'ur-roman': 'Medicines List', 'pa': 'دوائیاں', 'sd': 'دوائون', 'ps': 'درمل', 'en': 'Medicines' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'batch_no', name: { 'ur': 'بیچ نمبر مانیٹرنگ', 'ur-roman': 'Batch Number Tracking', 'pa': 'بیچ نمبر', 'sd': 'بيچ نمبر', 'ps': 'بېچ نمبر', 'en': 'Batch Numbers' }, category: 'catalog', icon: 'Layers', action: 'tool_modal:batch' },
      { id: 'expiry_date', name: { 'ur': 'ایکسپائری ڈیٹ مینیجر', 'ur-roman': 'Expiry Date Tracker', 'pa': 'ایکسپائری', 'sd': 'تاريخ ميعاد', 'ps': 'د پای نېټه', 'en': 'Expiry Dates' }, category: 'catalog', icon: 'Clock', action: 'tool_modal:expiry' },
      { id: 'expiry_alerts', name: { 'ur': 'قریب المرگ الرٹس', 'ur-roman': 'Near-Expiry Alerts', 'pa': 'ایکسپائر الرٹ', 'sd': 'الرٽ', 'ps': 'ګواښنه', 'en': 'Expiry Alerts' }, category: 'catalog', icon: 'AlertTriangle', action: 'tool_modal:expiry_alerts', badge: 'Warning' },
      { id: 'low_stock', name: { 'ur': 'کم سٹاک ادویات', 'ur-roman': 'Low Stock Medicines', 'pa': 'گھٹ سٹاک', 'sd': 'گهٽ اسٽاڪ', 'ps': 'کمه زېرمه', 'en': 'Low Stock' }, category: 'catalog', icon: 'AlertTriangle', action: 'low_stock' },
      { id: 'purchase', name: { 'ur': 'ڈسٹری بیوٹر خریداری', 'ur-roman': 'Distributor Purchase', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'فارما ڈسٹری بیوٹرز', 'ur-roman': 'Pharma Distributors', 'pa': 'ڈسٹری بیوٹر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'prescription_photo', name: { 'ur': 'نسخہ / پرچی کی تصویر', 'ur-roman': 'Prescription Photo', 'pa': 'نسخہ فوٹو', 'sd': 'نسخي فوٽو', 'ps': 'د نسخې انځور', 'en': 'Prescription Photo' }, category: 'special', icon: 'Camera', action: 'scan_receipt' },
      { id: 'sales', name: { 'ur': 'فروخت کا ریکارڈ', 'ur-roman': 'Sales Records', 'pa': 'سیل ریکارڈ', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'فارمیسی اخراجات', 'ur-roman': 'Pharmacy Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'reports', name: { 'ur': 'فارمیسی رپورٹس', 'ur-roman': 'Pharma Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  mobile: {
    id: 'mobile',
    name: {
      'ur': 'موبائل شاپ و اسیسریز',
      'ur-roman': 'Mobile & Accessories',
      'pa': 'موبائل شاپ تے سامان',
      'sd': 'موبائل ۽ لوازمات جو دڪان',
      'ps': 'د مبایل او اسبابو دوکان',
      'en': 'Mobile & Accessories'
    },
    tagline: {
      'ur': 'اسمارٹ فونز، وارنٹی، IMEI ریکارڈ اور جدید موبائل اسیسریز',
      'ur-roman': 'Smartphones, IMEI tracking, Warranties & Accessories',
      'pa': 'فون، چارجر، ہینڈز فری تے وارنٹی ریکارڈ',
      'sd': 'اسمارٽ فون ۽ تصديق ٿيل وارنٽي',
      'ps': 'سمارټ فونونه، IMEI ثبت او اصلي سامان',
      'en': 'Smartphones, IMEI warranty ledger & mobile accessories'
    },
    accentColor: '#2563eb',
    secondaryColor: '#60a5fa',
    boardTheme: 'blue',
    iconName: 'Smartphone',
    bgSymbol: 'smartphone-circuit',
    tools: [
      { id: 'new_sale', name: { 'ur': 'نیا موبائل بل', 'ur-roman': 'New Mobile Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'کھاتہ و اقساط', 'ur-roman': 'Khata / Installments', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک ریکارڈ', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'mobile_products', name: { 'ur': 'موبائل فونز لسٹ', 'ur-roman': 'Mobile Devices', 'pa': 'موبائل لسٹ', 'sd': 'موبائل لسٽ', 'ps': 'مبایلونه', 'en': 'Mobile Phones' }, category: 'catalog', icon: 'Smartphone', action: 'products' },
      { id: 'accessories', name: { 'ur': 'اسیسریز (چارجر، ہینڈزفری)', 'ur-roman': 'Accessories', 'pa': 'اسیسریز', 'sd': 'سامان', 'ps': 'لوازمات', 'en': 'Accessories' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'imei_serial', name: { 'ur': 'IMEI / سیریل نمبر تلاش', 'ur-roman': 'IMEI / Serial Lookup', 'pa': 'سیریل نمبر', 'sd': 'سيريل نمبر', 'ps': 'IMEI کتل', 'en': 'IMEI / Serial' }, category: 'special', icon: 'ScanLine', action: 'tool_modal:imei', badge: 'PTA/IMEI' },
      { id: 'brand_model', name: { 'ur': 'برانڈ و ماڈل فلٹر', 'ur-roman': 'Brand & Model', 'pa': 'برانڈ', 'sd': 'برانڊ', 'ps': 'برانډ', 'en': 'Brand / Model' }, category: 'catalog', icon: 'Layers', action: 'categories' },
      { id: 'warranty_record', name: { 'ur': 'وارنٹی کارڈ و ریکارڈ', 'ur-roman': 'Warranty Card Tracker', 'pa': 'وارنٹی', 'sd': 'وارنٽي', 'ps': 'وارنټي', 'en': 'Warranty' }, category: 'special', icon: 'ShieldCheck', action: 'tool_modal:warranty' },
      { id: 'purchase', name: { 'ur': 'ہول سیل مال خریداری', 'ur-roman': 'Wholesale Purchase', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز و امپورٹرز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales_history', name: { 'ur': 'سیل ہسٹری', 'ur-roman': 'Sales History', 'pa': 'سیل ہسٹری', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales History' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'دکان خرچہ', 'ur-roman': 'Shop Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'ماہانہ خالص منافع', 'ur-roman': 'Profit Reports', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'مکمل رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  clothing: {
    id: 'clothing',
    name: {
      'ur': 'کپڑے و گارمنٹس',
      'ur-roman': 'Clothing / Garments',
      'pa': 'کپڑے تے گارمنٹس',
      'sd': 'ڪپڙا ۽ گارمنٽس',
      'ps': 'کالي او د جامو دوکان',
      'en': 'Clothing & Garments'
    },
    tagline: {
      'ur': 'سائز، رنگ، فیبرک، برانڈ اور ریٹرن مینیجمنٹ کے ساتھ',
      'ur-roman': 'Apparel, Sizes, Fabric & Fashion Retail Ledger',
      'pa': 'سوٹ، ڈیزائن تے فیشن کپڑے',
      'sd': 'فئشن، ويس ۽ ريٽرن سسٽم',
      'ps': 'ښایسته جامې، اندازې او د تبادلې اسانتیا',
      'en': 'Apparel, size variants, fabric & fashion boutique'
    },
    accentColor: '#7c3aed',
    secondaryColor: '#c4b5fd',
    boardTheme: 'purple',
    iconName: 'Shirt',
    bgSymbol: 'clothing-hanger',
    tools: [
      { id: 'new_bill', name: { 'ur': 'نیا سوٹ / بیجک بل', 'ur-roman': 'New Garment Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'New Bill' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'کھاتہ رجسٹر', 'ur-roman': 'Khata Ledger', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'udhaar', name: { 'ur': 'ادھار بقایا', 'ur-roman': 'Udhaar / Balance', 'pa': 'ادھار', 'sd': 'اوڌار', 'ps': 'پور', 'en': 'Udhaar' }, category: 'parties', icon: 'Coins', action: 'khata_udhaar' },
      { id: 'customers', name: { 'ur': 'فیملی و گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'products', name: { 'ur': 'کپڑے و ملبوسات', 'ur-roman': 'Apparel Items', 'pa': 'کپڑے', 'sd': 'ڪپڙا', 'ps': 'جامې', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'size_color', name: { 'ur': 'سائز و رنگ (S, M, L, XL)', 'ur-roman': 'Size & Color Variants', 'pa': 'سائز', 'sd': 'ماپ ۽ رنگ', 'ps': 'اندازه او رنګ', 'en': 'Size & Color' }, category: 'catalog', icon: 'SlidersHorizontal', action: 'tool_modal:variants' },
      { id: 'returns_ready', name: { 'ur': 'تبادلہ و واپسی (Returns)', 'ur-roman': 'Return & Exchange', 'pa': 'واپسی', 'sd': 'واپسي', 'ps': 'بېرته ورکړه', 'en': 'Returns' }, category: 'special', icon: 'RotateCcw', action: 'tool_modal:returns' },
      { id: 'purchase', name: { 'ur': 'تھان و تیار مال خریداری', 'ur-roman': 'Fabric / Ready Stock', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'ملز و ہول سیلرز', 'ur-roman': 'Mills & Wholesalers', 'pa': 'ملز', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیل ہسٹری', 'ur-roman': 'Sales History', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'شاپ اخراجات', 'ur-roman': 'Shop Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  shoes: {
    id: 'shoes',
    name: {
      'ur': 'جوتے و فٹ ویئر',
      'ur-roman': 'Shoes & Footwear',
      'pa': 'جوتے تے سینڈل',
      'sd': 'بوٽ ۽ چپلن جو دڪان',
      'ps': 'د بوټانو دوکان',
      'en': 'Shoes & Footwear'
    },
    tagline: {
      'ur': 'مردانہ، زنانہ و بچگانہ جوتے، شو-باکس سائزنگ اور سٹاک مینجمنٹ',
      'ur-roman': 'Footwear, Shoe Sizes & Box Inventory Tracking',
      'pa': 'جوتے، سینڈل تے سائز دا مکمل حساب',
      'sd': 'معياري بوٽ ۽ چپلن جو مرڪز',
      'ps': 'د هر ډول بوټانو او چپلکو پلورنځی',
      'en': 'Footwear, shoe box size pairs & retail stock'
    },
    accentColor: '#d97706',
    secondaryColor: '#fde68a',
    boardTheme: 'amber',
    iconName: 'Package',
    bgSymbol: 'shoe-footwear',
    tools: [
      { id: 'new_bill', name: { 'ur': 'نیا جوتا بل', 'ur-roman': 'New Shoes Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'New Bill' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'products', name: { 'ur': 'جوتے و سینڈلز لسٹ', 'ur-roman': 'Shoes Catalog', 'pa': 'جوتے', 'sd': 'بوٽ لسٽ', 'ps': 'بوټان', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'shoe_sizes', name: { 'ur': 'شو سائز (39-45)', 'ur-roman': 'Shoe Sizes (39-45)', 'pa': 'سائز', 'sd': 'ماپ', 'ps': 'اندازه', 'en': 'Sizes' }, category: 'catalog', icon: 'SlidersHorizontal', action: 'tool_modal:variants' },
      { id: 'low_stock', name: { 'ur': 'کم سائز الرٹ', 'ur-roman': 'Low Size Stock', 'pa': 'گھٹ سٹاک', 'sd': 'گهٽ اسٽاڪ', 'ps': 'کمه زېرمه', 'en': 'Low Stock' }, category: 'catalog', icon: 'AlertTriangle', action: 'low_stock' },
      { id: 'purchase', name: { 'ur': 'فیکٹری مال خریداری', 'ur-roman': 'Factory Purchase', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیلز', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'خرچہ', 'ur-roman': 'Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  cosmetics: {
    id: 'cosmetics',
    name: {
      'ur': 'کاسمیٹکس و بیوٹی',
      'ur-roman': 'Cosmetics & Beauty',
      'pa': 'کاسمیٹکس تے میک اپ',
      'sd': 'ڪاسميٽڪس ۽ زيبائشي سامان',
      'ps': 'د سینګار توکو دوکان',
      'en': 'Cosmetics & Beauty Store'
    },
    tagline: {
      'ur': 'بیوٹی پراڈکٹس، شیڈز، اوریجنل برانڈز اور ایکسپائری ٹریکنگ',
      'ur-roman': 'Original Makeup, Shades, Skincare & Beauty Retail',
      'pa': 'میک اپ، پرفیوم تے خوبصورتی دا سامان',
      'sd': 'سونهن ۽ سينگار جو اصلي سامان',
      'ps': 'اصلي سینګار توکي او عطرونه',
      'en': 'Cosmetics, shade variants, beauty & skincare boutique'
    },
    accentColor: '#db2777',
    secondaryColor: '#fbcfe8',
    boardTheme: 'rose',
    iconName: 'Sparkles',
    bgSymbol: 'cosmetic-bottle',
    tools: [
      { id: 'new_sale', name: { 'ur': 'نیا بیوٹی بل', 'ur-roman': 'New Cosmetics Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'New Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک و بیوٹی پارلرز', 'ur-roman': 'Customers & Parlors', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'products', name: { 'ur': 'کاسمیٹکس پروڈکٹس', 'ur-roman': 'Beauty Products', 'pa': 'پروڈکٹس', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'shades', name: { 'ur': 'شیڈز و ویرینٹس', 'ur-roman': 'Shades & Variants', 'pa': 'شیڈز', 'sd': 'شيڊز', 'ps': 'رنګونه', 'en': 'Shades' }, category: 'catalog', icon: 'Palette', action: 'tool_modal:variants' },
      { id: 'expiry_check', name: { 'ur': 'ایکسپائری چیک', 'ur-roman': 'Expiry Date Check', 'pa': 'ایکسپائری', 'sd': 'تاريخ ميعاد', 'ps': 'د پای نېټه', 'en': 'Expiry Check' }, category: 'catalog', icon: 'Clock', action: 'tool_modal:expiry' },
      { id: 'low_stock', name: { 'ur': 'کم سٹاک الرٹ', 'ur-roman': 'Low Stock Alert', 'pa': 'گھٹ سٹاک', 'sd': 'گهٽ اسٽاڪ', 'ps': 'کمه زېرمه', 'en': 'Low Stock' }, category: 'catalog', icon: 'AlertTriangle', action: 'low_stock' },
      { id: 'purchase', name: { 'ur': 'ڈسٹری بیوٹر خریداری', 'ur-roman': 'Distributor Purchase', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'امپورٹرز و سپلائرز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیل', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'خرچہ', 'ur-roman': 'Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  furniture: {
    id: 'furniture',
    name: {
      'ur': 'فرنیچر و شو روم',
      'ur-roman': 'Furniture Showroom & Workshop',
      'pa': 'فرنیچر تے لکڑی دا کم',
      'sd': 'فرنيچر ۽ گهر جي سجاوٽ',
      'ps': 'د فرنیچر او کور سامان',
      'en': 'Furniture & Home Decor'
    },
    tagline: {
      'ur': 'صوفہ سیٹس، بیڈ روم، کسٹم آرڈرز، پیمائش اور بیعانہ / بقایا کھاتہ',
      'ur-roman': 'Custom Orders, Advance Payments, Measurements & Delivery Tracking',
      'pa': 'چنیوٹی فرنیچر، بیعانہ تے بقایا',
      'sd': 'فرنيچر ۽ بيلنس جي ريڪارڊنگ',
      'ps': 'ښکلي صوفې، کټونه او د فرمایشي کارونو حساب',
      'en': 'Showroom sets, custom carpentry orders, advance & delivery'
    },
    accentColor: '#92400e',
    secondaryColor: '#fcd34d',
    boardTheme: 'amber',
    iconName: 'Armchair',
    bgSymbol: 'furniture-chair',
    tools: [
      { id: 'new_order', name: { 'ur': 'نیا فرنیچر آرڈر', 'ur-roman': 'New Custom Order', 'pa': 'نواں آرڈر', 'sd': 'نئون آرڊر', 'ps': 'نوی فرمایش', 'en': 'New Order' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'advance_payment', name: { 'ur': 'بیعانہ و ایڈوانس وصولی', 'ur-roman': 'Advance Payment Entry', 'pa': 'بیعانہ', 'sd': 'بيانو', 'ps': 'بیعانه', 'en': 'Advance Payment' }, category: 'finance', icon: 'Coins', action: 'tool_modal:advance' },
      { id: 'remaining_payment', name: { 'ur': 'بقایا جات مانیٹرنگ', 'ur-roman': 'Remaining Balance', 'pa': 'بقایا', 'sd': 'بقايو', 'ps': 'پاتې پیسې', 'en': 'Remaining Payment' }, category: 'finance', icon: 'WalletCards', action: 'khata_udhaar' },
      { id: 'custom_order', name: { 'ur': 'کسٹم آرڈر و پیمائش', 'ur-roman': 'Measurements & Design', 'pa': 'پیمائش', 'sd': 'ماپ ۽ ڊيزائن', 'ps': 'اندازه او نقشه', 'en': 'Measurements' }, category: 'special', icon: 'Ruler', action: 'tool_modal:measurements', badge: 'Workshop' },
      { id: 'production_status', name: { 'ur': 'ورکشاپ پروڈکشن اسٹیٹس', 'ur-roman': 'Production Progress', 'pa': 'ورکشاپ کم', 'sd': 'ٺهڻ جي حالت', 'ps': 'د جوړېدو حالت', 'en': 'Production Status' }, category: 'special', icon: 'Hammer', action: 'tool_modal:production' },
      { id: 'delivery_status', name: { 'ur': 'ڈلیوری و روانگی اسٹیٹس', 'ur-roman': 'Delivery Status', 'pa': 'ڈلیوری', 'sd': 'روانگي حالت', 'ps': 'د سپارلو حالت', 'en': 'Delivery Status' }, category: 'special', icon: 'Truck', action: 'tool_modal:delivery' },
      { id: 'furniture_products', name: { 'ur': 'شو روم آئٹمز لسٹ', 'ur-roman': 'Showroom Inventory', 'pa': 'فرنیچر لسٹ', 'sd': 'فرنيچر سامان', 'ps': 'د شو روم سامان', 'en': 'Showroom Items' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'customers', name: { 'ur': 'گاہک ریکارڈ', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'khata', name: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'purchase', name: { 'ur': 'لکڑی، فوم و کپڑا خریداری', 'ur-roman': 'Wood, Foam & Fabric', 'pa': 'لکڑی سودا', 'sd': 'ڪاٺي ۽ فوم', 'ps': 'د لرګي او فوم پېرودنه', 'en': 'Raw Materials' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'لکڑی مارکیٹ سپلائرز', 'ur-roman': 'Timber Suppliers', 'pa': 'لکڑی والے', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'expenses', name: { 'ur': 'کاریگر مزدوری و خرچہ', 'ur-roman': 'Labor & Expenses', 'pa': 'مزدوری', 'sd': 'مزدوري ۽ خرچ', 'ps': 'د مزدورانو لګښت', 'en': 'Labor & Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  electronics: {
    id: 'electronics',
    name: {
      'ur': 'الیکٹرانکس و آلات',
      'ur-roman': 'Electronics & Appliances',
      'pa': 'الیکٹرانکس تے گھریلو آلات',
      'sd': 'اليڪٽرانڪس ۽ بجليءَ جو سامان',
      'ps': 'برېښنايي او کورني وسایل',
      'en': 'Electronics & Appliances'
    },
    tagline: {
      'ur': 'ایل ای ڈی، فریج، اے سی، مائیکروویو، سیریل نمبر اور وارنٹی سسٹم',
      'ur-roman': 'Home Appliances, Serial Track, Warranty & Retail Sales',
      'pa': 'فریج، واشنگ مشین تے ٹی وی دا کھاتہ',
      'sd': 'بجلي جا آلات ۽ وارنٽي ڪارڊ',
      'ps': 'یخچالونه، ټلویزیونونه او د وارنټي حساب',
      'en': 'Appliances, LED TVs, serial tracking & warranty ledger'
    },
    accentColor: '#1d4ed8',
    secondaryColor: '#93c5fd',
    boardTheme: 'blue',
    iconName: 'Tv',
    bgSymbol: 'circuit-board',
    tools: [
      { id: 'new_sale', name: { 'ur': 'نیا الیکٹرانکس بل', 'ur-roman': 'New Appliance Sale', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'New Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'serial_number', name: { 'ur': 'سیریل نمبر مانیٹرنگ', 'ur-roman': 'Serial Number Tracker', 'pa': 'سیریل نمبر', 'sd': 'سيريل نمبر', 'ps': 'سیریل ګڼه', 'en': 'Serial Numbers' }, category: 'special', icon: 'ScanLine', action: 'tool_modal:serial', badge: 'Warranty' },
      { id: 'warranty', name: { 'ur': 'وارنٹی اسٹیٹس', 'ur-roman': 'Warranty Claim / Record', 'pa': 'وارنٹی', 'sd': 'وارنٽي ريڪارڊ', 'ps': 'وارنټي ریکارډ', 'en': 'Warranty' }, category: 'special', icon: 'ShieldCheck', action: 'tool_modal:warranty' },
      { id: 'products', name: { 'ur': 'آلات لسٹ', 'ur-roman': 'Appliances List', 'pa': 'آلات', 'sd': 'سامان لسٽ', 'ps': 'وسایل', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'khata', name: { 'ur': 'کھاتہ و اقساط', 'ur-roman': 'Khata & Installments', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'purchase', name: { 'ur': 'کمپنی مال خریداری', 'ur-roman': 'Company Purchase', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز و ڈیلرز', 'ur-roman': 'Distributors', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیلز ہسٹری', 'ur-roman': 'Sales History', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'اخراجات', 'ur-roman': 'Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  hardware: {
    id: 'hardware',
    name: {
      'ur': 'ہارڈویئر و سینیٹری',
      'ur-roman': 'Hardware & Sanitary',
      'pa': 'ہارڈویئر تے سینیٹری سٹور',
      'sd': 'هارڊويئر ۽ سينيٽري اسٽور',
      'ps': 'د هارډویر او ودانیزو وسایلو دوکان',
      'en': 'Hardware, Tools & Sanitary'
    },
    tagline: {
      'ur': 'تعمیراتی اوزار، پائپ، فٹنگ، پینٹ، نٹ بولٹ اور کنسٹرکشن سامان',
      'ur-roman': 'Building Tools, Nuts/Bolts, Sanitary Pipes & Construction Supplies',
      'pa': 'تعمیراتی سامان، پائپ تے رنگ روغن',
      'sd': 'تعميراتي سامان ۽ اوزارن جو مرڪز',
      'ps': 'ودانیز وسایل، پائپونه او د رنګونو دوکان',
      'en': 'Tools, fasteners, pipes, sanitary fixtures & building supplies'
    },
    accentColor: '#475569',
    secondaryColor: '#cbd5e1',
    boardTheme: 'slate',
    iconName: 'Wrench',
    bgSymbol: 'tool-wrench',
    tools: [
      { id: 'new_bill', name: { 'ur': 'نیا ہارڈویئر بل', 'ur-roman': 'New Hardware Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'New Bill' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'کھاتہ رجسٹر', 'ur-roman': 'Khata Ledger', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'udhaar', name: { 'ur': 'ادھار ٹھیکیدار کھاتہ', 'ur-roman': 'Contractor Udhaar', 'pa': 'ٹھیکیدار ادھار', 'sd': 'ٺيڪيدار اوڌار', 'ps': 'د ټېکدار پور', 'en': 'Contractor Udhaar' }, category: 'parties', icon: 'Coins', action: 'khata_udhaar' },
      { id: 'customers', name: { 'ur': 'ٹھیکیدار و گاہک', 'ur-roman': 'Contractors & Clients', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'ټېکداران', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'products', name: { 'ur': 'اوزار و سینیٹری سامان', 'ur-roman': 'Tools & Hardware List', 'pa': 'سامان', 'sd': 'سامان لسٽ', 'ps': 'وسایل', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'units_check', name: { 'ur': 'یونٹس (فٹ، کلو، بنڈل)', 'ur-roman': 'Units (Ft, Kg, Bundle)', 'pa': 'یونٹس', 'sd': 'ايڪائيون', 'ps': 'واحدونه', 'en': 'Units' }, category: 'catalog', icon: 'Ruler', action: 'tool_modal:units' },
      { id: 'low_stock', name: { 'ur': 'کم سٹاک الرٹ', 'ur-roman': 'Low Stock Alert', 'pa': 'گھٹ سٹاک', 'sd': 'گهٽ اسٽاڪ', 'ps': 'کمه زېرمه', 'en': 'Low Stock' }, category: 'catalog', icon: 'AlertTriangle', action: 'low_stock' },
      { id: 'purchase', name: { 'ur': 'خریداری و مال آمد', 'ur-roman': 'Factory Purchase', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز و ملز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیل ہسٹری', 'ur-roman': 'Sales History', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'دکان اخراجات', 'ur-roman': 'Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  autoparts: {
    id: 'autoparts',
    name: {
      'ur': 'آٹو پارٹس و ورکشاپ',
      'ur-roman': 'Auto Parts & Workshop',
      'pa': 'آٹو پارٹس تے ورکشاپ',
      'sd': 'آٽو پارٽس ۽ ورڪشاپ',
      'ps': 'د موټر پرزو دوکان او ورکشاپ',
      'en': 'Auto Parts & Workshop'
    },
    tagline: {
      'ur': 'گاڑی، ماڈل، پارٹ نمبر، آئل فلٹر، انجن پرزہ جات اور گارنٹی ریکارڈ',
      'ur-roman': 'Vehicle Models, Part Numbers, Engine Spares & Mechanics Ledger',
      'pa': 'موٹر سائیکل تے کاراں دے پرزے',
      'sd': 'گاڏين جا اصلي پرزا ۽ آئل',
      'ps': 'د موټرونو اصلي پرزې او ورکشاپ حساب',
      'en': 'Spare parts, OEM part numbers, vehicle compatibility & garage ledger'
    },
    accentColor: '#dc2626',
    secondaryColor: '#fca5a5',
    boardTheme: 'red',
    iconName: 'Car',
    bgSymbol: 'auto-gear',
    tools: [
      { id: 'new_sale', name: { 'ur': 'نیا آٹو پارٹس بل', 'ur-roman': 'New Parts Sale', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'New Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'part_number', name: { 'ur': 'پارٹ نمبر و ماڈل تلاش', 'ur-roman': 'Part # & Model Lookup', 'pa': 'پارٹ نمبر', 'sd': 'پارٽ نمبر', 'ps': 'د پرزې نمبر', 'en': 'Part Number' }, category: 'special', icon: 'Search', action: 'tool_modal:part_number', badge: 'Lookup' },
      { id: 'vehicle_model', name: { 'ur': 'گاڑی ماڈل فلٹر', 'ur-roman': 'Vehicle Compatibility', 'pa': 'ماڈل', 'sd': 'گاڏي ماڊل', 'ps': 'د موټر موډل', 'en': 'Vehicle Model' }, category: 'catalog', icon: 'Car', action: 'categories' },
      { id: 'products', name: { 'ur': 'پرزہ جات انوینٹری', 'ur-roman': 'Spare Parts Inventory', 'pa': 'پرزے لسٹ', 'sd': 'پرزا لسٽ', 'ps': 'د پرزو زېرمه', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'khata', name: { 'ur': 'مکینکس کھاتہ', 'ur-roman': 'Mechanics & Fleet Khata', 'pa': 'مستری کھاتہ', 'sd': 'مستري کاتو', 'ps': 'د مستریانو پور', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک و مستری', 'ur-roman': 'Customers & Mechanics', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'purchase', name: { 'ur': 'امپورٹرز سے خریداری', 'ur-roman': 'Importer Purchase', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیل ہسٹری', 'ur-roman': 'Sales History', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'دکان خرچہ', 'ur-roman': 'Shop Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  restaurant: {
    id: 'restaurant',
    name: {
      'ur': 'ریسٹورنٹ و ہوٹل',
      'ur-roman': 'Restaurant & Hotel',
      'pa': 'ریسٹورنٹ تے ہوٹل',
      'sd': 'ريسٽورنٽ ۽ هوٽل',
      'ps': 'هوټل او د خوړو ځای',
      'en': 'Restaurant, Cafe & Hotel'
    },
    tagline: {
      'ur': 'کھانے کا مینو، ٹیبلز، کچن آرڈرز (KOT)، روزانہ سیل اور راشن خریداری',
      'ur-roman': 'Menu Items, Table Dine-in, Kitchen Order & Daily Hospitality Sales',
      'pa': 'مینو، ٹیبل تے کچن آرڈر',
      'sd': 'مزائدار کاڌا ۽ ميزن جو انتظام',
      'ps': 'خوندور خواړه، مېزونه او د اشپزخانې حساب',
      'en': 'Dine-in tables, kitchen orders, food menu & hospitality ledger'
    },
    accentColor: '#ea580c',
    secondaryColor: '#fdba74',
    boardTheme: 'orange',
    iconName: 'UtensilsCrossed',
    bgSymbol: 'restaurant-plate',
    tools: [
      { id: 'new_order', name: { 'ur': 'نیا فوڈ آرڈر / بل', 'ur-roman': 'New Dining Order', 'pa': 'آرڈر بل', 'sd': 'کاڌي جو بل', 'ps': 'د خوړو بل', 'en': 'New Order' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'menu_catalog', name: { 'ur': 'کھانوں کا مینو', 'ur-roman': 'Food Menu Catalog', 'pa': 'مینو', 'sd': 'مينيو', 'ps': 'د خوړو لړلیک', 'en': 'Food Menu' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'table_management', name: { 'ur': 'ٹیبلز اسٹیٹس (Dine-in)', 'ur-roman': 'Table Management', 'pa': 'ٹیبلز', 'sd': 'ميزن جو انتظام', 'ps': 'مېزونه', 'en': 'Tables' }, category: 'special', icon: 'Armchair', action: 'tool_modal:tables', badge: 'Dine-in' },
      { id: 'kot_ready', name: { 'ur': 'کچن آرڈر پرچی (KOT)', 'ur-roman': 'Kitchen Order Slip', 'pa': 'کچن پرچی', 'sd': 'ڪچن پرچي', 'ps': 'د پخلنځي پرچي', 'en': 'Kitchen Order' }, category: 'special', icon: 'Flame', action: 'tool_modal:kot' },
      { id: 'daily_sales', name: { 'ur': 'روزانہ نقد فروخت', 'ur-roman': 'Daily Cash Sales', 'pa': 'روزانہ سیل', 'sd': 'روزانو وڪرو', 'ps': 'ورځنی پلور', 'en': 'Daily Sales' }, category: 'finance', icon: 'Clock', action: 'daily_sales' },
      { id: 'purchase', name: { 'ur': 'گوشت و راشن خریداری', 'ur-roman': 'Kitchen Ingredients', 'pa': 'سبزی گوشت', 'sd': 'راشن خريداري', 'ps': 'د راشن پېرودنه', 'en': 'Raw Groceries' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'گوشت و سبزی سپلائرز', 'ur-roman': 'Food Suppliers', 'pa': 'سپلائر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'expenses', name: { 'ur': 'گیس، بجلی و ملازمین خرچہ', 'ur-roman': 'Utilities & Staff Expenses', 'pa': 'ملازم خرچہ', 'sd': 'گئس ۽ بجلي خرچ', 'ps': 'د برېښنا او کارکوونکو لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit_estimate', name: { 'ur': 'تخمینہ منافع', 'ur-roman': 'Profit Margin', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit Estimate' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  bakery: {
    id: 'bakery',
    name: {
      'ur': 'بیکری و سوئٹس',
      'ur-roman': 'Bakery & Sweets',
      'pa': 'بیکری تے مٹھیائی',
      'sd': 'بيڪري ۽ مٺائي',
      'ps': 'د بیکرۍ او خوږو دوکان',
      'en': 'Bakery & Confectionery'
    },
    tagline: {
      'ur': 'تازہ کیک، بسکٹ، پیسٹریز، مٹھائی، خام مال اور ضائع شدہ مال کا حساب',
      'ur-roman': 'Fresh Cakes, Sweets, Baking Ingredients & Waste Tracking',
      'pa': 'کیک، مٹھیائی تے تازہ بسکٹ',
      'sd': 'تازا ڪيڪ ۽ مٺايون',
      'ps': 'تازه کیکونه او خوندور خواږه',
      'en': 'Cakes, confectionery, raw ingredients & daily wastage control'
    },
    accentColor: '#d97706',
    secondaryColor: '#fef08a',
    boardTheme: 'amber',
    iconName: 'Cake',
    bgSymbol: 'bakery-croissant',
    tools: [
      { id: 'new_sale', name: { 'ur': 'نیا بیکری بل', 'ur-roman': 'New Bakery Sale', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'New Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'products', name: { 'ur': 'کیک و مٹھائی آئٹمز', 'ur-roman': 'Bakery Items', 'pa': 'بیکری سامان', 'sd': 'سامان لسٽ', 'ps': 'د کیکونو لړلیک', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'waste_adjustment', name: { 'ur': 'ضائع مال (Wastage / Return)', 'ur-roman': 'Wastage Adjustment', 'pa': 'ضائع مال', 'sd': 'زيان جو کاتو', 'ps': 'ضايع شوي توکي', 'en': 'Wastage' }, category: 'special', icon: 'Trash2', action: 'tool_modal:wastage', badge: 'Control' },
      { id: 'ingredients', name: { 'ur': 'میدہ، چینی، انڈے (خام مال)', 'ur-roman': 'Raw Ingredients', 'pa': 'میدہ تے چینی', 'sd': 'خام مال', 'ps': 'خام توکي', 'en': 'Ingredients' }, category: 'catalog', icon: 'Package', action: 'products' },
      { id: 'khata', name: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک و کیک بکنگ', 'ur-roman': 'Customers & Orders', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'purchase', name: { 'ur': 'خام مال خریداری', 'ur-roman': 'Flour, Sugar & Dairy', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز', 'ur-roman': 'Suppliers', 'pa': 'سپلائر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'expenses', name: { 'ur': 'اوون گیس و خرچہ', 'ur-roman': 'Oven Fuel & Utility', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  fruit_veg: {
    id: 'fruit_veg',
    name: {
      'ur': 'سبزی و فروٹ شاپ',
      'ur-roman': 'Fruit & Vegetable Shop',
      'pa': 'سبزی تے پھل دی دکان',
      'sd': 'سبزي ۽ ميون جو دڪان',
      'ps': 'د سبزیو او میوو دوکان',
      'en': 'Fresh Fruit & Vegetable Shop'
    },
    tagline: {
      'ur': 'تازہ سبزی، پھل، وزن، روزانہ منڈی بولی ریٹ، کرایہ گاڑی اور منافع',
      'ur-roman': 'Daily Mandi Auction, Weight, Wastage, Rates & Fresh Produce',
      'pa': 'تازہ سبزی، فروٹ تے روز دا ریٹ',
      'sd': 'تازيون ڀاڄيون، ميوا ۽ منڊي اگهه',
      'ps': 'تازه میوې او سبزی، د منډۍ ورځنی نرخ',
      'en': 'Farm fresh produce, scale weights & daily wholesale auction ledger'
    },
    accentColor: '#16a34a',
    secondaryColor: '#86efac',
    boardTheme: 'emerald',
    iconName: 'Apple',
    bgSymbol: 'fruit-apple',
    tools: [
      { id: 'daily_purchase', name: { 'ur': 'روزانہ منڈی خریداری', 'ur-roman': 'Mandi Morning Purchase', 'pa': 'منڈی خریداری', 'sd': 'منڊي خريداري', 'ps': 'د منډۍ پېرودنه', 'en': 'Mandi Purchase' }, category: 'core', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'daily_sale', name: { 'ur': 'روزانہ دکان سیل', 'ur-roman': 'Daily Shop Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Daily Sales' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'daily_mandi_hisaab', name: { 'ur': 'روزانہ منڈی حساب کتاب', 'ur-roman': 'Daily Mandi Hisaab', 'pa': 'منڈی حساب', 'sd': 'منڊي جو ليکو', 'ps': 'د منډۍ حساب', 'en': 'Mandi Hisaab' }, category: 'special', icon: 'Calculator', action: 'tool_modal:mandi_hisaab', badge: 'Mandi' },
      { id: 'weight_scale', name: { 'ur': 'وزن و دھڑی ریٹ (Kg / Dhaari)', 'ur-roman': 'Weight & Rates', 'pa': 'وزن ریٹ', 'sd': 'وزن ۽ اگھ', 'ps': 'وزن او نرخ', 'en': 'Weight & Rates' }, category: 'catalog', icon: 'Scale', action: 'tool_modal:weight' },
      { id: 'transport_labour', name: { 'ur': 'گاڑی کرایہ و مزدوری', 'ur-roman': 'Freight & Labour Cost', 'pa': 'کرایہ تے پلے دار', 'sd': 'ڀاڙو ۽ مزدوري', 'ps': 'کرايه او مزدوري', 'en': 'Transport & Labour' }, category: 'finance', icon: 'Truck', action: 'expenses' },
      { id: 'khata', name: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک و ہوٹل', 'ur-roman': 'Customers & Hotels', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'suppliers', name: { 'ur': 'منڈی آڑھتی و سپلائرز', 'ur-roman': 'Commission Agents', 'pa': 'آڑھتی', 'sd': 'آڙھتي', 'ps': 'د منډۍ آړتيان', 'en': 'Suppliers' }, category: 'parties', icon: 'Users', action: 'suppliers' },
      { id: 'profit_estimate', name: { 'ur': 'آج کا خالص منافع', 'ur-roman': 'Today Estimated Profit', 'pa': 'منافع', 'sd': 'اڄوڪو فائدو', 'ps': 'د نن ګټه', 'en': 'Profit Estimate' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  mandi: {
    id: 'mandi',
    name: {
      'ur': 'منڈی و ہول سیل مارکیٹ',
      'ur-roman': 'Mandi / Wholesale Market',
      'pa': 'غلہ و سبزی منڈی / ہول سیل',
      'sd': 'منڊي ۽ ٿوڪ مارڪيٽ',
      'ps': 'منډۍ او عمده مارکېټ',
      'en': 'Mandi / Wholesale Market'
    },
    tagline: {
      'ur': 'بوری و پیٹی، کاٹ کٹوتی، نیلامی بولی، کمیشن، باردانہ اور فریقین کھاتہ',
      'ur-roman': 'Auction Boli, Bag/Crate Count, Katoti, Arhat & Party Khata',
      'pa': 'منڈی بولی، بوری دا وزن تے آڑھت',
      'sd': 'ٻوريون، ڪٽوتي ۽ منڊي بيجڪ',
      'ps': 'د بوریو شمېر، کټوټي او د بولۍ لیږد',
      'en': 'Commodity auctions, deduction weighing, bags & commission trade'
    },
    accentColor: '#b45309',
    secondaryColor: '#fde047',
    boardTheme: 'amber',
    iconName: 'Package',
    bgSymbol: 'mandi-scale',
    tools: [
      { id: 'new_mandi_bill', name: { 'ur': 'نیا منڈی بیجک / بل', 'ur-roman': 'New Mandi Bijak', 'pa': 'نواں بیجک', 'sd': 'نئون بيجڪ', 'ps': 'د منډۍ بل', 'en': 'New Bijak' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'mandi_hisaab', name: { 'ur': 'روزانہ منڈی حساب (بیچک)', 'ur-roman': 'Daily Mandi Hisaab', 'pa': 'منڈی حساب', 'sd': 'منڊي حساب', 'ps': 'د منډۍ حساب', 'en': 'Daily Mandi Hisaab' }, category: 'special', icon: 'Calculator', action: 'tool_modal:mandi_hisaab', badge: 'Primary' },
      { id: 'katoti_weight', name: { 'ur': 'وزن، بوری و کاٹ کٹوتی', 'ur-roman': 'Katoti & Crate Deductions', 'pa': 'کاٹ کٹوتی', 'sd': 'ڪٽوتي ۽ ٻوريون', 'ps': 'کټوټي او بوجۍ', 'en': 'Katoti & Weight' }, category: 'catalog', icon: 'Scale', action: 'tool_modal:weight' },
      { id: 'parties_khata', name: { 'ur': 'پارٹیاں و بیوپاری کھاتہ', 'ur-roman': 'Parties & Traders Khata', 'pa': 'پارٹیاں کھاتہ', 'sd': 'ڌرين جو کاتو', 'ps': 'د سوداګرو حساب', 'en': 'Parties Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'commission_arhat', name: { 'ur': 'کمیشن و دلالی حساب', 'ur-roman': 'Commission / Arhat %', 'pa': 'آڑھت', 'sd': 'دلالي', 'ps': 'کمیشن', 'en': 'Commission' }, category: 'finance', icon: 'Coins', action: 'tool_modal:commission' },
      { id: 'transport_labour', name: { 'ur': 'ٹرانسپورٹ و پلے داری', 'ur-roman': 'Transport & Labour', 'pa': 'پلے دار خرچہ', 'sd': 'ڀاڙو ۽ پلي داري', 'ps': 'کرايه او مزدور', 'en': 'Freight & Labour' }, category: 'finance', icon: 'Truck', action: 'expenses' },
      { id: 'purchase', name: { 'ur': 'آمد مال / خریداری', 'ur-roman': 'Arrivals / Purchases', 'pa': 'آمد مال', 'sd': 'مال آمد', 'ps': 'د مال راتګ', 'en': 'Arrivals' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'زمیندار و سپلائرز', 'ur-roman': 'Growers & Suppliers', 'pa': 'زمیندار', 'sd': 'زميندار', 'ps': 'کروندګر', 'en': 'Growers' }, category: 'parties', icon: 'Users', action: 'suppliers' },
      { id: 'profit_loss', name: { 'ur': 'روزانہ نفع و نقصان', 'ur-roman': 'Profit & Loss', 'pa': 'نفع نقصان', 'sd': 'نفعو ۽ نقصان', 'ps': 'ګټه او تاوان', 'en': 'Profit & Loss' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'منڈی رپورٹس', 'ur-roman': 'Mandi Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  commission: {
    id: 'commission',
    name: {
      'ur': 'کمیشن و دلالی',
      'ur-roman': 'Commission & Brokerage',
      'pa': 'کمیشن تے دلال دا اڈہ',
      'sd': 'ڪميشن ۽ دلالي',
      'ps': 'کمیشن او دلالي دفتر',
      'en': 'Commission & Brokerage Deals'
    },
    tagline: {
      'ur': 'تجارتی سودے، فریقین، کمیشن ریٹ، وصولی اور زیرِ التواء ادائیگیاں',
      'ur-roman': 'Deal Settlements, Both Parties, Commission % & Receivables',
      'pa': 'سودے، کمیشن ریٹ تے وصولی',
      'sd': 'سودا، ڌريون ۽ ڪميشن واوچر',
      'ps': 'سوداګریز تړونونه او د کمیشن حساب',
      'en': 'Commercial trade brokerage, dual party settlement & fees ledger'
    },
    accentColor: '#0284c7',
    secondaryColor: '#7dd3fc',
    boardTheme: 'cyan',
    iconName: 'Scale',
    bgSymbol: 'commission-handshake',
    tools: [
      { id: 'new_deal', name: { 'ur': 'نیا تجارتی سودا / واؤچر', 'ur-roman': 'New Deal Voucher', 'pa': 'سودا واؤچر', 'sd': 'نئون سودو', 'ps': 'نوې معامله', 'en': 'New Deal' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'parties', name: { 'ur': 'خریدار و فروخت کنندہ پارٹیاں', 'ur-roman': 'Buyer & Seller Parties', 'pa': 'پارٹیاں', 'sd': 'ڌريون', 'ps': 'دواړه لوري', 'en': 'Both Parties' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'commission_rate', name: { 'ur': 'کمیشن ریٹ (%) و رقم', 'ur-roman': 'Commission Rate & Amount', 'pa': 'کمیشن ریٹ', 'sd': 'ڪميشن شرح', 'ps': 'د کمیشن سلنه', 'en': 'Commission %' }, category: 'special', icon: 'Coins', action: 'tool_modal:commission', badge: 'Rate' },
      { id: 'pending_commission', name: { 'ur': 'بقایا کمیشن وصولی', 'ur-roman': 'Pending Commission', 'pa': 'بقایا کمیشن', 'sd': 'بقايو ڪميشن', 'ps': 'پاتې کمیشن', 'en': 'Pending Fees' }, category: 'finance', icon: 'Clock', action: 'khata_udhaar' },
      { id: 'transactions', name: { 'ur': 'سودے و لین دین', 'ur-roman': 'Transactions Record', 'pa': 'لین دین', 'sd': 'ٽرانزيڪشن', 'ps': 'راکړه ورکړه', 'en': 'Deals' }, category: 'catalog', icon: 'Layers', action: 'sales_history' },
      { id: 'khata', name: { 'ur': 'پارٹی کھاتہ', 'ur-roman': 'Party Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'expenses', name: { 'ur': 'دفتر خرچہ', 'ur-roman': 'Office Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'daily_commission', name: { 'ur': 'روزانہ و ماہانہ کمیشن', 'ur-roman': 'Daily / Monthly Commission', 'pa': 'ماہانہ کمیشن', 'sd': 'مھيني جي ڪميشن', 'ps': 'میاشتنی کمیشن', 'en': 'Monthly Commission' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  transport: {
    id: 'transport',
    name: {
      'ur': 'ٹرانسپورٹ و مال برداری',
      'ur-roman': 'Transport & Logistics',
      'pa': 'ٹرانسپورٹ تے اڈہ',
      'sd': 'ٽرانسپورٽ ۽ مال برداري',
      'ps': 'ټرانسپورټ او بار وړل',
      'en': 'Transport & Logistics'
    },
    tagline: {
      'ur': 'گاڑیاں، ڈرائیور، بلٹی انوائس، ڈیزل خرچہ، ٹرپ کرایہ اور فی ٹرپ منافع',
      'ur-roman': 'Fleet Vehicles, Drivers, Bilti Invoices, Fuel & Trip Profit',
      'pa': 'ٹرک، ڈرائیور، ڈیزل تے کرایہ',
      'sd': 'گاڏيون، ڊيزل ۽ ٽرپ ڀاڙو',
      'ps': 'موټر، ډریوران، تېل او د ټرپ ګټه',
      'en': 'Fleet management, bilti receipts, drivers, fuel & trip profits'
    },
    accentColor: '#334155',
    secondaryColor: '#94a3b8',
    boardTheme: 'slate',
    iconName: 'Truck',
    bgSymbol: 'transport-truck',
    tools: [
      { id: 'new_bilti', name: { 'ur': 'نئی بلٹی / ٹرپ انوائس', 'ur-roman': 'New Bilti / Trip Invoice', 'pa': 'نئی بلٹی', 'sd': 'نئين بلٽي', 'ps': 'نوې بلټي', 'en': 'New Bilti' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'trip_entry', name: { 'ur': 'ٹرپ اندراج و روٹ', 'ur-roman': 'Trip Entry & Route', 'pa': 'ٹرپ اندراج', 'sd': 'ٽرپ داخل ڪريو', 'ps': 'د ټرپ ثبت', 'en': 'Trip Entry' }, category: 'special', icon: 'Navigation', action: 'tool_modal:trip', badge: 'Trip' },
      { id: 'vehicles', name: { 'ur': 'گاڑیاں و ٹرک لسٹ', 'ur-roman': 'Fleet Vehicles', 'pa': 'گاڑیاں', 'sd': 'گاڏيون لسٽ', 'ps': 'موټران', 'en': 'Vehicles' }, category: 'catalog', icon: 'Truck', action: 'products' },
      { id: 'drivers', name: { 'ur': 'ڈرائیورز و تنخواہ', 'ur-roman': 'Drivers & Salaries', 'pa': 'ڈرائیور', 'sd': 'ڊرائيور', 'ps': 'ډریوران', 'en': 'Drivers' }, category: 'parties', icon: 'Users', action: 'tool_modal:drivers' },
      { id: 'fuel_expenses', name: { 'ur': 'ڈیزل و پٹرول خرچہ', 'ur-roman': 'Diesel & Fuel Expenses', 'pa': 'ڈیزل خرچہ', 'sd': 'ڊيزل خرچ', 'ps': 'د تېلو لګښت', 'en': 'Fuel Expenses' }, category: 'finance', icon: 'Flame', action: 'expenses' },
      { id: 'shippers_khata', name: { 'ur': 'پارٹیاں و کرایہ کھاتہ', 'ur-roman': 'Shippers & Parties Khata', 'pa': 'کرایہ کھاتہ', 'sd': 'ڀاڙي جو کاتو', 'ps': 'د کرایې حساب', 'en': 'Freight Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'trip_history', name: { 'ur': 'ٹرپ ہسٹری و ریکارڈ', 'ur-roman': 'Trip History', 'pa': 'ٹرپ ہسٹری', 'sd': 'ٽرپ هسٽري', 'ps': 'د ټرپونو تاریخ', 'en': 'Trip History' }, category: 'catalog', icon: 'Layers', action: 'sales_history' },
      { id: 'trip_profit', name: { 'ur': 'فی ٹرپ نفع نقصان', 'ur-roman': 'Profit per Trip', 'pa': 'ٹرپ منافع', 'sd': 'ٽرپ منافعو', 'ps': 'د ټرپ ګټه', 'en': 'Profit per Trip' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'ماہانہ لاجسٹکس رپورٹ', 'ur-roman': 'Monthly Report', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  dairy: {
    id: 'dairy',
    name: {
      'ur': 'ڈیری و دودھ دہی',
      'ur-roman': 'Dairy & Milk Shop',
      'pa': 'ڈیری تے کھیر مکھن',
      'sd': 'ڊيري ۽ کير ڏهي',
      'ps': 'ډیري او د شیدو دوکان',
      'en': 'Dairy & Fresh Milk Shop'
    },
    tagline: {
      'ur': 'روزانہ دودھ وصولی، فیٹ چکنائی، دہی، مکھن، گھرانوں کا کھاتہ اور حساب',
      'ur-roman': 'Fresh Milk Collection, Fat %, Yogurt & Household Daily Khata',
      'pa': 'کھیر، دہی، مکھن تے گھراں دا کھاتہ',
      'sd': 'کير وصولي، مکڻ ۽ روزانو کاتو',
      'ps': 'تازه شیدې، مستې، غوړي او کورنی حساب',
      'en': 'Fresh milk collection, fat percentage testing & household milk ledger'
    },
    accentColor: '#0284c7',
    secondaryColor: '#bae6fd',
    boardTheme: 'cyan',
    iconName: 'Store',
    bgSymbol: 'dairy-bottle',
    tools: [
      { id: 'milk_collection', name: { 'ur': 'دودھ وصولی (صبح / شام)', 'ur-roman': 'Milk Collection (Morning/Eve)', 'pa': 'کھیر وصولی', 'sd': 'کير وصولي', 'ps': 'د شیدو راټولول', 'en': 'Milk Collection' }, category: 'special', icon: 'Layers', action: 'tool_modal:milk_collection', badge: 'Daily' },
      { id: 'milk_sale', name: { 'ur': 'دودھ و دہی پرچی / سیل', 'ur-roman': 'Milk & Yogurt Sale', 'pa': 'کھیر پرچی', 'sd': 'کير وڪرو پرچي', 'ps': 'د شیدو پلور', 'en': 'Milk Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'fat_percentage', name: { 'ur': 'چکنائی (Fat %) ٹیسٹ', 'ur-roman': 'Fat % & LR Testing', 'pa': 'فیٹ ٹیسٹ', 'sd': 'فيٽ ٽيسٽ', 'ps': 'د غوړوالي سلنه', 'en': 'Fat %' }, category: 'special', icon: 'Scale', action: 'tool_modal:fat' },
      { id: 'products', name: { 'ur': 'دودھ، دہی، مکھن، پنیر', 'ur-roman': 'Dairy Products Catalog', 'pa': 'ڈیری سامان', 'sd': 'ڊيري شيون', 'ps': 'د شیدو توکي', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'households_khata', name: { 'ur': 'گھرانوں کا ماہانہ کھاتہ', 'ur-roman': 'Households Monthly Khata', 'pa': 'گھراں دا کھاتہ', 'sd': 'گهرن جو کاتو', 'ps': 'د کورونو میاشتنی پور', 'en': 'Households' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'suppliers', name: { 'ur': 'گوالے و ڈیری فارمز', 'ur-roman': 'Milkmen & Farms', 'pa': 'گوالے', 'sd': 'کير سپلائر', 'ps': 'مالداران', 'en': 'Milkmen' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'daily_hisaab', name: { 'ur': 'روزانہ ڈیری حساب کتاب', 'ur-roman': 'Daily Dairy Ledger', 'pa': 'روزانہ حساب', 'sd': 'روزانو حساب', 'ps': 'ورځنی حساب', 'en': 'Daily Ledger' }, category: 'finance', icon: 'Calculator', action: 'tool_modal:daily_hisaab' },
      { id: 'expenses', name: { 'ur': 'ڈیری اخراجات و برف', 'ur-roman': 'Ice, Utilities & Expenses', 'pa': 'برف خرچہ', 'sd': 'برف ۽ خرچ', 'ps': 'د یخ او هټۍ لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  meat_shop: {
    id: 'meat_shop',
    name: {
      'ur': 'میٹ شاپ و گوشت کی دکان',
      'ur-roman': 'Meat Shop & Butcher',
      'pa': 'گوشت دی دکان تے قصاب',
      'sd': 'گوشت جو دڪان ۽ قصاب',
      'ps': 'د غوښې دوکان او قصابي',
      'en': 'Meat Shop & Butcher'
    },
    tagline: {
      'ur': 'مرغی، بکرے، بچھیا کا گوشت، زندہ و صافی وزن اور کٹوتی کا روزانہ حساب',
      'ur-roman': 'Chicken, Mutton, Beef, Live vs Dressed Weight & Butcher Ledger',
      'pa': 'مرغی، بکرے تے گائے دا صاف ستھرا گوشت',
      'sd': 'تازو ڪڪڙ ۽ ڳئون جو گوشت',
      'ps': 'د چرګانو او پسونو تازه غوښه',
      'en': 'Fresh chicken, mutton, beef cuts & daily dressed weight ledger'
    },
    accentColor: '#be123c',
    secondaryColor: '#fecdd3',
    boardTheme: 'red',
    iconName: 'UtensilsCrossed',
    bgSymbol: 'meat-cleaver',
    tools: [
      { id: 'new_meat_bill', name: { 'ur': 'نیا گوشت بل / پرچی', 'ur-roman': 'New Meat Cash Bill', 'pa': 'گوشت بل', 'sd': 'گوشت جي پرچي', 'ps': 'د غوښې پرچي', 'en': 'New Sale' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'live_vs_dressed', name: { 'ur': 'زندہ بمقابلہ کٹا وزن', 'ur-roman': 'Live vs Dressed Weight', 'pa': 'زندہ وزن', 'sd': 'جيئرو بمقابله صاف وزن', 'ps': 'ژوندی او پاک شوی وزن', 'en': 'Live vs Dressed' }, category: 'special', icon: 'Scale', action: 'tool_modal:meat_weight', badge: 'Weight' },
      { id: 'meat_products', name: { 'ur': 'مرغی، مٹن، بیف، مچھلی', 'ur-roman': 'Meat Types & Cuts', 'pa': 'گوشت اقسام', 'sd': 'گوشت جا قسم', 'ps': 'د غوښې ډولونه', 'en': 'Meat Types' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'waste_adjustment', name: { 'ur': 'چربی و ہڈی کٹوتی (Waste)', 'ur-roman': 'Fat & Bone Deduction', 'pa': 'کٹوتی', 'sd': 'ڪٽوتي ۽ زيان', 'ps': 'کټوټي او ضایعات', 'en': 'Deductions' }, category: 'special', icon: 'Trash2', action: 'tool_modal:wastage' },
      { id: 'khata', name: { 'ur': 'ہوٹل و کیٹرنگ کھاتہ', 'ur-roman': 'Hotels & Regular Khata', 'pa': 'ہوٹل کھاتہ', 'sd': 'هوٽل کاتو', 'ps': 'د هوټلونو پور', 'en': 'Hotels Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'customers', name: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'purchase', name: { 'ur': 'مرغی فارم و منڈی مویشی خریداری', 'ur-roman': 'Farm / Livestock Purchase', 'pa': 'جانور خریداری', 'sd': 'مال خريداري', 'ps': 'د څارویو پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'پولٹری و کیٹل سپلائرز', 'ur-roman': 'Poultry & Cattle Suppliers', 'pa': 'سپلائر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'daily_hisaab', name: { 'ur': 'روزانہ گوشت حساب کتاب', 'ur-roman': 'Daily Butcher Ledger', 'pa': 'روزانہ حساب', 'sd': 'روزانو حساب', 'ps': 'ورځنی حساب', 'en': 'Daily Ledger' }, category: 'finance', icon: 'Calculator', action: 'tool_modal:daily_hisaab' },
      { id: 'expenses', name: { 'ur': 'برف، بجلی و شاپ خرچہ', 'ur-roman': 'Shop Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  online_business: {
    id: 'online_business',
    name: {
      'ur': 'آن لائن و واٹس ایپ سیلر',
      'ur-roman': 'Online & WhatsApp Seller',
      'pa': 'آن لائن تے واٹس ایپ دکان',
      'sd': 'آن لائين ۽ واٽس ايپ سيلر',
      'ps': 'آنلاین او واټس اپ پلورونکی',
      'en': 'Online & WhatsApp Seller'
    },
    tagline: {
      'ur': 'واٹس ایپ آرڈرز، پارسل ڈیلیوری اسٹیٹس، کیش آن ڈیلیوری (COD) اور پروڈکٹ فوٹوز',
      'ur-roman': 'WhatsApp Orders, Courier COD, Tracking & Social Selling',
      'pa': 'واٹس ایپ آرڈر تے کیش آن ڈلیوری',
      'sd': 'آن لائين آرڊر ۽ سي او ڊي وصولي',
      'ps': 'د واټس اپ سپارښتنې او د کور پر مخ پیسې ورکړه',
      'en': 'Social commerce, WhatsApp orders, courier COD settlements & catalog'
    },
    accentColor: '#059669',
    secondaryColor: '#a7f3d0',
    boardTheme: 'emerald',
    iconName: 'Globe',
    bgSymbol: 'online-cart',
    tools: [
      { id: 'new_order', name: { 'ur': 'نیا واٹس ایپ آرڈر', 'ur-roman': 'New WhatsApp Order', 'pa': 'نواں آرڈر', 'sd': 'نئون آرڊر', 'ps': 'نوې سپارښتنه', 'en': 'New Order' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'order_status', name: { 'ur': 'آرڈر اسٹیٹس (پیکنگ، روانہ)', 'ur-roman': 'Order Processing Status', 'pa': 'آرڈر اسٹیٹس', 'sd': 'آرڊر جي حالت', 'ps': 'د سپارښتنې حالت', 'en': 'Order Status' }, category: 'special', icon: 'Layers', action: 'tool_modal:order_status', badge: 'Dispatch' },
      { id: 'cod_tracking', name: { 'ur': 'کیش آن ڈیلیوری (COD) بقایا', 'ur-roman': 'Courier COD Tracking', 'pa': 'سی او ڈی پیسے', 'sd': 'سي او ڊي وصولي', 'ps': 'د COD پیسې', 'en': 'COD Tracking' }, category: 'special', icon: 'Clock', action: 'tool_modal:cod', badge: 'COD' },
      { id: 'product_photos', name: { 'ur': 'پروڈکٹ کیمرہ تصویر', 'ur-roman': 'Product Photo Capture', 'pa': 'فوٹو', 'sd': 'تصوير', 'ps': 'انځور اخیستل', 'en': 'Product Photos' }, category: 'special', icon: 'Camera', action: 'product_photo' },
      { id: 'products', name: { 'ur': 'آن لائن کیٹلاگ', 'ur-roman': 'Online Catalog', 'pa': 'کیٹلاگ', 'sd': 'ڪيٽلاگ', 'ps': 'لړلیک', 'en': 'Catalog' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'customers', name: { 'ur': 'آن لائن گاہک لسٹ', 'ur-roman': 'Online Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'khata', name: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'purchase', name: { 'ur': 'سورسنگ مال خریداری', 'ur-roman': 'Wholesale Stock Sourcing', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سورسنگ ہول سیلرز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'expenses', name: { 'ur': 'پیکنگ و کوریئر اخراجات', 'ur-roman': 'Packaging & Shipping Fees', 'pa': 'ڈلیوری خرچہ', 'sd': 'پيڪنگ خرچ', 'ps': 'د استولو لګښت', 'en': 'Courier Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'profit', name: { 'ur': 'منافع', 'ur-roman': 'Profit', 'pa': 'منافع', 'sd': 'فائدو', 'ps': 'ګټه', 'en': 'Profit' }, category: 'finance', icon: 'PieChart', action: 'profit_report' },
      { id: 'reports', name: { 'ur': 'رپورٹس', 'ur-roman': 'Reports', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  },

  other: {
    id: 'other',
    name: {
      'ur': 'دیگر کاروبار و سروسز',
      'ur-roman': 'Other Business & Services',
      'pa': 'ہور کاروبار تے خدمات',
      'sd': 'ٻيا ڪاروبار ۽ خدمتون',
      'ps': 'نور کاروبارونه او چوپړونه',
      'en': 'General Business & Services'
    },
    tagline: {
      'ur': 'کسٹمائزڈ بلنگ، کسٹمر کھاتہ، ادھار، اشیاء، اخراجات اور اے آئی منشی',
      'ur-roman': 'Customized Billing, Ledger, Udhaar, Expenses & Reports',
      'pa': 'بل، کھاتہ، اشیاء تے منافع',
      'sd': 'بل، کاتو ۽ نفعي جو حساب',
      'ps': 'بل، حساب، توکي او د ګټې لړلیک',
      'en': 'Customized ledger, invoices, inventory & multi-language AI office'
    },
    accentColor: '#475569',
    secondaryColor: '#94a3b8',
    boardTheme: 'slate',
    iconName: 'Store',
    bgSymbol: 'general-store',
    tools: [
      { id: 'new_bill', name: { 'ur': 'نیا بل بنائیں', 'ur-roman': 'New Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, category: 'core', icon: 'Receipt', action: 'billing' },
      { id: 'khata', name: { 'ur': 'کھاتہ رجسٹر', 'ur-roman': 'Khata Ledger', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'حساب', 'en': 'Khata' }, category: 'parties', icon: 'BookOpen', action: 'khata' },
      { id: 'udhaar', name: { 'ur': 'ادھار وصولی', 'ur-roman': 'Udhaar / Credit', 'pa': 'ادھار', 'sd': 'اوڌار', 'ps': 'پور', 'en': 'Udhaar' }, category: 'parties', icon: 'Coins', action: 'khata_udhaar' },
      { id: 'customers', name: { 'ur': 'گاہک لسٹ', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }, category: 'parties', icon: 'Users', action: 'customers' },
      { id: 'products', name: { 'ur': 'پروڈکٹس و سروسز', 'ur-roman': 'Products & Services', 'pa': 'اشیاء', 'sd': 'شيون', 'ps': 'توکي', 'en': 'Products' }, category: 'catalog', icon: 'Boxes', action: 'products' },
      { id: 'purchase', name: { 'ur': 'خریداری و انوائس', 'ur-roman': 'Purchases', 'pa': 'خریداری', 'sd': 'خريداري', 'ps': 'پېرودنه', 'en': 'Purchase' }, category: 'finance', icon: 'ShoppingBag', action: 'purchases' },
      { id: 'suppliers', name: { 'ur': 'سپلائرز', 'ur-roman': 'Suppliers', 'pa': 'ڈیلر', 'sd': 'سپلائر', 'ps': 'ویشونکي', 'en': 'Suppliers' }, category: 'parties', icon: 'Truck', action: 'suppliers' },
      { id: 'sales', name: { 'ur': 'سیلز ریکارڈ', 'ur-roman': 'Sales Records', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' }, category: 'finance', icon: 'TrendingUp', action: 'sales_history' },
      { id: 'expenses', name: { 'ur': 'کاروباری اخراجات', 'ur-roman': 'Business Expenses', 'pa': 'خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Expenses' }, category: 'finance', icon: 'WalletCards', action: 'expenses' },
      { id: 'reports', name: { 'ur': 'رپورٹس و منافع', 'ur-roman': 'Reports & Profit', 'pa': 'رپورٹس', 'sd': 'رپورٽون', 'ps': 'راپورونه', 'en': 'Reports' }, category: 'finance', icon: 'BarChart3', action: 'reports' },
      { id: 'ai_munshi', name: { 'ur': 'اے آئی منشی', 'ur-roman': 'AI Munshi', 'pa': 'منشی', 'sd': 'منشي', 'ps': 'منشي', 'en': 'AI Munshi' }, category: 'special', icon: 'Sparkles', action: 'ai_munshi' }
    ]
  }
};

// Aliases for alternate or legacy business type keys
BUSINESS_THEMES.cafe = BUSINESS_THEMES.restaurant;
BUSINESS_THEMES.salon = BUSINESS_THEMES.cosmetics;
BUSINESS_THEMES.tailor = BUSINESS_THEMES.clothing;
BUSINESS_THEMES.wholesale = BUSINESS_THEMES.mandi;
BUSINESS_THEMES.service = BUSINESS_THEMES.other;
BUSINESS_THEMES.home_business = BUSINESS_THEMES.online_business;
BUSINESS_THEMES.online_seller = BUSINESS_THEMES.online_business;
BUSINESS_THEMES.whatsapp_seller = BUSINESS_THEMES.online_business;

