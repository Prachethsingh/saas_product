/**
 * Nightly Rescoring Job
 * Invoked by Vercel Cron at 02:00 AM UTC or on-demand via admin trigger.
 */

import { supabase, isSupabaseConfigured, INITIAL_DEMO_MEETINGS } from '../lib/db';
import { calculateZombieScore, OccurrenceInput } from '../lib/scoring';
import { fetchCalendarEvents, mapGoogleEventsToOccurrences, refreshGoogleAccessToken } from '../lib/google-calendar';

export interface RescoreSummary {
  calendarsProcessed: number;
  meetingsProcessed: number;
  scoresGenerated: number;
  zombiesFlagged: number;
  timestamp: string;
}

export async function runNightlyRescoreJob(): Promise<RescoreSummary> {
  const summary: RescoreSummary = {
    calendarsProcessed: 0,
    meetingsProcessed: 0,
    scoresGenerated: 0,
    zombiesFlagged: 0,
    timestamp: new Date().toISOString(),
  };

  if (!isSupabaseConfigured || !supabase) {
    // If running in local demo mode, evaluate demo meetings
    for (const m of INITIAL_DEMO_MEETINGS) {
      const occurrences: OccurrenceInput[] = m.occurrences.map((o) => ({
        date: o.date,
        attendeeCount: o.attendeeCount,
        acceptedCount: o.acceptedCount,
        declinedCount: o.declinedCount,
        durationMinutes: o.durationMinutes,
        actionItemsLogged: o.actionItemsLogged,
        agendaText: o.agendaText,
      }));

      const res = calculateZombieScore(occurrences);
      m.score = res.score;
      m.recommendation = res.recommendation;
      m.isObservationMode = res.isObservationMode;
      m.annualWasteDollars = res.estimatedAnnualWasteDollars;
      m.hoursReclaimablePerMonth = res.hoursReclaimablePerMonth;

      summary.meetingsProcessed++;
      summary.scoresGenerated++;
      if (res.score >= 70) summary.zombiesFlagged++;
    }

    summary.calendarsProcessed = 1;
    return summary;
  }

  // 1. Fetch active calendars with refresh tokens
  const { data: calendars, error: calErr } = await supabase
    .from('calendars')
    .select('id, user_id, google_email, google_refresh_token');

  if (calErr || !calendars) {
    throw new Error(`Failed to query calendars: ${calErr?.message}`);
  }

  for (const cal of calendars) {
    if (!cal.google_refresh_token) continue;
    summary.calendarsProcessed++;

    try {
      // 2. Refresh token & fetch 90 days of events
      const { accessToken } = await refreshGoogleAccessToken(cal.google_refresh_token);
      const events = await fetchCalendarEvents(accessToken);
      const occurrencesByRecurringId = mapGoogleEventsToOccurrences(events);

      // 3. For each recurring series, update or insert meeting record & score
      for (const [googleRecurringId, occs] of Array.from(occurrencesByRecurringId.entries())) {
        summary.meetingsProcessed++;

        // Calculate score
        const scoreResult = calculateZombieScore(occs);

        // Fetch or create meeting
        const { data: meeting } = await supabase
          .from('meetings')
          .upsert(
            {
              calendar_id: cal.id,
              google_recurring_event_id: googleRecurringId,
              title: googleRecurringId, // updated from events if available
              is_observation_mode: scoreResult.isObservationMode,
              duration_minutes: occs[0]?.durationMinutes || 30,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'calendar_id, google_recurring_event_id' }
          )
          .select('id')
          .single();

        if (meeting) {
          // Record score snapshot
          await supabase.from('scores').insert({
            meeting_id: meeting.id,
            score: scoreResult.score,
            recommendation: scoreResult.recommendation,
            breakdown_json: scoreResult.breakdown,
            occurrences_evaluated: occs.length,
          });

          summary.scoresGenerated++;
          if (scoreResult.score >= 70) summary.zombiesFlagged++;
        }
      }

      // Update calendar last synced time
      await supabase
        .from('calendars')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', cal.id);
    } catch (err) {
      console.error(`Error processing calendar ${cal.id}:`, err);
    }
  }

  return summary;
}
