import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Receipt,
  Wallet,
  Building2,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Printer
} from 'lucide-react';
import { Invoice } from '../../types';

interface DailyCounterSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  activeOperatorName: string;
  lang: string;
  onCloseShift?: (summary: any) => void;
}

export const DailyCounterSummaryModal: React.FC<DailyCounterSummaryModalProps> = ({
  isOpen,
  onClose,
  invoices,
  activeOperatorName,
  lang,
  onCloseShift,
}) => {
  const [openingCash] = useState<number>(() => {
    const saved = localStorage.getItem('asanibiz_pos_opening_cash');
    return saved ? Number(saved) : 2000;
  });

  const [shiftStartTime] = useState<string>(() => {
    const saved = localStorage.getItem('asanibiz_pos_shift_start');
    return saved || new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  if (!isOpen) return null;

  const isUrdu = lang === 'ur' || lang === 'pa' || lang === 'sd' || lang === 'ps';

  // Filter today's invoices
  const today = new Date().toISOString().slice(0, 10);
  const todayInvoices = invoices.filter((inv) => inv.createdAt.startsWith(today));

  // Calculations
  const totalSales = todayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const cashSales = todayInvoices
    .filter((inv) => inv.paymentMethod === 'cash')
    .reduce((sum, inv) => sum + inv.paidAmount, 0);
  const creditSales = todayInvoices.reduce(
    (sum, inv) => sum + Math.max(0, inv.totalAmount - inv.paidAmount),
    0
  );
  const bankSales = todayInvoices
    .filter((inv) => inv.paymentMethod === 'bank')
    .reduce((sum, inv) => sum + inv.paidAmount, 0);
  const jazzcashSales = todayInvoices
    .filter((inv) => inv.paymentMethod === 'jazzcash')
    .reduce((sum, inv) => sum + inv.paidAmount, 0);
  const easypaisaSales = todayInvoices
    .filter((inv) => inv.paymentMethod === 'easypaisa')
    .reduce((sum, inv) => sum + inv.paidAmount, 0);

  const billCount = todayInvoices.length;
  const avgBill = billCount > 0 ? Math.round(totalSales / billCount) : 0;
  const expectedCashInDrawer = openingCash + cashSales;

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <span>{isUrdu ? 'روزانہ کاؤنٹر و شفٹ سمری (Daily Counter Summary)' : 'Daily POS Counter & Shift Report'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter / Shift Info Bar */}
        <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="text-[11px] text-emerald-800 font-medium">
              {isUrdu ? 'کاؤنٹر آپریٹر / منشی:' : 'Counter Operator:'}
            </div>
            <div className="font-bold text-slate-900">{activeOperatorName}</div>
          </div>
          <div className="text-right space-y-0.5">
            <div className="text-[11px] text-emerald-800 flex items-center gap-1 justify-end font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUrdu ? 'شفٹ شروع:' : 'Shift Started:'}</span>
            </div>
            <div className="font-bold font-mono text-slate-900">{shiftStartTime}</div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Total Sales */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isUrdu ? 'کل فروخت (Total)' : 'Total Sales'}</span>
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              Rs. {totalSales.toLocaleString()}
            </div>
          </div>

          {/* Bill Count */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              <span>{isUrdu ? 'کل پرچیاں / بلز' : 'Total Bills'}</span>
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              {billCount} <span className="text-xs font-normal text-slate-400">({isUrdu ? 'بل' : 'bills'})</span>
            </div>
          </div>

          {/* Average Bill */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-500">
              {isUrdu ? 'اوسط بل قیمت' : 'Average Bill'}
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              Rs. {avgBill.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Payment Breakdown Breakdown */}
        <div className="space-y-2 border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
          <div className="text-xs font-bold text-slate-700 pb-1.5 border-b border-slate-200 flex items-center justify-between">
            <span>{isUrdu ? 'ادائیگی کے ذرائع (Payment Breakdown)' : 'Payment Breakdown'}</span>
            <span className="text-[10px] text-slate-400 font-normal">{today}</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {/* Cash */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isUrdu ? 'نقد فروخت (Cash Sales)' : 'Cash Sales'}</span>
              </span>
              <span className="font-bold text-emerald-800 font-mono">Rs. {cashSales.toLocaleString()}</span>
            </div>

            {/* Udhaar */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3.5 h-3.5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[9px] font-bold">
                  اد
                </span>
                <span>{isUrdu ? 'کھاتہ ادھار (Udhaar Given)' : 'Credit (Udhaar)'}</span>
              </span>
              <span className="font-bold text-red-600 font-mono">Rs. {creditSales.toLocaleString()}</span>
            </div>

            {/* Bank Transfer */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{isUrdu ? 'بینک ٹرانسفر (Bank)' : 'Bank Transfer'}</span>
              </span>
              <span className="font-bold text-blue-700 font-mono">Rs. {bankSales.toLocaleString()}</span>
            </div>

            {/* JazzCash */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                <span>JazzCash</span>
              </span>
              <span className="font-bold text-orange-700 font-mono">Rs. {jazzcashSales.toLocaleString()}</span>
            </div>

            {/* Easypaisa */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <PhoneCall className="w-3.5 h-3.5 text-green-600" />
                <span>Easypaisa</span>
              </span>
              <span className="font-bold text-green-700 font-mono">Rs. {easypaisaSales.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expected Cash In Drawer Reconciliation */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-amber-700" />
              <span>{isUrdu ? 'گلے / کیش دراز میں متوقع نقد:' : 'Expected Cash in Drawer:'}</span>
            </span>
            <span className="text-base font-black text-amber-900 font-mono">
              Rs. {expectedCashInDrawer.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-amber-800 space-y-0.5 border-t border-amber-200/60 pt-1.5">
            <div className="flex justify-between">
              <span>{isUrdu ? 'ابتدائی ریزگاری (Opening Float):' : 'Opening Float:'}</span>
              <span className="font-mono">Rs. {openingCash}</span>
            </div>
            <div className="flex justify-between">
              <span>{isUrdu ? '+ نقد فروخت (Cash Inflow):' : '+ Today Cash Sales:'}</span>
              <span className="font-mono">+ Rs. {cashSales}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrintSummary}
            className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{isUrdu ? 'پرنٹ سمری' : 'Print Report'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onCloseShift) {
                onCloseShift({
                  date: today,
                  totalSales,
                  cashSales,
                  creditSales,
                  billCount,
                  expectedCashInDrawer
                });
              }
              onClose();
            }}
            className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isUrdu ? 'ٹھیک ہے / بند کریں' : 'Close Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
