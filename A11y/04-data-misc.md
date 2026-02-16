# Accessibility Audit: Data Display & Miscellaneous Components

---

## DataTable

**File:** `packages/ui/src/components/DataTable/DataTable.tsx`

### Issues

| Severity     | WCAG   | Description                                                                                                          | Lines         |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------------- | ------------- |
| **Critical** | 1.3.1  | Missing `role="rowgroup"` wrapper around header row -- breaks required table structure                               | 401, 544, 594 |
| **Critical** | 4.1.2  | `role="table"` div has no accessible name (`aria-label` or `aria-labelledby`)                                        | 401           |
| Major        | 1.3.1  | Virtualization introduces intermediate `<div>` elements that break table > rowgroup > row hierarchy                  | 652, 661, 670 |
| Major        | 2.1.1  | Table rows not focusable, no arrow key navigation for row selection                                                  | 335           |
| Major        | 4.1.3  | Nested `role="status"` (validating overlay wrapping Spinner) -- inner Spinner may not be announced                   | 641, 649      |
| Major        | 1.3.1  | Loading skeleton inside rowgroup uses `<div>` with `role="status"` instead of `role="row"` -- breaks table structure | 606, 611      |
| Minor        | 1.4.11 | Search clear button `text-neutral-400` -- ~2.7:1 contrast, below 3:1 for UI components                               | 426           |
| Minor        | 2.5.5  | Search clear button may be below 44x44px                                                                             | 419, 426      |
| Info         | 1.3.2  | Filter count badge has no `aria-label` explaining the number                                                         | 470           |

### Strengths

- Proper use of `role="table"`, `role="row"`, `role="cell"`, `role="columnheader"`
- Customizable `ariaLabels` prop with sensible defaults
- Row selection checkboxes have descriptive `aria-label` per row
- Select-all checkbox has `aria-label="Select all rows"`
- Loading/error states use `role="status"`/`role="alert"`
- `aria-busy` on rowgroup during loading/validating
- Expand button uses `aria-expanded`
- Icons marked `aria-hidden="true"`
- Clear search button restores focus to input

---

## DataTableFilters

**File:** `packages/ui/src/components/DataTable/DataTableFilters.tsx`

### Issues

| Severity     | WCAG   | Description                                                                       | Lines         |
| ------------ | ------ | --------------------------------------------------------------------------------- | ------------- |
| **Critical** | 2.1.1  | Filter popover has no focus trap or focus management on open                      | 507, 514, 527 |
| **Critical** | 4.1.2  | Filter popover content has no ARIA role (`role="dialog"`) or `aria-label`         | 527, 529      |
| Major        | 1.3.1  | Filter row Select components have no labels or `aria-label` -- only `placeholder` | 274, 288      |
| Major        | 1.3.1  | FilterInput components (TextInput, NumberInput, etc.) have no explicit labels     | 111-205       |
| Major        | 4.1.3  | No announcement when filters are applied -- popover just closes                   | 453, 462      |
| Minor        | 2.5.5  | Filter chip remove buttons `size-3` with minimal padding -- extremely small       | 662-669       |
| Minor        | 1.4.11 | Interactive text using `text-neutral-500` (~4.6:1) -- borderline                  | 579, 679, 698 |
| Info         | 2.4.3  | "AND" badge between rows should have `aria-hidden="true"`                         | 552           |

### Strengths

- Filter button uses `aria-expanded` to indicate popover state
- Filter button includes active count in `aria-label`
- Badge count marked `aria-hidden="true"` to avoid double-announcement
- Remove buttons have `aria-label` with filter key name
- Icons consistently marked `aria-hidden="true"`
- Focus-visible rings on all interactive elements
- Escape key closes the popover
- Full i18n support

---

## Skeleton

**File:** `packages/ui/src/components/Skeleton.tsx`

### Issues

| Severity | WCAG   | Description                                                                                                      | Lines |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ----- |
| Minor    | 1.4.11 | Default `bg-neutral-100` on white has ~1.06:1 contrast -- placeholder shape may be invisible to low-vision users | 77    |
| Minor    | 4.1.1  | Dynamic Tailwind class `bg-neutral-${gray()}` won't be detected by JIT purge -- may be missing in production     | 77    |

