# Commit Message Conventions

Reference for writing consistent, meaningful commit messages.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type       | Description        | Example                                |
| ---------- | ------------------ | -------------------------------------- |
| `feat`     | New feature        | `feat(Button): add icon support`       |
| `fix`      | Bug fix            | `fix(Modal): prevent scroll when open` |
| `refactor` | Code restructuring | `refactor(theme): consolidate tokens`  |
| `docs`     | Documentation      | `docs(README): add installation guide` |
| `style`    | Formatting only    | `style: apply prettier formatting`     |
| `test`     | Test changes       | `test(Button): add unit tests`         |
| `chore`    | Maintenance        | `chore: update dependencies`           |
| `perf`     | Performance        | `perf(List): virtualize long lists`    |
| `build`    | Build system       | `build: update vite config`            |
| `ci`       | CI changes         | `ci: add github actions`               |

## Scope

The scope should identify what is being changed:

- **Component name:** `feat(Button):`, `fix(Modal):`
- **Category:** `feat(components):`, `fix(hooks):`
- **System:** `chore(deps):`, `build(vite):`
- **Omit if global:** `style: format all files`

## Subject Line Rules

1. **Max 72 characters** - Keeps it readable in git log
2. **Imperative mood** - "add" not "added" or "adds"
3. **No period at end** - It's a title, not a sentence
4. **Lowercase** - Start with lowercase letter
5. **Be specific** - "fix button hover" not "fix bug"

### Good Examples

```
feat(Input): add validation support
fix(Modal): prevent body scroll when open
refactor(theme): use CSS variables for colors
```

### Bad Examples

```
Fixed the bug                    # Vague, past tense
feat(Input): Added validation.   # Past tense, period
Update                           # No type, too vague
```

## Body Guidelines

The body explains **what** and **why**, not **how**.

**Structure:**

- List significant changes with bullet points
- Group related changes together
- Keep lines under 72 characters
- Leave blank line between subject and body

**Example:**

```
feat(Accordion): add keyboard navigation

- Added arrow key navigation between headers
- Added Home/End keys to jump to first/last
- Added Enter/Space to toggle panels
- Updated aria-expanded on state change

Implements WAI-ARIA Accordion pattern.
```

## Footer

**Co-Author (required for AI-assisted commits):**

```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Breaking changes:**

```
BREAKING CHANGE: removed `size` prop, use `variant` instead
```

**Issue references:**

```
Closes #123
Fixes #456
Refs #789
```

## Multi-Change Commits

When a commit includes multiple types of changes:

```
feat(components): add Modal with accessibility fixes

Added:
- Modal component with portal rendering
- Focus trap for keyboard navigation
- Backdrop with click-to-close

Fixed:
- Body scroll not locked when modal open
- Focus not returning to trigger on close

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Commit Frequency

### One Commit Per Logical Change

```
Good:
commit 1: feat(Button): add loading state
commit 2: fix(Button): fix disabled styling
commit 3: test(Button): add loading state tests

Bad:
commit 1: feat(Button): add loading state, fix disabled styling, add tests
```

### Batch Related Micro-Changes

```
Good:
commit 1: style: format all components

Bad:
commit 1: style: format Button
commit 2: style: format Input
commit 3: style: format Modal
... (20 more)
```

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│  feat     │  New feature                                    │
│  fix      │  Bug fix                                        │
│  refactor │  Code restructure (no behavior change)          │
│  docs     │  Documentation only                             │
│  style    │  Formatting (no code change)                    │
│  test     │  Test additions/changes                         │
│  chore    │  Maintenance, deps, tooling                     │
│  perf     │  Performance improvement                        │
├─────────────────────────────────────────────────────────────┤
│  SUBJECT: imperative, lowercase, no period, max 72 chars    │
│  BODY:    what & why, bullet points, blank line above       │
│  FOOTER:  Co-Author, BREAKING CHANGE, issue refs            │
└─────────────────────────────────────────────────────────────┘
```
