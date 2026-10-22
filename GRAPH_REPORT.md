# Graph Report - hr-rush-for-practice  (2026-10-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 414 nodes · 980 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c187086`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- cn
- applicationSchema.ts
- package.json
- next
- ApplicationsTable.tsx
- app.mjs
- Container
- apply/route.ts
- compilerOptions
- devDependencies
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
- `handleSave()` --calls--> `createClient()`  [EXTRACTED]
  components/admin/ApplicationDetail.tsx → lib/supabase/client.ts
- `Hero()` --calls--> `formatDate()`  [EXTRACTED]
  components/home/Hero.tsx → lib/utils.ts
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  components/ui/Badge.tsx → lib/utils.ts
- `LoginForm()` --calls--> `Button()`  [EXTRACTED]
  app/admin/login/page.tsx → components/ui/Button.tsx
- `ApplySuccessPage()` --calls--> `Button()`  [EXTRACTED]
  app/apply/success/page.tsx → components/ui/Button.tsx

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "Button"
Cohesion: 0.08
Nodes (45): HomePage(), AnalyticsEvent, trackEvent(), Window, AboutSection(), COMPANY_POINTS, STUDENT_POINTS, Companies() (+37 more)

### Community 1 - "cn"
Cohesion: 0.08
Nodes (38): AdminDashboardLayout(), metadata, AdminLoginPage(), LoginForm(), onSubmit(), manrope, metadata, RootLayout() (+30 more)

### Community 2 - "applicationSchema.ts"
Cohesion: 0.08
Nodes (45): ApplyPage(), metadata, ApplyFormClient(), DEFAULT_VALUES, STEP_TITLES, SubmitState, StepEducation(), StepFinal() (+37 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (41): dependencies, clsx, googleapis, @hookform/resolvers, lucide-react, next, react, react-dom (+33 more)

### Community 4 - "next"
Cohesion: 0.09
Nodes (20): AdminApplicationDetailPage(), metadata, metadata, GET(), runtime, analyticsEnv, env, googleSheetsEnv (+12 more)

### Community 5 - "ApplicationsTable.tsx"
Cohesion: 0.11
Nodes (31): AdminApplicationsPage(), metadata, ApplicationDetail(), handleSave(), InfoRow(), labelize(), ApplicationsTable(), downloadCsv() (+23 more)

### Community 6 - "app.mjs"
Cohesion: 0.13
Nodes (22): dependencies, @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb, name, private, type, adminHistory(), cell() (+14 more)

### Community 7 - "Container"
Cohesion: 0.17
Nodes (15): AdminDashboardPage(), getCounts(), metadata, STATUS_ICON, ApplySuccessPage(), metadata, CookiePolicyPage(), metadata (+7 more)

### Community 8 - "apply/route.ts"
Cohesion: 0.15
Nodes (17): isValidCvFile(), jsonError(), POST(), runtime, sanitizeFilename(), ACCEPTED_CV_EXTENSIONS, ACCEPTED_CV_MIME_TYPES, CV_STORAGE_BUCKET (+9 more)

### Community 9 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, dotenv, eslint, eslint-config-next, postcss, tailwindcss, tsx (+4 more)

### Community 11 - ".eslintrc.json"
Cohesion: 0.40
Nodes (4): extends, rules, @next/next/no-img-element, next/core-web-vitals

## Knowledge Gaps
- **11 isolated node(s):** `next/core-web-vitals`, `autoprefixer`, `eslint`, `eslint-config-next`, `postcss` (+6 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 158 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Button`, `cn`, `applicationSchema.ts`, `package.json`, `ApplicationsTable.tsx`, `Container`, `apply/route.ts`?**
  _High betweenness centrality (0.202) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `autoprefixer`, `eslint` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07638279192273925 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `cn` to `Button`, `applicationSchema.ts`, `package.json`, `next`, `ApplicationsTable.tsx`, `Container`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.08215488215488216 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Button`, `applicationSchema.ts`, `ApplicationsTable.tsx`, `Container`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `applicationSchema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07609427609427609 - nodes in this community are weakly interconnected._