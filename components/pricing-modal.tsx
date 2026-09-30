'use client';

import React, { useState } from 'react';
import { X, Check, Shield } from 'lucide-react';
import { PLANS } from '@/lib/stripe';
import { LiquidGlassCard } from './ui/liquid-glass';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (planId: 'manager' | 'team') => {
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          returnUrl: typeof window !== 'undefined' ? window.location.origin : undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/20 backdrop-blur-md">
      <LiquidGlassCard variant="serene" className="relative w-full max-w-2xl p-6 sm:p-7 bg-white/95 border-sky-100/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-sky-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-sky-950 tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit recurring calendar schedules and recover engineering focus time.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manager Plan */}
          <div className="rounded-xl border border-sky-100 bg-white/80 p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-sky-800 font-semibold">Manager Plan</span>
                <span className="text-[11px] font-mono text-slate-400">Per Seat</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-sky-950 tabular-nums">${PLANS.manager.price}</span>
                <span className="text-xs text-slate-500">/ seat / month</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                For engineering managers and team leads auditing individual team calendars.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {PLANS.manager.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('manager')}
              disabled={loadingPlan === 'manager'}
              className="mt-6 w-full py-2.5 rounded-lg text-xs font-medium text-sky-900 bg-sky-50/80 hover:bg-sky-100 border border-sky-200/70 transition-all disabled:opacity-50"
            >
              {loadingPlan === 'manager' ? 'Loading...' : 'Select Manager Plan ($15/mo)'}
            </button>
          </div>

          {/* Organization Plan */}
          <div className="rounded-xl border border-sky-200/90 bg-sky-50/40 p-5 flex flex-col justify-between relative shadow-sm">
            <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider text-sky-800 bg-white/90 px-2 py-0.5 rounded-md border border-sky-200 font-medium">
              Unlimited Seats
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-sky-950 font-semibold">Organization Plan</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-sky-950 tabular-nums">${PLANS.team.price}</span>
                <span className="text-xs text-slate-500">/ month flat</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                For multi-team engineering organizations with centralized audit reporting.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {PLANS.team.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('team')}
              disabled={loadingPlan === 'team'}
              className="mt-6 w-full py-2.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-sm transition-all disabled:opacity-50"
            >
              {loadingPlan === 'team' ? 'Loading...' : 'Select Organization Plan ($299/mo)'}
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span>Read-only Google Calendar OAuth scope.</span>
          </div>
          <span>Billed through Stripe</span>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
