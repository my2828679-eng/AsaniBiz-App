import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BusinessProfile,
  Product,
  Invoice,
  Customer,
  Supplier,
  KhataTransaction,
  Expense,
  Purchase,
  AuditLog,
  LanguageCode,
  BusinessTypeId
} from '../types';
import { BUSINESS_TYPES } from '../config/businessTypes';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { t } from '../i18n/translations';

export type ActiveView = 
  | 'dashboard'
  | 'billing'
  | 'khata'
  | 'purchases'
  | 'products'
  | 'expenses'
  | 'reports'
  | 'landing'
  | 'business_office'
  | 'settings'
  | 'admin';

export interface PendingPOSSale {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    total: number;
  }>;
  notes?: string;
}

interface BusinessContextType {
  profile: BusinessProfile;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  currentLanguage: LanguageCode;
  t: (key: string, lang?: LanguageCode) => string;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number, reason: string) => void;
  invoices: Invoice[];
  createInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Invoice;
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'currentBalance'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'payableBalance'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  khataTransactions: KhataTransaction[];
  recordKhataTransaction: (
    partyType: 'customer' | 'supplier',
    partyId: string,
    partyName: string,
    type: 'credit_given' | 'payment_received' | 'purchase_credit' | 'payment_made',
    amount: number,
    notes?: string
  ) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  auditLogs: AuditLog[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  pendingPOSSale: PendingPOSSale | null;
  setPendingPOSSale: (sale: PendingPOSSale | null) => void;
  isAIMunshiOpen: boolean;
  setIsAIMunshiOpen: (open: boolean) => void;
  isCameraOpen: boolean;
  setIsCameraOpen: (open: boolean) => void;
  cameraMode: 'product_photo' | 'scan_barcode' | 'scan_receipt' | 'batch_parchis';
  setCameraMode: (mode: 'product_photo' | 'scan_barcode' | 'scan_receipt' | 'batch_parchis') => void;
  onCameraCaptureCallback: ((data: string) => void) | null;
  setOnCameraCaptureCallback: (cb: ((data: string) => void) | null) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isOnline: boolean;
  resetToSampleData: (bType?: BusinessTypeId) => void;
  resetToDefaults: () => void;
  resetToCleanData: (bType?: BusinessTypeId) => void;
}

const defaultProfile: BusinessProfile = {
  id: 'biz_default_01',
  businessName: 'مدینہ کریانہ اسٹور',
  businessType: 'kiryana',
  ownerName: 'دوکاندار',
  phone: '0300-1234567',
  email: '',
  address: 'مین بازار، پاکستان',
  country: 'Pakistan',
  currency: 'PKR',
  preferredLanguage: 'ur',
  themeColor: '#0a5e54',
  createdAt: new Date().toISOString(),
  subscription: {
    status: 'trial',
    trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    plan: 'monthly_700',
    pricePkr: 700,
  },
  rewards: {
    points: 0,
    activityScore: 0,
    rank: 'Member',
    monthlyBonusPkr: 0,
  },
};

// Clean initial states: all accounts start with ZERO financial records
const initialSampleProducts: Product[] = [];
const initialCustomers: Customer[] = [];
const initialSuppliers: Supplier[] = [];
const initialKhataTransactions: KhataTransaction[] = [];
const initialInvoices: Invoice[] = [];
const initialExpenses: Expense[] = [];
const initialAuditLogs: AuditLog[] = [];

