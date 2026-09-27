import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Application
      </Link>

      <div className="border-b border-white/[0.08] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Terms of Service</h1>
        <p className="text-xs text-zinc-400 mt-1">Last updated: September 2026</p>
      </div>

      <LiquidGlassCard variant="neutral" className="p-6 sm:p-8 space-y-6 text-xs text-zinc-300 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">1. Service Description</h2>
          <p>
            MeetingDebt provides calendar observability, decay scoring, and Slack message drafting services for organizations seeking to optimize recurring meeting schedules.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">2. Subscriptions & Billing</h2>
          <p>
            Subscriptions are billed on a monthly recurring basis via Stripe. You may cancel your subscription at any time without cancellation fees. Cancellations take effect at the conclusion of the active billing cycle.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">3. Acceptable Use</h2>
          <p>
            You agree to use MeetingDebt solely for lawful calendar administration and team productivity auditing within your authorized organization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">4. Limitation of Liability</h2>
          <p>
            MeetingDebt provides diagnostic scores and message recommendations. Meeting organizers and teams retain full discretion over calendar modifications and cancellations.
          </p>
        </section>
      </LiquidGlassCard>
    </div>
  );
}
