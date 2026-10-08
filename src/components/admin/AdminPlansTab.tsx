import React, { useState } from 'react';
import {
  Layers,
  Check,
  Edit2,
  Save,
  Users,
  Sparkles,
  Zap,
  Building,
  Store,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SubscriptionPlanId } from '../../types/admin';

export const AdminPlansTab: React.FC = () => {
  const { plans, updatePlanPricing } = useAdmin();

  const [editingPlanId, setEditingPlanId] = useState<SubscriptionPlanId | null>(null);
  const [editMonthly, setEditMonthly] = useState<number>(0);
  const [editAnnual, setEditAnnual] = useState<number>(0);
  const [saveAlert, setSaveAlert] = useState(false);

  const startEdit = (plan: typeof plans[0]) => {
    setEditingPlanId(plan.id);
    setEditMonthly(plan.pricePkrMonthly);
    setEditAnnual(plan.pricePkrAnnual);
  };

  const handleSave = (planId: SubscriptionPlanId) => {
    updatePlanPricing(planId, editMonthly, editAnnual);
    setEditingPlanId(null);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            پلانز و قیمتیں (Subscription Plans & Pricing)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            آسانی بز کے تمام پیکیجز، فیچرز کی تفصیل اور قیمتوں کو ایڈمن پینل سے منظم کریں۔
          </p>
        </div>

        {saveAlert && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>پلان کی قیمت کامیابی سے اپڈیٹ ہو گئی!</span>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isEditing = editingPlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-xs transition-all relative ${
                plan.isPopular
                  ? 'border-[#0a5e54] ring-2 ring-[#0a5e54]/20'
                  : 'border-slate-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#0a5e54] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  سب سے مقبول پیکیج
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {plan.activeSubscribers} دکانیں
                  </span>
                </div>
                <p className="text-xs text-slate-500 min-h-[32px]">{plan.description}</p>

                {/* Pricing Box */}
                <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-start">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">ماہانہ فیس (PKR):</label>
                        <input
                          type="number"
                          value={editMonthly}
                          onChange={(e) => setEditMonthly(Number(e.target.value))}
                          className="w-full p-2 text-sm font-black rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">سالانہ فیس (PKR):</label>
                        <input
                          type="number"
                          value={editAnnual}
                          onChange={(e) => setEditAnnual(Number(e.target.value))}
                          className="w-full p-2 text-sm font-black rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-2xl font-black text-slate-900">
                          Rs. {plan.pricePkrMonthly.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 font-bold"> / ماہانہ</span>
                      </div>
                      {plan.pricePkrAnnual > 0 && (
                        <div className="text-[11px] text-emerald-700 font-bold">
                          سالانہ: Rs. {plan.pricePkrAnnual.toLocaleString()} (2 ماہ مفت)
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">خصوصیات:</span>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-[#0a5e54] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-3 border-t border-slate-100">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPlanId(null)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      منسوخ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(plan.id)}
                      className="flex-1 py-2 rounded-xl bg-[#0a5e54] text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#07473f] cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>محفوظ کریں</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(plan)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>قیمت ایڈٹ کریں</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
