---
name: solidjs-doc-generator
version: 2.1.0
description: Generates comprehensive TSX documentation pages for SolidJS components including props tables, interactive examples, accessibility guides, and TypeScript definitions.
author: @kayou/ui
tags: [solidjs, documentation, tsx, api-reference]
---

# SolidJS Documentation Generator

Professional documentation generator for enterprise UI libraries.

## Activation Triggers

This skill activates when the user:

- Says "document", "create docs for", or "generate documentation"
- Asks "write the docs for [component]"
- Mentions "API reference" or "props table"
- Says "create doc page for [component]"

## Quick Start

```
User: "Document the Button component"

Claude:
1. Reads src/components/Button.tsx
2. Extracts props interface and JSDoc
3. Loads doc style guide and DocPage component
4. Generates TSX documentation page with live examples
5. Saves to doc/src/pages/components/button.tsx
```

## Documentation Philosophy

Every component doc should be:

- **Comprehensive** - Covers all props, states, and edge cases
- **Practical** - Shows real-world usage patterns
- **Accessible** - Documents a11y features and keyboard support
- **Type-safe** - Includes full TypeScript definitions
- **Copy-pasteable** - All examples work out of the box

## Documentation Process

### Phase 1: Analyze Component

1. Read the component source file
2. Extract from TypeScript:
   - Props interface
   - Type definitions
   - Default values
   - JSDoc comments
3. Identify:
   - Component category
   - Related components
   - State patterns (controlled/uncontrolled)

### Phase 2: Load References

**Required files:**

```
skills/solidjs-doc-generator/templates/component-doc.mdx
skills/solidjs-doc-generator/reference/doc-style-guide.md
```

**Example reference:**

```
skills/solidjs-doc-generator/examples/Button.mdx
```

**Project context:**

```
.claude/PROJECT_CONTEXT.md
.claude/COMPONENT_CONVENTIONS.md
```

### Phase 3: Generate Sections

#### 1. Frontmatter

```yaml
---
title: ComponentName
description: Brief one-line description
category: Forms | Layout | Data Display | Feedback | Navigation | Overlay
---
```

#### 2. Overview

- 1-2 paragraphs explaining purpose
- When to use this component
- Key features

#### 3. Installation & Import

```tsx
npm install @kayou/ui
import { ComponentName } from '@kayou/ui'
```

#### 4. Quick Start

Simplest possible working example (3-5 lines max).

#### 5. Props Table

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |

**Rules:**

- Required props first
- TypeScript union syntax for types
- Include all default values
- Descriptions start with verbs

#### 6. Examples (5-7 minimum)

Generate examples for:

1. Basic usage
2. All variants/colors
3. All sizes
4. States (disabled, loading, error)
5. Event handling
6. Controlled usage
7. Composed with other components

**Example format:**

````markdown
### Example Title

Brief description of what this shows.

```tsx
<ComponentName prop="value">Content</ComponentName>
```
````

````

#### 7. Accessibility

Document:
- Keyboard navigation table
- ARIA attributes
- Screen reader behavior
- Focus management

#### 8. Best Practices

```markdown
### Do

- Recommendation 1
- Recommendation 2

### Don't

- Anti-pattern 1
- Anti-pattern 2
````

#### 9. TypeScript

- Full props interface with JSDoc
- Usage example with type imports
- Type-safe patterns

#### 10. Styling

- Custom class support
- CSS variables (if any)
- Theme customization

#### 11. Related Components

Links to similar or complementary components.

#### 12. Troubleshooting

Common problems and solutions.

### Phase 4: Quality Check

Before saving, verify:

- [ ] All code examples are syntactically correct
- [ ] Props table matches actual component
- [ ] At least 5 practical examples
- [ ] Accessibility section complete
- [ ] TypeScript types accurate
- [ ] No markdown syntax errors

### Phase 5: Save and Index

**Output location:** `doc/src/pages/components/[componentname].tsx` (lowercase)

**Note:** The doc site uses file-based routing via `vite-plugin-pages`. The file name becomes the URL path.

**Update index:** Routes are auto-generated from the file structure.

## Document Structure

```markdown
# ComponentName

