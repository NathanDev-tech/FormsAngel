import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Save, FileText, CheckSquare, Layers } from 'lucide-react';
import { FormWithFields, FieldType, CreateFormFieldInput } from '../../types/forms.ts';
import { createForm, updateForm } from '../../lib/formsApi.ts';

interface FormBuilderModalProps {
  form: FormWithFields | null; // Null nếu tạo mới
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const FormBuilderModal: React.FC<FormBuilderModalProps> = ({
  form,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [fields, setFields] = useState<CreateFormFieldInput[]>([]);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // Sync form state khi modal mở
  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setSlug(form.slug);
      setDescription(form.description || '');
      setIsActive(form.is_active);
      setFields(
        form.fields.map((f, idx) => ({
          id: f.id,
          label: f.label,
          field_type: f.field_type,
          placeholder: f.placeholder || '',
          required: f.required,
          options: [...f.options],
          order_index: idx + 1,
        }))
      );
      setAutoSlug(false);
    } else {
      // Default Form Mới
      setTitle('');
      setSlug('');
      setDescription('');
      setIsActive(true);
      setAutoSlug(true);
      setFields([
        {
          label: 'Họ và Tên',
          field_type: 'text',
          placeholder: 'Nhập họ và tên...',
          required: true,
          options: [],
          order_index: 1,
        },
        {
          label: 'Số Điện Thoại',
          field_type: 'phone',
          placeholder: 'VD: 0912345678',
          required: false,
          options: [],
          order_index: 2,
        },
      ]);
    }
  }, [form, isOpen]);

  // Auto-generate slug từ tiêu đề
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug && !form) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  if (!isOpen) return null;

  // Thêm câu hỏi mới
  const addField = () => {
    setFields(prev => [
      ...prev,
      {
        label: `Câu hỏi mới #${prev.length + 1}`,
        field_type: 'text',
        placeholder: '',
        required: false,
        options: ['Lựa chọn 1', 'Lựa chọn 2'],
        order_index: prev.length + 1,
      },
    ]);
  };

  // Xoá câu hỏi
  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  // Di chuyển thứ tự câu hỏi
  const moveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const newFields = [...fields];
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
  };

  // Update thuộc tính câu hỏi
  const updateField = (index: number, key: keyof CreateFormFieldInput, val: any) => {
    setFields(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: val };
      return updated;
    });
  };

  // Update danh sách options của 1 câu hỏi
  const handleOptionChange = (fieldIndex: number, optionIndex: number, val: string) => {
    setFields(prev => {
      const updated = [...prev];
      const newOpts = [...updated[fieldIndex].options];
      newOpts[optionIndex] = val;
      updated[fieldIndex].options = newOpts;
      return updated;
    });
  };

  const addOption = (fieldIndex: number) => {
    setFields(prev => {
      const updated = [...prev];
      const currentOpts = updated[fieldIndex].options || [];
      updated[fieldIndex].options = [...currentOpts, `Lựa chọn ${currentOpts.length + 1}`];
      return updated;
    });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    setFields(prev => {
      const updated = [...prev];
      updated[fieldIndex].options = updated[fieldIndex].options.filter((_, i) => i !== optionIndex);
      return updated;
    });
  };

  // Lưu Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên biểu mẫu.');
      return;
    }
    if (!slug.trim()) {
      alert('Vui lòng nhập đường dẫn Slug cho biểu mẫu.');
      return;
    }
    if (fields.length === 0) {
      alert('Biểu mẫu phải có ít nhất 1 câu hỏi.');
      return;
    }

    setSaving(true);
    try {
      if (form) {
        await updateForm(form.id, {
          title,
          slug,
          description,
          is_active: isActive,
          fields,
        });
      } else {
        await createForm({
          title,
          slug,
          description,
          is_active: isActive,
          fields,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Lỗi lưu form:', err);
      alert('Lỗi lưu biểu mẫu, vui lòng kiểm tra lại slug không trùng lặp.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-[92vh]">
        
        {/* Mobile Handle Drag Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {form ? '✏️ Chỉnh Sửa Biểu Mẫu' : '✨ Tạo Biểu Mẫu Mới'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* General Info Section */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Thông Tin Chung</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Biểu Mẫu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="VD: Đăng ký ca viên mới 2026..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn Slug (Public URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                    /form/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={e => {
                      setSlug(e.target.value);
                      setAutoSlug(false);
                    }}
                    placeholder="dang-ky-ca-vien"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mô tả biểu mẫu (Hướng dẫn người điền)
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Nhập lời chào hoặc lời dặn dò ca viên trước khi điền..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 border-slate-300"
                />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Đang mở nhận phản hồi (Active)
                </span>
              </label>
            </div>
          </div>

          {/* Fields Builder Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-sky-500" />
                <span>Danh Sách Câu Hỏi ({fields.length})</span>
              </h3>

              <button
                type="button"
                onClick={addField}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi</span>
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                      Câu #{index + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveField(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(index, 'down')}
                        disabled={index === fields.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 ml-2"
                        title="Xoá câu hỏi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Tiêu đề câu hỏi / Nhãn
                      </label>
                      <input
                        type="text"
                        required
                        value={field.label}
                        onChange={e => updateField(index, 'label', e.target.value)}
                        placeholder="VD: Họ và Tên, Số điện thoại..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Loại câu hỏi
                      </label>
                      <select
                        value={field.field_type}
                        onChange={e => updateField(index, 'field_type', e.target.value as FieldType)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="text">Văn bản ngắn (Text)</option>
                        <option value="textarea">Văn bản dài (Textarea)</option>
                        <option value="select">Danh sách thả xuống (Select)</option>
                        <option value="radio">Chọn 1 (Radio)</option>
                        <option value="checkbox">Chọn nhiều (Checkbox)</option>
                        <option value="phone">Số điện thoại (Phone)</option>
                        <option value="number">Số nguyên (Number)</option>
                        <option value="date">Ngày tháng (Date)</option>
                      </select>
                    </div>
                  </div>

                  {/* Options Manager cho Select/Radio/Checkbox */}
                  {['select', 'radio', 'checkbox'].includes(field.field_type) && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Danh sách tùy chọn lựa chọn:
                      </label>
                      <div className="space-y-1.5">
                        {(field.options || []).map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 w-4">{optIndex + 1}.</span>
                            <input
                              type="text"
                              value={opt}
                              onChange={e => handleOptionChange(index, optIndex, e.target.value)}
                              placeholder={`Lựa chọn ${optIndex + 1}`}
                              className="flex-1 px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(index, optIndex)}
                              className="p-1 text-slate-400 hover:text-red-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm tùy chọn</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(index, 'required', e.target.checked)}
                        className="w-3.5 h-3.5 text-sky-600 rounded border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Bắt buộc nhập (*)
                      </span>
                    </label>

                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={e => updateField(index, 'placeholder', e.target.value)}
                      placeholder="Gợi ý nhập liệu (Placeholder)..."
                      className="w-1/2 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Footer inside Scrollable */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu Form...' : 'Lưu Biểu Mẫu'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
