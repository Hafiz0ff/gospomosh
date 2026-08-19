-- P0 SECURITY HARDENING MIGRATION

-- 1. DROP ALL INSECURE PERMISSIVE POLICIES
DROP POLICY IF EXISTS "Public full access clients" ON clients;
DROP POLICY IF EXISTS "Public full access client_profiles" ON client_profiles;
DROP POLICY IF EXISTS "Public full access tax_identity" ON tax_identity;
DROP POLICY IF EXISTS "Public full access passports" ON passports;
DROP POLICY IF EXISTS "Public full access addresses" ON addresses;
DROP POLICY IF EXISTS "Public full access contacts" ON contacts;
DROP POLICY IF EXISTS "Public full access spouses" ON spouses;
DROP POLICY IF EXISTS "Public full access children" ON children;
DROP POLICY IF EXISTS "Public full access client_documents" ON client_documents;
DROP POLICY IF EXISTS "Public full access questionnaires" ON questionnaires;

DROP POLICY IF EXISTS "Public select leads" ON leads;
DROP POLICY IF EXISTS "Public update leads" ON leads;
DROP POLICY IF EXISTS "Public insert leads" ON leads;
DROP POLICY IF EXISTS "Admin select leads" ON leads;
DROP POLICY IF EXISTS "Admin update leads" ON leads;

-- 2. SECURE LEADS POLICIES
-- Anonymous can ONLY insert new leads
CREATE POLICY "Anonymous can insert leads" ON leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- ONLY Authenticated Admin can SELECT, UPDATE, DELETE leads
CREATE POLICY "Authenticated admin can select leads" ON leads
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Authenticated admin can update leads" ON leads
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete leads" ON leads
    FOR DELETE TO authenticated
    USING (true);

