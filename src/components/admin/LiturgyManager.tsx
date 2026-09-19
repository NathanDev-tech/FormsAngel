import React, { useState, useEffect } from 'react';
import { Church, Plus, Search, Edit2, Trash2, Calendar, Clock, MapPin, Music } from 'lucide-react';
import { LiturgicalService } from '../../types/portal.ts';
import { getLiturgicalServices, deleteLiturgicalService } from '../../lib/liturgyApi.ts';
import { LiturgyEditor } from './LiturgyEditor.tsx';
import { ConfirmDialogModal } from './ConfirmDialogModal.tsx';

export const LiturgyManager: React.FC = () => {
  const [services, setServices] = useState<LiturgicalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<LiturgicalService | null>(null);

  // Delete modal state
  const [deletingService, setDeletingService] = useState<LiturgicalService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getLiturgicalServices('all');
      setServices(data);
    } catch (err) {
      console.error('Lỗi khi tải lịch phục vụ admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateNew = () => {
    setEditingService(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (service: LiturgicalService) => {
    setEditingService(service);
    setIsEditorOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingService) return;
    setIsDeleting(true);
    try {
      await deleteLiturgicalService(deletingService.id);
      setDeletingService(null);
      fetchServices();
    } catch (err) {
      console.error('Lỗi khi xóa lịch phục vụ:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.occasion && s.occasion.toLowerCase().includes(q)) ||
      s.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Church className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Ban Điều Hành</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Quản Lý Lịch Phục Vụ Thánh Lễ
          </h2>
          <p className="text-xs text-slate-400">
            Tạo lịch Thánh lễ, phân công bộ lễ 6 bài hát và ghi chú phụng vụ ca đoàn.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Thánh Lễ Mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm Thánh lễ..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Đang tải danh sách lịch phục vụ...</div>
      ) : filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
          <Church className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Chưa có lịch phục vụ nào</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Thánh Lễ</th>
                  <th className="px-4 py-4">Ngày cử hành</th>
                  <th className="px-4 py-4">Giờ</th>
                  <th className="px-4 py-4">Số bài hát gán</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredServices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {new Date(item.service_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-amber-500 font-bold">
                      {item.service_time}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20">
                        {item.songs?.length || 0} bài hát
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-400 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingService(item)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
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
      <LiturgyEditor
        service={editingService}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={fetchServices}
      />

      {/* Custom Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={!!deletingService}
        title="Xác Nhận Xóa Lịch Phục Vụ"
        message={`Bạn có chắc chắn muốn xóa lịch phục vụ Thánh Lễ "${deletingService?.title || ''}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Đồng Ý Xóa"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingService(null)}
        isDeleting={isDeleting}
      />

    </div>
  );
};
