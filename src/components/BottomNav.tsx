import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Sparkles,
  Camera,
  BookOpen
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setIsAIMunshiOpen, setIsCameraOpen, setCameraMode, profile } = useBusiness();
  const lang = profile.preferredLanguage || 'ur';

  return (
    <nav
      id="fixed-bottom-app-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-t border-[#d4af37]/35 shadow-[0_-4px_25px_rgba(0,0,0,0.5)] px-1 sm:px-2 py-1.5 flex items-center justify-around select-none safe-area-bottom h-18 sm:h-20 text-white"
    >
      {/* 1. Home */}
      <button
        id="bottom-nav-home"
        type="button"
        onClick={() => setActiveView('dashboard')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
          activeView === 'dashboard'
            ? 'text-[#d4af37] font-black'
            : 'text-slate-300 hover:text-[#d4af37] font-bold'
        }`}
      >
        <LayoutDashboard className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${activeView === 'dashboard' ? 'text-[#d4af37]' : 'text-slate-400'}`} />
        <span className="text-[11px] sm:text-xs font-arabic truncate font-bold">
          {lang === 'ur' ? 'ہوم' : t('navDashboard', lang)}
        </span>
      </button>

      {/* 2. Counter */}
      <button
        id="bottom-nav-pos"
        type="button"
        onClick={() => setActiveView('billing')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
          activeView === 'billing'
            ? 'text-[#d4af37] font-black'
            : 'text-slate-300 hover:text-[#d4af37] font-bold'
        }`}
      >
        <Receipt className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${activeView === 'billing' ? 'text-[#d4af37]' : 'text-slate-400'}`} />
        <span className="text-[11px] sm:text-xs font-arabic truncate font-bold">
          {lang === 'ur' ? 'کاؤنٹر' : lang === 'sd' ? 'ڪائونٽر' : 'Counter'}
        </span>
      </button>

      {/* 3. AI Munshi - Central Prominent Button */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-6">
        <button
          id="bottom-nav-ai-munshi"
          type="button"
          onClick={() => setIsAIMunshiOpen(true)}
          className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#052e16] via-[#0f172a] to-[#052e16] text-[#d4af37] flex flex-col items-center justify-center shadow-xl shadow-[#d4af37]/35 border-[3px] sm:border-[3.5px] border-[#d4af37] active:scale-95 transition-all cursor-pointer group"
          title={t('navAIMunshi', lang)}
        >
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#d4af37] animate-pulse group-hover:scale-110 transition-transform" />
        </button>
        <span className="text-[10px] sm:text-xs font-black text-[#d4af37] mt-1 font-arabic whitespace-nowrap">
          {lang === 'ur' ? 'اے آئی منشی' : t('navAIMunshi', lang)}
        </span>
      </div>

      {/* 4. Parchi / Bill Camera Scan */}
      <button
        id="bottom-nav-parchi-scan"
        type="button"
        onClick={() => {
          setCameraMode('scan_receipt');
          setIsCameraOpen(true);
        }}
        className="flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer text-slate-300 hover:text-[#d4af37] font-bold"
      >
        <Camera className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 text-emerald-300" />
        <span className="text-[11px] sm:text-xs font-arabic truncate font-bold text-emerald-200">
          {lang === 'ur' ? 'پرچی اسکین' : 'Scan Bill'}
        </span>
      </button>

      {/* 5. Khata */}
      <button
        id="bottom-nav-khata"
        type="button"
        onClick={() => setActiveView('khata')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
          activeView === 'khata'
            ? 'text-[#d4af37] font-black'
            : 'text-slate-300 hover:text-[#d4af37] font-bold'
        }`}
      >
        <BookOpen className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${activeView === 'khata' ? 'text-[#d4af37]' : 'text-slate-400'}`} />
        <span className="text-[11px] sm:text-xs font-arabic truncate font-bold">
          {lang === 'ur' ? 'کھاتہ' : t('navKhata', lang)}
        </span>
      </button>
    </nav>
  );
};
