import { createClient, SupabaseClient } from '@supabase/supabase-js';

// The publishable key provided in the prompt
export const SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_vcGevXUxfiJbk4vjc9BuSw_fw6zeCps';

// Default Supabase project URL or custom configured
export const DEFAULT_SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://toidep-lookbook.supabase.co';

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
