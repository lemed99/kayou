# Accessibility Standards for UI Components

## WCAG 2.1 Guidelines Summary

### Level A (Minimum)

1. **Non-text Content** - All images need alt text
2. **Keyboard** - All functionality available via keyboard
3. **No Keyboard Trap** - User can navigate away using keyboard
4. **Focus Order** - Logical focus sequence
5. **Focus Visible** - Keyboard focus is visible
6. **Link Purpose** - Link text describes destination

### Level AA (Recommended Target)

1. **Color Contrast** - 4.5:1 for normal text, 3:1 for large text
2. **Resize Text** - Text can resize to 200% without loss
3. **Focus Appearance** - Focus indicators are clearly visible
4. **Label in Name** - Visible label matches accessible name

## ARIA Patterns for Common Components

### Button

```tsx
// Basic button
<button type="button" aria-label="Close modal">
  <XIcon />
</button>

// Loading button
<button type="button" aria-busy={isLoading()} disabled={isLoading()}>
  {isLoading() ? 'Loading...' : 'Submit'}
</button>

// Toggle button
<button
  type="button"
  aria-pressed={isPressed()}
  onClick={() => setIsPressed(!isPressed())}
>
  Toggle
</button>
```

### Modal/Dialog

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description text.</p>
  <button aria-label="Close" onClick={onClose}>
    <XIcon />
  </button>
</div>
```

**Requirements:**

- Focus trapped inside modal when open
- ESC key closes modal
- Focus returns to trigger element on close
- Background content hidden from screen readers (`aria-hidden="true"`)

### Select/Dropdown

```tsx
<div>
  <label id="select-label">Choose option</label>
  <button
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={isOpen()}
    aria-labelledby="select-label"
    aria-controls="select-listbox"
  >
    {selectedValue()}
  </button>

  <Show when={isOpen()}>
    <ul id="select-listbox" role="listbox" aria-labelledby="select-label">
      <For each={options}>
        {(option) => (
          <li role="option" aria-selected={isSelected(option)} tabIndex={-1}>
            {option.label}
          </li>
        )}
      </For>
    </ul>
  </Show>
</div>
```

**Keyboard Navigation:**

- Arrow Up/Down: Navigate options
- Enter/Space: Select option
- Escape: Close dropdown
- Home/End: First/last option
- Type characters: Jump to matching option

### Accordion

```tsx
<div>
  <h3>
    <button aria-expanded={isOpen()} aria-controls={`panel-${id}`} id={`header-${id}`}>
      Accordion Header
    </button>
  </h3>
  <div
    id={`panel-${id}`}
    role="region"
    aria-labelledby={`header-${id}`}
    hidden={!isOpen()}
  >
    Panel content
  </div>
</div>
```

### Tooltip

```tsx
<button
  aria-describedby={isVisible() ? 'tooltip-id' : undefined}
  onMouseEnter={() => setIsVisible(true)}
  onMouseLeave={() => setIsVisible(false)}
  onFocus={() => setIsVisible(true)}
  onBlur={() => setIsVisible(false)}
>
  Hover me
</button>

<Show when={isVisible()}>
  <div role="tooltip" id="tooltip-id">
    Tooltip content
  </div>
</Show>
```

### Form Inputs

```tsx
// Text input with label and error
<div>
  <label for="email-input">Email</label>
  <input
    id="email-input"
    type="email"
    aria-invalid={hasError()}
    aria-describedby={hasError() ? 'email-error' : undefined}
    required
  />
  <Show when={hasError()}>
    <span id="email-error" role="alert">
      Please enter a valid email
    </span>
  </Show>
</div>

// Checkbox
<div>
  <input
    type="checkbox"
    id="terms"
    aria-describedby="terms-description"
  />
  <label for="terms">Accept terms</label>
  <p id="terms-description">
    By checking this box you agree to our terms of service.
  </p>
