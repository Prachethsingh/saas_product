import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMeetingById, updateMeetingStatus } from '@/lib/server-db';
import { generateSlackDraft } from '@/lib/slack';
import { calculateZombieScore } from '@/lib/scoring';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user);

  const { id } = params;
  const rawMeeting = await getMeetingById(id);

  if (!rawMeeting) {
    return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
  }

  const meeting = {
    ...rawMeeting,
    organizerEmail: isAuthenticated ? rawMeeting.organizerEmail : '[Protected]',
  };

  // Recalculate score live with full occurrence metadata
  const occurrencesInput = meeting.occurrences.map((o) => ({
    date: o.date,
    attendeeCount: o.attendeeCount,
    acceptedCount: o.acceptedCount,
    declinedCount: o.declinedCount,
    durationMinutes: o.durationMinutes,
    actionItemsLogged: o.actionItemsLogged,
    agendaText: o.agendaText,
    wasRescheduled: o.wasRescheduled,
  }));

  const scoringResult = calculateZombieScore(occurrencesInput);

  // Generate Slack auto-draft
  const slackDraft = generateSlackDraft({
    meetingTitle: meeting.title,
    zombieScore: scoringResult.score,
    recommendation: scoringResult.recommendation,
    earlyAvgAccepted: scoringResult.breakdown.rawMetrics.earlyAvgAccepted,
    recentAvgAccepted: scoringResult.breakdown.rawMetrics.recentAvgAccepted,
    durationMinutes: meeting.durationMinutes,
    attendeeCount: meeting.attendeeCount,
    hoursReclaimablePerMonth: scoringResult.hoursReclaimablePerMonth,
    estimatedAnnualWasteDollars: scoringResult.estimatedAnnualWasteDollars,
  });

  // Prepare chart timeline
  const chartData = meeting.occurrences.map((o, idx) => ({
    date: o.date.slice(5), // '07-06'
    fullDate: o.date,
    occurrenceIndex: idx + 1,
    accepted: o.acceptedCount,
    declined: o.declinedCount,
    total: o.attendeeCount,
    actionItems: o.actionItemsLogged,
    durationMinutes: o.durationMinutes,
    agendaStale: !o.agendaText || o.agendaText.includes('sync & status') || o.agendaText.includes('updates'),
  }));

  return NextResponse.json({
    meeting,
    scoringResult,
    slackDraft,
    chartData,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();

  if (body.status) {
    await updateMeetingStatus(id, body.status);
  }

  const meeting = await getMeetingById(id);
  if (!meeting) {
    return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, meeting });
}
