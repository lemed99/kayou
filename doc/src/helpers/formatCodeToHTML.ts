enum TokenType {
  Keyword = 'keyword',
  Comment = 'comment',
  String = 'string',
  Number = 'number',
  Operator = 'operator',
  Punctuation = 'punctuation',
  Identifier = 'identifier',
  SolidJSFunction = 'solidjs-function',
  JSXTag = 'jsx-tag',
  JSXAttribute = 'jsx-attribute',
  JSXExpression = 'jsx-expression',
  Default = 'default',
}

interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

interface TokenizerConfig {
  keywords: string[];
  operators: string[];
  solidJSFunctions: string[];
}

const defaultConfig: TokenizerConfig = {
  keywords: [
    'import',
    'export',
    'from',
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'switch',
    'case',
    'break',
    'default',
    'for',
    'while',
    'do',
    'try',
    'catch',
    'finally',
    'throw',
    'new',
    'this',
    'typeof',
    'instanceof',
    'null',
    'undefined',
    'true',
    'false',
    'class',
    'extends',
    'super',
    'interface',
    'implements',
    'private',
    'public',
    'protected',
    'static',
    'async',
    'await',
    'yield',
    'delete',
    'void',
    'as',
    'in',
    'of',
  ],
  operators: [
    '+',
    '-',
    '*',
    '/',
    '%',
    '=',
    '==',
    '===',
    '!=',
    '!==',
    '>',
    '<',
    '>=',
    '<=',
    '&&',
    '||',
    '!',
    '&',
    '|',
    '^',
    '~',
    '<<',
    '>>',
    '>>>',
    '??',
    '?.',
  ],
  solidJSFunctions: [
    'createSignal',
    'createEffect',
    'createMemo',
    'createResource',
    'on',
    'onMount',
    'onCleanup',
    'Show',
    'For',
    'Switch',
    'Match',
    'Dynamic',
    'Portal',
    'ErrorBoundary',
    'Suspense',
    'batch',
    'untrack',
    'createRoot',
    'render',
    'hydrate',
    'lazy',
    'children',
    'splitProps',
    'mergeProps',
    'createContext',
    'useContext',
  ],
};

class CodeTokenizer {
  private config: TokenizerConfig;

  constructor(config: Partial<TokenizerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Tokenize a string of code
   * @param code The code to tokenize
   * @returns Array of tokens
   */
  public tokenize(code: string): Token[][] {
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => this.tokenizeLine(line, lineIndex));
  }

