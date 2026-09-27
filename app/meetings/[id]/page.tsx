'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  MessageSquare, 
  Check, 
  Copy,
  ChevronRight,
  Flame
} from 'lucide-react';
import { ScoreBadge } from '@/components/score-badge';
import { SlackModal } from '@/components/slack-modal';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export default function MeetingDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [isSlackModalOpen, setIsSlackModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/meetings/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-zinc-500 font-mono text-xs">
        Loading occurrence audit history...
      </div>
    );
  }

  if (!data || !data.meeting) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-base font-semibold text-white">Meeting series not found</h2>
        <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { meeting, scoringResult, slackDraft, chartData } = data;
  const breakdown = scoringResult?.breakdown;
  const rawMetrics = breakdown?.rawMetrics;

  const handleCopyDraft = () => {
    if (slackDraft?.text) {
      navigator.clipboard.writeText(slackDraft.text);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Audit Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-zinc-300 truncate max-w-xs">{meeting.title}</span>
      </div>

      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {meeting.title}
            </h1>
            <ScoreBadge
              score={scoringResult.score}
              recommendation={scoringResult.recommendation}
              isObservation={scoringResult.isObservationMode}
              size="lg"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
            <span>
              Organizer: <strong className="font-mono text-zinc-300">{meeting.organizerEmail}</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              Duration: <strong className="font-mono text-zinc-300">{meeting.durationMinutes}m</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              Cadence: <code className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5">{meeting.recurrenceRule}</code>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSlackModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
            <span>Generate Slack Proposal</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar - Liquid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <LiquidGlassCard variant="danger" className="p-4">
          <div className="text-[11px] font-mono uppercase text-zinc-400">Est. Annual Payroll Burn</div>
          <div className="text-xl font-mono font-bold text-rose-300 mt-1 tabular-nums drop-shadow-sm">
            ${scoringResult.estimatedAnnualWasteDollars.toLocaleString()}<span className="text-xs font-normal text-zinc-400 font-sans">/yr</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Loaded at $85/hr across all invited members</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-zinc-400">Reclaimable Focus Time</div>
          <div className="text-xl font-mono font-bold text-zinc-100 mt-1 tabular-nums">
            {scoringResult.hoursReclaimablePerMonth}<span className="text-xs font-normal text-zinc-400 font-sans"> hrs/mo</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Uninterrupted deep work returned to team</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-zinc-400">System Recommendation</div>
          <div className="text-sm font-semibold text-zinc-100 mt-1">
            {scoringResult.headline}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {scoringResult.actionSuggestion}
          </div>
        </LiquidGlassCard>
      </div>

      {/* Attendance Decay Timeline Visualizer Glass Panel */}
      <LiquidGlassCard variant="neutral" className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-mono uppercase font-semibold text-zinc-200">
              Attendance Decay Trajectory (Last {chartData.length} Occurrences)
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Green = Accepted attendees, Red = Declined invitations, Grey ceiling = Total invited.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-sm bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              Accepted
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-sm bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              Declined
            </span>
          </div>
        </div>

        {/* Visual Bar chart */}
        <div className="pt-4 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 items-end h-40 border-b border-white/[0.08] pb-3">
          {chartData.map((occ: any, i: number) => {
            const maxVal = Math.max(...chartData.map((d: any) => d.total || 14), 10);
            const acceptedHeight = Math.round((occ.accepted / maxVal) * 100);
            const declinedHeight = Math.round((occ.declined / maxVal) * 100);

            return (
              <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="text-[10px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 shadow-lg">
                  {occ.accepted}/{occ.total}
                </div>

                <div className="w-full max-w-[24px] flex flex-col justify-end gap-0.5 h-28">
                  {declinedHeight > 0 && (
                    <div
                      style={{ height: `${declinedHeight}%` }}
                      className="w-full bg-rose-400/80 rounded-t-sm shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                    />
                  )}
                  <div
                    style={{ height: `${acceptedHeight}%` }}
                    className="w-full bg-emerald-400/90 rounded-b-sm shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  />
                </div>

                <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-200">
                  {occ.date}
                </span>
              </div>
            );
          })}
        </div>
      </LiquidGlassCard>

      {/* 5-Signal Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase font-semibold text-zinc-400">
          5-Signal Mathematical Decomposition
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <LiquidGlassCard variant="danger" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">1. Attendance Decay</span>
              <span className="font-mono text-rose-300 font-semibold">{Math.round(breakdown?.attendanceDecay * 100)}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div style={{ width: `${Math.round(breakdown?.attendanceDecay * 100)}%` }} className="h-full bg-rose-500" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Early: <strong>{rawMetrics?.earlyAvgAccepted}</strong> → Recent: <strong>{rawMetrics?.recentAvgAccepted}</strong>. Formula: <code>(early - recent) / early</code>.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="warning" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">2. Agenda Staleness</span>
              <span className="font-mono text-amber-300 font-semibold">{Math.round(breakdown?.agendaStaleness * 100)}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div style={{ width: `${Math.round(breakdown?.agendaStaleness * 100)}%` }} className="h-full bg-amber-500" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Description unchanged for <strong>{rawMetrics?.staleAgendaStreak}</strong> consecutive meetings.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="neutral" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">3. Talk-Time Skew</span>
              <span className="font-mono text-zinc-400 font-semibold">Proportional (v1)</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div style={{ width: `40%` }} className="h-full bg-zinc-500" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Reweighted proportionally across calendar signals to avoid employee transcript consent friction.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="neutral" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">4. Decision Ratio</span>
              <span className="font-mono text-cyan-300 font-semibold">{Math.round(breakdown?.decisionRatioScore * 100)}% penalty</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div style={{ width: `${Math.round(breakdown?.decisionRatioScore * 100)}%` }} className="h-full bg-cyan-500" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Ratio of duration vs logged action outcomes: <strong>{rawMetrics?.decisionRatio}</strong>.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="danger" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">5. Decline / Reschedule</span>
              <span className="font-mono text-rose-300 font-semibold">{Math.round(breakdown?.declineRate * 100)}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div style={{ width: `${Math.round(breakdown?.declineRate * 100)}%` }} className="h-full bg-rose-500" />
            </div>
            <p className="text-[11px] text-zinc-400">
              <strong>{rawMetrics?.rescheduleOrDeclinePercentage}%</strong> of instances were moved or declined over last 90 days.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="neutral" className="p-4 space-y-1 flex flex-col justify-center">
            <div className="text-[11px] font-mono uppercase text-zinc-400">Total Zombie Score</div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {scoringResult.score}<span className="text-sm font-normal text-zinc-500"> / 100</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              Threshold: ≥70 triggers sunset proposal
            </div>
          </LiquidGlassCard>
        </div>
      </div>

      {/* Occurrence Audit History Table Glass */}
      <LiquidGlassCard variant="neutral" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase font-semibold text-zinc-300">
            Occurrence Log ({meeting.occurrences.length} instances)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-zinc-400 uppercase tracking-wider text-[10px] font-mono border-b border-white/[0.06]">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Accepted</th>
                <th className="py-2.5 px-4">Declined</th>
                <th className="py-2.5 px-4">Total</th>
                <th className="py-2.5 px-4">Duration</th>
                <th className="py-2.5 px-4">Calendar Agenda Text</th>
                <th className="py-2.5 px-4">Actions Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {meeting.occurrences.map((occ: any, i: number) => {
                const isStale = i > 0 && occ.agendaText === meeting.occurrences[i - 1].agendaText;
                return (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-2 px-4 font-mono text-zinc-200">{occ.date}</td>
                    <td className="py-2 px-4 font-mono text-emerald-400 font-medium">{occ.acceptedCount}</td>
                    <td className="py-2 px-4 font-mono text-rose-400 font-medium">{occ.declinedCount}</td>
                    <td className="py-2 px-4 font-mono text-zinc-300">{occ.attendeeCount}</td>
                    <td className="py-2 px-4 font-mono text-zinc-400">{occ.durationMinutes}m</td>
                    <td className="py-2 px-4 max-w-xs truncate text-zinc-300">
                      {occ.agendaText || '(No agenda)'}
                      {isStale && (
                        <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 backdrop-blur-md">
                          stale
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 font-mono text-zinc-400">{occ.actionItemsLogged}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LiquidGlassCard>

      {/* Auto-Draft Slack Message Preview Glass */}
      <LiquidGlassCard variant="neutral" className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <MessageSquare className="w-4 h-4 text-zinc-400" />
            <span>Slack Proposal Auto-Draft</span>
          </div>

          <button
            onClick={handleCopyDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] text-zinc-100 border border-white/10 backdrop-blur-xl transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]"
          >
            {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDraft ? 'Copied' : 'Copy Message'}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] backdrop-blur-md text-zinc-200 text-xs font-mono leading-relaxed whitespace-pre-wrap shadow-inner">
          {slackDraft.text}
        </div>
      </LiquidGlassCard>

      <SlackModal
        isOpen={isSlackModalOpen}
        meeting={meeting}
        onClose={() => setIsSlackModalOpen(false)}
      />
    </div>
  );
}
