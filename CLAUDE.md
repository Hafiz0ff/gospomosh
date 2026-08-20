# 🤖 Claude Developer Guide (CLAUDE.md)

Руководство для LLM-агентов (Claude, Antigravity, Copilot) по работе с проектом **«ГосПомощь»**.

---

## 📌 Основные команды для разработки

* **Запуск локального dev-сервера:** `npm run dev` (порт 3000)
* **Сборка проекта (TypeCheck + Bundle):** `npm run build`
* **Линтинг кода:** `npm run lint`

---

## 🎨 Система динамических тем (5 палитр)

Темы управляются через `lib/themeContext.tsx` и применяются через CSS-переменные в `:root`:
* `--color-primary`, `--color-secondary`, `--color-accent`
* `--color-bg`, `--color-card`, `--color-text-main`, `--color-border`

Всегда используйте классы Tailwind или CSS-переменные вместо жестко захардкоженных hex-цветов в компонентах, чтобы не нарушать переключение тем.

---

## 🌐 Мультиязычность (Bilingual RU / TJ)

* Контекст: `useLanguage()` из `@/lib/languageContext`.
* Активный код таджикского языка: `tg` (на бейдже отображается `TJ`).
* При добавлении новых текстов дополняйте интерфейс `Translations` и словарь `TRANSLATIONS` в `lib/languageContext.tsx`.

---

## 🗄️ Взаимодействие с базой данных и Storage

* Все обращения к Supabase инкапсулированы в `lib/dataService.ts` и `lib/storageService.ts`.
* Для работы без подключенной БД реализован автоматический in-memory fallback с эталонными вымышленными демо-клиентами (Иванов, Петрова, Саидов).
