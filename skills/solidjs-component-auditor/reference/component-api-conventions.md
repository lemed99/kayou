# Component API Conventions

Library-specific conventions for consistent component APIs.

## Naming Conventions

### Component Names

- **PascalCase**: `Button`, `TextField`, `DataTable`
- **Descriptive**: Name should clearly indicate purpose
- **No prefixes**: Avoid `Solid`, `UI`, `App` prefixes

### Prop Names

- **camelCase**: `onClick`, `isDisabled`, `maxLength`
- **Boolean props**: Start with `is`, `has`, `should`, `can`
  - ✅ `isOpen`, `hasError`, `shouldAutoFocus`
  - ❌ `open`, `error`, `autoFocus`
- **Callback props**: Start with `on`
  - ✅ `onClick`, `onChange`, `onClose`
  - ❌ `handleClick`, `clickHandler`

### Event Names

- Use past tense for completed events: `onLoad`, `onOpen`, `onClose`
- Use present tense for ongoing: `onChange`, `onInput`, `onScroll`

## Required Props Pattern

Every component should support these base props:

```typescript
import { ComponentProps, JSX } from 'solid-js'

interface BaseComponentProps extends ComponentProps<'div'> {
  /** Custom CSS class */
  class?: string
  /** CSS class list object */
  classList?: { [key: string]: boolean }
  /** Inline styles */
  style?: JSX.CSSProperties | string
  /** Test ID for testing */
  'data-testid'?: string
}

// Your component extends this
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary'
  // ... other props
}

function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['variant', 'children'])

  return (
    <button
      {...others}  // Spreads class, classList, style, data-testid, etc.
      class={`btn btn-${local.variant} ${props.class || ''}`}
    >
      {local.children}
    </button>
  )
}
```

## Props Organization

Order props in interfaces by category:

```typescript
interface ComponentProps {
  // 1. Content props
  children?: JSX.Element;
  title?: string;
  description?: string;

  // 2. Behavior props
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;

  // 3. Visual props
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  color?: string;

  // 4. Event handlers
  onClick?: (e: MouseEvent) => void;
  onChange?: (value: string) => void;

  // 5. Advanced/internal props
  ref?: HTMLElement;
  'data-testid'?: string;
}
```

## Default Values

Provide defaults for optional props:

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
}

function Button(props: ButtonProps) {
  // Use mergeProps for defaults
  const merged = mergeProps(
    { variant: 'primary', size: 'md', isDisabled: false },
    props
  )

  return (
    <button
      class={`btn btn-${merged.variant} btn-${merged.size}`}
      disabled={merged.isDisabled}
    >
      {props.children}
    </button>
  )
}

// Or document defaults in JSDoc
interface ButtonProps {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost'
}
```

## Variant Patterns

### String Variants

For mutually exclusive options:

```typescript
interface AlertProps {
  /** Alert type */
  variant: 'success' | 'warning' | 'error' | 'info';
}
```

### Boolean Flags

For independent options:

```typescript
interface TextFieldProps {
  /** Show character counter */
  hasCounter?: boolean;
  /** Show clear button */
  hasClearButton?: boolean;
  /** Show search icon */
  hasSearchIcon?: boolean;
}
```

### Size Pattern

Standardize sizes across all components:

```typescript
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ComponentProps {
  /** Component size */
  size?: Size
}

// In CSS
.component-xs { /* ... */ }
.component-sm { /* ... */ }
.component-md { /* ... */ }
.component-lg { /* ... */ }
.component-xl { /* ... */ }
```

## Controlled vs Uncontrolled

Components should support both patterns:

```typescript
interface InputProps {
  // Controlled
  value?: string
  onChange?: (value: string) => void

  // Uncontrolled
  defaultValue?: string

  // Other props
  name?: string
}

