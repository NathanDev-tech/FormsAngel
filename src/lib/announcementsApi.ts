import { getSupabase, withTimeout } from './supabase.ts';
import { Announcement, CreateAnnouncementInput, UpdateAnnouncementInput } from '../types/announcements.ts';
import { slugify } from '../utils/slugify.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_portal_announcements_v3';
const INITIALIZED_KEY = 'ca_doan_portal_announcements_init_v3';

const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

// Read from LocalStorage fallback
function getLocalAnnouncements(): Announcement[] {
  try {
    const isInit = localStorage.getItem(INITIALIZED_KEY);
    if (!isInit) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      localStorage.setItem(INITIALIZED_KEY, 'true');
      return INITIAL_ANNOUNCEMENTS;
    }
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const list = JSON.parse(saved);
      if (Array.isArray(list)) {
        return list.map(a => ({
          ...a,
          created_by: (!a.created_by || a.created_by === 'Ban Quản Trị') ? 'Ban Điều Hành Ca Đoàn Thiên Thần' : a.created_by,
        }));
      }
    }
  } catch (e) {
    console.warn('LocalStorage error reading announcements:', e);
  }
  return INITIAL_ANNOUNCEMENTS;
}

function saveLocalAnnouncements(list: Announcement[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(INITIALIZED_KEY, 'true');
  } catch (e) {
    console.warn('LocalStorage error saving announcements:', e);
  }
}

export async function getAnnouncements(category?: string, status: string = 'published'): Promise<Announcement[]> {
  const localList = getLocalAnnouncements();

  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('portal_announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (category && category !== 'Tất cả') {
        query = query.eq('category', category);
      }

      const { data, error } = await withTimeout(query, 1800);
      if (!error && Array.isArray(data)) {
        const formatted = data.map(a => ({
          ...a,
          created_by: (!a.created_by || a.created_by === 'Ban Quản Trị') ? 'Ban Điều Hành Ca Đoàn Thiên Thần' : a.created_by,
        })) as Announcement[];

        // HỢP NHẤT DỮ LIỆU: Giữ cả tin local chưa sync lẫn tin từ Supabase (không bao giờ xóa mất tin mới tạo)
        const map = new Map<string, Announcement>();
        localList.forEach(item => map.set(item.id, item));
        formatted.forEach(item => map.set(item.id, item));

        const mergedList = Array.from(map.values());
        saveLocalAnnouncements(mergedList);

        let filtered = mergedList;
        if (status !== 'all') filtered = filtered.filter(a => a.status === status);
        if (category && category !== 'Tất cả') filtered = filtered.filter(a => a.category === category);

        return filtered.sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });
      }
    } catch (e) {
      console.warn('Supabase announcements query fallback to local store:', e);
    }
  }

  // Fallback filtering on persistent local store
  let list = localList;
  if (status !== 'all') {
    list = list.filter(a => a.status === status);
  }
  if (category && category !== 'Tất cả') {
    list = list.filter(a => a.category === category);
  }
  return list.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  const local = getLocalAnnouncements();
  const localItem = local.find(a => a.slug === slug);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('portal_announcements')
          .select('*')
          .eq('slug', slug)
          .single(),
        1800
      );
      if (!error && data) {
        return {
          ...data,
          created_by: (!data.created_by || data.created_by === 'Ban Quản Trị') ? 'Ban Điều Hành Ca Đoàn Thiên Thần' : data.created_by,
        } as Announcement;
      }
    } catch (e) {
      console.warn('Unable to get announcement by slug from Supabase:', e);
    }
  }

  return localItem || null;
}

// Lưu siêu tốc Instant Optimistic Strategy (< 10ms)
export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  const generatedSlug = input.slug || slugify(input.title) + '-' + Date.now().toString(36);
  const now = new Date().toISOString();

  const newAnn: Announcement = {
    id: 'ann-' + Date.now().toString(36),
    title: input.title,
    slug: generatedSlug,
    excerpt: input.excerpt || input.content.slice(0, 150) + '...',
    content: input.content,
    category: input.category || 'Quan trọng',
    cover_image_url: input.cover_image_url,
    is_important: !!input.is_important,
    is_pinned: !!input.is_pinned,
    status: input.status || 'published',
    published_at: input.published_at || now,
    created_by: input.created_by || 'Ban Điều Hành Ca Đoàn Thiên Thần',
    created_at: now,
    updated_at: now,
  };

  // 1. Lưu lập tức vào LocalStorage (0ms delay - UI cập nhật ngay)
  const current = getLocalAnnouncements();
  saveLocalAnnouncements([newAnn, ...current]);

  // 2. Đồng bộ ngầm lên Supabase (không chặn UI)
  const supabase = getSupabase();
  if (supabase) {
    supabase
      .from('portal_announcements')
      .insert([{
        title: newAnn.title,
        slug: newAnn.slug,
        excerpt: newAnn.excerpt,
        content: newAnn.content,
        category: newAnn.category,
        cover_image_url: newAnn.cover_image_url,
        is_important: newAnn.is_important,
        is_pinned: newAnn.is_pinned,
        status: newAnn.status,
        published_at: newAnn.published_at,
        created_by: newAnn.created_by,
      }])
      .select()
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const fresh = getLocalAnnouncements().map(a => (a.id === newAnn.id || a.slug === newAnn.slug) ? (data as Announcement) : a);
          saveLocalAnnouncements(fresh);
        } else if (error) {
          console.warn('Background Supabase insert note:', error.message);
        }
      })
      .catch(err => console.warn('Background Supabase insert error:', err));
  }

  // Trả về tức thì
  return newAnn;
}

export async function updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
  const now = new Date().toISOString();
  const current = getLocalAnnouncements();
  const idx = current.findIndex(a => a.id === id);

  const updated = idx !== -1 ? { ...current[idx], ...input, updated_at: now } : {
    id,
    title: input.title || '',
    slug: input.slug || slugify(input.title || ''),
    content: input.content || '',
    category: input.category || 'Quan trọng',
    published_at: now,
    created_by: 'Ban Điều Hành Ca Đoàn Thiên Thần',
    created_at: now,
    updated_at: now,
    ...input,
  } as Announcement;

  if (input.title && !input.slug) {
    updated.slug = slugify(input.title);
  }

  // 1. Lưu local tức thì
  if (idx !== -1) {
    current[idx] = updated;
    saveLocalAnnouncements(current);
  } else {
    saveLocalAnnouncements([updated, ...current]);
  }

  // 2. Cập nhật ngầm lên Supabase
  const supabase = getSupabase();
  if (supabase) {
    const payload: Record<string, any> = { ...input, updated_at: now };
    if (input.title && !input.slug) {
      payload.slug = slugify(input.title);
    }
    supabase
      .from('portal_announcements')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const fresh = getLocalAnnouncements().map(a => a.id === id ? (data as Announcement) : a);
          saveLocalAnnouncements(fresh);
        }
      })
      .catch((e) => console.warn('Background Supabase update error:', e));
  }

  return updated;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  // 1. Xóa local tức thì
  const current = getLocalAnnouncements();
  const updated = current.filter(a => a.id !== id);
  saveLocalAnnouncements(updated);

  // 2. Xóa ngầm trên Supabase
  const supabase = getSupabase();
  if (supabase) {
    supabase
      .from('portal_announcements')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Background Supabase delete note:', error.message);
      })
      .catch((e) => console.warn('Background Supabase delete error:', e));
  }

  return true;
}

export function subscribeAnnouncementsRealtime(onChange: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => { };

  const channel = supabase
    .channel('public:portal_announcements')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'portal_announcements' }, () => {
      onChange();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
