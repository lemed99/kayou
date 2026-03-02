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
          type: '"info" | "danger" | "theme" | "anti-theme" | "transparent',
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
      playground={`
        import { Spinner } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex flex-col gap-6">
              {/* Color variants */}
              <div>
                <h3 class="mb-2 font-semibold">Color Variants</h3>
                <div class="flex items-center gap-4">
                  <Spinner color="info" />
                  <Spinner color="danger" />
                  <Spinner color="theme" />
                  <Spinner color="anti-theme" />
                  <Spinner color="transparent" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 class="mb-2 font-semibold">Sizes</h3>
                <div class="flex items-center gap-4">
                  <Spinner size="xs" />
                  <Spinner size="sm" />
                  <Spinner size="md" />
                </div>
              </div>
            </div>
          );
        }
      `}
      usage={`
        import { Spinner } from '@kayou/ui';

        <Spinner />
        <Spinner color="success" size="md" />
        <Spinner size="xs" color="light" />
      `}
    />
  );
}
