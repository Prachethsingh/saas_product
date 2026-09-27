'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  RotateCw, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface DashboardNavProps {
  onSyncTriggered?: () => void;
  onOpenPricing?: () => void;
  onOpenGuide?: () => void;
}

export function DashboardNav({ onSyncTriggered, onOpenPricing, onOpenGuide }: DashboardNavProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/calendar/sync', { method: 'POST' });
      setJustSynced(true);
      if (onSyncTriggered) onSyncTriggered();
      setTimeout(() => setJustSynced(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand & Workspace */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl flex items-center justify-center text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] group-hover:border-white/[0.25] transition-all">
              <Activity className="w-4 h-4 text-zinc-100" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                MeetingDebt
              </span>
              <span className="text-[11px] font-mono text-zinc-500">v1.0</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/[0.08] text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span>Google Workspace: Connected</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-500">Nightly Telemetry: Active</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* In-App Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/40 backdrop-blur-xl shadow-sm transition-all"
            title="Open Product Guide & User Manual"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Product Guide</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.10] hover:border-white/[0.2] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] transition-all disabled:opacity-50"
            title="Sync latest 90 days from Google Calendar"
          >
            <RotateCw className={`w-3.5 h-3.5 text-zinc-400 ${isSyncing ? 'animate-spin text-zinc-100' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : justSynced ? 'Synced' : 'Sync Calendar'}</span>
          </button>

          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-100 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] hover:border-white/[0.28] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Plans & Billing</span>
            <span className="sm:hidden">Plans</span>
          </button>

          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl flex items-center justify-center text-[11px] font-mono text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
            EM
          </div>
        </div>
      </div>
    </header>
  );
}
