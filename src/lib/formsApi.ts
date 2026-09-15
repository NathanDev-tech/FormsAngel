import { getSupabase } from './supabase.ts';
import {
  Form,
  FormField,
  FormWithFields,
  FormResponseWithAnswers,
  CreateFormInput,
  FormResponse,
  FormAnswer
} from '../types/forms.ts';

// Local storage backup keys cho trường hợp offline hoặc chưa tạo bảng Supabase
const LOCAL_FORMS_KEY = 'formsangel_local_forms_v1';
const LOCAL_RESPONSES_KEY = 'formsangel_local_responses_v1';

// Seed Data Mặc Định
const DEFAULT_SEED_FORM: FormWithFields = {
  id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
  title: 'Đăng Ký Ca Viên Mới — Ca Đoàn Thiên Thần',
  slug: 'dang-ky-ca-vien',
  description: 'Hoan nghênh các anh chị em cùng tham gia phụng sự Thánh Lễ qua lời ca tiếng hát tại Giáo Xứ Bắc Hòa — Giáo Hạt Phú Thịnh.',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fields: [
    {
      id: 'f1111111-1111-1111-1111-111111111111',
      form_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
      label: 'Tên Thánh',
      field_type: 'text',
      placeholder: 'VD: Giuse, Maria, Têrêsa...',
      required: false,
      options: [],
      order_index: 1,
    },
    {
      id: 'f2222222-2222-2222-2222-222222222222',
      form_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
      label: 'Họ và Tên',
      field_type: 'text',
      placeholder: 'Nhập đầy đủ họ và tên ca viên',
      required: true,
      options: [],
      order_index: 2,
    },
    {
      id: 'f3333333-3333-3333-3333-333333333333',
      form_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
      label: 'Ngày & Tháng Sinh',
      field_type: 'text',
      placeholder: 'VD: 15/08 (chỉ cần Ngày & Tháng)',
      required: true,
      options: [],
      order_index: 3,
    },
    {
      id: 'f4444444-4444-4444-4444-444444444444',
      form_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
      label: 'Lớp',
      field_type: 'select',
      placeholder: 'Chọn lớp giáo lý...',
      required: true,
      options: ['Xưng Tội', 'Thêm Sức', 'Sống Đạo', 'Vào Đời', 'GLV/Dự Trưởng'],
      order_index: 4,
    },
    {
      id: 'f5555555-5555-5555-5555-555555555555',
      form_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
      label: 'Số Điện Thoại',
      field_type: 'phone',
      placeholder: 'VD: 0912345678',
      required: false,
      options: [],
      order_index: 5,
    },
    {
      id: 'f6666666-6666-6666-6666-666666666666',
      form_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
      label: 'Bổn Phận / Vai Trò',
      field_type: 'select',
      placeholder: 'Chọn vai trò...',
      required: false,
      options: ['Thành viên', 'Nhạc công', 'Thư ký', 'Ca trưởng', 'Phó ca trưởng'],
      order_index: 6,
    }
  ]
};

