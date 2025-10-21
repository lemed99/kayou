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
        icons: './src/icons/index.ts',
      },
      name: 'the_rock',
      fileName: (_, entryName) =>
        entryName === 'index' ? 'index.es.js' : `${entryName}/index.es.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web'],
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
