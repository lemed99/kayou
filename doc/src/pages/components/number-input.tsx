import { createSignal } from 'solid-js';

import { NumberInput } from '@exowpee/solidly-pro';

import DocPage from '../../components/DocPage';

export default function NumberInputPage() {
  return (
    <DocPage
      title="NumberInput"
      isPro
      description="Numeric input with integer/float support, min/max constraints, step increments, and optional arrow buttons. Features debounced validation and typed callbacks."
      keyConcepts={[
        {
          term: 'Debounced Processing',
          explanation: 'Values processed after inactivity (2s default); set 0 for blur-only.',
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
      ]}
      examples={[
        {
          title: 'Basic Integer Input',
          description: 'Simple number input for integers.',
          code: `<NumberInput placeholder="Enter a number" />`,
          component: () => <NumberInput placeholder="Enter a number" />,
        },
        {
          title: 'With Arrow Buttons',
          description: 'Number input with increment/decrement buttons.',
          code: `<NumberInput showArrows placeholder="0" />`,
          component: () => <NumberInput showArrows placeholder="0" />,
        },
        {
          title: 'Float Input',
          description: 'Allows decimal values with configurable precision.',
          code: `<NumberInput
  type="float"
  precision={2}
  placeholder="0.00"
  label="Price"
/>`,
          component: () => (
            <NumberInput type="float" precision={2} placeholder="0.00" label="Price" />
          ),
        },
        {
          title: 'With Min and Max',
          description: 'Constrained to a specific range.',
          code: `<NumberInput
  min={0}
  max={100}
  showArrows
  label="Percentage"
  helperText="Value between 0 and 100"
/>`,
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
          code: `<NumberInput
  step={5}
  showArrows
  label="Quantity"
  helperText="Step by 5"
/>`,
          component: () => (
            <NumberInput step={5} showArrows label="Quantity" helperText="Step by 5" />
          ),
        },
        {
          title: 'Negative Values',
          description: 'Allows negative number input.',
          code: `<NumberInput
  allowNegativeValues
  showArrows
  label="Temperature"
  helperText="Can be negative"
/>`,
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
          code: `const [value, setValue] = createSignal<number | null>(null);

<NumberInput
  showArrows
  label="Quantity"
  value={value()?.toString() ?? ''}
  onValueChange={setValue}
  helperText={\`Numeric value: \${value()}\`}
/>`,
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
          code: `<NumberInput
  type="float"
  precision={4}
  step={0.0001}
  showArrows
  label="Coordinates"
/>`,
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
          code: `const [value, setValue] = createSignal<number | null>(null);
const [lastUpdate, setLastUpdate] = createSignal('');

<NumberInput
  type="float"
  precision={2}
  label="Debounced Input"
  onValueChange={(v) => {
    setValue(v);
    setLastUpdate(new Date().toLocaleTimeString());
  }}
  helperText={\`Value: \${value()} | Last update: \${lastUpdate()}\`}
/>`,
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
          code: `<NumberInput
  debounceDelay={1000}
  label="1 Second Delay"
  helperText="Processes after 1s of inactivity"
/>

<NumberInput
  debounceDelay={0}
  label="No Debounce"
  helperText="Only processes on blur"
/>`,
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
      usage={`import { NumberInput } from '@exowpee/solidly';

// Basic integer input
<NumberInput placeholder="Enter quantity" />

// With arrow buttons and constraints
<NumberInput
  showArrows
  min={0}
  max={100}
  step={5}
/>

// Float input with precision
<NumberInput
  type="float"
  precision={2}
  label="Price"
  placeholder="0.00"
/>

// With typed callback
const [quantity, setQuantity] = createSignal<number | null>(null);
<NumberInput
  showArrows
  onValueChange={setQuantity}
/>

// Allowing negative values
<NumberInput
  allowNegativeValues
  label="Temperature (°C)"
/>

// Custom debounce delay (1 second)
<NumberInput
  debounceDelay={1000}
  onValueChange={(v) => console.log('Value:', v)}
/>

// Disable debounce (process only on blur)
<NumberInput debounceDelay={0} />`}
    />
  );
}
