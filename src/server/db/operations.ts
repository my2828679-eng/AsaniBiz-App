import { getDatabase, runTransaction } from './database.ts';
import type {
  BusinessRow,
  UserRow,
  SubscriptionRow,
  CategoryRow,
  ProductRow,
  StockMovementRow,
  CustomerRow,
  SupplierRow,
  SaleRow,
  SaleItemRow,
  PurchaseRow,
  PurchaseItemRow,
  KhataTransactionRow,
  ExpenseRow,
  AIUsageLogRow,
  AuditLogRow,
  FinancialAccountRow,
  FinancialTransactionRow,
  ProductVariantRow,
  StaffRow,
  StaffTransactionRow,
  CommissionRow,
  TransportTripRow,
  AssetRow,
  LiabilityRow,
  LiabilityPaymentRow,
  ReturnRow,
  SpecializedToolEntryRow,
  CashReconciliationRow,
  SmartAlertItem,
  PeriodicReportData,
  KhataTxType,
  StockMovementType,
  FinancialAccountType,
  FinancialTransactionType,
} from './types.ts';

// Helper to convert PKR to Paisa (1 PKR = 100 Paisa)
export function pkrToPaisa(pkr: number): number {
  return Math.round(Number(pkr) * 100);
}

// Helper to convert Paisa to PKR
export function paisaToPkr(paisa: number): number {
  return Number(paisa) / 100;
}

let idSeq = 0;
export function generateId(prefix: string): string {
  idSeq = (idSeq + 1) % 1000000;
  return `${prefix}_${Date.now()}_${idSeq}_${Math.random().toString(36).slice(2, 6)}`;
}

// =============================================================================
// BUSINESS & SUBSCRIPTIONS
// =============================================================================

export function getOrCreateBusiness(data: {
  id: string;
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  email?: string;
  address?: string;
  country?: string;
  currency?: string;
  preferredLanguage?: string;
  themeColor?: string;
}): BusinessRow {
  const db = getDatabase();
  const existing = db.prepare('SELECT * FROM businesses WHERE id = ?').get(data.id) as unknown as BusinessRow | undefined;
  if (existing) {
    ensureDefaultFinancialAccounts(data.id);
    return existing;
  }

  const now = new Date().toISOString();
  return runTransaction(() => {
    db.prepare(`
      INSERT INTO businesses (
        id, name, business_type, owner_name, phone, email, address,
        country, currency, preferred_language, logo_url, tagline,
        theme_color, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.id,
      data.name,
      data.businessType,
      data.ownerName,
      data.phone,
      data.email || null,
      data.address || null,
      data.country || 'Pakistan',
      data.currency || 'PKR',
      data.preferredLanguage || 'ur',
      null,
      null,
      data.themeColor || '#0a5e54',
      now,
      now
    );

    // Create default owner user
    db.prepare(`
      INSERT OR IGNORE INTO users (id, business_id, username, full_name, phone, role, permissions, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(`usr_${data.id}_owner`, data.id, 'owner', data.ownerName, data.phone, 'owner', '["all"]', 1, now);

    // Create initial trial subscription
    const trialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT OR IGNORE INTO subscriptions (id, business_id, status, plan, price_pkr, trial_end_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(`sub_${data.id}`, data.id, 'trial', 'monthly_700', 700, trialEnd, now, now);

    // Ensure all 4 default financial accounts exist
    ensureDefaultFinancialAccounts(data.id);

    return db.prepare('SELECT * FROM businesses WHERE id = ?').get(data.id) as unknown as BusinessRow;
  });
}

export function updateBusinessProfile(
  businessId: string,
  updates: Partial<Omit<BusinessRow, 'id' | 'created_at'>>
): BusinessRow {
  const db = getDatabase();
  const now = new Date().toISOString();

  const allowedFields: (keyof BusinessRow)[] = [
    'name',
    'business_type',
    'owner_name',
    'phone',
    'email',
    'address',
    'country',
    'currency',
    'preferred_language',
    'logo_url',
    'tagline',
    'theme_color',
  ];

  const setClauses: string[] = ['updated_at = ?'];
  const values: any[] = [now];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      values.push(updates[field]);
    }
  }

  values.push(businessId);
  db.prepare(`UPDATE businesses SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);

  return db.prepare('SELECT * FROM businesses WHERE id = ?').get(businessId) as unknown as BusinessRow;
}

// =============================================================================
// CENTRAL FINANCIAL ACCOUNTS & LEDGER ENGINE
// =============================================================================

export const DEFAULT_FINANCIAL_ACCOUNTS: Array<{ type: FinancialAccountType; name: string }> = [
  { type: 'cash', name: 'Cash in Hand (نقد کیش)' },
  { type: 'bank', name: 'Bank Account (بینک اکاؤنٹ)' },
  { type: 'easypaisa', name: 'Easypaisa (ایزی پیسہ)' },
  { type: 'jazzcash', name: 'JazzCash (جاز کیش)' },
];

/**
 * Ensures that the 4 central financial accounts exist for the given business
 */
export function ensureDefaultFinancialAccounts(businessId: string): FinancialAccountRow[] {
  const db = getDatabase();
  const now = new Date().toISOString();

  for (const acc of DEFAULT_FINANCIAL_ACCOUNTS) {
    const existing = db
      .prepare('SELECT id FROM financial_accounts WHERE business_id = ? AND type = ?')
      .get(businessId, acc.type);

    if (!existing) {
      const id = `acc_${businessId}_${acc.type}`;
      db.prepare(`
        INSERT INTO financial_accounts (
          id, business_id, name, type, account_number, bank_name,
          opening_balance_paisa, current_balance_paisa, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, NULL, NULL, 0, 0, 1, ?, ?)
      `).run(id, businessId, acc.name, acc.type, now, now);
    }
  }

  return db
    .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND is_active = 1 ORDER BY type ASC')
    .all(businessId) as unknown as FinancialAccountRow[];
}

export function getFinancialAccounts(businessId: string): FinancialAccountRow[] {
  ensureDefaultFinancialAccounts(businessId);
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND is_active = 1 ORDER BY type ASC')
    .all(businessId) as unknown as FinancialAccountRow[];
}

export function getFinancialAccountByType(businessId: string, type: FinancialAccountType): FinancialAccountRow {
  ensureDefaultFinancialAccounts(businessId);
  const db = getDatabase();
  const acc = db
    .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND type = ?')
    .get(businessId, type) as unknown as FinancialAccountRow | undefined;

  if (!acc) {
    throw new Error(`Financial account of type "${type}" not found for business ${businessId}`);
  }
  return acc;
}

export function getFinancialTransactions(
  businessId: string,
  accountId?: string,
  limit: number = 200
): FinancialTransactionRow[] {
  const db = getDatabase();
  if (accountId) {
    return db
      .prepare(
        'SELECT * FROM financial_transactions WHERE business_id = ? AND account_id = ? ORDER BY created_at DESC LIMIT ?'
      )
      .all(businessId, accountId, limit) as unknown as FinancialTransactionRow[];
  }
  return db
    .prepare('SELECT * FROM financial_transactions WHERE business_id = ? ORDER BY created_at DESC LIMIT ?')
    .all(businessId, limit) as unknown as FinancialTransactionRow[];
}

export interface RecordFinancialTransactionInput {
  accountId?: string;
  accountType?: FinancialAccountType;
  type: FinancialTransactionType;
  amountPkr: number;
  category: string;
  referenceType?: string;
  referenceId?: string;
  description?: string;
  createdBy?: string;
}

/**
 * Atomically records a financial transaction, updating account balance with full auditability
 */
export function recordFinancialTransaction(
  businessId: string,
  data: RecordFinancialTransactionInput
): { transaction: FinancialTransactionRow; account: FinancialAccountRow } {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(data.amountPkr);
  if (amountPaisa <= 0) {
    throw new Error('Financial transaction amount must be greater than zero');
  }

  return runTransaction(() => {
    ensureDefaultFinancialAccounts(businessId);

    // Locate target account
    let account: FinancialAccountRow | undefined;
    if (data.accountId) {
      account = db
        .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND id = ?')
        .get(businessId, data.accountId) as unknown as FinancialAccountRow | undefined;
    } else if (data.accountType) {
      account = db
        .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND type = ?')
        .get(businessId, data.accountType) as unknown as FinancialAccountRow | undefined;
    } else {
      // Default to cash
      account = db
        .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND type = ?')
        .get(businessId, 'cash') as unknown as FinancialAccountRow | undefined;
    }

    if (!account) {
      throw new Error(`Financial account not found for business ${businessId}`);
    }

    const previousBalPaisa = account.current_balance_paisa;
    const isMoneyIn = data.type === 'money_in' || data.type === 'transfer_in';
    const delta = isMoneyIn ? amountPaisa : -amountPaisa;
    const newBalPaisa = previousBalPaisa + delta;
    const now = new Date().toISOString();
    const txId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Update account balance
    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      newBalPaisa,
      now,
      account.id
    );

    // 2. Insert into financial_transactions
    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txId,
      businessId,
      account.id,
      data.type,
      amountPaisa,
      previousBalPaisa,
      newBalPaisa,
      data.category,
      data.referenceType || null,
      data.referenceId || null,
      data.description?.trim() || null,
      data.createdBy || 'Owner',
      now
    );

    const updatedAccount = db
      .prepare('SELECT * FROM financial_accounts WHERE id = ?')
      .get(account.id) as unknown as FinancialAccountRow;
    const transaction = db
      .prepare('SELECT * FROM financial_transactions WHERE id = ?')
      .get(txId) as unknown as FinancialTransactionRow;

    return { transaction, account: updatedAccount };
  });
}

/**
 * Record customer payment: atomically updates Customer Khata and selected Financial Account (Cash/Bank/Easypaisa/JazzCash)
 */
export function recordCustomerPaymentWithAccount(
  businessId: string,
  data: {
    customerId: string;
    customerName: string;
    amountPkr: number;
    paymentMethod: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
    notes?: string;
    createdBy?: string;
  }
): {
  khataTx: KhataTransactionRow;
  financialTx: FinancialTransactionRow;
  updatedCustomer: CustomerRow;
  updatedAccount: FinancialAccountRow;
} {
  return runTransaction(() => {
    const khataTx = recordKhataTransaction(businessId, {
      partyType: 'customer',
      partyId: data.customerId,
      partyName: data.customerName,
      type: 'payment_received',
      amountPkr: data.amountPkr,
      referenceType: 'manual',
      notes: data.notes || `Wasooli via ${data.paymentMethod.toUpperCase()}`,
      createdBy: data.createdBy || 'Owner',
    });

    const finResult = recordFinancialTransaction(businessId, {
      accountType: data.paymentMethod,
      type: 'money_in',
      amountPkr: data.amountPkr,
      category: 'customer_payment',
      referenceType: 'khata',
      referenceId: khataTx.id,
      description: `Customer payment received from ${data.customerName} via ${data.paymentMethod.toUpperCase()}`,
      createdBy: data.createdBy || 'Owner',
    });

    const db = getDatabase();
    const updatedCustomer = db
      .prepare('SELECT * FROM customers WHERE id = ?')
      .get(data.customerId) as unknown as CustomerRow;

    return {
      khataTx,
      financialTx: finResult.transaction,
      updatedCustomer,
      updatedAccount: finResult.account,
    };
  });
}

/**
 * Record supplier payment: atomically updates Supplier Khata and deducts from selected Financial Account
 */
export function recordSupplierPaymentWithAccount(
  businessId: string,
  data: {
    supplierId: string;
    supplierName: string;
    amountPkr: number;
    paymentMethod: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
    notes?: string;
    createdBy?: string;
  }
): {
  khataTx: KhataTransactionRow;
  financialTx: FinancialTransactionRow;
  updatedSupplier: SupplierRow;
  updatedAccount: FinancialAccountRow;
} {
  return runTransaction(() => {
    const khataTx = recordKhataTransaction(businessId, {
      partyType: 'supplier',
      partyId: data.supplierId,
      partyName: data.supplierName,
      type: 'payment_made',
      amountPkr: data.amountPkr,
      referenceType: 'manual',
      notes: data.notes || `Adaigi via ${data.paymentMethod.toUpperCase()}`,
      createdBy: data.createdBy || 'Owner',
    });

    const finResult = recordFinancialTransaction(businessId, {
      accountType: data.paymentMethod,
      type: 'money_out',
      amountPkr: data.amountPkr,
      category: 'supplier_payment',
      referenceType: 'khata',
      referenceId: khataTx.id,
      description: `Supplier payment to ${data.supplierName} via ${data.paymentMethod.toUpperCase()}`,
      createdBy: data.createdBy || 'Owner',
    });

    const db = getDatabase();
    const updatedSupplier = db
      .prepare('SELECT * FROM suppliers WHERE id = ?')
      .get(data.supplierId) as unknown as SupplierRow;

    return {
      khataTx,
      financialTx: finResult.transaction,
      updatedSupplier,
      updatedAccount: finResult.account,
    };
  });
}

// =============================================================================
// MULTI-UNIT & PRODUCT VARIANT ENGINE
// =============================================================================

/**
 * Calculates the base canonical unit quantity based on configured conversions
 * Supports explicit product conversions and standard market conversions (Carton=12, Dozen=12, Bag=50, Mann=40)
 */
export function calculateBaseQuantity(
  product: { unit: string; conversion_factor?: number; secondary_unit?: string | null },
  itemUnit?: string,
  itemQuantity: number = 1
): number {
  if (!itemUnit || !product) return itemQuantity;
  const prodUnit = (product.unit || 'unit').toLowerCase().trim();
  const inputUnit = itemUnit.toLowerCase().trim();
  if (inputUnit === prodUnit) return itemQuantity;

  const factor = Number(product.conversion_factor) || 1;
  const secUnit = (product.secondary_unit || '').toLowerCase().trim();

  // If item unit matches explicit secondary unit configured on product
  if (secUnit && inputUnit === secUnit && factor > 1) {
    return itemQuantity * factor;
  }

  // Standard configured market conversions
  if (inputUnit === 'carton' || inputUnit === 'box' || inputUnit === 'dabba' || inputUnit === 'peti') {
    return itemQuantity * (factor > 1 ? factor : 12);
  }
  if (inputUnit === 'dozen' || inputUnit === 'darjan') {
    return itemQuantity * 12;
  }
  if (inputUnit === 'bag' || inputUnit === 'bori' || inputUnit === 'sack') {
    return itemQuantity * (factor > 1 ? factor : 50);
  }
  if (inputUnit === 'mann' || inputUnit === 'mon' || inputUnit === 'maund') {
    return itemQuantity * 40;
  }

  return itemQuantity;
}

export function createProductVariant(
  businessId: string,
  data: {
    productId: string;
    name: string;
    sku?: string;
    purchasePricePkr?: number;
    sellingPricePkr?: number;
    initialStock?: number;
  }
): ProductVariantRow {
  const db = getDatabase();
  const id = `var_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO product_variants (
      id, business_id, product_id, name, sku, purchase_price_paisa,
      selling_price_paisa, current_stock, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    businessId,
    data.productId,
    data.name.trim(),
    data.sku?.trim() || null,
    pkrToPaisa(data.purchasePricePkr || 0),
    pkrToPaisa(data.sellingPricePkr || 0),
    Number(data.initialStock) || 0,
    now,
    now
  );
  return db.prepare('SELECT * FROM product_variants WHERE id = ?').get(id) as unknown as ProductVariantRow;
}

export function getProductVariants(businessId: string, productId: string): ProductVariantRow[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM product_variants WHERE business_id = ? AND product_id = ? ORDER BY name ASC')
    .all(businessId, productId) as unknown as ProductVariantRow[];
}

export function adjustVariantStock(
  businessId: string,
  variantId: string,
  delta: number
): ProductVariantRow {
  const db = getDatabase();
  const now = new Date().toISOString();
  const variant = db
    .prepare('SELECT * FROM product_variants WHERE business_id = ? AND id = ?')
    .get(businessId, variantId) as unknown as ProductVariantRow | undefined;
  if (!variant) throw new Error(`Variant ${variantId} not found`);

  const newStock = Math.max(0, variant.current_stock + delta);
  db.prepare('UPDATE product_variants SET current_stock = ?, updated_at = ? WHERE id = ?').run(
    newStock,
    now,
    variantId
  );
  return db.prepare('SELECT * FROM product_variants WHERE id = ?').get(variantId) as unknown as ProductVariantRow;
}


// =============================================================================
// CUSTOMERS & LEDGER (KHATA)
// =============================================================================

export function getCustomers(businessId: string, search?: string): CustomerRow[] {
  const db = getDatabase();
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    return db
      .prepare(`
        SELECT * FROM customers 
        WHERE business_id = ? AND is_active = 1 AND (name LIKE ? OR phone LIKE ?)
        ORDER BY name ASC
      `)
      .all(businessId, term, term) as unknown as CustomerRow[];
  }
  return db
    .prepare('SELECT * FROM customers WHERE business_id = ? AND is_active = 1 ORDER BY name ASC')
    .all(businessId) as unknown as CustomerRow[];
}

export function getCustomerById(businessId: string, customerId: string): CustomerRow | undefined {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM customers WHERE business_id = ? AND id = ?')
    .get(businessId, customerId) as unknown as CustomerRow | undefined;
}

export function createCustomer(
  businessId: string,
  data: {
    name: string;
    phone: string;
    address?: string;
    openingBalancePkr?: number;
    creditLimitPkr?: number;
    notes?: string;
  }
): CustomerRow {
  const db = getDatabase();
  const now = new Date().toISOString();
  const customerId = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const openingBalancePaisa = pkrToPaisa(data.openingBalancePkr || 0);

  return runTransaction(() => {
    db.prepare(`
      INSERT INTO customers (
        id, business_id, name, phone, address,
        opening_balance_paisa, current_balance_paisa, credit_limit_paisa,
        is_active, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `).run(
      customerId,
      businessId,
      data.name.trim(),
      data.phone.trim(),
      data.address?.trim() || null,
      openingBalancePaisa,
      openingBalancePaisa,
      pkrToPaisa(data.creditLimitPkr || 0),
      data.notes?.trim() || null,
      now,
      now
    );

    // If initial opening balance > 0, log opening ledger transaction
    if (openingBalancePaisa !== 0) {
      db.prepare(`
        INSERT INTO khata_transactions (
          id, business_id, party_type, party_id, party_name,
          type, amount_paisa, previous_balance_paisa, new_balance_paisa,
          reference_type, reference_id, notes, idempotency_key,
          created_by, created_at, is_voided
        ) VALUES (?, ?, 'customer', ?, ?, ?, ?, 0, ?, 'opening_balance', NULL, 'Initial Opening Balance', ?, 'System', ?, 0)
      `).run(
        `kh_${Date.now()}_open`,
        businessId,
        customerId,
        data.name.trim(),
        openingBalancePaisa > 0 ? 'credit_given' : 'payment_received',
        Math.abs(openingBalancePaisa),
        openingBalancePaisa,
        `open_bal_${customerId}`,
        now
      );
    }

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, business_id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, 'Owner', 'CREATE_CUSTOMER', 'customer', ?, ?, ?)
    `).run(generateId('aud'), businessId, customerId, `Created customer ${data.name}`, now);

    return db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId) as unknown as CustomerRow;
  });
}

/**
 * Mathematically authoritative calculation of customer balance from immutable ledger
 */
export function calculateCustomerAuthoritativeBalance(
  businessId: string,
  customerId: string
): { calculatedBalancePaisa: number; openingBalancePaisa: number; snapshotBalancePaisa: number; inSync: boolean } {
  const db = getDatabase();
  const customer = db
    .prepare('SELECT opening_balance_paisa, current_balance_paisa FROM customers WHERE business_id = ? AND id = ?')
    .get(businessId, customerId) as { opening_balance_paisa: number; current_balance_paisa: number } | undefined;

  if (!customer) {
    throw new Error(`Customer not found for businessId=${businessId}, customerId=${customerId}`);
  }

  // Sum non-voided transactions:
  // credit_given: + amount
  // payment_received: - amount
  // reversal_credit: - amount (reverses previous credit given)
  // reversal_payment: + amount (reverses previous payment received)
  const txSumRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(CASE 
          WHEN type = 'credit_given' THEN amount_paisa
          WHEN type = 'payment_received' THEN -amount_paisa
          WHEN type = 'reversal_credit' THEN -amount_paisa
          WHEN type = 'reversal_payment' THEN amount_paisa
          ELSE 0 
        END), 0) AS tx_delta
      FROM khata_transactions
      WHERE business_id = ? AND party_type = 'customer' AND party_id = ? AND reference_type != 'opening_balance'
    `)
    .get(businessId, customerId) as { tx_delta: number };

  const calculatedBalancePaisa = customer.opening_balance_paisa + (txSumRow?.tx_delta || 0);
  const inSync = calculatedBalancePaisa === customer.current_balance_paisa;

  return {
    calculatedBalancePaisa,
    openingBalancePaisa: customer.opening_balance_paisa,
    snapshotBalancePaisa: customer.current_balance_paisa,
    inSync,
  };
}

/**
 * Record Khata transaction atomically with strict idempotency and audit logs
 */
export function recordKhataTransaction(
  businessId: string,
  data: {
    partyType: 'customer' | 'supplier';
    partyId: string;
    partyName: string;
    type: KhataTxType;
    amountPkr: number;
    referenceType?: 'invoice' | 'purchase' | 'manual' | 'void_reversal' | 'opening_balance';
    referenceId?: string;
    notes?: string;
    idempotencyKey?: string;
    createdBy?: string;
  }
): KhataTransactionRow {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(data.amountPkr);
  if (amountPaisa <= 0) {
    throw new Error('Khata transaction amount must be greater than zero');
  }

  // Idempotency check to prevent duplicate submission
  if (data.idempotencyKey) {
    const existing = db
      .prepare('SELECT * FROM khata_transactions WHERE business_id = ? AND idempotency_key = ?')
      .get(businessId, data.idempotencyKey) as unknown as KhataTransactionRow | undefined;
    if (existing) {
      return existing; // Safely return without duplicating
    }
  }

  return runTransaction(() => {
    const now = new Date().toISOString();
    const txId = `kh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    let previousBalPaisa = 0;
    let newBalPaisa = 0;

    if (data.partyType === 'customer') {
      const cust = db
        .prepare('SELECT * FROM customers WHERE business_id = ? AND id = ?')
        .get(businessId, data.partyId) as unknown as CustomerRow | undefined;
      if (!cust) throw new Error(`Customer ${data.partyId} does not exist in business ${businessId}`);

      previousBalPaisa = cust.current_balance_paisa;
      const delta = data.type === 'credit_given' || data.type === 'reversal_payment' ? amountPaisa : -amountPaisa;
      newBalPaisa = previousBalPaisa + delta;

      // Update snapshot balance
      db.prepare('UPDATE customers SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newBalPaisa,
        now,
        data.partyId
      );
    } else {
      const supp = db
        .prepare('SELECT * FROM suppliers WHERE business_id = ? AND id = ?')
        .get(businessId, data.partyId) as unknown as SupplierRow | undefined;
      if (!supp) throw new Error(`Supplier ${data.partyId} does not exist in business ${businessId}`);

      previousBalPaisa = supp.payable_balance_paisa;
      const delta = data.type === 'purchase_credit' || data.type === 'reversal_payment' ? amountPaisa : -amountPaisa;
      newBalPaisa = previousBalPaisa + delta;

      db.prepare('UPDATE suppliers SET payable_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newBalPaisa,
        now,
        data.partyId
      );
    }

    db.prepare(`
      INSERT INTO khata_transactions (
        id, business_id, party_type, party_id, party_name,
        type, amount_paisa, previous_balance_paisa, new_balance_paisa,
        reference_type, reference_id, notes, idempotency_key,
        created_by, created_at, is_voided
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      txId,
      businessId,
      data.partyType,
      data.partyId,
      data.partyName.trim(),
      data.type,
      amountPaisa,
      previousBalPaisa,
      newBalPaisa,
      data.referenceType || 'manual',
      data.referenceId || null,
      data.notes?.trim() || null,
      data.idempotencyKey || null,
      data.createdBy || 'Owner',
      now
    );

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, business_id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, ?, 'RECORD_KHATA_TX', 'khata_transaction', ?, ?, ?)
    `).run(
      generateId('aud'),
      businessId,
      data.createdBy || 'Owner',
      txId,
      `${data.partyType.toUpperCase()} ${data.partyName}: ${data.type} Rs. ${data.amountPkr}`,
      now
    );

    return db.prepare('SELECT * FROM khata_transactions WHERE id = ?').get(txId) as unknown as KhataTransactionRow;
  });
}

/**
 * Void/Reverse a Khata transaction safely without deleting historical journal
 */
export function voidKhataTransaction(
  businessId: string,
  transactionId: string,
  reason: string,
  voidedBy: string = 'Owner'
): { success: boolean; reversalTransaction: KhataTransactionRow } {
  const db = getDatabase();
  const tx = db
    .prepare('SELECT * FROM khata_transactions WHERE business_id = ? AND id = ?')
    .get(businessId, transactionId) as unknown as KhataTransactionRow | undefined;

  if (!tx) {
    throw new Error(`Transaction ${transactionId} not found`);
  }
  if (tx.is_voided) {
    throw new Error(`Transaction ${transactionId} has already been voided`);
  }

  return runTransaction(() => {
    const now = new Date().toISOString();

    // Mark original as voided
    db.prepare(`
      UPDATE khata_transactions
      SET is_voided = 1, void_reason = ?, voided_at = ?, voided_by = ?
      WHERE id = ?
    `).run(reason, now, voidedBy, transactionId);

    // Determine counter reversal type
    let reversalType: KhataTxType = 'reversal_payment';
    if (tx.type === 'credit_given') {
      reversalType = 'reversal_credit';
    } else if (tx.type === 'payment_received') {
      reversalType = 'reversal_payment';
    } else if (tx.type === 'purchase_credit') {
      reversalType = 'reversal_credit';
    } else if (tx.type === 'payment_made') {
      reversalType = 'reversal_payment';
    }

    // Execute counter-transaction to restore accurate balance
    const reversal = recordKhataTransaction(businessId, {
      partyType: tx.party_type,
      partyId: tx.party_id,
      partyName: tx.party_name,
      type: reversalType,
      amountPkr: paisaToPkr(tx.amount_paisa),
      referenceType: 'void_reversal',
      referenceId: tx.id,
      notes: `Reversal of #${tx.id}: ${reason}`,
      createdBy: voidedBy,
    });

    return {
      success: true,
      reversalTransaction: reversal,
    };
  });
}

