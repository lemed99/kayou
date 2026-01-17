# Context Audit: CustomResourceContext

**Date:** 2026-01-14
**File:** `src/context/CustomResourceContext.tsx`
**Lines:** 80

---

## Executive Summary

`CustomResourceContext` provides global configuration for the `useCustomResource` hook, including default retry behavior, deduplication settings, and fetcher customization. The implementation is clean but lacks proper typing for the context value and documentation.

**Overall Score: 80/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                  |
| ---------------------- | ----- | --- | -------------------------------------- |
| TypeScript Correctness | 18    | 25  | Context created without type parameter |
| SolidJS Best Practices | 22    | 25  | Good reactive getter pattern           |
| API Design             | 13    | 15  | Sensible defaults, flexible options    |
| Error Handling         | 12    | 15  | Error handled in consumer hook         |
| Documentation          | 15    | 20  | Interfaces defined but no JSDoc        |

---

## Issues Found

### High Severity

#### 1. Untyped Context Creation

**Location:** Line 27

```typescript
export const CustomResourceContext = createContext();
```

**Problem:** Context created without type parameter makes it `Context<unknown>`.
**Recommendation:**

```typescript
export interface CustomResourceContextValue<T = unknown> {
  options: ResourceOptions<T>;
  pendingRequests: Map<string, PendingEntry<T>>;
  refreshData: Accessor<Record<string, boolean>> | null;
  baseUrl: string | undefined;
}

export const CustomResourceContext = createContext<CustomResourceContextValue>();
```

### Medium Severity

#### 2. Missing JSDoc Documentation

**Location:** Throughout
**Recommendation:**

````typescript
/**
 * Context for configuring useCustomResource behavior globally.
 * Provides default options that can be overridden per-hook.
 */
export const CustomResourceContext = createContext<CustomResourceContextValue>();

/**
 * Provider component for CustomResource configuration.
 *
 * @example
 * ```tsx
 * <CustomResourceProvider
 *   baseUrl="https://api.example.com"
 *   retryCount={3}
 *   dedupeInterval={5000}
 *   refreshData={() => refreshSignal()}
 * >
 *   <App />
 * </CustomResourceProvider>
 * ```
 */
export const CustomResourceProvider: ParentComponent<...> = (props) => {
````

#### 3. Default Error Blacklist Is Aggressive

**Location:** Line 44

```typescript
return props.errorsBlackList ?? [404, 500, 400, 401, 403];
```

**Problem:** Blacklisting 400, 401, 403 means auth errors and validation errors won't retry, which may be desired, but 500 (server error) typically should retry.
**Recommendation:** Document the reasoning or adjust defaults:

```typescript
// Default: Don't retry client errors, do retry server errors
return props.errorsBlackList ?? [400, 401, 403, 404];
```

### Low Severity

#### 4. pendingRequests Map Never Cleaned

**Location:** Line 32

```typescript
const pendingRequests = new Map<string, PendingEntry<unknown>>();
```

**Problem:** Map lives for the lifetime of the provider, entries might accumulate.
**Note:** Individual entries are cleaned up by timeout in the hook, but a periodic cleanup might be beneficial for long-lived apps.

#### 5. baseUrl Could Validate Format

**Location:** Line 71-73

```typescript
get baseUrl() {
  return props.baseUrl;
},
```

**Problem:** No validation that baseUrl doesn't end with `/` (would cause double slashes).
**Recommendation:** Add warning or normalization:

```typescript
get baseUrl() {
  const url = props.baseUrl;
  return url?.endsWith('/') ? url.slice(0, -1) : url;
}
```

---

## Positive Findings

1. **Reactive Getters:** Uses getter pattern for reactive props access.

2. **Sensible Defaults:**
   - 3 retry attempts
   - 2 second retry delay
   - Exponential backoff enabled
   - Request deduplication enabled

3. **Flexible Configuration:** All options can be overridden at hook level.

4. **Request Deduplication:** Shared `pendingRequests` Map prevents duplicate concurrent requests.

5. **Interface Exports:** `ResourceOptions`, `PendingEntry`, and `CustomResourceProviderProps` are exported.

---

## Default Configuration

| Option             | Default               | Description                        |
| ------------------ | --------------------- | ---------------------------------- |
| retryCount         | 3                     | Maximum retry attempts             |
| retryDelay         | 2000ms                | Base delay between retries         |
| exponentialBackoff | true                  | Double delay on each retry         |
| errorsBlackList    | [404,500,400,401,403] | Don't retry these status codes     |
| dedupeRequests     | true                  | Deduplicate concurrent requests    |
| dedupeInterval     | 2000ms                | Reuse responses within this window |

---

## Recommendations

1. Add type parameter to `createContext`
2. Add comprehensive JSDoc documentation
3. Review error blacklist defaults
4. Consider baseUrl normalization
5. Add optional periodic cleanup for pendingRequests

---

## Test Coverage Needed

- [ ] Default options are applied
- [ ] Custom options override defaults
- [ ] Reactive props update context
- [ ] pendingRequests shared across hooks
- [ ] baseUrl is prepended correctly
- [ ] refreshData triggers re-fetches
