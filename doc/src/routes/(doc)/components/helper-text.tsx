import DocPage from '../../../components/DocPage';

export default function HelperTextPage() {
  return (
    <DocPage
      title="HelperText"
      description="Form field guidance text with five semantic color variants for validation feedback."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Semantic Colors',
          explanation:
            'Gray for hints, success/failure for validation, warning for caution.',
        },
        {
          term: 'Form Integration',
          explanation: 'Position below input; keep text concise and actionable.',
        },
        {
          term: 'Accessibility Pairing',
          explanation: 'Use aria-describedby on input to announce helper on focus.',
        },
      ]}
      props={[
        {
          name: 'content',
          type: 'string',
          default: '-',
          description: 'The helper text content to display (required)',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant of the helper text',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes',
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Click handler (adds cursor-pointer style when provided)',
        },
      ]}
      playground={`
        import { HelperText } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="w-64">
              <input
                type="email"
                placeholder="Email"
                class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              />
              <HelperText content="We'll never share your email" />
            </div>
          );
        }
      `}
      usage={`
        import { HelperText } from '@kayou/ui';

        <HelperText content="Enter your full name" />
        <HelperText content="This field is required" color="failure" />
        <HelperText content="Email verified" color="success" />
      `}
    />
  );
}
