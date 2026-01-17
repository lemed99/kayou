# Tailwind CSS Dark Mode Best Practices

**Version:** 1.0.0
**Category:** Styling
**Applies to:** Any project using Tailwind CSS v3+

---

## Overview

This skill provides best practices for implementing dark mode with Tailwind CSS, ensuring consistent, maintainable, and performant theming across your application.

---

## Configuration

### 1. Enable Class-Based Dark Mode

Always use `class` strategy for manual control (recommended over `media` for user preference):

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'selector' in Tailwind v4
  // ...
};
```

### 2. Apply Dark Class to Root Element

```typescript
// Toggle dark mode on <html> element
document.documentElement.classList.toggle('dark');
```

**Why `<html>` not `<body>`?**

- Ensures `dark:` variants work everywhere including portals
- Background colors extend to full viewport
- Consistent behavior with scroll areas

---

## Implementation Patterns

### Pattern 1: Inline Dark Variants

Best for simple, one-off styling:

```tsx
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Content</div>
```

### Pattern 2: Theme Objects (Recommended for Components)

Best for reusable components with many variants:

```typescript
const theme = {
  base: 'rounded-lg border transition-colors',
  light: 'bg-white border-gray-200 text-gray-900',
  dark: 'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
};

// Usage
<div class={`${theme.base} ${theme.light} ${theme.dark}`}>
```

Or combined:

```typescript
const theme = {
  container: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  title: 'text-gray-900 dark:text-white',
  subtitle: 'text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-500', // Same in both modes
};
```

### Pattern 3: CSS Variables for Dynamic Theming

Best for complex themes or runtime customization:

```css
/* globals.css */
:root {
  --color-bg-primary: theme('colors.white');
  --color-text-primary: theme('colors.gray.900');
  --color-border: theme('colors.gray.200');
}

.dark {
  --color-bg-primary: theme('colors.gray.900');
  --color-text-primary: theme('colors.white');
  --color-border: theme('colors.gray.700');
}
```

```tsx
<div class="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
```

---

## Color Palette Guidelines

### Recommended Color Mappings

| Element                    | Light Mode | Dark Mode  |
| -------------------------- | ---------- | ---------- |
| **Background (primary)**   | `white`    | `gray-900` |
| **Background (secondary)** | `gray-50`  | `gray-800` |
| **Background (tertiary)**  | `gray-100` | `gray-700` |
| **Text (primary)**         | `gray-900` | `white`    |
| **Text (secondary)**       | `gray-700` | `gray-300` |
| **Text (muted)**           | `gray-500` | `gray-400` |
| **Border (default)**       | `gray-200` | `gray-700` |
| **Border (strong)**        | `gray-300` | `gray-600` |

### Accent Colors

Keep accent colors consistent but adjust for contrast:

```typescript
// Primary action buttons
'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600';

// Success states
'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';

// Error states
'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';

// Warning states
'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
```

---

## State Management

### JavaScript Implementation (SolidJS)

```typescript
import { createEffect, createSignal, onMount } from 'solid-js';

