import React from 'react';
import { BRAND_COLORS, BRAND_TAGLINE } from '../../assets/branding';

export type LogoVariant = 
  | 'primary'
  | 'tagline-primary'
  | 'reversed'
  | 'tagline-reversed'
  | 'black'
  | 'white'
  | 'on-pink'
  | 'symbol'
  | 'app-icon'
  | 'avatar'
  | 'favicon'
  | 'monogram';

interface BrandLogoProps {
  variant?: LogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showTagline?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  showTagline = false,
  onClick
}) => {
  const isDarkBg = variant === 'reversed' || variant === 'tagline-reversed' || variant === 'white';
  const isMonochromeBlack = variant === 'black';
  const isMonochromeWhite = variant === 'white';
  const isOnPink = variant === 'on-pink';

  // Letter & Hat colors based on Brand Guide v2.0
  let textColor = BRAND_COLORS.charcoal; // #1F1A1C
  let hatColor = BRAND_COLORS.pink; // #E4576E
  let taglineColor = '#64748B';

  if (isDarkBg) {
    textColor = '#FFFFFF';
    hatColor = isMonochromeWhite ? '#FFFFFF' : BRAND_COLORS.pink;
    taglineColor = 'rgba(255,255,255,0.7)';
  } else if (isMonochromeBlack) {
    textColor = BRAND_COLORS.charcoal;
    hatColor = BRAND_COLORS.charcoal;
    taglineColor = '#475569';
  } else if (isOnPink) {
    textColor = '#FFFFFF';
    hatColor = BRAND_COLORS.charcoal; // On pink bg, hat becomes charcoal!
    taglineColor = '#FFFFFF';
  }

  // Size scale
  const scale = {
    xs: { h: 18, textClass: 'text-sm', tagClass: 'text-[8px]', symbolSize: 22 },
    sm: { h: 22, textClass: 'text-base', tagClass: 'text-[9px]', symbolSize: 28 },
    md: { h: 28, textClass: 'text-xl', tagClass: 'text-[10px]', symbolSize: 36 },
    lg: { h: 36, textClass: 'text-2xl', tagClass: 'text-xs', symbolSize: 48 },
    xl: { h: 48, textClass: 'text-4xl', tagClass: 'text-xs', symbolSize: 64 },
    hero: { h: 72, textClass: 'text-6xl', tagClass: 'text-sm', symbolSize: 96 }
  }[size];

  // Camera Focus Frame Symbol [ o ]
  const renderCameraFocusSymbol = (hasSolidDot = false) => (
    <svg
      viewBox="0 0 100 100"
      width={scale.symbolSize}
      height={scale.symbolSize}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="toidep.net camera focus symbol"
    >
      {/* Top-Left Bracket */}
      <path
        d="M20 40 V 28 C 20 23.58 23.58 20 28 20 H 40"
        stroke={isDarkBg || variant === 'app-icon' || variant === 'avatar' || variant === 'favicon' ? '#FFFFFF' : textColor}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Top-Right Bracket (HỒNG GÓC ĐẸP #E4576E) */}
      <path
        d="M60 20 H 72 C 76.42 20 80 23.58 80 28 V 40"
        stroke={BRAND_COLORS.pink}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Bottom-Left Bracket */}
      <path
        d="M20 60 V 72 C 20 76.42 23.58 80 28 80 H 40"
        stroke={isDarkBg || variant === 'app-icon' || variant === 'avatar' || variant === 'favicon' ? '#FFFFFF' : textColor}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Bottom-Right Bracket */}
      <path
        d="M60 80 H 72 C 76.42 80 80 76.42 80 72 V 60"
        stroke={isDarkBg || variant === 'app-icon' || variant === 'avatar' || variant === 'favicon' ? '#FFFFFF' : textColor}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Center element: either solid dot for Favicon or letter 'o' oval */}
      {hasSolidDot ? (
        <circle 
          cx="50" 
          cy="50" 
          r="14" 
          fill={isDarkBg || variant === 'app-icon' || variant === 'avatar' || variant === 'favicon' ? '#FFFFFF' : textColor} 
        />
      ) : (
        <ellipse
          cx="50"
          cy="50"
          rx="18"
          ry="22"
          fill={isDarkBg || variant === 'app-icon' || variant === 'avatar' ? '#FFFFFF' : textColor}
        />
      )}
      {!hasSolidDot && (
        <ellipse
          cx="50"
          cy="50"
          rx="7"
          ry="11"
          fill={variant === 'app-icon' || variant === 'avatar' ? BRAND_COLORS.charcoal : (isDarkBg ? '#1F1A1C' : '#FFFFFF')}
        />
      )}
    </svg>
  );

  // App Icon Squircle
  if (variant === 'app-icon') {
    return (
      <div
        onClick={onClick}
        style={{ width: scale.symbolSize * 1.5, height: scale.symbolSize * 1.5 }}
        className={`rounded-3xl p-3 bg-[#1F1A1C] shadow-xl flex items-center justify-center select-none ${className}`}
      >
        {renderCameraFocusSymbol(false)}
      </div>
    );
  }

  // Round Avatar
  if (variant === 'avatar') {
    return (
      <div
        onClick={onClick}
        style={{ width: scale.symbolSize * 1.4, height: scale.symbolSize * 1.4 }}
        className={`rounded-full p-2.5 bg-[#1F1A1C] shadow-md flex items-center justify-center select-none border border-slate-800 ${className}`}
      >
        {renderCameraFocusSymbol(false)}
      </div>
    );
  }

  // Standalone Favicon symbol
  if (variant === 'favicon') {
    return (
      <div
        onClick={onClick}
        style={{ width: scale.symbolSize * 1.3, height: scale.symbolSize * 1.3 }}
        className={`rounded-2xl p-2 bg-[#1F1A1C] shadow-md flex items-center justify-center select-none ${className}`}
      >
        {renderCameraFocusSymbol(true)}
      </div>
    );
  }

  // Monogram [ ô ]
  if (variant === 'monogram') {
    return (
      <div
        onClick={onClick}
        style={{ width: scale.symbolSize * 1.3, height: scale.symbolSize * 1.3 }}
        className={`rounded-2xl bg-[#1F1A1C] shadow-md flex items-center justify-center select-none ${className}`}
      >
        <svg viewBox="0 0 60 60" width={scale.symbolSize} height={scale.symbolSize} fill="none">
          {/* Circumflex hat */}
          <path
            d="M22 24 L 30 16 L 38 24"
            stroke={BRAND_COLORS.pink}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Oval 'o' */}
          <ellipse cx="30" cy="36" rx="14" ry="16" fill="#FFFFFF" />
          <ellipse cx="30" cy="36" rx="6.5" ry="9" fill="#1F1A1C" />
        </svg>
      </div>
    );
  }

  // Standalone Camera Focus Symbol
  if (variant === 'symbol') {
    return (
      <div onClick={onClick} className={`inline-flex items-center select-none ${className}`}>
        {renderCameraFocusSymbol(false)}
      </div>
    );
  }

  // OFFICIAL V2.0 WORDMARK: "tôiđẹp" (Dựng chuẩn lưới 18m, dấu mũ góc hồng, dấu nặng thanh ngang)
  return (
    <div 
      onClick={onClick}
      className={`inline-flex flex-col select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {/* Precise SVG Vector of "tôiđẹp" */}
        <svg
          viewBox="0 0 420 150"
          height={scale.h}
          className="w-auto overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* --- Letter 't' --- */}
          {/* Vertical stem: x=24, y=42 to 114 */}
          <rect x="24" y="42" width="22" height="72" rx="4" fill={textColor} />
          {/* Crossbar of t at y=42: x=8 to 58 */}
          <rect x="8" y="42" width="50" height="18" rx="3" fill={textColor} />

          {/* --- Letter 'ô' --- */}
          {/* Pink Circumflex Hat (Góc hồng xoay 45°: đỉnh y=8, chân y=26) */}
          <path
            d="M84 27 L 108 9 L 132 27"
            stroke={hatColor}
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Outer circle of 'o': center=(108, 78), radius=(36, 36) */}
          <circle cx="108" cy="78" r="36" fill={textColor} />
          {/* Inner cutout of 'o' */}
          <ellipse 
            cx="108" 
            cy="78" 
            rx="15" 
            ry="20" 
            fill={isOnPink ? BRAND_COLORS.pink : (isDarkBg ? '#1F1A1C' : '#F6F5F1')} 
          />

          {/* --- Letter 'i' --- */}
          {/* Stem of 'i': x=160, y=42 to 114 */}
          <rect x="160" y="42" width="22" height="72" rx="4" fill={textColor} />
          {/* Dot of 'i' as rectangular bar at top: x=160, y=24 */}
          <rect x="160" y="22" width="22" height="14" rx="3" fill={textColor} />

          {/* --- Letter 'đ' --- */}
          {/* Circle bowl of 'd': center=(234, 78), r=36 */}
          <circle cx="234" cy="78" r="36" fill={textColor} />
          <ellipse 
            cx="234" 
            cy="78" 
            rx="15" 
            ry="20" 
            fill={isOnPink ? BRAND_COLORS.pink : (isDarkBg ? '#1F1A1C' : '#F6F5F1')} 
          />
          {/* Ascender stem of 'd': x=258, y=14 to 114 */}
          <rect x="258" y="14" width="22" height="100" rx="4" fill={textColor} />
          {/* Crossbar of 'đ': x=240 to 288 at y=32 */}
          <rect x="240" y="32" width="48" height="16" rx="3" fill={textColor} />

          {/* --- Letter 'ẹ' --- */}
          {/* Outer circle of 'e': center=(324, 78), r=36 */}
          <circle cx="324" cy="78" r="36" fill={textColor} />
          {/* Inner upper cutout of 'e' */}
          <path
            d="M304 70 H 344 C 344 58 334 50 324 50 C 314 50 304 58 304 70 Z"
            fill={isOnPink ? BRAND_COLORS.pink : (isDarkBg ? '#1F1A1C' : '#F6F5F1')}
          />
          {/* Lower mouth cutout of 'e' */}
          <path
            d="M344 76 H 304 C 304 88 313 96 324 96 C 333 96 340 91 343 85"
            stroke={isOnPink ? BRAND_COLORS.pink : (isDarkBg ? '#1F1A1C' : '#F6F5F1')}
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Dấu Nặng Chữ 'ẹ' chuẩn V2.0: NÉT GẠCH NGANG (Underline Bar rộng 6m) ở dưới chân chữ e! */}
          <rect x="306" y="122" width="36" height="12" rx="3" fill={textColor} />

          {/* --- Letter 'p' --- */}
          {/* Descender stem of 'p': x=376, y=42 to 142 */}
          <rect x="376" y="42" width="22" height="100" rx="4" fill={textColor} />
          {/* Circle bowl of 'p': center=(412, 78), r=36 */}
          <circle cx="412" cy="78" r="36" fill={textColor} />
          <ellipse 
            cx="412" 
            cy="78" 
            rx="15" 
            ry="20" 
            fill={isOnPink ? BRAND_COLORS.pink : (isDarkBg ? '#1F1A1C' : '#F6F5F1')} 
          />
        </svg>

        {/* Small Domain Accent */}
        <span 
          className="text-xs font-bold -mb-3 self-end select-none"
          style={{ color: BRAND_COLORS.pink }}
        >
          .net
        </span>
      </div>

      {/* Official Tagline: "NƠI BẠN ĐƯỢC LẤY NÉT" */}
      {(showTagline || variant === 'tagline-primary' || variant === 'tagline-reversed') && (
        <span
          className={`font-mono font-bold tracking-[0.22em] uppercase mt-1 ${scale.tagClass}`}
          style={{ color: taglineColor }}
        >
          {BRAND_TAGLINE}
        </span>
      )}
    </div>
  );
};
