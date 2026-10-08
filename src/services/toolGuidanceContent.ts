import { LanguageCode } from '../types';

export interface ToolGuideItem {
  id: string;
  name: Record<LanguageCode, string>;
  shortGuide: Record<LanguageCode, string>;
  detailedExplanation: Record<LanguageCode, string>;
  keyActions: Record<LanguageCode, string[]>;
}

export const TOOL_GUIDANCE_CATALOG: Record<string, ToolGuideItem> = {
  billing: {
    id: 'billing',
    name: {
      ur: 'پی او ایس کاؤنٹر (POS)',
      sd: 'پي او ايس ڪائونٽر',
      ps: 'د خرڅلاو کاؤنټر (POS)',
      pa: 'پی او ایس کاؤنٹر',
      en: 'Sales Counter (POS)',
      'ur-roman': 'Sales Counter (POS)',
    },
    shortGuide: {
      ur: 'یہ کاؤنٹر ہے۔ یہاں سے آپ گاہک کی نئی سیل بنا سکتے ہیں اور فوری بل جاری کر سکتے ہیں۔',
      sd: 'هي ڪائونٽر آهي۔ هتان اوهان گراهڪ جو نئون بل ٺاهي سگهو ٿا ۽ رسيد جاري ڪري سگهو ٿا۔',
      ps: 'دا کاؤنټر دی. دلته تاسو کولی شئ د پېرودونکي نوی بل جوړ کړئ او سمدستي رسید ورکړئ.',
      pa: 'اے کاؤنٹر اے۔ ایتھوں تسیں گاہک دا نواں بل بنا سکدے او۔',
      en: 'This is the Counter. Here you can generate new customer sales and issue instant bills.',
      'ur-roman': 'Ye Counter hai. Yahan se aap customer ki sale bana sakte hain aur fori raseed jari kar sakte hain.',
    },
    detailedExplanation: {
      ur: 'پی او ایس کاؤنٹر پر پروڈکٹس کو ایک ٹچ یا بارکوڈ اسکین سے منتخب کریں، مقدار درج کریں، کیش یا ادھار کا انتخاب کریں اور واٹس ایپ یا پرنٹر سے گاہک کو رسید شیئر کریں۔',
      sd: 'ڪائونٽر تي شيون بارڪوڊ يا لسٽ مان چونڊيو، ڪيش يا اوڌر لکو ۽ واٽس ايپ تي بل موڪليو۔',
      ps: 'په کاؤنټر کې توکي غوره کړئ، نغد یا پور ولیکئ او رسید په واټس اپ یا چاپي واستوئ.',
      pa: 'کاؤنٹر تے چیزاں چنو، کیش یا ادھار لکھو تے گاہک نوں واٹس ایپ تے رسید پیجو۔',
      en: 'On the POS Counter, pick products with one touch or barcode scan, choose cash or credit, and share instant digital receipts via WhatsApp or print.',
      'ur-roman': 'POS Counter par products select karein, cash ya udhaar set karein aur fori receipt WhatsApp ya print par share karein.',
    },
    keyActions: {
      ur: ['نئی سیل بنائیں', 'بارکوڈ اسکین کریں', 'واٹس ایپ پر رسید بھیجیں', 'ادھار یا کیش بل منتخب کریں'],
      sd: ['نئون بل ٺاهيو', 'بارڪوڊ اسڪين ڪريو', 'واٽس ايپ رسيد', 'اوڌر يا ڪيش'],
      ps: ['نوی بل جوړ کړئ', 'بارکوډ اسکین کړئ', 'واټس اپ رسید', 'نغد یا پور'],
      pa: ['نواں بل بناؤ', 'بارکوڈ اسکین کرو', 'واٹس ایپ بل', 'ادھار یا کیش'],
      en: ['Create New Sale', 'Scan Barcode', 'Share via WhatsApp', 'Select Cash or Credit'],
      'ur-roman': ['Naya bill banayein', 'Barcode scan karein', 'WhatsApp receipt', 'Cash ya Udhaar chunein'],
    },
  },

  products: {
    id: 'products',
    name: {
      ur: 'اسٹاک و سامان (Stock)',
      sd: 'اسٽاڪ ۽ شيون',
      ps: 'د زېرمې او توکو لړلیک',
      pa: 'سٹاک تے سامان',
      en: 'Stock & Inventory',
      'ur-roman': 'Stock & Inventory',
    },
    shortGuide: {
      ur: 'یہ اسٹاک ہے۔ یہاں آپ اپنے مال کی مقدار، قیمت اور دستیاب انوینٹری دیکھ سکتے ہیں۔',
      sd: 'هي اسٽاڪ آهي۔ هتي اوهان پنهنجي سامان جو مقدار ۽ قيمت چڪاس ڪري سگهو ٿا۔',
      ps: 'دا زېرمه ده. دلته تاسو د خپلو توکو مقدار، د پېرودلو او پلورلو بیه لیدلی شئ.',
      pa: 'اے سٹاک اے۔ ایتھے تسیں اپنے سامان دی تعداد تے ریٹ ویکھ سکدے او۔',
      en: 'This is Stock. Here you can view item quantities, buying/selling rates, and current inventory.',
      'ur-roman': 'Ye Stock hai. Yahan aap apne maal ki quantity aur available stock dekh sakte hain.',
    },
    detailedExplanation: {
      ur: 'اسٹاک ماڈیول میں نئے آئٹمز شامل کریں، کم اسٹاک کے الرٹس دیکھیں، خرید قیمت اور فروخت قیمت سیٹ کریں تاکہ ہر سیل پر صحیح منافع کا حساب لگ سکے۔',
      sd: 'هتي نئون سامان شامل ڪريو، گهٽ اسٽاڪ وارننگ ڏسو ۽ خريد ۽ وڪري جي اگهن جو حساب رکو۔',
      ps: 'دلته نوي توکي ورزیات کړئ، د کمې زېرمې خبرتیاوې وګورئ او د پیرلو او پلورلو بیې وټاکئ.',
      pa: 'ایتھے نوي آئٹمز پاؤ، گھٹ سٹاک الرٹ ویکھو تے نفعے دا حساب رکھو۔',
      en: 'Add new items, monitor low-stock warnings, and configure purchase/retail prices for accurate profit calculation.',
      'ur-roman': 'Stock module mein new items add karein, low stock alerts dekhein aur kharidari/selling prices configure karein.',
    },
    keyActions: {
      ur: ['نیا آئٹم شامل کریں', 'اسٹاک تعداد درست کریں', 'کم اسٹاک الرٹس چیک کریں'],
      sd: ['نئين شيءِ شامل ڪريو', 'اسٽاڪ درست ڪريو', 'الرٽ ڏسو'],
      ps: ['نوی توکی اضافه کړئ', 'زېرمه سمه کړئ', 'د خبرتیا څارنه'],
      pa: ['نویں پروڈکٹ پاؤ', 'سٹاک ایڈجسٹ کرو', 'گھٹ سٹاک ویکھو'],
      en: ['Add New Item', 'Adjust Stock Quantity', 'Review Low Stock Alerts'],
      'ur-roman': ['Naya item add karein', 'Stock adjust karein', 'Low stock alert dekhein'],
    },
  },

  khata: {
    id: 'khata',
    name: {
      ur: 'کھاتہ بک (Khata Ledger)',
      sd: 'کاتو ۽ اوڌر',
      ps: 'د کهاتې او پور کتاب',
      pa: 'کھاتہ تے ادھار رجسٹر',
      en: 'Khata Ledger',
      'ur-roman': 'Khata Ledger',
    },
    shortGuide: {
      ur: 'یہاں آپ گاہکوں کا ادھار، وصولیاں اور سپلائرز کے پیسوں کا حساب رکھ سکتے ہیں۔',
      sd: 'هتي اوهان گراهڪن جو اوڌار، وصوليون ۽ سپلائرز جي پئسن جو حساب رکي سگهو ٿا۔',
      ps: 'دلته تاسو د پېرودونکو پور، وصولي او د سپلائرانو د پيسو حساب ساتلی شئ.',
      pa: 'ایتھے تسیں گاہکاں دا ادھار، وصولی تے ڈیلراں دا حساب کتاب رکھ سکدے او۔',
      en: 'Here you can track customer credit (Udhaar), payments received, and supplier balances.',
      'ur-roman': 'Yahan aap customers ka udhaar aur payments ka hisaab rakh sakte hain.',
    },
    detailedExplanation: {
      ur: 'کھاتہ رجسٹر کے ذریعے کسی بھی گاہک کا الگ صفحہ کھولیں، ادھار دیں یا وصولی درج کریں اور ایک کلک سے گاہک کو واٹس ایپ پر بیلنس کا یاد دہانی میسج بھیجیں۔',
      sd: 'هتي گراهڪ جو نالو کوليو، اوڌر يا وصو لي لکو ۽ واٽس ايپ تي کاتي ميسيج موڪليو۔',
      ps: 'د هر پېرودونکي بېل حساب وڅارئ، پور او پیسې ثبت کړئ او واټس اپ یادونه ولېږئ.',
      pa: 'گاہک دا کھاتہ کھولو، ادھار یا وصولی لکھو تے واٹس ایپ تے بقایا یاد کراؤ۔',
      en: 'Open individual customer ledgers, record credit given or payments collected, and send 1-click WhatsApp balance reminders.',
      'ur-roman': 'Khata register se customer ka page kholein, udhaar ya wasooli darj karein aur WhatsApp par balance reminder bhejein.',
    },
    keyActions: {
      ur: ['نیا گاہک کھاتہ کھولیں', 'ادھار دیا درج کریں', 'رقم وصول ہوئی درج کریں', 'واٹس ایپ ریمائنڈر بھیجیں'],
      sd: ['نئون گراهڪ', 'اوڌر ڏنو', 'وصولي ملي', 'واٽس ايپ ميسيج'],
      ps: ['نوی پېرودونکی', 'پور ورکړل شو', 'پیسې ترلاسه شوې', 'واټس اپ یادونه'],
      pa: ['نواں کھاتہ بناؤ', 'ادھار دتا', 'رقم وصول ہوئی', 'واٹس ایپ یاد دہانی'],
      en: ['Add Customer Account', 'Record Credit Given', 'Record Payment Received', 'Send WhatsApp Reminder'],
      'ur-roman': ['Naya customer khata kholein', 'Udhaar diya likhein', 'Wasooli likhein', 'WhatsApp reminder bhejein'],
    },
  },

  expenses: {
    id: 'expenses',
    name: {
      ur: 'روزنامچہ و اخراجات (Expenses)',
      sd: 'روزنامچو ۽ خرچ',
      ps: 'ورځنی لګښت او روزنامچه',
      pa: 'روزنامچہ تے خرچے',
      en: 'Daily Expenses',
      'ur-roman': 'Daily Expenses',
    },
    shortGuide: {
      ur: 'یہاں آپ اپنے روزانہ کے دکان کے خرچے، چائے، بل اور کرایہ ریکارڈ کر سکتے ہیں۔',
      sd: 'هتي اوهان دڪان جا روزانو خرچ، چانهه، بل ۽ مسواڙ رڪارڊ ڪري سگهو ٿا۔',
      ps: 'دلته تاسو د دوکان ورځني لګښتونه لکه چای، د برېښنا بل او کرایه ثبتولی شئ.',
      pa: 'ایتھے تسیں دکان دے روز دے خرچے، چائے، بجلی بل تے کرایہ لکھ سکدے او۔',
      en: 'Here you can record daily shop expenses such as tea, utility bills, rent, and wages.',
      'ur-roman': 'Yahan aap apne rozana ke kharchay record kar sakte hain.',
    },
    detailedExplanation: {
      ur: 'روزانہ کے تمام چھوٹے بڑے اخراجات درج کریں تاکہ دن کے اختتام پر صحیح منافع اور کیش ان ہینڈ کا درست حساب مل سکے۔',
      sd: 'روزانو جا خرچ لکو ته جيئن ڏينهن جي آخر ۾ صحيح بچت ۽ ڪيش معلوم ٿئي۔',
      ps: 'د ورځې ټول لګښتونه ولیکئ ترڅو په پای کې د ګټې او نغدو پیسو سم حساب معلوم شي.',
      pa: 'سارے چھوٹے وڈے خرچے لکھو تاکہ دن دے آخر چ صحیح کیش تے بچت دا پتا لگے۔',
      en: 'Track all overhead costs to determine true net profits and reconcile closing cash accurately.',
      'ur-roman': 'Daily overheads record karein taake din ke aakhir mein sahi net profit aur cash maloom ho sake.',
    },
    keyActions: {
      ur: ['نیا خرچہ درج کریں', 'کیٹیگری منتخب کریں (چائے، کرایہ، بل)', 'ماہانہ خرچ کا خلاصہ دیکھیں'],
      sd: ['خرچ شامل ڪريو', 'ڪيٽيگري چونڊيو', 'مهيني جو خلاصو'],
      ps: ['لګښت ثبت کړئ', 'وېشنیزه وټاکئ', 'د میاشتې لګښت راپور'],
      pa: ['خرچہ لکھو', 'کیٹیگری چنو', 'ماہانہ ٹوٹل ویکھو'],
      en: ['Record Expense', 'Select Category (Tea, Rent, Utilities)', 'View Monthly Expense Summary'],
      'ur-roman': ['Naya kharcha likhein', 'Category select karein', 'Monthly summary dekhein'],
    },
  },

  reports: {
    id: 'reports',
    name: {
      ur: 'کاروباری رپورٹس و منافع (Reports)',
      sd: 'ڪاروباري رپورٽون',
      ps: 'د سوداګرۍ راپورونه او ګټه',
      pa: 'رپورٹس تے منافع',
      en: 'Business Reports & Analytics',
      'ur-roman': 'Business Reports & Analytics',
    },
    shortGuide: {
      ur: 'یہاں آپ سیلز، اخراجات، کل ادھار اور منافع کا مکمل حساب کتاب دیکھ سکتے ہیں۔',
      sd: 'هتي اوهان وڪري، خرچ، اوڌار ۽ منافعي جو مڪمل حساب ڏسي سگهو ٿا۔',
      ps: 'دلته تاسو د پلور، لګښتونو، پورونو او ګټې بشپړ راپور لیدلی شئ.',
      pa: 'ایتھے تسیں سیلز، خرچیاں، ادھار تے نفعے دا پورا کچا چٹھا ویکھ سکدے او۔',
      en: 'Here you can view sales, expenses, total outstanding credit, and net profit estimates.',
      'ur-roman': 'Yahan aap sales, expenses aur profit ka hisaab dekh sakte hain.',
    },
    detailedExplanation: {
      ur: 'کاروباری تجزیات میں روزانہ، ہفتہ وار اور ماہانہ گراف، زیادہ فروخت ہونے والی پروڈکٹس اور مجموعی منافع کا حقیقی اعداد و شمار دیکھا جا سکتا ہے۔',
      sd: 'رپورٽن ۾ روزانو ۽ هفتيوار وڪرو، گهڻو کپندڙ شيون ۽ اصل فائدو چڪاسيو۔',
      ps: 'په راپورونو کې ورځنی پلور، ډېر پلورل شوي توکي او د ګټې اندازه وڅارئ.',
      pa: 'رپورٹاں وچ روز دی سیل، سب توں ودھ وکن والا سامان تے بچت ویکھو۔',
      en: 'Analyze daily, weekly, and monthly trends, top-selling inventory, and calculated net business margins.',
      'ur-roman': 'Reports mein daily/monthly trends, top selling products aur accurate net profit margin dekhein.',
    },
    keyActions: {
      ur: ['آج کی کل سیلز دیکھیں', 'ماہانہ منافع کا جائزہ لیں', 'زیادہ فروخت ہونے والے آئٹمز دیکھیں'],
      sd: ['اڄ جو وڪرو', 'مهيني جو فائدو', 'گهڻو کپندڙ سامان'],
      ps: ['د نن ورځې پلور', 'د میاشتې ګټه', 'ډېر پلورل شوي توکي'],
      pa: ['اج دی کل سیل', 'مہینے دا نفعہ', 'ٹاپ سیلنگ اشیاء'],
      en: ['View Today’s Sales', 'Inspect Net Profit', 'Review Top-Selling Products'],
      'ur-roman': ['Aaj ki total sales dekhein', 'Monthly profit dekhein', 'Top selling items review karein'],
    },
  },

  purchases: {
    id: 'purchases',
    name: {
      ur: 'خریداری و مال آمد (Purchases)',
      sd: 'خريداري ۽ سپلائر بل',
      ps: 'پېرودنه او د مال راتګ',
      pa: 'خریداری تے سپلائر بل',
      en: 'Purchases & Restocking',
      'ur-roman': 'Purchases & Restocking',
    },
    shortGuide: {
      ur: 'یہاں آپ سپلائرز سے مال کی خریداری، نئے بل اور انوینٹری آمد درج کر سکتے ہیں۔',
      sd: 'هتي اوهان سپلائرز کان خريد ڪيل مال ۽ بل رڪارڊ ڪري سگهو ٿا۔',
      ps: 'دلته تاسو د سپلائرانو څخه د توکو پېرودل او نوي بلونه درج کولی شئ.',
      pa: 'ایتھے تسیں ڈیلراں کولوں مال دی خریداری تے بل درج کر سکدے او۔',
      en: 'Here you can record purchases from suppliers and restock incoming inventory.',
      'ur-roman': 'Yahan aap suppliers se maal ki kharidari aur bill record kar sakte hain.',
    },
    detailedExplanation: {
      ur: 'ہول سیلرز یا کمپنیوں سے آنے والے اسٹاک کے انوائس درج کریں جس سے خودکار طور پر سامان کی تعداد بڑھ جاتی ہے اور سپلائر کا واجب الادا کھاتہ اپڈیٹ ہو جاتا ہے۔',
      sd: 'سپلائرز جا بل لکو جنهن سان اسٽاڪ پاڻمرادو وڌي ويندو ۽ سپلائر کاتو درست ٿيندو۔',
      ps: 'د شرکتونو او عمده پلورونکو بلونه ثبت کړئ ترڅو زېرمه زیاته او حساب تازه شي.',
      pa: 'سپلائرز دے بل لکھو تا کہ سٹاک خودکار ودھ جاوے تے ڈیلر کھاتہ اپڈیٹ ہووے۔',
      en: 'Log invoices from wholesalers and distributors to automatically increase stock levels and update supplier payables.',
      'ur-roman': 'Suppliers se aane wale bills log karein taake stock automatically increase ho aur supplier balance update ho.',
    },
    keyActions: {
      ur: ['نئی خریداری درج کریں', 'سپلائر بل منسلک کریں', 'سٹاک میں اضافہ کریں'],
      sd: ['نئين خريداري', 'سپلائر بل', 'اسٽاڪ ۾ واڌ'],
      ps: ['نوې پېرودنه', 'د سپلائر بل', 'د زېرمې زیاتول'],
      pa: ['نویں خریداری پاؤ', 'ڈیلر بل', 'سٹاک ودھاؤ'],
      en: ['Record New Purchase', 'Attach Supplier Bill', 'Increase Stock Levels'],
      'ur-roman': ['Nayi purchase record karein', 'Supplier bill attach karein', 'Stock increase karein'],
    },
  },

  settings: {
    id: 'settings',
    name: {
      ur: 'سیٹنگز و شاپ بورڈ (Settings)',
      sd: 'سيٽنگز ۽ دڪان بورڊ',
      ps: 'ترتیبات او د دوکان بورډ',
      pa: 'سیٹنگز تے دکان بورڈ',
      en: 'Settings & Shop Profile',
      'ur-roman': 'Settings & Shop Profile',
    },
    shortGuide: {
      ur: 'یہاں آپ دکان کا نام، شاپ بورڈ، زبان، کاروبار کی قسم اور بیک اپ سیٹ کر سکتے ہیں۔',
      sd: 'هتي اوهان دڪان جو نالو، بورڊ، ٻولي ۽ بيڪ اپ سيٽ ڪري سگهو ٿا۔',
      ps: 'دلته تاسو د دوکان نوم، د دوکان تخته، ژبه او بیک اپ تنظیمولی شئ.',
      pa: 'ایتھے تسیں دکان دا نام، بورڈ، زبان تے کاروبار تبدیل کر سکدے او۔',
      en: 'Here you can configure shop identity, signboard, preferred language, business profile, and backups.',
      'ur-roman': 'Yahan aap dukan ki profile, raseed aur preferences set kar sakte hain.',
    },
    detailedExplanation: {
      ur: 'دکان کی مکمل پروفائل کنفیگر کریں، اپنا لوگو لگائیں یا خودکار لوگو منتخب کریں، بیک اپ ایکسپورٹ کریں اور کاروبار کی قسم تبدیل کریں۔',
      sd: 'پنهنجي دڪان جي مڪمل پروفائل ترتيب ڏيو، لوگو تبديل ڪريو ۽ بيڪ اپ رکو۔',
      ps: 'د دوکان بشپړ پروفایل تنظیم کړئ، لوګو وټاکئ او خپل معلومات بیک اپ کړئ.',
      pa: 'دکان دی پوری پروفائل سیٹ کرو، لوگو لاؤ تے بیک اپ محفوظ کرو۔',
      en: 'Manage full shop details, custom or automated signboard logos, database exports, and business profiles.',
      'ur-roman': 'Dukan ki full profile configure karein, logo set karein, backup export karein aur business type change karein.',
    },
    keyActions: {
      ur: ['کاروبار کی قسم تبدیل کریں', 'دکان کا نام و پتہ درست کریں', 'زبان تبدیل کریں', 'ڈیٹا بیک اپ ڈاؤن لوڈ کریں'],
      sd: ['ڪاروبار تبديل ڪريو', 'دڪان جو نالو', 'ٻولي مٽايو', 'بيڪ اپ وٺو'],
      ps: ['د سوداګرۍ ډول بدل کړئ', 'د دوکان نوم', 'ژبه بدله کړئ', 'بیک اپ ډاونلوډ'],
      pa: ['کاروبار دی قسم بدلو', 'دکان دا نام', 'زبان بدلو', 'بیک اپ ڈاؤن لوڈ'],
      en: ['Change Business Profile', 'Update Shop Name & Address', 'Switch Language', 'Export Data Backup'],
      'ur-roman': ['Business profile change karein', 'Shop name & address update karein', 'Language switch karein', 'Backup download karein'],
    },
  },

  ai_munshi: {
    id: 'ai_munshi',
    name: {
      ur: 'اے آئی منشی (AI Munshi)',
      sd: 'اي آءِ منشي',
      ps: 'ای آی منشي',
      pa: 'اے آئی منشی',
      en: 'AI Munshi Assistant',
      'ur-roman': 'AI Munshi Assistant',
    },
    shortGuide: {
      ur: 'یہ آپ کا ڈیجیٹل منشی ہے۔ آواز یا میسج سے سیلز، ادھار اور اسٹاک کا حساب پوچھ سکتے ہیں۔',
      sd: 'هي اوهان جو ڊجيٽل منشي آهي۔ آواز يا لکي سيلز، اوڌار ۽ اسٽاڪ پڇو۔',
      ps: 'دا ستاسو ډیجیټل منشي دی. په غږ یا لیکنې سره د پلور، پور او زېرمې پوښتنه وکړئ.',
      pa: 'اے تہاڈا ڈیجیٹل منشی اے۔ بول کے یا لکھ کے سیلز، ادھار تے سٹاک پچھو۔',
      en: 'This is your AI Munshi assistant. Ask questions or dictate sales, credit, and stock via voice or text.',
      'ur-roman': 'Ye aapka digital munshi hai. Awaz ya message se sales, udhaar aur stock ka hisaab maloom karein.',
    },
    detailedExplanation: {
      ur: 'اے آئی منشی سے آپ اردو، سندھی، پشتو، پنجابی، انگلش یا رومن اردو میں بات کر سکتے ہیں۔ یہ بغیر کسی انٹرنیٹ فیس کے آپ کے لیے تیز ترین مقامی رہنمائی اور حساب پیش کرتا ہے۔',
      sd: 'اي آءِ منشي سان سنڌي، اردو يا ٻين ٻولين ۾ ڳالهايو۔ هي تيز رفتار ڪم ڪندو۔',
      ps: 'له ای آی منشي سره په پښتو، اردو یا انګلیسي خبرې وکړئ ترڅو فوري حساب ترلاسه کړئ.',
      pa: 'منشی نال پنجابی یا اردو وچ گل کرو، اے تہاڈے سوالاں دا فوری جواب دیندا اے۔',
      en: 'AI Munshi responds in all 5 regional languages and Roman Urdu, executing local navigation and queries at zero API token cost.',
      'ur-roman': 'AI Munshi se aap Urdu, Sindhi, Pashto, Punjabi, English ya Roman Urdu mein baat kar sakte hain zero token cost par.',
    },
    keyActions: {
      ur: ['بول کر سیلز معلوم کریں', 'گاہک کا بقایا ادھار پوچھیں', 'کسی بھی ٹول کی رہنمائی حاصل کریں'],
      sd: ['آواز سان پڇو', 'اوڌار معلوم ڪريو', 'رهنمائي وٺو'],
      ps: ['په غږ پوښتنه وکړئ', 'د پېرودونکي پور وڅارئ', 'لارښوونه ترلاسه کړئ'],
      pa: ['بول کے سیلز پچھو', 'ادھار پچھو', 'رہنمائی لوو'],
      en: ['Ask via Voice', 'Query Customer Outstanding', 'Get Instant Tool Guidance'],
      'ur-roman': ['Bol kar sales maloom karein', 'Customer udhaar poochein', 'Tool guidance hasil karein'],
    },
  },
};

