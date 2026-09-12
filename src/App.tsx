import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { RegistrationForm } from './components/RegistrationForm.tsx';
import { MembersTable, isBirthdayThisMonth } from './components/MembersTable.tsx';
import { StatsAndBirthdays } from './components/StatsAndBirthdays.tsx';
import { EditMemberModal } from './components/EditMemberModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { PrintView } from './components/PrintView.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { ChoirMember, MemberFormData, ToastMessage } from './types.ts';
import { getMembers, addMember, updateMember, deleteMember, resetToSeedData, subscribeSupabaseRealtime } from './lib/api.ts';
import { syncService } from './lib/syncService.ts';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [members, setMembers] = useState<ChoirMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'stats'>('form');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ca_doan_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Modal states
  const [editingMember, setEditingMember] = useState<ChoirMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<ChoirMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Sync dark mode class with root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ca_doan_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load initial members from API / storage
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        console.error('Lỗi tải danh sách ca viên:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Toast helper
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Đăng ký lắng nghe sự kiện đồng bộ tự động ngầm (Supabase Realtime + BroadcastChannel)
  useEffect(() => {
    const unsubscribeBroadcast = syncService.subscribe((updatedMembers) => {
      setMembers(updatedMembers);
    });

    const unsubscribeSupabase = subscribeSupabaseRealtime((updatedMembers) => {
      setMembers(updatedMembers);
    });

    return () => {
      unsubscribeBroadcast();
      unsubscribeSupabase();
    };
  }, []);

  // 1. Thêm thành viên mới
  const handleAddMember = async (formData: MemberFormData): Promise<boolean> => {
    try {
      const created = await addMember(formData);
      setMembers(prev => [created, ...prev.filter(m => m.id !== created.id)]);

      const nameDisplay = [created.tenThanh, created.hoVaTen].filter(Boolean).join(' ') || 'Thành viên mới';

      addToast(
        'Đã ghi danh thành công! ✨',
        `Thông tin ca viên "${nameDisplay}" đã được lưu vào hệ thống.`,
        'success'
      );
      return true;
    } catch (err) {
      console.error('Lỗi khi thêm ca viên:', err);
      addToast('Không thể lưu dữ liệu', 'Đã có lỗi xảy ra, vui lòng thử lại.', 'error');
      return false;
    }
  };

  // 2. Chỉnh sửa thành viên
  const handleSaveEdit = async (id: string, data: Partial<ChoirMember>): Promise<boolean> => {
    try {
      const updated = await updateMember(id, data);
      setMembers(prev => prev.map(m => (m.id === id ? updated : m)));
      addToast('Cập nhật thành công', 'Thông tin ca viên đã được cập nhật.', 'info');
      return true;
    } catch (err) {
      console.error('Lỗi cập nhật ca viên:', err);
      addToast('Lỗi cập nhật', 'Không thể lưu thay đổi, vui lòng thử lại.', 'error');
      return false;
    }
  };

  // 3. Xoá thành viên
  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      await deleteMember(deletingMember.id);
      setMembers(prev => prev.filter(m => m.id !== deletingMember.id));
      addToast('Đã xoá thành công', 'Đã gỡ bỏ thành viên khỏi danh sách ca đoàn.', 'info');
      setDeletingMember(null);
    } catch (err) {
      console.error('Lỗi xoá thành viên:', err);
      addToast('Lỗi khi xoá', 'Không thể hoàn tất thao tác xoá.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // 4. Khôi phục dữ liệu mẫu
  const handleResetData = async () => {
    try {
      const seeded = await resetToSeedData();
      setMembers(seeded);
      addToast('Khôi phục thành công', 'Đã tải lại danh sách ca viên mẫu.', 'success');
    } catch (err) {
      console.error('Lỗi khôi phục:', err);
    }
  };

  const birthdaysCount = useMemo(() => {
    return members.filter(m => isBirthdayThisMonth(m.ngaySinh)).length;
  }, [members]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalMembers={members.length}
        birthdaysCount={birthdaysCount}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-10 h-10 border-4 border-sky-400/20 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">Đang đồng bộ danh sách ca đoàn...</p>
          </div>
        ) : (
          <>
            {activeTab === 'form' && (
              <RegistrationForm
                onSubmit={handleAddMember}
                onViewList={() => setActiveTab('list')}
              />
            )}

            {activeTab === 'list' && (
              <MembersTable
                members={members}
                onEdit={m => setEditingMember(m)}
                onDelete={m => setDeletingMember(m)}
                onAddNew={() => setActiveTab('form')}
                onPrint={() => setIsPrintOpen(true)}
              />
            )}

            {activeTab === 'stats' && (
              <StatsAndBirthdays
                members={members}
                onSelectMemberForEdit={m => {
                  setEditingMember(m);
                  setActiveTab('list');
                }}
                onPrint={() => setIsPrintOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Angelic Footer */}
      <footer className="mt-auto py-6 border-t border-sky-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Ca Đoàn Thiên Thần</span>
            <span>•</span>
            <span>Phụng sự Thánh Nhạc</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Giáo Xứ Bắc Hòa — Ca Đoàn Thiên Thần</span>
            <span>•</span>
            <span>Xuất file Excel chuẩn trang trí</span>
          </div>
        </div>
      </footer>

      {/* Edit Modal */}
      <EditMemberModal
        member={editingMember}
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        member={deletingMember}
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Print Modal */}
      <PrintView
        members={members}
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}


