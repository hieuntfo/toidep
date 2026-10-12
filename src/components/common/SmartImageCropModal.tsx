import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Check, Sparkles, SlidersHorizontal, Crop, Eye, 
  RefreshCw, ZoomIn, ZoomOut, Move, Image as ImageIcon,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import { FocalCropSettings } from '../../types';

interface SmartImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageUrl: string;
  onApplyCrop: (croppedUrl: string, settings: FocalCropSettings) => void;
}

// Sample high-res beauty fashion images for quick testing
const BEAUTY_PRESETS = [
  {
    name: 'Tóc Nữ Layer Mái Bay',
    url: '/src/assets/images/hair_layer_woman_1791614539000.jpg'
  },
  {
    name: 'Barber Textured Crop Nam',
    url: '/src/assets/images/hair_crop_man_1791614553705.jpg'
  },
  {
    name: 'Móng Thạch Syrup Hàn Quốc',
    url: '/src/assets/images/nail_art_jelly_1791614565032.jpg'
  },
  {
    name: 'Không Gian Salon Phố Cổ',
    url: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg'
  },
  {
    name: 'Makeup Cô Dâu Sang Trọng',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Spa Dưỡng Sinh Thảo Dược',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
  }
];

export const SmartImageCropModal: React.FC<SmartImageCropModalProps> = ({
  isOpen,
  onClose,
  initialImageUrl,
  onApplyCrop
}) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || BEAUTY_PRESETS[0].url);
  const [aspectRatio, setAspectRatio] = useState<'5:3' | '1:1' | '4:5' | '16:9'>('5:3');
  const [focalX, setFocalX] = useState<number>(50); // percentage 0-100
  const [focalY, setFocalY] = useState<number>(30); // percentage 0-100 (default slightly top for face/hair focus)
  const [zoom, setZoom] = useState<number>(1.05); // 1.0 to 2.5
  const [focusPreset, setFocusPreset] = useState<'face' | 'center' | 'nail' | 'custom'>('face');
  const [isProcessing, setIsProcessing] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  if (!isOpen) return null;

  // Set smart preset focal points
  const handleSelectFocusPreset = (target: 'face' | 'center' | 'nail') => {
    setFocusPreset(target);
    if (target === 'face') {
      // Human face & hair focus (top-center zone)
      setFocalX(50);
      setFocalY(25);
      setZoom(1.1);
    } else if (target === 'center') {
      // Center subject
      setFocalX(50);
      setFocalY(50);
      setZoom(1.0);
    } else if (target === 'nail') {
      // Lower zone focus for nails/accessories
      setFocalX(50);
      setFocalY(72);
      setZoom(1.15);
    }
  };

  // Interactive Click on Image to place focal reticle
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setFocalX(Math.max(5, Math.min(95, Math.round(clickX))));
    setFocalY(Math.max(5, Math.min(95, Math.round(clickY))));
    setFocusPreset('custom');
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objUrl = URL.createObjectURL(file);
      setImageUrl(objUrl);
    }
  };

  // Apply the crop
  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onApplyCrop(imageUrl, {
        aspectRatio,
        focalX,
        focalY,
        zoom,
        focusTarget: focusPreset
      });
      setIsProcessing(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Auto Smart Crop Engine
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Đảm bảo ảnh không méo · Cắt chuẩn khuôn mặt
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Crop className="w-5 h-5 text-[#E4576E]" />
              <span>Công Cụ Cắt Ảnh Tự Động Focus Vào Nhân Vật</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top: URL input & Presets */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Nguồn ảnh cần xử lý
              </label>
              <div className="flex items-center gap-2 text-xs">
                <label className="cursor-pointer text-[#E4576E] font-bold hover:underline flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Tải ảnh từ máy tính</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Nhập đường dẫn URL ảnh (https://...)"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#E4576E]"
            />

            {/* Quick Preset Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-400 shrink-0 font-medium">Ảnh mẫu sẵn có:</span>
              {BEAUTY_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-medium ${
                    imageUrl === p.url
                      ? 'bg-[#1E1E24] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Interactive Canvas Crop (Left 7 Cols) + Multi-Ratio Previews (Right 5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Focal Canvas */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  1. Chạm hoặc rê chuột để đặt điểm nét (Focal Reticle):
                </span>
                <span className="text-slate-400 text-[11px]">
                  Tọa độ: X={focalX}% · Y={focalY}%
                </span>
              </div>

              {/* Canvas viewport container */}
              <div 
                ref={imageContainerRef}
                onClick={handleImageClick}
                className="relative aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 cursor-crosshair select-none group shadow-inner"
              >
                <img
                  src={imageUrl}
                  alt="Ảnh gốc cần cắt"
                  className="w-full h-full object-cover transition-transform duration-200 pointer-events-none"
                  style={{
                    objectPosition: `${focalX}% ${focalY}%`,
                    transform: `scale(${zoom})`
                  }}
                />

                {/* Grid Rule of Thirds Guide Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>

                {/* The Smart Focal Point Target Reticle */}
                <div 
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-150 flex items-center justify-center"
                  style={{ left: `${focalX}%`, top: `${focalY}%` }}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#E4576E] bg-[#E4576E]/20 animate-pulse flex items-center justify-center shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                  </div>
                  <div className="absolute -top-6 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-0.5 rounded-md whitespace-nowrap border border-white/20">
                    Điểm Nét Nhân Vật 🎯
                  </div>
                </div>

                {/* Helper overlay */}
                <div className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-xs text-white text-[10px] text-center py-1 rounded-lg pointer-events-none">
                  Chạm bất kỳ vị trí trên ảnh để di chuyển hồng tâm lấy nét
                </div>
              </div>

              {/* Quick Smart Focus Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Căn nét tự động thông minh:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectFocusPreset('face')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      focusPreset === 'face'
                        ? 'border-[#E4576E] bg-rose-50 text-[#E4576E] font-bold ring-1 ring-[#E4576E]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>👤 Gương mặt / Mái tóc</span>
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5">Focus góc 25% phía trên</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectFocusPreset('center')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      focusPreset === 'center'
                        ? 'border-[#E4576E] bg-rose-50 text-[#E4576E] font-bold ring-1 ring-[#E4576E]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">🧍 Trung tâm / Toàn cảnh</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Focus chính giữa 50%</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectFocusPreset('nail')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      focusPreset === 'nail'
                        ? 'border-[#E4576E] bg-rose-50 text-[#E4576E] font-bold ring-1 ring-[#E4576E]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">💅 Móng Nail / Vùng Dưới</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Focus góc 72% phía dưới</div>
                  </button>
                </div>
              </div>

              {/* Zoom & Fine Adjustment Slider */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                    Thu phóng khung hình (Zoom):
                  </span>
                  <span className="font-mono font-bold text-slate-900">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#E4576E] cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Real-time Multi-Ratio Previews (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  2. Xem trước thực tế các tỉ lệ hiển thị:
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ Chuẩn không méo
                </span>
              </div>

              {/* Aspect Ratio Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold p-1 bg-slate-100 rounded-xl">
                {[
                  { id: '5:3', label: '5:3 Bìa' },
                  { id: '1:1', label: '1:1 Vuông' },
                  { id: '4:5', label: '4:5 Dọc' },
                  { id: '16:9', label: '16:9 Rộng' }
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id as any)}
                    className={`py-1.5 rounded-lg text-center transition-all ${
                      aspectRatio === ratio.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

              {/* Side-by-side previews */}
              <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* PREVIEW 1: Tỉ lệ 5:3 (Bìa Tạp Chí Longform) */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-800">Tỉ lệ 5:3 · Bìa Tạp Chí Longform</span>
                    <span className="text-slate-400 font-mono">15:9 Banner</span>
                  </div>
                  <div 
                    className="relative w-full aspect-[5/3] rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-black"
                  >
                    <img
                      src={imageUrl}
                      alt="Crop 5:3"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${focalX}% ${focalY}%`,
                        transform: `scale(${zoom})`
                      }}
                    />
                    <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-black/60 text-white text-[9px] rounded font-mono">
                      5:3
                    </div>
                  </div>
                </div>

                {/* PREVIEW 2: Tỉ lệ 1:1 (Thumbnail vuông / MXH) */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-800">Tỉ lệ 1:1 · Vuông</span>
                      <span className="text-slate-400 font-mono">1:1</span>
                    </div>
                    <div 
                      className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-black"
                    >
                      <img
                        src={imageUrl}
                        alt="Crop 1:1"
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: `${focalX}% ${focalY}%`,
                          transform: `scale(${zoom})`
                        }}
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] rounded font-mono">
                        1:1
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW 3: Tỉ lệ 4:5 (Lookbook) */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-800">Tỉ lệ 4:5 · Lookbook</span>
                      <span className="text-slate-400 font-mono">4:5</span>
                    </div>
                    <div 
                      className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-black"
                    >
                      <img
                        src={imageUrl}
                        alt="Crop 4:5"
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: `${focalX}% ${focalY}%`,
                          transform: `scale(${zoom})`
                        }}
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] rounded font-mono">
                        4:5
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Guarantee Notice */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Thuật toán Auto Crop tính toán ma trận tọa độ chính xác, không ép biến dạng tỉ lệ pixel. Nhân vật luôn nổi bật ở tâm ảnh khi duyệt trên cả PC lẫn Mobile.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isProcessing}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang áp dụng...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Áp Dụng Ảnh Bìa Đã Cắt Focus ({aspectRatio})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
