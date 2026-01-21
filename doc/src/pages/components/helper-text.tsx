import { HelperText } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

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
          explanation: 'Gray for hints, success/failure for validation, warning for caution.',
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
      examples={[
        {
          title: 'Color Variants',
          description: 'Five color variants for different message types.',
          code: `<HelperText content="This is a neutral hint" color="gray" />
<HelperText content="This is informational" color="info" />
<HelperText content="This is a success message" color="success" />
<HelperText content="This is a warning" color="warning" />
<HelperText content="This is an error message" color="failure" />`,
          component: () => (
            <div class="flex flex-col gap-2">
              <HelperText content="This is a neutral hint" color="gray" />
              <HelperText content="This is informational" color="info" />
              <HelperText content="This is a success message" color="success" />
              <HelperText content="This is a warning" color="warning" />
              <HelperText content="This is an error message" color="failure" />
            </div>
          ),
        },
        {
          title: 'Form Field Example',
          description: 'Common usage below a form field.',
          code: `<div>
  <input type="email" placeholder="Email" class="..." />
  <HelperText content="We'll never share your email" />
</div>`,
          component: () => (
            <div class="w-64">
              <input
                type="email"
                placeholder="Email"
                class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700"
              />
              <HelperText content="We'll never share your email" />
            </div>
          ),
        },
        {
          title: 'Validation Messages',
          description: 'Using helper text for form validation feedback.',
          code: `<HelperText content="Password must be at least 8 characters" color="failure" />
<HelperText content="Email is valid" color="success" />`,
          component: () => (
            <div class="flex flex-col gap-2">
              <HelperText
                content="Password must be at least 8 characters"
                color="failure"
              />
              <HelperText content="Email is valid" color="success" />
            </div>
          ),
        },
      ]}
      usage={`import { HelperText } from '@exowpee/solidly';

// Basic usage
<HelperText content="Enter your full name" />

// With color for validation
<HelperText content="This field is required" color="failure" />

// Success message
<HelperText content="Email verified successfully" color="success" />

// Warning message
<HelperText content="This action cannot be undone" color="warning" />`}
    />
  );
}
