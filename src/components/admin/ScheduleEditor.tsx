import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Save, AlertCircle } from 'lucide-react';
import { RehearsalSchedule, CreateScheduleInput, ScheduleStatus } from '../../types/schedules.ts';
import { createSchedule, updateSchedule } from '../../lib/schedulesApi.ts';

interface ScheduleEditorProps {
  schedule?: RehearsalSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  schedule,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [location, setLocation] = useState('Nhà thờ Bắc Hòa');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ScheduleStatus>('published');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      if (schedule.start_at) {
        const dStr = schedule.start_at.split('T')[0];
        const tStr = schedule.start_at.split('T')[1]?.slice(0, 5) || '19:00';
        setStartDate(dStr);
        setStartTime(tStr);
      }
      if (schedule.end_at) {
        const tStr = schedule.end_at.split('T')[1]?.slice(0, 5) || '21:00';
        setEndTime(tStr);
      }
      setLocation(schedule.location || 'Nhà thờ Bắc Hòa');
      setDescription(schedule.description || '');
      setNotes(schedule.notes || '');
      setStatus(schedule.status || 'published');
    } else {
      setTitle('');
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setStartDate(tomorrow);
      setStartTime('19:00');
      setEndTime('21:00');
      setLocation('Nhà thờ Bắc Hòa');
      setDescription('');
      setNotes('');
      setStatus('published');
    }
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) {
      setError('Vui lòng nhập tên buổi tập và ngày diễn ra.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const startIso = `${startDate}T${startTime}:00Z`;
    const endIso = `${startDate}T${endTime}:00Z`;

    try {
      if (schedule) {
        await updateSchedule(schedule.id, {
          title: title.trim(),
          start_at: startIso,
          end_at: endIso,
          location: location.trim(),
          description: description.trim(),
          notes: notes.trim(),
          status,
        });
      } else {
        await createSchedule({
          title: title.trim(),
          start_at: startIso,
          end_at: endIso,
          location: location.trim(),
          description: description.trim(),
          notes: notes.trim(),
          status,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Lỗi khi lưu lịch tập:', err);
      setError('Không thể lưu thông tin lịch tập. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {schedule ? 'Chỉnh Sửa Lịch Tập Hát' : 'Tạo Lịch Tập Hát Mới'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Tiêu đề buổi tập <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: 🎼 Tập Hát Phụng Vụ Chúa Nhật"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              required
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Ngày tập <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Giờ kết thúc
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Location & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Địa điểm
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: Nhà thờ Bắc Hòa / Phòng Ca Đoàn"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="published">Đã Xuất Bản</option>
                <option value="draft">Bản Nháp</option>
                <option value="cancelled">Đã Hủy</option>
                <option value="completed">Đã Hoàn Thành</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Nội dung buổi tập
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nội dung các bài hát sẽ tập..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Ghi chú thêm
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Nhớ mang theo tập nhạc phụng vụ..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Đang lưu...' : 'Lưu Lịch Tập'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
