/* eslint-disable solid/no-innerhtml */
import {
  For,
  type JSX,
  type ParentProps,
  Show,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import { dedent } from '../helpers/dedent';
import { formatCodeToHTML } from '../helpers/formatCodeToHTML';
import BaseDocPage, {
  type ExampleDefinition,
  type KeyConceptDefinition,
  type RelatedItemDefinition,
  type SectionId,
  getExampleId,
} from './BaseDocPage';

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

interface ContextDocPageProps {
  title: string;
  description: string;
  keyConcepts?: KeyConceptDefinition[];
  relatedHooks?: RelatedItemDefinition[];
  relatedContexts?: RelatedItemDefinition[];
  providerProps?: PropDefinition[];
  contextValue?: ContextValueDefinition[];
  contextType?: string;
  examples?: ExampleDefinition[];
  usage?: string;
}

export default function ContextDocPage(
  props: ParentProps<ContextDocPageProps>,
): JSX.Element {
  const keyConcepts = createMemo(() => props.keyConcepts ?? []);
  const relatedHooksArray = createMemo(() => props.relatedHooks ?? []);
  const relatedContexts = createMemo(() => props.relatedContexts ?? []);
  const providerPropsArray = createMemo(() => props.providerProps ?? []);
  const contextValueArray = createMemo(() => props.contextValue ?? []);
  const examplesArray = createMemo(() => props.examples ?? []);

  // Compute which sections have content
  const visibleSections = createMemo(() => {
    const sections = new Set<SectionId>();
    if (keyConcepts().length > 0) sections.add('key-concepts');
    if (relatedHooksArray().length > 0) sections.add('related-hooks');
    if (relatedContexts().length > 0) sections.add('related-contexts');
    if (props.usage) sections.add('usage');
    if (providerPropsArray().length > 0) sections.add('props');
    if (contextValueArray().length > 0) sections.add('sub-components');
    if (examplesArray().length > 0) sections.add('examples');
    return sections;
  });

  const exampleTitles = createMemo(() => examplesArray().map((e) => e.title));

  return (
    <BaseDocPage
      title={props.title}
      description={props.description}
      visibleSections={visibleSections()}
      exampleTitles={exampleTitles()}
    >
      <Show when={keyConcepts().length > 0}>
        <section id="key-concepts" class="mb-10 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Key Concepts</h2>
          <dl class="grid gap-3 sm:grid-cols-2">
            <For each={keyConcepts()}>
              {(concept) => (
                <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                  <dt class="font-medium text-gray-900 dark:text-white">
                    {concept.term}
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                    {concept.explanation}
                  </dd>
                </div>
              )}
            </For>
          </dl>
        </section>
      </Show>

      <Show when={relatedHooksArray().length > 0}>
        <section id="related-hooks" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Related Hooks</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <For each={relatedHooksArray()}>
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
                    <h3 class="font-medium text-gray-900 dark:text-white">{hook.name}</h3>
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

      <Show when={relatedContexts().length > 0}>
        <section id="related-contexts" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Related Contexts</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <For each={relatedContexts()}>
              {(context) => (
                <a
                  href={context.path}
                  class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300 hover:bg-purple-50/50 dark:border-gray-700 dark:hover:border-purple-600 dark:hover:bg-purple-900/20"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {context.name}
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {context.description}
                    </p>
                  </div>
                </a>
              )}
            </For>
          </div>
        </section>
      </Show>

      <Show when={props.usage}>
        <section id="usage" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Usage</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Wrap your application with the provider:
          </p>
          <CodeBlock code={dedent`${props.usage!}`} />
        </section>
      </Show>

      <Show when={providerPropsArray().length > 0}>
        <section id="props" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Props</h2>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Prop
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                <For each={providerPropsArray()}>
                  {(prop) => (
                    <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        <span class="flex items-center gap-2">
                          {prop.name}
                          <Show when={prop.required}>
                            <span class="text-xs text-red-500">*</span>
                          </Show>
                        </span>
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-xs">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-blue-400">
                          {prop.type}
                        </code>
                      </td>
                      <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {prop.description}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-xs">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-green-400">
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

      <Show when={contextValueArray().length > 0}>
        <section id="sub-components" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Sub-components</h2>
          <Show when={props.contextType}>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              The context provides:{' '}
              <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-sm text-purple-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-purple-400">
                {props.contextType}
              </code>
            </p>
          </Show>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Property
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                <For each={contextValueArray()}>
                  {(value) => (
                    <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {value.name}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-xs">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-blue-400">
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
    </BaseDocPage>
  );
}

function CodeBlock(props: { code: string }): JSX.Element {
  const [copied, setCopied] = createSignal(false);
  const [isDark, setIsDark] = createSignal(false);
  const code = () => dedent`${props.code}`;

  onMount(() => {
    const updateTheme = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
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
      await navigator.clipboard.writeText(code());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code();
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
        class="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-gray-200/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"
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
      <div innerHTML={formatCodeToHTML(code(), isDark() ? 'dark' : 'light')} />
    </div>
  );
}

interface CodeExampleProps {
  title: string;
  description?: string;
  code?: string;
}

function CodeExample(props: CodeExampleProps): JSX.Element {
  const [copied, setCopied] = createSignal(false);
  const [isDark, setIsDark] = createSignal(false);

  const code = () => (props.code ? dedent`${props.code}` : '');

  onMount(() => {
    const updateTheme = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
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
      await navigator.clipboard.writeText(code());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code();
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
      <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <h3 class="text-lg font-medium dark:text-white">{props.title}</h3>
      </div>
      <Show when={props.description}>
        <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{props.description}</p>
        </div>
      </Show>
      <div class="group relative">
        <button
          type="button"
          onClick={() => void handleCopy()}
          class="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-gray-200/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
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
        <div innerHTML={formatCodeToHTML(code(), isDark() ? 'dark' : 'light')} />
      </div>
    </div>
  );
}
