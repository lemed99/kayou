#!/usr/bin/env node

/**
 * Kayou MCP Server
 *
 * Provides AI-assisted access to the kayou component library:
 * - @kayou/ui - UI components
 * - @kayou/hooks - Utility hooks
 * - @kayou/icons - Icon components
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import type { KayouData, ComponentData, HookData } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load kayou data
function loadData(): KayouData {
  const dataPath = path.join(__dirname, '../data/kayou-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Data file not found. Run "pnpm run generate" first.');
    return {
      version: '0.0.0',
      generatedAt: new Date().toISOString(),
      components: [],
      hooks: [],
      icons: [],
    };
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as KayouData;
}

const data: KayouData = loadData();

// Create server
const server = new Server(
  {
    name: 'kayou-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define tools
// eslint-disable-next-line @typescript-eslint/require-await
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description:
          'List all available kayou UI components. Returns component names with brief descriptions.',
        inputSchema: {
          type: 'object',
          properties: {
            search: {
              type: 'string',
              description: 'Optional search term to filter components by name or description',
            },
          },
        },
      },
      {
        name: 'get_component',
        description:
          'Get detailed information about a specific kayou UI component including props, usage examples, and import statements.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The component name (e.g., "Button", "Select", "DataTable")',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'list_hooks',
        description:
          'List all available kayou hooks. Returns hook names with brief descriptions.',
        inputSchema: {
          type: 'object',
          properties: {
            search: {
              type: 'string',
              description: 'Optional search term to filter hooks by name or description',
            },
          },
        },
      },
      {
        name: 'get_hook',
        description:
          'Get detailed information about a specific kayou hook including parameters, return values, and usage examples.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The hook name (e.g., "useMutation", "useFloating", "useTheme")',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'search_icons',
        description:
          'Search for icons in the kayou icon library by name or keyword.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description:
                'Search query to find icons (e.g., "arrow", "check", "user", "chart")',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 20)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_component_props',
        description:
          'Get only the props definition for a component. Useful when you need just the props interface.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The component name',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_usage_example',
        description:
          'Get usage examples for a specific component or hook.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The component or hook name',
            },
            type: {
              type: 'string',
              enum: ['component', 'hook'],
              description: 'Whether to search in components or hooks',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

// Handle tool calls
// eslint-disable-next-line @typescript-eslint/require-await
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'list_components': {
      const search = (args?.search as string)?.toLowerCase();
      let components = data.components;

      if (search) {
        components = components.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search)
        );
      }

      const result = components.map((c) => ({
        name: c.name,
        description: c.description,
        import: c.importPath,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'get_component': {
      const componentName = args?.name as string;
      const component = data.components.find(
        (c) => c.name.toLowerCase() === componentName.toLowerCase()
      );

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found. Use list_components to see available components.`,
            },
          ],
          isError: true,
        };
      }

      const result = {
        name: component.name,
        description: component.description,
        package: component.package,
        import: component.importPath,
        props: component.props,
        usage: component.usage,
        examples: component.examples,
        keyConcepts: component.keyConcepts,
        dependencies: component.dependencies,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'list_hooks': {
      const search = (args?.search as string)?.toLowerCase();
      let hooks = data.hooks;

      if (search) {
        hooks = hooks.filter(
          (h) =>
            h.name.toLowerCase().includes(search) ||
            h.description.toLowerCase().includes(search)
        );
      }

      const result = hooks.map((h) => ({
        name: h.name,
        description: h.description,
        import: h.importPath,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'get_hook': {
      const hookName = args?.name as string;
      const hook = data.hooks.find(
        (h) => h.name.toLowerCase() === hookName.toLowerCase()
      );

      if (!hook) {
        return {
          content: [
            {
              type: 'text',
              text: `Hook "${hookName}" not found. Use list_hooks to see available hooks.`,
            },
          ],
          isError: true,
        };
      }

      const result = {
        name: hook.name,
        description: hook.description,
        package: hook.package,
        import: hook.importPath,
        parameters: hook.parameters,
        returnType: hook.returnType,
        returns: hook.returns,
        usage: hook.usage,
        examples: hook.examples,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'search_icons': {
      const query = (args?.query as string)?.toLowerCase();
      const limit = (args?.limit as number) || 20;

      if (!query) {
        return {
          content: [
            {
              type: 'text',
              text: 'Please provide a search query.',
            },
          ],
          isError: true,
        };
      }

      const matchingIcons = data.icons
        .filter(
          (icon) =>
            icon.name.toLowerCase().includes(query) ||
            icon.exportName.toLowerCase().includes(query) ||
            icon.fileName.toLowerCase().includes(query)
        )
        .slice(0, limit);

      const result = {
        query,
        count: matchingIcons.length,
        totalAvailable: data.icons.length,
        icons: matchingIcons.map((icon) => ({
          name: icon.name,
          import: `import { ${icon.exportName} } from '@kayou/icons';`,
          usage: `<${icon.exportName} />`,
        })),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'get_component_props': {
      const componentName = args?.name as string;
      const component = data.components.find(
        (c) => c.name.toLowerCase() === componentName.toLowerCase()
      );

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found.`,
            },
          ],
          isError: true,
        };
      }

      const result = {
        component: component.name,
        props: component.props,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'get_usage_example': {
      const itemName = args?.name as string;
      const itemType = args?.type as string;

      let item: ComponentData | HookData | undefined;

      if (itemType === 'hook') {
        item = data.hooks.find(
          (h) => h.name.toLowerCase() === itemName.toLowerCase()
        );
      } else {
        item = data.components.find(
          (c) => c.name.toLowerCase() === itemName.toLowerCase()
        );
        if (!item) {
          item = data.hooks.find(
            (h) => h.name.toLowerCase() === itemName.toLowerCase()
          );
        }
      }

      if (!item) {
        return {
          content: [
            {
              type: 'text',
              text: `"${itemName}" not found.`,
            },
          ],
          isError: true,
        };
      }

      const result = {
        name: item.name,
        import: item.importPath,
        usage: item.usage,
        examples: item.examples,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
  }
});

// Define resources for browsing
// eslint-disable-next-line @typescript-eslint/require-await
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'kayou://components',
        name: 'Kayou Components',
        description: 'List of all available UI components',
        mimeType: 'application/json',
      },
      {
        uri: 'kayou://hooks',
        name: 'Kayou Hooks',
        description: 'List of all available hooks',
        mimeType: 'application/json',
      },
      {
        uri: 'kayou://icons',
        name: 'Kayou Icons',
        description: 'List of all available icons',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reads
// eslint-disable-next-line @typescript-eslint/require-await
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'kayou://components':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              data.components.map((c) => ({
                name: c.name,
                description: c.description,
                import: c.importPath,
              })),
              null,
              2
            ),
          },
        ],
      };

    case 'kayou://hooks':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              data.hooks.map((h) => ({
                name: h.name,
                description: h.description,
                import: h.importPath,
              })),
              null,
              2
            ),
          },
        ],
      };

    case 'kayou://icons':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                totalCount: data.icons.length,
                icons: data.icons.slice(0, 100).map((i) => ({
                  name: i.name,
                  exportName: i.exportName,
                })),
                note: 'Showing first 100 icons. Use search_icons tool to find specific icons.',
              },
              null,
              2
            ),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Kayou MCP server running on stdio');
}

main().catch(console.error);
