/* eslint-disable solid/no-innerhtml */
import {
  Component,
  For,
  type JSX,
  Show,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import * as Icons from '@exowpee/solidly/icons';

import { formatCodeToHTML } from '../helpers/formatCodeToHTML';

/** Icon component type */
type IconComponent = Component<{ class?: string } & JSX.SvgSVGAttributes<SVGSVGElement>>;

// Get all icon names from the exports
const allIcons = Object.entries(Icons).filter(([name]) => name.endsWith('Icon'));

// Categorize icons based on naming patterns
const categorizeIcon = (name: string): string => {
  const lowerName = name.toLowerCase();

  if (
    lowerName.includes('arrow') ||
    lowerName.includes('chevron') ||
    lowerName.includes('corner')
  )
    return 'Arrows';
  if (
    lowerName.includes('chart') ||
    lowerName.includes('bar') ||
    lowerName.includes('line-chart') ||
    lowerName.includes('pie')
  )
    return 'Charts';
  if (lowerName.includes('user') || lowerName.includes('users')) return 'Users';
  if (
    lowerName.includes('file') ||
    lowerName.includes('folder') ||
    lowerName.includes('document')
  )
    return 'Files';
  if (
    lowerName.includes('mail') ||
    lowerName.includes('message') ||
    lowerName.includes('chat') ||
    lowerName.includes('phone') ||
    lowerName.includes('send')
  )
    return 'Communication';
  if (
    lowerName.includes('alert') ||
    lowerName.includes('bell') ||
    lowerName.includes('notification')
  )
    return 'Alerts';
  if (
    lowerName.includes('check') ||
    lowerName.includes('plus') ||
    lowerName.includes('minus') ||
    lowerName.includes('x-') ||
    lowerName.includes('xclose') ||
    lowerName.includes('xicon')
  )
    return 'Actions';
  if (
    lowerName.includes('home') ||
    lowerName.includes('building') ||
    lowerName.includes('map') ||
    lowerName.includes('marker') ||
    lowerName.includes('globe')
  )
    return 'Location';
  if (
    lowerName.includes('calendar') ||
    lowerName.includes('clock') ||
    lowerName.includes('time') ||
    lowerName.includes('alarm')
  )
    return 'Time';
  if (
    lowerName.includes('setting') ||
    lowerName.includes('tool') ||
    lowerName.includes('filter') ||
    lowerName.includes('slider')
  )
    return 'Settings';
  if (
    lowerName.includes('edit') ||
    lowerName.includes('pencil') ||
    lowerName.includes('pen') ||
    lowerName.includes('brush') ||
    lowerName.includes('paint')
  )
    return 'Editor';
  if (
    lowerName.includes('play') ||
    lowerName.includes('pause') ||
    lowerName.includes('stop') ||
    lowerName.includes('volume') ||
    lowerName.includes('music') ||
    lowerName.includes('video')
  )
    return 'Media';
  if (
    lowerName.includes('lock') ||
    lowerName.includes('key') ||
    lowerName.includes('shield') ||
    lowerName.includes('eye')
  )
    return 'Security';
  if (
    lowerName.includes('cloud') ||
    lowerName.includes('download') ||
    lowerName.includes('upload') ||
    lowerName.includes('server') ||
    lowerName.includes('database')
  )
    return 'Cloud & Storage';
  if (
    lowerName.includes('credit') ||
    lowerName.includes('wallet') ||
    lowerName.includes('bank') ||
    lowerName.includes('coin') ||
    lowerName.includes('currency') ||
    lowerName.includes('dollar')
  )
    return 'Finance';
  if (
    lowerName.includes('heart') ||
    lowerName.includes('star') ||
    lowerName.includes('thumb') ||
    lowerName.includes('bookmark') ||
    lowerName.includes('flag')
  )
    return 'Social';
  if (
    lowerName.includes('sun') ||
    lowerName.includes('moon') ||
    lowerName.includes('cloud') ||
    lowerName.includes('rain') ||
    lowerName.includes('snow') ||
    lowerName.includes('wind')
  )
    return 'Weather';
  if (
    lowerName.includes('laptop') ||
    lowerName.includes('monitor') ||
    lowerName.includes('phone') ||
    lowerName.includes('tablet') ||
    lowerName.includes('device') ||
    lowerName.includes('tv')
  )
    return 'Devices';
  if (
    lowerName.includes('code') ||
    lowerName.includes('terminal') ||
    lowerName.includes('git') ||
    lowerName.includes('bracket')
  )
    return 'Development';
  if (
    lowerName.includes('grid') ||
    lowerName.includes('layout') ||
    lowerName.includes('column') ||
    lowerName.includes('row') ||
    lowerName.includes('align')
  )
    return 'Layout';
  if (
    lowerName.includes('type') ||
    lowerName.includes('text') ||
    lowerName.includes('font') ||
    lowerName.includes('bold') ||
    lowerName.includes('italic') ||
    lowerName.includes('heading')
  )
    return 'Typography';
  if (
    lowerName.includes('image') ||
    lowerName.includes('camera') ||
    lowerName.includes('photo')
  )
    return 'Images';
  if (
    lowerName.includes('search') ||
    lowerName.includes('zoom') ||
    lowerName.includes('find')
  )
    return 'Search';
  if (
    lowerName.includes('loading') ||
    lowerName.includes('refresh') ||
    lowerName.includes('repeat') ||
    lowerName.includes('sync')
  )
    return 'Loading';
  if (
    lowerName.includes('share') ||
    lowerName.includes('link') ||
    lowerName.includes('copy')
  )
    return 'Sharing';
  if (
    lowerName.includes('shopping') ||
    lowerName.includes('cart') ||
    lowerName.includes('bag') ||
    lowerName.includes('tag') ||
    lowerName.includes('receipt')
  )
    return 'E-commerce';
  if (
    lowerName.includes('menu') ||
    lowerName.includes('dots') ||
    lowerName.includes('list')
  )
    return 'Navigation';
  if (
    lowerName.includes('face') ||
    lowerName.includes('emoji') ||
    lowerName.includes('smile')
  )
    return 'Emoji';
  if (
    lowerName.includes('info') ||
    lowerName.includes('help') ||
    lowerName.includes('question')
  )
    return 'Help';

  return 'General';
};

// Build categorized icon list
const iconsByCategory = createMemo(() => {
  const categories: Record<string, { name: string; component: IconComponent }[]> = {};

  for (const [name, component] of allIcons) {
    const category = categorizeIcon(name);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ name, component: component as IconComponent });
  }

  // Sort categories alphabetically
  const sortedCategories: Record<string, { name: string; component: IconComponent }[]> =
    {};
  for (const key of Object.keys(categories).sort()) {
    sortedCategories[key] = categories[key].sort((a, b) => a.name.localeCompare(b.name));
  }

  return sortedCategories;
});

