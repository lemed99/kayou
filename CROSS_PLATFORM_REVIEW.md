# Cross-Platform Compatibility Review

Review of all kayou UI components for compatibility across **macOS, Windows, Linux** (Tauri desktop WebView) and **iOS, Android** (Tauri mobile WebView).

---

## Critical Issues (FIXED)

### 1. ~~Charts: No touch interaction — tooltips broken on mobile~~ ✅ FIXED

**Components:** `AreaChart`, `BarChart`, `LineChart`, `Bar`

~~All chart components use `onMouseMove`/`onMouseLeave`/`onMouseEnter` exclusively.~~

**Fix applied:** Added `onTouchMove`/`onTouchEnd`/`onTouchStart` handlers to all chart SVG elements and Bar components.

### 2. ~~UploadFile: Remove button invisible on touch devices~~ ✅ FIXED

**Component:** `UploadFile`

~~The per-file remove button uses `opacity-0 group-hover:opacity-100`.~~

**Fix applied:** Removed `opacity-0 group-hover:opacity-100` so the remove button is always visible.

### 3. ~~Skeleton: Dynamic Tailwind classes won't compile~~ ✅ FIXED

**Component:** `Skeleton`

~~Dynamic class construction prevented Tailwind JIT compilation.~~

**Fix applied:** Added static `GRAY_CLASSES` and `DARK_GRAY_CLASSES` lookup maps for Tailwind to compile.

### 4. ~~Click-outside uses `mousedown` only — popovers may not close on mobile~~ ✅ FIXED

**Components:** `Popover`, `useSelect`, `DatePicker`, `DataTableFilters`

~~All click-outside handlers listened for `mousedown` events only.~~

**Fix applied:** Changed all `mousedown` listeners to `pointerdown` in Popover, useSelect, DatePicker, and DataTableFilters.

---

## High Severity (FIXED)

### 5. ~~Hover-only interactions with no touch fallback~~ ✅ FIXED

| Component | Issue | Status |
|-----------|-------|--------|
| `Popover` | `onHover` mode uses `onMouseEnter`/`onMouseLeave` only | ✅ Added `onTouchStart`/`onTouchEnd` |
| `Tooltip` | Shows on `onMouseEnter` only; wrapper div not focusable | ✅ Added `tabIndex={0}` and `onTouchStart`/`onTouchEnd` |
| `Sidebar` | Pin icon visible only after 1s hover; collapsed sub-menus use hover Popover | Inherits Popover fix |

### 6. ~~Modal & Drawer: No focus trap, no Escape key handler~~ ✅ FIXED

**Components:** `Modal`, `Drawer`

~~Both used `aria-modal="true"` but had no focus trap or Escape handler.~~

**Fix applied:** Added focus trap (Tab cycles within modal/drawer) and Escape key handler to both components.

### 7. ~~`caret-color: transparent` doesn't prevent virtual keyboard~~ ✅ FIXED

**Components:** `Select`, `MultiSelect`, `DatePicker`

~~Using `caret-color: transparent` alone didn't prevent the virtual keyboard on iOS.~~

**Fix applied:** Added `readOnly` and `inputMode="none"` attributes to Select, MultiSelect, and DatePicker inputs.

---

## Medium Severity

### 8. ~~`scale` CSS property unsupported on older Android WebView~~ ✅ FIXED

**Components:** `Popover`, `Tooltip`, `useSelect`, `DatePicker`

~~The individual `scale` CSS property (not `transform: scale()`) requires Chromium 104+. Older Android WebViews may not support it.~~

**Fix applied:** Changed `scale` to `transform: scale(...)` in Popover, Tooltip, useSelect, and DatePicker.

### 9. Small touch targets (< 44px minimum)

| Component | Element | Size | Location |
|-----------|---------|------|----------|
| `Button` | `xs` variant | ~28px | `Button.tsx:61` |
| `Checkbox` | Input (no label) | 16px | `Checkbox.tsx:41` |
| `NumberInput` | Arrow buttons | ~20x12px | `TextInput.tsx:260-286` |
| `Pagination` | Nav buttons | 32px | `Pagination.tsx:95` |
| `Password` | Show/hide toggle | ~32px wide | `Password.tsx:319-335` |
| `Modal` | Close button | ~32px | `Modal.tsx:84` |
| `Drawer` | Close button | ~32px | `Drawer.tsx:101` |
| `DataTableFilters` | Chip remove button | 12px | `DataTableFilters.tsx:662-669` |
| `DataTableFilters` | "See more" / "Add" buttons | ~20-24px | `DataTableFilters.tsx:676-702` |
| `Calendar` | Date buttons | 40px | `Calendar.tsx:500` |
| `Calendar` | Prev/next month | ~34px | `Calendar.tsx:418, 457` |
| `RichTextEditor Toolbar` | All toolbar buttons | 32px | `Toolbar.tsx:79` |
| `RichTextEditor Toolbar` | Highlight colors | 28px | `Toolbar.tsx:484` |

### 10. ~~`ToggleSwitch`: Typo breaks transition~~ ✅ FIXED

**Component:** `ToggleSwitch`

~~Line 68: `tansition-all` (missing 'r'). The transition class is not applied — color changes are instant. Broken on **all platforms**.~~

**Fix applied:** Fixed typo `tansition-all` → `transition-all` and added `after:transition-all` for pseudo-element.

