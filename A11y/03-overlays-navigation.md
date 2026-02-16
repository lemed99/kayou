# Accessibility Audit: Overlay & Navigation Components

---

## Modal

**File:** `packages/ui/src/components/Modal.tsx`

### Issues

| Severity     | WCAG   | Description                                                                                                        | Lines    |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------ | -------- |
| **Critical** | 2.1.2  | No focus trap -- Tab can escape the dialog into background content                                                 | 131, 134 |
| **Critical** | 2.1.1  | No Escape key handler to close the modal                                                                           | 94, 154  |
| **Critical** | 2.4.3  | No focus management on open -- focus remains on background page                                                    | 104, 108 |
| Major        | 2.4.3  | No focus restoration on close -- focus lost to `<body>`                                                            | 94, 154  |
| Major        | 4.1.2  | Dialog has no accessible name (`aria-label` or `aria-labelledby`)                                                  | 131, 136 |
| Major        | 4.1.2  | Uses `<div role="dialog">` instead of native `<dialog>` which provides Escape handling and focus trapping for free | 32, 131  |
| Minor        | 2.5.5  | Close button ~32x32px, below 44x44px recommendation                                                                | 139, 145 |
| Minor        | 1.4.11 | Close button icon `text-neutral-400` may not meet 3:1 contrast on white                                            | 84       |

### Strengths

- Uses `role="dialog"` and `aria-modal="true"`
- Close button has `aria-label` with i18n support
- Background scroll prevention
- Backdrop click to close

**Recommendation:** Migrate to native `<dialog>` element with `showModal()`, or implement full focus trap, Escape handler, and focus management.

---

## Drawer

**File:** `packages/ui/src/components/Drawer.tsx`

### Issues

| Severity     | WCAG  | Description                                                                                           | Lines      |
| ------------ | ----- | ----------------------------------------------------------------------------------------------------- | ---------- |
| **Critical** | 2.1.2 | No focus trap                                                                                         | 173, 175   |
| **Critical** | 2.1.1 | No Escape key handler                                                                                 | 111, 201   |
| **Critical** | 2.4.3 | No focus management on open or close                                                                  | 122, 126   |
| **Critical** | 2.1.1 | When `showHeader=false` (default), no close button is rendered -- keyboard users have no way to close | 58-59, 181 |
| Major        | 4.1.2 | Dialog has no accessible name                                                                         | 173, 175   |
| Minor        | 2.5.5 | Close button ~32x32px                                                                                 | 183, 189   |

### Strengths

- Uses `role="dialog"` and `aria-modal="true"`
- Close button has `aria-label` with i18n
- Background scroll prevention
- Backdrop click to close

---

## Popover

**File:** `packages/ui/src/components/Popover.tsx`

### Issues

| Severity | WCAG  | Description                                                                                                                                              | Lines             |
| -------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Major    | 4.1.2 | Trigger wrapper `<div>` adds `role="button"` and `tabindex="0"` -- if children already contain a `<button>`, creates invalid nested interactive elements | 268, 274-275      |
| Major    | 2.1.1 | When `onHover=true`, `tabindex` is `undefined` -- non-focusable trigger content is unreachable by keyboard                                               | 274, 275, 283-284 |
| Minor    | 4.1.2 | `aria-label` on dialog is optional with no fallback                                                                                                      | 293, 295          |
| Minor    | 2.4.7 | Trigger wrapper `<div>` with `tabindex="0"` has no focus styles                                                                                          | 273-274           |

### Strengths

- Escape key handler
- Click outside to close
- Focus management: focuses first focusable element on open, returns focus to trigger on close
- Unique ID for `aria-controls`
- Proper `aria-haspopup`, `aria-expanded`, `aria-controls` on trigger
- Keyboard Enter/Space toggle
- FocusIn/FocusOut for hover mode

---

## Tooltip

**File:** `packages/ui/src/components/Tooltip.tsx`

### Issues

| Severity | WCAG   | Description                                                                                                    | Lines        |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------- | ------------ |
| Major    | 2.1.1  | No Escape key to dismiss the tooltip (WCAG 1.4.13 requires dismissable)                                        | 100, 277     |
| Major    | 1.4.13 | Tooltip not hoverable -- `onMouseLeave` on wrapper hides it before pointer can reach tooltip content in Portal | 227-228, 237 |
| Minor    | 4.1.2  | Trigger wrapper has no `tabindex` -- if children are not focusable, tooltip is keyboard-unreachable            | 224, 229-230 |

### Strengths

- Proper `role="tooltip"` with unique ID
- Correct `aria-describedby` on trigger
- Shows on both hover and focus (FocusIn/FocusOut)
- Arrow element has `aria-hidden="true"`

---

## Accordion

**File:** `packages/ui/src/components/Accordion.tsx`

### Issues

| Severity | WCAG  | Description                                                                                         | Lines    |
| -------- | ----- | --------------------------------------------------------------------------------------------------- | -------- |
| Major    | 2.1.1 | Missing arrow key navigation between headers (WAI-ARIA Accordion pattern requires Up/Down/Home/End) | 227, 232 |
| Minor    | 1.3.1 | Container div has no semantic grouping or descriptive `aria-label`                                  | 149, 154 |
| Minor    | 4.1.2 | Redundant Enter/Space keydown handler on native `<button>` (not harmful)                            | 269, 273 |