// =============================================================================
// PRODUCTS, CATEGORIES & AUDITABLE STOCK MOVEMENTS
// =============================================================================

export function getProducts(businessId: string, search?: string): ProductRow[] {
  const db = getDatabase();
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    return db
      .prepare(`
        SELECT * FROM products
        WHERE business_id = ? AND is_active = 1 AND (name LIKE ? OR sku LIKE ? OR barcode LIKE ? OR category_name LIKE ?)
        ORDER BY name ASC
      `)
      .all(businessId, term, term, term, term) as unknown as ProductRow[];
  }
  return db
    .prepare('SELECT * FROM products WHERE business_id = ? AND is_active = 1 ORDER BY name ASC')
    .all(businessId) as unknown as ProductRow[];
}

export function createProduct(
  businessId: string,
  data: {
    name: string;
    sku?: string;
    barcode?: string;
    categoryName?: string;
    purchasePricePkr: number;
    sellingPricePkr: number;
    wholesalePricePkr?: number;
    initialStock?: number;
    lowStockThreshold?: number;
    unit?: string;
    secondaryUnit?: string;
    conversionFactor?: number;
    variantsJson?: string;
    notes?: string;
    imageUrl?: string;
    createdBy?: string;
  }
): ProductRow {
  const db = getDatabase();
  const now = new Date().toISOString();
  const productId = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const sku = data.sku?.trim() || `SKU-${Date.now().toString().slice(-6)}`;
  const initialStock = Number(data.initialStock) || 0;
  const purchasePricePaisa = pkrToPaisa(data.purchasePricePkr || 0);
  const sellingPricePaisa = pkrToPaisa(data.sellingPricePkr || 0);
  const wholesalePricePaisa = pkrToPaisa(data.wholesalePricePkr || 0);
  const catName = data.categoryName?.trim() || 'General';

  return runTransaction(() => {
    // Ensure category exists
    db.prepare(`
      INSERT OR IGNORE INTO categories (id, business_id, name, slug, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(`cat_${Date.now()}`, businessId, catName, catName.toLowerCase().replace(/\s+/g, '-'), now);

    db.prepare(`
      INSERT INTO products (
        id, business_id, category_name, name, sku, barcode,
        purchase_price_paisa, selling_price_paisa, wholesale_price_paisa, current_stock,
        low_stock_threshold, unit, secondary_unit, conversion_factor, variants_json,
        image_url, notes, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(
      productId,
      businessId,
      catName,
      data.name.trim(),
      sku,
      data.barcode?.trim() || null,
      purchasePricePaisa,
      sellingPricePaisa,
      wholesalePricePaisa,
      initialStock,
      data.lowStockThreshold || 5,
      data.unit?.trim() || 'unit',
      data.secondaryUnit?.trim() || null,
      Number(data.conversionFactor) || 1,
      data.variantsJson?.trim() || null,
      data.imageUrl || null,
      data.notes?.trim() || null,
      now,
      now
    );

    // If initial stock > 0, record auditable opening stock movement
    if (initialStock > 0) {
      db.prepare(`
        INSERT INTO stock_movements (
          id, business_id, product_id, movement_type, quantity_change,
          previous_stock, new_stock, unit_cost_paisa, reference_type,
          reference_id, notes, created_by, created_at
        ) VALUES (?, ?, ?, 'opening', ?, 0, ?, ?, 'initial', NULL, 'Initial stock entry', ?, ?)
      `).run(
        `sm_${Date.now()}_init`,
        businessId,
        productId,
        initialStock,
        initialStock,
        purchasePricePaisa,
        data.createdBy || 'Owner',
        now
      );
    }

    return db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as unknown as ProductRow;
  });
}

export function updateProduct(
  businessId: string,
  productId: string,
  updates: Partial<{
    name: string;
    categoryName: string;
    purchasePricePkr: number;
    sellingPricePkr: number;
    wholesalePricePkr: number;
    unit: string;
    secondaryUnit: string;
    conversionFactor: number;
    lowStockThreshold: number;
    notes: string;
    isActive: boolean;
  }>
): ProductRow {
  const db = getDatabase();
  const now = new Date().toISOString();

  return runTransaction(() => {
    const existing = db.prepare('SELECT * FROM products WHERE business_id = ? AND id = ?').get(businessId, productId) as unknown as ProductRow | undefined;
    if (!existing) throw new Error(`Product ${productId} not found`);

    if (updates.name !== undefined) db.prepare('UPDATE products SET name = ?, updated_at = ? WHERE id = ?').run(updates.name.trim(), now, productId);
    if (updates.categoryName !== undefined) db.prepare('UPDATE products SET category_name = ?, updated_at = ? WHERE id = ?').run(updates.categoryName.trim(), now, productId);
    if (updates.purchasePricePkr !== undefined) db.prepare('UPDATE products SET purchase_price_paisa = ?, updated_at = ? WHERE id = ?').run(pkrToPaisa(updates.purchasePricePkr), now, productId);
    if (updates.sellingPricePkr !== undefined) db.prepare('UPDATE products SET selling_price_paisa = ?, updated_at = ? WHERE id = ?').run(pkrToPaisa(updates.sellingPricePkr), now, productId);
    if (updates.wholesalePricePkr !== undefined) db.prepare('UPDATE products SET wholesale_price_paisa = ?, updated_at = ? WHERE id = ?').run(pkrToPaisa(updates.wholesalePricePkr), now, productId);
    if (updates.unit !== undefined) db.prepare('UPDATE products SET unit = ?, updated_at = ? WHERE id = ?').run(updates.unit.trim(), now, productId);
    if (updates.secondaryUnit !== undefined) db.prepare('UPDATE products SET secondary_unit = ?, updated_at = ? WHERE id = ?').run(updates.secondaryUnit.trim(), now, productId);
    if (updates.conversionFactor !== undefined) db.prepare('UPDATE products SET conversion_factor = ?, updated_at = ? WHERE id = ?').run(Number(updates.conversionFactor), now, productId);
    if (updates.lowStockThreshold !== undefined) db.prepare('UPDATE products SET low_stock_threshold = ?, updated_at = ? WHERE id = ?').run(Number(updates.lowStockThreshold), now, productId);
    if (updates.notes !== undefined) db.prepare('UPDATE products SET notes = ?, updated_at = ? WHERE id = ?').run(updates.notes.trim(), now, productId);
    if (updates.isActive !== undefined) db.prepare('UPDATE products SET is_active = ?, updated_at = ? WHERE id = ?').run(updates.isActive ? 1 : 0, now, productId);

    return db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as unknown as ProductRow;
  });
}

/**
 * Adjust stock with mandatory audit movement tracking
 */
export function adjustStock(
  businessId: string,
  productId: string,
  delta: number,
  movementType: StockMovementType,
  reason: string,
  createdBy: string = 'Owner',
  referenceType: 'invoice' | 'purchase' | 'manual' | 'void' | 'initial' = 'manual',
  referenceId: string | null = null
): { product: ProductRow; movement: StockMovementRow } {
  const db = getDatabase();

  return runTransaction(() => {
    const product = db
      .prepare('SELECT * FROM products WHERE business_id = ? AND id = ?')
      .get(businessId, productId) as unknown as ProductRow | undefined;
    if (!product) {
      throw new Error(`Product ${productId} not found in business ${businessId}`);
    }

    const prevStock = product.current_stock;
    const newStock = Math.max(0, prevStock + delta);
    const now = new Date().toISOString();
    const movementId = `sm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Record immutable stock movement
    db.prepare(`
      INSERT INTO stock_movements (
        id, business_id, product_id, movement_type, quantity_change,
        previous_stock, new_stock, unit_cost_paisa, reference_type,
        reference_id, notes, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      movementId,
      businessId,
      productId,
      movementType,
      delta,
      prevStock,
      newStock,
      product.purchase_price_paisa,
      referenceType,
      referenceId,
      reason,
      createdBy,
      now
    );

    // 2. Update product stock
    db.prepare('UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?').run(newStock, now, productId);

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as unknown as ProductRow;
    const movement = db.prepare('SELECT * FROM stock_movements WHERE id = ?').get(movementId) as unknown as StockMovementRow;

    return { product: updatedProduct, movement };
  });
}

/**
 * Verify complete auditable stock consistency:
 * Opening + Purchases - Sales + Returns +/- Adjustments = Current stock
 */
export function verifyProductStockConsistency(
  businessId: string,
  productId: string
): { currentStock: number; calculatedStock: number; isConsistent: boolean; totalMovements: number } {
  const db = getDatabase();
  const product = db
    .prepare('SELECT current_stock FROM products WHERE business_id = ? AND id = ?')
    .get(businessId, productId) as { current_stock: number } | undefined;

  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  const sumRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(quantity_change), 0) AS total_delta,
        COUNT(*) AS move_count
      FROM stock_movements
      WHERE business_id = ? AND product_id = ?
    `)
    .get(businessId, productId) as { total_delta: number; move_count: number };

  const calculatedStock = Math.max(0, sumRow.total_delta);
  const isConsistent = Math.abs(calculatedStock - product.current_stock) < 0.001;

  return {
    currentStock: product.current_stock,
    calculatedStock,
    isConsistent,
    totalMovements: sumRow.move_count,
  };
}

// =============================================================================
// SALES, SALE ITEMS, AUTOMATIC STOCK DEDUCTION & KHATA CREDIT
// =============================================================================

export interface CreateSaleInput {
  invoiceNumber?: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  salesmanId?: string;
  salesmanName?: string;
  salesmanCommissionPkr?: number;
  collectedBySalesman?: boolean;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPricePkr: number;
    purchasePricePkr?: number;
    unit?: string;
    variantId?: string;
    variantName?: string;
  }>;
  discountPkr?: number;
  taxPkr?: number;
  paidAmountPkr: number;
  paymentMethod: 'cash' | 'jazzcash' | 'easypaisa' | 'bank' | 'credit';
  notes?: string;
  createdBy?: string;
}

export function createSale(businessId: string, input: CreateSaleInput): { sale: SaleRow; items: SaleItemRow[] } {
  const db = getDatabase();
  if (!input.items || input.items.length === 0) {
    throw new Error('Sale must contain at least one item');
  }

  return runTransaction(() => {
    const now = new Date().toISOString();
    const saleId = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Generate consecutive sequential invoice number if not provided
    let invoiceNo = input.invoiceNumber?.trim();
    if (!invoiceNo) {
      const countRow = db
        .prepare('SELECT COUNT(*) as cnt FROM sales WHERE business_id = ?')
        .get(businessId) as { cnt: number };
      invoiceNo = `INV-${1000 + countRow.cnt + 1}`;
    }

    // Lookup salesman if provided
    let salesmanName = input.salesmanName?.trim() || null;
    let salesmanStaff: StaffRow | undefined;
    if (input.salesmanId) {
      salesmanStaff = db.prepare('SELECT * FROM staff WHERE business_id = ? AND id = ?').get(businessId, input.salesmanId) as unknown as StaffRow | undefined;
      if (salesmanStaff && !salesmanName) {
        salesmanName = salesmanStaff.name;
      }
    }

    // Calculate subtotal, discount, tax, total
    let subtotalPaisa = 0;
    const preparedItems: Array<{
      id: string;
      productId: string;
      productName: string;
      quantity: number;
      unitPricePaisa: number;
      purchasePricePaisa: number;
      totalPaisa: number;
      unit: string;
      variantId?: string;
      variantName?: string;
    }> = [];

    for (const item of input.items) {
      let pName = item.productName?.trim();
      let defaultPurchasePricePaisa = 0;
      let defaultUnit = item.unit;

      const dbProd = db.prepare('SELECT name, purchase_price_paisa, unit FROM products WHERE id = ?').get(item.productId) as { name: string; purchase_price_paisa: number; unit: string } | undefined;
      if (dbProd) {
        if (!pName) pName = dbProd.name;
        defaultPurchasePricePaisa = dbProd.purchase_price_paisa || 0;
        if (!defaultUnit) defaultUnit = dbProd.unit;
      }
      if (!pName) pName = 'Product';

      const unitPricePaisa = pkrToPaisa(item.unitPricePkr);
      const purchasePricePaisa = item.purchasePricePkr !== undefined ? pkrToPaisa(item.purchasePricePkr) : defaultPurchasePricePaisa;
      const totalPaisa = Math.round(item.quantity * unitPricePaisa);
      subtotalPaisa += totalPaisa;

      preparedItems.push({
        id: `si_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        productId: item.productId,
        productName: pName,
        quantity: item.quantity,
        unitPricePaisa,
        purchasePricePaisa,
        totalPaisa,
        unit: defaultUnit || 'unit',
        variantId: item.variantId,
        variantName: item.variantName,
      });
    }

    const discountPaisa = pkrToPaisa(input.discountPkr || 0);
    const taxPaisa = pkrToPaisa(input.taxPkr || 0);
    const totalPaisa = Math.max(0, subtotalPaisa - discountPaisa + taxPaisa);
    const paidAmountPaisa = Math.min(totalPaisa, pkrToPaisa(input.paidAmountPkr || 0));

    // Calculate salesman commission
    let commissionPaisa = 0;
    if (input.salesmanCommissionPkr !== undefined) {
      commissionPaisa = pkrToPaisa(input.salesmanCommissionPkr);
    } else if (salesmanStaff && (salesmanStaff.commission_rate_percentage || 0) > 0) {
      commissionPaisa = Math.round(totalPaisa * ((salesmanStaff.commission_rate_percentage || 0) / 100));
    }

    let paymentStatus: 'paid' | 'unpaid' | 'partial' = 'paid';
    if (paidAmountPaisa === 0) {
      paymentStatus = 'unpaid';
    } else if (paidAmountPaisa < totalPaisa) {
      paymentStatus = 'partial';
    }

    // 1. Insert into sales table
    db.prepare(`
      INSERT INTO sales (
        id, business_id, invoice_number, customer_id, customer_name,
        customer_phone, salesman_id, salesman_name, salesman_commission_paisa,
        subtotal_paisa, discount_paisa, tax_paisa,
        total_amount_paisa, paid_amount_paisa, payment_method, payment_status,
        notes, created_by, created_at, is_voided
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      saleId,
      businessId,
      invoiceNo,
      input.customerId || null,
      input.customerName.trim(),
      input.customerPhone?.trim() || null,
      input.salesmanId || null,
      salesmanName,
      commissionPaisa,
      subtotalPaisa,
      discountPaisa,
      taxPaisa,
      totalPaisa,
      paidAmountPaisa,
      input.paymentMethod,
      paymentStatus,
      input.notes?.trim() || null,
      input.createdBy || 'Owner',
      now
    );

    // If commission generated for salesman, record in staff_transactions and central commissions
    if (commissionPaisa > 0 && input.salesmanId) {
      db.prepare(`
        INSERT INTO staff_transactions (
          id, business_id, staff_id, type, amount_paisa, date, notes, created_by, created_at
        ) VALUES (?, ?, ?, 'commission', ?, ?, ?, ?, ?)
      `).run(
        `st_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        businessId,
        input.salesmanId,
        commissionPaisa,
        now.slice(0, 10),
        `Commission on Invoice #${invoiceNo} (${salesmanName || 'Salesman'})`,
        input.createdBy || 'Owner',
        now
      );

      db.prepare(`
        INSERT INTO commissions (
          id, business_id, party_name, type, related_sale_id, deal_reference,
          rate_percentage, amount_paisa, paid_amount_paisa, status, date, notes, created_at, updated_at
        ) VALUES (?, ?, ?, 'payable', ?, ?, ?, ?, 0, 'unpaid', ?, ?, ?, ?)
      `).run(
        `comm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        businessId,
        salesmanName || 'Salesman',
        saleId,
        invoiceNo,
        salesmanStaff?.commission_rate_percentage || null,
        commissionPaisa,
        now.slice(0, 10),
        `Sales commission on Invoice #${invoiceNo}`,
        now,
        now
      );
    }

    // If cash was collected in field by salesman, add to salesman's cash_in_hand_paisa until settled
    if (input.collectedBySalesman && input.salesmanId && paidAmountPaisa > 0) {
      db.prepare('UPDATE staff SET cash_in_hand_paisa = COALESCE(cash_in_hand_paisa, 0) + ? WHERE business_id = ? AND id = ?')
        .run(paidAmountPaisa, businessId, input.salesmanId);
    }

    // 2. Insert sale items and deduct stock with multi-unit conversion and variants
    for (const pItem of preparedItems) {
      db.prepare(`
        INSERT INTO sale_items (
          id, sale_id, business_id, product_id, product_name,
          quantity, unit_price_paisa, purchase_price_paisa, total_paisa, unit,
          variant_id, variant_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        pItem.id,
        saleId,
        businessId,
        pItem.productId,
        pItem.productName,
        pItem.quantity,
        pItem.unitPricePaisa,
        pItem.purchasePricePaisa,
        pItem.totalPaisa,
        pItem.unit,
        pItem.variantId || null,
        pItem.variantName || null
      );

      // Fetch product to calculate canonical base quantity
      const prod = db
        .prepare('SELECT current_stock, unit, secondary_unit, conversion_factor FROM products WHERE business_id = ? AND id = ?')
        .get(businessId, pItem.productId) as { current_stock: number; unit: string; secondary_unit?: string | null; conversion_factor?: number } | undefined;

      if (prod) {
        const baseQty = calculateBaseQuantity(prod, pItem.unit, pItem.quantity);

        // Adjust variant stock if applicable
        if (pItem.variantId) {
          try {
            adjustVariantStock(businessId, pItem.variantId, -pItem.quantity);
          } catch {
            // Variant might be soft deleted, proceed
          }
        }

        // Deduct base canonical quantity from main stock
        adjustStock(
          businessId,
          pItem.productId,
          -baseQty,
          'sale',
          `Sale Invoice #${invoiceNo}${pItem.unit && pItem.unit !== prod.unit ? ` (${pItem.quantity} ${pItem.unit} = ${baseQty} ${prod.unit})` : ''}`,
          input.createdBy || 'Owner',
          'invoice',
          saleId
        );
      }
    }

    // 3. Central Financial Accounts Integration: Record Money In for paid portion
    if (paidAmountPaisa > 0 && input.paymentMethod !== 'credit') {
      const validAccounts: Record<string, FinancialAccountType> = {
        cash: 'cash',
        bank: 'bank',
        easypaisa: 'easypaisa',
        jazzcash: 'jazzcash',
      };
      const accType: FinancialAccountType = validAccounts[input.paymentMethod] || 'cash';

      recordFinancialTransaction(businessId, {
        accountType: accType,
        type: 'money_in',
        amountPkr: paisaToPkr(paidAmountPaisa),
        category: 'sale',
        referenceType: 'invoice',
        referenceId: saleId,
        description: `Sale received for Invoice #${invoiceNo} (${input.customerName}) via ${accType.toUpperCase()}`,
        createdBy: input.createdBy || 'Owner',
      });
    }

    // 4. If credit sale (unpaid amount > 0 and customer is chosen), update Khata ledger
    const unpaidPaisa = totalPaisa - paidAmountPaisa;
    if (unpaidPaisa > 0 && input.customerId) {
      recordKhataTransaction(businessId, {
        partyType: 'customer',
        partyId: input.customerId,
        partyName: input.customerName,
        type: 'credit_given',
        amountPkr: paisaToPkr(unpaidPaisa),
        referenceType: 'invoice',
        referenceId: saleId,
        notes: `Invoice #${invoiceNo} baqaya udhaar`,
        idempotencyKey: `sale_khata_${saleId}`,
        createdBy: input.createdBy || 'Owner',
      });
    }

    // 5. Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, business_id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, ?, 'CREATE_SALE', 'sale', ?, ?, ?)
    `).run(
      generateId('aud'),
      businessId,
      input.createdBy || 'Owner',
      saleId,
      `Created Invoice #${invoiceNo} for ${input.customerName} - Total: Rs. ${paisaToPkr(totalPaisa)}`,
      now
    );

    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId) as unknown as SaleRow;
    const items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId) as unknown as SaleItemRow[];

    return { sale, items };
  });
}

