import React from 'react';
import { BusinessTypeId } from '../types';

interface BusinessBackgroundProps {
  businessType: BusinessTypeId;
  themeColor?: string;
}

export const BusinessBackground: React.FC<BusinessBackgroundProps> = ({ businessType, themeColor = '#0a5e54' }) => {
  const getSubtlePattern = () => {
    switch (businessType) {
      case 'kiryana':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="kiryana-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Shopping basket & grocery sack */}
                <path d="M20 45 L35 45 L45 75 L15 75 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M22 45 C25 30, 35 30, 38 45" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Wheat ears / grain */}
                <path d="M85 25 Q95 35 85 45 Q75 35 85 25 Z M85 25 L85 55" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Jar / canister */}
                <rect x="75" y="80" width="20" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <line x1="78" y1="80" x2="92" y2="80" stroke="currentColor" strokeWidth="2.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#kiryana-pat)" />
          </svg>
        );

      case 'pharmacy':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="pharma-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Medical Cross */}
                <path d="M30 18 H38 V26 H46 V34 H38 V42 H30 V34 H22 V26 H30 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Medicine Capsule */}
                <rect x="75" y="75" width="28" height="14" rx="7" transform="rotate(-30 75 75)" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <line x1="82" y1="71" x2="82" y2="85" stroke="currentColor" strokeWidth="1" />
                {/* Molecule / Stethoscope node */}
                <circle cx="85" cy="25" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="100" cy="35" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <line x1="88" y1="27" x2="98" y2="33" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pharma-pat)" />
          </svg>
        );

      case 'mobile':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="mobile-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Smartphone outline */}
                <rect x="25" y="20" width="22" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="36" cy="54" r="1.5" fill="currentColor" />
                {/* Charger plug / signal rays */}
                <path d="M80 30 L80 40 M88 30 L88 40 M76 40 L92 40 L92 50 L76 50 Z M84 50 L84 65" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Circuit node */}
                <circle cx="35" cy="95" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M38 95 H60 V80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mobile-pat)" />
          </svg>
        );

      case 'clothing':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="clothing-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Clothes Hanger */}
                <path d="M30 35 L45 25 L60 35 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M45 25 C45 20, 50 18, 50 22" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Sewing button */}
                <circle cx="90" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="88" cy="28" r="1" fill="currentColor" />
                <circle cx="92" cy="28" r="1" fill="currentColor" />
                <circle cx="88" cy="32" r="1" fill="currentColor" />
                <circle cx="92" cy="32" r="1" fill="currentColor" />
                {/* Stitches line */}
                <line x1="20" y1="85" x2="100" y2="85" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#clothing-pat)" />
          </svg>
        );

      case 'shoes':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="shoes-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Shoe sole silhouette */}
                <path d="M25 35 Q35 30 50 35 Q60 42 60 50 Q55 58 40 55 Q25 50 25 35 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Shoe box */}
                <rect x="75" y="70" width="30" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <line x1="72" y1="76" x2="108" y2="76" stroke="currentColor" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shoes-pat)" />
          </svg>
        );

      case 'cosmetics':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="cosmetics-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Perfume bottle */}
                <rect x="25" y="32" width="22" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="31" y="24" width="10" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Lipstick */}
                <rect x="80" y="70" width="12" height="25" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M80 70 L86 58 L92 65 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cosmetics-pat)" />
          </svg>
        );

      case 'furniture':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="furniture-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Armchair / Sofa */}
                <path d="M20 45 H55 V60 H20 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M16 38 H22 V65 H16 Z M53 38 H59 V65 H53 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Table */}
                <line x1="75" y1="75" x2="105" y2="75" stroke="currentColor" strokeWidth="2.5" />
                <line x1="80" y1="75" x2="80" y2="95" stroke="currentColor" strokeWidth="1.2" />
                <line x1="100" y1="75" x2="100" y2="95" stroke="currentColor" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#furniture-pat)" />
          </svg>
        );

      case 'transport':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="transport-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Freight truck */}
                <path d="M15 35 H45 V55 H15 Z M45 42 H55 L60 48 V55 H45 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="25" cy="58" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="50" cy="58" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Route pin & road line */}
                <path d="M85 75 C85 68, 97 68, 97 75 C97 82, 91 88, 91 88 C91 88, 85 82, 85 75 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#transport-pat)" />
          </svg>
        );

      case 'dairy':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="dairy-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Milk container / can */}
                <path d="M28 32 H42 L46 45 H24 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="22" y="45" width="26" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Milk splash / droplet */}
                <path d="M85 30 C85 24, 91 18, 91 18 C91 18, 97 24, 97 30 C97 34, 94 37, 91 37 C88 37, 85 34, 85 30 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dairy-pat)" />
          </svg>
        );

      case 'meat_shop':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="meat-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Butcher Cleaver */}
                <path d="M20 30 H45 V48 H25 Z M45 36 H60 V42 H45 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Scale hooks */}
                <path d="M85 70 L95 80 M95 70 L85 80" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="90" cy="75" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#meat-pat)" />
          </svg>
        );

      case 'fruit_veg':
      case 'mandi':
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <pattern id="mandi-pat" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Burlap Sack / Grain bag */}
                <path d="M20 40 Q30 35 40 40 L45 70 Q30 75 15 70 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <line x1="22" y1="42" x2="38" y2="42" stroke="currentColor" strokeWidth="2" />
                {/* Balance Weight Scale */}
                <line x1="75" y1="30" x2="105" y2="30" stroke="currentColor" strokeWidth="2" />
                <line x1="90" y1="20" x2="90" y2="45" stroke="currentColor" strokeWidth="1.2" />
                <path d="M72 40 L78 40 L75 30 Z M102 40 L108 40 L105 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mandi-pat)" />
          </svg>
        );

      default:
        // Clean geometric motif for electronics, hardware, online, commission, and other
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="general-pat" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                <circle cx="65" cy="65" r="1.5" fill="currentColor" />
                <path d="M15 15 L35 15 L35 45" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                <rect x="70" y="20" width="15" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#general-pat)" />
          </svg>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
      style={{ color: themeColor }}
    >
      <div className="absolute inset-0 opacity-[0.032] transition-opacity duration-500">
        {getSubtlePattern()}
      </div>
      {/* Very soft ambient vignette to ground cards without obscuring readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${themeColor}0a 0%, transparent 60%)`
        }}
      />
    </div>
  );
};
