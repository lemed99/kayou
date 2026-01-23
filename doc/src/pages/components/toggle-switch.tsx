import { createSignal } from 'solid-js';

import { ToggleSwitch } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function ToggleSwitchPage() {
  const [checked1, setChecked1] = createSignal(false);
  const [checked2, setChecked2] = createSignal(true);
  const [checked3, setChecked3] = createSignal(true);

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
      examples={[
        {
          title: 'Basic Toggle',
          description: 'Simple toggle switch.',
          component: () => (
            <ToggleSwitch
              label="Enable notifications"
              checked={checked1()}
              onChange={setChecked1}
            />
          ),
        },
        {
          title: 'Color Variants',
          description: 'Different color options when active.',
          component: () => (
            <div class="flex flex-col gap-4">
              <ToggleSwitch
                label="Blue (default)"
                color="blue"
                checked
                onChange={() => {}}
              />
              <ToggleSwitch label="Success" color="success" checked onChange={() => {}} />
              <ToggleSwitch label="Warning" color="warning" checked onChange={() => {}} />
              <ToggleSwitch label="Failure" color="failure" checked onChange={() => {}} />
              <ToggleSwitch label="Dark" color="dark" checked onChange={() => {}} />
              <ToggleSwitch label="Gray" color="gray" checked onChange={() => {}} />
            </div>
          ),
        },
        {
          title: 'Disabled State',
          description: 'Toggle in disabled state.',
          component: () => (
            <div class="flex flex-col gap-4">
              <ToggleSwitch
                label="Disabled off"
                checked={false}
                disabled
                onChange={() => {}}
              />
              <ToggleSwitch label="Disabled on" checked disabled onChange={() => {}} />
            </div>
          ),
        },
        {
          title: 'Settings Panel',
          description: 'Common use case in settings.',
          component: () => (
            <div class="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
              <ToggleSwitch
                label="Dark mode"
                checked={checked2()}
                onChange={setChecked2}
              />
              <ToggleSwitch
                label="Email notifications"
                checked={checked3()}
                onChange={setChecked3}
              />
              <ToggleSwitch
                label="Push notifications"
                checked={false}
                onChange={() => {}}
              />
            </div>
          ),
        },
      ]}
      usage={`
        import { ToggleSwitch } from '@exowpee/solidly';

        // Basic usage
        const [enabled, setEnabled] = createSignal(false);

        <ToggleSwitch
          label="Enable feature"
          checked={enabled()}
          onChange={setEnabled}
        />

        // With color variant
        <ToggleSwitch
          label="Active status"
          color="success"
          checked={active()}
          onChange={setActive}
        />

        // With form name (creates hidden checkbox)
        <ToggleSwitch
          label="Subscribe"
          name="subscribe"
          checked={subscribe()}
          onChange={setSubscribe}
        />

        // Disabled state
        <ToggleSwitch
          label="Locked setting"
          checked={true}
          disabled
          onChange={() => {}}
        />
      `}
    />
  );
}
