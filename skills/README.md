# Skills for @exowpee/the_rock

This directory contains Claude skills for component library development.

## Available Skills

### Core Development Skills

| Skill | Purpose | Trigger |
|-------|---------|---------|
| `solidjs-component-auditor` | Audit components for quality issues | "audit [component]" |
| `solidjs-component-fixer` | Fix issues found in audits | "fix [component]" |
| `solidjs-doc-generator` | Generate MDX documentation | "document [component]" |

### Project Skills

| Skill | Purpose | Trigger |
|-------|---------|---------|
| `landing-page-creator` | Create marketing landing page | "create landing page" |
| `mcp-server-builder` | Build MCP server for AI tools | "create MCP server" |

### Workflow Skills

| Skill | Purpose | Trigger |
|-------|---------|---------|
| `commit-and-push` | Smart commit with changelog update | "commit", "/commit" |

## Skill Directory Structure

Each skill follows this structure:

```
skill-name/
├── SKILL.md              # Main skill definition
├── reference/            # Reference documentation
│   └── *.md
├── templates/            # Output templates
│   └── *.md
├── checklists/           # Quick checklists
│   └── *.md
├── patterns/             # Code patterns
│   └── *.md
└── examples/             # Example outputs
    └── *.*
```

## Workflow

### 1. Initialize Project

Run the init-project command to set up Claude context:

```
User: "/project:init-project"
```

This creates:
- `.claude/PROJECT_CONTEXT.md`
- `.claude/SOLIDJS_BEST_PRACTICES.md`
- `.claude/TYPESCRIPT_PATTERNS.md`
- `.claude/ACCESSIBILITY_STANDARDS.md`
- `.claude/COMPONENT_CONVENTIONS.md`
- `.claude/ANTI_PATTERNS.md`
- `.claude/audits/MASTER_TRACKER.md`

### 2. Audit Components

```
User: "Audit the Button component"
```

Claude will:
1. Read the component source
2. Analyze across 6 dimensions
3. Generate report at `.claude/audits/Button-YYYY-MM-DD.md`
4. Update MASTER_TRACKER.md

### 3. Fix Issues

```
User: "Fix the Button component"
```

Claude will:
1. Read the audit report
2. Apply fixes in priority order
3. Create atomic commits
4. Re-verify with type check

### 4. Document Components

```
User: "Document the Button component"
```

Claude will:
1. Analyze the component
2. Generate MDX documentation
3. Save to `docs/components/Button.mdx`

## Configuration

Skills can be configured in `.claude/config.json`:

```json
{
  "skills": {
    "solidjs-component-auditor": {
      "strictness": "high",
      "outputDir": ".claude/audits"
    },
    "solidjs-component-fixer": {
      "autoCommit": true,
      "createBranch": true
    },
    "solidjs-doc-generator": {
      "outputDir": "docs/components",
      "includeExamples": 7
    }
  }
}
```

## Integration

Skills work together:

```
Audit → Fix → Re-Audit → Document
```

1. **Audit** identifies issues
2. **Fix** applies corrections
3. **Re-Audit** verifies improvements
4. **Document** creates user-facing docs

## Adding New Skills

1. Create directory under `skills/`
2. Add `SKILL.md` with:
   - Frontmatter (name, version, description)
   - Activation triggers
   - Process steps
   - Example interaction
3. Add supporting files:
   - `reference/` for reference docs
   - `templates/` for output templates
   - `examples/` for example outputs

## Skill File Format

```markdown
---
name: skill-name
version: 1.0.0
description: What the skill does
author: @exowpee/the_rock
tags: [tag1, tag2]
---

# Skill Name

[Description]

## Activation Triggers

[When this skill runs]

## Process

[Step by step]

## Example Interaction

[Example dialogue]
```