/**
 * Void/Cancel Sale with automatic stock reversal and khata reversal
 */
export function voidSale(
  businessId: string,
  saleId: string,
  reason: string,
  voidedBy: string = 'Owner'
): { success: boolean; voidedSale: SaleRow } {
  const db = getDatabase();
  const sale = db.prepare('SELECT * FROM sales WHERE business_id = ? AND id = ?').get(businessId, saleId) as unknown as SaleRow | undefined;
  if (!sale) throw new Error(`Sale ${saleId} not found`);
  if (sale.is_voided) throw new Error(`Sale ${saleId} already voided`);

  return runTransaction(() => {
    const now = new Date().toISOString();

    // 1. Mark sale as voided
    db.prepare(`
      UPDATE sales
      SET is_voided = 1, void_reason = ?, voided_at = ?, voided_by = ?
      WHERE id = ?
    `).run(reason, now, voidedBy, saleId);

    // 2. Reverse stock deductions for all line items
    const items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId) as unknown as SaleItemRow[];
    for (const item of items) {
      const prod = db.prepare('SELECT id FROM products WHERE business_id = ? AND id = ?').get(businessId, item.product_id);
      if (prod) {
        adjustStock(
          businessId,
          item.product_id,
          item.quantity,
          'void_reversal',
          `Reversal of Voided Invoice #${sale.invoice_number}: ${reason}`,
          voidedBy,
          'void',
          saleId
        );
      }
    }

    // 3. If credit khata was recorded, void the khata transaction
    const unpaidPaisa = sale.total_amount_paisa - sale.paid_amount_paisa;
    if (unpaidPaisa > 0 && sale.customer_id) {
      const khataTx = db
        .prepare('SELECT id FROM khata_transactions WHERE business_id = ? AND reference_id = ? AND is_voided = 0')
        .get(businessId, saleId) as { id: string } | undefined;
      if (khataTx) {
        voidKhataTransaction(businessId, khataTx.id, `Sale #${sale.invoice_number} voided`, voidedBy);
      }
    }

    const updatedSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId) as unknown as SaleRow;
    return { success: true, voidedSale: updatedSale };
  });
}

export function getSales(businessId: string, limit: number = 100): SaleRow[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM sales WHERE business_id = ? ORDER BY created_at DESC LIMIT ?').all(businessId, limit) as unknown as SaleRow[];
}

// =============================================================================
// PURCHASES & SUPPLIERS
// =============================================================================

export function getPurchases(businessId: string, limit: number = 100): PurchaseRow[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM purchases WHERE business_id = ? ORDER BY created_at DESC LIMIT ?').all(businessId, limit) as unknown as PurchaseRow[];
}

export function getSuppliers(businessId: string): SupplierRow[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM suppliers WHERE business_id = ? AND is_active = 1 ORDER BY name ASC').all(businessId) as unknown as SupplierRow[];
}

export function createSupplier(businessId: string, data: { name: string; phone: string; companyName?: string; notes?: string }): SupplierRow {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = `supp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  db.prepare(`
    INSERT INTO suppliers (id, business_id, name, phone, company_name, payable_balance_paisa, is_active, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 0, 1, ?, ?, ?)
  `).run(id, businessId, data.name.trim(), data.phone.trim(), data.companyName?.trim() || null, data.notes?.trim() || null, now, now);

  return db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id) as unknown as SupplierRow;
}

export interface CreatePurchaseInput {
  supplierId?: string;
  supplierName: string;
  supplierInvoiceNo?: string;
  items: Array<{
    productId?: string;
    productName: string;
    quantity: number;
    costPricePkr: number;
    unit?: string;
    variantId?: string;
    variantName?: string;
  }>;
  paidAmountPkr: number;
  paymentMethod?: 'cash' | 'jazzcash' | 'easypaisa' | 'bank' | 'credit';
  notes?: string;
  date?: string;
  createdBy?: string;
}

export function createPurchase(businessId: string, input: CreatePurchaseInput): { purchase: PurchaseRow; items: PurchaseItemRow[] } {
  const db = getDatabase();
  if (!input.items || input.items.length === 0) {
    throw new Error('Purchase must contain at least one item');
  }

  return runTransaction(() => {
    const now = new Date().toISOString();
    const purchaseId = `purch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Resolve or auto-create supplier so Khata is never orphaned
    let finalSupplierId = input.supplierId;
    if (!finalSupplierId && input.supplierName.trim()) {
      const existingSupp = db
        .prepare('SELECT id FROM suppliers WHERE business_id = ? AND name = ?')
        .get(businessId, input.supplierName.trim()) as { id: string } | undefined;
      if (existingSupp) {
        finalSupplierId = existingSupp.id;
      } else {
        const newSupp = createSupplier(businessId, {
          name: input.supplierName.trim(),
          phone: '',
          notes: 'Auto-created from purchase bill',
        });
        finalSupplierId = newSupp.id;
      }
    }

    let totalAmountPaisa = 0;
    const preparedItems: Array<{
      id: string;
      productId: string;
      productName: string;
      quantity: number;
      costPricePaisa: number;
      totalPaisa: number;
      unit: string;
      variantId?: string;
      variantName?: string;
    }> = [];

    for (const item of input.items) {
      const costPricePaisa = pkrToPaisa(item.costPricePkr);
      const totalPaisa = Math.round(item.quantity * costPricePaisa);
      totalAmountPaisa += totalPaisa;

      let pId = item.productId;
      if (!pId) {
        // Find by name or create
        const match = db
          .prepare('SELECT id FROM products WHERE business_id = ? AND name = ?')
          .get(businessId, item.productName.trim()) as { id: string } | undefined;
        if (match) {
          pId = match.id;
        } else {
          const newP = createProduct(businessId, {
            name: item.productName.trim(),
            categoryName: 'General',
            purchasePricePkr: item.costPricePkr,
            sellingPricePkr: item.costPricePkr * 1.2,
            initialStock: 0,
            unit: item.unit || 'unit',
          });
          pId = newP.id;
        }
      }

      preparedItems.push({
        id: `pi_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        productId: pId,
        productName: item.productName.trim(),
        quantity: item.quantity,
        costPricePaisa,
        totalPaisa,
        unit: item.unit || 'unit',
        variantId: item.variantId,
        variantName: item.variantName,
      });
    }

    const paidAmountPaisa = pkrToPaisa(input.paidAmountPkr || 0);
    const balanceAmountPaisa = Math.max(0, totalAmountPaisa - paidAmountPaisa);
    const paymentStatus: 'paid' | 'unpaid' | 'partial' =
      balanceAmountPaisa === 0 ? 'paid' : paidAmountPaisa > 0 ? 'partial' : 'unpaid';

    // 1. Insert into purchases table
    db.prepare(`
      INSERT INTO purchases (
        id, business_id, supplier_id, supplier_name, supplier_invoice_no,
        total_amount_paisa, paid_amount_paisa, balance_amount_paisa,
        payment_status, date, notes, created_by, created_at, is_voided
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      purchaseId,
      businessId,
      finalSupplierId || null,
      input.supplierName.trim(),
      input.supplierInvoiceNo?.trim() || `PUR-${Date.now().toString().slice(-4)}`,
      totalAmountPaisa,
      paidAmountPaisa,
      balanceAmountPaisa,
      paymentStatus,
      input.date || now,
      input.notes?.trim() || null,
      input.createdBy || 'Owner',
      now
    );

    // 2. Insert items and add stock with multi-unit conversion and variants
    for (const pItem of preparedItems) {
      db.prepare(`
        INSERT INTO purchase_items (
          id, purchase_id, business_id, product_id, product_name,
          quantity, cost_price_paisa, total_paisa, unit, variant_id, variant_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        pItem.id,
        purchaseId,
        businessId,
        pItem.productId,
        pItem.productName,
        pItem.quantity,
        pItem.costPricePaisa,
        pItem.totalPaisa,
        pItem.unit,
        pItem.variantId || null,
        pItem.variantName || null
      );

      // Fetch product to calculate canonical base quantity
      const prod = db
        .prepare('SELECT current_stock, unit, secondary_unit, conversion_factor FROM products WHERE business_id = ? AND id = ?')
        .get(businessId, pItem.productId) as { current_stock: number; unit: string; secondary_unit?: string | null; conversion_factor?: number } | undefined;

      const baseQty = prod ? calculateBaseQuantity(prod, pItem.unit, pItem.quantity) : pItem.quantity;

      if (pItem.variantId) {
        try {
          adjustVariantStock(businessId, pItem.variantId, pItem.quantity);
        } catch {
          // Proceed
        }
      }

      adjustStock(
        businessId,
        pItem.productId,
        baseQty,
        'purchase',
        `Purchase Bill #${input.supplierInvoiceNo || purchaseId}${pItem.unit && prod && pItem.unit !== prod.unit ? ` (${pItem.quantity} ${pItem.unit} = ${baseQty} ${prod.unit})` : ''}`,
        input.createdBy || 'Owner',
        'purchase',
        purchaseId
      );
    }

    // 3. Central Financial Accounts Integration: Deduct Money Out for paid portion
    if (paidAmountPaisa > 0 && input.paymentMethod !== 'credit') {
      const validAccounts: Record<string, FinancialAccountType> = {
        cash: 'cash',
        bank: 'bank',
        easypaisa: 'easypaisa',
        jazzcash: 'jazzcash',
      };
      const accType: FinancialAccountType = (input.paymentMethod && validAccounts[input.paymentMethod.toLowerCase()]) || 'cash';

      recordFinancialTransaction(businessId, {
        accountType: accType,
        type: 'money_out',
        amountPkr: paisaToPkr(paidAmountPaisa),
        category: 'purchase',
        referenceType: 'purchase',
        referenceId: purchaseId,
        description: `Purchase payment for Bill #${input.supplierInvoiceNo || purchaseId} (${input.supplierName}) via ${accType.toUpperCase()}`,
        createdBy: input.createdBy || 'Owner',
      });
    }

    // 4. If credit purchase (unpaid balance), update supplier Khata
    if (balanceAmountPaisa > 0 && finalSupplierId) {
      recordKhataTransaction(businessId, {
        partyType: 'supplier',
        partyId: finalSupplierId,
        partyName: input.supplierName,
        type: 'purchase_credit',
        amountPkr: paisaToPkr(balanceAmountPaisa),
        referenceType: 'purchase',
        referenceId: purchaseId,
        notes: `Purchase Bill #${input.supplierInvoiceNo || ''}`,
        idempotencyKey: `purch_khata_${purchaseId}`,
        createdBy: input.createdBy || 'Owner',
      });
    }

    const purchase = db.prepare('SELECT * FROM purchases WHERE id = ?').get(purchaseId) as unknown as PurchaseRow;
    const items = db.prepare('SELECT * FROM purchase_items WHERE purchase_id = ?').all(purchaseId) as unknown as PurchaseItemRow[];

    return { purchase, items };
  });
}

// =============================================================================
// EXPENSES (ISOLATED RECORD KEEPING & FINANCIAL LEDGER INTEGRATION)
// =============================================================================

export function getExpenses(businessId: string, limit: number = 100): ExpenseRow[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM expenses WHERE business_id = ? ORDER BY date DESC LIMIT ?').all(businessId, limit) as unknown as ExpenseRow[];
}

export function createExpense(
  businessId: string,
  data: {
    category: string;
    amountPkr: number;
    paidVia?: string;
    notes?: string;
    date?: string;
    createdBy?: string;
  }
): ExpenseRow {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(data.amountPkr);
  if (amountPaisa <= 0) {
    throw new Error('Expense amount must be greater than zero');
  }

  return runTransaction(() => {
    const now = new Date().toISOString();
    const id = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const paidViaStr = data.paidVia || 'Cash';

    // Map paidVia to financial account type
    const methodLower = paidViaStr.toLowerCase();
    let accountType: FinancialAccountType = 'cash';
    if (methodLower.includes('bank')) accountType = 'bank';
    else if (methodLower.includes('easypaisa')) accountType = 'easypaisa';
    else if (methodLower.includes('jazzcash')) accountType = 'jazzcash';

    // 1. Deduct expense from central financial account
    const finRes = recordFinancialTransaction(businessId, {
      accountType,
      type: 'money_out',
      amountPkr: data.amountPkr,
      category: 'expense',
      referenceType: 'expense',
      referenceId: id,
      description: `Expense: ${data.category}${data.notes ? ` - ${data.notes}` : ''} (paid via ${paidViaStr})`,
      createdBy: data.createdBy || 'Owner',
    });

    // 2. Insert into expenses table with account_id
    db.prepare(`
      INSERT INTO expenses (id, business_id, category, amount_paisa, paid_via, account_id, notes, date, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      businessId,
      data.category.trim(),
      amountPaisa,
      paidViaStr,
      finRes.account.id,
      data.notes?.trim() || null,
      data.date || now,
      data.createdBy || 'Owner',
      now
    );

    return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id) as unknown as ExpenseRow;
  });
}

export function deleteExpense(businessId: string, id: string): boolean {
  const db = getDatabase();
  const res = db.prepare('DELETE FROM expenses WHERE business_id = ? AND id = ?').run(businessId, id);
  return res.changes > 0;
}

// =============================================================================
// HIGH-PERFORMANCE MATHEMATICAL SUMMARIES (NO AI INVOLVED)
// =============================================================================

export function getTodayDashboardSummary(businessId: string): {
  todaySalesPkr: number;
  todaySalesCount: number;
  todayExpensesPkr: number;
  totalCustomerUdhaarPkr: number;
  totalSupplierPayablePkr: number;
  totalStockValuePkr: number;
  lowStockItemsCount: number;
} {
  const db = getDatabase();
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Today sales
  const salesRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(total_amount_paisa), 0) AS total_sales_paisa,
        COUNT(*) AS total_count
      FROM sales
      WHERE business_id = ? AND is_voided = 0 AND created_at LIKE ?
    `)
    .get(businessId, `${todayStr}%`) as { total_sales_paisa: number; total_count: number };

  // 2. Today expenses
  const expRow = db
    .prepare(`
      SELECT COALESCE(SUM(amount_paisa), 0) AS total_exp_paisa
      FROM expenses
      WHERE business_id = ? AND date LIKE ?
    `)
    .get(businessId, `${todayStr}%`) as { total_exp_paisa: number };

  // 3. Customer Udhaar
  const custRow = db
    .prepare(`
      SELECT COALESCE(SUM(CASE WHEN current_balance_paisa > 0 THEN current_balance_paisa ELSE 0 END), 0) AS total_udhaar
      FROM customers
      WHERE business_id = ? AND is_active = 1
    `)
    .get(businessId) as { total_udhaar: number };

  // 4. Supplier Payable
  const suppRow = db
    .prepare(`
      SELECT COALESCE(SUM(CASE WHEN payable_balance_paisa > 0 THEN payable_balance_paisa ELSE 0 END), 0) AS total_payable
      FROM suppliers
      WHERE business_id = ? AND is_active = 1
    `)
    .get(businessId) as { total_payable: number };

  // 5. Stock inventory valuation
  const stockRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(current_stock * purchase_price_paisa), 0) AS total_val,
        COUNT(CASE WHEN current_stock <= low_stock_threshold THEN 1 END) AS low_stock_count
      FROM products
      WHERE business_id = ? AND is_active = 1
    `)
    .get(businessId) as { total_val: number; low_stock_count: number };

  return {
    todaySalesPkr: paisaToPkr(salesRow.total_sales_paisa),
    todaySalesCount: salesRow.total_count,
    todayExpensesPkr: paisaToPkr(expRow.total_exp_paisa),
    totalCustomerUdhaarPkr: paisaToPkr(custRow.total_udhaar),
    totalSupplierPayablePkr: paisaToPkr(suppRow.total_payable),
    totalStockValuePkr: paisaToPkr(stockRow.total_val),
    lowStockItemsCount: stockRow.low_stock_count,
  };
}

// =============================================================================
// AI USAGE LOGGING & AUDIT TRAIL
// =============================================================================

export function logAIUsage(
  businessId: string,
  model: string,
  promptLength: number,
  tokensEstimated: number,
  costPkrEstimated: number,
  routingSource: string,
  actionProposed: string | null = null,
  success: boolean = true
): void {
  const db = getDatabase();
  const id = `ai_log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  db.prepare(`
    INSERT INTO ai_usage_logs (
      id, business_id, model, prompt_length, tokens_estimated,
      cost_pkr_estimated, routing_source, action_proposed, success, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    businessId,
    model,
    promptLength,
    tokensEstimated,
    costPkrEstimated,
    routingSource,
    actionProposed,
    success ? 1 : 0,
    new Date().toISOString()
  );
}

export function getAIUsageSummary(businessId: string): { totalCalls: number; totalTokens: number; totalCostPkr: number } {
  const db = getDatabase();
  const row = db
    .prepare(`
      SELECT 
        COUNT(*) AS total_calls,
        COALESCE(SUM(tokens_estimated), 0) AS total_tokens,
        COALESCE(SUM(cost_pkr_estimated), 0) AS total_cost
      FROM ai_usage_logs
      WHERE business_id = ?
    `)
    .get(businessId) as { total_calls: number; total_tokens: number; total_cost: number };

  return {
    totalCalls: row.total_calls,
    totalTokens: row.total_tokens,
    totalCostPkr: Math.round(row.total_cost * 100) / 100,
  };
}

// =============================================================================
// PHASE 2: STAFF / EMPLOYEE HISAAB (SALARY, ADVANCES, ATTENDANCE)
// =============================================================================

function resolveTargetFinancialAccount(
  db: any,
  businessId: string,
  accountId?: string,
  paymentMethod?: string
): FinancialAccountRow {
  ensureDefaultFinancialAccounts(businessId);
  if (accountId) {
    const acc = db
      .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND id = ?')
      .get(businessId, accountId) as FinancialAccountRow | undefined;
    if (acc) return acc;
  }
  let accType: FinancialAccountType = 'cash';
  const method = (paymentMethod || 'cash').toLowerCase();
  if (method === 'bank' || method.includes('bank')) accType = 'bank';
  else if (method === 'easypaisa' || method.includes('easy')) accType = 'easypaisa';
  else if (method === 'jazzcash' || method.includes('jazz')) accType = 'jazzcash';
  else accType = 'cash';

  const acc = db
    .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND type = ?')
    .get(businessId, accType) as FinancialAccountRow | undefined;
  if (!acc) throw new Error(`Financial account of type ${accType} not found for business ${businessId}`);
  return acc;
}

export interface TransferBetweenAccountsInput {
  fromAccountType?: string;
  fromAccountId?: string;
  toAccountType?: string;
  toAccountId?: string;
  amountPkr: number;
  description?: string;
  createdBy?: string;
}

/**
 * Account-to-Account Money Transfer (e.g. Cash -> Bank, Cash -> Easypaisa)
 * Updates both accounts atomically with zero impact on P&L (not an expense or sale)
 */
export function transferBetweenAccounts(
  businessId: string,
  input: TransferBetweenAccountsInput
): {
  fromAccount: FinancialAccountRow;
  toAccount: FinancialAccountRow;
  fromTx: FinancialTransactionRow;
  toTx: FinancialTransactionRow;
} {
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) {
    throw new Error('Transfer amount must be positive');
  }

  return runTransaction(() => {
    const db = getDatabase();
    ensureDefaultFinancialAccounts(businessId);

    const fromAcc = resolveTargetFinancialAccount(db, businessId, input.fromAccountId, input.fromAccountType);
    const toAcc = resolveTargetFinancialAccount(db, businessId, input.toAccountId, input.toAccountType);

    if (fromAcc.id === toAcc.id) {
      throw new Error('Source and destination accounts must be distinct');
    }

    const now = new Date().toISOString();
    const transferId = `trf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const fromTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const toTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Deduct from source account
    const fromPrevBal = fromAcc.current_balance_paisa;
    const fromNewBal = fromPrevBal - amountPaisa;
    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      fromNewBal,
      now,
      fromAcc.id
    );

    // 2. Add to destination account
    const toPrevBal = toAcc.current_balance_paisa;
    const toNewBal = toPrevBal + amountPaisa;
    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      toNewBal,
      now,
      toAcc.id
    );

    const desc = input.description?.trim() || `Transfer from ${fromAcc.name} to ${toAcc.name}`;

    // 3. Insert transfer_out transaction
    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'transfer_out', ?, ?, ?, 'transfer', 'account_transfer', ?, ?, ?, ?)
    `).run(
      fromTxId,
      businessId,
      fromAcc.id,
      amountPaisa,
      fromPrevBal,
      fromNewBal,
      transferId,
      desc,
      input.createdBy || 'Owner',
      now
    );

    // 4. Insert transfer_in transaction
    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'transfer_in', ?, ?, ?, 'transfer', 'account_transfer', ?, ?, ?, ?)
    `).run(
      toTxId,
      businessId,
      toAcc.id,
      amountPaisa,
      toPrevBal,
      toNewBal,
      transferId,
      desc,
      input.createdBy || 'Owner',
      now
    );

    const updatedFromAcc = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(fromAcc.id) as unknown as FinancialAccountRow;
    const updatedToAcc = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(toAcc.id) as unknown as FinancialAccountRow;
    const fromTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(fromTxId) as unknown as FinancialTransactionRow;
    const toTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(toTxId) as unknown as FinancialTransactionRow;

    return {
      fromAccount: updatedFromAcc,
      toAccount: updatedToAcc,
      fromTx,
      toTx,
    };
  });
}

