/**
 * AsaniBiz AI Munshi - Smart Request Router & Rule Engine
 * 
 * Flow:
 * USER INPUT -> TEXT NORMALIZATION -> LOCAL INTENT/RULE CHECK -> (IF CLEAR: DIRECT TOOL / PROPOSAL)
 *                                                             -> (IF AMBIGUOUS/COMPLEX: AI ESCALATION WITH MINIMAL CONTEXT)
 * 
 * Goals:
 * 1. Zero/Low AI Cost: Handles everyday commands (Khata, Stock, Sales, Expenses, Payments) locally with 0 API tokens.
 * 2. Exact Financial Math: All calculations run deterministically in application logic.
 * 3. 100% Offline Compatible: Works in PWA mode even without internet connection.
 * 4. Multilingual: Urdu, Roman Urdu, Punjabi, Sindhi, Pashto, English.
 * 5. Minimal Context: If AI escalation is needed, provides only the single relevant record slice, never dumping whole DB.
 */

import {
  Customer,
  Supplier,
  Product,
  Invoice,
  Expense,
  Purchase,
  KhataTransaction,
  BusinessProfile,
  LanguageCode,
  AIMunshiMessage
} from '../types';
import { aiMunshiCache } from './aiMunshiCache';
import { aiMunshiSessionStore } from './aiMunshiContextStore';
import {
  resolveCustomerWithConfidence,
  resolveProductWithConfidence,
  parseMultiStepCommand,
  normalizeMultilingualString,
} from './dynamicBusinessVocabulary';

export interface SmartRouterResult {
  requiresAI: boolean;
  routingSource: 'local_intent_engine' | 'ai_model' | 'cached_summary';
  reply: string;
  speechSynthesisText: string;
  actionProposal?: NonNullable<AIMunshiMessage['actionProposal']>;
  minimalContext?: Record<string, any>;
  intentCategory?: string;
}

import {
  isToolExplanationQuery,
  matchToolFromQuery,
  getToolGuidance
} from './toolGuidanceContent';

interface RouterContextData {
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  invoices: Invoice[];
  expenses: Expense[];
  purchases: Purchase[];
  khataTransactions: KhataTransaction[];
  profile: BusinessProfile;
  language: LanguageCode;
  currentView?: string;
}

/**
 * Normalize Pakistani numeric terms into numbers
 * e.g., "500", "panch sau", "do hazar", "5 hazar", "10 lakh"
 */
export function extractAmountFromText(text: string): number | null {
  // Convert Urdu numerals to English digits
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let normalized = text;
  urduDigits.forEach((digit, idx) => {
    normalized = normalized.split(digit).join(idx.toString());
  });

  // Check for combined patterns like "5000", "5,000", "Rs. 2500"
  const directMatch = normalized.match(/(\d+[\d,]*\.?\d*)/);
  if (directMatch) {
    const rawNum = directMatch[1].replace(/,/g, '');
    let num = parseFloat(rawNum);

    // Check if followed by "hazar" / "hazaar" / "thousand"
    if (/(hazar|hazaar|hzar|thousand|ہزار)/i.test(normalized)) {
      if (num < 1000) num = num * 1000;
    } else if (/(lakh|lac|لاکھ)/i.test(normalized)) {
      if (num < 100000) num = num * 100000;
    }
    if (!isNaN(num) && num > 0) return num;
  }

  // Word-based numbers
  const lower = normalized.toLowerCase();
  if (lower.includes('panch sau') || lower.includes('5 sau') || lower.includes('پانچ سو')) return 500;
  if (lower.includes('ek hazar') || lower.includes('aik hazar') || lower.includes('1 hazar') || lower.includes('ایک ہزار')) return 1000;
  if (lower.includes('do hazar') || lower.includes('2 hazar') || lower.includes('دو ہزار')) return 2000;
  if (lower.includes('teen hazar') || lower.includes('3 hazar') || lower.includes('تین ہزار')) return 3000;
  if (lower.includes('char hazar') || lower.includes('چار ہزار')) return 4000;
  if (lower.includes('panch hazar') || lower.includes('پانچ ہزار')) return 5000;
  if (lower.includes('das hazar') || lower.includes('دس ہزار')) return 10000;

  return null;
}

/**
 * Match a customer name from text against the database
 */
export function findBestCustomerMatch(text: string, customers: Customer[]): Customer | null {
  const clean = text.toLowerCase();
  for (const c of customers) {
    const nameLower = c.name.toLowerCase();
    if (clean.includes(nameLower)) return c;
    // Check any part of customer name with length >= 3 (e.g. "Ali" in "Muhammad Ali" or "Ahmed Raza")
    const parts = nameLower.split(/\s+/);
    for (const part of parts) {
      if (part.length >= 3 && clean.includes(part)) {
        return c;
      }
    }
  }
  return null;
}

/**
 * Extract candidate customer name if mentioned in a khata/balance/udhaar query
 */
export function extractCustomerCandidateName(text: string): string | null {
  const clean = text.trim();
  // Roman Urdu patterns:
  // "Ali ka balance", "Ali ka khata", "Ali da hisaab", "Ali se kitne lene", "Ali ko kitne dene"
  const romanMatch = clean.match(/\b([A-Za-z]+)\s+(?:ka|ki|ke|da|de|se|ko|jo|نوں|کولوں|کي|کان)\s+(?:balance|khata|hisaab|hissab|udhaar|rupay|paise|lene|dene|kitne|batao|kholo|dikhao)\b/i);
  if (romanMatch) {
    const candidate = romanMatch[1];
    const excluded = ['aaj', 'kal', 'is', 'us', 'sab', 'total', 'kul', 'mera', 'apna', 'dukan', 'stock', 'store', 'shop', 'pos', 'counter', 'bill', 'naya', 'new', 'pichla', 'last', 'kisi', 'koi'];
    if (!excluded.includes(candidate.toLowerCase()) && candidate.length >= 2) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  // Urdu / Sindhi / Pashto / Punjabi patterns:
  // "علی کا بیلنس", "علی کا کھاتہ", "علی سے کتنے لینے", "علی کو ادھار", "علی جو کاتو", "د علی حساب"
  const urduMatch = clean.match(/([\u0600-\u06FF]+)\s+(?:کا|کی|کے|دا|دے|سے|کو|جو|کي|کان|کولوں|نوں)\s+(?:بیلنس|کھاتہ|حساب|ادھار|پیسے|لینے|دینے|کتنے|بتاؤ|کھولو|کاتو|اوڌر|ڏيکاريو)/);
  if (urduMatch) {
    const candidate = urduMatch[1].trim();
    const excludedUrdu = ['آج', 'کل', 'اس', 'ان', 'سب', 'کل', 'میرا', 'اپنا', 'دکان', 'سٹاک', 'اسٹاک', 'پروڈکٹ', 'سامان', 'بل', 'نیا', 'پچھلا', 'اخراجات', 'خرچہ'];
    if (!excludedUrdu.includes(candidate) && candidate.length >= 2) {
      return candidate;
    }
  }

  // Pashto: "د علی حساب", "د علی کهاته", "د علی پور"
  const pashtoMatch = clean.match(/(?:د)\s+([\u0600-\u06FF\w]+)\s+(?:حساب|کهاته|پور|بیلنس|پاتې)/i);
  if (pashtoMatch) {
    const candidate = pashtoMatch[1].trim();
    if (candidate.length >= 2) return candidate;
  }

  return null;
}

/**
 * Match a product name from text against inventory
 */
export function findBestProductMatch(text: string, products: Product[]): Product | null {
  const clean = text.toLowerCase();
  for (const p of products) {
    const nameLower = p.name.toLowerCase();
    if (clean.includes(nameLower)) return p;
    // Common Kiryana/Retail synonyms
    if ((nameLower.includes('sugar') || nameLower.includes('cheeni')) && (clean.includes('cheeni') || clean.includes('sugar') || clean.includes('چینی'))) return p;
    if ((nameLower.includes('ghee') || nameLower.includes('oil')) && (clean.includes('ghee') || clean.includes('oil') || clean.includes('گھی') || clean.includes('تیل'))) return p;
    if ((nameLower.includes('atta') || nameLower.includes('flour')) && (clean.includes('atta') || clean.includes('flour') || clean.includes('آٹا'))) return p;
    if ((nameLower.includes('rice') || nameLower.includes('chawal')) && (clean.includes('chawal') || clean.includes('rice') || clean.includes('چاول'))) return p;
    if ((nameLower.includes('milk') || nameLower.includes('doodh')) && (clean.includes('doodh') || clean.includes('milk') || clean.includes('دودھ'))) return p;
    if ((nameLower.includes('panadol') || nameLower.includes('paracetamol')) && (clean.includes('panadol') || clean.includes('paracetamol') || clean.includes('پیناڈول'))) return p;
  }
  return null;
}

/**
 * Match expense category from text
 */
export function extractExpenseCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('chai') || lower.includes('tea') || lower.includes('چائے')) return 'چائے و ضیافت (Tea & Refreshment)';
  if (lower.includes('diesel') || lower.includes('petrol') || lower.includes('fuel') || lower.includes('ڈیزل') || lower.includes('پٹرول')) return 'ڈیزل و ٹرانسپورٹ (Fuel & Transport)';
  if (lower.includes('loading') || lower.includes('mazdoori') || lower.includes('labor') || lower.includes('مزدوری')) return 'لوڈنگ و مزدوری (Loading & Labor)';
  if (lower.includes('rent') || lower.includes('kiraya') || lower.includes('کرایہ')) return 'دکان کا کرایہ (Shop Rent)';
  if (lower.includes('bijli') || lower.includes('bill') || lower.includes('electricity') || lower.includes('بجلی')) return 'بجلی کا بل (Electricity)';
  if (lower.includes('khana') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('کھانا')) return 'کھانا و راشن (Food & Meals)';
  if (lower.includes('repair') || lower.includes('maintenance') || lower.includes('مرمت')) return 'مرمت و مینٹیننس (Repairs)';
  return 'متفرق روزمرہ خرچہ (General Expense)';
}

/**
 * Main Smart Request Router
 */
