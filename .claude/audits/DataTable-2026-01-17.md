# DataTable Audit Report

**Generated:** 2026-01-17
**Auditor:** Claude (solidjs-component-auditor v2.0.0)
**Component:** `src/components/DataTable.tsx`

---

## Executive Summary

The DataTable component is a complex, feature-rich table implementation with virtualization, pagination, filtering, row selection, and expandable full-view mode. It intentionally uses div-based layout with CSS Grid for maximum flexibility (rather than HTML tables or ARIA table roles, which would impose layout constraints incompatible with virtualization and dynamic content). While it demonstrates good use of SolidJS primitives like `createSignal`, `createMemo`, and `createEffect` with proper cleanup, it has accessibility gaps in individual interactive elements: the search input has no label, keyboard navigation is limited, and the "see more" expander is mouse-only. Additionally, the component uses DOM querying (`document.querySelectorAll`) which is an anti-pattern that can break with multiple instances.

---

## Overall Score: 60/100

### Dimension Breakdown

| Dimension         | Score | Weight | Weighted |
| ----------------- | ----- | ------ | -------- |
| Type Safety       | 20/25 | 25%    | 20       |
| SolidJS Practices | 18/25 | 25%    | 18       |
| API Design        | 6/15  | 15%    | 6        |
| Accessibility     | 8/20  | 20%    | 8        |
| Performance       | 8/10  | 10%    | 8        |
| Testing/Docs      | 2/5   | 5%     | 2        |

### Score Interpretation

**Needs Work** - Critical issues with DOM querying and accessibility of interactive elements require attention.

### Design Note

The component intentionally avoids `role="table"` and related ARIA table roles. This is a valid architectural decision because:

- CSS Grid layout would conflict with table display semantics
- Virtualization (rows appearing/disappearing) doesn't work well with strict table navigation
- Complex interactive content (checkboxes, buttons) benefits from a grid/region approach
- Screen reader table navigation mode can be disorienting for dynamic content

Alternative accessibility approaches (like `role="grid"` or `role="region"` with proper labeling) can be considered based on specific use cases.

---

## Critical Priority Issues (Must Fix)

### Issue 1: Search Input Missing Label

**Severity:** Critical
**Category:** Accessibility
**Line(s):** 301-307

**Current Code:**

```tsx
<input
  ref={setSearchRef}
  value={searchKey()}
  onInput={(e) => setSearchKey(e.target.value)}
  placeholder="Search"
  onFocus={(e) => e.target.select()}
  class="w-full py-3 pl-2 text-sm outline-none"
/>
```

**Problem:**
The search input only has a placeholder, no associated `<label>` or `aria-label`. Placeholders disappear when typing and are not announced by all screen readers. This is a WCAG 2.1 Level A failure (1.3.1, 4.1.2).

**Solution:**

```tsx
<label for="datatable-search" class="sr-only">Search table</label>
<input
  id="datatable-search"
  ref={setSearchRef}
  value={searchKey()}
  onInput={(e) => setSearchKey(e.target.value)}
  placeholder="Search"
  aria-label="Search table data"
  onFocus={(e) => e.target.select()}
  class="w-full py-3 pl-2 text-sm outline-none"
/>
```

**Estimated Effort:** 10 minutes

---

### Issue 2: "See More" Expander Not Keyboard Accessible

**Severity:** Critical
**Category:** Accessibility
**Line(s):** 505-515

**Current Code:**

```tsx
<div
  onClick={() => {
    setPageScroll((ancestor() as Element).scrollTop);
    setFullView(true);
  }}
  class="group flex w-full cursor-pointer items-center justify-center gap-2 ..."
>
  <span>{props.seeMoreText}</span>
  <Maximize01Icon class="size-3 transition-all group-hover:size-4" />
</div>
```

**Problem:**
This interactive element is a `<div>` with only an `onClick` handler. It cannot be focused or activated via keyboard. This is a WCAG 2.1 Level A failure (2.1.1 Keyboard).

