import React, { useState } from 'react';
import { Bookmark, Calendar, Clock, CheckCircle, MapPin, Scissors, Tag, ArrowRight, Sparkles, User, LogIn } from 'lucide-react';
import { Post, BookingRequest, Salon, UserProfile } from '../../types';

interface UserProfileViewProps {
  savedPosts: Post[];
  bookings: BookingRequest[];
  salons: Salon[];
  onSelectPost: (post: Post) => void;
  onViewSalon: (salonId: string) => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  savedPosts,
  bookings,
  salons,
  onSelectPost,
  onViewSalon,
  currentUser,
  onOpenAuthModal
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'bookings'>('saved');

  const displayName = currentUser?.fullName || 'Phương Thảo';
  const displayAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
  const displayBio = currentUser?.bio || 'Hà Nội · Đam mê các kiểu tóc layer tự nhiên & nail thạch syrup nhẹ nhàng';
  const isSalonPro = currentUser?.role === 'salon_pro';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
          />

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                isSalonPro 
                  ? 'bg-rose-50 text-[#E4576E] border border-rose-200' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {isSalonPro ? '💈 Salon Pro' : '👤 Khách Hàng'}
              </span>
              {currentUser?.authProvider && (
                <span className="text-[10px] text-slate-400 capitalize">
                  via {currentUser.authProvider}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 max-w-lg">
              {displayBio}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900 font-bold">{savedPosts.length}</strong> bộ sưu tập đã lưu
              </div>
              <div>
                <strong className="text-slate-900 font-bold">{bookings.length}</strong> lượt hẹn đã đặt
              </div>
            </div>
          </div>
        </div>

        {/* Change account / Upgrade */}
        {onOpenAuthModal && (
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            Đổi tài khoản / Nâng Pro
          </button>
        )}
      </div>

      {/* Segmented Control */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bộ sưu tập mẫu đã lưu ({savedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Lịch hẹn của tôi ({bookings.length})</span>
        </button>
      </div>

      {/* Tab Content: Saved Posts */}
      {activeTab === 'saved' && (
        <div>
          {savedPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs text-slate-500">Bạn chưa lưu mẫu tóc hoặc nail nào.</p>
              <p className="text-[11px] text-slate-400">Hãy bấm biểu tượng Lưu khi lướt feed để gom các kiểu ưng ý vào đây!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  <div className="aspect-4/5 relative overflow-hidden bg-slate-100">
                    <img
                      src={post.images[0]}
                      alt={post.styleName}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 inset-x-2 text-white drop-shadow-sm">
                      <div className="text-[10px] text-rose-200 truncate">{post.salonName}</div>
                      <div className="text-xs font-bold truncate">{post.styleName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs text-slate-500">Chưa có lịch hẹn nào được tạo.</p>
              <p className="text-[11px] text-slate-400">Chọn một bức ảnh và bấm "Làm kiểu này" để đặt lịch ngay.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {b.postImage ? (
                    <img
                      src={b.postImage}
                      alt={b.styleName}
                      className="w-16 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-rose-50 flex items-center justify-center text-[#E4576E] shrink-0">
                      <Scissors className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{b.styleName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {b.status === 'confirmed' ? 'Đã xác nhận' : b.status === 'completed' ? 'Đã hoàn thành' : 'Chờ salon xác nhận'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-700">
                      Tại: <button onClick={() => onViewSalon(b.salonId)} className="text-[#E4576E] hover:underline">{b.salonName}</button>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Giờ hẹn: <strong>{b.timeSlot} · {b.date}</strong></span>
                      {b.stylistName && <span>Thợ: {b.stylistName}</span>}
                    </div>

                    <div className="text-xs font-bold text-slate-900 pt-0.5">
                      Giá ước tính: <span className="text-[#E4576E]">{b.estimatedPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block mb-1">Gửi lúc: {b.createdAt}</span>
                  <div className="text-xs text-emerald-700 font-semibold">
                    Hủy miễn phí trước 2 giờ
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
