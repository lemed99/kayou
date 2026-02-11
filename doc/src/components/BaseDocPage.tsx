import {
  For,
  type JSX,
  type ParentProps,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from 'solid-js';

import { ChevronLeftIcon, ChevronRightIcon } from '@kayou/icons';
import { A, useLocation } from '@solidjs/router';

// Shared SECTIONS constant for TOC
export const SECTIONS = [
  { id: 'dependencies', title: 'Dependencies' },
  { id: 'key-concepts', title: 'Key Concepts' },
  { id: 'provider', title: 'Required Provider' },
  { id: 'related-hooks', title: 'Related Hooks' },
  { id: 'related-contexts', title: 'Related Contexts' },
  { id: 'usage', title: 'Usage' },
  { id: 'props', title: 'Props' },
  { id: 'sub-components', title: 'Sub-components' },
  { id: 'types', title: 'Types' },
  { id: 'returns', title: 'Returns' },
  { id: 'playground', title: 'Playground' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

// Navigation pages for prev/next footer
const gettingStartedPages = [
  { path: '/overview/quickstart', label: 'Introduction' },
  { path: '/overview/contributing', label: 'Contributing' },
  { path: '/overview/license', label: 'License' },
];

const componentCategories: Record<string, string[]> = {
  Form: [
    'button',
    'checkbox',
    'date-picker',
    'helper-text',
    'label',
    'multi-select',
    'number-input',
    'password',
    'rich-text-editor',
    'select',
    'select-with-search',
    'text-input',
    'textarea',
    'toggle-switch',
    'upload-file',
  ],
  Layout: ['accordion', 'drawer', 'modal', 'pagination', 'popover', 'sidebar', 'tooltip'],
  Feedback: ['alert', 'badge', 'skeleton', 'spinner'],
  Navigation: ['breadcrumb'],
  'Data Display': ['data-table', 'dynamic-virtual-list', 'virtual-grid', 'virtual-list'],
  Charts: ['area-chart', 'bar-chart', 'line-chart', 'pie-chart', 'responsive-container'],
};

const toPascalCase = (str: string): string =>
  str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

const toCamelCase = (str: string): string =>
  str
    .split('-')
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');

const buildAllPages = (): Array<{ path: string; label: string }> => {
  const pages: Array<{ path: string; label: string }> = [];
  pages.push(...gettingStartedPages);
  for (const items of Object.values(componentCategories)) {
    for (const item of items) {
      pages.push({ path: `/ui/${item}`, label: toPascalCase(item) });
    }
  }
  const hooks = [
    'use-custom-resource',
    'use-dynamic-virtual-list',
    'use-floating',
    'use-intl',
    'use-mutation',
    'use-toast',
    'use-virtual-list',
  ];
  for (const hook of hooks.sort()) {
    pages.push({ path: `/hooks/${hook}`, label: toCamelCase(hook) });
  }
  return pages;
};

const allPages = buildAllPages();

// Throttle helper for scroll performance
const throttle = <T extends (...args: unknown[]) => void>(fn: T, delay: number): T => {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
};

export interface RelatedItemDefinition {
  name: string;
  path: string;
  description: string;
}

export interface KeyConceptDefinition {
  term: string;
  explanation: string;
}

interface BaseDocPageProps {
  title: string;
  description: string;
  /** Which sections have content (used to filter TOC) */
  visibleSections: Set<SectionId>;
}

// Previous/Next navigation footer
function PrevNextFooter(): JSX.Element {
  const location = useLocation();

  const navigation = createMemo(() => {
    const currentPath = location.pathname.replace(/\/$/, '');
    const currentIndex = allPages.findIndex((page) => page.path === currentPath);
    if (currentIndex === -1) return { prev: null, next: null };
    return {
      prev: currentIndex > 0 ? allPages[currentIndex - 1] : null,
      next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
    };
  });

  return (
    <Show when={navigation().prev || navigation().next}>
      <footer class="mt-12 border-t border-gray-200 pt-6 dark:border-neutral-800">
        <nav class="flex items-center justify-between gap-4">
          <Show when={navigation().prev} fallback={<div />}>
            {(prev) => (
              <A
                href={prev().path}
                class="group flex flex-col items-start gap-1 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span class="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400">
                  <ChevronLeftIcon class="size-3" />
                  Previous
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {prev().label}
                </span>
              </A>
            )}
          </Show>
          <Show when={navigation().next} fallback={<div />}>
            {(next) => (
              <A
                href={next().path}
                class="group flex flex-col items-end gap-1 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span class="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400">
                  Next
                  <ChevronRightIcon class="size-3" />
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {next().label}
                </span>
              </A>
            )}
          </Show>
        </nav>
      </footer>
    </Show>
  );
}

export default function BaseDocPage(props: ParentProps<BaseDocPageProps>): JSX.Element {
  const [visibleSections, setVisibleSections] = createSignal<Set<string>>(new Set());
  const [elementCache, setElementCache] = createSignal<Map<string, HTMLElement>>(
    new Map(),
  );

  // Initialize from hash on mount (SSR-safe)
  onMount(() => {
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      setVisibleSections(new Set([initialHash]));
      // Scroll to the anchor after content has rendered
      requestAnimationFrame(() => {
        document.getElementById(initialHash)?.scrollIntoView({ behavior: 'instant' });
      });
    }
  });

  // Filter sections to only show those with content
  const visibleSectionsConfig = createMemo(() => {
    return SECTIONS.filter((section) => props.visibleSections.has(section.id));
  });

  // Cache element references
  createEffect(() => {
    const sections = visibleSectionsConfig();
    const cache = new Map<string, HTMLElement>();

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) cache.set(section.id, el);
    }

    setElementCache(cache);
  });

  // Optimized scroll handler with throttling
  createEffect(() => {
    const cache = elementCache();
    if (cache.size === 0) return;

    const sections = visibleSectionsConfig();
    const allIds = sections.map((s) => s.id);

    const handleScroll = throttle(() => {
      const newVisibleSections = new Set<string>();
      const headerOffset = 56;

      for (const id of allIds) {
        const element = cache.get(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top - headerOffset;
        const elementBottom = rect.bottom;

        const isVisible = elementBottom > headerOffset && elementTop < window.innerHeight;

        if (isVisible) {
          newVisibleSections.add(id);
        }
      }

      const currentVisible = untrack(visibleSections);
      const hasChanged =
        newVisibleSections.size !== currentVisible.size ||
        [...newVisibleSections].some((id) => !currentVisible.has(id));

      if (hasChanged) {
        setVisibleSections(newVisibleSections);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  return (
    <div class="grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-6xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
      {/* Main content */}
      <div class="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
        <div class="mb-8">
          <h1 class="text-4xl font-medium">{props.title}</h1>
        </div>

        <p class="mb-10 text-base leading-relaxed text-gray-600 dark:text-neutral-400">
          {props.description}
        </p>

        {/* Type-specific content rendered via children */}
        {props.children}

        {/* Previous/Next navigation footer */}
        <PrevNextFooter />
      </div>

      {/* Table of contents sidebar */}
      <div class="max-xl:hidden">
        <div class="sticky top-16 max-h-[calc(100svh-4rem)] overflow-y-auto px-4 pt-10 pb-8">
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              On this page
            </h3>
            <ul class="flex flex-col gap-2 text-xs">
              <For each={visibleSectionsConfig()}>
                {(section) => (
                  <li>
                    <a
                      aria-current={
                        visibleSections().has(section.id) ? 'location' : undefined
                      }
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        history.replaceState(null, '', `#${section.id}`);
                      }}
                      class="text-gray-500 transition-colors hover:text-gray-900 aria-[current]:font-medium aria-[current]:text-gray-900 dark:text-neutral-400 dark:hover:text-white dark:aria-[current]:text-white"
                    >
                      {section.title}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
