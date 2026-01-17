import { createSignal } from 'solid-js';

import Checkbox from '@lib/components/Checkbox';
import DocPage from '../../components/DocPage';

export default function CheckboxPage() {
  const [checked1, setChecked1] = createSignal(false);
  const [checked2, setChecked2] = createSignal(true);

  return (
    <DocPage
      title="Checkbox"
      description="A binary input component for toggling options on or off. Checkboxes are fundamental form elements that allow users to make selections from multiple options or to confirm agreement with terms. This component provides integrated label support with flexible positioning, color variants for visual distinction, and full accessibility through auto-generated unique IDs that properly associate labels with inputs. Built on the native input element, it inherits browser focus management and keyboard support while adding consistent styling across platforms."
      keyConcepts={[
        {
          term: 'Label Association',
          explanation:
            'Labels are automatically linked to checkboxes via generated IDs, ensuring clicking the label toggles the checkbox. This larger click target improves usability, especially on touch devices.',
        },
        {
          term: 'Controlled vs Uncontrolled',
          explanation:
            'Use the checked prop with onChange for controlled mode where you manage state. Without checked, the checkbox manages its own state internally.',
        },
        {
          term: 'Accessibility',
          explanation:
            'Built on native input[type="checkbox"], inheriting keyboard navigation (Space to toggle), focus indicators, and screen reader announcements without additional ARIA attributes.',
        },
      ]}
      value="Checkboxes are critical for data collection, settings management, and legal compliance (terms acceptance). Consistent checkbox behavior reduces form abandonment by making selection states immediately clear and interactions predictable across the application."
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
      examples={[
        {
          title: 'Basic Checkbox',
          description: 'Simple checkbox with label.',
          code: `<Checkbox label="Accept terms and conditions" />`,
          component: () => (
            <Checkbox
              label="Accept terms and conditions"
              checked={checked1()}
              onChange={(e) => setChecked1(e.target.checked)}
            />
          ),
        },
        {
          title: 'Color Variants',
          description: 'Blue and dark color options.',
          code: `<Checkbox label="Blue checkbox" color="blue" checked />
<Checkbox label="Dark checkbox" color="dark" checked />`,
          component: () => (
            <div class="flex flex-col gap-2">
              <Checkbox label="Blue checkbox" color="blue" checked />
              <Checkbox label="Dark checkbox" color="dark" checked />
            </div>
          ),
        },
        {
          title: 'Label Position',
          description: 'Label can be positioned left or right.',
          code: `<Checkbox label="Label on right" labelPosition="right" />
<Checkbox label="Label on left" labelPosition="left" />`,
          component: () => (
            <div class="flex flex-col gap-2">
              <Checkbox label="Label on right" labelPosition="right" />
              <Checkbox label="Label on left" labelPosition="left" />
            </div>
          ),
        },
        {
          title: 'Disabled State',
          description: 'Checkbox in disabled state.',
          code: `<Checkbox label="Disabled unchecked" disabled />
<Checkbox label="Disabled checked" disabled checked />`,
          component: () => (
            <div class="flex flex-col gap-2">
              <Checkbox label="Disabled unchecked" disabled />
              <Checkbox label="Disabled checked" disabled checked />
            </div>
          ),
        },
      ]}
      usage={`import { Checkbox } from '@exowpee/the_rock';

// Basic usage
<Checkbox label="Remember me" />

// Controlled checkbox
const [checked, setChecked] = createSignal(false);
<Checkbox
  label="Subscribe to newsletter"
  checked={checked()}
  onChange={(e) => setChecked(e.target.checked)}
/>

// With color variant
<Checkbox label="Dark theme" color="dark" />

// Label on the left
<Checkbox label="Enable feature" labelPosition="left" />`}
    />
  );
}
