# Common Anti-Patterns to Avoid

## Critical Anti-Patterns (Never Do These)

### 1. Destructuring Props ❌

```typescript
// WRONG - Breaks reactivity completely
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

// CORRECT
function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>
}
```

**Why it's wrong:** Props are reactive proxies. Destructuring reads the value once and loses reactivity.

### 2. Using React Hooks ❌

```typescript
// WRONG - This is React, not Solid
import { useState, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // ...
  }, [count])
}

// CORRECT - Use Solid primitives
import { createSignal, createEffect } from 'solid-js'

function Counter() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    // Automatically tracks count()
  })
}
```

### 3. Creating Signals Inside JSX ❌

```typescript
// WRONG - Creates new signal on every render
function Bad() {
  return <div>{createSignal(0)[0]()}</div>
}

// CORRECT - Create signals at component scope
function Good() {
  const [count] = createSignal(0)
  return <div>{count()}</div>
}
```

### 4. Forgetting Effect Cleanup ❌

```typescript
// WRONG - Memory leak
function Timer() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    setInterval(() => setCount(c => c + 1), 1000)
    // Interval never cleaned up!
  })
}

// CORRECT - Always clean up
function Timer() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    const interval = setInterval(() => setCount(c => c + 1), 1000)
    onCleanup(() => clearInterval(interval))
  })
}
```

### 5. Using any Types ❌

```typescript
// WRONG - No type safety
interface ButtonProps {
  onClick: any;
  children: any;
}

// CORRECT - Proper types
interface ButtonProps {
  onClick?: (e: MouseEvent) => void;
  children: JSX.Element;
}
```

## Performance Anti-Patterns

### 1. Not Using createMemo for Expensive Operations ❌

```typescript
// WRONG - Recalculates on every access
function UserList() {
  const [users, setUsers] = createSignal(largeArray)
  const [filter, setFilter] = createSignal('')

  const filtered = () => {
    // Expensive operation runs on EVERY render
    return users().filter(u => u.name.includes(filter()))
  }
}

// CORRECT - Memoize expensive computations
function UserList() {
  const [users, setUsers] = createSignal(largeArray)
  const [filter, setFilter] = createSignal('')

  const filtered = createMemo(() => {
    // Only runs when users() or filter() change
    return users().filter(u => u.name.includes(filter()))
  })
}
```

### 2. Creating Effects for Derived Values ❌

```typescript
// WRONG - Using effect for derived state
function FullName() {
  const [first, setFirst] = createSignal('John')
  const [last, setLast] = createSignal('Doe')
  const [full, setFull] = createSignal('')

  createEffect(() => {
    setFull(`${first()} ${last()}`)  // Unnecessary effect!
  })
}

// CORRECT - Just use a function or createMemo
function FullName() {
  const [first, setFirst] = createSignal('John')
  const [last, setLast] = createSignal('Doe')

  const full = () => `${first()} ${last()}`
  // Or: const full = createMemo(() => `${first()} ${last()}`)
}
```

### 3. Overusing createMemo ❌

```typescript
// WRONG - Unnecessary memo for simple operations
const doubled = createMemo(() => count() * 2)
const formatted = createMemo(() => `Value: ${value()}`)

// CORRECT - Use functions for simple operations
const doubled = () => count() * 2
const formatted = () => `Value: ${value()}`

// Use createMemo only for:
// - Expensive computations
// - Large array operations
// - Complex transformations
```

### 4. Not Batching Multiple Updates ❌

```typescript
// WRONG - Triggers 3 separate renders
function updateUser() {
  setName('John')
  setAge(30)
  setEmail('john@example.com')
}

// CORRECT - Batch updates into one render
import { batch } from 'solid-js'

function updateUser() {
  batch(() => {
    setName('John')
    setAge(30)
    setEmail('john@example.com')
  })
}
```

## TypeScript Anti-Patterns

### 1. Using Type Assertions ❌

```typescript
// WRONG - Bypasses type checking
const value = getData() as string
const element = document.querySelector('.button') as HTMLButtonElement

// CORRECT - Use type guards
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

const value = getData()
if (isString(value)) {
  // TypeScript knows value is string
}
```

### 2. Optional Chaining Everywhere ❌

```typescript
// WRONG - Masks real type issues
function Component(props: Props) {
  return <div>{props.user?.name?.first?.toUpperCase?.()}</div>
}

// CORRECT - Handle null/undefined explicitly
function Component(props: Props) {
  if (!props.user?.name?.first) {
    return <div>No name available</div>
  }

  return <div>{props.user.name.first.toUpperCase()}</div>
}
```

### 3. Ignoring TypeScript Errors ❌

```typescript
// WRONG - Suppressing errors
// @ts-ignore
const result = dangerousFunction()

// @ts-expect-error
props.onInvalidProp()

// CORRECT - Fix the actual issue
const result = dangerousFunction() as SomeType
// Or better: improve the types
```

## Component API Anti-Patterns

### 1. Inconsistent Prop Names ❌

```typescript
// WRONG - Mixed naming conventions
interface ComponentProps {
  isOpen: boolean;
  disabled: boolean; // Should be isDisabled
  has_error: boolean; // Should be hasError
  OnClick: () => void; // Should be onClick
}

// CORRECT - Consistent naming
interface ComponentProps {
  isOpen: boolean;
  isDisabled: boolean;
  hasError: boolean;
  onClick: () => void;
}
```

### 2. Not Spreading Rest Props ❌

```typescript
// WRONG - Doesn't support className, style, etc.
function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick}>
      {props.children}
    </button>
  )
}

// CORRECT - Spread rest props
function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['children', 'onClick'])

  return (
    <button onClick={local.onClick} {...others}>
      {local.children}
    </button>
  )
}
```

