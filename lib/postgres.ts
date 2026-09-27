import { Pool } from 'pg';
import type { MeetingRecord } from './db';

let pool: Pool | null = null;
let isSchemaInitialized = false;

export function getPostgresPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }

  return pool;
}

export async function queryPostgres(text: string, params?: any[]) {
  const p = getPostgresPool();
  if (!p) {
    throw new Error('DATABASE_URL is not set.');
  }
  return p.query(text, params);
}

/**
 * Initializes database tables and views automatically on boot
 */
export async function initPostgresSchema() {
  if (isSchemaInitialized) return true;
  const p = getPostgresPool();
  if (!p) return false;

  try {
    console.log('[Postgres] Checking and running schema migrations...');
    await p.query(`
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
    `);
    console.log('[Postgres] Schema migration complete.');
    isSchemaInitialized = true;
    return true;
  } catch (error: any) {
    console.error('[Postgres] Schema initialization error:', error.message);
    return false;
  }
}

/**
 * Seed initial demo records into Postgres if the meetings table is empty
 */
export async function seedPostgresDemoData(initialMeetings: MeetingRecord[]) {
  const p = getPostgresPool();
  if (!p) return;

  try {
    const { rows } = await p.query('SELECT COUNT(*) as count FROM meetings');
    if (parseInt(rows[0].count, 10) > 0) {
      return; // Already seeded
    }

    console.log('[Postgres] Seeding initial demo meetings...');
    for (const m of initialMeetings) {
      await p.query(
        `INSERT INTO meetings (
          id, title, organizer_email, duration_minutes, recurrence_rule,
          status, is_observation_mode, score, recommendation,
          annual_waste_dollars, hours_reclaimable_per_month, attendee_count,
          occurrences_logged, last_occurrence_date, breakdown_json
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO NOTHING`,
        [
          m.id,
          m.title,
          m.organizerEmail,
          m.durationMinutes,
          m.recurrenceRule,
          m.status,
          m.isObservationMode,
          m.score,
          m.recommendation,
          m.annualWasteDollars,
          m.hoursReclaimablePerMonth,
          m.attendeeCount,
          m.occurrencesLogged,
          m.lastOccurrenceDate,
          JSON.stringify(m.breakdown),
        ]
      );

      for (const occ of m.occurrences) {
        await p.query(
          `INSERT INTO occurrences (
            id, meeting_id, occurrence_date, duration_minutes,
            attendee_count, accepted_count, declined_count,
            agenda_text, was_rescheduled, action_items_logged
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING`,
          [
            occ.id,
            m.id,
            occ.date,
            occ.durationMinutes,
            occ.attendeeCount,
            occ.acceptedCount,
            occ.declinedCount,
            occ.agendaText,
            occ.wasRescheduled,
            occ.actionItemsLogged,
          ]
        );
      }
    }
    console.log('[Postgres] Initial demo meetings seeded successfully.');
  } catch (err: any) {
    console.error('[Postgres] Error seeding demo data:', err.message);
  }
}

/**
 * Fetch all meetings from Postgres with their occurrences
 */
