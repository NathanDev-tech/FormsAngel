import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit2, Trash2, Clock, MapPin, Eye, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { RehearsalSchedule } from '../../types/schedules.ts';
import { getSchedules, deleteSchedule, subscribeSchedulesRealtime, updateSchedule } from '../../lib/schedulesApi.ts';
import { ScheduleEditor } from './ScheduleEditor.tsx';
import { ScheduleCalendar } from '../portal/schedules/ScheduleCalendar.tsx';
import { ConfirmDialogModal } from './ConfirmDialogModal.tsx';

export const ScheduleManager: React.FC = () => {
  const [schedules, setSchedules] = useState<RehearsalSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<RehearsalSchedule | null>(null);

  // Delete modal state
  const [deletingSchedule, setDeletingSchedule] = useState<RehearsalSchedule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSchedules(statusFilter);
      setSchedules(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách lịch tập admin:', err);
      setError('Không thể kết nối tới cơ sở dữ liệu lịch tập.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const unsub = subscribeSchedulesRealtime(() => {
      fetchSchedules();
    });
    return () => unsub();
  }, [statusFilter]);

  const handleCreateNew = () => {
    setEditingSchedule(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (schedule: RehearsalSchedule) => {
    setEditingSchedule(schedule);
    setIsEditorOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSchedule) return;
    setIsDeleting(true);
    try {
      await deleteSchedule(deletingSchedule.id);
      setDeletingSchedule(null);
      fetchSchedules();
    } catch (err) {
      console.error('Lỗi khi xóa lịch tập:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (schedule: RehearsalSchedule, newStatus: RehearsalSchedule['status']) => {
    try {
      await updateSchedule(schedule.id, { status: newStatus });
      fetchSchedules();
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái lịch tập:', err);
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    return (
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Ban Điều Hành</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Quản Lý Lịch Tập Hát Ca Đoàn
          </h2>
          <p className="text-xs text-slate-400">
            Tạo mới, chỉnh sửa, lên lịch tập định kỳ và quản lý trạng thái hiển thị.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Lịch Tập Mới</span>
        </button>
      </div>

      {/* Filters & View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {['all', 'published', 'draft', 'cancelled'].map((st) => {
            const labels: Record<string, string> = {
              all: 'Tất cả',
              published: 'Đã xuất bản',
              draft: 'Bản nháp',
              cancelled: 'Đã hủy',
            };
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>

        {/* View Mode & Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                viewMode === 'list' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Danh sách
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                viewMode === 'calendar' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Lịch tháng
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Đang tải danh sách lịch tập...</div>
      ) : viewMode === 'calendar' ? (
        <ScheduleCalendar schedules={filteredSchedules} />
      ) : filteredSchedules.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Chưa có lịch tập nào</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Buổi tập</th>
                  <th className="px-4 py-4">Ngày & Giờ</th>
                  <th className="px-4 py-4">Địa điểm</th>
                  <th className="px-4 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredSchedules.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {new Date(item.start_at).toLocaleDateString('vi-VN')} ({new Date(item.start_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {item.location}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : item.status === 'draft'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {item.status === 'published' ? 'Xuất bản' : item.status === 'draft' ? 'Bản nháp' : 'Đã hủy'}
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
                        onClick={() => setDeletingSchedule(item)}
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
      <ScheduleEditor
        schedule={editingSchedule}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={fetchSchedules}
      />

      {/* Custom Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={!!deletingSchedule}
        title="Xác Nhận Xóa Lịch Tập"
        message={`Bạn có chắc chắn muốn xóa lịch tập "${deletingSchedule?.title || ''}" khỏi hệ thống? Thao tác này không thể hoàn tác.`}
        confirmLabel="Đồng Ý Xóa"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingSchedule(null)}
        isDeleting={isDeleting}
      />

    </div>
  );
};
