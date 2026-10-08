import React, { useEffect, useState } from 'react';
import { useBusiness } from './context/BusinessContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OnboardingModal } from './components/OnboardingModal';
import { AIMunshiDrawer } from './components/AIMunshiDrawer';
import { CameraScannerModal } from './components/CameraScannerModal';
import { SplashScreen } from './components/SplashScreen';
import { DashboardView } from './components/DashboardView';
import { BillingView } from './components/BillingView';
import { KhataView } from './components/KhataView';
import { PurchasesView } from './components/PurchasesView';
import { ProductsView } from './components/ProductsView';
import { ExpensesView } from './components/ExpensesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { LandingPageView } from './components/LandingPageView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { LANGUAGES } from './i18n/translations';

export default function App() {
  const { activeView, profile, isOnboardingOpen } = useBusiness();
  const [showSplash, setShowSplash] = useState(true);
  const prefLang = profile?.preferredLanguage || 'ur';
  const langConfig = LANGUAGES[prefLang] || LANGUAGES['ur'];
  const isRtl = langConfig.isRTL;

  useEffect(() => {
    // Update HTML dir and lang attributes dynamically
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = (prefLang || 'ur').split('-')[0] || 'ur';
  }, [isRtl, prefLang]);

  // If user navigated to or is on the website Landing Page
  if (activeView === 'landing') {
    return (
      <div
        id="asanibiz-landing-root"
        className={`min-h-screen w-full bg-[#f4f7f6] text-[#1a1c1e] ${
          isRtl ? 'font-arabic' : 'font-sans'
        }`}
      >
        <OfflineIndicator />
        <LandingPageView />
        <AIMunshiDrawer />
        <CameraScannerModal />
        <OnboardingModal />
      </div>
    );
  }

  // If user navigated to Admin Dashboard View
  if (activeView === 'admin') {
    return (
      <div
        id="asanibiz-admin-root"
        className={`min-h-screen w-full bg-[#f4f7f6] text-[#1a1c1e] ${
          isRtl ? 'font-arabic' : 'font-sans'
        }`}
      >
        <OfflineIndicator />
        <AdminDashboardView />
      </div>
    );
  }

  return (
    <div
      id="asanibiz-app-root"
      className={`h-screen w-full flex flex-col bg-[#f4f7f6] text-[#1a1c1e] overflow-hidden ${
        isRtl ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* Luxury Splash Screen (Deep Emerald #052e16, Metallic Gold #d4af37, Dark Slate #0f172a) */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Network / Offline Banner */}
      <OfflineIndicator />

      {/* Main SaaS App Layout: Left Sidebar (Desktop) + Right Content Area */}
      <div className="flex-1 flex w-full h-full overflow-hidden">
        {/* Desktop Professional Sidebar Navigation */}
        <Sidebar />

        {/* Content Column: Top Navbar (with mobile menu) + Scrollable Main View */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Header Bar */}
          <Navbar />

          {/* Dynamic Main View Area - Responsive SaaS layout */}
          <main
            id="main-view-container"
            className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-28 sm:pb-24 transition-all"
          >
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'billing' && <BillingView />}
            {activeView === 'khata' && <KhataView />}
            {activeView === 'purchases' && <PurchasesView />}
            {activeView === 'products' && <ProductsView />}
            {activeView === 'expenses' && <ExpensesView />}
            {activeView === 'reports' && <ReportsView />}
            {(activeView === 'settings' || activeView === 'business_office') && <SettingsView />}
          </main>

          {/* Fixed Bottom App Navigation (Visible on mobile & tablet) */}
          <BottomNav />
        </div>
      </div>

      {/* Interactive AI Munshi Drawer */}
      <AIMunshiDrawer />

      {/* Camera & Barcode / Receipt Scanner Modal */}
      <CameraScannerModal />

      {/* 3-Step Setup Wizard / Onboarding */}
      <OnboardingModal />
    </div>
  );
}

