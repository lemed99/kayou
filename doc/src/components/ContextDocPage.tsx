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

const SECTIONS = [
  { id: 'description', title: 'Description' },
  { id: 'overview', title: 'Overview' },
  { id: 'when-to-use', title: 'When to Use' },
  { id: 'key-concepts', title: 'Key Concepts' },
  { id: 'value', title: 'Value' },
  { id: 'usage', title: 'Usage' },
  { id: 'provider-props', title: 'Provider Props' },
  { id: 'context-value', title: 'Context Value' },
  { id: 'related-hooks', title: 'Related Hooks' },
  { id: 'examples', title: 'Examples' },
] as const;

const getExampleId = (title: string): string => title.toLowerCase().replace(/\s+/g, '-');

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
  default?: string;
  description: string;
  required?: boolean;
}

interface ContextValueDefinition {
  name: string;
  type: string;
  description: string;
}

interface ExampleDefinition {
  title: string;
  description?: string;
  code: string;
}

interface KeyConceptDefinition {
  term: string;
  explanation: string;
}

interface RelatedHookDefinition {
  name: string;
  path: string;
  description: string;
}

interface ContextDocPageProps {
  title: string;
  description: string;
  /** Detailed explanation of how the context works internally */
  overview?: string;
  /** Common scenarios and use cases for this context */
  whenToUse?: string[];
  /** Key terms and concepts to understand */
  keyConcepts?: KeyConceptDefinition[];
  /** Why this context matters */
  value?: string;
  providerProps?: PropDefinition[];
  contextValue?: ContextValueDefinition[];
  contextType?: string;
  /** Hooks that consume this context */
  relatedHooks?: RelatedHookDefinition[];
  examples?: ExampleDefinition[];
  usage?: string;
}

