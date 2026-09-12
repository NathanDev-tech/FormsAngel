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
 * Xuất Excel thiết kế tinh tế, gọn gàng, chuẩn văn bản hành chính giáo xứ:
 * - Header thanh lịch với tên Giáo Xứ & Ca Đoàn
 * - Thống kê ngắn gọn ngay dưới tiêu đề
 * - Bảng danh sách ca viên với badge màu sắc lớp học và trạng thái chuẩn
 * - Chữ ký xác nhận ở cuối trang
 */
export function exportDecoratedExcel(
  members: ChoirMember[],
  parishName = 'GIÁO XỨ BẮC HÒA',
  filenamePrefix = 'DanhSach-CaVien'
): void {
  const now = new Date();
  const monthYearStr = `Tháng ${String(now.getMonth() + 1).padStart(2, '0')} / ${now.getFullYear()}`;

  // Tự động sắp xếp danh sách theo bảng chữ cái tiếng Việt
  const sorted = [...members].sort((a, b) => compareVietnameseNames(a.hoVaTen, b.hoVaTen));

  const totalCount = sorted.length;
  const activeCount = sorted.filter(m => (m.trangThai || 'Hoạt động') === 'Hoạt động').length;
  const pauseCount = sorted.filter(m => m.trangThai === 'Tạm nghỉ').length;
  const leaveCount = sorted.filter(m => m.trangThai === 'Nghỉ hẳn').length;

  // Hàm lấy màu badge lớp học (nền + chữ)
  function getClassBadge(lop: string): string {
    if (!lop || lop === '—') return `<span style="color:#94a3b8;font-style:italic;">—</span>`;
    const l = lop.toLowerCase();
    let bg = '#e0f2fe'; let color = '#0369a1'; let border = '#bae6fd';
    if (l.includes('giáo lý') || l.includes('dự trưởng')) { bg = '#fef2f2'; color = '#b91c1c'; border = '#fecaca'; }
    else if (l.includes('xưng tội')) { bg = '#f0fdf4'; color = '#15803d'; border = '#bbf7d0'; }
    else if (l.includes('thêm sức')) { bg = '#eff6ff'; color = '#1d4ed8'; border = '#bfdbfe'; }
    else if (l.includes('sống đạo')) { bg = '#fffbeb'; color = '#b45309'; border = '#fde68a'; }
    else if (l.includes('vào đời')) { bg = '#fdf4e7'; color = '#92400e'; border = '#fcd9a0'; }
    return `<span style="display:inline-block;background:${bg};color:${color};border:1pt solid ${border};border-radius:3pt;padding:1pt 6pt;font-weight:bold;font-size:10pt;">${lop}</span>`;
  }

  // Hàm lấy badge trạng thái
  function getStatusBadge(status: string): string {
    let bg = '#f0fdf4'; let color = '#15803d'; let border = '#bbf7d0'; let icon = '✔';
    if (status === 'Tạm nghỉ') { bg = '#fffbeb'; color = '#b45309'; border = '#fde68a'; icon = '⏸'; }
    if (status === 'Nghỉ hẳn') { bg = '#fef2f2'; color = '#b91c1c'; border = '#fecaca'; icon = '✖'; }
    return `<span style="display:inline-block;background:${bg};color:${color};border:1pt solid ${border};border-radius:3pt;padding:1pt 6pt;font-weight:bold;font-size:10pt;">${icon} ${status}</span>`;
  }

  // Dữ liệu từng dòng
  const rowsHtml = sorted.map((member, index) => {
    const birth = getBirthYear(member.ngaySinh);
    const phone = member.soDienThoai || '—';
    const lop = member.lop || '—';
    const role = member.bonPhan || 'Thành viên';
    const status = member.trangThai || 'Hoạt động';
    const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';

    return `
    <tr style="height:25pt;mso-height-source:userset;background-color:${bg};">
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #cbd5e1;text-align:center;vertical-align:middle;color:#475569;font-weight:bold;">${index + 1}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #cbd5e1;text-align:center;vertical-align:middle;color:#1e40af;font-weight:bold;">${member.tenThanh || '—'}</td>
      <td style="font-family:'Times New Roman',serif;font-size:11pt;border:0.5pt solid #cbd5e1;text-align:left;vertical-align:middle;padding-left:8pt;font-weight:bold;color:#0f172a;">${member.hoVaTen || '—'}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #cbd5e1;text-align:center;vertical-align:middle;color:#334155;">${birth || '—'}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #cbd5e1;text-align:center;vertical-align:middle;mso-number-format:'\\@';color:#334155;">${phone}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #cbd5e1;text-align:center;vertical-align:middle;">${getClassBadge(lop)}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #cbd5e1;text-align:center;vertical-align:middle;color:#475569;">${role}</td>
      <td style="font-family:'Times New Roman',serif;font-size:10.5pt;border:0.5pt solid #cbd5e1;text-align:center;vertical-align:middle;">${getStatusBadge(status)}</td>
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
        </x:Print>
      </x:WorksheetOptions>
    </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
  </xml><![endif]-->
  <style>
  <!--
    @page { mso-page-orientation:landscape; margin:0.4in; }
    body,table,td,th { font-family:'Times New Roman',Times,serif !important; }
  -->
  </style>
</head>
<body style="font-family:'Times New Roman',serif;margin:10pt;background:#ffffff;">

<!-- HEADER THANH LỊCH -->
<table style="width:100%;border-collapse:collapse;margin-bottom:10pt;">
  <tr>
    <td colspan="8" style="text-align:center;padding:4pt 0;">
      <div style="font-size:11pt;color:#1e3a5f;font-weight:bold;">† GIÁO HỘI CÔNG GIÁO †</div>
      <div style="font-size:16pt;font-weight:bold;color:#1e3a5f;text-transform:uppercase;margin-top:2pt;">CA ĐOÀN THIÊN THẦN — ${parishName}</div>
      <div style="font-size:13pt;font-weight:bold;color:#0f172a;margin-top:3pt;letter-spacing:1pt;">DANH SÁCH CA VIÊN</div>
      <div style="font-size:10pt;color:#475569;margin-top:4pt;font-style:italic;">
        ${monthYearStr} &nbsp;|&nbsp; Tổng số: <b>${totalCount}</b> ca viên (Hoạt động: <b>${activeCount}</b>, Tạm nghỉ: <b>${pauseCount}</b>, Nghỉ hẳn: <b>${leaveCount}</b>)
      </div>
    </td>
  </tr>
</table>

<!-- BẢNG DANH SÁCH CA VIÊN -->
<table style="width:100%;border-collapse:collapse;border:1pt solid #334155;">
  <colgroup>
    <col style="width:38pt;">
    <col style="width:100pt;">
    <col style="width:200pt;">
    <col style="width:75pt;">
    <col style="width:100pt;">
    <col style="width:120pt;">
    <col style="width:100pt;">
    <col style="width:95pt;">
  </colgroup>
  <thead>
    <tr style="background-color:#1e3a5f;color:#ffffff;height:28pt;mso-height-source:userset;">
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;">STT</th>
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;">Tên Thánh</th>
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:left;vertical-align:middle;border:0.5pt solid #334155;padding-left:8pt;">Họ và Tên</th>
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;">Ngày sinh</th>
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;">Số ĐT</th>
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;">Giọng / Lớp</th>
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;">Bổn Phận</th>
      <th style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#ffffff;text-align:center;vertical-align:middle;border:0.5pt solid #334155;">Trạng Thái</th>
    </tr>
  </thead>
  <tbody>
    ${rowsHtml || `<tr><td colspan="8" style="font-family:'Times New Roman',serif;font-size:11pt;text-align:center;height:40pt;color:#94a3b8;">Chưa có dữ liệu thành viên</td></tr>`}
  </tbody>
</table>

<!-- FOOTER CHỮ KÝ GỌN GÀNG -->
<table style="width:100%;border-collapse:collapse;margin-top:16pt;">
  <tr>
    <td colspan="5"></td>
    <td colspan="3" style="text-align:right;font-size:10pt;font-style:italic;color:#334155;padding-bottom:12pt;">
      Bắc Hòa, ngày ${String(now.getDate()).padStart(2, '0')} tháng ${String(now.getMonth() + 1).padStart(2, '0')} năm ${now.getFullYear()}
    </td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center;vertical-align:top;width:50%;">
      <div style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#1e3a5f;">CA TRƯỞNG</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#64748b;font-style:italic;margin-top:2pt;">(Ký và ghi rõ họ tên)</div>
    </td>
    <td colspan="4" style="text-align:center;vertical-align:top;width:50%;">
      <div style="font-family:'Times New Roman',serif;font-size:10.5pt;font-weight:bold;color:#1e3a5f;">BAN ĐIỀU HÀNH CA ĐOÀN</div>
      <div style="font-family:'Times New Roman',serif;font-size:9pt;color:#64748b;font-style:italic;margin-top:2pt;">(Ký và ghi rõ họ tên)</div>
    </td>
  </tr>
</table>

</body>
</html>`;

  const fileName = `${filenamePrefix}.xls`;

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
  filenamePrefix = 'DanhSach-CaVien'
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

  const fileName = `${filenamePrefix}.csv`;

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

