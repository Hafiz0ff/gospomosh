import * as XLSX from 'xlsx';
import { ClientData } from './types';

export function exportClientsToExcel(clients: ClientData[]) {
  const rows = clients.map((c, index) => {
    const q = c.questionnaire;
    const prof = q?.profile || ({} as any);
    const tax = q?.tax || ({} as any);
    const pass = q?.internal_passport || ({} as any);
    const foreignPass = q?.foreign_passport || ({} as any);
    const cont = q?.contacts || ({} as any);
    const addr = q?.registration_address || ({} as any);
    const spouse = q?.spouse;
    const childrenCount = q?.children?.length || 0;

    const fullName = [prof.last_name, prof.first_name, prof.middle_name].filter(Boolean).join(' ') || 'Не указано';
    const regAddressStr = [addr.region, addr.city, addr.street ? 'ул. ' + addr.street : '', addr.house ? 'д. ' + addr.house : '', addr.apartment ? 'кв. ' + addr.apartment : ''].filter(Boolean).join(', ');

    return {
      '№': index + 1,
      'ID Клиента': c.id,
      'Дата регистрации': c.created_at ? new Date(c.created_at).toLocaleDateString('ru-RU') : '',
      'Статус': c.status || 'active',
      'ФИО Клиента': fullName,
      'Дата рождения': prof.birth_date || '',
      'Место рождения': prof.birth_place || '',
      'Гражданство': prof.citizenship || '',
      'Телефон': cont.phone || '',
      'WhatsApp': cont.whatsapp || '',
      'Email': cont.email || '',
      'ИНН': tax.inn || '',
      'СНИЛС': tax.snils || '',
      'Паспорт серия/номер': pass.series && pass.number ? (pass.series + ' ' + pass.number) : '',
      'Паспорт кем выдан': pass.issuer || '',
      'Паспорт дата выдачи': pass.issue_date || '',
      'Код подразделения': pass.department_code || '',
      'Загранпаспорт': foreignPass.number ? (foreignPass.series ? foreignPass.series + ' ' : '') + foreignPass.number : 'Нет',
      'Адрес регистрации': regAddressStr || '',
      'Семейное положение': q?.marital_status === 'married' ? 'В браке' : (q?.marital_status === 'divorced' ? 'В разводе' : 'Холост / Не замужем'),
      'Супруг(а) ФИО': spouse ? [spouse.last_name, spouse.first_name, spouse.middle_name].filter(Boolean).join(' ') : 'Нет',
      'Детей (кол-во)': childrenCount,
      'Заявок': c.leads_count || 0
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },   // №
    { wch: 14 },  // ID
    { wch: 14 },  // Дата
    { wch: 12 },  // Статус
    { wch: 28 },  // ФИО
    { wch: 14 },  // Дата рожд
    { wch: 22 },  // Место рожд
    { wch: 22 },  // Гражданство
    { wch: 18 },  // Телефон
    { wch: 18 },  // WhatsApp
    { wch: 24 },  // Email
    { wch: 15 },  // ИНН
    { wch: 15 },  // СНИЛС
    { wch: 20 },  // Паспорт серия/номер
    { wch: 32 },  // Паспорт выдан
    { wch: 14 },  // Дата выдачи
    { wch: 14 },  // Код
    { wch: 18 },  // Загран
    { wch: 35 },  // Адрес
    { wch: 18 },  // Брак
    { wch: 26 },  // Супруг
    { wch: 12 },  // Дети
    { wch: 10 },  // Заявок
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Реестр клиентов');

  const today = new Date().toISOString().split('T')[0];
  const filename = `Реестр_клиентов_ГосПомощь_${today}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
