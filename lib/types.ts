export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  official_description: string | null;
  price_from: number;
  price_to: number;
  government_fee: number;
  processing_time: string | null;
  assistance_price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  label: string;
  value: string;
  sort_order: number;
  next_question_id: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  service_id: string;
  question: string;
  description: string | null;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'boolean' | 'date';
  sort_order: number;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  options?: QuestionOption[];
}

export interface DocumentItem {
  id: string;
  name: string;
  description: string | null;
  document_type: string;
  created_at: string;
}

export interface ServiceDocument {
  id: string;
  service_id: string;
  document_id: string;
  required: boolean;
  condition: string | null;
  sort_order: number;
  document?: DocumentItem;
}

export interface FAQItem {
  id: string;
  service_id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface PricingRule {
  id: string;
  service_id: string;
  condition_json: any;
  amount: number;
  description: string | null;
  is_active: boolean;
}

export interface Lead {
  id: string;
  lead_number?: number;
  name: string;
  phone: string;
  whatsapp?: string | null;
  service_id?: string | null;
  client_id?: string | null;
  answers_json?: any;
  result_json?: any;
  comment?: string | null;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  created_at?: string;
  service?: Service;
}


export interface ClientProfile {
  last_name: string;
  first_name: string;
  middle_name?: string;
  birth_date: string;
  birth_place: string;
  gender: 'male' | 'female';
  citizenship: string;
  previous_citizenship?: string;
}

export interface TaxIdentity {
  inn?: string;
  snils?: string;
}

export interface Passport {
  type: 'internal' | 'foreign';
  series: string;
  number: string;
  issue_date: string;
  issuer: string;
  department_code?: string;
  expiry_date?: string;
}

export interface Address {
  type: 'registration' | 'actual' | 'stay';
  country: string;
  region?: string;
  city: string;
  locality?: string;
  street: string;
  house: string;
  building?: string;
  apartment?: string;
  postal_code?: string;
}

export interface ContactData {
  phone: string;
  whatsapp?: string;
  email?: string;
}

export interface Spouse {
  last_name: string;
  first_name: string;
  middle_name?: string;
  birth_date?: string;
  birth_place?: string;
  citizenship?: string;
  previous_citizenship?: string;
  inn?: string;
  snils?: string;
  marriage_date?: string;
  marriage_place?: string;
}

export interface Child {
  id: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  birth_date: string;
  birth_place?: string;
  gender?: 'male' | 'female';
  citizenship?: string;
  birth_certificate_series?: string;
  birth_certificate_number?: string;
  birth_certificate_issue_date?: string;
  passport_series?: string;
  passport_number?: string;
  passport_issue_date?: string;
  passport_issuer?: string;
  inn?: string;
  snils?: string;
}

export interface ClientDocument {
  id: string;
  document_type: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  notes?: string;
}

export interface FullClientQuestionnaire {
  id?: string;
  client_id?: string;
  status: 'draft' | 'completed' | 'archived';
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  profile: ClientProfile;
  tax: TaxIdentity;
  internal_passport: Passport;
  has_foreign_passport: boolean;
  foreign_passport?: Passport;
  contacts: ContactData;
  registration_address: Address;
  actual_address_same: boolean;
  actual_address?: Address;
  spouse?: Spouse;
  children: Child[];
  documents: ClientDocument[];
  consent: boolean;
  updated_at?: string;
}

export interface ClientData {
  id: string;
  created_at: string;
  status: 'active' | 'archived';
  questionnaire: FullClientQuestionnaire;
  leads_count?: number;
}

export interface ClientAuditLog {
  id: string;
  client_id: string;
  action: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  performed_by: string;
  created_at: string;
}

export interface QuestionnaireVersion {
  id: string;
  client_id: string;
  version_number: number;
  snapshot_json: FullClientQuestionnaire;
  notes?: string;
  created_at: string;
}

export interface ClientCommunication {
  id: string;
  client_id: string;
  type: 'phone' | 'whatsapp' | 'telegram' | 'email' | 'meeting' | 'other';
  manager_name: string;
  result?: string;
  comment: string;
  created_at: string;
}

export interface ManagerTask {
  id: string;
  client_id?: string;
  title: string;
  description?: string;
  assignee: string;
  due_date?: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
}
