'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Clock, 
  Search, 
  Sliders, 
  Info, 
  Flame,
  CheckCircle2,
  Sparkles,
  Check
} from 'lucide-react';
import { MeetingCard } from '@/components/meeting-card';
import { SlackModal } from '@/components/slack-modal';
import { MeetingSimulator } from '@/components/meeting-simulator';
import { MeetingRecord, INITIAL_DEMO_MEETINGS } from '@/lib/db';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>(INITIAL_DEMO_MEETINGS);
  const [filter, setFilter] = useState<'all' | 'kill' | 'shorten' | 'healthy' | 'observation'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hourlyRate, setHourlyRate] = useState(85);
  const [selectedSlackMeeting, setSelectedSlackMeeting] = useState<MeetingRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    // Background sync from API if server has updated entries
    fetch('/api/meetings')
      .then((res) => res.json())
      .then((data) => {
        if (data.meetings && data.meetings.length > 0) {
          setMeetings(data.meetings);
        }
      })
      .catch((err) => {
        console.warn('Using local demo calendar telemetry:', err);
      });
  }, []);

  const handleToggleStatus = async (meetingId: string, nextStatus: string) => {
    // Optimistic UI update for instant feedback
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status: nextStatus as any } : m))
    );

    if (nextStatus === 'killed') {
      const found = meetings.find(m => m.id === meetingId);
      showToast(`🎉 Sunset confirmed! Reclaimed +${found?.hoursReclaimablePerMonth || 20} hrs/mo for your team.`);
    } else {
      showToast('Meeting series reactivated.');
    }

    try {
      await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (e) {
      console.error('Failed to sync status update:', e);
    }
  };

  const handleAddSimulatedMeeting = (newMeeting: MeetingRecord) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    showToast(`Added "${newMeeting.title}" to your active audit dashboard!`);
  };

  // Instant in-memory search and category filtering
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.organizerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === 'all') return true;
      if (filter === 'kill') return !m.isObservationMode && m.recommendation === 'kill';
      if (filter === 'shorten') return !m.isObservationMode && m.recommendation === 'shorten';
      if (filter === 'healthy') return !m.isObservationMode && m.recommendation === 'healthy';
      if (filter === 'observation') return m.isObservationMode;
      return true;
    });
  }, [meetings, searchQuery, filter]);

  // Dynamic KPI aggregates
  const totalHoursReclaimable = useMemo(() => {
    return meetings.reduce((sum, m) => sum + (m.status !== 'killed' ? (m.hoursReclaimablePerMonth || 0) : 0), 0);
  }, [meetings]);

  const dynamicAnnualWaste = useMemo(() => {
    return Math.round(totalHoursReclaimable * 12 * hourlyRate);
  }, [totalHoursReclaimable, hourlyRate]);

  const killCount = useMemo(() => meetings.filter((m) => !m.isObservationMode && m.recommendation === 'kill').length, [meetings]);
  const shortenCount = useMemo(() => meetings.filter((m) => !m.isObservationMode && m.recommendation === 'shorten').length, [meetings]);
  const healthyCount = useMemo(() => meetings.filter((m) => !m.isObservationMode && m.recommendation === 'healthy').length, [meetings]);
  const observationCount = useMemo(() => meetings.filter((m) => m.isObservationMode).length, [meetings]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/20 text-white text-xs shadow-2xl backdrop-blur-2xl animate-fade-in font-mono">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title & Loaded Rate Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md text-[11px] font-mono text-zinc-300 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Interactive Telemetry Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Recurring Calendar Audit
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Analyzing 90-day calendar telemetry across {meetings.length} recurring series.
          </p>
        </div>

        {/* Loaded Rate Adjuster Glass Capsule */}
        <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] rounded-lg px-3 py-1.5 text-xs">
          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400">Loaded Cost:</span>
          <input
            type="range"
            min="50"
            max="150"
            step="5"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-24 accent-zinc-200 cursor-pointer"
          />
          <span className="font-mono font-medium text-white tabular-nums">${hourlyRate}/hr</span>
        </div>
      </div>

      {/* KPI Overview Grid - Apple Liquid Glass Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <LiquidGlassCard variant="danger" className="p-4">
          <div className="text-[11px] font-mono uppercase text-zinc-400">Est. Payroll Burn</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-rose-300 mt-1 tabular-nums drop-shadow-sm">
            ${dynamicAnnualWaste.toLocaleString()}
            <span className="text-xs font-normal text-zinc-400 font-sans">/yr</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Recalculated at ${hourlyRate}/hr</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-zinc-400">Reclaimable Focus</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-100 mt-1 tabular-nums">
            {totalHoursReclaimable}
            <span className="text-xs font-normal text-zinc-400 font-sans"> hrs/mo</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">~{Math.round(totalHoursReclaimable * 12)} engineering hrs/yr</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="warning" className="p-4">
          <div className="text-[11px] font-mono uppercase text-zinc-400">Intervention Targets</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-100 mt-1 flex items-baseline gap-1.5 tabular-nums">
            <span className="text-rose-400">{killCount}</span>
            <span className="text-xs font-normal text-zinc-400 font-sans">kill</span>
            <span className="text-zinc-600">/</span>
            <span className="text-amber-400">{shortenCount}</span>
            <span className="text-xs font-normal text-zinc-400 font-sans">shorten</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">{healthyCount} verified healthy</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-zinc-400">Observation Mode</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-200 mt-1 tabular-nums">
            {observationCount}
            <span className="text-xs font-normal text-zinc-400 font-sans"> series</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Gathering initial 6 occurrences</div>
        </LiquidGlassCard>
      </div>

      {/* Interactive Meeting Doctor & Simulator */}
      <MeetingSimulator
        hourlyRate={hourlyRate}
        onAddMeeting={handleAddSimulatedMeeting}
        onOpenSlackDraft={(m) => setSelectedSlackMeeting(m)}
      />

      {/* Observation Mode Notice */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl px-4 py-3 flex items-start sm:items-center justify-between gap-3 text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2.5 text-zinc-400">
          <Info className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>
            <strong className="text-zinc-200">Observation Baseline Rule:</strong> We require at least 6 occurrences before computing a score to eliminate false positives from short-term sprints or seasonal holidays.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[11px] text-zinc-500 shrink-0">
          N ≥ 6 Baseline Rule
        </span>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Filter Glass Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full font-mono transition-all backdrop-blur-md cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08]'
            }`}
          >
            All ({meetings.length})
          </button>
          <button
            onClick={() => setFilter('kill')}
            className={`px-3 py-1.5 rounded-full font-mono transition-all backdrop-blur-md cursor-pointer ${
              filter === 'kill'
                ? 'bg-rose-500 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'text-zinc-400 hover:text-rose-300 bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.08]'
            }`}
          >
            Needs Sunset ({killCount})
          </button>
          <button
            onClick={() => setFilter('shorten')}
            className={`px-3 py-1.5 rounded-full font-mono transition-all backdrop-blur-md cursor-pointer ${
              filter === 'shorten'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-zinc-400 hover:text-amber-300 bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.08]'
            }`}
          >
            Shorten ({shortenCount})
          </button>
          <button
            onClick={() => setFilter('healthy')}
            className={`px-3 py-1.5 rounded-full font-mono transition-all backdrop-blur-md cursor-pointer ${
              filter === 'healthy'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-zinc-400 hover:text-emerald-300 bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.08]'
            }`}
          >
            Healthy ({healthyCount})
          </button>
          <button
            onClick={() => setFilter('observation')}
            className={`px-3 py-1.5 rounded-full font-mono transition-all backdrop-blur-md cursor-pointer ${
              filter === 'observation'
                ? 'bg-zinc-700 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08]'
            }`}
          >
            Observing ({observationCount})
          </button>
        </div>

        {/* Search Glass Capsule */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter by title or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] font-mono"
          />
        </div>
      </div>

      {/* Meeting Cards List */}
      {filteredMeetings.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/[0.08] rounded-xl bg-white/[0.02] backdrop-blur-md p-8">
          <p className="text-xs text-zinc-400">No recurring series match the active filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              hourlyRate={hourlyRate}
              onOpenSlackDraft={(m) => setSelectedSlackMeeting(m)}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Slack Modal for Auto-Draft */}
      <SlackModal
        isOpen={Boolean(selectedSlackMeeting)}
        meeting={selectedSlackMeeting}
        onClose={() => setSelectedSlackMeeting(null)}
      />
    </div>
  );
}
