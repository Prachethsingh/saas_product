import { NextResponse } from 'next/server';
import { runNightlyRescoreJob } from '@/jobs/rescore';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In production with a secret, verify authorization
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runNightlyRescoreJob();
    return NextResponse.json({
      success: true,
      job: 'nightly_rescore',
      timestamp: new Date().toISOString(),
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
