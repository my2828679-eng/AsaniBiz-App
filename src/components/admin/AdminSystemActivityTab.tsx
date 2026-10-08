import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Filter,
  Search,
  User,
  Zap,
  Building
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AdminSystemActivityTab: React.FC = () => {
  const { systemActivities } = useAdmin();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const filtered = systemActivities.filter((act) => {
    if (filterSeverity !== 'all' && act.severity !== filterSeverity) return false;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        (act?.title || '').toLowerCase().includes(q) ||
        (act?.description || '').toLowerCase().includes(q) ||
        (act?.performedBy || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            سسٹم لاگز و سیکیورٹی آڈٹ (System Activity & Audit Logs)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            پلیٹ فارم پر ہونے والی تمام اہم انتظامی، مالی اور سیکیورٹی سرگرمیوں کا ناقابلِ تنسیخ ریکارڈ۔
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">تمام لاگز (All Logs)</option>
            <option value="info">معلومات (Info)</option>
            <option value="success">کامیاب (Success)</option>
            <option value="warning">انتباہ (Warning)</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="space-y-4">
          {filtered.map((act) => {
            return (
              <div
                key={act.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    act.severity === 'success' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    act.severity === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {act.severity === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {act.severity === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {act.severity === 'info' && <Activity className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{act?.title || 'System Activity'}</h3>
                      <span className={`px-2 py-0.2 rounded-md text-[9px] font-black uppercase ${
                        act.severity === 'success' ? 'bg-emerald-100 text-emerald-800' :
                        act.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {act.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {act.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>کارندہ: <strong className="text-slate-600">{act.performedBy}</strong></span>
                      {act.businessName && (
                        <span>دکان: <strong className="text-slate-600">{act.businessName}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-medium shrink-0 self-start sm:self-auto" dir="ltr">
                  {new Date(act.timestamp).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
