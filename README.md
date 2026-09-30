# MeetingDebt — Zombie-Meeting Score & Calendar Auditor

[![Live Demo](https://img.shields.io/badge/Live%20Demo-saas--product.antideploy.com-emerald?style=for-the-badge&logo=vercel)](https://saas-product.antideploy.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Prachethsingh%2Fsaas__product-blue?style=for-the-badge&logo=github)](https://github.com/Prachethsingh/saas_product)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Deployment](https://img.shields.io/badge/Deploy-Antideploy-6366f1?style=for-the-badge)](https://antideploy.com)

> **B2B SaaS tool for Engineering Managers & Ops Leads.** Connects read-only to Google Calendar, analyzes attendance decay, detects stale agendas, scores recurring meetings (0–100), and auto-drafts data-backed Slack messages to kill, shorten, or async-ize them.

---

## 🌐 Live Production Deployment

- **Live URL**: [https://saas-product.antideploy.com](https://saas-product.antideploy.com)
- **Deployment Dashboard**: [Antideploy Console](https://antideploy.com/app/cee70017-5498-4fd1-9ad7-fd238e45f509)
- **Deploy Command**:
  ```bash
  npm run deploy:antideploy
  ```
  Antideploy automatically detects the Next.js runtime, builds the container, and provisions database variables (`DATABASE_URL`).

---

## 🎯 The Problem & Value Proposition

Recurring meetings decay silently over time. While initial kickoff meetings have 100% participation, months later they become low-yield check-ins where:
- Attendance drops from 12 engineers down to 3 passive attendees.
- Calendar descriptions are never updated ("weekly sync & status updates" copied forever).
- Decisions are rarely made, turning into a multi-thousand dollar weekly burn.
- **Nobody wants to be the "bad guy" who cancels the meeting.**

**MeetingDebt solves this by providing empirical arithmetic backing.** When an EM or Ops Lead sees an **84/100 Zombie Score** and **$38,760/yr in burned engineering hours**, MeetingDebt generates a polite, data-driven Slack proposal that the team gladly accepts.

---

## 🧮 The Zombie Scoring Algorithm

$$\text{Score} = 0.30 \cdot D_{\text{attendance}} + 0.20 \cdot S_{\text{agenda}} + 0.25 \cdot T_{\text{skew}} + 0.15 \cdot (1 - R_{\text{decision}}) + 0.10 \cdot R_{\text{decline}}$$

All sub-scores are normalized between $0.00$ and $1.00$ before weighting:

| Signal | Weight | Logic & Metric |
| :--- | :---: | :--- |
| **1. Attendance Decay** | **30%** | Trend over last 8 occurrences: `(early_avg_attendees - recent_avg_attendees) / early_avg_attendees` |
| **2. Agenda Staleness** | **20%** | Unchanged or empty calendar description hash $N$ times consecutively |
| **3. Talk-Time Skew** | **25%** | If top 1–2 speakers account for >70% speech (*v2 transcript opt-in; reweighted proportionally in v1 MVP*) |
| **4. Duration-to-Decision Ratio** | **15%** | Meeting length vs action items logged (low output relative to time invested penalizes score) |
| **5. Decline / Reschedule Rate** | **10%** | Percentage of instances moved or declined over the last 90 days |

### Threshold Actions:
- **70–100 ("Kill it")**: Proposes complete cancellation or transition to an async Monday Slack check-in thread. Auto-drafts formatted Slack message.
- **40–69 ("Shorten")**: Suggests trimming meeting duration (e.g. 60m $\to$ 25m, or 30m $\to$ 15m) and mandating a 3-bullet pre-meeting agenda.
- **<40 ("Healthy")**: High attendance, regular action items; no intervention needed.
- **Cold-Start / Observation Mode**: Meetings with $<6$ recorded occurrences are tagged in **Observation Mode** to eliminate false positives and build data trust.

---

## 🛠️ Stack & Architecture

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Lucide Icons + Apple San Francisco Typography + Golden Ratio Grid
- **Backend**: Next.js 14 API Route Handlers (`/api/calendar/sync`, `/api/cron/rescore`, `/api/slack/draft`, `/api/stripe/checkout`, `/api/stripe/webhook`)
- **Hosting & CI/CD**: [Antideploy](https://antideploy.com) (Containerized Node.js runtime)
- **Database**: Antideploy Built-in PostgreSQL 17 (Auto-provisioned via `DATABASE_URL`, connection pooled via `pg`, auto-migrated schema)
- **Authentication**: `next-auth` (`^4.24.11`) dependency with Google OAuth provider (`calendar.readonly` scope, JWT offline refresh)
- **Payments**: `stripe` (`^17.6.0`) dependency with Stripe Checkout & Webhook listeners (`$15/seat/mo` Manager Pro, `$299/mo` Flat Org Tier)
- **Scoring Engine**: `lib/scoring.ts`
- **Nightly Worker**: Antideploy Scheduled Tasks (`jobs/rescore.ts`)
- **Slack Messaging**: Slack App + Bolt SDK / Webhooks (`lib/slack.ts`)

---

## 📂 Repository Structure

```
saas_product/
├── .antideploy.json                   # Antideploy application configuration
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts# Google OAuth login handler
│   │   ├── calendar/sync/route.ts     # Google Calendar sync API
│   │   ├── cron/rescore/route.ts      # Nightly rescore cron job
│   │   ├── meetings/route.ts          # Meeting list & executive totals API (Postgres)
│   │   ├── meetings/[id]/route.ts     # Meeting deep dive & status mutation API (Postgres)
│   │   ├── slack/draft/route.ts       # Slack draft generator & 1-click dispatch API
│   │   ├── stripe/checkout/route.ts   # Stripe checkout session generator
│   │   └── stripe/webhook/route.ts    # Stripe subscription webhook
│   ├── login/page.tsx                 # Google Workspace OAuth authentication page
│   ├── meetings/[id]/page.tsx         # Deep-dive decay curve, formula breakdown, Slack draft
│   ├── privacy/page.tsx               # Compliance & Google API privacy policy
│   ├── terms/page.tsx                 # SaaS terms of service
│   ├── globals.css                    # Serene sky glassmorphism tokens & Golden Ratio grid
│   ├── layout.tsx                     # Root HTML layout with providers & dock
│   └── page.tsx                       # Main audit dashboard, filters & simulator
├── components/
│   ├── dashboard-nav.tsx              # Top bar, sync button, pricing trigger
│   ├── guide-modal.tsx                # Methodology & audit formula reference modal
│   ├── meeting-card.tsx               # Rich meeting card with financial burn badge
│   ├── meeting-simulator.tsx          # Real-time schedule impact calculator
│   ├── mobile-dock.tsx                # Floating frosted dock for mobile navigation
│   ├── pricing-modal.tsx              # Stripe Manager ($15/mo) and Org ($299/mo) plans
│   ├── providers.tsx                  # Global client providers and modal orchestrator
│   ├── score-badge.tsx                # Zombie score visual indicator (0-100)
│   ├── slack-modal.tsx                # Interactive Slack preview & one-click dispatch
│   ├── vitals-hero.tsx                # Daily Vitals & Stress Level hero (Golden Ratio 1.618 : 1)
│   └── ui/liquid-glass.tsx            # Serene frosted glass card & pill components
├── db/
│   └── schema.sql                     # Postgres reference schema & views
├── jobs/
│   └── rescore.ts                     # Scheduled rescoring job (Postgres backed)
├── lib/
│   ├── auth.ts                        # NextAuth Google provider setup
│   ├── db.ts                          # Client-safe models & initial demo dataset
│   ├── google-calendar.ts             # Google Calendar API event parser & token refresh
│   ├── postgres.ts                    # Antideploy PostgreSQL pool, auto-migration & queries
│   ├── scoring.ts                     # Mathematical zombie score formula
│   ├── server-db.ts                   # Unified database coordinator
│   ├── slack.ts                       # Bolt SDK & Slack Block Kit auto-draft generator
│   └── stripe.ts                      # Stripe SDK, pricing plans & checkout
├── migrations/
│   └── 001_initial_schema.sql         # Antideploy Postgres migration
├── scripts/
│   └── deploy-antideploy.mjs          # Standalone Antideploy packaging & deploy pipeline
├── tests/
│   └── white-liquid-ui.spec.js        # Playwright visual & interactive test suite
├── .env.local.example                 # Environment configuration template
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Local Demo)
```bash
cp .env.local.example .env.local
```
*Note: MeetingDebt includes an instant high-fidelity demo dataset out of the box, allowing full testing of the dashboard, decay curves, Slack auto-drafts, and calculator without external API keys.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Core Features

1. **Dashboard & Score Filters**: Filter by `Sunset (70+)`, `Shorten (40-69)`, `Healthy (<40)`, or `Baseline Calibration`.
2. **Loaded Rate Slider**: Drag the hourly rate slider ($50–$150/hr) to watch company burn rate calculations update dynamically.
3. **Decay Curve Drilldown**: Click **"View Occurrence History"** on any meeting (e.g. *Weekly Cross-Functional Status Sync*) to inspect:
   - Historical acceptance vs decline bar chart over time.
   - The exact mathematical sub-scores: Attendance Decay ($88\%$), Agenda Staleness ($100\%$), Decision Ratio ($95\%$ penalty).
   - The occurrence audit table flagging stale agenda hashes.
4. **Slack Auto-Draft**: Click **"Draft Slack Notice"** to preview the pre-composed proposal. Copy it to your clipboard or send it directly via an incoming Slack Webhook.
5. **Calendar Sync**: Test the rescoring engine manually by clicking **"Sync Calendar"** in the top navigation or triggering `POST /api/calendar/sync`.
