import { Category, Service, Question, DocumentItem, FAQItem } from "./types";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Паспорт и документы", slug: "passport", description: "Оформление и замена основного документа гражданина РФ", icon: "FileText", sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-2", name: "Загранпаспорт", slug: "zagranpasport", description: "Загранпаспорта старого и нового образца (10 лет)", icon: "Globe", sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-3", name: "Миграционные услуги", slug: "migration", description: "РВП, ВНЖ, гражданство, миграционный учет", icon: "Users", sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-4", name: "Налоги", slug: "taxes", description: "ИНН, выписки, налоговые вычеты", icon: "Receipt", sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-5", name: "Автомобиль", slug: "auto", description: "Регистрация ТС, водительские права", icon: "Car", sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-6", name: "Недвижимость", slug: "realty", description: "Кадастр, регистрация прав собственности", icon: "Home", sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-7", name: "Семья и дети", slug: "family", description: "Свидетельства, материнский капитал", icon: "Heart", sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-8", name: "Пенсии и пособия", slug: "pension", description: "Оформление пенсионных выплат", icon: "Shield", sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-9", name: "Юридические услуги", slug: "legal", description: "Сопровождение сделок и консультации", icon: "Scale", sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-10", name: "Справки и выписки", slug: "certificates", description: "Справка об отсутствии судимости, медицинские выписки", icon: "FileCheck", sort_order: 10, is_active: true, created_at: "", updated_at: "" }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "srv-1",
    category_id: "cat-3",
    name: "Вид на жительство (ВНЖ)",
    slug: "vid-na-zhitelstvo",
    short_description: "Комплексное сопровождение получения статуса ВНЖ в РФ",
    description: "Вид на жительство дает право постоянно проживать в РФ, официально работать в любом регионе и пользоваться социальными услугами без оформления патента.",
    official_description: "Статус постоянного проживания иностранного гражданина на территории РФ. Выдается бессрочно (кроме ВКС).",
    price_from: 5000,
    price_to: 25000,
    government_fee: 6000,
    processing_time: "От 4 месяцев",
    assistance_price: 15000,
    is_active: true,
    sort_order: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-2",
    category_id: "cat-1",
    name: "Замена паспорта РФ (20/45 лет, утеря)",
    slug: "zamena-pasporta",
    short_description: "Быстрое оформление и подготовка заявления на замену паспорта",
    description: "Поможем правильно заполнить заявление, проверить требования к фотографии и оплатить госпошлину без ошибок.",
    official_description: "Обязательная замена паспорта по достижении возрастных рубежей или при изменении персональных данных.",
    price_from: 1000,
    price_to: 3000,
    government_fee: 300,
    processing_time: "От 1 до 5 дней",
    assistance_price: 1500,
    is_active: true,
    sort_order: 2,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-3",
    category_id: "cat-2",
    name: "Получение загранпаспорта (10 лет)",
    slug: "zagranpasport",
    short_description: "Биометрический заграничный паспорт нового поколения с чипом",
    description: "Полный пакет документов для подачи в МВД / МФЦ с сопровождением и записью без очереди.",
    official_description: "Заграничный паспорт гражданина РФ со сроком действия 10 лет и биометрическим электронным носителем.",
    price_from: 2000,
    price_to: 6000,
    government_fee: 6000,
    processing_time: "От 1 месяца",
    assistance_price: 3500,
    is_active: true,
    sort_order: 3,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-4",
    category_id: "cat-3",
    name: "Разрешение на временное проживание (РВП)",
    slug: "rvp",
    short_description: "Оформление РВП по квоте или по упрощенным основаниям",
    description: "РВП дает право проживать и работать в выбранном субъекте РФ в течение 3 лет.",
    official_description: "Первый этап легализации иностранного гражданина для дальнейшего получения ВНЖ.",
    price_from: 4000,
    price_to: 20000,
    government_fee: 1600,
    processing_time: "От 2 до 4 месяцев",
    assistance_price: 12000,
    is_active: true,
    sort_order: 4,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-5",
    category_id: "cat-3",
    name: "Миграционный учёт (Регистрация)",
    slug: "migratsionny-uchet",
    short_description: "Постановка на миграционный учет по месту пребывания",
    description: "Быстрое и легальное уведомление о прибытии иностранного гражданина.",
    official_description: "Уведомление органов МВД о месте фактического проживания/пребывания иностранца.",
    price_from: 500,
    price_to: 2000,
    government_fee: 0,
    processing_time: "1 рабочий день",
    assistance_price: 1000,
    is_active: true,
    sort_order: 5,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-6",
    category_id: "cat-4",
    name: "Получение ИНН",
    slug: "inn",
    short_description: "Постановка на учет в налоговом органе и получение свидетельства",
    description: "Оформление ИНН для граждан РФ и иностранных граждан за 1 день.",
    official_description: "Идентификационный номер налогоплательщика для учета доходов и платежей.",
    price_from: 500,
    price_to: 1500,
    government_fee: 0,
    processing_time: "1-3 дня",
    assistance_price: 1000,
    is_active: true,
    sort_order: 6,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-7",
    category_id: "cat-5",
    name: "Регистрация автомобиля в ГИБДД",
    slug: "auto-registration",
    short_description: "Постановка транспортного средства на учет и получение номеров",
    description: "Подготовка договора купли-продажи, проверка авто и сопровождение в ГИБДД.",
    official_description: "Внесение сведений о владельце транспортного средства в государственный реестр.",
    price_from: 1500,
    price_to: 5000,
    government_fee: 2850,
    processing_time: "1 день",
    assistance_price: 3000,
    is_active: true,
    sort_order: 7,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-8",
    category_id: "cat-10",
    name: "Справка об отсутствии судимости",
    slug: "spravka-sudimost",
    short_description: "Получение официальной справки с апостилем при необходимости",
    description: "Истребование справки об отсутствии судимости с возможностью срочного получения.",
    official_description: "Документ, подтверждающий наличие или отсутствие сведений о судимости в базе МВД.",
    price_from: 1000,
    price_to: 4000,
    government_fee: 0,
    processing_time: "От 3 до 30 дней",
    assistance_price: 2000,
    is_active: true,
    sort_order: 8,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-9",
    category_id: "cat-3",
    name: "Получение Гражданства РФ",
    slug: "grazhdanstvo",
    short_description: "Полное сопровождение подачи документов на гражданство РФ",
    description: "Консультации, сбор пакета, проверка носителя русского языка или иных оснований.",
    official_description: "Оформление паспорта гражданина Российской Федерации по общей или упрощенной схеме.",
    price_from: 10000,
    price_to: 45000,
    government_fee: 3500,
    processing_time: "От 3 месяцев",
    assistance_price: 25000,
    is_active: true,
    sort_order: 9,
    created_at: "",
    updated_at: ""
  },
  {
    id: "srv-10",
    category_id: "cat-3",
    name: "Оформление патента на работу",
    slug: "patent",
    short_description: "Патент для работы иностранных граждан из безвизовых стран",
    description: "Медосмотр, тестирование, страховка и подача заявления в Сахарово / ММЦ.",
    official_description: "Разрешительный документ для трудовой деятельности безвизовых иностранных граждан.",
    price_from: 3000,
    price_to: 12000,
    government_fee: 5000,
    processing_time: "10 рабочих дней",
    assistance_price: 6000,
    is_active: true,
    sort_order: 10,
    created_at: "",
    updated_at: ""
  }
];

