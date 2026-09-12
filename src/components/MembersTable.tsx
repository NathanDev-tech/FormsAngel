import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Phone,
  Cake,
  Calendar,
  Users,
  Printer,
  Sparkles,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import { ChoirMember, SortField, SortOrder } from '../types.ts';
import { exportDecoratedExcel, formatDateVi, getBirthYear, compareVietnameseNames } from '../utils/csvExport.ts';
import { CATECHISM_CLASSES } from './RegistrationForm.tsx';

interface MembersTableProps {
  members: ChoirMember[];
  onEdit: (member: ChoirMember) => void;
  onDelete: (member: ChoirMember) => void;
  onAddNew: () => void;
  onPrint: () => void;
  onOpenImportModal?: () => void;
}

// Helper kiểm tra ca viên có sinh nhật trong tháng hiện tại không
export function isBirthdayThisMonth(dateStr: string): boolean {
  if (!dateStr) return false;
  const clean = dateStr.trim();
  const currentMonth = new Date().getMonth() + 1;

  // Định dạng DD/MM hoặc DD/MM/YYYY
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length >= 2) {
      const month = parseInt(parts[1], 10);
      return month === currentMonth;
    }
  }

  // Định dạng YYYY-MM-DD hoặc MM-DD
  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length === 3) {
      const month = parseInt(parts[1], 10);
      return month === currentMonth;
    }
    if (parts.length === 2) {
      const month = parseInt(parts[1], 10);
      return month === currentMonth;
    }
  }

  return false;
}

