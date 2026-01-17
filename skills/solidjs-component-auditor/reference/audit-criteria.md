# Component Audit Criteria

## Scoring System

Each component is scored out of 100 points across 6 dimensions:

| Dimension         | Weight | Focus Area              |
| ----------------- | ------ | ----------------------- |
| Type Safety       | 25%    | TypeScript correctness  |
| SolidJS Practices | 25%    | Reactivity patterns     |
| API Design        | 15%    | Props interface quality |
| Accessibility     | 20%    | WCAG compliance         |
| Performance       | 10%    | Optimization            |
| Testing/Docs      | 5%     | Coverage                |

## Type Safety (25 points)

### Critical (Deduct 5 points each)

- [ ] Using `any` type anywhere in props or state
- [ ] Missing return type on component function
- [ ] Untyped event handlers (`onClick?: Function`)
- [ ] Missing prop interface entirely

### High (Deduct 3 points each)

- [ ] Generic components without type parameters
- [ ] Using `unknown` without type guards
- [ ] Missing JSDoc on complex types
- [ ] Incorrect ref types

### Medium (Deduct 1 point each)

- [ ] Could use stricter union types
- [ ] Missing readonly modifiers
- [ ] Implicit any from external libraries

### Checklist

```typescript
// REQUIRED: Explicit props interface
interface ComponentProps {
  // All props typed
}

// REQUIRED: Component has return type
function Component(props: ComponentProps): JSX.Element

// REQUIRED: Event handlers fully typed
onClick?: (event: MouseEvent) => void

// REQUIRED: Refs properly typed
let ref: HTMLDivElement | undefined
```

## SolidJS Practices (25 points)

### Critical (Deduct 8 points each)

- [ ] **Props destructuring** - Breaks reactivity completely
- [ ] Using React patterns (useState, useEffect)
- [ ] Accessing signals outside reactive context

### High (Deduct 4 points each)

- [ ] Missing `onCleanup` in effects with subscriptions
- [ ] Using effect for derived state (should use memo)
- [ ] Creating signals conditionally
- [ ] Effects inside For/Index loops

### Medium (Deduct 2 points each)

- [ ] Not using `createMemo` for expensive computations
- [ ] Not using `batch` for multiple signal updates
- [ ] Unnecessary signal creation (could be derived)

### Low (Deduct 1 point each)

- [ ] Could use `mergeProps` instead of manual defaults
- [ ] Could use `Index` instead of `For` for index-based lists

### Pattern Detection

```typescript
// CRITICAL: Never destructure props
// BAD:
function Component({ name, value }) { }
// GOOD:
function Component(props: Props) { }

// CRITICAL: Always call signals in JSX
// BAD:
const val = signal(); return <div>{val}</div>
// GOOD:
return <div>{signal()}</div>

// HIGH: Always cleanup effects
createEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);
  onCleanup(() => window.removeEventListener('resize', handler));
});
```

## API Design (15 points)

### High (Deduct 3 points each)

- [ ] Not using `splitProps` for prop separation
- [ ] Not spreading rest props to root element
- [ ] Inconsistent with library conventions
- [ ] Missing `class` prop support

### Medium (Deduct 2 points each)

- [ ] Inconsistent prop naming (mix of `isX` and `x`)
- [ ] Required props that should be optional
- [ ] Missing sensible defaults
- [ ] Overly complex prop interface

### Low (Deduct 1 point each)

- [ ] Could accept more HTML attributes
- [ ] Missing `ref` forwarding
- [ ] Prop order doesn't follow convention

### Convention Check

```typescript
// REQUIRED: Use splitProps
const [local, others] = splitProps(props, ['custom', 'props']);

// REQUIRED: Spread rest props
<div {...others}>{local.children}</div>

// REQUIRED: Support class merging
class={twMerge(theme.base, local.class)}

// CONVENTION: Boolean props use `is` prefix
isDisabled?: boolean
isLoading?: boolean

// CONVENTION: Callbacks use `on` prefix
onClick?: () => void
onChange?: (value: string) => void
```

## Accessibility (20 points)

### Critical (Deduct 5 points each)

- [ ] Interactive element without keyboard support
- [ ] Missing role on custom interactive element
- [ ] Form input without label association
- [ ] Modal without focus trap

### High (Deduct 3 points each)

- [ ] Missing `aria-label` on icon-only buttons
- [ ] Missing `aria-expanded` on expandable elements
- [ ] No focus management in overlays
- [ ] Missing `aria-describedby` for errors

### Medium (Deduct 2 points each)

- [ ] Missing `aria-hidden` on decorative elements
- [ ] Focus not visible (relies on browser default)
- [ ] Missing `aria-live` for dynamic content
- [ ] No `prefers-reduced-motion` support

### Low (Deduct 1 point each)

- [ ] Could use more semantic HTML
- [ ] Missing `title` attributes
- [ ] Missing skip links (for complex components)

### Required ARIA by Component Type

| Component Type     | Required ARIA                                              |
| ------------------ | ---------------------------------------------------------- |
| Button (icon-only) | `aria-label`                                               |
| Modal/Dialog       | `role="dialog"`, `aria-modal`, `aria-labelledby`           |
| Select/Dropdown    | `role="listbox"`, `aria-expanded`, `aria-activedescendant` |
| Accordion          | `aria-expanded`, `aria-controls`                           |
| Tabs               | `role="tablist"`, `role="tab"`, `role="tabpanel"`          |
| Alert              | `role="alert"` or `aria-live`                              |
| Tooltip            | `role="tooltip"`, `aria-describedby`                       |

## Performance (10 points)

### High (Deduct 3 points each)

- [ ] Expensive computation without `createMemo`
- [ ] Memory leak (missing cleanup)
- [ ] Re-creating objects/functions unnecessarily

### Medium (Deduct 2 points each)

- [ ] Large component without code splitting
- [ ] Not using `lazy` for heavy imports
- [ ] Inline style objects (create on every access)

### Low (Deduct 1 point each)

- [ ] Could benefit from virtualization
- [ ] Images without lazy loading
- [ ] Missing `loading="lazy"` on iframes

## Testing & Documentation (5 points)

### Testing (3 points)

- [ ] No test file exists (-2 points)
- [ ] Test file exists but low coverage (-1 point)
- [ ] Missing accessibility tests (-1 point)

### Documentation (2 points)

- [ ] No JSDoc comments (-1 point)
- [ ] No MDX documentation (-1 point)
- [ ] Missing examples (-0.5 points)

## Issue Severity Guide

| Severity     | Impact                                                    | Action Required             |
| ------------ | --------------------------------------------------------- | --------------------------- |
| **Critical** | Breaks functionality, security risk, major a11y violation | Must fix before any release |
| **High**     | Significant issues, notable a11y problems                 | Fix before v1.0             |
| **Medium**   | Code quality, minor improvements                          | Post-release backlog        |
| **Low**      | Nice-to-have, polish                                      | Future consideration        |

## Quick Audit Commands

```bash
# Check for props destructuring (Critical)
grep -n "function.*{.*}" src/components/*.tsx

# Check for any types (Critical)
grep -n ": any" src/components/*.tsx

# Check for missing cleanup
grep -l "createEffect" src/components/*.tsx | xargs grep -L "onCleanup"

# Check for React patterns
grep -n "useState\|useEffect\|useCallback\|useMemo" src/components/*.tsx
```
