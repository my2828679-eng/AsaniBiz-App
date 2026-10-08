import React, { useState } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Banknote,
  Bot,
  Gift,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Cpu,
  Database,
  HardDrive,
  Cloud,
  Zap,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Activity,
  Mic,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTab } from './AdminSidebar';
import { ResourceMetric, UsageAlertLevel } from '../../types/admin';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenMunshi?: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onOpenMunshi,
}) => {
  const {
    stats,
    businesses,
    systemActivities,
    setSelectedBusinessId,
    telemetry,
    fetchTelemetry,
    isTelemetryLoading,
  } = useAdmin();

  // Alert level filter for alerts table
  const [selectedAlertLevel, setSelectedAlertLevel] = useState<string>('all');
  // Customer quota search
  const [customerSearch, setCustomerSearch] = useState<string>('');

  // Fallback calculations if telemetry is still loading
  const financial = telemetry?.financialSummary || {
    totalCustomers: businesses.length,
    activeCustomers: stats.activeBusinesses,
    trialCustomers: stats.trialUsers,
    expiredCustomers: stats.expiredSubscriptions,
    suspendedCustomers: stats.suspendedAccounts,
    subscriptionRevenuePkr: stats.mrrPkr + 12000,
    aiComputeCostPkr: 79.35,
    voiceProcessingCostPkr: 17.00,
    imageProcessingCostPkr: 24.90,
    infrastructureCostPkr: 850,
    totalOperationalCostPkr: 971.25,
    netRemainingAmountPkr: (stats.mrrPkr + 12000) - 971.25,
    profitMarginPercentage: 92.5,
  };

  const metrics = telemetry?.metrics;
  const customerQuotas = telemetry?.customerQuotas || [];
  const alerts = telemetry?.alerts || [];

  // Filtered alerts
  const filteredAlerts = alerts.filter((a) => {
    if (selectedAlertLevel === 'all') return true;
    return a.level.toString() === selectedAlertLevel;
  });

  // Filtered customer quotas
  const filteredCustomerQuotas = customerQuotas.filter((c) => {
    if (!customerSearch.trim()) return true;
    const q = customerSearch.toLowerCase().trim();
    return (
      c.businessName.toLowerCase().includes(q) ||
      c.ownerName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.plan.toLowerCase().includes(q)
    );
  });

  // Helper component to render a Resource Metric Card with USED / LIMIT / REMAINING / PERCENTAGE
  const renderMetricCard = (m?: ResourceMetric, icon?: React.ElementType, iconBg?: string) => {
    if (!m) return null;
    const Icon = icon || Activity;

    const getProgressColor = (pct: number) => {
      if (pct >= 100) return 'bg-rose-500';
      if (pct >= 90) return 'bg-orange-500';
      if (pct >= 75) return 'bg-amber-500';
      if (pct >= 50) return 'bg-blue-500';
      return 'bg-[#00f2ad]';
    };

    const getBadgeStyle = (pct: number) => {
      if (pct >= 100) return 'bg-rose-100 text-rose-800 border-rose-300';
      if (pct >= 90) return 'bg-orange-100 text-orange-800 border-orange-300';
      if (pct >= 75) return 'bg-amber-100 text-amber-800 border-amber-300';
      if (pct >= 50) return 'bg-blue-100 text-blue-800 border-blue-300';
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    };

    return (
      <div
        key={m.id}
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg || 'bg-slate-100 text-slate-700'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {m.nameUrdu}
                </h4>
                <p className="text-[11px] text-slate-400 leading-tight truncate max-w-[180px] sm:max-w-[220px]">
                  {m.name}
                </p>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${getBadgeStyle(
                m.percentage
              )}`}
            >
              {m.percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden my-3">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getProgressColor(
                m.percentage
              )}`}
              style={{ width: `${Math.min(100, m.percentage)}%` }}
            />
          </div>

          {/* 4 Pillars: USED / LIMIT / REMAINING / PERCENTAGE */}
          <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 bg-slate-50/90 rounded-xl border border-slate-100 text-center">
            <div>
              <span className="block text-[9px] uppercase font-bold text-slate-400">USED</span>
              <span className="text-xs font-black text-slate-900">
                {m.used.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-400 block -mt-0.5">{m.unit}</span>
            </div>

            <div>
              <span className="block text-[9px] uppercase font-bold text-slate-400">LIMIT</span>
              <span className="text-xs font-black text-slate-700">
                {m.limit.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-400 block -mt-0.5">{m.unit}</span>
            </div>

            <div>
              <span className="block text-[9px] uppercase font-bold text-emerald-600">REMAIN</span>
              <span className="text-xs font-black text-emerald-700">
                {m.remaining.toLocaleString()}
              </span>
              <span className="text-[9px] text-emerald-500 block -mt-0.5">{m.unit}</span>
            </div>

            <div>
              <span className="block text-[9px] uppercase font-bold text-slate-400">USAGE %</span>
              <span className="text-xs font-black text-slate-900">
                {m.percentage}%
              </span>
              <span className="text-[9px] text-slate-400 block -mt-0.5">Quota</span>
            </div>
          </div>
        </div>

        {m.details && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="truncate">{m.details}</span>
            <span className="font-medium text-slate-500 uppercase">{m.period}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Executive Banner & Real-time Live Controller */}
      <div className="bg-gradient-to-r from-[#0a2e2a] via-[#0d3b36] to-[#0a463e] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f2ad]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00f2ad]/20 text-[#00f2ad] border border-[#00f2ad]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f2ad] animate-pulse" />
                <span>مرکزی کمانڈ و مانیٹرنگ سینٹر</span>
              </span>
              <span className="text-xs text-white/60">• Vercel + Supabase + Gemini Telemetry</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              ایڈمن انفراسٹرکچر مانیٹرنگ ڈیش بورڈ (Central Admin Monitor)
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-3xl leading-relaxed">
              پاکستان بھر میں ورسِل ہوسٹنگ، سوپابیس ڈیٹا بیس، جیمنائی AI ٹوکنز، وائس پروسیسنگ اور کسٹمر پیکیج کوٹہ کی براہ راست مانیٹرنگ۔
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => fetchTelemetry()}
              disabled={isTelemetryLoading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="ڈیٹا ریفریش کریں"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTelemetryLoading ? 'animate-spin text-[#00f2ad]' : ''}`} />
              <span>{isTelemetryLoading ? 'تازہ ترین ہو رہا ہے...' : 'ریفریش مانیٹر'}</span>
            </button>

            {onOpenMunshi && (
              <button
                type="button"
                onClick={onOpenMunshi}
                className="px-4 py-2.5 rounded-xl bg-[#00f2ad] hover:bg-[#00df9e] text-[#0a2e2a] text-xs font-black shadow-lg shadow-[#00f2ad]/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>ایڈمن منشی سے پوچھیں</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Executive Unit Economics & Financial Pillar (Revenue, Costs, Net Remaining) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#0a5e54]" />
              <span>پلیٹ فارم معاشیات و خالص بچت (Financial & Unit Economics)</span>
            </h2>
            <p className="text-xs text-slate-500">
              ماہانہ سبسکرپشن ریونیو، AI و سرور اخراجات اور خالص منافع کا واضح موازنہ
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 w-fit">
            <CheckCircle2 className="w-4 h-4" />
            <span>خالص منافع مارجن: {financial.profitMarginPercentage}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Total Customers */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span>کل کسٹمرز (Customers)</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {financial.totalCustomers}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
              <span>فعال: <strong className="text-emerald-700">{financial.activeCustomers}</strong></span>
              <span>ٹرائل: <strong className="text-amber-700">{financial.trialCustomers}</strong></span>
              <span>ایکسپائر: <strong className="text-rose-700">{financial.expiredCustomers}</strong></span>
            </div>
          </div>

          {/* Pillar 2: Subscription Revenue */}
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/70">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-1">
              <span>ماہانہ ریونیو (Revenue)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-900">
              Rs. {financial.subscriptionRevenuePkr.toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 pt-2 border-t border-emerald-200/60 flex items-center justify-between">
              <span>پرو، میکس و بزنس پلانز</span>
              <span className="font-bold">+18% ماہانہ شرح</span>
            </div>
          </div>

          {/* Pillar 3: AI + Infrastructure Cost */}
          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/70">
            <div className="flex items-center justify-between text-xs text-amber-800 font-bold mb-1">
              <span>AI و انفراسٹرکچر کل لاگت</span>
              <Cpu className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-900">
              Rs. {financial.totalOperationalCostPkr.toLocaleString()}
            </div>
            <div className="mt-2 text-[10px] text-amber-700/90 pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <span>AI: Rs. {financial.aiComputeCostPkr}</span>
              <span>وائس: Rs. {financial.voiceProcessingCostPkr}</span>
              <span>ہوسٹنگ: Rs. {financial.infrastructureCostPkr}</span>
            </div>
          </div>

          {/* Pillar 4: Net Remaining Amount */}
          <div className="bg-[#00f2ad]/10 rounded-2xl p-4 border border-[#00f2ad]/40 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#0a5e54] font-bold mb-1">
              <span>خالص بچت (Net Remaining)</span>
              <Sparkles className="w-4 h-4 text-[#0a5e54]" />
            </div>
            <div className="text-2xl font-black text-[#0a2e2a]">
              Rs. {financial.netRemainingAmountPkr.toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] text-[#0a5e54] font-bold pt-2 border-t border-[#00f2ad]/30 flex items-center justify-between">
              <span>(ریونیو منہا کل لاگت)</span>
              <span>{financial.profitMarginPercentage}% خالص مارجن</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Threshold Alerts Strip (50%, 75%, 90%, 100%) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>استعمال تھریش ہولڈ الرٹس (50%, 75%, 90%, 100% Alerts)</span>
            </h3>
            <p className="text-xs text-slate-500">
              کسی بھی سروس یا کسٹمر کوٹہ کی حد عبور ہونے پر خودکار الرٹس
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'تمام الرٹس' },
              { id: '100', label: '100% مکمل' },
              { id: '90', label: '90% وارننگ' },
              { id: '75', label: '75% نوٹس' },
              { id: '50', label: '50% نصف' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedAlertLevel(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedAlertLevel === f.id
                    ? 'bg-[#0a5e54] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-black">تمام خدمات محفوظ ہیں:</span> فی الحال کوئی بھی سروس اس تھریش ہولڈ پر نہیں ہے۔ تمام ورسِل، سوپابیس اور جیمنائی کوٹہ مکمل طور پر مستحکم اور قابو میں ہیں۔
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between ${
                  alt.level === 100
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                    : alt.level === 90
                    ? 'bg-orange-50/80 border-orange-200 text-orange-900'
                    : alt.level === 75
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-blue-50/80 border-blue-200 text-blue-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-black mb-1">
                    <span>{alt.titleUrdu}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        alt.level >= 90
                          ? 'bg-rose-600 text-white'
                          : alt.level >= 75
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {alt.percentage}%
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed mt-1">
                    {alt.messageUrdu}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] opacity-75">
                  <span>استعمال: {alt.usedValue} / {alt.limitValue}</span>
                  <span className="uppercase font-mono">{alt.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. VERCEL USAGE & PACKAGE LIMITS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black">
              ▲
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. ورسِل استعمال و پیکیج لمٹس (Vercel Usage & Package Limits)
              </h3>
              <p className="text-xs text-slate-500">
                فاسٹ بینڈوڈتھ، سرور لیس فنکشنز، ایج روٹنگ اور بلڈ منٹس
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            پیکیج: Vercel Pro (100 GB Bandwidth)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderMetricCard(
            metrics?.vercelBandwidth,
            Cloud,
            'bg-slate-900 text-white'
          )}
          {renderMetricCard(
            metrics?.vercelFunctions,
            Zap,
            'bg-blue-600 text-white'
          )}
          {renderMetricCard(
            metrics?.vercelBuildMinutes,
            Clock,
            'bg-purple-600 text-white'
          )}
          {renderMetricCard(
            metrics?.vercelDataTransfer,
            Activity,
            'bg-emerald-600 text-white'
          )}
        </div>
      </div>

      {/* 5. SUPABASE DATABASE & STORAGE LIMITS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3ecf8e] text-[#1c1c1c] flex items-center justify-center font-black">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. سوپابیس ڈیٹا بیس و اسٹوریج لمٹس (Supabase Database & Storage Limits)
              </h3>
              <p className="text-xs text-slate-500">
                ڈیٹا بیس ڈسک سائز، فائل و رسید اسٹوریج، بینڈوڈتھ اخراج اور کنکشن پول
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            پیکیج: Supabase Free/Pro (500 MB DB / 1 GB Storage)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderMetricCard(
            metrics?.supabaseDbSize,
            Database,
            'bg-emerald-600 text-white'
          )}
          {renderMetricCard(
            metrics?.supabaseStorageSize,
            HardDrive,
            'bg-cyan-600 text-white'
          )}
          {renderMetricCard(
            metrics?.supabaseBandwidth,
            TrendingUp,
            'bg-indigo-600 text-white'
          )}
          {renderMetricCard(
            metrics?.supabaseConnections,
            Cpu,
            'bg-teal-600 text-white'
          )}
        </div>
      </div>

      {/* 6. GEMINI AI, TOKENS, VOICE & IMAGE PROCESSING */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00f2ad] text-[#0a2e2a] flex items-center justify-center font-black">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. جیمنائی AI، ٹوکنز، وائس و تصویر پروسیسنگ (Gemini AI & Media Telemetry)
              </h3>
              <p className="text-xs text-slate-500">
                درخواستیں، ان پٹ/آؤٹ پٹ ٹوکنز، کمپیوٹ لاگت، وائس ریکگنیشن اور رسید اسکیننگ
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00f2ad]/20 text-[#0a5e54] border border-[#00f2ad]/30">
            ماڈل: Gemini 2.5 Flash (تیز ترین و کفایتی)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderMetricCard(
            metrics?.geminiRequests,
            Bot,
            'bg-[#0a5e54] text-white'
          )}
          {renderMetricCard(
            metrics?.geminiTotalTokens,
            Zap,
            'bg-indigo-600 text-white'
          )}
          {renderMetricCard(
            metrics?.geminiCostPkr,
            Banknote,
            'bg-amber-600 text-white'
          )}
          {renderMetricCard(
            metrics?.voiceUsageMinutes,
            Mic,
            'bg-emerald-600 text-white'
          )}
          {renderMetricCard(
            metrics?.voiceCostPkr,
            Banknote,
            'bg-teal-600 text-white'
          )}
          {renderMetricCard(
            metrics?.imageProcessingCount,
            ImageIcon,
            'bg-purple-600 text-white'
          )}
        </div>
      </div>

      {/* 7. CUSTOMER-WISE AI USAGE & PACKAGE LIMITS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0a5e54]" />
              <span>4. کسٹمر وار AI استعمال و پیکیج لمٹس (Customer-Wise Package & Usage Limits)</span>
            </h3>
            <p className="text-xs text-slate-500">
              ہر دکان کے پیکیج کے مطابق AI کالز، ٹوکنز، وائس استعمال، لاگت اور الرٹ لیول
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="دکان، مالک یا فون سرچ کریں..."
                className="ps-8 pe-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0a5e54] bg-slate-50"
              />
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('ai_usage')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>تفصیلی AI لاگز</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50/50">
                <th className="py-2.5 px-3 text-start">دکان کا نام و مالک</th>
                <th className="py-2.5 px-3 text-start">پیکیج پلان</th>
                <th className="py-2.5 px-3 text-start">AI سوالات (USED / LIMIT / REMAIN)</th>
                <th className="py-2.5 px-3 text-start">ٹوکنز استعمال</th>
                <th className="py-2.5 px-3 text-start">وائس و امیج</th>
                <th className="py-2.5 px-3 text-start">کل لاگت (PKR)</th>
                <th className="py-2.5 px-3 text-end">اسٹیٹس / الرٹ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomerQuotas.map((cq) => (
                <tr key={cq.businessId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{cq.businessName}</div>
                    <div className="text-[11px] text-slate-500">
                      {cq.ownerName} • {cq.phone}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                      {cq.plan}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-800">
                        {cq.aiRequestsUsed} / {cq.aiRequestsLimit}
                      </div>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          cq.aiRequestsPercentage >= 90
                            ? 'bg-rose-100 text-rose-800'
                            : cq.aiRequestsPercentage >= 75
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cq.aiRequestsPercentage}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      باقی: {cq.aiRequestsRemaining} کالز
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-800">
                      {cq.totalTokens.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ان پٹ: {cq.inputTokens.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-slate-700 font-medium">
                      وائس: {Math.round(cq.voiceSecondsUsed / 60)} منٹ
                    </div>
                    <div className="text-[10px] text-slate-400">
                      تصاویر: {cq.imageOcrCount}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-black text-[#0a5e54]">
                      Rs. {cq.totalCostPkr.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      AI: Rs. {cq.aiCostPkr}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-end">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                        cq.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cq.status === 'active' ? 'فعال (Paid)' : 'ٹرائل (Trial)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Recent Registered Businesses + System Activity Log (Preserved from existing UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Top Registered Businesses */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                حالیہ رجسٹرڈ دکانیں (Registered Shops)
              </h3>
              <p className="text-xs text-slate-500">پلیٹ فارم پر فعال اور آزمائشی اسٹورز</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('businesses')}
              className="text-xs text-[#0a5e54] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>مکمل فہرست</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="pb-2 text-start">دکان کا نام / مالک</th>
                  <th className="pb-2 text-start">شہر</th>
                  <th className="pb-2 text-start">پلان</th>
                  <th className="pb-2 text-start">اسٹیٹس</th>
                  <th className="pb-2 text-end">ایکشن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{b.businessName}</span>
                        {b.isLiveCurrentStore && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                            موجودہ لائیو
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{b.ownerName} • {b.phone}</div>
                    </td>
                    <td className="py-3 text-slate-600 font-medium">{b.city}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {b.plan}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'trial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status === 'active' ? 'فعال (Paid)' : b.status === 'trial' ? 'ٹرائل' : 'ایکسپائر'}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBusinessId(b.id);
                          onNavigateTab('businesses');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#00f2ad]/20 hover:bg-[#00f2ad]/30 text-[#0a5e54] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        تفصیلات
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (5 cols): Live System Activity Stream */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                لائیو ایکٹیویٹی لاگ (System Activities)
              </h3>
              <p className="text-xs text-slate-500">حالیہ سسٹم لاگز، ادائیگیاں اور الرٹس</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('system_activity')}
              className="text-xs text-[#0a5e54] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>تمام لاگز</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {systemActivities.slice(0, 6).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-3 hover:bg-slate-100/80 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    act.severity === 'error'
                      ? 'bg-rose-500'
                      : act.severity === 'warning'
                      ? 'bg-amber-500'
                      : act.severity === 'success'
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 leading-tight truncate">
                    {act.title}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{act.performedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
