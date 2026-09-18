import React, { useState, useMemo } from 'react';
import { Users, BookOpen, ShieldCheck, Activity, Printer, Sparkles, UserCheck, PauseCircle, UserX, Music, ChevronRight } from 'lucide-react';
import { ChoirMember } from '../types.ts';
import { CATECHISM_CLASSES } from './RegistrationForm.tsx';
import { getClassBadgeColor } from './MembersTable.tsx';
import { MEMBER_ROLES } from './EditMemberModal.tsx';

interface StatsProps {
  members: ChoirMember[];
  onSelectMemberForEdit: (member: ChoirMember) => void;
  onPrint: () => void;
}

export const StatsAndBirthdays: React.FC<StatsProps> = ({
  members,
  onSelectMemberForEdit,
  onPrint,
}) => {
  const [selectedClassTab, setSelectedClassTab] = useState<string>('all');

  // 1. Thống kê theo Trạng Thái (Hoạt động / Tạm nghỉ / Nghỉ hẳn)
  const activeMembers = useMemo(() => members.filter(m => (m.trangThai || 'Hoạt động') === 'Hoạt động'), [members]);
  const pausedMembers = useMemo(() => members.filter(m => m.trangThai === 'Tạm nghỉ'), [members]);
  const leftMembers = useMemo(() => members.filter(m => m.trangThai === 'Nghỉ hẳn'), [members]);

  const activePercent = members.length > 0 ? Math.round((activeMembers.length / members.length) * 100) : 0;
  const pausedPercent = members.length > 0 ? Math.round((pausedMembers.length / members.length) * 100) : 0;
  const leftPercent = members.length > 0 ? Math.round((leftMembers.length / members.length) * 100) : 0;

  // 2. Thống kê theo Lớp Giáo Lý (Gom nhóm theo 6 khối lớp chuẩn)
  const classCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATECHISM_CLASSES.forEach(c => {
      counts[c] = 0;
    });
    counts['Chưa phân lớp'] = 0;

    members.forEach(member => {
      const raw = (member.lop || '').trim();
      if (!raw) {
        counts['Chưa phân lớp']++;
        return;
      }
      const matched = CATECHISM_CLASSES.find(c => raw.toLowerCase().includes(c.toLowerCase()));
      if (matched) {
        counts[matched]++;
      } else {
        counts['Chưa phân lớp']++;
      }
    });

    return Object.keys(counts)
      .map(className => ({ className, count: counts[className] }))
      .sort((a, b) => b.count - a.count);
  }, [members]);

  // 3. Thống kê theo Bổn phận / Chức vụ
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MEMBER_ROLES.forEach(r => {
      counts[r] = 0;
    });

    members.forEach(member => {
      const role = member.bonPhan || 'Ca Viên';
      counts[role] = (counts[role] || 0) + 1;
    });

    return Object.keys(counts)
      .map(roleName => ({ roleName, count: counts[roleName] }))
      .sort((a, b) => b.count - a.count);
  }, [members]);

  // Lọc ca viên theo Lớp chọn (Khớp cả lớp mở rộng như "Sống Đạo 1A", "Sống Đạo 2"...)
  const filteredByClass = useMemo(() => {
    if (selectedClassTab === 'all') return members;
    if (selectedClassTab === 'Chưa phân lớp') {
      return members.filter(m => {
        const raw = (m.lop || '').trim();
        return !raw || !CATECHISM_CLASSES.some(c => raw.toLowerCase().includes(c.toLowerCase()));
      });
    }
    return members.filter(m => (m.lop || '').toLowerCase().includes(selectedClassTab.toLowerCase()));
  }, [members, selectedClassTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Overview Top Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Thống Kê Tổng Quan & Phân Bố Ca Viên</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-serif">
            Báo Cáo Chi Tiết Ca Đoàn Thiên Thần
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Phân tích số liệu ca viên theo Trạng thái hoạt động, Khối Lớp Giáo Lý và Bổn Phận phụng sự.
          </p>
        </div>

        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>In Báo Cáo A4 / Xuất PDF</span>
        </button>
      </div>

      {/* Overview 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Card 1: Tổng Ca Viên */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-sky-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng Ca Viên</p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mt-0.5 font-serif">
              {members.length}
            </h3>
          </div>
        </div>

        {/* Card 2: Đang Hoạt Động */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-emerald-100 dark:border-emerald-950 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Đang Hoạt Động</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">
                {activeMembers.length}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                ({activePercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Tạm Nghỉ */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-amber-100 dark:border-amber-950 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <PauseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Tạm Nghỉ</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 font-serif">
                {pausedMembers.length}
              </h3>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                ({pausedPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Nghỉ Hẳn */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-rose-100 dark:border-rose-950 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Nghỉ Hẳn</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <h3 className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 font-serif">
                {leftMembers.length}
              </h3>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                ({leftPercent}%)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Status & Class Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Block 1: Phân Bố Theo Trạng Thái & Bổn Phận */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif">
                Trạng Thái & Bổn Phận Ca Viên
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tỷ lệ hoạt động và danh sách bổn phận phụng sự
              </p>
            </div>
          </div>

          {/* Visual Status Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Biểu đồ trạng thái ca viên</span>
              <span className="text-slate-500 font-mono">{members.length} ca viên</span>
            </div>

            <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex p-0.5 gap-0.5">
              <div
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                style={{ width: `${activePercent}%` }}
                title={`Đang hoạt động: ${activeMembers.length} (${activePercent}%)`}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${pausedPercent}%` }}
                title={`Tạm nghỉ: ${pausedMembers.length} (${pausedPercent}%)`}
              />
              <div
                className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
                style={{ width: `${leftPercent}%` }}
                title={`Nghỉ hẳn: ${leftMembers.length} (${leftPercent}%)`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Hoạt động: {activeMembers.length}
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Tạm nghỉ: {pausedMembers.length}
              </span>
              <span className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Nghỉ hẳn: {leftMembers.length}
              </span>
            </div>
          </div>

          {/* Bổn phận Sub-section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-serif">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Phân Bố Theo Bổn Phận / Chức Vụ</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {roleCounts.map(({ roleName, count }) => (
                <div
                  key={roleName}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{roleName}</p>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100 font-serif mt-0.5">
                      {count} <span className="text-[10px] font-normal text-slate-400">ca viên</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Block 2: Phân Bố Theo Lớp Giáo Lý */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif">
                  Phân Bố Ca Viên Theo Lớp
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Khối Lớp Giáo Lý (Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời...)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {classCounts.map(({ className, count }) => {
              const percentage = members.length > 0 ? Math.round((count / members.length) * 100) : 0;

              return (
                <div key={className} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="font-serif text-sm font-bold flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${getClassBadgeColor(className)}`}>
                        {className}
                      </span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">
                      <strong>{count}</strong> ca viên ({percentage}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Block 3: Xem Danh Sách Nhanh Theo Lớp */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>Xem Nhanh Danh Sách Ca Viên Theo Lớp</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn nhóm lớp bên dưới để lọc nhanh danh sách ca viên
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedClassTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
                selectedClassTab === 'all'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Tất cả ({members.length})
            </button>
            {classCounts.map(({ className, count }) => (
              <button
                key={className}
                type="button"
                onClick={() => setSelectedClassTab(className)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
                  selectedClassTab === className
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {className} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Quick List Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredByClass.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-400 text-xs italic">
              Không có ca viên nào thuộc nhóm lớp này.
            </div>
          ) : (
            filteredByClass.map(member => (
              <div
                key={member.id}
                onClick={() => onSelectMemberForEdit(member)}
                className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-sky-50/60 dark:hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    {member.tenThanh && (
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400 shrink-0">
                        {member.tenThanh}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-serif truncate">
                      {member.hoVaTen || 'Chưa cập nhật tên'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    {member.lop && (
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${getClassBadgeColor(member.lop)}`}>
                        {member.lop}
                      </span>
                    )}
                    <span>• {member.bonPhan || 'Ca Viên'}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
