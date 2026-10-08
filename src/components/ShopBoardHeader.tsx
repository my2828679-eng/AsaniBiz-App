import React, { useState, useRef } from 'react';
import { 
  Edit3, 
  Check, 
  X, 
  Phone,
  Store,
  Upload,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';
import { BUSINESS_TYPES } from '../config/businessTypes';
import { BUSINESS_THEMES } from '../config/businessDashboardConfig';
import { BusinessTypeId } from '../types';
import { SmartBusinessLogo } from './SmartBusinessLogo';

export const ShopBoardHeader: React.FC = () => {
  const { profile, updateProfile, currentLanguage } = useBusiness();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.businessName || '');
  const [tempType, setTempType] = useState<BusinessTypeId>(profile.businessType || 'kiryana');
  const [tempPhone, setTempPhone] = useState(profile.phone || '');
  const [tempTagline, setTempTagline] = useState(profile.tagline || '');
  const [tempLogoUrl, setTempLogoUrl] = useState<string | undefined>(profile.logoUrl);

  const bConfig = BUSINESS_TYPES[profile.businessType] || BUSINESS_TYPES.kiryana;
  const themeConfig = BUSINESS_THEMES[profile.businessType] || BUSINESS_THEMES.kiryana;
  const activeAccentColor = profile.themeColor || themeConfig.accentColor || '#7c3aed';
  
  const businessTypeName = bConfig.name[currentLanguage] || bConfig.name.ur || bConfig.name.en;
  const defaultTagline = 'آسانی سے پروفیشنل کاروبار تک';
  const displayTagline = profile.tagline || defaultTagline;

  const handleStartEdit = () => {
    setTempName(profile.businessName || '');
    setTempType(profile.businessType || 'kiryana');
    setTempPhone(profile.phone || '');
    setTempTagline(profile.tagline || '');
    setTempLogoUrl(profile.logoUrl);
    setIsEditing(true);
  };

  const handleSaveIdentity = () => {
    if (tempName.trim()) {
      updateProfile({ 
        businessName: tempName.trim(),
        businessType: tempType,
        phone: tempPhone.trim(),
        tagline: tempTagline.trim(),
        logoUrl: tempLogoUrl
      });
      setIsEditing(false);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert(currentLanguage === 'ur' ? 'تصویر کا سائز 3MB سے کم ہونا چاہیے' : 'Image size must be under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newLogo = reader.result;
        if (isEditing) {
          setTempLogoUrl(newLogo);
        } else {
          updateProfile({ logoUrl: newLogo });
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveLogo = () => {
    if (isEditing) {
      setTempLogoUrl(undefined);
    } else {
      updateProfile({ logoUrl: undefined });
    }
  };

  return (
    <header className="relative w-full max-w-5xl mx-auto mb-4 px-1" id="business-identity-header">
      {/* Hidden File Input for Logo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoFileChange}
      />

      <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8 transition-all">
        {/* Signboard Top Accent Line in Business Theme Color */}
        <div 
          className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700"
          style={{
            background: `linear-gradient(90deg, ${activeAccentColor}, #4f46e5, ${activeAccentColor})`
          }}
        />

        {/* Top Corner Edit Button */}
        {!isEditing && (
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 sm:top-4 sm:right-4 rtl:sm:right-auto rtl:sm:left-4 z-10">
            <button
              type="button"
              id="btn-edit-business-identity"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100/90 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer active:scale-95 font-arabic shadow-2xs backdrop-blur-xs"
              title={t('editBusinessDetails', currentLanguage)}
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <span>{t('edit', currentLanguage)}</span>
            </button>
          </div>
        )}

        {isEditing ? (
          /* Business Identity & Logo Edit Form */
          <div className="w-full max-w-xl mx-auto bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 text-start mt-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-arabic flex items-center gap-2">
                <Store className="w-4 h-4 text-purple-600" />
                <span>{t('editBusinessInfo', currentLanguage)}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo Preview & Controls in Edit Mode */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 mb-2 font-arabic">
                {tempLogoUrl ? t('customerLogo', currentLanguage) : t('autoLogo', currentLanguage)}
              </span>
              <div className="relative mb-3">
                <SmartBusinessLogo
                  businessType={tempType}
                  logoUrl={tempLogoUrl}
                  businessName={tempName}
                  accentColor={activeAccentColor}
                  size="board"
                  showBadge={true}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl flex items-center gap-1.5 cursor-pointer font-arabic transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{tempLogoUrl ? t('changeLogo', currentLanguage) : t('uploadLogo', currentLanguage)}</span>
                </button>
                {tempLogoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1 cursor-pointer font-arabic transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('removeLogo', currentLanguage)}</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. Business Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1 font-arabic">
                {t('businessName', currentLanguage)} *
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="مثلاً: مدینہ کریانہ اسٹور"
                className="w-full px-3.5 py-2 text-sm sm:text-base font-bold bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic"
                dir="auto"
              />
            </div>

            {/* 2. Business Type / Category */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1 font-arabic">
                {t('businessTypeCategory', currentLanguage)} *
              </label>
              <select
                value={tempType}
                onChange={(e) => setTempType(e.target.value as BusinessTypeId)}
                className="w-full px-3.5 py-2 text-sm sm:text-base font-bold bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic cursor-pointer"
              >
                {Object.entries(BUSINESS_TYPES).map(([id, cfg]) => (
                  <option key={id} value={id}>
                    {cfg.name[currentLanguage] || cfg.name.ur || cfg.name.en}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Phone Number */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1 font-arabic">
                {t('phoneNumber', currentLanguage)}
              </label>
              <input
                type="text"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="0300 1234567"
                className="w-full px-3.5 py-2 text-sm sm:text-base font-mono font-bold bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            {/* 4. Optional Tagline */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1 font-arabic">
                {t('taglineOptional', currentLanguage)}
              </label>
              <input
                type="text"
                value={tempTagline}
                onChange={(e) => setTempTagline(e.target.value)}
                placeholder="آسانی سے پروفیشنل کاروبار تک"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white text-slate-800 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic"
                dir="auto"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-xl bg-slate-200/70 transition-colors cursor-pointer font-arabic"
              >
                {t('cancel', currentLanguage)}
              </button>
              <button
                type="button"
                id="btn-save-business-identity"
                onClick={handleSaveIdentity}
                className="px-5 py-2 text-xs sm:text-sm text-white font-extrabold rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer shadow-sm flex items-center gap-1.5 font-arabic active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{t('save', currentLanguage)}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Real Professional Shop Signboard Layout:
             ┌─────────────────────────────────┐
             │          LARGE LOGO             │
             │       BUSINESS NAME             │
             │       Business Type             │
             └─────────────────────────────────┘
          */
          <div className="flex flex-col items-center justify-center text-center pt-2 pb-2 sm:pt-4 sm:pb-4 px-2 sm:px-6">
            {/* 1. LARGE PROMINENT LOGO (140-180px Mobile, 180-240px Tablet/Desktop - Real Professional Shop Signboard Logo) */}
            <div
              id="shop-board-logo-container"
              onClick={handleStartEdit}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStartEdit();
                }
              }}
              className="relative my-3 sm:my-4 group shrink-0 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-[0.98] outline-none select-none"
              title={currentLanguage === 'ur' ? 'کاروباری شناخت و لوگو (تبدیل کرنے کے لیے کلک کریں)' : 'Business Profile & Logo (Click to edit)'}
              aria-label="Business logo - Click to edit profile"
            >
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <SmartBusinessLogo
                  businessType={profile.businessType}
                  logoUrl={profile.logoUrl}
                  businessName={profile.businessName}
                  accentColor={activeAccentColor}
                  size="board"
                  showBadge={false}
                />
              </div>
            </div>

            {/* 2. PROMINENT BUSINESS / SHOP NAME WITH VERIFIED BADGE */}
            <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto px-1 flex-wrap">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 font-arabic tracking-tight leading-tight break-words"
                dir="auto"
              >
                {profile.businessName || t('myBusiness', currentLanguage)}
              </h1>
              <span 
                className="inline-flex items-center justify-center text-amber-500 shrink-0" 
                title="تصدیق شدہ دکان (Verified Business)"
              >
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400 text-white" />
              </span>
            </div>

            {/* 3. BUSINESS TYPE / CATEGORY */}
            <div className="mt-2.5 flex items-center justify-center">
              <span 
                className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-extrabold border shadow-2xs font-arabic"
                style={{
                  backgroundColor: `${activeAccentColor}12`,
                  color: activeAccentColor,
                  borderColor: `${activeAccentColor}30`
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeAccentColor }} />
                <span>{businessTypeName}</span>
              </span>
            </div>

            {/* 4. PHONE NUMBER */}
            <div className="mt-2.5 flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-slate-700 font-mono" dir="ltr">
              <Phone className="w-4 h-4 shrink-0" style={{ color: activeAccentColor }} />
              <span>{profile.phone || '0300 0000000'}</span>
            </div>

            {/* 5. SUBTLE PROFESSIONAL TAGLINE */}
            {displayTagline && (
              <p 
                className="text-xs sm:text-sm text-slate-500 font-medium font-arabic mt-2 max-w-md mx-auto italic"
                dir="auto"
              >
                "{displayTagline}"
              </p>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

