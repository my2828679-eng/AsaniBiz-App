import React, { useState, useEffect, useRef } from 'react';
import {
  Receipt,
  Plus,
  Minus,
  Trash2,
  Printer,
  Share2,
  Search,
  CheckCircle2,
  User,
  CreditCard,
  Percent,
  X,
  Coins,
  Barcode,
  Briefcase,
  Mic,
  RotateCcw,
  Lock,
  Unlock,
  AlertTriangle,
  Scale,
  Sparkles,
  Layers,
  Banknote,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';
import { InvoiceItem, Invoice, Product, Customer } from '../types';
import { DailySummaryModal } from './pos/DailySummaryModal';
import { VoicePOSBar } from './pos/VoicePOSBar';
import { ThermalReceiptModal } from './pos/ThermalReceiptModal';
import { parseVoicePOSCommand } from '../utils/voicePOSParser';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

// High-demand top-selling Pakistani retail products for instant quick POS billing
const nowIso = new Date().toISOString();
const DEFAULT_TOP_SELLING_PRODUCTS: Product[] = [
  { id: 'top_1', name: 'متفرق سامان (General Item)', category: 'عام سودا', sellingPrice: 100, purchasePrice: 0, quantity: 999, unit: 'عدد', sku: 'TOP-01', lowStockThreshold: 5, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_2', name: 'دودھ تازہ (Fresh Milk)', category: 'ڈیری', sellingPrice: 210, purchasePrice: 180, quantity: 50, unit: 'کلو', sku: 'TOP-02', lowStockThreshold: 5, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_3', name: 'دہی خالص (Yogurt)', category: 'ڈیری', sellingPrice: 240, purchasePrice: 200, quantity: 30, unit: 'کلو', sku: 'TOP-03', lowStockThreshold: 5, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_4', name: 'چینی سفید (Sugar)', category: 'کریانہ', sellingPrice: 150, purchasePrice: 140, quantity: 100, unit: 'کلو', sku: 'TOP-04', lowStockThreshold: 10, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_5', name: 'چائے پتی پیکٹ (Tea)', category: 'کریانہ', sellingPrice: 260, purchasePrice: 230, quantity: 40, unit: 'پیکٹ', sku: 'TOP-05', lowStockThreshold: 5, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_6', name: 'کولڈ ڈرنک ریگولر (Cold Drink)', category: 'مشروبات', sellingPrice: 90, purchasePrice: 75, quantity: 60, unit: 'بوتل', sku: 'TOP-06', lowStockThreshold: 10, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_7', name: 'انڈے فارمی (Eggs Dozen)', category: 'پولٹری', sellingPrice: 320, purchasePrice: 290, quantity: 25, unit: 'درجن', sku: 'TOP-07', lowStockThreshold: 5, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_8', name: 'کوکنگ آئل / گھی (Oil 1L)', category: 'کریانہ', sellingPrice: 520, purchasePrice: 480, quantity: 45, unit: 'لٹر', sku: 'TOP-08', lowStockThreshold: 5, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_9', name: 'روٹی / خمیری نان (Roti)', category: 'بیکری', sellingPrice: 25, purchasePrice: 18, quantity: 120, unit: 'عدد', sku: 'TOP-09', lowStockThreshold: 10, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_10', name: 'بسکٹ / نمکو اسنیکس', category: 'بیکری', sellingPrice: 50, purchasePrice: 40, quantity: 80, unit: 'پیکٹ', sku: 'TOP-10', lowStockThreshold: 10, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_11', name: 'صابن / سرف (Soap)', category: 'جنرل', sellingPrice: 120, purchasePrice: 95, quantity: 70, unit: 'عدد', sku: 'TOP-11', lowStockThreshold: 10, createdAt: nowIso, updatedAt: nowIso },
  { id: 'top_12', name: 'دال چنا / مسور (Daal)', category: 'کریانہ', sellingPrice: 280, purchasePrice: 240, quantity: 55, unit: 'کلو', sku: 'TOP-12', lowStockThreshold: 10, createdAt: nowIso, updatedAt: nowIso },
];

export const BillingView: React.FC = () => {
  const {
    profile,
    products,
    customers,
    addCustomer,
    createInvoice,
    invoices,
    adjustStock,
    addProduct,
    pendingPOSSale,
    setPendingPOSSale,
  } = useBusiness();

  const lang = profile.preferredLanguage;
  const isRtl = lang !== 'en';

  // POS Operational States
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('walk-in');
  const [customCustomerName, setCustomCustomerName] = useState<string>('Walk-in Customer (عام گاہک)');
  const [customCustomerPhone, setCustomCustomerPhone] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'jazzcash' | 'easypaisa' | 'bank'>('cash');
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');

  // Quick Sale / Direct Amount Input States
  const [quickSaleAmount, setQuickSaleAmount] = useState<string>('');
  const [quickSaleTitle, setQuickSaleTitle] = useState<string>('');

  // Staff / Salesman Selection
  const [salesmen, setSalesmen] = useState<Array<{ id: string; name: string; role: string }>>([]);
  const [selectedSalesmanId, setSelectedSalesmanId] = useState<string>('');

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('All');

  // Modals & Drawers
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);
  const [isVoicePOSOpen, setIsVoicePOSOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isCounterLocked, setIsCounterLocked] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);

  // Safety & Mistake Protection Guards
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Auto-dismiss status feedback toast
  useEffect(() => {
    if (statusFeedback) {
      const timer = setTimeout(() => setStatusFeedback(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [statusFeedback]);

  // Check for pending POS sale from AI Munshi or voice commands
  useEffect(() => {
    if (pendingPOSSale) {
      if (pendingPOSSale.customerId) {
        setSelectedCustomerId(pendingPOSSale.customerId);
      }
      if (pendingPOSSale.customerName) {
        setCustomCustomerName(pendingPOSSale.customerName);
      }
      if (pendingPOSSale.customerPhone) {
        setCustomCustomerPhone(pendingPOSSale.customerPhone);
      }
      if (pendingPOSSale.items && pendingPOSSale.items.length > 0) {
        const invoiceItems: InvoiceItem[] = pendingPOSSale.items.map((it) => ({
          productId: it.productId,
          productName: it.productName,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          total: it.total,
          unit: it.unit || 'عدد',
        }));
        setItems(invoiceItems);
      }
      if (pendingPOSSale.notes) {
        setNotes(pendingPOSSale.notes);
      }
      setStatusFeedback({
        message: lang === 'ur' ? '✅ اے آئی منشی کی ہدایت پر بل کاؤنٹر میں لوڈ کر دیا گیا ہے' : '✅ Bill loaded into POS counter from AI Munshi',
        type: 'success',
      });
      // Clear pending so it doesn't re-trigger
      setPendingPOSSale(null);
    }
  }, [pendingPOSSale, lang, setPendingPOSSale]);

  // Fetch active salesmen / staff
  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.staff) {
          setSalesmen(data.staff.filter((s: any) => s.status === 'active'));
        }
      })
      .catch(() => {});
  }, []);

  // Direct Quick Sale / Custom Cash Item Add
  const handleQuickSaleAdd = (overrideAmt?: number, overrideTitle?: string) => {
    const amt = overrideAmt !== undefined ? overrideAmt : parseFloat(quickSaleAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setStatusFeedback({ message: 'برائے مہربانی درست رقم درج کریں', type: 'warning' });
      return;
    }

    const title = overrideTitle || quickSaleTitle.trim() || (productSearch.trim() ? productSearch.trim() : 'متفرق سودا (General Item)');

    const newItem: InvoiceItem = {
      productId: `quick_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productName: title,
      quantity: 1,
      unitPrice: Math.round(amt),
      purchasePrice: 0,
      total: Math.round(amt),
      unit: 'عدد',
    };

    setItems((prev) => [...prev, newItem]);
    setQuickSaleAmount('');
    setQuickSaleTitle('');
    if (productSearch.trim()) {
      setProductSearch('');
    }
    setStatusFeedback({
      message: `بل میں شامل کیا گیا: ${title} (Rs. ${Math.round(amt).toLocaleString()})`,
      type: 'success',
    });
  };

  // Determine active inventory pool: if shopkeeper has items, use products; otherwise use default top-selling products
  const activeProducts = products.length > 0 ? products : DEFAULT_TOP_SELLING_PRODUCTS;

  // Filter Categories
  const categories = ['All', ...Array.from(new Set(activeProducts.map((p) => p.category)))];

  // Business-Adaptive Common Units for Quick Filter
  const availableUnits = ['All', ...Array.from(new Set(activeProducts.map((p) => p.unit).filter(Boolean)))];

  // Multilingual Search Filter
  const filteredProducts = activeProducts.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchUnit = selectedUnitFilter === 'All' || p.unit === selectedUnitFilter;

    const term = productSearch.toLowerCase().trim();
    if (!term) return matchCat && matchUnit;

    const matchSearch =
      p.name.toLowerCase().includes(term) ||
      (p.barcode && p.barcode.toLowerCase().includes(term)) ||
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);

    return matchCat && matchUnit && matchSearch;
  });

  // Barcode Hardware Scanner & Quick Cash Enter-Key Handler
  const handleBarcodeSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && productSearch.trim()) {
      e.preventDefault();
      const term = productSearch.trim().toLowerCase();
      const exactMatch = activeProducts.find(
        (p) =>
          (p.barcode && p.barcode.toLowerCase() === term) ||
          p.sku.toLowerCase() === term ||
          p.name.toLowerCase() === term
      );
      if (exactMatch) {
        addItemToBill(exactMatch, 1);
        setProductSearch('');
        setStatusFeedback({ message: `شامل کیا گیا: ${exactMatch.name}`, type: 'success' });
      } else {
        // If user entered a direct number e.g. "250", treat as instant quick cash sale!
        const parsedNum = parseFloat(term);
        if (!isNaN(parsedNum) && parsedNum > 0) {
          handleQuickSaleAdd(parsedNum, 'متفرق سامان');
        }
      }
    }
  };

  /**
   * Add Item to Bill (with default selling price)
   */
  const addItemToBill = (product: Product, quantity = 1, customUnit?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: nextQty,
                total: Math.round(nextQty * item.unitPrice),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          unitPrice: product.sellingPrice,
          purchasePrice: product.purchasePrice || 0,
          total: Math.round(quantity * product.sellingPrice),
          unit: customUnit || product.unit || 'یونٹ',
        },
      ];
    });
  };

  /**
   * Update Item Quantity
   */
  const updateItemQty = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = Math.max(0.1, Number((item.quantity + delta).toFixed(2)));
            return {
              ...item,
              quantity: nextQty,
              total: Math.round(nextQty * item.unitPrice),
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  /**
   * Set Absolute Quantity
   */
  const setItemExactQty = (productId: string, newQty: number) => {
    if (newQty <= 0) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: newQty,
            total: Math.round(newQty * item.unitPrice),
          };
        }
        return item;
      })
    );
  };

  /**
   * Smart Price Override:
   * Temporarily adjusts rate for this sale without touching product master!
   */
  const updateItemPrice = (productId: string, newRate: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const rate = Math.max(0, newRate);
          return {
            ...item,
            unitPrice: rate,
            total: Math.round(item.quantity * rate),
          };
        }
        return item;
      })
    );
  };

  /**
   * Change Unit for Item
   */
  const updateItemUnit = (productId: string, newUnit: string) => {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, unit: newUnit } : item))
    );
  };

  /**
   * Remove Item
   */
  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  /**
   * Repeat Last Sale:
   * Retrieves previous invoice, validates all items against current product master,
   * recalculates prices and loads into cart for shopkeeper verification.
   */
  const handleRepeatLastSale = () => {
    if (invoices.length === 0) {
      setStatusFeedback({ message: 'پہلے سے کوئی سیل موجود نہیں ہے!', type: 'warning' });
      return;
    }

    const lastInv = invoices[0];
    if (!lastInv.items || lastInv.items.length === 0) {
      setStatusFeedback({ message: 'پچھلے بل میں کوئی آئٹم نہیں ملا!', type: 'warning' });
      return;
    }

    const validatedItems: InvoiceItem[] = [];
    let outOfStockWarnings = 0;

    for (const it of lastInv.items) {
      const liveProd = products.find((p) => p.id === it.productId);
      if (liveProd) {
        if (liveProd.quantity < it.quantity) {
          outOfStockWarnings++;
        }
        validatedItems.push({
          productId: liveProd.id,
          productName: liveProd.name,
          quantity: it.quantity,
          unitPrice: liveProd.sellingPrice, // Uses active catalog rate
          purchasePrice: liveProd.purchasePrice || 0,
          total: Math.round(it.quantity * liveProd.sellingPrice),
          unit: it.unit || liveProd.unit || 'یونٹ',
        });
      }
    }

    if (validatedItems.length === 0) {
      setStatusFeedback({ message: 'پچھلے بل کے پراڈکٹس اب دستیاب نہیں ہیں!', type: 'warning' });
      return;
    }

    setItems(validatedItems);
    setDiscount(lastInv.discount || 0);
    setTax(lastInv.tax || 0);
    setPaymentMethod(lastInv.paymentMethod || 'cash');

    if (lastInv.customerId) {
      const cust = customers.find((c) => c.id === lastInv.customerId);
      if (cust) {
        setSelectedCustomerId(cust.id);
        setCustomCustomerName(cust.name);
        setCustomCustomerPhone(cust.phone || '');
      }
    }

    setStatusFeedback({
      message: `پچھلی سیل کامیابی سے دہرائی گئی (${validatedItems.length} آئٹمز لوڈ ہو گئے)${
        outOfStockWarnings > 0 ? ' — بعض آئٹمز کا اسٹاک کم ہے!' : ''
      }`,
      type: outOfStockWarnings > 0 ? 'warning' : 'success',
    });
  };

  /**
   * Reset Bill Cart
   */
  const handleClearCart = () => {
    setItems([]);
    setDiscount(0);
    setTax(0);
    setPaidAmount(null);
    setNotes('');
    setIsConfirmClearOpen(false);
    setStatusFeedback({ message: 'بل کامیابی سے خالی کر دیا گیا', type: 'info' });
  };

  // Financial Calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalAmount = Math.max(0, subtotal - discount + tax);
  const actualPaidAmount =
    paidAmount !== null ? paidAmount : paymentMethod === 'credit' ? 0 : totalAmount;
  const balanceDue = Math.max(0, totalAmount - actualPaidAmount);

  /**
   * Customer Selection Handler
   */
  const handleSelectCustomer = (cid: string) => {
    setSelectedCustomerId(cid);
    if (cid === 'walk-in') {
      setCustomCustomerName('Walk-in Customer (عام گاہک)');
      setCustomCustomerPhone('');
    } else {
      const found = customers.find((c) => c.id === cid);
      if (found) {
        setCustomCustomerName(found.name);
        setCustomCustomerPhone(found.phone || '');
      }
    }
  };

  /**
   * Complete Sale Transaction:
   * Ensures atomic execution, prevents double clicks, validates Udhaar customer constraint.
   */
  const executeCompleteSale = async (forcePaymentMethod?: 'cash' | 'credit') => {
    if (items.length === 0) {
      setStatusFeedback({ message: 'بل میں کم از کم ایک پروڈکٹ شامل کریں!', type: 'warning' });
      return;
    }

    if (isSubmitting) return; // Anti-duplicate double click protection

    const effectiveMethod = forcePaymentMethod || paymentMethod;

    // Udhaar / Credit requires a customer (walk-in cannot take udhaar)
    if (effectiveMethod === 'credit') {
      if (!selectedCustomerId || selectedCustomerId === 'walk-in') {
        setStatusFeedback({
          message: 'ادھار / کھاتہ سیل کے لیے گاہک منتخب کرنا لازمی ہے!',
          type: 'warning',
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let custId = selectedCustomerId === 'walk-in' ? undefined : selectedCustomerId;
      if (!custId && customCustomerName && customCustomerName !== 'Walk-in Customer (عام گاہک)') {
        const newC = addCustomer({
          name: customCustomerName,
          phone: customCustomerPhone || '0300-0000000',
          openingBalance: 0,
          notes: 'Created during POS billing',
        });
        custId = newC.id;
      }

      const selectedSalesman = salesmen.find((s) => s.id === selectedSalesmanId);
      const invoiceNotes = [
        notes,
        selectedSalesman ? `Salesman: ${selectedSalesman.name}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const finalPaid =
        effectiveMethod === 'credit'
          ? 0
          : forcePaymentMethod === 'cash'
          ? totalAmount
          : actualPaidAmount;

      const finalBalance = Math.max(0, totalAmount - finalPaid);

      // Create invoice in core context (updates stock, customer khata, cash/bank records, audit log)
      const newInv = createInvoice({
        customerId: custId,
        customerName: customCustomerName || 'Walk-in Customer',
        customerPhone: customCustomerPhone,
        items,
        subtotal,
        discount,
        tax,
        totalAmount,
        paidAmount: finalPaid,
        paymentMethod: effectiveMethod,
        paymentStatus: finalBalance === 0 ? 'paid' : finalPaid === 0 ? 'unpaid' : 'partial',
        notes: invoiceNotes,
      });

      // Also dispatch to backend server API if online for SQLite synchronization
      try {
        fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: custId,
            customerName: customCustomerName || 'Walk-in Customer',
            customerPhone: customCustomerPhone,
            salesmanId: selectedSalesmanId || undefined,
            salesmanName: selectedSalesman?.name,
            items: items.map((it) => ({
              productId: it.productId,
              productName: it.productName,
              quantity: it.quantity,
              unitPricePkr: it.unitPrice,
              purchasePricePkr: it.purchasePrice,
              unit: it.unit,
            })),
            discountPkr: discount,
            taxPkr: tax,
            paidAmountPkr: finalPaid,
            paymentMethod: effectiveMethod,
            notes: invoiceNotes,
          }),
        }).catch(() => {});
      } catch (err) {
        // Fallback gracefully to offline client state
      }

      // Open Thermal Receipt modal
      setCompletedInvoice(newInv);

      // Reset Bill Form for next customer
      setItems([]);
      setDiscount(0);
      setTax(0);
      setPaidAmount(null);
      setNotes('');
      setSelectedCustomerId('walk-in');
      setCustomCustomerName('Walk-in Customer (عام گاہک)');
      setCustomCustomerPhone('');

      setStatusFeedback({
        message: `سیل بل #${newInv.invoiceNumber} کامیابی سے مکمل ہو گیا!`,
        type: 'success',
      });
    } catch (error: any) {
      console.error('POS Sale Error:', error);
      setStatusFeedback({
        message: error.message || 'سیل محفوظ کرتے ہوئے خرابی پیش آئی',
        type: 'warning',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * One-Tap Fast Cash Sale:
   * 1-Click checkout with exact cash, no customer required!
   */
  const handleOneTapFastCash = () => {
    executeCompleteSale('cash');
  };

  /**
   * Direct Voice Assistant for AsaniBiz Counter
   */
  const handleDirectSpeechResult = (spokenText: string) => {
    if (!spokenText || !spokenText.trim()) return;

    const result = parseVoicePOSCommand(spokenText, products, customers);
    setStatusFeedback({
      message: result.feedback,
      type: result.feedbackType,
    });

    if (result.action === 'checkout_cash') {
      setPaymentMethod('cash');
      setTimeout(() => {
        handleOneTapFastCash();
      }, 600);
    } else if (result.action === 'set_payment_credit') {
      setPaymentMethod('credit');
    } else if (result.action === 'select_customer' && result.customer) {
      handleSelectCustomer(result.customer.id);
    } else if (result.action === 'add_product' && result.product && result.quantity) {
      addItemToBill(result.product, result.quantity, result.unit);
    }
  };

  const {
    isListening: isDirectVoiceListening,
    supported: isVoiceSupported,
    permissionDenied: isMicPermissionDenied,
    permissionMessage: micPermissionMessage,
    startListening: startDirectVoiceListening,
    stopListening: stopDirectVoiceListening,
    transcript: directVoiceTranscript,
    clearError: clearVoiceError,
  } = useVoiceAssistant(lang, handleDirectSpeechResult);

  const handleToggleVoiceMic = async () => {
    if (isDirectVoiceListening) {
      stopDirectVoiceListening();
    } else {
      clearVoiceError();
      await startDirectVoiceListening();
    }
  };

  return (
    <div
      id="counter-pos-view-container"
      className="space-y-4 text-start font-arabic max-w-[1600px] mx-auto pb-12 bg-slate-50/70 p-2.5 sm:p-4 rounded-3xl border border-slate-200/80"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Counter Lock Screen Overlay */}
      {isCounterLocked && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center ring-8 ring-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white font-arabic">
              کاؤنٹر حفاظتی لاک ہے (Counter Locked)
            </h3>
            <p className="text-xs text-slate-400 font-arabic">
              دکان دار کے واپس آنے تک کاؤنٹر محفوظ ہے۔ ان لاک کرنے کے لیے نیچے ٹیپ کریں۔
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCounterLocked(false)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer font-arabic"
          >
            <Unlock className="w-4 h-4" />
            <span>کاؤنٹر ان لاک کریں (Unlock)</span>
          </button>
        </div>
      )}

      {/* Floating Status Notification Toast */}
      {statusFeedback && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold font-arabic transition-all animate-bounce ${
            statusFeedback.type === 'success'
              ? 'bg-emerald-800 text-white'
              : statusFeedback.type === 'warning'
              ? 'bg-amber-800 text-white'
              : 'bg-slate-900 text-white'
          }`}
        >
          {statusFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-300" />
          )}
          <span>{statusFeedback.message}</span>
        </div>
      )}

      {/* Top Prominent Counter Command Bar with Centered Voice Mic */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left: Counter Heading & Shop Info */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="p-3 bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl shadow-md shadow-emerald-800/20 shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-arabic tracking-tight">
                    کاؤنٹر <span className="text-sm sm:text-base font-bold text-emerald-700 font-sans">(Counter)</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300/80 font-arabic">
                    کاؤنٹر فعال ہے
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-arabic mt-0.5">
                  {profile.businessName} • روزانہ تیز رفتار سیل، نقد و ادھار کاؤنٹر
                </p>
              </div>
            </div>

            {/* Mobile Utility Actions (Summary & Lock) */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsDailySummaryOpen(true)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-black text-white cursor-pointer shadow-xs min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="روزانہ سمری"
              >
                <Coins className="w-4.5 h-4.5 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => setIsCounterLocked(true)}
                className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="کاؤنٹر لاک"
              >
                <Lock className="w-4.5 h-4.5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Center: Prominent VIP Voice Mic Button */}
          <div className="flex flex-col items-center justify-center w-full md:w-auto my-1 md:my-0">
            <button
              type="button"
              id="counter-voice-mic-main"
              onClick={handleToggleVoiceMic}
              className={`group relative flex items-center justify-center gap-3.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold font-arabic shadow-md transition-all duration-200 cursor-pointer active:scale-95 ${
                isDirectVoiceListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300/60 shadow-rose-300 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white ring-2 ring-emerald-500/30 hover:shadow-lg shadow-emerald-900/20'
              }`}
              title="مائیک دبائیں اور بول کر بل بنائیں (مثلاً: 2 کلو چینی، 1 کوک)"
            >
              <div
                className={`p-2 sm:p-2.5 rounded-xl ${
                  isDirectVoiceListening ? 'bg-white/25 animate-spin' : 'bg-white/20'
                }`}
              >
                <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-base sm:text-lg font-black leading-tight tracking-tight">
                  {isDirectVoiceListening ? 'مائیک سن رہا ہے... اب بولیں' : 'بول کر بل بنائیں'}
                </span>
                <span className="text-[11px] sm:text-xs text-emerald-100 font-medium leading-none opacity-95">
                  {isDirectVoiceListening ? 'ٹیپ کر کے مکمل کریں' : 'وائس کاؤنٹر (Voice Mic)'}
                </span>
              </div>
              {isDirectVoiceListening && (
                <span className="flex h-3.5 w-3.5 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
                </span>
              )}
            </button>
          </div>

          {/* Right: Clean, Focused Daily Utility Actions (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Daily Shift Summary Button */}
            <button
              type="button"
              onClick={() => setIsDailySummaryOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-arabic shadow-xs"
              title="روزانہ سیل سمری"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>روزانہ سمری</span>
            </button>

            {/* Repeat Last Sale Button */}
            <button
              type="button"
              onClick={handleRepeatLastSale}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-arabic"
              title="پچھلی سیل دہرائیں"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              <span>پچھلی سیل</span>
            </button>

            {/* Voice Command Guide */}
            <button
              type="button"
              onClick={() => setIsVoicePOSOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer font-arabic"
              title="وائس کمانڈ گائیڈ"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>گائیڈ</span>
            </button>

            {/* Counter Lock Button */}
            <button
              type="button"
              onClick={() => setIsCounterLocked(true)}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer"
              title="کاؤنٹر لاک کریں"
            >
              <Lock className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Live Listening Banner with Wave & Real-time Transcript */}
        {isDirectVoiceListening && (
          <div className="p-2.5 sm:p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-xs font-arabic animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <p className="font-bold text-emerald-950">
                سن رہا ہے... بولیں: <span className="font-mono text-emerald-800">"2 کلو چینی"</span>، <span className="font-mono text-emerald-800">"کوک دو بوتل"</span>، یا <span className="font-mono text-emerald-800">"سیل کیش میں کرو"</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {directVoiceTranscript && (
                <span className="px-2.5 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-800 font-mono text-xs max-w-[260px] truncate shadow-2xs">
                  "{directVoiceTranscript}"
                </span>
              )}
              <button
                type="button"
                onClick={stopDirectVoiceListening}
                className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-black shrink-0"
              >
                مکمل (Done)
              </button>
            </div>
          </div>
        )}

        {/* Permission Denied Localized Warning Banner */}
        {isMicPermissionDenied && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-arabic text-rose-800 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>مائیکروفون کی اجازت درکار ہے (Microphone Permission Required)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-700">
              {micPermissionMessage || 'مائیکروفون کی اجازت نہیں ملی۔ آواز سے بل بنانے کے لیے براؤزر ایڈریس بار کے تالا (🔒) آئیکن پر کلک کریں اور مائیکروفون Allow کریں۔'}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={async () => {
                  clearVoiceError();
                  await startDirectVoiceListening();
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold font-arabic cursor-pointer transition-colors"
              >
                اجازت دوبارہ چیک کریں (Retry)
              </button>
              <button
                type="button"
                onClick={clearVoiceError}
                className="px-2.5 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-arabic cursor-pointer"
              >
                بند کریں
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column POS Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column (7 Cols): Search, Quick Sale / Direct Amount & Fast Product Tap Grid */}
        <div className="lg:col-span-7 space-y-2.5">
          {/* Search & Filter Header */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onKeyDown={handleBarcodeSearchKeyDown}
                placeholder="آئٹم تلاش کریں، بارکوڈ اسکین کریں یا رقم لکھ کر Enter دبائیں..."
                className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic bg-slate-50/50"
              />
              <span className="absolute right-2 top-1.5 text-[10px] bg-slate-200 text-slate-600 font-mono px-2 py-1 rounded-lg border border-slate-300">
                Barcode ⏎
              </span>
            </div>

            {/* Category Filter Pills / Quick-Add Categories */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-bold transition-all cursor-pointer font-arabic ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'تمام کیٹیگریز' : cat}
                </button>
              ))}
            </div>

            {/* Business-Adaptive Quick Unit Filter / Weight Shortcuts (Mandi / Kiryana) */}
            {availableUnits.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 text-[11px] font-arabic border-t border-slate-100">
                <span className="text-slate-400 shrink-0 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-slate-500" />
                  اکائی:
                </span>
                {availableUnits.map((u) => (
                  <button
                    key={u}
                    onClick={() => setSelectedUnitFilter(u)}
                    className={`px-2 py-0.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                      selectedUnitFilter === u
                        ? 'bg-slate-800 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {u === 'All' ? 'سب اکائیاں' : u}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Sale / Direct Amount Input Panel (Custom amount / Unlisted items / Quick Cash) */}
          <div className="bg-gradient-to-br from-[#052e16] via-[#0a3d20] to-[#0f172a] text-white p-3 sm:p-3.5 rounded-2xl border border-[#d4af37]/35 shadow-md space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-slate-950 flex items-center justify-center font-black shadow-xs">
                  <Zap className="w-4 h-4 text-[#052e16] stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#d4af37] font-arabic flex items-center gap-1.5 leading-tight">
                    <span>فوری نقد رقم سیل (Direct Cash Entry)</span>
                    <span className="text-[9px] font-sans font-extrabold px-1.5 py-0.2 bg-[#0f172a] text-[#d4af37] rounded border border-[#d4af37]/40">
                      QUICK SALE
                    </span>
                  </h3>
                  <p className="text-[10px] text-emerald-200/80 font-arabic">
                    بغیر انوینٹری آئٹم کی براہِ راست قیمت درج کریں یا نیچے فوری رقم کا بٹن دبائیں
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Amount Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
              {/* Amount Input */}
              <div className="sm:col-span-5 relative">
                <span className="absolute left-2.5 top-2 text-xs font-black text-[#d4af37] font-mono">
                  Rs.
                </span>
                <input
                  type="number"
                  min="1"
                  value={quickSaleAmount}
                  onChange={(e) => setQuickSaleAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickSaleAdd();
                  }}
                  placeholder="رقم (مثلاً: 250)"
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm font-black font-mono bg-slate-950/90 text-white border border-[#d4af37]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] placeholder:text-slate-500 placeholder:font-arabic placeholder:text-xs"
                />
              </div>

              {/* Optional Item Name */}
              <div className="sm:col-span-4 relative">
                <input
                  type="text"
                  value={quickSaleTitle}
                  onChange={(e) => setQuickSaleTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickSaleAdd();
                  }}
                  placeholder="نام / تفصیل (اختیاری)"
                  className="w-full px-2.5 py-1.5 text-xs font-arabic bg-slate-950/90 text-white border border-emerald-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-500"
                />
              </div>

              {/* Add Button */}
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={() => handleQuickSaleAdd()}
                  className="w-full py-1.5 px-3 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] hover:from-[#c59e2b] hover:to-[#966d0c] text-[#052e16] font-black text-xs rounded-xl shadow-md border border-[#f3e5ab]/50 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 font-arabic whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 text-[#052e16] stroke-[3]" />
                  <span>بل میں شامل</span>
                </button>
              </div>
            </div>

            {/* Big Easy-To-Tap Number Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <span className="text-[10px] text-emerald-300 font-bold font-arabic shrink-0">فوری رقم بٹن:</span>
              {[50, 100, 200, 300, 500, 1000, 2000, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickSaleAdd(preset)}
                  className="px-2.5 py-1 bg-[#0f172a] hover:bg-[#052e16] hover:border-[#d4af37] border border-emerald-500/30 rounded-lg text-[#d4af37] text-xs font-mono font-black shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
                  title={`Rs. ${preset} فوری بل میں شامل کریں`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid / List Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-800 font-arabic flex items-center gap-1.5">
              <span>{products.length > 0 ? 'پروڈکٹس لسٹ' : 'سب سے زیادہ بکنے والے پروڈکٹس (Top Selling)'}</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold font-mono px-2 py-0.2 rounded-full border border-emerald-200">
                {filteredProducts.length}
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-arabic">1-ٹیپ سے بل میں شامل کریں</span>
          </div>

          {/* Touch-Friendly Product Tap Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              /* If search term doesn't match, instead of empty dashed box, offer instant custom add */
              <div className="col-span-full bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-start shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 font-arabic">
                      "{productSearch}" انوینٹری میں موجود نہیں
                    </div>
                    <div className="text-[11px] text-slate-600 font-arabic">
                      اسے کسٹم قیمت کے ساتھ فوری طور پر بل میں شامل کریں:
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-28">
                    <span className="absolute left-2 top-1.5 text-xs font-bold text-slate-400 font-mono">Rs</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="قیمت"
                      value={quickSaleAmount}
                      onChange={(e) => setQuickSaleAmount(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuickSaleAdd(undefined, productSearch);
                      }}
                      className="w-full pl-7 pr-2 py-1 text-xs font-bold font-mono border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickSaleAdd(undefined, productSearch)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 cursor-pointer font-arabic whitespace-nowrap active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>شامل کریں</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductSearch('')}
                    className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg cursor-pointer font-arabic whitespace-nowrap"
                  >
                    صاف کریں
                  </button>
                </div>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isOutOfStock = p.quantity <= 0;
                const isLowStock = p.quantity > 0 && p.quantity <= (p.lowStockThreshold || 5);
                const inCartItem = items.find((it) => it.productId === p.id);

                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-2xl border transition-all text-start flex flex-col justify-between p-3 relative group shadow-2xs hover:shadow-md ${
                      inCartItem
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    {/* Active Cart Counter Badge if added */}
                    {inCartItem && (
                      <span className="absolute -top-2 -right-2 bg-emerald-700 text-white text-[11px] font-mono font-black w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                        {inCartItem.quantity}
                      </span>
                    )}

                    {/* Product Meta */}
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 font-arabic group-hover:text-emerald-800">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>{p.category}</span>
                        {p.barcode && <span className="font-mono text-[9px]">{p.barcode}</span>}
                      </div>
                    </div>

                    {/* Price, Stock & Quick Tap Button */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div>
                        <div className="text-xs sm:text-sm font-black text-emerald-800 font-mono">
                          Rs. {p.sellingPrice}
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono inline-block ${
                            isOutOfStock
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isLowStock
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.quantity} {p.unit}
                        </span>
                      </div>

                      {/* Tap to Add to Cart */}
                      <button
                        type="button"
                        onClick={() => addItemToBill(p, 1)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer font-arabic flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>سیل</span>
                      </button>
                    </div>

                    {/* Fast Weight Shortcut (e.g. for Mandi / Kiryana / Meat: 0.5kg, 1kg, 5kg, 40kg) */}
                    {p.unit === 'کلو' && (
                      <div className="flex gap-1 pt-2 mt-1 border-t border-slate-100/80 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => addItemToBill(p, 0.5)}
                          className="flex-1 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                          title="آدھا کلو شامل کریں"
                        >
                          0.5k
                        </button>
                        <button
                          type="button"
                          onClick={() => addItemToBill(p, 2)}
                          className="flex-1 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                          title="2 کلو شامل کریں"
                        >
                          2k
                        </button>
                        <button
                          type="button"
                          onClick={() => addItemToBill(p, 5)}
                          className="flex-1 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                          title="5 کلو شامل کریں"
                        >
                          5k
                        </button>
                        <button
                          type="button"
                          onClick={() => addItemToBill(p, 40, 'من')}
                          className="flex-1 py-0.5 bg-emerald-50 hover:bg-emerald-100 rounded text-emerald-800 font-bold"
                          title="1 من (40 کلو) شامل کریں"
                        >
                          1من
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (5 Cols): Active Bill Cart, Compact Customer Bar & Fast Checkout */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-3.5 flex flex-col justify-between space-y-2.5">
          <div className="space-y-2.5">
            {/* Compact Customer & Staff Picker Bar */}
            <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
              {/* Customer Row */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 font-arabic">
                    <User className="w-3 h-3 text-emerald-700" />
                    <span>گاہک منتخب کریں:</span>
                  </label>
                  <span className="text-[9px] text-slate-400 font-arabic">نقد کیلئے اختیاری</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-arabic border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  >
                    <option value="walk-in">عام گاہک (Walk-in)</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.currentBalance > 0 ? `(ادھار: Rs. ${c.currentBalance})` : ''}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={customCustomerPhone}
                    onChange={(e) => setCustomCustomerPhone(e.target.value)}
                    placeholder="فون نمبر (0300...)"
                    className="w-full px-2 py-1 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Staff / Salesman Attribution (if configured) */}
              {salesmen.length > 0 && (
                <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-600 shrink-0 font-arabic flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-purple-600" />
                    سیلزمین:
                  </span>
                  <select
                    value={selectedSalesmanId}
                    onChange={(e) => setSelectedSalesmanId(e.target.value)}
                    className="flex-1 px-2 py-0.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 font-arabic"
                  >
                    <option value="">دکان دار خود (Direct Shop Sale)</option>
                    {salesmen.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Cart Header & Clear Cart Protection */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-800 font-arabic">
                  موجودہ بل کی اشیاء ({items.length})
                </span>
                {items.length > 0 && (
                  <span className="text-[11px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Rs. {subtotal}
                  </span>
                )}
              </div>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsConfirmClearOpen(true)}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-arabic"
                  title="بل خالی کریں"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>بل خالی کریں</span>
                </button>
              )}
            </div>

            {/* Items List in Cart - Compact and Clean */}
            {items.length === 0 ? (
              <div className="py-7 text-center text-slate-400 space-y-1.5 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Receipt className="w-6 h-6 mx-auto text-emerald-700/40" />
                <p className="text-xs font-bold font-arabic text-slate-600">
                  بل ابھی خالی ہے
                </p>
                <p className="text-[10px] text-slate-400 font-arabic">
                  بائیں جانب سے پروڈکٹ ٹیپ کریں، فوری رقم درج کریں، یا مائیک دبائیں
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => {
                  const masterProd = products.find((p) => p.id === item.productId);
                  const isPriceOverridden =
                    masterProd && item.unitPrice !== masterProd.sellingPrice;
                  const isExceedingStock =
                    masterProd && item.quantity > masterProd.quantity;

                  return (
                    <div
                      key={item.productId}
                      className={`p-2.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                        isExceedingStock
                          ? 'bg-amber-50/70 border-amber-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {/* Product Name & Remove button */}
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <span className="font-black text-slate-900 font-arabic truncate block">
                            {item.productName}
                          </span>
                          {isExceedingStock && (
                            <span className="text-[10px] text-amber-700 font-bold font-arabic flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              اسٹاک سے زیادہ! (موجودہ اسٹاک: {masterProd?.quantity})
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                          title="بل سے نکالیں"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Controls Row: Qty, Unit, Smart Rate Override, Total */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        {/* Qty Stepper */}
                        <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-slate-300 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateItemQty(item.productId, -1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            step="any"
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) =>
                              setItemExactQty(item.productId, parseFloat(e.target.value) || 1)
                            }
                            className="w-10 text-center font-bold font-mono text-slate-900 border-none outline-none p-0 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => updateItemQty(item.productId, 1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Smart Price Override Input with Badge */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-500 font-arabic">ریٹ:</span>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItemPrice(item.productId, Number(e.target.value))
                              }
                              className={`w-16 px-1.5 py-0.5 text-xs font-mono font-bold border rounded-md text-slate-900 bg-white ${
                                isPriceOverridden
                                  ? 'border-amber-400 bg-amber-50/50'
                                  : 'border-slate-300'
                              }`}
                              title="عارضی سیل ریٹ (صرف اس بل کے لیے)"
                            />
                            {isPriceOverridden && (
                              <span className="absolute -bottom-3 right-0 text-[8px] font-bold text-amber-700 bg-amber-100 px-1 rounded font-arabic">
                                عارضی
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-arabic">
                            / {item.unit}
                          </span>
                        </div>

                        {/* Line Total */}
                        <div className="font-mono font-black text-slate-900 text-xs shrink-0">
                          Rs. {item.total}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout, Payment Methods & Fast 1-Click Cash Action */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            {/* Discount & Payment Mode Selection */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-600 font-arabic mb-0.5 block">
                  رعایت (Discount Rs):
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2 py-1 border border-slate-300 rounded-xl font-mono text-xs focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 font-arabic mb-0.5 block">
                  ادائیگی کا طریقہ:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-2 py-1 border border-slate-300 rounded-xl text-xs bg-white font-arabic focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800"
                >
                  <option value="cash">نقد کیش (Cash)</option>
                  <option value="credit">ادھار کھاتہ (Udhaar)</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="easypaisa">Easypaisa</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Quick Cash Tender Shortcuts */}
            {paymentMethod === 'cash' && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-bold font-arabic">فوری رقم:</span>
                <button
                  type="button"
                  onClick={() => setPaidAmount(totalAmount)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-black border border-emerald-300/90 cursor-pointer font-arabic transition-colors"
                >
                  برابر
                </button>
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPaidAmount(amt)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 cursor-pointer font-mono transition-colors"
                  >
                    {amt}
                  </button>
                ))}
              </div>
            )}

            {/* Udhaar (Credit) Subtle Accent Notice */}
            {paymentMethod === 'credit' && (
              <div className="bg-amber-50/90 border border-amber-300/80 rounded-xl p-2.5 text-xs text-amber-900 font-arabic flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-bold truncate">یہ رقم منتخب گاہک کے ادھار کھاتے میں شامل ہوگی</span>
                </div>
                <span className="font-mono font-black text-amber-900 shrink-0">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            )}

            {/* Grand Total Display - Strong Visual Emphasis */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-50/30 p-3.5 sm:p-4 rounded-2xl border border-emerald-300/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-arabic">
                <span>سب ٹوٹل (Subtotal):</span>
                <span className="font-mono font-bold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold font-arabic">
                  <span>رعایت (Discount):</span>
                  <span className="font-mono font-bold">- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2 border-t border-emerald-200/90">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-black text-slate-900 font-arabic">کل قابلِ ادا رقم:</span>
                  <span className="text-[10px] text-emerald-800/80 font-sans uppercase tracking-wider font-bold">Total Bill</span>
                </div>
                <div className="text-end">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono tracking-tight">
                    <span className="text-sm sm:text-base font-bold text-emerald-700 mr-1 font-sans">Rs.</span>
                    {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Baqaya / Udhaar Preview */}
              {balanceDue > 0 && (
                <div className="flex items-center justify-between text-xs font-black text-rose-700 pt-1.5 border-t border-dashed border-rose-300 font-arabic">
                  <span>بقایا رقم (ادھار کھاتے میں درج ہوگی):</span>
                  <span className="font-mono text-sm">Rs. {balanceDue.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* FAST CHECKOUT ACTION BUTTONS */}
            <div className="space-y-2.5">
              {/* PRIMARY VIP 1-CLICK CASH SALE BUTTON */}
              <button
                type="button"
                id="pos-one-tap-cash-btn"
                disabled={items.length === 0 || isSubmitting}
                onClick={handleOneTapFastCash}
                className="w-full py-3.5 sm:py-4 px-4 sm:px-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm sm:text-base shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer font-arabic active:scale-[0.99]"
              >
                <Zap className="w-5 h-5 text-amber-300 shrink-0" />
                <span>
                  {isSubmitting
                    ? 'سیل محفوظ ہو رہی ہے...'
                    : `فوری نقد سیل فائنل (1-Click Cash Sale • Rs. ${totalAmount.toLocaleString()})`}
                </span>
              </button>

              {/* SECONDARY BUTTON: Udhaar (Credit) with Subtle Accent Treatment */}
              {paymentMethod === 'credit' && (
                <button
                  type="button"
                  id="pos-credit-sale-btn"
                  disabled={items.length === 0 || isSubmitting}
                  onClick={() => executeCompleteSale('credit')}
                  className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-arabic active:scale-[0.99]"
                >
                  <BookOpen className="w-4.5 h-4.5 text-amber-200" />
                  <span>ادھار کھاتہ سیل درج کریں (Save to Khata • Rs. {totalAmount.toLocaleString()})</span>
                </button>
              )}

              {/* Standard Checkout with Slip Modal for Digital Wallets / Bank */}
              {paymentMethod !== 'cash' && paymentMethod !== 'credit' && (
                <button
                  type="button"
                  disabled={items.length === 0 || isSubmitting}
                  onClick={() => executeCompleteSale()}
                  className="w-full py-3 sm:py-3.5 px-4 bg-slate-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-arabic active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  <span>سیل مکمل و رسید جاری کریں ({paymentMethod.toUpperCase()})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mistake Protection: Accidental Clear Cart Confirmation Modal */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 text-start space-y-3">
            <div className="flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-black text-sm font-arabic">بل خالی کرنے کی تصدیق</h4>
            </div>
            <p className="text-xs text-slate-600 font-arabic">
              کیا آپ واقعی اس بل میں شامل تمام {items.length} اشیاء ختم کرنا چاہتے ہیں؟
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl font-arabic cursor-pointer"
              >
                منسوخ
              </button>
              <button
                type="button"
                onClick={handleClearCart}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-arabic cursor-pointer"
              >
                ہاں، بل خالی کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modular POS Sub-Modals */}
      <DailySummaryModal
        isOpen={isDailySummaryOpen}
        onClose={() => setIsDailySummaryOpen(false)}
        invoices={invoices}
        language={lang}
      />

      <VoicePOSBar
        isOpen={isVoicePOSOpen}
        onClose={() => setIsVoicePOSOpen(false)}
        products={products}
        customers={customers}
        onAddProductToCart={(prod, qty, customUnit) => addItemToBill(prod, qty, customUnit)}
        onSelectCustomer={(cust) => handleSelectCustomer(cust.id)}
        onSetPaymentMethod={(m) => setPaymentMethod(m)}
        onExecuteFastCheckout={handleOneTapFastCash}
        language={lang}
      />

      <ThermalReceiptModal
        invoice={completedInvoice}
        profile={profile}
        onClose={() => setCompletedInvoice(null)}
        onNewSale={() => setCompletedInvoice(null)}
        language={lang}
      />
    </div>
  );
};
