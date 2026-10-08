import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

interface SplashScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, forceShow = false }) => {
  const { profile } = useBusiness();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(15);
  const lang = profile?.preferredLanguage || 'ur';

  useEffect(() => {
    // Animate progress bar over 1.6s
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25 + 15);
      });
    }, 280);

    // Fade out and finish
    const exitTimer = setTimeout(() => {
      handleProceed();
    }, 2200);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  const handleProceed = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 450);
  };

  if (!isVisible && !forceShow) return null;

  return (
    <div
      id="asanibiz-splash-screen"
      className={`fixed inset-0 z-100 flex flex-col items-center justify-between p-6 bg-[#052e16] text-white transition-opacity duration-500 select-none overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 35%, #083c1d 0%, #052e16 60%, #0f172a 100%)'
      }}
    >
      {/* Golden atmospheric ambient particles / glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] bg-[#d4af37]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#052e16]/80 rounded-full blur-2xl" />
      </div>

      {/* Top Status / VIP Indicator */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f172a]/70 border border-[#d4af37]/35 text-[#d4af37] text-xs font-black shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>VIP BUSINESS OPERATING SYSTEM</span>
        </div>
        <button
          type="button"
          onClick={handleProceed}
          className="text-xs font-bold text-[#d4af37]/80 hover:text-[#d4af37] px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          {lang === 'ur' ? 'چھوڑیں (Skip)' : 'Skip'}
        </button>
      </div>

      {/* Central Brand Crest & Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6">
        {/* Luxury Lion Emblem */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-3 border-[#d4af37] shadow-2xl shadow-black/60 bg-[#0f172a] p-1">
            <img
              src="/asanibiz-vip-lion-logo.jpg"
              alt="AsaniBiz Luxury VIP Lion"
              className="w-full h-full object-cover rounded-2xl select-none"
            />
          </div>
        </div>

        {/* Brand Name in Golden Serif Typography */}
        <div className="mt-6 space-y-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#fceb9e] to-[#c59e2b] font-serif uppercase drop-shadow-md">
            ASANIBIZ
          </h1>
          <p className="text-sm sm:text-base font-extrabold text-[#d4af37] tracking-wider uppercase font-sans">
            SMART BUSINESS PLATFORM
          </p>
          <p className="text-xs sm:text-sm text-emerald-200/90 font-arabic pt-1 max-w-sm mx-auto font-medium">
            {lang === 'ur'
              ? 'پاکستان کا سب سے جدید اور قابل اعتماد ڈیجیٹل کاروباری نظام'
              : lang === 'sd'
              ? 'پاڪستان جو سڀ کان جديد ۽ محفوظ ڪاروباري نظام'
              : 'Pakistan\'s Premier Intelligent Business Operating System'}
          </p>
        </div>

        {/* Progress Bar & Loader */}
        <div className="mt-8 w-64 sm:w-80 space-y-2">
          <div className="h-2 w-full bg-[#0f172a] rounded-full overflow-hidden border border-[#d4af37]/35 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] rounded-full transition-all duration-300 shadow-sm shadow-[#d4af37]/50"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#d4af37]">
            <span className="flex items-center gap-1.5 font-arabic">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
              {progress < 100 ? (lang === 'ur' ? 'سسٹم لوڈ ہو رہا ہے...' : 'Loading system...') : (lang === 'ur' ? 'تیار ہے!' : 'Ready!')}
            </span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Launch CTA Button */}
      <div className="relative z-10 w-full max-w-md pb-4 flex flex-col items-center gap-3">
        <button
          type="button"
          id="splash-enter-app-btn"
          onClick={handleProceed}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] hover:from-[#c59e2b] hover:to-[#966d0c] text-[#052e16] font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/25 border border-[#f3e5ab] transition-all transform active:scale-98 cursor-pointer font-arabic tracking-wide"
        >
          <span>{lang === 'ur' ? 'ڈیش بورڈ میں داخل ہوں' : 'Launch AsaniBiz'}</span>
          <ArrowRight className="w-5 h-5 text-[#052e16]" />
        </button>

        <div className="text-[11px] text-emerald-300/70 font-sans tracking-wide">
          Deep Emerald • Metallic Gold • Dark Slate
        </div>
      </div>
    </div>
  );
};
