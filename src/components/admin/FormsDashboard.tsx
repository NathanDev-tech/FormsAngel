import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Eye, Trash2, Inbox, RefreshCw, Sparkles, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { FormWithFields } from '../../types/forms.ts';
import { getAdminForms, deleteForm, toggleFormStatus } from '../../lib/formsApi.ts';
import { CopyFormLinkButton } from './CopyFormLinkButton.tsx';
import { FormBuilderModal } from './FormBuilderModal.tsx';
import { FormResponseListModal } from './FormResponseListModal.tsx';
import { ConfirmDialogModal } from './ConfirmDialogModal.tsx';
import { formatDateVi } from '../../utils/csvExport.ts';

export const FormsDashboard: React.FC = () => {
  const [forms, setForms] = useState<(FormWithFields & { response_count: number })[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [editingForm, setEditingForm] = useState<FormWithFields | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const [responseViewForm, setResponseViewForm] = useState<FormWithFields | null>(null);

  // Delete modal state
  const [deletingForm, setDeletingForm] = useState<FormWithFields | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadForms = async () => {
    setLoading(true);
    try {
      const list = await getAdminForms();
      setForms(list);
    } catch (err) {
      console.error('Lỗi tải danh sách Forms Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  // Bật / Tắt trạng thái Form
  const handleToggleStatus = async (formId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    await toggleFormStatus(formId, newStatus);
    setForms(prev => prev.map(f => (f.id === formId ? { ...f, is_active: newStatus } : f)));
  };

  // Xoá Form
  const handleConfirmDeleteForm = async () => {
    if (!deletingForm) return;
    setIsDeleting(true);
    try {
      await deleteForm(deletingForm.id);
      setForms(prev => prev.filter(f => f.id !== deletingForm.id));
      setDeletingForm(null);
    } catch (err) {
      console.error('Lỗi khi xoá biểu mẫu:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Xem Public Form trong Tab Mới
  const handleOpenPreview = (slug: string) => {
    const origin = window.location.origin;
    const publicUrl = `${origin}/FormsAngel/form/${slug}`;
    window.open(publicUrl, '_blank');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Banner Top */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-amber-300" />
              <span>Biểu Mẫu Ca Đoàn Thiên Thần</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
              Quản Lý Biểu Mẫu & Đăng Ký
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Tạo biểu mẫu thu thập thông tin, sao chép link công khai gửi cho ca viên và xem phản hồi thời gian thực.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingForm(null);
              setIsBuilderOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-lg hover:bg-amber-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5 text-sky-600" />
            <span>TẠO BIỂU MẪU MỚI</span>
          </button>
        </div>
      </div>

      {/* Forms List Header & Refresh */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Danh Sách Biểu Mẫu
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
            {forms.length}
          </span>
        </div>

        <button
          type="button"
          onClick={loadForms}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Tải lại danh sách"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* List Container */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
          <span>Đang tải biểu mẫu...</span>
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
            Chưa có biểu mẫu nào được tạo
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bấm nút "TẠO BIỂU MẪU MỚI" ở trên để bắt đầu khởi tạo biểu mẫu lấy thông tin.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingForm(null);
              setIsBuilderOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo biểu mẫu ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {forms.map(form => (
            <div
              key={form.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Header Badge Status */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(form.id, form.is_active)}
                    title="Click để đổi trạng thái"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      form.is_active
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {form.is_active ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Đang nhận phản hồi</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Đã đóng nhận biểu mẫu</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {form.response_count} phản hồi
                  </span>
                </div>

                {/* Title & Slug */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2 font-serif">
                    {form.title}
                  </h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-mono mt-0.5 truncate">
                    /form/{form.slug}
                  </p>
                </div>

                {form.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {form.description}
                  </p>
                )}

                <div className="text-[11px] text-slate-400 pt-1">
                  Khởi tạo: {formatDateVi(form.created_at)}
                </div>
              </div>

              {/* Actions Box */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <CopyFormLinkButton slug={form.slug} />

                  <button
                    type="button"
                    onClick={() => handleOpenPreview(form.slug)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Mở liên kết biểu mẫu công khai"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Xem Link</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setResponseViewForm(form)}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200/80 dark:border-sky-800/80 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Phản Hồi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingForm(form);
                      setIsBuilderOpen(true);
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingForm(form)}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xoá</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Builder Modal */}
      <FormBuilderModal
        form={editingForm}
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSaved={loadForms}
      />

      {/* Response List Modal */}
      <FormResponseListModal
        form={responseViewForm}
        isOpen={!!responseViewForm}
        onClose={() => setResponseViewForm(null)}
      />

      {/* Custom Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={!!deletingForm}
        title="Xác Nhận Xóa Biểu Mẫu"
        message={`Bạn có chắc chắn muốn xóa biểu mẫu "${deletingForm?.title || ''}"? Tất cả câu hỏi và lượt phản hồi liên quan sẽ bị xóa vĩnh viễn.`}
        confirmLabel="Đồng Ý Xóa"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDeleteForm}
        onClose={() => setDeletingForm(null)}
        isDeleting={isDeleting}
      />

    </div>
  );
};
