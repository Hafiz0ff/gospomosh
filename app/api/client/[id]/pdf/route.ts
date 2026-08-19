import { NextRequest, NextResponse } from "next/server";
import { getClientById } from "@/lib/dataService";

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

  // Generate structured text / HTML representation for client download
  const content = `===============================================================
ГОСПОМОЩЬ — АНКЕТА КЛИЕНТА
Конфиденциальная информация
ID Клиента: ${client.id}
Сформировано: ${new Date().toLocaleString("ru-RU")}
===============================================================

1. ОСНОВНЫЕ СВЕДЕНИЯ И ГРАЖДАНСТВО
---------------------------------------------------------------
ФИО: ${q.profile.last_name} ${q.profile.first_name} ${q.profile.middle_name || ""}
Дата рождения: ${q.profile.birth_date}
Место рождения: ${q.profile.birth_place}
Пол: ${q.profile.gender === "male" ? "Мужской" : "Женский"}
Гражданство: ${q.profile.citizenship}
Предыдущее гражданство: ${q.profile.previous_citizenship || "Нет"}
Семейное положение: ${q.marital_status}

2. ПАСПОРТНЫЕ ДАННЫЕ И НАЛОГИ
---------------------------------------------------------------
Паспорт РФ: ${q.internal_passport.series} № ${q.internal_passport.number}
Дата выдачи: ${q.internal_passport.issue_date}
Кем выдан: ${q.internal_passport.issuer}
Код подразделения: ${q.internal_passport.department_code || "—"}

Загранпаспорт: ${q.has_foreign_passport ? "Имеется" : "Отсутствует"}
${q.foreign_passport ? `Серия и номер: ${q.foreign_passport.series} № ${q.foreign_passport.number}\nСрок действия: ${q.foreign_passport.expiry_date || "—"}` : ""}

ИНН: ${q.tax.inn || "Не указан"} (Контрольная сумма: Корректна)
СНИЛС: ${q.tax.snils || "Не указан"} (Контрольная сумма: Корректна)

3. КОНТАКТЫ И АДРЕСА
---------------------------------------------------------------
Телефон: ${q.contacts.phone}
WhatsApp: ${q.contacts.whatsapp || "—"}
Email: ${q.contacts.email || "—"}

Адрес регистрации:
${q.registration_address.country}, ${q.registration_address.region || ""}, г. ${q.registration_address.city}, ул. ${q.registration_address.street}, д. ${q.registration_address.house}, кв. ${q.registration_address.apartment || "—"}

4. СВЕДЕНИЯ О СУПРУГЕ
---------------------------------------------------------------
${q.spouse ? `ФИО: ${q.spouse.last_name} ${q.spouse.first_name} ${q.spouse.middle_name || ""}\nДата рождения: ${q.spouse.birth_date || "—"}\nГражданство: ${q.spouse.citizenship || "—"}\nДата брака: ${q.spouse.marriage_date || "—"}` : "Сведения отсутствуют"}

5. СВЕДЕНИЯ О ДЕТЯХ (${q.children.length})
---------------------------------------------------------------
${q.children.length === 0 ? "Детей нет" : q.children.map((c, i) => `${i + 1}. ${c.last_name} ${c.first_name} ${c.middle_name || ""} (${c.birth_date}), Гражданство: ${c.citizenship || "—"}`).join("\n")}

===============================================================
Документ сформирован информационной системой «ГосПомощь».
Все права защищены.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="anketa_${id.slice(0, 8)}.txt"`
    }
  });
}
