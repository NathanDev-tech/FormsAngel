import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PortalHeader } from './PortalHeader.tsx';
import { PortalFooter } from './PortalFooter.tsx';

export const PortalLayout: React.FC = () => {
  // Dark mode state persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ca_doan_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ca_doan_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Unified Portal Header (Matching Admin Header layout & quality) */}
      <PortalHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Route Content Outlet - Centered layout with left and right margins */}
      <main className="flex-1 w-full max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8 mb-12 lg:mb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <PortalFooter />

    </div>
  );
};
