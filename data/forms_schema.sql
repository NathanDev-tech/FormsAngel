-- ========================================================
-- FORMSANGEL DATABASE SCHEMA FOR SUPABASE
-- Module Quản Lý & Điền Biểu Mẫu Công Khai (Public Forms)
-- ========================================================

-- 1. BẢNG FORMS (Danh sách biểu mẫu)
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BẢNG FORM_FIELDS (Danh sách câu hỏi / trường dữ liệu)
CREATE TABLE IF NOT EXISTS form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'textarea', 'radio', 'checkbox', 'select', 'number', 'date', 'phone'
  placeholder TEXT,
  required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb, -- Danh sách lựa chọn cho radio/checkbox/select
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BẢNG FORM_RESPONSES (Danh sách lượt gửi phản hồi)
CREATE TABLE IF NOT EXISTS form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  respondent_info JSONB DEFAULT '{}'::jsonb
);

-- 4. BẢNG FORM_ANSWERS (Câu trả lời chi tiết từng trường)
CREATE TABLE IF NOT EXISTS form_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES form_responses(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES TỐI ƯU HÓA TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug);
CREATE INDEX IF NOT EXISTS idx_form_fields_form_id ON form_fields(form_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_form_id ON form_responses(form_id);
CREATE INDEX IF NOT EXISTS idx_form_answers_response_id ON form_answers(response_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_answers ENABLE ROW LEVEL SECURITY;

-- FORMS: Public xem form đang mở/tồn tại; Admin (anon key) toàn quyền
DROP POLICY IF EXISTS "Public select forms" ON forms;
CREATE POLICY "Public select forms" ON forms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert forms" ON forms;
CREATE POLICY "Admin insert forms" ON forms FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update forms" ON forms;
CREATE POLICY "Admin update forms" ON forms FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin delete forms" ON forms;
CREATE POLICY "Admin delete forms" ON forms FOR DELETE USING (true);

-- FORM_FIELDS: Public xem trường dữ liệu; Admin toàn quyền
DROP POLICY IF EXISTS "Public select form_fields" ON form_fields;
CREATE POLICY "Public select form_fields" ON form_fields FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert form_fields" ON form_fields;
CREATE POLICY "Admin insert form_fields" ON form_fields FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update form_fields" ON form_fields;
CREATE POLICY "Admin update form_fields" ON form_fields FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin delete form_fields" ON form_fields;
CREATE POLICY "Admin delete form_fields" ON form_fields FOR DELETE USING (true);

-- FORM_RESPONSES: Public ONLY INSERT (Không được xem); Admin xem và xoá
DROP POLICY IF EXISTS "Public insert form_responses" ON form_responses;
CREATE POLICY "Public insert form_responses" ON form_responses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select form_responses" ON form_responses;
CREATE POLICY "Admin select form_responses" ON form_responses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin delete form_responses" ON form_responses;
CREATE POLICY "Admin delete form_responses" ON form_responses FOR DELETE USING (true);

-- FORM_ANSWERS: Public ONLY INSERT (Không được xem); Admin xem và xoá
DROP POLICY IF EXISTS "Public insert form_answers" ON form_answers;
CREATE POLICY "Public insert form_answers" ON form_answers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select form_answers" ON form_answers;
CREATE POLICY "Admin select form_answers" ON form_answers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin delete form_answers" ON form_answers;
CREATE POLICY "Admin delete form_answers" ON form_answers FOR DELETE USING (true);

-- ========================================================
-- SEED DATA: FORM MẪU ĐĂNG KÝ CA VIÊN MẶC ĐỊNH
-- ========================================================
INSERT INTO forms (id, title, slug, description, is_active)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'Đăng Ký Ca Viên Mới — Ca Đoàn Thiên Thần',
  'dang-ky-ca-vien',
  'Hoan nghênh các anh chị em cùng tham gia phụng sự Thánh Lễ qua lời ca tiếng hát tại Giáo Xứ Bắc Hòa — Giáo Hạt Phú Thịnh.',
  true
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO form_fields (id, form_id, label, field_type, placeholder, required, options, order_index)
VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Tên Thánh', 'text', 'VD: Giuse, Maria, Têrêsa...', false, '[]'::jsonb, 1),
  ('f2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Họ và Tên', 'text', 'Nhập đầy đủ họ và tên ca viên', true, '[]'::jsonb, 2),
  ('f3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Ngày & Tháng Sinh', 'text', 'VD: 15/08 (chỉ cần Ngày & Tháng)', true, '[]'::jsonb, 3),
  ('f4444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Lớp Giáo Lý / Giọng', 'select', 'Chọn lớp giáo lý...', true, '["Xưng Tội", "Thêm Sức", "Sống Đạo", "Vào Đời", "Giáo Lý Viên / Dự Trưởng"]'::jsonb, 4),
  ('f5555555-5555-5555-5555-555555555555', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Số Điện Thoại', 'phone', 'VD: 0912345678', false, '[]'::jsonb, 5),
  ('f6666666-6666-6666-6666-666666666666', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Bổn Phận / Vai Trò', 'select', 'Chọn vai trò...', false, '["Thành viên", "Nhạc công", "Thư ký", "Ca trưởng", "Phó ca trưởng"]'::jsonb, 6)
ON CONFLICT DO NOTHING;