### Strengths

- Proper `role="status"` and `aria-busy="true"`
- Configurable `aria-label` with default "Loading..."
- i18n support

---

## Spinner

**File:** `packages/ui/src/components/Spinner.tsx`

### Issues

| Severity | WCAG  | Description                                                                | Lines  |
| -------- | ----- | -------------------------------------------------------------------------- | ------ |
| Info     | 2.3.1 | No `prefers-reduced-motion` support -- `animate-spin` continues regardless | 55, 88 |

### Strengths

- `role="status"` on wrapper
- SVG has `aria-hidden="true"`
- Screen reader text via `sr-only` class with localizable label
- i18n support

---

## IconWrapper

**File:** `packages/ui/src/components/IconWrapper.tsx`

### Issues

| Severity | WCAG  | Description                                                                                                       | Lines |
| -------- | ----- | ----------------------------------------------------------------------------------------------------------------- | ----- |
| Minor    | 1.1.1 | Always `aria-hidden="true"` with no option for non-decorative use -- parent elements must provide accessible name | 25    |

### Strengths

- Correctly defaults to `aria-hidden="true"` for decorative icons
- Uses `currentColor` for theming consistency

---

## VirtualList

**File:** `packages/ui/src/components/VirtualList.tsx`

### Issues

| Severity | WCAG  | Description                                                                                     | Lines    |
| -------- | ----- | ----------------------------------------------------------------------------------------------- | -------- |
| Major    | 2.1.1 | No `tabIndex`, no keyboard event handlers -- cannot scroll with keyboard                        | 105, 123 |
| Major    | 4.1.2 | Row wrappers have no `role` attribute -- breaks table row structure when used inside DataTable  | 144, 146 |
| Minor    | 4.1.2 | Does not expose `aria-rowcount`, `aria-setsize`, or `aria-posinset` (unlike DynamicVirtualList) | 104, 144 |

### Strengths

- Accepts `role`, `aria-label`, `aria-multiselectable` props
- Accepts `id` prop for `aria-labelledby` linkage
- Passthrough design allows ARIA customization

---

## DynamicVirtualList

**File:** `packages/ui/src/components/DynamicVirtualList.tsx`

### Issues

| Severity | WCAG  | Description                                                                                    | Lines    |
| -------- | ----- | ---------------------------------------------------------------------------------------------- | -------- |
| Minor    | 2.1.1 | Keyboard handler supports Home/End/PageUp/PageDown but not ArrowUp/ArrowDown                   | 144, 158 |
| Minor    | 2.4.7 | Container gets `tabIndex={0}` but has no visible focus style -- may be suppressed by CSS reset | 195      |

### Strengths

- Excellent ARIA: `role`, `aria-multiselectable`, `aria-label`, `aria-activedescendant`, `aria-rowcount`
- Row items get `aria-setsize` and `aria-posinset` when `rowRole` provided
- Keyboard navigation for Home/End/PageUp/PageDown
- Smart conditional `tabIndex={0}` only when role is present
- Exposes `onKeyDown` for custom keyboard handling
- Imperative `scrollToIndex` API

---

## VirtualGrid

**File:** `packages/ui/src/components/VirtualGrid.tsx`

### Issues

| Severity | WCAG  | Description                                                                                                                | Lines    |
| -------- | ----- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| Major    | 1.3.1 | Grid cells `role="gridcell"` are direct children of grid -- ARIA requires `role="row"` wrappers between grid and gridcells | 225, 263 |
| Major    | 2.4.7 | Focused gridcells use `data-focused` attribute but there is no CSS styling for it -- no visible focus indicator            | 267      |
| Major    | 2.1.1 | Grid always has `tabindex={0}` even when empty                                                                             | 230      |
| Minor    | 4.1.2 | Gridcells have no accessible content requirement -- may be unnamed                                                         | 263, 266 |
| Minor    | 2.4.3 | Off-screen items may not exist in DOM after `scrollToIndex` -- focus call may fail                                         | 206, 266 |

