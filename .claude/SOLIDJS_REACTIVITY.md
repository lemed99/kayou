# SolidJS Reactivity Guide

**Source:** [eslint-plugin-solid reactivity docs](https://github.com/solidjs-community/eslint-plugin-solid/blob/main/packages/eslint-plugin-solid/docs/reactivity.md)

---

## Core Principle

**SolidJS components run once.** Unlike React, component functions don't re-execute on state changes. Reactivity only works when reactive values (signals, props, memos) are accessed within **tracked scopes**.

### Tracked Scopes

Reactive values are tracked in these contexts:
- JSX expressions: `<div>{count()}</div>`
- `createEffect` callbacks
- `createMemo` callbacks
- `createComputed` callbacks
- Event handler functions (with caveats)

### Untracked Scopes

These do NOT track reactive dependencies:
- Component function body (top-level)
- Regular variable assignments
- `setTimeout`/`setInterval` callbacks
- Native DOM event handler props (partially)

---

## Common Anti-Patterns

### 1. Accessing Reactive Values in Component Body

```typescript
// ❌ BAD - Value captured once at initialization
function Counter(props: { initialCount: number }) {
  const startValue = props.initialCount; // Captured once!
  const [count, setCount] = createSignal(startValue);

  return <div>{count()}</div>;
}

// ✅ GOOD - Access props directly in JSX or use derived signal
function Counter(props: { initialCount: number }) {
  const [count, setCount] = createSignal(props.initialCount);

  // If you need derived value, use a function
  const doubled = () => count() * 2;

  return <div>{doubled()}</div>;
}
```

### 2. Storing Props in Variables

```typescript
// ❌ BAD - Props accessed outside tracked scope
function UserCard(props: { user: User }) {
  const userName = props.user.name; // Captured once!
  const userId = props.user.id;     // Captured once!

  return <div>{userName} ({userId})</div>;
}

// ✅ GOOD - Access props directly in JSX
function UserCard(props: { user: User }) {
  return <div>{props.user.name} ({props.user.id})</div>;
}

// ✅ GOOD - Use derived signals for computed values
function UserCard(props: { user: User }) {
  const displayName = () => `${props.user.name} (${props.user.id})`;

  return <div>{displayName()}</div>;
}
```

### 3. Deriving IDs or Strings from Props

```typescript
// ❌ BAD - String concatenation outside tracked scope
function Panel(props: { itemKey: string }) {
  const panelId = `panel-${props.itemKey}`; // Captured once!

  return <div id={panelId}>Content</div>;
}

// ✅ GOOD - Use derived signal
function Panel(props: { itemKey: string }) {
  const panelId = () => `panel-${props.itemKey}`;

  return <div id={panelId()}>Content</div>;
}

// ✅ GOOD - Or inline in JSX
function Panel(props: { itemKey: string }) {
  return <div id={`panel-${props.itemKey}`}>Content</div>;
}
```

### 4. Event Handlers on Native Elements

```typescript
// ❌ BAD - Event handler captured at render time
function Button(props: { onClick: () => void }) {
  return <button onClick={props.onClick}>Click</button>;
}
// If props.onClick changes, the button still calls the OLD handler!

// ✅ GOOD - Wrap in arrow function to defer access
function Button(props: { onClick: () => void }) {
  return <button onClick={() => props.onClick()}>Click</button>;
}

// ✅ GOOD - With event parameter
function Button(props: { onClick: (e: MouseEvent) => void }) {
  return <button onClick={(e) => props.onClick(e)}>Click</button>;
}
```

### 5. Context Provider Values

```typescript
// ❌ BAD - Signal called immediately, value is static
const [count, setCount] = createSignal(0);

<CountContext.Provider value={count()}>
  {/* Consumers won't update when count changes! */}
</CountContext.Provider>

// ✅ GOOD - Pass the signal accessor
<CountContext.Provider value={count}>
  {/* Consumers call count() and get reactive updates */}
</CountContext.Provider>

// ✅ GOOD - Or pass an object with the signal
<CountContext.Provider value={{ count, setCount }}>
  {/* Consumers access count() reactively */}
</CountContext.Provider>
```

### 6. Initializing Signals from Props

```typescript
// ⚠️ INTENTIONAL - Use naming to signal intent
function Counter(props: { initialCount: number }) {
  // "initial" prefix signals this is intentionally captured once
  const [count, setCount] = createSignal(props.initialCount);
  return <button onClick={() => setCount(c => c + 1)}>{count()}</button>;
}

// ⚠️ INTENTIONAL - "default" prefix also works
function Input(props: { defaultValue: string }) {
  const [value, setValue] = createSignal(props.defaultValue);
  return <input value={value()} onInput={(e) => setValue(e.target.value)} />;
}

// ❌ BAD - Ambiguous naming, unclear if intentional
function Counter(props: { count: number }) {
  const [count, setCount] = createSignal(props.count); // Bug or intentional?
  return <button>{count()}</button>;
}
```

### 7. Destructuring Props

```typescript
// ❌ BAD - Destructuring breaks reactivity
function Greeting({ name, age }: { name: string; age: number }) {
  return <div>{name} is {age} years old</div>; // Never updates!
}

// ✅ GOOD - Keep props object intact
function Greeting(props: { name: string; age: number }) {
  return <div>{props.name} is {props.age} years old</div>;
}

// ✅ GOOD - Use splitProps for separation
function Greeting(props: { name: string; age: number; class?: string }) {
  const [local, others] = splitProps(props, ['name', 'age']);
  return <div {...others}>{local.name} is {local.age} years old</div>;
}
```

### 8. Array Methods Outside Tracked Scope

```typescript
// ❌ BAD - Filter result captured once
function FilteredList(props: { items: Item[]; filter: string }) {
  const filtered = props.items.filter(i => i.name.includes(props.filter));

  return <For each={filtered}>{(item) => <div>{item.name}</div>}</For>;
}

// ✅ GOOD - Use createMemo for derived collections
function FilteredList(props: { items: Item[]; filter: string }) {
  const filtered = createMemo(() =>
    props.items.filter(i => i.name.includes(props.filter))
  );

  return <For each={filtered()}>{(item) => <div>{item.name}</div>}</For>;
}
```

---

## Best Practices

### 1. Defer Access with Functions

When you need a derived value, wrap it in a function:

```typescript
// Simple derivation - use arrow function
const fullName = () => `${props.firstName} ${props.lastName}`;

// Expensive computation - use createMemo
const sortedItems = createMemo(() =>
  [...props.items].sort((a, b) => a.name.localeCompare(b.name))
);
```

### 2. Use Naming Conventions

Signal intent when capturing values:

| Prefix | Meaning |
|--------|---------|
| `initial` | Intentionally captured once at mount |
| `default` | Provides default, may be overridden |
| No prefix | Should be reactive, check for bugs |

### 3. Wrap Event Handlers

Always wrap prop callbacks in arrow functions:

```typescript
// Props with callbacks
<Button onClick={() => props.onSubmit()} />
<Input onInput={(e) => props.onChange(e.currentTarget.value)} />
```

### 4. Use createMemo for Expensive Derivations

```typescript
// Cheap - arrow function is fine
const isValid = () => props.value.length > 0;

// Expensive - memoize
const processedData = createMemo(() => {
  return props.rawData.map(expensiveTransform).filter(expensiveFilter);
});
```

### 5. Keep Reactivity in JSX

```typescript
// Prefer inline access in JSX when simple
<div class={props.isActive ? 'active' : 'inactive'}>
  {props.user.name}
</div>

// Extract to derived signal when complex
const statusClass = () => {
  if (props.isLoading) return 'loading';
  if (props.isError) return 'error';
  if (props.isSuccess) return 'success';
  return 'idle';
};

<div class={statusClass()}>{props.message}</div>
```

---

## ESLint Rule: `solid/reactivity`

The `eslint-plugin-solid` package includes a `solid/reactivity` rule that catches many of these issues:

```json
{
  "plugins": ["solid"],
  "rules": {
    "solid/reactivity": "warn"
  }
}
```

### Common Warnings

| Warning | Meaning |
|---------|---------|
| "The reactive variable 'props.x' should be used within JSX, a tracked scope, or inside an event handler" | You're accessing props outside a tracked scope |
| "The reactive variable 'signal()' is being called outside a tracked scope" | Signal accessed in component body |
| "Destructuring props breaks reactivity" | Don't destructure the props parameter |

---

## Quick Reference

### Do ✅

```typescript
// Access props in JSX
<div>{props.name}</div>

// Use derived signals
const fullName = () => `${props.first} ${props.last}`;

// Use createMemo for expensive work
const sorted = createMemo(() => sortItems(props.items));

// Wrap event handlers
<button onClick={() => props.onAction()}>

// Use splitProps
const [local, others] = splitProps(props, ['value']);
```

### Don't ❌

```typescript
// Store props in variables
const name = props.name;

// Destructure props
function Comp({ name, value }) { }

// Call signals in component body
const currentCount = count();

// Pass signal values to providers
<Ctx.Provider value={signal()}>

// Use bare prop callbacks
<button onClick={props.onAction}>
```

---

## Debugging Reactivity Issues

### 1. Check if Value Updates

```typescript
createEffect(() => {
  console.log('Props changed:', props.value);
});
```

### 2. Verify Tracked Scope

If a value doesn't update, check:
- Is it accessed in JSX, createEffect, or createMemo?
- Is it stored in a variable first?
- Is the prop destructured?

### 3. Use the ESLint Plugin

```bash
npm install -D eslint-plugin-solid
```

The `solid/reactivity` rule catches most issues at compile time.
