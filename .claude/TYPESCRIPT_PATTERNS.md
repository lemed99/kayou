# TypeScript Patterns for SolidJS Components

## Component Props Typing

### Basic Component Props

```typescript
import { JSX, Component } from 'solid-js';

// Extending HTML element attributes
interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// Using Component type (optional, provides children type)
const Button: Component<ButtonProps> = (props) => {
  return <button {...props}>{props.children}</button>;
};

// Or without Component type
function Button(props: ButtonProps) {
  return <button {...props}>{props.children}</button>;
}
```

### Props with Required Children

```typescript
interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: JSX.Element; // Required children
}

// Or with ParentProps helper
import { ParentProps } from 'solid-js';

type ModalProps = ParentProps<{
  show: boolean;
  onClose: () => void;
}>;
```

### Generic Component Props

```typescript
interface SelectProps<T> {
  options: T[];
  value?: T;
  onSelect: (option: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
}

function Select<T>(props: SelectProps<T>) {
  return (
    <For each={props.options}>
      {(option) => (
        <div onClick={() => props.onSelect(option)}>
          {props.getLabel(option)}
        </div>
      )}
    </For>
  );
}

// Usage
<Select<User>
  options={users}
  getLabel={(u) => u.name}
  getValue={(u) => u.id}
  onSelect={handleSelect}
/>
```

### Extending HTML Elements with Omit

```typescript
// When you need to override a native prop type
interface SelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  options: Option[];
  onSelect: (option: Option) => void; // Different signature than native
}
```

## Signal Typing

### Basic Signals

```typescript
import { Accessor, Setter, createSignal } from 'solid-js';

// Implicit typing
const [count, setCount] = createSignal(0); // Signal<number>
const [name, setName] = createSignal(''); // Signal<string>

// Explicit typing
const [user, setUser] = createSignal<User | null>(null);
const [items, setItems] = createSignal<Item[]>([]);

// Union types
const [status, setStatus] = createSignal<'idle' | 'loading' | 'success' | 'error'>(
  'idle',
);
```

### Signal Types for Props

```typescript
import { Accessor, Setter } from 'solid-js';

interface ContextValue {
  count: Accessor<number>;
  setCount: Setter<number>;
  // Or for readonly
  count: Accessor<number>;
  increment: () => void;
}
```

## Store Typing

```typescript
import { SetStoreFunction, createStore } from 'solid-js/store';

interface AppState {
  user: {
    name: string;
    email: string;
  } | null;
  items: Item[];
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const [state, setState] = createStore<AppState>({
  user: null,
  items: [],
  settings: {
    theme: 'light',
    notifications: true,
  },
});

// Type-safe updates
setState('user', { name: 'John', email: 'john@example.com' });
setState('settings', 'theme', 'dark');
setState('items', (items) => [...items, newItem]);
```

## Event Handler Typing

```typescript
// Mouse events
const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};

// Input events
const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
  const value = e.currentTarget.value;
};

// Change events
const handleChange = (e: Event & { currentTarget: HTMLSelectElement }) => {
  const value = e.currentTarget.value;
};

// Form events
const handleSubmit = (e: SubmitEvent) => {
  e.preventDefault();
};

// Keyboard events
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    // handle
  }
};

// In JSX
<input
  onInput={(e) => setValue(e.currentTarget.value)}
  onKeyDown={(e) => {
    if (e.key === 'Escape') close();
  }}
/>
```

## Ref Typing

```typescript
// Let binding
let inputRef: HTMLInputElement | undefined;

// Signal-based ref
const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

// Usage
<input ref={inputRef} />
<input ref={setInputRef} />
<input ref={(el) => inputRef = el} />
```

## Context Typing

```typescript
import { createContext, useContext, Accessor, Setter } from 'solid-js';

interface ThemeContextType {
  theme: Accessor<'light' | 'dark'>;
  setTheme: Setter<'light' | 'dark'>;
  toggleTheme: () => void;
}

// Context with undefined default (recommended)
const ThemeContext = createContext<ThemeContextType>();

// Hook with type guard
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Provider
function ThemeProvider(props: ParentProps) {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
}
```

## Render Props / Children as Function

