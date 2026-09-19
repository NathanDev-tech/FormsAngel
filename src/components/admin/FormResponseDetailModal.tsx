import React, { useState } from 'react';
import { X, Calendar, UserCheck, FileText, UserPlus, CheckCircle2 } from 'lucide-react';
import { FormField, FormResponseWithAnswers } from '../../types/forms.ts';
import { formatDateVi } from '../../utils/csvExport.ts';
import { addMember } from '../../lib/api.ts';
import { MemberFormData } from '../../types.ts';

interface FormResponseDetailModalProps {
  response: FormResponseWithAnswers | null;
  fields: FormField[];
  isOpen: boolean;
  onClose: () => void;
  approvedIds: string[];
  onApproveSuccess: (resId: string) => void;
}

// Helper phân tích dữ liệu trả lời thành MemberFormData
export function extractMemberDataFromAnswers(answersMap: Record<string, string>, fields: FormField[]): MemberFormData {
  let tenThanh = '';
  let hoVaTen = '';
  let ngaySinh = '';
  let lop = 'Xưng Tội';
  let soDienThoai = '';
  let bonPhan = 'Ca Viên';
  let ghiChu = 'Ghi danh qua Form công khai';

  fields.forEach(field => {
    const labelLower = field.label.toLowerCase();
    const val = (answersMap[field.id] || '').trim();

    if (labelLower.includes('thánh')) {
      tenThanh = val;
    } else if (labelLower.includes('họ') || labelLower.includes('tên')) {
      if (!hoVaTen) hoVaTen = val;
    } else if (labelLower.includes('sinh') || labelLower.includes('ngày')) {
      ngaySinh = val;
    } else if (labelLower.includes('lớp') || labelLower.includes('giáo lý')) {
      if (val) lop = val;
    } else if (labelLower.includes('điện thoại') || labelLower.includes('sđt') || field.field_type === 'phone') {
      soDienThoai = val;
    } else if (labelLower.includes('bổn phận') || labelLower.includes('vai trò')) {
      if (val) bonPhan = val;
    }
  });

  return {
    tenThanh,
    hoVaTen: hoVaTen || 'Ca viên mới',
    ngaySinh,
    lop,
    soDienThoai,
    bonPhan,
    trangThai: 'Hoạt động',
    ghiChu,
  };
}

export const FormResponseDetailModal: React.FC<FormResponseDetailModalProps> = ({
  response,
  fields,
  isOpen,
  onClose,
  approvedIds,
  onApproveSuccess,
}) => {
  const [approving, setApproving] = useState(false);

  if (!isOpen || !response) return null;

  const isApproved = approvedIds.includes(response.id);

  const handleApprove = async () => {
    if (isApproved) return;

    setApproving(true);
    try {
      const memberData = extractMemberDataFromAnswers(response.answersMap, fields);
      await addMember(memberData);
      onApproveSuccess(response.id);
    } catch (err) {
      console.error('Lỗi duyệt ca viên từ phản hồi:', err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Chi Tiết Phản Hồi
                </h3>
                {isApproved && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Đã duyệt</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Gửi lúc: {formatDateVi(response.created_at)}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Answers Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {fields.map(field => {
            const answerValue = response.answersMap[field.id] || '(Không điền)';
            return (
              <div key={field.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{field.label}</span>
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-pre-line pl-5">
                  {answerValue}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <button
            type="button"
            disabled={isApproved || approving}
            onClick={handleApprove}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isApproved
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-sky-500/20 active:scale-[0.98]'
            }`}
          >
            {isApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>✓ Đã Duyệt Vào Danh Sách</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{approving ? 'Đang duyệt...' : '✨ Duyệt Vào Danh Sách Ca Viên'}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
