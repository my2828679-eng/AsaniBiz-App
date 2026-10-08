import React from 'react';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Layers,
  Banknote,
  Gift,
  Bot,
  BarChart3,
  Activity,
  Sliders,
  ShieldCheck,
  Store,
  ExternalLink
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export type AdminTab = 
  | 'overview'
  | 'businesses'
  | 'subscriptions'
  | 'plans'
  | 'payments'
  | 'referrals'
  | 'ai_usage'
  | 'reports'
  | 'system_activity'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavMenuItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavMenuItem[] = [
  { id: 'overview', label: 'ڈیش بورڈ جائزہ (Overview)', icon: LayoutDashboard },
  { id: 'businesses', label: 'دکانیں و کاروباری صارفین', icon: Building2 },
  { id: 'subscriptions', label: 'سبسکرپشن مینجمنٹ', icon: CreditCard },
  { id: 'plans', label: 'پلانز و پیکیجز (Pricing)', icon: Layers },
  { id: 'payments', label: 'ادائیگیاں و ٹرانزیکشنز', icon: Banknote },
  { id: 'referrals', label: 'ریوارڈ و ریفرل سسٹم', icon: Gift },
  { id: 'ai_usage', label: 'AI منشی استعمال مانیٹر', icon: Bot },
  { id: 'reports', label: 'کاروباری رپورٹس و تجزیہ', icon: BarChart3 },
  { id: 'system_activity', label: 'سسٹم لاگز و ایکٹیویٹی', icon: Activity },
  { id: 'settings', label: 'ایڈمن کنٹرول سیٹنگز', icon: Sliders },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { setActiveView } = useBusiness();

  const handleSelect = (tab: AdminTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed lg:static top-0 bottom-0 right-0 lg:right-auto z-50 flex flex-col w-64 bg-[#051a17] text-white border-l rtl:border-l-0 rtl:border-r border-white/10 shrink-0 select-none h-full transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00f2ad] flex items-center justify-center text-[#0a2e2a] font-extrabold text-base shadow-sm">
              A
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white font-sans">AsaniBiz Admin</h2>
              <p className="text-[10px] text-[#00f2ad] font-semibold">پلیٹ فارم انتظامیہ</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-white/40 font-bold">
            انتظامی مینو (Admin Controls)
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-start cursor-pointer ${
                  isActive
                    ? 'bg-[#00f2ad] text-[#0a2e2a] font-black shadow-lg shadow-[#00f2ad]/15'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0a2e2a]' : 'text-white/50'}`} />
                <span className="truncate flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Link: Switch to Customer App */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-[#00f2ad]" />
            <span>کسٹمر شاپ پر جائیں</span>
            <ExternalLink className="w-3 h-3 text-white/40" />
          </button>

          <div className="p-2.5 rounded-xl bg-white/5 text-[10px] text-white/50 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00f2ad] shrink-0" />
            <span>انٹرپرائز لیول سیکیورٹی فعال ہے</span>
          </div>
        </div>
      </aside>
    </>
  );
};
