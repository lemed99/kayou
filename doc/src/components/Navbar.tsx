import {
  type Component,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import { Diamond01Icon } from '@exowpee/solidly/icons';
import { A, useLocation, useNavigate } from '@solidjs/router';

// Icons
const SearchIcon = () => (
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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    class="size-5"
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
);

const SunIcon = () => (
  <svg
    class="size-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const GitHubIcon = () => (
  <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clip-rule="evenodd"
    />
  </svg>
);

// Search index data
interface SearchItem {
  path: string;
  label: string;
  category: string;
  keywords?: string[];
  isPro?: boolean;
}

const searchIndex: SearchItem[] = [
  // Getting Started
  {
    path: '/overview/quickstart',
    label: 'Introduction',
    category: 'Getting Started',
    keywords: ['start', 'begin', 'intro'],
  },
  {
    path: '/overview/installation',
    label: 'Installation',
    category: 'Getting Started',
    keywords: ['install', 'setup', 'npm', 'pnpm'],
  },
  {
    path: '/overview/why-solidjs',
    label: 'Why SolidJS?',
    category: 'Getting Started',
    keywords: ['solid', 'framework'],
  },
  {
    path: '/overview/why-solidly',
    label: 'Why Solidly?',
    category: 'Getting Started',
    keywords: ['library', 'components'],
  },
  {
    path: '/overview/contributing',
    label: 'Contributing',
    category: 'Getting Started',
    keywords: ['contribute', 'help'],
  },
  {
    path: '/overview/license',
    label: 'License',
    category: 'Getting Started',
    keywords: ['mit', 'open source'],
  },

  // Form Components
  {
    path: '/components/button',
    label: 'Button',
    category: 'Components',
    keywords: ['click', 'action', 'submit'],
  },
  {
    path: '/components/checkbox',
    label: 'Checkbox',
    category: 'Components',
    keywords: ['check', 'toggle', 'select'],
  },
  {
    path: '/components/date-picker',
    label: 'DatePicker',
    category: 'Components',
    keywords: ['date', 'calendar', 'time'],
    isPro: true,
  },
  {
    path: '/components/label',
    label: 'Label',
    category: 'Components',
    keywords: ['text', 'form'],
  },
  {
    path: '/components/helper-text',
    label: 'HelperText',
    category: 'Components',
    keywords: ['help', 'hint', 'description'],
  },
  {
    path: '/components/number-input',
    label: 'NumberInput',
    category: 'Components',
    keywords: ['number', 'input', 'numeric'],
    isPro: true,
  },
  {
    path: '/components/select',
    label: 'Select',
    category: 'Components',
    keywords: ['dropdown', 'choose', 'option'],
  },
  {
    path: '/components/select-with-search',
    label: 'SelectWithSearch',
    category: 'Components',
    keywords: ['dropdown', 'search', 'filter'],
    isPro: true,
  },
  {
    path: '/components/multi-select',
    label: 'MultiSelect',
    category: 'Components',
    keywords: ['multiple', 'tags', 'select'],
    isPro: true,
  },
  {
    path: '/components/text-input',
    label: 'TextInput',
    category: 'Components',
    keywords: ['text', 'input', 'field'],
  },
  {
    path: '/components/textarea',
    label: 'Textarea',
    category: 'Components',
    keywords: ['text', 'multiline', 'input'],
  },
  {
    path: '/components/toggle-switch',
    label: 'ToggleSwitch',
    category: 'Components',
    keywords: ['toggle', 'switch', 'on', 'off'],
  },
  {
    path: '/components/upload-file',
    label: 'UploadFile',
    category: 'Components',
    keywords: ['upload', 'file', 'drag', 'drop'],
    isPro: true,
  },

  // Layout Components
  {
    path: '/components/accordion',
    label: 'Accordion',
    category: 'Components',
    keywords: ['collapse', 'expand', 'panel'],
  },
  {
    path: '/components/drawer',
    label: 'Drawer',
    category: 'Components',
    keywords: ['sidebar', 'slide', 'panel'],
  },
  {
    path: '/components/modal',
    label: 'Modal',
    category: 'Components',
    keywords: ['dialog', 'popup', 'overlay'],
  },
  {
    path: '/components/pagination',
    label: 'Pagination',
    category: 'Components',
    keywords: ['page', 'navigate', 'list'],
  },
  {
    path: '/components/popover',
    label: 'Popover',
    category: 'Components',
    keywords: ['popup', 'tooltip', 'hover'],
  },
  {
    path: '/components/sidebar',
    label: 'Sidebar',
    category: 'Components',
    keywords: ['navigation', 'menu', 'side'],
    isPro: true,
  },
  {
    path: '/components/tooltip',
    label: 'Tooltip',
    category: 'Components',
    keywords: ['hint', 'hover', 'info'],
  },

  // Feedback Components
  {
    path: '/components/alert',
    label: 'Alert',
    category: 'Components',
    keywords: ['message', 'notification', 'warning'],
  },
  {
    path: '/components/badge',
    label: 'Badge',
    category: 'Components',
    keywords: ['tag', 'label', 'status'],
  },
  {
    path: '/components/skeleton',
    label: 'Skeleton',
    category: 'Components',
    keywords: ['loading', 'placeholder'],
  },
  {
    path: '/components/spinner',
    label: 'Spinner',
    category: 'Components',
    keywords: ['loading', 'progress'],
  },

  // Navigation Components
  {
    path: '/components/breadcrumb',
    label: 'Breadcrumb',
    category: 'Components',
    keywords: ['navigation', 'path', 'trail'],
  },

  // Data Display Components
  {
    path: '/components/data-table',
    label: 'DataTable',
    category: 'Components',
    keywords: ['table', 'grid', 'data', 'sort', 'filter'],
    isPro: true,
  },
  {
    path: '/components/virtual-list',
    label: 'VirtualList',
    category: 'Components',
    keywords: ['list', 'scroll', 'performance'],
  },
  {
    path: '/components/virtual-grid',
    label: 'VirtualGrid',
    category: 'Components',
    keywords: ['grid', 'scroll', 'performance'],
    isPro: true,
  },
  {
    path: '/components/dynamic-virtual-list',
    label: 'DynamicVirtualList',
    category: 'Components',
    keywords: ['list', 'variable', 'height'],
    isPro: true,
  },

  // Chart Components
  {
    path: '/components/line-chart',
    label: 'LineChart',
    category: 'Components',
    keywords: ['chart', 'graph', 'line', 'data'],
    isPro: true,
  },
  {
    path: '/components/pie-chart',
    label: 'PieChart',
    category: 'Components',
    keywords: ['chart', 'graph', 'pie', 'data'],
    isPro: true,
  },
  {
    path: '/components/responsive-container',
    label: 'ResponsiveContainer',
    category: 'Components',
    keywords: ['chart', 'responsive', 'container'],
    isPro: true,
  },

  // Hooks
  {
    path: '/hooks/use-debounce',
    label: 'useDebounce',
    category: 'Hooks',
    keywords: ['debounce', 'delay', 'throttle'],
  },
  {
    path: '/hooks/use-floating',
    label: 'useFloating',
    category: 'Hooks',
    keywords: ['floating', 'position', 'tooltip', 'popover'],
  },
  {
    path: '/hooks/use-intl',
    label: 'useIntl',
    category: 'Hooks',
    keywords: ['internationalization', 'i18n', 'translate'],
  },
  {
    path: '/hooks/use-mutation',
    label: 'useMutation',
    category: 'Hooks',
    keywords: ['mutation', 'api', 'post', 'fetch'],
  },
  {
    path: '/hooks/use-theme',
    label: 'useTheme',
    category: 'Hooks',
    keywords: ['theme', 'dark', 'light', 'mode'],
  },
  {
    path: '/hooks/use-toast',
    label: 'useToast',
    category: 'Hooks',
    keywords: ['toast', 'notification', 'message'],
  },
  {
    path: '/hooks/use-custom-resource',
    label: 'useCustomResource',
    category: 'Hooks',
    keywords: ['resource', 'fetch', 'api', 'swr'],
    isPro: true,
  },
  {
    path: '/hooks/use-date-picker',
    label: 'useDatePicker',
    category: 'Hooks',
    keywords: ['date', 'calendar', 'picker'],
    isPro: true,
  },
  {
    path: '/hooks/use-dynamic-virtual-list',
    label: 'useDynamicVirtualList',
    category: 'Hooks',
    keywords: ['virtual', 'list', 'scroll'],
    isPro: true,
  },

  // Contexts
  {
    path: '/contexts/intl-provider',
    label: 'IntlProvider',
    category: 'Contexts',
    keywords: ['i18n', 'internationalization', 'locale'],
  },
  {
    path: '/contexts/theme-provider',
    label: 'ThemeProvider',
    category: 'Contexts',
    keywords: ['theme', 'dark', 'light'],
  },
  {
    path: '/contexts/toast-provider',
    label: 'ToastProvider',
    category: 'Contexts',
    keywords: ['toast', 'notification'],
  },
  {
    path: '/contexts/custom-resource-provider',
    label: 'CustomResourceProvider',
    category: 'Contexts',
    keywords: ['resource', 'fetch', 'cache'],
  },
  {
    path: '/contexts/date-picker-provider',
    label: 'DatePickerProvider',
    category: 'Contexts',
    keywords: ['date', 'calendar', 'locale'],
  },
];

const Navbar: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  // Filter search results based on query
  const searchResults = createMemo(() => {
    const query = searchQuery().toLowerCase().trim();
    if (!query) return [];

    return searchIndex.filter((item) => {
      const labelMatch = item.label.toLowerCase().includes(query);
      const categoryMatch = item.category.toLowerCase().includes(query);
      const keywordMatch = item.keywords?.some((kw) => kw.toLowerCase().includes(query));
      return labelMatch || categoryMatch || keywordMatch;
    });
  });

  // Reset selected index when search query changes
  createEffect(() => {
    searchQuery();
    setSelectedIndex(0);
  });

  // Navigate to selected result
  const navigateToResult = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

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

  // Keyboard shortcut for search
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }

      // Arrow key navigation in search results
      if (isSearchOpen()) {
        const results = searchResults();
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results.length > 0) {
          e.preventDefault();
          navigateToResult(results[selectedIndex()].path);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode());

  const isActive = (path: string, activePaths?: string[]) => {
    if (activePaths) {
      return activePaths.some((p) => location.pathname.startsWith(p));
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    {
      href: '/overview/quickstart',
      label: 'Docs',
      activePaths: ['/overview', '/hooks', '/contexts'],
    },
    { href: '/components/button', label: 'Components', activePaths: ['/components'] },
    { href: '/icons', label: 'Icons', activePaths: ['/icons'] },
    { href: '/blocks', label: 'Blocks', activePaths: ['/blocks'] },
  ];

  return (
    <>
      {/* Top promotional banner */}
      {/* <div class="flex h-10 items-center justify-center gap-3 bg-gradient-to-r from-pink-50 via-white to-blue-50 text-sm dark:from-pink-950/20 dark:via-gray-950 dark:to-blue-950/20">
        <span class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <span>🚀</span>
          Ship faster with beautiful components
        </span>
        <A
          href="/pro"
          class="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Solidly Pro
          <svg class="size-3" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clip-rule="evenodd"
            />
          </svg>
        </A>
      </div> */}

      {/* Main navbar */}
      <header class="sticky top-0 z-50 h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-900/80">
        <nav class="mx-auto flex h-full max-w-[90rem] items-center justify-between px-4">
          {/* Left: Logo + Version */}
          <div class="flex items-center gap-3">
            <A href="/" class="flex items-center gap-2">
              <div class="flex size-8 items-center justify-center">
                <svg class="size-7" viewBox="0 0 32 32" fill="none">
                  {/* Building Blocks Logo - Isometric stacked cubes */}
                  {/* Bottom left block */}
                  <path d="M4 20l6-3.5v7L4 27v-7z" fill="#818CF8" />
                  <path d="M10 16.5l6 3.5v7l-6-3.5v-7z" fill="#6366F1" />
                  <path d="M4 20l6-3.5 6 3.5-6 3.5-6-3.5z" fill="#A5B4FC" />

                  {/* Bottom right block */}
                  <path d="M16 20l6-3.5v7l-6 3.5v-7z" fill="#818CF8" />
                  <path d="M22 16.5l6 3.5v7l-6-3.5v-7z" fill="#6366F1" />
                  <path d="M16 20l6-3.5 6 3.5-6 3.5-6-3.5z" fill="#A5B4FC" />

                  {/* Top block */}
                  <path d="M10 13l6-3.5v7l-6 3.5v-7z" fill="#C084FC" />
                  <path d="M16 9.5l6 3.5v7l-6-3.5v-7z" fill="#A855F7" />
                  <path d="M10 13l6-3.5 6 3.5-6 3.5-6-3.5z" fill="#E9D5FF" />
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">Solidly</span>
            </A>
            <span class="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              v1.0.0
            </span>
          </div>

          <div class="flex items-center">
            {/* Center: Navigation Links */}
            <div class="hidden items-center gap-4 lg:flex">
              <For each={navLinks}>
                {(link) => (
                  <A
                    href={link.href}
                    class={`text-sm font-medium transition-colors ${
                      isActive(link.href, link.activePaths)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </A>
                )}
              </For>
            </div>
            <div class="mx-4 h-8 w-1 border-r border-gray-200" />
            {/* Right: Search + GitHub + Dark Mode */}
            <div class="flex items-center gap-2">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                class="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <SearchIcon />
                <span class="hidden sm:inline">Search</span>
                <kbd class="ml-2 hidden rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs font-medium text-gray-400 sm:inline-flex dark:border-gray-600 dark:bg-gray-700">
                  ⌘K
                </kbd>
              </button>

              {/* GitHub Link with Stars */}
              <a
                href="https://github.com/exowpee/solidly"
                target="_blank"
                rel="noopener noreferrer"
                class="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 sm:flex dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <GitHubIcon />
                <span class="font-medium">1.2K</span>
              </a>

              {/* Dark Mode Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                class="inline-grid size-9 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label={isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <Show when={isDarkMode()} fallback={<MoonIcon />}>
                  <SunIcon />
                </Show>
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
                class="inline-grid size-9 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label={isMobileMenuOpen() ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen()}
              >
                <Show
                  when={isMobileMenuOpen()}
                  fallback={
                    <svg
                      class="size-5"
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
                  }
                >
                  <svg
                    class="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </Show>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <Show when={isMobileMenuOpen()}>
          <div class="border-t border-gray-200 bg-white px-4 py-3 lg:hidden dark:border-gray-800 dark:bg-gray-900">
            <div class="flex flex-col gap-4">
              <For each={navLinks}>
                {(link) => (
                  <A
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    class={`flex items-center rounded-lg text-base font-medium transition-colors ${
                      isActive(link.href, link.activePaths)
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </A>
                )}
              </For>
            </div>
          </div>
        </Show>
      </header>

      {/* Search Modal */}
      <Show when={isSearchOpen()}>
        <div class="fixed inset-0 z-[100]">
          <div
            class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
          />
          <div class="fixed inset-x-4 top-24 mx-auto max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
            <div class="relative border-b border-gray-200 p-4 dark:border-gray-700">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-7">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                autofocus
                class="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pr-4 pl-11 text-base text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
            </div>

            {/* Search Results */}
            <div class="max-h-96 overflow-y-auto">
              <Show
                when={searchQuery().trim()}
                fallback={
                  <div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Type to search components, hooks, and docs...
                  </div>
                }
              >
                <Show
                  when={searchResults().length > 0}
                  fallback={
                    <div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No results found for "{searchQuery()}"
                    </div>
                  }
                >
                  <For each={searchResults()}>
                    {(item, index) => (
                      <>
                        <Show
                          when={
                            index() === 0 ||
                            searchResults()[index() - 1].category !== item.category
                          }
                        >
                          <div class="sticky top-0 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:bg-gray-900 dark:text-gray-400">
                            {item.category}
                          </div>
                        </Show>
                        <button
                          type="button"
                          onClick={() => navigateToResult(item.path)}
                          onMouseEnter={() => setSelectedIndex(index())}
                          class={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex() === index()
                              ? 'bg-blue-50 dark:bg-blue-900/30'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span
                            class={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
                              item.category === 'Components'
                                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
                                : item.category === 'Hooks'
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                                  : item.category === 'Contexts'
                                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                            }`}
                          >
                            {item.label.charAt(0)}
                          </span>
                          <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                              <span class="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </span>
                              <Show when={item.isPro}>
                                <Diamond01Icon class="size-4 text-blue-500" />
                              </Show>
                            </div>
                            <div class="truncate text-xs text-gray-500 dark:text-gray-400">
                              {item.path}
                            </div>
                          </div>
                          <Show when={selectedIndex() === index()}>
                            <kbd class="shrink-0 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400 dark:border-gray-600 dark:bg-gray-700">
                              ↵
                            </kbd>
                          </Show>
                        </button>
                      </>
                    )}
                  </For>
                </Show>
              </Show>
            </div>

            {/* Footer */}
            <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <kbd class="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-medium dark:border-gray-600 dark:bg-gray-700">
                  ↑↓
                </kbd>
                <span>Navigate</span>
                <kbd class="ml-2 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-medium dark:border-gray-600 dark:bg-gray-700">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <kbd class="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-medium dark:border-gray-600 dark:bg-gray-700">
                  Esc
                </kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Navbar;
