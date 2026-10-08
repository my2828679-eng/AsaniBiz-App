import React, { useState } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bot,
  TrendingUp,
  Receipt,
  Boxes,
  Users,
  Save,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BusinessAccountStatus, SubscriptionPlanId } from '../../types/admin';
import { BUSINESS_TYPES } from '../../config/businessTypes';

interface BusinessDetailModalProps {
  businessId: string;
  onClose: () => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  businessId,
  onClose
}) => {
  const { 
    allBusinessesWithLive, 
    updateBusinessStatus, 
    updateBusinessNotes 
  } = useAdmin();

  const business = allBusinessesWithLive.find(b => b.id === businessId);

  if (!business) return null;

  const bConfig = BUSINESS_TYPES[business.businessType] || BUSINESS_TYPES.kiryana;

  const [status, setStatus] = useState<BusinessAccountStatus>(business.status);
  const [plan, setPlan] = useState<SubscriptionPlanId>(business.plan);
  const [notes, setNotes] = useState(business.notes || '');
  const [extensionDays, setExtensionDays] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessStatus(business.id, status, plan, extensionDays > 0 ? extensionDays : undefined);
    updateBusinessNotes(business.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleQuickExtend = (days: number) => {
    setExtensionDays(days);
    setStatus('trial');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative text-start animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0a2e2a] text-[#00f2ad] flex items-center justify-center font-black text-lg">
              {business.businessName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {business.businessName}
                </h2>
                {business.isLiveCurrentStore && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    موجودہ لائیو شاپ
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {bConfig.name['ur']} • رجسٹریشن تاریخ: {new Date(business.registrationDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">کل فروخت (Sales)</span>
              <span className="font-black text-slate-900 text-sm mt-0.5 block">
                Rs. {business.totalSales.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">بلز / رسیدات</span>
              <span className="font-black text-slate-900 text-sm mt-0.5 block">
                {business.invoicesCount}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">کھاتہ کسٹمرز</span>
              <span className="font-black text-slate-900 text-sm mt-0.5 block">
                {business.khataCount}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">AI منشی سوالات</span>
              <span className="font-black text-[#0a5e54] text-sm mt-0.5 block">
                {business.aiRequestsCount}
              </span>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-400 font-bold block mb-1">مالک کا نام:</span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{business.ownerName}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1">موبائل نمبر:</span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5" dir="ltr">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{business.phone}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1">شہر و پتہ:</span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{business.city} ({business.address || 'مین مارکیٹ'})</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1">ریوارڈ پوائنٹس:</span>
              <div className="font-bold text-amber-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{business.rewardPoints} پوائنٹس (Rs. {business.rewardPoints} سروس کریڈٹ)</span>
              </div>
            </div>
          </div>

          {/* Administrative Form */}
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0a5e54]" />
              <span>ایڈمنسٹریٹر اختیارات و سبسکرپشن کنٹرول</span>
            </h3>

            {isSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تبدیلیاں کامیابی سے محفوظ ہو گئیں۔</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">اکاؤنٹ اسٹیٹس:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BusinessAccountStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                >
                  <option value="active">فعال (Active / Paid)</option>
                  <option value="trial">فری ٹرائل (Free Trial)</option>
                  <option value="expired">ایکسپائرڈ (Expired)</option>
                  <option value="suspended">معطل شدہ (Suspended)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">پلان (Plan Tier):</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as SubscriptionPlanId)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                >
                  <option value="basic">Basic (Starter - مفت)</option>
                  <option value="pro">Pro (Rs. 700 / ماہانہ)</option>
                  <option value="max">Max (Rs. 1,500 / ماہانہ)</option>
                  <option value="business">Business (Rs. 3,500 / ماہانہ)</option>
                </select>
              </div>
            </div>

            {/* Quick Trial Extension Buttons */}
            <div>
              <label className="block text-slate-600 font-bold mb-1.5">
                ٹرائل میں فوری توسیع (Quick Trial Extension):
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickExtend(7)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    extensionDays === 7 ? 'bg-[#00f2ad] text-[#0a2e2a] border-[#00f2ad]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +7 دن اضافہ
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickExtend(15)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    extensionDays === 15 ? 'bg-[#00f2ad] text-[#0a2e2a] border-[#00f2ad]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +15 دن اضافہ
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickExtend(30)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    extensionDays === 30 ? 'bg-[#00f2ad] text-[#0a2e2a] border-[#00f2ad]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +30 دن (مکمل اضافی مہینہ)
                </button>
              </div>
              {extensionDays > 0 && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  محفوظ کرنے پر ٹرائل تاریخ میں {extensionDays} دن کا اضافہ کر دیا جائے گا۔
                </p>
              )}
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">ایڈمن نوٹس (اندرونی ریکارڈ):</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="صارف کے متعلق اہم انتظامی معلومات..."
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
              >
                بند کریں
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0a5e54] hover:bg-[#07473f] text-white font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>تبدیلیاں محفوظ کریں</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
