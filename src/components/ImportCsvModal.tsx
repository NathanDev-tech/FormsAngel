import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Loader2,
  Check,
  Info,
} from 'lucide-react';
import { MemberFormData } from '../types.ts';
import {
  parseCsvContent,
  downloadSampleCsvTemplate,
  ParsedCsvMemberRow,
} from '../utils/csvExport.ts';
import { getClassBadgeColor } from './MembersTable.tsx';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (members: MemberFormData[]) => Promise<boolean>;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedCsvMemberRow[]>([]);
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setParseError('Vui lòng chọn file có định dạng .csv');
      return;
    }

    setParseError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCsvContent(text);
        
        if (rows.length === 0) {
          setParseError('File CSV không chứa dữ liệu ca viên hợp lệ nào.');
          setParsedRows([]);
          setSelectedRowIndices(new Set());
          return;
        }

        setParsedRows(rows);
        
        // Mặc định chọn tất cả các dòng hợp lệ
        const validIndices = new Set<number>();
        rows.forEach((r, idx) => {
          if (r.isValid) validIndices.add(idx);
        });
        setSelectedRowIndices(validIndices);
      } catch (err) {
        console.error('Lỗi đọc file CSV:', err);
        setParseError('Không thể phân tích file CSV. Vui lòng kiểm tra lại định dạng file.');
      }
    };
    reader.onerror = () => {
      setParseError('Đã xảy ra lỗi khi đọc file từ thiết bị.');
    };
    reader.readAsText(selectedFile, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const toggleSelectAll = () => {
    const validCount = parsedRows.filter(r => r.isValid).length;
    if (selectedRowIndices.size === validCount && validCount > 0) {
      setSelectedRowIndices(new Set());
    } else {
      const validIndices = new Set<number>();
      parsedRows.forEach((r, idx) => {
        if (r.isValid) validIndices.add(idx);
      });
      setSelectedRowIndices(validIndices);
    }
  };

  const toggleRow = (index: number) => {
    if (!parsedRows[index].isValid) return; // Không chọn dòng lỗi
    const next = new Set(selectedRowIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedRowIndices(next);
  };

  const handleConfirmImport = async () => {
    if (selectedRowIndices.size === 0) return;
    setIsImporting(true);

    const membersToImport: MemberFormData[] = [];
    selectedRowIndices.forEach(idx => {
      const row = parsedRows[idx];
      if (row && row.isValid) {
        membersToImport.push(row.data);
      }
    });

    const success = await onImport(membersToImport);
    setIsImporting(false);

    if (success) {
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedRows([]);
    setSelectedRowIndices(new Set());
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validRowsCount = parsedRows.filter(r => r.isValid).length;
  const invalidRowsCount = parsedRows.filter(r => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-sky-100 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif">
                Import Danh Sách Ca Viên Từ CSV
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tải lên file danh sách dạng CSV (.csv) để thêm nhanh hàng loạt ca viên
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!file ? (
            /* Upload Zone */
            <div className="space-y-4">
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 scale-[0.99]'
                    : 'border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv, text/csv"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>

                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Kéo thả file CSV vào đây hoặc click để chọn file
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                  Hệ thống hỗ trợ file .csv UTF-8 xuất từ Excel, Google Sheets có chứa Tên Thánh, Họ và Tên, Ngày sinh, SĐT, Lớp...
                </p>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Chọn File Từ Máy Tính</span>
                </button>
              </div>

              {/* Sample Template Download Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Chưa có mẫu file CSV chuẩn?
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tải mẫu file CSV đã tạo sẵn cấu hình bảng tiếng ViệtUTF-8 để điền dữ liệu đúng định dạng.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadSampleCsvTemplate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition-all whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải CSV Mẫu (.csv)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Preview Table & Rows */
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-50/80 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {file.name}
                    </span>
                    <span className="ml-2 text-[11px] text-slate-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadSampleCsvTemplate}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors border border-slate-200 dark:border-slate-600"
                    title="Tải mẫu CSV"
                  >
                    <Download className="w-3 h-3 text-amber-500" />
                    <span>File mẫu</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span>Chọn file khác</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validRowsCount} ca viên hợp lệ
                  </span>
                  {invalidRowsCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {invalidRowsCount} dòng bị lỗi/bỏ qua
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  {selectedRowIndices.size === validRowsCount ? 'Bỏ chọn tất cả' : 'Chọn tất cả hợp lệ'}
                </button>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRowIndices.size === validRowsCount && validRowsCount > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                        />
                      </th>
                      <th className="p-3 w-12 text-center">STT</th>
                      <th className="p-3">Tên Thánh</th>
                      <th className="p-3">Họ và Tên</th>
                      <th className="p-3">Ngày Sinh</th>
                      <th className="p-3">SĐT</th>
                      <th className="p-3">Lớp</th>
                      <th className="p-3">Bổn phận</th>
                      <th className="p-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedRows.map((row, idx) => {
                      const isSelected = selectedRowIndices.has(idx);

                      return (
                        <tr
                          key={idx}
                          onClick={() => toggleRow(idx)}
                          className={`transition-colors ${
                            !row.isValid
                              ? 'bg-rose-50/50 dark:bg-rose-950/20 opacity-60'
                              : isSelected
                              ? 'bg-sky-50/60 dark:bg-sky-950/40'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          } ${row.isValid ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                          <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={!row.isValid}
                              onChange={() => toggleRow(idx)}
                              className="rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                            />
                          </td>
                          <td className="p-3 text-center font-mono text-slate-400">
                            {row.rowNumber}
                          </td>
                          <td className="p-3 font-semibold text-blue-700 dark:text-blue-400">
                            {row.data.tenThanh || '—'}
                          </td>
                          <td className="p-3 font-bold text-slate-800 dark:text-slate-100">
                            {row.data.hoVaTen || (
                              <span className="text-rose-500 italic">(Thiếu Tên)</span>
                            )}
                          </td>
                          <td className="p-3 font-mono">{row.data.ngaySinh || '—'}</td>
                          <td className="p-3 font-mono">{row.data.soDienThoai || '—'}</td>
                          <td className="p-3">
                            {row.data.lop ? (
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${getClassBadgeColor(row.data.lop)}`}>
                                {row.data.lop}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-3">{row.data.bonPhan || 'Ca Viên'}</td>
                          <td className="p-3">
                            {row.isValid ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {row.data.trangThai}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                {row.errorReason}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error display */}
          {parseError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{parseError}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Hủy Bỏ
          </button>

          {file && (
            <button
              type="button"
              disabled={selectedRowIndices.size === 0 || isImporting}
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang nhập dữ liệu...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận Import ({selectedRowIndices.size} Ca Viên)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
