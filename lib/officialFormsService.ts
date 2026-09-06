import { ClientData } from "@/lib/types";

export interface OfficialFormMeta {
  id: "passport-1p" | "tax-inn" | "migration-notice" | "rvp-vnzh";
  name: string;
  department: string;
  code: string;
  regulation: string;
  description: string;
}

export const OFFICIAL_FORMS: OfficialFormMeta[] = [
  {
    id: "passport-1p",
    name: "Форма 1П: Заявление о выдаче (замене) паспорта гражданина РФ",
    department: "МВД России",
    code: "Форма 1П (ред. 2026)",
    regulation: "Приказ МВД России от 16.11.2020 № 773 (в ред. 2026 г.)",
    description: "Официальный машиночитаемый бланк заявления на получение или обмен паспорта РФ со знакоместами и зоной фото 35×45 мм."
  },
  {
    id: "tax-inn",
    name: "Форма № 2-2-Учет: Заявление о постановке на учет в налоговом органе (ИНН)",
    department: "ФНС России",
    code: "КНД 1114305",
    regulation: "Приказ ФНС России от 08.05.2020 № ЕД-7-14/323@ (в ред. 2026 г.)",
    description: "Машиночитаемый бланк ФНС России для присвоения ИНН физическому лицу со штрих-кодированием и кодом инспекции."
  },
  {
    id: "migration-notice",
    name: "Уведомление о прибытии иностранного гражданина в место пребывания",
    department: "МВД России (УВМ)",
    code: "Бланк миграционного учета",
    regulation: "Приказ МВД России от 10.12.2020 № 856 (в ред. 2026 г.)",
    description: "Двусторонний бланк постановки на миграционный учет с основной частью и отрывным талоном регистрации."
  },
  {
    id: "rvp-vnzh",
    name: "Заявление о выдаче вида на жительство (ВНЖ) иностранному гражданину",
    department: "МВД России",
    code: "Заявление ВНЖ",
    regulation: "Приказ МВД России от 11.06.2020 № 417 (в ред. 2026 г.)",
    description: "Регламентированное ведомственное заявление со сводной таблицей родственников и трудового стажа."
  }
];

export function getAvailableOfficialForms(): OfficialFormMeta[] {
  return OFFICIAL_FORMS;
}

// Helpers for Character Boxes & Layout
function cleanStr(s?: string | null): string {
  return (s || "").trim().toUpperCase();
}

function renderCharBoxes(text: string, count: number): string {
  const chars = cleanStr(text).padEnd(count, " ").slice(0, count).split("");
  return (
    '<div class="char-row">' +
    chars.map((c) => `<span class="char-box">${c === " " ? "&nbsp;" : c}</span>`).join("") +
    "</div>"
  );
}

