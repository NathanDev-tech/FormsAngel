/**
 * Khóa lưu trữ Visitor ID và thời gian bình luận gần nhất trong Local Storage.
 */
const VISITOR_ID_KEY = 'community_visitor_id';
const LAST_COMMENT_TIME_KEY = 'community_last_comment_timestamp';

/**
 * Thời gian giãn cách tối thiểu giữa 2 lần bình luận (3 giây).
 */
const COMMENT_COOLDOWN_MS = 3000;

/**
 * Giới hạn độ dài tối đa của một bình luận (500 ký tự).
 */
export const MAX_COMMENT_LENGTH = 500;

/**
 * Lấy hoặc tạo mới Visitor ID ngẫu nhiên lưu trong Local Storage.
 * Giúp nhận diện thiết bị người dùng thả reaction mà không cần đăng nhập.
 */
export function getOrCreateVisitorId(): string {
  if (typeof localStorage === 'undefined') {
    return 'anon_' + Math.random().toString(36).substring(2, 10);
  }

  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return 'anon_' + Math.random().toString(36).substring(2, 10);
  }
}

/**
 * Kiểm tra dữ liệu đầu vào bình luận và xử lý Anti-spam cooldown.
 */
export function validateCommentInput(content: string): { valid: boolean; message?: string } {
  const trimmed = content.trim();

  if (!trimmed) {
    return { valid: false, message: 'Nội dung bình luận không được để trống.' };
  }

  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return { 
      valid: false, 
      message: `Bình luận tối đa ${MAX_COMMENT_LENGTH} ký tự (bạn đã nhập ${trimmed.length} ký tự).` 
    };
  }

  // Anti-spam cooldown check (3s)
  try {
    const lastTimeStr = localStorage.getItem(LAST_COMMENT_TIME_KEY);
    if (lastTimeStr) {
      const lastTime = parseInt(lastTimeStr, 10);
      const now = Date.now();
      if (now - lastTime < COMMENT_COOLDOWN_MS) {
        return { 
          valid: false, 
          message: 'Bạn đang thao tác quá nhanh. Vui lòng thử lại sau.' 
        };
      }
    }
  } catch {
    // Bỏ qua lỗi storage nếu môi trường bị chặn cookie/storage
  }

  return { valid: true };
}

/**
 * Ghi lại mốc thời gian vừa gửi bình luận thành công để tính cooldown.
 */
export function recordCommentSent(): void {
  try {
    localStorage.setItem(LAST_COMMENT_TIME_KEY, Date.now().toString());
  } catch {
    // Bỏ qua lỗi storage
  }
}
