# Fix Patterns Reference

Quick copy-paste patterns for common fixes.

## Type Safety Fixes

### Add Props Interface

**Before:**
```typescript
function Component(props) {
  return <div>{props.value}</div>
}
```

**After:**
```typescript
import { JSX } from 'solid-js'

interface ComponentProps {
  value: string
  onChange?: (value: string) => void
  class?: string
  children?: JSX.Element
}

function Component(props: ComponentProps): JSX.Element {
  return <div class={props.class}>{props.value}</div>
}
```

### Replace `any` Type

**Before:**
```typescript
interface Props {
  data: any
  onChange: any
  options: any[]
}
```

**After:**
```typescript
interface DataItem {
  id: string
  name: string
}

interface Props {
  data: DataItem | null
  onChange: (value: DataItem) => void
  options: DataItem[]
}
```

### Type Event Handlers

**Before:**
```typescript
interface Props {
  onClick?: Function
  onChange?: (e: any) => void
}
```

**After:**
```typescript
interface Props {
  onClick?: (event: MouseEvent) => void
  onChange?: (value: string, event: InputEvent) => void
}
```

## SolidJS Reactivity Fixes

### Fix Props Destructuring (CRITICAL)

**Before:**
```typescript
function Button({ variant, size, onClick, disabled, children }) {
  return (
    <button
      class={getClass(variant, size)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

**After:**
```typescript
function Button(props: ButtonProps): JSX.Element {
  return (
    <button
      class={getClass(props.variant, props.size)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}
```

### Add splitProps

**Before:**
```typescript
function Input(props: InputProps) {
  return (
    <div>
      <label>{props.label}</label>
      <input
        type={props.type}
        value={props.value}
        class={props.class}
        placeholder={props.placeholder}
        // Missing: id, name, required, disabled, etc.
      />
    </div>
  )
}
```

**After:**
```typescript
import { splitProps } from 'solid-js'

function Input(props: InputProps): JSX.Element {
  const [local, inputProps] = splitProps(props, [
    'label',
    'class',
    'helperText',
    'error',
  ])

  return (
    <div>
      <label>{local.label}</label>
      <input
        class={twMerge(theme.input, local.class)}
        {...inputProps}
      />
      <Show when={local.helperText}>
        <span class="helper">{local.helperText}</span>
      </Show>
    </div>
  )
}
```

### Add createMemo for Defaults

**Before:**
```typescript
function Component(props: Props) {
  const variant = props.variant || 'default'
  const size = props.size || 'md'

  return <div class={theme[variant][size]} />
}
```

**After:**
```typescript
import { createMemo } from 'solid-js'

function Component(props: Props): JSX.Element {
  const variant = createMemo(() => props.variant || 'default')
  const size = createMemo(() => props.size || 'md')

  return <div class={theme[variant()][size()]} />
}
```

### Add Effect Cleanup

**Before:**
```typescript
createEffect(() => {
  const handler = () => console.log('resize')
  window.addEventListener('resize', handler)
})
```

**After:**
```typescript
import { createEffect, onCleanup } from 'solid-js'

createEffect(() => {
  const handler = () => console.log('resize')
  window.addEventListener('resize', handler)

  onCleanup(() => {
    window.removeEventListener('resize', handler)
  })
})
```

### Replace Effect with Memo (Derived State)

**Before:**
```typescript
function Component() {
  const [items, setItems] = createSignal([])
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    setCount(items().length)
  })

  return <div>Count: {count()}</div>
}
```

**After:**
```typescript
function Component(): JSX.Element {
  const [items, setItems] = createSignal([])

  const count = createMemo(() => items().length)

  return <div>Count: {count()}</div>
}
```

## Accessibility Fixes

### Add aria-label to Icon Button

**Before:**
```typescript
<button onClick={onClose}>
  <XIcon />
</button>
```

**After:**
```typescript
<button
  onClick={onClose}
  aria-label="Close dialog"
>
  <XIcon aria-hidden="true" />
</button>
```

### Add Keyboard Support

**Before:**
```typescript
<div
  class="option"
  onClick={() => selectOption(option)}
>
  {option.label}
