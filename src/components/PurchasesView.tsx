import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  FileText,
  DollarSign,
  X
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';
import { Purchase } from '../types';

export const PurchasesView: React.FC = () => {
  const { profile, purchases, addPurchase, suppliers, products, recordKhataTransaction } = useBusiness();
  const lang = profile.preferredLanguage;

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);

  // New Purchase Form State
  const [supplierName, setSupplierName] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(100);
  const [paidAmount, setPaidAmount] = useState(100);
  const [notes, setNotes] = useState('');

  const totalCost = quantity * unitCost;

  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim() || !productName.trim() || totalCost <= 0) return;

    const remainingPayable = Math.max(0, totalCost - paidAmount);

    addPurchase({
      supplierName: supplierName.trim(),
      supplierInvoiceNo: billNumber.trim() || `PUR-${Date.now().toString().slice(-4)}`,
      items: [
        {
          productId: 'prod_custom_' + Date.now(),
          productName: productName.trim(),
          quantity,
          purchasePrice: unitCost,
          unit: 'unit',
          total: totalCost
        }
      ],
      totalAmount: totalCost,
      paidAmount,
      balanceAmount: remainingPayable,
      paymentStatus: remainingPayable === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'pending',
      date: new Date().toISOString(),
      notes: notes.trim()
    });

    // If there's credit/payable balance, record to Khata
    if (remainingPayable > 0) {
      recordKhataTransaction(
        'supplier',
        'supp_' + Date.now(),
        supplierName.trim(),
        'purchase_credit',
        remainingPayable,
        `${t('purchasesHeaderTitle', lang)}: ${billNumber || t('thItems', lang)}`
      );
    }

    setIsNewPurchaseOpen(false);
    setSupplierName('');
    setBillNumber('');
    setProductName('');
    setQuantity(1);
    setUnitCost(100);
    setPaidAmount(100);
    setNotes('');
  };

  const filteredPurchases = purchases.filter(
    (p) =>
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplierInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPayableBalance = purchases.reduce((sum, p) => sum + p.balanceAmount, 0);

  return (
    <div id="purchases-main-view" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0a2e2a] tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#0a5e54]" />
            <span>{t('purchasesHeaderTitle', lang)}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-0.5">
            {t('purchasesHeaderSubtitle', lang)}
          </p>
        </div>

        <button
          id="btn-add-purchase-modal"
          onClick={() => setIsNewPurchaseOpen(true)}
          className="bg-[#0a2e2a] hover:bg-[#0d3b36] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#00f2ad]" />
          <span>{t('recordNewPurchaseBtn', lang)}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            {t('totalPurchasesLabel', lang)}
          </span>
          <p className="text-2xl font-black text-[#0a2e2a] mt-1">
            Rs. {totalPurchasesAmount.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#9ca3af] mt-1">
            {purchases.length} {t('invoicesCount', lang)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            {t('paidPurchasesLabel', lang)}
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            Rs. {(totalPurchasesAmount - totalPayableBalance).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">
            {t('cashAndTransferLabel', lang)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            {t('payableToSuppliersLabel', lang)}
          </span>
          <p className="text-2xl font-black text-rose-700 mt-1">
            Rs. {totalPayableBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-rose-600 font-semibold mt-1">
            {t('pendingClearanceLabel', lang)}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#e5e7eb] shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#9ca3af] shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchSupplierPlaceholder', lang)}
          className="w-full text-xs sm:text-sm outline-none bg-transparent text-[#1a1c1e]"
          dir="auto"
        />
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#f0f0f0] font-bold text-xs sm:text-sm text-[#0a2e2a]">
          {t('purchasesLogTitle', lang)}
        </div>

        {filteredPurchases.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#9ca3af]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {t('emptyPurchasesTitle', lang)}
              </p>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {t('noPurchasesPrompt', lang)}
              </p>
            </div>
            <button
              onClick={() => setIsNewPurchaseOpen(true)}
              className="px-3.5 py-1.5 bg-[#0a5e54] hover:bg-[#0d3b36] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('emptyPurchasesBtn', lang)}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-[#f9fafb] text-[#6b7280] uppercase font-bold border-b border-[#f0f0f0]">
                <tr>
                  <th className="py-3 px-4">{t('dateLabel', lang)}</th>
                  <th className="py-3 px-4">{t('thSupplier', lang)}</th>
                  <th className="py-3 px-4">{t('thBillNumber', lang)}</th>
                  <th className="py-3 px-4">{t('thItems', lang)}</th>
                  <th className="py-3 px-4">{t('thTotal', lang)}</th>
                  <th className="py-3 px-4">{t('thPaid', lang)}</th>
                  <th className="py-3 px-4">{t('thBalance', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {filteredPurchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-3 px-4 text-[#6b7280]">
                      {new Date(pur.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0a2e2a]">
                      {pur.supplierName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6b7280]">
                      {pur.supplierInvoiceNo}
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">
                      {pur.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0a2e2a]">
                      Rs. {pur.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">
                      Rs. {pur.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {pur.balanceAmount > 0 ? (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                          Rs. {pur.balanceAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          {t('clearedStatus', lang)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Purchase Modal */}
      {isNewPurchaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-4 bg-[#0a2e2a] text-white flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#00f2ad]" />
                <span>{t('recordNewPurchaseBtn', lang)}</span>
              </h3>
              <button
                onClick={() => setIsNewPurchaseOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePurchase} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0a2e2a] mb-1">
                  {t('supplierNameLabel', lang)}
                </label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder={t('supplierNamePlaceholder', lang)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#0a2e2a] text-xs sm:text-sm font-semibold outline-none"
                  dir="auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0a2e2a] mb-1">
                    {t('billNumberLabel', lang)}
                  </label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    placeholder="4502"
                    className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#0a2e2a] text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0a2e2a] mb-1">
                    {t('productNameInputLabel', lang)}
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Basmati Rice 50kg"
                    className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#0a2e2a] text-xs font-semibold outline-none"
                    dir="auto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0a2e2a] mb-1">
                    {t('quantityWord', lang)}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => {
                      const q = Number(e.target.value) || 1;
                      setQuantity(q);
                      setPaidAmount(q * unitCost);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#0a2e2a] text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0a2e2a] mb-1">
                    {t('unitCostLabel', lang)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={unitCost}
                    onChange={(e) => {
                      const c = Number(e.target.value) || 0;
                      setUnitCost(c);
                      setPaidAmount(quantity * c);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#0a2e2a] text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#f4f7f6] p-3 rounded-xl border border-[#e5e7eb] flex items-center justify-between text-xs font-bold">
                <span>{t('totalBillCostLabel', lang)}</span>
                <span className="text-base text-[#0a2e2a]">Rs. {totalCost.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a2e2a] mb-1">
                  {t('amountPaidNowLabel', lang)}
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalCost}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#0a2e2a] text-xs font-bold outline-none text-emerald-800"
                />
                <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                  <span>{t('remainingBalanceLabel', lang)}</span>
                  <span className="font-bold text-rose-600">
                    Rs. {Math.max(0, totalCost - paidAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a2e2a] mb-1">
                  {t('detailsNotesLabel', lang)}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Due next week"
                  className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#0a2e2a] text-xs outline-none"
                  dir="auto"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPurchaseOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6b7280] hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {t('cancelAction', lang)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0a2e2a] hover:bg-[#0d3b36] text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {t('savePurchaseBtn', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
