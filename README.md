<div align="center">

<img width="120" height="120" alt="Logo Ca Đoàn Thiên Thần" src="./public/logo.png" />

# 🎵 Ca Đoàn Thiên Thần — FormsAngel

**Cổng Thông Tin & Quản Lý Ca Đoàn Giáo Xứ Bắc Hòa — Giáo Hạt Phú Thịnh — Giáo Phận Xuân Lộc**

[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Mobile Responsive](https://img.shields.io/badge/Mobile-100%25_Responsive-brightgreen?style=for-the-badge&logo=android&logoColor=white)](https://github.com/NathanDev-tech/FormsAngel)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> *"Hát là cầu nguyện hai lần"* — Thánh Augustinô

[🚀 Demo Trực Tuyến](https://nathandev-tech.github.io/FormsAngel/) · [📖 Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng) · [⚡ Cấu Hình Supabase Database](#-cấu-hình-supabase-realtime-database) · [🐛 Báo Lỗi](https://github.com/NathanDev-tech/FormsAngel/issues)

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
  - [1. Quản Lý Danh Sách Ca Viên & Supabase Realtime](#-1-quản-lý-danh-sách-ca-viên--supabase-realtime)
  - [2. Hệ Thống Biểu Mẫu Công Khai (Dynamic Form Builder)](#-2-hệ-thống-biểu-mẫu-công-khai-dynamic-form-builder)
  - [3. Diễn Đàn Cộng Đồng Ca Đoàn (Community Forum)](#-3-diễn-đàn-cộng-đồng-ca-đoàn-community-forum)
  - [4. Tối Ưu Responsive Di Động (Mobile Bottom-Sheet UX)](#-4-tối-ưu-responsive-di-động-mobile-bottom-sheet-ux)
  - [5. Thống Kê & Báo Cáo Phân Bố Khối Lớp](#-5-thống-kê--báo-cáo-phân-bố-khối-lớp)
  - [6. In Ấn & Xuất Bản A4 / CSV](#-6-in-ấn--xuất-bản-a4--csv)
- [Cấu Hình Supabase Realtime Database](#-cấu-hình-supabase-realtime-database)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Chạy Dự Án](#-cài-đặt--chạy-dự-án)
- [Biến Môi Trường](#-biến-môi-trường)

---

## 🎼 Giới Thiệu

**FormsAngel** là hệ thống quản lý ca viên và cổng thông tin truyền thông chuyên nghiệp dành riêng cho **Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa** (Giáo Hạt Phú Thịnh — Giáo Phận Xuân Lộc). 

Ứng dụng kết nối trực tiếp với **Supabase Realtime Cloud Database**, cho phép đồng bộ tức thì mọi dữ liệu ghi danh, biểu mẫu thu thập ý kiến và diễn đàn tin tức giữa tất cả các điện thoại di động và máy tính cá nhân.

---

## ✨ Tính Năng Nổi Bật

### ⚡ 1. Quản Lý Danh Sách Ca Viên & Supabase Realtime
- **Ghi danh linh hoạt**: Người dùng có thể bỏ trống bất kỳ trường nào khi ghi danh và bấm gửi thành công bình thường.
- **Bảo mật Ngày & Tháng sinh**: Chỉ lưu Ngày & Tháng sinh (VD: `15/08`) để phục vụ chúc mừng sinh nhật, không bắt buộc nhập năm sinh.
- **Sắp xếp Tên tiếng Việt A-Z chuẩn**: Thuật toán ưu tiên xếp theo Tên ca viên trước, Họ đệm sau.
- **Phân màu Khối Lớp Giáo Lý chuẩn 100%**:
  - 🟢 **Xưng Tội**: Màu xanh lá (Emerald)
  - 🔵 **Thêm Sức**: Màu xanh nước biển (Blue)
  - 🟡 **Sống Đạo**: Màu vàng (Amber)
  - 🟤 **Vào Đời**: Màu nâu (Brown)
  - 🔴 **Giáo Lý Viên / Dự Trưởng**: Màu đỏ (Rose)

---

### 📋 2. Hệ Thống Biểu Mẫu Công Khai (Dynamic Form Builder)
- **Tạo biểu mẫu tùy chỉnh**: Admin khởi tạo form thu thập thông tin với các loại câu hỏi đa dạng (Text, Textarea, Select, Radio, Checkbox, Phone, Date, Number).
- **Link công khai**: Chia sẻ link dạng `/form/:slug` cho ca viên điền thông tin trên di động.
- **Quản lý phản hồi Real-time**: Xem lượt phản hồi chi tiết, bật/tắt nhận form và xuất dữ liệu câu trả lời.

---

### 🗣️ 3. Diễn Đàn Cộng Đồng Ca Đoàn (Community Forum)
- **Truyền thông tin tức**: Đăng bài thông báo lịch tập hát, sự kiện, ghim bài viết quan trọng đầu trang (`is_pinned`, `is_important`).
- **Nén ảnh tự động**: Tự động xử lý và nén ảnh tải lên về độ phân giải chuẩn mà vẫn giữ nét căng.
- **Xem ảnh Lightbox Facebook style**: Hiển thị ảnh đính kèm theo layout gallery Facebook sinh động.
- **Tương tác & Bình luận**: Thả cảm xúc (Thích, Yêu thích, Cầu nguyện, Vỗ tay...) và bình luận theo thời gian thực.

---

### 📱 4. Tối Ưu Responsive Di Động (Mobile Bottom-Sheet UX)
- **Bottom-Sheet Modals**: Khi thao tác trên điện thoại màn hình nhỏ (<640px), tất cả Modal (`Cập nhật ca viên`, `Import CSV`, `Tạo biểu mẫu`, `Đăng bài viết`) tự động trượt từ đáy màn hình lên mượt mà kèm dải vuốt drag indicator.
- **Vùng chạm chuẩn (Touch Targets)**: Tất cả nút bấm di động đạt kích thước chuẩn 44px+ cùng phản hồi lực bấm active.
- **Header Navigation Scroll**: Thanh 5 Tab cuộn ngang mượt mà trên điện thoại.

---

### 📊 5. Thống Kê & Báo Cáo Phân Bố Khối Lớp
- Biểu đồ phân bố ca viên theo trạng thái (**Đang hoạt động**, **Tạm nghỉ**, **Nghỉ hẳn**).
- Thống kê tỷ lệ theo từng khối lớp giáo lý và bổn phận phụng sự.
- Lọc nhanh ca viên theo khối lớp trực tiếp bằng thanh chip di động.

---

### 🖨️ 6. In Ấn & Xuất Bản A4 / CSV
- **Bản in A4 chuẩn**: Hỗ trợ xem trước và in trang phục vụ lưu trữ ban hành.
- **Import CSV**: Tải hàng loạt ca viên từ file `.csv` hỗ trợ UTF-8 và bảng mẫu xem trước.

---

## ⚡ Cấu Hình Supabase Realtime Database

Chạy đoạn mã SQL sau tại **Supabase SQL Editor** để khởi tạo hệ thống cơ sở dữ liệu:

```sql
-- 1. Bảng ca viên
create table if not exists public.members (
  id text primary key,
  ten_thanh text default '',
  ho_va_ten text default '',
  ngay_sinh text default '',
  lop text default '',
  so_dien_thoai text default '',
  bon_phan text default 'Ca Viên',
  trang_thai text default 'Hoạt động',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bảng biểu mẫu (Forms)
create table if not exists public.forms (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text default '',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bảng câu hỏi biểu mẫu (Form Fields)
create table if not exists public.form_fields (
  id uuid default gen_random_uuid() primary key,
  form_id uuid references public.forms(id) on delete cascade not null,
  label text not null,
  field_type text default 'text',
  placeholder text default '',
  required boolean default false,
  options jsonb default '[]'::jsonb,
  order_index integer default 1
);

-- 4. Bảng câu trả lời biểu mẫu (Form Responses)
create table if not exists public.form_responses (
  id uuid default gen_random_uuid() primary key,
  form_id uuid references public.forms(id) on delete cascade not null,
  answers jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Bảng bài viết diễn đàn (Community Posts)
create table if not exists public.community_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text default 'Thông báo',
  author_name text default 'Trưởng Ca Đoàn',
  content text not null,
  is_pinned boolean default false,
  is_important boolean default false,
  comments_enabled boolean default true,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Bảng bình luận diễn đàn (Community Comments)
create table if not exists public.community_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  author_name text default 'Ca Viên',
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mở quyền Public Access & Bật Realtime
create policy "Public Members Access" on public.members for all using (true) with check (true);
create policy "Public Forms Access" on public.forms for all using (true) with check (true);
create policy "Public Fields Access" on public.form_fields for all using (true) with check (true);
create policy "Public Responses Access" on public.form_responses for all using (true) with check (true);
create policy "Public Posts Access" on public.community_posts for all using (true) with check (true);
create policy "Public Comments Access" on public.community_comments for all using (true) with check (true);

alter publication supabase_realtime add table public.members, public.forms, public.community_posts, public.community_comments;
```

---

## 🛠️ Công Nghệ Sử Dụng

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|-----------|----------|
| **React** | 19.0 | UI Library |
| **TypeScript** | 5.8 | Type Safety & Integreted Checking |
| **Supabase JS** | 2.116 | PostgreSQL Database & Realtime WebSockets |
| **Vite** | 6.2 | Build Engine & Fast HMR |
| **TailwindCSS** | 4.1 | Styling & Responsive Design System |
| **Lucide React** | 0.546 | Icon System |
| **Motion** | 12.23 | UI Animations |

---

## 📁 Cấu Trúc Dự Án

```
FormsAngel/
├── 📄 index.html              # Entry point HTML & Meta SEO
├── 📄 server.ts               # Local Express server dev
├── 📄 vite.config.ts          # Vite configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 package.json            # Scripts & dependencies
├── 📄 .env.example            # Sample environment variables
├── 📄 .env.local              # Local environment variables
│
├── 📁 public/                 # Static assets
│   ├── 🖼️ logo.png            # Logo Ca Đoàn Thiên Thần
│   └── 🖼️ favicon.png         # Favicon tab trình duyệt
│
└── 📁 src/                    # Source code React
    ├── 📄 main.tsx            # Application Entry & Router matcher
    ├── 📄 App.tsx             # Main App layout & tab state
    ├── 📄 index.css           # TailwindCSS setup & print styles
    ├── 📄 types.ts            # TypeScript member interfaces
    │
    ├── 📁 components/         # Main UI Components
    │   ├── 📄 Header.tsx          # Navigation header & Dark mode toggle
    │   ├── 📄 RegistrationForm.tsx # Form đăng ký ca viên mới
    │   ├── 📄 MembersTable.tsx     # Bảng ca viên & Card view di động
    │   ├── 📄 StatsAndBirthdays.tsx # Thống kê báo cáo & phân bố lớp
    │   ├── 📄 EditMemberModal.tsx  # Bottom-sheet modal sửa ca viên
    │   ├── 📄 DeleteConfirmModal.tsx # Modal xác nhận xoá ca viên
    │   ├── 📄 ImportCsvModal.tsx   # Modal import file CSV hàng loạt
    │   ├── 📄 PrintView.tsx        # Bản in danh sách A4
    │   └── 📄 Toast.tsx            # Thông báo Toast
    │
    │   ├── 📁 admin/              # Module Quản Lý Biểu Mẫu (Forms Admin)
    │   │   ├── 📄 FormsDashboard.tsx      # Quản lý danh sách Form
    │   │   ├── 📄 FormBuilderModal.tsx    # Trình tạo biểu mẫu động
    │   │   ├── 📄 FormResponseListModal.tsx # Xem lượt phản hồi chi tiết
    │   │   └── 📄 CopyFormLinkButton.tsx  # Nút sao chép link công khai
    │   │
    │   ├── 📁 community/          # Module Diễn Đàn Cộng Đồng (Community)
    │   │   ├── 📄 CommunityAdmin.tsx       # Quản trị bài viết & kiểm duyệt
    │   │   ├── 📄 CommunityHome.tsx        # Trang chủ Diễn đàn công khai
    │   │   ├── 📄 CommunityComposer.tsx    # Trình soạn thảo bài viết & đính kèm
    │   │   ├── 📄 CommunityPostDetail.tsx  # Chi tiết bài viết & gallery ảnh
    │   │   ├── 📄 CommunityCommentList.tsx # Danh sách & ô nhập bình luận
    │   │   └── 📄 ReactionBar.tsx          # Thanh thả cảm xúc bài viết
    │   │
    │   └── 📁 public/             # Module Form Công Khai (Public Form)
    │       ├── 📄 PublicFormPage.tsx   # Trang điền Form công khai
    │       ├── 📄 PublicFormField.tsx  # Component hiển thị ô nhập theo loại câu hỏi
    │       └── 📄 PublicFormLayout.tsx # Layout khung trang công khai
    │
    ├── 📁 lib/                    # Services & Cloud APIs
    │   ├── 📄 supabase.ts          # Supabase client initialization
    │   ├── 📄 api.ts               # Member CRUD & Realtime subscriptions
    │   ├── 📄 formsApi.ts          # Dynamic Forms API & Submissions
    │   └── 📄 communityApi.ts      # Community Posts & Comments API
    │
    └── 📁 utils/                  # Helper Utilities
        ├── 📄 csvExport.ts         # Xuất Excel, CSV & Thuật toán xếp Tên A-Z tiếng Việt
        └── 📄 communityUtils.ts    # Helpers định dạng thời gian & link chia sẻ
```

---

## 🚀 Cài Đặt & Chạy Dự Án

### 1. Clone Repository
```bash
git clone https://github.com/NathanDev-tech/FormsAngel.git
cd FormsAngel
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Khởi Tạo File Môi Trường (`.env.local`)
```env
VITE_SUPABASE_URL="https://YOUR_SUPABASE_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### 4. Chạy Development Server
```bash
npm run dev
```

Mở trình duyệt tại: **[http://localhost:3000](http://localhost:3000)**

---

<div align="center">

Được xây dựng với ❤️ cho **Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa**

*"Cantare amantis est"* — Hát là điều của người yêu mến

**[⬆ Về Đầu Trang](#-ca-đoàn-thiên-thần--formsangel)**

</div>
