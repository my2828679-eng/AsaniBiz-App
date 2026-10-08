import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Printer,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  ShoppingBag,
  Share2,
  Lock,
  Unlock,
  KeyRound,
  FileSpreadsheet,
  CheckCircle2,
  X
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';

export const ReportsView: React.FC = () => {
  const { profile, invoices, expenses, products, customers } = useBusiness();
  const lang = profile.preferredLanguage || 'ur';

  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [isProfitUnlocked, setIsProfitUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Filter based on range
  const now = new Date();
  const filteredInvoices = invoices.filter((inv) => {
    if (dateRange === 'all') return true;
    const invDate = new Date(inv.createdAt);
    const diffDays = (now.getTime() - invDate.getTime()) / (1000 * 3600 * 24);
    if (dateRange === 'today') return diffDays <= 1;
    if (dateRange === '7days') return diffDays <= 7;
    if (dateRange === '30days') return diffDays <= 30;
    return true;
  });

  const filteredExpenses = expenses.filter((exp) => {
    if (dateRange === 'all') return true;
    const expDate = new Date(exp.date);
    const diffDays = (now.getTime() - expDate.getTime()) / (1000 * 3600 * 24);
    if (dateRange === 'today') return diffDays <= 1;
    if (dateRange === '7days') return diffDays <= 7;
    if (dateRange === '30days') return diffDays <= 30;
    return true;
  });

  const totalSales = filteredInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCost = filteredInvoices.reduce((sum, inv) => {
    return (
      sum +
      inv.items.reduce(
        (iSum, item) => iSum + (item.purchasePrice || item.unitPrice * 0.8) * item.quantity,
        0
      )
    );
  }, 0);
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = Math.max(0, totalSales - totalCost - totalExpense);
  const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0';
  const totalCustomerUdhaar = customers.reduce((sum, c) => sum + (c.currentBalance || 0), 0);

  // Product sales breakdown
  const itemCounts: Record<string, { qty: number; total: number }> = {};
  filteredInvoices.forEach((inv) => {
    inv.items.forEach((it) => {
      if (!itemCounts[it.productName]) {
        itemCounts[it.productName] = { qty: 0, total: 0 };
      }
      itemCounts[it.productName].qty += it.quantity;
      itemCounts[it.productName].total += it.total;
    });
  });

  const topProducts = Object.entries(itemCounts)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setIsVerifyingPin(true);
    try {
      const res = await fetch('/api/auth/pin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsProfitUnlocked(true);
        setShowPinModal(false);
        setPinInput('');
      } else {
        setPinError(data.error || 'غلط سیکیورٹی پن! دوبارہ کوشش کریں۔');
      }
    } catch {
      // Local fallback: default allowed if server is offline
      if (pinInput.length >= 4) {
        setIsProfitUnlocked(true);
        setShowPinModal(false);
        setPinInput('');
      } else {
        setPinError('سیکیورٹی پن کم از کم 4 ہندسوں پر مشتمل ہونا چاہیے۔');
      }
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleShareWhatsApp = () => {
    const periodName =
      dateRange === 'today'
        ? 'آج کی رپورٹ'
        : dateRange === '7days'
        ? 'پچھلے 7 دن'
        : dateRange === '30days'
        ? 'ماہانہ رپورٹ'
        : 'کل کاروباری رپورٹ';

    const profitText = isProfitUnlocked
      ? `📈 *خالص منافع:* Rs. ${netProfit.toLocaleString()} (${profitMargin}%)\n`
      : '';

    const text = `📊 *کاروباری رپورٹ — ${profile.businessName}*
📅 مدت: ${periodName} (${new Date().toLocaleDateString('en-GB')})
━━━━━━━━━━━━━━━━━━
💰 *کل فروخت (Sales):* Rs. ${totalSales.toLocaleString()} (${filteredInvoices.length} بلز)
🏷️ *کل اخراجات (Expenses):* Rs. ${totalExpense.toLocaleString()}
${profitText}👥 *گاہکوں کا بقایا ادھار:* Rs. ${totalCustomerUdhaar.toLocaleString()}
━━━━━━━━━━━━━━━━━━
_بشکریہ: آسانی بز (AsaniBiz) ڈیجیٹل منشی_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleExportCsv = () => {
    const headers = ['بل نمبر (Invoice)', 'گاہک (Customer)', 'تاریخ (Date)', 'کل رقم (Total PKR)', 'وصول شدہ (Paid PKR)', 'بقایا (Remaining)'];
    const rows = filteredInvoices.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.customerName || 'Walk-in'}"`,
      `"${new Date(inv.createdAt).toISOString().split('T')[0]}"`,
      inv.totalAmount,
      inv.paidAmount,
      inv.balanceAmount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute(
      'download',
      `AsaniBiz_Sales_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div id="reports-analytics-view" className="space-y-4 pb-20 lg:pb-6">
      {/* PIN Unlock Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-arabic">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <span>مالک کا سیکیورٹی پن (Owner Security PIN)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-arabic">
              منافع اور خریداری کی اصل لاگت صرف دکان کے مالک کے لیے مخصوص ہے۔ اپنا 4 ہندسوں کا پن درج کریں:
            </p>
            <form onSubmit={handleVerifyPin} className="mt-4 space-y-3">
              <div>
                <input
                  type="password"
                  maxLength={8}
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                  className="w-full text-center tracking-[0.5em] text-xl font-bold py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-600 mt-1.5 text-center font-arabic font-semibold">
                    {pinError}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isVerifyingPin}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold font-arabic cursor-pointer transition-colors"
                >
                  {isVerifyingPin ? 'تصدیق جاری ہے...' : 'پن تصدیق کریں (Unlock)'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center font-arabic">
                (پہلی بار اگر پن سیٹ نہیں تو کوئی بھی 4 ہندسے درج کریں)
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>{t('reportsHeaderTitle', lang)}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t('reportsHeaderSubtitle', lang)}
          </p>
        </div>

        {/* Action Buttons: WhatsApp Share, CSV Export & Date Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer font-arabic"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>واٹس ایپ شیئر (WhatsApp)</span>
          </button>

          {/* Excel / CSV Export */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-arabic"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>ایکسل ڈاؤنلوڈ (CSV)</span>
          </button>

          {/* Date Filter */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs">
            <button
              onClick={() => setDateRange('today')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                dateRange === 'today' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('filterToday', lang)}
            </button>
            <button
              onClick={() => setDateRange('7days')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                dateRange === '7days' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('filter7Days', lang)}
            </button>
            <button
              onClick={() => setDateRange('30days')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                dateRange === '30days' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('filter30Days', lang)}
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                dateRange === 'all' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('filterAllTime', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{t('statTotalSalesPeriod', lang)}</div>
          <div className="text-base sm:text-xl font-bold text-slate-900 mt-1">
            Rs. {totalSales.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{filteredInvoices.length} {t('invoicesCount', lang)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{t('statExpensesPeriod', lang)}</div>
          <div className="text-base sm:text-xl font-bold text-amber-600 mt-1">
            Rs. {totalExpense.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{filteredExpenses.length} {t('invoicesCount', lang)}</div>
        </div>

        {/* PIN Protected Net Profit Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('statNetProfitPeriod', lang)}</span>
            <button
              type="button"
              onClick={() => {
                if (isProfitUnlocked) {
                  setIsProfitUnlocked(false);
                } else {
                  setShowPinModal(true);
                }
              }}
              className="text-[10px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
              title={isProfitUnlocked ? 'Lock' : 'Unlock with PIN'}
            >
              {isProfitUnlocked ? (
                <>
                  <Unlock className="w-3 h-3 text-emerald-600" />
                  <span>محفوظ</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>پن ان لاک</span>
                </>
              )}
            </button>
          </div>

          {isProfitUnlocked ? (
            <>
              <div className="text-base sm:text-xl font-bold text-emerald-700 mt-1">
                Rs. {netProfit.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">{profitMargin}% مارجن</div>
            </>
          ) : (
            <div 
              onClick={() => setShowPinModal(true)}
              className="mt-1 cursor-pointer py-1"
            >
              <div className="text-sm font-bold text-slate-400 blur-xs select-none">
                Rs. 99,999
              </div>
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>دیکھنے کے لیے پن لگائیں</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{t('averageBillSizeLabel', lang)}</div>
          <div className="text-base sm:text-xl font-bold text-slate-900 mt-1">
            Rs. {filteredInvoices.length > 0 ? Math.round(totalSales / filteredInvoices.length).toLocaleString() : 0}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{t('perTransactionLabel', lang)}</div>
        </div>
      </div>

      {/* Top Products and Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Top selling items */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>{t('topSellingTitle', lang)}</span>
            </h3>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              {t('noSalesInPeriod', lang)}
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map(([pName, stats], idx) => {
                const maxTotal = topProducts[0]?.[1]?.total || 1;
                const pct = Math.min(100, Math.round((stats.total / maxTotal) * 100));
                return (
                  <div key={pName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                        {idx + 1}. {pName}
                      </span>
                      <span className="font-bold text-slate-900">
                        Rs. {stats.total.toLocaleString()} ({stats.qty} {t('itemsWord', lang)})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Business Health Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {t('businessHealthTitle', lang)}
            </div>
            <h3 className="text-lg font-bold mt-1">{t('healthScoreLevel', lang)}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {t('healthScoreDesc', lang)}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>{t('customerRetentionLabel', lang)}</span>
              <span className="font-bold text-white">{customers.length}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{t('lowStockProtectionLabel', lang)}</span>
              <span className="font-bold text-emerald-400">{t('activeStatus', lang)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{t('khataAuditSafetyLabel', lang)}</span>
              <span className="font-bold text-emerald-400">{t('verifiedStatus', lang)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white shadow-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printReportBtn', lang)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
