# meetingdebt DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: Tailwind CSS 3.4.17 + React 18.3.1 + Next.js 14.2.23
> Colors: 12 · Fonts: 0 · Components: 15
> Icon library: Lucide · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography uses **sans-serif** throughout — a clean, modern choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The accent color **#1d4ed8** anchors interactive elements (buttons, links, focus rings). Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#fafbfe` | background | Page background, darkest surface |
| surface-400 | `#cbd5e1` | surface | Card and panel backgrounds |
| surface-300 | `#e2e8f0` | surface | Card and panel backgrounds |
| surface | `#94a3b8` | surface | Card and panel backgrounds |
| foreground | `#090a12` | text-primary | Headings and body text |
| signal-neutral | `#64748b` | text-muted | Captions, placeholders, secondary info |
| brand-hover | `#1d4ed8` | accent | CTAs, links, focus rings, active states |
| signal-danger | `#e11d48` | danger | Error states, destructive actions |
| signal-success | `#059669` | success | Success states, positive indicators |
| signal-warning | `#d97706` | warning | Warning states, caution indicators |
| brand-DEFAULT | `#2563eb` | info | Informational highlights |
| foreground | `#0f172a` | unknown | Palette color |

### CSS Variable Tokens

```css
--background: #ffffff;
--foreground: #0f172a;
```


---

## 3. Typography Rules

No typography tokens detected.

---

## 4. Component Stylings

### Layout (12)