export default function ContextDocPage(
  props: ParentProps<ContextDocPageProps>,
): JSX.Element {
  const [visibleSections, setVisibleSections] = createSignal<Set<string>>(new Set());
  const [elementCache, setElementCache] = createSignal<Map<string, HTMLElement>>(
    new Map(),
  );

  onMount(() => {
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      setVisibleSections(new Set([initialHash]));
    }
  });

  const providerPropsArray = createMemo(() => props.providerProps ?? []);
  const contextValueArray = createMemo(() => props.contextValue ?? []);
  const examplesArray = createMemo(() => props.examples ?? []);
  const relatedHooksArray = createMemo(() => props.relatedHooks ?? []);

  // Filter sections to only show those with content
  const visibleSectionsConfig = createMemo(() => {
    return SECTIONS.filter((section) => {
      switch (section.id) {
        case 'description':
          return true; // Always show
        case 'overview':
          return !!props.overview;
        case 'when-to-use':
          return props.whenToUse && props.whenToUse.length > 0;
        case 'key-concepts':
          return props.keyConcepts && props.keyConcepts.length > 0;
        case 'value':
          return !!props.value;
        case 'usage':
          return !!props.usage;
        case 'provider-props':
          return providerPropsArray().length > 0;
        case 'context-value':
          return contextValueArray().length > 0;
        case 'related-hooks':
          return relatedHooksArray().length > 0;
        case 'examples':
          return examplesArray().length > 0;
        default:
          return true;
      }
    });
  });

  createEffect(() => {
    const examples = examplesArray();
    const sections = visibleSectionsConfig();

    queueMicrotask(() => {
      const cache = new Map<string, HTMLElement>();

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) cache.set(section.id, el);
      }

      for (const example of examples) {
        const id = getExampleId(example.title);
        const el = document.getElementById(id);
        if (el) cache.set(id, el);
      }

      setElementCache(cache);
    });
  });

  createEffect(() => {
    const cache = elementCache();
    if (cache.size === 0) return;

    const examples = examplesArray();
    const sections = visibleSectionsConfig();
    const allIds = [
      ...sections.map((s) => s.id),
      ...examples.map((e) => getExampleId(e.title)),
    ];

    const handleScroll = throttle(() => {
      const newVisibleSections = new Set<string>();
      const headerOffset = 56;

      for (const id of allIds) {
        const element = cache.get(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top - headerOffset;
        const elementBottom = rect.bottom;

        const isVisible = elementBottom > headerOffset && elementTop < window.innerHeight;

        if (isVisible) {
          newVisibleSections.add(id);
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
    <div class="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-6xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
      <div class="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
        <h1 class="mb-8 text-4xl font-medium">{props.title}</h1>

        <section id="description" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Description</h2>
          <p class="text-gray-700 dark:text-gray-300">{props.description}</p>
        </section>

        <Show when={props.overview}>
          <section id="overview" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Overview</h2>
            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p class="leading-relaxed text-gray-700 dark:text-gray-300">
                {props.overview}
              </p>
            </div>
          </section>
        </Show>

        <Show when={props.whenToUse && props.whenToUse.length > 0}>
          <section id="when-to-use" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">When to Use</h2>
            <ul class="space-y-3">
              <For each={props.whenToUse}>
                {(useCase) => (
                  <li class="flex items-start gap-3">
                    <span class="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <svg class="size-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <span class="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </li>
                )}
              </For>
            </ul>
          </section>
        </Show>

        <Show when={props.keyConcepts && props.keyConcepts.length > 0}>
          <section id="key-concepts" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Key Concepts</h2>
            <dl class="space-y-4">
              <For each={props.keyConcepts}>
                {(concept) => (
                  <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <dt class="font-semibold text-gray-900 dark:text-white">
                      {concept.term}
                    </dt>
                    <dd class="mt-1 text-gray-600 dark:text-gray-400">
                      {concept.explanation}
                    </dd>
                  </div>
                )}
              </For>
            </dl>
          </section>
        </Show>

        <Show when={props.value}>
          <section id="value" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Value</h2>
            <div class="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:border-blue-400 dark:bg-blue-900/20">
              <p class="leading-relaxed text-gray-700 dark:text-gray-300">
                {props.value}
              </p>
            </div>
          </section>
        </Show>

        <Show when={props.usage}>
          <section id="usage" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Usage</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Wrap your application with the provider:
            </p>
            <CodeBlock code={props.usage!} />
          </section>
        </Show>

        <Show when={providerPropsArray().length > 0}>
          <section id="provider-props" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Provider Props</h2>
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
                      Description
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  <For each={providerPropsArray()}>
                    {(prop) => (
                      <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                          <span class="flex items-center gap-2">
                            {prop.name}
                            <Show when={prop.required}>
                              <span class="text-xs text-red-500">*</span>
                            </Show>
                          </span>
                        </td>
                        <td class="px-6 py-4 text-xs whitespace-nowrap">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-blue-400">
                            {prop.type}
                          </code>
                        </td>
                        <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {prop.description}
                        </td>
                        <td class="px-6 py-4 text-xs whitespace-nowrap">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-green-400">
                            {prop.default ?? '-'}
                          </code>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </section>
        </Show>

        <section id="context-value" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Context Value</h2>
          <Show when={props.contextType}>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              The context provides:{' '}
              <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-sm text-purple-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-purple-400">
                {props.contextType}
              </code>
            </p>
          </Show>
          <Show when={contextValueArray().length > 0}>
            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Property
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  <For each={contextValueArray()}>
                    {(value) => (
                      <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                          {value.name}
                        </td>
                        <td class="px-6 py-4 text-xs whitespace-nowrap">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-blue-400">
                            {value.type}
                          </code>
                        </td>
                        <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {value.description}
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </section>

        <Show when={props.relatedHooks && props.relatedHooks.length > 0}>
          <section id="related-hooks" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Related Hooks</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Use these hooks to access the context value:
            </p>
            <div class="space-y-3">
              <For each={props.relatedHooks}>
                {(hook) => (
                  <a
                    href={hook.path}
                    class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                  >
                    <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <svg
                        class="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-white">
                        {hook.name}
                      </h3>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {hook.description}
                      </p>
                    </div>
                  </a>
                )}
              </For>
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
                    <CodeExample
                      title={example.title}
                      description={example.description}
                      code={example.code}
                    />
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>

        {props.children}
      </div>

      <div class="max-xl:hidden">
        <div class="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden px-6 pt-10 pb-24">
          <div class="flex flex-col gap-3">
            <h3 class="font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase sm:text-xs/6 dark:text-gray-400">
              On this page
            </h3>
            <ul class="flex flex-col gap-2 border-l border-[color-mix(in_oklab,_var(--color-gray-950),white_90%)] dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
              <For each={visibleSectionsConfig()}>
                {(section) => (
                  <li class="-ml-px flex flex-col items-start gap-2">
                    <a
                      aria-current={
                        visibleSections().has(section.id) ? 'location' : undefined
                      }
                      href={`#${section.id}`}
                      class="inline-block border-l border-transparent pl-5 text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 sm:pl-4 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white dark:aria-[current]:border-white dark:aria-[current]:text-white"
                    >
                      {section.title}
                    </a>
                    <Show when={section.id === 'examples' && examplesArray().length > 0}>
                      <ul class="flex flex-col gap-2 border-l border-transparent dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
                        <For each={examplesArray()}>
                          {(example) => {
                            const exampleId = () => getExampleId(example.title);
                            return (
                              <li class="-ml-px flex flex-col items-start gap-2">
                                <a
                                  aria-current={
                                    visibleSections().has(exampleId())
                                      ? 'location'
                                      : undefined
                                  }
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

function CodeBlock(props: { code: string }): JSX.Element {
  const [copied, setCopied] = createSignal(false);
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();

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

interface CodeExampleProps {
  title: string;
  description?: string;
  code: string;
}

function CodeExample(props: CodeExampleProps): JSX.Element {
  const [copied, setCopied] = createSignal(false);
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();

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
      <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <h3 class="text-lg font-medium dark:text-white">{props.title}</h3>
      </div>
      <Show when={props.description}>
        <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{props.description}</p>
        </div>
      </Show>
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
    </div>
  );
}