function formatDateToBoxes(dateStr?: string): string {
  if (!dateStr) return renderCharBoxes("", 10);
  let d = dateStr;
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      d = `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
  }
  return renderCharBoxes(d, 10);
}

function renderFloatingBar(currentFormId: string, client: ClientData): string {
  const options = OFFICIAL_FORMS.map(
    (f) => `<option value="${f.id}" ${f.id === currentFormId ? "selected" : ""}>${f.code}: ${f.name}</option>`
  ).join("");

  return `
  <aside aria-label="Панель управления печатью" class="floating-control print:hidden">
    <div class="floating-inner">
      <div class="floating-title">
        <span class="badge-official">РОССИЙСКАЯ ФЕДЕРАЦИЯ</span>
        <strong>Официальный бланк ведомства (2026)</strong>
        <span class="client-name">Клиент: ${client.questionnaire.profile.last_name} ${client.questionnaire.profile.first_name}</span>
      </div>
      <div class="floating-actions">
        <select onchange="window.location.href='/api/client/${client.id}/forms/' + this.value" class="form-select">
          ${options}
        </select>
        <button onclick="window.print()" class="btn-print">🖨️ Распечатать бланк (PDF)</button>
        <a href="/admin" class="btn-back">← В CRM</a>
      </div>
    </div>
  </aside>
  `;
}

const COMMON_FORM_STYLES = `
  @page {
    size: A4 portrait;
    margin: 8mm 10mm 8mm 10mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: Arial, "Helvetica Neue", sans-serif;
    color: #000;
    background: #525659;
    margin: 0;
    padding: 20px 0;
    font-size: 11px;
    line-height: 1.25;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-container {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto 15px auto;
    background: #fff;
    padding: 10mm 12mm;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    position: relative;
    page-break-after: always;
  }
  .page-container:last-child {
    page-break-after: auto;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .page-container { width: 100%; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
    .print\\:hidden { display: none !important; }
  }
  .char-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 22px;
    border: 1px solid #111;
    font-family: "Courier New", Courier, monospace;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    background-color: #fff;
    margin-right: -1px;
    color: #000;
  }
  .char-row {
    display: inline-flex;
    margin-bottom: 2px;
  }
  .marker-tl { position: absolute; top: 5mm; left: 5mm; width: 10px; height: 10px; border-top: 3px solid #000; border-left: 3px solid #000; }
  .marker-tr { position: absolute; top: 5mm; right: 5mm; width: 10px; height: 10px; border-top: 3px solid #000; border-right: 3px solid #000; }
  .marker-bl { position: absolute; bottom: 5mm; left: 5mm; width: 10px; height: 10px; border-bottom: 3px solid #000; border-left: 3px solid #000; }
  .marker-br { position: absolute; bottom: 5mm; right: 5mm; width: 10px; height: 10px; border-bottom: 3px solid #000; border-right: 3px solid #000; }
  .floating-control {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #0E7C86;
    color: #fff;
    padding: 10px 18px;
    border-radius: 14px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.35);
    z-index: 9999;
    width: 92%;
    max-width: 950px;
  }
  .floating-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
  .floating-title { display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .badge-official { background: #FF8C42; color: #fff; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; }
  .client-name { opacity: 0.9; font-size: 11px; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 6px; }
  .floating-actions { display: flex; align-items: center; gap: 8px; }
  .form-select { background: #fff; color: #08525a; font-weight: bold; font-size: 12px; padding: 6px 10px; border-radius: 8px; border: none; outline: none; }
  .btn-print { background: #FF8C42; color: #fff; font-weight: bold; font-size: 12px; padding: 6px 14px; border-radius: 8px; border: none; cursor: pointer; }
  .btn-print:hover { background: #e66e26; }
  .btn-back { background: rgba(255,255,255,0.2); color: #fff; text-decoration: none; font-weight: bold; font-size: 12px; padding: 6px 12px; border-radius: 8px; }
  .btn-back:hover { background: rgba(255,255,255,0.3); }
`;

// =========================================================================
// 1. ФОРМА 1П: ПАСПОРТ ГРАЖДАНИНА РФ (МВД РОССИИ, ПРИКАЗ № 773, РЕД. 2026)
// =========================================================================
export function generatePassport1PFormHtml(client: ClientData): string {
  const q = client.questionnaire;
  const p = q.profile;
  const pass = q.internal_passport;
  const addr = q.registration_address;
  const sp = q.spouse;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Форма 1П (Паспорт РФ) — ${p.last_name} ${p.first_name}</title>
  <style>
    ${COMMON_FORM_STYLES}
    .f1p-header { display: flex; justify-content: space-between; font-size: 9px; line-height: 1.2; margin-bottom: 8px; }
    .f1p-title { text-align: center; font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 4px 0 8px 0; letter-spacing: 0.5px; }
    .f1p-box { border: 1px solid #000; padding: 6px; margin-bottom: 6px; }
    .f1p-row { display: flex; margin-bottom: 4px; align-items: center; }
    .f1p-label { font-size: 10px; font-weight: bold; min-width: 140px; }
    .photo-placeholder {
      width: 35mm;
      height: 45mm;
      border: 1px dashed #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 9px;
      color: #555;
      padding: 4px;
      float: right;
      margin-left: 10px;
      margin-bottom: 6px;
      background: #fafafa;
    }
  </style>
</head>
<body>
  ${renderFloatingBar("passport-1p", client)}

  <div class="page-container">
    <div class="marker-tl"></div><div class="marker-tr"></div>
    <div class="marker-bl"></div><div class="marker-br"></div>

    <div class="f1p-header">
      <div>
        <strong>МВД РОССИИ</strong><br>
        Код подразделения: ${pass.department_code || "___ - ___"}
      </div>
      <div style="text-align: right;">
        Форма № 1П<br>
        Приложение № 1 к Административному регламенту МВД РФ<br>
        (утв. приказом МВД России от 16.11.2020 № 773, в ред. 2026 г.)
      </div>
    </div>

    <div class="photo-placeholder">
      <strong>ФОТО</strong><br>
      35 × 45 мм<br>
      <span style="font-size: 7.5px; margin-top: 4px;">Место для наклеивания фотографии заявителя</span>
    </div>

    <div class="f1p-title">
      ЗАЯВЛЕНИЕ О ВЫДАЧЕ (ЗАМЕНЕ) ПАСПОРТА ГРАЖДАНИНА РФ
    </div>

    <div style="font-size: 9px; margin-bottom: 6px; color: #333;">
      Заполняется заявителем на русском языке печатными буквами или на электронных устройствах.
    </div>

    <div class="f1p-box">
      <div class="f1p-row">
        <span class="f1p-label">1. Фамилия:</span>
        <div>${renderCharBoxes(p.last_name, 25)}</div>
      </div>
      <div class="f1p-row">
        <span class="f1p-label">&nbsp;&nbsp;&nbsp;&nbsp;Имя:</span>
        <div>${renderCharBoxes(p.first_name, 25)}</div>
      </div>
      <div class="f1p-row">
        <span class="f1p-label">&nbsp;&nbsp;&nbsp;&nbsp;Отчество:</span>
        <div>${renderCharBoxes(p.middle_name || "", 25)}</div>
      </div>

      <div class="f1p-row" style="margin-top: 6px;">
        <span class="f1p-label">2. Пол:</span>
        <span style="font-weight: bold; margin-right: 15px;">[ ${p.gender === "male" ? "X" : " "} ] Мужской</span>
        <span style="font-weight: bold; margin-right: 25px;">[ ${p.gender === "female" ? "X" : " "} ] Женский</span>
        <span class="f1p-label" style="min-width: auto; margin-right: 6px;">Дата рождения:</span>
        <div>${formatDateToBoxes(p.birth_date)}</div>
      </div>

      <div class="f1p-row" style="margin-top: 4px;">
        <span class="f1p-label">3. Место рождения:</span>
        <div style="font-weight: bold; border-bottom: 1px solid #000; flex: 1; padding: 2px 4px;">
          ${p.birth_place || "НЕ УКАЗАНО"}
        </div>
      </div>
    </div>

    <div class="f1p-box">
      <div class="f1p-row">
        <span class="f1p-label">4. Семейное положение:</span>
        <div style="flex: 1; font-weight: bold;">
          ${q.marital_status === "married" ? (p.gender === "female" ? "ЗАМУЖЕМ" : "ЖЕНАТ") : q.marital_status === "divorced" ? (p.gender === "female" ? "РАЗВЕДЕНА" : "РАЗВЕДЕН") : q.marital_status === "widowed" ? (p.gender === "female" ? "ВДОВА" : "ВДОВЕЦ") : (p.gender === "female" ? "НЕ ЗАМУЖЕМ" : "ХОЛОСТ")}
          ${sp ? `(Супруг(а): ${sp.last_name} ${sp.first_name} ${sp.middle_name || ""}, дата брака: ${sp.marriage_date || "—"})` : ""}
        </div>
      </div>
      <div class="f1p-row" style="margin-top: 4px;">
        <span class="f1p-label">5. ФИО отца:</span>
        <div style="flex: 1; border-bottom: 1px solid #000; font-weight: bold; padding: 1px 4px;">
          ${p.last_name} ${p.middle_name ? p.middle_name.replace(/(ич|ович|евич|овна|евна|ична)$/, "ович") : "—"}
        </div>
      </div>
      <div class="f1p-row" style="margin-top: 4px;">
        <span class="f1p-label">&nbsp;&nbsp;&nbsp;&nbsp;ФИО матери:</span>
        <div style="flex: 1; border-bottom: 1px solid #000; font-weight: bold; padding: 1px 4px;">
          ${p.last_name} —
        </div>
      </div>
    </div>

    <div class="f1p-box">
      <div class="f1p-row">
        <span class="f1p-label">6. Место жительства:</span>
        <div style="flex: 1; font-weight: bold; line-height: 1.4;">
          Индекс: ${addr.postal_code || "101000"}, ${addr.country}, ${addr.region ? addr.region + ", " : ""}г. ${addr.city}, ул. ${addr.street}, д. ${addr.house}${addr.apartment ? ", кв. " + addr.apartment : ""}
        </div>
      </div>
      <div class="f1p-row" style="margin-top: 4px;">
        <span class="f1p-label">7. Гражданство:</span>
        <div style="flex: 1; font-weight: bold;">
          ${p.citizenship} ${p.previous_citizenship ? `(ранее: ${p.previous_citizenship})` : ""}
        </div>
      </div>
      <div class="f1p-row" style="margin-top: 4px;">
        <span class="f1p-label">8. Телефон / Email:</span>
        <div style="flex: 1; font-weight: bold;">
          ${q.contacts.phone} / ${q.contacts.email || "—"}
        </div>
      </div>
    </div>

    <div class="f1p-box">
      <div class="f1p-row">
        <span class="f1p-label">9. Прошу выдать (заменить):</span>
        <div style="flex: 1; font-weight: bold;">
          В СВЯЗИ С ДОСТИЖЕНИЕМ ВОЗРАСТА / ПРИОБРЕТЕНИЕМ ГРАЖДАНСТВА РФ
        </div>
      </div>
      <div class="f1p-row" style="margin-top: 4px;">
        <span class="f1p-label">10. Предъявленный документ:</span>
        <div style="flex: 1; font-weight: bold;">
          Паспорт РФ: серия ${pass.series || "____"} № ${pass.number || "______"}, выдан ${pass.issue_date || "__.__.____"} г. ${pass.issuer || "УВМ МВД России"}
        </div>
      </div>
    </div>

    <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px;">
      <div>
        Дата заполнения: <strong>${new Date().toLocaleDateString("ru-RU")} г.</strong>
      </div>
      <div style="text-align: center;">
        <div style="width: 220px; border-bottom: 1px solid #000; margin-bottom: 2px;">&nbsp;</div>
        <span style="font-size: 8px; color: #555;">(Личная подпись заявителя)</span>
      </div>
    </div>

    <div style="margin-top: 14px; border-top: 2px solid #000; padding-top: 6px; font-size: 9px;">
      <strong>ОТМЕТКА СОТРУДНИКА МИГРАЦИОННОГО ПУНКТА МВД РОССИИ:</strong><br>
      Заявление и представленные документы проверены. Личность заявителя установлена.<br>
      Сотрудник: __________________________ / ________________________ / Дата: ____.____.2026 г.
    </div>
  </div>
</body>
</html>`;
}

// =========================================================================
// 2. ФОРМА № 2-2-УЧЕТ: ПОСТАНОВКА НА УЧЕТ В НАЛОГОВОЙ (ИНН, КНД 1114305, 2026)
// =========================================================================
export function generateTaxInnFormHtml(client: ClientData): string {
  const q = client.questionnaire;
  const p = q.profile;
  const pass = q.internal_passport;
  const addr = q.registration_address;
  const tax = q.tax;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Форма 2-2-Учет (ИНН КНД 1114305) — ${p.last_name} ${p.first_name}</title>
  <style>
    ${COMMON_FORM_STYLES}
    .knd-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .knd-barcode { font-family: monospace; font-size: 18px; font-weight: bold; border: 1px solid #000; padding: 2px 8px; }
    .knd-title { text-align: center; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 8px 0; }
    .knd-field { margin-bottom: 5px; }
    .knd-label { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #222; margin-bottom: 1px; }
    .two-col-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .two-col-table td { border: 1px solid #000; padding: 6px; vertical-align: top; font-size: 9px; }
  </style>
</head>
<body>
  ${renderFloatingBar("tax-inn", client)}

  <!-- СТРАНИЦА 1 -->
  <div class="page-container">
    <div class="marker-tl"></div><div class="marker-tr"></div>
    <div class="marker-bl"></div><div class="marker-br"></div>

    <div class="knd-header">
      <div>
        <div class="knd-barcode">||| | |||| ||| ||||| 0960 9015</div>
        <div style="font-size: 8px; margin-top: 2px;">КНД 1114305 • Стр. 001</div>
      </div>
      <div style="text-align: right; font-size: 8px;">
        Форма № 2-2-Учет<br>
        Приказ ФНС России от 08.05.2020 № ЕД-7-14/323@<br>
        (с изменениями ФНС на 2026 год)
      </div>
    </div>

    <div style="margin-bottom: 6px;">
      <div class="knd-label">ИНН (при наличии):</div>
      <div>${renderCharBoxes(tax.inn || "", 12)}</div>
    </div>

    <div class="knd-title">
      ЗАЯВЛЕНИЕ ФИЗИЧЕСКОГО ЛИЦА О ПОСТАНОВКЕ НА УЧЕТ В НАЛОГОВОМ ОРГАНЕ
    </div>

    <div class="knd-field">
      <div class="knd-label">Код налогового органа:</div>
      <div>${renderCharBoxes("7701", 4)}</div>
    </div>

    <div class="knd-field">
      <div class="knd-label">Фамилия:</div>
      <div>${renderCharBoxes(p.last_name, 30)}</div>
    </div>

    <div class="knd-field">
      <div class="knd-label">Имя:</div>
      <div>${renderCharBoxes(p.first_name, 30)}</div>
    </div>

    <div class="knd-field">
      <div class="knd-label">Отчество (при наличии):</div>
      <div>${renderCharBoxes(p.middle_name || "", 30)}</div>
    </div>

    <div style="display: flex; gap: 20px; margin-bottom: 6px;">
      <div>
        <div class="knd-label">Пол: 1 - муж., 2 - жен.</div>
        <div>${renderCharBoxes(p.gender === "male" ? "1" : "2", 1)}</div>
      </div>
      <div>
        <div class="knd-label">Дата рождения:</div>
        <div>${formatDateToBoxes(p.birth_date)}</div>
      </div>
    </div>

    <div class="knd-field">
      <div class="knd-label">Место рождения:</div>
      <div>${renderCharBoxes(p.birth_place || "", 35)}</div>
    </div>

    <div class="knd-field">
      <div class="knd-label">Гражданство (код страны): 643 - РФ, 762 - Таджикистан, 860 - Узбекистан</div>
      <div>${renderCharBoxes(p.citizenship.includes("Таджик") ? "762" : p.citizenship.includes("Узбек") ? "860" : "643", 3)}</div>
    </div>

    <div style="border: 1px solid #000; padding: 6px; margin: 8px 0;">
      <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px;">Сведения о документе, удостоверяющем личность:</div>
      <div style="display: flex; gap: 15px;">
        <div>
          <div class="knd-label">Вид документа (21 - паспорт РФ):</div>
          <div>${renderCharBoxes("21", 2)}</div>
        </div>
        <div>
          <div class="knd-label">Серия и номер:</div>
          <div>${renderCharBoxes(`${pass.series || ""} ${pass.number || ""}`, 15)}</div>
        </div>
        <div>
          <div class="knd-label">Дата выдачи:</div>
          <div>${formatDateToBoxes(pass.issue_date)}</div>
        </div>
      </div>
      <div class="knd-field" style="margin-top: 4px;">
        <div class="knd-label">Кем выдан:</div>
        <div style="font-size: 10px; font-weight: bold; border-bottom: 1px solid #000;">${pass.issuer || "УВМ МВД РОССИИ"}</div>
      </div>
    </div>

    <table class="two-col-table">
      <tr>
        <td style="width: 50%;">
          <strong>Достоверность и полноту сведений подтверждаю:</strong><br><br>
          [ <strong>1</strong> ] 1 - физическое лицо<br><br>
          Фамилия: <strong>${p.last_name}</strong><br>
          Имя: <strong>${p.first_name}</strong><br>
          Отчество: <strong>${p.middle_name || "—"}</strong><br><br>
          Телефон: <strong>${q.contacts.phone}</strong><br><br>
          Подпись: __________________ Дата: <strong>${new Date().toLocaleDateString("ru-RU")}</strong>
        </td>
        <td style="width: 50%; background: #fdfdfd;">
          <strong>Заполняется работником налогового органа:</strong><br><br>
          Сведения о постановке на учет:<br>
          Присвоенный ИНН: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]<br><br>
          Дата постановки на учет: ____.____.2026 г.<br><br>
          Сотрудник: _______________________<br>
          Подпись: ________________________
        </td>
      </tr>
    </table>
  </div>

  <!-- СТРАНИЦА 2: АДРЕС В РФ -->
  <div class="page-container">
    <div class="marker-tl"></div><div class="marker-tr"></div>
    <div class="marker-bl"></div><div class="marker-br"></div>

    <div class="knd-header">
      <div>
        <div class="knd-barcode">||| | |||| ||| ||||| 0960 9022</div>
        <div style="font-size: 8px; margin-top: 2px;">КНД 1114305 • Стр. 002</div>
      </div>
      <div style="text-align: right; font-size: 8px;">
        Фамилия: ${p.last_name} И.О.: ${p.first_name[0]}.${p.middle_name ? p.middle_name[0] + "." : ""}
      </div>
    </div>

    <div class="knd-title">
      СВЕДЕНИЯ О МЕСТЕ ЖИТЕЛЬСТВА (ПРЕБЫВАНИЯ) В РОССИЙСКОЙ ФЕДЕРАЦИИ
    </div>

    <div class="knd-field">
      <div class="knd-label">Почтовый индекс:</div>
      <div>${renderCharBoxes(addr.postal_code || "101000", 6)}</div>
    </div>

    <div class="knd-field">
      <div class="knd-label">Субъект РФ / Город:</div>
      <div>${renderCharBoxes(addr.city || "МОСКВА", 30)}</div>
    </div>

    <div class="knd-field">
      <div class="knd-label">Улица (проспект, переулок):</div>
      <div>${renderCharBoxes(addr.street || "", 30)}</div>
    </div>

    <div style="display: flex; gap: 15px; margin-bottom: 8px;">
      <div>
        <div class="knd-label">Номер дома:</div>
        <div>${renderCharBoxes(addr.house || "", 8)}</div>
      </div>
      <div>
        <div class="knd-label">Квартира:</div>
        <div>${renderCharBoxes(addr.apartment || "", 8)}</div>
      </div>
    </div>

    <div style="border: 1px solid #000; padding: 10px; margin-top: 30px; font-size: 9px; line-height: 1.5;">
      <strong>СНИЛС заявителя:</strong> ${tax.snils || "Не указан"}<br>
      Настоящим подтверждаю, что указанный адрес является адресом официальной регистрации / фактического проживания на территории РФ.<br>
      Подпись заявителя: ___________________ Дата: ${new Date().toLocaleDateString("ru-RU")}
    </div>
  </div>
</body>
</html>`;
}

// =========================================================================
// 3. УВЕДОМЛЕНИЕ О ПРИБЫТИИ ИНОСТРАННОГО ГРАЖДАНИНА (МИГРАЦИОННЫЙ УЧЕТ 2026)
// =========================================================================
export function generateMigrationNoticeFormHtml(client: ClientData): string {
  const q = client.questionnaire;
  const p = q.profile;
  const addr = q.registration_address;
  const fp = q.foreign_passport || q.internal_passport;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Миграционный учет (Приказ МВД № 856) — ${p.last_name} ${p.first_name}</title>
  <style>
    ${COMMON_FORM_STYLES}
    .mu-header { text-align: center; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
    .mu-reg { font-size: 8px; text-align: right; margin-bottom: 4px; }
    .mu-section { border: 1px solid #000; padding: 6px; margin-bottom: 6px; }
    .mu-sec-title { font-size: 9.5px; font-weight: bold; text-transform: uppercase; background: #eee; padding: 2px 4px; margin-bottom: 4px; }
    .cut-line {
      border-top: 2px dashed #000;
      margin: 15px 0;
      text-align: center;
      position: relative;
    }
    .cut-line span {
      background: #fff;
      padding: 0 10px;
      position: relative;
      top: -9px;
      font-weight: bold;
      font-size: 9px;
      letter-spacing: 1px;
    }
    .stamp-box {
      width: 45mm;
      height: 30mm;
      border: 1px solid #999;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 8px;
      color: #666;
    }
  </style>
</head>
<body>
  ${renderFloatingBar("migration-notice", client)}

  <div class="page-container">
    <div class="marker-tl"></div><div class="marker-tr"></div>
    <div class="marker-bl"></div><div class="marker-br"></div>

    <div class="mu-reg">
      Приложение к приказу МВД России от 10.12.2020 № 856<br>
      (в редакции МВД РФ на 2026 год)
    </div>

    <div class="mu-header">
      УВЕДОМЛЕНИЕ О ПРИБЫТИИ ИНОСТРАННОГО ГРАЖДАНИНА<br>ИЛИ ЛИЦА БЕЗ ГРАЖДАНСТВА В МЕСТО ПРЕБЫВАНИЯ
    </div>

    <!-- 1. СВЕДЕНИЯ ОБ ИНОСТРАННОМ ГРАЖДАНИНЕ -->
    <div class="mu-section">
      <div class="mu-sec-title">1. Сведения о лице, подлежащем постановке на учет по месту пребывания</div>
      <div style="margin-bottom: 4px;">
        <span style="font-size: 9px; font-weight: bold;">Фамилия:</span>
        ${renderCharBoxes(p.last_name, 25)}
      </div>
      <div style="margin-bottom: 4px;">
        <span style="font-size: 9px; font-weight: bold;">Имя:</span>
        ${renderCharBoxes(p.first_name, 25)}
      </div>
      <div style="margin-bottom: 4px;">
        <span style="font-size: 9px; font-weight: bold;">Гражданство:</span>
        ${renderCharBoxes(p.citizenship, 25)}
      </div>
      <div style="display: flex; gap: 15px; margin-bottom: 4px;">
        <div>
          <span style="font-size: 9px; font-weight: bold;">Дата рождения:</span>
          ${formatDateToBoxes(p.birth_date)}
        </div>
        <div>
          <span style="font-size: 9px; font-weight: bold;">Пол:</span>
          ${renderCharBoxes(p.gender === "male" ? "МУЖ" : "ЖЕН", 3)}
        </div>
      </div>
      <div style="margin-bottom: 4px;">
        <span style="font-size: 9px; font-weight: bold;">Документ, удостоверяющий личность:</span>
        ${renderCharBoxes(`${fp.series || ""} ${fp.number || ""}`, 20)}
      </div>
      <div style="display: flex; gap: 10px;">
        <div style="font-size: 9px;">Цель въезда: <strong>РАБОТА / ЧАСТНАЯ</strong></div>
        <div style="font-size: 9px;">Срок пребывания до: <strong>__.__.2027 г.</strong></div>
      </div>
    </div>

    <!-- 2. СВЕДЕНИЯ О МЕСТЕ ПРЕБЫВАНИЯ -->
    <div class="mu-section">
      <div class="mu-sec-title">2. Адрес места пребывания</div>
      <div style="font-size: 9.5px; font-weight: bold; line-height: 1.4;">
        г. ${addr.city}, ул. ${addr.street}, дом ${addr.house}${addr.apartment ? ", кв. " + addr.apartment : ""}
      </div>
    </div>

    <!-- ЛИНИЯ ОТРЕЗА -->
    <div class="cut-line">
      <span>- - - - - - - - - - - - - - - - ЛИНИЯ ОТРЕЗА - - - - - - - - - - - - - - - -</span>
    </div>

    <!-- ОТРЫВНАЯ ЧАСТЬ БЛАНКА (ТАЛОН МИГРАЦИОННОГО УЧЕТА) -->
    <div style="border: 2px solid #000; padding: 8px; background: #fff;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <strong style="font-size: 11px; text-transform: uppercase;">ОТРЫВНАЯ ЧАСТЬ БЛАНКА УВЕДОМЛЕНИЯ</strong><br>
          <span style="font-size: 8px;">О ПРИБЫТИИ ИНОСТРАННОГО ГРАЖДАНИНА В МЕСТО ПРЕБЫВАНИЯ</span>
        </div>
        <div class="stamp-box">
          Отметка органа миграционного учета / МФЦ о подтверждении приема
        </div>
      </div>

      <div style="margin-top: 8px; font-size: 9.5px; line-height: 1.5;">
        Иностранный гражданин: <strong>${p.last_name} ${p.first_name} ${p.middle_name || ""}</strong><br>
        Гражданство: <strong>${p.citizenship}</strong> • Дата рождения: <strong>${p.birth_date || "—"}</strong><br>
        Паспорт: <strong>${fp.series || ""} № ${fp.number || ""}</strong><br>
        Адрес пребывания: <strong>г. ${addr.city}, ул. ${addr.street}, д. ${addr.house}${addr.apartment ? ", кв. " + addr.apartment : ""}</strong><br>
        Заявленный срок пребывания: <strong>до 31.12.2026 г.</strong>
      </div>

      <div style="margin-top: 10px; display: flex; justify-content: space-between; font-size: 9px;">
        <div>Подпись принимающей стороны: ____________________</div>
        <div>Дата: <strong>${new Date().toLocaleDateString("ru-RU")}</strong></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// =========================================================================
// 4. ЗАЯВЛЕНИЕ НА ВИД НА ЖИТЕЛЬСТВО (ВНЖ / РВП, ПРИКАЗ МВД № 417, 2026)
// =========================================================================
export function generateRvpVnzhFormHtml(client: ClientData): string {
  const q = client.questionnaire;
  const p = q.profile;
  const addr = q.registration_address;
  const fp = q.foreign_passport || q.internal_passport;
  const sp = q.spouse;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Заявление на ВНЖ (Приказ МВД № 417) — ${p.last_name} ${p.first_name}</title>
  <style>
    ${COMMON_FORM_STYLES}
    .vnzh-header { text-align: right; font-size: 8px; margin-bottom: 10px; }
    .vnzh-title { text-align: center; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 8px 0; }
    .vnzh-box { border: 1px solid #000; padding: 6px; margin-bottom: 8px; font-size: 9.5px; }
    .vnzh-row { margin-bottom: 5px; }
    .vnzh-num { font-weight: bold; margin-right: 4px; }
    .table-custom { width: 100%; border-collapse: collapse; margin-top: 6px; }
    .table-custom th, .table-custom td { border: 1px solid #000; padding: 4px; text-align: left; font-size: 8.5px; }
    .table-custom th { background: #eee; font-weight: bold; }
    .photo-area {
      width: 35mm;
      height: 45mm;
      border: 1px solid #000;
      float: right;
      margin-left: 12px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 8.5px;
      background: #fafafa;
    }
  </style>
</head>
<body>
  ${renderFloatingBar("rvp-vnzh", client)}

  <div class="page-container">
    <div class="marker-tl"></div><div class="marker-tr"></div>
    <div class="marker-bl"></div><div class="marker-br"></div>

    <div class="vnzh-header">
      Приложение № 1 к приказу МВД России от 11.06.2020 № 417<br>
      (в редакции Приказов МВД РФ на 2026 год)
    </div>

    <div class="photo-area">
      МЕСТО ДЛЯ<br>ФОТОГРАФИИ<br>35 × 45 мм
    </div>

    <div style="font-size: 10px; font-weight: bold;">
      В Главное управление по вопросам миграции МВД России<br>
      по г. Москве и Московской области
    </div>

    <div class="vnzh-title">
      ЗАЯВЛЕНИЕ О ВЫДАЧЕ ВИДА НА ЖИТЕЛЬСТВО
    </div>

    <div style="font-size: 9px; margin-bottom: 8px;">
      Мотивы обращения: <strong>ПОСТОЯННОЕ ПРОЖИВАНИЕ И ТРУДОВАЯ ДЕЯТЕЛЬНОСТЬ В РОССИЙСКОЙ ФЕДЕРАЦИИ</strong>
    </div>

    <div class="vnzh-box">
      <div class="vnzh-row">
        <span class="vnzh-num">1.</span> Фамилия, имя: <strong>${p.last_name} ${p.first_name} ${p.middle_name || ""}</strong><br>
        <span style="font-size: 8px; color: #555;">(буквами латинского алфавита): ${cleanStr(p.last_name)} ${cleanStr(p.first_name)}</span>
      </div>
      <div class="vnzh-row">
        <span class="vnzh-num">2.</span> Число, месяц, год и место рождения: <strong>${p.birth_date || "__.__.____"}, ${p.birth_place || "НЕ УКАЗАНО"}</strong>
      </div>
      <div class="vnzh-row">
        <span class="vnzh-num">3.</span> Гражданство (подданство): <strong>${p.citizenship}</strong>
      </div>
      <div class="vnzh-row">
        <span class="vnzh-num">4.</span> Пол: <strong>${p.gender === "male" ? "МУЖСКОЙ" : "ЖЕНСКИЙ"}</strong>
      </div>
      <div class="vnzh-row">
        <span class="vnzh-num">5.</span> Документ, удостоверяющий личность: <strong>Паспорт иностранного гражданина серии ${fp.series || "____"} № ${fp.number || "______"}, выдан ${fp.issue_date || "__.__.____"}</strong>
      </div>
      <div class="vnzh-row">
        <span class="vnzh-num">6.</span> ИНН (при наличии): <strong>${q.tax.inn || "Не присвоен"}</strong> • СНИЛС: <strong>${q.tax.snils || "Не оформлен"}</strong>
      </div>
      <div class="vnzh-row">
        <span class="vnzh-num">7.</span> Семейное положение: <strong>${q.marital_status === "married" ? (p.gender === "female" ? "ЗАМУЖЕМ" : "ЖЕНАТ") : q.marital_status === "divorced" ? (p.gender === "female" ? "РАЗВЕДЕНА" : "РАЗВЕДЕН") : q.marital_status === "widowed" ? (p.gender === "female" ? "ВДОВА" : "ВДОВЕЦ") : (p.gender === "female" ? "НЕ ЗАМУЖЕМ" : "ХОЛОСТ")}</strong>
      </div>
    </div>

    <div class="vnzh-box">
      <strong>8. Близкие родственники заявителя (супруг(а), дети, родители):</strong>
      <table class="table-custom">
        <thead>
          <tr>
            <th>Степень родства</th>
            <th>ФИО</th>
            <th>Дата и место рождения</th>
            <th>Гражданство</th>
            <th>Страна проживания и адрес</th>
          </tr>
        </thead>
        <tbody>
          ${sp ? `
          <tr>
            <td>Супруг(а)</td>
            <td>${sp.last_name} ${sp.first_name} ${sp.middle_name || ""}</td>
            <td>${sp.birth_date || "—"}</td>
            <td>${sp.citizenship || p.citizenship}</td>
            <td>РФ, г. ${addr.city}</td>
          </tr>` : ""}
          ${q.children.map((c) => `
          <tr>
            <td>Ребенок</td>
            <td>${c.last_name} ${c.first_name} ${c.middle_name || ""}</td>
            <td>${c.birth_date}</td>
            <td>${c.citizenship || p.citizenship}</td>
            <td>РФ, г. ${addr.city}</td>
          </tr>`).join("")}
          ${!sp && q.children.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Близкие родственники не указаны</td></tr>' : ""}
        </tbody>
      </table>
    </div>

    <div class="vnzh-box">
      <strong>9. Адрес предполагаемого постоянного проживания:</strong><br>
      Российская Федерация, ${addr.region ? addr.region + ", " : ""}г. ${addr.city}, ул. ${addr.street}, д. ${addr.house}${addr.apartment ? ", кв. " + addr.apartment : ""}<br>
      Телефон: <strong>${q.contacts.phone}</strong>
    </div>

    <div style="margin-top: 15px; font-size: 8.5px; line-height: 1.4;">
      Я предупрежден(а), что в соответствии со статьей 9 Федерального закона «О правовом положении иностранных граждан в РФ» вид на жительство не выдается в случае предоставления подложных документов или заведомо ложных сведений.<br><br>
      Подпись заявителя: ___________________ Дата подачи заявления: <strong>${new Date().toLocaleDateString("ru-RU")} г.</strong>
    </div>
  </div>
</body>
</html>`;
}

// Main dispatcher
export function generateFormHtml(formType: string, client: ClientData): string {
  switch (formType) {
    case "passport-1p":
      return generatePassport1PFormHtml(client);
    case "tax-inn":
      return generateTaxInnFormHtml(client);
    case "migration-notice":
      return generateMigrationNoticeFormHtml(client);
    case "rvp-vnzh":
      return generateRvpVnzhFormHtml(client);
    default:
      throw new Error(`Неизвестный тип официального бланка: ${formType}`);
  }
}
