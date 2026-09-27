import {
  seedPostgresDemoData,
  getMeetingsFromPostgres,
  getMeetingByIdFromPostgres,
  updateMeetingStatusInPostgres,
} from './postgres';
import { INITIAL_DEMO_MEETINGS, isPostgresConfigured, type MeetingRecord } from './db';

export async function getMeetings(filter?: string | null): Promise<MeetingRecord[]> {
  if (isPostgresConfigured) {
    try {
      await seedPostgresDemoData(INITIAL_DEMO_MEETINGS);
      const pgMeetings = await getMeetingsFromPostgres(filter);
      if (pgMeetings && pgMeetings.length > 0) {
        return pgMeetings;
      }
    } catch (err: any) {
      console.error('[DB] Postgres getMeetings error:', err.message);
    }
  }

  // Fallback to in-memory demo data
  let meetings = [...INITIAL_DEMO_MEETINGS];
  if (filter && filter !== 'all') {
    if (filter === 'observation') {
      meetings = meetings.filter((m) => m.isObservationMode);
    } else {
      meetings = meetings.filter((m) => !m.isObservationMode && m.recommendation === filter);
    }
  }
  return meetings;
}

export async function getMeetingById(id: string): Promise<MeetingRecord | null> {
  if (isPostgresConfigured) {
    try {
      await seedPostgresDemoData(INITIAL_DEMO_MEETINGS);
      const pgMeeting = await getMeetingByIdFromPostgres(id);
      if (pgMeeting) return pgMeeting;
    } catch (err: any) {
      console.error('[DB] Postgres getMeetingById error:', err.message);
    }
  }
  return INITIAL_DEMO_MEETINGS.find((m) => m.id === id) || null;
}

export async function updateMeetingStatus(id: string, status: string): Promise<boolean> {
  if (isPostgresConfigured) {
    try {
      const updated = await updateMeetingStatusInPostgres(id, status);
      if (updated) return true;
    } catch (err: any) {
      console.error('[DB] Postgres updateMeetingStatus error:', err.message);
    }
  }
  const m = INITIAL_DEMO_MEETINGS.find((item) => item.id === id);
  if (m) {
    m.status = status as any;
    return true;
  }
  return false;
}
