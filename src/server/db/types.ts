export type Role = 'owner' | 'manager' | 'cashier' | 'staff';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';
export type PaymentMethod = 'cash' | 'jazzcash' | 'easypaisa' | 'bank' | 'credit';
export type FinancialAccountType = 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
export type FinancialTransactionType = 'money_in' | 'money_out' | 'transfer_in' | 'transfer_out';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'pending';
export type PartyType = 'customer' | 'supplier';
export type KhataTxType =
  | 'credit_given'
  | 'payment_received'
  | 'purchase_credit'
  | 'payment_made'
  | 'reversal_credit'
  | 'reversal_payment';

export type StockMovementType =
  | 'opening'
  | 'purchase'
  | 'sale'
  | 'sale_return'
  | 'purchase_return'
  | 'adjustment'
  | 'damage'
  | 'void_reversal';

export interface BusinessRow {
  id: string;
  name: string;
  business_type: string;
  owner_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  country: string;
  currency: string;
  preferred_language: string;
  logo_url: string | null;
  tagline: string | null;
  theme_color: string;
  created_at: string;
  updated_at: string;
}

export interface UserRow {
  id: string;
  business_id: string;
  username: string;
  full_name: string;
  phone: string | null;
  role: Role;
  permissions: string;
  password_hash: string | null;
  is_active: number;
  created_at: string;
}

