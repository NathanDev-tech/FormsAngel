import React, { useState } from 'react';
import { UserPlus, RotateCcw, Sparkles, HeartHandshake, ArrowRight, BookOpen } from 'lucide-react';
import { MemberFormData } from '../types.ts';

interface RegistrationFormProps {
  onSubmit: (data: MemberFormData) => Promise<boolean>;
  onViewList: () => void;
}

const COMMON_SAINT_NAMES = [
  'Maria',
  'Giuse',
  'Têrêsa',
  'Phêrô',
  'Anna',
  'Phanxicô',
  'Phaolô',
  'Catarina',
  'Gioan',
  'Đaminh',
];

export const CATECHISM_CLASSES = [
  'Xưng Tội',
  'Thêm Sức',
  'Sống Đạo',
  'Vào Đời',
  'Giáo Lý Viên',
  'Dự Trưởng',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, onViewList }) => {
  const [formData, setFormData] = useState<MemberFormData>({
    tenThanh: '',
    hoVaTen: '',
    ngaySinh: '',
    lop: '',
    soDienThoai: '',
    bonPhan: 'Ca Viên',
    trangThai: 'Hoạt động',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentlySubmittedName, setRecentlySubmittedName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectSaintName = (saintName: string) => {
    setFormData(prev => ({
      ...prev,
      tenThanh: saintName,
    }));
  };

  const handleSelectClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      lop: className,
    }));
  };

  // TUYỆT ĐỐI KHÔNG VALIDATION CHẶN SUBMIT THEO YÊU CẦU:
  // "Bắt buộc: KHÔNG trường nào là required. Người dùng có thể bỏ trống bất kỳ trường nào và vẫn bấm gửi/lưu thành công bình thường"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const displayName = [formData.tenThanh, formData.hoVaTen].filter(Boolean).join(' ') || 'Ca viên mới';

    const success = await onSubmit(formData);

    if (success) {
      setRecentlySubmittedName(displayName);
      // Tự động xoá trắng form để sẵn sàng nhập người kế tiếp
      setFormData({
        tenThanh: '',
        hoVaTen: '',
        ngaySinh: '',
        lop: '',
        soDienThoai: '',
        bonPhan: 'Ca Viên',
        trangThai: 'Hoạt động',
      });
    }

    setIsSubmitting(false);
  };

  const handleResetForm = () => {
    setFormData({
      tenThanh: '',
      hoVaTen: '',
      ngaySinh: '',
      lop: '',
      soDienThoai: '',
      bonPhan: 'Ca Viên',
      trangThai: 'Hoạt động',
    });
    setRecentlySubmittedName(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Intro Banner */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/60 text-xs font-medium mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Phiếu Ghi Danh Ca Viên</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight font-serif">
          Đăng Ký Ca Viên Ca Đoàn Thiên Thần
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
          Hoan nghênh các anh chị em cùng tham gia phụng sự Thánh Lễ qua lời ca tiếng hát tại Giáo Xứ Bắc Hòa.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-100/80 dark:border-slate-800 shadow-xl shadow-sky-900/5 p-5 sm:p-8 relative overflow-hidden transition-all">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-100/50 via-amber-50/30 to-transparent dark:from-sky-900/10 dark:via-amber-900/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
          
          {/* TRƯỜNG 1: Tên Thánh */}
          <div className="space-y-1.5">
            <label htmlFor="field-tenThanh" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              1. Tên Thánh
            </label>
            <input
              type="text"
              id="field-tenThanh"
              name="tenThanh"
              value={formData.tenThanh}
              onChange={handleChange}
              placeholder="Ví dụ: Maria, Giuse, Têrêsa, Phêrô, Anna..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-500 transition-all text-base sm:text-sm"
            />
            {/* Gợi ý Tên Thánh nhanh */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Gợi ý Tên Thánh:</span>
              {COMMON_SAINT_NAMES.slice(0, 6).map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelectSaintName(name)}
                  className="px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300 transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* TRƯỜNG 2: Họ và Tên */}
          <div className="space-y-1.5">
            <label htmlFor="field-hoVaTen" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              2. Họ và Tên
            </label>
            <input
              type="text"
              id="field-hoVaTen"
              name="hoVaTen"
              value={formData.hoVaTen}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn Văn An, Trần Thị Mai..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-500 transition-all text-base sm:text-sm"
            />
          </div>

          {/* TRƯỜNG 3: Ngày Sinh */}
          <div className="space-y-1.5">
            <label htmlFor="field-ngaySinh" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              3. Ngày Sinh
            </label>
            <input
              type="text"
              id="field-ngaySinh"
              name="ngaySinh"
              value={formData.ngaySinh}
              onChange={handleChange}
              placeholder="Ví dụ: 15/08"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-500 transition-all text-base sm:text-sm"
            />
          </div>

          {/* TRƯỜNG 4: Lớp (Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời) */}
          <div className="space-y-1.5">
            <label htmlFor="field-lop" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              4. Lớp
            </label>
            <input
              type="text"
              id="field-lop"
              name="lop"
              value={formData.lop}
              onChange={handleChange}
              placeholder="Chọn hoặc nhập: Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-500 transition-all text-base sm:text-sm"
            />
            {/* Lựa chọn 4 lớp nhanh */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Lớp giáo lý:
              </span>
              {CATECHISM_CLASSES.map(className => {
                const isSelected = formData.lop === className;
                return (
                  <button
                    key={className}
                    type="button"
                    onClick={() => handleSelectClass(className)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300 dark:ring-sky-700'
                        : 'bg-sky-50 dark:bg-slate-800 text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-slate-700 border border-sky-200/60 dark:border-slate-700'
                    }`}
                  >
                    {className}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TRƯỜNG 5: Số Điện Thoại */}
          <div className="space-y-1.5">
            <label htmlFor="field-soDienThoai" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              5. Số Điện Thoại
            </label>
            <input
              type="tel"
              id="field-soDienThoai"
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={handleChange}
              placeholder="Ví dụ: 0912345678"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-500 transition-all text-base sm:text-sm"
            />
          </div>

          {/* Buttons Area */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              id="submit-register-btn"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-semibold text-base shadow-lg shadow-sky-500/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Gửi Đăng Ký Ca Viên'}</span>
            </button>

            <button
              type="button"
              id="reset-form-btn"
              onClick={handleResetForm}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm transition-all cursor-pointer"
              title="Xoá trắng các trường nhập"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm mới</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-1">
            Sau khi gửi, phiếu sẽ tự động làm mới để sẵn sàng ghi danh người kế tiếp.
          </p>
        </form>

        {/* Success confirmation mini banner */}
        {recentlySubmittedName && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200">
                Đã ghi danh <strong className="font-semibold">{recentlySubmittedName}</strong> thành công!
              </p>
            </div>
            <button
              type="button"
              id="view-list-after-add-btn"
              onClick={onViewList}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex-shrink-0 cursor-pointer"
            >
              <span>Xem danh sách</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
