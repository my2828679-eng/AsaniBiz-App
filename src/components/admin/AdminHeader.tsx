import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  LogOut, 
  Search, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Menu, 
  X,
  User,
  Sparkles,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useBusiness } from '../../context/BusinessContext';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  onOpenMunshi?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onToggleMobileSidebar, 
  isMobileSidebarOpen,
  onOpenMunshi
}) => {
  const { 
    adminUser, 
    logoutAdmin, 
    stats, 
    searchQuery, 
    setSearchQuery,
    showDemoData,
    setShowDemoData 
  } = useAdmin();
  const { setActiveView } = useBusiness();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#052e16] text-white border-b border-[#d4af37]/30 h-16 shrink-0 flex items-center px-4 sm:px-6 shadow-md shadow-black/25">
      <div className="w-full flex items-center justify-between gap-3">
        {/* Left Side: Mobile toggle + Platform Brand Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[#d4af37] bg-[#0f172a] hover:bg-[#083c1d] border border-[#d4af37]/40 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-md shadow-black/50 bg-[#0f172a] p-0.5 shrink-0 flex items-center justify-center">
              <img src="/asanibiz-vip-lion-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-black text-base tracking-wider text-[#d4af37] font-serif uppercase">ASANIBIZ</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#0f172a] text-[#d4af37] border border-[#d4af37]/40 uppercase">
                  VIP Admin
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80">سینٹرل مینجمنٹ سسٹم</p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute right-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="دکان کا نام، مالک، فون یا شہر تلاش کریں..."
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 pr-9 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-[#00f2ad] transition-all"
            />
          </div>
        </div>

        {/* Right Side: Demo Toggle, Alerts, Return to Shop & Admin User */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Admin Munshi Direct Header Trigger */}
          {onOpenMunshi && (
            <button
              type="button"
              onClick={onOpenMunshi}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#00f2ad]/20 hover:bg-[#00f2ad]/30 text-[#00f2ad] border border-[#00f2ad]/40 transition-all cursor-pointer shadow-xs"
              title="ایڈمن منشی اوپن کریں"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ایڈمن منشی</span>
            </button>
          )}

          {/* Demo Data Toggle Pill */}
          <button
            type="button"
            onClick={() => setShowDemoData(!showDemoData)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              showDemoData
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-white/10 text-white/70 border-white/15 hover:bg-white/15'
            }`}
            title="ڈیمو ٹیسٹ ڈیٹا آن/آف کریں"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{showDemoData ? 'ڈیمو ڈیٹا: آن' : 'صرف لائیو شاپ'}</span>
          </button>

          {/* System Alerts Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer"
              title="سسٹم نوٹیفکیشنز اور الرٹس"
            >
              <Bell className="w-4 h-4" />
              {stats.systemAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {stats.systemAlertsCount}
                </span>
              )}
            </button>

            {isAlertsOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-72 sm:w-80 bg-[#051a17] border border-white/20 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in text-start">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    سسٹم الرٹس اور تجاویز
                  </span>
                  <button
                    onClick={() => setIsAlertsOpen(false)}
                    className="text-white/60 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {stats.expiredSubscriptions > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200">
                      <div className="font-bold">سبسکرپشن ایکسپائریشن وارننگ</div>
                      <div className="text-[11px] text-rose-300/80 mt-0.5">
                        {stats.expiredSubscriptions} دکانوں کی سبسکرپشن ختم ہو چکی ہے۔ واٹس ایپ ریمائنڈر درکار ہے۔
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200">
                    <div className="font-bold">سسٹم صحت: 100% آن لائن</div>
                    <div className="text-[11px] text-emerald-300/80 mt-0.5">
                      آف لائن کیشے اور AI منشی سروس مکمل فعال ہے۔
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Switch Back to Customer Shop View */}
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00f2ad] hover:bg-[#00df9e] text-[#0a2e2a] text-xs font-black shadow-md shadow-[#00f2ad]/20 transition-all active:scale-98 cursor-pointer"
            title="کسٹمر ڈیش بورڈ پر جائیں"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">واپس شاپ</span>
          </button>

          {/* Admin User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-r border-white/15 rtl:border-r-0 rtl:border-l rtl:pr-2">
            <div className="hidden lg:block text-start leading-tight">
              <div className="text-xs font-bold text-white truncate max-w-[130px]">
                {adminUser?.name || 'Super Admin'}
              </div>
              <div className="text-[10px] text-[#00f2ad] font-semibold">
                {adminUser?.role === 'super_admin' ? 'سپر ایڈمنسٹریٹر' : 'ایڈمن'}
              </div>
            </div>

            <button
              type="button"
              onClick={logoutAdmin}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-all cursor-pointer"
              title="ایڈمن لاگ آؤٹ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
