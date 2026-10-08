import React from 'react';
import {
  ShoppingBasket,
  Cross,
  Smartphone,
  Shirt,
  Footprints,
  Sparkles,
  Armchair,
  Tv,
  Wrench,
  Car,
  UtensilsCrossed,
  Cake,
  Apple,
  Scale,
  Handshake,
  Truck,
  Milk,
  Beef,
  ShoppingBag,
  Building2,
  Store,
  CheckCircle2,
  Scissors,
  Coffee,
  Boxes
} from 'lucide-react';
import { BusinessTypeId } from '../types';

interface SmartBusinessLogoProps {
  businessType: BusinessTypeId | string;
  logoUrl?: string;
  businessName?: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'board';
  className?: string;
  showBadge?: boolean;
}

export const SmartBusinessLogo: React.FC<SmartBusinessLogoProps> = ({
  businessType,
  logoUrl,
  businessName,
  accentColor = '#0a5e54',
  size = 'board',
  className = '',
  showBadge = false
}) => {
  // Dimension definitions - Large responsive sizes tailored for Pakistani shop signboard standards
  // Mobile: ~155px area, Tablet/Desktop: 210-235px area
  // Inside icon/logo visibly fills ~75-80% of the frame with high visual impact
  const sizeMap = {
    sm: {
      container: 'w-12 h-12 rounded-xl',
      iconBox: 'w-7 h-7',
      badgeSize: 'text-[9px] px-1.5 py-0.5',
      letterSize: 'text-sm',
      strokeWidth: 2
    },
    md: {
      container: 'w-16 h-16 rounded-2xl',
      iconBox: 'w-10 h-10',
      badgeSize: 'text-[10px] px-2 py-0.5',
      letterSize: 'text-lg',
      strokeWidth: 2
    },
    lg: {
      container: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl',
      iconBox: 'w-14 h-14 sm:w-16 sm:h-16',
      badgeSize: 'text-xs px-2.5 py-1',
      letterSize: 'text-2xl sm:text-3xl',
      strokeWidth: 2
    },
    xl: {
      container: 'w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl sm:rounded-4xl',
      iconBox: 'w-24 h-24 sm:w-30 sm:h-30 md:w-36 md:h-36',
      badgeSize: 'text-xs px-3 py-1',
      letterSize: 'text-4xl sm:text-5xl md:text-6xl',
      strokeWidth: 2
    },
    '2xl': {
      container: 'w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl sm:rounded-4xl',
      iconBox: 'w-28 h-28 sm:w-34 sm:h-34 md:w-40 md:h-40',
      badgeSize: 'text-sm px-3.5 py-1',
      letterSize: 'text-5xl sm:text-6xl md:text-7xl',
      strokeWidth: 2
    },
    // Dedicated Signboard Header Size: Large responsive logo area as specified:
    // Mobile: approximately 140–180px logo area (165px)
    // Tablet/Desktop: approximately 180–240px logo area (200px sm, 235px md/lg)
    // The actual logo visibly fills most of this area with pristine aspect ratio
    board: {
      container: 'shop-board-logo-frame w-[165px] h-[165px] sm:w-[200px] sm:h-[200px] md:w-[235px] md:h-[235px] rounded-[36px] sm:rounded-[44px] md:rounded-[50px] shrink-0 aspect-square',
      iconBox: 'shop-board-logo-inner-icon w-[148px] h-[148px] sm:w-[180px] sm:h-[180px] md:w-[212px] md:h-[212px] shrink-0',
      badgeSize: 'text-xs sm:text-sm px-3.5 py-1.5',
      letterSize: 'text-8xl sm:text-9xl md:text-[11rem]',
      strokeWidth: 2.2
    }
  };

  const currentSize = sizeMap[size] || sizeMap.board;

  // Custom high-fidelity brand insignia vector for each of the business types
  const renderAutomaticInsignia = () => {
    const iconProps = {
      size: '100%',
      className: 'w-full h-full text-white drop-shadow-2xl select-none block',
      strokeWidth: currentSize.strokeWidth || 2.2,
      style: { width: '100%', height: '100%', display: 'block' }
    };

    switch (businessType) {
      case 'kiryana':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <ShoppingBasket {...iconProps} />
            {/* Subtle retail badge dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-md" />
          </div>
        );

      case 'pharmacy':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative p-1 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/30 shadow-inner`}>
            <Cross {...iconProps} strokeWidth={2.4} />
          </div>
        );

      case 'mobile':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Smartphone {...iconProps} />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 animate-ping opacity-75" />
          </div>
        );

      case 'clothing':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Shirt {...iconProps} />
          </div>
        );

      case 'shoes':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Footprints {...iconProps} />
          </div>
        );

      case 'cosmetics':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Sparkles {...iconProps} />
          </div>
        );

      case 'furniture':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Armchair {...iconProps} />
          </div>
        );

      case 'electronics':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Tv {...iconProps} />
          </div>
        );

      case 'hardware':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Wrench {...iconProps} />
          </div>
        );

      case 'autoparts':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Car {...iconProps} />
          </div>
        );

      case 'restaurant':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <UtensilsCrossed {...iconProps} />
          </div>
        );

      case 'bakery':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Cake {...iconProps} />
          </div>
        );

      case 'fruit_veg':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Apple {...iconProps} />
          </div>
        );

      case 'mandi':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Scale {...iconProps} />
          </div>
        );

      case 'commission':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Handshake {...iconProps} />
          </div>
        );

      case 'transport':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Truck {...iconProps} />
          </div>
        );

      case 'dairy':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Milk {...iconProps} />
          </div>
        );

      case 'meat_shop':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Beef {...iconProps} />
          </div>
        );

      case 'online_business':
      case 'online_seller':
      case 'whatsapp_seller':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <ShoppingBag {...iconProps} />
          </div>
        );

      case 'cafe':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Coffee {...iconProps} />
          </div>
        );

      case 'salon':
      case 'tailor':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Scissors {...iconProps} />
          </div>
        );

      case 'wholesale':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Boxes {...iconProps} />
          </div>
        );

      case 'home_business':
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Store {...iconProps} />
          </div>
        );

      default:
        return (
          <div className={`${currentSize.iconBox} flex items-center justify-center relative`}>
            <Building2 {...iconProps} />
          </div>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Emblem Frame */}
      <div
        className={`${currentSize.container} relative flex items-center justify-center overflow-hidden border-4 sm:border-[5px] md:border-6 shadow-2xl transition-all duration-300`}
        style={{
          borderColor: '#ffffff',
          backgroundColor: accentColor,
          boxShadow: `0 18px 46px -6px rgba(0,0,0,0.48), 0 0 0 2px rgba(255,255,255,0.7), inset 0 2px 10px rgba(255,255,255,0.3)`
        }}
      >
        {/* If user uploaded a custom logo, display it prominently without stretching or distortion */}
        {logoUrl ? (
          <div className="w-full h-full bg-white flex items-center justify-center p-1 sm:p-2 overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[42px]">
            <img
              src={logoUrl}
              alt={businessName || 'Business Logo'}
              className="w-full h-full max-w-full max-h-full object-contain select-none transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          /* Automatic Business Logo / Insignia - Visibly fills the area with impressive craft */
          <div className="w-full h-full flex items-center justify-center relative select-none">
            {/* Elegant gradient background depth & lighting */}
            <div
              className="absolute inset-0 opacity-45 mix-blend-overlay pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85), transparent 70%)'
              }}
            />
            {/* Subtle inner decorative circular ring */}
            <div className="absolute inset-1 sm:inset-1.5 rounded-[28px] sm:rounded-[36px] md:rounded-[42px] border border-white/20 pointer-events-none" />

            {/* Business-type Brand Icon - Visibly fills most of the frame */}
            <div className="flex items-center justify-center relative z-10 w-full h-full p-0.5 sm:p-1">
              {renderAutomaticInsignia()}
            </div>

            {/* First letter monogram watermark in background */}
            {businessName && (
              <span className={`absolute font-black opacity-10 text-white pointer-events-none ${currentSize.letterSize} select-none`}>
                {businessName.trim().charAt(0)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Verified / Active Shop Insignia Badge on opposite bottom corner */}
      {showBadge && (
        <div 
          className="absolute -bottom-1 -left-1 sm:-bottom-1.5 sm:-left-1.5 rtl:-left-auto rtl:-right-1 rtl:sm:-right-1.5 bg-amber-400 text-slate-950 p-1 sm:p-1.5 rounded-full border-2 border-white shadow-lg z-10"
          title="تصدیق شدہ دکان (Verified Shop)"
        >
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      )}
    </div>
  );
};
