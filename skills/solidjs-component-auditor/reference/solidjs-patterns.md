# SolidJS Patterns & Best Practices

Official patterns from SolidJS documentation and community best practices.

## The Golden Rule: Never Destructure Props

### ❌ CRITICAL ANTI-PATTERN: Destructuring

```typescript
// WRONG - BREAKS REACTIVITY
function Button({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// Why this breaks:
// - Props are proxies that track access
// - Destructuring reads the values immediately
// - Future updates to props won't trigger re-renders
// - Reactivity is completely broken
```

### ✅ CORRECT: Access props directly

```typescript
// CORRECT - Preserves reactivity
function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  )
}

// Reactivity works because:
// - props.label is accessed during render
// - SolidJS tracks this access
// - When label changes, component re-renders
```

### ✅ CORRECT: Using splitProps when needed

```typescript
import { splitProps } from 'solid-js'

function Button(props: ButtonProps) {
  // Split props for different purposes
  const [local, others] = splitProps(props, ['variant', 'size'])

  return (
    <button
      {...others}  // Spread remaining props
      class={`btn btn-${local.variant} btn-${local.size}`}
    >
      {props.children}
    </button>
  )
}
```

## Signals vs State

### ✅ CORRECT: Using createSignal

```typescript
import { createSignal } from 'solid-js'

function Counter() {
  // createSignal returns [getter, setter]
  const [count, setCount] = createSignal(0)

  return (
    <div>
      {/* Call getter function to read value */}
      <p>Count: {count()}</p>

      {/* Setter can take a value or updater function */}
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>

      <button onClick={() => setCount(c => c + 1)}>
        Increment (updater form)
      </button>
    </div>
  )
}
```

### ❌ WRONG: Using React patterns

```typescript
// WRONG - This is React, not Solid
import { useState } from 'react';

// NO!

function Counter() {
  const [count, setCount] = useState(0); // WRONG
  return <div>{ count } < /div>  / / Missing();
}
```

## Derived Values with createMemo

### ✅ CORRECT: Memoizing expensive computations

```typescript
import { createSignal, createMemo } from 'solid-js'

function UserList() {
  const [users, setUsers] = createSignal([])
  const [searchTerm, setSearchTerm] = createSignal('')

  // Memoize filtered list
  // Only recomputes when users() or searchTerm() change
  const filteredUsers = createMemo(() => {
    const term = searchTerm().toLowerCase()
    return users().filter(user =>
      user.name.toLowerCase().includes(term)
    )
  })

  return (
    <div>
      <input
        value={searchTerm()}
        onInput={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <For each={filteredUsers()}>
        {(user) => <div>{user.name}</div>}
      </For>
    </div>
  )
}
```

### ❌ WRONG: Recomputing on every render

```typescript
function UserList() {
  const [users, setUsers] = createSignal([])
  const [searchTerm, setSearchTerm] = createSignal('')

  // WRONG - This runs on EVERY render
  // Even if users and searchTerm haven't changed
  const filteredUsers = () => {
    const term = searchTerm().toLowerCase()
    return users().filter(user =>
      user.name.toLowerCase().includes(term)
    )
  }

  return <For each={filteredUsers()}>{...}</For>
}
```

## Effects with Cleanup

### ✅ CORRECT: Effects with proper cleanup

```typescript
import { createSignal, createEffect, onCleanup } from 'solid-js'

function Timer() {
  const [count, setCount] = createSignal(0)
  const [isRunning, setIsRunning] = createSignal(false)

  createEffect(() => {
    if (isRunning()) {
      // Start interval
      const interval = setInterval(() => {
        setCount(c => c + 1)
      }, 1000)

      // IMPORTANT: Clean up on effect re-run or component unmount
      onCleanup(() => {
        clearInterval(interval)
      })
    }
  })

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setIsRunning(!isRunning())}>
        {isRunning() ? 'Stop' : 'Start'}
      </button>
    </div>
  )
}
```

### ❌ WRONG: Missing cleanup (memory leak)