  /**
   * Tokenize a single line of code
   * @param line The line to tokenize
   * @param lineIndex The line number
   * @returns Array of tokens for the line
   */
  private tokenizeLine(line: string, lineIndex: number): Token[] {
    const tokens: Token[] = [];
    let pos = 0;

    // Process the line character by character
    while (pos < line.length) {
      const char = line[pos];
      const remaining = line.substring(pos);

      // Skip whitespace
      if (/\s/.test(char)) {
        pos++;
        continue;
      }

      // Comments (// style)
      if (char === '/' && line[pos + 1] === '/') {
        const comment = line.substring(pos);
        tokens.push({
          type: TokenType.Comment,
          value: comment,
          line: lineIndex,
          column: pos,
        });
        pos += comment.length;
        continue;
      }

      // String literals (", ', or `)
      if (char === '"' || char === "'" || char === '`') {
        let endPos = pos + 1;
        let escaped = false;

        // Find the end of the string
        while (endPos < line.length) {
          if (escaped) {
            escaped = false;
          } else if (line[endPos] === '\\') {
            escaped = true;
          } else if (line[endPos] === char) {
            break;
          }
          endPos++;
        }

        // Check if we found the end of the string
        if (endPos < line.length) {
          const stringLiteral = line.substring(pos, endPos + 1);
          tokens.push({
            type: TokenType.String,
            value: stringLiteral,
            line: lineIndex,
            column: pos,
          });
          pos = endPos + 1;
        } else {
          // Unterminated string, just add the rest as default
          const unterminated = line.substring(pos);
          tokens.push({
            type: TokenType.Default,
            value: unterminated,
            line: lineIndex,
            column: pos,
          });
          pos += unterminated.length;
        }
        continue;
      }

      // Numbers
      const numberMatch = remaining.match(
        /^(0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)/,
      );
      if (numberMatch) {
        tokens.push({
          type: TokenType.Number,
          value: numberMatch[0],
          line: lineIndex,
          column: pos,
        });
        pos += numberMatch[0].length;
        continue;
      }

      // JSX tags (opening)
      const jsxOpeningMatch = remaining.match(/^<([A-Za-z][A-Za-z0-9_\-.]*)/);
      if (jsxOpeningMatch) {
        tokens.push({
          type: TokenType.JSXTag,
          value: jsxOpeningMatch[0],
          line: lineIndex,
          column: pos,
        });
        pos += jsxOpeningMatch[0].length;
        continue;
      }

      // JSX tags (closing)
      const jsxClosingMatch = remaining.match(/^<\/([A-Za-z][A-Za-z0-9_\-.]*)>/);
      if (jsxClosingMatch) {
        tokens.push({
          type: TokenType.JSXTag,
          value: jsxClosingMatch[0],
          line: lineIndex,
          column: pos,
        });
        pos += jsxClosingMatch[0].length;
        continue;
      }

      // JSX expressions (inside curly braces)
      if (char === '{') {
        let braceCount = 1;
        let endPos = pos + 1;

        // Find the matching closing brace
        while (endPos < line.length && braceCount > 0) {
          if (line[endPos] === '{') {
            braceCount++;
          } else if (line[endPos] === '}') {
            braceCount--;
          }
          endPos++;
        }

        if (braceCount === 0) {
          const jsxExpression = line.substring(pos, endPos);
          tokens.push({
            type: TokenType.JSXExpression,
            value: jsxExpression,
            line: lineIndex,
            column: pos,
          });
          pos = endPos;
        } else {
          // Unmatched brace, add as punctuation
          tokens.push({
            type: TokenType.Punctuation,
            value: '{',
            line: lineIndex,
            column: pos,
          });
          pos++;
        }
        continue;
      }

      // Identifiers and keywords
      const identifierMatch = remaining.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
      if (identifierMatch) {
        const identifier = identifierMatch[0];

        // Check if it's a keyword
        if (this.config.keywords.includes(identifier)) {
          tokens.push({
            type: TokenType.Keyword,
            value: identifier,
            line: lineIndex,
            column: pos,
          });
        }
        // Check if it's a SolidJS function
        else if (this.config.solidJSFunctions.includes(identifier)) {
          tokens.push({
            type: TokenType.SolidJSFunction,
            value: identifier,
            line: lineIndex,
            column: pos,
          });
        }
        // Otherwise it's a regular identifier
        else {
          tokens.push({
            type: TokenType.Identifier,
            value: identifier,
            line: lineIndex,
            column: pos,
          });
        }
        pos += identifier.length;
        continue;
      }

      // Operators
      let foundOperator = false;
      for (const op of this.config.operators) {
        if (remaining.startsWith(op)) {
          tokens.push({
            type: TokenType.Operator,
            value: op,
            line: lineIndex,
            column: pos,
          });
          pos += op.length;
          foundOperator = true;
          break;
        }
      }
      if (foundOperator) continue;

      // Punctuation (anything else)
      tokens.push({
        type: TokenType.Punctuation,
        value: char,
        line: lineIndex,
        column: pos,
      });
      pos++;
    }

    return tokens;
  }
}

// Map token types to CSS class names
const tokenClassMap: Record<TokenType, string> = {
  [TokenType.Keyword]: 'code-keyword',
  [TokenType.Comment]: 'code-comment',
  [TokenType.String]: 'code-string',
  [TokenType.Number]: 'code-number',
  [TokenType.Operator]: 'code-operator',
  [TokenType.Punctuation]: 'code-punctuation',
  [TokenType.Identifier]: 'code-identifier',
  [TokenType.SolidJSFunction]: 'code-solidjs',
  [TokenType.JSXTag]: 'code-jsx-tag',
  [TokenType.JSXAttribute]: 'code-jsx-attr',
  [TokenType.JSXExpression]: 'code-jsx-expr',
  [TokenType.Default]: 'code-default',
};

function formatTokensToHTML(tokens: Token[][]): string {
  let codeContent = '';

  tokens.forEach((line, index) => {
    // If the line is empty or has only whitespace tokens, preserve it
    if (line.length === 0) {
      codeContent += '\n';
      return;
    }

    // Track position to handle whitespace between tokens
    let currentPos = 0;

    line.forEach((token) => {
      // Handle whitespace before this token if there's a gap
      if (token.column > currentPos) {
        const whitespace = ' '.repeat(token.column - currentPos);
        codeContent += whitespace;
      }

      const className = tokenClassMap[token.type] || tokenClassMap[TokenType.Default];
      codeContent += `<span class="${className}">${escapeHTML(token.value)}</span>`;

      // Update position after this token
      currentPos = token.column + token.value.length;
    });

    // Add a new line if it's not the last line
    if (index < tokens.length - 1) {
      codeContent += '\n';
    }
  });

  return `<pre class="code-block"><code>${codeContent}</code></pre>`;
}

/**
 * Escape HTML special characters
 */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatCodeToHTML(code: string): string {
  const tokenizer = new CodeTokenizer();
  const tokens = tokenizer.tokenize(code);
  return formatTokensToHTML(tokens);
}
