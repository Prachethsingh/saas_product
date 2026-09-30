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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-900 border border-slate-800 text-white text-xs shadow-lg font-mono">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Recurring Calendar Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyzed 90-day attendance metrics and engagement health across {meetings.length} recurring series.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Loaded Rate Adjuster */}
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600">Loaded Rate:</span>
            <input
              type="range"
              min="50"
              max="150"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-24 accent-slate-800 cursor-pointer"
            />
            <span className="font-mono font-semibold text-slate-900 tabular-nums">${hourlyRate}/hr</span>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-guide'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Audit Guide</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <LiquidGlassCard variant="danger" className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Est. Annual Cost</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-rose-600 mt-1 tabular-nums">
            ${dynamicAnnualWaste.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 font-sans">/yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Calculated at ${hourlyRate}/hr</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Reclaimable Hours</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
            {totalHoursReclaimable}
            <span className="text-xs font-normal text-slate-500 font-sans"> hrs/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approx. {Math.round(totalHoursReclaimable * 12)} team hours/yr</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="warning" className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Review Candidates</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1 flex items-baseline gap-1.5 tabular-nums">
            <span className="text-rose-600">{killCount}</span>
            <span className="text-xs font-normal text-slate-500 font-sans">sunset</span>
            <span className="text-slate-300">/</span>
            <span className="text-amber-700">{shortenCount}</span>
            <span className="text-xs font-normal text-slate-500 font-sans">shorten</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{healthyCount} series verified healthy</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Baseline Calibration</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
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
      <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 flex items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            <strong className="text-slate-800">Minimum Baseline Requirement:</strong> Series require at least 6 occurrences before scoring to prevent false positives from short sprints or seasonal changes.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[11px] text-slate-500 shrink-0">
          N &ge; 6 Baseline Rule
        </span>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All ({meetings.length})
          </button>
          <button
            onClick={() => setFilter('kill')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'kill'
                ? 'bg-rose-600 text-white font-medium'
                : 'text-slate-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200'
            }`}
          >
            Sunset Recommended ({killCount})
          </button>
          <button
            onClick={() => setFilter('shorten')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'shorten'
                ? 'bg-amber-600 text-white font-medium'
                : 'text-slate-600 hover:text-amber-800 bg-white hover:bg-amber-50 border border-slate-200'
            }`}
          >
            Shorten Recommended ({shortenCount})
          </button>
          <button
            onClick={() => setFilter('healthy')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'healthy'
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-slate-600 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            Healthy ({healthyCount})
          </button>
          <button
            onClick={() => setFilter('observation')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'observation'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Baseline ({observationCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search title or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-mono"
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
