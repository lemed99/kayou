# Accessibility Audit: Select & Date Picker Components

---

## Select

**File:** `packages/ui/src/components/Select/Select.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 2.1.1 | Input has `caret-color: transparent` and is non-editable but lacks `readonly` attribute | 98 |
| Minor | 4.1.2 | Missing `aria-autocomplete="none"` on the combobox input | 92 |
| Minor | 1.3.1 | Required asterisk in useSelect Layout lacks `aria-hidden="true"` | 412 (useSelect) |
| Major | 2.5.5 | Option items `py-1.5 px-2` and ChevronDown button may be below minimum target size | 107, 114 |

### Strengths
- Correct combobox pattern: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`, `aria-activedescendant`
- Options use `role="option"` with `aria-selected`
- Unique IDs via `createUniqueId()` and `getOptionId()`
- Full keyboard nav: ArrowUp/Down, Enter, Escape, Home, End
- Escape returns focus to the combobox trigger

---

## MultiSelect

**File:** `packages/ui/src/components/Select/MultiSelect.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Critical** | 4.1.2 | Missing `aria-activedescendant` on combobox input -- screen reader cannot track highlighted option | 125, 134 |
| Major | 4.1.2 | Option `div` elements lack `id` attributes (needed for `aria-activedescendant`) | 210 |
| Major | 2.1.1 | Input has `caret-color: transparent` but lacks `readonly` | 139 |
| Minor | 4.1.2 | Search input has both `aria-label` and `<label>` -- redundant | 180, 192 |
| Minor | 1.3.1 | ClearContentButton instances lack `aria-label` | 161, 196 |
| Minor | 4.1.3 | "No results found" message not in `aria-live` region | - |

### Strengths
- Correct `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`
- Listbox has `aria-multiselectable="true"`
- Options use `role="option"` with `aria-selected`
- Checkbox integration for multi-select visual affordance
- Search input has properly associated `<label>`
- i18n support for aria labels

---

## SelectWithSearch

**File:** `packages/ui/src/components/Select/SelectWithSearch.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 1.3.1 | ClearContentButton lacks `aria-label` | 105 |
| Minor | 3.2.2 | On blur, auto-submits empty value with search text as label -- may be unexpected | 87-89 |

### Strengths
- Most ARIA-complete of the three Select variants
- Full combobox pattern: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete="list"`, `aria-haspopup="listbox"`
- Options have unique IDs via `getOptionId()`

---

## useSelect (Shared Hook)

**File:** `packages/ui/src/components/Select/useSelect.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 2.1.1 | Blanket `e.preventDefault()` for all keys when dropdown is open (type `select`/`multiSelect`) -- may block typing in multiSelect search input | 306 |
| Major | 2.1.2 | Tab key not handled -- dropdown stays open when focus leaves the component | 281 |
| Minor | 1.3.1 | Label component rendered without explicit `for`/`id` association to the input | 408, 410, 448 |

### Strengths
- Comprehensive keyboard navigation: ArrowUp/Down, Enter, Escape, Home, End
- Escape returns focus to the combobox trigger
- Dropdown opens on Enter, Space, or ArrowDown
- `aria-multiselectable` for multi-select
- Scroll-into-view for highlighted options
- i18n support

---

## selectUtils

**File:** `packages/ui/src/components/Select/selectUtils.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 4.1.3 | LazyLoading spinner has no text alternative or `role="status"` | 21-23 |
| Minor | 1.4.11 | Highlighted option `bg-blue-50` may have insufficient contrast against white | 16 |

---

## DatePicker

**File:** `packages/ui/src/components/DatePicker/DatePicker.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 2.1.1 | `role="combobox"` is on the wrapper div, not the input element (WAI-ARIA requires it on the input) | 975, 980, 992 |
| Major | 1.3.1 | Label not programmatically associated with the input via `for`/`id` | 964, 978 |
| Minor | 4.1.2 | Hidden input uses display value instead of ISO date string for form integration | 952 |
| Minor | 1.3.1 | Required asterisk lacks `aria-hidden="true"` | 967 |
| Info | 1.3.1 | ClearContentButton and ChevronDownButton lack `aria-label` | 1008, 1014 |

### Strengths
- Excellent `aria-live="polite"` announcement region for date selections, month changes, range start/end, disabled date reasons
- Dialog uses `role="dialog"` with `aria-label`
- Custom Tab focus trap cycling through logical focus order
- Full keyboard navigation: Arrow keys, Home, End, PageUp, PageDown, Enter, Space, Escape
- Focus returns to input on Escape/close
- HelperText connected via `aria-describedby`
- Comprehensive i18n support
- Disabled date reasons announced to screen readers

---

## Calendar

**File:** `packages/ui/src/components/DatePicker/Calendar.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 1.3.1 | Day header `role="row"` is not inside a `role="rowgroup"` -- breaks table structure | 467, 470, 484 |
| Major | 1.3.1 | Day buttons `role="gridcell"` are direct children of `role="rowgroup"` without `role="row"` wrappers | 484, 495 |
| Minor | 1.3.1 | Column header `aria-label` uses short day names; full day names would help screen readers | 477 |
| Minor | 2.5.5 | Nav buttons use `p-[0.45rem]` -- may be below 44x44px touch target | 418, 457 |
| Minor | 1.4.1 | Today's date indicated solely by `text-blue-500` -- no non-color indicator | 503 |

### Strengths
- Full `role="grid"` with `aria-label`
- Date buttons use `role="gridcell"` with full date `aria-label`
- `aria-selected` reflects selection state including range start/end
- `aria-disabled` on disabled dates
- Roving tabindex pattern: only focused date has `tabindex=0`
- Month/year selector keyboard navigation: ArrowUp/Down/Left/Right, Enter, Space, Escape
- `aria-expanded` on month/year buttons

---

## TimePicker

**File:** `packages/ui/src/components/DatePicker/TimePicker.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 1.3.1 | Colon separators `:` lack `aria-hidden="true"` -- screen readers will read "colon" | 139, 161 |
| Minor | 1.3.1 | Vertical separator bar is decorative but may be announced | 184 |

### Strengths
- Proper `role="group"` with `aria-label`
- Each NumberInput has appropriate `aria-label`
- Min/max constraints prevent invalid values

---

## Shortcuts

**File:** `packages/ui/src/components/DatePicker/Shortcuts.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 4.1.2 | Shortcut buttons use `role="option"` but lack `aria-selected` | 83 |
| Minor | 2.1.1 | Home and End keys not handled | 43 |

### Strengths
- Proper `role="listbox"` with `aria-label`
- Roving tabindex pattern
- ArrowUp/ArrowDown keyboard navigation
- Escape key handled
