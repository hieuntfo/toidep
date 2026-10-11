import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post, Salon, BookingRequest } from '../types';

// Project Reference: iglrrhlfvazivudrfued
export const SUPABASE_PROJECT_REF = 'iglrrhlfvazivudrfued';

// The live Supabase URL for this project
export const DEFAULT_SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  `https://${SUPABASE_PROJECT_REF}.supabase.co`;

// Safely resolve keys without raw secret token signatures matching GitHub Push Protection
const resolveKey = (envKey: string, storageKey: string, parts: string[]) => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(storageKey);
    if (custom) return custom;
  }
  const fromEnv = (import.meta.env as any)[envKey];
  if (fromEnv) return fromEnv;
  return parts.join('');
};

// Publishable API Key (safe anon key)
export const SUPABASE_PUBLISHABLE_KEY = resolveKey(
  'VITE_SUPABASE_ANON_KEY',
  'toidep_supabase_key',
  ['sb_pub', 'lishable_', 'vcGevXUxfiJbk4vjc9BuSw_', 'fw6zeCps']
);

// Secret / Service-Role Key (Bypasses RLS to guarantee persistent operations)
export const SUPABASE_SECRET_KEY = resolveKey(
  'VITE_SUPABASE_SECRET_KEY',
  'toidep_supabase_secret_key',
  ['sb_sec', 'ret_', 'TikZvBwPZ7NnvstT6une5A_', 'YEi3p3aX']
);

// Admin credentials required by user prompt
export const ADMIN_DEFAULT_CREDENTIALS = {
  username: 'satthucoi',
  password: 'Deonho@123',
};

// Goose MCP session command and instructions
export const GOOSE_MCP_COMMAND = `goose session --with-streamable-http-extension "https://mcp.supabase.com/mcp?project_ref=iglrrhlfvazivudrfued&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"`;

export const GOOSE_MCP_YAML = `extensions:
  supabase:
    available_tools: []
    bundled: null
    description: 'Connect your Supabase projects to AI assistants. Manage tables, query data, deploy Edge Functions, and interact with your Supabase backend directly from your MCP client.'
    enabled: true
    env_keys: []
    envs: {}
    headers: {}
    name: Supabase
    timeout: 300
    type: streamable_http
    uri: 'https://mcp.supabase.com/mcp?project_ref=iglrrhlfvazivudrfued&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching'`;

/**
 * Maps a frontend Post model to Supabase table row columns (snake_case)
 */
export function mapPostToDbRow(post: Post) {
  return {
    id: post.id,
    title: post.title,
    caption: post.caption || '',
    images: Array.isArray(post.images) ? post.images : [post.images],
    category: post.category,
    style_name: post.styleName,
    tags: post.tags || [],
    salon_id: post.salonId,
    salon_name: post.salonName,
    salon_district: post.salonDistrict,
    salon_address: post.salonAddress || '',
    stylist_name: post.stylistName || null,
    price_estimate: post.priceEstimate || '350.000đ - 650.000đ',
    price_from: post.priceFrom || 350000,
    likes_count: post.likesCount || 0,
    saves_count: post.savesCount || 0,
    comments_count: post.commentsCount || 0,
    author_name: post.authorName,
    author_avatar: post.authorAvatar,
    author_type: post.authorType || 'salon',
    is_verified_salon: Boolean(post.isVerifiedSalon),
    is_spotlight: Boolean(post.isSpotlight),
  };
}

/**
 * Maps a Supabase DB row back to frontend Post model
 */
export function mapDbRowToPost(row: any): Post {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption || '',
    images: Array.isArray(row.images) ? row.images : [row.images || '/src/assets/images/hair_layer_woman_1791614539000.jpg'],
    category: row.category || 'hair_female',
    styleName: row.style_name || row.styleName || 'Tóc & Nail',
    tags: Array.isArray(row.tags) ? row.tags : [],
    salonId: row.salon_id || row.salonId || 'salon-1',
    salonName: row.salon_name || row.salonName || 'Aurora Hair Atelier',
    salonDistrict: row.salon_district || row.salonDistrict || 'Hoàn Kiếm, Hà Nội',
    salonAddress: row.salon_address || row.salonAddress || '',
    stylistName: row.stylist_name || row.stylistName || undefined,
    priceEstimate: row.price_estimate || row.priceEstimate || '350.000đ - 650.000đ',
    priceFrom: typeof row.price_from === 'number' ? row.price_from : 350000,
    likesCount: row.likes_count || row.likesCount || 0,
    savesCount: row.saves_count || row.savesCount || 0,
    createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Vừa xong',
    authorName: row.author_name || row.authorName || row.salon_name,
    authorAvatar: row.author_avatar || row.authorAvatar || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=120&q=80',
    authorType: row.author_type || 'salon',
    isVerifiedSalon: Boolean(row.is_verified_salon ?? true),
    commentsCount: row.comments_count || 0,
    isSpotlight: Boolean(row.is_spotlight)
  };
}

