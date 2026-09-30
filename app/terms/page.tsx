import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-0.5">Last updated: September 2026</p>
      </div>

      <LiquidGlassCard variant="neutral" className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed font-sans bg-white border-slate-200 shadow-sm">
        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">1. Service Description</h2>
          <p>
            MeetingDebt provides calendar observability, decay scoring, and Slack message drafting services for organizations seeking to optimize recurring meeting schedules.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">2. Subscriptions and Billing</h2>
          <p>
            Subscriptions are billed on a monthly recurring basis via Stripe. You may cancel your subscription at any time without cancellation fees. Cancellations take effect at the conclusion of the active billing cycle.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">3. Acceptable Use</h2>
          <p>
            You agree to use MeetingDebt solely for lawful calendar administration and team productivity auditing within your authorized organization.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">4. Limitation of Liability</h2>
          <p>
            MeetingDebt provides diagnostic scores and message recommendations. Meeting organizers and teams retain full discretion over calendar modifications and cancellations.
          </p>
        </section>
      </LiquidGlassCard>
    </div>
  );
}
