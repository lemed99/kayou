# Accessibility Standards for SolidJS Components

Based on WCAG 2.1 Level AA and ARIA Authoring Practices Guide (APG).

## Core Principles (POUR)

1. **Perceivable** - Information must be presentable to users in ways they can perceive
2. **Operable** - Interface components must be operable
3. **Understandable** - Information and operation must be understandable
4. **Robust** - Content must be robust enough for assistive technologies

## Keyboard Navigation Requirements

### Standard Keyboard Patterns

| Key           | Action                                                 |
| ------------- | ------------------------------------------------------ |
| `Tab`         | Move focus to next focusable element                   |
| `Shift + Tab` | Move focus to previous focusable element               |
| `Enter`       | Activate buttons, links, submit forms                  |
| `Space`       | Activate buttons, toggle checkboxes                    |
| `Escape`      | Close dialogs, cancel operations, clear search         |
| `Arrow Keys`  | Navigate within composite widgets (menus, tabs, lists) |
| `Home`        | Move to first item/start                               |
| `End`         | Move to last item/end                                  |

### Component-Specific Patterns

#### Button

```typescript
// Required keyboard support
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
  Click Me
</button>
```

#### Dialog/Modal

```typescript
// Required keyboard behavior:
// - Trap focus inside dialog
// - Escape closes dialog
// - Return focus to trigger on close

function Dialog(props: DialogProps) {
  let dialogRef: HTMLDialogElement | undefined
  let closeButtonRef: HTMLButtonElement | undefined

  createEffect(() => {
    if (props.open && dialogRef) {
      // Save current focus
      const previousFocus = document.activeElement as HTMLElement

      // Open and focus
      dialogRef.showModal()
      closeButtonRef?.focus()

      // Handle escape
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          props.onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)

      onCleanup(() => {
        document.removeEventListener('keydown', handleEscape)
        // Restore focus
        previousFocus?.focus()
      })
    }
  })

  return (
    <dialog ref={dialogRef} aria-labelledby="dialog-title">
      <h2 id="dialog-title">{props.title}</h2>
      {props.children}
      <button ref={closeButtonRef} onClick={props.onClose}>
        Close
      </button>
    </dialog>
  )
}
```

#### Dropdown/Select

```typescript
// Arrow keys navigate options
// Enter/Space selects
// Type-ahead support
// Home/End go to first/last

function Dropdown(props: DropdownProps) {
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [isOpen, setIsOpen] = createSignal(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, props.options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setSelectedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setSelectedIndex(props.options.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        props.onSelect(props.options[selectedIndex()])
        setIsOpen(false)
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      role="combobox"
      aria-expanded={isOpen()}
      aria-haspopup="listbox"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Implementation */}
    </div>
  )
}
```

## ARIA Attributes

### Essential ARIA Attributes

#### role

Defines what the element is:

```typescript
<div role="button" tabIndex={0} onClick={handleClick}>
  Click Me
</div>

<nav role="navigation">...</nav>
<div role="dialog" aria-modal="true">...</div>
<ul role="list">...</ul>
<div role="status" aria-live="polite">...</div>
```

#### aria-label

Provides accessible name when visual label isn't present:

```typescript
<button aria-label="Close dialog">
  <XIcon />
</button>

<input type="search" aria-label="Search products" />
```

#### aria-labelledby

References another element as the label:

```typescript
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
  ...
</div>
```

#### aria-describedby

References element(s) that describe this one:

```typescript
<input
  type="password"
  aria-describedby="password-requirements"
/>
<div id="password-requirements">
  Must be at least 8 characters
</div>
```

#### aria-expanded

Indicates if element is expanded:

```typescript
<button
  aria-expanded={isOpen()}
  aria-controls="menu-list"
  onClick={() => setIsOpen(!isOpen())}
>
  Menu
</button>
<ul id="menu-list" hidden={!isOpen()}>
  ...
</ul>
```

#### aria-hidden

Hides from assistive technology:

```typescript
<div>
  <span aria-hidden="true">★</span>
  <span class="sr-only">Rated 5 stars</span>
</div>
```

#### aria-live

Announces dynamic changes:

```typescript
// Polite: wait for pause
<div aria-live="polite" aria-atomic="true">
  {statusMessage()}
</div>

// Assertive: interrupt
<div aria-live="assertive">
  {errorMessage()}
</div>
```

#### aria-invalid & aria-errormessage

For form validation:

```typescript
<input
  type="email"
  aria-invalid={!isValid()}
  aria-describedby={!isValid() ? "email-error" : undefined}
/>
<Show when={!isValid()}>
  <div id="email-error" role="alert">
    Please enter a valid email
  </div>
</Show>
```

### Component ARIA Patterns

#### Button

```typescript
<button
  type="button"  // Explicit type
  aria-pressed={isPressed()}  // For toggle buttons
  aria-disabled={isDisabled()}  // Better than disabled attribute
>
  {props.children}
</button>
```

#### Link

```typescript

  href={props.href}
  aria-current={isCurrent() ? "page" : undefined}
  aria-label={props.external ? `${props.children} (opens in new tab)` : undefined}
  target={props.external ? "_blank" : undefined}
  rel={props.external ? "noopener noreferrer" : undefined}
>
  {props.children}
</a>
```

#### Checkbox

```typescript
<label>
  <input
    type="checkbox"
    checked={isChecked()}
    onChange={(e) => setChecked(e.currentTarget.checked)}
    aria-checked={isChecked()}
    aria-describedby="checkbox-help"
  />
  {props.label}
</label>
<div id="checkbox-help">{props.helpText}</div>
```

