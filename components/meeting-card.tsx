'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Users, 
  ArrowUpRight, 
  MessageSquare, 
  CalendarOff,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  TrendingDown,
  CheckSquare,
  Square
} from 'lucide-react';
import { ScoreBadge } from './score-badge';
import { MeetingRecord } from '@/lib/db';
import { LiquidGlassCard } from './ui/liquid-glass';

interface MeetingCardProps {
  meeting: MeetingRecord;
  hourlyRate?: number;
  onOpenSlackDraft: (meeting: MeetingRecord) => void;
  onToggleStatus?: (meetingId: string, status: string) => void;
}

export function MeetingCard({
  meeting,
  hourlyRate = 85,
  onOpenSlackDraft,
  onToggleStatus,
}: MeetingCardProps) {
  const isKilled = meeting.status === 'killed' || meeting.status === 'async';
  const [isExpanded, setIsExpanded] = useState(false);
  const [checklist, setChecklist] = useState({
    proposeAsync: false,
    cutDuration: false,
    requireAgenda: false,
  });

  // Calculate dynamic annual burn based on user's active slider rate
  const dynamicAnnualWaste = Math.round(meeting.hoursReclaimablePerMonth * 12 * hourlyRate);

  // Build inline mini sparkline of attendance decay
  const occHistory = meeting.occurrences || [];
  const maxAttendees = Math.max(...occHistory.map((o) => o.attendeeCount || 10), 10);

  const variant = meeting.score >= 70 ? 'danger' : meeting.score >= 40 ? 'warning' : 'neutral';

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <LiquidGlassCard
      variant={variant}
      interactive={!isKilled}
      className={`p-4 sm:p-5 transition-all ${isKilled ? 'opacity-50' : ''}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Main Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link 
              href={`/meetings/${meeting.id}`}
              className="font-semibold text-sm sm:text-base text-zinc-100 hover:text-white transition-colors truncate flex items-center gap-1.5 group"
            >
              <span>{meeting.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
            </Link>

            {isKilled && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/10 backdrop-blur-md">
                {meeting.status}
              </span>
            )}

            <ScoreBadge
              score={meeting.score}
              recommendation={meeting.recommendation}
              isObservation={meeting.isObservationMode}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
            <span className="font-mono text-zinc-400">{meeting.organizerEmail}</span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span className="font-mono">{meeting.durationMinutes}m</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-500" />
              <span className="font-mono">{meeting.attendeeCount} invitees</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-zinc-500">{meeting.occurrencesLogged} evts</span>
          </div>
        </div>

        {/* Mini Attendance Trend Sparkline Glass Pane */}
        {!meeting.isObservationMode && occHistory.length > 0 && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] shrink-0">
            <div className="text-[11px] text-zinc-400">
              <div className="text-[10px] uppercase font-mono text-zinc-500">Attendance Trend</div>
              <span className="font-mono tabular-nums text-zinc-200">
                {occHistory[0]?.acceptedCount || 0} → {occHistory[occHistory.length - 1]?.acceptedCount || 0} accepted
              </span>
            </div>
            <div className="flex items-end gap-1 h-7">
              {occHistory.slice(-8).map((occ, i) => {
                const pct = Math.max(12, Math.round((occ.acceptedCount / maxAttendees) * 100));
                const isLate = i >= 4;
                return (
                  <div
                    key={i}
                    style={{ height: `${pct}%` }}
                    className={`w-1.5 rounded-t-sm transition-all ${
                      isLate && occ.acceptedCount < (occHistory[0]?.acceptedCount || 5) * 0.5
                        ? 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                        : 'bg-zinc-500'
                    }`}
                    title={`${occ.date}: ${occ.acceptedCount} of ${occ.attendeeCount} accepted`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Financial Burn Metric */}
        <div className="text-right shrink-0">
          {dynamicAnnualWaste > 0 && !isKilled ? (
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-500">Est. Payroll Burn (${hourlyRate}/hr)</div>
              <div className="font-mono font-bold text-rose-300 text-sm tabular-nums drop-shadow-sm">
                ${dynamicAnnualWaste.toLocaleString()}<span className="text-xs font-normal text-zinc-500 font-sans">/yr</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-500">Status</div>
              <div className="font-mono text-xs text-zinc-400">
                {meeting.isObservationMode ? 'Observing' : isKilled ? 'Archived' : 'Healthy'}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-white/[0.06]">
          {!meeting.isObservationMode && meeting.score >= 40 && !isKilled && (
            <button
              onClick={() => onOpenSlackDraft(meeting)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
              <span>Auto-Draft Slack</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] backdrop-blur-md transition-all"
          >
            <span>{isExpanded ? 'Hide Details' : 'Quick Audit'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(meeting.id, isKilled ? 'active' : 'killed')}
              className={`p-1.5 rounded-lg text-xs transition-all border backdrop-blur-md ${
                isKilled
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-rose-400 hover:border-rose-400/30'
              }`}
              title={isKilled ? 'Reactivate series' : 'Mark as killed/sunset'}
            >
              {isKilled ? <CheckCircle className="w-3.5 h-3.5" /> : <CalendarOff className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Signals Mini Bar */}
      {!meeting.isObservationMode && (
        <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span>
              Attendance Decay:{' '}
              <strong className="font-mono text-zinc-200">
                {Math.round(meeting.breakdown.attendanceDecay * 100)}%
              </strong>
            </span>
            <span>
              Agenda Staleness:{' '}
              <strong className="font-mono text-zinc-200">
                {Math.round(meeting.breakdown.agendaStaleness * 100)}%
              </strong>
            </span>
            <span>
              Decline Rate:{' '}
              <strong className="font-mono text-zinc-200">
                {Math.round(meeting.breakdown.declineRate * 100)}%
              </strong>
            </span>
          </div>

          <div className="text-zinc-500 font-mono text-[10px]">
            Last evaluated: {meeting.lastOccurrenceDate}
          </div>
        </div>
      )}

      {/* Expandable Interactive Audit Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 5-Signal Breakdown Detail */}
            <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-2.5">
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Signal Breakdown</span>
                <span className="font-mono text-zinc-400 text-[11px]">Formula Weights</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                    <span>1. Attendance Decay (30%):</span>
                    <span className="font-mono text-rose-300 font-semibold">{Math.round(meeting.breakdown.attendanceDecay * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.round(meeting.breakdown.attendanceDecay * 100)}%` }} className="h-full bg-rose-500" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                    <span>2. Agenda Staleness (20%):</span>
                    <span className="font-mono text-amber-300 font-semibold">{Math.round(meeting.breakdown.agendaStaleness * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.round(meeting.breakdown.agendaStaleness * 100)}%` }} className="h-full bg-amber-500" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                    <span>3. Decline & Reschedule (10%):</span>
                    <span className="font-mono text-rose-300 font-semibold">{Math.round(meeting.breakdown.declineRate * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.round(meeting.breakdown.declineRate * 100)}%` }} className="h-full bg-rose-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Remediation Action Checklist */}
            <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-2.5">
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Remediation Checklist</span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  {Object.values(checklist).filter(Boolean).length}/3 Completed
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-300">
                <button
                  type="button"
                  onClick={() => toggleCheck('proposeAsync')}
                  className="w-full flex items-center gap-2 cursor-pointer p-1.5 rounded-lg text-left hover:bg-white/[0.06] transition-colors"
                >
                  {checklist.proposeAsync ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-zinc-500 shrink-0" />}
                  <span className={checklist.proposeAsync ? 'line-through text-zinc-500' : ''}>
                    Post Slack proposal to transition to weekly async thread
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCheck('cutDuration')}
                  className="w-full flex items-center gap-2 cursor-pointer p-1.5 rounded-lg text-left hover:bg-white/[0.06] transition-colors"
                >
                  {checklist.cutDuration ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-zinc-500 shrink-0" />}
                  <span className={checklist.cutDuration ? 'line-through text-zinc-500' : ''}>
                    Trim calendar slot from {meeting.durationMinutes}m to {meeting.durationMinutes > 30 ? 25 : 15}m
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCheck('requireAgenda')}
                  className="w-full flex items-center gap-2 cursor-pointer p-1.5 rounded-lg text-left hover:bg-white/[0.06] transition-colors"
                >
                  {checklist.requireAgenda ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-zinc-500 shrink-0" />}
                  <span className={checklist.requireAgenda ? 'line-through text-zinc-500' : ''}>
                    Enforce 3 bullet points in calendar invite description
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              href={`/meetings/${meeting.id}`}
              className="text-zinc-400 hover:text-white transition-colors underline-offset-4 hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>Open Full Diagnostic Page</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => onOpenSlackDraft(meeting)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#4A154B] hover:bg-[#611f69] text-white transition-all shadow-md"
            >
              Generate Slack Draft Proposal
            </button>
          </div>
        </div>
      )}
    </LiquidGlassCard>
  );
}
