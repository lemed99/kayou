# Claude Code Setup Guide for Your SolidJS Library

Complete guide to set up and use Claude Code with skills for maximum productivity.

## Prerequisites

- Node.js 18+ installed
- Claude Code CLI installed
- Your SolidJS library project
- GitHub access token (for MCP integration)

## Installation

### 1. Install Claude Code

```bash
# macOS/Linux
curl -fsSL https://claude.ai/install.sh | bash

# Or via npm
npm install -g @anthropic-ai/claude-code
```

### 2. Authenticate

```bash
claude setup
```

Enter your Anthropic API key when prompted.

### 3. Clone Skills to Your Project

```bash
cd your-solidjs-library

# Create skills directory
mkdir -p skills

# Copy all skill folders to skills/
# (The 5 skills we created above)
```

### 4. Create Configuration Files

Create `.claude/config.json`:

```json
{
  "model": "claude-opus-4-5-20251101",
  "effort": "medium",
  "project": {
    "name": "your-library-name",
    "type": "library",
    "framework": "solidjs"
  }
}
```

Create `.mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}/src"]
    }
  }
}
```

### 5. Add NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "claude:init": "claude /project:init-project",
    "claude:audit": "claude /project:audit-component",
    "claude:docs": "claude /project:document-component",
    "claude:fix": "claude /project:fix-component"
  }
}
```

## Initial Setup (One-Time)

### Step 1: Initialize Project Context

```bash
npm run claude:init
```

This creates:

- `.claude/PROJECT_CONTEXT.md` - Master knowledge base
- `.claude/SOLIDJS_BEST_PRACTICES.md` - Reference patterns
- `.claude/audits/` - Audit reports directory
- Component inventory and roadmap

**Time:** ~10-15 minutes
**Effort:** High (one-time investment)

### Step 2: Verify Setup

Check that these files exist:

```bash
ls .claude/
# Should show:
# - config.json
# - PROJECT_CONTEXT.md
# - SOLIDJS_BEST_PRACTICES.md
# - commands/
# - audits/
```

## Daily Workflow

### Morning: Health Check

```bash
npm run claude:check
```

Reviews:

- TypeScript compilation
- Lint status
- Test results
- Recent changes

**Time:** ~2 minutes

### Working on a Component

#### 1. Audit the Component

```bash
claude
```

Then in Claude Code:

```
Audit the Button component
```

Claude will:

- ✅ Check type safety
- ✅ Verify SolidJS patterns
- ✅ Test accessibility
- ✅ Review performance
- ✅ Generate detailed report

**Time:** ~3-5 minutes per component

#### 2. Fix Issues

```
Fix the Button component
```

Claude will:

- ✅ Apply fixes incrementally
- ✅ Run tests after each fix
- ✅ Create git commits
- ✅ Update documentation

**Time:** ~10-30 minutes depending on issues

#### 3. Generate Documentation

```
Document the Button component
```

Claude will:

- ✅ Extract props from TypeScript
- ✅ Generate 7+ examples
- ✅ Write accessibility guide
- ✅ Create full MDX file

**Time:** ~5-10 minutes per component

### End of Day: Commit & Review

```bash
# Review Claude's commits
git log

