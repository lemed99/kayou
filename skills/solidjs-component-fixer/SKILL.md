---
name: solidjs-component-fixer
version: 1.0.0
description: Automatically fixes common SolidJS component issues including type safety problems, reactivity bugs, accessibility violations, and anti-patterns. Applies fixes systematically and safely with proper testing.
author: Your Library Team
tags: [solidjs, fix, refactor, typescript, accessibility]
---

# SolidJS Component Fixer

Automated fix system for SolidJS component issues.

## Activation Triggers

This skill automatically activates when the user:

- Says "fix", "repair", or "correct" followed by a component name
- Says "fix the issues in [component]"
- Asks "can you fix the problems"
- Says "apply the fixes from the audit"
- Mentions "refactor [component]" or "improve [component]"

## Fix Philosophy

All fixes must be:

- **Safe** - Don't break existing functionality
- **Tested** - Verify fixes work with tests
- **Incremental** - Fix one category at a time
- **Documented** - Explain what was fixed and why
- **Reversible** - Create commits that can be rolled back

## Fix Categories

### 1. Type Safety Fixes (Priority: Critical)

#### Issue: Missing Type Annotations

```typescript
// BEFORE - No types
function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}

// AFTER - Proper types
import { ComponentProps, JSX } from 'solid-js'

interface ButtonProps extends ComponentProps<'button'> {
  /** Button content */
  children: JSX.Element
  /** Click handler */
  onClick?: (e: MouseEvent) => void
}

function Button(props: ButtonProps): JSX.Element {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### Issue: Using 'any' Type

```typescript
// BEFORE - Using any
interface FormProps {
  onSubmit: any;
  data: any;
}

// AFTER - Specific types
interface FormProps {
  onSubmit: (data: FormData) => void | Promise<void>;
  data: Record<string, string | number>;
}
```

#### Issue: Loose Event Handler Types

```typescript
// BEFORE
interface InputProps {
  onChange?: Function;
}

// AFTER
interface InputProps {
  onChange?: (value: string, event: InputEvent) => void;
}
```

### 2. SolidJS Reactivity Fixes (Priority: Critical)

#### Issue: Destructured Props

```typescript
// BEFORE - BROKEN REACTIVITY
function Button({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// AFTER - FIXED
function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} disabled={props.disabled}>
      {props.label}
    </button>
  )
}
```

#### Issue: Using React Hooks

```typescript
// BEFORE - React patterns
import { useState, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(count)
  }, [count])

  return <div>{count}</div>
}

// AFTER - Solid patterns
import { createSignal, createEffect } from 'solid-js'

function Counter() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    console.log(count())
  })

  return <div>{count()}</div>
}
```

#### Issue: Missing Effect Cleanup

```typescript
// BEFORE - Memory leak
function Timer() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
  })

  return <div>{count()}</div>
}

// AFTER - Proper cleanup
function Timer() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)

    onCleanup(() => clearInterval(interval))
  })

  return <div>{count()}</div>
}
```

#### Issue: Effect Used for Derived State

```typescript
// BEFORE - Wrong pattern
function FullName() {
  const [first, setFirst] = createSignal('John')
  const [last, setLast] = createSignal('Doe')
  const [full, setFull] = createSignal('')

  createEffect(() => {
    setFull(`${first()} ${last()}`)
  })

  return <div>{full()}</div>
}

// AFTER - Use memo or function
function FullName() {
  const [first, setFirst] = createSignal('John')
  const [last, setLast] = createSignal('Doe')

  const full = createMemo(() => `${first()} ${last()}`)

  return <div>{full()}</div>
}
```

### 3. Accessibility Fixes (Priority: High)

#### Issue: Missing ARIA Labels

```typescript
// BEFORE
<button onClick={handleClose}>
  <XIcon />
</button>

// AFTER
<button onClick={handleClose} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

#### Issue: Missing Keyboard Support

```typescript
// BEFORE - Mouse only
<div onClick={handleClick}>Click me</div>

// AFTER - Keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
  Click me
</button>
```

#### Issue: Missing Alt Text

```typescript
// BEFORE
<img src={user.avatar} />

// AFTER
<img src={user.avatar} alt={`${user.name}'s profile picture`} />
```

#### Issue: No Focus Management in Modal

```typescript
// BEFORE
function Modal(props: ModalProps) {
  return (
    <dialog open={props.open}>
      {props.children}
    </dialog>
  )
}

// AFTER
function Modal(props: ModalProps) {
  let dialogRef: HTMLDialogElement | undefined
  let previousFocus: HTMLElement | null = null

  createEffect(() => {
    if (props.open && dialogRef) {
      // Save previous focus
      previousFocus = document.activeElement as HTMLElement

      // Open modal and focus first element
      dialogRef.showModal()
      const firstFocusable = dialogRef.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()

      onCleanup(() => {
        // Restore focus
        previousFocus?.focus()
      })
    }
  })

  return (
    <dialog ref={dialogRef} aria-modal="true">
      {props.children}
    </dialog>
  )
}
```

### 4. Component API Fixes (Priority: Medium)

#### Issue: Not Spreading Rest Props

```typescript
// BEFORE - Doesn't support className, style, etc.
function Card(props: CardProps) {
  return (
    <div class="card">
      {props.children}
    </div>
  )
}

