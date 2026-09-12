import React from 'react';
import { Sparkles } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface PublicFormLayoutProps {
  children: React.ReactNode;
}

export const PublicFormLayout: React.FC<PublicFormLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Banner Stripe */}
      <div className="h-2.5 w-full bg-gradient-to-r from-sky-500 via-amber-400 to-indigo-600 shadow-xs" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10">
        
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-sm ring-2 ring-amber-400/40 shrink-0 bg-slate-900 flex items-center justify-center">
              <img
                src={logoImg}
                alt="FormsAngel Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                <span>Giáo Xứ Bắc Hòa • Ca Đoàn Thiên Thần</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
                FormsAngel
              </h1>
            </div>
          </div>
        </div>

        {/* Dynamic Page Content (Form / Success / Error / Closed) */}
        {children}
      </main>

      {/* Public Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 mt-auto">
        <p className="flex items-center justify-center gap-1">
          <span>Phụng sự bởi</span>
          <span className="font-semibold text-slate-600 dark:text-slate-400">FormsAngel — Ca Đoàn Thiên Thần</span>
        </p>
      </footer>
    </div>
  );
};
