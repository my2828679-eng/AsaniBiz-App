import { Product, Customer } from '../types';

export interface VoicePOSResult {
  action: 'add_product' | 'checkout_cash' | 'set_payment_credit' | 'select_customer' | 'unknown';
  product?: Product;
  quantity?: number;
  unit?: string;
  customer?: Customer;
  feedback: string;
  feedbackType: 'success' | 'warning' | 'info';
}

/**
 * Deterministic Voice Command & Product Recognition Parser for AsaniBiz Counter
 */
export function parseVoicePOSCommand(
  text: string,
  products: Product[],
  customers: Customer[]
): VoicePOSResult {
  if (!text || !text.trim()) {
    return {
      action: 'unknown',
      feedback: 'کوئی آواز موصول نہیں ہوئی۔ دوبارہ بولیں۔',
      feedbackType: 'warning',
    };
  }

  const raw = text.toLowerCase().trim();

  // 1. Cash Checkout / Finalize commands
  if (
    raw.includes('cash mein') ||
    raw.includes('cash karo') ||
    raw.includes('sale final') ||
    raw.includes('bill final') ||
    raw.includes('complete sale') ||
    raw.includes('کیش میں کرو') ||
    raw.includes('کیش کرو') ||
    raw.includes('سیل فائنل') ||
    raw.includes('بل فائنل') ||
    raw.includes('نقد کرو') ||
    raw.includes('نقد سیل')
  ) {
    return {
      action: 'checkout_cash',
      feedback: 'سیل نقد پر فائنل کی جا رہی ہے...',
      feedbackType: 'success',
    };
  }

  // 2. Udhaar / Credit payment mode
  if (
    raw.includes('udhaar') ||
    raw.includes('ادھار') ||
    raw.includes('khata') ||
    raw.includes('کھاتہ') ||
    raw.includes('ادھار میں کرو')
  ) {
    return {
      action: 'set_payment_credit',
      feedback: 'ادھار / کھاتہ موڈ منتخب ہو گیا',
      feedbackType: 'info',
    };
  }

  // 3. Customer detection
  for (const c of customers || []) {
    const cNameLower = (c?.name || '').toLowerCase().trim();
    if (!cNameLower) continue;
    const firstPart = cNameLower.split(' ')[0];
    if (raw.includes(cNameLower) || (firstPart.length > 2 && raw.includes(firstPart))) {
      return {
        action: 'select_customer',
        customer: c,
        feedback: `گاہک منتخب ہو گیا: ${c.name}`,
        feedbackType: 'success',
      };
    }
  }

  // 4. Quantity Parsing (Urdu, Roman Urdu, Sindhi, Punjabi, English)
  let qty = 1;
  let customUnit: string | undefined = undefined;

  // Fractions & Special quantities
  if (raw.includes('aadha') || raw.includes('آدھا') || raw.includes('half')) qty = 0.5;
  else if (raw.includes('pao') || raw.includes('پاؤ') || raw.includes('paao')) qty = 0.25;
  else if (raw.includes('derh') || raw.includes('ڈیڑھ') || raw.includes('dedh')) qty = 1.5;
  else if (raw.includes('dhai') || raw.includes('ڈھائی') || raw.includes('dhaee')) qty = 2.5;
  // Whole numbers
  else if (raw.includes('ek') || raw.includes('ایک') || raw.includes('one') || raw.includes('ہک')) qty = 1;
  else if (raw.includes('do') || raw.includes('دو') || raw.includes('two') || raw.includes('ٻه')) qty = 2;
  else if (raw.includes('teen') || raw.includes('تین') || raw.includes('three') || raw.includes('ٽي')) qty = 3;
  else if (raw.includes('char') || raw.includes('چار') || raw.includes('four')) qty = 4;
  else if (raw.includes('panch') || raw.includes('پانچ') || raw.includes('five') || raw.includes('پنج')) qty = 5;
  else if (raw.includes('che') || raw.includes('چھ') || raw.includes('six')) qty = 6;
  else if (raw.includes('saat') || raw.includes('سات') || raw.includes('seven')) qty = 7;
  else if (raw.includes('aath') || raw.includes('آٹھ') || raw.includes('eight')) qty = 8;
  else if (raw.includes('nau') || raw.includes('نو') || raw.includes('nine')) qty = 9;
  else if (raw.includes('das') || raw.includes('دس') || raw.includes('ten') || raw.includes('دھ')) qty = 10;
  else if (raw.includes('barah') || raw.includes('بارہ') || raw.includes('twelve') || raw.includes('درجن') || raw.includes('dozen')) {
    qty = raw.includes('درجن') || raw.includes('dozen') ? 12 : 12;
  } else if (raw.includes('bees') || raw.includes('بیس') || raw.includes('twenty')) qty = 20;
  else if (raw.includes('chalis') || raw.includes('چالیس') || raw.includes('forty')) qty = 40;
  else if (raw.includes('pachas') || raw.includes('پچاس') || raw.includes('fifty')) qty = 50;

  // Direct numeric match in text (e.g. "5 coke", "2.5 kg atta", "12")
  const numMatch = raw.match(/(\d+\.?\d*)/);
  if (numMatch) {
    const parsed = parseFloat(numMatch[1]);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
      qty = parsed;
    }
  }

  // Detect Unit hints
  if (raw.includes('kilo') || raw.includes('کلو') || raw.includes('kg')) customUnit = 'کلو';
  else if (raw.includes('liter') || raw.includes('لیٹر') || raw.includes('litre')) customUnit = 'لیٹر';
  else if (raw.includes('packet') || raw.includes('پیکٹ')) customUnit = 'پیکٹ';
  else if (raw.includes('bottle') || raw.includes('بوتل')) customUnit = 'بوتل';
  else if (raw.includes('dabba') || raw.includes('ڈبہ')) customUnit = 'ڈبہ';
  else if (raw.includes('darjan') || raw.includes('درجن')) customUnit = 'درجن';

  // 5. Product detection against catalog
  let matchedProduct: Product | null = null;

  // Direct full-name match
  for (const p of products) {
    const pNameLower = p.name.toLowerCase().trim();
    if (raw.includes(pNameLower)) {
      matchedProduct = p;
      break;
    }
  }

  // Token-based matching
  if (!matchedProduct) {
    for (const p of products) {
      const pNameLower = p.name.toLowerCase();
      const words = pNameLower.split(/[\s-]+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (raw.includes(w)) {
          matchedProduct = p;
          break;
        }
      }
      if (matchedProduct) break;
    }
  }

  // Pakistani Retail / Grocery / Mandi Synonyms
  if (!matchedProduct) {
    if (raw.includes('cheeni') || raw.includes('چینی') || raw.includes('sugar') || raw.includes('کھنڈ')) {
      matchedProduct = products.find((p) => /sugar|cheeni|چینی|کھنڈ/i.test(p.name)) || null;
    } else if (raw.includes('coke') || raw.includes('کوک') || raw.includes('cola') || raw.includes('pepsi') || raw.includes('پیپسی')) {
      matchedProduct = products.find((p) => /coke|cola|کوک|pepsi|پیپسی/i.test(p.name)) || null;
    } else if (raw.includes('atta') || raw.includes('آٹا') || raw.includes('flour') || raw.includes('کنک')) {
      matchedProduct = products.find((p) => /atta|flour|آٹا/i.test(p.name)) || null;
    } else if (raw.includes('oil') || raw.includes('tel') || raw.includes('تیل') || raw.includes('گھی') || raw.includes('ghee') || raw.includes('dalda')) {
      matchedProduct = products.find((p) => /oil|ghee|تیل|گھی|dalda/i.test(p.name)) || null;
    } else if (raw.includes('chawal') || raw.includes('چاول') || raw.includes('rice')) {
      matchedProduct = products.find((p) => /chawal|rice|چاول|basmati|سیلا/i.test(p.name)) || null;
    } else if (raw.includes('doodh') || raw.includes('دودھ') || raw.includes('milk') || raw.includes('کیر')) {
      matchedProduct = products.find((p) => /milk|doodh|دودھ|کیر/i.test(p.name)) || null;
    } else if (raw.includes('chai') || raw.includes('چائے') || raw.includes('tea') || raw.includes('پتی')) {
      matchedProduct = products.find((p) => /tea|chai|چائے|پتی|tapal|lipton/i.test(p.name)) || null;
    } else if (raw.includes('biscuit') || raw.includes('بسکٹ') || raw.includes('بسکوٹ')) {
      matchedProduct = products.find((p) => /biscuit|بسکٹ|super|sooper|rio|prince/i.test(p.name)) || null;
    } else if (raw.includes('saban') || raw.includes('صابن') || raw.includes('soap')) {
      matchedProduct = products.find((p) => /soap|saban|صابن|lux|dettol|safeguard/i.test(p.name)) || null;
    } else if (raw.includes('daal') || raw.includes('dal') || raw.includes('دال')) {
      matchedProduct = products.find((p) => /daal|dal|دال/i.test(p.name)) || null;
    } else if (raw.includes('panadol') || raw.includes('پیناڈول') || raw.includes('paracetamol')) {
      matchedProduct = products.find((p) => /panadol|پیناڈول|paracetamol/i.test(p.name)) || null;
    } else if (raw.includes('anda') || raw.includes('anday') || raw.includes('انڈے') || raw.includes('انڈا') || raw.includes('egg')) {
      matchedProduct = products.find((p) => /egg|anda|anday|انڈے|انڈا/i.test(p.name)) || null;
    }
  }

  // If matched
  if (matchedProduct) {
    const finalUnit = customUnit || matchedProduct.unit || 'عدد';
    return {
      action: 'add_product',
      product: matchedProduct,
      quantity: qty,
      unit: finalUnit,
      feedback: `شامل کیا گیا: ${qty} ${finalUnit} ${matchedProduct.name}`,
      feedbackType: 'success',
    };
  }

  // Fallback: If not matched
  return {
    action: 'unknown',
    feedback: `آواز موصول ہوئی: "${text}" — کوئی پروڈکٹ نہیں ملا۔ نام اور تعداد واضح بولیں۔`,
    feedbackType: 'warning',
  };
}
