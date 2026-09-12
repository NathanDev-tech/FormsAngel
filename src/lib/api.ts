import { ChoirMember, MemberFormData } from '../types.ts';
import { INITIAL_MEMBERS } from '../data/initialMembers.ts';
import { getSupabase } from './supabase.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_thien_than_members_v2';

// 1. Quản lý LocalStorage dự phòng offline
export function getLocalFallback(): ChoirMember[] {
  try {
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

// 2. Chuyển đổi định dạng dữ liệu Supabase <-> ChoirMember
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

// 3. Đăng ký nhận sự kiện Supabase Realtime WebSocket + Polling 2 giây/lần
export function subscribeSupabaseRealtime(onUpdate: (members: ChoirMember[]) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const fetchLatest = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const members = data.map(fromSupabaseRow);
        saveLocalFallback(members);
        onUpdate(members);
      }
    } catch (err) {
      console.warn('Lỗi đọc dữ liệu Supabase:', err);
    }
  };

  // Kênh WebSocket Realtime trực tiếp từ Supabase
  const channel = supabase
    .channel('public:members_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
      fetchLatest();
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('⚡ Supabase Realtime WebSocket đã sẵn sàng!');
      }
    });

  // Quét ngầm 2 giây/lần để đảm bảo các thiết bị/trình duyệt luôn nhận dữ liệu mới nhất
  const intervalId = setInterval(fetchLatest, 2000);

  return () => {
    supabase.removeChannel(channel);
    clearInterval(intervalId);
  };
}

// 4. Các thao tác dữ liệu chính (CRUD) thuần Supabase

// Lấy danh sách ca viên từ Supabase
export async function getMembers(): Promise<ChoirMember[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          const members = data.map(fromSupabaseRow);
          saveLocalFallback(members);
          return members;
        } else {
          // Nếu bảng Supabase vừa tạo chưa có dòng nào, nạp dữ liệu mẫu ban đầu
          const seedRows = INITIAL_MEMBERS.map(toSupabaseRow);
          await supabase.from('members').insert(seedRows);
          saveLocalFallback(INITIAL_MEMBERS);
          return INITIAL_MEMBERS;
        }
      } else if (error) {
        console.warn('⚠️ Lỗi Supabase Query:', error.message);
      }
    } catch (e) {
      console.warn('Không thể truy vấn Supabase:', e);
    }
  }
  return getLocalFallback();
}

// Thêm ca viên mới vào Supabase
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

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('members').insert([toSupabaseRow(newMember)]);
    if (error) {
      console.error('❌ Lỗi chèn dữ liệu Supabase (RLS):', error.message);
    } else {
      console.log('✅ Đã lưu ca viên mới lên Supabase!');
    }
  }

  const current = getLocalFallback();
  const updated = [newMember, ...current];
  saveLocalFallback(updated);
  return newMember;
}

// Chỉnh sửa thông tin ca viên trên Supabase
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
      const { error } = await supabase
        .from('members')
        .update(toSupabaseRow(updatedMember))
        .eq('id', id);

      if (error) console.error('❌ Lỗi cập nhật Supabase:', error.message);
    }

    saveLocalFallback(updated);
    return updatedMember;
  }
  throw new Error('Không tìm thấy thành viên để cập nhật');
}

// Xóa ca viên khỏi Supabase
export async function deleteMember(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) console.error('❌ Lỗi xóa Supabase:', error.message);
  }

  const current = getLocalFallback();
  const updated = current.filter(m => m.id !== id);
  saveLocalFallback(updated);
}

// Khôi phục dữ liệu mẫu trên Supabase
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
  return INITIAL_MEMBERS;
}
