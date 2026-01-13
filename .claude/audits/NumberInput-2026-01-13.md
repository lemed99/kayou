# NumberInput Audit Report

**Generated:** 2026-01-13
**Overall Score:** 81/100 (Good)

## Executive Summary

NumberInput is a well-structured component with solid TypeScript types and proper SolidJS reactivity patterns. It correctly uses `splitProps` and `createMemo` throughout. Main concerns are accessibility (missing spinbutton ARIA pattern) and unsafe type assertions. No tests or documentation exist.

## Score Breakdown

| Dimension | Score | Max | Notes |
|-----------|-------|-----|-------|
| Type Safety | 22 | 25 | Unsafe type assertions with `as` |
| SolidJS Practices | 23 | 25 | Direct DOM manipulation via classList |
| API Design | 13 | 15 | Good splitProps usage |
| Accessibility | 14 | 20 | Missing spinbutton ARIA pattern |
| Performance | 9 | 10 | Minor DOM manipulation |
| Testing & Docs | 0 | 5 | None exist |
| **Total** | **81** | **100** | |

## Critical Issues

None

## High Priority Issues

### Issue 1: Missing spinbutton ARIA pattern
**Lines:** 329-347
**Problem:** Number input with arrows should implement WAI-ARIA spinbutton pattern
**Impact:** Screen reader users cannot understand the component's purpose or current value
**Fix:**
```tsx
<TextInput
  {...inputProps}
  role="spinbutton"
  aria-valuenow={parseFloat(inputRef?.value || '0')}
  aria-valuemin={props.min}
  aria-valuemax={props.max}
  // ... rest of props
/>
```

### Issue 2: Unsafe type assertions
**Lines:** 100-101, 114, 131, 148, 157
**Problem:** Using `props.min as number` and `props.min as string` without validation
**Impact:** Runtime errors if props are undefined/wrong type
**Examples:**
```typescript
// Current (unsafe):
if (formatted < (props.min as number)) formatted = props.min as number;

// Better:
const minValue = typeof props.min === 'number' ? props.min : undefined;
if (minValue !== undefined && formatted < minValue) formatted = minValue;
```

### Issue 3: Arrow buttons lack aria-labels
**Location:** Inherited from TextInput (lines 197-220)
**Problem:** Increment/decrement buttons have no accessible names
**Impact:** Screen readers announce "button" with no context
**Fix:** Add to TextInput's arrow buttons:
```tsx
<button aria-label="Increase value" ...>
<button aria-label="Decrease value" ...>
```

## Medium Priority Issues

### Issue 4: No explicit return type
**Line:** 40
**Problem:** `const NumberInput = (props: NumberInputProps) => {`
**Fix:** `const NumberInput = (props: NumberInputProps): JSX.Element => {`

### Issue 5: Direct DOM manipulation for button states
**Lines:** 163-170
**Problem:** `setButtonActive` uses classList.add/remove directly
**Impact:** Not following SolidJS reactive patterns
**Current:**
```typescript
const setButtonActive = (btn: HTMLButtonElement | undefined, active: boolean) => {
  if (!btn) return;
  if (active) {
    btn.classList.add('bg-gray-200', 'dark:bg-gray-600');
  } else {
    btn.classList.remove('bg-gray-200', 'dark:bg-gray-600');
  }
};
```
**Better approach:** Use signals or pass state to TextInput for styling

### Issue 6: Inconsistent prop naming
**Lines:** 11-16
**Problem:** `nullable` vs `allowNegativeValues` - inconsistent prefix usage
**Suggestion:** Consider `allowNull` or `isNullable` for consistency

### Issue 7: No value change announcement
**Problem:** When value changes via arrows, screen readers don't announce new value
**Fix:** Add `aria-live` region or use `aria-valuenow` updates

## Low Priority Issues

### Issue 8: Missing JSDoc comments
**Lines:** 10-17
**Problem:** Props interface lacks documentation
**Fix:**
```typescript
export interface NumberInputProps extends ExtendedTextInputProps {
  /** Allow empty/null values */
  nullable?: boolean;
  /** Decimal places for float type */
  precision?: number;
  /** Increment/decrement step amount */
  step?: number;
  /** Show up/down arrow buttons */
  showArrows?: boolean;
  /** Allow negative number input */
  allowNegativeValues?: boolean;
  /** Number format: 'integer' or 'float' */
  type?: 'integer' | 'float';
}
```

### Issue 9: No test file
**Expected:** `src/components/__tests__/NumberInput.test.tsx`
**Tests needed:**
- Integer input validation
- Float input with precision
- Increment/decrement via arrows
- Increment/decrement via keyboard (ArrowUp/ArrowDown)
- Min/max boundary enforcement
- Negative value handling
- Paste handling

### Issue 10: No documentation page
**Expected:** `doc/src/pages/components/numberinput.tsx`

### Issue 11: French comment
**Line:** 308
**Problem:** `// Gerer le paste apres, ctrl + v, etc...`
**Fix:** Use English or remove: `// Handle paste validation`

## Positive Findings

1. **Proper props handling** - Uses `splitProps` correctly (line 41-53)
2. **Memoized derived values** - All computed values use `createMemo` (lines 55-68)
3. **Good keyboard support** - ArrowUp/ArrowDown increment/decrement (lines 187-197)
4. **Input sanitization** - Proper handling of paste, decimal separators, negative sign (lines 250-313)
5. **Type-aware formatting** - Correctly handles integer vs float types
6. **Flexible ref handling** - Supports both callback and object refs (lines 74-82)
7. **Boundary enforcement** - Respects min/max on blur and arrow actions

## Fix Priority Order

1. **High:** Add spinbutton ARIA attributes
2. **High:** Fix unsafe type assertions
3. **High:** Add aria-labels to arrow buttons (in TextInput)
4. **Medium:** Add explicit return type
5. **Medium:** Add value change announcements
6. **Low:** Add JSDoc comments
7. **Low:** Create test file
8. **Low:** Create documentation page

## Recommended Test Plan

```typescript
describe('NumberInput', () => {
  describe('Integer Mode', () => {
    it('only accepts integer input');
    it('rounds decimal input on blur');
    it('increments by step on ArrowUp');
    it('decrements by step on ArrowDown');
  });

  describe('Float Mode', () => {
    it('accepts decimal input');
    it('formats to specified precision on blur');
    it('converts comma to decimal point');
  });

  describe('Boundaries', () => {
    it('enforces min value');
    it('enforces max value');
    it('handles negative values when allowed');
    it('blocks negative values when not allowed');
  });

  describe('Accessibility', () => {
    it('has spinbutton role');
    it('updates aria-valuenow on change');
    it('arrow buttons have aria-labels');
  });
});
```

## Related Components

- **TextInput** - Base component, shares arrow button a11y issues
- **DatePicker** - Similar input validation patterns

---

*Audit performed using solidjs-component-auditor skill v2.0.0*