```typescript
function Timer() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    // WRONG - interval never cleared
    setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
    // Memory leak! Interval continues even after component unmounts
  })

  return <div>Count: {count()}</div>
}
```

## Event Handlers

### ✅ CORRECT: SolidJS event syntax

```typescript
function Form() {
  const [value, setValue] = createSignal('')

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    console.log('Submitted:', value())
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* on:input uses native DOM events (lowercase) */}
      <input
        value={value()}
        on:input={(e) => setValue(e.target.value)}
      />

      {/* onInput uses Solid's synthetic events (camelCase) */}
      <input
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />

      <button type="submit">Submit</button>
    </form>
  )
}
```

### Difference: `on:` vs `on`

```typescript
// on:event - Native DOM event (lowercase)
<div on:click={(e) => console.log(e)}>Click me</div>

// onEvent - Solid's synthetic event (camelCase, better TypeScript support)
<div onClick={(e) => console.log(e)}>Click me</div>

// Use onEvent for better TypeScript typing
// Use on:event for capturing phase or when you need the actual DOM event
```

## Control Flow

### ✅ CORRECT: Using Show, For, Switch

```typescript
import { Show, For, Switch, Match } from 'solid-js'

function DataView() {
  const [data, setData] = createSignal<User[] | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<Error | null>(null)

  return (
    <Switch>
      {/* Show when loading */}
      <Match when={loading()}>
        <Spinner />
      </Match>

      {/* Show when error */}
      <Match when={error()}>
        {(err) => <ErrorMessage error={err()} />}
      </Match>

      {/* Show when data loaded */}
      <Match when={data()}>
        {(users) => (
          <For each={users()}>
            {(user) => <UserCard user={user} />}
          </For>
        )}
      </Match>
    </Switch>
  )
}
```

### ❌ WRONG: Using JavaScript ternaries everywhere

```typescript
// WRONG - Less efficient, harder to read
function DataView() {
  const [data, setData] = createSignal<User[] | null>(null)
  const [loading, setLoading] = createSignal(true)

  return (
    <div>
      {loading() ? (
        <Spinner />
      ) : data() ? (
        data().map(user => <UserCard user={user} />)  // WRONG - use For
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

// Use Show, For, Switch instead!
```

## Refs

### ✅ CORRECT: Using refs in Solid

```typescript
import { onMount } from 'solid-js'

function AutoFocusInput() {
  let inputRef: HTMLInputElement | undefined

  onMount(() => {
    // Ref is available after mount
    inputRef?.focus()
  })

  return <input ref={inputRef} />
}

// With type safety
function TypedRef() {
  let divRef: HTMLDivElement | undefined

  onMount(() => {
    if (divRef) {
      console.log(divRef.clientWidth)
    }
  })

  return <div ref={divRef}>Content</div>
}
```

### Ref callbacks

```typescript
function RefCallback() {
  const handleRef = (el: HTMLElement) => {
    // Called when element is created
    console.log('Element created:', el)

    // Can return cleanup function
    return () => {
      console.log('Element removed:', el)
    }
  }

  return <div ref={handleRef}>Content</div>
}
```

## Store (for complex state)

### ✅ CORRECT: Using createStore for objects/arrays

```typescript
import { createStore } from 'solid-js/store'

function TodoList() {
  const [todos, setTodos] = createStore<To[]>([
{ id: 1, text: 'Learn Solid', done: false }
])
const addTodo = (text: string) => {
setTodos(todos.length, {
id: Date.now(),
text,
done: false
})
}
const toggleTodo = (id: number) => {
setTodos(
todo => todo.id === id,  // Finder function
'done',                   // Property to update
done => !done             // Updater function
)
}
const removeTodo = (id: number) => {
setTodos(todos => todos.filter(t => t.id !== id))
}
return (
<For each={todos}>
{(todo) => (
<div>
<input
type="checkbox"
checked={todo.done}
onChange={() => toggleTodo(todo.id)}
/>
<span>{todo.text}</span>
<button onClick={() => removeTodo(todo.id)}>Delete</button>
</div>
)}
</For>
)
}
```

