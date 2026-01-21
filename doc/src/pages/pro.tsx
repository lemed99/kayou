import { For } from "solid-js";
import {
  BarChart01Icon,
  CalendarIcon,
  CheckCircleIcon,
  Code01Icon,
  FilterFunnel01Icon,
  Grid01Icon,
  LayoutLeftIcon,
  ListIcon,
  SearchMdIcon,
  Upload01Icon,
  ZapIcon,
} from '@exowpee/solidly/icons';
import { A } from '@solidjs/router';

const ProBadge = () => (
  <span class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 text-xs font-medium text-white">
    <svg class="size-3" viewBox="0 0 20 20" fill="currentColor">
      <path
        fill-rule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
        clip-rule="evenodd"
      />
    </svg>
    Pro
  </span>
);

const proComponents = [
  {
    name: 'DataTable',
    description:
      'Feature-rich data table with sorting, filtering, pagination, virtual scrolling, and column customization.',
    icon: Grid01Icon,
    href: '/components/data-table',
  },
  {
    name: 'DatePicker',
    description:
      'Flexible date picker with single, multiple, and range selection modes. Full keyboard navigation and locale support.',
    icon: CalendarIcon,
    href: '/components/date-picker',
  },
  {
    name: 'MultiSelect',
    description:
      'Multi-select dropdown with search, tags, and virtual scrolling for large option lists.',
    icon: CheckCircleIcon,
    href: '/components/multi-select',
  },
  {
    name: 'SelectWithSearch',
    description:
      'Enhanced select component with built-in search filtering and keyboard navigation.',
    icon: SearchMdIcon,
    href: '/components/select-with-search',
  },
  {
    name: 'NumberInput',
    description:
      'Specialized numeric input with min/max constraints, step increments, and formatted display.',
    icon: Code01Icon,
    href: '/components/number-input',
  },
  {
    name: 'Sidebar',
    description:
      'Responsive navigation sidebar with collapsible sections, nested items, and popover tooltips.',
    icon: LayoutLeftIcon,
    href: '/components/sidebar',
  },
  {
    name: 'UploadFile',
    description:
      'Drag-and-drop file upload with file type validation, size limits, and progress indicators.',
    icon: Upload01Icon,
    href: '/components/upload-file',
  },
  {
    name: 'VirtualGrid',
    description:
      'Virtualized grid for rendering thousands of items efficiently with customizable cell rendering.',
    icon: Grid01Icon,
    href: '/components/virtual-grid',
  },
  {
    name: 'DynamicVirtualList',
    description:
      'Virtual list supporting variable height items with dynamic measurement and smooth scrolling.',
    icon: ListIcon,
    href: '/components/dynamic-virtual-list',
  },
  {
    name: 'LineChart',
    description:
      'Interactive line chart with multiple series, tooltips, grid, and responsive sizing.',
    icon: BarChart01Icon,
    href: '/components/line-chart',
  },
  {
    name: 'PieChart',
    description:
      'Animated pie/donut chart with interactive segments, labels, and customizable active states.',
    icon: BarChart01Icon,
    href: '/components/pie-chart',
  },
];

const features = [
  {
    title: 'Enterprise-Grade Components',
    description:
      'Production-ready components built for complex business applications with accessibility baked in.',
    icon: ZapIcon,
  },
  {
    title: 'Advanced Data Handling',
    description:
      'DataTable with filtering, sorting, virtual scrolling, and column customization for large datasets.',
    icon: FilterFunnel01Icon,
  },
  {
    title: 'Rich Form Controls',
    description:
      'DatePicker, MultiSelect, SearchableSelect, and NumberInput for sophisticated form experiences.',
    icon: CalendarIcon,
  },
  {
    title: 'SVG Charts',
    description:
      'Beautiful, accessible charts built with D3.js - LineChart, PieChart with responsive containers.',
    icon: BarChart01Icon,
  },
];

export default function ProPage() {
  return (
    <div class="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div class="relative overflow-hidden pt-24 pb-16 sm:pb-24">
        <div class="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900" />
        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <ProBadge />
            <h1 class="mt-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl dark:text-white">
              Powerful components for{' '}
              <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                serious applications
              </span>
            </h1>
            <p class="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Solidly Pro extends the free library with enterprise-grade components for
              data-heavy applications. DataTables, Charts, DatePickers, and more.
            </p>
            <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#pricing"
                class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Get Pro License
              </a>
              <A
                href="/components/data-table"
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                View Components
              </A>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <For each={features}>{(feature) => (
            <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <feature.icon class="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-950 dark:text-white">
                {feature.title}
              </h3>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          )}</For>
        </div>
      </div>

      {/* Components List */}
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            Pro Components
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to build complex, data-driven interfaces.
          </p>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={proComponents}>{(component) => (
            <A
              href={component.href}
              class="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
            >
              <div class="flex items-start gap-4">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                  <component.icon class="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {component.name}
                    </h3>
                    <ProBadge />
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {component.description}
                  </p>
                </div>
              </div>
            </A>
          )}</For>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
            One-time purchase, lifetime access. No subscriptions.
          </p>
        </div>
        <div class="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Free Tier */}
          <div class="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">Free</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Open source, MIT licensed. Perfect for personal projects.
            </p>
            <div class="mt-6">
              <span class="text-4xl font-bold text-gray-950 dark:text-white">$0</span>
              <span class="text-gray-500">/forever</span>
            </div>
            <ul class="mt-8 space-y-3">
              <For each={[
                '19 Core components',
                '1,174 Untitled UI icons',
                'Hooks & Context providers',
                'Full TypeScript support',
                'MIT License',
              ]}>{(item) => (
                <li class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircleIcon class="size-5 shrink-0 text-green-500" />
                  {item}
                </li>
              )}</For>
            </ul>
            <A
              href="/overview/quickstart"
              class="mt-8 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Get Started Free
            </A>
          </div>

          {/* Pro Tier */}
          <div class="relative rounded-2xl border-2 border-blue-500 bg-white p-8 dark:bg-gray-900">
            <div class="absolute -top-4 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-sm font-medium text-white">
                <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clip-rule="evenodd"
                  />
                </svg>
                Most Popular
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">Pro</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Everything in Free, plus advanced components for enterprise apps.
            </p>
            <div class="mt-6">
              <span class="text-4xl font-bold text-gray-950 dark:text-white">$149</span>
              <span class="text-gray-500">/one-time</span>
            </div>
            <ul class="mt-8 space-y-3">
              <For each={[
                'Everything in Free',
                '11 Pro components',
                'DataTable with filters & virtual scroll',
                'DatePicker with range selection',
                'SVG Charts (Line, Pie)',
                'Priority support',
                'Lifetime updates',
              ]}>{(item) => (
                <li class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircleIcon class="size-5 shrink-0 text-blue-500" />
                  {item}
                </li>
              )}</For>
            </ul>
            <button
              type="button"
              class="mt-8 block w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500"
            >
              Purchase Pro License
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center sm:p-12">
          <h2 class="text-2xl font-bold text-white sm:text-3xl">
            Ready to build something great?
          </h2>
          <p class="mt-4 text-blue-100">
            Start with the free tier and upgrade when you need Pro components.
          </p>
          <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <A
              href="/overview/quickstart"
              class="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Get Started
            </A>
            <a
              href="https://github.com/exowpee/solidly"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
