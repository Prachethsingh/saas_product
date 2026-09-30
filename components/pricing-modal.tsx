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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <LiquidGlassCard variant="neutral" className="relative w-full max-w-2xl p-6 sm:p-7 bg-white border-slate-200 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit recurring calendar schedules and recover engineering focus time.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manager Plan */}
          <div className="rounded-md border border-slate-200 bg-white p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-600 font-semibold">Manager Plan</span>
                <span className="text-[11px] font-mono text-slate-400">Per Seat</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">${PLANS.manager.price}</span>
                <span className="text-xs text-slate-500">/ seat / month</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                For engineering managers and team leads auditing individual team calendars.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {PLANS.manager.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('manager')}
              disabled={loadingPlan === 'manager'}
              className="mt-6 w-full py-2 rounded-md text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-50"
            >
              {loadingPlan === 'manager' ? 'Loading...' : 'Select Manager Plan ($15/mo)'}
            </button>
          </div>

          {/* Organization Plan */}
          <div className="rounded-md border border-slate-300 bg-slate-50 p-5 flex flex-col justify-between relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider text-slate-700 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 font-medium">
              Unlimited Seats
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-900 font-semibold">Organization Plan</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">${PLANS.team.price}</span>
                <span className="text-xs text-slate-500">/ month flat</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                For multi-team engineering organizations with centralized audit reporting.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {PLANS.team.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('team')}
              disabled={loadingPlan === 'team'}
              className="mt-6 w-full py-2 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50"
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