</div>
```

### Data Table

```tsx
<table role="grid" aria-label="User data">
  <thead>
    <tr>
      <th scope="col" aria-sort={getSortDirection('name')}>Name</th>
      <th scope="col" aria-sort={getSortDirection('email')}>Email</th>
    </tr>
  </thead>
  <tbody>
    <For each={rows}>
      {(row) => (
        <tr>
          <td>{row.name}</td>
          <td>{row.email}</td>
        </tr>
      )}
    </For>
  </tbody>
</table>

// With row selection
<tr
  role="row"
  aria-selected={isSelected()}
  tabIndex={isFocused() ? 0 : -1}
>
```

### Pagination

```tsx
<nav aria-label="Pagination">
  <ul>
    <li>
      <button aria-label="Previous page" disabled={currentPage() === 1}>
        Previous
      </button>
    </li>
    <For each={pages}>
      {(page) => (
        <li>
          <button
            aria-label={`Page ${page}`}
            aria-current={currentPage() === page ? 'page' : undefined}
          >
            {page}
          </button>
        </li>
      )}
    </For>
    <li>
      <button aria-label="Next page" disabled={currentPage() === totalPages()}>
        Next
      </button>
    </li>
  </ul>
</nav>
```

### Alert/Toast

```tsx
// For important messages that need immediate attention
<div role="alert" aria-live="assertive">
  Error: Something went wrong
</div>

// For status updates that can wait
<div role="status" aria-live="polite">
  Changes saved successfully
</div>
```

### Tabs

```tsx
<div>
  <div role="tablist" aria-label="Content tabs">
    <For each={tabs}>
      {(tab, index) => (
        <button
          role="tab"
          aria-selected={selectedTab() === index()}
          aria-controls={`panel-${index()}`}
          id={`tab-${index()}`}
          tabIndex={selectedTab() === index() ? 0 : -1}
        >
          {tab.label}
        </button>
      )}
    </For>
  </div>

  <For each={tabs}>
    {(tab, index) => (
      <div
        role="tabpanel"
        id={`panel-${index()}`}
        aria-labelledby={`tab-${index()}`}
        hidden={selectedTab() !== index()}
        tabIndex={0}
      >
        {tab.content}
      </div>
    )}
  </For>
</div>
```

## Focus Management

### Focus Trap for Modals

```typescript
function useFocusTrap(containerRef: Accessor<HTMLElement | undefined>) {
  createEffect(() => {
    const container = containerRef();
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    onCleanup(() => {
      container.removeEventListener('keydown', handleKeyDown);
    });
  });
}
```

### Return Focus on Close

```typescript
function useReturnFocus() {
  let previousActiveElement: Element | null = null;

  const saveFocus = () => {
    previousActiveElement = document.activeElement;
  };

  const restoreFocus = () => {
    if (previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus();
    }
  };

  return { saveFocus, restoreFocus };
}
```

## Color Contrast Requirements

### Text Contrast Ratios

| Text Type          | Minimum Ratio | Example           |
| ------------------ | ------------- | ----------------- |
| Normal text        | 4.5:1         | Body text, labels |
| Large text (18pt+) | 3:1           | Headings          |
| UI components      | 3:1           | Buttons, inputs   |

### Common Issues in This Codebase

1. **Gray text on white:** `text-gray-400` on white may fail contrast
2. **Disabled states:** Ensure disabled text still meets 3:1 minimum
3. **Placeholder text:** Often too light - use `text-gray-600` minimum

## Testing Checklist

### Keyboard Navigation

- [ ] All interactive elements reachable via Tab
- [ ] Focus order follows visual layout
- [ ] Focus visible on all elements
- [ ] No keyboard traps
- [ ] ESC closes modals/dropdowns
- [ ] Enter/Space activate buttons
- [ ] Arrow keys navigate within components

### Screen Reader

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Error messages announced
- [ ] Dynamic content announced
- [ ] Headings structure logical
- [ ] Tables have headers
- [ ] Links have descriptive text

### Visual

- [ ] Text contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Works at 200% zoom
- [ ] No content lost on resize
- [ ] Color not only indicator

## Tools for Testing

1. **axe DevTools** - Browser extension for automated testing
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Chrome DevTools accessibility audit
4. **NVDA/VoiceOver** - Screen reader testing
5. **Contrast Checker** - WebAIM contrast checker
