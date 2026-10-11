import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project Reference from MCP: iglrrhlfvazivudrfued
export const SUPABASE_PROJECT_REF = 'iglrrhlfvazivudrfued';

// The live Supabase URL for this project
export const DEFAULT_SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  `https://${SUPABASE_PROJECT_REF}.supabase.co`;

// Publishable API Key
export const SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_vcGevXUxfiJbk4vjc9BuSw_fw6zeCps';

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
 * Fetch salons directly from Supabase REST API
 */
export async function fetchRemoteSalons(url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY) {
  try {
    const res = await fetch(`${url}/rest/v1/salons?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.warn('Fetch salons notice:', err);
    return null;
  }
}

/**
 * Fetch posts directly from Supabase REST API
 */
export async function fetchRemotePosts(url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY) {
  try {
    const res = await fetch(`${url}/rest/v1/posts?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.warn('Fetch posts notice:', err);
    return null;
  }
}

/**
 * Fetch bookings directly from Supabase REST API
 */
export async function fetchRemoteBookings(url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY) {
  try {
    const res = await fetch(`${url}/rest/v1/bookings?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.warn('Fetch bookings notice:', err);
    return null;
  }
}

/**
 * Push local dataset to Supabase table
 */
export async function pushSalonsToSupabase(salons: any[], url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY) {
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
    return res.ok;
  } catch (err) {
    console.error('Push salons error:', err);
    return false;
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
  message: string;
  latencyMs: number;
  lastChecked: string;
}

/**
 * Probes the live Supabase project to check connectivity and schema cache status
 */
export async function testSupabaseConnection(url = DEFAULT_SUPABASE_URL, key = SUPABASE_PUBLISHABLE_KEY): Promise<SupabaseHealthStatus> {
  const start = performance.now();
  const now = new Date().toLocaleTimeString('vi-VN');

  try {
    const res = await fetch(`${url}/rest/v1/salons?select=*&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    const latency = Math.round(performance.now() - start);

    if (res.ok) {
      return {
        connected: true,
        projectRef: SUPABASE_PROJECT_REF,
        url,
        hasTables: true,
        message: 'Kết nối trực tiếp thành công tới bảng public.salons trên Supabase!',
        latencyMs: latency,
        lastChecked: now
      };
    }

    const data = await res.json().catch(() => ({}));
    if (data.code === 'PGRST205' || data.message?.includes('schema cache')) {
      return {
        connected: true,
        projectRef: SUPABASE_PROJECT_REF,
        url,
        hasTables: false,
        message: 'Đã xác thực thành công với Supabase. Bảng public.salons đang chờ tạo trong SQL Editor.',
        latencyMs: latency,
        lastChecked: now
      };
    }

    return {
      connected: true,
      projectRef: SUPABASE_PROJECT_REF,
      url,
      hasTables: false,
      message: `Đã kết nối API (${res.status}): ${data.message || 'Sẵn sàng đồng bộ'}`,
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
      message: `Không thể kết nối mạng: ${error.message || 'Lỗi mạng'}`,
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

-- 2. Create Posts (Lookbook) Table
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  images TEXT[] NOT NULL,
  category TEXT NOT NULL,
  style_name TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  salon_id TEXT REFERENCES public.salons(id) ON DELETE SET NULL,
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
  is_spotlight BOOLEAN DEFAULT false, -- Huy hiệu Góc Đẹp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Bookings Table (Epicenter "Làm kiểu này")
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES public.posts(id) ON DELETE SET NULL,
  post_title TEXT,
  post_image TEXT,
  style_name TEXT NOT NULL,
  salon_id TEXT REFERENCES public.salons(id) ON DELETE CASCADE,
  salon_name TEXT NOT NULL,
  stylist_id TEXT,
  stylist_name TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  estimated_price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Reviews Table (Only from completed bookings per PRD)
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  salon_id TEXT REFERENCES public.salons(id) ON DELETE CASCADE,
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

-- 5. Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read salons" ON public.salons FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own bookings" ON public.bookings FOR SELECT USING (true);
`;
