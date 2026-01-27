import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import solidPlugin from 'eslint-plugin-solid';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const tsParser = tseslint.parser;

export default [
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      'dev',
      'generate-icons.ts',
      'playwright.config.ts',
      'packages/mcp/scripts/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './packages/hooks/tsconfig.json',
          './packages/icons/tsconfig.json',
          './packages/mcp/tsconfig.json',
          './packages/ui/tsconfig.json',
          './doc/tsconfig.json',
          './e2e/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      solid: solidPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...solidPlugin.configs.typescript.rules,
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  prettierConfig,
];
