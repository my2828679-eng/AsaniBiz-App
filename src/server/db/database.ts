import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const BACKUP_DIR = path.resolve(DATA_DIR, 'backups');
const DB_FILE = process.env.DATABASE_FILE || path.join(DATA_DIR, 'asanibiz.sqlite');

let dbInstance: DatabaseSync | null = null;
let inTransaction = false;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    dbInstance = new DatabaseSync(DB_FILE);

    // Hardened SQLite PRAGMAs for production durability, concurrency & data integrity
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA synchronous = NORMAL;');
    dbInstance.exec('PRAGMA temp_store = MEMORY;');
    dbInstance.exec('PRAGMA busy_timeout = 5000;');

    initSchema(dbInstance);
  }
  return dbInstance;
}

/**
 * Execute work inside an atomic SQLite transaction (BEGIN IMMEDIATE / COMMIT / ROLLBACK).
 * Safely supports nested calls.
 */
export function runTransaction<T>(work: (db: DatabaseSync) => T): T {
  const db = getDatabase();
  if (inTransaction) {
    return work(db);
  }

  inTransaction = true;
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = work(db);
    db.exec('COMMIT');
    return result;
  } catch (error) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // Ignore rollback failure if already rolled back
    }
    throw error;
  } finally {
    inTransaction = false;
  }
}

/**
 * Initialize production relational schema with constraints, foreign keys & indexes
 */
