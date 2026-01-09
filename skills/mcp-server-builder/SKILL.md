---
name: mcp-server-builder
version: 1.0.0
description: Creates Model Context Protocol (MCP) servers that teach Claude about your specific UI library. Enables AI-powered development tools and enhanced context awareness.
author: Your Library Team
tags: [mcp, ai-tools, context-protocol, developer-tools]
---

# MCP Server Builder

Build MCP servers that integrate your library with AI tools.

## Activation Triggers

This skill activates when the user:

- Says "create MCP server", "build MCP integration"
- Asks "how do I make Claude understand my library"
- Mentions "Model Context Protocol" or "context server"
- Says "create AI tools for the library"

## What is an MCP Server?

An MCP (Model Context Protocol) server allows AI assistants like Claude to:

- Understand your component library structure
- Access component documentation
- Generate valid usage code
- Validate prop combinations
- Search and discover components

## Server Capabilities

### Tools (Actions Claude Can Perform)

1. **list_components** - List all available components
2. **get_component** - Get detailed component information
3. **generate_example** - Create usage code
4. **validate_props** - Check if props are valid
5. **search_components** - Search by feature/keyword

### Resources (Data Claude Can Access)

1. **library://components** - Component catalog
2. **library://components/{name}** - Specific component data
3. **library://examples/{name}** - Usage examples
4. **library://docs/{path}** - Documentation

## Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Main server
│   ├── tools/
│   │   ├── list-components.ts
│   │   ├── get-component.ts
│   │   ├── generate-example.ts
│   │   ├── validate-props.ts
│   │   └── search-components.ts
│   ├── resources/
│   │   ├── components.ts
│   │   ├── examples.ts
│   │   └── documentation.ts
│   ├── utils/
│   │   ├── ts-parser.ts     # Parse TypeScript for types
│   │   ├── doc-parser.ts    # Parse MDX docs
│   │   └── validator.ts     # Validate props
│   └── types/
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Implementation

### Main Server (`src/index.ts`)

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getComponentResource } from './resources/components.js';
import { getExampleResource } from './resources/examples.js';
import { generateExample } from './tools/generate-example.js';
import { getComponent } from './tools/get-component.js';
import { listComponents } from './tools/list-components.js';
import { searchComponents } from './tools/search-components.js';
import { validateProps } from './tools/validate-props.js';

