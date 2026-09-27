import { NextResponse } from 'next/server';
import { runNightlyRescoreJob } from '@/jobs/rescore';

export async function POST(request: Request) {
  try {
    const summary = await runNightlyRescoreJob();
    return NextResponse.json({
      success: true,
      message: 'Calendar sync and zombie score recalculation completed successfully.',
      summary,
    });
  } catch (error: any) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync calendar' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    syncScope: 'https://www.googleapis.com/auth/calendar.readonly',
    supportedIntervals: ['nightly', 'on_demand'],
  });
}
