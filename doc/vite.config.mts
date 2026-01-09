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
    target: 'esnext',
  },
});
