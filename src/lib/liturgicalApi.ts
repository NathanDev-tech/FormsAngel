import { getSupabase } from './supabase.ts';
import { LiturgicalSongSchedule, CreateLiturgicalInput } from '../types/liturgical.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_liturgical_songs_cache';

// Helper lấy chuỗi ngày DD/MM/YYYY
const formatDDMMYYYY = (d: Date) => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Tìm ngày Chúa Nhật gần nhất tiếp theo
const getNextSundayDate = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = (7 - day) % 7;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + (diff === 0 ? 0 : diff));
  return formatDDMMYYYY(sunday);
};

const todayDateStr = formatDDMMYYYY(new Date());
const nextSundayDateStr = getNextSundayDate();

// Dữ liệu mẫu khởi tạo chuẩn Lịch Phụng Vụ Công Giáo
export const SEED_LITURGICAL_SONGS: LiturgicalSongSchedule[] = [
  {
    id: 'seed-today-1',
    type: 'weekday',
    title: 'Thánh Lễ Hôm Nay (Lễ Ngày Tuần)',
    event_date: todayDateStr,
    liturgical_color: 'green',
    nhap_le: 'Đến Cùng Chúa — Kim Long',
    dang_le: 'Dâng Ngài — Thành Tâm',
    hiep_le: 'Bánh Hằng Sống — Mi Trầm',
    note: 'Thánh Lễ Ngày Tuần. Ca đoàn khởi động giọng & tập bài trước lễ 15 phút.',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-sunday-1',
    type: 'sunday',
    title: 'Chúa Nhật XXV Thường Niên',
    event_date: nextSundayDateStr,
    liturgical_color: 'green',
    nhap_le: 'Vào Nhà Chúa — Thánh Ân',
    dap_ca_alleluia: 'Đáp Ca: Chúa nâng đỡ hồn tôi (Tv 53) • Alleluia: Hãy tỉnh thức & sẵn sàng',
    dang_le: 'Lễ Vật Cung Tiến — Nguyện Ước',
    hiep_le: 'Chính Lúc Chết Đi — Giang Ân',
    ket_le: 'Tạ Ơn Chúa Với Mẹ — Hùng Tấn',
    note: 'Thánh Lễ Chúa Nhật (5 mục). Đáp Ca hát 2 lượt; Chú ý bè Tenor & Soprano đoạn Tiến Lễ.',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-solemnity-1',
    type: 'solemnity',
    title: 'Lễ Đức Mẹ Hồn Xác Lên Trời (Lễ Trọng)',
    event_date: '15/08/2026',
    liturgical_color: 'white',
    nhap_le: 'Một Điềm Lạ — Hải Ánh',
    dap_ca_alleluia: 'Đáp Ca: Nữ Vương đứng bên hữu Chuột Rút (Tv 44) • Alleluia: Đức Mẹ được cất lên trời',
    dang_le: 'Tiến Hoa Dâng Mẹ — Thái Nguyên',
    hiep_le: 'Linh Hồn Tôi Tuyên Dương Chúa (Magnificat) — Kim Long',
    ket_le: 'Khúc Cảm Tạ Rực Rỡ — Việt Khang',
    note: 'Lễ Trọng áo trắng phụng vụ; Hát 4 bè hợp xướng đoạn Magnificat.',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Lấy danh sách Bài Hát Phụng Vụ
export async function getLiturgicalSongs(): Promise<LiturgicalSongSchedule[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('liturgical_songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: LiturgicalSongSchedule[] = data.map(item => ({
          id: item.id,
          type: item.type || 'sunday',
          title: item.title,
          event_date: item.event_date || '',
          liturgical_color: item.liturgical_color || 'green',
          nhap_le: item.nhap_le || '',
          dap_ca_alleluia: item.dap_ca_alleluia || '',
          dang_le: item.dang_le || '',
          hiep_le: item.hiep_le || '',
          ket_le: item.ket_le || '',
          note: item.note || '',
          is_active: item.is_active ?? true,
          created_at: item.created_at,
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('Không thể kết nối Supabase Cloud cho Bài hát phụng vụ, sử dụng cache/seed fallback:', err);
    }
  }

  // Fallback từ LocalStorage hoặc Seed Data
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // Ignore cache error
  }

  return SEED_LITURGICAL_SONGS;
}

// Thêm bài hát phụng vụ mới
export async function createLiturgicalSong(input: CreateLiturgicalInput): Promise<LiturgicalSongSchedule> {
  const newSong: LiturgicalSongSchedule = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    ...input,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('liturgical_songs')
        .insert([
          {
            type: input.type,
            title: input.title,
            event_date: input.event_date,
            liturgical_color: input.liturgical_color,
            nhap_le: input.nhap_le,
            dap_ca_alleluia: input.dap_ca_alleluia || '',
            dang_le: input.dang_le,
            hiep_le: input.hiep_le,
            ket_le: input.ket_le || '',
            note: input.note || '',
            is_active: input.is_active ?? true,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        newSong.id = data.id;
      }
    } catch (err) {
      console.warn('Lỗi lưu Supabase bài hát phụng vụ, lưu cục bộ:', err);
    }
  }

  const current = await getLiturgicalSongs();
  const updated = [newSong, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return newSong;
}

// Xoá bài hát phụng vụ
export async function deleteLiturgicalSong(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('liturgical_songs').delete().eq('id', id);
    } catch (err) {
      console.warn('Lỗi xoá Supabase bài hát phụng vụ:', err);
    }
  }

  const current = await getLiturgicalSongs();
  const updated = current.filter(s => s.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return true;
}

// Đăng ký Supabase Realtime cho Bài Hát Phụng Vụ
export function subscribeLiturgicalRealtime(onUpdate: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('public:liturgical_songs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'liturgical_songs' }, () => {
        onUpdate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}
