/**
 * MeetingDebt Zombie-Meeting Scoring Engine
 * 
 * Formula:
 * score = 0.30 * attendance_decay 
 *       + 0.20 * agenda_staleness 
 *       + 0.25 * talk_skew 
 *       + 0.15 * (1 - decision_ratio) 
 *       + 0.10 * decline_rate
 * 
 * Thresholds:
 * - 70+: "kill" (Kill or async-ize - auto-draft Slack msg)
 * - 40-70: "shorten" (Suggest 30 -> 15 min or 60 -> 25 min)
 * - <40: "healthy" (Healthy, no action)
 * 
 * Cold-start logic:
 * Minimum 6 occurrences required. Fewer than 6 puts meeting in "observation mode".
 */

export interface OccurrenceInput {
  date: string | Date;
  attendeeCount: number;
  acceptedCount: number;
  declinedCount: number;
  tentativeCount?: number;
  agendaHash?: string | null;
  agendaText?: string | null;
  durationMinutes: number;
  actionItemsLogged?: number;
  wasRescheduled?: boolean;
  talkTimeSpeakerShareTop2?: number; // v2 opt-in: percentage 0-1 of speech by top 2 speakers
}

export interface ScoreBreakdown {
  attendanceDecay: number; // 0 - 1
  agendaStaleness: number; // 0 - 1
  talkSkew: number;        // 0 - 1
  decisionRatioScore: number; // 0 - 1 (1 - decision_ratio)
  declineRate: number;     // 0 - 1
  rawMetrics: {
    earlyAvgAccepted: number;
    recentAvgAccepted: number;
    staleAgendaStreak: number;
    decisionRatio: number;
    rescheduleOrDeclinePercentage: number;
    occurrencesCount: number;
  };
  weightsUsed: {
    attendanceDecay: number;
    agendaStaleness: number;
    talkSkew: number;
    decisionRatio: number;
    declineRate: number;
  };
}

export interface ScoreResult {
  score: number; // 0 - 100
  recommendation: 'kill' | 'shorten' | 'healthy' | 'observation';
  isObservationMode: boolean;
  occurrencesCount: number;
  minRequiredOccurrences: number;
  breakdown: ScoreBreakdown;
  headline: string;
  actionSuggestion: string;
  estimatedAnnualWasteDollars: number;
  hoursReclaimablePerMonth: number;
}

const MIN_OBSERVATION_OCCURRENCES = 6;
const DEFAULT_HOURLY_RATE = 85; // $85/hr tech worker loaded cost default

