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

import { formatCodeToHTML } from '../helpers/formatCodeToHTML';
import BaseDocPage, {
  type ExampleDefinition as BaseExampleDefinition,
  type KeyConceptDefinition,
  type RelatedItemDefinition,
  type SectionId,
  getExampleId,
} from './BaseDocPage';

interface PropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
  deprecated?: boolean;
}

interface ExampleDefinition extends BaseExampleDefinition {
  component: () => JSX.Element;
}

interface SubComponentPropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
}

interface SubComponentDefinition {
  name: string;
  description: string;
  props: SubComponentPropDefinition[];
}

interface DependencyDefinition {
  name: string;
  url: string;
  usage: string;
}

interface DocPageProps {
  title: string;
  description: string;
  dependencies?: DependencyDefinition[];
  keyConcepts?: KeyConceptDefinition[];
  relatedHooks?: RelatedItemDefinition[];
  relatedContexts?: RelatedItemDefinition[];
  props?: PropDefinition[];
  subComponents?: SubComponentDefinition[];
  examples?: ExampleDefinition[];
  usage?: string;
  isPro?: boolean;
}

export default function DocPage(props: ParentProps<DocPageProps>): JSX.Element {
  const propsArray = createMemo(() => props.props ?? []);
  const subComponentsArray = createMemo(() => props.subComponents ?? []);
  const examplesArray = createMemo(() => props.examples ?? []);
  const relatedHooksArray = createMemo(() => props.relatedHooks ?? []);
  const relatedContextsArray = createMemo(() => props.relatedContexts ?? []);

  const dependenciesArray = createMemo(() => props.dependencies ?? []);

  // Compute which sections have content
  const visibleSections = createMemo(() => {
    const sections = new Set<SectionId>();
    if (dependenciesArray().length > 0) sections.add('dependencies');
    if (props.keyConcepts && props.keyConcepts.length > 0) sections.add('key-concepts');
    if (relatedHooksArray().length > 0) sections.add('related-hooks');
    if (relatedContextsArray().length > 0) sections.add('related-contexts');
    if (props.usage) sections.add('usage');
    if (propsArray().length > 0) sections.add('props');
    if (subComponentsArray().length > 0) sections.add('sub-components');
    if (examplesArray().length > 0) sections.add('examples');
    return sections;
  });

  const exampleTitles = createMemo(() => examplesArray().map((e) => e.title));

  return (
    <BaseDocPage
      title={props.title}
      description={props.description}
      isPro={props.isPro}
      visibleSections={visibleSections()}
      exampleTitles={exampleTitles()}
    >
      <Show when={dependenciesArray().length > 0}>
        <section id="dependencies" class="mb-10 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">
            Dependencies
            <span class="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-normal text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {dependenciesArray().length}
            </span>
          </h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This component uses the following external packages:
          </p>
          <div class="space-y-3">
            <For each={dependenciesArray()}>
              {(dep) => (
                <a
                  href={dep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-orange-300 hover:bg-orange-50/50 dark:border-gray-700 dark:hover:border-orange-600 dark:hover:bg-orange-900/20"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      {dep.name}
                      <svg
                        class="size-3.5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {dep.usage}
                    </p>
                  </div>
                </a>
              )}
            </For>
          </div>
        </section>
      </Show>

      <Show when={props.keyConcepts && props.keyConcepts.length > 0}>
        <section id="key-concepts" class="mb-10 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Key Concepts</h2>
          <dl class="grid gap-3 sm:grid-cols-2">
            <For each={props.keyConcepts}>
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
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This component uses the following hooks internally:
          </p>
          <div class="space-y-3">
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

      <Show when={relatedContextsArray().length > 0}>
        <section id="related-contexts" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Related Contexts</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This component uses the following contexts:
          </p>
          <div class="space-y-3">
            <For each={relatedContextsArray()}>
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
              <thead class="bg-gray-50 dark:bg-gray-900">
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
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-blue-400">
                          {prop.type}
                        </code>
                      </td>
                      <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {prop.description}
                      </td>
                      <td class="px-6 py-4 text-xs whitespace-nowrap">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-green-400">
                          {prop.default}
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

      <Show when={subComponentsArray().length > 0}>
        <section id="sub-components" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Sub-components</h2>
          <div class="space-y-8">
            <For each={subComponentsArray()}>
              {(component) => (
                <div>
                  <h3 class="mb-2 text-xl font-medium">{component.name}</h3>
                  <p class="mb-4 text-gray-600 dark:text-gray-400">
                    {component.description}
                  </p>
                  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead class="bg-gray-50 dark:bg-gray-900">
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
                        <For each={component.props}>
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
                                <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-blue-400">
                                  {prop.type}
                                </code>
                              </td>
                              <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {prop.description}
                              </td>
                              <td class="px-6 py-4 text-xs whitespace-nowrap">
                                <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-green-400">
                                  {prop.default}
                                </code>
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </div>
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
    </BaseDocPage>
  );
}

// Exported for reuse in other documentation pages
export function CodeBlock(props: { code: string }): JSX.Element {
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

interface ExampleProps {
  title: string;
  description?: string;
  code: string;
  component: () => JSX.Element;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const DesktopIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const TabletIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const MobileIcon = () => (
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

export function Example(props: ExampleProps): JSX.Element {
  const [previewOverride, setPreviewOverride] = createSignal<'light' | 'dark' | null>(
    null,
  );
  const [copied, setCopied] = createSignal(false);
  const [globalIsDark, setGlobalIsDark] = createSignal(false);
  const [viewport, setViewport] = createSignal<ViewportSize>('desktop');

  onMount(() => {
    const updateGlobalTheme = () => {
      setGlobalIsDark(document.documentElement.classList.contains('dark'));
    };
    updateGlobalTheme();
    const observer = new MutationObserver(updateGlobalTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    onCleanup(() => observer.disconnect());
  });

  const isPreviewDark = () => {
    if (previewOverride() !== null) return previewOverride() === 'dark';
    return globalIsDark();
  };

  const togglePreview = () => {
    const currentlyDark = isPreviewDark();
    setPreviewOverride(currentlyDark ? 'light' : 'dark');
  };

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
      <div class="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <h3 class="text-xl font-medium dark:text-white">{props.title}</h3>
        <div class="flex items-center gap-2">
          <div class="flex items-center rounded-md border border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              class={`p-2 transition-colors ${viewport() === 'desktop' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'}`}
              aria-label="Desktop view"
              title="Desktop view"
            >
              <DesktopIcon />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              class={`border-x border-gray-200 p-2 transition-colors dark:border-gray-600 ${viewport() === 'tablet' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'}`}
              aria-label="Tablet view"
              title="Tablet view (768px)"
            >
              <TabletIcon />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              class={`p-2 transition-colors ${viewport() === 'mobile' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'}`}
              aria-label="Mobile view"
              title="Mobile view (375px)"
            >
              <MobileIcon />
            </button>
          </div>
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
            aria-label={
              isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'
            }
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
      <div
        class="overflow-x-auto"
        style={{
          'background-color': isPreviewDark() ? 'rgb(17 24 39)' : 'rgb(243 244 246)',
        }}
      >
        <div
          class={`mx-auto transition-all duration-300 ${isPreviewDark() ? 'dark' : ''}`}
          style={{
            width: VIEWPORT_WIDTHS[viewport()],
            'min-width':
              viewport() !== 'desktop' ? VIEWPORT_WIDTHS[viewport()] : undefined,
          }}
        >
          <div
            class="px-4 py-6"
            style={{
              'background-color': isPreviewDark() ? 'rgb(31 41 55)' : 'rgb(255 255 255)',
            }}
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
      </div>
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
        <div
          innerHTML={formatCodeToHTML(props.code, globalIsDark() ? 'dark' : 'light')}
        />
      </div>
    </div>
  );
}
