import React, { useState } from 'react';
import { 
  Building2, Users, Calendar, Check, X, 
  ArrowUpRight, Sparkles, TrendingUp, ShieldCheck, Clock, Phone, Award 
} from 'lucide-react';
import { Salon, BookingRequest } from '../../types';

interface SalonDashboardViewProps {
  salon: Salon;
  bookings: BookingRequest[];
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
  onViewSalon: (salonId: string) => void;
  onOpenEditSalon?: () => void;
}

export const SalonDashboardView: React.FC<SalonDashboardViewProps> = ({
  salon,
  bookings,
  onUpdateBookingStatus,
  onViewSalon,
  onOpenEditSalon
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'analytics' | 'pro'>('bookings');
  const [proModalOpen, setProModalOpen] = useState(false);

  const salonBookings = bookings.filter(b => b.salonId === salon.id);
  const pendingCount = salonBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={salon.avatar}
            alt={salon.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E4576E]">
                Salon Dashboard · {salon.district}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-[#E4576E] border border-rose-200">
                Gói Salon Pro Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{salon.name}</h2>
            <p className="text-xs text-slate-500">
              Quản lý danh sách khách đặt lịch từ nút "Làm kiểu này", bảng giá và hiệu quả bài đăng
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenEditSalon && (
            <button
              onClick={onOpenEditSalon}
              className="px-4 py-2 text-xs font-bold text-[#E4576E] bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
              title="Khởi tạo và chỉnh sửa thông tin, bảng giá và thợ của trang khách hàng"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa trang Salon</span>
            </button>
          )}

          <button
            onClick={() => onViewSalon(salon.id)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Xem trang khách hàng
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nâng cấp gói Pro</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">Yêu cầu chờ xử lý</div>
          <div className="text-2xl font-extrabold text-slate-900 flex items-baseline gap-2">
            <span>{pendingCount}</span>
            {pendingCount > 0 && (
              <span className="text-xs font-bold text-[#E4576E]">Cần xác nhận</span>
            )}
          </div>
          <div className="text-[11px] text-slate-400">Cam kết phản hồi &lt; 2h</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">Bấm "Làm kiểu này"</div>
          <div className="text-2xl font-extrabold text-slate-900">482</div>
          <div className="text-[11px] text-emerald-600 font-semibold">+24% so với tuần trước</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">Lượt lưu vào Bộ sưu tập</div>
          <div className="text-2xl font-extrabold text-slate-900">1.240</div>
          <div className="text-[11px] text-slate-400">Khách có ý định làm tóc</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-medium text-slate-500">Tỷ lệ chuyển đổi lead</div>
          <div className="text-2xl font-extrabold text-[#E4576E]">32.8%</div>
          <div className="text-[11px] text-slate-400">Cao hơn trung bình sàn 4.5%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Danh sách yêu cầu đặt lịch ({salonBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Thống kê bài đăng hiệu quả</span>
        </button>

        <button
          onClick={() => setActiveTab('pro')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'pro'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Gói thành viên Salon Pro</span>
        </button>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Hiển thị tất cả yêu cầu từ nút "Làm kiểu này" có đính kèm ảnh mẫu</span>
            <span className="font-semibold text-slate-800">Cập nhật thời gian thực</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
            {salonBookings.map((bk) => (
              <div key={bk.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {bk.postImage && (
                    <img
                      src={bk.postImage}
                      alt={bk.styleName}
                      className="w-14 h-18 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{bk.customerName}</h4>
                      <span className="text-xs font-mono font-semibold text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {bk.customerPhone}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bk.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : bk.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {bk.status === 'confirmed' ? 'Đã xác nhận' : bk.status === 'completed' ? 'Đã hoàn tất' : 'Chờ bạn gọi xác nhận'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">
                      Yêu cầu kiểu: <strong className="text-slate-900">{bk.styleName}</strong> · Khoảng giá: <span className="text-[#E4576E] font-bold">{bk.estimatedPrice}</span>
                    </p>

                    <p className="text-xs text-slate-500">
                      Khung giờ: <strong>{bk.timeSlot} · {bk.date}</strong> · Thợ chỉ định: {bk.stylistName || 'Bất kỳ'}
                    </p>

                    {bk.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded-md mt-1">
                        Ghi chú khách: "{bk.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {bk.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onUpdateBookingStatus(bk.id, 'confirmed')}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Xác nhận lịch</span>
                      </button>
                      <button
                        onClick={() => onUpdateBookingStatus(bk.id, 'cancelled')}
                        className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        Từ chối
                      </button>
                    </>
                  )}

                  {bk.status === 'confirmed' && (
                    <button
                      onClick={() => onUpdateBookingStatus(bk.id, 'completed')}
                      className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Đánh dấu đã hoàn thành
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Top 3 Bài Đăng Mang Về Nhiều Lượt Đặt Nhất
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-[#E4576E]">#1</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tóc Layer Nữ Sóng Lơi Tự Nhiên & Mái Bay</h4>
                  <p className="text-[11px] text-slate-400">Đăng bởi Hoàng Minh (Minh Layer) · 342 lượt thích</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900">189 lượt đặt lịch</span>
                <span className="text-[10px] text-emerald-600 block font-semibold">+45 tuần này</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-slate-400">#2</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Uốn Sóng Bung Hippie Hàn Quốc</h4>
                  <p className="text-[11px] text-slate-400">Đăng bởi Thu Trang · 210 lượt thích</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900">92 lượt đặt lịch</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pro Upgrade Plan Comparison */}
      {activeTab === 'pro' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Bảng So Sánh Gói Miễn Phí & Gói Salon Pro</h3>
            <p className="text-xs text-slate-500">
              Mô hình kinh doanh toidep.net: Người dùng miễn phí, Salon trả tiền khi có giá trị thực tế
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Gói Khởi Động</div>
              <h4 className="text-2xl font-bold text-slate-900">0đ <span className="text-xs font-normal text-slate-400">/tháng</span></h4>
              <p className="text-xs text-slate-500">Phù hợp thử nghiệm tháng đầu</p>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li>✓ Tối đa 10 lượt đặt lịch/tháng từ nút "Làm kiểu này"</li>
                <li>✓ Hồ sơ salon cơ bản và tối đa 2 thợ</li>
                <li>✓ Nhận thông báo qua web push</li>
                <li className="text-slate-400">✗ Chưa có huy hiệu tích xanh xác thực GPKD</li>
                <li className="text-slate-400">✗ Không ưu tiên hiển thị mục "Gần bạn"</li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="p-6 bg-rose-50/50 rounded-2xl border-2 border-[#E4576E] shadow-sm space-y-4 relative">
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-[#E4576E] text-white px-2.5 py-1 rounded-full">
                Khuyên Dùng
              </span>
              <div className="text-xs font-bold uppercase tracking-wider text-[#E4576E]">Gói Salon Pro</div>
              <h4 className="text-2xl font-bold text-slate-900">499.000đ <span className="text-xs font-normal text-slate-400">/tháng</span></h4>
              <p className="text-xs text-slate-500">Lấp đầy ghế salon trong giờ thấp điểm</p>

              <ul className="space-y-2 text-xs text-slate-800 pt-2 border-t border-rose-200">
                <li className="font-semibold">✓ Không giới hạn lượt nhận khách mới</li>
                <li className="font-semibold">✓ Badge tích xanh "Đã xác thực" tăng 2.4x độ tin cậy</li>
                <li className="font-semibold">✓ Ưu tiên hiển thị top 1 trong bán kính 3km</li>
                <li className="font-semibold">✓ Không giới hạn thợ và bảng giá dịch vụ</li>
                <li className="font-semibold">✓ Thông báo Zalo ZNS tức thì tới chủ salon</li>
              </ul>

              <button
                onClick={() => alert('Bạn đang sử dụng bản thử nghiệm Salon Pro miễn phí 3 tháng!')}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs"
              >
                Gia Hạn / Kích Hoạt Salon Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
