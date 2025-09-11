import tailwindcss from '@tailwindcss/vite';
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
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'YourLibraryName',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web'],
      output: {
        globals: {
          'solid-js': 'SolidJS',
          'solid-js/web': 'SolidJSWeb'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  }
});
