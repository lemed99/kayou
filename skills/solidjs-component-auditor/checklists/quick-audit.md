# Quick Audit Checklist

Use this for rapid component assessment. Check each item - any unchecked item is a potential issue.

## Component: **\*\*\*\***\_**\*\*\*\*** Date: \***\*\_\*\***

## 1. Critical Issues (Must Fix)

### Type Safety

- [ ] Has explicit props interface
- [ ] No `any` types in props
- [ ] Event handlers are typed
- [ ] Component has return type (`: JSX.Element`)

### SolidJS Patterns

- [ ] **Props NOT destructured** (check function signature)
- [ ] Signals accessed with `()` in JSX
- [ ] No React patterns (useState, useEffect)
- [ ] Effects have cleanup if using subscriptions

### Accessibility

- [ ] Interactive elements are keyboard accessible
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels
- [ ] Modals/dialogs have proper ARIA

## 2. High Priority

### Type Safety

- [ ] Generic components have type parameters
- [ ] Refs are properly typed
- [ ] Store types are complete

### SolidJS Patterns

- [ ] Uses `createMemo` for derived values with defaults
- [ ] Uses `splitProps` to separate local/rest props
- [ ] No signals created conditionally

### API Design

- [ ] Spreads rest props to root element
- [ ] Supports `class` prop via `twMerge`
- [ ] Consistent with library conventions

### Accessibility

- [ ] `aria-expanded` on expandable elements
- [ ] `aria-selected` on selectable items
- [ ] Focus visible on all interactive elements
- [ ] Error states announced (`role="alert"`)

## 3. Medium Priority

### Performance

- [ ] Expensive computations use `createMemo`
- [ ] Large lists consider virtualization
- [ ] No inline object/function creation in JSX

### Documentation

- [ ] JSDoc comments on props interface
- [ ] Component has usage examples
- [ ] Complex logic has comments

## Quick Grep Commands

```bash
# Run these in terminal to find issues quickly

# 1. Props destructuring (CRITICAL)
grep -n "^const.*=.*props\)" ComponentName.tsx
grep -n "function.*{.*,.*}" ComponentName.tsx

# 2. Any types
grep -n ": any" ComponentName.tsx

# 3. React patterns
grep -n "useState\|useEffect\|useCallback" ComponentName.tsx

# 4. Missing cleanup
# If file has createEffect, check for onCleanup
grep -c "createEffect" ComponentName.tsx && grep -c "onCleanup" ComponentName.tsx

# 5. Missing aria-label on buttons with icons
grep -A2 "<button" ComponentName.tsx | grep -v "aria-label"
```

## Scoring

| Score                        | Rating     | Action                |
| ---------------------------- | ---------- | --------------------- |
| All checked                  | Excellent  | Ready for release     |
| 1-2 unchecked (non-critical) | Good       | Minor improvements    |
| Any critical unchecked       | Needs Work | Fix before release    |
| Multiple critical unchecked  | Poor       | Major refactor needed |

## Notes

_Space for audit notes:_

---

---

---

## Recommended Actions

1. ***
2. ***
3. ***
