import React, { useState } from 'react';
import { 
  Sparkles, PlusCircle, Search, Compass, MapPin, 
  Users, Building2, ShieldAlert, Database, Menu, X, Tag 
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { LogoConcept } from '../../types';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  activeConcept?: string;
  onOpenSupabaseConfig: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onOpenSupabaseConfig,
  savedCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div 
          onClick={() => handleNav('explore')}
          className="cursor-pointer shrink-0 py-1"
          title="tôiđẹp · NƠI BẠN ĐƯỢC LẤY NÉT"
        >
          <BrandLogo variant="primary" size="md" showTagline={false} />
        </div>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleNav('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'explore' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            Khám phá
          </button>

          <button
            onClick={() => handleNav('near-me')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'near-me' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            Gần bạn
          </button>

          <button
            onClick={() => handleNav('seo')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeView === 'seo' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
            title="Khám phá theo quận Hà Nội & danh mục dịch vụ chuẩn SEO"
          >
            <span>Khu vực & Dịch vụ</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-[#E4576E] font-bold rounded-md">SEO</span>
          </button>

          <button
            onClick={() => handleNav('following')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'following' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            Đang theo dõi
          </button>

          <button
            onClick={() => handleNav('business')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'business' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            Salon Pro
          </button>

          <button
            onClick={() => handleNav('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'admin' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            Quản trị CMS
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Supabase status/config quick link */}
          <button
            onClick={onOpenSupabaseConfig}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Kết nối cơ sở dữ liệu Supabase"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Supabase DB</span>
          </button>

          {/* Primary CTA: Đăng bài */}
          <button
            onClick={() => handleNav('create')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng lookbook</span>
            <span className="sm:hidden">Đăng</span>
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => handleNav('profile')}
            className={`p-1.5 rounded-full border transition-all ${
              activeView === 'profile'
                ? 'border-[#E4576E] ring-2 ring-[#E4576E]/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            title="Hồ sơ & Bộ sưu tập của bạn"
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNav('explore')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'explore' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Compass className="w-4 h-4" /> Khám phá
            </button>
            <button
              onClick={() => handleNav('near-me')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'near-me' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <MapPin className="w-4 h-4" /> Gần bạn
            </button>
            <button
              onClick={() => handleNav('seo')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'seo' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Tag className="w-4 h-4" /> Khu vực & Dịch vụ SEO
            </button>
            <button
              onClick={() => handleNav('following')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'following' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" /> Đang theo dõi
            </button>
            <button
              onClick={() => handleNav('business')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'business' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4" /> Salon Pro
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">toidep.net</span>
            <button
              onClick={() => { onOpenSupabaseConfig(); setMobileMenuOpen(false); }}
              className="text-emerald-700 font-semibold flex items-center gap-1.5 py-1.5"
            >
              <Database className="w-4 h-4 text-emerald-600" /> Supabase Database
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
