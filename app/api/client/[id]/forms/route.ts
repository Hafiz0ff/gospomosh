import { NextRequest, NextResponse } from "next/server";
import { getClientById } from "@/lib/dataService";
import { OFFICIAL_FORMS } from "@/lib/officialFormsService";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const client = await getClientById(id);

  if (!client) {
    return new NextResponse("Клиент не найден в базе CRM", { status: 404 });
  }

  // Redirect to the first official form (Form 1P)
  return NextResponse.redirect(new URL(`/api/client/${id}/forms/passport-1p`, request.url));
}
