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
 * Xuất danh sách dạng bảng Excel (.xls) có đầy đủ màu sắc, tiêu đề Ban Điều Hành,
 * định dạng font chữ Times New Roman toàn bộ, chiều cao các hàng đồng đều,
 * và tự động sắp xếp theo thứ tự chữ cái tên ca viên (A-Z).
 */
export function exportDecoratedExcel(
  members: ChoirMember[],
  parishName = 'GIÁO XỨ BẮC HÒA',
  filenamePrefix = 'danh-sach-ca-doan-thien-than-bac-hoa'
): void {
  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  
  // Tự động sắp xếp danh sách theo bảng chữ cái tiếng Việt trước khi xuất
  const sorted = [...members].sort((a, b) => compareVietnameseNames(a.hoVaTen, b.hoVaTen));

  const totalCount = sorted.length;
  const activeCount = sorted.filter(m => (m.trangThai || 'Hoạt động') === 'Hoạt động').length;
  const pauseCount = sorted.filter(m => m.trangThai === 'Tạm nghỉ').length;
  const leaveCount = sorted.filter(m => m.trangThai === 'Nghỉ hẳn').length;

  const rowsHtml = sorted.map((member, index) => {
    const birthYear = getBirthYear(member.ngaySinh);
    const phone = member.soDienThoai ? member.soDienThoai : '—';
    const group = member.lop ? member.lop : '—';
    const role = member.bonPhan || 'Thành viên';
    const status = member.trangThai || 'Hoạt động';
    const joinDate = member.createdAt ? formatDateVi(member.createdAt) : todayStr;
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    const statusColor = status === 'Hoạt động' ? '#16a34a' : status === 'Tạm nghỉ' ? '#d97706' : '#dc2626';

    return `
      <tr style="height: 25pt; mso-height-source: userset; background-color: ${bgColor}; font-family: 'Times New Roman', Times, serif;">
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: center; vertical-align: middle; height: 25pt; color: #475569;">${index + 1}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: center; vertical-align: middle; height: 25pt; color: #1d4ed8; font-weight: bold;">${member.tenThanh || '—'}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: left; vertical-align: middle; height: 25pt; padding-left: 8pt; font-weight: bold; color: #0f172a;">${member.hoVaTen || '—'}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: center; vertical-align: middle; height: 25pt; color: #1e293b;">${birthYear}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: center; vertical-align: middle; height: 25pt; mso-number-format:'\\@'; color: #334155;">${phone}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: left; vertical-align: middle; height: 25pt; padding-left: 8pt; color: #0f172a;">${group}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: center; vertical-align: middle; height: 25pt; color: #334155;">${role}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: center; vertical-align: middle; height: 25pt; font-weight: bold; color: ${statusColor};">${status}</td>
        <td style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; border: 0.5pt solid #cbd5e1; text-align: center; vertical-align: middle; height: 25pt; color: #475569;">${joinDate}</td>
      </tr>
    `;
  }).join('');

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Ca Đoàn Thiên Thần</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:FitToPage/>
                <x:Print>
                  <x:FitWidth>1</x:FitWidth>
                  <x:FitHeight>100</x:FitHeight>
                  <x:ValidPrinterInfo/>
                  <x:PaperSizeIndex>9</x:PaperSizeIndex>
                  <x:HorizontalResolution>600</x:HorizontalResolution>
                  <x:VerticalResolution>600</x:VerticalResolution>
                </x:Print>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        <!--
        @page {
          mso-page-orientation: landscape;
          margin: 0.5in 0.5in 0.5in 0.5in;
        }
        body, table, tr, td, th, p, span, div {
          font-family: 'Times New Roman', Times, serif !important;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          font-family: 'Times New Roman', Times, serif;
        }
        td, th {
          font-family: 'Times New Roman', Times, serif;
          vertical-align: middle;
        }
        .th-title-main {
          font-family: 'Times New Roman', Times, serif;
          font-size: 16pt;
          font-weight: bold;
          color: #002060;
          text-align: center;
          vertical-align: middle;
          height: 36pt;
          mso-height-source: userset;
        }
        .th-title-sub {
          font-family: 'Times New Roman', Times, serif;
          font-size: 13pt;
          font-weight: bold;
          color: #1e3a8a;
          text-align: center;
          vertical-align: middle;
          height: 25pt;
          mso-height-source: userset;
        }
        .th-meta {
          font-family: 'Times New Roman', Times, serif;
          font-size: 10.5pt;
          font-style: italic;
          color: #475569;
          text-align: center;
          vertical-align: middle;
          height: 22pt;
          mso-height-source: userset;
        }
        .th-header {
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
          font-weight: bold;
          color: #ffffff;
          background-color: #002060;
          text-align: center;
          vertical-align: middle;
          height: 32pt;
          mso-height-source: userset;
          border: 0.5pt solid #334155;
          padding: 6pt 4pt;
        }
        -->
      </style>
    </head>
    <body style="font-family: 'Times New Roman', Times, serif; padding: 16px; background-color: #ffffff;">
      <!-- Khung viền vàng trang trí trên cùng -->
      <table style="width: 100%; margin-bottom: 6px; font-family: 'Times New Roman', Times, serif;">
        <tr style="height: 4pt; mso-height-source: userset;">
          <td colspan="9" style="background-color: #d97706; height: 4pt; line-height: 4pt; font-size: 1pt;">&nbsp;</td>
        </tr>
      </table>

      <!-- Tiêu đề Ban Điều Hành Ca Đoàn Thiên Thần -->
      <table style="width: 100%; text-align: center; margin-bottom: 6px; font-family: 'Times New Roman', Times, serif;">
        <tr style="height: 36pt; mso-height-source: userset;">
          <td colspan="9" class="th-title-main" style="font-family: 'Times New Roman', Times, serif; font-size: 16pt; font-weight: bold; color: #002060; text-align: center; vertical-align: middle; height: 36pt; text-transform: uppercase;">
            ✦ BAN ĐIỀU HÀNH CA ĐOÀN THIÊN THẦN ✦
          </td>
        </tr>
        <tr style="height: 25pt; mso-height-source: userset;">
          <td colspan="9" class="th-title-sub" style="font-family: 'Times New Roman', Times, serif; font-size: 13pt; font-weight: bold; color: #1e3a8a; text-align: center; vertical-align: middle; height: 25pt;">
            DANH SÁCH CA VIÊN — ${parishName}
          </td>
        </tr>
        <tr style="height: 22pt; mso-height-source: userset;">
          <td colspan="9" class="th-meta" style="font-family: 'Times New Roman', Times, serif; font-size: 10.5pt; font-style: italic; color: #475569; text-align: center; vertical-align: middle; height: 22pt;">
            Ngày xuất: <b>${todayStr}</b> &nbsp;•&nbsp; Tổng: <b>${totalCount} ca viên</b> &nbsp;•&nbsp; Hoạt động: <b style="color: #16a34a;">${activeCount}</b> &nbsp;•&nbsp; Tạm nghỉ: <b style="color: #d97706;">${pauseCount}</b> &nbsp;•&nbsp; Nghỉ hẳn: <b style="color: #dc2626;">${leaveCount}</b>
          </td>
        </tr>
      </table>

      <!-- Bảng danh sách thành viên -->
      <table border="1" style="border-collapse: collapse; border: 0.5pt solid #94a3b8; width: 100%; font-family: 'Times New Roman', Times, serif;">
        <colgroup>
          <col width="50" style="width: 50pt;">
          <col width="120" style="width: 120pt;">
          <col width="230" style="width: 230pt;">
          <col width="85" style="width: 85pt;">
          <col width="120" style="width: 120pt;">
          <col width="140" style="width: 140pt;">
          <col width="110" style="width: 110pt;">
          <col width="110" style="width: 110pt;">
          <col width="115" style="width: 115pt;">
        </colgroup>
        <thead>
          <tr style="background-color: #002060; color: #ffffff; font-weight: bold; font-size: 11pt; text-align: center; height: 32pt; mso-height-source: userset; font-family: 'Times New Roman', Times, serif;">
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 4pt; width: 50pt; text-align: center; vertical-align: middle;">STT</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 8pt; width: 120pt; text-align: center; vertical-align: middle;">Tên Thánh</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 10pt; width: 230pt; text-align: left; vertical-align: middle;">Họ và Tên</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 4pt; width: 85pt; text-align: center; vertical-align: middle;">Ngày sinh</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 6pt; width: 120pt; text-align: center; vertical-align: middle;">SĐT</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 8pt; width: 140pt; text-align: left; vertical-align: middle;">Giọng/Lớp</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 6pt; width: 110pt; text-align: center; vertical-align: middle;">Bổn phận</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 6pt; width: 110pt; text-align: center; vertical-align: middle;">Trạng thái</th>
            <th class="th-header" style="font-family: 'Times New Roman', Times, serif; border: 0.5pt solid #334155; padding: 6pt 6pt; width: 115pt; text-align: center; vertical-align: middle;">Ngày gia nhập</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || `<tr><td colspan="9" style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; text-align: center; vertical-align: middle; height: 35pt; padding: 15pt; color: #94a3b8; border: 0.5pt solid #cbd5e1;">Chưa có dữ liệu thành viên</td></tr>`}
        </tbody>
      </table>

      <!-- Khung viền vàng dưới bảng -->
      <table style="width: 100%; margin-top: 6px; margin-bottom: 12px; font-family: 'Times New Roman', Times, serif;">
        <tr style="height: 4pt; mso-height-source: userset;">
          <td colspan="9" style="background-color: #d97706; height: 4pt; line-height: 4pt; font-size: 1pt;">&nbsp;</td>
        </tr>
      </table>

      <!-- Bảng thống kê tổng hợp phía dưới trang trọng -->
      <table style="width: 100%; margin-top: 8px; font-family: 'Times New Roman', Times, serif;">
        <tr>
          <td style="width: 15%;"></td>
          <td style="width: 32%; border: 0.5pt solid #cbd5e1; background-color: #f8fafc; padding: 8pt 12pt; vertical-align: middle;">
            <table style="width: 100%; font-family: 'Times New Roman', Times, serif; font-size: 11pt;">
              <tr style="height: 20pt; mso-height-source: userset;">
                <td style="font-family: 'Times New Roman', Times, serif; color: #475569; font-weight: bold; vertical-align: middle;">Nghỉ hẳn</td>
                <td style="font-family: 'Times New Roman', Times, serif; text-align: right; font-weight: bold; color: #dc2626; vertical-align: middle;">${leaveCount}</td>
              </tr>
              <tr style="height: 20pt; mso-height-source: userset;">
                <td style="font-family: 'Times New Roman', Times, serif; color: #475569; font-weight: bold; vertical-align: middle;">Tạm nghỉ</td>
                <td style="font-family: 'Times New Roman', Times, serif; text-align: right; font-weight: bold; color: #d97706; vertical-align: middle;">${pauseCount}</td>
              </tr>
            </table>
          </td>
          <td style="width: 6%;"></td>
          <td style="width: 32%; border: 0.5pt solid #cbd5e1; background-color: #f8fafc; padding: 8pt 12pt; vertical-align: middle;">
            <table style="width: 100%; font-family: 'Times New Roman', Times, serif; font-size: 11pt;">
              <tr style="height: 20pt; mso-height-source: userset;">
                <td style="font-family: 'Times New Roman', Times, serif; color: #475569; font-weight: bold; vertical-align: middle;">Tổng ca viên</td>
                <td style="font-family: 'Times New Roman', Times, serif; text-align: right; font-weight: bold; color: #0f172a; vertical-align: middle;">${totalCount}</td>
              </tr>
              <tr style="height: 20pt; mso-height-source: userset;">
                <td style="font-family: 'Times New Roman', Times, serif; color: #475569; font-weight: bold; vertical-align: middle;">Đang hoạt động</td>
                <td style="font-family: 'Times New Roman', Times, serif; text-align: right; font-weight: bold; color: #16a34a; vertical-align: middle;">${activeCount}</td>
              </tr>
            </table>
          </td>
          <td style="width: 15%;"></td>
        </tr>
      </table>
    </body>
    </html>
  `;

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
 * Xuất danh sách ca viên ra file CSV chuẩn có đầy đủ tiêu đề và định dạng:
 * - Header tiếng Việt có dấu, UTF-8 kèm BOM (\uFEFF) mở bằng Excel không lỗi font
 * - Tự động sắp xếp A-Z theo tên ca viên
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

  // Dòng tiêu đề cột chuẩn theo danh sách thực tế
  const headers = ['STT', 'Tên Thánh', 'Họ và Tên', 'Năm sinh', 'SĐT', 'Giọng/Lớp', 'Bổn phận', 'Trạng thái', 'Ngày gia nhập'];
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
      escapeCsvCell(member.createdAt ? formatDateVi(member.createdAt) : todayStr)
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

