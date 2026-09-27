'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard-nav';
import { PricingModal } from '@/components/pricing-modal';
import { GuideModal } from '@/components/guide-modal';
import { LiquidGlassFilterDefs } from '@/components/ui/liquid-glass';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  React.useEffect(() => {
    const handleOpenGuide = () => setIsGuideOpen(true);
    const handleOpenPricing = () => setIsPricingOpen(true);
    window.addEventListener('open-guide', handleOpenGuide);
    window.addEventListener('open-pricing', handleOpenPricing);
    return () => {
      window.removeEventListener('open-guide', handleOpenGuide);
      window.removeEventListener('open-pricing', handleOpenPricing);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-zinc-100 selection:bg-rose-500/20 selection:text-white">
      {/* SVG Refraction Filters */}
      <LiquidGlassFilterDefs />

      <DashboardNav 
        onOpenPricing={() => setIsPricingOpen(true)} 
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenSimulator={() => {
          const el = document.getElementById('meeting-simulator');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <footer className="border-t border-white/[0.08] py-6 text-center text-xs text-zinc-500 bg-[#07080c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MeetingDebt. Built for EMs, Ops Leads, and Engineering teams.</p>
          <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px] flex-wrap">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-amber-300/80 hover:text-amber-200 transition-colors underline-offset-4 hover:underline"
            >
              📖 Product Guide
            </button>
            <span className="text-zinc-600">•</span>
            <Link href="/privacy" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/terms" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Terms of Service
            </Link>
            <span className="text-zinc-600">•</span>
            <span>Google API Limited Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
