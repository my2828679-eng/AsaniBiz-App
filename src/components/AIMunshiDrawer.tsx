import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Mic,
  MicOff,
  Send,
  Volume2,
  Check,
  AlertTriangle,
  Receipt,
  BookOpen,
  Boxes,
  RotateCcw,
  Zap,
  MessageCircle,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { t, LANGUAGES } from '../i18n/translations';
import { AIMunshiMessage } from '../types';
import { routeUserRequest } from '../services/aiMunshiRouter';

export const AIMunshiDrawer: React.FC = () => {
  const {
    isAIMunshiOpen,
    setIsAIMunshiOpen,
    profile,
    products,
    invoices,
    customers,
    suppliers,
    expenses,
    purchases,
    khataTransactions,
    isOnline,
    createInvoice,
    recordKhataTransaction,
    addExpense,
    adjustStock,
    setActiveView,
    activeView,
    setPendingPOSSale,
  } = useBusiness();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AIMunshiMessage[]>([
    {
      id: 'm_init',
      sender: 'munshi',
      text: t('munshiGreeting', profile.preferredLanguage),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice Assistant Hook
  const handleSpeechResult = (spokenText: string) => {
    if (spokenText.trim()) {
      handleSendMessage(spokenText);
    }
  };

  const clarificationAttemptsRef = useRef<number>(0);

  const {
    isListening,
    isSpeaking,
    isHandsFree,
    transcript,
    supported: voiceSupported,
    startListening,
    stopListening,
    toggleHandsFree,
    speakText,
  } = useVoiceAssistant(profile.preferredLanguage, handleSpeechResult);

  // Snapshot context to send to server-side Gemini
  const prepareContextData = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayInvoices = invoices.filter((i) => i.createdAt.startsWith(today));
    const todaySales = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

    const todayExpensesList = expenses.filter((e) => e.date.startsWith(today));
    const todayExpenses = todayExpensesList.reduce((sum, e) => sum + e.amount, 0);

    const lowStockItems = products.filter((p) => p.quantity <= p.lowStockThreshold);
    const totalCustomerOutstanding = customers.reduce((sum, c) => sum + Math.max(0, c.currentBalance), 0);
    const totalSupplierPayable = suppliers.reduce((sum, s) => sum + Math.max(0, s.payableBalance), 0);

    return {
      todaySales,
      todayExpenses,
      totalProducts: products.length,
      lowStockItems: lowStockItems.slice(0, 5).map((p) => ({ name: p.name, qty: p.quantity, threshold: p.lowStockThreshold })),
      totalCustomerOutstanding,
      totalSupplierPayable,
      customersSample: customers.slice(0, 5).map((c) => ({ id: c.id, name: c.name, balance: c.currentBalance })),
      productsSample: products.slice(0, 5).map((p) => ({ id: p.id, name: p.name, price: p.sellingPrice, qty: p.quantity })),
    };
  };

  const handleSendMessage = async (msgText: string) => {
    const text = msgText.trim();
    if (!text || isLoading) return;

    const userTurn: AIMunshiMessage = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userTurn]);
    setInputMessage('');
    setIsLoading(true);

    // WAKE-WORD STYLE ARCHITECTURE: "Munshi" / "منشی" / "Hello Munshi"
    const lowerClean = text.toLowerCase().replace(/[!.,?،؟]/g, '').trim();
    if (
      lowerClean === 'munshi' ||
      lowerClean === 'ai munshi' ||
      lowerClean === 'منشی' ||
      lowerClean === 'منشی جی' ||
      lowerClean === 'hello munshi' ||
      lowerClean === 'hey munshi' ||
      lowerClean === 'suno munshi'
    ) {
      const wakeReply =
        profile.preferredLanguage === 'ur'
          ? 'جی صاحب، میں حاضر ہوں۔ حکم کریں کیا کام ہے؟'
          : profile.preferredLanguage === 'sd'
          ? 'هاڻي صاحب، مان حاضر آهيان۔ حڪم ڪريو ڇا ڪرڻو آهي؟'
          : profile.preferredLanguage === 'ps'
          ? 'هو صاحب، زه چمتو یم. حکم وکړئ څه مرسته کولی شم؟'
          : profile.preferredLanguage === 'pa'
          ? 'جی جناب، میں حاضر آں۔ دسو کی خدمت کراں؟'
          : 'Yes sir, I am here. How can I help with your business today?';

      const munshiTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: wakeReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: 'local_intent_engine',
        tokensUsed: 0,
      };
      setMessages((prev) => [...prev, munshiTurn]);
      speakText(wakeReply, profile.preferredLanguage);
      setIsLoading(false);
      return;
    }

    // STEP 1: Run Smart Local Intent & Rule Engine first (0 AI Cost)
    const localResult = routeUserRequest(text, {
      customers,
      suppliers,
      products,
      invoices,
      expenses,
      purchases,
      khataTransactions,
      profile,
      language: profile.preferredLanguage,
      currentView: activeView,
    });

    // Handle Voice Cancellation Intent ("nahi", "no", "cancel", "mat karo")
    if (localResult.intentCategory === 'VOICE_CANCELLATION') {
      clarificationAttemptsRef.current = 0;
      const pendingMsg = [...messages].reverse().find(
        (m) => m.actionProposal && m.actionProposal.status === 'pending'
      );
      if (pendingMsg && pendingMsg.actionProposal) {
        handleCancelAction(pendingMsg.id);
      }

      const munshiTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: localResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: 'local_intent_engine',
        tokensUsed: 0,
      };
      setMessages((prev) => [...prev, munshiTurn]);
      speakText(localResult.reply, profile.preferredLanguage);
      setIsLoading(false);
      return;
    }

    // Handle Voice Confirmation Intent ("haan", "yes", "theek hai", "confirm")
    if (localResult.intentCategory === 'VOICE_CONFIRMATION') {
      clarificationAttemptsRef.current = 0;
      const pendingMsg = [...messages].reverse().find(
        (m) => m.actionProposal && m.actionProposal.status === 'pending'
      );
      if (pendingMsg && pendingMsg.actionProposal) {
        handleConfirmAction(
          pendingMsg.actionProposal,
          pendingMsg.id
        );
        const confirmReply = profile.preferredLanguage === 'ur'
          ? 'جی ہاں، کارروائی کی تصدیق اور ریکارڈنگ مکمل ہو گئی ہے۔'
          : profile.preferredLanguage === 'sd'
          ? 'هاڻي ڪارروائي جي تصديق ٿي وئي آهي۔'
          : profile.preferredLanguage === 'ps'
          ? 'کړنه تایید او ثبت شوه.'
          : profile.preferredLanguage === 'pa'
          ? 'کارروائی منظور تے محفوظ ہو گئی اے۔'
          : 'Action confirmed and processed.';

        const munshiTurn: AIMunshiMessage = {
          id: 'm_' + (Date.now() + 1),
          sender: 'munshi',
          text: confirmReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          routingSource: 'local_intent_engine',
          tokensUsed: 0,
        };
        setMessages((prev) => [...prev, munshiTurn]);
        speakText(confirmReply, profile.preferredLanguage);
        setIsLoading(false);
        return;
      }
    }

    if (!localResult.requiresAI) {
      // Local command successfully understood -> reset clarification attempts counter
      clarificationAttemptsRef.current = 0;

      let actionProp = localResult.actionProposal;

      // Automatically execute immediate navigation & tool actions without prompt friction
      if (actionProp && actionProp.requiresConfirmation === false) {
        if (actionProp.type === 'NAVIGATE' && actionProp.details?.view) {
          setActiveView(actionProp.details.view);
        } else if (actionProp.type === 'OPEN_CAMERA') {
          setActiveView('billing');
          window.dispatchEvent(new CustomEvent('open-pos-camera'));
        } else if (actionProp.type === 'NEW_BILL') {
          setActiveView('billing');
          window.dispatchEvent(new CustomEvent('new-pos-bill'));
        } else if (actionProp.type === 'OPEN_KHATA') {
          setActiveView('khata');
        } else if (actionProp.type === 'SHOW_LAST_BILL') {
          setActiveView('billing');
        } else if (actionProp.type === 'CLOSE_MUNSHI') {
          setIsAIMunshiOpen(false);
        }
      }

      // Trusted Actions Check: auto-approve low-risk actions if authorized by user
      if (
        actionProp &&
        actionProp.type === 'ADD_EXPENSE' &&
        profile.trustedAIActions?.allowAutoDailyExpense
      ) {
        addExpense({
          category: actionProp.details.category || 'Rozmara Kharcha',
          amount: Number(actionProp.details.amount) || 100,
          date: new Date().toISOString(),
          notes: actionProp.details.notes || 'Recorded via AI Munshi (Auto-Approved)',
          paidVia: 'Cash',
        });
        actionProp = { ...actionProp, status: 'confirmed' };
      }

      const munshiTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: localResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: localResult.routingSource,
        tokensUsed: 0,
        actionProposal: actionProp,
      };

      setMessages((prev) => [...prev, munshiTurn]);

      if (localResult.speechSynthesisText) {
        speakText(localResult.speechSynthesisText, profile.preferredLanguage);
      }
      setIsLoading(false);
      return;
    }

    // STEP 2: Clarification Flow (1-2 attempts locally before escalating to Gemini API)
    if (clarificationAttemptsRef.current === 0) {
      clarificationAttemptsRef.current = 1;
      let clarificationReply = '';
      if (profile.preferredLanguage === 'ur') {
        clarificationReply = 'آپ کی بات سمجھ نہیں آئی، مہربانی کر کے دوبارہ بولیں۔';
      } else if (profile.preferredLanguage === 'sd') {
        clarificationReply = 'اوھان جي ڳالھ سمجھ ۾ نه آئي، مھرباني ڪري وري چئو۔';
      } else if (profile.preferredLanguage === 'ps') {
        clarificationReply = 'ستاسو خبره ونه پوهېدم، مهرباني وکړئ بیا ووایاست.';
      } else if (profile.preferredLanguage === 'pa') {
        clarificationReply = 'تہاڈی گل سمجھ نہیں آئی، مہربانی کر کے دوبارہ بولو۔';
      } else if (profile.preferredLanguage === 'en') {
        clarificationReply = 'I could not understand that. Please say it again clearly.';
      } else {
        clarificationReply = 'Aap ki baat samajh nahi aayi, meherbani karke dobara bolen.';
      }

      const munshiTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: clarificationReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: 'local_intent_engine',
        tokensUsed: 0,
      };

      setMessages((prev) => [...prev, munshiTurn]);
      speakText(clarificationReply, profile.preferredLanguage);
      setIsLoading(false);
      return;
    } else if (clarificationAttemptsRef.current === 1) {
      clarificationAttemptsRef.current = 2;
      let clarificationReply = '';
      if (profile.preferredLanguage === 'ur') {
        clarificationReply = 'مجھے ابھی بھی بات سمجھ نہیں آئی، تھوڑا واضح بولیں۔';
      } else if (profile.preferredLanguage === 'sd') {
        clarificationReply = 'مون کي اڃا به ڳالھ سمجھ ۾ نه آئي، ٿورو صاف چئو۔';
      } else if (profile.preferredLanguage === 'ps') {
        clarificationReply = 'زه لا هم په خبره ونه پوهېدم، لږ واضح ووایاست.';
      } else if (profile.preferredLanguage === 'pa') {
        clarificationReply = 'مینوں ہجے وی سمجھ نہیں آئی، تھوڑا واضح بولو۔';
      } else if (profile.preferredLanguage === 'en') {
        clarificationReply = 'I still could not catch that. Please speak a little more clearly.';
      } else {
        clarificationReply = 'Mujhe abhi bhi baat samajh nahi aayi, thora wazeh bolen.';
      }

      const munshiTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: clarificationReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: 'local_intent_engine',
        tokensUsed: 0,
      };

      setMessages((prev) => [...prev, munshiTurn]);
      speakText(clarificationReply, profile.preferredLanguage);
      setIsLoading(false);
      return;
    }

    // 3rd attempt: Escalate to Gemini API with minimal context
    clarificationAttemptsRef.current = 0;

    if (!isOnline) {
      const offlineTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: profile.preferredLanguage === 'ur'
          ? 'جناب، انٹرنیٹ کنکشن دستیاب نہیں ہے۔ آپ کے تمام دکانی ٹولز اور کھاتہ آف لائن موڈ میں دستیاب ہیں۔'
          : 'Janab, internet connection available nahi hai. Aap ke tamaam dukan tools aur khata offline mode mein bilkul theek chal rahe hain.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: 'local_intent_engine',
        tokensUsed: 0,
      };
      setMessages((prev) => [...prev, offlineTurn]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/ai-munshi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: profile.preferredLanguage,
          businessProfile: profile,
          contextData: localResult.minimalContext || prepareContextData(),
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.sender === 'munshi' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      const munshiReplyText = data.reply || 'Janab, aap ka hukum samajh liya hai.';

      const munshiTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: munshiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: data.routingSource || 'ai_model',
        tokensUsed: data.tokensUsed || 0,
        executionSpeedMs: data.executionSpeedMs,
        actionProposal: data.actionProposal
          ? {
              ...data.actionProposal,
              status: 'pending',
            }
          : undefined,
      };

      setMessages((prev) => [...prev, munshiTurn]);

      if (data.speechSynthesisText) {
        speakText(data.speechSynthesisText, profile.preferredLanguage);
      }
    } catch (err: any) {
      console.warn('AI Munshi API error:', err);
      const fallbackTurn: AIMunshiMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'munshi',
        text: 'Janab, local books mehfooz hain. Aaj ki sale aur khata records bilkul update hain.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routingSource: 'local_intent_engine',
      };
      setMessages((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe Action Proposal Confirmation Handler
  const handleConfirmAction = (proposal: NonNullable<AIMunshiMessage['actionProposal']>, messageId: string) => {
    try {
      const { type, details } = proposal;

      if (type === 'CREATE_INVOICE') {
        setActiveView('billing');
        setIsAIMunshiOpen(false);
      } else if (type === 'OPEN_KHATA') {
        setActiveView('khata');
        setIsAIMunshiOpen(false);
      } else if (type === 'WHATSAPP_SUMMARY') {
        const phone = (details?.phone || '').replace(/[^0-9]/g, '');
        const textMsg = details?.messageText || '';
        const waUrl = phone
          ? `https://wa.me/${phone.startsWith('0') ? '92' + phone.substring(1) : phone}?text=${encodeURIComponent(textMsg)}`
          : `https://wa.me/?text=${encodeURIComponent(textMsg)}`;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(textMsg).catch(() => {});
        }
        window.open(waUrl, '_blank');
      } else if (type === 'ADD_UDHAAR') {
        const targetCustomer = (customers || []).find(
          (c) => c.name.toLowerCase().includes((details.customerName || '').toLowerCase())
        ) || customers?.[0];

        if (targetCustomer && details.amount) {
          recordKhataTransaction(
            'customer',
            targetCustomer.id,
            targetCustomer.name,
            'credit_given',
            Number(details.amount),
            details.notes || 'AI Munshi voice record'
          );
        }
      } else if (type === 'RECORD_PAYMENT') {
        const targetCustomer = (customers || []).find(
          (c) => c.name.toLowerCase().includes((details.customerName || '').toLowerCase())
        ) || customers?.[0];

        if (targetCustomer && details.amount) {
          recordKhataTransaction(
            'customer',
            targetCustomer.id,
            targetCustomer.name,
            'payment_received',
            Number(details.amount),
            details.notes || 'Payment wasooli'
          );
        }
      } else if (type === 'ADD_EXPENSE') {
        addExpense({
          category: details.category || 'Rozmara Kharcha',
          amount: Number(details.amount) || 100,
          date: new Date().toISOString(),
          notes: details.notes || 'Recorded via AI Munshi',
          paidVia: 'Cash',
        });
      } else if (type === 'ADJUST_STOCK') {
        const matchProduct = products.find((p) =>
          p.name.toLowerCase().includes((details.productName || '').toLowerCase())
        );
        if (matchProduct && details.quantity) {
          adjustStock(matchProduct.id, Number(details.quantity), details.notes || 'AI Munshi adjustment');
        }
      } else if (type === 'QUICK_SALE') {
        const items = details.items && details.items.length > 0
          ? details.items
          : [
              {
                productId: details.productId || 'prod_custom',
                productName: details.productName || 'Sale Item',
                quantity: Number(details.quantity) || 1,
                unitPrice: Number(details.unitPrice) || Number(details.total) || 100,
                unit: details.unit || 'عدد',
                total: Number(details.total) || (Number(details.quantity) || 1) * (Number(details.unitPrice) || 100),
              }
            ];

        setPendingPOSSale({
          customerId: details.customerId,
          customerName: details.customerName || 'Walk-in Customer',
          customerPhone: details.customerPhone,
          items,
          notes: details.notes || 'AI Munshi fast counter sale',
        });
        setActiveView('billing');
        setIsAIMunshiOpen(false);
      } else if (type === 'RECORD_SUPPLIER_PAYMENT') {
        const sId = details.supplierId;
        const s = (suppliers || []).find((sup) => sup.id === sId) || suppliers?.[0];
        if (s && details.amount) {
          recordKhataTransaction(
            'supplier',
            s.id,
            s.name,
            'payment_made',
            Number(details.amount),
            details.notes || 'Supplier payment via AI Munshi'
          );
          fetch('/api/financial/supplier-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              supplierId: s.id,
              supplierName: s.name,
              amount: Number(details.amount),
              paymentMethod: 'cash',
              notes: details.notes || 'AI Munshi supplier payment',
            }),
          }).catch(() => {});
        }
      } else if (type === 'TRANSFER_CASH_BANK') {
        if (details.amount) {
          fetch('/api/financial/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accountType: 'bank',
              type: 'transfer_in',
              amount: Number(details.amount),
              category: 'transfer',
              description: details.notes || 'Cash to bank transfer via AI Munshi',
            }),
          }).catch(() => {});
        }
      } else if (type === 'RECORD_STAFF_ADVANCE') {
        if (details.staffId && details.amount) {
          fetch('/api/staff/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              staffId: details.staffId,
              type: 'advance',
              amount: Number(details.amount),
              paymentMethod: 'cash',
              notes: details.notes || 'Staff advance via AI Munshi',
            }),
          }).catch(() => {});
        }
      } else if (type === 'REPEAT_LAST_SALE') {
        if (details.items && details.items.length > 0) {
          setPendingPOSSale({
            customerId: details.customerId,
            customerName: details.customerName || 'Walk-in Customer',
            customerPhone: details.customerPhone,
            items: details.items,
            notes: 'Repeat of previous invoice via AI Munshi',
          });
          setActiveView('billing');
          setIsAIMunshiOpen(false);
        }
      } else if (type === 'NAVIGATE') {
        if (details.view) {
          setActiveView(details.view);
          setIsAIMunshiOpen(false);
        }
      } else if (type === 'OPEN_CAMERA') {
        setActiveView('billing');
        setIsAIMunshiOpen(false);
        window.dispatchEvent(new CustomEvent('open-pos-camera'));
      } else if (type === 'NEW_BILL') {
        setActiveView('billing');
        setIsAIMunshiOpen(false);
        window.dispatchEvent(new CustomEvent('new-pos-bill'));
      } else if (type === 'SHOW_LAST_BILL') {
        setActiveView('billing');
        setIsAIMunshiOpen(false);
      } else if (type === 'CLOSE_MUNSHI') {
        setIsAIMunshiOpen(false);
      }

      // Update message state to confirmed
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId && m.actionProposal
            ? { ...m, actionProposal: { ...m.actionProposal, status: 'confirmed' } }
            : m
        )
      );
    } catch (err) {
      console.error('Action execution failed:', err);
      const failMsg =
        profile.preferredLanguage === 'ur'
          ? 'معذرت، ریکارڈ محفوظ نہیں ہو سکا۔ برائے مہربانی دوبارہ کوشش کریں۔'
          : profile.preferredLanguage === 'sd'
          ? 'معاف ڪجو، رڪارڊ محفوظ نه ٿي سگهيو۔ مهرباني ڪري ٻيهر ڪوشش ڪريو۔'
          : profile.preferredLanguage === 'ps'
          ? 'بښنه غواړم، معلومات ثبت نه شول. مهرباني وکړئ بیا هڅه وکړئ.'
          : profile.preferredLanguage === 'pa'
          ? 'معافی، ریکارڈ محفوظ نہیں ہو سکیا۔ فیر کوشش کرو جی۔'
          : 'Sorry, the record could not be saved. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          id: 'm_err_' + Date.now(),
          sender: 'munshi',
          text: failMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          routingSource: 'local_intent_engine',
        },
      ]);
      speakText(failMsg, profile.preferredLanguage);
    }
  };

  const handleCancelAction = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.actionProposal
          ? { ...m, actionProposal: { ...m.actionProposal, status: 'cancelled' } }
          : m
      )
    );
  };

  if (!isAIMunshiOpen) return null;

  return (
    <div
      id="ai-munshi-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#0a2e2a] text-white p-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f2ad1a] border border-[#00f2ad33] flex items-center justify-center text-[#00f2ad] relative shrink-0">
              <Sparkles className="w-5 h-5" />
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2ad] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f2ad]" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white leading-tight">
                  {t('navAIMunshi', profile.preferredLanguage)}
                </h3>
                <span className="text-[10px] bg-[#00f2ad26] border border-[#00f2ad40] px-2 py-0.5 rounded-full text-[#00f2ad] font-bold uppercase tracking-wider">
                  {t('activeStatus', profile.preferredLanguage)}
                </span>
              </div>
              <p className="text-xs text-[#00f2ad]/80 truncate mt-0.5">
                {t('munshiSubtitle', profile.preferredLanguage)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {voiceSupported && (
              <button
                id="toggle-hands-free-btn"
                onClick={toggleHandsFree}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isHandsFree
                    ? 'bg-[#00f2ad] text-[#0a2e2a] shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Hands-Free Continuous Voice Mode"
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">
                  {isHandsFree ? t('handsFreeBtnText', profile.preferredLanguage) : t('voiceSubtitle', profile.preferredLanguage)}
                </span>
              </button>
            )}

            <button
              onClick={() => setIsAIMunshiOpen(false)}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Listening Banner if voice is active */}
        {isListening && (
          <div className="bg-[#0d3b36] border-b border-[#00f2ad33] text-white px-4 py-2.5 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ad] animate-ping" />
              <span className="font-bold text-[#00f2ad]">
                {t('voiceListening', profile.preferredLanguage)}
              </span>
            </div>
            {transcript && <span className="italic text-white/90 truncate max-w-[200px]">"{transcript}"</span>}
          </div>
        )}

        {/* Speaking Banner if assistant is talking through speaker */}
        {isSpeaking && (
          <div className="bg-[#00f2ad]/15 border-b border-[#00f2ad40] text-[#0a2e2a] px-4 py-2 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#0a5e54]" />
              <span className="font-bold text-[#0a5e54]">
                {profile.preferredLanguage === 'ur'
                  ? 'اے آئی منشی جواب دے رہا ہے...'
                  : profile.preferredLanguage === 'sd'
                  ? 'منشي جواب ڏئي رهيو آهي...'
                  : profile.preferredLanguage === 'ps'
                  ? 'منشي ځواب ورکوي...'
                  : profile.preferredLanguage === 'pa'
                  ? 'منشی جواب دے رہیا اے...'
                  : 'AI Munshi is replying...'}
              </span>
            </div>
            <span className="text-[10px] text-slate-600 bg-white/70 px-2 py-0.5 rounded-md font-semibold">
              {profile.preferredLanguage === 'ur' ? 'فون اسپیکر' : 'Phone Speaker'}
            </span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-[#f4f7f6] border-b border-[#e5e7eb] overflow-x-auto whitespace-nowrap flex gap-2 shrink-0">
          <button
            onClick={() => handleSendMessage(t('chipTodaySales', profile.preferredLanguage))}
            className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-[#1a1c1e] text-[11px] font-semibold hover:border-[#00f2ad] hover:text-[#0a5e54] shadow-2xs shrink-0 transition-colors cursor-pointer"
          >
            {t('chipTodaySales', profile.preferredLanguage)}
          </button>
          <button
            onClick={() => handleSendMessage(t('chipLowStock', profile.preferredLanguage))}
            className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-[#1a1c1e] text-[11px] font-semibold hover:border-[#00f2ad] hover:text-[#0a5e54] shadow-2xs shrink-0 transition-colors cursor-pointer"
          >
            {t('chipLowStock', profile.preferredLanguage)}
          </button>
          <button
            onClick={() => handleSendMessage(t('chipCustomerDebt', profile.preferredLanguage))}
            className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-[#1a1c1e] text-[11px] font-semibold hover:border-[#00f2ad] hover:text-[#0a5e54] shadow-2xs shrink-0 transition-colors cursor-pointer"
          >
            {t('chipCustomerDebt', profile.preferredLanguage)}
          </button>
          <button
            onClick={() => handleSendMessage(t('chipNewBill', profile.preferredLanguage))}
            className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-[#1a1c1e] text-[11px] font-semibold hover:border-[#00f2ad] hover:text-[#0a5e54] shadow-2xs shrink-0 transition-colors cursor-pointer"
          >
            {t('chipNewBill', profile.preferredLanguage)}
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f4f7f6]">
          {messages.map((m) => {
            const isMunshi = m.sender === 'munshi';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMunshi ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    isMunshi
                      ? 'bg-white border border-[#f0f0f0] text-[#1a1c1e] rounded-tl-xs'
                      : 'bg-[#0a2e2a] text-white rounded-tr-xs'
                  }`}
                >
                  {isMunshi && (
                    <div className="mb-1.5 flex items-center gap-1.5">
                      {m.routingSource === 'local_intent_engine' && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold border border-emerald-200">
                          <Zap className="w-2.5 h-2.5 text-emerald-600" />
                          <span>لوکل رولز (0 ٹوکن لاگت)</span>
                        </span>
                      )}
                      {m.routingSource === 'cached_summary' && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-bold border border-blue-200">
                          <Zap className="w-2.5 h-2.5 text-blue-600" />
                          <span>کیش سمری (فوری)</span>
                        </span>
                      )}
                      {(m.routingSource === 'ai_model' || m.routingSource === 'ai_model_primary' || m.routingSource === 'ai_model_fallback') && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full font-bold border border-purple-200">
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                          <span>AI ماڈل {m.tokensUsed ? `(~${m.tokensUsed} ٹوکن)` : ''}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Financial Safety: Action Proposal Card */}
                  {m.actionProposal && (
                    <div className={`mt-2.5 p-3 rounded-xl border space-y-2 ${
                      m.actionProposal.type === 'WHATSAPP_SUMMARY'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                        : 'border-amber-300 bg-amber-50 text-[#1a1c1e]'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {m.actionProposal.type === 'WHATSAPP_SUMMARY' ? (
                          <>
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-900">{m.actionProposal?.title || ''}</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-amber-900">{m.actionProposal?.title || ''}</span>
                          </>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-700 space-y-0.5">
                        {m.actionProposal.details?.customerName && (
                          <div>Customer: <strong>{m.actionProposal.details.customerName}</strong></div>
                        )}
                        {m.actionProposal.details?.amount && (
                          <div>Amount: <strong>Rs. {m.actionProposal.details.amount}</strong></div>
                        )}
                        {m.actionProposal.details?.productName && (
                          <div>Product: <strong>{m.actionProposal.details.productName}</strong></div>
                        )}
                        {m.actionProposal.details?.quantity && (
                          <div>Quantity: <strong>{m.actionProposal.details.quantity}</strong></div>
                        )}
                        {m.actionProposal.details?.messageText && (
                          <div className="mt-1 p-2 bg-white rounded-lg border border-emerald-200 font-mono text-[10px] text-slate-800 break-words whitespace-pre-line">
                            {m.actionProposal.details.messageText}
                          </div>
                        )}
                      </div>

                      {m.actionProposal.type === 'WHATSAPP_SUMMARY' ? (
                        <div className="flex items-center gap-2 pt-2 border-t border-emerald-200">
                          <button
                            type="button"
                            onClick={() => handleConfirmAction(m.actionProposal!, m.id)}
                            className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>واٹس ایپ پر کھولیں</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard && m.actionProposal?.details?.messageText) {
                                navigator.clipboard.writeText(m.actionProposal.details.messageText);
                              }
                            }}
                            className="py-1.5 px-2.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                            title="Copy text"
                          >
                            <Copy className="w-3 h-3" />
                            <span>کاپی</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          {m.actionProposal.status === 'pending' && (
                            <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                              <button
                                type="button"
                                onClick={() => handleConfirmAction(m.actionProposal!, m.id)}
                                className="flex-1 py-1.5 px-3 bg-[#0a2e2a] hover:bg-[#0d3b36] text-[#00f2ad] rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>{t('btnConfirm', profile.preferredLanguage)}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelAction(m.id)}
                                className="py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-medium cursor-pointer"
                              >
                                {t('btnCancel', profile.preferredLanguage)}
                              </button>
                            </div>
                          )}

                          {m.actionProposal.status === 'confirmed' && (
                            <div className="text-[#0a5e54] font-bold text-[11px] flex items-center gap-1 pt-1">
                              <Check className="w-3.5 h-3.5 text-[#00f2ad]" />
                              <span>{t('entrySavedToBooks', profile.preferredLanguage)}</span>
                            </div>
                          )}

                          {m.actionProposal.status === 'cancelled' && (
                            <div className="text-slate-500 italic text-[11px] pt-1">
                              {t('entryCancelled', profile.preferredLanguage)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[10px] text-[#9ca3af]">
                    <span>{m.timestamp}</span>
                    {isMunshi && (
                      <button
                        onClick={() => speakText(m.text, profile.preferredLanguage)}
                        className="hover:text-[#0a5e54] p-0.5"
                        title="Play audio"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#6b7280] italic">
              <span className="w-2 h-2 rounded-full bg-[#00f2ad] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#00f2ad] animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-[#00f2ad] animate-bounce delay-200" />
              <span>{t('munshiThinking', profile.preferredLanguage)}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3.5 bg-white border-t border-[#e5e7eb] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="flex items-center gap-2"
          >
            {voiceSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#00f2ad1a] text-[#0a5e54] border border-[#00f2ad33] hover:bg-[#00f2ad33]'
                }`}
                title={isListening ? 'Stop Listening' : 'Press to Speak (Boliye)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('inputMunshiPlaceholder', profile.preferredLanguage)}
              className="flex-1 px-3.5 py-2 text-xs border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#00f2ad] focus:ring-1 focus:ring-[#00f2ad] bg-[#f9fafb]"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#0a2e2a] hover:bg-[#0d3b36] disabled:opacity-40 text-[#00f2ad] font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