export function createStaff(
  businessId: string,
  data: {
    employeeId?: string;
    name: string;
    phone?: string;
    role?: string;
    joiningDate?: string;
    salaryPkr: number;
    commissionRatePercentage?: number;
  }
): StaffRow {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = `staff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const salaryPaisa = pkrToPaisa(data.salaryPkr || 0);

  db.prepare(`
    INSERT INTO staff (
      id, business_id, employee_id, name, phone, role, joining_date,
      salary_paisa, advance_balance_paisa, commission_rate_percentage, cash_in_hand_paisa,
      status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, 'active', ?, ?)
  `).run(
    id,
    businessId,
    data.employeeId?.trim() || `EMP-${Date.now().toString().slice(-4)}`,
    data.name.trim(),
    data.phone?.trim() || null,
    data.role?.trim() || 'Staff',
    data.joiningDate || now.split('T')[0],
    salaryPaisa,
    data.commissionRatePercentage || 0,
    now,
    now
  );

  return db.prepare('SELECT * FROM staff WHERE id = ?').get(id) as unknown as StaffRow;
}

export function getStaffList(businessId: string): StaffRow[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM staff WHERE business_id = ? ORDER BY name ASC')
    .all(businessId) as unknown as StaffRow[];
}

export function getStaffById(businessId: string, staffId: string): StaffRow | undefined {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM staff WHERE business_id = ? AND id = ?')
    .get(businessId, staffId) as unknown as StaffRow | undefined;
}

export interface RecordStaffTransactionInput {
  staffId: string;
  type: 'salary_payment' | 'advance' | 'commission' | 'bonus' | 'other_payment';
  amountPkr: number;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountId?: string;
  date?: string;
  notes?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function recordStaffTransaction(
  businessId: string,
  input: RecordStaffTransactionInput
): {
  staffTransaction: StaffTransactionRow;
  financialTransaction: FinancialTransactionRow;
  account: FinancialAccountRow;
  staff: StaffRow;
} {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) {
    throw new Error('Staff transaction amount must be positive');
  }

  return runTransaction(() => {
    // Idempotency check
    if (input.idempotencyKey) {
      const existing = db
        .prepare('SELECT * FROM staff_transactions WHERE business_id = ? AND idempotency_key = ?')
        .get(businessId, input.idempotencyKey) as unknown as StaffTransactionRow | undefined;
      if (existing) {
        const finTx = existing.financial_transaction_id
          ? (db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(existing.financial_transaction_id) as unknown as FinancialTransactionRow)
          : ({} as FinancialTransactionRow);
        const acc = existing.account_id
          ? (db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(existing.account_id) as unknown as FinancialAccountRow)
          : ({} as FinancialAccountRow);
        const staff = db.prepare('SELECT * FROM staff WHERE id = ?').get(existing.staff_id) as unknown as StaffRow;
        return { staffTransaction: existing, financialTransaction: finTx, account: acc, staff };
      }
    }

    const staff = db
      .prepare('SELECT * FROM staff WHERE business_id = ? AND id = ?')
      .get(businessId, input.staffId) as unknown as StaffRow | undefined;
    if (!staff) {
      throw new Error(`Staff member with ID ${input.staffId} not found`);
    }

    const targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
    const now = new Date().toISOString();
    const txDate = input.date || now.split('T')[0];
    const staffTxId = `stx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Deduct from Financial Account
    const prevBal = targetAccount.current_balance_paisa;
    const newBal = prevBal - amountPaisa;

    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      newBal,
      now,
      targetAccount.id
    );

    // 2. Insert into Financial Transactions (Category: staff_salary or staff_advance etc.)
    const categoryName = `staff_${input.type}`;
    const desc = `${input.type === 'salary_payment' ? 'Salary Paid' : input.type === 'advance' ? 'Advance Given' : 'Payment'} to ${staff.name} (${staff.employee_id || 'Staff'})`;

    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'money_out', ?, ?, ?, ?, 'staff', ?, ?, ?, ?)
    `).run(
      finTxId,
      businessId,
      targetAccount.id,
      amountPaisa,
      prevBal,
      newBal,
      categoryName,
      staff.id,
      desc,
      input.createdBy || 'Owner',
      now
    );

    // 3. Update staff record if type is advance
    let newAdvanceBal = staff.advance_balance_paisa;
    if (input.type === 'advance') {
      newAdvanceBal += amountPaisa;
      db.prepare('UPDATE staff SET advance_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newAdvanceBal,
        now,
        staff.id
      );
    } else if (input.type === 'salary_payment' && staff.advance_balance_paisa > 0 && input.notes?.includes('deduct_advance')) {
      // Optional advance clearance
      newAdvanceBal = Math.max(0, staff.advance_balance_paisa - amountPaisa);
      db.prepare('UPDATE staff SET advance_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newAdvanceBal,
        now,
        staff.id
      );
    }

    // 4. Insert into staff_transactions
    db.prepare(`
      INSERT INTO staff_transactions (
        id, business_id, staff_id, type, amount_paisa,
        account_id, financial_transaction_id, date, notes,
        idempotency_key, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      staffTxId,
      businessId,
      staff.id,
      input.type,
      amountPaisa,
      targetAccount.id,
      finTxId,
      txDate,
      input.notes?.trim() || null,
      input.idempotencyKey || null,
      input.createdBy || 'Owner',
      now
    );

    const updatedStaff = db.prepare('SELECT * FROM staff WHERE id = ?').get(staff.id) as unknown as StaffRow;
    const updatedAccount = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow;
    const staffTx = db.prepare('SELECT * FROM staff_transactions WHERE id = ?').get(staffTxId) as unknown as StaffTransactionRow;
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow;

    return {
      staffTransaction: staffTx,
      financialTransaction: finTx,
      account: updatedAccount,
      staff: updatedStaff,
    };
  });
}

export function getStaffTransactions(businessId: string, staffId?: string, limit: number = 100): StaffTransactionRow[] {
  const db = getDatabase();
  if (staffId) {
    return db
      .prepare('SELECT * FROM staff_transactions WHERE business_id = ? AND staff_id = ? ORDER BY date DESC, created_at DESC LIMIT ?')
      .all(businessId, staffId, limit) as unknown as StaffTransactionRow[];
  }
  return db
    .prepare('SELECT * FROM staff_transactions WHERE business_id = ? ORDER BY date DESC, created_at DESC LIMIT ?')
    .all(businessId, limit) as unknown as StaffTransactionRow[];
}

// =============================================================================
// PHASE 2: SALESMAN MODULE (ASSIGNED SALES, FIELD RECOVERIES, SETTLEMENT, REPORTS)
// =============================================================================

export interface CreateSalesmanInput {
  name: string;
  phone?: string;
  employeeId?: string;
  salaryPkr?: number;
  commissionRatePercentage?: number;
  createdBy?: string;
}

export function createSalesman(businessId: string, input: CreateSalesmanInput): StaffRow {
  return createStaff(businessId, {
    name: input.name,
    phone: input.phone,
    employeeId: input.employeeId,
    role: 'Salesman',
    salaryPkr: input.salaryPkr || 0,
    commissionRatePercentage: input.commissionRatePercentage || 0,
  });
}

export function getSalesmen(businessId: string): StaffRow[] {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM staff WHERE business_id = ? AND (LOWER(role) = 'salesman' OR commission_rate_percentage > 0) ORDER BY name ASC")
    .all(businessId) as unknown as StaffRow[];
}

export interface RecordSalesmanRecoveryInput {
  salesmanId: string;
  customerId: string;
  amountPkr: number;
  notes?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function recordSalesmanRecovery(
  businessId: string,
  input: RecordSalesmanRecoveryInput
): {
  staff: StaffRow;
  customer: CustomerRow;
  khataTransaction: KhataTransactionRow;
} {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) throw new Error('Recovery amount must be positive');

  return runTransaction(() => {
    const salesman = db
      .prepare('SELECT * FROM staff WHERE business_id = ? AND id = ?')
      .get(businessId, input.salesmanId) as unknown as StaffRow | undefined;
    if (!salesman) throw new Error(`Salesman ${input.salesmanId} not found`);

    const customer = db
      .prepare('SELECT * FROM customers WHERE business_id = ? AND id = ?')
      .get(businessId, input.customerId) as unknown as CustomerRow | undefined;
    if (!customer) throw new Error(`Customer ${input.customerId} not found`);

    const now = new Date().toISOString();
    const txId = `kt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const prevBal = customer.current_balance_paisa;
    const newBal = prevBal - amountPaisa;

    // 1. Update customer khata balance
    db.prepare('UPDATE customers SET current_balance_paisa = ?, updated_at = ? WHERE id = ?')
      .run(newBal, now, customer.id);

    // 2. Record in khata_transactions
    db.prepare(`
      INSERT INTO khata_transactions (
        id, business_id, party_type, party_id, party_name, type,
        amount_paisa, previous_balance_paisa, new_balance_paisa,
        reference_type, reference_id, notes, idempotency_key, created_by, created_at, is_voided
      ) VALUES (?, ?, 'customer', ?, ?, 'payment_received', ?, ?, ?, 'manual', ?, ?, ?, ?, ?, 0)
    `).run(
      txId,
      businessId,
      customer.id,
      customer.name,
      amountPaisa,
      prevBal,
      newBal,
      salesman.id,
      input.notes || `Wasooli collected by Salesman ${salesman.name}`,
      input.idempotencyKey || null,
      input.createdBy || salesman.name,
      now
    );

    // 3. Increment salesman's cash_in_hand_paisa
    const newCashInHand = (salesman.cash_in_hand_paisa || 0) + amountPaisa;
    db.prepare('UPDATE staff SET cash_in_hand_paisa = ?, updated_at = ? WHERE id = ?')
      .run(newCashInHand, now, salesman.id);

    // 4. Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, business_id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, ?, 'SALESMAN_RECOVERY', 'staff', ?, ?, ?)
    `).run(
      `aud_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      businessId,
      input.createdBy || salesman.name,
      salesman.id,
      `Salesman ${salesman.name} collected Rs. ${input.amountPkr} recovery from ${customer.name}`,
      now
    );

    const updatedStaff = db.prepare('SELECT * FROM staff WHERE id = ?').get(salesman.id) as unknown as StaffRow;
    const updatedCust = db.prepare('SELECT * FROM customers WHERE id = ?').get(customer.id) as unknown as CustomerRow;
    const khataTx = db.prepare('SELECT * FROM khata_transactions WHERE id = ?').get(txId) as unknown as KhataTransactionRow;

    return { staff: updatedStaff, customer: updatedCust, khataTransaction: khataTx };
  });
}

export interface SettleSalesmanCashInput {
  salesmanId: string;
  depositAmountPkr: number;
  targetAccountType?: FinancialAccountType;
  accountId?: string;
  notes?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function settleSalesmanCash(
  businessId: string,
  input: SettleSalesmanCashInput
): {
  staff: StaffRow;
  financialTransaction: FinancialTransactionRow;
  account: FinancialAccountRow;
  staffTransaction: StaffTransactionRow;
} {
  const db = getDatabase();
  const depositPaisa = pkrToPaisa(input.depositAmountPkr);
  if (depositPaisa <= 0) throw new Error('Deposit amount must be positive');

  return runTransaction(() => {
    const salesman = db
      .prepare('SELECT * FROM staff WHERE business_id = ? AND id = ?')
      .get(businessId, input.salesmanId) as unknown as StaffRow | undefined;
    if (!salesman) throw new Error(`Salesman ${input.salesmanId} not found`);

    const currentCashInHand = salesman.cash_in_hand_paisa || 0;
    if (depositPaisa > currentCashInHand) {
      throw new Error(`Deposit amount (Rs. ${input.depositAmountPkr}) exceeds salesman cash in hand (Rs. ${paisaToPkr(currentCashInHand)})`);
    }

    const targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.targetAccountType || 'cash');
    const now = new Date().toISOString();
    const staffTxId = `stx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Decrement salesman cash in hand
    const newCashInHand = currentCashInHand - depositPaisa;
    db.prepare('UPDATE staff SET cash_in_hand_paisa = ?, updated_at = ? WHERE id = ?')
      .run(newCashInHand, now, salesman.id);

    // 2. Deposit into business financial account (money_in)
    const prevBal = targetAccount.current_balance_paisa;
    const newBal = prevBal + depositPaisa;
    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?')
      .run(newBal, now, targetAccount.id);

    // 3. Record in financial_transactions
    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'money_in', ?, ?, ?, 'salesman_settlement', 'staff', ?, ?, ?, ?)
    `).run(
      finTxId,
      businessId,
      targetAccount.id,
      depositPaisa,
      prevBal,
      newBal,
      salesman.id,
      `Salesman cash deposit from ${salesman.name} into ${targetAccount.type.toUpperCase()}`,
      input.createdBy || 'Owner',
      now
    );

    // 4. Record in staff_transactions
    db.prepare(`
      INSERT INTO staff_transactions (
        id, business_id, staff_id, type, amount_paisa,
        account_id, financial_transaction_id, date, notes,
        idempotency_key, created_by, created_at
      ) VALUES (?, ?, ?, 'other_payment', ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      staffTxId,
      businessId,
      salesman.id,
      depositPaisa,
      targetAccount.id,
      finTxId,
      now.split('T')[0],
      input.notes || `Cash handover/deposit to shop ${targetAccount.type}`,
      input.idempotencyKey || null,
      input.createdBy || 'Owner',
      now
    );

    const updatedStaff = db.prepare('SELECT * FROM staff WHERE id = ?').get(salesman.id) as unknown as StaffRow;
    const updatedAccount = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow;
    const staffTx = db.prepare('SELECT * FROM staff_transactions WHERE id = ?').get(staffTxId) as unknown as StaffTransactionRow;
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow;

    return { staff: updatedStaff, financialTransaction: finTx, account: updatedAccount, staffTransaction: staffTx };
  });
}

export interface PayoutSalesmanCommissionInput {
  salesmanId: string;
  amountPkr: number;
  sourceAccountType?: FinancialAccountType;
  accountId?: string;
  notes?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function payoutSalesmanCommission(
  businessId: string,
  input: PayoutSalesmanCommissionInput
): {
  staff: StaffRow;
  financialTransaction: FinancialTransactionRow;
  account: FinancialAccountRow;
  staffTransaction: StaffTransactionRow;
} {
  return recordStaffTransaction(businessId, {
    staffId: input.salesmanId,
    type: 'commission',
    amountPkr: input.amountPkr,
    paymentMethod: input.sourceAccountType || 'cash',
    accountId: input.accountId,
    notes: input.notes || 'Salesman commission payout',
    idempotencyKey: input.idempotencyKey,
    createdBy: input.createdBy || 'Owner',
  });
}

export interface SalesmanReport {
  salesman: StaffRow;
  totalSalesCount: number;
  totalSalesVolumePkr: number;
  totalPaidVolumePkr: number;
  totalCreditVolumePkr: number;
  totalCommissionEarnedPkr: number;
  totalCommissionPaidPkr: number;
  pendingCommissionPkr: number;
  cashInHandPkr: number;
  recentSales: SaleRow[];
  recentTransactions: StaffTransactionRow[];
}

export function getSalesmanReport(businessId: string, salesmanId: string): SalesmanReport {
  const db = getDatabase();
  const salesman = db
    .prepare('SELECT * FROM staff WHERE business_id = ? AND id = ?')
    .get(businessId, salesmanId) as unknown as StaffRow | undefined;
  if (!salesman) throw new Error(`Salesman ${salesmanId} not found`);

  const sales = db
    .prepare('SELECT * FROM sales WHERE business_id = ? AND salesman_id = ? AND is_voided = 0 ORDER BY created_at DESC')
    .all(businessId, salesmanId) as unknown as SaleRow[];

  let totalSalesPaisa = 0;
  let totalPaidPaisa = 0;
  let totalCreditPaisa = 0;
  let totalCommEarnedPaisa = 0;

  for (const s of sales) {
    totalSalesPaisa += s.total_amount_paisa;
    totalPaidPaisa += s.paid_amount_paisa;
    totalCreditPaisa += Math.max(0, s.total_amount_paisa - s.paid_amount_paisa);
    totalCommEarnedPaisa += (s.salesman_commission_paisa || 0);
  }

  // Get commission transactions paid out
  const commTxs = db
    .prepare("SELECT * FROM staff_transactions WHERE business_id = ? AND staff_id = ? AND type = 'commission'")
    .all(businessId, salesmanId) as unknown as StaffTransactionRow[];

  let totalCommPaidPaisa = 0;
  for (const tx of commTxs) {
    if (tx.financial_transaction_id) {
      totalCommPaidPaisa += tx.amount_paisa;
    }
  }

  const recentTxs = db
    .prepare('SELECT * FROM staff_transactions WHERE business_id = ? AND staff_id = ? ORDER BY date DESC, created_at DESC LIMIT 20')
    .all(businessId, salesmanId) as unknown as StaffTransactionRow[];

  return {
    salesman,
    totalSalesCount: sales.length,
    totalSalesVolumePkr: paisaToPkr(totalSalesPaisa),
    totalPaidVolumePkr: paisaToPkr(totalPaidPaisa),
    totalCreditVolumePkr: paisaToPkr(totalCreditPaisa),
    totalCommissionEarnedPkr: paisaToPkr(totalCommEarnedPaisa),
    totalCommissionPaidPkr: paisaToPkr(totalCommPaidPaisa),
    pendingCommissionPkr: Math.max(0, paisaToPkr(totalCommEarnedPaisa - totalCommPaidPaisa)),
    cashInHandPkr: paisaToPkr(salesman.cash_in_hand_paisa || 0),
    recentSales: sales.slice(0, 15),
    recentTransactions: recentTxs,
  };
}

// =============================================================================
// PHASE 2: COMMISSION / DALALI (ARHAT, BROKERAGE, PAYABLE & RECEIVABLE)
// =============================================================================

export interface CreateCommissionInput {
  partyName: string;
  type: 'payable' | 'receivable';
  relatedSaleId?: string;
  relatedPurchaseId?: string;
  dealReference?: string;
  ratePercentage?: number;
  amountPkr: number;
  date?: string;
  notes?: string;
  idempotencyKey?: string;
}

export function createCommission(businessId: string, input: CreateCommissionInput): CommissionRow {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) throw new Error('Commission amount must be positive');

