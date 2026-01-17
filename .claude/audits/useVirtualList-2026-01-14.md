# Hook Audit: useVirtualList

**Date:** 2026-01-14
**File:** `src/hooks/useVirtualList.tsx`
**Lines:** 63

---

## Executive Summary

`useVirtualList` is a well-implemented virtualization hook for fixed-height items. It efficiently calculates visible items using simple math and provides smooth scrolling through overscan. The implementation is clean, focused, and performant.

**Overall Score: 88/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                           |
| ---------------------- | ----- | --- | ----------------------------------------------- |
| TypeScript Correctness | 23    | 25  | Good generics, minor type improvements possible |
| SolidJS Best Practices | 24    | 25  | Excellent use of createMemo                     |
| API Design             | 14    | 15  | Clean tuple return, well-structured             |
| Performance            | 15    | 15  | Optimal O(1) calculations                       |
| Documentation          | 12    | 20  | Types documented, JSDoc missing                 |

---

## Issues Found

### Medium Severity

#### 1. Missing JSDoc Documentation

**Location:** Line 19

```typescript
export function useVirtualList<T extends readonly unknown[]>({
```

**Recommendation:**

````typescript
/**
 * Hook for virtualizing fixed-height lists.
 * Efficiently renders only visible items plus overscan for smooth scrolling.
 *
 * @template T - Array type of items
 * @param config - Configuration object
 * @param config.items - Accessor for the items array
 * @param config.rootHeight - Height of the scrollable container
 * @param config.rowHeight - Fixed height of each row
 * @param config.overscanCount - Extra rows to render above/below viewport
 * @param config.setScrollPosition - Optional callback for scroll position changes
 *
 * @returns Tuple of [virtualState, onScroll, scrollToIndex]
 *
 * @example
 * ```tsx
 * const [virtual, onScroll, scrollToIndex] = useVirtualList({
 *   items: () => data,
 *   rootHeight: 400,
 *   rowHeight: 40,
 *   overscanCount: 3,
 * });
 *
 * // Access visible items
 * virtual().visibleItems
 *
 * // Programmatic scroll
 * scrollToIndex(50);
 * ```
 */
````

### Low Severity

#### 2. Config Type Could Be Exported

**Location:** Lines 3-9

```typescript
type VirtualListConfig<T extends readonly unknown[]> = {
```

**Problem:** Type is internal, consumers can't reuse it.
**Recommendation:** Export the type:

```typescript
export type VirtualListConfig<T extends readonly unknown[]> = {
```

#### 3. Result Type Could Be Exported

**Location:** Lines 11-17

```typescript
type VirtualListResult<T extends readonly unknown[]> = {
```

**Problem:** Type is internal, consumers can't type their state.
**Recommendation:** Export the type.

#### 4. scrollToIndex Doesn't Actually Scroll

**Location:** Lines 55-59

```typescript
const scrollToIndex = (index: number, behavior: ScrollBehavior = 'auto') => {
  const clampedIndex = Math.max(0, Math.min(index, items().length - 1));
  const targetScrollTop = clampedIndex * rowHeight;
  return { scrollTop: targetScrollTop, behavior };
};
```

**Problem:** Returns scroll position but doesn't perform the scroll.
**Note:** This is by design (caller handles scroll), but could be documented better.

---

## Positive Findings

1. **O(1) Calculation:** Uses simple math for index calculation, no iteration needed.

2. **Overscan Support:** Renders extra items above/below viewport for smooth scrolling.

3. **Clean Signal Usage:** Uses `createMemo` for derived state, only recalculates when needed.

4. **Proper Scroll Handling:** `handleScroll` extracts scroll position safely.

5. **Index Clamping:** `scrollToIndex` ensures valid index range.

6. **Scroll Position Callback:** Optional `setScrollPosition` for external state sync.

7. **Tuple Return Pattern:** Clean `[state, handler, action]` return pattern.

---

## Algorithm Analysis

```
First Visible Index = max(0, floor(scrollTop / rowHeight) - overscan)
Last Visible Index = min(itemCount, floor(scrollTop / rowHeight) + ceil(rootHeight / rowHeight) + overscan)

Container Height = itemCount * rowHeight
Viewer Top = firstIdx * rowHeight
```

This is optimal for fixed-height virtualization.

---

## Recommendations

1. Add comprehensive JSDoc documentation
2. Export config and result types
3. Document the `scrollToIndex` return pattern
4. Consider adding scroll-to-item-by-predicate utility

---

## Test Coverage Needed

- [ ] Correct visible items calculation
- [ ] Overscan adds extra items
- [ ] Scroll handler updates state
- [ ] scrollToIndex returns correct position
- [ ] Empty array handling
- [ ] Large array performance
- [ ] setScrollPosition callback fires
