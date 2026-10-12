import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Compass, Star, Phone, ArrowRight, Scissors, 
  RefreshCw, CheckCircle2, AlertCircle, ExternalLink, SlidersHorizontal,
  Car, Footprints, ShieldCheck, Sparkles, LocateFixed, Eye, Share2, Check,
  Crown, Award, Layers, Filter, Sparkle
} from 'lucide-react';
import { Salon, Post, HanoiDistrict, CategoryType } from '../../types';

interface NearMeViewProps {
  salons: Salon[];
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onViewSalon: (salonId: string) => void;
  onBookNow: (post: Post, salon: Salon) => void;
}

// Coordinate definitions for Hanoi key districts & landmarks
const HANOI_DISTRICT_COORDS: Record<string, { lat: number; lng: number; label: string; landmark: string }> = {
  'Hoàn Kiếm': { lat: 21.0285, lng: 105.8542, label: 'Hoàn Kiếm, Hà Nội', landmark: 'Hồ Gươm & Phố Cổ' },
  'Ba Đình': { lat: 21.0341, lng: 105.8336, label: 'Ba Đình, Hà Nội', landmark: 'Kim Mã & Liễu Giai' },
  'Cầu Giấy': { lat: 21.0362, lng: 105.7905, label: 'Cầu Giấy, Hà Nội', landmark: 'Duy Tân & Xuân Thủy' },
  'Đống Đa': { lat: 21.0180, lng: 105.8299, label: 'Đống Đa, Hà Nội', landmark: 'Chùa Bộc & Thái Hà' },
  'Tây Hồ': { lat: 21.0581, lng: 105.8234, label: 'Tây Hồ, Hà Nội', landmark: 'Quảng An & Xuân Diệu' },
  'Hai Bà Trưng': { lat: 21.0084, lng: 105.8504, label: 'Hai Bà Trưng, Hà Nội', landmark: 'Bà Triệu & Mai Hắc Đế' },
  'Thanh Xuân': { lat: 20.9980, lng: 105.8083, label: 'Thanh Xuân, Hà Nội', landmark: 'Nguyễn Trãi & Royal City' },
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
  const [onlyVip, setOnlyVip] = useState<boolean>(false);
  const [selectedSalonId, setSelectedSalonId] = useState<string>(salons[0]?.id || '');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [mapZoomLevel, setMapZoomLevel] = useState<number>(1);

  const handleShareNearMe = async () => {
    const shareData = {
      title: `Bản đồ dịch vụ làm đẹp gần ${locationName} — toidep.net`,
      text: `Khám phá các salon làm đẹp uy tín, Acc VIP có gắn sao ⭐ & tích xanh trong bán kính ${activeRadius}km quanh ${locationName}`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback
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

  // Detect GPS Location on request via HTML5 Geolocation
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
  }).sort((a, b) => {
    // Prioritize VIP Accounts slightly if equal, or sort strictly by distance
    if (a.isVip && !b.isVip && Math.abs(a.dynamicDistance - b.dynamicDistance) < 1.0) return -1;
    if (!a.isVip && b.isVip && Math.abs(a.dynamicDistance - b.dynamicDistance) < 1.0) return 1;
    return a.dynamicDistance - b.dynamicDistance;
  });

  // Filter salons within active radius AND selected service category AND VIP filter
  const filteredSalons = enrichedSalons.filter(s => {
    // Distance filter
    if (activeRadius > 0 && s.dynamicDistance > activeRadius) return false;
    
    // VIP Only filter
    if (onlyVip && !s.isVip) return false;

    // Service category filter
    if (selectedCategory !== 'all') {
      const services = s.servicesProvided || [];
      const priceItems = s.priceItems || [];
      const hasCategoryInServices = services.includes(selectedCategory as any);
      const hasCategoryInPrices = priceItems.some(p => p.category === selectedCategory);
      if (!hasCategoryInServices && !hasCategoryInPrices) {
        return false;
      }
    }

    return true;
  });

  const activeSalon = filteredSalons.find(s => s.id === selectedSalonId) || filteredSalons[0] || salons[0];
  const salonPosts = posts.filter(p => p.salonId === activeSalon?.id);

  // Category counts
  const categoryCounts = {
    all: enrichedSalons.filter(s => activeRadius === 0 || s.dynamicDistance <= activeRadius).length,
    hair_female: enrichedSalons.filter(s => (activeRadius === 0 || s.dynamicDistance <= activeRadius) && (s.servicesProvided?.includes('hair_female') || s.priceItems.some(p => p.category === 'hair_female'))).length,
    hair_male: enrichedSalons.filter(s => (activeRadius === 0 || s.dynamicDistance <= activeRadius) && (s.servicesProvided?.includes('hair_male') || s.priceItems.some(p => p.category === 'hair_male'))).length,
    nail: enrichedSalons.filter(s => (activeRadius === 0 || s.dynamicDistance <= activeRadius) && (s.servicesProvided?.includes('nail') || s.priceItems.some(p => p.category === 'nail'))).length,
    makeup: enrichedSalons.filter(s => (activeRadius === 0 || s.dynamicDistance <= activeRadius) && (s.servicesProvided?.includes('makeup') || s.priceItems.some(p => p.category === 'makeup'))).length,
    spa_skincare: enrichedSalons.filter(s => (activeRadius === 0 || s.dynamicDistance <= activeRadius) && (s.servicesProvided?.includes('spa_skincare') || s.priceItems.some(p => p.category === 'spa_skincare'))).length,
  };

  // Helper to determine category icon
  const getCategoryIcon = (salon: Salon) => {
    const s = salon.servicesProvided || [];
    if (s.includes('hair_male') || salon.name.toLowerCase().includes('barber')) return '💈';
    if (s.includes('nail') || salon.name.toLowerCase().includes('nail')) return '💅';
    if (s.includes('makeup') || salon.name.toLowerCase().includes('makeup')) return '💄';
    if (s.includes('spa_skincare') || salon.name.toLowerCase().includes('spa')) return '🧖‍♀️';
    return '💇‍♀️';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 1. Location Bar & GPS Controller */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E4576E] flex items-center justify-center shrink-0 border border-rose-100 shadow-xs">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E4576E]">
                  Định vị GPS & Bản đồ Dịch Vụ Làm Đẹp Xung Quanh
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
                Quét toàn bộ salon tóc nữ, barber nam, nail thạch, makeup và spa dưỡng sinh theo cự ly thực tế
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
              Trình duyệt chưa được cấp quyền vị trí GPS. Đừng lo, bạn có thể bấm chọn nhanh quận bên dưới để hệ thống quét salon ngay!
            </span>
          </div>
        )}

        {/* District Quick Chooser Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
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
            <span className="text-slate-500 font-semibold">Bán kính quét:</span>
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
                {km === 0 ? 'Toàn TP' : `${km} km`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Service Category Filter Bar & VIP Priority Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Service Category Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-[#E4576E]" /> Dịch vụ:
            </span>
            {[
              { id: 'all', label: 'Tất cả dịch vụ', icon: '✨', count: categoryCounts.all },
              { id: 'hair_female', label: 'Tóc Nữ & Uốn Lơi', icon: '💇‍♀️', count: categoryCounts.hair_female },
              { id: 'hair_male', label: 'Barber & Tóc Nam', icon: '💈', count: categoryCounts.hair_male },
              { id: 'nail', label: 'Nail & Móng Thạch', icon: '💅', count: categoryCounts.nail },
              { id: 'makeup', label: 'Makeup & Cô Dâu', icon: '💄', count: categoryCounts.makeup },
              { id: 'spa_skincare', label: 'Spa & Dưỡng Sinh', icon: '🧖‍♀️', count: categoryCounts.spa_skincare },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#1E1E24] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* VIP Acc Filter Toggle */}
          <button
            onClick={() => setOnlyVip(!onlyVip)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto ${
              onlyVip 
                ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300' 
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
            title="Chỉ hiển thị các cơ sở tài khoản VIP có gắn sao ⭐ và tích xanh xác thực"
          >
            <Star className={`w-3.5 h-3.5 ${onlyVip ? 'fill-white' : 'fill-amber-500 text-amber-500'}`} />
            <span>Ưu tiên Acc VIP ⭐ & Tích Xanh</span>
          </button>
        </div>

        {/* Service summary counter */}
        <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span>Tìm thấy <strong>{filteredSalons.length}</strong> cơ sở làm đẹp trong bán kính {activeRadius > 0 ? `${activeRadius}km` : 'toàn thành phố'}</span>
            <span>·</span>
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {filteredSalons.filter(s => s.isVip).length} cơ sở Acc VIP đóng tiền bảo chứng
            </span>
          </div>
          <span className="text-slate-400">
            Bấm vào bất kỳ điểm ghim trên bản đồ để xem chi tiết bảng giá
          </span>
        </div>
      </div>

      {/* 3. Main Grid: Interactive Geographic Radar Map (7 Cols) + Selected Salon Details (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Vector Radar Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[500px] p-6 flex flex-col justify-between">
            {/* Visual Hanoi Map Coordinate Grid */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>

            {/* Simulated River / Waterway of Hanoi (Red River & West Lake Curve) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 450" preserveAspectRatio="none">
                <path d="M 0,100 Q 150,50 300,120 T 600,180" fill="none" stroke="#38BDF8" strokeWidth="18" />
                <circle cx="280" cy="90" r="45" fill="#38BDF8" opacity="0.3" />
              </svg>
            </div>

            {/* Radar Concentric Distance Rings from User Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              {/* 1km ring */}
              <div className="w-44 h-44 rounded-full border border-rose-500/25 flex items-start justify-center pt-1">
                <span className="text-[9px] font-mono text-rose-400/60 uppercase">1 km</span>
              </div>
              {/* 3km ring */}
              <div className="absolute w-72 h-72 rounded-full border border-rose-500/20 flex items-start justify-center pt-1">
                <span className="text-[9px] font-mono text-rose-400/50 uppercase">3 km</span>
              </div>
              {/* 5km ring */}
              <div className="absolute w-96 h-96 rounded-full border border-dashed border-rose-500/15 flex items-start justify-center pt-1">
                <span className="text-[9px] font-mono text-rose-400/40 uppercase">5 km</span>
              </div>
              {/* Pulsing radar sweep */}
              <div className="absolute w-80 h-80 rounded-full bg-radial from-rose-500/10 via-transparent to-transparent animate-pulse" />
            </div>

            {/* Top Map Controls Overlay */}
            <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-white gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md font-semibold flex items-center gap-2 border border-slate-700">
                <Compass className="w-4 h-4 text-[#E4576E]" />
                <span>
                  Bản Đồ Làm Đẹp Hà Nội · {activeRadius > 0 ? `Bán kính ≤ ${activeRadius}km` : 'Toàn Thành Phố'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 px-2.5 py-1 bg-amber-950/80 rounded-lg border border-amber-800 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Acc VIP Có Gắn Sao ⭐</span>
                </span>
                <span className="text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/80 rounded-lg border border-emerald-800">
                  {filteredSalons.length} Điểm Ghim
                </span>
              </div>
            </div>

            {/* Interactive Pins Field on Map */}
            <div className="relative z-10 my-auto py-8">
              {/* User Center GPS Marker */}
              <div className="mb-6 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs backdrop-blur-md shadow-lg">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E4576E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E4576E]"></span>
                  </div>
                  <span className="font-bold">Vị trí của bạn: {locationName.split('·')[0].trim()}</span>
                </div>
              </div>

              {/* Pins Grid with Full Beauty Services & VIP Highlighting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredSalons.map((salon) => {
                  const isSelected = activeSalon?.id === salon.id;
                  const categoryIcon = getCategoryIcon(salon);
                  const isVipDiamond = salon.vipTier === 'vip_diamond';
                  const isVipGold = salon.vipTier === 'vip_gold';

                  return (
                    <button
                      key={salon.id}
                      onClick={() => setSelectedSalonId(salon.id)}
                      className={`relative p-3.5 rounded-2xl backdrop-blur-md text-left transition-all group ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-2xl scale-102 ring-2 ring-[#E4576E] z-20'
                          : salon.isVip
                            ? 'bg-slate-900/90 text-white border border-amber-500/60 hover:border-amber-400 hover:bg-slate-800'
                            : 'bg-slate-900/75 text-white border border-slate-700/80 hover:bg-slate-800'
                      }`}
                    >
                      {/* VIP Floating Star Badge on top of Pin */}
                      {salon.isVip && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md border border-amber-300">
                          <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                          <span>{isVipDiamond ? 'VIP Kim Cương' : 'VIP Vàng'}</span>
                        </div>
                      )}

                      {/* Header Row: Distance & Service Icon */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base select-none">{categoryIcon}</span>
                          <span className="text-[11px] font-bold text-[#E4576E]">
                            {salon.dynamicDistance} km
                          </span>
                        </div>
                        <span className={`text-[10px] ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                          ~{Math.max(1, Math.round(salon.dynamicDistance * 3))} ph xe
                        </span>
                      </div>

                      {/* Salon Name with Star and Verification */}
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold truncate">{salon.name}</h4>
                        {salon.isVip && (
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                        )}
                        {salon.isVerified && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </div>

                      {/* District & Services Line */}
                      <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>
                        {salon.address}
                      </p>

                      {/* Price Estimate preview */}
                      <div className="mt-2 pt-1.5 border-t border-slate-800/40 flex items-center justify-between text-[10px]">
                        <span className={isSelected ? 'text-slate-500' : 'text-slate-400'}>
                          Giá từ: <strong className="text-[#E4576E]">{salon.priceItems[0]?.price.split('-')[0].trim() || '180.000đ'}</strong>
                        </span>
                        <span className="text-emerald-400 font-semibold text-[9px]">
                          ● Đang mở cửa
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Map Banner & Directions CTA */}
            <div className="relative z-10 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% cơ sở đã xác thực địa chỉ, cam kết chất lượng theo toidep.net
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

        {/* Right Side: Selected Salon Details & VIP Certification Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {activeSalon ? (
            <div className={`bg-white rounded-3xl border p-6 shadow-sm space-y-5 transition-all ${
              activeSalon.isVip ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}>
              {/* VIP Account Crown Banner if Acc VIP */}
              {activeSalon.isVip && (
                <div className="p-3 bg-linear-to-r from-amber-500/10 via-amber-400/5 to-transparent rounded-2xl border border-amber-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <span>{activeSalon.vipBadgeText || 'TÀI KHOẢN VIP ĐỐI TÁC'}</span>
                      </div>
                      <p className="text-[11px] text-amber-900 font-medium mt-0.2">
                        Đã đóng phí bảo chứng toidep.net · Ưu tiên giữ lịch hẹn 100%
                      </p>
                    </div>
                  </div>
                  <Crown className="w-5 h-5 text-amber-500 shrink-0" />
                </div>
              )}

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
                        <span title="Đã xác thực giấy phép GPKD">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <span>{activeSalon.name}</span>
                      {activeSalon.isVip && (
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      )}
                    </h3>
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

              {/* Full Services Breakdown for this Salon */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Dịch vụ làm đẹp tiêu biểu tại cơ sở
                </h4>
                <div className="space-y-1.5">
                  {activeSalon.priceItems.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <span className="text-slate-400 text-[11px]">•</span>
                        <span className="text-slate-800 font-medium truncate">{item.name}</span>
                      </div>
                      <span className="text-[#E4576E] font-bold shrink-0">{item.price}</span>
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
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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

              {/* Salon Lookbook Photos */}
              {salonPosts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Mẫu tác phẩm thực hiện tại salon ({salonPosts.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {salonPosts.slice(0, 2).map((post) => (
                      <div
                        key={post.id}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer aspect-4/3"
                        onClick={() => onSelectPost(post)}
                      >
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  Xem Bảng Giá & Profile
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
              <p className="font-semibold text-sm">Không tìm thấy cơ sở làm đẹp phù hợp</p>
              <p className="text-xs">Hãy tăng bán kính lên hoặc chọn quận khác trên thanh công cụ.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
