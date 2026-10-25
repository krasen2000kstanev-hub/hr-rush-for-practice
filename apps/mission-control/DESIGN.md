# DESIGN.md

> Mission Control for HR:Rush — ясна система за задачи, прогрес и отборна конкуренция.

## 1. Visual Theme & Atmosphere

**Style**: Mission Control / Warm Professional
**Keywords**: energetic, structured, optimistic, competitive, human, scannable, campus-ready
**Tone**: уверен и приятелски — NOT childish, noisy, or gamer-heavy
**Feel**: табло за състезание, което ти показва точно коя е следващата крачка.

**Interaction Tier**: L2 — плавен dashboard
**Dependencies**: CSS + IntersectionObserver; без GSAP/3D в първата версия

### Login Gate

Входът е част от Mission Control, не отделен generic auth екран: лявата страна обяснява личните мисии, отборния прогрес и историята на точките, а дясната съдържа компактна Google OAuth card. Използва се същият светъл фон, виолетов action цвят и мрежовият background от платформата. На мобилни устройства layout-ът става една колона.

## 2. Color Palette & Roles

```css
:root {
  --bg: #F6F7FB;
  --surface: #FFFFFF;
  --surface-alt: #EEF0FF;
  --surface-hover: #F4F2FF;
  --border: #E4E7F0;
  --border-hover: #C7C3FF;
  --text: #182033;
  --text-secondary: #667085;
  --text-tertiary: #98A2B3;
  --accent: #6257E8;
  --accent-hover: #5146D4;
  --orange: #FF8A3D;
  --success: #25A875;
  --error: #D92D20;
  --warning: #F2B84B;
  --bg-rgb: 246,247,251;
  --accent-rgb: 98,87,232;
}
```

**Color Rules:** use semantic variables only; violet marks action/progress; orange marks urgency or high-value missions; status colors are never the only status signal.

## 3. Typography Rules

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Page title | Space Grotesk | 28px | 700 | 1.15 | -0.03em |
| Section title | Space Grotesk | 18px | 700 | 1.25 | -0.02em |
| Card title | DM Sans | 15px | 700 | 1.35 | — |
| Body | DM Sans | 14px | 400 | 1.55 | — |
| Label | DM Sans | 11px | 700 | 1.2 | 0.08em |
| Numbers | Space Grotesk | 28px | 700 | 1 | -0.04em |

Use Bulgarian-friendly system fallbacks after the Google fonts. No gradient text or text shadows; the product UI should stay readable.

## 4. Component Stylings

Buttons use violet fill, 10px radius, 44px minimum touch height, hover darkening, active scale 0.98, visible focus ring, and disabled opacity.

Cards use white surface, 16px radius, 1px border, subtle shadow only for primary cards, hover border highlight, and no large lift that breaks dense scanning.

Navigation uses a 240px desktop sidebar and a compact bottom bar on mobile. Active navigation uses a pale violet background and violet icon/text.

Mission badges communicate category, points, deadline, and status. Every status includes text, not color alone.

## 5. Layout Principles

**Container:** max-width 1440px; content padding 28px desktop / 16px mobile.

**Spacing Scale:** 4, 8, 12, 16, 20, 24, 32, 48px. Cards use 20px internal padding.

**Grid:** KPI row 4 columns; mission list 3 columns desktop, 2 tablet, 1 mobile; team panel uses 2 columns desktop.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | surface + border | dense mission cards |
| Subtle | `0 8px 24px rgba(24,32,51,.06)` | dashboard hero and modal |
| Focus | `0 0 0 3px rgba(var(--accent-rgb),.16)` | focus/selected state |

## 7. Animation & Interaction

**Motion Philosophy**: short, useful feedback; never delay access to data.

Entrance uses fade-up with 60ms stagger. Mission progress bars animate once when visible. Cards use border and background transitions. The sidebar does not move on scroll.

```css
.reveal { opacity: 0; transform: translateY(12px); transition: opacity .5s ease, transform .5s ease; }
.reveal.in-view { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

## 8. Do's and Don'ts

### Do

- Keep the next action visible above the fold.
- Show points, deadline, and status on every mission card.
- Use real mission wording from the source table, shortened only in previews.
- Make team contribution visible beside team total.
- Keep review feedback attached to the submission.
- Use keyboard-visible focus and 44px touch targets.

### Don't

- ❌ Do not use a gaming HUD, neon overload, or fake 3D dashboard.
- ❌ Do not hide mission status behind color only.
- ❌ Do not put all missions in an undifferentiated wall of cards.
- ❌ Do not make users open a modal just to see points or deadlines.
- ❌ Do not use emoji as primary interface icons.
- ❌ Do not animate every number continuously.
- ❌ Do not add chat before the review workflow is stable.
- ❌ Do not let long mission descriptions dominate the dashboard.

## 9. Responsive Behavior

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1100px | sidebar + 3-column missions + team rail |
| Tablet | 700–1099px | 2-column missions, compact sidebar |
| Mobile | < 699px | bottom nav, 1-column missions, stacked KPIs |

Touch targets are minimum 44px. Desktop sidebar collapses into a bottom navigation on mobile; filters become horizontally scrollable pills; team members become stacked rows.
