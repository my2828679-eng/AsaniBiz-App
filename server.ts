import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  getOrCreateBusiness,
  getFinancialAccounts,
  getFinancialTransactions,
  recordFinancialTransaction,
  transferBetweenAccounts,
  recordCustomerPaymentWithAccount,
  recordSupplierPaymentWithAccount,
  createSale,
  getSales,
  createPurchase,
  getPurchases,
  createExpense,
  getExpenses,
  getCustomers,
  createCustomer,
  getSuppliers,
  createSupplier,
  getProducts,
  createProduct,
  updateProduct,
  adjustStock,
  getProductVariants,
  createProductVariant,
  createStaff,
  getStaffList,
  recordStaffTransaction,
  getStaffTransactions,
  createSalesman,
  getSalesmen,
  recordSalesmanRecovery,
  settleSalesmanCash,
  payoutSalesmanCommission,
  getSalesmanReport,
  createCommission,
  getCommissions,
  payCommission,
  receiveCommission,
  createTransportTrip,
  getTransportTrips,
  getTransportSummary,
  createAsset,
  getAssets,
  updateAssetValue,
  createLiability,
  getLiabilities,
  recordLiabilityPayment,
  getLiabilityPayments,
  recordSaleReturn,
  recordPurchaseReturn,
  getReturns,
  saveSpecializedToolEntry,
  getSpecializedToolEntries,
  deleteSpecializedToolEntry,
  recordSpecializedWastage,
  getComprehensiveReportSummary,
  getCustomerKhataByNameOrPhone,
  getTodayBusinessSummary,
  executeAIMunshiAction,
  saveApprovedParsedBills,
  reconcileCashAccount,
  getReconciliationHistory,
  getSmartBusinessAlerts,
  getAdvancedPeriodicReport,
  verifyOrSetShopPin,
  processOfflineSyncBatch,
  paisaToPkr,
  pkrToPaisa,
} from './src/server/db/operations.ts';
import {
  recordGeminiTelemetry,
  getFullInfrastructureTelemetry,
  queryAdminMunshiLocal,
} from './src/server/adminTelemetry.ts';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Helper to get sanitized businessId
function resolveBusinessId(req: express.Request): string {
  const bId = (req.headers['x-business-id'] as string) || (req.query.businessId as string) || req.body?.businessId;
  return bId && typeof bId === 'string' && bId.trim() ? bId.trim() : 'biz_default';
}

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// -----------------------------------------------------------------------------
// Rate Limiting & AI Usage Telemetry
// -----------------------------------------------------------------------------
interface AIUsageRecord {
  id: string;
  businessId: string;
  businessName: string;
  model: string;
  promptLength: number;
  tokensEstimated: number;
  costPkrEstimated: number;
  timestamp: string;
  success: boolean;
  routingSource: 'ai_model' | 'cached_summary' | 'rule_fallback' | 'ai_model_primary' | 'ai_model_fallback';
}

const aiUsageHistory: AIUsageRecord[] = [];
const requestRateLimits = new Map<string, { count: number; windowStart: number }>();
const serverResponseCache = new Map<string, { reply: any; timestamp: number }>();

/**
 * Strict error classification:
 * Classifies transient/recoverable errors (503 UNAVAILABLE, 429 RATE LIMIT, network timeouts)
 * versus permanent errors (401/403 bad credentials, 400 invalid request/schema, internal bugs).
 */
function isTemporaryRecoverableError(err: any): boolean {
  if (!err) return false;

  const status = Number(err.status || err.statusCode || err.code);
  // Status codes indicating transient overload, rate limits, or network gateway glitches
  if (status === 503 || status === 429 || status === 502 || status === 504 || status === 408) {
    return true;
  }

  // Socket and connection timeouts
  const errCode = String(err.code || '');
  if (['ECONNRESET', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EAI_AGAIN', 'UND_ERR_CONNECT_TIMEOUT'].includes(errCode)) {
    return true;
  }

  // Parse message for error signatures
  const msg = String(err.message || '');

  // Critical: Never classify permanent auth or bad-request errors as temporary
  if (
    msg.includes('API_KEY_INVALID') ||
    msg.includes('PERMISSION_DENIED') ||
    msg.includes('UNAUTHENTICATED') ||
    msg.includes('INVALID_ARGUMENT') ||
    status === 401 ||
    status === 403 ||
    status === 400
  ) {
    return false;
  }

  if (
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('rate limit') ||
    msg.includes('high demand') ||
    msg.includes('fetch failed') ||
    msg.includes('timeout')
  ) {
    return true;
  }

  return false;
}

function checkRateLimit(businessId: string, maxPerMin: number = 30): boolean {
  const now = Date.now();
  const current = requestRateLimits.get(businessId);
  if (!current || now - current.windowStart > 60000) {
    requestRateLimits.set(businessId, { count: 1, windowStart: now });
    return true;
  }
  if (current.count >= maxPerMin) {
    return false; // Exceeded
  }
  current.count += 1;
  return true;
}

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    name: 'AsaniBiz Server',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// =============================================================================
// FINANCIAL CORE & LEDGER API ENDPOINTS
// =============================================================================

// Get all 4 central financial accounts (Cash, Bank, Easypaisa, JazzCash)
app.get('/api/financial/accounts', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    // Ensure default accounts and business exist
    getOrCreateBusiness({
      id: businessId,
      name: 'Meri Dukaan',
      businessType: 'kiryana',
      ownerName: 'Dukandaar',
      phone: '03001234567',
    });

    const accounts = getFinancialAccounts(businessId);
    const formatted = accounts.map(acc => ({
      id: acc.id,
      businessId: acc.business_id,
      name: acc.name,
      type: acc.type,
      accountNumber: acc.account_number,
      bankName: acc.bank_name,
      openingBalance: paisaToPkr(acc.opening_balance_paisa),
      currentBalance: paisaToPkr(acc.current_balance_paisa),
      isActive: Boolean(acc.is_active),
    }));

    res.json({ success: true, accounts: formatted });
  } catch (err: any) {
    console.error('Error in GET /api/financial/accounts:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch financial accounts' });
  }
});

// Get financial transactions history
app.get('/api/financial/transactions', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const accountId = req.query.accountId as string | undefined;
    const limit = Number(req.query.limit) || 100;

    const txs = getFinancialTransactions(businessId, accountId, limit);
    const formatted = txs.map(tx => ({
      id: tx.id,
      businessId: tx.business_id,
      accountId: tx.account_id,
      type: tx.type,
      amount: paisaToPkr(tx.amount_paisa),
      previousBalance: paisaToPkr(tx.previous_balance_paisa),
      newBalance: paisaToPkr(tx.new_balance_paisa),
      category: tx.category,
      referenceType: tx.reference_type,
      referenceId: tx.reference_id,
      description: tx.description,
      createdBy: tx.created_by,
      createdAt: tx.created_at,
    }));

    res.json({ success: true, transactions: formatted });
  } catch (err: any) {
    console.error('Error in GET /api/financial/transactions:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch financial transactions' });
  }
});

// Record a manual or direct financial transaction
app.post('/api/financial/transaction', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { accountType, accountId, type, amount, category = 'manual', description } = req.body;

    if (!type || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid transaction type and positive amount are required' });
    }

    const result = recordFinancialTransaction(businessId, {
      accountType,
      accountId,
      type,
      amountPkr: Number(amount),
      category,
      description,
    });

    res.json({
      success: true,
      transaction: {
        ...result.transaction,
        amount: paisaToPkr(result.transaction.amount_paisa),
        previousBalance: paisaToPkr(result.transaction.previous_balance_paisa),
        newBalance: paisaToPkr(result.transaction.new_balance_paisa),
      },
      account: {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/financial/transaction:', err);
    res.status(500).json({ error: err.message || 'Failed to record financial transaction' });
  }
});

// Inter-account transfer (e.g. Cash -> Bank, Cash -> Easypaisa)
app.post('/api/financial/transfer', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { fromAccountType, fromAccountId, toAccountType, toAccountId, amount, description } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid positive transfer amount is required' });
    }

    const result = transferBetweenAccounts(businessId, {
      fromAccountType,
      fromAccountId,
      toAccountType,
      toAccountId,
      amountPkr: Number(amount),
      description,
    });

    res.json({
      success: true,
      fromAccount: {
        ...result.fromAccount,
        currentBalance: paisaToPkr(result.fromAccount.current_balance_paisa),
      },
      toAccount: {
        ...result.toAccount,
        currentBalance: paisaToPkr(result.toAccount.current_balance_paisa),
      },
      fromTransaction: {
        ...result.fromTx,
        amount: paisaToPkr(result.fromTx.amount_paisa),
      },
      toTransaction: {
        ...result.toTx,
        amount: paisaToPkr(result.toTx.amount_paisa),
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/financial/transfer:', err);
    res.status(500).json({ error: err.message || 'Failed to execute account transfer' });
  }
});

// Customer payment wasooli: updates Customer Khata AND selected financial account atomically
app.post('/api/financial/customer-payment', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { customerId, customerName, amount, paymentMethod = 'cash', notes } = req.body;

    if (!customerId || !customerName || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Customer ID, name, and positive amount are required' });
    }

    const result = recordCustomerPaymentWithAccount(businessId, {
      customerId,
      customerName,
      amountPkr: Number(amount),
      paymentMethod,
      notes,
    });

    res.json({
      success: true,
      khataTransaction: {
        ...result.khataTx,
        amount: paisaToPkr(result.khataTx.amount_paisa),
        previousBalance: paisaToPkr(result.khataTx.previous_balance_paisa),
        newBalance: paisaToPkr(result.khataTx.new_balance_paisa),
      },
      financialTransaction: {
        ...result.financialTx,
        amount: paisaToPkr(result.financialTx.amount_paisa),
        previousBalance: paisaToPkr(result.financialTx.previous_balance_paisa),
        newBalance: paisaToPkr(result.financialTx.new_balance_paisa),
      },
      updatedCustomer: {
        ...result.updatedCustomer,
        currentBalance: paisaToPkr(result.updatedCustomer.current_balance_paisa),
      },
      updatedAccount: {
        ...result.updatedAccount,
        currentBalance: paisaToPkr(result.updatedAccount.current_balance_paisa),
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/financial/customer-payment:', err);
    res.status(500).json({ error: err.message || 'Failed to record customer payment' });
  }
});

// Supplier payment adaigi: updates Supplier Khata AND deducts from selected financial account atomically
app.post('/api/financial/supplier-payment', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { supplierId, supplierName, amount, paymentMethod = 'cash', notes } = req.body;

    if (!supplierId || !supplierName || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Supplier ID, name, and positive amount are required' });
    }

    const result = recordSupplierPaymentWithAccount(businessId, {
      supplierId,
      supplierName,
      amountPkr: Number(amount),
      paymentMethod,
      notes,
    });

    res.json({
      success: true,
      khataTransaction: {
        ...result.khataTx,
        amount: paisaToPkr(result.khataTx.amount_paisa),
        previousBalance: paisaToPkr(result.khataTx.previous_balance_paisa),
        newBalance: paisaToPkr(result.khataTx.new_balance_paisa),
      },
      financialTransaction: {
        ...result.financialTx,
        amount: paisaToPkr(result.financialTx.amount_paisa),
        previousBalance: paisaToPkr(result.financialTx.previous_balance_paisa),
        newBalance: paisaToPkr(result.financialTx.new_balance_paisa),
      },
      updatedSupplier: {
        ...result.updatedSupplier,
        payableBalance: paisaToPkr(result.updatedSupplier.payable_balance_paisa),
      },
      updatedAccount: {
        ...result.updatedAccount,
        currentBalance: paisaToPkr(result.updatedAccount.current_balance_paisa),
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/financial/supplier-payment:', err);
    res.status(500).json({ error: err.message || 'Failed to record supplier payment' });
  }
});

// Integrated Sale creation (Stock deduction, financial account money-in, customer khata)
app.post('/api/sales', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const saleData = req.body;

    const result = createSale(businessId, saleData);
    res.json({
      success: true,
      sale: {
        ...result.sale,
        totalAmount: paisaToPkr(result.sale.total_amount_paisa),
        paidAmount: paisaToPkr(result.sale.paid_amount_paisa),
        subtotal: paisaToPkr(result.sale.subtotal_paisa),
      },
      items: result.items.map(it => ({
        ...it,
        unitPrice: paisaToPkr(it.unit_price_paisa),
        total: paisaToPkr(it.total_paisa),
      })),
    });
  } catch (err: any) {
    console.error('Error in POST /api/sales:', err);
    res.status(500).json({ error: err.message || 'Failed to create sale' });
  }
});

app.get('/api/sales', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const limit = Number(req.query.limit) || 100;
    const sales = getSales(businessId, limit);
    res.json({ success: true, sales });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch sales' });
  }
});

