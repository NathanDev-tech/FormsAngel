import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Trash2, Eye, Download, FileSpreadsheet, Inbox } from 'lucide-react';
import { FormWithFields, FormField, FormResponseWithAnswers } from '../../types/forms.ts';
import { getFormResponses, deleteResponse, subscribeFormResponsesRealtime } from '../../lib/formsApi.ts';
import { FormResponseDetailModal } from './FormResponseDetailModal.tsx';
import { formatDateVi, exportDecoratedExcel } from '../../utils/csvExport.ts';

interface FormResponseListModalProps {
  form: FormWithFields | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FormResponseListModal: React.FC<FormResponseListModalProps> = ({
  form,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<FormField[]>([]);
  const [responses, setResponses] = useState<FormResponseWithAnswers[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<FormResponseWithAnswers | null>(null);

  const loadData = async () => {
    if (!form) return;
    setLoading(true);
    try {
      const { responses: resList, fields: fieldList } = await getFormResponses(form.id);
      setResponses(resList);
      setFields(fieldList.length > 0 ? fieldList : form.fields);
    } catch (err) {
      console.error('Lỗi tải danh sách phản hồi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && form) {
      loadData();

      // Đăng ký Supabase Realtime
      const unsubscribe = subscribeFormResponsesRealtime(form.id, () => {
        loadData();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isOpen, form?.id]);

  if (!isOpen || !form) return null;

  // Xoá 1 phản hồi
  const handleDelete = async (resId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá lượt phản hồi này?')) {
      await deleteResponse(resId);
      setResponses(prev => prev.filter(r => r.id !== resId));
    }
  };

  // Xuất file Excel các phản hồi
  const handleExportExcel = () => {
    if (responses.length === 0) {
      alert('Chưa có phản hồi nào để xuất.');
      return;
    }

    const rows = responses.map((r, index) => {
      const rowObj: Record<string, string> = {
        'STT': (index + 1).toString(),
        'Thời gian gửi': formatDateVi(r.created_at),
      };
      fields.forEach(f => {
        rowObj[f.label] = r.answersMap[f.id] || '';
      });
      return rowObj;
    });

    const headers = ['STT', 'Thời gian gửi', ...fields.map(f => f.label)];
    
    // Tận dụng helper exportDecoratedExcel
    const titleHeader = `DANH SÁCH PHẢN HỒI — ${form.title.toUpperCase()}`;
    const filename = `Phan-hoi-${form.slug}.csv`;

    // Biến đổi tạm rows thành dạng đơn giản xuất CSV/Excel
    let csvContent = '\uFEFF' + headers.join(',') + '\n';
    rows.forEach(row => {
      const line = headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join(',');
      csvContent += line + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[85vh]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  {responses.length} phản hồi
                </span>
                <span className="text-xs text-slate-400">• Realtime</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Phản Hồi: {form.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={loadData}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                title="Tải lại dữ liệu"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleExportExcel}
                disabled={responses.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Xuất CSV / Excel</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Table */}
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
                <span>Đang tải danh sách phản hồi...</span>
              </div>
            ) : responses.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">Chưa có phản hồi nào cho biểu mẫu này</p>
                <p className="text-xs">Khi có người gửi form, dữ liệu sẽ tự động xuất hiện ở đây theo thời gian thực.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 w-12 text-center">STT</th>
                      <th className="p-3 w-40">Thời gian gửi</th>
                      {fields.slice(0, 4).map(f => (
                        <th key={f.id} className="p-3 min-w-[140px] truncate">
                          {f.label}
                        </th>
                      ))}
                      <th className="p-3 w-24 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {responses.map((res, index) => (
                      <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-center font-semibold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                          {formatDateVi(res.created_at)}
                        </td>
                        {fields.slice(0, 4).map(f => (
                          <td key={f.id} className="p-3 truncate max-w-[200px]">
                            {res.answersMap[f.id] || <span className="text-slate-300 dark:text-slate-600 italic">--</span>}
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedResponse(res)}
                              className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(res.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
                              title="Xoá phản hồi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <span className="text-xs text-slate-400">
              Tổng cộng {responses.length} bản ghi
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>

      {/* Response Detail Modal */}
      <FormResponseDetailModal
        response={selectedResponse}
        fields={fields}
        isOpen={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
      />
    </>
  );
};
