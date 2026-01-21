import { For } from 'solid-js';

import { A } from '@solidjs/router';

const componentCategories = [
  {
    name: 'Form Controls',
    description: 'Input components for building forms',
    components: [
      'Button',
      'TextInput',
      'NumberInput',
      'Textarea',
      'Checkbox',
      'ToggleSwitch',
      'Select',
      'MultiSelect',
      'SelectWithSearch',
      'DatePicker',
      'UploadFile',
    ],
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
        />
      </svg>
    ),
  },
  {
    name: 'Feedback',
    description: 'Components for user feedback and status',
    components: ['Alert', 'Badge', 'Spinner', 'Skeleton', 'Tooltip'],
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
    ),
  },
  {
    name: 'Overlays',
    description: 'Modal dialogs, drawers, and popovers',
    components: ['Modal', 'Drawer', 'Popover'],
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
        />
      </svg>
    ),
  },
  {
    name: 'Navigation',
    description: 'Components for app navigation',
    components: ['Breadcrumb', 'Pagination', 'Sidebar'],
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    ),
  },
  {
    name: 'Data Display',
    description: 'Tables, lists, and data visualization',
    components: [
      'DataTable',
      'Accordion',
      'VirtualList',
      'DynamicVirtualList',
      'VirtualGrid',
    ],
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125m1.125-2.625c-.621 0-1.125.504-1.125 1.125"
        />
      </svg>
    ),
  },
  {
    name: 'Typography',
    description: 'Text and label components',
    components: ['Label', 'HelperText', 'IconWrapper'],
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    ),
  },
];

