import { NextRequest, NextResponse } from "next/server";
import { getClientById } from "@/lib/dataService";
import { getMaritalStatusLabel } from "@/lib/questionnaireTranslations";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const client = await getClientById(id);

  if (!client) {
    return new NextResponse("Клиент не найден", { status: 404 });
  }

  const q = client.questionnaire;

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Анкета клиента — ${q.profile.last_name} ${q.profile.first_name}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; line-height: 1.4; margin: 0; padding: 20px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0E7C86; padding-bottom: 12px; margin-bottom: 20px; }
    .logo { font-size: 20px; font-weight: 900; color: #0E7C86; }
    .doc-title { text-align: right; }
    .doc-title h1 { margin: 0; font-size: 16px; color: #0f172a; text-transform: uppercase; }
    .doc-title p { margin: 2px 0 0 0; font-size: 11px; color: #64748b; }
    .section { margin-bottom: 18px; }
    .section-title { font-size: 13px; font-weight: 800; color: #0E7C86; text-transform: uppercase; background: #f1f5f9; padding: 5px 10px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid #0E7C86; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 16px; }
    .field { display: flex; flex-direction: column; }
    .label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .value { font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; font-size: 11px; }
    th { background: #f8fafc; font-weight: 700; color: #475569; }
    .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
    .print-btn { background: #0E7C86; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 8px; cursor: pointer; position: fixed; top: 15px; right: 15px; z-index: 999; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Распечатать / Сохранить в PDF</button>

  <div class="header">
    <div class="logo">ГП ГОСПОМОЩЬ</div>
    <div class="doc-title">
      <h1>Единая анкета клиента</h1>
      <p>ID: ${client.id} • Сформировано: ${new Date().toLocaleDateString('ru-RU')}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">1. Персональные данные и гражданство</div>
    <div class="grid">
      <div class="field"><span class="label">ФИО клиента:</span><span class="value">${q.profile.last_name} ${q.profile.first_name} ${q.profile.middle_name || ""}</span></div>
      <div class="field"><span class="label">Пол:</span><span class="value">${q.profile.gender === "male" ? "Мужской" : "Женский"}</span></div>
      <div class="field"><span class="label">Дата рождения:</span><span class="value">${q.profile.birth_date || "—"}</span></div>
      <div class="field"><span class="label">Место рождения:</span><span class="value">${q.profile.birth_place || "—"}</span></div>
      <div class="field"><span class="label">Гражданство:</span><span class="value">${q.profile.citizenship}</span></div>
      <div class="field"><span class="label">Предыдущее гражданство:</span><span class="value">${q.profile.previous_citizenship || "Не имелось"}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">2. Паспортные данные и налоги</div>
    <div class="grid">
      <div class="field"><span class="label">Паспорт РФ:</span><span class="value">${q.internal_passport.series} № ${q.internal_passport.number}</span></div>
      <div class="field"><span class="label">Дата выдачи / Код:</span><span class="value">${q.internal_passport.issue_date || "—"} (код: ${q.internal_passport.department_code || "—"})</span></div>
      <div class="field" style="grid-column: span 2;"><span class="label">Кем выдан:</span><span class="value">${q.internal_passport.issuer || "—"}</span></div>
      <div class="field"><span class="label">ИНН:</span><span class="value">${q.tax.inn || "Не указан"}</span></div>
      <div class="field"><span class="label">СНИЛС:</span><span class="value">${q.tax.snils || "Не указан"}</span></div>
      ${q.has_foreign_passport && q.foreign_passport ? `
      <div class="field"><span class="label">Загранпаспорт:</span><span class="value">${q.foreign_passport.series} № ${q.foreign_passport.number} (до ${q.foreign_passport.expiry_date || "—"})</span></div>
      ` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">3. Контакты и адреса</div>
    <div class="grid">
      <div class="field"><span class="label">Основной телефон:</span><span class="value">${q.contacts.phone}</span></div>
      <div class="field"><span class="label">WhatsApp:</span><span class="value">${q.contacts.whatsapp || q.contacts.phone}</span></div>
      <div class="field"><span class="label">Email:</span><span class="value">${q.contacts.email || "—"}</span></div>
      <div class="field"><span class="label">Семейное положение:</span><span class="value">${getMaritalStatusLabel(q.marital_status, q.profile?.gender, "ru")}</span></div>
      <div class="field" style="grid-column: span 2;"><span class="label">Адрес постоянной регистрации:</span><span class="value">${q.registration_address.country}, ${q.registration_address.region ? q.registration_address.region + ", " : ""}г. ${q.registration_address.city}, ул. ${q.registration_address.street}, д. ${q.registration_address.house}${q.registration_address.apartment ? ", кв. " + q.registration_address.apartment : ""}</span></div>
    </div>
  </div>

  ${q.spouse ? `
  <div class="section">
    <div class="section-title">4. Данные супруга(и)</div>
    <div class="grid">
      <div class="field"><span class="label">ФИО супруга(и):</span><span class="value">${q.spouse.last_name} ${q.spouse.first_name} ${q.spouse.middle_name || ""}</span></div>
      <div class="field"><span class="label">Дата и место брака:</span><span class="value">${q.spouse.marriage_date || "—"} (${q.spouse.marriage_place || "—"})</span></div>
    </div>
  </div>
  ` : ""}

  <div class="section">
    <div class="section-title">5. Сведения о детях (${q.children.length})</div>
    ${q.children.length === 0 ? "<p class='value' style='color:#64748b;'>Сведения о несовершеннолетних детях отсутствуют</p>" : `
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>ФИО ребёнка</th>
          <th>Дата рождения</th>
          <th>Гражданство</th>
          <th>Документ / Паспорт</th>
        </tr>
      </thead>
      <tbody>
        ${q.children.map((c, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><b>${c.last_name} ${c.first_name} ${c.middle_name || ""}</b></td>
          <td>${c.birth_date || "—"}</td>
          <td>${c.citizenship || "—"}</td>
          <td>${c.passport_series ? `Паспорт: ${c.passport_series} ${c.passport_number}` : "Свидетельство о рождении"}</td>
        </tr>
        `).join("")}
      </tbody>
    </table>
    `}
  </div>

  <div class="footer">
    <span>Информационная система «ГосПомощь» • Конфиденциальный документ</span>
    <span>Страница 1 из 1</span>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
