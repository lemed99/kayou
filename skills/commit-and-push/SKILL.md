---
name: commit-and-push
version: 1.0.0
description: Smart commit and push workflow that generates concise commit messages, updates CHANGELOG.md, and pushes to remote.
author: @exowpee/the_rock
tags: [git, commit, push, changelog, workflow]
---

# Commit and Push

Automated commit workflow that creates meaningful commits and maintains a changelog.

## Activation Triggers

This skill activates when the user:

- Says "commit" or "commit and push"
- Says "push my changes"
- Uses `/commit` command
- Says "save my work"

## Quick Start

```
User: "commit and push"

Claude:
1. Analyzes all staged and unstaged changes
2. Groups changes by type (feat, fix, refactor, etc.)
3. Generates concise commit message
4. Updates CHANGELOG.md (creates if missing)
5. Commits changes
6. Pushes to remote
```

## Process

### Phase 1: Analyze Changes

**Gather information:**

```bash
# Check current branch
git branch --show-current

# Get all changes (staged + unstaged)
git status

# Get detailed diff
git diff
git diff --staged

# Get recent commits for style reference
git log --oneline -10
```

**Categorize changes by:**

- New files added
- Files modified
- Files deleted
- Type of change (feature, fix, refactor, docs, style, test, chore)

### Phase 2: Generate Commit Message

**Format: Conventional Commits**

```
<type>(<scope>): <short description>

<body - list of changes>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation only
- `style` - Formatting, no code change
- `test` - Adding tests
- `chore` - Maintenance tasks

**Rules for commit messages:**

1. Subject line max 72 characters
2. Use imperative mood ("add" not "added")
3. List all significant changes in body
4. Group related changes together
5. Be concise but complete

### Phase 3: Update Changelog

**Location:** `CHANGELOG.md` in project root

**Format: Keep a Changelog**

```markdown
# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- New feature X

### Changed

- Modified behavior Y

### Fixed

- Bug fix Z

### Removed

- Deprecated feature W
```

**Categories:**

- `Added` - New features
- `Changed` - Changes to existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security fixes

**If CHANGELOG.md doesn't exist:**

1. Create it with proper header
2. Add current changes under [Unreleased]

### Phase 4: Commit

```bash
# Stage all changes including CHANGELOG.md
git add -A

# Commit with generated message
git commit -m "<message>"
```

### Phase 5: Push

```bash
# Push to current branch
git push

# If upstream not set
git push -u origin <branch>
```

## Commit Message Examples

### Single Feature

```
feat(Button): add loading state

- Added `loading` prop with spinner indicator
- Added `disabled` state while loading
- Updated types for LoadingButton variant

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Multiple Changes

```
feat(components): add Modal and Tooltip components

- Added Modal component with focus trap
- Added Tooltip component with positioning
- Added shared Portal utility
- Updated component exports

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Bug Fixes

```
fix(Accordion): resolve keyboard navigation issues

- Fixed Enter key not toggling panels
- Fixed focus not moving to content on open
- Added aria-expanded attribute

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Refactoring

```
refactor(theme): consolidate color tokens

- Merged duplicate color definitions
- Renamed tokens for consistency
- Updated all component references

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Mixed Changes

```
feat(Input): add validation support with fixes

Added:
- Validation prop with error/success states
- Helper text display
- Icon indicators

Fixed:
- Focus ring not visible in dark mode
- Placeholder color contrast

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Example Interaction

**User:** "commit and push"

**Claude:** "Let me analyze your changes and create a commit..."

[Runs git status and git diff]

**Claude:** "Found the following changes:

**Modified files:**

- `src/components/Button.tsx` - Added loading state
- `src/components/Input.tsx` - Fixed validation styling

**New files:**

- `src/components/Modal.tsx` - New modal component

I'll create a commit with these changes and update the changelog.

**Commit message:**

```
feat(components): add Modal and improve Button/Input

Added:
- Modal component with focus trap and keyboard support
- Button loading state with spinner

Fixed:
- Input validation styling in dark mode

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**CHANGELOG.md updated:**

```markdown
## [Unreleased]

### Added

- Modal component with focus trap and keyboard support
- Button loading state with spinner

### Fixed

- Input validation styling in dark mode
```

Committing and pushing...

Done! Changes pushed to `main`."

## Configuration

In `.claude/config.json`:

```json
{
  "skills": {
    "commit-and-push": {
      "autoPush": true,
      "updateChangelog": true,
      "changelogPath": "CHANGELOG.md",
      "commitStyle": "conventional",
      "signOff": true
    }
  }
}
```

**Options:**

- `autoPush` - Automatically push after commit (default: true)
- `updateChangelog` - Update CHANGELOG.md (default: true)
- `changelogPath` - Path to changelog file (default: "CHANGELOG.md")
- `commitStyle` - Commit message style: "conventional" | "simple"
- `signOff` - Add Co-Authored-By line (default: true)

## Safety Checks

### Before Committing

1. Verify on correct branch
2. Check for uncommitted changes
3. Ensure no merge conflicts
4. Confirm remote is accessible

### Edge Cases

**No changes to commit:**

```
"No changes detected. Working directory is clean."
```

**Untracked files only:**

```
"Found new files. Should I include them in the commit? [Y/n]"
```

**Large number of changes:**

```
"Found 50+ changed files. Would you like to:
1. Commit all together
2. Review files first
3. Commit in batches"
```

## Files in This Skill

```
skills/commit-and-push/
├── SKILL.md                      # This file
├── reference/
│   └── commit-conventions.md     # Conventional commit reference
└── templates/
    └── changelog-entry.md        # Changelog entry template
```

## Notes

- Always review generated commit message before confirming
- Changelog entries are added to [Unreleased] section
- Use `git push -u` for new branches
- Co-Author line credits AI assistance
