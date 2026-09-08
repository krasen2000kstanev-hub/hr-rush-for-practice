# HR:RUSH FOR PRACTICE — уебсайт

Production-ready сайт за инициативата **HR:RUSH FOR PRACTICE**: публичен сайт с
формуляр за кандидатстване, Supabase база данни и Storage за CV-та, и защитен
административен панел за преглед и управление на кандидатурите.

Технологии: **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase
(Database + Auth + Storage) · React Hook Form · Zod**.

---

## Съдържание

1. [Стартиране на проекта локално](#1-стартиране-на-проекта-локално)
2. [Създаване на Supabase проект](#2-създаване-на-supabase-проект)
3. [Създаване на таблиците (миграция)](#3-създаване-на-таблиците-миграция)
4. [Конфигуриране на `.env`](#4-конфигуриране-на-env)
5. [Създаване на admin потребител](#5-създаване-на-admin-потребител)
6. [Активиране на Google Sheets интеграцията](#6-активиране-на-google-sheets-интеграцията)
7. [Deploy на сайта](#7-deploy-на-сайта)
8. [Добавяне на ментори](#8-добавяне-на-ментори)
9. [Добавяне на компании](#9-добавяне-на-компании)
10. [Добавяне на университети](#10-добавяне-на-университети)
11. [Смяна на активния сезон](#11-смяна-на-активния-сезон)
12. [Структура на проекта](#12-структура-на-проекта)
13. [Сигурност — какво е вградено](#13-сигурност--какво-е-вградено)
14. [Известни ограничения / следващи стъпки](#14-известни-ограничения--следващи-стъпки)

---

## 1. Стартиране на проекта локално

Изисквания: **Node.js 18.18+** и npm.

```bash
npm install
cp .env.example .env      # после попълни стойностите — виж стъпка 4
npm run dev
```

Сайтът тръгва на [http://localhost:3000](http://localhost:3000).

Полезни команди:

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build        # production build
npm run start        # стартира build-натия сайт
```

> **Забележка:** докато `.env` не е попълнен с реални Supabase стойности,
> публичният сайт зарежда нормално, но формата за кандидатстване и
> административният панел ще показват ясно съобщение, че Supabase не е
> конфигуриран, вместо да гърмят с грешка.

---

## 2. Създаване на Supabase проект

1. Отиди на [supabase.com](https://supabase.com/) → **New project**.
2. Избери организация, име (напр. `hr-rush-for-practice`), парола за базата
   данни и регион (най-добре най-близкият до основната ви аудитория, напр.
   `eu-central-1`).
3. След като проектът се създаде, отиди в **Settings → API** и копирай:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (пази го в тайна!)

---

## 3. Създаване на таблиците (миграция)

SQL файлът е в [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
и създава:

- таблица `student_applications` (кандидатурите) с индекси и constraints;
- таблица `admins` (списък с администратори) + helper функция `is_admin()`;
- Row Level Security policies (публични потребители могат само да INSERT-ват;
  само admins могат да четат/обновяват);
- частен Storage bucket `cv-uploads` за автобиографиите.

**Как да я пуснеш:**

- Най-лесно: Supabase Dashboard → **SQL Editor** → постави съдържанието на
  файла → **Run**.
- Или през Supabase CLI:

  ```bash
  supabase link --project-ref <your-project-ref>
  supabase db push
  ```

След това, ако искаш TypeScript типовете да се генерират автоматично от
реалната схема (вместо ръчно написаните в `types/database.ts`):

```bash
supabase gen types typescript --project-id <your-project-ref> > types/database.ts
```

---

## 4. Конфигуриране на `.env`

Копирай `.env.example` в `.env` и попълни:

| Променлива | Задължителна | Описание |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL на Supabase проекта |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Публичен anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Таен service role key — **само сървър** |
| `NEXT_PUBLIC_SITE_URL` | препоръчително | Пълен production URL, за SEO/OG/sitemap |
| `NEXT_PUBLIC_GA_ID` | не | Google Analytics 4 Measurement ID (`G-XXXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | не | Meta (Facebook) Pixel ID |
| `GOOGLE_SHEETS_ENABLED` | не | `true`/`false` — виж стъпка 6 |
| `GOOGLE_SHEET_ID` | не | ID на Google Sheet-а |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | не | Имейл на service account-а |
| `GOOGLE_PRIVATE_KEY` | не | Частен ключ на service account-а |

Никакви реални credentials не са включени в repo-то — `.env` е в
`.gitignore`.

---

## 5. Създаване на admin потребител

**В сайта няма и никога не трябва да има публична форма за регистрация на
администратори** — това е съзнателно архитектурно решение (виж миграцията).
Администраторски акаунти се създават по два начина:

### Вариант А — с включения скрипт (препоръчително)

```bash
npm run create-admin -- --email admin@example.com --password "StrongPass123!" --name "Име Фамилия"
```

Скриптът ([`scripts/create-admin.ts`](./scripts/create-admin.ts)) създава
Supabase Auth потребител и автоматично го добавя в таблицата `admins`.

### Вариант Б — ръчно през Supabase Dashboard

1. **Authentication → Users → Add user** → въведи имейл и парола.
2. **SQL Editor** → изпълни:

   ```sql
   insert into public.admins (user_id, full_name)
   values ('<user-id-от-стъпка-1>', 'Име Фамилия');
   ```

### Вход в админ панела

Отиди на `/admin/login` (напр. `https://hrrushforpractice.com/admin/login`)
и влез с имейла и паролата от горе. `/admin/*` е защитено от `middleware.ts`
— неавторизирани посетители автоматично се пренасочват към `/admin/login`.

---

## 6. Активиране на Google Sheets интеграцията

По подразбиране изключена (`GOOGLE_SHEETS_ENABLED=false`) — Supabase остава
единственият source of truth. Ако искаш всяка нова кандидатура да се
добавя автоматично и в Google Sheet:

1. Създай Google Cloud проект → активирай **Google Sheets API**.
2. Създай **Service Account** → генерирай JSON ключ.
3. Създай Google Sheet и го сподели (Share) с имейла на service account-а
   с права **Editor**.
4. Попълни в `.env`:
   ```env
   GOOGLE_SHEETS_ENABLED=true
   GOOGLE_SHEET_ID=<ID-то от URL-а на sheet-а>
   GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account>@<project>.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
   (Запази `\n` последователностите буквално — кодът ги превръща в истински
   нови редове при зареждане, виж `lib/env.ts`.)

Синхронизацията е **best-effort и никога не блокира кандидатурата** — ако
Google Sheets заявката се провали или credentials липсват, кандидатурата пак
се записва нормално в Supabase (виж `lib/googleSheets.ts`).

---

## 7. Deploy на сайта

Препоръчително: **Vercel** (нативна поддръжка на Next.js App Router).

1. Push-ни repo-то в GitHub/GitLab.
2. Import-ни проекта във Vercel.
3. Добави всички environment variables от `.env` в Vercel → Project
   Settings → Environment Variables (за Production и Preview).
4. Deploy.

Сайтът работи и на всяка друга платформа, поддържаща Next.js
(Netlify, Railway, self-hosted Node сървър и т.н.) — единствената
предпоставка е Node.js 18.18+ среда.

---

## 8. Добавяне на ментори

Редактирай [`data/mentors.ts`](./data/mentors.ts) — масив от обекти
(`name`, `position`, `company`, `bio`, `photoUrl`, `linkedinUrl`). Качи
снимки в `public/photos/mentors/` и посочи пътя в `photoUrl`. Промените се
виждат веднага след redeploy — не изисква промяна в базата данни.

## 9. Добавяне на компании

Редактирай [`data/companies.ts`](./data/companies.ts). Качи лога в
`public/logos/companies/`.

## 10. Добавяне на университети

Редактирай [`data/universities.ts`](./data/universities.ts). Качи лога в
`public/logos/universities/`. Имената тук се показват и като опции в
dropdown-а на формата за кандидатстване — избирането на „Друг университет“
винаги остава налично (`OTHER_UNIVERSITY_VALUE`).

## 11. Смяна на активния сезон

Отвори [`data/config.ts`](./data/config.ts) и промени:

```ts
export const CURRENT_SEASON = "Season 10";
export const SEASON_DATES = { start: "2027-11-03", end: "2028-01-04" };
```

Това автоматично:

- сменя стойността, показвана в hero секцията и на всички нови кандидатури;
- **не променя** `season` на вече съществуващи кандидатури — те си остават с
  оригиналния сезон, в който са кандидатствали (важно за филтрирането в
  админ панела по сезон).

Ако искаш и default стойността в базата данни (за insert-и, направени извън
приложението) да се обнови, изпълни допълнително в SQL Editor:

```sql
alter table public.student_applications
  alter column season set default 'Season 10';
```

---

## 12. Структура на проекта

```
app/                      Next.js App Router страници и API routes
  admin/(dashboard)/      Защитен admin панел (табло, кандидатури, детайли)
  admin/login/            Admin login страница
  api/apply/              POST endpoint за формата за кандидатстване
  api/admin/cv/[id]/      Signed URL redirect за сваляне на CV (admin-only)
  apply/                  Публична multi-step форма + success страница
components/
  layout/                 Header, Footer, мобилно меню, лого
  ui/                     Бутони, секции, accordion, animated counter...
  home/                   Всички секции на началната страница
  forms/                  Стъпките на формата за кандидатстване + споделени input-и
  admin/                  Таблица с кандидатури, детайлен изглед, sidebar
  analytics/              GA4 / Meta Pixel + helper за проследяване на събития
data/                     Централизирано, лесно редактируемо съдържание
  (mentors, universities, companies, faq, stats, nav, config/season...)
lib/                      Supabase клиенти, валидация (Zod), CSV, rate limit,
                          Google Sheets интеграция, помощни функции
types/                    Споделени TypeScript типове + database.ts
supabase/migrations/      SQL миграция (таблици, RLS, storage bucket)
scripts/create-admin.ts   CLI за създаване на admin потребител
```

---

## 13. Сигурност — какво е вградено

- **Row Level Security**: анонимни потребители могат само да `INSERT`-ват в
  `student_applications`; четенето и обновяването изискват автентикация И
  членство в таблицата `admins` (проверено през `is_admin()`).
- **Частен Storage bucket** за CV-та — няма публичен URL; достъп само през
  сървърен route с service role key, след проверка за admin достъп.
- **Валидация на два нива**: Zod схема на клиента (стъпка по стъпка) и
  същата логика отново на сървъра в `/api/apply`, преди всякакъв запис.
- **Honeypot поле** (`companyWebsite`) — скрито от истински потребители;
  ботовете, които го попълват, получават фалшив "успех" отговор без реален
  запис.
- **Rate limiting** на `/api/apply` (in-memory, per IP) — виж бележката в
  `lib/rateLimit.ts` за препоръка към Redis-базирано решение при по-голям
  трафик.
- **Дубликати**: case-insensitive проверка по имейл (уникален индекс в
  базата) и проверка по телефон, преди всеки нов запис.
- **Service role key** се използва само в server-only файлове
  (`lib/supabase/admin.ts`, маркиран с `import "server-only"`) — Next.js
  ще гръмне build-а, ако някой случайно го import-не в клиентски код.
- **Защитени admin routes** през `middleware.ts` + повторна проверка в
  `lib/supabase/adminAuth.ts` на ниво Server Component.

---

## 14. Известни ограничения / следващи стъпки

Тъй като този проект е разработен в изолирана среда без достъп до
публичния npm registry, **не е било възможно да се изпълни `npm install` /
`npm run build` в тази среда**, за да се тества "на живо". Кодът е написан
внимателно и коректно спрямо Next.js 14 / React 18 / TypeScript API-тата,
но: **преди първия истински deploy, задължително пусни локално:**

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

и поправи всичко, което евентуално изскочи (най-вероятно дребни несъответствия
във версиите на пакетите, ако решиш да ги обновиш).

Други препоръчани следващи стъпки:

- Замени placeholder логата/снимките в `public/` с реални brand assets.
- Дай юридически преглед на `/privacy-policy` и `/cookie-policy` (в момента
  са добре структурирани, но общи шаблони).
- При над няколко хиляди кандидатури — премини `admin/applications` от
  зареждане "всичко наведнъж" към сървърна пагинация (индексите вече го
  поддържат).
- Замени in-memory rate limiter с Upstash Redis (или подобно) при deploy
  върху множество serverless инстанции.
