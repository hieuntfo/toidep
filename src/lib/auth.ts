/**
 * toidep.net - Admin Authentication Module
 * Credentials: user: satthucoi, pass: Deonho@123
 */

export interface AdminUser {
  username: string;
  role: 'super_admin' | 'moderator';
  displayName: string;
  avatar: string;
  lastLogin: string;
}

const ADMIN_STORAGE_KEY = 'toidep_admin_session';

export const OFFICIAL_ADMIN_CREDENTIALS = {
  username: 'satthucoi',
  password: 'Deonho@123',
  displayName: 'Admin satthucoi',
  role: 'super_admin' as const
};

export function checkAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginAdmin(username: string, pass: string): { success: boolean; user?: AdminUser; error?: string } {
  const trimmedUser = username.trim();
  const trimmedPass = pass.trim();

  if (trimmedUser === OFFICIAL_ADMIN_CREDENTIALS.username && trimmedPass === OFFICIAL_ADMIN_CREDENTIALS.password) {
    const user: AdminUser = {
      username: OFFICIAL_ADMIN_CREDENTIALS.username,
      role: OFFICIAL_ADMIN_CREDENTIALS.role,
      displayName: OFFICIAL_ADMIN_CREDENTIALS.displayName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      lastLogin: new Date().toLocaleString('vi-VN')
    };

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  }

  return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' };
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}
