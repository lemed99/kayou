/* eslint-disable solid/no-innerhtml */
import { CheckCircleIcon, TerminalIcon } from '@exowpee/solidly-icons';

import { formatCodeToHTML } from '../../helpers/formatCodeToHTML';

const npmInstall = `npm install @exowpee/solidly`;
const pnpmInstall = `pnpm add @exowpee/solidly`;
const yarnInstall = `yarn add @exowpee/solidly`;
const bunInstall = `bun add @exowpee/solidly`;

const tailwindConfig = `// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@exowpee/solidly/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};`;

const importExample = `// Import components
import { Button, Modal, Select } from '@exowpee/solidly';

// Import hooks
import { useMutation, useToggle } from '@exowpee/solidly/hooks';

// Import icons
import { ArrowRightIcon, CheckIcon } from '@exowpee/solidly-icons';

// Import contexts
import { ToastProvider, useToast } from '@exowpee/solidly/contexts';`;

export default function InstallationPage() {
  const getTheme = () =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  return (
    <div class="mx-auto max-w-4xl">
      {/* Header */}
      <div class="mb-12">
        <div class="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <TerminalIcon class="size-4" />
          Setup Guide
        </div>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
          Installation
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Install Solidly in your SolidJS project using your preferred package manager.
        </p>
      </div>

      {/* Requirements */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Requirements</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-950 dark:text-white">Node.js</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Version 18 or higher
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-950 dark:text-white">SolidJS</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Version 1.8 or higher
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-950 dark:text-white">TailwindCSS</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Version 3.4 or higher
            </p>
          </div>
        </div>
      </section>

      {/* Package Installation */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Install the Package
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Choose your preferred package manager:
        </p>

        <div class="mt-6 space-y-4">
          <div>
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">npm</h3>
            <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div innerHTML={formatCodeToHTML(npmInstall, getTheme())} />
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              pnpm
            </h3>
            <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div innerHTML={formatCodeToHTML(pnpmInstall, getTheme())} />
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              yarn
            </h3>
            <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div innerHTML={formatCodeToHTML(yarnInstall, getTheme())} />
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">bun</h3>
            <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div innerHTML={formatCodeToHTML(bunInstall, getTheme())} />
            </div>
          </div>
        </div>
      </section>

      {/* Tailwind Configuration */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Configure TailwindCSS
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Add Solidly to your Tailwind content paths to ensure all component styles are
          included:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div innerHTML={formatCodeToHTML(tailwindConfig, getTheme())} />
        </div>
      </section>

      {/* Import Examples */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Import Modules
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Import components, hooks, icons, and contexts from their respective paths:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div innerHTML={formatCodeToHTML(importExample, getTheme())} />
        </div>
      </section>

      {/* Features */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          What's Included
        </h2>
        <div class="mt-6 space-y-3">
          <div class="flex items-start gap-3">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-500" />
            <div>
              <span class="font-medium text-gray-950 dark:text-white">
                30+ Components
              </span>
              <span class="text-gray-600 dark:text-gray-400">
                {' '}
                — Button, Modal, Select, DatePicker, DataTable, and more
              </span>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-500" />
            <div>
              <span class="font-medium text-gray-950 dark:text-white">15+ Hooks</span>
              <span class="text-gray-600 dark:text-gray-400">
                {' '}
                — useMutation, useFloating, useToggle, useDebounce, and more
              </span>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-500" />
            <div>
              <span class="font-medium text-gray-950 dark:text-white">1000+ Icons</span>
              <span class="text-gray-600 dark:text-gray-400">
                {' '}
                — Beautiful Untitled UI icons, tree-shakeable
              </span>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-500" />
            <div>
              <span class="font-medium text-gray-950 dark:text-white">Contexts</span>
              <span class="text-gray-600 dark:text-gray-400">
                {' '}
                — Toast notifications, theme management
              </span>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-green-500" />
            <div>
              <span class="font-medium text-gray-950 dark:text-white">TypeScript</span>
              <span class="text-gray-600 dark:text-gray-400">
                {' '}
                — Full type definitions included
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Next Steps</h2>
        <div class="mt-4 flex flex-wrap gap-4">
          <a
            href="/overview/quickstart"
            class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Quickstart Guide
          </a>
          <a
            href="/components/button"
            class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Browse Components
          </a>
        </div>
      </section>
    </div>
  );
}
