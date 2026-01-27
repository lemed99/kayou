import _generate from '@babel/generator';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as prettier from 'prettier';
import type { Plugin } from 'vite';

// Handle ESM/CJS interop for Babel packages
const traverse =
  (_traverse as unknown as { default: typeof _traverse }).default ?? _traverse;
const generate =
  (_generate as unknown as { default: typeof _generate }).default ?? _generate;

/**
 * Vite plugin that automatically extracts JSX source code from example `component`
 * functions and injects it as the `code` prop.
 *
 * This eliminates the need to manually duplicate code between the `component` and
 * `code` props in documentation examples.
 *
 * Before:
 * ```tsx
 * examples={[
 *   {
 *     title: 'Example',
 *     code: `<Button>Click</Button>`,
 *     component: () => <Button>Click</Button>,
 *   },
 * ]}
 * ```
 *
 * After (with this plugin):
 * ```tsx
 * examples={[
 *   {
 *     title: 'Example',
 *     component: () => <Button>Click</Button>,
 *   },
 * ]}
 * ```
 *
 * The plugin will automatically generate the `code` prop from the component.
 */
export default function extractExampleCode(): Plugin {
  return {
    name: 'extract-example-code',
    enforce: 'pre',

    async transform(code, id) {
      // Strip query string for file extension check
      const cleanId = id.split('?')[0];

      // Only process component doc pages (handle both direct .tsx and query-string versions)
      if (!cleanId.includes('/routes/') || !cleanId.endsWith('.tsx')) {
        return null;
      }

      // Quick check - skip if no 'examples' in the file
      if (!code.includes('examples')) {
        return null;
      }

      try {
        // Parse the file
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
        });

        let modified = false;
        const extractedCodes: { example: t.ObjectExpression; rawCode: string }[] = [];

        /**
         * Process an array of example objects and collect raw code for formatting
         */
        const processExamplesArray = (examples: t.ArrayExpression) => {
          for (const example of examples.elements) {
            if (!t.isObjectExpression(example)) continue;

            // Check if this example already has a `code` property
            const hasCode = example.properties.some(
              (prop) =>
                t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'code' }),
            );

            if (hasCode) continue;

            // Find the `component` property
            const componentProp = example.properties.find(
              (prop) =>
                t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key, { name: 'component' }),
            );

            if (
              !componentProp ||
              !t.isObjectProperty(componentProp) ||
              !t.isArrowFunctionExpression(componentProp.value)
            ) {
              continue;
            }

            const arrowFn = componentProp.value;
            let rawCode: string;

            if (t.isJSXElement(arrowFn.body) || t.isJSXFragment(arrowFn.body)) {
              // Direct return: () => <div>...</div> or () => <>...</>
              rawCode = generateCode(arrowFn.body);
            } else if (t.isBlockStatement(arrowFn.body)) {
              // Block with statements: () => { const x = 1; return <div/>; }
              rawCode = generateBlockCode(arrowFn.body);
            } else if (t.isParenthesizedExpression(arrowFn.body)) {
              // Parenthesized: () => (<div>...</div>)
              const inner = arrowFn.body.expression;
              if (t.isJSXElement(inner) || t.isJSXFragment(inner)) {
                rawCode = generateCode(inner);
              } else {
                continue;
              }
            } else {
              continue;
            }

            extractedCodes.push({ example, rawCode });
            modified = true;
          }
        };

        traverse(ast, {
          // Handle JSX attribute: examples={[...]}
          JSXAttribute(path) {
            if (
              !t.isJSXIdentifier(path.node.name, { name: 'examples' }) ||
              !t.isJSXExpressionContainer(path.node.value)
            ) {
              return;
            }

            const expr = path.node.value.expression;
            if (t.isArrayExpression(expr)) {
              processExamplesArray(expr);
            }
          },

          // Handle object property: examples: [...]
          ObjectProperty(path) {
            if (
              !t.isIdentifier(path.node.key, { name: 'examples' }) ||
              !t.isArrayExpression(path.node.value)
            ) {
              return;
            }

            processExamplesArray(path.node.value);
          },
        });

        if (modified) {
          // Format all extracted code snippets with Prettier
          for (const { example, rawCode } of extractedCodes) {
            const formattedCode = await formatWithPrettier(rawCode);
            example.properties.push(
              t.objectProperty(t.identifier('code'), t.stringLiteral(formattedCode)),
            );
          }

          const output = generate(ast, {}, code);
          return {
            code: output.code,
            map: null,
          };
        }

        return null;
      } catch (error) {
        // If parsing fails, just return the original code
        console.warn(`[extract-example-code] Failed to parse ${id}:`, error);
        return null;
      }
    },
  };
}