**Solution:**

```tsx
<button
  type="button"
  onClick={() => {
    setPageScroll((ancestor() as Element).scrollTop);
    setFullView(true);
  }}
  class="group flex w-full cursor-pointer items-center justify-center gap-2 border-t border-neutral-200 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:border-neutral-700"
  aria-expanded={fullView()}
>
  <span>{props.seeMoreText}</span>
  <Maximize01Icon class="size-3 transition-all group-hover:size-4" aria-hidden="true" />
</button>
```

**Estimated Effort:** 15 minutes

---

### Issue 3: DOM Querying Anti-Pattern

**Severity:** Critical
**Category:** SolidJS Practices
**Line(s):** 192-197

**Current Code:**

```tsx
const minWidth = Math.max(
  ...Array.from(document.querySelectorAll(`[data-column="${col.key}"]`)).map(
    (e) => (e as HTMLElement).offsetWidth,
  ),
);
```

**Problem:**
Using `document.querySelectorAll` to find elements is a global DOM query that will find elements from ALL DataTable instances on the page, not just this one. This causes:

1. Incorrect width calculations when multiple tables exist
2. Performance issues with many elements
3. Breaks the component's encapsulation

**Solution:**
Use refs and track column widths through the component's own state:

```tsx
const [columnWidths, setColumnWidths] = createSignal<Map<string, number>>(new Map());

// In the cell render
<span
  ref={(el) => {
    const currentMax = columnWidths().get(column.key) || 0;
    if (el.offsetWidth > currentMax) {
      setColumnWidths((prev) => new Map(prev).set(column.key, el.offsetWidth));
    }
  }}
  data-column={column.key}
>
  {content}
</span>;

// In the grid style calculation
const minWidth = columnWidths().get(col.key) || 0;
```

**Estimated Effort:** 1 hour

---

## High Priority Issues

### Issue 4: Clear Search Button Missing Accessible Name

**Severity:** High
**Category:** Accessibility
**Line(s):** 310-319

**Current Code:**

```tsx
<button
  type="button"
  onClick={() => {
    setSearchKey('');
    (searchRef() as HTMLElement)?.focus();
  }}
  class="absolute right-0 top-0 h-full cursor-pointer px-3 ..."
>
  <XCloseIcon class="size-4" />
</button>
```

**Problem:**
Icon-only button without `aria-label`. Screen reader users won't know what this button does.

**Solution:**

```tsx
<button
  type="button"
  aria-label="Clear search"
  onClick={() => {
    setSearchKey('');
    searchRef()?.focus();
  }}
  class="..."
>
  <XCloseIcon class="size-4" aria-hidden="true" />
</button>
```

**Estimated Effort:** 5 minutes

---

### Issue 5: Row Selection Checkboxes Need Labels

**Severity:** High
**Category:** Accessibility
**Line(s):** 245-249, 404-406

**Current Code:**

```tsx
<Checkbox
  checked={selectedRows().has(index())}
  onChange={() => toggleSelectRow(index())}
/>

<Checkbox checked={allSelected()} onChange={toggleSelectAll} />
```

**Problem:**
Selection checkboxes have no visible or accessible labels. Screen reader users cannot identify what row they're selecting.

**Solution:**

```tsx
// Header checkbox
<Checkbox
  checked={allSelected()}
  onChange={toggleSelectAll}
  aria-label="Select all rows"
/>

// Row checkbox
<Checkbox
  checked={selectedRows().has(index())}
  onChange={() => toggleSelectRow(index())}
  aria-label={`Select row ${index() + 1}`}
/>
```

**Estimated Effort:** 15 minutes

---

### Issue 6: Missing Loading/Error Announcements

**Severity:** High
**Category:** Accessibility
**Line(s):** 440-465

**Current Code:**

```tsx
<Show when={props.loading}>
  <div class="grid bg-white dark:bg-neutral-800" ...>
    {/* Skeleton loaders */}
  </div>
</Show>
<Show when={props.error}>
  <div class="px-6 py-4 text-center font-medium whitespace-nowrap text-red-600">
    {props.errorMessage}
  </div>
</Show>
```

