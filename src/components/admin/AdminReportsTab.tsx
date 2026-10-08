import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BUSINESS_TYPES } from '../../config/businessTypes';

export const AdminReportsTab: React.FC = () => {
  const { stats, businesses } = useAdmin();

  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Business Type Distribution Count
  const typeCounts: Record<string, number> = {};
  businesses.forEach(b => {
    typeCounts[b.businessType] = (typeCounts[b.businessType] || 0) + 1;
  });

  // City Distribution Count
  const cityCounts: Record<string, number> = {};
  businesses.forEach(b => {
    const cityName = b.city.split('(')[0].trim();
    cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
  });

  const exportReport = () => {
    const data = [
      ['Metric', 'Value'],
      ['Total Businesses', stats.totalBusinesses],
      ['Active Paid Subscribers', stats.paidSubscribers],
      ['Free Trial Shops', stats.trialUsers],
      ['Expired Accounts', stats.expiredSubscriptions],
      ['Monthly Recurring Revenue (MRR PKR)', stats.mrrPkr],
      ['Total Platform GMV (PKR)', stats.totalPlatformGmvPkr],
      ['Total AI Munshi Requests', stats.totalAiRequests],
      ['Reward Credits Issued (PKR)', stats.totalRewardCreditsIssuedPkr]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + data.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `asanibiz_admin_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            کاروباری رپورٹس و تجزیہ (Platform Reports & Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ریونیو ٹرینڈز، پیکیج کی تقسیم اور پاکستانی شہروں میں کاروباری نمو کا جائزہ۔
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['today', 'week', 'month', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dateRange === r ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'today' ? 'آج' : r === 'week' ? 'ہفتہ' : r === 'month' ? 'یہ ماہ' : 'تمام'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={exportReport}
            className="px-3.5 py-2 rounded-xl bg-[#0a5e54] hover:bg-[#07473f] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00f2ad]" />
            <span>رپورٹ ڈاؤن لوڈ</span>
          </button>
        </div>
      </div>

      {/* Revenue & Growth Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">ماہانہ ریونیو (MRR)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Rs. {stats.mrrPkr.toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-2">↑ 14.5% گزشتہ ماہ کے مقابلے میں</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">پلیٹ فارم ٹرن اوور (GMV)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Rs. {(stats.totalPlatformGmvPkr / 100000).toFixed(1)} لاکھ</h3>
          <p className="text-[11px] text-slate-400 mt-2">کل بلنگ ریکارڈز کا مجموعہ</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">پیڈ سبسکرائبرز تناسب</span>
          <h3 className="text-2xl font-black text-[#0a5e54] mt-1">
            {stats.totalBusinesses > 0 ? ((stats.paidSubscribers / stats.totalBusinesses) * 100).toFixed(0) : 0}%
          </h3>
          <p className="text-[11px] text-slate-400 mt-2">مفت ٹرائل سے باقاعدہ فیس ادائیگی</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">اوسط دکان فروخت</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            Rs. {stats.totalBusinesses > 0 ? Math.round(stats.totalPlatformGmvPkr / stats.totalBusinesses).toLocaleString() : 0}
          </h3>
          <p className="text-[11px] text-slate-400 mt-2">فی دکان ماہانہ سیلز حجم</p>
        </div>
      </div>

      {/* Two Column Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Type Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0a5e54]" />
            <span>کاروبار کی اقسام کے مطابق دکانوں کی تقسیم</span>
          </h2>

          <div className="space-y-3 pt-2">
            {Object.entries(typeCounts).map(([typeKey, count]) => {
              const bConf = BUSINESS_TYPES[typeKey as any] || BUSINESS_TYPES.kiryana;
              const pct = ((count / businesses.length) * 100).toFixed(0);
              return (
                <div key={typeKey} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">{bConf.name['ur']} ({bConf.name['en']})</span>
                    <span className="font-black text-slate-900">{count} دکانیں ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-[#0a5e54] rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City & Regional Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>علاقائی اور شہری تقسیم (Regional Distribution)</span>
          </h2>

          <div className="space-y-3 pt-2">
            {Object.entries(cityCounts).map(([city, count]) => {
              const pct = ((count / businesses.length) * 100).toFixed(0);
              return (
                <div key={city} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">{city}</span>
                    <span className="font-black text-slate-900">{count} دکانیں ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
