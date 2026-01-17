# Changelog Entry Templates

Templates for adding entries to CHANGELOG.md.

## New Changelog File

When CHANGELOG.md doesn't exist, create with this template:

```markdown
# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed
```

## Entry Categories

Use these categories in order:

| Category     | Description         | Example                     |
| ------------ | ------------------- | --------------------------- |
| `Added`      | New features        | New component, new prop     |
| `Changed`    | Changes to existing | API change, behavior change |
| `Deprecated` | Soon to be removed  | Deprecated prop warning     |
| `Removed`    | Removed features    | Deleted component           |
| `Fixed`      | Bug fixes           | Fixed click handler         |
| `Security`   | Security fixes      | Fixed XSS vulnerability     |

## Entry Format

Each entry should be:

- A single line (or wrapped if long)
- Start with capital letter
- Describe the change from user perspective
- Reference component/feature name

### Good Entries

```markdown
### Added

- Button component with primary, secondary, and outline variants
- Modal component with focus trap and keyboard navigation
- `loading` prop to Button for async actions

### Changed

- Input validation now shows inline error messages
- Theme colors updated to improve contrast ratios

### Fixed

- Accordion panels now properly announce state to screen readers
- Modal backdrop click correctly closes on mobile devices

### Removed

- Deprecated `size` prop from Button (use `variant` instead)
```

### Bad Entries

```markdown
### Added

- button # Too vague
- Added the new modal thing # Starts with "Added"
- src/components/Modal.tsx # File path, not description
```

## Version Release Entry

When releasing a new version:

```markdown
## [1.2.0] - 2025-01-13

### Added

- Button loading state with spinner indicator
- Modal component with focus trap

### Fixed

- Input placeholder color in dark mode

## [1.1.0] - 2025-01-01

...
```

## Unreleased Section

Always add new changes to `[Unreleased]` section:

```markdown
## [Unreleased]

### Added

- New entry goes here

### Fixed

- Another entry

## [1.1.0] - 2025-01-01

...
```

## Mapping Commit Types to Categories

| Commit Type       | Changelog Category               |
| ----------------- | -------------------------------- |
| `feat`            | Added                            |
| `fix`             | Fixed                            |
| `refactor`        | Changed (if user-facing) or omit |
| `docs`            | Usually omit (unless user docs)  |
| `style`           | Usually omit                     |
| `test`            | Usually omit                     |
| `chore`           | Usually omit                     |
| `perf`            | Changed                          |
| `BREAKING CHANGE` | Changed (note breaking)          |

## Component Entry Examples

### New Component

```markdown
### Added

- Accordion component with single/multiple expand modes
- Tooltip component with hover and focus triggers
- DatePicker component with keyboard navigation
```

### Component Enhancement

```markdown
### Added

- `loading` prop to Button component
- `error` and `success` validation states to Input
- Keyboard shortcuts to Modal (Escape to close)
```

### Bug Fix

```markdown
### Fixed

- Button hover state not visible in high contrast mode
- Modal focus not returning to trigger element on close
- Accordion animation stuttering on rapid clicks
```

### Breaking Change

```markdown
### Changed

- **BREAKING**: Button `size` prop renamed to `scale` for consistency
- **BREAKING**: Modal `onClose` now receives event object as parameter
```

## Automation Notes

When automatically generating entries:

1. Extract meaningful description from commit message
2. Map commit type to appropriate category
3. Remove implementation details (keep user-facing)
4. Consolidate related changes into single entry
5. Skip entries for internal-only changes

### From Commit to Entry

**Commit:**

```
feat(Button): add loading state with spinner

- Added loading prop that shows spinner
- Added disabled state while loading
- Added LoadingButton variant type
```

**Entry:**

```markdown
### Added

- Button loading state with spinner indicator
```
