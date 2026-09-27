'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Sliders, 
  Flame, 
  Clock, 
  Users, 
  Plus, 
  Check, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { calculateZombieScore, OccurrenceInput } from '@/lib/scoring';
import { ScoreBadge } from './score-badge';
import { LiquidGlassCard } from './ui/liquid-glass';
import { MeetingRecord } from '@/lib/db';

interface MeetingSimulatorProps {
  hourlyRate: number;
  onAddMeeting: (newMeeting: MeetingRecord) => void;
  onOpenSlackDraft: (meeting: MeetingRecord) => void;
}

export function MeetingSimulator({
  hourlyRate,
  onAddMeeting,
  onOpenSlackDraft,
}: MeetingSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Weekly Team Alignment');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [attendeeCount, setAttendeeCount] = useState(10);
  const [recentAttendees, setRecentAttendees] = useState(4);
  const [staleStreak, setStaleStreak] = useState(5);
  const [actionItems, setActionItems] = useState(0);
  const [added, setAdded] = useState(false);

  // Generate synthetic occurrences based on simulator parameters
  const occurrences: OccurrenceInput[] = Array.from({ length: 8 }).map((_, i) => {
    const isEarly = i < 4;
    const accepted = isEarly
      ? attendeeCount
      : Math.round(attendeeCount - (attendeeCount - recentAttendees) * ((i - 3) / 4));
    return {
      date: new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      attendeeCount,
      acceptedCount: Math.max(1, accepted),
      declinedCount: attendeeCount - Math.max(1, accepted),
      durationMinutes,
      actionItemsLogged: actionItems,
      agendaText: staleStreak > 0 && i >= 8 - staleStreak ? 'Weekly updates & sync' : `Discussion topic ${i + 1}`,
      agendaHash: staleStreak > 0 && i >= 8 - staleStreak ? 'stale_hash' : `hash_${i}`,
    };
  });

  const simResult = calculateZombieScore(occurrences, hourlyRate);

  const handleAdd = () => {
    const newMeeting: MeetingRecord = {
      id: `sim_${Date.now()}`,
      title: title || 'Custom Simulated Sync',
      organizerEmail: 'you@company.io',
      durationMinutes,
      recurrenceRule: 'RRULE:FREQ=WEEKLY;BYDAY=TU',
      status: 'active',
      isObservationMode: false,
      score: simResult.score,
      recommendation: simResult.recommendation,
      annualWasteDollars: simResult.estimatedAnnualWasteDollars,
      hoursReclaimablePerMonth: simResult.hoursReclaimablePerMonth,
      attendeeCount,
      occurrencesLogged: occurrences.length,
      lastOccurrenceDate: new Date().toISOString().slice(0, 10),
      breakdown: {
        attendanceDecay: simResult.breakdown.attendanceDecay,
        agendaStaleness: simResult.breakdown.agendaStaleness,
        talkSkew: simResult.breakdown.talkSkew,
        decisionRatioScore: simResult.breakdown.decisionRatioScore,
        declineRate: simResult.breakdown.declineRate,
      },
      occurrences: occurrences.map((o, idx) => ({
        id: `sim_occ_${idx}`,
        date: typeof o.date === 'string' ? o.date : o.date.toISOString().slice(0, 10),
        acceptedCount: o.acceptedCount,
        declinedCount: o.declinedCount,
        attendeeCount: o.attendeeCount,
        durationMinutes: o.durationMinutes,
        actionItemsLogged: o.actionItemsLogged || 0,
        agendaText: o.agendaText || '',
        wasRescheduled: false,
      })),
    };

    onAddMeeting(newMeeting);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <LiquidGlassCard
      variant={simResult.score >= 70 ? 'danger' : simResult.score >= 40 ? 'warning' : 'neutral'}
      className="p-4 sm:p-5 transition-all border-dashed"
    >
      {/* Header bar that toggles expand */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] flex items-center justify-center text-amber-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">
                Live Zombie Simulator & Meeting Doctor
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
                Interactive Tool
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Drag sliders to test any recurring meeting and watch the score recalculate live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ScoreBadge
            score={simResult.score}
            recommendation={simResult.recommendation}
            size="sm"
          />
          <button className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Controls */}
      {isOpen && (
        <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-5 animate-fade-in">
          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Title & Duration */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-zinc-400">Meeting Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/[0.1] text-white focus:outline-none focus:border-white/30 font-mono shadow-inner"
              />
              <div className="pt-2">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Duration:</span>
                  <span className="font-mono text-white">{durationMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Attendance Sliders */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Invited Attendees:</span>
                  <span className="font-mono text-white">{attendeeCount}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  value={attendeeCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAttendeeCount(val);
                    if (recentAttendees > val) setRecentAttendees(val);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Recent Accepted:</span>
                  <span className="font-mono text-white">{recentAttendees}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={attendeeCount}
                  value={recentAttendees}
                  onChange={(e) => setRecentAttendees(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Stale Agenda & Actions */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Stale Agenda Streak:</span>
                  <span className="font-mono text-white">{staleStreak} in a row</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={staleStreak}
                  onChange={(e) => setStaleStreak(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Action Items Logged:</span>
                  <span className="font-mono text-white">{actionItems}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={actionItems}
                  onChange={(e) => setActionItems(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Real-time Calculation Result Box */}
            <div className="rounded-xl border border-white/[0.1] bg-black/50 p-3.5 flex flex-col justify-between shadow-inner">
              <div>
                <div className="text-[10px] uppercase font-mono text-zinc-400">Live Result</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-mono font-bold text-white tabular-nums">
                    {simResult.score}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                </div>
                <div className="text-xs text-rose-300 font-mono mt-1">
                  Est. Burn: ${simResult.estimatedAnnualWasteDollars.toLocaleString()}/yr
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-all flex items-center justify-center gap-1 shadow-md disabled:opacity-50"
                >
                  {added ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{added ? 'Added to List!' : 'Add to Dashboard'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LiquidGlassCard>
  );
}
