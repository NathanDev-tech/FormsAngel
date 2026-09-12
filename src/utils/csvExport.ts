import { ChoirMember } from '../types.ts';

/**
 * So sánh 2 tên tiếng Việt theo thứ tự bảng chữ cái A-Z
 * Quy tắc chuẩn Việt Nam: Ưu tiên so sánh Tên (từ cuối cùng), nếu trùng tên thì so sánh Họ & Tên đệm
 */
export function compareVietnameseNames(fullNameA: string | undefined | null, fullNameB: string | undefined | null): number {
  const cleanA = (fullNameA || '').trim();
  const cleanB = (fullNameB || '').trim();
  if (!cleanA && !cleanB) return 0;
  if (!cleanA) return 1;
  if (!cleanB) return -1;

  const partsA = cleanA.split(/\s+/);
  const partsB = cleanB.split(/\s+/);
  const firstNameA = partsA[partsA.length - 1];
  const firstNameB = partsB[partsB.length - 1];

  // So sánh Tên trước (Ví dụ: "An" < "Bình" < "Cường")
  const cmp = firstNameA.localeCompare(firstNameB, 'vi', { sensitivity: 'base' });
  if (cmp !== 0) {
    return cmp;
  }

  // Nếu cùng Tên, so sánh toàn bộ Họ & Tên Đệm (Ví dụ: "Lê Văn An" < "Nguyễn Văn An")
  return cleanA.localeCompare(cleanB, 'vi', { sensitivity: 'base' });
}

/**
 * Hàm chuẩn hóa chuỗi dữ liệu CSV:
 * - Thay thế dấu ngoặc kép bằng 2 dấu ngoặc kép (" -> "")
 * - Bọc trong dấu ngoặc kép nếu chứa dấu phẩy, ngoặc kép hoặc xuống dòng
 */
export function escapeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Định dạng ngày sinh hiển thị linh hoạt (Ví dụ: 15/08 hoặc 15/08/2005)
 */
export function formatDateVi(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  const clean = dateStr.trim();
  if (clean.includes('T')) return formatDateVi(clean.split('T')[0]);

  // Nếu đã ở dạng DD/MM hoặc DD/MM/YYYY
  if (clean.includes('/')) return clean;

  // Nếu ở dạng YYYY-MM-DD
  const parts = clean.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  if (parts.length === 2) {
    const [p1, p2] = parts;
    if (p1.length === 4) return `${p2}/${p1}`;
    return `${p1}/${p2}`;
  }

  return clean;
}

/**
 * Lấy Ngày sinh / Năm sinh cho báo cáo và xuất Excel
 */
export function getBirthYear(dateStr: string | undefined | null): string {
  return formatDateVi(dateStr);
}

/**
 * Trả về style CSS trang trí badge lớp học trong file Excel theo đúng quy định màu sắc:
 * - Xưng Tội: Xanh lá (#dcfce7 / #15803d)
 * - Thêm Sức: Xanh nước biển (#dbeafe / #1d4ed8)
 * - Sống Đạo: Màu vàng (#fef3c7 / #b45309)
 * - Vào Đời: Màu nâu (#f5e6d3 / #78350f)
 * - Giáo Lý Viên / Dự Trưởng: Màu đỏ (#fee2e2 / #b91c1c)
 */
export function getExcelClassBadgeStyle(className: string | undefined | null): string {
  if (!className || className === '—') return 'color: #64748b; font-style: italic;';
  const lower = className.toLowerCase().trim();

  if (lower.includes('giáo lý') || lower.includes('dự trưởng') || lower.includes('glv')) {
    return 'background-color: #fee2e2; color: #b91c1c; font-weight: bold; border: 0.5pt solid #fca5a5; padding: 2pt 8pt; border-radius: 4pt;';
  }
  if (lower.includes('xưng tội')) {
    return 'background-color: #dcfce7; color: #15803d; font-weight: bold; border: 0.5pt solid #bbf7d0; padding: 2pt 8pt; border-radius: 4pt;';
  }
  if (lower.includes('thêm sức')) {
    return 'background-color: #dbeafe; color: #1d4ed8; font-weight: bold; border: 0.5pt solid #bfdbfe; padding: 2pt 8pt; border-radius: 4pt;';
  }
  if (lower.includes('sống đạo')) {
    return 'background-color: #fef3c7; color: #b45309; font-weight: bold; border: 0.5pt solid #fde68a; padding: 2pt 8pt; border-radius: 4pt;';
  }
  if (lower.includes('vào đời')) {
    return 'background-color: #f5e6d3; color: #78350f; font-weight: bold; border: 0.5pt solid #e6ccb2; padding: 2pt 8pt; border-radius: 4pt;';
  }

  return 'background-color: #e0f2fe; color: #0369a1; font-weight: bold; border: 0.5pt solid #bae6fd; padding: 2pt 8pt; border-radius: 4pt;';
}

