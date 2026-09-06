import { NextRequest, NextResponse } from "next/server";
import { getClientById } from "@/lib/dataService";
import { generateFormHtml, OFFICIAL_FORMS } from "@/lib/officialFormsService";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; formType: string }> }
) {
  const { id, formType } = await context.params;
  const client = await getClientById(id);

  if (!client) {
    return new NextResponse("Клиент не найден в базе CRM", { status: 404 });
  }

  const validForm = OFFICIAL_FORMS.find((f) => f.id === formType);
  if (!validForm) {
    return new NextResponse(
      `Недопустимый тип бланка: ${formType}. Доступные бланки: ${OFFICIAL_FORMS.map((f) => f.id).join(", ")}`,
      { status: 400 }
    );
  }

  try {
    const html = generateFormHtml(formType, client);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err: any) {
    return new NextResponse(`Ошибка генерации бланка: ${err.message}`, { status: 500 });
  }
}
