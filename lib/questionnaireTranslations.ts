export interface QuestionnaireLocale {
  docDisclaimer: string;
  saveAndContinue: string;
  stepOf: (step: number, total: number) => string;
  passedPercent: (p: number) => string;
  back: string;
  next: string;
  submit: string;
  toMain: string;
  savingDraft: string;
  draftSaved: string;
  estimatedTime: string;

  // 4 Major Sections (Grouped)
  sections: {
    1: { id: number; title: string; subtitle: string; iconName: string; stepRange: string };
    2: { id: number; title: string; subtitle: string; iconName: string; stepRange: string };
    3: { id: number; title: string; subtitle: string; iconName: string; stepRange: string };
    4: { id: number; title: string; subtitle: string; iconName: string; stepRange: string };
  };

  // Step headers
  steps: {
    1: { title: string; desc: string };
    2: { title: string; desc: string };
    3: { title: string; desc: string };
    4: { title: string; desc: string };
    5: { title: string; desc: string };
    6: { title: string; desc: string };
    7: { title: string; desc: string };
    8: { title: string; desc: string };
    9: { title: string; desc: string };
    10: { title: string; desc: string };
    11: { title: string; desc: string };
    12: { title: string; desc: string };
  };

  fields: {
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string;
    birthPlace: string;
    gender: string;
    genderMale: string;
    genderFemale: string;
    citizenship: string;
    hasPrevCitizenship: string;
    prevCitizenshipCountry: string;
    internalPassport: string;
    series: string;
    number: string;
    issueDate: string;
    departmentCode: string;
    issuer: string;
    hasForeignPassport: string;
    foreignPassport: string;
    expiryDate: string;
    inn: string;
    snils: string;
    phone: string;
    whatsapp: string;
    whatsappSame: string;
    email: string;
    regAddress: string;
    country: string;
    region: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
    postalCode: string;
    actualAddressSame: string;
    actualAddress: string;
    maritalStatus: string;
    single: string;
    married: string;
    divorced: string;
    widowed: string;
    spouseData: string;
    children: string;
    addChild: string;
    documents: string;
    addDoc: string;
    docType: string;
    docNumber: string;
    reviewTitle: string;
    consentText: string;
  };
}

