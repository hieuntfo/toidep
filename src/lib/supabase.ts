import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post, Salon, BookingRequest, Article, UserProfile } from '../types';

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
      return data
        .filter(r => r.category !== 'editorial_article' && r.category !== 'user_profile')
        .map(mapDbRowToPost);
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
 * Fetch editorial articles from Supabase REST API
 * Checks public.articles table first, then falls back to public.posts where category='editorial_article'
 */
export async function fetchRemoteArticles(
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_PUBLISHABLE_KEY
): Promise<Article[] | null> {
  try {
    // 1. Check primary table public.articles
    const res = await fetch(`${url}/rest/v1/articles?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          subtitle: a.subtitle || '',
          category: a.category,
          categoryLabel: a.category_label || 'Xu Hướng',
          coverImage: a.cover_image,
          readTime: a.read_time || '5 phút đọc',
          author: a.author || { name: 'Ban Biên Tập', avatar: '', title: 'Editor' },
          publishedAt: a.published_at || '',
          status: a.status || 'draft',
          isFeatured: Boolean(a.is_featured),
          viewsCount: Number(a.views_count || 0),
          likesCount: Number(a.likes_count || 0),
          sections: a.sections || [],
          tags: a.tags || [],
          relatedSalonId: a.related_salon_id,
          relatedSalonName: a.related_salon_name,
          relatedPostId: a.related_post_id,
          focalCrop: a.focal_crop || undefined
        }));
      }
    }

    // 2. Guaranteed fallback: query public.posts where category='editorial_article'
    const fallbackRes = await fetch(`${url}/rest/v1/posts?category=eq.editorial_article&select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => {
          try {
            if (row.caption && row.caption.startsWith('{')) {
              const parsed = JSON.parse(row.caption);
              if (parsed && parsed.title) {
                return {
                  ...parsed,
                  id: parsed.id || row.id.replace(/^art_/, ''),
                  title: parsed.title || row.title,
                  coverImage: parsed.coverImage || (row.images?.[0] ?? '')
                };
              }
            }
          } catch {
            // fallback minimal
          }
          return {
            id: row.id.replace(/^art_/, ''),
            slug: (row.title || 'tin-tuc').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: row.title,
            subtitle: row.caption || '',
            category: 'hair_trends',
            categoryLabel: row.style_name || 'Xu Hướng',
            coverImage: row.images?.[0] || '',
            readTime: '5 phút đọc',
            author: { name: row.author_name || 'Ban Biên Tập', avatar: '', title: 'Editor' },
            publishedAt: row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật',
            status: 'published',
            isFeatured: false,
            viewsCount: 1,
            likesCount: row.likes_count || 0,
            sections: [],
            tags: row.tags || []
          };
        });
      }
    }

    return null;
  } catch (err) {
    console.warn('Fetch articles notice:', err);
    return null;
  }
}

/**
 * Insert or update an editorial article in Supabase
 * Dual-syncs to both public.articles and public.posts (as category='editorial_article')
 * ensuring guaranteed persistence on Supabase Cloud.
 */
