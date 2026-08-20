"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "ru" | "tg";

export interface Translations {
  // Header & Navigation
  appName: string;
  catalog: string;
  clientQuestionnaire: string;
  checkDocs: string;
  calculator: string;
  faq: string;
  pickService: string;
  adminPanel: string;
  theme: string;
  langName: string;

  // Home Page
  homeBadge: string;
  homeTitle: string;
  homeSubtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  btnPickService: string;
  btnFillQuestionnaire: string;
  btnCheckDocs: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  allCategories: string;
  popularTitle: string;
  popularSubtitle: string;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;

  // Calculator Page
  calcTitle: string;
  calcSubtitle: string;
  calcServiceLabel: string;
  calcAgeLabel: string;
  calcAgeChild: string;
  calcAgeTeen: string;
  calcAgeAdult: string;
  calcUrgencyLabel: string;
  calcUrgencyStandard: string;
  calcUrgencyUrgent: string;
  calcAddonsLabel: string;
  addonFillApp: string;
  addonCheckDocs: string;
  addonEscort: string;
  calcSummaryTitle: string;
  calcGovFee: string;
  calcServicePrice: string;
  calcAddonsPrice: string;
  calcTotal: string;
  calcSubmitBtn: string;

  // Service Card
  onlineAvailable: string;
  govFeeLabel: string;
  freeLabel: string;
  processingTimeLabel: string;
  assistanceLabel: string;
  priceFrom: string;
  pickBtn: string;

