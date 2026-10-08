import { Product, Customer } from '../types';

export interface VoicePosAction {
  type: 'ADD_ITEM' | 'SET_CUSTOMER' | 'SET_PAYMENT_METHOD' | 'CLEAR_CART' | 'COMPLETE_SALE' | 'UNKNOWN';
  product?: Product;
  quantity?: number;
  unit?: string;
  customer?: Customer;
  paymentMethod?: 'cash' | 'jazzcash' | 'easypaisa' | 'bank' | 'credit';
  originalText: string;
  feedbackUrdu: string;
  feedbackEnglish: string;
}

// Multilingual quantity words mapping
const QUANTITY_WORDS: Record<string, number> = {
  // English / Roman
  'one': 1, '1': 1, 'ek': 1, 'aik': 1, 'ik': 1, 'yak': 1,
  'two': 2, '2': 2, 'do': 2, 'doe': 2, 'baa': 2, 'dwa': 2,
  'three': 3, '3': 3, 'teen': 3, 'tin': 3, 'tray': 3, 'tre': 3,
  'four': 4, '4': 4, 'chaar': 4, 'char': 4, 'salor': 4, 'chaar-': 4,
  'five': 5, '5': 5, 'paanch': 5, 'panch': 5, 'panj': 5, 'pinza': 5,
  'six': 6, '6': 6, 'chhay': 6, 'che': 6, 'chhe': 6, 'shpag': 6,
  'seven': 7, '7': 7, 'saat': 7, 'sat': 7, 'oova': 7,
  'eight': 8, '8': 8, 'aath': 8, 'ath': 8, 'ata': 8,
  'nine': 9, '9': 9, 'nau': 9, 'no': 9, 'nuh': 9,
  'ten': 10, '10': 10, 'das': 10, 'dah': 10, 'las': 10,
  'half': 0.5, 'aadha': 0.5, 'adha': 0.5, 'nim': 0.5,
  'paao': 0.25, 'paav': 0.25, 'pao': 0.25,
  'derh': 1.5, 'dhai': 2.5,

  // Urdu & Nastaliq
  'ایک': 1, 'دو': 2, 'تین': 3, 'چار': 4, 'پانچ': 5,
  'چھ': 6, 'سات': 7, 'آٹھ': 8, 'نو': 9, 'دس': 10,
  'آدھا': 0.5, 'پاؤ': 0.25, 'ڈیڑھ': 1.5, 'ڈھائی': 2.5,
  // Sindhi
  'هڪ': 1, 'ٻه': 2, 'ٽي': 3, 'پنج': 5, 'ڇهه': 6, 'ست': 7, 'اٺ': 8, 'ڏهه': 10,
  // Pashto
  'یو': 1, 'دوه': 2, 'درې': 3, 'څلور': 4, 'پنځه': 5, 'شپږ': 6, 'اووه': 7, 'اته': 8, 'نهه': 9, 'لس': 10
};

// Unit keywords mapping
const UNIT_WORDS: Record<string, string> = {
  'kilo': 'kg', 'kg': 'kg', 'kilos': 'kg', 'کل': 'kg', 'کلو': 'kg', 'کلوگرام': 'kg',
  'gram': 'gram', 'grams': 'gram', 'گرام': 'gram',
  'packet': 'packet', 'pack': 'packet', 'packets': 'packet', 'پیکٹ': 'packet', 'پيڪٽ': 'packet',
  'bottle': 'bottle', 'bottles': 'bottle', 'بوتل': 'bottle', 'بوتلیں': 'bottle',
  'carton': 'carton', 'cartons': 'carton', 'peti': 'carton', 'کارٹن': 'carton', 'پیٹی': 'carton',
  'dabba': 'box', 'box': 'box', 'boxes': 'box', 'ڈبہ': 'box', 'ڈبے': 'box',
  'dozen': 'dozen', 'darjan': 'dozen', 'درجن': 'dozen',
  'piece': 'piece', 'pieces': 'piece', 'dana': 'piece', 'dane': 'piece', 'عدد': 'piece', 'دانے': 'piece',
  'maund': 'man', 'man': 'man', 'mann': 'man', 'من': 'man',
  'bori': 'bori', 'katta': 'katta', 'بوری': 'bori', 'توڑا': 'katta', 'تھوڑا': 'katta',
  'crate': 'crate', 'کریٹ': 'crate'
};

