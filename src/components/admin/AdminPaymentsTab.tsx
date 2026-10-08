import React, { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Building,
  Smartphone
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PaymentRecord } from '../../types/admin';

export const AdminPaymentsTab: React.FC = () => {
  const { payments, recordManualPayment, businesses } = useAdmin();

  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [selectedBizId, setSelectedBizId] = useState<string>(businesses?.[0]?.id || '');
  const [amount, setAmount] = useState<number>(700);
  const [method, setMethod] = useState<'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cash'>('jazzcash');
  const [tid, setTid] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const filtered = (payments || []).filter(p => {
    if (filterMethod !== 'all' && p.paymentMethod !== filterMethod) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const totalCollectedPkr = (payments || [])
    .filter(p => p.status === 'verified')
    .reduce((acc, p) => acc + p.amountPkr, 0);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBiz = (businesses || []).find(b => b.id === selectedBizId);
    if (!targetBiz) return;

    recordManualPayment({
      businessId: targetBiz.id,
      businessName: targetBiz.businessName,
      amountPkr: amount,
      planId: targetBiz.plan,
      billingCycle: 'monthly',
      paymentMethod: method,
      transactionRef: tid.trim() || `TID-${Date.now().toString().slice(-6)}`,
      status: 'verified',
      date: new Date().toISOString(),
      notes: notes.trim() || 'دستی ادائیگی تصدیق شدہ'
    });

    setIsAddModalOpen(false);
    setTid('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            ادائیگیاں و ٹرانزیکشنز (Payments & Transactions)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            کل موصول شدہ فیس: <span className="font-black text-[#0a5e54]">Rs. {totalCollectedPkr.toLocaleString()}</span> (جاز کیش، ایزی پیسہ و بینک)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0a5e54] hover:bg-[#07473f] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#00f2ad]" />
          <span>نئی ادائیگی ریکارڈ کریں</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-hidden"
        >
          <option value="all">تمام ذرائع ادائیگی (All Methods)</option>
          <option value="jazzcash">جاز کیش (JazzCash)</option>
          <option value="easypaisa">ایزی پیسہ (EasyPaisa)</option>
          <option value="bank_transfer">بینک ٹرانسفر (Bank)</option>
          <option value="cash">نقدی (Cash)</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-hidden"
        >
          <option value="all">تمام اسٹیٹس (All Statuses)</option>
          <option value="verified">تصدیق شدہ (Verified)</option>
          <option value="pending">زیر التواء (Pending)</option>
          <option value="failed">ناکام (Failed)</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3.5 px-4 text-start">دکان کا نام</th>
                <th className="py-3.5 px-4 text-start">رقم (PKR)</th>
                <th className="py-3.5 px-4 text-start">طریقہ کار</th>
                <th className="py-3.5 px-4 text-start">ٹرانزیکشن ID / ریفرنس</th>
                <th className="py-3.5 px-4 text-start">تاریخ</th>
                <th className="py-3.5 px-4 text-start">اسٹیٹس</th>
                <th className="py-3.5 px-4 text-start">نوٹس</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{pay.businessName}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{pay.planId} پلان</div>
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    Rs. {pay.amountPkr.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 uppercase flex items-center gap-1 w-fit">
                      {pay.paymentMethod === 'jazzcash' && <Smartphone className="w-3 h-3 text-red-600" />}
                      {pay.paymentMethod === 'easypaisa' && <Smartphone className="w-3 h-3 text-emerald-600" />}
                      {pay.paymentMethod === 'bank_transfer' && <Building className="w-3 h-3 text-blue-600" />}
                      <span>{pay.paymentMethod}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600" dir="ltr">
                    {pay.transactionRef}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(pay.date).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      pay.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      pay.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {pay.status === 'verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {pay.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                      {pay.status === 'failed' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      <span>{pay.status === 'verified' ? 'تصدیق شدہ' : pay.status === 'pending' ? 'زیر التواء' : 'ناکام'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                    {pay.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Manual Payment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in text-start">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#0a5e54]" />
                <span>نئی سبسکرپشن ادائیگی شامل کریں</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">دکان منتخب کریں:</label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.businessName} ({b.ownerName} - {b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم (PKR):</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">طریقہ کار:</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                >
                  <option value="jazzcash">جاز کیش (JazzCash)</option>
                  <option value="easypaisa">ایزی پیسہ (EasyPaisa)</option>
                  <option value="bank_transfer">بینک ٹرانسفر (Bank Transfer)</option>
                  <option value="cash">نقدی (Cash)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ٹرانزیکشن ID / رسید نمبر:</label>
                <input
                  type="text"
                  value={tid}
                  onChange={(e) => setTid(e.target.value)}
                  placeholder="مثال: JC-99221144"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نوٹس (اختیاری):</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="کوئی اضافی تفصیل..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0a5e54] hover:bg-[#07473f] text-white font-bold shadow-md cursor-pointer"
                >
                  ادائیگی محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
