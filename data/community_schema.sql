-- ==============================================================================
-- FORMSANGEL: COMMUNITY FEATURE DATABASE SCHEMA
-- ==============================================================================

-- 1. Bảng Bài Viết (community_posts)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '📢 Thông báo',
    author_name TEXT NOT NULL DEFAULT 'Trưởng Ca Đoàn',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    comments_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Bảng Bình Luận (community_comments)
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Bảng Phản Ứng / Reactions (community_reactions)
CREATE TABLE IF NOT EXISTS public.community_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'like', 'pray', 'party')),
    visitor_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_post_visitor_reaction UNIQUE (post_id, visitor_id, reaction_type)
);

-- 4. Bảng File Đính Kèm (community_attachments)
CREATE TABLE IF NOT EXISTS public.community_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'image',
    file_size TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES TỐI ƯU TRUY VẤN
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_community_posts_pinned_created ON public.community_posts (is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments (post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_community_reactions_post_id ON public.community_reactions (post_id);
CREATE INDEX IF NOT EXISTS idx_community_attachments_post_id ON public.community_attachments (post_id);

-- ==============================================================================
-- REALTIME PUBLICATION SETUP
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reactions;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_attachments ENABLE ROW LEVEL SECURITY;

-- Allow Public READ for all community tables
CREATE POLICY "Public Read Community Posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Public Read Community Comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Public Read Community Reactions" ON public.community_reactions FOR SELECT USING (true);
CREATE POLICY "Public Read Community Attachments" ON public.community_attachments FOR SELECT USING (true);

-- Allow Public to INSERT comments & reactions
CREATE POLICY "Public Insert Community Comments" ON public.community_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Community Reactions" ON public.community_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Own Reactions" ON public.community_reactions FOR DELETE USING (true);

-- Allow Admin (all operations using anon or authenticated role according to app config)
CREATE POLICY "Allow All Community Posts Ops" ON public.community_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Community Comments Ops" ON public.community_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Community Attachments Ops" ON public.community_attachments FOR ALL USING (true) WITH CHECK (true);
