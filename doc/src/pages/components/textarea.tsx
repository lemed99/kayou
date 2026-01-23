import { Textarea } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

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
          explanation: 'Spinner during async operations; textarea remains editable.',
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
      examples={[
        {
          title: 'Basic Textarea',
          description: 'Simple textarea with label.',
          component: () => (
            <Textarea
              label="Description"
              placeholder="Enter description..."
              class="w-full"
            />
          ),
        },
        {
          title: 'With Helper Text',
          description: 'Textarea with helper text below.',
          component: () => (
            <Textarea
              label="Bio"
              helperText="Write a short bio about yourself"
              placeholder="Tell us about yourself..."
              class="w-full"
            />
          ),
        },
        {
          title: 'Color Variants',
          description: 'Different color states for validation.',
          component: () => (
            <div class="flex flex-col gap-4">
              <Textarea
                label="Success"
                color="success"
                helperText="Looks good!"
                value="Valid content"
                class="w-full"
              />
              <Textarea
                label="Warning"
                color="warning"
                helperText="Consider revising"
                class="w-full"
              />
              <Textarea
                label="Error"
                color="failure"
                helperText="This field is required"
                class="w-full"
              />
            </div>
          ),
        },
        {
          title: 'Required Field',
          description: 'Textarea marked as required.',
          component: () => (
            <Textarea
              label="Message"
              required
              placeholder="Enter your message..."
              class="w-full"
            />
          ),
        },
        {
          title: 'Loading State',
          description: 'Textarea in loading state.',
          component: () => <Textarea label="Comments" isLoading class="w-full" />,
        },
        {
          title: 'Disabled State',
          description: 'Disabled textarea.',
          component: () => (
            <Textarea label="Notes" disabled value="Cannot edit this" class="w-full" />
          ),
        },
      ]}
      usage={`
        import { Textarea } from '@exowpee/solidly';

        // Basic usage
        <Textarea label="Description" placeholder="Enter description..." />

        // With helper text
        <Textarea
          label="Bio"
          helperText="Maximum 500 characters"
          placeholder="Write your bio..."
        />

        // Controlled textarea
        const [value, setValue] = createSignal('');
        <Textarea
          label="Comments"
          value={value()}
          onInput={(e) => setValue(e.target.value)}
        />

        // Validation states
        <Textarea label="Valid" color="success" helperText="Looks good!" />
        <Textarea label="Error" color="failure" helperText="Required field" />

        // Loading state
        <Textarea label="Loading" isLoading />

        // Required field
        <Textarea label="Message" required />
      `}
    />
  );
}
