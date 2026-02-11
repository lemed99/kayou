import DocPage from '../../../components/DocPage';

export default function CheckboxPage() {
  return (
    <DocPage
      title="Checkbox"
      description="Binary input with integrated labels, flexible positioning, and color variants."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Label Association',
          explanation: 'Clicking label toggles checkbox via auto-linked IDs.',
        },
        {
          term: 'Controlled vs Uncontrolled',
          explanation: 'Use checked + onChange for controlled mode.',
        },
        {
          term: 'Accessibility',
          explanation: 'Native checkbox with Space key toggle and screen reader support.',
        },
      ]}
      props={[
        {
          name: 'label',
          type: 'JSX.Element',
          default: '-',
          description: 'Label text or element for the checkbox',
        },
        {
          name: 'labelPosition',
          type: '"left" | "right"',
          default: '"right"',
          description: 'Position of the label relative to the checkbox',
        },
        {
          name: 'labelClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the label wrapper',
        },
        {
          name: 'labelSpanClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the label text span',
        },
        {
          name: 'color',
          type: '"blue" | "dark"',
          default: '"blue"',
          description: 'Color variant for the checked state',
        },
        {
          name: 'checked',
          type: 'boolean',
          default: 'false',
          description: 'Whether the checkbox is checked',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Whether the checkbox is disabled',
        },
      ]}
      playground={`
        import { Checkbox } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [checked, setChecked] = createSignal(false);

          return (
            <Checkbox
              label="Accept terms and conditions"
              checked={checked()}
              onChange={(e) => setChecked(e.target.checked)}
            />
          );
        }
      `}
      usage={`
        import { Checkbox } from '@kayou/ui';

        <Checkbox label="Remember me" />
        <Checkbox label="Dark theme" color="dark" checked />
        <Checkbox label="Enable feature" labelPosition="left" />
      `}
    />
  );
}
