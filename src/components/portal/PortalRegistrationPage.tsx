import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicFormPage } from '../public/PublicFormPage.tsx';

export const PortalRegistrationPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const activeSlug = slug || 'dang-ky-ca-vien';

  return (
    <div className="animate-fade-in py-2 sm:py-6">
      <PublicFormPage slug={activeSlug} embedded />
    </div>
  );
};

