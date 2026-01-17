# Context Audit: IntlContext

**Date:** 2026-01-14
**File:** `src/context/IntlContext.tsx`
**Lines:** 27

---

## Executive Summary

`IntlContext` is a minimal wrapper around FormatJS's `createIntl`, providing internationalization capabilities throughout the application. The implementation is clean and focused, leveraging a well-established i18n library.

**Overall Score: 86/100**

---

## Scoring Breakdown

| Dimension              | Score | Max | Notes                                |
| ---------------------- | ----- | --- | ------------------------------------ |
| TypeScript Correctness | 23    | 25  | Uses IntlShape from FormatJS         |
| SolidJS Best Practices | 22    | 25  | Reactive getters, could memoize intl |
| API Design             | 14    | 15  | Simple, clean interface              |
| Integration            | 15    | 15  | Proper FormatJS integration          |
| Documentation          | 12    | 20  | Minimal documentation                |

---

## Issues Found

### Medium Severity

#### 1. Missing JSDoc Documentation

**Location:** Line 7-10

```typescript
export const IntlProvider: ParentComponent<{
  locale: string;
  messages: Record<string, string>;
}> = (props) => {
```

**Recommendation:**

````typescript
/**
 * Provider for FormatJS internationalization.
 * Wraps children with IntlContext providing formatting methods.
 *
 * @param props.locale - Locale identifier (e.g., 'en-US', 'fr-FR')
 * @param props.messages - Key-value map of translated messages
 *
 * @example
 * ```tsx
 * import messages from './locales/en.json';
 *
 * <IntlProvider locale="en-US" messages={messages}>
 *   <App />
 * </IntlProvider>
 * ```
 *
 * @example Using with useIntl hook
 * ```tsx
 * const intl = useIntl();
 * const greeting = intl.formatMessage({ id: 'greeting' });
 * const date = intl.formatDate(new Date(), { dateStyle: 'long' });
 * ```
 */
````

#### 2. Intl Object Recreated on Every Render

**Location:** Lines 12-22

```typescript
const intl = createIntl(
  {
    get locale() {
      return props.locale;
    },
    get messages() {
      return props.messages;
    },
  },
  cache,
);
```

**Problem:** While `createIntlCache` helps, `createIntl` is called on every provider render.
**Recommendation:** Consider memoizing:

```typescript
const intl = createMemo(() =>
  createIntl({ locale: props.locale, messages: props.messages }, cache)
);

return <IntlContext.Provider value={intl()}>{props.children}</IntlContext.Provider>;
```

### Low Severity

#### 3. No Default Value for Context

**Location:** Line 5

```typescript
export const IntlContext = createContext<IntlShape>();
```

**Problem:** Context has no default, requiring provider.
**Note:** This is intentional (app should always have IntlProvider), but could document.

#### 4. Cache Created Per Provider Instance

**Location:** Line 11

```typescript
const cache = createIntlCache();
```

**Problem:** Each IntlProvider instance creates its own cache.
**Note:** Usually there's only one IntlProvider, so this is fine.

---

## Positive Findings

1. **Proper FormatJS Integration:** Uses `createIntl` and `createIntlCache` correctly.

2. **Reactive Props:** Uses getter pattern for reactive locale and messages.

3. **Type Safety:** Uses `IntlShape` type from FormatJS for full type coverage.

4. **Cache Usage:** Implements FormatJS cache for formatter memoization.

5. **Minimal Footprint:** Only 27 lines, does one thing well.

---

## FormatJS Features Available

Through the `IntlShape` object:

- `formatMessage()` - Translate message IDs with interpolation
- `formatDate()` - Locale-aware date formatting
- `formatTime()` - Locale-aware time formatting
- `formatNumber()` - Number formatting with locale
- `formatRelativeTime()` - "2 days ago" style formatting
- `formatDisplayName()` - Language/region display names
- `formatList()` - "A, B, and C" style formatting

---

## Integration Example

```tsx
// Setup
<IntlProvider locale={locale()} messages={messages[locale()]}>
  <App />
</IntlProvider>;

// Usage in component
const intl = useIntl();
const welcomeMessage = intl.formatMessage(
  { id: 'welcome', defaultMessage: 'Hello, {name}!' },
  { name: userName() },
);
```

---

## Recommendations

1. Add comprehensive JSDoc with examples
2. Consider memoizing intl object
3. Add example message file format in docs
4. Consider exporting `createIntlCache` for advanced use cases

---

## Test Coverage Needed

- [ ] Provider makes intl available to children
- [ ] formatMessage works with interpolation
- [ ] Locale changes update formatting
- [ ] Message changes update translations
- [ ] Date/number formatting respects locale
