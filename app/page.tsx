'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sliders, 
  Info, 
  Check,
  BookOpen,
  ArrowRight,
  Search
} from 'lucide-react';
import { MeetingCard } from '@/components/meeting-card';
import { SlackModal } from '@/components/slack-modal';
import { MeetingSimulator } from '@/components/meeting-simulator';
import { MeetingRecord, INITIAL_DEMO_MEETINGS } from '@/lib/db';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { VitalsHero } from '@/components/vitals-hero';

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
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status: nextStatus as any } : m))
    );

    if (nextStatus === 'killed') {
      const found = meetings.find(m => m.id === meetingId);
      showToast(`Series archived. Estimated recovery: +${found?.hoursReclaimablePerMonth || 20} hrs/mo.`);
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
    showToast(`Added "${newMeeting.title}" to active audit.`);
  };

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
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white text-slate-800 text-xs shadow-xl font-medium">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Vitals Hero Dashboard (Reproducing the Serene Glassmorphic Mobile App Aesthetic) */}
      <VitalsHero
        totalReclaimableHours={totalHoursReclaimable}
        annualWaste={dynamicAnnualWaste}
        hourlyRate={hourlyRate}
        killCount={killCount}
        shortenCount={shortenCount}
        healthyCount={healthyCount}
        onOpenGuide={() => window.dispatchEvent(new CustomEvent('open-guide'))}
        onOpenSimulator={() => {
          const el = document.getElementById('meeting-simulator');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPricing={() => window.dispatchEvent(new CustomEvent('open-pricing'))}
      />

      {/* Loaded Rate Adjuster Bar */}
      <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-3.5 shadow-[0_4px_16px_-2px_rgba(15,60,110,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-semibold text-slate-700">Team Hourly Loaded Rate:</span>
          <span className="font-mono font-bold text-sky-950 text-xs">${hourlyRate}/hr</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="50"
            max="150"
            step="5"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-36 accent-sky-600 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-sky-800/80 bg-sky-50 px-2 py-1 rounded-lg border border-sky-100">
            $50–$150/hr
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <LiquidGlassCard variant="danger" interactive={true} className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Est. Annual Cost</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-rose-600 mt-1 tabular-nums">
            ${dynamicAnnualWaste.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 font-sans">/yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Calculated at ${hourlyRate}/hr</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" interactive={true} className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Reclaimable Hours</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-sky-950 mt-1 tabular-nums">
            {totalHoursReclaimable}
            <span className="text-xs font-normal text-slate-500 font-sans"> hrs/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approx. {Math.round(totalHoursReclaimable * 12)} team hours/yr</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="warning" interactive={true} className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Review Candidates</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-sky-950 mt-1 flex items-baseline gap-1.5 tabular-nums">
            <span className="text-rose-600">{killCount}</span>
            <span className="text-xs font-normal text-slate-500 font-sans">sunset</span>
            <span className="text-slate-300">/</span>
            <span className="text-amber-700">{shortenCount}</span>
            <span className="text-xs font-normal text-slate-500 font-sans">shorten</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{healthyCount} series verified healthy</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" interactive={true} className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Baseline Calibration</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-sky-950 mt-1 tabular-nums">
            {observationCount}
            <span className="text-xs font-normal text-slate-500 font-sans"> series</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under 6 recorded occurrences</div>
        </LiquidGlassCard>
      </div>

      {/* Simulator Section */}
      <div id="meeting-simulator">
        <MeetingSimulator
          hourlyRate={hourlyRate}
          onAddMeeting={handleAddSimulatedMeeting}
          onOpenSlackDraft={(m) => setSelectedSlackMeeting(m)}
        />
      </div>

      {/* Baseline Policy Notice */}
      <div className="rounded-2xl border border-white/80 bg-white/55 backdrop-blur-xl px-4 py-3 flex items-start sm:items-center justify-between gap-3 text-xs text-slate-600 shadow-xs transition-all duration-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong className="text-sky-950">Minimum Baseline Requirement:</strong> Series require at least 6 occurrences before scoring to prevent false positives from short sprints or seasonal changes.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[11px] text-sky-800/70 shrink-0">
          N &ge; 6 Baseline Rule
        </span>
      </div>

      {/* Filters and Search Bar */}
      <div id="audit-list" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Filter Segmented Controls */}
        <div className="p-1 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center gap-1 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ease-spring ${
              filter === 'all'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-sky-950 hover:bg-white/40'
            }`}
          >
            All ({meetings.length})
          </button>
          <button
            onClick={() => setFilter('kill')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ease-spring ${
              filter === 'kill'
                ? 'bg-rose-500 text-white font-semibold shadow-xs'
                : 'text-rose-700 hover:text-rose-900 hover:bg-rose-50/50'
            }`}
          >
            Sunset ({killCount})
          </button>
          <button
            onClick={() => setFilter('shorten')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ease-spring ${
              filter === 'shorten'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/50'
            }`}
          >
            Shorten ({shortenCount})
          </button>
          <button
            onClick={() => setFilter('healthy')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ease-spring ${
              filter === 'healthy'
                ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50/50'
            }`}
          >
            Healthy ({healthyCount})
          </button>
          <button
            onClick={() => setFilter('observation')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ease-spring ${
              filter === 'observation'
                ? 'bg-sky-800 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-sky-950 hover:bg-white/40'
            }`}
          >
            Baseline ({observationCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-sky-500" />
          <input
            type="text"
            placeholder="Search series title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-2xl bg-white/65 backdrop-blur-xl border border-white/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white/90 font-mono shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Meeting Cards List */}
      {filteredMeetings.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-200 rounded-md bg-white p-6">
          <p className="text-xs text-slate-500">No recurring series match the active filter.</p>
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

      {/* Slack Modal */}
      <SlackModal
        isOpen={Boolean(selectedSlackMeeting)}
        meeting={selectedSlackMeeting}
        onClose={() => setSelectedSlackMeeting(null)}
      />
    </div>
  );
}
