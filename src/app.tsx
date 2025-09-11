import { type Component, For, JSX, Show, Suspense, createMemo } from 'solid-js';

import { A } from '@solidjs/router';
import routes from '~solid-pages';

import { DatePickerGlobalProvider } from './context/DatePickerGlobalContext';
import { IntlProvider } from './hooks/useIntl';
import { ThemeProvider } from './hooks/useTheme';

interface Route {
  path: string;
  children?: Route[];
}

const App: Component<{ children: JSX.Element }> = (props) => {
  // Filter out the catch-all route and format the routes
  const filteredRoutes = createMemo(() => {
    return routes.filter((route) => route.path !== '*' && route.path !== '/');
  });

  const formatPath = (path: string) =>
    path
      .split('/')
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Home';

  const renderRoute = (route: Route, parentPath: string = '') => {
    const hasChildren = route.children && route.children.length > 0;
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;

    return (
      <Show
        when={hasChildren}
        fallback={
          <li class="-ml-px flex flex-col items-start gap-2">
            <A
              href={fullPath}
              class="inline-block border-l border-transparent pl-5 text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 sm:pl-4 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white dark:aria-[current]:border-white dark:aria-[current]:text-white"
            >
              {formatPath(route.path)}
            </A>
          </li>
        }
      >
        <div class="flex flex-col gap-3">
          <h3 class="font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase sm:text-xs/6 dark:text-gray-400">
            {formatPath(route.path)}
          </h3>
          <ul class="flex flex-col gap-2 border-l border-[color-mix(in_oklab,_var(--color-gray-950),white_90%)] dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
            <For each={route.children}>{(child) => renderRoute(child, fullPath)}</For>
          </ul>
        </div>
      </Show>
    );
  };

  return (
    <IntlProvider locale="en" messages={{}}>
      <ThemeProvider>
        <DatePickerGlobalProvider locale="fr">
          <div>
            <div class="fixed inset-x-0 top-0 z-10 border-b border-gray-950/5 dark:border-white/10">
              <div class="bg-white dark:bg-gray-950">
                <div class="flex h-14 items-center justify-between gap-8 px-4 sm:px-6" />
              </div>
              <div class="flex h-14 items-center border-t border-gray-950/5 bg-white px-4 sm:px-6 lg:hidden dark:border-white/10 dark:bg-gray-950">
                <button
                  type="button"
                  class="relative -ml-1.5 inline-grid size-7 place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
                  aria-label="Open navigation menu"
                >
                  <span class="absolute top-1/2 left-1/2 size-11 -translate-1/2 pointer-fine:hidden" />
                  <svg viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path
                      fill-rule="evenodd"
                      d="M2 4.75A.75.75 0 0 1 2.75 4h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 6.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <ol class="sticky ml-4 flex min-w-0 items-center gap-2 text-sm/6 whitespace-nowrap">
                  <li class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400">Getting started</span>
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
                  </li>
                  <li class="truncate text-gray-950 dark:text-white">Editor setup</li>
                </ol>
              </div>
            </div>
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
        </DatePickerGlobalProvider>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default App;
