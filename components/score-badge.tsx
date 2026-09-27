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
        className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl text-zinc-400 font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[11px]'
            : size === 'lg'
            ? 'px-3 py-1 text-xs'
            : 'px-2.5 py-0.5 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
        <span className="font-sans font-medium text-zinc-300">Observation Mode</span>
        <span className="text-zinc-500 text-[10px]">(&lt;6 evts)</span>
      </div>
    );
  }

  // Liquid Glass Pill Styling
  let glassStyles = '';
  let dotStyles = '';
  let label = '';

  if (score >= 70 || recommendation === 'kill') {
    glassStyles = 'border-rose-400/30 text-rose-300 bg-rose-500/[0.10] shadow-[0_4px_16px_rgba(244,63,94,0.15),inset_0_1px_0_0_rgba(255,255,255,0.25)]';
    dotStyles = 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
    label = 'Kill / Async';
  } else if (score >= 40 || recommendation === 'shorten') {
    glassStyles = 'border-amber-400/30 text-amber-300 bg-amber-500/[0.10] shadow-[0_4px_16px_rgba(245,158,11,0.15),inset_0_1px_0_0_rgba(255,255,255,0.25)]';
    dotStyles = 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
    label = 'Shorten';
  } else {
    glassStyles = 'border-emerald-400/30 text-emerald-300 bg-emerald-500/[0.10] shadow-[0_4px_16px_rgba(16,185,129,0.15),inset_0_1px_0_0_rgba(255,255,255,0.25)]';
    dotStyles = 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
    label = 'Healthy';
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-xl font-mono tracking-tight transition-all ${glassStyles} ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[11px]'
          : size === 'lg'
          ? 'px-3 py-1 text-xs'
          : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
        <span className="font-bold tabular-nums text-white">{score}</span>
        <span className="text-zinc-500 text-[10px]">/100</span>
      </div>
      <span className="w-[1px] h-3 bg-white/20" />
      <span className="font-sans font-medium text-[11px] uppercase tracking-wider">{label}</span>
    </div>
  );
}
