# Project Context: @kayou/ui

Last Updated: 2026-01-13
Total Components: 31
Total Hooks: 7
Total Context Providers: 5
Documentation Coverage: 0%
Test Coverage: 0%

## Project Overview

**Purpose:** A UI component library built with SolidJS
**Package Name:** @kayou/ui
**Version:** 0.1.12
**Target Users:** Developers building with SolidJS
**Design Philosophy:** Flowbite-inspired components with Tailwind CSS styling

## Technology Stack

- **Framework:** SolidJS ^1.9.0
- **Language:** TypeScript ^5.9.2
- **Build Tool:** Vite ^6.3.6 with vite-plugin-solid
- **Styling:** Tailwind CSS ^4.0.0 with tailwind-merge
- **Animation:** @solid-primitives/presence
- **Charts:** D3.js (d3-scale, d3-selection, d3-shape)
- **Internationalization:** @formatjs/intl (optional peer dependency)

## Component Inventory

| Component          | Category     | Props Count | Tests | Docs | Status      |
| ------------------ | ------------ | ----------- | ----- | ---- | ----------- |
| Accordion          | Display      | 7           | -     | -    | Needs audit |
| Alert              | Feedback     | ~5          | -     | -    | Needs audit |
| Badge              | Display      | ~4          | -     | -    | Needs audit |
| Breadcrumb         | Navigation   | ~3          | -     | -    | Needs audit |
| Button             | Forms        | 5           | -     | -    | Needs audit |
| Checkbox           | Forms        | ~6          | -     | -    | Needs audit |
| DataTable          | Data Display | 17          | -     | -    | Needs audit |
| DatePicker         | Forms        | 15          | -     | -    | Needs audit |
| Drawer             | Overlay      | ~8          | -     | -    | Needs audit |
| DynamicVirtualList | Performance  | ~10         | -     | -    | Needs audit |
| HelperText         | Forms        | ~3          | -     | -    | Needs audit |
| IconWrapper        | Display      | ~3          | -     | -    | Needs audit |
| Label              | Forms        | ~3          | -     | -    | Needs audit |
| Modal              | Overlay      | 6           | -     | -    | Needs audit |
| MultiSelect        | Forms        | ~12         | -     | -    | Needs audit |
| NumberInput        | Forms        | ~10         | -     | -    | Needs audit |
| Pagination         | Navigation   | ~5          | -     | -    | Needs audit |
| Popover            | Overlay      | ~8          | -     | -    | Needs audit |
| Select             | Forms        | 5           | -     | -    | Needs audit |
| SelectWithSearch   | Forms        | ~8          | -     | -    | Needs audit |
| Sidebar            | Navigation   | ~10         | -     | -    | Needs audit |
| Skeleton           | Feedback     | ~4          | -     | -    | Needs audit |
| Spinner            | Feedback     | ~3          | -     | -    | Needs audit |
| Textarea           | Forms        | ~8          | -     | -    | Needs audit |
| TextInput          | Forms        | 18          | -     | -    | Needs audit |
| ToggleSwitch       | Forms        | ~6          | -     | -    | Needs audit |
| Tooltip            | Overlay      | 5           | -     | -    | Needs audit |
| UploadFile         | Forms        | ~8          | -     | -    | Needs audit |
| VirtualGrid        | Performance  | ~8          | -     | -    | Needs audit |
| VirtualList        | Performance  | ~8          | -     | -    | Needs audit |

### Charts Components

| Component           | Category | Status      |
| ------------------- | -------- | ----------- |
| LineChart           | Charts   | Needs audit |
| CartesianGrid       | Charts   | Needs audit |
| Line                | Charts   | Needs audit |
| XAxis               | Charts   | Needs audit |
| YAxis               | Charts   | Needs audit |
| LineChartTooltip    | Charts   | Needs audit |
| PieChart            | Charts   | Needs audit |
| Pie                 | Charts   | Needs audit |
| Sector              | Charts   | Needs audit |
| ResponsiveContainer | Charts   | Needs audit |

**Legend:**

- - = Not available/Not checked

## Hooks Inventory

| Hook                  | Purpose                     | Status      |
| --------------------- | --------------------------- | ----------- |
| useCustomResource     | Custom resource loading     | Needs audit |
| useDatePicker         | DatePicker state management | Needs audit |
| useDynamicVirtualList | Dynamic virtual list logic  | Needs audit |
| useFloating           | Floating UI positioning     | Needs audit |
| useIntl               | Internationalization        | Needs audit |
| useMutation           | Data mutation handling      | Needs audit |
| useTheme              | Theme management            | Needs audit |
| useToast              | Toast notifications         | Needs audit |
| useVirtualList        | Virtual list logic          | Needs audit |

## Context Providers

| Provider               | Purpose                  | Status      |
| ---------------------- | ------------------------ | ----------- |
| CustomResourceProvider | Custom resource context  | Needs audit |
| DatePickerProvider     | DatePicker configuration | Needs audit |
| IntlProvider           | Internationalization     | Needs audit |
| ThemeProvider          | Theme management         | Needs audit |
| ToastProvider          | Toast notifications      | Needs audit |

## Architecture Notes

### State Management

- Uses SolidJS signals (`createSignal`) for local component state
- Uses SolidJS stores (`createStore`) for complex state (DataTable, DatePicker)
- Context providers for global state (Theme, Toast, Intl, DatePicker)

