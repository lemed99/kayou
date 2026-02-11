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
          default: '{ increase: "Increase value", decrease: "Decrease value" }',
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
      playground={`
        import { TextInput } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex flex-col gap-6 w-72">
              {/* With label and helper text */}
              <TextInput
                label="Email Address"
                placeholder="you@example.com"
                helperText="We'll never share your email."
              />

              {/* With addon */}
              <TextInput addon="https://" placeholder="example.com" />
            </div>
          );
        }
      `}
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
