import React, { useState, useEffect } from 'react';
import { Bell, Plus, Search, Edit2, Trash2, Pin, AlertTriangle, Eye } from 'lucide-react';
import { Announcement } from '../../types/announcements.ts';
import { getAnnouncements, deleteAnnouncement } from '../../lib/announcementsApi.ts';
import { AnnouncementEditor } from './AnnouncementEditor.tsx';
import { ConfirmDialogModal } from './ConfirmDialogModal.tsx';
import { Link } from 'react-router-dom';

export const AnnouncementManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tất cả');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Delete modal state
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements(categoryFilter, 'all');
      setAnnouncements(data);
    } catch (err) {
      console.error('Lỗi khi tải thông báo admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [categoryFilter]);

  const handleCreateNew = () => {
    setEditingAnnouncement(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setIsEditorOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAnnouncement) return;
    setIsDeleting(true);
    try {
      await deleteAnnouncement(deletingAnnouncement.id);
      setDeletingAnnouncement(null);
      fetchAnnouncements();
    } catch (err) {
      console.error('Lỗi khi xóa thông báo:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = announcements.filter((a) => {
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Bell className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Ban Điều Hành</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Quản Lý Thông Báo Truyền Thông
          </h2>
          <p className="text-xs text-slate-400">
            Soạn thảo, ghim bài viết quan trọng, quản lý bản nháp và đăng bài lên Cổng Thông Tin.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Thông Báo Mới</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {['Tất cả', 'Quan trọng', 'Lịch tập', 'Phụng vụ', 'Sinh hoạt', 'Khác'].map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm thông báo..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Đang tải thông báo...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
          <Bell className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Chưa có thông báo nào</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tiêu đề</th>
                  <th className="px-4 py-4">Danh mục</th>
                  <th className="px-4 py-4">Đặc tính</th>
                  <th className="px-4 py-4">Trạng thái</th>
                  <th className="px-4 py-4">Ngày đăng</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {item.is_pinned && <span title="Ghim đầu">📌</span>}
                        {item.is_important && <span title="Quan trọng">⚠️</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {item.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-400">
                      {new Date(item.published_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/thong-bao/${item.slug}`}
                        target="_blank"
                        className="p-2 inline-block rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
                        title="Xem trang public"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-400"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingAnnouncement(item)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <AnnouncementEditor
        announcement={editingAnnouncement}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={fetchAnnouncements}
      />

      {/* Custom Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={!!deletingAnnouncement}
        title="Xác Nhận Xóa Thông Báo"
        message={`Bạn có chắc chắn muốn xóa bài viết thông báo "${deletingAnnouncement?.title || ''}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Đồng Ý Xóa"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingAnnouncement(null)}
        isDeleting={isDeleting}
      />

    </div>
  );
};
