import React, { useState, useEffect } from 'react';
import { Calendar, List, Search, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { RehearsalSchedule } from '../../../types/schedules.ts';
import { getSchedules, subscribeSchedulesRealtime } from '../../../lib/schedulesApi.ts';
import { ScheduleCard } from './ScheduleCard.tsx';
import { ScheduleCalendar } from './ScheduleCalendar.tsx';

export const ScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<RehearsalSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const loadSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Lỗi khi tải lịch tập:', err);
      setError('Không thể kết nối đến máy chủ dữ liệu lịch tập.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
    const unsub = subscribeSchedulesRealtime(() => {
      loadSchedules();
    });
    return () => unsub();
  }, []);

  const filteredSchedules = schedules.filter((s) => {
    return (
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">

      {/* Header Banner - Centered */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border border-slate-800 border-amber-500/20 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full space-y-3 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Lịch Tập Hát Ca Đoàn</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Lịch Tập Hát Định Kỳ
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Cập nhật chi tiết các buổi tập hát chung, phụng vụ Thánh lễ.
          </p>
        </div>
      </div>

      {/* Controls & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

        {/* Toggle View Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${viewMode === 'list'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
          >
            <List className="w-4 h-4" />
            <span>Danh sách</span>
          </button>

          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${viewMode === 'calendar'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch tháng</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lịch tập, địa điểm..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
        </div>

      </div>

      {/* Main View Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex flex-col items-center text-center space-y-3">
          <AlertCircle className="w-10 h-10" />
          <p className="font-semibold text-sm">{error}</p>
          <button
            onClick={loadSchedules}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : viewMode === 'calendar' ? (
        <ScheduleCalendar schedules={filteredSchedules} />
      ) : filteredSchedules.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Chưa có lịch tập hát nào</h3>
          <p className="text-sm text-slate-500">Vui lòng quay lại sau để cập nhật lịch tập mới nhất.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}

    </div>
  );
};
