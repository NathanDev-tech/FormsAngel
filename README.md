<div align="center">

<img width="120" height="120" alt="Logo Ca Đoàn Thiên Thần" src="./public/logo.png" />

# 🎵 Ca Đoàn Thiên Thần — FormsAngel

**Cổng Thông Tin Quản Lý Ca Đoàn Giáo Xứ Bắc Hòa**

[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> *"Hát là cầu nguyện hai lần"* — Thánh Augustinô

[🚀 Demo Trực Tuyến](https://nathandev-tech.github.io/FormsAngel/) · [📖 Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng) · [⚡ Supabase Setup](#-cấu-hình-supabase-realtime-database) · [🐛 Báo Lỗi](https://github.com/NathanDev-tech/FormsAngel/issues)

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Cấu Hình Supabase Realtime Database](#-cấu-hình-supabase-realtime-database)
- [Bảo Mật Ngày & Tháng Sinh](#-bảo-mật-ngày--tháng-sinh)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Chạy Dự Án](#-cài-đặt--chạy-dự-án)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [API Documentation](#-api-documentation)
- [Cấu Trúc Dữ Liệu](#-cấu-trúc-dữ-liệu)
- [Xuất Dữ Liệu](#-xuất-dữ-liệu)
- [Giao Diện & UX](#-giao-diện--ux)
- [Biến Môi Trường](#-biến-môi-trường)

---

## 🎼 Giới Thiệu

**FormsAngel** là hệ thống quản lý ca viên dành riêng cho **Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa**. Ứng dụng tích hợp **Supabase Realtime Database** cho phép đồng bộ trực tiếp tức thì giữa tất cả điện thoại, máy tính và trình duyệt khác nhau khi truy cập trên **GitHub Pages**.

- ✅ **Ghi danh** ca viên mới với form linh hoạt, bảo mật cá nhân
- ✅ **Đồng bộ Real-time 100%** qua Supabase PostgreSQL Cloud Database & WebSockets
- ✅ **Bảo mật Ngày & Tháng sinh** (Chỉ lưu Ngày & Tháng sinh `15/08` để chúc mừng sinh nhật, không yêu cầu năm sinh)
- ✅ **Quản lý danh sách** toàn bộ ca viên, phân loại theo 4 khối lớp giáo lý
- ✅ **Theo dõi sinh nhật** ca viên trong tháng hiện tại
- ✅ **Xuất danh sách** ra Excel/CSV chuẩn định dạng trang trí Ban Điều Hành
- ✅ **In bản danh sách A4** chính thức trực tiếp từ trình duyệt

---

## ✨ Tính Năng Nổi Bật

### ⚡ 1. Thuần Supabase Realtime Backend (Cloud Database)
- **Tự động đồng bộ đám mây**: Mọi thao tác thêm, sửa, xóa ca viên ở bất kỳ máy tính/điện thoại nào đều được lưu vào **Supabase Cloud PostgreSQL** và phát tín hiệu Real-time qua **WebSocket** (`postgres_changes`).
- **Auto-polling ngầm (2 giây/lần)**: Đảm bảo dữ liệu luôn khớp 100% dù mạng bị chập chờn hay WebSocket tạm ngắt.
- **Tự động kết nối trên GitHub Pages**: Cấu hình mặc định được nhúng sẵn giúp ứng dụng luôn chạy mượt mà ngay khi được deploy lên web tĩnh GitHub Pages.

---

### 🛡️ 2. Bảo Mật Thông Tin Ngày Sinh
- **Chỉ yêu cầu Ngày & Tháng sinh** (Ví dụ: `15/08`).
- **Không yêu cầu năm sinh**: Đảm bảo an toàn và bảo mật tuổi tác cá nhân cho tất cả các thành viên ca đoàn.
- **Tự động tính sinh nhật tháng**: Hệ thống tự động nhận diện ca viên có sinh nhật trong tháng hiện tại dù nhập `15/08` hay `15/08/2005`.

---

### 📝 3. Ghi Danh Ca Viên
Form đăng ký ca viên mới với các trường thông tin linh hoạt:

| Trường | Mô Tả | Bảo Mật / Quy Định |
|--------|--------|---------------------|
| **Tên Thánh** | Tên Thánh bổn mạng (Giuse, Maria, Têrêsa...) | ❌ Không bắt buộc |
| **Họ và Tên** | Họ tên đầy đủ của ca viên | ❌ Không bắt buộc |
| **Ngày Sinh** | Chỉ cần **Ngày & Tháng sinh** (VD: `15/08`) | 🛡️ **Bảo mật tuyệt đối** |
| **Giọng / Lớp** | Lớp giáo lý (Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời) | ❌ Chọn nhanh 1-click |
| **Số Điện Thoại** | Liên lạc trực tiếp | ❌ Không bắt buộc |
| **Bổn Phận** | Vai trò trong ca đoàn | Thành viên / Nhạc công / Thư ký / Ca trưởng... |
| **Trạng Thái** | Hoạt động / Tạm nghỉ / Nghỉ hẳn | Mặc định: Hoạt động |

---

### 📊 4. Danh Sách Thành Viên & Thống Kê
- **Import CSV Hàng Loạt (Mới)**: Nút **Import CSV** cho phép tải file `.csv` chứa danh sách ca viên, xem trước bảng dữ liệu, tự động phân tích chuẩn UTF-8, hỗ trợ tải file CSV mẫu (`mau-nhap-danh-sach-ca-vien.csv`) và đẩy đồng bộ lên Supabase Cloud.
- **Xuất Danh Sách Excel**: Tự động trang trí bảng màu xanh navy `#002060`, viền vàng, font *Times New Roman*, tự sắp xếp A-Z theo tên ca viên Việt Nam.
- **Tìm kiếm tức thời**: Theo Tên Thánh, Họ Tên, Lớp, Số điện thoại.
- **Lọc theo Lớp giáo lý**: Dropdown lọc nhanh từng nhóm khối lớp.
- **Sắp xếp tiếng Việt A-Z**: Thuật toán chuẩn ưu tiên sắp xếp Tên ca viên trước, Họ đệm sau.
- **Highlight Sinh Nhật**: Tô màu vàng nhạt và hiển thị badge `🎂 Sinh nhật` nhấp nháy cho ca viên có sinh nhật trong tháng.
- **Gọi điện 1-click**: Liên kết `tel:` hỗ trợ gọi trực tiếp trên điện thoại di động.

---

## ⚡ Cấu Hình Supabase Realtime Database

Dữ liệu được lưu trữ trên **Supabase Cloud PostgreSQL** tại bảng `public.members`.

### 📜 Mã SQL Khởi Tạo Bảng & Mở Quyền (Chạy tại Supabase SQL Editor)

```sql
-- 1. Tạo bảng members lưu trữ danh sách ca viên
create table if not exists public.members (
  id text primary key,
  ten_thanh text default '',
  ho_va_ten text default '',
  ngay_sinh text default '',
  lop text default '',
  so_dien_thoai text default '',
  bon_phan text default 'Thành viên',
  trang_thai text default 'Hoạt động',
  ghi_chu text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Mở quyền Đọc & Ghi công khai cho web tĩnh (Tránh lỗi RLS 401)
create policy "Public Full Access" on public.members 
for all 
using (true) 
with check (true);

-- 3. Bật tính năng Realtime WebSocket cho bảng members
alter publication supabase_realtime add table public.members;
```

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend & Cloud Backend
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|-----------|----------|
| **React** | 19.0 | UI Framework |
| **TypeScript** | 5.8 | Type Safety |
| **Supabase JS** | 2.x | Cloud Database & Realtime WebSockets |
| **Vite** | 6.x | Build Tool & Dev Server |
| **TailwindCSS** | 4.x | Styling Design System |
| **Lucide React** | 0.546 | Icon System |
| **Motion** | 12.x | Micro-Animations |

---

## 📁 Cấu Trúc Dự Án

```
FormsAngel/
├── 📄 index.html              # Entry point HTML (favicon, fonts, meta SEO)
├── 📄 server.ts               # Express server local dev
├── 📄 vite.config.ts          # Vite configuration (React + TailwindCSS)
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 package.json            # Dependencies & scripts
├── 📄 .env.example            # Template biến môi trường
├── 📄 .env.local              # Biến môi trường cục bộ (Supabase URL & Anon Key)
│
├── 📁 public/                 # Static assets (served directly)
│   ├── 🖼️ logo.png            # Logo Ca Đoàn Thiên Thần
│   └── 🖼️ favicon.png         # Favicon tab trình duyệt
│
└── 📁 src/                    # Source code React
    ├── 📄 main.tsx            # React entry point
    ├── 📄 App.tsx             # Root component, state management
    ├── 📄 index.css           # Global styles
    ├── 📄 types.ts            # TypeScript interfaces & types
    ├── 📄 vite-env.d.ts       # Global type definitions
    │
    ├── 📁 components/         # React UI Components
    │   ├── 📄 Header.tsx          # Navigation bar, tabs, dark mode toggle, logo
    │   ├── 📄 RegistrationForm.tsx # Form ghi danh ca viên mới
    │   ├── 📄 MembersTable.tsx     # Bảng danh sách, tìm kiếm, lọc, sắp xếp
    │   ├── 📄 StatsAndBirthdays.tsx # Thống kê & sinh nhật tháng này
    │   ├── 📄 EditMemberModal.tsx  # Modal chỉnh sửa thông tin ca viên
    │   ├── 📄 DeleteConfirmModal.tsx # Modal xác nhận xóa ca viên
    │   ├── 📄 PrintView.tsx        # Giao diện in ấn / xuất PDF A4
    │   └── 📄 Toast.tsx            # Hệ thống thông báo toast
    │
    ├── 📁 lib/
    │   ├── 📄 supabase.ts     # Khởi tạo Supabase Client & Realtime config
    │   └── 📄 api.ts          # Supabase CRUD operations & WebSocket subscribers
    │
    ├── 📁 utils/
    │   └── 📄 csvExport.ts    # Xuất Excel & CSV, sắp xếp tiếng Việt A-Z
    │
    └── 📁 data/
        └── 📄 initialMembers.ts # Dữ liệu mẫu khởi tạo
```

---

## 🚀 Cài Đặt & Chạy Dự Án

### Bước 1: Clone Dự Án
```bash
git clone https://github.com/NathanDev-tech/FormsAngel.git
cd FormsAngel
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Tạo File Môi Trường Cục Bộ (`.env.local`)
```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
VITE_SUPABASE_URL="https://YOUR_SUPABASE_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### Bước 4: Chạy Development Server
```bash
npm run dev
```

Mở trình duyệt tại: **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Biến Môi Trường

| Biến | Mô Tả | Tùy Chọn |
|------|--------|---------|
| `VITE_SUPABASE_URL` | URL kết nối Supabase Cloud | Đã có fallback sẵn |
| `VITE_SUPABASE_ANON_KEY` | Khoá Anon Key công khai | Đã có fallback sẵn |
| `GEMINI_API_KEY` | Khóa API Gemini AI | Tùy chọn |
| `APP_URL` | URL ứng dụng local | `http://localhost:3000` |

---

<div align="center">

Được xây dựng với ❤️ cho **Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa**

*"Cantare amantis est"* — Hát là điều của người yêu mến

**[⬆ Về Đầu Trang](#-ca-đoàn-thiên-thần--formsangel)**

</div>
