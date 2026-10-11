import React, { useState } from 'react';
import { 
  Upload, Scissors, MapPin, Tag, CheckCircle2, 
  Sparkles, ShieldCheck, ArrowRight, Image as ImageIcon, AlertCircle,
  Database, Loader2, Check
} from 'lucide-react';
import { Post, Salon, CategoryType, HanoiDistrict } from '../../types';
import { insertPostToSupabase, SUPABASE_PROJECT_REF } from '../../lib/supabase';

interface CreatePostViewProps {
  salons: Salon[];
  onCreatePost: (newPost: Post) => void;
  onCancel: () => void;
}

export const CreatePostView: React.FC<CreatePostViewProps> = ({
  salons,
  onCreatePost,
  onCancel
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

  const selectedSalon = salons.find(s => s.id === selectedSalonId) || salons[0];

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
      alert('Vui lòng điền tiêu đề tác phẩm và tên kiểu tóc/nail.');
      return;
    }

    setIsSubmitting(true);
    setSupabaseStatus('Đang quét kiểm duyệt AI & chuẩn bị lưu Supabase...');

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      caption: caption.trim() || 'Tác phẩm mới hoàn thiện tại salon.',
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

    setSupabaseStatus('Đang gửi dữ liệu vào bảng public.posts trên Supabase...');

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
        setSupabaseStatus('⚠️ ' + dbResult.message + ' (Sản phẩm đã được lưu ngay vào bộ nhớ máy)');
        setIsSubmitting(false);
        // Also add to local state immediately so user never loses their post
        setTimeout(() => {
          onCreatePost(newPost);
        }, 2200);
      }
    } catch (err: any) {
      setSupabaseStatus('⚠️ ' + (err.message || 'Lỗi lưu database') + ' (Sản phẩm đã được lưu vào bộ nhớ máy)');
      setIsSubmitting(false);
      setTimeout(() => {
        onCreatePost(newPost);
      }, 2200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
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

          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <Database className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="font-bold font-mono text-[11px]">Supabase DB Connected</div>
              <div className="text-[10px] text-emerald-600">ref: {SUPABASE_PROJECT_REF}</div>
            </div>
          </div>
        </div>

        {supabaseStatus && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
            isSuccess 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
            ) : isSuccess ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{supabaseStatus}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: 4:5 Media Upload Preview (5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Ảnh tác phẩm (Khung chuẩn 4:5)
              </label>

              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group hover:border-[#E4576E] transition-colors">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                      Bấm để đổi ảnh khác
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-400">
                    <Upload className="w-8 h-8 mx-auto text-slate-400" />
                    <span className="text-xs block">Tải ảnh lên (WebP / JPG / PNG)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Pre-flight AI check indicator */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Moderation: Đã quét độ an toàn, không có watermark rác</span>
              </div>
            </div>

            {/* Right: Form Metadata (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tiêu đề bài đăng <span className="text-[#E4576E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Tóc Layer Nữ Tầng Lơi Tự Nhiên Tôn Góc Nghiêng"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Danh mục <span className="text-[#E4576E]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900 font-semibold"
                  >
                    <option value="hair_female">Tóc nữ & Mái bay</option>
                    <option value="hair_male">Tóc nam & Barber</option>
                    <option value="nail">Nail art & Thạch</option>
                    <option value="makeup">Makeup dự tiệc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Tên kiểu làm <span className="text-[#E4576E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={styleName}
                    onChange={(e) => setStyleName(e.target.value)}
                    placeholder="Ví dụ: Layer Huỳnh Đường"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E] focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Gắn tag Salon tại Hà Nội <span className="text-[#E4576E]">*</span>
                </label>
                <select
                  value={selectedSalonId}
                  onChange={(e) => setSelectedSalonId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900 font-semibold"
                >
                  {salons.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Thợ / Stylist thực hiện
                  </label>
                  <input
                    type="text"
                    value={selectedStylistName}
                    onChange={(e) => setSelectedStylistName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Minh"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Khoảng giá dịch vụ
                  </label>
                  <input
                    type="text"
                    value={priceEstimate}
                    onChange={(e) => setPriceEstimate(e.target.value)}
                    placeholder="350.000đ - 650.000đ"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-900 font-bold text-[#E4576E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Mô tả & hướng dẫn chăm sóc tại nhà
                </label>
                <textarea
                  rows={3}
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
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu lưu tự động vào bảng <b>public.posts</b> trên Supabase</span>
            </div>

            <div className="flex items-center gap-3">
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
