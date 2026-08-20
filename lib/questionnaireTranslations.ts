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
    docDisclaimer: "⚠️ Внимание: Все данные в анкете необходимо указывать строго в точном соответствии с вашими официальными документами (паспортом, свидетельствами, справками).",
    saveAndContinue: "Сохранить и продолжить позже",
    stepOf: (s, t) => `Шаг ${s} из ${t}`,
    passedPercent: (p) => `${p}% пройдено`,
    back: "Назад",
    next: "Далее",
    submit: "Отправить и сохранить анкету",
    toMain: "На главную",
    savingDraft: "Сохранение черновика...",
    draftSaved: "Черновик сохранён!",
    
    steps: {
      1: { title: "Шаг 1: Основные данные", desc: "ФИО, дата и место рождения" },
      2: { title: "Шаг 2: Гражданство", desc: "Текущее и предыдущее гражданство" },
      3: { title: "Шаг 3: Паспортные данные", desc: "Паспорт РФ и загранпаспорт" },
      4: { title: "Шаг 4: ИНН и СНИЛС", desc: "Налоговая и пенсионная идентификация" },
      5: { title: "Шаг 5: Контакты", desc: "Телефон, мессенджеры и Email" },
      6: { title: "Шаг 6: Адрес регистрации", desc: "Адрес по паспорту/прописке" },
      7: { title: "Шаг 7: Фактический адрес", desc: "Адрес реального проживания" },
      8: { title: "Шаг 8: Семейное положение", desc: "Брак и данные супруга(и)" },
      9: { title: "Шаг 9: Дети", desc: "Сведения о несовершеннолетних детях" },
      10: { title: "Шаг 10: Документы", desc: "Прикрепленные свидетельства и справки" },
      11: { title: "Шаг 11: Проверка данных", desc: "Итоговый просмотр заполненной анкеты" },
      12: { title: "Шаг 12: Согласие и отправка", desc: "Юридическое подтверждение и отправка" }
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
    docDisclaimer: "⚠️ Диққат: Ҳамаи маълумотҳоро дар саволнома қатъиян мувофиқи ҳуҷҷатҳои расмии худ (шиноснома, шаҳодатномаҳо ва маълумотномаҳо) пур намоед.",
    saveAndContinue: "Сабт кардан ва баъдтар давом додан",
    stepOf: (s, t) => `Қадами ${s} аз ${t}`,
    passedPercent: (p) => `${p}% гузашт`,
    back: "Қафо",
    next: "Оянда",
    submit: "Ирсол ва сабти саволнома",
    toMain: "Ба саҳифаи асосӣ",
    savingDraft: "Сабти сиёҳнавис...",
    draftSaved: "Сиёҳнавис сабт шуд!",

    steps: {
      1: { title: "Қадами 1: Маълумоти асосӣ", desc: "Ному насаб, сана ва ҷои таваллуд" },
      2: { title: "Қадами 2: Шаҳрвандӣ", desc: "Шаҳрвандии ҷорӣ ва қаблӣ" },
      3: { title: "Қадами 3: Маълумоти шиноснома", desc: "Шиноснома ва шиносномаи хориҷӣ" },
      4: { title: "Қадами 4: ИНН ва СНИЛС", desc: "Рақамҳои андоз ва нафақа" },
      5: { title: "Қадами 5: Маълумоти тамос", desc: "Телефон, мессенҷерҳо ва Email" },
      6: { title: "Қадами 6: Суроғаи бақайдгирӣ", desc: "Суроға аз рӯи қайди расмӣ" },
      7: { title: "Қадами 7: Суроғаи воқеӣ", desc: "Суроғаи зисти амалӣ" },
      8: { title: "Қадами 8: Вазъи оилавӣ", desc: "Ақди никоҳ ва маълумоти ҳамсар" },
      9: { title: "Қадами 9: Фарзандон", desc: "Маълумот дар бораи кӯдакон" },
      10: { title: "Қадами 10: Ҳуҷҷатҳо", desc: "Шаҳодатномаҳо ва дигар ҳуҷҷатҳо" },
      11: { title: "Қадами 11: Санҷиши маълумот", desc: "Баррасии ниҳоии саволнома" },
      12: { title: "Қадами 12: Розигӣ ва ирсол", desc: "Тасдиқи ҳуқуқӣ ва ирсоли ариза" }
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
