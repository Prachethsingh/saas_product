'use client';

import React, { useState } from 'react';
import { Bell, Sparkles, Moon, Activity, Droplets, Dumbbell, Compass, Heart, ArrowUpRight } from 'lucide-react';

interface VitalsHeroProps {
  totalReclaimableHours: number;
  annualWaste: number;
  hourlyRate: number;
  killCount: number;
  shortenCount: number;
  healthyCount: number;
  onOpenGuide?: () => void;
  onOpenSimulator?: () => void;
  onOpenPricing?: () => void;
}

export function VitalsHero({
  totalReclaimableHours,
  annualWaste,
  hourlyRate,
  killCount,
  shortenCount,
  healthyCount,
  onOpenGuide,
  onOpenSimulator,
  onOpenPricing,
}: VitalsHeroProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'audit'>('overview');
  const [selectedDay, setSelectedDay] = useState<string>('Fri');

  // Days for the wellness journey chart
  const weekData = [
    { day: 'Mon', score: 35, hours: 2.5, attendees: 14 },
    { day: 'Tue', score: 55, hours: 4.0, attendees: 12 },
    { day: 'Wed', score: 42, hours: 3.0, attendees: 10 },
    { day: 'Thu', score: 68, hours: 5.5, attendees: 9 },
    { day: 'Fri', score: 84, hours: 6.0, attendees: 6 },
    { day: 'Sat', score: 20, hours: 0.5, attendees: 2 },
    { day: 'Sun', score: 15, hours: 0.0, attendees: 0 },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Top Greeting Bar */}
      <div className="flex items-center justify-between px-2 pt-1 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-tr from-sky-400 via-teal-300 to-indigo-400 flex items-center justify-center text-white font-semibold text-sm">
              <span className="drop-shadow-sm">S</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Good Morning, Serena!</span>
            </div>
            <div className="text-xs text-sky-800/70 font-medium">
              Calendar Vitals · Engineering Team Workspace
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="relative p-2.5 rounded-full bg-white/70 hover:bg-white/90 border border-white/80 text-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            title="Notifications & Updates"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-sm ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Segmented Switcher Tab */}
      <div className="p-1 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
            activeTab === 'overview'
              ? 'bg-white/90 text-sky-900 shadow-sm border border-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          OVERVIEW
        </button>
        <button
          onClick={() => {
            setActiveTab('goals');
            if (onOpenSimulator) onOpenSimulator();
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
            activeTab === 'goals'
              ? 'bg-white/90 text-sky-900 shadow-sm border border-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          SCHEDULE GOALS
        </button>
        <button
          onClick={() => {
            setActiveTab('audit');
            const el = document.getElementById('audit-list');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
            activeTab === 'audit'
              ? 'bg-white/90 text-sky-900 shadow-sm border border-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          AUDIT QUEUE
        </button>
      </div>

      {/* Two Hero Cards: Your Daily Vitals + Stress Level - Golden Ratio Alignment (1.618 : 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-4">
        {/* Your Daily Vitals (Golden Major: 61.8%) */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/90 p-5 shadow-[0_12px_32px_-4px_rgba(15,60,110,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-sky-950 tracking-tight">Your Daily Vitals</h2>
            <div className="w-6 h-6 rounded-full bg-sky-100/90 border border-white flex items-center justify-center text-sky-600 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-5">
            {/* Circular Gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-sky-100/80"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring with soft cyan/sky gradient */}
                <defs>
                  <linearGradient id="vitalsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#vitalsGrad)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.74)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-mono font-bold text-sky-950 tracking-tight tabular-nums">
                  +{totalReclaimableHours}h
                </span>
                <span className="text-[10px] text-sky-800/80 font-medium -mt-0.5 font-mono">
                  Recovery/Mo
                </span>
              </div>
            </div>

            {/* Vital Breakdown Lines */}
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-[11px] text-slate-600 font-medium">Review Queue</div>
                  <div className="text-xs font-semibold text-sky-950">{killCount + shortenCount} Series</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-600 font-medium">Healthy Cadence</div>
                  <div className="text-xs font-semibold text-emerald-600">{healthyCount} Series</div>
                </div>
              </div>

              <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Moon className="w-3.5 h-3.5 text-sky-500" />
                  <span>Est. Annual Waste</span>
                </div>
                <div className="font-semibold text-rose-600 text-xs font-mono tabular-nums">
                  ${annualWaste.toLocaleString()}/yr
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stress Level / Schedule Density Card (Golden Minor: 38.2%) */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/90 p-5 shadow-[0_12px_32px_-4px_rgba(15,60,110,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-sky-950 tracking-tight">Stress Level</h2>
            <span className="text-[10px] font-medium text-sky-800 bg-sky-100/80 border border-sky-200/60 px-2.5 py-0.5 rounded-full">
              Optimized
            </span>
          </div>

          {/* Smooth Serene Wave SVG Graph */}
          <div className="relative h-14 w-full my-1 flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                d="M 0 35 C 30 15, 60 45, 90 25 C 120 10, 150 40, 200 20 L 200 60 L 0 60 Z"
                fill="url(#waveFill)"
              />
              <path
                d="M 0 35 C 30 15, 60 45, 90 25 C 120 10, 150 40, 200 20"
                fill="transparent"
                stroke="#0ea5e9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-sky-100">
            <div>
              <div className="text-xs font-semibold text-sky-950">Calm Cadence</div>
              <div className="text-[10px] text-slate-600">Low meeting fatigue index across team</div>
            </div>
            <span className="text-[11px] font-mono font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
              Score: 24/100
            </span>
          </div>
        </div>
      </div>

      {/* Row of 3 Quick Glass Chips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/65 backdrop-blur-xl border border-white/85 p-3.5 shadow-[0_6px_20px_-2px_rgba(15,60,110,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <div className="text-[10px] font-medium text-slate-600">Audit Status</div>
          <div className="text-xs sm:text-sm font-semibold text-sky-950 mt-0.5 truncate">
            Nightly Active
          </div>
        </div>

        <div className="rounded-2xl bg-white/65 backdrop-blur-xl border border-white/85 p-3.5 shadow-[0_6px_20px_-2px_rgba(15,60,110,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <div className="text-[10px] font-medium text-slate-600">Sunset Candidates</div>
          <div className="text-xs sm:text-sm font-semibold text-rose-600 mt-0.5 truncate">
            {killCount} Series Flagged
          </div>
        </div>

        <div className="rounded-2xl bg-white/65 backdrop-blur-xl border border-white/85 p-3.5 shadow-[0_6px_20px_-2px_rgba(15,60,110,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <div className="text-[10px] font-medium text-slate-600">Focus Recovery</div>
          <div className="text-xs sm:text-sm font-semibold text-emerald-600 mt-0.5 truncate">
            +{totalReclaimableHours} hrs/month
          </div>
        </div>
      </div>

      {/* My Wellness Journey / Weekly Trend Card */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/90 p-5 shadow-[0_12px_32px_-4px_rgba(15,60,110,0.07),inset_0_1px_2px_rgba(255,255,255,0.95)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-sky-950 tracking-tight">Weekly Attendance & Focus Journey</h2>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Attendance consistency and focus capacity over the past 7 days
            </p>
          </div>
          <span className="text-[11px] font-mono text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 font-medium">
            7-Day Cadence
          </span>
        </div>

        {/* Smooth Connecting Dot Curve Graph */}
        <div className="relative pt-2 pb-1 overflow-hidden">
          <div className="h-28 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 700 110" preserveAspectRatio="none">
              <defs>
                <linearGradient id="journeyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area Under Connected Curve */}
              <path
                d="M 50 75 C 100 65, 120 48, 150 48 C 180 48, 220 60, 250 60 C 290 60, 310 32, 350 32 C 390 32, 420 18, 450 18 C 490 18, 510 55, 550 55 C 590 55, 610 12, 650 12 L 650 110 L 50 110 Z"
                fill="url(#journeyFill)"
              />

              {/* Smooth Spline Curve Stroke */}
              <path
                d="M 50 75 C 100 65, 120 48, 150 48 C 180 48, 220 60, 250 60 C 290 60, 310 32, 350 32 C 390 32, 420 18, 450 18 C 490 18, 510 55, 550 55 C 590 55, 610 12, 650 12"
                fill="transparent"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Circular Dots on Each Day with Glow */}
              {[
                { x: 50, y: 75, day: 'Mon' },
                { x: 150, y: 48, day: 'Tue' },
                { x: 250, y: 60, day: 'Wed' },
                { x: 350, y: 32, day: 'Thu' },
                { x: 450, y: 18, day: 'Fri' },
                { x: 550, y: 55, day: 'Sat' },
                { x: 650, y: 12, day: 'Sun' },
              ].map((pt, i) => (
                <g key={i} className="cursor-pointer" onClick={() => setSelectedDay(pt.day)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={selectedDay === pt.day ? 6.5 : 5}
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={selectedDay === pt.day ? 3 : 2}
                    fill="#0284c7"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Days Label Row */}
          <div className="grid grid-cols-7 text-center pt-2 text-[11px] font-medium text-slate-500">
            {weekData.map((w) => (
              <button
                key={w.day}
                onClick={() => setSelectedDay(w.day)}
                className={`py-1 rounded-lg transition-colors ${
                  selectedDay === w.day ? 'font-bold text-sky-800 bg-sky-100/60' : 'hover:text-slate-800'
                }`}
              >
                {w.day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
