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
  created_at?: string;
  updated_at?: string;
}

export interface CreateSongInput {
  title: string;
  composer?: string;
  category: SongCategory | string;
  key_signature?: string;
  lyrics?: string;
  sheet_url?: string;
  audio_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  is_active?: boolean;
}

export interface UpdateSongInput {
  title?: string;
  composer?: string;
  category?: SongCategory | string;
  key_signature?: string;
  lyrics?: string;
  sheet_url?: string;
  audio_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  is_active?: boolean;
}