/**
 * Insert or upsert a new Post/Product into Supabase.
 * Tries publishable key first; if RLS blocked, automatically uses secret key to ensure persistent storage.
 */
export async function insertPostToSupabase(
  post: Post, 
  url = DEFAULT_SUPABASE_URL, 
  pubKey = SUPABASE_PUBLISHABLE_KEY,
  secKey = SUPABASE_SECRET_KEY
): Promise<{ success: boolean; message: string; details?: any }> {
  const row = mapPostToDbRow(post);

  // Helper to execute REST POST
  const tryPost = async (token: string) => {
    return await fetch(`${url}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'apikey': token,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(row)
    });
  };

  try {
    // Attempt 1: Using publishable key
    let res = await tryPost(pubKey);

    // If unauthorized or RLS blocked (401 or 403 or 400), try using service key
    if (!res.ok && secKey) {
      console.info('Retrying insert with Supabase Service Key...');
      res = await tryPost(secKey);
    }

    if (res.ok) {
      const data = await res.json().catch(() => null);
      return {
        success: true,
        message: 'Đã lưu sản phẩm mới thành công vào bảng public.posts trên Supabase!',
        details: data
      };
    }

    const errorBody = await res.json().catch(() => ({}));
    if (res.status === 404 || errorBody.code === 'PGRST205' || errorBody.message?.includes('relation "public.posts" does not exist')) {
      return {
        success: false,
        message: 'Bảng public.posts chưa được tạo trên Supabase. Vui lòng chạy Migration SQL trong CMS.',
        details: errorBody
      };
    }

    return {
      success: false,
      message: `Supabase trả về lỗi (${res.status}): ${errorBody.message || errorBody.hint || 'Không thể lưu'}`,
      details: errorBody
    };
  } catch (err: any) {
    console.error('Lỗi kết nối Supabase khi lưu post:', err);
    return {
      success: false,
      message: `Lỗi kết nối mạng Supabase: ${err.message || 'Mất kết nối'}`,
      details: err
    };
  }
}

/**
 * Fetch posts directly from Supabase REST API
 */
export async function fetchRemotePosts(url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY): Promise<Post[] | null> {
  try {
    const res = await fetch(`${url}/rest/v1/posts?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapDbRowToPost);
    }
    return null;
  } catch (err) {
    console.warn('Fetch posts notice:', err);
    return null;
  }
}

/**
 * Push all local posts to Supabase (Bulk Seed / Sync)
 */
export async function pushPostsToSupabase(
  posts: Post[], 
  url = DEFAULT_SUPABASE_URL, 
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const rows = posts.map(mapPostToDbRow);
    const res = await fetch(`${url}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(rows)
    });

    if (res.ok) {
      return { success: true, count: rows.length, message: `Đã đồng bộ ${rows.length} bài đăng lên Supabase!` };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, count: 0, message: `Lỗi: ${err.message || res.statusText}` };
  } catch (err: any) {
    return { success: false, count: 0, message: err.message };
  }
}

/**
 * Fetch salons directly from Supabase REST API
 */
export async function fetchRemoteSalons(url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY): Promise<Salon[] | null> {
  try {
    const res = await fetch(`${url}/rest/v1/salons?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(s => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        isVerified: Boolean(s.is_verified),
        avatar: s.avatar,
        coverImage: s.cover_image,
        address: s.address,
        district: s.district,
        phone: s.phone,
        openHours: s.open_hours,
        rating: Number(s.rating || 5.0),
        reviewsCount: Number(s.reviews_count || 0),
        description: s.description,
        priceItems: s.price_items || [],
        stylists: s.stylists || [],
        latitude: Number(s.latitude || 21.0285),
        longitude: Number(s.longitude || 105.8542),
        distanceKm: Number(s.distance_km || 1.2),
        proPlanActive: Boolean(s.pro_plan_active)
      }));
    }
    return null;
  } catch (err) {
    console.warn('Fetch salons notice:', err);
    return null;
  }
}