/**
 * THIẾT KẾ MỚI HOÀN TOÀN — Xuất Excel theo phong cách văn bản giáo xứ sang trọng:
 * - Header gradient đẹp với logo thánh nhạc, tên giáo xứ nổi bật
 * - Bảng thống kê 4 thẻ (card) màu sắc trực quan ngay dưới tiêu đề
 * - Bảng danh sách hiện đại: viền trái màu theo lớp, badge màu chuẩn
 * - Footer ký xác nhận trang trọng với 3 vị trí: Ca trưởng, Thư ký, Ban Điều Hành
 */
export function exportDecoratedExcel(
  members: ChoirMember[],
  parishName = 'GIÁO XỨ BẮC HÒA',
  filenamePrefix = 'danh-sach-ca-doan-thien-than-bac-hoa'
): void {
  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const monthYearStr = `Tháng ${String(now.getMonth() + 1).padStart(2, '0')} / ${now.getFullYear()}`;

  // Tự động sắp xếp danh sách theo bảng chữ cái tiếng Việt
  const sorted = [...members].sort((a, b) => compareVietnameseNames(a.hoVaTen, b.hoVaTen));

  const totalCount = sorted.length;
  const activeCount = sorted.filter(m => (m.trangThai || 'Hoạt động') === 'Hoạt động').length;
  const pauseCount = sorted.filter(m => m.trangThai === 'Tạm nghỉ').length;
  const leaveCount = sorted.filter(m => m.trangThai === 'Nghỉ hẳn').length;

  // Hàm lấy màu viền trái theo lớp
  function getLeftBorderColor(lop: string | undefined): string {
    if (!lop) return '#94a3b8';
    const l = lop.toLowerCase();
    if (l.includes('giáo lý') || l.includes('dự trưởng')) return '#dc2626';
    if (l.includes('xưng tội')) return '#16a34a';
    if (l.includes('thêm sức')) return '#1d4ed8';
    if (l.includes('sống đạo')) return '#d97706';
    if (l.includes('vào đời')) return '#78350f';
    return '#0ea5e9';
  }

  // Hàm lấy màu badge lớp học (nền + chữ)
  function getClassBadge(lop: string): string {
    if (!lop || lop === '—') return `<span style="color:#94a3b8;font-style:italic;">—</span>`;
    const l = lop.toLowerCase();
    let bg = '#e0f2fe'; let color = '#0369a1'; let border = '#bae6fd';
    if (l.includes('giáo lý') || l.includes('dự trưởng')) { bg='#fef2f2'; color='#b91c1c'; border='#fecaca'; }
    else if (l.includes('xưng tội'))  { bg='#f0fdf4'; color='#15803d'; border='#bbf7d0'; }
    else if (l.includes('thêm sức'))  { bg='#eff6ff'; color='#1d4ed8'; border='#bfdbfe'; }
    else if (l.includes('sống đạo'))  { bg='#fffbeb'; color='#b45309'; border='#fde68a'; }
    else if (l.includes('vào đời'))   { bg='#fdf4e7'; color='#92400e'; border='#fcd9a0'; }
    return `<span style="display:inline-block;background:${bg};color:${color};border:1pt solid ${border};border-radius:3pt;padding:1pt 7pt;font-weight:bold;font-size:10pt;">${lop}</span>`;
  }

  // Hàm lấy badge trạng thái
  function getStatusBadge(status: string): string {
    let bg='#f0fdf4'; let color='#15803d'; let border='#bbf7d0'; let icon='✔';
    if (status === 'Tạm nghỉ')  { bg='#fffbeb'; color='#b45309'; border='#fde68a'; icon='⏸'; }
    if (status === 'Nghỉ hẳn')  { bg='#fef2f2'; color='#b91c1c'; border='#fecaca'; icon='✖'; }
    return `<span style="display:inline-block;background:${bg};color:${color};border:1pt solid ${border};border-radius:3pt;padding:1pt 7pt;font-weight:bold;font-size:10pt;">${icon} ${status}</span>`;
  }

  // Dữ liệu từng dòng
  const rowsHtml = sorted.map((member, index) => {
    const birth = getBirthYear(member.ngaySinh);
    const phone = member.soDienThoai || '—';
    const lop   = member.lop || '—';
    const role  = member.bonPhan || 'Thành viên';
    const status = member.trangThai || 'Hoạt động';
    const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    const leftBorder = getLeftBorderColor(member.lop);

    return `
    <tr style="height:27pt;mso-height-source:userset;background-color:${bg};font-family:'Times New Roman',serif;">
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border-top:0.5pt solid #e2e8f0;border-bottom:0.5pt solid #e2e8f0;border-right:0.5pt solid #e2e8f0;border-left:3pt solid ${leftBorder};text-align:center;vertical-align:middle;color:#64748b;font-weight:bold;">${index + 1}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #e2e8f0;text-align:center;vertical-align:middle;color:#1e40af;font-weight:bold;">${member.tenThanh || '—'}</td>
      <td style="font-family:'Times New Roman',serif;font-size:11pt;border:0.5pt solid #e2e8f0;text-align:left;vertical-align:middle;padding-left:8pt;font-weight:bold;color:#0f172a;">${member.hoVaTen || '—'}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #e2e8f0;text-align:center;vertical-align:middle;color:#334155;">${birth || '—'}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #e2e8f0;text-align:center;vertical-align:middle;mso-number-format:'\\@';color:#334155;">${phone}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #e2e8f0;text-align:center;vertical-align:middle;">${getClassBadge(lop)}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #e2e8f0;text-align:center;vertical-align:middle;color:#475569;">${role}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #e2e8f0;text-align:center;vertical-align:middle;">${getStatusBadge(status)}</td>
    </tr>`;
  }).join('');

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <!--[if gte mso 9]><xml>
    <x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      <x:Name>Ca Đoàn Thiên Thần</x:Name>
      <x:WorksheetOptions>
        <x:FitToPage/>
        <x:Print>
          <x:FitWidth>1</x:FitWidth><x:FitHeight>100</x:FitHeight>
          <x:ValidPrinterInfo/><x:PaperSizeIndex>9</x:PaperSizeIndex>
          <x:HorizontalResolution>600</x:HorizontalResolution>
          <x:VerticalResolution>600</x:VerticalResolution>
        </x:Print>
      </x:WorksheetOptions>
    </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
  </xml><![endif]-->
  <style>
  <!--
    @page { mso-page-orientation:landscape; margin:0.4in 0.45in 0.4in 0.45in; }
    body,table,td,th { font-family:'Times New Roman',Times,serif !important; }
  -->
  </style>
</head>
<body style="font-family:'Times New Roman',serif;margin:0;padding:0;background:#f1f5f9;">

<!-- ═══════════════════════════════════════════════
     HEADER: Gradient xanh tím sang trọng
═══════════════════════════════════════════════ -->
<table style="width:100%;border-collapse:collapse;margin-bottom:0;">
  <!-- Thanh accent màu vàng rực -->
  <tr><td colspan="8" style="height:6pt;background:linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b);background-color:#f59e0b;font-size:1pt;line-height:6pt;">&nbsp;</td></tr>
  <!-- Header chính gradient xanh tím -->
  <tr>
    <td colspan="8" style="background-color:#1e3a5f;padding:14pt 20pt 10pt 20pt;text-align:center;vertical-align:middle;">
      <div style="font-family:'Times New Roman',serif;font-size:11pt;color:#93c5fd;font-weight:normal;letter-spacing:2pt;text-transform:uppercase;margin-bottom:4pt;">✟ &nbsp; GIÁO HỘI CÔNG GIÁO &nbsp; ✟</div>
      <div style="font-family:'Times New Roman',serif;font-size:20pt;font-weight:bold;color:#ffffff;text-transform:uppercase;letter-spacing:1pt;">Ca Đoàn Thiên Thần</div>
      <div style="font-family:'Times New Roman',serif;font-size:13pt;color:#fbbf24;font-weight:bold;margin-top:3pt;">${parishName}</div>
      <div style="font-family:'Times New Roman',serif;font-size:10pt;color:#94a3b8;margin-top:6pt;font-style:italic;">DANH SÁCH CA VIÊN &nbsp;—&nbsp; ${monthYearStr}</div>
    </td>
  </tr>
  <!-- Thanh accent màu vàng dưới header -->
  <tr><td colspan="8" style="height:4pt;background-color:#f59e0b;font-size:1pt;line-height:4pt;">&nbsp;</td></tr>
</table>

<!-- ═══════════════════════════════════════════════
     THỐNG KÊ: 4 thẻ card nằm ngang
═══════════════════════════════════════════════ -->
<table style="width:100%;border-collapse:separate;border-spacing:6pt;margin:10pt 0 6pt 0;">
  <tr>
    <!-- Card 1: Tổng -->
    <td style="width:25%;background-color:#1e3a5f;border-radius:6pt;padding:10pt 12pt;text-align:center;vertical-align:middle;">
      <div style="font-family:'Times New Roman',serif;font-size:24pt;font-weight:bold;color:#ffffff;line-height:1;">${totalCount}</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#93c5fd;margin-top:3pt;font-weight:bold;letter-spacing:0.5pt;text-transform:uppercase;">Tổng Ca Viên</div>
    </td>
    <!-- Card 2: Hoạt động -->
    <td style="width:25%;background-color:#f0fdf4;border:1.5pt solid #86efac;border-radius:6pt;padding:10pt 12pt;text-align:center;vertical-align:middle;">
      <div style="font-family:'Times New Roman',serif;font-size:24pt;font-weight:bold;color:#15803d;line-height:1;">${activeCount}</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#16a34a;margin-top:3pt;font-weight:bold;letter-spacing:0.5pt;text-transform:uppercase;">✔ Đang Hoạt Động</div>
    </td>
    <!-- Card 3: Tạm nghỉ -->
    <td style="width:25%;background-color:#fffbeb;border:1.5pt solid #fcd34d;border-radius:6pt;padding:10pt 12pt;text-align:center;vertical-align:middle;">
      <div style="font-family:'Times New Roman',serif;font-size:24pt;font-weight:bold;color:#b45309;line-height:1;">${pauseCount}</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#d97706;margin-top:3pt;font-weight:bold;letter-spacing:0.5pt;text-transform:uppercase;">⏸ Tạm Nghỉ</div>
    </td>
    <!-- Card 4: Nghỉ hẳn -->
    <td style="width:25%;background-color:#fef2f2;border:1.5pt solid #fca5a5;border-radius:6pt;padding:10pt 12pt;text-align:center;vertical-align:middle;">
      <div style="font-family:'Times New Roman',serif;font-size:24pt;font-weight:bold;color:#b91c1c;line-height:1;">${leaveCount}</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#dc2626;margin-top:3pt;font-weight:bold;letter-spacing:0.5pt;text-transform:uppercase;">✖ Nghỉ Hẳn</div>
    </td>
  </tr>
</table>

<!-- Chú thích màu lớp học -->
<table style="width:100%;border-collapse:collapse;margin-bottom:8pt;">
  <tr>
    <td style="padding:4pt 0 2pt 2pt;">
      <span style="font-family:'Times New Roman',serif;font-size:9pt;color:#64748b;font-style:italic;">Chú thích màu lớp: &nbsp;</span>
      <span style="font-family:'Times New Roman',serif;font-size:9pt;background:#f0fdf4;color:#15803d;border:0.5pt solid #bbf7d0;padding:0pt 5pt;font-weight:bold;">Xưng Tội</span>&nbsp;
      <span style="font-family:'Times New Roman',serif;font-size:9pt;background:#eff6ff;color:#1d4ed8;border:0.5pt solid #bfdbfe;padding:0pt 5pt;font-weight:bold;">Thêm Sức</span>&nbsp;
      <span style="font-family:'Times New Roman',serif;font-size:9pt;background:#fffbeb;color:#b45309;border:0.5pt solid #fde68a;padding:0pt 5pt;font-weight:bold;">Sống Đạo</span>&nbsp;
      <span style="font-family:'Times New Roman',serif;font-size:9pt;background:#fdf4e7;color:#92400e;border:0.5pt solid #fcd9a0;padding:0pt 5pt;font-weight:bold;">Vào Đời</span>&nbsp;
      <span style="font-family:'Times New Roman',serif;font-size:9pt;background:#fef2f2;color:#b91c1c;border:0.5pt solid #fecaca;padding:0pt 5pt;font-weight:bold;">GLV / Dự Trưởng</span>
    </td>
  </tr>
</table>

<!-- ═══════════════════════════════════════════════
     BẢNG DANH SÁCH CA VIÊN
═══════════════════════════════════════════════ -->
<table style="width:100%;border-collapse:collapse;border:1pt solid #cbd5e1;box-shadow:0 2pt 8pt rgba(0,0,0,0.08);">
  <colgroup>
    <col style="width:38pt;">
    <col style="width:100pt;">
    <col style="width:210pt;">
    <col style="width:80pt;">
    <col style="width:105pt;">
    <col style="width:125pt;">
    <col style="width:105pt;">
    <col style="width:100pt;">
  </colgroup>
  <!-- Header cột -->
  <thead>
    <tr style="background-color:#1e3a5f;height:30pt;mso-height-source:userset;">
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 3pt;letter-spacing:0.3pt;">STT</th>
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#93c5fd;text-align:center;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 6pt;letter-spacing:0.3pt;">Tên Thánh</th>
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#ffffff;text-align:left;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 8pt;letter-spacing:0.3pt;">Họ và Tên</th>
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 3pt;letter-spacing:0.3pt;">Ngày sinh</th>
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 4pt;letter-spacing:0.3pt;">Số ĐT</th>
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#fbbf24;text-align:center;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 6pt;letter-spacing:0.3pt;">Giọng / Lớp</th>
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 4pt;letter-spacing:0.3pt;">Bổn Phận</th>
      <th style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;padding:5pt 4pt;letter-spacing:0.3pt;">Trạng Thái</th>
    </tr>
    <!-- Thanh trang trí màu vàng phân tách header -->
    <tr><td colspan="8" style="height:3pt;background-color:#f59e0b;font-size:1pt;line-height:3pt;">&nbsp;</td></tr>
  </thead>
  <tbody>
    ${rowsHtml || `<tr><td colspan="8" style="font-family:'Times New Roman',serif;font-size:11pt;text-align:center;height:40pt;color:#94a3b8;padding:15pt;">Chưa có dữ liệu thành viên</td></tr>`}
    <!-- Thanh kết thúc bảng -->
    <tr><td colspan="8" style="height:3pt;background-color:#1e3a5f;font-size:1pt;line-height:3pt;">&nbsp;</td></tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════
     THÔNG TIN XUẤT & NGÀY THÁNG
═══════════════════════════════════════════════ -->
<table style="width:100%;border-collapse:collapse;margin-top:10pt;">
  <tr>
    <td style="width:60%;padding:4pt 0;vertical-align:top;">
      <span style="font-family:'Times New Roman',serif;font-size:9pt;color:#64748b;font-style:italic;">
        📅 Ngày xuất: <b style="color:#1e3a5f;">${todayStr}</b> &nbsp;|&nbsp; 
        Tổng số: <b style="color:#1e3a5f;">${totalCount} ca viên</b> &nbsp;|&nbsp;
        Hoạt động: <b style="color:#15803d;">${activeCount}</b> &nbsp;|&nbsp;
        Tạm nghỉ: <b style="color:#b45309;">${pauseCount}</b> &nbsp;|&nbsp;
        Nghỉ hẳn: <b style="color:#b91c1c;">${leaveCount}</b>
      </span>
    </td>
    <td style="width:40%;text-align:right;padding:4pt 0;vertical-align:top;">
      <span style="font-family:'Times New Roman',serif;font-size:9pt;color:#94a3b8;font-style:italic;">Tài liệu nội bộ — Ban Điều Hành Ca Đoàn Thiên Thần</span>
    </td>
  </tr>
</table>

<!-- ═══════════════════════════════════════════════
     FOOTER KÝ XÁC NHẬN (3 vị trí)
═══════════════════════════════════════════════ -->
<table style="width:100%;border-collapse:collapse;margin-top:18pt;">
  <tr>
    <td style="width:33%;text-align:center;vertical-align:top;padding:0 10pt;">
      <div style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#1e3a5f;margin-bottom:2pt;">CA TRƯỞNG</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#94a3b8;font-style:italic;">(Ký và ghi rõ họ tên)</div>
      <div style="height:36pt;border-bottom:1pt solid #cbd5e1;margin:6pt 10pt 4pt 10pt;"></div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#64748b;">&nbsp;</div>
    </td>
    <td style="width:33%;text-align:center;vertical-align:top;padding:0 10pt;">
      <div style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#1e3a5f;margin-bottom:2pt;">THƯ KÝ</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#94a3b8;font-style:italic;">(Ký và ghi rõ họ tên)</div>
      <div style="height:36pt;border-bottom:1pt solid #cbd5e1;margin:6pt 10pt 4pt 10pt;"></div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#64748b;">&nbsp;</div>
    </td>
    <td style="width:33%;text-align:center;vertical-align:top;padding:0 10pt;">
      <div style="font-family:'Times New Roman',serif;font-size:10pt;font-weight:bold;color:#1e3a5f;margin-bottom:2pt;">BAN ĐIỀU HÀNH</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#94a3b8;font-style:italic;"><i>${parishName}</i></div>
      <div style="height:36pt;border-bottom:1pt solid #cbd5e1;margin:6pt 10pt 4pt 10pt;"></div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#64748b;">&nbsp;</div>
    </td>
  </tr>
</table>

<!-- Dải cuối trang -->
<table style="width:100%;border-collapse:collapse;margin-top:10pt;">
  <tr>
    <td colspan="8" style="height:5pt;background:linear-gradient(90deg,#1e3a5f,#f59e0b,#1e3a5f);background-color:#1e3a5f;font-size:1pt;line-height:5pt;">&nbsp;</td>
  </tr>
</table>

</body>
</html>`;

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const fileName = `${filenamePrefix}-${yyyy}-${mm}-${dd}.xls`;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}



/**
 * Xuất danh sách ca viên ra file CSV chuẩn có đầy đủ tiêu đề và định dạng (Đã bỏ cột Ngày gia nhập)
 */
export function exportMembersToCsv(
  members: ChoirMember[],
  parishName = 'GIÁO XỨ BẮC HÒA',
  filenamePrefix = 'danh-sach-ca-doan-thien-than-bac-hoa'
): void {
  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  
  // Tự động sắp xếp danh sách theo bảng chữ cái A-Z
  const sorted = [...members].sort((a, b) => compareVietnameseNames(a.hoVaTen, b.hoVaTen));

  const totalCount = sorted.length;
  const activeCount = sorted.filter(m => (m.trangThai || 'Hoạt động') === 'Hoạt động').length;
  const pauseCount = sorted.filter(m => m.trangThai === 'Tạm nghỉ').length;
  const leaveCount = sorted.filter(m => m.trangThai === 'Nghỉ hẳn').length;

  // Dòng tiêu đề trang trí đầu file CSV
  const titleLine = escapeCsvCell(`BAN ĐIỀU HÀNH CA ĐOÀN THIÊN THẦN — DANH SÁCH CA VIÊN (${parishName})`);
  const metaLine = `Ngày xuất: ${todayStr},Tổng: ${totalCount} ca viên,Hoạt động: ${activeCount},Tạm nghỉ: ${pauseCount},Nghỉ hẳn: ${leaveCount}`;

  // Dòng tiêu đề cột chuẩn (8 cột - không có Ngày gia nhập)
  const headers = ['STT', 'Tên Thánh', 'Họ và Tên', 'Ngày sinh', 'SĐT', 'Giọng/Lớp', 'Bổn phận', 'Trạng thái'];
  const headerRow = headers.map(escapeCsvCell).join(',');

  // Dữ liệu từng ca viên
  const rows = sorted.map((member, index) => {
    return [
      escapeCsvCell(index + 1),
      escapeCsvCell(member.tenThanh || '—'),
      escapeCsvCell(member.hoVaTen || '—'),
      escapeCsvCell(getBirthYear(member.ngaySinh)),
      escapeCsvCell(member.soDienThoai ? `\t${member.soDienThoai}` : '—'), // \t để Excel giữ nguyên số 0 đầu
      escapeCsvCell(member.lop || '—'),
      escapeCsvCell(member.bonPhan || 'Thành viên'),
      escapeCsvCell(member.trangThai || 'Hoạt động'),
    ].join(',');
  });

  // Tóm tắt ở cuối bảng
  const footerRows = [
    '',
    `Tổng số ca viên:,${totalCount}`,
    `Đang hoạt động:,${activeCount}`,
    `Tạm nghỉ:,${pauseCount}`,
    `Nghỉ hẳn:,${leaveCount}`
  ];

  // BOM UTF-8
  const csvContent = '\uFEFF' + [titleLine, metaLine, '', headerRow, ...rows, ...footerRows].join('\r\n');

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const fileName = `${filenamePrefix}-${yyyy}-${mm}-${dd}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Kiểu dữ liệu dòng ca viên sau khi parse CSV
 */
export interface ParsedCsvMemberRow {
  rowNumber: number;
  data: {
    tenThanh: string;
    hoVaTen: string;
    ngaySinh: string;
    lop: string;
    soDienThoai: string;
    bonPhan: string;
    trangThai: string;
    ghiChu: string;
  };
  isValid: boolean;
  errorReason?: string;
}

/**
 * Tách dòng CSV thành các cột, hỗ trợ dấu ngoặc kép và dấu phẩy
 */
export function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields.map(f => f.trim().replace(/^"|"$/g, ''));
}

