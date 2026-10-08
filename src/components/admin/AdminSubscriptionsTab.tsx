import React, { useState } from 'react';
import {
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  Plus
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BusinessAccountStatus, SubscriptionPlanId } from '../../types/admin';

export const AdminSubscriptionsTab: React.FC = () => {
  const { 
    businesses, 
    updateBusinessStatus, 
    recordManualPayment,
    setSelectedBusinessId 
  } = useAdmin();

  const [filterSubStatus, setFilterSubStatus] = useState<string>('all');
  const [activeRenewId, setActiveRenewId] = useState<string | null>(null);

  // Manual payment state inside renewal modal
  const [payAmount, setPayAmount] = useState<number>(700);
  const [payMethod, setPayMethod] = useState<'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cash'>('jazzcash');
  const [payRef, setPayRef] = useState<string>('');

  const filtered = businesses.filter(b => {
    if (filterSubStatus === 'all') return true;
    return b.status === filterSubStatus;
  });

  const getTrialDaysRemaining = (endDateStr: string) => {
    const diff = new Date(endDateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleQuickExtendTrial = (bId: string, days: number) => {
    updateBusinessStatus(bId, 'trial', undefined, days);
  };

  const handleRecordRenewal = (b: typeof businesses[0]) => {
    recordManualPayment({
      businessId: b.id,
      businessName: b.businessName,
      amountPkr: payAmount,
      planId: b.plan,
      billingCycle: 'monthly',
      paymentMethod: payMethod,
      transactionRef: payRef.trim() || `MANUAL-${Date.now().toString().slice(-6)}`,
      status: 'verified',
      date: new Date().toISOString(),
      notes: 'ایڈمن پینل سے دستی سبسکرپشن تجدید'
    });
    setActiveRenewId(null);
    setPayRef('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            سبسکرپشن و ٹرائل مینجمنٹ (Subscription Management)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            دکانوں کے ٹرائلز، ماہانہ ایکٹو سبسکرپشنز، اور ایکسپائرڈ اکاؤنٹس کی خودکار و دستی تجدید۔
          </p>
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'تمام' },
            { id: 'trial', label: 'فری ٹرائلز' },
            { id: 'active', label: 'فعال پیڈ' },
            { id: 'expired', label: 'ایکسپائرڈ' },
            { id: 'suspended', label: 'معطل' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setFilterSubStatus(pill.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterSubStatus === pill.id
                  ? 'bg-[#0a5e54] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => {
          const trialDays = getTrialDaysRemaining(b.trialEndDate);
          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{b.businessName}</h3>
                    <p className="text-[11px] text-slate-500">{b.ownerName} • {b.city}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    b.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'trial' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {b.status}
                  </span>
                </div>

                {/* Plan and Dates Info */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">موجودہ پلان:</span>
                    <span className="font-bold text-slate-900 uppercase">{b.plan}</span>
                  </div>

                  {b.status === 'trial' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">باقی ماندہ ٹرائل:</span>
                      <span className={`font-black ${trialDays < 7 ? 'text-rose-600' : 'text-amber-700'}`}>
                        {trialDays} دن باقی
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">تجدید تاریخ:</span>
                      <span className="font-bold text-slate-800">
                        {new Date(b.renewalDate || b.trialEndDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">خودکار تجدید:</span>
                    <span className={`font-bold ${b.autoRenew ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {b.autoRenew ? 'آن (Active)' : 'آف'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {b.status === 'trial' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold">توسیع:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickExtendTrial(b.id, 7)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      +7 دن
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickExtendTrial(b.id, 15)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      +15 دن
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickExtendTrial(b.id, 30)}
                      className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold cursor-pointer"
                    >
                      +30 دن
                    </button>
                  </div>
                ) : null}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRenewId(b.id);
                      setPayAmount(b.plan === 'business' ? 3500 : b.plan === 'max' ? 1500 : 700);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-[#00f2ad]/20 hover:bg-[#00f2ad]/30 text-[#0a5e54] text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    تجدید فیس ریکارڈ کریں
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBusinessId(b.id)}
                    className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    تفصیل
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Payment / Renewal Modal */}
      {activeRenewId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in text-start">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0a5e54]" />
                <span>سبسکرپشن فیس وصولی ریکارڈ کریں</span>
              </h3>
              <button
                onClick={() => setActiveRenewId(null)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">وصول شدہ رقم (PKR):</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">طریقہ ادائیگی:</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                >
                  <option value="jazzcash">جاز کیش (JazzCash)</option>
                  <option value="easypaisa">ایزی پیسہ (EasyPaisa)</option>
                  <option value="bank_transfer">براہ راست بینک ٹرانسفر (Bank)</option>
                  <option value="cash">نقدی وصولی (Cash in hand)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ٹرانزیکشن ریفرنس / TID (اختیاری):</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="مثال: TID-998822 یا بینک ٹرانزیکشن نمبر"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveRenewId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
              >
                منسوخ
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = businesses.find(item => item.id === activeRenewId);
                  if (b) handleRecordRenewal(b);
                }}
                className="px-5 py-2 rounded-xl bg-[#0a5e54] hover:bg-[#07473f] text-white font-bold shadow-md cursor-pointer"
              >
                ادائیگی کی توثیق کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
