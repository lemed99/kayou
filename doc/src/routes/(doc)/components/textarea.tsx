import DocPage from '../../../components/DocPage';

export default function TextareaPage() {
  return (
    <DocPage
      title="Textarea"
      description="Multi-line text input with integrated labels, validation states, and loading indicator. Supports resize handles and spell checking."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Integrated Field Components',
          explanation:
            'Label and HelperText built in via props with coordinated styling.',
        },
        {
          term: 'Validation States',
          explanation:
            'Five colors affect border, label, and helper text simultaneously.',
        },
        {
          term: 'Loading State',
          explanation: 'Spinner overlay with disabled textarea during async operations.',
        },
      ]}
      props={[
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label displayed above the textarea',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the textarea',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant of the textarea',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Whether the textarea is in a loading state',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Whether the field is required (shows asterisk)',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Whether the textarea is disabled',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: 'Placeholder text',
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: 'Current value of the textarea',
        },
        {
          name: 'rows',
          type: 'number',
          default: '-',
          description: 'Number of visible text rows',
        },
      ]}
      playground={`
        import { Textarea } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="w-full">
              <Textarea
                label="Bio"
                helperText="Write a short bio about yourself"
                placeholder="Tell us about yourself..."
                rows={4}
                class="w-full"
              />
            </div>
          );
        }
      `}
      usage={`
        import { Textarea } from '@kayou/ui';

        <Textarea label="Description" placeholder="Enter description..." />
        <Textarea label="Bio" helperText="Maximum 500 characters" />
        <Textarea label="Error" color="failure" helperText="Required field" />
        <Textarea label="Message" required isLoading />
      `}
    />
  );
}
