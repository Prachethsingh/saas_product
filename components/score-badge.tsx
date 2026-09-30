import React from 'react';

interface ScoreBadgeProps {
  score: number;
  recommendation?: 'kill' | 'shorten' | 'healthy' | 'observation';
  isObservation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({
  score,
  recommendation,
  isObservation = false,
  size = 'md',
}: ScoreBadgeProps) {
  if (isObservation || recommendation === 'observation') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-2.5 py-1 text-xs'
            : 'px-2 py-0.5 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span className="font-sans font-medium text-slate-700">Baseline Calibration</span>
        <span className="text-slate-500 font-mono text-[11px]">(under 6 occurrences)</span>
      </div>
    );
  }

  let badgeStyles = '';
  let dotStyles = '';
  let label = '';

  if (score >= 70 || recommendation === 'kill') {
    badgeStyles = 'border-rose-200 text-rose-700 bg-rose-50';
    dotStyles = 'bg-rose-600';
    label = 'Sunset Recommended';
  } else if (score >= 40 || recommendation === 'shorten') {
    badgeStyles = 'border-amber-200 text-amber-800 bg-amber-50';
    dotStyles = 'bg-amber-600';
    label = 'Shorten Recommended';
  } else {
    badgeStyles = 'border-emerald-200 text-emerald-800 bg-emerald-50';
    dotStyles = 'bg-emerald-600';
    label = 'Healthy';
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border font-mono tracking-tight ${badgeStyles} ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-2.5 py-1 text-xs'
          : 'px-2 py-0.5 text-xs'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
        <span className="font-bold tabular-nums">{score}</span>
        <span className="opacity-60 text-[10px]">/ 100</span>
      </div>
      <span className="w-px h-3 bg-current opacity-20" />
      <span className="font-sans font-medium text-[11px] uppercase tracking-wider">{label}</span>
    </div>
  );
}
