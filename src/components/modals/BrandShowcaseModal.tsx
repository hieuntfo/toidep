import React, { useState } from 'react';
import { 
  X, Check, Copy, Palette, Eye, ShieldCheck, Sparkles, 
  Smartphone, Globe, User, Download, Grid, Layers, Ban, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { BRAND_COLORS, BRAND_TAGLINE, BRAND_SUBTITLE, BRAND_GRID_SPECS } from '../../assets/branding';
import { BrandLogo, LogoVariant } from '../common/BrandLogo';

interface BrandShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeConcept?: string;
  onSelectConcept?: (concept: any) => void;
}

export const BrandShowcaseModal: React.FC<BrandShowcaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'variants' | 'grid' | 'idea' | 'colors' | 'rules'>('variants');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedLogoVariant, setSelectedLogoVariant] = useState<LogoVariant>('primary');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const officialVariants: { id: LogoVariant; name: string; desc: string; bg: string }[] = [
    { id: 'primary', name: 'Logo Chính (Primary)', desc: 'Chữ màu Than #1F1A1C, dấu mũ hồng góc đẹp #E4576E', bg: 'bg-[#F6F5F1]' },
    { id: 'reversed', name: 'Logo Đảo Màu (Reversed)', desc: 'Chữ trắng, dấu mũ hồng trên nền tối Than #1F1A1C', bg: 'bg-[#1F1A1C]' },
    { id: 'tagline-primary', name: 'Logo + Tagline NƠI BẠN ĐƯỢC LẤY NÉT', desc: 'Phiên bản chính thức hoàn chỉnh kèm khẩu hiệu', bg: 'bg-[#F6F5F1]' },
    { id: 'black', name: 'Một Màu Than (Monochrome Than)', desc: 'Văn bản in ấn đơn sắc, hóa đơn, tài chính', bg: 'bg-[#F6F5F1]' },
    { id: 'white', name: 'Một Màu Trắng (Monochrome White)', desc: 'Ứng dụng nền tối đơn sắc hoặc watermark ảnh', bg: 'bg-[#1F1A1C]' },
    { id: 'on-pink', name: 'Trên Nền Hồng (On Pink BG)', desc: 'Chữ trắng, dấu mũ đổi sang màu Than #1F1A1C', bg: 'bg-[#E4576E]' },
    { id: 'symbol', name: 'Biểu Tượng Khung Ngắm [ o ]', desc: 'Khung ngắm máy ảnh với góc trên phải màu hồng', bg: 'bg-[#F6F5F1]' },
    { id: 'favicon', name: 'Favicon 16–32px [ • ]', desc: 'Khung ngắm với chấm tròn tâm thay chữ o cho kích thước nhỏ', bg: 'bg-[#1F1A1C]' },
    { id: 'app-icon', name: 'Icon App Squircle', desc: 'Biểu tượng ứng dụng trên màn hình iOS & Android', bg: 'bg-slate-200' },
    { id: 'avatar', name: 'Avatar MXH Tròn', desc: 'Avatar tròn chuẩn Facebook, Zalo, TikTok', bg: 'bg-slate-200' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#F6F5F1] text-[#1F1A1C] rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300/80 bg-white/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1F1A1C] flex items-center justify-center text-white">
              <BrandLogo variant="symbol" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#1F1A1C] font-mono tracking-tight">
                  TOIDEP.NET · LOGO CHÍNH THỨC · V2.0 · DỰNG TRÊN LƯỚI
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4576E] text-white">
                  Official
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {BRAND_TAGLINE} · {BRAND_SUBTITLE}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-300 flex gap-6 overflow-x-auto text-xs font-bold bg-white shrink-0">
          <button
            onClick={() => setActiveTab('variants')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'variants'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>04 · Phiên Bản ({officialVariants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('idea')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'idea'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>01 · Ý Tưởng Cốt Lõi</span>
          </button>

          <button
            onClick={() => setActiveTab('grid')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'grid'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Lưới Dựng Hình (Grid 18m)</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'colors'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>03 · Màu Nhận Diện</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Ban className="w-4 h-4 text-rose-500" />
            <span>05 · Quy Tắc Cấm (Don'ts)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* TAB 1: PHIÊN BẢN */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              {/* Main Stage Display */}
              <div className="p-8 rounded-3xl bg-white border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E4576E]">
                    Phiên bản đang chọn
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {officialVariants.find(v => v.id === selectedLogoVariant)?.name}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md">
                    {officialVariants.find(v => v.id === selectedLogoVariant)?.desc}
                  </p>
                </div>

                {/* Stage Box */}
                <div className={`p-8 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center shrink-0 min-w-[280px] ${
                  selectedLogoVariant === 'reversed' || selectedLogoVariant === 'tagline-reversed' || selectedLogoVariant === 'white'
                    ? 'bg-[#1F1A1C]'
                    : selectedLogoVariant === 'on-pink'
                    ? 'bg-[#E4576E]'
                    : 'bg-[#F6F5F1]'
                }`}>
                  <BrandLogo 
                    variant={selectedLogoVariant} 
                    size="lg" 
                    showTagline={selectedLogoVariant === 'tagline-primary' || selectedLogoVariant === 'tagline-reversed'} 
                  />
                </div>
              </div>

              {/* Grid of All Variants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {officialVariants.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLogoVariant(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedLogoVariant === item.id
                        ? 'border-[#E4576E] ring-2 ring-[#E4576E]/20 bg-white shadow-sm'
                        : 'border-slate-300/80 bg-white/70 hover:bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className={`h-24 rounded-xl flex items-center justify-center mb-3 border border-black/5 ${item.bg}`}>
                      <BrandLogo 
                        variant={item.id} 
                        size="sm" 
                        showTagline={item.id === 'tagline-primary' || item.id === 'tagline-reversed'} 
                      />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className={`font-semibold ${selectedLogoVariant === item.id ? 'text-[#E4576E]' : 'text-slate-400'}`}>
                        {selectedLogoVariant === item.id ? '● Đang chọn' : 'Bấm xem'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.id, item.id);
                        }}
                        className="text-slate-500 hover:text-slate-800"
                        title="Copy id"
                      >
                        {copiedKey === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Ý TƯỞNG CỐT LÕI (01 · Ý TƯỞNG) */}
          {activeTab === 'idea' && (
            <div className="space-y-6">
              <div className="p-8 bg-white rounded-3xl border border-slate-300 shadow-sm space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E4576E]">
                    01 · Ý TƯỞNG THIẾT KẾ
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Từ Khung Ngắm Máy Ảnh Đến Dấu Mũ Chữ "ô"
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Góc hồng của khung ngắm thành dấu mũ của chữ 'tôi'. Mọi dấu khác là một nét chung, đặt trên lưới 1m = chiều cao x ÷ 12."
                  </p>
                </div>

                {/* 4 Steps Evolution Diagram */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
                  <div className="p-4 bg-[#F6F5F1] rounded-2xl border border-slate-300 text-center space-y-3">
                    <div className="h-20 flex items-center justify-center">
                      <BrandLogo variant="symbol" size="md" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">1. Khung ngắm máy ảnh</div>
                    <p className="text-[11px] text-slate-500">Chữ o được lấy nét, góc trên phải màu hồng #E4576E</p>
                  </div>

                  <div className="p-4 bg-[#F6F5F1] rounded-2xl border border-slate-300 text-center space-y-3">
                    <div className="h-20 flex items-center justify-center">
                      <div className="w-12 h-12 border-t-8 border-r-8 border-[#E4576E] rounded-tr-xl" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">2. Tách góc hồng</div>
                    <p className="text-[11px] text-slate-500">Góc 90°, bo 1,2 x độ dày, chuẩn tỷ lệ</p>
                  </div>

                  <div className="p-4 bg-[#F6F5F1] rounded-2xl border border-slate-300 text-center space-y-3">
                    <div className="h-20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-10 h-6 mx-auto flex items-center justify-center">
                          <svg viewBox="0 0 32 20" className="w-8 h-5" fill="none">
                            <path d="M4 16 L 16 4 L 28 16" stroke={BRAND_COLORS.pink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="font-extrabold text-3xl text-slate-900">o</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900">3. Xoay 45°</div>
                    <p className="text-[11px] text-slate-500">Góc hồng xoay 45° thành dấu mũ: ô</p>
                  </div>

                  <div className="p-4 bg-[#F6F5F1] rounded-2xl border border-slate-300 text-center space-y-3">
                    <div className="h-20 flex items-center justify-center">
                      <BrandLogo variant="primary" size="sm" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">4. tôiđẹp hoàn thiện</div>
                    <p className="text-[11px] text-slate-500">toidep thành tôiđẹp, dấu nặng thanh ngang dưới e</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LƯỚI DỰNG HÌNH (GRID 18M) */}
          {activeTab === 'grid' && (
            <div className="space-y-6">
              <div className="p-8 bg-[#1F1A1C] text-white rounded-3xl border border-slate-800 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E4576E]">
                    BẢN VẼ KỸ THUẬT · LƯỚI DỰNG HÌNH V2.0
                  </span>
                  <h3 className="text-2xl font-bold mt-1">
                    Hệ Thống Lưới 1m = Chiều Cao x ÷ 12
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Nét dấu = 2m. Mọi đường ngang và khoảng chữ là bội số của m. Thân chữ Inter Display Black chuyển nét và chỉnh theo lưới.
                  </p>
                </div>

                {/* Grid Levels Table */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {BRAND_GRID_SPECS.levels.map((lvl) => (
                    <div key={lvl.level} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="font-mono font-bold text-[#E4576E]">{lvl.level}</span>
                      <span className="text-slate-300 text-[11px]">{lvl.label}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <p><strong>Khoảng chữ:</strong> thẳng–tròn 1m · chữ mở (t) 0,5m · thẳng–thẳng 1,25m · tròn–tròn 0,75m</p>
                  <p><strong>Thanh i:</strong> rộng đúng thân chữ i · <strong>Dấu nặng:</strong> rộng 6m = 1/2 chiều cao x · <strong>Gạch đ:</strong> trái 4m, phải 1,5m tính từ thân</p>
                  <p><strong>Dấu mũ:</strong> góc khung 90°, bo ngoài 1,2 x độ dày, dày 2,16m (bù thị giác +8% cho nét chéo màu sáng), rộng 0,70 chữ o</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MÀU NHẬN DIỆN (03 · MÀU) */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E4576E]">
                  03 · MÀU CHÍNH THỨC V2.0
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Bảng Màu Khắt Khe: Hồng Góc Đẹp · Than · Giấy
                </h3>
                <p className="text-xs text-slate-600">
                  Trên nền hồng, dấu nhấn đổi sang màu Than. Tương phản hồng/trắng 3,6:1, hồng/than 4,8:1 (đạt 3:1 cho đồ họa).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Hồng góc đẹp */}
                <div 
                  onClick={() => copyToClipboard(BRAND_COLORS.pink, 'c-pink')}
                  className="p-6 bg-white rounded-3xl border border-slate-300 cursor-pointer group hover:shadow-md transition-all space-y-3"
                >
                  <div className="h-24 rounded-2xl bg-[#E4576E] flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
                    {copiedKey === 'c-pink' ? 'ĐÃ COPY!' : '#E4576E'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Hồng Góc Đẹp</h4>
                    <p className="text-xs font-mono text-slate-500">RGB 228 · 87 · 110 | CMYK 0 · 75 · 40 · 0</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      <strong>Chỉ cho:</strong> Dấu mũ chữ ô / dấu sắc và điểm nhấn UI.
                    </p>
                  </div>
                </div>

                {/* 2. Than */}
                <div 
                  onClick={() => copyToClipboard(BRAND_COLORS.charcoal, 'c-charcoal')}
                  className="p-6 bg-white rounded-3xl border border-slate-300 cursor-pointer group hover:shadow-md transition-all space-y-3"
                >
                  <div className="h-24 rounded-2xl bg-[#1F1A1C] flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
                    {copiedKey === 'c-charcoal' ? 'ĐÃ COPY!' : '#1F1A1C'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Than</h4>
                    <p className="text-xs font-mono text-slate-500">RGB 31 · 26 · 28 | CMYK 0 · 15 · 10 · 90</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      <strong>Chữ, icon, nền tối:</strong> Đen than sâu không gắt mắt.
                    </p>
                  </div>
                </div>

                {/* 3. Giấy */}
                <div 
                  onClick={() => copyToClipboard(BRAND_COLORS.paper, 'c-paper')}
                  className="p-6 bg-white rounded-3xl border border-slate-300 cursor-pointer group hover:shadow-md transition-all space-y-3"
                >
                  <div className="h-24 rounded-2xl bg-[#F6F5F1] border border-slate-300 flex items-center justify-center text-slate-900 font-mono font-bold text-sm shadow-xs">
                    {copiedKey === 'c-paper' ? 'ĐÃ COPY!' : '#F6F5F1'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Giấy</h4>
                    <p className="text-xs font-mono text-slate-500">RGB 246 · 245 · 241 | CMYK 2 · 2 · 4 · 0</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      <strong>Nền sáng thay cho trắng tinh:</strong> Tone màu tạp chí cao cấp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: QUY TẮC CẤM (05 · KHÔNG LÀM) */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
                  05 · NGUYÊN TẮC CẤM (DON'TS)
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Bảo Vệ Tính Toàn Vẹn Của Nhận Diện toidep.net
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Không gõ lại bằng font có sẵn</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Chữ đã được chuyển nét và chỉnh sửa tỉ mỉ từng chi tiết theo hệ lưới m. Gõ font thường sẽ làm mất chuẩn dấu mũ và dấu nặng gạch ngang.
                  </p>
                </div>

                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Không đặt icon cạnh chữ</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Logo chữ "tôiđẹp" đứng độc lập. Dấu mũ ô chính là góc hồng của icon. Không ghép icon camera bên cạnh chữ tạo sự trùng lặp.
                  </p>
                </div>

                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Không đổi màu dấu mũ</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Dấu mũ chỉ có 2 màu: Hồng #E4576E (trên nền Than hoặc Giấy) hoặc Than #1F1A1C (khi đặt trên nền Hồng). Tuyệt đối không dùng màu khác.
                  </p>
                </div>

                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Không kéo giãn, làm méo</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Luôn giữ tỷ lệ khung và độ dày đồng nhất. Không áp dụng hiệu ứng 3D, bóng đổ dày, gradient cầu vồng hay viền stroke ngoài.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-300 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            toidep.net Brand Guidelines v2.0 · Tác giả: @Hieu Nguyen
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-white bg-[#1F1A1C] hover:bg-black rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
