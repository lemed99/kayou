# Context Audit: ToastContext

**Date:** 2026-01-14
**File:** `src/context/ToastContext.tsx`
**Lines:** 421

---

## Executive Summary

`ToastContext` is a comprehensive toast notification system with support for multiple positions, pause-on-hover, dynamic height calculations, and custom toast methods via Proxy. The implementation is sophisticated, handling complex animation and positioning logic while maintaining a clean API.

**Overall Score: 82/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                   |
| ---------------------- | ----- | --- | --------------------------------------- |
| TypeScript Correctness | 20    | 25  | Good types, some `any` via Proxy        |
| SolidJS Best Practices | 21    | 25  | Good store usage, some patterns unusual |
| API Design             | 14    | 15  | Elegant Proxy-based API                 |
| Animation/UX           | 13    | 15  | Smooth transitions, complex positioning |
| Documentation          | 14    | 20  | Types documented, JSDoc sparse          |

---

## Issues Found

### High Severity

#### 1. Timer Type Compatibility

**Location:** Line 232

```typescript
const timers = new Map<string, NodeJS.Timeout>();
```

**Problem:** Using `NodeJS.Timeout` instead of `ReturnType<typeof setTimeout>` or `number`.
**Recommendation:**

```typescript
const timers = new Map<string, ReturnType<typeof setTimeout>>();
```

### Medium Severity

#### 2. Missing JSDoc Documentation

**Location:** Line 211

```typescript
export const ToastProvider = (props: ToastProviderProps) => {
```

**Recommendation:**

````typescript
/**
 * Provider for toast notification system.
 * Supports multiple positions, pause-on-hover, and customizable toast types.
 *
 * @param props.position - Default position for toasts (e.g., 'top-right')
 * @param props.duration - Default display duration in ms (0 for persistent)
 * @param props.pauseOnHover - Whether to pause timer on hover
 * @param props.gutter - Space between toasts in pixels
 * @param props.methods - Object mapping method names to toast components
 *
 * @example
 * ```tsx
 * const toastMethods = {
 *   success: (props) => <SuccessToast {...props} />,
 *   error: (props) => <ErrorToast {...props} />,
 * };
 *
 * <ToastProvider methods={toastMethods}>
 *   <App />
 * </ToastProvider>
 *
 * // Usage
 * const toast = useToast();
 * toast.success('Operation completed!');
 * toast.error('Something went wrong', { duration: 5000 });
 * ```
 */
````

#### 3. Complex Height Calculation Logic

**Location:** Lines 131-151

```typescript
createEffect(() => {
  if (toastRef() && !toast.height) {
    const toastHeight = toastRef()!.getBoundingClientRect().height / 0.6;
    // ... complex positioning logic
  }
});
```

**Problem:**

- Magic number `0.6` (scale factor) is not documented
- Mutating multiple toasts in a single effect is complex
  **Recommendation:** Extract height calculation and document the scale factor:

```typescript
const INITIAL_SCALE = 0.6;
// Height is measured at scale 0.6, so divide by scale to get actual height
const actualHeight = measuredHeight / INITIAL_SCALE;
```

#### 4. Proxy Type Safety

**Location:** Lines 366-384

```typescript
const api = new Proxy({ dismiss, pause, play } as ToastAPIBase, {
  get(target, prop) {
    // Dynamic property access loses type safety
  },
}) as ToastAPI;
```

**Problem:** Proxy-based API has limited TypeScript support.
**Note:** This is a tradeoff for the elegant API design.

### Low Severity

#### 5. ToastComponentWrapper Is Not a Component

**Location:** Lines 104-187

```typescript
const ToastComponentWrapper = (toast: Toast, context: ToastContextValue) => {
```

**Problem:** Using a function that returns JSX but isn't typed as a component.
**Recommendation:** Either make it a proper component or document the pattern:

```typescript
const ToastComponentWrapper: Component<{toast: Toast, context: ToastContextValue}> = (props) => {
```

#### 6. reconcile Used for Simple Update

**Location:** Line 264

```typescript
setToasts(reconcile(toasts.map((t, i) => ({ ... }))));
```

**Note:** `reconcile` is heavy; for simple index-based updates, `produce` might be more efficient.

---

## Positive Findings

1. **Elegant Proxy API:** Dynamic methods based on configured toast types.

2. **Pause-on-Hover:** Properly pauses timer and resumes with remaining time.

3. **Position Support:** 6 position options with proper CSS positioning.

4. **Animation Integration:** Uses `@solid-primitives/presence` for smooth transitions.

5. **Height-Based Stacking:** Dynamically positions based on actual toast heights.

6. **Timer Management:** Proper cleanup of timers on unmount and dismiss.

7. **Flexible Configuration:** Per-toast options override global defaults.

8. **Portal Rendering:** Uses `Portal` for proper z-index stacking.

---

## Toast Lifecycle

```
1. createToast() → Creates toast object with unique ID
2. Add to store → Triggers render with scale 0.6
3. Measure height → Adjust position of all toasts
4. Animate in → Scale to 1.0, opacity to 1
5. Timer runs → Or pauses on hover
6. dismiss() → Set dismissedAt, animate out
7. remove() → Remove from store after animation
```

---

## API Surface

```typescript
// Provider props
interface ToastProviderProps {
  position?: ToastPosition;
  duration?: number;
  pauseOnHover?: boolean;
  gutter?: number;
  methods: ToastMethods;
}

// Consumer API
const toast = useToast();
toast.success(message, options?);  // Dynamic based on methods
toast.error(message, options?);    // Dynamic based on methods
toast.dismiss(id);
toast.pause(id);
toast.play(id);
```

---

## Recommendations

1. Add comprehensive JSDoc documentation
2. Fix timer type for cross-platform compatibility
3. Document the scale factor magic number
4. Consider simplifying height calculation logic
5. Extract ToastComponentWrapper to proper component
6. Add toast limit option to prevent overflow

---

## Test Coverage Needed

- [ ] Toast creation with default options
- [ ] Toast creation with custom options
- [ ] Dismiss removes toast after animation
- [ ] Pause-on-hover stops timer
- [ ] Play resumes with remaining time
- [ ] Position classes applied correctly
- [ ] Multiple toasts stack properly
- [ ] Timer cleanup on unmount
- [ ] Dynamic methods work via Proxy
- [ ] Height measurement and positioning