[Overview - 1-2 paragraphs]

## Installation

## Import

## Quick Start

## Props

## Examples

### Basic Usage

### Variants

### Sizes

### States

### Event Handling

### Controlled

### Composed

## Accessibility

### Keyboard Navigation

### ARIA Attributes

### Screen Reader Support

## Best Practices

### Do

### Don't

## TypeScript

### Props Interface

### Usage

## Styling

## Related Components

## Troubleshooting
```

## Example Output

See: `skills/solidjs-doc-generator/examples/Button.mdx`

This example shows a complete documentation file for the Button component with all required sections.

## Files in This Skill

```
skills/solidjs-doc-generator/
├── SKILL.md                        # This file
├── templates/
│   └── component-doc.mdx           # MDX template
├── reference/
│   └── doc-style-guide.md          # Writing style guide
└── examples/
    └── Button.mdx                  # Complete example
```

## Configuration

In `.claude/config.json`:

```json
{
  "skills": {
    "solidjs-doc-generator": {
      "outputDir": "doc/src/pages/components",
      "format": "tsx",
      "docPageComponent": "doc/src/components/DocPage.tsx",
      "includeExamples": 5,
      "includeTypeScript": true,
      "includeAccessibility": true
    }
  }
}
```

## TSX Documentation Format

The doc site uses a `DocPage` component that renders structured documentation. Each doc page is a TSX file that imports the component and renders it with `DocPage`.

### DocPage Props Structure

```typescript
interface DocPageProps {
  title: string;
  description: string;
  props: {
    name: string;
    type: string;
    default: string;
    description: string;
  }[];
  examples: {
    title: string;
    description?: string;
    code: string; // Code string for display
    component: () => JSX.Element; // Live component render
  }[];
  usage: string; // Import and usage code block
}
```

### Example Doc Page

```tsx
import { createSignal } from 'solid-js';

import Button from '@lib/components/Button';

import DocPage from '../../components/DocPage';

export default function ButtonPage() {
  return (
    <DocPage
      title="Button"
      description="A versatile button component..."
      props={[
        {
          name: 'color',
          type: '"info" | "success"',
          default: '"info"',
          description: 'Sets color',
        },
      ]}
      examples={[
        {
          title: 'Color Variants',
          code: `<Button color="info">Info</Button>`,
          component: () => <Button color="info">Info</Button>,
        },
      ]}
      usage={`import { Button } from '@kayou/ui';`}
    />
  );
}
```

### Key Points

- Import component via `@lib/` alias (maps to `../src/`)
- Import DocPage from `../../components/DocPage`
- Examples have both `code` (string) and `component` (function)
- File name is lowercase: `button.tsx` not `Button.tsx`

## Example Interaction

**User:** "Document the DatePicker component"

**Claude:** "I'll generate comprehensive documentation for DatePicker. Let me analyze the component..."

[Reads `src/components/DatePicker.tsx`]

**Claude:** "I've analyzed the DatePicker component. It has:

- 15 props including value, onChange, type, locale
- Supports single, multiple, and range selection
- Uses Portal for calendar positioning

Generating documentation..."

[Creates documentation]

**Claude:** "Documentation created at `docs/components/DatePicker.mdx`:

- Full props API (15 props documented)
- 7 examples including date range selection
- Keyboard navigation guide
- TypeScript definitions
- Accessibility documentation

Would you like me to:
a) Show the generated file
b) Document another component
c) Update the docs index"

## Batch Documentation

For documenting multiple components:

```
User: "Document all Form components"

Claude:
1. Finds all components in Forms category
2. Documents each one
3. Creates index page
4. Reports summary
```

## Integration with Auditor

Documentation coverage is part of the audit score. After documenting:

```
User: "Audit Button again"
```

The Testing/Docs score should improve.

## Notes

- Always read component source first
- Extract JSDoc comments for prop descriptions
- Verify examples compile
- Follow style guide strictly
- Update component index after adding docs
