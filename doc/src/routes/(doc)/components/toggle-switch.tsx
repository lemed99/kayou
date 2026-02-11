import DocPage from '../../../components/DocPage';

export default function ToggleSwitchPage() {
  return (
    <DocPage
      title="ToggleSwitch"
      description="Binary toggle for instant on/off settings with smooth animation and six color variants."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Immediate vs Deferred Action',
          explanation:
            'Use toggles for instant settings; checkboxes for form submissions.',
        },
        {
          term: 'Semantic Colors',
          explanation: 'Six colors reinforce meaning: success, failure, warning, etc.',
        },
        {
          term: 'Form Integration',
          explanation: 'name prop renders hidden checkbox for HTML form submission.',
        },
      ]}
      props={[
        {
          name: 'checked',
          type: 'boolean',
          default: '-',
          description: 'Whether the switch is in the on state (required)',
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: 'Label text for the switch (required)',
        },
        {
          name: 'onChange',
          type: '(checked: boolean) => void',
          default: '-',
          description: 'Callback fired when the switch state changes (required)',
        },
        {
          name: 'color',
          type: '"blue" | "dark" | "failure" | "gray" | "success" | "warning"',
          default: '"blue"',
          description: 'Color variant of the switch when active',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Whether the switch is disabled',
        },
        {
          name: 'name',
          type: 'string',
          default: '-',
          description: 'Form input name for hidden checkbox',
        },
      ]}
      playground={`
        import { ToggleSwitch } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [enabled, setEnabled] = createSignal(false);

          return (
            <ToggleSwitch
              label="Enable notifications"
              checked={enabled()}
              onChange={setEnabled}
            />
          );
        }
      `}
      usage={`
        import { ToggleSwitch } from '@kayou/ui';

        <ToggleSwitch label="Enable feature" checked={enabled()} onChange={setEnabled} />
        <ToggleSwitch label="Active" color="success" checked={active()} onChange={setActive} />
        <ToggleSwitch label="Locked" checked disabled onChange={() => {}} />
      `}
    />
  );
}