/**
 * Get tool guidance for a specific view or tool ID
 */
export function getToolGuidance(toolId: string, lang: LanguageCode = 'ur'): ToolGuideItem {
  // Map alternate IDs
  let key = toolId.toLowerCase();
  if (key === 'pos' || key === 'counter' || key === 'new_bill' || key === 'sale') key = 'billing';
  if (key === 'stock' || key === 'inventory' || key === 'items') key = 'products';
  if (key === 'udhaar' || key === 'ledger' || key === 'customers') key = 'khata';
  if (key === 'expense' || key === 'roznamcha' || key === 'daily_expenses') key = 'expenses';
  if (key === 'report' || key === 'analytics' || key === 'profit') key = 'reports';
  if (key === 'purchase' || key === 'suppliers') key = 'purchases';
  if (key === 'setting' || key === 'profile' || key === 'business_office') key = 'settings';
  if (key === 'munshi') key = 'ai_munshi';

  return TOOL_GUIDANCE_CATALOG[key] || TOOL_GUIDANCE_CATALOG['billing'];
}

/**
 * Check if the text matches "Ye kya hai?" or standard tool explanation questions
 */
export function isToolExplanationQuery(rawText: string): boolean {
  const clean = rawText.toLowerCase().trim();
  const patterns = [
    'ye kya hai',
    'ye kia hai',
    'yeh kya hai',
    'ye kya hy',
    'ye cheez kya hai',
    'iska kya kaam hai',
    'iska kya kam hai',
    'ye button kis liye hai',
    'ye button kis lie hai',
    'ye screen kya hai',
    'ye module kya hai',
    'isko kaise use karun',
    'isko kese use karein',
    'isko kaise chalana hai',
    'kese use karein',
    'kese use karna hai',
    'kese use hota hai',
    'ye kis kaam aata hai',
    'kya kaam karta hai',
    'یہ کیا ہے',
    'اس کا کیا کام ہے',
    'یہ بٹن کس لئے ہے',
    'اس کو کیسے استعمال کریں',
    'اسکرین کیا ہے',
    'کیسے چلائیں',
    'ہی ڇا آهي',
    'هن جو ڇا ڪم آهي',
    'هي ڪيئن استعمال ڪجي',
    'دا څه شی دی',
    'دا د څه لپاره دی',
    'دا څنګه وکاروم',
    'اے کی اے',
    'ایہدا کی کم اے',
    'کیوں استعمال کریے',
    'what is this',
    'how to use this',
    'what is this screen',
    'what does this do',
    'how does this work',
  ];

  for (const p of patterns) {
    if (clean.includes(p)) return true;
  }
  return false;
}