export function calculateZombieScore(
  occurrences: OccurrenceInput[],
  hourlyRate = DEFAULT_HOURLY_RATE
): ScoreResult {
  const sorted = [...occurrences].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const count = sorted.length;

  // Cold-start observation check
  if (count < MIN_OBSERVATION_OCCURRENCES) {
    return {
      score: 0,
      recommendation: 'observation',
      isObservationMode: true,
      occurrencesCount: count,
      minRequiredOccurrences: MIN_OBSERVATION_OCCURRENCES,
      breakdown: {
        attendanceDecay: 0,
        agendaStaleness: 0,
        talkSkew: 0,
        decisionRatioScore: 0,
        declineRate: 0,
        rawMetrics: {
          earlyAvgAccepted: 0,
          recentAvgAccepted: 0,
          staleAgendaStreak: 0,
          decisionRatio: 0,
          rescheduleOrDeclinePercentage: 0,
          occurrencesCount: count,
        },
        weightsUsed: {
          attendanceDecay: 0.3,
          agendaStaleness: 0.2,
          talkSkew: 0.25,
          decisionRatio: 0.15,
          declineRate: 0.1,
        },
      },
      headline: `Observation Mode (${count}/${MIN_OBSERVATION_OCCURRENCES} occurrences)`,
      actionSuggestion: `Logging recurring patterns. First zombie score reveals after ${MIN_OBSERVATION_OCCURRENCES - count} more meetings.`,
      estimatedAnnualWasteDollars: 0,
      hoursReclaimablePerMonth: 0,
    };
  }

  // 1. Attendance Decay (30%)
  // Trend over last 8 (or all if <8) occurrences:
  // Formula: (early_avg_attendees - recent_avg_attendees) / early_avg_attendees
  const windowSize = Math.min(count, 8);
  const recentWindow = sorted.slice(-windowSize);
  const half = Math.floor(windowSize / 2);
  const earlyHalf = recentWindow.slice(0, half);
  const lateHalf = recentWindow.slice(half);

  const earlyAvg =
    earlyHalf.reduce((sum, o) => sum + (o.acceptedCount || 0), 0) / (earlyHalf.length || 1);
  const lateAvg =
    lateHalf.reduce((sum, o) => sum + (o.acceptedCount || 0), 0) / (lateHalf.length || 1);

  let rawAttendanceDecay = 0;
  if (earlyAvg > 0) {
    rawAttendanceDecay = (earlyAvg - lateAvg) / earlyAvg;
  }
  const attendanceDecay = Math.max(0, Math.min(1, rawAttendanceDecay));

  // 2. Agenda Staleness (20%)
  // Unchanged or empty calendar description N times in a row
  let staleStreak = 0;
  let lastHash: string | null | undefined = undefined;

  for (let i = recentWindow.length - 1; i >= 0; i--) {
    const occ = recentWindow[i];
    const hash = occ.agendaHash || (occ.agendaText ? occ.agendaText.trim().toLowerCase() : '');
    
    // Empty agenda is instantly stale
    if (!hash || hash.length < 5) {
      staleStreak++;
      continue;
    }

    if (lastHash === undefined) {
      lastHash = hash;
      staleStreak = 1;
    } else if (lastHash === hash) {
      staleStreak++;
    } else {
      break;
    }
  }

  // Max penalty reached at 4+ identical/blank agendas
  const agendaStaleness = Math.min(1, staleStreak / 4);

  // 3. Talk-time skew (25%, v2 opt-in)
  // If 1-2 people account for >70% of speaking -> passive attendance
  let hasTranscriptData = false;
  let totalSkew = 0;
  let skewSamples = 0;

  for (const occ of recentWindow) {
    if (occ.talkTimeSpeakerShareTop2 !== undefined && occ.talkTimeSpeakerShareTop2 !== null) {
      hasTranscriptData = true;
      // If top 2 have > 0.70 of speech, skew penalty scales up to 1.0 at 0.95
      const share = occ.talkTimeSpeakerShareTop2;
      const penalty = share > 0.7 ? Math.min(1, (share - 0.7) / 0.25) : 0;
      totalSkew += penalty;
      skewSamples++;
    }
  }

  const rawTalkSkew = hasTranscriptData && skewSamples > 0 ? totalSkew / skewSamples : 0;

  // 4. Duration-to-decision ratio (15%)
  // Meeting length vs # action items logged after
  // High ratio (e.g. 1 hour meeting with 0 actions) = time sink -> 1 - decision_ratio = 1.0
  const avgDurationHours =
    recentWindow.reduce((sum, o) => sum + (o.durationMinutes || 30), 0) /
    (recentWindow.length * 60 || 1);
  const avgActionItems =
    recentWindow.reduce((sum, o) => sum + (o.actionItemsLogged || 0), 0) /
    (recentWindow.length || 1);

  // Standard benchmark: 1 action item per 20 minutes (0.33 hour) of meeting is healthy (1.0)
  // Ratio = avgActionItems / (avgDurationHours * 3)
  const healthyThresholdActions = Math.max(0.5, avgDurationHours * 2.5);
  const decisionRatio = Math.min(1, avgActionItems / healthyThresholdActions);
  const decisionRatioScore = 1 - decisionRatio;

  // 5. Decline / Reschedule rate (10%)
  // % of instances moved or declined
  let totalInvited = 0;
  let totalDeclined = 0;
  let rescheduledCount = 0;

  for (const occ of recentWindow) {
    const invited = occ.attendeeCount || (occ.acceptedCount + occ.declinedCount) || 1;
    totalInvited += invited;
    totalDeclined += occ.declinedCount || 0;
    if (occ.wasRescheduled) rescheduledCount++;
  }

  const declinePct = totalInvited > 0 ? totalDeclined / totalInvited : 0;
  const reschedulePct = recentWindow.length > 0 ? rescheduledCount / recentWindow.length : 0;
  // Blend decline and reschedule
  const declineRate = Math.min(1, declinePct * 0.7 + reschedulePct * 0.3);

  // Weight Calculation:
  // If no transcript opt-in (v1 MVP), reweight the active 4 signals proportionally
  let wAttendance = 0.30;
  let wAgenda = 0.20;
  let wTalk = 0.25;
  let wDecision = 0.15;
  let wDecline = 0.10;

  if (!hasTranscriptData) {
    // Distribute talk weight (0.25) across remaining 0.75
    const factor = 1 / (1 - 0.25); // 1.3333...
    wAttendance = 0.30 * factor; // 0.40
    wAgenda = 0.20 * factor;     // 0.2667
    wTalk = 0;
    wDecision = 0.15 * factor;   // 0.20
    wDecline = 0.10 * factor;    // 0.1333
  }

  const totalScoreVal =
    wAttendance * attendanceDecay +
    wAgenda * agendaStaleness +
    wTalk * rawTalkSkew +
    wDecision * decisionRatioScore +
    wDecline * declineRate;

  const score = Math.round(totalScoreVal * 100);

  // Recommendation & actions
  let recommendation: 'kill' | 'shorten' | 'healthy' = 'healthy';
  let headline = 'Healthy recurring sync';
  let actionSuggestion = 'High attendance and regular action items. Keep as-is.';

  if (score >= 70) {
    recommendation = 'kill';
    headline = 'Critical Zombie: Kill or Move to Async';
    actionSuggestion =
      'Attendance has collapsed and agenda is stale. Convert to Slack async check-in or cancel series.';
  } else if (score >= 40) {
    recommendation = 'shorten';
    const currentDur = Math.round(avgDurationHours * 60);
    const suggestedDur = currentDur > 30 ? 25 : 15;
    headline = `Inefficient: Shorten from ${currentDur}m to ${suggestedDur}m`;
    actionSuggestion = `Trim meeting duration to ${suggestedDur} minutes and enforce mandatory pre-meeting bullet points.`;
  }

  // Waste Calculation
  const avgAttendees =
    recentWindow.reduce((sum, o) => sum + (o.acceptedCount || o.attendeeCount || 3), 0) /
    (recentWindow.length || 1);
  const meetingsPerMonth = 4.2; // approx weekly
  const monthlyHoursPerPerson = (avgDurationHours * meetingsPerMonth);
  const monthlyTeamHours = monthlyHoursPerPerson * avgAttendees;
  
  // Potential waste fraction based on score (e.g. score 80 = 80% waste)
  const wasteFraction = score / 100;
  const hoursReclaimablePerMonth = Math.round(monthlyTeamHours * wasteFraction);
  const estimatedAnnualWasteDollars = Math.round(
    hoursReclaimablePerMonth * 12 * hourlyRate
  );

  return {
    score,
    recommendation,
    isObservationMode: false,
    occurrencesCount: count,
    minRequiredOccurrences: MIN_OBSERVATION_OCCURRENCES,
    breakdown: {
      attendanceDecay: Number(attendanceDecay.toFixed(3)),
      agendaStaleness: Number(agendaStaleness.toFixed(3)),
      talkSkew: Number(rawTalkSkew.toFixed(3)),
      decisionRatioScore: Number(decisionRatioScore.toFixed(3)),
      declineRate: Number(declineRate.toFixed(3)),
      rawMetrics: {
        earlyAvgAccepted: Number(earlyAvg.toFixed(1)),
        recentAvgAccepted: Number(lateAvg.toFixed(1)),
        staleAgendaStreak: staleStreak,
        decisionRatio: Number(decisionRatio.toFixed(2)),
        rescheduleOrDeclinePercentage: Math.round(declineRate * 100),
        occurrencesCount: count,
      },
      weightsUsed: {
        attendanceDecay: Number(wAttendance.toFixed(3)),
        agendaStaleness: Number(wAgenda.toFixed(3)),
        talkSkew: Number(wTalk.toFixed(3)),
        decisionRatio: Number(wDecision.toFixed(3)),
        declineRate: Number(wDecline.toFixed(3)),
      },
    },
    headline,
    actionSuggestion,
    estimatedAnnualWasteDollars,
    hoursReclaimablePerMonth,
  };
}
