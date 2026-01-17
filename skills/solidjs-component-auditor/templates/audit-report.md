# [ComponentName] Audit Report

**Generated:** [YYYY-MM-DD HH:MM]
**Auditor:** Claude (solidjs-component-auditor v1.0.0)
**Component:** `src/components/[ComponentName].tsx`

---

## Executive Summary

[2-3 sentence overview of component health, main concerns, and immediate actions needed]

---

## Overall Score: [X]/100

### Dimension Breakdown

| Dimension         | Score  | Weight | Weighted |
| ----------------- | ------ | ------ | -------- |
| Type Safety       | [X]/25 | 25%    | [X]      |
| SolidJS Practices | [X]/25 | 25%    | [X]      |
| API Design        | [X]/15 | 15%    | [X]      |
| Accessibility     | [X]/20 | 20%    | [X]      |
| Performance       | [X]/10 | 10%    | [X]      |
| Testing/Docs      | [X]/5  | 5%     | [X]      |

### Score Interpretation

- 90-100: Excellent - Production ready
- 80-89: Good - Minor improvements needed
- 70-79: Acceptable - Several issues to address
- 60-69: Needs Work - Significant issues
- Below 60: Poor - Major refactoring required

---

## Critical Issues (Must Fix Before Release)

### Issue 1: [Title]

**Severity:** Critical
**Category:** [Type Safety | SolidJS | Accessibility | Performance]
**Line(s):** [X-Y]

**Current Code:**

```typescript
// Line X
[problematic code snippet]
```

**Problem:**
[Detailed explanation of why this is critical and its impact]

**Solution:**

```typescript
// Fixed code
[corrected code snippet]
```

**Implementation Steps:**

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Estimated Effort:** [X minutes/hours]

---

### Issue 2: [Title]

[Same format as above]

---

## High Priority Issues (Fix Before v1.0)

### Issue 3: [Title]

**Severity:** High
**Category:** [Category]
**Line(s):** [X-Y]

**Current Code:**

```typescript
[code];
```

**Problem:**
[Explanation]

**Solution:**

```typescript
[fixed code]
```

---

## Medium Priority Issues (Post-Release Backlog)

### Issue 4: [Title]

**Severity:** Medium
**Category:** [Category]
**Description:** [Brief description of issue and suggested improvement]

---

## Low Priority Enhancements

- [ ] [Enhancement 1]
- [ ] [Enhancement 2]
- [ ] [Enhancement 3]

---

## Positive Findings

Things this component does well:

- [Positive finding 1]
- [Positive finding 2]
- [Positive finding 3]

---

## Related Components

Components that may have similar issues or patterns:

| Component    | Likely Issues | Priority      |
| ------------ | ------------- | ------------- |
| [ComponentA] | [Issue type]  | [High/Medium] |
| [ComponentB] | [Issue type]  | [High/Medium] |

---

## Fix Priority Order

Recommended order for addressing issues:

1. **[Issue Title]** - [Brief reason why first]
2. **[Issue Title]** - [Depends on #1 or quick win]
3. **[Issue Title]** - [Reason]

---

## Test Plan

After fixes, verify:

- [ ] Component renders correctly
- [ ] All props work as expected
- [ ] Keyboard navigation functions
- [ ] Screen reader announces correctly
- [ ] No TypeScript errors
- [ ] No console warnings

---

## References Used

- `.claude/TYPESCRIPT_PATTERNS.md` - TypeScript conventions
- `.claude/SOLIDJS_BEST_PRACTICES.md` - SolidJS patterns
- `.claude/ACCESSIBILITY_STANDARDS.md` - WCAG guidelines
- `.claude/COMPONENT_CONVENTIONS.md` - Library conventions
- `.claude/ANTI_PATTERNS.md` - Common mistakes

---

## Audit Metadata

```yaml
component: [ComponentName]
file: src/components/[ComponentName].tsx
lines: [total lines]
props_count: [number]
has_tests: [true/false]
has_docs: [true/false]
dependencies: [list]
```
