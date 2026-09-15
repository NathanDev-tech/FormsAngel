import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Phone,
  Users,
  Sparkles,
  Plus,
  Upload,
} from 'lucide-react';
import { ChoirMember, SortField, SortOrder } from '../types.ts';
import { formatDateVi, compareVietnameseNames } from '../utils/csvExport.ts';
import { CATECHISM_CLASSES } from './RegistrationForm.tsx';

interface MembersTableProps {
  members: ChoirMember[];
  onEdit: (member: ChoirMember) => void;
  onDelete: (member: ChoirMember) => void;
  onAddNew: () => void;
  onOpenImportModal?: () => void;
}

// Helper màu cho Lớp giáo lý chuẩn theo quy định:
// - Xưng Tội: Xanh lá (Emerald/Green)
// - Thêm Sức: Xanh nước biển (Blue)
// - Sống Đạo: Màu vàng (Amber/Yellow)
// - Vào Đời: Màu nâu (Brown)
// - GiLV/Dự Trưởng: Màu đỏ (Red/Rose)
export function getClassBadgeColor(className: string): string {
  if (!className) return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  const lower = className.toLowerCase();

  // 1. GiLV/Dự Trưởng -> Màu đỏ (Red)
  if (lower.includes('giáo lý') || lower.includes('dự trưởng') || lower.includes('glv') || lower.includes('glv')) {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold';
  }
  // 2. Xưng Tội -> Màu xanh lá (Green)
  if (lower.includes('xưng tội')) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold';
  }
  // 3. Thêm Sức -> Màu xanh nước biển (Blue)
  if (lower.includes('thêm sức')) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-bold';
  }
  // 4. Sống Đạo -> Màu vàng (Amber/Yellow)
  if (lower.includes('sống đạo')) {
    return 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold';
  }
  // 5. Vào Đời -> Màu nâu (Brown)
  if (lower.includes('vào đời')) {
    return 'bg-amber-950/15 text-amber-950 dark:bg-amber-950/60 dark:text-amber-200 border-amber-900/30 dark:border-amber-800 font-bold';
  }

  return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800 font-bold';
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  onEdit,
  onDelete,
  onAddNew,
  onOpenImportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('hoVaTen');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Danh sách 6 nhóm lớp chính chuẩn định sẵn (Không tự ý thêm đuôi 1A 2A)
  const baseClasses = CATECHISM_CLASSES;

  // Xử lý đổi hướng hoặc cột sắp xếp
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Lọc và tìm kiếm theo tên hoặc lớp (Khớp tất cả các lớp mở rộng như "Sống Đạo 1A", "Sống Đạo 2"...)
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

      // 2. Lọc theo nhóm lớp chuẩn (Khớp mờ để Sống Đạo tìm được cả Sống Đạo 1A, Sống Đạo 2...)
      if (selectedClassFilter !== 'all') {
        if (!member.lop || !member.lop.toLowerCase().includes(selectedClassFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [members, searchQuery, selectedClassFilter]);

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

      {/* Top Banner: Header & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-sky-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Header & Total Count */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Giáo Hạt Phú Thịnh · Giáo Xứ Bắc Hòa — Ca Đoàn Thiên Thần</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-serif">
                Danh Sách Toàn Bộ Ca Viên
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

          {/* Action Buttons: Thêm Ca Viên & Import CSV (Đã bỏ Xuất Excel & Bản In trùng lặp) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            <button
              type="button"
              id="quick-add-member-btn"
              onClick={onAddNew}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Thêm Ca Viên</span>
            </button>

            <button
              type="button"
              id="import-csv-btn"
              onClick={onOpenImportModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/15 transition-all cursor-pointer w-full sm:w-auto"
              title="Import danh sách ca viên hàng loạt từ file CSV (.csv)"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>Import CSV</span>
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

          {/* Filter Lớp Dropdown Chuẩn (Chỉ các lớp cơ bản, không có đuôi 1A 2A) */}
          <div className="flex items-center gap-2">
            <select
              value={selectedClassFilter}
              onChange={e => setSelectedClassFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            >
              <option value="all">Tất cả các lớp</option>
              {baseClasses.map(cls => (
                <option key={cls} value={cls}>
                  Lớp: {cls}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-100/80 dark:border-slate-800 shadow-xl shadow-sky-900/5 overflow-hidden">

        {/* Mobile Card List View (dành cho điện thoại di động màn hình nhỏ < 768px) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          {sortedMembers.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="max-w-xs mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-500 mx-auto flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 font-serif">
                  {members.length === 0 ? 'Danh sách ca đoàn chưa có ca viên' : 'Không tìm thấy kết quả phù hợp'}
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold shadow-sm cursor-pointer"
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
                    }}
                    className="mt-2 text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
                  >
                    Xoá bộ lọc tìm kiếm
                  </button>
                )}
              </div>
            </div>
          ) : (
            sortedMembers.map((member, index) => {
              return (
                <div
                  key={member.id}
                  className="p-4 space-y-3 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  {/* Card Header: STT, Tên Thánh, Họ Tên, Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {member.tenThanh && (
                            <span className="font-bold text-blue-700 dark:text-blue-400 text-sm">
                              {member.tenThanh}
                            </span>
                          )}
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {member.hoVaTen || 'Chưa cập nhật tên'}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-bold ${(member.trangThai || 'Hoạt động') === 'Hoạt động'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : member.trangThai === 'Tạm nghỉ'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                    >
                      {member.trangThai || 'Hoạt động'}
                    </span>
                  </div>

                  {/* Info details grid inside Card */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Lớp:</span>
                      {member.lop ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getClassBadgeColor(member.lop)}`}>
                          {member.lop}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Ngày sinh:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {member.ngaySinh ? formatDateVi(member.ngaySinh) : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Bổn phận:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {member.bonPhan || 'Ca Viên'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Số điện thoại:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {member.soDienThoai || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Actions bar inside Mobile Card */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    {member.soDienThoai ? (
                      <a
                        href={`tel:${member.soDienThoai}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/60 dark:border-sky-800/80 active:scale-95 transition-transform"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>Gọi điện</span>
                      </a>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(member)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(member)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-medium hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Xoá</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Desktop & Tablet Table View */}
        <div className="hidden md:block overflow-x-auto">
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

                {/* 4. Lớp */}
                <th
                  onClick={() => handleSort('lop')}
                  className="py-3.5 px-4 cursor-pointer select-none group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Lớp</span>
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
                        {members.length === 0 ? 'Danh sách ca đoàn chưa có ca viên' : 'Không tìm thấy kết quả phù hợp'}
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
                  return (
                    <tr
                      key={member.id}
                      className="group transition-colors hover:bg-sky-50/40 dark:hover:bg-slate-800/50"
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-400">
                        {index + 1}
                      </td>

                      {/* 1. Tên Thánh */}
                      <td className="py-3.5 px-4 font-bold text-blue-700 dark:text-blue-400">
                        {member.tenThanh || <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
                      </td>

                      {/* 2. Họ và Tên */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {member.hoVaTen || <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
                      </td>

                      {/* 3. Ngày Sinh */}
                      <td className="py-3.5 px-3 text-center text-slate-700 dark:text-slate-300 font-mono text-xs">
                        {member.ngaySinh ? (
                          <span>{formatDateVi(member.ngaySinh)}</span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                        )}
                      </td>

                      {/* 4. Lớp */}
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
                        {member.bonPhan || 'Ca Viên'}
                      </td>

                      {/* 7. Trạng thái */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${(member.trangThai || 'Hoạt động') === 'Hoạt động'
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
                            title="Xoá ca viên"
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
            Hiển thị <strong>{sortedMembers.length}</strong> / <strong>{members.length}</strong> ca viên
          </span>
        </div>

      </div>
    </div>
  );
};
