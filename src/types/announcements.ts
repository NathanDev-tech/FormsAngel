export type AnnouncementCategory = 
  | 'Quan trọng' 
  | 'Lịch tập' 
  | 'Phụng vụ' 
  | 'Sinh hoạt' 
  | 'Khác';

export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: AnnouncementCategory | string;
  cover_image_url?: string;
  is_important: boolean;
  is_pinned: boolean;
  status: AnnouncementStatus;
  published_at: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category: AnnouncementCategory | string;
  cover_image_url?: string;
  is_important?: boolean;
  is_pinned?: boolean;
  status?: AnnouncementStatus;
  published_at?: string;
  created_by?: string;
}

export interface UpdateAnnouncementInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: AnnouncementCategory | string;
  cover_image_url?: string;
  is_important?: boolean;
  is_pinned?: boolean;
  status?: AnnouncementStatus;
  published_at?: string;
  created_by?: string;
}