const server = new Server(
  {
    name: 'your-library-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description: 'List all components in the library',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by category (Forms, Layout, etc.)',
            },
            search: {
              type: 'string',
              description: 'Search by name or description',
            },
          },
        },
      },
      {
        name: 'get_component',
        description: 'Get detailed information about a component',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Component name',
            },
            include_examples: {
              type: 'boolean',
              description: 'Include usage examples',
              default: true,
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'generate_example',
        description: 'Generate code example for using a component',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              description: 'Component name',
            },
            props: {
              type: 'object',
              description: 'Props to include in example',
            },
            context: {
              type: 'string',
              description: 'Usage context (form, dashboard, etc.)',
            },
          },
          required: ['component'],
        },
      },
      {
        name: 'validate_props',
        description: 'Validate component props',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              description: 'Component name',
            },
            props: {
              type: 'object',
              description: 'Props to validate',
            },
          },
          required: ['component', 'props'],
        },
      },
      {
        name: 'search_components',
        description: 'Search components by feature or keyword',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'list_components':
      return {
        content: [{ type: 'text', text: JSON.stringify(await listComponents(args)) }],
      };

    case 'get_component':
      return {
        content: [{ type: 'text', text: JSON.stringify(await getComponent(args)) }],
      };

    case 'generate_example':
      return { content: [{ type: 'text', text: await generateExample(args) }] };

    case 'validate_props':
      return {
        content: [{ type: 'text', text: JSON.stringify(await validateProps(args)) }],
      };

    case 'search_components':
      return {
        content: [{ type: 'text', text: JSON.stringify(await searchComponents(args)) }],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Register resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'library://components',
        name: 'Component Catalog',
        description: 'List of all components',
        mimeType: 'application/json',
      },
      {
        uri: 'library://components/{name}',
        name: 'Component Details',
        description: 'Detailed information about a component',
        mimeType: 'application/json',
      },
      {
        uri: 'library://examples/{name}',
        name: 'Component Examples',
        description: 'Usage examples for a component',
        mimeType: 'text/plain',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'library://components') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(await getComponentResource()),
        },
      ],
    };
  }

  const componentMatch = uri.match(/^library:\/\/components\/(.+)$/);
  if (componentMatch) {
    const name = componentMatch[1];
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(await getComponentResource(name)),
        },
      ],
    };
  }

  const exampleMatch = uri.match(/^library:\/\/examples\/(.+)$/);
  if (exampleMatch) {
    const name = exampleMatch[1];
    return {
      contents: [{ uri, mimeType: 'text/plain', text: await getExampleResource(name) }],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Your Library MCP Server running on stdio');
}

main().catch(console.error);
```

### Tool: List Components (`src/tools/list-components.ts`)

````typescript
import { readdir } from 'fs/promises'
import { join } from 'path'
import { parseComponent } from '../utils/ts-parser.js'

interface ListComponentsArgs {
  category?: string
  search?: string
}

export async function listComponents(args: ListComponentsArgs = {}) {
  const componentsDir = join(process.cwd(), '../src/components')
const files = await readdir(componentsDir)
const components = await Promise.all(
files
.filter(f => f.endsWith('.tsx'))
.map(async file => {
const componentData = await parseComponent(join(componentsDir, file))
return {
name: componentData.name,
category: componentData.category,
description: componentData.description,
props: componentData.props.map(p => p.name),
}
})
)
let filtered = components
if (args.category) {
filtered = filtered.filter(c => c.category === args.category)
}
if (args.search) {
const query = args.search.toLowerCase()
filtered = filtered.filter(c =>
c.name.toLowerCase().includes(query) ||
c.description?.toLowerCase().includes(query)
)
}
return {
total: filtered.length,
components: filtered,
}
}### Tool: Get Component (`src/tools/get-component.ts`)
```typescript
import { join } from 'path'
import { parseComponent } from '../utils/ts-parser.js'
import { parseDoc } from '../utils/doc-parser.js'

interface GetComponentArgs {
  name: string
  include_examples?: boolean
}

export async function getComponent(args: GetComponentArgs) {
  const componentPath = join(process.cwd(), `../src/components/${args.name}.tsx`)
  const docPath = join(process.cwd(), `../docs/components/${args.name}.mdx`)

  const componentData = await parseComponent(componentPath)
  const docData = args.include_examples ? await parseDoc(docPath) : null

  return {
    name: componentData.name,
    description: componentData.description,
    category: componentData.category,
    props: componentData.props.map(prop => ({
      name: prop.name,
      type: prop.type,
      required: prop.required,
      default: prop.default,
      description: prop.description,
    })),
    examples: docData?.examples || [],
    accessibility: docData?.accessibility || {},
  }
}
````

### Tool: Generate Example (`src/tools/generate-example.ts`)

```typescript
import { getComponent } from './get-component.js';

interface GenerateExampleArgs {
  component: string;
  props?: Record<string, any>;
  context?: string;
}

export async function generateExample(args: GenerateExampleArgs): Promise<string> {
  const component = await getComponent({ name: args.component });

  const propsString = args.props
    ? Object.entries(args.props)
        .map(([key, value]) => {
          if (typeof value === 'string') return `${key}="${value}"`;
          if (typeof value === 'boolean') return value ? key : `${key}={false}`;
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join('\n  ')
    : '';

  return `import { ${args.component} } from 'your-library'

function Example() {
  return (
    <${args.component}${propsString ? `\n  ${propsString}` : ''}>
      ${args.context || 'Content'}
    </${args.component}>
  )
}

export default Example`;
}
```

### Tool: Validate Props (`src/tools/validate-props.ts`)

```typescript
import { getComponent } from './get-component.js';

interface ValidatePropsArgs {
  component: string;
  props: Record<string, any>;
}

export async function validateProps(args: ValidatePropsArgs) {
  const component = await getComponent({ name: args.component });

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required props
  const requiredProps = component.props.filter((p) => p.required);
  for (const prop of requiredProps) {
    if (!(prop.name in args.props)) {
      errors.push(`Missing required prop: ${prop.name}`);
    }
  }

  // Check unknown props
  const validPropNames = component.props.map((p) => p.name);
  for (const propName of Object.keys(args.props)) {
    if (!validPropNames.includes(propName)) {
      warnings.push(`Unknown prop: ${propName}`);
    }
  }

  // Check prop types (basic validation)
  for (const prop of component.props) {
    if (prop.name in args.props) {
      const value = args.props[prop.name];
      const expectedType = prop.type;

      // Basic type checking
      if (expectedType === 'string' && typeof value !== 'string') {
        errors.push(`Prop ${prop.name} should be string, got ${typeof value}`);
      }
      if (expectedType === 'number' && typeof value !== 'number') {
        errors.push(`Prop ${prop.name} should be number, got ${typeof value}`);
      }
      if (expectedType === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Prop ${prop.name} should be boolean, got ${typeof value}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

## Configuration

Add to your library's `.mcp.json`:

```json
{
  "mcpServers": {
    "your-library": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Publishing

```json
// mcp-server/package.json
{
  "name": "@your-org/library-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "your-library-mcp": "./dist/index.js"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Testing

```typescript
// test/server.test.ts
import { describe, expect, test } from 'vitest';

import { getComponent, listComponents } from '../src/tools';

describe('MCP Server', () => {
  test('lists all components', async () => {
    const result = await listComponents({});
    expect(result.total).toBeGreaterThan(0);
    expect(result.components).toBeInstanceOf(Array);
  });

  test('gets component details', async () => {
    const result = await getComponent({ name: 'Button' });
    expect(result.name).toBe('Button');
    expect(result.props).toBeInstanceOf(Array);
  });

  test('validates props correctly', async () => {
    const result = await validateProps({
      component: 'Button',
      props: { variant: 'primary' },
    });
    expect(result.valid).toBe(true);
  });
});
```

## Usage

After publishing, users can add your MCP server:

```json
// In their .mcp.json
{
  "mcpServers": {
    "your-library": {
      "command": "npx",
      "args": ["-y", "@your-org/library-mcp-server"]
    }
  }
}
```
