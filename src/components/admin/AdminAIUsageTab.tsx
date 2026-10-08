import React from 'react';
import {
  Bot,
  Cpu,
  Coins,
  Activity,
  Flame,
  Zap,
  TrendingUp,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BUSINESS_TYPES } from '../../config/businessTypes';

export const AdminAIUsageTab: React.FC = () => {
  const { aiUsage, stats, telemetry } = useAdmin();

  const totalTokens = telemetry?.metrics.geminiTotalTokens.used ?? aiUsage.reduce((acc, u) => acc + u.tokensUsed, 0);
  const totalCostPkr = telemetry?.financialSummary.aiComputeCostPkr ?? aiUsage.reduce((acc, u) => acc + u.estimatedCostPkr, 0);
  const totalRequests = telemetry?.metrics.geminiRequests.used ?? stats.totalAiRequests;

  const queryCategories = [
    { title: 'ادھار لکھنا و کسٹمر ریمائنڈر میسج', percentage: '38%', count: '412 بار', color: 'bg-emerald-500' },
    { title: 'روزانہ کل فروخت اور منافع و نقصان خلاصہ', percentage: '29%', count: '315 بار', color: 'bg-blue-500' },
    { title: 'میڈیسن / کریانہ اسٹاک وارننگ و سپلائر ادھار', percentage: '18%', count: '195 بار', color: 'bg-purple-500' },
    { title: 'وائس بلنگ اور پروڈکٹ قیمت سوالات', percentage: '15%', count: '162 بار', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            AI منشی استعمال و ٹوکن مانیٹرنگ (AI Munshi Usage)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            آسانی بز وائس اور اکاؤنٹنگ ماڈل کی کھپت، ٹوکنز اور دکان وار آڈٹ رپورٹس۔
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#00f2ad]/15 border border-[#00f2ad]/30 text-[#0a5e54] text-xs font-bold flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#0a5e54]" />
          <span>آف لائن و آن لائن ہائبرڈ ماڈل فعال ہے</span>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">کل AI منشی سوالات</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalRequests.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-2">وائس اور چیٹ کے تمام سیشنز</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">کل استعمال شدہ ٹوکنز</span>
          <h3 className="text-2xl font-black text-[#0a5e54] mt-1">{totalTokens.toLocaleString()} ٹوکنز</h3>
          <p className="text-[11px] text-slate-400 mt-2">اردو اور رومن اردو پروسیسنگ</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">تخمینہ لاگت (Compute Cost)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Rs. {totalCostPkr.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-2">بہت کفایتی ماڈل انفراسٹرکچر</p>
        </div>
      </div>

      {/* Query Categories & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Active Businesses */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>سب سے زیادہ AI منشی استعمال کرنے والے اسٹورز</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-3 px-3 text-start">دکان کا نام</th>
                  <th className="py-3 px-3 text-start">کل سوالات</th>
                  <th className="py-3 px-3 text-start">ٹوکنز</th>
                  <th className="py-3 px-3 text-start">تخمینہ لاگت</th>
                  <th className="py-3 px-3 text-start">بنیادی موضوع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {aiUsage.map((u) => (
                  <tr key={u.businessId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {u.businessName}
                    </td>
                    <td className="py-3 px-3 font-black text-[#0a5e54]">
                      {u.totalRequests}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {u.tokensUsed.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      Rs. {u.estimatedCostPkr}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                      {u.topQueryCategory}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Categories Bar Distribution */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0a5e54]" />
            <span>عام پوچھے جانے والے سوالات کی اقسام</span>
          </h2>

          <div className="space-y-4 pt-2">
            {queryCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{cat.title}</span>
                  <span className="font-black text-slate-900">{cat.percentage} ({cat.count})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: cat.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed mt-4">
            💡 AI منشی سسٹم صرف دکاندار کے متعلقہ کاروبار کا کھاتہ، ادھار اور مالی حساب کتاب حل کرتا ہے اور کسی غیر متعلقہ بات چیت پر ٹوکن ضائع نہیں کرتا۔
          </div>
        </div>
      </div>
    </div>
  );
};
