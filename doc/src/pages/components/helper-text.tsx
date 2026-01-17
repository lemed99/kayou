import HelperText from '@lib/components/HelperText';
import DocPage from '../../components/DocPage';

export default function HelperTextPage() {
  return (
    <DocPage
      title="HelperText"
      description="A companion text component that provides contextual guidance, validation feedback, or additional information for form fields. HelperText appears below inputs to explain requirements, show validation errors, or offer helpful tips without cluttering the main interface. The component supports five semantic color variants that visually communicate message importance: gray for neutral hints, info for informational notes, success for valid states, warning for caution, and failure for errors. When used consistently, helper text creates a predictable pattern where users know exactly where to look for guidance."
      keyConcepts={[
        {
          term: 'Semantic Colors',
          explanation:
            'Color variants map to message intent: gray for passive hints, info for contextual information, success for valid input confirmation, warning for potential issues, and failure for blocking errors.',
        },
        {
          term: 'Form Integration',
          explanation:
            'Position helper text immediately below its associated input for clear visual association. The text should be concise and actionable, telling users what they need to know or do.',
        },
        {
          term: 'Accessibility Pairing',
          explanation:
            'For screen readers, pair HelperText with aria-describedby on the input element so the helper content is announced when users focus the field.',
        },
      ]}
      value="Clear helper text reduces form errors and support requests by preventing mistakes before they happen. Validation messages that explain what went wrong and how to fix it lead to faster form completion and lower abandonment rates, directly impacting conversion and user satisfaction."
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
      usage={`import { HelperText } from '@exowpee/the_rock';

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
