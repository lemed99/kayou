import { For } from "solid-js";
import { A } from '@solidjs/router';

export default function DocsPage() {
  return (
    <div class="max-w-4xl">
      <h1 class="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
        Documentation
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Welcome to TheRock documentation. Get started with our comprehensive guides and component references.
      </p>

      <div class="mt-10 grid gap-6 sm:grid-cols-2">
        {/* Getting Started */}
        <A
          href="/components/button"
          class="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
          <h2 class="mt-4 font-semibold text-gray-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            Getting Started
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Learn how to install and use TheRock components in your SolidJS project.
          </p>
        </A>

        {/* Components */}
        <A
          href="/components"
          class="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            </svg>
          </div>
          <h2 class="mt-4 font-semibold text-gray-950 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
            Components
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Explore our collection of 30+ accessible and customizable UI components.
          </p>
        </A>

        {/* Hooks */}
        <A
          href="/hooks"
          class="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <h2 class="mt-4 font-semibold text-gray-950 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
            Hooks
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Reusable hooks for common patterns like floating UI, virtual lists, and more.
          </p>
        </A>

        {/* Contexts */}
        <A
          href="/contexts"
          class="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <h2 class="mt-4 font-semibold text-gray-950 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
            Contexts
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Context providers for theming, internationalization, and state management.
          </p>
        </A>
      </div>

      {/* Quick Links */}
      <div class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
        <h3 class="font-semibold text-gray-950 dark:text-white">Popular Components</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <For each={['Button', 'TextInput', 'Select', 'Modal', 'DataTable', 'DatePicker']}>{(comp) => (
            <A
              href={`/components/${comp.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '')}`}
              class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {comp}
            </A>
          )}</For>
        </div>
      </div>
    </div>
  );
}