// AFTER - Supports all standard props
import { splitProps } from 'solid-js'

function Card(props: CardProps) {
  const [local, others] = splitProps(props, ['children'])

  return (
    <div class="card" {...others}>
      {local.children}
    </div>
  )
}
```

#### Issue: Inconsistent Prop Naming

```typescript
// BEFORE
interface ButtonProps {
  disabled: boolean; // Should be isDisabled
  loading: boolean; // Should be isLoading
  OnClick: () => void; // Should be onClick
}

// AFTER
interface ButtonProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}
```

### 5. Performance Fixes (Priority: Medium)

#### Issue: Expensive Computation Without Memo

```typescript
// BEFORE - Recomputes every render
function UserList(props: { users: User[] }) {
  const [filter, setFilter] = createSignal('')

  const filtered = () => {
    // Expensive operation runs on EVERY access
    return props.users.filter(u =>
      u.name.toLowerCase().includes(filter().toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <For each={filtered()}>
      {user => <UserCard user={user} />}
    </For>
  )
}

// AFTER - Memoized
function UserList(props: { users: User[] }) {
  const [filter, setFilter] = createSignal('')

  const filtered = createMemo(() => {
    // Only recomputes when users or filter changes
    return props.users.filter(u =>
      u.name.toLowerCase().includes(filter().toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name))
  })

  return (
    <For each={filtered()}>
      {user => <UserCard user={user} />}
    </For>
  )
}
```

#### Issue: Multiple Updates Not Batched

```typescript
// BEFORE - 3 separate renders
function updateUser(id: number, data: UserData) {
  setName(data.name)
  setEmail(data.email)
  setAge(data.age)
}

// AFTER - Single render
import { batch } from 'solid-js'

function updateUser(id: number, data: UserData) {
  batch(() => {
    setName(data.name)
    setEmail(data.email)
    setAge(data.age)
  })
}
```

## Fix Process

### Step 1: Read Audit Report

If an audit report exists at `.claude/audits/[Component]-*.md`:

1. Read the full audit report
2. Extract all issues by severity
3. Group related issues
4. Plan fix order (critical → high → medium → low)

If no audit report:

1. Perform quick audit first
2. Create audit report
3. Then proceed with fixes

### Step 2: Plan Fixes

Create a fix plan:

```markdown
# Fix Plan for [Component]

## Critical Issues (Fix Immediately)

1. Props destructured - breaks reactivity
   - Estimated effort: 15 minutes
   - Test impact: High
2. Missing TypeScript types
   - Estimated effort: 30 minutes
   - Test impact: Medium

## High Priority Issues (Fix Before Release)

3. Missing keyboard support
   - Estimated effort: 20 minutes
   - Test impact: High

## Medium Priority Issues (Post-Release)

4. Not spreading rest props
   - Estimated effort: 10 minutes
   - Test impact: Low

## Fix Order

1. Fix TypeScript types (enables better autocomplete for remaining fixes)
2. Fix props destructuring (critical reactivity issue)
3. Add keyboard support (accessibility critical)
4. Spread rest props (API improvement)
```

### Step 3: Apply Fixes Incrementally

Fix one category at a time:

```bash
# Fix 1: Type Safety
git checkout -b fix/button-types
[Apply type fixes]
npm run test
git commit -m "fix(Button): add TypeScript types"

# Fix 2: Reactivity
[Apply reactivity fixes]
npm run test
git commit -m "fix(Button): fix props destructuring"

# Fix 3: Accessibility
[Apply a11y fixes]
npm run test
git commit -m "fix(Button): add keyboard support and ARIA labels"

# Fix 4: API improvements
[Apply API fixes]
npm run test
git commit -m "feat(Button): support rest props spreading"
```

### Step 4: Update Tests

For each fix, update or add tests:

```typescript
// Test for type safety
describe('Button types', () => {
  it('accepts valid props', () => {
    const props: ButtonProps = {
      variant: 'primary',
      onClick: () => {}
    }
    expect(() => <Button {...props} />).not.toThrow()
  })

  it('rejects invalid props', () => {
    // @ts-expect-error - invalid variant
    const props: ButtonProps = {
      variant: 'invalid'
    }
  })
})

// Test for reactivity fix
describe('Button reactivity', () => {
  it('updates when label prop changes', () => {
    const [label, setLabel] = createSignal('Initial')

    const { getByText } = render(() => (
      <Button>{label()}</Button>
    ))

    expect(getByText('Initial')).toBeInTheDocument()

    setLabel('Updated')
    expect(getByText('Updated')).toBeInTheDocument()
  })
})

// Test for accessibility fix
describe('Button accessibility', () => {
  it('responds to keyboard events', () => {
    const onClick = vi.fn()
    const { getByRole } = render(() => (
      <Button onClick={onClick}>Click</Button>
    ))

    const button = getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Step 5: Update Documentation

After fixes, update component documentation:

````markdown
## Breaking Changes (if any)

### v2.0.0

**Props interface changed:**

- `disabled` renamed to `isDisabled` (boolean)
- `onClick` now typed as `(e: MouseEvent) => void`

**Migration:**

```tsx
// Before
<Button disabled onClick={handler} />

// After
<Button isDisabled onClick={handler} />
```

## New Features

- Added keyboard support (Enter/Space)
- Added ARIA labels for accessibility
- Now supports className/style spreading
````

### Step 6: Generate Commit Messages

Use conventional commit format:

```
fix(ComponentName): brief description

- Fixed specific issue 1
- Fixed specific issue 2
- Added feature to address issue 3

BREAKING CHANGE: If applicable, describe breaking change

Closes #issue-number
```

Examples:

```
fix(Button): fix reactivity and type safety

- Fixed props destructuring breaking reactivity
- Added proper TypeScript types for all props
- Added missing event handler types

Closes #123
```

```
feat(Button): add accessibility features

- Added keyboard support (Enter/Space keys)
- Added aria-label for icon-only buttons
- Improved focus management

Closes #124
```

## Fix Validation

Before considering a fix complete:

### 1. Code Compiles

```bash
npm run type-check
```

### 2. Tests Pass

```bash
npm run test
npm run test:a11y  # If available
```

### 3. Linter Passes

```bash
npm run lint
```

### 4. No New Issues

```bash
# Run audit again
claude /project:audit-component [ComponentName]
```

### 5. Documentation Updated

- [ ] Component docs reflect changes
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)
- [ ] Examples updated

## Safety Checks

Before applying fixes:

### 1. Backup Current State

```bash
git add -A
git stash
git checkout -b fix/component-name
git stash pop
```

### 2. Incremental Application

- Fix one issue at a time
- Test after each fix
- Commit working fixes immediately

### 3. Rollback Plan

If a fix breaks things:

```bash
git reset --hard HEAD~1  # Undo last commit
# Or
git revert <commit-hash>  # Create reverting commit
```

## Fix Templates

### Template: Add TypeScript Types

```typescript
// 1. Import necessary types
import { ComponentProps, JSX } from 'solid-js'

// 2. Create props interface
interface [Component]Props extends ComponentProps<'element'> {
  /** Prop description */
  propName: PropType
}

// 3. Add return type
function [Component](props: [Component]Props): JSX.Element {
  // Implementation
}

// 4. Export type
export type { [Component]Props }
```

### Template: Fix Props Destructuring

```typescript
// 1. Change function signature
// FROM: function Component({ prop1, prop2 }) {
// TO:   function Component(props: ComponentProps) {

// 2. Replace all uses
// FROM: {prop1}
// TO:   {props.prop1}

// 3. For complex cases, use splitProps
import { splitProps } from 'solid-js'

function Component(props: ComponentProps) {
  const [local, others] = splitProps(props, ['prop1', 'prop2'])

  return <div {...others}>{local.prop1}</div>
}
```

### Template: Add Accessibility

```typescript
function Component(props: ComponentProps) {
  return (
    <element
      // 1. Add role if needed
      role="button"

      // 2. Add ARIA label
      aria-label={props['aria-label'] || 'Default label'}

      // 3. Add keyboard support
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          props.onClick?.(e)
        }
      }}

      // 4. Add ARIA state
      aria-disabled={props.isDisabled}

      onClick={props.onClick}
    >
      {props.children}
    </element>
  )
}
```

## Configuration

Configure fix behavior in `.claude/config.json`:

```json
{
  "skills": {
    "solidjs-component-fixer": {
      "autoTest": true,
      "createBackup": true,
      "incrementalCommits": true,
      "strictMode": true,
      "fixPriority": ["critical", "high", "medium", "low"]
    }
  }
}
```

## Example Interaction

**User:** "Fix the Button component"

**Claude:** "I'll fix the Button component. Let me start by checking for any existing audit report..."

[Reads `.claude/audits/Button-2024-01-09.md`]

**Claude:** "Found audit report with 5 issues:

- 2 critical (props destructuring, missing types)
- 2 high (missing keyboard support, no ARIA labels)
- 1 medium (not spreading rest props)

I'll fix them in order of priority. Starting with critical issues...

**Fix 1/5: Adding TypeScript types**
[Shows code changes]
✅ Types added
✅ Tests pass
✅ Committed: `fix(Button): add TypeScript types`

**Fix 2/5: Removing props destructuring**
[Shows code changes]
✅ Reactivity fixed
✅ Tests pass
✅ Committed: `fix(Button): fix props destructuring`

All fixes applied successfully!

Summary:

- 5 issues fixed
- 5 commits created
- All tests passing
- Ready for review

Would you like me to:
a) Generate a PR description
b) Update the documentation
c) Fix another component"

## Notes

- Always use **effort=medium** for fixes (high for complex refactors)
- Test thoroughly after each fix
- Document breaking changes clearly
- Keep fixes focused and atomic
- Create detailed commit messages