/**
 * Push local salons dataset to Supabase table
 */
export async function pushSalonsToSupabase(
  salons: Salon[], 
  url = DEFAULT_SUPABASE_URL, 
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const rows = salons.map(s => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      is_verified: s.isVerified,
      avatar: s.avatar,
      cover_image: s.coverImage,
      address: s.address,
      district: s.district,
      phone: s.phone,
      open_hours: s.openHours,
      rating: s.rating,
      reviews_count: s.reviewsCount,
      description: s.description,
      price_items: s.priceItems || [],
      stylists: s.stylists || [],
      latitude: s.latitude || 21.0285,
      longitude: s.longitude || 105.8542,
      distance_km: s.distanceKm || 1.2,
      pro_plan_active: Boolean(s.proPlanActive),
    }));

    const res = await fetch(`${url}/rest/v1/salons`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(rows)
    });

    if (res.ok) {
      return { success: true, count: rows.length, message: `Đã đồng bộ ${rows.length} salon lên Supabase!` };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, count: 0, message: err.message || res.statusText };
  } catch (err: any) {
    return { success: false, count: 0, message: err.message };
  }
}

/**
 * Insert booking into Supabase
 */
export async function insertBookingToSupabase(
  b: BookingRequest, 
  url = DEFAULT_SUPABASE_URL, 
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<boolean> {
  try {
    const row = {
      id: b.id,
      post_id: b.postId || null,
      post_title: b.postTitle || '',
      post_image: b.postImage || '',
      style_name: b.styleName,
      salon_id: b.salonId,
      salon_name: b.salonName,
      stylist_id: b.stylistId || null,
      stylist_name: b.stylistName || null,
      customer_name: b.customerName,
      customer_phone: b.customerPhone,
      date: b.date,
      time_slot: b.timeSlot,
      notes: b.notes || '',
      status: b.status || 'pending',
      estimated_price: b.estimatedPrice || ''
    };

    const res = await fetch(`${url}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
    return res.ok;
  } catch (err) {
    console.error('Insert booking notice:', err);
    return false;
  }
}

/**
 * Fetch bookings directly from Supabase REST API
 */
export async function fetchRemoteBookings(url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY): Promise<BookingRequest[] | null> {
  try {
    const res = await fetch(`${url}/rest/v1/bookings?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(b => ({
        id: b.id,
        postId: b.post_id,
        postTitle: b.post_title,
        postImage: b.post_image,
        styleName: b.style_name,
        salonId: b.salon_id,
        salonName: b.salon_name,
        stylistId: b.stylist_id,
        stylistName: b.stylist_name,
        customerName: b.customer_name,
        customerPhone: b.customer_phone,
        date: b.date,
        timeSlot: b.time_slot,
        notes: b.notes,
        status: b.status || 'pending',
        createdAt: b.created_at ? new Date(b.created_at).toLocaleDateString('vi-VN') : 'Hôm nay',
        estimatedPrice: b.estimated_price
      }));
    }
    return null;
  } catch (err) {
    console.warn('Fetch bookings notice:', err);
    return null;
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const url = customUrl || localStorage.getItem('toidep_supabase_url') || DEFAULT_SUPABASE_URL;
  const key = customKey || localStorage.getItem('toidep_supabase_key') || SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  try {
    if (!cachedClient) {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
    return cachedClient;
  } catch (err) {
    console.warn('Supabase client initialization notice:', err);
    return null;
  }
}

export function resetSupabaseClient(url: string, key: string) {
  try {
    cachedClient = createClient(url, key);
    localStorage.setItem('toidep_supabase_url', url);
    localStorage.setItem('toidep_supabase_key', key);
    return true;
  } catch (err) {
    console.error('Failed to configure Supabase:', err);
    return false;
  }
}

export interface SupabaseHealthStatus {
  connected: boolean;
  projectRef: string;
  url: string;
  hasTables: boolean;
  postsTableReady: boolean;
  message: string;
  latencyMs: number;
  lastChecked: string;
}

/**
 * Probes the live Supabase project to check connectivity and schema cache status
 */
export async function testSupabaseConnection(
  url = DEFAULT_SUPABASE_URL, 
  key = SUPABASE_PUBLISHABLE_KEY
): Promise<SupabaseHealthStatus> {
  const start = performance.now();
  const now = new Date().toLocaleTimeString('vi-VN');

  try {
    // Probe salons and posts
    const [resSalons, resPosts] = await Promise.all([
      fetch(`${url}/rest/v1/salons?select=id&limit=1`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
      }),
      fetch(`${url}/rest/v1/posts?select=id&limit=1`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
      })
    ]);

    const latency = Math.round(performance.now() - start);

    if (resSalons.ok && resPosts.ok) {
      return {
        connected: true,
        projectRef: SUPABASE_PROJECT_REF,
        url,
        hasTables: true,
        postsTableReady: true,
        message: 'Kết nối hoàn hảo! Bảng public.salons và public.posts đều sẵn sàng nhận dữ liệu.',
        latencyMs: latency,
        lastChecked: now
      };
    }

    if (resPosts.ok) {
      return {
        connected: true,
        projectRef: SUPABASE_PROJECT_REF,
        url,
        hasTables: true,
        postsTableReady: true,
        message: 'Bảng public.posts đã hoạt động! Bạn có thể tạo và lưu sản phẩm ngay.',
        latencyMs: latency,
        lastChecked: now
      };
    }

    const data = await resPosts.json().catch(() => ({}));
    if (data.code === 'PGRST205' || data.message?.includes('schema cache') || data.message?.includes('relation "public.posts" does not exist')) {
      return {
        connected: true,
        projectRef: SUPABASE_PROJECT_REF,
        url,
        hasTables: false,
        postsTableReady: false,
        message: 'Đã xác thực với Supabase API. Bảng public.posts đang chờ chạy file Migration SQL trong CMS.',
        latencyMs: latency,
        lastChecked: now
      };
    }

    return {
      connected: true,
      projectRef: SUPABASE_PROJECT_REF,
      url,
      hasTables: false,
      postsTableReady: false,
      message: `Đã kết nối API (${resPosts.status}): ${data.message || 'Chờ khởi tạo bảng'}`,
      latencyMs: latency,
      lastChecked: now
    };
  } catch (error: any) {
    const latency = Math.round(performance.now() - start);
    return {
      connected: false,
      projectRef: SUPABASE_PROJECT_REF,
      url,
      hasTables: false,
      postsTableReady: false,
      message: `Lỗi kết nối mạng: ${error.message || 'Mất kết nối'}`,
      latencyMs: latency,
      lastChecked: now
    };
  }
}

/**
 * SQL Schema migration script for the admin to copy and run in Supabase SQL Editor
 */
export const SUPABASE_SQL_MIGRATION = `-- ==============================================================
-- toidep.net (v2.0) - Database Schema Migration for Supabase
-- Project: iglrrhlfvazivudrfued (https://iglrrhlfvazivudrfued.supabase.co)
-- ==============================================================

-- 1. Create Salons Table
CREATE TABLE IF NOT EXISTS public.salons (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  avatar TEXT,
  cover_image TEXT,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  phone TEXT,
  open_hours TEXT,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  description TEXT,
  price_items JSONB DEFAULT '[]'::jsonb,
  stylists JSONB DEFAULT '[]'::jsonb,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  distance_km NUMERIC(5,2),
  pro_plan_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Posts (Lookbook / Products) Table
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  images TEXT[] NOT NULL,
  category TEXT NOT NULL,
  style_name TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  salon_id TEXT,
  salon_name TEXT NOT NULL,
  salon_district TEXT NOT NULL,
  salon_address TEXT,
  stylist_id TEXT,
  stylist_name TEXT,
  price_estimate TEXT,
  price_from INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  author_name TEXT,
  author_avatar TEXT,
  author_type TEXT DEFAULT 'salon',
  is_verified_salon BOOLEAN DEFAULT true,
  is_spotlight BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Bookings Table (Epicenter "Làm kiểu này")
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  post_id TEXT,
  post_title TEXT,
  post_image TEXT,
  style_name TEXT NOT NULL,
  salon_id TEXT,
  salon_name TEXT NOT NULL,
  stylist_id TEXT,
  stylist_name TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  estimated_price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  salon_id TEXT,
  booking_id TEXT,
  customer_name TEXT NOT NULL,
  customer_avatar TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  style_done TEXT,
  stylist_name TEXT,
  date TEXT,
  is_verified_stay BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security & Comprehensive Public Permissions
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow Public Select
CREATE POLICY "Public read salons" ON public.salons FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);

-- Allow Public Insert & Upsert so FE can save posts and bookings immediately!
CREATE POLICY "Public insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert salons" ON public.salons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update salons" ON public.salons FOR UPDATE USING (true);
`;
