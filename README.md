# Diarito UI Library 1.0.7

Static visual library for Diarito built with HTML, CSS, and native JavaScript.

## Access
Demo PIN: `DIARITO2026`

The PIN uses `sessionStorage` and is only a casual barrier for a static demo. It is not real authentication when published to a public repository.

## Pages
- `typography.html`: typography pairs, semantic classes, and hierarchy.
- `foundations.html`: brand roles, usage, states, and complete palette.
- `textures.html`: grid and notebook textures.
- `buttons.html`, `badges.html`, `alerts.html`, `cards.html`, `forms.html`.
- `navigation.html`: tabs and steppers.
- `breadcrumbs-pagination.html`, `tables.html`, `toasts.html`, `modals.html`, `states.html`.
- `rules.html`: master UI rules.
- `landing.html`: multilingual Diarito landing page preview with English, Spanish, and Korean translations handled in JavaScript.

## Typography
Roboto + Noto Sans KR are the operational UI pair. Englebert + Poor Story are the display pair. Google Fonts are loaded from the web.

## Color
Brand roles and semantic states are aliases of the base palette. Families use 100, 300, 500, and 700.

## 1.0.7
- Documentation UI translated to English.
- Sidebar footer removed.
- Collapsed sidebar shows `D` instead of the full Diarito wordmark.
- Login note removed.
- Added Landing Page as the final navigation item.
- Added EN / ES / KO landing translations powered by `assets/js/landing-i18n.js`.
- Landing image slots intentionally use empty `<img src="">` tags.
