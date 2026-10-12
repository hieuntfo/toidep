import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Calendar, Clock, Eye, Heart, Bookmark, Share2, 
  Sparkles, Play, Pause, Volume2, VolumeX, Scissors, MapPin, 
  CheckCircle2, ChevronRight, MessageSquare, Quote
} from 'lucide-react';
import { Article, Salon, Post, UserProfile } from '../../types';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  salons: Salon[];
  onSelectSalon?: (salonId: string) => void;
  onBookNow?: (post: Post, salon: Salon) => void;
  posts: Post[];
  currentUser?: UserProfile | null;
  onRequireLogin?: (message: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  salons,
  onSelectSalon,
  onBookNow,
  posts,
  currentUser,
  onRequireLogin
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likesCount);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Vertical video player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleToggleLike = () => {
    if (!currentUser) {
      if (onRequireLogin) onRequireLogin('Vui lòng đăng nhập để thích bài viết và tương tác với bài viết.');
      return;
    }
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleToggleSave = () => {
    if (!currentUser) {
      if (onRequireLogin) onRequireLogin('Vui lòng đăng nhập để lưu bài viết chuyên đề vào sổ tay làm đẹp.');
      return;
    }
    setIsSaved(prev => !prev);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${article.title} — toidep.net`,
      text: article.subtitle,
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
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const relatedSalon = salons.find(s => s.id === article.relatedSalonId);
  const relatedPost = posts.find(p => p.id === article.relatedPostId);

  return (
    <article className="min-h-screen bg-[#FCFCFD] pb-24 text-slate-900">
      {/* Top Floating Back & Action Bar */}
      <div className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#E4576E] transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Tạp chí Làm Đẹp</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleLike}
              className={`p-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isLiked 
                  ? 'bg-rose-50 text-[#E4576E] border-rose-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#E4576E]' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`p-2 rounded-full border transition-all ${
                isSaved 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Lưu bài viết vào sổ tay"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition-all relative"
              title="Sao chép liên kết"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 text-[10px] bg-slate-900 text-white px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                  Đã chép link!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Longform Header Container */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6 space-y-6">
        {/* Category & Badge */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E4576E] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
            {article.categoryLabel}
          </span>
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {article.publishedAt}
          </span>
        </div>

        {/* Master Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {article.title}
        </h1>

        {/* Editorial Subtitle / Sapo */}
        <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed border-l-4 border-[#E4576E] pl-4 italic">
          {article.subtitle}
        </p>

        {/* Author Byline */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div>
              <div className="font-bold text-slate-900">{article.author.name}</div>
              <div className="text-slate-500">{article.author.title}</div>
            </div>
          </div>

          <div className="text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.viewsCount.toLocaleString()} lượt đọc
            </span>
          </div>
        </div>
      </header>

      {/* Hero Cover Image (Full Width High Impact) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[5/3] bg-black">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            style={{
              objectPosition: article.focalCrop
                ? `${article.focalCrop.focalX}% ${article.focalCrop.focalY}%`
                : '50% 25%',
              transform: article.focalCrop ? `scale(${article.focalCrop.zoom})` : undefined
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6 text-white text-xs">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
              Trình diễn hình ảnh độc quyền tại toidep.net · Cắt chuẩn tỉ lệ 5:3 không méo hình
            </span>
          </div>
        </div>
      </div>

      {/* Main Longform Body Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        {article.sections.map((sec, idx) => {
          // 1. Text Paragraph (First paragraph has stylish Drop Cap)
          if (sec.type === 'paragraph') {
            const isFirst = idx === 0;
            return (
              <div key={sec.id || idx} className="text-slate-800 text-base sm:text-lg leading-relaxed font-serif">
                {isFirst && sec.content ? (
                  <p>
                    <span className="float-left text-5xl font-extrabold text-[#E4576E] leading-none pr-3 pt-1 font-sans">
                      {sec.content.charAt(0)}
                    </span>
                    {sec.content.slice(1)}
                  </p>
                ) : (
                  <p>{sec.content}</p>
                )}
              </div>
            );
          }

          // 2. Heading
          if (sec.type === 'heading') {
            return (
              <h2 key={sec.id || idx} className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-6 tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 bg-[#E4576E] rounded-full inline-block" />
                <span>{sec.heading}</span>
              </h2>
            );
          }

          // 3. Editorial Pull Quote
          if (sec.type === 'pullquote') {
            return (
              <div key={sec.id || idx} className="my-10 p-8 rounded-3xl bg-rose-50/60 border-y-2 border-[#E4576E] text-center space-y-3 relative overflow-hidden">
                <Quote className="w-12 h-12 text-rose-200 absolute -top-2 left-6 pointer-events-none" />
                <blockquote className="text-lg sm:text-2xl font-serif italic text-slate-900 leading-snug">
                  "{sec.content}"
                </blockquote>
                {sec.caption && (
                  <div className="text-xs font-bold uppercase tracking-wider text-[#E4576E]">
                    — {sec.caption}
                  </div>
                )}
              </div>
            );
          }

          // 4. Image Break (Photo essay presentation)
          if (sec.type === 'image_break') {
            return (
              <figure key={sec.id || idx} className="my-8 space-y-3">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img
                    src={sec.imageUrl}
                    alt={sec.caption || 'Chi tiết hình ảnh'}
                    className="w-full h-auto object-cover hover:scale-101 transition-transform duration-300"
                  />
                </div>
                {(sec.caption || sec.credit) && (
                  <figcaption className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
                    <span className="italic">{sec.caption}</span>
                    {sec.credit && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {sec.credit}
                      </span>
                    )}
                  </figcaption>
                )}
              </figure>
            );
          }

          // 5. Vertical Video (9:16 Shorts/Reels Format Showcase)
          if (sec.type === 'vertical_video') {
            return (
              <div key={sec.id || idx} className="my-12 p-6 sm:p-8 bg-slate-950 rounded-3xl border border-slate-800 text-white space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E4576E] text-white">
                      Video Dọc 9:16 Hậu Trường Salon
                    </span>
                    <span className="text-xs text-slate-400">
                      Thời lượng {sec.videoDuration || '00:45'}
                    </span>
                  </div>
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white">{sec.videoTitle}</h3>
                  <p className="text-xs text-slate-400">
                    Trình diễn kỹ thuật cắt và sấy lơi trực tiếp từ góc nhìn 9:16 của nhà tạo mẫu
                  </p>
                </div>

                {/* The 9:16 Vertical Video Frame */}
                <div className="relative mx-auto w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-black">
                  <video
                    ref={videoRef}
                    src={sec.videoUrl}
                    poster={sec.videoPoster}
                    playsInline
                    loop
                    muted={isMuted}
                    className="w-full h-full object-cover"
                    onClick={toggleVideoPlay}
                  />

                  {/* Play / Pause overlay */}
                  {!isPlaying && (
                    <div 
                      onClick={toggleVideoPlay}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#E4576E] group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-transform">
                        <Play className="w-8 h-8 ml-1 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Floating Controller at bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <button
                      onClick={toggleVideoPlay}
                      className="p-1 hover:text-[#E4576E] transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <span className="text-[11px] text-slate-300">
                      {isPlaying ? 'Đang phát' : 'Chạm để xem video'}
                    </span>

                    <button
                      onClick={toggleVideoMute}
                      className="p-1 hover:text-[#E4576E] transition-colors"
                      title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>

                {sec.caption && (
                  <p className="text-center text-xs text-slate-400 italic">
                    {sec.caption}
                  </p>
                )}
              </div>
            );
          }

          // 6. Stylist Pro Tip Box
          if (sec.type === 'stylist_tip') {
            return (
              <div key={sec.id || idx} className="my-8 p-6 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Lời Khuyên Chuyên Gia Tại Nhà</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  {sec.content}
                </p>
              </div>
            );
          }

          // 7. Service CTA (Linking to salon)
          if (sec.type === 'service_cta') {
            return (
              <div key={sec.id || idx} className="my-10 p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E4576E] uppercase tracking-wider">
                  <Scissors className="w-4 h-4" />
                  <span>Trải Nghiệm Dịch Vụ Này</span>
                </div>
                <h3 className="text-lg font-bold">{sec.heading}</h3>
                <p className="text-xs text-slate-300">{sec.content}</p>
                {sec.credit && (
                  <div className="text-xs font-semibold text-rose-300">{sec.credit}</div>
                )}
                {relatedSalon && (
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onSelectSalon && onSelectSalon(relatedSalon.id)}
                      className="py-2.5 px-4 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Xem trang {relatedSalon.name}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {relatedPost && onBookNow && (
                      <button
                        onClick={() => onBookNow(relatedPost, relatedSalon)}
                        className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Scissors className="w-4 h-4 text-[#E4576E]" />
                        <span>Đặt lịch "Làm kiểu này" ngay</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}

        {/* Tags bar */}
        {article.tags.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-400 mb-2">Thẻ bài viết:</div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
