# Hook Audit: useSelect

**Date:** 2026-01-14
**File:** `src/hooks/useSelect.tsx`
**Lines:** 472

---

## Executive Summary

`useSelect` is a comprehensive hook that powers three selection components: `Select`, `SelectWithSearch`, and `MultiSelect`. It handles keyboard navigation, filtering, virtualization integration, floating positioning, and accessibility. While feature-rich, its complexity creates some maintainability concerns.

**Overall Score: 76/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                                |
| ---------------------- | ----- | --- | ---------------------------------------------------- |
| TypeScript Correctness | 18    | 25  | Some `any` types via component imports               |
| SolidJS Best Practices | 20    | 25  | Good signal usage, but Layout as function is unusual |
| API Design             | 10    | 15  | Very large return object, could be structured better |
| Accessibility          | 12    | 15  | Good ARIA implementation                             |
| Performance            | 10    | 10  | Virtualization support, efficient filtering          |
| Documentation          | 6     | 10  | Interfaces exist but no JSDoc                        |

---

## Issues Found

### High Severity

#### 1. Layout Component Pattern Is Unusual

**Location:** Lines 345-445

```typescript
const Layout = (layoutProps: {...}) => {
  return (...);
};
```

**Problem:** Defining a component inside a hook and returning it is non-standard. This could cause re-creation on every render.
**Recommendation:** Either:

- Extract to a separate component file
- Use render props pattern
- Memoize with `createMemo` if necessary

#### 2. Effect Cleanup for Click Outside Listener

**Location:** Lines 208-222

```typescript
createEffect(() => {
  const handleClickOutside = ...
  document.addEventListener('mousedown', handleClickOutside);
  onCleanup(() => document.removeEventListener(...));
});
```

**Problem:** Effect re-runs when dependencies change, potentially adding multiple listeners.
**Recommendation:** Use a more controlled approach or ensure proper cleanup.

### Medium Severity

#### 3. Missing JSDoc Documentation

**Location:** Line 48

```typescript
const useSelect = <T extends MergedSelectProps>(
  props: T,
  type: 'select' | 'selectWithSearch' | 'multiSelect',
) => {
```

**Recommendation:**

```typescript
/**
 * Internal hook powering Select, SelectWithSearch, and MultiSelect components.
 * Manages selection state, keyboard navigation, filtering, and accessibility.
 *
 * @template T - Props type extending MergedSelectProps
 * @param props - Component props
 * @param type - Selection component type
 * @returns Selection state and handlers object
 *
 * @internal Not intended for direct consumption
 */
```

#### 4. Large Return Object

**Location:** Lines 447-468

```typescript
return {
  searchKey,
  setSearchKey,
  // ... 15+ more properties
};
```

**Problem:** Returning many individual items makes the API unwieldy.
**Recommendation:** Group related items:

```typescript
return {
  state: { searchKey, selectedOption, ... },
  handlers: { handleKeyDown, handleOptionClick, ... },
  refs: { searchRef, setSearchRef },
  Layout,
};
```

#### 5. Magic Number for Row Height

**Location:** Line 117

```typescript
const rowHeight = props.optionRowHeight || 32; // 32 because it is the rowHeight we currently use
```

**Problem:** Default value should be a named constant.
**Recommendation:**

```typescript
const DEFAULT_OPTION_ROW_HEIGHT = 32;
```

### Low Severity

#### 6. Type Assertion in scrollToHighlightedOption

**Location:** Lines 113-130

```typescript
container.scrollTop = index * rowHeight;
```

**Problem:** No bounds checking for index.

#### 7. Loose Equality Comparisons

**Location:** Lines 74, 80, 89, 94

```typescript
props.options.find((o) => o.value == props.idValue);
```

**Problem:** Using `==` instead of `===`.
**Recommendation:** Use strict equality unless intentional type coercion.

---

## Positive Findings

1. **Comprehensive Keyboard Navigation:** Supports ArrowUp, ArrowDown, Enter, Escape, Home, End keys.

2. **ARIA Implementation:** Includes `listboxId`, `role="listbox"`, `aria-multiselectable`, `aria-label`.

3. **Virtualization Support:** Integrates with `VirtualList` for large option sets.

4. **Floating UI Integration:** Uses `useFloating` for proper dropdown positioning.

5. **Click Outside Handling:** Properly closes dropdown when clicking outside.

6. **Scroll Position Memory:** Remembers scroll position between open/close cycles.

7. **Lazy Loading Support:** Includes `onLazyLoad` callback for infinite scroll.

---

## Architecture Notes

The hook serves three components with different behaviors:

- **select:** Single selection, no search
- **selectWithSearch:** Single selection with filtering
- **multiSelect:** Multiple selection with optional search

This shared code approach reduces duplication but increases complexity.

---

## Recommendations

1. Extract `Layout` to a separate component
2. Group return values into logical objects
3. Add comprehensive JSDoc documentation
4. Create named constants for magic numbers
5. Use strict equality comparisons
6. Consider splitting into smaller, more focused hooks

---

## Test Coverage Needed

- [ ] Single selection mode
- [ ] Multi-selection mode
- [ ] Search/filtering functionality
- [ ] Keyboard navigation (all keys)
- [ ] Click outside closes dropdown
- [ ] Scroll position persistence
- [ ] Virtualized option rendering
- [ ] Lazy loading trigger
- [ ] ARIA attributes are correct