</div>
```

**After:**
```typescript
<div
  role="option"
  class="option"
  tabIndex={0}
  aria-selected={isSelected(option)}
  onClick={() => selectOption(option)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectOption(option)
    }
  }}
>
  {option.label}
</div>
```

### Add Form Label Association

**Before:**
```typescript
<div>
  <span>Email</span>
  <input type="email" />
</div>
```

**After:**
```typescript
<div>
  <label for="email-input">Email</label>
  <input
    id="email-input"
    type="email"
    aria-describedby={hasError() ? 'email-error' : undefined}
  />
  <Show when={hasError()}>
    <span id="email-error" role="alert">
      {errorMessage()}
    </span>
  </Show>
</div>
```

### Add aria-expanded

**Before:**
```typescript
<button onClick={toggle}>
  {isOpen() ? 'Collapse' : 'Expand'}
</button>
<Show when={isOpen()}>
  <div class="content">{content}</div>
</Show>
```

**After:**
```typescript
<button
  aria-expanded={isOpen()}
  aria-controls="panel-content"
  onClick={toggle}
>
  {isOpen() ? 'Collapse' : 'Expand'}
</button>
<Show when={isOpen()}>
  <div
    id="panel-content"
    role="region"
    class="content"
  >
    {content}
  </div>
</Show>
```

### Add Focus Trap to Modal

**Before:**
```typescript
function Modal(props: ModalProps) {
  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="modal">
          {props.children}
        </div>
      </Portal>
    </Show>
  )
}
```

**After:**
```typescript
function Modal(props: ModalProps): JSX.Element {
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>()
  const { save: saveFocus, restore: restoreFocus } = createReturnFocus()

  createEffect(() => {
    if (props.isOpen) {
      saveFocus()

      // Focus first focusable element
      const modal = modalRef()
      if (modal) {
        const focusable = modal.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        focusable?.focus()
      }

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') props.onClose?.()
      }
      document.addEventListener('keydown', handleEscape)

      onCleanup(() => {
        document.removeEventListener('keydown', handleEscape)
        restoreFocus()
      })
    }
  })

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div
          class="backdrop"
          aria-hidden="true"
          onClick={props.onClose}
        />
        <div
          ref={setModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="modal"
        >
          {props.children}
        </div>
      </Portal>
    </Show>
  )
}
```

## API Design Fixes

### Add Rest Props Spreading

**Before:**
```typescript
function Card(props: CardProps) {
  return (
    <div class="card">
      {props.children}
    </div>
  )
}
```

**After:**
```typescript
function Card(props: CardProps): JSX.Element {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <div class={twMerge('card', local.class)} {...others}>
      {local.children}
    </div>
  )
}
```

### Add twMerge for Class Composition

**Before:**
```typescript
<button class={`${theme.base} ${props.class}`}>
```

**After:**
```typescript
import { twMerge } from 'tailwind-merge'

<button class={twMerge(theme.base, theme.variant[variant()], props.class)}>
```

## Performance Fixes

### Add createMemo for Expensive Computation

**Before:**
```typescript
function UserList(props: { users: User[] }) {
  const [filter, setFilter] = createSignal('')

  const filteredUsers = () =>
    props.users
      .filter(u => u.name.includes(filter()))
      .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <For each={filteredUsers()}>
      {user => <UserCard user={user} />}
    </For>
  )
}
```

**After:**
```typescript
function UserList(props: { users: User[] }): JSX.Element {
  const [filter, setFilter] = createSignal('')

  const filteredUsers = createMemo(() =>
    props.users
      .filter(u => u.name.includes(filter()))
      .sort((a, b) => a.name.localeCompare(b.name))
  )

  return (
    <For each={filteredUsers()}>
      {user => <UserCard user={user} />}
    </For>
  )
}
```

### Batch Multiple Signal Updates

**Before:**
```typescript
function handleSubmit(data: FormData) {
  setName(data.name)
  setEmail(data.email)
  setPhone(data.phone)
  setStatus('submitted')
}
```

**After:**
```typescript
import { batch } from 'solid-js'

function handleSubmit(data: FormData) {
  batch(() => {
    setName(data.name)
    setEmail(data.email)
    setPhone(data.phone)
    setStatus('submitted')
  })
}
```
