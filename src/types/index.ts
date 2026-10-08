export type LanguageCode = 'ur' | 'ur-roman' | 'pa' | 'sd' | 'ps' | 'en';

export type BusinessTypeId = 
  | 'kiryana'
  | 'clothing'
  | 'shoes'
  | 'mobile'
  | 'cosmetics'
  | 'electronics'
  | 'furniture'
  | 'restaurant'
  | 'pharmacy'
  | 'fruit_veg'
  | 'bakery'
  | 'hardware'
  | 'autoparts'
  | 'online_business'
  | 'other'
  | 'cafe'
  | 'salon'
  | 'tailor'
  | 'wholesale'
  | 'service'
  | 'home_business'
  | 'online_seller'
  | 'whatsapp_seller'
  | 'mandi'
  | 'commission'
  | 'transport'
  | 'dairy'
  | 'meat_shop';

export interface BusinessTypeConfig {
  id: BusinessTypeId;
  name: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  icon: string; // Lucide icon name
  defaultCategories: string[];
  unitOptions: string[];
  terminology: {
    productsLabel: Record<LanguageCode, string>;
    salesLabel: Record<LanguageCode, string>;
    ordersOrBills: Record<LanguageCode, string>;
    inventoryLabel: Record<LanguageCode, string>;
    customersLabel: Record<LanguageCode, string>;
  };
  customFields: {
    key: string;
    label: Record<LanguageCode, string>;
    type: 'text' | 'number' | 'select' | 'date';
    placeholder?: string;
    options?: string[];
  }[];
  quickActions: {
    id: string;
    label: Record<LanguageCode, string>;
    icon: string;
    action: string;
  }[];
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  businessType: BusinessTypeId;
  ownerName: string;
  phone: string;
  email?: string;
  address?: string;
  country: string;
  currency: string;
  preferredLanguage: LanguageCode;
  logoUrl?: string;
  tagline?: string;
  themeColor: string;
  createdAt: string;
  subscription: {
    status: 'trial' | 'active' | 'expired';
    trialEndDate: string;
    plan: 'monthly_700' | 'annual';
    pricePkr: number;
  };
  rewards: {
    points: number;
    activityScore: number;
    rank: string;
    monthlyBonusPkr: number;
  };
  trustedAIActions?: {
    allowAutoDailyExpense?: boolean;
    allowAutoAddSale?: boolean;
    allowAutoStockAdjust?: boolean;
  };
  businessDescription?: string;
  tradeMode?: 'retail' | 'wholesale' | 'both' | 'service';
  dashboardConfiguration?: {
    recommendedTools: string[];
    activeTools?: string[];
  };
  guidedTools?: Record<string, boolean>;
  isOnboardingCompleted?: boolean;
  welcomedAfterOnboarding?: boolean;
}

export interface Product {
  id: string;
  businessId?: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  unit: string;
  imageUrl?: string;
  notes?: string;
  customData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  purchasePrice: number;
  total: number;
  unit: string;
}

export interface Invoice {
  id: string;
  businessId?: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'cash' | 'jazzcash' | 'easypaisa' | 'bank' | 'credit';
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  businessId?: string;
  name: string;
  phone: string;
  address?: string;
  openingBalance: number; // positive = customer owes shop (udhaar)
  currentBalance: number;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  businessId?: string;
  name: string;
  phone: string;
  companyName?: string;
  payableBalance: number; // positive = shop owes supplier
  notes?: string;
  createdAt: string;
}

export interface KhataTransaction {
  id: string;
  businessId?: string;
  partyType: 'customer' | 'supplier';
  partyId: string;
  partyName: string;
  type: 'credit_given' | 'payment_received' | 'purchase_credit' | 'payment_made';
  amount: number;
  previousBalance: number;
  newBalance: number;
  date: string;
  notes?: string;
  invoiceId?: string;
}

export interface Expense {
  id: string;
  businessId?: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
  paidVia: string;
  accountId?: string;
}

export interface FinancialAccount {
  id: string;
  businessId?: string;
  name: string;
  type: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountNumber?: string;
  bankName?: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
}

export interface FinancialTransaction {
  id: string;
  businessId?: string;
  accountId: string;
  type: 'money_in' | 'money_out' | 'transfer_in' | 'transfer_out';
  amount: number;
  previousBalance: number;
  newBalance: number;
  category: string;
  referenceType?: string;
  referenceId?: string;
  description?: string;
  createdBy?: string;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  purchasePrice?: number;
  unit?: string;
  total: number;
}

export interface Purchase {
  id: string;
  businessId?: string;
  supplierId?: string;
  supplierName: string;
  supplierInvoiceNo?: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  balanceAmount?: number;
  date: string;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  changeType: 'in' | 'out' | 'correction';
  quantityChange: number;
  reason: string;
  date: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface AIMunshiMessage {
  id: string;
  sender: 'user' | 'munshi';
  text: string;
  timestamp: string;
  actionProposal?: {
    type:
      | 'RECORD_PAYMENT'
      | 'ADD_UDHAAR'
      | 'CREATE_INVOICE'
      | 'QUICK_SALE'
      | 'RECORD_SUPPLIER_PAYMENT'
      | 'TRANSFER_CASH_BANK'
      | 'RECORD_STAFF_ADVANCE'
      | 'ADD_EXPENSE'
      | 'ADJUST_STOCK'
      | 'OPEN_KHATA'
      | 'NAVIGATE'
      | 'SHOW_REPORT'
      | 'WHATSAPP_SUMMARY'
      | 'OPEN_CAMERA'
      | 'NEW_BILL'
      | 'REPEAT_LAST_SALE'
      | 'SHOW_LAST_BILL'
      | 'CLOSE_MUNSHI';
    title: string;
    details: Record<string, any>;
    requiresConfirmation: boolean;
    status?: 'pending' | 'confirmed' | 'cancelled';
  };
  routingSource?: 'local_intent_engine' | 'ai_model' | 'cached_summary' | 'ai_model_primary' | 'ai_model_fallback';
  tokensUsed?: number;
  executionSpeedMs?: number;
}
