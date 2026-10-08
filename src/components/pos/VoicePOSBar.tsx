import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Sparkles, Check, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { Product, Customer } from '../../types';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { parseVoicePOSCommand } from '../../utils/voicePOSParser';

interface VoicePOSBarProps {
  products: Product[];
  customers: Customer[];
  onAddProductToCart: (product: Product, quantity: number, unit?: string) => void;
  onSelectCustomer: (customer: Customer) => void;
  onSetPaymentMethod: (method: 'cash' | 'credit' | 'jazzcash' | 'easypaisa' | 'bank') => void;
  onExecuteFastCheckout: () => void;
  language: any;
  isOpen: boolean;
  onClose: () => void;
}

export const VoicePOSBar: React.FC<VoicePOSBarProps> = ({
  products,
  customers,
  onAddProductToCart,
  onSelectCustomer,
  onSetPaymentMethod,
  onExecuteFastCheckout,
  language,
  isOpen,
  onClose,
}) => {
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'warning' | 'info'>('info');

  const handleSpeechResult = useCallback(
    (spokenText: string) => {
      if (!spokenText.trim()) return;

      const result = parseVoicePOSCommand(spokenText, products, customers);
      setFeedback(result.feedback);
      setFeedbackType(result.feedbackType);

      if (result.action === 'checkout_cash') {
        onSetPaymentMethod('cash');
        setTimeout(() => {
          onExecuteFastCheckout();
          onClose();
        }, 600);
      } else if (result.action === 'set_payment_credit') {
        onSetPaymentMethod('credit');
      } else if (result.action === 'select_customer' && result.customer) {
        onSelectCustomer(result.customer);
      } else if (result.action === 'add_product' && result.product && result.quantity) {
        onAddProductToCart(result.product, result.quantity, result.unit);
      }
    },
    [products, customers, onAddProductToCart, onSelectCustomer, onSetPaymentMethod, onExecuteFastCheckout, onClose]
  );

  const {
    isListening,
    supported,
    permissionDenied,
    permissionMessage,
    startListening,
    stopListening,
    transcript,
    clearError,
  } = useVoiceAssistant(language || 'ur', handleSpeechResult);

  // Auto-attempt start when opened
  useEffect(() => {
    if (isOpen && supported && !isListening && !permissionDenied) {
      startListening();
    }
  }, [isOpen, supported]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 border border-slate-200 text-start space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl ${
                isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-arabic">
                آسانی وائس کاؤنٹر (Voice Counter)
              </h3>
              <p className="text-[11px] text-slate-500 font-arabic">
                اردو، پنجابی، سندھی، پشتو میں بول کر بل بنائیں
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Denied Alert Banner */}
        {permissionDenied && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-arabic text-rose-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>مائیکروفون کی اجازت درکار ہے</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-700">
              {permissionMessage || 'مائیکروفون کی اجازت حاصل نہیں ہو سکی۔ براہ کرم براؤزر کی ایڈریس بار میں تالا (🔒) پر کلک کر کے مائیک کو Allow کریں۔'}
            </p>
            <button
              type="button"
              onClick={() => {
                clearError();
                startListening();
              }}
              className="mt-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold font-arabic cursor-pointer transition-colors"
            >
              اجازت دوبارہ چیک کریں (Retry)
            </button>
          </div>
        )}

        {/* Live Mic Animation & Status */}
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
          <button
            type="button"
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-200 ring-8 ring-rose-100 animate-pulse'
                : 'bg-emerald-700 text-white shadow-emerald-200 hover:bg-emerald-800'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
          </button>

          <div>
            <p className="text-sm font-bold text-slate-800 font-arabic">
              {isListening ? 'مائیک سن رہا ہے... اب بولیے' : 'مائیک بند ہے، بولنے کے لیے ٹیپ کریں'}
            </p>
            {transcript && (
              <p className="text-xs text-slate-600 font-mono mt-1 max-w-xs truncate bg-white px-2 py-1 rounded-md border border-slate-200 mx-auto">
                "{transcript}"
              </p>
            )}
          </div>
        </div>

        {/* Command Feedback */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border text-xs font-arabic flex items-start gap-2 ${
              feedbackType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : feedbackType === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            {feedbackType === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <span>{feedback}</span>
          </div>
        )}

        {/* Voice Command Examples */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs font-arabic">
          <p className="font-bold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            آسانی بول چال کے نمونے:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 pt-1">
            <div className="p-1.5 bg-white rounded-lg border border-slate-200">
              "کوک دو بوتل" / "Coke 2 bottle"
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200">
              "دو کلو چینی" / "2 kilo cheeni"
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200">
              "تین بسکٹ" / "3 biscuits"
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200">
              "سیل کیش میں کرو" / "Sale cash karo"
            </div>
          </div>
        </div>

        {/* Close */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors cursor-pointer font-arabic"
          >
            بل پر واپس جائیں (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
