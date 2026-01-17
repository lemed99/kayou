# SolidJS Best Practices

## Core Reactivity Principles

### 1. Component Functions Execute Once

Unlike React, SolidJS component functions only execute once during initial render. Reactive updates happen through signal subscriptions in the JSX.

```typescript
// CORRECT: Setup happens once, reactivity in JSX
function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count()} // Reactive - updates automatically
    </button>
  );
}

// WRONG: This console.log only runs once
function Counter() {
  const [count, setCount] = createSignal(0);
  console.log(count()); // Only logs initial value!
  return <button>{count()}</button>;
}
```

### 2. Never Destructure Props

Destructuring props breaks reactivity because the destructured values are captured at component creation time.

```typescript
// WRONG: Breaks reactivity
function MyComponent({ name, value }) {
  return <div>{name}: {value}</div>;
}

// CORRECT: Props stay reactive
function MyComponent(props) {
  return <div>{props.name}: {props.value}</div>;
}

// CORRECT: Use splitProps for separation
function MyComponent(props) {
  const [local, others] = splitProps(props, ['name', 'value']);
  return <div {...others}>{local.name}: {local.value}</div>;
}
```

### 3. Use createMemo for Derived Values

```typescript
// CORRECT: Memoized computation
function Component(props) {
  const color = createMemo(() => props.color || 'gray');
  const size = createMemo(() => props.size || 'md');

  return <button class={theme.color[color()]}>{props.children}</button>;
}

// WRONG: Creates new object every access
function Component(props) {
  const color = props.color || 'gray'; // Not reactive!
  return <button class={theme.color[color]}>{props.children}</button>;
}
```

### 3b. Use Derived Signals for Prop-Based Values

When you need to derive a value from props (like generating an ID), you must use a derived signal or memo. Accessing reactive values outside a tracked scope (JSX, createEffect, event handlers) captures them at initialization time only.

```typescript
// WRONG: Accessing props outside tracked scope
function Panel(props: { itemKey: string }) {
  // This reads props.itemKey once at component creation!
  // If itemKey changes, triggerId won't update
  const triggerId = `panel-${props.itemKey}`;

  return <button id={triggerId}>Toggle</button>;
}

// CORRECT: Use derived signal (getter function)
function Panel(props: { itemKey: string }) {
  // This is called each time triggerId() is accessed in JSX
  const triggerId = () => `panel-${props.panel.itemKey}`;

  return <button id={triggerId()}>Toggle</button>;
}

// CORRECT: Use createMemo if computation is expensive
function Panel(props: { itemKey: string }) {
  const triggerId = createMemo(() => `panel-${props.panel.itemKey}`);

  return <button id={triggerId()}>Toggle</button>;
}
```

**When to use each:**

- **Derived signal `() =>`**: Simple concatenation, property access, cheap operations
- **`createMemo`**: Expensive computation, filtering arrays, complex transformations

**ESLint warning you'll see if you forget:**

> "The reactive variable 'props.x' should be used within JSX, a tracked scope (like createEffect), or inside an event handler function, or else changes will be ignored"

### 4. createEffect for Side Effects

```typescript
// CORRECT: Effect tracks signal dependencies
function Component() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    console.log('Count changed:', count()); // Runs when count changes
  });

  return <button onClick={() => setCount(c => c + 1)}>Click</button>;
}

// Use onCleanup for cleanup
createEffect(() => {
  const handler = () => console.log('resize');
  window.addEventListener('resize', handler);

  onCleanup(() => {
    window.removeEventListener('resize', handler);
  });
});
```

## Props Handling Patterns

### Using splitProps

```typescript
interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

function Button(props: ButtonProps) {
  const [local, buttonProps] = splitProps(props, [
    'children',
    'color',
    'size',
    'class',
    'isLoading',
  ]);

  const color = createMemo(() => local.color || 'primary');
  const size = createMemo(() => local.size || 'md');

  return (
    <button
      class={twMerge(theme.base, theme.color[color()], local.class)}
      disabled={local.isLoading}
      {...buttonProps}
    >
      {local.children}
    </button>
  );
}
```

### Using mergeProps for Defaults

```typescript
import { mergeProps } from 'solid-js';

function Button(props: ButtonProps) {
  const merged = mergeProps(
    { color: 'primary', size: 'md' },
    props
  );

  return <button class={theme.color[merged.color]}>{merged.children}</button>;
}
```

## Control Flow Components

### Show for Conditional Rendering

```typescript
// CORRECT: Use Show component
<Show when={isVisible()} fallback={<Loading />}>
  <Content />
</Show>

// WRONG: Ternary can cause re-creation
{isVisible() ? <Content /> : <Loading />}
```

