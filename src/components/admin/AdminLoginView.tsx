import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
  Store,
  Sparkles,
  Building2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useBusiness } from '../../context/BusinessContext';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const { setActiveView } = useBusiness();

  const [identifier, setIdentifier] = useState('admin@asanibiz.pk');
  const [password, setPassword] = useState('asani2026');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await loginAdmin(identifier, password);
      if (!res.success) {
        setErrorMsg(res.message || 'لاگ اِن کی تفصیلات غلط ہیں۔');
      }
    } catch {
      setErrorMsg('سرور سے رابطہ نہ ہو سکا۔ برائے مہربانی دوبارہ کوشش کریں۔');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#051a17] text-white flex flex-col justify-between relative overflow-hidden font-arabic">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2ad15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00f2ad]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0a5e54]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00f2ad] flex items-center justify-center text-[#0a2e2a] font-black text-xl shadow-lg shadow-[#00f2ad]/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">AsaniBiz</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00f2ad]/20 text-[#00f2ad] border border-[#00f2ad]/30 uppercase tracking-wider">
                Admin Control
              </span>
            </div>
            <p className="text-[11px] text-white/60">سینٹرل ایڈمنسٹریشن و بزنس مینجمنٹ پورٹل</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
        >
          <Store className="w-3.5 h-3.5 text-[#00f2ad]" />
          <span>واپس کسٹمر شاپ پر جائیں</span>
        </button>
      </header>

      {/* Center Login Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#0a2e2a]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Security Badge */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00f2ad]/15 border border-[#00f2ad]/30 flex items-center justify-center text-[#00f2ad] shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              انتظامیہ لاگ اِن (Admin Portal)
            </h1>
            <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
              صرف مجاز ایڈمنسٹریٹرز اور سپروائزرز کے لیے محفوظ رسائی۔
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                ایڈمن ای میل یا صارف نام
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute right-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@asanibiz.pk"
                  className="w-full bg-[#051a17] border border-white/20 rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-white/30 text-sm focus:outline-hidden focus:border-[#00f2ad] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                سیکیورٹی پاس ورڈ یا ایڈمن پن (PIN)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute right-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#051a17] border border-white/20 rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-white/30 text-sm focus:outline-hidden focus:border-[#00f2ad] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#00f2ad] hover:bg-[#00df9e] text-[#0a2e2a] font-black text-sm shadow-xl shadow-[#00f2ad]/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>تصدیق کی جا رہی ہے...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>ایڈمن پورٹل میں لاگ اِن کریں</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hints for Testing */}
          <div className="pt-4 border-t border-white/10 space-y-2 text-start">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span className="font-bold flex items-center gap-1 text-[#00f2ad]">
                <Sparkles className="w-3 h-3" />
                ٹیسٹ اور جائزہ کے لیے پہلے سے تیار کردہ اسناد:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@asanibiz.pk', 'asani2026')}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/80 text-start transition-all cursor-pointer"
              >
                <div className="font-bold text-[#00f2ad]">سپر ایڈمن (Chief)</div>
                <div className="text-[10px] text-white/60 font-mono">admin@asanibiz.pk / asani2026</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('my2828679@gmail.com', '7860')}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/80 text-start transition-all cursor-pointer"
              >
                <div className="font-bold text-[#00f2ad]">پلیٹ فارم اونر (PIN)</div>
                <div className="text-[10px] text-white/60 font-mono">my2828679@gmail.com / 7860</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-white/40 border-t border-white/10">
        © {new Date().getFullYear()} AsaniBiz Central Administration System • اینڈ ٹو اینڈ تصدیق شدہ سیکیورٹی
      </footer>
    </div>
  );
};
