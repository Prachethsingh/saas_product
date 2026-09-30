# Graph Report - saas_product  (2026-09-30)

## Corpus Check
- 63 files · ~29,029 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 375 nodes · 545 edges · 24 communities (14 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a37c09a`
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
- meetingdebt Design System
- next.config.mjs
- vercel.json
- meetingdebt DESIGN.md
- meetingdebt DESIGN.md
- meetingdebt DESIGN.md
- MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor
- meetingdebt Design System
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `LiquidGlassCard()` - 21 edges
2. `next` - 17 edges
3. `react` - 15 edges
4. `compilerOptions` - 15 edges
5. `meetingdebt Design System` - 13 edges
6. `lucide-react` - 12 edges
7. `meetingdebt DESIGN.md` - 11 edges
8. `meetingdebt DESIGN.md` - 11 edges
9. `meetingdebt DESIGN.md` - 11 edges
10. `getPostgresPool()` - 9 edges

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

## Communities (24 total, 10 thin omitted)

### Community 0 - "LiquidGlassCard"
Cohesion: 0.15
Nodes (22): LoginPage(), MeetingDetailPage(), DashboardPage(), PrivacyPolicyPage(), TermsOfServicePage(), GuideModalProps, MeetingCard(), MeetingCardProps (+14 more)

### Community 1 - "deploy-antideploy.mjs"
Cohesion: 0.07
Nodes (22): ref_child_process, ref_fs, ref_https, ref_os, ref_path, ref_url, config, configPath (+14 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (36): devDependencies, autoprefixer, @playwright/test, postcss, tailwindcss, @types/node, @types/pg, @types/react (+28 more)

### Community 3 - "server-db.ts"
Cohesion: 0.17
Nodes (19): POST(), GET(), POST(), RescoreSummary, runNightlyRescoreJob(), INITIAL_DEMO_MEETINGS, isPostgresConfigured, isSupabaseConfigured (+11 more)

### Community 4 - "providers.tsx"
Cohesion: 0.16
Nodes (14): POST(), app_globals, metadata, RootLayout(), viewport, DashboardNav(), DashboardNavProps, GuideModal() (+6 more)

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

### Community 9 - "meetingdebt Design System"
Cohesion: 0.06
Nodes (36): Animation & Motion, Anti-Patterns (Never Do), Badge / Chip, Base Grid: 4px, Border Radius, Brand Spec, Breakpoints, Button (+28 more)

### Community 16 - "meetingdebt DESIGN.md"
Cohesion: 0.07
Nodes (29): 10. Agent Prompt Guide, 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Depth & Elevation, 7. Animation & Motion (+21 more)

### Community 17 - "meetingdebt DESIGN.md"
Cohesion: 0.07
Nodes (27): 10. Agent Prompt Guide, 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Depth & Elevation, 7. Animation & Motion (+19 more)

### Community 18 - "meetingdebt DESIGN.md"
Cohesion: 0.07
Nodes (27): 10. Agent Prompt Guide, 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Depth & Elevation, 7. Animation & Motion (+19 more)

### Community 19 - "MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor"
Cohesion: 0.14
Nodes (13): 1. Install Dependencies, 2. Configure Environment (Optional for Local Demo), 3. Run Development Server, 🚢 Deploying to Production (Antideploy), 🚀 Getting Started, 🌐 Live Production Deployment, MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor, 📂 Repository Structure (+5 more)

## Knowledge Gaps
- **197 isolated node(s):** `handler`, `metadata`, `viewport`, `DashboardNavProps`, `GuideModalProps` (+192 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 231 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `LiquidGlassCard` to `package.json`, `server-db.ts`, `providers.tsx`, `[id]/route.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `react` connect `LiquidGlassCard` to `package.json`, `providers.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `handler`, `metadata`, `viewport` to the rest of the system?**
  _197 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LiquidGlassCard` be split into smaller, more focused modules?**
  _Cohesion score 0.14864864864864866 - nodes in this community are weakly interconnected._
- **Should `deploy-antideploy.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.07130124777183601 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._