# @kayou/mcp

MCP (Model Context Protocol) server for the kayou component library. Provides AI-assisted access to component APIs, hooks, and icons.

## Features

- **Component lookup**: Get detailed props, types, and usage examples for all UI components
- **Hook documentation**: Access parameter signatures, return types, and examples for all hooks
- **Icon search**: Search through 1,100+ icons by name or keyword
- **Always up-to-date**: Data is generated from your documentation files

## Installation

```bash
pnpm add @kayou/mcp
```

Or install globally:

```bash
pnpm add -g @kayou/mcp
```

## Usage with Claude Code

Add to your Claude Code MCP configuration (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kayou": {
      "command": "node",
      "args": ["/path/to/solid-components/packages/mcp/dist/index.js"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "kayou": {
      "command": "kayou-mcp"
    }
  }
}
```

## Available Tools

### `list_components`

List all available kayou UI components.

```
Arguments:
- search (optional): Filter by name or description
```

### `get_component`

Get detailed information about a specific component.

```
Arguments:
- name (required): Component name (e.g., "Button", "Select", "DataTable")
```

Returns:
- Props with types and defaults
- Usage examples
- Import statement
- Key concepts
- Dependencies

### `list_hooks`

List all available kayou hooks.

```
Arguments:
- search (optional): Filter by name or description
```

### `get_hook`

Get detailed information about a specific hook.

```
Arguments:
- name (required): Hook name (e.g., "useMutation", "useFloating")
```

Returns:
- Parameters with types
- Return values
- Usage examples
- Import statement

### `search_icons`

Search for icons by name or keyword.

```
Arguments:
- query (required): Search term (e.g., "arrow", "check", "user")
- limit (optional): Max results (default: 20)
```

### `get_component_props`

Get only the props for a component (lighter response).

```
Arguments:
- name (required): Component name
```

### `get_usage_example`

Get usage examples for a component or hook.

```
Arguments:
- name (required): Component or hook name
- type (optional): "component" or "hook"
```

## Regenerating Data

If you update the documentation, regenerate the MCP data:

```bash
cd packages/mcp
pnpm run generate
pnpm run build
```

## Development

```bash
# Install dependencies
pnpm install

# Generate data from docs
pnpm run generate

# Build TypeScript
pnpm run build

# Run in development mode
pnpm run dev
```

## How It Works

1. The `generate` script parses documentation files from `doc/src/pages/`
2. It extracts props, parameters, examples, and usage from DocPage/HookDocPage components
3. It reads the icons index to build the icon catalog
4. Everything is saved to `data/kayou-data.json`
5. The MCP server reads this JSON and exposes it via MCP tools

## Example Conversations

**You:** "I need to create a form with a date picker"

**Claude:** *uses `get_component` for DatePicker*

```
The DatePicker component from @kayou/ui supports:
- Single date, date range, or multiple dates selection
- Time selection (hour, minute, second)
- Date shortcuts for quick selection
- Controlled and uncontrolled modes

Import: import { DatePicker } from '@kayou/ui';

Props:
- mode: "single" | "range" | "multiple"
- value: DateValue object
- onChange: callback for value changes
...
```

**You:** "Show me icons for navigation"

**Claude:** *uses `search_icons` with query "arrow"*

```
Found 45 matching icons:
- ArrowLeftIcon: import { ArrowLeftIcon } from '@kayou/icons';
- ArrowRightIcon: import { ArrowRightIcon } from '@kayou/icons';
- ChevronDownIcon: import { ChevronDownIcon } from '@kayou/icons';
...
```

## License

MIT
