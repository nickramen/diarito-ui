# Diarito UI Library 1.1.1

Static UI component library for Diarito. This phase is intentionally limited to HTML, CSS, Flaticon UIcons, and a very small amount of native JavaScript used only by the documentation demo.

There is no authentication, login, registration, session handling, backend, database, Supabase, ASP.NET Core, or app business logic in this version.

## 1.1.1 refinement

- Softened the semantic states to a dusty red (`#AC5C60`), muted ochre (`#8F7135`), sage green (`#4F8064`), and calm blue (`#53769F`).
- Kept semantic colors separate from Purple, Lime, and Olive.
- Simplified status pills, alerts, tabs, cards, and button interaction so the system feels calmer and less corporate.
- Reorganized the visual documentation into clearer groups: Actions & input, Content & feedback, Navigation & layers, Layout, and Diarito patterns.
- Still plain HTML + CSS. Native JavaScript remains limited to small documentation interactions. **React is not used in this phase.**

## What 1.1.0 established

- Replaced the active brand palette with three temporary brand colors only:
  - `#CFA8FF` — Purple
  - `#F1FF9C` — Lime
  - `#7E9026` — Olive
- Kept semantic state colors separate: error/red, warning/yellow, success/green, info/blue.
- Reduced neutrals to white, near-black ink, and three gray roles.
- Organized CSS into tokens, base, components, patterns, utilities, and documentation styles.
- Rebuilt `index.html` as the navigable component library instead of a PIN/access screen.
- Added Diarito-specific patterns for note cards, note previews, collections, pin/lock states, action rows, quick actions, and note list/detail layouts.
- Standardized icons on Flaticon UIcons Regular Rounded.
- Added responsive shell patterns inspired by the structural discipline of Korespeng, without copying Korespeng features or its React stack.

## Project structure

```text
index.html
README.md
VERSION.txt
docs/
  CHANGELOG.md
assets/
  css/
    tokens.css
    base.css
    components.css
    patterns.css
    utilities.css
    docs-library.css
    diarito-system.css
  js/
    library-docs.js
```

### CSS responsibilities

- `tokens.css`: colors, typography, spacing, radii, borders, shadows, layout constants.
- `base.css`: reset/defaults, page/section foundations, typography and generic surfaces.
- `components.css`: buttons, fields, selects, checks/radios, switches, badges, alerts, cards, lists, tabs, accordion, dropdown, tooltip, modal, avatars, icon actions.
- `patterns.css`: compact sidebar, top bar, toolbar, grids, detail panel, notes and collection patterns, quick actions, responsive layout behavior.
- `utilities.css`: small layout/text/background helper classes.
- `docs-library.css`: styles only for the visual documentation page.
- `diarito-system.css`: canonical entry point that imports the reusable system styles. The legacy `diarito-components.css` from 1.0.7 can remain untouched during migration.

## Migration note for the existing GitHub repository

The current repository is 1.0.7 and contains individual legacy documentation pages plus a large `assets/css/diarito-components.css`. Version 1.1.x introduces the new system beside those files instead of overwriting them immediately. The canonical `index.html` loads only `diarito-system.css` and `docs-library.css`; legacy pages/styles can be retired after visual comparison. This avoids silently breaking existing reference pages while making the new palette and component set authoritative.

## Using tokens

Prefer semantic aliases before raw brand tokens when the intent is clear.

```css
.my-component {
  color: var(--diarito-color-text);
  border: var(--diarito-border);
  background: var(--diarito-color-surface);
  border-radius: var(--diarito-radius-md);
  padding: var(--diarito-space-4);
}
```

Brand color examples:

```css
var(--diarito-purple)
var(--diarito-lime)
var(--diarito-olive)
```

State color examples:

```css
var(--diarito-error)
var(--diarito-warning)
var(--diarito-success)
var(--diarito-info)
```

Do not create new decorative hex colors inside components. If a lighter surface is needed, derive it from an approved token with `color-mix()` or add a deliberate token in `tokens.css`.

## Common classes

### Buttons

```html
<button class="diarito-button diarito-button--primary">Primary</button>
<button class="diarito-button diarito-button--secondary">Secondary</button>
<button class="diarito-button diarito-button--ghost">Ghost</button>
<button class="diarito-button diarito-button--secondary diarito-button--icon" aria-label="More actions">
  <i class="fi fi-rr-menu-dots-vertical"></i>
</button>
```

### Forms

```html
<label class="diarito-field">
  <span class="diarito-label">Title</span>
  <input class="diarito-input" type="text">
  <span class="diarito-help">Helpful supporting text.</span>
</label>
```

Use `diarito-textarea`, `diarito-select`, `diarito-choice`, and `diarito-switch` for the related controls.

### Feedback

```html
<div class="diarito-alert diarito-alert--success">...</div>
<span class="diarito-status diarito-status--warning">Draft</span>
```

Available semantic modifiers: `--success`, `--warning`, `--error`, and `--info`.

### Cards and product patterns

```html
<article class="diarito-card">...</article>
<article class="diarito-note-card">...</article>
<div class="diarito-note-preview">...</div>
<div class="diarito-collection-item">...</div>
<div class="diarito-quick-actions">...</div>
```

## Iconography

The library uses Flaticon UIcons Regular Rounded:

```html
<link rel="stylesheet" href="https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css">
<i class="fi fi-rr-document"></i>
```

Avoid mixing icon families within the same interface unless the chosen Flaticon family lacks a required symbol.

## Responsive rule

Components are expected to work from approximately 320px upward. The base breakpoints currently focus on:

- small/mobile: up to `48rem`;
- medium/tablet: up to `64rem`;
- desktop: above those widths.

Do not design an entire desktop feature and treat mobile as a compression pass. Change the layout behavior when needed.

## Minimal JavaScript

`assets/js/library-docs.js` exists only for the documentation page:

- active section navigation;
- tabs;
- native `<dialog>` open/close behavior.

Dropdowns and accordions use native `<details>` elements. Tooltips are CSS-based.

## Consistency rules

1. Use the existing tokens before adding a new one.
2. Brand colors are Purple, Lime, and Olive. Status colors are not decorative colors.
3. Prefer borders and spacing before shadows.
4. Keep one control height and one focus treatment across forms.
5. Keep component modifiers explicit, for example `diarito-button--primary` or `diarito-status--success`.
6. Use product patterns only when they add Diarito meaning. Generic UI should remain generic.
7. Keep the component library free of authentication, backend, database, and business logic during this phase.