export const MOCK_QUESTIONS: Record<string, Question[]> = {
  "vid-na-zhitelstvo": [
    {
      id: "q-1",
      service_id: "srv-1",
      question: "Есть ли у вас действующее Разрешение на временное проживание (РВП)?",
      description: "Наличие РВП позволяет подать на ВНЖ на общих основаниях.",
      type: "single_choice",
      sort_order: 1,
      is_required: true,
      is_active: true,
      created_at: "",
      options: [
        { id: "opt-1", question_id: "q-1", label: "Да, проживаю по РВП более 8 месяцев", value: "has_rvp", sort_order: 1, next_question_id: "q-3", created_at: "" },
        { id: "opt-2", question_id: "q-1", label: "Нет, РВП отсутствует", value: "no_rvp", sort_order: 2, next_question_id: "q-2", created_at: "" }
      ]
    },
    {
      id: "q-2",
      service_id: "srv-1",
      question: "Есть ли у вас упрощенное основание для ВНЖ (родители/дети граждане РФ)?",
      description: "Позволяет миновать стадию получения РВП.",
      type: "single_choice",
      sort_order: 2,
      is_required: true,
      is_active: true,
      created_at: "",
      options: [
        { id: "opt-3", question_id: "q-2", label: "Да, есть основание (родственники, диплом с отличием, ВКС)", value: "basis_family", sort_order: 1, next_question_id: "q-3", created_at: "" },
        { id: "opt-4", question_id: "q-2", label: "Нет оснований (нужно сначала получать РВП)", value: "no_basis", sort_order: 2, next_question_id: null, created_at: "" }
      ]
    },
    {
      id: "q-3",
      service_id: "srv-1",
      question: "Вам требуется полное сопровождение \"под ключ\"?",
      description: "Включает проверку документов, запись на прием и присутствие юриста.",
      type: "boolean",
      sort_order: 3,
      is_required: true,
      is_active: true,
      created_at: "",
      options: [
        { id: "opt-5", question_id: "q-3", label: "Да, требуется сопровождение специалистов", value: "full_support", sort_order: 1, next_question_id: null, created_at: "" },
        { id: "opt-6", question_id: "q-3", label: "Нет, нужна только консультация и проверка пакета", value: "docs_only", sort_order: 2, next_question_id: null, created_at: "" }
      ]
    }
  ]
};

export const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: "doc-1", name: "Паспорт гражданина / иностранного гражданина", description: "Оригинал и нотариально заверенный перевод", document_type: "Удостоверение", created_at: "" },
  { id: "doc-2", name: "Фотографии 35х45 мм (матовые)", description: "4 штуки, цветные или черно-белые", document_type: "Фото", created_at: "" },
  { id: "doc-3", name: "Разрешение на временное проживание (РВП)", description: "При наличии", document_type: "Статус", created_at: "" },
  { id: "doc-4", name: "Подтверждение законного источника средств (2-НДФЛ / вклад)", description: "Справка о доходах не ниже прожиточного минимума", document_type: "Финансы", created_at: "" },
  { id: "doc-5", name: "Медицинское заключение об отсутствии опасных заболеваний", description: "Медосвидетельствование уполномоченной клиники", document_type: "Медицина", created_at: "" },
  { id: "doc-6", name: "Сертификат о знании русского языка, истории и права", description: "Или диплом СССР / РФ", document_type: "Образование", created_at: "" }
];

export const MOCK_FAQ: FAQItem[] = [
  { id: "faq-1", service_id: "srv-1", question: "Сколько действует ВНЖ в России?", answer: "С 2019 года ВНЖ в РФ выдается бессрочно, кроме высококвалифицированных специалистов.", sort_order: 1, is_active: true },
  { id: "faq-2", service_id: "srv-1", question: "Нужно ли каждый год подтверждать проживание?", answer: "Да, ежегодно необходимо подавать уведомление о подтверждении своего проживания в РФ в органы МВД.", sort_order: 2, is_active: true }
];

