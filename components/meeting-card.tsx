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

  const dynamicAnnualWaste = Math.round(meeting.hoursReclaimablePerMonth * 12 * hourlyRate);
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
      className={`p-4 sm:p-5 ${isKilled ? 'opacity-50' : ''}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Main Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link 
              href={`/meetings/${meeting.id}`}
              className="font-semibold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors truncate flex items-center gap-1.5 group"
            >
              <span>{meeting.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>

            {isKilled && (
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
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

          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="font-mono text-slate-700">{meeting.organizerEmail}</span>
            <span className="text-slate-300">/</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="font-mono">{meeting.durationMinutes}m</span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Users className="w-3 h-3 text-slate-400" />
              <span className="font-mono">{meeting.attendeeCount} invitees</span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-500">{meeting.occurrencesLogged} events tracked</span>
          </div>
        </div>

        {/* Mini Attendance Trend Sparkline */}
        {!meeting.isObservationMode && occHistory.length > 0 && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-white border border-slate-200 shrink-0">
            <div className="text-[11px] text-slate-500">
              <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Attendance Trend</div>
              <span className="font-mono tabular-nums text-slate-800">
                {occHistory[0]?.acceptedCount || 0} to {occHistory[occHistory.length - 1]?.acceptedCount || 0} accepted
              </span>
            </div>
            <div className="flex items-end gap-1 h-6">
              {occHistory.slice(-8).map((occ, i) => {
                const pct = Math.max(15, Math.round((occ.acceptedCount / maxAttendees) * 100));
                const isLate = i >= 4;
                return (
                  <div
                    key={i}
                    style={{ height: `${pct}%` }}
                    className={`w-1.5 rounded-sm ${
                      isLate && occ.acceptedCount < (occHistory[0]?.acceptedCount || 5) * 0.5
                        ? 'bg-rose-500'
                        : 'bg-slate-300'
                    }`}
                    title={`${occ.date}: ${occ.acceptedCount} of ${occ.attendeeCount} accepted`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Financial Metric */}
        <div className="text-right shrink-0">
          {dynamicAnnualWaste > 0 && !isKilled ? (
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Est. Annual Cost (${hourlyRate}/hr)</div>
              <div className="font-mono font-semibold text-rose-600 text-sm tabular-nums">
                ${dynamicAnnualWaste.toLocaleString()}<span className="text-xs font-normal text-slate-500 font-sans">/yr</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Status</div>
              <div className="font-mono text-xs text-slate-600">
                {meeting.isObservationMode ? 'Baseline' : isKilled ? 'Archived' : 'Healthy'}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-200">
          {!meeting.isObservationMode && meeting.score >= 40 && !isKilled && (
            <button
              onClick={() => onOpenSlackDraft(meeting)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
              <span>Draft Notice</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Audit'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(meeting.id, isKilled ? 'active' : 'killed')}
              className={`p-1.5 rounded-md text-xs border transition-colors ${
                isKilled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300'
              }`}
              title={isKilled ? 'Reactivate series' : 'Archive series'}
            >
              {isKilled ? <CheckCircle className="w-3.5 h-3.5" /> : <CalendarOff className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Signals Summary Bar */}
      {!meeting.isObservationMode && (
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span>
              Attendance Decay:{' '}
              <strong className="font-mono text-slate-900">
                {Math.round(meeting.breakdown.attendanceDecay * 100)}%
              </strong>
            </span>
            <span>
              Agenda Staleness:{' '}
              <strong className="font-mono text-slate-900">
                {Math.round(meeting.breakdown.agendaStaleness * 100)}%
              </strong>
            </span>
            <span>
              Decline Rate:{' '}
              <strong className="font-mono text-slate-900">
                {Math.round(meeting.breakdown.declineRate * 100)}%
              </strong>
            </span>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Last evaluated: {meeting.lastOccurrenceDate}
          </div>
        </div>
      )}

      {/* Expandable Audit Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Signal Breakdown */}
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-2.5">
              <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                <span>Signal Breakdown</span>
                <span className="font-mono text-slate-500 text-[11px]">Formula Weights</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Attendance Decay (30%):</span>
                    <span className="font-mono text-rose-600 font-semibold">{Math.round(meeting.breakdown.attendanceDecay * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
                    <div style={{ width: `${Math.round(meeting.breakdown.attendanceDecay * 100)}%` }} className="h-full bg-rose-600" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Agenda Staleness (20%):</span>
                    <span className="font-mono text-amber-700 font-semibold">{Math.round(meeting.breakdown.agendaStaleness * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
                    <div style={{ width: `${Math.round(meeting.breakdown.agendaStaleness * 100)}%` }} className="h-full bg-amber-600" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Decline & Reschedule (10%):</span>
                    <span className="font-mono text-rose-600 font-semibold">{Math.round(meeting.breakdown.declineRate * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
                    <div style={{ width: `${Math.round(meeting.breakdown.declineRate * 100)}%` }} className="h-full bg-rose-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Checklist */}
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-2.5">
              <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                <span>Action Checklist</span>
                <span className="font-mono text-slate-600 text-[11px]">
                  {Object.values(checklist).filter(Boolean).length} of 3 complete
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => toggleCheck('proposeAsync')}
                  className="w-full flex items-center gap-2 p-1.5 rounded text-left hover:bg-slate-100 transition-colors"
                >
                  {checklist.proposeAsync ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span className={checklist.proposeAsync ? 'line-through text-slate-400' : ''}>
                    Propose transition to weekly asynchronous thread
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCheck('cutDuration')}
                  className="w-full flex items-center gap-2 p-1.5 rounded text-left hover:bg-slate-100 transition-colors"
                >
                  {checklist.cutDuration ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span className={checklist.cutDuration ? 'line-through text-slate-400' : ''}>
                    Shorten duration from {meeting.durationMinutes}m to {meeting.durationMinutes > 30 ? 25 : 15}m
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCheck('requireAgenda')}
                  className="w-full flex items-center gap-2 p-1.5 rounded text-left hover:bg-slate-100 transition-colors"
                >
                  {checklist.requireAgenda ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span className={checklist.requireAgenda ? 'line-through text-slate-400' : ''}>
                    Require written agenda in calendar event description
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              href={`/meetings/${meeting.id}`}
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <span>View Occurrence History</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => onOpenSlackDraft(meeting)}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              Draft Slack Notice
            </button>
          </div>
        </div>
      )}
    </LiquidGlassCard>
  );
}
