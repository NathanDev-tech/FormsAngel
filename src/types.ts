export interface ChoirMember {
  id: string;
  tenThanh: string;       // Tên Thánh (e.g. Maria, Giuse, Têrêsa, Anna, Phêrô...)
  hoVaTen: string;        // Họ và Tên (e.g. Nguyễn Ngọc Bảo An)
  ngaySinh: string;       // Ngày Sinh / Năm Sinh (YYYY-MM-DD hoặc YYYY)
  lop: string;            // Giọng / Lớp (e.g. Sống Đạo 1A, Thêm Sức 3, Xưng Tội 3, Vào Đời 1...)
  soDienThoai: string;    // Số Điện Thoại
  bonPhan?: string;       // Bổn phận (e.g. Thành viên, Nhạc công, Thư ký, Thủ quỹ, Ca trưởng...)
  trangThai?: 'Hoạt động' | 'Tạm nghỉ' | 'Nghỉ hẳn' | string; // Trạng thái hoạt động
  createdAt: string;      // Thời gian tạo / gia nhập (ISO string)
  updatedAt: string;      // Thời gian cập nhật (ISO string)
  ghiChu?: string;        // Ghi chú tuỳ chọn nếu cần
}

export type MemberFormData = Omit<ChoirMember, 'id' | 'createdAt' | 'updatedAt'>;

export type SortField = 'tenThanh' | 'hoVaTen' | 'ngaySinh' | 'lop' | 'soDienThoai' | 'bonPhan' | 'trangThai' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
