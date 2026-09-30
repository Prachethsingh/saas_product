'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  RotateCw, 
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
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-slate-200 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand & Workspace */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-slate-900 group-hover:text-slate-700">
                MeetingDebt
              </span>
              <span className="text-[11px] font-mono text-slate-500">v1.0</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Google Workspace: Connected</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-mono text-[11px]">Nightly Audit: Active</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Audit Guide</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin text-slate-800' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : justSynced ? 'Synced' : 'Sync Calendar'}</span>
          </button>

          <button
            onClick={onOpenPricing}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            <span>Plans & Billing</span>
          </button>

          <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-mono font-semibold text-slate-700">
            EM
          </div>
        </div>
      </div>
    </header>
  );
}
