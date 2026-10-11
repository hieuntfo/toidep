import React, { useState } from 'react';
import { 
  Sparkles, PlusCircle, Search, Compass, MapPin, 
  Users, Building2, ShieldAlert, Database, Menu, X, Tag,
  BookOpen, LogIn, UserCheck, Shield, Award
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { LogoConcept, UserProfile } from '../../types';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  activeConcept?: string;
  onOpenSupabaseConfig: () => void;
  savedCount: number;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onLogoutUser?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onOpenSupabaseConfig,
  savedCount,
  currentUser,
  onOpenAuthModal,
  onLogoutUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div 
          onClick={() => handleNav('explore')}
          className="cursor-pointer shrink-0 py-1"
          title="tôiđẹp · NƠI BẠN ĐƯỢC LẤY NÉT"
        >
          <BrandLogo variant="primary" size="md" showTagline={false} />
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
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
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeView === 'near-me' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            <span>Gần bạn</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => handleNav('news')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeView === 'news' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tạp chí & Video</span>
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
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeView === 'business' 
                ? 'text-[#E4576E] border-b-2 border-[#E4576E]' 
                : 'hover:text-slate-900'
            }`}
          >
            <span>Salon Pro</span>
            {currentUser?.role === 'salon_pro' && (
              <span className="text-[9px] px-1 bg-rose-500 text-white rounded-sm font-bold">PRO</span>
            )}
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
            className="hidden xl:inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-emerald-50/80 border border-emerald-200/90 hover:bg-emerald-100 rounded-xl transition-colors shadow-2xs"
            title="Kết nối cơ sở dữ liệu Supabase iglrrhlfvazivudrfued (Online)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-800 font-bold font-mono text-[11px]">Supabase DB</span>
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

          {/* User Auth / Profile Badge */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('profile')}
                className={`p-1 rounded-full border transition-all flex items-center gap-2 ${
                  activeView === 'profile'
                    ? 'border-[#E4576E] ring-2 ring-[#E4576E]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title={`Đã đăng nhập: ${currentUser.fullName} (${currentUser.role})`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-[#E4576E]" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 lg:hidden hover:bg-slate-100 rounded-lg"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
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
              <MapPin className="w-4 h-4" /> Gần bạn (GPS)
            </button>
            <button
              onClick={() => handleNav('news')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'news' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Tạp chí Làm Đẹp
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
              onClick={() => handleNav('business')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'business' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4" /> Salon Pro
            </button>
            <button
              onClick={() => handleNav('admin')}
              className={`p-2.5 rounded-lg text-left flex items-center gap-2 ${
                activeView === 'admin' ? 'bg-rose-50 text-[#E4576E]' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Quản trị CMS
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-semibold">{currentUser.fullName}</span>
                {onLogoutUser && (
                  <button
                    onClick={onLogoutUser}
                    className="text-rose-500 hover:underline font-bold text-[11px]"
                  >
                    (Đăng xuất)
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuthModal && onOpenAuthModal(); setMobileMenuOpen(false); }}
                className="text-[#E4576E] font-bold"
              >
                Đăng nhập / Đăng ký
              </button>
            )}

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
