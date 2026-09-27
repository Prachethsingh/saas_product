# MeetingDebt 💀 — Zombie-Meeting Score & Calendar Auditor

> **Niche B2B SaaS tool for Engineering Managers & Ops Leads.** Connects read-only to Google Calendar, analyzes attendance decay, detects stale agendas, scores recurring meetings (0–100), and auto-drafts data-backed Slack messages to kill, shorten, or async-ize them.

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

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Lucide Icons
- **Backend**: Next.js 14 API Route Handlers (`/api/calendar/sync`, `/api/cron/rescore`, `/api/slack/draft`, `/api/stripe/checkout`)
- **Database**: PostgreSQL / Supabase (`db/schema.sql`)
- **Auth & Calendar API**: NextAuth.js + Google OAuth (`calendar.readonly` scope)
- **Scoring Engine**: `lib/scoring.ts`
- **Nightly Worker**: Vercel Cron (`0 2 * * *` configured in `vercel.json`) invoking `jobs/rescore.ts`
- **Slack Messaging**: Slack App + Bolt SDK / Webhooks (`lib/slack.ts`)
- **Payments**: Stripe Billing (`$15/seat/mo` Manager Pro, `$299/mo` Flat Org Tier)

---

## 📂 Repository Structure

```
saas_product/
├── app/
│   ├── (auth)/login/page.tsx          # High-conversion Google OAuth permission page
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Dashboard navigation, modal contexts
│   │   ├── page.tsx                   # Main meeting list, zombie filters, cost calculator
│   │   └── meetings/[id]/page.tsx     # Deep-dive decay curve, formula breakdown, Slack draft
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts# Google OAuth login handler
│   │   ├── calendar/sync/route.ts     # Google Calendar sync API
│   │   ├── cron/rescore/route.ts      # Vercel Cron nightly rescore job
│   │   ├── slack/draft/route.ts       # Slack draft generator & webhook sender
│   │   ├── stripe/checkout/route.ts   # Stripe checkout session generator
│   │   ├── stripe/webhook/route.ts    # Stripe subscription webhook
│   │   └── meetings/route.ts          # Meeting list & detail endpoints
│   ├── globals.css                    # Tailwind & dark theme styling
│   └── layout.tsx                     # Root HTML & metadata
├── components/
│   ├── dashboard-nav.tsx              # Top bar, sync button, pricing trigger
│   ├── meeting-card.tsx               # Rich meeting card with financial burn badge
│   ├── score-badge.tsx                # Zombie score visual indicator (0-100)
│   ├── slack-modal.tsx                # Interactive Slack preview & one-click dispatch
│   └── pricing-modal.tsx              # Stripe Manager ($15/mo) and Org ($299/mo) plans
├── db/
│   └── schema.sql                     # Postgres tables: users, calendars, meetings, occurrences, scores
├── jobs/
│   └── rescore.ts                     # Scheduled rescoring job
├── lib/
│   ├── auth.ts                        # NextAuth Google provider setup
│   ├── db.ts                          # Supabase client + demo dataset fallback
│   ├── google-calendar.ts             # Google Calendar API event parser & token refresh
│   ├── scoring.ts                     # Mathematical zombie score formula
│   ├── slack.ts                       # Bolt SDK & Slack Block Kit auto-draft generator
│   └── stripe.ts                      # Stripe SDK, pricing plans & checkout
├── .env.local.example                 # Environment configuration template
├── vercel.json                        # Vercel Cron configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Local Demo)
Copy the environment template:
```bash
cp .env.local.example .env.local
```
*Note: MeetingDebt includes an instant high-fidelity demo state out of the box, allowing full testing of the dashboard, decay curves, Slack auto-drafts, and calculator before connecting external API keys.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Core Features

1. **Dashboard & Score Filters**: Filter by `Kill it (70+)`, `Shorten (40-70)`, `Healthy (<40)`, or `Observation Mode`.
2. **Loaded Rate Slider**: Drag the hourly rate slider in the top right to watch company burn rate calculations update dynamically.
3. **Decay Curve Drilldown**: Click **"View Decay Curve"** on any meeting (e.g. *Weekly Cross-Functional Status Sync*) to inspect:
   - Historical acceptance vs decline bar chart over time.
   - The exact mathematical sub-scores: Attendance Decay ($88\%$), Agenda Staleness ($100\%$), Decision Ratio ($95\%$ penalty).
   - The occurrence audit table flagging stale agenda hashes.
4. **Slack Auto-Draft**: Click **"Auto-Draft Slack"** to preview the pre-composed proposal. Copy it to your clipboard or send it directly via an incoming Slack Webhook.
5. **Nightly Rescore**: Test the rescoring engine manually by clicking **"Sync Calendar"** in the top navigation or making a POST request to `/api/calendar/sync`.
