import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'ca_doan_supabase_url';
const STORAGE_KEY_KEY = 'ca_doan_supabase_anon_key';

// Đọc cấu hình từ biến môi trường hoặc LocalStorage
export function getSupabaseConfig() {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

  const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  return {
    url: envUrl || storedUrl,
    anonKey: envKey || storedKey,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 10 } },
      });
    } catch (e) {
      console.warn('Không thể khởi tạo Supabase Client:', e);
      return null;
    }
  }
  return supabaseInstance;
}
