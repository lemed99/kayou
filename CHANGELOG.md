# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **commit-and-push skill** - Smart commit workflow with changelog updates
- **Component documentation pages** - Added docs for Accordion, Button, TextInput, NumberInput, MultiSelect, SelectWithSearch
- **NumberInput `onValueChange` prop** - Returns typed `number | null` instead of string
- **NumberInput `debounceDelay` prop** - Configurable delay before processing input
- **TextInput unique IDs** - Auto-generated IDs for label/input association
- **SelectWithSearch combobox ARIA** - Full WAI-ARIA combobox pattern support
- **Audit system** - Component audit tracker and reports in `.claude/audits/`

### Changed

- **TextInput** - Added `aria-invalid`, `aria-busy`, `aria-describedby` for accessibility
- **NumberInput** - Fixed unsafe type assertions, added safe min/max accessors
- **SelectWithSearch** - Options now have `role="option"` and `aria-selected`
- **MultiSelect** - Improved ARIA support with listbox pattern
- **useSelect hook** - Added default for `noSearchResultPlaceholder`
- **Accordion** - Improved keyboard navigation and ARIA attributes

### Fixed

- TextInput label now properly associated with input via `for`/`id`
- TextInput shows `aria-invalid="true"` when `color="failure"`
- NumberInput clamps values correctly with typed accessors
- SelectWithSearch uses consistent prop access pattern
- Arrow buttons in TextInput have proper `aria-label` attributes
