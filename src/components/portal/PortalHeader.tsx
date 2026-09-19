import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Home, 
  Bell, 
  Calendar, 
  Church, 
  UserPlus, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Music
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface PortalHeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const PORTAL_NAV_ITEMS = [
  { path: '/portal', label: 'Trang Chủ', icon: Home, exact: true },
  { path: '/portal/thong-bao', label: 'Thông Báo', icon: Bell },
  { path: '/portal/lich-tap', label: 'Lịch Tập', icon: Calendar },
  { path: '/portal/lich-phuc-vu', label: 'Lịch Phục Vụ', icon: Church },
  { path: '/portal/dang-ky', label: 'Đăng Ký', icon: UserPlus },
];

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  darkMode,
  setDarkMode,
}) => {
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isLinkActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path || location.pathname === '/portal/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-200/60 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300 shadow-sm">
      {/* Golden & Sky Angelic Top Gradient Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-300 via-sky-400 to-indigo-600 dark:from-amber-500 dark:via-sky-500 dark:to-indigo-600" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-3 min-w-0">
          
          {/* LEFT BRAND GROUP: LOGO + TITLE + PARISH BADGES + SLOGAN */}
          <Link to="/portal" className="flex items-center gap-3 shrink-0 min-w-0 focus:outline-none group">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-md ring-2 ring-amber-400/80 dark:ring-amber-500/50 p-0.5 bg-gradient-to-br from-amber-300 via-sky-400 to-indigo-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="Logo Ca Đoàn Thiên Thần"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 text-amber-400 dark:text-amber-300">
                <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white font-serif group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors whitespace-nowrap">
                  Ca Đoàn Thiên Thần — Cổng Thông Tin
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-ping" />
                  <span>Giáo Phận Xuân Lộc</span>
                  <span className="text-amber-400 dark:text-amber-600">•</span>
                  <span>Giáo Hạt Phú Thịnh</span>
                  <span className="text-amber-400 dark:text-amber-600">•</span>
                  <span className="font-bold text-amber-900 dark:text-amber-200">Giáo Xứ Bắc Hòa</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                <Music className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="italic font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  "Hát là cầu nguyện hai lần" — Thánh Augustinô
                </span>
              </div>
            </div>
          </Link>

          {/* CENTER / RIGHT: PORTAL NAV TABS INLINE ON THE SAME ROW */}
          <div className="hidden lg:flex items-center shrink-0">
            <nav 
              className="flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-inner gap-0.5"
              aria-label="Thanh điều hướng Cổng Thông Tin"
            >
              {PORTAL_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.path, item.exact);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[32px] whitespace-nowrap ${
                      active
                        ? 'bg-amber-500 dark:bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-amber-500 dark:text-amber-400'}`} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* RIGHT ACTIONS: THEME TOGGLE */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode(prev => !prev)}
              className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60"
              aria-label="Toggle Theme"
              title="Chuyển đổi Giao diện Sáng / Tối"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>
          </div>

          {/* MOBILE TOGGLE & CONTROLS */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Toggle Mobile Menu"
            >
              {mobileDrawerOpen ? <X className="w-4 h-4 text-amber-500" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div 
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-base text-slate-900 dark:text-white">Cổng Thông Tin</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col space-y-1">
                {PORTAL_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item.path, item.exact);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-slate-950' : 'text-amber-500'}`} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 pb-safe shadow-lg">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {PORTAL_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.path, item.exact);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1.5 min-h-[44px] transition-colors ${
                  active ? 'text-amber-600 dark:text-amber-400 font-bold scale-105' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-amber-500 scale-110' : ''}`} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
