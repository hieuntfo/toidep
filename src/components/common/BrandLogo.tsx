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
  | 'wordmark-only';

interface BrandLogoProps {
  variant?: LogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showTagline?: boolean;
  showSymbol?: boolean;
  onClick?: () => void;
}

/**
 * toidep.net - Official Standard Keyvisual Logo
 * Đạt chuẩn nhận diện thương hiệu 100%:
 * 1. Biểu tượng: Khung ngắm máy ảnh (Viewfinder Reticle) với Góc Hồng Lấy Nét (#E4576E) trên cùng bên phải.
 * 2. Wordmark: "tôiđẹp.net" chuẩn font hình học, nét chữ đều đẹp, không bị méo hay co kéo.
 * 3. Điểm nhấn: Dấu mũ chữ "ô" màu Hồng Góc Đẹp (#E4576E) & dấu chấm dưới chữ "ẹ" màu Hồng Góc Đẹp.
 * 4. Tagline: "NƠI BẠN ĐƯỢC LẤY NÉT" chuẩn tracking.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  showTagline = false,
  showSymbol = true,
  onClick,
}) => {
  const isDarkBg = variant === 'reversed' || variant === 'tagline-reversed' || variant === 'white';
  const isMonochromeBlack = variant === 'black';
  const isMonochromeWhite = variant === 'white';
  const isOnPink = variant === 'on-pink';

  // Base colors
  let textColor = BRAND_COLORS.charcoal; // #1F1A1C
  let accentPink = BRAND_COLORS.pink;    // #E4576E
  let bracketColor = BRAND_COLORS.charcoal;
  let taglineColor = '#64748B';

  if (isDarkBg) {
    textColor = '#FFFFFF';
    bracketColor = 'rgba(255,255,255,0.85)';
    accentPink = isMonochromeWhite ? '#FFFFFF' : BRAND_COLORS.pink;
    taglineColor = 'rgba(255,255,255,0.7)';
  } else if (isMonochromeBlack) {
    textColor = BRAND_COLORS.charcoal;
    bracketColor = BRAND_COLORS.charcoal;
    accentPink = BRAND_COLORS.charcoal;
    taglineColor = '#475569';
  } else if (isOnPink) {
    textColor = '#FFFFFF';
    bracketColor = '#FFFFFF';
    accentPink = BRAND_COLORS.charcoal;
    taglineColor = 'rgba(255,255,255,0.9)';
  }

  // Dimension presets
  const sizeMap = {
    xs: { symbol: 20, text: 'text-sm', dot: 'w-1 h-1', dotBottom: '-bottom-0.5', hatH: 5, hatW: 7, hatTop: '-top-1', tag: 'text-[8px]' },
    sm: { symbol: 24, text: 'text-base', dot: 'w-1 h-1', dotBottom: '-bottom-0.5', hatH: 6, hatW: 8, hatTop: '-top-1', tag: 'text-[9px]' },
    md: { symbol: 28, text: 'text-xl', dot: 'w-1.5 h-1.5', dotBottom: '-bottom-1', hatH: 7, hatW: 9, hatTop: '-top-1.5', tag: 'text-[10px]' },
    lg: { symbol: 36, text: 'text-2xl', dot: 'w-2 h-2', dotBottom: '-bottom-1.5', hatH: 8, hatW: 11, hatTop: '-top-2', tag: 'text-xs' },
    xl: { symbol: 46, text: 'text-3xl', dot: 'w-2.5 h-2.5', dotBottom: '-bottom-2', hatH: 10, hatW: 13, hatTop: '-top-2.5', tag: 'text-sm' },
    hero: { symbol: 58, text: 'text-4xl sm:text-5xl', dot: 'w-3 h-3 sm:w-3.5 sm:h-3.5', dotBottom: '-bottom-2.5 sm:-bottom-3', hatH: 13, hatW: 16, hatTop: '-top-3 sm:-top-4', tag: 'text-sm sm:text-base' },
  }[size];

  // 1. Standalone App Icon / Favicon / Avatar
  if (variant === 'app-icon' || variant === 'avatar' || variant === 'favicon') {
    const isRound = variant === 'avatar';
    const boxDim = sizeMap.symbol * 1.5;
    return (
      <div
        onClick={onClick}
        style={{ width: boxDim, height: boxDim }}
        className={`inline-flex items-center justify-center bg-[#1F1A1C] shadow-lg shrink-0 select-none ${
          isRound ? 'rounded-full' : 'rounded-2xl'
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="toidep.net Official App Icon"
      >
        <svg
          viewBox="0 0 40 40"
          width={boxDim * 0.65}
          height={boxDim * 0.65}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Left Bracket */}
          <path d="M5 14 V8 A 3 3 0 0 1 8 5 H14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          {/* Top-Right Bracket (Signature Pink Viewfinder Angle) */}
          <path d="M26 5 H32 A 3 3 0 0 1 35 8 V14" stroke={BRAND_COLORS.pink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Bottom-Left Bracket */}
          <path d="M5 26 V32 A 3 3 0 0 0 8 35 H14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          {/* Bottom-Right Bracket */}
          <path d="M26 35 H32 A 3 3 0 0 0 35 32 V26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          {/* Center Focus Dot */}
          <circle cx="20" cy="20" r="4" fill={BRAND_COLORS.pink} />
        </svg>
      </div>
    );
  }

  // 2. Standalone Viewfinder Symbol
  if (variant === 'symbol') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center shrink-0 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="toidep.net Symbol"
      >
        <svg
          viewBox="0 0 40 40"
          width={sizeMap.symbol}
          height={sizeMap.symbol}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* Top-Left */}
          <path d="M5 14 V8 A 3 3 0 0 1 8 5 H14" stroke={bracketColor} strokeWidth="3" strokeLinecap="round" />
          {/* Top-Right Pink Corner */}
          <path d="M26 5 H32 A 3 3 0 0 1 35 8 V14" stroke={accentPink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Bottom-Left */}
          <path d="M5 26 V32 A 3 3 0 0 0 8 35 H14" stroke={bracketColor} strokeWidth="3" strokeLinecap="round" />
          {/* Bottom-Right */}
          <path d="M26 35 H32 A 3 3 0 0 0 35 32 V26" stroke={bracketColor} strokeWidth="3" strokeLinecap="round" />
          {/* Focus Pin */}
          <circle cx="20" cy="20" r="3.5" fill={accentPink} />
        </svg>
      </div>
    );
  }

  // 3. MASTER LOGO (Biểu Tượng Khung Ngắm + Chữ Chuẩn Font Hình Học "tôiđẹp.net")
  const renderSymbolElement = () => (
    <svg
      viewBox="0 0 40 40"
      width={sizeMap.symbol}
      height={sizeMap.symbol}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105"
    >
      {/* Top-Left Bracket */}
      <path d="M5 14 V8 A 3 3 0 0 1 8 5 H14" stroke={bracketColor} strokeWidth="3" strokeLinecap="round" />
      {/* Top-Right Pink Focus Corner (Góc Hồng Lấy Nét) */}
      <path d="M26 5 H32 A 3 3 0 0 1 35 8 V14" stroke={accentPink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-Left Bracket */}
      <path d="M5 26 V32 A 3 3 0 0 0 8 35 H14" stroke={bracketColor} strokeWidth="3" strokeLinecap="round" />
      {/* Bottom-Right Bracket */}
      <path d="M26 35 H32 A 3 3 0 0 0 35 32 V26" stroke={bracketColor} strokeWidth="3" strokeLinecap="round" />
      {/* Center Focus Dot */}
      <circle cx="20" cy="20" r="3.5" fill={accentPink} />
    </svg>
  );

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {/* Optical Camera Viewfinder Symbol */}
        {showSymbol && variant !== 'wordmark-only' && renderSymbolElement()}

        {/* Wordmark: tôiđẹp.net */}
        <div 
          className={`flex items-baseline font-extrabold tracking-tight font-sans ${sizeMap.text}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          {/* tôi: "t" + "o" (có mũ hồng) + "i" */}
          <span style={{ color: textColor }}>t</span>
          
          {/* Chữ 'o' với dấu mũ Hồng Góc Đẹp V2.0 */}
          <span className="relative inline-block" style={{ color: textColor }}>
            o
            <svg 
              className={`absolute left-1/2 -translate-x-1/2 ${sizeMap.hatTop}`}
              width={sizeMap.hatW}
              height={sizeMap.hatH}
              viewBox="0 0 12 8" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M2 7 L6 2 L10 7" 
                stroke={accentPink} 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </span>

          <span style={{ color: textColor }}>i</span>

          {/* đẹp: "đ" + "e" (có dấu chấm hồng dưới) + "p" */}
          <span style={{ color: textColor }} className="ml-[0.05em]">đ</span>

          {/* Chữ 'e' với Dấu Chấm Hồng Dưới Chuẩn Keyvisual */}
          <span className="relative inline-block" style={{ color: textColor }}>
            e
            <span 
              className={`absolute left-1/2 -translate-x-1/2 rounded-full ${sizeMap.dot} ${sizeMap.dotBottom}`}
              style={{ backgroundColor: accentPink }} 
            />
          </span>

          <span style={{ color: textColor }}>p</span>

          {/* .net */}
          <span 
            className="font-black ml-0.5 transition-colors"
            style={{ color: accentPink }}
          >
            .net
          </span>
        </div>
      </div>

      {/* Slogan / Tagline */}
      {(showTagline || variant === 'tagline-primary' || variant === 'tagline-reversed') && (
        <span
          className={`font-mono font-bold tracking-[0.24em] uppercase mt-1 pl-0.5 ${sizeMap.tag}`}
          style={{ color: taglineColor }}
        >
          {BRAND_TAGLINE}
        </span>
      )}
    </div>
  );
};
