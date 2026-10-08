import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Receipt,
  BookOpen,
  Boxes,
  BarChart3,
  Mic,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Store,
  Clock,
  Phone,
  HelpCircle,
  ChevronDown,
  Globe,
  Printer,
  Share2,
  Lock,
  Smartphone,
  Check,
  Camera,
  Layers,
  Scale,
  Truck,
  Building2,
  CheckCheck,
  Coins,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Zap,
  Menu,
  X,
  ExternalLink,
  Laptop,
  FileText
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { LanguageCode } from '../types';
import {
  HERO_CONTENT,
  EVOLUTION_STAGES,
  CORE_FEATURES,
  SUPPORTED_BUSINESSES,
  SMART_AI_SECTION,
  SMART_PARCHI_SECTION,
  WHATSAPP_WORKFLOW_SECTION,
  HOW_IT_WORKS_STEPS,
  TRUST_SECURITY_SECTION,
  PRICING_SECTION,
  FAQ_ITEMS,
  NAV_LABELS,
  LEGAL_CONTENT
} from '../data/landingContent';

export type LandingLanguage = 'ur' | 'sd' | 'ps' | 'pa' | 'en';

export const LandingPageView: React.FC = () => {
  const { profile, updateProfile, setActiveView, setIsOnboardingOpen, setIsAIMunshiOpen } = useBusiness();
  
  // Website language can be toggled between Urdu, Sindhi, Pashto, Punjabi, and English
  const [siteLang, setSiteLang] = useState<LandingLanguage>(() => {
    if (profile.preferredLanguage === 'sd') return 'sd';
    if (profile.preferredLanguage === 'ps') return 'ps';
    if (profile.preferredLanguage === 'pa') return 'pa';
    if (profile.preferredLanguage === 'en') return 'en';
    return 'ur';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisualMode, setHeroVisualMode] = useState<'emblem' | 'live'>('emblem');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [featuresCategory, setFeaturesCategory] = useState<'all' | 'core' | 'advanced'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const isRTL = siteLang !== 'en';

  // Handle switching language
  const handleLangSelect = (code: LandingLanguage) => {
    setSiteLang(code);
    updateProfile({ preferredLanguage: code as LanguageCode });
  };

  // Direct CTA: Start Free Onboarding
  const handleStartFree = () => {
    setIsOnboardingOpen(true);
    setActiveView('dashboard');
  };

  // Direct CTA: Login / Open App
  const handleOpenApp = () => {
    setActiveView('dashboard');
  };

  // Direct CTA: Try AI Munshi
  const handleTryAIMunshi = () => {
    setIsAIMunshiOpen(true);
    setActiveView('dashboard');
  };

  // Current localized content blocks
  const effectiveLang = (siteLang && HERO_CONTENT[siteLang]) ? siteLang : 'ur';
  const hero = HERO_CONTENT[effectiveLang] || HERO_CONTENT['ur'];
  const evolution = EVOLUTION_STAGES[effectiveLang] || EVOLUTION_STAGES['ur'];
  const aiContent = SMART_AI_SECTION[effectiveLang] || SMART_AI_SECTION['ur'];
  const parchiContent = SMART_PARCHI_SECTION[effectiveLang] || SMART_PARCHI_SECTION['ur'];
  const whatsappContent = WHATSAPP_WORKFLOW_SECTION[effectiveLang] || WHATSAPP_WORKFLOW_SECTION['ur'];
  const howItWorks = HOW_IT_WORKS_STEPS[effectiveLang] || HOW_IT_WORKS_STEPS['ur'];
  const trust = TRUST_SECURITY_SECTION[effectiveLang] || TRUST_SECURITY_SECTION['ur'];
  const pricing = PRICING_SECTION[effectiveLang] || PRICING_SECTION['ur'];
  const nav = NAV_LABELS[effectiveLang] || NAV_LABELS['ur'];
  const legal = LEGAL_CONTENT[effectiveLang] || LEGAL_CONTENT['ur'];

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    if (activeCategoryFilter === 'all') return SUPPORTED_BUSINESSES;
    return SUPPORTED_BUSINESSES.filter(b => b.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  // Filtered features
  const filteredFeatures = useMemo(() => {
    if (featuresCategory === 'all') return CORE_FEATURES;
    return CORE_FEATURES.filter(f => f.category === featuresCategory);
  }, [featuresCategory]);

  return (
    <div
      id="asanibiz-public-website"
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-slate-50 text-slate-900 ${isRTL ? 'font-arabic' : 'font-sans'} antialiased selection:bg-emerald-500 selection:text-white`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP ANNOUNCEMENT BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#0a2e2a] text-emerald-300 py-2.5 px-4 text-xs font-semibold border-b border-emerald-900/40 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
        <span>
          {nav.announcement}
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. STICKY VIP NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* LOGO & BRAND IDENTITY */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#hero"
              className="flex items-center gap-3 group focus:outline-hidden"
              aria-label="AsaniBiz Home"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0f172a] p-0.5 flex items-center justify-center border-2 border-[#d4af37] shadow-md shadow-black/40 group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                <img
                  src="/asanibiz-vip-lion-logo.jpg"
                  alt="AsaniBiz VIP Lion Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-[#052e16] font-serif uppercase flex items-center gap-1.5 leading-tight">
                  ASANIBIZ
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-[#052e16] text-[#d4af37] border border-[#d4af37]/40 font-sans tracking-normal">
                    VIP OS
                  </span>
                </span>
                <span className="text-[11px] font-bold text-slate-600 hidden sm:inline leading-none">
                  {hero.supporting}
                </span>
              </div>
            </a>
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <a href="#why-asanibiz" className="hover:text-emerald-700 transition-colors">
              {nav.whyAsanibiz}
            </a>
            <a href="#features" className="hover:text-emerald-700 transition-colors">
              {nav.features}
            </a>
            <a href="#smart-ai" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{nav.smartAi}</span>
            </a>
            <a href="#parchi-camera" className="hover:text-emerald-700 transition-colors">
              {nav.parchiCamera}
            </a>
            <a href="#business-types" className="hover:text-emerald-700 transition-colors">
              {nav.businessTypes}
            </a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">
              {nav.pricing}
            </a>
            <a href="#faq" className="hover:text-emerald-700 transition-colors">
              {nav.faq}
            </a>
          </nav>

          {/* RIGHT CONTROLS: Language Switcher + CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 5-Language Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleLangSelect('ur')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  siteLang === 'ur' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect('sd')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  siteLang === 'sd' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                سنڌي
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect('pa')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  siteLang === 'pa' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                پنجابی
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect('ps')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  siteLang === 'ps' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                پښتو
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect('en')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  siteLang === 'en' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Login / Dashboard CTA */}
            <button
              id="landing-login-nav-btn"
              type="button"
              onClick={handleOpenApp}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer active:scale-95"
            >
              <span>{hero.loginBtn}</span>
            </button>

            {/* Primary "Start Free" Button */}
            <button
              id="landing-start-free-nav-btn"
              type="button"
              onClick={handleStartFree}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0a2e2a] hover:bg-[#0f463f] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-950/20 transition-all cursor-pointer active:scale-95 group"
            >
              <span>{hero.startFreeBtn}</span>
              <ArrowRight className={`w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-OUT MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-3 shadow-lg">
            {/* Mobile Language Switcher Row */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">Language / زبان:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['ur', 'sd', 'pa', 'ps', 'en'] as LandingLanguage[]).map(langCode => (
                  <button
                    key={langCode}
                    type="button"
                    onClick={() => handleLangSelect(langCode)}
                    className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all ${
                      siteLang === langCode ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    {langCode === 'ur' ? 'اردو' : langCode === 'sd' ? 'سنڌي' : langCode === 'pa' ? 'پنجابی' : langCode === 'ps' ? 'پښتو' : 'EN'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-2.5 text-sm font-bold text-slate-800">
              <a
                href="#why-asanibiz"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100"
              >
                {nav.whyAsanibiz}
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100"
              >
                {nav.features}
              </a>
              <a
                href="#smart-ai"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>{nav.smartAi}</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">Live</span>
              </a>
              <a
                href="#parchi-camera"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100"
              >
                {nav.parchiCamera}
              </a>
              <a
                href="#business-types"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100"
              >
                {nav.businessTypes}
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100"
              >
                {nav.pricing}
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-100"
              >
                {nav.faq}
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleStartFree();
                }}
                className="w-full py-3 bg-[#0a2e2a] text-white rounded-xl font-black text-sm text-center shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{hero.startFreeBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenApp();
                }}
                className="w-full py-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-sm text-center border border-slate-300"
              >
                {hero.appBtn}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO SECTION (Approved Brand Messages)
      ───────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* HERO LEFT COLUMN: Copywriting & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-start">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[#0a462b] text-xs sm:text-sm font-black shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" />
                <span>{hero.badge}</span>
              </div>

              {/* MAIN HERO TITLE (MANDATORY APPROVED WORDING) */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#0a2e2a] tracking-tight leading-[1.2] sm:leading-[1.18]">
                  {hero.mainHero}
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-800 tracking-tight">
                  {hero.supporting}
                </p>
                <div className="text-sm sm:text-base font-bold text-purple-900 bg-purple-50 inline-block px-3 py-1 rounded-lg border border-purple-200">
                  {hero.brandDesc}
                </div>
              </div>

              {/* Subtext description */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {hero.subtext}
              </p>

              {/* CTAs BUTTON GROUP */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-start-free-cta-btn"
                  type="button"
                  onClick={handleStartFree}
                  className="px-8 py-4 rounded-2xl bg-[#0a2e2a] hover:bg-[#0e3f39] text-white text-base font-black shadow-xl shadow-emerald-950/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 group"
                >
                  <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{hero.startFreeBtn}</span>
                  <ArrowRight className={`w-5 h-5 text-emerald-400 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <button
                  id="hero-open-app-cta-btn"
                  type="button"
                  onClick={handleOpenApp}
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-base font-bold border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Store className="w-5 h-5 text-emerald-700" />
                  <span>{hero.appBtn}</span>
                </button>
              </div>

              {/* PROOF BADGES */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0">
                {hero.proofs.map((proof, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{proof}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HERO RIGHT COLUMN: Premium Illustrated Emblem + Interactive SaaS Live Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900 p-2 sm:p-3 shadow-2xl border border-slate-800 shadow-emerald-950/40">
                {/* Visual Mode Selector Tabs */}
                <div className="bg-slate-800/90 rounded-2xl p-1.5 flex items-center justify-between border-b border-slate-700/60 mb-2 gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => setHeroVisualMode('emblem')}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        heroVisualMode === 'emblem'
                          ? 'bg-[#0a462b] text-white shadow-sm border border-emerald-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{siteLang === 'ur' ? 'پاکستان قومی ایمبلم' : siteLang === 'sd' ? 'قومي ايمبلم' : siteLang === 'ps' ? 'ملي نښان' : siteLang === 'pa' ? 'قومی ایمبلم' : 'National Brand Emblem'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroVisualMode('live')}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        heroVisualMode === 'live'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{siteLang === 'ur' ? 'لائیو سافٹ ویئر' : siteLang === 'sd' ? 'لائيو سافٽ ويئر' : siteLang === 'ps' ? 'ژوندی سافټویر' : siteLang === 'pa' ? 'لائیو سافٹ ویئر' : 'Live POS Counter'}</span>
                    </button>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-700 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{hero.livePreviewTag}</span>
                  </div>
                </div>

                {heroVisualMode === 'emblem' ? (
                  /* ── TAB 1: VIP BRAND EMBLEM SHOWCASE ── */
                  <div className="bg-[#051c17] rounded-2xl p-3 sm:p-4 border border-emerald-800/60 space-y-3">
                    {/* Emblem Image Frame */}
                    <div className="relative overflow-hidden rounded-xl border border-emerald-600/30 bg-slate-950 group">
                      <img
                        src="/asanibiz_hero_emblem.jpg"
                        alt="AsaniBiz VIP Pakistan Brand Emblem — 4 Provinces Dignified Business Insignia"
                        className="w-full h-auto aspect-4/3 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        loading="eager"
                      />
                      <div className="absolute top-2.5 start-2.5 bg-emerald-950/90 backdrop-blur-xs text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-500/40 flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>🇵🇰 سندھ • پنجاب • خیبر پختونخوا • بلوچستان</span>
                      </div>
                      <div className="absolute bottom-2.5 end-2.5 bg-slate-950/90 backdrop-blur-xs text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-md border border-amber-500/40 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>AI منشی + ڈیجیٹل کھاتہ</span>
                      </div>
                    </div>

                    {/* Cultural Provincial Authenticity Tags */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-extrabold text-center">
                      <div className="bg-emerald-900/50 border border-emerald-700/50 text-emerald-200 py-1.5 px-2 rounded-lg">
                        <span>سندھ (Sindh)</span>
                      </div>
                      <div className="bg-emerald-900/50 border border-emerald-700/50 text-emerald-200 py-1.5 px-2 rounded-lg">
                        <span>پنجاب (Punjab)</span>
                      </div>
                      <div className="bg-emerald-900/50 border border-emerald-700/50 text-emerald-200 py-1.5 px-2 rounded-lg">
                        <span>خیبر پختونخوا (KPK)</span>
                      </div>
                      <div className="bg-emerald-900/50 border border-emerald-700/50 text-emerald-200 py-1.5 px-2 rounded-lg">
                        <span>بلوچستان (Balochistan)</span>
                      </div>
                    </div>

                    {/* Approved Slogan Ribbon */}
                    <div className="bg-gradient-to-r from-emerald-950 via-[#0a382d] to-emerald-950 border border-emerald-500/30 rounded-xl p-2.5 text-center text-xs font-extrabold text-emerald-100">
                      <span>“جس کاروبار میں آسانی ہے، اس میں برکت اور سکون وسیع ہے۔”</span>
                    </div>

                    {/* Action Bar */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleStartFree}
                        className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                        <span>{hero.startFreeBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroVisualMode('live')}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{siteLang === 'ur' ? 'کاؤنٹر سافٹ ویئر دیکھیں' : siteLang === 'sd' ? 'سافٽ ويئر ڏسو' : 'View Live POS'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── TAB 2: SIMULATED BUSINESS DASHBOARD FRAME ── */
                  <div className="bg-white rounded-xl p-4 sm:p-5 space-y-4 text-slate-900">
                    {/* Shop signboard bar */}
                    <div className="bg-[#0a3a2d] text-white p-3.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-emerald-400 flex items-center justify-center text-slate-950 font-black text-lg shrink-0">
                          A
                        </div>
                        <div>
                          <div className="font-extrabold text-sm sm:text-base leading-none text-white">
                            مدینہ کریانہ اینڈ جنرل سٹور
                          </div>
                          <div className="text-[10px] text-emerald-200 mt-1">
                            پروفیشنل ڈیجیٹل کھاتہ و بلنگ
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-1 rounded-md font-bold border border-emerald-700">
                        آن لائن / محفوظ
                      </span>
                    </div>

                    {/* Real-time stats row */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">آج کی کل سیل (Sales)</span>
                        <div className="text-xl sm:text-2xl font-black text-emerald-900 mt-0.5">Rs. 48,250</div>
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                          <TrendingUp className="w-3 h-3" />
                          <span>خالص منافع: 18.5%</span>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <span className="text-[10px] font-bold text-amber-700 uppercase">کسٹمر ادھار (Udhaar Khata)</span>
                        <div className="text-xl sm:text-2xl font-black text-amber-900 mt-0.5">Rs. 14,800</div>
                        <div className="text-[10px] text-amber-700 flex items-center gap-1 mt-1 font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>3 وصولیاں باقی ہیں</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Munshi Voice Preview Bar */}
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-xl p-3.5 space-y-2 border border-purple-400/40 shadow-inner">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold flex items-center gap-1.5 text-amber-300">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span>AI منشی (Operational Assistant)</span>
                        </span>
                        <span className="text-[10px] bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full font-bold">
                          اردو / سنڌي وائس
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2 text-xs font-semibold text-purple-100 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                        <span>"علی کریانہ اسٹور کا کھاتہ دکھاؤ اور 1500 وصولی لکھو"</span>
                      </div>
                      <div className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>کھاتہ کھول دیا گیا، واؤچر تیار ہے۔ تصدیق کا انتظار...</span>
                      </div>
                    </div>

                    {/* Action buttons inside live preview */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-extrabold text-center">
                      <button
                        type="button"
                        onClick={handleStartFree}
                        className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                      >
                        🧾 نیا بل (5 سیکنڈ)
                      </button>
                      <button
                        type="button"
                        onClick={handleStartFree}
                        className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                      >
                        📷 پرچی اسکین
                      </button>
                      <button
                        type="button"
                        onClick={handleStartFree}
                        className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                      >
                        📖 کسٹمر کھاتہ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "WHY ASANIBIZ?" & 3-STAGE BUSINESS EVOLUTION
      ───────────────────────────────────────────────────────────── */}
      <section id="why-asanibiz" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0a462b] text-xs font-black">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>{evolution.sectionTag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
            {evolution.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {evolution.subtitle}
          </p>
        </div>

        {/* 3 Evolutionary Stages */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {evolution.stages.map((stage, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {stage.badge}
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${stage.statusColor}`}>
                    {stage.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {stage.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  {stage.desc}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-bold text-slate-700">
                {stage.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core Value Statement Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0a2e2a] to-[#0f4941] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {nav.notJustBillingTitle}
            </h3>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              {nav.notJustBillingDesc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartFree}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <span>{hero.startFreeBtn}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CORE FEATURES & ADVANCED BUSINESS TOOLS
      ───────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0a462b] text-xs font-black">
              <Boxes className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {nav.featuresBadge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
              {nav.featuresHeading}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {nav.featuresSubheading}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFeaturesCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                featuresCategory === 'all'
                  ? 'bg-[#0a2e2a] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {nav.allTools}
            </button>
            <button
              type="button"
              onClick={() => setFeaturesCategory('core')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                featuresCategory === 'core'
                  ? 'bg-[#0a2e2a] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {nav.dailyMgmt}
            </button>
            <button
              type="button"
              onClick={() => setFeaturesCategory('advanced')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                featuresCategory === 'advanced'
                  ? 'bg-[#0a2e2a] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {nav.advancedAi}
            </button>
          </div>

          {/* Features Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feat) => {
              return (
                <div
                  key={feat.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                        {feat.id === 'khata_udhaar' && <BookOpen className="w-5 h-5" />}
                        {feat.id === 'fast_pos_billing' && <Receipt className="w-5 h-5" />}
                        {feat.id === 'stock_inventory' && <Boxes className="w-5 h-5" />}
                        {feat.id === 'cash_bank_wallets' && <Coins className="w-5 h-5" />}
                        {feat.id === 'expenses_tracking' && <TrendingDown className="w-5 h-5" />}
                        {feat.id === 'profit_reports' && <BarChart3 className="w-5 h-5" />}
                        {feat.id === 'ai_munshi_smart' && <Sparkles className="w-5 h-5 text-purple-600" />}
                        {feat.id === 'parchi_camera_ai' && <Camera className="w-5 h-5 text-indigo-600" />}
                        {feat.id === 'whatsapp_workflow' && <Share2 className="w-5 h-5 text-emerald-600" />}
                        {feat.id === 'mandi_commission' && <Scale className="w-5 h-5" />}
                        {feat.id === 'transport_cargo' && <Truck className="w-5 h-5" />}
                        {feat.id === 'staff_counter_lock' && <Lock className="w-5 h-5 text-amber-600" />}
                      </div>
                      {feat.badge && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {feat.badge?.[effectiveLang] || feat.badge?.['ur'] || ''}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {feat.title?.[effectiveLang] || feat.title?.['ur'] || ''}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {feat.desc?.[effectiveLang] || feat.desc?.['ur'] || ''}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-800">
                    <span>{nav.activeInSystem}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SMART AI SECTION ("AI Samjhay — AsaniBiz Ka Software Kaam Kare")
      ───────────────────────────────────────────────────────────── */}
      <section id="smart-ai" className="py-16 sm:py-24 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900 text-white relative overflow-hidden">
        {/* Glow background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{aiContent.sectionTag}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {aiContent.title}
            </h2>

            <p className="text-lg sm:text-xl font-extrabold text-amber-300">
              {aiContent.concept}
            </p>

            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed">
              {aiContent.description}
            </p>
          </div>

          {/* 3 Action Principles */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiContent.actionPrinciples.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-purple-400/20 space-y-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300 font-black text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Prompts Showcase */}
          <div className="mt-12 bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-purple-400/30">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                {siteLang === 'ur' && 'حقیقی کاروباری مثالیں — سنیں یا پڑھیں کہ AI کیسے کام کرتا ہے:'}
                {siteLang === 'sd' && 'حقيقي ڪاروباري مثال — AI ڪيئن عملي ڪم ڪري ٿو:'}
                {siteLang === 'en' && 'Real Operational Prompts — How AI Munshi Drives Real Software Actions:'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left: Prompt buttons */}
              <div className="space-y-3">
                {aiContent.samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPromptIdx(idx)}
                    className={`w-full text-start p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedPromptIdx === idx
                        ? 'bg-purple-600/30 border-purple-400 shadow-md text-white'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      <span>{p.speaker}</span>
                    </div>
                    <div className="text-sm font-extrabold">
                      {p.text}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: Software Action Preview Box */}
              <div className="bg-slate-900/90 rounded-2xl p-6 border border-emerald-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-emerald-400">
                      {aiContent.samplePrompts[selectedPromptIdx]?.actionTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    حقیقی کارروائی
                  </span>
                </div>

                <div className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
                  {aiContent.samplePrompts[selectedPromptIdx]?.actionDesc}
                </div>

                <div className="bg-emerald-950/60 border border-emerald-600/40 rounded-xl p-3.5 text-xs text-emerald-200 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>مالک کی تصدیق کا کنٹرول</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90">
                    کوئی بھی ادھار یا خرچ دکاندار کی اسکرین پر حتمی منظوری کے بغیر محفوظ نہیں ہوتا۔
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTryAIMunshi}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{siteLang === 'ur' ? 'ابھی AI منشی آزمائیں' : siteLang === 'sd' ? 'هاڻي AI منشي آزمايو' : 'Try Operational AI Munshi'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SMART PARCHI CAMERA + AI SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="parchi-camera" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black">
            <Camera className="w-3.5 h-3.5 text-indigo-700" />
            <span>{parchiContent.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
            {parchiContent.title}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {parchiContent.subtitle}
          </p>

          <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-3 text-xs sm:text-sm font-bold inline-block max-w-2xl">
            {parchiContent.trustNotice}
          </div>
        </div>

        {/* 4 Steps Workflow */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {parchiContent.steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3 relative"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center justify-center font-black text-lg">
                {s.step}
              </div>
              <h3 className="text-base font-black text-slate-900">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Proof Box */}
        <div className="mt-10 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                موبائل کیمرہ و گیلری انٹیگریشن
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                {siteLang === 'ur' && 'ہاتھ کی لکھی پرچی سے لائیو ڈیجیٹل اسٹاک تک'}
                {siteLang === 'sd' && 'هٿ سان لکيل پرچي مان سڌو اسٽاڪ ۾'}
                {siteLang === 'en' && 'From Paper Sourcing Slip into Audited Inventory'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {siteLang === 'ur' && 'سپلائر بل کی تصویر کھینچیں۔ اے آئی تصویر میں سے آئٹمز کے نام، کوانٹٹی اور ریٹ کو الگ الگ ٹیبل میں دکھائے گا۔ آپ چیک کر کے "محفوظ کریں" دبائیں، سارا مال اسٹاک اور کھاتے میں اپ ڈیٹ ہو جائے گا۔'}
                {siteLang === 'sd' && 'سپلائر جي بل جي تصوير ڪڍو۔ AI سامان جو نالو، اگهه ۽ تعداد پڙهي ڏيکاريندو۔ اوهان چيڪ ڪري سيو ڪريو، سڀ اسٽاڪ ۽ کاتي ۾ شامل ٿي ويندو.'}
                {siteLang === 'en' && 'Snap paper parchis directly on your mobile. The AI presents the parsed items alongside your photo. Confirm with one click and your inventory updates seamlessly.'}
              </p>
            </div>

            <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-700 font-bold">
                <span>سودا سلف (Item)</span>
                <span>تعداد (Qty)</span>
                <span>ریٹ (Rate)</span>
                <span>ٹوٹل (Total)</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-semibold">
                <span>باسمتی چاول</span>
                <span>5 بوری</span>
                <span>Rs. 7,200</span>
                <span>Rs. 36,000</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-semibold">
                <span>حبیب کوکنگ آئل</span>
                <span>12 پیٹی</span>
                <span>Rs. 5,400</span>
                <span>Rs. 64,800</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-semibold">
                <span>چینی اول</span>
                <span>10 بوری</span>
                <span>Rs. 6,800</span>
                <span>Rs. 68,000</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between font-black text-sm text-amber-300">
                <span>کل خریداری بل:</span>
                <span>Rs. 168,800</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. WHATSAPP WORKFLOW SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="whatsapp-workflow" className="py-16 sm:py-24 bg-emerald-950 text-white border-y border-emerald-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-black border border-emerald-600">
              <Share2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>{whatsappContent.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {whatsappContent.title}
            </h2>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              {whatsappContent.subtitle}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatsappContent.benefits.map((b, idx) => (
              <div
                key={idx}
                className="bg-emerald-900/60 rounded-3xl p-6 border border-emerald-700/50 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 font-black">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. SUPPORTED BUSINESS PROFILES SECTION (18+ Types)
      ───────────────────────────────────────────────────────────── */}
      <section id="business-types" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0a462b] text-xs font-black">
            <Store className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {siteLang === 'ur' ? '18+ کاروباری شعبے' : siteLang === 'sd' ? '18+ ڪاروبار جا قسم' : '18+ Business Profiles'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
            {siteLang === 'ur' && 'ہر کاروبار کے لیے اس کی ضروریات کے مطابق خصوصی ٹولز'}
            {siteLang === 'sd' && 'هر ڪاروبار لاءِ ان جي ضرورت مطابق تيار ٿيل'}
            {siteLang === 'en' && 'Customized Specialized Tools for 18+ Business Types'}
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            {siteLang === 'ur' && 'کریانہ، کپڑے، موبائل، میڈیکل، سبزی، گوشت، منڈی یا ہوٹل — AsaniBiz آپ کے کاروبار کی زبان اور یونٹ سمجھتا ہے۔'}
            {siteLang === 'sd' && 'ڪريانا، ڪپڙا، موبائل، دوائون، ميوو يا منڊي — AsaniBiz هر ڪاروبار جي ماپ ۽ بلنگ ڄاڻي ٿو.'}
            {siteLang === 'en' && 'Whether you track items by weight, IMEI, color/size variants, or commission, AsaniBiz adapts instantly.'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: { ur: 'تمام کاروبار (All)', sd: 'سمورا', en: 'All 18+ Sectors' } },
            { id: 'retail', label: { ur: 'ریٹیل و کریانہ', sd: 'ڪريانا ۽ ريٽيل', en: 'Retail & Grocery' } },
            { id: 'food', label: { ur: 'فوڈ، گوشت و ڈیری', sd: 'کاڌو ۽ کير', en: 'Food, Meat & Dairy' } },
            { id: 'fashion', label: { ur: 'کپڑے، جوتے و فیشن', sd: 'ڪپڙا ۽ بوٽ', en: 'Fashion & Shoes' } },
            { id: 'trade', label: { ur: 'منڈی، آڑھت و ہول سیل', sd: 'منڊي ۽ هول سيل', en: 'Mandi & Wholesale' } },
            { id: 'services', label: { ur: 'موبائل، سروسز و سیلون', sd: 'موبائل ۽ سروسز', en: 'Mobile & Services' } },
            { id: 'logistics', label: { ur: 'ٹرانسپورٹ و کارگو', sd: 'ٽرانسپورٽ', en: 'Transport & Fleet' } },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#0a2e2a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              {cat.label[siteLang]}
            </button>
          ))}
        </div>

        {/* Business Profiles Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {b.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {b.name[siteLang]}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {b.tagline[siteLang]}
                  </p>
                </div>

                {/* Key Tools specific to this business */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {siteLang === 'ur' ? 'خصوصی ٹولز:' : siteLang === 'sd' ? 'خاص اوزار:' : 'Tailored Tools:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {b.keyTools[siteLang].map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                      >
                        ✓ {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartFree}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{siteLang === 'ur' ? 'اس کاروبار کے لیے شروع کریں' : siteLang === 'sd' ? 'هي ڪاروبار چونڊيو' : 'Choose This Profile'}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. HOW IT WORKS (5 SIMPLE STEPS)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0a462b] text-xs font-black">
              <Zap className="w-3.5 h-3.5 text-emerald-700" />
              <span>{howItWorks.sectionTag}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
              {howItWorks.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {howItWorks.subtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
            {howItWorks.steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3 relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-black text-emerald-700 mb-2">
                    {step.num}
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-tight mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="w-full h-1 bg-emerald-100 rounded-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. TRUST, SECURITY & DATA OWNERSHIP
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0a462b] text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{trust.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
            {trust.title}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {trust.subtitle}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trust.cards.map((c, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {c.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. PRICING SECTION (Starter Plan: PKR 699 Launch / PKR 999 Reg)
      ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-b from-slate-100 to-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0a462b] text-xs font-black">
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              <span>{pricing.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
              {pricing.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {pricing.subtitle}
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-3xl border-2 border-[#0a2e2a] shadow-xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#00f2ad] text-[#0a2e2a] text-xs font-black px-5 py-2 rounded-bl-2xl uppercase tracking-wider">
              {pricing.card.trialPill}
            </div>

            {/* Title and Price Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 pb-8 border-b border-slate-200">
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black text-[#0a2e2a]">
                  {pricing.card.planName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-bold">
                  {pricing.card.tagline}
                </p>
              </div>

              {/* Price display */}
              <div className="text-start sm:text-end space-y-1">
                <div className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2.5 py-0.5 rounded-md">
                  {pricing.card.launchOfferLabel}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#0a2e2a]">
                  {pricing.card.launchPrice}
                </div>
                <div className="text-xs text-slate-500 font-bold">
                  {pricing.card.launchPriceSub}
                </div>
                <div className="text-[11px] text-slate-400">
                  (باقاعدہ فیس: {pricing.card.regularPrice} / ماہانہ)
                </div>
              </div>
            </div>

            {/* Trial notification banner */}
            <div className="my-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm font-bold text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{pricing.card.freeTrialSummary}</span>
            </div>

            {/* Feature checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-4">
              {pricing.card.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-8 border-t border-slate-200 space-y-3">
              <button
                id="pricing-start-free-btn"
                type="button"
                onClick={handleStartFree}
                className="w-full py-4 rounded-2xl bg-[#0a2e2a] hover:bg-[#0e3f39] text-white font-black text-base shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>{pricing.card.ctaText}</span>
                <ArrowRight className={`w-5 h-5 text-emerald-400 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              <p className="text-center text-xs text-slate-500 font-medium">
                {pricing.card.guarantee}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. INTERACTIVE FAQ SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0a462b] text-xs font-black">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>{siteLang === 'ur' ? 'سوالات و جوابات' : siteLang === 'sd' ? 'سوال ۽ جواب' : 'Got Questions?'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a2e2a] tracking-tight">
            {siteLang === 'ur' && 'اکثر پوچھے جانے والے سوالات'}
            {siteLang === 'sd' && 'اڪثر پڇيا ويندڙ سوال'}
            {siteLang === 'en' && 'Frequently Asked Questions'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {siteLang === 'ur' && 'پاکستانی دکانداروں کے تمام سوالات کے واضح اور مستند جوابات'}
            {siteLang === 'sd' && 'دڪاندارن لاءِ سڀني سوالن جا چٽا جواب'}
            {siteLang === 'en' && 'Clear, authentic answers about our software, pricing, and AI capabilities.'}
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-start gap-4 font-black text-sm sm:text-base text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{item.q[siteLang]}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a[siteLang]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          14. FINAL HERO REINFORCEMENT & HIGH-CONVERTING CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0a2e2a] via-[#0d3d36] to-[#0a221f] text-white py-16 sm:py-24 px-4 text-center relative overflow-hidden border-t border-emerald-900">
        <div className="max-w-3xl mx-auto space-y-6 relative">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 p-2 mx-auto flex items-center justify-center border border-emerald-400/40">
            <img src="/icon.svg" alt="AsaniBiz" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {hero.mainHero}
            </h2>
            <p className="text-lg sm:text-2xl font-extrabold text-emerald-300">
              {hero.supporting}
            </p>
            <div className="text-sm font-bold text-purple-200 bg-purple-900/50 inline-block px-3 py-1 rounded-lg border border-purple-400/40">
              {hero.brandDesc}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl mx-auto">
            {siteLang === 'ur' && 'آج ہی اپنے کاروبار کو روایتی پریشانیوں سے آزاد کر کے ایک منظم اور کامیاب ادارہ بنائیں۔'}
            {siteLang === 'sd' && 'اڄ ئي پنهنجي ڪاروبار کي روايتي پريشانين مان ڪڍي ڪامياب بڻايو.'}
            {siteLang === 'en' && 'Transform your everyday operations into an organized, profitable enterprise today.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="final-cta-start-free-btn"
              type="button"
              onClick={handleStartFree}
              className="w-full sm:w-auto px-8 py-4 bg-[#00f2ad] hover:bg-[#00df9e] text-slate-950 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-emerald-400/20 transition-all cursor-pointer active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{hero.startFreeBtn}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            <button
              id="final-cta-login-btn"
              type="button"
              onClick={handleOpenApp}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm sm:text-base border border-white/20 transition-colors cursor-pointer"
            >
              {hero.loginBtn}
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          15. PROFESSIONAL SAAS FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0a462b] p-1 flex items-center justify-center shrink-0">
                <img src="/icon.svg" alt="AsaniBiz" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">AsaniBiz</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {hero.brandDesc}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold">
              “{hero.tagline}”
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider block">
              {nav.footerPlatform}
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">ڈیجیٹل کھاتہ و ادھار (Khata)</a></li>
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">پی او ایس کاؤنٹر بلنگ (POS)</a></li>
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">اسٹاک و انوینٹری کنٹرول</a></li>
              <li><a href="#smart-ai" className="hover:text-emerald-400 transition-colors">اے آئی منشی وائس اسسٹنٹ</a></li>
              <li><a href="#parchi-camera" className="hover:text-emerald-400 transition-colors">سمارٹ پرچی کیمرہ اسکینر</a></li>
              <li><a href="#whatsapp-workflow" className="hover:text-emerald-400 transition-colors">واٹس ایپ رسید و شیئرنگ</a></li>
            </ul>
          </div>

          {/* Business Sectors */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider block">
              {nav.footerBusinessTypes}
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#business-types" className="hover:text-emerald-400 transition-colors">کریانہ و جنرل سٹور</a></li>
              <li><a href="#business-types" className="hover:text-emerald-400 transition-colors">سبزی، فروٹ و منڈی</a></li>
              <li><a href="#business-types" className="hover:text-emerald-400 transition-colors">کپڑے، جوتے و گارمنٹس</a></li>
              <li><a href="#business-types" className="hover:text-emerald-400 transition-colors">موبائل شاپ و ریپیرنگ</a></li>
              <li><a href="#business-types" className="hover:text-emerald-400 transition-colors">فارمیسی و میڈیکل سٹور</a></li>
              <li><a href="#business-types" className="hover:text-emerald-400 transition-colors">ٹرانسپورٹ و گڈز فارورڈنگ</a></li>
            </ul>
          </div>

          {/* Quick Access & Admin */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider block">
              {nav.footerAccount}
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleStartFree}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                {hero.startFreeBtn}
              </button>
              <button
                type="button"
                onClick={handleOpenApp}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                {hero.loginBtn}
              </button>
              <button
                id="footer-admin-portal-link"
                type="button"
                onClick={() => setActiveView('admin')}
                className="w-full py-2 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-xl font-bold text-xs border border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ایڈمن پورٹل (Admin Portal)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} AsaniBiz. {nav.rightsReserved} “AsaniBiz — Jis karobar mein aasani hai, usmein barkat aur sukoon wasee hai.”
          </div>
          <div className="flex items-center gap-4 font-bold">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {legal?.privacyTitle || (siteLang === 'en' ? 'Privacy Policy' : 'پرائیویسی پالیسی')}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {legal?.termsTitle || (siteLang === 'en' ? 'Terms of Service' : 'شرائط و ضوابط')}
            </button>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          16. PRIVACY & TERMS LEGAL MODAL
      ───────────────────────────────────────────────────────────── */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl text-slate-900 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-[#0a2e2a]">
                {legalModal === 'privacy' 
                  ? (legal?.privacyTitle || (siteLang === 'en' ? 'Privacy Policy' : 'پرائیویسی پالیسی'))
                  : (legal?.termsTitle || (siteLang === 'en' ? 'Terms of Service' : 'شرائط و ضوابط'))}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              {((legalModal === 'privacy' ? legal?.privacySections : legal?.termsSections) || []).map((sec, pIdx) => (
                <div key={pIdx} className="space-y-1">
                  <h4 className="font-bold text-slate-900">{sec?.title}</h4>
                  <p className="text-slate-600">{sec?.desc}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="w-full py-2.5 bg-[#0a2e2a] text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              {legal?.closeBtn || (siteLang === 'en' ? 'Close' : 'بند کریں (Close)')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
