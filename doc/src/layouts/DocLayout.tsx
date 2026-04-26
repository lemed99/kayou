import {
  type Component,
  For,
  type JSX,
  Show,
  Suspense,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';

import { ChevronRightIcon, Menu01Icon } from '@kayou/icons';
import { A, useLocation } from '@solidjs/router';

interface Route {
  path: string;
  children?: Route[];
}

// Getting Started pages
const gettingStartedPages = [
  { path: '/overview/quickstart', label: 'Introduction' },
  { path: '/overview/contributing', label: 'Contributing' },
  { path: '/overview/license', label: 'License' },
];

// Hooks package: utility hooks
const hooksPackageHooks = [
  'use-custom-resource',
  'use-dynamic-virtual-list',
  'use-floating',
  'use-form',
  'use-intl',
  'use-mutation',
  'use-shortcut',
  'use-theme',
  'use-toast',
  'use-virtual-list',
];

// Component categories for grouping in sidebar
const componentCategories: Record<string, string[]> = {
  Form: [
    'action-text-input',
    'button',
    'checkbox',
    'date-picker',
    'form',
    'helper-text',
    'label',
    'multi-select',
    'number-input',
    'otp-input',
    'password',
    'rich-text-editor',
    'select',
    'select-with-search',
    'tag-input',
    'text-input',
    'textarea',
    'time-picker',
    'toggle-switch',
    'upload-file',
  ],
  Layout: [
    'accordion',
    'drawer',
    'modal',
    'popover',
    'shortcut-panel',
    'sidebar',
    'tabs',
  ],
  Feedback: ['alert', 'badge', 'skeleton', 'spinner', 'tooltip'],
  Navigation: ['breadcrumb', 'pagination'],
  'Data Display': ['data-table', 'dynamic-virtual-list', 'virtual-grid', 'virtual-list'],
  Charts: ['area-chart', 'bar-chart', 'line-chart', 'pie-chart', 'responsive-container'],
};

// Static routes data (replaces ~solid-pages virtual module)
const routes: Route[] = [
  {
    path: 'components',
    children: Object.values(componentCategories)
      .flat()
      .map((path) => ({ path })),
  },
  {
    path: 'hooks',
    children: hooksPackageHooks.map((path) => ({ path })),
  },
];

// Chevron icon for collapsible sections
const ChevronIcon = (props: { expanded: boolean; class?: string }) => (
  <ChevronRightIcon
    class={`size-4 text-neutral-400 transition-transform duration-200 ${props.expanded ? 'rotate-90' : ''} ${props.class ?? ''}`}
  />
);

// Find which category contains a component path
const findCategoryForComponent = (componentPath: string): string | null => {
  for (const [category, items] of Object.entries(componentCategories)) {
    if (items.includes(componentPath)) {
      return category;
    }
  }
  return null;
};

// Derive section from path
const getSectionFromPath = (path: string): string | null => {
  if (path.startsWith('/overview')) return 'getting-started';
  if (path.startsWith('/components')) return 'components';
  if (path.startsWith('/hooks')) return 'hooks';
  return null;
};

// Derive category from path
const getCategoryFromPath = (path: string): string | null => {
  if (!path.startsWith('/components/')) return null;
  const componentPath = path.replace('/components/', '').replace(/\/$/, '');
  return findCategoryForComponent(componentPath);
};

const DocLayout: Component<{ children: JSX.Element }> = (props): JSX.Element => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);

  // Track manually opened and closed sections/categories
  const [openedSections, setOpenedSections] = createSignal<Set<string>>(new Set());
  const [closedSections, setClosedSections] = createSignal<Set<string>>(new Set());
  const [openedCategories, setOpenedCategories] = createSignal<Set<string>>(new Set());
  const [closedCategories, setClosedCategories] = createSignal<Set<string>>(new Set());

  // Mark as mounted after hydration completes
  onMount(() => setMounted(true));

  // Derive active section/category from current path using memos for reactivity
  const activeSection = createMemo(() => {
    if (!mounted()) return null;
    return getSectionFromPath(location.pathname);
  });

  const activeCategory = createMemo(() => {
    if (!mounted()) return null;
    return getCategoryFromPath(location.pathname);
  });

  // Check if a section should be expanded: (active AND NOT closed) OR manually opened
  const isSectionExpanded = (sectionKey: string) => {
    const isActive = activeSection() === sectionKey;
    const isClosed = closedSections().has(sectionKey);
    const isOpened = openedSections().has(sectionKey);
    return (isActive && !isClosed) || isOpened;
  };

  // Check if a category should be expanded: (active AND NOT closed) OR manually opened
  const isCategoryExpanded = (category: string) => {
    const isActive = activeCategory() === category;
    const isClosed = closedCategories().has(category);
    const isOpened = openedCategories().has(category);
    return (isActive && !isClosed) || isOpened;
  };

  // Toggle section: if expanded -> close, if collapsed -> open
  const toggleSection = (sectionKey: string) => {
    if (isSectionExpanded(sectionKey)) {
      // Close it
      setClosedSections((prev) => new Set(prev).add(sectionKey));
      setOpenedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionKey);
        return next;
      });
    } else {
      // Open it
      setOpenedSections((prev) => new Set(prev).add(sectionKey));
      setClosedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionKey);
        return next;
      });
    }
  };

  // Toggle category: if expanded -> close, if collapsed -> open
  const toggleCategory = (category: string) => {
    if (isCategoryExpanded(category)) {
      // Close it
      setClosedCategories((prev) => new Set(prev).add(category));
      setOpenedCategories((prev) => {
        const next = new Set(prev);
        next.delete(category);
        return next;
      });
    } else {
      // Open it
      setOpenedCategories((prev) => new Set(prev).add(category));
      setClosedCategories((prev) => {
        const next = new Set(prev);
        next.delete(category);
        return next;
      });
    }
  };

  const excludedPaths = new Set(['*', '/', 'overview', 'docs']);
  const filteredRoutes = createMemo(() => {
    return routes.filter((route) => route.path && !excludedPaths.has(route.path));
  });

  // Convert kebab-case to PascalCase for components (e.g., "data-table" → "DataTable")
  const formatComponentPath = (path: string): string => {
    const name = path.split('/').pop() || '';
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  // Convert kebab-case to camelCase for hooks (e.g., "use-custom-resource" → "useCustomResource")
  const formatHookPath = (path: string): string => {
    const name = path.split('/').pop() || '';
    return name
      .split('-')
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join('');
  };

  const isActivePath = (path: string): boolean => {
    return location.pathname === path || location.pathname === path + '/';
  };

  const groupComponentsByCategory = (children: Route[]) => {
    const grouped: Record<string, Route[]> = {};

    for (const child of children) {
      for (const [category, items] of Object.entries(componentCategories)) {
        if (items.includes(child.path)) {
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(child);
          break;
        }
      }
    }

    for (const category of Object.keys(grouped)) {
      grouped[category].sort((a, b) => a.path.localeCompare(b.path));
    }

    return grouped;
  };

  // Get routes by path
  const getRoute = (path: string) => filteredRoutes().find((r) => r.path === path);

  // --- Shared link rendering ---
  const renderLink = (path: string, label: string): JSX.Element => {
    // Use getter function to keep reactivity
    const active = () => isActivePath(path);
    return (
      <li>
        <A
          href={path}
          onClick={() => setIsMobileMenuOpen(false)}
          class={`block py-1.5 text-sm transition-colors ${
            active()
              ? 'font-medium text-neutral-900 dark:text-white'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
          }`}
        >
          {label}
        </A>
      </li>
    );
  };

  // Render a collapsible section with toggle support
  const renderSection = (
    title: string,
    sectionKey: string,
    children: JSX.Element,
  ): JSX.Element => {
    const isExpanded = () => isSectionExpanded(sectionKey);

    return (
      <div class="mb-4">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          aria-expanded={isExpanded()}
          class="flex w-full cursor-pointer items-center gap-1 py-1 text-sm font-semibold text-neutral-900 hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
        >
          <ChevronIcon expanded={isExpanded()} />
          {title}
        </button>
        <div class={`mt-1 ml-2 ${isExpanded() ? '' : 'hidden'}`}>{children}</div>
      </div>
    );
  };

  // Render Components section with categories and toggle support
  const renderComponents = (route: Route): JSX.Element => {
    const fullPath = `/${route.path}`;
    const grouped = groupComponentsByCategory(route.children ?? []);

    return renderSection(
      'Components',
      'components',
      <div class="space-y-3 pl-3">
        <For each={Object.entries(grouped)}>
          {([category, items]) => {
            const isCatExpanded = () => isCategoryExpanded(category);

            return (
              <div>
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-expanded={isCatExpanded()}
                  class={`flex w-full cursor-pointer items-center gap-1 py-1 text-xs font-semibold tracking-wider uppercase ${
                    isCatExpanded()
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <ChevronIcon expanded={isCatExpanded()} class="size-3" />
                  {category}
                </button>
                <ul class={`mt-1 space-y-0.5 pl-4 ${isCatExpanded() ? '' : 'hidden'}`}>
                  <For each={items}>
                    {(item) =>
                      renderLink(
                        `${fullPath}/${item.path}`,
                        formatComponentPath(item.path),
                      )
                    }
                  </For>
                </ul>
              </div>
            );
          }}
        </For>
      </div>,
    );
  };

  // Render Hooks section
  const renderHooks = (route: Route): JSX.Element => {
    const fullPath = `/${route.path}`;
    const sortedChildren = [...(route.children ?? [])]
      .filter((child) => hooksPackageHooks.includes(child.path))
      .sort((a, b) => a.path.localeCompare(b.path));

    return renderSection(
      'Hooks',
      'hooks',
      <ul class="space-y-0.5 pl-3">
        <For each={sortedChildren}>
          {(child) => renderLink(`${fullPath}/${child.path}`, formatHookPath(child.path))}
        </For>
      </ul>,
    );
  };

  // --- Unified sidebar content ---
  // Only render content after mount to avoid hydration mismatches with location-dependent state
  const SidebarContent = () => (
    <nav class="space-y-1">
      <Show when={mounted()}>
        {renderSection(
          'Getting Started',
          'getting-started',
          <ul class="space-y-0.5 pl-3">
            <For each={gettingStartedPages}>
              {(page) => renderLink(page.path, page.label)}
            </For>
          </ul>,
        )}
        <Show when={getRoute('components')}>{(route) => renderComponents(route())}</Show>
        <Show when={getRoute('hooks')}>{(route) => renderHooks(route())}</Show>
      </Show>
    </nav>
  );

  return (
    <div class="mx-auto max-w-360">
      {/* Mobile menu button */}
      <div class="sticky top-16 z-20 flex h-12 items-center border-b border-neutral-200 bg-white/95 px-4 backdrop-blur-sm lg:hidden dark:border-neutral-800 dark:bg-neutral-900/95">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen()}
          class="flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          <Menu01Icon class="size-5" />
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      <Show when={isMobileMenuOpen()}>
        <div class="fixed inset-x-0 top-16 bottom-0 z-30 lg:hidden">
          <div
            class="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div class="absolute inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-white p-6 shadow-xl dark:bg-neutral-900">
            <SidebarContent />
          </div>
        </div>
      </Show>

      <div class="flex">
        {/* Sidebar */}
        <aside class="hidden shrink-0 lg:block lg:w-60">
          <div class="sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-8">
            <SidebarContent />
          </div>
        </aside>

        {/* Main content */}
        <main class="w-full min-w-0">
          <Suspense>{props.children}</Suspense>
        </main>
      </div>
    </div>
  );
};

export default DocLayout;
