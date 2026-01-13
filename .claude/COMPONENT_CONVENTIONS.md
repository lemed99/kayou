# Component Conventions for @exowpee/the_rock

## File Structure

```
src/components/
├── ComponentName.tsx     # Main component file
├── ComponentName/        # For complex components
│   ├── index.tsx        # Main export
│   ├── SubComponent.tsx # Sub-components
│   └── types.ts         # TypeScript types
```

## Component File Template

```typescript
import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

// Local imports
import HelperText from './HelperText';
import Label from './Label';

// Type definitions
export type ComponentColor = 'gray' | 'info' | 'failure' | 'success' | 'warning';
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ComponentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  // Required props first
  label: string;

  // Optional props with defaults
  color?: ComponentColor;
  size?: ComponentSize;
  disabled?: boolean;
  isLoading?: boolean;

  // Event handlers
  onChange?: (value: string) => void;

  // Style overrides
  inputClass?: string;
}

// Theme object - defines all styling variants
const theme = {
  base: 'flex items-center justify-center',
  color: {
    gray: 'text-gray-900 bg-white border-gray-300',
    info: 'text-blue-900 bg-blue-50 border-blue-500',
    failure: 'text-red-900 bg-red-50 border-red-500',
    success: 'text-green-900 bg-green-50 border-green-500',
    warning: 'text-yellow-900 bg-yellow-50 border-yellow-500',
  },
  size: {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
  },
  disabled: 'opacity-50 cursor-not-allowed',
};

const ComponentName = (props: ComponentProps) => {
  // 1. Split props - separate local from pass-through
  const [local, otherProps] = splitProps(props, [
    'label',
    'color',
    'size',
    'disabled',
    'isLoading',
    'onChange',
    'class',
    'inputClass',
    'children',
  ]);

  // 2. Create memoized defaults
  const color = createMemo(() => local.color || 'gray');
  const size = createMemo(() => local.size || 'md');
  const disabled = createMemo(() => local.disabled || local.isLoading);

  // 3. Internal state (if needed)
  // const [internalState, setInternalState] = createSignal(initialValue);

  // 4. Effects (if needed)
  // createEffect(() => { ... });

  // 5. Event handlers
  const handleChange = (value: string) => {
    if (!disabled()) {
      local.onChange?.(value);
    }
  };

  // 6. Render
  return (
    <div
      class={twMerge(
        theme.base,
        theme.color[color()],
        theme.size[size()],
        disabled() && theme.disabled,
        local.class,
      )}
      {...otherProps}
    >
      <Show when={local.label}>
        <Label value={local.label} color={color()} />
      </Show>

      <Show when={!local.isLoading} fallback={<Spinner size={size()} />}>
        {local.children}
      </Show>
    </div>
  );
};

export default ComponentName;
```

## Naming Conventions

### Files

- **Components:** PascalCase - `Button.tsx`, `DatePicker.tsx`
- **Hooks:** camelCase with `use` prefix - `useFloating.tsx`, `useTheme.tsx`
- **Context:** PascalCase with `Context` suffix - `ThemeContext.tsx`
- **Helpers:** camelCase - `dates.ts`, `selectUtils.ts`
- **Types:** PascalCase or camelCase - `types.ts`

### Props Interfaces

```typescript
// Component props - always ends with Props
interface ButtonProps { }
interface ModalProps { }

// Event handler props - use on prefix
interface Props {
  onClick?: (event: MouseEvent) => void;
  onChange?: (value: string) => void;
  onSelect?: (option: Option) => void;
  onClose?: () => void;
}

// State props - use is/has prefix for booleans
interface Props {
  isOpen?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
}
```

### Theme Objects

```typescript
const theme = {
  base: '',           // Base styles always present
  color: {},          // Color variants
  size: {},           // Size variants
  state: {},          // State-based styles (disabled, active, etc.)
  // Component-specific groups
  input: {},
  label: {},
  icon: {},
};
```

## Props Patterns

### Required vs Optional Props

```typescript
interface Props {
  // Required - no default makes sense
  onSelect: (option: Option) => void;
  options: Option[];

  // Optional with sensible defaults
  color?: 'gray' | 'info';     // Default: 'gray'
  size?: 'sm' | 'md' | 'lg';   // Default: 'md'
  disabled?: boolean;          // Default: false
  placeholder?: string;        // Default: undefined
}
```

### Extending HTML Elements

```typescript
// For input-like components
interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  // Additional props
}

// For button-like components
interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  // Additional props
}

// When you need to override native types
interface SelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  onSelect: (option: Option) => void; // Custom signature
}
```

### Children Patterns

