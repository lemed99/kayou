# Commit Message Templates

Use these templates for fix commits. Format: conventional commits.

## Type Safety Fixes

```
fix(ComponentName): add TypeScript types

- Added props interface with full type definitions
- Typed all event handlers
- Added return type annotation
- Removed any types

Closes #XXX
```

```
fix(ComponentName): improve type safety

- Replaced any with specific types
- Added generic type parameters
- Fixed event handler signatures
```

## SolidJS Fixes

```
fix(ComponentName): fix props reactivity

BREAKING CHANGE: Props are no longer destructured

- Changed from destructured to props object access
- Ensures reactivity when props change

Closes #XXX
```

```
fix(ComponentName): add missing effect cleanup

- Added onCleanup for event listeners
- Prevents memory leaks on unmount
```

```
fix(ComponentName): use splitProps for prop handling

- Separated local props from pass-through props
- Now spreads rest props to root element
- Supports all standard HTML attributes
```

```
fix(ComponentName): optimize with createMemo

- Memoized expensive computations
- Improved render performance
```

## Accessibility Fixes

```
fix(ComponentName): improve accessibility

- Added aria-label to icon buttons
- Added keyboard navigation support
- Added aria-expanded for expandable content
- Screen reader now announces state changes

Closes #XXX
```

```
fix(ComponentName): add keyboard support

- Added Enter/Space key handling
- Tab navigation now works correctly
- Focus management improved
```

```
fix(ComponentName): fix focus management

- Focus now trapped in modal when open
- Focus returns to trigger on close
- Escape key closes modal
```

## API Fixes

```
feat(ComponentName): support rest props

- Now spreads unknown props to root element
- Supports className, style, data-* attributes
- Uses splitProps for prop separation
```

```
fix(ComponentName): improve class composition

- Uses twMerge for Tailwind class merging
- Custom classes can now override defaults
```

## Combined Fixes

```
fix(ComponentName): comprehensive audit fixes

Type Safety:
- Added explicit props interface
- Typed all event handlers
- Added return type

SolidJS:
- Fixed props destructuring (CRITICAL)
- Added createMemo for defaults
- Added effect cleanup

Accessibility:
- Added aria-label to icon buttons
- Added keyboard navigation
- Added focus management

See audit report: .claude/audits/ComponentName-YYYY-MM-DD.md

Closes #XXX
```

## Commit Best Practices

1. **One concern per commit** - Don't mix type fixes with a11y fixes
2. **Reference issues** - Use "Closes #XXX" or "Fixes #XXX"
3. **Breaking changes** - Always note in commit body
4. **Test after each commit** - Ensure tests pass before moving on
