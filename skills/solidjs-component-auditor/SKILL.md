---
name: solidjs-component-auditor
version: 1.0.0
description: Comprehensive auditing system for SolidJS components. Checks type safety, reactivity patterns, accessibility, performance, and documentation. Automatically activates when user mentions auditing, reviewing, or checking components.
author: Your Library Team
tags: [solidjs, audit, typescript, accessibility, quality]
---

# SolidJS Component Auditor

Enterprise-grade component auditing for SolidJS UI libraries.

## Activation Triggers

This skill automatically activates when the user:

- Says "audit", "review", "check", or "analyze" followed by a component name
- Asks "what's wrong with [component]"
- Says "check the quality of [component]"
- Mentions "component health" or "component status"
- Uses phrases like "is [component] following best practices"

## Core Functionality

Performs comprehensive audits across 6 critical dimensions:

### 1. Type Safety (Weight: 25%)

- Validates TypeScript interfaces
- Checks for `any` types
- Verifies generic constraints
- Validates event handler types
- Checks ref types
- Ensures return type declarations

### 2. SolidJS Best Practices (Weight: 25%)

- Detects prop destructuring (critical anti-pattern)
- Validates signal usage
- Checks memo usage
- Verifies effect cleanup
- Detects React patterns
- Validates event handlers

### 3. Component API Design (Weight: 15%)

- Checks naming conventions
- Validates prop consistency
- Verifies class/classList support
- Checks rest prop spreading
- Validates required vs optional props

### 4. Accessibility (Weight: 20%)

- Validates ARIA attributes
- Checks keyboard navigation
- Verifies focus management
- Validates screen reader support
- Checks color contrast
- Verifies reduced-motion support

### 5. Performance (Weight: 10%)

- Detects unnecessary reactivity
- Checks memoization usage
- Identifies memory leaks
- Validates lazy loading

### 6. Testing & Documentation (Weight: 5%)

- Checks test existence
- Validates test coverage
- Checks documentation existence
- Validates examples

## Audit Process

### Phase 1: Component Discovery

1. Locate the component file
2. Read the TypeScript source
3. Identify all props, state, and effects
4. Map component dependencies

### Phase 2: Static Analysis

1. Check for type safety
2. Parse component AST
3. Extract prop interfaces
4. Identify patterns and anti-patterns

### Phase 3: Accessibility Check

1. Check for accessibility
2. Check ARIA usage
3. Validate keyboard support
4. Check semantic HTML

### Phase 4: Dependency Analysis

1. Analyze reactivity graph
2. Identify unnecessary dependencies
3. Check for circular dependencies
4. Validate cleanup patterns

### Phase 5: Report Generation

1. Calculate scores for each dimension
2. Identify all issues with severity
3. Generate actionable recommendations
4. Create detailed audit report
5. Update master tracker

## Output Format

Generate audit report at: `.claude/audits/[ComponentName]-[YYYY-MM-DD].md`

````markdown
# [ComponentName] Audit Report

Generated: [Timestamp]
Auditor: Claude (solidjs-component-auditor v1.0.0)

## Executive Summary

[2-3 sentence overview of component health]

## Overall Score: [X/100]

### Dimension Scores

- ⚡ Type Safety: [X/25]
- 🎯 SolidJS Practices: [X/25]
- 🎨 API Design: [X/15]
- ♿ Accessibility: [X/20]
- 🚀 Performance: [X/10]
- 📚 Testing/Docs: [X/5]

## Critical Issues 🚨 (Block Release)

[Issues that MUST be fixed before any release]

### Issue 1: [Title]

**Severity:** Critical
**File:** `src/components/[Component].tsx`
**Line:** [number]
**Category:** [Type Safety | SolidJS | A11y | Performance]

**Problem:**

```typescript
// Current implementation (BROKEN)
[problematic code]
```

**Why this is critical:**
[Explanation of the impact]

**Solution:**

```typescript
// Fixed implementation
[corrected code]
```

**Implementation steps:**

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Estimated effort:** [X hours]
**Related issues:** [List if any]

---

## High Priority Issues ⚠️ (Fix Before v1.0)

[Similar format for each issue]

## Medium Priority Issues 📝 (Post v1.0)

[Similar format for each issue]

## Low Priority Enhancements 💡 (Future)

[Similar format for each issue]

## Positive Findings ✅

[Things the component does well]

## Related Components to Check

[Components that might have similar issues]

## Next Steps

1. [Immediate action]
2. [Short-term action]
3. [Long-term consideration]

## References Used

- TypeScript Patterns: `.claude/TYPESCRIPT_PATTERNS.md`
- SolidJS Patterns: `.claude/SOLIDJS_BEST_PRACTICES.md`
- Accessibility Standards: `.claude/ACCESSIBILITY_STANDARDS.md`
- API Conventions: `.claude/COMPONENT_CONVENTIONS.md`
- Common mistakes: `.claude/ANTI_PATTERNS.md`
````

Also update: `.claude/audits/MASTER_TRACKER.md` with summary

## Configuration

Set audit strictness in `.claude/config.json`:

```json
{
  "skills": {
    "solidjs-component-auditor": {
      "strictness": "high",
      "autoFix": false,
      "failOnCritical": true,
      "weights": {
        "typeSafety": 25,
        "solidjsPractices": 25,
        "apiDesign": 15,
        "accessibility": 20,
        "performance": 10,
        "testingDocs": 5
      }
    }
  }
}
```

## Reference Files (Load on Demand)

These files provide detailed guidance and are loaded only when needed:

- **`.claude/TYPESCRIPT_PATTERNS.md`** - TypeScript best practices
- **`.claude/SOLIDJS_BEST_PRACTICES.md`** - Official SolidJS patterns
- **`.claude/ACCESSIBILITY_STANDARDS.md`** - WCAG and ARIA guidelines
- **`.claude/COMPONENT_CONVENTIONS.md`** - Library-specific conventions
- **`.claude/ANTI_PATTERNS.md`** - Common mistakes to avoid

## Example Usage

**User:** "Audit the Button component"

**Claude:** "I'll run a comprehensive audit of the Button component. This will take a moment..."

[Runs audit]

**Claude:** "Audit complete! The Button component scored 72/100. I found 2 critical issues, 3 high priority issues, and 5 medium priority issues. The main concerns are:

1. **Critical:** Props are destructured, breaking reactivity
2. **Critical:** Missing keyboard focus indicators
3. **High:** No TypeScript types for onClick handler

Would you like me to:
a) Show you the full audit report
b) Fix the critical issues immediately
c) Explain each issue in detail"
