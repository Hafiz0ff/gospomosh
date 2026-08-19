// Validation logic for INN (12 digits), SNILS (11 digits), and Country Directory

export const COUNTRIES = [
  "Российская Федерация",
  "Республика Беларусь",
  "Республика Казахстан",
  "Республика Узбекистан",
  "Республика Таджикистан",
  "Кыргызская Республика",
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
  return clean.length >= 10;
}

// Email check
export function validateEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
