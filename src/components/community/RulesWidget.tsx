import React from 'react';
import { Church, Calendar, Sparkles, Music, ShieldCheck, Clock, BookOpen, Heart, Shirt, Users, Quote, MapPin } from 'lucide-react';

interface RuleItem {
  id: number;
  title: string;
  desc: string;
  category: 'ky_luat' | 'tap_luyen' | 'hiep_nhat';
}

const RULES: RuleItem[] = [
  { id: 1, title: 'Tham gia có trách nhiệm', desc: 'Đã tham gia ca đoàn thì có trách nhiệm với lịch tập và lịch hát phục vụ ca đoàn.', category: 'ky_luat' },
  { id: 2, title: 'Đúng giờ', desc: 'Đi tập hát và hát lễ phục vụ đúng giờ, hạn chế tối đa việc đi trễ.', category: 'ky_luat' },
  { id: 3, title: 'Xin phép khi vắng', desc: 'Nếu không thể tham dự thánh lễ hoặc tập hát, phải báo trước cho Ban Điều Hành.', category: 'ky_luat' },
  { id: 4, title: 'Tập luyện nghiêm túc', desc: 'Tập trung, chủ động học bài và thực hiện theo hướng dẫn của Ban Điều Hành.', category: 'tap_luyen' },
  { id: 5, title: 'Trang phục lịch sự', desc: 'Giữ trang phục TNTT và tác phong phù hợp khi tập hát và phục vụ hát Thánh lễ.', category: 'tap_luyen' },
  { id: 6, title: 'Giữ trật tự', desc: 'Không nói chuyện, đùa giỡn hoặc sử dụng điện thoại khi đang tập và phục vụ.', category: 'tap_luyen' },
  { id: 7, title: 'Tôn trọng nhau', desc: 'Không nói xấu, xúc phạm, gây mất đoàn kết hoặc tạo bè phái trong ca đoàn.', category: 'hiep_nhat' },
  { id: 8, title: 'Tuân thủ phân công', desc: 'Thực hiện đúng vị trí và nhiệm vụ đã được phân công.', category: 'hiep_nhat' },
  { id: 9, title: 'Giữ hình ảnh ca đoàn', desc: 'Mỗi ca viên có trách nhiệm giữ gìn hình ảnh và uy tín của Ca Đoàn Thiên Thần.', category: 'hiep_nhat' },
  { id: 10, title: 'Tinh thần phục vụ', desc: 'Luôn đặt tinh thần yêu thương, hiệp nhất và phục vụ Thiên Chúa lên trên lợi ích cá nhân.', category: 'hiep_nhat' },
];

export const RulesWidget: React.FC = () => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-sky-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-sky-950/30 border border-amber-300/60 dark:border-amber-700/50 shadow-md p-5 space-y-4 text-xs transition-all">

      {/* Header Căn Giữa Hoàn Hảo & Trang Trọng */}
      <div className="flex flex-col items-center justify-center text-center pb-3.5 border-b border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center shadow-md text-xl ring-4 ring-amber-400/30 dark:ring-amber-500/20">
          📜
        </div>
        <h3 className="font-extrabold text-amber-950 dark:text-amber-200 text-lg sm:text-xl font-serif leading-tight tracking-wide uppercase">
          NỘI QUY CA VIÊN
        </h3>
        <h4 className="font-black text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-serif tracking-widest uppercase flex items-center gap-1.5 justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>CA ĐOÀN THIÊN THẦN</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </h4>
      </div>

      {/* Rules List (1 to 10) - Hiển thị đầy đủ không cần cuộn */}
      <div className="space-y-2.5">
        {RULES.map(rule => (
          <div
            key={rule.id}
            className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-200/70 dark:border-amber-900/40 hover:border-amber-400 transition-all shadow-2xs space-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {rule.id}
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {rule.title}
              </span>
            </div>
            <p className="pl-7 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {rule.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Chi Tiết Bổ Sung Phía Dưới Rất Đầy Đủ & Ấn Tượng */}
      <div className="pt-3 border-t border-amber-200/80 dark:border-amber-900/60 space-y-3">

        {/* Badges Chi Tiết Giáo Xứ & Phụng Vụ */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap text-[11px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold border border-amber-200/80 dark:border-amber-800/60 shadow-2xs">
            <Church className="w-3.5 h-3.5 text-amber-600" />
            <span>Giáo Xứ Bắc Hòa</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-bold border border-sky-200/80 dark:border-sky-800/60 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <span>Bổn Mạng Các Tổng Lãnh Thiên Thần (29/09)</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
            <Music className="w-3.5 h-3.5 text-emerald-500" />
            <span>ĐỒNG HÀNH CÙNG THIÊN THẦN</span>
          </span>
        </div>

        {/* Khung Chi Tiết Nhỏ Hay & Ý Nghĩa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Lịch Tập Hát:</span>
              <span className="text-slate-600 dark:text-slate-400">19:30 Thứ 5 & Thứ 7</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2">
            <Church className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Thánh Lễ Phục Vụ:</span>
              <span className="text-slate-600 dark:text-slate-400">17:50 Thứ 2 đến Thứ 6  6:30 Chủ Nhật</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2">
            <Shirt className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Đồng Phục:</span>
              <span className="text-slate-600 dark:text-slate-400">Đồng Phục TNTT</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2">
            <Users className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Ban Điều Hành:</span>
              <span className="text-slate-600 dark:text-slate-400">Đồng Hành & Hỗ Trợ</span>
            </div>
          </div>
        </div>

        {/* Trích Dẫn & Châm Ngôn Phụng Vụ */}
        <div className="text-center bg-amber-100/70 dark:bg-amber-950/60 p-3 rounded-2xl border border-amber-300/50 dark:border-amber-800/40 space-y-1 shadow-2xs">
          <p className="font-bold text-amber-950 dark:text-amber-200 text-xs italic flex items-center justify-center gap-1">

            <span>“Hát là cầu nguyện hai lần.” — Thánh Augustinô</span>
          </p>
          <p className="text-[11px] font-bold text-sky-800 dark:text-sky-300 flex items-center justify-center gap-1">

            <span>Ca Đoàn Thiên Thần — Phục vụ trong yêu thương</span>
          </p>
        </div>

        {/* Thông tin thuộc về Giáo Hạt & Giáo Phận */}
        <div className="flex items-center justify-between text-[10.5px] text-slate-400 dark:text-slate-500 px-1 font-medium border-t border-amber-200/40 dark:border-amber-900/30 pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-500" />
            <span>Giáo Hạt Phú Thịnh</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-500" />
            <span>Giáo Phận Xuân Lộc</span>
          </span>
        </div>

      </div>

    </div>
  );
};

