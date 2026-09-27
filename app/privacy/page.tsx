import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Application
      </Link>

      <div className="border-b border-white/[0.08] pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Google API Limited Use Disclosure</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Privacy Policy</h1>
        <p className="text-xs text-zinc-400 mt-1">Last updated: September 2026</p>
      </div>

      <LiquidGlassCard variant="neutral" className="p-6 sm:p-8 space-y-6 text-xs text-zinc-300 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">1. Scope of Calendar Telemetry</h2>
          <p>
            MeetingDebt accesses Google Calendar using the <code>https://www.googleapis.com/auth/calendar.readonly</code> scope exclusively. We analyze recurring calendar metadata (event timestamps, accepted/declined attendance status, and description text hashes) strictly to calculate zombie meeting scores and attendance decay.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">2. What We Never Access</h2>
          <p>
            MeetingDebt does not read your emails, contacts, document contents, private calendar events, video/audio transcripts, or personal messages. We never sell, rent, or transfer user data to third-party data brokers or advertising networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">3. Google API Services User Data Policy Compliance</h2>
          <p>
            MeetingDebt’s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">4. Data Retention & Deletion</h2>
          <p>
            Users can disconnect their Google Calendar and purge all historical scoring records at any time directly through the dashboard or by contacting security@meetingdebt.io. All tokens are encrypted at rest with AES-256.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white">5. Security Infrastructure</h2>
          <p>
            Our application is hosted on secure, SOC-2 compliant cloud infrastructure. Webhooks and cron executions are protected with cryptographically secure signatures.
          </p>
        </section>
      </LiquidGlassCard>
    </div>
  );
}
