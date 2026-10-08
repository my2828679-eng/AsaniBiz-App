import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminLoginView } from './AdminLoginView';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminBusinessesTab } from './AdminBusinessesTab';
import { AdminSubscriptionsTab } from './AdminSubscriptionsTab';
import { AdminPlansTab } from './AdminPlansTab';
import { AdminPaymentsTab } from './AdminPaymentsTab';
import { AdminReferralsTab } from './AdminReferralsTab';
import { AdminAIUsageTab } from './AdminAIUsageTab';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminSystemActivityTab } from './AdminSystemActivityTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminMunshiWidget } from './AdminMunshiWidget';

export const AdminDashboardView: React.FC = () => {
  const { isAdminAuthenticated } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMunshiOpen, setIsMunshiOpen] = useState(false);

  // Security Check: If not logged in as Admin, show Admin Login Portal
  if (!isAdminAuthenticated) {
    return <AdminLoginView />;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-800 flex flex-col font-arabic select-none antialiased">
      {/* Admin Top Header */}
      <AdminHeader
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onOpenMunshi={() => setIsMunshiOpen(true)}
      />

      {/* Admin Main Body Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Admin Tab Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenMunshi={() => setIsMunshiOpen(true)}
            />
          )}
          {activeTab === 'businesses' && <AdminBusinessesTab />}
          {activeTab === 'subscriptions' && <AdminSubscriptionsTab />}
          {activeTab === 'plans' && <AdminPlansTab />}
          {activeTab === 'payments' && <AdminPaymentsTab />}
          {activeTab === 'referrals' && <AdminReferralsTab />}
          {activeTab === 'ai_usage' && <AdminAIUsageTab />}
          {activeTab === 'reports' && <AdminReportsTab />}
          {activeTab === 'system_activity' && <AdminSystemActivityTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
        </main>

        {/* Dedicated Admin Munshi AI Assistant Widget */}
        <AdminMunshiWidget
          onNavigateTab={(tab) => {
            setActiveTab(tab);
          }}
          isOpen={isMunshiOpen}
          onToggleOpen={() => setIsMunshiOpen(!isMunshiOpen)}
        />
      </div>
    </div>
  );
};
