import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Phone,
  Eye,
  Edit,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Download,
  Calendar
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BusinessDetailModal } from './BusinessDetailModal';
import { BUSINESS_TYPES } from '../../config/businessTypes';

export const AdminBusinessesTab: React.FC = () => {
  const {
    businesses,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterBusinessType,
    setFilterBusinessType,
    selectedBusinessId,
    setSelectedBusinessId
  } = useAdmin();

  const [sortBy, setSortBy] = useState<'date' | 'sales' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (sortBy === 'sales') {
      return sortOrder === 'desc' ? b.totalSales - a.totalSales : a.totalSales - b.totalSales;
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc' 
        ? b.businessName.localeCompare(a.businessName) 
        : a.businessName.localeCompare(b.businessName);
    }
    // Default by registration date
    return sortOrder === 'desc'
      ? new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
      : new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
  });

  const exportBusinessesCsv = () => {
    const headers = ['Business Name', 'Owner', 'Phone', 'City', 'Type', 'Plan', 'Status', 'Total Sales (PKR)', 'Registered Date'];
    const rows = businesses.map(b => [
      `"${b.businessName}"`,
      `"${b.ownerName}"`,
      `"${b.phone}"`,
      `"${b.city}"`,
      b.businessType,
      b.plan,
      b.status,
      b.totalSales,
      new Date(b.registrationDate).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `asanibiz_businesses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              دکانیں و کاروباری صارفین (Businesses & Users)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              کل رجسٹرڈ دکانیں: <span className="font-bold text-slate-900">{businesses.length}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={exportBusinessesCsv}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>CSV ایکسپورٹ کریں</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="تلاش بذریعہ نام، فون، یا شہر..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-9 text-xs text-slate-900 focus:outline-hidden focus:border-[#00f2ad] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-[#00f2ad]"
            >
              <option value="all">تمام اسٹیٹس (All Statuses)</option>
              <option value="active">فعال (Active / Paid)</option>
              <option value="trial">آزمائشی (Free Trial)</option>
              <option value="expired">ایکسپائرڈ (Expired)</option>
              <option value="suspended">معطل شدہ (Suspended)</option>
            </select>
          </div>

          {/* Business Type Filter */}
          <div>
            <select
              value={filterBusinessType}
              onChange={(e) => setFilterBusinessType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-[#00f2ad]"
            >
              <option value="all">تمام اقسام کاروبار (All Types)</option>
              {Object.entries(BUSINESS_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.name['ur']} ({v.name['en']})</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-[#00f2ad]"
            >
              <option value="date">تاریخ رجسٹریشن</option>
              <option value="sales">فروخت حجم (Sales)</option>
              <option value="name">دکان کا نام</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="ترتیب تبدیل کریں"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3.5 px-4 text-start">دکان کا نام / مالک</th>
                <th className="py-3.5 px-4 text-start">کاروباری صنف</th>
                <th className="py-3.5 px-4 text-start">موبائل و شہر</th>
                <th className="py-3.5 px-4 text-start">پلان</th>
                <th className="py-3.5 px-4 text-start">اسٹیٹس</th>
                <th className="py-3.5 px-4 text-start">کل فروخت (GMV)</th>
                <th className="py-3.5 px-4 text-end">انتظامی اختیارات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    کوئی دکان تلاش کے معیار کے مطابق نہیں ملی۔
                  </td>
                </tr>
              ) : (
                sortedBusinesses.map((b) => {
                  const bType = BUSINESS_TYPES[b.businessType] || BUSINESS_TYPES.kiryana;
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{b.businessName}</span>
                          {b.isLiveCurrentStore && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              لائیو کسٹمر شاپ
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          مالک: {b.ownerName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {bType.name['ur']}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800" dir="ltr">{b.phone}</div>
                        <div className="text-[11px] text-slate-400">{b.city}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          b.plan === 'business' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          b.plan === 'max' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          b.plan === 'pro' ? 'bg-[#00f2ad]/20 text-[#0a5e54] border border-[#00f2ad]/40' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {b.plan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          b.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'trial' ? 'bg-amber-100 text-amber-800' :
                          b.status === 'expired' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {b.status === 'active' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {b.status === 'trial' && <Clock className="w-3 h-3 text-amber-600" />}
                          {b.status === 'expired' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          <span>
                            {b.status === 'active' ? 'فعال (Paid)' :
                             b.status === 'trial' ? 'ٹرائل (Trial)' :
                             b.status === 'expired' ? 'ایکسپائرڈ' : 'معطل'}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900">
                        Rs. {b.totalSales.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-end">
                        <button
                          type="button"
                          onClick={() => setSelectedBusinessId(b.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#0a5e54] hover:bg-[#07473f] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer inline-flex"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>تفصیلات و کنٹرول</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Details Modal */}
      {selectedBusinessId && (
        <BusinessDetailModal
          businessId={selectedBusinessId}
          onClose={() => setSelectedBusinessId(null)}
        />
      )}
    </div>
  );
};
