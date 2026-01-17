# Accessibility Standards Reference

## Quick Reference by Component

### Button

```tsx
// Standard button - no extra ARIA needed
<button type="button" onClick={handler}>
  Label Text
</button>

// Icon-only button - MUST have aria-label
<button type="button" aria-label="Close dialog" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

// Loading button
<button
  type="button"
  aria-busy={isLoading()}
  disabled={isLoading()}
>
  {isLoading() ? 'Saving...' : 'Save'}
</button>

// Toggle button
<button
  type="button"
  aria-pressed={isActive()}
  onClick={toggle}
>
  {isActive() ? 'On' : 'Off'}
</button>
```

### Modal/Dialog

```tsx
<Show when={isOpen()}>
  <Portal>
    {/* Backdrop */}
    <div class="backdrop" aria-hidden="true" onClick={onClose} />

    {/* Dialog */}
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      ref={setDialogRef}
    >
      <h2 id="modal-title">Modal Title</h2>
      <p id="modal-description">Description text</p>

      <button aria-label="Close" onClick={onClose}>
        <XIcon aria-hidden="true" />
      </button>

      {children}
    </div>
  </Portal>
</Show>
```

**Requirements:**

- Focus trapped inside when open
- ESC key closes
- Focus returns to trigger on close
- Background has `aria-hidden="true"`

### Select/Combobox

```tsx
<div class="select-container">
  <label id="select-label">Choose option</label>

  <button
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={isOpen()}
    aria-labelledby="select-label"
    aria-controls="select-listbox"
    aria-activedescendant={highlightedId()}
    onKeyDown={handleKeyDown}
  >
    {selectedLabel() || 'Select...'}
    <ChevronIcon aria-hidden="true" />
  </button>

  <Show when={isOpen()}>
    <ul id="select-listbox" role="listbox" aria-labelledby="select-label">
      <For each={options}>
        {(option, index) => (
          <li
            id={`option-${index()}`}
            role="option"
            aria-selected={isSelected(option)}
            tabIndex={-1}
            onClick={() => select(option)}
          >
            {option.label}
            <Show when={isSelected(option)}>
              <CheckIcon aria-hidden="true" />
            </Show>
          </li>
        )}
      </For>
    </ul>
  </Show>
</div>
```

**Keyboard:**

- `Enter/Space`: Open dropdown, select option
- `ArrowDown/Up`: Navigate options
- `Escape`: Close dropdown
- `Home/End`: First/last option
- Type character: Jump to matching

### Accordion

```tsx
<div class="accordion">
  <For each={panels}>
    {(panel) => (
      <div class="accordion-item">
        <h3>
          <button
            aria-expanded={isOpen(panel.id)}
            aria-controls={`panel-${panel.id}`}
            id={`header-${panel.id}`}
            onClick={() => toggle(panel.id)}
          >
            {panel.title}
            <ChevronIcon aria-hidden="true" class={isOpen(panel.id) ? 'rotate-90' : ''} />
          </button>
        </h3>

        <div
          id={`panel-${panel.id}`}
          role="region"
          aria-labelledby={`header-${panel.id}`}
          hidden={!isOpen(panel.id)}
        >
          {panel.content}
        </div>
      </div>
    )}
  </For>
</div>
```

### Tabs

```tsx
<div class="tabs">
  <div role="tablist" aria-label="Content sections">
    <For each={tabs}>
      {(tab, index) => (
        <button
          role="tab"
          id={`tab-${index()}`}
          aria-selected={activeTab() === index()}
          aria-controls={`panel-${index()}`}
          tabIndex={activeTab() === index() ? 0 : -1}
          onClick={() => setActiveTab(index())}
          onKeyDown={handleTabKeyDown}
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
        hidden={activeTab() !== index()}
        tabIndex={0}
      >
        {tab.content}
      </div>
    )}
  </For>
</div>
```

**Keyboard:**

- `ArrowLeft/Right`: Navigate tabs
- `Home/End`: First/last tab
- `Enter/Space`: Activate tab (if using manual activation)

### Form Input

```tsx
<div class="form-field">
  <label for={inputId}>
    {label}
    <Show when={required}>
      <span aria-hidden="true" class="text-red-500">
        *
      </span>
    </Show>
  </label>

  <input
    id={inputId}
    type={type}
    aria-required={required}
    aria-invalid={hasError()}
    aria-describedby={
      [helperText && `${inputId}-helper`, hasError() && `${inputId}-error`]
        .filter(Boolean)
        .join(' ') || undefined
    }
    value={value()}
    onInput={handleInput}
  />

  <Show when={helperText && !hasError()}>
    <span id={`${inputId}-helper`} class="helper-text">
      {helperText}
    </span>
  </Show>

  <Show when={hasError()}>
    <span id={`${inputId}-error`} class="error-text" role="alert">
      {errorMessage()}
    </span>
  </Show>
</div>
```

### Checkbox

```tsx
<div class="checkbox-wrapper">
  <input
    type="checkbox"
    id={checkboxId}
    checked={isChecked()}
    aria-describedby={description ? `${checkboxId}-desc` : undefined}
    onChange={handleChange}
  />
  <label for={checkboxId}>{label}</label>

  <Show when={description}>
    <span id={`${checkboxId}-desc`} class="description">
      {description}
    </span>
  </Show>
</div>
```

