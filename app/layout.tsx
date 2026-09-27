import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'MeetingDebt — Zombie-Meeting Score & Calendar Auditor',
  description: 'Connect Google Calendar to score recurring meetings on attendance decay, agenda staleness, and time sink signals. Auto-draft Slack messages to kill or shorten zombie meetings.',
  keywords: ['meeting auditor', 'zombie meetings', 'google calendar analytics', 'engineering productivity', 'saas'],
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
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-rose-500/30 selection:text-white bg-[#090a0f] text-zinc-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