```typescript
// Explicit children type
interface ModalProps {
  children: JSX.Element;
}

// Optional children
interface CardProps {
  children?: JSX.Element;
}

// Render prop pattern
interface ListProps<T> {
  items: T[];
  children: (item: T, index: Accessor<number>) => JSX.Element;
}
```

## Styling Conventions

### Tailwind Class Order

Follow this order for consistency:

1. Layout: `flex`, `grid`, `block`, `inline`
2. Positioning: `relative`, `absolute`, `fixed`
3. Box model: `w-`, `h-`, `p-`, `m-`
4. Typography: `text-`, `font-`, `leading-`
5. Visual: `bg-`, `border-`, `rounded-`, `shadow-`
6. Interactive: `cursor-`, `hover:`, `focus:`
7. Transitions: `transition-`, `duration-`

```typescript
const styles = twMerge(
  // Layout
  'flex items-center justify-center',
  // Box model
  'w-full px-4 py-2',
  // Typography
  'text-sm font-medium',
  // Visual
  'bg-white border border-gray-300 rounded-lg',
  // Interactive
  'cursor-pointer hover:bg-gray-50',
  // Transitions
  'transition-all duration-200',
);
```

### Dark Mode

Always include dark mode variants:

```typescript
const theme = {
  base: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
  border: 'border-gray-300 dark:border-gray-600',
  hover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
};
```

### Using twMerge

Always use `twMerge` when combining classes:

```typescript
import { twMerge } from 'tailwind-merge';

// Allows overriding base classes
<div class={twMerge(theme.base, theme.color[color()], local.class)}>

// Handles conflicts correctly
twMerge('p-4', 'p-2') // → 'p-2'
twMerge('text-red-500', 'text-blue-500') // → 'text-blue-500'
```

## Export Patterns

### Default Export (Single Component)

```typescript
// Button.tsx
const Button = (props: ButtonProps) => { ... };
export default Button;

// index.ts
export { default as Button } from './Button';
```

### Named Export (Multiple Items)

```typescript
// DataTable.tsx
export function DataTable<T>(props: DataTableProps<T>) { ... }
export interface DataTableColumnProps<T> { ... }

// index.ts
export { DataTable } from './DataTable';
export type { DataTableColumnProps } from './DataTable';
```

### Re-exporting Types

```typescript
// index.ts
export type {
  ButtonProps,
  ButtonColor,
} from './Button';

export type {
  ModalProps,
} from './Modal';
```

## State Management Patterns

### Local State

```typescript
// Simple state
const [isOpen, setIsOpen] = createSignal(false);

// Complex state - use store
const [state, setState] = createStore({
  items: [],
  selectedId: null,
  filter: '',
});
```

### Controlled vs Uncontrolled

```typescript
interface Props {
  // Controlled
  value?: string;
  onChange?: (value: string) => void;

  // With default for uncontrolled
  defaultValue?: string;
}

function Component(props: Props) {
  const isControlled = () => props.value !== undefined;

  const [internalValue, setInternalValue] = createSignal(
    props.defaultValue ?? ''
  );

  const value = () => isControlled() ? props.value! : internalValue();

  const handleChange = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    props.onChange?.(newValue);
  };
}
```

## Event Handling Patterns

```typescript
// Mouse events
onClick={(e) => handleClick(e)}
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}

// Keyboard events
onKeyDown={(e) => {
  if (e.key === 'Enter') handleSelect();
  if (e.key === 'Escape') handleClose();
}}

// Form events
onInput={(e) => setValue(e.currentTarget.value)}
onSubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}

// Focus events
onFocus={() => setIsFocused(true)}
onBlur={() => setIsFocused(false)}
```

## Animation Patterns

### Using @solid-primitives/presence

```typescript
import { createPresence } from '@solid-primitives/presence';

const { isVisible, isMounted } = createPresence(
  () => props.show,
  { transitionDuration: 200 }
);

return (
  <Show when={isMounted()}>
    <div
      style={{
        opacity: isVisible() ? '1' : '0',
        transform: isVisible() ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 200ms, transform 200ms',
      }}
    >
      Content
    </div>
  </Show>
);
```

### Standard Transition Style

```typescript
const transitionStyle = () => ({
  opacity: isVisible() ? '1' : '0',
  scale: isVisible() ? 1 : 0.8,
  'transition-property': 'opacity, scale',
  'transition-duration': '.2s',
  'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
});
```

## Documentation Requirements

### JSDoc Comments

```typescript
/**
 * A customizable button component with loading state support.
 *
 * @example
 * ```tsx
 * <Button color="info" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps {
  /**
   * The color variant of the button.
   * @default 'info'
   */
  color?: ButtonColor;

  /**
   * Whether the button is in a loading state.
   * When true, the button is disabled and shows a spinner.
   */
  isLoading?: boolean;
}
```