  const now = new Date().toISOString();
  const id = `comm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  db.prepare(`
    INSERT INTO commissions (
      id, business_id, party_name, type, related_sale_id, related_purchase_id,
      deal_reference, rate_percentage, amount_paisa, paid_amount_paisa,
      status, account_id, financial_transaction_id, date, notes,
      idempotency_key, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'unpaid', NULL, NULL, ?, ?, ?, ?, ?)
  `).run(
    id,
    businessId,
    input.partyName.trim(),
    input.type,
    input.relatedSaleId || null,
    input.relatedPurchaseId || null,
    input.dealReference?.trim() || null,
    input.ratePercentage || null,
    amountPaisa,
    input.date || now.split('T')[0],
    input.notes?.trim() || null,
    input.idempotencyKey || null,
    now,
    now
  );

  return db.prepare('SELECT * FROM commissions WHERE id = ?').get(id) as unknown as CommissionRow;
}

export function getCommissions(businessId: string, status?: string): CommissionRow[] {
  const db = getDatabase();
  if (status) {
    return db
      .prepare('SELECT * FROM commissions WHERE business_id = ? AND status = ? ORDER BY date DESC, created_at DESC')
      .all(businessId, status) as unknown as CommissionRow[];
  }
  return db
    .prepare('SELECT * FROM commissions WHERE business_id = ? ORDER BY date DESC, created_at DESC')
    .all(businessId) as unknown as CommissionRow[];
}

export function payCommission(
  businessId: string,
  input: {
    commissionId: string;
    amountPkr: number;
    paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
    accountId?: string;
    notes?: string;
    idempotencyKey?: string;
    createdBy?: string;
  }
): {
  commission: CommissionRow;
  financialTransaction: FinancialTransactionRow;
  account: FinancialAccountRow;
} {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) throw new Error('Payment amount must be positive');

  return runTransaction(() => {
    const comm = db
      .prepare('SELECT * FROM commissions WHERE business_id = ? AND id = ?')
      .get(businessId, input.commissionId) as unknown as CommissionRow | undefined;
    if (!comm) throw new Error(`Commission record ${input.commissionId} not found`);
    if (comm.type !== 'payable') throw new Error('Cannot pay out a receivable commission record');

    const targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
    const now = new Date().toISOString();
    const finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Deduct from financial account
    const prevBal = targetAccount.current_balance_paisa;
    const newBal = prevBal - amountPaisa;
    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      newBal,
      now,
      targetAccount.id
    );

    // Create financial transaction
    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'money_out', ?, ?, ?, 'commission_payout', 'commission', ?, ?, ?, ?)
    `).run(
      finTxId,
      businessId,
      targetAccount.id,
      amountPaisa,
      prevBal,
      newBal,
      comm.id,
      `Commission / Dalali paid to ${comm.party_name}`,
      input.createdBy || 'Owner',
      now
    );

    const updatedPaid = comm.paid_amount_paisa + amountPaisa;
    const newStatus = updatedPaid >= comm.amount_paisa ? 'paid' : 'partial';

    db.prepare(`
      UPDATE commissions
      SET paid_amount_paisa = ?, status = ?, account_id = ?, financial_transaction_id = ?, updated_at = ?
      WHERE id = ?
    `).run(updatedPaid, newStatus, targetAccount.id, finTxId, now, comm.id);

    const updatedComm = db.prepare('SELECT * FROM commissions WHERE id = ?').get(comm.id) as unknown as CommissionRow;
    const updatedAcc = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow;
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow;

    return { commission: updatedComm, financialTransaction: finTx, account: updatedAcc };
  });
}

export function receiveCommission(
  businessId: string,
  input: {
    commissionId: string;
    amountPkr: number;
    paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
    accountId?: string;
    notes?: string;
    idempotencyKey?: string;
    createdBy?: string;
  }
): {
  commission: CommissionRow;
  financialTransaction: FinancialTransactionRow;
  account: FinancialAccountRow;
} {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) throw new Error('Received amount must be positive');

  return runTransaction(() => {
    const comm = db
      .prepare('SELECT * FROM commissions WHERE business_id = ? AND id = ?')
      .get(businessId, input.commissionId) as unknown as CommissionRow | undefined;
    if (!comm) throw new Error(`Commission record ${input.commissionId} not found`);
    if (comm.type !== 'receivable') throw new Error('Cannot receive money for a payable commission record');

    const targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
    const now = new Date().toISOString();
    const finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Deposit into financial account
    const prevBal = targetAccount.current_balance_paisa;
    const newBal = prevBal + amountPaisa;
    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      newBal,
      now,
      targetAccount.id
    );

    // Create financial transaction
    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'money_in', ?, ?, ?, 'commission_income', 'commission', ?, ?, ?, ?)
    `).run(
      finTxId,
      businessId,
      targetAccount.id,
      amountPaisa,
      prevBal,
      newBal,
      comm.id,
      `Commission / Arhat earned from ${comm.party_name}`,
      input.createdBy || 'Owner',
      now
    );

    const updatedPaid = comm.paid_amount_paisa + amountPaisa;
    const newStatus = updatedPaid >= comm.amount_paisa ? 'paid' : 'partial';

    db.prepare(`
      UPDATE commissions
      SET paid_amount_paisa = ?, status = ?, account_id = ?, financial_transaction_id = ?, updated_at = ?
      WHERE id = ?
    `).run(updatedPaid, newStatus, targetAccount.id, finTxId, now, comm.id);

    const updatedComm = db.prepare('SELECT * FROM commissions WHERE id = ?').get(comm.id) as unknown as CommissionRow;
    const updatedAcc = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow;
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow;

    return { commission: updatedComm, financialTransaction: finTx, account: updatedAcc };
  });
}

// =============================================================================
// PHASE 2: TRANSPORT TRIP HISAAB (FREIGHT, DIESEL, LABOUR, ROUTES)
// =============================================================================

export interface CreateTransportTripInput {
  vehicleNo: string;
  driverName?: string;
  transporterName?: string;
  partyName?: string;
  route?: string;
  date?: string;
  relatedReference?: string;
  freightPkr?: number;
  dieselPkr?: number;
  labourPkr?: number;
  otherExpensePkr?: number;
  paidAmountPkr?: number;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  receivedAmountPkr?: number;
  receivePaymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountId?: string;
  notes?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function createTransportTrip(
  businessId: string,
  input: CreateTransportTripInput
): {
  trip: TransportTripRow;
  financialTransaction?: FinancialTransactionRow;
  account?: FinancialAccountRow;
} {
  const db = getDatabase();
  const now = new Date().toISOString();
  const tripDate = input.date || now.split('T')[0];
  const tripId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const freightPaisa = pkrToPaisa(input.freightPkr || 0);
  const dieselPaisa = pkrToPaisa(input.dieselPkr || 0);
  const labourPaisa = pkrToPaisa(input.labourPkr || 0);
  const otherPaisa = pkrToPaisa(input.otherExpensePkr || 0);
  const totalCostPaisa = freightPaisa + dieselPaisa + labourPaisa + otherPaisa;

  const paidAmountPaisa = pkrToPaisa(input.paidAmountPkr || 0);
  const remainingPaisa = Math.max(0, totalCostPaisa - paidAmountPaisa);
  const paymentStatus = remainingPaisa <= 0 ? 'paid' : paidAmountPaisa > 0 ? 'partial' : 'unpaid';

  const receivedAmountPaisa = pkrToPaisa(input.receivedAmountPkr || 0);
  // Trip profit: (Freight or received revenue) - (diesel + labour + other expenses)
  const revenuePaisa = receivedAmountPaisa > 0 ? receivedAmountPaisa : freightPaisa;
  const directExpensesPaisa = dieselPaisa + labourPaisa + otherPaisa;
  const tripProfitPaisa = revenuePaisa - directExpensesPaisa;

  return runTransaction(() => {
    let finTxId: string | null = null;
    let targetAccount: FinancialAccountRow | undefined;

    // If money was paid for this trip (diesel/labour/driver), deduct from Central Financial Account
    if (paidAmountPaisa > 0) {
      targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
      finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      const prevBal = targetAccount.current_balance_paisa;
      const newBal = prevBal - paidAmountPaisa;

      db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newBal,
        now,
        targetAccount.id
      );

      db.prepare(`
        INSERT INTO financial_transactions (
          id, business_id, account_id, type, amount_paisa,
          previous_balance_paisa, new_balance_paisa, category,
          reference_type, reference_id, description, created_by, created_at
        ) VALUES (?, ?, ?, 'money_out', ?, ?, ?, 'transport_expense', 'transport_trip', ?, ?, ?, ?)
      `).run(
        finTxId,
        businessId,
        targetAccount.id,
        paidAmountPaisa,
        prevBal,
        newBal,
        tripId,
        `Transport Trip Expense for ${input.vehicleNo} (${input.route || 'Local'})`,
        input.createdBy || 'Owner',
        now
      );
    }

    // If freight revenue was received from customer/party, deposit into Central Financial Account
    if (receivedAmountPaisa > 0) {
      const recvAccount = resolveTargetFinancialAccount(db, businessId, undefined, input.receivePaymentMethod || 'cash');
      const recvFinTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const prevBal = recvAccount.current_balance_paisa;
      const newBal = prevBal + receivedAmountPaisa;

      db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newBal,
        now,
        recvAccount.id
      );

      db.prepare(`
        INSERT INTO financial_transactions (
          id, business_id, account_id, type, amount_paisa,
          previous_balance_paisa, new_balance_paisa, category,
          reference_type, reference_id, description, created_by, created_at
        ) VALUES (?, ?, ?, 'money_in', ?, ?, ?, 'freight_revenue', 'transport_trip', ?, ?, ?, ?)
      `).run(
        recvFinTxId,
        businessId,
        recvAccount.id,
        receivedAmountPaisa,
        prevBal,
        newBal,
        tripId,
        `Freight income from ${input.partyName || 'Party'} on vehicle ${input.vehicleNo}`,
        input.createdBy || 'Owner',
        now
      );
    }

    db.prepare(`
      INSERT INTO transport_trips (
        id, business_id, vehicle_no, driver_name, transporter_name, party_name, route,
        date, related_reference, freight_paisa, diesel_paisa, labour_paisa,
        other_expense_paisa, total_cost_paisa, paid_amount_paisa,
        remaining_amount_paisa, received_amount_paisa, trip_profit_paisa,
        payment_status, account_id,
        financial_transaction_id, notes, idempotency_key, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      tripId,
      businessId,
      input.vehicleNo.trim(),
      input.driverName?.trim() || null,
      input.transporterName?.trim() || null,
      input.partyName?.trim() || null,
      input.route?.trim() || null,
      tripDate,
      input.relatedReference?.trim() || null,
      freightPaisa,
      dieselPaisa,
      labourPaisa,
      otherPaisa,
      totalCostPaisa,
      paidAmountPaisa,
      remainingPaisa,
      receivedAmountPaisa,
      tripProfitPaisa,
      paymentStatus,
      targetAccount?.id || null,
      finTxId,
      input.notes?.trim() || null,
      input.idempotencyKey || null,
      now,
      now
    );

    const trip = db.prepare('SELECT * FROM transport_trips WHERE id = ?').get(tripId) as unknown as TransportTripRow;
    const finTx = finTxId ? (db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow) : undefined;
    const acc = targetAccount ? (db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow) : undefined;

    return { trip, financialTransaction: finTx, account: acc };
  });
}

export function getTransportTrips(businessId: string, limit: number = 100): TransportTripRow[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM transport_trips WHERE business_id = ? ORDER BY date DESC, created_at DESC LIMIT ?')
    .all(businessId, limit) as unknown as TransportTripRow[];
}

export interface TransportSummaryReport {
  totalTrips: number;
  totalFreightPkr: number;
  totalDieselPkr: number;
  totalLabourPkr: number;
  totalOtherExpensePkr: number;
  totalExpensePkr: number;
  totalPaidPkr: number;
  totalUnpaidPkr: number;
  totalReceivedPkr: number;
  netProfitPkr: number;
}

export function getTransportSummary(businessId: string): TransportSummaryReport {
  const db = getDatabase();
  const trips = db
    .prepare('SELECT * FROM transport_trips WHERE business_id = ?')
    .all(businessId) as unknown as TransportTripRow[];

  let freightPaisa = 0;
  let dieselPaisa = 0;
  let labourPaisa = 0;
  let otherPaisa = 0;
  let paidPaisa = 0;
  let remainingPaisa = 0;
  let receivedPaisa = 0;
  let profitPaisa = 0;

  for (const t of trips) {
    freightPaisa += t.freight_paisa || 0;
    dieselPaisa += t.diesel_paisa || 0;
    labourPaisa += t.labour_paisa || 0;
    otherPaisa += t.other_expense_paisa || 0;
    paidPaisa += t.paid_amount_paisa || 0;
    remainingPaisa += t.remaining_amount_paisa || 0;
    receivedPaisa += t.received_amount_paisa || 0;
    profitPaisa += t.trip_profit_paisa || 0;
  }

  const directExpensesPaisa = dieselPaisa + labourPaisa + otherPaisa;

  return {
    totalTrips: trips.length,
    totalFreightPkr: paisaToPkr(freightPaisa),
    totalDieselPkr: paisaToPkr(dieselPaisa),
    totalLabourPkr: paisaToPkr(labourPaisa),
    totalOtherExpensePkr: paisaToPkr(otherPaisa),
    totalExpensePkr: paisaToPkr(directExpensesPaisa),
    totalPaidPkr: paisaToPkr(paidPaisa),
    totalUnpaidPkr: paisaToPkr(remainingPaisa),
    totalReceivedPkr: paisaToPkr(receivedPaisa),
    netProfitPkr: paisaToPkr(profitPaisa),
  };
}

// =============================================================================
// PHASE 2: ASSETS (CAPITAL EQUIPMENT, VEHICLES, REFRIGERATION, FIXTURES)
// =============================================================================

export interface CreateAssetInput {
  name: string;
  category: string;
  purchaseDate?: string;
  purchasePricePkr: number;
  currentValuePkr?: number;
  quantity?: number;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountId?: string;
  notes?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function createAsset(
  businessId: string,
  input: CreateAssetInput
): {
  asset: AssetRow;
  financialTransaction?: FinancialTransactionRow;
  account?: FinancialAccountRow;
} {
  const db = getDatabase();
  const qty = Math.max(1, input.quantity || 1);
  const unitPricePaisa = pkrToPaisa(input.purchasePricePkr);
  const totalPricePaisa = unitPricePaisa * qty;
  const currentValPaisa = input.currentValuePkr ? pkrToPaisa(input.currentValuePkr) : totalPricePaisa;

  if (totalPricePaisa <= 0) throw new Error('Asset purchase price must be positive');

  const now = new Date().toISOString();
  const assetDate = input.purchaseDate || now.split('T')[0];
  const assetId = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return runTransaction(() => {
    let finTxId: string | null = null;
    let targetAccount: FinancialAccountRow | undefined;

    // Deduct from Central Financial Account (Asset Purchase - NOT an operating expense!)
    targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
    finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const prevBal = targetAccount.current_balance_paisa;
    const newBal = prevBal - totalPricePaisa;

    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      newBal,
      now,
      targetAccount.id
    );

    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'money_out', ?, ?, ?, 'asset_purchase', 'asset', ?, ?, ?, ?)
    `).run(
      finTxId,
      businessId,
      targetAccount.id,
      totalPricePaisa,
      prevBal,
      newBal,
      assetId,
      `Asset Acquisition: ${input.name} (${input.category}) - Qty: ${qty}`,
      input.createdBy || 'Owner',
      now
    );

    db.prepare(`
      INSERT INTO assets (
        id, business_id, name, category, purchase_date, purchase_price_paisa,
        current_value_paisa, quantity, account_id, financial_transaction_id,
        notes, idempotency_key, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assetId,
      businessId,
      input.name.trim(),
      input.category.trim(),
      assetDate,
      unitPricePaisa,
      currentValPaisa,
      qty,
      targetAccount.id,
      finTxId,
      input.notes?.trim() || null,
      input.idempotencyKey || null,
      now,
      now
    );

    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(assetId) as unknown as AssetRow;
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow;
    const acc = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow;

    return { asset, financialTransaction: finTx, account: acc };
  });
}

export function getAssets(businessId: string): AssetRow[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM assets WHERE business_id = ? ORDER BY purchase_date DESC, created_at DESC')
    .all(businessId) as unknown as AssetRow[];
}

export function updateAssetValue(businessId: string, assetId: string, currentValuePkr: number): AssetRow {
  const db = getDatabase();
  const valPaisa = pkrToPaisa(currentValuePkr);
  const now = new Date().toISOString();

  db.prepare('UPDATE assets SET current_value_paisa = ?, updated_at = ? WHERE business_id = ? AND id = ?').run(
    valPaisa,
    now,
    businessId,
    assetId
  );

  return db.prepare('SELECT * FROM assets WHERE id = ?').get(assetId) as unknown as AssetRow;
}

// =============================================================================
// PHASE 2: LIABILITIES & LOAN REPAYMENTS (QARZ, BANK LOAN, COMMITTEES)
// =============================================================================

export interface CreateLiabilityInput {
  name: string;
  type: 'bank_loan' | 'personal_loan' | 'committee' | 'other';
  creditorName: string;
  amountPkr: number;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  depositLoanIntoAccount?: boolean;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountId?: string;
  createdBy?: string;
}

export function createLiability(
  businessId: string,
  input: CreateLiabilityInput
): {
  liability: LiabilityRow;
  financialTransaction?: FinancialTransactionRow;
  account?: FinancialAccountRow;
} {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) throw new Error('Liability amount must be positive');

  const now = new Date().toISOString();
  const startDate = input.startDate || now.split('T')[0];
  const liabilityId = `liab_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return runTransaction(() => {
    let finTxId: string | null = null;
    let targetAccount: FinancialAccountRow | undefined;

    // If loan proceeds entered business financial accounts:
    if (input.depositLoanIntoAccount) {
      targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
      finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      const prevBal = targetAccount.current_balance_paisa;
      const newBal = prevBal + amountPaisa;

      db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newBal,
        now,
        targetAccount.id
      );

      db.prepare(`
        INSERT INTO financial_transactions (
          id, business_id, account_id, type, amount_paisa,
          previous_balance_paisa, new_balance_paisa, category,
          reference_type, reference_id, description, created_by, created_at
        ) VALUES (?, ?, ?, 'money_in', ?, ?, ?, 'liability_borrowing', 'liability', ?, ?, ?, ?)
      `).run(
        finTxId,
        businessId,
        targetAccount.id,
        amountPaisa,
        prevBal,
        newBal,
        liabilityId,
        `Loan / Borrowing received from ${input.creditorName} (${input.name})`,
        input.createdBy || 'Owner',
        now
      );
    }

    db.prepare(`
      INSERT INTO liabilities (
        id, business_id, name, type, creditor_name, amount_paisa,
        remaining_balance_paisa, start_date, due_date, notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      liabilityId,
      businessId,
      input.name.trim(),
      input.type,
      input.creditorName.trim(),
      amountPaisa,
      amountPaisa,
      startDate,
      input.dueDate || null,
      input.notes?.trim() || null,
      now,
      now
    );

    const liab = db.prepare('SELECT * FROM liabilities WHERE id = ?').get(liabilityId) as unknown as LiabilityRow;
    const finTx = finTxId ? (db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow) : undefined;
    const acc = targetAccount ? (db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow) : undefined;

    return { liability: liab, financialTransaction: finTx, account: acc };
  });
}

