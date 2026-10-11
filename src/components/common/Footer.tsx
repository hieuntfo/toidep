import React from 'react';
import { BrandLogo } from './BrandLogo';
import { LogoConcept } from '../../types';
import { MapPin, Sparkles, Database, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  activeConcept?: string;
  onOpenBrandStudio: () => void;
  onOpenSupabaseConfig: () => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBrandStudio,
  onOpenSupabaseConfig,
  onNavigate
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <BrandLogo variant="tagline-primary" size="md" showTagline={true} />
            <p className="text-slate-500 leading-relaxed text-xs">
              Mạng xã hội hình ảnh làm đẹp Tóc & Nail tại Hà Nội. Khởi nguồn từ ý tưởng: Mỗi bức ảnh đẹp đều gắn với địa chỉ salon, thợ và bảng giá minh bạch.
            </p>
            <div className="flex items-center gap-2 text-slate-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#E4576E]" />
              <span>Ngách khởi đầu: Tóc & Nail Hà Nội</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3 text-xs">
              Khám Phá
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-slate-900 transition-colors">
                  Lookbook Tóc Nữ & Mái Bay
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-slate-900 transition-colors">
                  Textured Crop & Barber Nam
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-slate-900 transition-colors">
                  Nail Thạch Syrup Hàn Quốc
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('near-me')} className="hover:text-slate-900 transition-colors">
                  Salon Gần Bạn (Bán Kính 3km)
                </button>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3 text-xs">
              Dành Cho Chủ Salon
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('business')} className="hover:text-slate-900 transition-colors">
                  Gói Thành Viên Salon Pro (299k/tháng)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business')} className="hover:text-slate-900 transition-colors">
                  Nhận Khách Từ Nút "Làm Kiểu Này"
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-slate-900 transition-colors">
                  Quy Trình Cấp Tích Xanh Xác Thực
                </button>
              </li>
              <li>
                <span className="text-slate-400">Chính sách bảo vệ bản quyền ảnh</span>
              </li>
            </ul>
          </div>

          {/* Brand Identity & Technology */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Nhận Diện Thương Hiệu
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <button
                onClick={onOpenBrandStudio}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-[#E4576E] transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E4576E]" /> Brand Guide V2.0
                </span>
                <span className="text-[10px] bg-rose-100 text-[#E4576E] px-1.5 py-0.5 rounded font-mono font-bold">
                  Grid 18m
                </span>
              </button>
              <button
                onClick={onOpenSupabaseConfig}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-emerald-700 transition-colors pt-1 border-t border-slate-200"
              >
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" /> Dữ Liệu Supabase
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                  Connected
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © 2026 toidep.net. Lookbook có địa chỉ. Tác giả & Quản lý: @Hieu Nguyen.
          </div>
          <div className="flex items-center gap-4">
            <span>Tuân thủ Nghị định 147/2024/NĐ-CP</span>
            <span>·</span>
            <span>Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