// Get all categories
const allCategories = createMemo(() => Object.keys(iconsByCategory()).sort());

// Format icon name for display
const formatIconName = (name: string): string => {
  return name
    .replace(/Icon$/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
};

const codeExample = `import { ArrowRightIcon, CheckIcon } from '@exowpee/solidly/icons';

function MyComponent() {
  return (
    <button class="flex items-center gap-2">
      Continue <ArrowRightIcon class="size-5" />
    </button>
  );
}`;

export default function IconsPage() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);
  const [copiedIcon, setCopiedIcon] = createSignal<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [isDark, setIsDark] = createSignal(false);

  // Track dark mode via document.documentElement class
  onMount(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    onCleanup(() => observer.disconnect());
  });

  const filteredIcons = createMemo(() => {
    const query = searchQuery().toLowerCase();
    const category = selectedCategory();
    const categories = iconsByCategory();

    const result: { name: string; component: IconComponent; category: string }[] = [];

    for (const [cat, icons] of Object.entries(categories)) {
      if (category && category !== cat) continue;

      for (const icon of icons) {
        const displayName = formatIconName(icon.name).toLowerCase();
        if (
          !query ||
          displayName.includes(query) ||
          icon.name.toLowerCase().includes(query)
        ) {
          result.push({ ...icon, category: cat });
        }
      }
    }

    return result;
  });

  const copyIconName = (iconName: string, e: MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div class="min-h-screen bg-white dark:bg-gray-900">
      {/* Header - heroicons style */}
      <div class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/20">
        {/* Decorative icon */}
        <div class="pointer-events-none absolute -top-20 -right-20 opacity-[0.07] dark:opacity-[0.04]">
          <Icons.Star01Icon class="size-[500px] text-blue-600" />
        </div>

        <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Stats bar */}
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium text-gray-900 dark:text-white">
              {allIcons.length} icons
            </span>
            <span>·</span>
            <span>Free & open source</span>
            <span>·</span>
            <span>SolidJS</span>
          </div>

          {/* Main headline */}
          <h1 class="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Beautiful hand-crafted SVG icons, from{' '}
            <a
              href="https://www.untitledui.com/icons"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Untitled UI
            </a>
            .
          </h1>

          {/* Links */}
          <div class="mt-8 flex items-center gap-6">
            <a
              href="https://www.untitledui.com/icons"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Icons.LinkExternal01Icon class="size-5" />
              <span>Untitled UI Icons</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search bar - minimal style */}
      <div class="border-t border-gray-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:border-gray-800 dark:bg-gray-900">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-4 py-6">
            <Icons.SearchSmIcon class="size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search all icons..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[12rem_1fr]">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen())}
            class="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg lg:hidden dark:bg-white dark:text-gray-900"
          >
            <Icons.FilterFunnel01Icon class="size-5" />
            Categories
          </button>

          {/* Sidebar - sticky */}
          <aside
            class={`fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto border-r border-gray-200 bg-white pt-4 transition-transform lg:relative lg:row-span-1 lg:w-auto lg:translate-x-0 lg:overflow-visible lg:border-0 lg:bg-transparent lg:pt-0 dark:border-gray-800 dark:bg-gray-900 lg:dark:bg-transparent ${
              sidebarOpen() ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Mobile Close Button */}
            <div class="flex items-center justify-between border-b border-gray-200 p-4 lg:hidden dark:border-gray-800">
              <span class="font-medium text-gray-900 dark:text-white">Categories</span>
              <button onClick={() => setSidebarOpen(false)}>
                <Icons.XCloseIcon class="size-5 text-gray-500" />
              </button>
            </div>

            <nav class="top-8 p-4 lg:p-0">
              <ul class="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSidebarOpen(false);
                    }}
                    class={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      selectedCategory() === null
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>All Icons</span>
                    <span
                      class={`rounded-full px-2 py-0.5 text-xs ${
                        selectedCategory() === null
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                      }`}
                    >
                      {allIcons.length}
                    </span>
                  </button>
                </li>
                <li class="pt-2">
                  <div class="px-3 pb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Categories
                  </div>
                </li>
                <For each={allCategories()}>
                  {(category) => (
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setSidebarOpen(false);
                        }}
                        class={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedCategory() === category
                            ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span>{category}</span>
                        <span
                          class={`rounded-full px-2 py-0.5 text-xs ${
                            selectedCategory() === category
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                          }`}
                        >
                          {iconsByCategory()[category]?.length || 0}
                        </span>
                      </button>
                    </li>
                  )}
                </For>
              </ul>
            </nav>
          </aside>

          {/* Sidebar Overlay for Mobile */}
          <Show when={sidebarOpen()}>
            <div
              class="fixed inset-0 z-30 bg-gray-950/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          </Show>

          {/* Main Content - height matches sidebar */}
          <main class="flex h-[1400px] min-w-0 flex-col overflow-hidden">
            {/* Results Header - fixed */}
            <div class="mb-4 shrink-0 text-sm text-gray-600 dark:text-gray-400">
              <Show
                when={searchQuery() || selectedCategory()}
                fallback={<span>Showing all {allIcons.length} icons</span>}
              >
                <span>
                  {filteredIcons().length}{' '}
                  {filteredIcons().length === 1 ? 'icon' : 'icons'}
                  {selectedCategory() && (
                    <span>
                      {' '}
                      in{' '}
                      <span class="font-medium text-gray-900 dark:text-white">
                        {selectedCategory()}
                      </span>
                    </span>
                  )}
                  {searchQuery() && (
                    <span>
                      {' '}
                      matching "
                      <span class="font-medium text-gray-900 dark:text-white">
                        {searchQuery()}
                      </span>
                      "
                    </span>
                  )}
                </span>
              </Show>
            </div>

            {/* Icons Grid - scrollable */}
            <div class="min-h-0 flex-1 overflow-y-auto pb-8">
              <Show
                when={filteredIcons().length > 0}
                fallback={
                  <div class="flex flex-col items-center justify-center py-20">
                    <div class="rounded-full bg-gray-100 p-4 dark:bg-gray-900">
                      <Icons.SearchSmIcon class="size-8 text-gray-400" />
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-950 dark:text-white">
                      No icons found
                    </h3>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Try a different search term or category.
                    </p>
                  </div>
                }
              >
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  <For each={filteredIcons()}>
                    {(icon) => {
                      const IconComponent = icon.component;
                      return (
                        <div class="group relative flex flex-col items-center gap-2 rounded-xl border border-transparent bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md dark:bg-gray-900 dark:hover:border-blue-800 dark:hover:bg-blue-950/30">
                          <div class="flex size-5 items-center justify-center text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                            <IconComponent class="size-5" />
                          </div>
                          <span class="w-full truncate text-center text-xs text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400">
                            {formatIconName(icon.name)}
                          </span>

                          {/* Copy button on hover */}
                          <button
                            onClick={(e) => copyIconName(icon.name, e)}
                            class="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                            title={`Copy ${icon.name}`}
                          >
                            <Icons.Copy01Icon class="size-3" />
                            Copy
                          </button>

                          {/* Copied overlay */}
                          <Show when={copiedIcon() === icon.name}>
                            <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-green-500 text-xs font-medium text-white">
                              Copied!
                            </div>
                          </Show>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </main>
        </div>
      </div>

      {/* How to use Section - at bottom */}
      <div class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-gray-950 dark:text-white">How to use</h2>
          <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div innerHTML={formatCodeToHTML(codeExample, isDark() ? 'dark' : 'light')} />
          </div>
          <div class="mt-6 flex flex-wrap gap-6">
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icons.CheckCircleIcon class="size-5 text-green-500" />
              <span>Tree-shakeable</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icons.CheckCircleIcon class="size-5 text-green-500" />
              <span>TypeScript support</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icons.CheckCircleIcon class="size-5 text-green-500" />
              <span>SSR compatible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
