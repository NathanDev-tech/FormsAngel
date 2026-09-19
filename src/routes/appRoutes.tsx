import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App.tsx';
import { PortalLayout } from '../components/portal/PortalLayout.tsx';
import { PortalHome } from '../components/portal/PortalHome.tsx';
import { AnnouncementList } from '../components/portal/AnnouncementList.tsx';
import { AnnouncementDetail } from '../components/portal/AnnouncementDetail.tsx';
import { ScheduleList } from '../components/portal/schedules/ScheduleList.tsx';
import { ScheduleDetail } from '../components/portal/schedules/ScheduleDetail.tsx';
import { LiturgyList } from '../components/portal/liturgy/LiturgyList.tsx';
import { PortalRegistrationPage } from '../components/portal/PortalRegistrationPage.tsx';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ROOT REDIRECT TO /admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* 1. PUBLIC CỔNG THÔNG TIN CA ĐOÀN AT /portal */}
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<PortalHome />} />
        <Route path="thong-bao" element={<AnnouncementList />} />
        <Route path="thong-bao/:slug" element={<AnnouncementDetail />} />
        <Route path="lich-tap" element={<ScheduleList />} />
        <Route path="lich-tap/:id" element={<ScheduleDetail />} />
        <Route path="lich-phuc-vu" element={<LiturgyList />} />
        <Route path="dang-ky" element={<PortalRegistrationPage />} />
        <Route path="dang-ky-ca-vien" element={<PortalRegistrationPage />} />
        <Route path="dang-ky/:slug" element={<PortalRegistrationPage />} />
        <Route path="bieu-mau" element={<PortalRegistrationPage />} />
        <Route path="bieu-mau/:slug" element={<PortalRegistrationPage />} />
      </Route>

      {/* 2. ADMIN CENTER AT /admin */}
      <Route path="/admin/*" element={<App />} />

      {/* FALLBACK ROUTE */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};
