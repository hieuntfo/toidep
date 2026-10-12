import React, { useState } from 'react';
import { 
  X, Heart, Bookmark, Share2, MapPin, Scissors, Tag, 
  CheckCircle, MessageCircle, Send, ArrowRight, Sparkles, Clock, Calendar, Check
} from 'lucide-react';
import { Post, Salon, Stylist, UserProfile } from '../../types';

interface PostDetailModalProps {
  post: Post | null;
  salon: Salon | null;
  stylists: Stylist[];
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (post: Post, salon: Salon) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
  onViewSalon: (salonId: string) => void;
  currentUser?: UserProfile | null;
  onRequireLogin?: (message: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  salon,
  stylists,
  isOpen,
  onClose,
  onBookNow,
  onToggleLike,
  onToggleSave,
  isLiked,
  isSaved,
  onViewSalon,
  currentUser,
  onRequireLogin
}) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: '1', user: 'Thu Hương', text: 'Tóc này uốn giữ được mấy tháng vậy salon ơi?', time: '2 giờ trước' },
    { id: '2', user: 'Aurora Hair Atelier', text: '@Thu Hương Dạ form sóng lơi giữ từ 5-7 tháng b nha, sấy kẹp càng cua tại nhà cực kỳ dễ ạ!', time: '1 giờ trước' },
  ]);
  const [showShareToast, setShowShareToast] = useState(false);

  if (!isOpen || !post || !salon) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!currentUser) {
      if (onRequireLogin) {
        onRequireLogin('Vui lòng đăng nhập tài khoản để gửi bình luận hoặc hỏi tư vấn giá cho mẫu này.');
      }
      return;
    }

    setComments([
      ...comments,
      {
        id: String(Date.now()),
        user: currentUser.fullName || 'Bạn',
        text: commentText.trim(),
        time: 'Vừa xong'
      }
    ]);
    setCommentText('');
  };

  const handleShare = async () => {
    const shareData = {
      title: `${post.title} — toidep.net`,
      text: `Khám phá kiểu ${post.styleName} tại ${salon.name} trên toidep.net`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    } catch {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg md:max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:h-[640px]"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Share Toast Notification */}
        {showShareToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Đã sao chép liên kết vào clipboard!</span>
          </div>
        )}

        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 text-slate-700 bg-white/90 hover:bg-white rounded-full shadow-md backdrop-blur-xs transition-colors"
          aria-label="Đóng bài đăng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 4:5 Media Viewport */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden select-none shrink-0 h-64 sm:h-80 md:h-full">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay at bottom of photo */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* District & Lookbook watermark tag */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-md border border-white/15">
            <MapPin className="w-3.5 h-3.5 text-[#E4576E]" />
            <span className="font-semibold">{post.salonDistrict}</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white z-20 md:hidden">
            <span className="text-xs text-rose-300 font-bold block">{post.styleName}</span>
            <span className="text-sm font-extrabold truncate block">{post.title}</span>
          </div>
        </div>

        {/* Right Side: Details & Contiguous Interaction */}
        <div className="w-full md:w-1/2 flex flex-col justify-between bg-white flex-1 overflow-hidden min-h-0">
          {/* Scrollable Upper Section */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {/* Salon Author Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div 
                onClick={() => onViewSalon(salon.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={salon.avatar}
                  alt={salon.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-[#E4576E] transition-colors">
                      {salon.name}
                    </span>
                    {salon.isVerified && (
                      <span title="Salon đã xác thực giấy phép GPKD">
                        <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-[180px] sm:max-w-xs">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{salon.address}</span>
                  </p>
                </div>
              </div>

              {/* View Salon Page */}
              <button
                onClick={() => onViewSalon(salon.id)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
              >
                Trang Salon
              </button>
            </div>

            {/* Post Title & Style Tags */}
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {post.caption}
              </p>
            </div>

            {/* Key Metadata Grid: Kiểu / Thợ / Khoảng giá */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#E4576E]" /> Kiểu làm:
                </span>
                <span className="font-bold text-slate-900">{post.styleName}</span>
              </div>
              {post.stylistName && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Thợ thực hiện:
                  </span>
                  <span className="font-semibold text-slate-800">{post.stylistName}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" /> Khoảng giá:
                </span>
                <span className="font-extrabold text-[#E4576E] text-sm">{post.priceEstimate}</span>
              </div>
            </div>

            {/* Social Action Bar (Like, Save, Share) */}
            <div className="flex items-center justify-between py-2 border-y border-slate-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    isLiked ? 'text-[#E4576E]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-[#E4576E]' : ''}`} />
                  <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
                </button>

                <button
                  onClick={() => onToggleSave(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    isSaved ? 'text-[#E4576E]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-[#E4576E]' : ''}`} />
                  <span>{post.savesCount + (isSaved ? 1 : 0)}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Chia sẻ</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400">{post.createdAt}</span>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Bình luận ({comments.length})
              </h4>
              <div className="space-y-2.5 max-h-32 sm:max-h-40 overflow-y-auto pr-1">
                {comments.map((c) => (
                  <div key={c.id} className="text-xs">
                    <span className="font-bold text-slate-900 mr-2">{c.user}</span>
                    <span className="text-slate-700">{c.text}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{c.time}</div>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Thêm bình luận hoặc hỏi giá..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1E1E24] hover:bg-black rounded-xl transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Epicenter Sticky Action Bar */}
          <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500 font-medium truncate">
                Làm kiểu này tại <strong className="text-slate-800">{salon.name}</strong>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#E4576E]">
                Giá từ {post.priceEstimate.split('-')[0].trim()}
              </div>
            </div>

            <button
              onClick={() => onBookNow(post, salon)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>Làm kiểu này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
