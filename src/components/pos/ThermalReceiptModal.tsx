import React from 'react';
import { X, CheckCircle2, Printer, Share2, PlusCircle } from 'lucide-react';
import { Invoice, BusinessProfile } from '../../types';
import { formatBillWhatsAppText, getManualWhatsAppUrl } from '../../services/whatsappShare';

interface ThermalReceiptModalProps {
  invoice: Invoice | null;
  profile: BusinessProfile;
  onClose: () => void;
  onNewSale: () => void;
  language: string;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  invoice,
  profile,
  onClose,
  onNewSale,
  language,
}) => {
  if (!invoice) return null;

  const baqaya = Math.max(0, invoice.totalAmount - invoice.paidAmount);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const formatted = formatBillWhatsAppText(
      {
        invoiceNumber: invoice.invoiceNumber,
        createdAt: invoice.createdAt,
        customerName: invoice.customerName,
        customerPhone: invoice.customerPhone,
        items: invoice.items.map((it) => ({
          productName: it.productName,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          total: it.total,
          unit: it.unit,
        })),
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        tax: invoice.tax,
        totalAmount: invoice.totalAmount,
        paidAmount: invoice.paidAmount,
        paymentMethod: invoice.paymentMethod,
        notes: invoice.notes,
      },
      profile
    );

    const url = getManualWhatsAppUrl(formatted, invoice.customerPhone);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 space-y-4 border border-slate-200 text-start max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-arabic">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'en' ? 'VIP Bill Receipt' : 'کامیاب سیل و تھرمل رسید'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Slip */}
        <div
          id="thermal-receipt-printable-area"
          className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 font-mono text-xs space-y-2.5 shadow-inner"
        >
          {/* Shop Header */}
          <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-2">
            <div className="font-black text-sm text-slate-900">{profile.businessName}</div>
            {profile.address && <div className="text-[10px] text-slate-500">{profile.address}</div>}
            <div className="text-[10px] text-slate-500 font-mono">{profile.phone}</div>
          </div>

          {/* Invoice Meta */}
          <div className="text-[11px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Bill #:</span>
              <span className="font-bold text-slate-900">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date/Time:</span>
              <span>{new Date(invoice.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-900">{invoice.customerName}</span>
            </div>
            {invoice.customerPhone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span>{invoice.customerPhone}</span>
              </div>
            )}
            {invoice.notes && (
              <div className="text-[10px] text-slate-600 italic pt-0.5">
                Note: {invoice.notes}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="space-y-1 border-b border-dashed border-slate-300 pb-2 text-[11px]">
            <div className="flex justify-between font-bold text-slate-700 pb-0.5 border-b border-slate-200 text-[10px]">
              <span>آئٹم تفصیل (Item)</span>
              <span>مقدار x ریٹ = رقم</span>
            </div>
            {invoice.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-baseline gap-1 py-0.5">
                <div className="truncate max-w-[155px] font-sans font-medium text-slate-800">
                  {it.productName}
                </div>
                <div className="shrink-0 text-slate-700">
                  {it.quantity} {it.unit || ''} x {it.unitPrice} = <span className="font-bold text-slate-900">Rs. {it.total}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Calculation Summary */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal (سب ٹوٹل):</span>
              <span>Rs. {invoice.subtotal}</span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount (رعایت):</span>
                <span>- Rs. {invoice.discount}</span>
              </div>
            )}

            {invoice.tax > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax (ٹیکس):</span>
                <span>+ Rs. {invoice.tax}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300 text-slate-900">
              <span>Grand Total (کل بل):</span>
              <span className="text-emerald-800">Rs. {invoice.totalAmount}</span>
            </div>

            <div className="flex justify-between text-slate-700">
              <span>Paid ({invoice.paymentMethod}):</span>
              <span>Rs. {invoice.paidAmount}</span>
            </div>

            {baqaya > 0 && (
              <div className="flex justify-between font-bold text-rose-600 pt-0.5 border-t border-dashed border-rose-200">
                <span>Baqaya Udhaar (بقایا ادھار):</span>
                <span>Rs. {baqaya}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-300 font-arabic">
            شکریہ! تشریف لانے کا شکریہ۔ برکت ہو!
          </div>
        </div>

        {/* Action Buttons: Print / WhatsApp / New Sale */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs font-arabic"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>پرنٹ رسید (Print)</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs font-arabic"
            >
              <Share2 className="w-4 h-4" />
              <span>واٹس ایپ رسید</span>
            </button>
          </div>

          {/* Next Sale */}
          <button
            type="button"
            onClick={onNewSale}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-arabic"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>اگلی سیل شروع کریں (Next Sale)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
