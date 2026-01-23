import _generate from '@babel/generator';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
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

    transform(code, id) {
      // Only process component doc pages
      if (!id.includes('/pages/') || !id.endsWith('.tsx')) {
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

        /**
         * Process an array of example objects and inject `code` properties
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
            let extractedCode: string;

            if (t.isJSXElement(arrowFn.body) || t.isJSXFragment(arrowFn.body)) {
              // Direct return: () => <div>...</div> or () => <>...</>
              extractedCode = extractFromSource(code, arrowFn.body);
            } else if (t.isBlockStatement(arrowFn.body)) {
              // Block with statements: () => { const x = 1; return <div/>; }
              extractedCode = extractBlockFromSource(code, arrowFn.body);
            } else if (t.isParenthesizedExpression(arrowFn.body)) {
              // Parenthesized: () => (<div>...</div>)
              const inner = arrowFn.body.expression;
              if (t.isJSXElement(inner) || t.isJSXFragment(inner)) {
                extractedCode = extractFromSource(code, inner);
              } else {
                continue;
              }
            } else {
              continue;
            }

            // Add the `code` property to the example object
            example.properties.push(
              t.objectProperty(t.identifier('code'), t.stringLiteral(extractedCode)),
            );

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
 * Extract code from a node by slicing the original source.
 * Preserves the user's formatting exactly, adjusting for the node's column offset.
 */
function extractFromSource(source: string, node: t.Node): string {
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
      const childrenCode = children
        .map((child) => sliceAndDedent(source, child.start!, child.end!))
        .join('\n');
      return childrenCode;
    }
  }

  return sliceAndDedent(source, node.start!, node.end!);
}

/**
 * Extract code from a block statement by slicing each statement from the source.
 * For return statements, extracts only the returned expression.
 */
function extractBlockFromSource(source: string, block: t.BlockStatement): string {
  const parts: string[] = [];

  for (const stmt of block.body) {
    if (t.isReturnStatement(stmt) && stmt.argument) {
      parts.push(sliceAndDedent(source, stmt.argument.start!, stmt.argument.end!));
    } else {
      parts.push(sliceAndDedent(source, stmt.start!, stmt.end!));
    }
  }

  return parts.join('\n\n');
}

/**
 * Slice source code between two positions and dedent based on the
 * column offset of the start position.
 *
 * The first line in the slice has no leading whitespace (starts at `start`),
 * while subsequent lines retain their full source indentation. We calculate
 * how many columns the node is indented in the source and strip that from
 * all subsequent lines to produce correctly relative indentation.
 */
function sliceAndDedent(source: string, start: number, end: number): string {
  const raw = source.slice(start, end);

  // Find the beginning of the line containing `start`
  let lineStart = start;
  while (lineStart > 0 && source[lineStart - 1] !== '\n') {
    lineStart--;
  }
  const nodeIndent = start - lineStart;

  if (nodeIndent === 0) return raw;

  const lines = raw.split('\n');
  return lines
    .map((line, i) => {
      if (i === 0) return line;
      if (line.trim().length === 0) return '';
      return line.length >= nodeIndent ? line.slice(nodeIndent) : line.trimStart();
    })
    .join('\n');
}
