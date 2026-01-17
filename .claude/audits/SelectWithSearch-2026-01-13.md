# SelectWithSearch Audit Report

**Generated:** 2026-01-13
**Overall Score:** 71/100 (Acceptable)

## Executive Summary

SelectWithSearch is a searchable dropdown component built on a shared `useSelect` hook. The hook provides good keyboard navigation and virtualization support. However, critical ARIA attributes are missing for the combobox pattern - options lack `role="option"` and `aria-selected`, and the input is missing the full combobox ARIA setup (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`).

## Score Breakdown

| Dimension         | Score  | Max     | Notes                                   |
| ----------------- | ------ | ------- | --------------------------------------- |
| Type Safety       | 19     | 25      | Missing return type, type assertions    |
| SolidJS Practices | 22     | 25      | Good patterns, inconsistent prop access |
| API Design        | 12     | 15      | Required prop could have default        |
| Accessibility     | 10     | 20      | Missing combobox ARIA pattern           |
| Performance       | 8      | 10      | Good virtualization                     |
| Testing & Docs    | 0      | 5       | None exist                              |
| **Total**         | **71** | **100** |                                         |

## Critical Issues

### Issue 1: Options missing role="option"

**Location:** `SelectWithSearch.tsx:91-97`, `useSelect.tsx:400-411`
**Problem:** Option items are rendered as plain `<div>` without `role="option"`
**Impact:** Screen readers don't recognize items as selectable options
**Fix:**

```tsx
<div
  role="option"
  id={`option-${option.value}`}
  aria-selected={selectedOption()?.value === option.value}
  class={optionClass(option, highlightedOption())}
  onClick={() => handleOptionClick(option)}
  onMouseEnter={() => setHighlightedOption(option)}
>
```

### Issue 2: Input missing combobox ARIA attributes

**Location:** `SelectWithSearch.tsx:60-74`
**Problem:** Input lacks `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`
**Impact:** Screen readers don't understand this is a combobox or which option is highlighted
**Fix:**

```tsx
<TextInput
  role="combobox"
  aria-expanded={isOpen()}
  aria-controls={listboxId}
  aria-activedescendant={highlightedOption() ? `option-${highlightedOption()!.value}` : undefined}
  aria-autocomplete="list"
  aria-haspopup="listbox"
  ...
/>
```

## High Priority Issues

### Issue 3: No explicit return type

**Line:** 22
**Problem:** `export default function SelectWithSearch(props: SelectWithSearchProps)`
**Fix:** `export default function SelectWithSearch(props: SelectWithSearchProps): JSX.Element`

### Issue 4: Inconsistent prop access

**Lines:** 64, 76
**Problem:** Accesses `props.placeholder`, `props.disabled`, `props.isLoading` directly instead of through splitProps
**Impact:** May cause unnecessary re-renders if those props change
**Fix:** Add these to local splitProps or use consistently

### Issue 5: Type assertions for refs

**Lines:** 83 in SelectWithSearch, 178/192 in useSelect
**Problem:** `(searchRef() as HTMLElement)?.focus()`
**Fix:** Type signal properly: `createSignal<HTMLInputElement | null>(null)`

## Medium Priority Issues

### Issue 6: Missing JSDoc on props

**Lines:** 8-20
**Problem:** Props interface lacks documentation
**Fix:** Add JSDoc comments to all props

### Issue 7: Required prop without default

**Line:** 16
**Problem:** `noSearchResultPlaceholder: string` is required
**Suggestion:** Make optional with default: `noSearchResultPlaceholder?: string` and default to "No results found"

### Issue 8: helperText type assertion in useSelect

**Line:** 445 in useSelect.tsx
**Problem:** `props.helperText as string`
**Fix:** Use non-null assertion since it's inside Show: `props.helperText!`

## Low Priority Issues

### Issue 9: No test file

**Expected:** `src/components/__tests__/SelectWithSearch.test.tsx`

### Issue 10: No documentation page

**Expected:** `doc/src/pages/components/selectwithsearch.tsx`

### Issue 11: Label not associated with input

**Location:** useSelect.tsx:353-360
**Problem:** Label uses value prop but no `for`/`id` association with input
**Note:** This would require passing the searchInputId to the TextInput

### Issue 12: Option highlight on focus vs hover conflict

**Problem:** Options highlight on mouseEnter but keyboard navigation also sets highlight
**Minor:** Could cause visual confusion but works functionally

## Positive Findings

1. **Shared hook architecture** - `useSelect` hook is reusable across Select, SelectWithSearch, MultiSelect
2. **Keyboard navigation** - Supports ArrowUp/Down, Enter, Escape, Home, End
3. **Virtualization support** - Uses VirtualList for large option sets
4. **Scroll position preservation** - Remembers scroll position when reopening
5. **Lazy loading support** - Has onLazyLoad callback for infinite scroll
6. **Clear button accessibility** - Has `aria-label="Clear selection"`
7. **Dropdown button accessibility** - Has `aria-label="Open dropdown"`
8. **Listbox has role and label** - `role="listbox"` and `aria-label` present
9. **Click outside to close** - Proper event cleanup with onCleanup
10. **Portal rendering** - Dropdown renders in portal to avoid overflow issues

## Fix Priority Order

1. **Critical:** Add `role="option"` and `aria-selected` to options
2. **Critical:** Add combobox ARIA to input (role, aria-expanded, aria-controls, aria-activedescendant)
3. **High:** Add explicit return type
4. **High:** Fix inconsistent prop access
5. **Medium:** Add JSDoc comments
6. **Medium:** Make noSearchResultPlaceholder optional
7. **Low:** Create test file
8. **Low:** Create documentation page

## Recommended Test Plan

```typescript
describe('SelectWithSearch', () => {
  describe('Rendering', () => {
    it('renders with label');
    it('renders with placeholder');
    it('renders options when opened');
    it('renders "no results" when search has no matches');
    it('renders clear button when has value');
  });

  describe('Accessibility', () => {
    it('has role="combobox" on input');
    it('has aria-expanded reflecting open state');
    it('has aria-controls pointing to listbox');
    it('options have role="option"');
    it('options have aria-selected');
    it('has aria-activedescendant for highlighted option');
  });

  describe('Keyboard Navigation', () => {
    it('opens on ArrowDown');
    it('navigates with ArrowUp/ArrowDown');
    it('selects with Enter');
    it('closes with Escape');
    it('jumps to first with Home');
    it('jumps to last with End');
  });

  describe('Search', () => {
    it('filters options based on input');
    it('highlights first match when typing');
    it('clears search on clear button click');
  });

  describe('Selection', () => {
    it('calls onSelect when option clicked');
    it('calls onSelect when Enter pressed on highlighted');
    it('fills search input when autoFillSearchKey is true');
  });
});
```

## Architecture Notes

The component uses a shared `useSelect` hook that powers:

- `Select` - Simple dropdown
- `SelectWithSearch` - Searchable dropdown (this component)
- `MultiSelect` - Multi-selection dropdown

Fixes to the hook will benefit all three components. The ARIA fixes should be implemented in:

1. `useSelect.tsx` - For listbox, options in Layout
2. `SelectWithSearch.tsx` - For input combobox attributes

## Related Components

- **Select** - Simpler version, shares useSelect hook
- **MultiSelect** - Multi-selection version, shares useSelect hook
- **TextInput** - Base input component used internally
- **VirtualList** - Used for performance with large option lists

---

_Audit performed using solidjs-component-auditor skill v2.0.0_
