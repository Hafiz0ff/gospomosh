<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🤖 Архитектурные правила и соглашения для AI-агентов (AGENTS.md)

Данный документ описывает структуру, правила разработки и стандарты безопасности проекта **«ГосПомощь»**.

---

## 1. Архитектура проекта

```text
├── app/
│   ├── actions/                   # Server Actions (submitQuestionnaireAction с валидацией)
│   ├── admin/                     # CRM-панель менеджера и маршрут авторизации (/admin/login)
│   ├── api/client/[id]/pdf/       # Route Handler генерации PDF анкеты клиента
│   ├── calculator/                # Интерактивный калькулятор пошлин
│   ├── client/questionnaire/      # 12-шаговая Единая анкета клиента
│   ├── documents/                 # Чек-лист проверки документов
│   ├── faq/                       # Аккордеон базы знаний 2026 года
│   ├── services/                  # Каталог и детальные страницы услуг
│   ├── wizard/[serviceSlug]/      # Пошаговый мастер подбора услуг
│   ├── globals.css                # Tailwind стили и CSS переменные тем оформления
│   └── layout.tsx                 # Root Layout с LanguageProvider и ThemeProvider
├── components/                    # Реиспользуемые React-компоненты (Header, Footer, ThemeSelector, LanguageSelector, ServiceCard)
├── lib/
│   ├── config.ts                  # Глобальная конфигурация приложения
│   ├── dataService.ts             # Сервисный слой работы с Supabase и Memory fallback
│   ├── languageContext.tsx        # Контекст переключения языков (RU / TJ)
│   ├── themeContext.tsx           # Контекст переключения 5 палитр оформления
│   ├── storageService.ts          # Модуль приватного хранилища и Signed URLs
│   ├── types.ts                   # TypeScript интерфейсы сущностей
│   ├── validation.ts              # Валидаторы ИНН, СНИЛС, телефонов, Email
│   └── questionnaireTranslations.ts # Словари переводов анкеты клиента
├── supabase/migrations/           # SQL-миграции базы данных и политик RLS
└── vercel.json                    # Конфигурация деплоя
```

---

## 2. Критические требования к безопасности (P0 Security)

1. **Никаких утечек PII:** Запрещен вывод конфиденциальных персональных данных клиентов (паспорта, ИНН, СНИЛС, телефоны) в консоль или открытые API.
2. **Изоляция неавторизованного доступа:** 
   * Доступ к таблицам `clients`, `client_profiles`, `passports`, `tax_identity`, `children`, `spouses`, `client_documents`, `client_communications`, `manager_tasks` разрешен **только для authenticated пользователей**.
   * Anonymous пользователи имеют право исключительно на публичный `INSERT` в `leads` и публичное чтение каталога `services`, `categories`, `faq`.
3. **Хранилище файлов:**
   * Все клиентские файлы хранятся в приватном бакете `client-documents`.
   * Прямые ссылки запрещены. Доступ разрешен только через Signed URLs с временем жизни до 300 секунд.
4. **Безопасность ключей:** `SUPABASE_SERVICE_ROLE_KEY` никогда не передается на клиент и не используется в кодовой базе фронтенда.

---

## 3. Стандарты кодирования и локализации

* **Двуязычность:** Любой новый UI-элемент или текст должен быть зарегистрирован в `lib/languageContext.tsx` на двух языках (Русский и Тоҷикӣ).
* **Бренд:** Название «ГосПомощь» и логотип «ГП» не переводятся и сохраняются в оригинальном виде.
* **Кодировка на Windows:** Все файлы должны сохраняться в кодировке **UTF-8 без BOM**. Для скриптов использовать явное открытие с `encoding='utf-8'`.
* **TypeScript:** Любые изменения должны успешно проходить проверку `npm run build` с 0 ошибок типов.
