import { createSignal } from 'solid-js';

import { TextInput } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function TextInputPage() {
  return (
    <DocPage
      title="TextInput"
      description="Text input with labels, helper text, icons, addons, and validation states."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Validation States',
          explanation: 'Color prop shows status: success, warning, or failure.',
        },
        {
          term: 'Icons and Addons',
          explanation: 'Icons go inside; addons are external prefixes like "https://".',
        },
        {
          term: 'Accessibility',
          explanation: 'Labels and helper text are properly linked for screen readers.',
        },
      ]}
      props={[
        {
          name: 'sizing',
          type: '"xs" | "sm" | "md"',
          default: '"md"',
          description: 'Input size variant',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant for styling and validation states',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label text displayed above the input',
        },
        {
          name: 'helperText',
          type: 'string',
          default: '-',
          description: 'Helper text displayed below the input',
        },
        {
          name: 'icon',
          type: '(props: { class: string }) => JSX.Element',
          default: '-',
          description: 'Icon component rendered inside the input',
        },
        {
          name: 'addon',
          type: 'JSX.Element',
          default: '-',
          description: 'Addon element displayed before the input',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Shows loading spinner and disables input',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the input',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Marks the input as required with visual indicator',
        },
        {
          name: 'showArrows',
          type: 'boolean',
          default: 'false',
          description: 'Shows increment/decrement arrow buttons',
        },
        {
          name: 'fitContent',
          type: 'boolean',
          default: 'false',
          description: 'Adjusts input width to fit content',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<TextInputAriaLabels>',
          default: 'DEFAULT_TEXT_INPUT_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'TextInputAriaLabels',
          kind: 'type',
          description: 'Aria labels for the TextInput component',
          props: [
            {
              name: 'increase',
              type: 'string',
              default: '"Increase value"',
              description: 'Label for the increase arrow button',
            },
            {
              name: 'decrease',
              type: 'string',
              default: '"Decrease value"',
              description: 'Label for the decrease arrow button',
            },
          ],
        },
      ]}
      examples={[
        {
          title: 'Basic Input',
          description: 'Simple text input with placeholder.',
          component: () => <TextInput placeholder="Enter your name" />,
        },
        {
          title: 'With Label and Helper Text',
          description: 'Input with label above and helper text below.',
          component: () => (
            <TextInput
              label="Email Address"
              placeholder="you@example.com"
              helperText="We'll never share your email."
            />
          ),
        },
        {
          title: 'Size Variants',
          description: 'Three size options for different contexts.',
          component: () => (
            <>
              <TextInput sizing="xs" placeholder="Extra Small" />
              <TextInput sizing="sm" placeholder="Small" />
              <TextInput sizing="md" placeholder="Medium" />
            </>
          ),
        },
        {
          title: 'Validation States',
          description: 'Color variants to indicate validation status.',
          component: () => (
            <>
              <TextInput color="success" label="Success" value="Valid input" />
              <TextInput
                color="failure"
                label="Error"
                value="Invalid input"
                helperText="Please check this field"
              />
              <TextInput color="warning" label="Warning" value="Needs attention" />
            </>
          ),
        },
        {
          title: 'With Addon',
          description: 'Input with a prefix addon for context.',
          component: () => (
            <>
              <TextInput addon="https://" placeholder="example.com" />
              <TextInput addon="$" placeholder="0.00" />
            </>
          ),
        },
        {
          title: 'Loading State',
          description: 'Shows a spinner while loading.',
          component: () => <TextInput isLoading placeholder="Loading..." />,
        },
        {
          title: 'Disabled State',
          description: 'Input that cannot be interacted with.',
          component: () => <TextInput disabled value="Disabled input" />,
        },
        {
          title: 'Required Field',
          description: 'Input marked as required with visual indicator.',
          component: () => (
            <TextInput label="Username" required placeholder="Required field" />
          ),
        },
        {
          title: 'Controlled Input',
          description: 'Interactive example with controlled state.',
          component: () => {
            const [value, setValue] = createSignal('');
            return (
              <TextInput
                label="Controlled Input"
                value={value()}
                onInput={(e) => setValue(e.currentTarget.value)}
                helperText={`You typed: ${value()}`}
              />
            );
          },
        },
      ]}
      usage={`
        import { TextInput } from '@kayou/ui';

        <TextInput placeholder="Enter text" />
        <TextInput label="Email" helperText="We'll never share your email." />
        <TextInput color="failure" label="Password" helperText="Invalid password" />
        <TextInput addon="https://" placeholder="example.com" />
      `}
    />
  );
}
