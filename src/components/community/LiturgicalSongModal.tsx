import React, { useState } from 'react';
import { CreateLiturgicalInput, LiturgicalScheduleType, LiturgicalColor } from '../../types/liturgical.ts';
import { createLiturgicalSong } from '../../lib/liturgicalApi.ts';
import { X, Save, Church, BookOpen, Calendar, Music } from 'lucide-react';

interface LiturgicalSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const LiturgicalSongModal: React.FC<LiturgicalSongModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [type, setType] = useState<LiturgicalScheduleType>('sunday');
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [liturgicalColor, setLiturgicalColor] = useState<LiturgicalColor>('green');

  const [nhapLe, setNhapLe] = useState('');
  const [dapCaAlleluia, setDapCaAlleluia] = useState('');
  const [dangLe, setDangLe] = useState('');
  const [hiepLe, setHiepLe] = useState('');
  const [ketLe, setKetLe] = useState('');
  const [note, setNote] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên Thánh Lễ / Chúa Nhật.');
      return;
    }

    setIsSaving(true);
    try {
      const input: CreateLiturgicalInput = {
        type,
        title: title.trim(),
        event_date: eventDate.trim() || new Date().toLocaleDateString('vi-VN'),
        liturgical_color: liturgicalColor,
        nhap_le: nhapLe.trim(),
        dap_ca_alleluia: type !== 'weekday' ? dapCaAlleluia.trim() : '',
        dang_le: dangLe.trim(),
        hiep_le: hiepLe.trim(),
        ket_le: type !== 'weekday' ? ketLe.trim() : '',
        note: note.trim(),
        is_active: true,
      };

      await createLiturgicalSong(input);
      onSaved();
      onClose();
    } catch (err) {
      console.error('Lỗi tạo bài hát phụng vụ:', err);
      alert('Lỗi lưu Lịch Bài Hát, vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white font-serif">
                Soạn Thảo Lịch Bài Hát Phụng Vụ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tạo danh sách bài hát cho Lễ Ngày Tuần (3 mục) & Lễ Chúa Nhật / Lễ Trọng (5 mục)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Select Type: Chúa Nhật (5 mục) vs Lễ Tuần (3 mục) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Loại Thánh Lễ Phụng Vụ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setType('sunday')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'sunday' || type === 'solemnity'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Chúa Nhật & Lễ Trọng (5 Mục)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('weekday')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'weekday'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Lễ Ngày Tuần (3 Mục)</span>
              </button>
            </div>
          </div>

          {/* Title & Event Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tên Thánh Lễ / Chúa Nhật <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={type === 'weekday' ? 'VD: Thứ Bảy Tuần XXIV Thường Niên' : 'VD: Chúa Nhật XXV Thường Niên'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ngày cử hành
              </label>
              <input
                type="text"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                placeholder="VD: 21/09/2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Màu áo phụng vụ */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Màu Áo Phụng Vụ
            </label>
            <select
              value={liturgicalColor}
              onChange={e => setLiturgicalColor(e.target.value as LiturgicalColor)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-sky-500"
            >
              <option value="green">🟢 Mùa Thường Niên (Áo Xanh)</option>
              <option value="white">⚪ Mùa Phục Sinh / Giáng Sinh / Lễ Trọng (Áo Trắng)</option>
              <option value="red">🔴 Lễ Chúa Thánh Thần / Các Thánh Tử Đạo (Áo Đỏ)</option>
              <option value="purple">🟣 Mùa Vọng / Mùa Chay (Áo Tím)</option>
              <option value="rose">🌸 Chúa Nhật Vui / Mừng (Áo Hồng)</option>
            </select>
          </div>

          {/* Dynamic Sections Inputs */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-500" />
              <span>Danh Sách Bài Hát Phụng Vụ ({type === 'weekday' ? '3 Mục' : '5 Mục'})</span>
            </h4>

            {/* 1. Nhập Lễ */}
            <div>
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                1. Ca Nhập Lễ
              </label>
              <input
                type="text"
                value={nhapLe}
                onChange={e => setNhapLe(e.target.value)}
                placeholder="VD: Vào Nhà Chúa — Tác giả..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* 2. Đáp Ca / Alleluia (Chỉ cho Lễ Chúa Nhật / Lễ Trọng - 5 mục) */}
            {type !== 'weekday' && (
              <div>
                <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                  2. Đáp Ca / Alleluia
                </label>
                <input
                  type="text"
                  value={dapCaAlleluia}
                  onChange={e => setDapCaAlleluia(e.target.value)}
                  placeholder="VD: Đáp Ca: Chúa nâng đỡ hồn tôi (Tv 53) • Alleluia:..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            {/* 3. Dâng Lễ */}
            <div>
              <label className="block text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">
                {type === 'weekday' ? '2. Ca Dâng Lễ' : '3. Ca Dâng Lễ (Tiến Lễ)'}
              </label>
              <input
                type="text"
                value={dangLe}
                onChange={e => setDangLe(e.target.value)}
                placeholder="VD: Lễ Vật Cung Tiến — Tác giả..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* 4. Hiệp Lễ */}
            <div>
              <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                {type === 'weekday' ? '3. Ca Hiệp Lễ' : '4. Ca Hiệp Lễ (Rước Lễ)'}
              </label>
              <input
                type="text"
                value={hiepLe}
                onChange={e => setHiepLe(e.target.value)}
                placeholder="VD: Chính Lúc Chết Đi — Tác giả..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* 5. Kết Lễ (Chỉ cho Lễ Chúa Nhật / Lễ Trọng - 5 mục) */}
            {type !== 'weekday' && (
              <div>
                <label className="block text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">
                  5. Ca Kết Lễ (Tạ Ơn)
                </label>
                <input
                  type="text"
                  value={ketLe}
                  onChange={e => setKetLe(e.target.value)}
                  placeholder="VD: Tạ Ơn Chúa Với Mẹ — Tác giả..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú ca đoàn (Bè hát, đệm đàn, phân công)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="VD: Ca đoàn chú ý bè Soprano & Tenor đoạn 2..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu Lịch Bài Hát'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
