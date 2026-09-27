import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, INITIAL_DEMO_MEETINGS } from '@/lib/db';
import { calculateZombieScore } from '@/lib/scoring';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter'); // 'all' | 'kill' | 'shorten' | 'healthy' | 'observation'

  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('meeting_health_summary').select('*');
    if (filter && filter !== 'all') {
      if (filter === 'observation') {
        query = query.eq('is_observation_mode', true);
      } else {
        query = query.eq('latest_recommendation', filter);
      }
    }
    const { data, error } = await query;
    if (!error && data) {
      return NextResponse.json({ meetings: data });
    }
  }

  // Fallback to rich demo data
  let meetings = [...INITIAL_DEMO_MEETINGS];
  if (filter && filter !== 'all') {
    if (filter === 'observation') {
      meetings = meetings.filter((m) => m.isObservationMode);
    } else {
      meetings = meetings.filter((m) => !m.isObservationMode && m.recommendation === filter);
    }
  }

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
