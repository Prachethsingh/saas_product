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
    neutral: 'border-slate-200 bg-white shadow-sm hover:border-slate-300',
    danger: 'border-rose-200 bg-rose-50/40 shadow-sm hover:border-rose-300',
    warning: 'border-amber-200 bg-amber-50/40 shadow-sm hover:border-amber-300',
    success: 'border-emerald-200 bg-emerald-50/40 shadow-sm hover:border-emerald-300',
  }[variant];

  return (
    <div
      className={`relative rounded-lg border transition-colors duration-150 overflow-hidden ${variantStyles} ${className}`}
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
    neutral: 'border-slate-200 text-slate-700 bg-slate-50',
    danger: 'border-rose-200 text-rose-700 bg-rose-50',
    warning: 'border-amber-200 text-amber-800 bg-amber-50',
    success: 'border-emerald-200 text-emerald-800 bg-emerald-50',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono border ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
