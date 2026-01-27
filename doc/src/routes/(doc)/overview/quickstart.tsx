/* eslint-disable solid/no-innerhtml */
import ArticlePage from '../../../components/ArticlePage';
import { formatCodeToHTML } from '../../../helpers/formatCodeToHTML';

const installCode = `npm install @kayou/ui`;

const usageCode = `import { Button, Modal, useToggle } from '@kayou/ui';

function App() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <>
      <Button onClick={toggle}>Open Modal</Button>
      <Modal open={isOpen()} onClose={toggle}>
        <Modal.Header>Welcome to Kayou!</Modal.Header>
        <Modal.Body>
          Your enterprise-grade SolidJS component library.
        </Modal.Body>
      </Modal>
    </>
  );
}`;

const iconUsageCode = `import { ArrowRightIcon, CheckIcon } from '@kayou/icons';

function MyComponent() {
  return (
    <button class="flex items-center gap-2">
      Continue <ArrowRightIcon class="size-5" />
    </button>
  );
}`;

export default function QuickstartPage() {
  return (
    <ArticlePage
      title="Quickstart"
      description="Get up and running with Kayou in under 5 minutes."
    >
      {/* Prerequisites */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">
          Prerequisites
        </h2>
        <ul class="mt-4 list-inside list-disc space-y-2 text-gray-600 dark:text-neutral-400">
          <li>
            <strong class="text-gray-950 dark:text-white">Node.js 18+</strong> - We
            recommend the latest LTS version
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
        <p class="mt-4 text-gray-600 dark:text-neutral-400">
          Install Kayou using your preferred package manager:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
          <div innerHTML={formatCodeToHTML(installCode)} />
        </div>
      </section>

      {/* Basic Usage */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Basic Usage</h2>
        <p class="mt-4 text-gray-600 dark:text-neutral-400">
          Import components and hooks directly from the package:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
          <div innerHTML={formatCodeToHTML(usageCode)} />
        </div>
      </section>

      {/* Icons */}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">Using Icons</h2>
        <p class="mt-4 text-gray-600 dark:text-neutral-400">
          Kayou includes a comprehensive icon library. Import icons from the dedicated
          icons path:
        </p>
        <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
          <div innerHTML={formatCodeToHTML(iconUsageCode)} />
        </div>
      </section>
    </ArticlePage>
  );
}
