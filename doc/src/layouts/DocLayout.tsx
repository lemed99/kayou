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

import { A, useLocation } from '@solidjs/router';
import routes from '~solid-pages';

interface Route {
  path: string;
  children?: Route[];
}

// Getting Started pages
const gettingStartedPages = [
  { path: '/overview/quickstart', label: 'Introduction' },
  { path: '/overview/installation', label: 'Installation' },
  { path: '/overview/contributing', label: 'Contributing' },
  { path: '/overview/license', label: 'License' },
];

// Component categories for grouping in sidebar
const componentCategories: Record<string, string[]> = {
  Form: [
    'button',
    'checkbox',
    'date-picker',
    'label',
    'helper-text',
    'number-input',
    'password',
    'rich-text-editor',
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
  'Data Display': ['data-table', 'virtual-list', 'virtual-grid', 'dynamic-virtual-list'],
  Charts: ['area-chart', 'bar-chart', 'line-chart', 'pie-chart', 'responsive-container'],
};

// Chevron icon for collapsible sections
const ChevronIcon = (props: { expanded: boolean; class?: string }) => (
  <svg
    class={`size-4 text-gray-400 transition-transform duration-200 ${props.expanded ? 'rotate-90' : ''} ${props.class ?? ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clip-rule="evenodd"
    />
  </svg>
);

const SIDEBAR_SCROLL_KEY = 'doc-sidebar-scroll';

const DocLayout: Component<{ children: JSX.Element }> = (props): JSX.Element => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [expandedSections, setExpandedSections] = createSignal<Set<string>>(
    new Set(['getting-started', 'components', 'hooks', 'contexts']),
  );
  const [expandedCategories, setExpandedCategories] = createSignal<Set<string>>(
    new Set(Object.keys(componentCategories)),
  );

  // Sidebar scroll persistence
  let sidebarRef: HTMLDivElement | undefined;

  const saveSidebarScroll = () => {
    if (sidebarRef) {
      sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebarRef.scrollTop));
    }
  };

  const restoreSidebarScroll = () => {
    if (sidebarRef) {
      const savedScroll = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
      if (savedScroll) {
        sidebarRef.scrollTop = Number(savedScroll);
      }
    }
  };

  onMount(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      restoreSidebarScroll();
    });
  });

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

  const excludedPaths = new Set([
    '*',
    '/',
    'overview',
    'docs',
    'icons',
    'pricing',
    'pro',
  ]);
  const filteredRoutes = createMemo(() => {
    return routes.filter(
      (route) => route.path && !excludedPaths.has(route.path as string),
    );
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

  // Format context names in PascalCase with "Provider" suffix displayed
  const formatContextPath = (path: string): string => {
    const name = path.split('/').pop() || '';
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  const isActivePath = (path: string): boolean => {
    return location.pathname === path || location.pathname === path + '/';
  };

  const isCategoryActive = (categoryItems: string[], parentPath: string): boolean => {
    return categoryItems.some((item) => isActivePath(`${parentPath}/${item}`));
  };

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

    for (const category of Object.keys(grouped)) {
      grouped[category].sort((a, b) => a.path.localeCompare(b.path));
    }
    uncategorized.sort((a, b) => a.path.localeCompare(b.path));

    return { grouped, uncategorized };
  };

  // Render a sidebar link item with bullet dot
  const renderLink = (path: string, label: string): JSX.Element => {
    const active = isActivePath(path);
    return (
      <li>
        <A
          href={path}
          onClick={() => setIsMobileMenuOpen(false)}
          class={`group flex items-center gap-2 py-1.5 text-sm transition-colors ${
            active
              ? 'font-medium text-gray-900 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {label}
        </A>
      </li>
    );
  };

  // Render a collapsible section
  const renderSection = (
    title: string,
    sectionKey: string,
    children: JSX.Element,
  ): JSX.Element => {
    const isExpanded = () => expandedSections().has(sectionKey);

    return (
      <div class="mb-6">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          class="flex w-full items-center gap-1 py-1 text-sm font-semibold text-gray-900 dark:text-white"
        >
          <ChevronIcon expanded={isExpanded()} />
          {title}
        </button>
        <Show when={isExpanded()}>
          <div class="mt-2 ml-2">{children}</div>
        </Show>
      </div>
    );
  };

  // Render Getting Started section
  const renderGettingStarted = (): JSX.Element => {
    return renderSection(
      'Getting Started',
      'getting-started',
      <ul class="space-y-0.5 pl-3">
        <For each={gettingStartedPages}>
          {(page) => renderLink(page.path, page.label)}
        </For>
      </ul>,
    );
  };

  // Render Components section with categories
  const renderComponents = (route: Route): JSX.Element => {
    const fullPath = `/${route.path}`;
    const { grouped } = groupComponentsByCategory(route.children ?? []);

    return renderSection(
      'Components',
      'components',
      <div class="space-y-4 pl-3">
        <For each={Object.entries(grouped)}>
          {([category, items]) => {
            const isCatExpanded = () => expandedCategories().has(category);
            const categoryItems = componentCategories[category] ?? [];
            const hasActiveItem = isCategoryActive(categoryItems, fullPath);

            return (
              <div>
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  class={`flex w-full items-center gap-1 py-1 text-xs font-semibold tracking-wider uppercase ${
                    hasActiveItem
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <ChevronIcon expanded={isCatExpanded()} class="size-3" />
                  {category}
                </button>
                <Show when={isCatExpanded()}>
                  <ul class="mt-1 space-y-0.5 pl-4">
                    <For each={items}>
                      {(item) =>
                        renderLink(
                          `${fullPath}/${item.path}`,
                          formatComponentPath(item.path),
                        )
                      }
                    </For>
                  </ul>
                </Show>
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
    const sortedChildren = [...(route.children ?? [])].sort((a, b) =>
      a.path.localeCompare(b.path),
    );

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

  // Render Contexts section
  const renderContexts = (route: Route): JSX.Element => {
    const fullPath = `/${route.path}`;
    const sortedChildren = [...(route.children ?? [])].sort((a, b) =>
      a.path.localeCompare(b.path),
    );

    return renderSection(
      'Contexts',
      'contexts',
      <ul class="space-y-0.5 pl-3">
        <For each={sortedChildren}>
          {(child) =>
            renderLink(`${fullPath}/${child.path}`, formatContextPath(child.path))
          }
        </For>
      </ul>,
    );
  };

  // Sidebar content
  const SidebarContent = () => (
    <nav>
      {renderGettingStarted()}
      <For each={filteredRoutes()}>
        {(route) => {
          const r = route as Route;
          if (r.path === 'components') return renderComponents(r);
          if (r.path === 'hooks') return renderHooks(r);
          if (r.path === 'contexts') return renderContexts(r);
          return null;
        }}
      </For>
    </nav>
  );

  return (
    <div class="mx-auto max-w-[90rem]">
      {/* Mobile menu button */}
      <div class="fixed top-[104px] right-0 left-0 z-20 flex h-12 items-center border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm lg:hidden dark:border-gray-800 dark:bg-gray-900/95">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
          class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path
              fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
              clip-rule="evenodd"
            />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      <Show when={isMobileMenuOpen()}>
        <div class="fixed inset-0 z-30 lg:hidden" style={{ top: '152px' }}>
          <div
            class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div class="fixed inset-y-0 left-0 w-72 overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-900">
            <SidebarContent />
          </div>
        </div>
      </Show>

      <div class="flex">
        {/* Desktop sidebar - Left navigation */}
        <aside class="hidden shrink-0 lg:block lg:w-64">
          <div
            ref={sidebarRef}
            onScroll={saveSidebarScroll}
            class="sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-8"
          >
            <SidebarContent />
          </div>
        </aside>

        {/* Main content - DocPage handles its own layout including right TOC */}
        <main class="min-w-0 flex-1 pt-12 lg:pt-0">
          <Suspense>{props.children}</Suspense>
        </main>
      </div>
    </div>
  );
};

export default DocLayout;