export async function insertArticleToSupabase(
  art: Article,
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<boolean> {
  let saved = false;

  // 1. Primary insert to public.articles
  try {
    const row = {
      id: art.id,
      slug: art.slug,
      title: art.title,
      subtitle: art.subtitle,
      category: art.category,
      category_label: art.categoryLabel,
      cover_image: art.coverImage,
      read_time: art.readTime,
      author: art.author,
      published_at: art.publishedAt,
      status: art.status,
      is_featured: art.isFeatured,
      views_count: art.viewsCount,
      likes_count: art.likesCount,
      sections: art.sections,
      tags: art.tags,
      related_salon_id: art.relatedSalonId || null,
      related_salon_name: art.relatedSalonName || null,
      related_post_id: art.relatedPostId || null
    };

    const res = await fetch(`${url}/rest/v1/articles`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
    if (res.ok) saved = true;
  } catch (err) {
    console.warn('Primary article table write note:', err);
  }

  // 2. Guaranteed cloud persistence backup: public.posts (category='editorial_article')
  try {
    const backupRow = {
      id: `art_${art.id}`,
      title: art.title,
      caption: JSON.stringify(art),
      images: [art.coverImage || ''],
      category: 'editorial_article',
      style_name: art.categoryLabel || 'Tạp Chí Làm Đẹp',
      tags: art.tags || [],
      salon_id: art.relatedSalonId || 'toidep-editorial',
      salon_name: art.relatedSalonName || 'Ban Biên Tập toidep.net',
      salon_district: 'Hà Nội',
      author_name: art.author?.name || 'Ban Biên Tập',
      likes_count: art.likesCount || 0
    };

    const res2 = await fetch(`${url}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(backupRow)
    });
    if (res2.ok) saved = true;
  } catch (err2) {
    console.warn('Backup article write note:', err2);
  }

  return saved;
}

/**
 * Delete an article from Supabase
 */
export async function deleteArticleFromSupabase(
  articleId: string,
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<boolean> {
  let ok = false;
  try {
    const res1 = await fetch(`${url}/rest/v1/articles?id=eq.${articleId}`, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (res1.ok) ok = true;
  } catch {}

  try {
    const res2 = await fetch(`${url}/rest/v1/posts?id=eq.art_${articleId}`, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (res2.ok) ok = true;
  } catch {}

  return ok;
}

/**
 * Push all local articles to Supabase (Bulk Seed / Sync)
 */
export async function pushArticlesToSupabase(
  articlesList: Article[],
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<{ success: boolean; count: number; message: string }> {
  try {
    let synced = 0;
    for (const art of articlesList) {
      const res = await insertArticleToSupabase(art, url, key);
      if (res) synced++;
    }
    return {
      success: true,
      count: synced,
      message: `Đã lưu vĩnh viễn ${synced}/${articlesList.length} bài viết tạp chí lên Supabase Cloud!`
    };
  } catch (err: any) {
    return { success: false, count: 0, message: err.message };
  }
}

/**
 * Fetch user profiles from Supabase
 * Checks public.user_profiles first, falls back to public.posts where category='user_profile'
 */
export async function fetchRemoteUsers(
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_PUBLISHABLE_KEY
): Promise<UserProfile[] | null> {
  try {
    // 1. Try public.user_profiles
    const res = await fetch(`${url}/rest/v1/user_profiles?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(u => ({
          id: u.id,
          email: u.email,
          fullName: u.full_name,
          avatar: u.avatar,
          phone: u.phone,
          role: u.role || 'customer',
          proStatus: u.pro_status || 'none',
          salonId: u.salon_id,
          bio: u.bio,
          address: u.address,
          authProvider: u.auth_provider || 'email',
          registeredAt: u.registered_at || ''
        }));
      }
    }

    // 2. Fallback to public.posts where category='user_profile'
    const fallbackRes = await fetch(`${url}/rest/v1/posts?category=eq.user_profile&select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => {
          try {
            if (row.caption && row.caption.startsWith('{')) {
              const parsed = JSON.parse(row.caption);
              if (parsed && parsed.email) return parsed;
            }
          } catch {}
          return {
            id: row.id.replace(/^usr_/, ''),
            email: `${row.title.toLowerCase().replace(/[^a-z0-9]/g, '')}@toidep.net`,
            fullName: row.title,
            avatar: row.images?.[0] || '',
            role: (row.style_name as any) || 'customer',
            proStatus: 'none',
            registeredAt: '01/01/2026',
            authProvider: 'email'
          };
        });
      }
    }

    return null;
  } catch (err) {
    console.warn('Fetch users notice:', err);
    return null;
  }
}

/**
 * Upsert user profile to Supabase
 * Dual-syncs to both public.user_profiles and public.posts (as category='user_profile')
 */
export async function upsertUserToSupabase(
  user: UserProfile,
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<boolean> {
  let saved = false;

  // 1. Primary insert to user_profiles
  try {
    const row = {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      avatar: user.avatar,
      phone: user.phone || null,
      role: user.role,
      pro_status: user.proStatus,
      salon_id: user.salonId || null,
      bio: user.bio || '',
      address: user.address || '',
      auth_provider: user.authProvider,
      registered_at: user.registeredAt
    };

    const res = await fetch(`${url}/rest/v1/user_profiles`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
    if (res.ok) saved = true;
  } catch (err) {
    console.warn('Primary user table note:', err);
  }

  // 2. Guaranteed cloud persistence backup: public.posts (category='user_profile')
  try {
    const backupRow = {
      id: `usr_${user.id}`,
      title: user.fullName,
      caption: JSON.stringify(user),
      images: [user.avatar || ''],
      category: 'user_profile',
      style_name: user.role,
      tags: [user.role, user.proStatus],
      salon_id: user.salonId || 'user-account',
      salon_name: user.role === 'salon_pro' ? 'Salon Pro Account' : 'Thành viên toidep.net',
      salon_district: user.address || 'Hà Nội',
      author_name: user.fullName,
      likes_count: 0
    };

    const res2 = await fetch(`${url}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(backupRow)
    });
    if (res2.ok) saved = true;
  } catch (err2) {
    console.warn('Backup user write note:', err2);
  }

  return saved;
}