**Problem:**
Loading and error states are not announced to screen reader users. They won't know the table is loading or that an error occurred.

**Solution:**

```tsx
<Show when={props.loading}>
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading table data"
    class="grid bg-white dark:bg-neutral-800"
    ...
  >
    {/* Skeleton loaders */}
  </div>
</Show>
<Show when={props.error}>
  <div
    role="alert"
    class="px-6 py-4 text-center font-medium whitespace-nowrap text-red-600"
  >
    {props.errorMessage}
  </div>
</Show>
```

**Estimated Effort:** 10 minutes

---

### Issue 7: No splitProps or Rest Props Spreading

**Severity:** High
**Category:** API Design
**Line(s):** 109-111

**Current Code:**

```tsx
export function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>,
): JSX.Element {
```

**Problem:**
The component doesn't use `splitProps` and doesn't spread rest props to the root element. This prevents consumers from adding custom HTML attributes, data attributes, or event handlers to the table container.

**Solution:**

```tsx
export function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T> & JSX.HTMLAttributes<HTMLDivElement>,
): JSX.Element {
  const [local, others] = splitProps(props, [
    'data',
    'loading',
    'validating',
    'defaultColumns',
    'defaultRowsCount',
    'columns',
    'pageTotal',
    'rowSelection',
    'error',
    'onPageChange',
    'searchBar',
    'configureColumns',
    'expandable',
    'filters',
    'perPageControl',
    'rowHeight',
    'estimatedRowHeight',
    'errorMessage',
    'noDataMessage',
    'seeMoreText',
    'filtersText',
    'elementsPerPageText',
    'selectedElementsText',
    'footer',
  ]);

  // Use local.data, local.loading, etc.
  // Spread others on root element
  return <div {...others}>{/* Table content */}</div>;
}
```

**Estimated Effort:** 30 minutes

---

## Medium Priority Issues

### Issue 8: Hardcoded Filter Count

**Severity:** Medium
**Category:** API Design
**Line(s):** 337-339

**Current Code:**

```tsx
<span class="ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 p-2.5 text-xs font-medium text-white">
  {2}
</span>
```

**Problem:**
The filter count is hardcoded to `2`. This should be calculated from the actual active filters or passed as a prop.

**Solution:**

```tsx
// Add to DataTableProps
activeFilterCount?: number;

// In render
<span class="...">
  {props.activeFilterCount ?? 0}
</span>
```

**Estimated Effort:** 10 minutes

---

### Issue 9: Typo in Variable Name

**Severity:** Medium
**Category:** Code Quality
**Line(s):** 182-186

**Current Code:**

```tsx
const sharedPurcentage = () => {
  const allColumnsPurcentage = props.columns.reduce((acc, v) => acc + v.width, 0);
  const displayedColumnsPurcentage = columns().reduce((acc, v) => acc + v.width, 0);
  return (allColumnsPurcentage - displayedColumnsPurcentage) / columns().length;
};
```

**Problem:**
"Purcentage" should be "Percentage". This affects code readability and maintainability.

**Solution:**

```tsx
const sharedPercentage = () => {
  const allColumnsPercentage = props.columns.reduce((acc, v) => acc + v.width, 0);
  const displayedColumnsPercentage = columns().reduce((acc, v) => acc + v.width, 0);
  return (allColumnsPercentage - displayedColumnsPercentage) / columns().length;
};
```

**Estimated Effort:** 5 minutes

---

### Issue 10: Missing class Prop Support

**Severity:** Medium
**Category:** API Design
**Line(s):** 54-103

**Problem:**
The `DataTableProps` interface doesn't include a `class` prop for custom styling of the root container.

**Solution:**

