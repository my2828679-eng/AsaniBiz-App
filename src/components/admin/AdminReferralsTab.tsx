import React from 'react';
import {
  Gift,
  Award,
  Users,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AdminReferralsTab: React.FC = () => {
  const { referrals, stats } = useAdmin();

  const totalReferredSum = referrals.reduce((acc, r) => acc + r.totalReferred, 0);
  const totalConvertedSum = referrals.reduce((acc, r) => acc + r.convertedPaid, 0);
  const conversionRate = totalReferredSum > 0 ? ((totalConvertedSum / totalReferredSum) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            ریوارڈ و ریفرل مانیٹرنگ (Referrals & Reward Credits)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            دکانداروں کے ریفرل لنکس، شمولیت اور سروس کریڈٹس (بل و سبسکرپشن ڈسکاؤنٹ) کی جامع نگرانی۔
          </p>
        </div>

        {/* Highlight Note */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>ریوارڈ کریڈٹس صرف آسانی بز سروس بلنگ میں چھوٹ کے لیے قابلِ استعمال ہیں۔</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">کل ریفر کردہ دکانیں</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalReferredSum} دکانیں</h3>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">دیگر دکانداروں کی دعوت پر آمد</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">کامیاب پیڈ کنورژن</span>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">{totalConvertedSum} دکانیں ({conversionRate}%)</h3>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">جنہوں نے باقاعدہ فیس ادا کی</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">کل جاری شدہ کریڈٹس</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Rs. {stats.totalRewardCreditsIssuedPkr.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">سبسکرپشن چھوٹ کی مد میں</p>
        </div>
      </div>

      {/* Top Referrers Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>ٹاپ ریفرر دکاندار (Top Merchant Referrers Leaderboard)</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3.5 px-4 text-start">دکاندار / دکان</th>
                <th className="py-3.5 px-4 text-start">ریفرل کوڈ</th>
                <th className="py-3.5 px-4 text-start">کل مدعو کردہ</th>
                <th className="py-3.5 px-4 text-start">پیڈ سبسکرائبرز</th>
                <th className="py-3.5 px-4 text-start">سروس کریڈٹس (Earned)</th>
                <th className="py-3.5 px-4 text-start">استعمال شدہ کریڈٹس</th>
                <th className="py-3.5 px-4 text-end">آخری ریفرل تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{ref.referrerBusinessName}</div>
                    <div className="text-[11px] text-slate-500">{ref.referrerOwner}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-slate-100 border border-slate-200 font-bold text-slate-700" dir="ltr">
                      {ref.referralCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {ref.totalReferred}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {ref.convertedPaid}
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-900">
                    Rs. {ref.rewardCreditsPkr.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    Rs. {ref.creditsUsedPkr.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-end text-slate-500">
                    {new Date(ref.lastReferralDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
