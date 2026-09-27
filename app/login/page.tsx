'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, ArrowRight, Lock, Check } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export default function LoginPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);

  const handleGoogleSignIn = () => {
    setConnecting(true);
    window.location.href = '/api/auth/signin/google';
  };

  const handleDemoSignIn = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl text-white mb-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
            <Activity className="w-5 h-5 text-zinc-100" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            MeetingDebt
          </h1>
          <p className="text-xs text-zinc-400">
            Audit recurring calendar telemetry and eliminate zombie meetings.
          </p>
        </div>

        {/* Liquid Glass Card */}
        <LiquidGlassCard variant="neutral" className="p-6 space-y-5">
          <div className="space-y-2.5">
            <button
              onClick={handleGoogleSignIn}
              disabled={connecting}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{connecting ? 'Connecting...' : 'Continue with Google Workspace'}</span>
            </button>

            <button
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] backdrop-blur-md flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Explore Interactive Demo</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>
          </div>

          <div className="pt-4 border-t border-white/[0.06] space-y-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Permission Guarantee</span>
            </div>
            <ul className="space-y-1 text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span><code className="text-zinc-200">calendar.readonly</code> only (cannot edit/delete)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Zero email body or attachment access</span>
              </li>
            </ul>
          </div>
        </LiquidGlassCard>

        <div className="text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-zinc-400" />
          <span>SOC-2 certified infrastructure</span>
        </div>
      </div>
    </div>
  );
}
