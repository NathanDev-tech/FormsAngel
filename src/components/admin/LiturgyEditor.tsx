import React, { useState, useEffect } from 'react';
import { X, Church, Save, AlertCircle, Plus, Trash2, Music } from 'lucide-react';
import { LiturgicalService, LiturgicalServiceSong, ServiceStatus } from '../../types/portal.ts';
import { createLiturgicalService, updateLiturgicalService } from '../../lib/liturgyApi.ts';

interface LiturgyEditorProps {
  service?: LiturgicalService | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LiturgyEditor: React.FC<LiturgyEditorProps> = ({
  service,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('06:30');
  const [location, setLocation] = useState('Nhà thờ Bắc Hòa');
  const [occasion, setOccasion] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ServiceStatus>('published');
  
  // Song assignments
  const [nhapLe, setNhapLe] = useState('');
  const [dapCa, setDapCa] = useState('');
  const [alleluia, setAlleluia] = useState('');
  const [dangLe, setDangLe] = useState('');
  const [hiepLe, setHiepLe] = useState('');
  const [ketLe, setKetLe] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setTitle(service.title || '');
      setServiceDate(service.service_date || '');
      setServiceTime(service.service_time || '06:30');
      setLocation(service.location || 'Nhà thờ Bắc Hòa');
      setOccasion(service.occasion || '');
      setNotes(service.notes || '');
      setStatus(service.status || 'published');

      if (service.songs) {
        const getSongPos = (pos: string) => service.songs?.find(s => s.song_position === pos)?.custom_title || '';
        setNhapLe(getSongPos('nhap_le'));
        setDapCa(getSongPos('dap_ca'));
        setAlleluia(getSongPos('alleluia'));
        setDangLe(getSongPos('dang_le'));
        setHiepLe(getSongPos('hiep_le'));
        setKetLe(getSongPos('ket_le'));
      }
    } else {
      setTitle('Thánh Lễ Chúa Nhật');
      const sunday = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
      setServiceDate(sunday);
      setServiceTime('06:30');
      setLocation('Nhà thờ Bắc Hòa');
      setOccasion('Chúa Nhật Thường Niên');
      setNotes('');
      setStatus('published');
      setNhapLe('');
      setDapCa('');
      setAlleluia('');
      setDangLe('');
      setHiepLe('');
      setKetLe('');
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !serviceDate) {
      setError('Vui lòng nhập tên Thánh lễ và ngày phục vụ.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const songMappings: LiturgicalServiceSong[] = [];
    if (nhapLe.trim()) songMappings.push({ id: '', service_id: '', custom_title: nhapLe.trim(), song_position: 'nhap_le', display_order: 1 });
    if (dapCa.trim()) songMappings.push({ id: '', service_id: '', custom_title: dapCa.trim(), song_position: 'dap_ca', display_order: 2 });
    if (alleluia.trim()) songMappings.push({ id: '', service_id: '', custom_title: alleluia.trim(), song_position: 'alleluia', display_order: 3 });
    if (dangLe.trim()) songMappings.push({ id: '', service_id: '', custom_title: dangLe.trim(), song_position: 'dang_le', display_order: 4 });
    if (hiepLe.trim()) songMappings.push({ id: '', service_id: '', custom_title: hiepLe.trim(), song_position: 'hiep_le', display_order: 5 });
    if (ketLe.trim()) songMappings.push({ id: '', service_id: '', custom_title: ketLe.trim(), song_position: 'ket_le', display_order: 6 });

    try {
      if (service) {
        await updateLiturgicalService(service.id, {
          title: title.trim(),
          service_date: serviceDate,
          service_time: serviceTime,
          location: location.trim(),
          occasion: occasion.trim(),
          notes: notes.trim(),
          status,
          songs: songMappings,
        });
      } else {
        await createLiturgicalService({
          title: title.trim(),
          service_date: serviceDate,
          service_time: serviceTime,
          location: location.trim(),
          occasion: occasion.trim(),
          notes: notes.trim(),
          status,
          songs: songMappings,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Lỗi khi lưu lịch phục vụ:', err);
      setError('Không thể lưu thông tin Thánh lễ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Church className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {service ? 'Chỉnh Sửa Lịch Phục Vụ Thánh Lễ' : 'Tạo Lịch Phục Vụ Thánh Lễ Mới'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Occasion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Tên Thánh lễ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Thánh Lễ Chúa Nhật XXV Thường Niên"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Dịp Lễ / Phụng Vụ
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="VD: Chúa Nhật Thường Niên / Lễ Trọng"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Ngày diễn ra <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Giờ cử hành
              </label>
              <input
                type="time"
                value={serviceTime}
                onChange={(e) => setServiceTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Địa điểm
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Song Assignments Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Music className="w-4 h-4" />
              <span>Phân Công Bài Hát Bộ Lễ (6 Phần)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1. Ca Nhập Lễ
                </label>
                <input
                  type="text"
                  value={nhapLe}
                  onChange={(e) => setNhapLe(e.target.value)}
                  placeholder="Tên bài hát nhập lễ..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  2. Đáp Ca
                </label>
                <input
                  type="text"
                  value={dapCa}
                  onChange={(e) => setDapCa(e.target.value)}
                  placeholder="Tên bài hát đáp ca..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  3. Alleluia
                </label>
                <input
                  type="text"
                  value={alleluia}
                  onChange={(e) => setAlleluia(e.target.value)}
                  placeholder="Tên bài alleluia..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  4. Ca Dâng Lễ
                </label>
                <input
                  type="text"
                  value={dangLe}
                  onChange={(e) => setDangLe(e.target.value)}
                  placeholder="Tên bài dâng lễ..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  5. Ca Hiệp Lễ
                </label>
                <input
                  type="text"
                  value={hiepLe}
                  onChange={(e) => setHiepLe(e.target.value)}
                  placeholder="Tên bài hiệp lễ..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  6. Ca Kết Lễ
                </label>
                <input
                  type="text"
                  value={ketLe}
                  onChange={(e) => setKetLe(e.target.value)}
                  placeholder="Tên bài kết lễ..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Ghi chú thêm
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Phân công đọc sách, ca trưởng, phục trang..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Footer Submit */}
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
              <span>{submitting ? 'Đang lưu...' : 'Lưu Lịch Phục Vụ'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
