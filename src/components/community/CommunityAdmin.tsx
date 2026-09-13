import React, { useState, useEffect } from 'react';
import { CommunityPost, CreatePostInput } from '../../types/community.ts';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  pinPost,
  subscribeCommunityRealtime,
} from '../../lib/communityApi.ts';
import { CommunitySearch } from './CommunitySearch.tsx';
import { CommunityFilters } from './CommunityFilters.tsx';
import { CommunityComposer } from './CommunityComposer.tsx';
import { CommunityPostDetail } from './CommunityPostDetail.tsx';
import {
  Plus,
  Pin,
  MessageSquare,
  Edit,
  Trash2,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  ExternalLink,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const CommunityAdmin: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Modal Composer state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);

  // Detail & Moderation modal
  const [activeDetailPost, setActiveDetailPost] = useState<CommunityPost | null>(null);

  const fetchPosts = async () => {
    try {
      const data = await getPosts(selectedCategory, searchQuery);
      setPosts(data);
    } catch (err) {
      console.error('Lỗi tải bài viết Admin Community:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const unsub = subscribeCommunityRealtime(() => {
      fetchPosts();
    });
    return () => unsub();
  }, [selectedCategory, searchQuery]);

  // Admin Actions
  const handleCreateOrUpdatePost = async (input: CreatePostInput): Promise<boolean> => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, input);
      } else {
        await createPost(input);
      }
      await fetchPosts();
      return true;
    } catch (err) {
      console.error('Lỗi lưu bài viết Admin:', err);
      return false;
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn XÓA bài viết này khỏi Diễn đàn? Thao tác này không thể hoàn tác!')) return;
    try {
      await deletePost(postId);
      await fetchPosts();
    } catch (err) {
      console.error('Lỗi xóa bài viết:', err);
    }
  };

  const handleTogglePin = async (post: CommunityPost) => {
    try {
      await pinPost(post.id, !post.is_pinned);
      await fetchPosts();
    } catch (err) {
      console.error('Lỗi toggle pin:', err);
    }
  };

  const handleToggleComments = async (post: CommunityPost) => {
    try {
      await updatePost(post.id, { comments_enabled: !post.comments_enabled });
      await fetchPosts();
    } catch (err) {
      console.error('Lỗi toggle comments:', err);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Admin Community Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
              🗣️ Quản Lý Diễn Đàn Cộng Đồng
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              Admin
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Tạo thông báo, ghim bài viết quan trọng, bật/tắt bình luận và kiểm duyệt nội dung cho toàn thể ca đoàn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchPosts}
            className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          <a
            href={`${window.location.origin}${window.location.pathname.replace(/\/+$/, '')}/community`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở Public Link</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setEditingPost(null);
              setIsComposerOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Controls: Search & Category filters */}
      <div className="space-y-3">
        <CommunitySearch
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <CommunityFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Posts List for Admin */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 border-4 border-sky-400/20 border-t-sky-500 rounded-full animate-spin" />
          <span>Đang tải danh sách bài viết Admin...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Chưa có bài viết nào trong Diễn đàn.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div
              key={post.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors"
            >
              
              {/* Header metadata */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {post.category}
                    </span>

                    {post.is_pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <Pin className="w-3 h-3 fill-amber-500" />
                        <span>Đã ghim</span>
                      </span>
                    )}

                    {post.is_important && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        <AlertCircle className="w-3 h-3" />
                        <span>Quan trọng</span>
                      </span>
                    )}

                    {!post.comments_enabled && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>Khóa bình luận</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>

              {/* Content preview */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {post.content}
              </p>

              {/* Admin Actions Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                
                <div className="flex items-center gap-4 text-slate-500">
                  <span>Tác giả: <strong className="text-slate-700 dark:text-slate-300">{post.author_name}</strong></span>
                  <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments_count || 0} bình luận</span>
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  
                  {/* Pin button */}
                  <button
                    type="button"
                    onClick={() => handleTogglePin(post)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1 ${
                      post.is_pinned
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>{post.is_pinned ? 'Bỏ ghim' : 'Ghim bài'}</span>
                  </button>

                  {/* Toggle comment button */}
                  <button
                    type="button"
                    onClick={() => handleToggleComments(post)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1 ${
                      post.comments_enabled
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    {post.comments_enabled ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{post.comments_enabled ? 'Bật Comment' : 'Tắt Comment'}</span>
                  </button>

                  {/* Moderate / View Details */}
                  <button
                    type="button"
                    onClick={() => setActiveDetailPost(post)}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold hover:bg-sky-100 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Duyệt Comment</span>
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost(post);
                      setIsComposerOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Composer */}
      {isComposerOpen && (
        <CommunityComposer
          initialPost={editingPost}
          isOpen={isComposerOpen}
          onClose={() => {
            setIsComposerOpen(false);
            setEditingPost(null);
          }}
          onSubmit={handleCreateOrUpdatePost}
        />
      )}

      {/* Modal Detail for Admin moderation */}
      {activeDetailPost && (
        <CommunityPostDetail
          post={activeDetailPost}
          onClose={() => setActiveDetailPost(null)}
          isAdmin={true}
          onPostUpdate={fetchPosts}
        />
      )}

    </div>
  );
};
