/**
 * Danh mục bài viết trong Diễn đàn Cộng đồng Ca Đoàn Thiên Thần.
 */
export type CommunityCategory = 
  | '⛪ Thánh lễ'
  | '📢 Thông báo quan trọng'
  | '🎵 Tập hát'
  | '🎉 Sự kiện';

/**
 * Mảng danh sách các danh mục bài viết phục vụ cho dropdown và bộ lọc filter pills.
 */
export const COMMUNITY_CATEGORIES: CommunityCategory[] = [
  '⛪ Thánh lễ',
  '📢 Thông báo quan trọng',
  '🎵 Tập hát',
  '🎉 Sự kiện',
];

/**
 * Các loại cảm xúc / reaction công khai (không cần đăng nhập).
 */
export type ReactionType = 'heart' | 'like' | 'pray' | 'party';

/**
 * Đối tượng Tệp / Ảnh đính kèm trong bài viết.
 */
export interface CommunityAttachment {
  id: string;
  post_id: string;
  file_name: string;
  file_url: string;
  file_type: string; // 'image' | 'file'
  file_size?: string;
  created_at: string;
}

/**
 * Đối tượng Cảm xúc (Reaction) của visitor vô danh trên bài viết.
 */
export interface CommunityReaction {
  id: string;
  post_id: string;
  reaction_type: ReactionType;
  visitor_id: string;
  created_at: string;
}

/**
 * Đối tượng Bình luận (Comment) công khai, có hỗ trợ trả lời nhiều cấp (Replies).
 */
export interface CommunityComment {
  id: string;
  post_id: string;
  parent_comment_id?: string | null;
  author_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
  replies?: CommunityComment[];
}

/**
 * Đối tượng Bài viết chính (Post) trong Diễn đàn Cộng đồng.
 */
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: CommunityCategory | string;
  author_name: string;
  is_pinned: boolean;
  is_important: boolean;
  comments_enabled: boolean;
  created_at: string;
  updated_at: string;
  attachments?: CommunityAttachment[];
  comments_count?: number;
  reactions_count?: Record<ReactionType, number>;
  user_reactions?: ReactionType[];
}

/**
 * Dữ liệu đầu vào khi Admin tạo bài viết mới.
 */
export interface CreatePostInput {
  title: string;
  content: string;
  category: CommunityCategory | string;
  author_name?: string;
  is_pinned?: boolean;
  is_important?: boolean;
  comments_enabled?: boolean;
  attachments?: { file_name: string; file_url: string; file_type: string; file_size?: string }[];
}

/**
 * Dữ liệu đầu vào khi Admin cập nhật bài viết hiện có.
 */
export interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: CommunityCategory | string;
  author_name?: string;
  is_pinned?: boolean;
  is_important?: boolean;
  comments_enabled?: boolean;
  attachments?: { file_name: string; file_url: string; file_type: string; file_size?: string }[];
}
