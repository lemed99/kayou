import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  publicDir: false,
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'kayou-hooks',
      fileName: () => 'index.es.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        'solid-js/store',
        '@formatjs/intl',
        '@solid-primitives/presence',
        'tailwind-merge',
      ],
      output: {
        globals: {
          'solid-js': 'SolidJS',
          'solid-js/web': 'SolidJSWeb',
        },
      },
    },
    emptyOutDir: true,
  },
});
