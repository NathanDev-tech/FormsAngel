import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { RehearsalSchedule } from '../../../types/schedules.ts';

interface ScheduleCardProps {
  schedule: RehearsalSchedule;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  const formatDateTime = (isoStart: string, isoEnd: string) => {
    try {
      const dStart = new Date(isoStart);
      const dEnd = new Date(isoEnd);

      const dateStr = dStart.toLocaleDateString('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const startTime = dStart.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const endTime = dEnd.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      return { dateStr, timeRange: `${startTime} – ${endTime}` };
    } catch {
      return { dateStr: isoStart, timeRange: '' };
    }
  };

  const { dateStr, timeRange } = formatDateTime(schedule.start_at, schedule.end_at);

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-200 rounded-2xl p-4 shadow-sm hover:shadow-md flex flex-col justify-between text-left space-y-3 h-full">
      
      <div className="space-y-2 text-left">
        {/* Top Header: Icon Box */}
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0 mb-1">
          <Calendar className="w-5 h-5" />
        </div>

        {/* Date & Status Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-left">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {dateStr}
          </span>

          {schedule.status === 'cancelled' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
              Đã Hủy
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug text-left">
          <Link to={`/portal/lich-tap/${schedule.id}`}>
            {schedule.title}
          </Link>
        </h3>

        {/* Time & Location */}
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium text-left">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{timeRange}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">{schedule.location}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium text-left">
        <span className="text-xs text-slate-400">Lịch tập</span>
        <Link
          to={`/portal/lich-tap/${schedule.id}`}
          className="inline-flex items-center gap-1 font-bold text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors ml-auto"
        >
          <span>Xem</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};



