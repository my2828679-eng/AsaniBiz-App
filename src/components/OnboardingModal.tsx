import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Phone,
  Globe,
  Briefcase,
  Sparkles,
  Mic,
  MicOff,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  HelpCircle,
  Store,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { BusinessTypeId, LanguageCode } from '../types';
import {
  mapBusinessDescription,
  BusinessMappingResult,
  getRecommendedToolsForProfile
} from '../services/businessMappingEngine';
import { BUSINESS_TYPES } from '../config/businessTypes';
import { BUSINESS_THEMES } from '../config/businessDashboardConfig';

interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  description: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', description: 'قومی زبان — مکمل رہنمائی و حساب کتاب' },
  { code: 'sd', nativeName: 'سنڌي', englishName: 'Sindhi', description: 'سنڌي ٻولي — سڀئي ڪاروباري اوزار' },
  { code: 'en', nativeName: 'English', englishName: 'English', description: 'Standard business terms & reports' },
  { code: 'pa', nativeName: 'پنجابی', englishName: 'Punjabi', description: 'پنجابی بولی — سوکھا کاروباری حساب' },
  { code: 'ps', nativeName: 'پښتو', englishName: 'Pashto', description: 'پښتو ژبه — آسانه او چټک حسابونه' },
];

export const OnboardingModal: React.FC = () => {
  const {
    profile,
    updateProfile,
    isOnboardingOpen,
    setIsOnboardingOpen,
    setActiveView
  } = useBusiness();

  // 1 = Name, 2 = Mobile, 3 = Language, 4 = Karobar, 5 = Personalized Dashboard Ready
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form States
  const [ownerName, setOwnerName] = useState(profile.ownerName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phone || '');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(profile.preferredLanguage || 'ur');
  const [businessDesc, setBusinessDesc] = useState(profile.businessDescription || '');
  const [mappingResult, setMappingResult] = useState<BusinessMappingResult>(() =>
    mapBusinessDescription(profile.businessDescription || 'kiryana', profile.preferredLanguage || 'ur')
  );
  const [clarificationChoice, setClarificationChoice] = useState<'retail' | 'wholesale' | 'both' | 'service'>(
    profile.tradeMode || 'retail'
  );

  // Errors & Validations
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Voice Input State (Hands-free is OFF by default)
  const [isListening, setIsListening] = useState(false);
  const [listeningField, setListeningField] = useState<'name' | 'phone' | 'business' | null>(null);
  const recognitionRef = useRef<any>(null);

  // Real-time local business mapping (Zero-token deterministic calculation)
  useEffect(() => {
    if (businessDesc.trim()) {
      const result = mapBusinessDescription(businessDesc, selectedLanguage);
      setMappingResult(result);
      if (result.tradeMode) {
        setClarificationChoice(result.tradeMode);
      }
    }
  }, [businessDesc, selectedLanguage]);

  // Clean Voice Speech Recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      // Select speech recognition language
      if (selectedLanguage === 'sd') rec.lang = 'sd-PK';
      else if (selectedLanguage === 'ps') rec.lang = 'ps-AF';
      else if (selectedLanguage === 'pa') rec.lang = 'pa-PK';
      else if (selectedLanguage === 'en') rec.lang = 'en-PK';
      else rec.lang = 'ur-PK';

      rec.onresult = (event: any) => {
        const speechText = event.results[0]?.[0]?.transcript || '';
        if (speechText.trim()) {
          handleVoiceInputReceived(speechText.trim());
        }
        setIsListening(false);
        setListeningField(null);
      };

      rec.onerror = () => {
        setIsListening(false);
        setListeningField(null);
      };

      rec.onend = () => {
        setIsListening(false);
        setListeningField(null);
      };

      recognitionRef.current = rec;
    } catch {
      // Ignore if recognition not available
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [selectedLanguage, listeningField]);

  const startVoiceInput = (field: 'name' | 'phone' | 'business') => {
    if (!recognitionRef.current) {
      alert('براہ کرم مائیکروفون سپورٹ کے لیے گوگل کروم یا جدید براؤزر استعمال کریں۔');
      return;
    }

    try {
      setListeningField(field);
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e) {
      setIsListening(false);
      setListeningField(null);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setListeningField(null);
  };

  const handleVoiceInputReceived = (text: string) => {
    if (listeningField === 'name') {
      // Remove any prefix like "mera naam hai"
      const cleanName = text.replace(/^(mera naam|my name is|زه|میرا نام|منهنجو نالو)\s+/i, '');
      setOwnerName(cleanName);
      setNameError(null);
    } else if (listeningField === 'phone') {
      // Convert spoken digits to phone number
      const digitsOnly = text.replace(/[^\d]/g, '');
      if (digitsOnly.length >= 7) {
        setPhoneNumber(digitsOnly);
        setPhoneError(null);
      } else {
        setPhoneNumber(text);
      }
    } else if (listeningField === 'business') {
      setBusinessDesc(text);
    }
  };

  if (!isOnboardingOpen) return null;

  // Validation Helpers (Pure software logic, Zero Gemini API cost)
  const validateStep1 = (): boolean => {
    if (!ownerName.trim()) {
      setNameError(selectedLanguage === 'ur' ? 'براہ کرم اپنا نام درج کریں' : 'Please enter your name');
      return false;
    }
    setNameError(null);
    return true;
  };

  const validateStep2 = (): boolean => {
    const clean = phoneNumber.trim().replace(/[-\s+]/g, '');
    if (!clean) {
      setPhoneError(selectedLanguage === 'ur' ? 'موبائل نمبر درج کرنا ضروری ہے' : 'Mobile number is required');
      return false;
    }
    // Check reasonable phone length (10 to 14 digits)
    if (clean.length < 10 || clean.length > 14 || !/^\d+$/.test(clean)) {
      setPhoneError(
        selectedLanguage === 'ur'
          ? 'درست موبائل نمبر درج کریں (مثلاً: 0300-1234567)'
          : 'Please enter a valid mobile number (e.g. 0300-1234567)'
      );
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleNextFromStep3 = () => {
    setStep(4);
  };

  const handleNextFromStep4 = () => {
    if (!businessDesc.trim()) {
      // Default to general grocery if skipped
      setBusinessDesc('کریانہ و جنرل اسٹور');
    }
    setStep(5);
  };

  // Complete Onboarding and Save all Profile Data
  const handleCompleteOnboarding = () => {
    const finalBusinessType: BusinessTypeId = mappingResult.businessType || 'kiryana';
    const finalTradeMode = clarificationChoice || mappingResult.tradeMode || 'retail';
    const finalRecommendedTools = getRecommendedToolsForProfile(finalBusinessType, finalTradeMode);

    const bConfig = BUSINESS_TYPES[finalBusinessType] || BUSINESS_TYPES.kiryana;
    const themeConfig = BUSINESS_THEMES[finalBusinessType] || BUSINESS_THEMES.kiryana;

    updateProfile({
      ownerName: ownerName.trim() || 'دوکاندار',
      phone: phoneNumber.trim(),
      preferredLanguage: selectedLanguage,
      businessType: finalBusinessType,
      businessDescription: businessDesc.trim(),
      tradeMode: finalTradeMode,
      themeColor: themeConfig.accentColor || '#0a5e54',
      businessName: profile.businessName || `${ownerName.trim()} ${bConfig.name[selectedLanguage] || 'اسٹور'}`,
      dashboardConfiguration: {
        recommendedTools: finalRecommendedTools,
        activeTools: finalRecommendedTools,
      },
      isOnboardingCompleted: true,
      welcomedAfterOnboarding: false, // Triggers warm local AI Munshi welcome
    });

    localStorage.setItem('asanibiz_onboarded_completed', 'true');
    setIsOnboardingOpen(false);
    setActiveView('dashboard');
  };

  return (
    <div
      id="zero-token-onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Top Gradient Header with Progress Bar */}
        <div className="bg-gradient-to-r from-[#052e16] via-[#083c1d] to-[#0f172a] text-white p-4 sm:p-5 relative border-b border-[#d4af37]/35">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-md shadow-black/50 bg-[#0f172a] p-0.5 shrink-0 flex items-center justify-center">
                <img src="/asanibiz-vip-lion-logo.jpg" alt="AsaniBiz VIP Lion" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#d4af37] font-serif">
                  ASANIBIZ VIP ONBOARDING
                </span>
                <h2 className="text-base sm:text-lg font-black font-arabic leading-tight text-white">
                  نئے گاہک و دکان کا فوری سیٹ اپ
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold bg-[#0f172a] px-2.5 py-1 rounded-full text-[#d4af37] border border-[#d4af37]/40 shadow-xs">
                مرحلہ {step} از 5
              </span>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="mt-3.5 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-[#d4af37]'
                    : s < step
                    ? 'w-4 bg-emerald-400'
                    : 'w-2 bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body: Pure Step-by-Step Flow */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800">
          {/* STEP 1: NAME */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300" id="onboarding-step-1">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 font-arabic uppercase tracking-wide">
                  مرحلہ 1 • ذاتی شناخت
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-arabic">
                  آپ کا نام کیا ہے؟
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  آپ کا نام بلوں، کھاتہ رسیدوں اور اے آئی منشی کی گفتگو میں بطور مالک ظاہر ہوگا۔
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 font-arabic flex items-center justify-between">
                  <span>مالک کا نام (Owner / Malik Name)</span>
                  <span className="text-[11px] text-slate-400">بولیں یا لکھیں</span>
                </label>

                <div className="relative flex items-center">
                  <input
                    id="input-onboarding-owner-name"
                    type="text"
                    value={ownerName}
                    onChange={(e) => {
                      setOwnerName(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNextFromStep1();
                    }}
                    placeholder="مثلاً: یاسین اختر / ملک طارق"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-arabic transition-all pl-12"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening && listeningField === 'name') stopVoiceInput();
                      else startVoiceInput('name');
                    }}
                    className={`absolute left-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                      isListening && listeningField === 'name'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                    }`}
                    title="بول کر نام درج کریں"
                  >
                    {isListening && listeningField === 'name' ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {nameError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 font-arabic mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{nameError}</span>
                  </p>
                )}

                {isListening && listeningField === 'name' && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs flex items-center gap-2 font-arabic animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span>سن رہا ہوں... اپنا نام بولیں (جیسے: محمد یاسین)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: MOBILE NUMBER */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300" id="onboarding-step-2">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 font-arabic uppercase tracking-wide">
                  مرحلہ 2 • سیکیورٹی و رابطہ
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-arabic">
                  آپ کا موبائل نمبر کیا ہے؟
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  یہ نمبر لاگ اِن، کھاتہ و واٹس ایپ رسید شیئرنگ اور سیکیورٹی بیک اپ کے لیے استعمال ہوگا۔
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 font-arabic flex items-center justify-between">
                  <span>موبائل نمبر (Mobile Phone Number)</span>
                  <span className="text-[11px] text-slate-400">پاکستانی فارمیٹ</span>
                </label>

                <div className="relative flex items-center">
                  <input
                    id="input-onboarding-phone-number"
                    type="tel"
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (phoneError) setPhoneError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNextFromStep2();
                    }}
                    placeholder="03001234567"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-mono transition-all pl-12 text-left"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening && listeningField === 'phone') stopVoiceInput();
                      else startVoiceInput('phone');
                    }}
                    className={`absolute left-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                      isListening && listeningField === 'phone'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                    }`}
                    title="بول کر نمبر درج کریں"
                  >
                    {isListening && listeningField === 'phone' ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {phoneError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 font-arabic mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{phoneError}</span>
                  </p>
                )}

                {isListening && listeningField === 'phone' && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs flex items-center gap-2 font-arabic animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span>سن رہا ہوں... نمبر کے ہندسے آرام سے بولیں</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-600 font-arabic">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  آپ کا نمبر سافٹ ویئر پروٹوکول کے ذریعے مقامی طور پر محفوظ کیا جاتا ہے اور کسی بیرونی سروس کو شیئر نہیں کیا جاتا۔
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERRED LANGUAGE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300" id="onboarding-step-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 font-arabic uppercase tracking-wide">
                  مرحلہ 3 • زبان کا انتخاب
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-arabic">
                  آپ کون سی زبان منتخب کرنا چاہتے ہیں؟
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  ڈیش بورڈ، رسیدیں اور اے آئی منشی کی آواز آپ کی منتخب کردہ زبان میں کام کرے گی۔
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      id={`lang-select-${lang.code}`}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer relative flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-arabic text-sm">
                            {lang.nativeName}
                          </span>
                          <span className="text-xs text-slate-400 font-sans">
                            ({lang.englishName})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-arabic">
                          {lang.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Roman Urdu Note */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900 font-arabic">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>رومن اردو (Roman Urdu) کی خودکار سمجھ:</strong> اگر آپ انگریزی حروف میں لکھیں یا بولیں (جیسے: "cheeni 2 kilo bechi") تو سسٹم خودکار طور پر سمجھ کر حساب کر لے گا۔
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: BUSINESS / KAROBAR QUESTION */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300" id="onboarding-step-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 font-arabic uppercase tracking-wide">
                  مرحلہ 4 • کاروبار کی نوعیت
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-arabic">
                  آپ کا کاروبار کیا ہے؟
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  آزادی سے بولیں یا لکھیں۔ مقامی تجزیاتی انجن خودکار طور پر آپ کے کاروبار کے موزوں اوزار ترتیب دے گا۔
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    id="input-onboarding-business-desc"
                    type="text"
                    value={businessDesc}
                    onChange={(e) => setBusinessDesc(e.target.value)}
                    placeholder="مثلاً: میری کریانہ کی دکان ہے / گارمنٹس ہول سیل / ہوٹل چلاتا ہوں"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-arabic transition-all pl-12"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening && listeningField === 'business') stopVoiceInput();
                      else startVoiceInput('business');
                    }}
                    className={`absolute left-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                      isListening && listeningField === 'business'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                    }`}
                    title="بول کر کاروبار بتائیں"
                  >
                    {isListening && listeningField === 'business' ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isListening && listeningField === 'business' && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs flex items-center gap-2 font-arabic animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span>سن رہا ہوں... اپنے کاروبار کے بارے میں بولیں</span>
                  </div>
                )}
              </div>

              {/* Real-time Deterministic Detection Result */}
              {mappingResult && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-arabic">
                      تشخیص شدہ کیٹیگری (Zero-Token Match):
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-arabic">
                      {mappingResult.matchedCategoryLabel[selectedLanguage] || mappingResult.matchedCategoryLabel.ur}
                    </span>
                  </div>

                  {/* Clarification prompt if retail vs wholesale was not specified */}
                  {mappingResult.clarificationRequired && (
                    <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-bold text-amber-900 font-arabic">
                        {mappingResult.clarificationQuestion?.[selectedLanguage] ||
                          'کیا آپ ریٹیل (پرچون) میں فروخت کرتے ہیں یا ہول سیل (تھوک)؟'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {mappingResult.clarificationOptions?.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setClarificationChoice(opt.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-arabic transition-all cursor-pointer ${
                              clarificationChoice === opt.id
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50'
                            }`}
                          >
                            {opt.label[selectedLanguage] || opt.label.ur}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Tools preview */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200/70">
                    <span className="text-[11px] font-bold text-slate-600 font-arabic">
                      خودکار طور پر ترجیحی اوزار ({mappingResult.recommendedTools.length} ٹولز):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mappingResult.recommendedTools.map((tId) => (
                        <span
                          key={tId}
                          className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-700"
                        >
                          {tId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: PERSONALIZED DASHBOARD READY */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-300" id="onboarding-step-5">
              <div className="text-center space-y-1.5 py-1">
                <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 font-arabic">
                  مبارک ہو، آپ کا ڈیش بورڈ تیار ہے!
                </h3>
                <p className="text-xs text-slate-500 font-arabic max-w-md mx-auto">
                  ہم نے آپ کے کاروبار کی معلومات کے مطابق ذاتی نوعیت کا ڈیش بورڈ تشکیل دیا ہے۔
                </p>
              </div>

              {/* Profile Overview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs font-arabic">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">مالک کا نام:</span>
                    <span className="font-bold text-slate-900 text-sm">{ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">موبائل نمبر:</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{phoneNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">منتخب زبان:</span>
                    <span className="font-bold text-emerald-700">
                      {LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage)?.nativeName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">کاروباری کیٹیگری:</span>
                    <span className="font-bold text-slate-900">
                      {mappingResult.matchedCategoryLabel[selectedLanguage] || mappingResult.matchedCategoryLabel.ur} ({clarificationChoice})
                    </span>
                  </div>
                </div>
              </div>

              {/* Tailored Tools Overview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 font-arabic">
                    فعال ترجیحی ٹولز (Personalized Active Tools):
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 font-arabic bg-emerald-50 px-2 py-0.5 rounded-full">
                    {mappingResult.recommendedTools.length} مخصوص ٹولز
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mappingResult.recommendedTools.map((toolId) => (
                    <div
                      key={toolId}
                      className="bg-white border border-slate-200 p-2.5 rounded-xl flex items-center gap-2 text-xs font-arabic"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800 truncate">{toolId}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 font-arabic text-center pt-1">
                  نوٹ: تمام دیگر ٹولز بھی "More Tools" یا AI Munshi کے ذریعے کسی بھی وقت دستیاب رہیں گے۔
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-[#0f172a] border-t border-[#d4af37]/30 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2.5 rounded-xl border border-[#d4af37]/40 hover:bg-[#052e16] text-[#d4af37] text-xs font-bold font-arabic flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0" />
              <span>پیچھے (Back)</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              id="btn-onboarding-next"
              onClick={() => {
                if (step === 1) handleNextFromStep1();
                else if (step === 2) handleNextFromStep2();
                else if (step === 3) handleNextFromStep3();
                else if (step === 4) handleNextFromStep4();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] hover:from-[#c59e2b] hover:to-[#966d0c] active:scale-95 text-[#052e16] text-xs font-black font-arabic flex items-center gap-2 shadow-md shadow-[#d4af37]/25 border border-[#f3e5ab] transition-all cursor-pointer"
            >
              <span>آگے بڑھیں (Continue)</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-onboarding-finish"
              onClick={handleCompleteOnboarding}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] hover:from-[#c59e2b] hover:to-[#966d0c] active:scale-95 text-[#052e16] text-xs font-black font-arabic flex items-center gap-2 shadow-lg shadow-[#d4af37]/35 border border-[#f3e5ab] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>کاروبار شروع کریں (Start Business)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