/**
 * Generate code from a JSX node using Babel's generator.
 * This is more reliable than slicing source when pre-processing
 * modifies whitespace (e.g., SolidStart/Vinxi transformations).
 */
function generateCode(node: t.Node): string {
  if (t.isJSXFragment(node)) {
    // For fragments, extract only meaningful children without the wrapper
    const fragment = node;
    const children = fragment.children.filter(
      (child) =>
        t.isJSXElement(child) ||
        t.isJSXFragment(child) ||
        (t.isJSXExpressionContainer(child) && !t.isJSXEmptyExpression(child.expression)),
    );

    if (children.length > 0) {
      const childrenCode = children.map((child) => generate(child).code).join('\n');
      return childrenCode;
    }
  }

  return generate(node).code;
}

/**
 * Generate code from a block statement.
 * For return statements, extracts only the returned expression.
 */
function generateBlockCode(block: t.BlockStatement): string {
  const parts: string[] = [];

  for (const stmt of block.body) {
    if (t.isReturnStatement(stmt) && stmt.argument) {
      parts.push(generate(stmt.argument).code);
    } else {
      parts.push(generate(stmt).code);
    }
  }

  return parts.join('\n\n');
}

/**
 * Format code snippet with Prettier for consistent indentation and prop wrapping.
 */
async function formatWithPrettier(code: string): Promise<string> {
  try {
    // First, format the raw code directly as a JSX fragment
    // This ensures proper prop wrapping and indentation
    const formatted = await prettier.format(code, {
      parser: 'babel-ts',
      printWidth: 55, // Shorter to encourage prop wrapping
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      jsxSingleQuote: false,
      trailingComma: 'all',
    });

    // Remove trailing semicolon that Prettier adds (JSX snippets don't need it)
    return formatted.trim().replace(/;$/, '');
  } catch {
    // If direct formatting fails (e.g., multiple JSX roots), wrap in fragment
    try {
      const wrapped = `<>\n${code}\n</>`;
      const formatted = await prettier.format(wrapped, {
        parser: 'babel-ts',
        printWidth: 55,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        jsxSingleQuote: false,
        trailingComma: 'all',
      });

      // Extract content by removing the fragment wrapper lines
      const lines = formatted.trim().split('\n');

      // Check if first/last lines are the fragment markers
      if (lines[0].trim() === '<>' && lines[lines.length - 1].trim() === '</>') {
        const contentLines = lines.slice(1, -1);
        return dedentCode(contentLines.join('\n'));
      }

      // Fallback: try regex extraction
      const match = formatted.match(/<>\n?([\s\S]*?)\n?<\/>/);
      if (match) {
        // Split into lines and remove empty first/last lines before dedenting
        const contentLines = match[1].split('\n');
        while (contentLines.length > 0 && contentLines[0].trim() === '') {
          contentLines.shift();
        }
        while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === '') {
          contentLines.pop();
        }
        return dedentCode(contentLines.join('\n'));
      }
    } catch {
      // Ignore secondary error
    }

    // Fallback: return original code
    return code;
  }
}

/**
 * Remove common leading indentation from all lines.
 */
function dedentCode(code: string): string {
  const lines = code.split('\n');
  if (lines.length <= 1) return code;

  // Find minimum indentation (ignoring empty lines)
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    minIndent = Math.min(minIndent, indent);
  }

  if (minIndent === 0 || minIndent === Infinity) return code;

  // Remove the common indentation
  return lines
    .map((line) => {
      if (line.trim().length === 0) return '';
      return line.slice(minIndent);
    })
    .join('\n');
}
