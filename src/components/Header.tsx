import React from 'react';
import { Sparkles, Users, UserPlus, BarChart3, Moon, Sun } from 'lucide-react';
import logoImg from '../assets/logo.png';

interface HeaderProps {
  activeTab: 'form' | 'list' | 'stats';
  setActiveTab: (tab: 'form' | 'list' | 'stats') => void;
  totalMembers: number;
  birthdaysCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalMembers,
  birthdaysCount,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
      {/* Subtle angelic halo top border gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-300 via-amber-200 to-sky-400 dark:from-sky-600 dark:via-amber-400/40 dark:to-sky-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              {/* Angelic Embellished Icon */}
              <div className="relative group flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-sky-200 dark:shadow-sky-900/40 ring-2 ring-white/70 dark:ring-slate-700 transition-transform group-hover:scale-105 bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="Logo Ca Đoàn Thiên Thần"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 text-amber-300 dark:text-amber-400">
                  <Sparkles className="w-4 h-4 fill-amber-300 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-1.5 font-serif">
                    Ca Đoàn Thiên Thần
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                    Giáo Xứ Bắc Hòa
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Hát là cầu nguyện hai lần • Cổng Thông Tin Ca Đoàn Thiên Thần
                </p>
              </div>
            </div>

            {/* Mobile Dark Mode Toggle */}
            <div className="flex md:hidden items-center gap-1">
              <button
                type="button"
                id="mobile-dark-mode-toggle"
                onClick={() => setDarkMode(prev => !prev)}
                aria-label="Chuyển đổi giao diện sáng tối"
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-sky-600" />}
              </button>
            </div>
          </div>

          {/* Navigation Tabs & Actions */}
          <div className="flex items-center justify-center gap-2 w-full md:w-auto">
            <nav className="flex items-center justify-between p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 w-full sm:w-auto" aria-label="Tabs">
              <button
                type="button"
                id="tab-btn-form"
                onClick={() => setActiveTab('form')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'form'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Đăng Ký</span>
                <span className="hidden sm:inline whitespace-nowrap">Thành Viên</span>
              </button>

              <button
                type="button"
                id="tab-btn-list"
                onClick={() => setActiveTab('list')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'list'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Danh Sách</span>
                <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-bold">
                  {totalMembers}
                </span>
              </button>

              <button
                type="button"
                id="tab-btn-stats"
                onClick={() => setActiveTab('stats')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'stats'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Thống Kê</span>
                {birthdaysCount > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] sm:text-xs bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold" title={`${birthdaysCount} sinh nhật trong tháng`}>
                    🎂 {birthdaysCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Desktop Dark Mode Toggle */}
            <button
              type="button"
              id="desktop-dark-mode-toggle"
              onClick={() => setDarkMode(prev => !prev)}
              aria-label="Chuyển đổi giao diện sáng tối"
              className="hidden md:flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors"
              title={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-sky-600" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};


