import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      scoringEngine: 'active',
      calendarIntegration: 'ready',
      slackDispatcher: 'ready',
      stripeBilling: 'ready',
    },
  });
}
