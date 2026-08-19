import { supabase } from './supabase';
import { MOCK_CATEGORIES, MOCK_SERVICES, MOCK_QUESTIONS, MOCK_DOCUMENTS, MOCK_FAQ } from './mockData';
import {
  Category, Service, Question, DocumentItem, FAQItem, Lead,
  FullClientQuestionnaire, ClientData, ClientCommunication, ManagerTask
} from './types';

let memoryLeads: Lead[] = [
  {
    id: 'lead-1001',
    lead_number: 1001,
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    whatsapp: '+79991234567',
    service_id: 'srv-1',
    answers_json: { 'q-1': 'has_rvp', 'q-3': 'full_support' },
    result_json: { fee: 6000, time: 'От 4 месяцев', price: 15000 },
    comment: 'Прошу связаться в Telegram / WhatsApp',
    status: 'new',
    created_at: new Date().toISOString(),
    service: MOCK_SERVICES[0]
  }
];

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    if (error || !data || data.length === 0) return MOCK_CATEGORIES;
    return data as Category[];
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase.from('services').select('*, category:categories(*)').order('sort_order');
    if (error || !data || data.length === 0) return MOCK_SERVICES;
    return data as Service[];
  } catch {
    return MOCK_SERVICES;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();
    if (error || !data) {
      const found = MOCK_SERVICES.find((s) => s.slug === slug);
      return found || null;
    }
    return data as Service;
  } catch {
    const found = MOCK_SERVICES.find((s) => s.slug === slug);
    return found || null;
  }
}

export async function getQuestionsByServiceSlug(serviceSlug: string): Promise<Question[]> {
  try {
    const service = await getServiceBySlug(serviceSlug);
    if (!service) return MOCK_QUESTIONS[serviceSlug] || [];
    const { data, error } = await supabase
      .from('questions')
      .select('*, options:question_options(*)')
      .eq('service_id', service.id)
      .order('sort_order');
    if (error || !data || data.length === 0) {
      return MOCK_QUESTIONS[serviceSlug] || [];
    }
    return data as Question[];
  } catch {
    return MOCK_QUESTIONS[serviceSlug] || [];
  }
}

export async function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'lead_number'>): Promise<Lead> {
  const nextNumber = 1000 + memoryLeads.length + 1;
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    lead_number: nextNumber,
    created_at: new Date().toISOString(),
    ...leadData
  };

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error || !data) {
      memoryLeads.unshift(newLead);
      return newLead;
    }
    return data as Lead;
  } catch {
    memoryLeads.unshift(newLead);
    return newLead;
  }
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, service:services(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return memoryLeads;
    }
    return data as Lead[];
  } catch {
    return memoryLeads;
  }
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (!error) return true;
  } catch {
    // fallback
  }
  const idx = memoryLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    memoryLeads[idx].status = status;
    return true;
  }
  return false;
}

