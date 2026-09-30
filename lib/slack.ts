/**
 * Slack Integration & Auto-Draft Message Generator
 * Generates courteous, data-backed Slack notice drafts for recurring meetings.
 */

export interface SlackDraftParams {
  meetingTitle: string;
  zombieScore: number;
  recommendation: 'kill' | 'shorten' | 'healthy' | 'observation';
  earlyAvgAccepted?: number;
  recentAvgAccepted?: number;
  durationMinutes: number;
  attendeeCount?: number;
  hoursReclaimablePerMonth: number;
  estimatedAnnualWasteDollars?: number;
  channelOrRecipient?: string;
  organizerName?: string;
}

export interface SlackDraftMessage {
  text: string;
  subject: string;
  mrkdwnPayload: {
    blocks: Array<Record<string, unknown>>;
  };
}

export function generateSlackDraft(params: SlackDraftParams): SlackDraftMessage {
  const {
    meetingTitle,
    zombieScore,
    recommendation,
    earlyAvgAccepted = 8,
    recentAvgAccepted = 3,
    durationMinutes,
    hoursReclaimablePerMonth,
  } = params;

  if (recommendation === 'kill' || zombieScore >= 70) {
    const rawText = 
`Team: I have been reviewing our recurring syncs to protect everyone's deep-work focus time.

Over the last 8 occurrences of *${meetingTitle}*, accepted attendance dropped from ~${Math.round(earlyAvgAccepted)} down to ~${Math.round(recentAvgAccepted)} attendees, and routine updates can be shared asynchronously.

Proposal: Cancel this recurring calendar slot and move our updates to an async weekly thread in this channel instead.

This recovers approximately ${hoursReclaimablePerMonth} hours/month of uninterrupted engineering time across the team.

Please comment with your thoughts or let me know if there is a critical topic that still requires live synchronous discussion.`;

    return {
      subject: `Proposal: Sunset recurring "${meetingTitle}" & switch to async`,
      text: rawText,
      mrkdwnPayload: {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `Schedule Review: Sunset "${meetingTitle}"?`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Team: Calendar audit flagged *${meetingTitle}* as a candidate to transition to async updates.\n\n*Signal summary:* Composite score is *${zombieScore}/100*. Active attendance declined from *${earlyAvgAccepted}* to *${recentAvgAccepted}* participants over the last 2 months.`,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Time Reclaimed:*\n~${hoursReclaimablePerMonth} team hrs/mo`,
              },
              {
                type: 'mrkdwn',
                text: `*Alternative:*\nAsync Weekly Status Thread`,
              },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'Sunset Series' },
                style: 'danger',
                value: 'kill_meeting',
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: 'Keep As-Is' },
                value: 'keep_meeting',
              },
            ],
          },
        ],
      },
    };
  }

  if (recommendation === 'shorten' || zombieScore >= 40) {
    const suggestedDuration = durationMinutes > 30 ? 25 : 15;
    const rawText = 
`Team: Proposing a duration adjustment for *${meetingTitle}*.

Right now we have ${durationMinutes} minutes scheduled on the calendar. To keep the discussion crisp and give everyone recovery time between back-to-back calls:

Proposal: Trim this meeting from *${durationMinutes}m to ${suggestedDuration}m*, and require a brief written agenda in the calendar invite description.

Please comment if that works for you starting next week.`;

    return {
      subject: `Proposal: Shorten "${meetingTitle}" from ${durationMinutes}m to ${suggestedDuration}m`,
      text: rawText,
      mrkdwnPayload: {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `Shorten "${meetingTitle}"?`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Proposing we trim *${meetingTitle}* from *${durationMinutes} minutes* down to *${suggestedDuration} minutes* to increase focus and avoid fatigue.`,
            },
          },
        ],
      },
    };
  }

  // Healthy
  return {
    subject: `Meeting Review: "${meetingTitle}" is high-performing`,
    text: `Notice: "${meetingTitle}" has high attendance and consistent participation. No schedule changes recommended.`,
    mrkdwnPayload: {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${meetingTitle}* is currently healthy with high participation rates.`,
          },
        },
      ],
    },
  };
}

export async function sendSlackWebhook(webhookUrl: string, payload: unknown) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to send Slack webhook: ${await res.text()}`);
  }
  return true;
}

export async function postSlackMessage(options: {
  channel: string;
  blocks?: Array<Record<string, unknown>>;
  text?: string;
  botToken?: string;
}) {
  const token = options.botToken || process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error('SLACK_BOT_TOKEN is not configured.');
  }

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      channel: options.channel,
      text: options.text,
      blocks: options.blocks,
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error || 'Unknown error'}`);
  }
  return data;
}
