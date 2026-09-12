import React, { useState, useMemo } from 'react';
import { X, Printer, FileSpreadsheet, Edit3, Check } from 'lucide-react';
import { ChoirMember } from '../types.ts';
import { formatDateVi, getBirthYear, exportDecoratedExcel, compareVietnameseNames } from '../utils/csvExport.ts';

interface PrintViewProps {
  members: ChoirMember[];
  isOpen: boolean;
  onClose: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({ members, isOpen, onClose }) => {
  const [parishName, setParishName] = useState('GIÁO XỨ BẮC HÒA');
  const [isEditingParish, setIsEditingParish] = useState(false);

  // Tự động sắp xếp theo bảng chữ cái A-Z
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => compareVietnameseNames(a.hoVaTen, b.hoVaTen));
  }, [members]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const totalCount = sortedMembers.length;
  const activeCount = sortedMembers.filter(m => (m.trangThai || 'Hoạt động') === 'Hoạt động').length;
  const pauseCount = sortedMembers.filter(m => m.trangThai === 'Tạm nghỉ').length;
  const leaveCount = sortedMembers.filter(m => m.trangThai === 'Nghỉ hẳn').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-5xl w-full my-auto overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:rounded-none print:w-full">
        
        {/* Modal Controls (Ẩn hoàn toàn khi in/xuất PDF) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base font-serif">
                Danh Sách Chính Thức — Ca Đoàn Thiên Thần
              </h3>
              <p className="text-[11px] text-slate-500">
                Được định dạng trang trí chuẩn phụng vụ theo mẫu Giáo Xứ Bắc Hòa
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Nút Xuất Danh Sách Excel duy nhất */}
            <button
              type="button"
              onClick={() => exportDecoratedExcel(sortedMembers, parishName)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
              title="Xuất file Excel (.xls) có đầy đủ màu sắc, tiêu đề, viền khung như bản in"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Danh Sách Excel</span>
            </button>

            {/* Nút In Ngay / Lưu PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Lưu PDF</span>
            </button>

            {/* Đóng Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area — Format chuẩn mẫu thực tế */}
        <div className="p-4 sm:p-8 overflow-y-auto print:overflow-visible print:p-0 bg-white font-serif">
          
          {/* Top Gold Accent Bar */}
          <div className="w-full h-1 bg-amber-500 mb-4" />

          {/* Header Section */}
          <div className="text-center space-y-1 mb-3">
            <h1 className="text-lg sm:text-2xl font-bold tracking-wider text-[#002060] uppercase">
              ✦ BAN ĐIỀU HÀNH CA ĐOÀN THIÊN THẦN ✦
            </h1>
            
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-[#1e3a8a] tracking-wide uppercase">
                DANH SÁCH CA VIÊN — {parishName}
              </h2>
              {!isEditingParish ? (
                <button
                  type="button"
                  onClick={() => setIsEditingParish(true)}
                  className="text-slate-400 hover:text-sky-600 print:hidden p-0.5"
                  title="Đổi tên Giáo Xứ"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              ) : (
                <div className="inline-flex items-center gap-1 print:hidden">
                  <input
                    type="text"
                    value={parishName}
                    onChange={e => setParishName(e.target.value)}
                    className="px-2 py-0.5 text-xs border border-sky-400 rounded outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingParish(false)}
                    className="text-emerald-600 p-0.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Sub-bar with metadata */}
            <p className="text-[11px] sm:text-xs text-slate-500 italic pt-1">
              Ngày xuất: <span className="font-semibold text-slate-700">{todayStr}</span>
              {' • '}
              Tổng: <span className="font-semibold text-slate-700">{totalCount} ca viên</span>
              {' • '}
              Hoạt động: <span className="font-semibold text-emerald-600">{activeCount}</span>
              {' • '}
              Tạm nghỉ: <span className="font-semibold text-amber-600">{pauseCount}</span>
              {' • '}
              Nghỉ hẳn: <span className="font-semibold text-rose-600">{leaveCount}</span>
            </p>
          </div>

          {/* Roster Table matching the image */}
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left border border-slate-400 text-xs border-collapse font-serif">
              <thead>
                <tr className="bg-[#0f172a] text-white font-bold text-[11px] sm:text-xs">
                  <th className="py-2.5 px-2 border border-slate-400 w-10 text-center">STT</th>
                  <th className="py-2.5 px-2.5 border border-slate-400 w-24 text-center">Tên Thánh</th>
                  <th className="py-2.5 px-3 border border-slate-400">Họ và Tên</th>
                  <th className="py-2.5 px-2 border border-slate-400 w-16 text-center">Năm sinh</th>
                  <th className="py-2.5 px-2.5 border border-slate-400 w-24 text-center">SĐT</th>
                  <th className="py-2.5 px-3 border border-slate-400 w-28">Giọng/Lớp</th>
                  <th className="py-2.5 px-2.5 border border-slate-400 w-24 text-center">Bổn phận</th>
                  <th className="py-2.5 px-2.5 border border-slate-400 w-24 text-center">Trạng thái</th>
                  <th className="py-2.5 px-2.5 border border-slate-400 w-24 text-center">Ngày gia nhập</th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                      Chưa có dữ liệu ca viên trong danh sách
                    </td>
                  </tr>
                ) : (
                  sortedMembers.map((member, index) => {
                    const status = member.trangThai || 'Hoạt động';
                    const role = member.bonPhan || 'Ca Viên';
                    const birthYear = getBirthYear(member.ngaySinh);
                    const joinDate = member.createdAt ? formatDateVi(member.createdAt) : todayStr;

                    return (
                      <tr
                        key={member.id}
                        className={`border-b border-slate-300 ${
                          index % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
                        }`}
                      >
                        {/* STT */}
                        <td className="py-2 px-2 border-r border-slate-300 text-center font-sans text-slate-600">
                          {index + 1}
                        </td>

                        {/* Tên Thánh — Chữ xanh đặc trưng như mẫu */}
                        <td className="py-2 px-2.5 border-r border-slate-300 text-center font-bold text-blue-700">
                          {member.tenThanh || '—'}
                        </td>

                        {/* Họ và Tên — In đậm */}
                        <td className="py-2 px-3 border-r border-slate-300 font-bold text-slate-900">
                          {member.hoVaTen || '—'}
                        </td>

                        {/* Năm sinh */}
                        <td className="py-2 px-2 border-r border-slate-300 text-center font-sans text-slate-700">
                          {birthYear}
                        </td>

                        {/* SĐT */}
                        <td className="py-2 px-2.5 border-r border-slate-300 text-center font-sans text-slate-700">
                          {member.soDienThoai || '—'}
                        </td>

                        {/* Giọng / Lớp */}
                        <td className="py-2 px-3 border-r border-slate-300 text-slate-800">
                          {member.lop || '—'}
                        </td>

                        {/* Bổn phận */}
                        <td className="py-2 px-2.5 border-r border-slate-300 text-center text-slate-700">
                          {role}
                        </td>

                        {/* Trạng thái — Huy hiệu xanh lá */}
                        <td className="py-2 px-2.5 border-r border-slate-300 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              status === 'Hoạt động'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : status === 'Tạm nghỉ'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Ngày gia nhập */}
                        <td className="py-2 px-2.5 border-slate-300 text-center font-sans text-slate-600 text-[11px]">
                          {joinDate}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Gold Accent Bar */}
          <div className="w-full h-1 bg-amber-500 mt-2 mb-4" />

          {/* Summary Boxes at bottom matching sample */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mt-4 text-xs font-sans">
            {/* Box 1: Nghỉ hẳn & Tạm nghỉ */}
            <div className="border border-slate-300 bg-slate-50/80 rounded-lg p-2.5 min-w-[140px] space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between gap-4 text-slate-600 font-medium">
                <span>Nghỉ hẳn</span>
                <span className="font-bold text-rose-600 text-sm">{leaveCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-slate-600 font-medium">
                <span>Tạm nghỉ</span>
                <span className="font-bold text-amber-600 text-sm">{pauseCount}</span>
              </div>
            </div>

            {/* Box 2: Tổng ca viên & Hoạt động */}
            <div className="border border-slate-300 bg-slate-50/80 rounded-lg p-2.5 min-w-[140px] space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between gap-4 text-slate-600 font-medium">
                <span>Tổng ca viên</span>
                <span className="font-bold text-slate-900 text-sm">{totalCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-slate-600 font-medium">
                <span>Hoạt động</span>
                <span className="font-bold text-emerald-600 text-sm">{activeCount}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