// CLIENT & QUESTIONNAIRE MEMORY STORE & FUNCTIONS
// CLIENT & QUESTIONNAIRE MEMORY STORE & FUNCTIONS
let memoryClients: ClientData[] = [
  {
    id: 'cl-1001',
    created_at: '2026-08-19T10:00:00.000Z',
    status: 'active',
    leads_count: 2,
    questionnaire: {
      id: 'q-1001',
      client_id: 'cl-1001',
      status: 'completed',
      marital_status: 'married',
      consent: true,
      profile: {
        last_name: 'Иванов',
        first_name: 'Иван',
        middle_name: 'Иванович',
        birth_date: '1985-06-15',
        birth_place: 'г. Москва',
        gender: 'male',
        citizenship: 'Российская Федерация'
      },
      tax: {
        inn: '771234567890',
        snils: '12345678901'
      },
      internal_passport: {
        type: 'internal',
        series: '4510',
        number: '123456',
        issue_date: '2005-07-20',
        issuer: 'ГУ МВД России по г. Москве',
        department_code: '770-001'
      },
      has_foreign_passport: true,
      foreign_passport: {
        type: 'foreign',
        series: '75',
        number: '9876543',
        issue_date: '2020-01-10',
        issuer: 'МВД 77001',
        expiry_date: '2030-01-10'
      },
      contacts: {
        phone: '+7 (999) 000-11-22',
        whatsapp: '+79990001122',
        email: 'ivanov.demo@mail.ru'
      },
      registration_address: {
        type: 'registration',
        country: 'Российская Федерация',
        city: 'Москва',
        street: 'ул. Тверская',
        house: '12',
        apartment: '45'
      },
      actual_address_same: true,
      spouse: {
        last_name: 'Иванова',
        first_name: 'Мария',
        middle_name: 'Петровна',
        birth_date: '1988-04-12',
        birth_place: 'г. Санкт-Петербург',
        citizenship: 'Российская Федерация'
      },
      children: [
        {
          id: 'ch-1',
          last_name: 'Иванов',
          first_name: 'Алексей',
          middle_name: 'Иванович',
          birth_date: '2015-08-20',
          citizenship: 'Российская Федерация'
        }
      ],
      documents: []
    }
  },
  {
    id: 'cl-1002',
    created_at: '2026-08-19T11:30:00.000Z',
    status: 'active',
    leads_count: 1,
    questionnaire: {
      id: 'q-1002',
      client_id: 'cl-1002',
      status: 'completed',
      marital_status: 'single',
      consent: true,
      profile: {
        last_name: 'Петрова',
        first_name: 'Анна',
        middle_name: 'Сергеевна',
        birth_date: '1992-11-03',
        birth_place: 'г. Новосибирск',
        gender: 'female',
        citizenship: 'Российская Федерация'
      },
      tax: {
        inn: '540123456789',
        snils: '23456789012'
      },
      internal_passport: {
        type: 'internal',
        series: '5012',
        number: '654321',
        issue_date: '2012-12-05',
        issuer: 'Отделом УФМС по Новосибирской области',
        department_code: '540-002'
      },
      has_foreign_passport: false,
      contacts: {
        phone: '+7 (913) 555-44-33',
        whatsapp: '+79135554433',
        email: 'petrova.demo@yandex.ru'
      },
      registration_address: {
        type: 'registration',
        country: 'Российская Федерация',
        city: 'Новосибирск',
        street: 'Красный проспект',
        house: '25',
        apartment: '14'
      },
      actual_address_same: true,
      children: [],
      documents: []
    }
  },
  {
    id: 'cl-1003',
    created_at: '2026-08-19T14:15:00.000Z',
    status: 'active',
    leads_count: 1,
    questionnaire: {
      id: 'q-1003',
      client_id: 'cl-1003',
      status: 'completed',
      marital_status: 'married',
      consent: true,
      profile: {
        last_name: 'Саидов',
        first_name: 'Рустам',
        middle_name: 'Алиевич',
        birth_date: '1990-03-22',
        birth_place: 'г. Самарканд',
        gender: 'male',
        citizenship: 'Республика Узбекистан'
      },
      tax: {
        inn: '772345678901',
        snils: '34567890123'
      },
      internal_passport: {
        type: 'internal',
        series: 'FA',
        number: '8877665',
        issue_date: '2018-05-14',
        issuer: 'МВД Республики Узбекистан',
        department_code: 'УЗБ-01'
      },
      has_foreign_passport: true,
      foreign_passport: {
        type: 'foreign',
        series: 'FA',
        number: '8877665',
        issue_date: '2018-05-14',
        issuer: 'МВД Республики Узбекистан',
        expiry_date: '2028-05-14'
      },
      contacts: {
        phone: '+7 (926) 777-88-99',
        whatsapp: '+79267778899',
        email: 'saidov.demo@gmail.com'
      },
      registration_address: {
        type: 'registration',
        country: 'Российская Федерация',
        city: 'Москва',
        street: 'ул. Профсоюзная',
        house: '84',
        apartment: '102'
      },
      actual_address_same: true,
      spouse: {
        last_name: 'Саидова',
        first_name: 'Нигора',
        middle_name: 'Баходировна',
        birth_date: '1993-09-18',
        citizenship: 'Республика Узбекистан'
      },
      children: [
        {
          id: 'ch-2',
          last_name: 'Саидов',
          first_name: 'Тимур',
          middle_name: 'Рустамович',
          birth_date: '2019-02-10',
          citizenship: 'Республика Узбекистан'
        },
        {
          id: 'ch-3',
          last_name: 'Саидова',
          first_name: 'Дильноза',
          middle_name: 'Рустамовна',
          birth_date: '2021-07-04',
          citizenship: 'Республика Узбекистан'
        }
      ],
      documents: []
    }
  }
];

