import { ChoirMember, MemberFormData } from '../types.ts';
import { INITIAL_MEMBERS } from '../data/initialMembers.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_thien_than_members_v2';

// Lấy danh sách thành viên dự phòng từ LocalStorage nếu server chưa sẵn sàng
function getLocalFallback(): ChoirMember[] {
  try {
    // Xóa cache cũ nếu còn lưu dữ liệu mẫu
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

function saveLocalFallback(members: ChoirMember[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// API functions
export async function getMembers(): Promise<ChoirMember[]> {
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
    console.warn('Backend API unavailable, using offline cache:', error);
  }
  return getLocalFallback();
}

export async function addMember(data: MemberFormData): Promise<ChoirMember> {
  try {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        // Cập nhật cache local
        const current = getLocalFallback();
        saveLocalFallback([result.data, ...current]);
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Backend POST failed, fallback to local storage:', error);
  }

  // Fallback offline
  const now = new Date().toISOString();
  const fallbackMember: ChoirMember = {
    id: 'ctt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    tenThanh: (data.tenThanh || '').trim(),
    hoVaTen: (data.hoVaTen || '').trim(),
    ngaySinh: (data.ngaySinh || '').trim(),
    lop: (data.lop || '').trim(),
    soDienThoai: (data.soDienThoai || '').trim(),
    createdAt: now,
    updatedAt: now,
  };
  const current = getLocalFallback();
  saveLocalFallback([fallbackMember, ...current]);
  return fallbackMember;
}

export async function updateMember(id: string, data: Partial<MemberFormData>): Promise<ChoirMember> {
  try {
    const res = await fetch(`/api/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        const current = getLocalFallback();
        const updated = current.map(m => m.id === id ? result.data : m);
        saveLocalFallback(updated);
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Backend PUT failed, fallback to local storage:', error);
  }

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
  saveLocalFallback(updated);
  if (!updatedMember) throw new Error('Không tìm thấy thành viên');
  return updatedMember;
}

export async function deleteMember(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalFallback();
      saveLocalFallback(current.filter(m => m.id !== id));
      return;
    }
  } catch (error) {
    console.warn('Backend DELETE failed, fallback to local storage:', error);
  }

  const current = getLocalFallback();
  saveLocalFallback(current.filter(m => m.id !== id));
}

export async function resetToSeedData(): Promise<ChoirMember[]> {
  try {
    const res = await fetch('/api/members/reset', { method: 'POST' });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        saveLocalFallback(result.data);
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Backend RESET failed, resetting local storage:', error);
  }
  saveLocalFallback(INITIAL_MEMBERS);
  return INITIAL_MEMBERS;
}
