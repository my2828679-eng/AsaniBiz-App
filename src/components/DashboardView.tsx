import React, { useState } from 'react';
import {
  Receipt,
  BookOpen,
  Boxes,
  ShoppingBag,
  WalletCards,
  Users,
  Truck,
  BarChart3,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Coins,
  PlusCircle,
  Layers,
  Scale,
  Search,
  ScanLine,
  ShieldCheck,
  Ruler,
  Hammer,
  Flame,
  Trash2,
  Camera,
  QrCode,
  SlidersHorizontal,
  RotateCcw,
  Package,
  Armchair,
  Car,
  UtensilsCrossed,
  Cake,
  Apple,
  Globe,
  Navigation,
  Tv,
  Wrench,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Settings,
  Store,
  Share2,
  X
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';
import { BUSINESS_THEMES, BusinessToolItem } from '../config/businessDashboardConfig';
import { BUSINESS_TYPES } from '../config/businessTypes';
import { ShopBoardHeader } from './ShopBoardHeader';
import { BusinessBackground } from './BusinessBackground';
import { SpecializedToolModal } from './SpecializedToolModal';
import { PackageAccountCard } from './PackageAccountCard';
import { formatBillWhatsAppText, openManualWhatsApp } from '../services/whatsappShare';
import { getRecommendedToolsForProfile } from '../services/businessMappingEngine';
import { getToolGuidance, matchToolFromQuery } from '../services/toolGuidanceContent';

export const DashboardView: React.FC = () => {
  const {
    profile,
    updateProfile,
    invoices,
    products,
    customers,
    suppliers,
    expenses,
    purchases,
    setActiveView,
    setIsAIMunshiOpen,
    setIsCameraOpen,
    setCameraMode,
    currentLanguage,
  } = useBusiness();

  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [guidedToolId, setGuidedToolId] = useState<string | null>(null);
  const [toolSearchQuery, setToolSearchQuery] = useState<string>('');

  const lang = profile.preferredLanguage || currentLanguage || 'ur';
  const themeConfig = BUSINESS_THEMES[profile.businessType] || BUSINESS_THEMES.kiryana;
  const bConfig = BUSINESS_TYPES[profile.businessType] || BUSINESS_TYPES.kiryana;
  const activeColor = profile.themeColor || '#7c3aed';

  // Calculate real metrics directly from context
  const now = new Date();
  const todayDateStr = now.toISOString().split('T')[0];

  const todayInvoices = invoices.filter((inv) =>
    inv.createdAt ? inv.createdAt.startsWith(todayDateStr) : false
  );

  const todaySales = todayInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  const totalCustomerUdhaar = customers.reduce(
    (sum, c) => sum + (c.currentBalance > 0 ? c.currentBalance : 0),
    0
  );

  const lowStockProducts = products.filter((p) => (p.quantity || 0) <= (p.lowStockThreshold || 5));
  const totalStockUnits = products.reduce((acc, p) => acc + (p.quantity || 0), 0);

  // Helper for dynamic icon rendering
  const renderIcon = (name: string, className: string = "w-6 h-6") => {
    const props = { className };
    switch (name) {
      case 'Receipt': return <Receipt {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Boxes': return <Boxes {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Package': return <Package {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'Truck': return <Truck {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'WalletCards': return <WalletCards {...props} />;
      case 'Clock': return <Clock {...props} />;
      case 'AlertTriangle': return <AlertTriangle {...props} />;
      case 'PieChart': return <BarChart3 {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'QrCode': return <QrCode {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Camera': return <Camera {...props} />;
      case 'ScanLine': return <ScanLine {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'SlidersHorizontal': return <SlidersHorizontal {...props} />;
      case 'RotateCcw': return <RotateCcw {...props} />;
      case 'Armchair': return <Armchair {...props} />;
      case 'Ruler': return <Ruler {...props} />;
      case 'Hammer': return <Hammer {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      case 'Search': return <Search {...props} />;
      case 'Car': return <Car {...props} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Cake': return <Cake {...props} />;
      case 'Trash2': return <Trash2 {...props} />;
      case 'Apple': return <Apple {...props} />;
      case 'Calculator': return <Scale {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'Navigation': return <Navigation {...props} />;
      case 'Globe': return <Globe {...props} />;
      default: return <Boxes {...props} />;
    }
  };

  const handleToolAction = (action: string) => {
    if (action.startsWith('tool_modal:')) {
      const toolSubId = action.replace('tool_modal:', '');
      setActiveToolModal(toolSubId);
      return;
    }

    switch (action) {
      case 'scan_receipt':
      case 'parchi_scan':
      case 'bill_scan':
      case 'camera_scanner':
        setCameraMode('scan_receipt');
        setIsCameraOpen(true);
        break;
      case 'pos':
      case 'quick_counter':
      case 'billing':
      case 'billing_sales':
      case 'new_bill':
      case 'new_sale':
      case 'new_order':
        setActiveView('billing');
        break;
      case 'khata':
      case 'khata_udhaar':
      case 'customers':
        setActiveView('khata');
        break;
      case 'products':
      case 'products_add':
      case 'stock':
      case 'categories':
      case 'low_stock':
        setActiveView('products');
        break;
      case 'purchases':
      case 'suppliers':
        setActiveView('purchases');
        break;
      case 'expenses':
      case 'daily_sales':
      case 'payments':
        setActiveView('expenses');
        break;
      case 'reports':
      case 'profit_report':
      case 'sales_history':
        setActiveView('reports');
        break;
      case 'settings':
      case 'more':
        setActiveView('settings');
        break;
      case 'ai_munshi':
        setIsAIMunshiOpen(true);
        break;
      default:
        setActiveView('billing');
    }
  };

  return (
    <div id="dashboard-main-view" className="relative space-y-6 pb-6 max-w-5xl mx-auto">
      {/* Subtle Background Pattern */}
      <BusinessBackground 
        businessType={profile.businessType} 
        themeColor={activeColor} 
      />

      {/* ZERO-TOKEN PERSONALIZED WELCOME BANNER (After Onboarding) */}
      {profile.isOnboardingCompleted && !profile.welcomedAfterOnboarding && (
        <section aria-label="Welcome Message" className="relative z-20">
          <div className="bg-linear-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0 text-amber-300 shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-arabic text-amber-300 flex items-center gap-2">
                    <span>
                      {lang === 'sd' 
                        ? `ڀلي ڪري آيا، ${profile.ownerName || 'مالڪ'} صاحب!` 
                        : lang === 'ps'
                        ? `ښه راغلاست، ${profile.ownerName || 'مالک'} صیب!`
                        : lang === 'pa'
                        ? `جی آیاں نوں، ${profile.ownerName || 'مالک'} صاحب!`
                        : lang === 'en'
                        ? `Welcome, ${profile.ownerName || 'Owner'}!`
                        : `خوش آمدید ${profile.ownerName || 'مالک'} صاحب!`}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-100 font-arabic mt-1 leading-relaxed max-w-2xl">
                    {lang === 'sd'
                      ? `توهان جي دڪان "${profile.businessName}" جو ڊيش بورڊ تيار آهي۔ توهان جي ڪاروبار مطابق اهم اوزار سامهون رکيا ويا آهن۔`
                      : lang === 'ps'
                      ? `ستاسو د دوکان "${profile.businessName}" ډشبورډ چمتو دی. ستاسو د کاروبار مطابق اړین اوزار مخې ته کېښودل شول.`
                      : lang === 'pa'
                      ? `تہاڈی دکان "${profile.businessName}" دا ڈیش بورڈ تیار اے۔ تہاڈے کاروبار مطابق ضروری ٹولز سامنے رکھ دتے گئے نیں۔`
                      : lang === 'en'
                      ? `Your shop dashboard for "${profile.businessName}" is ready. Essential tools tailored for your business have been configured.`
                      : `آپ کی دکان "${profile.businessName}" کا ڈیش بورڈ تیار ہے۔ آپ کے کاروبار کے مطابق ضروری اوزار سامنے رکھ دیے گئے ہیں۔`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  id="btn-welcome-ai-guidance"
                  onClick={() => setIsAIMunshiOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black font-arabic transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {lang === 'ur' ? 'رہنمائی حاصل کریں' : 'Ask AI Munshi'}
                </button>
                <button
                  type="button"
                  id="btn-welcome-dismiss"
                  onClick={() => updateProfile({ welcomedAfterOnboarding: true })}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold font-arabic transition-all cursor-pointer"
                >
                  {lang === 'ur' ? 'سمجھ گیا' : 'Got it'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 1. BUSINESS IDENTITY CARD (No Logo, Clean, Prominent Name + Category + Phone) */}
      <ShopBoardHeader />

      {/* 2. THREE PRIMARY ACTION CIRCLES (Immediately below Header: Camera, POS, AI Munshi) */}
      <section aria-label="Primary Actions" className="relative z-10">
        <div className="bg-white/95 rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-around sm:justify-center gap-3 sm:gap-10 md:gap-16">
            
            {/* LEFT: 📷 CAMERA */}
            <button
              id="primary-action-camera"
              type="button"
              onClick={() => {
                setCameraMode('scan_receipt');
                setIsCameraOpen(true);
              }}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 group-hover:scale-105 group-hover:shadow-indigo-600/40 transition-all border-4 border-white ring-2 ring-indigo-200">
                <Camera className="w-7 h-7 sm:w-9 sm:h-9" />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-black text-slate-900 font-arabic text-center">
                {t('parchiCameraTitle', lang)}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60 mt-0.5 font-arabic">
                {t('smartParchiScan', lang)}
              </span>
            </button>

            {/* CENTER: 🟢 POS (Visually the most prominent central action) */}
            <button
              id="primary-action-pos"
              type="button"
              onClick={() => setActiveView('billing')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform relative -top-1"
            >
              <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xl shadow-emerald-700/35 group-hover:scale-105 group-hover:shadow-emerald-700/50 transition-all border-4 border-white ring-4 ring-emerald-300/80">
                <Receipt className="w-10 h-10 sm:w-13 sm:h-13 text-white" />
              </div>
              <span className="mt-2 text-sm sm:text-base font-black text-emerald-950 font-arabic text-center">
                {t('vipPosTitle', lang)}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-xs mt-0.5 font-arabic">
                {t('oneTapSaleBadge', lang)}
              </span>
            </button>

            {/* RIGHT: 🤖 AI MUNSHI */}
            <button
              id="primary-action-ai-munshi"
              type="button"
              onClick={() => setIsAIMunshiOpen(true)}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-purple-600 to-violet-800 text-white flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:scale-105 group-hover:shadow-purple-600/40 transition-all border-4 border-white ring-2 ring-purple-200">
                <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 text-amber-300" />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-black text-slate-900 font-arabic text-center">
                {t('aiMunshiTitle', lang)}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60 mt-0.5 font-arabic">
                {t('smartAssistantBadge', lang)}
              </span>
            </button>

          </div>
        </div>
      </section>

      {/* 2. BUSINESS SUMMARY (Exact Order: 1. Udhaar, 2. Low Stock, 3. Total Stock, 4. Aaj Ki Sale) */}
      <section aria-labelledby="business-summary-heading" className="relative z-10">
        <h2 id="business-summary-heading" className="sr-only">Business Summary</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Udhaar */}
          <div 
            id="summary-card-udhaar"
            onClick={() => setActiveView('khata')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98 ${
              totalCustomerUdhaar > 0 
                ? 'bg-rose-50/90 border-rose-200 hover:border-rose-300' 
                : 'bg-white/95 border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-slate-700 font-arabic truncate">
                {lang === 'ur' ? 'ادھار (گاہک کھاتہ)' : 'Udhaar'}
              </span>
              <div className={`p-2 rounded-xl ${totalCustomerUdhaar > 0 ? 'bg-rose-200/70 text-rose-800' : 'bg-slate-100 text-slate-500'}`}>
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono truncate">
              Rs. {totalCustomerUdhaar.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-arabic truncate font-medium">
              {totalCustomerUdhaar > 0 
                ? (lang === 'ur' ? 'کل وصول طلب ادھار' : 'Receivable balance')
                : (lang === 'ur' ? 'کوئی ادھار بقایا نہیں' : 'Zero credit pending')}
            </div>
          </div>

          {/* Card 2: Low Stock */}
          <div 
            id="summary-card-low-stock"
            onClick={() => setActiveView('products')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98 ${
              lowStockProducts.length > 0 
                ? 'bg-amber-50/90 border-amber-200 hover:border-amber-300' 
                : 'bg-white/95 border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-slate-700 font-arabic truncate">
                {lang === 'ur' ? 'ختم ہونے والا مال' : 'Low Stock'}
              </span>
              <div className={`p-2 rounded-xl ${lowStockProducts.length > 0 ? 'bg-amber-200/70 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {lowStockProducts.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-arabic truncate font-medium">
              {lowStockProducts.length > 0 
                ? (lang === 'ur' ? `${lowStockProducts.length} آئٹمز کم ہیں` : `${lowStockProducts.length} items low`)
                : (lang === 'ur' ? 'اسٹاک مناسب ہے' : 'Stock is sufficient')}
            </div>
          </div>

          {/* Card 3: Total Stock */}
          <div 
            id="summary-card-total-stock"
            onClick={() => setActiveView('products')}
            className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-slate-700 font-arabic truncate">
                {lang === 'ur' ? 'کل اسٹاک' : 'Total Stock'}
              </span>
              <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono truncate">
              {totalStockUnits.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-arabic truncate font-medium">
              {products.length} {lang === 'ur' ? 'مختلف پروڈکٹس' : 'total items'}
            </div>
          </div>

          {/* Card 4: Aaj Ki Sale */}
          <div 
            id="summary-card-today-sales"
            onClick={() => setActiveView('billing')}
            className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-slate-700 font-arabic truncate">
                {lang === 'ur' ? 'آج کی سیل' : 'Aaj Ki Sale'}
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono truncate">
              Rs. {todaySales.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-arabic truncate font-medium">
              {todayInvoices.length > 0 
                ? `${todayInvoices.length} ${lang === 'ur' ? 'بل جاری ہوئے' : 'bills issued'}`
                : (lang === 'ur' ? 'ابھی کوئی سیل نہیں' : 'No sales yet')}
            </div>
          </div>

        </div>
      </section>

      {/* 3. PACKAGE & ACCOUNT STATUS (Real Subscription, Plan Validity, Zero-Token Limits, Upgrade/Renew) */}
      <PackageAccountCard />

      {/* 4. BUSINESS-ADAPTIVE TOOLS (Zero-Token Personalized Layout, No Artificial 8-Tool Ceiling) */}
      <section aria-labelledby="business-tools-heading" className="relative z-10 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-2.5 px-1 gap-2.5">
          <div>
            <h2 id="business-tools-heading" className="text-sm sm:text-base font-black text-slate-900 font-arabic flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>{t('businessToolsTitle', lang)}</span>
            </h2>
            <p className="text-xs text-slate-500 font-arabic font-medium">
              {bConfig.name[lang] || bConfig.name.ur || bConfig.name.en} {profile.tradeMode ? `(${profile.tradeMode})` : ''} — {t('businessToolsSubtitle', lang)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input for Discovering any tool */}
            <div className="relative">
              <input
                type="text"
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                placeholder={lang === 'ur' ? 'ٹول تلاش کریں...' : 'Search tools...'}
                className="w-36 sm:w-48 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-arabic bg-white focus:outline-hidden focus:border-purple-400 pl-7 text-start"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              {toolSearchQuery && (
                <button
                  type="button"
                  onClick={() => setToolSearchQuery('')}
                  className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-arabic hidden sm:inline-block">
              {bConfig.name[lang] || bConfig.name.ur || bConfig.name.en}
            </span>
          </div>
        </div>

        {/* Dynamic Personalized Tools based on Phase 10 Profile mapping */}
        {(() => {
          const allTools = themeConfig.tools || [];
          const recommendedIds =
            profile.dashboardConfiguration?.recommendedTools ||
            getRecommendedToolsForProfile(profile.businessType, profile.tradeMode);

          let primaryTools: BusinessToolItem[] = [];
          let secondaryTools: BusinessToolItem[] = [];

          if (recommendedIds && recommendedIds.length > 0) {
            // Show all tools relevant to this business without artificial 8-tool ceiling!
            primaryTools = allTools.filter((t) => recommendedIds.includes(t.id));
            secondaryTools = allTools.filter((t) => !recommendedIds.includes(t.id));

            // Ensure at least 6 tools if available
            if (primaryTools.length < 6) {
              const needed = 6 - primaryTools.length;
              primaryTools = [...primaryTools, ...secondaryTools.slice(0, needed)];
              secondaryTools = secondaryTools.slice(needed);
            }
          } else {
            primaryTools = allTools;
            secondaryTools = [];
          }

          // Apply search filter if entered
          const filteredPrimary = toolSearchQuery.trim()
            ? primaryTools.filter((tool) => {
                const name = (tool.name[lang] || tool.name.ur || tool.name.en || '').toLowerCase();
                return name.includes(toolSearchQuery.toLowerCase()) || tool.id.includes(toolSearchQuery.toLowerCase());
              })
            : primaryTools;

          const filteredSecondary = toolSearchQuery.trim()
            ? secondaryTools.filter((tool) => {
                const name = (tool.name[lang] || tool.name.ur || tool.name.en || '').toLowerCase();
                return name.includes(toolSearchQuery.toLowerCase()) || tool.id.includes(toolSearchQuery.toLowerCase());
              })
            : secondaryTools;

          return (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredPrimary.map((tool: BusinessToolItem) => {
                  const toolLabel = tool.name[lang] || tool.name.ur || tool.name.en;
                  return (
                    <button
                      key={tool.id}
                      id={`btn-biz-tool-${tool.id}`}
                      type="button"
                      onClick={() => handleToolAction(tool.action)}
                      className="bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-2xs hover:shadow-xs text-start flex flex-col justify-between group transition-all active:scale-95 cursor-pointer relative min-h-[96px]"
                    >
                      {/* Top Badges & "Ye kya hai?" Help button */}
                      <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 flex items-center gap-1">
                        {tool.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200/50">
                            {tool.badge}
                          </span>
                        )}
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGuidedToolId(tool.id);
                          }}
                          className="w-5 h-5 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-400 hover:text-purple-700 flex items-center justify-center text-[10px] font-black transition-colors"
                          title="یہ کیا ہے؟ (رہنمائی)"
                        >
                          ?
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 transition-transform group-hover:scale-105">
                        {renderIcon(tool.icon, "w-5 h-5")}
                      </div>

                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 font-arabic leading-snug">
                          {toolLabel}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium font-arabic">
                          <span>{lang === 'ur' ? 'اوپن کریں' : 'Open'}</span>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-purple-600 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Expandable More Tools (Allows accessing all remaining tools) */}
              {filteredSecondary.length > 0 && (
                <div className="pt-1">
                  <div className="flex justify-center">
                    <button
                      id="btn-toggle-more-tools"
                      type="button"
                      onClick={() => setShowMoreTools(!showMoreTools)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-arabic transition-all cursor-pointer shadow-2xs border border-slate-200/80 active:scale-95"
                    >
                      <span>
                        {showMoreTools 
                          ? (lang === 'ur' ? 'باقی ٹولز چھپائیں' : 'Hide More Tools')
                          : `${lang === 'ur' ? 'مزید کاروباری اوزار' : 'More Tools'} (${filteredSecondary.length}+)`}
                      </span>
                      {showMoreTools ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  </div>

                  {showMoreTools && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-3">
                      {filteredSecondary.map((tool: BusinessToolItem) => {
                        const toolLabel = tool.name[lang] || tool.name.ur || tool.name.en;
                        return (
                          <button
                            key={tool.id}
                            id={`btn-biz-tool-extra-${tool.id}`}
                            type="button"
                            onClick={() => handleToolAction(tool.action)}
                            className="bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-2xs hover:shadow-xs text-start flex flex-col justify-between group transition-all active:scale-95 cursor-pointer relative min-h-[96px]"
                          >
                            <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 flex items-center gap-1">
                              {tool.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200/50">
                                  {tool.badge}
                                </span>
                              )}
                              <span
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGuidedToolId(tool.id);
                                }}
                                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-400 hover:text-purple-700 flex items-center justify-center text-[10px] font-black transition-colors"
                                title="یہ کیا ہے؟ (رہنمائی)"
                              >
                                ?
                              </span>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 transition-transform group-hover:scale-105">
                              {renderIcon(tool.icon, "w-5 h-5")}
                            </div>

                            <div>
                              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 font-arabic leading-snug">
                                {toolLabel}
                              </h3>
                              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium font-arabic">
                                <span>{lang === 'ur' ? 'اوپن کریں' : 'Open'}</span>
                                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-purple-600 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </section>

      {/* 5. RECENT INVOICES (حالیہ بل و پرچیاں) */}
      <section aria-labelledby="recent-invoices-heading" className="relative z-10 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 id="recent-invoices-heading" className="font-extrabold text-slate-900 text-sm sm:text-base font-arabic">
              {lang === 'ur' ? 'حالیہ بل و خریداریاں' : 'Recent Invoices'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('billing')}
            className="text-xs sm:text-sm font-extrabold text-purple-700 hover:underline cursor-pointer font-arabic"
          >
            {lang === 'ur' ? 'تمام دیکھیں' : 'View All'}
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs sm:text-sm space-y-2 font-arabic">
            <Receipt className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
            <p className="text-slate-600 font-semibold">
              {lang === 'ur' ? 'ابھی کوئی نیا بل جاری نہیں ہوا' : 'No bills generated yet'}
            </p>
            <button
              type="button"
              onClick={() => setActiveView('billing')}
              className="px-4 py-2 rounded-xl text-white font-black text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 shadow-xs inline-block transition-colors cursor-pointer mt-1"
            >
              {lang === 'ur' ? 'نیا بل بنائیں' : 'Create First Bill'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-100 font-arabic">
                <tr>
                  <th className="py-3 px-4">{lang === 'ur' ? 'بل نمبر' : 'Bill #'}</th>
                  <th className="py-3 px-4">{lang === 'ur' ? 'گاہک' : 'Customer'}</th>
                  <th className="py-3 px-4">{lang === 'ur' ? 'اشیاء' : 'Items'}</th>
                  <th className="py-3 px-4">{lang === 'ur' ? 'حالت' : 'Status'}</th>
                  <th className="py-3 px-4 text-right rtl:text-left">{lang === 'ur' ? 'رقم' : 'Amount'}</th>
                  <th className="py-3 px-4 text-center">{lang === 'ur' ? 'شیئر' : 'Share'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{inv.customerName}</div>
                      <div className="text-xs text-slate-400">{inv.customerPhone || 'Walk-in'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {inv.items?.map((i) => i.productName).join(', ').slice(0, 24)}...
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        inv.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.paymentStatus === 'paid' ? (lang === 'ur' ? 'ادا شدہ' : 'Paid') : (lang === 'ur' ? 'بقایا' : 'Unpaid')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right rtl:text-left">
                      Rs. {inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const billText = formatBillWhatsAppText(inv, profile);
                          openManualWhatsApp(billText, inv.customerPhone);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title={lang === 'ur' ? 'واٹس ایپ پر بل بھیجیں' : 'Send Bill via WhatsApp'}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Specialized Tool Modal */}
      {activeToolModal && (
        <SpecializedToolModal 
          toolId={activeToolModal}
          onClose={() => setActiveToolModal(null)}
        />
      )}

      {/* ZERO-TOKEN PREDEFINED TOOL GUIDANCE MODAL ("Ye Kya Hai?") */}
      {guidedToolId && (() => {
        const guidance = getToolGuidance(guidedToolId, lang);
        const title = guidance.name[lang] || guidance.name.ur || guidance.name.en;
        const short = guidance.shortGuide[lang] || guidance.shortGuide.ur || guidance.shortGuide.en;
        const explanation = guidance.detailedExplanation[lang] || guidance.detailedExplanation.ur || guidance.detailedExplanation.en;
        const actions = guidance.keyActions[lang] || guidance.keyActions.ur || guidance.keyActions.en || [];

        return (
          <div
            id="tool-guidance-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setGuidedToolId(null)}
          >
            <div
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-start"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-600 font-arabic tracking-wider">
                      رہنمائی و وضاحت • Zero-Token Help
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-arabic">
                      {title} — یہ کیا ہے؟
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGuidedToolId(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Short summary card */}
              <div className="bg-purple-50/70 border border-purple-200/60 rounded-2xl p-3.5">
                <p className="text-xs sm:text-sm font-bold text-purple-950 font-arabic leading-relaxed">
                  {short}
                </p>
              </div>

              {/* Detailed practical explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 font-arabic">
                  تفصیلی کاروباری فائدہ:
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-arabic leading-relaxed">
                  {explanation}
                </p>
              </div>

              {/* Key actions */}
              {actions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-slate-700 font-arabic">
                    اس ٹول سے آپ کیا کر سکتے ہیں:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 font-arabic list-disc list-inside">
                    {actions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer action */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGuidedToolId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-arabic transition-all cursor-pointer"
                >
                  بند کریں
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tool = (themeConfig.tools || []).find((t) => t.id === guidedToolId);
                    setGuidedToolId(null);
                    if (tool) handleToolAction(tool.action);
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white text-xs font-bold font-arabic transition-all cursor-pointer shadow-xs"
                >
                  ابھی کھولیں (Open Tool)
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
