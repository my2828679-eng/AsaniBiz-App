import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  Calendar,
  Zap,
  ArrowUpRight,
  ChevronRight,
  X,
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { LanguageCode } from '../types';

interface PackageAccountCardProps {
  className?: string;
}

export const PackageAccountCard: React.FC<PackageAccountCardProps> = ({ className = '' }) => {
  const { profile, currentLanguage, setActiveView } = useBusiness();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const lang: LanguageCode = profile.preferredLanguage || currentLanguage || 'ur';
  const sub = profile.subscription || {
    status: 'trial',
    trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    plan: 'monthly_700',
    pricePkr: 700
  };

  // Calculate real days remaining from trialEndDate
  const trialEnd = sub.trialEndDate ? new Date(sub.trialEndDate) : null;
  const now = new Date();
  const daysRemaining = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 30;

  const formattedExpiryDate = trialEnd
    ? trialEnd.toLocaleDateString(lang === 'en' ? 'en-PK' : 'ur-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '30 دن';

  // Multilingual text labels for the 5 languages
  const getLabel = (key: string): string => {
    const labels: Record<string, Record<string, string>> = {
      cardTitle: {
        ur: 'پیکج و اکاؤنٹ',
        sd: 'پيڪيج ۽ اڪائونٽ',
        ps: 'پیکج او اکاونټ',
        pa: 'پیکج تے اکاؤنٹ',
        en: 'Package & Account',
        'ur-roman': 'Package aur Account'
      },
      cardSubtitle: {
        ur: 'موجودہ پلان اور اکاؤنٹ کی حیثیت',
        sd: 'موجوده پلان ۽ اڪائونٽ جي حالت',
        ps: 'اوسنی پلان او د حساب حالت',
        pa: 'موجودہ پلان تے اکاؤنٹ دی حالت',
        en: 'Current Plan & Account Status',
        'ur-roman': 'Current Plan & Account Status'
      },
      planMonthly: {
        ur: 'ماہانہ بزنس پلان',
        sd: 'مھينيو بزنس پلان',
        ps: 'میاشتنی سوداګریز پلان',
        pa: 'ماہانہ بزنس پلان',
        en: 'Monthly Business Plan',
        'ur-roman': 'Monthly Business Plan'
      },
      planAnnual: {
        ur: 'سالانہ پرو پلان',
        sd: 'سالانو پرو پلان',
        ps: 'کلنی پرو پلان',
        pa: 'سالانہ پرو پلان',
        en: 'Annual Pro Plan',
        'ur-roman': 'Annual Pro Plan'
      },
      statusTrial: {
        ur: 'مفت ٹرائل فعال',
        sd: 'مفت ٽرائل فعال',
        ps: 'وړیا ازموینه فعاله ده',
        pa: 'مفت ٹرائل چالو',
        en: 'Active Trial',
        'ur-roman': 'Free Trial Active'
      },
      statusActive: {
        ur: 'فعال سبسکرپشن',
        sd: 'فعال رڪنیت',
        ps: 'فعال ګډون',
        pa: 'فعال پیکج',
        en: 'Active Plan',
        'ur-roman': 'Active Subscription'
      },
      statusExpired: {
        ur: 'میعاد ختم',
        sd: 'مدت ختم',
        ps: 'موده پای ته رسیدلې',
        pa: 'میعاد ختم',
        en: 'Expired',
        'ur-roman': 'Expired'
      },
      validity: {
        ur: 'میعاد / تنسیخ:',
        sd: 'مدت / تجديد:',
        ps: 'د پای نېټه:',
        pa: 'میعاد / تنسیخ:',
        en: 'Validity / Expiry:',
        'ur-roman': 'Validity:'
      },
      daysLeft: {
        ur: `${daysRemaining} دن باقی`,
        sd: `${daysRemaining} ڏينهن باقي`,
        ps: `${daysRemaining} ورځې پاتې`,
        pa: `${daysRemaining} دن باقی`,
        en: `${daysRemaining} days left`,
        'ur-roman': `${daysRemaining} din baqi`
      },
      usageLimits: {
        ur: 'سافٹ ویئر و AI استعمال:',
        sd: 'سافٽ ويئر ۽ AI استعمال:',
        ps: 'د سافټویر او AI کارول:',
        pa: 'سافٹ ویئر تے AI ورتوں:',
        en: 'Software & AI Usage:',
        'ur-roman': 'Software & AI Usage:'
      },
      unlimitedUsage: {
        ur: 'لوکل زیرو-ٹوکن انجن (لامحدود استعمال)',
        sd: 'لوڪل زيرو-ٽوڪن انجن (لامحدود استعمال)',
        ps: 'ځایی صفر-ټوکن انجن (لامحدود کارول)',
        pa: 'لوکل زیرو-ٹوکن انجن (لامحدود ورتوں)',
        en: 'Zero-Token Engine (Unlimited Offline)',
        'ur-roman': 'Zero-Token Engine (Unlimited)'
      },
      btnUpgrade: {
        ur: 'اپ گریڈ / تجدید',
        sd: 'اپ گريڊ / تجديد',
        ps: 'اپ گریډ / نوی کول',
        pa: 'اپ گریڈ / رینیو',
        en: 'Upgrade / Renew',
        'ur-roman': 'Upgrade / Renew'
      },
      btnDetails: {
        ur: 'تفصیلات دیکھیں',
        sd: 'تفصيل ڏسو',
        ps: 'تفصیلات وګورئ',
        pa: 'تفصیل ویکھو',
        en: 'View Details',
        'ur-roman': 'Tafseelat Dekhein'
      }
    };

    return labels[key]?.[lang] || labels[key]?.['ur'] || labels[key]?.['en'] || '';
  };

  const planName = sub.plan === 'annual' ? getLabel('planAnnual') : getLabel('planMonthly');
  const isTrial = sub.status === 'trial';
  const isActive = sub.status === 'active';

  return (
    <>
      {/* ─── PACKAGE ACCOUNT CARD (Customer Dashboard) ─── */}
      <section
        aria-label="Package Account"
        className={`relative z-10 ${className}`}
        id="section-package-account"
      >
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 md:p-6 border border-emerald-500/30 shadow-md hover:shadow-lg transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Left: Package Icon & Primary Info */}
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black font-arabic text-white flex items-center gap-2">
                    <span>{getLabel('cardTitle')}</span>
                  </h3>

                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arabic ${
                      isActive
                        ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50'
                        : isTrial
                        ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                        : 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>
                      {isActive
                        ? getLabel('statusActive')
                        : isTrial
                        ? getLabel('statusTrial')
                        : getLabel('statusExpired')}
                    </span>
                  </span>

                  <span className="text-xs text-emerald-300 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                    Rs. {sub.pricePkr || 700} / {lang === 'en' ? 'mo' : 'ماہ'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-arabic mt-1 font-medium">
                  <span className="text-white font-bold">{planName}</span>
                  <span className="mx-2 text-slate-500">•</span>
                  <span>{getLabel('validity')}</span>{' '}
                  <span className="text-amber-300 font-bold">{formattedExpiryDate}</span>{' '}
                  <span className="text-slate-400 text-xs font-mono">({getLabel('daysLeft')})</span>
                </p>
              </div>
            </div>

            {/* Center: System Usage / Zero-Token Limits info */}
            <div className="w-full lg:w-auto bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 flex items-center justify-between lg:justify-start gap-3 text-xs font-arabic">
              <div className="flex items-center gap-2 text-emerald-300">
                <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="font-bold text-slate-200">{getLabel('usageLimits')}</span>
              </div>
              <span className="text-emerald-200 text-[11px] font-medium">
                {getLabel('unlimitedUsage')}
              </span>
            </div>

            {/* Right: Actions (Details & Upgrade/Renew) */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <button
                type="button"
                id="btn-package-account-details"
                onClick={() => setShowDetailsModal(true)}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold font-arabic transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>{getLabel('btnDetails')}</span>
              </button>

              <button
                type="button"
                id="btn-package-account-upgrade"
                onClick={() => setActiveView('settings')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs font-arabic transition-all cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <span>{getLabel('btnUpgrade')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PACKAGE ACCOUNT DETAILS MODAL ─── */}
      {showDetailsModal && (
        <div
          id="modal-package-account-details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 font-arabic tracking-wider">
                    AsaniBiz Account Information
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-arabic">
                    {getLabel('cardTitle')} — تفصیلی معلومات
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Owner & Shop Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-arabic">دکان کا نام:</span>
                <span className="font-bold text-slate-900 font-arabic">{profile.businessName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-arabic">مالک کا نام:</span>
                <span className="font-bold text-slate-900 font-arabic">{profile.ownerName || 'دوکاندار'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-arabic">موبائل نمبر:</span>
                <span className="font-bold text-slate-900 font-mono" dir="ltr">{profile.phone || '0300-1234567'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-arabic">اکاؤنٹ آئی ڈی:</span>
                <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">{profile.id}</span>
              </div>
            </div>

            {/* Plan & Pricing */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-start">
                <span className="text-[11px] text-emerald-800 font-arabic font-bold">موجودہ پیکج</span>
                <div className="text-sm font-black text-emerald-950 font-arabic mt-0.5">{planName}</div>
                <div className="text-xs text-emerald-700 font-mono font-bold mt-1">Rs. {sub.pricePkr || 700} / ماہانہ</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-start">
                <span className="text-[11px] text-slate-600 font-arabic font-bold">حیثیت / اسٹیٹس</span>
                <div className="text-sm font-black text-slate-900 font-arabic mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isTrial ? getLabel('statusTrial') : getLabel('statusActive')}</span>
                </div>
                <div className="text-xs text-slate-500 font-arabic mt-1">{formattedExpiryDate} ({getLabel('daysLeft')})</div>
              </div>
            </div>

            {/* Usage & Feature Access */}
            <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 font-arabic flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>شامل خصوصیات و استعمال کی حد:</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 font-arabic">
                <li className="flex items-center justify-between">
                  <span>• لوکل زیرو-ٹوکن انجن:</span>
                  <span className="font-bold text-emerald-700">لامحدود (0 لاگت)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• AI منشی وائس اسسٹنٹ:</span>
                  <span className="font-bold text-emerald-700">شامل و فعال</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• ادھار کھاتہ و بلنگ:</span>
                  <span className="font-bold text-emerald-700">لامحدود کسٹمرز و سیلز</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• ممبرشپ رینک و انعامات:</span>
                  <span className="font-bold text-amber-700 font-mono">{profile.rewards?.rank || 'Member'} ({profile.rewards?.points || 0} Pts)</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-arabic transition-all cursor-pointer"
              >
                بند کریں
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setActiveView('settings');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black font-arabic transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <span>پیکج و ادائیگی کی ترتیبات (Manage)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