export function initSchema(db: DatabaseSync): void {
  db.exec(`
    -- 1. Businesses / Shops
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      business_type TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      country TEXT DEFAULT 'Pakistan',
      currency TEXT DEFAULT 'PKR',
      preferred_language TEXT DEFAULT 'ur',
      logo_url TEXT,
      tagline TEXT,
      theme_color TEXT DEFAULT '#0a5e54',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 2. Users / Staff with Role-Based Access Control
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      username TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('owner', 'manager', 'cashier', 'staff')),
      permissions TEXT DEFAULT '["all"]',
      password_hash TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      UNIQUE(business_id, username)
    );

    -- 3. Subscriptions & Package Quotas
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      status TEXT NOT NULL CHECK(status IN ('trial', 'active', 'expired', 'cancelled')),
      plan TEXT NOT NULL,
      price_pkr INTEGER NOT NULL DEFAULT 700,
      trial_end_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 4. Categories
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(business_id, name)
    );

    -- 5. Products (Integer Paisa for Currency Precision)
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
      category_name TEXT NOT NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      barcode TEXT,
      purchase_price_paisa INTEGER NOT NULL CHECK(purchase_price_paisa >= 0),
      selling_price_paisa INTEGER NOT NULL CHECK(selling_price_paisa >= 0),
      current_stock REAL NOT NULL DEFAULT 0,
      low_stock_threshold REAL NOT NULL DEFAULT 5,
      unit TEXT NOT NULL DEFAULT 'unit',
      image_url TEXT,
      notes TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(business_id, sku)
    );

    -- 6. Stock Movements (Full Audit Trail)
    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      movement_type TEXT NOT NULL CHECK(movement_type IN ('opening', 'purchase', 'sale', 'sale_return', 'purchase_return', 'adjustment', 'damage', 'void_reversal')),
      quantity_change REAL NOT NULL,
      previous_stock REAL NOT NULL,
      new_stock REAL NOT NULL,
      unit_cost_paisa INTEGER NOT NULL DEFAULT 0,
      reference_type TEXT NOT NULL CHECK(reference_type IN ('invoice', 'purchase', 'manual', 'void', 'initial')),
      reference_id TEXT,
      notes TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- 7. Customers
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      opening_balance_paisa INTEGER NOT NULL DEFAULT 0,
      current_balance_paisa INTEGER NOT NULL DEFAULT 0,
      credit_limit_paisa INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 8. Suppliers
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      company_name TEXT,
      payable_balance_paisa INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 9. Sales / Invoices
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      invoice_number TEXT NOT NULL,
      customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      subtotal_paisa INTEGER NOT NULL CHECK(subtotal_paisa >= 0),
      discount_paisa INTEGER NOT NULL DEFAULT 0 CHECK(discount_paisa >= 0),
      tax_paisa INTEGER NOT NULL DEFAULT 0 CHECK(tax_paisa >= 0),
      total_amount_paisa INTEGER NOT NULL CHECK(total_amount_paisa >= 0),
      paid_amount_paisa INTEGER NOT NULL DEFAULT 0 CHECK(paid_amount_paisa >= 0),
      payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'jazzcash', 'easypaisa', 'bank', 'credit')),
      payment_status TEXT NOT NULL CHECK(payment_status IN ('paid', 'unpaid', 'partial')),
      notes TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_voided INTEGER NOT NULL DEFAULT 0,
      void_reason TEXT,
      voided_at TEXT,
      voided_by TEXT,
      UNIQUE(business_id, invoice_number)
    );

    -- 10. Sale Line Items
    CREATE TABLE IF NOT EXISTS sale_items (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      product_name TEXT NOT NULL,
      quantity REAL NOT NULL CHECK(quantity > 0),
      unit_price_paisa INTEGER NOT NULL CHECK(unit_price_paisa >= 0),
      purchase_price_paisa INTEGER NOT NULL DEFAULT 0 CHECK(purchase_price_paisa >= 0),
      total_paisa INTEGER NOT NULL CHECK(total_paisa >= 0),
      unit TEXT NOT NULL DEFAULT 'unit'
    );

    -- 11. Purchases
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
      supplier_name TEXT NOT NULL,
      supplier_invoice_no TEXT,
      total_amount_paisa INTEGER NOT NULL CHECK(total_amount_paisa >= 0),
      paid_amount_paisa INTEGER NOT NULL DEFAULT 0 CHECK(paid_amount_paisa >= 0),
      balance_amount_paisa INTEGER NOT NULL DEFAULT 0 CHECK(balance_amount_paisa >= 0),
      payment_status TEXT NOT NULL CHECK(payment_status IN ('paid', 'unpaid', 'partial', 'pending')),
      date TEXT NOT NULL,
      notes TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_voided INTEGER NOT NULL DEFAULT 0,
      void_reason TEXT,
      voided_at TEXT
    );

    -- 12. Purchase Line Items
    CREATE TABLE IF NOT EXISTS purchase_items (
      id TEXT PRIMARY KEY,
      purchase_id TEXT NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      product_name TEXT NOT NULL,
      quantity REAL NOT NULL CHECK(quantity > 0),
      cost_price_paisa INTEGER NOT NULL CHECK(cost_price_paisa >= 0),
      total_paisa INTEGER NOT NULL CHECK(total_paisa >= 0),
      unit TEXT NOT NULL DEFAULT 'unit'
    );

    -- 13. Khata / Ledger (Immutable Journal with Safe Reversals)
    CREATE TABLE IF NOT EXISTS khata_transactions (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      party_type TEXT NOT NULL CHECK(party_type IN ('customer', 'supplier')),
      party_id TEXT NOT NULL,
      party_name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('credit_given', 'payment_received', 'purchase_credit', 'payment_made', 'reversal_credit', 'reversal_payment')),
      amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0),
      previous_balance_paisa INTEGER NOT NULL,
      new_balance_paisa INTEGER NOT NULL,
      reference_type TEXT NOT NULL CHECK(reference_type IN ('invoice', 'purchase', 'manual', 'void_reversal', 'opening_balance')),
      reference_id TEXT,
      notes TEXT,
      idempotency_key TEXT UNIQUE,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_voided INTEGER NOT NULL DEFAULT 0,
      void_reason TEXT,
      voided_at TEXT,
      voided_by TEXT
    );

    -- 14. Expenses
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0),
      paid_via TEXT NOT NULL DEFAULT 'Cash',
      notes TEXT,
      date TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- 15. AI Usage Logs
    CREATE TABLE IF NOT EXISTS ai_usage_logs (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      model TEXT NOT NULL,
      prompt_length INTEGER NOT NULL DEFAULT 0,
      tokens_estimated INTEGER NOT NULL DEFAULT 0,
      cost_pkr_estimated REAL NOT NULL DEFAULT 0,
      routing_source TEXT NOT NULL,
      action_proposed TEXT,
      success INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    -- 16. Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );

    -- 17. Financial Accounts (Cash, Bank, Easypaisa, JazzCash)
    CREATE TABLE IF NOT EXISTS financial_accounts (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('cash', 'bank', 'easypaisa', 'jazzcash')),
      account_number TEXT,
      bank_name TEXT,
      opening_balance_paisa INTEGER NOT NULL DEFAULT 0,
      current_balance_paisa INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(business_id, type)
    );

    -- 18. Financial Ledger / Transactions (All money in & out)
    CREATE TABLE IF NOT EXISTS financial_transactions (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      account_id TEXT NOT NULL REFERENCES financial_accounts(id) ON DELETE RESTRICT,
      type TEXT NOT NULL CHECK(type IN ('money_in', 'money_out', 'transfer_in', 'transfer_out')),
      amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0),
      previous_balance_paisa INTEGER NOT NULL,
      new_balance_paisa INTEGER NOT NULL,
      category TEXT NOT NULL,
      reference_type TEXT,
      reference_id TEXT,
      description TEXT,
      created_by TEXT NOT NULL DEFAULT 'Owner',
      created_at TEXT NOT NULL
    );

    -- 19. Product Variants (Specific size, color, pack tracking)
    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      sku TEXT,
      purchase_price_paisa INTEGER NOT NULL DEFAULT 0,
      selling_price_paisa INTEGER NOT NULL DEFAULT 0,
      current_stock REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 20. Staff / Employees
    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      employee_id TEXT,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT,
      joining_date TEXT,
      salary_paisa INTEGER NOT NULL DEFAULT 0,
      advance_balance_paisa INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'terminated')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 21. Staff Financial Transactions (Salary, Advance, Commission, Bonus)
    CREATE TABLE IF NOT EXISTS staff_transactions (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK(type IN ('salary_payment', 'advance', 'commission', 'bonus', 'other_payment')),
      amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0),
      account_id TEXT REFERENCES financial_accounts(id),
      financial_transaction_id TEXT REFERENCES financial_transactions(id),
      date TEXT NOT NULL,
      notes TEXT,
      idempotency_key TEXT UNIQUE,
      created_by TEXT NOT NULL DEFAULT 'Owner',
      created_at TEXT NOT NULL
    );

    -- 22. Commission / Dalali (Brokerage Deals & Payouts/Receivables)
    CREATE TABLE IF NOT EXISTS commissions (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      party_name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('payable', 'receivable')),
      related_sale_id TEXT REFERENCES sales(id) ON DELETE SET NULL,
      related_purchase_id TEXT REFERENCES purchases(id) ON DELETE SET NULL,
      deal_reference TEXT,
      rate_percentage REAL,
      amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0),
      paid_amount_paisa INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK(status IN ('unpaid', 'paid', 'partial')),
      account_id TEXT REFERENCES financial_accounts(id),
      financial_transaction_id TEXT REFERENCES financial_transactions(id),
      date TEXT NOT NULL,
      notes TEXT,
      idempotency_key TEXT UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 23. Transport Trip Hisaab (Freight, Diesel, Route, Transporter)
    CREATE TABLE IF NOT EXISTS transport_trips (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      vehicle_no TEXT NOT NULL,
      driver_name TEXT,
      transporter_name TEXT,
      route TEXT,
      date TEXT NOT NULL,
      related_reference TEXT,
      freight_paisa INTEGER NOT NULL DEFAULT 0,
      diesel_paisa INTEGER NOT NULL DEFAULT 0,
      labour_paisa INTEGER NOT NULL DEFAULT 0,
      other_expense_paisa INTEGER NOT NULL DEFAULT 0,
      total_cost_paisa INTEGER NOT NULL DEFAULT 0,
      paid_amount_paisa INTEGER NOT NULL DEFAULT 0,
      remaining_amount_paisa INTEGER NOT NULL DEFAULT 0,
      payment_status TEXT NOT NULL CHECK(payment_status IN ('paid', 'unpaid', 'partial')),
      account_id TEXT REFERENCES financial_accounts(id),
      financial_transaction_id TEXT REFERENCES financial_transactions(id),
      notes TEXT,
      idempotency_key TEXT UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 24. Assets (Equipment, Refrigerator, Vehicles, Fixtures)
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      purchase_date TEXT NOT NULL,
      purchase_price_paisa INTEGER NOT NULL CHECK(purchase_price_paisa > 0),
      current_value_paisa INTEGER NOT NULL CHECK(current_value_paisa >= 0),
      quantity INTEGER NOT NULL DEFAULT 1,
      account_id TEXT REFERENCES financial_accounts(id),
      financial_transaction_id TEXT REFERENCES financial_transactions(id),
      notes TEXT,
      idempotency_key TEXT UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 25. Liabilities (Loans, Qarz-e-Hasana, Creditor obligations)
    CREATE TABLE IF NOT EXISTS liabilities (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('bank_loan', 'personal_loan', 'committee', 'other')),
      creditor_name TEXT NOT NULL,
      amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0),
      remaining_balance_paisa INTEGER NOT NULL CHECK(remaining_balance_paisa >= 0),
      start_date TEXT NOT NULL,
      due_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 26. Liability Repayments
    CREATE TABLE IF NOT EXISTS liability_payments (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      liability_id TEXT NOT NULL REFERENCES liabilities(id) ON DELETE CASCADE,
      amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0),
      account_id TEXT NOT NULL REFERENCES financial_accounts(id),
      financial_transaction_id TEXT NOT NULL REFERENCES financial_transactions(id),
      payment_date TEXT NOT NULL,
      notes TEXT,
      idempotency_key TEXT UNIQUE,
      created_at TEXT NOT NULL
    );

    -- 27. Returns / Adjustments (Sales & Purchases)
    CREATE TABLE IF NOT EXISTS returns (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      return_type TEXT NOT NULL CHECK(return_type IN ('sale_return', 'purchase_return')),
      original_reference_id TEXT,
      party_type TEXT CHECK(party_type IN ('customer', 'supplier')),
      party_id TEXT,
      party_name TEXT NOT NULL,
      product_id TEXT NOT NULL REFERENCES products(id),
      product_name TEXT NOT NULL,
      quantity REAL NOT NULL CHECK(quantity > 0),
      unit_price_paisa INTEGER NOT NULL CHECK(unit_price_paisa >= 0),
      total_amount_paisa INTEGER NOT NULL CHECK(total_amount_paisa >= 0),
      refund_amount_paisa INTEGER NOT NULL DEFAULT 0 CHECK(refund_amount_paisa >= 0),
      account_id TEXT REFERENCES financial_accounts(id),
      financial_transaction_id TEXT REFERENCES financial_transactions(id),
      reason TEXT,
      created_at TEXT NOT NULL
    );

    -- 28. Specialized Tool Entries (Persistent data for all business specific tools)
    CREATE TABLE IF NOT EXISTS specialized_tool_entries (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      tool_id TEXT NOT NULL,
      reference_title TEXT,
      entry_data_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 29. Cash & Account Reconciliations (Daily Closing & Physical vs System audit)
    CREATE TABLE IF NOT EXISTS cash_reconciliations (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      account_id TEXT NOT NULL REFERENCES financial_accounts(id),
      system_balance_paisa INTEGER NOT NULL,
      physical_count_paisa INTEGER NOT NULL,
      difference_paisa INTEGER NOT NULL,
      notes TEXT,
      date TEXT NOT NULL,
      created_by TEXT NOT NULL DEFAULT 'Owner',
      created_at TEXT NOT NULL
    );

    -- High-Performance Targeted Indexes
    CREATE INDEX IF NOT EXISTS idx_products_biz_name ON products(business_id, name);
    CREATE INDEX IF NOT EXISTS idx_products_biz_sku ON products(business_id, sku);
    CREATE INDEX IF NOT EXISTS idx_products_biz_barcode ON products(business_id, barcode);
    CREATE INDEX IF NOT EXISTS idx_stock_moves_biz_prod ON stock_movements(business_id, product_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_customers_biz_phone ON customers(business_id, phone);
    CREATE INDEX IF NOT EXISTS idx_customers_biz_name ON customers(business_id, name);
    CREATE INDEX IF NOT EXISTS idx_suppliers_biz_phone ON suppliers(business_id, phone);
    CREATE INDEX IF NOT EXISTS idx_sales_biz_inv ON sales(business_id, invoice_number);
    CREATE INDEX IF NOT EXISTS idx_sales_biz_created ON sales(business_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_sales_biz_cust ON sales(business_id, customer_id);
    CREATE INDEX IF NOT EXISTS idx_purchases_biz_date ON purchases(business_id, date);
    CREATE INDEX IF NOT EXISTS idx_khata_biz_party ON khata_transactions(business_id, party_type, party_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_expenses_biz_date ON expenses(business_id, date);
    CREATE INDEX IF NOT EXISTS idx_ai_usage_biz ON ai_usage_logs(business_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_audit_biz ON audit_logs(business_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_fin_acc_biz ON financial_accounts(business_id, type);
    CREATE INDEX IF NOT EXISTS idx_fin_tx_biz_acc ON financial_transactions(business_id, account_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_fin_tx_ref ON financial_transactions(business_id, reference_type, reference_id);
    CREATE INDEX IF NOT EXISTS idx_prod_var_prod ON product_variants(business_id, product_id);
    CREATE INDEX IF NOT EXISTS idx_staff_biz ON staff(business_id);
    CREATE INDEX IF NOT EXISTS idx_staff_tx_staff ON staff_transactions(business_id, staff_id);
    CREATE INDEX IF NOT EXISTS idx_commissions_biz ON commissions(business_id, status);
    CREATE INDEX IF NOT EXISTS idx_trips_biz ON transport_trips(business_id, date);
    CREATE INDEX IF NOT EXISTS idx_assets_biz ON assets(business_id);
    CREATE INDEX IF NOT EXISTS idx_liabilities_biz ON liabilities(business_id);
    CREATE INDEX IF NOT EXISTS idx_liability_pmt ON liability_payments(business_id, liability_id);
    CREATE INDEX IF NOT EXISTS idx_returns_biz ON returns(business_id, return_type);
    CREATE INDEX IF NOT EXISTS idx_spec_tools_biz ON specialized_tool_entries(business_id, tool_id);
  `);

  // Safe schema migrations for existing tables
  safeAddColumn(db, 'products', 'base_unit TEXT DEFAULT "unit"');
  safeAddColumn(db, 'products', 'secondary_unit TEXT');
  safeAddColumn(db, 'products', 'conversion_factor REAL DEFAULT 1');
  safeAddColumn(db, 'products', 'variants_json TEXT');
  safeAddColumn(db, 'sale_items', 'variant_id TEXT');
  safeAddColumn(db, 'sale_items', 'variant_name TEXT');
  safeAddColumn(db, 'sale_items', 'base_quantity REAL');
  safeAddColumn(db, 'purchase_items', 'variant_id TEXT');
  safeAddColumn(db, 'purchase_items', 'variant_name TEXT');
  safeAddColumn(db, 'purchase_items', 'base_quantity REAL');
  safeAddColumn(db, 'expenses', 'account_id TEXT');
  safeAddColumn(db, 'purchases', 'payment_method TEXT DEFAULT "cash"');
  safeAddColumn(db, 'purchases', 'account_id TEXT');
  safeAddColumn(db, 'sales', 'account_id TEXT');

  // Safe migrations for Salesman module
  safeAddColumn(db, 'sales', 'salesman_id TEXT');
  safeAddColumn(db, 'sales', 'salesman_name TEXT');
  safeAddColumn(db, 'sales', 'salesman_commission_paisa INTEGER DEFAULT 0');
  safeAddColumn(db, 'staff', 'commission_rate_percentage REAL DEFAULT 0');
  safeAddColumn(db, 'staff', 'cash_in_hand_paisa INTEGER DEFAULT 0');

  // Wholesale / Dealer pricing
  safeAddColumn(db, 'products', 'wholesale_price_paisa INTEGER DEFAULT 0');

  // Transport party and trip revenue
  safeAddColumn(db, 'transport_trips', 'party_name TEXT');
  safeAddColumn(db, 'transport_trips', 'received_amount_paisa INTEGER DEFAULT 0');
  safeAddColumn(db, 'transport_trips', 'trip_profit_paisa INTEGER DEFAULT 0');

  try {
    db.exec('CREATE INDEX IF NOT EXISTS idx_sales_salesman ON sales(business_id, salesman_id);');
  } catch {
    // Ignore if already indexed
  }
}