export const QUESTIONNAIRE_TRANSLATIONS: Record<"ru" | "tg", QuestionnaireLocale> = {
  ru: {
    docDisclaimer: "⚠️ Все данные в анкете необходимо указывать строго в точном соответствии с вашими официальными документами (паспортом, свидетельствами, справками).",
    saveAndContinue: "Сохранить и продолжить позже",
    stepOf: (s, t) => `Раздел ${s} из ${t}`,
    passedPercent: (p) => `${p}% готово`,
    back: "Назад",
    next: "Продолжить",
    submit: "Отправить анкету в CRM",
    toMain: "На главную",
    savingDraft: "Сохранение...",
    draftSaved: "Сохранено!",
    estimatedTime: "~3 мин",

    sections: {
      1: { id: 1, title: "Личные данные", subtitle: "ФИО и гражданство", iconName: "User", stepRange: "1-2" },
      2: { id: 2, title: "Паспорт и налоги", subtitle: "Паспорт РФ, ИНН, СНИЛС", iconName: "FileText", stepRange: "3-4" },
      3: { id: 3, title: "Контакты и адрес", subtitle: "Телефон и прописка", iconName: "PhoneCall", stepRange: "5-6" },
      4: { id: 4, title: "Семья и документы", subtitle: "Дети, сканы и согласие", iconName: "Heart", stepRange: "7-12" }
    },

    steps: {
      1: { title: "Основные персональные данные", desc: "ФИО, дата и место рождения" },
      2: { title: "Гражданство", desc: "Текущее и предыдущее гражданство" },
      3: { title: "Паспортные данные", desc: "Паспорт РФ и загранпаспорт" },
      4: { title: "ИНН и СНИЛС", desc: "Налоговая и пенсионная идентификация" },
      5: { title: "Контактная информация", desc: "Телефон, WhatsApp и Email" },
      6: { title: "Адрес регистрации и проживания", desc: "Адрес по паспорту/прописке" },
      7: { title: "Семейное положение", desc: "Текущий статус брака" },
      8: { title: "Данные супруга(и)", desc: "ФИО и дата брака" },
      9: { title: "Сведения о детях", desc: "Несовершеннолетние дети" },
      10: { title: "Прикрепление документов и фото", desc: "Сканы и снимки с камеры" },
      11: { title: "Проверка введённых данных", desc: "Итоговый просмотр анкеты" },
      12: { title: "Подтверждение и отправка", desc: "Юридическое согласие 152-ФЗ" }
    },

    fields: {
      lastName: "Фамилия *",
      firstName: "Имя *",
      middleName: "Отчество (при наличии)",
      birthDate: "Дата рождения *",
      birthPlace: "Место рождения (по документу) *",
      gender: "Пол *",
      genderMale: "Мужской",
      genderFemale: "Женский",
      citizenship: "Гражданство (выбор из списка) *",
      hasPrevCitizenship: "Имелось предыдущее гражданство",
      prevCitizenshipCountry: "Страна предыдущего гражданства",
      internalPassport: "Паспорт гражданина (Основной)",
      series: "Серия *",
      number: "Номер *",
      issueDate: "Дата выдачи *",
      departmentCode: "Код подразделения",
      issuer: "Кем выдан *",
      hasForeignPassport: "Есть действующий загранпаспорт",
      foreignPassport: "Загранпаспорт",
      expiryDate: "Действителен до",
      inn: "ИНН (12 цифр для РФ)",
      snils: "СНИЛС (11 цифр)",
      phone: "Номер телефона (основной) *",
      whatsapp: "WhatsApp (номер для связи)",
      whatsappSame: "WhatsApp совпадает с основным телефоном",
      email: "Электронная почта (Email)",
      regAddress: "Адрес постоянной регистрации (по паспорту)",
      country: "Страна *",
      region: "Регион / Область",
      city: "Город / Населенный пункт *",
      street: "Улица *",
      house: "Дом *",
      apartment: "Квартира / Офис",
      postalCode: "Индекс",
      actualAddressSame: "Фактический адрес совпадает с адресом регистрации",
      actualAddress: "Адрес фактического проживания",
      maritalStatus: "Семейное положение",
      single: "Холост / Не замужем",
      married: "Женат / Замужем",
      divorced: "Разведен(а)",
      widowed: "Вдовец / Вдова",
      spouseData: "Данные супруга(и)",
      children: "Сведения о детях",
      addChild: "+ Добавить ребенка",
      documents: "Дополнительные документы",
      addDoc: "+ Добавить документ",
      docType: "Тип документа",
      docNumber: "Серия и номер документа",
      reviewTitle: "Сводные данные анкеты",
      consentText: "Я даю согласие на обработку персональных данных в соответствии с Федеральным законом № 152-ФЗ"
    }
  },
  tg: {
    docDisclaimer: "⚠️ Ҳамаи маълумотҳоро дар саволнома қатъиян мувофиқи ҳуҷҷатҳои расмии худ (шиноснома, шаҳодатномаҳо ва маълумотномаҳо) пур намоед.",
    saveAndContinue: "Сабт кардан",
    stepOf: (s, t) => `Бахши ${s} аз ${t}`,
    passedPercent: (p) => `${p}% тайёр`,
    back: "Қафо",
    next: "Давом додан",
    submit: "Ирсол ба CRM",
    toMain: "Ба саҳифаи асосӣ",
    savingDraft: "Сабт...",
    draftSaved: "Сабт шуд!",
    estimatedTime: "~3 дақ",

    sections: {
      1: { id: 1, title: "Маълумоти шахсӣ", subtitle: "Ному насаб ва шаҳрвандӣ", iconName: "User", stepRange: "1-2" },
      2: { id: 2, title: "Шиноснома ва андоз", subtitle: "Шиноснома, ИНН, СНИЛС", iconName: "FileText", stepRange: "3-4" },
      3: { id: 3, title: "Тамос ва суроға", subtitle: "Телефон ва қайди ҷои зист", iconName: "PhoneCall", stepRange: "5-6" },
      4: { id: 4, title: "Оила ва ҳуҷҷатҳо", subtitle: "Фарзандон, аксҳо ва розигӣ", iconName: "Heart", stepRange: "7-12" }
    },

    steps: {
      1: { title: "Маълумоти асосии шахсӣ", desc: "Ному насаб, сана ва ҷои таваллуд" },
      2: { title: "Шаҳрвандӣ", desc: "Шаҳрвандии ҷорӣ ва қаблӣ" },
      3: { title: "Маълумоти шиноснома", desc: "Шиноснома ва шиносномаи хориҷӣ" },
      4: { title: "ИНН ва СНИЛС", desc: "Рақамҳои андоз ва нафақа" },
      5: { title: "Маълумоти тамос", desc: "Телефон, WhatsApp ва Email" },
      6: { title: "Суроғаи бақайдгирӣ ва зист", desc: "Суроға аз рӯи қайди расмӣ" },
      7: { title: "Вазъи оилавӣ", desc: "Ҳолати ақди никоҳ" },
      8: { title: "Маълумоти ҳамсар", desc: "Ному насаб ва санаи ақди никоҳ" },
      9: { title: "Маълумот дар бораи кӯдакон", desc: "Фарзандони ноболиғ" },
      10: { title: "Замимаи ҳуҷҷатҳо ва аксҳо", desc: "Нусхаҳо ва акс аз камера" },
      11: { title: "Санҷиши маълумоти воридшуда", desc: "Баррасии ниҳоии саволнома" },
      12: { title: "Тасдиқ ва ирсол", desc: "Розигии ҳуқуқӣ (152-ФЗ)" }
    },

    fields: {
      lastName: "Насаб (Фамилия) *",
      firstName: "Ном *",
      middleName: "Номи падар (дар сурати доштан)",
      birthDate: "Санаи таваллуд *",
      birthPlace: "Ҷои таваллуд (мувофиқи ҳуҷҷат) *",
      gender: "Ҷинс *",
      genderMale: "Мард",
      genderFemale: "Зан",
      citizenship: "Шаҳрвандӣ (интихоб аз рӯйхат) *",
      hasPrevCitizenship: "Шаҳрвандии қаблӣ доштам",
      prevCitizenshipCountry: "Кишвари шаҳрвандии қаблӣ",
      internalPassport: "Шиносномаи шаҳрванд (Асосӣ)",
      series: "Силсила (Серия) *",
      number: "Рақам *",
      issueDate: "Санаи дода шудан *",
      departmentCode: "Рамзи шуъба (Код подразделения)",
      issuer: "Аз ҷониби кӣ дода шудааст *",
      hasForeignPassport: "Шиносномаи хориҷии амалкунанда дорам",
      foreignPassport: "Шиносномаи хориҷӣ",
      expiryDate: "Эътибор дорад то",
      inn: "ИНН (12 рақам барои РФ)",
      snils: "СНИЛС (11 рақам)",
      phone: "Рақами телефон (асосӣ) *",
      whatsapp: "WhatsApp (барои тамос)",
      whatsappSame: "WhatsApp бо рақами асосӣ якхела аст",
      email: "Почтаи электронӣ (Email)",
      regAddress: "Суроғаи бақайдгирии доимӣ (аз рӯи қайд)",
      country: "Кишвар *",
      region: "Минтақа / Вилоят",
      city: "Шаҳр / Ноҳия *",
      street: "Кӯча *",
      house: "Хона *",
      apartment: "Ҳуҷра (Квартира)",
      postalCode: "Индекс",
      actualAddressSame: "Суроғаи воқеӣ бо суроғаи қайд якхела аст",
      actualAddress: "Суроғаи зисти воқеӣ",
      maritalStatus: "Вазъи оилавӣ",
      single: "Муҷаррад / Оиладорнашуда",
      married: "Оиладор",
      divorced: "Ҷудошуда",
      widowed: "Бевазан / Бевамард",
      spouseData: "Маълумот дар бораи ҳамсар",
      children: "Маълумот дар бораи фарзандон",
      addChild: "+ Илова кардани кӯдак",
      documents: "Ҳуҷҷатҳои иловагӣ",
      addDoc: "+ Илова кардани ҳуҷҷат",
      docType: "Намуди ҳуҷҷат",
      docNumber: "Силсила ва рақами ҳуҷҷат",
      reviewTitle: "Маълумоти умумии саволнома",
      consentText: "Ман ба коркарди маълумоти шахсии худ мутобиқи Қонуни Федералии № 152-ФЗ розигӣ медиҳам"
    }
  }
};
