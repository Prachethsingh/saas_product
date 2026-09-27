import { NextResponse } from 'next/server';
import { getMeetings } from '@/lib/server-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter'); // 'all' | 'kill' | 'shorten' | 'healthy' | 'observation'

  // Fetch from Postgres (if configured) or fallback to demo data
  const meetings = await getMeetings(filter);

  // Calculate executive totals
  const totalAnnualWaste = meetings.reduce((sum, m) => sum + (m.annualWasteDollars || 0), 0);
  const totalHoursReclaimable = meetings.reduce((sum, m) => sum + (m.hoursReclaimablePerMonth || 0), 0);
  const killCount = meetings.filter((m) => m.recommendation === 'kill').length;
  const shortenCount = meetings.filter((m) => m.recommendation === 'shorten').length;
  const healthyCount = meetings.filter((m) => m.recommendation === 'healthy').length;
  const observationCount = meetings.filter((m) => m.isObservationMode).length;

  return NextResponse.json({
    meetings,
    stats: {
      totalMeetings: meetings.length,
      killCount,
      shortenCount,
      healthyCount,
      observationCount,
      totalAnnualWaste,
      totalHoursReclaimable,
    },
  });
}
