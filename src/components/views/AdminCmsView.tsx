import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, Users, 
  Building2, TrendingUp, Sparkles, Filter, Pin, Check, X, ShieldAlert,
  Database, Server, RefreshCw, Key, Lock, LogOut, ExternalLink,
  Plus, Edit3, Trash2, Calendar, Phone, Clock, Search, Copy, CheckCheck,
  Eye, Tag, Scissors, Star, Terminal, BookOpen, Play, CheckCircle2,
  FileText, Globe, ArrowRight, UserCheck, UserX, Award
} from 'lucide-react';
import { 
  Salon, Post, BookingRequest, HanoiDistrict, Article, UserProfile, 
  UserRole, ProVerificationStatus, ArticleCategory, ArticleSection 
} from '../../types';
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
  insertArticleToSupabase,
  deleteArticleFromSupabase,
  upsertUserToSupabase,
  SupabaseHealthStatus
} from '../../lib/supabase';
import { SEO_AREAS, SEO_SERVICES } from '../../lib/seoData';
import { BrandLogo } from '../common/BrandLogo';

interface AdminCmsViewProps {
  salons: Salon[];
  posts: Post[];
  bookings?: BookingRequest[];
  articles?: Article[];
  users?: UserProfile[];
  onToggleVerifySalon: (salonId: string) => void;
  onDeletePost: (postId: string) => void;
  onUpdateBookingStatus?: (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
  onAddSalon?: (salon: Salon) => void;
  onUpdateSalon?: (salon: Salon) => void;
  onUpdateArticles?: (articles: Article[]) => void;
  onUpdateUsers?: (users: UserProfile[]) => void;
  onPreviewArticle?: (article: Article) => void;
  onOpenSalonEdit?: (salon: Salon) => void;
}

export const AdminCmsView: React.FC<AdminCmsViewProps> = ({
  salons,
  posts,
  bookings = [],
  articles = [],
  users = [],
  onToggleVerifySalon,
  onDeletePost,
  onUpdateBookingStatus,
  onAddSalon,
  onUpdateSalon,
  onUpdateArticles,
  onUpdateUsers,
  onPreviewArticle,
  onOpenSalonEdit
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
  const [activeTab, setActiveTab] = useState<
    'overview' | 'salons' | 'users' | 'articles' | 'posts' | 'bookings' | 'supabase' | 'moderation' | 'seo'
  >('overview');

  // Supabase Health State
  const [dbStatus, setDbStatus] = useState<SupabaseHealthStatus | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Search & Filters
  const [salonSearch, setSalonSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'pending_pro' | 'approved_pro' | 'customer' | 'admin'>('all');
  const [articleSearch, setArticleSearch] = useState('');
  const [articleStatusFilter, setArticleStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // New Salon Modal state
  const [isAddSalonOpen, setIsAddSalonOpen] = useState(false);
  const [newSalonName, setNewSalonName] = useState('');
  const [newSalonDistrict, setNewSalonDistrict] = useState<HanoiDistrict>('Hoàn Kiếm');
  const [newSalonAddress, setNewSalonAddress] = useState('');
  const [newSalonPhone, setNewSalonPhone] = useState('');

  // New Article Modal / Drawer state
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtSubtitle, setNewArtSubtitle] = useState('');
  const [newArtCategory, setNewArtCategory] = useState<ArticleCategory>('hair_trends');
  const [newArtCover, setNewArtCover] = useState('/src/assets/images/hair_layer_woman_1791614539000.jpg');
  const [newArtReadTime, setNewArtReadTime] = useState('5 phút đọc');
  const [newArtAuthorName, setNewArtAuthorName] = useState('Ban Biên Tập');
  const [newArtStatus, setNewArtStatus] = useState<'published' | 'draft'>('published');
  const [newArtParagraph1, setNewArtParagraph1] = useState('');
  const [newArtPullquote, setNewArtPullquote] = useState('');
  const [newArtVideoUrl, setNewArtVideoUrl] = useState('');
  const [newArtVideoTitle, setNewArtVideoTitle] = useState('');

  // Flagged posts queue
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

  const handleTestConnection = async () => {
    setIsTestingDb(true);
    try {
      const res = await testSupabaseConnection();
      setDbStatus(res);
    } catch (e: any) {
      setDbStatus({
        connected: false,
        projectRef: SUPABASE_PROJECT_REF,
        url: DEFAULT_SUPABASE_URL,
        hasTables: false,
        postsTableReady: false,
        latencyMs: 0,
        message: 'Lỗi kiểm tra kết nối mạng',
        lastChecked: new Date().toLocaleTimeString('vi-VN')
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Sync datasets to Supabase
  const handleSyncAllData = async () => {
    setIsSyncingData(true);
    setSyncMessage('Đang đồng bộ dữ liệu Salons và Lookbook lên Supabase...');
    try {
      const resSalons = await pushSalonsToSupabase(salons);
      const resPosts = await pushPostsToSupabase(posts);
      setSyncMessage(`Thành công! Đã đồng bộ ${resSalons.count} salon và ${resPosts.count} lookbook lên Supabase.`);
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (e: any) {
      setSyncMessage(`Lỗi đồng bộ: ${e.message}`);
    } finally {
      setIsSyncingData(false);
    }
  };

  // User & Salon Pro Management
  const handleApproveSalonPro = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          proStatus: 'approved' as ProVerificationStatus,
          role: 'salon_pro' as UserRole
        };
      }
      return u;
    });
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    const targetUser = updatedUsers.find(u => u.id === userId);
    if (targetUser) {
      upsertUserToSupabase(targetUser).catch(err => console.warn('Sync user notice:', err));
    }
  };

  const handleRejectSalonPro = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          proStatus: 'rejected' as ProVerificationStatus
        };
      }
      return u;
    });
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    const targetUser = updatedUsers.find(u => u.id === userId);
    if (targetUser) {
      upsertUserToSupabase(targetUser).catch(err => console.warn('Sync user notice:', err));
    }
  };

  const handleToggleUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          proStatus: newRole === 'salon_pro' ? 'approved' as ProVerificationStatus : 'none' as ProVerificationStatus
        };
      }
      return u;
    });
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    const targetUser = updatedUsers.find(u => u.id === userId);
    if (targetUser) {
      upsertUserToSupabase(targetUser).catch(err => console.warn('Sync user notice:', err));
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    const updatedUsers = users.filter(u => u.id !== userId);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
  };

  // News / Editorial Article Management
  const handleTogglePublishArticle = (articleId: string) => {
    const target = articles.find(a => a.id === articleId);
    if (!target) return;
    const newStatus = target.status === 'published' ? 'draft' : 'published';
    const updatedArticles = articles.map(a => {
      if (a.id === articleId) {
        return { ...a, status: newStatus as 'published' | 'draft' };
      }
      return a;
    });
    if (onUpdateArticles) onUpdateArticles(updatedArticles);
    const updatedArt = updatedArticles.find(a => a.id === articleId);
    if (updatedArt) {
      insertArticleToSupabase(updatedArt).catch(err => console.warn('Sync article notice:', err));
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này khỏi hệ thống?')) return;
    const updatedArticles = articles.filter(a => a.id !== articleId);
    if (onUpdateArticles) onUpdateArticles(updatedArticles);
    deleteArticleFromSupabase(articleId).catch(err => console.warn('Delete article notice:', err));
  };

  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle) return;

    const categoryLabels: Record<ArticleCategory, string> = {
      hair_trends: 'Xu Hướng Tóc',
      hair_care: 'Chăm Sóc Tóc',
      makeup_nail: 'Nail & Makeup',
      interviews: 'Phỏng Vấn Stylist',
      technology: 'Công Nghệ Làm Đẹp'
    };

    const newSections: ArticleSection[] = [
      {
        id: `sec-${Date.now()}-1`,
        type: 'paragraph',
        content: newArtParagraph1 || 'Bài viết phân tích chuyên sâu về phong cách và kỹ thuật làm đẹp mới nhất...'
      }
    ];

    if (newArtPullquote) {
      newSections.push({
        id: `sec-${Date.now()}-2`,
        type: 'pullquote',
        content: newArtPullquote,
        caption: newArtAuthorName
      });
    }

    if (newArtVideoUrl) {
      newSections.push({
        id: `sec-${Date.now()}-3`,
        type: 'vertical_video',
        videoTitle: newArtVideoTitle || 'Thước Phim Dọc 9:16 Hậu Trường',
        videoUrl: newArtVideoUrl,
        videoDuration: '00:45',
        videoPoster: newArtCover,
        caption: 'Video dọc định dạng 9:16 trình diễn thao tác salon.'
      });
    }

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug: newArtTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      title: newArtTitle,
      subtitle: newArtSubtitle || 'Chuyên đề thời trang làm đẹp độc quyền tại toidep.net',
      category: newArtCategory,
      categoryLabel: categoryLabels[newArtCategory],
      coverImage: newArtCover,
      readTime: newArtReadTime,
      author: {
        name: newArtAuthorName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        title: 'Beauty Editor · toidep.net'
      },
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      status: newArtStatus,
      isFeatured: false,
      viewsCount: 1,
      likesCount: 0,
      sections: newSections,
      tags: ['Làm Đẹp Hà Nội', categoryLabels[newArtCategory]]
    };

    const updated = [newArticle, ...articles];
    if (onUpdateArticles) onUpdateArticles(updated);
    insertArticleToSupabase(newArticle).catch(err => console.warn('Sync article notice:', err));

    setIsNewArticleOpen(false);
    setNewArtTitle('');
    setNewArtSubtitle('');
    setNewArtParagraph1('');
    setNewArtPullquote('');
    setNewArtVideoUrl('');
  };

  // Create Salon
  const handleCreateSalon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalonName || !newSalonAddress) return;

    const newSalon: Salon = {
      id: `salon-${Date.now()}`,
      slug: newSalonName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      name: newSalonName,
      isVerified: true,
      avatar: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
      coverImage: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
      address: newSalonAddress,
      district: newSalonDistrict,
      phone: newSalonPhone || '0912 345 678',
      openHours: '09:00 - 21:00 (Hàng ngày)',
      rating: 5.0,
      reviewsCount: 1,
      description: 'Salon chất lượng cao tại Hà Nội vừa được cấp Tích Xanh GPKD trên toidep.net.',
      priceItems: [
        { name: 'Cắt tóc tạo kiểu', price: '200.000đ', duration: '45 phút', category: 'hair_female' },
        { name: 'Uốn tóc tạo kiểu', price: '600.000đ', duration: '90 phút', category: 'hair_female' }
      ],
      stylists: [],
      latitude: 21.0285,
      longitude: 105.8542,
      distanceKm: 1.0,
      proPlanActive: true
    };

    if (onAddSalon) onAddSalon(newSalon);
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
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#E4576E] rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40 rounded-br-lg" />

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
              Quản lý kết nối Database Supabase (<code className="text-[#E4576E] font-mono">{SUPABASE_PROJECT_REF}</code>), salon, duyệt Salon Pro và quản trị tin tức.
            </p>
          </div>

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
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#E4576E] hover:bg-[#d84860] text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Đăng Nhập Super Admin</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-[11px] text-slate-400">
            Tài khoản mẫu: <span className="text-white font-mono font-bold">satthucoi</span> / <span className="text-white font-mono font-bold">Deonho@123</span>
          </div>
        </div>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = users.filter(u => {
    if (userRoleFilter === 'pending_pro' && !(u.role === 'salon_pro' && u.proStatus === 'pending')) return false;
    if (userRoleFilter === 'approved_pro' && !(u.role === 'salon_pro' && u.proStatus === 'approved')) return false;
    if (userRoleFilter === 'customer' && u.role !== 'customer') return false;
    if (userRoleFilter === 'admin' && u.role !== 'admin') return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
    }
    return true;
  });

  // Filtered articles
  const filteredArticles = articles.filter(a => {
    if (articleStatusFilter === 'published' && a.status !== 'published') return false;
    if (articleStatusFilter === 'draft' && a.status !== 'draft') return false;
    if (articleSearch.trim()) {
      const q = articleSearch.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Admin Top Banner */}
      <div className="bg-[#1F1A1C] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E4576E]/20 text-[#E4576E] border border-[#E4576E]/30 text-[10px] font-mono font-bold flex items-center gap-1.5 uppercase">
              <Shield className="w-3 h-3 text-[#E4576E]" />
              Super Admin: satthucoi (Đã Xác Thực)
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Project: {SUPABASE_PROJECT_REF}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Trung Tâm Điều Hành toidep.net & Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Quản trị người dùng, duyệt hồ sơ Salon Pro, biên tập & public tin tức tạp chí longform, và cấu hình cơ sở dữ liệu Supabase.
          </p>
        </div>

        {/* Action buttons on header */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={handleTestConnection}
            disabled={isTestingDb}
            className="px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all flex items-center gap-2"
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

      {/* Supabase Status Alert */}
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
          <button
            onClick={() => setActiveTab('supabase')}
            className="px-3 py-1.5 bg-white font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Cấu hình Supabase
          </button>
        </div>
      )}

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Người Dùng Đăng Ký</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {users.length} <span className="text-xs font-normal text-slate-400">tài khoản</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> {users.filter(u => u.proStatus === 'pending').length} đơn chờ duyệt Pro
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Bài Viết Tạp Chí (CMS)</span>
          <div className="text-2xl font-extrabold text-[#E4576E]">
            {articles.length} <span className="text-xs font-normal text-slate-400">bài</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            {articles.filter(a => a.status === 'published').length} bài đã Public ra ngoài
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Salon Đối Tác</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {salons.length} <span className="text-xs font-normal text-slate-400">cơ sở</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {salons.filter(s => s.isVerified).length} salon có Tích Xanh GPKD
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Đơn Đặt Lịch "Làm kiểu này"</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {bookings.length} <span className="text-xs font-normal text-slate-400">lượt</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            {bookings.filter(b => b.status === 'confirmed').length} đơn đã xác nhận
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
          <span>Tổng quan</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'users'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản lý User & Duyệt Salon Pro ({users.length})</span>
          {users.some(u => u.proStatus === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-[#E4576E] animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap px-1 ${
            activeTab === 'articles'
              ? 'border-[#E4576E] text-[#E4576E]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Quản trị Tin Tức & Tạp Chí ({articles.length})</span>
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
          <span>Database Supabase</span>
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
                <span className="text-xs font-bold text-slate-900 block">1. Định Vị GPS & Lookbook Thật</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Salon đăng portfolio tác phẩm thật và bảng giá minh bạch. Người dùng bật định vị GPS lấy vị trí chính xác để tính khoảng cách trong 1-5km.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">2. Nút "Làm kiểu này" Chuyển Đổi Cao</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khách không cần giải thích dài dòng với thợ. Ảnh mẫu và báo giá ước tính tự động đính kèm vào phiếu đặt lịch gửi thẳng cho salon.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">3. Duyệt Salon Pro & Tạp Chí Longform</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Admin phê duyệt tích xanh Salon Pro để chủ tiệm tự khởi tạo & sửa bảng giá, đồng thời biên tập bài viết longform có video dọc 9:16 thu hút độc giả.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: USERS & SALON PRO ================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Quản Trị Người Dùng & Phê Duyệt Salon Pro
              </h2>
              <p className="text-xs text-slate-500">
                Duyệt cấp Tích Xanh GPKD cho chủ salon, quản lý phân quyền và thông tin đăng nhập bên thứ 3 (Google, Facebook, Apple).
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { id: 'all', label: `Tất cả (${users.length})` },
                { id: 'pending_pro', label: `Chờ duyệt Pro (${users.filter(u => u.proStatus === 'pending').length})` },
                { id: 'approved_pro', label: `Đã duyệt Pro (${users.filter(u => u.proStatus === 'approved').length})` },
                { id: 'customer', label: `Khách hàng (${users.filter(u => u.role === 'customer').length})` },
                { id: 'admin', label: `Admin (${users.filter(u => u.role === 'admin').length})` }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setUserRoleFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    userRoleFilter === pill.id
                      ? 'bg-[#1E1E24] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#E4576E]"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Người dùng</th>
                  <th className="py-3 px-4">Loại tài khoản</th>
                  <th className="py-3 px-4">Đăng nhập qua</th>
                  <th className="py-3 px-4">Trạng thái Salon Pro</th>
                  <th className="py-3 px-4 text-right">Hành động của Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.fullName}</span>
                            {u.role === 'salon_pro' && u.proStatus === 'approved' && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          {u.phone && (
                            <div className="text-[10px] text-slate-400">{u.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'salon_pro'
                          ? 'bg-rose-100 text-[#E4576E]'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role === 'admin' ? 'Super Admin' : u.role === 'salon_pro' ? 'Chủ Salon Pro' : 'Khách Hàng'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-600 capitalize">
                      {u.authProvider === 'google' ? 'Google (Gmail)' : u.authProvider === 'facebook' ? 'Facebook' : u.authProvider === 'apple' ? 'Apple ID' : 'Email/Mật khẩu'}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.role === 'salon_pro' ? (
                        u.proStatus === 'pending' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            Chờ Admin Phê Duyệt
                          </span>
                        ) : u.proStatus === 'approved' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đã Duyệt Pro Tích Xanh
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold w-max">
                            Bị từ chối
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* If pending salon pro, show one-click approve */}
                        {u.role === 'salon_pro' && u.proStatus === 'pending' && (
                          <button
                            onClick={() => handleApproveSalonPro(u.id)}
                            className="px-3 py-1.5 bg-[#E4576E] hover:bg-[#d84860] text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1"
                            title="Phê duyệt Salon Pro cấp Tích Xanh"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Duyệt Pro Ngay</span>
                          </button>
                        )}

                        {u.role === 'salon_pro' && u.proStatus === 'pending' && (
                          <button
                            onClick={() => handleRejectSalonPro(u.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                          >
                            Từ chối
                          </button>
                        )}

                        {u.role === 'salon_pro' && u.proStatus === 'approved' && (
                          <button
                            onClick={() => handleToggleUserRole(u.id, 'customer')}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-semibold rounded-lg text-xs transition-colors"
                            title="Hạ cấp về tài khoản thường"
                          >
                            Hạ cấp
                          </button>
                        )}

                        {u.role === 'customer' && (
                          <button
                            onClick={() => handleToggleUserRole(u.id, 'salon_pro')}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#E4576E] font-bold rounded-lg text-xs transition-colors"
                            title="Nâng cấp user lên Salon Pro"
                          >
                            + Nâng Salon Pro
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: NEWS / ARTICLES CMS ================= */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E]">
                  Toà Soạn & Quản Trị Tin Tức
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#E4576E] border border-rose-200">
                  Longform Editorial & Video 9:16
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Quản Trị Tin Tức & Tạp Chí Làm Đẹp
              </h2>
              <p className="text-xs text-slate-500">
                Admin tự chọn bài viết trong BE quản trị để Public ra website. Bài viết luôn ở dạng Longform trình diễn ảnh nét cao và video dọc 9:16.
              </p>
            </div>

            <button
              onClick={() => setIsNewArticleOpen(true)}
              className="py-2.5 px-4 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Soạn Bài Viết Longform Mới</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              {[
                { id: 'all', label: `Tất cả (${articles.length})` },
                { id: 'published', label: `Đã Public (${articles.filter(a => a.status === 'published').length})` },
                { id: 'draft', label: `Bản Nháp (${articles.filter(a => a.status === 'draft').length})` }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setArticleStatusFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    articleStatusFilter === pill.id
                      ? 'bg-[#1E1E24] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder="Tìm tiêu đề bài viết..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#E4576E]"
              />
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-4">
            {filteredArticles.map((art) => (
              <div 
                key={art.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E] bg-rose-50 px-2 py-0.5 rounded-md">
                        {art.categoryLabel}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{art.readTime}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">{art.publishedAt}</span>
                      {art.sections.some(s => s.type === 'vertical_video') && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          Video Dọc 9:16
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{art.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{art.subtitle}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>Biên tập: <strong>{art.author.name}</strong></span>
                      <span>·</span>
                      <span>{art.viewsCount.toLocaleString()} lượt đọc</span>
                      <span>·</span>
                      <span>{art.likesCount} yêu thích</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {/* Status Toggle (Public / Draft) */}
                  <button
                    onClick={() => handleTogglePublishArticle(art.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                      art.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-[#E4576E] text-white hover:bg-[#d84860]'
                    }`}
                    title={art.status === 'published' ? 'Bấm để hạ về Bản Nháp' : 'Bấm để Public ngay ra trang Tạp chí'}
                  >
                    {art.status === 'published' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã Public (Bấm để Hạ)</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        <span>🚀 Chọn & Public Ngay</span>
                      </>
                    )}
                  </button>

                  {/* Preview Longform Button */}
                  {onPreviewArticle && (
                    <button
                      onClick={() => onPreviewArticle(art)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      title="Xem trước bài viết dạng longform"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem trước</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: SALONS ================= */}
      {activeTab === 'salons' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh Sách Salon Đối Tác</h2>
              <p className="text-xs text-slate-500">Phê duyệt tích xanh GPKD hoặc cấu hình bảng giá và thông tin tiệm</p>
            </div>
            <button
              onClick={() => setIsAddSalonOpen(true)}
              className="px-4 py-2 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Salon Đối Tác Mới</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Salon</th>
                  <th className="py-3 px-4">Khu vực</th>
                  <th className="py-3 px-4">Tích Xanh GPKD</th>
                  <th className="py-3 px-4">Gói Salon Pro</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salons.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <div>{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{s.address}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{s.district}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onToggleVerifySalon(s.id)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                          s.isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {s.isVerified ? '✓ Đã Xác Minh GPKD' : 'Chưa Xác Minh'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-[#E4576E] border border-rose-200">
                        {s.proPlanActive ? 'Active Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {onOpenSalonEdit && (
                        <button
                          onClick={() => onOpenSalonEdit(s)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                        >
                          Sửa Trang Salon
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: LOOKBOOK POSTS ================= */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Portfolio Lookbook Sản Phẩm ({posts.length})</h2>
              <p className="text-xs text-slate-500">Mỗi bức ảnh gắn liền với thợ thực hiện và nút "Làm kiểu này"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <div key={post.id} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2">
                <img src={post.images[0]} alt={post.title} className="w-full h-36 object-cover rounded-xl" />
                <h4 className="text-xs font-bold text-slate-900 truncate">{post.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{post.salonName}</span>
                  <span className="font-bold text-[#E4576E]">{post.priceEstimate}</span>
                </div>
                <div className="pt-2 border-t flex justify-end">
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: BOOKINGS ================= */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">Yêu Cầu Đặt Lịch Từ Nút "Làm kiểu này" ({bookings.length})</h2>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Kiểu tóc yêu cầu</th>
                  <th className="py-3 px-4">Salon tiếp nhận</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="py-3 px-4">
                      <div className="font-bold">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400">{b.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#E4576E]">{b.styleName}</td>
                    <td className="py-3 px-4">{b.salonName}</td>
                    <td className="py-3 px-4">{b.date} lúc {b.timeSlot}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: DATABASE & MCP GOOSE ================= */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Đồng Bộ Toàn Bộ Dữ Liệu Lên Supabase</h2>
                <p className="text-xs text-slate-500">Đẩy toàn bộ Salon, Lookbook, Bài viết và User lên Supabase Database</p>
              </div>
              <button
                onClick={handleSyncAllData}
                disabled={isSyncingData}
                className="px-4 py-2.5 bg-[#E4576E] hover:bg-[#d84860] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isSyncingData ? 'Đang đồng bộ...' : 'Đồng Bộ Lên Supabase'}</span>
              </button>
            </div>

            {syncMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                {syncMessage}
              </div>
            )}
          </div>

          <div className="bg-[#1F1A1C] text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#E4576E]">Goose MCP Server CLI</h3>
            <pre className="p-4 bg-black/60 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-white/10">
              {GOOSE_MCP_COMMAND}
            </pre>
          </div>
        </div>
      )}

      {/* MODAL: Soạn Bài Viết Longform Mới */}
      {isNewArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E]">Toà Soạn toidep.net</span>
                <h3 className="font-bold text-slate-900 text-base">Soạn Thảo Bài Viết Longform & Video 9:16</h3>
              </div>
              <button onClick={() => setIsNewArticleOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết (Headline)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nghệ Thuật Tóc Layer Sóng Lơi: Bí Quyết Bồng Bềnh 2026"
                  value={newArtTitle}
                  onChange={(e) => setNewArtTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sapo / Tóm tắt mở đầu</label>
                <textarea
                  rows={2}
                  placeholder="Đoạn mở đầu cuốn hút dẫn dắt người đọc..."
                  value={newArtSubtitle}
                  onChange={(e) => setNewArtSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
                  <select
                    value={newArtCategory}
                    onChange={(e) => setNewArtCategory(e.target.value as ArticleCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="hair_trends">Xu Hướng Tóc</option>
                    <option value="makeup_nail">Nail & Makeup</option>
                    <option value="hair_care">Chăm Sóc Tóc</option>
                    <option value="interviews">Phỏng Vấn Stylist</option>
                    <option value="technology">Công Nghệ Làm Đẹp</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời gian đọc & Tác giả</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newArtReadTime}
                      onChange={(e) => setNewArtReadTime(e.target.value)}
                      placeholder="5 phút đọc"
                      className="w-1/2 px-3 py-2 rounded-xl border border-slate-200"
                    />
                    <input
                      type="text"
                      value={newArtAuthorName}
                      onChange={(e) => setNewArtAuthorName(e.target.value)}
                      placeholder="Tên tác giả"
                      className="w-1/2 px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Ảnh Bìa Hero (Cover Image URL)</label>
                <input
                  type="text"
                  value={newArtCover}
                  onChange={(e) => setNewArtCover(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-200">
                <h4 className="font-bold text-slate-800">Nội Dung Longform Mở Rộng:</h4>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Đoạn văn mở đầu (Kèm Drop Cap)</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập nội dung đoạn văn chính..."
                    value={newArtParagraph1}
                    onChange={(e) => setNewArtParagraph1(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Trích dẫn nghệ thuật (Pull Quote)</label>
                  <input
                    type="text"
                    placeholder="VD: Tóc đẹp tự nhiên là khi bước ra đường gió thổi vẫn giữ nếp hoàn hảo."
                    value={newArtPullquote}
                    onChange={(e) => setNewArtPullquote(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Link Video Dọc 9:16 (Tùy chọn)</label>
                    <input
                      type="text"
                      placeholder="https://assets.mixkit.co/...mp4"
                      value={newArtVideoUrl}
                      onChange={(e) => setNewArtVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Tiêu đề Video Dọc</label>
                    <input
                      type="text"
                      placeholder="Hậu trường sấy uốn tại salon"
                      value={newArtVideoTitle}
                      onChange={(e) => setNewArtVideoTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái xuất bản</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-700">
                    <input
                      type="radio"
                      name="artStatus"
                      checked={newArtStatus === 'published'}
                      onChange={() => setNewArtStatus('published')}
                    />
                    <span>🚀 Xuất bản công khai (Public) ngay</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-700">
                    <input
                      type="radio"
                      name="artStatus"
                      checked={newArtStatus === 'draft'}
                      onChange={() => setNewArtStatus('draft')}
                    />
                    <span>Lưu vào Bản Nháp (Draft)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewArticleOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 font-semibold text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#E4576E] hover:bg-[#d84860] font-bold text-white rounded-xl transition-colors shadow-xs"
                >
                  Hoàn Tất & Lưu Vào Hệ Thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Thêm Salon mới */}
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
