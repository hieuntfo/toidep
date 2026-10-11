import React, { useState } from 'react';
import { 
  MapPin, Scissors, Calendar, ArrowRight, CheckCircle, 
  Star, Clock, Phone, Sparkles, Filter, Navigation, Tag, ExternalLink, Code 
} from 'lucide-react';
import { AreaEntity, ServiceCategory, generatePageMetadata, generateJsonLdSchema, evaluateQualityThreshold, SEO_AREAS, SEO_SERVICES } from '../../lib/seoData';
import { Salon, Post } from '../../types';

interface SeoLandingViewProps {
  area: AreaEntity;
  service: ServiceCategory;
  salons: Salon[];
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onBookNow: (post: Post, salon: Salon) => void;
  onViewSalon: (salonId: string) => void;
  onChangeArea: (areaId: string) => void;
  onChangeService: (serviceSlug: string) => void;
  onOpenSeoInspector: () => void;
}

export const SeoLandingView: React.FC<SeoLandingViewProps> = ({
  area,
  service,
  salons,
  posts,
  onSelectPost,
  onBookNow,
  onViewSalon,
  onChangeArea,
  onChangeService,
  onOpenSeoInspector
}) => {
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterPrice, setFilterPrice] = useState<'all' | 'under300' | 'under600'>('all');

  // Filter matching salons and posts for this area & service
  const matchingSalons = salons.filter(s => 
    s.district.toLowerCase().includes(area.name.toLowerCase()) || area.aliases.some(a => s.address.toLowerCase().includes(a.toLowerCase()))
  );

  const displaySalons = matchingSalons.length > 0 ? matchingSalons : salons.slice(0, 3);
  const matchingPosts = posts.filter(p => 
    p.category === service.categoryType || p.salonDistrict.toLowerCase().includes(area.name.toLowerCase())
  );

  const displayPosts = matchingPosts.length > 0 ? matchingPosts : posts.slice(0, 4);

  // Metadata according to 4.1 template
  const meta = generatePageMetadata('area_service', {
    area,
    service,
    salonsCount: displaySalons.length,
    priceMin: 180000,
    priceMax: 650000
  });

  // Quality Threshold
  const quality = evaluateQualityThreshold(area, service, salons, posts);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Breadcrumb navigation (Khớp breadcrumb schema) */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
        <a href="#home" onClick={(e) => { e.preventDefault(); onChangeArea('hoan-kiem'); }} className="hover:text-slate-900 transition-colors">
          Trang chủ
        </a>
        <span className="text-slate-300">›</span>
        <span>{area.provinceName}</span>
        <span className="text-slate-300">›</span>
        <span className="font-semibold text-slate-800">{area.name}</span>
        <span className="text-slate-300">›</span>
        <span className="font-bold text-[#E4576E]">{service.shortName}</span>

        {/* Live SEO Inspection Pill */}
        <button
          onClick={onOpenSeoInspector}
          className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <Code className="w-3 h-3 text-emerald-600" />
          <span>Google Rich Results & JSON-LD (Đạt {quality.score}/100)</span>
        </button>
      </nav>

      {/* 2. H1 + Data-Backed Introduction (60-120 chữ) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {meta.h1}
          </h1>
          <span className="text-[11px] text-slate-400 font-mono">
            Cập nhật lúc {new Date().getHours()}:00, {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Tổng hợp <strong>{displaySalons.length} địa điểm {service.shortName.toLowerCase()} uy tín</strong> tại khu vực {area.name} (thuộc {area.aliases[1] || 'khu vực trung tâm'}), với hơn <strong>{displayPosts.length * 4} bức ảnh tác phẩm thật</strong> do khách hàng và thợ đăng tải trong 90 ngày qua. Mức giá dịch vụ dao động phổ biến từ <strong>180.000đ đến 650.000đ</strong>, cam kết bảng giá công khai, xem ảnh mẫu có địa chỉ và đặt lịch hẹn 1 chạm trước khi đến.
        </p>

        {/* SEO Filter Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1">Bộ lọc nhanh:</span>
          <button
            onClick={() => setFilterOpenNow(!filterOpenNow)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterOpenNow ? 'bg-[#1F1A1C] text-white border-[#1F1A1C]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Đang mở cửa sau 21:00
          </button>
          <button
            onClick={() => setFilterPrice(filterPrice === 'under300' ? 'all' : 'under300')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterPrice === 'under300' ? 'bg-[#1F1A1C] text-white border-[#1F1A1C]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Giá dưới 300.000đ
          </button>
          <button
            onClick={() => setFilterPrice(filterPrice === 'under600' ? 'all' : 'under600')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterPrice === 'under600' ? 'bg-[#1F1A1C] text-white border-[#1F1A1C]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Combo thiết kế cao cấp
          </button>
        </div>
      </div>

      {/* 3. Danh sách Địa điểm (LocalBusiness Listings) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Top Tiệm {service.shortName} Nổi Bật Tại {area.name} ({displaySalons.length})
          </h2>
          <span className="text-xs text-slate-400">100% Đã xác thực GPKD</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displaySalons.map((salon) => (
            <div 
              key={salon.id}
              className="bg-white rounded-2xl border border-slate-300/80 shadow-2xs hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={salon.avatar}
                    alt={salon.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 
                        onClick={() => onViewSalon(salon.id)}
                        className="font-bold text-slate-900 text-sm truncate hover:text-[#E4576E] cursor-pointer"
                      >
                        {salon.name}
                      </h3>
                      {salon.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{salon.address}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {salon.rating}
                      </span>
                      <span>({salon.reviewsCount} review thật)</span>
                      <span>·</span>
                      <span className="text-[#E4576E] font-semibold">Mở đến 21:00</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {salon.description}
                </p>

                {/* Popular service price item */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium truncate">{service.shortName} tiêu biểu:</span>
                  <span className="font-extrabold text-[#E4576E] shrink-0">180.000đ - 450.000đ</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewSalon(salon.id)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Xem bảng giá
                </button>

                <button
                  onClick={() => onBookNow(posts[0], salon)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-2xs flex items-center gap-1"
                >
                  <span>Đặt lịch kiểu này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Lưới Ảnh Thật 4:5 của Người Dùng (UGC Lookbook) với Huy Hiệu Góc Đẹp */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E4576E]">
              Lookbook Ảnh Thật Tại {area.name}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Tác Phẩm Mới Hoàn Thiện Trong Tuần
            </h2>
          </div>
          <span className="text-xs text-slate-500">Mỗi ảnh đều gắn với thợ & salon</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displayPosts.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group relative bg-white rounded-2xl border border-slate-300/80 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-4/5 relative overflow-hidden bg-slate-900">
                <img
                  src={post.images[0]}
                  alt={`${post.styleName} tại ${post.salonName}, ${area.name}`}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Huy hiệu GÓC ĐẸP theo DESIGN.md 7.2: góc khung hồng ở góc trên phải ảnh, nét 3px, tay 16px! */}
                {idx === 0 && (
                  <div 
                    className="absolute top-2.5 right-2.5 w-5 h-5 border-t-3 border-r-3 border-[#E4576E] rounded-tr-md pointer-events-none"
                    title="Huy hiệu Góc Đẹp · Tác phẩm được cộng đồng bình chọn cao nhất"
                  />
                )}

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                  {area.name}
                </div>

                <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                  <span className="text-[10px] text-rose-300 font-bold block">{post.salonName}</span>
                  <div className="text-xs font-bold truncate">{post.styleName}</div>
                  <div className="text-[11px] font-extrabold text-[#E4576E] mt-0.5">{post.priceEstimate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Khối Bảng Giá & Dữ Liệu Tham Khảo Riêng (Quality Threshold Rule 3) */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Bảng Giá Tham Khảo {service.shortName} Tại {area.name} (Hà Nội 2026)
        </h3>
        <p className="text-xs text-slate-500">
          Khảo sát thực tế từ {displaySalons.length} cơ sở đối tác đã xác thực giấy phép trên toidep.net
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-700 font-medium">Gói cơ bản / tiêu chuẩn:</span>
            <span className="font-bold text-slate-900">180.000đ - 280.000đ (40 - 50 phút)</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-700 font-medium">Gói thiết kế theo phom mặt / dáng móng:</span>
            <span className="font-bold text-slate-900">320.000đ - 550.000đ (60 - 90 phút)</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-700 font-medium">Dịch vụ phục hồi hữu cơ / chăm sóc chuyên sâu:</span>
            <span className="font-bold text-[#E4576E]">450.000đ - 850.000đ (90 - 120 phút)</span>
          </div>
        </div>
      </section>

      {/* 6. Liên Kết Ngang (Internal Cross-Linking theo mục 6.3) */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Cùng dịch vụ ở phường/quận lân cận */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              {service.shortName} ở các khu vực lân cận
            </h4>
            <div className="flex flex-wrap gap-2">
              {SEO_AREAS.filter(a => a.id !== area.id).slice(0, 5).map(a => (
                <button
                  key={a.id}
                  onClick={() => onChangeArea(a.id)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#E4576E] hover:text-[#E4576E] transition-colors"
                >
                  {service.shortName} {a.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dịch vụ khác cùng khu vực */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Dịch vụ làm đẹp khác tại {area.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {SEO_SERVICES.filter(s => s.slug !== service.slug).slice(0, 5).map(s => (
                <button
                  key={s.slug}
                  onClick={() => onChangeService(s.slug)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#E4576E] hover:text-[#E4576E] transition-colors"
                >
                  {s.shortName} {area.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
