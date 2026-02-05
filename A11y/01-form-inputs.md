# Accessibility Audit: Form Input Components

---

## Button

**File:** `packages/ui/src/components/Button.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 1.4.3 | `warning` variant uses `text-white` on `bg-yellow-400` -- likely fails 4.5:1 contrast | 56 |
| Minor | 4.1.3 | Spinner has no live-region announcement when `isLoading` starts/stops | 93, 100, 102 |
| Info | 2.1.1 | `opacity-50` only applied when `local.disabled` is true, not when `isLoading` is true (line 81 vs 90) | 81, 90 |

### Strengths
- Native `<button>` with `type="button"` default preventing accidental form submissions
- `aria-busy={local.isLoading}` to communicate loading state
- Properly disables button during loading
- Supports rest props spread for custom ARIA attributes

---

## TextInput

**File:** `packages/ui/src/components/TextInput.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 1.3.1 | Required asterisk is visual-only -- no `aria-required` on the input, asterisk lacks `aria-hidden="true"` | 216-217, 237, 255 |
| Minor | 2.5.5 | Arrow buttons use `px-1`/`size-2.5` -- likely under 24x24px minimum target | 83, 271, 284 |
| Minor | 4.1.3 | No live-region announcement when `isLoading` changes | 231, 233 |
| Info | 1.3.1 | Addon `<span>` has no semantic association to the input (e.g., `aria-describedby`) | 222-223 |

### Strengths
- Generates unique IDs and properly associates label via `for`/`id`
- Associates helper text via `aria-describedby`
- Sets `aria-invalid` when `color='failure'`
- Sets `aria-busy` during loading
- Arrow buttons have `aria-label` with i18n support
- Arrow button icons have `aria-hidden="true"`

---

## Textarea

**File:** `packages/ui/src/components/Textarea.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Critical** | 1.3.1 | Label rendered without `for` attribute; no `id` on `<textarea>` -- label and textarea are not programmatically associated | 76, 89 |
| Major | 1.3.1 | HelperText has no `id`; textarea has no `aria-describedby` -- helper text not linked | 89, 99-100 |
| Major | 4.1.2 | No `aria-invalid` set when `color='failure'` | 89, 95 |
| Minor | 4.1.3 | No `aria-busy` or live region for the loading spinner | 83-84 |
| Minor | 1.3.1 | Required asterisk is visual-only with no `aria-required` on textarea | 77-78, 89 |

### Strengths
- Uses semantic `<textarea>` element
- Uses the Label component
- Disables textarea during loading

**Recommendation:** Port the ID generation and association pattern from TextInput.

---

## NumberInput

**File:** `packages/ui/src/components/NumberInput.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 4.1.2 | Uses `type="text"` with `inputMode` but lacks `role="spinbutton"` and `aria-valuemin`/`aria-valuemax`/`aria-valuenow` when arrows are shown | 476-477, 322-328 |
| Minor | 4.1.3 | Invalid input silently corrected on blur with no screen reader announcement | 148, 178-202 |
| Info | 3.3.1 | No visible error message when value is silently replaced with fallback | 179, 190 |

### Strengths
- Correct `inputMode="numeric"` / `"decimal"` for mobile keyboards
- ArrowUp/ArrowDown keyboard shortcuts for increment/decrement
- Delegates to TextInput, inheriting its accessibility features
- Arrow button labels support i18n

---

## Password

**File:** `packages/ui/src/components/Password.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Major** | 2.1.1 | Toggle visibility button has `tabIndex={-1}` -- unreachable via keyboard | 329 |
| Minor | 4.1.3 | Strength indicator and requirements list update dynamically but are not in an `aria-live` region | 370, 413 |
| Minor | 1.3.1 | Requirements list icons (CircleIcon, CheckCircleBrokenIcon) lack `aria-hidden="true"` | 430-431 |
| Info | 1.3.1 | Requirement met/unmet status conveyed only by icon change -- no screen reader text | 422, 430-431 |

### Strengths
- Toggle button `aria-label` updates based on state
- Strength meter uses `role="progressbar"` with `aria-valuenow`/`min`/`max` and `aria-label`
- `aria-describedby` links to strength and requirements sections
- Generates unique IDs for all associated elements
- Full i18n support

---

## Checkbox

**File:** `packages/ui/src/components/Checkbox.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 4.1.2 | No accessible name when `label` prop is omitted -- empty label element | 72, 78, 80, 90, 98, 100 |
| Minor | 2.5.5 | Checkbox is `size-4` (16x16px) -- below 24x24 minimum. Click target only larger when label is present | 41 |
| Minor | 4.1.2 | CSS-only custom styling via `appearance-none` is correct but fragile -- verify with screen readers | 41, 44, 49 |

### Strengths
- Native `<input type="checkbox">` with built-in semantics
- `<label>` wrapper with `for`/`id` association
- Generates unique ID automatically

---

## ToggleSwitch

**File:** `packages/ui/src/components/ToggleSwitch.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 2.1.1 | Redundant `tabIndex={0}` on native `<button>` | 125 |
| Minor | 2.5.5 | Visual toggle is `h-5 w-9` (20x36px) -- small for touch. Full button area is larger. | 54, 68 |
| Info | 4.1.2 | Hidden input has both `hidden` and `class="sr-only"` -- redundant | 111, 115 |

### Strengths
- Correct `role="switch"` with `aria-checked`
- `aria-labelledby` pointing to the label span
- Native `<button>` for keyboard accessibility
- `type="button"` prevents form submission
- Label is required in the interface

---

## Label

**File:** `packages/ui/src/components/Label.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Info | 1.3.1 | Renders empty string when neither `value` nor `children` provided | 52 |

### Strengths
- Semantic `<label>` element
- Supports `for` attribute via rest props
- Color variants for validation states

---

## HelperText

**File:** `packages/ui/src/components/HelperText.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Minor | 4.1.2 | No `role="alert"` or `aria-live` when `color='failure'` -- dynamically appearing errors not announced | 47, 55 |
| Minor | 2.1.1 | When `onClick` is provided, `<span>` is not keyboard-focusable, has no `role="button"` | 53, 55 |

### Strengths
- Supports `id` prop for `aria-describedby` associations
- Color variants for validation states
- Conditionally renders only when content exists

---

## UploadFile

**File:** `packages/ui/src/components/UploadFile.tsx`

### Issues

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 4.1.2 | Hidden file input has no accessible label (no `id`, no `aria-label`) | 600-607 |
| Major | 4.1.3 | Upload progress, success, and error states not announced via live regions | 518-538, 626 |
| Major | 2.4.3 | Remove button has `opacity-0 group-hover:opacity-100` but no `focus:opacity-100` -- invisible to keyboard users | 720 |
| Minor | 1.3.1 | Progress bar `<div>` lacks `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | 731-732 |
| Minor | 4.1.3 | Error display has no `role="alert"` | 627, 629 |
| Minor | 1.1.1 | Decorative icons throughout lack `aria-hidden="true"` | 567, 589, 628, 521, 527 |

### Strengths
- Keyboard-accessible browse button as alternative to drag-and-drop
- Remove button has `aria-label` with file name
- Image previews have `alt` text set to file name
- Full i18n support