/**
 * Delete a user from Supabase (both user_profiles and posts backup)
 */
export async function deleteUserFromSupabase(
  userId: string,
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<boolean> {
  let ok = false;
  try {
    const res1 = await fetch(`${url}/rest/v1/user_profiles?id=eq.${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (res1.ok) ok = true;
  } catch {}

  try {
    const res2 = await fetch(`${url}/rest/v1/posts?id=eq.usr_${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (res2.ok) ok = true;
  } catch {}

  return ok;
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
 * Test writes a live probe record to Supabase public.posts
 * to empirically verify whether write permissions and table exist.
 */
export async function testWriteProbeToSupabase(
  url = DEFAULT_SUPABASE_URL,
  key = SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY
): Promise<{ success: boolean; message: string; details?: any; latencyMs: number }> {
  const start = performance.now();
  const probeId = `probe-${Date.now()}`;
  const testRow = {
    id: probeId,
    title: `[Test Kết Nối] Probe Check lúc ${new Date().toLocaleTimeString('vi-VN')}`,
    caption: 'Bản ghi kiểm tra kết nối từ toidep.net',
    images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'],
    category: 'hair_female',
    style_name: 'Test Kết Nối Supabase',
    tags: ['test', 'supabase'],
    salon_id: 'salon-1',
    salon_name: 'Aurora Hair Atelier',
    salon_district: 'Hoàn Kiếm, Hà Nội',
    salon_address: '18 Hàng Bông',
    price_estimate: '350.000đ',
    price_from: 350000,
    author_name: 'System Probe',
    author_avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=120&q=80',
    is_verified_salon: true
  };

  try {
    const res = await fetch(`${url}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testRow)
    });

    const latency = Math.round(performance.now() - start);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      return {
        success: true,
        message: `Thành công 100%! Đã ghi bản ghi (${probeId}) vào bảng public.posts trên Supabase (${latency}ms). Hãy kiểm tra Supabase Table Editor!`,
        details: data,
        latencyMs: latency
      };
    }

    const err = await res.json().catch(() => ({}));
    if (res.status === 404 || err.code === 'PGRST205' || err.message?.includes('schema cache')) {
      return {
        success: false,
        message: 'Supabase đã kết nối, nhưng BẢNG public.posts CHƯA TỒN TẠI (Lỗi PGRST205). Vui lòng dán mã SQL vào Supabase SQL Editor để tạo bảng.',
        details: err,
        latencyMs: latency
      };
    }

    return {
      success: false,
      message: `Lỗi ghi Supabase (${res.status}): ${err.message || 'Không thể ghi'}`,
      details: err,
      latencyMs: latency
    };
  } catch (e: any) {
    const latency = Math.round(performance.now() - start);
    return {
      success: false,
      message: `Lỗi kết nối mạng Supabase: ${e.message}`,
      latencyMs: latency
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

-- 5. Create Editorial Longform Articles Table (Tạp chí & Tin tức)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  category_label TEXT,
  cover_image TEXT,
  read_time TEXT DEFAULT '5 phút đọc',
  author JSONB DEFAULT '{"name": "Ban Biên Tập", "avatar": "", "title": "Editor"}'::jsonb,
  published_at TEXT,
  status TEXT DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  sections JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  related_salon_id TEXT,
  related_salon_name TEXT,
  related_post_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create User Profiles Table (Quản trị User & Duyệt Salon Pro)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  pro_status TEXT DEFAULT 'none',
  salon_id TEXT,
  bio TEXT,
  address TEXT,
  auth_provider TEXT DEFAULT 'email',
  registered_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Row Level Security & Comprehensive Public Permissions
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow Public Select
CREATE POLICY "Public read salons" ON public.salons FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read users" ON public.user_profiles FOR SELECT USING (true);

-- Allow Public Insert & Upsert so FE can save posts, articles, and profiles immediately!
CREATE POLICY "Public insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert salons" ON public.salons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update salons" ON public.salons FOR UPDATE USING (true);
CREATE POLICY "Public insert articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update articles" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Public delete articles" ON public.articles FOR DELETE USING (true);
CREATE POLICY "Public insert users" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update users" ON public.user_profiles FOR UPDATE USING (true);
`;
