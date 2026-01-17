import Spinner from '@lib/components/Spinner';
import DocPage from '../../components/DocPage';

export default function SpinnerPage() {
  return (
    <DocPage
      title="Spinner"
      description="An animated loading indicator for operations in progress. Spinners communicate that the system is working on a request, preventing users from thinking the interface is frozen. This component features a smooth CSS animation that performs well even on low-power devices, eight color variants to match different contexts and buttons, and three sizes for various use cases from inline button indicators to full-page loading states. The spinner includes screen reader text with role='status' so assistive technologies announce the loading state."
      keyConcepts={[
        {
          term: 'Indeterminate Loading',
          explanation:
            'Spinners indicate ongoing work without communicating progress or duration. Use them when you cannot predict how long an operation will take.',
        },
        {
          term: 'Context Matching',
          explanation:
            'Color variants let spinners blend with their context: use "light" inside dark buttons, "info" for primary actions, or semantic colors (success, failure) when the outcome is pending.',
        },
        {
          term: 'Size Selection',
          explanation:
            'Choose size based on context: xs for inline use in buttons or labels, sm as the default for general indicators, md for prominent full-section or page-level loading.',
        },
      ]}
      value="Loading feedback is crucial for user trust. Without visual indication, users may click repeatedly, navigate away, or assume errors. Spinners provide the minimum viable feedback for any asynchronous operation, maintaining user confidence and preventing duplicate submissions."
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
      ]}
      examples={[
        {
          title: 'Default Spinner',
          description: 'Default info-colored spinner.',
          code: `<Spinner />`,
          component: () => <Spinner />,
        },
        {
          title: 'Color Variants',
          description: 'All available color options.',
          code: `<Spinner color="info" />
<Spinner color="success" />
<Spinner color="warning" />
<Spinner color="failure" />
<Spinner color="gray" />
<Spinner color="dark" />`,
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
          code: `<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />`,
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
          code: `<button class="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white">
  <Spinner size="xs" color="light" />
  Loading...
</button>`,
          component: () => (
            <button class="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white">
              <Spinner size="xs" color="light" />
              Loading...
            </button>
          ),
        },
        {
          title: 'Full Page Loading',
          description: 'Centered spinner for page loading states.',
          code: `<div class="flex h-32 items-center justify-center">
  <Spinner size="md" />
</div>`,
          component: () => (
            <div class="flex h-32 items-center justify-center rounded border border-gray-200 dark:border-gray-600">
              <Spinner size="md" />
            </div>
          ),
        },
      ]}
      usage={`import { Spinner } from '@exowpee/the_rock';

// Basic usage
<Spinner />

// With color
<Spinner color="success" />

// With size
<Spinner size="md" />

// In a button
<Button disabled>
  <Spinner size="xs" color="light" />
  <span class="ml-2">Processing...</span>
</Button>

// Loading state
<Show when={loading()} fallback={<Content />}>
  <div class="flex justify-center">
    <Spinner size="md" />
  </div>
</Show>`}
    />
  );
}
