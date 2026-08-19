-- Migration for Client Questionnaire Module

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    birth_date DATE NOT NULL,
    birth_place TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female')),
    citizenship TEXT NOT NULL,
    previous_citizenship TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_identity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    inn TEXT,
    snils TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('internal', 'foreign')),
    series TEXT NOT NULL,
    number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    issuer TEXT NOT NULL,
    department_code TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('registration', 'actual', 'stay')),
    country TEXT NOT NULL,
    region TEXT,
    city TEXT NOT NULL,
    locality TEXT,
    street TEXT NOT NULL,
    house TEXT NOT NULL,
    building TEXT,
    apartment TEXT,
    postal_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    birth_date DATE,
    birth_place TEXT,
    citizenship TEXT,
    previous_citizenship TEXT,
    inn TEXT,
    snils TEXT,
    marriage_date DATE,
    marriage_place TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    birth_date DATE NOT NULL,
    birth_place TEXT,
    gender TEXT CHECK (gender IN ('male', 'female')),
    citizenship TEXT,
    birth_certificate_series TEXT,
    birth_certificate_number TEXT,
    birth_certificate_issue_date DATE,
    passport_series TEXT,
    passport_number TEXT,
    passport_issue_date DATE,
    passport_issuer TEXT,
    inn TEXT,
    snils TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    version INT DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE spouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access clients" ON clients FOR ALL USING (true);
CREATE POLICY "Public full access client_profiles" ON client_profiles FOR ALL USING (true);
CREATE POLICY "Public full access tax_identity" ON tax_identity FOR ALL USING (true);
CREATE POLICY "Public full access passports" ON passports FOR ALL USING (true);
CREATE POLICY "Public full access addresses" ON addresses FOR ALL USING (true);
CREATE POLICY "Public full access contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Public full access spouses" ON spouses FOR ALL USING (true);
CREATE POLICY "Public full access children" ON children FOR ALL USING (true);
CREATE POLICY "Public full access client_documents" ON client_documents FOR ALL USING (true);
CREATE POLICY "Public full access questionnaires" ON questionnaires FOR ALL USING (true);
