import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { RehearsalSchedule } from '../../../types/schedules.ts';
import { Link } from 'react-router-dom';

interface ScheduleCalendarProps {
  schedules: RehearsalSchedule[];
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ schedules }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Helper find schedules on day N
  const getSchedulesForDay = (day: number) => {
    return schedules.filter((s) => {
      try {
        const d = new Date(s.start_at);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
      } catch {
        return false;
      }
    });
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
            {monthNames[month]} - {year}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-400 hover:text-slate-950 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-amber-400 hover:text-slate-950 transition-colors"
          >
            Hôm nay
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-400 hover:text-slate-950 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of Week Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-rose-500">CN</span>
        <span>T2</span>
        <span>T3</span>
        <span>T4</span>
        <span>T5</span>
        <span>T6</span>
        <span>T7</span>
      </div>

      {/* Grid Cells */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {blankCells.map((_, idx) => (
          <div key={`blank-${idx}`} className="h-24 sm:h-28 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 opacity-40" />
        ))}

        {daysArray.map((day) => {
          const daySchedules = getSchedulesForDay(day);
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          return (
            <div
              key={day}
              className={`h-24 sm:h-28 rounded-xl p-1.5 sm:p-2 border transition-all flex flex-col justify-between overflow-hidden ${
                isToday
                  ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20'
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${
                  isToday
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {day}
                </span>
                {daySchedules.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>

              {/* Day Schedules List */}
              <div className="space-y-1 overflow-y-auto no-scrollbar">
                {daySchedules.map((s) => (
                  <Link
                    key={s.id}
                    to={`/lich-tap/${s.id}`}
                    className="block p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-semibold text-amber-700 dark:text-amber-300 truncate transition-colors"
                    title={s.title}
                  >
                    🎼 {s.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