/**
 * Tách nội dung CSV thành các dòng (xử lý xuống dòng trong dấu ngoặc kép và BOM)
 */
export function parseRawCsvLines(text: string): string[] {
  const clean = text.replace(/^\uFEFF/, '');
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && clean[i + 1] === '\n') {
        i++;
      }
      if (current.trim()) {
        lines.push(current);
      }
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    lines.push(current);
  }
  return lines;
}

/**
 * Đọc và phân tích toàn bộ nội dung file CSV thành danh sách ca viên có kiểm tra định dạng
 */
export function parseCsvContent(csvText: string): ParsedCsvMemberRow[] {
  const rawLines = parseRawCsvLines(csvText);
  const parsedRows: ParsedCsvMemberRow[] = [];

  let headerMap: { [key: string]: number } | null = null;
  let dataRowIndex = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    // Bo qua cac dong tieu de trang tri hoac tom tat
    const lowerLine = line.toLowerCase();
    if (
      lowerLine.includes('ban điều hành ca đoàn') ||
      lowerLine.includes('ngày xuất:') ||
      lowerLine.includes('tổng số ca viên:') ||
      lowerLine.includes('đang hoạt động:')
    ) {
      continue;
    }

    const columns = parseCsvRow(line);
    if (columns.length === 0) continue;

    // Kiem tra xem co phai dong Header hay khong
    const joinCols = columns.join(' ').toLowerCase();
    if (!headerMap && (joinCols.includes('tên thánh') || joinCols.includes('họ và tên') || joinCols.includes('sđt') || joinCols.includes('giọng/lớp'))) {
      headerMap = {};
      columns.forEach((col, idx) => {
        const cLower = col.toLowerCase().trim();
        if (cLower.includes('thánh')) headerMap!['tenThanh'] = idx;
        else if (cLower.includes('họ') || (cLower.includes('tên') && !cLower.includes('thánh'))) headerMap!['hoVaTen'] = idx;
        else if (cLower.includes('sinh')) headerMap!['ngaySinh'] = idx;
        else if (cLower.includes('sđt') || cLower.includes('điện thoại') || cLower.includes('sdt') || cLower.includes('phone')) headerMap!['soDienThoai'] = idx;
        else if (cLower.includes('lớp') || cLower.includes('giọng')) headerMap!['lop'] = idx;
        else if (cLower.includes('bổn phận') || cLower.includes('chức')) headerMap!['bonPhan'] = idx;
        else if (cLower.includes('trạng thái')) headerMap!['trangThai'] = idx;
        else if (cLower.includes('ghi chú') || cLower.includes('note')) headerMap!['ghiChu'] = idx;
      });
      continue;
    }

    // Neu chua co header, dung thu tu mac dinh cua file xuat
    // [0: STT, 1: Ten Thanh, 2: Ho Va Ten, 3: Ngay Sinh, 4: SDT, 5: Lop, 6: Bon Phan, 7: Trang Thai, 8: Ghi Chu]
    dataRowIndex++;

    const getVal = (fieldName: string, defaultIdx: number): string => {
      let idx = defaultIdx;
      if (headerMap && headerMap[fieldName] !== undefined) {
        idx = headerMap[fieldName];
      }
      if (idx < columns.length && columns[idx] !== undefined) {
        let raw = columns[idx].trim();
        // Loai bo ky tu \t prefix do Excel xuat ra
        if (raw.startsWith('\t')) raw = raw.replace(/^\t/, '').trim();
        if (raw === '—' || raw === '-') return '';
        return raw;
      }
      return '';
    };

    const tenThanh = getVal('tenThanh', 1);
    const hoVaTen = getVal('hoVaTen', 2);
    let ngaySinh = getVal('ngaySinh', 3);
    const soDienThoai = getVal('soDienThoai', 4);
    const lop = getVal('lop', 5);
    const bonPhan = getVal('bonPhan', 6) || 'Thành viên';
    let trangThai = getVal('trangThai', 7) || 'Hoạt động';
    const ghiChu = getVal('ghiChu', 8);

    // Chuan hoa trang thai
    if (trangThai.toLowerCase().includes('tạm nghỉ')) trangThai = 'Tạm nghỉ';
    else if (trangThai.toLowerCase().includes('nghỉ hẳn')) trangThai = 'Nghỉ hẳn';
    else trangThai = 'Hoạt động';

    // Chuan hoa ngay sinh
    if (ngaySinh) {
      ngaySinh = formatDateVi(ngaySinh);
    }

    // Validation: Can it nhat Ho va Ten hoac Ten Thanh
    const isValid = Boolean(hoVaTen || tenThanh);
    const errorReason = !isValid ? 'Thiếu Tên Thánh và Họ & Tên' : undefined;

    parsedRows.push({
      rowNumber: dataRowIndex,
      data: {
        tenThanh,
        hoVaTen,
        ngaySinh,
        lop,
        soDienThoai,
        bonPhan,
        trangThai,
        ghiChu,
      },
      isValid,
      errorReason,
    });
  }

  return parsedRows;
}

/**
 * Tải file CSV mẫu chuẩn định dạng cho người dùng nhập liệu
 */
export function downloadSampleCsvTemplate(): void {
  const headers = ['STT', 'Tên Thánh', 'Họ và Tên', 'Ngày sinh', 'SĐT', 'Giọng/Lớp', 'Bổn phận', 'Trạng thái', 'Ghi chú'];
  const sampleRows = [
    ['1', 'Maria', 'Nguyễn Thị Thu Hà', '15/08/2005', '0912345678', 'Thêm Sức 1', 'Thành viên', 'Hoạt động', 'Ca viên soprano'],
    ['2', 'Giuse', 'Trần Văn Minh', '20/11/2003', '0987654321', 'Sống Đạo 2', 'Nhạc công', 'Hoạt động', 'Chơi organ'],
    ['3', 'Têrêsa', 'Phạm Ngọc Anh', '01/05', '0905123456', 'Xưng Tội 3', 'Thành viên', 'Hoạt động', '']
  ];

  const csvRows = [
    headers.map(escapeCsvCell).join(','),
    ...sampleRows.map(row => row.map(escapeCsvCell).join(','))
  ];

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'mau-nhap-danh-sach-ca-vien.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

