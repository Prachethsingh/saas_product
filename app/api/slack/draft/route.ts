import { NextResponse } from 'next/server';
import { generateSlackDraft, sendSlackWebhook } from '@/lib/slack';
import { INITIAL_DEMO_MEETINGS } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      meetingId,
      meetingTitle,
      zombieScore,
      recommendation,
      durationMinutes,
      attendeeCount,
      hoursReclaimablePerMonth,
      earlyAvgAccepted,
      recentAvgAccepted,
      webhookUrl,
    } = body;

    // If meetingId provided, find details
    const foundMeeting = INITIAL_DEMO_MEETINGS.find((m) => m.id === meetingId);
    const title = meetingTitle || foundMeeting?.title || 'Team Sync';
    const score = zombieScore ?? foundMeeting?.score ?? 75;
    const rec = recommendation || foundMeeting?.recommendation || 'kill';
    const duration = durationMinutes || foundMeeting?.durationMinutes || 45;
    const attendees = attendeeCount || foundMeeting?.attendeeCount || 6;
    const hoursSaved = hoursReclaimablePerMonth || foundMeeting?.hoursReclaimablePerMonth || 16;

    const draft = generateSlackDraft({
      meetingTitle: title,
      zombieScore: score,
      recommendation: rec,
      durationMinutes: duration,
      attendeeCount: attendees,
      hoursReclaimablePerMonth: hoursSaved,
      earlyAvgAccepted,
      recentAvgAccepted,
    });

    // If user provided a webhook URL, send it directly to Slack
    let sentToSlack = false;
    if (webhookUrl) {
      await sendSlackWebhook(webhookUrl, draft.mrkdwnPayload);
      sentToSlack = true;
    }

    return NextResponse.json({
      success: true,
      draft,
      sentToSlack,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate Slack draft' },
      { status: 500 }
    );
  }
}
