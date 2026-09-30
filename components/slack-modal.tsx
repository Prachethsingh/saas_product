'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Send, MessageSquare, Info } from 'lucide-react';
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

type ProposalTone = 'diplomatic' | 'direct' | 'async';

export function SlackModal({ isOpen, onClose, meeting }: SlackModalProps) {
  const [tone, setTone] = useState<ProposalTone>('diplomatic');
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [dispatchMode, setDispatchMode] = useState<'bot' | 'webhook'>('bot');
  const [channelId, setChannelId] = useState('');
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
        return `Notice: Calendar review for "${meeting.title}"

Our team logged ${meeting.durationMinutes * 4} minutes this month on this recurring slot, while accepted attendance dropped from ${earlyAvg} to ${recentAvg} participants.

Estimated impact: Sunsetting this recurring slot recovers approximately ${meeting.hoursReclaimablePerMonth} engineering hours/month across participants.

Unless there are active launch blockers requiring live synchronous time, I propose removing next week's occurrence and keeping updates in this channel.`;

      case 'async':
        return `Team: Proposing we transition "${meeting.title}" to an asynchronous format.

To protect focused engineering blocks, let us replace this ${meeting.durationMinutes}-minute calendar call with a weekly status thread in this channel every Monday morning.

Format:
1. Shipped in previous cycle
2. Priorities for current cycle
3. Active blockers

Please comment if you support switching to an async thread or if live discussion is still needed.`;

      case 'diplomatic':
      default:
        return `Team: I have been reviewing our recurring schedule to protect uninterrupted focus blocks.

Over the last 8 occurrences of "${meeting.title}", accepted attendance dropped from ${earlyAvg} to ${recentAvg} attendees, and routine updates can be shared asynchronously.

Proposal: Remove this recurring calendar invite and move updates to a weekly thread in this channel.

This recovers approximately ${meeting.hoursReclaimablePerMonth} engineering hours/month across the team.

Please comment with your feedback or mention if there are topics requiring live synchronous discussion.`;
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

  const handleSendToSlack = async () => {
    if (dispatchMode === 'bot' && !channelId.trim()) {
      setErrorMessage('Please enter a Slack Channel ID (example: C0123456789).');
      return;
    }
    if (dispatchMode === 'webhook' && !webhookUrl.trim()) {
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
          customText: activeText,
          channel: dispatchMode === 'bot' ? channelId.trim() : undefined,
          webhookUrl: dispatchMode === 'webhook' ? webhookUrl.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.sentToSlack) {
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 5000);
      } else {
        setErrorMessage(data.error || 'Failed to dispatch to Slack');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error occurred');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/20 backdrop-blur-md animate-fade-in">
      <LiquidGlassCard variant="serene" className="relative w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden bg-white/95 border-sky-100/80 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-sky-100 bg-sky-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-sky-950 text-sm">
                Slack Notice Drafter
              </h3>
              <p className="text-[11px] text-slate-500">
                Message template for "{meeting.title}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Tone Selector */}
          <div>
            <label className="text-[11px] font-mono uppercase text-slate-500 font-semibold block mb-1.5">
              Select Message Format:
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleToneChange('diplomatic')}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                  tone === 'diplomatic'
                    ? 'bg-sky-600 text-white font-medium shadow-xs'
                    : 'bg-white/70 text-sky-950 hover:bg-white border border-white/80'
                }`}
              >
                Collaborative
              </button>
              <button
                onClick={() => handleToneChange('direct')}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                  tone === 'direct'
                    ? 'bg-sky-600 text-white font-medium shadow-xs'
                    : 'bg-white/70 text-sky-950 hover:bg-white border border-white/80'
                }`}
              >
                Data-Driven
              </button>
              <button
                onClick={() => handleToneChange('async')}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                  tone === 'async'
                    ? 'bg-sky-600 text-white font-medium shadow-xs'
                    : 'bg-white/70 text-sky-950 hover:bg-white border border-white/80'
                }`}
              >
                Async Proposal
              </button>
            </div>
          </div>

          {/* Editable Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Message Body:</span>
              <span>{activeText.length} characters</span>
            </div>
            <textarea
              rows={8}
              value={activeText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-mono leading-relaxed focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          {/* Dispatch Settings */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                Direct Dispatch:
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setDispatchMode('bot')}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                    dispatchMode === 'bot'
                      ? 'bg-white text-slate-900 font-medium shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bot App
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchMode('webhook')}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                    dispatchMode === 'webhook'
                      ? 'bg-white text-slate-900 font-medium shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Incoming Webhook
                </button>
              </div>
            </div>

            {dispatchMode === 'bot' ? (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Slack Channel ID (e.g. C0123456789)"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-md bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-mono"
                  />
                  <button
                    onClick={handleSendToSlack}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSending ? 'Sending...' : 'Post to Channel'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Right-click your channel in Slack, select View channel details, and copy Channel ID.</span>
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-md bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-mono"
                  />
                  <button
                    onClick={handleSendToSlack}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSending ? 'Sending...' : 'Send Webhook'}</span>
                  </button>
                </div>
              </div>
            )}

            {sendSuccess && (
              <div className="p-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Message successfully posted to Slack channel.</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-2 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/80 bg-white/60 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Reclaims approx. {meeting.hoursReclaimablePerMonth} hrs/mo
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
          </button>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
