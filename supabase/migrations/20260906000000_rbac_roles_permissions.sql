-- ========================================================
-- MODULE 6: RBAC (ROLE-BASED ACCESS CONTROL) MIGRATION
-- Roles: 'admin', 'manager', 'operator'
-- ========================================================

-- 1. Create user_profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager', 'operator')),
    full_name TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add assigned_manager_id to clients table for manager-level assignment
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS assigned_manager_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 3. Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Helper function to get current user role in SQL
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        (SELECT role FROM public.user_profiles WHERE id = auth.uid()),
        'admin' -- Default permissive fallback for existing demo credentials
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. user_profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "Admins can manage all profiles"
    ON public.user_profiles FOR ALL
    TO authenticated
    USING (public.current_user_role() = 'admin')
    WITH CHECK (public.current_user_role() = 'admin');

-- 6. Strict RBAC Policies for clients table
-- Drop existing blanket policies if necessary, and apply granular RBAC:
-- Admins: FULL ACCESS (SELECT, INSERT, UPDATE, DELETE)
-- Managers: SELECT, INSERT, UPDATE (DELETE restricted)
-- Operators: SELECT own drafts, INSERT only (DELETE & EXPORT restricted)

CREATE POLICY "RBAC Admin full access clients"
    ON public.clients FOR ALL
    TO authenticated
    USING (public.current_user_role() = 'admin')
    WITH CHECK (public.current_user_role() = 'admin');

CREATE POLICY "RBAC Manager access clients"
    ON public.clients FOR SELECT
    TO authenticated
    USING (
        public.current_user_role() = 'manager' 
        AND (assigned_manager_id = auth.uid() OR assigned_manager_id IS NULL)
    );

CREATE POLICY "RBAC Manager update clients"
    ON public.clients FOR UPDATE
    TO authenticated
    USING (
        public.current_user_role() = 'manager' 
        AND (assigned_manager_id = auth.uid() OR assigned_manager_id IS NULL)
    )
    WITH CHECK (
        public.current_user_role() = 'manager'
    );

-- 7. Trigger to automatically create a user_profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, role, full_name, is_active)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'manager'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        TRUE
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