/**
 * Normalizes text: converts Urdu numbers to digits, lowercase, trims punctuation
 */
export function normalizeVoiceText(text: string): string {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let res = text.toLowerCase();
  urduDigits.forEach((digit, idx) => {
    res = res.split(digit).join(idx.toString());
  });
  return res.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Parses spoken text into a deterministic, safe POS action
 */
export function parseVoicePosCommand(
  rawTranscript: string,
  products: Product[],
  customers: Customer[]
): VoicePosAction {
  const text = normalizeVoiceText(rawTranscript);

  // 1. Check for Sale Completion / Payment commands
  if (
    text.includes('sale cash') ||
    text.includes('cash mein') ||
    text.includes('cash me') ||
    text.includes('naqad') ||
    text.includes('نقد') ||
    text.includes('کیش') ||
    text.includes('سیل مکمل') ||
    text.includes('بل فائنل')
  ) {
    return {
      type: 'SET_PAYMENT_METHOD',
      paymentMethod: 'cash',
      originalText: rawTranscript,
      feedbackUrdu: 'کیش سیل سیٹ کر دی گئی۔',
      feedbackEnglish: 'Payment set to Cash.'
    };
  }

  if (
    text.includes('udhaar') ||
    text.includes('khata') ||
    text.includes('ادھار') ||
    text.includes('کھاتہ') ||
    text.includes('کاتو') ||
    text.includes('پور')
  ) {
    // Check if customer name mentioned
    let matchedCust: Customer | undefined;
    for (const c of customers) {
      if (text.includes(c.name.toLowerCase())) {
        matchedCust = c;
        break;
      }
    }

    return {
      type: 'SET_PAYMENT_METHOD',
      paymentMethod: 'credit',
      customer: matchedCust,
      originalText: rawTranscript,
      feedbackUrdu: matchedCust 
        ? `${matchedCust.name} کے کھاتے میں ادھار سیٹ کر دیا گیا۔` 
        : 'ادھار سیل سیٹ کی گئی۔ براہ کرم گاہک منتخب کریں۔',
      feedbackEnglish: matchedCust 
        ? `Credit set for customer ${matchedCust.name}.` 
        : 'Credit payment selected. Please select customer.'
    };
  }

  if (text.includes('jazzcash') || text.includes('جاز کیش') || text.includes('جازکیش')) {
    return {
      type: 'SET_PAYMENT_METHOD',
      paymentMethod: 'jazzcash',
      originalText: rawTranscript,
      feedbackUrdu: 'ادائیگی بذریعہ JazzCash منتخب ہوئی۔',
      feedbackEnglish: 'Payment method set to JazzCash.'
    };
  }

  if (text.includes('easypaisa') || text.includes('ایزی پیسہ') || text.includes('ایزیپیسہ')) {
    return {
      type: 'SET_PAYMENT_METHOD',
      paymentMethod: 'easypaisa',
      originalText: rawTranscript,
      feedbackUrdu: 'ادائیگی بذریعہ Easypaisa منتخب ہوئی۔',
      feedbackEnglish: 'Payment method set to Easypaisa.'
    };
  }

  if (text.includes('bank') || text.includes('بینک') || text.includes('بینک ٹرانسفر')) {
    return {
      type: 'SET_PAYMENT_METHOD',
      paymentMethod: 'bank',
      originalText: rawTranscript,
      feedbackUrdu: 'ادائیگی بذریعہ Bank Transfer منتخب ہوئی۔',
      feedbackEnglish: 'Payment method set to Bank Transfer.'
    };
  }

  // 2. Check for Clear Cart / Reset command
  if (
    text.includes('clear cart') ||
    text.includes('bill cancel') ||
    text.includes('بل کینسل') ||
    text.includes('خالی کرو') ||
    text.includes('صاف کرو')
  ) {
    return {
      type: 'CLEAR_CART',
      originalText: rawTranscript,
      feedbackUrdu: 'بل خالی کرنے کی کمانڈ وصول ہوئی۔',
      feedbackEnglish: 'Clear cart command received.'
    };
  }

  // 3. Product & Quantity Matching
  // Look for numeric quantity or quantity words in text
  let detectedQty = 1;
  let detectedUnit: string | undefined;

  // Split into words
  const words = text.split(' ');

  // Check for explicit digit (e.g. "2", "2.5", "10")
  const digitMatch = text.match(/\b(\d+(\.\d+)?)\b/);
  if (digitMatch) {
    const val = parseFloat(digitMatch[1]);
    if (!isNaN(val) && val > 0) {
      detectedQty = val;
    }
  } else {
    // Check word-based numbers
    for (const w of words) {
      if (QUANTITY_WORDS[w] !== undefined) {
        detectedQty = QUANTITY_WORDS[w];
        break;
      }
    }
  }

  // Detect unit
  for (const w of words) {
    if (UNIT_WORDS[w]) {
      detectedUnit = UNIT_WORDS[w];
      break;
    }
  }

  // Match best product from catalog
  let bestMatch: Product | null = null;
  let highestScore = 0;

  for (const p of products) {
    const pName = p.name.toLowerCase();
    const pCategory = p.category.toLowerCase();

    // Exact inclusion
    if (text.includes(pName)) {
      bestMatch = p;
      highestScore = 100;
      break;
    }

    // Token match
    const pTokens = pName.split(/[\s-]+/).filter(t => t.length > 2);
    let score = 0;
    for (const token of pTokens) {
      if (text.includes(token)) {
        score += 30;
      }
    }

    // Common synonyms
    if (
      (pName.includes('sugar') || pName.includes('cheeni') || pName.includes('چینی')) &&
      (text.includes('cheeni') || text.includes('chini') || text.includes('چینی') || text.includes('sugar'))
    ) {
      score += 50;
    }
    if (
      (pName.includes('flour') || pName.includes('aata') || pName.includes('atta') || pName.includes('آٹا')) &&
      (text.includes('aata') || text.includes('atta') || text.includes('آٹا') || text.includes('flour'))
    ) {
      score += 50;
    }
    if (
      (pName.includes('rice') || pName.includes('chawal') || pName.includes('چاول')) &&
      (text.includes('chawal') || text.includes('rice') || text.includes('چاول'))
    ) {
      score += 50;
    }
    if (
      (pName.includes('coke') || pName.includes('coca-cola') || pName.includes('کوک')) &&
      (text.includes('coke') || text.includes('coca cola') || text.includes('کوک'))
    ) {
      score += 50;
    }
    if (
      (pName.includes('oil') || pName.includes('ghee') || pName.includes('گھی') || pName.includes('تیل')) &&
      (text.includes('oil') || text.includes('ghee') || text.includes('گھی') || text.includes('تیل'))
    ) {
      score += 50;
    }
    if (
      (pName.includes('biscuit') || pName.includes('بسکٹ')) &&
      (text.includes('biscuit') || text.includes('biscuits') || text.includes('بسکٹ'))
    ) {
      score += 50;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = p;
    }
  }

  if (bestMatch && highestScore >= 30) {
    return {
      type: 'ADD_ITEM',
      product: bestMatch,
      quantity: detectedQty,
      unit: detectedUnit || bestMatch.unit,
      originalText: rawTranscript,
      feedbackUrdu: `${bestMatch.name} (${detectedQty} ${detectedUnit || bestMatch.unit}) بل میں شامل کر دیا گیا۔`,
      feedbackEnglish: `Added ${detectedQty} ${detectedUnit || bestMatch.unit} of ${bestMatch.name} to bill.`
    };
  }

  // 4. Customer mention
  for (const c of customers) {
    if (text.includes(c.name.toLowerCase())) {
      return {
        type: 'SET_CUSTOMER',
        customer: c,
        originalText: rawTranscript,
        feedbackUrdu: `گاہک ${c.name} منتخب ہو گئے۔`,
        feedbackEnglish: `Customer ${c.name} selected.`
      };
    }
  }

  return {
    type: 'UNKNOWN',
    originalText: rawTranscript,
    feedbackUrdu: `کمانڈ سمجھ نہیں آئی: "${rawTranscript}"۔ براہ کرم واضح بولیں، مثلاً: "دو کلو چینی" یا "Coke دو بوتل"۔`,
    feedbackEnglish: `Could not understand command: "${rawTranscript}". Try: "2 kilo sugar" or "Coke 2 bottles".`
  };
}
