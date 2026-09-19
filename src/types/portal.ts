export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ScheduleStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface RehearsalSchedule {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  location: string;
  description?: string;
  notes?: string;
  status: ScheduleStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type SongCategory = 
  | 'Nhập lễ' 
  | 'Đáp ca' 
  | 'Alleluia' 
  | 'Dâng lễ' 
  | 'Hiệp lễ' 
  | 'Kết lễ' 
  | 'Khác';

export interface Song {
  id: string;
  title: string;
  composer?: string;
  category: SongCategory | string;
  key_signature?: string;
  lyrics?: string;
  sheet_url?: string;
  audio_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ServiceStatus = 'draft' | 'published' | 'completed';

export interface LiturgicalService {
  id: string;
  title: string;
  service_date: string;
  service_time: string;
  location: string;
  occasion?: string;
  notes?: string;
  status: ServiceStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
  songs?: LiturgicalServiceSong[];
}

export interface LiturgicalServiceSong {
  id: string;
  service_id: string;
  song_id?: string;
  custom_title?: string;
  song_position: 'nhap_le' | 'dap_ca' | 'alleluia' | 'dang_le' | 'hiep_le' | 'ket_le' | 'khac';
  display_order: number;
  song?: Song;
  created_at?: string;
}

export interface MediaAsset {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  uploaded_by?: string;
  created_at: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  notification_type: 'info' | 'warning' | 'success' | 'alert';
  target_role: 'all' | 'admin' | 'editor';
  related_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}
