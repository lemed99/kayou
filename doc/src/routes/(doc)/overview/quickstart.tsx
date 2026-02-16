import { For, Suspense, createSignal, lazy } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import BaseDocPage from '../../../components/BaseDocPage';

const ReadonlyCode = lazy(() => import('../../../components/ReadonlyCode'));

const packageManagers = [
  { name: 'npm', command: 'npm install @kayou/ui' },
  { name: 'pnpm', command: 'pnpm add @kayou/ui' },
  { name: 'yarn', command: 'yarn add @kayou/ui' },
  { name: 'bun', command: 'bun add @kayou/ui' },
];

const usageCode = `import { Button, Modal } from '@kayou/ui';
import { createSignal } from 'solid-js';

function App() {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        show={isOpen()}
        onClose={() => setIsOpen(false)}
        title="Welcome to Kayou!"
      >
        Your enterprise-grade SolidJS component library.
      </Modal>
    </>
  );
}`;

const iconStandaloneCode = `import { ArrowRightIcon, InfoCircleIcon } from '@kayou/icons';

// Use icons directly in your JSX
<ArrowRightIcon class="size-5" />
<InfoCircleIcon class="size-5 text-blue-500" strokeWidth={2} />`;

const iconWithComponentCode = `import { Button, Alert } from '@kayou/ui';
import { PlusIcon, CheckCircleIcon } from '@kayou/icons';

// Pass icons as props to components
<Button icon={PlusIcon}>Create</Button>
<Button icon={ArrowRightIcon} iconPlacement="right">Next</Button>

<Alert color="success" icon={CheckCircleIcon}>
  Operation completed successfully.
</Alert>`;

const hooksUsageCode = `import { useMutation } from '@kayou/hooks';

function CreatePost() {
  const { trigger, isMutating } = useMutation({
    urlString: '/api/posts',
    options: {
      fetcher: async (url, data) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return res.json();
      },
      onSuccess: () => console.log('Post created!'),
    },
  });

  return (
    <Button
      onClick={() => trigger({ title: 'Hello' })}
      loading={isMutating()}
    >
      Create Post
    </Button>
  );
}`;

const hooksIntlCode = `import { useIntl } from '@kayou/hooks';

function PriceTag(props) {
  const intl = useIntl();

  return (
    <span>
      {intl.formatNumber(props.amount, {
        style: 'currency',
        currency: 'USD',
      })}
    </span>
  );
}`;

function CodeFallback(props: { code: string }) {
  return (
    <pre class="overflow-auto bg-[#282c34] p-3 font-mono text-xs text-[#abb2bf]">
      <code>{props.code}</code>
    </pre>
  );
}

function InstallSection() {
  const [active, setActive] = createSignal(0);

  return (
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">Installation</h2>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">
        Install Kayou using your preferred package manager:
      </p>
      <div class="mt-4 overflow-hidden rounded-xl bg-[#282c34]">
        <div class="flex border-b border-white/10">
          <For each={packageManagers}>
            {(pm, i) => (
              <button
                type="button"
                onClick={() => setActive(i())}
                class={twMerge(
                  'px-4 py-2 text-xs font-medium transition-colors',
                  active() === i()
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:text-white',
                )}
              >
                {pm.name}
              </button>
            )}
          </For>
        </div>
        <pre class="px-4 py-3 font-mono text-xs text-white">
          {packageManagers[active()].command}
        </pre>
      </div>
      <p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
        This automatically installs <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">@kayou/hooks</code> and <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">@kayou/icons</code> as dependencies.
      </p>
    </section>
  );
}

export default function QuickstartPage() {
  return (
    <BaseDocPage
      title="Quickstart"
      description="Get up and running with Kayou in under 5 minutes."
    >
      {/* Prerequisites */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">
          Prerequisites
        </h2>
        <ul class="mt-4 list-inside list-disc space-y-2 text-neutral-600 dark:text-neutral-400">
          <li>
            <strong class="text-neutral-950 dark:text-white">Node.js 18+</strong> - We
            recommend the latest LTS version
          </li>
          <li>
            <strong class="text-neutral-950 dark:text-white">SolidJS 1.8+</strong> - Our
            components are built for SolidJS
          </li>
          <li>
            <strong class="text-neutral-950 dark:text-white">TailwindCSS 3.4+</strong> - For
            styling (optional but recommended)
          </li>
        </ul>
      </section>

      {/* Installation */}
      <InstallSection />

      {/* Basic Usage */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">Basic Usage</h2>
        <p class="mt-4 text-neutral-600 dark:text-neutral-400">
          Import components and hooks directly from the package:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <Suspense fallback={<CodeFallback code={usageCode} />}>
            <ReadonlyCode code={usageCode} />
          </Suspense>
        </div>
      </section>

      {/* Icons */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">Using Icons</h2>
        <p class="mt-4 text-neutral-600 dark:text-neutral-400">
          Kayou ships with a comprehensive icon library. Icons are SolidJS components that accept{' '}
          <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">class</code>{' '}
          and{' '}
          <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">strokeWidth</code>{' '}
          props.
        </p>

        <h3 class="mt-6 text-lg font-medium text-neutral-950 dark:text-white">Standalone</h3>
        <div class="mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <Suspense fallback={<CodeFallback code={iconStandaloneCode} />}>
            <ReadonlyCode code={iconStandaloneCode} />
          </Suspense>
        </div>

        <h3 class="mt-6 text-lg font-medium text-neutral-950 dark:text-white">With components</h3>
        <p class="mt-2 text-neutral-600 dark:text-neutral-400">
          Many components accept an{' '}
          <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">icon</code>{' '}
          prop. Pass the icon component reference directly — no need to render it yourself.
        </p>
        <div class="mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <Suspense fallback={<CodeFallback code={iconWithComponentCode} />}>
            <ReadonlyCode code={iconWithComponentCode} />
          </Suspense>
        </div>
      </section>

      {/* Hooks */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-neutral-950 dark:text-white">Using Hooks</h2>
        <p class="mt-4 text-neutral-600 dark:text-neutral-400">
          Kayou provides utility hooks for common tasks like data mutation, internationalization, toasts, and floating UI positioning.
        </p>

        <h3 class="mt-6 text-lg font-medium text-neutral-950 dark:text-white">Data mutation</h3>
        <div class="mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <Suspense fallback={<CodeFallback code={hooksUsageCode} />}>
            <ReadonlyCode code={hooksUsageCode} />
          </Suspense>
        </div>

        <h3 class="mt-6 text-lg font-medium text-neutral-950 dark:text-white">Internationalization</h3>
        <div class="mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <Suspense fallback={<CodeFallback code={hooksIntlCode} />}>
            <ReadonlyCode code={hooksIntlCode} />
          </Suspense>
        </div>
      </section>
    </BaseDocPage>
  );
}
