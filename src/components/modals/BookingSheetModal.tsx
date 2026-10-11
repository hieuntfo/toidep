import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle2, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { Post, Salon, Stylist, BookingRequest } from '../../types';

interface BookingSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  salon: Salon;
  stylists: Stylist[];
  onConfirmBooking: (booking: BookingRequest) => void;
}

export const BookingSheetModal: React.FC<BookingSheetModalProps> = ({
  isOpen,
  onClose,
  post,
  salon,
  stylists,
  onConfirmBooking
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>('Hôm nay (10/10)');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('14:30');
  const [selectedStylistId, setSelectedStylistId] = useState<string>(post.stylistId || 'any');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('Làm theo dáng mái bay và độ dài như ảnh mẫu bài đăng.');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const dateOptions = [
    { label: 'Hôm nay (10/10)', value: 'Hôm nay (10/10)' },
    { label: 'Ngày mai (11/10)', value: 'Ngày mai (11/10)' },
    { label: 'Chủ nhật (12/10)', value: 'Chủ nhật (12/10)' },
    { label: 'Thứ hai (13/10)', value: 'Thứ hai (13/10)' },
  ];

  const timeSlots = [
    '09:30', '10:30', '11:30', '13:30', '14:30', '15:30', '16:30', '18:00', '19:30'
  ];

  const handleSendOtp = () => {
    if (!customerPhone || customerPhone.length < 9) {
      alert('Vui lòng nhập số điện thoại hợp lệ để nhận mã xác thực OTP.');
      return;
    }
    setOtpSent(true);
    setOtpCode('8686'); // Simulated instant OTP code
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Vui lòng nhập số điện thoại để salon liên hệ xác nhận.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const chosenStylist = stylists.find(s => s.id === selectedStylistId);
      const newBooking: BookingRequest = {
        id: `bk-${Date.now()}`,
        postId: post.id,
        postTitle: post.title,
        postImage: post.images[0],
        styleName: post.styleName,
        salonId: salon.id,
        salonName: salon.name,
        stylistId: selectedStylistId !== 'any' ? selectedStylistId : undefined,
        stylistName: chosenStylist ? chosenStylist.name : 'Salon điều phối thợ tay nghề tương đương',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: customerNotes,
        status: 'pending',
        createdAt: 'Vừa xong',
        estimatedPrice: post.priceEstimate
      };

      onConfirmBooking(newBooking);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
      >
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E4576E] uppercase tracking-wider">
                Yêu cầu đặt lịch · Epicenter
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500">Bước {step} trên 2</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Làm kiểu này tại {salon.name}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Post Reference Box (Ảnh mẫu tự động đính kèm) */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <img
              src={post.images[0]}
              alt={post.styleName}
              className="w-16 h-20 object-cover rounded-lg shrink-0 shadow-xs border border-white"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-[#E4576E] uppercase tracking-wide">
                Ảnh mẫu sẽ được gửi kèm cho salon
              </div>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                {post.styleName}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {salon.name} · {salon.address}
              </p>
              <div className="text-xs font-bold text-slate-900 mt-1">
                Khoảng giá: <span className="text-[#E4576E]">{post.priceEstimate}</span>
              </div>
            </div>
          </div>

          {isSuccess ? (
            /* Success confirmation screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Đã gửi yêu cầu đến {salon.name}!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed">
                  Salon sẽ nhận được thông báo kèm <strong>ảnh mẫu kiểu {post.styleName}</strong> và phản hồi xác nhận qua số điện thoại <strong>{customerPhone}</strong> trong vòng 30 phút.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Khung giờ hẹn:</span>
                  <span className="font-semibold text-slate-900">{selectedTimeSlot} · {selectedDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Thợ phục vụ:</span>
                  <span className="font-semibold text-slate-900">
                    {stylists.find(s => s.id === selectedStylistId)?.name || 'Salon bố trí thợ kinh nghiệm'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Chính sách hủy:</span>
                  <span className="text-emerald-700 font-medium">Hủy miễn phí trước 2 giờ</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3 text-sm font-bold text-white bg-[#1E1E24] hover:bg-black rounded-xl transition-colors shadow-xs"
              >
                Xem chi tiết trong mục Lịch đặt của tôi
              </button>
            </div>
          ) : step === 1 ? (
            /* Step 1: Chọn ngày, giờ và thợ */
            <div className="space-y-5">
              {/* Chọn Ngày */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Chọn ngày làm dịch vụ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedDate(opt.value)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        selectedDate === opt.value
                          ? 'border-[#E4576E] bg-rose-50/50 text-[#E4576E] shadow-2xs font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chọn Giờ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Chọn khung giờ trống
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-[#E4576E] bg-[#E4576E] text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chọn Stylist / Thợ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" /> Thợ / Stylist thực hiện
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStylistId('any')}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedStylistId === 'any'
                        ? 'border-[#E4576E] bg-rose-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Bất kỳ thợ nào có lịch trống</div>
                      <div className="text-[11px] text-slate-500">Salon chủ động sắp xếp thợ phù hợp nhất</div>
                    </div>
                    {selectedStylistId === 'any' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E4576E]" />
                    )}
                  </button>

                  {stylists.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStylistId(st.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        selectedStylistId === st.id
                          ? 'border-[#E4576E] bg-rose-50/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{st.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{st.title} · {st.rating}★</div>
                      </div>
                      {selectedStylistId === st.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E4576E] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Ghi chú cho salon (tùy chọn)
                </label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white transition-all text-slate-800"
                  placeholder="Ví dụ: Tóc em hiện tại mỏng, muốn uốn nhẹ nhàng tự nhiên..."
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                Tiếp tục: Nhập thông tin & SĐT nhận lịch
              </button>
            </div>
          ) : (
            /* Step 2: Thông tin liên hệ & Xác nhận OTP */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Họ và tên của bạn <span className="text-[#E4576E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Hải My"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white transition-all text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Số điện thoại Việt Nam <span className="text-[#E4576E]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white transition-all text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
                  >
                    {otpSent ? 'Gửi lại OTP' : 'Gửi mã OTP'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tuân thủ Nghị định 147/2024/NĐ-CP: Xác thực số điện thoại để đặt lịch dịch vụ làm đẹp.
                </p>
              </div>

              {otpSent && (
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-rose-900">
                    <span>Mã OTP đã gửi về tin nhắn SMS:</span>
                    <span className="font-mono font-bold text-[#E4576E]">Mã test: {otpCode}</span>
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Nhập 4 số OTP"
                    className="w-full px-3 py-2 text-xs text-center font-mono font-bold tracking-widest bg-white border border-rose-200 rounded-lg text-slate-900"
                  />
                </div>
              )}

              {/* Tóm tắt đặt lịch */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Khung giờ đã chọn:</span>
                  <span className="font-bold text-slate-900">{selectedTimeSlot} · {selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Khoảng giá tại salon:</span>
                  <span className="font-bold text-[#E4576E]">{post.priceEstimate}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-emerald-700 text-[11px]">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>Không mất phí đặt cọc. Hủy lịch miễn phí trước 2 giờ.</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi yêu cầu...' : 'Xác nhận & Gửi yêu cầu đặt lịch'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
