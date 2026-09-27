import { NextResponse } from 'next/server';
import { generateSlackDraft, sendSlackWebhook } from '@/lib/slack';
import { getMeetingById } from '@/lib/server-db';

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
    const foundMeeting = meetingId ? await getMeetingById(meetingId) : null;
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

    // If user provided a webhook URL or channel, send it directly to Slack
    let sentToSlack = false;
    let channelResult = null;
    const messageText = body.customText || draft.text;

    if (webhookUrl) {
      const payload = body.customText
        ? { text: messageText }
        : draft.mrkdwnPayload;
      await sendSlackWebhook(webhookUrl, payload);
      sentToSlack = true;
    } else if (body.channel) {
      if (!process.env.SLACK_BOT_TOKEN) {
        return NextResponse.json(
          { success: false, error: 'SLACK_BOT_TOKEN is not configured in environment.' },
          { status: 400 }
        );
      }
      const { postSlackMessage } = await import('@/lib/slack');
      channelResult = await postSlackMessage({
        channel: body.channel.trim(),
        text: messageText,
        blocks: body.customText
          ? [
              {
                type: 'section',
                text: { type: 'mrkdwn', text: messageText },
              },
            ]
          : draft.mrkdwnPayload.blocks,
      });
      sentToSlack = true;
    }

    return NextResponse.json({
      success: true,
      draft,
      sentToSlack,
      channelResult,
    });
  } catch (error: any) {
    let msg = error.message || 'Failed to dispatch Slack message';
    if (msg.includes('channel_not_found')) {
      msg = 'Channel not found. Please provide the Slack Channel ID (e.g. C0123456789) found under Channel Details → About in Slack.';
    } else if (msg.includes('not_in_channel')) {
      msg = 'The bot is not in this private channel. Either invite @meetingdebt to the channel or use a public channel.';
    }
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
