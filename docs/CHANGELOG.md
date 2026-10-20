# Changelog

## 1.3.1 - Lime primary, purple accent

- Lime is now the primary brand and interaction color.
- Purple is now the accent color.
- Olive remains the stronger supporting tone.
- Primary buttons use lime with olive support; secondary buttons use purple accents.
- Shared components reference semantic brand-role tokens where possible.
- No React, backend, authentication, or product logic added.

## 1.3.0 - Feed-first library and fake product feed

- Removed the permanent documentation sidebar from the canonical library view.
- Added a centered sticky top navigation and single-column scrolling documentation rhythm.
- Added reusable `diarito-feed`, composer, feed item, action, attachment, and feed avatar patterns.
- Added a fake Diarito feed using the real design-system tokens and components.
- Reduced documentation chrome so component examples feel closer to the future product UI.
- Kept the 1.2.0 reusable component contract and token architecture intact.
- No React, authentication, backend, database, or business logic added.

## 1.2.0 - Component contract and layout foundation

- Reframed the library as Diarito's internal Bootstrap-like component system.
- Added a dedicated `layout.css` layer.
- Standardized `diarito-section` and `diarito-container` primitives with variants.
- Added grid, stack, cluster and split composition primitives.
- Clarified the rule that screens may compose shared components but must not restyle their visual internals.
- Standardized button variants, sizes and destructive action styling.
- Added form error state.
- Added generic dropdown behavior and dismissible feedback to `diarito.js`.
- Kept tabs and modal behavior generic and framework-free.
- Rebuilt the visual library page around the actual reusable system instead of documentation-only styling experiments.
- Added version query strings to CSS/JS links to avoid stale browser cache during rapid local iteration.
- React remains out of scope.

## 1.1.1 - State palette + component cleanup

- Softer semantic state palette: error `#AC5C60`, warning `#8F7135`, success `#4F8064`, info `#53769F`.
- Quieter status pills, alerts, tabs, cards and button interaction.
- Documentation reorganized into clearer functional groups.

## 1.1.0 - Base design system

- Brand palette changed to `#CFA8FF`, `#F1FF9C`, and `#7E9026`.
- Added modular tokens, base, components, patterns and utilities.
- Added Diarito-specific note and collection patterns.