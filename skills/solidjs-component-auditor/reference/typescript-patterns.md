# TypeScript Patterns for SolidJS Components

## Correct Prop Typing

### ✅ CORRECT: Using ComponentProps

```typescript
import { ComponentProps, JSX } from 'solid-js'

// Extend native button props
interface ButtonProps extends ComponentProps<'button'> {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state */
  loading?: boolean
  /** Icon to display (optional) */
  icon?: JSX.Element
}

function Button(props: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      class={`btn btn-${props.variant} btn-${props.size}`}
      disabled={props.disabled || props.loading}
    >
      {props.loading && <Spinner />}
      {props.icon}
      {props.children}
    </button>
  )
}

export default Button
```

### ❌ WRONG: Using `any` or loose types

```typescript
// WRONG - No type safety
function Button(props: any) {
  return <button>{props.children}</button>
}

// WRONG - Missing extends ComponentProps
interface ButtonProps {
  onClick: Function // Too loose!
  children: any     // No type safety!
}
```

## Generic Components

### ✅ CORRECT: Properly constrained generics

```typescript
import { JSX, For } from 'solid-js'

interface SelectProps<T> {
  /** Array of items to display */
  items: T[]
  /** Function to get display value from item */
  getValue: (item: T) => string
  /** Function to get unique key from item */
  getKey: (item: T) => string | number
  /** Selection change handler */
  onSelect: (item: T) => void
  /** Currently selected item */
  selected?: T
}

function Select<T>(props: SelectProps<T>): JSX.Element {
  return (
    <select onChange={(e) => {
      const item = props.items[e.currentTarget.selectedIndex]
      props.onSelect(item)
    }}>
      <For each={props.items}>
        {(item) => (
          <option
            value={props.getKey(item)}
            selected={item === props.selected}
          >
            {props.getValue(item)}
          </option>
        )}
      </For>
    </select>
  )
}

// Usage with full type inference
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

<Select
  items={users}
  getValue={(user) => user.name}    // user is typed as { id: number, name: string }
  getKey={(user) => user.id}
  onSelect={(user) => console.log(user.name)}
/>
```

## Event Handler Types

### ✅ CORRECT: Specific event types

```typescript
interface InputProps extends ComponentProps<'input'> {
  /** Value change handler with typed event */
  onValueChange?: (value: string, event: InputEvent) => void
  /** Blur handler */
  onBlur?: (event: FocusEvent) => void
  /** Key press handler */
  onKeyPress?: (event: KeyboardEvent) => void
}

function Input(props: InputProps): JSX.Element {
  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    props.onValueChange?.(e.currentTarget.value, e)
  }

  return (
    <input
      {...props}
      onInput={handleInput}
      onBlur={props.onBlur}
      onKeyPress={props.onKeyPress}
    />
  )
}
```

### ❌ WRONG: Loose event types

```typescript
interface InputProps {
  onChange?: (e: any) => void; // WRONG - no type safety
  onBlur?: Function; // WRONG - too generic
}
```

## Ref Types

### ✅ CORRECT: Typed refs

```typescript
import { createSignal, onMount } from 'solid-js'

interface ModalProps {
  children: JSX.Element
  open: boolean
}

function Modal(props: ModalProps): JSX.Element {
  let dialogRef: HTMLDialogElement | undefined

  onMount(() => {
    if (props.open && dialogRef) {
      dialogRef.showModal()
    }
  })

  return (
    <dialog ref={dialogRef}>
      {props.children}
    </dialog>
  )
}
```

## Return Types

### ✅ CORRECT: Explicit return types

```typescript
import { JSX, Show } from 'solid-js'

// Always declare return type
function ConditionalRender(props: { show: boolean; children: JSX.Element }): JSX.Element {
  return (
    <Show when={props.show}>
      {props.children}
    </Show>
  )
}

// For components that don't return JSX
function useClickOutside(
  ref: HTMLElement | undefined,
  handler: () => void
): void {
  // Implementation
}
```

## Children Types

### ✅ CORRECT: Proper children typing

