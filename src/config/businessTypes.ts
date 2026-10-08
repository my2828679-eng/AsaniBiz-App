import { BusinessTypeConfig, BusinessTypeId } from '../types';

export const BUSINESS_TYPES: Record<BusinessTypeId, BusinessTypeConfig> = {
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
    description: {
      'ur': 'دالیں، گھی، مصالحہ جات، گھریلو راشن اور روزمرہ اشیاء',
      'ur-roman': 'Dal, ghee, masalay, ration aur rozmara items',
      'pa': 'راشن، گھیو، دالاں تے گھریلو سودا',
      'sd': 'راشن، گيهه، دالون ۽ روزانو گهر جو سامان',
      'ps': 'غوړي، دالونه، د کور راشن او د ورځني توکو پلور',
      'en': 'Grains, oil, spices, daily provisions and packaged goods'
    },
    icon: 'Store',
    defaultCategories: ['آٹا و دالیں', 'گھی و کوکنگ آئل', 'چائے و چینی', 'صابن و سرف', 'مصالحہ جات', 'بسکٹ و سنیکس'],
    unitOptions: ['kg', 'gram', 'litre', 'packet', 'carton', 'dozen', 'piece'],
    terminology: {
      productsLabel: { 'ur': 'سودا سلف / آئٹمز', 'ur-roman': 'Sauda Salf / Items', 'pa': 'سودا', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Grocery Items' },
      salesLabel: { 'ur': 'سیل و پرچیاں', 'ur-roman': 'Sales & Purchases', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'پرچی / بل', 'ur-roman': 'Parchi / Bill', 'pa': 'پرچی', 'sd': 'بل', 'ps': 'بل', 'en': 'Bills' },
      inventoryLabel: { 'ur': 'گودام و سٹاک', 'ur-roman': 'Godaam / Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'محلے دار / گاہک', 'ur-roman': 'Mohallay Daar / Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'expiryDate', label: { 'ur': 'تاریخ میعاد (Expiry)', 'ur-roman': 'Expiry Date', 'pa': 'ختم ہون دی تاریخ', 'sd': 'ختم ٿيڻ جي تاريخ', 'ps': 'د پای نېټه', 'en': 'Expiry Date' }, type: 'date' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا راشن بل', 'ur-roman': 'Naya Ration Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Grocery Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'udhaar', label: { 'ur': 'کھاتہ ادھار', 'ur-roman': 'Khata / Udhaar', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Khata Ledger' }, icon: 'BookOpen', action: 'khata' },
      { id: 'stock_check', label: { 'ur': 'سٹاک چیک', 'ur-roman': 'Stock Check', 'pa': 'سٹاک چیک', 'sd': 'اسٽاڪ چيڪ', 'ps': 'زېرمه وګورئ', 'en': 'Stock Check' }, icon: 'Boxes', action: 'products' }
    ]
  },

  mobile: {
    id: 'mobile',
    name: {
      'ur': 'موبائل شاپ و ریپیرنگ',
      'ur-roman': 'Mobile Shop & Accessories',
      'pa': 'موبائل شاپ تے کم',
      'sd': 'موبائل دڪان ۽ سامان',
      'ps': 'د ګرځنده ټیلیفونونو دوکان',
      'en': 'Mobile Shop & Accessories'
    },
    description: {
      'ur': 'موبائل فونز، سمز، چارجر، کورز، ایزی لوڈ اور ریپیرنگ',
      'ur-roman': 'Mobiles, covers, protectors, chargers aur repair',
      'pa': 'فونز، کوراں، چارجر تے ریپیرنگ',
      'sd': 'موبائل فون، چارجر، پروٽيڪٽر ۽ مرمت',
      'ps': 'موبایلونه، پوښونه، چارجران او ترمیم',
      'en': 'Smartphones, covers, accessories, parts & repairs'
    },
    icon: 'Smartphone',
    defaultCategories: ['Smartphones', 'Keypad Mobiles', 'Chargers & Cables', 'Handsfree & Airpods', 'Back Covers', 'Glass Protectors', 'Repairing Parts'],
    unitOptions: ['piece', 'set', 'box'],
    terminology: {
      productsLabel: { 'ur': 'موبائلز و ایکسیسریز', 'ur-roman': 'Mobiles & Accessories', 'pa': 'موبائل تے سامان', 'sd': 'موبائل ۽ سامان', 'ps': 'موبایلونه او وسایل', 'en': 'Mobiles & Accessories' },
      salesLabel: { 'ur': 'سیل و وارنٹی', 'ur-roman': 'Sales & Warranty', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'انوائس / رسید', 'ur-roman': 'Invoice / Receipt', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Invoices' },
      inventoryLabel: { 'ur': 'سٹاک و IMEI', 'ur-roman': 'Stock & IMEI', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock & IMEI' },
      customersLabel: { 'ur': 'گاہک / خریدار', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'brand', label: { 'ur': 'برانڈ (Samsung, Vivo, etc.)', 'ur-roman': 'Brand', 'pa': 'برانڈ', 'sd': 'برانڊ', 'ps': 'برانډ', 'en': 'Brand' }, type: 'text', placeholder: 'e.g. Samsung / Infinix / Apple' },
      { key: 'model', label: { 'ur': 'ماڈل (Model)', 'ur-roman': 'Model', 'pa': 'ماڈل', 'sd': 'ماڊل', 'ps': 'ماډل', 'en': 'Model' }, type: 'text', placeholder: 'e.g. Note 12 / A54' },
      { key: 'imei', label: { 'ur': 'IMEI نمبر / سیریل', 'ur-roman': 'IMEI / Serial No', 'pa': 'IMEI نمبر', 'sd': 'IMEI نمبر', 'ps': 'د IMEI شمېره', 'en': 'IMEI / Serial Number' }, type: 'text', placeholder: 'e.g. 865421051234567' },
      { key: 'warranty', label: { 'ur': 'وارنٹی (ماہ)', 'ur-roman': 'Warranty (Months)', 'pa': 'وارنٹی', 'sd': 'وارنٽي', 'ps': 'تضمین', 'en': 'Warranty' }, type: 'text', placeholder: 'e.g. 1 Year Official / 7 Days Check' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'موبائل / آئٹم بل', 'ur-roman': 'Mobile / Item Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'Create Invoice' }, icon: 'Receipt', action: 'billing' },
      { id: 'scan_imei', label: { 'ur': 'IMEI بار کوڈ اسکین', 'ur-roman': 'Scan IMEI Barcode', 'pa': 'بارکوڈ اسکین', 'sd': 'اسڪين', 'ps': 'سکین', 'en': 'Scan IMEI' }, icon: 'Scan', action: 'camera' },
      { id: 'udhaar', label: { 'ur': 'گاہک کھاتہ', 'ur-roman': 'Customer Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  clothing: {
    id: 'clothing',
    name: {
      'ur': 'کپڑے و گارمنٹس',
      'ur-roman': 'Clothing & Garments',
      'pa': 'کپڑیاں دی دکان',
      'sd': 'ڪپڙن جو دڪان',
      'ps': 'د جامو او رختونو دوکان',
      'en': 'Clothing & Fashion'
    },
    description: {
      'ur': 'ان سلے سوٹ، ریڈی میڈ گارمنٹس، بچوں اور خواتین کا لباس',
      'ur-roman': 'Unstitched, ready-made, ladies & kids wear',
      'pa': 'سوٹ، کڑھائی، زنانہ تے مردانہ کپڑے',
      'sd': 'سٽيچ ۽ اڻ سبييل وڳا، ٻارن جو وڳو',
      'ps': 'ګنډل شوي او بې ګنډلو جامې، د ماشومانو جامې',
      'en': 'Suits, unstitched fabric, ready-to-wear & variants'
    },
    icon: 'Shirt',
    defaultCategories: ['Unstitched Gents', 'Ladies Lawn/Chiffon', 'Ready-to-wear Kurti', 'Kids Collection', 'Shawls & Dupattas'],
    unitOptions: ['suit', 'meter', 'yard', 'piece', 'set'],
    terminology: {
      productsLabel: { 'ur': 'کپڑے و ورائٹی', 'ur-roman': 'Suits & Varieties', 'pa': 'کپڑے', 'sd': 'وڳا', 'ps': 'جامې', 'en': 'Garments' },
      salesLabel: { 'ur': 'سیل ریکارڈ', 'ur-roman': 'Sales Record', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'بل / رسید', 'ur-roman': 'Bill / Slip', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Bills' },
      inventoryLabel: { 'ur': 'سٹاک و تھان', 'ur-roman': 'Stock & Rolls', 'pa': 'تھان تے سوٹ', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock & Fabrics' },
      customersLabel: { 'ur': 'گاہک خواتین و حضرات', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'brand', label: { 'ur': 'برانڈ / مینوفیکچرر', 'ur-roman': 'Brand / Mill', 'pa': 'برانڈ', 'sd': 'برانڊ', 'ps': 'برانډ', 'en': 'Brand / Mill' }, type: 'text', placeholder: 'e.g. Gul Ahmed / Al-Karam' },
      { key: 'size', label: { 'ur': 'سائز', 'ur-roman': 'Size', 'pa': 'سائز', 'sd': 'سائيز', 'ps': 'اندازه', 'en': 'Size' }, type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL', 'Standard Unstitched'] },
      { key: 'color', label: { 'ur': 'رنگ / کوڈ', 'ur-roman': 'Color / Design Code', 'pa': 'رنگ', 'sd': 'رنگ', 'ps': 'رنګ', 'en': 'Color / Design' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'کپڑوں کا بل', 'ur-roman': 'Garments Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Garment Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'add_variant', label: { 'ur': 'سائز/رنگ ایڈ کریں', 'ur-roman': 'Add Size/Color', 'pa': 'پروڈکٹ پاؤ', 'sd': 'سامان شامل', 'ps': 'توکی ورزیات', 'en': 'Add Variety' }, icon: 'PlusCircle', action: 'products' },
      { id: 'khata', label: { 'ur': 'ادھار کھاتہ', 'ur-roman': 'Udhaar Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Ledger' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  restaurant: {
    id: 'restaurant',
    name: {
      'ur': 'ریسٹورنٹ و فوڈ پوائنٹ',
      'ur-roman': 'Restaurant & Food Point',
      'pa': 'کھابا تے ریسٹورنٹ',
      'sd': 'ريسٽورنٽ ۽ کاڌو',
      'ps': 'هوټل او رستورانت',
      'en': 'Restaurant & Eatery'
    },
    description: {
      'ur': 'ڈائن ان، ٹیک اوے، کچن اور ٹیبل آرڈرز',
      'ur-roman': 'Dine-in, takeaway, kitchen orders aur menu',
      'pa': 'کھانا، ٹیبل، پارسل تے کچن آرڈرز',
      'sd': 'کاڌو، ٽيبل، پارسل ۽ ڪچن آرڊر',
      'ps': 'د ډوډۍ هوټل، پارسل او میزونه',
      'en': 'Dine-in, takeaway delivery, menu & kitchen receipts'
    },
    icon: 'UtensilsCrossed',
    defaultCategories: ['BBQ & Karahi', 'Fast Food & Burgers', 'Rice & Biryani', 'Beverages & Chai', 'Roti & Naan', 'Desserts'],
    unitOptions: ['plate', 'half', 'full', 'piece', 'serving', 'cup'],
    terminology: {
      productsLabel: { 'ur': 'مینو آئٹمز', 'ur-roman': 'Menu Items', 'pa': 'مینو', 'sd': 'مينيو', 'ps': 'مینو', 'en': 'Menu Items' },
      salesLabel: { 'ur': 'آرڈرز و فروخت', 'ur-roman': 'Orders & Sales', 'pa': 'آرڈرز', 'sd': 'آرڊر', 'ps': 'فرمایشونه', 'en': 'Orders & Sales' },
      ordersOrBills: { 'ur': 'فوڈ ٹوکن / بل', 'ur-roman': 'Food Token / Bill', 'pa': 'ٹوکن', 'sd': 'ٽوڪن', 'ps': 'ټوکن', 'en': 'Food Order Bill' },
      inventoryLabel: { 'ur': 'کچن راشن و را میٹیریل', 'ur-roman': 'Kitchen Raw Material', 'pa': 'کچن سامان', 'sd': 'سامان', 'ps': 'د پخلنځي توکي', 'en': 'Kitchen Inventory' },
      customersLabel: { 'ur': 'مہمان / کسٹمرز', 'ur-roman': 'Guests / Customers', 'pa': 'گاہک', 'sd': 'مهمان', 'ps': 'میلمانه', 'en': 'Diners / Guests' }
    },
    customFields: [
      { key: 'tableNumber', label: { 'ur': 'ٹیبل نمبر / پارسل', 'ur-roman': 'Table No / Parcel', 'pa': 'ٹیبل نمبر', 'sd': 'ٽيبل نمبر', 'ps': 'د میز شمېره', 'en': 'Table / Parcel' }, type: 'text', placeholder: 'e.g. Table 4 / Parcel' }
    ],
    quickActions: [
      { id: 'new_order', label: { 'ur': 'فاسٹ آرڈر ٹوکن', 'ur-roman': 'Fast Order Token', 'pa': 'نواں آرڈر', 'sd': 'نئون آرڊر', 'ps': 'نوی فرمایش', 'en': 'Take Order' }, icon: 'Receipt', action: 'billing' },
      { id: 'kitchen_expense', label: { 'ur': 'روزانہ گوشت و سبزی خرچ', 'ur-roman': 'Daily Kitchen Expense', 'pa': 'کھانا خرچہ', 'sd': 'خرچ', 'ps': 'لګښت', 'en': 'Kitchen Expense' }, icon: 'Coins', action: 'expenses' }
    ]
  },

  tailor: {
    id: 'tailor',
    name: {
      'ur': 'ٹیلرنگ و سلائی سینٹر',
      'ur-roman': 'Tailor & Stitching Center',
      'pa': 'درزی دی دکان',
      'sd': 'درزي جو دڪان',
      'ps': 'د خیاطۍ دوکان',
      'en': 'Tailoring & Stitching'
    },
    description: {
      'ur': 'سلائی ناپ، آرڈرز، بکنگ، ڈیلیوری تاریخ اور بقایا',
      'ur-roman': 'Silai naap, booking, delivery date aur balance',
      'pa': 'ناپ، سلائی، ڈیلیوری تریخ تے بقایا',
      'sd': 'ماپ، سبڻ، ڊليوري تاريخ ۽ باقي پيسا',
      'ps': 'د جامو اندازه، ګنډل او د ورکړې نېټه',
      'en': 'Measurements, booking dates, delivery & stitching fees'
    },
    icon: 'Scissors',
    defaultCategories: ['Gents Simple Suit', 'Gents Kurta Pajama', 'Ladies Simple Suit', 'Ladies Designer Suit', 'Sherwani & Waistcoat'],
    unitOptions: ['suit', 'piece', 'pair'],
    terminology: {
      productsLabel: { 'ur': 'سروسز و سلائی ورکس', 'ur-roman': 'Stitching Services', 'pa': 'سلائی', 'sd': 'سروس', 'ps': 'خدمتونه', 'en': 'Stitching Services' },
      salesLabel: { 'ur': 'بکنگ و سلائی اجرت', 'ur-roman': 'Stitching Orders', 'pa': 'سلائی اجرت', 'sd': 'اجرت', 'ps': 'مزدوري', 'en': 'Orders & Wages' },
      ordersOrBills: { 'ur': 'سلائی پرچی', 'ur-roman': 'Silai Parchi', 'pa': 'پرچی', 'sd': 'پرچي', 'ps': 'رسید', 'en': 'Booking Slip' },
      inventoryLabel: { 'ur': 'بٹن، دھاگہ و بکرم', 'ur-roman': 'Tailoring Material', 'pa': 'دھاگہ بکس', 'sd': 'ڌاڳو ۽ بٽڻ', 'ps': 'تار او تڼۍ', 'en': 'Materials' },
      customersLabel: { 'ur': 'کسٹمر ناپ رجسٹر', 'ur-roman': 'Customer Measurements', 'pa': 'گاہک ناپ', 'sd': 'گراهڪ ماپ', 'ps': 'پیرودونکي', 'en': 'Clients' }
    },
    customFields: [
      { key: 'deliveryDate', label: { 'ur': 'ڈیلیوری تاریخ', 'ur-roman': 'Delivery Date', 'pa': 'تیار ہون دی تریخ', 'sd': 'ڊليوري تاريخ', 'ps': 'د سپارلو نېټه', 'en': 'Delivery Date' }, type: 'date' },
      { key: 'measurements', label: { 'ur': 'ناپ کی تفصیل', 'ur-roman': 'Measurement Notes', 'pa': 'ناپ', 'sd': 'ماپ', 'ps': 'اندازه', 'en': 'Measurements' }, type: 'text', placeholder: 'لمبائی، چھاتی، گھیرا، شلوار...' }
    ],
    quickActions: [
      { id: 'new_booking', label: { 'ur': 'سلائی بکنگ پرچی', 'ur-roman': 'New Stitching Booking', 'pa': 'نواں ناپ لکھو', 'sd': 'نئين بڪنگ', 'ps': 'نوی ناپ', 'en': 'Book Stitching' }, icon: 'Receipt', action: 'billing' },
      { id: 'khata', label: { 'ur': 'گاہک کھاتہ و بقایا', 'ur-roman': 'Client Balance Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Client Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  electronics: {
    id: 'electronics',
    name: {
      'ur': 'الیکٹرانکس و ہوم اپلائنسز',
      'ur-roman': 'Electronics & Appliances',
      'pa': 'الیکٹرانکس سامان',
      'sd': 'اليڪٽرانڪس سامان',
      'ps': 'د برېښنايي توکو دوکان',
      'en': 'Electronics & Appliances'
    },
    description: {
      'ur': 'پنکھے، ایل ای ڈی ٹی وی، استری، بیٹریاں اور سولر پلیٹس',
      'ur-roman': 'Fans, LED, batteries, solar panels aur appliances',
      'pa': 'پنکھے، ایل ای ڈی، بیٹریاں تے سولر',
      'sd': 'پنکا، بيٽريون، سولر پليٽون',
      'ps': 'پکې، سولر، بټرۍ او برېښنايي توکي',
      'en': 'Fans, TVs, inverters, solar panels & home gadgets'
    },
    icon: 'Tv',
    defaultCategories: ['Fans & Motors', 'Solar & Inverters', 'Batteries & UPS', 'Kitchen Appliances', 'Wires & Switches'],
    unitOptions: ['piece', 'set', 'unit', 'meter'],
    terminology: {
      productsLabel: { 'ur': 'الیکٹرانک آئٹمز', 'ur-roman': 'Electronics Items', 'pa': 'سامان', 'sd': 'اليڪٽرانڪس', 'ps': 'توکي', 'en': 'Electronics' },
      salesLabel: { 'ur': 'سیل و اقساط', 'ur-roman': 'Sales & Installments', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'وارنٹی بل', 'ur-roman': 'Warranty Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Warranty Bill' },
      inventoryLabel: { 'ur': 'سٹاک و سیریلز', 'ur-roman': 'Stock & Serials', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک و اقساط دار', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'modelNumber', label: { 'ur': 'ماڈل نمبر', 'ur-roman': 'Model Number', 'pa': 'ماڈل نمبر', 'sd': 'ماڊل نمبر', 'ps': 'ماډل نمبر', 'en': 'Model Number' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'وارنٹی انوائس', 'ur-roman': 'Warranty Invoice', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'Warranty Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'udhaar', label: { 'ur': 'کھاتہ / اقساط', 'ur-roman': 'Khata / Installments', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Ledger' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  autoparts: {
    id: 'autoparts',
    name: {
      'ur': 'آٹو پارٹس و ورکشاپ',
      'ur-roman': 'Auto Parts & Workshop',
      'pa': 'آٹو پارٹس تے مستری',
      'sd': 'آٽو پارٽس دڪان',
      'ps': 'د موټر او موټرسایکل پرزې',
      'en': 'Auto Parts & Mechanics'
    },
    description: {
      'ur': 'موٹر سائیکل و کار پارٹس، انجن آئل، فلٹرز اور اسپیئر پارٹس',
      'ur-roman': 'Bike & car parts, engine oil, filters aur spares',
      'pa': 'موٹرسائیکل پارٹس، آئل تے اسپیئرز',
      'sd': 'موٽرسائيڪل پارٽس، انجڻ آئل',
      'ps': 'د موټرو پرزې، د انجن تېل او فلټرونه',
      'en': 'Bike and car spare parts, engine oils & filters'
    },
    icon: 'Wrench',
    defaultCategories: ['Engine Oil & Lubricants', 'Brake Pads & Clutches', 'Batteries & Spark Plugs', 'Tyres & Tubes', 'Body Parts & Lights'],
    unitOptions: ['piece', 'litre', 'bottle', 'set', 'pair'],
    terminology: {
      productsLabel: { 'ur': 'اسپیئر پارٹس', 'ur-roman': 'Spare Parts', 'pa': 'پارٹس', 'sd': 'پارٽس', 'ps': 'پرزې', 'en': 'Spare Parts' },
      salesLabel: { 'ur': 'سیل و اجرت', 'ur-roman': 'Sales & Labor', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'میکینک / پارٹس بل', 'ur-roman': 'Parts Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Bill' },
      inventoryLabel: { 'ur': 'سٹاک شیلف', 'ur-roman': 'Stock Shelf', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک و ڈرائیورز', 'ur-roman': 'Vehicle Owners', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Clients' }
    },
    customFields: [
      { key: 'vehicleModel', label: { 'ur': 'گاڑی / ماڈل (e.g. CD-70 / Mehran)', 'ur-roman': 'Vehicle / Model', 'pa': 'گاڑی ماڈل', 'sd': 'گاڏي ماڊل', 'ps': 'د موټر موډل', 'en': 'Vehicle Compatibility' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'پارٹس کا بل', 'ur-roman': 'Parts Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Parts Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'udhaar', label: { 'ur': 'ڈرائیور کھاتہ', 'ur-roman': 'Driver / Mechanic Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  hardware: {
    id: 'hardware',
    name: {
      'ur': 'ہارڈ ویئر و پینٹ سٹور',
      'ur-roman': 'Hardware & Paint Store',
      'pa': 'ہارڈ ویئر تے پینٹ',
      'sd': 'هارڊويئر ۽ رنگ',
      'ps': 'هارډویر او رنګ دوکان',
      'en': 'Hardware & Paint'
    },
    description: {
      'ur': 'پلمبنگ، سینیٹری، پینٹ، اوزار، نٹ بولٹ اور تعمیراتی سامان',
      'ur-roman': 'Plumbing, sanitary, paint, cement aur tools',
      'pa': 'پینٹ، پائپ، سیمنٹ تے اوزار',
      'sd': 'پائيپ، رنگ، اوزار ۽ اڏاوتي سامان',
      'ps': 'پائپونه، رنګ، اوزار او ساختماني توکي',
      'en': 'Pipes, fittings, paint, tools & construction supplies'
    },
    icon: 'Hammer',
    defaultCategories: ['Pipes & Fittings', 'Paint & Brushes', 'Tools & Machinery', 'Screws & Fasteners', 'Sanitary & Taps'],
    unitOptions: ['piece', 'kg', 'gallon', 'feet', 'bundle', 'box'],
    terminology: {
      productsLabel: { 'ur': 'ہارڈ ویئر سامان', 'ur-roman': 'Hardware Items', 'pa': 'سامان', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Hardware Items' },
      salesLabel: { 'ur': 'سیل بل', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'انوائس', 'ur-roman': 'Invoice', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Invoice' },
      inventoryLabel: { 'ur': 'گودام و ریکس', 'ur-roman': 'Stock Warehouse', 'pa': 'گودام', 'sd': 'گودام', 'ps': 'ګودام', 'en': 'Warehouse' },
      customersLabel: { 'ur': 'ٹھیکیدار و گاہک', 'ur-roman': 'Contractors & Buyers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Contractors' }
    },
    customFields: [],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا بل', 'ur-roman': 'New Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'udhaar', label: { 'ur': 'ٹھیکیدار کھاتہ', 'ur-roman': 'Contractor Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  cosmetics: {
    id: 'cosmetics',
    name: {
      'ur': 'کاسمیٹکس و پرفیومز',
      'ur-roman': 'Cosmetics & Perfumes',
      'pa': 'کاسمیٹکس شاپ',
      'sd': 'ڪاسميٽڪس دڪان',
      'ps': 'د سینګار توکو دوکان',
      'en': 'Cosmetics & Beauty'
    },
    description: {
      'ur': 'میک اپ، پرفیوم، سکن کیئر اور بیوٹی پراڈکٹس',
      'ur-roman': 'Makeup, skin care, perfumes aur beauty goods',
      'pa': 'میک اپ، عطر تے بیوٹی سامان',
      'sd': 'ميڪ اپ، عطر ۽ سکن ڪيئر',
      'ps': 'د ښکلا توکي، عطر او کریمونه',
      'en': 'Makeup, fragrances, skin care & personal care'
    },
    icon: 'Sparkles',
    defaultCategories: ['Lipsticks & Makeup', 'Skin Care & Lotions', 'Perfumes & Attar', 'Hair Care & Shampoos', 'Jewellery & Accessories'],
    unitOptions: ['piece', 'bottle', 'box', 'set'],
    terminology: {
      productsLabel: { 'ur': 'بیوٹی پراڈکٹس', 'ur-roman': 'Beauty Products', 'pa': 'سامان', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Beauty Items' },
      salesLabel: { 'ur': 'سیل', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'بل / رسید', 'ur-roman': 'Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Bill' },
      inventoryLabel: { 'ur': 'سٹاک', 'ur-roman': 'Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'shade', label: { 'ur': 'شیڈ / نمبر (e.g. Shade 02)', 'ur-roman': 'Shade / Number', 'pa': 'شیڈ', 'sd': 'شيڊ', 'ps': 'شمېره', 'en': 'Shade / Variant' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا بل', 'ur-roman': 'New Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'udhaar', label: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  shoes: {
    id: 'shoes',
    name: {
      'ur': 'شوز و چپل سٹور',
      'ur-roman': 'Shoes & Footwear',
      'pa': 'جوتی دی دکان',
      'sd': 'بوٽن ۽ چپلن جو دڪان',
      'ps': 'د بوټانو او څپلو دوکان',
      'en': 'Shoes & Footwear'
    },
    description: {
      'ur': 'مردانہ، زنانہ و بچوں کے جوتے، کھسے، سینڈلز اور چپلیں',
      'ur-roman': 'Gents, ladies, kids shoes, sandals aur slippers',
      'pa': 'جوتے، چپل، سینڈل تے کھسے',
      'sd': 'بوٽ، چپل، سينڊل',
      'ps': 'بوټان، څپلۍ او سينډلونه',
      'en': 'Casual shoes, sneakers, slippers & formal footwear'
    },
    icon: 'Footprints',
    defaultCategories: ['Gents Formal', 'Gents Peshawari Chappal', 'Ladies Slippers & Heels', 'Kids School Shoes', 'Sports Joggers'],
    unitOptions: ['pair', 'box'],
    terminology: {
      productsLabel: { 'ur': 'جوتے و سائز', 'ur-roman': 'Shoes & Sizes', 'pa': 'جوتے', 'sd': 'بوٽ', 'ps': 'بوټان', 'en': 'Footwear' },
      salesLabel: { 'ur': 'سیل', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'انوائس', 'ur-roman': 'Invoice', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Invoice' },
      inventoryLabel: { 'ur': 'سٹاک باکسز', 'ur-roman': 'Stock Boxes', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'brand', label: { 'ur': 'برانڈ (Servis, Bata, etc.)', 'ur-roman': 'Brand', 'pa': 'برانڈ', 'sd': 'برانڊ', 'ps': 'برانډ', 'en': 'Brand' }, type: 'text', placeholder: 'e.g. Servis / Bata / Ndure' },
      { key: 'shoeSize', label: { 'ur': 'جوتے کا سائز (e.g. 7, 8, 9, 10, 11)', 'ur-roman': 'Shoe Size', 'pa': 'سائز', 'sd': 'سائيز', 'ps': 'اندازه', 'en': 'Shoe Size' }, type: 'text' },
      { key: 'color', label: { 'ur': 'رنگ (Color)', 'ur-roman': 'Color', 'pa': 'رنگ', 'sd': 'رنگ', 'ps': 'رنګ', 'en': 'Color' }, type: 'text', placeholder: 'e.g. Black / Brown' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'جوتے کا بل', 'ur-roman': 'Shoe Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'udhaar', label: { 'ur': 'کھاتہ', 'ur-roman': 'Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  cafe: {
    id: 'cafe',
    name: {
      'ur': 'چائے کیفے و ڈھا بہ',
      'ur-roman': 'Chai Cafe & Dhaba',
      'pa': 'چائے دا ہوٹل',
      'sd': 'چانهه جو هوٽل',
      'ps': 'د چایو هوټل',
      'en': 'Chai Cafe & Snack Bar'
    },
    description: {
      'ur': 'کڑک چائے، پراٹھے، سموسے، سنیکس اور بیٹھک',
      'ur-roman': 'Karak chai, parathas, samosay aur snacks',
      'pa': 'کڑک چاہ، پراٹھے تے بیٹھک',
      'sd': 'ڪڙڪ چانهه، پوريون، ناشتو',
      'ps': 'چای، پراټې، سموسې او ناسته',
      'en': 'Special chai, parathas, rolls & quick bites'
    },
    icon: 'Coffee',
    defaultCategories: ['Special Karak Chai', 'Parathas & Rolls', 'Samosas & Pakoras', 'Cold Drinks', 'Breakfast Items'],
    unitOptions: ['cup', 'piece', 'plate', 'bottle'],
    terminology: {
      productsLabel: { 'ur': 'مینو آئٹمز', 'ur-roman': 'Menu Items', 'pa': 'مینو', 'sd': 'مينيو', 'ps': 'مینو', 'en': 'Menu Items' },
      salesLabel: { 'ur': 'سیل', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'ٹوکن / بل', 'ur-roman': 'Token / Bill', 'pa': 'ٹوکن', 'sd': 'ٽوڪن', 'ps': 'ټوکن', 'en': 'Token / Bill' },
      inventoryLabel: { 'ur': 'دودھ، پتی، چینی راشن', 'ur-roman': 'Milk, Tea, Sugar Stock', 'pa': 'دودھ پتی سٹاک', 'sd': 'کير پتي اسٽاڪ', 'ps': 'شیدې او چای', 'en': 'Ingredients' },
      customersLabel: { 'ur': 'گاہک و بیٹھک دار', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [],
    quickActions: [
      { id: 'fast_token', label: { 'ur': 'چائے ٹوکن کٹوائیں', 'ur-roman': 'Fast Chai Token', 'pa': 'ٹوکن کٹو', 'sd': 'ٽوڪن', 'ps': 'ټوکن', 'en': 'Fast Token' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  bakery: {
    id: 'bakery',
    name: {
      'ur': 'بیکری و سوئٹس',
      'ur-roman': 'Bakery & Sweets',
      'pa': 'بیکری تے مٹھائی',
      'sd': 'بيڪري ۽ مٺائي',
      'ps': 'بیکري او خواږه',
      'en': 'Bakery & Sweets'
    },
    description: {
      'ur': 'تازہ کیک، بسکٹ، پیسٹری، رس، مٹھائی اور نمکو',
      'ur-roman': 'Fresh cakes, biscuits, pastries, mithai aur namkeen',
      'pa': 'کیک، مٹھائی، رس تے بسکٹ',
      'sd': 'ڪيڪ، بسڪيٽ، مٺائي ۽ رس',
      'ps': 'کیکونه، خواږه، بسکټ او ډوډۍ',
      'en': 'Cakes, confectionery, traditional sweets & biscuits'
    },
    icon: 'Cake',
    defaultCategories: ['Fresh Birthday Cakes', 'Biscuits & Rusk', 'Pastries & Patties', 'Mithai & Halwa', 'Breads & Buns'],
    unitOptions: ['kg', 'piece', 'pound', 'packet', 'box'],
    terminology: {
      productsLabel: { 'ur': 'بیکری آئٹمز', 'ur-roman': 'Bakery Items', 'pa': 'سامان', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Bakery Items' },
      salesLabel: { 'ur': 'سیل', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'انوائس', 'ur-roman': 'Invoice', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Invoice' },
      inventoryLabel: { 'ur': 'سٹاک و شیلف', 'ur-roman': 'Stock Shelf', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'cakePound', label: { 'ur': 'کیک وزن (پاؤنڈ)', 'ur-roman': 'Weight (Pounds)', 'pa': 'پاؤنڈ', 'sd': 'پائونڊ', 'ps': 'پونډ', 'en': 'Weight (lbs)' }, type: 'number' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'کیک / مٹھائی بل', 'ur-roman': 'Cake / Mithai Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'Create Bill' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  salon: {
    id: 'salon',
    name: {
      'ur': 'سیلون و بیوٹی پارلر',
      'ur-roman': 'Salon & Beauty Parlour',
      'pa': 'حجام تے سیلون',
      'sd': 'سيلون ۽ پارلر',
      'ps': 'د وېښتانو او ښکلا سیلون',
      'en': 'Salon & Beauty Parlour'
    },
    description: {
      'ur': 'ہیر کٹنگ، فیشل، شیو، میک اپ، اور گرومنگ سروسز',
      'ur-roman': 'Hair cut, facial, shave, bridal aur grooming',
      'pa': 'وال کٹنگ، فیشل تے شیو',
      'sd': 'وار ڪٽڻ، فيشل، سينگار',
      'ps': 'د وېښتانو کټول، فیشل او سینګار',
      'en': 'Haircuts, facials, beard grooming & bridal treatments'
    },
    icon: 'Smile',
    defaultCategories: ['Hair Cuts & Styling', 'Beard & Shave', 'Facial & Skin Care', 'Bridal & Party Makeup', 'Hair Color & Treatment'],
    unitOptions: ['service', 'person', 'package'],
    terminology: {
      productsLabel: { 'ur': 'سروسز مینو', 'ur-roman': 'Services Menu', 'pa': 'سروسز', 'sd': 'سروسز', 'ps': 'خدمتونه', 'en': 'Services' },
      salesLabel: { 'ur': 'ڈیلی کلیکشن', 'ur-roman': 'Daily Collection', 'pa': 'کلیکشن', 'sd': 'ڪليڪشن', 'ps': 'ټولګه', 'en': 'Daily Earnings' },
      ordersOrBills: { 'ur': 'سروس پرچی', 'ur-roman': 'Service Slip', 'pa': 'پرچی', 'sd': 'پرچي', 'ps': 'رسید', 'en': 'Service Slip' },
      inventoryLabel: { 'ur': 'کریمز، شیمپو و پروڈکٹس', 'ur-roman': 'Lotions & Shampoos', 'pa': 'سامان', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Products Used' },
      customersLabel: { 'ur': 'کلائنٹس', 'ur-roman': 'Clients', 'pa': 'کلائنٹس', 'sd': 'ڪلائنٽ', 'ps': 'پیرودونکي', 'en': 'Clients' }
    },
    customFields: [],
    quickActions: [
      { id: 'service_bill', label: { 'ur': 'سروس پرچی کاٹیں', 'ur-roman': 'Record Service Slip', 'pa': 'پرچی بناؤ', 'sd': 'پرچي', 'ps': 'رسید', 'en': 'Service Slip' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  furniture: {
    id: 'furniture',
    name: {
      'ur': 'فرنیچر و ہوم ڈیکور',
      'ur-roman': 'Furniture & Home Decor',
      'pa': 'فرنیچر دی دکان',
      'sd': 'فرنيچر جو دڪان',
      'ps': 'د فرنیچر دوکان',
      'en': 'Furniture & Woodwork'
    },
    description: {
      'ur': 'بیڈ روم سیٹ، صوفہ سیٹ، الماریاں اور دفتری میز کرسی',
      'ur-roman': 'Bed set, sofa, almirah, office table aur chairs',
      'pa': 'صوفہ، پلنگ، الماریاں تے کرسیاں',
      'sd': 'صوفا، پلنگ، الماري ۽ ميزون',
      'ps': 'صوفې، کټونه، المارۍ او میزونه',
      'en': 'Beds, sofas, dining tables, wardrobes & office furniture'
    },
    icon: 'Armchair',
    defaultCategories: ['Sofa Sets (5/7 Seater)', 'Bed Sets & Wardrobes', 'Dining & Center Tables', 'Office Chairs & Desks', 'Foam & Mattresses'],
    unitOptions: ['set', 'piece'],
    terminology: {
      productsLabel: { 'ur': 'فرنیچر آئٹمز', 'ur-roman': 'Furniture Items', 'pa': 'فرنیچر', 'sd': 'فرنيچر', 'ps': 'فرنیچر', 'en': 'Furniture Items' },
      salesLabel: { 'ur': 'سیل و آرڈرز', 'ur-roman': 'Sales & Custom Orders', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'انوائس و بیعانہ', 'ur-roman': 'Invoice & Advance', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Invoice' },
      inventoryLabel: { 'ur': 'شو روم و ورکشاپ سٹاک', 'ur-roman': 'Showroom Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'woodType', label: { 'ur': 'لکڑی کی قسم (شیشم، چنیوٹی، ٹیک)', 'ur-roman': 'Wood Material', 'pa': 'لکڑی قسم', 'sd': 'ڪاٺي جو قسم', 'ps': 'د لرګي ډول', 'en': 'Wood Material' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'فرنیچر انوائس', 'ur-roman': 'Furniture Invoice', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Invoice' }, icon: 'Receipt', action: 'billing' },
      { id: 'udhaar', label: { 'ur': 'بیعانہ و بقایا کھاتہ', 'ur-roman': 'Advance & Balance Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  wholesale: {
    id: 'wholesale',
    name: {
      'ur': 'ہول سیل ڈسٹری بیوشن',
      'ur-roman': 'Wholesale Distribution',
      'pa': 'تھوک / ہول سیل',
      'sd': 'ٿوڪ جو ڪاروبار',
      'ps': 'عمده پلور',
      'en': 'Wholesale & B2B Supply'
    },
    description: {
      'ur': 'کارٹن، بوریوں اور بلک کوانٹٹی میں مال کی سپلائی',
      'ur-roman': 'Cartons, bori, bulk supply aur shopkeeper khata',
      'pa': 'پیٹیاں، بوریاں تے تھوک سپلائی',
      'sd': 'ٻوريون، پيٽيون ۽ وڏو مال',
      'ps': 'په کڅوړو او کارتنونو کې لوی پلور',
      'en': 'Bulk carton quantities, B2B store supplies & ledgers'
    },
    icon: 'PackageCheck',
    defaultCategories: ['Bulk Grocery', 'Packaged FMCG Cartons', 'Beverages Crates', 'Plastics & Disposable Items'],
    unitOptions: ['carton', 'bag', 'crate', 'bundle', 'tonne', 'dozen'],
    terminology: {
      productsLabel: { 'ur': 'بلک آئٹمز', 'ur-roman': 'Bulk Products', 'pa': 'تھوک مال', 'sd': 'ٿوڪ سامان', 'ps': 'عمده توکي', 'en': 'Bulk Stock' },
      salesLabel: { 'ur': 'ڈسٹری بیوشن سیل', 'ur-roman': 'Wholesale Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Wholesale Sales' },
      ordersOrBills: { 'ur': 'ڈلیوری چالان / بل', 'ur-roman': 'Delivery Challan / Bill', 'pa': 'چالان', 'sd': 'چالان', 'ps': 'چالان', 'en': 'Challan / Bill' },
      inventoryLabel: { 'ur': 'ویئر ہاؤس سٹاک', 'ur-roman': 'Warehouse Stock', 'pa': 'گودام سٹاک', 'sd': 'اسٽاڪ', 'ps': 'ګودام', 'en': 'Warehouse' },
      customersLabel: { 'ur': 'دکاندار / ریٹیلرز', 'ur-roman': 'Retailer Shops', 'pa': 'دکاندار', 'sd': 'دڪاندار', 'ps': 'دوکانداران', 'en': 'Retailers' }
    },
    customFields: [
      { key: 'piecesPerCarton', label: { 'ur': 'کارٹن میں تعداد (Pcs/Carton)', 'ur-roman': 'Pcs per Carton', 'pa': 'کارٹن وچ تعداد', 'sd': 'پيٽي ۾ تعداد', 'ps': 'په کارتن کې شمېر', 'en': 'Units per Carton' }, type: 'number' }
    ],
    quickActions: [
      { id: 'new_challan', label: { 'ur': 'ہول سیل چالان بل', 'ur-roman': 'Wholesale Bill', 'pa': 'چالان بناؤ', 'sd': 'چالان', 'ps': 'چالان', 'en': 'Wholesale Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'retailer_khata', label: { 'ur': 'دکاندار کھاتہ', 'ur-roman': 'Retailer Udhaar Khata', 'pa': 'کھاتہ', 'sd': 'کاتو', 'ps': 'پور', 'en': 'Retailer Khata' }, icon: 'BookOpen', action: 'khata' }
    ]
  },

  service: {
    id: 'service',
    name: {
      'ur': 'سروس بزنس و کنسلٹنسی',
      'ur-roman': 'Service Business & Consultancy',
      'pa': 'سروس کاروبار',
      'sd': 'سروس ڪاروبار',
      'ps': 'د خدماتو کاروبار',
      'en': 'Service & Freelance'
    },
    description: {
      'ur': 'الیکٹریشن، پلمبر، فوٹوگرافی، اکیڈمی، آئی ٹی و فری لانس',
      'ur-roman': 'Electrician, plumber, tutor, IT & services',
      'pa': 'الیکٹریشن، ٹیوشن، فوٹوگرافی تے خدمات',
      'sd': 'اليڪٽريشن، ٽيوشن، آئي ٽي سروسز',
      'ps': 'برېښناکار، ښوونکی، انځورګري او خدمات',
      'en': 'Freelancers, consultants, tutors, trades & repairs'
    },
    icon: 'Briefcase',
    defaultCategories: ['Visiting Charges', 'Standard Service Package', 'Emergency Repair', 'Monthly Retainer'],
    unitOptions: ['job', 'hour', 'month', 'visit'],
    terminology: {
      productsLabel: { 'ur': 'سروسز پیکجز', 'ur-roman': 'Service Packages', 'pa': 'سروسز', 'sd': 'سروسز', 'ps': 'خدمتونه', 'en': 'Services' },
      salesLabel: { 'ur': 'آمدن', 'ur-roman': 'Income', 'pa': 'کمائی', 'sd': 'آمدني', 'ps': 'عاید', 'en': 'Earnings' },
      ordersOrBills: { 'ur': 'انوائس', 'ur-roman': 'Invoice', 'pa': 'انوائس', 'sd': 'انوائس', 'ps': 'انوائس', 'en': 'Invoice' },
      inventoryLabel: { 'ur': 'ٹول کٹ و سپلائیز', 'ur-roman': 'Tool Kit Supplies', 'pa': 'اوزار', 'sd': 'اوزار', 'ps': 'اوزار', 'en': 'Supplies' },
      customersLabel: { 'ur': 'کلائنٹس', 'ur-roman': 'Clients', 'pa': 'کلائنٹس', 'sd': 'ڪلائنٽ', 'ps': 'پیرودونکي', 'en': 'Clients' }
    },
    customFields: [],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'سروس بل', 'ur-roman': 'Service Invoice', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Invoice' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  home_business: {
    id: 'home_business',
    name: {
      'ur': 'گھریلو کاروبار (ہوم بزنس)',
      'ur-roman': 'Home Business / Kitchen',
      'pa': 'گھریلو کم کاج',
      'sd': 'گھريلو ڪاروبار',
      'ps': 'د کورنی کاروبار',
      'en': 'Home Business / Cottage'
    },
    description: {
      'ur': 'گھر کا بنا کھانا، اچار، کیک، ہینڈی کرافٹس اور کڑھائی',
      'ur-roman': 'Home food, achaar, baking, embroidery aur crafts',
      'pa': 'گھر دا کھانا، اچار تے دستکاری',
      'sd': 'گھر جو کاڌو، آچار، هٿ جو هنر',
      'ps': 'د کور ډوډۍ، لاسي صنایع او خیاطي',
      'en': 'Home food delivery, preserves, baking, sewing & crafts'
    },
    icon: 'Home',
    defaultCategories: ['Daily Meals & Lunchbox', 'Homemade Achaar & Chutney', 'Custom Cakes', 'Handmade Crafts'],
    unitOptions: ['box', 'kg', 'jar', 'piece', 'order'],
    terminology: {
      productsLabel: { 'ur': 'گھریلو اشیاء', 'ur-roman': 'Home Products', 'pa': 'سامان', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Home Products' },
      salesLabel: { 'ur': 'آرڈرز و فروخت', 'ur-roman': 'Orders & Sales', 'pa': 'آرڈرز', 'sd': 'آرڊر', 'ps': 'فرمایشونه', 'en': 'Orders' },
      ordersOrBills: { 'ur': 'انوائس پرچی', 'ur-roman': 'Order Slip', 'pa': 'پرچی', 'sd': 'پرچي', 'ps': 'رسید', 'en': 'Order Slip' },
      inventoryLabel: { 'ur': 'خام مال راشن', 'ur-roman': 'Raw Ingredients', 'pa': 'سامان', 'sd': 'سامان', 'ps': 'خام توکي', 'en': 'Ingredients' },
      customersLabel: { 'ur': 'گاہک و جاننے والے', 'ur-roman': 'Buyers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا ہوم آرڈر', 'ur-roman': 'New Home Order', 'pa': 'نواں آرڈر', 'sd': 'نئون آرڊر', 'ps': 'نوی فرمایش', 'en': 'New Order' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  online_seller: {
    id: 'online_seller',
    name: {
      'ur': 'آن لائن سیلر (دراز / فیس بک)',
      'ur-roman': 'Online Seller (Daraz / Social)',
      'pa': 'آن لائن سیلر',
      'sd': 'آن لائن وڪرو ڪندڙ',
      'ps': 'آنلاین پلورونکی',
      'en': 'Online / E-Commerce Seller'
    },
    description: {
      'ur': 'دراز، فیس بک مارکیٹ پلیس، انسٹاگرام شاپس اور کوریئر پارسلز',
      'ur-roman': 'Daraz, Facebook, Instagram, Shopify aur courier parcels',
      'pa': 'دراز، فیس بک تے پارسلز',
      'sd': 'دراز، فيسبڪ ۽ پارسل',
      'ps': 'دراز، فیسبوک او انټرنیټي پلور',
      'en': 'Social media sellers, online store owners & parcel shippers'
    },
    icon: 'Globe',
    defaultCategories: ['Trending Gadgets', 'Fashion Accessories', 'Home & Kitchen', 'Beauty Products'],
    unitOptions: ['piece', 'parcel', 'set'],
    terminology: {
      productsLabel: { 'ur': 'لسٹنگز و پروڈکٹس', 'ur-roman': 'Listings & Products', 'pa': 'پروڈکٹس', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Listings' },
      salesLabel: { 'ur': 'کوریئر آرڈرز (COD)', 'ur-roman': 'Courier / COD Sales', 'pa': 'آرڈرز', 'sd': 'آرڊر', 'ps': 'فرمایشونه', 'en': 'Orders & COD' },
      ordersOrBills: { 'ur': 'انوائس و پارسل سلپ', 'ur-roman': 'Parcel Slip', 'pa': 'سلپ', 'sd': 'سلپ', 'ps': 'رسید', 'en': 'Parcel Slip' },
      inventoryLabel: { 'ur': 'سٹاک انوینٹری', 'ur-roman': 'Stock Inventory', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'آن لائن خریدار', 'ur-roman': 'Online Buyers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Online Buyers' }
    },
    customFields: [
      { key: 'trackingNumber', label: { 'ur': 'کوریئر ٹریکنگ نمبر (TCS / Leopards / Trax)', 'ur-roman': 'Tracking Number', 'pa': 'ٹریکنگ نمبر', 'sd': 'ٽريڪنگ نمبر', 'ps': 'د تعقیب شمېره', 'en': 'Tracking Number' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا پارسل بل (COD)', 'ur-roman': 'New COD Parcel Bill', 'pa': 'نواں پارسل', 'sd': 'نئون پارسل', 'ps': 'نوی پارسل', 'en': 'New COD Order' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  whatsapp_seller: {
    id: 'whatsapp_seller',
    name: {
      'ur': 'واٹس ایپ سیلر و ری سیلر',
      'ur-roman': 'WhatsApp Seller & Reseller',
      'pa': 'واٹس ایپ سیلر',
      'sd': 'واٽس ايپ سيلر',
      'ps': 'د واټس اپ پلورونکی',
      'en': 'WhatsApp Business Seller'
    },
    description: {
      'ur': 'واٹس ایپ گروپس، اسٹیٹس سیلنگ، ری سیلنگ اور کٹ لاگ',
      'ur-roman': 'WhatsApp groups, status selling, catalog aur direct bills',
      'pa': 'واٹس ایپ گروپس تے کسٹمرز',
      'sd': 'واٽس ايپ گروپس ۽ سيلنگ',
      'ps': 'د واټس اپ ډلې او مستقیم پلور',
      'en': 'Status-based catalogs, direct customer chats & fast billing'
    },
    icon: 'MessageCircle',
    defaultCategories: ['Suits & Fabrics', 'Watches & Bags', 'Cosmetics & Jewelry', 'Gadgets'],
    unitOptions: ['piece', 'suit', 'item'],
    terminology: {
      productsLabel: { 'ur': 'کیٹلاگ اشیاء', 'ur-roman': 'Catalog Items', 'pa': 'کیٹلاگ', 'sd': 'ڪيٽلاگ', 'ps': 'کتلاګ', 'en': 'Catalog Items' },
      salesLabel: { 'ur': 'واٹس ایپ سیل', 'ur-roman': 'WhatsApp Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'WhatsApp Sales' },
      ordersOrBills: { 'ur': 'واٹس ایپ انوائس', 'ur-roman': 'WhatsApp Invoice', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'WhatsApp Bill' },
      inventoryLabel: { 'ur': 'سٹاک', 'ur-roman': 'Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'واٹس ایپ گاہک', 'ur-roman': 'WhatsApp Contacts', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'WhatsApp Contacts' }
    },
    customFields: [],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'واٹس ایپ بل بنائیں', 'ur-roman': 'WhatsApp Bill', 'pa': 'بل بناؤ', 'sd': 'بل ٺاهيو', 'ps': 'بل جوړ کړئ', 'en': 'WhatsApp Bill' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  pharmacy: {
    id: 'pharmacy',
    name: {
      'ur': 'فارمیسی و میڈیکل اسٹور',
      'ur-roman': 'Pharmacy & Medical Store',
      'pa': 'فارمیسی تے دوائیاں',
      'sd': 'فارميٽي ۽ ميڊيڪل اسٽور',
      'ps': 'درملتون او میډیکل سټور',
      'en': 'Pharmacy & Medical Store'
    },
    description: {
      'ur': 'ادویات، شربت، ڈراپس، انجیکشن اور سرجیکل سامان',
      'ur-roman': 'Medicines, syrups, drops, injections aur surgical items',
      'pa': 'دوائیاں، شربت، قطرے تے سرجیکل سامان',
      'sd': 'دوائون، شربت، انجيڪشن ۽ سرجيڪل سامان',
      'ps': 'درمل، شربت، څاڅکي او جراحي توکي',
      'en': 'Medicines, syrups, supplements and surgical goods'
    },
    icon: 'Cross',
    defaultCategories: ['Tablets & Capsules', 'Syrups & Suspensions', 'Injections & Drips', 'Baby Care & Milk', 'Surgical & Bandages'],
    unitOptions: ['strip', 'tablet', 'bottle', 'pack', 'box', 'piece'],
    terminology: {
      productsLabel: { 'ur': 'ادویات', 'ur-roman': 'Medicines', 'pa': 'دوائیاں', 'sd': 'دوائون', 'ps': 'درمل', 'en': 'Medicines' },
      salesLabel: { 'ur': 'میڈیکل سیل', 'ur-roman': 'Medicine Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Medicine Sales' },
      ordersOrBills: { 'ur': 'پرچی / رسید', 'ur-roman': 'Prescription Slip', 'pa': 'پرچی', 'sd': 'بل', 'ps': 'بل', 'en': 'Prescription Slip' },
      inventoryLabel: { 'ur': 'میڈیسن اسٹاک', 'ur-roman': 'Medicine Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Medicine Stock' },
      customersLabel: { 'ur': 'مریض / گاہک', 'ur-roman': 'Patients / Customers', 'pa': 'مریض', 'sd': 'مريض', 'ps': 'ناروغان', 'en': 'Patients / Customers' }
    },
    customFields: [
      { key: 'batchNo', label: { 'ur': 'بیچ نمبر (Batch No)', 'ur-roman': 'Batch Number', 'pa': 'بیچ نمبر', 'sd': 'بيچ نمبر', 'ps': 'بیچ شمېره', 'en': 'Batch No' }, type: 'text' },
      { key: 'expiryDate', label: { 'ur': 'تاریخ میعاد (Expiry Date)', 'ur-roman': 'Expiry Date', 'pa': 'ختم ہون دی تریخ', 'sd': 'تاريخ ختم', 'ps': 'د پای نېټه', 'en': 'Expiry Date' }, type: 'date' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا میڈیکل بل', 'ur-roman': 'Medical Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'Medical Bill' }, icon: 'Receipt', action: 'billing' },
      { id: 'stock_check', label: { 'ur': 'میعاد و اسٹاک چیک', 'ur-roman': 'Expiry & Stock Check', 'pa': 'سٹاک چیک', 'sd': 'اسٽاڪ چيڪ', 'ps': 'زېرمه وګورئ', 'en': 'Stock Check' }, icon: 'Boxes', action: 'products' }
    ]
  },

  fruit_veg: {
    id: 'fruit_veg',
    name: {
      'ur': 'سبزی و فروٹ شاپ',
      'ur-roman': 'Fruit & Vegetable Shop',
      'pa': 'سبزی تے فروٹ',
      'sd': 'ڀاڄي ۽ ميوي جو دڪان',
      'ps': 'د سبزیو او میوو دوکان',
      'en': 'Fruit & Vegetable Shop'
    },
    description: {
      'ur': 'تازہ سبزیاں، پھل، منڈی خریداری اور روزانہ وزن حساب',
      'ur-roman': 'Fresh sabzi, phal, mandi purchase aur daily wazan',
      'pa': 'تازہ پھل، سبزیاں تے منڈی سودا',
      'sd': 'تازيون ڀاڄيون ۽ ميوا',
      'ps': 'تازه سبزی او میوې',
      'en': 'Fresh fruits, vegetables, mandi procurements & daily weighing'
    },
    icon: 'Apple',
    defaultCategories: ['Daily Vegetables (آلو، پیاز، ٹماٹر)', 'Seasonal Fruits (آم، سیب، کیلا)', 'Citrus & Berries', 'Leafy Greens (پالک، دھنیا)', 'Dry Fruits (بادام، اخروٹ)'],
    unitOptions: ['kg', 'gram', 'dhabba', 'peti', 'dozen', 'bundle'],
    terminology: {
      productsLabel: { 'ur': 'سبزی و پھل', 'ur-roman': 'Fruits & Vegetables', 'pa': 'پھل سبزیاں', 'sd': 'ميوا ڀاڄيون', 'ps': 'میوې او سبزی', 'en': 'Fresh Produce' },
      salesLabel: { 'ur': 'روزانہ بکری', 'ur-roman': 'Daily Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Daily Sales' },
      ordersOrBills: { 'ur': 'تول پرچی', 'ur-roman': 'Weight Slip', 'pa': 'پرچی', 'sd': 'پرچي', 'ps': 'رسید', 'en': 'Weight Slip' },
      inventoryLabel: { 'ur': 'پیٹی و کریٹ اسٹاک', 'ur-roman': 'Crate & Box Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Crate Stock' },
      customersLabel: { 'ur': 'محلہ دار گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'فاسٹ وزن بل', 'ur-roman': 'Fast Weight Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'Weigh Bill' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  online_business: {
    id: 'online_business',
    name: {
      'ur': 'آن لائن بزنس و ای کامرس',
      'ur-roman': 'Online Business & E-Commerce',
      'pa': 'آن لائن کاروبار',
      'sd': 'آن لائن ڪاروبار',
      'ps': 'آنلاین سوداګري',
      'en': 'Online Business & E-Commerce'
    },
    description: {
      'ur': 'دراز، فیس بک، انسٹاگرام، ویب سائٹ اور کوریئر پارسلز',
      'ur-roman': 'Daraz, Facebook, Instagram, Shopify aur courier parcels',
      'pa': 'دراز، فیس بک تے پارسلز',
      'sd': 'دراز، فيسبڪ ۽ پارسل',
      'ps': 'دراز، فیسبوک او انټرنیټي پلور',
      'en': 'Social media shops, Shopify, Daraz & courier cash-on-delivery'
    },
    icon: 'Globe',
    defaultCategories: ['Trending Gadgets', 'Fashion & Apparel', 'Home & Kitchen', 'Cosmetics', 'Accessories'],
    unitOptions: ['piece', 'parcel', 'set', 'pack'],
    terminology: {
      productsLabel: { 'ur': 'پروڈکٹس و لسٹنگز', 'ur-roman': 'Products & Listings', 'pa': 'پروڈکٹس', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Products' },
      salesLabel: { 'ur': 'کوریئر آرڈرز (COD)', 'ur-roman': 'Courier / COD Sales', 'pa': 'آرڈرز', 'sd': 'آرڊر', 'ps': 'فرمایشونه', 'en': 'Orders & COD' },
      ordersOrBills: { 'ur': 'انوائس و پارسل سلپ', 'ur-roman': 'Parcel Slip', 'pa': 'سلپ', 'sd': 'سلپ', 'ps': 'رسید', 'en': 'Parcel Slip' },
      inventoryLabel: { 'ur': 'سٹاک انوینٹری', 'ur-roman': 'Stock Inventory', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'آن لائن خریدار', 'ur-roman': 'Online Buyers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Online Buyers' }
    },
    customFields: [
      { key: 'trackingNumber', label: { 'ur': 'کوریئر ٹریکنگ نمبر (TCS/Leopards/Trax)', 'ur-roman': 'Tracking Number', 'pa': 'ٹریکنگ نمبر', 'sd': 'ٽريڪنگ نمبر', 'ps': 'د تعقیب شمېره', 'en': 'Tracking Number' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا پارسل بل (COD)', 'ur-roman': 'New COD Parcel Bill', 'pa': 'نواں پارسل', 'sd': 'نئون پارسل', 'ps': 'نوی پارسل', 'en': 'New COD Order' }, icon: 'Receipt', action: 'billing' }
    ]
  },

  other: {
    id: 'other',
    name: {
      'ur': 'دیگر عام کاروبار',
      'ur-roman': 'Other General Business',
      'pa': 'ہور عام کاروبار',
      'sd': 'ٻيو عام ڪاروبار',
      'ps': 'نور کاروبار',
      'en': 'Other General Business'
    },
    description: {
      'ur': 'عام تجارت، دکان داری، سپلائی، یا خصوصی کاروبار',
      'ur-roman': 'Aam tijarat, dukaan daari, supply ya customized karobaar',
      'pa': 'عام تجارت تے دکانداری',
      'sd': 'عام واپار ۽ دڪانداري',
      'ps': 'عمومي تجارت او دوکانداري',
      'en': 'General retail, trading, services and tailored businesses'
    },
    icon: 'Store',
    defaultCategories: ['General Items', 'Special Products', 'Services', 'Supplies'],
    unitOptions: ['piece', 'kg', 'set', 'pack', 'unit'],
    terminology: {
      productsLabel: { 'ur': 'آئٹمز و پروڈکٹس', 'ur-roman': 'Items & Products', 'pa': 'سامان', 'sd': 'سامان', 'ps': 'توکي', 'en': 'Items' },
      salesLabel: { 'ur': 'فروخت', 'ur-roman': 'Sales', 'pa': 'سیل', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'انوائس / بل', 'ur-roman': 'Invoice / Bill', 'pa': 'بل', 'sd': 'بل', 'ps': 'بل', 'en': 'Bills' },
      inventoryLabel: { 'ur': 'اسٹاک', 'ur-roman': 'Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک', 'ur-roman': 'Customers', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا بل بنائیں', 'ur-roman': 'New Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, icon: 'Receipt', action: 'billing' }
    ]
  },
  mandi: {
    id: 'mandi',
    name: {
      'ur': 'منڈی / ہول سیل',
      'ur-roman': 'Mandi / Wholesale',
      'pa': 'منڈی / ہول سیل',
      'sd': 'منڊي / ٿوڪ',
      'ps': 'منډۍ / عمده پلور',
      'en': 'Mandi / Wholesale'
    },
    description: {
      'ur': 'غلہ منڈی، سبزی منڈی، بوریاں، تول اور کمیشن کا ہول سیل حساب',
      'ur-roman': 'Ghalla mandi, sabzi mandi, bori, toal aur commission hisaab',
      'pa': 'منڈی، بوریاں تے تول دا حساب',
      'sd': 'منڊي، ٻوريون ۽ وزن جو حساب',
      'ps': 'د منډۍ د غلو، سبزیو او وزن حساب',
      'en': 'Grain market, wholesale lots, weighing scale & mandi commission ledger'
    },
    icon: 'Package',
    defaultCategories: ['Grains (غلہ)', 'Vegetables (سبزی)', 'Bulk Sacks (بوریاں)', 'Crates (پیٹیاں)'],
    unitOptions: ['man (من - 40kg)', 'bori (بوری)', 'kg', 'crate', 'truck'],
    terminology: {
      productsLabel: { 'ur': 'اجناس و جنس', 'ur-roman': 'Commodities & Goods', 'pa': 'اجناس', 'sd': 'جنس', 'ps': 'جنس', 'en': 'Commodities' },
      salesLabel: { 'ur': 'نیلامی / بکری', 'ur-roman': 'Auction / Sales', 'pa': 'بکری', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'منڈی بیجک / بل', 'ur-roman': 'Mandi Bijak / Bill', 'pa': 'بیجک', 'sd': 'بل', 'ps': 'بل', 'en': 'Bills' },
      inventoryLabel: { 'ur': 'منڈی مال / آمد', 'ur-roman': 'Mandi Arrival / Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Arrivals' },
      customersLabel: { 'ur': 'خریدار / پارٹیاں', 'ur-roman': 'Parties / Buyers', 'pa': 'پارٹیاں', 'sd': 'ڌريون', 'ps': 'پیرودونکي', 'en': 'Parties' }
    },
    customFields: [
      { key: 'bori_count', label: { 'ur': 'تعداد بوری / پیٹی', 'ur-roman': 'Bori / Crates Count', 'pa': 'بوریاں', 'sd': 'ٻوريون', 'ps': 'بورۍ', 'en': 'Bags / Crates' }, type: 'number' },
      { key: 'katoti_weight', label: { 'ur': 'کاٹ / کٹوتی (کلو)', 'ur-roman': 'Katoti (kg)', 'pa': 'کاٹ', 'sd': 'ڪٽوتي', 'ps': 'کټوټي', 'en': 'Deduction' }, type: 'number' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا منڈی بل بنائیں', 'ur-roman': 'New Mandi Bill', 'pa': 'نواں بیجک', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, icon: 'Receipt', action: 'billing' }
    ]
  },
  commission: {
    id: 'commission',
    name: {
      'ur': 'کمیشن / دلالی',
      'ur-roman': 'Commission / Dalali',
      'pa': 'کمیشن / دلالی',
      'sd': 'ڪميشن / دلالي',
      'ps': 'کمیشن / دلالي',
      'en': 'Commission / Brokerage'
    },
    description: {
      'ur': 'تجارتی سودے، فریقین، کمیشن ریٹ اور وصولی و ادائیگی کا مکمل کھاتہ',
      'ur-roman': 'Tijarti soday, parties, commission rate aur wasooli record',
      'pa': 'سودے، کمیشن ریٹ تے دلال دا کھاتہ',
      'sd': 'سودا، ڪميشن ۽ وصولي جو کاتو',
      'ps': 'تجارتی معاملې، کمیشن او وصولي حساب',
      'en': 'Brokerage deals, parties, commission percentage and settlement ledger'
    },
    icon: 'Layers',
    defaultCategories: ['Property & Land', 'Livestock (مویشی)', 'Agriculture Produce', 'Commercial Deals'],
    unitOptions: ['deal', 'percentage', 'per_ton', 'per_acre', 'unit'],
    terminology: {
      productsLabel: { 'ur': 'سودے / معاہدے', 'ur-roman': 'Deals & Contracts', 'pa': 'سودے', 'sd': 'سودا', 'ps': 'معاملې', 'en': 'Deals' },
      salesLabel: { 'ur': 'طے شدہ سودے', 'ur-roman': 'Closed Deals', 'pa': 'سودے', 'sd': 'مڪمل سودا', 'ps': 'کړې معاملې', 'en': 'Closed Deals' },
      ordersOrBills: { 'ur': 'کمیشن واؤچر', 'ur-roman': 'Commission Voucher', 'pa': 'واؤچر', 'sd': 'واوچر', 'ps': 'واوچر', 'en': 'Vouchers' },
      inventoryLabel: { 'ur': 'زیرِ غور سودے', 'ur-roman': 'Pending Deals', 'pa': 'زیرِ غور', 'sd': 'زير غور', 'ps': 'روانې معاملې', 'en': 'Pipeline' },
      customersLabel: { 'ur': 'گاہک و فریقین', 'ur-roman': 'Clients & Parties', 'pa': 'پارٹیاں', 'sd': 'ڌريون', 'ps': 'پیرودونکي', 'en': 'Parties' }
    },
    customFields: [
      { key: 'commission_rate', label: { 'ur': 'کمیشن شرح (%)', 'ur-roman': 'Commission Rate (%)', 'pa': 'کمیشن شرح', 'sd': 'ڪميشن شرح', 'ps': 'کمیشن شرح', 'en': 'Commission %' }, type: 'number' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا واؤچر بنائیں', 'ur-roman': 'New Voucher', 'pa': 'نواں واؤچر', 'sd': 'نئون واوچر', 'ps': 'نوی واوچر', 'en': 'New Voucher' }, icon: 'Receipt', action: 'billing' }
    ]
  },
  transport: {
    id: 'transport',
    name: {
      'ur': 'ٹرانسپورٹ / مال برداری',
      'ur-roman': 'Transport / Logistics',
      'pa': 'ٹرانسپورٹ / اڈہ',
      'sd': 'ٽرانسپورٽ / گاڏيون',
      'ps': 'ټرانسپورټ / بار وړل',
      'en': 'Transport & Logistics'
    },
    description: {
      'ur': 'گاڑیاں، ڈرائیور، ڈیزل خرچہ، بلٹی، کرایہ اور ٹرپ کا کھاتہ',
      'ur-roman': 'Gaariyan, driver, diesel kharcha, bilti, kiraya aur trip hisaab',
      'pa': 'ٹرک، ڈرائیور، ڈیزل تے کرایہ دا کھاتہ',
      'sd': 'گاڏيون، ڊرائيور ۽ ڊيزل خرچ جو کاتو',
      'ps': 'موټر، ډریوران، تېل او بار وړلو حساب',
      'en': 'Fleet vehicles, drivers, freight bilti, fuel expense and trip profit ledger'
    },
    icon: 'Car',
    defaultCategories: ['Heavy Truck', 'Pickup Loader', 'Container', 'Oil Tanker'],
    unitOptions: ['trip', 'km', 'ton', 'bilti', 'day'],
    terminology: {
      productsLabel: { 'ur': 'گاڑیاں و روٹس', 'ur-roman': 'Vehicles & Routes', 'pa': 'گاڑیاں', 'sd': 'گاڏيون', 'ps': 'موټر', 'en': 'Fleet' },
      salesLabel: { 'ur': 'ٹرپ کرایہ و آمدنی', 'ur-roman': 'Trip Freight & Income', 'pa': 'کرایہ', 'sd': 'ڀاڙو', 'ps': 'کرايه', 'en': 'Freight' },
      ordersOrBills: { 'ur': 'بلٹی / ٹرپ انوائس', 'ur-roman': 'Bilti / Trip Invoice', 'pa': 'بلٹی', 'sd': 'بلٽي', 'ps': 'بلټي', 'en': 'Bilti' },
      inventoryLabel: { 'ur': 'موجود گاڑیاں', 'ur-roman': 'Available Fleet', 'pa': 'گاڑیاں', 'sd': 'گاڏيون', 'ps': 'موټر', 'en': 'Vehicles' },
      customersLabel: { 'ur': 'پارٹیاں و کلائنٹس', 'ur-roman': 'Shippers & Parties', 'pa': 'پارٹیاں', 'sd': 'ڌريون', 'ps': 'پیرودونکي', 'en': 'Parties' }
    },
    customFields: [
      { key: 'vehicle_number', label: { 'ur': 'گاڑی کا نمبر', 'ur-roman': 'Vehicle Reg #', 'pa': 'نمبر پلیٹ', 'sd': 'گاڏي نمبر', 'ps': 'د موټر ګڼه', 'en': 'Vehicle Reg' }, type: 'text' },
      { key: 'driver_name', label: { 'ur': 'ڈرائیور کا نام', 'ur-roman': 'Driver Name', 'pa': 'ڈرائیور دا ناں', 'sd': 'ڊرائيور نالو', 'ps': 'د ډریور نوم', 'en': 'Driver' }, type: 'text' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نئی بلٹی بنائیں', 'ur-roman': 'New Bilti', 'pa': 'نئی بلٹی', 'sd': 'نئين بلٽي', 'ps': 'نوې بلټي', 'en': 'New Bilti' }, icon: 'Receipt', action: 'billing' }
    ]
  },
  dairy: {
    id: 'dairy',
    name: {
      'ur': 'ڈیری / دودھ دہی',
      'ur-roman': 'Dairy / Milk Shop',
      'pa': 'ڈیری / کھیر دہی',
      'sd': 'ڊيري / کير ڏهي',
      'ps': 'ډیري / شیدې او مستې',
      'en': 'Dairy & Milk Shop'
    },
    description: {
      'ur': 'تازہ دودھ وصولی، فروخت، چکنائی، دہی، مکھن اور پنیر کا روزانہ حساب',
      'ur-roman': 'Taaza doodh wasooli, farokht, dahi, makhan aur daily hisaab',
      'pa': 'کھیر، دہی، مکھن تے ڈیری دا کھاتہ',
      'sd': 'کير، ڏهي ۽ مکڻ جو روزانو حساب',
      'ps': 'شیدې، مستې، کوچ او لبنیاتو حساب',
      'en': 'Fresh milk collection, fat testing, yogurt, butter & daily dairy ledger'
    },
    icon: 'Store',
    defaultCategories: ['Fresh Milk (دودھ)', 'Yogurt (دہی)', 'Butter & Ghee (مکھن و گھی)', 'Sweets / Khoya (کھویا)'],
    unitOptions: ['liter', 'kg', 'man', 'packet', 'cup'],
    terminology: {
      productsLabel: { 'ur': 'دودھ و ڈیری اشیاء', 'ur-roman': 'Milk & Dairy Items', 'pa': 'ڈیری مال', 'sd': 'کير ۽ ڏهي', 'ps': 'شیدې', 'en': 'Dairy Items' },
      salesLabel: { 'ur': 'روزانہ دودھ فروخت', 'ur-roman': 'Daily Milk Sales', 'pa': 'فروخت', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Daily Sales' },
      ordersOrBills: { 'ur': 'ڈیری پرچی / بل', 'ur-roman': 'Dairy Slip / Bill', 'pa': 'پرچی', 'sd': 'پرچي', 'ps': 'پرچي', 'en': 'Slip' },
      inventoryLabel: { 'ur': 'موجود دودھ / سٹاک', 'ur-roman': 'Available Milk / Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Available Milk' },
      customersLabel: { 'ur': 'گاہک و گھرانے', 'ur-roman': 'Customers & Households', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Households' }
    },
    customFields: [
      { key: 'fat_percentage', label: { 'ur': 'چکنائی / فیٹ (Fat %)', 'ur-roman': 'Fat %', 'pa': 'فیٹ', 'sd': 'فيٽ', 'ps': 'غوړوالي', 'en': 'Fat %' }, type: 'number' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نئی پرچی بنائیں', 'ur-roman': 'New Slip', 'pa': 'نئی پرچی', 'sd': 'نئين پرچي', 'ps': 'نوې پرچي', 'en': 'New Slip' }, icon: 'Receipt', action: 'billing' }
    ]
  },
  meat_shop: {
    id: 'meat_shop',
    name: {
      'ur': 'میٹ شاپ / گوشت کی دکان',
      'ur-roman': 'Meat Shop / Butcher',
      'pa': 'گوشت دی دکان / قصاب',
      'sd': 'گوشت جو دڪان / قصاب',
      'ps': 'د غوښې دوکان / قصابي',
      'en': 'Meat Shop & Butcher'
    },
    description: {
      'ur': 'مرغی، بکرے کا گوشت، بچھیا کا گوشت، وزن اور روزانہ کٹوتی و فروخت',
      'ur-roman': 'Murghi, bakra, beef, wazan aur daily farokht hisaab',
      'pa': 'مرغی، بکرے تے وچھیا دا گوشت',
      'sd': 'ڪڪڙ، ٻڪري ۽ ڳئون جو گوشت',
      'ps': 'د چرګ، پسونو او غوايي غوښې حساب',
      'en': 'Chicken, mutton, beef cuts, weighing balance and fresh daily butcher sales'
    },
    icon: 'UtensilsCrossed',
    defaultCategories: ['Broiler Chicken (مرغی)', 'Mutton (بکرا)', 'Beef (بچھیا)', 'Fish (مچھلی)'],
    unitOptions: ['kg', 'gram', 'piece', 'alive_kg'],
    terminology: {
      productsLabel: { 'ur': 'اقسامِ گوشت', 'ur-roman': 'Meat Cuts & Types', 'pa': 'گوشت', 'sd': 'گوشت', 'ps': 'غوښه', 'en': 'Meat Cuts' },
      salesLabel: { 'ur': 'گوشت فروخت', 'ur-roman': 'Meat Sales', 'pa': 'فروخت', 'sd': 'وڪرو', 'ps': 'پلور', 'en': 'Sales' },
      ordersOrBills: { 'ur': 'کیش پرچی / بل', 'ur-roman': 'Cash Slip / Bill', 'pa': 'پرچی', 'sd': 'پرچي', 'ps': 'پرچي', 'en': 'Bills' },
      inventoryLabel: { 'ur': 'زندہ / کٹا گوشت', 'ur-roman': 'Live / Dressed Stock', 'pa': 'سٹاک', 'sd': 'اسٽاڪ', 'ps': 'زېرمه', 'en': 'Stock' },
      customersLabel: { 'ur': 'گاہک و ہوٹل', 'ur-roman': 'Customers & Hotels', 'pa': 'گاہک', 'sd': 'گراهڪ', 'ps': 'پیرودونکي', 'en': 'Customers' }
    },
    customFields: [
      { key: 'live_weight', label: { 'ur': 'زندہ وزن (کلو)', 'ur-roman': 'Live Weight (kg)', 'pa': 'زندہ وزن', 'sd': 'جيئرو وزن', 'ps': 'ژوندی وزن', 'en': 'Live Weight' }, type: 'number' }
    ],
    quickActions: [
      { id: 'new_bill', label: { 'ur': 'نیا بل بنائیں', 'ur-roman': 'New Bill', 'pa': 'نواں بل', 'sd': 'نئون بل', 'ps': 'نوی بل', 'en': 'New Bill' }, icon: 'Receipt', action: 'billing' }
    ]
  }
};
