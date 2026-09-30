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
  ChevronRight
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
      <div className="py-24 text-center text-slate-400 font-mono text-xs">
        Loading occurrence audit history...
      </div>
    );
  }

  if (!data || !data.meeting) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-base font-semibold text-slate-900">Meeting series not found</h2>
        <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium">
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
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Audit Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{meeting.title}</span>
      </div>

      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {meeting.title}
            </h1>
            <ScoreBadge
              score={scoringResult.score}
              recommendation={scoringResult.recommendation}
              isObservation={scoringResult.isObservationMode}
              size="lg"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
            <span>
              Organizer: <strong className="font-mono text-slate-900">{meeting.organizerEmail}</strong>
            </span>
            <span className="text-slate-300">/</span>
            <span>
              Duration: <strong className="font-mono text-slate-900">{meeting.durationMinutes}m</strong>
            </span>
            <span className="text-slate-300">/</span>
            <span>
              Cadence: <code className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{meeting.recurrenceRule}</code>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSlackModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-white/90" />
            <span>Draft Slack Notice</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <LiquidGlassCard variant="danger" className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Est. Annual Cost</div>
          <div className="text-xl font-mono font-bold text-rose-600 mt-1 tabular-nums">
            ${scoringResult.estimatedAnnualWasteDollars.toLocaleString()}<span className="text-xs font-normal text-slate-400 font-sans">/yr</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Calculated at $85/hr loaded across invitees</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Reclaimable Hours</div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
            {scoringResult.hoursReclaimablePerMonth}<span className="text-xs font-normal text-slate-400 font-sans"> hrs/mo</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Returned to engineering deep-work time</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="neutral" className="p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Audit Recommendation</div>
          <div className="text-sm font-semibold text-slate-900 mt-1">
            {scoringResult.headline}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {scoringResult.actionSuggestion}
          </div>
        </LiquidGlassCard>
      </div>

      {/* Attendance Trajectory */}
      <LiquidGlassCard variant="neutral" className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-mono uppercase font-semibold text-slate-800">
              Attendance History (Last {chartData.length} Occurrences)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Green represents accepted attendees, red represents declined invitations.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-sm bg-emerald-600" />
              Accepted
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-sm bg-rose-600" />
              Declined
            </span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="pt-4 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 items-end h-36 border-b border-slate-200 pb-3">
          {chartData.map((occ: any, i: number) => {
            const maxVal = Math.max(...chartData.map((d: any) => d.total || 14), 10);
            const acceptedHeight = Math.round((occ.accepted / maxVal) * 100);
            const declinedHeight = Math.round((occ.declined / maxVal) * 100);

            return (
              <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="text-[10px] font-mono text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                  {occ.accepted}/{occ.total}
                </div>

                <div className="w-full max-w-[20px] flex flex-col justify-end gap-0.5 h-24">
                  {declinedHeight > 0 && (
                    <div
                      style={{ height: `${declinedHeight}%` }}
                      className="w-full bg-rose-500 rounded-sm"
                    />
                  )}
                  <div
                    style={{ height: `${acceptedHeight}%` }}
                    className="w-full bg-emerald-600 rounded-sm"
                  />
                </div>

                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-800">
                  {occ.date}
                </span>
              </div>
            );
          })}
        </div>
      </LiquidGlassCard>

      {/* 5-Signal Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase font-semibold text-slate-700">
          Scoring Signal Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <LiquidGlassCard variant="danger" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-900 font-semibold">1. Attendance Decay</span>
              <span className="font-mono text-rose-600 font-semibold">{Math.round(breakdown?.attendanceDecay * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
              <div style={{ width: `${Math.round(breakdown?.attendanceDecay * 100)}%` }} className="h-full bg-rose-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              Early: {rawMetrics?.earlyAvgAccepted} to Recent: {rawMetrics?.recentAvgAccepted} accepted.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="warning" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-900 font-semibold">2. Agenda Staleness</span>
              <span className="font-mono text-amber-700 font-semibold">{Math.round(breakdown?.agendaStaleness * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
              <div style={{ width: `${Math.round(breakdown?.agendaStaleness * 100)}%` }} className="h-full bg-amber-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              Description unchanged for {rawMetrics?.staleAgendaStreak} consecutive occurrences.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="neutral" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-900 font-semibold">3. Discussion Balance</span>
              <span className="font-mono text-slate-500">Standard Calibration</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
              <div style={{ width: `40%` }} className="h-full bg-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500">
              Calibrated across calendar signals without intrusive audio recording.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="neutral" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-900 font-semibold">4. Decision Ratio</span>
              <span className="font-mono text-slate-700 font-semibold">{Math.round(breakdown?.decisionRatioScore * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
              <div style={{ width: `${Math.round(breakdown?.decisionRatioScore * 100)}%` }} className="h-full bg-slate-700" />
            </div>
            <p className="text-[11px] text-slate-500">
              Ratio of duration relative to logged decisions: {rawMetrics?.decisionRatio}.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="danger" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-900 font-semibold">5. Decline Rate</span>
              <span className="font-mono text-rose-600 font-semibold">{Math.round(breakdown?.declineRate * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-sm overflow-hidden">
              <div style={{ width: `${Math.round(breakdown?.declineRate * 100)}%` }} className="h-full bg-rose-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              {rawMetrics?.rescheduleOrDeclinePercentage}% of occurrences moved or declined over last 90 days.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard variant="neutral" className="p-4 space-y-1 flex flex-col justify-center">
            <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Total Composite Score</div>
            <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
              {scoringResult.score}<span className="text-xs font-normal text-slate-400"> / 100</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Action threshold: 70+ suggests sunset review
            </div>
          </LiquidGlassCard>
        </div>
      </div>

      {/* Occurrence Log Table */}
      <LiquidGlassCard variant="neutral" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-xs font-mono uppercase font-semibold text-slate-800">
            Occurrence Log ({meeting.occurrences.length} recorded instances)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-mono border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Date</th>
                <th className="py-2.5 px-4 font-semibold">Accepted</th>
                <th className="py-2.5 px-4 font-semibold">Declined</th>
                <th className="py-2.5 px-4 font-semibold">Total</th>
                <th className="py-2.5 px-4 font-semibold">Duration</th>
                <th className="py-2.5 px-4 font-semibold">Calendar Description</th>
                <th className="py-2.5 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {meeting.occurrences.map((occ: any, i: number) => {
                const isStale = i > 0 && occ.agendaText === meeting.occurrences[i - 1].agendaText;
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-slate-800">{occ.date}</td>
                    <td className="py-2.5 px-4 font-mono text-emerald-700 font-semibold">{occ.acceptedCount}</td>
                    <td className="py-2.5 px-4 font-mono text-rose-600 font-semibold">{occ.declinedCount}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">{occ.attendeeCount}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{occ.durationMinutes}m</td>
                    <td className="py-2.5 px-4 max-w-xs truncate text-slate-700">
                      {occ.agendaText || '(No description)'}
                      {isStale && (
                        <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          identical
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{occ.actionItemsLogged}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LiquidGlassCard>

      {/* Notice Draft Section */}
      <LiquidGlassCard variant="neutral" className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Generated Notice Draft</span>
          </div>

          <button
            onClick={handleCopyDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-sm transition-all"
          >
            {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white" />}
            <span>{copiedDraft ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono leading-relaxed whitespace-pre-wrap">
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