function Input(props: InputProps) {
  // Internal state for uncontrolled
  const [internalValue, setInternalValue] = createSignal(props.defaultValue || '')

  // Determine if controlled
  const isControlled = () => props.value !== undefined

  // Get current value
  const currentValue = () => isControlled() ? props.value! : internalValue()

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const newValue = e.currentTarget.value

    // Update internal state if uncontrolled
    if (!isControlled()) {
      setInternalValue(newValue)
    }

    // Call onChange if provided
    props.onChange?.(newValue)
  }

  return (
    <input
      value={currentValue()}
      onInput={handleInput}
      name={props.name}
    />
  )
}
```

## Children Pattern

Support flexible children:

```typescript
import { JSX, children as resolveChildren } from 'solid-js'

interface CardProps {
  /** Card content - can be string, element, or function */
  children: JSX.Element

  /** Card title */
  title?: string | JSX.Element

  /** Optional actions in header */
  actions?: JSX.Element
}

function Card(props: CardProps) {
  // Resolve children for multiple access
  const resolved = resolveChildren(() => props.children)

  return (
    <div class="card">
      <Show when={props.title || props.actions}>
        <div class="card-header">
          <h3>{props.title}</h3>
          {props.actions}
        </div>
      </Show>
      <div class="card-body">
        {resolved()}
      </div>
    </div>
  )
}
```

## Render Props Pattern

For complex customization:

```typescript
interface DataTableProps<T> {
  data: T[]

  // Render prop for custom cell rendering
  renderCell?: (item: T, column: string) => JSX.Element

  // Render prop for custom row rendering
  renderRow?: (item: T, index: number) => JSX.Element

  // Render prop for empty state
  renderEmpty?: () => JSX.Element
}

function DataTable<T>(props: DataTableProps<T>) {
  return (
    <Show
      when={props.data.length > 0}
      fallback={props.renderEmpty?.() || <EmptyState />}
    >
      <table>
        <For each={props.data}>
          {(item, index) =>
            props.renderRow?.(item, index()) || (
              <tr>
                <For each={Object.keys(item)}>
                  {(key) => (
                    <td>
                      {props.renderCell?.(item, key) || String(item[key])}
                    </td>
                  )}
                </For>
              </tr>
            )
          }
        </For>
      </table>
    </Show>
  )
}
```

## As Prop Pattern

For polymorphic components:

```typescript
import { Dynamic } from 'solid-js/web'

interface BoxProps extends ComponentProps<'div'> {
  /** Element type to render */
  as?: keyof JSX.IntrinsicElements
  children: JSX.Element
}

function Box(props: BoxProps) {
  const [local, others] = splitProps(props, ['as', 'children'])

  return (
    <Dynamic
      component={local.as || 'div'}
      {...others}
    >
      {local.children}
    </Dynamic>
  )
}

// Usage
<Box as="section">Content</Box>
<Box as="article">Content</Box>
<Box as="header">Content</Box>
```

## Compound Components Pattern

For related components:

```typescript
// Parent component
interface TabsProps {
  children: JSX.Element
  defaultValue?: string
}

function Tabs(props: TabsProps) {
  const [activeTab, setActiveTab] = createSignal(props.defaultValue)

  const context = {
    activeTab,
    setActiveTab
  }

  return (
    <TabsContext.Provider value={context}>
      <div class="tabs">
        {props.children}
      </div>
    </TabsContext.Provider>
  )
}

// Child components
function TabsList(props: { children: JSX.Element }) {
  return <div class="tabs-list" role="tablist">{props.children}</div>
}

function TabsTrigger(props: { value: string; children: JSX.Element }) {
  const { activeTab, setActiveTab } = useTabsContext()

  return (
    <button
      role="tab"
      aria-selected={activeTab() === props.value}
      onClick={() => setActiveTab(props.value)}
    >
      {props.children}
    </button>
  )
}

function TabsContent(props: { value: string; children: JSX.Element }) {
  const { activeTab } = useTabsContext()

  return (
    <Show when={activeTab() === props.value}>
      <div role="tabpanel">{props.children}</div>
    </Show>
  )
}

