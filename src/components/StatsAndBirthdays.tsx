import React from 'react';
import { Cake, Users, Award, Calendar, Music, Phone, Printer, BookOpen } from 'lucide-react';
import { ChoirMember } from '../types.ts';
import { isBirthdayThisMonth } from './MembersTable.tsx';
import { formatDateVi } from '../utils/csvExport.ts';
import { CATECHISM_CLASSES } from './RegistrationForm.tsx';

interface StatsAndBirthdaysProps {
  members: ChoirMember[];
  onSelectMemberForEdit: (member: ChoirMember) => void;
  onPrint: () => void;
}

export const StatsAndBirthdays: React.FC<StatsAndBirthdaysProps> = ({
  members,
  onSelectMemberForEdit,
  onPrint,
}) => {
  const currentMonth = new Date().getMonth() + 1;

  // Lọc danh sách sinh nhật trong tháng
  const birthdayMembers = members.filter(m => isBirthdayThisMonth(m.ngaySinh));

  // Thống kê thành viên theo 4 lớp giáo lý chính: Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời
  const classCounts: Record<string, number> = {};
  
  // Khởi tạo trước 4 lớp chính
  CATECHISM_CLASSES.forEach(c => {
    classCounts[c] = 0;
  });

  members.forEach(member => {
    const rawClass = member.lop?.trim();
    if (rawClass) {
      classCounts[rawClass] = (classCounts[rawClass] || 0) + 1;
    } else {
      classCounts['Chưa phân lớp'] = (classCounts['Chưa phân lớp'] || 0) + 1;
    }
  });

  const sortedClassStats: Array<{ className: string; count: number }> = Object.keys(classCounts)
    .map(className => ({ className, count: classCounts[className] }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Tổng số ca viên */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-sky-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng số ca viên</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5 font-serif">{members.length}</h3>
          </div>
        </div>

        {/* Card 2: Sinh nhật tháng này */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-amber-100 dark:border-amber-900/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sinh nhật tháng {currentMonth}</p>
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-serif">{birthdayMembers.length}</h3>
          </div>
        </div>

        {/* Card 3: 4 Lớp giáo lý */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-purple-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lớp Giáo Lý</p>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5 font-serif">4 Khối Lớp</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Phần 1: Thành viên có sinh nhật trong tháng */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif">
                  Sinh Nhật Tháng {currentMonth}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Gửi lời chúc mừng và hiệp ý cầu nguyện cho các ca viên
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              {birthdayMembers.length} ca viên
            </span>
          </div>

          {birthdayMembers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Tháng {currentMonth} hiện chưa có ca viên nào sinh nhật.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto pr-1">
              {birthdayMembers.map(member => (
                <div
                  key={member.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shadow-sm">
                      {member.hoVaTen ? member.hoVaTen.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        {member.tenThanh && (
                          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                            {member.tenThanh}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-serif">
                          {member.hoVaTen || 'Chưa cập nhật họ tên'}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {formatDateVi(member.ngaySinh)}
                        </span>
                        {member.lop && <span>• Lớp: {member.lop}</span>}
                      </div>
                    </div>
                  </div>

                  {member.soDienThoai && (
                    <a
                      href={`tel:${member.soDienThoai}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-800 transition-colors"
                      title="Gọi chúc mừng"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phần 2: Thống kê số lượng thành viên theo từng Lớp */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif">
                  Phân Bố Ca Viên Theo Lớp
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Khối lớp: Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {sortedClassStats.map(({ className, count }) => {
              const percentage = members.length > 0 ? Math.round((count / members.length) * 100) : 0;

              return (
                <div key={className} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="font-serif text-sm">{className}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {count} ca viên ({percentage}%)
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner in danh sách */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Cần bản in tổng hợp để dán bảng tin?</span>
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In danh sách A4</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
