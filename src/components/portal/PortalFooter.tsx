import React from 'react';
import { Music, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PortalFooter: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 py-10 text-xs transition-colors duration-200 pb-20 md:pb-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-base text-white tracking-tight">CA ĐOÀN THIÊN THẦN</span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-2xl">
              Cổng Thông Tin Truyền Thông chính thức thuộc Giáo Xứ Bắc Hòa (Giáo Hạt Phú Thịnh — Giáo Phận Xuân Lộc). Phục vụ lời ca tiếng hát tôn vinh Thiên Chúa và kết nối cộng đồng ca viên.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
              <span>⛪ Giáo Xứ Bắc Hòa</span>
              <span>•</span>
              <span>Giáo Phận Xuân Lộc</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Danh Mục Liên Kết Nhanh</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <Link to="/portal/thong-bao" className="hover:text-amber-300 transition-colors">Thông báo mới nhất</Link>
              </li>
              <li>
                <Link to="/portal/lich-tap" className="hover:text-amber-300 transition-colors">Lịch tập hát ca đoàn</Link>
              </li>
              <li>
                <Link to="/portal/lich-phuc-vu" className="hover:text-amber-300 transition-colors">Lịch phục vụ Phụng vụ</Link>
              </li>
              <li>
                <Link to="/portal/dang-ky" className="hover:text-amber-300 transition-colors">Phiếu Đăng Ký ca viên</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Parish Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Thông Tin Liên Hệ</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nhà thờ Giáo Xứ Bắc Hòa<br />
              Giáo Hạt Phú Thịnh — Giáo Phận Xuân Lộc<br />
              Phục vụ lời ca & tôn vinh Thiên Chúa.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Thiết kế & Xây dựng với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>cho Ca Đoàn Thiên Thần</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
