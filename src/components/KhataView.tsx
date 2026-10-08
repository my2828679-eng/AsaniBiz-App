import React, { useState } from 'react';
import {
  BookOpen,
  UserPlus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Plus,
  History,
  Phone,
  CheckCircle2,
  X,
  Coins,
  Truck,
  Share2
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';
import { Customer, Supplier } from '../types';
import {
  formatKhataSummaryWhatsAppText,
  formatKhataReminderWhatsAppText,
  getManualWhatsAppUrl,
  openManualWhatsApp,
} from '../services/whatsappShare';

export const KhataView: React.FC = () => {
  const {
    profile,
    customers,
    addCustomer,
    suppliers,
    addSupplier,
    khataTransactions,
    recordKhataTransaction,
  } = useBusiness();

  const lang = profile.preferredLanguage;

  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState<Customer | Supplier | null>(null);

  // Transaction Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txType, setTxType] = useState<'payment' | 'credit'>('payment');
  const [txAmount, setTxAmount] = useState<number | ''>('');
  const [txNotes, setTxNotes] = useState('');

  // Add Party Modal State
  const [isAddPartyModalOpen, setIsAddPartyModalOpen] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyPhone, setNewPartyPhone] = useState('');
  const [newPartyOpeningBal, setNewPartyOpeningBal] = useState<number | ''>('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
  );

  const totalCustomerUdhaar = customers.reduce(
    (acc, c) => acc + Math.max(0, c.currentBalance),
    0
  );
  const totalSupplierPayable = suppliers.reduce(
    (acc, s) => acc + Math.max(0, s.payableBalance),
    0
  );

  const partyTransactions = selectedParty
    ? khataTransactions.filter(
        (tx) =>
          tx.partyId === selectedParty.id &&
          tx.partyType === (activeTab === 'customers' ? 'customer' : 'supplier')
      )
    : [];

  const handleRecordTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParty || !txAmount || Number(txAmount) <= 0) return;

    if (activeTab === 'customers') {
      const internalTxType = txType === 'credit' ? 'credit_given' : 'payment_received';
      recordKhataTransaction(
        'customer',
        selectedParty.id,
        selectedParty.name,
        internalTxType,
        Number(txAmount),
        txNotes || (txType === 'credit' ? 'Naya Udhaar' : 'Wasooli Jama')
      );
    } else {
      const internalTxType = txType === 'credit' ? 'purchase_credit' : 'payment_made';
      recordKhataTransaction(
        'supplier',
        selectedParty.id,
        selectedParty.name,
        internalTxType,
        Number(txAmount),
        txNotes || (txType === 'credit' ? 'Mal Khareed Udhaar' : 'Supplier ko payment')
      );
    }

    setIsTxModalOpen(false);
    setTxAmount('');
    setTxNotes('');
  };

  const handleCreateParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartyName.trim()) return;

    if (activeTab === 'customers') {
      const c = addCustomer({
        name: newPartyName.trim(),
        phone: newPartyPhone.trim() || '0300-0000000',
        openingBalance: Number(newPartyOpeningBal) || 0,
      });
      setSelectedParty(c);
    } else {
      const s = addSupplier({
        name: newPartyName.trim(),
        phone: newPartyPhone.trim() || '0300-0000000',
      });
      setSelectedParty(s);
    }

    setIsAddPartyModalOpen(false);
    setNewPartyName('');
    setNewPartyPhone('');
    setNewPartyOpeningBal('');
  };

  const getWhatsAppReminderUrl = (customer: Customer) => {
    const text = formatKhataReminderWhatsAppText(
      {
        name: customer.name,
        phone: customer.phone,
        currentBalance: customer.currentBalance,
      },
      profile
    );
    return getManualWhatsAppUrl(text, customer.phone);
  };

  const handleShareKhataSummary = (party: Customer | Supplier) => {
    const text = formatKhataSummaryWhatsAppText(
      {
        name: party.name,
        phone: party.phone,
        currentBalance: (party as any).currentBalance ?? 0,
      },
      partyTransactions,
      profile
    );
    openManualWhatsApp(text, party.phone);
  };

  return (
    <div id="khata-ledger-view" className="space-y-4 pb-20 lg:pb-6">
      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span>{t('khataHeaderTitle', lang)}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t('khataHeaderSubtitle', lang)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddPartyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{activeTab === 'customers' ? t('addCustomerBtn', lang) : t('addSupplierBtn', lang)}</span>
          </button>
        </div>
      </div>

      {/* Tabs & Metric summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('customers');
            setSelectedParty(null);
          }}
          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'customers'
              ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div>
            <div className="text-xs font-bold text-slate-700">{t('tabCustomersKhata', lang)}</div>
            <div className="text-base sm:text-lg font-extrabold text-red-600 mt-0.5">
              Rs. {totalCustomerUdhaar.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">{customers.length} {t('registeredCustomersText', lang)}</div>
          </div>
          <div className="p-2 rounded-xl bg-red-100 text-red-700 font-bold text-xs">
            {t('udhaarLenaHai', lang)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('suppliers');
            setSelectedParty(null);
          }}
          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'suppliers'
              ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div>
            <div className="text-xs font-bold text-slate-700">{t('tabSuppliersKhata', lang)}</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
              Rs. {totalSupplierPayable.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">{suppliers.length} {t('registeredSuppliersText', lang)}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs">
            {t('udhaarDenaHai', lang)}
          </div>
        </button>
      </div>

      {/* Main Ledger Split Screen: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 5 Cols: Party List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col max-h-[600px]">
          {/* Search bar */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchKhataPlaceholder', lang)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* List items */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {activeTab === 'customers' ? (
              filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-700">{t('emptyKhataTitle', lang)}</p>
                  <button
                    type="button"
                    onClick={() => setIsAddPartyModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t('emptyKhataBtn', lang)}</span>
                  </button>
                </div>
              ) : (
                filteredCustomers.map((cust) => {
                  const isSelected = selectedParty?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedParty(cust)}
                      className={`p-3 cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{cust.name}</div>
                        <div className="text-[11px] text-slate-400">{cust.phone}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xs font-bold ${
                            cust.currentBalance > 0 ? 'text-red-600' : 'text-emerald-700'
                          }`}
                        >
                          Rs. {cust.currentBalance.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cust.currentBalance > 0 ? t('baqayaUdhaarLabel', lang) : t('saafClearLabel', lang)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              filteredSuppliers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-700">{t('emptySuppliersTitle', lang)}</p>
                  <button
                    type="button"
                    onClick={() => setIsAddPartyModalOpen(true)}
                    className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t('emptySuppliersBtn', lang)}</span>
                  </button>
                </div>
              ) : (
                filteredSuppliers.map((supp) => {
                  const isSelected = selectedParty?.id === supp.id;
                  return (
                    <div
                      key={supp.id}
                      onClick={() => setSelectedParty(supp)}
                      className={`p-3 cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{supp.name}</div>
                        <div className="text-[11px] text-slate-400">{supp.companyName || supp.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          Rs. {supp.payableBalance.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">{t('payableLabel', lang)}</div>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Transaction Statement */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4 min-h-[450px]">
          {selectedParty ? (
            <>
              {/* Party Header & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedParty.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{selectedParty.phone}</span>
                    </span>
                    {activeTab === 'customers' && (
                      <span className="font-semibold text-red-600">
                        • {t('baqayaUdhaarLabel', lang)}: Rs. {(selectedParty as Customer).currentBalance}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* WhatsApp Khata Statement / Summary Button */}
                  <button
                    id="khata-whatsapp-summary-btn"
                    type="button"
                    onClick={() => handleShareKhataSummary(selectedParty)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title={lang === 'ur' ? 'کھاتہ خلاصہ و تفصیل واٹس ایپ پر بھیجیں' : 'Send Khata Statement via WhatsApp'}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ur' ? '🟢 WhatsApp خلاصہ' : '🟢 WhatsApp Summary'}</span>
                  </button>

                  {/* WhatsApp Due Reminder (Customers with Pending Udhaar) */}
                  {activeTab === 'customers' && (selectedParty as Customer).currentBalance > 0 && (
                    <a
                      id="khata-whatsapp-reminder-btn"
                      href={getWhatsAppReminderUrl(selectedParty as Customer)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('btnSendWhatsAppReminder', lang)}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setTxType('payment');
                      setIsTxModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('jamaPaymentBtn', lang)}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTxType('credit');
                      setIsTxModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('udhaarCreditBtn', lang)}
                  </button>
                </div>
              </div>

              {/* Transactions Timeline */}
              <div className="flex-1 overflow-y-auto space-y-2 max-h-80 pr-1">
                <div className="text-xs font-semibold text-slate-500 pb-1 flex items-center gap-1">
                  <History className="w-3.5 h-3.5" />
                  <span>{t('roznamchaHistory', lang)}</span>
                </div>

                {partyTransactions.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    {t('noTransactionsYet', lang)}
                  </div>
                ) : (
                  partyTransactions.map((tx) => {
                    const isCredit = tx.type === 'credit_given' || tx.type === 'purchase_credit';
                    return (
                      <div
                        key={tx.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            {isCredit ? (
                              <ArrowDownRight className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                            <span className="truncate">{tx.notes || (isCredit ? t('btnGiveCredit', lang) : t('btnReceivePayment', lang))}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(tx.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className={`font-bold ${isCredit ? 'text-red-600' : 'text-emerald-700'}`}>
                            {isCredit ? '+ Rs. ' : '- Rs. '}
                            {tx.amount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Balance: Rs. {tx.newBalance.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-8 space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm">{t('emptyUdhaarTitle', lang)}</p>
                <p className="text-slate-400 text-xs mt-0.5">{t('selectPartyPrompt', lang)}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPartyModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('emptyUdhaarBtn', lang)}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Entry Modal (Jama / Udhaar) */}
      {isTxModalOpen && selectedParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900">
                {txType === 'credit' ? t('recordTxModalTitleCredit', lang) : t('recordTxModalTitlePayment', lang)}
              </h4>
              <button
                onClick={() => setIsTxModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordTx} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">{t('customerLabel', lang)}:</span> <strong>{selectedParty.name}</strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('amountLabel', lang)}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value) || '')}
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('detailsNotesLabel', lang)}
                </label>
                <input
                  type="text"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder="e.g. Mahana rashan / Cash wasool hua"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-colors cursor-pointer ${
                    txType === 'credit' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {t('saveEntryBtn', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Party Modal */}
      {isAddPartyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900">
                {activeTab === 'customers' ? t('addCustomerBtn', lang) : t('addSupplierBtn', lang)}
              </h4>
              <button
                onClick={() => setIsAddPartyModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateParty} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('thCustomer', lang)} / {t('thName', lang)} *
                </label>
                <input
                  type="text"
                  required
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  placeholder="e.g. Muhammad Kashif"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('customerPhonePlaceholder', lang)}
                </label>
                <input
                  type="tel"
                  value={newPartyPhone}
                  onChange={(e) => setNewPartyPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {activeTab === 'customers' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('openingBalanceLabel', lang)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPartyOpeningBal}
                    onChange={(e) => setNewPartyOpeningBal(Number(e.target.value) || '')}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {t('savePartyBtn', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
