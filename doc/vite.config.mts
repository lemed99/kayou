import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    Pages({
      dirs: ['src/pages'],
    }),
    solidPlugin(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Map to workspace packages for development (must use absolute paths)
      '@exowpee/solidly/icons': path.resolve(__dirname, '../packages/core/src/icons'),
      '@exowpee/solidly/hooks': path.resolve(__dirname, '../packages/core/src/hooks'),
      '@exowpee/solidly/context': path.resolve(__dirname, '../packages/core/src/context'),
      '@exowpee/solidly/helpers': path.resolve(__dirname, '../packages/core/src/helpers'),
      '@exowpee/solidly': path.resolve(__dirname, '../packages/core/src'),
      '@exowpee/solidly-pro/hooks': path.resolve(__dirname, '../packages/pro/src/hooks'),
      '@exowpee/solidly-pro/context': path.resolve(
        __dirname,
        '../packages/pro/src/context',
      ),
      '@exowpee/solidly-pro': path.resolve(__dirname, '../packages/pro/src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
