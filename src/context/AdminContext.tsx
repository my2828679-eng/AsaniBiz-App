import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AdminUser,
  RegisteredBusiness,
  SubscriptionPlan,
  PaymentRecord,
  ReferralRecord,
  AIUsageMetric,
  SystemActivityItem,
  AdminStats,
  BusinessAccountStatus,
  SubscriptionPlanId,
  InfrastructureTelemetry,
  AdminMunshiMessage
} from '../types/admin';
import {
  INITIAL_SUBSCRIPTION_PLANS,
  DEMO_REGISTERED_BUSINESSES,
  DEMO_PAYMENT_RECORDS,
  DEMO_REFERRAL_RECORDS,
  DEMO_AI_USAGE_METRICS,
  DEMO_SYSTEM_ACTIVITIES
} from '../data/adminDemoData';
import { useBusiness } from './BusinessContext';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (identifier: string, secret: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  businesses: RegisteredBusiness[];
  allBusinessesWithLive: RegisteredBusiness[];
  plans: SubscriptionPlan[];
  payments: PaymentRecord[];
  referrals: ReferralRecord[];
  aiUsage: AIUsageMetric[];
  systemActivities: SystemActivityItem[];
  stats: AdminStats;
  telemetry: InfrastructureTelemetry | null;
  fetchTelemetry: () => Promise<void>;
  isTelemetryLoading: boolean;
  adminMunshiMessages: AdminMunshiMessage[];
  queryAdminMunshi: (message: string, language?: string) => Promise<AdminMunshiMessage | null>;
  clearAdminMunshiChat: () => void;
  selectedBusinessId: string | null;
  setSelectedBusinessId: (id: string | null) => void;
  updateBusinessStatus: (
    businessId: string,
    newStatus: BusinessAccountStatus,
    newPlan?: SubscriptionPlanId,
    trialExtensionDays?: number
  ) => void;
  updateBusinessNotes: (businessId: string, notes: string) => void;
  recordManualPayment: (payment: Omit<PaymentRecord, 'id' | 'isDemo'>) => void;
  updatePlanPricing: (planId: SubscriptionPlanId, monthlyPkr: number, annualPkr: number) => void;
  filterBusinessType: string;
  setFilterBusinessType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showDemoData: boolean;
  setShowDemoData: (show: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'asanibiz_admin_session_v1';
const BUSINESSES_STORAGE_KEY = 'asanibiz_admin_businesses_v1';
const PLANS_STORAGE_KEY = 'asanibiz_admin_plans_v1';
const PAYMENTS_STORAGE_KEY = 'asanibiz_admin_payments_v1';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    profile, 
    updateProfile, 
    invoices, 
    products, 
    customers, 
    khataTransactions 
  } = useBusiness();

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdminAuthenticated = !!adminUser;

  // Businesses state
  const [businesses, setBusinesses] = useState<RegisteredBusiness[]>(() => {
    try {
      const saved = localStorage.getItem(BUSINESSES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEMO_REGISTERED_BUSINESSES;
    } catch {
      return DEMO_REGISTERED_BUSINESSES;
    }
  });

  // Plans state
  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    try {
      const saved = localStorage.getItem(PLANS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION_PLANS;
    } catch {
      return INITIAL_SUBSCRIPTION_PLANS;
    }
  });

  // Payments state
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEMO_PAYMENT_RECORDS;
    } catch {
      return DEMO_PAYMENT_RECORDS;
    }
  });

  // Referrals, AI Usage, and Activities
  const [referrals] = useState<ReferralRecord[]>(DEMO_REFERRAL_RECORDS);
  const [aiUsage] = useState<AIUsageMetric[]>(DEMO_AI_USAGE_METRICS);
  const [systemActivities, setSystemActivities] = useState<SystemActivityItem[]>(DEMO_SYSTEM_ACTIVITIES);

  // Selected business for detail drawer/modal
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Infrastructure Telemetry & Admin Munshi state
  const [telemetry, setTelemetry] = useState<InfrastructureTelemetry | null>(null);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState<boolean>(false);
  const [adminMunshiMessages, setAdminMunshiMessages] = useState<AdminMunshiMessage[]>([
    {
      id: 'munshi_init',
      sender: 'admin_munshi',
      text: 'اسلام علیکم ایڈمن صاحب! میں آپ کا ڈیڈیکیٹڈ "ایڈمن منشی" ہوں۔ آپ مجھ سے ورسِل، سوپابیس، جیمنائی AI لاگت، کسٹمر کوٹہ یا ریونیو کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں۔',
      speechText: 'اسلام علیکم ایڈمن صاحب! میں آپ کا ایڈمن منشی ہوں۔ ورسِل، سوپابیس، AI یا ریونیو کے بارے میں پوچھ سکتے ہیں۔',
      timestamp: new Date().toISOString(),
    }
  ]);

  // Filter & Search states
  const [filterBusinessType, setFilterBusinessType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDemoData, setShowDemoData] = useState<boolean>(true);

  // Persist businesses
  useEffect(() => {
    try {
      localStorage.setItem(BUSINESSES_STORAGE_KEY, JSON.stringify(businesses));
    } catch (e) {
      console.warn('Failed to persist admin businesses:', e);
    }
  }, [businesses]);

  // Persist plans
  useEffect(() => {
    try {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    } catch (e) {
      console.warn('Failed to persist admin plans:', e);
    }
  }, [plans]);

  // Persist payments
  useEffect(() => {
    try {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    } catch (e) {
      console.warn('Failed to persist admin payments:', e);
    }
  }, [payments]);

  // Map the current real logged-in store into the admin business registry
  const liveCurrentBusiness: RegisteredBusiness = useMemo(() => {
    const totalSales = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
    const planId: SubscriptionPlanId = profile.subscription?.plan === 'annual' ? 'business' : 'pro';

    return {
      id: profile.id || 'biz_current_live_01',
      businessName: profile.businessName || 'میری دکان (Live Active Store)',
      ownerName: profile.ownerName || 'دوکاندار (Current User)',
      phone: profile.phone || '0300-0000000',
      email: profile.email || 'my2828679@gmail.com',
      city: 'پاکستان (Current Applet)',
      address: profile.address || 'مقامی دکان',
      businessType: profile.businessType || 'kiryana',
      registrationDate: profile.createdAt || new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      status: profile.subscription?.status === 'trial' 
        ? 'trial' 
        : profile.subscription?.status === 'expired' 
        ? 'expired' 
        : 'active',
      plan: planId,
      trialEndDate: profile.subscription?.trialEndDate || new Date(Date.now() + 25 * 86400000).toISOString(),
      renewalDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      autoRenew: true,
      totalSales,
      invoicesCount: invoices.length,
      khataCount: customers.length,
      productsCount: products.length,
      aiRequestsCount: 18,
      aiTokensUsed: 7800,
      rewardPoints: profile.rewards?.points || 150,
      notes: 'یہ آپ کا موجودہ فعال کسٹمر اکاؤنٹ ہے (Real Local Tenant Data)۔',
      isDemo: false,
      isLiveCurrentStore: true
    };
  }, [profile, invoices, products, customers]);

  // Combined businesses (Live Store + Demo Businesses)
  const allBusinessesWithLive = useMemo(() => {
    return [liveCurrentBusiness, ...businesses];
  }, [liveCurrentBusiness, businesses]);

  // Filtered businesses according to toggle & search
  const visibleBusinesses = useMemo(() => {
    return allBusinessesWithLive.filter(b => {
      if (!showDemoData && b.isDemo) return false;
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      if (filterBusinessType !== 'all' && b.businessType !== filterBusinessType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.businessName.toLowerCase().includes(q);
        const matchesOwner = b.ownerName.toLowerCase().includes(q);
        const matchesPhone = b.phone.toLowerCase().includes(q);
        const matchesCity = b.city.toLowerCase().includes(q);
        return matchesName || matchesOwner || matchesPhone || matchesCity;
      }
      return true;
    });
  }, [allBusinessesWithLive, showDemoData, filterStatus, filterBusinessType, searchQuery]);

  // Comprehensive Admin Statistics
  const stats: AdminStats = useMemo(() => {
    const totalBusinesses = allBusinessesWithLive.length;
    const activeBusinesses = allBusinessesWithLive.filter(b => b.status === 'active').length;
    const trialUsers = allBusinessesWithLive.filter(b => b.status === 'trial').length;
    const paidSubscribers = allBusinessesWithLive.filter(b => b.status === 'active' && b.plan !== 'basic').length;
    const expiredSubscriptions = allBusinessesWithLive.filter(b => b.status === 'expired').length;
    const suspendedAccounts = allBusinessesWithLive.filter(b => b.status === 'suspended').length;
    
    // MRR Calculation
    const mrrPkr = allBusinessesWithLive.reduce((acc, b) => {
      if (b.status !== 'active') return acc;
      if (b.plan === 'pro') return acc + 700;
      if (b.plan === 'max') return acc + 1500;
      if (b.plan === 'business') return acc + 3500;
      return acc;
    }, 0);

    const totalPlatformGmvPkr = allBusinessesWithLive.reduce((acc, b) => acc + b.totalSales, 0);
    const totalAiRequests = allBusinessesWithLive.reduce((acc, b) => acc + b.aiRequestsCount, 0);
    const totalRewardCreditsIssuedPkr = referrals.reduce((acc, r) => acc + r.rewardCreditsPkr, 0);

    return {
      totalBusinesses,
      activeBusinesses,
      trialUsers,
      paidSubscribers,
      expiredSubscriptions,
      suspendedAccounts,
      newRegistrationsThisMonth: 4,
      mrrPkr,
      totalPlatformGmvPkr,
      totalAiRequests,
      totalRewardCreditsIssuedPkr,
      systemAlertsCount: expiredSubscriptions + 1 // +1 for high usage warning
    };
  }, [allBusinessesWithLive, referrals]);

  // Admin Login
  const loginAdmin = useCallback(async (identifier: string, secret: string) => {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedSecret = secret.trim();

    // Accepted authorized credentials:
    // 1. admin@asanibiz.pk or admin (Password: asani2026 or PIN 7860)
    // 2. my2828679@gmail.com (Super Admin)
    const isValidAdmin = 
      (trimmedId === 'admin@asanibiz.pk' || trimmedId === 'admin' || trimmedId === 'my2828679@gmail.com') &&
      (trimmedSecret === 'asani2026' || trimmedSecret === '7860' || trimmedSecret === 'admin123');

    if (isValidAdmin) {
      const user: AdminUser = {
        id: 'adm_super_01',
        name: trimmedId === 'my2828679@gmail.com' ? 'Super Admin (Platform Owner)' : 'Muhammad Yaseen (Chief Admin)',
        email: trimmedId.includes('@') ? trimmedId : 'admin@asanibiz.pk',
        phone: '0300-7860123',
        role: 'super_admin',
        lastLogin: new Date().toISOString()
      };

      setAdminUser(user);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.warn('Storage error:', e);
      }

      // Add to audit stream
      setSystemActivities(prev => [
        {
          id: `act_${Date.now()}`,
          type: 'admin_login',
          title: 'ایڈمن پورٹل رسائی',
          description: `${user.name} نے کامیابی سے ایڈمن پورٹل میں داخلہ لیا۔`,
          timestamp: new Date().toISOString(),
          severity: 'info',
          performedBy: user.email
        },
        ...prev
      ]);

      return { success: true };
    }

    return {
      success: false,
      message: 'غلط ای میل یا پاس ورڈ! برائے مہربانی درست ایڈمن اسناد درج کریں۔ (ڈیمو پن: 7860 یا پاس ورڈ: asani2026)'
    };
  }, []);

  // Admin Logout
  const logoutAdmin = useCallback(() => {
    setAdminUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, []);

  // Update business status / extend trial
  const updateBusinessStatus = useCallback((
    businessId: string,
    newStatus: BusinessAccountStatus,
    newPlan?: SubscriptionPlanId,
    trialExtensionDays?: number
  ) => {
    // If updating current live store, sync with real BusinessProfile
    if (businessId === liveCurrentBusiness.id) {
      let currentTrialEnd = new Date(profile.subscription?.trialEndDate || Date.now());
      if (trialExtensionDays && trialExtensionDays > 0) {
        currentTrialEnd = new Date(currentTrialEnd.getTime() + trialExtensionDays * 86400000);
      }

      updateProfile({
        subscription: {
          ...profile.subscription,
          status: newStatus === 'active' ? 'active' : newStatus === 'trial' ? 'trial' : 'expired',
          trialEndDate: currentTrialEnd.toISOString(),
          plan: newPlan === 'business' ? 'annual' : 'monthly_700',
          pricePkr: newPlan === 'business' ? 3500 : 700
        }
      });
    }

    setBusinesses(prev => prev.map(b => {
      if (b.id !== businessId) return b;

      let newTrialEndDate = b.trialEndDate;
      if (trialExtensionDays && trialExtensionDays > 0) {
        const baseDate = new Date(b.trialEndDate).getTime() > Date.now() 
          ? new Date(b.trialEndDate) 
          : new Date();
        newTrialEndDate = new Date(baseDate.getTime() + trialExtensionDays * 86400000).toISOString();
      }

      return {
        ...b,
        status: newStatus,
        plan: newPlan || b.plan,
        trialEndDate: newTrialEndDate
      };
    }));

    // Log Activity
    setSystemActivities(prev => [
      {
        id: `act_${Date.now()}`,
        type: newStatus === 'trial' && trialExtensionDays ? 'trial_extended' : 'subscription_upgraded',
        title: trialExtensionDays ? `ٹرائل میں ${trialExtensionDays} دن کی توسیع` : `اکاؤنٹ اسٹیٹس تبدیل (${newStatus})`,
        description: `کاروبار ID ${businessId} کو اپڈیٹ کیا گیا بذریعہ ایڈمن۔`,
        businessId,
        timestamp: new Date().toISOString(),
        severity: 'success',
        performedBy: adminUser?.email || 'Admin'
      },
      ...prev
    ]);
  }, [liveCurrentBusiness.id, profile, updateProfile, adminUser]);

  // Update business notes
  const updateBusinessNotes = useCallback((businessId: string, notes: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, notes } : b));
  }, []);

  // Record manual payment
  const recordManualPayment = useCallback((paymentData: Omit<PaymentRecord, 'id' | 'isDemo'>) => {
    const newRecord: PaymentRecord = {
      ...paymentData,
      id: `pay_rec_${Date.now()}`,
      isDemo: false,
      verifiedBy: adminUser?.name || 'Admin',
      date: new Date().toISOString()
    };

    setPayments(prev => [newRecord, ...prev]);

    // Also upgrade the business status to active
    updateBusinessStatus(paymentData.businessId, 'active', paymentData.planId);

    // Log to system activities
    setSystemActivities(prev => [
      {
        id: `act_${Date.now()}`,
        type: 'payment_received',
        title: `ادائیگی موصول: Rs. ${paymentData.amountPkr.toLocaleString()}`,
        description: `${paymentData.businessName} کی طرف سے ${paymentData.paymentMethod.toUpperCase()} سے فیس وصول کی گئی۔`,
        businessId: paymentData.businessId,
        businessName: paymentData.businessName,
        timestamp: new Date().toISOString(),
        severity: 'success',
        performedBy: adminUser?.email || 'Admin'
      },
      ...prev
    ]);
  }, [adminUser, updateBusinessStatus]);

  // Update Plan Pricing
  const updatePlanPricing = useCallback((planId: SubscriptionPlanId, monthlyPkr: number, annualPkr: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        pricePkrMonthly: monthlyPkr,
        pricePkrAnnual: annualPkr
      };
    }));

    setSystemActivities(prev => [
      {
        id: `act_${Date.now()}`,
        type: 'plan_modified',
        title: `پلان قیمت اپڈیٹ (${planId.toUpperCase()})`,
        description: `ماہانہ فیس: Rs. ${monthlyPkr}، سالانہ فیس: Rs. ${annualPkr} مقرر کی گئی۔`,
        timestamp: new Date().toISOString(),
        severity: 'info',
        performedBy: adminUser?.email || 'Admin'
      },
      ...prev
    ]);
  }, [adminUser]);

  // Fetch Infrastructure Telemetry from backend
  const fetchTelemetry = useCallback(async () => {
    setIsTelemetryLoading(true);
    try {
      const bizParam = encodeURIComponent(JSON.stringify(allBusinessesWithLive.slice(0, 15)));
      const res = await fetch(`/api/admin/infrastructure-telemetry?businesses=${bizParam}`, {
        headers: {
          'x-admin-token': 'adm_super_token',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.telemetry) {
          setTelemetry(data.telemetry);
        }
      }
    } catch (err) {
      console.warn('[AdminContext] Telemetry fetch error:', err);
    } finally {
      setIsTelemetryLoading(false);
    }
  }, [allBusinessesWithLive]);

  // Auto-fetch telemetry periodically and on initial load
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 25000); // 25s auto-sync
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  // Query Admin Munshi
  const queryAdminMunshi = useCallback(async (
    message: string,
    language?: string
  ): Promise<AdminMunshiMessage | null> => {
    const userMsg: AdminMunshiMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'admin',
      text: message,
      timestamp: new Date().toISOString(),
    };

    setAdminMunshiMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/admin/munshi-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          language: language || profile.preferredLanguage || 'ur',
          businesses: allBusinessesWithLive.slice(0, 10),
        }),
      });

      if (!res.ok) {
        throw new Error('Admin Munshi query failed');
      }

      const data = await res.json();
      const munshiMsg: AdminMunshiMessage = {
        id: `msg_munshi_${Date.now()}`,
        sender: 'admin_munshi',
        text: data.reply || 'معلومات موصول نہیں ہو سکیں۔',
        speechText: data.speechSynthesisText || data.reply,
        timestamp: new Date().toISOString(),
        actionRoute: data.actionRoute,
        referencedMetrics: data.referencedMetrics,
      };

      setAdminMunshiMessages(prev => [...prev, munshiMsg]);
      return munshiMsg;
    } catch (err: any) {
      const errMsg: AdminMunshiMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'admin_munshi',
        text: 'نیٹ ورک یا سرور میں مسئلہ پیش آیا ہے۔ برائے مہربانی دوبارہ کوشش کریں۔',
        timestamp: new Date().toISOString(),
      };
      setAdminMunshiMessages(prev => [...prev, errMsg]);
      return errMsg;
    }
  }, [profile.preferredLanguage, allBusinessesWithLive]);

  const clearAdminMunshiChat = useCallback(() => {
    setAdminMunshiMessages([
      {
        id: `munshi_${Date.now()}`,
        sender: 'admin_munshi',
        text: 'چیٹ ری سیٹ کر دی گئی ہے۔ آپ مجھ سے ایڈمن ڈیش بورڈ، ورسِل، سوپابیس، AI یا ریونیو کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں۔',
        speechText: 'چیٹ ری سیٹ ہو گئی۔ آپ کوئی بھی سوال پوچھ سکتے ہیں۔',
        timestamp: new Date().toISOString(),
      }
    ]);
  }, []);

  const value = {
    isAdminAuthenticated,
    adminUser,
    loginAdmin,
    logoutAdmin,
    businesses: visibleBusinesses,
    allBusinessesWithLive,
    plans,
    payments,
    referrals,
    aiUsage,
    systemActivities,
    stats,
    telemetry,
    fetchTelemetry,
    isTelemetryLoading,
    adminMunshiMessages,
    queryAdminMunshi,
    clearAdminMunshiChat,
    selectedBusinessId,
    setSelectedBusinessId,
    updateBusinessStatus,
    updateBusinessNotes,
    recordManualPayment,
    updatePlanPricing,
    filterBusinessType,
    setFilterBusinessType,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    showDemoData,
    setShowDemoData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
