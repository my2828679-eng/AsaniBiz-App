import React from 'react';
import { WifiOff } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, profile } = useBusiness();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="bg-amber-500 text-slate-900 px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-2 shadow-sm border-b border-amber-600 transition-all sticky top-0 z-50"
    >
      <WifiOff className="w-3.5 h-3.5 animate-pulse" />
      <span>{t('offlineNotice', profile.preferredLanguage)}</span>
    </div>
  );
};
