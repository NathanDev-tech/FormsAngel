import React, { useState, useEffect } from 'react';
import { FormWithFields } from '../../types/forms.ts';
import { getPublicFormBySlug, submitPublicForm } from '../../lib/formsApi.ts';
import { PublicFormLayout } from './PublicFormLayout.tsx';
import { PublicFormField } from './PublicFormField.tsx';
import { FormSuccess } from './FormSuccess.tsx';
import { FormClosed } from './FormClosed.tsx';
import { FormNotFound } from './FormNotFound.tsx';
import { Send, Loader2, FileText } from 'lucide-react';

interface PublicFormPageProps {
  slug: string;
}

export const PublicFormPage: React.FC<PublicFormPageProps> = ({ slug }) => {
  const [form, setForm] = useState<FormWithFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Values map: field_id -> string value
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadForm() {
      setLoading(true);
      try {
        const fetchedForm = await getPublicFormBySlug(slug);
        setForm(fetchedForm);
      } catch (err) {
        console.error('Lỗi tải Public Form:', err);
      } finally {
        setLoading(false);
      }
    }
    loadForm();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <PublicFormLayout>
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Đang tải biểu mẫu...</p>
        </div>
      </PublicFormLayout>
    );
  }

  // Form không tồn tại
  if (!form) {
    return (
      <PublicFormLayout>
        <FormNotFound />
      </PublicFormLayout>
    );
  }

  // Form đã đóng
  if (!form.is_active) {
    return (
      <PublicFormLayout>
        <FormClosed title={form.title} />
      </PublicFormLayout>
    );
  }

  // Đã gửi thành công
  if (submitted) {
    return (
      <PublicFormLayout>
        <FormSuccess formTitle={form.title} />
      </PublicFormLayout>
    );
  }

  // Cập nhật câu trả lời
  const handleFieldChange = (fieldId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [fieldId]: val }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    form.fields.forEach(field => {
      const val = (answers[field.id] || '').trim();

      if (field.required && !val) {
        newErrors[field.id] = `Vui lòng nhập/chọn thông tin cho: "${field.label}"`;
        isValid = false;
      }

      // Check sđt nếu dạng phone
      if (field.field_type === 'phone' && val) {
        const phoneRegex = /^[0-9+\s-]{8,15}$/;
        if (!phoneRegex.test(val)) {
          newErrors[field.id] = 'Số điện thoại không đúng định dạng';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Xử lý gửi Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const success = await submitPublicForm(form.id, answers);
      if (success) {
        setSubmitted(true);
      } else {
        alert('Có lỗi xảy ra khi gửi thông tin, vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi submit form:', err);
      alert('Không thể gửi form lúc này.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicFormLayout>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* Form Title & Description Card */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border-t-8 border-t-sky-500 border-x border-b border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Biểu mẫu thông tin</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight font-serif">
            {form.title}
          </h1>

          {form.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800/80 pt-3">
              {form.description}
            </p>
          )}

          <div className="text-xs text-red-500 font-semibold pt-1">
            * Bắt buộc
          </div>
        </div>

        {/* Dynamic Questions List */}
        {form.fields.map(field => (
          <PublicFormField
            key={field.id}
            field={field}
            value={answers[field.id] || ''}
            onChange={val => handleFieldChange(field.id, val)}
            error={errors[field.id]}
          />
        ))}

        {/* Form Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi thông tin...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>GỬI THÔNG TIN</span>
              </>
            )}
          </button>
        </div>

      </form>
    </PublicFormLayout>
  );
};
