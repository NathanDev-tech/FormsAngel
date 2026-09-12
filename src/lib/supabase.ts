import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'ca_doan_supabase_url';
const STORAGE_KEY_KEY = 'ca_doan_supabase_anon_key';

// Cấu hình Supabase mặc định của dự án (Giúp ứng dụng luôn kết nối tự động trên GitHub Pages)
const DEFAULT_SUPABASE_URL = 'https://efuulrauqwrsoswvdadj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmdXVscmF1cXdyc29zd3ZkYWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNzMyMjcsImV4cCI6MjEwNDc0OTIyN30.Yi8_qRkbUSufGZISlK9chxfbIetfE18ekxQ15qoVWtk';

export function getSupabaseConfig() {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

  const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  return {
    url: envUrl || storedUrl || DEFAULT_SUPABASE_URL,
    anonKey: envKey || storedKey || DEFAULT_SUPABASE_ANON_KEY,
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
