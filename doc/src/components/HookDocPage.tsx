import {
  For,
  type JSX,
  type ParentProps,
  Show,
  createMemo,
  createSignal,
} from 'solid-js';

import {
  AlertTriangleIcon,
  CheckIcon,
  Copy01Icon,
  Database01Icon,
  Link01Icon,
} from '@kayou/icons';

import { dedent } from '../helpers/dedent';
import BaseDocPage, {
  type RelatedItemDefinition,
  type SectionId,
} from './BaseDocPage';
import ReadonlyCode from './ReadonlyCode';

interface ParameterDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface ReturnPropertyDefinition {
  name: string;
  type: string;
  description: string;
}

interface ProviderPropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
}

interface ProviderDefinition {
  name: string;
  description: string;
  props: ProviderPropDefinition[];
  example?: string;
}

interface TypePropertyDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface TypeDefinition {
  name: string;
  description: string;
  props?: TypePropertyDefinition[];
  values?: string[];
}

interface HookDocPageProps {
  title: string;
  description: string;
  relatedHooks?: RelatedItemDefinition[];
  relatedContexts?: RelatedItemDefinition[];
  parameters?: ParameterDefinition[];
  returns?: ReturnPropertyDefinition[];
  returnType?: string;
  usage?: string;
  provider?: ProviderDefinition;
  types?: TypeDefinition[];
}

export default function HookDocPage(props: ParentProps<HookDocPageProps>): JSX.Element {
  const relatedHooks = createMemo(() => props.relatedHooks ?? []);
  const relatedContexts = createMemo(() => props.relatedContexts ?? []);
  const parametersArray = createMemo(() => props.parameters ?? []);
  const returnsArray = createMemo(() => props.returns ?? []);
  const typesArray = createMemo(() => props.types ?? []);

  const visibleSections = createMemo(() => {
    const sections = new Set<SectionId>();
    if (relatedHooks().length > 0) sections.add('related-hooks');
    if (relatedContexts().length > 0) sections.add('related-contexts');
    if (props.provider) sections.add('provider');
    if (props.usage) sections.add('usage');
    if (parametersArray().length > 0) sections.add('props');
    sections.add('returns');
    if (typesArray().length > 0) sections.add('types');
    return sections;
  });

  return (
    <BaseDocPage
      title={props.title}
      description={props.description}
      visibleSections={visibleSections()}
    >
      <Show when={relatedHooks().length > 0}>
        <section id="related-hooks" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Related Hooks</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <For each={relatedHooks()}>
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

      <Show when={relatedContexts().length > 0}>
        <section id="related-contexts" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Related Contexts</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <For each={relatedContexts()}>
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
            Import the hook from the library:
          </p>
          <CodeBlock code={dedent`${props.usage!}`} />
        </section>
      </Show>

      <Show when={parametersArray().length > 0}>
        <section id="props" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Props</h2>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
              <thead class="bg-gray-50 dark:bg-neutral-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Prop
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                <For each={parametersArray()}>
                  {(param) => (
                    <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                      <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        <span class="flex items-center gap-2">
                          {param.name}
                          <Show when={param.required}>
                            <span class="text-xs text-red-500">*</span>
                          </Show>
                        </span>
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-xs">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-blue-400">
                          {param.type}
                        </code>
                      </td>
                      <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-neutral-400">
                        {param.description}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-xs">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-green-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-green-400">
                          {param.default ?? '-'}
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

      <section id="returns" class="mb-8 scroll-mt-20">
        <h2 class="mb-4 text-2xl font-medium">Returns</h2>
        <Show when={props.returnType}>
          <p class="mb-4 text-gray-700 dark:text-neutral-300">
            Type:{' '}
            <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-sm text-purple-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-purple-400">
              {props.returnType}
            </code>
          </p>
        </Show>
        <Show when={returnsArray().length > 0}>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
              <thead class="bg-gray-50 dark:bg-neutral-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Property
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                <For each={returnsArray()}>
                  {(prop) => (
                    <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                      <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {prop.name}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-xs">
                        <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-blue-400">
                          {prop.type}
                        </code>
                      </td>
                      <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-neutral-400">
                        {prop.description}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </section>

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
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Prop
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Description
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                  <For each={props.provider!.props}>
                    {(prop) => (
                      <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
                        <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          <span class="flex items-center gap-2">
                            {prop.name}
                            <Show when={prop.required}>
                              <span class="text-xs text-red-500">*</span>
                            </Show>
                          </span>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 text-xs">
                          <code class="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-blue-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-blue-400">
                            {prop.type}
                          </code>
                        </td>
                        <td class="min-w-[400px] px-6 py-4 text-sm text-gray-500 dark:text-neutral-400">
                          {prop.description}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 text-xs">
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

      <Show when={typesArray().length > 0}>
        <section id="types" class="mb-8 scroll-mt-20">
          <h2 class="mb-4 text-2xl font-medium">Types</h2>
          <div class="space-y-6">
            <For each={typesArray()}>
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
                        <Show when={typeDef.props && typeDef.props.length > 0}>
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
                                        {prop.name}
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
                                          {prop.default ?? '-'}
                                        </code>
                                      </td>
                                    </tr>
                                  )}
                                </For>
                              </tbody>
                            </table>
                          </div>
                        </Show>
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

      {props.children}

    </BaseDocPage>
  );
}

function CodeBlock(props: { code: string }): JSX.Element {
  const [copied, setCopied] = createSignal(false);
  const code = () => dedent`${props.code}`;

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
        class="absolute right-3 top-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-200/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100 dark:bg-neutral-700/80 dark:text-neutral-300 dark:hover:bg-neutral-600"
        aria-label={copied() ? 'Copied!' : 'Copy code'}
      >
        <Show when={copied()} fallback={<Copy01Icon class="size-4" />}>
          <CheckIcon class="size-4 text-green-600" />
        </Show>
        {copied() ? 'Copied!' : 'Copy'}
      </button>
      <ReadonlyCode code={code()} />
    </div>
  );
}
