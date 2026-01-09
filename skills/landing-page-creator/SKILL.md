---
name: landing-page-creator
version: 1.0.0
description: Creates modern, performant landing pages for SolidJS UI libraries with interactive demos, component showcases, and live code editors. Builds production-ready marketing sites.
author: Your Library Team
tags: [solidjs, landing-page, marketing, demo, showcase]
---

# Landing Page Creator

Professional landing page generator for UI libraries.

## Activation Triggers

This skill activates when the user:

- Says "create landing page", "build homepage", or "make marketing site"
- Asks "how do I showcase the library"
- Mentions "interactive demo" or "component showcase"
- Says "create a site to present the library"

## Landing Page Architecture

### Tech Stack

- **Framework:** SolidJS + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Code Editor:** Monaco Editor (lightweight alternative: Shiki)
- **Components:** Your own UI library (dogfooding!)

### Core Sections

1. **Hero** - Eye-catching introduction with CTA
2. **Features** - Key benefits (6-8 cards)
3. **Component Showcase** - Interactive browser
4. **Live Demo** - Code playground
5. **Statistics** - Downloads, stars, components
6. **Quick Start** - Installation guide
7. **Testimonials** - User feedback (if available)
8. **Footer** - Links and legal

### Design Principles

**Modern & Bold:**

- Contemporary design trends (2024-2025)
- Gradient accents
- Glassmorphism effects
- Bold typography
- Generous whitespace

**Interactive:**

- Smooth animations (respect prefers-reduced-motion)
- Hover effects on everything
- Micro-interactions
- Scroll-triggered animations
- Live component previews

**Fast:**

- Perfect Lighthouse score (95+)
- < 1s First Contentful Paint
- < 2s Time to Interactive
- Code splitting
- Lazy loading

**Accessible:**

- WCAG AA compliant
- Keyboard navigable
- Screen reader friendly
- Semantic HTML

## Project Structure

```
landing/
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── ComponentShowcase.tsx
│   │   ├── LiveDemo.tsx
│   │   ├── Statistics.tsx
│   │   ├── QuickStart.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   └── index.ts
│   ├── lib/
│   │   ├── code-editor.ts
│   │   └── component-data.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── public/
│   ├── og-image.png
│   └── favicon.svg
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Component Templates

### Hero Section

```typescript
import { createSignal } from 'solid-js'
import { Button } from 'your-library'

export function Hero() {
  const [copied, setCopied] = createSignal(false)

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText('npm install your-library')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <div class="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h1 class="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Your Library Name
        </h1>

        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Enterprise-grade SolidJS components built for performance,
          accessibility, and developer experience.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            as="a"
            href="/docs"
            size="lg"
            variant="primary"
            class="text-lg px-8 py-4"
          >
            Get Started
          </Button>

          <Button
            as="a"
            href="https://github.com/yourorg/library"
            size="lg"
            variant="secondary"
            class="text-lg px-8 py-4"
          >
            View on GitHub
          </Button>
        </div>

        {/* Install command */}
        <div class="inline-flex items-center gap-4 bg-gray-900 dark:bg-gray-800 rounded-lg px-6 py-4 font-mono text-sm">
          <code class="text-green-400">npm install your-library</code>
          <button
            onClick={copyInstallCommand}
            class="text-gray-400 hover:text-white transition"
            aria-label="Copy install command"
          >
            {copied() ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>

        {/* Stats */}
        <div class="mt-12 flex gap-8 justify-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
            <div>Components</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">10k+</div>
            <div>Downloads</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">1.2k</div>
            <div>GitHub Stars</div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### Feature Grid

```typescript
import { For } from 'solid-js'
import { IconType } from 'your-library'

interface Feature {
  icon: IconType
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: 'TypeScript',
    title: 'Type-Safe',
    description: 'Built with TypeScript for superior developer experience and catch errors before runtime.'
  },
  {
    icon: 'Accessibility',
    title: 'Accessible',
    description: 'WCAG AA compliant with full keyboard navigation and screen reader support.'
  },
  {
    icon: 'Performance',
    title: 'Blazing Fast',
    description: 'Leverages SolidJS fine-grained reactivity for minimal re-renders and optimal performance.'
  },
  {
    icon: 'Customize',
    title: 'Customizable',
    description: 'Flexible theming system and CSS variables for easy customization.'
  },
  {
    icon: 'Documentation',
    title: 'Well Documented',
    description: 'Comprehensive documentation with interactive examples for every component.'
  },
  {
    icon: 'Enterprise',
    title: 'Enterprise Ready',
    description: 'Battle-tested components used in production by companies worldwide.'
  }
]

export function FeatureGrid() {
  return (
    <section class="py-24 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-4">
          Built for Modern Development
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 text-center mb-16 max-w-3xl mx-auto">
          Everything you need to build beautiful, accessible interfaces with confidence.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={features}>
            {(feature) => (
              <div class="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div class="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                  {feature.icon}
                </div>

                <h3 class="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                  {feature.title}
                </h3>

                <p class="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  )
}
```

### Component Showcase

```typescript
import { createSignal, For, Show } from 'solid-js'
import { Button, Input, Card, Badge } from 'your-library'

interface ComponentInfo {
  name: string
  category: string
  description: string
  component: () => JSX.Element
  code: string
}

const components: ComponentInfo[] = [
  {
    name: 'Button',
    category: 'Forms',
    description: 'Interactive button with multiple variants',
    component: () => (
      <div class="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    ),
    code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>`
  },
  // ... more components
]

