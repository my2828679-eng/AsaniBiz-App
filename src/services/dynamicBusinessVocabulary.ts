/**
 * AsaniBiz Dynamic Business Vocabulary & Entity Resolution Layer
 * 
 * Capabilities:
 * 1. Business-Agnostic vocabulary matching (Kiryana, Garments, Mandi, Mobile, Hardware, Restaurant, Workshop, Custom)
 * 2. Multilingual fuzzy & phonetic entity resolution (Urdu, Roman Urdu, Sindhi, Punjabi, Pashto, English)
 * 3. Confidence Model (High, Medium/Ambiguous with clarification, Low)
 * 4. Multi-step voice command splitter & parser
 */

import { Customer, Product, Supplier, LanguageCode } from '../types';

export interface EntityMatchConfidence<T> {
  match: T | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  ambiguousCandidates?: T[];
  extractedQuantity?: number;
  extractedUnit?: string;
  extractedAmount?: number;
}

// Universal Pakistani quantity units across languages
export const UNIVERSAL_UNITS: Record<string, string[]> = {
  kg: ['kilo', 'kg', 'کیلو', 'کلو', 'ڪلو'],
  gram: ['gram', 'g', 'گرام'],
  packet: ['packet', 'dabba', 'pack', 'پیکٹ', 'ڈبہ', 'پيڪٽ'],
  carton: ['carton', 'peti', 'kartan', 'پیٹی', 'کارٹن', 'پيٽي'],
  dozen: ['darjan', 'dozen', 'درجن'],
  piece: ['piece', 'adad', 'dana', 'عدد', 'پیس', 'دانہ', 'ٽڪرو'],
  meter: ['meter', 'gaz', 'میٹر', 'گز', 'وار'],
  litre: ['litre', 'liter', 'لیٹر', 'ليٽر'],
  katta: ['katta', 'bori', 'tora', 'کٹا', 'بوری', 'توڑا', 'ٻوري'],
  suit: ['suit', 'jora', 'جوڑا', 'سوٹ'],
  plate: ['plate', 'dish', 'پلیٹ', 'ڈش'],
  cup: ['cup', 'pyala', 'کپ', 'پیالی'],
};

/**
 * Standardize text by removing diacritics, extra spaces, and normalizing Arabic/Persian/Urdu character variants
 */
export function normalizeMultilingualString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove arabic tashkeel
    .replace(/ي/g, 'ی')
    .replace(/ى/g, 'ی')
    .replace(/ئ/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ہ')
    .replace(/ھ/g, 'ہ')
    .replace(/[\s\-_]+/g, ' ')
    .trim();
}

/**
 * Robust multilingual Customer Name Matcher with Disambiguation Support
 */
export function resolveCustomerWithConfidence(
  query: string,
  customers: Customer[]
): EntityMatchConfidence<Customer> {
  const normQuery = normalizeMultilingualString(query);
  if (!normQuery || customers.length === 0) {
    return { match: null, confidence: 'LOW' };
  }

  // 1. Exact match
  const exactMatches = customers.filter(
    (c) => normalizeMultilingualString(c.name) === normQuery
  );
  if (exactMatches.length === 1) {
    return { match: exactMatches[0], confidence: 'HIGH' };
  }
  if (exactMatches.length > 1) {
    return { match: null, confidence: 'MEDIUM', ambiguousCandidates: exactMatches };
  }

  // 2. Candidate extracted from query
  // Extract potential name tokens after prepositions or before possessives
  const candidates: Customer[] = [];
  const words = normQuery.split(' ').filter((w) => w.length >= 2);

  for (const c of customers) {
    const custNorm = normalizeMultilingualString(c.name);
    // Substring match
    if (normQuery.includes(custNorm)) {
      candidates.push(c);
      continue;
    }
    // Token overlap
    const custTokens = custNorm.split(' ').filter((t) => t.length >= 2);
    const hasOverlap = custTokens.some((tok) => words.includes(tok));
    if (hasOverlap) {
      candidates.push(c);
    }
  }

  // Remove duplicates
  const uniqueCandidates = Array.from(new Set(candidates));

  if (uniqueCandidates.length === 1) {
    return { match: uniqueCandidates[0], confidence: 'HIGH' };
  } else if (uniqueCandidates.length > 1) {
    // If multiple customers match (e.g., Ali Mobile vs Ali Kiryana), return MEDIUM with candidate list
    return {
      match: null,
      confidence: 'MEDIUM',
      ambiguousCandidates: uniqueCandidates.slice(0, 4),
    };
  }

  return { match: null, confidence: 'LOW' };
}

/**
 * Robust Product Resolver across multi-category vocabularies
 */