function safeAddColumn(db: DatabaseSync, table: string, columnDef: string): void {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnDef};`);
  } catch {
    // Column already exists or table does not need migration
  }
}

/**
 * Creates a timestamped hot backup of the SQLite database without stopping the server.
 */
export function backupDatabase(): { success: boolean; backupPath: string; timestamp: string; sizeBytes: number } {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `asanibiz_backup_${timestamp}.sqlite`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Use SQLite VACUUM INTO for an atomic hot snapshot
  const db = getDatabase();
  const escapedPath = backupFilePath.replace(/'/g, "''");
  db.exec(`VACUUM INTO '${escapedPath}'`);

  const stat = fs.statSync(backupFilePath);
  return {
    success: true,
    backupPath: backupFilePath,
    timestamp,
    sizeBytes: stat.size,
  };
}

/**
 * List available database backups
 */
export function listBackups(): Array<{ name: string; sizeBytes: number; createdAt: string }> {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.sqlite'));
  return files
    .map((name) => {
      const fullPath = path.join(BACKUP_DIR, name);
      const stat = fs.statSync(fullPath);
      return {
        name,
        sizeBytes: stat.size,
        createdAt: stat.birthtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Run diagnostic checks on SQLite integrity
 */
export function checkDatabaseIntegrity(): { integrityOk: boolean; foreignKeyErrors: any[] } {
  const db = getDatabase();
  const integrityResult = db.prepare('PRAGMA integrity_check;').all() as Array<{ integrity_check: string }>;
  const fkResult = db.prepare('PRAGMA foreign_key_check;').all();

  const integrityOk = integrityResult.length === 1 && integrityResult[0]?.integrity_check === 'ok';
  return {
    integrityOk,
    foreignKeyErrors: fkResult,
  };
}
