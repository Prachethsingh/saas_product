'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard-nav';
import { PricingModal } from '@/components/pricing-modal';
import { GuideModal } from '@/components/guide-modal';
import { MobileDock } from '@/components/mobile-dock';

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
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800">
      <DashboardNav 
        onOpenPricing={() => setIsPricingOpen(true)} 
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28">
        {children}
      </main>

      <MobileDock 
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

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

      <footer className="border-t border-white/80 py-8 text-center text-xs text-slate-500 bg-white/40 backdrop-blur-xl mb-14 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MeetingDebt. Calendar analytics for engineering teams.</p>
          <div className="flex items-center gap-3 text-slate-600 font-mono text-[11px] flex-wrap">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-sky-700 hover:text-sky-900 transition-colors font-medium underline-offset-4 hover:underline"
            >
              Documentation
            </button>
            <span className="text-slate-300">/</span>
            <Link href="/privacy" className="hover:text-sky-900 transition-colors underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/terms" className="hover:text-sky-900 transition-colors underline-offset-4 hover:underline">
              Terms of Service
            </Link>
            <span className="text-slate-300">/</span>
            <span>Google API Limited Use Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
