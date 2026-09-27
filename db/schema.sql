-- MeetingDebt Database Schema (PostgreSQL / Supabase)
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  image text,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free', -- 'free' | 'manager' ($15/mo) | 'team' ($299/mo)
  default_hourly_rate numeric(8,2) default 85.00, -- used to compute company burn rate on dead meetings
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Calendars table
create table if not exists calendars (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  google_email text not null,
  google_refresh_token text,
  google_access_token text,
  token_expiry timestamptz,
  sync_token text,
  last_synced_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_calendars_user_id on calendars(user_id);

-- 3. Meetings table (recurring meeting series)
create table if not exists meetings (
  id uuid primary key default uuid_generate_v4(),
  calendar_id uuid not null references calendars(id) on delete cascade,
  google_recurring_event_id text not null,
  title text not null,
  recurrence_rule text, -- e.g. RRULE:FREQ=WEEKLY;BYDAY=TU
  organizer_email text,
  duration_minutes integer default 30,
  is_observation_mode boolean default true,
  first_detected_at timestamptz default now(),
  status text default 'active', -- 'active' | 'killed' | 'shortened' | 'async'
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint uq_calendar_recurring unique(calendar_id, google_recurring_event_id)
);

create index if not exists idx_meetings_calendar_id on meetings(calendar_id);
create index if not exists idx_meetings_status on meetings(status);

-- 4. Occurrences table (individual instances of recurring meetings)
create table if not exists occurrences (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  google_event_id text unique not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes integer not null default 30,
  attendee_count integer default 0,
  accepted_count integer default 0,
  declined_count integer default 0,
  tentative_count integer default 0,
  agenda_hash text, -- SHA256 of cleaned description
  agenda_text text,
  was_rescheduled boolean default false,
  action_items_logged integer default 0, -- integration with Slack/Notion or manual
  created_at timestamptz default now()
);

create index if not exists idx_occurrences_meeting_id on occurrences(meeting_id);
create index if not exists idx_occurrences_start_time on occurrences(start_time desc);

-- 5. Scores table (historical zombie scores and metrics snapshot)
create table if not exists scores (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  score numeric(5,2) not null, -- 0.00 to 100.00
  recommendation text not null, -- 'kill' (70+) | 'shorten' (40-70) | 'healthy' (<40)
  breakdown_json jsonb not null, -- { attendance_decay, agenda_staleness, talk_skew, decision_ratio, decline_rate, raw }
  occurrences_evaluated integer default 0,
  computed_at timestamptz default now()
);

create index if not exists idx_scores_meeting_id on scores(meeting_id);
create index if not exists idx_scores_computed_at on scores(computed_at desc);

-- Helpful views for quick dashboard retrieval
create or replace view meeting_health_summary as
select 
  m.id as meeting_id,
  m.title,
  m.organizer_email,
  m.duration_minutes,
  m.is_observation_mode,
  m.status,
  m.calendar_id,
  c.user_id,
  coalesce(s.score, 0) as latest_score,
  coalesce(s.recommendation, 'observation') as latest_recommendation,
  s.breakdown_json,
  s.computed_at as score_computed_at,
  count(o.id) as total_occurrences_logged
from meetings m
join calendars c on m.calendar_id = c.id
left join lateral (
  select * from scores 
  where scores.meeting_id = m.id 
  order by computed_at desc 
  limit 1
) s on true
left join occurrences o on o.meeting_id = m.id
group by m.id, c.user_id, s.score, s.recommendation, s.breakdown_json, s.computed_at;
