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
      keyConcepts={[
        {
          term: 'Immediate vs Deferred Action',
          explanation:
            'Use toggle switches for settings that apply immediately (dark mode, notifications). Use checkboxes when the selection will be submitted later as part of a form.',
        },
        {
          term: 'Semantic Colors',
          explanation:
            'Color variants can reinforce meaning: success (green) for enabling features, failure (red) for destructive toggles, or simply blue as a neutral default.',
        },
        {
          term: 'Form Integration',
          explanation:
            'When the name prop is provided, a hidden checkbox is rendered so the toggle value can be submitted in traditional HTML forms without JavaScript handling.',
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
          code: `const [checked, setChecked] = createSignal(false);

<ToggleSwitch
  label="Enable notifications"
  checked={checked()}
  onChange={setChecked}
/>`,
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
          code: `<ToggleSwitch label="Blue (default)" color="blue" checked onChange={() => {}} />
<ToggleSwitch label="Success" color="success" checked onChange={() => {}} />
<ToggleSwitch label="Warning" color="warning" checked onChange={() => {}} />
<ToggleSwitch label="Failure" color="failure" checked onChange={() => {}} />
<ToggleSwitch label="Dark" color="dark" checked onChange={() => {}} />
<ToggleSwitch label="Gray" color="gray" checked onChange={() => {}} />`,
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
          code: `<ToggleSwitch label="Disabled off" checked={false} disabled onChange={() => {}} />
<ToggleSwitch label="Disabled on" checked disabled onChange={() => {}} />`,
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
          code: `<div class="flex flex-col gap-4">
  <ToggleSwitch label="Dark mode" checked={darkMode()} onChange={setDarkMode} />
  <ToggleSwitch label="Email notifications" checked={email()} onChange={setEmail} />
  <ToggleSwitch label="Push notifications" checked={push()} onChange={setPush} />
</div>`,
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
      usage={`import { ToggleSwitch } from '@exowpee/solidly';

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
/>`}
    />
  );
}