export interface SubscriptionRow {
  id: string;
  business_id: string;
  status: SubscriptionStatus;
  plan: string;
  price_pkr: number;
  trial_end_date: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface ProductRow {
  id: string;
  business_id: string;
  category_id: string | null;
  category_name: string;
  name: string;
  sku: string;
  barcode: string | null;
  purchase_price_paisa: number;
  selling_price_paisa: number;
  wholesale_price_paisa?: number;
  current_stock: number;
  low_stock_threshold: number;
  unit: string;
  image_url: string | null;
  notes: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface StockMovementRow {
  id: string;
  business_id: string;
  product_id: string;
  movement_type: StockMovementType;
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  unit_cost_paisa: number;
  reference_type: 'invoice' | 'purchase' | 'manual' | 'void' | 'initial';
  reference_id: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
}

export interface CustomerRow {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  address: string | null;
  opening_balance_paisa: number;
  current_balance_paisa: number;
  credit_limit_paisa: number;
  is_active: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierRow {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  company_name: string | null;
  payable_balance_paisa: number;
  is_active: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaleRow {
  id: string;
  business_id: string;
  invoice_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  salesman_id?: string | null;
  salesman_name?: string | null;
  salesman_commission_paisa?: number;
  subtotal_paisa: number;
  discount_paisa: number;
  tax_paisa: number;
  total_amount_paisa: number;
  paid_amount_paisa: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string | null;
  created_by: string;
  created_at: string;
  is_voided: number;
  void_reason: string | null;
  voided_at: string | null;
  voided_by: string | null;
}

export interface SaleItemRow {
  id: string;
  sale_id: string;
  business_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_paisa: number;
  purchase_price_paisa: number;
  total_paisa: number;
  unit: string;
}

export interface PurchaseRow {
  id: string;
  business_id: string;
  supplier_id: string | null;
  supplier_name: string;
  supplier_invoice_no: string | null;
  total_amount_paisa: number;
  paid_amount_paisa: number;
  balance_amount_paisa: number;
  payment_status: PaymentStatus;
  date: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  is_voided: number;
  void_reason: string | null;
  voided_at: string | null;
}

export interface PurchaseItemRow {
  id: string;
  purchase_id: string;
  business_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  cost_price_paisa: number;
  total_paisa: number;
  unit: string;
}

export interface KhataTransactionRow {
  id: string;
  business_id: string;
  party_type: PartyType;
  party_id: string;
  party_name: string;
  type: KhataTxType;
  amount_paisa: number;
  previous_balance_paisa: number;
  new_balance_paisa: number;
  reference_type: 'invoice' | 'purchase' | 'manual' | 'void_reversal' | 'opening_balance';
  reference_id: string | null;
  notes: string | null;
  idempotency_key: string | null;
  created_by: string;
  created_at: string;
  is_voided: number;
  void_reason: string | null;
  voided_at: string | null;
  voided_by: string | null;
}

export interface ExpenseRow {
  id: string;
  business_id: string;
  category: string;
  amount_paisa: number;
  paid_via: string;
  notes: string | null;
  date: string;
  created_by: string;
  created_at: string;
}

export interface AIUsageLogRow {
  id: string;
  business_id: string;
  model: string;
  prompt_length: number;
  tokens_estimated: number;
  cost_pkr_estimated: number;
  routing_source: string;
  action_proposed: string | null;
  success: number;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  business_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string;
  ip_address: string | null;
  created_at: string;
}

export interface FinancialAccountRow {
  id: string;
  business_id: string;
  name: string;
  type: FinancialAccountType;
  account_number: string | null;
  bank_name: string | null;
  opening_balance_paisa: number;
  current_balance_paisa: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransactionRow {
  id: string;
  business_id: string;
  account_id: string;
  type: FinancialTransactionType;
  amount_paisa: number;
  previous_balance_paisa: number;
  new_balance_paisa: number;
  category: string;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface ProductVariantRow {
  id: string;
  business_id: string;
  product_id: string;
  name: string;
  sku: string | null;
  purchase_price_paisa: number;
  selling_price_paisa: number;
  current_stock: number;
  created_at: string;
  updated_at: string;
}

export interface StaffRow {
  id: string;
  business_id: string;
  employee_id: string | null;
  name: string;
  phone: string | null;
  role: string | null;
  joining_date: string | null;
  salary_paisa: number;
  advance_balance_paisa: number;
  commission_rate_percentage?: number;
  cash_in_hand_paisa?: number;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface StaffTransactionRow {
  id: string;
  business_id: string;
  staff_id: string;
  type: 'salary_payment' | 'advance' | 'commission' | 'bonus' | 'other_payment';
  amount_paisa: number;
  account_id: string | null;
  financial_transaction_id: string | null;
  date: string;
  notes: string | null;
  idempotency_key: string | null;
  created_by: string;
  created_at: string;
}

export interface CommissionRow {
  id: string;
  business_id: string;
  party_name: string;
  type: 'payable' | 'receivable';
  related_sale_id: string | null;
  related_purchase_id: string | null;
  deal_reference: string | null;
  rate_percentage: number | null;
  amount_paisa: number;
  paid_amount_paisa: number;
  status: 'unpaid' | 'paid' | 'partial';
  account_id: string | null;
  financial_transaction_id: string | null;
  date: string;
  notes: string | null;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransportTripRow {
  id: string;
  business_id: string;
  vehicle_no: string;
  driver_name: string | null;
  transporter_name: string | null;
  party_name?: string | null;
  route: string | null;
  date: string;
  related_reference: string | null;
  freight_paisa: number;
  diesel_paisa: number;
  labour_paisa: number;
  other_expense_paisa: number;
  total_cost_paisa: number;
  paid_amount_paisa: number;
  remaining_amount_paisa: number;
  received_amount_paisa?: number;
  trip_profit_paisa?: number;
  payment_status: 'paid' | 'unpaid' | 'partial';
  account_id: string | null;
  financial_transaction_id: string | null;
  notes: string | null;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetRow {
  id: string;
  business_id: string;
  name: string;
  category: string;
  purchase_date: string;
  purchase_price_paisa: number;
  current_value_paisa: number;
  quantity: number;
  account_id: string | null;
  financial_transaction_id: string | null;
  notes: string | null;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiabilityRow {
  id: string;
  business_id: string;
  name: string;
  type: 'bank_loan' | 'personal_loan' | 'committee' | 'other';
  creditor_name: string;
  amount_paisa: number;
  remaining_balance_paisa: number;
  start_date: string;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiabilityPaymentRow {
  id: string;
  business_id: string;
  liability_id: string;
  amount_paisa: number;
  account_id: string;
  financial_transaction_id: string;
  payment_date: string;
  notes: string | null;
  idempotency_key: string | null;
  created_at: string;
}

export interface ReturnRow {
  id: string;
  business_id: string;
  return_type: 'sale_return' | 'purchase_return';
  original_reference_id: string | null;
  party_type: 'customer' | 'supplier' | null;
  party_id: string | null;
  party_name: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_paisa: number;
  total_amount_paisa: number;
  refund_amount_paisa: number;
  account_id: string | null;
  financial_transaction_id: string | null;
  reason: string | null;
  created_at: string;
}

export interface SpecializedToolEntryRow {
  id: string;
  business_id: string;
  tool_id: string;
  reference_title: string | null;
  entry_data_json: string;
  created_at: string;
  updated_at: string;
}

export interface CashReconciliationRow {
  id: string;
  business_id: string;
  account_id: string;
  system_balance_paisa: number;
  physical_count_paisa: number;
  difference_paisa: number;
  notes: string | null;
  date: string;
  created_by: string;
  created_at: string;
}

export interface SmartAlertItem {
  id: string;
  type: 'low_stock' | 'customer_udhaar' | 'supplier_payable' | 'salesman_unsettled' | 'daily_closing' | 'expiry_wastage';
  severity: 'high' | 'medium' | 'info';
  title: string;
  description: string;
  entityId?: string;
  amountPkr?: number;
  actionRoute?: string;
  date?: string;
}

export interface PeriodicReportData {
  period: string;
  startDate: string;
  endDate: string;
  salesCount: number;
  totalSalesPkr: number;
  cashSalesPkr: number;
  creditSalesPkr: number;
  totalCogsPkr: number;
  grossProfitPkr: number;
  purchasesCount: number;
  totalPurchasesPkr: number;
  totalExpensesPkr: number;
  staffSalariesPaidPkr: number;
  staffAdvancesActivePkr: number;
  transportProfitPkr: number;
  commissionNetPkr: number;
  netProfitPkr: number;
  customerOutstandingPkr: number;
  supplierPayablePkr: number;
  cashInHandPkr: number;
  bankBalancePkr: number;
  easypaisaBalancePkr: number;
  jazzcashBalancePkr: number;
  totalLiquidCashPkr: number;
  stockValuationPkr: number;
  salesmanRecoveriesPkr: number;
  whatsappSummaryText: string;
}