### Strengths

- Full keyboard navigation: ArrowUp/Down/Left/Right, Home/End (with Ctrl), PageUp/PageDown
- `role="grid"` with `aria-rowcount` and `aria-colcount`
- Gridcells have `aria-rowindex` and `aria-colindex`
- Roving tabindex pattern
- `aria-label` and `aria-labelledby` support

---

## RichTextEditor

**File:** `packages/ui/src/components/RichTextEditor/RichTextEditor.tsx`

### Issues

| Severity     | WCAG   | Description                                                                                                         | Lines    |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------- | -------- |
| **Critical** | 1.3.1  | `<label>` has no `for` attribute and does not wrap the contenteditable element -- clicking label won't focus editor | 229, 262 |
| Major        | 3.3.1  | Error message not linked to editor via `aria-describedby`; no `aria-invalid` when in error state                    | 209, 277 |
| Major        | 4.1.3  | Character count not announced to screen readers -- no `aria-live`                                                   | 286, 292 |
| Minor        | 1.4.11 | Placeholder `#9ca3af` on white is ~2.6:1 -- below 3:1 for UI components                                             | 219, 224 |
| Minor        | 2.1.1  | Required asterisk visual-only -- no `aria-required` on editor                                                       | 148, 232 |

### Strengths

- Editor has `role="textbox"` and `aria-multiline="true"`
- Configurable `aria-label`
- Comprehensive i18n system
- Visual focus ring on the editor container

---

## Toolbar (RichTextEditor)

**File:** `packages/ui/src/components/RichTextEditor/Toolbar.tsx`

### Issues

| Severity | WCAG  | Description                                                                                                   | Lines            |
| -------- | ----- | ------------------------------------------------------------------------------------------------------------- | ---------------- |
| Major    | 4.1.2 | Container has no `role="toolbar"` or `aria-label`                                                             | 281-282          |
| Major    | 2.1.1 | Without toolbar role, no arrow key navigation -- users must Tab through 30+ buttons                           | 281-282          |
| Major    | 4.1.2 | Heading and list dropdown triggers lack `aria-expanded`/`aria-haspopup`                                       | 340, 378         |
| Major    | 4.1.2 | Dropdown options are plain `<button>` elements with no `role="menuitem"` or `aria-checked` for selected state | 318-334, 359-374 |
| Minor    | 4.1.2 | Heading dropdown trigger lacks `aria-label`                                                                   | 340, 344         |
| Minor    | 1.3.1 | Link URL input has no `<label>` or `aria-label`                                                               | 526, 541         |
| Minor    | 2.5.5 | Color picker buttons `size-7` (28x28px) closely spaced                                                        | 484              |
| Minor    | 4.1.2 | Highlight color picker dropdown has no role; "Remove highlight" button has no `aria-label`                    | 473, 492         |

### Strengths

- ToolbarButton consistently uses `aria-label` and `aria-pressed` for toggle state
- All buttons have descriptive labels via localizable `l()` system
- Tooltips on all buttons
- Disabled state properly applied
- Link popover buttons have `aria-label`
- Full i18n support

---

## ImageUploadNode

**File:** `packages/ui/src/components/RichTextEditor/ImageUploadNode.tsx`

### Issues

| Severity | WCAG  | Description                                                                    | Lines |
| -------- | ----- | ------------------------------------------------------------------------------ | ----- |
| Major    | 1.1.1 | Uploaded images have no `alt` attribute -- invisible to screen readers         | 62    |
| Major    | 4.1.2 | Node view container has no ARIA attributes (`role`, `aria-label`)              | 47-48 |
| Minor    | 3.3.1 | Upload errors logged to console but not communicated to user or screen readers | 65-66 |
| Minor    | 1.1.1 | Hardcoded English strings not localizable                                      | 80-81 |

### Strengths

- Uses UploadFile component with its own accessibility features
- Proper cleanup on destroy
