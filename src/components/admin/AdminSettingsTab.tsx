import React, { useState } from 'react';
import {
  Sliders,
  Save,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Lock,
  Globe,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AdminSettingsTab: React.FC = () => {
  const { adminUser } = useAdmin();

  const [platformName, setPlatformName] = useState('AsaniBiz (آسانی بز)');
  const [tagline, setTagline] = useState('جس کاروبار میں آسانی ہے، اس میں برکت اور سکون وسیع ہے');
  const [defaultTrialDays, setDefaultTrialDays] = useState<number>(30);
  const [supportPhone, setSupportPhone] = useState('0300-8451234');
  const [supportWhatsApp, setSupportWhatsApp] = useState('+92 300 8451234');
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [whatsappAutomation, setWhatsappAutomation] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            ایڈمن کنٹرول سیٹنگز (Admin Control Settings)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            آسانی بز پلیٹ فارم کے مرکزی پیرامیٹرز، سپورٹ کنٹیکٹ اور نوٹیفکیشن رولز۔
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ایڈمن ترتیبات محفوظ ہو گئیں!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Platform Identity */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0a5e54]" />
            <span>پلیٹ فارم شناخت و ترتیبات</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">پلیٹ فارم کا نام:</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">پلیٹ فارم نعرہ (Tagline):</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">نئے رجسٹریشن کے لیے ڈیفالٹ ٹرائل (دن):</label>
              <input
                type="number"
                value={defaultTrialDays}
                onChange={(e) => setDefaultTrialDays(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">سرکاری سپورٹ ہیلپ لائن (Phone):</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#00f2ad] outline-hidden"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Automation Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>واٹس ایپ انٹیگریشن و خودکار یاد دہانی</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">خودکار واٹس ایپ یاد دہانی (Automated WhatsApp Reminders)</span>
                <span className="text-[11px] text-slate-500">سبسکرپشن ختم ہونے سے 3 دن قبل دکاندار کو خودکار پیغام روانہ کریں۔</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAutomation}
                onChange={(e) => setWhatsappAutomation(e.target.checked)}
                className="w-5 h-5 rounded-lg text-[#0a5e54] focus:ring-[#00f2ad] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block text-rose-700">مینٹیننس موڈ (Maintenance Mode)</span>
                <span className="text-[11px] text-slate-500">پلیٹ فارم کو وقتی طور پر بند کر کے صرف ایڈمن رسائی باقی رکھیں۔</span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 rounded-lg text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Admin Account Security Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-3">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>موجودہ ایڈمن سیشن تفصیلات</span>
          </h2>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-blue-900">{adminUser?.name}</div>
              <div className="text-[11px] text-blue-700">{adminUser?.email} • رول: {adminUser?.role}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-200 text-blue-800">
              تصدیق شدہ رسائی
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0a5e54] hover:bg-[#07473f] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ترتیبات محفوظ کریں</span>
          </button>
        </div>
      </form>
    </div>
  );
};
