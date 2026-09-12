import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck, BookOpen, ShieldCheck, Activity } from 'lucide-react';
import { ChoirMember } from '../types.ts';
import { CATECHISM_CLASSES } from './RegistrationForm.tsx';

interface EditMemberModalProps {
  member: ChoirMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<ChoirMember>) => Promise<boolean>;
}

export const MEMBER_ROLES = [
  'Ca Viên',
  'Nhạc công',
  'Thủ quỹ',
  'Thư ký',
  'Ca trưởng',
  'Ca phó',
];

export const MEMBER_STATUSES = [
  'Hoạt động',
  'Tạm nghỉ',
  'Nghỉ hẳn',
];

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    tenThanh: '',
    hoVaTen: '',
    ngaySinh: '',
    lop: '',
    soDienThoai: '',
    bonPhan: 'Ca Viên',
    trangThai: 'Hoạt động',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        tenThanh: member.tenThanh || '',
        hoVaTen: member.hoVaTen || '',
        ngaySinh: member.ngaySinh || '',
        lop: member.lop || '',
        soDienThoai: member.soDienThoai || '',
        bonPhan: member.bonPhan || 'Ca Viên',
        trangThai: member.trangThai || 'Hoạt động',
      });
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await onSave(member.id, formData);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white font-serif">Cập Nhật Thông Tin Ca Viên</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chỉnh sửa chi tiết ca viên đã đăng ký</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. Tên Thánh
            </label>
            <input
              type="text"
              value={formData.tenThanh}
              onChange={e => setFormData({ ...formData, tenThanh: e.target.value })}
              placeholder="VD: Maria, Giuse, Têrêsa..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. Họ và Tên
            </label>
            <input
              type="text"
              value={formData.hoVaTen}
              onChange={e => setFormData({ ...formData, hoVaTen: e.target.value })}
              placeholder="Họ và tên ca viên"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              3. Ngày Sinh
            </label>
            <input
              type="text"
              value={formData.ngaySinh}
              onChange={e => setFormData({ ...formData, ngaySinh: e.target.value })}
              placeholder="VD: 15/08"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                4. Giọng / Lớp
              </label>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 flex items-center gap-1 font-serif">
                <BookOpen className="w-3 h-3" /> 4 Khối Lớp Giáo Lý
              </span>
            </div>
            <input
              type="text"
              value={formData.lop}
              onChange={e => setFormData({ ...formData, lop: e.target.value })}
              placeholder="Nhập hoặc chọn lớp bên dưới"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
            {/* Quick buttons for 4 classes */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CATECHISM_CLASSES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, lop: c })}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    formData.lop === c
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              5. Số Điện Thoại
            </label>
            <input
              type="tel"
              value={formData.soDienThoai}
              onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })}
              placeholder="Số điện thoại"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          {/* Bổn phận & Trạng thái (để khớp chuẩn danh sách thực tế) */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Bổn phận</span>
              </label>
              <select
                value={formData.bonPhan}
                onChange={e => setFormData({ ...formData, bonPhan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              >
                {MEMBER_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trạng thái</span>
              </label>
              <select
                value={formData.trangThai}
                onChange={e => setFormData({ ...formData, trangThai: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              >
                {MEMBER_STATUSES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm shadow-md shadow-sky-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
