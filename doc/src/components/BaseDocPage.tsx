import {
    For,
    type JSX,
    type ParentProps,
    Show,
    createEffect,
    createSignal,
    onCleanup,
    onMount,
    untrack,
} from 'solid-js';

import { ChevronLeftIcon, ChevronRightIcon } from '@kayou/icons';
import { A, useLocation } from '@solidjs/router';

export interface RelatedItemDefinition {
  name: string;
  path: string;
  description: string;
}

export interface KeyConceptDefinition {
  term: string;
  explanation: string;
}

interface TocItem {
  id: string;
  text: string;
}

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

interface BaseDocPageProps {
  title: string;
  description: string;
}

// Previous/Next navigation footer
function PrevNextFooter(): JSX.Element {
  const location = useLocation();

  const navigation = () => {
    const currentPath = location.pathname.replace(/\/$/, '');
    const currentIndex = allPages.findIndex((page) => page.path === currentPath);
    if (currentIndex === -1) return { prev: null, next: null };
    return {
      prev: currentIndex > 0 ? allPages[currentIndex - 1] : null,
      next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
    };
  };

  return (
    <Show when={navigation().prev || navigation().next}>
      <footer class="mt-12 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <nav class="flex items-center justify-between gap-4">
          <Show when={navigation().prev} fallback={<div />}>
            {(prev) => (
              <A
                href={prev().path}
                class="group flex flex-col items-start gap-1 rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span class="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <ChevronLeftIcon class="size-3" />
                  Previous
                </span>
                <span class="text-sm font-medium text-neutral-900 dark:text-white">
                  {prev().label}
                </span>
              </A>
            )}
          </Show>
          <Show when={navigation().next} fallback={<div />}>
            {(next) => (
              <A
                href={next().path}
                class="group flex flex-col items-end gap-1 rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span class="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Next
                  <ChevronRightIcon class="size-3" />
                </span>
                <span class="text-sm font-medium text-neutral-900 dark:text-white">
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
  const [tocItems, setTocItems] = createSignal<TocItem[]>([]);
  const [visibleSections, setVisibleSections] = createSignal<Set<string>>(new Set());
  let contentRef: HTMLDivElement | undefined;

  // Extract headings from content and build TOC
  onMount(() => {
    if (!contentRef) return;

    const headings = contentRef.querySelectorAll('h2');
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      // Extract only direct text nodes (ignore child elements like badge spans)
      const text = Array.from(heading.childNodes)
        .filter((node) => node.nodeType === 3)
        .map((node) => node.textContent?.trim())
        .filter(Boolean)
        .join(' ');

      if (!heading.id) {
        heading.id =
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || '';
      }

      heading.classList.add('scroll-mt-20');

      items.push({
        id: heading.id,
        text: text || heading.textContent || '',
      });
    });

    setTocItems(items);

    // Initialize from hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      setVisibleSections(new Set([initialHash]));
      requestAnimationFrame(() => {
        document.getElementById(initialHash)?.scrollIntoView({ behavior: 'instant' });
      });
    }
  });

  // Scroll tracking for TOC highlighting
  createEffect(() => {
    const items = tocItems();
    if (items.length === 0) return;

    const handleScroll = throttle(() => {
      const newVisibleSections = new Set<string>();
      const headerOffset = 80;

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top - headerOffset;
        const elementBottom = rect.bottom;

        const isVisible = elementBottom > headerOffset && elementTop < window.innerHeight;

        if (isVisible) {
          newVisibleSections.add(item.id);
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
    <div class="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_200px]">
      {/* Main content */}
      <div ref={contentRef} class="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
        <div class="mb-8">
          <h1 class="text-4xl font-medium">{props.title}</h1>
        </div>

        <p class="mb-10 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {props.description}
        </p>

        {/* Content rendered via children */}
        {props.children}

        {/* Previous/Next navigation footer */}
        <PrevNextFooter />
      </div>

      {/* Table of contents sidebar */}
      <div class="max-xl:hidden">
        <div class="sticky top-16 max-h-[calc(100svh-4rem)] overflow-y-auto px-4 pt-10 pb-8">
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-medium text-neutral-900 dark:text-white">
              On this page
            </h3>
            <ul class="flex flex-col gap-2 text-xs">
              <For each={tocItems()}>
                {(item) => (
                  <li>
                    <a
                      aria-current={
                        visibleSections().has(item.id) ? 'location' : undefined
                      }
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        history.replaceState(null, '', `#${item.id}`);
                      }}
                      class="text-neutral-500 transition-colors hover:text-neutral-900 aria-[current]:font-medium aria-[current]:text-neutral-900 dark:text-neutral-400 dark:hover:text-white dark:aria-[current]:text-white"
                    >
                      {item.text}
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
