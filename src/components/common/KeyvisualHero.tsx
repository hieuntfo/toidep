import React, { useState } from 'react';
import { 
  Sparkles, MapPin, Scissors, Calendar, ArrowRight, 
  CheckCircle, Shield, Star, Smartphone, Eye, ExternalLink, Play 
} from 'lucide-react';
import { BRAND_COLORS, BRAND_TAGLINE, BRAND_SUBTITLE, OFFICIAL_KEYVISUALS, KeyvisualItem } from '../../assets/branding';
import { BrandLogo } from './BrandLogo';

interface KeyvisualHeroProps {
  onBookPillar: (pillar: any) => void;
  onExploreDistrict: (district: string) => void;
  onOpenBrandStudio: () => void;
  onSelectPostById: (postId: string) => void;
}

export const KeyvisualHero: React.FC<KeyvisualHeroProps> = ({
  onBookPillar,
  onExploreDistrict,
  onOpenBrandStudio,
  onSelectPostById
}) => {
  const [activeKv, setActiveKv] = useState<'hero' | 'toc' | 'mong' | 'moi' | 'splash' | 'story'>('hero');

  // Helper to render the 4 Camera Focus Viewfinder Corners
  const renderFocusBrackets = (theme: 'charcoal' | 'pink' | 'paper') => {
    const isDark = theme === 'charcoal';
    const isPinkBg = theme === 'pink';
    const regularBracketColor = isPinkBg ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#1F1A1C');
    const cornerPinkColor = isPinkBg ? '#1F1A1C' : BRAND_COLORS.pink;

    return (
      <div className="absolute inset-4 sm:inset-8 pointer-events-none z-10">
        {/* Top-Left Bracket */}
        <div 
          className="absolute top-0 left-0 w-8 h-8 sm:w-14 sm:h-14 border-t-4 border-l-4 rounded-tl-2xl"
          style={{ borderColor: regularBracketColor }}
        />
        {/* Top-Right Bracket (GÓC HỒNG LẤY NÉT ĐẶC TRƯNG) */}
        <div 
          className="absolute top-0 right-0 w-8 h-8 sm:w-14 sm:h-14 border-t-4 border-r-4 rounded-tr-2xl shadow-sm"
          style={{ borderColor: cornerPinkColor }}
        />
        {/* Bottom-Left Bracket */}
        <div 
          className="absolute bottom-0 left-0 w-8 h-8 sm:w-14 sm:h-14 border-b-4 border-l-4 rounded-bl-2xl"
          style={{ borderColor: regularBracketColor }}
        />
        {/* Bottom-Right Bracket */}
        <div 
          className="absolute bottom-0 right-0 w-8 h-8 sm:w-14 sm:h-14 border-b-4 border-r-4 rounded-br-2xl"
          style={{ borderColor: regularBracketColor }}
        />
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 border border-slate-800">
      {/* Top Segmented Tab Switcher Bar */}
      <div className="bg-[#181416] px-4 sm:px-8 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => setActiveKv('hero')}
            className={`px-3.5 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all ${
              activeKv === 'hero'
                ? 'bg-white text-[#1F1A1C] shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            ✦ KV Master Hero
          </button>

          <button
            onClick={() => setActiveKv('toc')}
            className={`px-3.5 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeKv === 'toc'
                ? 'bg-[#E4576E] text-white shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scissors className="w-3 h-3" />
            <span>tóc đẹp</span>
          </button>

          <button
            onClick={() => setActiveKv('mong')}
            className={`px-3.5 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeKv === 'mong'
                ? 'bg-[#E4576E] text-white shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>móng đẹp</span>
          </button>

          <button
            onClick={() => setActiveKv('moi')}
            className={`px-3.5 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeKv === 'moi'
                ? 'bg-[#E4576E] text-white shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className="w-3 h-3" />
            <span>môi đẹp</span>
          </button>

          <button
            onClick={() => setActiveKv('splash')}
            className={`px-3.5 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeKv === 'splash'
                ? 'bg-white text-[#1F1A1C] shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>App Splash</span>
          </button>

          <button
            onClick={() => setActiveKv('story')}
            className={`px-3.5 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeKv === 'story'
                ? 'bg-white text-[#1F1A1C] shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Story 9:16</span>
          </button>
        </div>

        {/* Brand System Trigger */}
        <button
          onClick={onOpenBrandStudio}
          className="text-xs font-semibold text-rose-300 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-[#E4576E]" />
          <span>Brand Guide V2.0 & Lưới Dựng Hình</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* --- KV 01: MASTER HERO (1920x1080 Landscape) --- */}
      {activeKv === 'hero' && (
        <div className="relative bg-[#1F1A1C] text-white min-h-[460px] sm:min-h-[520px] p-8 sm:p-14 flex flex-col justify-between overflow-hidden">
          {renderFocusBrackets('charcoal')}

          {/* Top Label */}
          <div className="relative z-20 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[#E4576E] tracking-widest uppercase font-bold text-[11px]">
              toidep.net · Official Keyvisual
            </span>
            <span className="hidden sm:inline font-mono tracking-wider">
              Khung ngắm lấy nét: Góc hồng xoay 45° thành dấu mũ ô
            </span>
          </div>

          {/* Center Stage: Giant Wordmark & Slogan */}
          <div className="relative z-20 my-auto text-center py-6 sm:py-10 space-y-4">
            <div className="flex justify-center">
              <BrandLogo variant="reversed" size="hero" showTagline={false} />
            </div>

            {/* Slogan V2.0: "NƠI BẠN ĐƯỢC LẤY NÉT" */}
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.25em] uppercase text-white font-mono">
              {BRAND_TAGLINE}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
              {BRAND_SUBTITLE}. Mỗi bức ảnh tóc, móng, makeup đều gắn với salon và thợ thật tại Hà Nội — bấm một nút để đặt lịch.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => onBookPillar({
                  id: 'toc',
                  styleName: 'Layer Sóng Lơi + Mái Bay',
                  salonName: 'Aurora Hair Atelier',
                  salonDistrict: 'Hoàn Kiếm, Hà Nội',
                  priceFrom: '250.000đ'
                })}
                className="px-6 py-3 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-lg flex items-center gap-2 group"
              >
                <span>Lấy nét diện mạo của bạn</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenBrandStudio}
                className="px-5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-colors backdrop-blur-md"
              >
                Xem Bản Vẽ Lưới Dựng Hình
              </button>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-mono pt-4 border-t border-white/10">
            <span className="font-bold text-white">toidep.net</span>
            <span className="text-[11px] text-slate-400">Mạng xã hội ảnh làm đẹp, có địa chỉ</span>
          </div>
        </div>
      )}

      {/* --- KV 02: TÓC ĐẸP (kv-post-toc-dep) --- */}
      {activeKv === 'toc' && (
        <div className="relative bg-[#1F1A1C] text-white min-h-[460px] p-8 sm:p-14 flex flex-col justify-between overflow-hidden">
          {renderFocusBrackets('charcoal')}

          <div className="relative z-20 flex justify-between text-xs text-slate-400 font-mono">
            <span className="text-[#E4576E] font-bold">KV 01 · TÓC ĐẸP</span>
            <span>Nền Than #1F1A1C</span>
          </div>

          {/* Giant Typography Center: "tóc đẹp" */}
          <div className="relative z-20 my-auto text-center py-6 space-y-3">
            <div className="flex flex-col items-center">
              {/* Giant SVG "tóc đẹp" with pink acute accent on ó and horizontal bar under e */}
              <div className="font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-white font-sans flex items-baseline">
                <span>t</span>
                <span className="relative">
                  <span>o</span>
                  {/* Pink Acute Accent #E4576E */}
                  <span className="absolute -top-3 sm:-top-5 right-1 w-5 sm:w-8 h-2 sm:h-3.5 bg-[#E4576E] -rotate-45 rounded-sm" />
                </span>
                <span>c</span>
                <span className="ml-3 sm:ml-6">đ</span>
                <span className="relative">
                  <span>e</span>
                  {/* Horizontal Bar under e */}
                  <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-7 sm:w-11 h-1.5 sm:h-2.5 bg-white rounded-xs" />
                </span>
                <span>p</span>
              </div>
            </div>

            <div className="font-mono text-sm sm:text-lg font-bold tracking-[0.25em] text-slate-300 uppercase pt-2">
              {BRAND_TAGLINE}
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Layer nữ Hàn Quốc, uốn sóng bung hippie, textured crop nam tính tại các salon hàng đầu Hà Nội.
            </p>

            <div className="pt-3">
              <button
                onClick={() => onBookPillar({
                  id: 'toc',
                  styleName: 'Layer Sóng Lơi + Mái Bay',
                  salonName: 'Aurora Hair Atelier',
                  salonDistrict: 'Hoàn Kiếm, Hà Nội',
                  priceFrom: '250.000đ'
                })}
                className="px-6 py-3 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <span>Làm kiểu tóc này tại Salon</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10 font-mono">
            <BrandLogo variant="reversed" size="xs" showTagline={false} />
            <span className="text-white font-bold">toidep.net</span>
          </div>
        </div>
      )}

      {/* --- KV 03: MÓNG ĐẸP (kv-post-mong-dep) --- */}
      {activeKv === 'mong' && (
        <div className="relative bg-[#E4576E] text-white min-h-[460px] p-8 sm:p-14 flex flex-col justify-between overflow-hidden">
          {renderFocusBrackets('pink')}

          <div className="relative z-20 flex justify-between text-xs text-white/80 font-mono">
            <span className="font-bold text-[#1F1A1C]">KV 02 · MÓNG ĐẸP</span>
            <span>Nền Hồng Góc Đẹp #E4576E</span>
          </div>

          {/* Giant Typography Center: "móng đẹp" */}
          <div className="relative z-20 my-auto text-center py-6 space-y-3">
            <div className="flex flex-col items-center">
              <div className="font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-white font-sans flex items-baseline">
                <span>m</span>
                <span className="relative">
                  <span>o</span>
                  {/* Acute Accent in Charcoal on Pink BG */}
                  <span className="absolute -top-3 sm:-top-5 right-1 w-5 sm:w-8 h-2 sm:h-3.5 bg-[#1F1A1C] -rotate-45 rounded-sm" />
                </span>
                <span>n</span>
                <span>g</span>
                <span className="ml-3 sm:ml-6">đ</span>
                <span className="relative">
                  <span>e</span>
                  {/* Horizontal Bar under e */}
                  <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-7 sm:w-11 h-1.5 sm:h-2.5 bg-white rounded-xs" />
                </span>
                <span>p</span>
              </div>
            </div>

            <div className="font-mono text-sm sm:text-lg font-bold tracking-[0.25em] text-white/90 uppercase pt-2">
              {BRAND_TAGLINE}
            </div>

            <p className="text-xs text-white/80 max-w-md mx-auto">
              Nail thạch syrup trong veo, nhũ ngọc trai, ẩn xà cừ và combi manicure không đau chuẩn Nga.
            </p>

            <div className="pt-3">
              <button
                onClick={() => onBookPillar({
                  id: 'mong',
                  styleName: 'Nail Thạch Syrup + Nhũ Ngọc Trai',
                  salonName: 'Luna & Co Nail Studio',
                  salonDistrict: 'Hai Bà Trưng, Hà Nội',
                  priceFrom: '220.000đ'
                })}
                className="px-6 py-3 text-xs font-bold text-[#1F1A1C] bg-white hover:bg-slate-100 rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <span>Làm mẫu móng này tại Tiệm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-between text-xs text-white/80 pt-4 border-t border-white/20 font-mono">
            <BrandLogo variant="on-pink" size="xs" showTagline={false} />
            <span className="font-bold text-white">toidep.net</span>
          </div>
        </div>
      )}

      {/* --- KV 04: MÔI ĐẸP (kv-post-moi-dep) --- */}
      {activeKv === 'moi' && (
        <div className="relative bg-[#F6F5F1] text-[#1F1A1C] min-h-[460px] p-8 sm:p-14 flex flex-col justify-between overflow-hidden">
          {renderFocusBrackets('paper')}

          <div className="relative z-20 flex justify-between text-xs text-slate-500 font-mono">
            <span className="text-[#E4576E] font-bold">KV 03 · MÔI ĐẸP</span>
            <span>Nền Giấy #F6F5F1</span>
          </div>

          {/* Giant Typography Center: "môi đẹp" */}
          <div className="relative z-20 my-auto text-center py-6 space-y-3">
            <div className="flex flex-col items-center">
              <div className="font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-[#1F1A1C] font-sans flex items-baseline">
                <span>m</span>
                <span className="relative">
                  <span>o</span>
                  {/* Circumflex Hat on ô in Pink #E4576E */}
                  <span className="absolute -top-4 sm:-top-7 left-1/2 -translate-x-1/2">
                    <svg viewBox="0 0 40 24" className="w-7 sm:w-11 h-4 sm:h-7" fill="none">
                      <path d="M4 20 L 20 4 L 36 20" stroke={BRAND_COLORS.pink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span>i</span>
                <span className="ml-3 sm:ml-6">đ</span>
                <span className="relative">
                  <span>e</span>
                  {/* Horizontal Bar under e */}
                  <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-7 sm:w-11 h-1.5 sm:h-2.5 bg-[#1F1A1C] rounded-xs" />
                </span>
                <span>p</span>
              </div>
            </div>

            <div className="font-mono text-sm sm:text-lg font-bold tracking-[0.25em] text-slate-600 uppercase pt-2">
              {BRAND_TAGLINE}
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Soft glam dự tiệc, môi hồng đất collagen tự nhiên và makeup cô dâu rạng rỡ suốt 12 giờ.
            </p>

            <div className="pt-3">
              <button
                onClick={() => onBookPillar({
                  id: 'moi',
                  styleName: 'Soft Glam Makeup & Môi Hồng Đất',
                  salonName: 'Belle Atelier Makeup',
                  salonDistrict: 'Ba Đình, Hà Nội',
                  priceFrom: '450.000đ'
                })}
                className="px-6 py-3 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <span>Đặt lịch Makeup & Môi này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-300/80 font-mono">
            <BrandLogo variant="primary" size="xs" showTagline={false} />
            <span className="font-bold text-[#1F1A1C]">toidep.net</span>
          </div>
        </div>
      )}

      {/* --- KV 05: APP SPLASH (kv-app-splash-1170x2532) --- */}
      {activeKv === 'splash' && (
        <div className="relative bg-[#1F1A1C] text-white min-h-[460px] p-8 sm:p-14 flex items-center justify-center overflow-hidden">
          <div className="relative z-20 flex flex-col items-center text-center space-y-6 max-w-sm">
            {/* The Camera Focus Icon with center o */}
            <BrandLogo variant="symbol" size="hero" />

            <div className="space-y-2">
              <BrandLogo variant="reversed" size="lg" showTagline={false} />
              <div className="font-mono text-xs font-bold tracking-[0.25em] text-slate-400 uppercase pt-2">
                {BRAND_TAGLINE}
              </div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 w-full space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Tỷ lệ khung hình:</span>
                <span className="font-mono font-bold text-white">1170 x 2532 (iPhone Super Retina)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Biểu tượng:</span>
                <span className="text-rose-300 font-semibold">[ o ] Chữ o được lấy nét</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- KV 06: STORY (kv-story-1080x1920) --- */}
      {activeKv === 'story' && (
        <div className="relative bg-[#1F1A1C] text-white min-h-[500px] p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
          {renderFocusBrackets('charcoal')}

          <div className="relative z-20 text-center space-y-1">
            <span className="text-[10px] font-mono text-[#E4576E] tracking-widest uppercase">
              Story Lookbook 9:16
            </span>
          </div>

          {/* Stacked Vertical "tôi" / "đẹp" Typography */}
          <div className="relative z-20 my-auto text-center space-y-2">
            <div className="font-black text-6xl sm:text-8xl tracking-tight leading-none text-white font-sans">
              <span className="relative block">
                <span>tô</span>
                {/* Circumflex hat */}
                <span className="absolute -top-4 left-[58%] -translate-x-1/2">
                  <svg viewBox="0 0 40 24" className="w-8 sm:w-12 h-5 sm:h-8" fill="none">
                    <path d="M4 20 L 20 4 L 36 20" stroke={BRAND_COLORS.pink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>i</span>
              </span>
              <span className="relative block mt-1">
                <span>đẹp</span>
                {/* Horizontal Bar under e */}
                <span className="absolute -bottom-2 left-[52%] -translate-x-1/2 w-10 sm:w-14 h-2 sm:h-3 bg-white rounded-xs" />
              </span>
            </div>

            <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-slate-300 uppercase pt-3">
              {BRAND_TAGLINE}
            </div>

            {/* Pink Story CTA button */}
            <div className="pt-4 max-w-xs mx-auto">
              <button
                onClick={() => onSelectPostById('post-1')}
                className="w-full py-3.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-2xl shadow-xl transition-all"
              >
                Đăng ảnh đẹp đầu tiên của bạn
              </button>
            </div>
          </div>

          <div className="relative z-20 text-center font-mono text-xs text-slate-400">
            toidep.net
          </div>
        </div>
      )}
    </section>
  );
};
