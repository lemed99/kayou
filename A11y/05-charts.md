# Accessibility Audit: Chart Components

---

## Cross-Cutting Issues (All Charts)

### Critical: No Keyboard Navigation for Cartesian Charts
AreaChart, BarChart, and LineChart rely exclusively on `onMouseMove`/`onMouseLeave`. None have `tabindex`, `onKeyDown`, or any keyboard interaction model. **PieChart is the exception** -- it has full keyboard support and should serve as the pattern for all charts.

### Major: No Data Table Alternative
None of the chart components provide a non-visual data alternative (hidden `<table>` or structured text). WCAG requires information conveyed through charts to be available in a non-visual format.

### Major: Color-Only Series Differentiation
Area, Bar, Line, and Pie all distinguish series only by color with no pattern/texture/dasharray alternative (WCAG 1.4.1).

---

## Shared Components

### CartesianGrid
**File:** `packages/ui/src/components/Charts/shared/CartesianGrid.tsx`

No issues. Correctly uses `aria-hidden="true"` on the root `<g>` since grid lines are purely decorative.

---

### ChartTooltip / ChartTooltipOverlay
**File:** `packages/ui/src/components/Charts/shared/ChartTooltip.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Critical** | 2.1.1 | Tooltip triggered exclusively by mouse hover. No keyboard mechanism for Line, Area, or Bar charts. | 38, 42, 53 |
| Major | 4.1.2 | Tooltip has `role="tooltip"` and `id` but no element references it via `aria-describedby` | 73, 125-127 |
| Minor | 1.3.1 | Default tooltip content renders data as plain divs -- no `<dl>`/`<dt>`/`<dd>` structure | 138, 144 |

**Strengths:** `role="tooltip"`, `aria-live="polite"`, SVG indicators `aria-hidden="true"`, unique ID via `createUniqueId()`

---

### XAxis
**File:** `packages/ui/src/components/Charts/shared/XAxis.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 1.3.1 | Entire axis group `aria-hidden="true"` -- hides meaningful axis labels from screen readers | 38 |
| Minor | 1.4.3 | Hardcoded `fill="#666"` with `font-size="10"` -- no dark mode support | 64-65 |

---

### YAxis
**File:** `packages/ui/src/components/Charts/shared/YAxis.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 1.3.1 | Same as XAxis: entire axis group `aria-hidden="true"` hiding meaningful tick values | 39 |
| Minor | 1.4.3 | Hardcoded `fill="#666"` with no dark mode support | 60-61 |

**Recommendation for both axes:** Split into decorative parts (lines, ticks -- `aria-hidden`) and semantic parts (text labels -- exposed). Use CSS custom properties instead of hardcoded hex.

---

## AreaChart

**File:** `packages/ui/src/components/Charts/AreaChart/AreaChart.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Critical** | 2.1.1 | SVG has `onMouseMove`/`onMouseLeave` but no keyboard handlers, no `tabindex`, no `onKeyDown` | 190, 204-205 |
| **Critical** | 2.1.1 | Wrapper `<div>` has no focusable elements -- focus cannot enter the chart | 165 |
| Major | 1.3.1 | No accessible data table alternative | 190 |

**Strengths:** SVG uses `role="img"` with `aria-label`, supports `ariaLabel`/`ariaDescribedBy`/`title`/`description` props, renders `<title>` and `<desc>` SVG elements

---

### Area
**File:** `packages/ui/src/components/Charts/AreaChart/Area.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 1.4.1 | Multiple series distinguished solely by fill color -- no pattern fills | 98-100, 106 |
| Minor | 4.1.2 | Data point circles have no `aria-label` or role | 119-121 |

**Strengths:** Root `<g>` has `aria-label={`Area series: ${props.dataKey}`}`

---

## BarChart

**File:** `packages/ui/src/components/Charts/BarChart/BarChart.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Critical** | 2.1.1 | Only mouse events, no keyboard navigation, no `tabindex` on SVG | 208, 222-223 |
| Major | 1.3.1 | No accessible data table alternative | 208 |

**Strengths:** Same as AreaChart -- `role="img"`, `aria-label`, `<title>`/`<desc>`

---

### Bar
**File:** `packages/ui/src/components/Charts/BarChart/Bar.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Critical** | 2.1.1 | Bar `<g>` elements have `onMouseEnter`/`onMouseLeave` and `cursor:pointer` but no `tabindex`, no keyboard handlers | 153-156 |
| Major | 4.1.2 | Individual bar shapes have no `aria-label` or role -- screen readers cannot determine bar values | 57, 148, 170 |
| Major | 1.4.1 | Multiple series distinguished only by fill color | 87, 163 |

**Strengths:** Root `<g>` has `aria-label={`Bar series: ${props.dataKey}`}`

---

## LineChart

**File:** `packages/ui/src/components/Charts/LineCharts/LineChart.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| **Critical** | 2.1.1 | Only mouse events, no keyboard support, no `tabindex` | 190, 204-205 |
| Major | 1.3.1 | No accessible data table alternative | 190 |

**Strengths:** Same as AreaChart/BarChart

---

### Line
**File:** `packages/ui/src/components/Charts/LineCharts/Line.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 4.1.2 | Root `<g>` has no `aria-label` (unlike Area and Bar which label their series) | 50 |
| Major | 1.4.1 | Multiple series distinguished only by stroke color -- no `strokeDasharray` or marker differentiation | 54-55 |
| Minor | 4.1.2 | Data point circles and active indicators have no accessible labels | 59-61, 68-76 |

---

## PieChart

**File:** `packages/ui/src/components/Charts/PieChart/PieChart.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 1.3.1 | No accessible data table alternative | 35 |

**Strengths:** SVG uses `role="img"` with `aria-label`, `<title>`/`<desc>` elements

---

### Pie
**File:** `packages/ui/src/components/Charts/PieChart/Pie.tsx`

| Severity | WCAG | Description | Lines |
|----------|------|-------------|-------|
| Major | 2.4.7 | `style={{ outline: 'none' }}` removes focus indicator; Tailwind ring classes don't render on SVG `<g>` elements | 175-179 |
| Major | 1.4.1 | All segments share same `fill` prop -- no built-in per-segment colors or pattern support | 156, 182 |
| Minor | 2.1.1 | All segments have `tabindex={0}` -- excessive tab stops with many segments. Should use roving tabindex. | 162 |
| Minor | 4.1.2 | Active shape overlay has no `aria-hidden="true"` | 187-189 |

### Strengths (Best-in-Class)
- Full keyboard navigation: ArrowLeft/Right/Up/Down, Home, End
- Each segment has descriptive `aria-label` with label, value, and percentage
- `role="list"` on parent `<g>`, `role="listitem"` on each segment
- Enter/Space to select/activate segments
- `onFocus`/`onBlur` handlers update visual state
- `onSegmentSelect` callback for activation

**Recommendation:** Use Pie's keyboard pattern as the template for all Cartesian charts.

---

### Sector
**File:** `packages/ui/src/components/Charts/PieChart/Sector.tsx`

No issues. Pure visual primitive; correctly delegates accessibility to parent Pie component.

---

### ResponsiveContainer
**File:** `packages/ui/src/components/Charts/ResponsiveContainer.tsx`

No issues. Pure layout component; correctly delegates accessibility to child chart.
