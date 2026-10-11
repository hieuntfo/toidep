import React, { useState, useEffect } from 'react';
import { 
  Upload, Scissors, MapPin, Tag, CheckCircle2, 
  Sparkles, ShieldCheck, ArrowRight, Image as ImageIcon, AlertCircle,
  Database, Loader2, Check, ExternalLink, RefreshCw
} from 'lucide-react';
import { Post, Salon, CategoryType, HanoiDistrict } from '../../types';
import { 
  insertPostToSupabase, 
  SUPABASE_PROJECT_REF, 
  testSupabaseConnection,
  SupabaseHealthStatus 
} from '../../lib/supabase';

interface CreatePostViewProps {
  salons: Salon[];
  onCreatePost: (newPost: Post) => void;
  onCancel: () => void;
  onOpenSupabaseConfig?: () => void;
}

export const CreatePostView: React.FC<CreatePostViewProps> = ({
  salons,
  onCreatePost,
  onCancel,
  onOpenSupabaseConfig
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<CategoryType>('hair_female');
  const [styleName, setStyleName] = useState('');
  const [selectedSalonId, setSelectedSalonId] = useState(salons[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState('');
  const [priceEstimate, setPriceEstimate] = useState('350.000đ - 650.000đ');
  const [tagsInput, setTagsInput] = useState('toclayer, uonloi, hanoi');
  const [imagePreview, setImagePreview] = useState<string>('/src/assets/images/hair_layer_woman_1791614539000.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dbHealth, setDbHealth] = useState<SupabaseHealthStatus | null>(null);
  const [createdPostPendingNav, setCreatedPostPendingNav] = useState<Post | null>(null);

  const selectedSalon = salons.find(s => s.id === selectedSalonId) || salons[0];

  useEffect(() => {
    async function checkDb() {
      try {
        const res = await testSupabaseConnection();
        setDbHealth(res);
      } catch {
        // Ignored
      }
    }
    checkDb();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !styleName.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSupabaseStatus('Đang gửi dữ liệu vào bảng public.posts trên Supabase...');

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      caption: caption.trim() || 'Tác phẩm mới được thực hiện tại salon.',
      images: [imagePreview],
      category,
      styleName: styleName.trim(),
      tags: tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
      salonId: selectedSalon.id,
      salonName: selectedSalon.name,
      salonDistrict: selectedSalon.district,
      salonAddress: selectedSalon.address,
      stylistName: selectedStylistName.trim() || undefined,
      priceEstimate,
      priceFrom: 350000,
      likesCount: 1,
      savesCount: 0,
      createdAt: 'Vừa xong',
      authorName: selectedSalon.name,
      authorAvatar: selectedSalon.avatar,
      authorType: 'salon',
      isVerifiedSalon: selectedSalon.isVerified,
      commentsCount: 0
    };

    // Attempt direct save to Supabase
    try {
      const dbResult = await insertPostToSupabase(newPost);
      if (dbResult.success) {
        setSupabaseStatus('✅ ' + dbResult.message);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          onCreatePost(newPost);
        }, 1200);
      } else {
        // If Supabase table missing or error, save to local app state so user work is never lost
        setCreatedPostPendingNav(newPost);
        setIsSubmitting(false);
        setSupabaseStatus(`⚠️ ${dbResult.message}. Tác phẩm đã được lưu an toàn vào bộ nhớ máy và sẵn sàng hiển thị!`);
      }
    } catch (err: any) {
      setCreatedPostPendingNav(newPost);
      setIsSubmitting(false);
      setSupabaseStatus(`⚠️ Lỗi mạng: ${err.message || 'Mất kết nối'}. Tác phẩm đã được lưu an toàn vào bộ nhớ máy.`);
    }
  };

  const handleProceedToLookbook = () => {
    if (createdPostPendingNav) {
      onCreatePost(createdPostPendingNav);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E4576E]">
              Đăng Lookbook Tác Phẩm Mới
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Đăng ảnh đẹp có địa chỉ để khách hàng đặt lịch ngay
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mỗi bài đăng trên toidep.net sẽ tự động kích hoạt nút "Làm kiểu này" đưa khách hàng đến salon của bạn.
            </p>
          </div>

          <div 
            onClick={onOpenSupabaseConfig}
            className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
              dbHealth?.postsTableReady
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
            title="Nhấp để xem chi tiết kết nối Supabase"
          >
            <Database className={`w-4 h-4 ${dbHealth?.postsTableReady ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <div className="font-bold font-mono text-[11px] flex items-center gap-1.5">
                <span>Supabase</span>
                <span className={`w-2 h-2 rounded-full ${dbHealth?.postsTableReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
              <div className="text-[10px] opacity-75">
                {dbHealth?.postsTableReady ? 'Bảng posts sẵn sàng' : 'Chờ chạy SQL schema'}
              </div>
            </div>
          </div>
        </div>

        {/* Database Status Alert Banner if table not created yet */}
        {dbHealth && !dbHealth.postsTableReady && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">
                    Supabase Connected (ref: {SUPABASE_PROJECT_REF}), nhưng bảng <code>public.posts</code> chưa được tạo trên Supabase!
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Đây là nguyên nhân khi tạo sản phẩm mới không lưu được vào database. Bạn vẫn có thể đăng sản phẩm bình thường (sản phẩm sẽ lưu vào bộ nhớ máy và kích hoạt nút đặt lịch ngay). Để lưu vĩnh viễn trên Supabase Cloud:
                  </p>
                </div>
              </div>

              {onOpenSupabaseConfig && (
                <button
                  type="button"
                  onClick={onOpenSupabaseConfig}
                  className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 rounded-xl transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Xem Mã SQL (15s)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dynamic submission status */}
        {supabaseStatus && (
          <div className={`p-4 rounded-2xl text-xs font-medium border space-y-2.5 transition-all ${
            isSuccess 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}>
            <div className="flex items-start gap-2.5">
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0 mt-0.5" />
              ) : isSuccess ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <div className="font-bold">{supabaseStatus}</div>
              </div>
            </div>

            {createdPostPendingNav && (
              <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-amber-800">
                  Tác phẩm đã sẵn sàng đưa lên bảng tin Lookbook và phục vụ khách đặt lịch:
                </span>
                <div className="flex items-center gap-2">
                  {onOpenSupabaseConfig && (
                    <button
                      type="button"
                      onClick={onOpenSupabaseConfig}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl"
                    >
                      Mở SQL Supabase
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleProceedToLookbook}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Xem Tác Phẩm Trên Lookbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Image Upload & Preview */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Hình Ảnh Tác Phẩm (Lookbook)
              </label>

              <div className="relative aspect-4/5 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-4 group">
                <img
                  src={imagePreview}
                  alt="Xem trước tác phẩm"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold">Thay đổi ảnh</span>
                  <span className="text-[10px] text-white/80">Khuyên dùng tỷ lệ 4:5 hoặc 1:1</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-[#E4576E]" />
                <span>Ảnh nét rõ kiểu tóc / móng sẽ được ưu tiên hiển thị trên trang chủ</span>
              </div>
            </div>

            {/* Right: Info Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tiêu Đề Tác Phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Tóc Layer Nữ Sóng Lơi Tự Nhiên & Mái Bay"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tên Kiểu Tóc / Móng / Dịch Vụ Cụ Thể *
                </label>
                <input
                  type="text"
                  required
                  value={styleName}
                  onChange={(e) => setStyleName(e.target.value)}
                  placeholder="Ví dụ: Layer Sóng Lơi + Mái Bay"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Đây là tên dịch vụ sẽ được điền sẵn khi khách bấm nút "Làm kiểu này"
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Danh Mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
                  >
                    <option value="hair_female">Tóc Nữ</option>
                    <option value="hair_male">Tóc Nam</option>
                    <option value="nails">Nail Art & Chăm Sóc Móng</option>
                    <option value="makeup">Trang Điểm & Make-up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Mức Giá Ước Tính
                  </label>
                  <input
                    type="text"
                    value={priceEstimate}
                    onChange={(e) => setPriceEstimate(e.target.value)}
                    placeholder="350.000đ - 650.000đ"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Salon / Địa Chỉ Thực Hiện *
                </label>
                <select
                  value={selectedSalonId}
                  onChange={(e) => setSelectedSalonId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
                >
                  {salons.map(salon => (
                    <option key={salon.id} value={salon.id}>
                      {salon.name} ({salon.district})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Địa chỉ: {selectedSalon.address}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Stylist / Thợ Chính Thực Hiện
                </label>
                <input
                  type="text"
                  value={selectedStylistName}
                  onChange={(e) => setSelectedStylistName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Minh (Minh Layer)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Mô Tả & Lời Khuyên Cho Khách Hàng
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Chia sẻ cách sấy phồng, giữ nếp sau khi làm..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Hashtag (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="toclayer, tocdep, hanoi"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu lưu tự động vào bảng <b>public.posts</b> trên Supabase</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu Database...</span>
                  </>
                ) : (
                  <span>Đăng & Lưu Vào Supabase</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
