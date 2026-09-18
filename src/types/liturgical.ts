export type LiturgicalScheduleType = 'weekday' | 'sunday' | 'solemnity';

export type LiturgicalColor = 'green' | 'white' | 'red' | 'purple' | 'rose';

export interface LiturgicalSongSchedule {
  id: string;
  type: LiturgicalScheduleType; // 'weekday' (3 mục) | 'sunday' (5 mục) | 'solemnity' (5 mục)
  title: string;                 // VD: "Chúa Nhật XXV Thường Niên" hoặc "Thứ Bảy - 20/09"
  event_date: string;            // Ngày diễn ra Thánh Lễ (VD: "2026-09-21" hoặc "21/09/2026")
  liturgical_color: LiturgicalColor; // Màu áo phụng vụ: green (Thường Niên), white (Phục Sinh/Giáng Sinh), red (Tử Đạo/Chúa Thánh Thần), purple (Vọng/Chay), rose (Hồng)
  
  // 3 Mục bắt buộc cho tất cả Thánh Lễ:
  nhap_le: string;               // 1. Ca Nhập Lễ
  dang_le: string;               // 2. Ca Dâng Lễ (Tiến Lễ)
  hiep_le: string;               // 3. Ca Hiệp Lễ (Rước Lễ)

  // 2 Mục bổ sung dành riêng cho Lễ Chúa Nhật & Lễ Trọng/Dịp Lễ Ngoài (Tổng 5 mục):
  dap_ca_alleluia?: string;      // 4. Đáp Ca / Alleluia (Thánh Vịnh Đáp Ca & Ca Tung Hô Tin Mừng)
  ket_le?: string;               // 5. Ca Kết Lễ (Tạ Ơn)

  note?: string;                 // Ghi chú bè hát, đệm đàn, phân công ca xướng
  is_active?: boolean;
  created_at?: string;
}

export type CreateLiturgicalInput = Omit<LiturgicalSongSchedule, 'id' | 'created_at'>;
