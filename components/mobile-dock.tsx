'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Compass, Calendar, Users, User, Calculator, BookOpen, Sliders } from 'lucide-react';

interface MobileDockProps {
  onOpenSimulator?: () => void;
  onOpenGuide?: () => void;
  onOpenPricing?: () => void;
}

export function MobileDock({ onOpenSimulator, onOpenGuide, onOpenPricing }: MobileDockProps) {
  const [activeItem, setActiveItem] = useState<'home' | 'explore' | 'plan' | 'community' | 'profile'>('home');

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md" aria-label="Mobile and Quick Navigation Dock">
      <div className="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 p-2 shadow-[0_12px_40px_rgba(15,60,110,0.12),inset_0_1px_2px_rgba(255,255,255,0.95)] flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => {
            setActiveItem('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeItem === 'home'
              ? 'text-sky-600 scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeItem === 'home' ? 'bg-sky-100/70' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Home</span>
        </button>

        {/* Explore / Audit */}
        <button
          onClick={() => {
            setActiveItem('explore');
            const el = document.getElementById('audit-list');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeItem === 'explore'
              ? 'text-sky-600 scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeItem === 'explore' ? 'bg-sky-100/70' : ''}`}>
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Explore</span>
        </button>

        {/* Plan / Simulator */}
        <button
          onClick={() => {
            setActiveItem('plan');
            if (onOpenSimulator) {
              onOpenSimulator();
            } else {
              const el = document.getElementById('meeting-simulator');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeItem === 'plan'
              ? 'text-sky-600 scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeItem === 'plan' ? 'bg-sky-100/70' : ''}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Plan</span>
        </button>

        {/* Community / Guide */}
        <button
          onClick={() => {
            setActiveItem('community');
            if (onOpenGuide) onOpenGuide();
            else window.dispatchEvent(new CustomEvent('open-guide'));
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeItem === 'community'
              ? 'text-sky-600 scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeItem === 'community' ? 'bg-sky-100/70' : ''}`}>
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Guide</span>
        </button>

        {/* Profile / Billing */}
        <button
          onClick={() => {
            setActiveItem('profile');
            if (onOpenPricing) onOpenPricing();
            else window.dispatchEvent(new CustomEvent('open-pricing'));
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
            activeItem === 'profile'
              ? 'text-sky-600 scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeItem === 'profile' ? 'bg-sky-100/70' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
}
