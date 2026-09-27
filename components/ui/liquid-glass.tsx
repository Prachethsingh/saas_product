'use client';

import React, { useRef, useState } from 'react';

/**
 * Global SVG Filters for Liquid Glass Refraction
 * Injects feDisplacementMap filter to simulate real optical glass refraction on the web without heavy WebGL.
 */
export function LiquidGlassFilterDefs() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -top-[9999px] -left-[9999px] w-0 h-0"
    >
      <defs>
        {/* Subtle optical edge refraction */}
        <filter id="liquid-refract-subtle" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Specular lighting for glass lens */}
        <filter id="liquid-specular">
          <feSpecularLighting
            result="specular"
            specularExponent="20"
            lightingColor="#ffffff"
          >
            <fePointLight x="50" y="-100" z="200" />
          </feSpecularLighting>
          <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </defs>
    </svg>
  );
}

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'neutral' | 'danger' | 'warning' | 'success';
  interactive?: boolean;
}

export function LiquidGlassCard({
  children,
  variant = 'neutral',
  interactive = true,
  className = '',
  ...props
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  // Color variants for Apple-style tinted glass
  const variantStyles = {
    neutral: 'border-white/[0.09] hover:border-white/[0.18]',
    danger: 'border-rose-500/25 hover:border-rose-500/40 bg-gradient-to-b from-rose-500/[0.04] to-transparent',
    warning: 'border-amber-500/25 hover:border-amber-500/40 bg-gradient-to-b from-amber-500/[0.04] to-transparent',
    success: 'border-emerald-500/25 hover:border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.04] to-transparent',
  }[variant];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl border backdrop-blur-2xl bg-zinc-900/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(0,0,0,0.5)] transition-all duration-200 overflow-hidden ${variantStyles} ${className}`}
      {...props}
    >
      {/* Specular dynamic light highlight following cursor */}
      {interactive && mousePos.active && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 60%)`,
          }}
        />
      )}

      {/* Top bevel highlight (Apple Glass specular rim) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface LiquidGlassPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'danger' | 'warning' | 'success' | 'neutral';
}

export function LiquidGlassPill({
  children,
  variant = 'neutral',
  className = '',
  ...props
}: LiquidGlassPillProps) {
  const variantStyles = {
    neutral: 'border-white/10 text-zinc-300 bg-white/[0.04]',
    danger: 'border-rose-400/30 text-rose-300 bg-rose-500/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]',
    warning: 'border-amber-400/30 text-amber-300 bg-amber-500/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]',
    success: 'border-emerald-400/30 text-emerald-300 bg-emerald-500/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono backdrop-blur-xl border ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