```typescript
import { JSX, children } from 'solid-js'

interface CardProps {
  /** Card title */
  title: string
  /** Card content - can be any valid JSX */
  children: JSX.Element
  /** Optional header actions */
  actions?: JSX.Element
}

function Card(props: CardProps): JSX.Element {
  // Resolve children properly
  const resolved = children(() => props.children)

  return (
    <div class="card">
      <div class="card-header">
        <h3>{props.title}</h3>
        {props.actions}
      </div>
      <div class="card-body">
        {resolved()}
      </div>
    </div>
  )
}
```

## Discriminated Unions

### ✅ CORRECT: Type-safe variants

```typescript
// Base props
interface BaseAlertProps {
  title: string
  onClose?: () => void
}

// Success variant
interface SuccessAlertProps extends BaseAlertProps {
  variant: 'success'
  message: string
}

// Error variant with extra fields
interface ErrorAlertProps extends BaseAlertProps {
  variant: 'error'
  error: Error
  retry?: () => void
}

// Warning variant
interface WarningAlertProps extends BaseAlertProps {
  variant: 'warning'
  message: string
  actions?: JSX.Element
}

// Union type
type AlertProps = SuccessAlertProps | ErrorAlertProps | WarningAlertProps

function Alert(props: AlertProps): JSX.Element {
  return (
    <div class={`alert alert-${props.variant}`}>
      <h4>{props.title}</h4>

      {/* TypeScript knows which props are available */}
      {props.variant === 'success' && <p>{props.message}</p>}

      {props.variant === 'error' && (
        <>
          <p>{props.error.message}</p>
          {props.retry && <button onClick={props.retry}>Retry</button>}
        </>
      )}

      {props.variant === 'warning' && (
        <>
          <p>{props.message}</p>
          {props.actions}
        </>
      )}
    </div>
  )
}
```

## Type Guards

### ✅ CORRECT: Runtime type checking

```typescript
function isInputElement(el: Element): el is HTMLInputElement {
  return el.tagName === 'INPUT';
}

function handleFormElement(el: Element) {
  if (isInputElement(el)) {
    // TypeScript knows el is HTMLInputElement here
    console.log(el.value);
  }
}
```

## Common TypeScript Mistakes

### ❌ WRONG: Using `as` instead of proper typing

```typescript
// WRONG
const value = someFunction() as string

// CORRECT - use type guards or proper typing
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

const value = someFunction()
if (isString(value)) {
  // Use value here
}
```

### ❌ WRONG: Optional chaining everywhere

```typescript
// WRONG - masks real type issues
props.onClick?.()
props.data?.items?.forEach?.(...)

// CORRECT - validate and handle properly
if (!props.data?.items) {
  return <EmptyState />
}

props.data.items.forEach(...)
```

## Utility Types

### Useful utility types for components

```typescript
import { ComponentProps, JSX } from 'solid-js';

// Pick specific props from native elements
type ButtonStyleProps = Pick<ComponentProps<'button'>, 'class' | 'style'>;

// Omit props you're handling internally
type CustomInputProps = Omit<ComponentProps<'input'>, 'onChange'> & {
  onValueChange: (value: string) => void;
};

// Make all props optional
type PartialConfig = Partial<ConfigProps>;

// Make all props required
type RequiredConfig = Required<ConfigProps>;

// Extract prop types from existing component
type ButtonPropsType = ComponentProps<typeof Button>;
```

## JSDoc Comments

### ✅ CORRECT: Comprehensive JSDoc

````typescript
interface TooltipProps {
  /**
   * Content to display in tooltip
   * @example
   * ```tsx
   * <Tooltip content="Click to save">
   *   <button>Save</button>
   * </Tooltip>
   * ```
   */
  content: JSX.Element | string;

  /**
   * Placement of tooltip relative to trigger
   * @default 'top'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Delay before showing tooltip (in ms)
   * @default 200
   */
  delay?: number;

  /**
   * Whether tooltip is disabled
   * @default false
   */
  disabled?: boolean;
}
````

## Type Exports

### ✅ CORRECT: Export types for consumers

```typescript
// Consumers can now import types
import { Button, type ButtonProps } from 'your-library';

// In your component file
export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export default function Button(props: ButtonProps): JSX.Element {
  // Implementation
}

// In index.ts - re-export types
export { default as Button } from './Button';
export type { ButtonProps } from './Button';
```
