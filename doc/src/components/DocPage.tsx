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

import { PortalContainerProvider } from '@kayou/hooks';
import {
  AlertTriangleIcon,
  CheckIcon,
  Copy01Icon,
  Cube01Icon,
  Database01Icon,
  Link01Icon,
  LinkExternal01Icon,
  Monitor01Icon,
  Moon01Icon,
  Phone01Icon,
  SunIcon,
  Tablet01Icon,
} from '@kayou/icons';

import { dedent } from '../helpers/dedent';
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
  /**
   * Properties for complex types/interfaces. Use this for types with multiple fields.
   */
  props?: SubComponentPropDefinition[];
  /**
   * Values for simple union types (e.g., "top" | "bottom" | "left" | "right").
   * When provided, displays as inline code instead of a table.
   */
  values?: string[];
  /**
   * Kind of sub-component:
   * - 'component': A composable JSX component used like <Parent><SubComponent /></Parent>
   * - 'type': A TypeScript type/interface used for prop data (e.g., items: SidebarItem[])
   * Default is 'component' for backward compatibility.
   */
  kind?: 'component' | 'type';
}

interface DependencyDefinition {
  name: string;
  url: string;
  usage: string;
}

interface ProviderDefinition {
  name: string;
  description: string;
  props: PropDefinition[];
  /** Example code showing how to set up the provider */
  example?: string;
}

interface DocPageProps {
  title: string;
  description: string;
  dependencies?: DependencyDefinition[];
  keyConcepts?: KeyConceptDefinition[];
  /** Required context provider that must wrap this component */
  provider?: ProviderDefinition;
  relatedHooks?: RelatedItemDefinition[];
  relatedContexts?: RelatedItemDefinition[];
  props?: PropDefinition[];
  subComponents?: SubComponentDefinition[];
  examples?: ExampleDefinition[];
  usage?: string;
}

