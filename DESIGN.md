# HRR for Practice · Live Ranking Design

## 1. Visual Theme & Atmosphere
Dark, high-contrast competition dashboard with a calm navy base, cyan navigation, lime scores, and a subtle moving star field. The interface should feel live, credible, and fast.

## 2. Color Palette & Roles
```css
:root{--bg:#07111f;--panel:#0d1c30;--line:#213b59;--text:#edf6ff;--muted:#91a9c3;--cyan:#55e7ff;--lime:#b7ff68;--pink:#ff6fae;--gold:#ffd166}
```
Use cyan for navigation and links, lime for scores and success, gold for highlighted ranks, pink for downward movement, and muted blue for secondary information.

## 3. Typography Rules
Use the system sans stack: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif`. Headlines are tight and heavy; supporting text stays at 12–16px with generous contrast.

## 4. Component Stylings
Buttons and tabs use navy surfaces, 1px blue borders, 10–14px radii, hover border brightening, active cyan text, and visible keyboard focus. Cards use the same surface, border, radius, and shadow language. Company rows are clickable and keyboard accessible.

## 5. Layout Principles
Use a centered max-width shell. Desktop uses a leaderboard plus a sticky legend; the top controls separate mode tabs from university filters; live stats sit between the hero and controls. Mobile collapses to one column, horizontally scrolls filter groups, and keeps touch targets at least 40px.

## 6. Depth & Elevation
Use one restrained layered shadow for boards and modals. Avoid large blur regions. Background stars remain pointer-transparent so content interaction stays reliable. Company rows use proportional bars to communicate scale without adding a chart library.

## 7. Animation & Interaction
L2 interaction: leaderboard rows use FLIP-style movement when ranking changes; rows fade upward on entry; points briefly bump on changes; star field moves continuously and avoids the pointer. `prefers-reduced-motion` should disable nonessential animation when expanded.

## 8. Do's and Don'ts
- Do keep rankings readable before decorative effects.
- Do show sources for company facts.
- Do preserve the live-update message.
- Do keep filters at the top of the page.
- Do expose keyboard focus for clickable rows.
- Don't invent a founding year.
- Don't add registration or data collection.
- Don't hide the ranking behind a complex menu.

## 9. Responsive Behavior
At 750px and below, the toolbar becomes a horizontal scroller, company rows switch to rank/name/count, the legend moves below the ranking, and the modal fits the viewport with 20px padding.
