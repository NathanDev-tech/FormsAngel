import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Music,
  Bell,
  Calendar,
  Church,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Megaphone,
  UserPlus,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Announcement } from '../../types/announcements.ts';
import { getAnnouncements } from '../../lib/announcementsApi.ts';
import { RehearsalSchedule } from '../../types/schedules.ts';
import { getSchedules } from '../../lib/schedulesApi.ts';

const formatDateSafe = (val: any) => {
  if (!val) return '';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN');
  } catch {
    return '';
  }
};

const formatTimeSafe = (val: any) => {
  if (!val) return '';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export const PortalHome: React.FC = () => {
  const [heroAnnouncement, setHeroAnnouncement] = useState<Announcement | null>(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [schedules, setSchedules] = useState<RehearsalSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await getAnnouncements();
        setRecentAnnouncements(list.slice(0, 4));
        const importantOrPinned = list.find((a) => a.is_important || a.is_pinned) || list[0] || null;
        setHeroAnnouncement(importantOrPinned);

        const schedList = await getSchedules();
        setSchedules(schedList.slice(0, 4));
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu Cổng Thông Tin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in text-center max-w-5xl mx-auto">

      {/* 1. CENTERED COMPACT HERO BANNER FOR PORTAL (NO BOTTOM BUTTONS) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/50 border border-amber-500/30 rounded-2xl p-5 sm:p-6 text-white shadow-xl overflow-hidden text-center">
        {/* Ambient Glowing Halos */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full space-y-3 text-center flex flex-col items-center">

          {/* Catholic Choir Emblem Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>CA ĐOÀN THIÊN THẦN — GIÁO XỨ BẮC HÒA</span>
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          </div>

          {heroAnnouncement ? (
            <div className="space-y-2 max-w-2xl mx-auto">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-serif">
                {heroAnnouncement.title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                {heroAnnouncement.excerpt}
              </p>

              <div className="pt-1 flex items-center justify-center">
                <Link
                  to={`/portal/thong-bao/${heroAnnouncement.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <span>Xem Chi Tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-w-2xl mx-auto py-1">
              <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-block shadow-md">
                <Church className="w-6 h-6 mx-auto" />
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif leading-tight">
                Cổng Thông Tin Ca Đoàn Thiên Thần
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                Nơi cập nhật thông báo, lịch Phụng Vụ và đăng ký thành viên mới tại Giáo Xứ Bắc Hòa.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 2. CENTERED PORTAL GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">

        {/* LEFT MAIN COLUMN: ANNOUNCEMENTS & REHEARSALS */}
        <div className="lg:col-span-8 space-y-5">

          {/* Latest Announcements Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-serif">
                    Thông Báo Mới Nhất
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Tin tức & hướng dẫn từ Ban Điều Hành Ca Đoàn</p>
                </div>
              </div>

              <Link
                to="/portal/thong-bao"
                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="py-6 text-center text-slate-400 text-xs">Đang tải thông báo...</div>
            ) : recentAnnouncements.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs space-y-1.5">
                <Bell className="w-7 h-7 text-amber-400/60 mx-auto" />
                <p className="font-semibold">Chưa có thông báo nào được đăng.</p>
                <p className="text-[11px] text-slate-400">Vui lòng đăng nhập trang Admin để tạo bài viết mới.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {recentAnnouncements.map((item) => (
                  <Link
                    key={item.id}
                    to={`/portal/thong-bao/${item.slug}`}
                    className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:border-amber-400/60 hover:shadow-sm transition-all space-y-1.5 group text-left flex flex-col justify-between h-full"
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-300 dark:border-amber-800">
                          {item.category || 'Thông Báo'}
                        </span>
                        <span className="text-[10px]">{formatDateSafe(item.published_at)}</span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2 font-serif text-left leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 text-left leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="pt-1.5 flex items-center justify-end text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Đọc tiếp &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Rehearsal Schedule Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-serif">
                    Lịch Tập Hát Ca Đoàn
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Chuẩn bị bài hát cho các Thánh Lễ</p>
                </div>
              </div>
              <Link
                to="/portal/lich-tap"
                className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800/60"
              >
                <span>Xem lịch tập</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {schedules.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {schedules.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5 text-left flex flex-col justify-between h-full">
                    <div className="space-y-1 text-left">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 inline-block">
                        🎼 Lịch Tập Hát
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-serif text-left leading-snug">{s.title}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 text-left pt-0.5">
                        <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{formatDateSafe(s.start_at)} ({formatTimeSafe(s.start_at)})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 text-left">
                        <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                        <span className="truncate">{s.location || 'Nhà Thờ Bắc Hòa'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs space-y-1.5">
                <Calendar className="w-7 h-7 text-sky-400/60 mx-auto" />
                <p className="font-semibold">Chưa có lịch tập hát nào được tạo.</p>
                <p className="text-[11px] text-slate-400">Ban Điều Hành Ca Đoàn sẽ cập nhật lịch tập sắp tới sớm nhất.</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: LITURGY, REGISTRATION CARD & GUIDELINES */}
        <div className="lg:col-span-4 space-y-5">

          {/* Liturgical Service Shortcut */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Church className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif">Lịch Phục Vụ Phụng Vụ</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Danh sách bài hát Thánh Lễ</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Theo dõi danh mục bài hát Nhập Lễ, Đáp Ca, Dâng Lễ, Hiệp Lễ và Kết Lễ dành cho các buổi lễ sắp tới.
            </p>

            <Link
              to="/portal/lich-phuc-vu"
              className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white font-bold text-xs hover:from-indigo-800 hover:to-slate-800 transition-all shadow-sm group border border-indigo-700/50"
            >
              <span>Xem Lịch Phụng Vụ Chi Tiết</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* In-Portal Registration Card */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 rounded-2xl p-5 text-slate-950 space-y-3 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 relative z-10">
              <div className="p-1.5 rounded-lg bg-slate-950 text-amber-400 shadow-md">
                <UserPlus className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg font-serif">Ghi Danh Ca Đoàn</h3>
            </div>

            <p className="text-xs font-semibold text-slate-900 leading-relaxed relative z-10">
              Bạn yêu thích thánh nhạc và muốn cất tiếng hát phụng sự Chúa tại Giáo Xứ Bắc Hòa? Đăng ký ngay hôm nay!
            </p>

            <Link
              to="/portal/dang-ky"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-950 text-amber-300 font-bold text-xs hover:bg-slate-900 transition-all shadow-md group relative z-10"
            >
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Đăng Ký Tham Gia</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Rules & Guidelines */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm font-serif">Nội Quy Sinh Hoạt</h3>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed text-left">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Hiện diện đúng giờ các buổi tập hát và Thánh Lễ được phân công.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Trang phục lịch sự, trang trọng phù hợp nơi không gian Thánh đường.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Nêu cao tinh thần đoàn kết, yêu thương và giúp đỡ nhau trong ca đoàn.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