// Automatic one-time cleanup of legacy demo money/records from browser cache
const PURGE_DEMO_FLAG = 'asanibiz_demo_cleaned_v4';
const checkAndPurgeDemoData = () => {
  try {
    const isCleaned = localStorage.getItem(PURGE_DEMO_FLAG);
    if (!isCleaned) {
      const savedProducts = localStorage.getItem('asanibiz_products');
      if (savedProducts && (savedProducts.includes('prod_1') || savedProducts.includes('Dal Chana'))) {
        localStorage.removeItem('asanibiz_products');
      }
      const savedCustomers = localStorage.getItem('asanibiz_customers');
      if (savedCustomers && (savedCustomers.includes('cust_1') || savedCustomers.includes('Ahmed Raza'))) {
        localStorage.removeItem('asanibiz_customers');
      }
      const savedSuppliers = localStorage.getItem('asanibiz_suppliers');
      if (savedSuppliers && (savedSuppliers.includes('supp_1') || savedSuppliers.includes('Al-Madina Wholesale'))) {
        localStorage.removeItem('asanibiz_suppliers');
      }
      const savedInvoices = localStorage.getItem('asanibiz_invoices');
      if (savedInvoices && (savedInvoices.includes('inv_1') || savedInvoices.includes('INV-1001'))) {
        localStorage.removeItem('asanibiz_invoices');
      }
      const savedKhata = localStorage.getItem('asanibiz_khata');
      if (savedKhata && (savedKhata.includes('kh_1') || savedKhata.includes('3200'))) {
        localStorage.removeItem('asanibiz_khata');
      }
      const savedExpenses = localStorage.getItem('asanibiz_expenses');
      if (savedExpenses && (savedExpenses.includes('exp_1') || savedExpenses.includes('3200'))) {
        localStorage.removeItem('asanibiz_expenses');
      }
      localStorage.setItem(PURGE_DEMO_FLAG, 'true');
    }
  } catch (e) {
    // Ignore storage check issues
  }
};
checkAndPurgeDemoData();

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOnline = useOnlineStatus();

  // Load from localStorage or defaults
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('asanibiz_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('asanibiz_products');
    return saved ? JSON.parse(saved) : initialSampleProducts;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('asanibiz_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('asanibiz_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('asanibiz_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [khataTransactions, setKhataTransactions] = useState<KhataTransaction[]>(() => {
    const saved = localStorage.getItem('asanibiz_khata');
    return saved ? JSON.parse(saved) : initialKhataTransactions;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('asanibiz_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('asanibiz_purchases');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('asanibiz_audit');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Navigation and UI state
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const v = (params.get('view') || params.get('page')) as ActiveView;
      if (v && ['landing', 'dashboard', 'billing', 'khata', 'purchases', 'products', 'expenses', 'reports', 'settings', 'admin'].includes(v)) {
        return v;
      }
    }
    return 'dashboard';
  });
  const [pendingPOSSale, setPendingPOSSale] = useState<PendingPOSSale | null>(null);
  const [isAIMunshiOpen, setIsAIMunshiOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'product_photo' | 'scan_barcode' | 'scan_receipt' | 'batch_parchis'>('scan_barcode');
  const [onCameraCaptureCallback, setOnCameraCaptureCallback] = useState<((data: string) => void) | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('asanibiz_onboarded_completed');
  });

  // Sync to local storage for offline durability
  useEffect(() => {
    localStorage.setItem('asanibiz_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('asanibiz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('asanibiz_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('asanibiz_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('asanibiz_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('asanibiz_khata', JSON.stringify(khataTransactions));
  }, [khataTransactions]);

  useEffect(() => {
    localStorage.setItem('asanibiz_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('asanibiz_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('asanibiz_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Actions
  const logAction = useCallback((action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: profile.ownerName || 'Owner'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 100)]);
  }, [profile.ownerName]);

  const updateProfile = useCallback((updates: Partial<BusinessProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    logAction('UPDATE_PROFILE', `Updated business profile: ${Object.keys(updates).join(', ')}`);
  }, [logAction]);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    logAction('ADD_PRODUCT', `Added product "${newProduct.name}" (Qty: ${newProduct.quantity})`);
    return newProduct;
  }, [logAction]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    logAction('UPDATE_PRODUCT', `Updated product ${id}`);
  }, [logAction]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    logAction('DELETE_PRODUCT', `Deleted product ${id}`);
  }, [logAction]);

  const adjustStock = useCallback((id: string, delta: number, reason: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextQty = Math.max(0, p.quantity + delta);
        return { ...p, quantity: nextQty, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
    logAction('ADJUST_STOCK', `Stock adjustment for ${id} by ${delta > 0 ? '+' + delta : delta} (${reason})`);
  }, [logAction]);

  const addCustomer = useCallback((custData: Omit<Customer, 'id' | 'createdAt' | 'currentBalance'>) => {
    const newCust: Customer = {
      ...custData,
      id: 'cust_' + Date.now(),
      currentBalance: custData.openingBalance || 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [newCust, ...prev]);
    logAction('ADD_CUSTOMER', `Added customer "${newCust.name}" with opening balance ${newCust.openingBalance}`);
    return newCust;
  }, [logAction]);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const addSupplier = useCallback((suppData: Omit<Supplier, 'id' | 'createdAt' | 'payableBalance'>) => {
    const newSupp: Supplier = {
      ...suppData,
      id: 'supp_' + Date.now(),
      payableBalance: 0,
      createdAt: new Date().toISOString(),
    };
    setSuppliers(prev => [newSupp, ...prev]);
    logAction('ADD_SUPPLIER', `Added supplier "${newSupp.name}"`);
    return newSupp;
  }, [logAction]);

  const updateSupplier = useCallback((id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const recordKhataTransaction = useCallback((
    partyType: 'customer' | 'supplier',
    partyId: string,
    partyName: string,
    type: 'credit_given' | 'payment_received' | 'purchase_credit' | 'payment_made',
    amount: number,
    notes?: string
  ) => {
    if (partyType === 'customer') {
      setCustomers(prev => prev.map(c => {
        if (c.id === partyId) {
          const delta = (type === 'credit_given') ? amount : -amount;
          const newBal = c.currentBalance + delta;
          const tx: KhataTransaction = {
            id: 'kh_' + Date.now(),
            partyType: 'customer',
            partyId,
            partyName,
            type,
            amount,
            previousBalance: c.currentBalance,
            newBalance: newBal,
            date: new Date().toISOString(),
            notes: notes || (type === 'credit_given' ? 'Udhaar diya' : 'Wasooli mili')
          };
          setKhataTransactions(kPrev => [tx, ...kPrev]);
          return { ...c, currentBalance: newBal };
        }
        return c;
      }));
    } else {
      setSuppliers(prev => prev.map(s => {
        if (s.id === partyId) {
          const delta = (type === 'purchase_credit') ? amount : -amount;
          const newBal = s.payableBalance + delta;
          const tx: KhataTransaction = {
            id: 'kh_' + Date.now(),
            partyType: 'supplier',
            partyId,
            partyName,
            type,
            amount,
            previousBalance: s.payableBalance,
            newBalance: newBal,
            date: new Date().toISOString(),
            notes: notes || (type === 'purchase_credit' ? 'Khareedari udhaar' : 'Adaigi ki gayi')
          };
          setKhataTransactions(kPrev => [tx, ...kPrev]);
          return { ...s, payableBalance: newBal };
        }
        return s;
      }));
    }
    logAction('KHATA_TRANSACTION', `${partyType.toUpperCase()} ${partyName}: ${type} of Rs. ${amount}`);
  }, [logAction]);

  const createInvoice = useCallback((invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const invNumber = `INV-${1000 + invoices.length + 1}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: 'inv_' + Date.now(),
      invoiceNumber: invNumber,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock for items
    setProducts(prev => prev.map(p => {
      const match = invoiceData.items.find(item => item.productId === p.id);
      if (match) {
        return {
          ...p,
          quantity: Math.max(0, p.quantity - match.quantity),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    // If unpaid or partial and customer selected, add udhaar to customer khata
    const unpaidAmount = newInvoice.totalAmount - newInvoice.paidAmount;
    if (unpaidAmount > 0 && newInvoice.customerId) {
      recordKhataTransaction(
        'customer',
        newInvoice.customerId,
        newInvoice.customerName,
        'credit_given',
        unpaidAmount,
        `Invoice #${invNumber} baqaya udhaar`
      );
    }

    // Award activity score reward
    setProfile(p => ({
      ...p,
      rewards: {
        ...p.rewards,
        points: p.rewards.points + 50,
        activityScore: Math.min(100, p.rewards.activityScore + 1)
      }
    }));

    setInvoices(prev => [newInvoice, ...prev]);
    logAction('CREATE_INVOICE', `Created Invoice #${invNumber} for ${newInvoice.customerName} - Total: ${newInvoice.totalAmount}`);
    return newInvoice;
  }, [invoices.length, recordKhataTransaction, logAction]);

  const addExpense = useCallback((expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: 'exp_' + Date.now(),
    };
    setExpenses(prev => [newExp, ...prev]);
    logAction('ADD_EXPENSE', `Expense recorded: ${newExp.category} - Rs. ${newExp.amount}`);
  }, [logAction]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAction('DELETE_EXPENSE', `Deleted expense record ${id}`);
  }, [logAction]);

  const addPurchase = useCallback((purchaseData: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: 'purch_' + Date.now(),
    };

    // Add stock
    setProducts(prev => prev.map(p => {
      const match = purchaseData.items.find(item => item.productId === p.id);
      if (match) {
        return {
          ...p,
          quantity: p.quantity + match.quantity,
          purchasePrice: match.costPrice,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    // If unpaid amount, update supplier khata
    const unpaid = newPurchase.totalAmount - newPurchase.paidAmount;
    if (unpaid > 0 && newPurchase.supplierId) {
      recordKhataTransaction(
        'supplier',
        newPurchase.supplierId,
        newPurchase.supplierName,
        'purchase_credit',
        unpaid,
        `Purchase bill mal khareed`
      );
    }

    setPurchases(prev => [newPurchase, ...prev]);
    logAction('ADD_PURCHASE', `Purchased goods from ${newPurchase.supplierName} - Total: Rs. ${newPurchase.totalAmount}`);
  }, [recordKhataTransaction, logAction]);

  const resetToCleanData = useCallback((bType: BusinessTypeId = profile.businessType || 'kiryana') => {
    const bConfig = BUSINESS_TYPES[bType] || BUSINESS_TYPES.kiryana;
    const newProfile: BusinessProfile = {
      ...defaultProfile,
      businessType: bType,
      businessName: `${bConfig.name['ur-roman']} Store`,
    };
    setProfile(newProfile);
    setProducts([]);
    setInvoices([]);
    setCustomers([]);
    setSuppliers([]);
    setKhataTransactions([]);
    setExpenses([]);
    setPurchases([]);
    setAuditLogs([]);

    localStorage.setItem('asanibiz_profile', JSON.stringify(newProfile));
    localStorage.setItem('asanibiz_products', JSON.stringify([]));
    localStorage.setItem('asanibiz_invoices', JSON.stringify([]));
    localStorage.setItem('asanibiz_customers', JSON.stringify([]));
    localStorage.setItem('asanibiz_suppliers', JSON.stringify([]));
    localStorage.setItem('asanibiz_khata', JSON.stringify([]));
    localStorage.setItem('asanibiz_expenses', JSON.stringify([]));
    localStorage.setItem('asanibiz_purchases', JSON.stringify([]));
    localStorage.setItem('asanibiz_audit', JSON.stringify([]));
  }, [profile.businessType]);

  const resetToDefaults = useCallback(() => {
    resetToCleanData(profile.businessType || 'kiryana');
  }, [resetToCleanData, profile.businessType]);

  const resetToSampleData = useCallback((bType: BusinessTypeId = 'kiryana') => {
    resetToCleanData(bType);
  }, [resetToCleanData]);

  const currentLanguage: LanguageCode = profile.preferredLanguage || 'ur';
  const translate = useCallback((key: string, lang?: LanguageCode) => {
    return t(key, lang || profile.preferredLanguage || 'ur');
  }, [profile.preferredLanguage]);

  return (
    <BusinessContext.Provider
      value={{
        profile,
        updateProfile,
        currentLanguage,
        t: translate,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        invoices,
        createInvoice,
        customers,
        addCustomer,
        updateCustomer,
        suppliers,
        addSupplier,
        updateSupplier,
        khataTransactions,
        recordKhataTransaction,
        expenses,
        addExpense,
        deleteExpense,
        purchases,
        addPurchase,
        auditLogs,
        activeView,
        setActiveView,
        pendingPOSSale,
        setPendingPOSSale,
        isAIMunshiOpen,
        setIsAIMunshiOpen,
        isCameraOpen,
        setIsCameraOpen,
        cameraMode,
        setCameraMode,
        onCameraCaptureCallback,
        setOnCameraCaptureCallback,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isOnline,
        resetToSampleData,
        resetToDefaults,
        resetToCleanData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
