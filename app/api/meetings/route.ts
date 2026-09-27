import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMeetings } from '@/lib/server-db';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user);

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter'); // 'all' | 'kill' | 'shorten' | 'healthy' | 'observation'

  // Fetch from Postgres (if configured) or fallback to demo data
  const rawMeetings = await getMeetings(filter);

  // Redact personal email addresses if unauthenticated to protect PII
  const meetings = rawMeetings.map((m) => ({
    ...m,
    organizerEmail: isAuthenticated ? m.organizerEmail : '[Protected]',
  }));

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