### When to use Store vs Signal

```typescript
// Use Signal for primitive values
const [count, setCount] = createSignal(0);
const [name, setName] = createSignal('');

// Use Store for objects/arrays that need granular reactivity
const [user, setUser] = createStore({ name: '', age: 0 });
const [items, setItems] = createStore<Item[]>([]);

// Store allows path-based updates
setUser('name', 'Alice'); // Only tracks access to user.name
setUser('age', (age) => age + 1); // Only tracks access to user.age
```

## Context for Dependency Injection

### ✅ CORRECT: Using Context

```typescript
import { createContext, useContext, JSX } from 'solid-js'

// Create context with type
interface ThemeContextValue {
  theme: () => 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>()

// Provider component
function ThemeProvider(props: { children: JSX.Element }) {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  const value: ThemeContextValue = {
    theme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  )
}

// Hook to use context
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Consumer component
function ThemedButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      class={`btn-${theme()}`}
      onClick={toggleTheme}
    >
      Toggle Theme
    </button>
  )
}
```

## Performance Patterns

### ✅ Lazy loading components

```typescript
import { lazy } from 'solid-js'

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'))
const HeavyEditor = lazy(() => import('./HeavyEditor'))

function Dashboard() {
  const [showChart, setShowChart] = createSignal(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>

      <Show when={showChart()}>
        <Suspense fallback={<Spinner />}>
          <HeavyChart />
        </Suspense>
      </Show>
    </div>
  )
}
```

### ✅ Batch updates

```typescript
import { batch } from 'solid-js'

function MultiUpdate() {
  const [first, setFirst] = createSignal('')
  const [last, setLast] = createSignal('')
  const [age, setAge] = createSignal(0)

  // Without batch: 3 renders
  const updateSlow = () => {
    setFirst('John')
    setLast('Doe')
    setAge(30)
  }

  // With batch: 1 render
  const updateFast = () => {
    batch(() => {
      setFirst('John')
      setLast('Doe')
      setAge(30)
    })
  }

  return <div>{first()} {last()}, {age()}</div>
}
```

## Common Anti-Patterns

### ❌ Creating signals inside JSX

```typescript
// WRONG
function Bad() {
  return (
    <div>
      {/* Creates new signal on every render! */}
      {createSignal(0)[0]()}
    </div>
  )
}

// CORRECT
function Good() {
  const [count] = createSignal(0)
  return <div>{count()}</div>
}
```

### ❌ Using effects for derived values

```typescript
// WRONG - Using effect for derived value
function Bad() {
  const [first, setFirst] = createSignal('John')
  const [last, setLast] = createSignal('Doe')
  const [full, setFull] = createSignal('')

  createEffect(() => {
    setFull(`${first()} ${last()}`)  // WRONG
  })

  return <div>{full()}</div>
}

// CORRECT - Use createMemo
function Good() {
  const [first, setFirst] = createSignal('John')
  const [last, setLast] = createSignal('Doe')

  const full = createMemo(() => `${first()} ${last()}`)

  return <div>{full()}</div>
}

// Or just use a function
function Better() {
  const [first, setFirst] = createSignal('John')
  const [last, setLast] = createSignal('Doe')

  const full = () => `${first()} ${last()}`

  return <div>{full()}</div>
}
```

### ❌ Overusing createMemo

```typescript
// WRONG - Unnecessary memo
const doubled = createMemo(() => count() * 2)  // Simple computation

// CORRECT - Just use a function
const doubled = () => count() * 2

// Use createMemo for:
// - Expensive computations
// - Filtering large arrays
// - Complex transformations
```

## Testing Patterns

### ✅ Testing components

```typescript
import { render } from '@solidjs/testing-library'

test('Button renders and handles clicks', () => {
  const handleClick = vi.fn()

  const { getByText } = render(() => (
    <Button onClick={handleClick}>
      Click Me
    </Button>
  ))

  const button = getByText('Click Me')
  button.click()

  expect(handleClick).toHaveBeenCalledOnce()
})
```

```

```