export function getLiabilities(businessId: string): LiabilityRow[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM liabilities WHERE business_id = ? ORDER BY start_date DESC, created_at DESC')
    .all(businessId) as unknown as LiabilityRow[];
}

export interface RecordLiabilityPaymentInput {
  liabilityId: string;
  amountPkr: number;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountId?: string;
  paymentDate?: string;
  notes?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function recordLiabilityPayment(
  businessId: string,
  input: RecordLiabilityPaymentInput
): {
  liability: LiabilityRow;
  payment: LiabilityPaymentRow;
  financialTransaction: FinancialTransactionRow;
  account: FinancialAccountRow;
} {
  const db = getDatabase();
  const amountPaisa = pkrToPaisa(input.amountPkr);
  if (amountPaisa <= 0) throw new Error('Repayment amount must be positive');

  return runTransaction(() => {
    const liab = db
      .prepare('SELECT * FROM liabilities WHERE business_id = ? AND id = ?')
      .get(businessId, input.liabilityId) as unknown as LiabilityRow | undefined;
    if (!liab) throw new Error(`Liability ${input.liabilityId} not found`);

    if (amountPaisa > liab.remaining_balance_paisa) {
      throw new Error(`Repayment amount Rs. ${input.amountPkr} exceeds remaining balance Rs. ${paisaToPkr(liab.remaining_balance_paisa)}`);
    }

    const targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
    const now = new Date().toISOString();
    const pmtDate = input.paymentDate || now.split('T')[0];
    const pmtId = `lpmt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Deduct from financial account
    const prevBal = targetAccount.current_balance_paisa;
    const newBal = prevBal - amountPaisa;
    db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      newBal,
      now,
      targetAccount.id
    );

    // 2. Insert into financial transactions
    db.prepare(`
      INSERT INTO financial_transactions (
        id, business_id, account_id, type, amount_paisa,
        previous_balance_paisa, new_balance_paisa, category,
        reference_type, reference_id, description, created_by, created_at
      ) VALUES (?, ?, ?, 'money_out', ?, ?, ?, 'liability_repayment', 'liability', ?, ?, ?, ?)
    `).run(
      finTxId,
      businessId,
      targetAccount.id,
      amountPaisa,
      prevBal,
      newBal,
      liab.id,
      `Loan Repayment to ${liab.creditor_name} for ${liab.name}`,
      input.createdBy || 'Owner',
      now
    );

    // 3. Update liability remaining balance
    const updatedRemaining = liab.remaining_balance_paisa - amountPaisa;
    db.prepare('UPDATE liabilities SET remaining_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
      updatedRemaining,
      now,
      liab.id
    );

    // 4. Insert into liability_payments
    db.prepare(`
      INSERT INTO liability_payments (
        id, business_id, liability_id, amount_paisa, account_id,
        financial_transaction_id, payment_date, notes, idempotency_key, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      pmtId,
      businessId,
      liab.id,
      amountPaisa,
      targetAccount.id,
      finTxId,
      pmtDate || now.split('T')[0],
      input.notes?.trim() || null,
      input.idempotencyKey || null,
      now
    );

    const updatedLiab = db.prepare('SELECT * FROM liabilities WHERE id = ?').get(liab.id) as unknown as LiabilityRow;
    const updatedAcc = db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow;
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow;
    const pmt = db.prepare('SELECT * FROM liability_payments WHERE id = ?').get(pmtId) as unknown as LiabilityPaymentRow;

    return { liability: updatedLiab, payment: pmt, financialTransaction: finTx, account: updatedAcc };
  });
}

export function getLiabilityPayments(businessId: string, liabilityId?: string): LiabilityPaymentRow[] {
  const db = getDatabase();
  if (liabilityId) {
    return db
      .prepare('SELECT * FROM liability_payments WHERE business_id = ? AND liability_id = ? ORDER BY payment_date DESC, created_at DESC')
      .all(businessId, liabilityId) as unknown as LiabilityPaymentRow[];
  }
  return db
    .prepare('SELECT * FROM liability_payments WHERE business_id = ? ORDER BY payment_date DESC, created_at DESC')
    .all(businessId) as unknown as LiabilityPaymentRow[];
}

// =============================================================================
// PHASE 2: RETURNS & STOCK/FINANCIAL REVERSALS (SALES & PURCHASES)
// =============================================================================

export interface RecordSaleReturnInput {
  originalReferenceId?: string;
  customerId?: string;
  customerName?: string;
  productId: string;
  quantity: number;
  unitPricePkr: number;
  refundAmountPkr?: number;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountId?: string;
  reason?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function recordSaleReturn(
  businessId: string,
  input: RecordSaleReturnInput
): {
  returnRecord: ReturnRow;
  updatedProduct: ProductRow;
  financialTransaction?: FinancialTransactionRow;
  account?: FinancialAccountRow;
  customer?: CustomerRow;
} {
  const db = getDatabase();
  if (input.quantity <= 0) throw new Error('Return quantity must be greater than zero');
  const unitPricePaisa = pkrToPaisa(input.unitPricePkr);
  const totalAmountPaisa = Math.round(unitPricePaisa * input.quantity);
  const refundAmountPaisa = input.refundAmountPkr ? pkrToPaisa(input.refundAmountPkr) : 0;

  return runTransaction(() => {
    const prod = db
      .prepare('SELECT * FROM products WHERE business_id = ? AND id = ?')
      .get(businessId, input.productId) as unknown as ProductRow | undefined;
    if (!prod) throw new Error(`Product ${input.productId} not found`);

    const now = new Date().toISOString();
    const returnId = `ret_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Restore Stock
    const prevStock = prod.current_stock;
    const newStock = prevStock + input.quantity;
    db.prepare('UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?').run(
      newStock,
      now,
      prod.id
    );

    // 2. Record Stock Movement
    const moveId = `smv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    db.prepare(`
      INSERT INTO stock_movements (
        id, business_id, product_id, movement_type, quantity_change,
        previous_stock, new_stock, unit_cost_paisa, reference_type, reference_id,
        notes, created_by, created_at
      ) VALUES (?, ?, ?, 'sale_return', ?, ?, ?, ?, 'manual', ?, ?, ?, ?)
    `).run(
      moveId,
      businessId,
      prod.id,
      input.quantity,
      prevStock,
      newStock,
      prod.purchase_price_paisa || 0,
      returnId,
      input.reason?.trim() || 'Sale return from customer',
      input.createdBy || 'Owner',
      now
    );

    // 3. Handle Money / Financial account refund or Customer Khata deduction
    let finTxId: string | null = null;
    let targetAccount: FinancialAccountRow | undefined;
    let updatedCustomer: CustomerRow | undefined;

    if (refundAmountPaisa > 0) {
      // Direct cash or bank refund paid out to customer
      targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
      finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      const prevBal = targetAccount.current_balance_paisa;
      const newBal = prevBal - refundAmountPaisa;

      db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newBal,
        now,
        targetAccount.id
      );

      db.prepare(`
        INSERT INTO financial_transactions (
          id, business_id, account_id, type, amount_paisa,
          previous_balance_paisa, new_balance_paisa, category,
          reference_type, reference_id, description, created_by, created_at
        ) VALUES (?, ?, ?, 'money_out', ?, ?, ?, 'sale_return_refund', 'sale_return', ?, ?, ?, ?)
      `).run(
        finTxId,
        businessId,
        targetAccount.id,
        refundAmountPaisa,
        prevBal,
        newBal,
        returnId,
        `Refund for returned items: ${prod.name} (Qty: ${input.quantity})`,
        input.createdBy || 'Owner',
        now
      );
    } else if (input.customerId) {
      // Reduce customer udhaar in Khata
      const cust = db
        .prepare('SELECT * FROM customers WHERE business_id = ? AND id = ?')
        .get(businessId, input.customerId) as unknown as CustomerRow | undefined;
      if (cust) {
        const prevBal = cust.current_balance_paisa;
        const newBal = Math.max(0, prevBal - totalAmountPaisa);
        db.prepare('UPDATE customers SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
          newBal,
          now,
          cust.id
        );

        const khataId = `kh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        db.prepare(`
          INSERT INTO khata_transactions (
            id, business_id, party_type, party_id, party_name,
            type, amount_paisa, previous_balance_paisa, new_balance_paisa,
            reference_type, reference_id, notes, created_by, created_at
          ) VALUES (?, ?, 'customer', ?, ?, 'reversal_credit', ?, ?, ?, 'invoice', ?, ?, ?, ?)
        `).run(
          khataId,
          businessId,
          cust.id,
          cust.name,
          totalAmountPaisa,
          prevBal,
          newBal,
          returnId,
          `Sale Return: ${prod.name} (${input.quantity} ${prod.unit})`,
          input.createdBy || 'Owner',
          now
        );

        updatedCustomer = db.prepare('SELECT * FROM customers WHERE id = ?').get(cust.id) as unknown as CustomerRow;
      }
    }

    // 4. Record into Returns table
    db.prepare(`
      INSERT INTO returns (
        id, business_id, return_type, original_reference_id, party_type,
        party_id, party_name, product_id, product_name, quantity,
        unit_price_paisa, total_amount_paisa, refund_amount_paisa,
        account_id, financial_transaction_id, reason, created_at
      ) VALUES (?, ?, 'sale_return', ?, 'customer', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      returnId,
      businessId,
      input.originalReferenceId || null,
      input.customerId || null,
      input.customerName || 'Customer',
      prod.id,
      prod.name,
      input.quantity,
      unitPricePaisa,
      totalAmountPaisa,
      refundAmountPaisa,
      targetAccount?.id || null,
      finTxId,
      input.reason?.trim() || null,
      now
    );

    const retRecord = db.prepare('SELECT * FROM returns WHERE id = ?').get(returnId) as unknown as ReturnRow;
    const updatedProd = db.prepare('SELECT * FROM products WHERE id = ?').get(prod.id) as unknown as ProductRow;
    const finTx = finTxId ? (db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow) : undefined;
    const acc = targetAccount ? (db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow) : undefined;

    return {
      returnRecord: retRecord,
      updatedProduct: updatedProd,
      financialTransaction: finTx,
      account: acc,
      customer: updatedCustomer,
    };
  });
}

export interface RecordPurchaseReturnInput {
  originalReferenceId?: string;
  supplierId?: string;
  supplierName?: string;
  productId: string;
  quantity: number;
  costPricePkr: number;
  refundAmountPkr?: number;
  paymentMethod?: 'cash' | 'bank' | 'easypaisa' | 'jazzcash';
  accountId?: string;
  reason?: string;
  idempotencyKey?: string;
  createdBy?: string;
}

export function recordPurchaseReturn(
  businessId: string,
  input: RecordPurchaseReturnInput
): {
  returnRecord: ReturnRow;
  updatedProduct: ProductRow;
  financialTransaction?: FinancialTransactionRow;
  account?: FinancialAccountRow;
  supplier?: SupplierRow;
} {
  const db = getDatabase();
  if (input.quantity <= 0) throw new Error('Return quantity must be greater than zero');
  const costPricePaisa = pkrToPaisa(input.costPricePkr);
  const totalAmountPaisa = Math.round(costPricePaisa * input.quantity);
  const refundAmountPaisa = input.refundAmountPkr ? pkrToPaisa(input.refundAmountPkr) : 0;

  return runTransaction(() => {
    const prod = db
      .prepare('SELECT * FROM products WHERE business_id = ? AND id = ?')
      .get(businessId, input.productId) as unknown as ProductRow | undefined;
    if (!prod) throw new Error(`Product ${input.productId} not found`);

    if (prod.current_stock < input.quantity) {
      throw new Error(`Insufficient stock to return. Current stock is ${prod.current_stock}, requested return is ${input.quantity}`);
    }

    const now = new Date().toISOString();
    const returnId = `ret_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // 1. Deduct Stock
    const prevStock = prod.current_stock;
    const newStock = prevStock - input.quantity;
    db.prepare('UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?').run(
      newStock,
      now,
      prod.id
    );

    // 2. Stock Movement
    const moveId = `smv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    db.prepare(`
      INSERT INTO stock_movements (
        id, business_id, product_id, movement_type, quantity_change,
        previous_stock, new_stock, unit_cost_paisa, reference_type, reference_id,
        notes, created_by, created_at
      ) VALUES (?, ?, ?, 'purchase_return', ?, ?, ?, ?, 'manual', ?, ?, ?, ?)
    `).run(
      moveId,
      businessId,
      prod.id,
      -input.quantity,
      prevStock,
      newStock,
      costPricePaisa,
      returnId,
      input.reason?.trim() || 'Purchase return to supplier',
      input.createdBy || 'Owner',
      now
    );

    // 3. Financial receipt or Supplier Khata deduction
    let finTxId: string | null = null;
    let targetAccount: FinancialAccountRow | undefined;
    let updatedSupplier: SupplierRow | undefined;

    if (refundAmountPaisa > 0) {
      // Direct cash or bank refund received from supplier
      targetAccount = resolveTargetFinancialAccount(db, businessId, input.accountId, input.paymentMethod);
      finTxId = `ftx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      const prevBal = targetAccount.current_balance_paisa;
      const newBal = prevBal + refundAmountPaisa;

      db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
        newBal,
        now,
        targetAccount.id
      );

      db.prepare(`
        INSERT INTO financial_transactions (
          id, business_id, account_id, type, amount_paisa,
          previous_balance_paisa, new_balance_paisa, category,
          reference_type, reference_id, description, created_by, created_at
        ) VALUES (?, ?, ?, 'money_in', ?, ?, ?, 'purchase_return_refund', 'purchase_return', ?, ?, ?, ?)
      `).run(
        finTxId,
        businessId,
        targetAccount.id,
        refundAmountPaisa,
        prevBal,
        newBal,
        returnId,
        `Refund received for purchase return: ${prod.name}`,
        input.createdBy || 'Owner',
        now
      );
    } else if (input.supplierId) {
      // Reduce supplier payable in Khata
      const supp = db
        .prepare('SELECT * FROM suppliers WHERE business_id = ? AND id = ?')
        .get(businessId, input.supplierId) as unknown as SupplierRow | undefined;
      if (supp) {
        const prevBal = supp.payable_balance_paisa;
        const newBal = Math.max(0, prevBal - totalAmountPaisa);
        db.prepare('UPDATE suppliers SET payable_balance_paisa = ?, updated_at = ? WHERE id = ?').run(
          newBal,
          now,
          supp.id
        );

        const khataId = `kh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        db.prepare(`
          INSERT INTO khata_transactions (
            id, business_id, party_type, party_id, party_name,
            type, amount_paisa, previous_balance_paisa, new_balance_paisa,
            reference_type, reference_id, notes, created_by, created_at
          ) VALUES (?, ?, 'supplier', ?, ?, 'payment_made', ?, ?, ?, 'purchase', ?, ?, ?, ?)
        `).run(
          khataId,
          businessId,
          supp.id,
          supp.name,
          totalAmountPaisa,
          prevBal,
          newBal,
          returnId,
          `Purchase Return: ${prod.name} (${input.quantity} ${prod.unit})`,
          input.createdBy || 'Owner',
          now
        );

        updatedSupplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(supp.id) as unknown as SupplierRow;
      }
    }

    // 4. Insert into returns table
    db.prepare(`
      INSERT INTO returns (
        id, business_id, return_type, original_reference_id, party_type,
        party_id, party_name, product_id, product_name, quantity,
        unit_price_paisa, total_amount_paisa, refund_amount_paisa,
        account_id, financial_transaction_id, reason, created_at
      ) VALUES (?, ?, 'purchase_return', ?, 'supplier', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      returnId,
      businessId,
      input.originalReferenceId || null,
      input.supplierId || null,
      input.supplierName || 'Supplier',
      prod.id,
      prod.name,
      input.quantity,
      costPricePaisa,
      totalAmountPaisa,
      refundAmountPaisa,
      targetAccount?.id || null,
      finTxId,
      input.reason?.trim() || null,
      now
    );

    const retRecord = db.prepare('SELECT * FROM returns WHERE id = ?').get(returnId) as unknown as ReturnRow;
    const updatedProd = db.prepare('SELECT * FROM products WHERE id = ?').get(prod.id) as unknown as ProductRow;
    const finTx = finTxId ? (db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(finTxId) as unknown as FinancialTransactionRow) : undefined;
    const acc = targetAccount ? (db.prepare('SELECT * FROM financial_accounts WHERE id = ?').get(targetAccount.id) as unknown as FinancialAccountRow) : undefined;

    return {
      returnRecord: retRecord,
      updatedProduct: updatedProd,
      financialTransaction: finTx,
      account: acc,
      supplier: updatedSupplier,
    };
  });
}

export function getReturns(businessId: string, limit: number = 100): ReturnRow[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM returns WHERE business_id = ? ORDER BY created_at DESC LIMIT ?')
    .all(businessId, limit) as unknown as ReturnRow[];
}

// =============================================================================
// PHASE 2: SPECIALIZED BUSINESS TOOL PERSISTENCE (MANDI, MILK, WASTAGE, ETC.)
// =============================================================================

export function saveSpecializedToolEntry(
  businessId: string,
  input: {
    id?: string;
    toolId: string;
    referenceTitle?: string;
    entryData: any;
  }
): SpecializedToolEntryRow {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = input.id || `ste_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const jsonStr = JSON.stringify(input.entryData || {});

  db.prepare(`
    INSERT INTO specialized_tool_entries (
      id, business_id, tool_id, reference_title, entry_data_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      reference_title = excluded.reference_title,
      entry_data_json = excluded.entry_data_json,
      updated_at = excluded.updated_at
  `).run(
    id,
    businessId,
    input.toolId.trim(),
    input.referenceTitle?.trim() || null,
    jsonStr,
    now,
    now
  );

  return db.prepare('SELECT * FROM specialized_tool_entries WHERE id = ?').get(id) as unknown as SpecializedToolEntryRow;
}

export function getSpecializedToolEntries(businessId: string, toolId?: string): SpecializedToolEntryRow[] {
  const db = getDatabase();
  if (toolId) {
    return db
      .prepare('SELECT * FROM specialized_tool_entries WHERE business_id = ? AND tool_id = ? ORDER BY updated_at DESC')
      .all(businessId, toolId) as unknown as SpecializedToolEntryRow[];
  }
  return db
    .prepare('SELECT * FROM specialized_tool_entries WHERE business_id = ? ORDER BY updated_at DESC')
    .all(businessId) as unknown as SpecializedToolEntryRow[];
}

export function deleteSpecializedToolEntry(businessId: string, id: string): boolean {
  const db = getDatabase();
  const res = db.prepare('DELETE FROM specialized_tool_entries WHERE business_id = ? AND id = ?').run(businessId, id);
  return res.changes > 0;
}

export function recordSpecializedWastage(
  businessId: string,
  input: {
    toolId: string;
    productId?: string;
    productName: string;
    quantity: number;
    unit?: string;
    estimatedLossPkr?: number;
    reason?: string;
    notes?: string;
    createdBy?: string;
  }
): { entry: SpecializedToolEntryRow; stockMovement?: StockMovementRow } {
  return runTransaction(() => {
    let movement: StockMovementRow | undefined;
    if (input.productId && input.quantity > 0) {
      const res = adjustStock(
        businessId,
        input.productId,
        -Math.abs(input.quantity),
        'damage',
        `Wastage recorded via ${input.toolId}: ${input.reason || 'Expired/Damaged/Lost'}`,
        input.createdBy || 'Owner',
        'manual'
      );
      movement = res.movement;
    }

    const entry = saveSpecializedToolEntry(businessId, {
      toolId: input.toolId,
      referenceTitle: `${input.productName} (${input.quantity} ${input.unit || 'unit'}) - Rs. ${input.estimatedLossPkr || 0}`,
      entryData: {
        productId: input.productId,
        productName: input.productName,
        quantity: input.quantity,
        unit: input.unit || 'unit',
        estimatedLossPkr: input.estimatedLossPkr || 0,
        reason: input.reason,
        notes: input.notes,
        date: new Date().toISOString(),
      },
    });

    return { entry, stockMovement: movement };
  });
}

// =============================================================================
// PHASE 2: REAL SQLITE REPORTS & COMPREHENSIVE FINANCIAL AUDIT ENGINE
// =============================================================================

export interface ComprehensiveReportSummary {
  // Sales & Revenue
  totalSalesPkr: number;
  totalSalesCount: number;
  totalCashSalesPkr: number;
  totalCreditSalesPkr: number;
  totalCogsPkr: number;
  grossProfitPkr: number;

  // Purchases & Suppliers
  totalPurchasesPkr: number;
  totalPurchasesCount: number;
  totalSupplierPayablePkr: number;

  // Customer Udhaar
  totalCustomerUdhaarPkr: number;

  // Operating Expenses
  totalOperatingExpensesPkr: number;

  // Staff Payroll & Advances
  totalStaffSalariesPaidPkr: number;
  totalStaffAdvancesActivePkr: number;

  // Dalali / Commissions
  totalCommissionPaidPkr: number;
  totalCommissionEarnedPkr: number;
  totalCommissionPayablePkr: number;

  // Transport Trips
  totalTransportCostPkr: number;
  totalTransportTripsCount: number;

  // Balance Sheet: Assets & Liabilities
  totalStockValuePkr: number;
  totalFixedAssetsValuePkr: number;
  totalLiabilitiesRemainingPkr: number;

  // Central Financial Accounts Liquidity
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balancePkr: number;
  }>;
  totalLiquidCashPkr: number;

  // Returns
  totalSalesReturnsPkr: number;
  totalPurchaseReturnsPkr: number;

  // Net Profit & Business Net Worth
  netProfitPkr: number;
  netWorthPkr: number;
}

export function getComprehensiveReportSummary(businessId: string): ComprehensiveReportSummary {
  const db = getDatabase();
  ensureDefaultFinancialAccounts(businessId);

  // 1. Sales
  const salesRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(total_amount_paisa), 0) AS total_sales,
        COALESCE(SUM(paid_amount_paisa), 0) AS cash_sales,
        COALESCE(SUM(total_amount_paisa - paid_amount_paisa), 0) AS credit_sales,
        COUNT(*) AS sales_count
      FROM sales WHERE business_id = ? AND is_voided = 0
    `)
    .get(businessId) as { total_sales: number; cash_sales: number; credit_sales: number; sales_count: number };

  // Estimate COGS
  const cogsRow = db
    .prepare(`
      SELECT COALESCE(SUM(si.quantity * p.purchase_price_paisa), 0) AS total_cogs
      FROM sale_items si
      JOIN sales s ON si.sale_id = s.id
      JOIN products p ON si.product_id = p.id
      WHERE s.business_id = ? AND s.is_voided = 0
    `)
    .get(businessId) as { total_cogs: number };

  // 2. Purchases
  const purchRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(total_amount_paisa), 0) AS total_purch,
        COUNT(*) AS purch_count
      FROM purchases WHERE business_id = ?
    `)
    .get(businessId) as { total_purch: number; purch_count: number };

  // 3. Khata balances
  const custRow = db
    .prepare('SELECT COALESCE(SUM(current_balance_paisa), 0) AS udhaar FROM customers WHERE business_id = ? AND is_active = 1')
    .get(businessId) as { udhaar: number };
  const suppRow = db
    .prepare('SELECT COALESCE(SUM(payable_balance_paisa), 0) AS payable FROM suppliers WHERE business_id = ? AND is_active = 1')
    .get(businessId) as { payable: number };

  // 4. Operating Expenses
  const expRow = db
    .prepare('SELECT COALESCE(SUM(amount_paisa), 0) AS exp_total FROM expenses WHERE business_id = ?')
    .get(businessId) as { exp_total: number };

  // 5. Staff Salaries & Advances
  const staffTxRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'salary_payment' THEN amount_paisa ELSE 0 END), 0) AS salaries_paid,
        COALESCE(SUM(CASE WHEN type = 'advance' THEN amount_paisa ELSE 0 END), 0) AS advances_given
      FROM staff_transactions WHERE business_id = ?
    `)
    .get(businessId) as { salaries_paid: number; advances_given: number };
  const staffBalRow = db
    .prepare('SELECT COALESCE(SUM(advance_balance_paisa), 0) AS current_advance FROM staff WHERE business_id = ?')
    .get(businessId) as { current_advance: number };

  // 6. Commissions
  const commRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'payable' THEN paid_amount_paisa ELSE 0 END), 0) AS comm_paid,
        COALESCE(SUM(CASE WHEN type = 'receivable' THEN paid_amount_paisa ELSE 0 END), 0) AS comm_earned,
        COALESCE(SUM(CASE WHEN type = 'payable' THEN (amount_paisa - paid_amount_paisa) ELSE 0 END), 0) AS comm_payable
      FROM commissions WHERE business_id = ?
    `)
    .get(businessId) as { comm_paid: number; comm_earned: number; comm_payable: number };

  // 7. Transport
  const tripRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(paid_amount_paisa), 0) AS trip_cost,
        COUNT(*) AS trip_count
      FROM transport_trips WHERE business_id = ?
    `)
    .get(businessId) as { trip_cost: number; trip_count: number };

  // 8. Stock & Assets
  const stockRow = db
    .prepare('SELECT COALESCE(SUM(current_stock * purchase_price_paisa), 0) AS stock_val FROM products WHERE business_id = ? AND is_active = 1')
    .get(businessId) as { stock_val: number };
  const assetRow = db
    .prepare('SELECT COALESCE(SUM(current_value_paisa * quantity), 0) AS asset_val FROM assets WHERE business_id = ?')
    .get(businessId) as { asset_val: number };

  // 9. Liabilities
  const liabRow = db
    .prepare('SELECT COALESCE(SUM(remaining_balance_paisa), 0) AS remaining_liab FROM liabilities WHERE business_id = ?')
    .get(businessId) as { remaining_liab: number };

  // 10. Financial Accounts
  const accounts = db
    .prepare('SELECT * FROM financial_accounts WHERE business_id = ? AND is_active = 1 ORDER BY type ASC')
    .all(businessId) as unknown as FinancialAccountRow[];

  let totalLiquidPaisa = 0;
  const formattedAccounts = accounts.map(a => {
    totalLiquidPaisa += a.current_balance_paisa;
    return {
      id: a.id,
      name: a.name,
      type: a.type,
      balancePkr: paisaToPkr(a.current_balance_paisa),
    };
  });

  // 11. Returns
  const retRow = db
    .prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN return_type = 'sale_return' THEN total_amount_paisa ELSE 0 END), 0) AS sale_ret,
        COALESCE(SUM(CASE WHEN return_type = 'purchase_return' THEN total_amount_paisa ELSE 0 END), 0) AS purch_ret
      FROM returns WHERE business_id = ?
    `)
    .get(businessId) as { sale_ret: number; purch_ret: number };

  const totalSalesPkr = paisaToPkr(salesRow.total_sales);
  const totalCogsPkr = paisaToPkr(cogsRow.total_cogs);
  const grossProfitPkr = totalSalesPkr - totalCogsPkr;
  const totalOperatingExpensesPkr = paisaToPkr(expRow.exp_total);
  const totalStaffSalariesPaidPkr = paisaToPkr(staffTxRow.salaries_paid);
  const totalTransportCostPkr = paisaToPkr(tripRow.trip_cost);
  const totalCommissionPaidPkr = paisaToPkr(commRow.comm_paid);
  const totalCommissionEarnedPkr = paisaToPkr(commRow.comm_earned);

  const netProfitPkr = grossProfitPkr + totalCommissionEarnedPkr - (totalOperatingExpensesPkr + totalStaffSalariesPaidPkr + totalTransportCostPkr + totalCommissionPaidPkr);

  const totalCustomerUdhaarPkr = paisaToPkr(custRow.udhaar);
  const totalStockValuePkr = paisaToPkr(stockRow.stock_val);
  const totalFixedAssetsValuePkr = paisaToPkr(assetRow.asset_val);
  const totalLiquidCashPkr = paisaToPkr(totalLiquidPaisa);

  const totalAssetsPkr = totalStockValuePkr + totalFixedAssetsValuePkr + totalCustomerUdhaarPkr + totalLiquidCashPkr;
  const totalLiabilitiesRemainingPkr = paisaToPkr(liabRow.remaining_liab);
  const totalSupplierPayablePkr = paisaToPkr(suppRow.payable);
  const totalCommissionPayablePkr = paisaToPkr(commRow.comm_payable);
  const totalLiabPkr = totalLiabilitiesRemainingPkr + totalSupplierPayablePkr + totalCommissionPayablePkr;

  const netWorthPkr = totalAssetsPkr - totalLiabPkr;

  return {
    totalSalesPkr,
    totalSalesCount: salesRow.sales_count,
    totalCashSalesPkr: paisaToPkr(salesRow.cash_sales),
    totalCreditSalesPkr: paisaToPkr(salesRow.credit_sales),
    totalCogsPkr,
    grossProfitPkr,
    totalPurchasesPkr: paisaToPkr(purchRow.total_purch),
    totalPurchasesCount: purchRow.purch_count,
    totalSupplierPayablePkr,
    totalCustomerUdhaarPkr,
    totalOperatingExpensesPkr,
    totalStaffSalariesPaidPkr,
    totalStaffAdvancesActivePkr: paisaToPkr(staffBalRow.current_advance),
    totalCommissionPaidPkr,
    totalCommissionEarnedPkr,
    totalCommissionPayablePkr,
    totalTransportCostPkr,
    totalTransportTripsCount: tripRow.trip_count,
    totalStockValuePkr,
    totalFixedAssetsValuePkr,
    totalLiabilitiesRemainingPkr,
    accounts: formattedAccounts,
    totalLiquidCashPkr,
    totalSalesReturnsPkr: paisaToPkr(retRow.sale_ret),
    totalPurchaseReturnsPkr: paisaToPkr(retRow.purch_ret),
    netProfitPkr,
    netWorthPkr,
  };
}

