-- ==============================================================================
-- FORMSANGEL: CỔNG THÔNG TIN CA ĐOÀN & ADMIN CENTER DATABASE MIGRATION
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Portal Announcements Table
CREATE TABLE IF NOT EXISTS public.portal_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Quan trọng',
    cover_image_url TEXT,
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT DEFAULT 'Ban Quản Trị',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Rehearsal Schedules Table
CREATE TABLE IF NOT EXISTS public.rehearsal_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL DEFAULT 'Nhà thờ Bắc Hòa',
    description TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    created_by TEXT DEFAULT 'Ban Quản Trị',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Songs Library Table
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    composer TEXT,
    category TEXT NOT NULL DEFAULT 'Nhập lễ',
    key_signature TEXT,
    lyrics TEXT,
    sheet_url TEXT,
    audio_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Liturgical Services Table (Lịch Phục Vụ / Thánh Lễ)
CREATE TABLE IF NOT EXISTS public.liturgical_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    service_date DATE NOT NULL,
    service_time TIME NOT NULL DEFAULT '06:30:00',
    location TEXT NOT NULL DEFAULT 'Nhà thờ Bắc Hòa',
    occasion TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'completed')),
    created_by TEXT DEFAULT 'Ban Quản Trị',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Liturgical Service Songs Mapping Table
CREATE TABLE IF NOT EXISTS public.liturgical_service_songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.liturgical_services(id) ON DELETE CASCADE,
    song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
    custom_title TEXT,
    song_position TEXT NOT NULL CHECK (song_position IN ('nhap_le', 'dap_ca', 'alleluia', 'dang_le', 'hiep_le', 'ket_le', 'khac')),
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    uploaded_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. System Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL DEFAULT 'info',
    target_role TEXT NOT NULL DEFAULT 'all',
    related_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON public.portal_announcements(slug);
CREATE INDEX IF NOT EXISTS idx_announcements_status_pub ON public.portal_announcements(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON public.portal_announcements(is_pinned DESC, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_schedules_start_at ON public.rehearsal_schedules(start_at ASC);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON public.rehearsal_schedules(status);

CREATE INDEX IF NOT EXISTS idx_songs_category ON public.songs(category);
CREATE INDEX IF NOT EXISTS idx_songs_title ON public.songs(title);

CREATE INDEX IF NOT EXISTS idx_liturgy_date ON public.liturgical_services(service_date DESC);
CREATE INDEX IF NOT EXISTS idx_liturgy_status ON public.liturgical_services(status);

CREATE INDEX IF NOT EXISTS idx_audit_user_created ON public.audit_logs(user_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rehearsal_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liturgical_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liturgical_service_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Published Content)
CREATE POLICY "Public Read Announcements" ON public.portal_announcements FOR SELECT USING (status = 'published' OR status IS NULL);
CREATE POLICY "Public Read Schedules" ON public.rehearsal_schedules FOR SELECT USING (status = 'published' OR status IS NULL);
CREATE POLICY "Public Read Songs" ON public.songs FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Liturgical Services" ON public.liturgical_services FOR SELECT USING (status = 'published' OR status IS NULL);
CREATE POLICY "Public Read Service Songs" ON public.liturgical_service_songs FOR SELECT USING (true);
CREATE POLICY "Public Read Media Assets" ON public.media_assets FOR SELECT USING (true);

-- Admin Full Access Policies
CREATE POLICY "Admin All Announcements" ON public.portal_announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Schedules" ON public.rehearsal_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Songs" ON public.songs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Services" ON public.liturgical_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Service Songs" ON public.liturgical_service_songs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Media" ON public.media_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Audit Logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for Portal Notifications & Announcements
ALTER PUBLICATION supabase_realtime ADD TABLE public.portal_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
