'use client';

import React from 'react';

export function LiquidGlassFilterDefs() {
  return null;
}

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'neutral' | 'danger' | 'warning' | 'success';
  interactive?: boolean;
}

export function LiquidGlassCard({
  children,
  variant = 'neutral',
  className = '',
  ...props
}: LiquidGlassCardProps) {
  const variantStyles = {
    neutral: 'border-white/80 bg-white/65 shadow-[0_12px_32px_-4px_rgba(15,60,110,0.07)] text-slate-800',
    danger: 'border-rose-200/80 bg-rose-50/50 shadow-[0_12px_32px_-4px_rgba(244,63,94,0.08)] text-slate-800',
    warning: 'border-amber-200/80 bg-amber-50/50 shadow-[0_12px_32px_-4px_rgba(245,158,11,0.08)] text-slate-800',
    success: 'border-emerald-200/80 bg-emerald-50/50 shadow-[0_12px_32px_-4px_rgba(16,185,129,0.08)] text-slate-800',
  }[variant];

  return (
    <div
      className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-200 overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] ${variantStyles} ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface LiquidGlassPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'danger' | 'warning' | 'success' | 'neutral';
}

export function LiquidGlassPill({
  children,
  variant = 'neutral',
  className = '',
  ...props
}: LiquidGlassPillProps) {
  const variantStyles = {
    neutral: 'border-white/90 text-slate-700 bg-white/70 shadow-sm',
    danger: 'border-rose-200/80 text-rose-700 bg-rose-50/80 shadow-sm',
    warning: 'border-amber-200/80 text-amber-800 bg-amber-50/80 shadow-sm',
    success: 'border-emerald-200/80 text-emerald-800 bg-emerald-50/80 shadow-sm',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border backdrop-blur-md ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
