import { ChoirMember, MemberFormData } from '../types.ts';
import { INITIAL_MEMBERS } from '../data/initialMembers.ts';
import { getSupabase } from './supabase.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_thien_than_members_v2';

// Hàm chuẩn hoá bổn phận: Tự động đổi "Thành viên" thành "Ca Viên"
export function sanitizeBonPhan(bonPhan?: string): string {
  if (!bonPhan || !bonPhan.trim() || bonPhan.trim().toLowerCase() === 'thành viên') {
    return 'Ca Viên';
  }
  return bonPhan.trim();
}

// 1. Quản lý LocalStorage dự phòng offline
export function getLocalFallback(): ChoirMember[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(m => ({ ...m, bonPhan: sanitizeBonPhan(m.bonPhan) }));
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return INITIAL_MEMBERS;
}

export function saveLocalFallback(members: ChoirMember[]): void {
  try {
    const sanitized = members.map(m => ({ ...m, bonPhan: sanitizeBonPhan(m.bonPhan) }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
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
    bon_phan: sanitizeBonPhan(m.bonPhan),
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
    bonPhan: sanitizeBonPhan(row.bon_phan),
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

const INIT_KEY = 'ca_doan_members_init_v2';

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
        const members = data.map(fromSupabaseRow);
        saveLocalFallback(members);
        localStorage.setItem(INIT_KEY, 'true');
        return members;
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
    bonPhan: sanitizeBonPhan(data.bonPhan),
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

// Thêm nhiều ca viên từ file CSV vào Supabase & LocalStorage
export async function addMultipleMembers(dataList: MemberFormData[]): Promise<ChoirMember[]> {
  const now = new Date().toISOString();
  const createdMembers: ChoirMember[] = dataList.map((data, index) => ({
    id: 'ctt-' + Date.now().toString(36) + '-' + index + '-' + Math.random().toString(36).substring(2, 6),
    tenThanh: (data.tenThanh || '').trim(),
    hoVaTen: (data.hoVaTen || '').trim(),
    ngaySinh: (data.ngaySinh || '').trim(),
    lop: (data.lop || '').trim(),
    soDienThoai: (data.soDienThoai || '').trim(),
    ghiChu: (data.ghiChu || '').trim(),
    bonPhan: sanitizeBonPhan(data.bonPhan),
    trangThai: (data.trangThai || 'Hoạt động').trim(),
    createdAt: now,
    updatedAt: now,
  }));

  const supabase = getSupabase();
  if (supabase && createdMembers.length > 0) {
    const rows = createdMembers.map(toSupabaseRow);
    const { error } = await supabase.from('members').insert(rows);
    if (error) {
      console.error('❌ Lỗi chèn hàng loạt Supabase:', error.message);
    } else {
      console.log(`✅ Đã lưu ${createdMembers.length} ca viên mới từ CSV lên Supabase!`);
    }
  }

  const current = getLocalFallback();
  const updated = [...createdMembers, ...current];
  saveLocalFallback(updated);
  return createdMembers;
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
  throw new Error('Không tìm thấy ca viên để cập nhật');
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

// Khôi phục dữ liệu rỗng
export async function resetToSeedData(): Promise<ChoirMember[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('members').delete().neq('id', '0');
    } catch (e) {
      console.warn('Lỗi reset Supabase:', e);
    }
  }

  saveLocalFallback([]);
  return [];
}
