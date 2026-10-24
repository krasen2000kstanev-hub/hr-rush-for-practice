# Graph Report - hr-rush-for-practice  (2026-10-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 388 nodes · 942 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `614f4e20`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- next
- ApplicationsTable.tsx
- cn
- package.json
- Button.tsx
- apply/route.ts
- Container
- compilerOptions
- dependencies
- .eslintrc.json
- next.config.mjs
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 33 edges
2. `next` - 31 edges
3. `Button()` - 26 edges
4. `Section()` - 21 edges
5. `Eyebrow()` - 20 edges
6. `Container()` - 20 edges
7. `lucide-react` - 20 edges
8. `trackEvent()` - 17 edges
9. `compilerOptions` - 17 edges
10. `react` - 16 edges

## Surprising Connections (you probably didn't know these)
- `onSubmit()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/login/page.tsx → lib/supabase/client.ts
- `Hero()` --calls--> `formatDate()`  [EXTRACTED]
  components/home/Hero.tsx → lib/utils.ts
- `Accordion()` --calls--> `cn()`  [EXTRACTED]
  components/ui/Accordion.tsx → lib/utils.ts
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  components/ui/Badge.tsx → lib/utils.ts
- `LoginForm()` --calls--> `Button()`  [EXTRACTED]
  app/admin/login/page.tsx → components/ui/Button.tsx

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "Button"
Cohesion: 0.08
Nodes (46): HomePage(), trackEvent(), AboutSection(), COMPANY_POINTS, STUDENT_POINTS, Companies(), CARDS, ContactSection() (+38 more)

### Community 1 - "next"
Cohesion: 0.08
Nodes (25): AdminApplicationDetailPage(), metadata, AdminDashboardLayout(), metadata, metadata, GET(), runtime, AdminMobileNav() (+17 more)

### Community 2 - "ApplicationsTable.tsx"
Cohesion: 0.10
Nodes (37): AdminApplicationsPage(), metadata, ApplicationDetail(), InfoRow(), labelize(), ApplicationsTable(), downloadCsv(), FilterSelect() (+29 more)

### Community 3 - "cn"
Cohesion: 0.10
Nodes (37): ApplyFormClient(), DEFAULT_VALUES, STEP_TITLES, SubmitState, StepEducation(), StepFinal(), StepPersonalInfo(), StepPreferences() (+29 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (42): devDependencies, autoprefixer, dotenv, eslint, eslint-config-next, postcss, tailwindcss, tsx (+34 more)

### Community 5 - "Button.tsx"
Cohesion: 0.10
Nodes (26): AdminLoginPage(), LoginForm(), onSubmit(), manrope, metadata, RootLayout(), Analytics(), AnalyticsEvent (+18 more)

### Community 6 - "apply/route.ts"
Cohesion: 0.12
Nodes (20): isValidCvFile(), jsonError(), POST(), runtime, sanitizeFilename(), ACCEPTED_CV_EXTENSIONS, ACCEPTED_CV_MIME_TYPES, CV_STORAGE_BUCKET (+12 more)

### Community 7 - "Container"
Cohesion: 0.14
Nodes (18): AdminDashboardPage(), getCounts(), metadata, STATUS_ICON, ApplyPage(), metadata, ApplySuccessPage(), metadata (+10 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, clsx, googleapis, @hookform/resolvers, lucide-react, next, react, react-dom (+5 more)

### Community 10 - ".eslintrc.json"
Cohesion: 0.40
Nodes (4): extends, rules, @next/next/no-img-element, next/core-web-vitals

## Knowledge Gaps
- **11 isolated node(s):** `next/core-web-vitals`, `autoprefixer`, `eslint`, `eslint-config-next`, `postcss` (+6 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Button`, `ApplicationsTable.tsx`, `cn`, `package.json`, `Button.tsx`, `apply/route.ts`, `Container`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `autoprefixer`, `eslint` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07587382779198636 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Button` to `next`, `ApplicationsTable.tsx`, `cn`, `package.json`, `Button.tsx`, `Container`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.07678075855689177 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Button`, `next`, `ApplicationsTable.tsx`, `Button.tsx`, `apply/route.ts`, `Container`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `ApplicationsTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09528214616096208 - nodes in this community are weakly interconnected._
