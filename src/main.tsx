import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PublicFormPage } from './components/public/PublicFormPage.tsx';
import { CommunityHome } from './components/community/CommunityHome.tsx';
import './index.css';

// Helper nhận dạng route Public Community (/community hoặc /FormsAngel/community)
function parseCommunityRoute(): boolean {
  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  // 1. Kiểm tra URL đến từ GitHub Pages 404 redirect (?p=community)
  if (search.includes('?p=')) {
    const params = new URLSearchParams(search);
    const p = (params.get('p') || '').toLowerCase();
    if (p === 'community' || p.startsWith('community/')) {
      return true;
    }
  }

  // 2. Kiểm tra Pathname trực tiếp (/community hoặc /FormsAngel/community)
  if (pathname.match(/\/(?:FormsAngel\/)?community(?:\/.*)?$/i)) {
    return true;
  }

  // 3. Kiểm tra Hash Routing (#/community hoặc #/FormsAngel/community)
  if (hash && hash.match(/#\/(?:FormsAngel\/)?community(?:\/.*)?$/i)) {
    return true;
  }

  return false;
}

// Helper nhận dạng route Public Form (/form/:slug hoặc /FormsAngel/form/:slug)
function parsePublicFormSlug(): string | null {
  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  // 1. Kiểm tra URL đến từ GitHub Pages 404 redirect (?p=form/slug)
  if (search.includes('?p=')) {
    const params = new URLSearchParams(search);
    const p = params.get('p') || '';
    if (p.startsWith('form/')) {
      const parts = p.split('/');
      if (parts[1]) return parts[1];
    }
  }

  // 2. Kiểm tra Pathname trực tiếp (/form/:slug hoặc /FormsAngel/form/:slug)
  const formMatch = pathname.match(/\/(?:FormsAngel\/)?form\/([^/]+)/i);
  if (formMatch && formMatch[1]) {
    return formMatch[1];
  }

  // 3. Kiểm tra Hash Routing (#/form/:slug)
  if (hash) {
    const hashMatch = hash.match(/#\/(?:FormsAngel\/)?form\/([^/]+)/i);
    if (hashMatch && hashMatch[1]) {
      return hashMatch[1];
    }
  }

  return null;
}

const isCommunity = parseCommunityRoute();
const publicSlug = parsePublicFormSlug();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCommunity ? (
      <CommunityHome />
    ) : publicSlug ? (
      <PublicFormPage slug={publicSlug} />
    ) : (
      <App />
    )}
  </StrictMode>,
);
