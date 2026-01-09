---
name: solidjs-doc-generator
version: 1.0.0
description: Generates comprehensive MDX documentation for SolidJS components including props tables, interactive examples, accessibility guides, and TypeScript definitions. Automatically activates when user requests component documentation.
author: Your Library Team
tags: [solidjs, documentation, mdx, api-reference]
---

# SolidJS Documentation Generator

Professional documentation generator for enterprise UI libraries.

## Activation Triggers

This skill automatically activates when the user:

- Says "document", "create docs for", or "generate documentation"
- Asks "how do I document [component]"
- Mentions "write the docs", "API reference", or "props table"
- Says "create MDX file for [component]"
- Asks about documentation structure or templates

## Documentation Philosophy

Every component doc should be:

- **Comprehensive** - Covers all features and edge cases
- **Practical** - Shows real-world usage patterns
- **Accessible** - Documents a11y features and keyboard support
- **Type-safe** - Includes full TypeScript definitions
- **Copy-pasteable** - All examples work out of the box

## Standard Documentation Structure

All component documentation follows this template:

### 1. Frontmatter (Metadata)

```yaml
---
title: ComponentName
description: Brief one-line description
category: Forms | Layout | Data Display | Feedback | Navigation | Overlay
keywords: [keyword1, keyword2, keyword3]
---
```

### 2. Component Import

```typescript
import { ComponentName } from '@your-library/ComponentName';
```

### 3. Overview (1-2 paragraphs)

Explain what the component does and primary use cases.

### 4. Quick Start

Simplest possible example (3-5 lines max)

### 5. Installation

```bash
npm install your-library
```

### 6. Props API Table

Auto-generated table with all props

### 7. Examples Section (5-7 examples)

- Basic usage
- All props demonstrated
- Controlled vs uncontrolled
- With event handlers
- Composed with other components
- Error/loading states
- Advanced usage

### 8. Accessibility

- Keyboard navigation
- ARIA attributes
- Screen reader support
- Focus management

### 9. Best Practices

Do's and Don'ts

### 10. TypeScript

Full type definitions

### 11. Styling & Theming

How to customize

### 12. Related Components

Links to similar components

### 13. Troubleshooting

Common issues and solutions

## Documentation Generation Process

### Step 1: Analyze Component Source

Read the component TypeScript file and extract:

- Component name and purpose
- Props interface with all properties
- JSDoc comments for each prop
- Default values
- Event handlers
- Ref types
- Generic type parameters (if any)

### Step 2: Generate Props Table

Create markdown table:

```markdown
## Props

| Prop       | Type                     | Default   | Required | Description                |
| ---------- | ------------------------ | --------- | -------- | -------------------------- |
| variant    | 'primary' \| 'secondary' | 'primary' | No       | Visual style variant       |
| size       | 'sm' \| 'md' \| 'lg'     | 'md'      | No       | Button size                |
| isDisabled | boolean                  | false     | No       | Whether button is disabled |
| onClick    | (e: MouseEvent) => void  | -         | No       | Click event handler        |
| children   | JSX.Element              | -         | Yes      | Button content             |
```

**Rules:**

- List props alphabetically OR by importance
- Use TypeScript union syntax for types
- Mark required props clearly
- Include default values
- Descriptions should be concise but complete

### Step 3: Create Code Examples

Generate 5-7 examples covering common use cases:

#### Example 1: Basic Usage (Simplest)

```tsx
<Button>Click me</Button>
```

#### Example 2: All Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
```

#### Example 3: Different Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

#### Example 4: With Icons

```tsx
<Button icon={<PlusIcon />}>Add Item</Button>
```

#### Example 5: Disabled State

```tsx
<Button isDisabled>Cannot Click</Button>
```

#### Example 6: Loading State

```tsx
<Button isLoading>Saving...</Button>
```

#### Example 7: Event Handling

```tsx
function MyComponent() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <Button onClick={handleClick}>Click me</Button>;
}
```

**Example Rules:**

- Each example must be syntactically correct
- Include all necessary imports
- Use realistic variable names
- Show actual use cases, not toy examples
- Add comments for complex logic
- Examples should be copy-pasteable

### Step 4: Document Accessibility

For each component, document:

#### Keyboard Support

```markdown
## Keyboard Interactions

