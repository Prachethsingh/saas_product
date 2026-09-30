'use client';

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sliders, 
  Calculator, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sky-950/20 backdrop-blur-md overflow-y-auto animate-fade-in">
      <LiquidGlassCard variant="serene" className="relative w-full max-w-4xl p-5 sm:p-7 max-h-[90vh] flex flex-col overflow-hidden my-auto bg-white/95 border-sky-100/80 shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-700 transition-colors z-10"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-5 shrink-0 border-b border-slate-200 pb-4 pr-10">
          <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
              Calendar Audit Documentation & Methodology
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reference guide on recurring series scoring, Google Calendar ingestion, and schedule optimization.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 shrink-0 border-b border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'quickstart'
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium shadow-sm'
                : 'text-slate-600 hover:text-sky-950 hover:bg-sky-50/70'
            }`}
          >
            <span>1. Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('formula')}
            className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'formula'
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium shadow-sm'
                : 'text-slate-600 hover:text-sky-950 hover:bg-sky-50/70'
            }`}
          >
            <span>2. Scoring Formula</span>
          </button>

          <button
            onClick={() => setActiveTab('slack')}
            className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'slack'
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium shadow-sm'
                : 'text-slate-600 hover:text-sky-950 hover:bg-sky-50/70'
            }`}
          >
            <span>3. Slack Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'google'
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium shadow-sm'
                : 'text-slate-600 hover:text-sky-950 hover:bg-sky-50/70'
            }`}
          >
            <span>4. Google Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium shadow-sm'
                : 'text-slate-600 hover:text-sky-950 hover:bg-sky-50/70'
            }`}
          >
            <span>5. Schedule Calculator</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 text-xs text-slate-700 space-y-4">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-900">
                  1. Loaded Compensation Rate & Projected Cost
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Metrics across the dashboard calculate in real-time based on duration, attendee count, and hourly loaded rate.
                  Adjust the loaded cost slider ($50 to $150/hr) to reflect your engineering organization compensation.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-900">
                  2. Series Status Categories
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Recurring events are categorized based on computed health thresholds:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800">
                    <strong className="block text-rose-950 font-semibold">Sunset Recommended (70+)</strong>
                    Steep attendance decline or zero recent engagement. Candidate for cancellation or async migration.
                  </div>
                  <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
                    <strong className="block text-amber-950 font-semibold">Shorten Recommended (40 to 69)</strong>
                    Disproportionate duration. Candidate for shortening (e.g. 60m to 25m).
                  </div>
                  <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <strong className="block text-emerald-950 font-semibold">Healthy (under 40)</strong>
                    Active attendance, prepared descriptions, regular participation.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-900">
                  3. Structured Notice Dispatch
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Select "Draft Notice" on any series card to generate a factual, data-backed message summarizing historical attendance deltas and requesting team confirmation to adjust or sunset the slot.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SCORING FORMULA */}
          {activeTab === 'formula' && (
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200 font-mono">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Weighted Scoring Function:</div>
                <div className="text-xs font-semibold text-slate-900">
                  Score = 0.30 * Decay + 0.20 * Staleness + 0.25 * TalkSkew + 0.15 * (1 - Decisions) + 0.10 * Declines
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-md bg-white border border-slate-200 flex items-start gap-3">
                  <div className="font-mono font-semibold text-rose-600 text-xs shrink-0 w-10 text-right">30%</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Attendance Decay</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Evaluates the delta between baseline attendance (first 4 tracked occurrences) and recent attendance (last 4 occurrences).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-white border border-slate-200 flex items-start gap-3">
                  <div className="font-mono font-semibold text-amber-700 text-xs shrink-0 w-10 text-right">20%</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Agenda Staleness</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Hashes event description text across successive occurrences. Unchanged or empty calendar descriptions increment this penalty.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-white border border-slate-200 flex items-start gap-3">
                  <div className="font-mono font-semibold text-blue-600 text-xs shrink-0 w-10 text-right">25%</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Participation Distribution</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Identifies broadcast-style meetings where discussion is non-reciprocal.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-white border border-slate-200 flex items-start gap-3">
                  <div className="font-mono font-semibold text-slate-600 text-xs shrink-0 w-10 text-right">15%</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Duration-to-Decision Ratio</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Measures duration against tracked actionable outputs.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-white border border-slate-200 flex items-start gap-3">
                  <div className="font-mono font-semibold text-slate-600 text-xs shrink-0 w-10 text-right">10%</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Decline and Reschedule Rate</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Calculates the frequency of participant declines and organizer reschedules over 90 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-slate-500" />
                <span><strong>Baseline Calibration Rule:</strong> Events with fewer than 6 recorded occurrences remain in baseline observation mode to avoid false positives.</span>
              </div>
            </div>
          )}

          {/* TAB 3: SLACK DISPATCH */}
          {activeTab === 'slack' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Channel Configuration:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px]">
                  <li>Right-click your destination channel in Slack.</li>
                  <li>Select "View channel details".</li>
                  <li>Copy the Channel ID located at the bottom of the modal (e.g. C0123456789).</li>
                  <li>Paste into the draft modal and send.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE SYNC */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Read-Only OAuth Scope
                </h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  MeetingDebt requests only the <code className="text-slate-900 bg-white border border-slate-200 px-1 py-0.5 rounded font-mono">calendar.readonly</code> scope. It never writes to calendar entries, deletes events, or reads email contents.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CALCULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Use the Schedule Impact Calculator on the dashboard to test hypothetical duration, frequency, and attendance parameters before booking recurring events.
                </p>
              </div>

              {onOpenSimulator && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSimulator();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium text-xs shadow-sm transition-all"
                  >
                    <span>Open Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MeetingDebt 1.0</span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-medium shadow-sm transition-all"
          >
            Close Documentation
          </button>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