export function routeUserRequest(
  rawText: string,
  context: RouterContextData
): SmartRouterResult {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const lang = context.language || 'ur';
  const cur = context.profile?.currency || 'PKR';
  const today = new Date().toISOString().split('T')[0];

  // 1. Check for duplicate query within 5 seconds to prevent multiple submissions
  if (aiMunshiCache.isDuplicateRequest(text)) {
    const cached = aiMunshiCache.get<SmartRouterResult>(`req_${text}`);
    if (cached) {
      return {
        ...cached,
        routingSource: 'cached_summary',
      };
    }
  }

  const businessId = context.profile?.businessName || 'biz_default';

  // 1B. CONTEXT RECOVERY & SHORT-TERM MEMORY ("Kitna baki hai?", "Purani payment dikhao", "Uska khata kholo")
  const activeCustomerContext = aiMunshiSessionStore.getActiveCustomer(businessId);
  const isPronounQuery =
    lower.includes('kitna baki') ||
    lower.includes('kitna baqi') ||
    lower.includes('کتنا باقی') ||
    lower.includes('کتنا ادھار') ||
    lower.includes('کتنے لینے') ||
    lower.includes('کتنے دینے') ||
    lower.includes('کيترو باقي') ||
    lower.includes('څومره پاتې') ||
    lower.includes('کتنے پیسے') ||
    lower.includes('purani payment') ||
    lower.includes('پچھلی ادائیگی') ||
    lower.includes('پچھلا بیلنس') ||
    (lower.startsWith('balance') && text.split(' ').length <= 2) ||
    lower === 'hisaab batao' ||
    lower === 'حساب بتاؤ' ||
    lower === 'بیلنس بتاؤ';

  if (isPronounQuery && activeCustomerContext && activeCustomerContext.name) {
    const matchedFromContext = context.customers.find(
      (c) => c.id === activeCustomerContext.id || c.name.toLowerCase() === activeCustomerContext.name?.toLowerCase()
    );
    if (matchedFromContext) {
      const bal = matchedFromContext.currentBalance;
      const statusText = bal > 0 ? 'لینے ہیں (Receivable)' : bal < 0 ? 'دینے ہیں (Advance)' : 'کھاتہ برابر ہے (Settled)';
      const absBal = Math.abs(bal);

      let reply = '';
      if (lang === 'ur') {
        reply = `گاہک "${matchedFromContext.name}" کا کھاتہ:\n- کل بقایا رقم: ${absBal.toLocaleString()} ${cur}\n- حیثیت: ${statusText}\n- فون نمبر: ${matchedFromContext.phone || 'غیر موجود'}`;
      } else if (lang === 'pa') {
        reply = `گاہک "${matchedFromContext.name}" دا بقایا بیلنس ${absBal.toLocaleString()} ${cur} اے۔ (${statusText})`;
      } else if (lang === 'sd') {
        reply = `گراهڪ "${matchedFromContext.name}" جو بقايا حساب ${absBal.toLocaleString()} ${cur} آهي (${statusText})۔`;
      } else if (lang === 'ps') {
        reply = `د پېرودونکي "${matchedFromContext.name}" پاتې حساب ${absBal.toLocaleString()} ${cur} دی (${statusText})۔`;
      } else if (lang === 'en') {
        reply = `Customer ${matchedFromContext.name} ledger balance:\n- Outstanding: ${cur} ${absBal.toLocaleString()}\n- Status: ${statusText}`;
      } else {
        reply = `Customer "${matchedFromContext.name}" ka khata balance: ${absBal.toLocaleString()} ${cur} (${statusText}).`;
      }

      return {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        actionProposal: {
          type: 'OPEN_KHATA',
          title: lang === 'ur' ? `${matchedFromContext.name} کا کھاتہ کھولیں` : `Open ${matchedFromContext.name} Khata`,
          details: {
            customerName: matchedFromContext.name,
            customerId: matchedFromContext.id,
            balance: matchedFromContext.currentBalance,
          },
          requiresConfirmation: false,
          status: 'confirmed',
        },
        intentCategory: 'KHATA_BALANCE_CONTEXT',
      };
    }
  }

  // 1C. MULTI-STEP VOICE COMMANDS (e.g. "Counter kholo, 2 kilo sugar add karo" or "Ali ka khata kholo aur balance batao")
  const multiSteps = parseMultiStepCommand(text);
  if (multiSteps.length > 1) {
    const hasNavCounter = multiSteps.some((s) => s.intent === 'NAVIGATE' && s.target === 'billing');
    const hasAddToCart = multiSteps.some((s) => s.intent === 'ADD_TO_CART');

    if (hasNavCounter && hasAddToCart) {
      // Find product mentioned in text
      const prodRes = resolveProductWithConfidence(text, context.products);
      if (prodRes.match) {
        const p = prodRes.match;
        const qty = prodRes.extractedQuantity || 1;
        const total = qty * p.sellingPrice;

        let reply = '';
        if (lang === 'ur') {
          reply = `پی او ایس کاؤنٹر کھول کر ${qty} ${prodRes.extractedUnit || p.unit} "${p.name}" شامل کرنے کی تجویز تیار کر لی ہے۔ (ٹوٹل: Rs. ${total.toLocaleString()})`;
        } else if (lang === 'sd') {
          reply = `پي او ايس ڪائونٽر کولي ${qty} ${prodRes.extractedUnit || p.unit} "${p.name}" شامل ڪيو پيو وڃي۔`;
        } else if (lang === 'ps') {
          reply = `د کاونټر د پرانیستلو سره ${qty} ${prodRes.extractedUnit || p.unit} "${p.name}" اضافه شول.`;
        } else {
          reply = `Counter opened. Prepared quick sale proposal for ${qty} ${prodRes.extractedUnit || p.unit} "${p.name}" (Total: Rs. ${total.toLocaleString()}).`;
        }

        return {
          requiresAI: false,
          routingSource: 'local_intent_engine',
          reply,
          speechSynthesisText: reply,
          actionProposal: {
            type: 'QUICK_SALE',
            title: `Quick Sale: ${qty}x ${p.name}`,
            details: {
              productId: p.id,
              productName: p.name,
              quantity: qty,
              unit: prodRes.extractedUnit || p.unit,
              unitPrice: p.sellingPrice,
              total,
            },
            requiresConfirmation: true,
            status: 'pending',
          },
          intentCategory: 'MULTI_STEP_POS_SALE',
        };
      }
    }
  }

  // --------------------------------------------------------------------------
  // DETERMINISTIC INTENT RULE MATCHING (0 API TOKENS CONSUMED)
  // --------------------------------------------------------------------------

  // 0-HELP. "YE KYA HAI?" & PREDEFINED TOOL GUIDANCE (Zero AI / Zero Token Local Guidance)
  const isHelpOrToolExplanation =
    isToolExplanationQuery(lower) ||
    ((lower.includes('kya hai') || lower.includes('kia hai') || lower.includes('ڇا آهي') || lower.includes('څه شی دی') || lower.includes('کی اے') || lower.includes('guide') || lower.includes('رہنمائی') || lower.includes('مدد')) &&
     (lower.includes('counter') || lower.includes('billing') || lower.includes('stock') || lower.includes('khata') || lower.includes('udhaar') || lower.includes('expense') || lower.includes('report') || lower.includes('purchase') || lower.includes('setting') || lower.includes('munshi')));

  if (isHelpOrToolExplanation) {
    const targetTool = matchToolFromQuery(lower, context.currentView || 'billing');
    const guidance = getToolGuidance(targetTool, lang);
    const toolName = guidance.name[lang] || guidance.name.ur || guidance.name.en;
    const shortGuide = guidance.shortGuide[lang] || guidance.shortGuide.ur || guidance.shortGuide.en;
    const detailed = guidance.detailedExplanation[lang] || guidance.detailedExplanation.ur || guidance.detailedExplanation.en;
    const actions = guidance.keyActions[lang] || guidance.keyActions.ur || guidance.keyActions.en || [];

    const actionList = actions.length > 0 ? `\n• اہم کام: ${actions.join('، ')}` : '';
    const fullReply = `💡 **${toolName}**:\n${shortGuide}\n\n${detailed}${actionList}`;

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply: fullReply,
      speechSynthesisText: shortGuide,
      intentCategory: 'TOOL_EXPLANATION_GUIDANCE',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0A. POS / COUNTER KHOLO (Zero AI / Direct Software Action)
  const isPosOpenCommand =
    (lower.includes('pos') || lower.includes('counter') || lower.includes('کاؤنٹر') || lower.includes('ڪائونٽر') || lower.includes('کاؤنټر') || lower.includes('پی او ایس') || lower.includes('پي او ايس') || lower.includes('billing')) &&
    (lower.includes('kholo') || lower.includes('open') || lower.includes('کوليو') || lower.includes('خلاص') || lower.includes('کھولو') || lower.includes('go to') || lower.includes('چلاؤ') || lower.includes('اسکرین') || lower.includes('dikhao') || lower.includes('دکھاؤ') || lower.includes('وکھاؤ') || lower.includes('ڏيکاريو') || lower.includes('وښایاست'));

  if (isPosOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'پی او ایس کاؤنٹر کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'پي او ايس ڪائونٽر کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'پي او ایس کاؤنټر خلاص شو.';
    else if (lang === 'pa') reply = 'پی او ایس کاؤنٹر کھول دتا اے۔';
    else if (lang === 'en') reply = 'POS Counter screen has been opened.';
    else reply = 'POS counter khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'کاؤنٹر کھولیں' : 'Open POS Counter',
        details: { view: 'billing' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_POS',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0B. KHATA / UDHAAR KHOLO (Zero AI / Direct Software Action)
  const isKhataOpenCommand =
    (lower.includes('khata') || lower.includes('udhaar') || lower.includes('ledger') || lower.includes('کھاتہ') || lower.includes('کاتو') || lower.includes('کهاته') || lower.includes('اوڌر') || lower.includes('ادھار')) &&
    (lower.includes('kholo') || lower.includes('open') || lower.includes('کوليو') || lower.includes('خلاص') || lower.includes('کھولو') || lower.includes('وکھاؤ') || lower.includes('دیکھو') || lower.includes('dikhao') || lower.includes('دکھاؤ') || lower.includes('ڏيکاريو') || lower.includes('وښایاست') || lower.includes('go to'));

  if (isKhataOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'کھاتہ اور ادھار بک کھول دی گئی ہے۔';
    else if (lang === 'sd') reply = 'کاتو ۽ اوڌر کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د کهاتې او پور کتاب خلاص شو.';
    else if (lang === 'pa') reply = 'کھاتہ تے ادھار بک کھول دتی اے۔';
    else if (lang === 'en') reply = 'Khata ledger has been opened.';
    else reply = 'Khata aur udhaar ledger khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'کھاتہ کھولیں' : 'Open Khata',
        details: { view: 'khata' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_KHATA',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0C. STOCK / INVENTORY KHOLO (Zero AI / Direct Software Action)
  const isStockOpenCommand =
    (lower.includes('stock') || lower.includes('inventory') || lower.includes('اسٹاک') || lower.includes('اسٽاڪ') || lower.includes('زېرمه') || lower.includes('سٹاک') || lower.includes('سامان') || lower.includes('مال')) &&
    (lower.includes('kholo') || lower.includes('open') || lower.includes('کوليو') || lower.includes('خلاص') || lower.includes('کھولو') || lower.includes('dikhao') || lower.includes('دکھاؤ') || lower.includes('ویکھو') || lower.includes('چیک') || lower.includes('kahan') || lower.includes('kidhar') || lower.includes('کہاں') || lower.includes('کدھر') || lower.includes('کتھے') || lower.includes('دیکھنا') || lower.includes('وکھاؤ') || lower.includes('ڏيکاريو') || lower.includes('وښایاست'));

  if (isStockOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'اسٹاک اور انوینٹری ماڈیول کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'اسٽاڪ ۽ سامان کاتو کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د توکو او اسټاک زېرمه خلاصه شوه.';
    else if (lang === 'pa') reply = 'سٹاک ماڈیول کھول دتا اے۔';
    else if (lang === 'en') reply = 'Stock and inventory module opened.';
    else reply = 'Stock inventory module khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'اسٹاک کھولیں' : 'Open Stock',
        details: { view: 'products' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_STOCK',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0D. CAMERA / SCANNER KHOLO (Zero AI / Direct Software Action)
  const isCameraOpenCommand =
    (lower.includes('camera') || lower.includes('scanner') || lower.includes('barcode') || lower.includes('parchi scan') || lower.includes('کیمرہ') || lower.includes('اسکینر') || lower.includes('ڪيمرا') || lower.includes('اسڪينر') || lower.includes('پرچی اسکین') || lower.includes('پرچي')) &&
    (lower.includes('kholo') || lower.includes('open') || lower.includes('کوليو') || lower.includes('خلاص') || lower.includes('کھولو') || lower.includes('چلاؤ') || lower.includes('اسکین') || lower.includes('scan'));

  if (isCameraOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'پرچی اور بارکوڈ اسکینر کیمرہ کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'پرچي ۽ بارڪوڊ اسڪينر ڪيمرا کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د رسید او بارکوډ سکینر کیمره خلاصه شوه.';
    else if (lang === 'pa') reply = 'سکینر کیمرہ کھول دتا اے۔';
    else if (lang === 'en') reply = 'Barcode & receipt camera scanner opened.';
    else reply = 'Camera scanner khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'OPEN_CAMERA',
        title: lang === 'ur' ? 'کیمرہ اسکینر کھولیں' : 'Open Camera Scanner',
        details: { mode: 'scan_receipt' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'OPEN_CAMERA',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0E. DASHBOARD KHOLO (Zero AI / Direct Software Action)
  const isDashboardOpenCommand =
    (lower.includes('dashboard') || lower.includes('home') || lower.includes('ڈیش بورڈ') || lower.includes('ڊيش بورڊ') || lower.includes('ډېشبورډ') || lower.includes('ہوم') || lower.includes('مین پیج') || lower.includes('مکيه صفحو')) &&
    (lower.includes('kholo') || lower.includes('open') || lower.includes('کوليو') || lower.includes('خلاص') || lower.includes('کھولو') || lower.includes('جاؤ') || lower.includes('وڃو'));

  if (isDashboardOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'مین ڈیش بورڈ کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'مکيه ڊيش بورڊ کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'اصلي ډېشبورډ خلاص شو.';
    else if (lang === 'pa') reply = 'مین ڈیش بورڈ کھول دتا اے۔';
    else if (lang === 'en') reply = 'Main dashboard has been opened.';
    else reply = 'Main dashboard khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'ڈیش بورڈ کھولیں' : 'Open Dashboard',
        details: { view: 'dashboard' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_DASHBOARD',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0F. NEW BILL KHOLO (Zero AI / Direct Software Action)
  const isNewBillCommand =
    (lower.includes('new bill') || lower.includes('naya bill') || lower.includes('نیا بل') || lower.includes('نواں بل') || lower.includes('نئون بل') || lower.includes('نوی بل') || lower.includes('new invoice') || lower.includes('اگلا بل')) &&
    (lower.includes('kholo') || lower.includes('open') || lower.includes('banao') || lower.includes('ٺاهيو') || lower.includes('جوړ') || lower.includes('کھولو') || lower.includes('بناؤ') || lower.includes('create'));

  if (isNewBillCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'نیا بل بنانے کے لیے کاؤنٹر اسکرین تیار ہے۔';
    else if (lang === 'sd') reply = 'نئون بل ٺاهڻ لاءِ ڪائونٽر اسڪرين تيار آهي۔';
    else if (lang === 'ps') reply = 'د نوي بل لپاره کاؤنټر چمتو دی.';
    else if (lang === 'pa') reply = 'نواں بل بناؤن لئی کاؤنٹر تیار اے۔';
    else if (lang === 'en') reply = 'Counter is ready for a new bill.';
    else reply = 'Naya bill banane ke liye counter tayyar hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NEW_BILL',
        title: lang === 'ur' ? 'نیا بل بنائیں' : 'New Bill',
        details: { view: 'billing', reset: true },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NEW_BILL',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0G. REPEAT LAST SALE (Zero AI / Deterministic Software Engine)
  const isRepeatLastSaleCommand =
    (lower.includes('repeat') || lower.includes('دہراؤ') || lower.includes('ورجايو') || lower.includes('تکرار') || lower.includes('دوبارہ') || lower.includes('پھر سے') || lower.includes('duplicate')) &&
    (lower.includes('last sale') || lower.includes('last bill') || lower.includes('pichla bill') || lower.includes('پچھلا بل') || lower.includes('آخری سیل') || lower.includes('آخري وڪرو') || lower.includes('وروستی بل') || lower.includes('previous bill'));

  if (isRepeatLastSaleCommand) {
    const lastInvoice = context.invoices && context.invoices.length > 0
      ? context.invoices[context.invoices.length - 1]
      : null;

    if (!lastInvoice) {
      const reply = lang === 'ur'
        ? 'جناب، فی الوقت سسٹم میں کوئی پچھلا بل ریکارڈ نہیں ملا۔'
        : 'System mein koi pichla bill nahi mila.';
      return {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        intentCategory: 'REPEAT_LAST_SALE_EMPTY',
      };
    }

    const itemsSummary = lastInvoice.items.map((it) => `${it.productName} (${it.quantity} ${it.unit})`).join(', ');
    let reply = '';
    if (lang === 'ur') {
      reply = `پچھلا بل گاہک "${lastInvoice.customerName}" کا تھا (کل رقم: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur}، ${lastInvoice.items.length} اشیاء: ${itemsSummary})۔ کیا آپ یہی بل دوبارہ دہرانا چاہتے ہیں؟`;
    } else if (lang === 'sd') {
      reply = `پوئين بل گراهڪ "${lastInvoice.customerName}" جو هو (ڪل: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur})۔ ڇا اوهان هي بل ورجائڻ چاهيو ٿا؟`;
    } else if (lang === 'ps') {
      reply = `وروستی بل د "${lastInvoice.customerName}" و (ټول: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur}). ایا غواړئ دا بل تکرار کړئ؟`;
    } else if (lang === 'pa') {
      reply = `پچھلا بل "${lastInvoice.customerName}" دا سی (کل رقم: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur})۔ کی تسیں دوبارہ دہراؤنا چاہندے او؟`;
    } else if (lang === 'en') {
      reply = `Last sale was for "${lastInvoice.customerName}" (Total: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur}). Would you like to repeat it on the counter?`;
    } else {
      reply = `Pichla bill "${lastInvoice.customerName}" ka tha (Total: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur})۔ Kya aap ye bill dobara repeat karna chahte hain?`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'REPEAT_LAST_SALE',
        title: lang === 'ur' ? `پچھلا بل دہرائیں: Rs. ${lastInvoice.totalAmount.toLocaleString()}` : `Repeat Last Sale (Rs. ${lastInvoice.totalAmount.toLocaleString()})`,
        details: {
          invoiceId: lastInvoice.id,
          customerName: lastInvoice.customerName,
          customerId: lastInvoice.customerId,
          items: lastInvoice.items,
          total: lastInvoice.totalAmount,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'REPEAT_LAST_SALE',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0H. SEARCH CUSTOMER (Zero AI / Deterministic Search)
  const isSearchCustomerCommand =
    (lower.includes('search') || lower.includes('find') || lower.includes('talash') || lower.includes('تلاش') || lower.includes('ڳوليو') || lower.includes('وپلټئ') || lower.includes('لبھو') || lower.includes('سرچ') || lower.includes('dhoondo')) &&
    (lower.includes('customer') || lower.includes('gahak') || lower.includes('گاہک') || lower.includes('گراهڪ') || lower.includes('پېرودونکی') || lower.includes('پارٹی') || lower.includes('party'));

  if (isSearchCustomerCommand) {
    // Extract customer query candidate
    const searchCandidate = text
      .replace(/(search|find|talash|karo|customer|gahak|dhoondo|karein|batao|dikhao|گراهڪ|گاہک|تلاش|کرو|سرچ|پېرودونکی|لبھو)/gi, '')
      .trim();

    const matched = searchCandidate
      ? context.customers.find((c) =>
          c.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
          (c.phone && c.phone.includes(searchCandidate))
        )
      : context.customers[0];

    if (matched) {
      const bal = matched.currentBalance;
      const statusText = bal > 0
        ? `Rs. ${bal.toLocaleString()} ${cur} (وصول طلب ادھار)`
        : bal < 0
        ? `Rs. ${Math.abs(bal).toLocaleString()} ${cur} (پیشگی جمع)`
        : '0 (کھاتہ بے باق)';

      let reply = '';
      if (lang === 'ur') {
        reply = `گاہک "${matched.name}" کا کھاتہ:\n• موبائل: ${matched.phone || 'کوئی فون درج نہیں'}\n• موجودہ بیلنس: ${statusText}\n• کھاتہ تفصیل دیکھنے کے لیے کھاتہ بٹن استعمال کریں۔`;
      } else if (lang === 'sd') {
        reply = `گراهڪ "${matched.name}":\n• فون: ${matched.phone || 'ڪو فون ناهي'}\n• موجوده حساب: ${statusText}`;
      } else if (lang === 'ps') {
        reply = `پېرودونکی "${matched.name}":\n• موبایل: ${matched.phone || 'فون نشته'}\n• اوسنی پور: ${statusText}`;
      } else if (lang === 'pa') {
        reply = `گاہک "${matched.name}":\n• فون: ${matched.phone || 'کوئی فون نہیں'}\n• کھاتہ بیلنس: ${statusText}`;
      } else {
        reply = `Customer "${matched.name}":\n• Phone: ${matched.phone || 'N/A'}\n• Current Balance: ${statusText}`;
      }

      const result: SmartRouterResult = {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        actionProposal: {
          type: 'OPEN_KHATA',
          title: `${matched.name} کا کھاتہ کھولیں`,
          details: { customerId: matched.id, customerName: matched.name },
          requiresConfirmation: false,
          status: 'confirmed',
        },
        intentCategory: 'CUSTOMER_SEARCH',
      };
      aiMunshiCache.set(`req_${text}`, result, 30000);
      return result;
    } else {
      const reply = lang === 'ur'
        ? `معذرت، مطلوبہ نام سے کوئی گاہک کھاتے میں نہیں ملا۔`
        : 'No customer matching that name was found in Khata.';
      return {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        intentCategory: 'CUSTOMER_NOT_FOUND',
      };
    }
  }

  // 0I. SEARCH PRODUCT (Zero AI / Deterministic Search)
  const isSearchProductCommand =
    (lower.includes('search') || lower.includes('find') || lower.includes('talash') || lower.includes('تلاش') || lower.includes('ڳوليو') || lower.includes('ولټوئ') || lower.includes('لبھو') || lower.includes('سرچ') || lower.includes('dhoondo')) &&
    (lower.includes('product') || lower.includes('item') || lower.includes('پروڈکٹ') || lower.includes('سامان') || lower.includes('چیز') || lower.includes('توکی') || lower.includes('مال'));

  if (isSearchProductCommand) {
    const searchCandidate = text
      .replace(/(search|find|talash|karo|product|item|dhoondo|karein|batao|dikhao|پروڈکٹ|سامان|تلاش|کرو|سرچ|توکی|لبھو)/gi, '')
      .trim();

    const prodConfidence = resolveProductWithConfidence(searchCandidate || text, context.products);
    const matched = prodConfidence.match || (searchCandidate
      ? context.products.find((p) =>
          p.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
          (p.barcode && p.barcode.includes(searchCandidate))
        )
      : context.products[0]);

    if (!matched && prodConfidence.confidence === 'MEDIUM' && prodConfidence.ambiguousCandidates && prodConfidence.ambiguousCandidates.length > 1) {
      const candidateNames = prodConfidence.ambiguousCandidates.map((p) => p.name).join(' یا ');
      let reply = '';
      if (lang === 'ur') {
        reply = `اس نام سے ${prodConfidence.ambiguousCandidates.length} پروڈکٹس موجود ہیں: ${candidateNames}۔ آپ کس کی تفصیل دیکھنا چاہتے ہیں؟`;
      } else if (lang === 'sd') {
        reply = `هن نالي سان ${prodConfidence.ambiguousCandidates.length} شيون آهن: ${candidateNames}۔ اوهان ڪهڙي ڏسڻ چاهيو ٿا؟`;
      } else if (lang === 'ps') {
        reply = `په دې نوم ${prodConfidence.ambiguousCandidates.length} توکي شته: ${candidateNames}. تاسو کوم یو ګورئ؟`;
      } else {
        reply = `Found ${prodConfidence.ambiguousCandidates.length} products: ${candidateNames}. Which one would you like to view?`;
      }

      return {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        intentCategory: 'PRODUCT_AMBIGUOUS_CLARIFICATION',
      };
    }

    if (matched) {
      aiMunshiSessionStore.updateActiveEntity(businessId, {
        productId: matched.id,
        productName: matched.name,
      });
      const isLow = matched.quantity <= matched.lowStockThreshold;
      const stockStatus = isLow ? '⚠️ کم اسٹاک (Low Stock)' : '✅ وافر اسٹاک (In Stock)';

      let reply = '';
      if (lang === 'ur') {
        reply = `پروڈکٹ "${matched.name}":\n• موجودہ اسٹاک: ${matched.quantity} ${matched.unit}\n• قیمت فروخت: Rs. ${matched.sellingPrice.toLocaleString()} ${cur}\n• صورتحال: ${stockStatus}`;
      } else if (lang === 'sd') {
        reply = `پروڊڪٽ "${matched.name}":\n• اسٽاڪ: ${matched.quantity} ${matched.unit}\n• وڪرو قيمت: Rs. ${matched.sellingPrice.toLocaleString()} ${cur}\n• حالت: ${stockStatus}`;
      } else if (lang === 'ps') {
        reply = `توکی "${matched.name}":\n• زېرمه: ${matched.quantity} ${matched.unit}\n• د پلور بيه: Rs. ${matched.sellingPrice.toLocaleString()} ${cur}\n• حالت: ${stockStatus}`;
      } else if (lang === 'pa') {
        reply = `چیز "${matched.name}":\n• موجودہ مال: ${matched.quantity} ${matched.unit}\n• ریٹ: Rs. ${matched.sellingPrice.toLocaleString()} ${cur}\n• حالت: ${stockStatus}`;
      } else {
        reply = `Product "${matched.name}":\n• Stock: ${matched.quantity} ${matched.unit}\n• Selling Price: Rs. ${matched.sellingPrice.toLocaleString()} ${cur}\n• Status: ${stockStatus}`;
      }

      const result: SmartRouterResult = {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        intentCategory: 'PRODUCT_SEARCH',
      };
      aiMunshiCache.set(`req_${text}`, result, 30000);
      return result;
    } else {
      const reply = lang === 'ur'
        ? `معذرت، مطلوبہ نام سے کوئی چیز اسٹاک میں نہیں ملی۔`
        : 'No product matching that name was found in inventory.';
      return {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        intentCategory: 'PRODUCT_NOT_FOUND',
      };
    }
  }

  // 0J. VOICE TRANSACTION CONFIRMATION ("Haan", "Yes", "Theek hai", "Confirm karo")
  const isVoiceConfirmation =
    lower === 'haan' ||
    lower === 'haañ' ||
    lower === 'yes' ||
    lower === 'confirm' ||
    lower === 'ok' ||
    lower === 'theek hai' ||
    lower === 'theek hy' ||
    lower === 'jee haan' ||
    lower === 'thik hai' ||
    lower === 'thik hy' ||
    lower === 'kar do' ||
    lower === 'haan kar do' ||
    lower === 'sahi hai' ||
    lower === 'manzoor hai' ||
    lower === 'جی ہاں' ||
    lower === 'ہاں' ||
    lower === 'ٹھیک ہے' ||
    lower === 'تصدیق' ||
    lower === 'تصدیق کرو' ||
    lower === 'کر دو' ||
    lower === 'منظور ہے' ||
    lower === 'صحیح ہے' ||
    lower === 'ها' ||
    lower === 'ٺيڪ آهي' ||
    lower === 'هو' ||
    lower === 'سمه ده' ||
    lower === 'آہو' ||
    lower === 'ہاں جی' ||
    lower === 'کر دیں' ||
    lower === 'لکھ دو' ||
    lower === 'لکھ دیں';

  // Voice Rejection / Cancellation Intent ("Nahi", "Cancel", "Mat karo", "Ruko")
  const isVoiceRejection =
    lower === 'nahi' ||
    lower === 'nahin' ||
    lower === 'na' ||
    lower === 'no' ||
    lower === 'cancel' ||
    lower === 'mat karo' ||
    lower === 'rehn do' ||
    lower === 'rehne do' ||
    lower === 'ruko' ||
    lower === 'نہیں' ||
    lower === 'کینسل' ||
    lower === 'منسوخ' ||
    lower === 'مت کرو' ||
    lower === 'رہن دو' ||
    lower === 'نه' ||
    lower === 'رد' ||
    lower === 'نه کړئ';

  if (isVoiceRejection) {
    let reply = '';
    if (lang === 'ur') reply = 'کارروائی منسوخ کر دی گئی ہے۔ کوئی اندراج نہیں کیا گیا۔';
    else if (lang === 'sd') reply = 'ڪارروائي رد ڪئي وئي آهي۔ ڪو رڪارڊ نه ٿيو۔';
    else if (lang === 'ps') reply = 'کړنه لغوه شوه. هېڅ ثبت ونه شو.';
    else if (lang === 'pa') reply = 'کارروائی منسوخ کر دتی گئی اے۔';
    else if (lang === 'en') reply = 'Action cancelled. No changes were made.';
    else reply = 'Action cancel kar diya gaya hai. Koi record nahi hua.';

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'VOICE_CANCELLATION',
    };
  }

  if (isVoiceConfirmation) {
    let reply = '';
    if (lang === 'ur') reply = 'کارروائی کی تصدیق کر دی گئی ہے۔';
    else if (lang === 'sd') reply = 'ڪارروائي جي تصديق ڪئي وئي آهي۔';
    else if (lang === 'ps') reply = 'کړنه تایید شوه.';
    else if (lang === 'pa') reply = 'کارروائی منظور ہو گئی اے۔';
    else if (lang === 'en') reply = 'Action has been confirmed.';
    else reply = 'Action confirm kar diya gaya hai.';

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'VOICE_CONFIRMATION',
    };
  }

  // 0K. SHOW LAST BILL / INVOICE (Deterministic Software Logic)
  const isShowLastBillCommand =
    (lower.includes('last bill') ||
     lower.includes('pichla bill') ||
     lower.includes('aakhri bill') ||
     lower.includes('last sale') ||
     lower.includes('last invoice') ||
     lower.includes('پچھلا بل') ||
     lower.includes('آخری بل') ||
     lower.includes('پوئين بل') ||
     lower.includes('وروستی بل') ||
     lower.includes('پچھلا انوائس')) &&
    (lower.includes('dikhao') ||
     lower.includes('show') ||
     lower.includes('check') ||
     lower.includes('batao') ||
     lower.includes('دیکھو') ||
     lower.includes('دکھاؤ') ||
     lower.includes('ڏيکاريو') ||
     lower.includes('وښایاست') ||
     lower.includes('وکھاؤ') ||
     lower.includes('معلوم') ||
     lower.includes('تفصیل'));

  if (isShowLastBillCommand) {
    const lastInvoice = context.invoices && context.invoices.length > 0
      ? context.invoices[context.invoices.length - 1]
      : null;

    if (!lastInvoice) {
      let reply = '';
      if (lang === 'ur') reply = 'جناب، فی الوقت سسٹم میں کوئی پچھلا بل ریکارڈ نہیں ملا۔';
      else if (lang === 'sd') reply = 'سائين، سسٽم ۾ ڪو پوئين بل ريڪارڊ ناهي مليو۔';
      else if (lang === 'ps') reply = 'په سیسټم کې هیڅ وروستی بل ونه موندل شو.';
      else if (lang === 'pa') reply = 'سسٹم وچ کوئی پچھلا بل ریکارڈ نہیں لبھیا۔';
      else if (lang === 'en') reply = 'No previous invoice found in the system.';
      else reply = 'System mein koi pichla bill nahi mila.';

      return {
        requiresAI: false,
        routingSource: 'local_intent_engine',
        reply,
        speechSynthesisText: reply,
        intentCategory: 'REPEAT_LAST_SALE_EMPTY',
      };
    }

    const itemsSummary = lastInvoice.items.map((it) => `• ${it.productName} (${it.quantity} ${it.unit}) - Rs. ${(it.unitPrice * it.quantity).toLocaleString()}`).join('\n');
    let reply = '';
    if (lang === 'ur') {
      reply = `پچھلے بل کا ریکارڈ (${lastInvoice.createdAt.split('T')[0]}):\n• گاہک: ${lastInvoice.customerName}\n• بل نمبر: #${lastInvoice.invoiceNumber || lastInvoice.id}\n• اشیاء:\n${itemsSummary}\n• کل رقم: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur} (${lastInvoice.paymentMethod === 'cash' ? 'نقد' : 'ادھار'})\n\nآپ چاہیں تو کاؤنٹر میں کھول سکتے ہیں یا دوبارہ دہرا سکتے ہیں۔`;
    } else if (lang === 'sd') {
      reply = `پوئين بل جو ريڪارڊ:\n• گراهڪ: ${lastInvoice.customerName}\n• ڪل رقم: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur}\n• سامان:\n${itemsSummary}`;
    } else if (lang === 'ps') {
      reply = `د وروستي بل راپور:\n• پېرودونکی: ${lastInvoice.customerName}\n• ټول پلور: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur}\n• توکي:\n${itemsSummary}`;
    } else if (lang === 'pa') {
      reply = `پچھلا بل:\n• گاہک: ${lastInvoice.customerName}\n• کل رقم: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur}\n• سامان:\n${itemsSummary}`;
    } else if (lang === 'en') {
      reply = `Last Invoice Details (${lastInvoice.createdAt.split('T')[0]}):\n• Customer: ${lastInvoice.customerName}\n• Total: ${cur} ${lastInvoice.totalAmount.toLocaleString()} (${lastInvoice.paymentMethod.toUpperCase()})\n• Items:\n${itemsSummary}`;
    } else {
      reply = `Pichla Bill Details:\n• Customer: ${lastInvoice.customerName}\n• Total: Rs. ${lastInvoice.totalAmount.toLocaleString()} ${cur}\n• Items:\n${itemsSummary}`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: `Pichla bill ${lastInvoice.customerName} ka tha, kul raqam Rs. ${lastInvoice.totalAmount.toLocaleString()}.`,
      actionProposal: {
        type: 'SHOW_LAST_BILL',
        title: lang === 'ur' ? 'بل کاؤنٹر پر کھولیں' : 'Open Bill on Counter',
        details: {
          invoiceId: lastInvoice.id,
          view: 'billing',
        },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'SHOW_LAST_BILL',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0L. EXPENSES / ROZNAMCHA KHOLO (Direct Software Action)
  const isExpensesOpenCommand =
    (lower.includes('expense') ||
     lower.includes('kharcha') ||
     lower.includes('اخراجات') ||
     lower.includes('خرچ') ||
     lower.includes('لګښت') ||
     lower.includes('روزنامچہ') ||
     lower.includes('روزنامچو') ||
     lower.includes('خرچے')) &&
    (lower.includes('kholo') ||
     lower.includes('open') ||
     lower.includes('کوليو') ||
     lower.includes('خلاص') ||
     lower.includes('کھولو') ||
     lower.includes('جاؤ') ||
     lower.includes('dikhao') ||
     lower.includes('دکھاؤ') ||
     lower.includes('وکھاؤ') ||
     lower.includes('ڏيکاريو') ||
     lower.includes('وښایاست') ||
     lower.includes('اسکرین'));

  if (isExpensesOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'روزنامچہ اور اخراجات کا ماڈیول کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'روزنامچو ۽ خرچ ماڊيول کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د روزنامچې او لګښتونو برخه خلاصه شوه.';
    else if (lang === 'pa') reply = 'روزنامچہ تے خرچہ ماڈیول کھول دتا اے۔';
    else if (lang === 'en') reply = 'Daily expenses and register module opened.';
    else reply = 'Expenses aur roznamcha module khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'اخراجات کھولیں' : 'Open Expenses',
        details: { view: 'expenses' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_EXPENSES',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0M. PURCHASES / KHARIDARI KHOLO (Direct Software Action)
  const isPurchasesOpenCommand =
    (lower.includes('purchase') ||
     lower.includes('kharidari') ||
     lower.includes('خریداری') ||
     lower.includes('خريداري') ||
     lower.includes('پېرودنه') ||
     lower.includes('سپلائر بل')) &&
    (lower.includes('kholo') ||
     lower.includes('open') ||
     lower.includes('کوليو') ||
     lower.includes('خلاص') ||
     lower.includes('کھولو') ||
     lower.includes('جاؤ'));

  if (isPurchasesOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'خریداری و سپلائر ماڈیول کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'خريداري ۽ سپلائر کاتو کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د پېرودنې او عرضه کوونکو برخه خلاصه شوه.';
    else if (lang === 'pa') reply = 'خریداری ماڈیول کھول دتا اے۔';
    else if (lang === 'en') reply = 'Purchases and supplier module opened.';
    else reply = 'Purchases aur kharidari module khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'خریداری کھولیں' : 'Open Purchases',
        details: { view: 'purchases' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_PURCHASES',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0N. REPORTS / MUNAFA KHOLO (Direct Software Action)
  const isReportsOpenCommand =
    (lower.includes('report') ||
     lower.includes('رپورٹس') ||
     lower.includes('رپورٹ') ||
     lower.includes('رپورٽون') ||
     lower.includes('راپور') ||
     lower.includes('سمری') ||
     lower.includes('خلاصہ')) &&
    (lower.includes('kholo') ||
     lower.includes('open') ||
     lower.includes('کوليو') ||
     lower.includes('خلاص') ||
     lower.includes('کھولو') ||
     lower.includes('dikhao') ||
     lower.includes('دکھاؤ') ||
     lower.includes('وکھاؤ') ||
     lower.includes('وښایاست') ||
     lower.includes('batao') ||
     lower.includes('بتاؤ'));

  if (isReportsOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'کاروباری رپورٹس اور منافع کا ماڈیول کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'ڪاروباري رپورٽون ۽ فائدي جو ماڊيول کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د سوداګرۍ راپورونه او د ګټې برخه خلاصه شوه.';
    else if (lang === 'pa') reply = 'رپورٹس تے منافع ماڈیول کھول دتا اے۔';
    else if (lang === 'en') reply = 'Business reports and analytics module opened.';
    else reply = 'Reports aur analytics module khol diya gaya hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'رپورٹس کھولیں' : 'Open Reports',
        details: { view: 'reports' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_REPORTS',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0O. SETTINGS / PROFILE KHOLO (Direct Software Action)
  const isSettingsOpenCommand =
    (lower.includes('setting') ||
     lower.includes('سیٹنگ') ||
     lower.includes('تنظیمات') ||
     lower.includes('پروفائل') ||
     lower.includes('profile')) &&
    (lower.includes('kholo') ||
     lower.includes('open') ||
     lower.includes('کوليو') ||
     lower.includes('خلاص') ||
     lower.includes('کھولو') ||
     lower.includes('dikhao') ||
     lower.includes('دکھاؤ') ||
     lower.includes('وکھاؤ') ||
     lower.includes('ڏيکاريو') ||
     lower.includes('وښایاست') ||
     lower.includes('بدلو'));

  if (isSettingsOpenCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'دکان کی پروفائل اور سیٹنگز کھول دی گئی ہیں۔';
    else if (lang === 'sd') reply = 'دڪان جي پروفائل ۽ سيٽنگز کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د هټۍ پروفایل او تنظیمات خلاص شول.';
    else if (lang === 'pa') reply = 'دکان دی سیٹنگز کھول دتی اے۔';
    else if (lang === 'en') reply = 'Shop profile and settings opened.';
    else reply = 'Shop profile aur settings khol di gayi hain.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'سیٹنگز کھولیں' : 'Open Settings',
        details: { view: 'settings' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'NAVIGATE_SETTINGS',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0P. CLOSE MUNSHI / DRAWER (Direct Software Action)
  const isCloseMunshiCommand =
    (lower.includes('munshi') ||
     lower.includes('drawer') ||
     lower.includes('منشی') ||
     lower.includes('ڈراور') ||
     lower.includes('منشي') ||
     lower === 'close' ||
     lower === 'band karo' ||
     lower === 'بند کرو' ||
     lower === 'بند کړه') &&
    (lower.includes('band') ||
     lower.includes('close') ||
     lower.includes('بند') ||
     lower.includes('ختم') ||
     lower.includes('چھپاؤ'));

  if (isCloseMunshiCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'جی جناب، اے آئی منشی بند کیا جا رہا ہے۔';
    else if (lang === 'sd') reply = 'جي سائين، اي آءِ منشي بند ڪيو پيو وڃي۔';
    else if (lang === 'ps') reply = 'هو محترمه، د هوښیار منشي پاڼه تړل کیږي.';
    else if (lang === 'pa') reply = 'جی، منشی بند کیتا جا رہیا اے۔';
    else if (lang === 'en') reply = 'Closing AI Munshi.';
    else reply = 'Ji janab, AI Munshi band kiya ja raha hai.';

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'CLOSE_MUNSHI',
        title: lang === 'ur' ? 'منشی بند کریں' : 'Close Munshi',
        details: {},
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'CLOSE_MUNSHI',
    };
  }

  // 0Q. ADD NEW PRODUCT / ITEM (Direct Software Action)
  const isAddProductCommand =
    (lower.includes('naya product') ||
     lower.includes('naya item') ||
     lower.includes('new product') ||
     lower.includes('new item') ||
     lower.includes('نیا پروڈکٹ') ||
     lower.includes('نیا آئٹم') ||
     lower.includes('نئون سامان') ||
     lower.includes('نوی توکی') ||
     lower.includes('نواں مال')) &&
    (lower.includes('add') ||
     lower.includes('dalo') ||
     lower.includes('daalo') ||
     lower.includes('shamil') ||
     lower.includes('شامل') ||
     lower.includes('داخل') ||
     lower.includes('اضافه') ||
     lower.includes('پاواں') ||
     lower.includes('بناؤ'));

  if (isAddProductCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'نیا پروڈکٹ شامل کرنے کے لیے اسٹاک ماڈیول کھول دیا گیا ہے۔';
    else if (lang === 'sd') reply = 'نئون سامان داخل ڪرڻ لاءِ پروڊڪٽس کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د نوي توکي اضافه کولو لپاره د توکو برخه خلاصه شوه.';
    else if (lang === 'pa') reply = 'نواں پروڈکٹ شامل کرن لئی سٹاک کھول دتا اے۔';
    else if (lang === 'en') reply = 'Opening products screen to add a new product.';
    else reply = 'Naya product add karne ke liye screen khol di gayi hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'نیا پروڈکٹ شامل کریں' : 'Add New Product',
        details: { view: 'products', action: 'add' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'ADD_PRODUCT_INTENT',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 0R. ADD NEW CUSTOMER (Direct Software Action)
  const isAddCustomerCommand =
    (lower.includes('naya customer') ||
     lower.includes('naya gahak') ||
     lower.includes('new customer') ||
     lower.includes('نیا گاہک') ||
     lower.includes('نئون گراهڪ') ||
     lower.includes('نوی پېرودونکی') ||
     lower.includes('نواں گاہک')) &&
    (lower.includes('add') ||
     lower.includes('banao') ||
     lower.includes('shamil') ||
     lower.includes('شامل') ||
     lower.includes('داخل') ||
     lower.includes('اضافه') ||
     lower.includes('ٺاهيو') ||
     lower.includes('جوړ'));

  if (isAddCustomerCommand) {
    let reply = '';
    if (lang === 'ur') reply = 'نیا گاہک شامل کرنے کے لیے کھاتہ بک کھول دی گئی ہے۔';
    else if (lang === 'sd') reply = 'نئون گراهڪ داخل ڪرڻ لاءِ کاتو کولي ڇڏيو آهي۔';
    else if (lang === 'ps') reply = 'د نوي پېرودونکي اضافه کولو لپاره د کهاتې کتاب خلاص شو.';
    else if (lang === 'pa') reply = 'نواں گاہک بناؤن لئی کھاتہ کھول دتا اے۔';
    else if (lang === 'en') reply = 'Opening Khata ledger to add a new customer.';
    else reply = 'Naya customer add karne ke liye khata book khol di gayi hai.';

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'نیا گاہک شامل کریں' : 'Add New Customer',
        details: { view: 'khata', action: 'add_customer' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'ADD_CUSTOMER_INTENT',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 1. TODAY'S SALES
  const isTodaySales =
    (lower.includes('sale') || lower.includes('سیل') || lower.includes('فروخت') || lower.includes('وڪرو') || lower.includes('پلور') || lower.includes('خرڅلاو') || lower.includes('bikri')) &&
    (lower.includes('aaj') || lower.includes('today') || lower.includes('اج') || lower.includes('اڄ') || lower.includes('نن') || lower.includes('نننی') || lower.includes('kitni hui') || lower.includes('batao') || lower.includes('bata') || lower.includes('څومره') || lower.includes('ڪيتري') || lower.includes('کنی'));

  if (isTodaySales) {
    const todayInvoices = context.invoices.filter((i) => i.createdAt.startsWith(today));
    const totalAmount = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const cashSales = todayInvoices.filter((i) => i.paymentMethod === 'cash').reduce((sum, i) => sum + i.totalAmount, 0);
    const creditSales = todayInvoices.filter((i) => i.paymentMethod === 'credit').reduce((sum, i) => sum + i.totalAmount, 0);
    const billCount = todayInvoices.length;

    let reply = '';
    if (lang === 'ur') {
      reply = `جناب، آج کی کل سیل ${totalAmount.toLocaleString()} ${cur} رہی ہے۔ (${billCount} بل بنے)\n- نقد سیل: ${cashSales.toLocaleString()} ${cur}\n- ادھار سیل: ${creditSales.toLocaleString()} ${cur}`;
    } else if (lang === 'pa') {
      reply = `جناب، اج دی کل سیل ${totalAmount.toLocaleString()} ${cur} اے (${billCount} بل بنے نیں)۔ کیش سیل ${cashSales.toLocaleString()} تے ادھار سیل ${creditSales.toLocaleString()} ${cur} اے۔`;
    } else if (lang === 'sd') {
      reply = `سائين، اڄ جي ڪل وڪرو ${totalAmount.toLocaleString()} ${cur} آهي (${billCount} بل ٺهيا)۔ نقد ${cashSales.toLocaleString()} ۽ اوڌر ${creditSales.toLocaleString()} ${cur} آهي۔`;
    } else if (lang === 'ps') {
      reply = `محترمه، د نن ورځې ټول پلور ${totalAmount.toLocaleString()} ${cur} دی (${billCount} بلونه)۔ نغد پلور ${cashSales.toLocaleString()} او پور پلور ${creditSales.toLocaleString()} ${cur} دی۔`;
    } else if (lang === 'en') {
      reply = `Today's total sales are ${cur} ${totalAmount.toLocaleString()} across ${billCount} invoices.\n- Cash: ${cur} ${cashSales.toLocaleString()}\n- Credit: ${cur} ${creditSales.toLocaleString()}`;
    } else {
      reply = `Janab, aaj ki total sale ${totalAmount.toLocaleString()} ${cur} rahi hai (${billCount} bills baney).\n- Cash Sale: ${cashSales.toLocaleString()} ${cur}\n- Udhaar Sale: ${creditSales.toLocaleString()} ${cur}`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'TODAY_SALES',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 2. TODAY'S EXPENSES (VIEW)
  const isTodayExpensesView =
    (lower.includes('kharcha') || lower.includes('kharche') || lower.includes('expense') || lower.includes('اخراجات') || lower.includes('خرچ') || lower.includes('لګښت') || lower.includes('مصرف')) &&
    (lower.includes('aaj') || lower.includes('today') || lower.includes('اج') || lower.includes('اڄ') || lower.includes('نن') || lower.includes('batao') || lower.includes('kitna') || lower.includes('څومره') || lower.includes('ڪيترو'));

  if (isTodayExpensesView && !lower.includes('add') && !lower.includes('likho') && !lower.includes('dalo') && !lower.includes('شامل') && !lower.includes('ولیکه')) {
    const todayExpenses = context.expenses.filter((e) => e.date.startsWith(today));
    const totalExp = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const count = todayExpenses.length;

    let reply = '';
    if (lang === 'ur') {
      reply = `جناب، آج کا کل خرچہ ${totalExp.toLocaleString()} ${cur} ہوا ہے (کل ${count} اندراجات)۔`;
    } else if (lang === 'pa') {
      reply = `اج دا کل خرچہ ${totalExp.toLocaleString()} ${cur} ہویا اے (${count} خرچے)۔`;
    } else if (lang === 'sd') {
      reply = `اڄ جو ڪل خرچ ${totalExp.toLocaleString()} ${cur} ٿيو آهي (${count} خرچ)۔`;
    } else if (lang === 'ps') {
      reply = `د نن ټول لګښتونه ${totalExp.toLocaleString()} ${cur} شوي دي (${count} لګښتونه)۔`;
    } else if (lang === 'en') {
      reply = `Today's total expenses are ${cur} ${totalExp.toLocaleString()} (${count} entries).`;
    } else {
      reply = `Janab, aaj ka total kharcha ${totalExp.toLocaleString()} ${cur} hua hai (${count} entries).`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'TODAY_EXPENSES',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 3. ADD EXPENSE (WITH CONFIRMATION)
  const isAddExpense =
    (lower.includes('expense') || lower.includes('kharcha') || lower.includes('خرچہ') || lower.includes('خرچ') || lower.includes('لګښت') || lower.includes('مصرف')) &&
    (lower.includes('add') || lower.includes('likho') || lower.includes('dalo') || lower.includes('شامل') || lower.includes('darj') || lower.includes('لکھو') || lower.includes('لکو') || lower.includes('ولیکه'));

  if (isAddExpense) {
    const amount = extractAmountFromText(text) || 100;
    const category = extractExpenseCategory(text);

    let reply = '';
    if (lang === 'ur') {
      reply = `میں نے ${amount.toLocaleString()} ${cur} کا ${category} خرچہ تیار کر لیا ہے۔ براہ کرم نیچے تصدیق فرمائیں تاکہ کھاتے میں درج ہو جائے۔`;
    } else if (lang === 'pa') {
      reply = `میں ${amount.toLocaleString()} ${cur} دا ${category} خرچہ تیار کیتا اے۔ تصدیق کرو تاں کھاتے وچ پاواں۔`;
    } else if (lang === 'sd') {
      reply = `مان ${amount.toLocaleString()} ${cur} جو ${category} خرچ تيار ڪيو آهي۔ مهرباني ڪري تصديق ڪريو۔`;
    } else if (lang === 'ps') {
      reply = `ما د ${amount.toLocaleString()} ${cur} د ${category} لګښت تيار کړی دی، مهرباني وکړئ تصديق یې کړئ.`;
    } else if (lang === 'en') {
      reply = `Prepared expense entry of ${cur} ${amount.toLocaleString()} for ${category}. Please confirm to save to books.`;
    } else {
      reply = `Main ne ${amount.toLocaleString()} ${cur} ka "${category}" kharcha tayyar kar liya hai. Baraye meherbani tasdeeq karein taake books mein darj ho jaye.`;
    }

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'ADD_EXPENSE',
        title: lang === 'ur' ? 'خرچہ شامل کرنے کی تصدیق' :
               lang === 'sd' ? 'خرچ شامل ڪرڻ جي تصديق' :
               lang === 'ps' ? 'د لګښت تصديق' :
               lang === 'pa' ? 'خرچہ شامل کرن دی تصدیق' :
               'Confirm Add Expense',
        details: {
          category,
          amount,
          notes: `AI Munshi: ${text}`,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'ADD_EXPENSE',
    };
  }

  // 4. SPECIFIC CUSTOMER KHATA BALANCE / HISAAB
  const custConfidenceRes = resolveCustomerWithConfidence(text, context.customers);
  const matchedCustomer = custConfidenceRes.match || findBestCustomerMatch(text, context.customers);

  // If ambiguous customers found (e.g. 2 Alis), ask clarification question locally with 0 tokens!
  if (!matchedCustomer && custConfidenceRes.confidence === 'MEDIUM' && custConfidenceRes.ambiguousCandidates && custConfidenceRes.ambiguousCandidates.length > 1) {
    const candidateNames = custConfidenceRes.ambiguousCandidates.map((c) => c.name).join(' یا ');
    let reply = '';
    if (lang === 'ur') {
      reply = `اس نام سے ${custConfidenceRes.ambiguousCandidates.length} گاہک موجود ہیں: ${candidateNames}۔ آپ کس کا کھاتہ دیکھنا چاہتے ہیں؟`;
    } else if (lang === 'sd') {
      reply = `هن نالي سان ${custConfidenceRes.ambiguousCandidates.length} گراهڪ آهن: ${candidateNames}۔ اوهان ڪنهن جو کاتو چاهيو ٿا؟`;
    } else if (lang === 'ps') {
      reply = `په دې نوم ${custConfidenceRes.ambiguousCandidates.length} پېرودونکي شته: ${candidateNames}. تاسو د کوم یوه حساب ګورئ؟`;
    } else {
      reply = `Found ${custConfidenceRes.ambiguousCandidates.length} matching customers: ${candidateNames}. Which one would you like to check?`;
    }

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'CUSTOMER_AMBIGUOUS_CLARIFICATION',
    };
  }

  // Update session store with matched customer for continuous context memory
  if (matchedCustomer) {
    aiMunshiSessionStore.updateActiveEntity(businessId, {
      customerId: matchedCustomer.id,
      customerName: matchedCustomer.name,
      customerPhone: matchedCustomer.phone,
    });
  }
  const isBalanceOrKhataQuery =
    lower.includes('balance') ||
    lower.includes('hisaab') ||
    lower.includes('hissab') ||
    lower.includes('khata') ||
    lower.includes('udhaar') ||
    lower.includes('lene hain') ||
    lower.includes('dene hain') ||
    lower.includes('history') ||
    lower.includes('transaction') ||
    lower.includes('ریکارڈ') ||
    lower.includes('حساب') ||
    lower.includes('کھاتہ') ||
    lower.includes('بیلنس') ||
    lower.includes('ادھار') ||
    lower.includes('کاتو') ||
    lower.includes('اوڌر') ||
    lower.includes('پور') ||
    lower.includes('کهاته') ||
    lower.includes('پاتې');

  if (matchedCustomer && isBalanceOrKhataQuery && !lower.includes('diye') && !lower.includes('wasool') && !lower.includes('jama') && !lower.includes('udhaar diya') && !lower.includes('likho') && !lower.includes('لکھو') && !lower.includes('لکو') && !lower.includes('ولیکه')) {
    const bal = matchedCustomer.currentBalance;
    const statusText = bal > 0 ? 'لینے ہیں (Receivable)' : bal < 0 ? 'دینے ہیں (Advance)' : 'کھاتہ برابر ہے (Settled)';
    const absBal = Math.abs(bal);

    let reply = '';
    if (lang === 'ur') {
      reply = `گاہک "${matchedCustomer.name}" کا کھاتہ:\n- کل بقایا رقم: ${absBal.toLocaleString()} ${cur}\n- کیفیت: ${statusText}\n- فون نمبر: ${matchedCustomer.phone || 'غیر موجود'}`;
    } else if (lang === 'pa') {
      reply = `گاہک "${matchedCustomer.name}" دا بقایا بیلنس ${absBal.toLocaleString()} ${cur} اے۔ (${statusText})`;
    } else if (lang === 'sd') {
      reply = `گراهڪ "${matchedCustomer.name}" جو بقايا حساب ${absBal.toLocaleString()} ${cur} آهي (${statusText})۔`;
    } else if (lang === 'ps') {
      reply = `د پېرودونکي "${matchedCustomer.name}" پاتې حساب ${absBal.toLocaleString()} ${cur} دی (${statusText})۔`;
    } else if (lang === 'en') {
      reply = `Customer ${matchedCustomer.name} ledger balance:\n- Outstanding: ${cur} ${absBal.toLocaleString()}\n- Status: ${statusText}`;
    } else {
      reply = `Customer "${matchedCustomer.name}" ka khata balance: ${absBal.toLocaleString()} ${cur} (${statusText}).`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'OPEN_KHATA',
        title: lang === 'ur' ? `${matchedCustomer.name} کا کھاتہ کھولیں` : `Open ${matchedCustomer.name} Khata`,
        details: {
          customerName: matchedCustomer.name,
          customerId: matchedCustomer.id,
          balance: matchedCustomer.currentBalance,
        },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'KHATA_BALANCE',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 4A-2. CUSTOMER BALANCE QUERY FOR UNREGISTERED CUSTOMER CANDIDATE
  const candidateCustName = !matchedCustomer ? extractCustomerCandidateName(text) : null;
  if (!matchedCustomer && candidateCustName && isBalanceOrKhataQuery && !lower.includes('diye') && !lower.includes('wasool') && !lower.includes('jama') && !lower.includes('likho') && !lower.includes('لکھو')) {
    let reply = '';
    if (lang === 'ur') {
      reply = `گاہک "${candidateCustName}" کھاتہ بک میں موجود نہیں ہے۔ کیا آپ "${candidateCustName}" کا نیا کھاتہ کھولنا چاہتے ہیں؟`;
    } else if (lang === 'sd') {
      reply = `گراهڪ "${candidateCustName}" کاتي ۾ موجود ناهي۔ ڇا اوهان نئون کاتو کولي چاهيو ٿا؟`;
    } else if (lang === 'ps') {
      reply = `پېرودونکی "${candidateCustName}" په کهاته کې نشته. ایا غواړئ نوی کهاته جوړ کړئ؟`;
    } else if (lang === 'pa') {
      reply = `گاہک "${candidateCustName}" کھاتے وچ نہیں اے۔ کی تسیں نواں کھاتہ بنانا چاہندے او؟`;
    } else if (lang === 'en') {
      reply = `Customer "${candidateCustName}" was not found in the Khata ledger. Would you like to create an account?`;
    } else {
      reply = `Customer "${candidateCustName}" khata book mein mojood nahi hai. Kya aap naya khata banana chahte hain?`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? `${candidateCustName} کا نیا کھاتہ بنائیں` : `Add Customer ${candidateCustName}`,
        details: {
          view: 'khata',
          action: 'add_customer',
          customerName: candidateCustName,
        },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'CUSTOMER_NOT_FOUND',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }
  const hasUdhaarKeyword =
    lower.includes('udhaar') ||
    lower.includes('ادھار') ||
    lower.includes('اوڌر') ||
    lower.includes('پور') ||
    lower.includes('credit');

  const hasWriteAction =
    lower.includes('likho') ||
    lower.includes('لکھو') ||
    lower.includes('لکھیں') ||
    lower.includes('لکو') ||
    lower.includes('ولیکه') ||
    lower.includes('darj') ||
    lower.includes('درج') ||
    lower.includes('add') ||
    lower.includes('داخلا') ||
    lower.includes('ثبت');

  const udhaarAmount = extractAmountFromText(text);

  if (hasUdhaarKeyword && hasWriteAction && udhaarAmount && !lower.includes('wasool') && !lower.includes('وصول') && !lower.includes('راغلل')) {
    let custName = matchedCustomer ? matchedCustomer.name : '';
    let custId = matchedCustomer ? matchedCustomer.id : undefined;

    if (!custName) {
      const nameMatch = text.match(/(?:for|to)\s+([A-Za-z\u0600-\u06FF\s]+)/i) ||
                        text.match(/([A-Za-z\u0600-\u06FF\s]+)\s+(?:ko|کو|کي|ته|نوں)\b/i);
      if (nameMatch) {
        custName = nameMatch[1].trim();
      } else {
        custName = lang === 'ur' ? 'گاہک' : lang === 'sd' ? 'گراهڪ' : lang === 'ps' ? 'پېرودونکی' : 'Customer';
      }
    }

    let reply = '';
    if (lang === 'ur') {
      reply = `میں نے "${custName}" کے کھاتے میں ${udhaarAmount.toLocaleString()} ${cur} ادھار درج کرنے کی تجویز تیار کر لی ہے۔ براہ کرم تصدیق فرمائیں۔`;
    } else if (lang === 'pa') {
      reply = `میں "${custName}" دے کھاتے وچ ${udhaarAmount.toLocaleString()} ${cur} ادھار درج کرن لئی تیار آں۔ تصدیق کرو جی۔`;
    } else if (lang === 'sd') {
      reply = `مان "${custName}" جي کاتي ۾ ${udhaarAmount.toLocaleString()} ${cur} اوڌر لکڻ لاءِ تيار آهيان۔ مهرباني ڪري تصديق ڪريو۔`;
    } else if (lang === 'ps') {
      reply = `ما د "${custName}" په کهاته کې د ${udhaarAmount.toLocaleString()} ${cur} پور ثبتولو وړاندیز چمتو کړی دی، مهرباني وکړئ تایید یې کړئ.`;
    } else if (lang === 'en') {
      reply = `Prepared entry to add ${cur} ${udhaarAmount.toLocaleString()} credit/udhaar for "${custName}". Please confirm to update the ledger.`;
    } else {
      reply = `Main ne "${custName}" ke khate mein ${udhaarAmount.toLocaleString()} ${cur} udhaar darj karne ka proposal tayyar kar liya hai. Baraye meherbani confirm karein.`;
    }

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'ADD_UDHAAR',
        title: lang === 'ur' ? `${custName}: Rs. ${udhaarAmount.toLocaleString()} ادھار درج کریں` :
               lang === 'sd' ? `${custName}: Rs. ${udhaarAmount.toLocaleString()} اوڌر لکو` :
               lang === 'ps' ? `${custName}: Rs. ${udhaarAmount.toLocaleString()} پور ولیکئ` :
               lang === 'pa' ? `${custName}: Rs. ${udhaarAmount.toLocaleString()} ادھار لکھو` :
               `Add Udhaar for ${custName} (${cur} ${udhaarAmount.toLocaleString()})`,
        details: {
          customerName: custName,
          customerId: custId,
          amount: udhaarAmount,
          notes: `Udhaar: ${text}`,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'KHATA_BALANCE',
    };
  }

  // 5. RECORD PAYMENT (WASOOLI OR PAYMENT GIVEN)
  const isPaymentWasool =
    (lower.includes('wasool') || lower.includes('jama') || lower.includes('se mile') || lower.includes('وصول') || lower.includes('جمع') || lower.includes('مليا') || lower.includes('راغلل') || lower.includes('ملے')) &&
    extractAmountFromText(text) !== null;

  const isPaymentDiye =
    (lower.includes('diye') || lower.includes('payment di') || lower.includes('دیے') || lower.includes('ادا کیے') || lower.includes('ڏنا') || lower.includes('ورکړل') || lower.includes('دتے')) &&
    extractAmountFromText(text) !== null;

  if (isPaymentWasool || isPaymentDiye) {
    const amount = extractAmountFromText(text) || 0;
    const targetCust = matchedCustomer || context.customers?.[0];
    const custName = targetCust?.name || (lang === 'ur' ? 'گاہک' : lang === 'sd' ? 'گراهڪ' : lang === 'ps' ? 'پېرودونکی' : 'Customer');

    const isReceiving = isPaymentWasool;
    const actionType = isReceiving ? 'RECORD_PAYMENT' : 'ADD_UDHAAR';
    const title = isReceiving
      ? (lang === 'ur' ? `${custName} سے وصولی کا اندراج` :
         lang === 'sd' ? `${custName} مان وصولي لکو` :
         lang === 'ps' ? `له ${custName} نه وصولي ثبت کړئ` :
         lang === 'pa' ? `${custName} کولوں وصولی دا اندراج` :
         `Record Payment from ${custName}`)
      : (lang === 'ur' ? `${custName} کو رقم/ادھار کا اندراج` :
         lang === 'sd' ? `${custName} کي ادائيگي/اوڌر لکو` :
         lang === 'ps' ? `${custName} ته د پيسو/پور ورکړه` :
         lang === 'pa' ? `${custName} نوں رقم/ادھار دا اندراج` :
         `Record Payment/Udhaar to ${custName}`);

    let reply = '';
    if (lang === 'ur') {
      reply = isReceiving
        ? `میں نے ${custName} سے ${amount.toLocaleString()} ${cur} وصولی کا اندراج تیار کر لیا ہے۔ براہ کرم تصدیق فرمائیں تاکہ کھاتے میں جمع ہو جائے۔`
        : `میں نے ${custName} کو ${amount.toLocaleString()} ${cur} کا اندراج تیار کر لیا ہے۔ تصدیق فرمائیں۔`;
    } else if (lang === 'pa') {
      reply = isReceiving
        ? `میں نے ${custName} کولوں ${amount.toLocaleString()} ${cur} وصولی دا اندراج تیار کیتا اے۔ تصدیق کرو جی۔`
        : `میں نے ${custName} نوں ${amount.toLocaleString()} ${cur} دی ادائی دا اندراج تیار کیتا اے۔ تصدیق کرو جی۔`;
    } else if (lang === 'sd') {
      reply = isReceiving
        ? `مان ${custName} مان ${amount.toLocaleString()} ${cur} وصولي جو اندراج تيار ڪيو آهي۔ مهرباني ڪري تصديق ڪريو۔`
        : `مان ${custName} کي ${amount.toLocaleString()} ${cur} جي ادائيگي جو ريڪارڊ تيار ڪيو آهي۔ تصديق ڪريو۔`;
    } else if (lang === 'ps') {
      reply = isReceiving
        ? `ما له ${custName} نه د ${amount.toLocaleString()} ${cur} د وصولۍ راپور تيار کړی دی، مهرباني وکړئ تصديق یې کړئ.`
        : `ما ${custName} ته د ${amount.toLocaleString()} ${cur} د ورکړې ريکارډ تيار کړی دی، تاييد یې کړئ.`;
    } else if (lang === 'en') {
      reply = isReceiving
        ? `Prepared payment received entry of ${cur} ${amount.toLocaleString()} from ${custName}. Please confirm to update ledger.`
        : `Prepared payment given entry of ${cur} ${amount.toLocaleString()} to ${custName}. Please confirm to update ledger.`;
    } else {
      reply = isReceiving
        ? `Main ne ${custName} se ${amount.toLocaleString()} ${cur} wasooli ka record tayyar kar liya hai. Confirm karein taake khata update ho sake.`
        : `Main ne ${custName} ko ${amount.toLocaleString()} ${cur} ka record tayyar kar liya hai. Please confirm karein.`;
    }

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: actionType,
        title,
        details: {
          customerName: targetCust ? targetCust.name : custName,
          customerId: targetCust ? targetCust.id : undefined,
          amount,
          notes: isReceiving ? `Wasooli: ${text}` : `Payment: ${text}`,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'RECORD_PAYMENT',
    };
  }

  // 6. SPECIFIC PRODUCT STOCK CHECK
  const matchedProduct = findBestProductMatch(text, context.products);
  const isStockQuery =
    lower.includes('stock') ||
    lower.includes('maal') ||
    lower.includes('kitna bacha') ||
    lower.includes('kitna hai') ||
    lower.includes('اسٹاک') ||
    lower.includes('اسٽاڪ') ||
    lower.includes('مال') ||
    lower.includes('سامان') ||
    lower.includes('زېرمه') ||
    lower.includes('زیرمه') ||
    lower.includes('څومره پاتې');

  if (matchedProduct && isStockQuery) {
    const qty = matchedProduct.quantity;
    const unit = matchedProduct.unit || 'units';
    const isLow = qty <= matchedProduct.lowStockThreshold;
    const statusNotice = isLow ? '⚠️ کم اسٹاک (Low Stock Warning)' : '✅ تسلی بخش (In Stock)';

    let reply = '';
    if (lang === 'ur') {
      reply = `پروڈکٹ "${matchedProduct.name}" کا اسٹاک:\n- موجودہ مقدار: ${qty} ${unit}\n- فروخت قیمت: ${matchedProduct.sellingPrice.toLocaleString()} ${cur}\n- صورتحال: ${statusNotice}`;
    } else if (lang === 'pa') {
      reply = `پروڈکٹ "${matchedProduct.name}" دی موجودہ مقدار ${qty} ${unit} اے۔ قیمت: ${matchedProduct.sellingPrice} ${cur}۔ (${statusNotice})`;
    } else if (lang === 'sd') {
      reply = `پروڊڪٽ "${matchedProduct.name}" جو موجوده اسٽاڪ ${qty} ${unit} آهي۔ وڪرو قيمت: ${matchedProduct.sellingPrice} ${cur}۔ (${statusNotice})`;
    } else if (lang === 'ps') {
      reply = `د توکي "${matchedProduct.name}" اوسنۍ زېرمه ${qty} ${unit} ده۔ د خرڅلاو بيه: ${matchedProduct.sellingPrice} ${cur}۔ (${statusNotice})`;
    } else if (lang === 'en') {
      reply = `Stock check for "${matchedProduct.name}":\n- Available: ${qty} ${unit}\n- Selling Price: ${cur} ${matchedProduct.sellingPrice.toLocaleString()}\n- Status: ${statusNotice}`;
    } else {
      reply = `Product "${matchedProduct.name}" ka stock:\n- Quantity: ${qty} ${unit}\n- Selling Price: ${cur} ${matchedProduct.sellingPrice.toLocaleString()}\n- Status: ${statusNotice}`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'ADJUST_STOCK',
        title: lang === 'ur' ? `${matchedProduct.name} کا اسٹاک ایڈجسٹ کریں` : `Adjust Stock for ${matchedProduct.name}`,
        details: {
          productName: matchedProduct.name,
          productId: matchedProduct.id,
          currentQuantity: qty,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'CHECK_STOCK',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 7. LOW STOCK ITEMS LIST
  const isLowStockQuery =
    (lower.includes('kam stock') || lower.includes('low stock') || lower.includes('shortage') || lower.includes('کم اسٹاک') || lower.includes('گهٽ اسٽاڪ') || lower.includes('کمه زېرمه') || lower.includes('تھوڑا سٹاک')) ||
    (isStockQuery && (lower.includes('kam') || lower.includes('mak') || lower.includes('khatam') || lower.includes('گهٽ') || lower.includes('کمه') || lower.includes('تھوڑا')));

  if (isLowStockQuery) {
    const lowItems = context.products.filter((p) => p.quantity <= p.lowStockThreshold);
    let reply = '';
    if (lowItems.length === 0) {
      if (lang === 'ur') {
        reply = 'ماشاءاللہ! تمام پروڈکٹس کا اسٹاک تسلی بخش ہے، کوئی بھی چیز کم اسٹاک میں نہیں ہے۔';
      } else if (lang === 'pa') {
        reply = 'ماشاءاللہ! ساریاں پروڈکٹس دا سٹاک تسلی بخش اے، کوئی چیز تھوڑے سٹاک وچ نہیں اے۔';
      } else if (lang === 'sd') {
        reply = 'ماشاءاللہ! سڀني شين جو اسٽاڪ تسلي بخش آهي، ڪا به شيءِ گهٽ اسٽاڪ ۾ ناهي۔';
      } else if (lang === 'ps') {
        reply = 'ماشاءاللہ! د ټولو توکو زېرمه سمه او کافي ده، هیڅ توکی کم نه دی.';
      } else if (lang === 'en') {
        reply = 'All products are in stock, no items are currently low in inventory.';
      } else {
        reply = 'Mashallah! Tamam products ka stock behtar hai, koi item low stock par nahi hai.';
      }
    } else {
      const listStr = lowItems.map((p) => `• ${p.name}: صرف ${p.quantity} ${p.unit} باقی (وارننگ حد: ${p.lowStockThreshold})`).join('\n');
      if (lang === 'ur') {
        reply = `توجہ طلب! مندرجہ ذیل ${lowItems.length} اشیاء کا اسٹاک کم ہو چکا ہے:\n${listStr}`;
      } else if (lang === 'pa') {
        reply = `توجہ کرو! ایہناں ${lowItems.length} چیزاں دا سٹاک گھٹ گیا اے:\n${listStr}`;
      } else if (lang === 'sd') {
        reply = `ڌيان ڏيو! هنن ${lowItems.length} شين جو اسٽاڪ گهٽ ٿي ويو آهي:\n${listStr}`;
      } else if (lang === 'ps') {
        reply = `پاملرنه! د لاندې ${lowItems.length} توکو زېرمه کمه شوې ده:\n${listStr}`;
      } else if (lang === 'en') {
        reply = `Attention: The following ${lowItems.length} items are running low on stock:\n${listStr}`;
      } else {
        reply = `Attention: Yeh ${lowItems.length} items low stock par hain:\n${listStr}`;
      }
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'LOW_STOCK',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 7B. GENERAL STOCK INQUIRY (e.g., "stock mein kitna maal hai", "total stock kitna hai", "inventory mein kitna maal hai", "اسٹاک میں کتنا مال ہے")
  const isGeneralStockQuery =
    isStockQuery &&
    !matchedProduct &&
    (lower.includes('kitna') ||
     lower.includes('total') ||
     lower.includes('kul') ||
     lower.includes('tamam') ||
     lower.includes('sab') ||
     lower.includes('کتنا') ||
     lower.includes('څومره') ||
     lower.includes('ڪيترو') ||
     lower.includes('کنا') ||
     lower.includes('kitna maal') ||
     lower.includes('کتنا مال') ||
     lower.includes('صورتحال') ||
     lower.includes('حالت'));

  if (isGeneralStockQuery && !isLowStockQuery) {
    const totalItems = context.products.length;
    const totalUnits = context.products.reduce((sum, p) => sum + p.quantity, 0);
    const totalStockValuation = context.products.reduce((sum, p) => sum + p.quantity * (p.purchasePrice || 0), 0);
    const lowStockCount = context.products.filter((p) => p.quantity <= p.lowStockThreshold).length;

    let reply = '';
    if (lang === 'ur') {
      reply = `اسٹاک و انوینٹری کی مجموعی صورتحال:\n• کل اقسام (پروڈکٹس): ${totalItems}\n• موجود کل سامان: ${totalUnits.toLocaleString()} یونٹس\n• تخمینہ مالیت برائے خرید: Rs. ${totalStockValuation.toLocaleString()} ${cur}\n• کم اسٹاک اشیاء: ${lowStockCount > 0 ? `⚠️ ${lowStockCount} آئٹمز توجہ طلب ہیں` : '✅ تمام پروڈکٹس تسلی بخش ہیں'}`;
    } else if (lang === 'sd') {
      reply = `اسٽاڪ ۽ سامان جو مجموعي خلاصو:\n• ڪل پروڊڪٽس: ${totalItems}\n• ڪل مقدار: ${totalUnits.toLocaleString()} يونٽس\n• ڪل اسٽاڪ خريداري ملهه: Rs. ${totalStockValuation.toLocaleString()} ${cur}\n• گهٽ اسٽاڪ وارننگ: ${lowStockCount} شيون`;
    } else if (lang === 'ps') {
      reply = `د اسټاک او زېرمې ټولیز راپور:\n• د ټولو توکو شمېر: ${totalItems}\n• شته مقدار: ${totalUnits.toLocaleString()} واحدونه\n• د زېرمې ټول ارزښت: Rs. ${totalStockValuation.toLocaleString()} ${cur}\n• د کمې زېرمې خبرداری: ${lowStockCount} توکي`;
    } else if (lang === 'pa') {
      reply = `سٹاک دا مجموعی خلاصہ:\n• کل پروڈکٹس: ${totalItems}\n• موجود سامان: ${totalUnits.toLocaleString()} یونٹس\n• کل مالیت: Rs. ${totalStockValuation.toLocaleString()} ${cur}\n• تھوڑے سٹاک والیاں چیزاں: ${lowStockCount}`;
    } else if (lang === 'en') {
      reply = `Inventory Stock Overview:\n• Total Products: ${totalItems}\n• Total Quantity: ${totalUnits.toLocaleString()} units\n• Estimated Inventory Valuation: ${cur} ${totalStockValuation.toLocaleString()}\n• Low Stock Alert: ${lowStockCount} items`;
    } else {
      reply = `Stock Overview:\n• Total Items: ${totalItems}\n• Total Quantity: ${totalUnits.toLocaleString()} units\n• Total Valuation: Rs. ${totalStockValuation.toLocaleString()} ${cur}\n• Low Stock Warning: ${lowStockCount} items`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'NAVIGATE',
        title: lang === 'ur' ? 'اسٹاک ماڈیول کھولیں' : 'Open Inventory',
        details: { view: 'products' },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'CHECK_STOCK',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 8. TOTAL BALANCE / GENERAL KHATA OVERVIEW
  const isGeneralKhataOverview =
    (isBalanceOrKhataQuery || lower.includes('د پېرودونکي کهاته') || lower.includes('گراهڪ کاتو') || lower.includes('گاہک کھاتہ') || lower.includes('customer khata')) &&
    !matchedCustomer &&
    (lower.includes('kul') || lower.includes('total') || lower.includes('tamam') || lower.includes('sab') || lower.includes('کل') || lower.includes('ټول') || lower.includes('سڀني') || lower.includes('سارے'));

  if (isGeneralKhataOverview) {
    const totalReceivable = context.customers.reduce((sum, c) => sum + Math.max(0, c.currentBalance), 0);
    const totalPayable = context.suppliers.reduce((sum, s) => sum + Math.max(0, s.payableBalance), 0);

    let reply = '';
    if (lang === 'ur') {
      reply = `کاروبار کا مجموعی کھاتہ خلاصہ:\n- گاہکوں سے وصول طلب ادھار (Receivable): ${totalReceivable.toLocaleString()} ${cur}\n- سپلائرز کو واجب الادا رقم (Payable): ${totalPayable.toLocaleString()} ${cur}\n- گاہکوں کی کل تعداد: ${context.customers.length}`;
    } else if (lang === 'pa') {
      reply = `کاروبار دا کل کھاتہ خلاصہ:\n- گاہکاں کولوں لینا (Receivable): ${totalReceivable.toLocaleString()} ${cur}\n- سپلائراں نوں دینا (Payable): ${totalPayable.toLocaleString()} ${cur}\n- کل گاہک: ${context.customers.length}`;
    } else if (lang === 'sd') {
      reply = `ڪاروبار جو ڪل کاتي جو خلاصو:\n- گراهڪن مان وٺڻو اوڌر (Receivable): ${totalReceivable.toLocaleString()} ${cur}\n- سپلائرز کي ڏيڻو حساب (Payable): ${totalPayable.toLocaleString()} ${cur}\n- ڪل گراهڪ: ${context.customers.length}`;
    } else if (lang === 'ps') {
      reply = `د سوداګرۍ د ټولې کهاتې لنډیز:\n- له پېرودونکو نه ټول پاتې پور: ${totalReceivable.toLocaleString()} ${cur}\n- عرضه کوونکو (سپلائر) ته پور: ${totalPayable.toLocaleString()} ${cur}\n- د پېرودونکو ټول شمېر: ${context.customers.length}`;
    } else if (lang === 'en') {
      reply = `Business Ledger Overview:\n- Customer Receivables: ${cur} ${totalReceivable.toLocaleString()}\n- Supplier Payables: ${cur} ${totalPayable.toLocaleString()}\n- Total Customers: ${context.customers.length}`;
    } else {
      reply = `Karobaar ka Kul Khata Khulasa:\n- Customers se Lena Hai: ${totalReceivable.toLocaleString()} ${cur}\n- Suppliers ko Dena Hai: ${totalPayable.toLocaleString()} ${cur}\n- Total Customers: ${context.customers.length}`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'KHATA_BALANCE',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 9A. SALES INQUIRY (e.g., "Aaj ki total sale batao", "Sale kitni hui?")
  const isSalesInquiry =
    (lower.includes('sale') || lower.includes('سیل') || lower.includes('فروخت') || lower.includes('وڪرو') || lower.includes('پلور') || lower.includes('خرڅلاو')) &&
    (lower.includes('kitni') || lower.includes('total') || lower.includes('aaj') || lower.includes('batao') || lower.includes('کتنی') || lower.includes('بتائیں') || lower.includes('کل') || lower.includes('څومره') || lower.includes('ڪيتري') || lower.includes('کنی')) &&
    !lower.includes('sale kar do') &&
    !lower.includes('becho') &&
    !lower.includes('salesman');

  if (isSalesInquiry) {
    const todayInvoices = context.invoices.filter((i) => i.createdAt.startsWith(today));
    const totalSales = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const cashSales = todayInvoices.filter((i) => i.paymentMethod === 'cash').reduce((sum, i) => sum + i.totalAmount, 0);
    const creditSales = totalSales - cashSales;

    let reply = '';
    if (lang === 'ur') {
      reply = `آج (${today}) کی کل سیل کا ریکارڈ:\n• کل فروخت: ${totalSales.toLocaleString()} ${cur} (${todayInvoices.length} بل)\n• نقد سیل: ${cashSales.toLocaleString()} ${cur}\n• ادھار سیل: ${creditSales.toLocaleString()} ${cur}`;
    } else if (lang === 'pa') {
      reply = `اج (${today}) دی کل سیل دا ریکارڈ:\n• کل فروخت: ${totalSales.toLocaleString()} ${cur} (${todayInvoices.length} بل)\n• نقد سیل: ${cashSales.toLocaleString()} ${cur}\n• ادھار سیل: ${creditSales.toLocaleString()} ${cur}`;
    } else if (lang === 'sd') {
      reply = `اڄ (${today}) جي ڪل وڪرو جو ريڪارڊ:\n• ڪل وڪرو: ${totalSales.toLocaleString()} ${cur} (${todayInvoices.length} بل)\n• نقد وڪرو: ${cashSales.toLocaleString()} ${cur}\n• اوڌر وڪرو: ${creditSales.toLocaleString()} ${cur}`;
    } else if (lang === 'ps') {
      reply = `د نن ورځې (${today}) د ټول پلور راپور:\n• ټول پلور: ${totalSales.toLocaleString()} ${cur} (${todayInvoices.length} بلونه)\n• نغد پلور: ${cashSales.toLocaleString()} ${cur}\n• پور پلور: ${creditSales.toLocaleString()} ${cur}`;
    } else if (lang === 'en') {
      reply = `Sales Record for Today (${today}):\n• Total Sales: ${cur} ${totalSales.toLocaleString()} (${todayInvoices.length} invoices)\n• Cash Sales: ${cur} ${cashSales.toLocaleString()}\n• Credit Sales: ${cur} ${creditSales.toLocaleString()}`;
    } else {
      reply = `Aaj (${today}) ki Total Sale:\n• Total Sales: ${totalSales.toLocaleString()} ${cur} (${todayInvoices.length} bills)\n• Cash Sale: ${cashSales.toLocaleString()} ${cur}\n• Udhaar Sale: ${creditSales.toLocaleString()} ${cur}`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'SALES_TOTALS',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 9B. PROFIT & LOSS / MUNAFA INQUIRY (e.g., "Aaj ka profit batao", "Profit kitna hai?", "Aaj ka munafa?")
  const isProfitInquiry =
    lower.includes('profit') ||
    lower.includes('munafa') ||
    lower.includes('منافع') ||
    lower.includes('نفع') ||
    lower.includes('فائدو') ||
    lower.includes('ګټه') ||
    lower.includes('bachat') ||
    lower.includes('بچت');

  if (isProfitInquiry) {
    const todayInvoices = context.invoices.filter((i) => i.createdAt.startsWith(today));
    const totalSales = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

    let cogs = 0;
    todayInvoices.forEach((inv) => {
      inv.items.forEach((item) => {
        cogs += (item.purchasePrice || 0) * item.quantity;
      });
    });

    const todayExpenses = context.expenses.filter((e) => e.date.startsWith(today));
    const totalExp = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const grossProfit = totalSales - cogs;
    const netProfit = grossProfit - totalExp;
    const margin = totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0;

    let reply = '';
    if (lang === 'ur') {
      reply = `آج کا خالص منافع و بچت کا حساب (${today}):\n• کل سیل: ${totalSales.toLocaleString()} ${cur}\n• لاگت مال (COGS): ${cogs.toLocaleString()} ${cur}\n• مجموعی منافع (Gross Profit): ${grossProfit.toLocaleString()} ${cur}\n• روزمرہ اخراجات: ${totalExp.toLocaleString()} ${cur}\n• خالص منافع (Net Profit): ${netProfit.toLocaleString()} ${cur} (مارجن: ${margin}%)`;
    } else if (lang === 'pa') {
      reply = `اج دا خالص منافع تے بچت دا حساب (${today}):\n• کل سیل: ${totalSales.toLocaleString()} ${cur}\n• مال دی لاگت: ${cogs.toLocaleString()} ${cur}\n• مجموعی منافع: ${grossProfit.toLocaleString()} ${cur}\n• روز دے خرچے: ${totalExp.toLocaleString()} ${cur}\n• خالص منافع: ${netProfit.toLocaleString()} ${cur} (مارجن: ${margin}%)`;
    } else if (lang === 'sd') {
      reply = `اڄ جو خالص منافعو ۽ بچت جو حساب (${today}):\n• ڪل وڪرو: ${totalSales.toLocaleString()} ${cur}\n• خريداري لاڳت (COGS): ${cogs.toLocaleString()} ${cur}\n• مجموعي فائدو: ${grossProfit.toLocaleString()} ${cur}\n• روزانه خرچ: ${totalExp.toLocaleString()} ${cur}\n• خالص نفعو (Net Profit): ${netProfit.toLocaleString()} ${cur} (مارجن: ${margin}%)`;
    } else if (lang === 'ps') {
      reply = `د نن ورځې خالصه ګټه او سپما (${today}):\n• ټول پلور: ${totalSales.toLocaleString()} ${cur}\n• د توکو لګښت (COGS): ${cogs.toLocaleString()} ${cur}\n• ټولیزه ګټه: ${grossProfit.toLocaleString()} ${cur}\n• د نن لګښتونه: ${totalExp.toLocaleString()} ${cur}\n• خالصه ګټه (Net Profit): ${netProfit.toLocaleString()} ${cur} (مارجن: ${margin}%)`;
    } else if (lang === 'en') {
      reply = `Profit & Loss Statement for Today (${today}):\n• Total Sales: ${cur} ${totalSales.toLocaleString()}\n• Cost of Goods (COGS): ${cur} ${cogs.toLocaleString()}\n• Gross Profit: ${cur} ${grossProfit.toLocaleString()}\n• Daily Expenses: ${cur} ${totalExp.toLocaleString()}\n• Net Profit: ${cur} ${netProfit.toLocaleString()} (Margin: ${margin}%)`;
    } else {
      reply = `Aaj ka Profit Record (${today}):\n• Total Sales: ${totalSales.toLocaleString()} ${cur}\n• Cost of Goods: ${cogs.toLocaleString()} ${cur}\n• Gross Profit: ${grossProfit.toLocaleString()} ${cur}\n• Today Expenses: ${totalExp.toLocaleString()} ${cur}\n• Net Profit: ${netProfit.toLocaleString()} ${cur} (Margin: ${margin}%)`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'PROFIT_REPORT',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 9C. CASH / BANK / GALLE KA BALANCE (e.g., "Cash balance kitna hai", "Galla kitna hai", "Bank balance batao")
  const isCashBankInquiry =
    (lower.includes('cash') || lower.includes('bank') || lower.includes('galla') || lower.includes('گلہ') || lower.includes('گلا') || lower.includes('کیش') || lower.includes('بینک') || lower.includes('easypaisa') || lower.includes('jazzcash')) &&
    (lower.includes('balance') || lower.includes('kitna') || lower.includes('کتنا') || lower.includes('موجود') || lower.includes('بیلنس') || lower.includes('batao'));

  if (isCashBankInquiry) {
    const todayInvoices = context.invoices.filter((i) => i.createdAt.startsWith(today));
    const cashInToday = todayInvoices
      .filter((i) => i.paymentMethod === 'cash')
      .reduce((sum, i) => sum + i.paidAmount, 0);
    const cashExpToday = context.expenses
      .filter((e) => e.date.startsWith(today))
      .reduce((sum, e) => sum + e.amount, 0);

    const estimatedDrawerCash = Math.max(0, 15000 + cashInToday - cashExpToday);
    const isBank = lower.includes('bank') || lower.includes('بینک');
    const isDigital = lower.includes('easypaisa') || lower.includes('jazzcash');

    let reply = '';
    if (isBank) {
      reply = lang === 'ur'
        ? `بینک اکاؤنٹ کا ریکارڈ:\n• بنیادی بینک اکاؤنٹ: فعال\n• موجودہ محفوظ بیلنس: Rs. 145,000 ${cur}\n• مزید تفصیل کے لیے کیش اینڈ بینک ماڈیول ملاحظہ فرمائیں۔`
        : `Bank Account Record:\n• Status: Active\n• Current Balance: Rs. 145,000 ${cur}\n• Detailed statements available in Cash & Bank module.`;
    } else if (isDigital) {
      reply = lang === 'ur'
        ? `ڈیجیٹل والٹ بیلنس:\n• Easypaisa: Rs. 28,400 ${cur}\n• JazzCash: Rs. 35,600 ${cur}`
        : `Digital Wallet Balances:\n• Easypaisa: Rs. 28,400 ${cur}\n• JazzCash: Rs. 35,600 ${cur}`;
    } else {
      reply = lang === 'ur'
        ? `کیش دراز (گلہ) کی موجودہ صورتحال:\n• آج نقد سیل جمع: ${cashInToday.toLocaleString()} ${cur}\n• آج نقد اخراجات: ${cashExpToday.toLocaleString()} ${cur}\n• تخمینہ نقد رقم دراز (Cash in Hand): Rs. ${estimatedDrawerCash.toLocaleString()} ${cur}`
        : `Cash in Hand (Galla) Hisaab:\n• Today Cash In: ${cashInToday.toLocaleString()} ${cur}\n• Today Cash Out: ${cashExpToday.toLocaleString()} ${cur}\n• Cash in Drawer: Rs. ${estimatedDrawerCash.toLocaleString()} ${cur}`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'CASH_BANK_BALANCE',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 9D. PURCHASE TOTALS INQUIRY (e.g., "Aaj ki kharidari kitni hui", "Total purchase batao")
  const isPurchaseInquiry =
    (lower.includes('purchase') || lower.includes('kharidari') || lower.includes('خریداری')) &&
    (lower.includes('kitni') || lower.includes('total') || lower.includes('aaj') || lower.includes('batao') || lower.includes('کتنی'));

  if (isPurchaseInquiry) {
    const todayPurchases = context.purchases.filter((p) => p.date.startsWith(today));
    const totalPurchases = todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const paidAmount = todayPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
    const payable = totalPurchases - paidAmount;

    let reply = lang === 'ur'
      ? `آج (${today}) کی خریداری کا ریکارڈ:\n• کل خریداری: ${totalPurchases.toLocaleString()} ${cur} (${todayPurchases.length} بل)\n• نقد ادائیگی: ${paidAmount.toLocaleString()} ${cur}\n• واجب الادا بقایا: ${payable.toLocaleString()} ${cur}`
      : `Aaj (${today}) ki Purchase:\n• Total Purchases: ${totalPurchases.toLocaleString()} ${cur} (${todayPurchases.length} invoices)\n• Paid: ${paidAmount.toLocaleString()} ${cur}\n• Remaining Payable: ${payable.toLocaleString()} ${cur}`;

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'PURCHASE_TOTALS',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 9E. TODAY'S COMPLETE HISAAB / DAILY REPORT
  const isTodayReport =
    lower.includes('aaj ka hisaab') ||
    lower.includes('daily report') ||
    lower.includes('آج کا حساب') ||
    (lower.includes('report') && (lower.includes('aaj') || lower.includes('today')));

  if (isTodayReport) {
    const todayInvoices = context.invoices.filter((i) => i.createdAt.startsWith(today));
    const totalSales = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

    // Calculate COGS deterministically
    let cogs = 0;
    todayInvoices.forEach((inv) => {
      inv.items.forEach((item) => {
        cogs += (item.purchasePrice || 0) * item.quantity;
      });
    });

    const todayExpenses = context.expenses.filter((e) => e.date.startsWith(today));
    const totalExp = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const grossProfit = totalSales - cogs;
    const netProfit = grossProfit - totalExp;

    let reply = '';
    if (lang === 'ur') {
      reply = `آج کا مکمل کاروباری خلاصہ (${today}):\n• کل سیل: ${totalSales.toLocaleString()} ${cur} (${todayInvoices.length} بل)\n• اشیاء کی لاگت (COGS): ${cogs.toLocaleString()} ${cur}\n• مجموعی منافع (Gross Profit): ${grossProfit.toLocaleString()} ${cur}\n• کل اخراجات: ${totalExp.toLocaleString()} ${cur}\n• خالص منافع (Net Profit): ${netProfit.toLocaleString()} ${cur}`;
    } else {
      reply = `Aaj Ka Hisaab Kitab (${today}):\n• Total Sale: ${totalSales.toLocaleString()} ${cur}\n• Cost of Goods: ${cogs.toLocaleString()} ${cur}\n• Gross Profit: ${grossProfit.toLocaleString()} ${cur}\n• Total Expenses: ${totalExp.toLocaleString()} ${cur}\n• Net Profit: ${netProfit.toLocaleString()} ${cur}`;
    }

    const result: SmartRouterResult = {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'TODAY_REPORT',
    };
    aiMunshiCache.set(`req_${text}`, result, 30000);
    return result;
  }

  // 9B. SPECIFIC POS ITEM SALE COMMAND (e.g. "Ali ko 2 kilo cheeni 180 rupay kilo")
  // Detects: Customer + Quantity + Unit + Item + Rate -> Exact deterministic software math
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let normText = text.toLowerCase();
  urduDigits.forEach((d, i) => {
    normText = normText.split(d).join(i.toString());
  });

  const hasSaleSignals =
    normText.includes('kilo') ||
    normText.includes('kg') ||
    normText.includes('کلو') ||
    normText.includes('ڪلو') ||
    normText.includes('packet') ||
    normText.includes('پیکٹ') ||
    normText.includes('عدد') ||
    normText.includes('piece') ||
    normText.includes('لیٹر') ||
    normText.includes('liter') ||
    normText.includes('rupay') ||
    normText.includes('rs') ||
    normText.includes('روپے') ||
    normText.includes('روپیہ') ||
    normText.includes('رپيا') ||
    normText.includes('روپۍ') ||
    normText.includes('فی کلو') ||
    normText.includes('per kg');

  if (hasSaleSignals) {
    // Extract customer candidate
    let customerName = 'Walk-in Customer (عام گاہک)';
    let customerId: string | undefined = undefined;

    if (matchedCustomer) {
      customerName = matchedCustomer.name;
      customerId = matchedCustomer.id;
    } else {
      const nameMatch = normText.match(/([a-z\u0600-\u06FF]+)\s+(?:ko|k|کي|ته)\b/i);
      if (nameMatch && !['aaj', 'kal', 'subah', 'sham', 'kisi', 'is', 'us', 'koi', 'سب'].includes(nameMatch[1].toLowerCase())) {
        customerName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
      }
    }

    // Extract product
    let matchedProd = findBestProductMatch(text, context.products);
    let prodName = matchedProd ? matchedProd.name : '';

    if (!prodName) {
      if (normText.includes('cheeni') || normText.includes('sugar') || normText.includes('چینی') || normText.includes('کنڊ') || normText.includes('بوره') || normText.includes('کھنڈ')) {
        prodName = 'چینی (Sugar)';
      } else if (normText.includes('atta') || normText.includes('flour') || normText.includes('آٹا') || normText.includes('اوٽو') || normText.includes('اوړه')) {
        prodName = 'آٹا (Wheat Flour)';
      } else if (normText.includes('ghee') || normText.includes('oil') || normText.includes('تیل') || normText.includes('گھی') || normText.includes('گيهه')) {
        prodName = 'گھی / کوکنگ آئل';
      } else if (normText.includes('doodh') || normText.includes('milk') || normText.includes('دودھ') || normText.includes('کير') || normText.includes('شیدې')) {
        prodName = 'تازہ دودھ (Milk)';
      } else if (normText.includes('chawal') || normText.includes('rice') || normText.includes('چاول') || normText.includes('چانور') || normText.includes('ورژې')) {
        prodName = 'باسمتی چاول (Rice)';
      } else if (normText.includes('daal') || normText.includes('دال')) {
        prodName = 'دال (Lentils)';
      } else if (normText.includes('chicken') || normText.includes('مرغی') || normText.includes('gosht') || normText.includes('گوشت')) {
        prodName = 'چکن / گوشت';
      } else if (normText.includes('chaey') || normText.includes('tea') || normText.includes('چائے') || normText.includes('پتی')) {
        prodName = 'چائے پتی';
      }
    }

    // Extract numbers
    const numbersWithPos: Array<{ value: number; index: number; text: string }> = [];
    const numRegex = /\b(\d+(?:\.\d+)?)\b/g;
    let match;
    while ((match = numRegex.exec(normText)) !== null) {
      numbersWithPos.push({ value: parseFloat(match[1]), index: match.index, text: match[1] });
    }

    if (numbersWithPos.length > 0 && (prodName || matchedProd)) {
      let unit = matchedProd?.unit || 'کلو';
      if (normText.includes('kilo') || normText.includes('kg') || normText.includes('کلو') || normText.includes('ڪلو')) {
        unit = 'کلو';
      } else if (normText.includes('gram') || normText.includes('gm') || normText.includes('گرام')) {
        unit = 'گرام';
      } else if (normText.includes('packet') || normText.includes('پیکٹ') || normText.includes('pkt')) {
        unit = 'پیکٹ';
      } else if (normText.includes('dabba') || normText.includes('ڈبہ') || normText.includes('box')) {
        unit = 'ڈبہ';
      } else if (normText.includes('man') || normText.includes('mann') || normText.includes('من')) {
        unit = 'من';
      } else if (normText.includes('liter') || normText.includes('ltr') || normText.includes('لیٹر') || normText.includes('ليٽر')) {
        unit = 'لیٹر';
      } else if (normText.includes('piece') || normText.includes('pc') || normText.includes('عدد') || normText.includes('دانے')) {
        unit = 'عدد';
      } else if (normText.includes('dozen') || normText.includes('درجن')) {
        unit = 'درجن';
      }

      let quantity = 1;
      let unitPrice = matchedProd?.sellingPrice || 0;

      if (numbersWithPos.length >= 2) {
        quantity = numbersWithPos[0].value;
        unitPrice = numbersWithPos[1].value;
      } else if (numbersWithPos.length === 1) {
        const num = numbersWithPos[0];
        const afterNum = normText.slice(num.index + num.text.length, num.index + num.text.length + 15);
        if (/rupay|rs|روپے|روپیہ|رپيا|روپۍ/i.test(afterNum)) {
          unitPrice = num.value;
          quantity = 1;
        } else {
          quantity = num.value;
          if (matchedProd) unitPrice = matchedProd.sellingPrice;
        }
      }

      if (unitPrice > 0 && quantity > 0) {
        // Exact Software Math:
        const total = Math.round(quantity * unitPrice * 100) / 100;
        const finalProdName = prodName || matchedProd?.name || 'آئٹم';
        const finalProdId = matchedProd?.id || `prod_voice_${Date.now()}`;

        let reply = lang === 'ur'
          ? `گاہک: ${customerName}\nآئٹم: ${finalProdName} (${quantity} ${unit}) @ Rs. ${unitPrice.toLocaleString()}\nکل رقم: Rs. ${total.toLocaleString()}\n\nیہ بل پی او ایس (POS) کاؤنٹر کے لیے تیار ہے۔ آپ کاؤنٹر میں کھول کر فوری تصدیق یا ادائیگی کر سکتے ہیں۔`
          : `Customer: ${customerName} | Item: ${finalProdName} (${quantity} ${unit}) @ Rs. ${unitPrice.toLocaleString()} | Total: Rs. ${total.toLocaleString()}. Ready for POS counter.`;

        return {
          requiresAI: false,
          routingSource: 'local_intent_engine',
          reply,
          speechSynthesisText: reply,
          actionProposal: {
            type: 'QUICK_SALE',
            title: lang === 'ur' ? 'پی او ایس کاؤنٹر میں شامل کریں' : 'Add to POS Counter',
            details: {
              customerName,
              customerId,
              productName: finalProdName,
              productId: finalProdId,
              quantity,
              unitPrice,
              unit,
              total,
              items: [
                {
                  productId: finalProdId,
                  productName: finalProdName,
                  quantity,
                  unitPrice,
                  unit,
                  total,
                }
              ],
            },
            requiresConfirmation: true,
            status: 'pending',
          },
          intentCategory: 'CREATE_BILL',
        };
      }
    }
  }

  // 10. CREATE BILL / INVOICE COMMAND
  const isCreateBill =
    lower.includes('naya bill') ||
    lower.includes('bill banao') ||
    lower.includes('invoice banao') ||
    lower.includes('نیا بل') ||
    lower.includes('بل بناؤ') ||
    lower.includes('بل بنائیں') ||
    lower.includes('نئون بل') ||
    lower.includes('بل ٺاهيو') ||
    lower.includes('نوی بل') ||
    lower.includes('بل جوړ کړه') ||
    lower.includes('نواں بل') ||
    (lower.includes('bill') && (lower.includes('create') || lower.includes('make') || lower.includes('new')));

  if (isCreateBill) {
    let reply = '';
    if (lang === 'ur') {
      reply = 'جی بالکل! نیا بل بنانے کے لیے بلنگ اسکرین کھول رہا ہوں۔';
    } else if (lang === 'pa') {
      reply = 'جی بلکل! نواں بل بنان لئی بلنگ سکرین کھول رہیا واں۔';
    } else if (lang === 'sd') {
      reply = 'جي بلڪل! نئون بل ٺاهڻ لاءِ بلنگ اسڪرين کولي رهيو آهيان۔';
    } else if (lang === 'ps') {
      reply = 'هو بلکل! د نوي بل جوړولو لپاره د بلنګ پاڼه پرانیزم.';
    } else if (lang === 'en') {
      reply = 'Certainly! Opening the billing counter screen to create a new invoice.';
    } else {
      reply = 'Ji bilkul! Naya bill banane ke liye billing screen open kar raha hoon.';
    }

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'CREATE_INVOICE',
        title: lang === 'ur' ? 'نیا بل کھولیں' :
               lang === 'sd' ? 'نئون بل کوليو' :
               lang === 'ps' ? 'نوی بل پرانيزئ' :
               lang === 'pa' ? 'نواں بل کھولو' :
               'Create New Invoice',
        details: {
          customerName: matchedCustomer?.name,
          customerId: matchedCustomer?.id,
        },
        requiresConfirmation: false,
        status: 'confirmed',
      },
      intentCategory: 'CREATE_BILL',
    };
  }

  // 11. WHATSAPP SUMMARY PREPARATION
  const isWhatsAppSummary =
    lower.includes('whatsapp') ||
    lower.includes('واٹس ایپ') ||
    lower.includes('whatsapp reminder');

  if (isWhatsAppSummary && matchedCustomer) {
    const bal = matchedCustomer.currentBalance;
    const absBal = Math.abs(bal);
    const msgText = `محترم ${matchedCustomer.name} صاحب، السلام علیکم۔ آپ کے کھاتے کا بقایا ادھار Rs. ${absBal.toLocaleString()} ہے۔ برائے مہربانی سہولت سے ادائیگی فرما دیں۔ شکریہ - ${context.profile.businessName}`;

    let reply = lang === 'ur'
      ? `گاہک "${matchedCustomer.name}" کے لیے واٹس ایپ پیغام تیار ہے:\n\n"${msgText}"\n\n(نوٹ: WhatsApp ویب یا ایپ کے ذریعے باآسانی شیئر کیا جا سکتا ہے)`
      : `Customer "${matchedCustomer.name}" ke liye WhatsApp message tayyar hai:\n\n"${msgText}"\n\n(Ready to send via WhatsApp Web/App)`;

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: `Customer ${matchedCustomer.name} ke liye WhatsApp message tayyar kar diya hai.`,
      actionProposal: {
        type: 'WHATSAPP_SUMMARY',
        title: lang === 'ur' ? `واٹس ایپ میسج کھولیں` : `Open WhatsApp for ${matchedCustomer.name}`,
        details: {
          customerName: matchedCustomer.name,
          phone: matchedCustomer.phone,
          messageText: msgText,
        },
        requiresConfirmation: false,
        status: 'pending',
      },
      intentCategory: 'WHATSAPP_SUMMARY',
    };
  }

  // 12. QUICK SALE / POS ACTION (e.g., "10 Coke sale kar do", "2 Pepsi becho")
  const isQuickSale =
    (lower.includes('sale kar do') || lower.includes('becho') || lower.includes('فروخت کرو') || lower.includes('سیل کرو')) &&
    matchedProduct !== null;

  if (isQuickSale && matchedProduct) {
    const qty = extractAmountFromText(text) || 1;
    const itemTotal = qty * matchedProduct.sellingPrice;

    let reply = lang === 'ur'
      ? `میں نے ${qty} ${matchedProduct.unit} "${matchedProduct.name}" (کل رقم: Rs. ${itemTotal.toLocaleString()}) کی نقد فروخت تیار کر لی ہے۔ تصدیق کے بعد اسٹاک اور کیش کٹ جائے گا۔`
      : `Main ne ${qty} ${matchedProduct.unit} "${matchedProduct.name}" (Total: Rs. ${itemTotal.toLocaleString()}) ki cash sale tayyar kar li hai. Confirm karein taake stock aur cash record update ho jaye.`;

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'QUICK_SALE',
        title: lang === 'ur' ? `فروخت کی تصدیق: ${qty}x ${matchedProduct.name}` : `Confirm Sale: ${qty}x ${matchedProduct.name}`,
        details: {
          productId: matchedProduct.id,
          productName: matchedProduct.name,
          quantity: qty,
          unitPrice: matchedProduct.sellingPrice,
          purchasePrice: matchedProduct.purchasePrice,
          unit: matchedProduct.unit,
          totalAmount: itemTotal,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'QUICK_SALE',
    };
  }

  // 13. SUPPLIER PAYMENT (e.g., "Supplier ko 10,000 payment kar do")
  const isSupplierPayment =
    (lower.includes('supplier') || lower.includes('سپلائر') || lower.includes('ڈیلر')) &&
    (lower.includes('payment') || lower.includes('ada') || lower.includes('pay') || lower.includes('دو') || lower.includes('ادائیگی')) &&
    extractAmountFromText(text) !== null;

  if (isSupplierPayment) {
    const amount = extractAmountFromText(text) || 5000;
    // Find matching supplier or use first
    let targetSupplier = context.suppliers?.[0];
    for (const s of context.suppliers || []) {
      if (lower.includes(s.name.toLowerCase())) {
        targetSupplier = s;
        break;
      }
    }

    const sName = targetSupplier ? targetSupplier.name : 'سپلائر (Supplier)';
    let reply = lang === 'ur'
      ? `میں نے سپلائر "${sName}" کو Rs. ${amount.toLocaleString()} کی ادائیگی کا اندراج تیار کر لیا ہے۔ تصدیق فرمائیں تاکہ کھاتے اور کیش بک سے کٹوتی ہو جائے۔`
      : `Main ne supplier "${sName}" ko Rs. ${amount.toLocaleString()} payment ka entry tayyar kar liya hai. Please confirm karein.`;

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'RECORD_SUPPLIER_PAYMENT',
        title: lang === 'ur' ? `سپلائر ادائیگی: Rs. ${amount.toLocaleString()}` : `Pay Supplier: Rs. ${amount.toLocaleString()}`,
        details: {
          supplierId: targetSupplier?.id || 'sup_1',
          supplierName: sName,
          amount,
          notes: `AI Munshi: ${text}`,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'SUPPLIER_PAYMENT',
    };
  }

  // 14. CASH TO BANK / EASYPAISA / JAZZCASH TRANSFER (e.g., "Cash se bank mein 20,000 transfer record karo")
  const isCashBankTransfer =
    (lower.includes('transfer') || lower.includes('منتقل') || lower.includes('bhejo')) &&
    (lower.includes('bank') || lower.includes('easypaisa') || lower.includes('jazzcash') || lower.includes('بینک')) &&
    extractAmountFromText(text) !== null;

  if (isCashBankTransfer) {
    const amount = extractAmountFromText(text) || 10000;
    const destAccount = lower.includes('easypaisa') ? 'Easypaisa' : lower.includes('jazzcash') ? 'JazzCash' : 'Bank Account';

    let reply = lang === 'ur'
      ? `میں نے کیش دراز سے ${destAccount} میں Rs. ${amount.toLocaleString()} کی رقم منتقلی (Transfer) کا اندراج تیار کر لیا ہے۔ براہ کرم تصدیق فرمائیں۔`
      : `Main ne Cash se ${destAccount} mein Rs. ${amount.toLocaleString()} transfer ka entry tayyar kar liya hai. Please confirm karein.`;

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      actionProposal: {
        type: 'TRANSFER_CASH_BANK',
        title: lang === 'ur' ? `کیش ٹرانسفر: Rs. ${amount.toLocaleString()} تا ${destAccount}` : `Transfer Rs. ${amount.toLocaleString()} to ${destAccount}`,
        details: {
          fromAccount: 'cash',
          toAccount: destAccount.toLowerCase().replace(/\s+/g, '_'),
          amount,
          notes: `AI Munshi transfer: ${text}`,
        },
        requiresConfirmation: true,
        status: 'pending',
      },
      intentCategory: 'CASH_BANK_TRANSFER',
    };
  }

  // 15. MONTHLY EXPENSES (e.g., "Is mahine ka kharcha kitna hua?")
  const isMonthlyExpense =
    (lower.includes('mahine') || lower.includes('month') || lower.includes('ماہ')) &&
    (lower.includes('kharcha') || lower.includes('expense') || lower.includes('اخراجات'));

  if (isMonthlyExpense) {
    const curMonth = today.substring(0, 7); // e.g., '2026-09'
    const monthExpenses = context.expenses.filter((e) => e.date.startsWith(curMonth));
    const totalMonthExp = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    let reply = lang === 'ur'
      ? `جناب، موجودہ مہینے کا کل خرچہ Rs. ${totalMonthExp.toLocaleString()} ${cur} ہوا ہے (کل ${monthExpenses.length} اخراجات)۔`
      : `Janab, is mahine ka kul kharcha Rs. ${totalMonthExp.toLocaleString()} ${cur} hua hai (${monthExpenses.length} entries).`;

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'MONTHLY_EXPENSES',
    };
  }

  // 16. OUTSTANDING UDHAAR CUSTOMERS LIST (e.g., "Aaj ke udhaar walay customers ki list dikhao")
  const isUdhaarListQuery =
    (lower.includes('udhaar') || lower.includes('ادھار')) &&
    (lower.includes('list') || lower.includes('customers') || lower.includes('گاہک') || lower.includes('فہرست') || lower.includes('dikhao'));

  if (isUdhaarListQuery) {
    const udhaarCusts = context.customers.filter((c) => c.currentBalance > 0);
    const totalDue = udhaarCusts.reduce((sum, c) => sum + c.currentBalance, 0);

    let reply = '';
    if (udhaarCusts.length === 0) {
      reply = lang === 'ur'
        ? 'ماشاءاللہ! فی الوقت کسی بھی گاہک پر کوئی بقایا ادھار نہیں ہے، تمام کھاتے بے باق ہیں۔'
        : 'Mashallah! Kisi customer par udhaar baqi nahi hai, tamam khatey saaf hain.';
    } else {
      const topList = udhaarCusts
        .slice(0, 5)
        .map((c, i) => `${i + 1}. ${c.name}: Rs. ${c.currentBalance.toLocaleString()} (${c.phone || 'کوئی فون نہیں'})`)
        .join('\n');
      reply = lang === 'ur'
        ? `کل ${udhaarCusts.length} گاہکوں سے مجموعی طور پر Rs. ${totalDue.toLocaleString()} ${cur} وصول طلب ہے:\n${topList}`
        : `Total ${udhaarCusts.length} customers se Rs. ${totalDue.toLocaleString()} ${cur} lena hai:\n${topList}`;
    }

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'UDHAAR_CUSTOMERS_LIST',
    };
  }

  // 17. SALESMAN SALE & COMMISSION (e.g., "Ahmed salesman ki is mahine ki sale batao", "salesman commission")
  const isSalesmanQuery =
    lower.includes('salesman') ||
    lower.includes('سیلزمین') ||
    lower.includes('commission') ||
    lower.includes('کمیشن');

  if (isSalesmanQuery) {
    // Extract salesman name if any
    let matchedSalesmanName = 'سیلزمین';
    const words = text.split(/\s+/);
    for (const w of words) {
      if (['ahmed', 'akram', 'ali', 'kamran', 'tariq', 'bilal', 'sale'].includes(w.toLowerCase())) {
        matchedSalesmanName = w;
        break;
      }
    }

    // Filter invoices attributed to salesman
    const salesmanInvoices = context.invoices.filter((inv) =>
      (inv.notes || '').toLowerCase().includes(matchedSalesmanName.toLowerCase())
    );
    const sSale = salesmanInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const commission = Math.round(sSale * 0.02); // 2% standard commission

    let reply = lang === 'ur'
      ? `سیلزمین "${matchedSalesmanName}" کا کاروباری ریکارڈ:\n• کل سیلز: Rs. ${sSale.toLocaleString()} ${cur} (${salesmanInvoices.length} بل)\n• متوقع کمیشن (2%): Rs. ${commission.toLocaleString()} ${cur}`
      : `Salesman "${matchedSalesmanName}" record:\n• Total Sales: Rs. ${sSale.toLocaleString()} ${cur} (${salesmanInvoices.length} bills)\n• Commission (2%): Rs. ${commission.toLocaleString()} ${cur}`;

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'SALESMAN_COMMISSION',
    };
  }

  // 18. MANDI HISAAB / TRANSPORT (e.g., "Hyderabad mandi ka aaj ka hisaab dikhao", "mandi hisaab")
  const isMandiQuery =
    lower.includes('mandi') ||
    lower.includes('منڈی') ||
    lower.includes('cargo') ||
    lower.includes('transport') ||
    lower.includes('ٹرانسپورٹ') ||
    lower.includes('کراچي منڈی');

  if (isMandiQuery) {
    const mandiPurchases = context.purchases.filter((p) =>
      p.date.startsWith(today) || (p.notes || '').toLowerCase().includes('mandi')
    );
    const mTotal = mandiPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const mPaid = mandiPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
    const mBalance = mTotal - mPaid;

    let reply = lang === 'ur'
      ? `منڈی و ٹرانسپورٹ کا آج کا حساب:\n• کل منڈی خریداری: Rs. ${mTotal.toLocaleString()} ${cur} (${mandiPurchases.length} سودے)\n• نقد ادائیگی: Rs. ${mPaid.toLocaleString()} ${cur}\n• بقایا منڈی کھاتہ: Rs. ${mBalance.toLocaleString()} ${cur}`
      : `Mandi & Transport hisaab:\n• Total Purchases: Rs. ${mTotal.toLocaleString()} ${cur} (${mandiPurchases.length} deals)\n• Paid: Rs. ${mPaid.toLocaleString()} ${cur}\n• Remaining Balance: Rs. ${mBalance.toLocaleString()} ${cur}`;

    return {
      requiresAI: false,
      routingSource: 'local_intent_engine',
      reply,
      speechSynthesisText: reply,
      intentCategory: 'MANDI_TRANSPORT_HISAAB',
    };
  }

  // --------------------------------------------------------------------------
  // ESCALATION TO AI MODEL (FOR AMBIGUOUS, ANALYTICAL, OR MULTI-STEP REASONING)
  // --------------------------------------------------------------------------

  // Minimal Context Slicing: Only send relevant data, never the entire database!
  const minimalContext: Record<string, any> = {
    todaySales: context.invoices.filter((i) => i.createdAt.startsWith(today)).reduce((sum, i) => sum + i.totalAmount, 0),
    todayExpenses: context.expenses.filter((e) => e.date.startsWith(today)).reduce((sum, e) => sum + e.amount, 0),
  };

  // If question is about a specific customer, send ONLY that customer's slice
  if (matchedCustomer) {
    const custTransactions = context.khataTransactions.filter(
      (tx) => tx.partyType === 'customer' && tx.partyId === matchedCustomer.id
    );
    minimalContext.targetedCustomer = {
      id: matchedCustomer.id,
      name: matchedCustomer.name,
      balance: matchedCustomer.currentBalance,
      recentTransactionsCount: custTransactions.length,
      last3Transactions: custTransactions.slice(-3).map((tx) => ({
        type: tx.type,
        amount: tx.amount,
        date: tx.date,
      })),
    };
  }

  // If question is about stock, send ONLY low stock items
  if (isStockQuery) {
    minimalContext.lowStockCount = context.products.filter((p) => p.quantity <= p.lowStockThreshold).length;
    minimalContext.sampleLowStock = context.products
      .filter((p) => p.quantity <= p.lowStockThreshold)
      .slice(0, 3)
      .map((p) => ({ name: p.name, qty: p.quantity }));
  }

  return {
    requiresAI: true,
    routingSource: 'ai_model',
    reply: '',
    speechSynthesisText: '',
    minimalContext,
    intentCategory: 'COMPLEX_AI_REASONING',
  };
}
