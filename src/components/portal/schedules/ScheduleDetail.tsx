import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, Share2, Check } from 'lucide-react';
import { RehearsalSchedule } from '../../../types/schedules.ts';
import { getScheduleById } from '../../../lib/schedulesApi.ts';

export const ScheduleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState<RehearsalSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const item = await getScheduleById(id);
        setSchedule(item);
      } catch (err) {
        console.error('Lỗi khi tải thông tin lịch tập:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDateTime = (isoStart: string, isoEnd: string) => {
    try {
      const dStart = new Date(isoStart);
      const dEnd = new Date(isoEnd);

      const dateStr = dStart.toLocaleDateString('vi-VN', {
        weekday: 'long',
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-10 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Không tìm thấy lịch tập
        </h2>
        <p className="text-sm text-slate-500">Buổi tập hát này không tồn tại hoặc đã bị gỡ khỏi hệ thống.</p>
        <Link
          to="/portal/lich-tap"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách lịch tập</span>
        </Link>
      </div>
    );
  }

  const { dateStr, timeRange } = formatDateTime(schedule.start_at, schedule.end_at);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/portal/lich-tap')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:border-amber-400 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>Danh sách lịch tập</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-amber-300 hover:text-white text-xs font-bold transition-colors min-h-[44px]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Đã sao chép' : 'Chia sẻ lịch'}</span>
        </button>
      </div>

      {/* Main Schedule Info Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateStr}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {schedule.title}
          </h1>
        </div>

        {/* Time & Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Thời gian</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{timeRange}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Địa điểm tập</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{schedule.location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {schedule.description && (
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Nội dung buổi tập</span>
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line pl-6">
              {schedule.description}
            </p>
          </div>
        )}

        {/* Notes */}
        {schedule.notes && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1">
            <span className="font-bold block text-amber-600 dark:text-amber-400">📝 Ghi chú từ Ban Điều Hành:</span>
            <p>{schedule.notes}</p>
          </div>
        )}

      </div>

    </div>
  );
};
