import { getSupabase } from './supabase.ts';
import {
  CommunityPost,
  CommunityComment,
  CommunityReaction,
  CommunityAttachment,
  CreatePostInput,
  UpdatePostInput,
  ReactionType,
} from '../types/community.ts';
import { getOrCreateVisitorId } from '../utils/visitor.ts';

const LOCAL_POSTS_KEY = 'formsangel_community_posts_v1';
const LOCAL_COMMENTS_KEY = 'formsangel_community_comments_v1';
const LOCAL_REACTIONS_KEY = 'formsangel_community_reactions_v1';
const LOCAL_ATTACHMENTS_KEY = 'formsangel_community_attachments_v1';

// Seed Data Mặc Định cho Diễn Đàn Cộng Đồng Ca Đoàn Thiên Thần
const DEFAULT_SEED_POSTS: CommunityPost[] = [
  {
    id: 'post_seed_1',
    title: '📢 LỊCH TẬP HÁT VÀ PHỤC VỤ THÁNH LỄ THÁNG 9/2026',
    content: 'Kính gửi quý Anh Chị Em ca viên Ca Đoàn Thiên Thần,\n\nBan Hành Giáo và Ban Điều Hành Ca Đoàn xin thông báo lịch tập hát và phục vụ Thánh Lễ trong tháng 9 như sau:\n\n1. Lịch Tập Hát:\n- Thứ Ba & Thứ Năm hàng tuần lúc 19:30 tại nhà mục vụ Giáo Xứ Bắc Hòa.\n- Riêng Thứ Bảy tuần này tập hát bổ sung lúc 19:00 để chuẩn bị cho Thánh Lễ Quan Thầy.\n\n2. Lịch Phục Vụ:\n- Thánh Lễ 07:00 Sáng Chủ Nhật hàng tuần.\n\nRất mong toàn thể anh chị em sắp xếp thời gian đi tập hát đông đủ và đúng giờ.',
    category: '📢 Thông báo',
    author_name: 'Trưởng Ca Đoàn',
    is_pinned: true,
    is_important: true,
    comments_enabled: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    attachments: [
      {
        id: 'att_seed_1',
        post_id: 'post_seed_1',
        file_name: 'Lich_Tap_Hat_Thang_9.png',
        file_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        file_type: 'image',
        file_size: '1.2 MB',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      }
    ]
  },
  {
    id: 'post_seed_2',
    title: '⛪ CHƯƠNG TRÌNH THÁNH LỄ TẠ ƠN BỔN MẠNG CA ĐOÀN THIÊN THẦN',
    content: 'Hướng tới Ngày Lễ Các Tổng Lãnh Thiên Thần (29/09),\nCa Đoàn chúng ta sẽ cử hành Thánh Lễ Tạ Ơn Bổn Mạng trọng thể.\n\nThời gian: 18:00 Thứ Ba, ngày 29/09/2026\nĐịa điểm: Thánh Đường Giáo Xứ Bắc Hòa\n\nSau Thánh Lễ sẽ có buổi tiệc mừng nhẹ và giao lưu thân mật tại khuôn viên nhà mục vụ. Kính mời toàn thể ca viên và gia đình cùng tham dự!',
    category: '⛪ Thánh lễ',
    author_name: 'Ban Điều Hành',
    is_pinned: true,
    is_important: false,
    comments_enabled: true,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'post_seed_3',
    title: '🎵 CHIA SẺ TẬP BẢN NHẠC "TIN NGHĨA CHÚA MANG TẤT CẢ" (TÔN VINH LỄ CHỦ NHẬT)',
    content: 'Thân gửi các ca viên các giọng Soprano, Alto, Tenor, Bass!\n\nBản nhạc tuần này đã được Ca Trưởng biên soạn lại theo bè 4 giọng. Mọi người xem trước và nghe phần audio thu âm mẫu để tập thuộc giai điệu nhé.\n\nChúc anh chị em tuần mới tràn đầy ơn Chúa!',
    category: '🎵 Tập hát',
    author_name: 'Ca Trưởng',
    is_pinned: false,
    is_important: false,
    comments_enabled: true,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  }
];

const DEFAULT_SEED_COMMENTS: CommunityComment[] = [
  {
    id: 'comm_seed_1',
    post_id: 'post_seed_1',
    author_name: 'Nguyễn Minh',
    content: 'Dạ con đã nhận thông báo ạ. Thứ Bảy tuần này con sẽ có mặt đúng 19:00!',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'comm_seed_2',
    post_id: 'post_seed_1',
    author_name: 'Trần Thị Thu',
    content: 'Dạ cảm ơn Ban Điều Hành! Giọng Alto tuần này tập bài nào vậy ạ?',
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'comm_seed_3',
    post_id: 'post_seed_1',
    parent_comment_id: 'comm_seed_2',
    author_name: 'Ca Trưởng',
    content: 'Giọng Alto tập bài Đáp Ca và Alleluia mới nhé Thu!',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  }
];

