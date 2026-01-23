/**
 * Template literal tag that strips common leading indentation from multi-line strings.
 * This allows code examples to be properly indented in source files while rendering
 * without extra indentation.
 *
 * @example
 * const code = dedent`
 *   const x = 1;
 *   const y = 2;
 * `;
 * // Result: "const x = 1;\nconst y = 2;"
 */
export function dedent(strings: TemplateStringsArray, ...values: unknown[]): string {
  // Combine template literal parts with interpolated values
  const result = strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? String(values[i] as string | number) : ''),
    '',
  );

  // Split into lines
  const lines = result.split('\n');

  // Remove first line if empty (common with template literals starting on new line)
  if (lines[0].trim() === '') {
    lines.shift();
  }

  // Remove last line if empty
  if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  // Find minimum indentation (ignoring empty lines)
  const minIndent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      return Math.min(min, indent);
    }, Infinity);

  // If no indentation found, return as-is
  if (minIndent === Infinity || minIndent === 0) {
    return lines.join('\n');
  }

  // Strip the common indentation from all lines
  return lines.map((line) => line.slice(minIndent)).join('\n');
}
