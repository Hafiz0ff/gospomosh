"use server";

import { FullClientQuestionnaire } from "@/lib/types";
import { validateINN, validateSNILS, validatePhone, validateEmail } from "@/lib/validation";
import { saveQuestionnaire } from "@/lib/dataService";

export interface SubmitResult {
  success: boolean;
  clientId?: string;
  questionnaireId?: string;
  error?: string;
}

export async function submitQuestionnaireAction(data: FullClientQuestionnaire): Promise<SubmitResult> {
  // 1. Server-side validation
  if (!data.consent) {
    return { success: false, error: "Требуется обязательное согласие на обработку персональных данных" };
  }

  if (!data.profile.last_name || !data.profile.first_name || !data.profile.birth_date) {
    return { success: false, error: "Не заполнены обязательные персональные поля" };
  }

  if (data.tax?.inn) {
    const innVal = validateINN(data.tax.inn);
    if (!innVal.isValid) {
      return { success: false, error: innVal.message || "Неверный ИНН" };
    }
  }

  if (data.tax?.snils) {
    const snilsVal = validateSNILS(data.tax.snils);
    if (!snilsVal.isValid) {
      return { success: false, error: snilsVal.message || "Неверный СНИЛС" };
    }
  }

  if (!validatePhone(data.contacts.phone)) {
    return { success: false, error: "Некорректный формат номера телефона" };
  }

  if (data.contacts.email && !validateEmail(data.contacts.email)) {
    return { success: false, error: "Некорректный формат email" };
  }

  try {
    const res = await saveQuestionnaire(data);
    return {
      success: true,
      clientId: res.client_id,
      questionnaireId: res.id
    };
  } catch (err: any) {
    return {
      success: false,
      error: "Не удалось сохранить анкету на сервере"
    };
  }
}
