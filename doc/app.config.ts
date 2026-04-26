import { defineConfig } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Auto-discover routes for prerendering
function discoverRoutes(): string[] {
  const routesDir = join(__dirname, 'src/routes');
  const routes = ['/'];

  // Add static routes
  ['docs', 'icons'].forEach((r) => routes.push(`/${r}`));

  // Add doc routes
  ['components', 'hooks', 'overview'].forEach((section) => {
    const dir = join(routesDir, '(doc)', section);
    try {
      readdirSync(dir).forEach((file) => {
        if (file.endsWith('.tsx') && file !== 'index.tsx') {
          routes.push(`/${section}/${file.replace('.tsx', '')}`);
        }
      });
    } catch {
      // Directory may not exist yet during initial setup
    }
  });

  return routes;
}

export default defineConfig({
  server: {
    preset: 'static',
    prerender: {
      routes: discoverRoutes(),
    },
  },
  // Use function form to ensure plugins are applied to all routers
  vite: () => {
    return {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@kayou/ui': join(__dirname, '../packages/ui/src'),
          '@kayou/hooks': join(__dirname, '../packages/hooks/src'),
          '@kayou/icons': join(__dirname, '../packages/icons/src'),
          assert: 'assert/',
        },
        dedupe: ['tailwind-merge', 'solid-js'],
      },
    };
  },
});