export async function getMeetingsFromPostgres(filter?: string | null): Promise<MeetingRecord[]> {
  const p = getPostgresPool();
  if (!p) return [];

  await initPostgresSchema();

  let query = 'SELECT * FROM meetings';
  const params: any[] = [];

  if (filter && filter !== 'all') {
    if (filter === 'observation') {
      query += ' WHERE is_observation_mode = true';
    } else {
      query += ' WHERE is_observation_mode = false AND recommendation = $1';
      params.push(filter);
    }
  }

  query += ' ORDER BY created_at DESC';

  const { rows: meetingRows } = await p.query(query, params);
  if (meetingRows.length === 0) return [];

  const meetingIds = meetingRows.map((r: any) => r.id);
  const { rows: occRows } = await p.query(
    'SELECT * FROM occurrences WHERE meeting_id = ANY($1::text[]) ORDER BY occurrence_date ASC',
    [meetingIds]
  );

  const occMap = new Map<string, any[]>();
  for (const occ of occRows) {
    const list = occMap.get(occ.meeting_id) || [];
    list.push({
      id: occ.id,
      date: occ.occurrence_date,
      acceptedCount: occ.accepted_count,
      declinedCount: occ.declined_count,
      attendeeCount: occ.attendee_count,
      durationMinutes: occ.duration_minutes,
      actionItemsLogged: occ.action_items_logged,
      agendaText: occ.agenda_text || '',
      wasRescheduled: occ.was_rescheduled,
    });
    occMap.set(occ.meeting_id, list);
  }

  return meetingRows.map((r: any) => ({
    id: r.id,
    title: r.title,
    organizerEmail: r.organizer_email,
    durationMinutes: r.duration_minutes,
    recurrenceRule: r.recurrence_rule,
    status: r.status,
    isObservationMode: r.is_observation_mode,
    score: Number(r.score) || 0,
    recommendation: r.recommendation,
    annualWasteDollars: Number(r.annual_waste_dollars) || 0,
    hoursReclaimablePerMonth: Number(r.hours_reclaimable_per_month) || 0,
    attendeeCount: r.attendee_count,
    occurrencesLogged: r.occurrences_logged,
    lastOccurrenceDate: r.last_occurrence_date,
    breakdown: r.breakdown_json || {
      attendanceDecay: 0,
      agendaStaleness: 0,
      talkSkew: 0,
      decisionRatioScore: 0,
      declineRate: 0,
    },
    occurrences: occMap.get(r.id) || [],
  }));
}

/**
 * Fetch a single meeting by ID from Postgres
 */
export async function getMeetingByIdFromPostgres(id: string): Promise<MeetingRecord | null> {
  const p = getPostgresPool();
  if (!p) return null;

  await initPostgresSchema();

  const { rows: meetingRows } = await p.query('SELECT * FROM meetings WHERE id = $1 LIMIT 1', [id]);
  if (meetingRows.length === 0) return null;

  const r = meetingRows[0];
  const { rows: occRows } = await p.query(
    'SELECT * FROM occurrences WHERE meeting_id = $1 ORDER BY occurrence_date ASC',
    [id]
  );

  return {
    id: r.id,
    title: r.title,
    organizerEmail: r.organizer_email,
    durationMinutes: r.duration_minutes,
    recurrenceRule: r.recurrence_rule,
    status: r.status,
    isObservationMode: r.is_observation_mode,
    score: Number(r.score) || 0,
    recommendation: r.recommendation,
    annualWasteDollars: Number(r.annual_waste_dollars) || 0,
    hoursReclaimablePerMonth: Number(r.hours_reclaimable_per_month) || 0,
    attendeeCount: r.attendee_count,
    occurrencesLogged: r.occurrences_logged,
    lastOccurrenceDate: r.last_occurrence_date,
    breakdown: r.breakdown_json || {
      attendanceDecay: 0,
      agendaStaleness: 0,
      talkSkew: 0,
      decisionRatioScore: 0,
      declineRate: 0,
    },
    occurrences: occRows.map((occ: any) => ({
      id: occ.id,
      date: occ.occurrence_date,
      acceptedCount: occ.accepted_count,
      declinedCount: occ.declined_count,
      attendeeCount: occ.attendee_count,
      durationMinutes: occ.duration_minutes,
      actionItemsLogged: occ.action_items_logged,
      agendaText: occ.agenda_text || '',
      wasRescheduled: occ.was_rescheduled,
    })),
  };
}

/**
 * Update meeting status in Postgres
 */
export async function updateMeetingStatusInPostgres(id: string, status: string): Promise<boolean> {
  const p = getPostgresPool();
  if (!p) return false;

  await initPostgresSchema();
  const res = await p.query(
    'UPDATE meetings SET status = $1, updated_at = now() WHERE id = $2',
    [status, id]
  );
  return (res.rowCount ?? 0) > 0;
}
