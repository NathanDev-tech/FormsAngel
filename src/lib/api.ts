import { ChoirMember, MemberFormData } from '../types.ts';
import { INITIAL_MEMBERS } from '../data/initialMembers.ts';
import { syncService } from './syncService.ts';
import { getSupabase } from './supabase.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_thien_than_members_v2';

export function getLocalFallback(): ChoirMember[] {
  try {
    if (localStorage.getItem('ca_doan_thien_than_members_v1')) {
      localStorage.removeItem('ca_doan_thien_than_members_v1');
    }
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return INITIAL_MEMBERS;
}

export function saveLocalFallback(members: ChoirMember[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Chuyển đổi giữa format Supabase Row và ChoirMember
export function toSupabaseRow(m: ChoirMember) {
  return {
    id: m.id,
    ten_thanh: m.tenThanh || '',
    ho_va_ten: m.hoVaTen || '',
    ngay_sinh: m.ngaySinh || '',
    lop: m.lop || '',
    so_dien_thoai: m.soDienThoai || '',
    bon_phan: m.bonPhan || 'Thành viên',
    trang_thai: m.trangThai || 'Hoạt động',
    ghi_chu: m.ghiChu || '',
    created_at: m.createdAt || new Date().toISOString(),
    updated_at: m.updatedAt || new Date().toISOString(),
  };
}

export function fromSupabaseRow(row: any): ChoirMember {
  return {
    id: row.id,
    tenThanh: row.ten_thanh || '',
    hoVaTen: row.ho_va_ten || '',
    ngaySinh: row.ngay_sinh || '',
    lop: row.lop || '',
    soDienThoai: row.so_dien_thoai || '',
    bonPhan: row.bon_phan || 'Thành viên',
    trangThai: row.trang_thai || 'Hoạt động',
    ghiChu: row.ghi_chu || '',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// Đăng ký Supabase Realtime WebSocket (Kênh dữ liệu trực tiếp)
export function subscribeSupabaseRealtime(onUpdate: (members: ChoirMember[]) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('public:members')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, async () => {
      try {
        const { data } = await supabase.from('members').select('*').order('created_at', { ascending: false });
        if (data) {
          const members = data.map(fromSupabaseRow);
          saveLocalFallback(members);
          onUpdate(members);
        }
      } catch (err) {
        console.warn('Lỗi nhận Supabase realtime event:', err);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// API functions
export async function getMembers(): Promise<ChoirMember[]> {
  // 1. Thử tải từ Supabase trước nếu đã cấu hình
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        const members = data.map(fromSupabaseRow);
        saveLocalFallback(members);
        return members;
      }
    } catch (e) {
      console.warn('Không thể truy vấn Supabase:', e);
    }
  }

  // 2. Kích hoạt auto polling dự phòng
  syncService.startAutoPolling(4000);

  try {
    const res = await fetch('/api/members');
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        saveLocalFallback(result.data);
        return result.data;
      }
    }
  } catch (error) {
    // API local offline
  }

  const remote = await syncService.fetchRemoteData(false);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    saveLocalFallback(remote);
    return remote;
  }

  return getLocalFallback();
}

export async function addMember(data: MemberFormData): Promise<ChoirMember> {
  const now = new Date().toISOString();
  const newMember: ChoirMember = {
    id: 'ctt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    tenThanh: (data.tenThanh || '').trim(),
    hoVaTen: (data.hoVaTen || '').trim(),
    ngaySinh: (data.ngaySinh || '').trim(),
    lop: (data.lop || '').trim(),
    soDienThoai: (data.soDienThoai || '').trim(),
    ghiChu: (data.ghiChu || '').trim(),
    bonPhan: (data.bonPhan || 'Thành viên').trim(),
    trangThai: (data.trangThai || 'Hoạt động').trim(),
    createdAt: now,
    updatedAt: now,
  };

  // Thêm vào Supabase nếu có
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('members').insert([toSupabaseRow(newMember)]);
    } catch (e) {
      console.warn('Lỗi chèn Supabase:', e);
    }
  }

  const current = getLocalFallback();
  const updated = [newMember, ...current];
  saveLocalFallback(updated);

  // Đẩy Real-time sync dự phòng
  syncService.pushRemoteData(updated);

  return newMember;
}

export async function updateMember(id: string, data: Partial<MemberFormData>): Promise<ChoirMember> {
  const current = getLocalFallback();
  let updatedMember: ChoirMember | null = null;

  const updated = current.map(m => {
    if (m.id === id) {
      updatedMember = {
        ...m,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return updatedMember;
    }
    return m;
  });

  if (updatedMember) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('members').update(toSupabaseRow(updatedMember)).eq('id', id);
      } catch (e) {
        console.warn('Lỗi cập nhật Supabase:', e);
      }
    }

    saveLocalFallback(updated);
    syncService.pushRemoteData(updated);
    return updatedMember;
  }
  throw new Error('Không tìm thấy thành viên để cập nhật');
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('members').delete().eq('id', id);
    } catch (e) {
      console.warn('Lỗi xóa Supabase:', e);
    }
  }

  const current = getLocalFallback();
  const updated = current.filter(m => m.id !== id);
  saveLocalFallback(updated);
  syncService.pushRemoteData(updated);
}

export async function resetToSeedData(): Promise<ChoirMember[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('members').delete().neq('id', '0');
      const rows = INITIAL_MEMBERS.map(toSupabaseRow);
      await supabase.from('members').insert(rows);
    } catch (e) {
      console.warn('Lỗi reset Supabase:', e);
    }
  }

  saveLocalFallback(INITIAL_MEMBERS);
  syncService.pushRemoteData(INITIAL_MEMBERS);
  return INITIAL_MEMBERS;
}


