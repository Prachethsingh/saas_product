-- 001_initial_schema.sql
-- Antideploy Postgres Auto-Migration

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'free',
  default_hourly_rate NUMERIC(8,2) DEFAULT 85.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendars (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  google_email TEXT NOT NULL,
  google_refresh_token TEXT,
  google_access_token TEXT,
  token_expiry TIMESTAMPTZ,
  sync_token TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON calendars(user_id);

CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  calendar_id TEXT,
  google_recurring_event_id TEXT,
  title TEXT NOT NULL,
  recurrence_rule TEXT,
  organizer_email TEXT,
  duration_minutes INTEGER DEFAULT 30,
  is_observation_mode BOOLEAN DEFAULT false,
  first_detected_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active',
  score NUMERIC(5,2) DEFAULT 0,
  recommendation TEXT DEFAULT 'observation',
  annual_waste_dollars NUMERIC(10,2) DEFAULT 0,
  hours_reclaimable_per_month NUMERIC(6,2) DEFAULT 0,
  attendee_count INTEGER DEFAULT 0,
  occurrences_logged INTEGER DEFAULT 0,
  last_occurrence_date TEXT,
  breakdown_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_recommendation ON meetings(recommendation);

CREATE TABLE IF NOT EXISTS occurrences (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  google_event_id TEXT,
  occurrence_date TEXT NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  attendee_count INTEGER DEFAULT 0,
  accepted_count INTEGER DEFAULT 0,
  declined_count INTEGER DEFAULT 0,
  tentative_count INTEGER DEFAULT 0,
  agenda_text TEXT,
  was_rescheduled BOOLEAN DEFAULT false,
  action_items_logged INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_occurrences_meeting_id ON occurrences(meeting_id);

CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  recommendation TEXT NOT NULL,
  breakdown_json JSONB NOT NULL,
  occurrences_evaluated INTEGER DEFAULT 0,
  computed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scores_meeting_id ON scores(meeting_id);
CREATE INDEX IF NOT EXISTS idx_scores_computed_at ON scores(computed_at DESC);
