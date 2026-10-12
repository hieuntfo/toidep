import React, { useState } from 'react';
import { 
  X, Mail, Lock, User, Phone, CheckCircle2, AlertCircle, 
  Sparkles, ShieldCheck, ArrowRight, Eye, EyeOff, Building2,
  ExternalLink
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
  authNotice?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  initialMode = 'login',
  authNotice
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regSalonName, setRegSalonName] = useState('');
  const [regSalonAddress, setRegSalonAddress] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'done'>('email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  // Handle Login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    // Check predefined / existing users in localStorage
    const savedUsersStr = localStorage.getItem('toidep_users');
    let usersList: UserProfile[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    // Special check for master admin
    if (loginEmail === 'admin@toidep.net' || loginEmail === 'satthucoi') {
      const adminUser: UserProfile = {
        id: 'usr-admin-1',
        email: 'admin@toidep.net',
        fullName: 'Tổng Quản Trị Viên (Admin)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        phone: '0900 888 999',
        role: 'admin',
        proStatus: 'none',
        registeredAt: '01/01/2026',
        authProvider: 'email',
        bio: 'Quản trị viên toàn hệ thống toidep.net'
      };
      onLogin(adminUser);
      onClose();
      return;
    }

    const found = usersList.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (found) {
      onLogin(found);
      onClose();
    } else {
      // Create user session if first-time demo
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: loginEmail,
        fullName: loginEmail.split('@')[0],
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        role: 'customer',
        proStatus: 'none',
        registeredAt: new Date().toLocaleDateString('vi-VN'),
        authProvider: 'email'
      };
      usersList.push(newUser);
      localStorage.setItem('toidep_users', JSON.stringify(usersList));
      onLogin(newUser);
      onClose();
    }
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regFullName || !regEmail || !regPassword) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.');
      return;
    }

    const savedUsersStr = localStorage.getItem('toidep_users');
    let usersList: UserProfile[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const isSalonPro = regRole === 'salon_pro';

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: regEmail,
      fullName: regFullName,
      avatar: isSalonPro
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      phone: regPhone,
      role: regRole,
      proStatus: isSalonPro ? 'pending' : 'none',
      salonId: isSalonPro ? `salon-${Date.now()}` : undefined,
      registeredAt: new Date().toLocaleDateString('vi-VN'),
      authProvider: 'email',
      bio: isSalonPro 
        ? `Chủ sáng lập ${regSalonName || 'Salon Làm Đẹp'}. Địa chỉ: ${regSalonAddress || 'Hà Nội'}`
        : 'Người dùng yêu thích làm đẹp tại Hà Nội'
    };

    usersList.push(newUser);
    localStorage.setItem('toidep_users', JSON.stringify(usersList));
    onLogin(newUser);
    setSuccessMsg(isSalonPro 
      ? 'Đăng ký Salon Pro thành công! Hồ sơ của bạn đã được gửi tới Admin để duyệt gắn Tích Xanh.' 
      : 'Đăng ký tài khoản thành công!'
    );
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 3rd Party OAuth Simulation (Google / Facebook / Apple)
  const handleThirdPartyOAuth = (provider: 'google' | 'facebook' | 'apple') => {
    const providerNames = {
      google: 'Google (Gmail)',
      facebook: 'Facebook',
      apple: 'Apple ID'
    };

    const oauthUser: UserProfile = {
      id: `usr-${provider}-${Date.now()}`,
      email: provider === 'google' ? 'user.google@gmail.com' : `${provider}.user@toidep.net`,
      fullName: provider === 'google' ? 'Nguyễn Mai Phương (Google)' : provider === 'facebook' ? 'Trần Tuấn Anh (FB)' : 'Apple User',
      avatar: provider === 'google'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      role: 'customer',
      proStatus: 'none',
      registeredAt: new Date().toLocaleDateString('vi-VN'),
      authProvider: provider,
      bio: `Đăng nhập nhanh qua ${providerNames[provider]}`
    };

    const savedUsersStr = localStorage.getItem('toidep_users');
    let usersList: UserProfile[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    if (!usersList.some(u => u.id === oauthUser.id)) {
      usersList.push(oauthUser);
      localStorage.setItem('toidep_users', JSON.stringify(usersList));
    }

    onLogin(oauthUser);
    onClose();
  };

  // Forgot Password Steps
  const handleForgotStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMsg('Vui lòng nhập email đăng ký.');
      return;
    }
    setErrorMsg('');
    setForgotStep('otp');
    setSuccessMsg('Mã OTP 6 số đã được gửi tới email của bạn (Mã mẫu: 888999).');
  };

  const handleForgotStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtp !== '888999' && forgotOtp.length < 4) {
      setErrorMsg('Mã OTP không đúng. Vui lòng nhập 888999.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    setForgotStep('done');
    setSuccessMsg('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
    setTimeout(() => {
      setMode('login');
      setForgotStep('email');
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E]">
              Tài Khoản & Định Danh toidep.net
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {mode === 'login' && 'Đăng Nhập'}
              {mode === 'register' && 'Đăng Ký Tài Khoản'}
              {mode === 'forgot' && 'Khôi Phục Mật Khẩu'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {authNotice && (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">Yêu cầu đăng nhập:</span>
                <span>{authNotice}</span>
              </div>
            </div>
          )}

          {/* Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <div className="space-y-4">
              {/* 3rd Party OAuth Buttons */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 text-center">
                  Đăng nhập nhanh 1 chạm bằng tài khoản liên kết:
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleThirdPartyOAuth('google')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThirdPartyOAuth('facebook')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThirdPartyOAuth('apple')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-black" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.79 1.41-.59.68-1.1 1.74-1.01 2.8.07.01 1.9-.3 2.79-1.34z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold absolute">
                  Hoặc bằng Email
                </span>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email hoặc Tên đăng nhập
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@toidep.net hoặc email của bạn"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E] focus:ring-1 focus:ring-[#E4576E]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-semibold text-[#E4576E] hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E] focus:ring-1 focus:ring-[#E4576E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-500">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold text-[#E4576E] hover:underline"
                >
                  Đăng ký ngay (Miễn phí)
                </button>
              </div>
            </div>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bạn đăng ký với tư cách gì?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      regRole === 'customer'
                        ? 'border-[#E4576E] bg-rose-50/50 ring-1 ring-[#E4576E]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#E4576E]" />
                      <span className="text-xs font-bold text-slate-900">Khách Hàng</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Tìm kiếm mẫu đẹp, lưu lookbook, đặt lịch làm kiểu
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('salon_pro')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      regRole === 'salon_pro'
                        ? 'border-[#E4576E] bg-rose-50/50 ring-1 ring-[#E4576E]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E4576E]" />
                      <span className="text-xs font-bold text-[#E4576E]">Salon Pro</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Chủ salon / Thợ tóc, nhận khách & chỉnh sửa trang tiệm
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và Tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="VD: Nguyễn Phương Thảo"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@vidu.com"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0912 xxx xxx"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                  />
                </div>
              </div>

              {/* Extra fields if registering as Salon Pro */}
              {regRole === 'salon_pro' && (
                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E4576E]">
                    <Building2 className="w-4 h-4" />
                    <span>Thông tin cơ sở Salon Pro đăng ký</span>
                  </div>
                  <input
                    type="text"
                    value={regSalonName}
                    onChange={(e) => setRegSalonName(e.target.value)}
                    placeholder="Tên Salon (VD: Hair Atelier Hà Nội)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    value={regSalonAddress}
                    onChange={(e) => setRegSalonAddress(e.target.value)}
                    placeholder="Địa chỉ chi tiết (VD: 45 Cầu Giấy, Hà Nội)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                  <p className="text-[10px] text-slate-500">
                    💡 Sau khi đăng ký, hồ sơ Salon Pro sẽ được Admin duyệt cấp Tích Xanh để mở khóa toàn bộ quyền chỉnh sửa bảng giá & nhận lịch hẹn.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Hoàn Tất Đăng Ký</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#E4576E] hover:underline"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 'email' && (
                <form onSubmit={handleForgotStep1} className="space-y-3.5">
                  <p className="text-xs text-slate-500">
                    Nhập email bạn đã đăng ký tài khoản. Hệ thống sẽ gửi mã OTP xác thực khôi phục mật khẩu.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="email@vidu.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    Gửi Mã Xác Thực OTP
                  </button>
                </form>
              )}

              {forgotStep === 'otp' && (
                <form onSubmit={handleForgotStep2} className="space-y-3.5">
                  <p className="text-xs text-slate-500">
                    Nhập mã xác thực đã gửi tới <strong>{forgotEmail}</strong> (Mã thử nghiệm: <strong>888999</strong>)
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mã OTP 6 số</label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="888999"
                      maxLength={6}
                      className="w-full text-center text-lg tracking-widest font-bold py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E4576E] hover:bg-[#d84860] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    Xác Nhận & Đổi Mật Khẩu
                  </button>
                </form>
              )}

              <div className="pt-2 text-center text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#E4576E] hover:underline"
                >
                  ← Quay lại Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