| Key     | Action                     |
| ------- | -------------------------- |
| `Enter` | Activates the button       |
| `Space` | Activates the button       |
| `Tab`   | Moves focus to/from button |
```

#### ARIA Attributes

```markdown
## ARIA Attributes

- `role="button"` - Implicit on button element
- `aria-disabled="true"` - When disabled
- `aria-pressed="true/false"` - For toggle buttons
```

#### Screen Reader Support

```markdown
## Screen Reader

The button is announced as "Button name, button" by screen readers.
When disabled, announced as "Button name, dimmed button" or "Button name, unavailable button".
```

### Step 5: Write Best Practices

```markdown
## Best Practices

### ✅ Do

- Use semantic `<button>` element (this component does)
- Provide clear, descriptive button text
- Use `isDisabled` instead of removing the button
- Include loading states for async actions
- Use appropriate variants for visual hierarchy

### ❌ Don't

- Don't use buttons for navigation (use Link instead)
- Don't use generic text like "Click here"
- Don't rely on color alone to convey meaning
- Don't disable without explanation
- Don't use onClick for form submission (use type="submit")
```

### Step 6: Include TypeScript Definitions

`````markdown
## TypeScript

### Props Interface

```typescript
interface ButtonProps extends ComponentProps<'button'> {
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
   * Whether button is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether button is in loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon to display before button text
   */
  icon?: JSX.Element;

  /**
   * Click event handler
   */
  onClick?: (event: MouseEvent) => void;
}
```

### Usage with TypeScript

```typescript
import { Button, type ButtonProps } from 'your-library'

// Type-safe props
const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'lg',
  onClick: (e) => console.log(e)
}

<Button {...buttonProps}>Click</Button>

// Type inference works
<Button
  variant="primary"  // ✅ Valid
  size="xl"          // ❌ Type error: "xl" not in Size type
  onClick={(e) => {
    // e is typed as MouseEvent
    console.log(e.clientX)
  }}
>
  Click
</Button>
```

\```

### Step 7: Add Styling Guide

````markdown
## Styling

### CSS Classes

The Button component accepts standard className and applies:

- `btn` - Base button styles
- `btn-{variant}` - Variant-specific styles
- `btn-{size}` - Size-specific styles

```tsx
<Button class="custom-class">Button with custom class</Button>
```

### CSS Variables

Customize using CSS variables:

```css
.btn {
  --btn-primary-bg: #0066cc;
  --btn-primary-color: #ffffff;
  --btn-radius: 4px;
  --btn-padding: 0.5rem 1rem;
}
```

### Tailwind

The component works with Tailwind:

```tsx
<Button class="bg-purple-500 hover:bg-purple-600">Purple Button</Button>
```
````

### Step 8: Link Related Components

```markdown
## Related Components

- [IconButton](./IconButton) - Button with only an icon
- [ButtonGroup](./ButtonGroup) - Group multiple buttons
- [Link](./Link) - For navigation instead of actions
```

### Step 9: Add Troubleshooting

```markdown
## Troubleshooting

### Button not clickable

**Problem:** Button appears but doesn't respond to clicks.

**Solution:** Check if `isDisabled` is set to true, or if there's a CSS issue with `pointer-events`.

### Loading state not showing

**Problem:** `isLoading` prop doesn't show loading indicator.

**Solution:** Ensure you've imported the Spinner component or customize via `loadingComponent` prop.

### TypeScript errors with onClick

**Problem:** Type error when assigning onClick handler.

