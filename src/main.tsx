import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PublicFormPage } from './components/public/PublicFormPage.tsx';
import './index.css';

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

const publicSlug = parsePublicFormSlug();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {publicSlug ? (
      <PublicFormPage slug={publicSlug} />
    ) : (
      <App />
    )}
  </StrictMode>,
);
