/**
 * Nightly Rescoring Job
 * Invoked by Antideploy Cron or on-demand via admin trigger.
 */

import { INITIAL_DEMO_MEETINGS, isPostgresConfigured } from '../lib/db';
import { calculateZombieScore, OccurrenceInput } from '../lib/scoring';
import { getPostgresPool, initPostgresSchema } from '../lib/postgres';

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

  const pool = getPostgresPool();

  if (isPostgresConfigured && pool) {
    try {
      await initPostgresSchema();
      const { rows: meetings } = await pool.query('SELECT * FROM meetings');

      for (const m of meetings) {
        const { rows: occurrences } = await pool.query(
          'SELECT * FROM occurrences WHERE meeting_id = $1 ORDER BY occurrence_date ASC',
          [m.id]
        );

        const occInputs: OccurrenceInput[] = occurrences.map((o: any) => ({
          date: o.occurrence_date,
          attendeeCount: o.attendee_count,
          acceptedCount: o.accepted_count,
          declinedCount: o.declined_count,
          durationMinutes: o.duration_minutes,
          actionItemsLogged: o.action_items_logged,
          agendaText: o.agenda_text || '',
        }));

        const res = calculateZombieScore(occInputs);

        await pool.query(
          `UPDATE meetings SET
            score = $1,
            recommendation = $2,
            is_observation_mode = $3,
            annual_waste_dollars = $4,
            hours_reclaimable_per_month = $5,
            breakdown_json = $6,
            updated_at = now()
           WHERE id = $7`,
          [
            res.score,
            res.recommendation,
            res.isObservationMode,
            res.estimatedAnnualWasteDollars,
            res.hoursReclaimablePerMonth,
            JSON.stringify(res.breakdown),
            m.id,
          ]
        );

        await pool.query(
          `INSERT INTO scores (
            meeting_id, score, recommendation, breakdown_json, occurrences_evaluated
          ) VALUES ($1, $2, $3, $4, $5)`,
          [m.id, res.score, res.recommendation, JSON.stringify(res.breakdown), occurrences.length]
        );

        summary.meetingsProcessed++;
        summary.scoresGenerated++;
        if (res.score >= 70) summary.zombiesFlagged++;
      }

      summary.calendarsProcessed = 1;
      return summary;
    } catch (err: any) {
      console.error('[RescoreJob] Error in Postgres rescore:', err.message);
    }
  }

  // Fallback to local demo meetings
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
