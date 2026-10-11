import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Compass, Star, Phone, ArrowRight, Scissors, 
  RefreshCw, CheckCircle2, AlertCircle, ExternalLink, SlidersHorizontal,
  Car, Footprints, ShieldCheck, Sparkles, LocateFixed, Eye, Share2, Check
} from 'lucide-react';
import { Salon, Post, HanoiDistrict } from '../../types';

interface NearMeViewProps {
  salons: Salon[];
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onViewSalon: (salonId: string) => void;
  onBookNow: (post: Post, salon: Salon) => void;
}

// Coordinate definitions for Hanoi key districts
const HANOI_DISTRICT_COORDS: Record<string, { lat: number; lng: number; label: string; landmark: string }> = {
  'Hoàn Kiếm': { lat: 21.0285, lng: 105.8542, label: 'Hoàn Kiếm, Hà Nội', landmark: 'Hồ Gươm & Phố Cổ' },
  'Ba Đình': { lat: 21.0341, lng: 105.8336, label: 'Ba Đình, Hà Nội', landmark: 'Kim Mã & Liễu Giai' },
  'Cầu Giấy': { lat: 21.0362, lng: 105.7905, label: 'Cầu Giấy, Hà Nội', landmark: 'Duy Tân & Xuân Thủy' },
  'Đống Đa': { lat: 21.0180, lng: 105.8299, label: 'Đống Đa, Hà Nội', landmark: 'Chùa Bộc & Thái Hà' },
  'Tây Hồ': { lat: 21.0581, lng: 105.8234, label: 'Tây Hồ, Hà Nội', landmark: 'Quảng An & Xuân Diệu' },
  'Hai Bà Trưng': { lat: 21.0084, lng: 105.8504, label: 'Hai Bà Trưng, Hà Nội', landmark: 'Bà Triệu & Mai Hắc Đế' },
  'Thanh Xuân': { lat: 20.9980, lng: 105.8083, label: 'Thanh Xuân, Hà Nội', landmark: 'Nguyễn Trãi & Royal City' },
  'Nam Từ Liêm': { lat: 21.0135, lng: 105.7681, label: 'Nam Từ Liêm, Hà Nội', landmark: 'Mỹ Đình & Keangnam' },
  'Hà Đông': { lat: 20.9719, lng: 105.7766, label: 'Hà Đông, Hà Nội', landmark: 'Quang Trung & Vạn Phúc' },
};

