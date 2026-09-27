export const isPostgresConfigured = Boolean(process.env.DATABASE_URL);
export const isSupabaseConfigured = false;
export const supabase = null;

/**
 * Mock demo dataset for out-of-the-box evaluation without requiring immediate DB credentials
 */
export interface MeetingRecord {
  id: string;
  title: string;
  organizerEmail: string;
  durationMinutes: number;
  recurrenceRule: string;
  status: 'active' | 'killed' | 'shortened' | 'async';
  isObservationMode: boolean;
  score: number;
  recommendation: 'kill' | 'shorten' | 'healthy' | 'observation';
  annualWasteDollars: number;
  hoursReclaimablePerMonth: number;
  attendeeCount: number;
  occurrencesLogged: number;
  lastOccurrenceDate: string;
  breakdown: {
    attendanceDecay: number;
    agendaStaleness: number;
    talkSkew: number;
    decisionRatioScore: number;
    declineRate: number;
  };
  occurrences: Array<{
    id: string;
    date: string;
    acceptedCount: number;
    declinedCount: number;
    attendeeCount: number;
    durationMinutes: number;
    actionItemsLogged: number;
    agendaText: string;
    wasRescheduled: boolean;
  }>;
}

export const INITIAL_DEMO_MEETINGS: MeetingRecord[] = [
  {
    id: 'meet_mon_sync',
    title: 'Weekly Cross-Functional Status Sync',
    organizerEmail: 'alex.ops@company.io',
    durationMinutes: 60,
    recurrenceRule: 'RRULE:FREQ=WEEKLY;BYDAY=MO',
    status: 'active',
    isObservationMode: false,
    score: 84,
    recommendation: 'kill',
    annualWasteDollars: 38760,
    hoursReclaimablePerMonth: 38,
    attendeeCount: 14,
    occurrencesLogged: 12,
    lastOccurrenceDate: '2026-09-21',
    breakdown: {
      attendanceDecay: 0.88,
      agendaStaleness: 1.0,
      talkSkew: 0.72,
      decisionRatioScore: 0.95,
      declineRate: 0.45,
    },
    occurrences: [
      { id: 'occ_1', date: '2026-07-06', acceptedCount: 14, declinedCount: 0, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 4, agendaText: 'Team priorities & launch blockers', wasRescheduled: false },
      { id: 'occ_2', date: '2026-07-13', acceptedCount: 13, declinedCount: 1, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 3, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_3', date: '2026-07-20', acceptedCount: 11, declinedCount: 3, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 2, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_4', date: '2026-07-27', acceptedCount: 9, declinedCount: 5, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 1, agendaText: 'Weekly sync & status updates', wasRescheduled: true },
      { id: 'occ_5', date: '2026-08-03', acceptedCount: 7, declinedCount: 7, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_6', date: '2026-08-10', acceptedCount: 6, declinedCount: 8, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_7', date: '2026-08-17', acceptedCount: 5, declinedCount: 9, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: true },
      { id: 'occ_8', date: '2026-08-24', acceptedCount: 4, declinedCount: 10, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_9', date: '2026-08-31', acceptedCount: 4, declinedCount: 10, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_10', date: '2026-09-07', acceptedCount: 3, declinedCount: 11, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_11', date: '2026-09-14', acceptedCount: 3, declinedCount: 11, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: false },
      { id: 'occ_12', date: '2026-09-21', acceptedCount: 3, declinedCount: 11, attendeeCount: 14, durationMinutes: 60, actionItemsLogged: 0, agendaText: 'Weekly sync & status updates', wasRescheduled: true },
    ],
  },
  {
    id: 'meet_eng_arch',
    title: 'Bi-Weekly Architecture Forum',
    organizerEmail: 'marcus.eng@company.io',
    durationMinutes: 45,
    recurrenceRule: 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=TH',
    status: 'active',
    isObservationMode: false,
    score: 58,
    recommendation: 'shorten',
    annualWasteDollars: 14280,
    hoursReclaimablePerMonth: 14,
    attendeeCount: 8,
    occurrencesLogged: 8,
    lastOccurrenceDate: '2026-09-17',
    breakdown: {
      attendanceDecay: 0.35,
      agendaStaleness: 0.50,
      talkSkew: 0.65,
      decisionRatioScore: 0.60,
      declineRate: 0.25,
    },
    occurrences: [
      { id: 'arch_1', date: '2026-06-11', acceptedCount: 8, declinedCount: 0, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 3, agendaText: 'RFC review: Event bus migration', wasRescheduled: false },
      { id: 'arch_2', date: '2026-06-25', acceptedCount: 7, declinedCount: 1, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 2, agendaText: 'RFC review: Redis cluster sizing', wasRescheduled: false },
      { id: 'arch_3', date: '2026-07-09', acceptedCount: 6, declinedCount: 2, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 2, agendaText: 'Architecture updates', wasRescheduled: false },
      { id: 'arch_4', date: '2026-07-23', acceptedCount: 6, declinedCount: 2, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 1, agendaText: 'Architecture updates', wasRescheduled: false },
      { id: 'arch_5', date: '2026-08-06', acceptedCount: 5, declinedCount: 3, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 1, agendaText: 'Architecture updates', wasRescheduled: false },
      { id: 'arch_6', date: '2026-08-20', acceptedCount: 5, declinedCount: 3, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 1, agendaText: 'Architecture updates', wasRescheduled: true },
      { id: 'arch_7', date: '2026-09-03', acceptedCount: 4, declinedCount: 4, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 1, agendaText: 'Architecture updates', wasRescheduled: false },
      { id: 'arch_8', date: '2026-09-17', acceptedCount: 5, declinedCount: 3, attendeeCount: 8, durationMinutes: 45, actionItemsLogged: 1, agendaText: 'Architecture updates & questions', wasRescheduled: false },
    ],
  },
  {
    id: 'meet_sprint_retro',
    title: 'Sprint Retrospective & Demo',
    organizerEmail: 'sarah.pm@company.io',
    durationMinutes: 45,
    recurrenceRule: 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=FR',
    status: 'active',
    isObservationMode: false,
    score: 22,
    recommendation: 'healthy',
    annualWasteDollars: 0,
    hoursReclaimablePerMonth: 0,
    attendeeCount: 7,
    occurrencesLogged: 10,
    lastOccurrenceDate: '2026-09-18',
    breakdown: {
      attendanceDecay: 0.05,
      agendaStaleness: 0.10,
      talkSkew: 0.20,
      decisionRatioScore: 0.15,
      declineRate: 0.05,
    },
    occurrences: [
      { id: 'retro_1', date: '2026-05-15', acceptedCount: 7, declinedCount: 0, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 6, agendaText: 'Sprint 14 Retro board review', wasRescheduled: false },
      { id: 'retro_2', date: '2026-05-29', acceptedCount: 7, declinedCount: 0, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 5, agendaText: 'Sprint 15 Retro board review', wasRescheduled: false },
      { id: 'retro_3', date: '2026-06-12', acceptedCount: 6, declinedCount: 1, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 5, agendaText: 'Sprint 16 Retro board review', wasRescheduled: false },
      { id: 'retro_4', date: '2026-06-26', acceptedCount: 7, declinedCount: 0, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 6, agendaText: 'Sprint 17 Retro board review', wasRescheduled: false },
      { id: 'retro_5', date: '2026-07-10', acceptedCount: 7, declinedCount: 0, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 4, agendaText: 'Sprint 18 Retro board review', wasRescheduled: false },
      { id: 'retro_6', date: '2026-07-24', acceptedCount: 6, declinedCount: 1, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 5, agendaText: 'Sprint 19 Retro board review', wasRescheduled: false },
      { id: 'retro_7', date: '2026-08-07', acceptedCount: 7, declinedCount: 0, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 6, agendaText: 'Sprint 20 Retro board review', wasRescheduled: false },
      { id: 'retro_8', date: '2026-08-21', acceptedCount: 7, declinedCount: 0, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 5, agendaText: 'Sprint 21 Retro board review', wasRescheduled: false },
      { id: 'retro_9', date: '2026-09-04', acceptedCount: 6, declinedCount: 1, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 6, agendaText: 'Sprint 22 Retro board review', wasRescheduled: false },
      { id: 'retro_10', date: '2026-09-18', acceptedCount: 7, declinedCount: 0, attendeeCount: 7, durationMinutes: 45, actionItemsLogged: 5, agendaText: 'Sprint 23 Retro board review', wasRescheduled: false },
    ],
  },
  {
    id: 'meet_new_product',
    title: 'New AI Features Taskforce',
    organizerEmail: 'dave.founder@company.io',
    durationMinutes: 30,
    recurrenceRule: 'RRULE:FREQ=WEEKLY;BYDAY=WE',
    status: 'active',
    isObservationMode: true,
    score: 0,
    recommendation: 'observation',
    annualWasteDollars: 0,
    hoursReclaimablePerMonth: 0,
    attendeeCount: 5,
    occurrencesLogged: 3,
    lastOccurrenceDate: '2026-09-23',
    breakdown: {
      attendanceDecay: 0,
      agendaStaleness: 0,
      talkSkew: 0,
      decisionRatioScore: 0,
      declineRate: 0,
    },
    occurrences: [
      { id: 'task_1', date: '2026-09-09', acceptedCount: 5, declinedCount: 0, attendeeCount: 5, durationMinutes: 30, actionItemsLogged: 3, agendaText: 'Kickoff: v2 AI integration scope', wasRescheduled: false },
      { id: 'task_2', date: '2026-09-16', acceptedCount: 5, declinedCount: 0, attendeeCount: 5, durationMinutes: 30, actionItemsLogged: 2, agendaText: 'Prototype review & user interviews', wasRescheduled: false },
      { id: 'task_3', date: '2026-09-23', acceptedCount: 4, declinedCount: 1, attendeeCount: 5, durationMinutes: 30, actionItemsLogged: 2, agendaText: 'API latency benchmarks', wasRescheduled: false },
    ],
  },
  {
    id: 'meet_marketing_weekly',
    title: 'Marketing Pipeline Standup',
    organizerEmail: 'rachel.mktg@company.io',
    durationMinutes: 45,
    recurrenceRule: 'RRULE:FREQ=WEEKLY;BYDAY=TU',
    status: 'active',
    isObservationMode: false,
    score: 76,
    recommendation: 'kill',
    annualWasteDollars: 22440,
    hoursReclaimablePerMonth: 22,
    attendeeCount: 9,
    occurrencesLogged: 9,
    lastOccurrenceDate: '2026-09-22',
    breakdown: {
      attendanceDecay: 0.75,
      agendaStaleness: 0.90,
      talkSkew: 0.60,
      decisionRatioScore: 0.85,
      declineRate: 0.38,
    },
    occurrences: [
      { id: 'mktg_1', date: '2026-07-28', acceptedCount: 9, declinedCount: 0, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 3, agendaText: 'Campaign review Q3', wasRescheduled: false },
      { id: 'mktg_2', date: '2026-08-04', acceptedCount: 8, declinedCount: 1, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 2, agendaText: 'Pipeline review', wasRescheduled: false },
      { id: 'mktg_3', date: '2026-08-11', acceptedCount: 7, declinedCount: 2, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 1, agendaText: 'Pipeline review', wasRescheduled: false },
      { id: 'mktg_4', date: '2026-08-18', acceptedCount: 6, declinedCount: 3, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 0, agendaText: 'Pipeline review', wasRescheduled: true },
      { id: 'mktg_5', date: '2026-08-25', acceptedCount: 5, declinedCount: 4, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 0, agendaText: 'Pipeline review', wasRescheduled: false },
      { id: 'mktg_6', date: '2026-09-01', acceptedCount: 4, declinedCount: 5, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 0, agendaText: 'Pipeline review', wasRescheduled: false },
      { id: 'mktg_7', date: '2026-09-08', acceptedCount: 3, declinedCount: 6, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 0, agendaText: 'Pipeline review', wasRescheduled: false },
      { id: 'mktg_8', date: '2026-09-15', acceptedCount: 4, declinedCount: 5, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 0, agendaText: 'Pipeline review', wasRescheduled: false },
      { id: 'mktg_9', date: '2026-09-22', acceptedCount: 3, declinedCount: 6, attendeeCount: 9, durationMinutes: 45, actionItemsLogged: 0, agendaText: 'Pipeline review', wasRescheduled: true },
    ],
  },
];