const DEFAULT_SEED_REACTIONS: CommunityReaction[] = [
  { id: 'react_1', post_id: 'post_seed_1', reaction_type: 'heart', visitor_id: 'visitor_1', created_at: new Date().toISOString() },
  { id: 'react_2', post_id: 'post_seed_1', reaction_type: 'heart', visitor_id: 'visitor_2', created_at: new Date().toISOString() },
  { id: 'react_3', post_id: 'post_seed_1', reaction_type: 'pray', visitor_id: 'visitor_3', created_at: new Date().toISOString() },
  { id: 'react_4', post_id: 'post_seed_2', reaction_type: 'party', visitor_id: 'visitor_1', created_at: new Date().toISOString() },
  { id: 'react_5', post_id: 'post_seed_2', reaction_type: 'heart', visitor_id: 'visitor_4', created_at: new Date().toISOString() },
];

// Helper Storage
function getLocalPosts(): CommunityPost[] {
  try {
    const data = localStorage.getItem(LOCAL_POSTS_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(DEFAULT_SEED_POSTS));
    return DEFAULT_SEED_POSTS;
  } catch {
    return DEFAULT_SEED_POSTS;
  }
}

function saveLocalPosts(posts: CommunityPost[]) {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Lỗi lưu local posts:', e);
  }
}

function getLocalComments(): CommunityComment[] {
  try {
    const data = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(DEFAULT_SEED_COMMENTS));
    return DEFAULT_SEED_COMMENTS;
  } catch {
    return DEFAULT_SEED_COMMENTS;
  }
}

function saveLocalComments(comments: CommunityComment[]) {
  try {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error('Lỗi lưu local comments:', e);
  }
}

