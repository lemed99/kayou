import { Spinner } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function SpinnerPage() {
  return (
    <DocPage
      title="Spinner"
      description="Animated loading indicator with eight color variants and three sizes."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Indeterminate Loading',
          explanation:
            'Shows ongoing work without progress; use when duration is unknown.',
        },
        {
          term: 'Context Matching',
          explanation:
            '"light" for dark buttons, "info" for primary, semantic colors for status.',
        },
        {
          term: 'Size Selection',
          explanation: 'xs for buttons, sm for general use, md for page-level loading.',
        },
      ]}
      props={[
        {
          name: 'color',
          type: '"gray" | "dark" | "failure" | "info" | "light" | "success" | "warning" | "blue"',
          default: '"info"',
          description: 'Color variant of the spinner',
        },
        {
          name: 'size',
          type: '"xs" | "sm" | "md"',
          default: '"sm"',
          description: 'Size of the spinner',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<SpinnerAriaLabels>',
          default: 'DEFAULT_SPINNER_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'SpinnerAriaLabels',
          kind: 'type',
          description: 'Aria labels for the Spinner component',
          props: [
            {
              name: 'loading',
              type: 'string',
              default: '"Loading..."',
              description: 'Label for the loading spinner',
            },
          ],
        },
      ]}
      examples={[
        {
          title: 'Default Spinner',
          description: 'Default info-colored spinner.',
          component: () => <Spinner />,
        },
        {
          title: 'Color Variants',
          description: 'All available color options.',
          component: () => (
            <div class="flex items-center gap-4">
              <Spinner color="info" />
              <Spinner color="success" />
              <Spinner color="warning" />
              <Spinner color="failure" />
              <Spinner color="gray" />
              <Spinner color="dark" />
            </div>
          ),
        },
        {
          title: 'Sizes',
          description: 'Three size options: xs, sm, and md.',
          component: () => (
            <div class="flex items-center gap-4">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
            </div>
          ),
        },
        {
          title: 'Button Loading State',
          description: 'Common use case inside a button.',
          component: () => (
            <button class="flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white">
              <Spinner size="xs" color="light" />
              Loading...
            </button>
          ),
        },
        {
          title: 'Full Page Loading',
          description: 'Centered spinner for page loading states.',
          component: () => (
            <div class="flex h-32 items-center justify-center rounded border border-gray-200 dark:border-neutral-600">
              <Spinner size="md" />
            </div>
          ),
        },
      ]}
      usage={`
        import { Spinner } from '@kayou/ui';

        <Spinner />
        <Spinner color="success" size="md" />
        <Spinner size="xs" color="light" />
      `}
    />
  );
}
