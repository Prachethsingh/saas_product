/**
 * Google Calendar API Integration
 * Handles OAuth token refresh, recurring events discovery, and occurrence history extraction.
 */

import { OccurrenceInput } from './scoring';

export interface CalendarEventInstance {
  id: string;
  recurringEventId?: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
    organizer?: boolean;
    self?: boolean;
  }>;
  recurrence?: string[];
  status?: string;
}

export async function refreshGoogleAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) missing.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh Google token: ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

export async function fetchCalendarEvents(
  accessToken: string,
  calendarId = 'primary',
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEventInstance[]> {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  
  const minTime = timeMin || ninetyDaysAgo;
  const maxTime = timeMax || now.toISOString();

  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('timeMin', minTime);
  url.searchParams.set('timeMax', maxTime);
  url.searchParams.set('maxResults', '250');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Calendar API error: ${err}`);
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Transforms raw Google Calendar instances into structured OccurrenceInputs
 */
export function mapGoogleEventsToOccurrences(
  events: CalendarEventInstance[]
): Map<string, OccurrenceInput[]> {
  const recurringMap = new Map<string, OccurrenceInput[]>();

  for (const ev of events) {
    const key = ev.recurringEventId || (ev.recurrence ? ev.id : null);
    if (!key) continue; // Skip non-recurring one-offs

    const start = new Date(ev.start?.dateTime || ev.start?.date || '');
    const end = new Date(ev.end?.dateTime || ev.end?.date || '');
    const durationMinutes = Math.max(15, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));

    const attendees = ev.attendees || [];
    const attendeeCount = attendees.length;
    const acceptedCount = attendees.filter(a => a.responseStatus === 'accepted').length;
    const declinedCount = attendees.filter(a => a.responseStatus === 'declined').length;
    const tentativeCount = attendees.filter(a => a.responseStatus === 'tentative').length;

    const agendaText = ev.description ? ev.description.replace(/<[^>]*>?/gm, '').trim() : '';

    const occurrence: OccurrenceInput = {
      date: start,
      attendeeCount: Math.max(1, attendeeCount),
      acceptedCount,
      declinedCount,
      tentativeCount,
      durationMinutes,
      agendaText,
      agendaHash: agendaText ? hashString(agendaText) : '',
      actionItemsLogged: 0,
      wasRescheduled: false,
    };

    const existing = recurringMap.get(key) || [];
    existing.push(occurrence);
    recurringMap.set(key, existing);
  }

  return recurringMap;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}