# Push changes
git push
```

## Weekly Workflow

### Monday: Weekly Audit

```bash
npm run claude:report
```

Generates comprehensive weekly report with:

- Component health metrics
- Test coverage trends
- Documentation progress
- Top issues
- Goals for the week

**Time:** ~10 minutes

### Friday: Progress Review

Review `.claude/reports/weekly-[date].md` and plan next week.

## Common Tasks

### Add a New Component

```bash
claude
```

```
I'm adding a new Tooltip component. Can you:
1. Create the component file with proper TypeScript types
2. Add accessibility features (ARIA, keyboard support)
3. Create tests
4. Generate documentation
5. Add to component index
```

**Time:** ~30-45 minutes (vs 2-3 hours manually)

### Refactor Existing Component

```
Refactor the Modal component to:
- Use our new theming system
- Improve accessibility
- Add animation support
- Update tests and docs
```

### Batch Operations

```
Audit all components in the Forms category
```

```
Generate documentation for all undocumented components
```

```
Fix TypeScript issues across all components
```

## Productivity Metrics

### Without Claude Code

- Audit 1 component: ~30-60 min
- Fix issues: ~1-3 hours
- Write docs: ~45-90 min
- **Total per component: ~3-5 hours**

### With Claude Code + Skills

- Audit 1 component: ~5 min
- Fix issues: ~15-30 min
- Write docs: ~10 min
- **Total per component: ~30-45 min**

**6-10x productivity increase!**

## Tips & Best Practices

### 1. Start Fresh Conversations for New Features

Don't let conversations get too long. Start new for each component or feature.

### 2. Review Before Committing

Always review Claude's code changes before committing:

```bash
git diff
```

### 3. Use Specific Commands

Instead of: "Fix this"
Use: "Fix the props destructuring issue in Button component"

### 4. Leverage Context

Claude remembers your project context:

```
Following our component conventions, create a new Select component
```

### 5. Batch Similar Tasks

```
Audit all form components: Button, Input, Select, Checkbox, Radio
```

### 6. Ask for Explanations

```
Explain why destructuring props breaks reactivity in SolidJS
```

## Troubleshooting

### "Skill not found"

```bash
# Verify skills directory exists
ls skills/

# Check .claude/config.json has skills enabled
cat .claude/config.json
```

### "MCP server connection failed"

```bash
# Check .mcp.json is valid
cat .mcp.json

# Verify filesystem server
npx @modelcontextprotocol/server-filesystem --help
```

### "TypeScript errors in audit"

```bash
# Ensure your project compiles
npm run type-check

# Update TypeScript
npm install -D typescript@latest
```

### Skills seem slow

- Check your `effort` setting in `.claude/config.json`
- Use `effort: "medium"` for most tasks
- Use `effort: "high"` only for complex analysis

## Budget Management

With $200/month Opus 4.5 plan:

**Conservative estimate:**

- ~50-100 component audits
- ~30-50 complete fixes with docs
- ~100+ quick tasks (docs, small fixes)

**Pro tip:** Use `effort: "medium"` for 90% of tasks to stretch your budget.

## Advanced: Custom Commands

Create your own commands in `.claude/commands/`:

```markdown
# .claude/commands/my-workflow.md

Run my custom workflow:

1. Audit component
2. Fix critical issues
3. Generate docs
4. Create PR description
```

Use with:

```bash
claude /project:my-workflow Button
```

## Getting Help

### In Claude Code

```
Show me available skills
```

```
How do I use the component auditor skill?
```

### Documentation

- Skills documentation: `skills/*/SKILL.md`
- Reference docs: `.claude/*.md`
- Command docs: `.claude/commands/*.md`

## Next Steps

1. ✅ Run `npm run claude:init`
2. ✅ Audit your first component
3. ✅ Fix issues and generate docs
4. ✅ Create landing page
5. ✅ Build MCP server
6. ✅ Ship v1.0!

---

**Ready to become a 100x engineer? Let's go!** 🚀

```

---

## **📋 Final Checklist**

Here's everything you need to start:

### Files to Create:
```

your-solidjs-library/
├── .claude/
│ ├── config.json ✅ Created above
│ └── commands/
│ ├── init-project.md ✅ Created above
│ ├── daily-check.md ✅ Created above
│ └── weekly-audit.md ✅ Created above
│
├── skills/
│ ├── solidjs-component-auditor/ ✅ Complete
│ ├── solidjs-doc-generator/ ✅ Complete
│ ├── solidjs-component-fixer/ ✅ Complete
│ ├── landing-page-creator/ ✅ Complete
│ └── mcp-server-builder/ ✅ Complete
│
├── .mcp.json ✅ Created above
├── package.json ✅ Update with scripts
└── README-CLAUDE-SETUP.md ✅ Created above
