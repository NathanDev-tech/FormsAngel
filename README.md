<div align="center">

<img width="120" height="120" alt="Logo Ca Đoàn Thiên Thần" src="./public/logo.png" />

# 🎵 Ca Đoàn Thiên Thần — FormsAngel

**Cổng Thông Tin Quản Lý Ca Đoàn Giáo Xứ Bắc Hòa**

[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> *"Hát là cầu nguyện hai lần"* — Thánh Augustinô

[🚀 Demo Trực Tuyến](#) · [📖 Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng) · [🐛 Báo Lỗi](https://github.com/NathanDev-tech/FormsAngel/issues) · [💡 Góp Ý](https://github.com/NathanDev-tech/FormsAngel/issues)

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Chạy Dự Án](#-cài-đặt--chạy-dự-án)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [API Documentation](#-api-documentation)
- [Cấu Trúc Dữ Liệu](#-cấu-trúc-dữ-liệu)
- [Xuất Dữ Liệu](#-xuất-dữ-liệu)
- [Giao Diện & UX](#-giao-diện--ux)
- [Biến Môi Trường](#-biến-môi-trường)
- [Đóng Góp](#-đóng-góp)

---

## 🎼 Giới Thiệu

**FormsAngel** là hệ thống quản lý ca viên dành riêng cho **Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa**. Được xây dựng với công nghệ hiện đại, ứng dụng cung cấp đầy đủ công cụ để:

- ✅ **Ghi danh** ca viên mới với form thông tin chi tiết
- ✅ **Quản lý danh sách** toàn bộ ca viên, phân loại theo lớp giáo lý
- ✅ **Theo dõi sinh nhật** các ca viên trong tháng hiện tại
- ✅ **Xuất danh sách** ra Excel/CSV chuẩn định dạng để in ấn và lưu trữ
- ✅ **In bản danh sách A4** chính thức trực tiếp từ trình duyệt

Hệ thống lưu trữ dữ liệu cục bộ dưới dạng file JSON, không cần database phức tạp — hoạt động tốt ngay cả khi không có kết nối Internet.

---

## ✨ Tính Năng Nổi Bật

### 📝 1. Ghi Danh Ca Viên

Form đăng ký ca viên mới với các trường thông tin đầy đủ:

| Trường | Mô Tả | Bắt Buộc |
|--------|--------|----------|
| **Tên Thánh** | Tên Thánh bổn mạng (Giuse, Maria, Têrêsa...) | ❌ Không |
| **Họ và Tên** | Họ tên đầy đủ của ca viên | ❌ Không |
| **Ngày Sinh** | Định dạng `YYYY-MM-DD` hoặc chỉ năm `YYYY` | ❌ Không |
| **Giọng / Lớp** | Lớp giáo lý (Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời) | ❌ Không |
| **Số Điện Thoại** | Liên lạc trực tiếp | ❌ Không |
| **Bổn Phận** | Vai trò trong ca đoàn | ❌ Không |
| **Trạng Thái** | Hoạt động / Tạm nghỉ / Nghỉ hẳn | ❌ Không |
| **Ghi Chú** | Thông tin bổ sung tùy ý | ❌ Không |

> 💡 **Thiết kế không ràng buộc:** Mọi trường đều không bắt buộc — ca viên có thể được ghi danh dù chưa đủ thông tin, dữ liệu vẫn được lưu thành công.

---

### 📊 2. Danh Sách Thành Viên

Bảng danh sách toàn bộ ca viên với đầy đủ tính năng:

#### 🔍 Tìm Kiếm & Lọc
- **Tìm kiếm tức thời** theo Tên Thánh, Họ Tên, Lớp, Số điện thoại
- **Lọc theo Lớp giáo lý** — dropdown lọc nhanh theo từng nhóm lớp
- **Lọc sinh nhật tháng này** — hiển thị riêng ca viên có sinh nhật trong tháng hiện tại
- **Xóa bộ lọc** một click để hiển thị lại toàn bộ danh sách

#### ↕️ Sắp Xếp Thông Minh
- Sắp xếp theo **bất kỳ cột** bằng một click (Tên Thánh, Họ Tên, Năm sinh, Lớp, SĐT...)
- Thuật toán sắp xếp **tiếng Việt chuẩn**: ưu tiên theo Tên → Họ đệm, hỗ trợ đầy đủ dấu thanh điệu
- Toggle **tăng dần / giảm dần** với icon mũi tên trực quan

#### 🎂 Highlight Sinh Nhật
- Hàng ca viên có sinh nhật tháng này được **tô màu vàng nhạt** nổi bật
- Badge `🎂 Sinh nhật` **nhấp nháy** bên cạnh tên ca viên
- Số lượng sinh nhật hiển thị ngay trên tab **Thống Kê**

#### 📞 Gọi Điện Trực Tiếp
- Số điện thoại là **liên kết `tel:`** — nhấn để gọi ngay trên thiết bị di động

#### ✏️ Chỉnh Sửa & Xóa
- **Modal chỉnh sửa** với form đầy đủ thông tin, cập nhật realtime
- **Xác nhận trước khi xóa** với modal cảnh báo để tránh nhầm lẫn

---

### 📈 3. Thống Kê & Sinh Nhật

Tab **Thống Kê** cung cấp cái nhìn tổng quan về ca đoàn:

#### Metric Cards
- 🧑‍🤝‍🧑 **Tổng số ca viên** hiện tại
- 🎂 **Số ca viên sinh nhật** trong tháng này
- 📚 **4 Khối Lớp** giáo lý chính

#### Danh Sách Sinh Nhật Tháng Này
- Hiển thị đầy đủ thông tin ca viên có sinh nhật trong tháng
- Nút **gọi điện chúc mừng** trực tiếp từ danh sách
- Cuộn nội dung nếu danh sách dài (max height 400px)

#### Biểu Đồ Phân Bố Ca Viên Theo Lớp
- **Progress bar** hiển thị tỷ lệ phần trăm từng lớp
- Sắp xếp theo số lượng giảm dần
- Hỗ trợ cả các lớp ngoài 4 lớp chính (lớp tùy chỉnh)

---

### 📤 4. Xuất & In Ấn

#### Xuất Excel (.xls) — Định Dạng Trang Trí Chuẩn
File Excel xuất ra được thiết kế **chuyên nghiệp như văn bản chính thức**:

- **Tiêu đề Ban Điều Hành Ca Đoàn Thiên Thần** (font Times New Roman 16pt, màu xanh đậm)
- **Khung viền vàng trang trí** trên và dưới bảng
- **Header bảng** nền xanh navy `#002060`, chữ trắng, in đậm
- **Nội dung bảng** font Times New Roman, zebra striping (xen kẽ trắng/xám nhạt)
- **Màu sắc trạng thái**: Hoạt động = xanh lá, Tạm nghỉ = vàng, Nghỉ hẳn = đỏ
- **Bảng tóm tắt** ở cuối trang: tổng số, đang hoạt động, tạm nghỉ, nghỉ hẳn
- **Tự động sắp xếp A-Z** theo tên tiếng Việt trước khi xuất
- **Tên file** có ngày xuất: `danh-sach-ca-doan-thien-than-bac-hoa-YYYY-MM-DD.xls`
- Tối ưu cho **in ngang (landscape)** trên giấy A4

Các cột trong file Excel:

| # | Cột | Mô Tả |
|---|-----|--------|
| 1 | STT | Số thứ tự |
| 2 | Tên Thánh | Tên Thánh bổn mạng |
| 3 | Họ và Tên | Họ tên đầy đủ (in đậm) |
| 4 | Năm sinh | Năm sinh |
| 5 | SĐT | Số điện thoại |
| 6 | Giọng/Lớp | Lớp giáo lý |
| 7 | Bổn phận | Vai trò trong ca đoàn |
| 8 | Trạng thái | Hoạt động / Tạm nghỉ / Nghỉ hẳn |
| 9 | Ngày gia nhập | Ngày ghi danh vào hệ thống |

#### In Bản A4 / Xuất PDF
- **Print View** mô phỏng bản in thực tế định dạng A4
- Tối ưu CSS `@media print` để in trực tiếp từ trình duyệt
- Xuất PDF bằng **Ctrl+P** → Lưu thành PDF

---

### 🔔 5. Thông Báo Toast

Hệ thống toast notification tức thời cho các thao tác:

- ✅ **Thành công** (xanh lá): Ghi danh, cập nhật thành công
- ℹ️ **Thông tin** (xanh dương): Cập nhật thông tin ca viên
- ❌ **Lỗi** (đỏ): Không thể lưu, xảy ra lỗi

---

### 🌙 6. Chế Độ Tối / Sáng (Dark Mode)

- Toggle Dark/Light mode với icon **Mặt Trăng / Mặt Trời**
- **Lưu vào `localStorage`** — giữ nguyên lựa chọn khi tải lại trang
- Hỗ trợ đầy đủ mọi component, không bị lỗi màu sắc
- Nút toggle có mặt cả trên **desktop** và **mobile**

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|-----------|----------|
| **React** | 19.0 | UI Framework |
| **TypeScript** | 5.8 | Type Safety |
| **Vite** | 6.x | Build Tool & Dev Server |
| **TailwindCSS** | 4.x | Utility-first CSS |
| **Lucide React** | 0.546 | Icon Library |
| **Motion** | 12.x | Animations |

### Backend
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|-----------|----------|
| **Node.js** | 24+ | Runtime |
| **Express** | 4.x | REST API Server |
| **tsx** | 4.x | TypeScript Runner |
| **dotenv** | 17.x | Environment Variables |

### DevTools
| Công Nghệ | Mục Đích |
|-----------|----------|
| **esbuild** | Production bundling (server) |
| **@types/express** | TypeScript definitions |
| **autoprefixer** | CSS compatibility |

---

## 📁 Cấu Trúc Dự Án

```
FormsAngel/
├── 📄 index.html              # Entry point HTML (favicon, fonts, meta SEO)
├── 📄 server.ts               # Express server + REST API + Vite middleware
├── 📄 vite.config.ts          # Vite configuration (React + TailwindCSS)
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 package.json            # Dependencies & scripts
├── 📄 .env.example            # Template biến môi trường
├── 📄 .env.local              # Biến môi trường cục bộ (không commit)
│
├── 📁 public/                 # Static assets (served directly)
│   ├── 🖼️ logo.png            # Logo Ca Đoàn (dùng trong Header)
│   └── 🖼️ favicon.png         # Favicon tab trình duyệt
│
├── 📁 data/                   # Lưu trữ dữ liệu JSON cục bộ
│   └── 📄 members.json        # Danh sách ca viên (tự động tạo)
│
└── 📁 src/                    # Source code React
    ├── 📄 main.tsx            # React entry point
    ├── 📄 App.tsx             # Root component, state management
    ├── 📄 index.css           # Global styles
    ├── 📄 types.ts            # TypeScript interfaces & types
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
    │   └── 📄 api.ts          # HTTP client gọi REST API (fetch wrapper)
    │
    ├── 📁 utils/
    │   └── 📄 csvExport.ts    # Xuất Excel & CSV, sắp xếp tiếng Việt
    │
    └── 📁 data/
        └── 📄 initialMembers.ts # Dữ liệu mẫu khởi tạo
```

---

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống

- **Node.js** `>= 18.x` (khuyến nghị Node.js 24+)
- **npm** `>= 9.x`
- Kết nối Internet (lần đầu cài đặt)

### Bước 1: Clone Dự Án

```bash
git clone https://github.com/NathanDev-tech/FormsAngel.git
cd FormsAngel
```

### Bước 2: Cài Đặt Dependencies

```bash
# Nếu bị lỗi corrupted cache, xóa cache trước:
npm cache clean --force

# Sau đó cài đặt:
npm install --prefer-online
```

### Bước 3: Tạo File Môi Trường

```bash
# Copy file mẫu
copy .env.example .env.local   # Windows
cp .env.example .env.local     # macOS/Linux
```

Mở `.env.local` và điền thông tin:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

> 💡 Lấy Gemini API Key miễn phí tại: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### Bước 4: Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **[http://localhost:3000](http://localhost:3000)**

### Scripts Có Sẵn

| Script | Lệnh | Mô Tả |
|--------|------|--------|
| `dev` | `npm run dev` | Chạy development server (tsx + Vite HMR) |
| `build` | `npm run build` | Build production (Vite + esbuild server) |
| `start` | `npm run start` | Chạy production build |
| `preview` | `npm run preview` | Preview production build với Vite |
| `lint` | `npm run lint` | Kiểm tra TypeScript errors |
| `clean` | `npm run clean` | Xóa thư mục `dist/` |

---

## 📖 Hướng Dẫn Sử Dụng

### 🟢 Ghi Danh Ca Viên Mới

1. Mở ứng dụng tại `http://localhost:3000`
2. Tab **"Đăng Ký Thành Viên"** đã được mở sẵn
3. Điền thông tin ca viên vào form:
   - **Tên Thánh**: Chọn hoặc nhập tên thánh
   - **Họ và Tên**: Nhập họ tên đầy đủ
   - **Ngày Sinh / Năm Sinh**: Có thể chỉ nhập năm
   - **Lớp Giáo Lý**: Chọn từ dropdown (Xưng Tội, Thêm Sức, Sống Đạo, Vào Đời)
   - **Số Điện Thoại**, **Bổn Phận**, **Trạng Thái**, **Ghi Chú**
4. Nhấn nút **"Ghi Danh"**
5. Thông báo xanh lá xác nhận thành công, form tự động reset

### 🔵 Xem & Tìm Kiếm Danh Sách

1. Nhấn tab **"Danh Sách"** trên thanh navigation
2. **Tìm kiếm**: Gõ vào ô tìm kiếm — kết quả lọc tức thì
3. **Lọc theo lớp**: Chọn từ dropdown "Tất cả các lớp"
4. **Lọc sinh nhật**: Nhấn nút `🎂 Sinh nhật T.x` để xem ca viên sinh nhật tháng này
5. **Sắp xếp**: Nhấn vào tiêu đề cột bất kỳ để sắp xếp

### 🟡 Chỉnh Sửa Thông Tin Ca Viên

1. Trong **Danh Sách**, tìm ca viên cần sửa
2. Nhấn icon ✏️ (bút chì) ở cuối hàng
3. Modal chỉnh sửa hiện ra với thông tin hiện tại được điền sẵn
4. Cập nhật thông tin cần thay đổi
5. Nhấn **"Lưu Thay Đổi"** — cập nhật ngay lập tức

### 🔴 Xóa Ca Viên

1. Nhấn icon 🗑️ (thùng rác) ở cuối hàng ca viên cần xóa
2. Modal xác nhận hiện ra với tên ca viên
3. Nhấn **"Xác Nhận Xóa"** để hoàn tất
4. Hoặc nhấn **"Hủy"** để bỏ qua

### 📊 Xem Thống Kê

1. Nhấn tab **"Thống Kê"** trên navigation
2. Xem nhanh 3 metric cards: Tổng ca viên, Sinh nhật tháng này, Số lớp
3. Panel **"Sinh Nhật Tháng X"**: danh sách đầy đủ ca viên sinh nhật
   - Nhấn icon 📞 để gọi chúc mừng trực tiếp
4. Panel **"Phân Bố Ca Viên Theo Lớp"**: biểu đồ progress bar từng lớp
5. Nhấn **"In danh sách A4"** để in tổng hợp

### 📤 Xuất Danh Sách

**Xuất Excel:**
1. Trong tab **"Danh Sách"**, nhấn nút `📊 Xuất Danh Sách` (màu xanh lá)
2. File `.xls` tải xuống tự động với tên `danh-sach-ca-doan-thien-than-bac-hoa-YYYY-MM-DD.xls`
3. Mở bằng Microsoft Excel, LibreOffice Calc, hoặc Google Sheets

**In PDF / Bản A4:**
1. Nhấn nút `🖨️ Bản In / PDF`
2. Cửa sổ Print View mở ra
3. Nhấn **Ctrl+P** (hoặc nút "In") → Chọn "Lưu thành PDF"

---

## 🔌 API Documentation

Server Express cung cấp REST API tại `http://localhost:3000/api`:

### Endpoints

| Method | Endpoint | Mô Tả |
|--------|----------|--------|
| `GET` | `/api/health` | Kiểm tra server hoạt động |
| `GET` | `/api/members` | Lấy toàn bộ danh sách ca viên |
| `POST` | `/api/members` | Thêm ca viên mới |
| `PUT` | `/api/members/:id` | Cập nhật thông tin ca viên |
| `DELETE` | `/api/members/:id` | Xóa ca viên khỏi danh sách |
| `POST` | `/api/members/reset` | Đặt lại danh sách về trạng thái ban đầu |

### Ví Dụ Request

**Thêm ca viên mới:**
```http
POST /api/members
Content-Type: application/json

{
  "tenThanh": "Maria",
  "hoVaTen": "Nguyễn Thị An",
  "ngaySinh": "2005-03-15",
  "lop": "Thêm Sức 1A",
  "soDienThoai": "0901234567",
  "bonPhan": "Thành viên",
  "trangThai": "Hoạt động",
  "ghiChu": "Giọng soprano"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ctt-m5x2k1-abc4",
    "tenThanh": "Maria",
    "hoVaTen": "Nguyễn Thị An",
    "ngaySinh": "2005-03-15",
    "lop": "Thêm Sức 1A",
    "soDienThoai": "0901234567",
    "bonPhan": "Thành viên",
    "trangThai": "Hoạt động",
    "ghiChu": "Giọng soprano",
    "createdAt": "2026-09-12T04:00:00.000Z",
    "updatedAt": "2026-09-12T04:00:00.000Z"
  }
}
```

---

## 📦 Cấu Trúc Dữ Liệu

### ChoirMember Interface

```typescript
interface ChoirMember {
  id: string;           // ID duy nhất, format: "ctt-{timestamp}-{random}"
  tenThanh: string;     // Tên Thánh bổn mạng
  hoVaTen: string;      // Họ và tên đầy đủ
  ngaySinh: string;     // Ngày sinh (YYYY-MM-DD hoặc YYYY)
  lop: string;          // Lớp giáo lý / giọng hát
  soDienThoai: string;  // Số điện thoại
  bonPhan?: string;     // Bổn phận / vai trò trong ca đoàn
  trangThai?: 'Hoạt động' | 'Tạm nghỉ' | 'Nghỉ hẳn' | string;
  createdAt: string;    // ISO datetime tạo
  updatedAt: string;    // ISO datetime cập nhật lần cuối
  ghiChu?: string;      // Ghi chú tùy chọn
}
```

### Dữ Liệu Lưu Trữ

Dữ liệu được lưu tại `data/members.json` dưới dạng mảng JSON:

```json
[
  {
    "id": "ctt-m5x2k1-abc4",
    "tenThanh": "Giuse",
    "hoVaTen": "Trần Văn Bình",
    "ngaySinh": "2003-08-22",
    "lop": "Sống Đạo 2B",
    "soDienThoai": "0987654321",
    "bonPhan": "Nhạc công",
    "trangThai": "Hoạt động",
    "createdAt": "2026-01-15T08:30:00.000Z",
    "updatedAt": "2026-09-10T14:00:00.000Z"
  }
]
```

### Các Lớp Giáo Lý Mặc Định

| Lớp | Màu Badge |
|-----|-----------|
| Xưng Tội | 🟡 Vàng |
| Thêm Sức | 🔴 Hồng |
| Sống Đạo | 🟢 Xanh Lá |
| Vào Đời | 🔵 Xanh Dương |

### Bổn Phận Ca Viên

- Thành viên *(mặc định)*
- Ca trưởng
- Phó Ca trưởng
- Thư ký
- Thủ quỹ
- Nhạc công

---

## 📊 Xuất Dữ Liệu

### Thuật Toán Sắp Xếp Tiếng Việt

File xuất Excel/CSV sử dụng thuật toán sắp xếp tên tiếng Việt **chuẩn quốc gia**:

1. **Ưu tiên so sánh Tên** (từ cuối cùng trong họ tên)
   - Ví dụ: "An" < "Bình" < "Cường"
2. **Nếu trùng Tên**, so sánh toàn bộ Họ & Tên đệm
   - Ví dụ: "Lê Văn An" < "Nguyễn Văn An"
3. Hỗ trợ đầy đủ **thanh điệu tiếng Việt** (`sensitivity: 'base'`)

### Định Dạng File Xuất

| Loại | Extension | Mở Bằng | Encoding |
|------|-----------|---------|---------|
| Excel | `.xls` | Microsoft Excel, LibreOffice, Google Sheets | UTF-8 |
| CSV | `.csv` | Excel, Numbers, bất kỳ text editor | UTF-8 với BOM |

---

## 🎨 Giao Diện & UX

### Design System

- **Font chữ**: `Be Vietnam Pro` (nội dung) + `Cinzel` (tiêu đề trang trọng)
- **Màu chủ đạo**: Sky Blue (`#0ea5e9`) + Amber Gold (`#f59e0b`)
- **Border Radius**: Rounded corners 2xl/3xl cho card components
- **Shadows**: Nhẹ nhàng, layered shadows cho chiều sâu

### Responsive Design

| Breakpoint | Mô Tả |
|------------|--------|
| Mobile (`< 768px`) | Single column, simplified navigation |
| Tablet (`768px - 1024px`) | 2-column layout, condensed table |
| Desktop (`> 1024px`) | Full 7-column layout, side-by-side panels |

### Dark Mode

Mỗi component hỗ trợ đầy đủ class `dark:` của TailwindCSS. Trạng thái dark mode được persist qua `localStorage` key `ca_doan_dark_mode`.

### Micro-Animations

- **Hover scale**: Logo và buttons có hiệu ứng scale khi hover
- **Sparkle pulse**: Ngôi sao lấp lánh nhấp nháy liên tục trên logo
- **Birthday bounce**: Badge sinh nhật có animation bounce
- **Spinner**: Loading indicator khi tải dữ liệu ban đầu
- **Progress bar transition**: Biểu đồ progress bar có transition 500ms

---

## 🔐 Biến Môi Trường

| Biến | Mô Tả | Mặc Định |
|------|--------|---------|
| `GEMINI_API_KEY` | Khóa API Gemini (cho tính năng AI nếu có) | *(bắt buộc)* |
| `APP_URL` | URL của ứng dụng | `http://localhost:3000` |

> ⚠️ **Lưu ý bảo mật**: File `.env.local` đã được thêm vào `.gitignore`. **Không bao giờ commit file này lên GitHub.**

---

## 🐛 Xử Lý Lỗi Thường Gặp

### `EADDRINUSE: Port 3000 already in use`
Server cũ vẫn đang chạy. Tìm và kill process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### `npm install` báo lỗi corrupted tarball
Cache npm bị hỏng. Xóa cache và thử lại:
```bash
npm cache clean --force
npm install --prefer-online
```

### WebSocket server error: Port 24678 is already in use
Vite HMR WebSocket bị chiếm. Kill toàn bộ Node.js processes:
```bash
taskkill /F /IM node.exe  # Windows
pkill node                 # macOS/Linux
```

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. **Fork** repository này
2. Tạo **feature branch**: `git checkout -b feature/ten-tinh-nang`
3. **Commit** thay đổi: `git commit -m "feat: thêm tính năng X"`
4. **Push** lên branch: `git push origin feature/ten-tinh-nang`
5. Mở **Pull Request**

---

## 📜 License

Dự án này được phát hành dưới giấy phép **MIT License**.

---

<div align="center">

Được xây dựng với ❤️ cho **Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa**

*"Cantare amantis est"* — Hát là điều của người yêu mến

**[⬆ Về Đầu Trang](#-ca-đoàn-thiên-thần--formsangel)**

</div>