### Strengths

- Native `<button>` elements for triggers
- Proper `aria-expanded` on each trigger
- `aria-controls` linking trigger to panel
- Panel uses `role="region"` with `aria-labelledby`
- Unique IDs for ARIA relationships
- Chevron icon has `aria-hidden="true"`

---

## Breadcrumb

**File:** `packages/ui/src/components/Breadcrumb.tsx`

### Issues

| Severity | WCAG  | Description                                                                                                            | Lines     |
| -------- | ----- | ---------------------------------------------------------------------------------------------------------------------- | --------- |
| Minor    | 1.3.1 | Safari/VoiceOver may not announce `<ol>` as a list when `list-style: none` is applied -- consider adding `role="list"` | 69, 91-92 |
| Info     | 2.4.8 | `isCurrent` prop correctly sets `aria-current="page"` but is not enforced on last item                                 | 98, 103   |

### Strengths

- Semantic `<nav>` with `aria-label` and i18n
- `<ol>` for ordered breadcrumb list
- Separator icon has `aria-hidden="true"`
- Supports `aria-current="page"`
- Custom link components via `as` prop

---

## Sidebar

**File:** `packages/ui/src/components/Sidebar.tsx`

### Issues

| Severity | WCAG  | Description                                                                                                                                                      | Lines                                  |
| -------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Major    | 2.1.1 | Pin button only appears on 1-second hover -- completely inaccessible to keyboard                                                                                 | 592-596, 651-665                       |
| Major    | 2.1.1 | No arrow key navigation between `role="menuitem"` elements                                                                                                       | 552, 576, 696, 707, 746                |
| Major    | 4.1.2 | Uses `role="menu"`/`role="menuitem"` without the required keyboard interaction model (arrow keys, Home, End, type-ahead). Worse than not using the roles at all. | 410, 523, 530, 552, 576, 696, 707, 802 |
| Minor    | 2.4.7 | Sidebar toggle button has no visible focus indicator                                                                                                             | 499, 504                               |
| Minor    | 2.5.5 | Pin button ~18x18px -- well below 44x44px                                                                                                                        | 652, 656, 663                          |
| Minor    | 1.3.1 | `SidebarCollapse` button lacks `role="menuitem"` despite being a child of `role="menu"`                                                                          | 745-746, 749-750                       |

### Strengths

- `<aside>` with `aria-label` for the sidebar landmark
- Collapse/expand button has dynamic `aria-label` and `aria-expanded`
- Pin button has dynamic `aria-label` for pin/unpin state
- Full i18n support
- `role="none"` on `<li>` correctly delegates to child `role="menuitem"`

**Recommendation:** Either implement the full ARIA menu keyboard pattern, or remove `role="menu"`/`role="menuitem"` and use standard list semantics.

---

## Pagination

**File:** `packages/ui/src/components/Pagination.tsx`

### Issues

| Severity | WCAG  | Description                                                                              | Lines        |
| -------- | ----- | ---------------------------------------------------------------------------------------- | ------------ |
| Major    | 1.3.1 | Page number input has no associated `<label>` -- "Page" text is a `<p>`, not a `<label>` | 106-107, 122 |
| Minor    | 4.1.3 | No `aria-live` announcement when page changes                                            | 78, 81       |
| Minor    | 2.5.5 | Nav buttons `size-8` (32x32px) -- below 44x44px                                          | 95           |

### Strengths

- `<nav>` with `aria-label`
- Each navigation button has descriptive `aria-label`
- Tooltips for visual context
- Buttons properly disabled at boundaries
- Full i18n support

---

## Alert

**File:** `packages/ui/src/components/Alert.tsx`

### Issues

| Severity | WCAG   | Description                                                                                                                                    | Lines     |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Major    | 4.1.3  | All alerts use `role="alert"` (assertive) -- too aggressive for `info` and `success` variants. Should use `role="status"` for non-error types. | 62        |
| Minor    | 1.4.11 | Icon positioned partially outside alert boundary (`-top-1.5 -left-1.5`) -- may not contrast with page background                               | 41, 68-69 |
| Info     | 1.3.1  | Icon has no `aria-hidden` -- should be hidden if decorative                                                                                    | 67, 69    |

### Strengths

- Uses `role="alert"` for screen reader announcement
- Spreads rest props for custom `aria-*` attributes
- Distinct color themes for severity levels

---

## Badge

**File:** `packages/ui/src/components/Badge.tsx`

### Issues

| Severity | WCAG  | Description                                                                                          | Lines     |
| -------- | ----- | ---------------------------------------------------------------------------------------------------- | --------- |
| Major    | 1.4.1 | Badge meaning conveyed solely through color -- no text/icon/non-color indicator for semantic meaning | 8, 34, 44 |
| Minor    | 4.1.2 | Renders as plain `<div>` -- no semantic role for status information                                  | 64, 72    |
| Minor    | 1.4.3 | Some dark-mode color combinations may have insufficient contrast -- needs verification               | 44        |

### Strengths

- Spreads rest props for custom `aria-*` attributes
- Multiple size variants
