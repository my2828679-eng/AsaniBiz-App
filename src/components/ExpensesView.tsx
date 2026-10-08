import React, { useState } from 'react';
import {
  WalletCards,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  TrendingDown,
  X,
  CheckCircle2
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';

const EXPENSE_CATEGORIES = [
  'Electricity / Bijli (بجلی بل)',
  'Dukaan Rent (دکان کرایہ)',
  'Chai & Refreshment (چائے و پانی)',
  'Staff Salary (ملازمین تنخواہ)',
  'Carriage / Transport (مال برداری و کرایہ)',
  'Packaging Material (شاپر و بیگز)',
  'Shop Repairs (مرمت و دیکھ بھال)',
  'Zakat & Sadqah (زکوٰۃ و خیرات)',
  'Other Daily Kharcha (متفرق اخراجات)',
];

export const ExpensesView: React.FC = () => {
  const { profile, expenses, addExpense, deleteExpense } = useBusiness();
  const lang = profile.preferredLanguage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [paidVia, setPaidVia] = useState('Cash');

  // Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = expenses
    .filter((e) => e.date.startsWith(todayStr))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addExpense({
      category,
      amount: Number(amount),
      date: new Date().toISOString(),
      notes,
      paidVia,
    });

    setIsModalOpen(false);
    setAmount('');
    setNotes('');
  };

  return (
    <div id="expenses-roznamcha-view" className="space-y-4 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <WalletCards className="w-5 h-5 text-amber-600" />
            <span>{t('expensesHeaderTitle', lang)}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t('expensesHeaderSubtitle', lang)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('addNewExpenseBtn', lang)}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{t('todayExpensesLabel', lang)}</div>
          <div className="text-base sm:text-xl font-bold text-slate-900 mt-1">
            Rs. {todayTotal.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{t('filterToday', lang)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{t('allTimeExpensesLabel', lang)}</div>
          <div className="text-base sm:text-xl font-bold text-slate-900 mt-1">
            Rs. {totalAllTime.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{expenses.length} {t('invoicesCount', lang)}</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-amber-50 p-4 rounded-xl border border-amber-200">
          <div className="text-xs font-bold text-amber-900">{t('expenseAdviceTitle', lang)}</div>
          <p className="text-[11px] text-amber-800 mt-1 leading-snug">
            {t('expenseAdviceBody', lang)}
          </p>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {t('expensesHeaderTitle', lang)}
          </h3>
          <span className="text-xs text-slate-400">{expenses.length} {t('invoicesCount', lang)}</span>
        </div>

        {expenses.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#9ca3af]">
              <WalletCards className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{t('emptyExpensesTitle', lang)}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">{t('noExpensesRecorded', lang)}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('emptyExpensesBtn', lang)}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                <tr>
                  <th className="p-3">{t('dateLabel', lang)}</th>
                  <th className="p-3">{t('thCategoryTitle', lang)}</th>
                  <th className="p-3">{t('detailsNotesLabel', lang)}</th>
                  <th className="p-3">{t('expensePaidViaLabel', lang)}</th>
                  <th className="p-3">{t('amountLabel', lang)}</th>
                  <th className="p-3 text-right rtl:text-left">{t('thActions', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 text-slate-500">
                      {new Date(e.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{e.category}</td>
                    <td className="p-3 text-slate-500">{e.notes || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                        {e.paidVia}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-red-600">
                      Rs. {e.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right rtl:text-left">
                      <button
                        type="button"
                        onClick={() => deleteExpense(e.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900">
                {t('addNewExpenseBtn', lang)}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('expenseCategoryLabel', lang)} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('amountLabel', lang)} *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || '')}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('detailsNotesLabel', lang)}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bijli bill unit 120 / Staff nashta"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('paymentMethodLabel', lang)}
                </label>
                <select
                  value={paidVia}
                  onChange={(e) => setPaidVia(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Cash">Cash (نقد)</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Bank">Bank Account</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {t('saveExpenseBtn', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