function getLocalReactions(): CommunityReaction[] {
  try {
    const data = localStorage.getItem(LOCAL_REACTIONS_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(LOCAL_REACTIONS_KEY, JSON.stringify(DEFAULT_SEED_REACTIONS));
    return DEFAULT_SEED_REACTIONS;
  } catch {
    return DEFAULT_SEED_REACTIONS;
  }
}

function saveLocalReactions(reactions: CommunityReaction[]) {
  try {
    localStorage.setItem(LOCAL_REACTIONS_KEY, JSON.stringify(reactions));
  } catch (e) {
    console.error('Lỗi lưu local reactions:', e);
  }
}

function getLocalAttachments(): CommunityAttachment[] {
  try {
    const data = localStorage.getItem(LOCAL_ATTACHMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalAttachments(attachments: CommunityAttachment[]) {
  try {
    localStorage.setItem(LOCAL_ATTACHMENTS_KEY, JSON.stringify(attachments));
  } catch (e) {
    console.error('Lỗi lưu local attachments:', e);
  }
}

// ----------------------------------------------------
// 1. PUBLIC & ADMIN: Lấy danh sách bài viết
// ----------------------------------------------------
export async function getPosts(
  categoryFilter?: string,
  searchQuery?: string
): Promise<CommunityPost[]> {
  const supabase = getSupabase();
  const visitorId = getOrCreateVisitorId();

  if (supabase) {
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (categoryFilter && categoryFilter !== 'Tất cả') {
        query = query.eq('category', categoryFilter);
      }

      const { data: postsData, error } = await query;

      if (!error && postsData) {
        // Lấy thông tin đính kèm, reactions, comment count cho từng bài
        const resultPosts: CommunityPost[] = [];

        for (const post of postsData) {
          if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const matchTitle = post.title.toLowerCase().includes(q);
            const matchContent = post.content.toLowerCase().includes(q);
            if (!matchTitle && !matchContent) continue;
          }

          // Lấy attachments
          const { data: atts } = await supabase
            .from('community_attachments')
            .select('*')
            .eq('post_id', post.id);

          // Lấy comment count
          const { count: commentCount } = await supabase
            .from('community_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Lấy reactions
          const { data: reactData } = await supabase
            .from('community_reactions')
            .select('*')
            .eq('post_id', post.id);

          const reactionsCount: Record<ReactionType, number> = { heart: 0, like: 0, pray: 0, party: 0 };
          const userReactions: ReactionType[] = [];

          (reactData || []).forEach((r: CommunityReaction) => {
            if (r.reaction_type in reactionsCount) {
              reactionsCount[r.reaction_type as ReactionType]++;
            }
            if (r.visitor_id === visitorId) {
              userReactions.push(r.reaction_type as ReactionType);
            }
          });

          resultPosts.push({
            ...post,
            attachments: atts || [],
            comments_count: commentCount || 0,
            reactions_count: reactionsCount,
            user_reactions: userReactions,
          });
        }

        return resultPosts;
      }
    } catch (err) {
      console.warn('Lỗi getPosts từ Supabase, chuyển sang local storage fallback:', err);
    }
  }

  // Fallback Local Storage
  const localPosts = getLocalPosts();
  const localComments = getLocalComments();
  const localReactions = getLocalReactions();
  const localAttachments = getLocalAttachments();

  let filtered = [...localPosts];

  if (categoryFilter && categoryFilter !== 'Tất cả') {
    filtered = filtered.filter(p => p.category === categoryFilter);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    );
  }

  // Sort pinned first, then newest
  filtered.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return filtered.map(post => {
    const postComments = localComments.filter(c => c.post_id === post.id);
    const postReactions = localReactions.filter(r => r.post_id === post.id);
    const postAtts = [...(post.attachments || []), ...localAttachments.filter(a => a.post_id === post.id)];

    const reactionsCount: Record<ReactionType, number> = { heart: 0, like: 0, pray: 0, party: 0 };
    const userReactions: ReactionType[] = [];

    postReactions.forEach(r => {
      if (r.reaction_type in reactionsCount) {
        reactionsCount[r.reaction_type as ReactionType]++;
      }
      if (r.visitor_id === visitorId) {
        userReactions.push(r.reaction_type as ReactionType);
      }
    });

    return {
      ...post,
      attachments: postAtts,
      comments_count: postComments.length,
      reactions_count: reactionsCount,
      user_reactions: userReactions,
    };
  });
}

// ----------------------------------------------------
// 2. PUBLIC & ADMIN: Lấy chi tiết 1 bài viết theo ID
// ----------------------------------------------------
export async function getPostById(postId: string): Promise<CommunityPost | null> {
  const posts = await getPosts();
  return posts.find(p => p.id === postId) || null;
}

// ----------------------------------------------------
// 3. ADMIN API: Đăng bài viết mới
// ----------------------------------------------------
export async function createPost(input: CreatePostInput): Promise<CommunityPost> {
  const supabase = getSupabase();
  const newPostId = 'post_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const nowIso = new Date().toISOString();

  const newPostObj: CommunityPost = {
    id: newPostId,
    title: input.title.trim(),
    content: input.content.trim(),
    category: input.category || '📢 Thông báo',
    author_name: input.author_name?.trim() || 'Trưởng Ca Đoàn',
    is_pinned: !!input.is_pinned,
    is_important: !!input.is_important,
    comments_enabled: input.comments_enabled !== false,
    created_at: nowIso,
    updated_at: nowIso,
    attachments: (input.attachments || []).map((att, idx) => ({
      id: 'att_' + Date.now() + '_' + idx,
      post_id: newPostId,
      file_name: att.file_name,
      file_url: att.file_url,
      file_type: att.file_type || 'image',
      file_size: att.file_size || '',
      created_at: nowIso,
    })),
    comments_count: 0,
    reactions_count: { heart: 0, like: 0, pray: 0, party: 0 },
    user_reactions: [],
  };

  if (supabase) {
    try {
      const { data: createdPost, error: postErr } = await supabase
        .from('community_posts')
        .insert([{
          title: newPostObj.title,
          content: newPostObj.content,
          category: newPostObj.category,
          author_name: newPostObj.author_name,
          is_pinned: newPostObj.is_pinned,
          is_important: newPostObj.is_important,
          comments_enabled: newPostObj.comments_enabled,
          created_at: nowIso,
          updated_at: nowIso,
        }])
        .select()
        .single();

      if (!postErr && createdPost) {
        let insertedAtts: CommunityAttachment[] = [];
        if (input.attachments && input.attachments.length > 0) {
          const attRows = input.attachments.map(att => ({
            post_id: createdPost.id,
            file_name: att.file_name,
            file_url: att.file_url,
            file_type: att.file_type || 'image',
            file_size: att.file_size || '',
            created_at: nowIso,
          }));

          const { data: attData } = await supabase
            .from('community_attachments')
            .insert(attRows)
            .select();
          
          if (attData) insertedAtts = attData;
        }

        saveLocalPostFallback({
          ...createdPost,
          attachments: insertedAtts,
          comments_count: 0,
          reactions_count: { heart: 0, like: 0, pray: 0, party: 0 },
          user_reactions: [],
        });

        return {
          ...createdPost,
          attachments: insertedAtts,
          comments_count: 0,
          reactions_count: { heart: 0, like: 0, pray: 0, party: 0 },
          user_reactions: [],
        };
      }
    } catch (err) {
      console.warn('Lỗi createPost trên Supabase, dùng local storage:', err);
    }
  }

  // Local storage
  saveLocalPostFallback(newPostObj);
  return newPostObj;
}

function saveLocalPostFallback(post: CommunityPost) {
  const currentPosts = getLocalPosts();
  currentPosts.unshift(post);
  saveLocalPosts(currentPosts);

  if (post.attachments && post.attachments.length > 0) {
    const currentAtts = getLocalAttachments();
    saveLocalAttachments([...post.attachments, ...currentAtts]);
  }
}

// ----------------------------------------------------
// 4. ADMIN API: Cập nhật bài viết
// ----------------------------------------------------
export async function updatePost(postId: string, input: UpdatePostInput): Promise<CommunityPost | null> {
  const supabase = getSupabase();
  const nowIso = new Date().toISOString();

  if (supabase) {
    try {
      const updatePayload: Record<string, unknown> = { updated_at: nowIso };
      if (input.title !== undefined) updatePayload.title = input.title.trim();
      if (input.content !== undefined) updatePayload.content = input.content.trim();
      if (input.category !== undefined) updatePayload.category = input.category;
      if (input.author_name !== undefined) updatePayload.author_name = input.author_name.trim();
      if (input.is_pinned !== undefined) updatePayload.is_pinned = input.is_pinned;
      if (input.is_important !== undefined) updatePayload.is_important = input.is_important;
      if (input.comments_enabled !== undefined) updatePayload.comments_enabled = input.comments_enabled;

      await supabase
        .from('community_posts')
        .update(updatePayload)
        .eq('id', postId);

      if (input.attachments !== undefined) {
        await supabase.from('community_attachments').delete().eq('post_id', postId);
        if (input.attachments.length > 0) {
          const attRows = input.attachments.map(att => ({
            post_id: postId,
            file_name: att.file_name,
            file_url: att.file_url,
            file_type: att.file_type || 'image',
            file_size: att.file_size || '',
            created_at: nowIso,
          }));
          await supabase.from('community_attachments').insert(attRows);
        }
      }
    } catch (err) {
      console.warn('Lỗi updatePost Supabase:', err);
    }
  }

  // Update Local Storage
  const posts = getLocalPosts();
  const idx = posts.findIndex(p => p.id === postId);
  if (idx !== -1) {
    posts[idx] = {
      ...posts[idx],
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.author_name !== undefined && { author_name: input.author_name }),
      ...(input.is_pinned !== undefined && { is_pinned: input.is_pinned }),
      ...(input.is_important !== undefined && { is_important: input.is_important }),
      ...(input.comments_enabled !== undefined && { comments_enabled: input.comments_enabled }),
      updated_at: nowIso,
    };
    saveLocalPosts(posts);
    return posts[idx];
  }
  return null;
}

// ----------------------------------------------------
// 5. ADMIN API: Xóa bài viết
// ----------------------------------------------------
export async function deletePost(postId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('community_posts').delete().eq('id', postId);
    } catch (err) {
      console.warn('Lỗi deletePost Supabase:', err);
    }
  }

  const posts = getLocalPosts().filter(p => p.id !== postId);
  saveLocalPosts(posts);

  const comments = getLocalComments().filter(c => c.post_id !== postId);
  saveLocalComments(comments);

  const reactions = getLocalReactions().filter(r => r.post_id !== postId);
  saveLocalReactions(reactions);

  return true;
}

