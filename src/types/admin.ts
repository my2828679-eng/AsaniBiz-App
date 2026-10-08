import type { BusinessTypeId, LanguageCode } from './index.ts';

export type AdminRole = 'super_admin' | 'support_admin' | 'finance_admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone: string;
  avatarUrl?: string;
  lastLogin: string;
}

export type BusinessAccountStatus = 'active' | 'trial' | 'expired' | 'suspended' | 'cancelled';
export type SubscriptionPlanId = 'basic' | 'pro' | 'max' | 'business';

export interface RegisteredBusiness {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  businessType: BusinessTypeId;
  registrationDate: string;
  lastActiveDate: string;
  status: BusinessAccountStatus;
  plan: SubscriptionPlanId;
  trialEndDate: string;
  renewalDate?: string;
  autoRenew: boolean;
  totalSales: number;
  invoicesCount: number;
  khataCount: number;
  productsCount: number;
  aiRequestsCount: number;
  aiTokensUsed: number;
  rewardPoints: number;
  referredBy?: string;
  notes?: string;
  isDemo: boolean;
  isLiveCurrentStore?: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  nameUrdu: string;
  description: string;
  pricePkrMonthly: number;
  pricePkrAnnual: number;
  maxProducts: number; // -1 for unlimited
  maxInvoicesMonthly: number; // -1 for unlimited
  aiMunshiTier: 'basic' | 'standard' | 'unlimited';
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  activeSubscribers: number;
}

export interface PaymentRecord {
  id: string;
  businessId: string;
  businessName: string;
  amountPkr: number;
  planId: SubscriptionPlanId;
  billingCycle: 'monthly' | 'annual';
  paymentMethod: 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cash' | 'card';
  transactionRef: string;
  status: 'verified' | 'pending' | 'failed' | 'refunded';
  date: string;
  verifiedBy?: string;
  notes?: string;
  isDemo: boolean;
}

export interface ReferralRecord {
  id: string;
  referrerBusinessId: string;
  referrerBusinessName: string;
  referrerOwner: string;
  referralCode: string;
  totalReferred: number;
  convertedPaid: number;
  rewardCreditsPkr: number; // AsaniBiz service credits (NOT cash withdrawals)
  creditsUsedPkr: number;
  lastReferralDate: string;
}

export interface AIUsageMetric {
  businessId: string;
  businessName: string;
  businessType: BusinessTypeId;
  totalRequests: number;
  tokensUsed: number;
  estimatedCostPkr: number;
  lastUsedDate: string;
  topQueryCategory: string;
}

export interface SystemActivityItem {
  id: string;
  type: 
    | 'business_registered'
    | 'subscription_upgraded'
    | 'trial_extended'
    | 'payment_received'
    | 'account_suspended'
    | 'account_activated'
    | 'plan_modified'
    | 'ai_high_usage'
    | 'admin_login';
  title: string;
  description: string;
  businessId?: string;
  businessName?: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  performedBy: string;
}

export interface AdminStats {
  totalBusinesses: number;
  activeBusinesses: number;
  trialUsers: number;
  paidSubscribers: number;
  expiredSubscriptions: number;
  suspendedAccounts: number;
  newRegistrationsThisMonth: number;
  mrrPkr: number;
  totalPlatformGmvPkr: number;
  totalAiRequests: number;
  totalRewardCreditsIssuedPkr: number;
  systemAlertsCount: number;
}

export type UsageAlertLevel = 50 | 75 | 90 | 100;

export interface ResourceMetric {
  id: string;
  name: string;
  nameUrdu: string;
  category: 'vercel' | 'supabase_db' | 'supabase_storage' | 'gemini_ai' | 'voice_media' | 'image_ai';
  unit: string;
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  period: 'monthly' | 'daily' | 'current';
  alertThreshold?: UsageAlertLevel | null;
  status: 'normal' | 'notice_50' | 'caution_75' | 'warning_90' | 'critical_100';
  details?: string;
}

export interface CustomerQuotaMetric {
  businessId: string;
  businessName: string;
  businessType: BusinessTypeId;
  ownerName: string;
  phone: string;
  plan: SubscriptionPlanId;
  status: BusinessAccountStatus;
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  aiRequestsRemaining: number;
  aiRequestsPercentage: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  aiCostPkr: number;
  voiceSecondsUsed: number;
  voiceCostPkr: number;
  imageOcrCount: number;
  imageCostPkr: number;
  totalCostPkr: number;
  lastActive: string;
  alertLevel?: UsageAlertLevel | null;
}

export interface ThresholdAlertItem {
  id: string;
  level: UsageAlertLevel;
  metricKey: string;
  title: string;
  titleUrdu: string;
  message: string;
  messageUrdu: string;
  percentage: number;
  usedValue: string;
  limitValue: string;
  category: 'vercel' | 'supabase' | 'gemini' | 'customer';
  timestamp: string;
}

export interface InfrastructureTelemetry {
  timestamp: string;
  providerStatus: {
    vercel: 'connected' | 'standard' | 'degraded';
    supabase: 'connected' | 'local_sqlite' | 'degraded';
    gemini: 'connected' | 'not_configured';
  };
  metrics: {
    // Vercel metrics
    vercelBandwidth: ResourceMetric;
    vercelFunctions: ResourceMetric;
    vercelBuildMinutes: ResourceMetric;
    vercelDataTransfer: ResourceMetric;

    // Supabase metrics
    supabaseDbSize: ResourceMetric;
    supabaseStorageSize: ResourceMetric;
    supabaseBandwidth: ResourceMetric;
    supabaseConnections: ResourceMetric;

    // Gemini AI metrics
    geminiRequests: ResourceMetric;
    geminiInputTokens: ResourceMetric;
    geminiOutputTokens: ResourceMetric;
    geminiTotalTokens: ResourceMetric;
    geminiCostPkr: ResourceMetric;

    // Voice & Image Processing
    voiceUsageMinutes: ResourceMetric;
    voiceCostPkr: ResourceMetric;
    imageProcessingCount: ResourceMetric;
    imageCostPkr: ResourceMetric;
  };
  financialSummary: {
    totalCustomers: number;
    activeCustomers: number;
    trialCustomers: number;
    expiredCustomers: number;
    suspendedCustomers: number;
    subscriptionRevenuePkr: number;
    aiComputeCostPkr: number;
    voiceProcessingCostPkr: number;
    imageProcessingCostPkr: number;
    infrastructureCostPkr: number;
    totalOperationalCostPkr: number;
    netRemainingAmountPkr: number;
    profitMarginPercentage: number;
  };
  customerQuotas: CustomerQuotaMetric[];
  alerts: ThresholdAlertItem[];
}

export interface AdminMunshiMessage {
  id: string;
  sender: 'admin' | 'admin_munshi';
  text: string;
  speechText?: string;
  timestamp: string;
  actionRoute?: {
    tab: string;
    labelUrdu: string;
    description?: string;
  };
  referencedMetrics?: {
    label: string;
    used: string;
    limit: string;
    remaining: string;
    percentage: number;
  }[];
}
