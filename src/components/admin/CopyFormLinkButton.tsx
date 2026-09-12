import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';

interface CopyFormLinkButtonProps {
  slug: string;
  className?: string;
}

export const CopyFormLinkButton: React.FC<CopyFormLinkButtonProps> = ({ slug, className }) => {
  const [copied, setCopied] = useState(false);

  const getFullPublicUrl = () => {
    const origin = window.location.origin;
    // Chuẩn hóa path cho GitHub Pages và Vite dev server
    return `${origin}/FormsAngel/form/${slug}`;
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getFullPublicUrl();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback cho trình duyệt cũ
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Lỗi sao chép link:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Sao chép link: ${getFullPublicUrl()}`}
      className={className || "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 transition-colors"}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>Đã chép link!</span>
        </>
      ) : (
        <>
          <Link2 className="w-3.5 h-3.5" />
          <span>Sao chép link</span>
        </>
      )}
    </button>
  );
};
