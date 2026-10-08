import React, { useState } from 'react';
import {
  X,
  Receipt,
  Banknote,
  BookOpen,
  CreditCard,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Printer,
  Calendar,
  Clock,
  Coins,
} from 'lucide-react';
import { Invoice } from '../../types';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices?: Invoice[];
  language?: string;
  lang?: string;
  onCloseShift?: (summary: any) => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({
  isOpen,
  onClose,
  invoices = [],
  language,
  lang,
  onCloseShift,
}) => {
  const effectiveLang = language || lang || 'ur';
  const [physicalCashInput, setPhysicalCashInput] = useState<string>('');
  const [shiftClosed, setShiftClosed] = useState(false);

  if (!isOpen) return null;

  // Filter invoices for today
  const today = new Date().toISOString().split('T')[0];
  const safeInvoices = Array.isArray(invoices) ? invoices : [];
  const todayInvoices = safeInvoices.filter((i) => i.createdAt && i.createdAt.startsWith(today));

  // Compute metrics
  const totalSales = todayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = todayInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalCredit = todayInvoices.reduce(
    (sum, inv) => sum + Math.max(0, inv.totalAmount - inv.paidAmount),
    0
  );

  const cashInvoices = todayInvoices.filter((i) => i.paymentMethod === 'cash');
  const cashCollected = cashInvoices.reduce((sum, i) => sum + i.paidAmount, 0);

  const bankInvoices = todayInvoices.filter((i) => i.paymentMethod === 'bank');
  const bankCollected = bankInvoices.reduce((sum, i) => sum + i.paidAmount, 0);

  const digitalInvoices = todayInvoices.filter(
    (i) => i.paymentMethod === 'jazzcash' || i.paymentMethod === 'easypaisa'
  );
  const digitalCollected = digitalInvoices.reduce((sum, i) => sum + i.paidAmount, 0);

  const billCount = todayInvoices.length;
  const avgBill = billCount > 0 ? Math.round(totalSales / billCount) : 0;

  // Expected cash in drawer
  const expectedCash = cashCollected;
  const physicalCash = physicalCashInput !== '' ? Number(physicalCashInput) : null;
  const cashDifference = physicalCash !== null ? physicalCash - expectedCash : null;

  const handleCloseShift = () => {
    setShiftClosed(true);
    if (onCloseShift) {
      onCloseShift({
        date: today,
        totalSales,
        cashCollected,
        totalCredit,
        bankCollected,
        digitalCollected,
        billCount,
        expectedCash,
        physicalCash,
        cashDifference,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 border border-slate-200 text-start space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-arabic">
                {effectiveLang === 'en' ? 'Daily Counter Summary & Shift' : 'روزانہ کاؤنٹر سمری و شفٹ رپورٹ'}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleDateString('en-GB')}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Stat Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-[11px] font-bold text-emerald-800 font-arabic">کل سیل (Total)</p>
            <p className="text-base font-black font-mono text-emerald-950">Rs. {totalSales.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-700 font-arabic">{billCount} بل جاری ہوئے</p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-[11px] font-bold text-emerald-800 font-arabic">نقد وصول (Cash)</p>
            <p className="text-base font-black font-mono text-emerald-950">Rs. {cashCollected.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-700 font-arabic">دراز میں متوقع کیش</p>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-[11px] font-bold text-amber-800 font-arabic">ادھار سیل (Udhaar)</p>
            <p className="text-base font-black font-mono text-amber-950">Rs. {totalCredit.toLocaleString()}</p>
            <p className="text-[10px] text-amber-700 font-arabic">کھاتے میں منتقل</p>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-[11px] font-bold text-purple-800 font-arabic">آن لائن / ڈیجیٹل</p>
            <p className="text-base font-black font-mono text-purple-950">
              Rs. {(bankCollected + digitalCollected).toLocaleString()}
            </p>
            <p className="text-[10px] text-purple-700 font-arabic">بینک + Jazz + Easy</p>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
          <h4 className="font-bold text-slate-800 font-arabic flex items-center justify-between">
            <span>ادائیگی ذرائع تفصیل (Payment Mode Breakdown):</span>
            <span className="font-mono text-slate-500">اوسط بل: Rs. {avgBill}</span>
          </h4>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 font-arabic">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Banknote className="w-4 h-4 text-emerald-700" />
                نقد کیش (Cash Sales):
              </span>
              <span className="font-bold font-mono text-slate-900">Rs. {cashCollected.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 font-arabic">
              <span className="flex items-center gap-1.5 text-slate-700">
                <BookOpen className="w-4 h-4 text-amber-600" />
                ادھار کھاتہ (Udhaar Credit):
              </span>
              <span className="font-bold font-mono text-amber-800">Rs. {totalCredit.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 font-arabic">
              <span className="flex items-center gap-1.5 text-slate-700">
                <CreditCard className="w-4 h-4 text-purple-600" />
                JazzCash / Easypaisa:
              </span>
              <span className="font-bold font-mono text-purple-800">Rs. {digitalCollected.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-1 font-arabic">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Layers className="w-4 h-4 text-blue-600" />
                بینک اکاؤنٹ (Bank Transfer):
              </span>
              <span className="font-bold font-mono text-blue-800">Rs. {bankCollected.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Cash Reconciliation (دراز کا کیش ملان) */}
        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-bold text-slate-800 font-arabic">
                دراز کیش ملان (Cash Drawer Reconciliation)
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 font-bold">
              متوقع: Rs. {expectedCash.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 shrink-0 font-arabic">گنا ہوا اصل کیش:</label>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400">Rs.</span>
              <input
                type="number"
                placeholder="دراز کا اصل کیش درج کریں"
                value={physicalCashInput}
                onChange={(e) => setPhysicalCashInput(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {cashDifference !== null && (
            <div
              className={`p-2 rounded-lg text-xs font-arabic flex items-center justify-between ${
                cashDifference === 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : cashDifference > 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              <span className="font-bold">
                {cashDifference === 0
                  ? 'کیش بالکل برابر ہے (100% Match)'
                  : cashDifference > 0
                  ? `اضافی کیش (Surplus): +Rs. ${cashDifference}`
                  : `کیش میں کمی (Shortage): -Rs. ${Math.abs(cashDifference)}`}
              </span>
              <span className="font-mono text-[11px]">
                {cashDifference === 0 ? '✓' : `Rs. ${cashDifference}`}
              </span>
            </div>
          )}
        </div>

        {shiftClosed ? (
          <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs font-bold font-arabic flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            آج کی شفٹ کامیابی سے بند اور محفوظ ہو گئی ہے!
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-arabic"
            >
              <Printer className="w-4 h-4" />
              <span>پرنٹ سمری</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-arabic"
              >
                بند کریں
              </button>
              <button
                type="button"
                onClick={handleCloseShift}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 font-arabic"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>شفٹ مکمل و بند کریں</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
