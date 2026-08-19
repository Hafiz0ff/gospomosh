-- Migration for MVP

CREATE EXTENSION IF NOT EXISTS " uuid-ossp\;

CREATE TABLE IF NOT EXISTS categories (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 name TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 description TEXT,
 icon TEXT,
 sort_order INT DEFAULT 0,
 is_active BOOLEAN DEFAULT true,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 short_description TEXT,
 description TEXT,
 official_description TEXT,
 price_from NUMERIC(10, 2) DEFAULT 0,
 price_to NUMERIC(10, 2) DEFAULT 0,
 government_fee NUMERIC(10, 2) DEFAULT 0,
 processing_time TEXT,
 assistance_price NUMERIC(10, 2) DEFAULT 0,
 is_active BOOLEAN DEFAULT true,
 sort_order INT DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 service_id UUID REFERENCES services(id) ON DELETE CASCADE,
 question TEXT NOT NULL,
 description TEXT,
 type TEXT NOT NULL CHECK (type IN ('single_choice', 'multiple_choice', 'text', 'number', 'boolean', 'date')),
 sort_order INT DEFAULT 0,
 is_required BOOLEAN DEFAULT true,
 is_active BOOLEAN DEFAULT true,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_options (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
 label TEXT NOT NULL,
 value TEXT NOT NULL,
 sort_order INT DEFAULT 0,
 next_question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 name TEXT NOT NULL,
 description TEXT,
 document_type TEXT DEFAULT 'Официальный',
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_documents (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 service_id UUID REFERENCES services(id) ON DELETE CASCADE,
 document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
 required BOOLEAN DEFAULT true,
 condition TEXT,
 sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS rules (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 service_id UUID REFERENCES services(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 condition_json JSONB DEFAULT '{}'::jsonb,
 action_json JSONB DEFAULT '{}'::jsonb,
 priority INT DEFAULT 0,
 is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS faq (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 service_id UUID REFERENCES services(id) ON DELETE CASCADE,
 question TEXT NOT NULL,
 answer TEXT NOT NULL,
 sort_order INT DEFAULT 0,
 is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS pricing_rules (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 service_id UUID REFERENCES services(id) ON DELETE CASCADE,
 condition_json JSONB DEFAULT '{}'::jsonb,
 amount NUMERIC(10, 2) DEFAULT 0,
 description TEXT,
 is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS leads (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 lead_number SERIAL,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 whatsapp TEXT,
 service_id UUID REFERENCES services(id) ON DELETE SET NULL,
 answers_json JSONB DEFAULT '{}'::jsonb,
 result_json JSONB DEFAULT '{}'::jsonb,
 comment TEXT,
 status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
 created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY \Public read categories\ ON categories FOR SELECT USING (true);
CREATE POLICY \Public read services\ ON services FOR SELECT USING (true);
CREATE POLICY \Public read questions\ ON questions FOR SELECT USING (true);
CREATE POLICY \Public read question_options\ ON question_options FOR SELECT USING (true);
CREATE POLICY \Public read documents\ ON documents FOR SELECT USING (true);
CREATE POLICY \Public read service_documents\ ON service_documents FOR SELECT USING (true);
CREATE POLICY \Public read rules\ ON rules FOR SELECT USING (true);
CREATE POLICY \Public read faq\ ON faq FOR SELECT USING (true);
CREATE POLICY \Public read pricing_rules\ ON pricing_rules FOR SELECT USING (true);
CREATE POLICY \Public insert leads\ ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY \Public select leads\ ON leads FOR SELECT USING (true);
CREATE POLICY \Public update leads\ ON leads FOR UPDATE USING (true);
