/**
 * Tạo liên kết chia sẻ trực tiếp tới bài viết trên trang Diễn đàn Cộng đồng (Community).
 * Đảm bảo liên kết luôn trỏ đúng về route /community kể cả khi thao tác từ trang Admin hay Public.
 */
export function getCommunityPostShareUrl(postId: string): string {
  const origin = window.location.origin;
  let pathname = window.location.pathname.replace(/\/+$/, '');

  // Nếu pathname đã kết thúc bằng /community (không phân biệt hoa thường)
  if (/\/community$/i.test(pathname)) {
    return `${origin}${pathname}?post=${encodeURIComponent(postId)}`;
  }

  // Nếu chưa có /community ở cuối URL, bổ sung thêm /community
  // Ví dụ: "/" -> "/community", "/FormsAngel" -> "/FormsAngel/community"
  const communityPath = pathname ? `${pathname}/community` : '/community';
  return `${origin}${communityPath}?post=${encodeURIComponent(postId)}`;
}