#### Radio Group

```typescript
<div role="radiogroup" aria-labelledby="group-label">
  <div id="group-label">{props.groupLabel}</div>
  <For each={props.options}>
    {(option) => (
      <label>
        <input
          type="radio"
          name={props.name}
          value={option.value}
          checked={selected() === option.value}
          onChange={() => setSelected(option.value)}
        />
        {option.label}
      </label>
    )}
  </For>
</div>
```

#### Tabs

```typescript
<div>
  <div role="tablist" aria-label="Account settings">
    <For each={tabs()}>
      {(tab, index) => (
        <button
          role="tab"
          aria-selected={selectedIndex() === index()}
          aria-controls={`panel-${index()}`}
          id={`tab-${index()}`}
          tabIndex={selectedIndex() === index() ? 0 : -1}
          onClick={() => setSelectedIndex(index())}
        >
          {tab.label}
        </button>
      )}
    </For>
  </div>

  <For each={tabs()}>
    {(tab, index) => (
      <div
        role="tabpanel"
        id={`panel-${index()}`}
        aria-labelledby={`tab-${index()}`}
        hidden={selectedIndex() !== index()}
      >
        {tab.content}
      </div>
    )}
  </For>
</div>
```

## Focus Management

### Focus Indicators

```css
/* Never remove focus styles without replacement! */

/* ❌ WRONG */
*:focus {
  outline: none;
}

/* ✅ CORRECT - Provide alternative */
*:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
```

### Focus Trap (for modals)

```typescript
function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTab);
  firstElement.focus();

  return () => {
    element.removeEventListener('keydown', handleTab);
  };
}
```

### Skip Links

```typescript
// For main site navigation
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Content */}
</main>

/* CSS */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## Color and Contrast

### Contrast Requirements (WCAG AA)

- **Normal text:** 4.5:1 contrast ratio
- **Large text (18pt+ or 14pt+ bold):** 3:1 contrast ratio
- **UI components and graphics:** 3:1 contrast ratio

```typescript
// Check contrast programmatically
function meetsContrastRequirements(
  foreground: string,
  background: string,
  fontSize: number,
  isBold: boolean,
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
  const required = isLargeText ? 3 : 4.5;

  return ratio >= required;
}
```

### Color Not Sole Indicator

```typescript
// ❌ WRONG - Color only
<div style={{ color: 'red' }}>Error</div>
<div style={{ color: 'green' }}>Success</div>

// ✅ CORRECT - Color + icon/text
<div style={{ color: 'red' }}>
  <ErrorIcon aria-hidden="true" />
  <span>Error: Form submission failed</span>
</div>

<div style={{ color: 'green' }}>
  <CheckIcon aria-hidden="true" />
  <span>Success: Form submitted</span>
</div>
```

## Motion and Animation

### Respect prefers-reduced-motion

```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```typescript
// In SolidJS
function AnimatedComponent() {
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      classList={{
        'animate-fade-in': !prefersReducedMotion(),
        'no-animation': prefersReducedMotion()
      }}
    >
      {props.children}
    </div>
  )
}
```

## Screen Reader Support

### Visually Hidden but Screen Reader Visible

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```typescript
<button>
  <TrashIcon aria-hidden="true" />
  <span class="sr-only">Delete item</span>
</button>
```

### Live Regions for Dynamic Content

```typescript
function Toast() {
  const [message, setMessage] = createSignal('')

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="toast"
    >
      {message()}
    </div>
  )
}
```

## Form Accessibility

### Label Every Input

```typescript
// ✅ Explicit label
<label for="email">Email:</label>
<input id="email" type="email" />

// ✅ Wrapping label
<label>
  Email:
  <input type="email" />
</label>

// ✅ aria-label as fallback
<input
  type="search"
  aria-label="Search products"
  placeholder="Search..."
/>
```

### Error Handling

```typescript
function FormField(props: FormFieldProps) {
  const [error, setError] = createSignal('')

  return (
    <div>
      <label for={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        aria-invalid={!!error()}
        aria-describedby={error() ? `${props.id}-error` : undefined}
      />
      <Show when={error()}>
        <div
          id={`${props.id}-error`}
          role="alert"
          class="error-message"
        >
          {error()}
        </div>
      </Show>
    </div>
  )
}
```

### Required Fields

```typescript
<label for="name">
  Name
  <span aria-label="required">*</span>
</label>
<input
  id="name"
  required
  aria-required="true"
/>
```

## Testing Checklist

### Manual Testing

- [ ] Can navigate entire interface with keyboard only
- [ ] Focus indicators are always visible
- [ ] Screen reader announces all important content
- [ ] No keyboard traps
- [ ] Tab order is logical
- [ ] All interactive elements are focusable
- [ ] Color is not the only indicator
- [ ] Text has sufficient contrast
- [ ] Works with browser zoom at 200%
- [ ] Respects prefers-reduced-motion

### Automated Testing

```bash
# Install tools
npm install --save-dev @axe-core/cli pa11y

# Run tests
npx axe http://localhost:3000
npx pa11y http://localhost:3000
```

```typescript
// In unit tests
import { render } from '@solidjs/testing-library'
import { axe } from 'jest-axe'

test('Button has no accessibility violations', async () => {
  const { container } = render(() => <Button>Click</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Resources

- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- WebAIM: https://webaim.org/
- Deque Axe: https://www.deque.com/axe/
