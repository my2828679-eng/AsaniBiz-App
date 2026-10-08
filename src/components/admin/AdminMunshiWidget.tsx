import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useBusiness } from '../../context/BusinessContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { AdminTab } from './AdminSidebar';
import { LanguageCode } from '../../types';

interface AdminMunshiWidgetProps {
  onNavigateTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const AdminMunshiWidget: React.FC<AdminMunshiWidgetProps> = ({
  onNavigateTab,
  isOpen,
  onToggleOpen,
}) => {
  const { profile } = useBusiness();
  const { adminMunshiMessages, queryAdminMunshi, clearAdminMunshiChat } = useAdmin();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const lang = (profile.preferredLanguage || 'ur') as LanguageCode;

  // Voice Assistant Hook
  const handleSpeechResult = (spokenText: string) => {
    if (spokenText.trim()) {
      handleSend(spokenText.trim());
    }
  };

  const {
    isListening,
    transcript,
    supported: voiceSupported,
    startListening,
    stopListening,
    speakText,
  } = useVoiceAssistant(lang, handleSpeechResult);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [adminMunshiMessages, isOpen, isProcessing]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    setInputText('');
    setIsProcessing(true);

    try {
      const response = await queryAdminMunshi(text, lang);
      if (response && response.speechText && voiceEnabled) {
        speakText(response.speechText, lang);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const quickPrompts = [
    { label: '💰 آج AI کا خرچہ', query: 'آج AI کا کتنا خرچہ ہوا؟' },
    { label: '🗄️ Supabase اسٹوریج', query: 'Supabase storage kitni bhar gayi?' },
    { label: '⚡ Vercel لمٹ باقی', query: 'Vercel limit kitni baqi hai?' },
    { label: '🏆 ٹاپ AI کسٹمر', query: 'Sab customers mein sab se zyada AI kis ne use ki?' },
    { label: '📊 ریونیو و خالص بچت', query: 'Is mahine revenue aur total cost batao.' },
    { label: '⚠️ کس سروس کی لمٹ قریب ہے؟', query: 'Kis service ki limit qareeb hai?' },
  ];

  return (
    <>
      {/* Floating Minimized Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 end-6 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleOpen}
            className="group px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0a5e54] to-[#0d7668] text-white font-bold shadow-xl shadow-[#0a5e54]/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-[#00f2ad]/40 cursor-pointer"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#00f2ad] text-[#0a2e2a] flex items-center justify-center font-black shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -end-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
            </div>

            <div className="text-start">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">ایڈمن منشی</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-[#00f2ad]/30 text-[#00f2ad]">
                  AI Executive
                </span>
              </div>
              <p className="text-[11px] text-white/75">انفراسٹرکچر و ریونیو اسسٹنٹ</p>
            </div>

            <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <ChevronUp className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Expanded Admin Munshi Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-y-0 end-0 w-full sm:w-[460px] bg-white shadow-2xl z-50 flex flex-col border-s border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#0a3832] to-[#0a5e54] text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00f2ad] text-[#0a2e2a] flex items-center justify-center font-black shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black tracking-tight">ایڈمن منشی (Admin Munshi)</h2>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 text-[#00f2ad] border border-[#00f2ad]/30">
                    لائیو مانیٹر
                  </span>
                </div>
                <p className="text-xs text-white/70">ورسِل، سوپابیس، جیمنائی و فنانشل کمانڈ اسسٹنٹ</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice playback toggle */}
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'آواز بند کریں' : 'آواز کھولیں'}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  voiceEnabled ? 'bg-white/15 text-[#00f2ad]' : 'bg-white/5 text-white/50'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset chat */}
              <button
                type="button"
                onClick={clearAdminMunshiChat}
                title="چیٹ صاف کریں"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Drawer */}
              <button
                type="button"
                onClick={onToggleOpen}
                className="p-2 rounded-lg bg-white/10 hover:bg-rose-500/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Questions Horizon Chips */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
            <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0a5e54]" />
              <span>فوری سوالات (کلک کریں یا بولیں):</span>
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p.query)}
                  disabled={isProcessing}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#00f2ad]/15 text-slate-700 hover:text-[#0a5e54] text-xs font-medium border border-slate-200 hover:border-[#00f2ad]/50 transition-all cursor-pointer text-start shadow-2xs"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50">
            {adminMunshiMessages.map((msg) => {
              const isMunshi = msg.sender === 'admin_munshi';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMunshi ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      {isMunshi ? 'ایڈمن منشی' : 'ایڈمنسٹریٹر'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMunshi
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        : 'bg-[#0a5e54] text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Referenced Metrics Cards */}
                    {isMunshi && msg.referencedMetrics && msg.referencedMetrics.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                        {msg.referencedMetrics.map((rm, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 text-[11px]"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                              <span>{rm.label}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  rm.percentage >= 90
                                    ? 'bg-rose-100 text-rose-800'
                                    : rm.percentage >= 75
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {rm.percentage}%
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-500">
                              <div>
                                <span className="block text-slate-400">استعمال (Used):</span>
                                <span className="font-bold text-slate-800">{rm.used}</span>
                              </div>
                              <div>
                                <span className="block text-slate-400">لمٹ (Limit):</span>
                                <span className="font-bold text-slate-800">{rm.limit}</span>
                              </div>
                              <div>
                                <span className="block text-slate-400">باقی (Remaining):</span>
                                <span className="font-bold text-emerald-600">{rm.remaining}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Section Navigation Button */}
                    {isMunshi && msg.actionRoute && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">تجویز کردہ صفحہ:</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (msg.actionRoute?.tab) {
                              onNavigateTab(msg.actionRoute.tab as AdminTab);
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-[#00f2ad]/20 hover:bg-[#00f2ad]/40 text-[#0a5e54] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{msg.actionRoute.labelUrdu}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Audio playback button on message */}
                    {isMunshi && (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => speakText(msg.speechText || msg.text, lang)}
                          className="text-[10px] text-slate-400 hover:text-[#0a5e54] flex items-center gap-1 transition-colors cursor-pointer"
                          title="سنیں"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>دوبارہ سنیں</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 w-fit animate-pulse">
                <Bot className="w-4 h-4 text-[#0a5e54] animate-spin" />
                <span>منشی ڈیٹا بیس اور میٹرکس کی جانچ کر رہا ہے...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Active Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-pulse shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold">منشی سن رہا ہے... بولیں</span>
              </div>
              <span className="text-[11px] text-emerald-600 truncate max-w-[200px]">
                {transcript || 'کچھ کہیے...'}
              </span>
            </div>
          )}

          {/* Bottom Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Mic Button */}
              {voiceSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm ${
                    isListening
                      ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                      : 'bg-[#00f2ad]/20 text-[#0a5e54] hover:bg-[#00f2ad]/35'
                  }`}
                  title={isListening ? 'مائیک بند کریں' : 'آواز سے بولیں'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="ایڈمن منشی سے پوچھیں (مثلاً: آج AI کا کتنا خرچہ ہوا؟)..."
                disabled={isProcessing}
                className="flex-1 bg-slate-100 border border-slate-200 focus:border-[#0a5e54] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0a5e54]"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="w-11 h-11 rounded-xl bg-[#0a5e54] hover:bg-[#0d7668] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md"
                title="بھیجیں"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>اردو، سندھی، پنجابی، پشتو اور انگلش سپورٹ</span>
              <span>100% محفوظ ریئل ٹائم لوکل کمپیوٹیشن</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