// Helper màu cho Lớp giáo lý
function getClassBadgeColor(className: string): string {
  if (!className) return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  const lower = className.toLowerCase();
  if (lower.includes('xưng tội')) {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
  if (lower.includes('thêm sức')) {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  }
  if (lower.includes('sống đạo')) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  }
  if (lower.includes('vào đời')) {
    return 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800';
  }
  return 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  onEdit,
  onDelete,
  onAddNew,
  onPrint,
  onOpenImportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [onlyBirthdayFilter, setOnlyBirthdayFilter] = useState(false);
  const [sortField, setSortField] = useState<SortField>('hoVaTen');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Danh sách các lớp duy nhất (bao gồm 4 lớp giáo lý mặc định: Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời)
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>(CATECHISM_CLASSES);
    members.forEach(m => {
      if (m.lop && m.lop.trim()) {
        set.add(m.lop.trim());
      }
    });
    return Array.from(set);
  }, [members]);

  // Xử lý đổi hướng hoặc cột sắp xếp
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Lọc và tìm kiếm theo tên hoặc lớp
  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return members.filter(member => {
      // 1. Lọc theo chuỗi tìm kiếm
      const matchSearch =
        !q ||
        (member.tenThanh && member.tenThanh.toLowerCase().includes(q)) ||
        (member.hoVaTen && member.hoVaTen.toLowerCase().includes(q)) ||
        (member.lop && member.lop.toLowerCase().includes(q)) ||
        (member.soDienThoai && member.soDienThoai.includes(q));

      if (!matchSearch) return false;

      // 2. Lọc theo nhóm lớp
      if (selectedClassFilter !== 'all' && member.lop !== selectedClassFilter) {
        return false;
      }

      // 3. Lọc theo sinh nhật tháng này
      if (onlyBirthdayFilter && !isBirthdayThisMonth(member.ngaySinh)) {
        return false;
      }

      return true;
    });
  }, [members, searchQuery, selectedClassFilter, onlyBirthdayFilter]);

  // Sắp xếp
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (sortField === 'hoVaTen') {
        const cmp = compareVietnameseNames(a.hoVaTen, b.hoVaTen);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB), 'vi', { numeric: true })
        : String(valB).localeCompare(String(valA), 'vi', { numeric: true });
    });
  }, [filteredMembers, sortField, sortOrder]);

  const currentMonthNum = new Date().getMonth() + 1;
  const currentMonthBirthdaysCount = useMemo(() => {
    return members.filter(m => isBirthdayThisMonth(m.ngaySinh)).length;
  }, [members]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner: Stats & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-sky-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Header & Total Count */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-serif">
                Danh Sách Toàn Bộ Thành Viên
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Tổng số: {members.length} ca viên
              </span>
              {filteredMembers.length !== members.length && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  (Đang hiển thị {filteredMembers.length})
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Add, Import CSV, Export List, Print */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="quick-add-member-btn"
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Ca Viên</span>
            </button>

            {/* Nút Import CSV mới */}
            <button
              type="button"
              id="import-csv-btn"
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/15 transition-all cursor-pointer"
              title="Import danh sách ca viên hàng loạt từ file CSV (.csv)"
            >
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
            </button>

            {/* Nút Xuất Danh Sách duy nhất trang trí chuẩn mẫu */}
            <button
              type="button"
              id="export-list-btn"
              onClick={() => exportDecoratedExcel(sortedMembers, 'GIÁO XỨ BẮC HÒA')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/15 transition-all cursor-pointer"
              title="Xuất file danh sách ca viên trang trí chuẩn mẫu Giáo Xứ Bắc Hòa mở bằng Excel/Sheets"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Danh Sách</span>
            </button>

            {/* Nút In ấn / Xuất PDF */}
            <button
              type="button"
              id="print-list-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              title="Xem bản in danh sách chính thức chuẩn A4 như văn bản thực tế"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Bản In / PDF</span>
            </button>
          </div>

        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Ô tìm kiếm nhanh theo tên hoặc lớp */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo Tên Thánh, Họ Tên hoặc Lớp..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Lớp Dropdown */}
            {uniqueClasses.length > 0 && (
              <select
                value={selectedClassFilter}
                onChange={e => setSelectedClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              >
                <option value="all">Tất cả các lớp</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>
                    Lớp: {cls}
                  </option>
                ))}
              </select>
            )}

            {/* Birthday Toggle Filter */}
            <button
              type="button"
              onClick={() => setOnlyBirthdayFilter(!onlyBirthdayFilter)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                onlyBirthdayFilter
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <Cake className="w-3.5 h-3.5 text-amber-500" />
              <span>Sinh nhật T.{currentMonthNum}</span>
              {currentMonthBirthdaysCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold">
                  {currentMonthBirthdaysCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-100/80 dark:border-slate-800 shadow-xl shadow-sky-900/5 overflow-hidden">
        
        {/* Desktop & Tablet Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                
                {/* 1. Tên Thánh */}
                <th
                  onClick={() => handleSort('tenThanh')}
                  className="py-3.5 px-4 cursor-pointer select-none group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>1. Tên Thánh</span>
                    {renderSortIcon('tenThanh')}
                  </div>
                </th>

                {/* 2. Họ và Tên */}
                <th
                  onClick={() => handleSort('hoVaTen')}
                  className="py-3.5 px-4 cursor-pointer select-none group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>2. Họ và Tên</span>
                    {renderSortIcon('hoVaTen')}
                  </div>
                </th>

                {/* 3. Ngày Sinh */}
                <th
                  onClick={() => handleSort('ngaySinh')}
                  className="py-3.5 px-3 cursor-pointer select-none group hover:text-slate-900 dark:hover:text-white transition-colors text-center w-28"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Ngày sinh</span>
                    {renderSortIcon('ngaySinh')}
                  </div>
                </th>

                {/* 4. Giọng / Lớp */}
                <th
                  onClick={() => handleSort('lop')}
                  className="py-3.5 px-4 cursor-pointer select-none group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Giọng/Lớp</span>
                    {renderSortIcon('lop')}
                  </div>
                </th>

                {/* 5. Số Điện Thoại */}
                <th
                  onClick={() => handleSort('soDienThoai')}
                  className="py-3.5 px-4 cursor-pointer select-none group hover:text-slate-900 dark:hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>SĐT</span>
                    {renderSortIcon('soDienThoai')}
                  </div>
                </th>

                {/* 6. Bổn phận */}
                <th className="py-3.5 px-3 text-center text-slate-500 dark:text-slate-400 w-24">
                  Bổn phận
                </th>

                {/* 7. Trạng thái */}
                <th className="py-3.5 px-3 text-center text-slate-500 dark:text-slate-400 w-24">
                  Trạng thái
                </th>

                {/* Thao Tác (Sửa / Xoá) */}
                <th className="py-3.5 px-4 text-center w-20">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {sortedMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-500 mx-auto flex items-center justify-center shadow-sm">
                        <Users className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 font-serif">
                        {members.length === 0 ? 'Danh sách ca đoàn chưa có thành viên' : 'Không tìm thấy kết quả phù hợp'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {members.length === 0
                          ? 'Dữ liệu mẫu đã được dọn sạch. Bạn có thể bắt đầu ghi danh các ca viên đầu tiên.'
                          : 'Hãy thử tìm kiếm với từ khoá khác hoặc xoá bộ lọc.'}
                      </p>
                      {members.length === 0 ? (
                        <button
                          type="button"
                          onClick={onAddNew}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Ghi danh ca viên mới</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedClassFilter('all');
                            setOnlyBirthdayFilter(false);
                          }}
                          className="mt-2 text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
                        >
                          Xoá bộ lọc tìm kiếm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sortedMembers.map((member, index) => {
                  const hasBirthday = isBirthdayThisMonth(member.ngaySinh);

                  return (
                    <tr
                      key={member.id}
                      className={`group transition-colors ${
                        hasBirthday
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/30'
                          : 'hover:bg-sky-50/40 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-400">
                        {index + 1}
                      </td>

                      {/* 1. Tên Thánh (Màu xanh dương đậm đặc trưng như mẫu) */}
                      <td className="py-3.5 px-4 font-bold text-blue-700 dark:text-blue-400">
                        {member.tenThanh || <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
                      </td>

                      {/* 2. Họ và Tên (In đậm) */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span>{member.hoVaTen || <span className="text-slate-300 dark:text-slate-600 italic">—</span>}</span>
                          {hasBirthday && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300/60 animate-bounce"
                              title={`Sinh nhật tháng ${currentMonthNum}!`}
                            >
                              🎂 Sinh nhật
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Ngày Sinh */}
                      <td className="py-3.5 px-3 text-center text-slate-700 dark:text-slate-300 font-mono text-xs">
                        {member.ngaySinh ? (
                          <span>{formatDateVi(member.ngaySinh)}</span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                        )}
                      </td>

                      {/* 4. Giọng / Lớp */}
                      <td className="py-3.5 px-4">
                        {member.lop ? (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border ${getClassBadgeColor(
                              member.lop
                            )}`}
                          >
                            {member.lop}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                        )}
                      </td>

                      {/* 5. Số Điện Thoại */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-300 text-center">
                        {member.soDienThoai ? (
                          <a
                            href={`tel:${member.soDienThoai}`}
                            className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline hover:text-sky-700"
                            title="Gọi điện trực tiếp"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.soDienThoai}</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                        )}
                      </td>

                      {/* 6. Bổn phận */}
                      <td className="py-3.5 px-3 text-center text-xs text-slate-700 dark:text-slate-300">
                        {member.bonPhan || 'Thành viên'}
                      </td>

                      {/* 7. Trạng thái (Huy hiệu xanh lá như mẫu) */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            (member.trangThai || 'Hoạt động') === 'Hoạt động'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : member.trangThai === 'Tạm nghỉ'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {member.trangThai || 'Hoạt động'}
                        </span>
                      </td>

                      {/* Thao Tác (Sửa / Xoá) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit(member)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(member)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            title="Xoá thành viên"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info in table */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>
            Hiển thị <strong>{sortedMembers.length}</strong> / <strong>{members.length}</strong> thành viên
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Đánh dấu sinh nhật trong tháng {currentMonthNum}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
