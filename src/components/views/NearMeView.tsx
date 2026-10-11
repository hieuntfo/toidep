import React, { useState } from 'react';
import { MapPin, Navigation, Compass, CheckCircle, Star, Phone, ArrowRight, Scissors } from 'lucide-react';
import { Salon, Post } from '../../types';

interface NearMeViewProps {
  salons: Salon[];
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onViewSalon: (salonId: string) => void;
  onBookNow: (post: Post, salon: Salon) => void;
}

export const NearMeView: React.FC<NearMeViewProps> = ({
  salons,
  posts,
  onSelectPost,
  onViewSalon,
  onBookNow
}) => {
  const [activeRadius, setActiveRadius] = useState<number>(3); // 3km default
  const [userLocation, setUserLocation] = useState<string>('Tràng Tiền, Hoàn Kiếm, Hà Nội');
  const [selectedSalonId, setSelectedSalonId] = useState<string>(salons[0]?.id || '');

  const selectedSalon = salons.find(s => s.id === selectedSalonId) || salons[0];
  const salonPosts = posts.filter(p => p.salonId === selectedSalon?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Location Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E4576E] flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#E4576E]">
              Vị trí hiện tại của bạn tại Hà Nội
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {userLocation}
            </h2>
          </div>
        </div>

        {/* Radius filter pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Bán kính quét:</span>
          {[1, 3, 5].map((km) => (
            <button
              key={km}
              onClick={() => setActiveRadius(km)}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                activeRadius === km
                  ? 'bg-[#1E1E24] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Trong {km} km
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map representation + Salons List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Hanoi Map Simulation (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-lg min-h-[420px] p-6 flex flex-col justify-between">
            {/* Visual stylized street grid svg */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Top map overlay */}
            <div className="relative z-10 flex items-center justify-between text-xs text-white">
              <div className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#E4576E]" />
                <span>Bản đồ Salon Hà Nội · Bán kính {activeRadius}km</span>
              </div>
              <span className="text-slate-400">Tìm thấy {salons.length} salon đạt chuẩn</span>
            </div>

            {/* Interactive Pins on Map */}
            <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-4 py-8">
              {salons.map((salon) => (
                <button
                  key={salon.id}
                  onClick={() => setSelectedSalonId(salon.id)}
                  className={`p-3 rounded-xl backdrop-blur-md border text-left transition-all ${
                    selectedSalonId === salon.id
                      ? 'bg-white text-slate-900 shadow-xl scale-105 border-[#E4576E]'
                      : 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className={`w-3.5 h-3.5 ${selectedSalonId === salon.id ? 'text-[#E4576E]' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E]">
                      Cách {salon.distanceKm || '1.0'} km
                    </span>
                  </div>
                  <h4 className="text-xs font-bold truncate">{salon.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{salon.district}</p>
                </button>
              ))}
            </div>

            {/* Bottom map banner */}
            <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>Định vị chính xác theo GPS & Tọa độ quận Hoàn Kiếm, Cầu Giấy, Hai Bà Trưng</span>
              <span className="text-emerald-400 font-semibold">● 100% Salon mở cửa nhận khách</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Salon Spotlight & Available Styles (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            {/* Salon Header Card */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedSalon.avatar}
                  alt={selectedSalon.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-base">{selectedSalon.name}</h3>
                    {selectedSalon.isVerified && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {selectedSalon.rating}
                    </span>
                    <span>({selectedSalon.reviewsCount} đánh giá thật)</span>
                    <span>·</span>
                    <span className="text-[#E4576E] font-semibold">Cách {selectedSalon.distanceKm} km</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewSalon(selectedSalon.id)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Xem trang salon đầy đủ"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedSalon.description}
            </p>

            <div className="text-xs text-slate-600 space-y-1 py-2 border-y border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedSalon.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedSalon.phone} · {selectedSalon.openHours}</span>
              </div>
            </div>

            {/* Popular Lookbook styles by this salon */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#E4576E]" />
                Tác phẩm tiêu biểu tại salon này ({salonPosts.length})
              </h4>

              <div className="space-y-2.5">
                {salonPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="flex items-center gap-3 p-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group bg-slate-50/50"
                  >
                    <img
                      src={post.images[0]}
                      alt={post.styleName}
                      className="w-12 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#E4576E] transition-colors">
                        {post.styleName}
                      </h5>
                      <span className="text-[11px] font-extrabold text-[#E4576E] block mt-0.5">
                        {post.priceEstimate}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookNow(post, selectedSalon);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-lg transition-colors shadow-2xs shrink-0"
                    >
                      Đặt ngay
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onViewSalon(selectedSalon.id)}
              className="w-full py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Xem toàn bộ bảng giá & thợ tại {selectedSalon.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