// Export as compound component
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
})

// Usage
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>
```

## Slot Pattern

For flexible layouts:

```typescript
interface LayoutProps {
  children: JSX.Element
  header?: JSX.Element
  sidebar?: JSX.Element
  footer?: JSX.Element
}

function Layout(props: LayoutProps) {
  return (
    <div class="layout">
      <Show when={props.header}>
        <header class="layout-header">{props.header}</header>
      </Show>

      <div class="layout-main">
        <Show when={props.sidebar}>
          <aside class="layout-sidebar">{props.sidebar}</aside>
        </Show>

        <main class="layout-content">{props.children}</main>
      </div>

      <Show when={props.footer}>
        <footer class="layout-footer">{props.footer}</footer>
      </Show>
    </div>
  )
}

// Usage
<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <MainContent />
</Layout>
```

## Loading & Error States

Every async component should handle these:

```typescript
interface AsyncComponentProps {
  /** Loading state */
  isLoading?: boolean

  /** Error state */
  error?: Error | null

  /** Custom loading component */
  loadingComponent?: JSX.Element

  /** Custom error component */
  errorComponent?: (error: Error) => JSX.Element
}

function AsyncComponent(props: AsyncComponentProps) {
  return (
    <Switch>
      <Match when={props.isLoading}>
        {props.loadingComponent || <Spinner />}
      </Match>

      <Match when={props.error}>
        {(error) =>
          props.errorComponent?.(error()) || (
            <ErrorMessage error={error()} />
          )
        }
      </Match>

      <Match when={true}>
        {props.children}
      </Match>
    </Switch>
  )
}
```

## Theme Integration

Support theme customization:

```typescript
interface ThemeableProps {
  /** Custom theme overrides */
  theme?: Partial<ComponentTheme>
}

interface ButtonTheme {
  primary: string
  secondary: string
  ghost: string
  radius: string
  padding: string
}

function Button(props: ButtonProps & ThemeableProps) {
  const defaultTheme: ButtonTheme = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    ghost: 'bg-transparent',
    radius: 'rounded-md',
    padding: 'px-4 py-2'
  }

  const theme = mergeProps(defaultTheme, props.theme)

  return (
    <button
      class={`${theme[props.variant]} ${theme.radius} ${theme.padding}`}
    >
      {props.children}
    </button>
  )
}
```

## Deprecation Pattern

When deprecating props:

```typescript
interface ButtonProps {
  /**
   * Button variant
   * @deprecated Use `variant` instead
   */
  type?: 'primary' | 'secondary'

  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost'
}

function Button(props: ButtonProps) {
  // Warn in development
  if (import.meta.env.DEV && props.type) {
    console.warn(
      'Button: `type` prop is deprecated. Use `variant` instead.'
    )
  }

  // Support both for backwards compatibility
  const variant = props.variant || props.type || 'primary'

  return <button class={`btn-${variant}`}>{props.children}</button>
}
```

## Documentation Requirements

Every prop must have:

````typescript
interface ComponentProps {
  /**
   * Prop description (required)
   *
   * Additional details about the prop behavior
   *
   * @default 'defaultValue' (if applicable)
   * @example
   * ```tsx
   * <Component prop="example value" />
   * ```
   */
  prop: string;
}
````

## Testing Requirements

Every component should have:

```typescript
// 1. Type tests
import { ComponentProps } from './Component';

// Should compile
const validProps: ComponentProps = {
  // ... valid props
};

// Should error
// @ts-expect-error - invalid prop
const invalidProps: ComponentProps = {
  invalidProp: 'value',
};

// 2. Unit tests
describe('Component', () => {
  test('renders with default props', () => {
    // ...
  });

  test('handles all variants', () => {
    // ...
  });

  test('calls event handlers', () => {
    // ...
  });

  test('supports custom className', () => {
    // ...
  });

  test('spreads remaining props', () => {
    // ...
  });

  test('is accessible', async () => {
    // ...
  });
});
```
