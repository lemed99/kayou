/* eslint-disable solid/no-innerhtml */
import ArticlePage from '../../components/ArticlePage';
import { formatCodeToHTML } from '../../helpers/formatCodeToHTML';

const installCode = `npm install @exowpee/solidly`;

const usageCode = `import { Button, Modal, useToggle } from '@exowpee/solidly';

function App() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <>
      <Button onClick={toggle}>Open Modal</Button>
      <Modal open={isOpen()} onClose={toggle}>
        <Modal.Header>Welcome to Solidly!</Modal.Header>
        <Modal.Body>
          Your enterprise-grade SolidJS component library.
        </Modal.Body>
      </Modal>
    </>
  );
}`;

const iconUsageCode = `import { ArrowRightIcon, CheckIcon } from '@exowpee/solidly/icons';

function MyComponent() {
  return (
    <button class="flex items-center gap-2">
      Continue <ArrowRightIcon class="size-5" />
    </button>
  );
}`;

export default function QuickstartPage() {
  const getTheme = () =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  return (
    <ArticlePage
      title="Quickstart"
      description="Get up and running with Solidly in under 5 minutes."
    >
      {/* Prerequisites */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Prerequisites</h2>
        <ul class="mt-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong class="text-gray-950 dark:text-white">Node.js 18+</strong> - We recommend
            the latest LTS version
          </li>
          <li>
            <strong class="text-gray-950 dark:text-white">SolidJS 1.8+</strong> - Our
            components are built for SolidJS
          </li>
          <li>
            <strong class="text-gray-950 dark:text-white">TailwindCSS 3.4+</strong> - For
            styling (optional but recommended)
          </li>
        </ul>
      </section>

      {/* Installation */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Installation</h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Install Solidly using your preferred package manager:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div innerHTML={formatCodeToHTML(installCode, getTheme())} />
        </div>
      </section>

      {/* Basic Usage */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Basic Usage</h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Import components and hooks directly from the package:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div innerHTML={formatCodeToHTML(usageCode, getTheme())} />
        </div>
      </section>

      {/* Icons */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Using Icons</h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Solidly includes a comprehensive icon library from Untitled UI. Import icons from
          the dedicated icons path:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div innerHTML={formatCodeToHTML(iconUsageCode, getTheme())} />
        </div>
      </section>

      {/* Next Steps */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Next Steps</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href="/components/button"
            class="group rounded-xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
          >
            <h3 class="font-semibold text-gray-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              Explore Components
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Browse our collection of production-ready components.
            </p>
          </a>
          <a
            href="/hooks"
            class="group rounded-xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
          >
            <h3 class="font-semibold text-gray-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              Discover Hooks
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Powerful hooks for real-world use cases.
            </p>
          </a>
          <a
            href="/icons"
            class="group rounded-xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
          >
            <h3 class="font-semibold text-gray-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              Browse Icons
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Over 1,000 beautiful SVG icons ready to use.
            </p>
          </a>
          <a
            href="/overview/why-solidly"
            class="group rounded-xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
          >
            <h3 class="font-semibold text-gray-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              Why Solidly?
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Learn what makes us different from other libraries.
            </p>
          </a>
        </div>
      </section>
    </ArticlePage>
  );
}
