# Diarito UI Library 2.2.3

Diarito's reusable HTML, CSS and native JavaScript design system.

Version 2.2.3 refines header navigation, table filtering and note-card independence while keeping the HTML + CSS + native-JS architecture.





## 2.2.3 header, table filters and ruled-note refinement

- Restored the structural bottom border on the sticky top header/menu.
- Replaced inline toolbar selects with one Filter button before Export.
- Filter opens a modal containing status, role, native-language and learning-language filters.
- Table filter count is surfaced on the Filter action when filters are active.
- Note cards no longer stretch to the height of their sibling.
- Removed the forced note-body minimum height so each card sizes to its own content.
- Fixed ruled-note CSS specificity so horizontal notebook lines render only inside the ruled card body.
- Kept the ruled line rhythm synchronized with the body line-height.

## 2.2.2 note cards and advanced data table

- Note-card variants now render side by side on desktop and collapse to one column on mobile.
- Both note variants use the shared `diarito-card` header/body/footer contract.
- Only the ruled note body receives notebook lines; header and footer remain standard card surfaces.
- Ruled-note line spacing is synchronized with text line-height to keep copy aligned to the writing grid.
- Added a reusable advanced data-table shell with toolbar, search, filters, sticky headers, scrollable body and pagination.
- Added lightweight demo filtering for the table without introducing app/business logic.

## 2.2.1 visual QA refinement

- Removed the sticky-header compositing seam by using the page background directly and dropping the translucent backdrop blur.
- Matched the 16px and 12px radius samples to the same bordered surface style.
- Normalized label-to-control spacing by preventing stretched grid tracks in form fields.
- Made every alert dismissible and kept dismiss-button hover visually unchanged.
- Moved the Actions dropdown to the end of the overlay demo.
- Expanded the activity chart to fill its chart card instead of sitting at an intrinsic SVG width.
- Set mock-window body padding to `0 var(--diarito-space-5)`.
- Added two longer note-card examples: standard contained and ruled notebook.
- Removed the Quick actions pattern from the canonical library.

## 2.2.0 interaction and governance refinement

- Removed the stray sticky topbar/nav line and hid native scrollbars from horizontal tab/navigation rows.
- Simplified icon boxes to one canonical visual style with an optional large size.
- Alert titles and body copy now share the semantic state text role.
- Split tabs and accordion into separate component demos.
- Rebuilt accordion behavior with accessible buttons and smooth reduced-motion-aware transitions.
- Fixed dropdown/tooltip clipping with controlled overlay layers and opt-in card clipping.
- Pricing now uses the same compact elevation as the feed mock window.
- Rebuilt the feed as a scrollable, more realistic demo with a visible composer and temporary posting interaction.
- Added black, gray and semantic tag variants; note tags use the high-contrast dark variant.
- Reworked quick actions with useful supporting copy and a clear hover hierarchy.
- Restored and updated the full governance/rules system from the original Diarito library.
- Rebuilt the footer as three full-width bordered bands.

## 2.1.0 theme and shape refinement

- Light is the default theme and the body canvas is white.
- Dark is implemented through semantic theme tokens using `data-theme="dark"`.
- Theme selection is explicit; the library does not automatically follow the operating system and does not persist a theme preference.
- `DiaritoTheme.get()`, `.set()`, and `.toggle()` provide a tiny native-JS theme API.
- State base colors stay Tailwind 500; state label text uses Tailwind 700 in light theme and lighter contrast-safe tones in dark theme.
- Radius tokens are smaller across cards, controls and documentation surfaces.
- Small is now the default button size; explicit `--md` and `--lg` variants remain available.

### Theme contract

```html
<html data-theme="light">
<html data-theme="dark">
```

Components consume semantic roles such as `--diarito-color-surface`, `--diarito-color-text`, `--diarito-color-control`, and `--diarito-color-action-bg`. New themes should override those roles instead of rewriting component CSS.

## 2.0.1 refinement

- Every library section now shares one centered max-width and the same horizontal margins.
- The showcase is one vertical column instead of a bento grid.
- Lime and purple remain palette tokens but are not applied to library components.
- State colors use Tailwind 500 values: red `#EF4444`, yellow `#EAB308`, green `#22C55E`, blue `#3B82F6`.
- Buttons, badges, chips, statuses and alerts are borderless.
- Cards, tables, form controls and overlays keep borders when they provide real structure.
- Alerts no longer use a left border.

## 2.0.2 documentation refinement

- The documentation canvas now uses a soft gray page background with white bordered showcase cards.
- Topbar navigation is simplified; the sticky section strip is the single library navigation.
- Vertical rhythm is standardized between section intro, showcase cards, and following sections.
- Footer is rebuilt with brand/project links, social-channel examples, and a compact copyright row.
- Footer and library chrome remain neutral; brand colors stay documented but are not used decoratively.

## Visual direction

- White documentation canvas with white bordered content/showcase surfaces.
- Light gray large panels for grouping and feature areas.
- White nested UI surfaces.
- Black / near-black for primary actions and strongest hierarchy.
- Lime `#F1FF9C`, Purple `#CFA8FF`, and Olive `#7E9026` remain brand palette tokens, but the component library stays neutral and does not use them to style generic controls.
- Thin gray borders, sharper radius, restrained shadows.
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
diarito-button--md
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