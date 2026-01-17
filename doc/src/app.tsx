import {
  type Component,
  For,
  type JSX,
  Show,
  Suspense,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';

import { A, useLocation } from '@solidjs/router';
import routes from '~solid-pages';

import { ToastProvider } from '@lib/context/ToastContext';
import { MoonIcon, SunIcon } from '../icons';

interface Route {
  path: string;
  children?: Route[];
}

// Component categories for grouping in sidebar
const componentCategories: Record<string, string[]> = {
  Form: [
    'button',
    'checkbox',
    'date-picker',
    'label',
    'helper-text',
    'number-input',
    'select',
    'select-with-search',
    'multi-select',
    'text-input',
    'textarea',
    'toggle-switch',
    'upload-file',
  ],
  Layout: ['accordion', 'drawer', 'modal', 'pagination', 'popover', 'sidebar', 'tooltip'],
  Feedback: ['alert', 'badge', 'skeleton', 'spinner'],
  Navigation: ['breadcrumb'],
  'Data Display': ['virtual-list', 'virtual-grid', 'dynamic-virtual-list'],
  Charts: ['line-chart', 'pie-chart', 'responsive-container'],
};

// Chevron icon for collapsible sections
const ChevronIcon = (props: { expanded: boolean; class?: string }) => (
  <svg
    class={`size-4 transition-transform ${props.expanded ? 'rotate-90' : ''} ${props.class ?? ''}`}
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
      clip-rule="evenodd"
    />
  </svg>
);

const App: Component<{ children: JSX.Element }> = (props): JSX.Element => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [expandedSections, setExpandedSections] = createSignal<Set<string>>(
    new Set(['components', 'hooks', 'contexts']),
  );
  const [expandedCategories, setExpandedCategories] = createSignal<Set<string>>(
    new Set(Object.keys(componentCategories)),
  );

  // Initialize dark mode from localStorage or system preference
  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDarkMode(stored === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  });

  // Apply dark mode class to document
  createEffect(() => {
    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode());

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Filter out the catch-all route and format the routes
  const filteredRoutes = createMemo(() => {
    return routes.filter((route) => route.path !== '*' && route.path !== '/');
  });

  const formatPath = (path: string): string =>
    path
      .split('/')
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Home';

  // Get current path segments for breadcrumbs
  const breadcrumbs = createMemo(() => {
    const path = location.pathname;
    if (path === '/') return [];

    const segments = path.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      name: formatPath(segment),
      path: '/' + segments.slice(0, index + 1).join('/'),
      isLast: index === segments.length - 1,
    }));
  });

  // Check if a path is currently active
  const isActivePath = (path: string): boolean => {
    return location.pathname === path || location.pathname === path + '/';
  };

  // Check if any child in a category is active
  const isCategoryActive = (categoryItems: string[], parentPath: string): boolean => {
    return categoryItems.some((item) => isActivePath(`${parentPath}/${item}`));
  };

  // Group components by category
  const groupComponentsByCategory = (children: Route[]) => {
    const grouped: Record<string, Route[]> = {};
    const uncategorized: Route[] = [];

    for (const child of children) {
      let found = false;
      for (const [category, items] of Object.entries(componentCategories)) {
        if (items.includes(child.path)) {
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(child);
          found = true;
          break;
        }
      }
      if (!found) {
        uncategorized.push(child);
      }
    }

    // Sort items within each category
    for (const category of Object.keys(grouped)) {
      grouped[category].sort((a, b) => a.path.localeCompare(b.path));
    }
    uncategorized.sort((a, b) => a.path.localeCompare(b.path));

    return { grouped, uncategorized };
  };

  const renderLink = (route: Route, parentPath: string): JSX.Element => {
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
    return (
      <li class="-ml-px flex flex-col items-start gap-2">
        <A
          href={fullPath}
          aria-current={isActivePath(fullPath) ? 'page' : undefined}
          onClick={() => setIsMobileMenuOpen(false)}
          class="inline-block border-l border-transparent pl-5 text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 sm:pl-4 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white dark:aria-[current]:border-white dark:aria-[current]:text-white"
        >
          {formatPath(route.path)}
        </A>
      </li>
    );
  };

  const renderRoute = (route: Route, parentPath: string = ''): JSX.Element => {
    const hasChildren = route.children && route.children.length > 0;
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
    const sectionKey = route.path.toLowerCase();
    const isExpanded = () => expandedSections().has(sectionKey);
    const isComponentsSection = sectionKey === 'components';

    return (
      <Show when={hasChildren} fallback={renderLink(route, parentPath)}>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleSection(sectionKey)}
            class="flex w-full items-center gap-2 font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase hover:text-gray-700 sm:text-xs/6 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronIcon expanded={isExpanded()} />
            {formatPath(route.path)}
          </button>
          <Show when={isExpanded()}>
            <Show
              when={isComponentsSection}
              fallback={
                <ul class="flex flex-col gap-2 border-l border-[color-mix(in_oklab,_var(--color-gray-950),white_90%)] dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
                  <For
                    each={route.children
                      ?.slice()
                      .sort((a, b) => a.path.localeCompare(b.path))}
                  >
                    {(child) => renderLink(child, fullPath)}
                  </For>
                </ul>
              }
            >
              {/* Components section with categories */}
              <div class="flex flex-col gap-3 pl-2">
                <For
                  each={Object.entries(
                    groupComponentsByCategory(route.children ?? []).grouped,
                  )}
                >
                  {([category, items]) => {
                    const isCatExpanded = () => expandedCategories().has(category);
                    const categoryItems = componentCategories[category] ?? [];
                    return (
                      <div class="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => toggleCategory(category)}
                          class={`flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase ${
                            isCategoryActive(categoryItems, fullPath)
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          <ChevronIcon expanded={isCatExpanded()} class="size-3" />
                          {category}
                        </button>
                        <Show when={isCatExpanded()}>
                          <ul class="flex flex-col gap-1 border-l border-[color-mix(in_oklab,_var(--color-gray-950),white_90%)] dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
                            <For each={items}>
                              {(child) => renderLink(child, fullPath)}
                            </For>
                          </ul>
                        </Show>
                      </div>
                    );
                  }}
                </For>
                <Show
                  when={
                    groupComponentsByCategory(route.children ?? []).uncategorized.length >
                    0
                  }
                >
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Other
                    </span>
                    <ul class="flex flex-col gap-1 border-l border-[color-mix(in_oklab,_var(--color-gray-950),white_90%)] dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
                      <For
                        each={
                          groupComponentsByCategory(route.children ?? []).uncategorized
                        }
                      >
                        {(child) => renderLink(child, fullPath)}
                      </For>
                    </ul>
                  </div>
                </Show>
              </div>
            </Show>
          </Show>
        </div>
      </Show>
    );
  };

  return (
    <ToastProvider methods={{}}>
      <div>
        <div class="fixed inset-x-0 top-0 z-10 border-b border-gray-950/5 dark:border-white/10">
          <div class="bg-white dark:bg-gray-950">
            <div class="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
              <A href="/" class="text-lg font-semibold text-gray-950 dark:text-white">
                Components
              </A>
              <button
                type="button"
                onClick={toggleDarkMode}
                class="inline-grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                aria-label={isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <Show when={isDarkMode()} fallback={<MoonIcon class="size-5" />}>
                  <SunIcon class="size-5" />
                </Show>
              </button>
            </div>
          </div>
          <div class="flex h-14 items-center border-t border-gray-950/5 bg-white px-4 sm:px-6 lg:hidden dark:border-white/10 dark:bg-gray-950">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
              class="relative -ml-1.5 inline-grid size-7 place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
              aria-label={
                isMobileMenuOpen() ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={isMobileMenuOpen()}
            >
              <span class="absolute top-1/2 left-1/2 size-11 -translate-1/2 pointer-fine:hidden" />
              <Show
                when={isMobileMenuOpen()}
                fallback={
                  <svg viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path
                      fill-rule="evenodd"
                      d="M2 4.75A.75.75 0 0 1 2.75 4h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 6.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                }
              >
                <svg viewBox="0 0 16 16" fill="currentColor" class="size-4">
                  <path
                    fill-rule="evenodd"
                    d="M4.28 3.22a.75.75 0 0 0-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06L8 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L9.06 8l3.72-3.72a.75.75 0 0 0-1.06-1.06L8 6.94 4.28 3.22Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Show>
            </button>
            <ol class="sticky ml-4 flex min-w-0 items-center gap-2 text-sm/6 whitespace-nowrap">
              <Show
                when={breadcrumbs().length > 0}
                fallback={<li class="truncate text-gray-950 dark:text-white">Home</li>}
              >
                <For each={breadcrumbs()}>
                  {(crumb) => (
                    <li class="flex items-center gap-2">
                      <Show
                        when={crumb.isLast}
                        fallback={
                          <>
                            <A
                              href={crumb.path}
                              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              {crumb.name}
                            </A>
                            <svg
                              viewBox="0 0 16 16"
                              class="size-4 fill-gray-950 dark:fill-gray-500"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </>
                        }
                      >
                        <span class="truncate text-gray-950 dark:text-white">
                          {crumb.name}
                        </span>
                      </Show>
                    </li>
                  )}
                </For>
              </Show>
            </ol>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <Show when={isMobileMenuOpen()}>
          <div class="fixed inset-0 z-20 lg:hidden">
            {/* Backdrop */}
            <div
              class="fixed inset-0 bg-gray-950/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div class="fixed inset-y-0 left-0 w-72 overflow-y-auto bg-white p-6 dark:bg-gray-950">
              <nav class="flex flex-col gap-8">
                <For each={filteredRoutes()}>
                  {(route) => renderRoute(route as Route)}
                </For>
              </nav>
            </div>
          </div>
        </Show>

        <div class="grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] pt-26.25 lg:grid-cols-[var(--container-2xs)_2.5rem_minmax(0,1fr)_2.5rem] lg:pt-14.25 xl:grid-cols-[var(--container-2xs)_2.5rem_minmax(0,1fr)_2.5rem]">
          <div class="relative col-start-1 row-span-full row-start-1 max-lg:hidden">
            <div class="absolute inset-0">
              <div class="sticky top-14.25 bottom-0 left-0 h-full max-h-[calc(100dvh-(var(--spacing)*14.25))] w-2xs overflow-y-auto p-6">
                <div>
                  <nav class="flex flex-col gap-8">
                    <For each={filteredRoutes()}>
                      {(route) => renderRoute(route as Route)}
                    </For>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div class="col-start-2 row-span-5 row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 max-lg:hidden dark:[--pattern-fg:var(--color-white)]/10" />

          {/* Main content wrapper */}
          <div class="relative row-start-1 grid grid-cols-subgrid lg:col-start-3">
            <Suspense>{props.children}</Suspense>
          </div>
          <div class="col-start-4 row-span-5 row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 max-lg:hidden dark:[--pattern-fg:var(--color-white)]/10" />
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;