**GuideModal** — `components/guide-modal.tsx`
- Variants: `quickstart`, `formula`, `slack`, `google`, `simulator`
- Props: `isOpen`, `onClose`, `onOpenSimulator`
- Key Styles: `rounded`, `border-slate-200`, `bg-slate-900/50`, `p-3`, `text-base`, `font-semibold`, `backdrop-blur-sm`, `hover:text-slate-700`
- Animation: tw-transitions: transition-colors
- State: useState

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <LiquidGlassCard variant="neutral" className="relative w-full max-w-4xl p-5 sm:p-7 max-h-[90vh] flex flex-col overflow-hidden my-auto bg-white border-slate-200 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-700 transition-colors z-10"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
```

**MeetingSimulator** — `components/meeting-simulator.tsx`
- Props: `hourlyRate`, `onAddMeeting`, `newMeeting`, `onOpenSlackDraft`, `meeting`
- Key Styles: `rounded-md`, `border-slate-200`, `bg-slate-100`, `p-4`, `text-sm`, `font-semibold`, `cursor-pointer`
- Animation: tw-transitions: transition-colors
- State: useState

```tsx
<LiquidGlassCard
      variant={simResult.score >= 70 ? 'danger' : simResult.score >= 40 ? 'warning' : 'neutral'}
      className="p-4 sm:p-5 border"
    >
      {/* Header bar that toggles expand */}
      <div
        onClick={(
```

**PricingModal** — `components/pricing-modal.tsx`
- Variants: `manager`, `team`
- Props: `isOpen`, `onClose`
- Key Styles: `rounded`, `border-slate-200`, `bg-slate-900/50`, `p-4`, `text-base`, `font-semibold`, `backdrop-blur-sm`, `hover:text-slate-700`
- Animation: tw-transitions: transition-colors
- State: useState

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <LiquidGlassCard variant="neutral" className="relative w-full max-w-2xl p-6 sm:p-7 bg-white border-slate-200 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
            Subscription Plans
```

**ScoreBadge** — `components/score-badge.tsx`
- Variants: `kill`, `shorten`, `healthy`, `sm`, `md`, `observation`, `lg`
- Props: `score`, `recommendation`, `isObservation`, `size`
- Key Styles: `rounded-full`, `border-slate-200`, `bg-slate-400`, `gap-1.5`, `font-sans`, `opacity-60`

```tsx
<div
        className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-2.5 py-1 text-xs'
            : 'px-2 py-0.5 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span className="font-sans font-medium text-slate-700">Baseline Calibration</span>
        <span className="text-slate-500 font-mono text-[11px]">(under 6 occurrences
```

**SlackModal** — `components/slack-modal.tsx`
- Variants: `kill`, `shorten`, `healthy`, `diplomatic`, `direct`, `bot`, `observation`, `async`, `webhook`
- Props: `isOpen`, `onClose`, `meeting`, `id`, `title`, `score`, `recommendation`, `durationMinutes` (+3 more)
- Key Styles: `rounded-md`, `border-slate-200`, `bg-slate-900/50`, `p-4`, `text-sm`, `font-semibold`, `backdrop-blur-sm`, `hover:text-slate-700`
- Animation: tw-transitions: transition-colors
- State: useState

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <LiquidGlassCard variant="neutral" className="relative w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden bg-white border-slate-200 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-white">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Slack Notice Drafter
              </h3>
```

**LiquidGlass** — `components/ui/liquid-glass.tsx`
- Variants: `neutral`, `danger`, `warning`, `success`
- Props: `children`, `variant`, `className`
- Key Styles: `rounded-lg`, `gap-1.5`, `text-xs`, `font-mono`
- Animation: tw-transitions: transition-colors, duration-150

```tsx
<div
      className={`relative rounded-lg border transition-colors duration-150 overflow-hidden ${variantStyles} ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
```

**Layout** — `app/layout.tsx`
- Key Styles: `bg-white`, `font-sans`

```tsx
<html lang="en">
      <body className="antialiased selection:bg-slate-200 selection:text-slate-900 bg-white text-slate-900 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
```

**Page** — `app/login/page.tsx`
- Key Styles: `rounded-md`, `border-slate-200`, `bg-white`, `px-4`, `text-lg`, `font-bold`, `shadow-sm`, `hover:bg-slate-800`
- Animation: tw-transitions: transition-colors
- State: useState

```tsx
<div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-slate-900 text-white mb-1">
            <Activity className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            MeetingDebt
          </h1>
          <p className="text-xs text-slate-500">
            Calendar analytics and recurring meeting audit.
```

*...and 4 more layout components.*

### Navigation (3)

**DashboardNav** — `components/dashboard-nav.tsx`
- Props: `onSyncTriggered`, `onOpenPricing`, `onOpenGuide`
- Key Styles: `rounded-md`, `border-slate-200`, `bg-white/95`, `mx-auto`, `text-sm`, `font-semibold`, `backdrop-blur`, `group-hover:text-slate-700`
- Animation: tw-animate-spin, tw-transitions: transition-colors, hover-transforms
- State: useState

```tsx
<header className="sticky top-0 z-40 w-full bg-white/95 border-b border-slate-200 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand & Workspace */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-slate-900 group-hover:text-slate-700">
                MeetingDebt
              </span>
```

**MeetingCard** — `components/meeting-card.tsx`
- Variants: `killed`
- Props: `meeting`, `hourlyRate`, `onOpenSlackDraft`, `onToggleStatus`, `meetingId`, `status`
- Key Styles: `rounded-md`, `border-slate-200`, `bg-slate-100`, `gap-4`, `text-sm`, `font-semibold`, `hover:text-blue-600`
- Animation: tw-transitions: transition-colors, hover-transforms
- State: useState

```tsx
<LiquidGlassCard
      variant={variant}
      interactive={!isKilled}
      className={`p-4 sm:p-5 ${isKilled ? 'opacity-50' : ''}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Main Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link 
              href={`/meetings/${meeting.id}`}
              className="font-semibold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors truncate flex items-center gap-1.5 group"
```

**Providers** — `components/providers.tsx`
- Props: `behavior`
- Key Styles: `border-slate-200`, `bg-white`, `mx-auto`, `text-xs`, `font-mono`, `hover:text-slate-900`
- Animation: tw-transitions: transition-colors
- State: useState



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32
- **Border radius:** 2px, 4px, 6px, 8px
- **Grid usage:** `grid-cols-1`, `grid-cols-2`
- **Container:** Tailwind `container` class with responsive padding

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Raised — cards, buttons, interactive elements

- `0 1px 3px 0 rgba(0,0,0,0.05)`



---

## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### CSS Animations

- `@keyframes animate-spin`

### Animated Components

- **DashboardNav**: tw-animate-spin, tw-transitions: transition-colors, hover-transforms
- **GuideModal**: tw-transitions: transition-colors
- **MeetingCard**: tw-transitions: transition-colors, hover-transforms
- **MeetingSimulator**: tw-transitions: transition-colors
- **PricingModal**: tw-transitions: transition-colors

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#1d4ed8` for interactive elements (buttons, links, focus rings)
- Use `#fafbfe` as the primary page background
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 2px, 4px, 6px, 8px
- Reuse existing components from Section 4 before creating new ones
- Use **Lucide** for all icons

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use gradients — the design uses solid colors only
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't mix icon libraries — consistency matters

### Anti-Patterns (detected from codebase)

- No gradient backgrounds
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 640px | tailwind |
| md | 768px | tailwind |
| lg | 1024px | tailwind |
| xl | 1280px | tailwind |
| 2xl | 1536px | tailwind |

**Approach:** Mobile-first using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
Always design for mobile first, then layer on responsive overrides.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #cbd5e1
Border: 1px solid var(--border)
Radius: 6px
Padding: 16px
Font: sans-serif
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #1d4ed8, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 6px
Hover: opacity 0.9 or lighter shade
Focus: ring with #1d4ed8
```

### Build a Page Layout

```
Background: #fafbfe
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #cbd5e1
Label: #64748b (muted, 12px, uppercase)
Value: #090a12 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #fafbfe
Input border: 1px solid var(--border)
Focus: border-color #1d4ed8
Label: #64748b 12px
Spacing: 16px between fields
Radius: 6px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: sans-serif, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
