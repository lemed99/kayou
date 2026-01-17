# Documentation Style Guide

## Writing Principles

### Voice and Tone

- **Direct**: "Use this component when..." not "This component can be used when..."
- **Active**: "The button triggers..." not "The action is triggered by..."
- **Present tense**: "The component renders..." not "will render..."
- **Helpful**: Explain WHY, not just WHAT

### Sentence Structure

- Keep sentences short (15-25 words ideal)
- One idea per sentence
- Use bullet points for 3+ items
- Break paragraphs at 3-4 sentences

## Document Structure

### Required Sections (in order)

1. **Title** (H1) - Component name
2. **Overview** - 1-2 paragraphs explaining purpose
3. **Installation** - npm/yarn/pnpm commands
4. **Import** - How to import
5. **Quick Start** - Simplest example (3-5 lines)
6. **Props** - Full props table
7. **Examples** - 5-7 practical examples
8. **Accessibility** - Keyboard, ARIA, screen reader
9. **Best Practices** - Do's and Don'ts
10. **TypeScript** - Full type definitions
11. **Styling** - Customization options
12. **Related Components** - Links
13. **Troubleshooting** - Common issues

### Optional Sections

- Migration guide (if breaking changes)
- Advanced usage
- Performance considerations
- API Reference (for complex components)

## Props Table Format

```markdown
| Prop       | Type   | Default   | Required | Description |
| ---------- | ------ | --------- | -------- | ----------- |
| `propName` | `type` | `default` | Yes/No   | Description |
```

### Rules

- List required props first, then optional
- Use TypeScript syntax for types: `'a' \| 'b'`
- Always include default value (use `-` if none)
- Descriptions start with verb: "Sets...", "Controls...", "Handles..."

### Type Formatting

```markdown
// Simple types
`string`
`number`
`boolean`

// Union types
`'sm' \| 'md' \| 'lg'`

// Function types
`(value: string) => void`
`(event: MouseEvent) => void`

// Object types
`{ label: string; value: string }`

// Array types
`string[]`
`Option[]`

// JSX
`JSX.Element`
```

## Code Examples

### Quality Standards

- Must be syntactically correct
- Must be copy-pasteable
- Use realistic names (`userData` not `foo`)
- Include necessary imports
- Add comments for complex logic

### Example Progression

1. **Basic** - Simplest usage (2-3 lines)
2. **Variants** - All visual options
3. **Sizes** - All size options
4. **States** - Disabled, loading, error
5. **Events** - Click, change handlers
6. **Controlled** - With state management
7. **Composed** - With other components

### Code Block Format

````tsx
// Always specify language
```tsx
<Button>Click me</Button>
````

// For bash commands

```bash
npm install package
```

// For type definitions

```typescript
interface Props {}
```

````

### Inline vs Block Code

Use inline code for:
- Prop names: `variant`
- Type names: `ButtonProps`
- Values: `"primary"`
- Short snippets: `onClick={() => {}}`

Use code blocks for:
- Multi-line code
- Full examples
- Type definitions

## Accessibility Section

### Required Subsections

1. **Keyboard Navigation** - Table of keys and actions
2. **ARIA Attributes** - What's applied automatically
3. **Screen Reader Support** - How it's announced

### Keyboard Table Format

```markdown
| Key | Action |
|-----|--------|
| `Tab` | Move focus |
| `Enter` | Activate |
````

### Key Names

Use these exact names:

- `Tab`
- `Enter`
- `Space`
- `Escape`
- `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight`
- `Home` / `End`

## Best Practices Section

### Format

```markdown
### Do

- First recommendation
- Second recommendation
- Third recommendation

### Don't

- First anti-pattern
- Second anti-pattern
- Third anti-pattern
```

### Guidelines

- 3-5 items per list
- Start with verbs: "Use...", "Provide...", "Don't rely..."
- Be specific and actionable
- Include the WHY when not obvious

## TypeScript Section

### Required Content

1. Full props interface with JSDoc
2. Usage example showing type imports
3. Type-safe usage patterns

### JSDoc Format

```typescript
interface Props {
  /**
   * Brief description
   * @default 'default-value'
   */
  propName?: Type;
}
```

## Troubleshooting Section

### Format

```markdown
### Problem Title

**Problem:** Description of what's wrong

**Solution:** How to fix it, with code if needed
```

### Common Problems to Document

- Component not rendering
- Events not firing
- Styles not applying
- TypeScript errors
- Accessibility issues

## Formatting Guidelines

### Headers

- H1: Component name only
- H2: Major sections
- H3: Subsections
- Don't skip levels

### Lists

- Use `-` for unordered lists
- Use `1.` for ordered lists
- Keep items parallel in structure

### Links

- Use relative paths: `[Button](./Button)`
- Descriptive text: "See the Button component"

### Emphasis

- **Bold** for important terms
- `Code` for code-related items
- _Italic_ sparingly for emphasis

## Length Guidelines

| Section            | Length             |
| ------------------ | ------------------ |
| Overview           | 50-150 words       |
| Quick Start        | 3-5 lines of code  |
| Prop description   | 5-15 words         |
| Example            | 5-30 lines of code |
| Best practice item | 5-20 words         |

## Quality Checklist

Before considering documentation complete:

- [ ] All code examples compile
- [ ] Props table matches actual component
- [ ] At least 5 practical examples
- [ ] Accessibility fully documented
- [ ] TypeScript types shown
- [ ] Best practices included
- [ ] Related components linked
- [ ] No spelling errors
- [ ] Consistent formatting
- [ ] All internal links work