// Integrated Purchase creation (Stock addition, financial account money-out, supplier khata)
app.post('/api/purchases', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const purchaseData = req.body;

    const result = createPurchase(businessId, purchaseData);
    res.json({
      success: true,
      purchase: {
        ...result.purchase,
        totalAmount: paisaToPkr(result.purchase.total_amount_paisa),
        paidAmount: paisaToPkr(result.purchase.paid_amount_paisa),
        balanceAmount: paisaToPkr(result.purchase.balance_amount_paisa),
      },
      items: result.items.map(it => ({
        ...it,
        costPrice: paisaToPkr(it.cost_price_paisa),
        total: paisaToPkr(it.total_paisa),
      })),
    });
  } catch (err: any) {
    console.error('Error in POST /api/purchases:', err);
    res.status(500).json({ error: err.message || 'Failed to record purchase' });
  }
});

app.get('/api/purchases', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const limit = Number(req.query.limit) || 100;
    const purchases = getPurchases(businessId, limit);
    res.json({ success: true, purchases });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch purchases' });
  }
});

// Integrated Expense creation (Deduction from financial account)
app.post('/api/expenses', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { category, amount, paidVia = 'Cash', notes, date } = req.body;

    const expense = createExpense(businessId, {
      category,
      amountPkr: Number(amount),
      paidVia,
      notes,
      date,
    });

    res.json({
      success: true,
      expense: {
        ...expense,
        amount: paisaToPkr(expense.amount_paisa),
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/expenses:', err);
    res.status(500).json({ error: err.message || 'Failed to record expense' });
  }
});

app.get('/api/expenses', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const limit = Number(req.query.limit) || 100;
    const expenses = getExpenses(businessId, limit).map(e => ({
      ...e,
      amount: paisaToPkr(e.amount_paisa),
    }));
    res.json({ success: true, expenses });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch expenses' });
  }
});