### 3. Hardcoding Element Types ❌

```typescript
// WRONG - Always renders as div
function Box(props: BoxProps) {
  return <div {...props}>{props.children}</div>
}

// CORRECT - Allow element customization
function Box(props: BoxProps & { as?: string }) {
  return (
    <Dynamic component={props.as || 'div'} {...props}>
      {props.children}
    </Dynamic>
  )
}
```

## Accessibility Anti-Patterns

### 1. Missing Keyboard Support ❌

```typescript
// WRONG - Only works with mouse
function Dropdown() {
  return (
    <div onClick={() => setOpen(!open())}>
      Click me
    </div>
  )
}

// CORRECT - Keyboard accessible
function Dropdown() {
  return (
    <button
      onClick={() => setOpen(!open())}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setOpen(!open())
        }
      }}
    >
      Click me
    </button>
  )
}
```

### 2. Removing Focus Indicators ❌

```css
/* WRONG - Removes focus for everyone */
*:focus {
  outline: none;
}

/* CORRECT - Provide alternative */
*:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

### 3. Using Div as Button ❌

```typescript
// WRONG - Not keyboard accessible, no semantics
<div onClick={handleClick} class="button">
  Click me
</div>

// CORRECT - Use proper button element
<button onClick={handleClick} class="button">
  Click me
</button>

// Or if you must use div
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
  class="button"
>
  Click me
</div>
```

### 4. Missing Alt Text ❌

```typescript
// WRONG
<img src="photo.jpg" />

// CORRECT
<img src="photo.jpg" alt="Description of image" />

// Or if decorative
<img src="decorative.jpg" alt="" role="presentation" />
```

## State Management Anti-Patterns

### 1. Prop Drilling ❌

```typescript
// WRONG - Passing props through many levels
function App() {
  const [user, setUser] = createSignal(userData)
  return <Layout user={user} />
}

function Layout(props) {
  return <Sidebar user={props.user} />
}

function Sidebar(props) {
  return <UserMenu user={props.user} />
}

// CORRECT - Use context
const UserContext = createContext()

function App() {
  const [user, setUser] = createSignal(userData)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  )
}

function UserMenu() {
  const { user } = useContext(UserContext)
  return <div>{user().name}</div>
}
```

### 2. Too Many Signals ❌

```typescript
// WRONG - Too granular
const [firstName, setFirstName] = createSignal('');
const [lastName, setLastName] = createSignal('');
const [email, setEmail] = createSignal('');
const [phone, setPhone] = createSignal('');
const [address, setAddress] = createSignal('');
// ... 20 more fields

// CORRECT - Use store for related data
const [form, setForm] = createStore({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
});

// Update specific field
setForm('email', 'new@email.com');
```

## Testing Anti-Patterns

### 1. Testing Implementation Details ❌

```typescript
// WRONG - Testing internal state
test('increments counter', () => {
  const { container } = render(() => <Counter />)
  const counter = container.querySelector('.counter')
  expect(counter.textContent).toBe('0')

  // This tests implementation, not behavior
  expect(counter.__internalState.count).toBe(0)
})

// CORRECT - Test behavior
test('increments counter', () => {
  const { getByRole, getByText } = render(() => <Counter />)

  expect(getByText('0')).toBeInTheDocument()

  const button = getByRole('button', { name: 'Increment' })
  button.click()

  expect(getByText('1')).toBeInTheDocument()
})
```

### 2. Not Testing Accessibility ❌

```typescript
// WRONG - Only tests functionality
test('button works', () => {
  const onClick = vi.fn()
  const { getByText } = render(() => <Button onClick={onClick}>Click</Button>)

  getByText('Click').click()
  expect(onClick).toHaveBeenCalled()
})

// CORRECT - Also test accessibility
test('button is accessible', async () => {
  const onClick = vi.fn()
  const { container, getByRole } = render(() =>
    <Button onClick={onClick}>Click</Button>
  )

  // Has proper role
  const button = getByRole('button')
  expect(button).toBeInTheDocument()

  // Is keyboard accessible
  button.focus()
  fireEvent.keyDown(button, { key: 'Enter' })
  expect(onClick).toHaveBeenCalled()

  // No accessibility violations
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Documentation Anti-Patterns

### 1. Missing Prop Documentation ❌

```typescript
// WRONG - No documentation
interface ButtonProps {
  variant: string;
  size: number;
  onClick: Function;
}

// CORRECT - Comprehensive documentation
interface ButtonProps {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Click event handler
   */
  onClick?: (event: MouseEvent) => void;
}
```

### 2. Outdated Examples ❌

````typescript
// WRONG - Example uses old API
/**
 * Button component
 *
 * @example
 * ```tsx
 * <Button type="primary">Click</Button>  // 'type' is deprecated!
 * ```
 */

// CORRECT - Example uses current API
/**
 * Button component
 *
 * @example
 * ```tsx
 * <Button variant="primary">Click</Button>
 * ```
 */
````

## Build & Bundle Anti-Patterns

### 1. Not Using Code Splitting ❌

```typescript
// WRONG - Imports everything upfront
import { HeavyChart } from './heavy-chart'
import { HeavyEditor } from './heavy-editor'
import { HeavyMap } from './heavy-map'

// CORRECT - Lazy load heavy components
const HeavyChart = lazy(() => import('./heavy-chart'))
const HeavyEditor = lazy(() => import('./heavy-editor'))
const HeavyMap = lazy(() => import('./heavy-map'))
```

### 2. Importing Entire Libraries ❌

```typescript
// WRONG - Imports entire lodash
import _ from 'lodash'
_.debounce(fn, 300)

// CORRECT - Import only what you need
import debounce from 'lodash/debounce'
debounce(fn, 300)

// Or use native methods when possible
const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
```
