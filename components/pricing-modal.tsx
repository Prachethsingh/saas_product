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
        body: JSON.stringify({ planId }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <LiquidGlassCard variant="neutral" className="relative w-full max-w-3xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Plans & Subscriptions
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Reclaim payroll burn from zombie meetings. Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manager Pro */}
          <div className="rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-zinc-400">Manager Pro</span>
                <span className="text-[11px] font-mono text-zinc-500">Per seat</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-white tabular-nums">${PLANS.manager.price}</span>
                <span className="text-xs text-zinc-500">/ seat / month</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1.5">
                For engineering managers and tech leads auditing their direct team's schedule.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-zinc-300">
                {PLANS.manager.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('manager')}
              disabled={loadingPlan === 'manager'}
              className="mt-6 w-full py-2.5 rounded-lg text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
            >
              {loadingPlan === 'manager' ? 'Loading...' : 'Select Manager Pro ($15/mo)'}
            </button>
          </div>

          {/* Org Flat */}
          <div className="rounded-xl border border-white/25 bg-black/60 backdrop-blur-md p-5 flex flex-col justify-between relative shadow-[0_0_30px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.2)]">
            <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider text-zinc-200 bg-white/[0.1] px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-md">
              Unlimited Seats
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-zinc-200 font-semibold">Team & Org Flat</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-white tabular-nums">${PLANS.team.price}</span>
                <span className="text-xs text-zinc-500">/ month (flat)</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1.5">
                For engineering organizations (50–500 employees) with unlimited leads and managers.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-zinc-300">
                {PLANS.team.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-100 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('team')}
              disabled={loadingPlan === 'team'}
              className="mt-6 w-full py-2.5 rounded-lg text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 shadow-lg transition-all disabled:opacity-50"
            >
              {loadingPlan === 'team' ? 'Loading...' : 'Select Org Flat ($299/mo)'}
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-zinc-300" />
            <span>Read-only Google Calendar OAuth. SOC-2 compliant.</span>
          </div>
          <span>Billed via Stripe</span>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
