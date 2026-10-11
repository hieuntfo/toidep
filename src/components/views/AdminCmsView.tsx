import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, Users, 
  Building2, TrendingUp, Sparkles, Filter, Pin, Check, X, ShieldAlert,
  Database, Server, RefreshCw, Key, Lock, LogOut, ExternalLink,
  Plus, Edit3, Trash2, Calendar, Phone, Clock, Search, Copy, CheckCheck,
  Eye, Tag, Scissors, Star, Terminal
} from 'lucide-react';
import { Salon, Post, BookingRequest, HanoiDistrict } from '../../types';
import { 
  SUPABASE_PROJECT_REF, 
  DEFAULT_SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  ADMIN_DEFAULT_CREDENTIALS,
  GOOSE_MCP_COMMAND,
  GOOSE_MCP_YAML,
  SUPABASE_SQL_MIGRATION,
  testSupabaseConnection,
  pushSalonsToSupabase,
  pushPostsToSupabase,
  SupabaseHealthStatus
} from '../../lib/supabase';
import { SEO_AREAS, SEO_SERVICES } from '../../lib/seoData';
import { BrandLogo } from '../common/BrandLogo';

interface AdminCmsViewProps {
  salons: Salon[];
  posts: Post[];
  bookings?: BookingRequest[];
  onToggleVerifySalon: (salonId: string) => void;
  onDeletePost: (postId: string) => void;
  onUpdateBookingStatus?: (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
  onAddSalon?: (salon: Salon) => void;
}

export const AdminCmsView: React.FC<AdminCmsViewProps> = ({
  salons,
  posts,
  bookings = [],
  onToggleVerifySalon,
  onDeletePost,
  onUpdateBookingStatus,
  onAddSalon
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('toidep_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'salons' | 'posts' | 'bookings' | 'supabase' | 'moderation' | 'seo'>('overview');

  // Supabase Health State
  const [dbStatus, setDbStatus] = useState<SupabaseHealthStatus | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Search & Filter within Admin
  const [salonSearch, setSalonSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // New Salon Modal state
  const [isAddSalonOpen, setIsAddSalonOpen] = useState(false);
  const [newSalonName, setNewSalonName] = useState('');
  const [newSalonDistrict, setNewSalonDistrict] = useState<HanoiDistrict>('Hoàn Kiếm');
  const [newSalonAddress, setNewSalonAddress] = useState('');
  const [newSalonPhone, setNewSalonPhone] = useState('');

  // Flagged posts queue (moderation)
  const [flaggedPosts, setFlaggedPosts] = useState<{ id: string; title: string; reason: string; author: string }[]>([
    { id: 'f-1', title: 'Nhuộm tóc giảm giá 50k toàn bộ', reason: 'Nghi vấn spam phá giá / lừa đảo cọc', author: 'Tiệm Tóc Ảo' }
  ]);

  // Initial Supabase test on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      handleTestConnection();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username.trim() === ADMIN_DEFAULT_CREDENTIALS.username &&
      password.trim() === ADMIN_DEFAULT_CREDENTIALS.password
    ) {
      localStorage.setItem('toidep_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Tên đăng nhập hoặc mật khẩu quản trị không chính xác.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('toidep_admin_auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleFillDemoAdmin = () => {
    setUsername(ADMIN_DEFAULT_CREDENTIALS.username);
    setPassword(ADMIN_DEFAULT_CREDENTIALS.password);
    setLoginError('');
  };

  const handleTestConnection = async () => {
    setIsTestingDb(true);
    try {
      const status = await testSupabaseConnection();
      setDbStatus(status);
    } catch {
      // Handled in utility
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSyncingData(true);
    setSyncMessage(null);
    try {
      const [salonRes, postRes] = await Promise.all([
        pushSalonsToSupabase(salons),
        pushPostsToSupabase(posts)
      ]);

      if (salonRes.success && postRes.success) {
        setSyncMessage(`✅ Thành công! Đã đồng bộ ${salonRes.count} Salons và ${postRes.count} bài đăng/sản phẩm lên Supabase.`);
      } else if (postRes.success) {
        setSyncMessage(`✅ Đã đồng bộ ${postRes.count} sản phẩm lên Supabase! (Salons: ${salonRes.message})`);
      } else {
        setSyncMessage(`⚠️ Kết quả: ${postRes.message || salonRes.message}. Nếu bảng chưa tồn tại, vui lòng chạy SQL Migration.`);
      }
    } catch (err: any) {
      setSyncMessage(`Lỗi đồng bộ: ${err.message}`);
    } finally {
      setIsSyncingData(false);
      setTimeout(() => setSyncMessage(null), 6000);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateSalon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalonName.trim() || !newSalonAddress.trim()) return;

    const newSalon: Salon = {
      id: `salon-${Date.now()}`,
      slug: newSalonName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: newSalonName.trim(),
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80',
      address: newSalonAddress.trim(),
      district: newSalonDistrict,
      phone: newSalonPhone.trim() || '0988 888 888',
      openHours: '09:00 - 21:00',
      rating: 5.0,
      reviewsCount: 1,
      description: 'Salon chất lượng cao mới gia nhập hệ thống toidep.net.',
      priceItems: [
        { name: 'Cắt tóc tạo kiểu', price: '200.000đ', duration: '45 phút', category: 'hair_female' },
        { name: 'Nhuộm màu thời trang', price: '600.000đ', duration: '120 phút', category: 'hair_female' }
      ],
      stylists: [
        {
          id: `st-${Date.now()}`,
          name: 'Chuyên viên tạo mẫu',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          title: 'Top Stylist',
          experienceYears: 5,
          salonId: `salon-${Date.now()}`,
          salonName: newSalonName.trim(),
          rating: 5.0,
          reviewsCount: 12,
          specialties: ['Tóc layer', 'Uốn sóng lơi'],
          bio: 'Chuyên gia tạo mẫu tóc với hơn 5 năm kinh nghiệm.'
        }
      ]
    };

    if (onAddSalon) {
      onAddSalon(newSalon);
    }
    setIsAddSalonOpen(false);
    setNewSalonName('');
    setNewSalonAddress('');
    setNewSalonPhone('');
  };

  // If NOT logged in, show luxury security gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#1F1A1C] text-white p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Camera Reticle Brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#E4576E] rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40 rounded-br-lg" />

          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex justify-center mb-1">
              <BrandLogo variant="white" size="lg" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-rose-300 uppercase">
              <Shield className="w-3 h-3 text-[#E4576E]" />
              Super Admin Console · v2.0
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Đăng Nhập Quản Trị Hệ Thống</h1>
            <p className="text-xs text-slate-400">
              Quản lý kết nối Database Supabase (<code className="text-[#E4576E] font-mono">{SUPABASE_PROJECT_REF}</code>), salon và duyệt bài viết.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Tên đăng nhập (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="satthucoi"
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E4576E] focus:ring-1 focus:ring-[#E4576E] transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Mật khẩu (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E4576E] focus:ring-1 focus:ring-[#E4576E] transition-all font-mono"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#E4576E] hover:bg-[#d84860] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Xác Thực & Mở Khóa Bảng Quản Trị</span>
            </button>
          </form>

          {/* Quick-fill Button for Reviewers */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-xs text-slate-400 hover:text-white transition-colors underline decoration-dotted"
            >
              ✦ Tự động điền tài khoản quản trị: <code className="text-[#E4576E] font-mono font-bold">satthucoi</code> / <code className="text-[#E4576E] font-mono font-bold">Deonho@123</code>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter salons
  const filteredSalons = salons.filter(s => 
    s.name.toLowerCase().includes(salonSearch.toLowerCase()) ||
    s.address.toLowerCase().includes(salonSearch.toLowerCase()) ||
    s.district.toLowerCase().includes(salonSearch.toLowerCase())
  );

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Bar with Root Operator Badge & Database Status */}
      <div className="bg-[#1F1A1C] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-[#E4576E] border border-rose-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#E4576E]" />
              Super Admin: satthucoi (Đã Xác Thực)
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Project: {SUPABASE_PROJECT_REF}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Trung Tâm Điều Hành toidep.net & Quản Trị FE
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Toàn quyền quản trị cơ sở dữ liệu Supabase, phê duyệt tích xanh giấy phép kinh doanh Salon, quản lý đơn đặt lịch "Làm kiểu này" và cấu hình SEO.
          </p>
        </div>

        {/* Action buttons on header */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={handleTestConnection}
            disabled={isTestingDb}
            className="px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all flex items-center gap-2"
            title="Kiểm tra kết nối trực tiếp đến Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin' : ''}`} />
            <span>{isTestingDb ? 'Đang ping...' : 'Kiểm tra Database'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/30 transition-all flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Supabase Ping Status Alert Banner */}
      {dbStatus && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-4 transition-all ${
          dbStatus.connected 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-3">
            <Database className={`w-5 h-5 shrink-0 ${dbStatus.connected ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <div className="font-bold flex items-center gap-2">
                <span>{dbStatus.message}</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white border font-normal">
                  Độ trễ: {dbStatus.latencyMs}ms
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                Endpoint: {dbStatus.url} · Kiểm tra lúc: {dbStatus.lastChecked}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('supabase')}
              className="px-3 py-1.5 bg-white font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Xem cấu hình MCP
            </button>
          </div>
        </div>
      )}

      {/* 2. North Star KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Chỉ số North Star: Đặt lịch</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {bookings.length > 0 ? `${1480 + bookings.length}` : '1.482'}{' '}
            <span className="text-xs font-normal text-slate-400">/ 2.000 mục tiêu</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Đạt 74.2% kế hoạch 6 tháng
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Salon đối tác tại Hà Nội</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {salons.length} <span className="text-xs font-normal text-slate-400">/ 300 mục tiêu</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {salons.filter(s => s.isVerified).length} salon có Tích Xanh GPKD
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Tổng Lookbook Ảnh Thật</span>
          <div className="text-2xl font-extrabold text-[#E4576E]">
            {posts.length * 12} <span className="text-xs font-normal text-slate-400">ảnh</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            100% Ảnh gắn định vị & thợ
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Doanh thu Salon Pro (MRR)</span>
          <div className="text-2xl font-extrabold text-slate-900">59.800.000đ</div>
          <div className="text-[11px] text-emerald-600 font-bold">
            Vượt ngưỡng 50tr/tháng (+19.6%)
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'overview'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tổng quan Vận hành</span>
        </button>

        <button
          onClick={() => setActiveTab('salons')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'salons'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Quản lý Salon ({salons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'posts'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Lookbook Tác Phẩm ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'bookings'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Lịch Đặt Khách ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'supabase'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database & MCP Goose</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'moderation'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Kiểm duyệt ({flaggedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'seo'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>SEO & Taxonomy</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Flywheel Tăng Trưởng Sản Phẩm toidep.net
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">1. Ảnh đẹp có địa chỉ</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Salon đăng portfolio tác phẩm thật và bảng giá minh bạch. Người dùng tìm thấy phong cách ưng ý ngay tại quận mình sinh sống (Hoàn Kiếm, Cầu Giấy, Đống Đa...).
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">2. Bấm "Làm kiểu này"</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khách không cần giải thích dài dòng với thợ cắt tóc. Ảnh mẫu và báo giá ước tính tự động đính kèm vào phiếu đặt lịch gửi thẳng cho salon.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">3. Dòng tiền & Tích xanh</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Salon có khách mới trả phí gói Salon Pro 499.000đ/tháng để hiển thị ưu tiên và gắn tích xanh GPKD xác thực, bảo vệ uy tín thương hiệu.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SALONS MANAGEMENT ================= */}
      {activeTab === 'salons' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh Sách Salon Đối Tác</h2>
              <p className="text-xs text-slate-500">Phê duyệt hoặc gỡ huy hiệu tích xanh GPKD theo Nghị định 147</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm salon theo tên hoặc quận..."
                  value={salonSearch}
                  onChange={(e) => setSalonSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#E4576E]"
                />
              </div>

              <button
                onClick={() => setIsAddSalonOpen(true)}
                className="px-4 py-2 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Salon Mới</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredSalons.map((s) => (
              <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-2xl object-cover border shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                      {s.isVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{s.address} ({s.district})</p>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Hotline: {s.phone} · Thợ chính: {s.stylists?.length || 0} nhân sự · Đánh giá: {s.rating}★
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    s.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.isVerified ? 'Tích Xanh GPKD' : 'Chưa xác thực'}
                  </span>
                  <button
                    onClick={() => onToggleVerifySalon(s.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    {s.isVerified ? 'Thu hồi tích xanh' : 'Cấp tích xanh'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: POSTS LOOKBOOK ================= */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quản Trị Lookbook Tác Phẩm</h2>
              <p className="text-xs text-slate-500">Mỗi bức ảnh đại diện cho tay nghề thực tế của thợ làm đẹp</p>
            </div>
            <span className="text-xs text-slate-400">{posts.length} tác phẩm đang hiển thị</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {posts.map((post) => (
              <div key={post.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3">
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-20 h-24 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs truncate">{post.title}</h3>
                    <p className="text-[11px] text-[#E4576E] font-semibold mt-0.5">{post.styleName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{post.salonName} · {post.salonDistrict}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-mono text-slate-400">♥ {post.likesCount} · 🔖 {post.savesCount}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title}"?`)) {
                          onDeletePost(post.id);
                        }
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold p-1"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: BOOKINGS ================= */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh Sách Khách Đặt Hẹn ("Làm Kiểu Này")</h2>
              <p className="text-xs text-slate-500">Epicenter của toidep.net — chuyển đổi từ ảnh lookbook sang lịch hẹn tại salon</p>
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                    bookingFilter === st
                      ? 'bg-[#1F1A1C] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Tất cả' : st}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              Không có lượt đặt lịch nào trong danh mục đã chọn.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {b.postImage ? (
                      <img src={b.postImage} alt={b.styleName} className="w-14 h-18 object-cover rounded-xl shrink-0" />
                    ) : (
                      <div className="w-14 h-18 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                        <Scissors className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{b.customerName}</span>
                        <span className="text-xs text-slate-500 font-mono">({b.customerPhone})</span>
                      </div>
                      <p className="text-xs font-semibold text-[#E4576E] mt-0.5">Kiểu: {b.styleName}</p>
                      <p className="text-[11px] text-slate-600">Salon: {b.salonName} · Thợ: {b.stylistName || 'Bất kỳ'}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      b.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>

                    {onUpdateBookingStatus && (
                      <select
                        value={b.status}
                        onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as any)}
                        className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 focus:outline-hidden"
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="cancelled">Hủy lịch</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: SUPABASE & GOOSE MCP ================= */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          {/* Card 1: Live Supabase Status & Push tool */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Cấu Hình Supabase Database (Project: {SUPABASE_PROJECT_REF})
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Đồng bộ dữ liệu bảng public.salons, public.posts, public.bookings với client FE
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSyncToSupabase}
                  disabled={isSyncingData}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingData ? 'animate-spin' : ''}`} />
                  <span>{isSyncingData ? 'Đang đồng bộ...' : 'Đẩy dữ liệu mẫu lên Supabase'}</span>
                </button>
              </div>
            </div>

            {syncMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
                {syncMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project URL</span>
                <div className="font-mono text-slate-900 break-all">{DEFAULT_SUPABASE_URL}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Publishable Key (Anon)</span>
                <div className="font-mono text-slate-900 truncate">{SUPABASE_PUBLISHABLE_KEY}</div>
              </div>
            </div>
          </div>

          {/* Card 2: Goose MCP CLI Configuration */}
          <div className="bg-[#1F1A1C] text-white p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">1. Khởi chạy Goose MCP Supabase Extension</h3>
              </div>
              <button
                onClick={() => copyToClipboard(GOOSE_MCP_COMMAND, 'mcp-cmd')}
                className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedCode === 'mcp-cmd' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'mcp-cmd' ? 'Đã sao chép!' : 'Sao chép lệnh'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Chạy lệnh sau trên terminal để kết nối Goose trực tiếp với Supabase project <code className="text-[#E4576E]">{SUPABASE_PROJECT_REF}</code>:
            </p>

            <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-emerald-400 font-mono text-xs overflow-x-auto">
              {GOOSE_MCP_COMMAND}
            </pre>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Hoặc thêm cấu hình vào <code className="text-white font-mono">~/.config/goose/config.yaml</code></span>
              <button
                onClick={() => copyToClipboard(GOOSE_MCP_YAML, 'mcp-yaml')}
                className="text-xs text-rose-300 hover:text-white font-semibold flex items-center gap-1"
              >
                {copiedCode === 'mcp-yaml' ? 'Đã sao chép YAML' : 'Sao chép đoạn YAML'}
              </button>
            </div>
          </div>

          {/* Card 3: SQL Migration Script */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">2. Mã SQL Tạo Bảng & Phân Quyền (SQL Migration)</h3>
                <p className="text-xs text-slate-500">Chạy một lần trong Supabase SQL Editor để khởi tạo các bảng: salons, posts, bookings, reviews</p>
              </div>
              <button
                onClick={() => copyToClipboard(SUPABASE_SQL_MIGRATION, 'sql')}
                className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-black text-white rounded-xl transition-colors flex items-center gap-1.5"
              >
                {copiedCode === 'sql' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'sql' ? 'Đã sao chép SQL!' : 'Sao chép toàn bộ SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs max-h-80 overflow-y-auto">
              {SUPABASE_SQL_MIGRATION}
            </pre>
          </div>
        </div>
      )}

      {/* ================= TAB 6: MODERATION ================= */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Hàng Chờ Kiểm Duyệt AI & Báo Cáo Vi Phạm (SLA &lt; 24h)
              </h2>
              <p className="text-xs text-slate-500">Tuân thủ nghiêm ngặt Nghị định 147/2024/NĐ-CP về an toàn không gian mạng</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Đang chờ: {flaggedPosts.length}</span>
          </div>

          {flaggedPosts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              Hàng chờ trống. Không có bài viết nào vi phạm tiêu chuẩn cộng đồng.
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedPosts.map((fp) => (
                <div key={fp.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/60 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{fp.title}</h3>
                    <span className="text-[11px] text-slate-500">Tài khoản: {fp.author}</span>
                    <p className="text-xs font-semibold text-amber-900 mt-1">Lý do gắn cờ: {fp.reason}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setFlaggedPosts(prev => prev.filter(f => f.id !== fp.id))}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors"
                    >
                      Ẩn bài viết
                    </button>
                    <button
                      onClick={() => setFlaggedPosts(prev => prev.filter(f => f.id !== fp.id))}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
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

      {/* ================= TAB 7: SEO TAXONOMY ================= */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Chiến Lược SEO Top 1 Làm Đẹp Hà Nội</h2>
            <p className="text-xs text-slate-500">Mạng lưới từ khóa và Landing Page bao phủ 8 quận trọng điểm & 8 dịch vụ chủ lực</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E4576E]">8 Quận Hành Chính Phủ Sóng</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {SEO_AREAS.map(area => (
                  <div key={area.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <span className="font-bold text-slate-900">{area.name}</span>
                    <span className="text-[10px] text-slate-500 truncate mt-1">Phường: {area.popularWards.slice(0, 2).join(', ')}...</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E4576E]">8 Danh Mục Dịch Vụ Cố Định</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {SEO_SERVICES.map(srv => (
                  <div key={srv.slug} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <span className="font-bold text-slate-900">{srv.shortName}</span>
                    <span className="text-[10px] text-slate-500 truncate mt-1">Giá: {srv.priceRangeDefault}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Salon Modal */}
      {isAddSalonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Thêm Salon Mới Vào Hệ Thống</h3>
              <button onClick={() => setIsAddSalonOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSalon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Salon</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Maison de Beaute Hair Studio"
                  value={newSalonName}
                  onChange={(e) => setNewSalonName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quận tại Hà Nội</label>
                <select
                  value={newSalonDistrict}
                  onChange={(e) => setNewSalonDistrict(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {([
                    'Hoàn Kiếm', 'Cầu Giấy', 'Đống Đa', 'Ba Đình', 
                    'Tây Hồ', 'Hai Bà Trưng', 'Thanh Xuân'
                  ] as HanoiDistrict[]).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ cụ thể</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 88 Phố Huế, Hai Bà Trưng, Hà Nội"
                  value={newSalonAddress}
                  onChange={(e) => setNewSalonAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại / Hotline</label>
                <input
                  type="text"
                  placeholder="0912 345 678"
                  value={newSalonPhone}
                  onChange={(e) => setNewSalonPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSalonOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 font-semibold text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#E4576E] hover:bg-[#d84860] font-bold text-white rounded-xl transition-colors"
                >
                  Thêm Salon & Cấp Tích Xanh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
