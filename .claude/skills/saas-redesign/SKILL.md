---
name: saas-redesign
description: Guidelines for redesigning this Vue 3 app's UI into a modern SaaS-style interface with a vertical left sidebar (replacing the top nav), consistent spacing, and a polished professional look. Use this skill when the user asks to redesign, modernize, or improve the visual layout of the app — especially when converting the top navigation to a side navigation.
---

# SaaS-Style Redesign Guidelines

This skill governs UI redesign work in the Factory Inventory Management System. The goal is a clean, modern SaaS interface — vertical left sidebar, consistent spacing, polished surfaces — while staying inside the existing slate/blue design language already in use.

## Hard Rules

1. **Delegate every `.vue` file change to the `vue-expert` subagent.** This matches the project rule in `CLAUDE.md`. Do not edit `.vue` files inline.
2. **Reuse the existing design tokens** (see "Design Tokens" below). Do not introduce a new color palette, font, or radius scale.
3. **No emojis in the UI.** Use text labels or inline SVG icons only.
4. **Composition API only.** Match the project's existing style (`setup()`, `ref`, `computed`).
5. **Preserve existing routes and feature behavior.** This is a visual/layout change, not a feature change. All current views (Dashboard, Inventory, Orders, Demand, Spending, Reports) must keep working with the same composables (`useFilters`, `useAuth`, `useI18n`) and the same API client.

## Design Tokens (reuse, do not invent)

These come from `client/src/App.vue` and are already used throughout the app.

**Colors**
- Background: `#f8fafc` (page), `#ffffff` (surface)
- Borders: `#e2e8f0` (default), `#cbd5e1` (strong/hover)
- Text: `#0f172a` (primary), `#1e293b` (body), `#475569` (subtle), `#64748b` (muted)
- Accent: `#2563eb` with soft background `#eff6ff`
- Status: green `#059669` / `#d1fae5`, amber `#ea580c` / `#fed7aa`, red `#dc2626` / `#fecaca`, info `#2563eb` / `#dbeafe`

**Typography**
- Family: `Inter`, then system fallbacks (already declared in `App.vue`)
- Page title: `1.875rem / 700`, letter-spacing `-0.025em`
- Card title: `1.125rem / 700`
- Body: `0.875rem – 0.938rem / 400–500`
- Uppercase labels: `0.75rem / 600`, letter-spacing `0.05em`

**Spacing scale** — stick to these increments
- `0.25rem · 0.375rem · 0.5rem · 0.625rem · 0.75rem · 1rem · 1.25rem · 1.5rem · 2rem`

**Radii**
- 6px (badges, nav links), 8px (inputs/buttons), 10px (cards, surfaces)

**Shadows**
- Default: `0 1px 3px 0 rgba(0,0,0,0.05)`
- Hover: `0 4px 12px rgba(0,0,0,0.06)`

If you ever need a value outside this list, pause and ask the user before introducing it.

## Sidebar Pattern (the main change)

Replace the top nav in `App.vue` with a fixed left sidebar.

**Layout**
- Sidebar is a vertical column on the left, `240px` wide on desktop, full-height (`100vh`), `position: sticky; top: 0` (or fixed) so it stays in view while the main content scrolls.
- Main content sits to the right, with `padding: 1.5rem 2rem` (matches the current `.main-content` rhythm). No more `max-width: 1600px` centering on the body — let the main column flex inside the remaining width, capped at a reasonable reading width (~1400px) if the screen is huge.
- The page layout becomes a two-column CSS Grid (or flex): `grid-template-columns: 240px 1fr;`.

**Sidebar internal structure (top to bottom)**
1. **Brand block** — company name + subtitle, separated from nav by a `1px` `#e2e8f0` divider. Use the existing `t('nav.companyName')` / `t('nav.subtitle')` i18n keys.
2. **Primary nav** — vertical stack of `<router-link>` items, each `0.625rem 1rem` padding, `6px` radius, full-width.
   - Default: color `#64748b`, no background.
   - Hover: color `#0f172a`, background `#f1f5f9`.
   - Active: color `#2563eb`, background `#eff6ff`, plus a `2px` left bar in `#2563eb` (replaces the old `::after` bottom underline).
3. **Optional section dividers** — small uppercase label (`0.6875rem / 600`, color `#64748b`, letter-spacing `0.08em`) above grouped links, e.g. "Operations" vs "Finance". Only add groups if there are 5+ items.
4. **Bottom-pinned utility row** — push to the bottom with `margin-top: auto`. Contains the `LanguageSwitcher` and `ProfileMenu` (existing components — do not rewrite them; just reposition).

