import React, { useState } from 'react';
import { 
  Heart, Bookmark, MessageCircle, Share2, MapPin, 
  Scissors, Tag, CheckCircle, ArrowRight, UserPlus, Sparkles 
} from 'lucide-react';
import { Post, Salon, Stylist } from '../../types';

interface FollowingFeedProps {
  posts: Post[];
  salons: Salon[];
  onSelectPost: (post: Post) => void;
  onBookNow: (post: Post, salon: Salon) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  likedPostIds: string[];
  savedPostIds: string[];
  onViewSalon: (salonId: string) => void;
}

export const FollowingFeed: React.FC<FollowingFeedProps> = ({
  posts,
  salons,
  onSelectPost,
  onBookNow,
  onToggleLike,
  onToggleSave,
  likedPostIds,
  savedPostIds,
  onViewSalon
}) => {
  const [followedSalonIds, setFollowedSalonIds] = useState<string[]>(['salon-1', 'salon-2']);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleSharePost = async (post: Post) => {
    const shareData = {
      title: `${post.title} — toidep.net`,
      text: `Mẫu tóc ${post.styleName} tại ${post.salonName}`,
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
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    } catch {
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  const toggleFollow = (id: string) => {
    setFollowedSalonIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-8">
      {/* Recommended Stylists / Salons Carousel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E4576E]" /> Salon nổi bật tuần này tại Hà Nội
          </span>
          <span className="text-[11px] text-slate-400 font-normal">Gợi ý cho bạn</span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {salons.map((salon) => {
            const isFollowing = followedSalonIds.includes(salon.id);
            return (
              <div
                key={salon.id}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-[130px] shrink-0"
              >
                <div 
                  onClick={() => onViewSalon(salon.id)}
                  className="cursor-pointer relative"
                >
                  <img
                    src={salon.avatar}
                    alt={salon.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  {salon.isVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-white absolute bottom-0 right-0" />
                  )}
                </div>
                <div 
                  onClick={() => onViewSalon(salon.id)}
                  className="text-xs font-bold text-slate-900 mt-2 truncate w-full cursor-pointer hover:text-[#E4576E]"
                >
                  {salon.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate w-full">{salon.district}</div>
                <button
                  onClick={() => toggleFollow(salon.id)}
                  className={`mt-2 w-full py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    isFollowing
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-[#E4576E] text-white hover:bg-[#d84860]'
                  }`}
                >
                  {isFollowing ? 'Đang theo' : '+ Theo dõi'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instagram-style Vertical Feed */}
      <div className="space-y-8">
        {posts.map((post) => {
          const salon = salons.find(s => s.id === post.salonId) || salons[0];
          const isLiked = likedPostIds.includes(post.id);
          const isSaved = savedPostIds.includes(post.id);

          return (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <div 
                  onClick={() => onViewSalon(salon.id)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={salon.avatar}
                    alt={salon.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#E4576E] transition-colors">
                        {salon.name}
                      </span>
                      {salon.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{post.salonDistrict}</span>
                      <span>·</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewSalon(salon.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100"
                >
                  Xem salon
                </button>
              </div>

              {/* Media Container 4:5 with double-click like */}
              <div 
                onDoubleClick={() => onToggleLike(post.id)}
                onClick={() => onSelectPost(post)}
                className="relative aspect-4/5 bg-slate-900 cursor-pointer overflow-hidden group select-none"
              >
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Floating style tag on bottom */}
                <div className="absolute bottom-3 left-3 text-white z-10">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 drop-shadow-sm">
                    <Scissors className="w-3.5 h-3.5 text-[#E4576E]" />
                    {post.styleName}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onToggleLike(post.id)}
                      className={`transition-colors ${
                        isLiked ? 'text-[#E4576E]' : 'text-slate-700 hover:text-slate-900'
                      }`}
                      aria-label="Thích bài đăng"
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-[#E4576E]' : ''}`} />
                    </button>

                    <button
                      onClick={() => onSelectPost(post)}
                      className="text-slate-700 hover:text-slate-900 transition-colors"
                      aria-label="Bình luận"
                    >
                      <MessageCircle className="w-6 h-6" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => handleSharePost(post)}
                        className="text-slate-700 hover:text-slate-900 transition-colors"
                        aria-label="Chia sẻ"
                        title="Chia sẻ liên kết"
                      >
                        <Share2 className="w-6 h-6" />
                      </button>
                      {copiedPostId === post.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-20">
                          Đã chép link!
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleSave(post.id)}
                    className={`transition-colors ${
                      isSaved ? 'text-[#E4576E]' : 'text-slate-700 hover:text-slate-900'
                    }`}
                    aria-label="Lưu vào bộ sưu tập"
                  >
                    <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-[#E4576E]' : ''}`} />
                  </button>
                </div>

                {/* Likes Counter */}
                <div className="text-xs font-bold text-slate-900">
                  {post.likesCount + (isLiked ? 1 : 0)} lượt thích
                </div>

                {/* Caption & Stylist Info */}
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 mr-1.5">{salon.name}</span>
                  {post.caption}
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1 text-[11px] text-[#E4576E]">
                  {post.tags.map(t => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>

                {/* Epicenter Instant Booking Bar in Feed */}
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center justify-between gap-3 mt-2">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-700">
                      Làm kiểu này tại <span className="font-bold text-slate-900">{salon.name}</span>
                    </div>
                    <div className="text-xs font-bold text-[#E4576E]">
                      Giá từ {post.priceEstimate.split('-')[0].trim()}
                    </div>
                  </div>

                  <button
                    onClick={() => onBookNow(post, salon)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <span>Làm kiểu này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
