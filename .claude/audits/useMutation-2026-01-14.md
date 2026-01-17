# Hook Audit: useMutation

**Date:** 2026-01-14
**File:** `src/hooks/useMutation.tsx`
**Lines:** 86

---

## Executive Summary

`useMutation` is a data mutation hook that handles async operations with loading state, error handling, and success/error callbacks. It's well-typed with generics and follows good patterns, but has some areas for improvement.

**Overall Score: 84/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                           |
| ---------------------- | ----- | --- | ----------------------------------------------- |
| TypeScript Correctness | 22    | 25  | Good generic usage, minor improvements possible |
| SolidJS Best Practices | 22    | 25  | Uses signals correctly, no createResource       |
| API Design             | 13    | 15  | Clean API, URL templating is nice               |
| Error Handling         | 12    | 15  | Catches errors, but typing could improve        |
| Performance            | 10    | 10  | Minimal overhead                                |
| Documentation          | 5     | 10  | Interfaces documented but no JSDoc              |

---

## Issues Found

### Medium Severity

#### 1. Error Type Could Be Generic

**Location:** Lines 5-6, 33

```typescript
onError?: (error: Error, arg: TArg) => void;
const [error, setError] = createSignal<Error | undefined>();
```

**Problem:** Error is always typed as `Error`, but APIs might return custom error shapes.
**Recommendation:** Consider a generic error type:

```typescript
export interface MutationOptions<TData, TArg, TError = Error> {
  onError?: (error: TError, arg: TArg) => void;
}
```

#### 2. Missing JSDoc Documentation

**Location:** Line 30

```typescript
export function useMutation<TData = unknown, TArg = unknown>(
```

**Recommendation:**

````typescript
/**
 * Hook for performing data mutations with loading state and callbacks.
 *
 * @template TData - The type of data returned from the mutation
 * @template TArg - The type of argument passed to the mutation
 * @param props - Mutation configuration including URL and options
 * @returns Mutation object with data, error, loading state, and trigger function
 *
 * @example
 * ```tsx
 * const { trigger, isMutating, error } = useMutation({
 *   urlString: '/api/users/{id}',
 *   options: {
 *     fetcher: async (url, data) => {
 *       const res = await fetch(url, { method: 'POST', body: JSON.stringify(data) });
 *       return res.json();
 *     },
 *     onSuccess: (data) => console.log('Created:', data),
 *   },
 * });
 *
 * // Trigger with URL parameters
 * await trigger({ name: 'John' }, { id: '123' });
 * ```
 */
````

#### 3. URL String Could Be Accessor Only

**Location:** Lines 26, 47-56

```typescript
urlString: string | Accessor<string>;
```

**Problem:** Supporting both types adds complexity. The accessor pattern is more SolidJS-idiomatic.
**Consideration:** Keep for flexibility, but document when to use each.

### Low Severity

#### 4. setError Called Without Argument

**Location:** Line 45

```typescript
setError();
```

**Problem:** While this works (sets to `undefined`), it's clearer to be explicit:

```typescript
setError(undefined);
```

#### 5. Variable Shadow in urlString

**Location:** Lines 47-56

```typescript
const urlString = () => {
  let urlString: string;
```

**Problem:** Inner variable shadows the outer function name.
**Recommendation:** Rename inner variable:

```typescript
const getUrl = () => {
  let url: string;
```

---

## Positive Findings

1. **Well-Typed Generics:** `TData` and `TArg` provide full type safety.
2. **URL Templating:** Built-in support for `{param}` replacement.
3. **Dual Callback Support:** Supports both hook-level and trigger-level callbacks.
4. **Clean State Management:** Properly resets loading state on completion.
5. **Promise Return:** `trigger` returns the data, enabling `await`.

---

## API Surface

```typescript
interface Mutation<TData, TArg> {
  data: Accessor<TData | undefined>;
  error: Accessor<Error | undefined>;
  isMutating: Accessor<boolean>;
  trigger: (
    arg: TArg,
    urlArgs?: Record<string, string>,
    options?: TriggerOptions,
  ) => Promise<TData>;
}
```

---

## Recommendations

1. Add comprehensive JSDoc documentation
2. Consider generic error type parameter
3. Fix variable shadowing
4. Make `setError(undefined)` explicit
5. Add request cancellation support via AbortController

---

## Test Coverage Needed

- [ ] Successful mutation returns data
- [ ] Failed mutation sets error state
- [ ] isMutating reflects loading state
- [ ] URL parameter substitution works
- [ ] onSuccess callback fires on success
- [ ] onError callback fires on failure
- [ ] Trigger-level callbacks work
- [ ] Accessor URL string is reactive
