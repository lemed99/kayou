import { type Component, For } from 'solid-js';

import {
  ArrowNarrowRightIcon,
  Brush01Icon,
  Code01Icon,
  Lightning01Icon,
  ListIcon,
  Moon01Icon,
  Users01Icon,
} from '@kayou/icons';
import { A } from '@solidjs/router';

const features: { title: string; description: string; icon: Component<{ class?: string }> }[] = [
  {
    title: 'Built for SolidJS',
    description:
      'Native SolidJS components with fine-grained reactivity. No virtual DOM overhead.',
    icon: Lightning01Icon,
  },
  {
    title: 'Fully Accessible',
    description:
      'WCAG 2.1 compliant with proper ARIA attributes, keyboard navigation, and screen reader support.',
    icon: Users01Icon,
  },
  {
    title: 'TypeScript First',
    description:
      'Written in TypeScript with complete type definitions. Full IntelliSense support.',
    icon: Code01Icon,
  },
  {
    title: 'Dark Mode Ready',
    description:
      'All components support dark mode out of the box with smooth transitions.',
    icon: Moon01Icon,
  },
  {
    title: 'Virtualization',
    description:
      'High-performance virtual lists and grids for rendering large datasets efficiently.',
    icon: ListIcon,
  },
  {
    title: 'Tailwind CSS Styled',
    description:
      'All components are styled with Tailwind CSS. Easy to customize to match your design system.',
    icon: Brush01Icon,
  },
];

export default function HomePage() {
  return (
    <div class="px-4 pb-24 pt-10 sm:px-6">
      {/* Hero Section */}
      <div class="mx-auto max-w-4xl text-center">

        <h1 class="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl dark:text-white">
          Production-ready UI
          <span class="text-blue-600 dark:text-blue-500"> for SolidJS</span>
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-neutral-300">
          35+ accessible UI components and
          <span class="font-semibold text-blue-600 dark:text-blue-500 italic text-2xl"> utility hooks</span>,
          styled with Tailwind CSS and built for production. From form controls and data
          tables to virtual lists, charting, and data fetching.
        </p>

        <div class="mt-10 flex items-center justify-center">
          <A
            href="/overview/quickstart"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
          >
            Get Started
            <ArrowNarrowRightIcon class="size-4" />
          </A>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={features}>
            {(feature) => (
              <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div class="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <feature.icon class="size-6" />
                </div>
                <h3 class="font-semibold text-gray-950 dark:text-white">
                  {feature.title}
                </h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            )}
          </For>
        </div>
      </div>

    </div>
  );
}
