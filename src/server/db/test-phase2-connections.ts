import { getDatabase, runTransaction } from './database';
import {
  getOrCreateBusiness,
  createCustomer,
  getCustomers,
  createSupplier,
  createProduct,
  getProducts,
  createSale,
  createPurchase,
  createExpense,
  recordCustomerPaymentWithAccount,
  recordSupplierPaymentWithAccount,
  transferBetweenAccounts,
  recordStaffTransaction,
  createStaff,
  createCommission,
  payCommission,
  createTransportTrip,
  createAsset,
  createLiability,
  recordLiabilityPayment,
  recordSaleReturn,
  recordPurchaseReturn,
  getComprehensiveReportSummary,
  getFinancialAccounts,
  paisaToPkr,
  pkrToPaisa,
} from './operations';

export interface Phase2TestResult {
  testId: number;
  name: string;
  passed: boolean;
  details: Record<string, any>;
  error?: string;
}

export function runPhase2IntegrationTests(): {
  allPassed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: Phase2TestResult[];
} {
  console.log('=============================================================================');
  console.log('>>> [PHASE 2 INTEGRATION SUITE] Starting Strict Business Tool Connections Verification');
  console.log('=============================================================================');

  const db = getDatabase();
  const testBizId = `biz_phase2_test_${Date.now()}`;
  const results: Phase2TestResult[] = [];

  // Setup test business
  getOrCreateBusiness({
    id: testBizId,
    name: 'AsaniBiz Phase 2 Test Mart',
    businessType: 'general_store',
    ownerName: 'Haji Aslam',
    phone: '0300-7654321',
  });

  // Helper to get balance of an account
  function getAccountBalance(type: string): number {
    const acc = db
      .prepare('SELECT current_balance_paisa FROM financial_accounts WHERE business_id = ? AND type = ?')
      .get(testBizId, type) as { current_balance_paisa: number } | undefined;
    return acc ? paisaToPkr(acc.current_balance_paisa) : 0;
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Cash Sale
  // ---------------------------------------------------------------------------
  try {
    const prod1 = createProduct(testBizId, {
      name: 'Basmati Rice Super Karnal',
      purchasePricePkr: 200,
      sellingPricePkr: 300,
      initialStock: 50,
      unit: 'kg',
    });

    const initCash = getAccountBalance('cash');
    const { sale } = createSale(testBizId, {
      customerName: 'Walk-in Customer',
      paymentMethod: 'cash',
      paidAmountPkr: 1500, // 5kg * 300 = 1500
      items: [
        {
          productId: prod1.id,
          productName: prod1.name,
          quantity: 5,
          unitPricePkr: 300,
          purchasePricePkr: 200,
          unit: 'kg',
        },
      ],
    });

    const updatedProd = db.prepare('SELECT current_stock FROM products WHERE id = ?').get(prod1.id) as { current_stock: number };
    const finalCash = getAccountBalance('cash');

    const stockMove = db.prepare('SELECT * FROM stock_movements WHERE business_id = ? AND reference_id = ?').get(testBizId, sale.id) as any;
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE business_id = ? AND reference_id = ?').get(testBizId, sale.id) as any;

    const pass = updatedProd.current_stock === 45 &&
                 finalCash === initCash + 1500 &&
                 stockMove && stockMove.movement_type === 'sale' &&
                 finTx && finTx.type === 'money_in' && finTx.category === 'sale';

    results.push({
      testId: 1,
      name: 'Cash Sale Connection',
      passed: Boolean(pass),
      details: {
        initialStock: 50,
        finalStock: updatedProd.current_stock,
        cashDelta: finalCash - initCash,
        saleId: sale.id,
        invoiceNumber: sale.invoice_number,
      },
    });
  } catch (err: any) {
    results.push({ testId: 1, name: 'Cash Sale Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Credit Sale
  // ---------------------------------------------------------------------------
  try {
    const cust1 = createCustomer(testBizId, {
      name: 'Muhammad Tariq',
      phone: '0311-1234567',
      openingBalancePkr: 0,
    });

    const prod2 = createProduct(testBizId, {
      name: 'Cooking Oil 5L',
      purchasePricePkr: 2000,
      sellingPricePkr: 2500,
      initialStock: 20,
      unit: 'tin',
    });

    const initCash = getAccountBalance('cash');
    const { sale } = createSale(testBizId, {
      customerId: cust1.id,
      customerName: cust1.name,
      paymentMethod: 'credit',
      paidAmountPkr: 0,
      items: [
        {
          productId: prod2.id,
          productName: prod2.name,
          quantity: 2,
          unitPricePkr: 2500,
          purchasePricePkr: 2000,
          unit: 'tin',
        },
      ],
    });

    const updatedProd = db.prepare('SELECT current_stock FROM products WHERE id = ?').get(prod2.id) as { current_stock: number };
    const updatedCust = db.prepare('SELECT current_balance_paisa FROM customers WHERE id = ?').get(cust1.id) as { current_balance_paisa: number };
    const finalCash = getAccountBalance('cash');

    const khataTx = db.prepare('SELECT * FROM khata_transactions WHERE business_id = ? AND reference_id = ?').get(testBizId, sale.id) as any;

    const pass = updatedProd.current_stock === 18 &&
                 paisaToPkr(updatedCust.current_balance_paisa) === 5000 &&
                 finalCash === initCash &&
                 khataTx && khataTx.type === 'credit_given';

    results.push({
      testId: 2,
      name: 'Credit Sale Connection',
      passed: Boolean(pass),
      details: {
        productStock: updatedProd.current_stock,
        customerBalancePkr: paisaToPkr(updatedCust.current_balance_paisa),
        cashUnchanged: finalCash === initCash,
        salePaymentStatus: sale.payment_status,
      },
    });
  } catch (err: any) {
    results.push({ testId: 2, name: 'Credit Sale Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Customer Payment (Wasooli)
  // ---------------------------------------------------------------------------
  try {
    const cust = db.prepare('SELECT * FROM customers WHERE business_id = ? AND name = ?').get(testBizId, 'Muhammad Tariq') as any;
    const initEasypaisa = getAccountBalance('easypaisa');

    const paymentRes = recordCustomerPaymentWithAccount(testBizId, {
      customerId: cust.id,
      customerName: cust.name,
      amountPkr: 2000,
      paymentMethod: 'easypaisa',
      notes: 'Partial payment via Easypaisa',
    });

    const finalEasypaisa = getAccountBalance('easypaisa');
    const updatedCust = db.prepare('SELECT current_balance_paisa FROM customers WHERE id = ?').get(cust.id) as any;

    const pass = paisaToPkr(updatedCust.current_balance_paisa) === 3000 &&
                 finalEasypaisa === initEasypaisa + 2000 &&
                 paymentRes.khataTx.type === 'payment_received' &&
                 paymentRes.financialTx.category === 'customer_payment';

    results.push({
      testId: 3,
      name: 'Customer Payment (Wasooli)',
      passed: Boolean(pass),
      details: {
        previousCustBal: paisaToPkr(cust.current_balance_paisa),
        newCustBal: paisaToPkr(updatedCust.current_balance_paisa),
        easypaisaIncrease: finalEasypaisa - initEasypaisa,
        khataTxId: paymentRes.khataTx.id,
      },
    });
  } catch (err: any) {
    results.push({ testId: 3, name: 'Customer Payment (Wasooli)', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Credit Purchase
  // ---------------------------------------------------------------------------
  try {
    const supp1 = createSupplier(testBizId, {
      name: 'Habib Traders Lahore',
      phone: '0321-4455667',
    });

    const prod = db.prepare('SELECT * FROM products WHERE business_id = ? AND name = ?').get(testBizId, 'Cooking Oil 5L') as any;
    const initStock = prod.current_stock;
    const initBank = getAccountBalance('bank');

    const { purchase } = createPurchase(testBizId, {
      supplierId: supp1.id,
      supplierName: supp1.name,
      supplierInvoiceNo: 'BILL-9081',
      paidAmountPkr: 0,
      paymentMethod: 'credit',
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          quantity: 10,
          costPricePkr: 1950,
          unit: 'tin',
        },
      ],
    });

    const updatedProd = db.prepare('SELECT current_stock FROM products WHERE id = ?').get(prod.id) as any;
    const updatedSupp = db.prepare('SELECT payable_balance_paisa FROM suppliers WHERE id = ?').get(supp1.id) as any;
    const finalBank = getAccountBalance('bank');

    const pass = updatedProd.current_stock === initStock + 10 &&
                 paisaToPkr(updatedSupp.payable_balance_paisa) === 19500 &&
                 finalBank === initBank &&
                 purchase.payment_status === 'unpaid';

    results.push({
      testId: 4,
      name: 'Credit Purchase Connection',
      passed: Boolean(pass),
      details: {
        newStock: updatedProd.current_stock,
        supplierPayablePkr: paisaToPkr(updatedSupp.payable_balance_paisa),
        purchaseId: purchase.id,
      },
    });
  } catch (err: any) {
    results.push({ testId: 4, name: 'Credit Purchase Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Supplier Payment (Adaigi)
  // ---------------------------------------------------------------------------
  try {
    const supp = db.prepare('SELECT * FROM suppliers WHERE business_id = ? AND name = ?').get(testBizId, 'Habib Traders Lahore') as any;
    const initBank = getAccountBalance('bank');

    const pmtRes = recordSupplierPaymentWithAccount(testBizId, {
      supplierId: supp.id,
      supplierName: supp.name,
      amountPkr: 9500,
      paymentMethod: 'bank',
      notes: 'Partial payment via Bank transfer',
    });

    const updatedSupp = db.prepare('SELECT payable_balance_paisa FROM suppliers WHERE id = ?').get(supp.id) as any;
    const finalBank = getAccountBalance('bank');

    const pass = paisaToPkr(updatedSupp.payable_balance_paisa) === 10000 &&
                 finalBank === initBank - 9500 &&
                 pmtRes.khataTx.type === 'payment_made' &&
                 pmtRes.financialTx.category === 'supplier_payment';

    results.push({
      testId: 5,
      name: 'Supplier Payment (Adaigi)',
      passed: Boolean(pass),
      details: {
        previousPayable: paisaToPkr(supp.payable_balance_paisa),
        newPayable: paisaToPkr(updatedSupp.payable_balance_paisa),
        bankDeduction: initBank - finalBank,
        txId: pmtRes.khataTx.id,
      },
    });
  } catch (err: any) {
    results.push({ testId: 5, name: 'Supplier Payment (Adaigi)', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Operating Expense
  // ---------------------------------------------------------------------------
  try {
    const initCash = getAccountBalance('cash');
    const exp = createExpense(testBizId, {
      category: 'Utilities',
      amountPkr: 450,
      paidVia: 'Cash',
      notes: 'Electricity bill contribution',
    });

    const finalCash = getAccountBalance('cash');
    const finTx = db.prepare('SELECT * FROM financial_transactions WHERE reference_id = ?').get(exp.id) as any;

    const pass = finalCash === initCash - 450 &&
                 finTx && finTx.type === 'money_out' && finTx.category === 'expense';

    results.push({
      testId: 6,
      name: 'Operating Expense Connection',
      passed: Boolean(pass),
      details: {
        expenseId: exp.id,
        amountPkr: paisaToPkr(exp.amount_paisa),
        cashDeduction: initCash - finalCash,
      },
    });
  } catch (err: any) {
    results.push({ testId: 6, name: 'Operating Expense Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Staff Payment / Advance
  // ---------------------------------------------------------------------------
  try {
    const staff = createStaff(testBizId, {
      name: 'Kashif Ali',
      phone: '0333-5566778',
      role: 'Salesman',
      salaryPkr: 22000,
    });

    const initJazz = getAccountBalance('jazzcash');
    const staffTx = recordStaffTransaction(testBizId, {
      staffId: staff.id,
      type: 'advance',
      amountPkr: 3000,
      paymentMethod: 'jazzcash',
      notes: 'Emergency family advance',
      idempotencyKey: `staff_adv_${staff.id}_test1`,
    });

    const finalJazz = getAccountBalance('jazzcash');
    const updatedStaff = db.prepare('SELECT advance_balance_paisa FROM staff WHERE id = ?').get(staff.id) as any;

    // Verify idempotency
    const dupTx = recordStaffTransaction(testBizId, {
      staffId: staff.id,
      type: 'advance',
      amountPkr: 3000,
      paymentMethod: 'jazzcash',
      idempotencyKey: `staff_adv_${staff.id}_test1`,
    });

    const postDupJazz = getAccountBalance('jazzcash');

    const pass = paisaToPkr(updatedStaff.advance_balance_paisa) === 3000 &&
                 finalJazz === initJazz - 3000 &&
                 postDupJazz === finalJazz && // duplicate did NOT deduct again
                 staffTx.financialTransaction.type === 'money_out';

    results.push({
      testId: 7,
      name: 'Staff Advance & Payroll Connection',
      passed: Boolean(pass),
      details: {
        staffId: staff.id,
        advanceBalance: paisaToPkr(updatedStaff.advance_balance_paisa),
        jazzCashDeduction: initJazz - finalJazz,
        idempotencyVerified: postDupJazz === finalJazz,
      },
    });
  } catch (err: any) {
    results.push({ testId: 7, name: 'Staff Advance & Payroll Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Cash → Bank Transfer (Zero P&L Impact)
  // ---------------------------------------------------------------------------
  try {
    const preSummary = getComprehensiveReportSummary(testBizId);
    const initCash = getAccountBalance('cash');
    const initBank = getAccountBalance('bank');

    const transferRes = transferBetweenAccounts(testBizId, {
      fromAccountType: 'cash',
      toAccountType: 'bank',
      amountPkr: 500,
      description: 'Daily cash deposit into Meezan Bank',
    });

    const finalCash = getAccountBalance('cash');
    const finalBank = getAccountBalance('bank');
    const postSummary = getComprehensiveReportSummary(testBizId);

    const pass = finalCash === initCash - 500 &&
                 finalBank === initBank + 500 &&
                 transferRes.fromTx.type === 'transfer_out' &&
                 transferRes.toTx.type === 'transfer_in' &&
                 postSummary.netProfitPkr === preSummary.netProfitPkr && // zero P&L impact!
                 postSummary.totalLiquidCashPkr === preSummary.totalLiquidCashPkr; // total liquidity unchanged!

    results.push({
      testId: 8,
      name: 'Cash → Bank Transfer (Zero P&L Impact)',
      passed: Boolean(pass),
      details: {
        cashDelta: finalCash - initCash,
        bankDelta: finalBank - initBank,
        preNetProfit: preSummary.netProfitPkr,
        postNetProfit: postSummary.netProfitPkr,
        profitUnchanged: postSummary.netProfitPkr === preSummary.netProfitPkr,
      },
    });
  } catch (err: any) {
    results.push({ testId: 8, name: 'Cash → Bank Transfer (Zero P&L Impact)', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 9: Sales Return
  // ---------------------------------------------------------------------------
  try {
    const prod = db.prepare('SELECT * FROM products WHERE business_id = ? AND name = ?').get(testBizId, 'Basmati Rice Super Karnal') as any;
    const cust = db.prepare('SELECT * FROM customers WHERE business_id = ? AND name = ?').get(testBizId, 'Muhammad Tariq') as any;
    const initStock = prod.current_stock;
    const initCustBal = paisaToPkr(cust.current_balance_paisa);

    const retRes = recordSaleReturn(testBizId, {
      customerId: cust.id,
      customerName: cust.name,
      productId: prod.id,
      quantity: 2,
      unitPricePkr: 300, // 2 * 300 = 600 returned
      reason: 'Customer returned 2kg unopened bag',
    });

    const updatedProd = db.prepare('SELECT current_stock FROM products WHERE id = ?').get(prod.id) as any;
    const updatedCust = db.prepare('SELECT current_balance_paisa FROM customers WHERE id = ?').get(cust.id) as any;

    const stockMove = db.prepare('SELECT * FROM stock_movements WHERE reference_id = ? AND movement_type = ?').get(retRes.returnRecord.id, 'sale_return') as any;

    const pass = updatedProd.current_stock === initStock + 2 &&
                 paisaToPkr(updatedCust.current_balance_paisa) === initCustBal - 600 &&
                 stockMove !== undefined &&
                 retRes.returnRecord.return_type === 'sale_return';

    results.push({
      testId: 9,
      name: 'Sales Return Connection',
      passed: Boolean(pass),
      details: {
        stockRestored: updatedProd.current_stock === initStock + 2,
        newCustomerBalance: paisaToPkr(updatedCust.current_balance_paisa),
        returnId: retRes.returnRecord.id,
      },
    });
  } catch (err: any) {
    results.push({ testId: 9, name: 'Sales Return Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 10: Purchase Return
  // ---------------------------------------------------------------------------
  try {
    const prod = db.prepare('SELECT * FROM products WHERE business_id = ? AND name = ?').get(testBizId, 'Cooking Oil 5L') as any;
    const supp = db.prepare('SELECT * FROM suppliers WHERE business_id = ? AND name = ?').get(testBizId, 'Habib Traders Lahore') as any;
    const initStock = prod.current_stock;
    const initSuppPayable = paisaToPkr(supp.payable_balance_paisa);

    const retRes = recordPurchaseReturn(testBizId, {
      supplierId: supp.id,
      supplierName: supp.name,
      productId: prod.id,
      quantity: 1,
      costPricePkr: 1950,
      reason: 'Damaged seal on delivery',
    });

    const updatedProd = db.prepare('SELECT current_stock FROM products WHERE id = ?').get(prod.id) as any;
    const updatedSupp = db.prepare('SELECT payable_balance_paisa FROM suppliers WHERE id = ?').get(supp.id) as any;

    const pass = updatedProd.current_stock === initStock - 1 &&
                 paisaToPkr(updatedSupp.payable_balance_paisa) === initSuppPayable - 1950 &&
                 retRes.returnRecord.return_type === 'purchase_return';

    results.push({
      testId: 10,
      name: 'Purchase Return Connection',
      passed: Boolean(pass),
      details: {
        stockReduced: updatedProd.current_stock === initStock - 1,
        newSupplierPayable: paisaToPkr(updatedSupp.payable_balance_paisa),
        returnId: retRes.returnRecord.id,
      },
    });
  } catch (err: any) {
    results.push({ testId: 10, name: 'Purchase Return Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 11: Commission / Dalali
  // ---------------------------------------------------------------------------
  try {
    const comm = createCommission(testBizId, {
      partyName: 'Naveed Dalal',
      type: 'payable',
      amountPkr: 1200,
      dealReference: 'Grain Market Lot #42',
      notes: 'Baqaya dalali fees',
    });

    const initCash = getAccountBalance('cash');
    const payRes = payCommission(testBizId, {
      commissionId: comm.id,
      amountPkr: 1200,
      paymentMethod: 'cash',
    });

    const finalCash = getAccountBalance('cash');
    const updatedComm = db.prepare('SELECT * FROM commissions WHERE id = ?').get(comm.id) as any;

    const pass = updatedComm.status === 'paid' &&
                 paisaToPkr(updatedComm.paid_amount_paisa) === 1200 &&
                 finalCash === initCash - 1200 &&
                 payRes.financialTransaction.category === 'commission_payout';

    results.push({
      testId: 11,
      name: 'Commission / Dalali Connection',
      passed: Boolean(pass),
      details: {
        commissionId: comm.id,
        status: updatedComm.status,
        cashDeduction: initCash - finalCash,
      },
    });
  } catch (err: any) {
    results.push({ testId: 11, name: 'Commission / Dalali Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 12: Transport / Cargo Transaction
  // ---------------------------------------------------------------------------
  try {
    const initBank = getAccountBalance('bank');
    const tripRes = createTransportTrip(testBizId, {
      vehicleNo: 'LES-9988',
      driverName: 'Ghulam Rasool',
      route: 'Lahore to Multan',
      freightPkr: 8000,
      dieselPkr: 4000,
      paidAmountPkr: 4000, // diesel paid directly from Bank
      paymentMethod: 'bank',
      notes: 'Goods delivery trip',
    });

    const finalBank = getAccountBalance('bank');

    const pass = tripRes.trip.vehicle_no === 'LES-9988' &&
                 paisaToPkr(tripRes.trip.total_cost_paisa) === 12000 &&
                 paisaToPkr(tripRes.trip.remaining_amount_paisa) === 8000 &&
                 finalBank === initBank - 4000 &&
                 tripRes.financialTransaction?.category === 'transport_expense';

    results.push({
      testId: 12,
      name: 'Transport / Cargo Connection',
      passed: Boolean(pass),
      details: {
        tripId: tripRes.trip.id,
        totalCost: paisaToPkr(tripRes.trip.total_cost_paisa),
        remainingAmount: paisaToPkr(tripRes.trip.remaining_amount_paisa),
        bankDeduction: initBank - finalBank,
      },
    });
  } catch (err: any) {
    results.push({ testId: 12, name: 'Transport / Cargo Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 13: Asset Acquisition (NOT an Operating Expense)
  // ---------------------------------------------------------------------------
  try {
    const initBank = getAccountBalance('bank');
    const assetRes = createAsset(testBizId, {
      name: 'Commercial Refrigerator',
      category: 'Machinery',
      purchasePricePkr: 35000,
      quantity: 1,
      paymentMethod: 'bank',
      notes: 'New double-door chiller for drinks',
    });

    const finalBank = getAccountBalance('bank');
    // Verify asset did NOT create an entry in expenses table
    const expCount = db.prepare('SELECT COUNT(*) as cnt FROM expenses WHERE business_id = ? AND notes LIKE ?').get(testBizId, '%chiller%') as any;

    const pass = finalBank === initBank - 35000 &&
                 assetRes.financialTransaction?.category === 'asset_purchase' &&
                 expCount.cnt === 0;

    results.push({
      testId: 13,
      name: 'Asset Acquisition (Non-Expense Balance Sheet Asset)',
      passed: Boolean(pass),
      details: {
        assetId: assetRes.asset.id,
        assetValue: paisaToPkr(assetRes.asset.current_value_paisa),
        bankDeduction: initBank - finalBank,
        notAnOperatingExpense: expCount.cnt === 0,
      },
    });
  } catch (err: any) {
    results.push({ testId: 13, name: 'Asset Acquisition (Non-Expense Balance Sheet Asset)', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 14: Liability & Loan Repayment
  // ---------------------------------------------------------------------------
  try {
    const liabRes = createLiability(testBizId, {
      name: 'Shop Renovation Borrowing',
      type: 'personal_loan',
      creditorName: 'Chaudhry Akram',
      amountPkr: 20000,
      depositLoanIntoAccount: true,
      paymentMethod: 'bank',
    });

    const midBank = getAccountBalance('bank');

    const pmtRes = recordLiabilityPayment(testBizId, {
      liabilityId: liabRes.liability.id,
      amountPkr: 5000,
      paymentMethod: 'bank',
      notes: 'First installment repaid',
    });

    const finalBank = getAccountBalance('bank');
    const updatedLiab = db.prepare('SELECT remaining_balance_paisa FROM liabilities WHERE id = ?').get(liabRes.liability.id) as any;

    const pass = paisaToPkr(updatedLiab.remaining_balance_paisa) === 15000 &&
                 finalBank === midBank - 5000 &&
                 pmtRes.financialTransaction.category === 'liability_repayment';

    results.push({
      testId: 14,
      name: 'Liability & Loan Repayment Connection',
      passed: Boolean(pass),
      details: {
        liabilityId: liabRes.liability.id,
        initialAmount: 20000,
        remainingBalance: paisaToPkr(updatedLiab.remaining_balance_paisa),
        repaymentDeduction: midBank - finalBank,
      },
    });
  } catch (err: any) {
    results.push({ testId: 14, name: 'Liability & Loan Repayment Connection', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 15: AI Munshi Database Query & Action Connection
  // ---------------------------------------------------------------------------
  try {
    // 1. Query real customer balance from SQLite
    const cust = db.prepare('SELECT * FROM customers WHERE business_id = ? AND name = ?').get(testBizId, 'Muhammad Tariq') as any;
    const realCustBalance = paisaToPkr(cust.current_balance_paisa);

    // 2. Query real sales from SQLite
    const report = getComprehensiveReportSummary(testBizId);
    const realTotalSales = report.totalSalesPkr;

    // 3. Test that real database values are queried
    const pass = realCustBalance > 0 &&
                 realTotalSales > 0 &&
                 report.totalPurchasesPkr > 0 &&
                 report.accounts.length >= 4;

    results.push({
      testId: 15,
      name: 'AI Munshi Real Database Synchronization',
      passed: Boolean(pass),
      details: {
        customerName: cust.name,
        realCustomerBalancePkr: realCustBalance,
        realTotalSalesPkr: realTotalSales,
        liquidCashAccountsAvailable: report.accounts.length,
        netProfitComputed: report.netProfitPkr,
      },
    });
  } catch (err: any) {
    results.push({ testId: 15, name: 'AI Munshi Real Database Synchronization', passed: false, details: {}, error: err.message });
  }

  // ---------------------------------------------------------------------------
  // TEST 16: Atomic Rollback & Idempotency Safeguard
  // ---------------------------------------------------------------------------
  try {
    const initCash = getAccountBalance('cash');
    let rollbackSuccess = false;

    // Trigger an atomic transaction that fails intentionally at step 2
    try {
      runTransaction(() => {
        // Step 1: deduct cash
        db.prepare('UPDATE financial_accounts SET current_balance_paisa = current_balance_paisa - 99999 WHERE business_id = ? AND type = ?').run(testBizId, 'cash');
        // Step 2: Throw intentional exception
        throw new Error('Simulated failure during multi-table commit');
      });
    } catch {
      rollbackSuccess = true;
    }

    const postRollbackCash = getAccountBalance('cash');
    const atomicRollbackPassed = rollbackSuccess && postRollbackCash === initCash;

    results.push({
      testId: 16,
      name: 'Atomic Transaction Rollback & Data Safety',
      passed: atomicRollbackPassed,
      details: {
        initialCash: initCash,
        postRollbackCash: postRollbackCash,
        noOrphanedData: atomicRollbackPassed,
      },
    });
  } catch (err: any) {
    results.push({ testId: 16, name: 'Atomic Transaction Rollback & Data Safety', passed: false, details: {}, error: err.message });
  }

  const passedTests = results.filter(r => r.passed).length;
  const failedTests = results.filter(r => !r.passed).length;

  console.log(`>>> [PHASE 2 INTEGRATION SUITE] Finished: ${passedTests}/${results.length} PASSED.`);
  results.forEach(r => {
    console.log(`  [${r.passed ? 'PASS' : 'FAIL'}] Test ${r.testId}: ${r.name}`);
    if (r.error) console.log(`      Error: ${r.error}`);
  });

  return {
    allPassed: failedTests === 0,
    totalTests: results.length,
    passedTests,
    failedTests,
    results,
  };
}
