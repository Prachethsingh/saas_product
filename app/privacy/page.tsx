import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono mb-2 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>Google API Limited Use Disclosure</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-0.5">Last updated: September 2026</p>
      </div>

      <LiquidGlassCard variant="neutral" className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed font-sans bg-white border-slate-200 shadow-sm">
        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">1. Scope of Calendar Telemetry</h2>
          <p>
            MeetingDebt accesses Google Calendar using the <code>https://www.googleapis.com/auth/calendar.readonly</code> scope exclusively. We analyze recurring calendar metadata (event timestamps, accepted and declined attendance status, and description text hashes) strictly to calculate attendance rate decay.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">2. Excluded Data</h2>
          <p>
            MeetingDebt does not read emails, contacts, document contents, private calendar events, or personal messages. We never sell, rent, or transfer user data to third-party data brokers or advertising networks.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">3. Google API Services User Data Policy Compliance</h2>
          <p>
            MeetingDebt adherence to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 underline font-medium"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">4. Data Retention and Deletion</h2>
          <p>
            Users can disconnect their Google Calendar and purge all historical scoring records at any time through the dashboard or by contacting support.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-slate-900">5. Security Infrastructure</h2>
          <p>
            Our application is hosted on secure, SOC-2 compliant cloud infrastructure. Webhooks and cron executions are protected with cryptographically secure signatures.
          </p>
        </section>
      </LiquidGlassCard>
    </div>
  );
}
