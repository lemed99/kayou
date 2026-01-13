# TextInput Audit Report

**Generated:** 2026-01-13
**Overall Score:** 75/100 (Acceptable)

## Executive Summary

TextInput is a well-structured component with proper SolidJS patterns and good foundational accessibility. The main concerns are incomplete ARIA associations (label/input/helperText not properly linked), missing `aria-invalid` for error states, and unsafe type assertions. The fitContent feature uses DOM manipulation that could be optimized.

## Score Breakdown

| Dimension | Score | Max | Notes |
|-----------|-------|-----|-------|
| Type Safety | 20 | 25 | Unsafe type assertions, missing JSDoc |
| SolidJS Practices | 21 | 25 | Good patterns, minor effect issues |
| API Design | 13 | 15 | Good splitProps, minor cast |
| Accessibility | 13 | 20 | Missing label/input association |
| Performance | 8 | 10 | DOM manipulation in effect |
| Testing & Docs | 0 | 5 | None exist |
| **Total** | **75** | **100** | |

## Critical Issues

None

## High Priority Issues

### Issue 1: Label not associated with input
**Lines:** 160-166, 184-198
**Problem:** Label uses a separate `<Label>` component but input has no `id`, so they're not linked via `for`/`id`
**Impact:** Screen readers don't announce the label when input is focused
**Fix:**
```tsx
// Generate unique ID or accept id prop
const inputId = createMemo(() => props.id || `input-${createUniqueId()}`);

<Label for={inputId()} value={props.label} color={color()} />
// ...
<input id={inputId()} ... />
```

### Issue 2: Missing aria-invalid for error state
**Lines:** 184-198
**Problem:** When `color="failure"`, input should have `aria-invalid="true"`
**Impact:** Screen readers don't announce the input is in error state
**Fix:**
```tsx
<input
  aria-invalid={color() === 'failure' ? true : undefined}
  ...
/>
```

### Issue 3: HelperText not linked to input
**Lines:** 234-236
**Problem:** Helper text is rendered but not associated via `aria-describedby`
**Impact:** Screen readers don't announce helper text when input is focused
**Fix:**
```tsx
const helperId = createMemo(() => local.helperText ? `${inputId()}-helper` : undefined);

<input aria-describedby={helperId()} ... />

<Show when={local.helperText}>
  <HelperText id={helperId()} content={local.helperText} color={color()} />
</Show>
```

## Medium Priority Issues

### Issue 4: Unsafe type assertion for value
**Line:** 136
**Problem:** `(props.value || inputRef!.placeholder) as string`
**Fix:**
```tsx
const value = String(props.value ?? inputRef?.placeholder ?? '');
```

### Issue 5: Missing aria-busy for loading state
**Lines:** 184-198
**Problem:** No indication to screen readers that input is loading
**Fix:**
```tsx
<input
  aria-busy={local.isLoading || undefined}
  ...
/>
```

### Issue 6: Effect accesses props.value directly
**Line:** 136
**Problem:** Accessing `props.value` in effect without tracking context
**Impact:** Could miss reactivity updates in some edge cases
**Fix:** Access within the effect body is fine, but consider memoizing the computation

### Issue 7: Missing JSDoc on most props
**Lines:** 10-31
**Problem:** Only `arrowUpLabel` and `arrowDownLabel` have JSDoc
**Fix:** Add documentation to all props

## Low Priority Issues

### Issue 8: Type assertion for ref
**Line:** 124
**Problem:** `local.ref as { current: HTMLInputElement | undefined }`
**Suggestion:** Create a proper type guard or use more specific typing

### Issue 9: helperText type assertion
**Line:** 235
**Problem:** `local.helperText as string`
**Fix:** Already defined as `string` in props, assertion unnecessary

### Issue 10: No test file
**Expected:** `src/components/__tests__/TextInput.test.tsx`

### Issue 11: No documentation page
**Expected:** `doc/src/pages/components/textinput.tsx`

### Issue 12: fitContent DOM manipulation
**Lines:** 135-153
**Problem:** Creates/removes span elements for width calculation
**Suggestion:** Consider using CSS `ch` units or ResizeObserver for cleaner approach

## Positive Findings

1. **Proper props handling** - Uses `splitProps` correctly (lines 86-110)
2. **Memoized derived values** - Uses `createMemo` for color, sizing, etc. (lines 112-115)
3. **Explicit return type** - Has `JSX.Element` return type
4. **Good theming system** - Well-organized theme object with variants
5. **Arrow button accessibility** - Has `aria-label` and `aria-hidden` on icons
6. **Loading state** - Properly shows spinner and disables interaction
7. **Required indicator** - Shows asterisk for required fields
8. **Flexible ref handling** - Supports both callback and object refs (lines 119-126)
9. **Class composition** - Uses twMerge for Tailwind class merging

## Fix Priority Order

1. **High:** Associate label with input via id/for
2. **High:** Add aria-invalid when color="failure"
3. **High:** Link helperText via aria-describedby
4. **Medium:** Add aria-busy for loading state
5. **Medium:** Fix unsafe type assertions
6. **Medium:** Add JSDoc comments
7. **Low:** Create test file
8. **Low:** Create documentation page

## Recommended Test Plan

```typescript
describe('TextInput', () => {
  describe('Rendering', () => {
    it('renders with label');
    it('renders with helperText');
    it('renders with addon');
    it('renders with icon');
    it('renders loading state with spinner');
    it('renders required indicator');
  });

  describe('Accessibility', () => {
    it('label is associated with input via for/id');
    it('has aria-invalid when color is failure');
    it('helperText is linked via aria-describedby');
    it('has aria-busy when loading');
    it('arrow buttons have aria-labels');
  });

  describe('Interaction', () => {
    it('calls onArrowUp when up button clicked');
    it('calls onArrowDown when down button clicked');
    it('focuses input when arrow clicked');
    it('disables input when disabled prop is true');
    it('disables input when loading');
  });

  describe('fitContent', () => {
    it('adjusts width based on content');
    it('uses fieldSizing CSS if supported');
  });
});
```

## Related Components

- **NumberInput** - Uses TextInput as base, inherits a11y issues
- **Label** - Needs to support `for` prop
- **HelperText** - Needs to support `id` prop

---

*Audit performed using solidjs-component-auditor skill v2.0.0*