```typescript
interface ListProps<T> {
  items: T[];
  children: (item: T, index: Accessor<number>) => JSX.Element;
  fallback?: JSX.Element;
}

function List<T>(props: ListProps<T>) {
  return (
    <For each={props.items} fallback={props.fallback}>
      {props.children}
    </For>
  );
}

// Usage
<List items={users}>
  {(user, index) => <UserCard user={user} position={index()} />}
</List>
```

## Utility Types

```typescript
// Extract props from component
type ButtonProps = Parameters<typeof Button>[0];

// Make all props optional for spreading
type PartialButtonProps = Partial<ButtonProps>;

// Pick specific props
type ButtonStyleProps = Pick<ButtonProps, 'color' | 'size' | 'class'>;

// Omit specific props
type ButtonWithoutStyle = Omit<ButtonProps, 'class' | 'style'>;
```

## Theme Object Typing

```typescript
interface Theme {
  base: string;
  color: Record<ButtonColor, string>;
  size: Record<ButtonSize, string>;
}

const theme: Theme = {
  base: 'flex items-center justify-center',
  color: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  },
  size: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  },
};
```

## JSX Type Helpers

```typescript
import { JSX } from 'solid-js';

// JSX Element
type Children = JSX.Element;

// CSS Properties
type Style = JSX.CSSProperties;

// Event handlers
type ClickHandler = JSX.EventHandler<HTMLButtonElement, MouseEvent>;
type InputHandler = JSX.EventHandler<HTMLInputElement, InputEvent>;

// HTML attributes
type DivAttributes = JSX.HTMLAttributes<HTMLDivElement>;
type InputAttributes = JSX.InputHTMLAttributes<HTMLInputElement>;
type ButtonAttributes = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
```

## Common Patterns in This Codebase

### Component with splitProps

```typescript
interface MyComponentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

function MyComponent(props: MyComponentProps) {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'isLoading',
    'class',
    'children',
  ]);

  const variant = createMemo(() => local.variant || 'default');
  const size = createMemo(() => local.size || 'md');

  return (
    <div
      class={twMerge(
        theme.base,
        theme.variant[variant()],
        theme.size[size()],
        local.class,
      )}
      {...others}
    >
      <Show when={!local.isLoading} fallback={<Spinner />}>
        {local.children}
      </Show>
    </div>
  );
}
```

### Icon Component Pattern

```typescript
interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  size?: number | string;
}

function Icon(props: IconProps) {
  const [local, svgProps] = splitProps(props, ['size', 'class']);

  return (
    <svg
      width={local.size || 24}
      height={local.size || 24}
      class={twMerge('shrink-0', local.class)}
      {...svgProps}
    >
      {/* SVG content */}
    </svg>
  );
}
```

## Path Aliases Configuration

**IMPORTANT:** When adding path aliases for module resolution, you must configure BOTH Vite AND TypeScript. Missing either will cause build or type errors.

### Step 1: Add Vite Alias (vite.config.ts)

```typescript
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, '../src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
```

### Step 2: Add TypeScript Paths (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@lib/*": ["../src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

### Why Both Are Required

| Config           | Purpose                                       | Error if Missing              |
| ---------------- | --------------------------------------------- | ----------------------------- |
| `vite.config.ts` | Runtime module resolution during build/dev    | `Module not found` at runtime |
| `tsconfig.json`  | TypeScript type checking and IDE intellisense | Red squiggles, type errors    |

### Common Alias Patterns

```typescript
// Vite config
alias: {
  '@': path.resolve(__dirname, './src'),           // General src alias
  '@lib': path.resolve(__dirname, '../src'),       // Parent library
  '@components': path.resolve(__dirname, './src/components'),
  '@hooks': path.resolve(__dirname, './src/hooks'),
  '@utils': path.resolve(__dirname, './src/utils'),
}

// Corresponding tsconfig paths
"paths": {
  "@/*": ["./src/*"],
  "@lib/*": ["../src/*"],
  "@components/*": ["./src/components/*"],
  "@hooks/*": ["./src/hooks/*"],
  "@utils/*": ["./src/utils/*"]
}
```

### Checklist for Adding Aliases

- [ ] Add alias to `vite.config.ts` (or `vite.config.mts`)
- [ ] Add corresponding path to `tsconfig.json`
- [ ] Ensure `baseUrl` is set in tsconfig (usually `"."`)
- [ ] Restart TypeScript server in IDE (or restart IDE)
- [ ] Verify imports work with intellisense
