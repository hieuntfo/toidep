import React, { useState } from 'react';
import { 
  CheckCircle, Star, MapPin, Phone, Clock, 
  Scissors, Tag, Calendar, Sparkles, ArrowRight, ShieldCheck, User,
  Share2
} from 'lucide-react';
import { Salon, Post, Review, UserProfile } from '../../types';

interface SalonProfileViewProps {
  salon: Salon;
  posts: Post[];
  reviews: Review[];
  onSelectPost: (post: Post) => void;
  onBookNow: (post: Post, salon: Salon) => void;
  onBackToFeed: () => void;
  isFollowing?: boolean;
  onToggleFollow?: (salonId: string) => void;
  currentUser?: UserProfile | null;
  onRequireLogin?: (message: string) => void;
}

export const SalonProfileView: React.FC<SalonProfileViewProps> = ({
  salon,
  posts,
  reviews,
  onSelectPost,
  onBookNow,
  onBackToFeed,
  isFollowing = false,
  onToggleFollow,
  currentUser,
  onRequireLogin
}) => {
  const [activeTab, setActiveTab] = useState<'lookbook' | 'prices' | 'stylists' | 'reviews'>('lookbook');
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share && navigator.canShare && navigator.canShare({ url })) {
      try {
        await navigator.share({
          title: `${salon.name} — toidep.net`,
          text: `Khám phá trang salon ${salon.name} trên toidep.net`,
          url
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleFollowClick = () => {
    if (!currentUser) {
      if (onRequireLogin) onRequireLogin('Vui lòng đăng nhập để theo dõi salon này và nhận thông báo mẫu tóc mới.');
      return;
    }
    if (onToggleFollow) onToggleFollow(salon.id);
  };

  const salonPosts = posts.filter(p => p.salonId === salon.id);
  const salonReviews = reviews.filter(r => r.salonId === salon.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={onBackToFeed}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
      >
        ← Quay lại trang Khám phá
      </button>

      {/* Hero Header & Cover */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover image */}
        <div className="h-48 sm:h-64 w-full relative bg-slate-900">
          <img
            src={salon.coverImage}
            alt={salon.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <img
                src={salon.avatar}
                alt={salon.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{salon.name}</h1>
                  {salon.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Đã xác thực GPKD
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E4576E]" />
                  <span>{salon.address}</span>
                </p>
              </div>
            </div>

            {/* Quick Contact, Follow & Book Action */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleFollowClick}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  isFollowing
                    ? 'bg-slate-900 text-white'
                    : 'bg-rose-50 text-[#E4576E] border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>{isFollowing ? '✓ Đang theo dõi' : '+ Theo dõi salon'}</span>
              </button>

              <a
                href={`tel:${salon.phone.replace(/\s+/g, '')}`}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{salon.phone}</span>
              </a>

              {salonPosts[0] && (
                <button
                  onClick={() => onBookNow(salonPosts[0], salon)}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Đặt lịch hẹn</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center gap-1.5"
                title="Sao chép link chia sẻ trang salon"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedShare ? 'Đã chép link!' : 'Chia sẻ'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            {salon.description}
          </p>

          {/* Quick Stats Ribbon */}
          <div className="flex flex-wrap items-center gap-6 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="font-bold text-slate-900">{salon.rating}</span>
              <span className="text-slate-400">({salon.reviewsCount} đánh giá thật)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{salon.openHours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-[#E4576E]" />
              <span>{salon.stylists.length} Thợ tay nghề cao</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-t border-slate-200 flex gap-8 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('lookbook')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'lookbook'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Lookbook Tác Phẩm ({salonPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'prices'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Bảng Giá Dịch Vụ ({salon.priceItems.length})
          </button>

          <button
            onClick={() => setActiveTab('stylists')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'stylists'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Đội Ngũ Stylist ({salon.stylists.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Đánh Giá Thật ({salonReviews.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Lookbook Gallery */}
      {activeTab === 'lookbook' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {salonPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
                <img
                  src={post.images[0]}
                  alt={post.styleName}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow-md">
                  <span className="text-xs font-bold truncate">{post.styleName}</span>
                  <span className="text-xs font-extrabold text-rose-300 shrink-0">
                    {post.priceEstimate.split('-')[0].trim()}
                  </span>
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between gap-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 truncate">{post.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookNow(post, salon);
                  }}
                  className="px-3 py-1 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-lg transition-colors shrink-0"
                >
                  Đặt lịch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Bảng giá dịch vụ */}
      {activeTab === 'prices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Bảng giá niêm yết tại {salon.name}
            </h3>
            <p className="text-xs text-slate-500">
              Cam kết không phát sinh phụ phí ẩn khi đặt lịch qua toidep.net
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {salon.priceItems.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <span className="text-[11px] text-slate-400">Thời lượng ước tính: {item.duration}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-[#E4576E]">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Đội ngũ thợ Stylist */}
      {activeTab === 'stylists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salon.stylists.map((st) => (
            <div key={st.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              <img
                src={st.avatar}
                alt={st.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{st.name}</h4>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                    ★ {st.rating}
                  </span>
                </div>
                <p className="text-xs text-[#E4576E] font-medium">{st.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{st.bio}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {st.specialties.map((spec) => (
                    <span key={spec} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Đánh giá thật */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>Chính sách minh bạch toidep.net:</strong> 100% đánh giá chỉ được gửi sau khi lịch đặt có trạng thái <em>"Đã hoàn thành"</em> nhằm ngăn chặn hoàn toàn review ảo.
            </div>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {salonReviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.customerAvatar}
                      alt={rev.customerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{rev.customerName}</div>
                      <div className="text-[10px] text-slate-400">Đã làm dịch vụ: {rev.styleDone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-amber-500">★★★★★</div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{rev.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