// Helper khởi tạo Storage mẫu nếu chưa có
function getLocalForms(): FormWithFields[] {
  try {
    const data = localStorage.getItem(LOCAL_FORMS_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(LOCAL_FORMS_KEY, JSON.stringify([DEFAULT_SEED_FORM]));
    return [DEFAULT_SEED_FORM];
  } catch {
    return [DEFAULT_SEED_FORM];
  }
}

function saveLocalForms(forms: FormWithFields[]) {
  try {
    localStorage.setItem(LOCAL_FORMS_KEY, JSON.stringify(forms));
  } catch (e) {
    console.error('Lỗi lưu local forms:', e);
  }
}

function getLocalResponses(): { formId: string; responseId: string; createdAt: string; answers: Record<string, string> }[] {
  try {
    const data = localStorage.getItem(LOCAL_RESPONSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalResponse(formId: string, answers: Record<string, string>) {
  try {
    const current = getLocalResponses();
    const newRes = {
      formId,
      responseId: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      answers,
    };
    current.push(newRes);
    localStorage.setItem(LOCAL_RESPONSES_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Lỗi lưu local response:', e);
  }
}

// ----------------------------------------------------
// 1. PUBLIC API: Lấy thông tin Public Form theo Slug
// ----------------------------------------------------
export async function getPublicFormBySlug(slug: string): Promise<FormWithFields | null> {
  const supabase = getSupabase();
  const cleanSlug = slug.trim().toLowerCase();

  if (supabase) {
    try {
      const { data: form, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle();

      if (!formError && form) {
        const { data: fields, error: fieldsError } = await supabase
          .from('form_fields')
          .select('*')
          .eq('form_id', form.id)
          .order('order_index', { ascending: true });

        const parsedFields = (fields || []).map(f => ({
          ...f,
          options: Array.isArray(f.options) ? f.options : typeof f.options === 'string' ? JSON.parse(f.options || '[]') : [],
        }));

        return {
          ...form,
          fields: parsedFields,
        };
      }
    } catch (err) {
      console.warn('Supabase getPublicFormBySlug error, using fallback:', err);
    }
  }

  // Fallback từ Local storage
  const localForms = getLocalForms();
  const found = localForms.find(f => f.slug.toLowerCase() === cleanSlug);
  return found || null;
}

// ----------------------------------------------------
// 2. PUBLIC API: Submit câu trả lời Public Form
// ----------------------------------------------------
export async function submitPublicForm(formId: string, answers: Record<string, string>): Promise<boolean> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      // Insert vào form_responses
      const { data: responseData, error: responseError } = await supabase
        .from('form_responses')
        .insert([{ form_id: formId, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (!responseError && responseData) {
        const responseId = responseData.id;
        const answerRows = Object.entries(answers).map(([fieldId, value]) => ({
          response_id: responseId,
          field_id: fieldId,
          value: value || '',
        }));

        if (answerRows.length > 0) {
          await supabase.from('form_answers').insert(answerRows);
        }

        saveLocalResponse(formId, answers);
        return true;
      }
    } catch (err) {
      console.warn('Lỗi gửi form lên Supabase, chuyển sang lưu dự phòng:', err);
    }
  }

  // Backup lưu vào Local Storage
  saveLocalResponse(formId, answers);
  return true;
}

// ----------------------------------------------------
// 3. ADMIN API: Lấy danh sách tất cả biểu mẫu (Admin)
// ----------------------------------------------------
export async function getAdminForms(): Promise<(FormWithFields & { response_count: number })[]> {
  const supabase = getSupabase();
  const localForms = getLocalForms();
  const localResponses = getLocalResponses();

  if (supabase) {
    try {
      const { data: forms, error: formsError } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (!formsError && forms) {
        const result: (FormWithFields & { response_count: number })[] = [];

        for (const f of forms) {
          const { data: fields } = await supabase
            .from('form_fields')
            .select('*')
            .eq('form_id', f.id)
            .order('order_index', { ascending: true });

          const { count } = await supabase
            .from('form_responses')
            .select('*', { count: 'exact', head: true })
            .eq('form_id', f.id);

          const parsedFields = (fields || []).map(field => ({
            ...field,
            options: Array.isArray(field.options) ? field.options : typeof field.options === 'string' ? JSON.parse(field.options || '[]') : [],
          }));

          result.push({
            ...f,
            fields: parsedFields,
            response_count: count || 0,
          });
        }
        return result;
      }
    } catch (err) {
      console.warn('Supabase getAdminForms error, using local fallback:', err);
    }
  }

  // Local Fallback
  return localForms.map(f => {
    const count = localResponses.filter(r => r.formId === f.id).length;
    return { ...f, response_count: count };
  });
}

// ----------------------------------------------------
// 4. ADMIN API: Tạo Form Mới
// ----------------------------------------------------
export async function createForm(input: CreateFormInput): Promise<FormWithFields> {
  const supabase = getSupabase();
  const newFormId = 'form_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const newForm: FormWithFields = {
    id: newFormId,
    title: input.title.trim(),
    slug: cleanSlug,
    description: input.description?.trim() || '',
    is_active: input.is_active,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    fields: input.fields.map((f, index) => ({
      id: 'field_' + Date.now() + '_' + index,
      form_id: newFormId,
      label: f.label.trim(),
      field_type: f.field_type,
      placeholder: f.placeholder?.trim() || '',
      required: f.required,
      options: f.options || [],
      order_index: index + 1,
    })),
  };

  if (supabase) {
    try {
      const { data: createdForm, error: formError } = await supabase
        .from('forms')
        .insert([{
          title: newForm.title,
          slug: newForm.slug,
          description: newForm.description,
          is_active: newForm.is_active,
        }])
        .select()
        .single();

      if (!formError && createdForm) {
        const fieldRows = input.fields.map((f, index) => ({
          form_id: createdForm.id,
          label: f.label.trim(),
          field_type: f.field_type,
          placeholder: f.placeholder?.trim() || '',
          required: f.required,
          options: f.options || [],
          order_index: index + 1,
        }));

        const { data: createdFields } = await supabase
          .from('form_fields')
          .insert(fieldRows)
          .select();

        return {
          ...createdForm,
          fields: (createdFields || []).map(field => ({
            ...field,
            options: Array.isArray(field.options) ? field.options : typeof field.options === 'string' ? JSON.parse(field.options || '[]') : [],
          })),
        };
      }
    } catch (err) {
      console.warn('Lỗi tạo form Supabase, dùng local:', err);
    }
  }

  // Local Storage
  const currentForms = getLocalForms();
  currentForms.unshift(newForm);
  saveLocalForms(currentForms);
  return newForm;
}

// ----------------------------------------------------
// 5. ADMIN API: Cập nhật Form
// ----------------------------------------------------
export async function updateForm(formId: string, input: CreateFormInput): Promise<FormWithFields> {
  const supabase = getSupabase();
  const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

  if (supabase) {
    try {
      await supabase
        .from('forms')
        .update({
          title: input.title.trim(),
          slug: cleanSlug,
          description: input.description?.trim() || '',
          is_active: input.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', formId);

      // Xoá fields cũ và tạo lại
      await supabase.from('form_fields').delete().eq('form_id', formId);

      const fieldRows = input.fields.map((f, index) => ({
        form_id: formId,
        label: f.label.trim(),
        field_type: f.field_type,
        placeholder: f.placeholder?.trim() || '',
        required: f.required,
        options: f.options || [],
        order_index: index + 1,
      }));

      const { data: newFields } = await supabase
        .from('form_fields')
        .insert(fieldRows)
        .select();

      return {
        id: formId,
        title: input.title,
        slug: cleanSlug,
        description: input.description,
        is_active: input.is_active,
        fields: (newFields || []).map(field => ({
          ...field,
          options: Array.isArray(field.options) ? field.options : typeof field.options === 'string' ? JSON.parse(field.options || '[]') : [],
        })),
      };
    } catch (err) {
      console.warn('Lỗi updateForm Supabase:', err);
    }
  }

  // Local Storage
  const currentForms = getLocalForms();
  const index = currentForms.findIndex(f => f.id === formId);
  const updatedForm: FormWithFields = {
    id: formId,
    title: input.title,
    slug: cleanSlug,
    description: input.description,
    is_active: input.is_active,
    updated_at: new Date().toISOString(),
    fields: input.fields.map((f, idx) => ({
      id: f.id || 'field_' + Date.now() + '_' + idx,
      form_id: formId,
      label: f.label,
      field_type: f.field_type,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options || [],
      order_index: idx + 1,
    })),
  };
  if (index !== -1) {
    currentForms[index] = updatedForm;
    saveLocalForms(currentForms);
  }
  return updatedForm;
}

// ----------------------------------------------------
// 6. ADMIN API: Bật/Tắt Nhận Phản Hồi Form
// ----------------------------------------------------
export async function toggleFormStatus(formId: string, isActive: boolean): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('forms')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', formId);
    } catch (err) {
      console.warn('Lỗi toggleFormStatus Supabase:', err);
    }
  }

  const currentForms = getLocalForms();
  const form = currentForms.find(f => f.id === formId);
  if (form) {
    form.is_active = isActive;
    saveLocalForms(currentForms);
  }
  return true;
}

// ----------------------------------------------------
// 7. ADMIN API: Xoá Form
// ----------------------------------------------------
export async function deleteForm(formId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('forms').delete().eq('id', formId);
    } catch (err) {
      console.warn('Lỗi deleteForm Supabase:', err);
    }
  }

  const currentForms = getLocalForms().filter(f => f.id !== formId);
  saveLocalForms(currentForms);
  return true;
}

// ----------------------------------------------------
// 8. ADMIN API: Lấy Danh Sách Phản Hồi của 1 Form
// ----------------------------------------------------
export async function getFormResponses(formId: string): Promise<{ responses: FormResponseWithAnswers[]; fields: FormField[] }> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data: fieldsData } = await supabase
        .from('form_fields')
        .select('*')
        .eq('form_id', formId)
        .order('order_index', { ascending: true });

      const fields: FormField[] = (fieldsData || []).map(f => ({
        ...f,
        options: Array.isArray(f.options) ? f.options : typeof f.options === 'string' ? JSON.parse(f.options || '[]') : [],
      }));

      const { data: responsesData } = await supabase
        .from('form_responses')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: false });

      if (responsesData) {
        const responses: FormResponseWithAnswers[] = [];

        for (const res of responsesData) {
          const { data: answersData } = await supabase
            .from('form_answers')
            .select('*')
            .eq('response_id', res.id);

          const answersMap: Record<string, string> = {};
          (answersData || []).forEach(ans => {
            answersMap[ans.field_id] = ans.value || '';
          });

          responses.push({
            id: res.id,
            form_id: res.form_id,
            created_at: res.created_at,
            respondent_info: res.respondent_info,
            answersMap,
          });
        }

        return { responses, fields };
      }
    } catch (err) {
      console.warn('Lỗi getFormResponses Supabase, dùng local fallback:', err);
    }
  }

  // Local fallback
  const forms = getLocalForms();
  const form = forms.find(f => f.id === formId) || DEFAULT_SEED_FORM;
  const localResList = getLocalResponses().filter(r => r.formId === formId);

  const responses: FormResponseWithAnswers[] = localResList.map(r => ({
    id: r.responseId,
    form_id: formId,
    created_at: r.createdAt,
    answersMap: r.answers,
  }));

  return { responses, fields: form.fields };
}

// ----------------------------------------------------
// 9. ADMIN API: Xoá 1 Lượt Phản Hồi
// ----------------------------------------------------
export async function deleteResponse(responseId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('form_responses').delete().eq('id', responseId);
    } catch (err) {
      console.warn('Lỗi deleteResponse Supabase:', err);
    }
  }

  const responses = getLocalResponses().filter(r => r.responseId !== responseId);
  try {
    localStorage.setItem(LOCAL_RESPONSES_KEY, JSON.stringify(responses));
  } catch (e) {
    console.error('Lỗi xoá local response:', e);
  }
  return true;
}

// ----------------------------------------------------
// 10. REALTIME API: Đăng Ký Lắng Nghe Phản Hồi Mới Realtime
// ----------------------------------------------------
export function subscribeFormResponsesRealtime(formId: string, onNewResponse: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => { };

  try {
    const channel = supabase
      .channel(`public:form_responses:${formId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'form_responses',
          filter: `form_id=eq.${formId}`,
        },
        () => {
          onNewResponse();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Lỗi khởi tạo Realtime Subscription:', e);
    return () => { };
  }
}
