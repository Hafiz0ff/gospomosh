-- P1 CRM & QUESTIONNAIRE ENHANCEMENTS MIGRATION

-- 1. Client Audit Logs Table
CREATE TABLE IF NOT EXISTS public.client_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    performed_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Questionnaire Versions Table
CREATE TABLE IF NOT EXISTS public.questionnaire_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot_json JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Extend clients with verification statuses and archive states
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS inn_check_status TEXT DEFAULT 'format_valid',
ADD COLUMN IF NOT EXISTS snils_check_status TEXT DEFAULT 'format_valid',
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- 4. Extend client_documents with storage fields
ALTER TABLE public.client_documents
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS file_size INT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'uploaded';

-- 5. RLS Policies for new tables (AUTHENTICATED ONLY)
ALTER TABLE public.client_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access client_audit_logs" ON public.client_audit_logs
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access questionnaire_versions" ON public.questionnaire_versions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);
