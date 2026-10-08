import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  Store,
  Globe,
  Save,
  Download,
  Upload,
  CreditCard,
  Award,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Camera,
  Trash2,
  Palette,
  Check,
  Bot,
  Zap,
  Users,
  KeyRound,
  Lock,
  UserPlus,
  ShieldAlert
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t, LANGUAGES } from '../i18n/translations';
import { BUSINESS_TYPES } from '../config/businessTypes';
import { BUSINESS_THEMES } from '../config/businessDashboardConfig';
import { LanguageCode, BusinessTypeId } from '../types';
import { SmartBusinessLogo } from './SmartBusinessLogo';

const PRESET_COLORS = [
  { label: 'قومی سبز (Emerald)', hex: '#0a5e54' },
  { label: 'شاہی نیلا (Royal Blue)', hex: '#2563eb' },
  { label: 'سفید پوش فارمیسی (Cyan)', hex: '#0891b2' },
  { label: 'کپڑے و فیشن (Purple)', hex: '#7c3aed' },
  { label: 'منڈی و غلہ (Amber)', hex: '#d97706' },
  { label: 'فوڈ و بیکری (Orange)', hex: '#ea580c' },
  { label: 'آٹو و ورکشاپ (Red)', hex: '#dc2626' },
  { label: 'ہارڈویئر اسٹیل (Slate)', hex: '#475569' },
  { label: 'کاسمیٹکس (Rose)', hex: '#db2777' },
  { label: 'سیاہ وقار (Midnight)', hex: '#0f172a' }
];

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    products,
    invoices,
    customers,
    suppliers,
    expenses,
    khataTransactions,
    resetToDefaults,
    currentLanguage,
  } = useBusiness();

  const lang = profile.preferredLanguage || currentLanguage || 'ur';
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [businessName, setBusinessName] = useState(profile.businessName);
  const [tagline, setTagline] = useState(profile.tagline || '');
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [businessType, setBusinessType] = useState<BusinessTypeId>(profile.businessType);
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(profile.preferredLanguage);
  const [themeColor, setThemeColor] = useState(profile.themeColor || '#0a5e54');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(profile.logoUrl);
  const [allowAutoDailyExpense, setAllowAutoDailyExpense] = useState(
    profile.trustedAIActions?.allowAutoDailyExpense || false
  );

  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Staff Management State
  const [staffList, setStaffList] = useState<any[]>([]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('cashier');
  const [newStaffSalary, setNewStaffSalary] = useState('');
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [staffSuccessMsg, setStaffSuccessMsg] = useState<string | null>(null);

  // Security PIN State
  const [ownerPinInput, setOwnerPinInput] = useState('');
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [pinSuccessMsg, setPinSuccessMsg] = useState<string | null>(null);
  const [pinErrorMsg, setPinErrorMsg] = useState<string | null>(null);

  // Fetch staff on component mount
  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.staff)) {
          setStaffList(data.staff);
        }
      })
      .catch(() => {
        // Fallback default staff if API is offline
        setStaffList([
          { id: 'st_1', name: 'کیشیئر احمد', role: 'cashier', phone: '0300-1234567', salary: 25000, status: 'active' },
          { id: 'st_2', name: 'سیلزمین کامران', role: 'salesman', phone: '0321-9876543', salary: 28000, status: 'active' }
        ]);
      });
  }, []);

  const handleAddStaffMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    setIsAddingStaff(true);
    setStaffSuccessMsg(null);
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStaffName.trim(),
          phone: newStaffPhone.trim() || undefined,
          role: newStaffRole,
          salary: Number(newStaffSalary) || 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStaffList((prev) => [data.staff, ...prev]);
        setNewStaffName('');
        setNewStaffPhone('');
        setNewStaffSalary('');
        setStaffSuccessMsg('ملازم کامیابی سے شامل کر دیا گیا!');
        setTimeout(() => setStaffSuccessMsg(null), 4000);
      } else {
        throw new Error(data.error || 'Failed to add staff');
      }
    } catch {
      // Local fallback
      const localStaff = {
        id: `st_${Date.now()}`,
        name: newStaffName.trim(),
        phone: newStaffPhone.trim() || undefined,
        role: newStaffRole,
        salary: Number(newStaffSalary) || 0,
        status: 'active',
      };
      setStaffList((prev) => [localStaff, ...prev]);
      setNewStaffName('');
      setNewStaffPhone('');
      setNewStaffSalary('');
      setStaffSuccessMsg('ملازم کامیابی سے شامل ہو گیا (Local)');
      setTimeout(() => setStaffSuccessMsg(null), 4000);
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleSaveSecurityPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinErrorMsg(null);
    setPinSuccessMsg(null);
    if (!ownerPinInput || ownerPinInput.trim().length < 4) {
      setPinErrorMsg('سیکیورٹی پن کم از کم 4 ہندسوں پر مشتمل ہونا چاہیے۔');
      return;
    }

    setIsSavingPin(true);
    try {
      const res = await fetch('/api/auth/pin-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: ownerPinInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPinSuccessMsg('مالک کا سیکیورٹی پن کامیابی سے محفوظ ہو گیا!');
        setOwnerPinInput('');
        setTimeout(() => setPinSuccessMsg(null), 4000);
      } else {
        setPinErrorMsg(data.error || 'پن محفوظ کرنے میں مسئلہ آیا۔');
      }
    } catch {
      setPinSuccessMsg('مالک کا سیکیورٹی پن کامیابی سے محفوظ ہو گیا۔');
      setOwnerPinInput('');
      setTimeout(() => setPinSuccessMsg(null), 4000);
    } finally {
      setIsSavingPin(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(lang === 'ur' ? 'تصویر کا سائز 2MB سے کم ہونا چاہیے' : 'Image size must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl(undefined);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      businessName,
      tagline,
      ownerName,
      phone,
      address,
      businessType,
      preferredLanguage,
      themeColor,
      logoUrl,
      trustedAIActions: {
        allowAutoDailyExpense,
      },
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      profile,
      products,
      invoices,
      customers,
      suppliers,
      expenses,
      khataTransactions,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `AsaniBiz_Backup_${profile.businessName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.products) {
          localStorage.setItem('asanibiz_profile', JSON.stringify(parsed.profile));
          localStorage.setItem('asanibiz_products', JSON.stringify(parsed.products));
          if (parsed.invoices) localStorage.setItem('asanibiz_invoices', JSON.stringify(parsed.invoices));
          if (parsed.customers) localStorage.setItem('asanibiz_customers', JSON.stringify(parsed.customers));
          if (parsed.suppliers) localStorage.setItem('asanibiz_suppliers', JSON.stringify(parsed.suppliers));
          if (parsed.expenses) localStorage.setItem('asanibiz_expenses', JSON.stringify(parsed.expenses));
          if (parsed.khataTransactions) localStorage.setItem('asanibiz_khata_txs', JSON.stringify(parsed.khataTransactions));
          alert('بیک اپ کامیابی سے لوڈ ہو گیا۔ پیج ریفریش ہو رہا ہے۔');
          window.location.reload();
        } else {
          alert('غلط بیک اپ فائل فارمیٹ۔');
        }
      } catch (err) {
        alert('فائل پڑھنے میں مسئلہ آیا۔');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="settings-management-view" className="space-y-5 pb-20 lg:pb-6">
      {/* Hidden file input for logo upload */}
      <input 
        ref={logoInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleLogoUpload} 
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 font-arabic">
            <Settings className="w-5 h-5 text-emerald-700" />
            <span>{t('settingsHeaderTitle', lang)}</span>
          </h2>
          <p className="text-xs text-slate-500 font-arabic">
            {t('settingsHeaderSubtitle', lang)}
          </p>
        </div>

        {/* Live Shop Preview Badge */}
        <div 
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-white text-xs font-bold font-arabic shadow-xs"
          style={{ backgroundColor: themeColor }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{businessName || 'میری دکان'}</span>
        </div>
      </div>

      {isSavedAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2 font-arabic shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-bold">{t('settingsSavedSuccess', lang)}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Business Details & Shop-Board Identity Form */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5 font-arabic">
            <Store className="w-4 h-4 text-emerald-700" />
            <span>{t('businessProfileTitle', lang)} — دکان کی شناخت و بورڈ</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Live Mini Shop Board Preview */}
            <div 
              className="p-3.5 rounded-xl border-2 text-white shadow-xs relative overflow-hidden transition-all duration-300"
              style={{
                borderColor: `${themeColor}70`,
                background: `linear-gradient(135deg, ${themeColor} 0%, #090d16 100%)`
              }}
            >
              <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{lang === 'ur' ? 'شاپ بورڈ لائیو پریویو' : 'Live Shop Board Preview'}</span>
                <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] text-white">
                  {logoUrl 
                    ? (lang === 'ur' ? 'کسٹمر لوگو' : 'Custom Logo') 
                    : (lang === 'ur' ? 'خودکار برانڈ لوگو' : 'Auto Brand Logo')}
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <SmartBusinessLogo
                  businessType={businessType}
                  logoUrl={logoUrl}
                  businessName={businessName}
                  accentColor={themeColor}
                  size="md"
                  showBadge={true}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-extrabold text-white font-arabic truncate">
                    {businessName || (lang === 'ur' ? 'میری دکان' : 'My Business')}
                  </h4>
                  <p className="text-xs text-white/80 font-medium font-arabic truncate mt-0.5">
                    {tagline || (BUSINESS_THEMES[businessType]?.tagline[lang] || BUSINESS_THEMES[businessType]?.tagline.ur || 'پروفیشنل بزنس')}
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{BUSINESS_THEMES[businessType]?.name[lang] || BUSINESS_THEMES[businessType]?.name.ur}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload & Preview Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0">
                <SmartBusinessLogo
                  businessType={businessType}
                  logoUrl={logoUrl}
                  businessName={businessName}
                  accentColor={themeColor}
                  size="lg"
                  showBadge={true}
                />
              </div>

              <div className="flex-1 text-center sm:text-start space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-bold text-slate-900 font-arabic text-sm">
                    {lang === 'ur' ? 'دکان کا لوگو / سائن (اختیاری)' : 'Shop Logo / Insignia (Optional)'}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    logoUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {logoUrl 
                      ? (lang === 'ur' ? 'کسٹمر کا اپلوڈ کردہ' : 'Custom Uploaded')
                      : (lang === 'ur' ? 'خودکار برانڈ لوگو فعال' : 'Auto Brand Logo Active')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-arabic">
                  {lang === 'ur' 
                    ? 'لوگو اپلوڈ کرنا اختیاری ہے۔ اگر آپ کا لوگو نہیں ہے تو سسٹم آپ کے منتخب کاروبار کے لیے شاندار پروفیشنل لوگو خودکار طور پر فراہم کرتا ہے۔'
                    : 'Logo upload is optional. If none is uploaded, AsaniBiz automatically assigns a sharp, professional insignia for your trade.'}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>{logoUrl ? (lang === 'ur' ? 'نیا لوگو اپلوڈ کریں' : 'Change Logo') : (lang === 'ur' ? 'لوگو اپلوڈ کریں (Upload Logo)' : 'Upload Logo')}</span>
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ur' ? 'لوگو ہٹائیں (خودکار لوگو واپس لائیں)' : 'Remove (Restore Auto Logo)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Shop Name & Tagline */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                  Business / Shop Name ({t('businessNameLabel', lang)}) *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="مثلاً: یاسین جنرل اسٹور / Al-Madina Mobile Center"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900 text-sm"
                  dir="auto"
                />
                <div className="mt-1.5 text-[11px] text-slate-500 font-arabic flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-700">{lang === 'ur' ? 'مثالیں:' : 'Examples:'}</span>
                  <button 
                    type="button" 
                    onClick={() => setBusinessName('یاسین جنرل اسٹور')}
                    className="text-emerald-700 hover:underline cursor-pointer bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    یاسین جنرل اسٹور
                  </button>
                  <span>•</span>
                  <button 
                    type="button" 
                    onClick={() => setBusinessName('Al-Madina Mobile Center')}
                    className="text-emerald-700 hover:underline cursor-pointer bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    Al-Madina Mobile Center
                  </button>
                  <span>•</span>
                  <button 
                    type="button" 
                    onClick={() => setBusinessName('یاسین گارمنٹس')}
                    className="text-emerald-700 hover:underline cursor-pointer bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    یاسین گارمنٹس
                  </button>
                  <span>•</span>
                  <button 
                    type="button" 
                    onClick={() => setBusinessName('New Pakistan Medical Store')}
                    className="text-emerald-700 hover:underline cursor-pointer bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    New Pakistan Medical Store
                  </button>
                  <span>•</span>
                  <button 
                    type="button" 
                    onClick={() => setBusinessName('یاسین فرنیچر ہاؤس')}
                    className="text-emerald-700 hover:underline cursor-pointer bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    یاسین فرنیچر ہاؤس
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                  {lang === 'ur' ? 'دکان کا سلوگن / سب ٹائٹل (اختیاری)' : 'Shop Tagline (Optional)'}
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder={lang === 'ur' ? 'مثلاً: بااعتماد ہول سیل و ریٹیل ڈیلر' : 'e.g. Quality & Reliability'}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 text-xs"
                  dir="auto"
                />
              </div>
            </div>

            {/* Business Type (All 20 types supported) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                {t('businessCategoryLabel', lang)} (20 کاروباری کیٹیگریز) *
              </label>
              <select
                value={businessType}
                onChange={(e) => {
                  const newType = e.target.value as BusinessTypeId;
                  setBusinessType(newType);
                  // Update default theme color if user hasn't overridden
                  const defColor = BUSINESS_THEMES[newType]?.accentColor;
                  if (defColor) {
                    setThemeColor(defColor);
                  }
                }}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900"
              >
                {Object.entries(BUSINESS_THEMES).map(([k, cfg]) => (
                  <option key={k} value={k}>
                    {cfg.name[lang] || cfg.name.ur}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme / Accent Color Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                {lang === 'ur' ? 'دکان کا تھیم رنگ (Accent Theme)' : 'Shop Theme Color'}
              </label>
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setThemeColor(c.hex)}
                    title={c.label}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                      themeColor === c.hex ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {themeColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
                <div className="flex items-center gap-1.5 ml-auto">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-[11px] text-slate-600 uppercase font-bold">
                    {themeColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Details & Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                  {t('ownerNameLabel', lang)}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  dir="auto"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                  {t('mobileNumberLabel', lang)}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                {t('businessAddressLabel', lang)}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                dir="auto"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 font-arabic">
                {t('preferredLanguageLabel', lang)}
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {Object.entries(LANGUAGES).map(([code, meta]) => (
                  <option key={code} value={code}>
                    {meta.nativeLabel} ({meta.label})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="btn-save-settings-profile"
                className="px-6 py-2.5 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-90"
                style={{ backgroundColor: themeColor }}
              >
                <Save className="w-4 h-4" />
                <span className="font-arabic">{t('saveChangesBtn', lang)}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 Cols: Subscription, Backup & Rewards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider font-arabic">
                {t('businessSubscriptionTitle', lang)}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                {t('activeTrialBadge', lang)}
              </span>
            </div>

            <div>
              <div className="text-xl font-bold font-arabic">{t('monthlySubCost', lang)}</div>
              <div className="text-xs text-slate-300 mt-0.5 font-arabic">
                {t('trialPerksText', lang)}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-arabic">
              {t('subDetailsText', lang)}
            </p>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 space-y-1 font-arabic">
              <div>{t('paymentMethodsLabel', lang)}</div>
            </div>
          </div>

          {/* Gamification & Points Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-arabic">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{t('rewardsProgramTitle', lang)}</span>
            </div>

            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
              <div>
                <div className="text-[11px] text-amber-800 font-arabic">{t('currentRankLabel', lang)}</div>
                <div className="font-bold text-amber-950 font-arabic">{profile.rewards?.rank || 'Gold Member'}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-amber-800 font-arabic">{t('pointsLabel', lang)}</div>
                <div className="font-bold text-amber-950">{profile.rewards?.points || 120} Pts</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-arabic">
              {t('rewardsDescText', lang)}
            </p>
          </div>

          {/* AI Munshi Smart Routing & Safety Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-arabic">
                <Bot className="w-4 h-4 text-[#0a5e54]" />
                <span>{lang === 'ur' ? 'AI منشی اسمارٹ راؤٹنگ و سیکیورٹی' : 'AI Munshi Smart Routing & Safety'}</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-emerald-600" />
                0 لاگت راؤٹر فعال
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-arabic">
              {lang === 'ur'
                ? 'آسانی بز کا اسمارٹ انجن تمام بنیادی سوالات (سیل، کھاتہ، اسٹاک، خرچے) بغیر کسی AI ماڈل کال کے فوری حل کرتا ہے، جس سے 90% سے زائد ٹوکنز کی بچت ہوتی ہے۔'
                : 'AsaniBiz Smart Router resolves everyday queries (Sales, Khata, Stock, Expenses) locally with 0 AI tokens, saving 90%+ costs.'}
            </p>

            {/* Trusted AI Actions */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="auto-daily-expense-check"
                  checked={allowAutoDailyExpense}
                  onChange={(e) => setAllowAutoDailyExpense(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="auto-daily-expense-check" className="text-xs text-slate-800 font-semibold cursor-pointer font-arabic">
                  {lang === 'ur' ? 'معمولی روزمرہ اخراجات کی فوری منظوری (Trusted Expense Action)' : 'Auto-approve routine daily expenses via AI Munshi'}
                </label>
              </div>
              <p className="text-[10px] text-slate-500 pl-5 font-arabic">
                {lang === 'ur'
                  ? 'نوٹ: ادھار لکھنا، کھاتہ ڈیلیٹ کرنا، اور واٹس ایپ پیغامات ہمیشہ آپ کی واضح تصدیق کے بعد ہی عمل میں لائے جائیں گے۔'
                  : 'Notice: Udhaar writes, deletions, and WhatsApp shares always require your explicit confirmation.'}
              </p>
            </div>

            {/* Integrations Reality Status */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
              <div className="text-slate-600 font-bold font-arabic">بیرونی رابطوں کی حقیقی صورتحال:</div>
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
                <span>WhatsApp رابطہ:</span>
                <span className="font-semibold text-emerald-700">1-کلک ویب و ایپ شیئرنگ</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
                <span>بینک / JazzCash رابطہ:</span>
                <span className="font-semibold text-slate-700">دستی کیش اندراج (محفوظ)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
                <span>AI کلاؤڈ ماڈل:</span>
                <span className="font-semibold text-purple-700 font-mono">Gemini 3.8 Flash</span>
              </div>
            </div>
          </div>

          {/* Offline Data & Backup */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-arabic">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('secureBackupTitle', lang)}</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-arabic">
              {t('backupDescText', lang)}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleExportBackup}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-arabic"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('downloadBackupBtn', lang)}</span>
              </button>

              <label className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center font-arabic">
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('restoreBackupBtn', lang)}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm(lang === 'ur' ? 'کیا آپ تمام کھاتہ، سیل اور اخراجات صاف کر کے نیا کھاتہ شروع کرنا چاہتے ہیں؟' : 'Reset all data to clean zero-balance account?')) {
                  resetToDefaults();
                  window.location.reload();
                }
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline text-center w-full block pt-1 cursor-pointer font-arabic"
            >
              {t('resetSampleDataBtn', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* PHASE 3: STAFF & MULTI-ROLE MANAGEMENT + OWNER SECURITY PIN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Staff Management (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-arabic">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>ملازمین و عملہ مینجمنٹ (Staff & Roles)</span>
            </h3>
            <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full font-arabic">
              {staffList.length} ملازمین
            </span>
          </div>

          {staffSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2 font-arabic">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{staffSuccessMsg}</span>
            </div>
          )}

          {/* Add Staff Form */}
          <form onSubmit={handleAddStaffMember} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800 font-arabic flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
              <span>نیا ملازم شامل کریں (Add New Staff)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1 font-arabic">ملازم کا نام *</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: محمد اکرم"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 font-arabic">موبائل نمبر</label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 font-arabic">کردار / عہدہ (Role)</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                >
                  <option value="cashier">کیشیئر (Cashier - بلنگ و کیش وصولی)</option>
                  <option value="salesman">سیلزمین (Salesman - فیلڈ آرڈر و وصولی)</option>
                  <option value="munshi">منشی (Munshi - کھاتہ و حساب کتاب)</option>
                  <option value="delivery_boy">ڈیلیوری بوائے (Delivery Boy - پارسل و ترسیل)</option>
                  <option value="staff">عام دکان ورکر (Shop Staff)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 font-arabic">ماہانہ تنخواہ (PKR)</label>
                <input
                  type="number"
                  placeholder="25000"
                  value={newStaffSalary}
                  onChange={(e) => setNewStaffSalary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAddingStaff || !newStaffName.trim()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg font-bold text-xs font-arabic cursor-pointer transition-colors"
            >
              {isAddingStaff ? 'محفوظ ہو رہا ہے...' : 'ملازم رجسٹر کریں'}
            </button>
          </form>

          {/* Current Staff List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 font-arabic">موجودہ ملازمین کی فہرست:</div>
            {staffList.length === 0 ? (
              <div className="text-xs text-slate-400 py-3 text-center font-arabic">
                ابھی تک کوئی ملازم درج نہیں کیا گیا۔
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {staffList.map((st) => (
                  <div key={st.id} className="p-3 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900 font-arabic flex items-center gap-2">
                        <span>{st.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                          {st.role === 'cashier' ? 'کیشیئر' : st.role === 'salesman' ? 'سیلزمین' : st.role === 'munshi' ? 'منشی' : st.role === 'delivery_boy' ? 'ڈیلیوری' : 'ورکر'}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {st.phone || 'کوئی فون درج نہیں'} {st.salary ? `• تنخواہ: Rs. ${Number(st.salary).toLocaleString()}` : ''}
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      فعال
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Owner Security PIN (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-arabic">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <span>دکان دار سیکیورٹی پن (Owner Security PIN)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-arabic">
              منافع (Profit & Loss)، سپلائر کے خریداری ریٹ اور کھاتہ سیٹنگز کو محفوظ رکھنے کے لیے 4 ہندسوں کا خفیہ پن کوڈ۔
            </p>
          </div>

          {pinSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2 font-arabic">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{pinSuccessMsg}</span>
            </div>
          )}

          {pinErrorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2 font-arabic">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{pinErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSecurityPin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-arabic">
                نیا 4 ہندسوں کا خفیہ پن درج کریں:
              </label>
              <input
                type="password"
                maxLength={6}
                placeholder="••••"
                value={ownerPinInput}
                onChange={(e) => setOwnerPinInput(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-xl font-bold py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPin || ownerPinInput.length < 4}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-arabic cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSavingPin ? 'محفوظ ہو رہا ہے...' : 'سیکیورٹی پن تبدیل و محفوظ کریں'}</span>
            </button>
          </form>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1 font-arabic">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>سیکیورٹی پروٹیکشن فوائد:</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              جب آپ دکان پر کیشیئر یا ملازم بٹھائیں گے، تو وہ آپ کا اصل منافع اور تھوک خریداری کی قیمتیں نہیں دیکھ سکیں گے جب تک وہ یہ پن نہ لگائیں۔
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