export function resolveProductWithConfidence(
  query: string,
  products: Product[]
): EntityMatchConfidence<Product> {
  const normQuery = normalizeMultilingualString(query);
  if (!normQuery || products.length === 0) {
    return { match: null, confidence: 'LOW' };
  }

  // Extract quantity and unit if present
  let extractedQuantity: number | undefined;
  let extractedUnit: string | undefined;

  // Pattern like: "2 kilo sugar", "3 katte aloo", "1 suit", "5 packet"
  const qtyMatch = normQuery.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z\u0600-\u06FF]+)?/);
  if (qtyMatch) {
    const rawQty = parseFloat(qtyMatch[1]);
    if (!isNaN(rawQty) && rawQty > 0) {
      extractedQuantity = rawQty;
      const rawUnit = qtyMatch[2];
      if (rawUnit) {
        for (const [unitKey, variants] of Object.entries(UNIVERSAL_UNITS)) {
          if (variants.some((v) => rawUnit.includes(v))) {
            extractedUnit = unitKey;
            break;
          }
        }
      }
    }
  }

  // 1. Direct name match
  const exact = products.filter(
    (p) => normalizeMultilingualString(p.name) === normQuery
  );
  if (exact.length === 1) {
    return { match: exact[0], confidence: 'HIGH', extractedQuantity, extractedUnit };
  }

  // 2. Multi-category token match
  const matches: Product[] = [];
  for (const p of products) {
    const pNorm = normalizeMultilingualString(p.name);
    if (normQuery.includes(pNorm)) {
      matches.push(p);
      continue;
    }
    const pTokens = pNorm.split(' ').filter((t) => t.length >= 3);
    if (pTokens.some((t) => normQuery.includes(t))) {
      matches.push(p);
    }
  }

  const uniqueMatches = Array.from(new Set(matches));
  if (uniqueMatches.length === 1) {
    return { match: uniqueMatches[0], confidence: 'HIGH', extractedQuantity, extractedUnit };
  } else if (uniqueMatches.length > 1) {
    return {
      match: null,
      confidence: 'MEDIUM',
      ambiguousCandidates: uniqueMatches.slice(0, 4),
      extractedQuantity,
      extractedUnit,
    };
  }

  return { match: null, confidence: 'LOW', extractedQuantity, extractedUnit };
}

/**
 * Multi-Step Voice Command Splitter
 * Example: "Counter kholo, 2 kilo sugar aur 1 kilo rice add karo"
 * Example: "Ali ka khata kholo aur batao kitna udhaar hai"
 * Example: "Last bill dikhao aur customer ka naam batao"
 */
export interface CommandStep {
  originalSegment: string;
  intent: 'NAVIGATE' | 'ADD_TO_CART' | 'GET_BALANCE' | 'SHOW_LAST_BILL' | 'RECORD_TRANSACTION' | 'UNKNOWN';
  target?: string;
  details?: Record<string, any>;
}

export function parseMultiStepCommand(text: string): CommandStep[] {
  const clean = text.trim();
  // Split on delimiters like "aur", "and", "پھر", "۽", "او", commas, full stops
  const segments = clean
    .split(/\s+(?:aur|and|then|پھر|۽|او|تے|اور)\s+|[،,;]+/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (segments.length <= 1) {
    return [
      {
        originalSegment: clean,
        intent: 'UNKNOWN',
      },
    ];
  }

  const steps: CommandStep[] = [];
  for (const seg of segments) {
    const sLower = seg.toLowerCase();
    if (
      sLower.includes('counter') ||
      sLower.includes('pos') ||
      sLower.includes('billing') ||
      sLower.includes('کاؤنٹر')
    ) {
      steps.push({
        originalSegment: seg,
        intent: 'NAVIGATE',
        target: 'billing',
      });
    } else if (
      sLower.includes('khata kholo') ||
      sLower.includes('کھاتہ کھولو') ||
      sLower.includes('کاتو کوليو')
    ) {
      steps.push({
        originalSegment: seg,
        intent: 'NAVIGATE',
        target: 'khata',
      });
    } else if (
      sLower.includes('balance') ||
      sLower.includes('udhaar hai') ||
      sLower.includes('kitna baki') ||
      sLower.includes('بیلنس') ||
      sLower.includes('حساب')
    ) {
      steps.push({
        originalSegment: seg,
        intent: 'GET_BALANCE',
      });
    } else if (
      sLower.includes('last bill') ||
      sLower.includes('pichla bill') ||
      sLower.includes('پچھلا بل')
    ) {
      steps.push({
        originalSegment: seg,
        intent: 'SHOW_LAST_BILL',
      });
    } else if (
      sLower.includes('add') ||
      sLower.includes('شامل') ||
      sLower.includes('ڈالو') ||
      sLower.includes('کلو') ||
      sLower.includes('kilo')
    ) {
      steps.push({
        originalSegment: seg,
        intent: 'ADD_TO_CART',
      });
    } else {
      steps.push({
        originalSegment: seg,
        intent: 'UNKNOWN',
      });
    }
  }

  return steps;
}
