import { createSignal } from 'solid-js';

import { NumberInput } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function NumberInputPage() {
  return (
    <DocPage
      title="NumberInput"
      description="Numeric input with integer/float support, min/max constraints, step increments, and optional arrow buttons. Features debounced validation and typed callbacks."
      keyConcepts={[
        {
          term: 'Debounced Processing',
          explanation:
            'Values processed after inactivity (2s default); set 0 for blur-only.',
        },
        {
          term: 'Typed Callbacks',
          explanation: 'onValueChange returns number | null for type safety.',
        },
        {
          term: 'Constraint Enforcement',
          explanation: 'Min/max enforced on blur; step controls increments.',
        },
      ]}
      props={[
        {
          name: 'type',
          type: '"integer" | "float"',
          default: '"integer"',
          description: 'Number format: integer or floating-point',
        },
        {
          name: 'min',
          type: 'number',
          default: '-',
          description: 'Minimum allowed value',
        },
        {
          name: 'max',
          type: 'number',
          default: '-',
          description: 'Maximum allowed value',
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: 'Increment/decrement step amount',
        },
        {
          name: 'precision',
          type: 'number',
          default: '3',
          description: 'Decimal places for float type',
        },
        {
          name: 'showArrows',
          type: 'boolean',
          default: 'false',
          description: 'Shows up/down arrow buttons',
        },
        {
          name: 'nullable',
          type: 'boolean',
          default: 'true',
          description: 'Allows empty/null values',
        },
        {
          name: 'allowNegativeValues',
          type: 'boolean',
          default: 'false',
          description: 'Allows negative number input',
        },
        {
          name: 'onValueChange',
          type: '(value: number | null) => void',
          default: '-',
          description: 'Callback with typed numeric value',
        },
        {
          name: 'debounceDelay',
          type: 'number',
          default: '2000',
          description:
            'Delay in ms before processing value after typing. Set to 0 to disable.',
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
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant for styling',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<TextInputAriaLabels>',
          default: 'DEFAULT_TEXT_INPUT_ARIA_LABELS',
          description: 'Accessibility labels forwarded to underlying TextInput',
        },
      ]}
      examples={[
        {
          title: 'Basic Integer Input',
          description: 'Simple number input for integers.',
          component: () => <NumberInput placeholder="Enter a number" />,
        },
        {
          title: 'With Arrow Buttons',
          description: 'Number input with increment/decrement buttons.',
          component: () => <NumberInput showArrows placeholder="0" />,
        },
        {
          title: 'Float Input',
          description: 'Allows decimal values with configurable precision.',
          component: () => (
            <NumberInput type="float" precision={2} placeholder="0.00" label="Price" />
          ),
        },
        {
          title: 'With Min and Max',
          description: 'Constrained to a specific range.',
          component: () => (
            <NumberInput
              min={0}
              max={100}
              showArrows
              label="Percentage"
              helperText="Value between 0 and 100"
            />
          ),
        },
        {
          title: 'Custom Step',
          description: 'Increment by a custom step value.',
          component: () => (
            <NumberInput step={5} showArrows label="Quantity" helperText="Step by 5" />
          ),
        },
        {
          title: 'Negative Values',
          description: 'Allows negative number input.',
          component: () => (
            <NumberInput
              allowNegativeValues
              showArrows
              label="Temperature"
              helperText="Can be negative"
            />
          ),
        },
        {
          title: 'Controlled with onValueChange',
          description: 'Interactive example with typed numeric callback.',
          component: () => {
            const [value, setValue] = createSignal<number | null>(null);
            return (
              <NumberInput
                showArrows
                label="Quantity"
                value={value()?.toString() ?? ''}
                onValueChange={setValue}
                helperText={`Numeric value: ${value()}`}
              />
            );
          },
        },
        {
          title: 'Float with Custom Precision',
          description: 'Float input with 4 decimal places.',
          component: () => (
            <NumberInput
              type="float"
              precision={4}
              step={0.0001}
              showArrows
              label="Coordinates"
            />
          ),
        },
        {
          title: 'Debounced Value Processing',
          description:
            'Value is automatically processed after 2 seconds of inactivity. Type and wait to see the value format and emit.',
          component: () => {
            const [value, setValue] = createSignal<number | null>(null);
            const [lastUpdate, setLastUpdate] = createSignal('');
            return (
              <NumberInput
                type="float"
                precision={2}
                label="Debounced Input"
                onValueChange={(v) => {
                  setValue(v);
                  setLastUpdate(new Date().toLocaleTimeString());
                }}
                helperText={`Value: ${value()} | Last update: ${lastUpdate()}`}
              />
            );
          },
        },
        {
          title: 'Custom Debounce Delay',
          description: 'Set a custom delay (1 second) or disable debounce entirely.',
          component: () => (
            <div class="flex flex-col gap-4">
              <NumberInput
                debounceDelay={1000}
                label="1 Second Delay"
                helperText="Processes after 1s of inactivity"
              />
              <NumberInput
                debounceDelay={0}
                label="No Debounce"
                helperText="Only processes on blur"
              />
            </div>
          ),
        },
      ]}
      usage={`
        import { NumberInput } from '@kayou/ui';

        <NumberInput placeholder="Enter quantity" />
        <NumberInput showArrows min={0} max={100} step={5} />
        <NumberInput type="float" precision={2} label="Price" />
        <NumberInput allowNegativeValues label="Temperature" />
      `}
    />
  );
}
