
import { Textarea } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function TextareaPage() {

  return (
    <DocPage
      title="Textarea"
      description="Multi-line text input with integrated labels, validation states, and loading indicator. Supports resize handles and spell checking."
      keyConcepts={[
        {
          term: 'Integrated Field Components',
          explanation:
            'Label and HelperText are built in via props, ensuring consistent spacing, proper ID association for accessibility, and coordinated color states across the field.',
        },
        {
          term: 'Validation States',
          explanation:
            'Five color variants (gray, info, success, warning, failure) provide visual feedback. Each state affects the border, label, and helper text colors simultaneously.',
        },
        {
          term: 'Loading State',
          explanation:
            'The isLoading prop displays a spinner, useful during async validation, AI content generation, or when submitting data. The textarea is not disabled, allowing users to continue editing.',
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
          code: `<Textarea
  label="Description"
  placeholder="Enter description..."
/>`,
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
          code: `<Textarea
  label="Bio"
  helperText="Write a short bio about yourself"
  placeholder="Tell us about yourself..."
/>`,
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
          code: `<Textarea label="Success" color="success" helperText="Looks good!" />
<Textarea label="Warning" color="warning" helperText="Consider revising" />
<Textarea label="Error" color="failure" helperText="This field is required" />`,
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
          code: `<Textarea
  label="Message"
  required
  placeholder="Enter your message..."
/>`,
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
          code: `<Textarea
  label="Comments"
  isLoading
/>`,
          component: () => <Textarea label="Comments" isLoading class="w-full" />,
        },
        {
          title: 'Disabled State',
          description: 'Disabled textarea.',
          code: `<Textarea
  label="Notes"
  disabled
  value="Cannot edit this"
/>`,
          component: () => (
            <Textarea label="Notes" disabled value="Cannot edit this" class="w-full" />
          ),
        },
      ]}
      usage={`import { Textarea } from '@exowpee/solidly';

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
<Textarea label="Message" required />`}
    />
  );
}