```tsx
export interface DataTableProps<T> {
  // ... existing props
  /** Custom class name for the table container. */
  class?: string;
}

// In Table component
<div
  ref={setTableRef}
  class={twMerge(
    'flex w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white',
    fullView() ? 'mt-2 h-[calc(100%-8px)]' : 'h-auto',
    props.class
  )}
>
```

**Estimated Effort:** 10 minutes

---

### Issue 11: Validating Overlay Lacks Announcement

**Severity:** Medium
**Category:** Accessibility
**Line(s):** 469-473

**Current Code:**

```tsx
<Show when={props.validating}>
  <div class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-white/60">
    <Spinner />
  </div>
</Show>
```

**Problem:**
The validating state is not announced to screen reader users.

**Solution:**

```tsx
<Show when={props.validating}>
  <div
    class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-white/60"
    role="status"
    aria-live="polite"
  >
    <Spinner aria-label="Refreshing data" />
  </div>
</Show>
```

**Estimated Effort:** 10 minutes

---

## Low Priority Issues

### Issue 12: Could Use Index Instead of For

**Severity:** Low
**Category:** SolidJS Practices
**Line(s):** 409-428, 452-458

**Current Code:**

```tsx
<For each={columns()}>
  {(column) => (
    <div class="flex items-center gap-1 whitespace-nowrap px-6 py-3">{/* ... */}</div>
  )}
</For>
```

**Problem:**
When columns change (via column configuration), the entire list re-renders. Using `Index` would be more efficient when the list items don't change frequently but positions might.

**Note:** This is minor since columns rarely change during normal use.

**Estimated Effort:** 15 minutes

---

### Issue 13: Missing aria-sort for Sortable Columns

**Severity:** Low
**Category:** Accessibility
**Line(s):** 409-428

**Problem:**
If sorting is ever added, columns should have `aria-sort` attributes. Currently no sorting feature exists, but the header structure should support it.

**Estimated Effort:** 30 minutes (when implementing sorting)

---

## Positive Observations

1. **Intentional Architecture** - Div-based layout with CSS Grid is a deliberate choice for flexibility with virtualization and complex interactive content

2. **Good TypeScript Usage** - Generic component with proper type constraints `<T extends Record<string, unknown>>`

3. **Proper Effect Cleanup** - ResizeObserver is properly disconnected in `onCleanup` (line 213)

4. **Smart Virtualization** - Supports both fixed-height (`VirtualList`) and dynamic-height (`DynamicVirtualList`) virtualization

5. **Memoized Computations** - Uses `createMemo` for derived state like `filteredData`, `allSelected`, `defaultRowsCount`

6. **Good JSDoc Documentation** - Props interfaces have descriptive JSDoc comments

7. **Dark Mode Support** - Consistent dark mode classes throughout

8. **Responsive Footer** - Footer uses responsive flexbox for mobile/desktop layouts

---

## Recommendations Summary

### Immediate Actions (Before Production)

1. Add accessible label to search input
2. Convert "see more" div to a button
3. Fix DOM querying anti-pattern with refs
4. Add `aria-label` to icon-only buttons

### Short-term Improvements

1. Add labels to selection checkboxes
2. Add `aria-live` regions for loading/error states
3. Implement `splitProps` and rest props spreading
4. Add `class` prop support
5. Fix hardcoded filter count
6. Fix typo in variable names

### Long-term Enhancements

1. Consider `role="grid"` or `role="region"` with `aria-label` for overall context
2. Implement column sorting with `aria-sort`
3. Add row focus management for better keyboard UX

---

## Files to Update

| File                           | Changes Required               |
| ------------------------------ | ------------------------------ |
| `src/components/DataTable.tsx` | All issues above               |
| `src/components/Checkbox.tsx`  | Verify aria-label prop support |

---

## Testing Checklist

After fixes, verify:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus is visible on all interactive elements
- [ ] Loading/error states are announced
- [ ] Works correctly with multiple DataTable instances on same page
- [ ] Row selection works with keyboard only
- [ ] Search input is properly labeled
- [ ] Full view modal traps focus correctly