### Styling Approach

- Tailwind CSS 4.0 for utility-first styling
- `tailwind-merge` for className composition
- Theme objects defined inline in components
- Dark mode support via `dark:` variants
- Component themes stored as const objects at module level

### Component Patterns

1. **Props Handling:** Uses `splitProps` to separate local props from pass-through props
2. **Default Values:** Uses `createMemo` for computed default values
3. **Refs:** Forward refs via callback pattern `ref={setInputRef}`
4. **Conditional Rendering:** Uses `<Show>` component
5. **List Rendering:** Uses `<For>` component
6. **Animation:** Uses `@solid-primitives/presence` for mount/unmount transitions

### Floating UI Pattern

Custom `useFloating` hook for:

- Tooltips
- Popovers
- Select dropdowns
- DatePicker calendar

### Accessibility Strategy

- Basic ARIA attributes present (aria-label on close buttons)
- Some keyboard navigation implemented
- **Needs improvement:** Comprehensive a11y audit required

### Build Configuration

- ES modules output only
- Multiple entry points: index, hooks, context, helpers, icons
- External: solid-js, solid-js/web
- Tree-shakeable exports

## Current Issues

### Critical (Need Investigation)

1. No test files found - 0% test coverage
2. No documentation files found - 0% doc coverage
3. Modal uses `<dialog>` attributes but renders `<div>` elements

### High Priority (Patterns to Review)

1. Props destructuring patterns may break reactivity
2. Some components missing proper TypeScript generics
3. Inconsistent export patterns (default vs named exports)
4. Some inline styles that could be CSS classes

### Medium Priority

1. Theme objects duplicated across components
2. Missing JSDoc comments on most components
3. Some components have large prop interfaces (TextInput: 18 props)
4. Charts components lack comprehensive error handling

## Dependencies Audit

### Production Dependencies

- @solid-primitives/presence: ^0.1.2 - Animation utilities
- d3-scale: ^4.0.2 - Chart scaling
- d3-selection: ^3.0.0 - DOM manipulation for charts
- d3-shape: ^3.2.0 - Shape generation for charts
- tailwind-merge: ^3.3.1 - Class merging

### Peer Dependencies

- solid-js: ^1.9.0 - Core framework
- tailwindcss: ^4.0.0 - Styling
- @formatjs/intl: ^3.1.0 (optional) - i18n

### Dev Dependencies (Key)

- typescript: ^5.9.2
- vite: ^6.3.6
- eslint: ^9.36.0
- prettier: ^3.6.2

## File Structure

```
src/
├── components/           [31 components]
│   ├── Charts/
│   │   ├── LineCharts/  [7 files]
│   │   ├── PieChart/    [5 files]
│   │   ├── ResponsiveContainer.tsx
│   │   └── types.ts
│   └── [28 component files]
├── context/             [5 providers]
├── helpers/             [5 utilities]
├── hooks/               [9 hooks]
├── icons/               [~200+ icons]
└── index.ts             [Main export]
```

## Export Structure

```typescript
// Main entry: @kayou/ui
export { Accordion, Alert, Badge, ... } from './components'

// Hooks: @kayou/uihooks
export { useCustomResource, useDatePicker, ... } from './hooks'

// Context: @kayou/uicontext
export { ThemeProvider, ToastProvider, ... } from './context'

// Helpers: @kayou/uihelpers
export { defaultProps, cache, ... } from './helpers'

// Icons: @kayou/uiicons
export { ... } from './icons'
```

## Improvement Roadmap

### Phase 1: Critical Fixes

- [ ] Add comprehensive accessibility attributes
- [ ] Fix any props destructuring issues
- [ ] Add proper TypeScript generics where missing
- [ ] Review and fix Modal implementation

### Phase 2: Testing

- [ ] Set up Vitest and @solidjs/testing-library
- [ ] Add unit tests for all components
- [ ] Add integration tests for complex components
- [ ] Add accessibility tests

### Phase 3: Documentation

- [ ] Add JSDoc comments to all exports
- [ ] Create component documentation
- [ ] Create usage examples
- [ ] Create migration/getting started guide

### Phase 4: Enhancement

- [ ] Extract shared theme configuration
- [ ] Add CSS custom properties for theming
- [ ] Improve keyboard navigation
- [ ] Add more comprehensive error handling

## Notes for Claude

- Component files use default exports (except DataTable, VirtualList, etc.)
- All props interfaces extend JSX element attributes where applicable
- Use `splitProps` for separating component-specific props
- Use `createMemo` for computed values with defaults
- Use `twMerge` for combining Tailwind classes
- Follow existing theme object pattern for styling
- Animation uses `@solid-primitives/presence` for enter/exit transitions
- Floating elements use custom `useFloating` hook with Portal
- **IMPORTANT:** Always run `npx eslint <file>` after editing any `.ts` or `.tsx` file to verify the fix passes lint checks
- **CRITICAL:** When fixing `solid/reactivity` ESLint warnings:
  - NEVER use `eslint-disable` comments to silence warnings
  - In `onMount` (one-time setup): capturing values in variables is fine since it runs once
  - In signal initializers or objects that persist: use getter patterns (`get prop() { return props.value; }`) to preserve reactivity
  - Always understand the context - is this one-time setup or should it react to changes?
