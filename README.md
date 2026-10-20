# Diarito UI Library 1.3.1

Diarito's reusable HTML, CSS and native JavaScript component system.

This phase deliberately does **not** use React. The goal is to lock the visual contract first so a future React implementation can map stable HTML/CSS components to reusable React components without visual drift.

## 1.3.1 brand-role refinement

- Lime `#F1FF9C` is now the **primary** brand and interaction color.
- Purple `#CFA8FF` is now the **accent** color.
- Olive `#7E9026` remains the stronger supporting tone.
- Generic components now prefer semantic role tokens instead of hard-coding raw brand colors.

## 1.3.0 feed-first direction

- The canonical library no longer uses a permanent documentation sidebar.
- Navigation is a small sticky top row and the entire library scrolls as one centered reading column.
- `patterns.css` now includes a reusable `diarito-feed` family for composer, feed items, actions, attachments, feed filters and collection previews.
- `index.html` starts with a fake Diarito feed so shared components can be evaluated in realistic product context.
- The visual rhythm is inspired by the simplicity of modern social reading feeds, while keeping Diarito's own tokens and product patterns.
- The 1.2.0 component contract remains unchanged: screens compose shared pieces and do not redefine them.

## Core rule

Screens compose the system; screens do not redefine it.

A screen may position a shared button inside a toolbar. It should not give that button a new height, radius, color, border or hover treatment. If a new visual variant is genuinely needed, it is added to the shared component library first.

## Structure

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
    layout.css
    components.css
    patterns.css
    utilities.css
    diarito-system.css
    docs-library.css
  js/
    diarito.js
    library-docs.js
```

## CSS layers

- `tokens.css` - brand, states, neutrals, typography, spacing, radius, border, shadows, motion and layout values.
- `base.css` - reset, typography defaults, focus, selection, display type and icon baseline.
- `layout.css` - `diarito-section`, `diarito-container`, grid, stack, cluster, split and surface primitives.
- `components.css` - buttons, fields, choices, switches, labels, alerts, empty states, cards, lists, tabs, accordion, dropdown, tooltip and modal.
- `patterns.css` - toolbar, topbar, sidebar item, detail panel and Diarito-specific note/collection patterns.
- `utilities.css` - intentionally small helper set.
- `diarito-system.css` - canonical import entrypoint.
- `docs-library.css` - documentation UI only. Never required by product screens.

## JavaScript

`assets/js/diarito.js` contains generic behavior only:

- dropdown open/close;
- tabs;
- native dialog modal open/close;
- dismissible feedback;
- Escape handling.

It contains no application state, auth, API calls, storage, backend or business logic.

## Layout contract

Use sections and containers consistently:

```html
<section class="diarito-section">
  <div class="diarito-container">
    ...
  </div>
</section>
```

Available section modifiers:

```text
diarito-section--compact
diarito-section--flush
diarito-section--muted
diarito-section--lime
diarito-section--purple
```

Available container modifiers:

```text
diarito-container--sm
diarito-container--md
diarito-container--xl
diarito-container--fluid
```

Composition primitives:

```text
diarito-grid
  --2 / --3 / --4 / --auto

diarito-stack
  --xs / --sm / --lg / --xl

diarito-cluster
  --sm / --between

diarito-split
```

## Component contract

Components use one base class and explicit modifiers.

```html
<button class="diarito-button diarito-button--primary">Primary</button>
<button class="diarito-button diarito-button--secondary">Secondary</button>
<button class="diarito-button diarito-button--ghost">Ghost</button>
<button class="diarito-button diarito-button--danger">Delete</button>
```

Sizes and shape are shared modifiers:

```text
diarito-button--sm
diarito-button--lg
diarito-button--icon
diarito-button--block
```

The same rule applies to status, alerts and other component families.

## Tokens

Brand roles:

- Primary: Lime `#F1FF9C`
- Accent: Purple `#CFA8FF`
- Strong support: Olive `#7E9026`

Semantic states:

- Error `#AC5C60`
- Warning `#8F7135`
- Success `#4F8064`
- Info `#53769F`

State colors are reserved for meaning, not decoration.

## Future React mapping

Do not migrate yet. When screens are visually approved, the mapping should be direct:

```text
.diarito-button        -> <Button />
.diarito-input         -> <Input />
.diarito-card          -> <Card />
.diarito-alert         -> <Alert />
.diarito-note-card     -> <NoteCard />
.diarito-collection-item -> <CollectionItem />
```

React should implement the already-approved component contract rather than invent a second visual system.