export default function DocPage(props: ParentProps<DocPageProps>): JSX.Element {
  const propsArray = createMemo(() => props.props ?? []);
  const subComponentsArray = createMemo(() => props.subComponents ?? []);
  // Split sub-components by kind: components (used as JSX) vs types (data interfaces)
  const jsxSubComponents = createMemo(() =>
    subComponentsArray().filter((sc) => sc.kind !== 'type'),
  );
  const typeDefinitions = createMemo(() =>
    subComponentsArray().filter((sc) => sc.kind === 'type'),
  );
  const examplesArray = createMemo(() => props.examples ?? []);
  const relatedHooksArray = createMemo(() => props.relatedHooks ?? []);
  const relatedContextsArray = createMemo(() => props.relatedContexts ?? []);

  const dependenciesArray = createMemo(() => props.dependencies ?? []);

  // Compute which sections have content
  const visibleSections = createMemo(() => {
    const sections = new Set<SectionId>();
    if (dependenciesArray().length > 0) sections.add('dependencies');
    if (props.keyConcepts && props.keyConcepts.length > 0) sections.add('key-concepts');
    if (props.provider) sections.add('provider');
    if (relatedHooksArray().length > 0) sections.add('related-hooks');
    if (relatedContextsArray().length > 0) sections.add('related-contexts');
    if (props.usage) sections.add('usage');
    if (propsArray().length > 0) sections.add('props');
    if (jsxSubComponents().length > 0) sections.add('sub-components');
    if (typeDefinitions().length > 0) sections.add('types');
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
      <Show when={dependenciesArray().length > 0}>
        <section id="dependencies" class="mb-10 scroll-mt-20">
          <h2 class="mb-4 flex items-center text-2xl font-medium">
            Dependencies
            <span class="ml-2 rounded-full bg-gray-800 px-2.5 py-0.5 text-sm font-normal text-white dark:bg-neutral-700">
              {dependenciesArray().length}
            </span>
          </h2>
          <p class="mb-4 text-gray-700 dark:text-neutral-300">
            This component uses the following external packages:
          </p>
          <div class="space-y-3">
            <For each={dependenciesArray()}>
              {(dep) => (
                <a
                  href={dep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-orange-300 hover:bg-orange-50/50 dark:border-neutral-800 dark:hover:border-orange-600 dark:hover:bg-orange-900/20"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    <Cube01Icon class="size-5" />
                  </div>
                  <div class="flex-1">
                    <h3 class="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      {dep.name}
                      <LinkExternal01Icon class="size-3.5 text-gray-400" />
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">
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
                <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/30">
                  <dt class="font-medium text-gray-900 dark:text-white">
                    {concept.term}
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-600 dark:text-neutral-400">
                    {concept.explanation}
                  </dd>
                </div>
              )}
            </For>
          </dl>
        </section>
      </Show>

      <Show when={props.provider}>
        <section id="provider" class="mb-10 scroll-mt-20">
          <h2 class="mb-4 flex items-center gap-2 text-2xl font-medium">
            Required Provider
            <span class="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-normal text-red-700 dark:bg-red-900/30 dark:text-red-400">
              Required
            </span>
          </h2>
          <div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
            <div class="flex gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <AlertTriangleIcon class="size-5" />
              </div>
              <div>
                <h3 class="font-medium text-amber-900 dark:text-amber-200">
                  {props.provider!.name}
                </h3>
                <p class="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  {props.provider!.description}
                </p>
              </div>
            </div>
          </div>
          <Show when={props.provider!.example}>
            <div class="mb-6">
              <h3 class="mb-2 text-lg font-medium">Setup Example</h3>
              <CodeBlock code={props.provider!.example!} />
            </div>
          </Show>
          <Show when={props.provider!.props.length > 0}>
            <h3 class="mb-3 text-lg font-medium">Provider Props</h3>
            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                <thead class="bg-gray-50 dark:bg-neutral-900">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                      Prop
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                      Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                      Description
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                  <For each={props.provider!.props}>
                    {(prop) => (
                      <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                        <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                          <span class="flex items-center gap-2">
                            {prop.name}
                            <Show when={prop.required}>
                              <span class="text-xs text-red-500">*</span>
                            </Show>
                          </span>
                        </td>
                        <td class="px-6 py-4 text-xs whitespace-nowrap">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-blue-400">
                            {prop.type}
                          </code>
                        </td>
                        <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-neutral-400">
                          {prop.description}
                        </td>
                        <td class="px-6 py-4 text-xs whitespace-nowrap">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-green-400">
                            {prop.default}
                          </code>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </section>
      </Show>

      <Show when={relatedHooksArray().length > 0}>
        <section id="related-hooks" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Related Hooks</h2>
          <p class="mb-4 text-gray-700 dark:text-neutral-300">
            This component uses the following hooks internally:
          </p>
          <div class="space-y-3">
            <For each={relatedHooksArray()}>
              {(hook) => (
                <a
                  href={hook.path}
                  class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-neutral-800 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Link01Icon class="size-5" />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">{hook.name}</h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">
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
          <p class="mb-4 text-gray-700 dark:text-neutral-300">
            This component uses the following contexts:
          </p>
          <div class="space-y-3">
            <For each={relatedContextsArray()}>
              {(context) => (
                <a
                  href={context.path}
                  class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300 hover:bg-purple-50/50 dark:border-neutral-800 dark:hover:border-purple-600 dark:hover:bg-purple-900/20"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Database01Icon class="size-5" />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {context.name}
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">
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
          <p class="mb-4 text-gray-700 dark:text-neutral-300">
            To use the component, import it from the components directory:
          </p>
          <CodeBlock code={props.usage!} />
        </section>
      </Show>

      <Show when={propsArray().length > 0}>
        <section id="props" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Props</h2>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
              <thead class="bg-gray-50 dark:bg-neutral-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                    Prop
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                <For each={propsArray()}>
                  {(prop) => (
                    <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
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
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-blue-400">
                          {prop.type}
                        </code>
                      </td>
                      <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-neutral-400">
                        {prop.description}
                      </td>
                      <td class="px-6 py-4 text-xs whitespace-nowrap">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-green-400">
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

      <Show when={jsxSubComponents().length > 0}>
        <section id="sub-components" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Sub-components</h2>
          <div class="space-y-8">
            <For each={jsxSubComponents()}>
              {(component) => (
                <div>
                  <h3 class="mb-2 text-xl font-medium">{component.name}</h3>
                  <p class="mb-4 text-gray-600 dark:text-neutral-400">
                    {component.description}
                  </p>
                  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                      <thead class="bg-gray-50 dark:bg-neutral-900">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                            Prop
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                            Type
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                            Description
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                            Default
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                        <For each={component.props}>
                          {(prop) => (
                            <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                              <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                <span class="flex items-center gap-2">
                                  {prop.name}
                                  <Show when={prop.required}>
                                    <span class="text-xs text-red-500">*</span>
                                  </Show>
                                </span>
                              </td>
                              <td class="px-6 py-4 text-xs whitespace-nowrap">
                                <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-blue-400">
                                  {prop.type}
                                </code>
                              </td>
                              <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-neutral-400">
                                {prop.description}
                              </td>
                              <td class="px-6 py-4 text-xs whitespace-nowrap">
                                <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-green-400">
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

      <Show when={typeDefinitions().length > 0}>
        <section id="types" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Types</h2>
          <div class="space-y-6">
            <For each={typeDefinitions()}>
              {(typeDef) => (
                <div>
                  <Show
                    when={typeDef.values}
                    fallback={
                      <>
                        <h3 class="mb-2 text-xl font-medium">{typeDef.name}</h3>
                        <p class="mb-4 text-gray-600 dark:text-neutral-400">
                          {typeDef.description}
                        </p>
                        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
                          <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                            <thead class="bg-gray-50 dark:bg-neutral-900">
                              <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                                  Property
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                                  Type
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                                  Description
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                                  Default
                                </th>
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                              <For each={typeDef.props}>
                                {(prop) => (
                                  <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                                    <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                      <span class="flex items-center gap-2">
                                        {prop.name}
                                        <Show when={prop.required}>
                                          <span class="text-xs text-red-500">*</span>
                                        </Show>
                                      </span>
                                    </td>
                                    <td class="px-6 py-4 text-xs whitespace-nowrap">
                                      <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-blue-400">
                                        {prop.type}
                                      </code>
                                    </td>
                                    <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-neutral-400">
                                      {prop.description}
                                    </td>
                                    <td class="px-6 py-4 text-xs whitespace-nowrap">
                                      <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-green-400">
                                        {prop.default}
                                      </code>
                                    </td>
                                  </tr>
                                )}
                              </For>
                            </tbody>
                          </table>
                        </div>
                      </>
                    }
                  >
                    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                      <div class="mb-2 flex items-center gap-2">
                        <code class="font-mono text-sm font-medium text-gray-900 dark:text-white">
                          {typeDef.name}
                        </code>
                        <span class="text-gray-400">=</span>
                      </div>
                      <code class="font-mono text-sm text-blue-600 dark:text-blue-400">
                        {typeDef.values!.map((v) => `"${v}"`).join(' | ')}
                      </code>
                      <Show when={typeDef.description}>
                        <p class="mt-3 text-sm text-gray-600 dark:text-neutral-400">
                          {typeDef.description}
                        </p>
                      </Show>
                    </div>
                  </Show>
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

  // Auto-dedent the code to allow nicely indented template literals in source
  const code = createMemo(() => (props.code ? dedent`${props.code}` : ''));

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
    <div class="group relative rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => void handleCopy()}
        class="absolute top-3 right-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-200/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-300 dark:bg-neutral-700/80 dark:text-neutral-300 dark:hover:bg-neutral-600"
        aria-label={copied() ? 'Copied!' : 'Copy code'}
      >
        <Show when={copied()} fallback={<Copy01Icon class="size-4" />}>
          <CheckIcon class="size-4 text-green-600" />
        </Show>
        {copied() ? 'Copied!' : 'Copy'}
      </button>
      <div innerHTML={formatCodeToHTML(code())} />
    </div>
  );
}

interface ExampleProps {
  title: string;
  description?: string;
  /** Code string to display. Auto-generated by vite-plugin-extract-example-code if not provided. */
  code?: string;
  component: () => JSX.Element;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const DesktopIcon = () => <Monitor01Icon class="size-4" />;

const TabletIcon = () => <Tablet01Icon class="size-4" />;

const MobileIcon = () => <Phone01Icon class="size-4" />;

export function Example(props: ExampleProps): JSX.Element {
  const [previewOverride, setPreviewOverride] = createSignal<'light' | 'dark' | null>(
    null,
  );
  const [copied, setCopied] = createSignal(false);
  const [globalIsDark, setGlobalIsDark] = createSignal(false);
  const [viewport, setViewport] = createSignal<ViewportSize>('desktop');

  // Auto-dedent the code to allow nicely indented template literals in source
  const code = createMemo(() => (props.code ? dedent`${props.code}` : ''));

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
    <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
      <div class="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 class="text-xl font-medium dark:text-white">{props.title}</h3>
        <div class="flex items-center gap-2">
          <div class="flex items-center rounded-md border border-gray-200 dark:border-neutral-600 overflow-hidden">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              class={`cursor-pointer p-2 transition-colors ${viewport() === 'desktop' ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'}`}
              aria-label="Desktop view"
              title="Desktop view"
            >
              <DesktopIcon />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              class={`cursor-pointer border-x border-gray-200 p-2 transition-colors dark:border-neutral-600 ${viewport() === 'tablet' ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'}`}
              aria-label="Tablet view"
              title="Tablet view (768px)"
            >
              <TabletIcon />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              class={`cursor-pointer p-2 transition-colors ${viewport() === 'mobile' ? 'bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'}`}
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
              class="cursor-pointer rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              Reset
            </button>
          </Show>
          <button
            type="button"
            onClick={togglePreview}
            class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-600"
            aria-label={
              isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'
            }
            title={isPreviewDark() ? 'Preview in light mode' : 'Preview in dark mode'}
          >
            <Show when={isPreviewDark()} fallback={<Moon01Icon class="size-4" />}>
              <SunIcon class="size-4" />
            </Show>
          </button>
        </div>
      </div>
      <div>
        <PortalContainerProvider dark={isPreviewDark()}>
          <div
            class={`mx-auto transition-all duration-300 ${isPreviewDark() ? 'dark' : 'light'}`}
            style={{
              width: VIEWPORT_WIDTHS[viewport()],
              'min-width':
                viewport() !== 'desktop' ? VIEWPORT_WIDTHS[viewport()] : undefined,
            }}
          >
            <div class="bg-white px-4 py-6 dark:bg-neutral-950">
              <Show when={props.description}>
                <p class="mb-4 text-gray-700 dark:text-gray-300">{props.description}</p>
              </Show>
              <div class="flex flex-wrap items-center gap-2">{props.component()}</div>
            </div>
          </div>
        </PortalContainerProvider>
      </div>
      <div class="group relative border-t border-gray-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => void handleCopy()}
          class="absolute top-3 right-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-200/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-300 dark:bg-neutral-700/80 dark:text-neutral-300 dark:hover:bg-neutral-600"
          aria-label={copied() ? 'Copied!' : 'Copy code'}
        >
          <Show when={copied()} fallback={<Copy01Icon class="size-4" />}>
            <CheckIcon class="size-4 text-green-600" />
          </Show>
          {copied() ? 'Copied!' : 'Copy'}
        </button>
        <div innerHTML={formatCodeToHTML(code())} />
      </div>
    </div>
  );
}
