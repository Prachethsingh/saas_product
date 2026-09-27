'use client';

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Zap, 
  Sparkles, 
  Calculator, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { LiquidGlassCard } from './ui/liquid-glass';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulator?: () => void;
}

export function GuideModal({ isOpen, onClose, onOpenSimulator }: GuideModalProps) {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'formula' | 'slack' | 'google' | 'simulator'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <LiquidGlassCard variant="neutral" className="relative w-full max-w-4xl p-5 sm:p-7 max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors z-10"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-5 shrink-0 border-b border-white/[0.08] pb-4 pr-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300 mb-1">
              <span>Interactive Manual</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              MeetingDebt Product Guide & User Manual
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              How to audit calendars, detect zombie meetings, and eliminate wasted engineering payroll burn.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 shrink-0 border-b border-white/[0.06] text-xs font-mono">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'quickstart'
                ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Quick Start</span>
          </button>

          <button
            onClick={() => setActiveTab('formula')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'formula'
                ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-rose-400" />
            <span>2. Zombie Score Formula</span>
          </button>

          <button
            onClick={() => setActiveTab('slack')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'slack'
                ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>3. 1-Click Slack Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'google'
                ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>4. Google Sync & Postgres</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. Meeting Simulator</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 text-xs text-zinc-300 space-y-4">
          
          {/* TAB 1: QUICK START */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs flex items-center justify-center">1</span>
                  Review Executive Payroll Burn & Reclaimable Hours
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  The top metrics bar recalculates in real-time based on your team size and hourly loaded cost. 
                  Adjust the <strong className="text-white font-mono">Loaded Cost ($/hr)</strong> slider on the top right to match your team’s compensation (e.g. $85/hr or $120/hr).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-400/20 text-rose-300 font-mono text-xs flex items-center justify-center">2</span>
                  Filter & Triage Flagged Zombie Meetings
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Use the quick filter pills to isolate candidates:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <strong className="block text-white">Kill (Score 70+)</strong>
                    Low yield, decaying attendance. Prime for total cancellation or moving async.
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <strong className="block text-white">Shorten (Score 40–69)</strong>
                    Bloated length. Halve the duration (e.g. 60m → 25m) and mandate an agenda.
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <strong className="block text-white">Healthy (&lt;40)</strong>
                    Active participation, solid action items, regular attendance. Keep as-is.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-400/20 text-purple-300 font-mono text-xs flex items-center justify-center">3</span>
                  Send Data-Backed Proposals with 1 Click
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Click <strong className="text-white">"Draft Proposal"</strong> on any meeting card. 
                  MeetingDebt formats a polite, empirical message with attendance stats and interactive poll buttons (:thumbsup: to sunset, :speech_balloon: to keep). 
                  Dispatch it straight into your team’s Slack channel via the installed <strong className="text-white font-mono">@meetingdebt</strong> bot!
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('formula')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-all text-xs"
                >
                  <span>Learn the Scoring Formula</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ZOMBIE SCORING FORMULA */}
          {activeTab === 'formula' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.1] font-mono">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">Mathematical Formula:</div>
                <div className="text-sm font-bold text-amber-300">
                  Score = 0.30·Decay + 0.20·Staleness + 0.25·TalkSkew + 0.15·(1 - Decisions) + 0.10·Declines
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <div className="font-mono font-bold text-rose-400 text-sm shrink-0 w-12 text-right">30%</div>
                  <div>
                    <h4 className="font-semibold text-white">Attendance Decay</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Measures attendee attrition over the last 8 occurrences: <code className="text-zinc-300 bg-white/[0.06] px-1 py-0.5 rounded">(early_avg - recent_avg) / early_avg</code>. If a meeting starts with 10 people and drops to 3, this signal spikes.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <div className="font-mono font-bold text-amber-400 text-sm shrink-0 w-12 text-right">20%</div>
                  <div>
                    <h4 className="font-semibold text-white">Agenda Staleness</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Hashes meeting descriptions over consecutive weeks. Empty or identical calendar descriptions (e.g. copied "weekly sync") indicate zero advance preparation.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <div className="font-mono font-bold text-blue-400 text-sm shrink-0 w-12 text-right">25%</div>
                  <div>
                    <h4 className="font-semibold text-white">Talk-Time Monopolization Skew</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Detects if 1 or 2 speakers dominate &gt;75% of speech time. When one person speaks while others listen passively, the meeting should be converted to an async video or announcement.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <div className="font-mono font-bold text-purple-400 text-sm shrink-0 w-12 text-right">15%</div>
                  <div>
                    <h4 className="font-semibold text-white">Duration-to-Decision Ratio</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Evaluates meeting duration against tracked actionable outputs. 60-minute meetings producing zero action items receive maximum penalty.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <div className="font-mono font-bold text-zinc-400 text-sm shrink-0 w-12 text-right">10%</div>
                  <div>
                    <h4 className="font-semibold text-white">Decline & Reschedule Rate</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Calculates the percentage of instances rescheduled or declined by participants over the last 90 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-blue-400" />
                <span><strong>The N ≥ 6 Observation Rule:</strong> Any meeting with fewer than 6 logged occurrences is placed in Observation Mode to prevent false alarms on fresh initiatives.</span>
              </div>
            </div>
          )}

          {/* TAB 3: SLACK BOT DISPATCH */}
          {activeTab === 'slack' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <h3 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  Why 1-Click Slack Dispatch Works
                </h3>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  Nobody wants to be the "bad guy" who cancels a recurring meeting. 
                  By framing the message as an objective audit citing empirical numbers ($38k/yr burn, 70% attendance drop), 
                  teams happily vote to kill or shorten it without social friction.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
                  How to find your Slack Channel ID in 5 Seconds:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 text-[11px]">
                  <li>Open your Slack workspace in desktop or browser.</li>
                  <li><strong>Right-click</strong> the public channel where you want the proposal posted (e.g. <code className="text-white bg-black/40 px-1 py-0.5 rounded">#general</code> or <code className="text-white bg-black/40 px-1 py-0.5 rounded">#eng-leads</code>).</li>
                  <li>Click <strong>"View channel details"</strong>.</li>
                  <li>Scroll to the very bottom of the details modal.</li>
                  <li>Click copy next to <strong>Channel ID</strong> (e.g. <code className="text-amber-300 font-mono bg-black/40 px-1 py-0.5 rounded">C0123456789</code>).</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
                  Available Dispatch Modes in the Modal:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.08]">
                    <strong className="text-purple-300 block mb-0.5">Slack Bot (@meetingdebt)</strong>
                    Uses direct bot credentials to post rich interactive Block Kit cards into any public channel.
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.08]">
                    <strong className="text-zinc-300 block mb-0.5">Incoming Webhook</strong>
                    Paste any custom Slack webhook URL to post without installing workspace-wide bot apps.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE CALENDAR SYNC */}
          {activeTab === 'google' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Enterprise Read-Only Security
                </h3>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  MeetingDebt only requests <code className="text-emerald-300 bg-white/[0.06] px-1 py-0.5 rounded font-mono">calendar.readonly</code> OAuth scope. 
                  It never modifies your calendar, deletes events, or reads private email content.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
                  How Ingestion & Storage Works:
                </h4>
                <div className="space-y-2 text-[11px] text-zinc-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>90-Day Telemetry Pull:</strong> Pulls recurring series and past occurrences to calculate attendance rates and historical deltas.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Antideploy Built-in Postgres:</strong> Telemetry is indexed in high-performance PostgreSQL (Neon 17.11 cluster) with automated schema migrations.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Automated Nightly Rescore:</strong> A background cron job at midnight re-scores meetings based on the latest 24 hours of attendee behavior.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEETING SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Test Meeting Hypotheses Before Booking
                </h3>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  Before adding another recurring 10-person sync to your engineering team's schedule, use the 
                  <strong> Interactive Meeting Simulator</strong> right on your dashboard!
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-[11px] text-zinc-300">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
                  What you can simulate:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Attendee count (e.g. 5 vs 15 engineers)</li>
                  <li>Duration (15m, 30m, 45m, 60m)</li>
                  <li>Frequency (Daily, Weekly, Bi-weekly, Monthly)</li>
                  <li>Attendance Decay slider (simulate people tuning out)</li>
                  <li>Monopolization slider (one speaker dominating)</li>
                </ul>
                <p className="pt-2 text-zinc-400">
                  The simulator instantly calculates the exact annual payroll burn and projected Zombie Score, allowing you to add it directly to your audit dashboard or draft a Slack proposal immediately.
                </p>
              </div>

              {onOpenSimulator && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSimulator();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all text-xs shadow-md"
                  >
                    <span>Scroll to Simulator on Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>MeetingDebt SaaS v1.0 • Built for EMs & Ops Leads</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all shadow-sm"
          >
            Got it, Let's Audit
          </button>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
