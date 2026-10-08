/**
 * AsaniBiz Manual WhatsApp Sharing Utility
 * 
 * NOTE: 
 * - Strictly MANUAL sharing using standard wa.me / api.whatsapp.com links.
 * - No WhatsApp Business API or automated backend bots used.
 * - User always selects the customer/recipient in WhatsApp and manually taps SEND.
 */

export interface BillInvoiceItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unit?: string;
}

export interface BillInvoiceData {
  invoiceNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  items: BillInvoiceItem[];
  subtotal: number;
  discount?: number;
  tax?: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: string;
  notes?: string;
}

export interface ParchiData {
  vendorOrCustomer?: string;
  phone?: string;
  date?: string;
  invoiceNumber?: string;
  items?: Array<{ name: string; quantity?: number; unit?: string; total?: number; unitPrice?: number }>;
  totalAmount?: number;
  notes?: string;
}

export interface KhataPartyData {
  name: string;
  phone?: string;
  currentBalance?: number;
}

export interface KhataTxItem {
  date: string;
  type: string;
  amount: number;
  notes?: string;
  newBalance?: number;
}

/**
 * Normalizes phone numbers (especially Pakistani numbers 03xx-xxxxxxx)
 * into WhatsApp standard international format without '+' (e.g. 923001234567).
 */
export const normalizeWhatsAppPhone = (phone?: string): string => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (!cleaned) return '';

  if (cleaned.startsWith('0092')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length >= 10 && cleaned.length <= 11) {
    // 03001234567 -> 923001234567
    cleaned = '92' + cleaned.substring(1);
  } else if (cleaned.length === 10 && cleaned.startsWith('3')) {
    // 3001234567 -> 923001234567
    cleaned = '92' + cleaned;
  }
  return cleaned;
};

/**
 * Returns the manual WhatsApp share URL.
 * If phone is provided and valid, opens direct chat with that number.
 * If phone is empty, opens WhatsApp contact/chat selector.
 */