// =============================================================================
// PHASE 3: AI MUNSHI ACTION ASSISTANT & REAL-TIME QUERIES
// =============================================================================

export function getCustomerKhataByNameOrPhone(businessId: string, query: string): {
  customer: CustomerRow | null;
  balancePkr: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    amountPkr: number;
    newBalancePkr: number;
    date: string;
    notes: string | null;
  }>;
} {
  const db = getDatabase();
  const trimmed = query.trim();
  const customer = db.prepare(`
    SELECT * FROM customers
    WHERE business_id = ? AND (name LIKE ? OR phone LIKE ?)
    LIMIT 1
  `).get(businessId, `%${trimmed}%`, `%${trimmed}%`) as unknown as CustomerRow | undefined;

  if (!customer) {
    return { customer: null, balancePkr: 0, recentTransactions: [] };
  }

  const txs = db.prepare(`
    SELECT * FROM khata_transactions
    WHERE business_id = ? AND party_type = 'customer' AND party_id = ? AND is_voided = 0
    ORDER BY created_at DESC
    LIMIT 10
  `).all(businessId, customer.id) as unknown as KhataTransactionRow[];

  return {
    customer,
    balancePkr: paisaToPkr(customer.current_balance_paisa),
    recentTransactions: txs.map(t => ({
      id: t.id,
      type: t.type,
      amountPkr: paisaToPkr(t.amount_paisa),
      newBalancePkr: paisaToPkr(t.new_balance_paisa),
      date: t.created_at.split('T')[0],
      notes: t.notes,
    })),
  };
}

export function getTodayBusinessSummary(businessId: string): {
  todayDate: string;
  todaySalesPkr: number;
  todaySalesCount: number;
  todayPurchasesPkr: number;
  todayExpensesPkr: number;
  todayGrossProfitPkr: number;
  todayNetProfitPkr: number;
  totalLiquidCashPkr: number;
  totalCustomerUdhaarPkr: number;
} {
  const db = getDatabase();
  const today = new Date().toISOString().split('T')[0];

  const salesRow = db.prepare(`
    SELECT 
      COALESCE(SUM(total_amount_paisa), 0) as total_sales,
      COUNT(*) as count
    FROM sales
    WHERE business_id = ? AND is_voided = 0 AND created_at LIKE ?
  `).get(businessId, `${today}%`) as { total_sales: number; count: number };

  const cogsRow = db.prepare(`
    SELECT COALESCE(SUM(si.quantity * si.purchase_price_paisa), 0) as total_cogs
    FROM sale_items si
    JOIN sales s ON si.sale_id = s.id
    WHERE s.business_id = ? AND s.is_voided = 0 AND s.created_at LIKE ?
  `).get(businessId, `${today}%`) as { total_cogs: number };

  const expRow = db.prepare(`
    SELECT COALESCE(SUM(amount_paisa), 0) as total_exp
    FROM expenses
    WHERE business_id = ? AND (date = ? OR created_at LIKE ?)
  `).get(businessId, today, `${today}%`) as { total_exp: number };

  const purchRow = db.prepare(`
    SELECT COALESCE(SUM(total_amount_paisa), 0) as total_purch
    FROM purchases
    WHERE business_id = ? AND is_voided = 0 AND (date = ? OR created_at LIKE ?)
  `).get(businessId, today, `${today}%`) as { total_purch: number };

  const custRow = db.prepare(`
    SELECT COALESCE(SUM(current_balance_paisa), 0) as udhaar
    FROM customers WHERE business_id = ?
  `).get(businessId) as { udhaar: number };

  const accRow = db.prepare(`
    SELECT COALESCE(SUM(current_balance_paisa), 0) as liquid
    FROM financial_accounts WHERE business_id = ? AND is_active = 1
  `).get(businessId) as { liquid: number };

  const todaySalesPkr = paisaToPkr(salesRow.total_sales);
  const todayCogsPkr = paisaToPkr(cogsRow.total_cogs);
  const todayExpensesPkr = paisaToPkr(expRow.total_exp);
  const todayGrossProfitPkr = todaySalesPkr - todayCogsPkr;
  const todayNetProfitPkr = todayGrossProfitPkr - todayExpensesPkr;

  return {
    todayDate: today,
    todaySalesPkr,
    todaySalesCount: salesRow.count,
    todayPurchasesPkr: paisaToPkr(purchRow.total_purch),
    todayExpensesPkr,
    todayGrossProfitPkr,
    todayNetProfitPkr,
    totalLiquidCashPkr: paisaToPkr(accRow.liquid),
    totalCustomerUdhaarPkr: paisaToPkr(custRow.udhaar),
  };
}

export function executeAIMunshiAction(
  businessId: string,
  action: {
    type: 'ADD_UDHAAR' | 'RECORD_PAYMENT' | 'ADD_EXPENSE' | 'ADJUST_STOCK' | 'CREATE_INVOICE';
    details: any;
    userApproved: boolean;
    createdBy?: string;
  }
): { success: boolean; message: string; result: any } {
  if (!action.userApproved) {
    throw new Error('Financial action blocked: Explicit user confirmation is strictly mandatory.');
  }

  const db = getDatabase();
  const operator = action.createdBy || 'AI Munshi (Owner Approved)';

  return runTransaction(() => {
    switch (action.type) {
      case 'ADD_UDHAAR': {
        const { customerName, customerPhone, amount, notes } = action.details;
        if (!customerName || !amount || Number(amount) <= 0) {
          throw new Error('Customer name and a positive amount are required to record Udhaar.');
        }

        let customer = db.prepare(`
          SELECT * FROM customers WHERE business_id = ? AND name LIKE ? LIMIT 1
        `).get(businessId, `%${customerName.trim()}%`) as unknown as CustomerRow | undefined;

        if (!customer) {
          customer = createCustomer(businessId, {
            name: customerName.trim(),
            phone: customerPhone?.trim() || null,
            notes: 'Created via AI Munshi Action',
          });
        }

        const khataTx = recordKhataTransaction(businessId, {
          partyType: 'customer',
          partyId: customer.id,
          partyName: customer.name,
          type: 'credit_given',
          amountPkr: Number(amount),
          notes: notes || 'AI Munshi verified credit (Udhaar)',
          createdBy: operator,
        });

        return {
          success: true,
          message: `Kamyabi! ${customer.name} ko Rs. ${amount} udhaar darj ho gaya. Naya baqaya: Rs. ${paisaToPkr(khataTx.new_balance_paisa)}`,
          result: khataTx,
        };
      }

      case 'RECORD_PAYMENT': {
        const { customerName, customerPhone, amount, accountType = 'cash', notes } = action.details;
        if (!customerName || !amount || Number(amount) <= 0) {
          throw new Error('Customer name and positive amount are required to record payment.');
        }

        const customer = db.prepare(`
          SELECT * FROM customers WHERE business_id = ? AND name LIKE ? LIMIT 1
        `).get(businessId, `%${customerName.trim()}%`) as unknown as CustomerRow | undefined;

        if (!customer) {
          throw new Error(`Customer "${customerName}" nahi mila. Pehle customer record banayein.`);
        }

        const khataTx = recordKhataTransaction(businessId, {
          partyType: 'customer',
          partyId: customer.id,
          partyName: customer.name,
          type: 'payment_received',
          amountPkr: Number(amount),
          notes: notes || `Wasooli received via AI Munshi into ${accountType.toUpperCase()}`,
          createdBy: operator,
        });

        // Deposit into financial account
        const acc = getFinancialAccountByType(businessId, accountType as FinancialAccountType);
        if (acc) {
          const amountPaisa = pkrToPaisa(Number(amount));
          const prevBal = acc.current_balance_paisa;
          const newBal = prevBal + amountPaisa;
          db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?')
            .run(newBal, new Date().toISOString(), acc.id);

          db.prepare(`
            INSERT INTO financial_transactions (
              id, business_id, account_id, type, amount_paisa,
              previous_balance_paisa, new_balance_paisa, category,
              reference_type, reference_id, description, created_by, created_at
            ) VALUES (?, ?, ?, 'money_in', ?, ?, ?, 'customer_wasooli', 'khata', ?, ?, ?, ?)
          `).run(
            `ftx_${Date.now()}_aim`,
            businessId,
            acc.id,
            amountPaisa,
            prevBal,
            newBal,
            khataTx.id,
            `Customer payment from ${customer.name}`,
            operator,
            new Date().toISOString()
          );
        }

        return {
          success: true,
          message: `Shandar! ${customer.name} se Rs. ${amount} wasooli darj ho gayi. Baqaya balance: Rs. ${paisaToPkr(khataTx.new_balance_paisa)}`,
          result: khataTx,
        };
      }

      case 'ADD_EXPENSE': {
        const { category = 'General', amount, notes, paidVia = 'Cash' } = action.details;
        if (!amount || Number(amount) <= 0) {
          throw new Error('Valid expense amount is required.');
        }

        const exp = createExpense(businessId, {
          category,
          amountPkr: Number(amount),
          notes: notes || 'Recorded via AI Munshi',
          paidVia,
          createdBy: operator,
        });

        return {
          success: true,
          message: `Ikhrajat darj ho gaye: ${category} - Rs. ${amount}`,
          result: exp,
        };
      }

      case 'ADJUST_STOCK': {
        const { productName, quantityDelta, reason = 'AI Munshi adjustment' } = action.details;
        if (!productName || !quantityDelta || Number(quantityDelta) === 0) {
          throw new Error('Product name and quantity delta are required.');
        }

        const prod = db.prepare(`
          SELECT * FROM products WHERE business_id = ? AND name LIKE ? LIMIT 1
        `).get(businessId, `%${productName.trim()}%`) as unknown as ProductRow | undefined;

        if (!prod) {
          throw new Error(`Product "${productName}" nahi mili.`);
        }

        const delta = Number(quantityDelta);
        const adj = adjustStock(
          businessId,
          prod.id,
          delta,
          delta > 0 ? 'adjustment' : 'damage',
          reason,
          operator
        );

        return {
          success: true,
          message: `${prod.name} ka stock tabdeel ho gaya: ${delta > 0 ? '+' : ''}${delta}. Naya stock: ${adj.product.current_stock}`,
          result: adj,
        };
      }

      default:
        throw new Error(`Unsupported action type: ${(action as any).type}`);
    }
  });
}

// =============================================================================
// PHASE 3: SMART BILL / PARCHI BATCH PROCESSING & SAVING
// =============================================================================

