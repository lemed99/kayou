# Anti-Patterns to Avoid

## SolidJS Reactivity Anti-Patterns

### 1. Destructuring Props

**Problem:** Breaks reactivity - values are captured at component creation time.

```typescript
// BAD - Breaks reactivity
function Component({ name, value, onChange }) {
  return <div>{name}: {value}</div>; // Never updates!
}

// GOOD - Props stay reactive
function Component(props) {
  return <div>{props.name}: {props.value}</div>;
}

// GOOD - Use splitProps if you need to separate props
function Component(props) {
  const [local, others] = splitProps(props, ['name', 'value']);
  return <div {...others}>{local.name}: {local.value}</div>;
}
```

### 2. Accessing Signals Outside Reactive Context

**Problem:** Value captured once, doesn't track updates.

```typescript
// BAD - Captured once
function Component() {
  const [count, setCount] = createSignal(0);
  const currentCount = count(); // Captured at creation time!

  return <div>{currentCount}</div>; // Never updates
}

// GOOD - Access in JSX
function Component() {
  const [count, setCount] = createSignal(0);
  return <div>{count()}</div>; // Updates reactively
}

// GOOD - Access in createMemo
function Component() {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);
  return <div>{doubled()}</div>;
}

// BAD - Deriving values from props outside reactive scope
function Panel(props: { itemKey: string }) {
  const id = `panel-${props.itemKey}`; // Captured once!
  return <div id={id}>Content</div>;
}

// GOOD - Use derived signal
function Panel(props: { itemKey: string }) {
  const id = () => `panel-${props.itemKey}`; // Reactive!
  return <div id={id()}>Content</div>;
}
```

### 3. Conditional Signal/Effect Creation

**Problem:** SolidJS expects consistent hook calls - conditionals break this.

```typescript
// BAD - Conditional signal creation
function Component(props) {
  if (props.feature) {
    const [state, setState] = createSignal(0); // Breaks rules!
  }
}

// GOOD - Always create, conditionally use
function Component(props) {
  const [state, setState] = createSignal(0);

  return (
    <Show when={props.feature}>
      <div>{state()}</div>
    </Show>
  );
}
```

### 4. Effects Inside For Loops

**Problem:** Creates multiple effects on each render, potential memory leaks.

```typescript
// BAD - Effects in For callback
<For each={items()}>
  {(item) => {
    createEffect(() => {
      console.log(item); // Creates effect for each item!
    });
    return <div>{item.name}</div>;
  }}
</For>

// GOOD - Move effect to separate component
function ItemComponent(props) {
  createEffect(() => {
    console.log(props.item);
  });
  return <div>{props.item.name}</div>;
}

<For each={items()}>
  {(item) => <ItemComponent item={item} />}
</For>
```

### 5. Mutating Props

**Problem:** Props are read-only in SolidJS.

```typescript
// BAD - Mutating props
function Component(props) {
  props.value = 'new value'; // Never do this!
  props.items.push(newItem); // Also bad!
}

// GOOD - Use callbacks
function Component(props) {
  const handleChange = () => {
    props.onChange('new value');
    props.onAddItem(newItem);
  };
}
```

### 6. Using Array Index as Key

**Problem:** Can cause incorrect updates and DOM recycling issues.

```typescript
// BAD - Index as key (implicit in For)
<For each={items()}>
  {(item, index) => <div key={index()}>{item.name}</div>}
</For>

// Note: SolidJS's For handles this better than React, but for lists
// that reorder frequently, consider using Index instead:

// GOOD - For items with stable identity
<For each={items()}>
  {(item) => <div>{item.name}</div>}
</For>

// GOOD - When index-based access is needed for reordering lists
<Index each={items()}>
  {(item, index) => <div>{item().name}</div>}
</Index>
```

## TypeScript Anti-Patterns

### 1. Using `any` Type

```typescript
// BAD
function processData(data: any) { }
const items: any[] = [];

// GOOD
function processData<T>(data: T) { }
interface Item { id: string; name: string; }
const items: Item[] = [];

// When type is truly unknown
function processData(data: unknown) {
  if (isValidData(data)) {
    // Type narrowed here
  }
}
```

### 2. Not Typing Event Handlers

```typescript
// BAD
const handleClick = (e) => { }; // Implicit any

// GOOD
const handleClick = (e: MouseEvent) => { };
const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
  const value = e.currentTarget.value;
};
```

### 3. Incorrect JSX Element Types

```typescript
// BAD - Too loose
interface Props {
  children: any;
  icon: any;
}

// GOOD - Specific types
interface Props {
  children: JSX.Element;
  icon: (props: { class: string }) => JSX.Element;
}
```

## CSS/Tailwind Anti-Patterns

### 1. Not Using twMerge for Class Composition

```typescript
// BAD - Classes may conflict
<div class={`${theme.base} ${props.class}`}>

// GOOD - Conflicts resolved correctly
<div class={twMerge(theme.base, props.class)}>
```

### 2. Inline Styles When Classes Work

```typescript
// BAD - Unnecessary inline styles
<div style={{ padding: '16px', margin: '8px' }}>

// GOOD - Use Tailwind classes
<div class="p-4 m-2">
```

### 3. Forgetting Dark Mode

```typescript
// BAD - No dark mode support
const theme = {
  bg: 'bg-white',
  text: 'text-gray-900',
};

// GOOD - Include dark variants
const theme = {
  bg: 'bg-white dark:bg-gray-800',
  text: 'text-gray-900 dark:text-white',
};
```

### 4. Magic Numbers

