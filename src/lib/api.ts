import { ChoirMember, MemberFormData } from '../types.ts';
import { INITIAL_MEMBERS } from '../data/initialMembers.ts';
import { syncService } from './syncService.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_thien_than_members_v2';

// Lấy danh sách thành viên từ LocalStorage nếu chưa có phản hồi từ server
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

// API functions
export async function getMembers(): Promise<ChoirMember[]> {
  // Kích hoạt auto polling từ xa cho ứng dụng web đa người dùng
  syncService.startAutoPolling(8000);

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
    // API backend local không có sẵn (ví dụ như khi host trên GitHub Pages)
  }

  // Thử tải từ GitHub Cloud trước nếu khả thi
  const remote = await syncService.fetchRemoteData(false);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    saveLocalFallback(remote);
    return remote;
  }

  return getLocalFallback();
}

export async function addMember(data: MemberFormData): Promise<ChoirMember> {
  let newMember: ChoirMember | null = null;

  try {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        newMember = result.data;
      }
    }
  } catch (error) {
    // Fallback offline / GitHub Pages
  }

  if (!newMember) {
    const now = new Date().toISOString();
    newMember = {
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
  }

  const current = getLocalFallback();
  const updated = [newMember, ...current];
  saveLocalFallback(updated);

  // Đẩy thay đổi lên các tab khác và đám mây GitHub
  syncService.pushRemoteData(updated);

  return newMember;
}

export async function updateMember(id: string, data: Partial<MemberFormData>): Promise<ChoirMember> {
  let updatedMember: ChoirMember | null = null;

  try {
    const res = await fetch(`/api/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        updatedMember = result.data;
      }
    }
  } catch (error) {
    // Fallback offline
  }

  const current = getLocalFallback();
  const updated = current.map(m => {
    if (m.id === id) {
      const merged = {
        ...m,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      if (!updatedMember) updatedMember = merged;
      return merged;
    }
    return m;
  });

  saveLocalFallback(updated);

  if (updatedMember) {
    // Đẩy thay đổi Real-time
    syncService.pushRemoteData(updated);
    return updatedMember;
  }
  throw new Error('Không tìm thấy thành viên để cập nhật');
}

export async function deleteMember(id: string): Promise<void> {
  try {
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
  } catch (error) {
    // Fallback offline
  }

  const current = getLocalFallback();
  const updated = current.filter(m => m.id !== id);
  saveLocalFallback(updated);

  // Đẩy thay đổi Real-time
  syncService.pushRemoteData(updated);
}

export async function resetToSeedData(): Promise<ChoirMember[]> {
  try {
    await fetch('/api/members/reset', { method: 'POST' });
  } catch (error) {
    // Fallback
  }
  saveLocalFallback(INITIAL_MEMBERS);
  syncService.pushRemoteData(INITIAL_MEMBERS);
  return INITIAL_MEMBERS;
}

