# Common Fix Patterns

Quick reference for applying common fixes.

## Pattern 1: Props Destructuring → Access

### Find

```typescript
function Component({ prop1, prop2, ...rest }) {
```

### Replace

```typescript
import { splitProps } from 'solid-js';

function Component(props: ComponentProps) {
  const [local, others] = splitProps(props, ['prop1', 'prop2']);
  // Use: local.prop1, local.prop2, spread {...others}
}
```

## Pattern 2: any Type → Specific Type

### Find

```typescript
interface Props {
  value: any;
  onChange: any;
}
```

### Replace

```typescript
interface Props {
  value: string | number;
  onChange: (value: string | number) => void;
}
```

## Pattern 3: Missing Effect Cleanup

### Find

```typescript
createEffect(() => {
  const id = setInterval(() => {}, 1000);
});
```

### Replace

```typescript
createEffect(() => {
  const id = setInterval(() => {}, 1000);
  onCleanup(() => clearInterval(id));
});
```

## Pattern 4: Effect for Derived State → Memo

### Find

```typescript
const [a, setA] = createSignal(1);
const [b, setB] = createSignal(2);
const [sum, setSum] = createSignal(0);

createEffect(() => {
  setSum(a() + b());
});
```

### Replace

```typescript
const [a, setA] = createSignal(1);
const [b, setB] = createSignal(2);

const sum = createMemo(() => a() + b());
```

## Pattern 5: Missing Keyboard Support

### Find

```typescript
<div onClick={handler}>Click me</div>
```

### Replace

```typescript
<button
  onClick={handler}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handler(e)
    }
  }}
>
  Click me
</button>
```

## Pattern 6: Missing ARIA Label

### Find

```typescript
<button onClick={handleClose}>
  <XIcon />
</button>
```

### Replace

```typescript
<button onClick={handleClose} aria-label="Close">
  <XIcon aria-hidden="true" />
</button>
```

## Pattern 7: React Hooks → Solid Primitives

### Find

```typescript
import { useEffect, useState } from 'react';

const [state, setState] = useState(0);

useEffect(() => {
  // ...
}, [dependency]);
```

### Replace

```typescript
import { createEffect, createSignal } from 'solid-js';

const [state, setState] = createSignal(0);

createEffect(() => {
  // Automatically tracks dependencies
});
```

## Pattern 8: No Rest Props → Split Props

### Find

```typescript
function Component(props: Props) {
  return <div class="component">{props.children}</div>
}
```

### Replace

```typescript
import { splitProps } from 'solid-js'

function Component(props: Props) {
  const [local, others] = splitProps(props, ['children'])
  return (
    <div class="component" {...others}>
      {local.children}
    </div>
  )
}
```