export function saveApprovedParsedBills(
  businessId: string,
  bills: Array<{
    billType: 'purchase' | 'sale';
    partyName: string;
    partyPhone?: string;
    date?: string;
    invoiceNumber?: string;
    items: Array<{
      name: string;
      quantity: number;
      unitPricePkr: number;
      totalPkr: number;
      unit?: string;
    }>;
    paidAmountPkr?: number;
    paymentMethod?: 'cash' | 'credit' | 'bank' | 'easypaisa' | 'jazzcash';
    notes?: string;
    createdBy?: string;
  }>,
  approvedBy?: string
): Array<{ success: boolean; id: string; billType: string; partyName: string; totalAmountPkr: number }> {
  return runTransaction(() => {
    const db = getDatabase();
    const results: Array<{ success: boolean; id: string; billType: string; partyName: string; totalAmountPkr: number }> = [];

    for (const bill of bills) {
      if (!bill.items || bill.items.length === 0) continue;

      if (bill.billType === 'purchase') {
        const purch = createPurchase(businessId, {
          supplierName: bill.partyName || 'Market Purchase',
          date: bill.date || new Date().toISOString().split('T')[0],
          supplierInvoiceNo: bill.invoiceNumber || `BILL-${Date.now().toString().slice(-6)}`,
          paymentMethod: bill.paymentMethod || 'cash',
          paidAmountPkr: bill.paidAmountPkr !== undefined ? bill.paidAmountPkr : bill.items.reduce((s, i) => s + (i.totalPkr || 0), 0),
          notes: bill.notes || 'Imported from Smart Bill / Parchi OCR',
          createdBy: bill.createdBy || approvedBy || 'Smart Bill AI',
          items: bill.items.map(it => ({
            productName: it.name,
            quantity: Number(it.quantity) || 1,
            costPricePkr: Number(it.unitPricePkr) || 0,
            unit: it.unit || 'unit',
          })),
        });

        results.push({
          success: true,
          id: purch.purchase.id,
          billType: 'purchase',
          partyName: purch.purchase.supplier_name,
          totalAmountPkr: paisaToPkr(purch.purchase.total_amount_paisa),
        });
      } else {
        const saleItems = bill.items.map(it => {
          const prodName = it.name.trim() || 'General Item';
          let prod = db.prepare('SELECT id, purchase_price_paisa FROM products WHERE business_id = ? AND name = ?').get(businessId, prodName) as any;
          let prodId = prod?.id;
          if (!prodId) {
            const newP = createProduct(businessId, {
              name: prodName,
              categoryName: 'General',
              purchasePricePkr: Number(it.unitPricePkr) * 0.8,
              sellingPricePkr: Number(it.unitPricePkr) || 0,
              initialStock: 100,
              unit: it.unit || 'unit',
            });
            prodId = newP.id;
          }
          return {
            productId: prodId,
            productName: prodName,
            quantity: Number(it.quantity) || 1,
            unitPricePkr: Number(it.unitPricePkr) || 0,
            unit: it.unit || 'unit',
          };
        });

        const sale = createSale(businessId, {
          customerName: bill.partyName || 'Walk-in Customer',
          customerPhone: bill.partyPhone || undefined,
          paymentMethod: bill.paymentMethod || 'cash',
          paidAmountPkr: bill.paidAmountPkr !== undefined ? bill.paidAmountPkr : bill.items.reduce((s, i) => s + (i.totalPkr || 0), 0),
          notes: bill.notes || 'Imported from Smart Bill / Parchi OCR',
          createdBy: bill.createdBy || approvedBy || 'Smart Bill AI',
          items: saleItems,
        });

        results.push({
          success: true,
          id: sale.sale.id,
          billType: 'sale',
          partyName: sale.sale.customer_name,
          totalAmountPkr: paisaToPkr(sale.sale.total_amount_paisa),
        });
      }
    }

    return results;
  });
}

// =============================================================================
// PHASE 3: CASH RECONCILIATION & DAILY CLOSING
// =============================================================================

export function reconcileCashAccount(
  businessId: string,
  input: {
    accountType: FinancialAccountType;
    physicalCountPkr: number;
    notes?: string;
    createdBy?: string;
    autoAdjust?: boolean;
  }
): {
  reconciliation: CashReconciliationRow;
  systemBalancePkr: number;
  physicalCountPkr: number;
  differencePkr: number;
  isBalanced: boolean;
  adjustmentTransaction?: FinancialTransactionRow;
} {
  const db = getDatabase();
  const now = new Date().toISOString();
  const dateStr = now.split('T')[0];
  const account = getFinancialAccountByType(businessId, input.accountType);

  if (!account) {
    throw new Error(`Financial account of type "${input.accountType}" not found.`);
  }

  const physicalPaisa = pkrToPaisa(input.physicalCountPkr);
  const systemPaisa = account.current_balance_paisa;
  const diffPaisa = physicalPaisa - systemPaisa;
  const recId = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return runTransaction(() => {
    db.prepare(`
      INSERT INTO cash_reconciliations (
        id, business_id, account_id, system_balance_paisa,
        physical_count_paisa, difference_paisa, notes, date, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      recId,
      businessId,
      account.id,
      systemPaisa,
      physicalPaisa,
      diffPaisa,
      input.notes || null,
      dateStr,
      input.createdBy || 'Owner',
      now
    );

    let adjTx: FinancialTransactionRow | undefined;

    if (input.autoAdjust && diffPaisa !== 0) {
      const isSurplus = diffPaisa > 0;
      const absDiff = Math.abs(diffPaisa);
      const ftxId = `ftx_${Date.now()}_rec`;

      db.prepare('UPDATE financial_accounts SET current_balance_paisa = ?, updated_at = ? WHERE id = ?')
        .run(physicalPaisa, now, account.id);

      db.prepare(`
        INSERT INTO financial_transactions (
          id, business_id, account_id, type, amount_paisa,
          previous_balance_paisa, new_balance_paisa, category,
          reference_type, reference_id, description, created_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'cash_reconciliation', 'reconciliation', ?, ?, ?, ?)
      `).run(
        ftxId,
        businessId,
        account.id,
        isSurplus ? 'money_in' : 'money_out',
        absDiff,
        systemPaisa,
        physicalPaisa,
        recId,
        isSurplus ? 'Daily closing physical cash surplus' : 'Daily closing physical cash shortage',
        input.createdBy || 'Owner',
        now
      );

      adjTx = db.prepare('SELECT * FROM financial_transactions WHERE id = ?').get(ftxId) as unknown as FinancialTransactionRow;
    }

    const rec = db.prepare('SELECT * FROM cash_reconciliations WHERE id = ?').get(recId) as unknown as CashReconciliationRow;

    return {
      reconciliation: rec,
      systemBalancePkr: paisaToPkr(systemPaisa),
      physicalCountPkr: input.physicalCountPkr,
      differencePkr: paisaToPkr(diffPaisa),
      isBalanced: diffPaisa === 0,
      adjustmentTransaction: adjTx,
    };
  });
}

export function getReconciliationHistory(businessId: string, limit: number = 20): Array<{
  id: string;
  accountName: string;
  accountType: string;
  systemBalancePkr: number;
  physicalCountPkr: number;
  differencePkr: number;
  date: string;
  notes: string | null;
  createdBy: string;
  createdAt: string;
}> {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT r.*, a.name as account_name, a.type as account_type
    FROM cash_reconciliations r
    JOIN financial_accounts a ON r.account_id = a.id
    WHERE r.business_id = ?
    ORDER BY r.created_at DESC
    LIMIT ?
  `).all(businessId, limit) as any[];

  return rows.map(r => ({
    id: r.id,
    accountName: r.account_name,
    accountType: r.account_type,
    systemBalancePkr: paisaToPkr(r.system_balance_paisa),
    physicalCountPkr: paisaToPkr(r.physical_count_paisa),
    differencePkr: paisaToPkr(r.difference_paisa),
    date: r.date,
    notes: r.notes,
    createdBy: r.created_by,
    createdAt: r.created_at,
  }));
}

// =============================================================================
// PHASE 3: SMART ALERTS & NOTIFICATIONS
// =============================================================================

export function getSmartBusinessAlerts(businessId: string, businessType?: string): SmartAlertItem[] {
  const db = getDatabase();
  const alerts: SmartAlertItem[] = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Low Stock Alerts
  const lowStock = db.prepare(`
    SELECT id, name, current_stock, low_stock_threshold, unit
    FROM products
    WHERE business_id = ? AND is_active = 1 AND current_stock <= low_stock_threshold
    LIMIT 5
  `).all(businessId) as any[];

  for (const item of lowStock) {
    alerts.push({
      id: `alert_stock_${item.id}`,
      type: 'low_stock',
      severity: item.current_stock <= 0 ? 'high' : 'medium',
      title: item.current_stock <= 0 ? 'مال ختم ہو چکا ہے' : 'اسٹاک کم ہے',
      description: `${item.name}: صرف ${item.current_stock} ${item.unit} باقی ہے۔ جلدی آرڈر کریں۔`,
      entityId: item.id,
      actionRoute: '/products',
    });
  }

  // 2. High Customer Udhaar Balances
  const highUdhaar = db.prepare(`
    SELECT id, name, current_balance_paisa, phone
    FROM customers
    WHERE business_id = ? AND current_balance_paisa >= 500000 -- >= Rs. 5,000
    ORDER BY current_balance_paisa DESC
    LIMIT 4
  `).all(businessId) as any[];

  for (const cust of highUdhaar) {
    const balPkr = paisaToPkr(cust.current_balance_paisa);
    alerts.push({
      id: `alert_cust_${cust.id}`,
      type: 'customer_udhaar',
      severity: balPkr >= 20000 ? 'high' : 'medium',
      title: 'گاہک کی بڑی رقم واجب الادا',
      description: `${cust.name} کے ذمے Rs. ${balPkr.toLocaleString()} بقایا ہیں۔ وصولی کے لیے یاد دہانی بھیجیں۔`,
      entityId: cust.id,
      amountPkr: balPkr,
      actionRoute: '/khata',
    });
  }

  // 3. Salesman Unsettled Cash in Hand
  const salesmenWithCash = db.prepare(`
    SELECT id, name, cash_in_hand_paisa
    FROM staff
    WHERE business_id = ? AND cash_in_hand_paisa > 0 AND status = 'active'
  `).all(businessId) as any[];

  for (const sm of salesmenWithCash) {
    const cashPkr = paisaToPkr(sm.cash_in_hand_paisa);
    alerts.push({
      id: `alert_sm_${sm.id}`,
      type: 'salesman_unsettled',
      severity: 'medium',
      title: 'سیلزمین کی وصولی رقم جمع ہونے کی منتظر',
      description: `سیلزمین ${sm.name} کے پاس Rs. ${cashPkr.toLocaleString()} وصولی نقد ہے۔ دکان کے کیش میں جمع کروائیں۔`,
      entityId: sm.id,
      amountPkr: cashPkr,
      actionRoute: '/staff',
    });
  }

  // 4. Daily Closing / Cash Reconciliation Reminder
  const todayRec = db.prepare(`
    SELECT id FROM cash_reconciliations WHERE business_id = ? AND date = ? LIMIT 1
  `).get(businessId, today);

  if (!todayRec) {
    alerts.push({
      id: `alert_closing_${today}`,
      type: 'daily_closing',
      severity: 'info',
      title: 'آج کا کھاتہ بندش (Daily Closing)',
      description: 'آج کے دن کا نقد گن کر کلوزنگ اور حساب برابر کریں۔',
      actionRoute: '/financials',
      date: today,
    });
  }

  return alerts;
}

// =============================================================================
// PHASE 3: ADVANCED PERIODIC REPORTS & WHATSAPP EXPORT
// =============================================================================

export function getAdvancedPeriodicReport(
  businessId: string,
  period: 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom',
  startDate?: string,
  endDate?: string
): PeriodicReportData {
  const db = getDatabase();
  const now = new Date();
  let start = startDate || now.toISOString().split('T')[0];
  let end = endDate || now.toISOString().split('T')[0];

  if (period === 'today') {
    start = now.toISOString().split('T')[0];
    end = start;
  } else if (period === 'yesterday') {
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    start = yest.toISOString().split('T')[0];
    end = start;
  } else if (period === 'this_week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    start = d.toISOString().split('T')[0];
    end = now.toISOString().split('T')[0];
  } else if (period === 'this_month') {
    start = `${now.toISOString().slice(0, 7)}-01`;
    end = now.toISOString().split('T')[0];
  }

  const startIso = `${start}T00:00:00`;
  const endIso = `${end}T23:59:59`;

  // Sales
  const salesRow = db.prepare(`
    SELECT 
      COUNT(*) as count,
      COALESCE(SUM(total_amount_paisa), 0) as total,
      COALESCE(SUM(paid_amount_paisa), 0) as cash_part,
      COALESCE(SUM(CASE WHEN payment_status = 'unpaid' THEN total_amount_paisa WHEN payment_status = 'partial' THEN total_amount_paisa - paid_amount_paisa ELSE 0 END), 0) as credit_part
    FROM sales
    WHERE business_id = ? AND is_voided = 0 AND created_at >= ? AND created_at <= ?
  `).get(businessId, startIso, endIso) as any;

  // COGS
  const cogsRow = db.prepare(`
    SELECT COALESCE(SUM(si.quantity * si.purchase_price_paisa), 0) as cogs
    FROM sale_items si
    JOIN sales s ON si.sale_id = s.id
    WHERE s.business_id = ? AND s.is_voided = 0 AND s.created_at >= ? AND s.created_at <= ?
  `).get(businessId, startIso, endIso) as any;

  // Purchases
  const purchRow = db.prepare(`
    SELECT 
      COUNT(*) as count,
      COALESCE(SUM(total_amount_paisa), 0) as total
    FROM purchases
    WHERE business_id = ? AND is_voided = 0 AND date >= ? AND date <= ?
  `).get(businessId, start, end) as any;

  // Expenses
  const expRow = db.prepare(`
    SELECT COALESCE(SUM(amount_paisa), 0) as total
    FROM expenses
    WHERE business_id = ? AND date >= ? AND date <= ?
  `).get(businessId, start, end) as any;

  // Staff Salaries
  const staffRow = db.prepare(`
    SELECT COALESCE(SUM(amount_paisa), 0) as total
    FROM staff_transactions
    WHERE business_id = ? AND type = 'salary_payment' AND date >= ? AND date <= ?
  `).get(businessId, start, end) as any;

  // Transport profit
  const tripRow = db.prepare(`
    SELECT COALESCE(SUM(trip_profit_paisa), 0) as profit
    FROM transport_trips
    WHERE business_id = ? AND date >= ? AND date <= ?
  `).get(businessId, start, end) as any;

  // Commissions
  const commRow = db.prepare(`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'receivable' THEN amount_paisa ELSE 0 END), 0) as earned,
      COALESCE(SUM(CASE WHEN type = 'payable' THEN amount_paisa ELSE 0 END), 0) as paid
    FROM commissions
    WHERE business_id = ? AND date >= ? AND date <= ?
  `).get(businessId, start, end) as any;

  // Overall Balances
  const custRow = db.prepare('SELECT COALESCE(SUM(current_balance_paisa), 0) as val FROM customers WHERE business_id = ?').get(businessId) as any;
  const suppRow = db.prepare('SELECT COALESCE(SUM(current_balance_paisa), 0) as val FROM suppliers WHERE business_id = ?').get(businessId) as any;
  const stockRow = db.prepare('SELECT COALESCE(SUM(current_stock * purchase_price_paisa), 0) as val FROM products WHERE business_id = ? AND is_active = 1').get(businessId) as any;

  const accounts = getFinancialAccounts(businessId);
  const cashAcc = accounts.find(a => a.type === 'cash');
  const bankAcc = accounts.find(a => a.type === 'bank');
  const epAcc = accounts.find(a => a.type === 'easypaisa');
  const jcAcc = accounts.find(a => a.type === 'jazzcash');

  const totalSalesPkr = paisaToPkr(salesRow.total);
  const totalCogsPkr = paisaToPkr(cogsRow.cogs);
  const grossProfitPkr = totalSalesPkr - totalCogsPkr;
  const totalExpensesPkr = paisaToPkr(expRow.total);
  const staffSalariesPaidPkr = paisaToPkr(staffRow.total);
  const transportProfitPkr = paisaToPkr(tripRow.profit);
  const commissionNetPkr = paisaToPkr(commRow.earned - commRow.paid);
  const netProfitPkr = grossProfitPkr + transportProfitPkr + commissionNetPkr - (totalExpensesPkr + staffSalariesPaidPkr);

  const cashInHandPkr = paisaToPkr(cashAcc?.current_balance_paisa || 0);
  const bankBalancePkr = paisaToPkr(bankAcc?.current_balance_paisa || 0);
  const easypaisaBalancePkr = paisaToPkr(epAcc?.current_balance_paisa || 0);
  const jazzcashBalancePkr = paisaToPkr(jcAcc?.current_balance_paisa || 0);
  const totalLiquidCashPkr = cashInHandPkr + bankBalancePkr + easypaisaBalancePkr + jazzcashBalancePkr;

  const whatsappSummaryText = `📊 *آسانی بز — کاروباری رپورٹ (${period.toUpperCase()})*
📅 تاریخ: ${start} تا ${end}
━━━━━━━━━━━━━━━━━━
💰 *کل فروخت (Sales):* Rs. ${totalSalesPkr.toLocaleString()} (${salesRow.count} بلز)
💵 *نقد سیل:* Rs. ${paisaToPkr(salesRow.cash_part).toLocaleString()}
📝 *ادھار سیل:* Rs. ${paisaToPkr(salesRow.credit_part).toLocaleString()}
📦 *کل خریداری:* Rs. ${paisaToPkr(purchRow.total).toLocaleString()}
🏷️ *اخراجات:* Rs. ${totalExpensesPkr.toLocaleString()}
📈 *خالص منافع (Net Profit):* Rs. ${netProfitPkr.toLocaleString()}
━━━━━━━━━━━━━━━━━━
👥 *گاہکوں کا بقایا ادھار:* Rs. ${paisaToPkr(custRow.val).toLocaleString()}
🏭 *سپلائر واجبات:* Rs. ${paisaToPkr(suppRow.val).toLocaleString()}
💼 *کیش اور بینک بیلنس:* Rs. ${totalLiquidCashPkr.toLocaleString()}
━━━━━━━━━━━━━━━━━━
_بشکریہ: آسانی بز (AsaniBiz) ڈیجیٹل منشی_`;

  return {
    period,
    startDate: start,
    endDate: end,
    salesCount: salesRow.count,
    totalSalesPkr,
    cashSalesPkr: paisaToPkr(salesRow.cash_part),
    creditSalesPkr: paisaToPkr(salesRow.credit_part),
    totalCogsPkr,
    grossProfitPkr,
    purchasesCount: purchRow.count,
    totalPurchasesPkr: paisaToPkr(purchRow.total),
    totalExpensesPkr,
    staffSalariesPaidPkr,
    staffAdvancesActivePkr: 0,
    transportProfitPkr,
    commissionNetPkr,
    netProfitPkr,
    customerOutstandingPkr: paisaToPkr(custRow.val),
    supplierPayablePkr: paisaToPkr(suppRow.val),
    cashInHandPkr,
    bankBalancePkr,
    easypaisaBalancePkr,
    jazzcashBalancePkr,
    totalLiquidCashPkr,
    stockValuationPkr: paisaToPkr(stockRow.val),
    salesmanRecoveriesPkr: 0,
    whatsappSummaryText,
  };
}

// =============================================================================
// PHASE 3: PRODUCTION SECURITY & OFFLINE SYNC BATCH
// =============================================================================

export function verifyOrSetShopPin(
  businessId: string,
  pin: string,
  isSetting: boolean = false
): { success: boolean; message: string; role: 'owner' } {
  const db = getDatabase();
  const trimmed = pin.trim();

  if (trimmed.length < 4) {
    throw new Error('Security PIN must be at least 4 digits.');
  }

  const user = db.prepare('SELECT * FROM users WHERE business_id = ? AND role = "owner" LIMIT 1').get(businessId) as any;

  if (isSetting) {
    if (user) {
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(trimmed, user.id);
    } else {
      db.prepare(`
        INSERT INTO users (id, business_id, username, full_name, role, password_hash, created_at)
        VALUES (?, ?, 'owner', 'Dukandaar', 'owner', ?, ?)
      `).run(`user_${Date.now()}`, businessId, trimmed, new Date().toISOString());
    }
    return { success: true, message: 'Shop security PIN updated successfully.', role: 'owner' };
  }

  // Verification
  if (!user || !user.password_hash) {
    // Default allowed if not set yet
    return { success: true, message: 'PIN verification successful (Default).', role: 'owner' };
  }

  if (user.password_hash === trimmed) {
    return { success: true, message: 'PIN verification verified.', role: 'owner' };
  }

  throw new Error('Ghalat PIN! Baraye meherbani sahi 4-digit PIN darj karein.');
}

export function processOfflineSyncBatch(
  businessId: string,
  items: Array<{
    id: string;
    type: 'sale' | 'customer_payment' | 'expense' | 'salesman_recovery';
    payload: any;
    idempotencyKey?: string;
  }>
): { processed: number; skipped: number; errors: string[] } {
  let processed = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      runTransaction(() => {
        if (item.type === 'sale') {
          createSale(businessId, {
            ...item.payload,
            idempotencyKey: item.idempotencyKey || `sync_${item.id}`,
          });
          processed += 1;
        } else if (item.type === 'customer_payment') {
          recordKhataTransaction(businessId, {
            ...item.payload,
            idempotencyKey: item.idempotencyKey || `sync_${item.id}`,
          });
          processed += 1;
        } else if (item.type === 'expense') {
          createExpense(businessId, item.payload);
          processed += 1;
        } else if (item.type === 'salesman_recovery') {
          recordSalesmanRecovery(businessId, {
            ...item.payload,
            idempotencyKey: item.idempotencyKey || `sync_${item.id}`,
          });
          processed += 1;
        }
      });
    } catch (e: any) {
      if (e.message?.includes('UNIQUE constraint failed: khata_transactions.idempotency_key')) {
        skipped += 1; // Already synced safely
      } else {
        errors.push(`Item ${item.id} (${item.type}): ${e.message}`);
      }
    }
  }

  return { processed, skipped, errors };
}