  // Footer
  footerDesc: string;
  footerSections: string;
  footerPopular: string;
  footerContacts: string;
  footerDisclaimer: string;
  footerRights: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ru: {
    appName: "ГосПомощь",
    catalog: "Каталог услуг",
    clientQuestionnaire: "Анкета клиента",
    checkDocs: "Проверка документов",
    calculator: "Калькулятор",
    faq: "FAQ",
    pickService: "Подобрать услугу",
    adminPanel: "Панель администратора",
    theme: "Тема",
    langName: "Русский",

    homeBadge: "Умная навигация без очередей",
    homeTitle: "Поможем разобраться, какая услуга вам нужна",
    homeSubtitle: "Ответьте на несколько простых вопросов. Система сформирует персональный список документов, рассчитает госпошлину и подготовит пошаговый план действий.",
    searchPlaceholder: "Например: ВНЖ, загранпаспорт, замена паспорта...",
    searchBtn: "Найти",
    btnPickService: "Подобрать услугу",
    btnFillQuestionnaire: "Заполнить анкету клиента",
    btnCheckDocs: "Проверить документы",
    categoriesTitle: "Категории услуг",
    categoriesSubtitle: "Выберите направление для быстрого старта",
    allCategories: "Все категории",
    popularTitle: "Популярные услуги",
    popularSubtitle: "Наиболее частые обращения клиентов",
    whyChooseTitle: "Почему клиенты выбирают «ГосПомощь»?",
    whyChooseSubtitle: "Мы превращаем сложную бюрократическую систему в понятный цифровой сервисный маршрут.",
    benefit1Title: "Без ошибок",
    benefit1Desc: "Система исключает риски отказа из-за неполного комплекта документов.",
    benefit2Title: "Персональный план",
    benefit2Desc: "Автоматический расчет пошлин, сроков и пошаговый чек-лист действий.",
    benefit3Title: "Экспертная поддержка",
    benefit3Desc: "Возможность связаться с профильным юристом в 1 клик на финальном шаге.",

    calcTitle: "Калькулятор стоимости и пошлин",
    calcSubtitle: "Рассчитайте точный размер государственной пошлины и юридического сопровождения",
    calcServiceLabel: "Государственная услуга",
    calcAgeLabel: "Возраст заявителя",
    calcAgeChild: "До 14 лет",
    calcAgeTeen: "14–18 лет",
    calcAgeAdult: "От 18 лет",
    calcUrgencyLabel: "Срочность подготовки",
    calcUrgencyStandard: "Стандартная",
    calcUrgencyUrgent: "Срочная (+50%)",
    calcAddonsLabel: "Дополнительные опции",
    addonFillApp: "Заполнение заявления по регламенту",
    addonCheckDocs: "Юридическая проверка документов",
    addonEscort: "Личное сопровождение юриста в МФЦ/МВД",
    calcSummaryTitle: "Расчёт стоимости",
    calcGovFee: "Госпошлина:",
    calcServicePrice: "Сопровождение:",
    calcAddonsPrice: "Доп. услуги:",
    calcTotal: "Итого к оплате",
    calcSubmitBtn: "Оформить услугу",

    onlineAvailable: "Доступна online",
    govFeeLabel: "Госпошлина",
    freeLabel: "Бесплатно",
    processingTimeLabel: "Срок",
    assistanceLabel: "Сопровождение",
    priceFrom: "от",
    pickBtn: "Подобрать",

    footerDesc: "Интерактивная система подбора, расчета и юридического сопровождения государственных и миграционных услуг.",
    footerSections: "Разделы",
    footerPopular: "Популярные услуги",
    footerContacts: "Контакты",
    footerDisclaimer: "Независимый сервис: Сервис является независимым информационным сервисом и не является официальным сайтом государственных органов РФ. Информация носит справочный характер.",
    footerRights: "Все права защищены."
  },
  tg: {
    appName: "ГосПомощь",
    catalog: "Феҳристи хизматрасониҳо",
    clientQuestionnaire: "Саволномаи мизоҷ",
    checkDocs: "Санҷиши ҳуҷҷатҳо",
    calculator: "Ҳисобкунак",
    faq: "Саволу ҷавоб (FAQ)",
    pickService: "Интихоби хизматрасонӣ",
    adminPanel: "Панели мудир",
    theme: "Мавзӯъ",
    langName: "Тоҷикӣ",

    homeBadge: "Хизматрасонии осон бидуни навбат",
    homeTitle: "Ба шумо барои интихоби хизматрасонии лозима кумак мекунем",
    homeSubtitle: "Ба чанд саволи оддӣ ҷавоб диҳед. Система рӯйхати ҳуҷҷатҳоро омода карда, боҷи давлатиро ҳисоб мекунад ва нақшаи амалро тартиб медиҳад.",
    searchPlaceholder: "Масалан: ВНЖ, шиносномаи хориҷӣ, ивази шиноснома...",
    searchBtn: "Ҷустуҷӯ",
    btnPickService: "Интихоби хизматрасонӣ",
    btnFillQuestionnaire: "Пур кардани саволнома",
    btnCheckDocs: "Санҷиши ҳуҷҷатҳо",
    categoriesTitle: "Бахшҳои хизматрасонӣ",
    categoriesSubtitle: "Самти лозимаро барои оғози кор интихоб намоед",
    allCategories: "Ҳамаи бахшҳо",
    popularTitle: "Хизматрасониҳои маъмул",
    popularSubtitle: "Муроҷиатҳои бештари мизоҷон",
    whyChooseTitle: "Чаро мизоҷон «ГосПомощь»-ро интихоб мекунанд?",
    whyChooseSubtitle: "Мо низоми мураккаби ҳуҷҷатгузориро ба як раванди фаҳмо ва рақамии хизматрасонӣ табдил медиҳем.",
    benefit1Title: "Бе хатогӣ",
    benefit1Desc: "Система хатари рад шудани ҳуҷҷатҳоро аз сабаби нопуррагӣ бартараф месозад.",
    benefit2Title: "Нақшаи инфиродӣ",
    benefit2Desc: "Ҳисоби худкори боҷи давлатӣ, мӯҳлатҳо ва дастури қадам ба қадами амалҳо.",
    benefit3Title: "Дастгирии ҳуқуқӣ",
    benefit3Desc: "Имконияти пайваст шудан бо ҳуқуқшинос бо 1 клик дар қадами ниҳоӣ.",

    calcTitle: "Ҳисобкунаки нарх ва боҷи давлатӣ",
    calcSubtitle: "Ҳаҷми дақиқи боҷи давлатӣ ва арзиши ҳамроҳии ҳуқуқиро ҳисоб кунед",
    calcServiceLabel: "Хизматрасонии давлатӣ",
    calcAgeLabel: "Синну соли довталаб",
    calcAgeChild: "То 14 сола",
    calcAgeTeen: "Аз 14 то 18 сола",
    calcAgeAdult: "Аз 18 сола боло",
    calcUrgencyLabel: "Муҳлати омодасозӣ",
    calcUrgencyStandard: "Муқаррарӣ",
    calcUrgencyUrgent: "Фаврӣ (+50%)",
    calcAddonsLabel: "Хизматрасониҳои иловагӣ",
    addonFillApp: "Пур кардани ариза мувофиқи қоида",
    addonCheckDocs: "Санҷиши ҳуқуқии ҳуҷҷатҳо",
    addonEscort: "Ҳамроҳии шахсии ҳуқуқшинос дар МФЦ/МВД",
    calcSummaryTitle: "Ҳисоби умумӣ",
    calcGovFee: "Боҷи давлатӣ:",
    calcServicePrice: "Ҳамроҳии ҳуқуқӣ:",
    calcAddonsPrice: "Хизматҳои иловагӣ:",
    calcTotal: "Ҳамагӣ барои пардохт",
    calcSubmitBtn: "Ба расмият даровардан",

    onlineAvailable: "Дар онлайн дастрас",
    govFeeLabel: "Боҷи давлатӣ",
    freeLabel: "Ройгон",
    processingTimeLabel: "Мӯҳлат",
    assistanceLabel: "Ҳамроҳии ҳуқуқӣ",
    priceFrom: "аз",
    pickBtn: "Интихоб",

    footerDesc: "Низоми интерактивии интихоб, ҳисоб ва ҳамроҳии ҳуқуқии хизматрасониҳои давлатӣ ва муҳоҷиратӣ.",
    footerSections: "Бахшҳо",
    footerPopular: "Хизматрасониҳои маъмул",
    footerContacts: "Тамос",
    footerDisclaimer: "Хадамоти мустақил: Ин хизматрасонӣ сомонаи расмии мақомоти давлатии Федератсияи Русия намебошад ва хусусияти иттилоотию роҳнамоӣ дорад.",
    footerRights: "Ҳамаи ҳуқуқҳо ҳифз шудаанд."
  }
};

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ru",
  t: TRANSLATIONS.ru,
  setLanguage: () => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("gospomosh_lang") as Language;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("gospomosh_lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t: TRANSLATIONS[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
