'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Check, 
  ChevronDown, 
  ChevronUp
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
}: MeetingSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Weekly Engineering Sync');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [attendeeCount, setAttendeeCount] = useState(10);
  const [recentAttendees, setRecentAttendees] = useState(4);
  const [staleStreak, setStaleStreak] = useState(5);
  const [actionItems, setActionItems] = useState(0);
  const [added, setAdded] = useState(false);

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
      title: title || 'Simulated Recurring Meeting',
      organizerEmail: 'team@company.internal',
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
      className="p-4 sm:p-5 border"
    >
      {/* Header bar that toggles expand */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900">
                Schedule Impact Calculator
              </span>
              <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                Interactive Model
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate prospective recurring meetings to calculate time cost and projected score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ScoreBadge
            score={simResult.score}
            recommendation={simResult.recommendation}
            size="sm"
          />
          <button className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls */}
      {isOpen && (
        <div className="mt-5 pt-4 border-t border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Title & Duration */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Series Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
              />
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Duration:</span>
                  <span className="font-mono text-slate-900 font-semibold">{durationMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Attendance Sliders */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Total Invitees:</span>
                  <span className="font-mono text-slate-900 font-semibold">{attendeeCount}</span>
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
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Recent Accepted:</span>
                  <span className="font-mono text-slate-900 font-semibold">{recentAttendees}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={attendeeCount}
                  value={recentAttendees}
                  onChange={(e) => setRecentAttendees(Number(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Stale Agenda & Actions */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Identical Agenda Occurrences:</span>
                  <span className="font-mono text-slate-900 font-semibold">{staleStreak} in a row</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={staleStreak}
                  onChange={(e) => setStaleStreak(Number(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Logged Action Outcomes:</span>
                  <span className="font-mono text-slate-900 font-semibold">{actionItems}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={actionItems}
                  onChange={(e) => setActionItems(Number(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl p-4 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Projected Score</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-mono font-bold text-sky-950 tabular-nums">
                    {simResult.score}
                  </span>
                  <span className="text-xs text-sky-800/60 font-mono">/ 100</span>
                </div>
                <div className="text-xs text-sky-900 font-mono mt-1">
                  Est. Cost: ${simResult.estimatedAnnualWasteDollars.toLocaleString()}/yr
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className="w-full py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-sm transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{added ? 'Added to Audit' : 'Add to Dashboard'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LiquidGlassCard>
  );
}
