import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  publicDir: false,
  plugins: [solidPlugin(), tailwindcss()],
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        hooks: './src/hooks/index.ts',
        context: './src/context/index.ts',
        helpers: './src/helpers/index.ts',
      },
      name: 'solidly',
      fileName: (_, entryName) =>
        entryName === 'index' ? 'index.es.js' : `${entryName}/index.es.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        '@formatjs/intl',
        '@exowpee/solidly-icons',
        '@exowpee/solidly-hooks',
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
