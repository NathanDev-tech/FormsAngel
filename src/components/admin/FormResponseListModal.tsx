import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Trash2, Eye, FileSpreadsheet, Inbox, UserPlus, CheckCircle2 } from 'lucide-react';
import { FormWithFields, FormField, FormResponseWithAnswers } from '../../types/forms.ts';
import { getFormResponses, deleteResponse, subscribeFormResponsesRealtime } from '../../lib/formsApi.ts';
import { FormResponseDetailModal, extractMemberDataFromAnswers } from './FormResponseDetailModal.tsx';
import { formatDateVi } from '../../utils/csvExport.ts';
import { addMember } from '../../lib/api.ts';

const APPROVED_RESPONSES_KEY = 'formsangel_approved_responses_v1';

function getApprovedResponseIds(): string[] {
  try {
    const saved = localStorage.getItem(APPROVED_RESPONSES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveApprovedResponseId(id: string) {
  try {
    const current = getApprovedResponseIds();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem(APPROVED_RESPONSES_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Lỗi lưu approved response id:', e);
  }
}

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
  const [approvedIds, setApprovedIds] = useState<string[]>(getApprovedResponseIds);
  const [approvingId, setApprovingId] = useState<string | null>(null);

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

  // Duyệt trực tiếp 1 phản hồi vào danh sách ca viên
  const handleApproveInline = async (res: FormResponseWithAnswers) => {
    if (approvedIds.includes(res.id)) return;

    setApprovingId(res.id);
    try {
      const memberData = extractMemberDataFromAnswers(res.answersMap, fields);
      await addMember(memberData);
      saveApprovedResponseId(res.id);
      setApprovedIds(prev => [...prev, res.id]);
      alert(`🎉 Đã duyệt thành công ca viên "${[memberData.tenThanh, memberData.hoVaTen].filter(Boolean).join(' ')}" vào danh sách ca đoàn!`);
    } catch (err) {
      console.error('Lỗi duyệt ca viên từ phản hồi:', err);
      alert('Không thể duyệt ca viên, vui lòng thử lại.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleApproveSuccess = (resId: string) => {
    saveApprovedResponseId(resId);
    setApprovedIds(prev => [...prev, resId]);
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
        'Trạng thái': approvedIds.includes(r.id) ? 'Đã duyệt' : 'Chưa duyệt',
        'Thời gian gửi': formatDateVi(r.created_at),
      };
      fields.forEach(f => {
        rowObj[f.label] = r.answersMap[f.id] || '';
      });
      return rowObj;
    });

    const headers = ['STT', 'Trạng thái', 'Thời gian gửi', ...fields.map(f => f.label)];
    const filename = `Phan-hoi-${form.slug}.csv`;

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
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[88vh]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  {responses.length} phản hồi
                </span>
                <span className="text-xs text-slate-400">• Cập nhật tự động</span>
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
          <div className="flex-1 overflow-auto p-3 sm:p-4">
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
                      <th className="p-3 w-32">Thời gian gửi</th>
                      <th className="p-3 w-28 text-center">Trạng thái</th>
                      {fields.slice(0, 3).map(f => (
                        <th key={f.id} className="p-3 min-w-[140px] truncate">
                          {f.label}
                        </th>
                      ))}
                      <th className="p-3 w-36 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {responses.map((res, index) => {
                      const isApproved = approvedIds.includes(res.id);
                      return (
                        <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 text-center font-semibold text-slate-400">
                            {index + 1}
                          </td>
                          <td className="p-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                            {formatDateVi(res.created_at)}
                          </td>
                          <td className="p-3 text-center">
                            {isApproved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Đã duyệt</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                Chờ duyệt
                              </span>
                            )}
                          </td>
                          {fields.slice(0, 3).map(f => (
                            <td key={f.id} className="p-3 truncate max-w-[200px]">
                              {res.answersMap[f.id] || <span className="text-slate-300 dark:text-slate-600 italic">--</span>}
                            </td>
                          ))}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                disabled={isApproved || approvingId === res.id}
                                onClick={() => handleApproveInline(res)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                  isApproved
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 opacity-60 cursor-default'
                                    : 'bg-sky-500 hover:bg-sky-600 text-white shadow-2xs'
                                }`}
                                title={isApproved ? 'Đã duyệt ca viên' : 'Duyệt ca viên mới vào danh sách'}
                              >
                                {isApproved ? '✓ Đã duyệt' : approvingId === res.id ? '...' : '✨ Duyệt'}
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedResponse(res)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-colors"
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <span className="text-xs text-slate-400">
              Tổng cộng {responses.length} phản hồi
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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
        approvedIds={approvedIds}
        onApproveSuccess={handleApproveSuccess}
      />
    </>
  );
};