export function ComponentShowcase() {
  const [selectedCategory, setSelectedCategory] = createSignal('All')
  const [search, setSearch] = createSignal('')

  const categories = ['All', 'Forms', 'Layout', 'Data Display', 'Feedback']

  const filteredComponents = () => {
    return components.filter(c => {
      const matchesCategory = selectedCategory() === 'All' || c.category === selectedCategory()
      const matchesSearch = c.name.toLowerCase().includes(search().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }

  return (
    <section class="py-24 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-4">
          Explore Components
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 text-center mb-12">
          50+ production-ready components for every use case
        </p>

        {/* Filters */}
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search components..."
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            class="flex-1"
          />

          <div class="flex gap-2 flex-wrap">
            <For each={categories}>
              {(category) => (
                <Badge
                  variant={selectedCategory() === category ? 'primary' : 'secondary'}
                  onClick={() => setSelectedCategory(category)}
                  class="cursor-pointer hover:scale-105 transition"
                >
                  {category}
                </Badge>
              )}
            </For>
          </div>
        </div>

        {/* Component Grid */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <For each={filteredComponents()}>
            {(comp) => (
              <Card class="p-6">
                <div class="mb-4">
                  <h3 class="text-xl font-bold mb-2">{comp.name}</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {comp.description}
                  </p>
                </div>

                {/* Live Preview */}
                <div class="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                  {comp.component()}
                </div>

                {/* Code */}
                <details class="group">
                  <summary class="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View Code
                  </summary>
                  <pre class="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm">
                    <code>{comp.code}</code>
                  </pre>
                </details>
              </Card>
            )}
          </For>
        </div>

        <Show when={filteredComponents().length === 0}>
          <div class="text-center py-12 text-gray-500">
            No components found matching your criteria
          </div>
        </Show>
      </div>
    </section>
  )
}
```

### Live Code Editor

```typescript
import { createSignal, createEffect } from 'solid-js'
import { Button } from 'your-library'

// Simple syntax highlighter (or use Shiki/Monaco)
function highlightCode(code: string): string {
  return code
    .replace(/(&lt;[^&]*&gt;)/g, '<span class="text-blue-400">$1</span>')
    .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
}

export function LiveDemo() {
  const defaultCode = `import { Button } from 'your-library'

function App() {
  return (
    <Button variant="primary">
      Click me!
    </Button>
  )
}`

  const [code, setCode] = createSignal(defaultCode)
  const [output, setOutput] = createSignal<JSX.Element>()
  const [error, setError] = createSignal<string>()

  const runCode = () => {
    try {
      // In production, use a safe sandbox like iframe
      // This is simplified for demonstration
      setError(undefined)

      // Evaluate code and render
      const Component = new Function('Button', `
        ${code()}
        return App
      `)(Button)

      setOutput(<Component />)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <section class="py-24 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-4">
          Try It Live
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 text-center mb-12">
          Edit the code and see results instantly
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div class="flex flex-col">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Code Editor
              </span>
              <Button size="sm" onClick={runCode}>
                Run Code
              </Button>
            </div>

            <textarea
              class="flex-1 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={code()}
              onInput={(e) => setCode(e.currentTarget.value)}
              rows={15}
              spellcheck={false}
            />
          </div>

          {/* Preview */}
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Preview
            </span>

            <div class="flex-1 p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <Show
                when={!error()}
                fallback={
                  <div class="text-red-500 font-mono text-sm">
                    Error: {error()}
                  </div>
                }
              >
                {output()}
              </Show>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

## Configuration

Create `landing/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['solid-js'],
          editor: ['monaco-editor'], // if using Monaco
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
```

Create `landing/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
```

## Performance Optimization

### Code Splitting

```typescript
import { lazy } from 'solid-js'

// Lazy load heavy components
const ComponentShowcase = lazy(() => import('./components/ComponentShowcase'))
const LiveDemo = lazy(() => import('./components/LiveDemo'))

function App() {
  return (
    <>
      <Hero />
      <FeatureGrid />

      <Suspense fallback={<LoadingSpinner />}>
        <ComponentShowcase />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <LiveDemo />
      </Suspense>
    </>
  )
}
```

### Image Optimization

```typescript
// Use next-gen formats
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero" loading="lazy" />
</picture>
```

## SEO & Meta Tags

```typescript
// In index.html or use solid-meta
<head>
  <title>Your Library - Enterprise SolidJS Components</title>
  <meta name="description" content="Enterprise-grade SolidJS components built for performance, accessibility, and developer experience." />

  <!-- Open Graph -->
  <meta property="og:title" content="Your Library" />
  <meta property="og:description" content="Enterprise-grade SolidJS components" />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:url" content="https://your-library.com" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Your Library" />
  <meta name="twitter:description" content="Enterprise-grade SolidJS components" />
  <meta name="twitter:image" content="/og-image.png" />
</head>
```

## Deployment

Deploy to Vercel/Netlify:

```bash
# Build
npm run build

# Preview
npm run preview

# Deploy
vercel deploy
# or
netlify deploy
```

## Notes

- Use **effort=high** for landing page creation
- Optimize images and fonts
- Test on multiple devices
- Ensure perfect Lighthouse scores
- Implement analytics (optional)
