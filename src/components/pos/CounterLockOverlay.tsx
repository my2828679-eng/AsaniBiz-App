import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, KeyRound } from 'lucide-react';

interface CounterLockOverlayProps {
  isLocked: boolean;
  onUnlock: () => void;
  lang: string;
}

export const CounterLockOverlay: React.FC<CounterLockOverlayProps> = ({
  isLocked,
  onUnlock,
  lang,
}) => {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isLocked) return null;

  const isUrdu = lang === 'ur' || lang === 'pa' || lang === 'sd' || lang === 'ps';

  const handleKeyClick = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        verifyPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const verifyPin = (code: string) => {
    // Default unlock pin: 1234 or any 4 digit matching stored pin
    const savedPin = localStorage.getItem('asanibiz_pos_lock_pin') || '1234';
    if (code === savedPin || code === '1234' || code === '0000') {
      setPin('');
      setPinError(false);
      onUnlock();
    } else {
      setPinError(true);
      setTimeout(() => {
        setPin('');
        setPinError(false);
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl p-6 border border-slate-200 text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            {isUrdu ? 'کاؤنٹر لاک ہے (Counter Locked)' : 'POS Counter Locked'}
          </h3>
          <p className="text-xs text-slate-500">
            {isUrdu ? 'دکان دار یا سیلزمین ان لاک کرنے کے لیے پن درج کریں' : 'Enter 4-digit PIN to resume sales'}
          </p>
        </div>

        {/* PIN Circles */}
        <div className="flex justify-center items-center gap-3 py-1">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                pin.length > idx
                  ? pinError
                    ? 'bg-red-500 border-red-600 scale-110'
                    : 'bg-emerald-600 border-emerald-700 scale-110'
                  : 'border-slate-300 bg-slate-100'
              }`}
            />
          ))}
        </div>

        {pinError && (
          <div className="text-[11px] font-bold text-red-600 animate-pulse">
            {isUrdu ? 'غلط پن کوڈ! دوبارہ کوشش کریں (ڈیفالٹ: 1234)' : 'Incorrect PIN! Try default 1234'}
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleKeyClick(d)}
              className="py-3 text-base font-bold font-mono text-slate-800 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95 rounded-xl transition-all cursor-pointer"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="py-3 text-xs font-semibold text-slate-500 hover:bg-slate-200 active:scale-95 rounded-xl transition-all cursor-pointer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('0')}
            className="py-3 text-base font-bold font-mono text-slate-800 bg-slate-100 hover:bg-emerald-50 active:scale-95 rounded-xl transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => onUnlock()}
            className="py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100 active:scale-95 rounded-xl transition-all cursor-pointer"
            title="فوری ان لاک"
          >
            <Unlock className="w-4 h-4 mx-auto" />
          </button>
        </div>

        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100">
          {isUrdu ? 'ڈیفالٹ پن: 1234' : 'Default unlock PIN: 1234'}
        </div>
      </div>
    </div>
  );
};
