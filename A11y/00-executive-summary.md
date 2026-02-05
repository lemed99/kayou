# Accessibility Audit - Executive Summary

**Date:** 2026-02-02
**Standard:** WCAG 2.1 (Level AA)
**Scope:** All 60+ components in `packages/ui/src/components/`

---

## Issue Counts

| Severity | Count | Description |
|----------|-------|-------------|
| Critical | 14 | Blocks usage for assistive technology users |
| Major | 35 | Significant barriers to accessibility |
| Minor | 40+ | Improvements that enhance the experience |
| Info | 10+ | Best-practice suggestions |

---

## Top 10 Priority Fixes

| # | Component | WCAG | Issue |
|---|-----------|------|-------|
| 1 | **Modal** | 2.1.1, 2.1.2, 2.4.3 | No focus trap, no Escape key, no focus management |
| 2 | **Drawer** | 2.1.1, 2.1.2, 2.4.3 | Same as Modal - completely inaccessible to keyboard users |
| 3 | **Textarea** | 1.3.1 | Label not associated with textarea (no `for`/`id`) |
| 4 | **DataTable** | 1.3.1, 4.1.2 | Missing header rowgroup, no accessible table name |
| 5 | **All Charts** (Area/Bar/Line) | 2.1.1 | No keyboard navigation - mouse-only interaction |
| 6 | **RichTextEditor** | 1.3.1 | Label not associated with editor element |
| 7 | **MultiSelect** | 4.1.2 | Missing `aria-activedescendant` and option IDs |
| 8 | **DataTableFilters** | 2.1.1, 4.1.2 | No focus trap or dialog role on filter popover |
| 9 | **Password** | 2.1.1 | Toggle visibility button has `tabIndex={-1}` - unreachable by keyboard |
| 10 | **Toolbar (RTE)** | 4.1.2, 2.1.1 | No `role="toolbar"`, no arrow key navigation between 30+ buttons |

---

## Cross-Cutting Themes

### 1. Focus Management in Dialogs
Modal and Drawer lack all three foundational dialog requirements: focus trap, Escape key, and focus restoration. These are the most impactful fixes.

### 2. Chart Keyboard Navigation
AreaChart, BarChart, and LineChart rely exclusively on mouse events. PieChart is the only chart with keyboard support (and it's well done). The pattern from PieChart should be extended to all chart types.

### 3. Color-Only Differentiation
Multiple chart series (Area, Bar, Line, Pie) are distinguished solely by color with no pattern/texture/dasharray alternative (WCAG 1.4.1).

### 4. No Data Table Alternatives for Charts
None of the chart components provide a non-visual data alternative (hidden table or structured text).

### 5. Label-Input Association Gaps
Textarea, DatePicker, RichTextEditor, and Pagination input lack proper `for`/`id` label association despite having Label components rendered.

### 6. Touch Target Sizes
Consistently below 44x44px across components: close buttons (Modal, Drawer), pin button (Sidebar), filter chip remove buttons, pagination buttons, checkbox.

### 7. Incomplete ARIA Menu Pattern in Sidebar
`role="menu"`/`role="menuitem"` are used without the required keyboard interaction model (arrow keys, Home/End, type-ahead).

---

## Best-Implemented Components

| Component | Why |
|-----------|-----|
| **PieChart/Pie** | Full keyboard nav, descriptive aria-labels per segment, role="list"/role="listitem", roving tabindex |
| **Popover** | Escape, click-outside, focus management on open/close, proper ARIA trigger attrs |
| **ToggleSwitch** | Correct `role="switch"` with `aria-checked`, `aria-labelledby`, native button |
| **Select** | Full combobox pattern with `aria-activedescendant`, keyboard nav, proper roles |
| **DatePicker** | aria-live announcements, dialog role, custom Tab focus trap, full keyboard nav |
| **Breadcrumb** | Semantic `<nav>`, `<ol>`, `aria-current="page"`, i18n |
| **TextInput** | Unique IDs, label association, aria-describedby, aria-invalid, aria-busy |

---

## Report Files

| File | Scope |
|------|-------|
| `01-form-inputs.md` | Button, TextInput, Textarea, NumberInput, Password, Checkbox, ToggleSwitch, Label, HelperText, UploadFile |
| `02-selects-pickers.md` | Select, MultiSelect, SelectWithSearch, useSelect, DatePicker, Calendar, TimePicker, Shortcuts |
| `03-overlays-navigation.md` | Modal, Drawer, Popover, Tooltip, Accordion, Breadcrumb, Sidebar, Pagination, Alert, Badge |
| `04-data-misc.md` | DataTable, DataTableFilters, Skeleton, Spinner, IconWrapper, VirtualList, DynamicVirtualList, VirtualGrid, RichTextEditor, Toolbar, ImageUploadNode |
| `05-charts.md` | All Chart components (Area, Bar, Line, Pie), shared components (Axes, Grid, Tooltip), ResponsiveContainer |
