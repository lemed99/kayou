/* eslint-disable solid/no-innerhtml */
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

import { formatCodeToHTML } from '../helpers/formatCodeToHTML';

// Move sections outside component to avoid recreation
const SECTIONS = [
  { id: 'description', title: 'Description' },
  { id: 'usage', title: 'Usage' },
  { id: 'props', title: 'Props' },
  { id: 'examples', title: 'Examples' },
] as const;

// Helper to generate example ID from title
const getExampleId = (title: string): string => title.toLowerCase().replace(/\s+/g, '-');

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

interface PropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
  deprecated?: boolean;
}

interface ExampleDefinition {
  title: string;
  description?: string;
  code: string;
  component: () => JSX.Element;
}

interface DocPageProps {
  title: string;
  description: string;
  props?: PropDefinition[];
  examples?: ExampleDefinition[];
  usage?: string;
}

export default function DocPage(props: ParentProps<DocPageProps>): JSX.Element {
  const [hash, setHash] = createSignal('');
  const [elementCache, setElementCache] = createSignal<Map<string, HTMLElement>>(
    new Map(),
  );

  // Initialize hash on mount (SSR-safe)
  onMount(() => {
    setHash(window.location.hash.slice(1));
  });

  // Memoize props array for stable reference - moved before element caching to be accessible
  const propsArray = createMemo(() => props.props ?? []);
  const examplesArray = createMemo(() => props.examples ?? []);

  // Cache element references - use createEffect to track examplesArray changes
  // Use queueMicrotask to ensure DOM has rendered before querying elements
  createEffect(() => {
    // Access examplesArray() in tracked scope to trigger re-caching on change
    const examples = examplesArray();

    queueMicrotask(() => {
      const cache = new Map<string, HTMLElement>();

      // Cache section elements
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) cache.set(section.id, el);
      }

      // Cache example elements
      for (const example of examples) {
        const id = getExampleId(example.title);
        const el = document.getElementById(id);
        if (el) cache.set(id, el);
      }

      setElementCache(cache);
    });
  });

  // Optimized scroll handler with throttling
  createEffect(() => {
    const cache = elementCache();
    if (cache.size === 0) return;

    // Capture reactive values in tracked scope (createEffect)
    // These will be fresh each time the effect re-runs
    const examples = examplesArray();
    const allIds = [
      ...SECTIONS.map((s) => s.id),
      ...examples.map((e) => getExampleId(e.title)),
    ];

    const handleScroll = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Skip if at bottom of page
      if (scrollHeight - scrollTop - clientHeight < 1) return;

      let bestElement: string | null = null;
      let bestDistanceFromTop = Infinity;

      for (const id of allIds) {
        const element = cache.get(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom - 56; // Header height offset

        const isVisible = elementBottom > 0 && elementTop < window.innerHeight;

        if (isVisible) {
          const distanceFromTop = elementBottom;
          if (distanceFromTop > 0 && distanceFromTop < bestDistanceFromTop) {
            bestDistanceFromTop = distanceFromTop;
            bestElement = id;
            break;
          }
        }
      }

      // Use untrack to read hash without creating a dependency
      // We don't want the effect to re-run when hash changes (would be circular)
      const currentHash = untrack(hash);
      if (bestElement && bestElement !== currentHash) {
        setHash(bestElement);
        history.replaceState(null, '', `#${bestElement}`);
      }
    }, 100); // Throttle to 100ms

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  return (
    <div class="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-6xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
      {/* Main content */}
      <div class="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
        <h1 class="mb-8 text-4xl font-medium">{props.title}</h1>

        <section id="description" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Description</h2>
          <p class="text-gray-700 dark:text-gray-300">{props.description}</p>
        </section>

        <Show when={props.usage}>
          <section id="usage" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Usage</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              To use the component, import it from the components directory:
            </p>
            <CodeBlock code={props.usage!} />
          </section>
        </Show>

        <Show when={propsArray().length > 0}>
          <section id="props" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Props</h2>
            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Prop
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Default
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  <For each={propsArray()}>
                    {(prop) => (
                      <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                          <span class="flex items-center gap-2">
                            {prop.name}
                            <Show when={prop.required}>
                              <span class="text-xs text-red-500">*</span>
                            </Show>
                            <Show when={prop.deprecated}>
                              <span class="rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                deprecated
                              </span>
                            </Show>
                          </span>
                        </td>
                        <td class="px-6 py-4 text-xs whitespace-nowrap">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-blue-400">
                            {prop.type}
                          </code>
                        </td>
                        <td class="px-6 py-4 text-xs whitespace-nowrap">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-green-400">
                            {prop.default}
                          </code>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {prop.description}
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </section>
        </Show>

        <Show when={examplesArray().length > 0}>
          <section id="examples" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Examples</h2>
            <div class="space-y-6">
              <For each={examplesArray()}>
                {(example) => (
                  <div id={getExampleId(example.title)} class="scroll-mt-16">
                    <Example
                      title={example.title}
                      description={example.description}
                      code={example.code}
                      component={example.component}
                    />
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>

        {props.children}
      </div>

      {/* Table of contents sidebar */}
      <div class="max-xl:hidden">
        <div class="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden px-6 pt-10 pb-24">
          <div class="flex flex-col gap-3">
            <h3 class="font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase sm:text-xs/6 dark:text-gray-400">
              On this page
            </h3>
            <ul class="flex flex-col gap-2 border-l border-[color-mix(in_oklab,_var(--color-gray-950),white_90%)] dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
              <For each={SECTIONS}>
                {(section) => (
                  <li class="-ml-px flex flex-col items-start gap-2">
                    <a
                      aria-current={section.id === hash() ? 'location' : undefined}
                      onClick={() => setHash(section.id)}
                      href={`#${section.id}`}
                      class="inline-block border-l border-transparent pl-5 text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 sm:pl-4 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white dark:aria-[current]:border-white dark:aria-[current]:text-white"
                    >
                      {section.title}
                    </a>
                    <Show when={section.id === 'examples' && examplesArray().length > 0}>
                      <ul class="flex flex-col gap-2 border-l border-transparent dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
                        <For each={examplesArray()}>
                          {(example) => {
                            // Use derived signal to maintain reactivity if example.title changes
                            const exampleId = () => getExampleId(example.title);
                            return (
                              <li class="-ml-px flex flex-col items-start gap-2">
                                <a
                                  aria-current={
                                    exampleId() === hash() ? 'location' : undefined
                                  }
                                  onClick={() => setHash(exampleId())}
                                  href={`#${exampleId()}`}
                                  class="inline-block border-l border-transparent pl-8 text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 sm:pl-7.5 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white dark:aria-[current]:border-white dark:aria-[current]:text-white"
                                >
                                  {example.title}
                                </a>
                              </li>
                            );
                          }}
                        </For>
                      </ul>
                    </Show>
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

// Exported for reuse in other documentation pages
export function CodeBlock(props: { code: string }): JSX.Element {
  const [copied, setCopied] = createSignal(false);
  const [isDark, setIsDark] = createSignal(false);

  // Track global theme via document.documentElement class
  onMount(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();

    // Observe changes to the html element's class
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    onCleanup(() => observer.disconnect());
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = props.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div class="group relative">
      <button
        type="button"
        onClick={() => void handleCopy()}
        class="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-md bg-gray-200/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-300 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
        aria-label={copied() ? 'Copied!' : 'Copy code'}
      >
        <Show
          when={copied()}
          fallback={
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          }
        >
          <svg
            class="size-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </Show>
        {copied() ? 'Copied!' : 'Copy'}
      </button>
      <div innerHTML={formatCodeToHTML(props.code, isDark() ? 'dark' : 'light')} />
    </div>
  );
}

interface ExampleProps {
  title: string;
  description?: string;
  code: string;
  component: () => JSX.Element;
}

export function Example(props: ExampleProps): JSX.Element {
  const [previewOverride, setPreviewOverride] = createSignal<'light' | 'dark' | null>(
    null,
  );
  const [copied, setCopied] = createSignal(false);
  const [globalIsDark, setGlobalIsDark] = createSignal(false);

  // Track global theme changes
  onMount(() => {
    const updateGlobalTheme = () => {
      setGlobalIsDark(document.documentElement.classList.contains('dark'));
    };

    updateGlobalTheme();

    // Observe changes to the html element's class
    const observer = new MutationObserver(updateGlobalTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    onCleanup(() => observer.disconnect());
  });

  // Determine if preview should be dark
  // If override is set, use it; otherwise follow global theme
  const isPreviewDark = () => {
    if (previewOverride() !== null) {
      return previewOverride() === 'dark';
    }
    return globalIsDark();
  };

  // Toggle preview between light/dark (opposite of current state)
  const togglePreview = () => {
    const currentlyDark = isPreviewDark();
    setPreviewOverride(currentlyDark ? 'light' : 'dark');
  };

  // Reset to follow global theme
  const resetToGlobal = () => setPreviewOverride(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = props.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 class="text-xl font-medium dark:text-white">{props.title}</h3>
        <div class="flex items-center gap-2">
          <Show when={previewOverride() !== null}>
            <button
              type="button"
              onClick={resetToGlobal}
              class="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Reset
            </button>
          </Show>
          <button
            type="button"
            onClick={togglePreview}
            class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            aria-label={isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'}
            title={isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'}
          >
            <Show
              when={isPreviewDark()}
              fallback={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
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
            </Show>
          </button>
        </div>
      </div>
      {/* Component preview - isolated theme context */}
      {/* Use explicit colors instead of dark: variants to truly isolate from global theme */}
      <div class={isPreviewDark() ? 'dark' : ''}>
        <div
          class="px-4 py-6"
          style={{ "background-color": isPreviewDark() ? 'rgb(31 41 55)' : 'rgb(255 255 255)' }}
        >
          <Show when={props.description}>
            <p
              class="mb-4"
              style={{ color: isPreviewDark() ? 'rgb(209 213 219)' : 'rgb(55 65 81)' }}
            >
              {props.description}
            </p>
          </Show>
          <div class="flex flex-wrap items-center gap-2">{props.component()}</div>
        </div>
      </div>
      {/* Code block - follows global theme, not preview toggle */}
      <div class="group relative border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => void handleCopy()}
          class="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-md bg-gray-200/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-300 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label={copied() ? 'Copied!' : 'Copy code'}
        >
          <Show
            when={copied()}
            fallback={
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            }
          >
            <svg
              class="size-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </Show>
          {copied() ? 'Copied!' : 'Copy'}
        </button>
        {/* Code follows global theme */}
        <div
          innerHTML={formatCodeToHTML(props.code, globalIsDark() ? 'dark' : 'light')}
        />
      </div>
    </div>
  );
}
