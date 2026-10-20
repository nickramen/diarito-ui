# Changelog

## 2.1.0 - Light/dark themes, sharper shape and small default buttons

- Added semantic light and dark theme foundations using `data-theme`.
- Kept light as the explicit default with a pure white body canvas.
- Added a small native `DiaritoTheme` API without system-theme auto detection or persistence.
- Kept Tailwind 500 state bases and added Tailwind 700 state text colors in light mode.
- Added contrast-safe lighter state text roles for dark mode.
- Reduced radius tokens across the system.
- Made the small button size the default and added an explicit medium modifier.
- Updated component and documentation surfaces to consume semantic theme roles.

## 2.0.2 - Documentation canvas and footer refinement

- Changed the library page canvas to soft gray with white bordered showcase cards.
- Removed duplicate topbar section navigation and kept the sticky navigation strip as the single section navigator.
- Standardized section spacing and showcase padding.
- Rebuilt the footer with brand/project link groups, social-channel cards, and a compact copyright row.
- Kept footer and documentation chrome neutral with no theme toggle and no decorative brand colors.

## 2.0.1 - Single-column neutral refinement

- Unified topbar, hero, sticky navigation, sections and footer to one shared max-width.
- Changed the component showcase from bento-style columns to one centered scrolling column.
- Kept lime and purple as palette tokens only; removed their use from active library components.
- Switched semantic states to Tailwind 500: red `#EF4444`, yellow `#EAB308`, green `#22C55E`, blue `#3B82F6`.
- Removed borders from buttons, badges, chips, statuses and alerts.
- Removed the alert left-border treatment.
- Kept structural borders on cards, tables, form fields and overlays.


## 2.0.0 - Neutral-first visual reset

- Rebuilt the active UI component library from scratch while keeping the existing Diarito fonts.
- Shifted the interface to white, gray and black as the primary structural UI language.
- Kept Lime `#F1FF9C` as the main brand color and Purple `#CFA8FF` as a controlled accent.
- Added large light-gray feature surfaces with nested white UI to create a cleaner product-showcase rhythm.
- Reauthored buttons, fields, controls, labels, alerts, cards, lists, tabs, accordion, dropdown, tooltip, modal and empty state.
- Reauthored navigation, feed, note, collection, quick-action, stats, table and page-shell patterns.
- Rebuilt the canonical `index.html` component library as a long-form scrolling visual system instead of a sidebar-driven documentation view.
- Retained `diarito-section` / `diarito-container` composition and modular CSS architecture.
- Retained HTML + CSS + native JavaScript only. React remains out of scope.
- No authentication, backend, database, Supabase or ASP.NET Core added.