---
name: solidjs-component-fixer
version: 2.0.0
description: Automated fix system for SolidJS component issues. Reads audit reports and applies fixes in priority order with atomic commits. Integrates with solidjs-component-auditor.
author: @exowpee/solidly
tags: [solidjs, fix, refactor, typescript, accessibility]
---

# SolidJS Component Fixer

Automated fix system for SolidJS component issues.

## Activation Triggers

This skill activates when the user:

- Says "fix", "repair", or "correct" followed by a component name
- Says "fix the issues in [component]"
- Says "apply the fixes from the audit"
- Mentions "refactor [component]" based on audit

## Quick Start

```
User: "Fix the Button component"

Claude:
1. Checks for audit report at .claude/audits/Button-*.md
2. If no report, runs quick audit first
3. Groups fixes by category
4. Applies fixes in priority order (Critical → High → Medium)
5. Creates atomic commits for each fix category
6. Verifies fixes with type check
```

## Fix Philosophy

All fixes must be:

- **Safe** - Don't break existing functionality
- **Incremental** - One category at a time
- **Documented** - Explain what changed and why
- **Reversible** - Atomic commits that can be rolled back
- **Verified** - Type check after each fix

## Fix Process

### Phase 1: Load Audit Report

**Check for existing report:**

```
.claude/audits/[ComponentName]-YYYY-MM-DD.md
```

**If no report exists:**

1. Inform user no audit found
2. Offer to run quick audit first
3. Generate minimal report for fixes

### Phase 2: Group and Prioritize Issues

Group issues by category:

1. **Critical** - Fix immediately (blocks release)
2. **High** - Fix before release
3. **Medium** - Post-release backlog
4. **Low** - Future enhancement

Within each priority, order by:

1. Type Safety (enables IDE assistance)
2. SolidJS Patterns (fixes reactivity)
3. Accessibility (user impact)
4. Performance (optimization)

### Phase 3: Apply Fixes

**For each fix category:**

1. Read current component code
2. Apply fix using pattern from `patterns/fix-patterns.md`
3. Run type check (`npm run type-check`)
4. If passes, commit with message from `templates/fix-commit-messages.md`
5. If fails, investigate and adjust

### Phase 4: Verify and Report

After all fixes:

1. Run full type check
2. Run tests if available
3. Re-run audit to verify score improved
4. Update audit tracker

## Fix Categories

### 1. Type Safety Fixes

**Files needed:**

- `.claude/TYPESCRIPT_PATTERNS.md`
- `skills/solidjs-component-fixer/patterns/fix-patterns.md`

**Common fixes:**

```typescript
// Add props interface
interface ComponentProps {
  // props
}

// Type event handlers
onClick?: (event: MouseEvent) => void

// Add return type
function Component(props: Props): JSX.Element

// Replace any with specific types
data: DataType  // not: any
```

### 2. SolidJS Reactivity Fixes

**Files needed:**

- `.claude/SOLIDJS_BEST_PRACTICES.md`
- `skills/solidjs-component-fixer/patterns/fix-patterns.md`

**Common fixes:**

```typescript
// Fix props destructuring (CRITICAL)
function Component(props: Props) {  // not: { prop1, prop2 }

// Add splitProps
const [local, others] = splitProps(props, ['custom', 'props'])

// Add createMemo for defaults
const variant = createMemo(() => props.variant || 'default')

// Add cleanup to effects
createEffect(() => {
  // setup
  onCleanup(() => { /* cleanup */ })
})
```

### 3. Accessibility Fixes

**Files needed:**

- `.claude/ACCESSIBILITY_STANDARDS.md`
- `skills/solidjs-component-auditor/reference/accessibility-standards.md`

**Common fixes:**

```typescript
// Add aria-label to icon buttons
<button aria-label="Close">
  <XIcon aria-hidden="true" />
</button>

// Add keyboard support
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleAction()
  }
}}

// Add aria-expanded
<button aria-expanded={isOpen()}>
```

### 4. API Design Fixes

**Files needed:**

- `.claude/COMPONENT_CONVENTIONS.md`

**Common fixes:**

```typescript
// Spread rest props
const [local, others] = splitProps(props, ['custom'])
return <div {...others} />

// Use twMerge
class={twMerge(theme.base, props.class)}
```

## Commit Strategy

**One commit per fix category:**

```bash
# Fix 1: Type Safety
git add src/components/Button.tsx
git commit -m "fix(Button): add TypeScript types"

# Fix 2: SolidJS
git add src/components/Button.tsx
git commit -m "fix(Button): fix props reactivity"

# Fix 3: Accessibility
git add src/components/Button.tsx
git commit -m "fix(Button): add keyboard support"
```

**Use templates from:**
`skills/solidjs-component-fixer/templates/fix-commit-messages.md`

## Safety Checks

### Before Starting

```bash
# Ensure clean working directory
git status

# Create fix branch
git checkout -b fix/component-name

# Stash any uncommitted changes
git stash
```

### After Each Fix

```bash
# Type check
npm run type-check

# If tests exist
npm run test -- --filter=ComponentName
```

### If Fix Breaks Something

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Or discard changes entirely
git checkout -- src/components/ComponentName.tsx
```

## Example Interaction

**User:** "Fix the Modal component"

**Claude:** "Let me fix the Modal component. First, I'll check for an audit report..."

[Reads `.claude/audits/Modal-2024-01-15.md`]

**Claude:** "Found audit report with 5 issues:

- 2 Critical: Props destructuring, missing focus trap
- 2 High: Missing aria-modal, no ESC key handler
- 1 Medium: Could use createMemo

I'll fix them in order. Starting with critical issues...

**Fix 1/5: Type Safety**

- Adding explicit props interface
- Typing event handlers

[Shows diff]

✓ Types added
✓ Type check passes
✓ Committed: `fix(Modal): add TypeScript types`

**Fix 2/5: Props Destructuring (CRITICAL)**

- Changing from destructured to props object

[Shows diff]

✓ Reactivity fixed
✓ Type check passes
✓ Committed: `fix(Modal): fix props reactivity`

...continuing with remaining fixes..."

## Files in This Skill

```
skills/solidjs-component-fixer/
├── SKILL.md                           # This file
├── patterns/
│   └── fix-patterns.md                # Copy-paste fix patterns
├── templates/
│   └── fix-commit-messages.md         # Commit message templates
└── reference/                         # (uses auditor references)
```

## Integration with Auditor

**After fixing, re-audit:**

```
User: "Audit Button again"
```

Expected result:

- Score should improve
- Fixed issues no longer appear
- May reveal new issues

## Configuration

In `.claude/config.json`:

```json
{
  "skills": {
    "solidjs-component-fixer": {
      "autoCommit": true,
      "createBranch": true,
      "runTests": true,
      "fixPriority": ["critical", "high", "medium", "low"]
    }
  }
}
```

## Notes

- Always read audit report first (if exists)
- Fix critical issues before high priority
- One commit per fix category
- Type check after each fix
- Create branch for fixes
- Document breaking changes in commits