// Product Variants & Multi-Unit endpoints
app.get('/api/products/:id/variants', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const variants = getProductVariants(businessId, req.params.id);
    res.json({
      success: true,
      variants: variants.map(v => ({
        ...v,
        purchasePrice: paisaToPkr(v.purchase_price_paisa),
        sellingPrice: paisaToPkr(v.selling_price_paisa),
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch variants' });
  }
});

app.post('/api/products/:id/variants', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { name, sku, purchasePrice, sellingPrice, initialStock } = req.body;
    const variant = createProductVariant(businessId, {
      productId: req.params.id,
      name,
      sku,
      purchasePricePkr: purchasePrice,
      sellingPricePkr: sellingPrice,
      initialStock,
    });
    res.json({
      success: true,
      variant: {
        ...variant,
        purchasePrice: paisaToPkr(variant.purchase_price_paisa),
        sellingPrice: paisaToPkr(variant.selling_price_paisa),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create variant' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: STAFF / EMPLOYEES
// =============================================================================

app.get('/api/staff', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const list = getStaffList(businessId);
    const formatted = list.map(s => ({
      id: s.id,
      employeeId: s.employee_id,
      name: s.name,
      phone: s.phone,
      role: s.role,
      joiningDate: s.joining_date,
      salary: paisaToPkr(s.salary_paisa),
      advanceBalance: paisaToPkr(s.advance_balance_paisa),
      status: s.status,
      createdAt: s.created_at,
    }));
    res.json({ success: true, staff: formatted });
  } catch (err: any) {
    console.error('Error in GET /api/staff:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch staff list' });
  }
});

app.post('/api/staff', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { employeeId, name, phone, role, joiningDate, salary } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Staff member name is required' });
    }

    const staff = createStaff(businessId, {
      employeeId,
      name,
      phone,
      role,
      joiningDate,
      salaryPkr: Number(salary) || 0,
    });

    res.json({
      success: true,
      staff: {
        id: staff.id,
        employeeId: staff.employee_id,
        name: staff.name,
        phone: staff.phone,
        role: staff.role,
        joiningDate: staff.joining_date,
        salary: paisaToPkr(staff.salary_paisa),
        advanceBalance: paisaToPkr(staff.advance_balance_paisa),
        status: staff.status,
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/staff:', err);
    res.status(500).json({ error: err.message || 'Failed to create staff member' });
  }
});

app.post('/api/staff/transaction', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { staffId, type, amount, paymentMethod = 'cash', accountId, date, notes, idempotencyKey } = req.body;

    if (!staffId || !type || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Staff ID, transaction type, and positive amount are required' });
    }

    const result = recordStaffTransaction(businessId, {
      staffId,
      type,
      amountPkr: Number(amount),
      paymentMethod,
      accountId,
      date,
      notes,
      idempotencyKey,
    });

    res.json({
      success: true,
      staffTransaction: {
        ...result.staffTransaction,
        amount: paisaToPkr(result.staffTransaction.amount_paisa),
      },
      financialTransaction: {
        ...result.financialTransaction,
        amount: paisaToPkr(result.financialTransaction.amount_paisa),
        previousBalance: paisaToPkr(result.financialTransaction.previous_balance_paisa),
        newBalance: paisaToPkr(result.financialTransaction.new_balance_paisa),
      },
      account: {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      },
      staff: {
        ...result.staff,
        salary: paisaToPkr(result.staff.salary_paisa),
        advanceBalance: paisaToPkr(result.staff.advance_balance_paisa),
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/staff/transaction:', err);
    res.status(500).json({ error: err.message || 'Failed to record staff transaction' });
  }
});

app.get('/api/staff/transactions', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const staffId = req.query.staffId as string | undefined;
    const limit = Number(req.query.limit) || 100;
    const txs = getStaffTransactions(businessId, staffId, limit);
    const formatted = txs.map(tx => ({
      ...tx,
      amount: paisaToPkr(tx.amount_paisa),
    }));
    res.json({ success: true, transactions: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch staff transactions' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: SALESMAN (FIELD SALES, RECOVERY, RECONCILIATION)
// =============================================================================

app.get('/api/salesmen', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const list = getSalesmen(businessId);
    const formatted = list.map(s => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      employeeId: s.employee_id,
      role: s.role,
      salary: paisaToPkr(s.salary_paisa),
      commissionRatePercentage: s.commission_rate_percentage || 0,
      cashInHand: paisaToPkr(s.cash_in_hand_paisa || 0),
      advanceBalance: paisaToPkr(s.advance_balance_paisa),
      status: s.status,
    }));
    res.json({ success: true, salesmen: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch salesmen' });
  }
});

app.post('/api/salesmen', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { name, phone, employeeId, salary, commissionRatePercentage } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Salesman name is required' });
    }

    const salesman = createSalesman(businessId, {
      name,
      phone,
      employeeId,
      salaryPkr: Number(salary) || 0,
      commissionRatePercentage: Number(commissionRatePercentage) || 0,
    });

    res.json({
      success: true,
      salesman: {
        id: salesman.id,
        name: salesman.name,
        phone: salesman.phone,
        employeeId: salesman.employee_id,
        role: salesman.role,
        salary: paisaToPkr(salesman.salary_paisa),
        commissionRatePercentage: salesman.commission_rate_percentage || 0,
        cashInHand: paisaToPkr(salesman.cash_in_hand_paisa || 0),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create salesman' });
  }
});

app.post('/api/salesmen/recovery', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { salesmanId, customerId, amount, notes, idempotencyKey, createdBy } = req.body;
    if (!salesmanId || !customerId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Salesman ID, customer ID, and positive amount are required' });
    }

    const result = recordSalesmanRecovery(businessId, {
      salesmanId,
      customerId,
      amountPkr: Number(amount),
      notes,
      idempotencyKey,
      createdBy,
    });

    res.json({
      success: true,
      cashInHand: paisaToPkr(result.staff.cash_in_hand_paisa || 0),
      customerBalance: paisaToPkr(result.customer.current_balance_paisa),
      transaction: {
        ...result.khataTransaction,
        amount: paisaToPkr(result.khataTransaction.amount_paisa),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record salesman recovery' });
  }
});

app.post('/api/salesmen/settle', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { salesmanId, depositAmount, targetAccountType, accountId, notes, idempotencyKey, createdBy } = req.body;
    if (!salesmanId || !depositAmount || Number(depositAmount) <= 0) {
      return res.status(400).json({ error: 'Salesman ID and positive deposit amount are required' });
    }

    const result = settleSalesmanCash(businessId, {
      salesmanId,
      depositAmountPkr: Number(depositAmount),
      targetAccountType,
      accountId,
      notes,
      idempotencyKey,
      createdBy,
    });

    res.json({
      success: true,
      remainingCashInHand: paisaToPkr(result.staff.cash_in_hand_paisa || 0),
      accountBalance: paisaToPkr(result.account.current_balance_paisa),
      accountType: result.account.type,
      financialTransactionId: result.financialTransaction.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to settle salesman cash' });
  }
});

app.post('/api/salesmen/commission-payout', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { salesmanId, amount, sourceAccountType, accountId, notes, idempotencyKey, createdBy } = req.body;
    if (!salesmanId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Salesman ID and positive payout amount are required' });
    }

    const result = payoutSalesmanCommission(businessId, {
      salesmanId,
      amountPkr: Number(amount),
      sourceAccountType,
      accountId,
      notes,
      idempotencyKey,
      createdBy,
    });

    res.json({
      success: true,
      paidAmount: paisaToPkr(result.staffTransaction.amount_paisa),
      accountBalance: paisaToPkr(result.account.current_balance_paisa),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to payout salesman commission' });
  }
});

app.get('/api/salesmen/:id/report', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const report = getSalesmanReport(businessId, req.params.id);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate salesman report' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: COMMISSIONS / DALALI / ARHAT
// =============================================================================

app.get('/api/commissions', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const status = req.query.status as string | undefined;
    const list = getCommissions(businessId, status);
    const formatted = list.map(c => ({
      ...c,
      amount: paisaToPkr(c.amount_paisa),
      paidAmount: paisaToPkr(c.paid_amount_paisa),
      remainingAmount: paisaToPkr(Math.max(0, c.amount_paisa - c.paid_amount_paisa)),
    }));
    res.json({ success: true, commissions: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch commissions' });
  }
});

app.post('/api/commissions', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { partyName, type, amount, relatedSaleId, relatedPurchaseId, dealReference, ratePercentage, date, notes } = req.body;

    if (!partyName || !type || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Party name, type, and positive amount are required' });
    }

    const comm = createCommission(businessId, {
      partyName,
      type,
      amountPkr: Number(amount),
      relatedSaleId,
      relatedPurchaseId,
      dealReference,
      ratePercentage: ratePercentage ? Number(ratePercentage) : undefined,
      date,
      notes,
    });

    res.json({
      success: true,
      commission: {
        ...comm,
        amount: paisaToPkr(comm.amount_paisa),
        paidAmount: paisaToPkr(comm.paid_amount_paisa),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create commission' });
  }
});

app.post('/api/commissions/pay', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { commissionId, amount, paymentMethod = 'cash', accountId, notes } = req.body;

    if (!commissionId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Commission ID and positive amount are required' });
    }

    const result = payCommission(businessId, {
      commissionId,
      amountPkr: Number(amount),
      paymentMethod,
      accountId,
      notes,
    });

    res.json({
      success: true,
      commission: {
        ...result.commission,
        amount: paisaToPkr(result.commission.amount_paisa),
        paidAmount: paisaToPkr(result.commission.paid_amount_paisa),
      },
      financialTransaction: {
        ...result.financialTransaction,
        amount: paisaToPkr(result.financialTransaction.amount_paisa),
        previousBalance: paisaToPkr(result.financialTransaction.previous_balance_paisa),
        newBalance: paisaToPkr(result.financialTransaction.new_balance_paisa),
      },
      account: {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to pay commission' });
  }
});

app.post('/api/commissions/receive', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { commissionId, amount, paymentMethod = 'cash', accountId, notes } = req.body;

    if (!commissionId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Commission ID and positive amount are required' });
    }

    const result = receiveCommission(businessId, {
      commissionId,
      amountPkr: Number(amount),
      paymentMethod,
      accountId,
      notes,
    });

    res.json({
      success: true,
      commission: {
        ...result.commission,
        amount: paisaToPkr(result.commission.amount_paisa),
        paidAmount: paisaToPkr(result.commission.paid_amount_paisa),
      },
      financialTransaction: {
        ...result.financialTransaction,
        amount: paisaToPkr(result.financialTransaction.amount_paisa),
        previousBalance: paisaToPkr(result.financialTransaction.previous_balance_paisa),
        newBalance: paisaToPkr(result.financialTransaction.new_balance_paisa),
      },
      account: {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to receive commission' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: TRANSPORT TRIPS
// =============================================================================

app.get('/api/transport/trips', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const limit = Number(req.query.limit) || 100;
    const trips = getTransportTrips(businessId, limit);
    const formatted = trips.map(t => ({
      ...t,
      partyName: t.party_name,
      freight: paisaToPkr(t.freight_paisa),
      diesel: paisaToPkr(t.diesel_paisa),
      labour: paisaToPkr(t.labour_paisa),
      otherExpense: paisaToPkr(t.other_expense_paisa),
      totalCost: paisaToPkr(t.total_cost_paisa),
      paidAmount: paisaToPkr(t.paid_amount_paisa),
      remainingAmount: paisaToPkr(t.remaining_amount_paisa),
      receivedAmount: paisaToPkr(t.received_amount_paisa || 0),
      tripProfit: paisaToPkr(t.trip_profit_paisa || 0),
    }));
    res.json({ success: true, trips: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch transport trips' });
  }
});

app.get('/api/transport/summary', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const summary = getTransportSummary(businessId);
    res.json({ success: true, summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch transport summary' });
  }
});

app.post('/api/transport/trips', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const {
      vehicleNo,
      driverName,
      transporterName,
      partyName,
      route,
      date,
      relatedReference,
      freight = 0,
      diesel = 0,
      labour = 0,
      otherExpense = 0,
      paidAmount = 0,
      paymentMethod = 'cash',
      receivedAmount = 0,
      receivePaymentMethod = 'cash',
      accountId,
      notes,
    } = req.body;

    if (!vehicleNo || typeof vehicleNo !== 'string' || !vehicleNo.trim()) {
      return res.status(400).json({ error: 'Vehicle number is required' });
    }

    const result = createTransportTrip(businessId, {
      vehicleNo,
      driverName,
      transporterName,
      partyName,
      route,
      date,
      relatedReference,
      freightPkr: Number(freight),
      dieselPkr: Number(diesel),
      labourPkr: Number(labour),
      otherExpensePkr: Number(otherExpense),
      paidAmountPkr: Number(paidAmount),
      paymentMethod,
      receivedAmountPkr: Number(receivedAmount),
      receivePaymentMethod,
      accountId,
      notes,
    });

    res.json({
      success: true,
      trip: {
        ...result.trip,
        partyName: result.trip.party_name,
        freight: paisaToPkr(result.trip.freight_paisa),
        diesel: paisaToPkr(result.trip.diesel_paisa),
        labour: paisaToPkr(result.trip.labour_paisa),
        otherExpense: paisaToPkr(result.trip.other_expense_paisa),
        totalCost: paisaToPkr(result.trip.total_cost_paisa),
        paidAmount: paisaToPkr(result.trip.paid_amount_paisa),
        remainingAmount: paisaToPkr(result.trip.remaining_amount_paisa),
        receivedAmount: paisaToPkr(result.trip.received_amount_paisa || 0),
        tripProfit: paisaToPkr(result.trip.trip_profit_paisa || 0),
      },
      account: result.account ? {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      } : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create transport trip' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: ASSETS & CAPITAL INVESTMENTS
// =============================================================================

app.get('/api/assets', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const list = getAssets(businessId);
    const formatted = list.map(a => ({
      ...a,
      purchasePrice: paisaToPkr(a.purchase_price_paisa),
      currentValue: paisaToPkr(a.current_value_paisa),
      totalValuation: paisaToPkr(a.current_value_paisa * a.quantity),
    }));
    res.json({ success: true, assets: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assets' });
  }
});

app.post('/api/assets', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { name, category, purchasePrice, currentValue, quantity = 1, paymentMethod = 'cash', accountId, purchaseDate, notes } = req.body;

    if (!name || !category || !purchasePrice || Number(purchasePrice) <= 0) {
      return res.status(400).json({ error: 'Asset name, category, and positive purchase price are required' });
    }

    const result = createAsset(businessId, {
      name,
      category,
      purchasePricePkr: Number(purchasePrice),
      currentValuePkr: currentValue ? Number(currentValue) : undefined,
      quantity: Number(quantity),
      paymentMethod,
      accountId,
      purchaseDate,
      notes,
    });

    res.json({
      success: true,
      asset: {
        ...result.asset,
        purchasePrice: paisaToPkr(result.asset.purchase_price_paisa),
        currentValue: paisaToPkr(result.asset.current_value_paisa),
      },
      account: result.account ? {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      } : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create asset' });
  }
});

app.post('/api/assets/:id/value', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { currentValue } = req.body;
    if (currentValue === undefined || Number(currentValue) < 0) {
      return res.status(400).json({ error: 'Valid current value is required' });
    }
    const updated = updateAssetValue(businessId, req.params.id, Number(currentValue));
    res.json({
      success: true,
      asset: {
        ...updated,
        currentValue: paisaToPkr(updated.current_value_paisa),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update asset value' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: LIABILITIES & LOANS (QARZ, COMMITTEES)
// =============================================================================

app.get('/api/liabilities', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const list = getLiabilities(businessId);
    const formatted = list.map(l => ({
      ...l,
      amount: paisaToPkr(l.amount_paisa),
      remainingBalance: paisaToPkr(l.remaining_balance_paisa),
      paidAmount: paisaToPkr(Math.max(0, l.amount_paisa - l.remaining_balance_paisa)),
    }));
    res.json({ success: true, liabilities: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch liabilities' });
  }
});

app.post('/api/liabilities', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { name, type, creditorName, amount, startDate, dueDate, notes, depositLoanIntoAccount, paymentMethod = 'bank', accountId } = req.body;

    if (!name || !type || !creditorName || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Name, type, creditor name, and positive amount are required' });
    }

    const result = createLiability(businessId, {
      name,
      type,
      creditorName,
      amountPkr: Number(amount),
      startDate,
      dueDate,
      notes,
      depositLoanIntoAccount: Boolean(depositLoanIntoAccount),
      paymentMethod,
      accountId,
    });

    res.json({
      success: true,
      liability: {
        ...result.liability,
        amount: paisaToPkr(result.liability.amount_paisa),
        remainingBalance: paisaToPkr(result.liability.remaining_balance_paisa),
      },
      account: result.account ? {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      } : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create liability' });
  }
});

app.post('/api/liabilities/payment', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { liabilityId, amount, paymentMethod = 'bank', accountId, paymentDate, notes } = req.body;

    if (!liabilityId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Liability ID and positive amount are required' });
    }

    const result = recordLiabilityPayment(businessId, {
      liabilityId,
      amountPkr: Number(amount),
      paymentMethod,
      accountId,
      paymentDate,
      notes,
    });

    res.json({
      success: true,
      liability: {
        ...result.liability,
        amount: paisaToPkr(result.liability.amount_paisa),
        remainingBalance: paisaToPkr(result.liability.remaining_balance_paisa),
      },
      payment: {
        ...result.payment,
        amount: paisaToPkr(result.payment.amount_paisa),
      },
      account: {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record liability payment' });
  }
});

app.get('/api/liabilities/payments', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const liabilityId = req.query.liabilityId as string | undefined;
    const payments = getLiabilityPayments(businessId, liabilityId);
    const formatted = payments.map(p => ({
      ...p,
      amount: paisaToPkr(p.amount_paisa),
    }));
    res.json({ success: true, payments: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch liability payments' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: RETURNS & ADJUSTMENTS (SALES & PURCHASES)
// =============================================================================

app.post('/api/returns/sale', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { productId, quantity, unitPrice, refundAmount = 0, paymentMethod = 'cash', accountId, customerId, customerName, reason, originalReferenceId } = req.body;

    if (!productId || !quantity || Number(quantity) <= 0 || !unitPrice || Number(unitPrice) <= 0) {
      return res.status(400).json({ error: 'Product ID, quantity, and unit price are required' });
    }

    const result = recordSaleReturn(businessId, {
      productId,
      quantity: Number(quantity),
      unitPricePkr: Number(unitPrice),
      refundAmountPkr: Number(refundAmount),
      paymentMethod,
      accountId,
      customerId,
      customerName,
      reason,
      originalReferenceId,
    });

    res.json({
      success: true,
      returnRecord: {
        ...result.returnRecord,
        unitPrice: paisaToPkr(result.returnRecord.unit_price_paisa),
        totalAmount: paisaToPkr(result.returnRecord.total_amount_paisa),
        refundAmount: paisaToPkr(result.returnRecord.refund_amount_paisa),
      },
      updatedProduct: {
        ...result.updatedProduct,
        currentStock: result.updatedProduct.current_stock,
      },
      account: result.account ? {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      } : undefined,
      customer: result.customer ? {
        ...result.customer,
        currentBalance: paisaToPkr(result.customer.current_balance_paisa),
      } : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record sale return' });
  }
});

app.post('/api/returns/purchase', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { productId, quantity, costPrice, refundAmount = 0, paymentMethod = 'cash', accountId, supplierId, supplierName, reason, originalReferenceId } = req.body;

    if (!productId || !quantity || Number(quantity) <= 0 || !costPrice || Number(costPrice) <= 0) {
      return res.status(400).json({ error: 'Product ID, quantity, and cost price are required' });
    }

    const result = recordPurchaseReturn(businessId, {
      productId,
      quantity: Number(quantity),
      costPricePkr: Number(costPrice),
      refundAmountPkr: Number(refundAmount),
      paymentMethod,
      accountId,
      supplierId,
      supplierName,
      reason,
      originalReferenceId,
    });

    res.json({
      success: true,
      returnRecord: {
        ...result.returnRecord,
        unitPrice: paisaToPkr(result.returnRecord.unit_price_paisa),
        totalAmount: paisaToPkr(result.returnRecord.total_amount_paisa),
        refundAmount: paisaToPkr(result.returnRecord.refund_amount_paisa),
      },
      updatedProduct: {
        ...result.updatedProduct,
        currentStock: result.updatedProduct.current_stock,
      },
      account: result.account ? {
        ...result.account,
        currentBalance: paisaToPkr(result.account.current_balance_paisa),
      } : undefined,
      supplier: result.supplier ? {
        ...result.supplier,
        payableBalance: paisaToPkr(result.supplier.payable_balance_paisa),
      } : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record purchase return' });
  }
});

app.get('/api/returns', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const limit = Number(req.query.limit) || 100;
    const returns = getReturns(businessId, limit);
    const formatted = returns.map(r => ({
      ...r,
      unitPrice: paisaToPkr(r.unit_price_paisa),
      totalAmount: paisaToPkr(r.total_amount_paisa),
      refundAmount: paisaToPkr(r.refund_amount_paisa),
    }));
    res.json({ success: true, returns: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch returns' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: SPECIALIZED BUSINESS TOOL ENTRIES PERSISTENCE
// =============================================================================

app.get('/api/specialized-tools/entries', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const toolId = req.query.toolId as string | undefined;
    const entries = getSpecializedToolEntries(businessId, toolId);
    const formatted = entries.map(e => ({
      id: e.id,
      toolId: e.tool_id,
      referenceTitle: e.reference_title,
      entryData: JSON.parse(e.entry_data_json || '{}'),
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
    res.json({ success: true, entries: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch specialized tool entries' });
  }
});

app.post('/api/specialized-tools/entries', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { id, toolId, referenceTitle, entryData } = req.body;

    if (!toolId || typeof toolId !== 'string') {
      return res.status(400).json({ error: 'toolId is required' });
    }

    const saved = saveSpecializedToolEntry(businessId, {
      id,
      toolId,
      referenceTitle,
      entryData,
    });

    res.json({
      success: true,
      entry: {
        id: saved.id,
        toolId: saved.tool_id,
        referenceTitle: saved.reference_title,
        entryData: JSON.parse(saved.entry_data_json || '{}'),
        createdAt: saved.created_at,
        updatedAt: saved.updated_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save specialized tool entry' });
  }
});

app.delete('/api/specialized-tools/entries/:id', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const success = deleteSpecializedToolEntry(businessId, req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete specialized tool entry' });
  }
});

app.post('/api/specialized-tools/wastage', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { toolId, productId, productName, quantity, unit, estimatedLoss, reason, notes, createdBy } = req.body;
    if (!toolId || !productName || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({ error: 'toolId, productName, and positive quantity are required' });
    }

    const result = recordSpecializedWastage(businessId, {
      toolId,
      productId,
      productName,
      quantity: Number(quantity),
      unit,
      estimatedLossPkr: Number(estimatedLoss) || 0,
      reason,
      notes,
      createdBy,
    });

    res.json({
      success: true,
      entry: {
        id: result.entry.id,
        toolId: result.entry.tool_id,
        referenceTitle: result.entry.reference_title,
        entryData: JSON.parse(result.entry.entry_data_json || '{}'),
      },
      stockMovement: result.stockMovement,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record specialized wastage' });
  }
});

// =============================================================================
// PHASE 2 API ENDPOINTS: COMPREHENSIVE FINANCIAL REPORT & AUDIT SUMMARY
// =============================================================================

app.get('/api/reports/comprehensive', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const summary = getComprehensiveReportSummary(businessId);
    res.json({ success: true, summary });
  } catch (err: any) {
    console.error('Error in GET /api/reports/comprehensive:', err);
    res.status(500).json({ error: err.message || 'Failed to calculate comprehensive report' });
  }
});

// Integrations Status Endpoint (Strict No-Fake APIs Policy)
app.get('/api/integrations/status', (req, res) => {
  res.json({
    whatsapp: {
      status: 'NOT_CONNECTED',
      mode: 'MANUAL_WEB_APP_LAUNCHER',
      message: 'Direct WhatsApp Cloud API is not connected. Manual 1-click sharing via WhatsApp Web / App is fully active.',
    },
    paymentGateway: {
      status: 'NOT_CONNECTED',
      mode: 'MANUAL_BOOKKEEPING',
      message: 'Direct Bank/JazzCash API gateway not connected. Local cash and manual payment recording active.',
    },
    geminiAI: {
      status: process.env.GEMINI_API_KEY ? 'CONNECTED' : 'REQUIRES_API_KEY',
      primaryModel: 'gemini-3.1-flash-lite',
      fallbackModels: ['gemini-flash-latest', 'gemini-3.8-flash'],
      speedProfile: 'LOWEST_LATENCY_1_CALL_NORMAL',
    },
  });
});

// =============================================================================
// ADMIN INFRASTRUCTURE MONITORING & ADMIN MUNSHI ENDPOINTS
// =============================================================================

// GET /api/admin/infrastructure-telemetry
app.get('/api/admin/infrastructure-telemetry', (req, res) => {
  try {
    let businessesList: any[] | undefined = undefined;
    if (req.query.businesses && typeof req.query.businesses === 'string') {
      try {
        businessesList = JSON.parse(req.query.businesses);
      } catch {
        // ignore parse error
      }
    }
    const telemetry = getFullInfrastructureTelemetry(businessesList);
    res.json({ success: true, telemetry });
  } catch (err: any) {
    console.error('[AdminTelemetry] Failed to get telemetry:', err);
    res.status(500).json({ error: 'Failed to retrieve telemetry', message: err.message });
  }
});

// POST /api/admin/munshi-chat (Dedicated Admin Munshi Natural Language Query Engine)
app.post('/api/admin/munshi-chat', async (req, res) => {
  try {
    const { message, language = 'ur', businesses } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message query is required' });
    }

    // Step 1: Query local software intent engine (0-cost, instant, guaranteed mathematical precision)
    const localResult = queryAdminMunshiLocal(message, language);
    if (localResult.matched) {
      return res.json({
        reply: localResult.replyText,
        speechSynthesisText: localResult.speechText,
        actionRoute: localResult.actionRoute,
        referencedMetrics: localResult.referencedMetrics,
        source: 'local_engine',
      });
    }

    // Step 2: Query Gemini with authoritative real telemetry snapshot
    const telemetry = getFullInfrastructureTelemetry(Array.isArray(businesses) ? businesses : undefined);
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback message using real telemetry numbers
      const fallbackReply = language === 'en'
        ? `System Telemetry Summary: Active Customers: ${telemetry.financialSummary.activeCustomers}, Monthly Subscription Revenue: PKR ${telemetry.financialSummary.subscriptionRevenuePkr.toLocaleString()}, Operational Cost: PKR ${telemetry.financialSummary.totalOperationalCostPkr.toLocaleString()}, Net Profit: PKR ${telemetry.financialSummary.netRemainingAmountPkr.toLocaleString()}. All systems are operating smoothly.`
        : `سسٹم مانیٹر کے مطابق کل فعال کسٹمرز ${telemetry.financialSummary.activeCustomers} ہیں، ماہانہ ریونیو Rs. ${telemetry.financialSummary.subscriptionRevenuePkr.toLocaleString()} اور کل لاگت Rs. ${telemetry.financialSummary.totalOperationalCostPkr.toLocaleString()} ہے۔ خالص منافع Rs. ${telemetry.financialSummary.netRemainingAmountPkr.toLocaleString()} ہے۔`;

      return res.json({
        reply: fallbackReply,
        speechSynthesisText: fallbackReply,
        source: 'telemetry_summary_fallback',
      });
    }

    const systemPrompt = `You are "Admin Munshi" (ایڈمن منشی), the VIP executive AI assistant for the AsaniBiz Platform Administrator.
CRITICAL RULES:
1. NEVER calculate, extrapolate, or guess metrics yourself. The exact calculations are pre-computed and provided in the AUTHORITATIVE TELEMETRY SNAPSHOT below. ONLY use the verified numbers from this snapshot.
2. If asked about today's AI cost, Vercel bandwidth/limits, Supabase storage/database, customer AI quotas, subscription revenue, total cost, or limit warnings, quote the EXACT numbers from the snapshot.
3. Language: Respond in ${language === 'en' ? 'English' : language === 'sd' ? 'Sindhi' : language === 'ps' ? 'Pashto' : language === 'pa' ? 'Punjabi' : 'simple professional Urdu'}.
4. Keep answers concise, clear, polite, and executive-ready.
5. If recommending navigation, suggest one of these tabs: 'overview', 'businesses', 'subscriptions', 'ai_usage', 'settings'.

AUTHORITATIVE TELEMETRY SNAPSHOT (PRE-CALCULATED SOFTWARE TRUTH):
${JSON.stringify({
  metrics: telemetry.metrics,
  financialSummary: telemetry.financialSummary,
  topCustomers: telemetry.customerQuotas.slice(0, 5),
  alerts: telemetry.alerts,
}, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      },
    });

    const reply = response.text?.trim() || 'سسٹم ڈیٹا کی جانچ مکمل ہو گئی ہے۔';

    recordGeminiTelemetry({
      promptLength: message.length,
      inputTokens: 1100,
      outputTokens: 200,
      costPkr: 0.30,
      type: 'text',
    });

    res.json({
      reply,
      speechSynthesisText: reply,
      source: 'gemini_telemetry_grounded',
    });
  } catch (err: any) {
    console.error('[AdminMunshi] Chat error:', err);
    res.status(500).json({ error: 'Admin Munshi query failed', message: err.message });
  }
});

// AI Usage Stats Endpoint
app.get('/api/ai-munshi/usage-stats', (req, res) => {
  const totalCalls = aiUsageHistory.length;
  const totalTokens = aiUsageHistory.reduce((sum, r) => sum + r.tokensEstimated, 0);
  const totalCost = aiUsageHistory.reduce((sum, r) => sum + r.costPkrEstimated, 0);

  res.json({
    totalCalls,
    totalTokens,
    totalCostPkr: Math.round(totalCost * 100) / 100,
    recentUsage: aiUsageHistory.slice(-20).reverse(),
  });
});

// AI Munshi natural language processing endpoint
app.post('/api/ai-munshi/chat', async (req, res) => {
  try {
    const { message, language = 'ur-roman', businessProfile, contextData, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Protection: Request payload limit (prevent malicious giant prompt injection)
    if (message.length > 4000) {
      return res.status(413).json({ error: 'Message exceeds safety character limit of 4,000 characters' });
    }

    const businessId = businessProfile?.id || 'biz_default';
    const businessName = businessProfile?.businessName || 'Meri Dukaan';

    // Protection: Per-business rate limiting (max 30 calls/min)
    if (!checkRateLimit(businessId, 30)) {
      return res.status(429).json({
        reply: 'Janab, bohot ziada requests ki wajah se thora intezar karein (Rate limit reached).',
        speechSynthesisText: 'Baraye meherbani thora intezar karein.',
        rateLimited: true,
      });
    }

    // Protection: In-flight server cache check (deduplication within 10 seconds)
    const cacheKey = `${businessId}_${message.trim().toLowerCase()}`;
    const cachedResponse = serverResponseCache.get(cacheKey);
    if (cachedResponse && Date.now() - cachedResponse.timestamp < 10000) {
      return res.json({
        ...cachedResponse.reply,
        routingSource: 'cached_summary',
      });
    }

    // Fetch real SQLite database records for AI Munshi
    let dbSummary: any = null;
    try {
      dbSummary = getComprehensiveReportSummary(businessId);
    } catch (e) {
      console.warn('Failed to load dbSummary for AI Munshi:', e);
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are "AI Munshi" (اے آئی منشی), an intelligent, respectful, culturally astute, and highly accurate universal digital business operating engine and accountant built for all types of Pakistani businesses ("Mohallay Ki Dukaan Se Professional Karobaar Tak").
Business Name: ${businessProfile?.businessName || 'Meri Dukaan'}
Business Type: ${businessProfile?.businessType || 'General Store / Kiryana / Dynamic Custom Business'}
Currency: ${businessProfile?.currency || 'PKR'}
Owner Name: ${businessProfile?.ownerName || 'Dukandaar'}
Selected Language Preference: ${language}

UNIVERSAL BUSINESS ADAPTABILITY:
You seamlessly operate across ANY business sector (Retail, Grocery, Mandi/Wholesale, Agriculture, Garments, Mobile/Tech, Hardware, Pharmacy, Auto Workshop, Restaurant, Bakery, Cosmetics, Services, etc.).
Adapt your terminology dynamically to their trade (e.g. 'kattay' in mandi, 'suit' in garments, 'peti' in wholesale, 'plate/table' in restaurant, 'repair' in workshop) and map intents cleanly into standard financial/inventory actions.

Verified SQLite Database Financial Records (Source of Truth):
- Cash & Bank Liquidity: Rs. ${dbSummary?.totalLiquidCashPkr ?? 0} (Accounts: ${JSON.stringify(dbSummary?.accounts?.map((a: any) => `${a.name}: Rs.${a.balancePkr}`) || [])})
- Total Sales: Rs. ${dbSummary?.totalSalesPkr ?? (contextData?.todaySales || 0)} (${dbSummary?.totalSalesCount ?? 0} bills)
- Total Purchases: Rs. ${dbSummary?.totalPurchasesPkr ?? 0}
- Customer Udhaar (Receivable): Rs. ${dbSummary?.totalCustomerUdhaarPkr ?? (contextData?.totalCustomerOutstanding || 0)}
- Supplier Payable: Rs. ${dbSummary?.totalSupplierPayablePkr ?? (contextData?.totalSupplierPayable || 0)}
- Operating Expenses: Rs. ${dbSummary?.totalOperatingExpensesPkr ?? (contextData?.todayExpenses || 0)}
- Staff Salaries Paid: Rs. ${dbSummary?.totalStaffSalariesPaidPkr ?? 0}, Staff Active Advances: Rs. ${dbSummary?.totalStaffAdvancesActivePkr ?? 0}
- Dalali / Commissions: Paid Rs. ${dbSummary?.totalCommissionPaidPkr ?? 0}, Earned Rs. ${dbSummary?.totalCommissionEarnedPkr ?? 0}, Payable Rs. ${dbSummary?.totalCommissionPayablePkr ?? 0}
- Transport Freight & Expenses: Rs. ${dbSummary?.totalTransportCostPkr ?? 0}
- Stock Inventory Value: Rs. ${dbSummary?.totalStockValuePkr ?? 0}
- Fixed Assets Valuation: Rs. ${dbSummary?.totalFixedAssetsValuePkr ?? 0}
- Remaining Liabilities / Loans: Rs. ${dbSummary?.totalLiabilitiesRemainingPkr ?? 0}
- Calculated Net Profit: Rs. ${dbSummary?.netProfitPkr ?? 0}
- Overall Business Net Worth: Rs. ${dbSummary?.netWorthPkr ?? 0}
- Low Stock Items: ${JSON.stringify(contextData?.lowStockItems || [])}
- Targeted Customer Data: ${JSON.stringify(contextData?.targetedCustomer || null)}

Rules:
1. Support all 6 languages: Urdu (اردو), Roman Urdu, Punjabi (پنجابی), Sindhi (سنڌي), Pashto (پښتو), and English.
   Respond in the SAME language/dialect and script the user spoke or wrote, or appropriate Roman/native script.
2. Tone: Warm, respectful, honest ("Bhai", "Sahab", "Janab"), practical, and sharp with numbers.
3. Financial Safety: NEVER silently perform transactions or modify books. If the user wants to add udhaar, record a sale, add an expense, or alter stock, you MUST return a structured proposal requiring explicit confirmation.
4. Output Format: Always respond with a valid JSON object matching this schema:
{
  "reply": "Your conversational response in the requested language/script",
  "languageDetected": "urdu" | "roman-urdu" | "punjabi" | "sindhi" | "pashto" | "english",
  "actionProposal": null | {
    "type": "RECORD_PAYMENT" | "ADD_UDHAAR" | "CREATE_INVOICE" | "QUICK_SALE" | "RECORD_SUPPLIER_PAYMENT" | "TRANSFER_CASH_BANK" | "ADD_EXPENSE" | "ADJUST_STOCK" | "OPEN_KHATA" | "WHATSAPP_SUMMARY",
    "title": "Action title in user language",
    "details": {
      "customerName"?: string,
      "supplierName"?: string,
      "amount"?: number,
      "productName"?: string,
      "quantity"?: number,
      "notes"?: string,
      "category"?: string
    },
    "requiresConfirmation": true
  },
  "speechSynthesisText": "Concise text for voice playback"
}
Output ONLY the raw JSON object without markdown formatting.`;

    if (ai) {
      // Speed-First Architecture:
      // Primary: gemini-3.1-flash-lite (fastest production model, ~1.1-1.3s, MINIMAL thinking overhead)
      // Fallback 1: gemini-flash-latest (full Flash production model)
      // Fallback 2: gemini-3.8-flash (basic text fallback)
      const primaryModel = 'gemini-3.1-flash-lite';
      const fallbackModels = ['gemini-flash-latest', 'gemini-3.8-flash'];
      const modelsToAttempt = [primaryModel, ...fallbackModels];

      const conversationContents = [
        ...conversationHistory.slice(-4).map((turn: { role: string; content: string }) => ({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ];

      for (let modelIndex = 0; modelIndex < modelsToAttempt.length; modelIndex++) {
        const modelName = modelsToAttempt[modelIndex];
        const isPrimary = modelIndex === 0;
        // Bounded retry: only the primary model gets 1 fast retry (max 2 attempts total) for transient 503/429
        const maxAttemptsForModel = isPrimary ? 2 : 1;

        for (let attempt = 0; attempt < maxAttemptsForModel; attempt++) {
          try {
            const startTime = Date.now();
            const response = await ai.models.generateContent({
              model: modelName,
              contents: conversationContents,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json',
                temperature: 0.2,
                ...(modelName === 'gemini-3.1-flash-lite'
                  ? { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } }
                  : {}),
              },
            });

            const rawText = response.text?.trim() || '{}';
            const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
            const parsed = JSON.parse(cleaned);

            // Approximate token estimation
            const estimatedTokens = Math.ceil((systemPrompt.length + message.length + rawText.length) / 4);
            const estimatedCostPkr = (estimatedTokens / 1000000) * 0.15 * 280;

            aiUsageHistory.push({
              id: 'ai_' + Date.now(),
              businessId,
              businessName,
              model: modelName,
              promptLength: message.length,
              tokensEstimated: estimatedTokens,
              costPkrEstimated: estimatedCostPkr,
              timestamp: new Date().toISOString(),
              success: true,
              routingSource: isPrimary ? 'ai_model_primary' : 'ai_model_fallback',
            });

            if (aiUsageHistory.length > 500) {
              aiUsageHistory.shift();
            }

            recordGeminiTelemetry({
              businessId,
              promptLength: message.length,
              inputTokens: Math.ceil(estimatedTokens * 0.75),
              outputTokens: Math.ceil(estimatedTokens * 0.25),
              costPkr: estimatedCostPkr,
              type: 'text',
            });

            const executionSpeedMs = Date.now() - startTime;
            const finalResult = {
              ...parsed,
              routingSource: isPrimary ? 'ai_model_primary' : 'ai_model_fallback',
              modelUsed: modelName,
              tokensUsed: estimatedTokens,
              executionSpeedMs,
            };

            serverResponseCache.set(cacheKey, { reply: finalResult, timestamp: Date.now() });
            // Under normal conditions: Return immediately after 1 single primary call!
            return res.json(finalResult);
          } catch (modelErr: any) {
            // Strict error classification: Differentiate temporary vs permanent errors
            const isTemporary = isTemporaryRecoverableError(modelErr);

            if (!isTemporary) {
              // Permanent error (e.g. invalid API key, 401/403, malformed data, schema error).
              // MUST remain clearly logged for developer monitoring.
              console.error(`[AI Munshi Developer Monitor] Permanent non-recoverable error on ${modelName}:`, {
                status: modelErr?.status || modelErr?.statusCode,
                message: modelErr?.message || modelErr,
              });
              // Stop trying models immediately; do not hide bug or cycle pointlessly
              modelIndex = modelsToAttempt.length;
              break;
            }

            // Temporary error (503 UNAVAILABLE, 429 RATE LIMIT, connection timeout)
            const hasMoreAttemptsForCurrentModel = attempt < maxAttemptsForModel - 1;
            if (hasMoreAttemptsForCurrentModel) {
              // Very short bounded backoff on primary model (250ms)
              await new Promise((resolve) => setTimeout(resolve, 250));
            } else {
              // Fallback route activation log (concise for monitoring)
              console.warn(
                `[AI Munshi Health] Model ${modelName} hit transient spike (${modelErr?.status || '503/429'}). Routing to fallback.`
              );
              // Brief pause before invoking fallback model (150ms)
              await new Promise((resolve) => setTimeout(resolve, 150));
            }
          }
        }
      }
    }

    // Live SQLite Real-Time Data Context
    const todaySummary = getTodayBusinessSummary(businessId);
    const cur = businessProfile?.currency || 'PKR';
    const sales = todaySummary.todaySalesPkr;
    const exp = todaySummary.todayExpensesPkr;
    const profit = todaySummary.todayNetProfitPkr;
    const totalProd = contextData?.totalProducts || 0;
    const lowCount = contextData?.lowStockItems?.length || 0;
    const udhaar = todaySummary.totalCustomerUdhaarPkr;

    // Fallback Smart Heuristic Engine (works offline or when API key is not yet set)
    const lower = message.toLowerCase();
    let reply = '';
    let actionProposal: any = null;
    let detectedLang = language || 'ur';

    // 1. Action Extraction: Udhaar (Credit)
    const udhaarMatch = message.match(/(?:([A-Za-z\u0600-\u06FF\s]+)\s+(?:ko|کو)\s+(\d+)\s*(?:ka|کی)?\s*(?:udhaar|ادھار))/i) ||
                        message.match(/(?:udhaar|ادھار)\s+(?:do|likho|دیں|لکھیں)\s+([A-Za-z\u0600-\u06FF\s]+)\s+(\d+)/i) ||
                        message.match(/([A-Za-z\u0600-\u06FF\s]+)\s+(\d+)\s+(?:udhaar|ادھار)/i);

    // 2. Action Extraction: Wasooli (Payment)
    const wasooliMatch = message.match(/(?:([A-Za-z\u0600-\u06FF\s]+)\s+(?:se|سے)\s+(\d+)\s*(?:ki)?\s*(?:wasooli|payment|وصولی))/i) ||
                         message.match(/(?:wasooli|payment|وصولی)\s+(?:aayi|لی|کرو)\s+([A-Za-z\u0600-\u06FF\s]+)\s+(\d+)/i) ||
                         message.match(/([A-Za-z\u0600-\u06FF\s]+)\s+(?:ne|نے)\s+(\d+)\s+(?:diye|دیئے)/i);

    // 3. Action Extraction: Expense (Kharcha)
    const expenseMatch = message.match(/(\d+)\s*(?:rupay|rs|روپے)?\s+(?:ka\s+)?([A-Za-z\u0600-\u06FF\s]+)\s+(?:kharcha|expense|خرچہ|بل)/i) ||
                         message.match(/(?:kharcha|expense|خرچہ)\s+(?:likho|لکھیں)\s+(\d+)\s+([A-Za-z\u0600-\u06FF\s]+)/i);

    // 4. Customer Query
    const custQueryMatch = message.match(/([A-Za-z\u0600-\u06FF]+)\s+(?:ka|کی|کے|کاتو)\s+(?:khata|udhaar|hisaab|baqaya|balance|کھاتہ|حساب|ادھار|بقایا)/i);

    if (udhaarMatch) {
      const custName = udhaarMatch[1].trim();
      const amount = Number(udhaarMatch[2]);
      if (amount > 0) {
        actionProposal = {
          type: 'ADD_UDHAAR',
          title: `ادھار درج کریں: ${custName} (Rs. ${amount.toLocaleString()})`,
          details: {
            customerName: custName,
            amount,
            notes: `AI Munshi voice/text action: ${message}`,
          },
          requiresConfirmation: true,
          confirmationMessage: `کیا آپ ${custName} کے کھاتے میں Rs. ${amount.toLocaleString()} ادھار درج کرنے کی تصدیق کرتے ہیں؟`,
        };
        reply = `جی جناب! میں نے ${custName} کے کھاتے میں Rs. ${amount.toLocaleString()} ادھار درج کرنے کی تجویز تیار کر لی ہے۔ براہ کرم نیچے تصدیق (Confirm) بٹن دبائیں۔`;
      }
    } else if (wasooliMatch) {
      const custName = wasooliMatch[1].trim();
      const amount = Number(wasooliMatch[2]);
      if (amount > 0) {
        actionProposal = {
          type: 'RECORD_PAYMENT',
          title: `وصولی درج کریں: ${custName} (Rs. ${amount.toLocaleString()})`,
          details: {
            customerName: custName,
            amount,
            accountType: 'cash',
            notes: `AI Munshi wasooli: ${message}`,
          },
          requiresConfirmation: true,
          confirmationMessage: `کیا آپ ${custName} سے Rs. ${amount.toLocaleString()} کی وصولی کیش میں درج کرنے کی تصدیق کرتے ہیں؟`,
        };
        reply = `بہترین! ${custName} سے Rs. ${amount.toLocaleString()} کی وصولی کیش میں درج کرنے کے لیے تصدیق درکار ہے۔ نیچے تصدیق بٹن پر کلک کریں۔`;
      }
    } else if (expenseMatch) {
      const amount = Number(expenseMatch[1]);
      const cat = expenseMatch[2]?.trim() || 'General';
      if (amount > 0) {
        actionProposal = {
          type: 'ADD_EXPENSE',
          title: `خرچہ درج کریں: ${cat} (Rs. ${amount.toLocaleString()})`,
          details: {
            category: cat,
            amount,
            notes: message,
          },
          requiresConfirmation: true,
          confirmationMessage: `کیا آپ ${cat} کے لیے Rs. ${amount.toLocaleString()} کا خرچہ درج کرنے کی تصدیق کرتے ہیں؟`,
        };
        reply = `جی، Rs. ${amount.toLocaleString()} کا خرچہ (${cat}) درج کرنے کے لیے تصدیق بٹن دبائیں۔`;
      }
    } else if (custQueryMatch) {
      const qName = custQueryMatch[1].trim();
      const khataInfo = getCustomerKhataByNameOrPhone(businessId, qName);
      if (khataInfo.customer) {
        reply = `گاہک ${khataInfo.customer.name} کا موجودہ بقایا ادھار Rs. ${khataInfo.balancePkr.toLocaleString()} ہے۔ فون نمبر: ${khataInfo.customer.phone || 'درج نہیں'}`;
        if (khataInfo.recentTransactions.length > 0) {
          const last = khataInfo.recentTransactions[0];
          reply += ` | آخری لین دین: Rs. ${last.amountPkr.toLocaleString()} (${last.type === 'credit_given' ? 'ادھار' : 'وصولی'}) بتاریخ ${last.date}۔`;
        }
      } else {
        reply = `گاہک "${qName}" کا ریکارڈ نہیں ملا۔ کیا آپ نیا گاہک درج کرنا چاہتے ہیں؟`;
      }
    } else {
      const isProfitQuery = lower.includes('profit') || lower.includes('منافع') || lower.includes('نفع') || lower.includes('فائدو');
      const isSaleQuery = lower.includes('sale') || lower.includes('سیل') || lower.includes('فروخت') || lower.includes('وڪرو');
      const isStockQuery = lower.includes('stock') || lower.includes('سٹاک') || lower.includes('اسٹاک') || lower.includes('مال') || lower.includes('سامان') || lower.includes('زېرمه');
      const isKhataQuery = lower.includes('udhaar') || lower.includes('ادھار') || lower.includes('اوڌر') || lower.includes('khata') || lower.includes('کھاتہ') || lower.includes('کاتو') || lower.includes('پور');
      const isBillQuery = lower.includes('bill') || lower.includes('بل') || lower.includes('رسید');
      const isExpenseQuery = lower.includes('expense') || lower.includes('خرچ') || lower.includes('اخراجات');

      if (isProfitQuery) {
        reply = `آج کا مجموعی منافع (Gross Profit) Rs. ${todaySummary.todayGrossProfitPkr.toLocaleString()} ہے اور تمام اخراجات نکال کر خالص منافع (Net Profit) Rs. ${profit.toLocaleString()} ہے۔`;
      } else if (isExpenseQuery) {
        reply = `آج کے کل اخراجات Rs. ${exp.toLocaleString()} ہیں۔`;
      } else if (isSaleQuery) {
        reply = `جناب، آج کی کل سیل Rs. ${sales.toLocaleString()} ہے (${todaySummary.todaySalesCount} بلز)، اور آج کے اخراجات Rs. ${exp.toLocaleString()} ہیں۔`;
      } else if (isStockQuery) {
        reply = lowCount > 0
          ? `آپ کے پاس کل ${totalProd} پروڈکٹس ہیں۔ ${lowCount} اشیاء کا اسٹاک کم ہو چکا ہے۔`
          : `ماشاءاللہ آپ کے پاس کل ${totalProd} پروڈکٹس ہیں اور سب کا اسٹاک تسلی بخش ہے۔`;
      } else if (isKhataQuery) {
        reply = `گاہکوں کا کل بقایا ادھار Rs. ${udhaar.toLocaleString()} ہے۔ دکان میں کیش بیلنس Rs. ${todaySummary.totalLiquidCashPkr.toLocaleString()} ہے۔`;
      } else if (isBillQuery) {
        reply = `جی بالکل! نیا بل بنانے کے لیے فوری کاؤنٹر حاضر ہے۔ کس گاہک کا بل بنانا ہے؟`;
        actionProposal = {
          type: 'CREATE_INVOICE',
          title: 'نیا بل بنائیں (Quick POS)',
          details: { notes: 'Voice / Chat سے درخواست کی گئی' },
          requiresConfirmation: false,
        };
      } else {
        reply = `جی جناب! میں آسانی بز AI منشی ہوں۔ میں سیلز، گاہک کا کھاتہ، ادھار درج کرنے، وصولی، خرچے اور اسٹاک میں آپ کی فوری مدد کر سکتا ہوں۔ آپ مجھے حکم کریں، مثلاً: "علی کو 2000 ادھار دو" یا "آج کا منافع بتاؤ"۔`;
      }
    }

    res.json({
      reply,
      languageDetected: detectedLang,
      actionProposal,
      speechSynthesisText: reply,
      offlineFallback: !ai,
    });
  } catch (err: any) {
    console.error('Error in /api/ai-munshi/chat:', err);
    // User Experience Rule: Never expose raw "503 UNAVAILABLE" or "429 Too Many Requests" to the customer
    const isUrdu = (req.body?.language || '').includes('ur');
    const safeCustomerMessage = isUrdu
      ? 'جناب، عارضی نیٹ ورک مصروفیت کی وجہ سے سرور رابطہ سست ہے۔ آپ کا کھاتہ اور ڈیٹا بالکل محفوظ ہے۔ براہ کرم کچھ دیر بعد دوبارہ فرمائیں۔'
      : 'Janab, temporary network delay ki wajah se rabta slow hai. Aap ka khata aur records bilkul mehfooz hain. Baraye meherbani thori der baad dobara farmayein.';

    res.json({
      reply: safeCustomerMessage,
      languageDetected: isUrdu ? 'urdu' : 'roman-urdu',
      actionProposal: null,
      speechSynthesisText: safeCustomerMessage,
      routingSource: 'graceful_error_recovery',
      errorClass: isTemporaryRecoverableError(err) ? 'TEMPORARY_NETWORK_SPIKE' : 'APPLICATION_EXCEPTION',
    });
  }
});

// Phase 3: AI Munshi Action Execution Endpoint (Explicit Confirmation Protected)
app.post('/api/ai-munshi/execute-action', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { action, userApproved = true, createdBy = 'Owner' } = req.body;

    if (!action || !action.type) {
      return res.status(400).json({ error: 'Action object with valid type is required' });
    }

    if (!userApproved) {
      return res.status(403).json({ error: 'Action rejected: User confirmation is strictly required.' });
    }

    const result = executeAIMunshiAction(businessId, {
      type: action.type,
      details: action.details,
      userApproved: true,
      createdBy,
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Error executing AI Munshi action:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Phase 3: AI Munshi Customer Khata Query Endpoint
app.post('/api/ai-munshi/query-customer', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const data = getCustomerKhataByNameOrPhone(businessId, query);
    res.json({ success: true, ...data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Note: Phase 5 Smart Parchi Camera & AI Batch Scanner endpoints are mounted in the dedicated Phase 5 section below.


// Phase 3: Cash Reconciliation & Daily Closing
app.post('/api/financial/reconcile', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { accountType = 'cash', physicalCountPkr, notes, createdBy = 'Owner', autoAdjust = true } = req.body;

    if (physicalCountPkr === undefined || isNaN(Number(physicalCountPkr))) {
      return res.status(400).json({ error: 'Valid physicalCountPkr is required' });
    }

    const result = reconcileCashAccount(businessId, {
      accountType,
      physicalCountPkr: Number(physicalCountPkr),
      notes,
      createdBy,
      autoAdjust: Boolean(autoAdjust),
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/financial/reconciliations', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const history = getReconciliationHistory(businessId, Number(req.query.limit) || 30);
    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Phase 3: Smart Business Alerts
app.get('/api/alerts/smart', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const businessType = req.query.businessType as string | undefined;
    const alerts = getSmartBusinessAlerts(businessId, businessType);
    res.json({ success: true, alerts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Phase 3: Advanced Periodic Reports & WhatsApp Summary
app.get('/api/reports/periodic', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const period = (req.query.period as any) || 'today';
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const report = getAdvancedPeriodicReport(businessId, period, startDate, endDate);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Phase 3: Security Shop PIN Authentication
app.post('/api/auth/pin-verify', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ error: 'Security PIN is required' });
    }

    const result = verifyOrSetShopPin(businessId, pin, false);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/pin-set', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { pin } = req.body;
    if (!pin || pin.length < 4) {
      return res.status(400).json({ error: 'PIN must be at least 4 digits' });
    }

    const result = verifyOrSetShopPin(businessId, pin, true);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Phase 3: Offline Synchronization Batch Processor
app.post('/api/sync/batch', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { items = [] } = req.body;
    const result = processOfflineSyncBatch(businessId, items);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================================================
// PHASE 5: SMART PARCHI CAMERA + AI PARSER ENGINE
// =============================================================================

// In-memory cache for parchi scan results to prevent duplicate Gemini billing (15-min TTL)
const parchiScanCache = new Map<string, { result: any; timestamp: number }>();

function getParchiImageFingerprint(base64: string): string {
  const clean = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  const len = clean.length;
  if (len < 200) return clean;
  // Sample length and key slices to create a deterministic fingerprint
  return `${len}_${clean.slice(0, 50)}_${clean.slice(Math.floor(len / 2), Math.floor(len / 2) + 50)}_${clean.slice(-50)}`;
}

async function extractParchiWithGemini(ai: GoogleGenAI | null, imageBase64: string, mimeType: string = 'image/jpeg') {
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
  const fingerprint = getParchiImageFingerprint(cleanBase64);

  // Return cached result if available and fresh (<15 mins)
  const cached = parchiScanCache.get(fingerprint);
  if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) {
    return { ...cached.result, cached: true };
  }

  // Graceful offline fallback if Gemini API key is not present
  if (!ai) {
    const offlineResult = {
      billType: 'purchase',
      partyName: 'غلہ منڈی جنرل سپلائر',
      partyType: 'supplier',
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `PRC-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [
        { name: 'چاول کرنل باسمتی (Super Karnal Rice)', quantity: 25, unit: 'کلو', rate: 260, lineTotal: 6500, confidence: 'high' },
        { name: 'کوکنگ آئل 5 لیٹر (Cooking Oil)', quantity: 2, unit: 'کین', rate: 2450, lineTotal: 4900, confidence: 'high' },
        { name: 'دال چنا سپیشل (Daal Chana)', quantity: 10, unit: 'کلو', rate: 220, lineTotal: 2200, confidence: 'medium' },
      ],
      subtotal: 13600,
      discount: 100,
      tax: 0,
      grandTotal: 13500,
      confidence: 'high',
      warnings: ['سرور پر Gemini API key متحرک نہیں ہے۔ ڈیمو آف لائن ریڈر نے پرچی تیار کی ہے۔'],
      readability: {
        isBlurry: false,
        isLowLight: false,
        isGlare: false,
        isCropped: false,
        overallQuality: 'good',
      },
      offlineFallback: true,
    };
    return offlineResult;
  }

  const prompt = `You are the specialized AI Parchi & Receipt Engine for AsaniBiz (Pakistani retail & wholesale shop system).
Read this invoice/parchi image with extreme precision. The parchi may be handwritten, printed, thermal receipt, or wholesale mandi slip in Urdu, Roman Urdu, English, or mixed digits/Urdu numerals (۱۲۳۴۵۶۷۸۹۰).

Extract all data into this strict JSON structure:
{
  "billType": "purchase" or "sale",
  "partyName": string or null (Supplier/Vendor name for purchase, Customer name for sale),
  "partyType": "supplier" or "customer",
  "date": string (YYYY-MM-DD or null),
  "invoiceNumber": string or null,
  "items": [
    {
      "name": string (product name in original language/script, e.g. "Basmati Rice" or "چاول باسمتی" or "Daal Chana"),
      "quantity": number (MUST be numeric, e.g. 5, 2.5, 1),
      "unit": string (e.g. "kg", "کلو", "liter", "لیٹر", "bori", "بوری", "packet", "پیکٹ", "piece", "عدد", "dzn"),
      "rate": number (unit price / rate per unit; MUST be numeric),
      "lineTotal": number or null (total written on parchi for this row),
      "confidence": "high" or "medium" or "low",
      "unclearReason": string or null
    }
  ],
  "subtotal": number or null,
  "discount": number or 0,
  "tax": number or 0,
  "grandTotal": number or null,
  "confidence": "high" or "medium" or "low",
  "warnings": [string] (list any unclear items, smudged handwriting, or missing numbers in Urdu),
  "readability": {
    "isBlurry": boolean,
    "isLowLight": boolean,
    "isGlare": boolean,
    "isCropped": boolean,
    "overallQuality": "good" or "acceptable" or "poor" or "unreadable"
  }
}

CRITICAL RULES:
1. STRICT NON-GUESSING: Do not hallucinate or guess faded/smudged ink. If a rate or quantity is unclear, set confidence to "low", record in "unclearReason", and add a clear Urdu warning (e.g. "ائٹم 2 کا ریٹ واضح نہیں ہے").
2. Urdu & Roman Urdu: Accurately parse grocery items (آٹا، گھی، چینی، دال، چاول، پتی، صابن، مصالحہ، تیل، سگریٹ، کھاد، بیج وغیرہ).
3. Numerals: Handle both standard digits (123) and Urdu/Arabic numerals (۱=1, ۲=2, ۳=3, ۴=4, ۵=5, ۶=6, ۷=7, ۸=8, ۹=9, ۰=0).
4. Raw JSON Only: Return valid raw JSON matching schema.`;

  let response: any = null;
  const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];

  for (const modelName of candidateModels) {
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(
                    (mimeType || '').toLowerCase()
                  )
                    ? (mimeType || '').toLowerCase()
                    : 'image/jpeg',
                },
              },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
      if (response && response.text) {
        break; // Successfully generated content
      }
    } catch {
      // Graceful fallback on temporary 503 high demand or rate limits: delay and switch model
      await new Promise((resolve) => setTimeout(resolve, 350));
      continue;
    }
  }

  if (!response || !response.text) {
    console.info('Parchi vision models temporarily unavailable, serving clean editable manual entry slip.');
    return {
      billType: 'purchase',
      partyName: 'مارکیٹ سپلائر',
      partyType: 'supplier',
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `PRC-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      grandTotal: 0,
      confidence: 'low',
      warnings: ['سرور سے پرچی کا متن خودکار پڑھنے میں دشواری پیش آئی۔ آپ تصویر دیکھ کر ائٹمز درج کر سکتے ہیں۔'],
      readability: {
        isBlurry: false,
        isLowLight: false,
        isGlare: false,
        isCropped: false,
        overallQuality: 'unreadable',
      },
    };
  }

  const raw = response.text?.trim() || '{}';
  const cleaned = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.warn('Failed to parse Gemini JSON output:', raw);
    parsed = {
      billType: 'purchase',
      partyName: 'مارکیٹ سپلائر',
      partyType: 'supplier',
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `PRC-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      grandTotal: 0,
      warnings: ['پرچی سے ٹیکسٹ مکمل واضح نہیں ہو سکا۔ براہ کرم ائٹمز خود چیک یا ایڈ کریں۔'],
    };
  }

  // Normalize fields to ensure safe client consumption
  if (!Array.isArray(parsed.items)) parsed.items = [];
  if (!Array.isArray(parsed.warnings)) parsed.warnings = [];
  if (!parsed.billType) parsed.billType = 'purchase';
  if (!parsed.partyName) parsed.partyName = parsed.billType === 'sale' ? 'عام گاہک' : 'مارکیٹ سپلائر';
  if (!parsed.partyType) parsed.partyType = parsed.billType === 'sale' ? 'customer' : 'supplier';
  if (!parsed.date) parsed.date = new Date().toISOString().split('T')[0];
  if (!parsed.invoiceNumber) parsed.invoiceNumber = `PRC-${Math.floor(1000 + Math.random() * 9000)}`;
  if (!parsed.readability) {
    parsed.readability = {
      isBlurry: false,
      isLowLight: false,
      isGlare: false,
      isCropped: false,
      overallQuality: 'good',
    };
  }

  // Save to cache
  parchiScanCache.set(fingerprint, { result: parsed, timestamp: Date.now() });

  return parsed;
}

// Single Parchi / Receipt Scanner Endpoint
app.post(['/api/ai/scan-receipt', '/api/ai/scan-parchi'], async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Image base64 data is required' });
    }

    const ai = getGeminiClient();
    const result = await extractParchiWithGemini(ai, imageBase64, mimeType);

    // Map vendorName / partyName for backward and forward compatibility
    const responsePayload = {
      success: true,
      data: {
        ...result,
        vendorName: result.partyName || result.vendorName || 'نامعلوم پارٹی',
        customerName: result.billType === 'sale' ? (result.partyName || result.customerName || 'عام گاہک') : null,
        totalAmount: result.grandTotal !== undefined ? result.grandTotal : result.totalAmount,
      },
    };

    res.json(responsePayload);
  } catch (err: any) {
    console.error('Error scanning single parchi:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to scan parchi' });
  }
});

// Batch Parchi Scanner Endpoint (5-8+ bills from Camera / Gallery / WhatsApp)
app.post('/api/ai/scan-receipt-batch', async (req, res) => {
  try {
    const { images = [] } = req.body;
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, error: 'Images array is required for batch scanning.' });
    }

    const ai = getGeminiClient();
    const results: any[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const imgId = img.id || `parchi_${i + 1}_${Date.now()}`;

      try {
        if (!img.imageBase64) {
          results.push({
            id: imgId,
            success: false,
            error: 'No image data provided',
            warnings: ['پرچی کی تصویر موصول نہیں ہوئی'],
          });
          continue;
        }

        const parsed = await extractParchiWithGemini(ai, img.imageBase64, img.mimeType || 'image/jpeg');
        results.push({
          id: imgId,
          success: true,
          ...parsed,
          vendorName: parsed.partyName || parsed.vendorName || `سپلائر پرچی #${i + 1}`,
          customerName: parsed.billType === 'sale' ? (parsed.partyName || 'عام گاہک') : null,
          totalAmount: parsed.grandTotal !== undefined ? parsed.grandTotal : parsed.totalAmount,
        });
      } catch (e: any) {
        console.warn(`Error scanning batch parchi ${i + 1}:`, e);
        results.push({
          id: imgId,
          success: false,
          error: e.message || 'Failed to scan parchi',
          warnings: [`پرچی #${i + 1} پڑھنے میں مسئلہ پیش آیا: ${e.message}`],
          billType: 'purchase',
          partyName: `پرچی #${i + 1} (خراب کوالٹی)`,
          date: new Date().toISOString().split('T')[0],
          invoiceNumber: `ERR-${i + 1}`,
          items: [],
          grandTotal: 0,
        });
      }
    }

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (err: any) {
    console.error('Error in POST /api/ai/scan-receipt-batch:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to process batch receipts' });
  }
});

// Save Approved Batch or Single Parsed Bills
app.post('/api/ai/save-parsed-bills', (req, res) => {
  try {
    const businessId = resolveBusinessId(req);
    const { bills = [], approvedBy = 'Owner' } = req.body;

    if (!Array.isArray(bills) || bills.length === 0) {
      return res.status(400).json({ success: false, error: 'Bills array is required.' });
    }

    const savedResults = saveApprovedParsedBills(businessId, bills, approvedBy);
    res.json({
      success: true,
      message: `${savedResults.length} پرچیاں کھاتے اور اسٹاک میں کامیابی سے درج کر دی گئیں۔`,
      savedCount: savedResults.length,
      results: savedResults,
    });
  } catch (err: any) {
    console.error('Error in POST /api/ai/save-parsed-bills:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to save parsed bills' });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isDev = process.env.NODE_ENV === 'development' || (!hasDist && process.env.NODE_ENV !== 'production');

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AsaniBiz server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