### Tooltip

```tsx
<>
  <button
    ref={setTriggerRef}
    aria-describedby={isVisible() ? tooltipId : undefined}
    onMouseEnter={() => setIsVisible(true)}
    onMouseLeave={() => setIsVisible(false)}
    onFocus={() => setIsVisible(true)}
    onBlur={() => setIsVisible(false)}
  >
    {trigger}
  </button>

  <Show when={isVisible()}>
    <Portal>
      <div id={tooltipId} role="tooltip" ref={setTooltipRef} style={floatingStyles()}>
        {content}
      </div>
    </Portal>
  </Show>
</>
```

### Alert/Toast

```tsx
// Assertive - for errors, requires immediate attention
<div role="alert" aria-live="assertive">
  <AlertIcon aria-hidden="true" />
  Error: {message}
</div>

// Polite - for success/info, can wait
<div role="status" aria-live="polite">
  <CheckIcon aria-hidden="true" />
  {message}
</div>
```

### DataTable

```tsx
<table role="grid" aria-label={tableLabel}>
  <thead>
    <tr role="row">
      <Show when={selectable}>
        <th role="columnheader" scope="col">
          <input
            type="checkbox"
            aria-label="Select all rows"
            checked={allSelected()}
            onChange={toggleSelectAll}
          />
        </th>
      </Show>

      <For each={columns}>
        {(column) => (
          <th role="columnheader" scope="col" aria-sort={getSortDirection(column.key)}>
            <Show when={column.sortable} fallback={column.label}>
              <button onClick={() => sort(column.key)}>
                {column.label}
                <SortIcon aria-hidden="true" />
              </button>
            </Show>
          </th>
        )}
      </For>
    </tr>
  </thead>

  <tbody>
    <For each={rows}>
      {(row, rowIndex) => (
        <tr role="row" aria-selected={isSelected(rowIndex())}>
          <Show when={selectable}>
            <td role="gridcell">
              <input
                type="checkbox"
                aria-label={`Select row ${rowIndex() + 1}`}
                checked={isSelected(rowIndex())}
                onChange={() => toggleSelect(rowIndex())}
              />
            </td>
          </Show>

          <For each={columns}>
            {(column) => (
              <td role="gridcell">
                {column.render?.(row[column.key], row) ?? row[column.key]}
              </td>
            )}
          </For>
        </tr>
      )}
    </For>
  </tbody>
</table>
```

### Pagination

```tsx
<nav aria-label="Pagination navigation">
  <ul class="pagination">
    <li>
      <button
        aria-label="Go to previous page"
        disabled={currentPage() === 1}
        onClick={() => goToPage(currentPage() - 1)}
      >
        <ChevronLeftIcon aria-hidden="true" />
        <span class="sr-only">Previous</span>
      </button>
    </li>

    <For each={pageNumbers()}>
      {(page) => (
        <li>
          <button
            aria-label={`Go to page ${page}`}
            aria-current={currentPage() === page ? 'page' : undefined}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        </li>
      )}
    </For>

    <li>
      <button
        aria-label="Go to next page"
        disabled={currentPage() === totalPages()}
        onClick={() => goToPage(currentPage() + 1)}
      >
        <span class="sr-only">Next</span>
        <ChevronRightIcon aria-hidden="true" />
      </button>
    </li>
  </ul>
</nav>
```

## Focus Management Utilities

### Focus Trap

```typescript
function createFocusTrap(containerRef: Accessor<HTMLElement | undefined>) {
  createEffect(() => {
    const container = containerRef();
    if (!container) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const focusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => !el.hasAttribute('disabled'),
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const elements = focusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Focus first element
    focusableElements()[0]?.focus();

    container.addEventListener('keydown', handleKeyDown);
    onCleanup(() => container.removeEventListener('keydown', handleKeyDown));
  });
}
```

### Return Focus

```typescript
function createReturnFocus() {
  let previousElement: HTMLElement | null = null;

  const save = () => {
    previousElement = document.activeElement as HTMLElement;
  };

  const restore = () => {
    previousElement?.focus();
    previousElement = null;
  };

  return { save, restore };
}
```

## Color Contrast Quick Reference

| Text Type                        | Minimum Ratio | Example Use            |
| -------------------------------- | ------------- | ---------------------- |
| Normal text (< 18pt)             | 4.5:1         | Body text, labels      |
| Large text (≥ 18pt or 14pt bold) | 3:1           | Headings               |
| UI components                    | 3:1           | Buttons, inputs, icons |
| Decorative                       | None          | Backgrounds, borders   |

### Tailwind Classes That May Fail

```
// May fail on white background:
text-gray-400  // ~2.7:1 ratio
text-gray-500  // ~4.5:1 ratio (borderline)

// Safe alternatives:
text-gray-600  // ~5.7:1 ratio
text-gray-700  // ~8.6:1 ratio

// For disabled states (3:1 minimum):
text-gray-500 with bg-gray-100  // Usually passes
```
