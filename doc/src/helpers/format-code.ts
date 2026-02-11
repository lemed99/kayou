import { format } from 'prettier/standalone';
import babelPlugin from 'prettier/plugins/babel';
import estreePlugin from 'prettier/plugins/estree';

const prettierOpts = {
  parser: 'babel' as const,
  plugins: [babelPlugin, estreePlugin],
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all' as const,
  semi: true,
};

// Placeholder for `...` ellipsis in JSX that Prettier can't parse
const ELLIPSIS_PLACEHOLDER = '__ELLIPSIS__={true}';
const ELLIPSIS_RE = /\.\.\.\s/g;

function sanitize(code: string): string {
  return code.replace(ELLIPSIS_RE, ELLIPSIS_PLACEHOLDER + ' ');
}

function restore(code: string): string {
  return code.replaceAll(ELLIPSIS_PLACEHOLDER, '...');
}

/** Try formatting a single chunk, wrapping bare JSX in a fragment if needed. */
async function formatChunk(chunk: string): Promise<string> {
  const clean = sanitize(chunk);
  const isBareJsx = /^\s*(\/\/.*\n\s*)?</.test(clean);

  if (!isBareJsx) {
    try {
      const result = await format(clean, prettierOpts);
      return restore(result.trimEnd());
    } catch {
      // Not valid JS — try fragment wrap below
    }
  }

  try {
    const wrapped = `<>\n${clean}\n</>;\n`;
    const result = await format(wrapped, prettierOpts);
    const trimmed = result.trimEnd();
    const lines = trimmed.split('\n');

    let inner: string;
    if (lines.length <= 2) {
      // Prettier collapsed to a single line like `<>content</>;`
      inner = trimmed.replace(/^<>\s?/, '').replace(/\s?<\/>;?$/, '');
    } else {
      inner = lines
        .slice(1, -1)
        .map((l) => (l.startsWith('  ') ? l.slice(2) : l))
        .join('\n');
    }
    return restore(inner);
  } catch {
    return chunk;
  }
}

/**
 * Format code with Prettier. Handles both valid JS/TSX and usage snippets
 * containing bare JSX mixed with imports/comments.
 */
export async function formatCode(code: string): Promise<string> {
  // First try formatting the whole thing as-is
  try {
    const result = await format(sanitize(code), prettierOpts);
    return restore(result.trimEnd());
  } catch {
    // Fall through to chunk-based formatting
  }

  // Split on blank lines into chunks, format each independently
  const chunks = code.split(/\n\s*\n/);
  const formatted: string[] = [];

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    formatted.push(await formatChunk(trimmed));
  }

  return formatted.join('\n\n');
}