export const getManualWhatsAppUrl = (text: string, phone?: string): string => {
  const normPhone = normalizeWhatsAppPhone(phone);
  const encoded = encodeURIComponent(text);
  if (normPhone) {
    return `https://wa.me/${normPhone}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
};

/**
 * Triggers manual WhatsApp open in a new window/tab.
 */
export const openManualWhatsApp = (text: string, phone?: string): void => {
  const url = getManualWhatsAppUrl(text, phone);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Formats a Bill / Invoice / Receipt for manual WhatsApp sharing.
 */
export const formatBillWhatsAppText = (
  inv: BillInvoiceData,
  businessProfile: { businessName?: string; phone?: string; address?: string; ownerName?: string }
): string => {
  const bName = businessProfile.businessName || 'آسانی بز ڈیجیٹل دکان';
  const balanceDue = (inv.totalAmount || 0) - (inv.paidAmount || 0);

  const itemsList = (inv.items || [])
    .map(
      (it) =>
        `• ${it.productName}: ${it.quantity} ${it.unit || ''} × Rs. ${it.unitPrice} = Rs. ${it.total}`
    )
    .join('\n');

  return `🧾 *${bName}*
*بل رسید / Invoice: ${inv.invoiceNumber}*
📅 تاریخ: ${new Date(inv.createdAt).toLocaleDateString('en-GB')}
👤 گاہک: ${inv.customerName} ${inv.customerPhone ? `(${inv.customerPhone})` : ''}
━━━━━━━━━━━━━━━━━━
📋 *تفصیل اشیاء (Items):*
${itemsList || 'تفصیلات بل میں محفوظ ہیں'}
━━━━━━━━━━━━━━━━━━
💰 سب ٹوٹل (Subtotal): Rs. ${(inv.subtotal || 0).toLocaleString()}
${inv.discount && inv.discount > 0 ? `🏷️ رعایت (Discount): - Rs. ${inv.discount.toLocaleString()}\n` : ''}${inv.tax && inv.tax > 0 ? `🏛️ ٹیکس: + Rs. ${inv.tax.toLocaleString()}\n` : ''}💵 *کل رقم (Total): Rs. ${(inv.totalAmount || 0).toLocaleString()}*
✅ ادا شدہ رقم (Paid): Rs. ${(inv.paidAmount || 0).toLocaleString()} (${(inv.paymentMethod || 'cash').toUpperCase()})
${balanceDue > 0 ? `⚠️ *بقایا ادھار (Balance Due): Rs. ${balanceDue.toLocaleString()}*\n` : ''}━━━━━━━━━━━━━━━━━━
شکریہ! دوبارہ تشریف لائیے گا۔
${businessProfile.phone ? `📞 رابطہ: ${businessProfile.phone}` : ''}
${businessProfile.address ? `📍 پتہ: ${businessProfile.address}` : ''}
_بشکریہ: آسانی بز (AsaniBiz) ڈیجیٹل رسید_`;
};

/**
 * Formats a Scanned Parchi / Bill for manual WhatsApp sharing.
 */
export const formatParchiWhatsAppText = (
  parchi: ParchiData,
  businessProfile: { businessName?: string; phone?: string }
): string => {
  const bName = businessProfile.businessName || 'آسانی بز دکان';
  const itemsText = (parchi.items || [])
    .map(
      (it) =>
        `• ${it.name}: ${it.quantity || 1} ${it.unit || ''} × Rs. ${it.unitPrice || it.total || 0} = Rs. ${it.total || 0}`
    )
    .join('\n');

  return `📄 *پرچی و بل خلاصہ (Parchi Summary) — ${bName}*
پارٹی / نام: ${parchi.vendorOrCustomer || 'دکان پرچی'}
تاریخ: ${parchi.date || new Date().toLocaleDateString('en-GB')}
${parchi.invoiceNumber ? `بل نمبر: ${parchi.invoiceNumber}\n` : ''}━━━━━━━━━━━━━━━━━━
📋 *درج شدہ اشیاء:*
${itemsText || 'کوئی اشیاء واضح نہیں'}
━━━━━━━━━━━━━━━━━━
💵 *کل رقم: Rs. ${(parchi.totalAmount || 0).toLocaleString()}*
${parchi.notes ? `نوٹ: ${parchi.notes}\n` : ''}━━━━━━━━━━━━━━━━━━
_بشکریہ: آسانی بز (AsaniBiz) AI پرچی اسکینر_`;
};

/**
 * Formats a Khata Summary / Statement for manual WhatsApp sharing.
 */
export const formatKhataSummaryWhatsAppText = (
  party: KhataPartyData,
  transactions: KhataTxItem[],
  businessProfile: { businessName?: string; phone?: string; ownerName?: string }
): string => {
  const bName = businessProfile.businessName || 'آسانی بز دکان';
  const balance = party.currentBalance || 0;

  const recentTxs = (transactions || []).slice(0, 5).map((tx) => {
    const isCredit = tx.type === 'credit_given' || tx.type === 'purchase_credit';
    return `• ${new Date(tx.date).toLocaleDateString('en-GB')} | ${isCredit ? 'ادھار (+)' : 'وصولی (-)'} Rs. ${tx.amount.toLocaleString()}${tx.notes ? ` (${tx.notes})` : ''}`;
  });

  return `📖 *کھاتہ خلاصہ و اسٹیٹمنٹ (Khata Statement) — ${bName}*
محترم ${party.name} صاحب،
تاریخ: ${new Date().toLocaleDateString('en-GB')}
━━━━━━━━━━━━━━━━━━
💰 *موجودہ بقایا بیلنس (Balance): Rs. ${balance.toLocaleString()}*
${
  balance > 0
    ? '⚠️ حیثیت: ادھار واجب الادا (Pending Due)'
    : balance < 0
    ? '✅ حیثیت: ایڈوانس رقم جمع ہے (Advance Credit)'
    : '✅ حیثیت: حساب بے باق ہے (Clear Balance)'
}
━━━━━━━━━━━━━━━━━━
📋 *حالیہ لین دین (Recent Transactions):*
${recentTxs.length > 0 ? recentTxs.join('\n') : 'کوئی حالیہ اندراج نہیں'}
━━━━━━━━━━━━━━━━━━
برائے مہربانی اپنا کھاتہ ملاحظہ فرما لیں۔ شکریہ!
${businessProfile.phone ? `📞 رابطہ: ${businessProfile.phone}` : ''}
${businessProfile.ownerName ? `دکاندار: ${businessProfile.ownerName}` : ''}
_بشکریہ: آسانی بز (AsaniBiz) ڈیجیٹل کھاتہ_`;
};

/**
 * Formats a Khata Due Reminder for manual WhatsApp sharing.
 */
export const formatKhataReminderWhatsAppText = (
  party: KhataPartyData,
  businessProfile: { businessName?: string; phone?: string; ownerName?: string }
): string => {
  const bName = businessProfile.businessName || 'آسانی بز دکان';
  return `السلام علیکم ${party.name} صاحب،\n\nیہ ${bName} کی طرف سے کھاتہ یاد دہانی ہے۔ آپ کا کل بقایا ادھار Rs. ${(party.currentBalance || 0).toLocaleString()} ہے۔\n\nبرائے مہربانی جلد از جلد ادائیگی فرما دیں۔ شکریہ!\n\n${businessProfile.ownerName || 'دکاندار'}\n${businessProfile.phone || ''}\n\n_بشکریہ: آسانی بز (AsaniBiz)_`;
};
