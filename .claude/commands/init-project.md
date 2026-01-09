### Step 1: Scan Project Structure

```bash
# Read package.json
cat package.json

# List all component files
find src/components -name "*.tsx" -o -name "*.ts"

# Check existing docs
find docs -name "*.mdx" -o -name "*.md"

# Check test coverage
find tests -name "*.test.ts" -o -name "*.test.tsx"
```

### Step 2: Analyze Each Component

For each component in `src/components/`:

1. Read the source file
2. Extract:
   - Component name
   - Props interface
   - JSDoc comments
   - Exported types
3. Check for:
   - Associated test file
   - Associated doc file
   - TypeScript issues
   - Common anti-patterns

### Step 3: Fetch SolidJS Documentation

Use web_search and web_fetch to get:

- https://docs.solidjs.com/concepts/components/basics
- https://docs.solidjs.com/concepts/reactivity
- https://docs.solidjs.com/references/api-reference/basic-reactivity/create-signal
- https://docs.solidjs.com/guides/typescript

Save key patterns to `.claude/SOLIDJS_BEST_PRACTICES.md`

### Step 4: Create Project Context Document

Generate `.claude/PROJECT_CONTEXT.md`:

```markdown
# Project Context: [Your Library Name]

Last Updated: [Date]
Total Components: [N]
Documentation Coverage: [X%]
Test Coverage: [Y%]

## Project Overview

**Purpose:** [From package.json description]
**Target Users:** [Developers building with SolidJS]
**Design Philosophy:** [Extract from README]

## Technology Stack

- **Framework:** SolidJS [version]
- **Language:** TypeScript [version]
- **Build Tool:** Vite
- **Testing:** Vitest
- **Styling:** [CSS Modules | Tailwind | etc.]

## Component Inventory

| Component | Category | Props | Tests | Docs | Status     | Priority |
| --------- | -------- | ----- | ----- | ---- | ---------- | -------- |
| Button    | Forms    | 8     | ✅    | ❌   | Needs docs | High     |
| Input     | Forms    | 12    | ✅    | ✅   | Complete   | -        |
| Modal     | Overlay  | 10    | ❌    | ❌   | Needs work | Critical |
| Card      | Layout   | 5     | ✅    | ✅   | Complete   | -        |

**Legend:**

- ✅ Complete
- ⚠️ Partial
- ❌ Missing

## Architecture Notes

### State Management

[How state is managed - signals, stores, context]

### Styling Approach

[CSS modules, Tailwind, styled-components, etc.]

### Accessibility Strategy

[ARIA patterns, keyboard nav, testing approach]

### Testing Strategy

[Unit tests, integration tests, a11y tests]

### Build Configuration

[Vite config, bundle size targets, tree-shaking]

## Current Issues

### Critical (Block Release)

1. [Issue description]
2. [Issue description]

### High Priority (Fix Before v1.0)

1. [Issue description]
2. [Issue description]

### Medium Priority (Post v1.0)

1. [Issue description]

## Dependencies Audit

### Production Dependencies

- solid-js: [version] - ✅ Up to date
- [other deps]

### Dev Dependencies

- typescript: [version] - ✅ Up to date
- vite: [version] - ⚠️ Update available
- [other deps]

## File Structure

src/
├── components/ [N components]
├── hooks/ [N hooks]
├── utils/ [N utilities]
└── index.ts [Main export]

docs/
├── components/ [N documented]
├── guides/ [N guides]
└── api/ [API reference]

tests/
├── components/ [N tested]
└── setup.ts

examples/
└── [example apps]
```

## Improvement Roadmap

### Phase 1: Critical Fixes (Week 1)

- [ ] Fix Modal accessibility issues
- [ ] Add missing TypeScript types
- [ ] Fix props destructuring in 5 components

### Phase 2: Documentation (Week 2)

- [ ] Document 20 undocumented components
- [ ] Create getting started guide
- [ ] Add migration guide

### Phase 3: Enhancement (Week 3)

- [ ] Add theming system
- [ ] Improve performance
- [ ] Add more examples

### Phase 4: Polish (Week 4)

- [ ] Create landing page
- [ ] Build MCP server
- [ ] Publish v1.0

## Notes for Claude

- Component files follow [naming convention]
- All props interfaces should extend ComponentProps<'element'>
- Tests use Vitest and @solidjs/testing-library
- Documentation uses MDX format
- Follow .claude/SOLIDJS_BEST_PRACTICES.md for patterns

````

### Step 5: Create Supporting Reference Files

Generate these files:

1. `.claude/SOLIDJS_BEST_PRACTICES.md` - From official docs
2. `.claude/TYPESCRIPT_PATTERNS.md` - TypeScript best practices
3. `.claude/ACCESSIBILITY_STANDARDS.md` - WCAG and ARIA guidelines
4. `.claude/COMPONENT_CONVENTIONS.md` - Library-specific conventions
4. `.claude/ANTI_PATTERNS.md` - Common mistakes to avoid

### Step 6: Create Audit Directory

```bash
mkdir -p .claude/audits
mkdir -p .claude/reports
````

Create `.claude/audits/MASTER_TRACKER.md`:

```markdown
# Master Audit Tracker

| Component | Last Audit | Score | Critical | High | Medium | Low | Status      |
| --------- | ---------- | ----- | -------- | ---- | ------ | --- | ----------- |
| Button    | -          | -     | -        | -    | -      | -   | Not audited |
| Input     | -          | -     | -        | -    | -      | -   | Not audited |

## Audit History

[Audits will be recorded here as they're performed]
```

## Output

After running this command, you should have:

- ✅ `.claude/PROJECT_CONTEXT.md` - Complete project overview
- ✅ `.claude/SOLIDJS_BEST_PRACTICES.md` - SolidJS patterns
- ✅ `.claude/TYPESCRIPT_PATTERNS.md` - TypeScript best practices
- ✅ `.claude/ACCESSIBILITY_STANDARDS.md` - WCAG and ARIA guidelines
- ✅ `.claude/COMPONENT_CONVENTIONS.md` - Library-specific conventions
- ✅ `.claude/ANTI_PATTERNS.md` - Common mistakes to avoid
- ✅ `.claude/audits/` - Directory for audit reports
- ✅ `.claude/reports/` - Directory for status reports
- ✅ Component inventory with status
- ✅ Prioritized improvement roadmap

## Success Criteria

- [ ] All components identified and categorized
- [ ] Documentation coverage calculated
- [ ] Test coverage noted
- [ ] Top 10 issues identified
- [ ] Improvement roadmap created
- [ ] All reference files generated