### 11. ~~`VirtualGrid`: Ctrl+Home/End doesn't work on macOS~~ ✅ FIXED

**Component:** `VirtualGrid`

~~Lines 177-178: Checks `e.ctrlKey` for Home/End shortcuts. macOS convention is `Cmd` (metaKey).~~

**Fix applied:** Changed `e.ctrlKey` to `e.ctrlKey || e.metaKey` for Home/End shortcuts.

### 12. ~~`DataTableFilters`: Popover width uses `100vw`~~ ✅ FIXED

~~Line 529: `max-w-[calc(100vw-32px)]` — on iOS Safari, `100vw` includes scrollbar width and can cause horizontal overflow.~~

**Fix applied:** Changed `100vw` to `100dvw` which excludes scrollbar width on iOS Safari.

---

## Low Severity

### 13. No swipe gestures

| Component | Missing gesture |
|-----------|----------------|
| `Sidebar` | Swipe left/right to open/close |
| `Drawer` | Swipe to dismiss |
| `DatePicker` | Swipe left/right for month navigation |

### 14. Sticky hover states on touch

Components using `hover:` Tailwind classes may show persistent hover styling after tap on iOS: `Button`, `DataTable` rows, `Toolbar` buttons, `Calendar` date buttons.

### 15. ~~`Drawer` / `Modal`: `h-full` instead of `dvh`~~ ✅ FIXED

~~`h-full` (`100%`) can behave unexpectedly on mobile when the virtual keyboard is open or the address bar changes height. `dvh` units would be more reliable.~~

**Fix applied:** Changed `h-full` to `h-dvh` in Drawer and Modal backdrop/content classes.

### 16. `RichTextEditor Toolbar`: `window.open` in Tauri

Line 201: `window.open(url, '_blank')` may not work in Tauri WebViews. External links should use Tauri's shell API.

### 17. ~~`Password`: Toggle button not keyboard-focusable~~ ✅ FIXED

~~Line 329: `tabIndex={-1}` prevents keyboard users from toggling password visibility on all desktop platforms.~~

**Fix applied:** Changed `tabIndex={-1}` to `tabIndex={0}` to make the toggle button keyboard-focusable.

### 18. ~~`ResponsiveContainer`: May collapse to 0 height~~ ✅ FIXED

~~The container uses `height: '100%'` but has no `min-height` CSS property on the DOM element. If the parent has no explicit height, charts render at 0 height.~~

**Fix applied:** Added `'min-height': '1px'` to prevent collapsing to 0 height.

### 19. ~~`ImageUploadNode`: "Drag and drop" text on mobile~~ ✅ FIXED

~~Line 80: Shows "Click to upload or drag and drop" on mobile where drag-and-drop is unavailable.~~

**Fix applied:** Changed text to "Tap to select an image" which works on both desktop and mobile.

---

## Summary by Component

| Component | Critical | High | Medium | Low |
|-----------|----------|------|--------|-----|
| **AreaChart** | Touch interaction broken | | | Sticky hover |
| **BarChart** | Touch interaction broken | | | Sticky hover |
| **LineChart** | Touch interaction broken | | | Sticky hover |
| **Bar** | Touch interaction broken | | | |
| **UploadFile** | Remove button invisible on touch | | | Drag text on mobile |
| **Skeleton** | Dynamic classes broken | | | |
| **Popover** | mousedown click-outside | Hover mode no touch fallback | `scale` CSS property | |
| **Tooltip** | | Hover-only, not focusable | `scale` CSS property | |
| **Sidebar** | | Pin icon hover-only, collapsed sub-menus | | No swipe |
| **Modal** | | No focus trap, no Escape | Close button touch target | `h-full` on mobile |
| **Drawer** | | No focus trap, no Escape | Close button touch target | `h-full`, no swipe |
| **Select** | | Virtual keyboard not prevented | `scale` CSS property | |
| **MultiSelect** | | Virtual keyboard not prevented | | |
| **DatePicker** | mousedown click-outside | Virtual keyboard not prevented | `scale`, Calendar touch targets, `100vw` | No swipe for months |
| **DataTableFilters** | mousedown click-outside | | Chip remove targets, popover width | |
| **DataTable** | | | search clear target | Sticky hover on rows |
| **useSelect** | mousedown click-outside | | `scale` CSS property | |
| **RichTextEditor** | | | Toolbar touch targets | autofocus, window.open |
| **Accordion** | | | | |
| **VirtualGrid** | | | Ctrl vs Cmd on macOS | |
| **ToggleSwitch** | | | Typo breaks transition | |
| **NumberInput** | | | Arrow button touch targets | |
| **Pagination** | | | Nav button touch targets | |
| **Password** | | | Toggle touch target | tabIndex=-1 |
| **Calendar** | | | Date/nav button touch targets | hover:scale on touch |
| **VirtualList** | | | | |
| **DynamicVirtualList** | | | | |
| **ResponsiveContainer** | | | | May collapse to 0 |
| **Alert** | | | | None |
| **Badge** | | | | None |
| **Breadcrumb** | | | | None |
| **HelperText** | | | | None |
| **IconWrapper** | | | | None |
| **Label** | | | | None |
| **Spinner** | | | | None |
| **Textarea** | | | | None |
| **TextInput** | | | Arrow touch targets | |
| **Button** | | | xs variant touch target | Sticky hover |
| **Checkbox** | | | 16px target without label | |
