# Changelog

## 2.4.0 - Diarito product-language layer

- Added Entry / post composer.
- Added Diary entry / post card.
- Added shared post action bar.
- Added Comment + reply thread.
- Added Visibility selector.
- Added Mood / check-in selector.
- Added Attachment preview / media group.
- Added Entry metadata row.
- Added Day / date divider.
- Added Daily writing prompt card.
- Added Draft / autosave indicator.
- Added Notification item.
- Added Member mini profile.
- Added Language practice block.
- Added Writing streak / calendar heatmap.
- Unified entry-action styling with the existing feed-action contract.
- Added generic pressed/toggle behavior for reusable product actions.
- Extended governance rules for Diarito-specific product composition.

## 2.3.0 - Application-ready component layer

- Added toast/snackbar notifications.
- Added skeleton loaders and spinner.
- Added progress bars.
- Added breadcrumbs.
- Added standalone pagination.
- Added button groups.
- Added input groups.
- Added combobox/autocomplete.
- Added file upload/dropzone.
- Added drawer/offcanvas.
- Added popover.
- Added confirmation dialog.
- Added segmented control.
- Added activity/timeline pattern.
- Added advanced table states and bulk row selection.
- Added reusable native-JavaScript behavior for the interactive components above.
- Extended governance rules for navigation, forms, overlays, feedback and data-table states.

## 2.2.5 - Page shell, row actions and ruled-note refinement

- Removed double horizontal padding from the Page shell demo.
- Prevented a notebook rule from appearing above the first line of ruled-note text.
- Added working dropdown menus to all data-table row ellipsis actions.
- Added reusable portaled dropdown positioning for menus inside overflow containers.
- Renamed the table CTA from Add member to Add.
- Added a top border to the sticky navstrip.
- Increased the hero grid to 20px x 20px.

## 2.2.4 - Responsive containers, hero grid and table refinement

- Added a 10px x 10px neutral grid background to the hero only.
- Reworked the shared container contract to use horizontal padding and a larger responsive gutter.
- Unified documentation topbar, hero, nav, sections and footer bands on the shared container contract.
- Added compact theme-aware page scrollbars.
- Removed internal vertical scrolling from the data table and kept horizontal overflow only.
- Expanded the data-table demo to 10 records.
- Compacted the Filter count tag.
- Switched pagination arrows to double-angle icons.
- Fixed the oversized mobile toolbar gap.

## 2.2.3 - Header, table filters and ruled-note refinement

- Restored the bottom border on the sticky top header.
- Replaced inline data-table filters with a Filter modal.
- Added status, role, native-language and learning-language filter controls.
- Added active-filter count feedback to the table toolbar.
- Decoupled note-card heights so each card sizes independently.
- Removed the forced note-body minimum height.
- Fixed ruled-note selector specificity so horizontal lines render inside the body only.

## 2.2.2 - Note cards and advanced data table

- Reworked note cards into a shared card header/body/footer structure.
- Displayed both note variants in one desktop row with responsive single-column fallback.
- Limited notebook ruling to the ruled note body and synchronized rule spacing with line-height.
- Added a reusable scrollable data table with toolbar, search, filters, sticky headers and pagination.
- Added lightweight interactive filtering to the table demo.

## 2.2.1 - Visual QA refinement

- Removed the sticky topbar compositing seam by using a solid page-background surface.
- Unified the radius demos so 16px and 12px samples share the same visual treatment.
- Normalized form label/control spacing.
- Made all alert examples dismissible with neutral hover behavior.
- Moved Actions to the end of the overlay demo.
- Made the activity chart fill its chart card.
- Changed mock-window body padding to `0 var(--diarito-space-5)`.
- Added standard and ruled long-form note card patterns.
- Removed Quick actions from the canonical component library.

## 2.2.0 - Interaction, feed and governance refinement

- Removed sticky navigation artifacts and hid tab/nav scrollbars without removing scroll behavior.
- Simplified icon boxes to one canonical style plus a large variant.
- Extended semantic alert text coloring.
- Split tabs and accordion demos and added smooth accessible accordion behavior.
- Fixed dropdown/tooltip overlay clipping and added a shared z-index scale.
- Matched pricing elevation to the feed mock-window elevation and tightened shadow tokens.
- Rebuilt the feed as a scrollable interactive demo with more realistic content.
- Added dark, gray and semantic tag variants.
- Improved quick-action hierarchy and hover behavior.
- Restored and modernized the original Diarito governance rules.
- Rebuilt the footer into three full-width bordered bands.

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