// Haversine formula to calculate distance in km
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const NearMeView: React.FC<NearMeViewProps> = ({
  salons,
  posts,
  onSelectPost,
  onViewSalon,
  onBookNow
}) => {
  // User GPS coordinates (default: Hoàn Kiếm, Hanoi center)
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 21.0285,
    lng: 105.8542
  });
  const [locationName, setLocationName] = useState<string>('Tràng Tiền, Hoàn Kiếm, Hà Nội');
  const [locationMethod, setLocationMethod] = useState<'gps' | 'preset'>('preset');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'denied'>('idle');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  // Filters
  const [activeRadius, setActiveRadius] = useState<number>(5); // 5km default
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Hoàn Kiếm');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSalonId, setSelectedSalonId] = useState<string>(salons[0]?.id || '');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleShareNearMe = async () => {
    const shareData = {
      title: `Salon làm đẹp gần ${locationName} — toidep.net`,
      text: `Khám phá các salon uy tín trong bán kính ${activeRadius}km quanh ${locationName}`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Detect GPS Location on request
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      return;
    }

    setGpsStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setGpsAccuracy(Math.round(accuracy));
        setLocationMethod('gps');
        setGpsStatus('success');

        // Check closest known district for friendly name
        let closestDist = Infinity;
        let closestName = 'Khu vực của bạn';
        for (const [distName, info] of Object.entries(HANOI_DISTRICT_COORDS)) {
          const d = calculateHaversineDistance(latitude, longitude, info.lat, info.lng);
          if (d < closestDist) {
            closestDist = d;
            closestName = info.label;
          }
        }
        setLocationName(`Tọa độ GPS (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E) · Gần ${closestName}`);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGpsStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Change manual district preset
  const handleSelectDistrict = (districtName: string) => {
    setSelectedDistrict(districtName);
    const target = HANOI_DISTRICT_COORDS[districtName];
    if (target) {
      setCoords({ lat: target.lat, lng: target.lng });
      setLocationName(target.label);
      setLocationMethod('preset');
      setGpsStatus('idle');
    }
  };

  // Calculate real dynamic distance for each salon based on current user coords
  const enrichedSalons = salons.map(salon => {
    const sLat = salon.latitude || 21.0285;
    const sLng = salon.longitude || 105.8542;
    const distanceKm = calculateHaversineDistance(coords.lat, coords.lng, sLat, sLng);
    return {
      ...salon,
      dynamicDistance: distanceKm
    };
  }).sort((a, b) => a.dynamicDistance - b.dynamicDistance);

  // Filter salons within active radius
  const filteredSalons = enrichedSalons.filter(s => {
    if (activeRadius > 0 && s.dynamicDistance > activeRadius) return false;
    return true;
  });

  const activeSalon = filteredSalons.find(s => s.id === selectedSalonId) || filteredSalons[0] || salons[0];
  const salonPosts = posts.filter(p => p.salonId === activeSalon?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Location Bar & GPS Controller */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E4576E] flex items-center justify-center shrink-0 border border-rose-100">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E4576E]">
                  Định vị người dùng & Salon xung quanh
                </span>
                {locationMethod === 'gps' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    GPS thời gian thực (±{gpsAccuracy}m)
                  </span>
                )}
                {locationMethod === 'preset' && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Theo quận đã chọn
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E4576E] shrink-0" />
                <span>{locationName}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Khoảng cách đo đạc chính xác theo công thức cầu chuẩn Haversine từ vị trí thực tế của bạn
              </p>
            </div>
          </div>

          {/* GPS Quick Action & Share */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDetectGps}
              disabled={gpsStatus === 'locating'}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#E4576E] hover:bg-[#d84860] text-white transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
              title="Sử dụng GPS thiết bị để quét salon gần nhất"
            >
              {gpsStatus === 'locating' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang xác định GPS...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-4 h-4" />
                  <span>Bật GPS vị trí của tôi</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareNearMe}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
              title="Chia sẻ danh sách salon gần bạn"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Chia sẻ vị trí</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GPS Denied Notice */}
        {gpsStatus === 'denied' && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Trình duyệt chưa được cấp quyền vị trí GPS. Đừng lo, bạn có thể bấm chọn quận bên dưới để hệ thống tính khoảng cách ngay!
            </span>
          </div>
        )}

        {/* District Quick Chooser Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0 mr-1">Chọn nhanh quận:</span>
            {Object.keys(HANOI_DISTRICT_COORDS).map((district) => (
              <button
                key={district}
                onClick={() => handleSelectDistrict(district)}
                className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                  selectedDistrict === district && locationMethod === 'preset'
                    ? 'bg-[#1E1E24] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {district}
              </button>
            ))}
          </div>

          {/* Radius filter pills */}
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <span className="text-slate-500 font-semibold">Bán kính:</span>
            {[1, 3, 5, 10, 0].map((km) => (
              <button
                key={km}
                onClick={() => setActiveRadius(km)}
                className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                  activeRadius === km
                    ? 'bg-[#E4576E] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {km === 0 ? 'Tất cả' : `${km} km`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map View + Salons List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Hanoi Map Simulation (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl min-h-[460px] p-6 flex flex-col justify-between">
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
            <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-white gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#E4576E]" />
                <span>
                  Bản đồ Salon Hà Nội · {activeRadius > 0 ? `Bán kính ≤ ${activeRadius}km` : 'Toàn khu vực'}
                </span>
              </div>
              <span className="text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/80 rounded-md border border-emerald-800">
                Tìm thấy {filteredSalons.length} salon phù hợp
              </span>
            </div>

            {/* User Center Point Marker on Map */}
            <div className="relative z-10 my-auto py-4">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E4576E] animate-ping" />
                <span>Bạn đang ở: {locationName}</span>
              </div>

              {/* Interactive Pins on Map */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredSalons.map((salon) => (
                  <button
                    key={salon.id}
                    onClick={() => setSelectedSalonId(salon.id)}
                    className={`p-3.5 rounded-2xl backdrop-blur-md border text-left transition-all ${
                      activeSalon?.id === salon.id
                        ? 'bg-white text-slate-900 shadow-2xl scale-102 border-[#E4576E] ring-2 ring-[#E4576E]/30'
                        : 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1">
                        <MapPin className={`w-3.5 h-3.5 ${activeSalon?.id === salon.id ? 'text-[#E4576E]' : 'text-rose-400'}`} />
                        <span className="text-[11px] font-bold text-[#E4576E]">
                          {salon.dynamicDistance} km
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        ~{Math.max(1, Math.round(salon.dynamicDistance * 3))} ph xe
                      </span>
                    </div>
                    <h4 className="text-xs font-bold truncate">{salon.name}</h4>
                    <p className={`text-[10px] truncate mt-0.5 ${activeSalon?.id === salon.id ? 'text-slate-500' : 'text-slate-400'}`}>
                      {salon.address}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom map banner */}
            <div className="relative z-10 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Salon đã xác minh địa chỉ và nhận đặt hẹn qua toidep.net
              </span>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeSalon?.address || 'Hà Nội')}`}
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-[#E4576E] flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Mở Google Maps chỉ đường</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Salon Details & Lookbook Showcase (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {activeSalon ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              {/* Salon Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeSalon.avatar}
                    alt={activeSalon.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E]">
                        Gần bạn nhất · Cách {activeSalon.dynamicDistance} km
                      </span>
                      {activeSalon.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeSalon.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {activeSalon.rating} ({activeSalon.reviewsCount})
                      </span>
                      <span>·</span>
                      <span className="truncate">{activeSalon.district}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewSalon(activeSalon.id)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Xem toàn bộ trang Salon"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Address & Travel Info */}
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-[#E4576E] shrink-0 mt-0.5" />
                  <span>{activeSalon.address}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-slate-600" />
                    Đi xe: ~{Math.max(1, Math.round(activeSalon.dynamicDistance * 3))} phút
                  </span>
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-slate-600" />
                    Đi bộ: ~{Math.max(2, Math.round(activeSalon.dynamicDistance * 12))} phút
                  </span>
                  <span className="text-emerald-600 font-semibold">● Đang mở cửa</span>
                </div>
              </div>

              {/* Price Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Bảng giá dịch vụ tiêu biểu
                </h4>
                <div className="space-y-1.5">
                  {activeSalon.priceItems.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-800 font-medium">{item.name}</span>
                      <span className="text-[#E4576E] font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stylists at this Salon */}
              {activeSalon.stylists.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Thợ chính đang trực ca
                  </h4>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {activeSalon.stylists.map((st) => (
                      <div key={st.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                        <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-800">{st.name}</div>
                          <div className="text-[10px] text-slate-400">{st.title.split('·')[0]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Salon Lookbook Photos (Làm kiểu này trực tiếp) */}
              {salonPosts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Mẫu tóc thực hiện tại salon này ({salonPosts.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {salonPosts.slice(0, 2).map((post) => (
                      <div
                        key={post.id}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer"
                        onClick={() => onSelectPost(post)}
                      >
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                          <p className="text-[11px] font-bold truncate">{post.title}</p>
                          <span className="text-[10px] text-rose-300 font-semibold">{post.priceEstimate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Call to Action */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onViewSalon(activeSalon.id)}
                  className="flex-1 py-3 px-4 bg-[#1E1E24] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs text-center"
                >
                  Xem trang & Menu dịch vụ
                </button>
                {salonPosts[0] && (
                  <button
                    onClick={() => onBookNow(salonPosts[0], activeSalon)}
                    className="py-3 px-4 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Làm kiểu tại đây</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-sm">Không có salon trong bán kính {activeRadius}km</p>
              <p className="text-xs">Hãy tăng bán kính lên 10km hoặc chọn quận khác phía trên.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