/**
 * Extract which specific tool is being asked about in text (e.g., "Counter kya hai", "Stock kya hai", "Khata kya hai")
 */
export function matchToolFromQuery(rawText: string, fallbackView?: string): string {
  const lower = rawText.toLowerCase();

  if (lower.includes('counter') || lower.includes('کاؤنٹر') || lower.includes('pos') || lower.includes('پی او ایس') || lower.includes('بلنگ') || lower.includes('billing')) {
    return 'billing';
  }
  if (lower.includes('stock') || lower.includes('سٹاک') || lower.includes('اسٹاک') || lower.includes('انوینٹری') || lower.includes('پروڈکٹ') || lower.includes('products')) {
    return 'products';
  }
  if (lower.includes('khata') || lower.includes('کھاتہ') || lower.includes('کاتو') || lower.includes('کهاته') || lower.includes('udhaar') || lower.includes('ادھار') || lower.includes('ledger')) {
    return 'khata';
  }
  if (lower.includes('expense') || lower.includes('خرچہ') || lower.includes('خرچ') || lower.includes('روزنامچہ') || lower.includes('روزنامچو') || lower.includes('لګښت')) {
    return 'expenses';
  }
  if (lower.includes('report') || lower.includes('رپورٹ') || lower.includes('منافع') || lower.includes('فائدو') || lower.includes('ګټه')) {
    return 'reports';
  }
  if (lower.includes('purchase') || lower.includes('خریداری') || lower.includes('خريداري') || lower.includes('پېرودنه') || lower.includes('سپلائر')) {
    return 'purchases';
  }
  if (lower.includes('setting') || lower.includes('سیٹنگ') || lower.includes('پروفائل') || lower.includes('profile')) {
    return 'settings';
  }
  if (lower.includes('munshi') || lower.includes('منشی') || lower.includes('منشي') || lower.includes('assistant')) {
    return 'ai_munshi';
  }

  // If no explicit tool named in query, fall back to current screen
  if (fallbackView) {
    if (fallbackView === 'dashboard') return 'billing';
    return fallbackView;
  }

  return 'billing';
}