function useTheme() {
  const [isDark, setIsDark] = createSignal(false);

  // Initialize from localStorage or system preference
  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  });

  // Apply theme and persist
  createEffect(() => {
    const dark = isDark();
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  const toggle = () => setIsDark(!isDark());

  return { isDark, setIsDark, toggle };
}
```

### React Implementation

```typescript
import { useEffect, useState } from 'react';

function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return { isDark, setIsDark, toggle };
}
```

---

## Preventing Flash of Unstyled Content (FOUC)

Add this script to `<head>` before any CSS loads:

```html
<script>
  (function () {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

---

## Component Isolation

### Problem: Nested Dark Contexts

When you need an isolated theme context (e.g., preview component):

```tsx
// Global theme is dark, but preview needs to show light mode
<div class="dark">
  {' '}
  {/* Global */}
  <div class="">
    {' '}
    {/* Reset to light for preview */}
    <div class="bg-white text-gray-900">Preview content (always light)</div>
  </div>
</div>
```

### Solution: Explicit Theme Wrapper

```tsx
function ThemePreview(props: { forceDark?: boolean; children: JSX.Element }) {
  return (
    <div class={props.forceDark ? 'dark' : ''}>
      <div class="bg-white dark:bg-gray-800">{props.children}</div>
    </div>
  );
}
```

### Detecting Global Theme in Isolated Components

```typescript
// Use MutationObserver to track global theme changes
onMount(() => {
  const update = () => {
    setGlobalIsDark(document.documentElement.classList.contains('dark'));
  };

  update();

  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  onCleanup(() => observer.disconnect());
});
```

---

## Common Mistakes to Avoid

### 1. Forgetting Dark Variants on Interactive States

```tsx
// BAD - hover doesn't account for dark mode
<button class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800">

// GOOD - hover has dark variant
<button class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
```

### 2. Using `media` Strategy When User Control is Needed

```js
// BAD - can't toggle manually
darkMode: 'media',

// GOOD - full control
darkMode: 'class',
```

### 3. Hardcoding Colors in CSS/Style Tags

```tsx
// BAD - doesn't respect dark mode
<pre style={{ background: '#f5f5f5' }}>

// GOOD - uses Tailwind classes
<pre class="bg-gray-100 dark:bg-gray-800">
```

### 4. Inconsistent Opacity in Dark Mode

```tsx
// BAD - opacity looks washed out in dark mode
<div class="bg-blue-500/10 dark:bg-blue-500/10">

// GOOD - adjust opacity for dark mode
<div class="bg-blue-500/10 dark:bg-blue-500/20">
```

### 5. Not Testing Both Modes

Always verify:

- Text contrast meets WCAG AA (4.5:1 for normal text)
- Interactive elements are visible
- Focus states are clear
- Images/icons are visible

---

## Accessibility Checklist

- [ ] Text contrast ratio ≥ 4.5:1 (normal) or 3:1 (large)
- [ ] Focus indicators visible in both modes
- [ ] Disabled states distinguishable
- [ ] Error/success states clear
- [ ] Icons have sufficient contrast or adapt to theme
- [ ] Images with transparency work on both backgrounds

### Testing Contrast

Use browser DevTools or tools like:

- WebAIM Contrast Checker
- Lighthouse accessibility audit
- axe DevTools extension

---

## Performance Considerations

### 1. Minimize Runtime Class Changes

Toggle `dark` class on root element only, not on individual components.

### 2. Use CSS Variables for Frequently Changed Values

```css
.dark {
  --shadow-color: rgba(0, 0, 0, 0.5);
}

:root {
  --shadow-color: rgba(0, 0, 0, 0.1);
}
```

### 3. Avoid JavaScript-Based Color Calculations

Let Tailwind handle it at build time with `dark:` variants.

---

## Testing Strategy

### Manual Testing Checklist

1. Toggle between modes - verify all elements update
2. Refresh page - verify preference persists
3. Clear localStorage - verify falls back to system preference
4. Test with system preference changes
5. Test all component states (hover, focus, active, disabled)
6. Test forms (inputs, selects, checkboxes)
7. Test modals/popovers (often rendered in portals)

### Automated Testing

```typescript
// Test dark mode class application
it('should apply dark class when dark mode is enabled', () => {
  localStorage.setItem('theme', 'dark');
  render(<App />);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
});
```

---

## File Checklist for Dark Mode Implementation

When implementing dark mode, ensure these files are updated:

- [ ] `tailwind.config.js` - `darkMode: 'class'`
- [ ] `index.html` - FOUC prevention script
- [ ] Root layout/App component - theme toggle logic
- [ ] All component files - `dark:` variants
- [ ] Global CSS - CSS variables if used
- [ ] Tests - dark mode specific tests

---

## Quick Reference

### Common Utility Pairs

```
bg-white          → dark:bg-gray-900
bg-gray-50        → dark:bg-gray-800
bg-gray-100       → dark:bg-gray-700
text-gray-900     → dark:text-white
text-gray-700     → dark:text-gray-300
text-gray-500     → dark:text-gray-400
border-gray-200   → dark:border-gray-700
border-gray-300   → dark:border-gray-600
divide-gray-200   → dark:divide-gray-700
ring-gray-300     → dark:ring-gray-600
placeholder-gray-400 → dark:placeholder-gray-500
```

### Semantic Color Classes

```typescript
// Define once, use everywhere
export const colors = {
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
  },
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
  },
  border: {
    default: 'border-gray-200 dark:border-gray-700',
    strong: 'border-gray-300 dark:border-gray-600',
  },
};
```
