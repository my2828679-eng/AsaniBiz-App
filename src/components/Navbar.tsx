import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Store,
  Receipt,
  Camera,
  BookOpen,
  Boxes,
  WalletCards,
  BarChart3,
  Building2,
  Settings,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useBusiness, ActiveView } from '../context/BusinessContext';
import { LANGUAGES, t } from '../i18n/translations';
import { BUSINESS_TYPES } from '../config/businessTypes';
import { LanguageCode } from '../types';

export const Navbar: React.FC = () => {
  const {
    profile,
    updateProfile,
    activeView,
    setActiveView,
    setIsAIMunshiOpen,
    setIsCameraOpen,
    setCameraMode,
    setIsOnboardingOpen,
  } = useBusiness();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentLang = LANGUAGES[profile.preferredLanguage] || LANGUAGES['ur'];
  const bConfig = BUSINESS_TYPES[profile.businessType] || BUSINESS_TYPES.kiryana;
  const lang = profile.preferredLanguage || 'ur';

  const handleLanguageChange = (code: LanguageCode) => {
    updateProfile({ preferredLanguage: code });
    setIsLangMenuOpen(false);
  };

  const handleNavClick = (view: string) => {
    if (view === 'parchi_scan') {
      setCameraMode('scan_receipt');
      setIsCameraOpen(true);
    } else {
      setActiveView(view as ActiveView);
    }
    setIsMobileMenuOpen(false);
  };

  const navMenuItems = [
    { id: 'dashboard', label: t('navDashboard', lang), icon: Store },
    { id: 'billing', label: lang === 'ur' ? '🧾 کاؤنٹر' : '🧾 Counter', icon: Receipt },
    { id: 'parchi_scan', label: lang === 'ur' ? '📷 پرچی / بل اسکین' : '📷 Parchi / Bill Scan', icon: Camera },
    { id: 'khata', label: t('navKhata', lang), icon: BookOpen },
    { id: 'purchases', label: t('navPurchases', lang), icon: ShoppingBag },
    { id: 'expenses', label: t('navExpenses', lang), icon: WalletCards },
    { id: 'products', label: t('navStock', lang), icon: Boxes },
    { id: 'reports', label: t('navReports', lang), icon: BarChart3 },
    { id: 'landing', label: t('navLanding', lang), icon: Building2 },
    { id: 'settings', label: t('navSettings', lang), icon: Settings },
    { id: 'admin', label: 'ایڈمن پورٹل (Admin)', icon: ShieldCheck },
  ];

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 bg-[#052e16] text-white border-b border-[#d4af37]/35 h-16 shrink-0 flex items-center shadow-lg shadow-[#052e16]/30 backdrop-blur-md"
    >
      <div className="w-full px-3.5 sm:px-6 flex items-center justify-between relative">
        
        {/* LEFT: ☰ Menu Button + Main Luxury Brand Logo + Quick POS & Parchi */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="mobile-nav-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#0f172a] text-[#d4af37] hover:bg-[#083c1d] border border-[#d4af37]/40 transition-colors cursor-pointer active:scale-95 shadow-xs"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#d4af37]" /> : <Menu className="w-5 h-5 text-[#d4af37]" />}
            <span className="text-xs sm:text-sm font-black font-arabic hidden xs:inline">
              {lang === 'ur' ? 'مینو' : 'Menu'}
            </span>
          </button>

          {/* MAIN BRAND LOGO: Luxury Gold & Emerald Lion Icon + ASANIBIZ Typography */}
          <div
            id="top-header-main-brand-logo"
            onClick={() => setActiveView('dashboard')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveView('dashboard');
              }
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group outline-none"
            title="AsaniBiz Dashboard"
            aria-label="AsaniBiz Home"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-md shadow-black/50 bg-[#0f172a] shrink-0 p-0.5 group-hover:border-[#f3e5ab] group-hover:scale-105 transition-all">
              <img
                src="/asanibiz-vip-lion-logo.jpg"
                alt="AsaniBiz VIP Lion"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col text-start">
              <span className="text-sm sm:text-base md:text-lg font-black tracking-widest text-[#d4af37] font-serif uppercase leading-none drop-shadow-xs">
                ASANIBIZ
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-200/90 font-black tracking-wider uppercase font-sans mt-0.5 hidden xs:inline">
                VIP BUSINESS OS
              </span>
            </div>
          </div>

          {/* Quick Counter POS button (Tablet/Desktop) */}
          <button
            id="navbar-pos-counter-btn"
            type="button"
            onClick={() => setActiveView('billing')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-[#d4af37] hover:text-[#052e16] text-[#d4af37] border border-[#d4af37]/40 text-xs font-black transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            <Receipt className="w-4 h-4" />
            <span>{lang === 'ur' ? '🧾 کاؤنٹر' : '🧾 Counter'}</span>
          </button>

          {/* Quick Parchi Scan button (Tablet/Desktop) */}
          <button
            id="navbar-parchi-scan-btn"
            type="button"
            onClick={() => {
              setCameraMode('scan_receipt');
              setIsCameraOpen(true);
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-[#083c1d] text-emerald-200 border border-[#d4af37]/30 text-xs font-black transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            <Camera className="w-4 h-4 text-[#d4af37]" />
            <span>{lang === 'ur' ? '📷 پرچی اسکین' : '📷 Parchi Scan'}</span>
          </button>
        </div>

        {/* CENTER: Prominent Luxury AI Munshi Button */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <button
            id="nav-ai-munshi-trigger"
            type="button"
            onClick={() => setIsAIMunshiOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0f172a] via-[#052e16] to-[#0f172a] hover:from-[#083c1d] hover:to-[#052e16] text-[#d4af37] font-black text-xs sm:text-sm shadow-md shadow-[#d4af37]/20 border-2 border-[#d4af37] active:scale-95 transition-all cursor-pointer group"
            title={t('navAIMunshi', lang)}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37] animate-pulse group-hover:scale-110 transition-transform" />
            <span className="font-arabic tracking-tight whitespace-nowrap text-xs sm:text-sm font-extrabold text-[#d4af37]">
              {t('navAIMunshi', lang)}
            </span>
          </button>
        </div>

        {/* RIGHT: Language Selector */}
        <div className="flex items-center">
          <div className="relative">
            <button
              id="lang-selector-btn"
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#0f172a] border border-[#d4af37]/40 hover:bg-[#083c1d] text-[#d4af37] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Select Language"
            >
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span className="truncate max-w-[70px] sm:max-w-none text-white font-medium">{currentLang.nativeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div
                  id="lang-dropdown-menu"
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-[#0f172a] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-start text-white"
                >
                  <div className="px-4 py-2 border-b border-[#d4af37]/20 text-xs font-black text-[#d4af37] font-arabic">
                    {t('selectLanguage', lang)}
                  </div>
                  {Object.values(LANGUAGES).map((langItem) => (
                    <button
                      key={langItem.code}
                      onClick={() => handleLanguageChange(langItem.code)}
                      className={`w-full px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between text-left rtl:text-right font-bold transition-colors cursor-pointer ${
                        profile.preferredLanguage === langItem.code
                          ? 'bg-[#052e16] text-[#d4af37] font-black border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#d4af37]'
                          : 'text-slate-200 hover:bg-[#052e16]/60 hover:text-[#d4af37]'
                      }`}
                    >
                      <span>{langItem.displayOption}</span>
                      {profile.preferredLanguage === langItem.code && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            id="mobile-responsive-menu-drawer"
            className="fixed top-16 left-0 right-0 z-50 bg-[#0f172a] text-white border-b border-[#d4af37]/40 shadow-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-top-2 duration-150"
          >
            <div className="pb-3 border-b border-[#d4af37]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#052e16] border border-[#d4af37] overflow-hidden p-0.5">
                  <img src="/asanibiz-vip-lion-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-[#d4af37] font-serif uppercase">
                    {profile.businessName || 'ASANIBIZ'}
                  </div>
                  <div className="text-xs text-emerald-300 font-arabic">
                    {bConfig.name[lang] || 'Business'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsOnboardingOpen(true);
                }}
                className="text-xs sm:text-sm font-bold text-[#d4af37] hover:underline cursor-pointer font-arabic"
              >
                {t('changeStore', lang)}
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`menu-drawer-${item.id}`}
                    type="button"
                    onClick={() => handleNavClick(item.id as ActiveView)}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left rtl:text-right flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#052e16] text-[#d4af37] border-[#d4af37] font-black shadow-xs'
                        : 'border-[#ffffff18] bg-[#052e16]/30 text-slate-200 hover:bg-[#052e16] hover:text-[#d4af37]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                    <span className="text-xs sm:text-sm font-bold truncate font-arabic">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#d4af37]/20">
              <button
                type="button"
                id="drawer-ai-munshi-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAIMunshiOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#052e16] via-[#0f172a] to-[#052e16] hover:from-[#083c1d] hover:to-[#083c1d] text-[#d4af37] border border-[#d4af37] font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 font-arabic text-sm sm:text-base"
              >
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span>{t('talkToAIMunshi', lang)}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
