# Hook Audit: useDynamicVirtualList

**Date:** 2026-01-14
**File:** `src/hooks/useDynamicVirtualList.tsx`
**Lines:** 192

---

## Executive Summary

`useDynamicVirtualList` is an advanced virtualization hook for variable-height items. It uses ResizeObserver to track actual item heights, binary search for efficient visible range calculation, and maintains proper cleanup. This is a sophisticated implementation that handles a complex problem well.

**Overall Score: 90/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                                |
| ---------------------- | ----- | --- | ---------------------------------------------------- |
| TypeScript Correctness | 22    | 25  | Good generics, proper typing                         |
| SolidJS Best Practices | 24    | 25  | Excellent reactivity patterns                        |
| API Design             | 14    | 15  | Clean, matches useVirtualList pattern                |
| Performance            | 18    | 20  | Binary search, but Map operations could be optimized |
| Memory Management      | 12    | 15  | Good cleanup, but some edge cases                    |

---

## Issues Found

### Medium Severity

#### 1. Missing JSDoc Documentation

**Location:** Line 21

```typescript
export function useDynamicVirtualList<T extends readonly unknown[]>({
```

**Recommendation:**

````typescript
/**
 * Hook for virtualizing variable-height lists.
 * Measures actual item heights via ResizeObserver and uses binary search
 * for efficient visible range calculation.
 *
 * @template T - Array type of items
 * @param config - Configuration object
 * @param config.items - Accessor for the items array
 * @param config.rootHeight - Height of the scrollable container
 * @param config.estimatedRowHeight - Initial estimate for unmeasured items
 * @param config.overscanCount - Extra rows to render above/below viewport
 * @param config.setScrollPosition - Optional callback for scroll position changes
 * @param config.setAverageRowHeight - Optional callback for average height updates
 *
 * @returns Tuple of [virtualState, onScroll, registerSize, scrollToIndex]
 *
 * @example
 * ```tsx
 * const [virtual, onScroll, registerSize, scrollToIndex] = useDynamicVirtualList({
 *   items: () => data,
 *   rootHeight: 400,
 *   estimatedRowHeight: 50,
 *   overscanCount: 3,
 * });
 *
 * // Register size in render
 * <div ref={(el) => registerSize(() => index, el)}>
 * ```
 */
````

#### 2. sizeMapVersion Trigger Pattern

**Location:** Lines 84-85, 94-95

```typescript
sizeMapVersion(); // called to trigger reactivity
```

**Problem:** Using a signal read purely for side effects is a code smell.
**Note:** This is a valid pattern in SolidJS for forcing re-evaluation, but a comment explaining why is helpful (which exists).

#### 3. Potential Memory Leak with Fast Scrolling

**Location:** Lines 61-82

```typescript
const registerSize = (index: Accessor<number>, el: HTMLElement) => {
  // ...
  observer.observe(el);
  observerMap.set(capturedIndex, { observer, index: capturedIndex });
};
```

**Problem:** If items scroll in and out quickly, observers might accumulate.
**Mitigation:** The cleanup effect at lines 156-163 handles this.

### Low Severity

#### 4. Binary Search Could Be Extracted

**Location:** Lines 130-137

```typescript
while (start < end) {
  const mid = Math.floor((start + end) / 2);
  if (offsets[mid] < st) start = mid + 1;
  else end = mid;
}
```

**Recommendation:** Extract to utility function for reuse and testing:

```typescript
const binarySearchLowerBound = (offsets: number[], target: number) => { ... }
```

#### 5. Export Types

**Location:** Lines 3-18

```typescript
type DynamicVirtualListConfig<T extends readonly unknown[]> = { ... }
type DynamicVirtualListResult<T extends readonly unknown[]> = { ... }
```

**Recommendation:** Export these types for consumer use.

---

## Positive Findings

1. **ResizeObserver Integration:** Properly measures actual item heights in real-time.

2. **Binary Search:** O(log n) lookup for first visible item instead of O(n) iteration.

3. **Average Height Calculation:** Uses measured heights to estimate unmeasured items.

4. **Prefix Heights Caching:** Efficiently calculates cumulative heights via `createMemo`.

5. **Proper Cleanup:**
   - Cleans up observers outside visible range (lines 156-163)
   - Cleans up when items are removed (lines 44-59)
   - Full cleanup on unmount (lines 184-188)

6. **Empty Array Handling:** Explicitly handles empty arrays (lines 114-123).

7. **DOM Connection Check:** Verifies `el.isConnected` before updating size (line 72).

8. **Scroll-to-Index:** Returns calculated position for dynamic heights.

---

## Algorithm Analysis

```
1. Track individual item heights via ResizeObserver → sizeMap
2. Calculate average height from measured items
3. Build prefix sum array of heights (cumulative offsets)
4. Binary search to find first visible item
5. Linear scan to find last visible item (could optimize)
6. Clean up observers outside visible range
```

---

## Performance Characteristics

| Operation          | Complexity | Notes                     |
| ------------------ | ---------- | ------------------------- |
| Find first visible | O(log n)   | Binary search             |
| Find last visible  | O(v)       | Linear, v = visible count |
| Height lookup      | O(1)       | Map access                |
| Prefix calculation | O(n)       | On item/size change       |

---

## Recommendations

1. Add comprehensive JSDoc documentation
2. Export config and result types
3. Extract binary search to utility
4. Consider caching prefix heights more aggressively
5. Add option to disable auto-cleanup for stable lists

---

## Test Coverage Needed

- [ ] Correct visible items with varying heights
- [ ] Height measurement via ResizeObserver
- [ ] Average height calculation
- [ ] Binary search correctness
- [ ] Observer cleanup on scroll
- [ ] Observer cleanup on item removal
- [ ] scrollToIndex with dynamic heights
- [ ] Empty array handling
- [ ] Performance with large lists (1000+ items)