const features = [
  {
    title: 'Built for SolidJS',
    description:
      'Native SolidJS components with fine-grained reactivity. No virtual DOM overhead.',
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
      </svg>
    ),
  },
  {
    title: 'Fully Accessible',
    description:
      'WCAG 2.1 compliant with proper ARIA attributes, keyboard navigation, and screen reader support.',
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
  {
    title: 'TypeScript First',
    description:
      'Written in TypeScript with complete type definitions. Full IntelliSense support.',
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
    ),
  },
  {
    title: 'Dark Mode Ready',
    description:
      'All components support dark mode out of the box with smooth transitions.',
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        />
      </svg>
    ),
  },
  {
    title: 'Virtualization',
    description:
      'High-performance virtual lists and grids for rendering large datasets efficiently.',
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
        />
      </svg>
    ),
  },
  {
    title: 'Customizable',
    description:
      'Flexible styling with Tailwind CSS. Easy to customize to match your design system.',
    icon: (
      <svg
        class="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div class="px-4 pt-10 pb-24 sm:px-6">
      {/* Hero Section */}
      <div class="mx-auto max-w-4xl text-center">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <svg class="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          SolidJS Component Library
        </div>

        <h1 class="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl dark:text-white">
          Build beautiful interfaces{' '}
          <span class="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            faster
          </span>
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          A comprehensive collection of 30+ accessible, customizable, and performant UI
          components built specifically for SolidJS. From simple buttons to complex
          virtual lists.
        </p>

        {/* CTA Buttons */}
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <A
            href="/components/button"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
          >
            Get Started
            <svg
              class="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </A>
          <a
            href="https://github.com/exowpee/solidly"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      {/* Install Section */}
      <div class="mx-auto mt-20 max-w-2xl">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-gray-800">
          <div class="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
            <div class="size-3 rounded-full bg-red-500" />
            <div class="size-3 rounded-full bg-yellow-500" />
            <div class="size-3 rounded-full bg-green-500" />
            <span class="ml-2 text-sm text-gray-400">Terminal</span>
          </div>
          <div class="p-4">
            <code class="font-mono text-sm text-gray-100">
              <span class="text-green-400">$</span> npm install{' '}
              <span class="text-cyan-400">@exowpee/solidly</span>
            </code>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div class="mx-auto mt-24 max-w-5xl">
        <div class="text-center">
          <h2 class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Why choose this library?
          </h2>
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            Built with modern best practices and developer experience in mind.
          </p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={features}>
            {(feature) => (
              <div class="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div class="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 class="font-semibold text-gray-950 dark:text-white">
                  {feature.title}
                </h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Component Categories */}
      <div class="mx-auto mt-24 max-w-5xl">
        <div class="text-center">
          <h2 class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Component Categories
          </h2>
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            30+ components organized by functionality
          </p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={componentCategories}>
            {(category) => (
              <div class="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700">
                <div class="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-gray-900 dark:text-gray-400 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-400">
                  {category.icon}
                </div>
                <h3 class="font-semibold text-gray-950 dark:text-white">
                  {category.name}
                </h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
                <div class="mt-4 flex flex-wrap gap-1.5">
                  <For each={category.components.slice(0, 4)}>
                    {(comp) => (
                      <span class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                        {comp}
                      </span>
                    )}
                  </For>
                  {category.components.length > 4 && (
                    <span class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-500">
                      +{category.components.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Quick Start */}
      <div class="mx-auto mt-24 max-w-3xl">
        <div class="text-center">
          <h2 class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Quick Start
          </h2>
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            Get up and running in minutes
          </p>
        </div>

        <div class="mt-10 space-y-6">
          {/* Step 1 */}
          <div class="flex gap-4">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-950 dark:text-white">
                Install the package
              </h3>
              <div class="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-950 dark:border-gray-800">
                <pre class="overflow-x-auto p-4 text-sm">
                  <code class="font-mono text-gray-100">
                    npm install @exowpee/solidly
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div class="flex gap-4">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-950 dark:text-white">
                Import and use components
              </h3>
              <div class="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-950 dark:border-gray-800">
                <pre class="overflow-x-auto p-4 text-sm">
                  <code class="font-mono text-gray-100">
                    <span class="text-purple-400">import</span> {'{'}{' '}
                    <span class="text-yellow-300">Button</span>,{' '}
                    <span class="text-yellow-300">TextInput</span> {'}'}{' '}
                    <span class="text-purple-400">from</span>{' '}
                    <span class="text-green-400">'@exowpee/solidly'</span>;{'\n\n'}
                    <span class="text-purple-400">function</span>{' '}
                    <span class="text-blue-400">App</span>() {'{'}
                    {'\n'}
                    {'  '}
                    <span class="text-purple-400">return</span> ({'\n'}
                    {'    '}
                    <span class="text-gray-500">{'<'}</span>
                    <span class="text-red-400">div</span>
                    <span class="text-gray-500">{'>'}</span>
                    {'\n'}
                    {'      '}
                    <span class="text-gray-500">{'<'}</span>
                    <span class="text-yellow-300">TextInput</span>{' '}
                    <span class="text-cyan-400">placeholder</span>=
                    <span class="text-green-400">"Enter your name"</span>{' '}
                    <span class="text-gray-500">/{'>'}</span>
                    {'\n'}
                    {'      '}
                    <span class="text-gray-500">{'<'}</span>
                    <span class="text-yellow-300">Button</span>{' '}
                    <span class="text-cyan-400">color</span>=
                    <span class="text-green-400">"success"</span>
                    <span class="text-gray-500">{'>'}</span>Submit
                    <span class="text-gray-500">{'</'}</span>
                    <span class="text-yellow-300">Button</span>
                    <span class="text-gray-500">{'>'}</span>
                    {'\n'}
                    {'    '}
                    <span class="text-gray-500">{'</'}</span>
                    <span class="text-red-400">div</span>
                    <span class="text-gray-500">{'>'}</span>
                    {'\n'}
                    {'  '});{'\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div class="flex gap-4">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              3
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-950 dark:text-white">
                Explore the documentation
              </h3>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Check out individual component pages for detailed props, examples, and
                usage patterns.
              </p>
              <A
                href="/components/button"
                class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Browse Components
                <svg
                  class="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </A>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div class="mx-auto mt-24 max-w-2xl text-center">
        <div class="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-8 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900">
          <h2 class="text-xl font-bold text-gray-950 dark:text-white">
            Ready to get started?
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Start building beautiful SolidJS applications today.
          </p>
          <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <A
              href="/components/button"
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              View Components
            </A>
            <a
              href="https://github.com/exowpee/solidly"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Star on GitHub
              <svg class="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
