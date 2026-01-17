# DatePicker Component Audit

**Date**: 2026-01-14
**Files Reviewed**:

- `src/components/DatePicker.tsx`
- `src/hooks/useDatePicker.tsx`
- `src/context/DatePickerContext.tsx`

## Summary

The DatePicker component provides single, multiple, and range date selection with a floating calendar popup. While functional, it has significant accessibility gaps, type safety issues, and a problematic `onChange` implementation that fires on every render.

---

## Critical Issues

### 1. onChange Fires on Every Render (Lines 480-484)

**Problem**: The `onChange` callback is inside a `createEffect` without proper tracking, causing it to fire on component mount and potentially on unrelated reactive updates.

```typescript
// CURRENT - fires on every change including initial mount
createEffect(() => {
  if (props.onChange) {
    props.onChange(datesObjectValue);
  }
});
```

**Fix**: Use `on` or `createComputed` with explicit tracking, and skip initial call:

```typescript
import { on } from 'solid-js';

// Only fire when datesObjectValue actually changes, skip initial
let isFirstRun = true;
createEffect(
  on(
    () => ({ ...datesObjectValue }),
    (value) => {
      if (isFirstRun) {
        isFirstRun = false;
        return;
      }
      props.onChange?.(value);
    },
    { defer: true },
  ),
);
```

### 2. Non-null Assertion on Optional `locale` (Lines 232, 265, 323)

**Problem**: Calendar uses `props.locale!` but locale is optional in CalendarProps.

```typescript
{
  getMonthsShort(props.locale!)[props.currentDate().getMonth()];
}
```

**Fix**: Either make locale required in CalendarProps or provide a fallback:

```typescript
interface CalendarProps {
  // ...
  locale: string; // Make required
}
```

### 3. Missing Accessibility Attributes

**Problem**: The component lacks essential ARIA attributes for screen reader users.

**Fixes needed**:

```tsx
// Input container needs:
<div
  ref={refs.setReference}
  onClick={handleInputClick}
  role="combobox"
  aria-expanded={isOpen()}
  aria-haspopup="dialog"
  aria-label={props.label || 'Select date'}
>

// Calendar popup needs:
<div
  ref={refs.setFloating}
  role="dialog"
  aria-label="Choose date"
  aria-modal="true"
>

// Day buttons need:
<button
  type="button"
  aria-label={`${date.toLocaleDateString(props.locale)}`}
  aria-selected={isSelected(date)}
  aria-disabled={isDisabled(date)}
>
```

---

## High Priority Issues

### 4. Unsafe Type Assertions (Lines 630, 639)

**Problem**: `inputRef() as HTMLElement` can fail.

```typescript
(inputRef() as HTMLElement)?.focus();
```

**Fix**: Use proper type guard:

```typescript
const input = inputRef();
if (input instanceof HTMLElement) {
  input.focus();
}
```

### 5. Missing Keyboard Navigation

**Problem**: No keyboard support for navigating the calendar or closing the popup.

