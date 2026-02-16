import { For } from 'solid-js';

import { LayersThree01Icon, PlayIcon, Tool02Icon } from '@kayou/icons';
import { A } from '@solidjs/router';

export default function DocsPage() {
  return (
    <div class="max-w-4xl">
      <h1 class="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
        Documentation
      </h1>
      <p class="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        Welcome to TheRock documentation. Get started with our comprehensive guides and
        component references.
      </p>

      <div class="mt-10 grid gap-6 sm:grid-cols-2">
        {/* Getting Started */}
        <A
          href="/ui/button"
          class="group rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-400"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <PlayIcon class="size-6" />
          </div>
          <h2 class="mt-4 font-semibold text-neutral-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            Getting Started
          </h2>
          <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Learn how to install and use TheRock components in your SolidJS project.
          </p>
        </A>

        {/* Components */}
        <A
          href="/ui/button"
          class="group rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-400"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <LayersThree01Icon class="size-6" />
          </div>
          <h2 class="mt-4 font-semibold text-neutral-950 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
            Components
          </h2>
          <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Explore our collection of 30+ accessible and customizable UI components.
          </p>
        </A>

        {/* Hooks */}
        <A
          href="/hooks"
          class="group rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-400"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
            <Tool02Icon class="size-6" />
          </div>
          <h2 class="mt-4 font-semibold text-neutral-950 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
            Hooks
          </h2>
          <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Reusable hooks for common patterns like floating UI, virtual lists, and more.
          </p>
        </A>

      </div>

      {/* Quick Links */}
      <div class="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <h3 class="font-semibold text-neutral-950 dark:text-white">Popular Components</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <For
            each={['Button', 'TextInput', 'Select', 'Modal', 'DataTable', 'DatePicker']}
          >
            {(comp) => (
              <A
                href={`/ui/${comp
                  .toLowerCase()
                  .replace(/([A-Z])/g, '-$1')
                  .replace(/^-/, '')}`}
                class="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {comp}
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
