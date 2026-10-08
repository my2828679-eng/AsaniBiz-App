import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Camera,
  BookOpen,
  Boxes,
  WalletCards,
  BarChart3,
  Building2,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  ShoppingBag,
  Settings,
  Store
} from 'lucide-react';
import { useBusiness, ActiveView } from '../context/BusinessContext';
import { t } from '../i18n/translations';
import { BUSINESS_TYPES } from '../config/businessTypes';

interface NavItem {
  id: ActiveView;
  labelKey: string;
  customLabel?: { ur: string; en: string };
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', labelKey: 'navDashboard', icon: LayoutDashboard },
  { id: 'billing', labelKey: 'vipPosTitle', customLabel: { ur: '🧾 کاؤنٹر', en: '🧾 Counter' }, icon: Receipt },
  { id: 'khata', labelKey: 'navKhata', icon: BookOpen },
  { id: 'purchases', labelKey: 'navPurchases', icon: ShoppingBag },
  { id: 'expenses', labelKey: 'navExpenses', icon: WalletCards },
  { id: 'products', labelKey: 'navStock', icon: Boxes },
  { id: 'reports', labelKey: 'navReports', icon: BarChart3 },
  { id: 'landing', labelKey: 'navLanding', icon: Building2 },
  { id: 'settings', labelKey: 'navSettings', icon: Settings },
  { id: 'admin', labelKey: 'navAdmin', icon: ShieldCheck },
];

export const Sidebar: React.FC = () => {
  const { profile, activeView, setActiveView, setIsAIMunshiOpen, setIsCameraOpen, setCameraMode, setIsOnboardingOpen } = useBusiness();
  const bConfig = BUSINESS_TYPES[profile.businessType] || BUSINESS_TYPES.kiryana;
  const lang = profile.preferredLanguage;

  return (
    <aside
      id="desktop-sidebar-nav"
      className="hidden lg:flex flex-col w-64 bg-[#052e16] text-white border-r rtl:border-r-0 rtl:border-l border-[#d4af37]/25 shrink-0 select-none h-full z-20 shadow-xl"
    >
      {/* Brand Header */}
      <div 
        onClick={() => setActiveView('dashboard')}
        className="p-5 sm:p-6 flex items-center gap-3 border-b border-[#d4af37]/25 cursor-pointer group bg-[#0f172a]/40"
      >
        <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-md shadow-black/50 bg-[#0f172a] flex items-center justify-center shrink-0 p-0.5 group-hover:border-[#f3e5ab] transition-all">
          <img src="/asanibiz-vip-lion-logo.jpg" alt="AsaniBiz VIP Logo" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="min-w-0">
          <h1 className="font-black text-base sm:text-lg leading-tight text-[#d4af37] font-serif tracking-wider uppercase truncate">
            {profile.businessName || 'ASANIBIZ'}
          </h1>
          <p className="text-[10px] text-emerald-200/80 font-bold uppercase tracking-wider truncate">
            {bConfig.name[lang] || 'VIP Business'}
          </p>
        </div>
      </div>

      {/* Direct Quick Counter & Parchi Scanner Entry Buttons */}
      <div className="p-3 border-b border-[#d4af37]/20 space-y-2">
        <button
          id="sidebar-pos-quick-counter-btn"
          type="button"
          onClick={() => setActiveView('billing')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
            activeView === 'billing'
              ? 'bg-[#d4af37] text-[#052e16]'
              : 'bg-[#0f172a] hover:bg-[#0f172a]/80 text-[#d4af37] border border-[#d4af37]/35'
          }`}
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>{lang === 'ur' ? '🧾 کاؤنٹر' : '🧾 Counter'}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 font-mono uppercase text-[#d4af37]">Counter</span>
        </button>

        <button
          id="sidebar-parchi-scan-btn"
          type="button"
          onClick={() => {
            setCameraMode('scan_receipt');
            setIsCameraOpen(true);
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black bg-[#0f172a] hover:bg-[#083c1d] text-emerald-200 border border-[#d4af37]/30 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>{lang === 'ur' ? '📷 پرچی / بل اسکین' : '📷 Parchi / Bill Scan'}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#052e16] text-[#d4af37] border border-[#d4af37]/30 font-mono uppercase">AI</span>
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-6 mb-2 text-[10px] uppercase tracking-wider text-[#d4af37]/70 font-bold">
          {t('businessMenu', lang)}
        </div>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all text-left rtl:text-right cursor-pointer ${
                  isActive
                    ? 'bg-[#0f172a] text-[#d4af37] font-black border-r-4 rtl:border-r-0 rtl:border-l-4 border-[#d4af37] shadow-sm'
                    : 'text-slate-200 hover:text-[#d4af37] hover:bg-[#0f172a]/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                <span className="truncate">
                  {item.customLabel ? (lang === 'ur' ? item.customLabel.ur : item.customLabel.en) : t(item.labelKey, lang)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* AI Munshi Voice Assistant Trigger Button */}
      <div className="px-4 pb-2">
        <button
          id="sidebar-open-ai-munshi-btn"
          onClick={() => setIsAIMunshiOpen(true)}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] hover:from-[#c59e2b] hover:to-[#966d0c] text-[#052e16] rounded-xl text-xs font-black shadow-md shadow-[#d4af37]/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#052e16]" />
          <span>{t('navAIMunshi', lang)}</span>
        </button>
      </div>

      {/* Subscription Status Card */}
      <div className="p-4 mt-auto">
        <div className="bg-[#0f172a]/70 rounded-xl p-3.5 border border-[#d4af37]/30">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold">
              {t('planStatus', lang)}
            </p>
            <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-1.5 py-0.5 rounded font-bold">
              {t('trialActive', lang)}
            </span>
          </div>
          <p className="text-xs font-bold text-white mt-1">Rs. 700 / {t('monthlyPlan', lang)}</p>
          <div className="w-full bg-[#052e16] h-1.5 rounded-full mt-2 overflow-hidden border border-[#d4af37]/20">
            <div className="bg-[#d4af37] w-3/4 h-full rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Footer / Safety Badge */}
      <div className="p-4 border-t border-[#d4af37]/20 text-[11px] text-white/50 flex items-center justify-between bg-[#0f172a]/40">
        <div className="flex items-center gap-1.5 text-[#d4af37]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] text-white/80">{t('safeLocalData', lang)}</span>
        </div>
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="text-[#d4af37]/80 hover:text-[#d4af37] text-[10px] underline cursor-pointer"
        >
          {t('changeStore', lang)}
        </button>
      </div>
    </aside>
  );
};