**Fix**: Add keyboard handlers:

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Escape':
      setIsOpen(false);
      inputRef()?.focus();
      break;
    case 'ArrowLeft':
      // Navigate to previous day
      break;
    case 'ArrowRight':
      // Navigate to next day
      break;
    case 'ArrowUp':
      // Navigate to previous week
      break;
    case 'ArrowDown':
      // Navigate to next week
      break;
  }
};
```

### 6. Redundant Logic in isDateDisabled (Line 529)

**Problem**: Unnecessary `|| false` expressions.

```typescript
// CURRENT
return (min && date < min) || false || (max && date > max) || false;
```

**Fix**:

```typescript
const isDateDisabled = (date: Date): boolean => {
  const min = minDate();
  const max = maxDate();
  if (min && date < min) return true;
  if (max && date > max) return true;
  return false;
};
```

---

## Medium Priority Issues

### 7. Year Range Only Shows Past Years (Lines 191-199)

**Problem**: `getYearRange()` only shows the last 10 years, not future years.

```typescript
const getYearRange = () => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear - 9; i <= currentYear; i++) {
    years.push(i);
  }
  return years;
};
```

**Fix**: Show a balanced range or make it configurable:

```typescript
const getYearRange = () => {
  const currentYear = props.currentDate().getFullYear();
  const years: number[] = [];
  // Show 5 years before and 5 years after current selection
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
};
```

### 8. Magic Numbers (Lines 135, 185, 369)

**Problem**: Unexplained numbers scattered in code.

```typescript
for (let i = 0; i < 42; i++) { // What is 42?
if (year >= 1970) { // Why 1970?
min={1970}
```

**Fix**: Extract to named constants:

```typescript
/** Number of cells in a 6-week calendar grid (7 days * 6 weeks) */
const CALENDAR_GRID_SIZE = 42;

/** Minimum valid year for date selection (Unix epoch year) */
const MIN_YEAR = 1970;
```

### 9. Typo in Function Name

**Problem**: `getSixWeeksMargedDaysInMonth` should be `getSixWeeksMergedDaysInMonth`.

**Fix**: Rename the function.

### 10. LocalStorage in Context May Fail in SSR (DatePickerContext.tsx:21)

**Problem**: Direct `localStorage` access in `onMount` will fail during SSR.

```typescript
onMount(() => {
  const stored = JSON.parse(localStorage.getItem('DatePickerCache') || '{}');
  // ...
});
```

**Fix**: Add safety check:

```typescript
onMount(() => {
  if (typeof window === 'undefined') return;

  try {
    const stored = JSON.parse(localStorage.getItem('DatePickerCache') || '{}');
    // ...
  } catch {
    // localStorage may be blocked
  }
});
```

---

## Low Priority Issues

### 11. Missing JSDoc on Internal Components

**Problem**: `Calendar`, `CalendarProps`, and helper functions lack documentation.

**Fix**: Add JSDoc:

```typescript
/**
 * Internal calendar grid component for DatePicker.
 * Renders month/year navigation and day selection grid.
 */
const Calendar = (props: CalendarProps) => { ... }

/**
 * Props for the internal Calendar component.
 */
export interface CalendarProps {
  /** Current date being viewed in the calendar */
  currentDate: () => Date;
  // ...
}
```

### 12. useDatePicker Hook Missing JSDoc

**Problem**: Hook has no documentation.

**Fix**:

````typescript
/**
 * Hook to access the DatePicker context.
 * Provides month cache and locale for date picker components.
 * Must be used within a DatePickerProvider.
 *
 * @returns DatePickerContextType with monthCache, setMonthCache, clearDatePickerGlobal, and locale
 * @throws Error if used outside DatePickerProvider
 *
 * @example
 * ```tsx
 * const { locale, monthCache } = useDatePicker();
 * ```
 */
export const useDatePicker = () => { ... }
````

### 13. Context Type Should Be Explicitly Undefined

**Problem**: `DatePickerContext` doesn't make undefined type explicit.

```typescript
// CURRENT
export const DatePickerContext = createContext<DatePickerContextType>();
```

**Fix**:

```typescript
export const DatePickerContext = createContext<DatePickerContextType | undefined>(
  undefined,
);
```

### 14. Missing aria-describedby for Helper Text

**Problem**: Helper text not linked to input for screen readers.

**Fix**: Generate and link IDs:

```typescript
const helperId = `datepicker-helper-${createUniqueId()}`;

<TextInput
  aria-describedby={props.helperText ? helperId : undefined}
  // ...
/>
<Show when={props.helperText}>
  <HelperText id={helperId} content={props.helperText} color="gray" />
</Show>
```

### 15. Date Comparison Includes Time

**Problem**: `isDateDisabled` compares full Date objects which include time.

```typescript
if (min && date < min) return true;
```

**Fix**: Compare at day level:

```typescript
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isDateDisabled = (date: Date): boolean => {
  const min = minDate();
  const max = maxDate();
  const dayStart = startOfDay(date);
  if (min && dayStart < startOfDay(min)) return true;
  if (max && dayStart > startOfDay(max)) return true;
  return false;
};
```

---

## Recommendations Summary

| Priority | Issue                            | Lines         | Effort |
| -------- | -------------------------------- | ------------- | ------ |
| Critical | onChange fires on every render   | 480-484       | Medium |
| Critical | Non-null assertion on locale     | 232, 265, 323 | Low    |
| Critical | Missing accessibility attributes | Multiple      | High   |
| High     | Unsafe type assertions           | 630, 639      | Low    |
| High     | Missing keyboard navigation      | N/A           | High   |
| High     | Redundant isDateDisabled logic   | 529           | Low    |
| Medium   | Year range only shows past       | 191-199       | Low    |
| Medium   | Magic numbers                    | 135, 185, 369 | Low    |
| Medium   | Function name typo               | 115           | Low    |
| Medium   | LocalStorage SSR safety          | Context:21    | Low    |
| Low      | Missing JSDoc                    | Multiple      | Medium |
| Low      | Context type undefined           | Context:15    | Low    |
| Low      | Missing aria-describedby         | N/A           | Low    |
| Low      | Date comparison includes time    | 526-529       | Low    |

---

## Files to Update

1. `src/components/DatePicker.tsx` - Main component fixes
2. `src/hooks/useDatePicker.tsx` - Add JSDoc
3. `src/context/DatePickerContext.tsx` - SSR safety, type fix
