import React, { useState } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, Users, 
  Building2, TrendingUp, Sparkles, Filter, Pin, Check, X, ShieldAlert 
} from 'lucide-react';
import { Salon, Post } from '../../types';

interface AdminCmsViewProps {
  salons: Salon[];
  posts: Post[];
  onToggleVerifySalon: (salonId: string) => void;
  onDeletePost: (postId: string) => void;
}

export const AdminCmsView: React.FC<AdminCmsViewProps> = ({
  salons,
  posts,
  onToggleVerifySalon,
  onDeletePost
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'salons' | 'taxonomy'>('overview');
  const [flaggedPosts, setFlaggedPosts] = useState<{ id: string; title: string; reason: string; author: string }[]>([
    { id: 'f-1', title: 'Nhuộm tóc giảm giá 50k toàn bộ', reason: 'Nghi vấn spam phá giá / lừa đảo cọc', author: 'Tiệm Tóc Ảo' }
  ]);

  const handleResolveFlag = (flagId: string) => {
    setFlaggedPosts(prev => prev.filter(f => f.id !== flagId));
    alert('Đã xử lý cờ vi phạm thành công theo SLA 24h.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-[#E4576E]" />
            Hệ Thống Quản Trị Trung Tâm · Admin CMS toidep.net
          </div>
          <h2 className="text-xl font-bold mt-1">Vận Hành Mạng Xã Hội Làm Đẹp Hà Nội</h2>
          <p className="text-xs text-slate-400">
            Theo dõi chỉ tiêu cam kết (North Star Metric: 2.000 lượt đặt lịch/tháng) & kiểm duyệt an toàn nội dung
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
            Nghị định 147/2024/NĐ-CP Tuân Thủ 100%
          </span>
        </div>
      </div>

      {/* KPI Cards based on PRD targets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Mục tiêu 6 tháng: Lượt đặt lịch</span>
          <div className="text-2xl font-extrabold text-slate-900">2.000 <span className="text-xs font-normal text-slate-400">/tháng</span></div>
          <div className="text-[11px] text-emerald-600 font-bold">Hiện tại: 1.482 lượt (Đạt 74%)</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Salon xác thực Hà Nội</span>
          <div className="text-2xl font-extrabold text-slate-900">{salons.length} <span className="text-xs font-normal text-slate-400">/ 300 mục tiêu</span></div>
          <div className="text-[11px] text-slate-400">Đã kiểm tra GPKD & thực tế</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">MRR dự phóng Salon</span>
          <div className="text-2xl font-extrabold text-[#E4576E]">59.800.000đ</div>
          <div className="text-[11px] text-emerald-600 font-bold">Đã vượt mốc 50tr đ/tháng</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Tỷ lệ Salon phản hồi &lt;2h</span>
          <div className="text-2xl font-extrabold text-slate-900">88.4%</div>
          <div className="text-[11px] text-emerald-600 font-bold">Vượt chuẩn cam kết 80%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tổng quan chỉ số North Star</span>
        </button>

        <button
          onClick={() => setActiveTab('salons')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'salons'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Quản lý & Duyệt tích xanh Salon ({salons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'moderation'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Hàng chờ kiểm duyệt AI & Báo cáo ({flaggedPosts.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Vòng Quay Flywheel Tăng Trưởng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800">1. Ảnh đẹp có địa chỉ</span>
              <p className="text-xs text-slate-600">
                Salon tự đăng và được hỗ trợ chụp portfolio thật. Khách hàng nhìn thấy rõ salon nào làm ra và giá ước tính.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800">2. Bấm "Làm kiểu này"</span>
              <p className="text-xs text-slate-600">
                Khách đặt lịch không phải băn khoăn tả kiểu tóc. Ảnh mẫu tự động gửi kèm đến salon và stylist được chỉ định.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800">3. Salon có khách mới thật</span>
              <p className="text-xs text-slate-600">
                Salon sẵn sàng trả gói Pro 499k/tháng để lấp đầy ghế giờ vắng. Dòng tiền thực tế nuôi sống dự án độc lập.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Salons Management */}
      {activeTab === 'salons' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Danh sách Salon đăng ký tại Hà Nội</span>
            <span>Bấm nút để cấp hoặc thu hồi huy hiệu tích xanh xác thực</span>
          </div>

          <div className="divide-y divide-slate-100">
            {salons.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover border" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">{s.name}</span>
                      {s.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{s.address}</p>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Hotline: {s.phone} · Đánh giá: {s.rating}★ ({s.reviewsCount} reviews)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.isVerified ? 'Tích xanh GPKD' : 'Chưa duyệt'}
                  </span>
                  <button
                    onClick={() => onToggleVerifySalon(s.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {s.isVerified ? 'Gỡ tích xanh' : 'Cấp tích xanh'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Moderation */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Hàng chờ bài viết vi phạm hoặc báo cáo (SLA &lt; 24h)
            </h3>
            <span className="text-xs text-slate-400">Kiểm duyệt AI tự động kết hợp xét duyệt thủ công</span>
          </div>

          {flaggedPosts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Không có bài viết nào trong hàng chờ vi phạm. Hệ thống hoạt động an toàn.
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedPosts.map((fp) => (
                <div key={fp.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{fp.title}</h4>
                    <span className="text-[11px] text-slate-500">Người đăng: {fp.author}</span>
                    <p className="text-xs font-semibold text-amber-800 mt-1">Lý do gắn cờ: {fp.reason}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveFlag(fp.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors"
                    >
                      Ẩn bài viết
                    </button>
                    <button
                      onClick={() => handleResolveFlag(fp.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                    >
                      Bỏ qua
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