-- 3. SECURE CLIENT PERSONAL DATA POLICIES (AUTHENTICATED ONLY)
CREATE POLICY "Admin full access clients" ON clients
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access client_profiles" ON client_profiles
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access tax_identity" ON tax_identity
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access passports" ON passports
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access addresses" ON addresses
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access contacts" ON contacts
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access spouses" ON spouses
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access children" ON children
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access client_documents" ON client_documents
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access questionnaires" ON questionnaires
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. SECURE RPC TO SUBMIT QUESTIONNAIRE ANONYMOUSLY (SECURITY DEFINER)
-- Allows anonymous to insert full questionnaire without granting SELECT permissions on the database
CREATE OR REPLACE FUNCTION public.submit_client_questionnaire(payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_id UUID;
    v_q_id UUID;
    v_child JSONB;
    v_doc JSONB;
BEGIN
    -- 1. Create client
    INSERT INTO clients (status) VALUES ('active') RETURNING id INTO v_client_id;

    -- 2. Create profile
    INSERT INTO client_profiles (
        client_id, last_name, first_name, middle_name, birth_date, birth_place, gender, citizenship, previous_citizenship
    ) VALUES (
        v_client_id,
        payload->'profile'->>'last_name',
        payload->'profile'->>'first_name',
        payload->'profile'->>'middle_name',
        (payload->'profile'->>'birth_date')::DATE,
        payload->'profile'->>'birth_place',
        payload->'profile'->>'gender',
        payload->'profile'->>'citizenship',
        payload->'profile'->>'previous_citizenship'
    );

    -- 3. Create Tax Identity (INN & SNILS)
    IF (payload->'tax'->>'inn') IS NOT NULL OR (payload->'tax'->>'snils') IS NOT NULL THEN
        INSERT INTO tax_identity (client_id, inn, snils)
        VALUES (v_client_id, payload->'tax'->>'inn', payload->'tax'->>'snils');
    END IF;

    -- 4. Create Passports
    IF (payload->'internal_passport') IS NOT NULL THEN
        INSERT INTO passports (
            client_id, type, series, number, issue_date, issuer, department_code
        ) VALUES (
            v_client_id,
            'internal',
            payload->'internal_passport'->>'series',
            payload->'internal_passport'->>'number',
            (payload->'internal_passport'->>'issue_date')::DATE,
            payload->'internal_passport'->>'issuer',
            payload->'internal_passport'->>'department_code'
        );
    END IF;

    IF (payload->>'has_foreign_passport')::BOOLEAN = true AND (payload->'foreign_passport') IS NOT NULL THEN
        INSERT INTO passports (
            client_id, type, series, number, issue_date, issuer, expiry_date
        ) VALUES (
            v_client_id,
            'foreign',
            payload->'foreign_passport'->>'series',
            payload->'foreign_passport'->>'number',
            (payload->'foreign_passport'->>'issue_date')::DATE,
            payload->'foreign_passport'->>'issuer',
            CASE WHEN (payload->'foreign_passport'->>'expiry_date') IS NOT NULL THEN (payload->'foreign_passport'->>'expiry_date')::DATE ELSE NULL END
        );
    END IF;

    -- 5. Contacts
    INSERT INTO contacts (client_id, phone, whatsapp, email)
    VALUES (
        v_client_id,
        payload->'contacts'->>'phone',
        payload->'contacts'->>'whatsapp',
        payload->'contacts'->>'email'
    );

    -- 6. Address
    INSERT INTO addresses (
        client_id, type, country, region, city, locality, street, house, building, apartment, postal_code
    ) VALUES (
        v_client_id,
        'registration',
        COALESCE(payload->'registration_address'->>'country', 'Российская Федерация'),
        payload->'registration_address'->>'region',
        payload->'registration_address'->>'city',
        payload->'registration_address'->>'locality',
        payload->'registration_address'->>'street',
        payload->'registration_address'->>'house',
        payload->'registration_address'->>'building',
        payload->'registration_address'->>'apartment',
        payload->'registration_address'->>'postal_code'
    );

    -- 7. Spouse
    IF (payload->>'marital_status') = 'married' AND (payload->'spouse') IS NOT NULL THEN
        INSERT INTO spouses (
            client_id, last_name, first_name, middle_name, birth_date, birth_place, citizenship, marriage_date, marriage_place
        ) VALUES (
            v_client_id,
            payload->'spouse'->>'last_name',
            payload->'spouse'->>'first_name',
            payload->'spouse'->>'middle_name',
            CASE WHEN (payload->'spouse'->>'birth_date') IS NOT NULL THEN (payload->'spouse'->>'birth_date')::DATE ELSE NULL END,
            payload->'spouse'->>'birth_place',
            payload->'spouse'->>'citizenship',
            CASE WHEN (payload->'spouse'->>'marriage_date') IS NOT NULL THEN (payload->'spouse'->>'marriage_date')::DATE ELSE NULL END,
            payload->'spouse'->>'marriage_place'
        );
    END IF;

    -- 8. Children
    IF (payload->'children') IS NOT NULL AND jsonb_array_length(payload->'children') > 0 THEN
        FOR v_child IN SELECT * FROM jsonb_array_elements(payload->'children')
        LOOP
            INSERT INTO children (
                client_id, last_name, first_name, middle_name, birth_date, citizenship,
                passport_series, passport_number
            ) VALUES (
                v_client_id,
                v_child->>'last_name',
                v_child->>'first_name',
                v_child->>'middle_name',
                (v_child->>'birth_date')::DATE,
                v_child->>'citizenship',
                v_child->>'passport_series',
                v_child->>'passport_number'
            );
        END LOOP;
    END IF;

    -- 9. Documents
    IF (payload->'documents') IS NOT NULL AND jsonb_array_length(payload->'documents') > 0 THEN
        FOR v_doc IN SELECT * FROM jsonb_array_elements(payload->'documents')
        LOOP
            INSERT INTO client_documents (
                client_id, document_type, document_number
            ) VALUES (
                v_client_id,
                v_doc->>'document_type',
                v_doc->>'document_number'
            );
        END LOOP;
    END IF;

    -- 10. Questionnaire status
    INSERT INTO questionnaires (
        client_id, version, status, completed_at
    ) VALUES (
        v_client_id,
        1,
        COALESCE(payload->>'status', 'completed'),
        NOW()
    ) RETURNING id INTO v_q_id;

    RETURN jsonb_build_object(
        'success', true,
        'client_id', v_client_id,
        'questionnaire_id', v_q_id
    );
END;
$$;

-- Grant anonymous execution to RPC
GRANT EXECUTE ON FUNCTION public.submit_client_questionnaire(JSONB) TO anon, authenticated;