export async function getClients(): Promise<ClientData[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*, profile:client_profiles(*), tax:tax_identity(*), passports(*), contacts(*), addresses(*), spouses(*), children(*), questionnaires(*), client_documents(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return memoryClients;
    return data.map((c: any) => {
      const q = c.questionnaires?.[0] || {};
      const prof = c.profile || {};
      const tax = c.tax || {};
      const internalPass = c.passports?.find((p: any) => p.type === 'internal') || {};
      const foreignPass = c.passports?.find((p: any) => p.type === 'foreign');
      const cont = c.contacts || {};
      const regAddr = c.addresses?.find((a: any) => a.type === 'registration') || {};

      return {
        id: c.id,
        created_at: c.created_at,
        status: c.status,
        questionnaire: {
          id: q.id || `q-${c.id}`,
          client_id: c.id,
          status: q.status || 'completed',
          marital_status: c.spouses ? 'married' : 'single',
          consent: true,
          profile: {
            last_name: prof.last_name || '',
            first_name: prof.first_name || '',
            middle_name: prof.middle_name || '',
            birth_date: prof.birth_date || '',
            birth_place: prof.birth_place || '',
            gender: prof.gender || 'male',
            citizenship: prof.citizenship || 'Российская Федерация'
          },
          tax: {
            inn: tax.inn || '',
            snils: tax.snils || ''
          },
          internal_passport: {
            type: 'internal',
            series: internalPass.series || '',
            number: internalPass.number || '',
            issue_date: internalPass.issue_date || '',
            issuer: internalPass.issuer || '',
            department_code: internalPass.department_code || ''
          },
          has_foreign_passport: !!foreignPass,
          foreign_passport: foreignPass ? {
            type: 'foreign',
            series: foreignPass.series,
            number: foreignPass.number,
            issue_date: foreignPass.issue_date,
            issuer: foreignPass.issuer,
            expiry_date: foreignPass.expiry_date
          } : undefined,
          contacts: {
            phone: cont.phone || '',
            whatsapp: cont.whatsapp || '',
            email: cont.email || ''
          },
          registration_address: {
            type: 'registration',
            country: regAddr.country || 'Российская Федерация',
            region: regAddr.region || '',
            city: regAddr.city || '',
            street: regAddr.street || '',
            house: regAddr.house || '',
            apartment: regAddr.apartment || ''
          },
          actual_address_same: true,
          spouse: c.spouses ? {
            last_name: c.spouses.last_name,
            first_name: c.spouses.first_name,
            middle_name: c.spouses.middle_name,
            birth_date: c.spouses.birth_date,
            citizenship: c.spouses.citizenship
          } : undefined,
          children: c.children || [],
          documents: c.client_documents || []
        }
      };
    });
  } catch {
    return memoryClients;
  }
}

export async function getClientById(id: string): Promise<ClientData | null> {
  const clients = await getClients();
  return clients.find((c) => c.id === id) || null;
}

export async function saveQuestionnaire(q: FullClientQuestionnaire): Promise<{ id: string; client_id: string }> {
  const clientId = q.client_id || `cl-${Date.now()}`;
  const qId = q.id || `q-${Date.now()}`;

  const clientItem: ClientData = {
    id: clientId,
    created_at: new Date().toISOString(),
    status: 'active',
    questionnaire: {
      ...q,
      id: qId,
      client_id: clientId,
      updated_at: new Date().toISOString()
    }
  };

  const existingIdx = memoryClients.findIndex((c) => c.id === clientId);
  if (existingIdx >= 0) {
    memoryClients[existingIdx] = clientItem;
  } else {
    memoryClients.unshift(clientItem);
  }

  return { id: qId, client_id: clientId };
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await supabase.from('clients').delete().eq('id', id);
  } catch {}
  memoryClients = memoryClients.filter((c) => c.id !== id);
  return true;
}

export async function getClientQuestionnaire(clientId: string): Promise<FullClientQuestionnaire | null> {
  const client = await getClientById(clientId);
  return client ? client.questionnaire : null;
}

// ==========================================
// P2 CRM: COMMUNICATIONS & TASKS
// ==========================================

export async function getClientCommunications(clientId: string): Promise<ClientCommunication[]> {
  try {
    const { data, error } = await supabase
      .from('client_communications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as ClientCommunication[];
  } catch {
    return [];
  }
}

export async function addClientCommunication(comm: Omit<ClientCommunication, 'id' | 'created_at'>): Promise<ClientCommunication | null> {
  try {
    const { data, error } = await supabase
      .from('client_communications')
      .insert([comm])
      .select()
      .single();

    if (error || !data) {
      return {
        id: `comm-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...comm
      };
    }
    return data as ClientCommunication;
  } catch {
    return {
      id: `comm-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...comm
    };
  }
}

export async function getManagerTasks(clientId?: string): Promise<ManagerTask[]> {
  try {
    let query = supabase.from('manager_tasks').select('*').order('created_at', { ascending: false });
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return data as ManagerTask[];
  } catch {
    return [];
  }
}

export async function createManagerTask(task: Omit<ManagerTask, 'id' | 'created_at'>): Promise<ManagerTask | null> {
  try {
    const { data, error } = await supabase
      .from('manager_tasks')
      .insert([task])
      .select()
      .single();

    if (error || !data) {
      return {
        id: `task-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...task
      };
    }
    return data as ManagerTask;
  } catch {
    return {
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...task
    };
  }
}

export async function updateManagerTaskStatus(taskId: string, status: ManagerTask['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('manager_tasks')
      .update({ status })
      .eq('id', taskId);

    return !error;
  } catch {
    return true;
  }
}

export async function getDocuments(): Promise<DocumentItem[]> {
  try {
    const { data, error } = await supabase.from('documents').select('*');
    if (error || !data || data.length === 0) return MOCK_DOCUMENTS;
    return data as DocumentItem[];
  } catch {
    return MOCK_DOCUMENTS;
  }
}

export async function getFAQ(serviceId?: string): Promise<FAQItem[]> {
  try {
    let query = supabase.from('faq').select('*').order('sort_order');
    if (serviceId) {
      query = query.eq('service_id', serviceId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) return MOCK_FAQ;
    return data as FAQItem[];
  } catch {
    return MOCK_FAQ;
  }
}
