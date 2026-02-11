import {
  type Component,
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import {
  Menu01Icon,
  Moon01Icon,
  SearchRefractionIcon,
  SunIcon,
  XCloseIcon,
} from '@kayou/icons';
import { A, useLocation, useNavigate } from '@solidjs/router';

import type { SearchDocument } from '../utils/search';

const GitHubIcon = () => (
  <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clip-rule="evenodd"
    />
  </svg>
);


const Navbar: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [searchResults, setSearchResults] = createSignal<SearchDocument[]>([]);
  let searchInputRef: HTMLInputElement | undefined;

  const openSearch = () => {
    setIsSearchOpen(true);
    searchInputRef?.focus();
  };

  // Perform search with Orama when query changes (lazy-loaded)
  let searchModule: typeof import('../utils/search') | null = null;

  createEffect(() => {
    const query = searchQuery().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    if (searchModule) {
      setSearchResults(searchModule.searchDocs(query));
      setSelectedIndex(0);
    } else {
      const capturedQuery = query;
      void import('../utils/search').then((mod) => {
        searchModule = mod;
        setSearchResults(mod.searchDocs(capturedQuery));
        setSelectedIndex(0);
      });
    }
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
        openSearch();
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
      activePaths: ['/overview', '/hooks'],
    },
    { href: '/components/button', label: 'Components', activePaths: ['/components'] },
    { href: '/icons', label: 'Icons', activePaths: ['/icons'] },
  ];

  return (
    <>
      {/* Main navbar */}
      <header class="sticky top-0 z-50 h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900">
        <nav class="mx-auto flex h-full max-w-[90rem] items-center justify-between px-4">
          {/* Left: Logo + Version */}
          <div class="flex items-center gap-3">
            <A href="/" class="flex items-center gap-2">
              <div class="flex size-8 items-center justify-center text-black dark:text-white">
                <svg width="28" height="28" fill="currentColor">
                  <path d="M.652.014c1.934-.013 3.868 0 5.802.04.65.305.848.795.596 1.47A128.113 128.113 0 0 1 1.606 6.81c-.678.288-1.195.116-1.55-.516a100.192 100.192 0 0 1 0-5.644C.216.396.416.184.652.014ZM10.031.014c1.75-.013 3.498 0 5.246.04.331.12.557.344.676.675l1.828 4.134c.168.666-.057 1.13-.676 1.39a94.284 94.284 0 0 1-5.206.915c-.183 0-.355-.04-.517-.12a169.016 169.016 0 0 0-3.894-3.02c-.327-.425-.394-.889-.2-1.39A142.41 142.41 0 0 0 10.032.013ZM17.98.014c3.184-.038 6.363.002 9.538.12.192.132.338.304.437.516.04 1.006.053 2.013.04 3.02-.108.335-.32.586-.636.756-2.247.445-4.499.855-6.756 1.232a6.134 6.134 0 0 1-1.034.08.921.921 0 0 1-.596-.398 181.108 181.108 0 0 0-1.748-3.895c-.21-.73.042-1.206.755-1.43ZM5.58 4.306c.393-.043.764.024 1.113.2 2.926 2.276 5.84 4.568 8.743 6.875.153.302.193.62.12.954l-1.272 4.769c-.182.498-.54.75-1.073.755-1.563.15-3.126.256-4.69.318a1.418 1.418 0 0 1-.437-.358A488.718 488.718 0 0 1 4.268 6.294a1.32 1.32 0 0 1 .08-.795c.398-.412.809-.81 1.232-1.193ZM26.405 5.499c.688-.168 1.205.044 1.55.636.053 4 .053 8.001 0 12.002-.278.596-.742.821-1.39.676a540.48 540.48 0 0 1-12.36-9.658c-.277-.705-.078-1.222.595-1.55 3.884-.68 7.753-1.382 11.605-2.106ZM3.434 18.693c-.874.063-1.748.116-2.623.16a1.132 1.132 0 0 1-.755-.716 223.296 223.296 0 0 1 0-8.426l.159-.318A35.276 35.276 0 0 1 2.24 7.446c.72-.385 1.263-.213 1.63.517a483.386 483.386 0 0 1 2.98 9.419c.02.485-.193.83-.635 1.033-.928.097-1.856.19-2.782.278ZM16.708 12.97c.266-.013.531 0 .795.04a288.522 288.522 0 0 1 6.438 4.928c.446.332.592.77.437 1.312a353.846 353.846 0 0 0-4.053 7.948c-.146.358-.398.61-.755.756-2.12.053-4.24.053-6.36 0a1.23 1.23 0 0 1-.516-.597c-.053-.402-.026-.8.08-1.192a720.34 720.34 0 0 0 3.338-12.48c.13-.301.33-.54.596-.715ZM10.985 27.914c-.976.076-1.957.103-2.941.08-.135.012-.268-.001-.397-.04a1383.948 1383.948 0 0 1-7.512-6.558c-.288-.678-.116-1.194.517-1.55 3.826-.349 7.655-.68 11.485-.994.74-.066 1.204.252 1.391.954-.677 2.603-1.379 5.2-2.106 7.79a.866.866 0 0 1-.437.318ZM25.372 19.727c.293-.013.584 0 .874.04.586.39 1.13.828 1.63 1.311.13 2.062.157 4.128.08 6.2-.12.331-.345.556-.676.675-1.67.053-3.339.053-5.008 0-.572-.255-.797-.693-.676-1.311l3.339-6.518c.137-.151.283-.284.437-.397ZM.652 23.78c.367-.04.711.026 1.033.2l2.742 2.424c.237.58.117 1.07-.357 1.47a19.137 19.137 0 0 1-3.418.08 2.031 2.031 0 0 1-.517-.438 15.825 15.825 0 0 1-.08-3.1c.162-.253.36-.465.597-.636Z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">Kayou</span>
            </A>
          </div>

          <div class="flex items-center">
            {/* Navigation Links */}
            <div class="hidden items-center gap-4 lg:flex">
              <For each={navLinks}>
                {(link) => (
                  <A
                    href={link.href}
                    class={`text-sm font-medium transition-colors ${
                      isActive(link.href, link.activePaths)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </A>
                )}
              </For>
            </div>
            <div class="hidden lg:block mx-4 h-8 w-1 border-r border-gray-200 dark:border-neutral-700" />
            {/* Right: Search + GitHub + Dark Mode */}
            <div class="flex items-center gap-2">
              {/* Search Button */}
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search documentation"
                class="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-500 transition-colors dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400"
              >
                <SearchRefractionIcon class="size-4" />
                <span class="hidden sm:inline">Search</span>
                <kbd class="ml-2 hidden rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs font-medium text-neutral-500 sm:inline-flex dark:border-neutral-700 dark:bg-neutral-800">
                  ⌘K
                </kbd>
              </button>

              {/* GitHub Link with Stars */}
              <a
                href="https://github.com/kayou"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                class="flex items-center rounded-lg p-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <GitHubIcon />
              </a>

              {/* Dark Mode Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                class="inline-grid size-9 cursor-pointer place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                aria-label={isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <Show when={isDarkMode()} fallback={<Moon01Icon class="size-5" />}>
                  <SunIcon class="size-5" />
                </Show>
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
                class="inline-grid size-9 cursor-pointer place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:hidden dark:text-neutral-400 dark:hover:bg-neutral-800"
                aria-label={isMobileMenuOpen() ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen()}
              >
                <Show
                  when={isMobileMenuOpen()}
                  fallback={<Menu01Icon class="size-5" />}
                >
                  <XCloseIcon class="size-5" />
                </Show>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <Show when={isMobileMenuOpen()}>
          <div class="border-y border-gray-200 bg-white px-4 py-3 lg:hidden dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex flex-col gap-4">
              <For each={navLinks}>
                {(link) => (
                  <A
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    class={`flex items-center rounded-lg text-base transition-colors ${
                      isActive(link.href, link.activePaths)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
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
          <div class="fixed inset-x-4 top-24 mx-auto max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-neutral-900 dark:border dark:border-neutral-700">
            <div class="relative border-b border-gray-200 p-4 dark:border-neutral-800">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-7">
                <SearchRefractionIcon class="size-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                aria-label="Search documentation"
                placeholder="Search documentation..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pr-4 pl-11 text-base text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
            </div>

            {/* Search Results */}
            <div class="max-h-96 overflow-y-auto">
              <Show
                when={searchQuery().trim()}
                fallback={
                  <div class="p-4 text-center text-sm text-gray-500 dark:text-neutral-400">
                    Type to search components, hooks, and docs...
                  </div>
                }
              >
                <Show
                  when={searchResults().length > 0}
                  fallback={
                    <div class="p-4 text-center text-sm text-gray-500 dark:text-neutral-400">
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
                          <div class="sticky top-0 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:bg-neutral-900 dark:text-neutral-400">
                            {item.category}
                          </div>
                        </Show>
                        <button
                          type="button"
                          onClick={() => navigateToResult(item.path)}
                          onMouseEnter={() => setSelectedIndex(index())}
                          class={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex() === index()
                              ? 'bg-blue-50 dark:bg-blue-900/30'
                              : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
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
                                    : 'bg-gray-100 text-gray-600 dark:bg-neutral-900 dark:text-neutral-400'
                            }`}
                          >
                            {item.label.charAt(0)}
                          </span>
                          <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                              <span class="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </span>
                            </div>
                            <div class="truncate text-xs text-gray-500 dark:text-neutral-400">
                              {item.path}
                            </div>
                          </div>
                          <Show when={selectedIndex() === index()}>
                            <kbd class="shrink-0 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400 dark:border-neutral-700 dark:bg-neutral-800">
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
            <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-neutral-800">
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                <kbd class="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-medium dark:border-neutral-700 dark:bg-neutral-800">
                  ↑↓
                </kbd>
                <span>Navigate</span>
                <kbd class="ml-2 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-medium dark:border-neutral-700 dark:bg-neutral-800">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                <kbd class="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-medium dark:border-neutral-700 dark:bg-neutral-800">
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
