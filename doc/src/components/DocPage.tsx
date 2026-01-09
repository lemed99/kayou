/* eslint-disable solid/no-innerhtml */
import {
  For,
  type JSX,
  ParentProps,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from 'solid-js';

import { formatCodeToHTML } from '../../helpers/formatCodeToHTML';
import { MoonIcon, SunIcon } from '../../icons';

interface ExampleProps {
  title: string;
  description?: string;
  code: string;
  component: () => JSX.Element;
}

interface DocPageProps {
  title: string;
  description: string;
  props: {
    name: string;
    type: string;
    default: string;
    description: string;
  }[];
  examples: {
    title: string;
    description?: string;
    code: string;
    component: () => JSX.Element;
  }[];
  usage: string;
}

export default function DocPage(props: ParentProps<DocPageProps>) {
  const [hash, setHash] = createSignal(window.location.hash.slice(1));
  const sections = [
    { id: 'description', title: 'Description' },
    { id: 'usage', title: 'Usage' },
    { id: 'props', title: 'Props' },
    { id: 'examples', title: 'Examples' },
  ];

  createEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < 1) {
        return;
      }
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean);

      const exampleElements = props.examples
        ? props.examples
            .map((example) =>
              document.getElementById(
                example.title.toLocaleLowerCase().replace(/\s+/g, '-'),
              ),
            )
            .filter(Boolean)
        : [];

      const allElements = [...sectionElements, ...exampleElements];

      let bestElement = null;
      let bestDistanceFromTop = Infinity;

      for (const element of allElements) {
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom - 56; // Subtract the height of the header

        const isVisible = elementBottom > 0 && elementTop < window.innerHeight;

        if (isVisible) {
          const distanceFromTop = elementBottom;
          if (distanceFromTop > 0 && distanceFromTop < bestDistanceFromTop) {
            bestDistanceFromTop = distanceFromTop;
            bestElement = element;
            break;
          }
        }
      }

      for (let i = allElements.length - 1; i >= 0; i--) {
        const element = allElements[i];
        if (element && element === bestElement) {
          const newHash = element.id;
          if (newHash !== hash()) {
            setHash(newHash);
            history.replaceState(null, '', `#${newHash}`);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

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
            <div innerHTML={formatCodeToHTML(props.usage)} />
          </section>
        </Show>

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
                <For each={props.props}>
                  {(prop) => (
                    <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {prop.name}
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

        <Show when={props.examples}>
          <section id="examples" class="mb-8 scroll-mt-20">
            <h2 class="mb-4 text-2xl font-medium">Examples</h2>
            <div class="space-y-6">
              <For each={props.examples}>
                {(example) => (
                  <div
                    id={example.title.toLocaleLowerCase().replace(/\s+/g, '-')}
                    class="scroll-mt-16"
                  >
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

      <div class="max-xl:hidden">
        <div class="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden px-6 pt-10 pb-24">
          <div class="flex flex-col gap-3">
            <h3 class="font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase sm:text-xs/6 dark:text-gray-400">
              On this page
            </h3>
            <ul class="flex flex-col gap-2 border-l border-[color-mix(in_oklab,_var(--color-gray-950),white_90%)] dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
              <For each={sections}>
                {(section) => (
                  <li class="-ml-px flex flex-col items-start gap-2">
                    <a
                      aria-current={section.id === hash() ? 'location' : undefined}
                      onClick={() => {
                        setHash(`${section.id}`);
                      }}
                      href={`#${section.id}`}
                      class="inline-block border-l border-transparent pl-5 text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 sm:pl-4 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white dark:aria-[current]:border-white dark:aria-[current]:text-white"
                    >
                      {section.title}
                    </a>
                    {section.id === 'examples' && props.examples && (
                      <ul class="flex flex-col gap-2 border-l border-transparent dark:border-[color-mix(in_oklab,_var(--color-gray-950),white_20%)]">
                        <For each={props.examples}>
                          {(example) => {
                            const exampleHash = example.title
                              .toLocaleLowerCase()
                              .replace(/\s+/g, '-');
                            return (
                              <li class="-ml-px flex flex-col items-start gap-2">
                                <a
                                  aria-current={
                                    exampleHash === hash() ? 'location' : undefined
                                  }
                                  onClick={() => {
                                    setHash(exampleHash);
                                  }}
                                  href={`#${exampleHash}`}
                                  class="inline-block border-l border-transparent pl-8 text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 sm:pl-7.5 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white dark:aria-[current]:border-white dark:aria-[current]:text-white"
                                >
                                  {example.title}
                                </a>
                              </li>
                            );
                          }}
                        </For>
                      </ul>
                    )}
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

function Example(props: ExampleProps) {
  const [isDarkMode, setIsDarkMode] = createSignal(false);

  return (
    <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 class="text-xl font-medium">{props.title}</h3>
        <button
          onClick={() => setIsDarkMode(!isDarkMode())}
          class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Show when={isDarkMode()} fallback={<MoonIcon />}>
            <SunIcon />
          </Show>
        </button>
      </div>
      <div class={isDarkMode() ? 'dark' : ''}>
        <div class="bg-white px-4 py-6 dark:bg-gray-800">
          <Show when={props.description}>
            <p class="mb-4 text-gray-700 dark:text-gray-300">{props.description}</p>
          </Show>
          <div class="flex flex-wrap items-center gap-2">{props.component()}</div>
        </div>
      </div>
      <div class="border-t border-gray-200" innerHTML={formatCodeToHTML(props.code)} />
    </div>
  );
}
