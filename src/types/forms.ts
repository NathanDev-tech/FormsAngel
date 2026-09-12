export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'radio' 
  | 'checkbox' 
  | 'select' 
  | 'number' 
  | 'date' 
  | 'phone';

export interface FormField {
  id: string;
  form_id: string;
  label: string;
  field_type: FieldType;
  placeholder?: string;
  required: boolean;
  options: string[]; // Chứa danh sách các lựa chọn nếu là select, radio, checkbox
  order_index: number;
  created_at?: string;
}

export interface Form {
  id: string;
  title: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FormWithFields extends Form {
  fields: FormField[];
}

export interface FormAnswer {
  id: string;
  response_id: string;
  field_id: string;
  value: string;
  created_at?: string;
  field_label?: string; // Cache label để hiển thị
}

export interface FormResponse {
  id: string;
  form_id: string;
  created_at: string;
  respondent_info?: Record<string, any>;
  answers?: FormAnswer[];
}

export interface FormResponseWithAnswers extends FormResponse {
  answersMap: Record<string, string>; // Map field_id -> value
}

export interface CreateFormFieldInput {
  id?: string;
  label: string;
  field_type: FieldType;
  placeholder?: string;
  required: boolean;
  options: string[];
  order_index: number;
}

export interface CreateFormInput {
  title: string;
  slug: string;
  description?: string;
  is_active: boolean;
  fields: CreateFormFieldInput[];
}
