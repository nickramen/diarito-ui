# Changelog

## 1.1.0 — UI component library refactor

### Added
- Modular design-system structure: tokens, base, components, patterns, utilities, and docs.
- Documented base components requested for the current Diarito UI phase.
- Diarito-specific note, preview, collection, visual-state, action-row, quick-action, and list/detail patterns.
- Compact sidebar, top bar, toolbar, card grid, detail panel, and responsive behavior patterns.
- Flaticon UIcons Regular Rounded as the documented icon family.
- `VERSION.txt` and versioned changelog.

### Changed
- Active brand palette is now limited to `#CFA8FF`, `#F1FF9C`, and `#7E9026`.
- Semantic red/yellow/green/blue colors are reserved for error/warning/success/info.
- `index.html` is now the navigable component library rather than a PIN/access screen.
- Documentation interactions use only a small native JavaScript file.

### Out of scope by design
- Authentication and login.
- Registration and user sessions.
- Backend and database work.
- Supabase.
- ASP.NET Core.
- React/Vite migration.
- Product business logic.