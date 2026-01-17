# Hook Audit: useCustomResource

**Date:** 2026-01-14
**File:** `src/hooks/useCustomResource.tsx`
**Lines:** 312

---

## Executive Summary

`useCustomResource` is a sophisticated data fetching hook that implements SWR (stale-while-revalidate) pattern with advanced features like request deduplication, retry logic with exponential backoff, and IndexedDB caching. The implementation is well-structured but has some areas for improvement in TypeScript strictness and documentation.

**Overall Score: 78/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                                             |
| ---------------------- | ----- | --- | ----------------------------------------------------------------- |
| TypeScript Correctness | 18    | 25  | Generic types well used, but some `unknown` and unsafe assertions |
| SolidJS Best Practices | 22    | 25  | Excellent use of createResource, createEffect, onCleanup          |
| API Design             | 12    | 15  | Comprehensive API, could use better documentation                 |
| Error Handling         | 10    | 15  | Good retry logic, but error typing could be stricter              |
| Performance            | 10    | 10  | Efficient with deduplication and caching                          |
| Documentation          | 6     | 10  | Missing JSDoc comments                                            |

---

## Issues Found

### High Severity

#### 1. Unsafe Type Assertion for Context

**Location:** Line 61

```typescript
const context = useContext(CustomResourceContext) as CustomResourceContextProps<T>;
```

**Problem:** Using `as` assertion bypasses TypeScript's type checking. The context could be undefined.
**Recommendation:** Use a type guard or throw before assertion:

```typescript
const context = useContext(CustomResourceContext);
if (!context) throw new Error('...');
// context is now properly typed
```

#### 2. Timer Type Mismatch

**Location:** Line 99, 265

```typescript
const retryTimers = new Set<number>();
const timer = window.setTimeout(...);
```

**Problem:** `window.setTimeout` returns `number` in browsers but Node types return `NodeJS.Timeout`. Using `window.setTimeout` explicitly is correct but inconsistent with other files.

### Medium Severity

#### 3. Missing JSDoc Documentation

**Location:** Throughout
**Problem:** No JSDoc comments for the hook, its parameters, or return type.
**Recommendation:** Add comprehensive documentation:

```typescript
/**
 * Custom resource hook implementing SWR pattern with caching and retry logic.
 * @template T - The type of data being fetched
 * @param props - Hook configuration options
 * @returns CustomResource object with data accessors and control methods
 */
```

#### 4. Error Type is `unknown`

**Location:** Line 21

```typescript
error: Accessor<unknown>;
```

**Problem:** Using `unknown` for error type loses type information.
**Recommendation:** Use `Error | null` or a custom error type.

#### 5. Resource Data Signal Initialization

**Location:** Line 55

```typescript
const [resourceData, setResourceData] = createSignal<T>();
```

**Problem:** Signal is initialized as `undefined` but the type `T` might not include `undefined`.
**Recommendation:** Make it explicit: `createSignal<T | undefined>(undefined)`

### Low Severity

#### 6. Magic Numbers

**Location:** Lines 258-259

```typescript
Math.pow(2, currentAttempts) + Math.random() * 500;
```

**Problem:** Magic numbers for jitter (500ms) not configurable.
**Recommendation:** Add `jitterMax` option or document the behavior.

#### 7. Exported Interface Naming

**Location:** Lines 19-48
**Problem:** `CustomResourceProps` is exported but the return type interface `CustomResource` should also be prominently documented.

---

## Positive Findings

1. **Excellent SWR Implementation:** The hook correctly implements stale-while-revalidate with proper state management for validating state.

2. **Request Deduplication:** Smart deduplication with configurable interval prevents unnecessary network requests.

3. **Retry with Exponential Backoff:** Well-implemented retry logic with configurable attempts, delay, and exponential backoff.

4. **Proper Cleanup:** Uses `onCleanup` to clear retry timers, preventing memory leaks.

5. **IndexedDB Caching:** Integrates with IndexedDB for persistent caching, allowing offline-first capabilities.

6. **Flexible Configuration:** Merges hook-level options with context-level defaults elegantly.

7. **Error Blacklist:** Allows configuring which error codes should not trigger retries.

---

## Architecture Notes

The hook follows a layered architecture:

1. **Context Layer:** Gets default options from `CustomResourceProvider`
2. **Hook Layer:** Merges options and manages local state
3. **Fetcher Layer:** Wraps the actual fetch with caching and deduplication

This separation allows for global defaults while permitting per-hook overrides.

---

## Recommendations

1. Add comprehensive JSDoc documentation
2. Create a custom error type for better error handling
3. Make jitter configurable
4. Export all relevant types for consumers
5. Consider adding request cancellation via AbortController

---

## Test Coverage Needed

- [ ] Basic fetch functionality
- [ ] SWR behavior (stale data shown while revalidating)
- [ ] Retry logic with exponential backoff
- [ ] Request deduplication
- [ ] Cache hit/miss scenarios
- [ ] Error handling and error blacklist
- [ ] Context requirement validation
- [ ] Cleanup on unmount
