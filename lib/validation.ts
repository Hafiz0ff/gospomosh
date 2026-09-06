// Validation logic for INN (12 digits), SNILS (11 digits), Country Directory and Auto-masking formatters

export const COUNTRIES = [
  "Российская Федерация",
  "Республика Таджикистан",
  "Республика Узбекистан",
  "Кыргызская Республика",
  "Республика Казахстан",
  "Республика Беларусь",
  "Республика Армения",
  "Азербайджанская Республика",
  "Республика Молдова",
  "Грузия",
  "Туркменистан",
  "Украина",
  "Китайская Народная Республика",
  "Турция",
  "Индия",
  "Вьетнам",
  "Сирийская Арабская Республика",
  "Афганистан",
  "Иран",
  "Другая страна"
];

/**
 * Auto-format Phone Numbers for Russian (+7) and Tajik (+992) formats
 */
export function formatPhoneNumber(val: string): string {
  if (!val) return "";
  let digits = val.replace(/\D/g, "");
  
  // If starts with 8 or 7 (Russian number)
  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  }

  // Handle Tajik numbers (+992 XX XXX XX XX)
  if (digits.startsWith("992")) {
    const num = digits.slice(3, 12);
    let res = "+992";
    if (num.length > 0) res += " (" + num.slice(0, 2);
    if (num.length >= 2) res += ") ";
    if (num.length > 2) res += num.slice(2, 5);
    if (num.length > 5) res += "-" + num.slice(5, 7);
    if (num.length > 7) res += "-" + num.slice(7, 9);
    return res;
  }

  // If user enters 9 digits starting with 9 and not 992 (could be RU 999... or TJ 92...)
  // By default, assume RU (+7) if 10 or 11 digits
  if (digits.startsWith("7")) {
    const num = digits.slice(1, 11);
    let res = "+7";
    if (num.length > 0) res += " (" + num.slice(0, 3);
    if (num.length >= 3) res += ") ";
    if (num.length > 3) res += num.slice(3, 6);
    if (num.length > 6) res += "-" + num.slice(6, 8);
    if (num.length > 8) res += "-" + num.slice(8, 10);
    return res;
  }

  // If started typing raw 9XX... (e.g. 992...)
  if (digits.length <= 9 && digits.startsWith("9") && digits.length >= 3 && digits.startsWith("992")) {
    return "+992 " + digits.slice(3);
  }

  if (digits.length <= 10) {
    let res = "+7";
    if (digits.length > 0) res += " (" + digits.slice(0, 3);
    if (digits.length >= 3) res += ") ";
    if (digits.length > 3) res += digits.slice(3, 6);
    if (digits.length > 6) res += "-" + digits.slice(6, 8);
    if (digits.length > 8) res += "-" + digits.slice(8, 10);
    return res;
  }

  return "+" + digits.slice(0, 15);
}

/**
 * Auto-format Passport Series (4 digits -> 2 + 2: "45 10")
 */
export function formatPassportSeries(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  return digits;
}

/**
 * Auto-format Passport Number (6 digits)
 */
export function formatPassportNumber(val: string): string {
  return val.replace(/\D/g, "").slice(0, 6);
}

/**
 * Auto-format Department Code ("770-001")
 */
export function formatDepartmentCode(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 6);
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits;
}

/**
 * Auto-format SNILS ("123-456-789 01")
 */
export function formatSNILSNumber(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  let res = "";
  if (digits.length > 0) res += digits.slice(0, 3);
  if (digits.length > 3) res += "-" + digits.slice(3, 6);
  if (digits.length > 6) res += "-" + digits.slice(6, 9);
  if (digits.length > 9) res += " " + digits.slice(9, 11);
  return res;
}

/**
 * Auto-format INN (12 digits)
 */
export function formatINNNumber(val: string): string {
  return val.replace(/\D/g, "").slice(0, 12);
}

/**
 * Calculate age in years and return formatted string with declension
 */
export function calculateAge(birthDateStr: string, lang: "ru" | "tg" = "ru"): { age: number; text: string } | null {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) return null;

  if (lang === "tg") {
    return { age, text: `${age} сола` };
  }

  // Russian declension (год / года / лет)
  let word = "лет";
  const lastDigit = age % 10;
  const lastTwo = age % 100;
  if (lastTwo < 11 || lastTwo > 19) {
    if (lastDigit === 1) word = "год";
    else if (lastDigit >= 2 && lastDigit <= 4) word = "года";
  }

  return { age, text: `${age} ${word}` };
}

// INN Physical Person (12 digits) validation with checksum
export function validateINN(innStr: string): { isValid: boolean; message?: string } {
  const clean = innStr.replace(/\D/g, "");
  if (!clean) return { isValid: true }; // optional if empty
  if (clean.length !== 12) {
    return { isValid: false, message: "ИНН физического лица должен состоять ровно из 12 цифр" };
  }

  const digits = clean.split("").map(Number);
  const coeff1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
  const coeff2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0];

  const check1 = (digits.slice(0, 11).reduce((acc, digit, idx) => acc + digit * coeff1[idx], 0) % 11) % 10;
  const check2 = (digits.slice(0, 12).reduce((acc, digit, idx) => acc + digit * coeff2[idx], 0) % 11) % 10;

  if (check1 === digits[10] && check2 === digits[11]) {
    return { isValid: true };
  }

  return { isValid: false, message: "Неверное контрольное число ИНН (ошибка в цифрах)" };
}

// SNILS (11 digits) validation with checksum
export function validateSNILS(snilsStr: string): { isValid: boolean; message?: string } {
  const clean = snilsStr.replace(/\D/g, "");
  if (!clean) return { isValid: true }; // optional if empty
  if (clean.length !== 11) {
    return { isValid: false, message: "СНИЛС должен состоять ровно из 11 цифр" };
  }

  const numPart = clean.slice(0, 9);
  const checkSum = parseInt(clean.slice(9, 11), 10);

  let calcCheck = 0;
  for (let i = 0; i < 9; i++) {
    calcCheck += parseInt(numPart[i], 10) * (9 - i);
  }

  let expectedCheck = 0;
  if (calcCheck < 100) {
    expectedCheck = calcCheck;
  } else if (calcCheck === 100 || calcCheck === 101) {
    expectedCheck = 0;
  } else {
    const rem = calcCheck % 101;
    if (rem < 100) expectedCheck = rem;
    else if (rem === 100 || rem === 101) expectedCheck = 0;
  }

  if (expectedCheck === checkSum) {
    return { isValid: true };
  }

  return { isValid: false, message: "Неверное контрольное число СНИЛС" };
}

// Phone format check
export function validatePhone(phone: string): boolean {
  const clean = phone.replace(/[^0-9+]/g, "");
  return clean.length >= 9;
}

// Email check
export function validateEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