**Filter bar** — keep `FilterBar.vue`, but move it to the top of the main content column (above page content, below an optional page header), not above the sidebar. It should span only the main column width.

**Responsive**
- Below `768px`, collapse the sidebar to an icon rail (`64px` wide) or hide behind a hamburger toggle. Pick one approach and apply it consistently — do not mix.
- The sidebar must never push the main content off-screen on small viewports.

## Spacing Consistency Checklist

Before reporting a redesign task complete, verify:

- [ ] All page wrappers use the same horizontal padding (`2rem` desktop, `1.25rem` mobile).
- [ ] Card padding is uniform: `1.25rem` for content cards, `0.75rem 1rem` for table cells.
- [ ] Stat cards in `.stats-grid` use `gap: 1.25rem` and `minmax(280px, 1fr)`.
- [ ] Vertical rhythm between sections is `1.5rem` (between cards) or `2rem` (between major sections). No mixed `1rem`/`1.25rem`/`1.5rem` arbitrarily.
- [ ] Page headers (`.page-header`) have `margin-bottom: 1.5rem` and an `h2` + muted `p`.
- [ ] No view-specific overrides duplicate global styles already in `App.vue`.

## Polished Look Checklist

- [ ] Sidebar has a `1px` right border in `#e2e8f0` (no shadow) — this anchors it visually without competing with content shadows.
- [ ] Buttons and inputs share radii (`8px`) and a consistent focus ring (use `outline: 2px solid #2563eb` with `outline-offset: 2px`, do not invent a new color).
- [ ] Hover states are present on every interactive element: links, table rows, cards, buttons. Use `transition: all 0.15s ease` or `0.2s ease` — match the existing values in `App.vue`.
- [ ] Tables: keep `thead` background `#f8fafc`, body row hover `#f8fafc`, divider `#f1f5f9`. Do not re-style tables per view.
- [ ] Badges use the existing `.badge.{success,warning,danger,info}` classes — extend, don't duplicate.
- [ ] Empty states (no data, no results) have a centered message in `#64748b`, `0.938rem`, with `padding: 3rem`. Same as the existing `.loading` style.

## Files Likely to Change

In order of probability:

1. **`client/src/App.vue`** — biggest change. Convert top nav into sidebar, restructure `.app` to a 2-column grid, move global styles if needed.
2. **`client/src/components/FilterBar.vue`** — reposition (does not need a rewrite if its internal styles already match the tokens).
3. **Each view in `client/src/views/`** — verify page headers, padding, and card spacing align with the checklist. Most views should need minimal change.
4. **`client/src/components/ProfileMenu.vue` / `LanguageSwitcher.vue`** — only if their current styling assumed a horizontal top-nav context (e.g. dropdown alignment).

Do **not** change:
- `client/src/api.js`
- `client/src/composables/*`
- `client/src/locales/*` (unless adding new nav labels — then add keys in all locales)
- `server/**`
- The router definition in `main.js` (routes stay the same)

## Process

1. **Read first.** Before delegating, read `client/src/App.vue` and the target component so the delegation prompt is concrete (file paths, line ranges, what to preserve).
2. **Delegate to `vue-expert`** with a prompt that includes:
   - The exact files to edit and the exact behavior to preserve.
   - The relevant section of this skill (sidebar pattern + tokens).
   - A note that all existing routes, composables, and i18n keys must keep working.
3. **Verify in the browser.** After the agent reports done, open `http://localhost:3000` and walk through each route. Check:
   - All nav links work and show the active state in the sidebar.
   - The filter bar still applies filters across pages.
   - No layout regressions at `1280px`, `1024px`, and `375px` widths.
   - Hover/active/focus states are visible on the sidebar.
4. **Report what changed.** Two sentences max. List the files touched and any tokens you intentionally added (with the user's approval).

## What "Done" Looks Like

- Top nav is gone; left sidebar is present on every route.
- Active route is unambiguous (color + left bar).
- Spacing rhythm in the main column is uniform across views.
- No new colors, fonts, radii, or shadows have been introduced.
- The app still passes the existing tests (`cd tests && uv run pytest backend/`) and the frontend still builds (`cd client && npm run build`).

## Anti-Patterns to Avoid

- ❌ Rewriting working components just to "modernize" them. Reposition first, restyle only where the checklist demands it.
- ❌ Adding a UI library (Tailwind, Vuetify, shadcn) — the design system is plain CSS in `App.vue` and stays that way unless the user explicitly asks for a library.
- ❌ Introducing dark mode in the same pass. If the user wants it, do it as a follow-up.
- ❌ Inline styles in templates for layout. Layout belongs in the component's `<style>` block or in `App.vue` globals.
- ❌ Editing `.vue` files yourself instead of delegating to `vue-expert`.