**Solution:** Ensure your handler signature matches `(event: MouseEvent) => void`.
```

## Output File Location

Save generated documentation to: `docs/components/[ComponentName].mdx`

## Quality Checks

Before saving, verify:

- [ ] All code examples are syntactically correct
- [ ] All internal links work
- [ ] Props table is complete and accurate
- [ ] At least 5 practical examples included
- [ ] Accessibility section is comprehensive
- [ ] TypeScript types are accurate
- [ ] No broken markdown syntax
- [ ] Frontmatter metadata is correct

## Supporting Files

Reference these when needed:

- `templates/component-doc.mdx` - Base template
- `reference/doc-style-guide.md` - Writing standards
- `reference/code-example-patterns.md` - Example formats
- `examples/button-doc.mdx` - Reference documentation

## Example Interaction

**User:** "Document the Button component"

**Claude:** "I'll generate comprehensive documentation for the Button component. Let me analyze the source code first..."

[Analyzes src/components/Button.tsx]

**Claude:** "I've created complete documentation at `docs/components/Button.mdx` including:

- Full props API reference (8 props)
- 7 practical examples
- Keyboard navigation guide
- Accessibility documentation
- TypeScript definitions
- Styling customization guide

The documentation is ready for review. Would you like me to:
a) Show you the generated file
b) Document another component
c) Create the documentation index page"

## Configuration

Customize in `.claude/config.json`:

```json
{
  "skills": {
    "solidjs-doc-generator": {
      "outputDir": "docs/components",
      "template": "templates/component-doc.mdx",
      "includeExamples": 7,
      "includeTypeScript": true,
      "includeAccessibility": true,
      "codeBlockTheme": "github-dark"
    }
  }
}
```

## Notes

- Always use **effort=high** for documentation generation
- Verify all code examples actually compile
- Check component source for JSDoc comments to include
- Look at existing docs for consistency
- Update component index after adding new docs
`````

---

### **`skills/solidjs-doc-generator/templates/component-doc.mdx`**

`````mdx
---
title: { ComponentName }
description: { One-line description of what this component does }
category: { Forms | Layout | Data Display | Feedback | Navigation | Overlay }
keywords: [{ keyword1 }, { keyword2 }, { keyword3 }]
---

import { {ComponentName} } from '@your-library/{ComponentName}'

# {ComponentName}

{One to two paragraph overview explaining what the component does, when to use it, and its primary purpose. Be specific and practical.}

## Installation

```bash
npm install your-library
# or
yarn add your-library
# or
pnpm add your-library
```

## Import

```tsx
import { {ComponentName} } from 'your-library'
```

## Quick Start

```tsx
<{ComponentName}>
  {Simplest possible example}
</{ComponentName}>
```

## Props

| Prop       | Type   | Default   | Required | Description   |
| ---------- | ------ | --------- | -------- | ------------- |
| {propName} | {type} | {default} | {Yes/No} | {description} |

## Examples

### Basic Usage

{Description of this example}

```tsx
{Code example}
```

### {Example Name}

{Description}

```tsx
{Code example}
```

{... more examples ...}

## Accessibility

### Keyboard Navigation

| Key   | Action   |
| ----- | -------- |
| {key} | {action} |

### ARIA Attributes

- `{aria-attribute}`: {description}

### Screen Reader Support

{How screen readers announce this component}

### Focus Management

{How focus works with this component}

## Best Practices

### ✅ Do

- {Recommendation}
- {Recommendation}
- {Recommendation}

### ❌ Don't

- {Anti-pattern}
- {Anti-pattern}
- {Anti-pattern}

## TypeScript

### Props Interface

```typescript
interface {ComponentName}Props {
  {Full type definition}
}
```

### Usage Examples

```typescript
{TypeScript usage examples}
```

## Styling

### CSS Classes

{How to apply custom classes}

### CSS Variables

{Available CSS variables for customization}

### Theming

{How to theme this component}

## Related Components

- [{RelatedComponent}](./{RelatedComponent}) - {When to use it instead}

## Troubleshooting

### {Common Problem}

**Problem:** {Description of problem}

**Solution:** {How to solve it}

## API Reference

{Detailed API documentation if needed}
`````

---

### **`skills/solidjs-doc-generator/reference/doc-style-guide.md`**

