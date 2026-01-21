import {
  For,
  type JSX,
  type ParentProps,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from 'solid-js';

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

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticlePageProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    icon?: JSX.Element;
    color?: 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'gray';
  };
}

export default function ArticlePage(props: ParentProps<ArticlePageProps>): JSX.Element {
  const [tocItems, setTocItems] = createSignal<TocItem[]>([]);
  const [visibleSections, setVisibleSections] = createSignal<Set<string>>(new Set());
  let contentRef: HTMLDivElement | undefined;

  // Badge color classes
  const badgeColorClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  };

  // Extract headings from content and build TOC
  onMount(() => {
    if (!contentRef) return;

    const headings = contentRef.querySelectorAll('h2, h3');
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      // Generate ID if not present
      if (!heading.id) {
        heading.id = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || '';
      }

      // Add scroll-mt class for header offset
      heading.classList.add('scroll-mt-20');

      items.push({
        id: heading.id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });

    setTocItems(items);

    // Initialize from hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      setVisibleSections(new Set([initialHash]));
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
    <div class="grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-6xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
      {/* Main content */}
      <div ref={contentRef} class="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
        {/* Header with optional badge */}
        <div class="mb-12">
          {props.badge && (
            <div
              class={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${badgeColorClasses[props.badge.color || 'blue']}`}
            >
              {props.badge.icon}
              {props.badge.text}
            </div>
          )}
          <h1 class="text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
            {props.title}
          </h1>
          {props.description && (
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {props.description}
            </p>
          )}
        </div>

        {/* Article content */}
        {props.children}
      </div>

      {/* Table of contents sidebar */}
      <div class="max-xl:hidden">
        <div class="sticky top-16 max-h-[calc(100svh-4rem)] overflow-y-auto px-4 pt-10 pb-8">
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">On this page</h3>
            <ul class="flex flex-col gap-2 text-sm">
              <For each={tocItems()}>
                {(item) => (
                  <li style={{ 'padding-left': item.level === 3 ? '0.75rem' : '0' }}>
                    <a
                      aria-current={visibleSections().has(item.id) ? 'location' : undefined}
                      href={`#${item.id}`}
                      class="text-gray-500 transition-colors hover:text-gray-900 aria-[current]:font-medium aria-[current]:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:aria-[current]:text-white"
                    >
                      {item.text}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </div>

          {/* Promo Card */}
          <div class="mt-8 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              Ship <span class="text-blue-600 dark:text-blue-400">faster</span> with
              beautiful components
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Discover 30+ stunning components by Solidly
            </p>
            <a
              href="/components/button"
              class="mt-3 inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Explore Components
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
