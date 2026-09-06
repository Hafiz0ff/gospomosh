import ExcelJS from "exceljs";
import { ClientData } from "./types";
import { getMaritalStatusLabel } from "./questionnaireTranslations";
import { formatDateRu } from "./validation";

const STATUS_LABELS: Record<string, { label: string; fg: string; bg: string }> = {
  new: { label: "Новая анкета", fg: "FF0369A1", bg: "FFE0F2FE" },
  in_progress: { label: "В обработке", fg: "FFB45309", bg: "FFFEF3C7" },
  need_docs: { label: "Ждем документы", fg: "FF7E22CE", bg: "FFF3E8FF" },
  submitted: { label: "Подано в ведомство", fg: "FF1D4ED8", bg: "FFDBEAFE" },
  completed: { label: "Готово / Оказано", fg: "FF047857", bg: "FFD1FAE5" },
  active: { label: "В базе CRM", fg: "FF0F766E", bg: "FFCCFBF1" },
  archived: { label: "Архив", fg: "FF64748B", bg: "FFF1F5F9" },
};

export async function exportClientsToExcel(clients: ClientData[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "CRM ГосПомощь";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Реестр клиентов", {
    views: [{ state: "frozen", ySplit: 4, activeCell: "A5" }],
    properties: { defaultRowHeight: 20 },
  });

  // 1. Column Definitions
  worksheet.columns = [
    { key: "num", width: 6 },          // A: №
    { key: "id", width: 14 },          // B: ID
    { key: "created_at", width: 15 },  // C: Дата регистрации
    { key: "status", width: 20 },      // D: Статус
    { key: "full_name", width: 32 },   // E: ФИО
    { key: "gender", width: 11 },      // F: Пол
    { key: "birth_date", width: 15 },  // G: Дата рождения
    { key: "birth_place", width: 26 }, // H: Место рождения
    { key: "citizenship", width: 24 }, // I: Гражданство
    { key: "phone", width: 18 },       // J: Телефон
    { key: "whatsapp", width: 18 },    // K: WhatsApp
    { key: "email", width: 26 },       // L: Email
    { key: "inn", width: 16 },         // M: ИНН
    { key: "snils", width: 16 },       // N: СНИЛС
    { key: "pass_num", width: 20 },    // O: Паспорт серия/номер
    { key: "pass_issuer", width: 34 }, // P: Паспорт кем выдан
    { key: "pass_date", width: 15 },   // Q: Паспорт дата выдачи
    { key: "pass_code", width: 14 },   // R: Код подразделения
    { key: "foreign_pass", width: 20 },// S: Загранпаспорт
    { key: "reg_addr", width: 38 },    // T: Адрес регистрации
    { key: "marital", width: 18 },     // U: Семейное положение
    { key: "spouse", width: 28 },      // V: Супруг(а) ФИО
    { key: "children", width: 14 },    // W: Детей
    { key: "leads", width: 12 },       // X: Заявок
  ];

  // 2. Title Banner: Row 1
  const titleRow = worksheet.getRow(1);
  titleRow.height = 36;
  worksheet.mergeCells("A1:X1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "🏛️ ГОСПОМОЩЬ — ЕДИНЫЙ РЕЕСТР КЛИЕНТОВ И АНКЕТ (2026)";
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF08525A" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // 3. Subtitle Banner: Row 2
  const subRow = worksheet.getRow(2);
  subRow.height = 22;
  worksheet.mergeCells("A2:X2");
  const subCell = worksheet.getCell("A2");
  const nowStr = new Date().toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  subCell.value = `Сформировано: ${nowStr} • Всего клиентов: ${clients.length} • Конфиденциально • В соответствии с 152-ФЗ РФ`;
  subCell.font = { name: "Arial", size: 9.5, italic: true, color: { argb: "FFE0F2FE" } };
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0E7C86" } };
  subCell.alignment = { vertical: "middle", horizontal: "center" };

  // 4. Spacer Row 3
  const spacerRow = worksheet.getRow(3);
  spacerRow.height = 6;
  worksheet.mergeCells("A3:X3");
  worksheet.getCell("A3").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };

  // 5. Table Headers: Row 4
  const headerRow = worksheet.getRow(4);
  headerRow.height = 30;

  const headers = [
    "№", "ID Клиента", "Дата регистрации", "Статус анкеты", "ФИО Клиента", "Пол",
    "Дата рождения", "Место рождения", "Гражданство", "Телефон", "WhatsApp", "Email",
    "ИНН", "СНИЛС", "Паспорт (серия/№)", "Паспорт кем выдан", "Дата выдачи", "Код подразделения",
    "Загранпаспорт", "Адрес регистрации", "Семейное положение", "Супруг(а) ФИО", "Детей (кол-во)", "Заявок в CRM"
  ];

  headers.forEach((h, idx) => {
    const colIndex = idx + 1;
    const cell = headerRow.getCell(colIndex);
    cell.value = h;
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0E7C86" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FF08525A" } },
      bottom: { style: "medium", color: { argb: "FF08525A" } },
      left: { style: "thin", color: { argb: "FF2AA9A9" } },
      right: { style: "thin", color: { argb: "FF2AA9A9" } },
    };
  });

  // Enable Auto-Filter on table header
  worksheet.autoFilter = "A4:X4";

  // 6. Data Rows
  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: "FFE2E8F0" } },
    bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
    left: { style: "thin", color: { argb: "FFE2E8F0" } },
    right: { style: "thin", color: { argb: "FFE2E8F0" } },
  };

  clients.forEach((c, index) => {
    const rowIndex = index + 5;
    const row = worksheet.getRow(rowIndex);
    row.height = 24;

    const q = c.questionnaire;
    const prof = q?.profile || ({} as any);
    const tax = q?.tax || ({} as any);
    const pass = q?.internal_passport || ({} as any);
    const foreignPass = q?.foreign_passport || ({} as any);
    const cont = q?.contacts || ({} as any);
    const addr = q?.registration_address || ({} as any);
    const spouse = q?.spouse;
    const childrenCount = q?.children?.length || 0;

    const fullName = [prof.last_name, prof.first_name, prof.middle_name].filter(Boolean).join(" ") || "Не указано";
    const regAddressStr = [addr.region, addr.city, addr.street ? "ул. " + addr.street : "", addr.house ? "д. " + addr.house : "", addr.apartment ? "кв. " + addr.apartment : ""].filter(Boolean).join(", ");
    const maritalStr = getMaritalStatusLabel(q?.marital_status, prof?.gender, "ru");
    const statusMeta = STATUS_LABELS[c.status] || { label: c.status || "В базе CRM", fg: "FF0F766E", bg: "FFCCFBF1" };

    const isEven = index % 2 === 1;
    const defaultBg = isEven ? "FFF8FBFC" : "FFFFFFFF";

    const rowData = [
      index + 1,                                                                               // A: №
      c.id,                                                                                    // B: ID
      c.created_at ? new Date(c.created_at).toLocaleDateString("ru-RU") : "—",                // C: Дата
      statusMeta.label,                                                                        // D: Статус
      fullName,                                                                                // E: ФИО
      prof.gender === "male" ? "Мужской" : prof.gender === "female" ? "Женский" : "—",        // F: Пол
      prof.birth_date ? formatDateRu(prof.birth_date) : "—",                                  // G: Дата рожд
      prof.birth_place || "—",                                                                 // H: Место рожд
      prof.citizenship || "—",                                                                 // I: Гражданство
      cont.phone || "—",                                                                       // J: Телефон
      cont.whatsapp || cont.phone || "—",                                                      // K: WhatsApp
      cont.email || "—",                                                                       // L: Email
      tax.inn || "Не указан",                                                                  // M: ИНН
      tax.snils || "Не указан",                                                                // N: СНИЛС
      pass.series && pass.number ? `${pass.series} ${pass.number}` : "—",                      // O: Паспорт
      pass.issuer || "—",                                                                      // P: Кем выдан
      pass.issue_date ? formatDateRu(pass.issue_date) : "—",                                   // Q: Дата выдачи
      pass.department_code || "—",                                                             // R: Код
      foreignPass.number ? `${foreignPass.series ? foreignPass.series + " " : ""}${foreignPass.number}` : "Нет", // S: Загран
      regAddressStr || "—",                                                                    // T: Адрес
      maritalStr,                                                                              // U: Брак
      spouse ? [spouse.last_name, spouse.first_name, spouse.middle_name].filter(Boolean).join(" ") : "Нет", // V: Супруг
      childrenCount,                                                                           // W: Детей
      c.leads_count || 0,                                                                      // X: Заявок
    ];

    rowData.forEach((val, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      cell.value = val;
      cell.border = thinBorder;
      cell.font = { name: "Arial", size: 9.5, color: { argb: "FF1E293B" } };

      // Alternating row background
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: defaultBg } };

      // Alignments
      if ([1, 2, 3, 6, 7, 10, 11, 13, 14, 15, 17, 18, 19, 21, 23, 24].includes(colIdx + 1)) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      } else {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      }

      // Column specific emphasis
      if (colIdx + 1 === 1) { // №
        cell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FF64748B" } };
      } else if (colIdx + 1 === 4) { // Status badge
        cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: statusMeta.fg } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: statusMeta.bg } };
      } else if (colIdx + 1 === 5) { // Full Name
        cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF08525A" } };
      } else if (colIdx + 1 === 24) { // Leads
        cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF0E7C86" } };
      }
    });
  });

  // 7. Summary Footer Row
  const lastDataRow = clients.length + 4;
  const footerRowIndex = lastDataRow + 1;
  const footerRow = worksheet.getRow(footerRowIndex);
  footerRow.height = 28;

  worksheet.mergeCells(`A${footerRowIndex}:D${footerRowIndex}`);
  const footerLabel = worksheet.getCell(`A${footerRowIndex}`);
  footerLabel.value = "ИТОГО В РЕЕСТРЕ:";
  footerLabel.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF08525A" } };
  footerLabel.alignment = { vertical: "middle", horizontal: "right" };

  const footerCount = worksheet.getCell(`E${footerRowIndex}`);
  footerCount.value = `${clients.length} чел.`;
  footerCount.font = { name: "Arial", size: 11, bold: true, color: { argb: "FF0E7C86" } };
  footerCount.alignment = { vertical: "middle", horizontal: "left" };

  for (let c = 1; c <= 24; c++) {
    const cell = footerRow.getCell(c);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEDF7F8" } };
    cell.border = {
      top: { style: "double", color: { argb: "FF0E7C86" } },
      bottom: { style: "medium", color: { argb: "FF0E7C86" } },
    };
  }

  // 8. Generate Buffer & Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const today = new Date().toISOString().split("T")[0];
  const filename = `Реестр_клиентов_ГосПомощь_${today}.xlsx`;

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
