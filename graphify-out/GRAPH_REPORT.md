# Graph Report - saas_product  (2026-09-30)

## Corpus Check
- 66 files · ~31,014 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 381 nodes · 560 edges · 25 communities (15 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c1f68da`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LiquidGlassCard
- deploy-antideploy.mjs
- package.json
- server-db.ts
- pricing-modal.tsx
- slack.ts
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
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `LiquidGlassCard()` - 21 edges
2. `next` - 18 edges
3. `react` - 17 edges
4. `compilerOptions` - 15 edges
5. `lucide-react` - 14 edges
6. `meetingdebt Design System` - 13 edges
7. `meetingdebt DESIGN.md` - 11 edges
8. `meetingdebt DESIGN.md` - 11 edges
9. `meetingdebt DESIGN.md` - 11 edges
10. `getPostgresPool()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `runNightlyRescoreJob()`  [EXTRACTED]
  app/api/calendar/sync/route.ts → jobs/rescore.ts
- `GET()` --calls--> `runNightlyRescoreJob()`  [EXTRACTED]
  app/api/cron/rescore/route.ts → jobs/rescore.ts
- `GET()` --calls--> `generateSlackDraft()`  [EXTRACTED]
  app/api/meetings/[id]/route.ts → lib/slack.ts
- `GET()` --calls--> `getMeetings()`  [EXTRACTED]
  app/api/meetings/route.ts → lib/server-db.ts
- `POST()` --calls--> `getMeetingById()`  [EXTRACTED]
  app/api/slack/draft/route.ts → lib/server-db.ts

## Import Cycles
- None detected.

## Communities (25 total, 10 thin omitted)

### Community 0 - "LiquidGlassCard"
Cohesion: 0.10
Nodes (32): app_globals, metadata, RootLayout(), viewport, LoginPage(), MeetingDetailPage(), DashboardPage(), PrivacyPolicyPage() (+24 more)

### Community 1 - "deploy-antideploy.mjs"
Cohesion: 0.07
Nodes (22): ref_child_process, ref_fs, ref_https, ref_os, ref_path, ref_url, config, configPath (+14 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, scripts, build, deploy:antideploy, dev, lint, start (+18 more)

### Community 3 - "server-db.ts"
Cohesion: 0.11
Nodes (30): handler, POST(), GET(), GET(), PATCH(), GET(), POST(), MeetingCardProps (+22 more)

### Community 4 - "pricing-modal.tsx"
Cohesion: 0.39
Nodes (5): POST(), PricingModalProps, createCheckoutSession(), PLANS, stripe

### Community 5 - "slack.ts"
Cohesion: 0.46
Nodes (6): POST(), generateSlackDraft(), postSlackMessage(), sendSlackWebhook(), SlackDraftMessage, SlackDraftParams

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

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, @playwright/test, postcss, tailwindcss, @types/node, @types/pg, @types/react (+2 more)

## Knowledge Gaps
- **199 isolated node(s):** `handler`, `metadata`, `viewport`, `DashboardNavProps`, `GuideModalProps` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 233 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `LiquidGlassCard` to `package.json`, `server-db.ts`, `pricing-modal.tsx`, `slack.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `react` connect `LiquidGlassCard` to `package.json`, `pricing-modal.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `handler`, `metadata`, `viewport` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LiquidGlassCard` be split into smaller, more focused modules?**
  _Cohesion score 0.10105580693815988 - nodes in this community are weakly interconnected._
- **Should `deploy-antideploy.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.07130124777183601 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._