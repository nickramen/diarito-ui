# Diarito UI Library 2.0.0

Diarito's reusable HTML, CSS and native JavaScript design system.

Version 2.0.0 is a full visual reset. It keeps the existing Diarito fonts and the reusable architecture, but rebuilds the component styling from scratch around a quieter neutral-first interface.

## Visual direction

- White page canvas.
- Light gray large panels for grouping and feature areas.
- White nested UI surfaces.
- Black / near-black for primary actions and strongest hierarchy.
- Lime `#F1FF9C` as the main Diarito brand color.
- Purple `#CFA8FF` as a controlled accent color.
- Olive `#7E9026` as strong supporting brand tone when needed.
- Thin gray borders, generous radius, restrained shadows.
- Semantic red / yellow / green / blue reserved for state communication only.

The reference screenshots were used as visual inspiration for spacing, neutral hierarchy, large rounded feature panels and nested white UI, not as a pixel-for-pixel copy of another product.

## Kept from previous Diarito versions

- Roboto + Noto Sans KR for UI/body.
- Englebert + Poor Story for display accents.
- Flaticon UIcons Regular Rounded.
- HTML + CSS first.
- Small framework-free JavaScript for generic component interactions only.
- `section` / `container` page composition.
- token -> base -> layout -> components -> patterns -> utilities architecture.

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

## Canonical stylesheet

Product screens should load:

```html
<link rel="stylesheet" href="assets/css/diarito-system.css">
```

`docs-library.css` is only for the component-library showcase.

## Layout contract

Use sections and containers consistently:

```html
<section class="diarito-section">
  <div class="diarito-container">
    ...
  </div>
</section>
```

Useful variants:

```text
diarito-section--compact
diarito-section--flush
diarito-section--soft
diarito-section--dark
diarito-section--lime
diarito-section--purple

diarito-container--sm
diarito-container--md
diarito-container--xl
diarito-container--fluid
```

Composition primitives:

```text
diarito-grid --2 / --3 / --4 / --auto
diarito-stack --xs / --sm / --lg / --xl
diarito-cluster --sm / --between
diarito-split
diarito-reading
diarito-feature-grid
```

## Component rule

Screens compose the shared system. Screens do not redefine it.

If a shared component already exists, do not recreate its radius, color, height, border or hover behavior in a page stylesheet. Add a deliberate variant to the component library instead.

### Buttons

```html
<button class="diarito-button diarito-button--primary">Primary</button>
<button class="diarito-button diarito-button--brand">Brand</button>
<button class="diarito-button diarito-button--secondary">Secondary</button>
<button class="diarito-button diarito-button--ghost">Ghost</button>
<button class="diarito-button diarito-button--accent">Accent</button>
<button class="diarito-button diarito-button--danger">Danger</button>
```

Size / shape modifiers:

```text
diarito-button--sm
diarito-button--lg
diarito-button--icon
diarito-button--block
```

## Generic JavaScript

`assets/js/diarito.js` only handles reusable interface behavior:

- dropdown open/close;
- tabs;
- native `<dialog>` modal open/close;
- dismissible feedback;
- Escape handling.

It contains no authentication, localStorage, API calls, app data, backend or product business logic.

## Future React mapping

React remains out of scope for this phase. Once real screens are visually approved, the mapping should be direct:

```text
.diarito-button          -> <Button />
.diarito-input           -> <Input />
.diarito-card            -> <Card />
.diarito-alert           -> <Alert />
.diarito-feed-item       -> <FeedItem />
.diarito-note-card       -> <NoteCard />
.diarito-collection-item -> <CollectionItem />
```

React should implement this approved component contract rather than invent a second visual system.