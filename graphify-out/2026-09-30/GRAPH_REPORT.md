# Graph Report - saas_product  (2026-09-30)

## Corpus Check
- 52 files · ~21,400 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 234 nodes · 416 edges · 16 communities (12 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a8e55e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LiquidGlassCard
- deploy-antideploy.mjs
- package.json
- server-db.ts
- providers.tsx
- [id]/route.ts
- compilerOptions
- dependencies
- scoring.ts
- pricing-modal.tsx
- next.config.mjs
- MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor
- rules/graphify.md
- workflows/graphify.md
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `LiquidGlassCard()` - 21 edges
2. `next` - 18 edges
3. `react` - 17 edges
4. `compilerOptions` - 15 edges
5. `lucide-react` - 14 edges
6. `getPostgresPool()` - 9 edges
7. `MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor` - 9 edges
8. `runNightlyRescoreJob()` - 8 edges
9. `MeetingRecord` - 8 edges
10. `getMeetingById()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getMeetings()`  [EXTRACTED]
  app/api/meetings/route.ts → lib/server-db.ts
- `POST()` --calls--> `runNightlyRescoreJob()`  [EXTRACTED]
  app/api/calendar/sync/route.ts → jobs/rescore.ts
- `GET()` --calls--> `runNightlyRescoreJob()`  [EXTRACTED]
  app/api/cron/rescore/route.ts → jobs/rescore.ts
- `GET()` --calls--> `calculateZombieScore()`  [EXTRACTED]
  app/api/meetings/[id]/route.ts → lib/scoring.ts
- `POST()` --calls--> `postSlackMessage()`  [EXTRACTED]
  app/api/slack/draft/route.ts → lib/slack.ts

## Import Cycles
- None detected.

## Communities (16 total, 4 thin omitted)

### Community 0 - "LiquidGlassCard"
Cohesion: 0.14
Nodes (24): LoginPage(), MeetingDetailPage(), DashboardPage(), PrivacyPolicyPage(), TermsOfServicePage(), GuideModalProps, MeetingCard(), MeetingCardProps (+16 more)

### Community 1 - "deploy-antideploy.mjs"
Cohesion: 0.10
Nodes (19): ref_child_process, ref_fs, ref_https, ref_os, ref_path, ref_url, antideployJsonPath, archiveData (+11 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, scripts, build, deploy:antideploy, dev, lint, start (+18 more)

### Community 3 - "server-db.ts"
Cohesion: 0.17
Nodes (19): POST(), GET(), POST(), RescoreSummary, runNightlyRescoreJob(), INITIAL_DEMO_MEETINGS, isPostgresConfigured, isSupabaseConfigured (+11 more)

### Community 4 - "providers.tsx"
Cohesion: 0.21
Nodes (11): app_globals, metadata, RootLayout(), viewport, DashboardNav(), DashboardNavProps, GuideModal(), MobileDock() (+3 more)

### Community 5 - "[id]/route.ts"
Cohesion: 0.20
Nodes (14): handler, GET(), PATCH(), GET(), POST(), authOptions, getMeetingById(), updateMeetingStatus() (+6 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 7 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, clsx, date-fns, lucide-react, next, next-auth, pg, react (+5 more)

### Community 8 - "scoring.ts"
Cohesion: 0.24
Nodes (6): CalendarEventInstance, hashString(), mapGoogleEventsToOccurrences(), OccurrenceInput, ScoreBreakdown, ScoreResult

### Community 9 - "pricing-modal.tsx"
Cohesion: 0.39
Nodes (5): POST(), PricingModalProps, createCheckoutSession(), PLANS, stripe

### Community 19 - "MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor"
Cohesion: 0.14
Nodes (13): 1. Install Dependencies, 2. Configure Environment (Optional for Local Demo), 3. Run Development Server, 🚢 Deploying to Production (Antideploy), 🚀 Getting Started, 🌐 Live Production Deployment, MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor, 📂 Repository Structure (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, @playwright/test, postcss, tailwindcss, @types/node, @types/pg, @types/react (+2 more)

## Knowledge Gaps
- **104 isolated node(s):** `handler`, `metadata`, `viewport`, `DashboardNavProps`, `GuideModalProps` (+99 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 125 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `LiquidGlassCard` to `package.json`, `server-db.ts`, `providers.tsx`, `[id]/route.ts`, `pricing-modal.tsx`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `react` connect `LiquidGlassCard` to `pricing-modal.tsx`, `package.json`, `providers.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `handler`, `metadata`, `viewport` to the rest of the system?**
  _104 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LiquidGlassCard` be split into smaller, more focused modules?**
  _Cohesion score 0.1358974358974359 - nodes in this community are weakly interconnected._
- **Should `deploy-antideploy.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._