# Hook Audit: useFloating

**Date:** 2026-01-14
**File:** `src/hooks/useFloating/index.tsx`
**Lines:** 209 (main file) + 70 (types.ts) + utils.ts

---

## Executive Summary

`useFloating` is a positioning hook for floating UI elements (dropdowns, tooltips, popovers). It handles viewport containment, scroll containers, arrow positioning, and flip behavior. The implementation is well-organized across multiple files with good type definitions.

**Overall Score: 85/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                           |
| ---------------------- | ----- | --- | ----------------------------------------------- |
| TypeScript Correctness | 22    | 25  | Excellent type definitions in types.ts          |
| SolidJS Best Practices | 22    | 25  | Good signal/effect usage                        |
| API Design             | 14    | 15  | Clean return interface                          |
| Performance            | 12    | 15  | ResizeObserver used, some optimization possible |
| Documentation          | 15    | 20  | Types well-documented, JSDoc missing            |

---

## Issues Found

### Medium Severity

#### 1. Missing JSDoc Documentation

**Location:** Line 22 (index.tsx)

```typescript
export function useFloating(options: UseFloatingOptions): UseFloatingReturn {
```

**Recommendation:**

````typescript
/**
 * Hook for positioning floating elements relative to a reference element.
 * Handles viewport boundaries, scroll containers, and automatic repositioning.
 *
 * @param options - Configuration options
 * @param options.placement - Preferred placement (e.g., 'bottom-start')
 * @param options.offset - Distance from reference element in pixels
 * @param options.isOpen - Accessor indicating if floating element is visible
 * @param options.renderArrow - Whether to calculate arrow position
 * @param options.arrowAlignment - Arrow alignment ('start', 'center', 'end')
 * @param options.arrowOffset - Additional arrow offset
 *
 * @returns Object with styles, refs, and update function
 *
 * @example
 * ```tsx
 * const { refs, floatingStyles, placement } = useFloating({
 *   placement: 'bottom-start',
 *   offset: 8,
 *   isOpen: () => isOpen(),
 * });
 *
 * <button ref={refs.setReference}>Trigger</button>
 * <div ref={refs.setFloating} style={floatingStyles()}>Content</div>
 * ```
 */
````

#### 2. update() Called Multiple Times

**Location:** Lines 139-169

```typescript
createEffect(() => {
  if (!options.isOpen()) return;
  update();
  // ... ResizeObserver setup
});
```

**Problem:** `update()` is called in effect, and also by ResizeObserver callback, potentially causing unnecessary recalculations.
**Recommendation:** Debounce ResizeObserver callback or batch updates.

#### 3. Potential Memory Leak with preventBackgroundScroll

**Location:** Lines 139-143

```typescript
createEffect(() => {
  if (isFixed() && options.isOpen() && floating()) {
    preventBackgroundScroll(floating()!);
  }
});
```

**Problem:** No cleanup for `preventBackgroundScroll`.
**Recommendation:** Ensure the helper has cleanup or add `onCleanup`.

### Low Severity

#### 4. Magic Numbers

**Location:** Line 37

```typescript
offset = 8,
```

**Problem:** Default values should be named constants.
**Recommendation:**

```typescript
const DEFAULT_OFFSET = 8;
```

#### 5. Excessive Re-renders with isFixed Signal

**Location:** Lines 57-92

```typescript
setIsFixed(true);
// ... used multiple places
```

**Problem:** `isFixed` is set in multiple places during a single update.
**Recommendation:** Compute once and set once.

---

## Positive Findings

1. **Well-Organized File Structure:**
   - `index.tsx` - Main hook logic
   - `types.ts` - Type definitions
   - `utils.ts` - Pure computation functions

2. **Comprehensive Placement Support:** 12 placement options (top/bottom/left/right × start/center/end).

3. **Scroll Container Detection:** Properly finds and handles scrollable ancestors.

4. **Fixed Position Fallback:** Falls back to fixed positioning when container can't contain.

5. **Arrow Support:** Optional arrow positioning with configurable alignment.

6. **ResizeObserver Integration:** Recomputes position when elements resize.

7. **Clean Type Definitions:** All types exported and well-structured in types.ts.

---

## Types Analysis (types.ts)

Well-defined types include:

- `Placement` - 12 placement options
- `Side` / `Alignment` - Building blocks
- `FloatingPosition` / `ArrowPosition` - Position results
- `Dimensions` / `Rect` - Measurement types
- `UseFloatingOptions` / `UseFloatingReturn` - Hook interface

---

## API Surface

```typescript
interface UseFloatingReturn {
  floatingStyles: Accessor<JSX.CSSProperties>;
  arrowStyles: Accessor<JSX.CSSProperties | null>;
  placement: Accessor<Placement>;
  update: () => void;
  container: Accessor<Node>;
  refs: {
    setReference: (el) => void;
    setFloating: (el) => void;
    setArrow: (el) => void;
    reference: Accessor<HTMLElement | null>;
    floating: Accessor<HTMLElement | null>;
    arrow: Accessor<HTMLElement | null>;
  };
}
```

---

## Recommendations

1. Add comprehensive JSDoc documentation
2. Extract default values to named constants
3. Debounce ResizeObserver callbacks
4. Consolidate isFixed calculations
5. Ensure preventBackgroundScroll has cleanup
6. Consider adding scroll listeners for auto-update

---

## Test Coverage Needed

- [ ] Basic positioning for all 12 placements
- [ ] Viewport boundary flip behavior
- [ ] Scroll container detection
- [ ] Fixed position fallback
- [ ] Arrow positioning
- [ ] ResizeObserver triggers update
- [ ] Cleanup on unmount
- [ ] Performance with frequent updates
