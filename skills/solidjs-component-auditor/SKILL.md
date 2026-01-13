---
name: solidjs-component-auditor
version: 2.0.0
description: Comprehensive auditing system for SolidJS components. Performs deep analysis of type safety, reactivity patterns, accessibility, and performance. Generates actionable reports with prioritized fixes.
author: @exowpee/the_rock
tags: [solidjs, audit, typescript, accessibility, quality]
---

# SolidJS Component Auditor

Enterprise-grade component auditing for SolidJS UI libraries.

## Activation Triggers

This skill activates when the user:

- Says "audit", "review", "check", or "analyze" followed by a component name
- Asks "what's wrong with [component]"
- Says "check the quality of [component]"
- Mentions "component health" or "component status"

## Quick Start

```
User: "Audit the Button component"

Claude:
1. Reads src/components/Button.tsx
2. Loads reference files from .claude/
3. Performs 6-dimension analysis
4. Generates report at .claude/audits/Button-YYYY-MM-DD.md
5. Updates .claude/audits/MASTER_TRACKER.md
```

## Audit Process

### Phase 1: Load Context

**Required Files (Load First):**
```
.claude/PROJECT_CONTEXT.md          # Project overview
.claude/COMPONENT_CONVENTIONS.md    # Library patterns
```

**Reference Files (Load as Needed):**
```
.claude/SOLIDJS_BEST_PRACTICES.md   # For SolidJS checks
.claude/TYPESCRIPT_PATTERNS.md      # For type checks
.claude/ACCESSIBILITY_STANDARDS.md  # For a11y checks
.claude/ANTI_PATTERNS.md            # For pattern detection
```

**Skill References:**
```
skills/solidjs-component-auditor/reference/audit-criteria.md
skills/solidjs-component-auditor/reference/accessibility-standards.md
skills/solidjs-component-auditor/checklists/quick-audit.md
```

### Phase 2: Read Component

1. Read the component source file
2. Extract:
   - Props interface
   - Signal/store usage
   - Effects and their cleanup
   - Event handlers
   - ARIA attributes
   - Class composition

### Phase 3: Analyze Each Dimension

#### 1. Type Safety (25 points)

Check for:
- [ ] Explicit props interface exists
- [ ] No `any` types
- [ ] Event handlers fully typed
- [ ] Return type declared
- [ ] Refs properly typed
- [ ] Generics where appropriate

**Detection Patterns:**
```typescript
// BAD: any type
props: any
onChange?: any
data: any[]

// BAD: Missing return type
function Component(props: Props) {

// GOOD: Full types
function Component(props: Props): JSX.Element {
```

#### 2. SolidJS Practices (25 points)

Check for:
- [ ] **No props destructuring** (Critical!)
- [ ] Signals called with `()` in JSX
- [ ] `createMemo` for computed values
- [ ] `splitProps` for prop separation
- [ ] `onCleanup` in effects with subscriptions
- [ ] No React patterns

**Detection Patterns:**
```typescript
// CRITICAL: Props destructuring
function Component({ name, value }) // BAD
function Component(props: Props)   // GOOD

// Missing signal call
const val = count; return <div>{val}</div>  // BAD
return <div>{count()}</div>                  // GOOD

// Effect without cleanup
createEffect(() => {
  window.addEventListener('resize', handler);
  // Missing onCleanup!
});
```

#### 3. API Design (15 points)

Check for:
- [ ] Uses `splitProps`
- [ ] Spreads rest props
- [ ] Supports `class` via twMerge
- [ ] Consistent naming (isX, onY)
- [ ] Sensible defaults

#### 4. Accessibility (20 points)

Check for:
- [ ] Interactive elements keyboard accessible
- [ ] Icon buttons have `aria-label`
- [ ] Form inputs have labels
- [ ] Modal has focus trap
- [ ] Expandable has `aria-expanded`
- [ ] Live regions for dynamic content

**Reference:** `skills/solidjs-component-auditor/reference/accessibility-standards.md`

#### 5. Performance (10 points)

Check for:
- [ ] `createMemo` for expensive operations
- [ ] No memory leaks (cleanup present)
- [ ] Virtualization for large lists
- [ ] No inline object/function in JSX

#### 6. Testing & Documentation (5 points)

Check for:
- [ ] Test file exists at `src/components/__tests__/[ComponentName].test.tsx`
- [ ] JSDoc comments on props
- [ ] Documentation page exists at `doc/src/pages/components/[component].tsx`

### Phase 4: Generate Report

**Output Location:** `.claude/audits/[ComponentName]-[YYYY-MM-DD].md`

**Template:** `skills/solidjs-component-auditor/templates/audit-report.md`

**Report Structure:**
1. Executive Summary (2-3 sentences)
2. Overall Score with breakdown
3. Critical Issues (must fix)
4. High Priority Issues
5. Medium Priority Issues
6. Low Priority Enhancements
7. Positive Findings
8. Fix Priority Order
9. Test Plan

### Phase 5: Update Tracker

Update `.claude/audits/MASTER_TRACKER.md`:

```markdown
| Component | Last Audit | Score | Critical | High | Medium | Low | Status |
|-----------|------------|-------|----------|------|--------|-----|--------|
| Button    | 2024-01-15 | 72    | 2        | 3    | 5      | 2   | Needs work |
```

## Scoring Guide

| Score | Rating | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | Production ready, minimal changes |
| 80-89 | Good | Minor improvements, ship with backlog |
| 70-79 | Acceptable | Address high priority before release |
| 60-69 | Needs Work | Significant issues, plan fixes |
| <60 | Poor | Major refactor before use |

## Issue Severity

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | Breaks functionality or major a11y | Props destructuring, no keyboard access |
| **High** | Significant problems | Missing types, no aria-label |
| **Medium** | Code quality issues | Could use memo, missing JSDoc |
| **Low** | Nice to have | Better naming, more examples |

## Example Output

```
# Button Audit Report

Generated: 2024-01-15 14:30
Overall Score: 72/100

## Executive Summary

The Button component has solid TypeScript types but critical reactivity
issues due to props destructuring. Accessibility is incomplete - missing
keyboard support for custom variants. Recommend immediate fix of
reactivity before any production use.

## Critical Issues

### Issue 1: Props Destructured

**Line:** 15
**Problem:** `function Button({ variant, size, onClick }) {`
**Impact:** Component will not update when props change
**Fix:** Use `props: ButtonProps` and access as `props.variant`
```

## Configuration

In `.claude/config.json`:

```json
{
  "skills": {
    "solidjs-component-auditor": {
      "strictness": "high",
      "weights": {
        "typeSafety": 25,
        "solidjsPractices": 25,
        "apiDesign": 15,
        "accessibility": 20,
        "performance": 10,
        "testingDocs": 5
      },
      "outputDir": ".claude/audits",
      "updateTracker": true
    }
  }
}
```

## Files in This Skill

```
skills/solidjs-component-auditor/
├── SKILL.md                           # This file
├── reference/
│   ├── audit-criteria.md              # Detailed scoring criteria
│   └── accessibility-standards.md     # A11y patterns by component
├── checklists/
│   └── quick-audit.md                 # Rapid assessment checklist
└── templates/
    └── audit-report.md                # Report template
```

## Integration with Fixer

After audit, user can say:

```
"Fix the Button component"
```

This triggers `solidjs-component-fixer` which:
1. Reads the audit report
2. Applies fixes in priority order
3. Creates atomic commits
4. Re-runs audit to verify

## Notes

- Always load PROJECT_CONTEXT.md first for library conventions
- Critical issues should block release
- Update MASTER_TRACKER after every audit
- Link related components that may have similar issues
