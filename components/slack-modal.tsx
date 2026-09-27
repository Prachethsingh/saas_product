'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Send, MessageSquare, Info, Sparkles } from 'lucide-react';
import { generateSlackDraft, SlackDraftMessage } from '@/lib/slack';
import { LiquidGlassCard } from './ui/liquid-glass';

interface SlackModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    id: string;
    title: string;
    score: number;
    recommendation: 'kill' | 'shorten' | 'healthy' | 'observation';
    durationMinutes: number;
    attendeeCount: number;
    hoursReclaimablePerMonth: number;
    breakdown?: any;
  } | null;
}

type ProposalTone = 'diplomatic' | 'direct' | 'async' | 'humorous';

export function SlackModal({ isOpen, onClose, meeting }: SlackModalProps) {
  const [tone, setTone] = useState<ProposalTone>('diplomatic');
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !meeting) return null;

  const earlyAvg = meeting.breakdown?.rawMetrics?.earlyAvgAccepted || Math.round(meeting.attendeeCount * 0.9);
  const recentAvg = meeting.breakdown?.rawMetrics?.recentAvgAccepted || Math.round(meeting.attendeeCount * 0.35);

  const getTemplateByTone = (t: ProposalTone): string => {
    switch (t) {
      case 'direct':
        return `⚠️ Calendar Audit Alert: *${meeting.title}*

Our team spent ~${meeting.durationMinutes * 4} minutes this month on this recurring slot, while active accepted attendance dropped from ${earlyAvg} to ${recentAvg} participants.

📊 *Impact:* Sunsetting this meeting will instantly reclaim *~${meeting.hoursReclaimablePerMonth} engineering hours/month*.

Unless there are active launch blockers requiring live synchronous time, I am canceling next week's occurrence. Please post any critical updates in this channel.`;

      case 'async':
        return `👋 Hey team! Proposing we transition *${meeting.title}* to an asynchronous format.

To protect everyone's focus blocks, let's replace this ${meeting.durationMinutes}-minute calendar call with a weekly automated check-in thread right here in this channel every Monday morning.

🎯 *Format:*
1. What shipped last week
2. Top priority for this week
3. Immediate blockers

Reply with 👍 if you support switching to async!`;

      case 'humorous':
        return `🧟‍♂️ *Zombie Meeting Alert:* Time to put "${meeting.title}" out of its misery!

Our calendar auditor calculated a *Zombie Score of ${meeting.score}/100*. Attendance has quietly dropped by ~${Math.round(((earlyAvg - recentAvg) / earlyAvg) * 100)}%, and we're mostly staring at each other on mute.

Let's kill this calendar invite and celebrate getting *${meeting.hoursReclaimablePerMonth} hours/month* of our lives back.

Hit 👍 to pull the plug, or speak now to save it!`;

      case 'diplomatic':
      default:
        return `👋 Hey team — I've been reviewing our recurring syncs to protect everyone's deep-work focus time.

Over the last 8 occurrences of *${meeting.title}*, attendance has dropped from ~${earlyAvg} down to ~${recentAvg} attendees, and most updates can now be shared asynchronously.

🎯 *Proposal:* Let's cancel this recurring calendar slot and move our updates to an async weekly thread in this channel instead.

This frees up *~${meeting.hoursReclaimablePerMonth} hours/month* of uninterrupted engineering time across the team.

Reply with :+1: if you support killing it, or let me know if there's a critical blocker that still requires live synchronous discussion!`;
    }
  };

  const activeText = customText || getTemplateByTone(tone);

  const handleToneChange = (newTone: ProposalTone) => {
    setTone(newTone);
    setCustomText(getTemplateByTone(newTone));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWebhook = async () => {
    if (!webhookUrl) {
      setErrorMessage('Please enter an incoming Slack Webhook URL.');
      return;
    }
    setIsSending(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/slack/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          zombieScore: meeting.score,
          recommendation: meeting.recommendation,
          durationMinutes: meeting.durationMinutes,
          attendeeCount: meeting.attendeeCount,
          hoursReclaimablePerMonth: meeting.hoursReclaimablePerMonth,
          webhookUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 4000);
      } else {
        setErrorMessage(data.error || 'Failed to dispatch to Slack');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <LiquidGlassCard variant="neutral" className="relative w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4A154B] flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">
                Slack Auto-Draft Generator
              </h3>
              <p className="text-[11px] text-zinc-400">
                Customizable message templates for "{meeting.title}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Tone Selector Pills */}
          <div>
            <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1.5">
              Select Message Tone:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleToneChange('diplomatic')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  tone === 'diplomatic'
                    ? 'bg-white text-zinc-950 font-bold shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                Diplomatic & Polite
              </button>
              <button
                onClick={() => handleToneChange('direct')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  tone === 'direct'
                    ? 'bg-rose-500 text-white font-bold shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-rose-300 border border-white/10'
                }`}
              >
                Direct & Data-Driven
              </button>
              <button
                onClick={() => handleToneChange('async')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  tone === 'async'
                    ? 'bg-indigo-500 text-white font-bold shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-indigo-300 border border-white/10'
                }`}
              >
                Async Thread Proposal
              </button>
              <button
                onClick={() => handleToneChange('humorous')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  tone === 'humorous'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-amber-300 border border-white/10'
                }`}
              >
                Zombie-Hunter 🧟
              </button>
            </div>
          </div>

          {/* Editable Live Slack Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Editable Message Body:</span>
              <span className="text-zinc-500">{activeText.length} characters</span>
            </div>
            <textarea
              rows={8}
              value={activeText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-black/60 border border-white/[0.1] text-zinc-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-white/30 shadow-inner resize-none"
            />
          </div>

          {/* Direct webhook sender */}
          <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
            <label className="text-[11px] font-mono uppercase text-zinc-400">
              Optional: Dispatch directly to team Slack webhook
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-black/50 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
              />
              <button
                onClick={handleSendWebhook}
                disabled={isSending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4A154B] hover:bg-[#611f69] text-white transition-all disabled:opacity-50 shadow-md"
              >
                <Send className="w-3 h-3" />
                <span>{isSending ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
            {sendSuccess && (
              <p className="text-xs text-emerald-400 font-mono">
                ✓ Posted to Slack channel.
              </p>
            )}
            {errorMessage && (
              <p className="text-xs text-rose-400 font-mono">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-black/40 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            Reclaims <strong className="text-zinc-200">~{meeting.hoursReclaimablePerMonth} hrs/mo</strong>
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-900" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Slack Proposal'}</span>
          </button>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