// ----------------------------------------------------
// 6. ADMIN API: Ghim / Bỏ ghim bài viết
// ----------------------------------------------------
export async function pinPost(postId: string, isPinned: boolean): Promise<boolean> {
  return !!(await updatePost(postId, { is_pinned: isPinned }));
}

// ----------------------------------------------------
// 7. PUBLIC & ADMIN: Lấy danh sách bình luận của 1 bài
// ----------------------------------------------------
export async function getComments(postId: string): Promise<CommunityComment[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data: commentsData, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && commentsData) {
        return buildCommentTree(commentsData);
      }
    } catch (err) {
      console.warn('Lỗi getComments Supabase, dùng local:', err);
    }
  }

  // Local storage fallback
  const allComments = getLocalComments().filter(c => c.post_id === postId);
  return buildCommentTree(allComments);
}

// Helper dựng cây bình luận (cấp 1 và cấp 2 replies)
function buildCommentTree(rawComments: CommunityComment[]): CommunityComment[] {
  const map: Record<string, CommunityComment> = {};
  const roots: CommunityComment[] = [];

  rawComments.forEach(c => {
    map[c.id] = { ...c, replies: [] };
  });

  rawComments.forEach(c => {
    if (c.parent_comment_id && map[c.parent_comment_id]) {
      map[c.parent_comment_id].replies!.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}

// ----------------------------------------------------
// 8. PUBLIC API: Tạo bình luận mới
// ----------------------------------------------------
export async function createComment(
  postId: string,
  authorName: string,
  content: string,
  parentCommentId?: string
): Promise<CommunityComment> {
  const supabase = getSupabase();
  const newCommentId = 'comm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const nowIso = new Date().toISOString();

  const newCommObj: CommunityComment = {
    id: newCommentId,
    post_id: postId,
    parent_comment_id: parentCommentId || null,
    author_name: authorName.trim() || 'Người dùng Ẩn danh',
    content: content.trim(),
    created_at: nowIso,
    replies: [],
  };

  if (supabase) {
    try {
      const { data: createdData, error } = await supabase
        .from('community_comments')
        .insert([{
          post_id: postId,
          parent_comment_id: parentCommentId || null,
          author_name: newCommObj.author_name,
          content: newCommObj.content,
          created_at: nowIso,
        }])
        .select()
        .single();

      if (!error && createdData) {
        saveLocalCommentFallback(createdData);
        return createdData;
      }
    } catch (err) {
      console.warn('Lỗi createComment Supabase, dùng local:', err);
    }
  }

  saveLocalCommentFallback(newCommObj);
  return newCommObj;
}

function saveLocalCommentFallback(comment: CommunityComment) {
  const comments = getLocalComments();
  comments.push(comment);
  saveLocalComments(comments);
}

// ----------------------------------------------------
// 9. ADMIN API: Xóa bình luận
// ----------------------------------------------------
export async function deleteComment(commentId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('community_comments').delete().eq('id', commentId);
    } catch (err) {
      console.warn('Lỗi deleteComment Supabase:', err);
    }
  }

  const comments = getLocalComments().filter(c => c.id !== commentId && c.parent_comment_id !== commentId);
  saveLocalComments(comments);
  return true;
}

// ----------------------------------------------------
// 10. PUBLIC API: Toggle Cảm Xúc (Reaction)
// ----------------------------------------------------
export async function toggleReaction(
  postId: string,
  reactionType: ReactionType
): Promise<{ added: boolean; count: number }> {
  const supabase = getSupabase();
  const visitorId = getOrCreateVisitorId();
  const nowIso = new Date().toISOString();

  let added = true;

  if (supabase) {
    try {
      // Kiểm tra xem đã thả reaction này chưa
      const { data: existing } = await supabase
        .from('community_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('visitor_id', visitorId)
        .eq('reaction_type', reactionType)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('community_reactions')
          .delete()
          .eq('id', existing.id);
        added = false;
      } else {
        await supabase
          .from('community_reactions')
          .insert([{
            post_id: postId,
            visitor_id: visitorId,
            reaction_type: reactionType,
            created_at: nowIso,
          }]);
        added = true;
      }
    } catch (err) {
      console.warn('Lỗi toggleReaction Supabase, dùng local storage:', err);
    }
  }

  // Local storage backup
  const reactions = getLocalReactions();
  const existingIdx = reactions.findIndex(
    r => r.post_id === postId && r.visitor_id === visitorId && r.reaction_type === reactionType
  );

  if (existingIdx !== -1) {
    reactions.splice(existingIdx, 1);
    added = false;
  } else {
    reactions.push({
      id: 'react_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      post_id: postId,
      reaction_type: reactionType,
      visitor_id: visitorId,
      created_at: nowIso,
    });
    added = true;
  }
  saveLocalReactions(reactions);

  // Đếm lại tổng số lượt reaction của loại này
  const totalCount = reactions.filter(
    r => r.post_id === postId && r.reaction_type === reactionType
  ).length;

  return { added, count: totalCount };
}

// ----------------------------------------------------
// 11. REALTIME SUBSCRIPTION
// ----------------------------------------------------
export function subscribeCommunityRealtime(onUpdate: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('public:community_events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_posts' },
        () => onUpdate()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_comments' },
        () => onUpdate()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_reactions' },
        () => onUpdate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Lỗi khởi tạo Supabase Realtime cho Community:', e);
    return () => {};
  }
}
