-- P2 MANAGER CRM, COMMUNICATIONS, TASKS & STORAGE MIGRATION

-- 1. Client Communications Table
CREATE TABLE IF NOT EXISTS public.client_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('phone', 'whatsapp', 'telegram', 'email', 'meeting', 'other')),
    manager_name TEXT NOT NULL DEFAULT 'Менеджер',
    result TEXT,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Manager Tasks Table
CREATE TABLE IF NOT EXISTS public.manager_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    assignee TEXT NOT NULL DEFAULT 'Менеджер',
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Extend client_documents
ALTER TABLE public.client_documents
ADD COLUMN IF NOT EXISTS owner_type TEXT DEFAULT 'client' CHECK (owner_type IN ('client', 'spouse', 'child')),
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS is_unlimited BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS used_for_services TEXT[] DEFAULT '{}';

-- 4. Enable RLS and Strict Policies (AUTHENTICATED ONLY)
ALTER TABLE public.client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access client_communications" ON public.client_communications
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access manager_tasks" ON public.manager_tasks
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Storage Bucket Configuration for Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'client-documents',
    'client-documents',
    false,
    20971520, -- 20 MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS (Authenticated only)
CREATE POLICY "Authenticated users can access client documents bucket"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'client-documents')
WITH CHECK (bucket_id = 'client-documents');
