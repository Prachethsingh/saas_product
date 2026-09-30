import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'MeetingDebt: Calendar Analytics and Recurring Meeting Audit',
  description: 'Calendar analytics for engineering teams. Measure recurring meeting attendance decay, identify low-engagement calendar events, and draft schedule adjustments.',
  keywords: ['meeting auditor', 'recurring meeting analytics', 'google calendar analytics', 'engineering productivity'],
  authors: [{ name: 'MeetingDebt' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-slate-200 selection:text-slate-900 bg-white text-slate-900 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