`````markdown
# Documentation Style Guide

## Writing Style

### Voice and Tone

- **Active voice**: "The button triggers..." not "The action is triggered by..."
- **Present tense**: "The component renders..." not "The component will render..."
- **Direct**: "Use this component for..." not "This component can be used for..."
- **Helpful**: Explain WHY, not just WHAT

### Sentence Structure

- Keep sentences short and clear
- One idea per sentence
- Use bullet points for lists of 3+ items
- Break long paragraphs into shorter ones

### Technical Terms

- Define technical terms on first use
- Use consistent terminology throughout
- Spell out acronyms: "ARIA (Accessible Rich Internet Applications)"

## Code Examples

### Example Quality

- Must be syntactically correct and runnable
- Use realistic variable names (`userData`, not `foo`)
- Include necessary imports
- Show actual use cases, not toy examples
- Add comments for complex logic

### Example Format

```tsx
// ✅ Good example
import { Button } from 'your-library';

function SubmitForm() {
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await submitData();
    setIsLoading(false);
  };

  return (
    <Button onClick={handleSubmit} isLoading={isLoading()}>
      Submit
    </Button>
  );
}
```

### Example Progression

1. **Basic** - Simplest usage (2-3 lines)
2. **Common** - Most typical use case
3. **Advanced** - Complex scenarios
4. **Edge cases** - Error states, loading, empty

## Props Documentation

### Prop Descriptions

- Start with verb: "Determines...", "Controls...", "Handles..."
- Be specific: Not "Button style" but "Visual variant affecting colors and borders"
- Mention side effects: "Disables button and prevents onClick from firing"

### Type Notation

- Use TypeScript syntax: `string | number`, not "string or number"
- Show union types: `'sm' | 'md' | 'lg'`
- Indicate optional: `prop?:` or mark as "No" in Required column

## Accessibility Documentation

### Required Sections

1. **Keyboard Navigation** - Table of keys and actions
2. **ARIA Attributes** - What's applied and why
3. **Screen Reader** - How it's announced
4. **Focus Management** - Where focus goes

### Accessibility Writing

- Use proper key names: `Enter`, not "enter" or "ENTER"
- Explain why, not just what: "Tab moves focus to the next interactive element, allowing keyboard-only users to navigate"
- Include testing tips: "Test with VoiceOver/NVDA/JAWS"

## Common Mistakes to Avoid

### ❌ Vague Descriptions

Bad: "A button component"
Good: "An interactive button that triggers actions when clicked, with support for different visual styles, sizes, and states"

### ❌ Missing Context

Bad: "Set to true to disable"
Good: "When set to true, disables the button, prevents click events, and shows a dimmed visual state"

### ❌ Assuming Knowledge

Bad: "Uses ARIA"
Good: "Uses ARIA attributes like aria-disabled to communicate state to assistive technologies like screen readers"

### ❌ Inconsistent Examples

Bad: Mixing different coding styles across examples
Good: Use the same style, naming conventions, and patterns throughout

## Formatting

### Headers

- Use ATX style: `# Header`, not underlines
- One H1 per document (the component name)
- H2 for major sections
- H3 for subsections
- Don't skip levels

### Code Blocks

- Always specify language: `tsx, not `
- Use tsx for component examples
- Use bash for terminal commands
- Use css for styles

### Links

- Use relative links: `[Button](./Button)`, not full URLs
- Link text should describe destination: "See the Button component" not "click here"
- Check all links work

### Lists

- Use `-` for unordered lists
- Use `1.` for ordered lists
- Keep list items parallel in structure
- Don't mix bullet styles

## Length Guidelines

- **Overview**: 1-2 paragraphs (100-200 words)
- **Prop description**: 1-2 sentences
- **Code example**: 5-30 lines
- **Best practice item**: 1 sentence
- **Troubleshooting solution**: 2-5 sentences

## Quality Checklist

Before marking documentation as complete:

- [ ] All code examples run without errors
- [ ] Props table is complete and accurate
- [ ] At least 5 practical examples included
- [ ] Accessibility fully documented
- [ ] TypeScript types shown
- [ ] Best practices included
- [ ] Related components linked
- [ ] No spelling/grammar errors
- [ ] Consistent formatting
- [ ] All links work
`````
