import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';
import solidPlugin from 'vite-plugin-solid';

import extractExampleCode from './vite-plugin-extract-example-code';

export default defineConfig({
  plugins: [
    extractExampleCode(),
    Pages({
      dirs: ['src/pages'],
    }),
    solidPlugin(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Map to workspace packages for development (must use absolute paths)
      '@exowpee/solidly-hooks': path.resolve(__dirname, '../packages/hooks/src'),
      '@exowpee/solidly-icons': path.resolve(__dirname, '../packages/icons/src'),
      '@exowpee/solidly/hooks': path.resolve(__dirname, '../packages/core/src/hooks'),
      '@exowpee/solidly/context': path.resolve(__dirname, '../packages/core/src/context'),
      '@exowpee/solidly/helpers': path.resolve(__dirname, '../packages/core/src/helpers'),
      '@exowpee/solidly': path.resolve(__dirname, '../packages/core/src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