```typescript
// BAD - Unexplained values
<div style={{ width: '342px', 'margin-top': '27px' }}>

// GOOD - Use Tailwind scale or document magic numbers
<div class="w-full max-w-sm mt-6"> // Or explain: 342px = specific design spec
```

## Component Design Anti-Patterns

### 1. God Components

**Problem:** Single component does too much.

```typescript
// BAD - Everything in one component
function Dashboard() {
  // User state
  // Navigation state
  // Data fetching
  // Form handling
  // Modal management
  // 500+ lines of JSX
}

// GOOD - Split into focused components
function Dashboard() {
  return (
    <div>
      <UserHeader />
      <Navigation />
      <DataGrid />
      <ActionModal />
    </div>
  );
}
```

### 2. Prop Drilling

**Problem:** Passing props through many layers.

```typescript
// BAD - Props passed through multiple levels
function App() {
  const [theme, setTheme] = createSignal('light');
  return <Layout theme={theme()} setTheme={setTheme}>
    <Page theme={theme()} setTheme={setTheme}>
      <Component theme={theme()} setTheme={setTheme} />
    </Page>
  </Layout>;
}

// GOOD - Use context
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Page>
          <Component /> {/* Uses useTheme() */}
        </Page>
      </Layout>
    </ThemeProvider>
  );
}
```

### 3. Not Handling Loading/Error States

```typescript
// BAD - Assumes data always exists
function UserList(props) {
  return (
    <For each={props.users}>
      {(user) => <div>{user.name}</div>}
    </For>
  );
}

// GOOD - Handle all states
function UserList(props) {
  return (
    <Switch>
      <Match when={props.loading}>
        <Skeleton />
      </Match>
      <Match when={props.error}>
        <ErrorMessage error={props.error} />
      </Match>
      <Match when={props.users.length === 0}>
        <EmptyState message="No users found" />
      </Match>
      <Match when={props.users.length > 0}>
        <For each={props.users}>
          {(user) => <div>{user.name}</div>}
        </For>
      </Match>
    </Switch>
  );
}
```

### 4. Inconsistent Prop Naming

```typescript
// BAD - Inconsistent naming
interface Props {
  isOpen: boolean;    // is prefix
  loading: boolean;   // no prefix
  hasError: boolean;  // has prefix
  disabled: boolean;  // no prefix
}

// GOOD - Consistent naming
interface Props {
  isOpen: boolean;
  isLoading: boolean;
  hasError: boolean;
  isDisabled: boolean;
}
```

## Accessibility Anti-Patterns

### 1. Click Handlers on Non-Interactive Elements

```typescript
// BAD - Div with click handler
<div onClick={handleClick}>Click me</div>

// GOOD - Use button or add proper ARIA
<button onClick={handleClick}>Click me</button>
// Or if div is necessary:
<div role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>
  Click me
</div>
```

### 2. Missing Labels

```typescript
// BAD - No label
<input type="text" placeholder="Email" />

// GOOD - Proper label
<label>
  Email
  <input type="text" />
</label>
// Or:
<label for="email">Email</label>
<input id="email" type="text" />
```

### 3. Icon-Only Buttons Without Labels

```typescript
// BAD - No accessible name
<button onClick={handleClose}>
  <XIcon />
</button>

// GOOD - Has accessible name
<button onClick={handleClose} aria-label="Close">
  <XIcon />
</button>
```

### 4. Missing Focus Management in Modals

```typescript
// BAD - No focus management
function Modal(props) {
  return (
    <Show when={props.show}>
      <div class="modal">{props.children}</div>
    </Show>
  );
}

// GOOD - Proper focus management
function Modal(props) {
  let modalRef;

  createEffect(() => {
    if (props.show) {
      modalRef?.focus();
    }
  });

  return (
    <Show when={props.show}>
      <div
        ref={modalRef}
        class="modal"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {props.children}
      </div>
    </Show>
  );
}
```

## Performance Anti-Patterns

### 1. Unnecessary Re-renders

```typescript
// BAD - Object created every render
<Component style={{ padding: 16 }} />

// GOOD - Stable reference
const styles = { padding: 16 };
<Component style={styles} />
```

### 2. Large Lists Without Virtualization

```typescript
// BAD - Renders all items
<For each={thousandsOfItems}>
  {(item) => <LargeComponent data={item} />}
</For>

// GOOD - Use virtualization
<VirtualList
  items={thousandsOfItems}
  rowHeight={50}
>
  {(item) => <LargeComponent data={item} />}
</VirtualList>
```

### 3. Expensive Computations Without Memoization

```typescript
// BAD - Runs on every access
function Component(props) {
  const filtered = props.items.filter(expensiveFilter);
  return <List items={filtered} />;
}

// GOOD - Memoized
function Component(props) {
  const filtered = createMemo(() =>
    props.items.filter(expensiveFilter)
  );
  return <List items={filtered()} />;
}
```

## Common Mistakes in This Codebase

### 1. Inconsistent Export Patterns

```typescript
// Some components use default export
export default Button;

// Others use named export
export function DataTable() { }

// Recommendation: Be consistent within the project
```

### 2. Theme Objects Could Be Extracted

```typescript
// Currently: theme defined in each component
const theme = { base: '...', color: {...} };

// Consider: Shared theme configuration
import { buttonTheme } from '../theme';
```

### 3. Missing Error Boundaries

```typescript
// Consider adding error boundaries for critical components
import { ErrorBoundary } from 'solid-js';

<ErrorBoundary fallback={<ErrorFallback />}>
  <CriticalComponent />
</ErrorBoundary>
```