### For for Lists

```typescript
// CORRECT: Use For component
<For each={items()}>
  {(item, index) => <div>{index()}: {item.name}</div>}
</For>

// For with fallback
<For each={items()} fallback={<div>No items</div>}>
  {(item) => <Item data={item} />}
</For>
```

### Switch/Match for Multiple Conditions

```typescript
<Switch fallback={<DefaultView />}>
  <Match when={view() === 'loading'}>
    <Loading />
  </Match>
  <Match when={view() === 'error'}>
    <Error />
  </Match>
  <Match when={view() === 'success'}>
    <Success />
  </Match>
</Switch>
```

## Stores for Complex State

### When to Use Stores vs Signals

- **Signals:** Simple values, primitive types, shallow objects
- **Stores:** Nested objects, arrays, complex data structures

```typescript
// Signal for simple state
const [count, setCount] = createSignal(0);
const [name, setName] = createSignal('');

// Store for complex state
const [state, setState] = createStore({
  user: { name: '', email: '' },
  items: [],
  settings: { theme: 'light' },
});

// Updating nested store values
setState('user', 'name', 'John');
setState('items', (items) => [...items, newItem]);
setState('settings', { theme: 'dark' }); // Merge update
```

### Store with Reconcile

```typescript
import { reconcile } from 'solid-js/store';

// Replace entire store state
setState(reconcile(newState));

// Useful for resetting forms
const resetForm = () => setState(reconcile(initialState));
```

## Refs Pattern

```typescript
function Component() {
  let inputRef: HTMLInputElement | undefined;

  // Or with signal for reactive ref
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  return (
    <>
      <input ref={inputRef} />
      {/* Or */}
      <input ref={setInputRef} />
      <button onClick={() => inputRef?.focus()}>Focus</button>
    </>
  );
}
```

## Context Pattern

```typescript
// Create context
const ThemeContext = createContext<{
  theme: Accessor<string>;
  setTheme: Setter<string>;
}>();

// Provider component
function ThemeProvider(props: { children: JSX.Element }) {
  const [theme, setTheme] = createSignal('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

// Consumer hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

## Portal Pattern

```typescript
import { Portal } from 'solid-js/web';

function Modal(props: { show: boolean; children: JSX.Element }) {
  return (
    <Show when={props.show}>
      <Portal>
        <div class="modal-backdrop">
          <div class="modal-content">
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
```

## Animation with @solid-primitives/presence

```typescript
import { createPresence } from '@solid-primitives/presence';

function AnimatedModal(props: { show: boolean }) {
  const { isVisible, isMounted } = createPresence(
    () => props.show,
    { transitionDuration: 300 }
  );

  return (
    <Show when={isMounted()}>
      <div
        style={{
          opacity: isVisible() ? '1' : '0',
          transition: 'opacity 300ms',
        }}
      >
        Content
      </div>
    </Show>
  );
}
```

## Event Handlers

```typescript
// Inline handler
<button onClick={() => handleClick()}>Click</button>

// With event
<button onClick={(e) => handleClick(e)}>Click</button>

// Prevent default
<form onSubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}>

// Stop propagation
<div onClick={(e) => e.stopPropagation()}>
```

## Common Anti-Patterns to Avoid

### 1. Accessing Signals Outside Reactive Context

```typescript
// WRONG: Value captured once
const value = count();
return <div>{value}</div>; // Never updates

// CORRECT: Access in JSX
return <div>{count()}</div>; // Updates reactively
```

### 2. Conditional Signal Creation

```typescript
// WRONG: Breaks reactivity rules
function Component(props) {
  if (props.feature) {
    const [state, setState] = createSignal(0); // Conditional!
  }
}

// CORRECT: Always create, conditionally use
function Component(props) {
  const [state, setState] = createSignal(0);

  return (
    <Show when={props.feature}>
      <div>{state()}</div>
    </Show>
  );
}
```

### 3. Mutating Props

```typescript
// WRONG: Never mutate props
function Component(props) {
  props.value = 'new value'; // Don't do this!
}

// CORRECT: Use callbacks
function Component(props) {
  return (
    <button onClick={() => props.onChange('new value')}>
      Update
    </button>
  );
}
```

### 4. Creating Effects in Loops

```typescript
// WRONG: Effects in For callback
<For each={items()}>
  {(item) => {
    createEffect(() => console.log(item)); // Don't!
    return <div>{item.name}</div>;
  }}
</For>

// CORRECT: Effect in separate component
function Item(props: { item: ItemType }) {
  createEffect(() => console.log(props.item));
  return <div>{props.item.name}</div>;
}

<For each={items()}>
  {(item) => <Item item={item} />}
</For>
```
